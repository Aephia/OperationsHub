// Pure data model for the C4 Live galaxy scene. No three.js here: Test/c4-scene-check.js imports this file directly.
// Map coordinates: galaxy units from latest.json (systems x -50..51, y -45..46). World space: X = x, Z = -y, Y up.

export const FACTIONS = ['mud', 'oni', 'ustur', 'unaligned'];
// House palette, the same values as landing.css --mud / --oni / --ust (task #8, 2026-11-06; Test/c4-scene-check.js
// parses landing.css and fails if these drift). Unaligned / NPC = --npc in C4Live/c4.css (the panels' grey; task #12).
export const FACTION_HEX = {mud: '#ff6040', oni: '#3ec8ff', ustur: '#ffcc33', unaligned: '#8a94a6'}; // --ust #ffcc33 since 2026-11-06 23:25 EST
// The scene renders into a linear half-float target and OutputPass encodes to sRGB, so shader colours must be LINEAR:
// the CSS hex is sRGB, converted with the exact sRGB transfer function. (Passing hex/255 straight in gets gamma-encoded
// twice and shows lighter, washed-out hues than the panels.)
export const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export const linearToSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);
export const hexToLinear = (h) => [1, 3, 5].map((i) => srgbToLinear(parseInt(h.slice(i, i + 2), 16) / 255));
// Territory-fill gain per faction [mud, oni, ustur]: equalises perceived fill brightness (measured, task #18).
export const TERR_GAIN = [1.8, 1.0, 0.6]; // measured: fill luminance 26.2 / 29.2 / 27.5 (was 16 / 29 / 41 at 1,1,1)
export const FACTION_COLOR = Object.fromEntries(Object.entries(FACTION_HEX).map(([k, h]) => [k, hexToLinear(h)]));
export const factionKey = (fa) => (FACTION_COLOR[fa] ? fa : 'unaligned');

// state kind -> code used in the shaders (must match GLSL in main.js)
export const KIND = {idle: 0, docked: 1, mining: 2, warp: 3, subwarp: 4, destroyed: 5, respawn: 6, claimStakeTransfer: 7};
export const kindCode = (k) => (k in KIND ? KIND[k] : 0);
export const isTransit = (k) => k === 'warp' || k === 'subwarp';

const num = (v) => typeof v === 'number' && Number.isFinite(v);
const pt = (p) => Array.isArray(p) && p.length >= 2 && num(p[0]) && num(p[1]);

// The path a fleet is on. A transit needs s.to and a usable departs < arrives window; s.from is optional (the chain's
// x,y IS the departure point - verified on the 2026-11-06 data: warp fleets carry no s.from). Anything else is static.
export function fleetPath(f) {
  const s = f.s || {};
  const here = [num(f.x) ? f.x : 0, num(f.y) ? f.y : 0];
  if (isTransit(s.kind) && pt(s.to) && num(s.departs) && num(s.arrives)) {
    return {moving: true, from: pt(s.from) ? [s.from[0], s.from[1]] : here, to: [s.to[0], s.to[1]], dep: s.departs, arr: s.arrives};
  }
  return {moving: false, from: here, to: null, dep: 0, arr: 0};
}

