import * as THREE from "three";

/**
 * Every texture on this page is drawn at runtime into a 2D canvas.
 *
 * Nothing photographic is used anywhere: the restaurant's own listing images
 * are not reproduced, and there is no texture payload to download, which is
 * most of the reason the page reaches first paint as quickly as it does.
 */

/** Deterministic RNG, so the dish is plated identically on every load. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  return [c, c.getContext("2d") as CanvasRenderingContext2D];
}

function toTexture(c: HTMLCanvasElement, srgb: boolean, aniso: number) {
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = aniso;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export interface BrothMaps {
  map: THREE.Texture;
  roughnessMap: THREE.Texture;
  bumpMap: THREE.Texture;
}

/**
 * The surface of the curry.
 *
 * Three passes over the same layout so they line up: a mottled turmeric base,
 * pools of rendered coconut fat that read brighter and much smoother than the
 * broth around them, and a bump pass that gives those pools a meniscus. The
 * specular break-up across the fat is what stops the broth reading as a disc
 * of orange plastic under the key light.
 */
export function brothMaps(aniso: number): BrothMaps {
  const S = 512;
  const [albedoC, a] = canvas(S);
  const [roughC, r] = canvas(S);
  const [bumpC, b] = canvas(S);
  const random = rng(20260910);

  a.fillStyle = "#a75f0e";
  a.fillRect(0, 0, S, S);
  // The broth is rougher than the fat sitting on it, so start rough.
  r.fillStyle = "#c8c8c8";
  r.fillRect(0, 0, S, S);
  b.fillStyle = "#808080";
  b.fillRect(0, 0, S, S);

  // Turmeric mottling: broad, low contrast, no visible tiling seam because
  // every blob is drawn wrapped across all four edges.
  const wrapped = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    draw: (cx: number, cy: number) => void,
  ) => {
    for (let ox = -1; ox <= 1; ox += 1) {
      for (let oy = -1; oy <= 1; oy += 1) draw(x + ox * S, y + oy * S);
    }
  };

  for (let i = 0; i < 90; i += 1) {
    const x = random() * S;
    const y = random() * S;
    const rad = 24 + random() * 90;
    const warm = random() > 0.5;
    wrapped(a, x, y, (cx, cy) => {
      const g = a.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0, warm ? "rgba(206,131,24,0.55)" : "rgba(116,60,10,0.5)");
      g.addColorStop(1, "rgba(167,95,14,0)");
      a.fillStyle = g;
      a.beginPath();
      a.arc(cx, cy, rad, 0, Math.PI * 2);
      a.fill();
    });
  }

  // Rendered fat. Bright, saturated, and the only smooth thing in frame.
  for (let i = 0; i < 150; i += 1) {
    const x = random() * S;
    const y = random() * S;
    const rad = 3 + random() * 15;
    wrapped(a, x, y, (cx, cy) => {
      const g = a.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0, "rgba(248,176,62,0.92)");
      g.addColorStop(0.62, "rgba(222,140,34,0.6)");
      g.addColorStop(1, "rgba(200,122,28,0)");
      a.fillStyle = g;
      a.beginPath();
      a.arc(cx, cy, rad, 0, Math.PI * 2);
      a.fill();
    });
    wrapped(r, x, y, (cx, cy) => {
      const g = r.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0, "rgba(26,26,26,1)");
      g.addColorStop(0.7, "rgba(90,90,90,0.85)");
      g.addColorStop(1, "rgba(200,200,200,0)");
      r.fillStyle = g;
      r.beginPath();
      r.arc(cx, cy, rad, 0, Math.PI * 2);
      r.fill();
    });
    // A raised meniscus at the edge of each pool, dipping in the middle.
    wrapped(b, x, y, (cx, cy) => {
      const g = b.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0, "rgba(122,122,122,1)");
      g.addColorStop(0.78, "rgba(190,190,190,1)");
      g.addColorStop(1, "rgba(128,128,128,0)");
      b.fillStyle = g;
      b.beginPath();
      b.arc(cx, cy, rad, 0, Math.PI * 2);
      b.fill();
    });
  }

  // Ground spice and toasted aromatics suspended in the curry.
  for (let i = 0; i < 340; i += 1) {
    const x = random() * S;
    const y = random() * S;
    const rad = 0.7 + random() * 2.4;
    const shade = random();
    a.fillStyle =
      shade > 0.72
        ? "rgba(120,52,16,0.6)"
        : shade > 0.4
          ? "rgba(178,64,26,0.42)"
          : "rgba(96,66,24,0.38)";
    wrapped(a, x, y, (cx, cy) => {
      a.beginPath();
      a.arc(cx, cy, rad, 0, Math.PI * 2);
      a.fill();
    });
  }

  return {
    map: toTexture(albedoC, true, aniso),
    roughnessMap: toTexture(roughC, false, aniso),
    bumpMap: toTexture(bumpC, false, aniso),
  };
}

