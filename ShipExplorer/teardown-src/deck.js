// deck.js - the deck plan. No source model has an interior, so this is an ILLUSTRATIVE layout, and the bay says so on screen.
// What is real: each deck's outline is a slice of this hull, the bridge goes as near the real canopy as the floor reaches, engineering
// at the stern end of the lowest floor, and rooms keep one scale per hull so a room grows with its own stat, roughly (columns are coarse).
// What is invented: which room sits next to which. No three.js and no DOM: Test/ship-teardown-check.js runs it in node.

export const NX = 96, NZ = 44;
export const ROOM = {
  bridge: {label: 'Bridge', color: '#6fd3ff'}, engineering: {label: 'Engineering', color: '#ffb070'}, power: {label: 'Power core', color: '#ffd27a'},
  crew: {label: 'Crew quarters', color: '#9fd0ff'}, passengers: {label: 'Passenger cabins', color: '#7fb5ff'}, cargo: {label: 'Cargo bay', color: '#d8c79a'},
  fuel: {label: 'Fuel tanks', color: '#ff9f43'}, ammo: {label: 'Magazine', color: '#ff6b6b'}, missiles: {label: 'Missile bay', color: '#ff7a3d'},
  hangar: {label: 'Drone hangar', color: '#4dffa0'}, sensors: {label: 'Sensors', color: '#5ce6d6'}, life: {label: 'Life support', color: '#a9f0ff'},
  med: {label: 'Med bay', color: '#7ff0c0'}, mess: {label: 'Mess', color: '#c7d3dc'}, workshop: {label: 'Workshop', color: '#b8a48a'},
  fore: {label: 'Stores', color: '#9fb7c6'},
};

// all triangles, flat: tris = Float32Array(n * 9). A cell is inside the hull if a ray along +z has entered more faces than
// it has left: signed by each face's normal, so overlapping meshes merged into one hull still count properly.
export function sliceAt(tris, b, y) {
  const dx = (b.max.x - b.min.x) / NX, dz = (b.max.z - b.min.z) / NZ, cols = Array.from({length: NX}, () => []);
  for (let t = 0; t + 8 < tris.length; t += 9) {
    const ay = tris[t + 1] - y, by = tris[t + 4] - y, cy = tris[t + 7] - y;
    if ((ay > 0 && by > 0 && cy > 0) || (ay < 0 && by < 0 && cy < 0)) continue;
    const ax = tris[t], az = tris[t + 2], bx = tris[t + 3], bz = tris[t + 5], cx = tris[t + 6], cz = tris[t + 8];
    const nz = (bx - ax) * (tris[t + 7] - tris[t + 1]) - (tris[t + 4] - tris[t + 1]) * (cx - ax); // z of the face normal
    if (nz === 0) continue;
    const pts = [];
    const cross = (x0, z0, d0, x1, z1, d1) => { if ((d0 > 0) !== (d1 > 0)) { const k = d0 / (d0 - d1); pts.push(x0 + (x1 - x0) * k, z0 + (z1 - z0) * k); } };
    cross(ax, az, ay, bx, bz, by); cross(bx, bz, by, cx, cz, cy); cross(cx, cz, cy, ax, az, ay);
    if (pts.length < 4) continue;
    const [x0, z0, x1, z1] = pts[0] <= pts[2] ? pts : [pts[2], pts[3], pts[0], pts[1]];
    const c0 = Math.max(0, Math.ceil((x0 - b.min.x) / dx - 0.5)), c1 = Math.min(NX - 1, Math.floor((x1 - b.min.x) / dx - 0.5));
    for (let c = c0; c <= c1; c++) {
      const xc = b.min.x + (c + 0.5) * dx, z = x1 > x0 ? z0 + ((z1 - z0) * (xc - x0)) / (x1 - x0) : z0;
      cols[c].push(z, nz < 0 ? 1 : -1);
    }
  }
  const grid = new Uint8Array(NX * NZ);
  for (let c = 0; c < NX; c++) {
    const ev = cols[c], order = [];
    for (let i = 0; i < ev.length; i += 2) order.push(i);
    order.sort((p, q) => ev[p] - ev[q]);
    let depth = 0, k = 0;
    for (let r = 0; r < NZ; r++) {
      const zc = b.min.z + (r + 0.5) * dz;
      while (k < order.length && ev[order[k]] <= zc) { depth = Math.max(0, depth + ev[order[k] + 1]); k++; }
      if (depth > 0) grid[c * NZ + r] = 1;
    }
  }
  return grid;
}