// Transit progress 0..1 at unix time `now`. A degenerate window (arr <= dep) counts as arrived.
export function progress(path, now) {
  if (!path.moving) return 1;
  const span = path.arr - path.dep;
  if (!(span > 0)) return now >= path.dep ? 1 : 0;
  const t = (now - path.dep) / span;
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

// Position at unix time `now`, written into `out` ([x, y]) so the caller can reuse one array (no per-frame allocation).
// Before departure: at `from`. In flight: linear from->to. After arrival: at `to` (the chain does not move x,y until the
// fleet's next transaction, so an arrived fleet's x,y is stale - the destination is where it really is).
// No usable path data: the chain x,y.
export function fleetPos(path, now, out = [0, 0]) {
  if (!path.moving) { out[0] = path.from[0]; out[1] = path.from[1]; return out; }
  const t = progress(path, now);
  out[0] = path.from[0] + (path.to[0] - path.from[0]) * t;
  out[1] = path.from[1] + (path.to[1] - path.from[1]) * t;
  return out;
}

// Deterministic 0..1 hash of an address, so jitter and orbits are stable across hourly reloads.
export function seedOf(str) {
  let h = 2166136261;
  for (let i = 0; i < (str || '').length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 100000) / 100000;
}

// Mining fleets in the GALAXY view sit exactly on their asteroid = their system (task #32, owner 2026-11-07: the old
// 0.75-1.45 unit orbit "looks weird going in a super large radius"). Hulls are sub-pixel there anyway; the system carries a
// mining indicator instead (miningBySystem below). There is deliberately no orbitOffset any more.

// Live mining per system: sum of fleets[].mine.out[].ups (the panels' unit, c4-ui-model.js fleetUps) over the mining
// fleets whose asteroid lies in that system. Returns Map(sysAddr -> {ups, miners, fa (faction with the most u/s), byFa}).
export const fleetUps = (f) => (f && f.mine && Array.isArray(f.mine.out) ? f.mine.out.reduce((a, o) => a + (num(o.ups) ? o.ups : 0), 0) : 0);
export function miningBySystem(latest) {
  const astSys = new Map((latest.asteroids || []).map((x) => [x.a, x.sys]));
  const out = new Map();
  for (const f of latest.fleets || []) {
    if (!f || !f.s || f.s.kind !== 'mining') continue;
    const sys = astSys.get(f.s.asteroid); if (!sys) continue;
    let m = out.get(sys);
    if (!m) { m = {ups: 0, miners: 0, byFa: {}, byFilter: {}, fa: 'unaligned'}; out.set(sys, m); }
    const u = fleetUps(f), fa = f.npc ? 'unaligned' : factionKey(f.fa);
    m.ups += u; m.miners++; m.byFa[fa] = (m.byFa[fa] || 0) + u;
    // per FILTER key, by the SAME rule as the fleets (factionMatch): 'npc' = NPC fleets only (not unaligned players,
    // task #38 P3-6), 'mud' = MUD players only, ... A value > 0 = that filter keeps this system's indicator lit.
    for (const k of FILTER_FACTIONS) if (factionMatch(f, k)) m.byFilter[k] = (m.byFilter[k] || 0) + u + 1e-9;
  }
  for (const m of out.values()) m.fa = Object.entries(m.byFa).sort((a, b) => b[1] - a[1])[0][0];
  return out;
}

// ---------------------------------------------------------------- in-map stat layers (task #32, setStatLayer)
// Every number comes from latest.json / events.json, the same fields the panels read. One entry per column:
// {key, x, y, v (the value the height encodes), fa (colour key or 'hot'), sys (address to pick, or null), name, line}
export const STAT_LAYERS = ['mining', 'combat', 'fleets', 'owners', 'dacs']; // 'dacs' (task #53): built from setDacs, not statColumns
const SEP = ' · '; // middle dot between the facts of a callout line (HTML collapses double spaces)
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
export function fmtNum(v) {
  const a = Math.abs(v);
  if (a >= 1e6) return (v / 1e6).toFixed(a >= 1e7 ? 0 : 1) + 'M';
  if (a >= 1e3) return (v / 1e3).toFixed(a >= 1e4 ? 0 : 1) + 'k';
  return a >= 10 ? Math.round(v).toString() : v.toFixed(1);
}
// fleets present at each system, by the same membership rule as the system view (systemMembers), using the asteroid list
// in latest.json for the miners (no bodies.json needed)
export function fleetsBySystem(latest, settledBy) {
  const astBodies = (latest.asteroids || []).map((x) => ({k: 'asteroid', a: x.a, sys: x.sys}));
  return systemMembers(latest.fleets || [], latest.systems || [], astBodies, settledBy);
}
export function statColumns(kind, latest, events, opt = {}) {
  if (!latest || !Array.isArray(latest.systems)) return [];
  const sysBy = new Map(latest.systems.map((s) => [s.a, s]));
  const ref = num(latest.generatedAt) ? latest.generatedAt : 0;
  const settledBy = ref - 120;
  const cols = [];
  if (kind === 'mining') {
    for (const [a, m] of miningBySystem(latest)) {
      const s = sysBy.get(a); if (!s || !(m.ups > 0)) continue;
      cols.push({key: a, x: s.x, y: s.y, v: m.ups, fa: m.fa, sys: a, name: s.n || 'System', line: `${fmtNum(m.ups)} u/s${SEP}${plural(m.miners, 'miner')}`, miners: m.miners});
    }
  } else if (kind === 'combat') {
    // ONE rule with the panels (combatSpots below): every event to its nearest system within 1.2, else a deep-space cell;
    // the column stands ON that system (task #38)
    for (const h of combatSpots(events, latest.systems, ref, opt.windowS || 86400, opt.faction || null)) {
      cols.push({key: 'hot:' + h.key, x: h.x, y: h.y, v: h.n, fa: 'hot', sys: h.sys, name: h.name,
        line: `${plural(h.n, 'combat event')} 24h${h.destroyed ? SEP + plural(h.destroyed, 'kill') : ''}`, kills: h.destroyed, heat: h.heat, last: h.last});
    }
  } else if (kind === 'fleets') {
    const fl = latest.fleets || [];
    for (const [a, m] of fleetsBySystem(latest, settledBy)) {
      const s = sysBy.get(a); if (!s) continue;
      const idx = [...m.docked, ...m.mining, ...m.cst, ...m.idle]; if (!idx.length) continue;
      const byFa = {};
      for (const i of idx) { const k = fl[i].npc ? 'unaligned' : factionKey(fl[i].fa); byFa[k] = (byFa[k] || 0) + 1; }
      cols.push({key: a, x: s.x, y: s.y, v: idx.length, fa: Object.entries(byFa).sort((p, q) => q[1] - p[1])[0][0], sys: a, name: s.n || 'System',
        line: `${plural(idx.length, 'fleet')}${m.docked.length ? SEP + m.docked.length + ' docked' : ''}${m.mining.length ? SEP + m.mining.length + ' mining' : ''}`});
    }
  } else if (kind === 'owners') {
    const fl = latest.fleets || [], owner = opt.owner || null;
    const ownerFa = new Map((latest.owners || []).map((o) => [o.p, o.fa]));
    const stakesBy = new Map();
    for (const st of latest.stakes || []) if (st && st.sys && (!owner || st.o === owner)) { const l = stakesBy.get(st.sys) || []; l.push(st); stakesBy.set(st.sys, l); }
    const mem = fleetsBySystem(latest, settledBy);
    const keys = new Set([...mem.keys(), ...stakesBy.keys()]);
    for (const a of keys) {
      const s = sysBy.get(a); if (!s) continue;
      const m = mem.get(a), idx = m ? [...m.docked, ...m.mining, ...m.cst, ...m.idle] : [];
      const stk = stakesBy.get(a) || [];
      if (owner) {
        const mine = idx.filter((i) => fl[i].o === owner).length;
        if (!mine && !stk.length) continue;
        cols.push({key: a, x: s.x, y: s.y, v: mine + stk.length, fa: factionKey(ownerFa.get(owner)), sys: a, name: s.n || 'System',
          line: [mine ? plural(mine, 'fleet') : '', stk.length ? plural(stk.length, 'stake') : ''].filter(Boolean).join(SEP)});
      } else {
        // no owner focused: how many distinct owners are present (fleets here or stakes here)
        const set = new Set([...idx.map((i) => fl[i].o), ...stk.map((st) => st.o)].filter(Boolean));
        if (!set.size) continue;
        cols.push({key: a, x: s.x, y: s.y, v: set.size, fa: factionKey(s.f), sys: a, name: s.n || 'System', line: plural(set.size, 'owner') + ' present'});
      }
    }
  }
  // combat keeps combatSpots' pinned order (n desc, last desc, key asc - task #44); the others: v desc, then key
  return kind === 'combat' ? cols : cols.sort((p, q) => q.v - p.v || (p.key < q.key ? -1 : 1));
}
// Column height (world units at zoom scale 1) for value v against the layer's max: log scale, a floor so a 1 still shows.
export const STAT_H = 12;
export const statHeight = (v, vmax) => (v > 0 ? STAT_H * (0.08 + 0.92 * Math.log10(1 + v) / Math.log10(1 + Math.max(v, vmax || v))) : 0);

// Fleets that share one point OUTSIDE any system (61 idle on one deep-space coordinate in the 2026-11-06 data; fleets at a
// system are laid out by that system since v10) are laid out as a sunflower (Vogel) disc around it: member i of a stack
// sits at radius (0.5 + 0.17 * sqrt(i)) x WORLD.K, golden angle apart (one world scale with the systems and hulls: the
// step is ~5.7 medium hull lengths), so no two overlap and each stays pickable. Ordered by address: stable across reloads.
export function stackOffset(i, out = [0, 0]) {
  const r = (0.5 + 0.17 * Math.sqrt(i)) * WORLD.K, a = i * 2.39996323;
  out[0] = Math.cos(a) * r; out[1] = Math.sin(a) * r;
  return out;
}
// Groups fleet indexes that share a point: docked by starbase system, everything static by its resting point (x,y, or
// `to` for a transit that had already arrived by `settledBy`). In-flight transits and mining fleets are not stacked
// (they move or orbit). Returns Map(key -> [indexes sorted by address]).
export function restPoint(f, settledBy) {
  const p = fleetPath(f);
  if (p.moving) return p.arr <= settledBy ? p.to : null;
  return [f.x, f.y];
}
export function stacks(fleets, settledBy = -Infinity) {
  const g = new Map();
  fleets.forEach((f, i) => {
    const k = f.s && f.s.kind;
    if (k === 'mining') return;
    const rp = restPoint(f, settledBy);
    if (!rp) return;
    const key = k === 'docked' && f.s.system ? 'sys:' + f.s.system : rp[0].toFixed(3) + ',' + rp[1].toFixed(3);
    if (!g.has(key)) g.set(key, []);
    g.get(key).push(i);
  });
  for (const list of g.values()) list.sort((a, b) => (fleets[a].a < fleets[b].a ? -1 : fleets[a].a > fleets[b].a ? 1 : 0));
  return g;
}

// Marker size in world units by ship count (1 ship = 0.55, 75 ships ~ 2.1).
export const fleetSize = (ships) => 0.55 * (1 + 0.42 * Math.log2(Math.max(1, ships || 1)));
export const systemSize = (lvl) => 1.1 + Math.max(0, lvl || 0) * 0.42;

// Recent COMBAT folded into hot spots: events with t in (ref - windowS, ref], grouped by position (0.5 unit cells).
// Only fighting counts: combat, destroyed, starbaseCombat, captured, and gone when it followed combat (afterCombat).
// newFleet and a quiet gone are not combat (reviewer P2, 2026-11-06).
// heat = sum of exp(-age / 6h); a kill weighs 3x ONCE per fleet: the collector records one kill as both `destroyed`
// and `combat` with dead:true, so the second record of the same fleet's kill is dropped.
export const isHotKind = (e) => e.k === 'combat' || e.k === 'destroyed' || e.k === 'starbaseCombat' || e.k === 'captured'
  || (e.k === 'gone' && e.afterCombat === true);
export const isKill = (e) => e.k === 'destroyed' || e.dead === true;
export function hotSpots(events, ref, windowS = 86400) {
  const cells = new Map(), killed = new Set();
  for (const e of events || []) {
    if (!isHotKind(e) || !num(e.t) || !num(e.x) || !num(e.y) || e.t > ref || e.t <= ref - windowS) continue;
    if (isKill(e) && e.f) { if (killed.has(e.f)) continue; killed.add(e.f); }
    const key = Math.round(e.x * 2) + ',' + Math.round(e.y * 2);
    let c = cells.get(key);
    if (!c) { c = {x: 0, y: 0, n: 0, heat: 0, destroyed: 0, last: 0, fa: {}}; cells.set(key, c); }
    const age = ref - e.t, w = (isKill(e) ? 3 : 1) * Math.exp(-age / 21600);
    c.x += e.x; c.y += e.y; c.n++; c.heat += w; c.last = Math.max(c.last, e.t);
    if (isKill(e)) c.destroyed++;
    const fa = factionKey(e.fa); c.fa[fa] = (c.fa[fa] || 0) + 1;
    if (e.npc) c.npc = (c.npc || 0) + 1;
    if (!e.npc) (c.pf || (c.pf = {}))[fa] = 1; // player factions incl. 'unaligned' players (never NPCs - task #44)
  }
  return [...cells.values()].map((c) => ({x: c.x / c.n, y: c.y / c.n, n: c.n, heat: c.heat, destroyed: c.destroyed, last: c.last,
    fa: Object.entries(c.fa).sort((a, b) => b[1] - a[1])[0][0], npc: c.npc || 0, playerFa: Object.keys(c.pf || {})}));
}
// Combat HOT SPOTS BY PLACE - one rule for the scene's stat callouts and the panels (task #38, lead contract 2026-11-07).
// Events: the hotSpots window and kinds above (t in (ref - windowS, ref], isHotKind, a kill counted once per fleet).
// Each event goes to the NEAREST system within COMBAT_SYS_R (1.2) map units; an event with no system that close goes to
// a COMBAT_CELL (0.5 unit) grid cell (key Math.round(x * 2), Math.round(y * 2)) named "Deep space X, Y" (X, Y = Math.round
// of the cell's mean x, y). An equidistant tie goes to the lower system address. faction (optional): the FILTER_FACTIONS
// key of the current filter, applied FIRST with factionMatch (an event carries fa / npc like a fleet). Returns rows sorted by combatOrder (n desc, last desc, key asc):
// {key (system address, or 'deep:i,j'), sys (address | null), name, x, y (the system's position; a deep cell's event
//  centroid), n (events), destroyed (kills), heat, last (latest t)}
export const COMBAT_SYS_R = 1.2, COMBAT_CELL = 0.5;
// THE tie order for hot places (task #44, pinned with the panels' combatHotSpots): n desc, then last (latest event t)
// desc, then key asc
export const combatOrder = (p, q) => q.n - p.n || q.last - p.last || (p.key < q.key ? -1 : p.key > q.key ? 1 : 0);
export function combatSpots(events, systems, ref, windowS = 86400, faction = null) {
  const sys = (systems || []).filter((s) => s && num(s.x) && num(s.y));
  const out = new Map(), killed = new Set(), R2 = COMBAT_SYS_R * COMBAT_SYS_R;
  for (const e of events || []) {
    if (!isHotKind(e) || !num(e.t) || !num(e.x) || !num(e.y) || e.t > ref || e.t <= ref - windowS) continue;
    if (faction && !factionMatch(e, faction)) continue; // the faction filter first (lead rule 6), the same match as fleets
    if (isKill(e) && e.f) { if (killed.has(e.f)) continue; killed.add(e.f); }
    let best = null, bd = R2;
    for (const s of sys) {
      const d = (s.x - e.x) ** 2 + (s.y - e.y) ** 2;
      if (d < bd || (d === bd && best && s.a < best.a)) { bd = d; best = s; } // strictly < 1.44; a tie -> the lower address
    }
    const key = best ? best.a : 'deep:' + Math.round(e.x * 2) + ',' + Math.round(e.y * 2); // 1 / COMBAT_CELL = 2
    let c = out.get(key);
    if (!c) { c = {key, sys: best ? best.a : null, name: best ? best.n || 'System' : '', x: best ? best.x : 0, y: best ? best.y : 0, sx: 0, sy: 0, n: 0, destroyed: 0, heat: 0, last: 0}; out.set(key, c); }
    const age = ref - e.t;
    c.n++; c.sx += e.x; c.sy += e.y; c.heat += (isKill(e) ? 3 : 1) * Math.exp(-age / 21600); c.last = Math.max(c.last, e.t);
    if (isKill(e)) c.destroyed++;
  }
  const rows = [...out.values()].map(({sx, sy, ...c}) => {
    if (!c.sys) { c.x = sx / c.n; c.y = sy / c.n; c.name = deepName(c.x, c.y, sys); }
    return c;
  });
  return rows.sort(combatOrder);
}
// "Deep space near <NAME>" (task #55, look note: the old "Deep space X, Y" read as a coordinate dump): NAME = the nearest
// system to the point at any distance, an equidistant tie -> the lower address; no systems -> "Deep space".
export function deepName(x, y, systems) {
  let best = null, bd = Infinity;
  for (const s of systems || []) {
    if (!s || !num(s.x) || !num(s.y)) continue;
    const d = (s.x - x) ** 2 + (s.y - y) ** 2;
    if (d < bd || (d === bd && best && s.a < best.a)) { bd = d; best = s; }
  }
  return best ? `Deep space near ${best.n || 'System'}` : 'Deep space';
}
// Does a hot spot involve the filtered faction? (npc filter: any NPC event; player faction: any player event of it)
export function hotMatch(h, faction) {
  if (!faction) return true;
  if (faction === 'npc') return h.npc > 0;
  return h.playerFa.includes(faction); // 'unaligned' = unaligned PLAYER events only, NPCs are 'npc' (task #44, factionMatch)
}
// Starbases and territory belong to the three player factions; 'npc' / 'unaligned' filters leave them undimmed.
export const systemDimmed = (sysFaction, faction) => ['mud', 'oni', 'ustur'].includes(faction) && factionKey(sysFaction) !== faction;

// Filter -> per-fleet visibility: 0.06 = filtered out (kept as faint context, not pickable), 1 = shown, 2 = focused owner.
export const VIS_DIM = 0.06;
// Filter factions: 'mud' | 'oni' | 'ustur' = PLAYER fleets of that faction (npc == 0); 'npc' = every fleet with npc != 0;
// 'unaligned' = faction key unaligned (kept for compatibility). Agreed with builder-c4-panels 2026-11-06.
export const FILTER_FACTIONS = ['mud', 'oni', 'ustur', 'npc', 'unaligned'];
export function factionMatch(f, faction) {
  if (!faction) return true;
  if (faction === 'npc') return !!f.npc;
  return !f.npc && factionKey(f.fa) === faction; // 'unaligned' = unaligned PLAYERS; NPCs match only 'npc' (task #44)
}
export function fleetVis(f, filter) {
  const k = (f.s && f.s.kind) || 'idle';
  if (filter.owner) return f.o === filter.owner ? 2 : VIS_DIM;
  if (filter.faction && !factionMatch(f, filter.faction)) return VIS_DIM;
  if (filter.states && filter.states.length && !filter.states.includes(k)) return VIS_DIM;
  return 1;
}

// Square that frames a set of points, for fly-to. Returns null for an empty set.
export function frame(points) {
  if (!points.length) return null;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of points) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return {x: (x0 + x1) / 2, y: (y0 + y1) / 2, span: Math.max(x1 - x0, y1 - y0)};
}

