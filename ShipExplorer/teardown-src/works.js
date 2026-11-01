// works.js - the machinery inside a hull: pipes, ribs, tanks, pumps, valves, junction boxes, cable looms. Revealed as the
// hull opens. It is built from each hull's own cross-sections so it fits inside, seeded from the hull so a ship always
// looks the same, and it is illustration only: no number on screen reads from it (fit.js owns the real parts).
import * as THREE from 'three';

const RUNS = 7;      // pipe lines; each is only a short stretch or two, here and there, never the length of the ship (owner, 2026-11-01)
const MAX_PER_GAP = 3; // hoses crossing any one gap
const HOSE_SEG = 9;  // straight segments in one hose
const COL = {
  frame: '#3a444c', steel: '#66727b', dark: '#23292e', copper: '#b4703c', brass: '#b89c56', coolant: '#3d8aa8',
  pale: '#93a1aa', hazard: '#c9a227', red: '#a83c30', green: '#3f9e6c', cable: '#14181b',
};

const rngOf = (seed) => () => { // mulberry32
  seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// the core of the hull in each section: middle of the vertices, ignoring the outer ones so a wing does not stretch it
export function envelopes(pos, stations) {
  const n = stations.length - 1, ys = Array.from({length: n}, () => []), zs = Array.from({length: n}, () => []);
  const step = Math.max(1, Math.floor(pos.count / 60000));
  for (let v = 0; v < pos.count; v += step) {
    const x = pos.getX(v);
    let i = 0;
    while (i < n - 1 && x >= stations[i + 1]) i++;
    ys[i].push(pos.getY(v)); zs[i].push(pos.getZ(v));
  }
  const pct = (a, q) => a[Math.min(a.length - 1, Math.floor(q * a.length))];
  const out = [];
  for (let i = 0; i < n; i++) {
    if (ys[i].length < 12) { out.push(null); continue; }
    ys[i].sort((a, b) => a - b); zs[i].sort((a, b) => a - b);
    const y0 = pct(ys[i], 0.12), y1 = pct(ys[i], 0.88), z0 = pct(zs[i], 0.12), z1 = pct(zs[i], 0.88);
    out.push({cy: (y0 + y1) / 2, cz: (z0 + z1) / 2, hy: Math.max(0.07, (y1 - y0) * 0.36), hz: Math.max(0.07, (z1 - z0) * 0.36), x0: stations[i], x1: stations[i + 1]});
  }
  // an empty section (a gap in a twin hull) borrows its nearest neighbour's core
  for (let i = 0; i < n; i++) {
    if (out[i]) continue;
    const near = out.find((_, d) => out[i - d] || out[i + d]) || null;
    let src = null;
    for (let d = 1; d < n && !src; d++) src = out[i - d] || out[i + d] || null;
    out[i] = src || near ? {...(src || near), x0: stations[i], x1: stations[i + 1]} : {cy: 0, cz: 0, hy: 0.2, hz: 0.2, x0: stations[i], x1: stations[i + 1]};
  }
  // a wide flat hull must not get wide flat machinery
  for (const e of out) { e.hz = Math.min(e.hz, e.hy * 2.4 + 0.1); e.hy = Math.min(e.hy, e.hz * 2.4 + 0.1); }
  return out;
}

// unit templates, flattened once: every part below is a transformed copy, gathered into one mesh per section
const flat = (g) => { const f = g.index ? g.toNonIndexed() : g; return {p: f.getAttribute('position').array, n: f.getAttribute('normal').array}; };
const TPL = {};
const tpl = (k) => {
  if (TPL[k]) return TPL[k];
  const make = {
    cyl: () => new THREE.CylinderGeometry(1, 1, 1, 8), cyl6: () => new THREE.CylinderGeometry(1, 1, 1, 6), box: () => new THREE.BoxGeometry(1, 1, 1),
    ball: () => new THREE.IcosahedronGeometry(1, 1), ring: () => new THREE.TorusGeometry(1, 0.032, 6, 28), flange: () => new THREE.TorusGeometry(1, 0.07, 6, 28),
    wheel: () => new THREE.TorusGeometry(1, 0.14, 5, 14), cap: () => new THREE.CapsuleGeometry(1, 2, 4, 12),
  }[k]();
  TPL[k] = flat(make);
  return TPL[k];
};

class Kit {
  constructor() { this.p = []; this.n = []; this.c = []; this.lp = []; this.ln = []; this.lc = []; }
  add(key, m, col, led) {
    const t = tpl(key), v = new THREE.Vector3(), nm = new THREE.Matrix3().getNormalMatrix(m), c = new THREE.Color(col);
    const P = led ? this.lp : this.p, N = led ? this.ln : this.n, C = led ? this.lc : this.c;
    for (let i = 0; i < t.p.length; i += 3) {
      v.set(t.p[i], t.p[i + 1], t.p[i + 2]).applyMatrix4(m); P.push(v.x, v.y, v.z);
      v.set(t.n[i], t.n[i + 1], t.n[i + 2]).applyMatrix3(nm).normalize(); N.push(v.x, v.y, v.z);
      C.push(c.r, c.g, c.b);
    }
  }
  // a rod between two points
  rod(a, b, r, col, key = 'cyl') {
    const d = new THREE.Vector3().subVectors(b, a), len = d.length();
    if (len < 1e-4) return;
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    this.add(key, new THREE.Matrix4().compose(new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5), q, new THREE.Vector3(r, len, r)), col);
  }
  box(c, sx, sy, sz, col, led) { this.add('box', new THREE.Matrix4().compose(c, new THREE.Quaternion(), new THREE.Vector3(sx, sy, sz)), col, led); }
  ball(c, r, col, led) { this.add('ball', new THREE.Matrix4().compose(c, new THREE.Quaternion(), new THREE.Vector3(r, r, r)), col, led); }
  // an elliptical ring around the ship's long axis
  hoop(x, ry, rz, col, key = 'ring', y = 0, z = 0) {
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0));
    this.add(key, new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(rz, ry, Math.min(ry, rz))), col);
  }
  // a flexible loom: a curve between two points
  loom(a, b, sag, r, col) {
    const steps = 7, m = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5).add(sag);
    const curve = new THREE.QuadraticBezierCurve3(a, m, b);
    let prev = curve.getPoint(0);
    for (let i = 1; i <= steps; i++) { const q = curve.getPoint(i / steps); this.rod(prev, q, r, col, 'cyl6'); prev = q; }
  }
  build() {
    const mk = (p, n, c) => {
      if (!p.length) return null;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(p), 3));
      g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(n), 3));
      g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(c), 3));
      return g;
    };
    return {solid: mk(this.p, this.n, this.c), led: mk(this.lp, this.ln, this.lc)};
  }
}