/**
 * Fine tooth for the ceramic. Glaze is not perfectly smooth, and without a
 * little break-up the bowl reads as a CAD render rather than a thrown pot.
 */
export function glazeBump(aniso: number): THREE.Texture {
  const S = 256;
  const [c, x] = canvas(S);
  const random = rng(4242);
  x.fillStyle = "#808080";
  x.fillRect(0, 0, S, S);
  const img = x.getImageData(0, 0, S, S);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = 128 + (random() - 0.5) * 26;
    img.data[i] = n;
    img.data[i + 1] = n;
    img.data[i + 2] = n;
  }
  x.putImageData(img, 0, 0);
  // A handful of glaze pools, which is where a real bowl catches the light.
  for (let i = 0; i < 26; i += 1) {
    const cx = random() * S;
    const cy = random() * S;
    const rad = 6 + random() * 26;
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, rad);
    g.addColorStop(0, "rgba(160,160,160,0.5)");
    g.addColorStop(1, "rgba(128,128,128,0)");
    x.fillStyle = g;
    x.beginPath();
    x.arc(cx, cy, rad, 0, Math.PI * 2);
    x.fill();
  }
  const t = toTexture(c, false, aniso);
  t.repeat.set(3, 3);
  return t;
}

/**
 * A soft, slightly uneven puff for the steam billboards. Perfectly circular
 * steam reads as a bokeh dot, so the alpha is knocked about a little.
 */
export function steamSprite(): THREE.Texture {
  const S = 128;
  const [c, x] = canvas(S);
  const random = rng(90210);
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, "rgba(255,255,255,0.85)");
  g.addColorStop(0.35, "rgba(255,255,255,0.42)");
  g.addColorStop(0.72, "rgba(255,255,255,0.1)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  x.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 22; i += 1) {
    const a = random() * Math.PI * 2;
    const d = 12 + random() * 44;
    const rad = 8 + random() * 22;
    const hole = x.createRadialGradient(
      S / 2 + Math.cos(a) * d,
      S / 2 + Math.sin(a) * d,
      0,
      S / 2 + Math.cos(a) * d,
      S / 2 + Math.sin(a) * d,
      rad,
    );
    hole.addColorStop(0, "rgba(0,0,0,0.32)");
    hole.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = hole;
    x.fillRect(0, 0, S, S);
  }
  x.globalCompositeOperation = "source-over";
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A plain soft dot, for dust motes and the pool of light behind the dish. */
export function radialSprite(inner: string, outer: string, falloff = 0.5): THREE.Texture {
  const S = 256;
  const [c, x] = canvas(S);
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, inner);
  g.addColorStop(falloff, outer.replace(/[\d.]+\)$/, "0.16)"));
  g.addColorStop(1, outer);
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * The environment the PBR materials reflect: a painted studio rather than a
 * downloaded HDRI, so there is no third-party request at runtime and the
 * highlights are art-directed rather than inherited.
 *
 * It is deliberately dark. `scene.environment` feeds diffuse irradiance as
 * well as specular, and a bright map floods the shadow side and throws away
 * the contrast the whole look depends on. The small hot softbox is what puts
 * the wet highlight on the broth and the glaze.
 */
export function studioEnvironment(gl: THREE.WebGLRenderer): THREE.Texture {
  const W = 512;
  const H = 256;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d") as CanvasRenderingContext2D;

  const sky = x.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#241d16");
  sky.addColorStop(0.42, "#151009");
  sky.addColorStop(0.66, "#0b0806");
  sky.addColorStop(1, "#070505");
  x.fillStyle = sky;
  x.fillRect(0, 0, W, H);

  const box = (cx: number, cy: number, rx: number, ry: number, col: string) => {
    const g = x.createRadialGradient(cx, cy, 1, cx, cy, Math.max(rx, ry));
    g.addColorStop(0, col);
    g.addColorStop(1, col.replace(/[\d.]+\)$/, "0)"));
    x.save();
    x.translate(cx, cy);
    x.scale(1, ry / rx);
    x.translate(-cx, -cy);
    x.fillStyle = g;
    x.beginPath();
    x.arc(cx, cy, Math.max(rx, ry), 0, Math.PI * 2);
    x.fill();
    x.restore();
  };
  // Key softbox, warm; a gold kicker behind; a whisper of green from the side.
  box(W * 0.28, H * 0.18, 122, 78, "rgba(255,231,190,0.55)");
  box(W * 0.8, H * 0.3, 86, 60, "rgba(255,150,52,0.4)");
  box(W * 0.55, H * 0.52, 70, 44, "rgba(110,168,118,0.14)");

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(gl);
  pmrem.compileEquirectangularShader();
  const env = pmrem.fromEquirectangular(tex).texture;
  pmrem.dispose();
  tex.dispose();
  return env;
}