// Endpoints [ax, ay, bx, by] of a combat tracer from opponent j's current position to the event point, or null when the
// opponent is not in the current data (lead's rule 2026-11-06: skip it). The collector stamps no x,y on `vs` entries and
// paired fleets usually share the event's coordinate, so an opponent found less than 0.3 units away gets a 1.6-unit
// exchange centred on the event point (angle seeded by the pair, fanned per opponent) instead of an invisible
// zero-length line.
export function tracerEnds(ev, j, opp) {
  if (!opp) return null;
  if (Math.hypot(opp[0] - ev.x, opp[1] - ev.y) >= 0.3) return [opp[0], opp[1], ev.x, ev.y];
  const o = (ev.vs && ev.vs[j]) || {};
  const a = seedOf(String(ev.f) + String(o.f)) * Math.PI * 2 + j * 0.9, dx = Math.cos(a) * 0.8, dy = Math.sin(a) * 0.8;
  return [ev.x - dx, ev.y - dy, ev.x + dx, ev.y + dy];
}

// ---------------------------------------------------------------- systems in the world (task #15, one world since v10)
// The chain gives NO position for a body inside its system, so the layout is stylised and deterministic: bodies sorted
// by id take orbit rings outward from the star, each starts at an angle seeded by its address and turns slowly
// (period grows with r^1.5). SYS / systemLayout / BODY_R are LAYOUT units; the world draws a system at layout x its
// systemScale (below), around the system's own map x,y.
export const SYS = {orbit0: 0.75, orbitStep: 0.46, starR: 0.26, sbGap: 0.5, idleR0: 0.5};
// ONE CONTINUOUS WORLD (v10, owner 2026-11-08 "I want the star system on the same map, all the way zoomable"): every
// system is always drawn at its map position with its star, orbits, bodies, starbase and ships, so a system must fit in
// its own neighbourhood. Measured on the 2026-11-08 data (945 systems): nearest-neighbour distance median 1.12, p10 0.38,
// p1 0.20, min 0.11 map units; layout extent (outer orbit + starbase) 1.45-4.67 layout units, median 2.83. WORLD.K = 0.032
// puts the largest system (8 bodies, extent 4.67) at radius 0.149 = rMax, well under half the p10 spacing; a system whose
// nearest neighbour is closer squeezes to nnShare (0.45) of that distance (15 of 945 systems on the 2026-11-08 data, down to 0.54 K - Trellis,
// nn 0.109). Ships use K for every hull (HULL_LEN below = the old lengths x K), so planets dwarf ships in the same
// proportion as before; in a squeezed system the bodies are up to 1.85x smaller relative to the hulls.
export const WORLD = {K: 0.032, rMax: 0.15, nnShare: 0.45};
// a system's layout extent (outer orbit + starbase gap + the station glyph), layout units; nBodies 0 = star + starbase
export const systemExtent = (nBodies) => (nBodies > 0 ? SYS.orbit0 + (nBodies - 1) * SYS.orbitStep : SYS.orbit0) + SYS.sbGap + 0.2;
// layout -> world scale per system: min(K, rMax / extent, nnShare x nearest neighbour / extent). countOf(addr) = bodies.
export function systemScales(systems, countOf) {
  const ok = (systems || []).filter((s) => s && num(s.x) && num(s.y)), out = new Map();
  for (const s of ok) {
    let nn = Infinity;
    for (const t of ok) if (t !== s) { const d = (s.x - t.x) ** 2 + (s.y - t.y) ** 2; if (d < nn) nn = d; }
    nn = Math.sqrt(nn);
    const ext = systemExtent(countOf ? countOf(s.a) : 0);
    out.set(s.a, Math.min(WORLD.K, WORLD.rMax / ext, Number.isFinite(nn) ? WORLD.nnShare * nn / ext : WORLD.K));
  }
  return out;
}
// Where a member fleet is drawn inside its system (v10; the SAME maths as GLSL place() in main.js FLEET_VS, mirrored here
// for picking, fleetScreen and fleetPixelSize). A = the fleet's iA, O = its iO instance attribute, seed = iM.w:
//   mode 1 static (docked / idle): A = (cx, cy, lx, ly), O.xy = the local point the nose points at (O.xy = A.zw: none)
//   mode 2 mining:  A = (cx, cy, slot r, slot angle from the rock's star direction), O = (rock orbit r, a0, w, 2)
//   mode 3 claim-stake transfer: A = (cx, cy, station lx, ly), O = (planet orbit r, a0, w, 3): a loop station <-> planet
// out = [lx, ly, hx, hy]: the offset from (cx, cy) in world units and the heading vector (0, 0 = none).
export function placeMember(A, O, seed, anim, out = [0, 0, 0, 0]) {
  const mode = Math.round(O[3]);
  if (mode === 1) { out[0] = A[2]; out[1] = A[3]; out[2] = O[0] - A[2]; out[3] = O[1] - A[3]; return out; }
  const a = O[1] + O[2] * anim, bx = O[0] * Math.cos(a), by = O[0] * Math.sin(a);
  if (mode === 2) {
    const ang = Math.atan2(-by, -bx) + A[3], amp = A[2] * 0.045;
    const lx = bx + A[2] * Math.cos(ang) + amp * Math.sin(anim * 0.6 + seed * 13), ly = by + A[2] * Math.sin(ang) + amp * Math.sin(anim * 0.47 + seed * 7);
    out[0] = lx; out[1] = ly; out[2] = bx - lx; out[3] = by - ly; return out;
  }
  // mode 3: out to the planet and back along a gentle bow; heading = along the path
  const at = (t) => {
    const ph = 0.5 - 0.5 * Math.cos(t * 6.2831853), side = Math.sin(t * 6.2831853) * 0.18;
    const dx = bx - A[2], dy = by - A[3], L = Math.hypot(dx, dy) || 1;
    return [A[2] + dx * ph - dy / L * side * L, A[3] + dy * ph + dx / L * side * L];
  };
  const t = (anim * 0.04 + seed) % 1, p = at(t), q = at(t + 0.002);
  out[0] = p[0]; out[1] = p[1]; out[2] = q[0] - p[0]; out[3] = q[1] - p[1]; return out;
}
const SLUG = {oceanic: 'oceanic', barren: 'barren', 'gas-giant': 'gas', 'ice-giant': 'ice', volcanic: 'volcanic', terrestrial: 'terrestrial', dark: 'dark'};
export const bodySlug = (b) => (b.k === 'asteroid' ? 'belt' : SLUG[b.sub] || 'barren');
export const BODY_R = {gas: 0.2, ice: 0.18, terrestrial: 0.15, oceanic: 0.15, volcanic: 0.145, barren: 0.13, dark: 0.13, belt: 0.16};
// the same variant hash as PlanetExplorer/orrery.js variantOf (by name), so a body keeps one look across modules
export function artVariant(name) {
  const s = String(name || ''); let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 3;
}
export function systemLayout(bodies) {
  const sorted = bodies.slice().sort((a, b) => (a.id - b.id) || (a.a < b.a ? -1 : a.a > b.a ? 1 : 0));
  // start angles: golden-angle steps per ring from a per-system offset, plus a small per-body jitter, so bodies spread
  // round the star instead of bunching (independent random angles bunched in Evernat); still fully deterministic
  const sysSeed = sorted.length ? seedOf(String(sorted[0].sys)) : 0;
  return sorted.map((b, i) => {
    const r = SYS.orbit0 + i * SYS.orbitStep, seed = seedOf(b.a), slug = bodySlug(b);
    const a0 = sysSeed * Math.PI * 2 + i * 2.39996323 + (seed - 0.5) * 0.5;
    return {b, i, r, a0, w: 0.06 / Math.pow(r, 1.5), slug, variant: artVariant(b.n), size: BODY_R[slug]};
  });
}
export function bodyLocal(L, anim, out = [0, 0]) {
  const a = L.a0 + L.w * anim;
  out[0] = Math.cos(a) * L.r; out[1] = Math.sin(a) * L.r;
  return out;
}
// The starbase station sits just outside the outermost ring, at an angle seeded by the system address (static).
export function starbaseLocal(sysAddr, layout, out = [0, 0]) {
  const r = (layout.length ? layout[layout.length - 1].r : SYS.orbit0) + SYS.sbGap, a = seedOf(String(sysAddr) + ':sb') * Math.PI * 2;
  out[0] = Math.cos(a) * r; out[1] = Math.sin(a) * r;
  return out;
}
// Small sunflower disc for docked fleets around the station / idle fleets around the star.
export function discOffset(j, r0, step, out = [0, 0]) {
  const r = r0 + step * Math.sqrt(j), a = j * 2.39996323;
  out[0] = Math.cos(a) * r; out[1] = Math.sin(a) * r;
  return out;
}
export const topResources = (b, n = 3) => (b.res || []).slice().sort((x, y) => (y.rich || 0) - (x.rich || 0) || (x.r < y.r ? -1 : 1)).slice(0, n);
export function bodyLabel(b, miningFleets, stakeCount) {
  const type = b.k === 'asteroid' ? 'asteroid' : (b.sub || 'planet').replace('-', ' ') + ' planet';
  const res = topResources(b).map((x) => `${x.r} ${x.rich}`).join(', ');
  return `${b.n} - ${type}${res ? ' - ' + res : ''} - ${miningFleets} fleet${miningFleets === 1 ? '' : 's'} mining`
    + ` - ${stakeCount} claim stake${stakeCount === 1 ? '' : 's'} - orbit layout stylised (chain has no in-system positions)`;
}
// Miners hug their rock (task #32, owner 2026-11-07): fleet j of n on a rock of radius R gets a slot in layered shells at
// 1.08R, 1.16R, 1.24R (never past 1.3R), just off the surface, on an arc centred on the star-facing side that widens with
// the crowd (up to almost a full ring). Returns {r, ang (relative to the star direction), layer}. Pure and deterministic.
// (layout units, like R; spacing ~0.8 of a medium hull at the same scale.) Since v10 a miner shows by its own on-screen
// size like every hull (HULL_PX) - the camera-distance proximity fade (MINER_VIEW / minerFade / minerShown) is gone.
export const MINER = {r0: 1.08, step: 0.08, rMax: 1.3, spacing: 0.024, beamCap: 24};
export function minerSlot(j, n, R) {
  const arc = Math.min(Math.PI * 1.85, Math.PI * 0.9 + n * 0.03);
  let left = j;
  for (let layer = 0; ; layer++) {
    const rr = Math.min(MINER.r0 + layer * MINER.step, MINER.rMax);
    const cap = Math.max(3, Math.floor(arc * rr * R / MINER.spacing));
    const remaining = n - (j - left); // fleets not placed in earlier layers, this one included
    if (left < cap || rr >= MINER.rMax) {
      // the outermost allowed shell takes everyone left (it may get tight; it never goes past rMax)
      const count = rr >= MINER.rMax ? Math.max(1, remaining) : Math.min(cap, remaining);
      const ang = ((left + 0.5) / count - 0.5) * arc + (layer % 2 ? 0.5 * arc / count : 0);
      return {r: rr * R, ang, layer};
    }
    left -= cap;
  }
}

