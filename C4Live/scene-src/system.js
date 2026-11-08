// The world's systems (v10, owner 2026-11-08: "I want the star system on the same map, all the way zoomable"). EVERY system
// is permanently in the world at its map position: its star, its bodies on their orbits, its starbase, its claim stakes,
// and (written by main.js into the one fleet instancing) its ships. There is no system "view", no enter / exit and no
// build on approach: zoom is one continuous camera move, and what is drawn follows ON-SCREEN SIZE only (no mode):
//   star      the galaxy glyph (main.js SYS_VS) hands over to the star itself between STAR_PX px of star disc radius
//   orbits    one instanced ring set, faded in by ring radius RING_PX px; constant ~1 px line
//   bodies    one instanced billboard set (planets, asteroids, stars), faded in by disc radius BODY_PX px; a lit-sphere
//             placeholder (procedural rock for asteroids) until the owner's render arrives - requested once a body is
//             over ART_PX px, drawn into ONE atlas (26 renders x 384 px: the whole art set, so the "LRU cap" is the
//             atlas itself, nothing is ever evicted) and cross-faded in over ART_FADE_S
//   starbase  one instanced station glyph per system; stakes one instanced diamond per claim stake
// Layout is stylised (the chain has no in-system positions, model.js systemLayout) and scaled per system by
// model.js systemScales (WORLD.K, squeezed where a neighbour is close). Bodies orbit on the GPU (uAnim); the CPU mirrors
// the same maths (bodyPos) for picking, labels and bodyScreen. Positions are rendered CAMERA-RELATIVE (REL_GLSL): at the
// closest zoom a map unit is ~40,000 px and float32 world coordinates near 50 would jitter by ~0.2 px otherwise.
import * as THREE from 'three';
import * as M from './model.js';

// v11: every LOD band fades by LOG px (lodS / GLSL lodS) over a factor of 4, so one wheel notch moves any layer's opacity
// by <= ~0.15 (a linear-px band over x2.5 moved bodies 0.30 in one step - test v10 (a))
export const BODY_PX = [0.8, 3.2];   // body disc radius px: fade-in band (picking needs the band's middle)
export const RING_PX = [3.5, 14];      // orbit ring radius px: fade-in band
export const STAR_PX = [2.5, 10];      // star disc radius px: glyph -> star hand-over (main.js SYS_VS uses the same band)
export const SB_PX = [1, 4];       // station half-size px
export const STAKE_PX = [0.8, 3.2];    // stake marker half-size px
export const ART_PX = 12;            // body disc radius px from which its render is requested
const ART_FADE_S = 0.4, ART_CELL = 384, ART_COLS = 6, ART_ROWS = 5;
const PLANET_SLUGS = ['gas', 'ice', 'terrestrial', 'oceanic', 'volcanic', 'barren', 'dark'];
const ART_FILES = [...PLANET_SLUGS.flatMap((s) => [0, 1, 2].map((v) => `${s}_${v}_384.webp`)), ...[0, 1, 2, 3, 4].map((i) => `star_${i}_384.webp`)];
const SLUG_COLOR = {gas: [0.85, 0.7, 0.5], ice: [0.55, 0.82, 1.0], terrestrial: [0.45, 0.75, 0.45], oceanic: [0.2, 0.5, 1.0],
  volcanic: [1.0, 0.45, 0.2], barren: [0.62, 0.6, 0.58], dark: [0.35, 0.35, 0.55], belt: [0.6, 0.55, 0.5]};

// camera-relative world -> view (shared with main.js). c = a map point (float32-exact attribute), loc = a small world-unit
// offset: (c - camera) is formed first, so the offset keeps its precision at any zoom. Map y = -world z; plane y = 0.
export const REL_GLSL = /* glsl */`
uniform float uViewH;
vec3 relOf(vec2 c, vec2 loc) { return vec3((c.x - cameraPosition.x) + loc.x, -cameraPosition.y, (-c.y - cameraPosition.z) - loc.y); }
vec3 viewOf(vec3 r) { return mat3(viewMatrix) * r; }
float lodS(float a, float b, float x) { return smoothstep(log2(a), log2(b), log2(max(x, 1e-6))); } // LOD fade by log px (v11)
float ppuOf(vec3 v) { return projectionMatrix[1][1] * 0.5 * uViewH / max(-v.z, 1e-7); }
vec4 clipOf(vec3 v) { return projectionMatrix * vec4(v, 1.0); }
#define COLLAPSE { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
`;

