import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fx = { v: null }; // manual override for the full-screen light flash
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

const PRODUCTS = [
  { key: "fearless-burgundy", name: "Fear Less — Burgundy", short: "Back · “i'm busy” hood · puff stars",
    desc: "Acid mineral-washed heavyweight fleece in burgundy. Distressed “Fear Less” script across the back, “i'm busy” embroidered on the hood, three raised puff stars down each sleeve." },
  { key: "blessed-burgundy", name: "Feel Blessed — Burgundy", short: "Front · two-way zip · acid wash",
    desc: "The same hoodie, the other face. “Feel Blessed” script split by a two-way silver zip, lined hood, cropped boxy body with ribbed cuffs and hem." },
  { key: "fearless-black", name: "Fear Less — Washed Black", short: "Back · thorned script · puff stars",
    desc: "Washed-black colourway with a thorned “Fear Less” script on the back. Bright white puff stars pop against the faded charcoal marble." },
  { key: "blessed-black", name: "Feel Blessed — Washed Black", short: "Front · two-way zip · lined hood",
    desc: "Washed black, front side. Thorned “Feel Blessed” script, two-way zip and a solid black lined hood. Built to go everywhere at night." },
];

/* ------------------------------------------------------------------ */
/* Smooth scroll                                                       */
/* ------------------------------------------------------------------ */
let lenis = null;
if (!reduceMotion && window.Lenis) {
  lenis = new window.Lenis({ lerp: 0.085, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}
const scrollToEl = (el, duration = 2) => {
  if (lenis) lenis.scrollTo(el, { duration, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
};
$$('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    const target = $(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    closeDetail();
    scrollToEl(target);
  })
);

/* ------------------------------------------------------------------ */
/* Pointer + custom cursor                                             */
/* ------------------------------------------------------------------ */
const pointer = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0, sx: 0, sy: 0 };
const cursor = $(".cursor");
const cursorDot = $(".cursor__dot");
const cursorRing = $(".cursor__ring");
const cursorLabel = $("#cursorLabel");
const ring = { x: pointer.x, y: pointer.y };
const heroWord = $(".hero__word");

addEventListener("pointermove", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.nx = (e.clientX / innerWidth) * 2 - 1;
  pointer.ny = -(e.clientY / innerHeight) * 2 + 1;
  root.style.setProperty("--mx", `${e.clientX}px`);
  root.style.setProperty("--my", `${e.clientY}px`);
  const r = heroWord.getBoundingClientRect();
  heroWord.style.setProperty("--hx", `${e.clientX - r.left}px`);
  heroWord.style.setProperty("--hy", `${e.clientY - r.top}px`);
});

let labelOwner = null;
function setCursorLabel(text, owner) {
  if (text) {
    labelOwner = owner;
    cursorLabel.textContent = text;
    cursor.classList.add("is-label");
  } else if (labelOwner === owner) {
    labelOwner = null;
    cursor.classList.remove("is-label");
  }
}

$$("[data-magnetic]").forEach((el) => {
  el.addEventListener("pointerenter", () => cursor.classList.add("is-hover"));
  el.addEventListener("pointerleave", () => {
    cursor.classList.remove("is-hover");
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  });
  el.addEventListener("pointermove", (e) => {
    if (reduceMotion) return;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - (r.left + r.width / 2)) * 0.3,
      y: (e.clientY - (r.top + r.height / 2)) * 0.3,
      duration: 0.4, ease: "power3.out",
    });
  });
});

/* ------------------------------------------------------------------ */
/* Text: split headings into lines, manifesto into words               */
/* ------------------------------------------------------------------ */
$$(".split").forEach((el) => {
  el.innerHTML = el.innerHTML
    .split(/<br\s*\/?>/i)
    .map((l) => `<span class="line"><span>${l.trim()}</span></span>`)
    .join("");
});
const manifesto = $("#manifesto");
const HOT = new Set(["homies.", "Melbourne.", "next", "gen."]);
manifesto.innerHTML = manifesto.textContent
  .trim()
  .split(/\s+/)
  .map((w) => `<span class="w${HOT.has(w) ? " hot" : ""}">${w}</span>`)
  .join(" ");
const manifestoWords = $$(".w", manifesto);