// Ship silhouette atlas (Images/ships/silhouettes/atlas.json, builder-c4-art). Its own resolve rule:
//   slug = configToSlug[fleet.flag]; index = slug ? entries[slug] : sizeClass[fleet.flagSize] ?? sizeClass[fallbackClass]
// plus aliases (slug -> slug). A config mapped to null (rejected by size) or unknown falls to its size class.
// Own-property lookups only: a flag such as "__proto__" or "constructor" must not resolve through Object.prototype
// (reviewer P3, task #23) - it falls to its size class like any unknown config.
const own = (o, k) => o != null && typeof k === 'string' && Object.prototype.hasOwnProperty.call(o, k);
export function atlasCell(atlas, flag, flagSize) {
  if (!atlas || !atlas.entries) return -1;
  let slug = own(atlas.configToSlug, flag) ? atlas.configToSlug[flag] : null;
  if (slug && own(atlas.aliases, slug)) slug = atlas.aliases[slug];
  if (slug && own(atlas.entries, slug)) return atlas.entries[slug];
  const sc = atlas.sizeClass || {};
  if (own(sc, flagSize)) return sc[flagSize];
  return own(sc, atlas.fallbackClass) ? sc[atlas.fallbackClass] : -1;
}
// Hover text for the hull: the model (slug, prettified) or "generic <class> hull" for a size-class stand-in.
export function hullLabel(atlas, flag, flagSize) {
  const cell = atlasCell(atlas, flag, flagSize);
  if (cell < 0) return '';
  const generic = Object.entries(atlas.sizeClass || {}).find(([, i]) => i === cell);
  if (generic) return `generic ${generic[0]} hull`;
  const slug = Object.keys(atlas.entries).find((s) => atlas.entries[s] === cell) || '';
  return slug.split('-').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ') + ' hull';
}
// World-scale hulls (owner, task #23: "make the ships tiny ... proportional to the systems"; rule c4-ships-world-scale).
// HULL_LEN is the hull's world LENGTH in galaxy map units. v10: the pre-v10 lengths (xx-small 0.012 ... titan 0.07, against
// planets of radius 0.13-0.2 layout units) x WORLD.K (0.032), the same factor the systems are drawn at, so a medium hull
// is 0.03 / 0.16 of a mined rock's radius exactly as before - only the whole system shrank into its neighbourhood.
// Literal values (c4-ui-model.js SHIP_HULL_LEN copies them; Test/c4-live-check.js asserts equality).
export const HULL_LEN = {'xx-small': 0.000384, 'x-small': 0.000512, small: 0.000704, medium: 0.00096, large: 0.00128, capital: 0.001664, commander: 0.00192, titan: 0.00224};
// sizeScale = world HALF-size of the quad: the silhouette fills 0.92 of its cell, so half = len / 2 / 0.92
export const sizeScale = (flagSize) => (own(HULL_LEN, flagSize) ? HULL_LEN[flagSize] : HULL_LEN.medium) / 2 / 0.92;
export const SHIP_BASE = {galaxy: 1, system: 1}; // multiplier on sizeScale (one world since v10: both 1, kept for the panels' derivation)
// Projected hull QUAD length (px) below which a hull is not drawn and not pickable, and at which it is fully opaque.
// v10 (owner rule: no px floor, "fade a hull out below ~1.5 px instead of clamping it"): fully drawn from 1.5 px, fading
// out to nothing at 0.75 px. FLEET_VS / TRAIL_VS / BEAM_VS use the same two numbers.
export const HULL_PX = {collapse: 0.75, full: 1.5};
// the same two numbers as flat named exports (panels' "zoom in to see ships" hint derives its threshold from these):
// a hull's on-screen QUAD length in CSS px = (HULL_LEN[cls] / 0.92) x projectionMatrix[1][1] x 0.5 x viewHeight / viewDepth
// (x 1.15 for a focused owner); drawn when that is >= HULL_MIN_PX, fully opaque from HULL_FULL_PX. The visible hull inside
// the quad is HULL_LEN itself (the silhouette fills 0.92 of its cell).
export const HULL_MIN_PX = HULL_PX.collapse, HULL_FULL_PX = HULL_PX.full;
// Transit trails (task #51, owner 2026-11-07: "the tail for a subwarp ship is way too long, there will be thousands of
// fleets"). Was a flat 3.5 (subwarp) / 7.0 (warp) MAP units - whole systems - with a uZoom-inflated width. Now in HULL
// LENGTHS of the fleet's own size class, at world scale like the hull: subwarp 4 hulls (a medium hull: 0.12 units), warp
// 10 hulls (0.30), both capped at TRAIL.max units; width a fraction of the hull length. TRAIL_VS draws a trail only where
// its hull draws (projected hull >= HULL_PX.collapse, the same formula), so at the home view no trail paints either.
export const TRAIL = {subwarp: 4, warp: 10, max: 0.0096, wSubwarp: 0.32, wWarp: 0.22, fadeS: 120}; // max = 0.3 x WORLD.K (v10)
// world length of a transit's trail when fully grown (it grows from 0 at departure: min(travelled, trailLen))
export function trailLen(kind, flagSize) {
  const hl = own(HULL_LEN, flagSize) ? HULL_LEN[flagSize] : HULL_LEN.medium;
  return Math.min(TRAIL.max, (kind === 'warp' ? TRAIL.warp : TRAIL.subwarp) * hl);
}
// the shader's focus factor: a focused owner's hulls are drawn 1.15x
export const focusScale = (vis) => (vis > 1.5 ? 1.15 : 1);