// the one connected floor: per column, the run of cells joined to the widest column. Shrunk by its neighbours, so the wall
// stays inside the hull when it is drawn as a line between column centres.
export function slabOf(floor, ceil) {
  const runs = [];
  for (let c = 0; c < NX; c++) {
    const list = [];
    let start = -1;
    for (let r = 0; r <= NZ; r++) {
      const on = r < NZ && floor[c * NZ + r] && ceil[c * NZ + r];
      if (on && start < 0) start = r;
      if (!on && start >= 0) { list.push([start, r]); start = -1; }
    }
    runs.push(list);
  }
  let seed = -1, best = 0;
  runs.forEach((l, c) => l.forEach((q) => { if (q[1] - q[0] > best) { best = q[1] - q[0]; seed = c; } }));
  if (seed < 0) return null;
  const lo = new Float32Array(NX), hi = new Float32Array(NX);
  const widest = (l) => l.reduce((a, q) => (!a || q[1] - q[0] > a[1] - a[0] ? q : a), null);
  const first = widest(runs[seed]);
  lo[seed] = first[0]; hi[seed] = first[1];
  const walk = (dir) => {
    let prev = first, c = seed + dir;
    for (; c >= 0 && c < NX; c += dir) {
      const near = runs[c].filter((q) => q[0] < prev[1] && q[1] > prev[0]);
      if (!near.length) break;
      prev = widest(near);
      lo[c] = prev[0]; hi[c] = prev[1];
    }
    return c - dir;
  };
  const c1 = walk(1), c0 = walk(-1);
  const sLo = new Float32Array(NX), sHi = new Float32Array(NX);
  for (let c = c0; c <= c1; c++) {
    const a = Math.max(c0, c - 1), d = Math.min(c1, c + 1);
    sLo[c] = Math.max(lo[a], lo[c], lo[d]) + 0.35; sHi[c] = Math.min(hi[a], hi[c], hi[d]) - 0.35;
  }
  // walls without stair steps: a rolling mean, held within a fraction of a cell of the hull
  const rLo = sLo.slice(), rHi = sHi.slice();
  for (let c = c0; c <= c1; c++) {
    let p = 0, q = 0, n = 0;
    for (let i = Math.max(c0, c - 2); i <= Math.min(c1, c + 2); i++) { p += rLo[i]; q += rHi[i]; n++; }
    sLo[c] = Math.max(p / n, rLo[c] - 0.6); sHi[c] = Math.min(q / n, rHi[c] + 0.6);
  }
  let a = c0, d = c1;
  while (a < d && sHi[a] - sLo[a] < 1) a++;
  while (d > a && sHi[d] - sLo[d] < 1) d--;
  let area = 0;
  for (let c = a; c <= d; c++) area += Math.max(0, sHi[c] - sLo[c]);
  return {c0: a, c1: d, lo: sLo, hi: sHi, area};
}

// which levels become decks: the roomiest ones, far enough apart to stand in, in number by the ship's size class
export function decksOf(tris, b, cls) {
  const H = b.max.y - b.min.y, head = Math.min(H * 0.16, 0.42), n = 14, cand = [];
  for (let i = 1; i < n; i++) {
    const y = b.min.y + (H * i) / n;
    if (y + head > b.max.y) continue;
    const s = slabOf(sliceAt(tris, b, y), sliceAt(tris, b, y + head));
    if (s) cand.push({y, head, slab: s});
  }
  const want = cls >= 6 ? 3 : cls >= 3 ? 2 : 1, top = cand.reduce((a, q) => Math.max(a, q.slab.area), 0);
  const spacing = Math.max(H * 0.2, head * 1.25), out = [];
  for (const q of cand.slice().sort((p, r) => r.slab.area - p.slab.area)) {
    if (out.length >= want || q.slab.area < top * 0.28) break;
    if (out.every((d) => Math.abs(d.y - q.y) >= spacing)) out.push(q);
  }
  return out.sort((p, q) => p.y - q.y);
}

