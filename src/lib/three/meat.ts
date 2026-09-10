import * as THREE from "three";

interface Tone {
  base: number[]; grain: number[]; fat: number[]; sear: number[];
  char: number; charLo: number; charHi: number; grainAlpha: number;
}

/* ------------------------------------------------------------------ *
 * Grilled meat, built rather than photographed.
 *
 * A flat-shaded ball reads as a bead, not as food. What sells real meat
 * is surface: muscle grain running one way, pale fat marbling across it,
 * charred bark where the coals touched, and a wet sheen that is glossy
 * exactly where the char is not. So each chunk gets a painted albedo, a
 * roughness map that disagrees with it, and a bump map derived from both.
 * ------------------------------------------------------------------ */

/* Deterministic hash noise. Seeded so the server and the client, and one
   reload and the next, produce the identical piece of meat. */
function mulberry(seed: number) {
  let a = (seed*1831565813)|0;
  return function(){
    a = (a + 0x6D2B79F5)|0;
    let t = Math.imul(a ^ (a>>>15), 1|a);
    t = (t + Math.imul(t ^ (t>>>7), 61|t)) ^ t;
    return ((t ^ (t>>>14))>>>0) / 4294967296;
  };
}
function hash3(x: number, y: number, z: number) {
  let h = Math.sin(x*127.1 + y*311.7 + z*74.7) * 43758.5453;
  return h - Math.floor(h);
}
const fade = (t: number) => t * t * (3 - 2 * t);
function noise3(x: number, y: number, z: number) {
  const xi=Math.floor(x), yi=Math.floor(y), zi=Math.floor(z);
  const xf=fade(x-xi), yf=fade(y-yi), zf=fade(z-zi);
  let n = 0;
  for(let dz=0; dz<2; dz++) for(let dy=0; dy<2; dy++) for(let dx=0; dx<2; dx++){
    const w = (dx?xf:1-xf)*(dy?yf:1-yf)*(dz?zf:1-zf);
    n += w * hash3(xi+dx, yi+dy, zi+dz);
  }
  return n;
}
function fbm3(x: number, y: number, z: number) {
  return noise3(x,y,z)*.6 + noise3(x*2.1,y*2.1,z*2.1)*.27 + noise3(x*4.3,y*4.3,z*4.3)*.13;
}

/* --- the painted surface ------------------------------------------- */

export type MeatKind = "beef" | "pork";

const MEAT_TONE: Record<MeatKind, Tone> = {
  /* Grilled beef is mahogany going to near-black at the bark; pork is a
     deep caramel. Both were far too light before and read as terracotta. */
  beef: { base:[96,40,24], grain:[52,20,12], fat:[150,118,90],  sear:[22,11,7],
          char:62, charLo:.42, charHi:.9, grainAlpha:1 },
  pork: { base:[172,101,55], grain:[122,62,30], fat:[201,158,116], sear:[62,30,15],
          char:44, charLo:.32, charHi:.68, grainAlpha:.62 }
};

