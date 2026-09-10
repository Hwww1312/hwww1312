"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { EXPOSURE } from "@/components/story/StoryCanvas";
import { resolveStory, storyState } from "@/lib/story/state";

/**
 * A small hand-rolled grade: bloom on highlights only, filmic tone mapping,
 * a lens vignette and a whisper of grain.
 *
 * It is written out rather than pulled from a post-processing library for two
 * reasons. The scene renders on a transparent canvas so the page's own
 * typography can sit behind the bowl, and an off-the-shelf bloom throws that
 * alpha away — here the composite carries the glow into the alpha channel
 * itself, so light spilling off the broth genuinely lights the page behind
 * it. And it keeps the whole grade to four small full-screen passes at half
 * resolution, which is a fraction of the cost of a general-purpose stack.
 *
 * Order matters: the scene is rendered into a half-float target with tone
 * mapping OFF, so the bright pass and the blur both work on real HDR values.
 * Tone mapping and the sRGB transfer happen once, at the very end. Bloom on
 * already-tone-mapped pixels is what makes cheap bloom look like fog.
 */

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/** Keep only what is genuinely brighter than the scene: no neon on midtones. */
const BRIGHT = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform float threshold;
  uniform float knee;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(tDiffuse, vUv);
    float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
    gl_FragColor = vec4(c.rgb * smoothstep(threshold, threshold + knee, l), 1.0);
  }
`;

/** Separable nine-tap gaussian, run twice at widening radii. */
const BLUR = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform vec2 direction;
  varying vec2 vUv;
  void main() {
    vec2 o1 = direction * 1.3846153846;
    vec2 o2 = direction * 3.2307692308;
    vec3 sum = texture2D(tDiffuse, vUv).rgb * 0.2270270270;
    sum += (texture2D(tDiffuse, vUv + o1).rgb + texture2D(tDiffuse, vUv - o1).rgb) * 0.3162162162;
    sum += (texture2D(tDiffuse, vUv + o2).rgb + texture2D(tDiffuse, vUv - o2).rgb) * 0.0702702703;
    gl_FragColor = vec4(sum, 1.0);
  }
`;

const COMPOSITE = /* glsl */ `
  uniform sampler2D tScene;
  uniform sampler2D tBloom;
  uniform float strength;
  uniform float exposure;
  uniform float vignette;
  uniform float grain;
  uniform float time;
  varying vec2 vUv;

  // Narkowicz's ACES fit: highlights roll off instead of clipping to white,
  // which is what keeps the broth reading as wet rather than blown out.
  vec3 aces(vec3 x) {
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec4 base = texture2D(tScene, vUv);
    vec3 bloom = texture2D(tBloom, vUv).rgb;
    vec3 col = (base.rgb + bloom * strength) * exposure;
    col = aces(col);

    float d = distance(vUv, vec2(0.5));
    col *= mix(1.0, smoothstep(0.95, 0.3, d), vignette);
    col += (hash(vUv * 1024.0 + time) - 0.5) * grain;
    col = clamp(col, 0.0, 1.0);

    // The glow has to reach the alpha channel too, or light spilling past the
    // silhouette would vanish against the page behind the canvas.
    float glow = dot(bloom, vec3(0.2126, 0.7152, 0.0722)) * strength;
    float alpha = clamp(base.a + glow, 0.0, 1.0);

    vec3 srgb = mix(
      col * 12.92,
      1.055 * pow(max(col, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
      step(vec3(0.0031308), col)
    );
    gl_FragColor = vec4(srgb, alpha);
  }
`;

function shader(fragment: string, uniforms: Record<string, THREE.IUniform>) {
  return new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: fragment,
    uniforms,
    depthTest: false,
    depthWrite: false,
    transparent: true,
  });
}