export const tooThin = (decks) => !decks.length || decks[0].slab.c1 - decks[0].slab.c0 < NX * 0.3;

const root = (v) => Math.sqrt(Math.max(0, v || 0));
// a room's weight from one set of numbers. Square root, so a 16x stat does not swallow the deck. `max` is this hull's most in
// any configuration, the same for every toggle, which is what lets one room's size be compared across toggles.
function weightOf(type, stats, max) {
  const cap = Math.max(1, max.cargo || 0, max.fuel || 0, max.ammo || 0), w = (v) => (v > 0 ? 0.22 + (0.9 * root(v)) / root(cap) : 0);
  switch (type) {
    case 'cargo': return w(stats.cargo);
    case 'ammo': return w(stats.ammo) * 0.8;
    case 'fuel': return w(stats.fuel) * 0.8;
    case 'crew': return stats.crew > 0 ? 0.2 + root(stats.crew) / 22 : 0;
    case 'passengers': return stats.passengers > 0 ? 0.2 + root(stats.passengers) / 22 : 0;
    case 'missiles': return stats.missileBays > 0 ? 0.2 + stats.missileBays * 0.05 : 0;
    case 'hangar': return stats.drones > 0 ? 0.22 + stats.drones * 0.04 : 0;
    default: return {power: 0.32, sensors: 0.2, life: 0.2, med: 0.2, mess: 0.24, workshop: 0.28}[type] || 0;
  }
}
const VALUE = {cargo: 'cargo', ammo: 'ammo', fuel: 'fuel', crew: 'crew', passengers: 'passengers', missiles: 'missileBays', hangar: 'drones'};
// the rooms a ship has room for, first in the list last to go. A small ship is a cockpit and a hold, so class limits which
// stats get a room at all. Built from the hull's maxima so rooms keep their place when the loadout changes.
export function roomsOf(max, cls) {
  const out = [], add = (type, on) => {
    if (!on || !weightOf(type, max, max)) return;
    const w = weightOf(type, max, max);
    // a very large room reads better as two; the number stays on the first, and is the whole figure
    if (w > 0.72 && cls >= 5) out.push({type, share: 0.5, first: true, maxW: w / 2}, {type, share: 0.5, first: false, maxW: w / 2});
    else out.push({type, share: 1, first: true, maxW: w});
  };
  add('cargo', true); add('ammo', cls >= 2); add('fuel', cls >= 2); add('crew', cls >= 3); add('passengers', cls >= 2); add('power', cls >= 3);
  add('missiles', true); add('hangar', true); add('sensors', cls >= 3); add('life', cls >= 4); add('med', cls >= 5); add('mess', cls >= 5); add('workshop', cls >= 6);
  return out;
}
const WHERE = {cargo: 0, fuel: 0, ammo: 0, missiles: 0, hangar: 0.4, workshop: 0.4, power: 0.5, life: 0.7, med: 0.7, mess: 0.8, sensors: 1, crew: 1, passengers: 1};
const MIN_COLS = 4; // a room narrower than this many columns cannot be read: the room goes, not the rule