export function meatSurface(kind: MeatKind, seed: number) {
  const S = 256;
  const tone = MEAT_TONE[kind];
  const rnd = mulberry(seed*7919 + (kind==="beef"?11:29));

  const alb = document.createElement("canvas"); alb.width = alb.height = S;
  const rgh = document.createElement("canvas"); rgh.width = rgh.height = S;
  const bmp = document.createElement("canvas"); bmp.width = bmp.height = S;
  /* Non-null: a 2d context is only unavailable if the canvas is already
     bound to another context type, which cannot happen for one we just made. */
  const a = alb.getContext("2d") as CanvasRenderingContext2D;
  const r = rgh.getContext("2d") as CanvasRenderingContext2D;
  const b = bmp.getContext("2d") as CanvasRenderingContext2D;

  const rgb = (c: readonly number[]) => "rgb("+c[0]+","+c[1]+","+c[2]+")";
  a.fillStyle = rgb(tone.base); a.fillRect(0,0,S,S);
  /* mid roughness: meat is neither chalk nor glass */
  r.fillStyle = "#b4b4b4"; r.fillRect(0,0,S,S);
  b.fillStyle = "#808080"; b.fillRect(0,0,S,S);

  /* 1. muscle grain: short strokes all running one way, like cut fibre */
  const grainAngle = rnd()*Math.PI;
  a.save(); a.translate(S/2,S/2); a.rotate(grainAngle); a.translate(-S/2,-S/2);
  b.save(); b.translate(S/2,S/2); b.rotate(grainAngle); b.translate(-S/2,-S/2);
  for(let i=0;i<420;i++){
    const x = rnd()*S, y = rnd()*S, len = 9+rnd()*30, w = .6+rnd()*1.4;
    const dark = rnd() < .62;
    const c = dark ? tone.grain : tone.fat;
    a.strokeStyle = "rgba("+c[0]+","+c[1]+","+c[2]+","+((.10+rnd()*.22)*tone.grainAlpha)+")";
    a.lineWidth = w; a.beginPath(); a.moveTo(x,y); a.lineTo(x+len, y+(rnd()-.5)*5); a.stroke();
    b.strokeStyle = dark ? "rgba(60,60,60,.30)" : "rgba(210,210,210,.30)";
    b.lineWidth = w; b.beginPath(); b.moveTo(x,y); b.lineTo(x+len, y+(rnd()-.5)*5); b.stroke();
  }
  /* 2. fat marbling: longer, brighter, fewer */
  for(let i=0;i<26;i++){
    const x = rnd()*S, y = rnd()*S;
    a.strokeStyle = "rgba("+tone.fat[0]+","+tone.fat[1]+","+tone.fat[2]+","+((.22+rnd()*.3)*tone.grainAlpha)+")";
    a.lineWidth = 1+rnd()*2.6; a.beginPath(); a.moveTo(x,y);
    a.bezierCurveTo(x+30,y+(rnd()-.5)*22, x+62,y+(rnd()-.5)*26, x+96,y+(rnd()-.5)*14);
    a.stroke();
    b.strokeStyle = "rgba(226,226,226,.34)"; b.lineWidth = 1+rnd()*2.6;
    b.beginPath(); b.moveTo(x,y);
    b.bezierCurveTo(x+30,y+(rnd()-.5)*22, x+62,y+(rnd()-.5)*26, x+96,y+(rnd()-.5)*14);
    b.stroke();
  }
  a.restore(); b.restore();

  /* 3. char: soft dark patches, and the roughness climbs wherever they land */
  for(let i=0;i<tone.char;i++){
    const x = rnd()*S, y = rnd()*S, rad = 10+rnd()*44;
    const g = a.createRadialGradient(x,y,1,x,y,rad);
    const o = tone.charLo + rnd()*(tone.charHi - tone.charLo);
    g.addColorStop(0, "rgba("+tone.sear[0]+","+tone.sear[1]+","+tone.sear[2]+","+o+")");
    g.addColorStop(1, "rgba("+tone.sear[0]+","+tone.sear[1]+","+tone.sear[2]+",0)");
    a.fillStyle = g; a.beginPath(); a.arc(x,y,rad,0,7); a.fill();

    const gr = r.createRadialGradient(x,y,1,x,y,rad);
    gr.addColorStop(0,"rgba(240,240,240,"+(o*.9)+")"); gr.addColorStop(1,"rgba(240,240,240,0)");
    r.fillStyle = gr; r.beginPath(); r.arc(x,y,rad,0,7); r.fill();

    const gb = b.createRadialGradient(x,y,1,x,y,rad);
    gb.addColorStop(0,"rgba(46,46,46,"+(o*.7)+")"); gb.addColorStop(1,"rgba(46,46,46,0)");
    b.fillStyle = gb; b.beginPath(); b.arc(x,y,rad,0,7); b.fill();
  }

  /* 4. bars off the grill: hard scorch lines, the giveaway that it was
        cooked over coals rather than in a pan */
  const barAngle = grainAngle + Math.PI/2 + (rnd()-.5)*.5;
  a.save(); a.translate(S/2,S/2); a.rotate(barAngle); a.translate(-S/2,-S/2);
  r.save(); r.translate(S/2,S/2); r.rotate(barAngle); r.translate(-S/2,-S/2);
  b.save(); b.translate(S/2,S/2); b.rotate(barAngle); b.translate(-S/2,-S/2);
  /* Soft-edged, or the box's per-face UVs turn a hard rectangle into a
     band of string wrapped right around the cube. */
  for(let i=0;i<2;i++){
    const y = 44 + i*((S-88)) + (rnd()-.5)*34, h = 20+rnd()*18;
    const band = (ctx: CanvasRenderingContext2D, col: string, peak: number) => {
      const g = ctx.createLinearGradient(0, y, 0, y+h);
      g.addColorStop(0,   col.replace("A","0"));
      g.addColorStop(.5,  col.replace("A", String(peak)));
      g.addColorStop(1,   col.replace("A","0"));
      ctx.fillStyle = g; ctx.fillRect(-S*.5, y, S*2, h);
    };
    band(a, "rgba(16,8,5,A)",     (kind==="beef" ? .58 : .34) + rnd()*.18);
    band(r, "rgba(250,250,250,A)", .5);
    band(b, "rgba(30,30,30,A)",    .44);
  }
  a.restore(); r.restore(); b.restore();

  /* 5. pores: fine dark and light specks, the detail that stops the
        surface reading as paint rather than flesh */
  for(let i=0;i<2600;i++){
    const x = rnd()*S, y = rnd()*S, rad = .5+rnd()*1.7, dark = rnd()<.6;
    a.fillStyle = dark ? "rgba(20,10,6,"+(.10+rnd()*.24)+")"
                       : "rgba(255,232,205,"+(.05+rnd()*.14)+")";
    a.beginPath(); a.arc(x,y,rad,0,7); a.fill();
    b.fillStyle = dark ? "rgba(40,40,40,.30)" : "rgba(220,220,220,.24)";
    b.beginPath(); b.arc(x,y,rad,0,7); b.fill();
  }

  /* 6. wet sheen: glaze pools that stay glossy where the char did not take */
  for(let i=0;i<30;i++){
    const x = rnd()*S, y = rnd()*S, rad = 6+rnd()*26;
    const g = r.createRadialGradient(x,y,1,x,y,rad);
    g.addColorStop(0,"rgba(10,10,10,"+(.55+rnd()*.4)+")"); g.addColorStop(1,"rgba(10,10,10,0)");
    r.fillStyle = g; r.beginPath(); r.arc(x,y,rad,0,7); r.fill();
  }

  return {alb, rgh, bmp};
}

/* --- the shape ------------------------------------------------------ */

/* A cube of meat is not a ball. Start from a box so the cut corners stay
   legible, round it most of the way, then push it out of true with noise
   so no two chunks on the skewer are the same piece. */
export function meatGeometry(size: number, seed: number) {
  const geo = new THREE.BoxGeometry(1,1,1, 16,16,16);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3(), n = new THREE.Vector3();
  const o = seed*3.77;
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    n.copy(v).normalize();
    v.lerp(n.multiplyScalar(.60), .54);                  /* knock the corners off, keep the facets */
    const d = 1
      + .26*(fbm3(v.x*2.4+o,  v.y*2.4+o*1.7, v.z*2.4+o*2.3) - .5)
      + .10*(fbm3(v.x*7.0+o*3, v.y*7.0+o,     v.z*7.0+o*2)   - .5)
      + .04*(fbm3(v.x*17.+o*5, v.y*17.+o*2,   v.z*17.+o*4)   - .5);
    v.multiplyScalar(d * size);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.deleteAttribute("normal");
  geo.computeVertexNormals();
  return geo;
}