// Which fleets belong to which system view. Docked: s.system. Mining: its asteroid's system. Everything else at rest
// (idle, respawn, destroyed, claimStakeTransfer, transits that arrived by `settledBy`) within 0.6 units of a system.
// In-flight transits belong to no system. Returns Map(sysAddr -> {docked, mining, cst, idle}) of fleet indexes.
export function systemMembers(fleets, systems, bodies, settledBy) {
  const astSys = new Map(bodies.filter((b) => b.k === 'asteroid').map((b) => [b.a, b.sys]));
  const out = new Map();
  const slot = (s) => { let m = out.get(s); if (!m) { m = {docked: [], mining: [], cst: [], idle: []}; out.set(s, m); } return m; };
  fleets.forEach((f, i) => {
    const k = f.s && f.s.kind;
    if (k === 'docked' && f.s.system) { slot(f.s.system).docked.push(i); return; }
    if (k === 'mining') { const s = astSys.get(f.s.asteroid); if (s) slot(s).mining.push(i); return; }
    const rp = restPoint(f, settledBy);
    if (!rp) return; // in flight
    let best = null, bd = 0.36; // 0.6^2
    for (const s of systems) { const d = (s.x - rp[0]) ** 2 + (s.y - rp[1]) ** 2; if (d < bd) { bd = d; best = s.a; } }
    if (best) slot(best)[k === 'claimStakeTransfer' ? 'cst' : 'idle'].push(i);
  });
  return out;
}