// the plan: every deck's rooms as column ranges inside its slab. Rooms are placed from the hull's maxima (so they stay put) and
// sized from this loadout's numbers at one scale for the whole hull; floor nobody claims is Stores, not stretched rooms.
export function layout(decks, opts) {
  if (!decks.length) return [];
  const {b, cls, stats, glass, mounts} = opts, max = stats.max || stats, dx = (b.max.x - b.min.x) / NX, dz = (b.max.z - b.min.z) / NZ;
  const colOf = (x) => Math.max(0, Math.min(NX - 1, Math.round((x - b.min.x) / dx - 0.5)));
  const zOf = (r) => b.min.z + r * dz;
  // the bridge's deck: the one nearest the canopy, counting how far its floor stops short of it along the ship
  const reach = (d) => Math.abs(d.y - glass.y) + Math.max(0, colOf(glass.x) - d.slab.c1, d.slab.c0 - colOf(glass.x)) * dx;
  const bridgeDeck = glass ? decks.reduce((a, d, i) => (reach(d) < reach(decks[a]) ? i : a), 0) : decks.length - 1;
  const totalArea = decks.reduce((a, d) => a + d.slab.area, 0) || 1, bucket = decks.map(() => []), load = decks.map(() => 0);
  const all = roomsOf(max, cls), totalW = all.reduce((a, r) => a + r.maxW, 0) || 1;
  for (const r of all) {
    let best = 0, score = Infinity;
    decks.forEach((d, i) => {
      const pos = decks.length > 1 ? i / (decks.length - 1) : 0;
      const s = (load[i] + r.maxW) / totalW / (d.slab.area / totalArea) + Math.abs(pos - WHERE[r.type]) * 0.6;
      if (s < score) { score = s; best = i; }
    });
    bucket[best].push(r); load[best] += r.maxW;
  }
  const order = Object.keys(ROOM);
  // first the shape: engineering, bridge, zones, rows. Then one scale for all rows, then the rooms.
  const shapes = decks.map((d, di) => {
    const s = d.slab, span = s.c1 - s.c0 + 1, caps = [], rowsOut = [];
    const full = (c) => s.lo[c], fullH = (c) => s.hi[c];
    let m0 = s.c0;
    const m1 = s.c1;
    if (di === 0 && span >= 8) { const n = Math.max(3, Math.round(span * (cls >= 6 ? 0.14 : 0.18))); caps.push({type: 'engineering', c0: m0, c1: m0 + n - 1}); m0 += n + 1; }
    const zones = [];
    if (di === bridgeDeck && m1 - m0 >= 5) {
      const n = Math.max(3, Math.min(14, Math.round(span * (cls >= 6 ? 0.09 : 0.14))));
      const centre = glass ? colOf(glass.x) : m1 - n / 2;
      const end = Math.max(m0 + n - 1, Math.min(m1, Math.round(centre + n / 2))), first = end - n + 1;
      caps.push({type: 'bridge', c0: first, c1: end});
      if (first - 2 - m0 >= MIN_COLS) zones.push([m0, first - 2]);
      if (m1 - (end + 2) >= MIN_COLS) zones.push([end + 2, m1]);
    } else if (m1 - m0 >= MIN_COLS) zones.push([m0, m1]);
    const areaOf = (z) => { let v = 0; for (let c = z[0]; c <= z[1]; c++) v += Math.max(0, s.hi[c] - s.lo[c]); return v; };
    const zoneArea = zones.map(areaOf), zoneSum = zoneArea.reduce((a, v) => a + v, 0) || 1, lists = zones.map(() => []), used = zones.map(() => 0);
    const pool = bucket[di], poolW = pool.reduce((a, r) => a + r.maxW, 0) || 1;
    for (const r of pool) {
      let best = -1, room = -Infinity;
      zones.forEach((_, i) => { const v = zoneArea[i] / zoneSum - used[i] / poolW; if (v > room) { room = v; best = i; } });
      if (best >= 0) { lists[best].push(r); used[best] += r.maxW; }
    }
    const corridors = [];
    zones.forEach(([z0, z1], zi) => {
      let meanW = 0, cor = 0;
      for (let c = z0; c <= z1; c++) { meanW += s.hi[c] - s.lo[c]; cor += (s.hi[c] + s.lo[c]) / 2; }
      const cols = z1 - z0 + 1;
      meanW /= cols; cor /= cols;
      const list = lists[zi], twoRows = cls >= 3 && meanW * dz >= 0.5 && list.length >= 2 && !d.spine, half = Math.max(0.5, 0.05 / dz);
      const clampCor = (c) => Math.max(s.lo[c] + half + 0.5, Math.min(s.hi[c] - half - 0.5, cor));
      const rows = twoRows
        ? [{list: [], sum: 0, lo: full, hi: (c) => Math.max(s.lo[c], clampCor(c) - half), row: 0}, {list: [], sum: 0, lo: (c) => Math.min(s.hi[c], clampCor(c) + half), hi: fullH, row: 1}]
        : [{list: [], sum: 0, lo: full, hi: fullH, row: 0}];
      const fit = Math.floor(cols / (d.spine ? MIN_COLS * 2 : MIN_COLS)) * rows.length; // a spine has no width to spare, so fewer and longer
      for (const r of list.slice(0, fit)) { const q = rows.reduce((p, o) => (o.sum < p.sum ? o : p)); q.list.push(r); q.sum += r.maxW; }
      for (const q of rows) {
        q.list.sort((p, o) => order.indexOf(p.type) - order.indexOf(o.type));
        q.z0 = z0; q.z1 = z1; q.area = 0;
        for (let c = z0; c <= z1; c++) q.area += Math.max(0.01, q.hi(c) - q.lo(c));
        rowsOut.push(q);
      }
      if (rows.length === 2) {
        const cr = {xs: [], a: [], b: []};
        for (let c = z0; c <= z1; c++) { cr.xs.push(b.min.x + (c + 0.5) * dx); cr.a.push(zOf(Math.max(s.lo[c], clampCor(c) - half))); cr.b.push(zOf(Math.max(s.lo[c], Math.min(s.hi[c], clampCor(c) + half)))); }
        corridors.push(cr);
      }
    });
    return {caps, rows: rowsOut, corridors, full, fullH};
  });
  // one scale: the fullest row, at this hull's maxima, just fits
  let unit = Infinity;
  for (const sh of shapes) for (const q of sh.rows) if (q.sum > 0) unit = Math.min(unit, q.area / q.sum);
  if (!Number.isFinite(unit)) unit = 0;
  const plan = decks.map((d, di) => {
    const sh = shapes[di], rooms = [];
    const push = (type, c0, c1, lo, hi, value, row) => {
      if (c1 < c0) return;
      const xs = [], a = [], z = [];
      let area = 0;
      for (let c = c0; c <= c1; c++) { xs.push(b.min.x + (c + 0.5) * dx); const l = lo(c), h = Math.max(l, hi(c)); a.push(zOf(l)); z.push(zOf(h)); area += Math.max(0, h - l) * dx * dz; }
      rooms.push({type, label: ROOM[type].label, color: ROOM[type].color, value, c0, c1, row, xs, a, b: z, area});
    };
    for (const c of sh.caps) push(c.type, c.c0, c.c1, sh.full, sh.fullH);
    for (const q of sh.rows) {
      let c = q.z0;
      for (const r of q.list) {
        const w = weightOf(r.type, stats, max) * r.share;
        if (!w || c > q.z1) continue; // this loadout has none: its floor is left for Stores
        let end = c, acc = Math.max(0.01, q.hi(c) - q.lo(c));
        const target = w * unit;
        while (end < q.z1 && acc < target) { end++; acc += Math.max(0.01, q.hi(end) - q.lo(end)); }
        end = Math.min(q.z1, Math.max(end, c + MIN_COLS - 1));
        const key = VALUE[r.type];
        push(r.type, c, end, q.lo, q.hi, r.first && key ? stats[key] : undefined, q.row);
        c = end + 1;
      }
      if (q.z1 - c + 1 >= 2) push('fore', c, q.z1, q.lo, q.hi, undefined, q.row);
    }
    return {y: d.y, head: d.head, spine: !!d.spine, rooms, corridors: sh.corridors, guns: []};
  });
  // each real gun marks the deck nearest to it, at its own height: on the hull, not floating at the deck's
  for (const m of mounts || []) plan.reduce((a, q) => (Math.abs(q.y - m.y) < Math.abs(a.y - m.y) ? q : a)).guns.push({x: m.x, y: m.y, z: m.z});
  return plan;
}