const BODY_VS = REL_GLSL + /* glsl */`
uniform float uAnim; uniform float uTime; uniform float uHiId;
attribute vec4 iP;  // (system x, y, orbit radius world, a0)
attribute vec4 iQ;  // (angular speed, disc radius world, kind 0 planet / 1 asteroid / 2 star, art cell or -1)
attribute vec3 iC;  // placeholder colour
attribute vec4 iW;  // worked rock: (miners, rate 0..1, hull px at this zoom computed here, seed)
attribute vec3 iWC; // its faction colour
attribute float iArt; // uTime when the render arrived (cross-fade), -1 = none yet
varying vec2 vP; varying vec3 vCol; varying float vKind; varying float vCell; varying float vA; varying float vArtK; varying float vQs;
varying vec4 vW; varying vec3 vWC; varying float vHi; varying float vSeed; varying float vShips;
void main() {
  float a = iP.w + iQ.x * uAnim;
  vec2 loc = iP.z * vec2(cos(a), sin(a));
  vec3 v = viewOf(relOf(iP.xy, loc));
  float ppu = ppuOf(v), rpx = iQ.y * ppu;
  int kind = int(iQ.z + 0.5);
  float al = kind == 2 ? lodS(${STAR_PX[0].toFixed(2)}, ${STAR_PX[1].toFixed(2)}, rpx) : lodS(${BODY_PX[0].toFixed(2)}, ${BODY_PX[1].toFixed(2)}, rpx);
  if (al < 0.002) COLLAPSE
  // quad half-size in disc radii: room for the star's corona / the hover ring / a worked rock's indicator ring
  float qs = kind == 2 ? 2.6 : (iW.x > 0.5 ? 1.75 : 1.25);
  // the renders are lit from screen angle 145 deg (upper-left): turn the sprite so that side faces the star (kind 2: none)
  float ang = 0.0;
  if (kind != 2) { vec3 ts = mat3(viewMatrix) * vec3(-loc.x, 0.0, loc.y); if (dot(ts.xy, ts.xy) > 1e-20) ang = atan(ts.y, ts.x + 1e-12) - 2.5307274; }
  float c = cos(ang), s = sin(ang);
  vec2 q = position.xy; vec2 rq = vec2(c * q.x - s * q.y, s * q.x + c * q.y);
  vP = position.xy * 2.0; vQs = qs; vCol = iC; vKind = float(kind); vCell = iQ.w; vA = al;
  vArtK = iArt < 0.0 ? 0.0 : clamp((uTime - iArt) / ${ART_FADE_S.toFixed(2)}, 0.0, 1.0);
  vW = iW; vWC = iWC; vHi = abs(float(gl_InstanceID) - uHiId) < 0.5 ? 1.0 : 0.0; vSeed = iW.w;
  // the miners' hulls on this rock: a medium hull's px here (the indicator dims as the ships themselves show)
  vShips = smoothstep(1.5, 4.0, ${M.HULL_LEN.medium.toFixed(6)} / 0.92 * ppu);
  gl_Position = clipOf(v + vec3(rq * iQ.y * qs * 2.0, 0.0));
}`;
const BODY_FS = /* glsl */`
uniform sampler2D uArt; uniform float uAnim;
varying vec2 vP; varying vec3 vCol; varying float vKind; varying float vCell; varying float vA; varying float vArtK; varying float vQs;
varying vec4 vW; varying vec3 vWC; varying float vHi; varying float vSeed; varying float vShips;
vec4 artAt(vec2 uv) {
  float cell = floor(vCell + 0.5), cx = mod(cell, ${ART_COLS.toFixed(1)}), cy = floor(cell / ${ART_COLS.toFixed(1)});
  vec4 t = texture2D(uArt, vec2((cx + uv.x) / ${ART_COLS.toFixed(1)}, 1.0 - (cy + 1.0 - uv.y) / ${ART_ROWS.toFixed(1)}));
  return vec4(t.rgb * t.a, t.a);
}
void main() {
  vec2 p = vP * vQs; float r = length(p); float fw = max(fwidth(r), 1e-4);
  vec4 t = vec4(0.0);
  int kind = int(vKind + 0.5);
  if (kind == 2) {
    // star: a hot core + corona until the render arrives (disc = 0.3846 of the render's half-size)
    vec4 ph = vec4(vCol * (exp(-r * r * 1.2) * 1.5 + exp(-r * 1.6) * 0.35) * smoothstep(${(2.6).toFixed(1)}, 1.6, r), 0.0);
    vec2 uv = 0.5 + 0.5 * p * 0.3846;
    vec4 art = (vCell >= 0.0 && max(abs(uv.x - 0.5), abs(uv.y - 0.5)) < 0.5) ? artAt(uv) : vec4(0.0);
    t = mix(ph, art, vArtK);
  } else if (kind == 1) {
    // asteroid: a lumpy, cratered rock lit from the sprite's upper-left (= the star after the turn)
    float an = atan(p.y, p.x);
    float edge = 1.0 + 0.11 * sin(an * 3.0 + vSeed * 40.0) + 0.06 * sin(an * 7.0 + vSeed * 17.0);
    float a = 1.0 - smoothstep(edge - fw, edge + fw, r);
    vec2 s = p / edge; float rs = min(length(s), 1.0);
    vec3 n = normalize(vec3(s + 0.18 * vec2(sin(s.y * 9.0 + vSeed * 30.0), sin(s.x * 8.0 + vSeed * 12.0)), sqrt(max(0.0, 1.0 - rs * rs)) + 0.05));
    float l = clamp(dot(n, normalize(vec3(-0.6, 0.5, 0.65))), 0.0, 1.0);
    float crater = smoothstep(0.16, 0.1, length(s - vec2(0.3, -0.2) * (0.5 + vSeed))) * 0.35 + smoothstep(0.12, 0.07, length(s + vec2(0.35, 0.1))) * 0.3;
    t = vec4(vCol * 0.55 * (0.08 + 1.05 * l) * (1.0 - crater) * a, a);
  } else {
    float a = 1.0 - smoothstep(1.0 - fw, 1.0 + fw, r);
    vec3 n = vec3(p, sqrt(max(0.0, 1.0 - r * r)));
    float l = clamp(dot(n, normalize(vec3(-0.6, 0.5, 0.65))), 0.0, 1.0);
    vec4 ph = vec4(vCol * (0.12 + 0.88 * l) * a, a);
    vec2 uv = 0.5 + 0.5 * p * 0.6803;
    vec4 art = (vCell >= 0.0 && max(abs(uv.x - 0.5), abs(uv.y - 0.5)) < 0.5) ? artAt(uv) : vec4(0.0);
    t = mix(ph, art, vArtK);
  }
  // hover ring
  t.rgb += vec3(0.75, 1.0, 1.0) * (1.0 - smoothstep(0.0, fw * 1.5, abs(r - 1.16))) * vHi * 0.9;
  // worked rock (task #32): one dash per miner (capped 48) on a ring at 1.5 R, turning, faction-coloured, brightness by
  // the live u/s; it dims to 35 % while the ships themselves show
  if (vW.x > 0.5) {
    float ang = atan(p.y, p.x + 1e-5) / 6.2831853 + 0.5;
    float u = fract(ang - uAnim * 0.035 + vSeed);
    float dash = step(fract(u * min(vW.x, 48.0)), 0.55);
    float ring = (1.0 - smoothstep(0.0, fw * 1.5, abs(r - 1.5))) * dash;
    float halo = exp(-pow((r - 1.5) / 0.18, 2.0)) * (0.12 + 0.3 * vW.y);
    t.rgb += vWC * (ring * (0.9 + 0.8 * vW.y) + halo) * mix(1.0, 0.35, vShips);
  }
  gl_FragColor = t * vA;
}`;