const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ---- contraptions, in a section's local space (x along the ship). u = the section's core radius; len = its length
const PIECES = {
  tank(k, x, y, z, u, len, rnd) {
    const r = u * 0.42, h = Math.min(len * 0.28, u * 0.9), q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), V(1, 0, 0));
    k.add('cap', new THREE.Matrix4().compose(V(x, y, z), q, V(r, h, r)), rnd() > 0.5 ? COL.pale : COL.steel);
    for (const d of [-0.7, 0, 0.7]) k.hoop(x + d * h, r * 1.03, r * 1.03, COL.dark, 'flange', y, z);
    k.rod(V(x + h * 1.5, y, z), V(x + h * 1.5 + u * 0.3, y + r * 0.8, z), u * 0.045, COL.copper);
    k.ball(V(x, y + r * 1.03, z), u * 0.05, COL.hazard, true);
  },
  pump(k, x, y, z, u, len, rnd) {
    const s = u * 0.32;
    k.box(V(x, y, z), s * 1.5, s, s, COL.dark);
    k.rod(V(x - s * 0.75, y, z), V(x - s * 1.15, y, z), s * 0.42, COL.steel);
    k.rod(V(x + s * 0.2, y + s * 0.5, z), V(x + s * 0.2, y + s * 1.1, z), s * 0.3, COL.copper);
    k.rod(V(x + s * 0.2, y + s * 1.1, z - s * 0.5), V(x + s * 0.2, y + s * 1.1, z + s * 0.5), s * 0.16, COL.copper);
    // hand wheel on a stem
    k.rod(V(x - s * 0.3, y + s * 0.5, z), V(x - s * 0.3, y + s * 0.95, z), s * 0.05, COL.steel);
    k.add('wheel', new THREE.Matrix4().compose(V(x - s * 0.3, y + s * 0.95, z), new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), V(0, 1, 0)), V(s * 0.32, s * 0.32, s * 0.32)), COL.red);
    for (let i = -1; i <= 1; i += 2) k.box(V(x + i * s * 0.55, y - s * 0.62, z), s * 0.3, s * 0.25, s * 1.2, COL.frame);
    k.box(V(x + s * 0.5, y + s * 0.2, z + s * 0.51), s * 0.1, s * 0.1, s * 0.03, COL.green, true);
    k.loom(V(x - s * 0.7, y - s * 0.2, z + s * 0.3), V(x - s * 1.4, y - u * 0.5, z + u * 0.5), V(0, -s * 0.4, 0), s * 0.03, COL.cable);
  },
  turbine(k, x, y, z, u, len) {
    const r = u * 0.58, q = len * 0.22;
    k.rod(V(x - q, y, z), V(x + q, y, z), r * 0.34, COL.steel);
    k.hoop(x - q, r, r, COL.frame, 'flange', y, z); k.hoop(x + q, r, r, COL.frame, 'flange', y, z);
    k.hoop(x, r * 0.72, r * 0.72, COL.copper, 'flange', y, z);
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      k.add('box', new THREE.Matrix4().compose(V(x, y + s * r * 0.55, z + c * r * 0.55), new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), -a).multiply(new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), 0.6)), V(q * 0.5, r * 0.04, r * 0.3)), COL.pale);
    }
    for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + 0.4; k.rod(V(x - q, y, z), V(x - q, y + Math.sin(a) * r, z + Math.cos(a) * r), r * 0.05, COL.dark); }
    k.ball(V(x + q + r * 0.05, y, z), r * 0.2, COL.hazard, true);
  },
  radiator(k, x, y, z, u, len) {
    const w = u * 0.9, h = u * 0.62, n = 9, sp = Math.min(len * 0.5, u * 1.1) / n;
    for (let i = 0; i < n; i++) k.box(V(x + (i - (n - 1) / 2) * sp, y, z), sp * 0.28, h, w, i % 3 ? COL.pale : COL.coolant);
    k.rod(V(x - n * sp * 0.55, y + h * 0.42, z - w * 0.42), V(x + n * sp * 0.55, y + h * 0.42, z - w * 0.42), u * 0.035, COL.coolant);
    k.rod(V(x - n * sp * 0.55, y - h * 0.42, z + w * 0.42), V(x + n * sp * 0.55, y - h * 0.42, z + w * 0.42), u * 0.035, COL.coolant);
    k.box(V(x, y + h * 0.56, z), n * sp, u * 0.03, u * 0.03, COL.coolant, true);
  },
  gyro(k, x, y, z, u) {
    const r = u * 0.5;
    k.hoop(x, r, r, COL.brass, 'flange', y, z);
    k.add('flange', new THREE.Matrix4().compose(V(x, y, z), new THREE.Quaternion(), V(r * 0.82, r * 0.82, r * 0.82)), COL.steel);
    k.add('flange', new THREE.Matrix4().compose(V(x, y, z), new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), V(0, 1, 0)), V(r * 0.64, r * 0.64, r * 0.64)), COL.pale);
    k.rod(V(x, y - r * 1.25, z), V(x, y - r * 0.82, z), r * 0.09, COL.dark);
    k.rod(V(x, y + r * 0.82, z), V(x, y + r * 1.25, z), r * 0.09, COL.dark);
    k.ball(V(x, y, z), r * 0.24, COL.coolant, true);
  },
  junction(k, x, y, z, u, len, rnd) {
    const s = u * 0.42;
    k.box(V(x, y, z), s * 1.1, s * 1.3, s * 0.5, COL.dark);
    k.box(V(x, y, z + s * 0.26), s, s * 1.18, s * 0.02, COL.frame);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) {
      k.box(V(x + (i - 1) * s * 0.26, y + (j - 1.5) * s * 0.26, z + s * 0.28), s * 0.08, s * 0.05, s * 0.02, [COL.green, COL.hazard, COL.coolant][Math.floor(rnd() * 3)], true);
    }
    for (let i = 0; i < 5; i++) {
      const a = V(x + (i - 2) * s * 0.2, y + s * 0.65, z), b = V(x + (i - 2) * s * 0.7 + (rnd() - 0.5) * s, y + u * 0.7, z + (rnd() - 0.5) * u);
      k.loom(a, b, V(0, s * 0.25, (rnd() - 0.5) * s), s * 0.022, i % 2 ? COL.cable : COL.red);
    }
  },
  batteries(k, x, y, z, u, len) {
    const s = u * 0.24, cols = 3, rows = 2;
    k.box(V(x, y - s * 0.72, z), s * 3.6, s * 0.12, s * 2.6, COL.frame);
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const p = V(x + (i - 1) * s * 1.15, y, z + (j - 0.5) * s * 1.25);
      k.box(p, s, s * 1.3, s * 1.05, j ? COL.dark : COL.steel);
      k.box(V(p.x, y + s * 0.68, p.z), s * 0.34, s * 0.06, s * 0.34, COL.hazard, true);
    }
    k.rod(V(x - s * 1.8, y + s * 0.8, z), V(x + s * 1.8, y + s * 0.8, z), s * 0.05, COL.copper);
  },
};
// what each part of the ship is mostly for, stern to bow
const ROLES = [['turbine', 'pump', 'tank'], ['tank', 'pump', 'radiator'], ['radiator', 'gyro', 'pump'], ['tank', 'batteries', 'gyro'], ['batteries', 'junction', 'pump'], ['junction', 'tank', 'batteries'], ['junction', 'batteries']];