/* ------------------------------------------------------------------ */
/* Section measurement                                                 */
/* ------------------------------------------------------------------ */
const sec = Object.fromEntries(
  ["hero", "origin", "collection", "twoface", "details", "melbourne", "drop"].map((id) => [id, $("#" + id)])
);
const S = {};
function measure() {
  const vh = innerHeight;
  for (const [id, el] of Object.entries(sec)) {
    const r = el.getBoundingClientRect();
    const pin = clamp(-r.top / Math.max(1, r.height - vh));
    const vis = Math.min(clamp((vh - r.top) / vh), clamp(r.bottom / vh));
    S[id] = { pin, vis, top: r.top, bottom: r.bottom };
  }
}
measure();

/* ------------------------------------------------------------------ */
/* WebGL                                                               */
/* ------------------------------------------------------------------ */
const canvas = $("#webgl");
let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
} catch (err) {
  root.classList.add("no-webgl");
}

const manager = new THREE.LoadingManager();
const textures = {};
let three = null;
if (renderer) three = initThree(renderer);

function initThree(renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.35;

  const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.05, 100);
  camera.position.set(0, 0, 8);
  const lookTarget = new THREE.Vector3();

  // Lights: a wine rim from behind, a cool fill, and a warm light that follows the cursor.
  scene.add(new THREE.AmbientLight(0xffffff, 0.12));
  const rim = new THREE.SpotLight(0xff3347, 260, 30, Math.PI / 5, 0.6, 1.6);
  rim.position.set(-5, 6, -4);
  scene.add(rim, rim.target);
  const rim2 = new THREE.SpotLight(0xff6a5c, 140, 30, Math.PI / 6, 0.7, 1.6);
  rim2.position.set(6, -2, -3);
  scene.add(rim2, rim2.target);
  const fill = new THREE.DirectionalLight(0xbfd2ff, 0.35);
  fill.position.set(3, 2, 6);
  scene.add(fill);
  const cursorLight = new THREE.PointLight(0xffeee0, 26, 14, 1.7);
  cursorLight.position.set(0, 0, 3);
  scene.add(cursorLight);

  // Soft radial sprite texture used for glows and dust.
  const glowTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.25, "rgba(255,255,255,0.45)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();

  /* ---------- Hero emblem: the roofed "o" from the logo, extruded ---------- */
  const emblem = new THREE.Group();
  const emblemPivot = new THREE.Group();
  emblem.add(emblemPivot);
  scene.add(emblem);

  const shape = new THREE.Shape();
  const a0 = Math.atan2(0.55, 0.835);
  shape.moveTo(0.835, 0.55);
  shape.absarc(0, 0, 1, a0, Math.PI - a0, true);
  shape.lineTo(-1.0, 0.56);
  shape.quadraticCurveTo(-1.17, 0.58, -1.06, 0.72);
  shape.lineTo(-0.1, 1.52);
  shape.quadraticCurveTo(0, 1.6, 0.1, 1.52);
  shape.lineTo(1.06, 0.72);
  shape.quadraticCurveTo(1.17, 0.58, 1.0, 0.56);
  shape.lineTo(0.835, 0.55);
  const hole = new THREE.Path();
  hole.absellipse(0, -0.05, 0.38, 0.49, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const EMBLEM_Y = -0.3; // shift so the roof + ring sit visually centred
  const emblemGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.42, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.07, bevelSegments: 10, curveSegments: 96,
  });
  emblemGeo.translate(0, EMBLEM_Y, -0.21);
  const emblemMat = new THREE.MeshPhysicalMaterial({
    color: 0x1c070b, metalness: 0.85, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.12,
    sheen: 0.6, sheenColor: new THREE.Color(0xff5566),
  });
  const emblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
  emblemPivot.add(emblemMesh);

  // Light inside the house: a window glow behind the hole, plus a halo.
  const holeY = EMBLEM_Y - 0.05;
  const windowGlow = new THREE.Mesh(
    new THREE.CircleGeometry(0.5, 64),
    new THREE.MeshBasicMaterial({ color: 0xffc3a8, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  windowGlow.scale.set(0.8, 1, 1);
  windowGlow.position.set(0, holeY, -0.32);
  emblemPivot.add(windowGlow);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xc2414d, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.scale.setScalar(6);
  halo.position.set(0, 0, -1.2);
  emblem.add(halo);

  const shock = new THREE.Mesh(
    new THREE.RingGeometry(0.97, 1, 128),
    new THREE.MeshBasicMaterial({ color: 0xff8a7a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  );
  emblem.add(shock);

  /* ---------- Hoodie textures + cloth-wave material ---------- */
  const texLoader = new THREE.TextureLoader(manager);
  for (const p of PRODUCTS) {
    const t = texLoader.load(`assets/cut-${p.key}.webp`);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textures[p.key] = t;
  }
  const uTime = { value: 0 };
  function clothMaterial(map) {
    const m = new THREE.MeshStandardMaterial({
      // Mostly self-lit so the garment keeps its true colour; the scene lights add sheen on top.
      map, emissiveMap: map, emissive: 0xffffff, emissiveIntensity: 0.62, color: 0x4a4a4a,
      roughness: 1, metalness: 0, transparent: true, alphaTest: 0.35, side: THREE.FrontSide,
      envMapIntensity: 0, toneMapped: false,
    });
    m.userData.wave = { value: 1 };
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uTime;
      shader.uniforms.uWave = m.userData.wave;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nuniform float uTime;\nuniform float uWave;")
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           float wv = sin(position.y * 2.4 + uTime * 1.7 + position.x * 1.2) * 0.045
                    + sin(position.x * 3.1 - uTime * 1.1) * 0.025;
           transformed.z += wv * uWave;`
        );
    };
    return m;
  }
  const PW = 2.08, PH = 2.6;
  const planeGeo = new THREE.PlaneGeometry(PW, PH, 32, 40);

  /* ---------- Chapter 02: ring of four ---------- */
  const ringGroup = new THREE.Group();
  scene.add(ringGroup);
  const ringItems = PRODUCTS.map((p, i) => {
    const mesh = new THREE.Mesh(planeGeo, clothMaterial(textures[p.key]));
    mesh.userData = { index: i, hover: 0 };
    ringGroup.add(mesh);
    return mesh;
  });
  const ringFloor = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x7d2e35, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
  ringFloor.scale.set(9, 2.2, 1);
  ringFloor.position.set(0, -1.6, 0);
  ringGroup.add(ringFloor);

  /* ---------- Chapter 03: two-faced turntable ---------- */
  const turntable = new THREE.Group();
  const tiltPivot = new THREE.Group();
  turntable.add(tiltPivot);
  scene.add(turntable);
  const frontFace = new THREE.Mesh(planeGeo, clothMaterial(textures["blessed-burgundy"]));
  const backFace = new THREE.Mesh(planeGeo, clothMaterial(textures["fearless-burgundy"]));
  backFace.rotation.y = Math.PI;
  backFace.position.z = -0.02;
  tiltPivot.add(frontFace, backFace);
  const ttHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xc2414d, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false }));
  ttHalo.scale.setScalar(5.5);
  ttHalo.position.z = -1.4;
  turntable.add(ttHalo);
  const tt = { colour: "burgundy", spin: 0 };

  /* ---------- Chapter 04: puff stars ---------- */
  const starShape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 0.2 : 0.5;
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    const fn = i ? "lineTo" : "moveTo";
    starShape[fn](Math.cos(a) * r, Math.sin(a) * r);
  }
  const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.08, bevelSegments: 6 });
  starGeo.center();
  const starMat = new THREE.MeshPhysicalMaterial({ color: 0xf3ece4, roughness: 0.75, sheen: 1, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.5, transparent: true });
  const STAR_COUNT = 30;
  const stars = new THREE.InstancedMesh(starGeo, starMat, STAR_COUNT);
  const starData = Array.from({ length: STAR_COUNT }, (_, i) => ({
    x: (Math.random() - 0.5) * 14, y: (Math.random() - 0.5) * 8, z: -Math.random() * 12,
    s: 0.3 + Math.random() * 0.5, rx: (Math.random() - 0.5) * 1.2, ry: (Math.random() - 0.5) * 1.2,
    vr: (Math.random() - 0.5) * 0.8, ph: i * 1.3,
  }));
  scene.add(stars);
  const dummy = new THREE.Object3D();

  /* ---------- Dust: always-on atmosphere ---------- */
  const DUST = 900;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 16;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 1;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    map: glowTex, color: 0xffb3a6, size: 0.06, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  }));
  scene.add(dust);

  /* ---------- State ---------- */
  const st = {
    intro: 0, ignite: 0, spin: 0, hoverEmblem: 0,
    ringRot: 0, drag: 0, dragging: false, activeIndex: -1,
    ttRot: 0, tiltX: 0, tiltY: 0,
  };
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hovered = null;

  function layout() {
    const mobile = innerWidth < 720;
    return {
      mobile,
      emblemScale: mobile ? 0.7 : 0.95,
      ringR: mobile ? 2.1 : 3.1,
      ringScale: mobile ? 0.78 : 1,
      ttX: mobile ? 0 : 1.75,
      ttY: mobile ? -0.35 : 0,
      ttScale: mobile ? 0.82 : 1.1,
    };
  }
  let L = layout();

  function resize() {
    L = layout();
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
  }
  addEventListener("resize", resize);

  // Collection drag
  const colSticky = $(".collection .stage-fg");
  let dragStartX = 0, dragStart = 0, dragMoved = 0;
  colSticky.addEventListener("pointerdown", (e) => {
    st.dragging = true; dragStartX = e.clientX; dragStart = st.drag; dragMoved = 0;
  });
  addEventListener("pointermove", (e) => {
    if (!st.dragging) return;
    dragMoved = Math.abs(e.clientX - dragStartX);
    st.drag = dragStart + (e.clientX - dragStartX) * 0.006;
  });
  addEventListener("pointerup", () => { st.dragging = false; });

  const tmpV = new THREE.Vector3();
  const tmpDir = new THREE.Vector3();
  let lastIdx = -1;

  function update(time, dt) {
    uTime.value = time;
    const H = S.hero, O = S.origin, C = S.collection, T = S.twoface, D = S.details, M = S.melbourne;
    const k = 1 - Math.pow(0.001, dt); // frame-rate independent smoothing

    // Pointer smoothing + camera parallax
    pointer.sx = lerp(pointer.sx, pointer.nx, k * 0.9);
    pointer.sy = lerp(pointer.sy, pointer.ny, k * 0.9);

    /* --- Hero: fly the camera through the window of the house --- */
    const fly = smooth(0.15, 1, H.pin);
    const camZ = lerp(8, -1.2, Math.pow(fly, 1.6));
    const camY = lerp(0, holeY * L.emblemScale, smooth(0.0, 0.6, H.pin));
    const heroActive = H.vis > 0.001 && H.pin < 0.999;
    camera.position.set(
      heroActive ? pointer.sx * 0.35 * (1 - fly) : pointer.sx * 0.3,
      heroActive ? camY + pointer.sy * 0.2 * (1 - fly) : pointer.sy * 0.2,
      heroActive ? camZ : 8
    );
    lookTarget.set(0, heroActive ? camY : 0, heroActive ? camZ - 5 : 0);
    camera.lookAt(lookTarget);
    camera.fov = lerp(35, 70, heroActive ? Math.pow(fly, 3) : 0);
    camera.updateProjectionMatrix();

    emblem.visible = heroActive;
    if (emblem.visible) {
      const s = L.emblemScale * (0.6 + 0.4 * st.intro) * (1 + st.ignite * 0.08);
      emblem.scale.setScalar(s);
      emblem.position.y = (1 - st.intro) * 3 + Math.sin(time * 0.8) * 0.06 * (1 - fly);
      emblemPivot.rotation.y = lerp(emblemPivot.rotation.y, pointer.sx * 0.55 * (1 - fly), k) + 0;
      emblemPivot.rotation.x = lerp(emblemPivot.rotation.x, -pointer.sy * 0.3 * (1 - fly), k);
      emblemMesh.rotation.y = st.spin + (1 - st.intro) * -2.5;
      windowGlow.material.opacity = 0.35 + st.hoverEmblem * 0.4 + st.ignite * 0.6 + fly * 0.8;
      halo.material.opacity = 0.45 + st.hoverEmblem * 0.35 + st.ignite * 0.8;
      halo.scale.setScalar(6 + st.ignite * 4 + Math.sin(time * 1.3) * 0.25);
    }
    // Light pouring out of the window as we pass through it
    flashEl.style.opacity = fx.v ?? (smooth(0.72, 0.93, H.pin) * (1 - smooth(0.97, 1, H.pin)) * 0.95).toFixed(3);

    /* --- Cursor light follows the pointer on a plane in front of the scene --- */
    tmpV.set(pointer.sx, pointer.sy, 0.5).unproject(camera);
    tmpDir.copy(tmpV).sub(camera.position).normalize();
    const lightZ = heroActive ? Math.min(camZ - 2.5, 2.6) : 2.6;
    const dist = (lightZ - camera.position.z) / tmpDir.z;
    cursorLight.position.copy(camera.position).add(tmpDir.multiplyScalar(dist));
    cursorLight.intensity = 26 + st.ignite * 120;

    /* --- Chapter 02: ring --- */
    const cVis = smooth(0, 0.6, C.vis);
    ringGroup.visible = cVis > 0.001;
    if (ringGroup.visible) {
      // dwell on each piece: integer part + eased fraction
      const x = C.pin * (PRODUCTS.length - 1);
      const base = Math.floor(x) + smooth(0.3, 0.7, x - Math.floor(x));
      if (!st.dragging) {
        const q = Math.PI / 2;
        st.drag = lerp(st.drag, Math.round(st.drag / q) * q, k * 0.5);
      }
      const target = -base * (Math.PI / 2) + st.drag;
      st.ringRot = lerp(st.ringRot, target, k * 0.8);
      ringGroup.position.set(0, (1 - cVis) * -3 - 0.4, -1.2);
      ringGroup.rotation.y = st.ringRot;
      ringGroup.scale.setScalar(L.ringScale);
      ringItems.forEach((m, i) => {
        const a = (i * Math.PI) / 2;
        const hoverT = m.userData.hover;
        m.position.set(Math.sin(a) * L.ringR, Math.sin(time * 0.9 + i) * 0.06, Math.cos(a) * L.ringR);
        m.rotation.y = a - (a + st.ringRot) * 0.7; // partly turn towards the camera, coverflow-style
        m.scale.setScalar(1 + hoverT * 0.06);
        m.material.opacity = cVis;
        m.material.userData.wave.value = 1 + hoverT * 1.5;
      });
      // which piece faces camera
      let idx = Math.round(-st.ringRot / (Math.PI / 2)) % 4;
      if (idx < 0) idx += 4;
      if (idx !== lastIdx) { lastIdx = idx; onRingIndex(idx); }
      ringFloor.material.opacity = 0.5 * cVis;
    }

    /* --- Chapter 03: turntable --- */
    const tVis = smooth(0, 0.6, T.vis);
    turntable.visible = tVis > 0.001;
    if (turntable.visible) {
      const turn = smooth(0.2, 0.75, T.pin) * Math.PI;
      st.ttRot = lerp(st.ttRot, turn + tt.spin, k);
      turntable.position.set(L.ttX, L.ttY + (1 - tVis) * -3, 0.4);
      turntable.scale.setScalar(L.ttScale);
      turntable.rotation.y = st.ttRot + Math.sin(time * 0.6) * 0.06;
      st.tiltX = lerp(st.tiltX, -pointer.sy * 0.18, k);
      st.tiltY = lerp(st.tiltY, pointer.sx * 0.28, k);
      tiltPivot.rotation.set(st.tiltX, st.tiltY, 0);
      frontFace.material.opacity = backFace.material.opacity = tVis;
      ttHalo.material.opacity = 0.45 * tVis;
      const isBack = Math.cos(st.ttRot) < 0;
      sec.twoface.classList.toggle("is-back", isBack);
      sideLabel.textContent = isBack ? "Back" : "Front";
    }

    /* --- Chapter 04: stars --- */
    const sVis = Math.max(smooth(0, 0.7, D.vis), smooth(0, 0.7, M.vis) * 0.35 * (1 - M.pin));
    stars.visible = sVis > 0.001;
    if (stars.visible) {
      const push = D.pin * 6;
      starData.forEach((d, i) => {
        let z = d.z + push + Math.sin(time * 0.3 + d.ph) * 0.3;
        z = ((z + 13) % 12.5) - 13; // wrap so stars keep coming, never closer than the copy
        dummy.position.set(d.x + Math.sin(time * 0.2 + d.ph) * 0.2, d.y + Math.cos(time * 0.25 + d.ph) * 0.2 - (1 - sVis) * 4, z);
        // puffy side towards camera: wobble, don't tumble edge-on
        dummy.rotation.set(d.rx + Math.sin(time * d.vr + d.ph) * 0.5, d.ry + Math.cos(time * d.vr * 0.7 + d.ph) * 0.5, time * d.vr * 0.4 + d.ph);
        dummy.scale.setScalar(d.s * sVis);
        dummy.updateMatrix();
        stars.setMatrixAt(i, dummy.matrix);
      });
      stars.instanceMatrix.needsUpdate = true;
      starMat.opacity = sVis;
    }

    /* --- Dust --- */
    dust.rotation.y = time * 0.01 + pointer.sx * 0.05;
    dust.position.y = (window.scrollY * 0.0006) % 2;
    dust.material.opacity = 0.35 + 0.25 * O.vis;

    // Rim lights breathe a little and swing with scroll
    rim.intensity = 220 + Math.sin(time * 0.7) * 40 + st.ignite * 400;
    rim2.position.x = 6 + Math.sin(time * 0.3) * 1.5;

    /* --- Hover raycasts --- */
    ndc.set(pointer.nx, pointer.ny);
    raycaster.setFromCamera(ndc, camera);
    let hit = null;
    if (emblem.visible && H.pin < 0.25 && detailClosed()) {
      if (raycaster.intersectObjects([emblemMesh, windowGlow], false).length) hit = "emblem";
    }
    if (!hit && ringGroup.visible && cVis > 0.6 && detailClosed()) {
      const r = raycaster.intersectObjects(ringItems, false)[0];
      if (r) hit = r.object;
    }
    if (hit !== hovered) {
      hovered = hit;
      setCursorLabel(hit === "emblem" ? "Enter" : hit ? "View" : null, "3d");
    }
    st.hoverEmblem = lerp(st.hoverEmblem, hovered === "emblem" ? 1 : 0, k);
    ringItems.forEach((m) => { m.userData.hover = lerp(m.userData.hover, hovered === m ? 1 : 0, k); });

    renderer.render(scene, camera);
  }

  function ignite(x = innerWidth / 2, y = innerHeight / 2) {
    if (st.igniting) return;
    st.igniting = true;
    flashEl.style.setProperty("--fx", `${x}px`);
    flashEl.style.setProperty("--fy", `${y}px`);
    const tl = gsap.timeline({ onComplete: () => { st.igniting = false; } });
    tl.to(st, { ignite: 1, duration: 0.25, ease: "power2.out" })
      .to(st, { spin: st.spin + Math.PI * 2, duration: 1.4, ease: "expo.inOut" }, 0)
      .fromTo(shock.scale, { x: 0.5, y: 0.5 }, { x: 9, y: 9, duration: 1.3, ease: "expo.out" }, 0.05)
      .fromTo(shock.material, { opacity: 1 }, { opacity: 0, duration: 1.3, ease: "power2.out" }, 0.05)
      .add(() => { fx.v = 1; }, 0.05)
      .to(fx, { v: 0, duration: 0.9, ease: "power2.out", onComplete: () => { fx.v = null; } }, 0.1)
      .to(st, { ignite: 0, duration: 1.2, ease: "power2.inOut" }, 0.5)
      .add(() => scrollToEl(sec.origin, 2.6), 0.55);
    heroWord.animate(
      [{ letterSpacing: "-0.02em", filter: "blur(0px)" }, { letterSpacing: "0.04em", filter: "blur(2px)" }, { letterSpacing: "-0.02em", filter: "blur(0px)" }],
      { duration: 900, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  }

  function swapColour(colour) {
    if (colour === tt.colour) return;
    tt.colour = colour;
    const suffix = colour === "black" ? "black" : "burgundy";
    gsap.timeline()
      .to(tt, { spin: tt.spin + Math.PI * 2, duration: 1.2, ease: "expo.inOut" }, 0)
      .add(() => {
        frontFace.material.map = frontFace.material.emissiveMap = textures[`blessed-${suffix}`];
        backFace.material.map = backFace.material.emissiveMap = textures[`fearless-${suffix}`];
        frontFace.material.needsUpdate = backFace.material.needsUpdate = true;
        ttHalo.material.color.set(colour === "black" ? 0x8a8f99 : 0xc2414d);
      }, 0.55);
  }

  function intro() {
    gsap.to(st, { intro: 1, duration: reduceMotion ? 0 : 2.2, ease: "expo.out" });
  }

  return {
    update, ignite, swapColour, intro,
    clickTarget: () => hovered,
    dragMoved: () => dragMoved,
  };
}

/* ------------------------------------------------------------------ */
/* DOM-driven chapter effects                                          */
/* ------------------------------------------------------------------ */
const flashEl = $("#flash");
const sideLabel = $("#sideLabel");
const railFill = $("#railFill");
const railLabel = $("#railLabel");
const layers = $$(".layer[data-depth]");
const heroBits = $$(".hero__bottom, .hero__meta, .hero__scroll");

function onRingIndex(i) {
  const p = PRODUCTS[i];
  const els = [$("#ringIdx"), $("#ringName"), $("#ringDesc")];
  gsap.timeline()
    .to(els, { y: -12, opacity: 0, duration: 0.2, stagger: 0.03, ease: "power2.in" })
    .add(() => {
      els[0].textContent = `0${i + 1} / 0${PRODUCTS.length}`;
      els[1].textContent = p.name;
      els[2].textContent = p.short;
    })
    .fromTo(els, { y: 12 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: "power3.out" });
}

let lastChapter = "";
function updateDom() {
  const vh = innerHeight;
  // Hero chrome fades as we push in
  const h = S.hero.pin;
  sec.hero.style.setProperty("--hf", String(1 - smooth(0, 0.25, h)));
  heroWord.style.transform = `translate(-50%, -50%) scale(${1 + h * 0.6})`;
  heroWord.style.opacity = String(1 - smooth(0.1, 0.5, h));

  // Parallax background layers
  layers.forEach((el) => {
    const s = S[el.closest(".chapter").id];
    const d = parseFloat(el.dataset.depth);
    el.style.transform = `translate3d(${pointer.sx * -18}px, ${(s.pin - 0.5) * d * vh * -0.6}px, 0) scale(${1.08 + s.pin * 0.08})`;
  });

  // Manifesto words light up with scroll
  const lit = Math.floor(smooth(0.1, 0.85, S.melbourne.pin) * manifestoWords.length);
  manifestoWords.forEach((w, i) => w.classList.toggle("on", i < lit));

  // Progress rail
  const max = document.documentElement.scrollHeight - vh;
  railFill.style.transform = `scaleX(${clamp(scrollY / Math.max(1, max))})`;
  const mid = vh / 2;
  for (const el of Object.values(sec)) {
    const r = el.getBoundingClientRect();
    if (r.top <= mid && r.bottom > mid) {
      const label = el.dataset.chapter;
      if (label !== lastChapter) { lastChapter = label; railLabel.textContent = label; }
      break;
    }
  }
}

// Reveals
function setupReveals() {
  $$(".split").forEach((el) => {
    gsap.to($$(".line > span", el), {
      y: 0, duration: 1.2, stagger: 0.09, ease: "expo.out",
      scrollTrigger: { trigger: el.closest(".chapter"), start: "top 40%" },
    });
  });
  $$(".reveal").forEach((el, i) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 1.1, ease: "expo.out", delay: (i % 4) * 0.08,
      scrollTrigger: { trigger: el.closest(".chapter"), start: "top 30%" },
    });
  });
  gsap.from(".origin__tag", {
    scale: 1.6, opacity: 0, rotate: -20, duration: 1.4, ease: "expo.out",
    scrollTrigger: { trigger: "#origin", start: "top 30%" },
  });
  gsap.from(".drop__title", {
    yPercent: 40, opacity: 0, duration: 1.4, ease: "expo.out",
    scrollTrigger: { trigger: "#drop", start: "top 70%" },
  });
}

/* ------------------------------------------------------------------ */
/* Interactions                                                        */
/* ------------------------------------------------------------------ */
const detail = $("#detail");
const detailClosed = () => !detail.classList.contains("is-open");
function openDetail(i, x, y) {
  const p = PRODUCTS[i];
  $("#detailImg").src = `assets/cut-${p.key}.webp`;
  $("#detailImg").alt = p.name;
  $("#detailIdx").textContent = `Drop 001 — 0${i + 1} / 0${PRODUCTS.length}`;
  $("#detailName").textContent = p.name;
  $("#detailDesc").textContent = p.desc;
  detail.style.setProperty("--ox", `${x}px`);
  detail.style.setProperty("--oy", `${y}px`);
  detail.classList.add("is-open");
  detail.setAttribute("aria-hidden", "false");
  lenis?.stop();
  setCursorLabel(null, "3d");
  $("#detailClose").focus({ preventScroll: true });
}
function closeDetail() {
  if (detailClosed()) return;
  detail.classList.remove("is-open");
  detail.setAttribute("aria-hidden", "true");
  lenis?.start();
}
$("#detailClose").addEventListener("click", closeDetail);
$("#detailCta").addEventListener("click", closeDetail);
addEventListener("keydown", (e) => { if (e.key === "Escape") closeDetail(); });

addEventListener("click", (e) => {
  if (!three || e.target.closest("a, button, input, .detail")) return;
  const t = three.clickTarget();
  if (t === "emblem") three.ignite(e.clientX, e.clientY);
  else if (t && typeof t === "object" && three.dragMoved() < 6) openDetail(t.userData.index, e.clientX, e.clientY);
});
$("#enterBtn").addEventListener("click", (e) => {
  if (three) three.ignite(e.clientX, e.clientY);
  else scrollToEl(sec.origin);
});

$$(".swatch").forEach((b) =>
  b.addEventListener("click", () => {
    $$(".swatch").forEach((s) => { s.classList.toggle("is-active", s === b); s.setAttribute("aria-pressed", String(s === b)); });
    three?.swapColour(b.dataset.colour);
    const r = b.getBoundingClientRect();
    flashEl.style.setProperty("--fx", `${r.left + r.width / 2}px`);
    flashEl.style.setProperty("--fy", `${r.top + r.height / 2}px`);
    gsap.fromTo(fx, { v: 0.6 }, { v: 0, duration: 0.8, ease: "power2.out", onComplete: () => { fx.v = null; } });
  })
);

$("#dropForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#email");
  const msg = $("#dropMsg");
  if (!input.checkValidity() || !input.value) {
    msg.textContent = "That email doesn't look right — try again.";
    input.focus();
    return;
  }
  msg.textContent = "You're on the list. See you at the drop. ✦";
  input.value = "";
});

/* ------------------------------------------------------------------ */
/* Loop                                                                */
/* ------------------------------------------------------------------ */
const clock = new THREE.Clock();
gsap.ticker.add(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  measure();
  ring.x = lerp(ring.x, pointer.x, 0.18);
  ring.y = lerp(ring.y, pointer.y, 0.18);
  cursorDot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
  cursorRing.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
  if (three) three.update(t, dt);
  else {
    pointer.sx = lerp(pointer.sx, pointer.nx, 0.08);
    flashEl.style.opacity = "0";
  }
  updateDom();
});

/* ------------------------------------------------------------------ */
/* Preloader                                                           */
/* ------------------------------------------------------------------ */
document.body.classList.add("is-loading");
const loadState = { p: 0 };
const countEl = $("#loadCount");
const assetsReady = new Promise((res) => {
  if (!three) return res();
  manager.onLoad = res;
  manager.onError = () => res();
  setTimeout(res, 8000); // never trap the visitor behind the loader
});
Promise.all([assetsReady, document.fonts?.ready ?? Promise.resolve()]).then(() => {
  const tl = gsap.timeline();
  tl.to(loadState, {
    p: 100, duration: reduceMotion ? 0.2 : 1.1, ease: "power2.inOut",
    onUpdate: () => { countEl.textContent = String(Math.round(loadState.p)).padStart(3, "0"); },
  })
    .to("#loader", { clipPath: "inset(0 0 100% 0)", duration: reduceMotion ? 0.2 : 1.1, ease: "expo.inOut" }, "+=0.15")
    .add(() => {
      $("#loader").remove();
      document.body.classList.remove("is-loading");
      lenis?.start();
      three?.intro();
      setupReveals();
      ScrollTrigger.refresh();
    }, "-=0.5")
    .from(".hero__word span", { yPercent: 30, opacity: 0, duration: 1.6, ease: "expo.out", stagger: 0.08 }, "-=0.4")
    .from(heroBits, { y: 24, filter: "blur(12px)", duration: 1, ease: "expo.out", stagger: 0.06, clearProps: "transform,filter" }, "-=1.2");
});
gsap.to(".loader__roof path", { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" });