const RING_VS = REL_GLSL + /* glsl */`
attribute vec4 iP; // (system x, y, orbit radius world, belt 0/1)
varying vec2 vP; varying float vA; varying float vBelt;
void main() {
  vec3 c = viewOf(relOf(iP.xy, vec2(0.0)));
  float rpx = iP.z * ppuOf(c);
  float al = lodS(${RING_PX[0].toFixed(2)}, ${RING_PX[1].toFixed(2)}, rpx);
  if (al < 0.002) COLLAPSE
  vP = position.xy * 2.0; vA = al; vBelt = iP.w;
  gl_Position = clipOf(viewOf(relOf(iP.xy, position.xy * 2.0 * iP.z)));
}`;
const RING_FS = /* glsl */`
varying vec2 vP; varying float vA; varying float vBelt;
void main() {
  float d = length(vP), fw = max(fwidth(d), 1e-6);
  float line = 1.0 - smoothstep(0.0, fw * 1.3, abs(d - 1.0));
  vec3 c = vec3(0.05, 0.17, 0.22) * line;
  if (vBelt > 0.5) {
    // an asteroid's orbit: world-scale rubble - two round grains per angular cell (720 cells), scattered +-2.5 % of the
    // radius about the orbit; a grain thinner than a pixel is drawn 1 px wide with its alpha scaled down (no shimmer)
    float an = atan(vP.y, vP.x) / 6.2831853 * 720.0, ci = floor(an);
    for (int j = 0; j < 2; j++) {
      float fj = float(j);
      float h1 = fract(sin(ci * 12.9898 + fj * 4.1) * 43758.5453), h2 = fract(sin(ci * 78.233 + fj * 9.7) * 24634.6345), h3 = fract(sin(ci * 37.719 + fj * 2.3) * 12345.678);
      vec2 g = vec2((fract(an) - 0.15 - 0.7 * h2) * 6.2831853 / 720.0 * d, d - (1.0 + (h1 - 0.5) * 0.05));
      float gs = 0.0007 + 0.0016 * h3, ge = max(gs, fw * 0.6);
      float gd = (1.0 - smoothstep(ge - fw * 0.5, ge + fw * 0.5, length(g))) * gs / ge;
      c += vec3(0.55, 0.5, 0.45) * gd * (0.35 + 0.4 * h3);
    }
  }
  gl_FragColor = vec4(c * vA, 1.0);
}`;