export function PostFX() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);

  const fx = useMemo(() => {
    const options: THREE.RenderTargetOptions = {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      stencilBuffer: false,
    };
    const sceneTarget = new THREE.WebGLRenderTarget(1, 1, options);
    const bloomA = new THREE.WebGLRenderTarget(1, 1, { ...options, depthBuffer: false });
    const bloomB = new THREE.WebGLRenderTarget(1, 1, { ...options, depthBuffer: false });

    const bright = shader(BRIGHT, {
      tDiffuse: { value: null },
      // The scene is rendered in HDR, so the threshold sits above white: only
      // the specular on the broth, the hot edge of the rim and the pool of
      // light behind the dish clear it. Anything lower and the whole bowl
      // starts to glow, which reads as fog rather than as a lens.
      threshold: { value: 1.15 },
      knee: { value: 0.6 },
    });
    const blur = shader(BLUR, {
      tDiffuse: { value: null },
      direction: { value: new THREE.Vector2() },
    });
    const composite = shader(COMPOSITE, {
      tScene: { value: sceneTarget.texture },
      tBloom: { value: bloomA.texture },
      strength: { value: 0.22 },
      exposure: { value: EXPOSURE },
      vignette: { value: 0.4 },
      grain: { value: 0.005 },
      time: { value: 0 },
    });

    return { sceneTarget, bloomA, bloomB, bright, blur, composite, quad: new FullScreenQuad() };
  }, []);

  useEffect(() => {
    const w = Math.max(1, Math.floor(size.width * dpr));
    const h = Math.max(1, Math.floor(size.height * dpr));
    fx.sceneTarget.setSize(w, h);
    fx.bloomA.setSize(Math.max(1, w >> 1), Math.max(1, h >> 1));
    fx.bloomB.setSize(Math.max(1, w >> 1), Math.max(1, h >> 1));
  }, [fx, size, dpr]);

  // The scene is rendered in HDR: tone mapping is the composite's job, and
  // doing it twice crushes the highlights the bloom is meant to find.
  useEffect(() => {
    const previous = gl.toneMapping;
    gl.toneMapping = THREE.NoToneMapping;
    storyState.grading = true;
    return () => {
      gl.toneMapping = previous;
      storyState.grading = false;
    };
  }, [gl]);

  useEffect(() => {
    const { sceneTarget, bloomA, bloomB, bright, blur, composite, quad } = fx;
    return () => {
      sceneTarget.dispose();
      bloomA.dispose();
      bloomB.dispose();
      bright.dispose();
      blur.dispose();
      composite.dispose();
      quad.dispose();
    };
  }, [fx]);

  useFrame(() => {
    const { sceneTarget, bloomA, bloomB, bright, blur, composite, quad } = fx;
    const { lighting } = resolveStory(storyState.progress, storyState.isMobile);

    const previousAutoClear = gl.autoClear;
    gl.autoClear = true;
    gl.setRenderTarget(sceneTarget);
    gl.setClearColor(0x000000, 0);
    gl.clear(true, true, true);
    gl.render(scene, camera);

    const w = bloomA.width;
    const h = bloomA.height;

    bright.uniforms.tDiffuse.value = sceneTarget.texture;
    quad.material = bright;
    gl.setRenderTarget(bloomA);
    quad.render(gl);

    // Two widening passes: a tight core with a soft halo around it, which is
    // how a real lens spills rather than the even smear a single pass gives.
    const passes: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget, number, number][] = [
      [bloomA, bloomB, 1, 0],
      [bloomB, bloomA, 0, 1],
      [bloomA, bloomB, 2.4, 0],
      [bloomB, bloomA, 0, 2.4],
    ];
    quad.material = blur;
    const direction = blur.uniforms.direction.value as THREE.Vector2;
    for (const [from, to, dx, dy] of passes) {
      blur.uniforms.tDiffuse.value = from.texture;
      direction.set(dx / w, dy / h);
      gl.setRenderTarget(to);
      quad.render(gl);
    }

    composite.uniforms.time.value = storyState.elapsed;
    // The grade shifts with the chapter: the editorial stretch pulls the
    // bloom back so the type never sits in a haze.
    composite.uniforms.strength.value = 0.14 + lighting.glow * 0.12;
    composite.uniforms.vignette.value = 0.4;
    quad.material = composite;
    gl.setRenderTarget(null);
    gl.setClearColor(0x000000, 0);
    gl.clear(true, true, true);
    quad.render(gl);

    gl.autoClear = previousAutoClear;
  }, 1);

  return null;
}