// where the canopy really is. Glass is often scattered (Guardian: half at the bow, the rest in side windows), so the middle of its
// box can sit where there is no glass at all: take the most forward cluster holding a real share of it, else the largest.
export function canopyOf(pos, b) {
  const n = 16, mass = new Float64Array(n), sumY = new Float64Array(n), sumX = new Float64Array(n), L = b.max.x - b.min.x || 1;
  for (let i = 0; i < pos.count; i++) {
    const k = Math.max(0, Math.min(n - 1, Math.floor(((pos.getX(i) - b.min.x) / L) * n)));
    mass[k]++; sumY[k] += pos.getY(i); sumX[k] += pos.getX(i);
  }
  const clusters = [];
  for (let k = 0; k < n; k++) {
    if (!mass[k]) continue;
    const last = clusters[clusters.length - 1];
    if (last && last.end === k - 1) { last.end = k; last.m += mass[k]; last.y += sumY[k]; last.x += sumX[k]; } else clusters.push({end: k, m: mass[k], y: sumY[k], x: sumX[k]});
  }
  if (!clusters.length) return null;
  const total = clusters.reduce((a, q) => a + q.m, 0), big = clusters.filter((q) => q.m >= total * 0.3);
  const pick = big.length ? big[big.length - 1] : clusters.reduce((a, q) => (q.m > a.m ? q : a));
  return {x: pick.x / pick.m, y: pick.y / pick.m, share: pick.m / total};
}