const SB_VS = REL_GLSL + /* glsl */`
attribute vec4 iP; // (system x, y, station local x, y world)
attribute vec4 iQ; // (half-size world, level, 0, 0)
attribute vec3 iC;
uniform float uHiSys;
varying vec2 vP; varying vec3 vCol; varying float vLvl; varying float vA; varying float vHi;
void main() {
  vec3 v = viewOf(relOf(iP.xy, iP.zw));
  float px = iQ.x * ppuOf(v);
  float al = lodS(${SB_PX[0].toFixed(2)}, ${SB_PX[1].toFixed(2)}, px);
  if (al < 0.002) COLLAPSE
  vP = position.xy * 2.0; vCol = iC; vLvl = iQ.y; vA = al; vHi = abs(float(gl_InstanceID) - uHiSys) < 0.5 ? 1.0 : 0.0;
  gl_Position = clipOf(v + vec3(position.xy * iQ.x * 2.0, 0.0));
}`;
const SB_FS = /* glsl */`
uniform float uAnim;
varying vec2 vP; varying vec3 vCol; varying float vLvl; varying float vA; varying float vHi;
void main() {
  vec2 p = vP; vec2 q = abs(p); float r = length(p);
  float hx = max(q.x * 0.8660254 + q.y * 0.5, q.y);
  float ring = smoothstep(0.05, 0.0, abs(hx - 0.55));
  float fill = smoothstep(0.57, 0.52, hx);
  float ang = atan(p.y, p.x + 1e-5) + 3.14159265;
  float seg = floor(ang / 6.2831853 * 6.0);
  float ticks = step(seg, vLvl - 0.5) * smoothstep(0.04, 0.0, abs(r - 0.8)) * step(0.2, fract(ang / 6.2831853 * 6.0));
  float pulse = 0.75 + 0.25 * sin(uAnim * 2.0);
  vec3 c = vCol * (ring * 1.5 + fill * 0.35 + ticks * 1.2) * pulse + vec3(1.0) * exp(-r * r * 40.0) * 0.6;
  c += vec3(0.75, 1.0, 1.0) * smoothstep(0.03, 0.0, abs(r - 0.95)) * vHi;
  gl_FragColor = vec4(c, fill * 0.85) * vA;
}`;