// ---------------- DACs (task #53, owner 2026-11-07: "colour code the influence on the map per DAC")
// The SAME rule as c4-ui-model.js dacInfluence (that file is a classic script, so the rule lives here a second time; a
// check runs both on the real data and asserts equality). dacs = [{tag, members: [profile address]}]. A member fleet
// (npc excluded) counts at the system it belongs to by the membership rule of systemMembers (docked -> its starbase,
// mining -> its asteroid's system, else resting within 0.6 of a system; in flight -> nowhere); stakes count at k.sys.
// -> {systems: [{a, n, x, y, byDac: {TAG: {fleets, ships, stakes, ups}}}], byDac: {TAG: [{a, n, x, y, fleets, ships, stakes, ups}]}}
// both sorted by fleets, then stakes, then u/s, then address.
export function dacInfluence(latest, dacs) {
  latest = latest || {};
  const systems = (latest.systems || []).filter((s) => s && num(s.x) && num(s.y));
  const sysBy = new Map((latest.systems || []).filter((s) => s && s.a).map((s) => [s.a, s]));
  const astSys = new Map(); for (const a of latest.asteroids || []) if (a && a.a && a.sys) astSys.set(a.a, a.sys);
  const settledBy = (num(latest.generatedAt) ? latest.generatedAt : 0) - 120;
  const tagsOf = new Map();
  for (const d of dacs || []) for (const p of (d && d.members) || []) { const t = tagsOf.get(p) || []; if (!t.includes(d.tag)) t.push(d.tag); tagsOf.set(p, t); }
  const bySys = new Map();
  const cell = (sys, tag) => { let s = bySys.get(sys); if (!s) bySys.set(sys, s = {}); return s[tag] || (s[tag] = {fleets: 0, ships: 0, stakes: 0, ups: 0}); };
  for (const f of latest.fleets || []) {
    if (!f || f.npc || !f.s || !num(f.x) || !num(f.y)) continue;
    const tags = tagsOf.get(f.o); if (!tags) continue;
    const sy = memberSystemOf(f, systems, astSys, settledBy); if (!sy) continue;
    const u = fleetUps(f);
    for (const t of tags) { const c = cell(sy, t); c.fleets++; c.ships += f.ships || 0; c.ups += u; }
  }
  for (const k of latest.stakes || []) {
    const tags = k && k.sys ? tagsOf.get(k.o) : null; if (!tags) continue;
    for (const t of tags) cell(k.sys, t).stakes++;
  }
  const ord = (a, b) => b.fleets - a.fleets || b.stakes - a.stakes || b.ups - a.ups || (a.a < b.a ? -1 : a.a > b.a ? 1 : 0);
  const tot = (byDac) => Object.values(byDac).reduce((s, c) => ({fleets: s.fleets + c.fleets, stakes: s.stakes + c.stakes, ups: s.ups + c.ups}), {fleets: 0, stakes: 0, ups: 0});
  const out = [...bySys].map(([a, byDac]) => { const s = sysBy.get(a) || {}; return {a, n: s.n || null, x: s.x, y: s.y, byDac}; })
    .sort((p, q) => ord({a: p.a, ...tot(p.byDac)}, {a: q.a, ...tot(q.byDac)}));
  const byDac = {};
  for (const d of dacs || []) byDac[d.tag] = out.filter((s) => s.byDac[d.tag]).map((s) => ({a: s.a, n: s.n, x: s.x, y: s.y, ...s.byDac[d.tag]})).sort(ord);
  return {systems: out, byDac};
}
// one fleet -> its system address by the systemMembers rule (null = in flight / nowhere)
function memberSystemOf(f, systems, astSys, settledBy) {
  const k = f.s.kind;
  if (k === 'docked' && f.s.system) return f.s.system;
  if (k === 'mining') return astSys.get(f.s.asteroid) || null;
  const rp = restPoint(f, settledBy);
  if (!rp) return null;
  let best = null, bd = 0.36;
  for (const s of systems) { const d = (s.x - rp[0]) ** 2 + (s.y - rp[1]) ** 2; if (d < bd) { bd = d; best = s.a; } }
  return best;
}
export const DAC_GREY = '#8a94a6';
const DAC_HEX = /^#[0-9a-fA-F]{6}$/;
export const dacHex = (c) => (typeof c === 'string' && DAC_HEX.test(c) ? c.toLowerCase() : DAC_GREY); // never raw input into CSS
// presence weight of one DAC at one system (dominance and halo size): fleets + stakes, u/s breaks ties
export const dacWeight = (c) => (c ? c.fleets + c.stakes : 0);
// the dominant DAC at a system: most fleets + stakes, then u/s, then the DAC list order
export function dacDominant(byDac, order) {
  let best = null;
  for (const t of order) {
    const c = byDac[t]; if (!c || dacWeight(c) <= 0) continue;
    if (!best || dacWeight(c) > dacWeight(byDac[best]) || (dacWeight(c) === dacWeight(byDac[best]) && c.ups > byDac[best].ups)) best = t;
  }
  return best;
}
// The scene's DAC layer from setDacs state: one column per system with presence (coloured by its dominant DAC, or by the
// focused DAC when one is focused - then only its systems), and one halo per (system, DAC) with its share of the system.
// dacs = [{tag, color, members}] (already sanitised). -> {cols, halos}
export function dacLayer(latest, dacs, focus) {
  const list = (dacs || []).filter((d) => d && typeof d.tag === 'string' && d.tag);
  if (!latest || !list.length) return {cols: [], halos: []};
  const inf = dacInfluence(latest, list), order = list.map((d) => d.tag), hex = new Map(list.map((d) => [d.tag, dacHex(d.color)]));
  const foc = focus && hex.has(focus) ? focus : null;
  const cols = [], halos = [];
  let wmax = 0;
  for (const s of inf.systems) for (const t of order) wmax = Math.max(wmax, dacWeight(s.byDac[t]));
  for (const s of inf.systems) {
    if (!num(s.x) || !num(s.y)) continue;
    const tot = order.reduce((v, t) => v + dacWeight(s.byDac[t]), 0);
    if (tot <= 0) continue;
    for (const t of order) {
      const c = s.byDac[t], w = dacWeight(c); if (w <= 0) continue;
      halos.push({sys: s.a, tag: t, x: s.x, y: s.y, hex: hex.get(t), share: w / tot, w, wmax, dim: foc && t !== foc});
    }
    const t = foc || dacDominant(s.byDac, order), c = t && s.byDac[t];
    if (!c || dacWeight(c) <= 0) continue;
    const others = order.filter((u) => u !== t && dacWeight(s.byDac[u]) > 0).length;
    cols.push({key: 'dac:' + s.a, x: s.x, y: s.y, v: foc ? dacWeight(c) : tot, fa: 'dac', hex: hex.get(t), tag: t, sys: s.a, name: s.n || 'System',
      line: `${t}${SEP}${plural(c.fleets, 'fleet')}${SEP}${plural(c.stakes, 'stake')}${others ? `${SEP}+${others} DAC${others === 1 ? '' : 's'}` : ''}`,
      fleets: c.fleets, stakes: c.stakes});
  }
  cols.sort((p, q) => q.v - p.v || (p.key < q.key ? -1 : 1));
  return {cols, halos, inf};
}