export function buildWorks(envs, seed) {
  const rnd = rngOf(seed | 0), n = envs.length;
  // one pipe run: an angle round the core and a depth, the same at every section, so it reads as one line through the ship
  const runs = [];
  for (let r = 0; r < RUNS; r++) {
    const fat = r < 2, col = fat ? (r ? COL.copper : COL.pale) : [COL.coolant, COL.copper, COL.steel, COL.brass, COL.pale, COL.coolant, COL.hazard, COL.steel][r - 2];
    runs.push({a: (r / RUNS) * Math.PI * 2 + 0.3 + rnd() * 0.3, d: fat ? 0.78 : 0.62 + rnd() * 0.3, r: fat ? 0.05 : 0.018 + rnd() * 0.018, col, gaps: new Set()});
  }
  // each line crosses one gap, sometimes two far apart; some gaps get nothing, and that is the look
  const perGap = new Array(Math.max(0, n - 1)).fill(0), links = [];
  const cross = (run) => {
    for (let tries = 0; tries < 6 && n > 1; tries++) {
      const g = Math.floor(rnd() * (n - 1));
      if (perGap[g] >= MAX_PER_GAP || [...run.gaps].some((q) => Math.abs(q - g) < 2)) continue;
      run.gaps.add(g); perGap[g]++; links.push({g, run});
      return;
    }
  };
  for (const run of runs) { cross(run); if (rnd() < 0.3) cross(run); }
  const stations = [];
  for (let i = 0; i < n; i++) {
    const e = envs[i], len = e.x1 - e.x0, u = Math.min(1.2, Math.max(0.14, Math.min(e.hy, e.hz))), k = new Kit(), x0 = -len / 2 + 0.03, x1 = len / 2 - 0.03;
    // ribs: a heavy frame at each cut, a light one between, bolts round the frames
    for (const x of [x0, x1]) {
      k.hoop(x, e.hy * 1.04, e.hz * 1.04, COL.frame, 'flange');
      const nb = 14;
      for (let b = 0; b < nb; b++) { const a = (b / nb) * Math.PI * 2; k.rod(V(x - 0.02, Math.sin(a) * e.hy * 1.04, Math.cos(a) * e.hz * 1.04), V(x + 0.02, Math.sin(a) * e.hy * 1.04, Math.cos(a) * e.hz * 1.04), 0.012, COL.pale, 'cyl6'); }
      for (let b = 0; b < 4; b++) { const a = (b / 4) * Math.PI * 2 + Math.PI / 4; k.rod(V(x, Math.sin(a) * e.hy * 0.55, Math.cos(a) * e.hz * 0.55), V(x, Math.sin(a) * e.hy, Math.cos(a) * e.hz), 0.014, COL.frame); }
    }
    const ribs = Math.max(1, Math.round(len / 0.55));
    for (let j = 1; j <= ribs; j++) k.hoop(x0 + ((x1 - x0) * j) / (ribs + 1), e.hy * 1.02, e.hz * 1.02, COL.frame);
    // stringers: straight lines between the frames
    for (let b = 0; b < 6; b++) { const a = (b / 6) * Math.PI * 2 + 0.52; k.rod(V(x0, Math.sin(a) * e.hy * 1.02, Math.cos(a) * e.hz * 1.02), V(x1, Math.sin(a) * e.hy * 1.02, Math.cos(a) * e.hz * 1.02), 0.012, COL.dark, 'cyl6'); }
    // the runs through this section, with a clamp every so often and a valve on the fat ones
    runs.forEach((p) => {
      // only where this line crosses a gap at this section's end, and only part way in, ending at a capped stub
      const toAft = p.gaps.has(i - 1), toFore = p.gaps.has(i);
      if (!toAft && !toFore) return;
      const y = Math.sin(p.a) * e.hy * p.d, z = Math.cos(p.a) * e.hz * p.d;
      const reach = 0.3 + 0.35 * rnd(), s0 = toAft ? x0 : x1 - (x1 - x0) * reach, s1 = toFore ? x1 : x0 + (x1 - x0) * reach;
      k.rod(V(s0, y, z), V(s1, y, z), p.r, p.col);
      if (toAft) k.rod(V(x0 - 0.015, y, z), V(x0 + 0.05, y, z), p.r * 1.7, COL.dark); else k.rod(V(s0 - 0.03, y, z), V(s0, y, z), p.r * 1.5, COL.dark);
      if (toFore) k.rod(V(x1 - 0.05, y, z), V(x1 + 0.015, y, z), p.r * 1.7, COL.dark); else k.rod(V(s1, y, z), V(s1 + 0.03, y, z), p.r * 1.5, COL.dark);
      const clamps = Math.floor((s1 - s0) / 0.5);
      for (let c = 1; c <= clamps; c++) {
        const cx = s0 + ((s1 - s0) * c) / (clamps + 1);
        k.rod(V(cx - 0.012, y, z), V(cx + 0.012, y, z), p.r * 1.45, COL.dark);
        k.rod(V(cx, y, z), V(cx, y * 1.25, z * 1.25), 0.008, COL.frame, 'cyl6');
      }
      if (p.r > 0.04) {
        const vx = s0 + (s1 - s0) * (0.25 + 0.5 * rnd());
        k.ball(V(vx, y, z), p.r * 1.8, COL.brass);
        k.rod(V(vx, y, z), V(vx, y * 1.0 + p.r * 2.4, z), p.r * 0.35, COL.steel);
        k.add('wheel', new THREE.Matrix4().compose(V(vx, y + p.r * 2.4, z), new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), V(0, 1, 0)), V(p.r * 1.5, p.r * 1.5, p.r * 1.5)), COL.red);
      }
    });
    // contraptions in the middle, spaced along the section
    const role = ROLES[Math.min(ROLES.length - 1, Math.round((i / Math.max(1, n - 1)) * (ROLES.length - 1)))];
    const fits = Math.max(1, Math.min(role.length, Math.floor(len / (u * 0.9))));
    for (let j = 0; j < fits; j++) {
      const x = x0 + ((x1 - x0) * (j + 0.5)) / fits, off = j % 2 ? 1 : -1;
      PIECES[role[j]](k, x, off * e.hy * 0.12, -off * e.hz * 0.12, u, len / fits * 1.5, rnd);
    }
    stations.push({mx: (e.x0 + e.x1) / 2, cy: e.cy, cz: e.cz, x0, x1, geo: k.build()});
  }
  return {stations, links, hoseSeg: HOSE_SEG};
}