const STAKE_VS = REL_GLSL + /* glsl */`
uniform float uAnim;
attribute vec4 iP; // (system x, y, planet orbit radius world, a0)
attribute vec4 iQ; // (angular speed, slot angle, ring radius world, half-size world)
attribute vec3 iC;
varying vec2 vP; varying vec3 vCol; varying float vA;
void main() {
  float a = iP.w + iQ.x * uAnim;
  vec2 loc = iP.z * vec2(cos(a), sin(a)) + iQ.z * vec2(cos(iQ.y), sin(iQ.y));
  vec3 v = viewOf(relOf(iP.xy, loc));
  float px = iQ.w * ppuOf(v);
  float al = lodS(${STAKE_PX[0].toFixed(2)}, ${STAKE_PX[1].toFixed(2)}, px);
  if (al < 0.002) COLLAPSE
  vP = position.xy * 2.0; vCol = iC; vA = al;
  gl_Position = clipOf(v + vec3(position.xy * iQ.w * 2.0, 0.0));
}`;
const STAKE_FS = /* glsl */`
varying vec2 vP; varying vec3 vCol; varying float vA;
void main() {
  float d = abs(vP.x) + abs(vP.y);
  float body = smoothstep(0.62, 0.56, d), edge = smoothstep(0.08, 0.0, abs(d - 0.62)), flag = smoothstep(0.32, 0.26, d);
  vec3 c = mix(vec3(0.02), vCol * 1.3, body) + vCol * edge * 0.8 + vec3(1.0) * flag * 0.35;
  float a = smoothstep(0.7, 0.62, d);
  gl_FragColor = vec4(c * a, a * 0.95) * vA;
}`;