// ---------------- DAC CONQUEST (task #55, owner 2026-11-07: "it shows the map 'conquered' by that DAC if they are the
// biggest miners there. similarly with claim stakes, combat fleets in a location"). THE RULE (pinned by the lead; the SAME
// rule as c4-ui-model.js dacConquest, checked equal on real + synthetic data). Per system s, per DAC d, per metric:
//   mining = member fleets' (npc excluded) mine u/s at memberSystemOf = s; T = the same over ALL fleets (npc included)
//   stakes = member stakes with k.sys = s; T = all stakes there
//   fleets = member fleets' ships at memberSystemOf = s (docked, mining, at rest; in flight -> nowhere); T = all fleets
//   combat = hot events (isHotKind, window (ref - 86400, ref], a kill once per fleet over ALL events) at the nearest system
//            (sq dist < 1.44 strict, tie lower address; none -> dropped) whose owner (e.o if a string, else the owner of
//            fleet e.f in latest.fleets) is a member; e.npc === true never counts for a DAC; T = all of them (NPC included)
// share = v / T (0 if T = 0); score = sum of shares in the FIXED order mining, stakes, combat, fleets; winner = max score
// > 0, a second DAC within 1e-9 -> contested (no winner, strength 0); strength = score / (selected metrics with T(s) > 0).
// scope = one DAC tag: only it competes. -> {systems: [{a, n, x, y, winner, contested, strength, scores}] (EVERY system
// where some selected T > 0 - winner null and contested false where no DAC scores; address asc), byDac: {TAG: systems
// won}, contested: n} (lead pin 2026-11-07 16:40 EST)
export const CONQUEST_METRICS = ['mining', 'stakes', 'combat', 'fleets'];
export function dacConquest(latest, events, dacs, metrics, scope) {
  latest = latest || {};
  const list = (dacs || []).filter((d) => d && typeof d.tag === 'string' && d.tag);
  const tags = [...new Set(list.map((d) => d.tag))];
  const comp = typeof scope === 'string' && tags.includes(scope) ? [scope] : tags;
  const mets = CONQUEST_METRICS.filter((m) => Array.isArray(metrics) && metrics.includes(m));
  const systems = (latest.systems || []).filter((s) => s && typeof s.a === 'string' && num(s.x) && num(s.y));
  const astSys = new Map(); for (const a of latest.asteroids || []) if (a && a.a && a.sys) astSys.set(a.a, a.sys);
  const ref = num(latest.generatedAt) ? latest.generatedAt : 0, settledBy = ref - 120;
  const tagsOf = new Map();
  for (const d of list) if (comp.includes(d.tag)) for (const p of d.members || []) { const t = tagsOf.get(p) || []; if (!t.includes(d.tag)) t.push(d.tag); tagsOf.set(p, t); }
  // acc: sys -> metric -> {T, v: {TAG: n}}
  const acc = new Map();
  const add = (sys, m, owner, n, member) => {
    let s = acc.get(sys); if (!s) acc.set(sys, s = {});
    const c = s[m] || (s[m] = {T: 0, v: {}});
    c.T += n;
    const ts = member ? tagsOf.get(owner) : null;
    if (ts) for (const t of ts) c.v[t] = (c.v[t] || 0) + n;
  };
  const wantMine = mets.includes('mining'), wantFleets = mets.includes('fleets');
  if (wantMine || wantFleets) {
    for (const f of latest.fleets || []) {
      if (!f || !f.s || !num(f.x) || !num(f.y)) continue;
      const sy = memberSystemOf(f, systems, astSys, settledBy); if (!sy) continue;
      if (wantMine) add(sy, 'mining', f.o, fleetUps(f), !f.npc);
      if (wantFleets) add(sy, 'fleets', f.o, num(f.ships) ? f.ships : 0, !f.npc);
    }
  }
  if (mets.includes('stakes')) for (const k of latest.stakes || []) if (k && typeof k.sys === 'string') add(k.sys, 'stakes', k.o, 1, true);
  if (mets.includes('combat')) {
    const killed = new Set(), R2 = COMBAT_SYS_R * COMBAT_SYS_R;
    const ownerOf = new Map(); for (const f of latest.fleets || []) if (f && f.a) ownerOf.set(f.a, f.o);
    for (const e of events || []) {
      if (!e || !isHotKind(e) || !num(e.t) || !num(e.x) || !num(e.y) || e.t > ref || e.t <= ref - 86400) continue;
      if (isKill(e) && e.f) { if (killed.has(e.f)) continue; killed.add(e.f); }
      let best = null, bd = R2;
      for (const s of systems) {
        const d = (s.x - e.x) ** 2 + (s.y - e.y) ** 2;
        if (d < bd || (d === bd && best && s.a < best.a)) { bd = d; best = s; }
      }
      if (best) add(best.a, 'combat', typeof e.o === 'string' ? e.o : ownerOf.get(e.f), 1, e.npc !== true);
    }
  }
  const out = [], byDac = Object.fromEntries(comp.map((t) => [t, 0]));
  let contested = 0;
  for (const s of systems.slice().sort((p, q) => (p.a < q.a ? -1 : p.a > q.a ? 1 : 0))) {
    const m = acc.get(s.a); if (!m) continue;
    const scores = {}; let live = 0;
    for (const k of mets) {
      const c = m[k]; if (!c || !(c.T > 0)) continue;
      live++;
      for (const t of comp) if (c.v[t] > 0) scores[t] = (scores[t] || 0) + c.v[t] / c.T;
    }
    if (!live) continue; // no selected metric has any activity here
    let best = null, top = 0;
    for (const t of comp) if (scores[t] > top) { top = scores[t]; best = t; }
    const tie = !!best && comp.some((t) => t !== best && scores[t] > 0 && Math.abs(scores[t] - top) <= 1e-9);
    if (tie) contested++; else if (best) byDac[best]++;
    out.push({a: s.a, n: s.n || null, x: s.x, y: s.y, winner: tie ? null : best, contested: tie, strength: best && !tie ? top / live : 0, scores});
  }
  return {systems: out, byDac, contested};
}
// the 'dacs' stat layer while the conquest lens is on: one column per WON system in the winner's colour, v = strength %.
// Callouts are per DAC, not per system (five "CLUB · 100 %" boxes said one thing five times): each DAC's strongest system
// comes first and carries "TAG · conquers N systems"; the DAC's other columns have callout:false. Contested systems stand
// no column (they draw neutral). Order: the DAC leaders by systems won desc, then mean strength desc, then tag; then the rest
// by v desc, then key.
export function conquestColumns(conq, dacs) {
  const hex = new Map((dacs || []).filter((d) => d && typeof d.tag === 'string').map((d) => [d.tag, dacHex(d.color)]));
  const won = (conq && conq.byDac) || {}, cols = [];
  for (const s of (conq && conq.systems) || []) {
    if (!s || !s.winner || !num(s.x) || !num(s.y)) continue;
    const pct = Math.round(Math.max(0, Math.min(1, s.strength)) * 100), n = won[s.winner] || 0;
    cols.push({key: 'dac:' + s.a, x: s.x, y: s.y, v: Math.max(1, pct), fa: 'dac', hex: hex.get(s.winner) || DAC_GREY, tag: s.winner, sys: s.a,
      name: s.n || 'System', line: `${s.winner}${SEP}conquers ${plural(n, 'system')}`, strength: s.strength, won: n, callout: false});
  }
  const byV = (p, q) => q.v - p.v || (p.key < q.key ? -1 : p.key > q.key ? 1 : 0);
  cols.sort(byV);
  const mean = new Map();
  for (const c of cols) { const m = mean.get(c.tag) || [0, 0]; m[0] += c.strength; m[1]++; mean.set(c.tag, m); }
  const lead = [], seen = new Set();
  for (const c of cols) if (!seen.has(c.tag)) { seen.add(c.tag); c.callout = true; lead.push(c); }
  const mt = (t) => { const m = mean.get(t); return m[0] / m[1]; };
  lead.sort((p, q) => q.won - p.won || mt(q.tag) - mt(p.tag) || (p.tag < q.tag ? -1 : p.tag > q.tag ? 1 : 0));
  return lead.concat(cols.filter((c) => !c.callout));
}

export function fleetLabel(f) {
  const k = (f.s && f.s.kind) || 'idle';
  return `${f.n || 'Fleet'} - ${f.ships || 0} ship${f.ships === 1 ? '' : 's'} - ${k}${f.npc ? ' (NPC)' : ''}`;
}
export const systemLabel = (s) => `${s.n || 'System'} - ${factionKey(s.f)} starbase lvl ${s.lvl || 0}`;
export const asteroidLabel = (a) => `${a.sysName || 'Asteroid'} asteroid - ${a.fleets || 0} fleets - ${(a.ups || 0).toFixed(1)} u/s`;
