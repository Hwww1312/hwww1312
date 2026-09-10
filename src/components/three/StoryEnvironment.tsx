"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A painted studio environment rather than a downloaded HDRI: no third-party
 * CDN at runtime, and the highlights are art-directed.
 *
 * It is deliberately dark. scene.environment feeds diffuse irradiance as well
 * as specular, so a bright map floods the shadow side and throws away the
 * contrast the whole look depends on. The overall level stays low; the small
 * hot softbox is what puts a wet highlight on the glaze and the meat.
 */
export function StoryEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    const W = 512;
    const H = 256;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const x = c.getContext("2d") as CanvasRenderingContext2D;

    const sky = x.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#6f6455");
    sky.addColorStop(0.4, "#3b352d");
    sky.addColorStop(0.62, "#221e19");
    sky.addColorStop(1, "#0b0a09");
    x.fillStyle = sky;
    x.fillRect(0, 0, W, H);

    // the key softbox, and a smaller cool one opposite it
    const box = (cx: number, cy: number, rx: number, ry: number, col: string, a: string) => {
      const g = x.createRadialGradient(cx, cy, 1, cx, cy, Math.max(rx, ry));
      g.addColorStop(0, col.replace("A", a));
      g.addColorStop(1, col.replace("A", "0"));
      x.save();
      x.translate(cx, cy);
      x.scale(1, ry / rx);
      x.translate(-cx, -cy);
      x.fillStyle = g;
      x.beginPath();
      x.arc(cx, cy, Math.max(rx, ry), 0, 7);
      x.fill();
      x.restore();
    };
    box(W * 0.3, H * 0.2, 118, 74, "rgba(255,252,244,A)", "1");
    box(W * 0.78, H * 0.34, 74, 54, "rgba(186,214,226,A)", ".55");

    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const env = pmrem.fromEquirectangular(tex).texture;
    pmrem.dispose();
    tex.dispose();

    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
    };
  }, [gl, scene]);

  return null;
}