export function createWorld(ctx) {
  const {scene, camera, U, quadGeometry, instanceAttrs, shaderMat, assetBase} = ctx;
  // ---- the art atlas (26 renders, loaded on demand)
  const canvas = document.createElement('canvas');
  canvas.width = ART_COLS * ART_CELL; canvas.height = ART_ROWS * ART_CELL;
  const c2d = canvas.getContext('2d');
  const artTex = new THREE.CanvasTexture(canvas);
  artTex.colorSpace = THREE.SRGBColorSpace; artTex.anisotropy = 4;
  const artState = ART_FILES.map(() => 0); // 0 none, 1 requested, 2 loaded, 3 failed
  let texRequested = 0, texLoaded = 0, texFailed = 0, artDirty = false, artUploadAt = 0;
  const cellOfFile = new Map(ART_FILES.map((f, i) => [f, i]));

  const bodyGeo = quadGeometry(), ringGeo = quadGeometry(), sbGeo = quadGeometry(), stakeGeo = quadGeometry();
  const bU = {uAnim: U.uAnim, uTime: U.uTime, uViewH: U.uViewH, uArt: {value: artTex}, uHiId: {value: -1}};
  const bodies = new THREE.Mesh(bodyGeo, shaderMat(BODY_VS, BODY_FS, bU, null, 'premult'));
  const rings = new THREE.Mesh(ringGeo, shaderMat(RING_VS, RING_FS, {uViewH: U.uViewH}, null, 'add'));
  const sbU = {uAnim: U.uAnim, uViewH: U.uViewH, uHiSys: {value: -1}};
  const stations = new THREE.Mesh(sbGeo, shaderMat(SB_VS, SB_FS, sbU, null, 'premult'));
  const stakes = new THREE.Mesh(stakeGeo, shaderMat(STAKE_VS, STAKE_FS, {uAnim: U.uAnim, uViewH: U.uViewH}, null, 'premult'));
  // order: rings over the territory, then stations / bodies; fleets (main.js, 5) draw over the bodies
  for (const [m, o] of [[rings, 3.4], [stations, 4.2], [bodies, 4.4], [stakes, 4.6]]) { m.frustumCulled = false; m.renderOrder = o; scene.add(m); }

  let W = null; // the built world: {infos, bodyAt, bySys, place}
  const BODY_SPEC = [['iP', 4], ['iQ', 4], ['iC', 3], ['iW', 4], ['iWC', 3], ['iArt', 1]];

  // D: main.js data (systems, bodiesBySys, members, fleets, stakes, ownerFa, seeds, kinds)
  function build(D) {
    const systems = D.systems, bySys = D.bodiesBySys || new Map();
    const scales = M.systemScales(systems, (a) => (bySys.get(a) || []).length);
    const infos = [], bodyAt = [], byAddr = new Map();
    for (let si = 0; si < systems.length; si++) {
      const s = systems[si], layout = M.systemLayout(bySys.get(s.a) || []), k = scales.get(s.a) || M.WORLD.K;
      const sb = M.starbaseLocal(s.a, layout);
      const info = {s, si, k, layout, ext: M.systemExtent(layout.length) * k, sb: [sb[0] * k, sb[1] * k], sbHalf: 0.16 * k, starR: M.SYS.starR * k,
        starCell: cellOfFile.get(`star_${Math.floor(M.seedOf(String(s.a) + ':star') * 5)}_384.webp`), b0: bodyAt.length, nb: layout.length,
        members: null, worked: new Map(), stakeN: new Map(), sx: 0, sy: 0, ppu: 0, extPx: 0, on: false};
      for (const L of layout) {
        const art = L.slug === 'belt' ? -1 : cellOfFile.get(`${L.slug}_${L.variant}_384.webp`);
        bodyAt.push({si, L, r: L.r * k, R: L.size * k, a0: L.a0, w: L.w, kind: L.b.k === 'asteroid' ? 1 : 0, cell: art == null ? -1 : art});
      }
      infos.push(info); byAddr.set(s.a, info);
    }
    const nb = bodyAt.length, nAll = nb + infos.length;
    const bodyIdx = new Map(bodyAt.map((b, i) => [b.L.b.a, i]));
    // ---- members: where each fleet at a system is drawn (main.js writes them into the fleet instancing)
    const place = new Array(D.fleets.length).fill(null);
    for (const info of infos) {
      const m = D.members && D.members.get(info.s.a); if (!m) continue;
      info.members = m;
      const k = info.k, cx = info.s.x, cy = info.s.y, tmp = [0, 0];
      m.docked.forEach((i, j) => {
        M.discOffset(j, 0.07, 0.016, tmp);
        place[i] = {mode: 1, A: [cx, cy, info.sb[0] + tmp[0] * k, info.sb[1] + tmp[1] * k], O: [info.sb[0], info.sb[1], 0, 1], T: [0, 0], si: info.si, role: 'docked'};
      });
      m.idle.forEach((i, j) => {
        M.discOffset(j, M.SYS.idleR0, 0.02, tmp);
        const lx = tmp[0] * k, ly = tmp[1] * k;
        place[i] = {mode: 1, A: [cx, cy, lx, ly], O: [lx, ly, 0, 1], T: [0, 0], si: info.si, role: 'idle'};
      });
      // miners: shells on the star-facing side of their rock (model.js minerSlot); the closest MINER.beamCap per system
      // (inner shells first) carry a beam
      const perRock = new Map(), miners = [];
      for (const i of m.mining) {
        const bi = bodyIdx.get(D.fleets[i].s.asteroid);
        if (bi == null || bodyAt[bi].si !== info.si) continue;
        const n = perRock.get(bi) || 0; perRock.set(bi, n + 1);
        miners.push({i, bi, j: n});
      }
      for (const e of miners) { const b = bodyAt[e.bi]; e.slot = M.minerSlot(e.j, perRock.get(e.bi), b.L.size); }
      miners.slice().sort((a, b) => a.slot.layer - b.slot.layer || a.j - b.j || a.bi - b.bi).forEach((e, n) => { e.beam = n < M.MINER.beamCap; });
      for (const e of miners) {
        const b = bodyAt[e.bi];
        place[e.i] = {mode: 2, A: [cx, cy, e.slot.r * k, e.slot.ang], O: [b.r, b.a0, b.w, 2], T: [b.R, e.beam ? 1 : 0], si: info.si, role: 'mining', bi: e.bi};
        const f = D.fleets[e.i], fa = f.npc ? 'unaligned' : M.factionKey(f.fa), u = M.fleetUps(f);
        let w = info.worked.get(e.bi); if (!w) info.worked.set(e.bi, w = {n: 0, ups: 0, byFa: {}});
        w.n++; w.ups += u; w.byFa[fa] = (w.byFa[fa] || 0) + u + 1e-9;
      }
      // claim-stake transfer: a loop between the station and the planet of the owner's stake here (else the first
      // claimed planet, else the first planet); no planet = parked at the station
      for (const i of m.cst) {
        const f = D.fleets[i];
        const own = (D.stakes || []).find((st) => st.o === f.o && bodyIdx.has(st.body) && bodyAt[bodyIdx.get(st.body)].si === info.si);
        let bi = own ? bodyIdx.get(own.body) : -1;
        if (bi < 0) { const L = info.layout.find((x) => x.b.k === 'planet' && x.b.claimed) || info.layout.find((x) => x.b.k === 'planet'); if (L) bi = bodyIdx.get(L.b.a); }
        place[i] = bi >= 0 ? {mode: 3, A: [cx, cy, info.sb[0], info.sb[1]], O: [bodyAt[bi].r, bodyAt[bi].a0, bodyAt[bi].w, 3], T: [0, 0], si: info.si, role: 'cst', bi}
          : {mode: 1, A: [cx, cy, info.sb[0], info.sb[1]], O: [info.sb[0], info.sb[1], 0, 1], T: [0, 0], si: info.si, role: 'cst'};
      }
    }
    // ---- bodies + stars
    const A = instanceAttrs(bodyGeo, BODY_SPEC, nAll);
    for (let i = 0; i < nb; i++) {
      const b = bodyAt[i], s = infos[b.si].s;
      A.iP.array.set([s.x, s.y, b.r, b.a0], i * 4);
      A.iQ.array.set([b.w, b.R, b.kind, artState[b.cell] === 2 ? b.cell : -1], i * 4);
      A.iC.array.set(SLUG_COLOR[b.L.slug] || SLUG_COLOR.barren, i * 3);
      const w = infos[b.si].worked.get(i);
      if (w) {
        const fa = Object.entries(w.byFa).sort((p, q) => q[1] - p[1])[0][0];
        A.iW.array.set([w.n, Math.min(1, Math.log10(1 + w.ups) / 3.2), 0, M.seedOf(b.L.b.a)], i * 4);
        A.iWC.array.set(M.FACTION_COLOR[fa], i * 3);
        b.work = {n: w.n, ups: w.ups, fa};
      } else { A.iW.array.set([0, 0, 0, M.seedOf(b.L.b.a)], i * 4); A.iWC.array.set([0, 0, 0], i * 3); b.work = null; }
      A.iArt.array[i] = artState[b.cell] === 2 ? -1e3 : -1;
    }
    for (let si = 0; si < infos.length; si++) {
      const info = infos[si], i = nb + si;
      A.iP.array.set([info.s.x, info.s.y, 0, 0], i * 4);
      A.iQ.array.set([0, info.starR, 2, artState[info.starCell] === 2 ? info.starCell : -1], i * 4);
      A.iC.array.set([1.0, 0.8, 0.45], i * 3);
      A.iW.array.set([0, 0, 0, 0], i * 4); A.iWC.array.set([0, 0, 0], i * 3);
      A.iArt.array[i] = artState[info.starCell] === 2 ? -1e3 : -1;
    }
    for (const k in A) A[k].needsUpdate = true;
    // ---- orbit rings (one per body)
    const R = instanceAttrs(ringGeo, [['iP', 4]], nb);
    for (let i = 0; i < nb; i++) { const b = bodyAt[i], s = infos[b.si].s; R.iP.array.set([s.x, s.y, b.r, b.kind], i * 4); }
    R.iP.needsUpdate = true;
    // ---- stations
    const S = instanceAttrs(sbGeo, [['iP', 4], ['iQ', 4], ['iC', 3]], infos.length);
    infos.forEach((info, si) => {
      S.iP.array.set([info.s.x, info.s.y, info.sb[0], info.sb[1]], si * 4);
      S.iQ.array.set([info.sbHalf, info.s.lvl || 0, 0, 0], si * 4);
      S.iC.array.set(M.FACTION_COLOR[M.factionKey(info.s.f)], si * 3);
    });
    for (const k in S) S[k].needsUpdate = true;
    // ---- claim stakes on their planets
    const stakeList = [];
    for (const st of D.stakes || []) {
      const bi = bodyIdx.get(st.body); if (bi == null) continue;
      const info = infos[bodyAt[bi].si], n = info.stakeN.get(bi) || 0; info.stakeN.set(bi, n + 1);
      stakeList.push({st, bi, k: n, fa: (D.ownerFa && D.ownerFa.get(st.o)) || 'unaligned'});
    }
    const K = instanceAttrs(stakeGeo, [['iP', 4], ['iQ', 4], ['iC', 3]], stakeList.length);
    stakeList.forEach((e, i) => {
      const b = bodyAt[e.bi], s = infos[b.si].s, k = infos[b.si].k;
      K.iP.array.set([s.x, s.y, b.r, b.a0], i * 4);
      K.iQ.array.set([b.w, e.k * 1.1 + 0.6, b.R * 1.35, 0.024 * k], i * 4);
      K.iC.array.set(M.FACTION_COLOR[M.factionKey(e.fa)], i * 3);
    });
    for (const k in K) K[k].needsUpdate = true;
    W = {infos, bodyAt, byAddr, bodyIdx, place, nb, stakeList};
    applyLayers();
    return W;
  }

  // ---- art: request a render once a body is big enough on screen; draw it into the atlas; cross-fade it in
  function requestArt(cell) {
    if (cell == null || cell < 0 || artState[cell]) return;
    artState[cell] = 1; texRequested++;
    const img = new Image();
    img.onload = () => {
      if (!W) return;
      c2d.drawImage(img, (cell % ART_COLS) * ART_CELL, Math.floor(cell / ART_COLS) * ART_CELL, ART_CELL, ART_CELL);
      artState[cell] = 2; texLoaded++; artDirty = true;
      const q = bodyGeo.getAttribute('iQ'), at = bodyGeo.getAttribute('iArt');
      for (let i = 0; i < W.bodyAt.length; i++) if (W.bodyAt[i].cell === cell) { q.array[i * 4 + 3] = cell; at.array[i] = U.uTime.value; }
      W.infos.forEach((info, si) => { if (info.starCell === cell) { q.array[(W.nb + si) * 4 + 3] = cell; at.array[W.nb + si] = U.uTime.value; } });
      q.needsUpdate = at.needsUpdate = true;
    };
    img.onerror = () => {
      // a render that fails to load (404, offline) keeps the lit-sphere placeholder; reported, never a vanished body
      artState[cell] = 3; texFailed++;
      console.warn('C4Scene: planet render failed to load, using the placeholder sphere:', ART_FILES[cell]);
    };
    img.src = assetBase + ART_FILES[cell];
  }
  // the atlas re-uploads at most every 200 ms (a burst of renders arriving = one upload)
  function flushArt(now) { if (artDirty && now - artUploadAt > 200) { artTex.needsUpdate = true; artDirty = false; artUploadAt = now; } }

  // world position of body bi at animation time `anim` (map coords), the SAME maths as BODY_VS
  function bodyPos(bi, anim, out = [0, 0]) {
    const b = W.bodyAt[bi], s = W.infos[b.si].s, a = b.a0 + b.w * anim;
    out[0] = s.x + b.r * Math.cos(a); out[1] = s.y + b.r * Math.sin(a);
    return out;
  }
  // ---- LOD pass (camera moved): each system's screen centre, px per unit at its depth, extent px; art requests
  const v3 = new THREE.Vector3(), vV = new THREE.Vector3();
  function lod(Wpx, Hpx) {
    if (!W) return;
    const P11 = camera.projectionMatrix.elements[5];
    for (const info of W.infos) {
      vV.set(info.s.x, 0, -info.s.y).applyMatrix4(camera.matrixWorldInverse);
      const depth = -vV.z;
      if (depth <= 1e-6) { info.on = false; info.extPx = 0; continue; }
      v3.set(info.s.x, 0, -info.s.y).project(camera);
      info.sx = (v3.x + 1) / 2 * Wpx; info.sy = (1 - v3.y) / 2 * Hpx;
      info.ppu = P11 * 0.5 * Hpx / depth; info.extPx = info.ext * info.ppu;
      info.on = info.sx > -info.extPx - 40 && info.sx < Wpx + info.extPx + 40 && info.sy > -info.extPx - 40 && info.sy < Hpx + info.extPx + 40;
      if (!info.on || info.extPx < 20) continue;
      if (info.starR * info.ppu >= ART_PX) requestArt(info.starCell);
      for (let i = info.b0; i < info.b0 + info.nb; i++) if (W.bodyAt[i].R * info.ppu >= ART_PX) requestArt(W.bodyAt[i].cell);
    }
  }

  // ---- layer switches: Fleets / Mining govern the ships (main.js); here only the worked-rock indicator follows Mining
  let layerMining = true;
  function applyLayers() {
    if (!W) return;
    const a = bodyGeo.getAttribute('iW');
    for (let i = 0; i < W.nb; i++) { const b = W.bodyAt[i]; a.array[i * 4] = b.work && layerMining ? b.work.n : 0; }
    a.needsUpdate = true;
  }
  function setLayers(fleets, mining) { layerMining = !!mining; applyLayers(); }
  function setVisible(on) { bodies.visible = rings.visible = stations.visible = stakes.visible = !!on; }
  function setHover(bi, si) { bU.uHiId.value = bi == null ? -1 : bi; sbU.uHiSys.value = si == null ? -1 : si; }

  function dispose() {
    for (const m of [bodies, rings, stations, stakes]) { scene.remove(m); m.geometry.dispose(); m.material.dispose(); }
    artTex.dispose(); W = null;
  }
  return {build, lod, bodyPos, requestArt, flushArt, setLayers, setVisible, setHover, dispose,
    get world() { return W; }, texStats: () => ({texRequested, texLoaded, texFailed, atlasCells: ART_FILES.length}), artFiles: ART_FILES};
}