// a hull with no sealed floor: hull above AND below each cell at some level, which needs no watertight mesh. If even that gives no
// run of floor down the ship, there is no plan for this hull, and the bay says so rather than drawing rooms over empty space.
export function roofedDeck(tris, b) {
  const dx = (b.max.x - b.min.x) / NX, dz = (b.max.z - b.min.z) / NZ, lo = new Float32Array(NX * NZ).fill(Infinity), hi = new Float32Array(NX * NZ).fill(-Infinity);
  for (let t = 0; t + 8 < tris.length; t += 9) {
    const ax = tris[t], ay = tris[t + 1], az = tris[t + 2], bx = tris[t + 3], by = tris[t + 4], bz = tris[t + 5], cx = tris[t + 6], cy = tris[t + 7], cz = tris[t + 8];
    const c0 = Math.max(0, Math.ceil((Math.min(ax, bx, cx) - b.min.x) / dx - 0.5)), c1 = Math.min(NX - 1, Math.floor((Math.max(ax, bx, cx) - b.min.x) / dx - 0.5));
    const r0 = Math.max(0, Math.ceil((Math.min(az, bz, cz) - b.min.z) / dz - 0.5)), r1 = Math.min(NZ - 1, Math.floor((Math.max(az, bz, cz) - b.min.z) / dz - 0.5));
    const den = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz);
    if (!den) continue;
    for (let c = c0; c <= c1; c++) for (let r = r0; r <= r1; r++) {
      const x = b.min.x + (c + 0.5) * dx, z = b.min.z + (r + 0.5) * dz;
      const u = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / den, v = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / den;
      if (u < 0 || v < 0 || u + v > 1) continue;
      const y = u * ay + v * by + (1 - u - v) * cy, i = c * NZ + r;
      if (y < lo[i]) lo[i] = y;
      if (y > hi[i]) hi[i] = y;
    }
  }
  const H = b.max.y - b.min.y, head = Math.min(H * 0.1, 0.2);
  let best = null;
  for (let i = 1; i < 14; i++) {
    const y = b.min.y + (H * i) / 14, grid = new Uint8Array(NX * NZ);
    for (let k = 0; k < grid.length; k++) grid[k] = lo[k] < y && hi[k] > y + head ? 1 : 0;
    const s = slabOf(grid, grid);
    if (s && (!best || s.area > best.slab.area)) best = {y, head, spine: true, slab: s};
  }
  return best && best.slab.c1 - best.slab.c0 >= NX * 0.15 ? best : null;
}
