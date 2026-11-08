// Checks the C4 Live galaxy scene: bundle API surface, the pure transit model, and (when the teardown skill's playwright
// is installed) a real headless-browser drive of C4Live/scene-src/dev.html on the real Data/c4-live files.
//   node Test/c4-scene-check.js              exit 1 on any FAIL
//   NO_BROWSER=1 node Test/c4-scene-check.js  node checks only
//   SHOT_DIR=<dir>                            where the browser screenshots go (default: OS temp)
// Rebuild first if scene-src changed: node C4Live/scene-src/build.mjs
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const http = require('http');
const {createRequire} = require('module');

const ROOT = path.join(__dirname, '..');
const BUNDLE = path.join(ROOT, 'C4Live/c4-scene.js');
const LAYERS = ['systems', 'fleets', 'mining', 'routes', 'combat', 'territory', 'labels'];
const HOME_DIST = 128; // the scene's home camera distance: focusPoint(x, y, zoom) puts the camera at HOME_DIST / zoom
const API = ['setData', 'setFilter', 'focusOwner', 'focusPoint', 'pulseEvent', 'on', 'setLayer', 'dispose', 'focusSystem'];
let pass = 0, fail = 0;
const check = (name, ok, detail) => { if (ok) pass++; else fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail !== undefined ? ': ' + JSON.stringify(detail) : ''}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- 1. bundle surface, evaluated in a bare sandbox (no DOM): it must define window.C4Scene without touching the page
function bundleSurface(src) {
  const window = {};
  vm.runInNewContext(src, {window, self: window, console: {log() {}, warn() {}, error() {}}}, {timeout: 10000});
  const C = window.C4Scene;
  return {mount: !!C && typeof C.mount === 'function', layers: C && C.layers, version: C && C.version};
}

// ---- 2. transit model. Expectations written here by hand, not through model.js.
function transitCases(M) {
  const errs = [];
  const eq = (a, b, name) => { if (Math.abs(a[0] - b[0]) > 1e-9 || Math.abs(a[1] - b[1]) > 1e-9) errs.push(`${name}: got ${a} want ${b}`); };
  const sub = {a: 'A', x: 1, y: 2, s: {kind: 'subwarp', departs: 1000, arrives: 1100, from: [1, 2], to: [11, -8]}};
  const P = M.fleetPath(sub);
  if (!P.moving) errs.push('subwarp with from/to/departs/arrives is not moving');
  eq(M.fleetPos(P, 900), [1, 2], 'before departure sits at from');
  eq(M.fleetPos(P, 1000), [1, 2], 'at departure');
  eq(M.fleetPos(P, 1025), [3.5, -0.5], 'quarter way');
  eq(M.fleetPos(P, 1050), [6, -3], 'half way');
  eq(M.fleetPos(P, 1100), [11, -8], 'at arrival');
  eq(M.fleetPos(P, 99999), [11, -8], 'long after arrival sits at to, not past it');
  // warp with no s.from (the real data shape): departs from the chain x,y
  const warp = {x: 0.042, y: -38.802, s: {kind: 'warp', departs: 10, arrives: 13, to: [-0.025, -38.425]}};
  eq(M.fleetPos(M.fleetPath(warp), 11.5), [(0.042 - 0.025) / 2, (-38.802 - 38.425) / 2], 'warp without from starts at x,y');
  // stale or incomplete transit data falls back to x,y
  eq(M.fleetPos(M.fleetPath({x: 5, y: 6, s: {kind: 'warp', departs: 1, arrives: 2}}), 1.5), [5, 6], 'warp without to -> x,y');
  eq(M.fleetPos(M.fleetPath({x: 5, y: 6, s: {kind: 'subwarp', to: [9, 9]}}), 1.5), [5, 6], 'subwarp without times -> x,y');
  eq(M.fleetPos(M.fleetPath({x: 5, y: 6, s: {kind: 'mining', to: [9, 9], departs: 0, arrives: 9}}), 4), [5, 6], 'non-transit kind ignores to');
  // degenerate window counts as arrived once departed
  eq(M.fleetPos(M.fleetPath({x: 0, y: 0, s: {kind: 'warp', departs: 50, arrives: 50, to: [4, 4]}}), 50), [4, 4], 'zero-length window at departs -> to');
  if (M.progress(P, 1050) !== 0.5) errs.push('progress(half) != 0.5');
  return errs;
}

(async () => {
  // ---------------- node checks
  const src = fs.readFileSync(BUNDLE, 'utf8');
  check('bundle carries the three.js MIT banner', /three\.js [\d.]+ \(MIT License/.test(src.slice(0, 400)));
  const s = bundleSurface(src);
  check('bundle sets window.C4Scene.mount in a bare sandbox', s.mount, s);
  check('C4Scene.layers lists exactly the 7 contract layers', JSON.stringify(s.layers) === JSON.stringify(LAYERS), s.layers);
  // negative control: the same bundle with the export renamed must fail the surface check
  const broken = bundleSurface(src.replace(/window\.C4Scene\s*=/, 'window.C4SceneX='));
  check('NEGATIVE: bundle with the export renamed is detected as missing mount', broken.mount === false, broken);

  const modelSrc = fs.readFileSync(path.join(ROOT, 'C4Live/scene-src/model.js'), 'utf8');
  const M = await import('data:text/javascript,' + encodeURIComponent(modelSrc));
  const errs = transitCases(M);
  check('transit interpolation: 12 hand-computed cases', errs.length === 0, errs);
  // negative control: an unclamped interpolation (overshoots after arrival) must be caught by the same cases
  const mutant = {...M, fleetPos: (p, now, out = [0, 0]) => {
    if (!p.moving) { out[0] = p.from[0]; out[1] = p.from[1]; return out; }
    const t = (now - p.dep) / (p.arr - p.dep);
    out[0] = p.from[0] + (p.to[0] - p.from[0]) * t; out[1] = p.from[1] + (p.to[1] - p.from[1]) * t; return out;
  }};
  const mErrs = transitCases(mutant);
  check('NEGATIVE: unclamped mutant interpolation FAILS the cases', mErrs.length > 0, mErrs.length + ' case(s) caught');

  // faction colours = the house palette in landing.css (task #8)
  // read at test time from the CSS, not hard-coded here
  const cssVars = (file) => {
    const css = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const v = (n) => ((css.match(new RegExp('--' + n + ':\\s*(#[0-9a-fA-F]{6})')) || [])[1] || '').toLowerCase();
    return {mud: v('mud'), oni: v('oni'), ustur: v('ust')};
  };
  const house = cssVars('landing.css'), resCss = cssVars('ResourcesExplorer/resource-visual.css');
  // shader colours are linear: encode back to sRGB with an independent formula before comparing with the CSS hex
  const lin2s = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
  const toHex = (rgb) => '#' + rgb.map((v) => Math.round(lin2s(v) * 255).toString(16).padStart(2, '0')).join('');
  const paletteMatches = (hexes, colors) => Object.entries(house).every(([k, h]) => /^#[0-9a-f]{6}$/.test(h) && hexes[k] === h && toHex(colors[k]) === h);
  check('faction colours equal landing.css --mud/--oni/--ust (hex, and linear shader rgb encoded back)', paletteMatches(M.FACTION_HEX, M.FACTION_COLOR), house);
  check('landing.css and resource-visual.css agree on the house palette', JSON.stringify(house) === JSON.stringify(resCss), resCss);
  check('shader colours really are linear (oni green channel 0xc8 -> ~0.578, not 0.784)', Math.abs(M.FACTION_COLOR.oni[1] - 0.5776) < 0.002, M.FACTION_COLOR.oni);
  const altered = {...M.FACTION_HEX, oni: '#3ec8fe'};
  check('NEGATIVE: an altered hex (oni #3ec8fe) fails the palette check', !paletteMatches(altered, M.FACTION_COLOR));
  // NPC / unaligned grey = --npc in C4Live/c4.css (the panels), read at test time (task #12)
  const npcHex = ((fs.readFileSync(path.join(ROOT, 'C4Live/c4.css'), 'utf8').match(/--npc:\s*(#[0-9a-fA-F]{6})/) || [])[1] || '').toLowerCase();
  const npcMatches = (hex, color) => /^#[0-9a-f]{6}$/.test(npcHex) && hex === npcHex && toHex(color) === npcHex;
  check('NPC/unaligned colour equals C4Live/c4.css --npc (hex, and linear shader rgb encoded back)', npcMatches(M.FACTION_HEX.unaligned, M.FACTION_COLOR.unaligned), npcHex);
  check('NEGATIVE: the previous NPC grey #8094b3 fails the --npc check', !npcMatches('#8094b3', M.hexToLinear('#8094b3')));
  const gammaTwice = Object.fromEntries(Object.entries(M.FACTION_HEX).map(([k, h]) => [k, [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)]));
  check('NEGATIVE: un-linearised shader colours (hex/255) fail the palette check', !paletteMatches(M.FACTION_HEX, gammaTwice));

  const latest = JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/c4-live/latest.json'), 'utf8'));
  const events = JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/c4-live/events.json'), 'utf8'));
  const now = latest.generatedAt;
  const transits = latest.fleets.filter((f) => f.s.kind === 'warp' || f.s.kind === 'subwarp');
  const movingNow = transits.filter((f) => f.s.arrives > now && f.s.departs <= now);
  let offPath = 0;
  for (const f of movingNow) {
    const P = M.fleetPath(f), p = M.fleetPos(P, now);
    // the point must lie on the segment from->to (cross product ~ 0, within the bounding box)
    const [ax, ay] = P.from, [bx, by] = P.to, cross = (bx - ax) * (p[1] - ay) - (by - ay) * (p[0] - ax);
    if (Math.abs(cross) > 1e-6 || p[0] < Math.min(ax, bx) - 1e-9 || p[0] > Math.max(ax, bx) + 1e-9) offPath++;
  }
  check(`real data: ${movingNow.length} in-flight fleets at generatedAt all sit on their from->to segment`, movingNow.length > 0 && offPath === 0, {movingNow: movingNow.length, offPath});
  check('real data: every transit fleet yields a path (moving or x,y fallback)', transits.every((f) => M.fleetPath(f).from.every(Number.isFinite)), transits.length);
  // hot spots: combat kinds only, a kill counted once per fleet (reviewer P2-1). Expectations re-derived here.
  const hot = M.hotSpots(events, now);
  const win = events.filter((e) => e.t > now - 86400 && e.t <= now && Number.isFinite(e.x) && Number.isFinite(e.y));
  const HOT = new Set(['combat', 'destroyed', 'starbaseCombat', 'captured']);
  const seenKill = new Set();
  const want = win.filter((e) => HOT.has(e.k) || (e.k === 'gone' && e.afterCombat === true)).filter((e) => {
    if (!(e.k === 'destroyed' || e.dead === true)) return true;
    if (seenKill.has(e.f)) return false; seenKill.add(e.f); return true;
  });
  const cellKey = (e) => Math.round(e.x * 2) + ',' + Math.round(e.y * 2);
  const oldCells = new Set(win.map(cellKey)).size; // the pre-fix rule: every event kind
  check('hot spots fold exactly the combat-kind events of the last 24h, kills once per fleet', hot.reduce((a, h) => a + h.n, 0) === want.length && want.length > 0, {events: want.length, cells: hot.length, oldCells});
  check('hot spots drop the cells that only newFleet / quiet-gone events made', hot.length === new Set(want.map(cellKey)).size && hot.length < oldCells, {now: hot.length, before: oldCells});
  const combatCells = new Set(win.filter((e) => e.k === 'combat').map(cellKey));
  const hotCells = new Set(hot.map((h) => Math.round(h.x * 2) + ',' + Math.round(h.y * 2)));
  check('positive control: every cell with a combat event is still a hot spot', [...combatCells].every((k) => hotCells.has(k)) && combatCells.size > 0, combatCells.size);
  check('no hot spot is made of newFleet events only', !M.hotSpots(win.filter((e) => e.k === 'newFleet'), now).length && win.some((e) => e.k === 'newFleet'));
  const kill = [{t: now, k: 'destroyed', f: 'X', x: 1, y: 1}, {t: now, k: 'combat', f: 'X', dead: true, x: 1, y: 1}];
  const kh = M.hotSpots(kill, now)[0];
  check('a kill recorded as destroyed + combat dead:true weighs 3, not 6, and counts one destroyed', Math.abs(kh.heat - 3) < 1e-9 && kh.destroyed === 1 && kh.n === 1, kh);
  const naiveHeat = kill.reduce((a, e) => a + (e.k === 'destroyed' || e.dead ? 3 : 1), 0);
  check('NEGATIVE: the pre-fix weighting gives 6 for the same kill', naiveHeat === 6);
  check('gone counts only after combat', M.hotSpots([{t: now, k: 'gone', f: 'g', x: 2, y: 2, afterCombat: true}], now).length === 1 && M.hotSpots([{t: now, k: 'gone', f: 'g', x: 2, y: 2, afterCombat: false}], now).length === 0);
  check('filter: faction=oni keeps only oni fleets fully visible', latest.fleets.every((f) => (M.fleetVis(f, {faction: 'oni'}) === 1) === (f.fa === 'oni')));
  // stacked fleets (80+ docked at one capital) are spread so no two share a point
  const minGap = (offsetFn) => {
    let worst = Infinity, biggest = 0;
    for (const list of M.stacks(latest.fleets, now - 120).values()) {
      biggest = Math.max(biggest, list.length);
      const pts = list.map((_, j) => offsetFn(j));
      for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) worst = Math.min(worst, Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1]));
    }
    return {worst, biggest};
  };
  const gap = minGap((j) => M.stackOffset(j, [0, 0]));
  // v10: the disc is at world scale (x WORLD.K) like the hulls; a step of >= 5 medium hull lengths keeps every hull apart
  check(`stack layout: every stack member at least 5 medium hull lengths (${(5 * M.HULL_LEN.medium).toFixed(4)} units) from every other`, gap.worst >= 5 * M.HULL_LEN.medium && gap.biggest >= 50, gap);
  const gapBad = minGap(() => [0, 0]);
  check('NEGATIVE: without the layout the same stacks collide (gap 0)', gapBad.worst === 0, gapBad);
  // faction filter semantics agreed with builder-c4-panels: 'npc' = npc != 0; mud/oni/ustur = player fleets only
  check('filter: faction=npc keeps exactly the NPC fleets', latest.fleets.every((f) => (M.fleetVis(f, {faction: 'npc'}) === 1) === !!f.npc), latest.fleets.filter((f) => f.npc).length);
  const npcMud = {a: 'z', o: 'p', fa: 'mud', npc: 3, s: {kind: 'idle'}, x: 0, y: 0};
  const playerMud = {...npcMud, npc: 0};
  check('filter: faction=mud hides an NPC flagged mud, keeps a mud player', M.fleetVis(npcMud, {faction: 'mud'}) < 1 && M.fleetVis(playerMud, {faction: 'mud'}) === 1);
  const naive = (f, fa) => M.factionKey(f.fa) === fa; // the pre-agreement rule
  check('NEGATIVE: the faction-only rule would wrongly keep the NPC mud fleet', naive(npcMud, 'mud') === true);

  // combat tracer endpoints
  const ev = {f: 'A', x: 10, y: 5, vs: [{f: 'B'}, {f: 'C'}]};
  const far = M.tracerEnds(ev, 0, [14, 8]);
  check('tracer: opponent at a distinct position -> from the opponent to the event point', JSON.stringify(far) === JSON.stringify([14, 8, 10, 5]), far);
  check('NEGATIVE: tracer for an opponent not in the current data is skipped (null)', M.tracerEnds(ev, 1, null) === null);
  const same = M.tracerEnds(ev, 0, [10.1, 5]), same2 = M.tracerEnds(ev, 1, [10, 5]);
  const len = (e) => Math.hypot(e[2] - e[0], e[3] - e[1]), mid = (e) => [(e[0] + e[2]) / 2, (e[1] + e[3]) / 2];
  check('tracer: co-located opponent -> 1.6-unit exchange centred on the event', [same, same2].every((e) => Math.abs(len(e) - 1.6) < 1e-9 && Math.hypot(mid(e)[0] - 10, mid(e)[1] - 5) < 1e-9), {same, same2});
  check('tracer: two co-located opponents fan to different angles', Math.abs(Math.atan2(same[3] - same[1], same[2] - same[0]) - Math.atan2(same2[3] - same2[1], same2[2] - same2[0])) > 0.1);
  check('NEGATIVE: drawing to the raw co-located opponent would give a zero-length tracer', len([10, 5, 10, 5]) === 0 && len(same) > 1);
  const owner = latest.fleets[0].o;
  check('filter: owner focus marks exactly that owner\'s fleets', latest.fleets.every((f) => (M.fleetVis(f, {owner}) === 2) === (f.o === owner)));

  // ---- system view model (task #15)
  const bodies = JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/c4-live/bodies.json'), 'utf8')).bodies;
  const bySys = new Map();
  for (const b of bodies) { if (!bySys.has(b.sys)) bySys.set(b.sys, []); bySys.get(b.sys).push(b); }
  const someSys = [...bySys.values()].find((l) => l.length >= 6);
  const lay1 = M.systemLayout(someSys), lay2 = M.systemLayout(someSys.slice().reverse());
  check('system layout: deterministic (input order does not matter), sorted by id, one ring per body',
    JSON.stringify(lay1.map((L) => [L.b.a, L.r, L.a0])) === JSON.stringify(lay2.map((L) => [L.b.a, L.r, L.a0]))
    && lay1.every((L, i) => i === 0 || L.b.id >= lay1[i - 1].b.id) && new Set(lay1.map((L) => L.r)).size === lay1.length, lay1.length);
  const p0 = M.bodyLocal(lay1[2], 0), p1 = M.bodyLocal(lay1[2], 100);
  check('system layout: a body stays on its ring and moves slowly', Math.abs(Math.hypot(...p0) - lay1[2].r) < 1e-9 && Math.abs(Math.hypot(...p1) - lay1[2].r) < 1e-9 && Math.hypot(p0[0] - p1[0], p0[1] - p1[1]) > 0.01);
  check('every body maps to one of the owner\'s renders (slug x 3 variants)', bodies.every((b) => ['oceanic', 'barren', 'gas', 'ice', 'volcanic', 'terrestrial', 'dark', 'belt'].includes(M.bodySlug(b)) && [0, 1, 2].includes(M.artVariant(b.n))));
  const mem = M.systemMembers(latest.fleets, latest.systems, bodies, now - 120);
  const memMining = [...mem.values()].reduce((a, m) => a + m.mining.length, 0), allMining = latest.fleets.filter((f) => f.s.kind === 'mining').length;
  const memDocked = [...mem.values()].reduce((a, m) => a + m.docked.length, 0), allDocked = latest.fleets.filter((f) => f.s.kind === 'docked' && f.s.system).length;
  check('members: every mining fleet joins its asteroid\'s system, every docked fleet its starbase system', memMining === allMining && memDocked === allDocked, {memMining, allMining, memDocked, allDocked});
  const inFlight = latest.fleets.map((f, i) => [f, i]).filter(([f]) => (f.s.kind === 'warp' || f.s.kind === 'subwarp') && f.s.to && f.s.arrives > now).map(([, i]) => i);
  const placed = new Set([...mem.values()].flatMap((m) => [...m.docked, ...m.mining, ...m.cst, ...m.idle]));
  check('NEGATIVE: fleets in flight belong to no system view', inFlight.length > 0 && inFlight.every((i) => !placed.has(i)), inFlight.length);
  const sample = bodies.find((b) => b.k === 'asteroid' && b.res.some((r) => r.miners));
  // atlas lookups use own properties only (reviewer P3, #23)
  {
    const atlasJ = JSON.parse(fs.readFileSync(path.join(ROOT, 'Images/ships/silhouettes/atlas.json'), 'utf8'));
    const gm = atlasJ.sizeClass.medium, gs = atlasJ.sizeClass.small;
    const r1 = M.atlasCell(atlasJ, '__proto__', 'small'), r2 = M.atlasCell(atlasJ, 'constructor', 'small'), r3 = M.atlasCell(atlasJ, 'X', '__proto__');
    check('atlasCell: flag "__proto__" / "constructor" give the size-class generic; flagSize "__proto__" gives the fallback class', r1 === gs && r2 === gs && r3 === gm, {r1, r2, r3, gs, gm});
    const naive = (a, fl, sz) => { const sc = a.sizeClass; return sc[sz] ?? sc[a.fallbackClass]; };
    check('NEGATIVE: a plain-object lookup returns Object.prototype for flagSize "__proto__"', typeof naive(atlasJ, 'X', '__proto__') === 'object');
    const hl = M.hullLabel(atlasJ, 'X', 'medium'), hd = M.hullLabel(atlasJ, 'Armstrong IMP Default Config', 'capital');
    check('hover hull label: a size-class stand-in says "generic <class> hull", a mapped config names its model', hl === 'generic medium hull' && hd === 'Armstrong Imp hull', {hl, hd});
  }
  const lbl = M.bodyLabel(sample, 3, 0);
  check('body hover label: name, type, top-3 resources by richness, miners, stakes, layout note', lbl.startsWith(sample.n + ' - asteroid') && lbl.includes('3 fleets mining') && lbl.includes('0 claim stakes') && lbl.includes('stylised')
    && M.topResources(sample).length === 3 && M.topResources(sample)[0].rich === Math.max(...sample.res.map((r) => r.rich)), lbl);

  // ---- task #32 (owner 2026-11-07): mining indicator, miners hugging their rock, in-map stat layers. Expectations are
  // re-derived here from latest.json / events.json, not through the functions under test.
  {
    check('task #32: model.js no longer exports an orbit for mining fleets (orbitOffset gone)', typeof M.orbitOffset === 'undefined');
    // per-system live mining = sum of fleets[].mine.out[].ups over the mining fleets whose asteroid is in that system
    const astSys = new Map(latest.asteroids.map((a) => [a.a, a.sys]));
    const want = new Map();
    for (const f of latest.fleets) {
      if (f.s.kind !== 'mining' || !astSys.has(f.s.asteroid)) continue;
      const k = astSys.get(f.s.asteroid), w = want.get(k) || {ups: 0, n: 0};
      w.ups += f.mine.out.reduce((a, o) => a + o.ups, 0); w.n++; want.set(k, w);
    }
    const got = M.miningBySystem(latest);
    const mErr = [...want].filter(([k, w]) => !got.has(k) || Math.abs(got.get(k).ups - w.ups) > 1e-6 || got.get(k).miners !== w.n);
    check(`mining per system = sum of fleets' mine.out ups (${want.size} systems, ${[...want.values()].reduce((a, w) => a + w.n, 0)} miners)`, mErr.length === 0 && got.size === want.size && want.size > 20, mErr.slice(0, 3));
    const astTotal = latest.asteroids.reduce((a, x) => a + x.ups, 0), gotTotal = [...got.values()].reduce((a, m) => a + m.ups, 0);
    check('positive control: the per-system totals add up to asteroids[].ups (the collector\'s own figure)', Math.abs(astTotal - gotTotal) < 1e-3 * astTotal, {astTotal, gotTotal});
    const mineCols = M.statColumns('mining', latest, events);
    const top6 = [...want].sort((a, b) => b[1].ups - a[1].ups).slice(0, 6).map(([k]) => k);
    check('stat layer "mining": one column per mining system, ordered by live u/s (top 6 = the 6 busiest)', mineCols.length === want.size && JSON.stringify(mineCols.slice(0, 6).map((c) => c.sys)) === JSON.stringify(top6),
      mineCols.slice(0, 3).map((c) => [c.name, c.line]));
    check('NEGATIVE: a wrong rule (count docked + idle fleets as miners) would not give these columns', (() => {
      const wrong = new Map(); for (const f of latest.fleets) if (f.s.kind === 'docked' && f.s.system) wrong.set(f.s.system, (wrong.get(f.s.system) || 0) + 1);
      return mineCols.some((c) => (wrong.get(c.sys) || 0) !== c.miners);
    })());
    const combatCols = M.statColumns('combat', latest, events);
    const hot = M.hotSpots(events, latest.generatedAt);
    check('stat layer "combat": total 24 h events conserved (same events as hotSpots, regrouped by place)', combatCols.reduce((a, c) => a + c.v, 0) === hot.reduce((a, h) => a + h.n, 0) && hot.length > 0, {cols: combatCols.length});
    // task #38 P3-4, one rule (lead contract): each event -> the NEAREST system within 1.2 units, else a 0.5-unit deep-space
    // cell. Expectation re-derived here by hand from events.json (no model.js call).
    {
      const ref = latest.generatedAt, kinds = new Set(['combat', 'destroyed', 'starbaseCombat', 'captured']), seen = new Set(), bySys = new Map();
      let deepN = 0;
      for (const e of events) {
        if (!(kinds.has(e.k) || (e.k === 'gone' && e.afterCombat === true)) || !(e.t <= ref && e.t > ref - 86400) || !Number.isFinite(e.x) || !Number.isFinite(e.y)) continue;
        if ((e.k === 'destroyed' || e.dead === true) && e.f) { if (seen.has(e.f)) continue; seen.add(e.f); }
        let best = null, bd = 1.2;
        for (const s of latest.systems) { const d = Math.hypot(s.x - e.x, s.y - e.y); if (d < bd) { bd = d; best = s; } }
        if (best) bySys.set(best.n, (bySys.get(best.n) || 0) + 1); else deepN++;
      }
      const top = [...bySys].sort((a, b) => b[1] - a[1]);
      const sysCols = combatCols.filter((c) => c.sys), deepCols = combatCols.filter((c) => !c.sys);
      check(`combat callouts, one rule: per-system counts match a hand re-derivation (top: ${top.slice(0, 3).map(([n, v]) => n + ' ' + v).join(', ')})`,
        sysCols.length === bySys.size && sysCols.every((c) => bySys.get(c.name) === c.v) && deepCols.reduce((a, c) => a + c.v, 0) === deepN
        // the top place may be a TIE (12:41 data: Dosk 10 / Eternity 10): the order among ties is model.js combatOrder
        // (n, last, key), which this name-keyed re-derivation cannot see - so require the top COUNT and that the top name is a tied leader
        && combatCols[0].v === top[0][1] && bySys.get(combatCols[0].name) === top[0][1], combatCols.slice(0, 4).map((c) => c.name + ' ' + c.v));
      check('combat columns stand ON their system (x, y = the system\'s) and deep-space cells are named "Deep space near <nearest system>" (task #55)',
        sysCols.every((c) => { const s = latest.systems.find((q) => q.a === c.sys); return s && s.x === c.x && s.y === c.y; }) && deepCols.length > 0
          && deepCols.every((c) => { const nb = latest.systems.slice().sort((p, q) => Math.hypot(p.x - c.x, p.y - c.y) - Math.hypot(q.x - c.x, q.y - c.y) || (p.a < q.a ? -1 : 1))[0]; return c.name === `Deep space near ${nb.n}`; }),
        deepCols.slice(0, 3).map((c) => c.name));
      check('combatSpots is exported with signature (events, systems, ref, windowS) and statColumns uses it', typeof M.combatSpots === 'function' && M.combatSpots.length >= 3
        && JSON.stringify(M.combatSpots(events, latest.systems, ref).map((h) => h.n)) === JSON.stringify(combatCols.map((c) => c.v)));
    }
    // pinned rule details (lead, 2026-11-07): equidistant tie -> the LOWER address; strictly < 1.2 units; cell key
    // round(x*2), round(y*2); the faction filter applies FIRST (factionMatch on the event's fa / npc)
    {
      const ref = 1000, A = {a: 'Bbb', n: 'B-sys', x: 0, y: 0}, B = {a: 'Aaa', n: 'A-sys', x: 2, y: 0};
      const ev = [{k: 'combat', t: 999, x: 1, y: 0, fa: 'mud'}, {k: 'combat', t: 999, x: 3.2, y: 0, fa: 'oni'}, {k: 'combat', t: 999, x: 10.2, y: 0.1, fa: 'oni'},
        {k: 'combat', t: 999, x: 10.3, y: -0.1, fa: 'mud', npc: 1}];
      const cs = M.combatSpots(ev, [A, B], ref);
      const byName = Object.fromEntries(cs.map((c) => [c.name, c.n]));
      check('combatSpots tie-break: an event exactly between two systems goes to the lower address; exactly 1.2 away is NOT a system (deep cell)',
        byName['A-sys'] === 1 && !byName['B-sys'] && cs.some((c) => !c.sys && c.name === 'Deep space near A-sys' && c.n === 1), cs.map((c) => [c.name, c.n]));
      check('combatSpots deep cells keyed round(x*2): x 10.2 (cell 20) and 10.3 (cell 21) are two cells', cs.filter((c) => !c.sys && Math.round(c.x) === 10).length === 2, cs.map((c) => c.key));
      const mud = M.combatSpots(ev, [A, B], ref, 86400, 'mud'), npc = M.combatSpots(ev, [A, B], ref, 86400, 'npc');
      check('combatSpots faction filter first: mud keeps only the MUD player event, npc only the NPC event', mud.length === 1 && mud[0].name === 'A-sys' && npc.length === 1 && npc[0].n === 1 && !npc[0].sys,
        {mud: mud.map((c) => c.name), npc: npc.map((c) => c.name)});
      // live data, faction mud, re-derived by hand
      const kinds = new Set(['combat', 'destroyed', 'starbaseCombat', 'captured']), seen = new Set(); let n = 0;
      for (const e of events) {
        if (!(kinds.has(e.k) || (e.k === 'gone' && e.afterCombat === true)) || !(e.t <= latest.generatedAt && e.t > latest.generatedAt - 86400) || !Number.isFinite(e.x) || !Number.isFinite(e.y)) continue;
        if (e.npc || e.fa !== 'mud') continue;
        if ((e.k === 'destroyed' || e.dead === true) && e.f) { if (seen.has(e.f)) continue; seen.add(e.f); }
        n++;
      }
      const lm = M.statColumns('combat', latest, events, {faction: 'mud'});
      check(`stat "combat" with the mud filter: ${n} MUD player events (hand count), conserved`, lm.reduce((a, c) => a + c.v, 0) === n, {cols: lm.length, sum: lm.reduce((a, c) => a + c.v, 0)});
    }
    // task #38 P3-6: the 'npc' filter keeps a mining indicator only where NPC fleets mine (not unaligned players). The
    // live data has neither, so a fixture adds one unaligned PLAYER miner and one NPC miner on two quiet asteroids.
    {
      const astSys = new Map(latest.asteroids.map((x) => [x.a, x.sys])), busy = new Set(latest.fleets.filter((f) => f.s.kind === 'mining').map((f) => astSys.get(f.s.asteroid)));
      const quiet = latest.systems.filter((x) => !busy.has(x.a));
      const qa = {a: 'fixAstU', sys: quiet[0].a, x: quiet[0].x, y: quiet[0].y}, qb = {a: 'fixAstN', sys: quiet[1].a, x: quiet[1].x, y: quiet[1].y};
      const fx = {...latest, asteroids: [...latest.asteroids, qa, qb], fleets: [...latest.fleets,
        {a: 'fixUnal', s: {kind: 'mining', asteroid: qa.a}, fa: 'unaligned', npc: 0, mine: {out: [{ups: 5}]}},
        {a: 'fixNpc', s: {kind: 'mining', asteroid: qb.a}, fa: 'unaligned', npc: 1, mine: {out: [{ups: 3}]}}]};
      const mb = M.miningBySystem(fx), mu = mb.get(qa.sys), mn = mb.get(qb.sys);
      check('mining byFilter: an unaligned PLAYER miner is NOT kept by the npc filter; an NPC miner is (factionMatch rule)',
        mu && !(mu.byFilter.npc > 0) && mu.byFilter.unaligned > 0 && mn && mn.byFilter.npc > 0 && !(mn.byFilter.mud > 0), {unal: mu && mu.byFilter, npc: mn && mn.byFilter});
      check('NEGATIVE/control: the v2 rule (npc filter -> the unaligned key) WOULD keep the unaligned player system', mu && mu.byFa.unaligned > 0);
    }
    // v10: no camera-distance proximity fade any more - a miner shows by its own px size like every hull (HULL_PX)
    check('v10: the miners\' proximity fade is gone from the model (MINER_VIEW / minerFade / minerShown / MINER_SHOW undefined)',
      [M.MINER_VIEW, M.minerFade, M.minerShown, M.MINER_SHOW].every((x) => x === undefined));
    const fleetCols = M.statColumns('fleets', latest, events);
    const astBodies = latest.asteroids.map((x) => ({k: 'asteroid', a: x.a, sys: x.sys}));
    const memF = M.systemMembers(latest.fleets, latest.systems, astBodies, latest.generatedAt - 120);
    const placedN = [...memF.values()].reduce((a, m) => a + m.docked.length + m.mining.length + m.cst.length + m.idle.length, 0);
    const dockedN = latest.fleets.filter((f) => f.s.kind === 'docked' && f.s.system).length;
    check('stat layer "fleets": every fleet at rest at a system is counted once (sum = members; >= every docked fleet)', fleetCols.reduce((a, c) => a + c.v, 0) === placedN && placedN >= dockedN, {placedN, dockedN});
    const topOwner = latest.owners.slice().sort((a, b) => b.fleets - a.fleets)[0].p;
    const ownCols = M.statColumns('owners', latest, events, {owner: topOwner});
    const ownFleetsAtRest = [...memF.values()].reduce((a, m) => a + [...m.docked, ...m.mining, ...m.cst, ...m.idle].filter((i) => latest.fleets[i].o === topOwner).length, 0);
    const ownStakes = (latest.stakes || []).filter((s) => s.o === topOwner && s.sys).length;
    check('stat layer "owners" (owner focused): footprint = that owner\'s fleets at rest + stakes, nobody else\'s', ownCols.reduce((a, c) => a + c.v, 0) === ownFleetsAtRest + ownStakes && ownCols.length > 0,
      {cols: ownCols.length, fleets: ownFleetsAtRest, stakes: ownStakes});
    check('NEGATIVE: unknown stat layer name gives no columns', M.statColumns('bogus', latest, events).length === 0);
    check('stat heights: log scale, monotone, top = STAT_H, a value of 1 still visible', M.statHeight(1, 1000) > 0 && M.statHeight(10, 1000) < M.statHeight(100, 1000) && Math.abs(M.statHeight(1000, 1000) - M.STAT_H) < 1e-9);
    // miners hug the rock: every slot of a 128-strong crowd within 1.08..1.3 R
    const slots = [...Array(128)].map((_, j) => M.minerSlot(j, 128, 0.16));
    const rs = slots.map((s) => s.r / 0.16);
    check('miner slots hug the rock: 128 miners all within 1.08-1.30 R (was 1.25-2.4 R)', Math.min(...rs) >= 1.08 - 1e-9 && Math.max(...rs) <= 1.3 + 1e-9, {min: Math.min(...rs), max: Math.max(...rs)});
    v10model(M, latest, bodies);
  }

  // ---------------- browser drive
  let chromium = null;
  if (!process.env.NO_BROWSER) {
    try { chromium = createRequire(path.join(os.homedir(), '.claude/skills/teardown/node_modules/x.js'))('playwright').chromium; }
    catch { console.log('SKIP  browser drive: teardown skill playwright not installed'); }
  }
  if (chromium) await browserDrive(chromium, latest, bodies);
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

// ---------------- v10 model (one continuous world, 2026-11-08): system scale, hull scale, member placement. Data-independent
// rules checked on whatever latest.json / bodies.json hold; each with a negative that must fail.
function v10model(M, latest, bodies) {
  const sys = latest.systems.filter((s) => Number.isFinite(s.x) && Number.isFinite(s.y));
  const nb = new Map(); for (const b of bodies) nb.set(b.sys, (nb.get(b.sys) || 0) + 1);
  const sc = M.systemScales(sys, (a) => nb.get(a) || 0);
  // nearest neighbour by hand (not through model.js)
  const nn = sys.map((s) => Math.min(...sys.filter((t) => t !== s).map((t) => Math.hypot(s.x - t.x, s.y - t.y))));
  const ext = (s, k) => (nb.get(s.a) ? 0.75 + (nb.get(s.a) - 1) * 0.46 : 0.75) * k + (0.5 + 0.2) * k; // outer orbit + starbase gap + glyph, layout x k
  const bad = (kOf) => sys.filter((s, i) => ext(s, kOf(s)) > Math.min(0.15, 0.45 * nn[i]) + 1e-12).length;
  const nBad = bad((s) => sc.get(s.a));
  check(`v10 scale: every one of ${sys.length} systems fits its neighbourhood (world extent <= min(0.15, 0.45 x nearest neighbour)); K = ${M.WORLD.K}`, nBad === 0 && sc.size === sys.length, {nBad});
  const nGlobal = bad(() => M.WORLD.K);
  check(`v10 scale NEGATIVE: one global K for every system (no squeeze) would overflow ${nGlobal} systems`, nGlobal > 0, nGlobal);
  // no two systems overlap: extent_i + extent_j < distance for every pair
  let overlap = 0, tight = Infinity;
  for (let i = 0; i < sys.length; i++) for (let j = i + 1; j < sys.length; j++) {
    const d = Math.hypot(sys[i].x - sys[j].x, sys[i].y - sys[j].y), e = ext(sys[i], sc.get(sys[i].a)) + ext(sys[j], sc.get(sys[j].a));
    if (e >= d) overlap++; tight = Math.min(tight, d - e);
  }
  check('v10 scale: no two systems overlap (sum of the two extents < their distance, every pair)', overlap === 0, {overlap, tightestGap: +tight.toFixed(4)});
  // hulls at the SAME world scale: the pre-v10 lengths x K, so hull / body ratios are unchanged
  const OLD = {'xx-small': 0.012, 'x-small': 0.016, small: 0.022, medium: 0.03, large: 0.04, capital: 0.052, commander: 0.06, titan: 0.07};
  const hullErr = Object.keys(OLD).filter((k) => Math.abs(M.HULL_LEN[k] - OLD[k] * M.WORLD.K) > 1e-12);
  check('v10 hulls: HULL_LEN = the pre-v10 lengths x WORLD.K (ships scale with the systems), every class', hullErr.length === 0 && Object.keys(M.HULL_LEN).length === 8, hullErr);
  check('v10 hulls NEGATIVE: the pre-v10 table is not at world scale (medium 0.03 != 0.03 x K)', Math.abs(OLD.medium - OLD.medium * M.WORLD.K) > 1e-6);
  check('v10 hulls: no px floor - drawn from HULL_PX.collapse (< 1 px) and fully from <= 1.5 px', M.HULL_PX.collapse < 1 && M.HULL_PX.full <= 1.5 && M.HULL_PX.collapse < M.HULL_PX.full, M.HULL_PX);
  // member placement (CPU mirror of GLSL place()): a miner hugs its MOVING rock and points at it, at every time
  const R = 0.16 * 0.032, rock = [0.9 * 0.032, 1.3, 0.06 / Math.pow(0.9, 1.5), 2], errs = [];
  for (const anim of [0, 7.5, 123.4, 4000]) for (const [j, n] of [[0, 1], [5, 40], [127, 128]]) {
    const sl = M.minerSlot(j, n, 0.16), A = [10, -4, sl.r * 0.032, sl.ang], o = M.placeMember(A, rock, 0.37, anim);
    const a = rock[1] + rock[2] * anim, bx = rock[0] * Math.cos(a), by = rock[0] * Math.sin(a), d = Math.hypot(o[0] - bx, o[1] - by) / R;
    const head = (o[2] * (bx - o[0]) + o[3] * (by - o[1])) / (Math.hypot(o[2], o[3]) * Math.hypot(bx - o[0], by - o[1]));
    if (!(d >= 1.08 * 0.94 && d <= 1.3 * 1.06) || !(head > 0.999)) errs.push({anim, j, d: +d.toFixed(3), head: +head.toFixed(4)});
  }
  check('v10 placement: a miner stays 1.0-1.38 R from its orbiting rock and points at it (4 times x 3 crowd slots)', errs.length === 0, errs.slice(0, 3));
  const still = (A, O, s, anim, out = [0, 0, 0, 0]) => { const o = M.placeMember(A, [O[0], O[1], 0, O[3]], s, 0, out); return o; }; // mutant: the rock never moves
  const sl0 = M.minerSlot(0, 1, 0.16), mo = still([0, 0, sl0.r * 0.032, sl0.ang], rock, 0.37, 0), a9 = rock[1] + rock[2] * 4000;
  check('v10 placement NEGATIVE: a placement that ignores the orbit is far from the rock at t = 4000 s', Math.hypot(mo[0] - rock[0] * Math.cos(a9), mo[1] - rock[0] * Math.sin(a9)) / R > 3);
  const dock = M.placeMember([0, 0, 0.01, 0.002], [0.008, 0.001, 0, 1], 0.5, 99);
  check('v10 placement: a docked fleet sits at its slot and noses to the station', dock[0] === 0.01 && dock[1] === 0.002 && Math.abs(Math.atan2(dock[3], dock[2]) - Math.atan2(-0.001, -0.002)) < 1e-9, dock);
  // claim-stake transfer loop: at the station when the phase is 0, at the planet at phase 0.5
  const P = [0.05, 0, 0, 3], st = [0.01, 0.01], c0 = M.placeMember([0, 0, st[0], st[1]], P, 0, 0), c5 = M.placeMember([0, 0, st[0], st[1]], P, 0.5, 0);
  check('v10 placement: a claim-stake transfer loops station (phase 0) -> planet (phase 0.5)', Math.hypot(c0[0] - st[0], c0[1] - st[1]) < 1e-9 && Math.hypot(c5[0] - 0.05, c5[1]) < 1e-9, {c0, c5});
}

async function browserDrive(chromium, latest, bodies) {
  const MIME = {'.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.webp': 'image/webp'};
  const planetReqs = [];
  let planet404 = null; // a planet render file name the server answers with 404 (texture-fail fallback check)
  const server = http.createServer((q, r) => {
    let p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (q.url.includes('/Images/planets/')) planetReqs.push(q.url);
    if (planet404 && q.url.includes('/Images/planets/' + planet404)) { r.writeHead(404); r.end(); return; } // fault injection
    // OLD_BUNDLE=<file> serves that file as C4Live/c4-scene.js, to prove a browser check FAILS on pre-fix code
    if (process.env.OLD_BUNDLE && /c4-scene\.js$/.test(q.url.split('?')[0])) { fs.readFile(process.env.OLD_BUNDLE, (e, b) => { r.writeHead(e ? 404 : 200, {'content-type': 'text/javascript'}); r.end(b); }); return; }
    if (!p.startsWith(ROOT)) { r.writeHead(403); r.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, {'content-type': MIME[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store'}); r.end(b); });
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const port = server.address().port;
  const shots = process.env.SHOT_DIR || os.tmpdir();
  const browser = await chromium.launch({headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader']});
  try {
    if (process.env.ONLY_T56S) { await task56stars(browser, port, latest); return; } // the #56 starfield block alone
    if (process.env.ONLY_V10) { await taskV10(browser, port, latest, bodies); return; } // the v10 one-world block alone (V10_PARTS=a,b,...)
    if (process.env.ONLY_T58) { await task58(browser, port, latest); return; } // the task #58 / #57 block alone
    if (process.env.ONLY_T55) { await task55(browser, port, latest, JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/c4-live/events.json'), 'utf8'))); return; } // the task #55 block alone
    if (process.env.ONLY_T53) { await task53(browser, port, latest); return; } // the task #53 block alone
    if (process.env.ONLY_T51) { await task51(browser, port, latest); return; } // the task #51 block alone
    if (process.env.ONLY_T50) { await task50(browser, port, latest, JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/c4-live/events.json'), 'utf8')), bodies); return; } // the task #50 block alone
    if (process.env.ONLY_T44) { await task44(browser, port, latest, JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/c4-live/events.json'), 'utf8')), bodies); return; } // the task #44 block alone
    if (process.env.ONLY_T38) { await task38(browser, port, latest, JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/c4-live/events.json'), 'utf8')), bodies); return; } // the task #38 block alone
    if (process.env.ONLY_T32) { await task32(browser, port, latest, JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/c4-live/events.json'), 'utf8')), bodies); return; } // quick iteration on the task #32 block
    const page = await browser.newPage({viewport: {width: 1600, height: 900}});
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('requestfailed', (r) => console.log('INFO  request failed: ' + r.url() + ' ' + (r.failure() && r.failure().errorText)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    // nobodies=1: this page tests the GALAXY layer; close-up checks near a system must not open its system view
    // (the system view has its own pages below)
    await page.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html?replay=1&nobodies=1`);
    await page.waitForFunction(() => window.scene && window.scene.getStats().frames > 30, null, {timeout: 30000});
    const gl = await page.evaluate(() => { const c = document.createElement('canvas').getContext('webgl2'); const d = c && c.getExtension('WEBGL_debug_renderer_info'); return d ? c.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'unknown'; });
    console.log('INFO  WebGL renderer: ' + gl);
    const api = await page.evaluate((names) => names.filter((n) => typeof window.scene[n] !== 'function'), API);
    check('mounted scene exposes every contract method', api.length === 0 && await page.evaluate(() => window.scene.ok === true), api);
    await sleep(3200); // let the intro fly-in finish
    const st = await page.evaluate(() => window.scene.getStats());
    check('scene renders with all real data loaded', st.fleets === latest.fleets.length && st.systems === latest.systems.length && st.hotSpots > 0, st);
    // 11 scene draws (one per layer) + bloom mip chain + output; 1,590 fleets must not mean 1,590 draws
    check('draw calls per frame stay small (instanced layers + post)', st.drawCalls >= 11 && st.drawCalls <= 40, st.drawCalls);

    // fps over 5 s at 1600x900, real data, all layers
    const f0 = await page.evaluate(() => [window.scene.getStats().frames, performance.now()]);
    await sleep(5000);
    const f1 = await page.evaluate(() => [window.scene.getStats().frames, performance.now()]);
    const fps = (f1[0] - f0[0]) / ((f1[1] - f0[1]) / 1000);
    console.log(`INFO  measured ${fps.toFixed(1)} fps over 5 s (headless, ${gl}); pixelRatio ${st.pixelRatio}`);
    check('runs at a usable frame rate headless (>= 30 fps)', fps >= 30, fps.toFixed(1));
    await page.screenshot({path: path.join(shots, 'c4-scene-overview.png')});

    // GPU position matches CPU position: fly to an in-flight fleet and compare pixel brightness with the fleets layer on vs off
    const now = latest.generatedAt;
    const target = latest.fleets.filter((f) => f.s.kind === 'subwarp' && f.s.from && f.s.arrives > now + 900 && f.s.departs < now - 600)
      // world-scale hulls (#23): the camera must come close (6) to see it, so track one away from any system (no system view)
      .filter((f) => { const t = (now - f.s.departs) / (f.s.arrives - f.s.departs), x = f.s.from[0] + (f.s.to[0] - f.s.from[0]) * t, y = f.s.from[1] + (f.s.to[1] - f.s.from[1]) * t;
        return latest.systems.every((s) => Math.hypot(s.x - x, s.y - y) > 2); })
      .sort((a, b) => b.ships - a.ships)[0];
    check('found an in-flight subwarp fleet to track', !!target, target && target.n);
    if (target) {
      // camera ~0.08 = the pre-v10 2.5 x WORLD.K (hulls are 0.032 x their pre-v10 length since v10): the same on-screen size
      await page.evaluate((a) => { const p = window.scene.fleetScreen(a); window.scene.focusPoint(p.x, p.y, 1600); }, target.a);
      await sleep(2200);
      const sp = await page.evaluate((a) => window.scene.fleetScreen(a), target.a);
      check('tracked fleet is on screen after focusPoint', sp && sp.visible, sp);
      // brightness of the 7x7 pixels at the CPU-projected fleet position, decoded in the page
      const box = {x: Math.round(sp.clientX) - 40, y: Math.round(sp.clientY) - 40, width: 80, height: 80};
      await page.screenshot({path: path.join(shots, 'c4-scene-fleet-on.png'), clip: box});
      // world-scale hulls (#23) are small: the test isolates them from animated neighbours (route dashes, combat, beams)
      // and compares PIXELS - the hull drawn at the CPU position changes the centre 7x7 when the fleets layer toggles,
      // and the same 7x7 offset 30 px away (control) does not
      await page.evaluate(() => { for (const l of ['routes', 'combat', 'mining']) window.scene.setLayer(l, false); });
      await sleep(300);
      const pix = (b64, ox, oy = 0) => page.evaluate(async ({d, ox, oy}) => {
        const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
        return Array.from(x.getImageData(img.width / 2 - 3 + ox, img.height / 2 - 3 + oy, 7, 7).data);
      }, {d: b64, ox, oy});
      const shotOn = (await page.screenshot({clip: box})).toString('base64');
      await page.evaluate(() => window.scene.setLayer('fleets', false));
      await sleep(400);
      const shotOff = (await page.screenshot({clip: box})).toString('base64');
      await page.screenshot({path: path.join(shots, 'c4-scene-fleet-off.png'), clip: box});
      await page.evaluate(() => { window.scene.setLayer('fleets', true); for (const l of ['routes', 'combat', 'mining']) window.scene.setLayer(l, true); });
      const mad = async (ox, oy = 0) => { const a = await pix(shotOn, ox, oy), b = await pix(shotOff, ox, oy); let s = 0; for (let i = 0; i < a.length; i += 4) s += (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2])) / 3; return s / (a.length / 4); };
      // control: the QUIETEST of four spots 30 px aside (a passing neighbour - another fleet or trail on the moving
      // replay clock - can light one of them; it lit the single right-hand spot in one run)
      const atFleet = await mad(0), asides = [await mad(30), await mad(-30), await mad(0, 30), await mad(0, -30)], aside = Math.min(...asides);
      check('GPU draws the moving fleet where the CPU model says it is (centre pixels change with the fleets layer; the quietest of 4 spots 30 px aside does not)',
        atFleet > 8 && atFleet > aside * 4, {atFleet: +atFleet.toFixed(1), quietestAside: +aside.toFixed(1), asides: asides.map((v) => +v.toFixed(1))});

      // hover + pick land on that fleet
      await page.mouse.move(sp.clientX + 40, sp.clientY + 40); await sleep(150);
      const sp2 = await page.evaluate((a) => window.scene.fleetScreen(a), target.a);
      await page.mouse.move(sp2.clientX, sp2.clientY); await sleep(250);
      const hv = await page.evaluate(() => window.lastHover);
      check('hover over the fleet reports it with label and pointer coords', hv && hv.type === 'fleet' && hv.id === target.a && Number.isFinite(hv.clientX) && /ships/.test(hv.label), hv);
      // v11: at this zoom (~14,000 px / map unit) a subwarp fleet slides several px per 100 ms on the replay clock - click
      // where it is NOW (re-read, move, click at once), not where the hover found it 250 ms earlier
      const spNow = await page.evaluate((a) => window.scene.fleetScreen(a), target.a);
      await page.mouse.move(spNow.clientX, spNow.clientY); await page.mouse.down(); await page.mouse.up(); await sleep(300);
      const pk = await page.evaluate(() => window.lastPick);
      check('click picks the fleet with its owner profile', pk && pk.type === 'fleet' && pk.id === target.a && pk.ownerProfile === target.o, pk);
      // negative: with the fleets layer off the same spot must not pick that fleet
      await page.evaluate(() => { window.scene.focusOwner(null); window.scene.setFilter({owner: null}); });
      await sleep(2000);
      await page.evaluate(() => { window.scene.setLayer('fleets', false); window.lastHover = 'unset'; });
      const sp3 = await page.evaluate((a) => window.scene.fleetScreen(a), target.a);
      await page.mouse.move(sp3.clientX + 30, sp3.clientY + 30); await sleep(150);
      await page.mouse.move(sp3.clientX, sp3.clientY); await sleep(250);
      const hv2 = await page.evaluate(() => window.lastHover);
      check('NEGATIVE: fleets layer off -> hovering the same spot does not report that fleet', !(hv2 && hv2.id === target.a), hv2);
      await page.evaluate(() => window.scene.setLayer('fleets', true));
    }

    // focusOwner frames the owner and returns their fleet count
    const top = latest.owners.slice().sort((a, b) => b.fleets - a.fleets)[0];
    const n = await page.evaluate((p) => window.scene.focusOwner(p), top.p);
    check('focusOwner returns the owner\'s live fleet count', n === latest.fleets.filter((f) => f.o === top.p).length, {n, owner: top.p.slice(0, 8)});
    await sleep(2200);
    const onScreen = await page.evaluate((p) => window.latest.fleets.filter((f) => f.o === p).map((f) => window.scene.fleetScreen(f.a)).filter((s) => s && s.visible).length, top.p);
    check('after focusOwner every one of the owner\'s fleets is on screen', onScreen === n, {onScreen, n});
    await page.screenshot({path: path.join(shots, 'c4-scene-owner.png')});
    await page.evaluate(() => window.scene.focusOwner(null));

    // pulses, filters, layers, bad input
    const pulsed = await page.evaluate(() => window.events.slice(-12).map((e) => window.scene.pulseEvent(e)).every(Boolean)
      && window.scene.pulseEvent({k: 'captured', x: 0, y: 0, fa: 'oni'}) && window.scene.pulseEvent({k: 'newFleet', x: 10, y: 10, fa: 'mud'}));
    check('pulseEvent accepts real events and every kind', pulsed);
    check('NEGATIVE: pulseEvent rejects an event without coordinates', await page.evaluate(() => window.scene.pulseEvent({k: 'combat'}) === false));
    // gone + combat tracers (2026-11-06 event additions)
    await sleep(3500); // let earlier pulses expire
    const fx = await page.evaluate(() => {
      const s = window.scene, base = s.getStats().activeFx;
      const ok = s.pulseEvent({k: 'gone', x: 5, y: 5, fa: 'unaligned', npc: 4});
      const afterGone = s.getStats().activeFx;
      const known = new Set(window.latest.fleets.map((f) => f.a));
      // two opponents that ARE in the current data (a far one and a near one), one that is not
      const f1 = window.latest.fleets[0], f2 = window.latest.fleets[1];
      const found = {k: 'combat', f: 'A', fa: 'mud', x: -20, y: 0, vs: [{f: f1.a, fa: f1.fa}, {f: f2.a, fa: f2.fa}]};
      s.pulseEvent(found);
      const afterVs = s.getStats().activeFx;
      const real = window.events.find((e) => e.k === 'combat' && Array.isArray(e.vs) && e.vs.length);
      const realFound = real ? real.vs.slice(0, 3).filter((o) => known.has(o.f)).length : 0;
      if (real) s.pulseEvent(real);
      const afterReal = s.getStats().activeFx;
      s.pulseEvent({k: 'combat', f: 'A', fa: 'mud', x: 3, y: 3, vs: [{f: 'NOT-A-FLEET-1', fa: 'oni'}, {f: 'NOT-A-FLEET-2', fa: 'ustur'}]});
      const afterUnknown = s.getStats().activeFx;
      s.pulseEvent({k: 'combat', x: 1, y: 1, fa: 'mud'});
      const afterPlain = s.getStats().activeFx;
      return {ok, base, afterGone, afterVs, afterReal, afterUnknown, afterPlain, realVs: real ? real.vs.length : 0, realFound};
    });
    check('pulseEvent handles k:gone (returns true, one pulse, no tracer)', fx.ok === true && fx.afterGone.pulses === fx.base.pulses + 1 && fx.afterGone.tracers === fx.base.tracers, fx);
    check('combat with 2 vs opponents found in the data draws 2 tracers', fx.afterVs.tracers === fx.afterGone.tracers + 2, fx.afterVs);
    check('a real combat event from events.json draws one tracer per opponent found', fx.realVs > 0 && fx.afterReal.tracers === fx.afterVs.tracers + fx.realFound, {realVs: fx.realVs, realFound: fx.realFound, tracers: fx.afterReal.tracers});
    check('NEGATIVE: vs opponents not in the current data are skipped (pulse yes, tracer no)', fx.afterUnknown.tracers === fx.afterReal.tracers && fx.afterUnknown.pulses === fx.afterReal.pulses + 1, fx.afterUnknown);
    check('NEGATIVE: combat without vs draws no tracer', fx.afterPlain.tracers === fx.afterUnknown.tracers && fx.afterPlain.pulses === fx.afterUnknown.pulses + 1, fx.afterPlain);
    await page.evaluate(() => window.scene.focusPoint(-20, 0, 8));
    await sleep(1700);
    await page.evaluate(() => {
      const s = window.scene, near = window.latest.fleets.filter((f) => f.s.kind === 'idle').map((f) => [f, Math.hypot(f.x + 20, f.y)]).sort((a, b) => a[1] - b[1]).slice(0, 2).map((p) => p[0]);
      s.pulseEvent({k: 'combat', f: 'A', fa: 'mud', x: -20, y: 0, vs: near.map((f) => ({f: f.a, fa: f.fa}))});
      s.pulseEvent({k: 'gone', x: -18.5, y: -1.5, fa: 'unaligned', npc: 4});
    });
    await sleep(500);
    await page.screenshot({path: path.join(shots, 'c4-scene-tracers-gone.png')});
    check('faction filter accepts npc', await page.evaluate(() => { window.scene.setFilter({faction: 'npc', states: null, owner: null}); const f = window.scene.getStats().filter.faction; window.scene.setFilter({faction: null}); return f === 'npc'; }));
    await sleep(500);
    await page.screenshot({path: path.join(shots, 'c4-scene-pulses.png')});
    check('setLayer accepts all 7 layers', await page.evaluate((L) => L.every((l) => window.scene.setLayer(l, true)), LAYERS));
    check('NEGATIVE: setLayer rejects an unknown layer', await page.evaluate(() => window.scene.setLayer('bogus', true) === false));
    check('NEGATIVE: setData rejects a malformed payload', await page.evaluate(() => window.scene.setData({nope: 1}, []) === false));
    // hourly reload must not fly the camera home under a user who zoomed in (reviewer P2-2)
    await page.evaluate(() => window.scene.focusPoint(25, -20, 6));
    await sleep(2000);
    const cam = await page.evaluate(async () => {
      // the focused point AND a far point: a fly-home moves both, an auto-orbit starting right after the fly moves the
      // far one (reviewer P3: flyTo must count as interaction). This runs > 12 s after mount, so the orbit would be live.
      const s = window.scene, before = [s.screenOf(25, -20), s.screenOf(-30, 25)];
      const flyingBefore = s.getStats().flying;
      s.setData(window.latest, window.events);
      const flyingAfter = s.getStats().flying;
      await new Promise((r) => setTimeout(r, 400));
      const after = [s.screenOf(25, -20), s.screenOf(-30, 25)];
      const moved = Math.max(...before.map((b, i) => Math.hypot(b.clientX - after[i].clientX, b.clientY - after[i].clientY)));
      return {flyingBefore, flyingAfter, flyingLater: s.getStats().flying, moved: Math.round(moved * 10) / 10};
    });
    check('setData after focusPoint keeps the camera (no fly-home, < 6 px drift)', !cam.flyingBefore && !cam.flyingAfter && !cam.flyingLater && cam.moved < 6, cam);
    // Deterministic idle-orbit check (reviewer P3): stub performance.now (the clock the idle timer reads; rAF timing is
    // untouched). Last canvas input is pushed 60 s into the past, then a panel-style focusPoint flies. Within 12 s of the
    // fly ENDING there must be no auto-orbit; past 12 s it must start (positive control: the drift exists and is seen).
    const orbit = await page.evaluate(async () => {
      const s = window.scene, real = performance.now.bind(performance);
      let off = 0; performance.now = () => real() + off;
      const tick = (ms) => new Promise((r) => setTimeout(r, ms));
      const frames = async (n) => { const f0 = s.getStats().frames; while (s.getStats().frames < f0 + n) await tick(16); };
      try {
        off += 60000;                       // nothing has touched the canvas for a minute
        await frames(3);
        const idleBefore = s.getStats().autoRotating;
        s.focusPoint(-10, 10, 4);
        while (s.getStats().flying) await tick(30);
        off += 6000;                        // 6 s after the fly ended
        await frames(5);
        const at6 = s.getStats().autoRotating, p0 = s.screenOf(-30, 25);
        await tick(300);
        const p1 = s.screenOf(-30, 25), moved6 = Math.hypot(p0.clientX - p1.clientX, p0.clientY - p1.clientY);
        off += 7000;                        // 13 s after the fly ended
        await frames(5);
        const at13 = s.getStats().autoRotating, q0 = s.screenOf(-30, 25);
        await tick(500);
        const q1 = s.screenOf(-30, 25), moved13 = Math.hypot(q0.clientX - q1.clientX, q0.clientY - q1.clientY);
        return {idleBefore, at6, moved6: Math.round(moved6 * 10) / 10, at13, moved13: Math.round(moved13 * 10) / 10};
      } finally { performance.now = real; }
    });
    check('panel-driven fly counts as interaction: no auto-orbit within 12 s of the fly ending', orbit.idleBefore === true && orbit.at6 === false && orbit.moved6 < 1, orbit);
    check('positive control: 13 s after the fly the idle orbit does start (and moves the view)', orbit.at13 === true && orbit.moved13 > 1, orbit);
    await page.evaluate(() => window.scene.focusOwner(null)); // flyTo resets the idle timer, so no drift in later checks
    await sleep(1800);
    check('setData again (hourly reload) keeps rendering', await page.evaluate(async () => {
      const ok = window.scene.setData(window.latest, window.events); const f = window.scene.getStats().frames;
      await new Promise((r) => setTimeout(r, 500)); return ok && window.scene.getStats().frames > f;
    }));
    await page.evaluate(() => window.scene.setFilter({faction: 'ustur'}));
    const flt = await page.evaluate(() => window.scene.getStats().filter);
    check('setFilter applies a faction', flt.faction === 'ustur', flt);
    await page.evaluate(() => window.scene.setFilter({faction: null}));

    // hidden tab pauses rendering
    const paused = await page.evaluate(async () => {
      Object.defineProperty(document, 'hidden', {configurable: true, get: () => true});
      document.dispatchEvent(new Event('visibilitychange'));
      const a = window.scene.getStats().frames; await new Promise((r) => setTimeout(r, 600)); const b = window.scene.getStats().frames;
      Object.defineProperty(document, 'hidden', {configurable: true, get: () => false});
      document.dispatchEvent(new Event('visibilitychange'));
      await new Promise((r) => setTimeout(r, 600)); const c = window.scene.getStats().frames;
      return {a, b, c};
    });
    check('hidden tab stops the render loop; visible again resumes it', paused.b === paused.a && paused.c > paused.b, paused);

    // reduced motion page mounts and renders
    const page2 = await browser.newPage({viewport: {width: 1200, height: 700}});
    await page2.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html?reduced=1`);
    await page2.waitForFunction(() => window.scene && window.scene.getStats().frames > 10, null, {timeout: 30000});
    check('reducedMotion option is honoured', await page2.evaluate(() => window.scene.getStats().reducedMotion === true));

    // Territory fill hue (task #13): territory layer only, median hue of the pixels 12-16 px around each lvl>=1
    // starbase, per faction, compared with the house hue. Reduced motion = no drift and a frozen sweep, so it is stable.
    // Before the fix the faint additive fill over the blue nebula read MUD ~334 deg (magenta) and USTUR ~221 deg.
    await page2.evaluate(() => { document.getElementById('bar').style.display = 'none'; for (const l of window.C4Scene.layers) window.scene.setLayer(l, l === 'territory'); });
    await sleep(600);
    const shot = (await page2.screenshot()).toString('base64');
    // target hues come from the house palette in landing.css at test time (it changed once already: --ust went
    // #b98cff -> #ffcc33 on 2026-11-06 23:25 EST), not from constants typed here
    const cssText = fs.readFileSync(path.join(ROOT, 'landing.css'), 'utf8');
    const hexHue = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)); const mx = Math.max(r, g, b), d = mx - Math.min(r, g, b);
      const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return Math.round((h * 60 + 360) % 360); };
    const HOUSE_HUE = Object.fromEntries([['mud', 'mud'], ['oni', 'oni'], ['ustur', 'ust']].map(([k, v]) => [k, hexHue((cssText.match(new RegExp('--' + v + ':\\s*(#[0-9a-fA-F]{6})')) || [])[1] || '#000001')]));
    const sampleHues = (b64, radii) => page2.evaluate(async ({b64, HOUSE, radii}) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0); const px = g.getImageData(0, 0, c.width, c.height).data;
      const hueOf = (r, gg, b) => { const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), d = mx - mn; if (mx < 8 || d / mx < 0.05) return null;
        let h = mx === r ? ((gg - b) / d) % 6 : mx === gg ? (b - r) / d + 2 : (r - gg) / d + 4; return (h * 60 + 360) % 360; };
      const out = {};
      const circ = (h, t) => ((h - t + 540) % 360) - 180; // signed distance from target
      const med = (a) => { const s = a.slice().sort((x, y) => x - y); return s[s.length >> 1]; };
      for (const [fa, t] of Object.entries(HOUSE)) {
        const per = [], lums = [];
        for (const s of window.latest.systems) {
          if (s.f !== fa || !(s.lvl >= 1)) continue;
          const p = window.scene.screenOf(s.x, s.y); if (!p || !p.visible) continue;
          const hs = [];
          for (const r of radii) for (let k = 0; k < 16; k++) {
            const x = Math.round(p.clientX + r * Math.cos(k * Math.PI / 8)), y = Math.round(p.clientY + r * Math.sin(k * Math.PI / 8));
            if (x < 0 || y < 0 || x >= c.width || y >= c.height) continue;
            const i = (y * c.width + x) * 4, h = hueOf(px[i], px[i + 1], px[i + 2]); if (h != null) hs.push(circ(h, t));
            lums.push(0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]);
          }
          if (hs.length) per.push(med(hs));
        }
        out[fa] = {n: per.length, medianOff: per.length ? Math.round(med(per)) : null, within20: per.filter((d) => Math.abs(d) <= 20).length,
          lum: lums.length ? Math.round(med(lums) * 10) / 10 : null};
      }
      return out;
    }, {b64, HOUSE: HOUSE_HUE, radii});
    const hues = await sampleHues(shot, [12, 14, 16]);
    const hueOk = (h) => h.n > 20 && Math.abs(h.medianOff) <= 20 && h.within20 >= h.n * 0.75;
    check(`territory fill composites to the house hue: MUD within 20 deg of ${HOUSE_HUE.mud}, >= 75% of starbases`, hueOk(hues.mud), hues.mud);
    // every faction, not just the median: >= 75% of starbase samples within 20 deg (the northern Ustur systems read
    // blue on 83d3de14 while the median passed) - verifier finding, 2026-11-06
    check(`territory fill: USTUR within 20 deg of ${HOUSE_HUE.ustur} and ONI of ${HOUSE_HUE.oni}, each on >= 75% of starbases`, hueOk(hues.ustur) && hueOk(hues.oni), hues);
    // perceived fill (task #18): the median brightness inside each faction's space is within 25% of the three-way mean.
    // At gain 1 the gold read as an opaque slab: 16 / 29 / 41 (MUD -44%, USTUR +42%).
    const lumMean = (hues.mud.lum + hues.oni.lum + hues.ustur.lum) / 3;
    const lumDev = Object.fromEntries(['mud', 'oni', 'ustur'].map((k) => [k, Math.round((hues[k].lum / lumMean - 1) * 100)]));
    check('territory fill reads equally bright per faction (each within 25% of the mean)', Object.values(lumDev).every((d) => Math.abs(d) <= 25),
      {lum: {mud: hues.mud.lum, oni: hues.oni.lum, ustur: hues.ustur.lum}, devPct: lumDev});
    // Bloom keeps MUD red-orange and USTUR gold distinct (owner rule "ustur is yellow"; 35 deg apart in the CSS):
    // systems layer only, full bloom, the glow 3-5 px around each starbase
    await page2.evaluate(() => { for (const l of window.C4Scene.layers) window.scene.setLayer(l, l === 'systems'); });
    await sleep(600);
    const glow = await sampleHues((await page2.screenshot()).toString('base64'), [3, 4, 5]);
    const mudAt = HOUSE_HUE.mud + glow.mud.medianOff, ustAt = HOUSE_HUE.ustur + glow.ustur.medianOff;
    check('under bloom, starbase glyphs stay on their house hue (MUD and USTUR within 20 deg, >= 75%) and >= 25 deg apart',
      hueOk(glow.mud) && hueOk(glow.ustur) && Math.abs(ustAt - mudAt) >= 25, {mud: {...glow.mud, hue: mudAt}, ustur: {...glow.ustur, hue: ustAt}});
    await page2.evaluate(() => { for (const l of window.C4Scene.layers) window.scene.setLayer(l, l === 'territory'); });
    await sleep(300);

    // Faction filter must not leave dark patches (task #14): with faction=mud, the median brightness of the pixels
    // 12-16 px around ONI starbases (inside ONI space) must be within 10% of the same pixels with territory off.
    // Positive control: the MUD region (shown) IS changed by the territory layer, so the probe can see the layer.
    const ringLum = async (fa) => {
      const b64 = (await page2.screenshot()).toString('base64');
      return page2.evaluate(async ({b64, fa}) => {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const g = c.getContext('2d'); g.drawImage(img, 0, 0); const px = g.getImageData(0, 0, c.width, c.height).data;
        const vals = [];
        for (const s of window.latest.systems) {
          if (s.f !== fa || !(s.lvl >= 1)) continue;
          const p = window.scene.screenOf(s.x, s.y); if (!p || !p.visible) continue;
          for (const r of [12, 14, 16]) for (let k = 0; k < 16; k++) {
            const x = Math.round(p.clientX + r * Math.cos(k * Math.PI / 8)), y = Math.round(p.clientY + r * Math.sin(k * Math.PI / 8));
            if (x < 0 || y < 0 || x >= c.width || y >= c.height) continue;
            const i = (y * c.width + x) * 4; vals.push(0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]);
          }
        }
        vals.sort((a, b) => a - b); return {n: vals.length, median: vals[vals.length >> 1]};
      }, {b64, fa});
    };
    await page2.evaluate(() => window.scene.setFilter({faction: 'mud', states: null, owner: null}));
    await sleep(500);
    const oniOn = await ringLum('oni'), mudOn = await ringLum('mud');
    await page2.evaluate(() => window.scene.setLayer('territory', false));
    await sleep(500);
    const oniOff = await ringLum('oni'), mudOff = await ringLum('mud');
    await page2.evaluate(() => { window.scene.setLayer('territory', true); window.scene.setFilter({faction: null}); });
    const ratio = oniOn.median / oniOff.median;
    check('faction=mud: ONI space keeps the plain backdrop brightness (median within 10% of territory-off)', oniOn.n > 500 && Math.abs(ratio - 1) <= 0.10, {oniOn: oniOn.median, oniOff: oniOff.median, ratio: +ratio.toFixed(3), n: oniOn.n});
    check('positive control: the shown MUD region does change with the territory layer', Math.abs(mudOn.median / mudOff.median - 1) > 0.10, {mudOn: mudOn.median, mudOff: mudOff.median});
    await page2.close();

    // ---------------- system view (task #15), on a fresh page
    const page3 = await browser.newPage({viewport: {width: 1600, height: 900}});
    page3.on('pageerror', (e) => errors.push(String(e)));
    page3.on('requestfailed', (r) => console.log('INFO  request failed (page3): ' + r.url() + ' ' + (r.failure() && r.failure().errorText)));
    page3.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    planetReqs.length = 0;
    try { // a throw here (e.g. a bundle without the system view) is reported as a FAIL, not a crash
    await page3.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html`);
    await page3.waitForFunction(() => window.scene && window.scene.getStats().frames > 30 && window.bodies, null, {timeout: 30000});
    await sleep(3000);
    await page3.evaluate(() => { window.noFocusOnPick = true; document.getElementById('bar').style.display = 'none'; });
    check('NEGATIVE / lazy: no planet texture is requested at the home view (no body is >= 12 px there)', planetReqs.length === 0, planetReqs.length);
    const sysOf = (name) => latest.systems.find((s) => s.n === name);
    const evernat = sysOf('Evernat'), serene = sysOf('Serene');
    const waitView = (addr) => page3.waitForFunction((a) => { const v = window.scene.getStats().systemView; return v && v.sys === a && v.fade > 0.99; }, addr, {timeout: 15000}).then(() => true, () => false);
    const evCount = () => page3.evaluate(() => window.sysEvents.length);

    // enter by focusSystem
    const ev0 = await evCount();
    check('NEGATIVE: focusSystem(unknown) returns false and fires no systemView event', await page3.evaluate(() => window.scene.focusSystem('NOT-A-SYSTEM') === false) && (await evCount()) === ev0);
    check('focusSystem(known) returns true', await page3.evaluate((a) => window.scene.focusSystem(a) === true, evernat.a));
    const inEv = await waitView(evernat.a);
    const sv1 = await page3.evaluate(() => ({st: window.scene.getStats(), last: window.sysEvents[window.sysEvents.length - 1]}));
    const nBodies = bodies.filter((b) => b.sys === evernat.a).length;
    check('enter by focusSystem: systemView event {sys, name} fires and the view opens', inEv && sv1.last && sv1.last.sys === evernat.a && sv1.last.name === 'Evernat', sv1.last);
    check('system view renders exactly the bodies of that system (bodies.json)', sv1.st.systemView && sv1.st.systemView.bodies === nBodies && nBodies > 0, {rendered: sv1.st.systemView && sv1.st.systemView.bodies, nBodies});
    // v10: no view mode - the galaxy-level markers fade by CAMERA DISTANCE only (v11: smoothstep over log2 distance,
    // 2.5 -> 10 map units), the same at this framing as anywhere else at this distance
    { const dd = sv1.st.camera.dist, t = Math.min(1, Math.max(0, (Math.log2(dd) - Math.log2(2.5)) / 2)), want = t * t * (3 - 2 * t);
      check(`v10: galaxyFade at the focusSystem framing is the camera-distance fade (dist ${dd.toFixed(3)} -> ${want.toFixed(3)}), not a mode`, Math.abs(sv1.st.galaxyFade - want) <= 0.002, {galaxyFade: sv1.st.galaxyFade, want}); }
    await page3.waitForFunction(() => { const t = window.scene.getStats().textures; return t.texLoaded > 0 && t.texLoaded + t.texFailed === t.texRequested; }, null, {timeout: 15000}).catch(() => {});
    const tx = await page3.evaluate(() => window.scene.getStats().textures);
    check('textures load lazily on entry, all of them (the owner\'s renders)', planetReqs.length > 0 && tx.texLoaded === tx.texRequested && tx.texFailed === 0, {requests: planetReqs.length, ...tx});

    // a mining fleet is drawn at its own asteroid
    // EVERY mining fleet of the system is drawn at its own asteroid (map units; positions as drawn this frame)
    const evMiners = latest.fleets.filter((f) => f.s.kind === 'mining' && bodies.some((b) => b.a === f.s.asteroid && b.sys === evernat.a));
    const nearAll = await page3.evaluate(({ms, sysBodies}) => ms.map(([fa, ast]) => {
      const f = window.scene.fleetScreen(fa), own = window.scene.bodyScreen(ast);
      const others = sysBodies.filter((a) => a !== ast).map((a) => window.scene.bodyScreen(a)).filter(Boolean);
      const d = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
      return {fa, inSystem: !!f.inSystem, dOwn: d(f, own), dOther: Math.min(...others.map((o) => d(f, o))), f};
    }), {ms: evMiners.map((f) => [f.a, f.s.asteroid]), sysBodies: bodies.filter((b) => b.sys === evernat.a).map((b) => b.a)});
    const badNear = nearAll.filter((n) => !(n.inSystem && n.dOwn < 0.7 && n.dOwn < n.dOther));
    check(`every mining fleet of Evernat (${nearAll.length}) is drawn at its own asteroid (miner disc < 0.7, nearer than any other body)`,
      nearAll.length > 0 && badNear.length === 0, badNear.slice(0, 3).map((n) => ({dOwn: n.dOwn, dOther: n.dOther})));
    // E2E finding (#26): Miiruvuki (10 miners) must be hoverable - its centre, at this default framing, is the rock
    {
      const miir = bodies.find((b) => b.n === 'Miiruvuki' && b.sys === evernat.a);
      const tries = []; let mc = null, hvM = null;
      for (let k = 0; k < 3 && !(hvM && hvM.type === 'body'); k++) {
        if (k) await sleep(500);
        mc = await page3.evaluate((a) => window.scene.bodyScreen(a), miir.a);
        await page3.mouse.move(mc.clientX + 50, mc.clientY - 50); await sleep(120);
        await page3.mouse.move(mc.clientX, mc.clientY); await sleep(250);
        hvM = await page3.evaluate(() => window.lastHover);
        tries.push({at: [Math.round(mc.clientX), Math.round(mc.clientY)], got: hvM && hvM.type, uSys: await page3.evaluate(() => (window.scene.getStats().systemView || {}).fade)});
      }
      check('hover on the centre of Miiruvuki (10 miners) reports the rock', hvM && hvM.type === 'body' && hvM.id === miir.a,
        {got: hvM && {type: hvM.type, id: hvM.id}, tries});
    }
    // hover one that is safely on screen
    // world-scale hulls (#23): an xx-small hull can be under 1.5 px at this framing (correctly invisible, unpickable) - hover
    // the LARGEST-class miner that is safely on screen, as a user would
    const CLS = ['xx-small', 'x-small', 'small', 'medium', 'large', 'capital', 'commander', 'titan'];
    const sizeOf = (fa) => CLS.indexOf((latest.fleets.find((f) => f.a === fa) || {}).flagSize);
    // task #32: miners show only when the camera is close to THEIR rock, so the hover is done zoomed onto the rock
    // (focusPoint zoom 42 = camera ~3 from it); the largest-class miner that is then safely on screen
    const minerBig = nearAll.slice().sort((a, b) => sizeOf(b.fa) - sizeOf(a.fa))[0];
    const minerRock = evMiners.find((f) => f.a === minerBig.fa).s.asteroid;
    await page3.evaluate((a) => { const p = window.scene.bodyScreen(a); window.scene.focusPoint(p.x, p.y, 1312); }, minerRock); // camera ~0.1 (pre-v10 3 x K)
    await sleep(2000);
    const nearRock = await page3.evaluate((ms) => ms.map((a) => ({fa: a, f: window.scene.fleetScreen(a)})), evMiners.filter((f) => f.s.asteroid === minerRock).map((f) => f.a));
    const minerOn = nearRock.filter((n) => n.f.clientX > 80 && n.f.clientX < 1520 && n.f.clientY > 80 && n.f.clientY < 820).sort((a, b) => sizeOf(b.fa) - sizeOf(a.fa))[0] || nearRock[0];
    const miner = evMiners.find((f) => f.a === minerOn.fa);
    await page3.mouse.move(minerOn.f.clientX - 40, minerOn.f.clientY - 40); await sleep(100);
    const fNow = await page3.evaluate((a) => window.scene.fleetScreen(a), miner.a); // it orbits: re-read just before hovering
    await page3.mouse.move(fNow.clientX, fNow.clientY); await sleep(250);
    const hvF = await page3.evaluate(() => window.lastHover);
    check('hover inside the view reports that mining fleet (zoomed onto its rock)', hvF && hvF.type === 'fleet' && hvF.id === miner.a, hvF && {type: hvF.type, id: hvF.id});
    await page3.mouse.move(30, 870);
    await page3.evaluate((a) => window.scene.focusSystem(a), evernat.a); // back to the entry framing for the body checks
    await sleep(2200);

    // body pick
    const planet = bodies.find((b) => b.sys === evernat.a && b.k === 'planet');
    const bs = await page3.evaluate((a) => window.scene.bodyScreen(a), planet.a);
    await page3.evaluate(() => { window.lastPick = null; });
    await page3.mouse.move(bs.clientX, bs.clientY); await sleep(300);
    const hvB = await page3.evaluate(() => window.lastHover);
    check('hover on a planet: name, type, resources, miners, stakes, stylised-layout note', hvB && hvB.type === 'body' && hvB.label.startsWith(planet.n) && /claim stake/.test(hvB.label) && /stylised/.test(hvB.label), hvB && hvB.label);
    await page3.mouse.down(); await page3.mouse.up(); await sleep(300);
    const pkB = await page3.evaluate(() => window.lastPick);
    check('click on a planet picks {type:"body", id: body.a, sys}', pkB && pkB.type === 'body' && pkB.id === planet.a && pkB.sys === evernat.a, pkB);
    await page3.evaluate(() => { window.lastPick = null; });
    await page3.mouse.move(30, 870); await sleep(150); await page3.mouse.down(); await page3.mouse.up(); await sleep(300);
    check('NEGATIVE: a click on empty space in the view picks nothing', (await page3.evaluate(() => window.lastPick)) === null);
    const lumAt = async (x, y) => {
      const b64 = (await page3.screenshot({clip: {x: Math.round(x) - 3, y: Math.round(y) - 3, width: 7, height: 7}})).toString('base64');
      return page3.evaluate(async (d) => { const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode(); const c = document.createElement('canvas'); c.width = 7; c.height = 7; const g = c.getContext('2d'); g.drawImage(img, 0, 0); const px = g.getImageData(0, 0, 7, 7).data; let s = 0; for (let i = 0; i < px.length; i += 4) s += 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]; return s / 49; }, b64);
    };
    await page3.mouse.move(30, 870); await sleep(200);
    const bs2 = await page3.evaluate((a) => window.scene.bodyScreen(a), planet.a);
    const planetLum = await lumAt(bs2.clientX, bs2.clientY);
    await page3.screenshot({path: path.join(shots, 'c4-system-evernat.png')});

    // exit restores the galaxy
    const evBeforeExit = await evCount();
    check('focusSystem(null) returns true', await page3.evaluate(() => window.scene.focusSystem(null) === true));
    const out = await page3.waitForFunction(() => window.scene.getStats().systemView === null && window.scene.getStats().galaxyFade > 0.99, null, {timeout: 15000}).then(() => true, () => false);
    const lastOut = await page3.evaluate(() => window.sysEvents[window.sysEvents.length - 1]);
    check('exit: systemView null event fires, view closes, galaxy fully back', out && lastOut === null && (await evCount()) === evBeforeExit + 1, {out, lastOut});
    const gone = await lumAt(bs2.clientX, bs2.clientY);
    check('NEGATIVE: the planet pixel was drawn by the view (lit inside, not after exit)', planetLum > 40 && planetLum > gone * 1.5, {inView: +planetLum.toFixed(1), afterExit: +gone.toFixed(1)});

    // enter by zoom (mouse wheel) at Serene; first a not-close-enough negative
    await page3.evaluate((s) => window.scene.focusPoint(s.x, s.y, 6), serene);
    await sleep(2200);
    const st20 = await page3.evaluate(() => window.scene.getStats());
    check('NEGATIVE: hovering over a system at distance ~21 does not open the view', st20.systemView === null, st20.systemView);
    await page3.mouse.move(800, 450);
    for (let k = 0; k < 14; k++) { await page3.mouse.wheel(0, -300); await sleep(120); }
    const inZoom = await waitView(serene.a);
    const lastZ = await page3.evaluate(() => window.sysEvents[window.sysEvents.length - 1]);
    check('enter by zoom: wheel in over Serene opens its view and fires systemView', inZoom && lastZ && lastZ.sys === serene.a, lastZ);
    const svS = await page3.evaluate(() => window.scene.getStats().systemView);
    check('Serene view: body count = bodies.json, fleets placed at bodies', svS && svS.bodies === bodies.filter((b) => b.sys === serene.a).length && svS.roles.mining > 50 && svS.roles.docked > 50, svS && {bodies: svS.bodies, roles: svS.roles});
    const sf0 = await page3.evaluate(() => [window.scene.getStats().frames, performance.now()]);
    await sleep(3000);
    const sf1 = await page3.evaluate(() => [window.scene.getStats().frames, performance.now()]);
    const sysFps = (sf1[0] - sf0[0]) / ((sf1[1] - sf0[1]) / 1000);
    check(`system view at Serene (${svS ? svS.fleets : '?'} fleets) holds >= 55 fps`, sysFps >= 55, +sysFps.toFixed(1));
    await page3.screenshot({path: path.join(shots, 'c4-system-serene.png')});

    // Mining choreography (task #22): miners hold station close to their rock, nose in; they do not orbit it.
    {
      const MM = await import('data:text/javascript,' + encodeURIComponent(fs.readFileSync(path.join(ROOT, 'C4Live/scene-src/model.js'), 'utf8')));
      const R = MM.BODY_R.belt;
      const seMiners = latest.fleets.filter((f) => f.s.kind === 'mining' && bodies.some((b) => b.a === f.s.asteroid && b.sys === serene.a)).map((f) => [f.a, f.s.asteroid]);
      const snap = () => page3.evaluate((ms) => ms.map(([fa, ast]) => { const f = window.scene.fleetScreen(fa), r = window.scene.bodyScreen(ast); return [f.x - r.x, f.y - r.y, !!f.inSystem]; }), seMiners);
      const s0 = await snap();
      await sleep(2000);
      const s1 = await snap();
      const dist = s1.map(([dx, dy]) => Math.hypot(dx, dy) / R);
      const dAng = s0.map(([x0, y0], k) => { const [x1, y1] = s1[k]; let d = Math.atan2(y1, x1) - Math.atan2(y0, x0); d = ((d + Math.PI * 3) % (Math.PI * 2)) - Math.PI; return Math.abs(d); });
      // task #32: they hug the rock now - within 1.4 R (slot <= 1.3 R + a 0.05 R bob); was 3.5 R before
      const far = dist.filter((d) => d > 1.4).length, orbiting = dAng.filter((d) => d > 0.15).length;
      check(`all ${seMiners.length} Serene miners hug their rock (within 1.4 rock radii of its centre)`, seMiners.length > 50 && far === 0 && s1.every((v) => v[2]),
        {maxRadii: +Math.max(...dist).toFixed(2), minRadii: +Math.min(...dist).toFixed(2), beyond: far});
      check('miners do not orbit their rock (angle around it changes < 0.15 rad over 2 s, drift only)', orbiting === 0,
        {maxDeltaRad: +Math.max(...dAng).toFixed(3), orbiting});
      const svM = await page3.evaluate(() => window.scene.getStats().systemView);
      // (v10: every asteroid - mined or not - is drawn as a lit procedural rock in the instanced body set; no 3D mesh)
      check('mining beams are capped at 24 per system', svM.beams === Math.min(24, svM.roles.mining), {beams: svM.beams, miners: svM.roles.mining});
      // task #23: hulls are tiny next to bodies (the largest hull is at most a quarter of the smallest body's radius)
      // owner (#23): "rock radius > largest miner hull, planet > ship" - the longest hull in the view is shorter than the
      // smallest planet / rock RADIUS (hull length = half-size x 2 x 0.92 fill)
      const hullLen = svM.shipHalfMax * 2 * 0.92;
      check('system view: the longest ship hull is shorter than the smallest planet/rock radius', hullLen > 0 && hullLen < svM.bodyRMin,
        {longestHull: +hullLen.toFixed(3), smallestBodyR: svM.bodyRMin});
      // E2E finding B: the centre of a crowded rock picks the ROCK, not one of its 129 miners
      const rockAddr = seMiners[0][1];
      // the DEFAULT system framing (where the verifier saw it): the pointer inside the rock's disc at 0.6 R, on the
      // side of its nearest miner - old glyphs covered that point, world-scale hulls do not
      await page3.evaluate((a) => window.scene.focusSystem(a), serene.a);
      await sleep(2400);
      const aim = await page3.evaluate(({rock, ms}) => {
        const r = window.scene.bodyScreen(rock), fl = ms.map((a) => window.scene.fleetScreen(a)).filter((p) => p && p.inSystem);
        const near = fl.sort((p, q) => Math.hypot(p.x - r.x, p.y - r.y) - Math.hypot(q.x - r.x, q.y - r.y))[0];
        const dx = near.clientX - r.clientX, dy = near.clientY - r.clientY, L = Math.hypot(dx, dy) || 1;
        // projected rock radius in px: 0.16 world units at this camera (bodyScreen of a point R away along x)
        const edge = window.scene.screenOf(r.x + 0.16, r.y), Rpx = Math.hypot(edge.clientX - r.clientX, edge.clientY - r.clientY);
        return {x: r.clientX, y: r.clientY, Rpx, toMinerPx: L}; // the rock's CENTRE (the verifier's case); toMinerPx = nearest miner
      }, {rock: rockAddr, ms: seMiners.map((m) => m[0])});
      await page3.mouse.move(aim.x + 60, aim.y + 60); await sleep(120);
      await page3.mouse.move(aim.x, aim.y); await sleep(250);
      const hvR = await page3.evaluate(() => window.lastHover);
      check('pointer inside Serene Anchorage\'s centre (default framing, 129 miners round it) reports the rock, not a fleet', hvR && hvR.type === 'body' && hvR.id === rockAddr && aim.toMinerPx > 4,
        {got: hvR && {type: hvR.type, id: hvR.id}, rockRadiusPx: +aim.Rpx.toFixed(1), toNearestMinerPx: +aim.toMinerPx.toFixed(1)});
      // E2E finding (#26): the Fleets and Mining switches also act inside the system view. On a reduced-motion page
      // (animation frozen) framed close on Serene's rock, where hulls and beams are visible, each switch must change
      // clearly more pixels than two identical frames do
      {
        const pageL = await browser.newPage({viewport: {width: 1600, height: 900}});
        try {
          await pageL.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html?reduced=1`);
          await pageL.waitForFunction(() => window.scene && window.scene.getStats().frames > 10 && window.bodies && window.scene.getStats().ships && window.scene.getStats().ships.atlas, null, {timeout: 30000});
          await pageL.evaluate((a) => { document.getElementById('bar').style.display = 'none'; window.scene.focusSystem(a); }, serene.a);
          await pageL.waitForFunction((a) => { const v = window.scene.getStats().systemView; return v && v.sys === a && v.fade > 0.99; }, serene.a, {timeout: 15000});
          const rk2 = await pageL.evaluate((a) => window.scene.bodyScreen(a), rockAddr);
          await pageL.evaluate((p) => window.scene.focusPoint(p.x, p.y, 1312), rk2); // camera ~0.1 from the rock (= the pre-v10 3 x WORLD.K): miners drawn by size
          await sleep(800);
          const rcc = await pageL.evaluate((a) => window.scene.bodyScreen(a), rockAddr);
          const box = {x: Math.round(rcc.clientX) - 110, y: Math.round(rcc.clientY) - 110, width: 220, height: 220};
          const grab = async () => { const d = (await pageL.screenshot({clip: box})).toString('base64');
            return pageL.evaluate(async (d) => { const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return Array.from(g.getImageData(0, 0, c.width, c.height).data); }, d); };
          const changed = (a, b) => { let n = 0; for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 36) n++; return n; };
          const a0 = await grab(); await sleep(250); const a1 = await grab();
          const base = changed(a0, a1);
          await pageL.evaluate(() => window.scene.setLayer('fleets', false)); await sleep(300);
          const fOff = changed(a1, await grab());
          await pageL.evaluate(() => { window.scene.setLayer('fleets', true); window.scene.setLayer('mining', false); }); await sleep(300);
          const mOff = changed(a1, await grab());
          check('system view: the Fleets switch hides hulls and beams, the Mining switch hides miners and beams (frozen frame, close on the rock)',
            fOff > base * 3 + 60 && mOff > base * 3 + 60, {identicalFrames: base, fleetsOff: fOff, miningOff: mOff});
        } catch (e) { check('system-view layer drive completed without throwing', false, String(e && e.message || e).slice(0, 160)); }
        await pageL.close();
      }
    }
    // zoom back out by wheel: the view closes by itself
    for (let k = 0; k < 25; k++) { await page3.mouse.wheel(0, 400); await sleep(100); }
    const outZ = await page3.waitForFunction(() => window.scene.getStats().systemView === null, null, {timeout: 10000}).then(() => true, () => false);
    check('zooming back out closes the view (systemView null)', outZ && (await page3.evaluate(() => window.sysEvents[window.sysEvents.length - 1])) === null);
    // a system with claim stakes
    const errutar = bodies.find((b) => b.n === 'Errutar');
    await page3.evaluate((a) => window.scene.focusSystem(a), errutar.sys);
    await waitView(errutar.sys);
    const svE = await page3.evaluate(() => window.scene.getStats().systemView);
    const wantStakes = (latest.stakes || []).filter((s) => bodies.some((b) => b.a === s.body && b.sys === errutar.sys)).length;
    check('claim stakes drawn on their planets (count = stakes whose body is in the system)', svE && svE.stakes === wantStakes && wantStakes > 0, {drawn: svE && svE.stakes, wantStakes});
    await page3.screenshot({path: path.join(shots, 'c4-system-errutar.png')});
    } catch (e) { check('system view drive completed without throwing', false, String(e && e.message || e).slice(0, 160)); }
    await page3.close();

    // A planet render that fails to load keeps the type-colour placeholder sphere: the body still draws (reviewer P3).
    // Fresh page (empty texture cache); the server 404s the render of one Evernat planet.
    {
      const M2 = await import('data:text/javascript,' + encodeURIComponent(fs.readFileSync(path.join(ROOT, 'C4Live/scene-src/model.js'), 'utf8')));
      const evSys = latest.systems.find((s) => s.n === 'Evernat');
      const evBodies = bodies.filter((b) => b.sys === evSys.a && b.k === 'planet');
      const files = evBodies.map((b) => `${M2.bodySlug(b)}_${M2.artVariant(b.n)}_384.webp`);
      const victim = evBodies.find((b, i) => files.filter((f) => f === files[i]).length === 1); // a render no other body shares
      planet404 = `${M2.bodySlug(victim)}_${M2.artVariant(victim.n)}_384.webp`;
      const page4 = await browser.newPage({viewport: {width: 1600, height: 900}});
      try {
        await page4.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html`);
        await page4.waitForFunction(() => window.scene && window.scene.getStats().frames > 30 && window.bodies, null, {timeout: 30000});
        await page4.evaluate(() => { document.getElementById('bar').style.display = 'none'; });
        await sleep(2500);
        await page4.evaluate((a) => window.scene.focusSystem(a), evSys.a);
        await page4.waitForFunction((a) => { const v = window.scene.getStats().systemView; const t = window.scene.getStats().textures;
          return v && v.sys === a && v.fade > 0.99 && t.texLoaded + t.texFailed === t.texRequested; }, evSys.a, {timeout: 15000}).catch(() => {});
        await sleep(400);
        const tx4 = await page4.evaluate(() => window.scene.getStats().textures);
        const lum4 = async () => {
          const p = await page4.evaluate((a) => window.scene.bodyScreen(a), victim.a);
          const b64 = (await page4.screenshot({clip: {x: Math.round(p.clientX) - 2, y: Math.round(p.clientY) - 2, width: 5, height: 5}})).toString('base64');
          return {p, lum: await page4.evaluate(async (d) => { const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode(); const c = document.createElement('canvas'); c.width = 5; c.height = 5; const g = c.getContext('2d'); g.drawImage(img, 0, 0); const px = g.getImageData(0, 0, 5, 5).data; let s = 0; for (let i = 0; i < px.length; i += 4) s += 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]; return s / 25; }, b64)};
        };
        const inV = await lum4();
        await page4.screenshot({path: path.join(shots, 'c4-system-texfail.png')});
        // it still hovers and picks
        await page4.evaluate(() => { window.noFocusOnPick = true; window.lastPick = null; window.lastHover = null; });
        await page4.mouse.move(inV.p.clientX + 40, inV.p.clientY + 40); await sleep(100);
        const pNow = await page4.evaluate((a) => window.scene.bodyScreen(a), victim.a);
        await page4.mouse.move(pNow.clientX, pNow.clientY); await sleep(250);
        await page4.mouse.down(); await page4.mouse.up(); await sleep(250);
        const hp4 = await page4.evaluate(() => ({h: window.lastHover, p: window.lastPick}));
        check(`texture-fail fallback: ${victim.n} still hovers and picks as a body`, hp4.h && hp4.h.type === 'body' && hp4.h.id === victim.a && hp4.p && hp4.p.type === 'body' && hp4.p.id === victim.a,
          {hover: hp4.h && hp4.h.id === victim.a, pick: hp4.p});
        await page4.mouse.move(20, 880); await sleep(150);
        await page4.evaluate(() => window.scene.focusSystem(null));
        await page4.waitForFunction(() => window.scene.getStats().systemView === null && window.scene.getStats().galaxyFade > 0.99, null, {timeout: 15000}).catch(() => {});
        const p = inV.p;
        const b64o = (await page4.screenshot({clip: {x: Math.round(p.clientX) - 2, y: Math.round(p.clientY) - 2, width: 5, height: 5}})).toString('base64');
        const outLum = await page4.evaluate(async (d) => { const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode(); const c = document.createElement('canvas'); c.width = 5; c.height = 5; const g = c.getContext('2d'); g.drawImage(img, 0, 0); const px = g.getImageData(0, 0, 5, 5).data; let s = 0; for (let i = 0; i < px.length; i += 4) s += 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]; return s / 25; }, b64o);
        check(`texture-fail fallback: render ${planet404} 404s -> texFailed is exactly 1, the rest load`, tx4.texFailed === 1 && tx4.texLoaded === tx4.texRequested - 1, tx4);
        check(`texture-fail fallback: ${victim.n} still draws (placeholder sphere lit in the view, dark at the same pixel after exit)`,
          inV.lum > 25 && inV.lum > outLum * 1.5, {inView: +inV.lum.toFixed(1), afterExit: +outLum.toFixed(1)});
      } catch (e) { check('texture-fail drive completed without throwing', false, String(e && e.message || e).slice(0, 160)); }
      planet404 = null;
      await page4.close();
    }

    // ---------------- reviewer P3-1 (#26): pick visibility = draw visibility, per hull, on a tilted camera. A NEAR hull
    // projecting >= 3 px is drawn (pixels change with the fleets layer) and pickable; a FAR one at 0.25-0.7 px (under
    // v10's HULL_PX.collapse 0.75) is neither drawn nor pickable. v10: the camera distance is searched (hulls are world
    // scale x WORLD.K), the first of a fixed list of distances over Serene that yields both, isolated by 14 px.
    try {
      const page9 = await browser.newPage({viewport: {width: 1600, height: 900}});
      await page9.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html?reduced=1&nobodies=1`);
      await page9.waitForFunction(() => window.scene && window.scene.getStats().frames > 10 && window.scene.getStats().ships && window.scene.getStats().ships.atlas, null, {timeout: 30000});
      const se9 = latest.systems.find((s) => s.n === 'Serene');
      await page9.evaluate(() => { window.noFocusOnPick = true; document.getElementById('bar').style.display = 'none'; });
      // v11: near and far are searched SEPARATELY (each with its own framing, both laid down to polar ~1.15): round Serene
      // the isolated hulls of one framing never span 3 px and 0.7 px at once (measured: 0.12 -> 33 near / 0 far, 0.35-3.2 ->
      // far only). The claim is per hull - each hull's own depth decides - so one framing per hull proves it the same way.
      const frame = async (d) => {
        await page9.evaluate(({s, z}) => window.scene.focusPoint(s.x, s.y, z), {s: se9, z: HOME_DIST / d});
        await sleep(400);
        // a REAL tilt: focusPoint frames at polar 0.62; a right-drag (orbit) lays the camera down to maxPolarAngle 1.15
        for (const dy of [-260, 260]) {
          const p0 = await page9.evaluate(() => window.scene.getStats().camera.polar);
          await page9.mouse.move(800, 450); await page9.mouse.down({button: 'right'}); await page9.mouse.move(800, 450 + dy, {steps: 12}); await page9.mouse.up({button: 'right'});
          await sleep(300);
          const p1 = await page9.evaluate(() => window.scene.getStats().camera.polar);
          if (p1 > p0 + 0.05) break;
        }
        const cand = await page9.evaluate(() => window.latest.fleets
          .map((f) => ({a: f.a, px: window.scene.fleetPixelSize(f.a), s: window.scene.fleetScreen(f.a)}))
          .filter((o) => o.s && o.s.visible && o.s.clientX > 40 && o.s.clientX < 1560 && o.s.clientY > 40 && o.s.clientY < 860));
        // isolated candidates: no other candidate within 14 px on screen
        return cand.filter((o) => cand.every((p) => p === o || Math.hypot(p.s.clientX - o.s.clientX, p.s.clientY - o.s.clientY) > 14));
      };
      let near = null, far = null, dN = 0, dF = 0;
      for (const d of [0.12, 0.18, 0.25]) { near = (await frame(d)).filter((o) => o.px >= 3).sort((a, b) => b.px - a.px)[0]; dN = d; if (near) break; }
      for (const d of [1.0, 0.5, 0.7, 1.5, 2.2, 3.2]) { far = (await frame(d)).filter((o) => o.px > 0.25 && o.px < 0.7).sort((a, b) => a.px - b.px)[0]; dF = d; if (far) break; }
      const polar9 = +(await page9.evaluate(() => window.scene.getStats().camera.polar)).toFixed(3);
      check('tilted camera: found an isolated near hull >= 3 px and an isolated far hull of 0.25-0.7 px (one tilted framing each)', !!near && !!far,
        {near: near && +near.px.toFixed(2), far: far && +far.px.toFixed(2), distNear: dN, distFar: dF, polar: polar9});
      const lumAt = async (p) => { const d = (await page9.screenshot({clip: {x: Math.round(p.clientX) - 3, y: Math.round(p.clientY) - 3, width: 7, height: 7}})).toString('base64');
        return page9.evaluate(async (d) => { const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode(); const c = document.createElement('canvas'); c.width = 7; c.height = 7; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return Array.from(g.getImageData(0, 0, 7, 7).data); }, d); };
      const mad = (a, b) => { let s = 0; for (let i = 0; i < a.length; i += 4) s += (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2])) / 3; return s / 49; };
      const hov = async (p) => { await page9.mouse.move(p.clientX + 40, p.clientY + 40); await sleep(100); await page9.mouse.move(p.clientX, p.clientY); await sleep(250); return page9.evaluate(() => window.lastHover); };
      // per hull: re-frame, re-read its screen point and size in that framing, pixels on/off with only the fleets layer, hover
      const probeHull = async (o, d) => {
        await page9.evaluate(() => { for (const l of window.C4Scene.layers) window.scene.setLayer(l, true); });
        await frame(d);
        const s = await page9.evaluate((a) => window.scene.fleetScreen(a), o.a), px = await page9.evaluate((a) => window.scene.fleetPixelSize(a), o.a);
        await page9.evaluate(() => { for (const l of window.C4Scene.layers) window.scene.setLayer(l, l === 'fleets'); }); await sleep(300);
        const on = await lumAt(s);
        await page9.evaluate(() => window.scene.setLayer('fleets', false)); await sleep(300);
        const off = await lumAt(s);
        await page9.evaluate(() => window.scene.setLayer('fleets', true)); await sleep(300);
        return {diff: mad(on, off), hover: await hov(s), px};
      };
      if (near && far) {
        const n = await probeHull(near, dN), f = await probeHull(far, dF);
        check('tilted camera: the near hull is drawn and pickable', n.diff > 3 && n.hover && n.hover.type === 'fleet' && n.hover.id === near.a,
          {drawnDiff: +n.diff.toFixed(1), hover: n.hover && n.hover.type, px: +n.px.toFixed(2)});
        check('tilted camera: the far sub-0.75 px hull is neither drawn nor pickable', f.diff < 1 && !(f.hover && f.hover.id === far.a) && f.px < 0.75,
          {drawnDiff: +f.diff.toFixed(1), hover: f.hover && f.hover.type, px: +f.px.toFixed(2)});
      }
      await page9.close();
    } catch (e) { check('tilted near/far drive completed without throwing', false, String(e && e.message || e).slice(0, 160)); }

    // ---------------- wheel zooms toward the cursor (task #23): from the home view, with the pointer held over Serene
    // and NO focusPoint / pan, wheeling in must bring Serene to dominate the view (v10: 80 steps - systems are world-scale)
    try {
      const page8 = await browser.newPage({viewport: {width: 1600, height: 900}});
      await page8.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html`);
      await page8.waitForFunction(() => window.scene && window.scene.getStats().frames > 30 && window.bodies, null, {timeout: 30000});
      await sleep(3200); // intro fly-in
      await page8.evaluate(() => { document.getElementById('bar').style.display = 'none'; });
      const se = latest.systems.find((s) => s.n === 'Serene');
      const sp8 = await page8.evaluate((s) => window.scene.screenOf(s.x, s.y), se);
      await page8.mouse.move(sp8.clientX, sp8.clientY);
      let entered = null;
      for (let k = 0; k < 80 && !entered; k++) {
        await page8.mouse.wheel(0, -240); await sleep(110);
        entered = await page8.evaluate(() => { const v = window.scene.getStats().systemView; return v ? v.name : null; });
      }
      const lastE = await page8.evaluate(() => window.sysEvents[window.sysEvents.length - 1]);
      check('wheel toward the cursor: wheeling in over Serene from the home view opens Serene\'s system view (no focusPoint, no pan)',
        entered === 'Serene' && lastE && lastE.name === 'Serene', {entered, lastEvent: lastE && lastE.name});
      await page8.close();
    } catch (e) { check('wheel-to-cursor drive completed without throwing', false, String(e && e.message || e).slice(0, 160)); }

    // ---------------- task #30: the VERIFIER's scenarios, on the real page (C4Live/index.html), not dev.html.
    // The scene handle is captured by wrapping C4Scene.mount before app.js calls it.
    const realPage = async (query) => {
      const pg = await browser.newPage({viewport: {width: 1600, height: 900}});
      await pg.addInitScript(() => {
        let v;
        Object.defineProperty(window, 'C4Scene', {configurable: true, get: () => v, set: (x) => {
          v = x; const m = x.mount;
          x.mount = (...a) => { const s = m(...a); window.__scene = s; window.__sv = []; s.on('systemView', (e) => window.__sv.push(e && e.name)); s.on('hover', (h) => { window.__hov = h; }); return s; };
        }});
        // the map point on the marker plane (y 0.3, what screenOf projects) under a client pixel: Newton on screenOf
        window.__under = (cx, cy, x, y) => {
          for (let i = 0; i < 12; i++) {
            const s = window.__scene, h = 1e-3, p = s.screenOf(x, y), px = s.screenOf(x + h, y), py = s.screenOf(x, y + h);
            const a = (px.clientX - p.clientX) / h, b = (py.clientX - p.clientX) / h, c = (px.clientY - p.clientY) / h, d = (py.clientY - p.clientY) / h;
            const ex = cx - p.clientX, ey = cy - p.clientY, det = a * d - b * c;
            x += (d * ex - b * ey) / det; y += (-c * ex + a * ey) / det;
          }
          return [x, y];
        };
      });
      await pg.goto(`http://127.0.0.1:${port}/C4Live/index.html${query}`);
      await pg.waitForFunction(() => window.__scene && window.__scene.getStats().frames > 30, null, {timeout: 30000});
      return pg;
    };
    // (1) zoom-to-cursor OFF-CENTRE: pointer held on a system away from the centre (Ka-Ulan upper right as reported, Ki'Arei
    // lower left), 30 mouse notches (deltaY -100). The map point under the cursor must stay under it (<= 2 px) all the way
    // in, and the view that opens must be THAT system's (pre-fix: Ka-Ulan drifted 65 px before entry and Accession opened;
    // Ki'Arei, 2 px from Khelmahk on screen, opened Shorbrakh)
    // (1b) the verifier's #31 form: 4-5 centre notches first (camera ~5.5-10 px/unit, the aimed system near the top / left
    // edge), then wheel -240 every 150 ms up to 40 times. Pre-fix (35eaa004) Ka-Ulan opened Ka-Solis: the target was
    // still > 5.5 units off at dist 11 and entry fell back to the system nearest the TARGET.
    // v10: a system is ~0.032 x its pre-v10 size, so it dominates the view ~3.4 log units deeper: 70 notches, not 30
    const zoomRuns = [{name: 'Ka-Ulan', pre: 0, dy: -100, n: 70, gap: 120}, {name: "Ki'Arei", pre: 0, dy: -100, n: 70, gap: 120},
      {name: 'Ka-Ulan', pre: 5, dy: -240, n: 40, gap: 150}, {name: 'Belpraakun', pre: 4, dy: -240, n: 40, gap: 150}];
    for (const {name, pre, dy, n, gap} of zoomRuns) {
      try {
        const sys = latest.systems.find((s) => s.n === name);
        if (!sys) { check(`zoom-to-cursor off-centre: ${name} exists in latest.json`, false); continue; }
        const pz = await realPage('');
        await sleep(6000); // intro fly + the page's idle bodies preload
        // the "centre notches" go to the centre of the UNCOVERED map (task #32/#33: the page docks its panels over a
        // full-screen map and tells the scene via setInsets; the old fixed 800,362 was the pre-v2 map box centre)
        const mc = await pz.evaluate(() => { const r = document.querySelector('#c4Map canvas').getBoundingClientRect(), i = window.__scene.getStats().insets || {left: 0, right: 0, top: 0, bottom: 0};
          return [r.left + i.left + (r.width - i.left - i.right) / 2, r.top + i.top + (r.height - i.top - i.bottom) / 2]; });
        // ...but never so many that the aimed system leaves the uncovered map (on the full-screen v2 layout Belpraakun sits
        // near the left edge): a notch that pushes it off is undone by one notch out about the same point (exact inverse)
        const inMap = () => pz.evaluate((s) => { const p = window.__scene.screenOf(s.x, s.y); const e = document.elementFromPoint(p.clientX, p.clientY);
          return !p.covered && p.clientX > 30 && p.clientY > 30 && p.clientX < innerWidth - 30 && p.clientY < innerHeight - 30 && !!e && e.tagName === 'CANVAS'; }, sys);
        for (let k = 0; k < pre; k++) {
          await pz.mouse.move(mc[0], mc[1]); await pz.mouse.wheel(0, -100); await sleep(700);
          if (!(await inMap())) { await pz.mouse.wheel(0, 100); await sleep(900); break; }
        }
        if (pre) await sleep(1500);
        const s0 = await pz.evaluate((s) => window.__scene.screenOf(s.x, s.y), sys);
        const cx = Math.round(s0.clientX), cy = Math.round(s0.clientY);
        const offCentre = Math.hypot(cx - mc[0], cy - mc[1]);
        const onCanvas = await pz.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!e && e.tagName === 'CANVAS'; }, [cx, cy]);
        if (!onCanvas) { check(`zoom-to-cursor off-centre (${name}, pre ${pre}): precondition - the aimed pixel ${cx},${cy} is on the map canvas`, false); await pz.close(); continue; }
        await pz.mouse.move(cx, cy);
        const g0 = await pz.evaluate(([cx, cy, s]) => window.__under(cx, cy, s.x, s.y), [cx, cy, sys]);
        let worst = 0, entered = null;
        for (let k = 0; k < n; k++) {
          await pz.mouse.wheel(0, dy); await sleep(gap);
          const st = await pz.evaluate((g) => { const p = window.__scene.screenOf(g[0], g[1]), v = window.__scene.getStats().systemView; return {x: p.clientX, y: p.clientY, v: v && v.name}; }, g0);
          if (!st.v) worst = Math.max(worst, Math.hypot(st.x - cx, st.y - cy)); else entered = entered || st.v;
        }
        const evs = await pz.evaluate(() => window.__sv);
        check(`zoom-to-cursor off-centre (${name}, pre ${pre}, ${Math.round(offCentre)} px off centre at ${cx},${cy}): ${n} notches of ${dy} keep the map point under the cursor within 2 px`,
          worst <= 2, +worst.toFixed(1));
        // v10: the event names the DOMINANT system; past it (at the closest zoom the cursor's point may lie just outside the
        // system's extent) it may go null - but no OTHER system ever dominates on the way
        check(`zoom-to-cursor off-centre (${name}, pre ${pre}): the system that dominates is ${name}, and no other system did on the way`,
          entered === name && evs.length > 0 && evs.filter(Boolean).every((n) => n === name), {entered, events: evs});
        await pz.close();
      } catch (e) { check(`zoom-to-cursor off-centre drive (${name}) completed without throwing`, false, String(e && e.message || e).slice(0, 160)); }
    }
    // (2) Miiruvuki (Evernat's mined rock) after the DEEP LINK ?system=<Evernat>, 5 s, then the verifier's 10 px sweep over
    // the rock's drawn disc. The system panel covers the rock's upper half at this framing, so only grid points the canvas
    // actually receives (elementFromPoint) count. The drawn rock measured >= 22 px in radius (3x shot, panel hidden), so a
    // 10 px grid within 20 px of its centre is all on the rock: most of those points must give the rock's tip.
    try {
      const ev = latest.systems.find((s) => s.n === 'Evernat');
      const mi = ev && bodies.find((b) => b.n === 'Miiruvuki' && b.sys === ev.a);
      const pm = await realPage(`?system=${ev.a}`);
      const tDL = Date.now(); await sleep(5000);
      try { await pm.waitForFunction(() => { const v = window.__scene.getStats().systemView; return v && v.name === "Evernat"; }, null, {timeout: 10000}); } catch { /* reported below */ }
      const openedBy = Date.now() - tDL;
      const view = await pm.evaluate(() => { const v = window.__scene.getStats().systemView; return v && v.name; });
      const c = await pm.evaluate((a) => window.__scene.bodyScreen(a), mi.a);
      // task #36: NO pan here (v2 panned the rock into view and masked the bug): the deep-link framing itself must put the
      // rock on the open canvas
      check('task #36: after the deep link Miiruvuki is on the OPEN canvas (elementFromPoint = the canvas, no pan)', !!c && await pm.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!e && e.tagName === 'CANVAS'; }, [c.clientX, c.clientY]),
        c && [Math.round(c.clientX), Math.round(c.clientY)]);
      if (!c) throw new Error('Miiruvuki has no screen position: system view = ' + view + ' after ' + openedBy + ' ms');
      // the 10 px grid within 22 px of the centre, split into the CORE (<= 12 px: inside the old L.size*1.05 disc, ~13 px
      // here) and the RIM (12-22 px: drawn rock the old disc ignored - pre-fix every rim point gave no tip)
      // task #44: those radii were measured at 141 px / map unit; since the late-bodies reframe the deep link frames the
      // whole system (~82 px / unit), so the core / rim radii and the grid step scale by ppu / 141 (the same drawn rock)
      const ppu = await pm.evaluate((s) => { const a = window.__scene.screenOf(s.x, s.y, 0), b = window.__scene.screenOf(s.x + 1, s.y, 0); return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY); }, ev);
      // v10: the radii scale by the rock's DRAWN radius (bodyPixelSize; the pre-v10 rock drew ~22.6 px at 141 px / unit) -
      // systems are world-scale x their own systemScale now, so px per map unit no longer says how big the rock is
      const rockPx = await pm.evaluate((a) => window.__scene.bodyPixelSize(a), mi.a);
      const ks = Math.min(1, rockPx / 22.6), RIM = 22 * ks, CORE = 12 * ks, STEP = Math.max(4, Math.round(10 * ks));
      const pts = [];
      for (let y = Math.ceil((c.clientY - RIM) / STEP) * STEP; y <= c.clientY + RIM; y += STEP) {
        for (let x = Math.ceil((c.clientX - RIM) / STEP) * STEP; x <= c.clientX + RIM; x += STEP) { const r = Math.hypot(x - c.clientX, y - c.clientY); if (r <= RIM) pts.push([x, y, r]); }
      }
      const tally = {core: [0, 0], rim: [0, 0], ppu: Math.round(ppu)}; // [tips, canvas points]
      for (const [x, y, r] of pts) {
        if (!(await pm.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!e && e.tagName === 'CANVAS'; }, [x, y]))) continue;
        const t = tally[r <= CORE ? 'core' : 'rim']; t[1]++;
        await pm.mouse.move(x, y); await sleep(60);
        const h = await pm.evaluate(() => window.__hov);
        if (h && h.type === 'body' && h.id === mi.a) t[0]++;
      }
      check('deep link ?system=<Evernat>: the Evernat system view is open (5 s minimum, 15 s cap)', view === 'Evernat', {view, msSinceLoad: openedBy});
      check(`Miiruvuki after the deep link: the 10 px sweep over the drawn rock's RIM (12-22 px) gives the rock's tip on most canvas points (${tally.rim[0]}/${tally.rim[1]})`,
        tally.rim[1] >= 3 && tally.rim[0] / tally.rim[1] >= 0.5, {...tally, of: pts.length, centre: [Math.round(c.clientX), Math.round(c.clientY)]});
      check(`Miiruvuki after the deep link: its core (<= 12 px) gives the tip too (${tally.core[0]}/${tally.core[1]})`, tally.core[1] === 0 || tally.core[0] >= 1, tally.core);
      // a pointer moving over the map holds off the idle auto-orbit (it carried the bodies out from under the sweep);
      // performance.now is offset so "13 s idle" takes no wall time. Positive control: with no movement it does start.
      const orbit = await pm.evaluate(async () => {
        const s = window.__scene, real = performance.now.bind(performance), cv = document.querySelector('#c4Map canvas'), r = cv.getBoundingClientRect();
        let off = 0; performance.now = () => real() + off;
        const frames = async (n) => { const f0 = s.getStats().frames; while (s.getStats().frames < f0 + n) await new Promise((ok) => setTimeout(ok, 16)); };
        try {
          // task #56: inside the open system view the idle auto-orbit never starts (owner: "looking at a surrounding")
          off += 13000; await frames(5);
          const inView = s.getStats().autoRotating;
          // ... so the pointer rule is tested in the galaxy: leave the view first
          s.focusSystem(null);
          while (s.getStats().flying || s.getStats().systemView) await new Promise((ok) => setTimeout(ok, 30));
          const moves = [];
          for (let i = 0; i < 4; i++) { off += 4000; cv.dispatchEvent(new PointerEvent('pointermove', {clientX: r.left + 300 + i * 5, clientY: r.top + 300, bubbles: true})); await frames(3); moves.push(s.getStats().autoRotating); }
          off += 13000; await frames(5);
          return {inView, whileMoving: moves, idle13: s.getStats().autoRotating};
        } finally { performance.now = real; }
      });
      check('task #56: 13 s idle inside the open system view, the auto-orbit stays OFF', orbit.inView === false, orbit.inView);
      check('a pointer moving over the map (16 s, every 4 s) keeps the idle auto-orbit OFF', orbit.whileMoving.every((v) => v === false), orbit.whileMoving);
      check('positive control: 13 s with no pointer movement (galaxy), the idle auto-orbit starts', orbit.idle13 === true, orbit.idle13);
      await pm.close();
    } catch (e) { check('Miiruvuki deep-link sweep drive completed without throwing', false, String(e && e.message || e).slice(0, 160)); }

    // ---------------- ship silhouettes (task #22)
    try {
      const atlas = JSON.parse(fs.readFileSync(path.join(ROOT, 'Images/ships/silhouettes/atlas.json'), 'utf8'));
      // the resolve rule re-implemented here from atlas.json's own text, not through model.js
      const expectCell = (flag, size) => {
        let slug = Object.prototype.hasOwnProperty.call(atlas.configToSlug, flag) ? atlas.configToSlug[flag] : undefined;
        if (slug && atlas.aliases[slug]) slug = atlas.aliases[slug];
        if (slug && atlas.entries[slug] !== undefined) return atlas.entries[slug];
        return atlas.sizeClass[size] !== undefined ? atlas.sizeClass[size] : atlas.sizeClass[atlas.fallbackClass];
      };
      const page5 = await browser.newPage({viewport: {width: 1600, height: 900}});
      await page5.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html?reduced=1`);
      await page5.waitForFunction(() => window.scene && window.scene.getStats().frames > 10 && window.scene.getStats().ships && window.scene.getStats().ships.atlas, null, {timeout: 30000});
      const cells = await page5.evaluate(() => window.latest.fleets.map((f) => [f.flag, f.flagSize, window.scene.fleetCell(f.a)]));
      const bad = cells.filter(([fl, sz, c]) => c !== expectCell(fl, sz));
      const direct = cells.find(([fl]) => atlas.configToSlug[fl] && atlas.entries[atlas.configToSlug[fl]] !== undefined);
      const rejected = cells.find(([fl]) => Object.prototype.hasOwnProperty.call(atlas.configToSlug, fl) && atlas.configToSlug[fl] === null);
      check(`every fleet's silhouette cell = atlas.json resolve rule (${cells.length} fleets; direct slug, rejected-by-size and unmapped all covered)`,
        bad.length === 0 && !!direct && !!rejected && cells.some(([fl]) => !Object.prototype.hasOwnProperty.call(atlas.configToSlug, fl) || atlas.configToSlug[fl] === null),
        {bad: bad.slice(0, 3), direct: direct && direct.slice(0, 3), rejected: rejected && rejected.slice(0, 3)});
      // task #23: hulls are world-sized and sub-pixel at the overview, so NOTHING is drawn for them there: the pixels at
      // fleet positions are the same with the fleets layer on and off
      await page5.evaluate(() => { document.getElementById('bar').style.display = 'none'; for (const l of window.C4Scene.layers) window.scene.setLayer(l, l === 'fleets'); });
      await sleep(500);
      // the LARGEST hulls (capital, commander, titan): at the home view they used to draw as 1.5-2.6 px specks; since #26
      // nothing under 2.5 px is drawn, so at home ZERO hull pixels change when the fleets layer toggles
      const probe = await page5.evaluate(() => window.latest.fleets.filter((f) => (f.s.kind === 'idle' || f.s.kind === 'docked') && ['capital', 'commander', 'titan'].includes(f.flagSize)).slice(0, 60)
        .map((f) => window.scene.fleetScreen(f.a)).filter((p) => p && p.visible).map((p) => [Math.round(p.clientX), Math.round(p.clientY)]));
      const lumsAt = async (pg, pts) => {
        const b64 = (await pg.screenshot()).toString('base64');
        return pg.evaluate(async ({d, pts}) => {
          const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
          const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
          return pts.map(([x, y]) => { const p = g.getImageData(x - 2, y - 2, 5, 5).data; let s = 0; for (let i = 0; i < p.length; i += 4) s += 0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2]; return s / 25; });
        }, {d: b64, pts});
      };
      const on5 = await lumsAt(page5, probe);
      await page5.evaluate(() => window.scene.setLayer('fleets', false)); await sleep(400);
      const off5 = await lumsAt(page5, probe);
      // per-position |on - off|: a few positions pick up a NEIGHBOUR (a moving fleet's trail, a capital speck) in the
      // 5x5 window, so judge by the median and the share of unchanged positions, not the mean
      const absD = on5.map((v, i) => Math.abs(v - off5[i])), medD = absD.slice().sort((a, b) => a - b)[absD.length >> 1];
      const quiet = absD.filter((d) => d < 2).length / Math.max(1, absD.length);
      check(`overview: no hull pixels at home - ${probe.length} capital/commander/titan positions unchanged by the fleets layer (median |diff| < 0.5, >= 80% within 2)`,
        probe.length > 20 && medD < 0.5 && quiet >= 0.8, {median: +medD.toFixed(2), quietShare: +quiet.toFixed(2), n: probe.length, top: absD.slice().sort((a, b) => b - a).slice(0, 5).map((d) => +d.toFixed(1))});
      await page5.close();

      // world-proportional: an isolated titan's fleet-layer energy at camera 40 vs 80 ~ 4x (area ~ 1/dist^2); a
      // zoom-compensated glyph would stay near 1-2x
      // v10: a fleet at a system is drawn inside that system's layout, so the titan is isolated by its DRAWN position
      // (fleetScreen x, y: no other fleet within 1.2 x WORLD.K); camera distances are the pre-v10 ones x WORLD.K
      const K = 0.032;
      const page7 = await browser.newPage({viewport: {width: 1600, height: 900}});
      await page7.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html?reduced=1&nobodies=1`);
      await page7.waitForFunction(() => window.scene && window.scene.getStats().frames > 10 && window.scene.getStats().ships && window.scene.getStats().ships.atlas, null, {timeout: 30000});
      const titan = await page7.evaluate((K) => {
        const pos = window.latest.fleets.map((f) => { const p = window.scene.fleetScreen(f.a); return {f, x: p.x, y: p.y}; });
        const t = pos.filter((o) => o.f.flagSize === 'titan' && ['idle', 'docked', 'respawn'].includes(o.f.s.kind))
          .find((o) => pos.every((q) => q === o || Math.hypot(q.x - o.x, q.y - o.y) > 1.2 * K));
        return t ? {a: t.f.a, n: t.f.n, flag: t.f.flag, x: t.x, y: t.y} : null;
      }, K);
      check('found an isolated titan to measure world-proportional size with', !!titan, titan && titan.n);
      if (titan) {
        await page7.evaluate(() => { document.getElementById('bar').style.display = 'none'; for (const l of window.C4Scene.layers) window.scene.setLayer(l, l === 'fleets'); });
        const energyAt = async (zoom) => {
          await page7.evaluate(({f, z}) => { window.scene.setLayer('fleets', true); window.scene.focusPoint(f.x, f.y, z); }, {f: titan, z: zoom});
          await sleep(500);
          const p = await page7.evaluate((a) => window.scene.fleetScreen(a), titan.a);
          const box = {x: Math.round(p.clientX) - 30, y: Math.round(p.clientY) - 30, width: 60, height: 60};
          const sum = async () => { const d = (await page7.screenshot({clip: box})).toString('base64');
            return page7.evaluate(async (d) => { const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode(); const c = document.createElement('canvas'); c.width = 60; c.height = 60; const g = c.getContext('2d'); g.drawImage(img, 0, 0); const px = g.getImageData(0, 0, 60, 60).data; const a = []; for (let i = 0; i < px.length; i += 4) a.push(0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]); return a; }, d); };
          const on = await sum();
          await page7.evaluate(() => window.scene.setLayer('fleets', false)); await sleep(300);
          const off = await sum();
          // extent = hull length: the connected blob of pixels the fleet layer lit (on - off > 25) that contains the
          // hottest pixel within 6 px of the centre (other fleets elsewhere in the crop are not counted)
          const lit = (i) => on[i] - off[i] > 25;
          let seed = -1, best = 0;
          for (let y = 24; y <= 36; y++) for (let x = 24; x <= 36; x++) { const i = y * 60 + x, d = on[i] - off[i]; if (d > best) { best = d; seed = i; } }
          const hot = [];
          if (seed >= 0 && lit(seed)) {
            const seen = new Set([seed]), q = [seed];
            while (q.length) {
              const i = q.pop(), x = i % 60, y = Math.floor(i / 60); hot.push([x, y]);
              for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                const nx = x + dx, ny = y + dy, j = ny * 60 + nx;
                if (nx >= 0 && ny >= 0 && nx < 60 && ny < 60 && !seen.has(j) && lit(j)) { seen.add(j); q.push(j); }
              }
            }
          }
          let ext = 0; for (let a = 0; a < hot.length; a++) for (let b = a + 1; b < hot.length; b++) ext = Math.max(ext, Math.hypot(hot[a][0] - hot[b][0], hot[a][1] - hot[b][1]));
          return {e: on.reduce((s, v, i) => s + Math.max(0, v - off[i]), 0), ext};
        };
        const r40 = await energyAt(HOME_DIST / (10 * K)), r80 = await energyAt(HOME_DIST / (20 * K)), e40 = r40.e, e80 = r80.e; // both well above the fade band
        check('world-proportional hulls: halving the camera distance (20 K -> 10 K) makes a titan ~4x the area (ratio 2.6-6.5)', e80 > 0 && e40 / e80 >= 2.6 && e40 / e80 <= 6.5,
          {e40: Math.round(e40), e80: Math.round(e80), ratio: +(e40 / Math.max(1, e80)).toFixed(2), ship: titan.flag});
        // absolute world scale: at camera 40 the titan's hull length on screen = its world length projected
        // (0.06 x 1.75 x 2 units x ~29.3 px/unit x 0.92 fill ~ 5.7 px); a zoom-compensated glyph is several times longer
        const MM2 = await import('data:text/javascript,' + encodeURIComponent(fs.readFileSync(path.join(ROOT, 'C4Live/scene-src/model.js'), 'utf8')));
        const pxPerUnit40 = 900 / (2 * 10 * K * Math.tan(42 * Math.PI / 360));
        const expectLen = MM2.SHIP_BASE.galaxy * MM2.sizeScale('titan') * 2 * pxPerUnit40 * 0.92;
        check(`world-scale hulls: a titan at camera 10 K is ~${expectLen.toFixed(1)} px long on screen (measured within 0.5x-1.8x)`, r40.ext >= expectLen * 0.5 && r40.ext <= expectLen * 1.8,
          {measuredPx: +r40.ext.toFixed(1), expectedPx: +expectLen.toFixed(1)});
      }
      await page7.close();

      // heading: an elongated subwarp silhouette 1 s after departure (trail ~0 long), only the fleets layer on
      const MT = await import('data:text/javascript,' + encodeURIComponent(fs.readFileSync(path.join(ROOT, 'C4Live/scene-src/model.js'), 'utf8')));
      const LONG = new Set(['pearce-t1', 'opal-jet', 'fimbul-byos-tankship', 'ogrika-sunpaa', 'pearce-x4', 'fimbul-byos-packlite', 'rainbow-om', 'rainbow-chi', 'ogrika-thripid'].map((s) => atlas.entries[s]));
      const lane = latest.fleets.filter((f) => f.s.kind === 'subwarp' && f.s.from && f.s.to && f.s.arrives - f.s.departs > 200 && LONG.has(expectCell(f.flag, f.flagSize))
        && Math.hypot(f.s.to[0] - f.s.from[0], f.s.to[1] - f.s.from[1]) > 0.3)
        // no OTHER transit's trail within 0.4 of this fleet at the pinned time (departs + 1): with world-scale hulls a
        // neighbour's trail crossing the hull merged into the measured blob
        .filter((f) => {
          const t0 = f.s.departs + 1, P = f.s.from;
          return latest.fleets.every((g) => {
            if (g === f || !(g.s.kind === 'warp' || g.s.kind === 'subwarp') || !g.s.to || !(g.s.departs < t0 && g.s.arrives + 120 > t0)) return true;
            const from = g.s.from || [g.x, g.y], dx = g.s.to[0] - from[0], dy = g.s.to[1] - from[1], L = Math.hypot(dx, dy) || 1;
            const pr = Math.min(1, Math.max(0, (t0 - g.s.departs) / Math.max(1, g.s.arrives - g.s.departs)));
            const hx = from[0] + dx * pr, hy = from[1] + dy * pr, tl = Math.min(L * pr, MT.trailLen(g.s.kind, g.flagSize)); // task #51: was 7 / 3.5 map units
            const ax = hx - dx / L * tl, ay = hy - dy / L * tl; // trail segment a -> h
            const sx = hx - ax, sy = hy - ay, s2 = sx * sx + sy * sy || 1, u = Math.max(0, Math.min(1, ((P[0] - ax) * sx + (P[1] - ay) * sy) / s2));
            return Math.hypot(P[0] - (ax + sx * u), P[1] - (ay + sy * u)) > 0.4;
          });
        })
        // world-scale hulls (#23): take the longest hull available so the axis has pixels to measure
        .sort((a, b) => ['xx-small', 'x-small', 'small', 'medium', 'large', 'capital', 'commander', 'titan'].indexOf(b.flagSize)
          - ['xx-small', 'x-small', 'small', 'medium', 'large', 'capital', 'commander', 'titan'].indexOf(a.flagSize))[0];
      check('found an elongated in-flight subwarp silhouette to test heading with', !!lane, lane && [lane.n, lane.flag]);
      if (lane) {
        const page6 = await browser.newPage({viewport: {width: 1600, height: 900}});
        await page6.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html?reduced=1&nobodies=1&replay=1&speed=0&t0=${lane.s.departs + 1}`); // clock frozen 1 s after departure
        await page6.waitForFunction(() => window.scene && window.scene.getStats().frames > 10 && window.scene.getStats().ships && window.scene.getStats().ships.atlas, null, {timeout: 30000});
        await page6.evaluate(() => { document.getElementById('bar').style.display = 'none'; for (const l of window.C4Scene.layers) window.scene.setLayer(l, l === 'fleets'); });
        // world-sized hulls are small: get close (camera ~3) so the silhouette has enough pixels for an axis
        await page6.evaluate((f) => { window.scene.setFilter({states: ['subwarp']}); window.scene.focusPoint(f.s.from[0], f.s.from[1], 1600); }, lane); // camera 0.08 (pre-v10 2.5 x K); other states dimmed to 6% (no focus ring)
        await sleep(600);
        const g = await page6.evaluate((f) => ({p: window.scene.fleetScreen(f.a), a: window.scene.screenOf(f.s.from[0], f.s.from[1]), b: window.scene.screenOf(f.s.to[0], f.s.to[1])}), lane);
        const R = 40, box = {x: Math.round(g.p.clientX) - R, y: Math.round(g.p.clientY) - R, width: 2 * R, height: 2 * R};
        await page6.screenshot({path: path.join(shots, 'c4-silhouette-heading.png'), clip: box});
        const b64 = (await page6.screenshot({clip: box})).toString('base64');
        const axis = await page6.evaluate(async ({d, R}) => {
          const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
          const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
          const px = x.getImageData(0, 0, c.width, c.height).data;
          // only the connected blob of lit pixels at the fleet's centre: with world-scale hulls another fleet's trail
          // crossing the crop can outweigh the hull (it did: an 84 deg "error" that was a neighbour's trail)
          const Wd = c.width, lum = (i, j) => { const k = (j * Wd + i) * 4; return 0.2126 * px[k] + 0.7152 * px[k + 1] + 0.0722 * px[k + 2]; };
          let seed = null, bestL = 70;
          for (let j = R - 5; j <= R + 5; j++) for (let i = R - 5; i <= R + 5; i++) { const L = lum(i, j); if (L > bestL && L > 120) { bestL = L; seed = [i, j]; } }
          let n = 0, mx = 0, my = 0; const pts = [];
          if (seed) {
            const seen = new Set([seed[1] * Wd + seed[0]]), q = [seed];
            while (q.length) {
              const [i, j] = q.pop(); pts.push([i, j]); mx += i; my += j; n++;
              for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
                const ni = i + di, nj = j + dj, key = nj * Wd + ni;
                if (ni >= 0 && nj >= 0 && ni < Wd && nj < c.height && !seen.has(key) && lum(ni, nj) > 120) { seen.add(key); q.push([ni, nj]); } // hull is bright white; trails are dimmer
              }
            }
          }
          mx /= n; my /= n; let sxx = 0, syy = 0, sxy = 0;
          for (const [i, j] of pts) { sxx += (i - mx) ** 2; syy += (j - my) ** 2; sxy += (i - mx) * (j - my); }
          return {n, ang: 0.5 * Math.atan2(2 * sxy, sxx - syy), elong: (sxx + syy + Math.hypot(sxx - syy, 2 * sxy)) / Math.max(1e-6, sxx + syy - Math.hypot(sxx - syy, 2 * sxy))};
        }, {d: b64, R});
        const head = Math.atan2(g.b.clientY - g.a.clientY, g.b.clientX - g.a.clientX);
        const axisDiff = (u, v) => { let d = Math.abs(u - v) % Math.PI; return Math.min(d, Math.PI - d) * 180 / Math.PI; };
        check('warp-lane silhouette nose axis lies along its from->to heading (principal axis within 15 deg)', axis.n >= 10 && axis.elong > 2 && axisDiff(axis.ang, head) <= 15, // n >= 10: the largest in-flight hull varies with the hourly data (12:41: a small hull, 13 px, elongation 6)
          {px: axis.n, elongation: +axis.elong.toFixed(1), diffDeg: +axisDiff(axis.ang, head).toFixed(1), ship: lane.flag});
        check('NEGATIVE: the same pixels do NOT match the perpendicular of the heading', axisDiff(axis.ang, head + Math.PI / 2) > 45, +axisDiff(axis.ang, head + Math.PI / 2).toFixed(1));
        await page6.close();
      }
    } catch (e) { check('silhouette drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

    // ---------------- task #32 (owner 2026-11-07): mining without circling, miners only near their rock, cursor-gated
    // system entry, in-map stat layers, insets. Each acceptance has a control; OLD_BUNDLE=<pre-#32 bundle> fails them.
    await task32(browser, port, latest, JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/c4-live/events.json'), 'utf8')), bodies);
    // task #38 (scene v3 fix round: owner bars, P1 gate, #36 framing fit, avoid rects, review P3s)
    await task38(browser, port, latest, JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/c4-live/events.json'), 'utf8')), bodies);
    // task #44 (scene v4 polish: late-bodies reframe, callout reach / labels / hierarchy, rings under a column)
    await task44(browser, port, latest, JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/c4-live/events.json'), 'utf8')), bodies);
    // task #50 (scene v5 look: label de-collision, deep-space callout flies, territory as influence, routes, columns)
    await task50(browser, port, latest, JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/c4-live/events.json'), 'utf8')), bodies);
    // task #51 (scene v6: short world-scale trails, collapsed at home, off for filtered fleets, 5,000-transit load)
    await task51(browser, port, latest);
    // task #53 (DAC influence layer: setDacs, setStatLayer('dacs'), focusDac; one rule with the panels)
    await task53(browser, port, latest);
    // task #55 (DAC conquest lens: setDacs({lens}), dacConquest one rule with the panels, focusDac avoid rects)
    await task55(browser, port, latest, JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/c4-live/events.json'), 'utf8')));
    // task #58 + #57 (conquest as soft territory; combat rings only on the Combat tab; scene v8)
    await task58(browser, port, latest);
    // v10 (one continuous world: continuity, coexistence, scale, picking, depth, fps, systemView hysteresis) + the #56 starfield rule
    await task56stars(browser, port, latest);
    await taskV10(browser, port, latest, bodies);

    // dispose cleans up
    const disp = await page.evaluate(() => { window.scene.dispose(); return document.querySelectorAll('#map canvas').length; });
    check('dispose removes the canvas', disp === 0, disp);
    const unexpected = errors.filter((e) => !/^C4Scene\.setData: latest\.json shape not recognised/.test(e)); // that one is the negative test above
    check('no page errors during the drive (except the deliberate malformed setData)', unexpected.length === 0 && errors.length - unexpected.length === 1, errors.slice(0, 5));
    console.log('INFO  screenshots in ' + shots);
  } finally {
    await browser.close();
    server.close();
  }
}

// ---------------- task #32 browser checks
async function task32(browser, port, latest, events, bodies) {
  const errs = [];
  const open = async (query) => {
    const pg = await browser.newPage({viewport: {width: 1600, height: 900}});
    pg.on('pageerror', (e) => errs.push(String(e)));
    pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await pg.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html${query}`);
    await pg.waitForFunction(() => window.scene && window.scene.getStats().frames > 20 && window.bodies && window.scene.getStats().ships && window.scene.getStats().ships.atlas, null, {timeout: 30000});
    await pg.evaluate(() => { document.getElementById('bar').style.display = 'none'; window.noFocusOnPick = true; });
    return pg;
  };
  // pixels of a clip as an array (r,g,b,a...), and how many differ by > 36 (sum of channels) between two grabs
  const grab = async (pg, box) => { const d = (await pg.screenshot({clip: box})).toString('base64');
    return pg.evaluate(async (d) => { const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return Array.from(g.getImageData(0, 0, c.width, c.height).data); }, d); };
  const changed = (a, b) => { let n = 0; for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 36) n++; return n; };
  const boxAt = (x, y, w, h) => ({x: Math.max(0, Math.round(x - w / 2)), y: Math.max(0, Math.round(y - h / 2)), width: w, height: h});
  const sysN = (n) => latest.systems.find((s) => s.n === n);
  const serene = sysN('Serene');
  const astSys = new Map(latest.asteroids.map((a) => [a.a, a.sys]));
  const miningSys = new Map();
  for (const f of latest.fleets) if (f.s.kind === 'mining' && astSys.has(f.s.asteroid)) {
    const k = astSys.get(f.s.asteroid), w = miningSys.get(k) || {ups: 0, n: 0}; w.ups += f.mine.out.reduce((a, o) => a + o.ups, 0); w.n++; miningSys.set(k, w);
  }

  // (1) galaxy: no circling. Every mining fleet's drawn position IS its asteroid, now and 2 s later (old: 0.75-1.45 off, turning)
  try {
    const pg = await browser.newPage({viewport: {width: 1600, height: 900}});
    pg.on('pageerror', (e) => errs.push(String(e)));
    await pg.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html?nobodies=1`);
    await pg.waitForFunction(() => window.scene && window.scene.getStats().frames > 30, null, {timeout: 30000});
    const snap = () => pg.evaluate(() => { const ast = new Map(window.latest.asteroids.map((a) => [a.a, a]));
      return window.latest.fleets.filter((f) => f.s.kind === 'mining').map((f) => { const p = window.scene.fleetScreen(f.a), a = ast.get(f.s.asteroid); return Math.hypot(p.x - a.x, p.y - a.y); }); });
    const s0 = await snap(); await sleep(2000); const s1 = await snap();
    const worst = Math.max(...s0, ...s1);
    check(`galaxy view: all ${s0.length} mining fleets sit exactly on their asteroid at t and t+2 s (no orbit; was 0.75-1.45 units, turning)`, s0.length > 300 && worst < 1e-6, {worst});
    // task #55 (owner 16:28 EST "the bars show miners any way, we can remove the rings"): no galaxy mining indicator at all
    const st = await pg.evaluate(() => ({st: window.scene.getStats(), probe: typeof window.scene.miningIndicator}));
    check(`#55 galaxy view: no mining indicators (getStats().miningIndicators and scene.miningIndicator are gone; ${miningSys.size} systems have live mining)`,
      !('miningIndicators' in st.st) && st.probe === 'undefined' && miningSys.size > 5, {miningIndicators: st.st.miningIndicators, probe: st.probe});
    await pg.close();
  } catch (e) { check('task #32 galaxy-mining drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (2) mining indicator pixels: frozen frame, only the Mining layer; the busiest mining system's surroundings change with
  // the layer, an isolated system with NO mining does not (negative)
  try {
    const pg = await open('?reduced=1');
    await pg.evaluate(() => { for (const l of window.C4Scene.layers) window.scene.setLayer(l, l === 'mining'); });
    await sleep(400);
    const busiest = latest.systems.find((s) => s.a === [...miningSys].sort((a, b) => b[1].ups - a[1].ups)[0][0]);
    const mineXY = latest.systems.filter((s) => miningSys.has(s.a));
    const quiet = latest.systems.filter((s) => !miningSys.has(s.a) && mineXY.every((m) => Math.hypot(m.x - s.x, m.y - s.y) > 12)).sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y))[0];
    const pb = await pg.evaluate((s) => window.scene.screenOf(s.x, s.y), busiest), pq = await pg.evaluate((s) => window.scene.screenOf(s.x, s.y), quiet);
    const bb = boxAt(pb.clientX, pb.clientY, 90, 90), bq = boxAt(pq.clientX, pq.clientY, 90, 90);
    const on = [await grab(pg, bb), await grab(pg, bq)];
    await pg.evaluate(() => window.scene.setLayer('mining', false)); await sleep(300);
    const off = [await grab(pg, bb), await grab(pg, bq)];
    const dB = changed(on[0], off[0]), dQ = changed(on[1], off[1]);
    // positive control: the same box DOES see the systems layer (it is not blind)
    await pg.evaluate(() => window.scene.setLayer('systems', true)); await sleep(300);
    const sysOn = await grab(pg, bb), dS = changed(sysOn, off[0]);
    check(`#55 no mining ring: round ${busiest.n} (busiest, ${miningSys.get(busiest.a).ups.toFixed(0)} u/s) the Mining layer, with no stat layer, draws 0 ring pixels (${dB} px change; the #53 bundle drew > 150)`, dB < 5, {changedPx: dB});
    check(`#55 positive control: the same box sees the Systems layer (${dS} px change)`, dS > 30, {changedPx: dS});
    check(`control: nothing round ${quiet.n} (no live mining) changes with the Mining layer either`, dQ < 5, {changedPx: dQ});
    await pg.close();
  } catch (e) { check('task #32 indicator-pixel drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (3) miners show by their own size (v10: the camera-distance proximity fade is gone). At the focusSystem framing each
  // Serene miner's drawn share (fleetScreen.shown) is exactly its HULL_PX fade (0 under 0.75 px, 1 from 1.5 px) and the
  // worked rock carries its indicator (Mining off hides it: pixels change); zoomed onto the rock (camera 0.1 = the pre-v10
  // 3 x WORLD.K) every miner is drawn (>= 1.5 px), the largest >= 4 px, all within 1.4 R of the rock centre, and the Mining
  // switch changes many pixels (positive control)
  try {
    const pg = await open('?reduced=1');
    await pg.evaluate((a) => window.scene.focusSystem(a), serene.a);
    await pg.waitForFunction((a) => { const v = window.scene.getStats().systemView; return v && v.sys === a && v.fade > 0.99; }, serene.a, {timeout: 15000});
    await sleep(300);
    const seMiners = latest.fleets.filter((f) => f.s.kind === 'mining' && bodies.some((b) => b.a === f.s.asteroid && b.sys === serene.a));
    const rockId = seMiners[0].s.asteroid;
    const sh0 = await pg.evaluate((ms) => ms.map((a) => ({px: window.scene.fleetPixelSize(a), shown: window.scene.fleetScreen(a).shown})), seMiners.map((f) => f.a));
    const fadeOf = (px) => Math.min(1, Math.max(0, (px - 0.75) / 0.75));
    const badShown = sh0.filter((o) => Math.abs(o.shown - fadeOf(o.px)) > 1e-6);
    const sv0 = await pg.evaluate(() => window.scene.getStats().systemView);
    const rk0 = await pg.evaluate((a) => window.scene.bodyScreen(a), rockId);
    const box0 = boxAt(rk0.clientX, rk0.clientY, 160, 160);
    const a0 = await grab(pg, box0);
    await pg.evaluate(() => window.scene.setLayer('mining', false)); await sleep(250);
    const a1 = await grab(pg, box0);
    const ringOff = await pg.evaluate(() => window.scene.getStats().systemView.worked.map((w) => w.ring));
    await pg.evaluate(() => window.scene.setLayer('mining', true)); await sleep(250);
    const w0 = (sv0.worked || []).find((w) => w.id === rockId);
    check(`v10 system framing (Serene): each of ${seMiners.length} miners is drawn by its own size (shown = its HULL_PX fade; px ${Math.min(...sh0.map((o) => o.px)).toFixed(2)}-${Math.max(...sh0.map((o) => o.px)).toFixed(2)})`,
      seMiners.length > 50 && badShown.length === 0, {bad: badShown.slice(0, 3)});
    // task #38 P3-3: the Mining switch hides the worked-rock ring too, so pixels DO change at the rock
    check('system framing: the worked rock carries the indicator (worked list = the rock, its miner count); Mining off hides it (P3-3, pixels change, ring false)',
      w0 && w0.miners === seMiners.length && w0.ring === true && changed(a0, a1) > 30 && ringOff.every((v) => v === false), {changedPx: changed(a0, a1), ringOff, worked: (sv0.worked || []).map((w) => [w.name, w.miners])});
    await pg.evaluate((p) => window.scene.focusPoint(p.x, p.y, 1312), rk0); await sleep(500);
    const sv1 = await pg.evaluate(() => window.scene.getStats().systemView);
    const geo = await pg.evaluate(({ms, rock}) => { const r = window.scene.bodyScreen(rock);
      return ms.map((a) => { const f = window.scene.fleetScreen(a); return {d: Math.hypot(f.x - r.x, f.y - r.y), px: window.scene.fleetPixelSize(a), shown: f.shown}; }); }, {ms: seMiners.map((f) => f.a), rock: rockId});
    const R = 0.16 * sv1.scale, maxR = Math.max(...geo.map((g) => g.d)) / R;
    const rk1 = await pg.evaluate((a) => window.scene.bodyScreen(a), rockId);
    const box1 = boxAt(rk1.clientX, rk1.clientY, 260, 260);
    const b0 = await grab(pg, box1);
    await pg.evaluate(() => window.scene.setLayer('mining', false)); await sleep(250);
    const b1 = await grab(pg, box1);
    await pg.evaluate(() => window.scene.setLayer('mining', true));
    check(`zoomed onto the rock (camera ${(128 / 1312).toFixed(3)}): every miner is drawn (shown 1, >= 1.5 px), the largest >= 4 px, all within 1.4 R of the rock centre`,
      geo.every((g) => g.shown === 1) && Math.max(...geo.map((g) => g.px)) >= 4 && maxR <= 1.4, {maxRadii: +maxR.toFixed(3), minPx: +Math.min(...geo.map((g) => g.px)).toFixed(2), maxPx: +Math.max(...geo.map((g) => g.px)).toFixed(1)});
    check('positive control: close on the rock the Mining switch changes many pixels (hulls + beams)', changed(b0, b1) > 200, {changedPx: changed(b0, b1)});
    await pg.close();
  } catch (e) { check('task #32 system-view miner drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (4) entry gate: the camera centred on an isolated system, the pointer on EMPTY map 2.2 units east of it: wheeling in must
  // never open a view (the pre-#32 code fell back to the system nearest the orbit target and opened it); then the pointer
  // ON the system opens exactly that system
  try {
    const iso = latest.systems.filter((s) => latest.systems.every((t) => t === s || Math.hypot(t.x - s.x, t.y - s.y) > 3.2) && bodies.some((b) => b.sys === s.a))
      .sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y))[0];
    const G = [iso.x + 2.2, iso.y];
    const pg = await open('');
    await sleep(2800); // intro fly-in
    await pg.evaluate((s) => window.scene.focusPoint(s.x, s.y, 10), iso);
    await sleep(2000);
    const pG = await pg.evaluate((g) => window.scene.screenOf(g[0], g[1]), G), pS = await pg.evaluate((s) => window.scene.screenOf(s.x, s.y), iso);
    await pg.mouse.move(pG.clientX, pG.clientY);
    let opened = null;
    for (let k = 0; k < 30 && !opened; k++) { await pg.mouse.wheel(0, -240); await sleep(120); opened = await pg.evaluate(() => { const v = window.scene.getStats().systemView; return v ? v.name : null; }); }
    await sleep(800);
    opened = opened || await pg.evaluate(() => { const v = window.scene.getStats().systemView; return v ? v.name : null; });
    check(`entry gate: wheeling in with the cursor on empty map ${Math.round(Math.hypot(pG.clientX - pS.clientX, pG.clientY - pS.clientY))} px from ${iso.n} (camera centred on it) opens NO system`,
      opened === null, {opened, events: await pg.evaluate(() => window.sysEvents.map((e) => e && e.name))});
    await pg.evaluate((s) => window.scene.focusPoint(s.x, s.y, 10), iso);
    await sleep(2000);
    const pS2 = await pg.evaluate((s) => window.scene.screenOf(s.x, s.y), iso);
    await pg.mouse.move(pS2.clientX + 6, pS2.clientY + 4); // "on the system or super close to it"
    for (let k = 0; k < 30 && !opened; k++) { await pg.mouse.wheel(0, -240); await sleep(120); opened = await pg.evaluate(() => { const v = window.scene.getStats().systemView; return v ? v.name : null; }); }
    check(`entry gate positive control: the cursor 7 px from ${iso.n}, wheeling in opens ${iso.n}'s view`, opened === iso.n, {opened});
    await pg.close();
  } catch (e) { check('task #32 entry-gate drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (5) stat layers: numbers from the data, pixels drawn and removed, callouts clickable, frozen under reduced motion,
  // faded out in the system view
  try {
    const pg = await open('?reduced=1');
    const top6 = [...miningSys].sort((a, b) => b[1].ups - a[1].ups).slice(0, 6);
    const busiest = latest.systems.find((s) => s.a === top6[0][0]);
    const pb = await pg.evaluate((s) => window.scene.screenOf(s.x, s.y), busiest);
    const colBox = boxAt(pb.clientX, pb.clientY - 70, 70, 150);
    const shotOff = await grab(pg, colBox);
    check('NEGATIVE: setStatLayer rejects an unknown name', await pg.evaluate(() => window.scene.setStatLayer('bogus') === false));
    check('setStatLayer("mining") returns true', await pg.evaluate(() => window.scene.setStatLayer('mining') === true));
    await sleep(400);
    const sl = await pg.evaluate(() => window.scene.getStats().statLayer);
    check(`stat "mining": ${miningSys.size} columns; the 6 callouts are the 6 busiest systems with their live u/s and miner count`,
      sl.columns === miningSys.size && sl.callouts.length === 6 && sl.callouts.every((c, i) => c.sys === top6[i][0] && Math.abs(c.v - top6[i][1].ups) < 1e-6 && c.line.includes(top6[i][1].n + ' miner')),
      sl.callouts.map((c) => [c.name, c.line]));
    const shotOn = await grab(pg, colBox), shotOn2 = await grab(pg, colBox);
    check(`stat "mining": the column over ${busiest.n} is drawn (pixels above it change vs off)`, changed(shotOff, shotOn) > 150, {changedPx: changed(shotOff, shotOn)});
    check('reduced motion: the stat layer is frozen (two grabs identical)', changed(shotOn, shotOn2) === 0, changed(shotOn, shotOn2));
    // click the busiest system's callout -> pick {type:'system', id}
    await pg.evaluate(() => { window.lastPick = null; });
    const cb = await pg.evaluate((a) => { const el = document.querySelector(`.c4-stat-layer [data-sys="${a}"]`); if (!el) return null; const r = el.getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2}; }, busiest.a);
    if (cb) { await pg.mouse.click(cb.x, cb.y); await sleep(200); }
    const pk = await pg.evaluate(() => window.lastPick);
    check(`clicking the ${busiest.n} callout emits pick {type:'system', id, source:'callout'}`, !!cb && pk && pk.type === 'system' && pk.id === busiest.a && pk.source === 'callout', pk);
    // owners with a focused owner = that owner's footprint
    const topOwner = latest.owners.slice().sort((a, b) => b.fleets - a.fleets)[0].p;
    await pg.evaluate((p) => { window.scene.setFilter({owner: p}); window.scene.setStatLayer('owners'); }, topOwner);
    await sleep(300);
    const so = await pg.evaluate(() => window.scene.getStats().statLayer);
    const MM = await import('data:text/javascript,' + encodeURIComponent(fs.readFileSync(path.join(ROOT, 'C4Live/scene-src/model.js'), 'utf8')));
    check('stat "owners" with a focused owner shows exactly their footprint columns', so.name === 'owners' && so.columns === MM.statColumns('owners', latest, events, {owner: topOwner}).length && so.columns > 0, so.columns);
    await pg.evaluate(() => { window.scene.setFilter({owner: null}); window.scene.setStatLayer('combat'); });
    await sleep(300);
    const sc = await pg.evaluate(() => window.scene.getStats().statLayer);
    check('stat "combat": one column per 24 h hot spot', sc.columns === M_hot(MM, events, latest).length && sc.columns > 0, sc.columns);
    // off again: columns and callouts gone, pixels back to the off frame
    await pg.evaluate(() => window.scene.setStatLayer(null)); await sleep(400);
    const s0 = await pg.evaluate(() => window.scene.getStats().statLayer);
    const shotBack = await grab(pg, colBox);
    check('setStatLayer(null): no columns, no callouts, pixels back to the off frame', s0.name === null && s0.columns === 0 && s0.callouts.length === 0 && changed(shotOff, shotBack) < 5,
      {columns: s0.columns, changedPx: changed(shotOff, shotBack), domCallouts: await pg.evaluate(() => document.querySelectorAll('.c4-stat-layer [data-sys]').length)});
    // in a system view the stat layer fades out (callouts hidden)
    await pg.evaluate((a) => { window.scene.setStatLayer('fleets'); window.scene.focusSystem(a); }, serene.a);
    await pg.waitForFunction((a) => { const v = window.scene.getStats().systemView; return v && v.sys === a && v.fade > 0.99; }, serene.a, {timeout: 15000});
    await sleep(200);
    const sf = await pg.evaluate(() => window.scene.getStats().statLayer);
    // task #56 (same pane): the stat layer no longer fades out wholesale; the OPEN system's column is under its orrery, so
    // its callout hides (positive control: that system has a callout in this layer); the others may stay
    check('in a system view the open system\'s own callout is hidden (task #56: the rest of the stat layer stays)',
      sf.columns > 0 && sf.callouts.some((c) => c.sys === serene.a) && sf.callouts.filter((c) => c.sys === serene.a).every((c) => !c.shown), sf.callouts.map((c) => [c.name, c.shown]));
    await pg.close();
  } catch (e) { check('task #32 stat-layer drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (6) insets: a 440 px right dock on a 1600 px canvas - focusSystem centres the system in the uncovered 1160 px
  // (x = 580), screenOf is the true pixel (a hover there picks), and with no inset the same framing is at x = 800 (control)
  try {
    const pg = await open('?reduced=1');
    const ins = await pg.evaluate(() => window.scene.setInsets({right: 440}));
    await pg.evaluate((a) => window.scene.focusSystem(a), serene.a);
    await pg.waitForFunction((a) => { const v = window.scene.getStats().systemView; return v && v.sys === a && v.fade > 0.99; }, serene.a, {timeout: 15000});
    await sleep(300);
    const c1 = await pg.evaluate((s) => window.scene.screenOf(s.x, s.y), serene);
    check('setInsets({right: 440}): focusSystem centres the system in the uncovered 1160 px (x = 580 +- 3)', ins.right === 440 && Math.abs(c1.clientX - 580) <= 3 && !c1.covered, {x: +c1.clientX.toFixed(1), ins});
    const planet = bodies.find((b) => b.sys === serene.a && b.k === 'planet');
    const bp = await pg.evaluate((a) => window.scene.bodyScreen(a), planet.a);
    await pg.mouse.move(bp.clientX + 40, bp.clientY + 40); await sleep(120);
    await pg.mouse.move(bp.clientX, bp.clientY); await sleep(250);
    const hv = await pg.evaluate(() => window.lastHover);
    check('with the inset, bodyScreen is the true pixel: hovering it reports that planet', bp.visible && hv && hv.type === 'body' && hv.id === planet.a, {hover: hv && hv.id === planet.a, at: [Math.round(bp.clientX), Math.round(bp.clientY)]});
    await pg.evaluate(() => window.scene.setInsets({}));
    await sleep(200);
    const c0 = await pg.evaluate((s) => window.scene.screenOf(s.x, s.y), serene);
    check('NEGATIVE/control: insets cleared -> the same framing puts the system at the canvas centre (x = 800 +- 3)', Math.abs(c0.clientX - 800) <= 3, +c0.clientX.toFixed(1));
    await pg.close();
  } catch (e) { check('task #32 insets drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (7) frame budget: JS time per frame (getStats.cpuMs) and fps at home with a stat layer on, and in the Serene view
  try {
    const pg = await open('');
    await sleep(3000);
    await pg.evaluate(() => window.scene.setStatLayer('mining'));
    await sleep(2200);
    const home = await pg.evaluate(() => window.scene.getStats());
    await pg.evaluate((a) => window.scene.focusSystem(a), serene.a);
    await pg.waitForFunction((a) => { const v = window.scene.getStats().systemView; return v && v.sys === a && v.fade > 0.99; }, serene.a, {timeout: 15000});
    await sleep(2200);
    const sys = await pg.evaluate(() => window.scene.getStats());
    console.log(`INFO  frame budget: home + stat layer ${home.fps} fps, ${home.cpuMs} ms JS/frame, ${home.drawCalls} draws; Serene view ${sys.fps} fps, ${sys.cpuMs} ms JS/frame, ${sys.drawCalls} draws`);
    check('frame budget: >= 55 fps and < 8 ms JS per frame at home (stat layer on) and in the Serene view', home.fps >= 55 && sys.fps >= 55 && home.cpuMs < 8 && sys.cpuMs < 8, {home: [home.fps, home.cpuMs], serene: [sys.fps, sys.cpuMs]});
    await pg.close();
  } catch (e) { check('task #32 frame-budget drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  check('task #32 pages: no page errors', errs.length === 0, errs.slice(0, 5));
}
// ---------------- task #38 browser checks (scene v3 fix round; closes #36, #37). OLD_BUNDLE=<v2 bundle> fails them;
// the mutant runs (builder's temp folder, not in the repo) prove each P3-1 check kills its mutant.
async function task38(browser, port, latest, events, bodies) {
  const errs = [];
  const part = (n) => !process.env.T38_PARTS || process.env.T38_PARTS.split(",").includes(String(n)); // T38_PARTS=1,4 runs blocks 1 and 4
  const open = async (query, vp = {width: 1600, height: 900}, ctxOpts) => {
    const ctx = ctxOpts ? await browser.newContext({viewport: vp, ...ctxOpts}) : null;
    const pg = ctx ? await ctx.newPage() : await browser.newPage({viewport: vp});
    pg.on('pageerror', (e) => errs.push(String(e)));
    pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await pg.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html${query}`);
    await pg.waitForFunction(() => window.scene && window.scene.getStats().frames > 20 && window.bodies && window.scene.getStats().ships && window.scene.getStats().ships.atlas, null, {timeout: 30000});
    await pg.evaluate(() => { document.getElementById('bar').style.display = 'none'; window.noFocusOnPick = true; });
    return pg;
  };
  const grab = async (pg, box) => { const d = (await pg.screenshot({clip: box})).toString('base64');
    return pg.evaluate(async (d) => { const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return Array.from(g.getImageData(0, 0, c.width, c.height).data); }, d); };
  const diffMask = (a, b) => { const m = []; for (let i = 0; i < a.length; i += 4) m.push(Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 36 ? 1 : 0); return m; };
  const frames = (pg, n) => pg.evaluate(async (n) => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(() => r())); }, n);
  const sysN = (n) => latest.systems.find((s) => s.n === n);
  const astSys = new Map(latest.asteroids.map((a) => [a.a, a.sys]));
  const miningSys = new Map();
  for (const f of latest.fleets) if (f.s.kind === 'mining' && astSys.has(f.s.asteroid)) { const k = astSys.get(f.s.asteroid); miningSys.set(k, (miningSys.get(k) || 0) + f.mine.out.reduce((a, o) => a + o.ups, 0)); }
  const busiest = latest.systems.find((s) => s.a === [...miningSys].sort((a, b) => b[1] - a[1])[0][0]);
  const viewName = (pg) => pg.evaluate(() => { const v = window.scene.getStats().systemView; return v ? v.name : null; });

  // (1) OWNER #37: thin columns rooted exactly on the system glyph, no footprint ring, no mining ring under a column;
  // mining rings capped so neighbours never pile up at mid zoom
  if (part(1)) try {
    const pg = await open('?reduced=1');
    await pg.evaluate(() => window.scene.setStatLayer('mining')); await frames(pg, 4);
    const roots = await pg.evaluate(() => { const out = []; for (let i = 0; ; i++) { const c = window.scene.statColumnScreen(i); if (!c) break;
      const s = window.latest.systems.find((q) => q.a === c.sys), m = window.scene.screenOf(s.x, s.y, 0);
      out.push({n: s.n, d: Math.hypot(c.base.clientX - m.clientX, c.base.clientY - m.clientY)}); } return out; });
    const worst = Math.max(...roots.map((r) => r.d));
    check(`#37 every mining column (${roots.length}) rises from its system glyph: base vs the glyph centre < 1 px`, roots.length === miningSys.size && worst < 1, {worst: +worst.toFixed(3)});
    // the combat columns too (v2 stood them on the event centroid), at mid zoom where 0.25 units would be many px
    const xi = sysN('Xictarn');
    await pg.evaluate((s) => { window.scene.focusPoint(s.x, s.y, 128 / 14); window.scene.setStatLayer('combat'); }, xi); await frames(pg, 4);
    const croots = await pg.evaluate(() => { const out = []; for (let i = 0; ; i++) { const c = window.scene.statColumnScreen(i); if (!c) break; if (!c.sys) continue;
      const s = window.latest.systems.find((q) => q.a === c.sys), m = window.scene.screenOf(s.x, s.y, 0);
      if (m.visible) out.push({n: s.n, d: Math.hypot(c.base.clientX - m.clientX, c.base.clientY - m.clientY)}); } return out; });
    check(`#37 combat columns on screen at mid zoom (${croots.length}) rise from their system glyph (< 1 px)`, croots.length >= 2 && croots.every((r) => r.d < 1), croots.slice(0, 4).map((r) => [r.n, +r.d.toFixed(2)]));
    // width: changed pixels along one row through the busiest column's middle, layer off vs on, at home
    // territory off for this grab (task #50 dims territory while a stat layer stands, which would count as column pixels)
    await pg.evaluate(() => { window.scene.setLayer("territory", false); window.scene.setStatLayer(null); window.scene.focusPoint(0.5, 0.5, 1); }); await frames(pg, 4);
    await pg.evaluate(() => window.scene.setStatLayer('mining')); await frames(pg, 4);
    const col = await pg.evaluate((a) => { for (let i = 0; ; i++) { const c = window.scene.statColumnScreen(i); if (!c) return null; if (c.sys === a) return c; } }, busiest.a);
    const row = {x: Math.round(col.base.clientX - 60), y: Math.round((col.base.clientY + col.top.clientY) / 2), width: 120, height: 1};
    // the callout overlay is hidden for the grab: this measures the WebGL column (#44 callouts are larger and may cross the row)
    await pg.evaluate(() => { document.querySelector('.c4-stat-layer').style.visibility = 'hidden'; });
    const on = await grab(pg, row);
    await pg.evaluate(() => { document.querySelector('.c4-stat-layer').style.visibility = ''; });
    await pg.evaluate(() => window.scene.setStatLayer(null)); await frames(pg, 4);
    const off = await grab(pg, row);
    const m = diffMask(on, off), lit = m.reduce((a, v) => a + v, 0);
    check(`#37 the ${busiest.n} column is thin: <= 22 lit px (core + glow) across its middle at home (v2: 40 measured with STAT_W 0.85)`, lit >= 3 && lit <= 22, {litPx: lit});
    await pg.evaluate(() => window.scene.setLayer("territory", true));
    // (#37 "no mining ring under a column" and the #38 ring-cap overlap check were DELETED in task #55: the galaxy mining
    // rings are gone - task32 (2) now asserts 0 ring pixels)
    await pg.close();
  } catch (e) { check('task #38 bars drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (2) P1 (v10 meaning: the systemView event = the DOMINANT system, by size and the view centre - there is no entry gate
  // any more): isolated Seldavessa, camera 14, cursor 82 px off, 4 notches -> none; the pointer leaving the canvas changes
  // nothing. Positive control: a programmatic fly there, close enough to fill the view (camera 5 x WORLD.K), names it.
  if (part(2)) try {
    const sel = sysN('Seldavessa');
    const pg = await open('?reduced=1');
    await pg.evaluate((s) => window.scene.focusPoint(s.x, s.y, 128 / 14), sel); await frames(pg, 3);
    const p = await pg.evaluate((s) => window.scene.screenOf(s.x, s.y), sel);
    await pg.mouse.move(p.clientX + 82, p.clientY);
    for (let k = 0; k < 4; k++) { await pg.mouse.wheel(0, -240); await sleep(150); }
    await frames(pg, 6);
    const v1 = await viewName(pg);
    await pg.evaluate(() => document.querySelector('#map canvas').dispatchEvent(new PointerEvent('pointerleave', {clientX: 1590, clientY: 450})));
    await frames(pg, 20);
    const v2 = await viewName(pg);
    check('P1: 4 notches with the cursor 82 px off Seldavessa (camera 14) open nothing', v1 === null, v1);
    check('P1: the pointer then leaving the canvas still opens nothing (v2: the target-nearest fallback opened Seldavessa)', v2 === null, {v2, sysEvents: await pg.evaluate(() => window.sysEvents.map((e) => e && e.name))});
    await pg.evaluate((s) => window.scene.focusPoint(s.x, s.y, 128 / (5 * 0.032)), sel); await frames(pg, 6);
    check('P1 positive control: a programmatic fly to Seldavessa at camera 0.16 (= 5 x K; no pointer on the map) makes it dominate', (await viewName(pg)) === 'Seldavessa', await viewName(pg));
    await pg.close();
    // touch pinch (v10): MapControls dollies a pinch about the VIEW CENTRE, so the centred system comes to dominate the view
    // whether the pinch midpoint is on it or 500 px off (there is no gate on the pointer any more); a 14x pinch from camera
    // 14 x K. Negative control: the same pinch from home (camera 128) leaves it far too small - none dominates
    const pinch = async (dx, d0 = 14 * 0.032) => {
      const pt = await open('?reduced=1', {width: 1600, height: 900}, {hasTouch: true});
      await pt.evaluate(({s, z}) => window.scene.focusPoint(s.x, s.y, z), {s: sel, z: 128 / d0}); await frames(pt, 3);
      const q = await pt.evaluate((s) => window.scene.screenOf(s.x, s.y), sel), cx = q.clientX + dx, cy = q.clientY;
      const cdp = await pt.context().newCDPSession(pt);
      const tp = (r) => [{x: cx, y: cy - r, id: 1}, {x: cx, y: cy + r, id: 2}];
      await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: tp(30)});
      for (let r = 40; r <= 420; r += 20) { await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: tp(r)}); await frames(pt, 1); }
      await cdp.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
      await frames(pt, 10);
      const out = {view: await viewName(pt), dist: await pt.evaluate(() => window.scene.getStats().systemView ? -1 : 0)};
      await pt.close();
      return out;
    };
    const off = await pinch(500), onS = await pinch(0), far = await pinch(0, 128);
    check('v10 pinch: a 14x pinch at camera 0.45 makes the centred Seldavessa dominate (midpoint on it or 500 px off: the dolly is about the view centre)', off.view === 'Seldavessa' && onS.view === 'Seldavessa', {off, on: onS});
    check('v10 pinch NEGATIVE: the same pinch from camera 128 leaves every system too small to dominate', far.view === null, far);
  } catch (e) { check('task #38 entry-gate drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (3) #36: the entry framing fits EVERY body of EVERY system with bodies inside the uncovered map, and a hover there
  // returns that body. Two viewports, NO panning. Hover = scene.pickAt (the function serviceHover runs); a real dispatched
  // pointermove hover is also run on every body of Evernat and of every 25th system to tie the two together.
  const fitRun = async (vp, ins) => {
    const pg = await open('?reduced=1', vp);
    const r = await pg.evaluate(async (ins) => {
      const sc = window.scene; sc.setInsets(ins);
      const cv = document.querySelector('#map canvas'), R = cv.getBoundingClientRect();
      const raf = () => new Promise((ok) => requestAnimationFrame(() => ok()));
      const bySys = new Map();
      for (const b of window.bodies) { if (!bySys.has(b.sys)) bySys.set(b.sys, []); bySys.get(b.sys).push(b); }
      const ev = window.latest.systems.find((s) => s.n === 'Evernat').a;
      const x0 = R.left + (ins.left || 0), x1 = R.right - (ins.right || 0), y0 = R.top + (ins.top || 0), y1 = R.bottom - (ins.bottom || 0);
      const bad = []; let n = 0, ok = 0, real = 0, realOk = 0, k = 0;
      for (const [sys, bl] of bySys) {
        if (!window.latest.systems.some((s) => s.a === sys)) continue;
        k++;
        sc.focusSystem(sys);
        let v = null;
        for (let f = 0; f < 30; f++) { await raf(); v = sc.getStats().systemView; if (v && v.sys === sys && v.fade > 0.99) break; }
        if (!v || v.sys !== sys || v.fade < 0.99) { bad.push({sys, why: 'view', fade: v && v.fade}); n += bl.length; continue; }
        const doReal = sys === ev || k % 25 === 0;
        for (const b of bl) {
          n++;
          const p = sc.bodyScreen(b.a);
          if (!p || p.clientX < x0 || p.clientX > x1 || p.clientY < y0 || p.clientY > y1) { bad.push({sys: v.name, b: b.n, why: 'outside', p: p && [Math.round(p.clientX), Math.round(p.clientY)]}); continue; }
          const h = sc.pickAt(p.clientX, p.clientY);
          if (!(h && h.type === 'body' && h.id === b.a)) { bad.push({sys: v.name, b: b.n, why: 'pick', got: h && h.type}); continue; }
          ok++;
          if (doReal) {
            real++; window.lastHover = null;
            cv.dispatchEvent(new PointerEvent('pointermove', {clientX: p.clientX, clientY: p.clientY, bubbles: true}));
            await raf(); await raf();
            if (window.lastHover && window.lastHover.type === 'body' && window.lastHover.id === b.a) realOk++;
          }
        }
      }
      return {systems: k, n, ok, real, realOk, nbad: bad.length, bad: bad.slice(0, 8)};
    }, ins);
    await pg.close();
    return r;
  };
  if (part(3)) try {
    const t0 = Date.now();
    const [a, b] = await Promise.all([fitRun({width: 1600, height: 900}, {right: 452, top: 77}), fitRun({width: 1280, height: 720}, {right: 452, top: 134})]);
    for (const [name, r] of [['1600x900 {right 452, top 77}', a], ['1280x720 {right 452, top 134}', b]]) {
      check(`#36 ${name}: all ${r.n} bodies of ${r.systems} systems lie in the uncovered map at the entry framing and pick back as themselves (no pan)`, r.n > 3800 && r.ok === r.n, {ok: r.ok, bad: r.nbad, first: r.bad});
      check(`#36 ${name}: a real pointermove hover returns the body (${r.realOk}/${r.real}, Evernat + every 25th system)`, r.real > 100 && r.realOk === r.real, {real: r.real, ok: r.realOk});
    }
    console.log(`INFO  #36 fit sweep ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    // the deep-link order race: focusSystem FIRST, the dock's setInsets after -> the framing follows (reframe); a user wheel
    // between the two ends the framing (control: no reframe then)
    const pg = await open('?reduced=1', {width: 1280, height: 720});
    const ev = sysN('Evernat'), evB = bodies.filter((b) => b.sys === ev.a).map((b) => b.a);
    const inside = () => pg.evaluate((ids) => { const st = window.scene.getStats(), i = st.insets;
      return ids.map((a) => window.scene.bodyScreen(a)).filter((p) => p && p.clientX >= i.left && p.clientX <= innerWidth - i.right && p.clientY >= i.top && p.clientY <= innerHeight - i.bottom).length; }, evB);
    await pg.evaluate((a) => window.scene.focusSystem(a), ev.a); await frames(pg, 6);
    const before = await inside();
    await pg.evaluate(() => window.scene.setInsets({right: 452, top: 134})); await frames(pg, 6);
    const after = await inside();
    check(`#36 deep-link race: focusSystem(Evernat) then setInsets({right 452, top 134}) re-frames - all ${evB.length} bodies in the uncovered map (${after})`, before === evB.length && after === evB.length, {before, after});
    await pg.evaluate(() => window.scene.setInsets({})); await frames(pg, 4);
    await pg.evaluate((a) => window.scene.focusSystem(a), ev.a); await frames(pg, 6);
    await pg.mouse.move(640, 400); await pg.mouse.wheel(0, -40); await frames(pg, 8);
    const span = () => pg.evaluate(([s, ids]) => { const a = window.scene.screenOf(s.x, s.y, 0), ps = ids.map((i) => window.scene.bodyScreen(i)).filter(Boolean);
      return Math.max(...ps.map((p) => Math.hypot(p.clientX - a.clientX, p.clientY - a.clientY))); }, [ev, evB]);
    const s0 = await span(), open0 = await pg.evaluate(() => !!window.scene.getStats().systemView);
    await pg.evaluate(() => window.scene.setInsets({right: 452, top: 134})); await frames(pg, 6);
    const s1 = await span();
    check('#36 control: after a user wheel the framing is the user\'s - setInsets only shifts the view (body spread unchanged)', open0 && Math.abs(s1 / s0 - 1) < 0.005, {s0: Math.round(s0), s1: Math.round(s1)});
    await pg.close();
  } catch (e) { check('task #38 framing-fit drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (4) avoid rects (setInsets({avoid})) + P3-1 mutants "covered() always false" and "callouts not hidden when covered"
  if (part(4)) try {
    const pg = await open('?reduced=1');
    const ev = sysN('Evernat');
    // the stat layer whose top-6 callouts name Evernat (else the busiest mining system)
    const pickL = await pg.evaluate(async (a) => { for (const L of ['mining', 'fleets', 'owners', 'combat']) { window.scene.setStatLayer(L);
      for (let i = 0; i < 4; i++) await new Promise((r) => requestAnimationFrame(() => r()));
      if (window.scene.getStats().statLayer.callouts.some((c) => c.sys === a && c.shown)) return L; } window.scene.setStatLayer('mining'); return null; }, ev.a);
    const tgt = pickL ? ev : busiest;
    await frames(pg, 4);
    const elRect = () => pg.evaluate((a) => { const el = document.querySelector(`.c4-stat-layer [data-sys="${a}"]`); if (!el || el.style.display === 'none') return null; const r = el.getBoundingClientRect(); return {left: r.left, top: r.top, right: r.right, bottom: r.bottom}; }, tgt.a);
    const r0 = await elRect();
    await pg.evaluate((r) => window.scene.setInsets({avoid: [r]}), r0); await frames(pg, 4);
    const r1 = await elRect();
    const inter = r1 && r1.left < r0.right && r1.right > r0.left && r1.top < r0.bottom && r1.bottom > r0.top;
    check(`avoid: a rect over the ${tgt.n} callout's natural spot (layer ${pickL || 'mining'}) moves it out (or hides it)`, !!r0 && !inter, {r0: r0 && [r0.left, r0.top].map(Math.round), r1: r1 && [r1.left, r1.top].map(Math.round)});
    // covered() inside an avoid rect: a 60 px box round the system's own point
    const sp = await pg.evaluate((s) => window.scene.screenOf(s.x, s.y), tgt);
    await pg.evaluate(() => window.scene.setInsets({}));
    const cov0 = (await pg.evaluate((s) => window.scene.screenOf(s.x, s.y), tgt)).covered;
    const st = await pg.evaluate((p) => window.scene.setInsets({avoid: [{left: p.clientX - 30, top: p.clientY - 30, right: p.clientX + 30, bottom: p.clientY + 30}]}), sp);
    const cov1 = (await pg.evaluate((s) => window.scene.screenOf(s.x, s.y), tgt)).covered;
    check('avoid: screenOf().covered is true inside an avoid rect (control: false without it); setInsets echoes the rect', cov0 === false && cov1 === true && st.avoid && st.avoid.length === 1, {cov0, cov1, avoid: st.avoid});
    // a callout whose anchor (the column top) is inside an avoid rect hides
    await pg.evaluate(() => window.scene.setInsets({})); await frames(pg, 3);
    const shownBefore = await pg.evaluate((a) => window.scene.getStats().statLayer.callouts.find((c) => c.sys === a).shown, tgt.a);
    const top = await pg.evaluate((a) => { for (let i = 0; ; i++) { const c = window.scene.statColumnScreen(i); if (!c) return null; if (c.sys === a) return c.top; } }, tgt.a);
    await pg.evaluate((p) => window.scene.setInsets({avoid: [{left: p.clientX - 15, top: p.clientY - 15, right: p.clientX + 15, bottom: p.clientY + 15}]}), top); await frames(pg, 4);
    // task #44 replaced "hides" with: still shown, placed outside the rect, under = true, marker on the rect's edge
    const after = await pg.evaluate((a) => { const c = window.scene.getStats().statLayer.callouts.find((q) => q.sys === a), el = document.querySelector(`.c4-stat-layer [data-sys="${a}"]`).getBoundingClientRect();
      return {shown: c.shown, under: c.under, marker: c.marker, box: [el.left, el.top, el.right, el.bottom]}; }, tgt.a);
    const R = {left: top.clientX - 15, top: top.clientY - 15, right: top.clientX + 15, bottom: top.clientY + 15}, b = after.box;
    const boxOut = !(b[0] < R.right && b[2] > R.left && b[1] < R.bottom && b[3] > R.top);
    const onEdge = after.marker && after.marker[0] >= R.left - 3 && after.marker[0] <= R.right + 3 && after.marker[1] >= R.top - 3 && after.marker[1] <= R.bottom + 3
      && !(after.marker[0] > R.left + 1 && after.marker[0] < R.right - 1 && after.marker[1] > R.top + 1 && after.marker[1] < R.bottom - 1);
    check(`avoid (#44 rule): the ${tgt.n} callout whose anchor is under an avoid rect stays shown, outside the rect, marker on its edge (control: shown, not under, without it)`,
      shownBefore === true && after.shown === true && after.under === true && boxOut && onEdge, {shownBefore, after, R});
    // no callout overlaps an avoid rect or the insets: a big HUD box at top-left + a right dock
    await pg.evaluate(() => window.scene.setInsets({right: 452, top: 77, avoid: [{left: 0, top: 0, right: 420, bottom: 420}]})); await frames(pg, 4);
    const boxes = await pg.evaluate(() => [...document.querySelectorAll('.c4-stat-layer [data-sys]')].filter((e) => e.style.display !== 'none').map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; }));
    const bad = boxes.filter((b) => b[0] < 420 && b[1] < 420 || b[2] > 1600 - 452 || b[1] < 77);
    check(`avoid + insets: none of the ${boxes.length} shown callouts overlaps the HUD box or the dock`, bad.length === 0, {bad});
    // callouts shown + covered must agree: covered() true inside the dock (P3-1 mutant "covered always false")
    const cd = await pg.evaluate(() => { const out = {dock: null, open: null};
      for (let x = -60; x <= 120 && (out.dock === null || out.open === null); x += 2) { const p = window.scene.screenOf(x, 0);
        if (!p || !p.visible) continue;
        if (p.clientX > 1600 - 452 + 20 && out.dock === null) out.dock = p.covered;
        if (p.clientX > 500 && p.clientX < 1000 && out.open === null) out.open = p.covered; }
      return out; });
    check('covered(): a map point drawn under the right dock reports covered (control: one in the open map does not)', cd.dock === true && cd.open === false, cd);
    await pg.close();
  } catch (e) { check('task #38 avoid drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (5) P3-2 one threshold (v10: HULL_PX.collapse, every hull by its own px): at a camera where every Serene miner projects
  // under 0.75 px none is drawn (shown 0) and a pick ON a miner does not return it; control at a camera where each is
  // >= 1.5 px: all drawn (shown 1) and picked.
  if (part(5)) try {
    const serene = sysN('Serene');
    const pg = await open('?reduced=1');
    await pg.evaluate((a) => window.scene.focusSystem(a), serene.a);
    await pg.waitForFunction((a) => { const v = window.scene.getStats().systemView; return v && v.sys === a && v.fade > 0.99; }, serene.a, {timeout: 15000});
    const seMiners = latest.fleets.filter((f) => f.s.kind === 'mining' && bodies.some((b) => b.a === f.s.asteroid && b.sys === serene.a)).map((f) => f.a);
    const rockId = latest.fleets.find((f) => f.a === seMiners[0]).s.asteroid;
    const at = async (zoom) => {
      const rk = await pg.evaluate((a) => window.scene.bodyScreen(a), rockId);
      await pg.evaluate(([p, z]) => window.scene.focusPoint(p.x, p.y, z), [rk, zoom]); await frames(pg, 4);
      return pg.evaluate(({ms}) => {
        const per = ms.map((a) => { const f = window.scene.fleetScreen(a); const p = window.scene.pickAt(f.clientX, f.clientY); return {px: window.scene.fleetPixelSize(a), shown: f.shown, picked: !!p && p.type === 'fleet' && p.id === a}; });
        return {maxPx: +Math.max(...per.map((q) => q.px)).toFixed(3), minPx: +Math.min(...per.map((q) => q.px)).toFixed(3), shownMax: Math.max(...per.map((q) => q.shown)), shownMin: Math.min(...per.map((q) => q.shown)), picked: per.filter((q) => q.picked).length, n: per.length};
      }, {ms: seMiners});
    };
    const mid = await at(128 / 4.75), near = await at(128 / 0.25);
    check(`P3-2 (v10): every miner under HULL_PX.collapse (max ${mid.maxPx} px < 0.75, camera 4.75) is neither drawn (shown 0) nor pickable`, mid.maxPx < 0.75 && mid.shownMax === 0 && mid.picked === 0, mid);
    check(`P3-2 control: at camera 0.25 (min ${near.minPx} px >= 1.5) the same miners are all drawn (shown 1) and picked`, near.minPx >= 1.5 && near.shownMin === 1 && near.picked > near.n * 0.5, near);
    await pg.close();
  } catch (e) { check('task #38 miner-threshold drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (6) P3-6 + P3-1 "faction filter not dimming mining indicators"; P3-1 "owners layer not rebuilt on setFilter";
  // P3-4 combat callouts by the one rule
  if (part(6)) try {
    const pg = await open('?reduced=1');
    // (the P3-6 "faction filter dims mining indicators" checks were DELETED in task #55 with the galaxy mining rings)
    // owners layer on FIRST, then the owner filter: the columns must follow (rebuilt on setFilter)
    const topOwner = latest.owners.slice().sort((a, b) => b.fleets - a.fleets)[0].p;
    const MM = await import('data:text/javascript,' + encodeURIComponent(fs.readFileSync(path.join(ROOT, 'C4Live/scene-src/model.js'), 'utf8')));
    await pg.evaluate(() => window.scene.setStatLayer('owners')); await frames(pg, 3);
    const all = (await pg.evaluate(() => window.scene.getStats().statLayer)).columns;
    await pg.evaluate((p) => window.scene.setFilter({owner: p}), topOwner); await frames(pg, 3);
    const mine = (await pg.evaluate(() => window.scene.getStats().statLayer)).columns;
    const want = MM.statColumns('owners', latest, events, {owner: topOwner}).length;
    check('owners stat layer is rebuilt on setFilter({owner}) (layer first, filter second): columns = that owner\'s footprint', mine === want && all !== want, {all, mine, want});
    await pg.evaluate(() => { window.scene.setFilter({owner: null}); window.scene.setStatLayer('combat'); }); await frames(pg, 3);
    const cc = (await pg.evaluate(() => window.scene.getStats().statLayer)).callouts.slice(0, 3).map((c) => [c.name, c.v]);
    const exp = MM.combatSpots(events, latest.systems, latest.generatedAt).slice(0, 3).map((c) => [c.name, c.n]);
    check(`P3-4: combat callouts follow the one rule (top ${cc.map((c) => c.join(' ')).join(', ')})`, JSON.stringify(cc) === JSON.stringify(exp) && cc.length === 3, {cc, exp}); // no hard-coded leader: the data refreshes hourly
    await pg.close();
  } catch (e) { check('task #38 filter drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (7) frame time: home, home + mining stat layer, Serene view
  if (part(7)) try {
    const pg = await open('');
    await sleep(3200);
    const home = await pg.evaluate(() => window.scene.getStats());
    await pg.evaluate(() => window.scene.setStatLayer('mining')); await sleep(2200);
    const homeM = await pg.evaluate(() => window.scene.getStats());
    await pg.evaluate(() => window.scene.setStatLayer(null));
    await pg.evaluate((a) => window.scene.focusSystem(a), sysN('Serene').a);
    await pg.waitForFunction(() => { const v = window.scene.getStats().systemView; return v && v.fade > 0.99; }, null, {timeout: 15000});
    await sleep(2200);
    const se = await pg.evaluate(() => window.scene.getStats());
    console.log(`INFO  frame time: home ${home.fps} fps ${home.frameMs} ms (${home.cpuMs} ms JS); home + mining stat ${homeM.fps} fps ${homeM.frameMs} ms (${homeM.cpuMs} ms JS); Serene view ${se.fps} fps ${se.frameMs} ms (${se.cpuMs} ms JS)`);
    check('frame time: >= 55 fps, < 8 ms JS per frame at home, home + mining stat layer, Serene view', [home, homeM, se].every((s) => s.fps >= 55 && s.cpuMs < 8), [home, homeM, se].map((s) => [s.fps, s.cpuMs]));
    await pg.close();
  } catch (e) { check('task #38 frame-time drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (8) lead finding 2026-11-07: callouts covered EACH OTHER (OHRAVIM over XICTARN / DOSK on Combat, 1600x900). Every tab,
  // two viewports, the panels' HUD avoid rects + dock: every pair of shown callout boxes is disjoint and none touches the
  // HUD. Also: the combat layer follows the faction filter (pinned rule 6).
  if (part(8)) try {
    const hud = [[12, 12, 185, 91], [12, 196, 202, 367], [12, 374, 202, 435], [12, 817, 262, 846], [12, 858, 849, 888]];
    const bad = [], seen = [];
    for (const [vp, ins] of [[{width: 1600, height: 900}, {right: 452, top: 77}], [{width: 1280, height: 720}, {right: 452, top: 134}]]) {
      const pg = await open('?reduced=1', vp);
      const avoid = hud.map(([l, t, r, b]) => ({left: l, top: Math.min(t, vp.height - 40), right: r, bottom: Math.min(b, vp.height - 4)}));
      await pg.evaluate(([ins, avoid]) => window.scene.setInsets({...ins, avoid}), [ins, avoid]);
      const xi = sysN('Xictarn'), evn = sysN('Evernat');
      for (const L of ['mining', 'combat', 'fleets', 'owners']) for (const [cam, cx, cy, z] of [['home', 0.5, 0.5, 1], ['Xictarn z1.6', xi.x, xi.y, 1.6], ['Xictarn z3', xi.x, xi.y, 3], ['Evernat z2.5', evn.x, evn.y, 2.5]]) {
        await pg.evaluate(([L, x, y, z]) => { window.scene.setStatLayer(L); window.scene.focusPoint(x, y, z); }, [L, cx, cy, z]); await frames(pg, 5);
        const boxes = await pg.evaluate(() => [...document.querySelector('.c4-stat-layer').children].filter((e, i) => i % 3 === 2 && e.style.display !== 'none') // line, dot, label: deep-space labels too

          .map((e) => { const r = e.getBoundingClientRect(); return {n: e.firstChild.textContent, b: [r.left, r.top, r.right, r.bottom]}; }));
        seen.push(`${vp.width} ${L} ${cam} ${boxes.length}`);
        for (let i = 0; i < boxes.length; i++) {
          const a = boxes[i].b;
          for (let j = i + 1; j < boxes.length; j++) { const c = boxes[j].b; if (a[0] < c[2] && a[2] > c[0] && a[1] < c[3] && a[3] > c[1]) bad.push(`${vp.width} ${L} ${cam}: ${boxes[i].n} x ${boxes[j].n}`); }
          for (const h of avoid) if (a[0] < h.right && a[2] > h.left && a[1] < h.bottom && a[3] > h.top) bad.push(`${vp.width} ${L}: ${boxes[i].n} on HUD`);
          if (a[2] > vp.width - ins.right || a[1] < ins.top) bad.push(`${vp.width} ${L}: ${boxes[i].n} on dock/top`);
        }
      }
      if (vp.width === 1600) {
        // combat layer + faction filter (applied first): the callouts' total = the filtered rule's
        await pg.evaluate(() => { window.scene.setStatLayer('combat'); window.scene.setFilter({faction: 'mud'}); }); await frames(pg, 4);
        const MM = await import('data:text/javascript,' + encodeURIComponent(fs.readFileSync(path.join(ROOT, 'C4Live/scene-src/model.js'), 'utf8')));
        const want = MM.combatSpots(events, latest.systems, latest.generatedAt, 86400, 'mud');
        const got = await pg.evaluate(() => window.scene.getStats().statLayer);
        const all = MM.combatSpots(events, latest.systems, latest.generatedAt).length;
        check(`combat stat layer follows the faction filter (mud: ${want.length} places vs ${all} unfiltered)`, got.columns === want.length && want.length !== all && got.callouts[0].name === want[0].name, {got: got.columns, want: want.length, all});
        await pg.evaluate(() => window.scene.setFilter({faction: null}));
      }
      await pg.close();
    }
    check(`callouts never overlap each other, the HUD or the dock (4 tabs x 4 framings x 1600x900 + 1280x720; shown: ${seen.join(', ')})`, bad.length === 0 && seen.some((s) => !/ 0$/.test(s)), bad.slice(0, 6));
    // the REAL page (C4Live/index.html: the app's tabs, HUD and dock send the avoid rects and insets themselves)
    const rbad = []; let rshown = 0;
    for (const [w, h] of [[1600, 900], [1280, 720]]) {
      const pg = await browser.newPage({viewport: {width: w, height: h}});
      pg.on('pageerror', (e) => errs.push(String(e)));
      await pg.goto(`http://127.0.0.1:${port}/C4Live/index.html`);
      await pg.waitForFunction(() => document.querySelector('.c4-stat-layer') && document.querySelector('.c4-tab[data-tab="combat"]'), null, {timeout: 30000});
      await sleep(2500);
      for (const tab of ['mining', 'combat', 'fleets', 'owners']) {
        await pg.click(`.c4-tab[data-tab="${tab}"]`); await sleep(2500);
        const r = await pg.evaluate(() => {
          const hud = [...document.querySelectorAll('#c4Controls > .c4-glass, .c4-brand, #c4Age > .c4-age, .c4-shiphint.show, #c4Kpis, #c4Dock')].filter((e) => e.getClientRects().length).map((e) => e.getBoundingClientRect());
          const layer = document.querySelector('.c4-stat-layer'); if (!layer || layer.style.display === 'none') return {n: 0, bad: []};
          const cs = [...layer.children].filter((e, i) => i % 3 === 2 && e.style.display !== 'none').map((e) => ({t: e.textContent.slice(0, 18), b: e.getBoundingClientRect()}));
          const out = [];
          for (let i = 0; i < cs.length; i++) {
            const a = cs[i].b;
            for (let j = i + 1; j < cs.length; j++) { const c = cs[j].b; if (a.left < c.right && a.right > c.left && a.top < c.bottom && a.bottom > c.top) out.push(cs[i].t + ' x ' + cs[j].t); }
            if (hud.some((x) => a.left < x.right && a.right > x.left && a.top < x.bottom && a.bottom > x.top)) out.push(cs[i].t + ' on HUD');
          }
          return {n: cs.length, bad: out};
        });
        rshown += r.n; r.bad.forEach((x) => rbad.push(`${w}x${h} ${tab}: ${x}`));
      }
      await pg.close();
    }
    check(`real page: no two callout boxes intersect and none touches the HUD / dock (${rshown} callouts, 4 tabs x 1600x900 + 1280x720)`, rshown > 0 && rbad.length === 0, rbad.slice(0, 6));
  } catch (e) { check('task #38 callout-overlap drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  check('task #38 pages: no page errors', errs.length === 0, errs.slice(0, 5));
}

// ---------------- task #44 (scene v4 polish; closes #43's scene items). OLD_BUNDLE=<v3 bundle> fails the browser checks,
// T44_MODEL=<v3 model.js> fails the model checks. T44_PARTS=1,3 runs only those blocks.
async function task44(browser, port, latest, events, bodies) {
  const errs = [];
  const part = (n) => !process.env.T44_PARTS || process.env.T44_PARTS.split(',').includes(String(n));
  const sysN = (n) => latest.systems.find((s) => s.n === n);
  const frames = (pg, n) => pg.evaluate(async (n) => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(() => r())); }, n);
  const hook = (pg) => { pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); }); return pg; };
  const dev = async (query, vp = {width: 1600, height: 900}) => {
    const pg = hook(await browser.newPage({viewport: vp}));
    await pg.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html${query}`);
    await pg.waitForFunction(() => window.scene && window.scene.getStats().frames > 20, null, {timeout: 30000});
    await pg.evaluate(() => { document.getElementById('bar').style.display = 'none'; window.noFocusOnPick = true; });
    return pg;
  };
  const real = async (query, vp) => {
    const pg = hook(await browser.newPage({viewport: vp}));
    await pg.addInitScript(() => { let v; Object.defineProperty(window, 'C4Scene', {configurable: true, get: () => v, set: (x) => {
      v = x; const m = x.mount; x.mount = (...a) => { const s = m(...a); window.__scene = s; return s; }; }}); });
    await pg.goto(`http://127.0.0.1:${port}/C4Live/index.html${query}`);
    await pg.waitForFunction(() => window.__scene && document.querySelector('.c4-tab[data-tab="combat"]'), null, {timeout: 30000});
    return pg;
  };
  const MM = await import(process.env.T44_MODEL ? 'file:///' + process.env.T44_MODEL.replace(/\\/g, '/') : 'data:text/javascript,' + encodeURIComponent(fs.readFileSync(path.join(ROOT, 'C4Live/scene-src/model.js'), 'utf8')));

  // (1) model: ONE tie order for hot places (n desc, last desc, key asc); 'unaligned' never matches an NPC
  if (part(1)) {
    const ref = 1000, sys = [{a: 'Zz1', n: 'Late', x: 0, y: 0}, {a: 'Aa1', n: 'Early', x: 10, y: 0}, {a: 'Mm1', n: 'TieB', x: 20, y: 0}, {a: 'Bb1', n: 'TieA', x: 30, y: 0}];
    const ev = [{k: 'combat', t: 990, x: 0, y: 0}, {k: 'combat', t: 900, x: 10, y: 0}, {k: 'combat', t: 950, x: 20, y: 0}, {k: 'combat', t: 950, x: 30, y: 0},
      {k: 'combat', t: 100, x: 40, y: 0}, {k: 'combat', t: 101, x: 40.1, y: 0}]; // the deep cell: n 2, ranks first
    const order = MM.combatSpots(ev, sys, ref).map((h) => h.name);
    check('#44 combatSpots tie order: n desc, then latest event desc, then key asc (Deep 2 > Late t990 > TieA/TieB t950 by key Bb1 < Mm1 > Early t900)',
      JSON.stringify(order) === JSON.stringify(['Deep space near TieA', 'Late', 'TieA', 'TieB', 'Early']), order);
    const lat = {systems: sys, fleets: [], generatedAt: ref};
    const cols = MM.statColumns('combat', lat, ev, {}).map((c) => c.name);
    check('#44 the combat stat columns keep that order (statColumns does not re-sort it by key)', JSON.stringify(cols) === JSON.stringify(order), cols);
    const npc = {fa: 'unaligned', npc: 3}, pl = {fa: 'unaligned', npc: 0}, mud = {fa: 'mud', npc: 0};
    check("#44 factionMatch('unaligned'): an NPC is excluded (NPCs are only 'npc'); an unaligned player matches (control); a MUD player does not",
      MM.factionMatch(npc, 'unaligned') === false && MM.factionMatch(pl, 'unaligned') === true && MM.factionMatch(mud, 'unaligned') === false && MM.factionMatch(npc, 'npc') === true);
    const hs = MM.hotSpots([{k: 'combat', t: 999, x: 0, y: 0, fa: 'unaligned', npc: 2}, {k: 'combat', t: 999, x: 9, y: 0, fa: 'unaligned', npc: 0}], ref);
    const hN = hs.find((h) => h.x === 0), hP = hs.find((h) => h.x === 9);
    check("#44 hotMatch('unaligned'): an NPC-only hot spot is dimmed, an unaligned-player one is kept (control)", hN && hP && !MM.hotMatch(hN, 'unaligned') && MM.hotMatch(hP, 'unaligned') && MM.hotMatch(hN, 'npc'));
    const cu = MM.combatSpots([{k: 'combat', t: 999, x: 0, y: 0, fa: 'unaligned', npc: 1}, {k: 'combat', t: 999, x: 10, y: 0, fa: 'unaligned', npc: 0}], sys, ref, 86400, 'unaligned');
    check("#44 combatSpots with the 'unaligned' filter counts the unaligned PLAYER event only", cu.length === 1 && cu[0].name === 'Early', cu.map((h) => h.name));
  }

  // (2) P2: the REAL page's call order - setData WITHOUT bodies, focusSystem(Evernat), setData WITH bodies (90 ms later,
  // and 6 s later). Every Evernat body (Miiruvuki included) must end in the uncovered map and hover as itself.
  const ev = sysN('Evernat'), evB = bodies.filter((b) => b.sys === ev.a), miir = evB.find((b) => b.n === 'Miiruvuki');
  const bodyCheck = (pg, sc) => pg.evaluate(async ([ids, sc]) => {
    const S = window[sc], st = S.getStats(), i = st.insets, cv = document.querySelector('canvas');
    const out = [];
    for (const a of ids) {
      const p = S.bodyScreen(a);
      // the uncovered rect = inside the insets (the framing's contract; avoid rects never move the framing - #38 rule)
      const inMap = !!p && p.clientX >= i.left && p.clientX <= innerWidth - i.right && p.clientY >= i.top && p.clientY <= innerHeight - i.bottom;
      const h = p && S.pickAt(p.clientX, p.clientY);
      out.push({a, inMap, pick: !!h && h.type === 'body' && h.id === a, p: p && [Math.round(p.clientX), Math.round(p.clientY)]});
    }
    return {view: st.systemView && st.systemView.name, out};
  }, [evB.map((b) => b.a), sc]);
  const settle = (pg, sc) => pg.evaluate(async (sc) => { // until the system view is open and the camera has stopped
    const raf = () => new Promise((r) => requestAnimationFrame(() => r()));
    let last = '', same = 0;
    for (let f = 0; f < 900 && same < 20; f++) { await raf(); const s = window[sc].getStats(), v = s.systemView, p0 = window[sc].screenOf(0, 0), k = (p0 ? Math.round(p0.clientX * 10) + ',' + Math.round(p0.clientY * 10) : '-') + (v ? v.name + v.fade.toFixed(3) : '');
      same = v && v.fade > 0.99 && k === last ? same + 1 : 0; last = k; }
  }, sc);
  if (part(2)) try {
    for (const [label, q, delay] of [['bodies 90 ms after focusSystem (reduced motion)', '?nobodies=1&reduced=1', 90], ['bodies 6 s late (full motion)', '?nobodies=1', 6000]]) {
      const pg = await dev(q);
      await pg.evaluate(() => window.scene.setInsets({right: 452, top: 77, avoid: [{left: 12, top: 87, right: 202, bottom: 372}]}));
      await pg.evaluate((a) => window.scene.focusSystem(a), ev.a);
      await sleep(delay);
      await pg.evaluate(() => window.scene.setData(window.latest, window.events, window.bodies));
      await settle(pg, 'scene'); await sleep(2200); await settle(pg, 'scene');
      const r = await bodyCheck(pg, 'scene');
      const ok = r.out.filter((o) => o.inMap && o.pick).length, m = r.out.find((o) => o.a === miir.a);
      check(`#44 P2 real call order, ${label}: all ${evB.length} Evernat bodies in the uncovered map and hover as themselves (${ok}/${evB.length}; Miiruvuki ${m && m.inMap && m.pick ? 'ok' : 'NO'})`,
        r.view === 'Evernat' && evB.length === 8 && ok === evB.length, {view: r.view, bad: r.out.filter((o) => !(o.inMap && o.pick)).map((o) => [evB.find((b) => b.a === o.a).n, o.inMap, o.pick, o.p])});
      // a real dispatched pointermove on Miiruvuki reports the rock
      const hv = await pg.evaluate(async (a) => { const p = window.scene.bodyScreen(a); window.lastHover = null;
        document.querySelector('#map canvas').dispatchEvent(new PointerEvent('pointermove', {clientX: p.clientX, clientY: p.clientY, bubbles: true}));
        for (let i = 0; i < 3; i++) await new Promise((r) => requestAnimationFrame(() => r())); return window.lastHover; }, miir.a);
      check(`#44 P2 ${label}: a real pointermove on Miiruvuki hovers the rock`, !!hv && hv.type === 'body' && hv.id === miir.a, hv);
      await pg.close();
    }
    // control: a user wheel before the bodies arrive ends the forced framing - the late bodies must NOT move the camera
    {
      const pg = await dev('?nobodies=1&reduced=1');
      await pg.evaluate((a) => window.scene.focusSystem(a), ev.a); await frames(pg, 4);
      await pg.mouse.move(800, 450); await pg.mouse.wheel(0, 40); await frames(pg, 30);
      const before = await pg.evaluate((s) => window.scene.screenOf(s.x + 3, s.y), ev);
      await pg.evaluate(() => window.scene.setData(window.latest, window.events, window.bodies)); await frames(pg, 30);
      const after = await pg.evaluate((s) => window.scene.screenOf(s.x + 3, s.y), ev);
      check('#44 P2 control: after a user wheel the late bodies do not re-frame (the camera stays the user\'s)', Math.hypot(after.clientX - before.clientX, after.clientY - before.clientY) < 1,
        {before: [before.clientX, before.clientY].map(Math.round), after: [after.clientX, after.clientY].map(Math.round)});
      await pg.close();
    }
    // the real page itself: deep link ?system=<Evernat> (its own setData / focusSystem / setData order), both viewports
    for (const vp of [{width: 1600, height: 900}, {width: 1280, height: 720}]) {
      const pg = await real(`?system=${ev.a}`, vp);
      await sleep(4000); await settle(pg, '__scene'); await sleep(1500);
      const r = await bodyCheck(pg, '__scene');
      const ok = r.out.filter((o) => o.inMap && o.pick).length;
      check(`#44 P2 real page ${vp.width}x${vp.height} deep link: all ${evB.length} Evernat bodies in the uncovered map and hover as themselves (${ok})`,
        r.view === 'Evernat' && ok === evB.length, {view: r.view, bad: r.out.filter((o) => !(o.inMap && o.pick)).map((o) => [evB.find((b) => b.a === o.a).n, o.inMap, o.pick, o.p])});
      await pg.close();
    }
  } catch (e) { check('task #44 late-bodies drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // callout geometry on a page: shown boxes (rank order), HUD / inset rects, visible system label boxes
  const calloutState = (pg, sc) => pg.evaluate((sc) => {
    const S = window[sc], st = S.getStats(), i = st.insets, layer = document.querySelector('.c4-stat-layer');
    const kids = layer ? [...layer.children] : [];
    const boxes = [];
    for (let j = 0; j + 2 < kids.length; j += 3) {
      const el = kids[j + 2], r = el.getBoundingClientRect();
      boxes.push({rank: j / 3 + 1, n: el.firstChild.textContent, shown: layer.style.display !== 'none' && el.style.display !== 'none', b: [r.left, r.top, r.right, r.bottom]});
    }
    const labLayer = layer && layer.previousElementSibling;
    const labs = labLayer && labLayer.style.display !== 'none' ? [...labLayer.children].filter((e) => e.style.display === 'block' && +e.style.opacity > 0.05)
      .map((e) => { const r = e.getBoundingClientRect(); return {t: e.textContent, b: [r.left, r.top, r.right, r.bottom]}; }) : [];
    const cv = document.querySelector('canvas').getBoundingClientRect();
    const hud = (i.avoid || []).map((a) => [a.left + cv.left, a.top + cv.top, a.right + cv.left, a.bottom + cv.top]);
    if (i.right) hud.push([cv.right - i.right, cv.top, cv.right, cv.bottom]);
    if (i.top) hud.push([cv.left, cv.top, cv.right, cv.top + i.top]);
    if (i.left) hud.push([cv.left, cv.top, cv.left + i.left, cv.bottom]);
    if (i.bottom) hud.push([cv.left, cv.bottom - i.bottom, cv.right, cv.bottom]);
    return {boxes, labs, hud, cols: st.statLayer && st.statLayer.columns, callouts: st.statLayer && st.statLayer.callouts};
  }, sc);
  const hit = (a, c) => a[0] < c[2] && a[2] > c[0] && a[1] < c[3] && a[3] > c[1];
  const ovShare = (a, l) => { const ox = Math.min(a[2], l[2]) - Math.max(a[0], l[0]), oy = Math.min(a[3], l[3]) - Math.max(a[1], l[1]); return ox > 0 && oy > 0 ? ox * oy / ((l[2] - l[0]) * (l[3] - l[1])) : 0; };
  const judge = (tag, s, bad, labBad) => {
    const shown = s.boxes.filter((b) => b.shown);
    for (let r = 1; r <= Math.min(3, s.boxes.length); r++) if (!s.boxes[r - 1].shown) bad.push(`${tag}: rank ${r} ${s.boxes[r - 1].n} hidden`);
    for (let x = 0; x < shown.length; x++) {
      for (let y = x + 1; y < shown.length; y++) if (hit(shown[x].b, shown[y].b)) bad.push(`${tag}: ${shown[x].n} x ${shown[y].n}`);
      for (const h of s.hud) if (hit(shown[x].b, h)) bad.push(`${tag}: ${shown[x].n} on HUD/inset`);
      for (const l of s.labs) { const sh = ovShare(shown[x].b, l.b); if (sh > 0.05) labBad.push(`${tag}: ${shown[x].n} covers ${Math.round(sh * 100)}% of label ${l.t}`); }
    }
    return shown.length;
  };

  // (3) the top 3 hot places never vanish (anchor under the HUD -> placed farther out), no overlap, no label covered;
  // dev page with the panel's rects (1600x900 + 1280x720) and the REAL page (its own HUD / dock), every tab, home framing
  if (part(3)) try {
    const bad = [], labBad = [], seen = [];
    for (const [vp, ins] of [[{width: 1600, height: 900}, {right: 452, top: 77}], [{width: 1280, height: 720}, {right: 452, top: 134}]]) {
      const pg = await dev('?reduced=1', vp);
      await pg.evaluate(([ins]) => window.scene.setInsets({...ins, avoid: [{left: 12, top: 87, right: 202, bottom: 372}]}), [ins]);
      for (const L of ['mining', 'combat', 'fleets', 'owners']) {
        await pg.evaluate((L) => { window.scene.setStatLayer(L); window.scene.focusPoint(0.5, 0.5, 1); }, L); await frames(pg, 6);
        const s = await calloutState(pg, 'scene');
        seen.push(`dev ${vp.width} ${L} ${judge(`dev ${vp.width} ${L}`, s, bad, labBad)}`);
        if (L === 'combat' && vp.width === 1280) {
          const u = (s.callouts || []).filter((c) => c.under && c.shown);
          check(`#44 dev 1280x720 combat: callouts whose anchor is under the HUD are still shown, marker at the HUD edge (${u.map((c) => c.name).join(', ') || 'none under'})`,
            u.length >= 1 && u.every((c) => c.marker && !s.hud.some((h) => c.marker[0] > h[0] + 1 && c.marker[0] < h[2] - 1 && c.marker[1] > h[1] + 1 && c.marker[1] < h[3] - 1)), u);
        }
      }
      await pg.close();
    }
    for (const vp of [{width: 1600, height: 900}, {width: 1280, height: 720}]) {
      const pg = await real('', vp); await sleep(2500);
      for (const tab of ['mining', 'combat', 'fleets', 'owners']) {
        await pg.click(`.c4-tab[data-tab="${tab}"]`); await sleep(2500);
        const s = await calloutState(pg, '__scene');
        seen.push(`real ${vp.width} ${tab} ${judge(`real ${vp.width} ${tab}`, s, bad, labBad)}`);
      }
      await pg.close();
    }
    check(`#44 top 3 callouts shown on every tab, none overlapping each other / HUD / insets (dev + real page, 1600x900 + 1280x720; shown: ${seen.join(', ')})`, bad.length === 0, bad.slice(0, 8));
    check('#44 no shown callout covers more than 5 % of any visible system label', labBad.length === 0, labBad.slice(0, 8));
  } catch (e) { check('task #44 callout-reach drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (4) hierarchy: rank 1 larger / brighter than rank 6 (name + value size, accent bar, leader weight + glow, box glow);
  // house fonts; text only (no markup from chain names)
  if (part(4)) try {
    const pg = await dev('?reduced=1');
    await pg.evaluate(() => { window.scene.setStatLayer('combat'); window.scene.focusPoint(0.5, 0.5, 1); }); await frames(pg, 6);
    const r = await pg.evaluate(() => {
      const k = [...document.querySelector('.c4-stat-layer').children], px = (v) => parseFloat(v) || 0, blur = (v) => { const m = /(\d+(?:\.\d+)?)px(?:\s+\S+)?\)?\s*(?:,|$)/.exec(v); return m ? Math.max(...[...v.matchAll(/0px 0px (\d+(?:\.\d+)?)px/g)].map((q) => +q[1]), 0) : 0; };
      const one = (j) => { const line = k[j * 3], el = k[j * 3 + 2], cs = getComputedStyle(el), ns = getComputedStyle(el.children[0]), vs = getComputedStyle(el.children[1]), ls = getComputedStyle(line);
        return {name: px(ns.fontSize), val: px(vs.fontSize), bar: px(cs.borderLeftWidth), lead: px(ls.height), leadGlow: blur(ls.boxShadow), glow: blur(cs.boxShadow), op: +cs.opacity,
          fonts: ns.fontFamily + ' | ' + vs.fontFamily, kids: el.children.length, nested: [...el.children].some((c) => c.children.length)}; };
      return {n: k.length / 3, a: one(0), z: one(k.length / 3 - 1)};
    });
    const {a, z} = r;
    check(`#44 callout hierarchy: rank 1 vs rank ${r.n} - name ${a.name}/${z.name} px, value ${a.val}/${z.val} px, accent ${a.bar}/${z.bar} px, leader ${a.lead}/${z.lead} px glow ${a.leadGlow}/${z.leadGlow}, box glow ${a.glow}/${z.glow}`,
      r.n === 6 && a.name >= z.name + 2 && a.val >= z.val + 4 && a.bar > z.bar && a.lead > z.lead && a.leadGlow > z.leadGlow && a.glow > z.glow && a.op > z.op, r);
    check('#44 callouts use the house fonts (Orbitron names, Rajdhani values) and plain text nodes only', /Orbitron/.test(a.fonts.split('|')[0]) && /Rajdhani/.test(a.fonts.split('|')[1]) && a.kids === 2 && !a.nested && !z.nested, a.fonts);
    await pg.close();
  } catch (e) { check('task #44 hierarchy drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (5) starbase glyph rings under a column: level-5 Amora at mid zoom (focusPoint zoom 9.5): with a stat layer whose
  // column stands on Amora, its ring light drops to <= 40 % (25 % solid, no dashed / tick rings); with no layer the rings
  // are drawn (control); a level-5 system WITHOUT a column in the same layer keeps its rings (positive control)
  if (part(5)) try {
    const pg = await dev('?reduced=1&nobodies=1');
    await pg.evaluate(() => { for (const n of ['fleets', 'mining', 'combat', 'routes', 'labels', 'territory']) window.scene.setLayer(n, false); });
    const ringE = (s) => pg.evaluate(async ([s, size]) => {
      const S = window.scene;
      document.querySelector('.c4-stat-layer').style.visibility = 'hidden';
      for (let i = 0; i < 4; i++) await new Promise((r) => requestAnimationFrame(() => r()));
      const c = S.screenOf(s.x, s.y, 0), c1 = S.screenOf(s.x + 1, s.y, 0), ppu = Math.hypot(c1.clientX - c.clientX, c1.clientY - c.clientY);
      const half = size * 0.6 * ppu / 2; // systemSize x uSysZoom (0.6 at camera ~13.5) / 2
      document.querySelector('.c4-stat-layer').style.visibility = '';
      // neighbouring systems' glyph centres (their glow must not count as ring light - task #55)
      const nb = window.latest.systems.filter((q) => q.a !== s.a).map((q) => S.screenOf(q.x, q.y, 0)).filter(Boolean).map((p) => [p.clientX, p.clientY]);
      return {cx: c.clientX, cy: c.clientY, half, nb};
    }, [s, 1.1 + (s.lvl || 0) * 0.42]);
    const energy = async (s) => {
      const g = await ringE(s), R = Math.ceil(g.half * 1.05);
      await pg.evaluate(() => { document.querySelector('.c4-stat-layer').style.visibility = 'hidden'; });
      const box = {x: Math.round(g.cx - R), y: Math.round(g.cy - R), width: 2 * R, height: 2 * R};
      const shot = (await pg.screenshot({clip: box})).toString('base64'); if (process.env.SHOT_DIR) fs.writeFileSync(path.join(process.env.SHOT_DIR, 'c4-amora-ringband.png'), Buffer.from(shot, 'base64'));
      await pg.evaluate(() => { document.querySelector('.c4-stat-layer').style.visibility = ''; });
      // RING SIGNATURE (task #55): mean luminance in thin annuli AT the old ring radii (0.40 solid, 0.56 dashed, 0.78 ticks of
      // the glyph half-size) minus the mean of the annuli 0.06 either side. A ring is a bump; a smooth glow, a grid line
      // or the nebula is not. Pixels within 0.4 x half of a NEIGHBOURING system are skipped (their glyphs are not rings).
      const nb = g.nb.map(([x, y]) => [x - box.x, y - box.y]);
      return pg.evaluate(async ([d, R, half, nb]) => {
        const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
        const px = x.getImageData(0, 0, c.width, c.height).data, sc = c.width / (2 * R);
        const ann = (r0) => { let s = 0, n = 0;
          for (let y = 0; y < c.height; y++) for (let xx = 0; xx < c.width; xx++) {
            const ux = (xx + 0.5) / sc, uy = (y + 0.5) / sc, dx = ux - R, dy = uy - R, r = Math.hypot(dx, dy) / half;
            if (Math.abs(r - r0) > 0.015) continue;
            if (nb.some(([qx, qy]) => Math.hypot(qx - ux, qy - uy) < 0.4 * half)) continue;
            const i = (y * c.width + xx) * 4; s += 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]; n++; }
          return n ? s / n : 0; };
        return Math.max(...[0.40, 0.56, 0.78].map((r0) => ann(r0) - (ann(r0 - 0.06) + ann(r0 + 0.06)) / 2));
      }, [shot, R, g.half, nb]);
    };
    // task #55 (owner 2026-11-07 "I feel we dont need them"): the starbase rings are GONE, so this block now asserts their
    // absence. The #44 "25 % under a column" rule is moot. On the #53 bundle (OLD_BUNDLE) Amora's ring band carried > 200.
    const am = sysN('Amora');
    await pg.evaluate((s) => window.scene.focusPoint(s.x, s.y, 9.5), am); await frames(pg, 6);
    await pg.evaluate(() => window.scene.setStatLayer(null)); await frames(pg, 4);
    const off = await energy(am);
    // positive control: the star itself still draws (a lit core at the glyph centre)
    const core = await pg.evaluate(async (s) => { const p = window.scene.screenOf(s.x, s.y, 0); return p && [p.clientX, p.clientY]; }, am);
    const cshot = core ? (await pg.screenshot({clip: {x: Math.round(core[0] - 3), y: Math.round(core[1] - 3), width: 7, height: 7}})).toString('base64') : null;
    const coreLum = cshot ? await pg.evaluate(async (d) => { const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const px = x.getImageData(0, 0, c.width, c.height).data; let m = 0; for (let i = 0; i < px.length; i += 4) m = Math.max(m, 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]); return m; }, cshot) : 0;
    check(`#55 no starbase rings: level-5 Amora shows no ring bump at the old ring radii (${off.toFixed(1)} luminance over the neighbouring annuli, <= 3)`, off <= 3, {ringBump: +off.toFixed(2)});
    check(`#55 positive control: Amora's star core still draws (peak luminance ${Math.round(coreLum)} >= 120)`, coreLum >= 120, {coreLum: Math.round(coreLum)});
    await pg.close();
  } catch (e) { check('task #44 rings drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  check('task #44 pages: no page errors', errs.length === 0, errs.slice(0, 5));
}
const M_hot = (MM, events, latest) => MM.combatSpots(events, latest.systems, latest.generatedAt); // one rule since task #38

// ---------------- task #51 (scene v6, owner 2026-11-07: "the tail for a subwarp ship is way too long, there will be
// thousands of fleets"). Trails in hull lengths at world scale, collapsed with the hull, off for filtered fleets.
// OLD_BUNDLE=<v5 bundle> fails the browser acceptances (frame time is a guard, not a fix). ONLY_T51=1 runs this alone.
async function task51(browser, port, latest) {
  const errs = [];
  const MT = await import('data:text/javascript,' + encodeURIComponent(fs.readFileSync(path.join(ROOT, 'C4Live/scene-src/model.js'), 'utf8')));
  // (a) the lengths themselves (model): hull multiples, capped, warp >= subwarp for every class
  const cls = Object.keys(MT.HULL_LEN || {});
  // v10: hulls (and so trails) are world-scale x WORLD.K; the cap is 0.3 x K = TRAIL.max
  check(`#51 trail length = hull lengths of the fleet\'s class: subwarp 4 x HULL_LEN, warp 10 x HULL_LEN, both <= TRAIL.max (${MT.TRAIL && MT.TRAIL.max} units = 0.3 x K)`,
    typeof MT.trailLen === 'function' && Math.abs(MT.trailLen('subwarp', 'medium') - 4 * MT.HULL_LEN.medium) < 1e-12 && Math.abs(MT.trailLen('warp', 'medium') - 10 * MT.HULL_LEN.medium) < 1e-12
      && Math.abs(MT.TRAIL.max - 0.3 * MT.WORLD.K) < 1e-12 && cls.every((c) => MT.trailLen('warp', c) >= MT.trailLen('subwarp', c) && MT.trailLen('warp', c) <= MT.TRAIL.max + 1e-12),
    typeof MT.trailLen === 'function' ? Object.fromEntries(cls.map((c) => [c, [+MT.trailLen('subwarp', c).toFixed(3), +MT.trailLen('warp', c).toFixed(3)]])) : 'no trailLen');
  const T = latest.generatedAt;
  const hook = (pg) => { pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); }); return pg; };
  const frames = (pg, n) => pg.evaluate(async (n) => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(() => r())); }, n);
  const dev = async (query) => {
    const pg = hook(await browser.newPage({viewport: {width: 1600, height: 900}}));
    await pg.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html${query}`);
    await pg.waitForFunction(() => window.scene && window.scene.getStats().frames > 20, null, {timeout: 30000});
    await pg.evaluate(() => { document.getElementById('bar').style.display = 'none'; window.noFocusOnPick = true; for (const l of window.C4Scene.layers) window.scene.setLayer(l, l === 'fleets'); });
    return pg;
  };
  // luminance image of the canvas (fleets layer only)
  const grab = async (pg) => {
    const b64 = (await pg.screenshot()).toString('base64');
    return pg.evaluate(async (d) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const px = x.getImageData(0, 0, c.width, c.height).data, L = new Array(c.width * c.height);
      for (let i = 0; i < L.length; i++) L[i] = Math.round(0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]);
      return {w: c.width, h: c.height, L};
    }, b64);
  };
  const litCount = (A, B, thr = 8) => { let n = 0; for (let i = 0; i < A.L.length; i++) if (A.L[i] - B.L[i] > thr) n++; return n; };
  const peak = (A, B, x, y, r = 2) => { let m = 0; for (let j = Math.round(y) - r; j <= Math.round(y) + r; j++) for (let i = Math.round(x) - r; i <= Math.round(x) + r; i++) if (i >= 0 && j >= 0 && i < A.w && j < A.h) m = Math.max(m, A.L[j * A.w + i] - B.L[j * A.w + i]); return m; };
  const fleetsOff = async (pg, fn) => { await pg.evaluate(() => window.scene.setLayer('fleets', false)); await frames(pg, 4); const r = await fn(); await pg.evaluate(() => window.scene.setLayer('fleets', true)); await frames(pg, 4); return r; };
  const transitAt = (f, t) => (f.s.kind === 'warp' || f.s.kind === 'subwarp') && f.s.from && f.s.to && f.s.departs < t && f.s.arrives > t;
  const prog = (f, t) => (t - f.s.departs) / (f.s.arrives - f.s.departs);
  const posAt = (f, t) => { const p = prog(f, t); return [f.s.from[0] + (f.s.to[0] - f.s.from[0]) * p, f.s.from[1] + (f.s.to[1] - f.s.from[1]) * p]; };

  // (b) home view, the real data: no hull draws there, and no trail either
  try {
    const pg = await dev(`?reduced=1&nobodies=1&replay=1&speed=0&t0=${T}`);
    await frames(pg, 10);
    const on = await grab(pg), off = await fleetsOff(pg, () => grab(pg));
    const inFlight = latest.fleets.filter((f) => transitAt(f, T)).length;
    const lit = litCount(on, off);
    check(`#51 home view, real data (${inFlight} transits in flight): the fleets layer lights <= 40 px (hulls collapse there; trails collapse with them)`, inFlight > 20 && lit <= 40, {litPx: lit, inFlight});
    await pg.close();
  } catch (e) { check('#51 home drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (c) close view on one in-flight transit: the trail ends where trailLen says, it is lit behind the hull (control), and
  // a states filter that excludes it removes the trail (its hull stays as faint context)
  const MID = latest.fleets.filter((f) => transitAt(f, T) && f.s.kind === 'subwarp').map((f) => {
    const L = Math.hypot(f.s.to[0] - f.s.from[0], f.s.to[1] - f.s.from[1]), tl = MT.trailLen ? MT.trailLen('subwarp', f.flagSize) : 0.12;
    const P = posAt(f, T);
    // no other transit or rest fleet within 0.6 units of the trail's far half (a neighbour would light the dark samples)
    const near = latest.fleets.filter((g) => g !== f && Math.hypot((transitAt(g, T) ? posAt(g, T) : [g.x, g.y])[0] - P[0], (transitAt(g, T) ? posAt(g, T) : [g.x, g.y])[1] - P[1]) < 0.6).length;
    return {f, L, tl, trav: L * prog(f, T), near};
  }).filter((e) => e.trav > 1.2 && e.near === 0).sort((a, b) => b.tl - a.tl)[0];
  check('#51 found an isolated in-flight subwarp transit >= 1.2 units from its start for the trail-length probe', !!MID, MID && [MID.f.n, MID.f.flagSize]);
  if (MID) try {
    const f = MID.f, dir = [(f.s.to[0] - f.s.from[0]) / MID.L, (f.s.to[1] - f.s.from[1]) / MID.L], P = posAt(f, T);
    const pg = await dev(`?reduced=1&nobodies=1&replay=1&speed=0&t0=${T}`);
    await pg.evaluate(([x, y]) => window.scene.focusPoint(x, y, 625), P); // camera ~0.2 (the pre-v10 6.4 x K)
    await pg.waitForFunction(() => !window.scene.getStats().flying, null, {timeout: 15000}); await frames(pg, 20);
    const pts = await pg.evaluate(([P, dir, ds]) => ds.map((d) => window.scene.screenOf(P[0] - dir[0] * d, P[1] - dir[1] * d, 0)), [P, dir, [0.55 * MID.tl, 0.75 * MID.tl, 2 * MID.tl, 4 * MID.tl, 8 * MID.tl]]);
    const on = await grab(pg), off = await fleetsOff(pg, () => grab(pg));
    const pk = pts.map((p) => peak(on, off, p.clientX, p.clientY));
    const pxLen = Math.hypot(pts[1].clientX - pts[0].clientX, pts[1].clientY - pts[0].clientY) / (0.2 * MID.tl);
    check(`#51 camera ~0.2: the ${f.flagSize} subwarp trail is lit 0.55-0.75 trail lengths behind the hull (control) and dark at 2, 4 and 8 (trail ${MID.tl.toFixed(3)} units = ${(MID.tl * pxLen).toFixed(0)} px here; v5 drew 3.5 units)`,
      Math.min(pk[0], pk[1]) > 10 && Math.max(pk[2], pk[3], pk[4]) <= 4, {peaks: pk, fleet: f.n});
    // filter: only idle fleets shown -> this transit is filtered out; its trail goes (v5 drew it at 6%)
    await pg.evaluate(() => window.scene.setFilter({states: ['idle']})); await frames(pg, 6);
    const onF = await grab(pg);
    const pkF = pts.slice(0, 2).map((p) => peak(onF, off, p.clientX, p.clientY, 3));
    let sumF = 0; for (let s = 0.4; s <= 1.0; s += 0.05) { const q = await pg.evaluate(([P, dir, d]) => window.scene.screenOf(P[0] - dir[0] * d, P[1] - dir[1] * d, 0), [P, dir, s * MID.tl]); sumF += peak(onF, off, q.clientX, q.clientY, 2); }
    check('#51 setFilter({states: [idle]}) removes the filtered transit\'s trail: 0 lit along its first 0.4-1.0 trail lengths (hulls keep their 6% context; the trail does not)', Math.max(...pkF) <= 1 && sumF <= 2, {peaks: pkF, sum: sumF});
    await pg.evaluate(() => window.scene.setFilter({states: ['subwarp']})); await frames(pg, 6);
    const onS = await grab(pg), pkS = pts.slice(0, 2).map((p) => peak(onS, off, p.clientX, p.clientY));
    check('#51 control: setFilter({states: [subwarp]}) keeps that trail lit', Math.min(...pkS) > 10, {peaks: pkS});
    await pg.screenshot({path: path.join(process.env.SHOT_DIR || os.tmpdir(), 'c4-trail-close.png')});
    await pg.close();
  } catch (e) { check('#51 close trail drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (d) scale: +5,000 synthetic transits (clones of real fleets on random system-to-system legs, in flight at T). Home and
  // mid zoom: lit px of the fleets layer and JS ms / frame. Trails cost no per-fleet CPU (pure vertex work).
  try {
    const pg = await dev(`?reduced=1&nobodies=1&replay=1&speed=0&t0=${T}`);
    const n = await pg.evaluate((T) => {
      const L = window.latest, S = L.systems.filter((s) => Number.isFinite(s.x)), base = L.fleets.filter((f) => f.s.kind === 'subwarp' || f.s.kind === 'warp');
      let seed = 51; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
      const extra = [];
      for (let i = 0; i < 5000; i++) {
        const g = base[i % base.length], a = S[Math.floor(rnd() * S.length)], b = S[Math.floor(rnd() * S.length)];
        if (a === b) continue;
        const dep = T - 60 - rnd() * 1800, arr = T + 60 + rnd() * 1800, p = (T - dep) / (arr - dep);
        extra.push({...g, a: 'syn' + i, n: 'syn' + i, x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, s: {...g.s, kind: i % 3 ? 'subwarp' : 'warp', from: [a.x, a.y], to: [b.x, b.y], departs: dep, arrives: arr}});
      }
      window.synth = {...L, fleets: L.fleets.concat(extra)};
      window.scene.setData(window.synth, window.events);
      return extra.length;
    }, T);
    const measure = async () => { await new Promise((r) => setTimeout(r, 2300)); const s = await pg.evaluate(() => window.scene.getStats()); const on = await grab(pg), off = await fleetsOff(pg, () => grab(pg)); return {cpuMs: s.cpuMs, frameMs: s.frameMs, lit: litCount(on, off)}; };
    await frames(pg, 10);
    const home = await measure();
    const busy = latest.systems.slice().sort((a, b) => (b.lvl || 0) - (a.lvl || 0))[0];
    await pg.evaluate(([x, y]) => window.scene.focusPoint(x, y, 9.5), [busy.x, busy.y]); // camera ~13.5
    await pg.waitForFunction(() => !window.scene.getStats().flying, null, {timeout: 15000}); await frames(pg, 20);
    const mid = await measure();
    console.log(`INFO  #51 +${n} synthetic transits: home ${home.lit} lit px, ${home.cpuMs} ms JS, ${home.frameMs} ms frame; mid (camera ~13.5 on ${busy.n}) ${mid.lit} lit px, ${mid.cpuMs} ms JS, ${mid.frameMs} ms frame`);
    check(`#51 +${n} synthetic transits at the home view: the fleets layer lights <= 150 px (v5: trails painted the map)`, n > 4900 && home.lit <= 150, home);
    check(`#51 +${n} synthetic transits at mid zoom (camera ~13.5): the fleets layer lights <= 1.5% of the 1600x900 view`, mid.lit <= 0.015 * 1600 * 900, mid);
    check(`#51 +${n} synthetic transits: JS < 8 ms / frame at home and mid zoom (guard)`, home.cpuMs < 8 && mid.cpuMs < 8, [home.cpuMs, mid.cpuMs]);
    await pg.close();
  } catch (e) { check('#51 synthetic-load drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }
  check('#51 no page errors during the task #51 drives', errs.length === 0, errs.slice(0, 4));
}

// ---------------- task #53 (scene: DAC influence layer; owner 2026-11-07 "colour code the influence on the map per DAC").
// setDacs / setStatLayer('dacs') / focusDac. OLD_BUNDLE=<#51 bundle 2d956fbd> fails every browser acceptance; the model
// checks fail on the #51 model.js (no dacInfluence / dacLayer). ONLY_T53=1 runs this block alone.
async function task53(browser, port, latest) {
  const errs = [];
  const MD = await import('data:text/javascript,' + encodeURIComponent(fs.readFileSync(path.join(ROOT, 'C4Live/scene-src/model.js'), 'utf8')));
  const UI = require(path.join(ROOT, 'C4Live/c4-ui-model.js'));
  const parsed = UI.parseDacs(JSON.parse(fs.readFileSync(path.join(ROOT, 'C4Live/dacs.json'), 'utf8')));
  const realList = UI.resolveDacs(latest, parsed.dacs).dacs.map((x) => ({tag: x.tag, color: x.color, members: x.profiles.slice()}));
  const exList = UI.resolveDacs(latest, UI.exampleDacs(latest, parsed.dacs)).dacs.map((x) => ({tag: x.tag, color: x.color, members: x.profiles.slice()}));
  const order = exList.map((d) => d.tag), hexOf = new Map(exList.map((d) => [d.tag, d.color]));
  // (1) one rule, two implementations: the scene's model.js dacInfluence == the panels' c4-ui-model.js dacInfluence
  const uiEx = UI.dacInfluence(latest, exList);
  // synthetic: overlapping membership (one profile in two DACs) + a stake-only owner + an unknown profile
  const owners = latest.owners.filter((o) => !o.npc).map((o) => o.p), stakeOwner = (latest.stakes || []).find((k) => k && k.sys && k.o);
  const syn = [{tag: 'AAA', members: owners.slice(0, 40)}, {tag: 'BBB', members: owners.slice(30, 90).concat(stakeOwner ? [stakeOwner.o] : [])}, {tag: 'CCC', members: ['NotAProfile111111111111111111111111']}];
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const hasFn = typeof MD.dacInfluence === 'function';
  const scEx = hasFn ? MD.dacInfluence(latest, exList) : null, scSyn = hasFn ? MD.dacInfluence(latest, syn) : null, uiSyn = UI.dacInfluence(latest, syn);
  check(`#53 dacInfluence: model.js == c4-ui-model.js on the real data with the example assignment (${uiEx.systems.length} systems, ${order.length} DACs) and on a synthetic overlapping set (${uiSyn.systems.length} systems)`,
    hasFn && uiEx.systems.length >= 10 && uiSyn.systems.length >= 5 && same(scEx, uiEx) && same(scSyn, uiSyn),
    hasFn ? {ex: same(scEx, uiEx), syn: same(scSyn, uiSyn)} : 'model.js has no dacInfluence');
  check('#53 NEGATIVE: the equality check sees a one-fleet difference (one member removed -> not equal)',
    hasFn && !same(MD.dacInfluence(latest, [{tag: 'AAA', members: owners.slice(1, 40)}, syn[1], syn[2]]), uiSyn));
  // (2) dominance, computed here independently from the PANELS' influence rows: most fleets + stakes, then u/s, then list order
  const dom = new Map();
  for (const s of uiEx.systems) {
    let best = null, bw = 0, bu = 0;
    for (const t of order) { const c = s.byDac[t]; if (!c) continue; const w = c.fleets + c.stakes; if (w > bw || (w === bw && w > 0 && c.ups > bu)) { best = t; bw = w; bu = c.ups; } }
    if (best) dom.set(s.a, best);
  }
  const L = typeof MD.dacLayer === 'function' ? MD.dacLayer(latest, exList, null) : null;
  const domBad = L ? L.cols.filter((c) => dom.get(c.sys) !== c.tag || c.hex !== hexOf.get(c.tag)) : null;
  check(`#53 dacLayer: one column per system with DAC presence (${dom.size}), each in its dominant DAC's colour (independent recount)`, !!L && L.cols.length === dom.size && domBad.length === 0,
    L ? {cols: L.cols.length, want: dom.size, bad: domBad.slice(0, 3)} : 'no dacLayer');
  check('#53 dacLayer: an empty list (today\'s real dacs.json: 12 DACs, 0 members) gives no column and no halo', !!L && realList.length > 0 && (() => { const E = MD.dacLayer(latest, realList, null); return E.cols.length === 0 && E.halos.length === 0; })(),
    {dacs: realList.length, members: realList.reduce((n, d) => n + d.members.length, 0)});

  const hook = (pg) => { pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); }); return pg; };
  const frames = (pg, n) => pg.evaluate(async (n) => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(() => r())); }, n);
  const grab = async (pg) => {
    const b64 = (await pg.screenshot()).toString('base64');
    return pg.evaluate(async (d) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      return {w: c.width, h: c.height, d: Array.from(x.getImageData(0, 0, c.width, c.height).data)};
    }, b64);
  };
  const diffPx = (A, B, thr = 6) => { let n = 0; for (let i = 0; i < A.d.length; i += 4) if (Math.abs(A.d[i] - B.d[i]) + Math.abs(A.d[i + 1] - B.d[i + 1]) + Math.abs(A.d[i + 2] - B.d[i + 2]) > thr) n++; return n; };
  // mean (on - off) colour over a (2r+1)^2 box
  const diffAt = (A, B, x, y, r = 3) => { const s = [0, 0, 0]; let n = 0; for (let j = Math.round(y) - r; j <= Math.round(y) + r; j++) for (let i = Math.round(x) - r; i <= Math.round(x) + r; i++) { if (i < 0 || j < 0 || i >= A.w || j >= A.h) continue; const k = (j * A.w + i) * 4; for (let c = 0; c < 3; c++) s[c] += Math.max(0, A.d[k + c] - B.d[k + c]); n++; } return s.map((v) => v / Math.max(1, n)); };
  const hue = ([r, g, b]) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (d <= 0) return null; let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return (h * 60 + 360) % 360; };
  const sat = ([r, g, b]) => { const mx = Math.max(r, g, b); return mx ? (mx - Math.min(r, g, b)) / mx : 0; };
  const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const hueGap = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };
  const dev = async () => {
    const pg = hook(await browser.newPage({viewport: {width: 1600, height: 900}}));
    await pg.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html?reduced=1&nobodies=1`);
    await pg.waitForFunction(() => window.scene && window.scene.getStats().frames > 20, null, {timeout: 30000});
    await pg.evaluate(() => { document.getElementById('bar').style.display = 'none'; window.noFocusOnPick = true; });
    return pg;
  };

  // (3) the real list (no members): setStatLayer('dacs') draws nothing at all
  try {
    const pg = await dev();
    await new Promise((r) => setTimeout(r, 1500)); await frames(pg, 20); // label fades settle (2 px of fade moved in one run)
    const off = await grab(pg);
    await frames(pg, 8);
    const off2 = await grab(pg), noise = diffPx(off2, off); // the page's own frame-to-frame noise floor (nothing changed)
    const r = await pg.evaluate((list) => { const s = window.scene; if (typeof s.setDacs !== 'function') return {api: false}; s.setDacs({dacs: list, example: false, focus: null}); return {api: true, ok: s.setStatLayer('dacs')}; }, realList);
    await frames(pg, 8);
    const on = await grab(pg), st = await pg.evaluate(() => window.scene.getStats());
    const n = diffPx(on, off2);
    const where = []; for (let i = 0; i < on.d.length && where.length < 4; i += 4) if (Math.abs(on.d[i] - off2.d[i]) + Math.abs(on.d[i + 1] - off2.d[i + 1]) + Math.abs(on.d[i + 2] - off2.d[i + 2]) > 6) where.push([(i / 4) % on.w, Math.floor(i / 4 / on.w), on.d.slice(i, i + 3), off2.d.slice(i, i + 3)]);
    console.log('INFO  #53 empty-list diff', n, 'noise', noise, JSON.stringify(where));
    check('#53 real dacs.json (12 DACs, no members): setStatLayer(\'dacs\') is accepted and draws 0 px beyond the frame-to-frame noise (no halo, no column, no callout)', r.api && r.ok && n <= Math.max(2, noise) && st.dacs && st.dacs.halos === 0 && st.statLayer.columns === 0, {api: r.api, accepted: r.ok, px: n, noise, dacs: st.dacs});
    await pg.close();
  } catch (e) { check('#53 empty-list drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (4) the example: columns / callouts in the dominant DAC's colour at the right systems; the halo hue at isolated systems
  try {
    const pg = await dev();
    await pg.evaluate(() => { for (const l of window.C4Scene.layers) window.scene.setLayer(l, false); });
    await frames(pg, 6);
    const off = await grab(pg);
    const api = await pg.evaluate((list) => { const s = window.scene; if (typeof s.setDacs !== 'function') return false; s.setDacs({dacs: list, example: true, focus: null}); return s.setStatLayer('dacs'); }, exList);
    await frames(pg, 10);
    const on = await grab(pg), st = await pg.evaluate(() => window.scene.getStats());
    const cols = (st.dacs && st.dacs.cols) || [];
    const bad = cols.filter((c) => dom.get(c.sys) !== c.tag || c.hex !== hexOf.get(c.tag));
    check(`#53 example: the scene stands one column per DAC system (${dom.size}) in its dominant DAC's colour`, api === true && cols.length === dom.size && bad.length === 0, {cols: cols.length, want: dom.size, bad: bad.slice(0, 3)});
    const co = st.statLayer.callouts || [];
    const coBad = co.filter((c) => { const s = uiEx.systems.find((x) => x.a === c.sys), t = dom.get(c.sys), k = s && s.byDac[t];
      return !k || !c.line.startsWith(`${t} · ${k.fleets} fleet${k.fleets === 1 ? '' : 's'} · ${k.stakes} stake${k.stakes === 1 ? '' : 's'}`); });
    check(`#53 example callouts read "TAG · N fleets · M stakes" with the dominant DAC's own numbers (${co.length} callouts)`, co.length >= 3 && coBad.length === 0, {first: co.slice(0, 3).map((c) => c.line), bad: coBad.slice(0, 2).map((c) => c.line)});
    // halo hue: systems whose dominant DAC is saturated, holds >= 75% of the presence, and no OTHER DAC system within 2.2 units
    const rows = uiEx.systems.filter((s) => {
      const t = dom.get(s.a), hx = t && hexOf.get(t); if (!hx || sat(hexRgb(hx)) < 0.45) return false;
      const w = (c) => (c ? c.fleets + c.stakes : 0), tot = order.reduce((v, u) => v + w(s.byDac[u]), 0);
      if (w(s.byDac[t]) / tot < 0.75) return false;
      // home-view halos reach ~3.1 units (radius x uHaloK 3.2): no other DAC's presence at any system within 3.6
      return uiEx.systems.every((o) => o === s || Math.hypot(o.x - s.x, o.y - s.y) > 3.6 || order.every((u) => u === t || !o.byDac[u]));
    }).slice(0, 6);
    const probes = [];
    for (const s of rows) {
      const pts = await pg.evaluate((s) => [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => window.scene.screenOf(s.x + dx, s.y + dy, 0.035)), s);
      const cs = pts.filter((p) => p && p.visible).map((p) => diffAt(on, off, p.clientX, p.clientY));
      const mean = [0, 1, 2].map((i) => cs.reduce((v, c) => v + c[i], 0) / Math.max(1, cs.length));
      const want = hue(hexRgb(hexOf.get(dom.get(s.a)))), got = hue(mean);
      probes.push({n: s.n, tag: dom.get(s.a), lum: +Math.max(...mean).toFixed(1), want: Math.round(want), got: got == null ? null : Math.round(got), gap: got == null ? 999 : Math.round(hueGap(want, got))});
    }
    check(`#53 example halos: at ${probes.length} isolated DAC systems the glow 1 unit from the system (clear of its column) has its dominant DAC's hue (within 30 deg) and is lit`, probes.length >= 3 && probes.every((p) => p.lum >= 4 && p.gap <= 30), probes);
    // watermark: shown, inside the open map, clear of the callouts
    const mk = st.dacs && st.dacs.mark, ins = st.insets;
    const boxes = await pg.evaluate(() => [...document.querySelectorAll('.c4-stat-callout')].filter((e) => e.offsetParent && e.style.display !== 'none').map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; }));
    check('#53 example: an EXAMPLE watermark stands in the open map, clear of every callout', !!mk && mk.left >= ins.left && mk.right <= 1600 - ins.right && mk.top >= ins.top && mk.bottom <= 900 - ins.bottom
      && boxes.every((b) => !(b[0] < mk.right && b[2] > mk.left && b[1] < mk.bottom && b[3] > mk.top)), {mark: mk, callouts: boxes.length});
    await pg.evaluate((list) => window.scene.setDacs({dacs: list, example: false, focus: null}), exList); await frames(pg, 6);
    check('#53 control: example:false -> no watermark (same members)', !(await pg.evaluate(() => window.scene.getStats().dacs.mark)));
    // focus: the focused DAC's systems only, its own numbers; another DAC's halo dims
    const counts = order.map((t) => ({t, n: uiEx.byDac[t].length})).sort((a, b) => b.n - a.n), F = counts[0].t;
    const other = rows.find((s) => dom.get(s.a) !== F);
    await pg.evaluate(([list, F]) => window.scene.setDacs({dacs: list, example: true, focus: F}), [exList, F]); await frames(pg, 8);
    const onF = await grab(pg), stF = await pg.evaluate(() => window.scene.getStats());
    const fc = stF.dacs.cols;
    let dimR = null;
    if (other) {
      const pts = await pg.evaluate((s) => [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => window.scene.screenOf(s.x + dx, s.y + dy, 0.035)), other);
      const lumAt = (A) => pts.filter((p) => p && p.visible).reduce((v, p) => v + Math.max(...diffAt(A, off, p.clientX, p.clientY)), 0);
      dimR = lumAt(on) / Math.max(0.5, lumAt(onF));
    }
    check(`#53 focus ${F}: the columns are ${F}'s ${uiEx.byDac[F].length} systems only, and another DAC's halo (${other && other.n}) dims >= 3x`,
      stF.dacs.focus === F && fc.length === uiEx.byDac[F].length && fc.every((c) => c.tag === F) && dimR != null && dimR >= 3, {focus: stF.dacs.focus, cols: fc.length, want: uiEx.byDac[F].length, dimRatio: dimR && +dimR.toFixed(1)});
    await pg.close();
  } catch (e) { check('#53 example drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (5) the REAL page at 1600x900: DACs tab, Show example (screenshot), focusDac via a DAC click frames its systems in the
  // uncovered map; the watermark keeps out of the HUD avoid rects (the page's #c4DacEx banner among them)
  try {
    const rp = hook(await browser.newPage({viewport: {width: 1600, height: 900}}));
    await rp.addInitScript(() => { let v; Object.defineProperty(window, 'C4Scene', {configurable: true, get: () => v, set: (x) => {
      v = x; const m = x.mount; x.mount = (...a) => { const s = m(...a); window.__scene = s; return s; }; }}); });
    await rp.goto(`http://127.0.0.1:${port}/C4Live/index.html`);
    await rp.waitForFunction(() => window.__scene && window.__scene.getStats().frames > 30, null, {timeout: 30000});
    await new Promise((r) => setTimeout(r, 3500));
    await rp.click('.c4-tab[data-tab="dacs"]'); await new Promise((r) => setTimeout(r, 400));
    await rp.click('[data-dac-example]'); await new Promise((r) => setTimeout(r, 2500));
    const st = await rp.evaluate(() => window.__scene.getStats());
    await rp.screenshot({path: path.join(process.env.SHOT_DIR || os.tmpdir(), 'c4-dacs-example-1600.png')});
    const mk = st.dacs && st.dacs.mark, av = (st.insets.avoid || []);
    const cr = await rp.evaluate(() => { const r = document.querySelector('#c4Map canvas').getBoundingClientRect(); return [r.left, r.top]; });
    check(`#53 real page, DACs tab + Show example: ${st.dacs ? st.dacs.cols.length : 0} DAC columns stand and the EXAMPLE watermark keeps out of the insets and all ${av.length} avoid rects`,
      !!st.dacs && st.dacs.example && st.dacs.cols.length === dom.size && !!mk && av.length > 0
        && av.every((a) => !(mk.left - cr[0] < a.right && mk.right - cr[0] > a.left && mk.top - cr[1] < a.bottom && mk.bottom - cr[1] > a.top))
        && mk.left - cr[0] >= st.insets.left && mk.right - cr[0] <= 1600 - st.insets.right && mk.top - cr[1] >= st.insets.top && mk.bottom - cr[1] <= 900 - st.insets.bottom,
      {mark: mk, insets: {l: st.insets.left, r: st.insets.right, t: st.insets.top, b: st.insets.bottom}, avoid: av.length});
    // focusDac: the most spread DAC, a mid one and a one-system one (if any)
    const spread = (t) => { const r = uiEx.byDac[t]; const xs = r.map((s) => s.x), ys = r.map((s) => s.y); return Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)); };
    const tags = order.filter((t) => uiEx.byDac[t].length).sort((a, b) => spread(b) - spread(a));
    const pick = [...new Set([tags[0], tags[Math.floor(tags.length / 2)], tags.find((t) => uiEx.byDac[t].length === 1) || tags[tags.length - 1]])];
    const res = [];
    for (const t of pick) {
      const ok = await rp.evaluate((t) => window.__scene.focusDac && window.__scene.focusDac(t), t);
      await rp.waitForFunction(() => !window.__scene.getStats().flying, null, {timeout: 15000}); await new Promise((r) => setTimeout(r, 300));
      const out = await rp.evaluate(([rows]) => {
        const s = window.__scene, st = s.getStats(), i = st.insets, r = document.querySelector('#c4Map canvas').getBoundingClientRect();
        return rows.filter((q) => { const p = s.screenOf(q.x, q.y, 0); if (!p) return true; const x = p.clientX - r.left, y = p.clientY - r.top;
          return x < i.left || x > r.width - i.right || y < i.top || y > r.height - i.bottom; }).map((q) => q.n);
      }, [uiEx.byDac[t]]);
      const sv = await rp.evaluate(() => window.__scene.getStats().systemView);
      res.push({t, ok, systems: uiEx.byDac[t].length, outside: out, sysView: !!sv});
    }
    const unknown = await rp.evaluate(() => window.__scene.focusDac && window.__scene.focusDac('NOPE-NOT-A-DAC'));
    check(`#53 focusDac frames every system of the DAC inside the uncovered map and opens no system view (${pick.join(', ')})`, res.length >= 2 && res.every((r) => r.ok === true && r.outside.length === 0 && !r.sysView), res);
    check('#53 NEGATIVE: focusDac(unknown tag) -> false', unknown === false, unknown);
    await rp.close();
  } catch (e) { check('#53 real-page drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }
  check('#53 no page errors during the task #53 drives', errs.length === 0, errs.slice(0, 4));
}

// ---------------- task #55 (scene v7: DAC CONQUEST lens; owner 2026-11-07 "remove the faction colors and each DAC shows up
// with its own color ... the map 'conquered' by that DAC if they are the biggest miners there"). ONLY_T55=1 runs this alone.
// OLD_BUNDLE=<#53 bundle 15ae9afd> fails every browser acceptance; the model checks fail on the #53 model.js (no dacConquest).
async function task55(browser, port, latest, events) {
  const errs = [];
  const MD = await import('data:text/javascript,' + encodeURIComponent(fs.readFileSync(path.join(ROOT, 'C4Live/scene-src/model.js'), 'utf8')));
  const UI = require(path.join(ROOT, 'C4Live/c4-ui-model.js'));
  const parsed = UI.parseDacs(JSON.parse(fs.readFileSync(path.join(ROOT, 'C4Live/dacs.json'), 'utf8')));
  const realList = UI.resolveDacs(latest, parsed.dacs).dacs.map((x) => ({tag: x.tag, color: x.color, members: x.profiles.slice()}));
  const exList = UI.resolveDacs(latest, UI.exampleDacs(latest, parsed.dacs)).dacs.map((x) => ({tag: x.tag, color: x.color, members: x.profiles.slice()}));
  const hexOf = new Map(exList.map((d) => [d.tag, d.color]));
  const hasMD = typeof MD.dacConquest === 'function', hasUI = typeof UI.dacConquest === 'function';
  // semantic form of a result: systems with a winner or contested (the panels' copy may also list systems no DAC scores
  // at), strength and scores rounded to 1e-9 (the two copies may add the metric shares in another order)
  const r9 = (v) => Math.round(v * 1e9) / 1e9;
  const norm = (r) => r && JSON.stringify({systems: r.systems.filter((s) => s.winner || s.contested).map((s) => ({a: s.a, n: s.n, x: s.x, y: s.y, winner: s.winner, contested: !!s.contested,
    strength: r9(s.strength), scores: Object.fromEntries(Object.entries(s.scores || {}).filter(([, v]) => v > 0).map(([k, v]) => [k, r9(v)]).sort((p, q) => (p[0] < q[0] ? -1 : 1)))})),
    byDac: Object.fromEntries(Object.entries(r.byDac || {}).sort((p, q) => (p[0] < q[0] ? -1 : 1))), contested: r.contested});
  // (1) synthetic set with hand-computed answers - run through BOTH copies. S1: AAA and BBB one stake each (stakes tie ->
  // contested). S2: mining AAA 3 u/s vs BBB 1 (AAA 0.75); fleets AAA 2 + BBB 6 + an NPC 4 ships (BBB 6/12); combat AAA 1
  // (a kill recorded twice counts once) vs BBB 3 -> mining+combat = 1.0 vs 1.0 -> contested. Out-of-window, far-from-any-
  // system and quiet-gone events are ignored. S3: a non-member stake only (no DAC scores -> not listed).
  const synL = {generatedAt: 1000, systems: [{a: 'S1', n: 'One', x: 0, y: 0}, {a: 'S2', n: 'Two', x: 10, y: 0}, {a: 'S3', n: 'Three', x: 20, y: 0}],
    asteroids: [{a: 'A2', sys: 'S2', x: 10.4, y: 0}],
    fleets: [{a: 'fa', o: 'pa', npc: 0, ships: 2, x: 10.4, y: 0, s: {kind: 'mining', asteroid: 'A2'}, mine: {out: [{ups: 3}]}},
      {a: 'fb', o: 'pb', npc: 0, ships: 6, x: 10.4, y: 0, s: {kind: 'mining', asteroid: 'A2'}, mine: {out: [{ups: 1}]}},
      {a: 'fn', o: 'npcO', npc: 2, ships: 4, x: 10, y: 0, s: {kind: 'docked', system: 'S2'}}],
    stakes: [{o: 'pa', sys: 'S1'}, {o: 'pb', sys: 'S1'}, {o: 'px', sys: 'S3'}]};
  const synE = [{k: 'destroyed', t: 990, f: 'fz', o: 'pa', x: 10.1, y: 0}, {k: 'combat', t: 991, f: 'fz', o: 'pa', dead: true, x: 10.1, y: 0},
    {k: 'combat', t: 992, f: 'fb', o: 'pb', x: 10.2, y: 0}, {k: 'combat', t: 993, f: 'fb', x: 9.9, y: 0}, {k: 'starbaseCombat', t: 994, f: 'fb', o: 'pb', x: 10, y: 0.3},
    {k: 'combat', t: 1000 - 86400, f: 'fa', o: 'pa', x: 10, y: 0}, {k: 'combat', t: 995, f: 'fa', o: 'pa', x: 15, y: 0}, {k: 'gone', t: 996, f: 'fa', o: 'pa', x: 10, y: 0}, {k: 'combat', t: 997, f: 'fq', o: 'pa', npc: true, x: 0.2, y: 0}];
  const synD = [{tag: 'AAA', color: '#ff0000', members: ['pa']}, {tag: 'BBB', color: '#00ff00', members: ['pb']}];
  const S = (a, n, x, winner, contested, strength, scores) => ({a, n, x, y: 0, winner, contested, strength, scores});
  const cases = [
    ['stakes: a one-each tie at S1 -> contested', ['stakes'], null, {systems: [S('S1', 'One', 0, null, true, 0, {AAA: 0.5, BBB: 0.5})], byDac: {AAA: 0, BBB: 0}, contested: 1}],
    ['mining: AAA 3 of 4 u/s at S2', ['mining'], null, {systems: [S('S2', 'Two', 10, 'AAA', false, 0.75, {AAA: 0.75, BBB: 0.25})], byDac: {AAA: 1, BBB: 0}, contested: 0}],
    ['fleets: BBB 6 of 12 ships at S2 (the NPC counts in the total)', ['fleets'], null, {systems: [S('S2', 'Two', 10, 'BBB', false, 0.5, {AAA: 2 / 12, BBB: 0.5})], byDac: {AAA: 0, BBB: 1}, contested: 0}],
    ['combat: BBB 3 of 4 events at S2 (a double-recorded kill once; old / far / quiet events ignored; an event without o resolves via its fleet; an npc:true event at S1 never counts for AAA)', ['combat'], null, {systems: [S('S2', 'Two', 10, 'BBB', false, 0.75, {AAA: 0.25, BBB: 0.75})], byDac: {AAA: 0, BBB: 1}, contested: 0}],
    ['mining+combat: 1.0 vs 1.0 at S2 -> contested', ['mining', 'combat'], null, {systems: [S('S2', 'Two', 10, null, true, 0, {AAA: 1, BBB: 1})], byDac: {AAA: 0, BBB: 0}, contested: 1}],
    ['scope BBB, mining+stakes: only BBB competes; strength = score / metrics live at the system', ['mining', 'stakes'], 'BBB',
      {systems: [S('S1', 'One', 0, 'BBB', false, 0.5, {BBB: 0.5}), S('S2', 'Two', 10, 'BBB', false, 0.25, {BBB: 0.25})], byDac: {BBB: 1 + 1}, contested: 0}],
    ['no metric selected -> nothing conquered', [], null, {systems: [], byDac: {AAA: 0, BBB: 0}, contested: 0}],
  ];
  for (const [name, mets, scope, want] of cases) {
    const a = hasMD ? MD.dacConquest(synL, synE, synD, mets, scope) : null, b = hasUI ? UI.dacConquest(synL, synE, synD, mets, scope) : null;
    check(`#55 dacConquest synthetic, ${name}: model.js and c4-ui-model.js both give the hand-computed answer`, hasMD && hasUI && norm(a) === norm(want) && norm(b) === norm(want),
      {model: a && norm(a) === norm(want) ? 'ok' : a && JSON.stringify(a.systems).slice(0, 240), ui: b && norm(b) === norm(want) ? 'ok' : b && JSON.stringify(b.systems.filter((s) => s.winner || s.contested)).slice(0, 240)});
  }
  // (2) the real data with the example assignment: both copies agree for every metric set and a scope
  const sets = [['mining'], ['stakes'], ['fleets'], ['combat'], ['mining', 'stakes'], ['mining', 'stakes', 'combat'], ['mining', 'stakes', 'fleets', 'combat']];
  const eqRows = [];
  for (const m of sets) for (const sc of [null, 'CLUB']) {
    const a = hasMD ? MD.dacConquest(latest, events, exList, m, sc) : null, b = hasUI ? UI.dacConquest(latest, events, exList, m, sc) : null;
    eqRows.push({m: m.join('+'), sc, n: a ? a.systems.length : null, same: !!a && !!b && norm(a) === norm(b)});
  }
  check(`#55 dacConquest: model.js == c4-ui-model.js on the real data with the example assignment (${sets.length} metric sets x {all, scope CLUB})`,
    eqRows.every((r) => r.same) && eqRows.some((r) => r.n >= 10), eqRows.filter((r) => !r.same).slice(0, 4));
  const exM = hasMD ? MD.dacConquest(latest, events, exList, ['mining'], null) : null;
  check('#55 NEGATIVE: the equality sees a one-member difference (CLUB minus its first member -> not equal)', !!exM && hasUI
    && norm(UI.dacConquest(latest, events, exList.map((d) => (d.tag === 'CLUB' ? {...d, members: d.members.slice(1)} : d)), ['fleets'], null)) !== norm(MD.dacConquest(latest, events, exList, ['fleets'], null)));
  // independent recounts (no model code): mining = u/s of member MINING fleets at their asteroid's system; stakes = member stakes
  const astSys = new Map(latest.asteroids.map((a) => [a.a, a.sys])), tagsOf = new Map();
  for (const d of exList) for (const p of d.members) tagsOf.set(p, (tagsOf.get(p) || []).concat(d.tag));
  const recount = (kind) => {
    const v = new Map(), T = new Map();
    const add = (sys, o, n, member) => { T.set(sys, (T.get(sys) || 0) + n); if (member) for (const t of tagsOf.get(o) || []) { const m = v.get(sys) || {}; m[t] = (m[t] || 0) + n; v.set(sys, m); } };
    if (kind === 'mining') for (const f of latest.fleets) { if (f.s.kind !== 'mining') continue; const sy = astSys.get(f.s.asteroid); if (!sy) continue; add(sy, f.o, (f.mine && f.mine.out || []).reduce((a, o) => a + (o.ups || 0), 0), !f.npc); }
    if (kind === 'stakes') for (const k of latest.stakes) if (k && k.sys) add(k.sys, k.o, 1, true);
    const win = {};
    for (const [sy, m] of v) { const e = Object.entries(m).filter(([, n]) => n > 0).sort((p, q) => q[1] - p[1]); if (e.length && (e.length < 2 || e[0][1] > e[1][1])) win[sy] = e[0][0]; }
    return win;
  };
  const recM = recount('mining'), recS = recount('stakes');
  const flips = Object.keys(recM).filter((a) => recS[a] && recS[a] !== recM[a]).length + Object.keys(recS).filter((a) => !recM[a]).length + Object.keys(recM).filter((a) => !recS[a]).length;

  const hook = (pg) => { pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); }); return pg; };
  const frames = (pg, n) => pg.evaluate(async (n) => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(() => r())); }, n);
  // a grab with the DOM overlays (labels, callouts) hidden: pixels of the canvas only
  const grab = async (pg) => {
    await pg.evaluate(() => { const l = document.querySelector('.c4-sys-label'); for (const e of [...document.querySelectorAll('.c4-stat-layer'), l && l.parentElement]) if (e) e.style.visibility = 'hidden'; });
    const b64 = (await pg.screenshot()).toString('base64');
    await pg.evaluate(() => { const l = document.querySelector('.c4-sys-label'); for (const e of [...document.querySelectorAll('.c4-stat-layer'), l && l.parentElement]) if (e) e.style.visibility = ''; });
    return pg.evaluate(async (d) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      return {w: c.width, h: c.height, d: Array.from(x.getImageData(0, 0, c.width, c.height).data)};
    }, b64);
  };
  const diffPx = (A, B, thr = 6) => { let n = 0; for (let i = 0; i < A.d.length; i += 4) if (Math.abs(A.d[i] - B.d[i]) + Math.abs(A.d[i + 1] - B.d[i + 1]) + Math.abs(A.d[i + 2] - B.d[i + 2]) > thr) n++; return n; };
  const diffAt = (A, B, x, y, r = 3) => { const s = [0, 0, 0]; let n = 0; for (let j = Math.round(y) - r; j <= Math.round(y) + r; j++) for (let i = Math.round(x) - r; i <= Math.round(x) + r; i++) { if (i < 0 || j < 0 || i >= A.w || j >= A.h) continue; const k = (j * A.w + i) * 4; for (let c = 0; c < 3; c++) s[c] += Math.max(0, A.d[k + c] - B.d[k + c]); n++; } return s.map((v) => v / Math.max(1, n)); };
  const hue = ([r, g, b]) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (d <= 0) return null; const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return (h * 60 + 360) % 360; };
  const sat = ([r, g, b]) => { const mx = Math.max(r, g, b); return mx ? (mx - Math.min(r, g, b)) / mx : 0; };
  const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const hueGap = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };
  // saturated pixels whose hue is a faction's (MUD / ONI / USTUR, within 25 deg)
  const FH = ['#ff6040', '#3ec8ff', '#ffcc33'].map((h) => hue(hexRgb(h)));
  const factionPx = (A) => { let n = 0; for (let i = 0; i < A.d.length; i += 4) { const p = [A.d[i], A.d[i + 1], A.d[i + 2]]; if (Math.max(...p) < 50 || sat(p) < 0.45) continue; const h = hue(p); if (h != null && FH.some((f) => hueGap(f, h) <= 25)) n++; } return n; };
  const satPx = (A) => { let n = 0; for (let i = 0; i < A.d.length; i += 4) { const p = [A.d[i], A.d[i + 1], A.d[i + 2]]; if (Math.max(...p) >= 50 && sat(p) >= 0.45) n++; } return n; };
  const dev = async () => {
    const pg = hook(await browser.newPage({viewport: {width: 1600, height: 900}}));
    await pg.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html?reduced=1&nobodies=1`);
    await pg.waitForFunction(() => window.scene && window.scene.getStats().frames > 20, null, {timeout: 30000});
    await pg.evaluate(() => { document.getElementById('bar').style.display = 'none'; window.noFocusOnPick = true; });
    return pg;
  };
  const ALL = ['mining', 'stakes', 'fleets', 'combat'];

  // (3) the REAL list (12 DACs, no members) + lens on: no DAC colour anywhere, and the faction colours are gone
  try {
    const pg = await dev();
    await pg.evaluate(() => window.scene.setLayer('combat', false)); // the heat glow is orange by design (not a faction tint)
    await new Promise((r) => setTimeout(r, 1200)); await frames(pg, 10);
    const off = await grab(pg);
    await pg.evaluate((list) => window.scene.setDacs({dacs: list, example: false, focus: null}), realList); await frames(pg, 6);
    const off2 = await grab(pg), noise = diffPx(off2, off);
    const r = await pg.evaluate(([list, ALL]) => { window.scene.setDacs({dacs: list, example: false, focus: null, lens: {on: true, metrics: ALL, scope: null}}); return window.scene.setStatLayer('dacs'); }, [realList, ALL]);
    await frames(pg, 8);
    const on = await grab(pg), st = await pg.evaluate(() => window.scene.getStats());
    // faction colour, anchored at the starbases (the nebula / grid backdrop has faction-like hues of its own, so a whole-
    // frame count cannot tell): for every MUD / ONI / USTUR system of level >= 2, the mean colour of 7x7 boxes 1.5 units out
    // (its territory + glyph glow). Faction-coloured = saturation >= 0.35 and hue within 30 deg of its faction.
    const FHEX = {mud: '#ff6040', oni: '#3ec8ff', ustur: '#ffcc33'};
    const fsys = latest.systems.filter((s) => FHEX[s.f] && (s.lvl || 0) >= 2);
    const fpts = await pg.evaluate((rows) => rows.map((s) => [[1.5, 0], [-1.5, 0], [0, 1.5], [0, -1.5]].map(([dx, dy]) => window.scene.screenOf(s.x + dx, s.y + dy, 0.01))), fsys);
    const boxMean = (A, x, y, r = 3) => { const s = [0, 0, 0]; let n = 0; for (let j = Math.round(y) - r; j <= Math.round(y) + r; j++) for (let i = Math.round(x) - r; i <= Math.round(x) + r; i++) { if (i < 0 || j < 0 || i >= A.w || j >= A.h) continue; const k = (j * A.w + i) * 4; for (let c = 0; c < 3; c++) s[c] += A.d[k + c]; n++; } return s.map((v) => v / Math.max(1, n)); };
    const matched = (A) => { let m = 0, n = 0; fsys.forEach((s, i) => { const want = hue(hexRgb(FHEX[s.f])); for (const p of fpts[i]) { if (!p || !p.visible) continue; const c = boxMean(A, p.clientX, p.clientY), h = hue(c); n++; if (sat(c) >= 0.35 && h != null && hueGap(h, want) <= 30) m++; } }); return {m, n}; };
    const mOff = matched(off2), mOn = matched(on);
    const lbl = await pg.evaluate(() => [...document.querySelectorAll('.c4-sys-label')].slice(0, 40).map((e) => e.style.borderLeftColor || e.style.borderLeft));
    check(`#55 real dacs.json (no members) + lens on: faction-coloured probes around ${fsys.length} starbases ${mOn.m}/${mOn.n} vs ${mOff.m}/${mOff.n} with the lens off (<= 10 % of it)`,
      r === true && mOff.n >= 40 && mOff.m >= 0.5 * mOff.n && mOn.m <= 0.1 * mOff.m, {off: mOff, on: mOn});
    // no DAC colour: the 12 member-less DACs draw exactly what NO DAC list draws under the same lens (a DAC with no members
    // paints nothing); the faction check above is the part that fails on the #53 bundle
    await pg.evaluate((ALL) => window.scene.setDacs({dacs: [], example: false, focus: null, lens: {on: true, metrics: ALL, scope: null}}), ALL); await frames(pg, 8);
    const none = await grab(pg), nNone = diffPx(on, none);
    await pg.evaluate(([list, ALL]) => window.scene.setDacs({dacs: list, example: false, focus: null, lens: {on: true, metrics: ALL, scope: null}}), [realList, ALL]); await frames(pg, 8);
    check(`#55 real list + lens: the 12 member-less DACs draw no colour (${nNone} px differ from an empty DAC list, frame noise ${noise})`, nNone <= Math.max(150, noise * 2), {nNone, noise});
    check('#55 real list + lens: nothing is conquered (0 systems, 0 columns) and the system labels lose the faction colour',
      !!(st.dacs && st.dacs.lens) && st.dacs.lens.on === true && st.dacs.lens.systems.filter((s) => s.winner || s.contested).length === 0 && st.statLayer.columns === 0
        && lbl.length > 5 && lbl.every((c) => /138, 148, 166|8a94a6/i.test(c)), {lens: st.dacs && st.dacs.lens && {on: st.dacs.lens.on, n: st.dacs.lens.systems.length}, cols: st.statLayer.columns, lbl: lbl.slice(0, 2)});
    // control: lens off again -> the lens-never-on pixels (within the frame noise)
    await pg.evaluate((list) => window.scene.setDacs({dacs: list, example: false, focus: null, lens: {on: false, metrics: ['mining'], scope: null}}), realList);
    await pg.evaluate(() => window.scene.setStatLayer(null)); await frames(pg, 8);
    const back = await grab(pg), nBack = diffPx(back, off2);
    { const where = []; for (let i = 0; i < back.d.length && where.length < 8; i += 4) if (Math.abs(back.d[i] - off2.d[i]) + Math.abs(back.d[i + 1] - off2.d[i + 1]) + Math.abs(back.d[i + 2] - off2.d[i + 2]) > 6) where.push([(i / 4) % back.w, Math.floor(i / 4 / back.w), back.d.slice(i, i + 3), off2.d.slice(i, i + 3)]);
      console.log('INFO  #55 lens-off diff at', JSON.stringify(where)); }
    // (~4 s pass between the two grabs: a transiting fleet moves a few px - measured 20-42 px, all at one moving hull)
    check(`#55 control: lens off -> today's pixels again (${nBack} px differ, frame noise ${noise}; <= 150 = a moving hull or two)`, nBack <= Math.max(150, noise * 2), {nBack, noise});
    await pg.close();
  } catch (e) { check('#55 real-list lens drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (4) the example + lens: conquered space in the winner's hue; a contested system neutral; winners follow the metrics
  try {
    const pg = await dev();
    await pg.evaluate(() => { for (const l of window.C4Scene.layers) window.scene.setLayer(l, false); });
    await frames(pg, 6);
    const off = await grab(pg);
    await pg.evaluate((list) => { window.scene.setDacs({dacs: list, example: true, focus: null, lens: {on: true, metrics: ['mining'], scope: null}}); window.scene.setStatLayer('dacs'); }, exList);
    await frames(pg, 10);
    const on = await grab(pg), st = await pg.evaluate(() => window.scene.getStats());
    const L = (st.dacs && st.dacs.lens) || {systems: []};
    const winM = Object.fromEntries(L.systems.filter((s) => s.winner).map((s) => [s.a, s.winner]));
    const same = (A, B) => Object.keys(A).length === Object.keys(B).length && Object.keys(A).every((k) => A[k] === B[k]);
    check(`#55 lens mining: the scene's winners = an independent recount (${Object.keys(recM).length} systems: member mining u/s at the asteroid's system)`, Object.keys(recM).length >= 5 && same(winM, recM),
      {scene: Object.keys(winM).length, recount: Object.keys(recM).length, diff: Object.keys(recM).filter((a) => winM[a] !== recM[a]).slice(0, 3)});
    const sys = new Map(latest.systems.map((s) => [s.a, s]));
    const conqAll = L.systems.filter((s) => s.winner || s.contested).map((s) => ({...s, ...sys.get(s.a)}));
    // isolated: no OTHER conquered system within 3.0, and no system won by a DIFFERENT DAC within 6.0 (2 x the field's
    // sigma - the soft conquest field of another DAC bends the hue there; task #56 round 2, list-independent after the
    // lead's 10-DAC example of 2026-11-07 23:45 put Eternity's EMP next to AEP)
    const iso = conqAll.filter((s) => s.winner && sat(hexRgb(hexOf.get(s.winner))) >= 0.45 && conqAll.every((o) => o.a === s.a || (Math.hypot(o.x - s.x, o.y - s.y) > 3.0
      && (o.winner === s.winner || Math.hypot(o.x - s.x, o.y - s.y) > 6.0)))).slice(0, 6);
    const probes = [];
    // the stat columns stand on the won systems: a probe the column covers on screen measures the column, not the space
    // (task #58: with the fainter territory-like fill, Eternity's yellow-green column tone-maps to hue 38 on its +y probe)
    const colBox = await pg.evaluate(() => { const o = []; for (let i = 0; ; i++) { const c = window.scene.statColumnScreen(i); if (!c) break; o.push([c.base.clientX, c.top.clientY, c.base.clientY]); } return o; });
    const onCol = (p) => colBox.some(([x, t, b]) => Math.abs(p.clientX - x) <= 7 && p.clientY >= t - 6 && p.clientY <= b + 6);
    for (const s of iso) {
      const pts = await pg.evaluate((s) => [[1.2, 0], [-1.2, 0], [0, 1.2], [0, -1.2]].map(([dx, dy]) => window.scene.screenOf(s.x + dx, s.y + dy, 0.01)), s);
      const cs = pts.filter((p) => p && p.visible && !onCol(p)).map((p) => diffAt(on, off, p.clientX, p.clientY));
      const mean = [0, 1, 2].map((i) => cs.reduce((v, c) => v + c[i], 0) / Math.max(1, cs.length));
      const want = hue(hexRgb(hexOf.get(s.winner))), got = hue(mean);
      probes.push({n: s.n, tag: s.winner, np: cs.length, lum: +Math.max(...mean).toFixed(1), want: Math.round(want), got: got == null ? null : Math.round(got), gap: got == null ? 999 : Math.round(hueGap(want, got))});
    }
    check(`#55 lens mining: at ${probes.length} isolated conquered systems the space 1.2 units out (clear of its column) carries the winner DAC's hue (within 30 deg) and is lit`, probes.length >= 3 && probes.every((p) => p.np >= 2 && p.lum >= 4 && p.gap <= 30), probes);
    const co = st.statLayer.callouts || [];
    // callouts: ONE per DAC (the top DACs by systems won), "TAG · conquers N systems" with N = the recount's count
    const wonN = {}; for (const t of Object.values(recM)) wonN[t] = (wonN[t] || 0) + 1;
    const coTags = co.map((c) => c.line.split(' ')[0]), topN = Math.max(...Object.values(wonN));
    check(`#55 lens mining: one column per won system (${Object.keys(winM).length}) in the winner's colour; one callout per DAC reading "TAG · conquers N systems" (top: ${coTags[0]})`,
      (st.dacs.cols || []).length === Object.keys(winM).length && st.dacs.cols.every((c) => winM[c.sys] === c.tag && c.hex === hexOf.get(c.tag))
        && co.length >= 3 && new Set(coTags).size === co.length && wonN[coTags[0]] === topN
        && co.every((c) => { const t = c.line.split(' ')[0], n = wonN[t]; return winM[c.sys] === t && c.line === `${t} · conquers ${n} system${n === 1 ? '' : 's'}`; }),
      {cols: (st.dacs.cols || []).length, want: Object.keys(winM).length, lines: co.slice(0, 4).map((c) => c.line), wonN});
    // metrics switch: stakes -> the recount's stake winners (and the map really changes where they differ)
    await pg.evaluate((list) => window.scene.setDacs({dacs: list, example: true, focus: null, lens: {on: true, metrics: ['stakes'], scope: null}}), exList); await frames(pg, 8);
    const stS = await pg.evaluate(() => window.scene.getStats()), onS = await grab(pg);
    const winS = Object.fromEntries(stS.dacs.lens.systems.filter((s) => s.winner).map((s) => [s.a, s.winner]));
    check(`#55 switching metrics to stakes: winners = the recount (${Object.keys(recS).length} systems; ${flips} systems change hands vs mining) and the pixels change`,
      flips > 0 && same(winS, recS) && diffPx(onS, on) > 2000, {scene: winS, recount: recS, px: diffPx(onS, on)});
    // contested: the example's one contested system (Ecclesia, fleets) sits 0.38 from Serene - too dense to probe. So two
    // test DACs of one real player each, chosen where those two players TIE (same docked ships, or same stake count) at a
    // system with no other system of theirs within 3 units; colours magenta / green, so a winner's tint would read as
    // saturated. The tie is found by plain counting here (docked ships / stakes per owner), not by the model.
    let tie = null;
    for (const m of ['fleets', 'stakes']) {
      const per = new Map(), where = new Map();
      if (m === 'stakes') for (const k of latest.stakes) { if (!k || !k.sys) continue; const x = per.get(k.sys) || {}; x[k.o] = (x[k.o] || 0) + 1; per.set(k.sys, x); }
      else for (const f of latest.fleets) { if (f.npc || f.s.kind !== 'docked' || !f.s.system) continue; const x = per.get(f.s.system) || {}; x[f.o] = (x[f.o] || 0) + (f.ships || 0); per.set(f.s.system, x); }
      for (const [a, x] of per) for (const o of Object.keys(x)) where.set(o, (where.get(o) || new Set()).add(a));
      for (const [a, x] of per) {
        const s = sys.get(a); if (!s) continue;
        const e = Object.entries(x).sort((p, q) => q[1] - p[1]);
        if (e.length < 2 || e[0][1] !== e[1][1] || (e[2] && e[2][1] === e[0][1])) continue;
        // other places these two own (docked fleets / stakes; mining or resting fleets could add more, the scene stats show them)
        const others = [...new Set([...where.get(e[0][0]), ...where.get(e[1][0])])].filter((b) => b !== a).map((b) => sys.get(b)).filter(Boolean);
        const near = Math.min(Infinity, ...others.map((o) => Math.hypot(o.x - s.x, o.y - s.y)));
        if (near > 3 && (!tie || near > tie.near)) tie = {m, a, s, near, o1: e[0][0], o2: e[1][0]};
      }
      if (tie) break;
    }
    const cprobe = [];
    let stT = null;
    if (tie) {
      const tieDacs = [{tag: 'TIEA', color: '#ff00ff', members: [tie.o1]}, {tag: 'TIEB', color: '#00ff00', members: [tie.o2]}];
      await pg.evaluate(([d, m]) => window.scene.setDacs({dacs: d, example: false, focus: null, lens: {on: true, metrics: [m], scope: null}}), [tieDacs, tie.m]); await frames(pg, 8);
      stT = await pg.evaluate(() => window.scene.getStats());
      const onT = await grab(pg);
      const row = stT.dacs.lens.systems.find((q) => q.a === tie.a);
      const pts = await pg.evaluate((s) => [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => window.scene.screenOf(s.x + dx, s.y + dy, 0.01)), tie.s);
      const cs = pts.filter((p) => p && p.visible).map((p) => diffAt(onT, off, p.clientX, p.clientY));
      const mean = [0, 1, 2].map((i) => cs.reduce((v, c) => v + c[i], 0) / Math.max(1, cs.length));
      cprobe.push({n: tie.s.n, m: tie.m, near: +tie.near.toFixed(1), contested: !!(row && row.contested), lum: +Math.max(...mean).toFixed(1), sat: +sat(mean).toFixed(2), noColumn: !stT.dacs.cols.some((c) => c.sys === tie.a)});
    }
    check(`#55 a contested system (two test DACs tie at ${tie ? tie.s.n : '?'}) draws neutral: low saturation, lit, no column`, cprobe.length === 1 && cprobe.every((p) => p.contested && p.lum >= 2 && p.sat <= 0.35 && p.noColumn), cprobe);
    // scope: only the DAC holding the most conquered systems (all four metrics, unscoped; ties -> first tag) competes ->
    // every listed system is its (chosen from the data, not a fixed tag: the example list changes with dacs.json)
    const ALL4 = ['mining', 'stakes', 'fleets', 'combat'], wonAll = {};
    for (const s0 of (hasMD ? MD.dacConquest(latest, events, exList, ALL4, null).systems : [])) if (s0.winner) wonAll[s0.winner] = (wonAll[s0.winner] || 0) + 1;
    const scopeTag = Object.entries(wonAll).sort((p, q) => q[1] - p[1] || (p[0] < q[0] ? -1 : 1)).map((e) => e[0])[0] || null;
    await pg.evaluate(([list, t]) => window.scene.setDacs({dacs: list, example: true, focus: null, lens: {on: true, metrics: ['mining', 'stakes', 'fleets', 'combat'], scope: t}}), [exList, scopeTag]); await frames(pg, 6);
    const stC = await pg.evaluate(() => window.scene.getStats());
    const scWon = stC.dacs.lens.systems.filter((s) => s.winner).length;
    check(`#55 scope ${scopeTag} (the DAC with the most conquered systems, ${wonAll[scopeTag]}): only it is painted (${scWon} won of ${stC.dacs.lens.systems.length} listed, all ${scopeTag})`,
      !!scopeTag && stC.dacs.lens.scope === scopeTag && scWon >= 3 && stC.dacs.lens.systems.every((s) => s.winner === scopeTag || (!s.winner && !s.contested)), {n: stC.dacs.lens.systems.length, won: scWon, wonAll});
    // NEGATIVE: the same rule on the UNSCOPED result sees other winners (the check can fail)
    const stU = hasMD ? MD.dacConquest(latest, events, exList, ALL4, null) : {systems: []};
    check(`#55 NEGATIVE: unscoped, the same "all ${scopeTag}" rule fails (other DACs win systems)`, !stU.systems.every((s) => s.winner === scopeTag || (!s.winner && !s.contested)));
    await pg.close();
  } catch (e) { check('#55 example lens drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (5) the REAL page at 1600x900: screenshots of the lens (mining; mining+stakes+combat), then focusDac('CLUB') frames all
  // CLUB systems in the open map AND clear of every avoid rect (verifier finding B)
  try {
    const rp = hook(await browser.newPage({viewport: {width: 1600, height: 900}}));
    await rp.addInitScript(() => { let v; Object.defineProperty(window, 'C4Scene', {configurable: true, get: () => v, set: (x) => {
      v = x; const m = x.mount; x.mount = (...a) => { const s = m(...a); window.__scene = s; return s; }; }}); });
    await rp.goto(`http://127.0.0.1:${port}/C4Live/index.html`);
    await rp.waitForFunction(() => window.__scene && window.__scene.getStats().frames > 30, null, {timeout: 30000});
    await new Promise((r) => setTimeout(r, 3500));
    await rp.click('.c4-tab[data-tab="dacs"]'); await new Promise((r) => setTimeout(r, 400));
    await rp.click('[data-dac-example]'); await new Promise((r) => setTimeout(r, 2500));
    const shotDir = process.env.SHOT_DIR || os.tmpdir();
    for (const [m, file] of [[['mining'], 'c4-conquest-mining-1600.png'], [['mining', 'stakes', 'combat'], 'c4-conquest-msc-1600.png']]) {
      await rp.evaluate(([list, m]) => { window.__scene.setDacs({dacs: list, example: true, focus: null, lens: {on: true, metrics: m, scope: null}}); window.__scene.setStatLayer('dacs'); }, [exList, m]);
      await new Promise((r) => setTimeout(r, 1500));
      await rp.screenshot({path: path.join(shotDir, file)});
    }
    const inf = UI.dacInfluence(latest, exList).byDac;
    const focusRes = async (tag) => {
      const ok = await rp.evaluate((t) => window.__scene.focusDac && window.__scene.focusDac(t), tag);
      await rp.waitForFunction(() => !window.__scene.getStats().flying, null, {timeout: 15000}); await new Promise((r) => setTimeout(r, 300));
      const res = await rp.evaluate((rows) => {
        const s = window.__scene, st = s.getStats(), i = st.insets, av = i.avoid || [], r = document.querySelector('#c4Map canvas').getBoundingClientRect();
        const bad = rows.filter((q) => { const p = s.screenOf(q.x, q.y, 0); if (!p) return true; const x = p.clientX - r.left, y = p.clientY - r.top;
          return x < i.left || x > r.width - i.right || y < i.top || y > r.height - i.bottom || av.some((a) => x >= a.left && x <= a.right && y >= a.top && y <= a.bottom); }).map((q) => q.n);
        return {bad, avoid: av.length};
      }, inf[tag] || []);
      return {tag, ok, n: (inf[tag] || []).length, ...res};
    };
    // the DAC with the most influence systems (from the data; ties -> first tag), not a fixed tag
    const focusTag = Object.entries(inf).map(([k, v]) => [k, v.length]).sort((p, q) => q[1] - p[1] || (p[0] < q[0] ? -1 : 1))[0][0];
    const club = await focusRes(focusTag);
    check(`#55 focusDac('${focusTag}') (the DAC with the most systems) on the real page: ${club.n - club.bad.length}/${club.n} of its systems in the open map and clear of all ${club.avoid} avoid rects`,
      club.ok === true && club.n >= 3 && club.avoid > 0 && club.bad.length === 0, club);
    // every example DAC at three viewports (the HUD covers more of a small one)
    const allRes = [];
    for (const [w, h] of [[1600, 900], [1280, 720], [1366, 768]]) {
      await rp.setViewportSize({width: w, height: h}); await new Promise((r) => setTimeout(r, 900));
      for (const d of exList) if ((inf[d.tag] || []).length) { const r = await focusRes(d.tag); allRes.push({vp: w + 'x' + h, ...r}); }
    }
    const badAll = allRes.filter((r) => r.ok !== true || r.bad.length);
    check(`#55 focusDac: every example DAC at 1600x900, 1280x720 and 1366x768 (${allRes.length} framings) keeps all its systems in the open map, clear of the avoid rects`,
      allRes.length >= 15 && badAll.length === 0, badAll.slice(0, 4));
    await rp.close();
  } catch (e) { check('#55 real-page drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }
  check('#55 no page errors during the task #55 drives', errs.length === 0, errs.slice(0, 4));
}

// ---------------- task #58 + #57 (scene v8; owner 2026-11-07 18:15 EST "make the conquest look like soft territory, not
// discs" and 17:35 EST "the combat rings should also just show when combat button is selected"). ONLY_T58=1 runs this
// alone. OLD_BUNDLE=<v7 bundle 36dab572> fails the acceptances marked FIX; the ones marked GUARD pass on it too (they keep
// a property the old code already had). The conquest checks run on a COPY of the real latest.json with test claim stakes
// added for two test DACs at real systems that have no stake (so the geometry is chosen here, by plain distance maths):
// a pair 11.6-12.4 units apart (TESTA), an isolated TESTA win, and a TESTA / TESTB tie (contested).
// ---------------- v10 (owner 2026-11-08: "It still feels like a transision, I want the star system on the same map, all
// the way zoomable"): ONE continuous world - every system always drawn, no system view, LOD by on-screen size only. Replaces
// the #56 view checks. Data-independent: the busiest system = most docked fleets; the target hull = its first medium
// docked fleet by address (else its first). (a) continuity of a 60-step wheel zoom home -> one hull (OLD_BUNDLE=<pre-v10
// bundle> must FAIL it), (b) two neighbouring systems show their bodies at once, (c) one world scale for hulls and bodies, no
// px floor, (d) picking at 3 scales, (e) no clipping at minDistance, (f) fps, (g) systemView once per change, hysteresis.
// ONLY_V10=1 runs this block alone; V10_PARTS=a,c runs only those parts.
const V10 = {STEPS: 60, POP: 1.5, OP_JUMP: 0.25, AREA_SPREAD: 0.25, FPS: 55}; // POP / OP_JUMP calibrated in (a); AREA_SPREAD in (c)
async function taskV10(browser, port, latest, bodies) {
  const errs = [];
  const parts = new Set((process.env.V10_PARTS || 'a,b,c,d,e,f,g').split(','));
  const shots = process.env.SHOT_DIR || os.tmpdir();
  const pages = [];
  const open = async (q = '', w = 1600, h = 900, route = null) => {
    const pg = await browser.newPage({viewport: {width: w, height: h}});
    pages.push(pg);
    if (route) await pg.route('**/C4Live/c4-scene.js*', route);
    pg.on('pageerror', (e) => errs.push(String(e)));
    pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
    await pg.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html?${q}`);
    await pg.waitForFunction(() => window.scene && window.scene.getStats().frames > 30 && window.bodies, null, {timeout: 30000});
    await pg.evaluate(() => { document.getElementById('bar').style.display = 'none'; document.getElementById('tip').style.visibility = 'hidden'; });
    return pg;
  };
  const raf = (pg, n = 2) => pg.evaluate((n) => new Promise((ok) => { let k = 0; const f = () => (++k >= n ? ok() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
  // decode a screenshot in the page: mean luminance (0-255) and lit share (lum > 30) of the frame, downscaled 4x; or the
  // mean luminance of an n x n box
  const decode = (pg, b64, scale) => pg.evaluate(async ([d, k]) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
    const w = Math.max(1, Math.round(img.width / k)), h = Math.max(1, Math.round(img.height / k)), c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0, w, h); const px = g.getImageData(0, 0, w, h).data;
    let s = 0, lit = 0; for (let i = 0; i < px.length; i += 4) { const l = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]; s += l; if (l > 30) lit++; }
    return {lum: s / (w * h), lit: lit / (w * h)};
  }, [b64, scale]);
  const frameLum = async (pg, file) => { const buf = await pg.screenshot(); if (file) fs.writeFileSync(file, buf); return decode(pg, buf.toString('base64'), 4); };
  const boxLum = async (pg, x, y, r) => { const n = 2 * r + 1; const buf = await pg.screenshot({clip: {x: Math.round(x) - r, y: Math.round(y) - r, width: n, height: n}}); return (await decode(pg, buf.toString('base64'), 1)).lum; };
  // pixels changed in an n x n box between two states (count of px whose luminance moved > 12)
  const boxShot = async (pg, x, y, r) => { const n = 2 * r + 1; return (await pg.screenshot({clip: {x: Math.max(0, Math.round(x) - r), y: Math.max(0, Math.round(y) - r), width: n, height: n}})).toString('base64'); };
  const changed = (pg, a, b) => pg.evaluate(async ([a, b]) => {
    const px = async (d) => { const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, c.width, c.height).data; };
    const p = await px(a), q = await px(b); let n = 0;
    for (let i = 0; i < p.length; i += 4) { const l1 = 0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2], l2 = 0.2126 * q[i] + 0.7152 * q[i + 1] + 0.0722 * q[i + 2]; if (Math.abs(l1 - l2) > 12) n++; }
    return n;
  }, [a, b]);
  const clampXY = (p, w = 1600, h = 900) => [Math.min(w - 4, Math.max(4, p.clientX)), Math.min(h - 4, Math.max(4, p.clientY))];
  // the probe target, by rule
  const T = (() => {
    const cnt = new Map();
    for (const f of latest.fleets) if (f.s && f.s.kind === 'docked' && f.s.system) cnt.set(f.s.system, (cnt.get(f.s.system) || 0) + 1);
    const a = [...cnt].sort((p, q) => q[1] - p[1] || (p[0] < q[0] ? -1 : 1))[0][0], s = latest.systems.find((x) => x.a === a);
    const docked = latest.fleets.filter((f) => f.s && f.s.kind === 'docked' && f.s.system === a).sort((p, q) => (p.a < q.a ? -1 : 1));
    const f = docked.find((x) => x.flagSize === 'medium') || docked[0];
    return {sys: s, fleet: f, nDocked: cnt.get(a)};
  })();
  const MIN_D = 0.00096 * 0.5 * 900 / Math.tan(21 * Math.PI / 180) / 40; // minDistance by the v10 rule at 900 px (medium hull 40 px)
  const aimAt = async (pg) => { const p = await pg.evaluate((id) => window.scene.fleetScreen(id), T.fleet.a); const [x, y] = clampXY(p); await pg.mouse.move(x, y); return p; };
  try {
    // ---------------- (a) continuity: 60 wheel steps (reduced motion: each step lands in one frame), home -> minDistance.
    // The cursor sits on the target system's centre while the camera is farther than A_SWITCH, then on the target hull.
    // POP metric (v11): every frame is compared with the PREVIOUS frame warped by the step's own camera motion - the
    // plane-to-plane homography from 4 map points round the orbit target (screenOf before and after the step). Motion
    // (zooming, content sliding out of the frame) is explained by the warp; what is left is what appeared, vanished or
    // changed brightness in place. Constant-px marks (glyph rings, constant-px lines) keep their size while the plane
    // zooms, so each pixel may match anything in the 3x3 neighbourhood of the warped previous frame (4x downscale: +-4 px):
    // residual = mean over the covered frame of the luminance (0-255) outside [min, max] of that neighbourhood. Per step
    // also every layer's drawn opacity (lodProbe; a pre-v10 bundle reports its view reveal systemView.fade instead) and
    // galaxyFade. Bounds: residual <= POP, opacity step <= OP_JUMP. The plain frame luminance step is logged (INFO) - it
    // also moves when a bright star slides out of the frame, which is not a pop.
    // CALIBRATION (v11, 2026-11-08): this bundle max 0.78 (step 51), every other step <= 0.7; the pre-v10 bundle
    // (OLD_BUNDLE = v10 base) 3.2 at step 20, where its system view pops in (viewReveal 0.48 in one step) - POP 1.5.
    // Opacity: this bundle 0.20 (star hand-over), the first v10 bundle (linear-px bands) 0.32, pre-v10 0.48 - OP_JUMP 0.25.
    // NEGATIVE: OLD_BUNDLE=<pre-v10 bundle> must fail both bounds.
    if (parts.has('a')) {
      const pg = await open('reduced=1');
      await sleep(400);
      const A_SWITCH = 0.6;
      const lnStep = Math.log(128 / MIN_D) / V10.STEPS, deltaY = lnStep / Math.log(1 / 0.9) * 100, rec = [];
      // what does not ride the map plane is left out of the diff: the parallax backdrop (nebula + starfield, _backdrop;
      // a bundle without the hook keeps it) and the DOM labels (constant px; their fades are CSS transitions, C8 covers DOM)
      await pg.evaluate(() => { const S = window.scene; if (S._backdrop) S._backdrop(false); else if (S._starfield) S._starfield(false); S.setLayer('labels', false); });
      await raf(pg, 3);
      const grab = async (k) => { const buf = await pg.screenshot(); if (process.env.V10_ALLSHOTS || k % 6 === 0) fs.writeFileSync(path.join(shots, `v10a-${String(k).padStart(2, '0')}.png`), buf); return buf.toString('base64'); };
      const ptsNow = (W) => pg.evaluate((W) => W.map(([x, y]) => window.scene.screenOf(x, y, 0)), W);
      // homography (8 unknowns, h33 = 1) taking screen points P[i] -> Q[i]
      const homog = (P, Q) => {
        const A = [], b = [];
        for (let i = 0; i < 4; i++) {
          const [x, y] = P[i], [u, v] = Q[i];
          A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
          A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
        }
        for (let c = 0; c < 8; c++) {
          let p = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
          [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
          if (Math.abs(A[c][c]) < 1e-12) return null;
          for (let r = 0; r < 8; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let q = c; q < 8; q++) A[r][q] -= f * A[c][q]; b[r] -= f * b[c]; }
        }
        return b.map((x, i) => x / A[i][i]);
      };
      const residual = (prev, cur, H) => pg.evaluate(async ([a, b, H]) => {
        const K = 4, load = async (d) => { const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode(); const w = Math.round(img.width / K), h = Math.round(img.height / K), c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.drawImage(img, 0, 0, w, h); const px = g.getImageData(0, 0, w, h).data, L = new Float32Array(w * h); for (let i = 0; i < w * h; i++) L[i] = 0.2126 * px[4 * i] + 0.7152 * px[4 * i + 1] + 0.0722 * px[4 * i + 2]; return {w, h, L}; };
        const P = await load(a), C = await load(b);
        // the previous frame warped onto this one (NaN = not covered), then the 3x3 tolerance
        const Wp = new Float32Array(C.w * C.h).fill(NaN);
        for (let y = 0; y < C.h; y++) for (let x = 0; x < C.w; x++) {
          const X = (x + 0.5) * K, Y = (y + 0.5) * K, z = H[6] * X + H[7] * Y + 1;
          const u = (H[0] * X + H[1] * Y + H[2]) / z / K - 0.5, v = (H[3] * X + H[4] * Y + H[5]) / z / K - 0.5;
          if (!(u >= 0 && v >= 0 && u < P.w - 1.001 && v < P.h - 1.001)) continue;
          const i = Math.floor(u), j = Math.floor(v), fu = u - i, fv = v - j, o = j * P.w + i;
          Wp[y * C.w + x] = (P.L[o] * (1 - fu) + P.L[o + 1] * fu) * (1 - fv) + (P.L[o + P.w] * (1 - fu) + P.L[o + P.w + 1] * fu) * fv;
        }
        let s = 0, n = 0, lum = 0;
        for (let y = 0; y < C.h; y++) for (let x = 0; x < C.w; x++) {
          if (Number.isNaN(Wp[y * C.w + x])) continue;
          let lo = Infinity, hi = -Infinity;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            const yy = Math.min(C.h - 1, Math.max(0, y + dy)), xx = Math.min(C.w - 1, Math.max(0, x + dx)), q = Wp[yy * C.w + xx];
            const qq = Number.isNaN(q) ? 0 : q; if (qq < lo) lo = qq; if (qq > hi) hi = qq;
          }
          const cl = C.L[y * C.w + x]; s += cl > hi ? cl - hi : cl < lo ? lo - cl : 0; lum += cl; n++;
        }
        return {res: n ? s / n : 0, lum: n ? lum / n : 0, cov: n / (C.w * C.h)};
      }, [prev, cur, H]);
      let prev = await grab(0);
      const probeSt = () => pg.evaluate(() => { const s = window.scene.getStats(); return {dist: s.camera.dist, tx: s.camera.tx, ty: s.camera.ty, gal: s.galaxyFade, vf: s.systemView ? s.systemView.fade : 0, sv: s.systemView && s.systemView.name, lod: window.scene.lodProbe ? window.scene.lodProbe() : null}; });
      let st = await probeSt();
      rec.push({k: 0, ...st, ...(await decode(pg, prev, 4)), pop: 0});
      for (let k = 1; k <= V10.STEPS; k++) {
        if (st.dist > A_SWITCH) { const p = await pg.evaluate((s) => window.scene.screenOf(s.x, s.y, 0), T.sys); const [x, y] = clampXY(p); await pg.mouse.move(x, y); } else await aimAt(pg);
        const e = 0.06 * st.dist, W = [[st.tx - e, st.ty - e], [st.tx + e, st.ty - e], [st.tx + e, st.ty + e], [st.tx - e, st.ty + e]];
        const before = await ptsNow(W);
        await pg.mouse.wheel(0, -deltaY);
        await raf(pg, 3); await sleep(280); // label opacity transitions are 0.22 s
        const after = await ptsNow(W), cur = await grab(k);
        st = await probeSt();
        const ok = before.every((p) => p && Number.isFinite(p.clientX)) && after.every((p) => p && Number.isFinite(p.clientX));
        const H = ok ? homog(after.map((p) => [p.clientX, p.clientY]), before.map((p) => [p.clientX, p.clientY])) : null;
        const r = H ? await residual(prev, cur, H) : null;
        rec.push({k, ...st, ...(await decode(pg, cur, 4)), pop: r ? r.res : null, cov: r && r.cov, H});
        prev = cur;
      }
      let lumJ = 0, lumAt = -1, opJ = 0, opAt = '', popJ = 0, popAt = -1, popN = 0;
      for (let k = 1; k < rec.length; k++) {
        const a = rec[k - 1], b = rec[k], j = Math.abs(b.lum - a.lum) / Math.max(8, (a.lum + b.lum) / 2);
        if (j > lumJ) { lumJ = j; lumAt = k; }
        if (b.pop != null && b.cov > 0.5) { popN++; if (b.pop > popJ) { popJ = b.pop; popAt = k; } }
        const ops = (r) => (r.lod ? {markers: r.gal, ...Object.fromEntries(['glyph', 'star', 'rings', 'bodies', 'station'].map((q) => [q, r.lod[q]]))} : {markers: r.gal, viewReveal: r.vf});
        const oa = ops(a), ob = ops(b), same = !a.lod || !b.lod || a.lod.sys === b.lod.sys;
        for (const q in ob) { if (q !== 'markers' && !same) continue; const d = Math.abs(ob[q] - oa[q]); if (d > opJ) { opJ = d; opAt = q + '@' + k; } }
      }
      fs.writeFileSync(path.join(shots, 'v10a-series.json'), JSON.stringify(rec, null, 0));
      const last = rec[rec.length - 1], hullPx = await pg.evaluate((id) => window.scene.fleetPixelSize(id), T.fleet.a);
      console.log(`INFO  v10 (a) ${rec.length} frames: dist ${rec[0].dist.toFixed(1)} -> ${last.dist.toFixed(4)}; plain lum step max ${(lumJ * 100).toFixed(1)} % at ${lumAt}; pop ${rec.map((r) => (r.pop == null ? '-' : r.pop.toFixed(2))).join(' ')}`);
      check(`v10 (a) continuity: a ${V10.STEPS}-step wheel zoom from home (dist ${rec[0].dist.toFixed(0)}) down to one hull (dist ${last.dist.toFixed(3)}): no step pops - the frame minus the previous frame warped by the camera move (3x3 tolerance) stays <= ${V10.POP} lum (max ${popJ.toFixed(2)} at step ${popAt}; ${popN} of ${V10.STEPS} steps measured)`,
        popJ <= V10.POP && popN >= V10.STEPS - 2 && last.dist < 0.05, {popJ: +popJ.toFixed(3), popAt, popN, lastDist: last.dist});
      check(`v10 (a) continuity: no layer's drawn opacity jumps more than ${V10.OP_JUMP} in a step (max ${opJ.toFixed(3)} ${opAt})`, opJ <= V10.OP_JUMP, {opJ: +opJ.toFixed(3), opAt});
      check(`v10 (a) the zoom reaches a single hull: ${T.fleet.flagSize} hull ${hullPx && hullPx.toFixed(1)} px at the closest step (>= 25 px)`, hullPx >= 25, hullPx);
      await pg.close();
    }

    // ---------------- (b) coexistence: the closest pair of systems that both have >= 3 bodies, with no third system within
    // 1.5 x their distance of the midpoint; camera over the midpoint at 1.7 x their distance. Probe: per body, the 7x7
    // luminance at its screen point with the world's system layers on minus off (scene._world). Both systems must light
    // >= 2 bodies. NEGATIVE: the same probe at the home view lights none (bodies under BODY_PX are not drawn).
    if (parts.has('b')) {
      const pg = await open('reduced=1');
      const by = new Map(); for (const b of bodies) { if (!by.has(b.sys)) by.set(b.sys, []); by.get(b.sys).push(b.a); }
      const S = latest.systems.filter((s) => Number.isFinite(s.x) && (by.get(s.a) || []).length >= 3);
      let pair = null;
      for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++) {
        const d = Math.hypot(S[i].x - S[j].x, S[i].y - S[j].y); if (d < 0.25 || (pair && d >= pair.d)) continue;
        const mx = (S[i].x + S[j].x) / 2, my = (S[i].y + S[j].y) / 2;
        if (latest.systems.some((o) => o !== S[i] && o !== S[j] && Math.hypot(o.x - mx, o.y - my) < 1.5 * d)) continue;
        pair = {a: S[i], b: S[j], d, mx, my};
      }
      const probe = async () => {
        const pts = await pg.evaluate((ids) => ids.map((id) => window.scene.bodyScreen(id)), [...by.get(pair.a.a), ...by.get(pair.b.a)]);
        const on = [], off = [];
        for (const p of pts) on.push(p && p.visible ? await boxLum(pg, p.clientX, p.clientY, 3) : null);
        await pg.evaluate(() => window.scene._world(false)); await raf(pg, 2);
        for (const p of pts) off.push(p && p.visible ? await boxLum(pg, p.clientX, p.clientY, 3) : null);
        await pg.evaluate(() => window.scene._world(true)); await raf(pg, 2);
        const lit = on.map((v, i) => (v != null && off[i] != null && v - off[i] > 6 ? 1 : 0));
        const na = by.get(pair.a.a).length;
        return {a: lit.slice(0, na).reduce((x, y) => x + y, 0), b: lit.slice(na).reduce((x, y) => x + y, 0)};
      };
      check('v10 (b) setup: a pair of neighbouring systems with >= 3 bodies each and no third system near them was found (geometry only)', !!pair, pair && {a: pair.a.n, b: pair.b.n, d: +pair.d.toFixed(3)});
      if (pair) {
        await pg.evaluate(({x, y, z}) => window.scene.focusPoint(x, y, z), {x: pair.mx, y: pair.my, z: 128 / (1.7 * pair.d)}); await raf(pg, 3); await sleep(500);
        const mid = await probe();
        await pg.screenshot({path: path.join(shots, 'v10b-pair.png')});
        await pg.evaluate(() => window.scene.focusPoint(0.5, 0.5, 1)); await raf(pg, 3); await sleep(500);
        const far = await probe();
        check(`v10 (b) coexistence: ${pair.a.n} and ${pair.b.n} (${pair.d.toFixed(2)} apart) BOTH show their bodies in one frame (${mid.a} + ${mid.b} bodies lit, >= 2 each)`, mid.a >= 2 && mid.b >= 2, mid);
        check(`v10 (b) NEGATIVE: the same probe at the home view finds no body drawn (${far.a + far.b})`, far.a + far.b === 0, far);
      }
      await pg.close();
    }

    // ---------------- (c) one world scale: a miner and the rock it works - fleetPixelSize / bodyPixelSize - at 6 camera
    // distances from 12 to the closest: the ratio stays the same (+-3 %), i.e. hulls are world-sized like the bodies at every
    // zoom. No px floor: at a zoom where that hull projects < HULL_PX.collapse, toggling the fleets layer changes no pixel
    // round it; positive control: at a zoom where it projects >= 12 px it does. NEGATIVE: a bundle whose FLEET_VS floors the
    // hull at 3 px (served by route) changes pixels at the small zoom.
    if (parts.has('c')) {
      const miner = latest.fleets.filter((f) => f.s && f.s.kind === 'mining').sort((p, q) => (p.a < q.a ? -1 : 1))[0];
      const rock = miner && miner.s.asteroid;
      const pg = await open('reduced=1');
      const series = [];
      for (const d of [12, 3, 1, 0.3, 0.1, MIN_D * 1.05]) {
        await pg.evaluate(({id, d}) => { const p = window.scene.fleetScreen(id); window.scene.focusPoint(p.x, p.y, 128 / d); }, {id: miner.a, d}); await raf(pg, 3);
        const r = await pg.evaluate(({id, rock}) => {
          const S = window.scene, f = S.fleetScreen(id), b = S.bodyScreen(rock);
          return {hull: S.fleetPixelSize(id), body: S.bodyPixelSize(rock), dist: S.getStats().camera.dist, ppuH: S.ppuAt(f.x, f.y), ppuB: S.ppuAt(b.x, b.y)};
        }, {id: miner.a, rock});
        series.push({...r, raw: r.hull / r.body, ratio: (r.hull / r.ppuH) / (r.body / r.ppuB)});
      }
      // v11: the raw px ratio drifts ~11 % because the hull and the rock sit at different VIEW DEPTHS on the tilted camera
      // (at dist 0.03 the rock centre is ~250 px from the hull: its px per unit differs). Each px size is divided by the
      // px per unit at its own point (ppuAt) - a px-dependent term (floor, cap, zoom compensation) in either probe would
      // still show; the GPU side is the drawn-area check below.
      const rs = series.map((s) => s.ratio), spread = Math.max(...rs) / Math.min(...rs) - 1, raw = series.map((s) => s.raw);
      console.log(`INFO  v10 (c) raw px ratio hull/rock ${Math.min(...raw).toFixed(3)}-${Math.max(...raw).toFixed(3)} (perspective: own-depth ppu ${series.map((s) => (s.ppuH / s.ppuB).toFixed(3)).join(' ')})`);
      check(`v10 (c) scale: a miner's hull / its rock's radius, each in px over the px per unit at its own depth, is the same at 6 zooms (dist 12 -> ${MIN_D.toFixed(3)}; ratio ${Math.min(...rs).toFixed(4)}-${Math.max(...rs).toFixed(4)}, spread ${(spread * 100).toFixed(2)} % <= 3 %)`,
        rs.every(Number.isFinite) && spread <= 0.03, series.map((s) => ({d: +s.dist.toFixed(3), hull: +s.hull.toFixed(2), body: +s.body.toFixed(2), ppuH: +s.ppuH.toFixed(1), ppuB: +s.ppuB.toFixed(1)})));
      // no px floor: pixels round an isolated in-flight hull with fleets on vs off, at a zoom where it projects ~0.5 px
      // and at one where it projects ~16 px
      const floorProbe = async (p) => {
        // the transit of the LARGEST hull class (so at its 0.5 px zoom every other hull nearby is smaller still), by address
        const CLS = ['xx-small', 'x-small', 'small', 'medium', 'large', 'capital', 'commander', 'titan'], ci = (f) => CLS.indexOf(f.flagSize);
        const tr = latest.fleets.filter((f) => f.s && (f.s.kind === 'subwarp' || f.s.kind === 'warp') && f.s.to && f.s.arrives > latest.generatedAt + 3600 && f.s.departs < latest.generatedAt)
          .sort((a, b) => ci(b) - ci(a) || (a.a < b.a ? -1 : 1));
        const out = {};
        for (const want of [0.5, 16]) {
          // a transit far from systems; camera distance for `want` px on its hull
          const id = tr[0].a;
          for (let it = 0; it < 3; it++) {
            await p.evaluate(({id, d}) => { const q = window.scene.fleetScreen(id); window.scene.focusPoint(q.x, q.y, 128 / d); }, {id, d: it === 0 ? 1 : out.d});
            await raf(p, 3);
            const px = await p.evaluate((id) => window.scene.fleetPixelSize(id), id);
            out.d = (it === 0 ? 1 : out.d) * px / want;
          }
          await p.evaluate(() => { for (const l of ['routes', 'combat', 'mining', 'labels', 'systems']) window.scene.setLayer(l, false); });
          await raf(p, 3);
          const q = await p.evaluate((id) => window.scene.fleetScreen(id), id), px = await p.evaluate((id) => window.scene.fleetPixelSize(id), id);
          const a = await boxShot(p, q.clientX, q.clientY, 12);
          await p.evaluate(() => window.scene.setLayer('fleets', false)); await raf(p, 3);
          const b = await boxShot(p, q.clientX, q.clientY, 12);
          await p.evaluate(() => { for (const l of ['routes', 'combat', 'mining', 'labels', 'systems', 'fleets']) window.scene.setLayer(l, true); }); await raf(p, 2);
          out[want] = {px: +px.toFixed(2), changed: await changed(p, a, b)};
        }
        return out;
      };
      const fp = await floorProbe(pg);
      check(`v10 (c) no px floor: a hull projecting ${fp[0.5].px} px (< HULL_PX.collapse 0.75) changes ${fp[0.5].changed} px when the fleets layer toggles (0); positive control: at ${fp[16].px} px it changes ${fp[16].changed} (>= 10)`,
        fp[0.5].changed === 0 && fp[0.5].px < 0.75 && fp[16].changed >= 10, fp);
      // NEGATIVE: the same probe on a bundle that floors the hull at 3 px
      const floorSrc = fs.readFileSync(BUNDLE, 'utf8').replace('float size = uShipBase * iX.y * focus * mix(1.8, 1.0, sil);',
        'float size = uShipBase * iX.y * focus * mix(1.8, 1.0, sil); size = max(size, 1.5 / ppuOf(viewOf(relOf(c, loc))));');
      if (floorSrc.includes('size = max(size, 1.5 / ppuOf')) {
        const pm = await open('reduced=1', 1600, 900, (r) => r.fulfill({status: 200, contentType: 'text/javascript', body: floorSrc}));
        const fm = await floorProbe(pm);
        check(`v10 (c) NEGATIVE: a bundle with a 3 px hull floor changes ${fm[0.5].changed} px at the small zoom (the probe catches a floor)`, fm[0.5].changed > 0, fm);
        await pm.close();
      } else check('v10 (c) NEGATIVE: the floor mutant could be built (FLEET_VS size line found in the bundle)', false);
      // GPU (v11): the drawn hull grows exactly with its projected size - the isolated transit hull at 6, 12, 24 and 48 px;
      // pixels changed by the fleets layer (all other layers off) over px^2 must stay within AREA_SPREAD. A px-dependent
      // term in FLEET_VS (cap, floor, zoom compensation) bends it. NEGATIVE: a bundle whose hull quad is scaled by
      // (px / 12)^-0.3 (a soft zoom compensation) fails the same bound.
      const areaProbe = async (p) => {
        const CLS = ['xx-small', 'x-small', 'small', 'medium', 'large', 'capital', 'commander', 'titan'], ci = (f) => CLS.indexOf(f.flagSize);
        const id = latest.fleets.filter((f) => f.s && (f.s.kind === 'subwarp' || f.s.kind === 'warp') && f.s.to && f.s.arrives > latest.generatedAt + 3600 && f.s.departs < latest.generatedAt)
          .sort((a, b) => ci(b) - ci(a) || (a.a < b.a ? -1 : 1))[0].a;
        const out = [];
        await p.evaluate(() => { for (const l of ['routes', 'combat', 'mining', 'labels', 'systems']) window.scene.setLayer(l, false); });
        for (const want of [6, 12, 24, 48]) {
          let d = 0.05;
          for (let it = 0; it < 3; it++) {
            await p.evaluate(({id, d}) => { const q = window.scene.fleetScreen(id); window.scene.focusPoint(q.x, q.y, 128 / d); }, {id, d}); await raf(p, 3);
            d *= (await p.evaluate((id) => window.scene.fleetPixelSize(id), id)) / want;
          }
          const q = await p.evaluate((id) => window.scene.fleetScreen(id), id), px = await p.evaluate((id) => window.scene.fleetPixelSize(id), id), r = Math.max(12, Math.ceil(px * 0.9));
          const a = await boxShot(p, q.clientX, q.clientY, r);
          await p.evaluate(() => window.scene.setLayer('fleets', false)); await raf(p, 3);
          const b = await boxShot(p, q.clientX, q.clientY, r);
          await p.evaluate(() => window.scene.setLayer('fleets', true)); await raf(p, 3);
          const n = await changed(p, a, b);
          out.push({px: +px.toFixed(2), n, k: +(n / (px * px)).toFixed(4)});
        }
        await p.evaluate(() => { for (const l of ['routes', 'combat', 'mining', 'labels', 'systems']) window.scene.setLayer(l, true); });
        const ks = out.map((o) => o.k);
        return {out, spread: Math.max(...ks) / Math.min(...ks) - 1};
      };
      const ar = await areaProbe(pg);
      check(`v10 (c) GPU: the drawn hull area grows with px^2 (no px-dependent term): changed px / px^2 at ${ar.out.map((o) => o.px).join(', ')} px = ${ar.out.map((o) => o.k).join(', ')} (spread ${(ar.spread * 100).toFixed(1)} % <= ${V10.AREA_SPREAD * 100} %)`,
        ar.spread <= V10.AREA_SPREAD && ar.out.every((o) => o.n > 0), ar.out);
      const compSrc = fs.readFileSync(BUNDLE, 'utf8').replace('float size = uShipBase * iX.y * focus * mix(1.8, 1.0, sil);',
        'float size = uShipBase * iX.y * focus * mix(1.8, 1.0, sil); size *= pow(max(size * 2.0 * ppuOf(viewOf(relOf(c, loc))), 0.1) / 12.0, -0.3);');
      if (compSrc.includes('/ 12.0, -0.3)')) {
        const pm = await open('reduced=1', 1600, 900, (r) => r.fulfill({status: 200, contentType: 'text/javascript', body: compSrc}));
        const am = await areaProbe(pm);
        check(`v10 (c) GPU NEGATIVE: a bundle with a soft zoom compensation (px/12)^-0.3 on the hull bends the area curve (spread ${(am.spread * 100).toFixed(1)} % > ${V10.AREA_SPREAD * 100} %)`, am.spread > V10.AREA_SPREAD, am.out);
        await pm.close();
      } else check('v10 (c) GPU NEGATIVE: the compensation mutant could be built', false);
      await pg.close();
    }

    // ---------------- (d) picking at 3 scales on the busiest system: its glyph at home (system), a planet at ~15 px
    // radius (body), the target hull at ~30 px (fleet). NEGATIVES: at home the planet's point picks the system, not the body
    // (a body under BODY_PX is not drawn = not pickable); with the fleets layer off the hull's point is not that fleet.
    if (parts.has('d')) {
      const pg = await open('reduced=1');
      const planet = bodies.filter((b) => b.sys === T.sys.a && b.k === 'planet').sort((p, q) => (p.a < q.a ? -1 : 1))[0] || bodies.find((b) => b.sys === T.sys.a);
      const at = (p) => pg.evaluate(([x, y]) => window.scene.pickAt(x, y), clampXY(p));
      const home = await pg.evaluate((s) => window.scene.screenOf(s.x, s.y, 0), T.sys);
      const pSys = await at(home);
      const homeBody = await pg.evaluate((a) => window.scene.bodyScreen(a), planet.a);
      const pHomeBody = await at(homeBody);
      // a planet at ~15 px radius
      let d = 1;
      for (let it = 0; it < 3; it++) {
        await pg.evaluate(({a, d}) => { const q = window.scene.bodyScreen(a); window.scene.focusPoint(q.x, q.y, 128 / d); }, {a: planet.a, d}); await raf(pg, 3);
        d *= (await pg.evaluate((a) => window.scene.bodyPixelSize(a), planet.a)) / 15;
      }
      const bs = await pg.evaluate((a) => window.scene.bodyScreen(a), planet.a), bpx = await pg.evaluate((a) => window.scene.bodyPixelSize(a), planet.a);
      const pBody = await at(bs);
      // the target hull at ~30 px
      d = 0.1;
      for (let it = 0; it < 3; it++) {
        await pg.evaluate(({id, d}) => { const q = window.scene.fleetScreen(id); window.scene.focusPoint(q.x, q.y, 128 / d); }, {id: T.fleet.a, d}); await raf(pg, 3);
        d = Math.max(MIN_D, d * (await pg.evaluate((id) => window.scene.fleetPixelSize(id), T.fleet.a)) / 30);
      }
      const fsx = await pg.evaluate((id) => window.scene.fleetScreen(id), T.fleet.a), hpx = await pg.evaluate((id) => window.scene.fleetPixelSize(id), T.fleet.a);
      const pFleet = await at(fsx);
      await pg.evaluate(() => window.scene.setLayer('fleets', false)); await raf(pg, 2);
      const pNoFleet = await at(fsx);
      await pg.evaluate(() => window.scene.setLayer('fleets', true));
      check(`v10 (d) picking, galaxy scale: ${T.sys.n}'s glyph picks the system`, pSys && pSys.type === 'system' && pSys.id === T.sys.a, pSys);
      check(`v10 (d) picking, system scale: planet ${planet.n} at ${bpx.toFixed(1)} px radius picks that body`, pBody && pBody.type === 'body' && pBody.id === planet.a, pBody);
      check(`v10 (d) picking, ship scale: the ${T.fleet.flagSize} hull at ${hpx.toFixed(1)} px picks that fleet`, pFleet && pFleet.type === 'fleet' && pFleet.id === T.fleet.a, pFleet);
      check('v10 (d) NEGATIVE: at home the planet\'s point is not the body (not drawn = not pickable); fleets off = not that fleet',
        !(pHomeBody && pHomeBody.type === 'body') && !(pNoFleet && pNoFleet.type === 'fleet' && pNoFleet.id === T.fleet.a), {pHomeBody, pNoFleet});
      await pg.close();
    }

    // ---------------- (e) depth at minDistance: wheel all the way in on the target hull; the camera reaches minDistance,
    // the hull is drawn whole (>= 150 px of an 81x81 box change with the fleets layer) and the near plane sits in front
    // of the map (near < camera height). NEGATIVE: tune({nearK: 5}) puts the near plane beyond the map - the same probe
    // finds the hull gone (proves it would catch clipping).
    if (parts.has('e')) {
      const pg = await open('reduced=1');
      for (let k = 0; k < 90; k++) { await aimAt(pg); await pg.mouse.wheel(0, -300); await raf(pg, 2); }
      const probe = async () => {
        await raf(pg, 3);
        const q = await pg.evaluate((id) => window.scene.fleetScreen(id), T.fleet.a);
        const a = await boxShot(pg, q.clientX, q.clientY, 40);
        await pg.evaluate(() => window.scene.setLayer('fleets', false)); await raf(pg, 3);
        const b = await boxShot(pg, q.clientX, q.clientY, 40);
        await pg.evaluate(() => window.scene.setLayer('fleets', true)); await raf(pg, 2);
        return changed(pg, a, b);
      };
      const st = await pg.evaluate(() => window.scene.getStats().camera), hpx = await pg.evaluate((id) => window.scene.fleetPixelSize(id), T.fleet.a);
      const cam = await pg.evaluate(() => { const c = window.scene.getStats().camera; return {height: c.dist * Math.cos(c.polar)}; });
      const n1 = await probe();
      await pg.screenshot({path: path.join(shots, 'v10e-min.png')});
      await pg.evaluate(() => window.scene.tune({nearK: 5})); await raf(pg, 4);
      const n2 = await probe();
      await pg.evaluate(() => window.scene.tune({nearK: 0.01})); await raf(pg, 4);
      const n3 = await probe();
      check(`v10 (e) depth: at minDistance (${st.dist.toFixed(4)} = min ${st.min.toFixed(4)}; the ${T.fleet.flagSize} hull ${hpx.toFixed(1)} px) the hull draws whole (${n1} px changed, >= 150) and the near plane ${st.near.toExponential(2)} sits in front of the map (camera height ${cam.height.toFixed(4)})`,
        Math.abs(st.dist - st.min) < 1e-6 && n1 >= 150 && st.near < cam.height * 0.5 && hpx >= 30, {n1, st});
      check(`v10 (e) NEGATIVE: a near plane beyond the map (tune nearK 5) clips it - the probe sees ${n2} px (< 20); restored: ${n3}`, n2 < 20 && n3 >= 150, {n2, n3});
      await pg.close();
    }

    // ---------------- (f) fps at home and framed on the busiest system, with the real fleets and with 4x the fleets
    // (each fleet cloned 3 times, new addresses) - >= FPS over 4 s each. NEGATIVE: the same measurement under a 20x CPU
    // throttle (CDP) reads below FPS (proves it can fail).
    if (parts.has('f')) {
      const pg = await open('');
      await sleep(3000);
      const fpsOver = async (p, ms = 4000) => { const a = await p.evaluate(() => [window.scene.getStats().frames, performance.now()]); await sleep(ms); const b = await p.evaluate(() => [window.scene.getStats().frames, performance.now()]); return (b[0] - a[0]) / ((b[1] - a[1]) / 1000); };
      const r = {};
      r.home = await fpsOver(pg);
      await pg.evaluate((a) => window.scene.focusSystem(a), T.sys.a); await sleep(2600);
      r.busiest = await fpsOver(pg);
      await pg.evaluate(() => {
        const L = window.latest, more = [];
        for (let c = 1; c <= 3; c++) for (const f of L.fleets) more.push({...f, a: f.a + '#' + c});
        window.scene.setData({...L, fleets: L.fleets.concat(more)}, window.events);
      });
      r.fleets4x = await pg.evaluate(() => window.scene.getStats().fleets);
      await sleep(800);
      r.busiest4x = await fpsOver(pg);
      await pg.evaluate(() => window.scene.focusSystem(null)); await sleep(1600);
      await pg.evaluate(() => window.scene.focusPoint(0.5, 0.5, 1)); await sleep(2000);
      r.home4x = await fpsOver(pg);
      const cdp = await pg.context().newCDPSession(pg);
      await cdp.send('Emulation.setCPUThrottlingRate', {rate: 20});
      r.throttled = await fpsOver(pg, 3000);
      await cdp.send('Emulation.setCPUThrottlingRate', {rate: 1});
      for (const k of ['home', 'busiest', 'home4x', 'busiest4x', 'throttled']) r[k] = +r[k].toFixed(1);
      console.log('INFO  v10 (f) fps ' + JSON.stringify(r));
      check(`v10 (f) fps >= ${V10.FPS}: home ${r.home}, ${T.sys.n} framed ${r.busiest}; with ${r.fleets4x} fleets: home ${r.home4x}, ${T.sys.n} ${r.busiest4x}`,
        r.home >= V10.FPS && r.busiest >= V10.FPS && r.home4x >= V10.FPS && r.busiest4x >= V10.FPS && r.fleets4x === latest.fleets.length * 4, r);
      check(`v10 (f) NEGATIVE: the same measurement under a 20x CPU throttle reads ${r.throttled} fps (< ${V10.FPS})`, r.throttled < V10.FPS, r.throttled);
      await pg.close();
    }

    // ---------------- (g) the systemView event: a wheel zoom from home all the way in on the target hull and back out
    // fires exactly [busiest, null]. Hysteresis: from the zoom where the event just went null on the way out, 8 small
    // wheel in / out pairs fire nothing. NEGATIVE: with the hysteresis removed (tune domOut = domIn) the same jitter flaps.
    if (parts.has('g')) {
      const run = async (domOut) => {
        const pg = await open('reduced=1');
        if (domOut != null) await pg.evaluate((v) => window.scene.tune({domOut: v, dcOut: 1}), domOut); // NEGATIVE: both hystereses off (size and centre)
        const ev = () => pg.evaluate(() => window.sysEvents.map((e) => (e ? e.sys : null)));
        // home distance, centred on the system: the cursor (on its hull) then stays near the view centre all the way in
        await pg.evaluate((s) => window.scene.focusPoint(s.x, s.y, 1), T.sys); await raf(pg, 3);
        for (let k = 0; k < 70; k++) { await aimAt(pg); await pg.mouse.wheel(0, -150); await raf(pg, 2); }
        const inEv = await ev();
        for (let k = 0; k < 70; k++) { await pg.mouse.wheel(0, 150); await raf(pg, 2); }
        const outEv = await ev();
        // the threshold: back in until the event fires, then out in fine steps until it goes null
        // v11: from maxDistance 240 the entry (~d 0.5) is ~100 steps of -60 away - the old 80 ended at d 1.5, short of it
        for (let k = 0; k < 200 && (await pg.evaluate(() => !window.scene.getStats().systemView)); k++) { await aimAt(pg); await pg.mouse.wheel(0, -60); await raf(pg, 2); }
        for (let k = 0; k < 80 && (await pg.evaluate(() => !!window.scene.getStats().systemView)); k++) { await pg.mouse.wheel(0, 20); await raf(pg, 2); }
        const n0 = (await ev()).length, at0 = await pg.evaluate(() => { const s = window.scene.getStats(); return {dist: +s.camera.dist.toFixed(4), view: !!s.systemView}; });
        for (let k = 0; k < 8; k++) { await pg.mouse.wheel(0, -24); await raf(pg, 2); await pg.mouse.wheel(0, 24); await raf(pg, 2); }
        const jitter = (await ev()).length - n0;
        console.log(`INFO  v10 (g) threshold run (domOut ${domOut}): at ${JSON.stringify(at0)} after the in/out search; events ${JSON.stringify(await ev())}`);
        await pg.close();
        return {inEv, outEv, jitter};
      };
      const g = await run(null);
      check(`v10 (g) systemView: the zoom in on ${T.sys.n} fires exactly [${T.sys.n}], the zoom back out exactly one null after it`,
        JSON.stringify(g.inEv) === JSON.stringify([T.sys.a]) && JSON.stringify(g.outEv) === JSON.stringify([T.sys.a, null]), g);
      check(`v10 (g) hysteresis: 8 small wheel in / out pairs at the threshold fire no event (${g.jitter})`, g.jitter === 0, g.jitter);
      const gn = await run(0.35);
      check(`v10 (g) NEGATIVE: without the hysteresis (domOut = domIn, dcOut = 1) the same jitter flaps (${gn.jitter} events)`, gn.jitter >= 4, gn.jitter);
    }
  } catch (e) { check('v10 drive completed without throwing', false, String(e && e.stack || e).slice(0, 300)); }
  for (const p of pages) if (!p.isClosed()) await p.close().catch(() => {});
  check('v10 no page errors', errs.length === 0, errs.slice(0, 4));
}

// largest per-frame step of an angle series (radians, azimuth wrap-aware)
function maxAngleStep(series) {
  let m = 0;
  for (let i = 1; i < series.length; i++) { let d = Math.abs(series[i] - series[i - 1]) % (2 * Math.PI); d = Math.min(d, 2 * Math.PI - d); m = Math.max(m, d); }
  return m;
}
// (e) task #56 add-on (owner: "when the stars in the background are behind the map they should not show"): diff the
// frame with the starfield on vs off (scene._starfield) and count changed pixels inside the projected map footprint
// (radius 60 < the 62 hide radius, y = 0). Home view and a tilted view; positive control: at the tilted view the
// starfield does change pixels OUTSIDE the footprint (stars beyond the map edge / above the horizon stay).
async function task56stars(browser, port, latest) {
  const errs = [];
  const pg = await browser.newPage({viewport: {width: 1600, height: 900}});
  pg.on('pageerror', (e) => errs.push(String(e)));
  const shots = process.env.SHOT_DIR || os.tmpdir(), tag = process.env.OLD_BUNDLE ? 'old' : 'new';
  const grab = async () => {
    const b64 = (await pg.screenshot()).toString('base64');
    return pg.evaluate(async (d) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      return {w: c.width, h: c.height, d: Array.from(x.getImageData(0, 0, c.width, c.height).data)};
    }, b64);
  };
  const frames = (n) => pg.evaluate(async (n) => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(() => r())); }, n);
  // polygon = the projected circle of radius 60 around the map centre at y = 0 (null if any point is behind the camera)
  const footprint = () => pg.evaluate(() => { const out = []; for (let k = 0; k < 96; k++) { const a = k / 96 * Math.PI * 2, p = window.scene.screenOf(0.5 + Math.cos(a) * 60, 0.5 + Math.sin(a) * 60, 0); if (!p) return null; out.push([p.clientX, p.clientY]); } return out; });
  const inPoly = (poly, x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const probe = async (name) => {
    const poly = await footprint();
    await pg.evaluate(() => window.scene._starfield(true)); await frames(6);
    const a = await grab(), a2 = await grab();
    await pg.evaluate(() => window.scene._starfield(false)); await frames(6);
    const b = await grab();
    await pg.evaluate(() => window.scene._starfield(true)); await frames(3);
    let inS = 0, outS = 0, inN = 0, inPx = 0;
    for (let y = 0; y < a.h; y += 1) for (let x = 0; x < a.w; x += 1) {
      const k = (y * a.w + x) * 4, inside = poly && inPoly(poly, x + 0.5, y + 0.5);
      const ds = Math.abs(a.d[k] - b.d[k]) + Math.abs(a.d[k + 1] - b.d[k + 1]) + Math.abs(a.d[k + 2] - b.d[k + 2]);
      const dn = Math.abs(a.d[k] - a2.d[k]) + Math.abs(a.d[k + 1] - a2.d[k + 1]) + Math.abs(a.d[k + 2] - a2.d[k + 2]);
      if (inside) { inPx++; if (ds > 6) inS++; if (dn > 6) inN++; } else if (ds > 6) outS++;
    }
    return {name, poly: !!poly, inPx, starsInside: inS, noiseInside: inN, starsOutside: outS};
  };
  try {
    await pg.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html?reduced=1&nobodies=1`);
    await pg.waitForFunction(() => window.scene && window.scene.getStats().frames > 20, null, {timeout: 30000});
    await pg.evaluate(() => { document.getElementById('bar').style.display = 'none'; });
    await frames(10);
    await pg.screenshot({path: path.join(shots, `c4-t56-stars-home-${tag}.png`)});
    // close in on fleets: the system with the most docked fleets, camera ~13 away
    const cnt = new Map(); for (const f of latest.fleets) if (f.s && f.s.kind === 'docked') cnt.set(f.s.system, (cnt.get(f.s.system) || 0) + 1);
    const top = latest.systems.find((s) => s.a === [...cnt].sort((p, q) => q[1] - p[1])[0][0]);
    await pg.evaluate((s) => window.scene.focusPoint(s.x, s.y, 10), {x: top.x, y: top.y}); await frames(10);
    await pg.screenshot({path: path.join(shots, `c4-t56-stars-fleets-${tag}.png`)});
    // the camera must be at rest before a probe (a moving frame would count as starfield pixels)
    const settle = () => pg.evaluate(async () => { let last = ''; for (let i = 0; i < 60; i++) { await new Promise((r) => setTimeout(r, 100)); const c = window.scene.getStats().camera, k = c.polar.toFixed(5) + c.azimuth.toFixed(5) + c.dist.toFixed(4) + c.tx.toFixed(4) + c.ty.toFixed(4); if (k === last) return true; last = k; } return false; });
    await pg.evaluate(() => window.scene.focusOwner(null)); await frames(10); await settle(); // home
    const home = await probe('home');
    // tilt: orbit-drag with the RIGHT button (MapControls: left pans) until the polar angle passes 0.95 rad (max 1.15), then let the damping settle
    let pol = 0;
    for (const dir of [-1, 1]) {
      await pg.mouse.move(800, 450); await pg.mouse.down({button: 'right'});
      for (let i = 1; i <= 30; i++) { await pg.mouse.move(800, 450 + dir * i * 10); await sleep(16); }
      await pg.mouse.up({button: 'right'}); await settle();
      pol = await pg.evaluate(() => window.scene.getStats().camera.polar);
      if (pol >= 0.95) break;
    }
    await pg.screenshot({path: path.join(shots, `c4-t56-stars-tilt-${tag}.png`)});
    const tilt = {...(await probe('tilt')), polar: +pol.toFixed(3)};
    const ok = (r) => r.poly && r.inPx > 10000 && r.noiseInside <= 50 && r.starsInside <= 50; // at rest: frame noise ~0
    check(`#56 (e) home view: no background star drawn inside the projected map footprint (${home.starsInside} px changed by the starfield inside, noise ${home.noiseInside})`, ok(home), home);
    check(`#56 (e) tilted view (polar ${tilt.polar}): none inside either (${tilt.starsInside} px); positive control: the starfield still lights ${tilt.starsOutside} px outside the map (>= 200)`,
      tilt.polar >= 0.95 && ok(tilt) && tilt.starsOutside >= 200, tilt);
  } catch (e) { check('#56 (e) starfield drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }
  finally { await pg.close(); }
  check('#56 (e) no page errors', errs.length === 0, errs.slice(0, 4));
}
async function task58(browser, port, latest) {
  const errs = [];
  const hook = (pg) => { pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); }); return pg; };
  const frames = (pg, n) => pg.evaluate(async (n) => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(() => r())); }, n);
  const grab = async (pg) => {
    await pg.evaluate(() => { const l = document.querySelector('.c4-sys-label'); for (const e of [...document.querySelectorAll('.c4-stat-layer'), l && l.parentElement]) if (e) e.style.visibility = 'hidden'; });
    const b64 = (await pg.screenshot()).toString('base64');
    await pg.evaluate(() => { const l = document.querySelector('.c4-sys-label'); for (const e of [...document.querySelectorAll('.c4-stat-layer'), l && l.parentElement]) if (e) e.style.visibility = ''; });
    return pg.evaluate(async (d) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      return {w: c.width, h: c.height, d: Array.from(x.getImageData(0, 0, c.width, c.height).data)};
    }, b64);
  };
  const diffPx = (A, B, thr = 6) => { let n = 0; for (let i = 0; i < A.d.length; i += 4) if (Math.abs(A.d[i] - B.d[i]) + Math.abs(A.d[i + 1] - B.d[i + 1]) + Math.abs(A.d[i + 2] - B.d[i + 2]) > thr) n++; return n; };
  // added light (on - off, clamped at 0) at a client point, mean over a (2r+1)^2 box -> [r, g, b]
  const addAt = (A, B, x, y, r = 0) => { const s = [0, 0, 0]; let n = 0; for (let j = Math.round(y) - r; j <= Math.round(y) + r; j++) for (let i = Math.round(x) - r; i <= Math.round(x) + r; i++) { if (i < 0 || j < 0 || i >= A.w || j >= A.h) continue; const k = (j * A.w + i) * 4; for (let c = 0; c < 3; c++) s[c] += Math.max(0, A.d[k + c] - B.d[k + c]); n++; } return s.map((v) => v / Math.max(1, n)); };
  const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const hue = ([r, g, b]) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (d <= 0) return null; const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return (h * 60 + 360) % 360; };
  const sat = ([r, g, b]) => { const mx = Math.max(r, g, b); return mx ? (mx - Math.min(r, g, b)) / mx : 0; };
  const hueGap = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };
  const med = (a) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[s.length >> 1] : 0; };
  const W = 1280, H = 720;
  const dev = async () => {
    const pg = hook(await browser.newPage({viewport: {width: W, height: H}}));
    await pg.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html?reduced=1&nobodies=1`);
    await pg.waitForFunction(() => window.scene && window.scene.getStats().frames > 20, null, {timeout: 30000});
    await pg.evaluate(() => { document.getElementById('bar').style.display = 'none'; window.noFocusOnPick = true; });
    return pg;
  };
  // world points -> client points (one evaluate)
  const project = (pg, pts) => pg.evaluate((pts) => pts.map(([x, y]) => { const p = window.scene.screenOf(x, y, 0.01); return p && p.visible ? [p.clientX, p.clientY] : null; }), pts);

  // ---- the test geometry: real systems without a claim stake
  const staked = new Set(latest.stakes.map((k) => k.sys));
  const free = latest.systems.filter((s) => !staked.has(s.a) && Math.hypot(s.x, s.y) < 45).sort((p, q) => (p.a < q.a ? -1 : 1));
  const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
  let A1 = null, A2 = null;
  for (const p of free) { for (const q of free) if (p !== q && dist(p, q) >= 11.6 && dist(p, q) <= 12.4) { A1 = p; A2 = q; break; } if (A1) break; }
  const Wn = A1 && free.find((s) => dist(s, A1) >= 22 && dist(s, A2) >= 22);
  const Cn = Wn && free.find((s) => dist(s, A1) >= 22 && dist(s, A2) >= 22 && dist(s, Wn) >= 22);
  const tmpl = latest.stakes[0];
  const stake = (o, s, i) => ({...tmpl, a: 'T58STAKE' + i, o, sys: s.a, sysName: s.n, x: s.x, y: s.y});
  const testStakes = A1 && Cn ? [stake('T58A', A1, 1), stake('T58A', A2, 2), stake('T58A', Wn, 3), stake('T58A', Cn, 4), stake('T58B', Cn, 5)] : [];
  const tDacs = [{tag: 'TESTA', color: '#ff3fd0', members: ['T58A']}, {tag: 'TESTB', color: '#3fff6a', members: ['T58B']}];
  const lens = (on) => ({dacs: tDacs, example: false, focus: null, lens: {on, metrics: ['stakes'], scope: null}});
  check(`#58 test geometry found: a TESTA pair ${A1 && A2 ? dist(A1, A2).toFixed(2) : '?'} units apart (${A1 && A1.n} / ${A2 && A2.n}), an isolated win (${Wn && Wn.n}), a tie (${Cn && Cn.n})`, testStakes.length === 5);
  if (testStakes.length !== 5) return;

  try {
    const pg = await dev();
    await pg.evaluate((add) => {
      for (const l of window.C4Scene.layers) window.scene.setLayer(l, false);
      window.scene.setData({...window.latest, stakes: window.latest.stakes.concat(add)}, window.events);
      window.scene.setStatLayer(null);
    }, testStakes);
    await frames(pg, 10);
    const off = await grab(pg), off2 = await grab(pg);
    const noise = diffPx(off, off2);
    const t0 = await pg.evaluate((o) => { const t = performance.now(); window.scene.setDacs(o); return performance.now() - t; }, lens(true));
    await frames(pg, 10);
    const on = await grab(pg), st = await pg.evaluate(() => window.scene.getStats());
    const rows = ((st.dacs && st.dacs.lens && st.dacs.lens.systems) || []).filter((s) => s.winner || s.contested);
    const rowOf = (s) => rows.find((r) => r.a === s.a);
    check('#58 the scene counts the test stakes: TESTA wins the pair and the isolated system, the tie is contested (4 rows)',
      rows.length === 4 && [A1, A2, Wn].every((s) => rowOf(s) && rowOf(s).winner === 'TESTA') && !!rowOf(Cn) && rowOf(Cn).contested === true, rows.map((r) => [r.n, r.winner, r.contested]));

    // (1) FIX: two systems of one DAC 12 units apart are ONE region - the space between them is lit all the way, in the
    // DAC's hue, with no border (rim) crossing it. The v7 field (nearest-system colour, sigma 2.1) leaves a dark gap.
    const segW = []; for (let i = 0; i <= 28; i++) { const t = 0.15 + 0.7 * i / 28; segW.push([A1.x + (A2.x - A1.x) * t, A1.y + (A2.y - A1.y) * t]); }
    const segS = await project(pg, segW);
    const prof = segS.map((p) => (p ? addAt(on, off, p[0], p[1], 1) : null));
    const L = prof.map((c) => (c ? +lum(c).toFixed(1) : -1));
    const mid = prof.slice(10, 19).filter(Boolean), mc = [0, 1, 2].map((k) => mid.reduce((a, c) => a + c[k], 0) / Math.max(1, mid.length));
    const gap = hue(mc) == null ? 999 : Math.round(hueGap(hue(mc), hue([255, 63, 208])));
    const mL = med(L), minL = Math.min(...L), maxL = Math.max(...L);
    check(`#58 FIX one DAC's neighbours merge: between ${A1.n} and ${A2.n} (${dist(A1, A2).toFixed(1)} units) the fill is continuous (min ${minL} >= 2 and >= 0.3 x median ${mL}), no rim inside (max ${maxL} <= 3 x median) and TESTA's hue (gap ${gap} deg <= 30)`,
      L.every((v) => v >= 0) && minL >= 2 && minL >= 0.3 * mL && maxL <= 3 * mL && gap <= 30, {L});

    // (2) FIX: an isolated win is a patch of territory, not a compass disc - the border radius varies round the system
    // (24 rays; the border = the brightest added light 2..10 units out). v7: a circle (coefficient of variation ~0).
    const RAYS = 24, rs = []; for (let r = 2; r <= 10.001; r += 0.1) rs.push(+r.toFixed(2));
    const rayW = []; for (let k = 0; k < RAYS; k++) for (const r of rs) rayW.push([Wn.x + r * Math.cos(2 * Math.PI * k / RAYS), Wn.y + r * Math.sin(2 * Math.PI * k / RAYS)]);
    const rayS = await project(pg, rayW);
    const radii = [];
    for (let k = 0; k < RAYS; k++) {
      let best = -1, br = null;
      rs.forEach((r, i) => { const p = rayS[k * rs.length + i]; if (!p) return; const v = lum(addAt(on, off, p[0], p[1], 0)); if (v > best) { best = v; br = r; } });
      radii.push(best >= 4 ? br : null);
    }
    const okR = radii.filter((r) => r != null), mR = okR.reduce((a, b) => a + b, 0) / Math.max(1, okR.length);
    const cv = Math.sqrt(okR.reduce((a, r) => a + (r - mR) ** 2, 0) / Math.max(1, okR.length)) / Math.max(1e-9, mR);
    check(`#58 FIX an isolated win (${Wn.n}) reads as territory, not a disc: its border radius varies round it (CV ${cv.toFixed(3)} in 0.04..0.35, mean ${mR.toFixed(2)} units, ${okR.length}/${RAYS} rays lit)`,
      okR.length === RAYS && cv >= 0.04 && cv <= 0.35, {radii});

    // (3) GUARD: the border is a thin line of CONSTANT screen width - measured across the rim on the +x ray at home zoom
    // and at 3x zoom (FWHM over the fill inside / the dark outside, in px)
    const rimW = async (A, B) => {
      const r0 = radii[0];
      const ends = await project(pg, [[Wn.x + r0 - 1.6, Wn.y], [Wn.x + r0 + 1.6, Wn.y]]);
      if (!ends[0] || !ends[1]) return null;
      const n = Math.ceil(Math.hypot(ends[1][0] - ends[0][0], ends[1][1] - ends[0][1]));
      const v = []; for (let i = 0; i <= n; i++) v.push(lum(addAt(A, B, ends[0][0] + (ends[1][0] - ends[0][0]) * i / n, ends[0][1] + (ends[1][1] - ends[0][1]) * i / n, 0)));
      let pk = 0; v.forEach((x, i) => { if (x > v[pk]) pk = i; });
      const inner = med(v.slice(0, Math.max(1, Math.floor(pk * 0.5)))), hi = (v[pk] + inner) / 2, ho = v[pk] / 2;
      let a = pk, b = pk; while (a > 0 && v[a - 1] >= hi) a--; while (b < v.length - 1 && v[b + 1] >= ho) b++;
      return {px: b - a + 1, peak: Math.round(v[pk]), inner: Math.round(inner), n};
    };
    const wHome = await rimW(on, off);
    await pg.evaluate((p) => window.scene.focusPoint(p[0], p[1], 3), [Wn.x + radii[0], Wn.y]);
    await pg.waitForFunction(() => !window.scene.getStats().flying, null, {timeout: 15000}); await frames(pg, 6);
    const onZ = await grab(pg);
    await pg.evaluate((o) => window.scene.setDacs(o), lens(false)); await frames(pg, 6);
    const offZ = await grab(pg);
    const wMid = await rimW(onZ, offZ);
    check(`#58 GUARD the border is a constant-px line: ${wHome && wHome.px} px at home zoom, ${wMid && wMid.px} px at 3x (each <= 4.5, within 1.5 px)`,
      !!wHome && !!wMid && wHome.px <= 4.5 && wMid.px <= 4.5 && Math.abs(wHome.px - wMid.px) <= 1.5, {wHome, wMid});
    await pg.evaluate(() => window.scene.focusOwner(null));
    await pg.waitForFunction(() => !window.scene.getStats().flying, null, {timeout: 15000});
    await pg.evaluate((o) => window.scene.setDacs(o), lens(true)); await frames(pg, 8);

    // (4) FIX: a contested system is a faint neutral hatch, not a disc - in the 0.8..3 unit annulus round the tie only
    // the hatch lines are bright: 5..50 % of the pixels reach half the annulus' 90th-percentile light (a solid disc puts
    // most of them there; bloom lifts the gaps, so an absolute threshold would not tell), it is lit (p90 >= 3) and grey
    // (saturation <= 0.35)
    const annW = []; for (let k = 0; k < 48; k++) for (let r = 0.8; r <= 3.001; r += 0.1) annW.push([Cn.x + r * Math.cos(2 * Math.PI * k / 48), Cn.y + r * Math.sin(2 * Math.PI * k / 48)]);
    const annS = (await project(pg, annW)).filter(Boolean);
    const on2 = await grab(pg);
    { const c = (await project(pg, [[Cn.x, Cn.y]]))[0], w0 = (await project(pg, [[Wn.x, Wn.y]]))[0], cl = (p) => ({x: Math.max(0, Math.round(p[0]) - 110), y: Math.max(0, Math.round(p[1]) - 80), width: 220, height: 160});
      if (c) await pg.screenshot({path: path.join(process.env.SHOT_DIR || os.tmpdir(), "c4-t58-contested.png"), clip: cl(c)});
      if (w0) await pg.screenshot({path: path.join(process.env.SHOT_DIR || os.tmpdir(), "c4-t58-isolated.png"), clip: cl(w0)}); }
    const annC = annS.map((p) => addAt(on2, off, p[0], p[1], 0)), annL = annC.map(lum).sort((p, q) => p - q), p90 = annL[Math.floor(annL.length * 0.9)] || 0;
    const litC = annC.filter((c) => lum(c) >= 0.5 * p90);
    const frac = litC.length / Math.max(1, annC.length), sMean = litC.reduce((a, c) => a + sat(c), 0) / Math.max(1, litC.length);
    check(`#58 FIX the contested system (${Cn.n}) is a neutral hatch, not a disc: ${Math.round(frac * 100)} % of the annulus at >= half its p90 light ${p90.toFixed(1)} (5..50 %; p90 >= 3), saturation ${sMean.toFixed(2)} <= 0.35`,
      annC.length > 300 && p90 >= 3 && frac >= 0.05 && frac <= 0.5 && sMean <= 0.35, {n: annC.length, frac: +frac.toFixed(3), p90: +p90.toFixed(1), sat: +sMean.toFixed(2)});

    // (5) GUARD (v7 passes too: its neutral territory is below the 3-level threshold): unconquered space is empty under the lens even with the TERRITORY layer on (v7 drew the faction territory
    // in neutral grey-blue): far from every test system, lens on + territory on == lens on + territory off
    const farW = []; for (const s of latest.systems) if ([A1, A2, Wn, Cn].every((q) => dist(s, q) >= 9) && farW.length < 400) farW.push([s.x + 0.6, s.y + 0.6]);
    const farS = (await project(pg, farW)).filter(Boolean);
    await pg.evaluate(() => window.scene.setLayer('territory', true)); await frames(pg, 6);
    const terrOn = await grab(pg);
    await pg.evaluate(() => window.scene.setLayer('territory', false)); await frames(pg, 6);
    const terrOff = await grab(pg);
    const farLit = farS.filter((p) => lum(addAt(terrOn, terrOff, p[0], p[1], 1)) >= 3).length;
    // positive control: the same points with the lens OFF and the territory on vs off DO differ (the faction territory)
    await pg.evaluate((o) => { window.scene.setDacs(o); window.scene.setLayer('territory', true); }, lens(false)); await frames(pg, 6);
    const terrOnNoLens = await grab(pg);
    const ctrlLit = farS.filter((p) => lum(addAt(terrOnNoLens, terrOff, p[0], p[1], 1)) >= 3).length;
    check(`#58 GUARD unconquered space stays empty under the lens with the territory layer on: ${farLit}/${farS.length} far points lit (<= 2 %; control: ${ctrlLit} lit with the lens off, >= 25 %)`,
      farS.length >= 100 && farLit <= farS.length * 0.02 && ctrlLit >= farS.length * 0.25, {farLit, ctrlLit, n: farS.length});
    await pg.evaluate(() => window.scene.setLayer('territory', false));

    // (6) GUARD: lens off -> no DAC pixels (the lens-never-on frame again, within the frame noise)
    await frames(pg, 6);
    const back = await grab(pg), nBack = diffPx(back, off);
    check(`#58 GUARD lens off -> no conquest pixels (${nBack} px differ from the lens-never-on frame; noise ${noise})`, nBack <= Math.max(150, noise * 2), {nBack, noise});

    // (7) GUARD: cost - the field is built on setDacs only (${t0} ms here), and the frame JS stays < 1 ms with the lens on
    await pg.evaluate((o) => window.scene.setDacs(o), lens(true));
    const cpu = await pg.evaluate(async () => { await new Promise((r) => setTimeout(r, 2300)); return window.scene.getStats().cpuMs; });
    check(`#58 GUARD cost: setDacs with the lens builds the field in ${Math.round(t0)} ms (<= 400, once per change); JS per frame ${cpu} ms with the lens on (<= 1.0)`, t0 <= 400 && cpu > 0 && cpu <= 1.0, {t0, cpu});
    await pg.close();
  } catch (e) { check('#58 conquest drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (8) task #57 FIX: the combat heat / pulse rings draw only while the Combat stat layer leads. Positive control: with
  // setStatLayer('combat') the 'combat' layer switch changes many pixels; with mining / fleets / owners / dacs / null it
  // changes none (the rings are hidden). The v7 bundle draws them under every tab.
  try {
    const pg = await dev();
    await pg.evaluate(() => { for (const l of window.C4Scene.layers) window.scene.setLayer(l, l === 'combat'); });
    const res = {};
    for (const tab of ['combat', 'mining', 'fleets', 'owners', 'dacs', null]) {
      await pg.evaluate((t) => { window.scene.setStatLayer(t); window.scene.setLayer('combat', true); }, tab); await frames(pg, 8);
      const a = await grab(pg), a2 = await grab(pg);
      await pg.evaluate(() => window.scene.setLayer('combat', false)); await frames(pg, 8);
      const b = await grab(pg);
      res[String(tab)] = {px: diffPx(a, b), noise: diffPx(a, a2)};
    }
    const neg = ['mining', 'fleets', 'owners', 'dacs', 'null'];
    check(`#57 FIX combat rings only on the Combat tab: the combat switch changes ${res.combat.px} px under 'combat' (>= 400) and <= max(150, 2 x noise) under ${neg.join(' / ')} (${neg.map((k) => res[k].px).join(' / ')})`,
      res.combat.px >= 400 && neg.every((k) => res[k].px <= Math.max(150, res[k].noise * 2)), res);
    await pg.close();
  } catch (e) { check('#57 combat-rings drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }
  check('#58 / #57 no page errors', errs.length === 0, errs.slice(0, 4));
}

// ---------------- task #50 (scene v5 look polish). OLD_BUNDLE=<v4 bundle> fails every acceptance below (the frame-time
// budget is a guard, not a fix). T50_PARTS=1,3 runs only those blocks; ONLY_T50=1 runs this block alone.
async function task50(browser, port, latest, events, bodies) {
  const errs = [];
  const part = (n) => !process.env.T50_PARTS || process.env.T50_PARTS.split(',').includes(String(n));
  const sysN = (n) => latest.systems.find((s) => s.n === n);
  const hook = (pg) => { pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); }); return pg; };
  const dev = async (query, vp = {width: 1600, height: 900}) => {
    const pg = hook(await browser.newPage({viewport: vp}));
    await pg.goto(`http://127.0.0.1:${port}/C4Live/scene-src/dev.html${query}`);
    await pg.waitForFunction(() => window.scene && window.scene.getStats().frames > 20, null, {timeout: 30000});
    await pg.evaluate(() => { document.getElementById('bar').style.display = 'none'; window.noFocusOnPick = true; });
    return pg;
  };
  // until the camera is still for 20 frames (and, in a system view, the view has fully faded in), then the label fade
  const settle = (pg, ms = 600, sc = 'scene') => pg.evaluate(async ([ms, sc]) => {
    const raf = () => new Promise((r) => requestAnimationFrame(() => r()));
    let last = '', same = 0;
    for (let f = 0; f < 900 && same < 20; f++) {
      await raf(); const s = window[sc].getStats(), p0 = window[sc].screenOf(0, 0), v = s.systemView;
      const k = (p0 ? Math.round(p0.clientX * 10) + ',' + Math.round(p0.clientY * 10) : '-') + (v ? v.fade.toFixed(3) : '') + s.flying;
      same = k === last && !s.flying && (!v || v.fade > 0.99) ? same + 1 : 0; last = k;
    }
    await new Promise((r) => setTimeout(r, ms));
  }, [ms, sc]);
  // REAL-page-like HUD at 1600x900 (the dock 452 px on the right, the KPI bar on top, the brand + faction / layers cards)
  const HUD = {right: 452, top: 77, avoid: [{left: 12, top: 12, right: 182, bottom: 88}, {left: 12, top: 100, right: 202, bottom: 366}]};
  // label elements by the mount's DOM order (canvas, galaxy labels, stat layer, system-view labels) - the same in the v4
  // bundle, which has no label classes, so OLD_BUNDLE runs measure the same elements
  // v10: system names, body and starbase labels share ONE label layer and ONE de-collision (no system-view layer)
  const GAL_LBL = '#map > div:nth-of-type(1) > div', SYS_LBL = '#map > div:nth-of-type(1) > div';
  const over = (a, b, tol = 2) => Math.min(a[2], b[2]) - Math.max(a[0], b[0]) > tol && Math.min(a[3], b[3]) - Math.max(a[1], b[1]) > tol;
  // visible label boxes from the DOM itself (not the scene's bookkeeping): displayed, effective opacity > 0.05
  const domLabels = (pg, sel) => pg.evaluate((sel) => [...document.querySelectorAll(sel)].map((el) => {
    let op = 1, e = el; while (e && e !== document.body) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') { op = 0; break; } op *= +cs.opacity; e = e.parentElement; }
    const r = el.getBoundingClientRect();
    return {t: el.textContent, prio: +el.dataset.prio || 0, op, box: [r.left, r.top, r.right, r.bottom]};
  }).filter((l) => l.op > 0.05 && l.box[2] > l.box[0]), sel);
  const overlaps = (ls) => { const o = []; for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++) if (over(ls[i].box, ls[j].box)) o.push([ls[i].t, ls[j].t]); return o; };
  // a label hidden by the de-collision must have lost to a label of >= its priority at its default spot (or had no open spot)
  const prioOk = (lay, vis) => lay.filter((l) => !l.vis && l.hide === 'collide').filter((l) => !vis.some((v) => v.prio >= l.prio && over(l.def, v.box, -1.5)));

  // (1) label de-collision: home framing + three system views; (6) system labels keep out of the phone HUD
  if (part(1)) try {
    // home framing on the REAL page (where the verifier saw VOSTALGIA / SOLETUD, VERBIS CLUSTER / MARVAM collide - the v4 bundle
    // still shows exactly those two pairs here), full motion, after the intro settles; the page's own HUD insets and stat layer stay as they are
    const rp = hook(await browser.newPage({viewport: {width: 1600, height: 900}}));
    await rp.addInitScript(() => { let v; Object.defineProperty(window, 'C4Scene', {configurable: true, get: () => v, set: (x) => {
      v = x; const m = x.mount; x.mount = (...a) => { const s = m(...a); window.__scene = s; return s; }; }}); });
    await rp.goto(`http://127.0.0.1:${port}/C4Live/index.html`);
    await rp.waitForFunction(() => window.__scene && window.__scene.getStats().frames > 30, null, {timeout: 30000});
    await new Promise((r) => setTimeout(r, 4000)); await settle(rp, 800, '__scene');
    const vis = await domLabels(rp, GAL_LBL.replace('#map', '#c4Map')), lay = await rp.evaluate(() => window.__scene.labelLayout && window.__scene.labelLayout());
    await rp.close();
    let pg = await dev('?reduced=1');
    const ov = overlaps(vis);
    check(`#50 home framing (real page, 1600x900): ${vis.length} visible system labels, no two boxes overlap by > 2 px`, vis.length >= 25 && ov.length === 0, {visible: vis.length, overlaps: ov.slice(0, 6)});
    const bad = lay ? prioOk(lay.galaxy, vis) : null;
    check('#50 home framing: every label the de-collision hides lost to a label of >= its priority (never a higher one hidden)', !!lay && bad.length === 0,
      lay ? {hidden: lay.galaxy.filter((l) => !l.vis).length, bad: bad.slice(0, 4).map((l) => [l.n, l.prio])} : 'no labelLayout probe');
    const top = vis.filter((l) => l.prio >= 150).map((l) => l.t), tops = lay ? lay.galaxy.filter((l) => l.prio >= 150 && l.hide !== 'covered') : [];
    check('#50 home framing: every lvl-5 label in the open map is shown (the top tier never fades for a lower one)', tops.length >= 3 && tops.every((l) => l.vis), {shown: top.length, tier: tops.length, hidden: tops.filter((l) => !l.vis).map((l) => l.n)});
    // three system views: Evernat (8 bodies), Serene, one more 8-body system
    const per = new Map(); for (const b of bodies) per.set(b.sys, (per.get(b.sys) || 0) + 1);
    const eight = latest.systems.filter((s) => per.get(s.a) === 8 && s.n !== 'Evernat').sort((a, b) => a.n.localeCompare(b.n))[0]
      || latest.systems.filter((s) => s.n !== 'Evernat' && s.n !== 'Serene').sort((a, b) => (per.get(b.a) || 0) - (per.get(a.a) || 0))[0];
    for (const s of [sysN('Evernat'), sysN('Serene'), eight]) {
      await pg.evaluate((a) => window.scene.focusSystem(a), s.a); await settle(pg, 700);
      const v = await domLabels(pg, SYS_LBL), L = await pg.evaluate(() => window.scene.labelLayout && window.scene.labelLayout());
      const o = overlaps(v), b2 = L ? prioOk([...L.galaxy, ...L.system], v) : null;
      const name = L && L.galaxy.find((l) => l.n === s.n);
      check(`#50 system view ${s.n} (${per.get(s.a)} bodies): ${v.length} visible labels, none overlapping > 2 px; hidden ones lost to >= priority; the system name shows`,
        v.length >= 4 && o.length === 0 && !!L && b2.length === 0 && !!name && name.vis, {visible: v.length, overlaps: o.slice(0, 4), bad: b2 && b2.map((l) => l.n), name: name && name.vis});
    }
    await pg.close();
    // phone 390x844: brand box + KPI row on top, the dock from y 352 down (the real page's phone layout)
    pg = await dev('?reduced=1', {width: 390, height: 844});
    const PH = {bottom: 844 - 352, avoid: [{left: 8, top: 8, right: 150, bottom: 44}, {left: 8, top: 48, right: 382, bottom: 100}]};
    await pg.evaluate((h) => window.scene.setInsets(h), PH);
    await pg.evaluate((a) => window.scene.focusSystem(a), sysN('Serene').a); await settle(pg, 700);
    const pv = await domLabels(pg, SYS_LBL);
    const inHud = pv.filter((l) => PH.avoid.some((a) => over(l.box, [a.left, a.top, a.right, a.bottom], 0)) || l.box[3] > 352 + 1 || l.box[1] < 0 || l.box[0] < 0 || l.box[2] > 390);
    const sb = pv.find((l) => /starbase lvl/i.test(l.t));
    check('#50 phone 390x844 Serene: no visible system-view label under the brand / KPI boxes, the dock or off the canvas', pv.length >= 2 && inHud.length === 0,
      {visible: pv.map((l) => l.t.slice(0, 18)), inHud: inHud.map((l) => [l.t.slice(0, 24), l.box.map(Math.round)]), starbase: sb ? sb.box.map(Math.round) : 'hidden or moved'});
    await pg.close();
  } catch (e) { check('task #50 labels drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (2) a deep-space callout is clickable: pointer cursor, pick {type:'point', x, y, source:'callout'}, and the camera flies there
  if (part(2)) try {
    const pg = await dev('?reduced=1');
    let found = null;
    for (const L of ['combat', 'fleets', 'mining', 'owners']) {
      await pg.evaluate((L) => window.scene.setStatLayer(L), L); await settle(pg, 300);
      found = await pg.evaluate(() => {
        const el = [...document.querySelectorAll('.c4-stat-callout')].find((e) => !e.dataset.sys && e.style.display !== 'none');
        if (!el) return null; const r = el.getBoundingClientRect(), i = window.scene.getStats().statLayer.callouts.find((c) => !c.sys && c.shown);
        return {x: r.left + r.width / 2, y: r.top + r.height / 2, cursor: getComputedStyle(el).cursor, name: el.textContent, top: document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === el || el.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)), c: i};
      });
      if (found) { found.layer = L; break; }
    }
    if (!found) throw new Error('no deep-space callout on any stat layer');
    const cols = await pg.evaluate(() => { const o = []; for (let i = 0; ; i++) { const c = window.scene.statColumnScreen(i); if (!c) break; o.push(c); } return o; });
    const col = cols.find((c) => !c.sys && found.name.toUpperCase().startsWith(String(found.c && found.c.name || '').toUpperCase().slice(0, 6)));
    check(`#50 deep-space callout (${found.layer}: "${found.name.slice(0, 30)}") shows a pointer cursor and is the element under its centre`, found.cursor === 'pointer' && found.top, {cursor: found.cursor, top: found.top});
    await pg.evaluate(() => { window.lastPick = null; });
    await pg.mouse.click(found.x, found.y);
    await settle(pg, 200);
    const after = await pg.evaluate(() => ({pick: window.lastPick}));
    const p = after.pick;
    const tgt = p && await pg.evaluate(([x, y]) => window.scene.screenOf(x, y, 0), [p.x, p.y]);
    const dist = tgt && Math.hypot(tgt.clientX - 800, tgt.clientY - 450);
    check('#50 clicking it emits pick {type:"point", x, y, source:"callout"} at its cell', !!p && p.type === 'point' && p.source === 'callout' && Number.isFinite(p.x) && Number.isFinite(p.y)
      && (!col || (Math.abs(col.x - p.x) < 1e-6 && Math.abs(col.y - p.y) < 1e-6)), p);
    check(`#50 ...and the scene flies there itself (the cell ends at the map centre, ${dist ? dist.toFixed(1) : '?'} px off; camera at mid zoom)`, !!tgt && dist < 25, {tgt: tgt && [Math.round(tgt.clientX), Math.round(tgt.clientY)]});
    await pg.close();
  } catch (e) { check('task #50 deep-space callout drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // full-page screenshot analysed in the page (only the numbers come back)
  // ref = an earlier full-page shot (base64) of the same view with the layer under test off: d0 / L0 (diff measures)
  const shot = async (pg) => (await pg.screenshot()).toString('base64');
  const analyse = async (pg, fn, arg, ref) => {
    const b64 = await shot(pg);
    return pg.evaluate(async ([b64, src, arg, ref]) => {
      const load = async (b) => { const img = new Image(); img.src = 'data:image/png;base64,' + b; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, c.width, c.height); };
      const im = await load(b64), d = im.data, W = im.width, H = im.height, d0 = ref ? (await load(ref)).data : null;
      const lum = (dd) => (x, y) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return -1; const i = (y * W + x) * 4; return 0.2126 * dd[i] + 0.7152 * dd[i + 1] + 0.0722 * dd[i + 2]; };
      return (0, eval)('(' + src + ')')({d, W, H, L: lum(d), d0, L0: d0 && lum(d0)}, arg);
    }, [b64, fn.toString(), arg, ref || null]);
  };
  const only = (pg, keep) => pg.evaluate((keep) => { for (const l of window.C4Scene.layers) window.scene.setLayer(l, keep.includes(l)); }, keep);

  // (3) territory reads as influence: lower interior fill, a thin edge that does NOT thicken with zoom; dimmer under stats
  if (part(3)) try {
    const pg = await dev('?reduced=1');
    await only(pg, ['territory']);
    const mud = latest.systems.filter((s) => s.f === 'mud');
    const cx = mud.reduce((a, s) => a + s.x, 0) / mud.length, cy = mud.reduce((a, s) => a + s.y, 0) / mud.length;
    const rim = mud.slice().sort((a, b) => Math.hypot(b.x - cx, b.y - cy) - Math.hypot(a.x - cx, a.y - cy)).slice(0, 6);
    const probe = (pg) => pg.evaluate(([mud, rim, cx, cy]) => ({
      inner: mud.filter((s) => s.lvl >= 1).map((s) => window.scene.screenOf(s.x, s.y, 0)).filter((p) => p && p.visible).map((p) => [p.clientX, p.clientY]),
      rays: rim.map((s) => { const p = window.scene.screenOf(s.x, s.y, 0), q = window.scene.screenOf(s.x + (s.x - cx) * 0.2, s.y + (s.y - cy) * 0.2, 0);
        return p && q && p.visible ? [p.clientX, p.clientY, Math.atan2(q.clientY - p.clientY, q.clientX - p.clientX)] : null; }).filter(Boolean),
    }), [mud, rim, cx, cy]);
    const measure = (img, arg) => {
      const {L} = img, med = (a) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[s.length >> 1] : null; };
      let sum = 0, n = 0;
      for (const [x, y] of arg.inner) for (let r = 14; r <= 34; r += 4) for (let k = 0; k < 16; k++) { const l = L(x + r * Math.cos(k * Math.PI / 8), y + r * Math.sin(k * Math.PI / 8)); if (l >= 0) { sum += l; n++; } }
      const widths = [];
      for (const [x, y, a0] of arg.rays) {
        let best = Infinity;
        for (const da of [-0.5, -0.25, 0, 0.25, 0.5]) {
          const a = a0 + da, prof = [];
          for (let t = 0; t < 320; t += 0.5) prof.push(L(x + t * Math.cos(a), y + t * Math.sin(a)));
          let pk = -1, pi = -1; for (let i = 16; i < prof.length; i++) if (prof[i] > pk) { pk = prof[i]; pi = i; }
          const tail = prof.slice(Math.min(prof.length - 1, pi + 40)).filter((v) => v >= 0); const bg = tail.length ? Math.min(...tail) : 0;
          if (pi < 0 || pk - bg < 12) continue;
          const half = (pk + bg) / 2; let i0 = pi, i1 = pi;
          while (i0 > 0 && prof[i0] > half) i0--; while (i1 < prof.length - 1 && prof[i1] > half) i1++;
          best = Math.min(best, (i1 - i0) * 0.5 * Math.abs(Math.cos(da)) || (i1 - i0) * 0.5);
        }
        if (best < Infinity) widths.push(best);
      }
      return {fill: n ? +(sum / n).toFixed(1) : null, edgePx: med(widths), edges: widths.map((w) => +w.toFixed(1))};
    };
    await pg.evaluate(() => window.scene.focusOwner(null)); await settle(pg, 300);
    const home = await analyse(pg, measure, await probe(pg));
    const r0 = rim[0];
    await pg.evaluate((s) => window.scene.focusPoint(s.x, s.y, 3), r0); await settle(pg, 300);
    const mid = await analyse(pg, measure, await probe(pg));
    console.log('INFO  #50 territory', JSON.stringify({home, mid}));
    check(`#50 territory fill inside the MUD field is softer: mean luminance 14-34 px around MUD starbases at home ${home.fill} (<= 20; the v4 bundle measured 29.4)`, home.fill != null && home.fill <= T50_FILL_MAX, home.fill);
    check(`#50 territory edge is thin and constant in px: FWHM at home ${home.edgePx} px, at mid zoom ${mid.edgePx} px (both <= 4, within 1.5 px of each other)`,
      home.edgePx != null && mid.edgePx != null && home.edgePx <= 4 && mid.edgePx <= 4 && Math.abs(home.edgePx - mid.edgePx) <= 1.5, {home: home.edges, mid: mid.edges});
    // dimmer while a stat layer stands (the stats lead): same probe, columns hidden from the pixels by the layer switch
    await pg.evaluate(() => window.scene.focusOwner(null)); await settle(pg, 300);
    const inner = await probe(pg);
    await pg.evaluate(() => window.scene.setStatLayer('combat')); await settle(pg, 700);
    await pg.evaluate(() => { document.querySelector('.c4-stat-layer').style.visibility = 'hidden'; });
    const cols = await pg.evaluate(() => { const o = []; for (let i = 0; ; i++) { const c = window.scene.statColumnScreen(i); if (!c) break; o.push([c.base.clientX, c.base.clientY, c.top.clientY]); } return o; });
    const segD = (x, y, [bx, by, ty]) => (y < ty ? Math.hypot(x - bx, y - ty) : y > by ? Math.hypot(x - bx, y - by) : Math.abs(x - bx));
    const free = {inner: inner.inner.filter(([x, y]) => !cols.some((c) => segD(x, y, c) < 48)), rays: []};
    // the territory's own contribution = mean |territory on - territory off| on the same rings (it adds light AND dims
    // the backdrop, so a plain mean luminance hides most of it)
    const contrib = ({L, L0}, arg) => { let s = 0, n = 0;
      for (const [x, y] of arg.inner) for (let r = 14; r <= 34; r += 4) for (let k = 0; k < 16; k++) { const a = x + r * Math.cos(k * Math.PI / 8), b = y + r * Math.sin(k * Math.PI / 8), l = L(a, b);
        if (l >= 0) { s += Math.abs(l - L0(a, b)); n++; } }
      return n ? +(s / n).toFixed(2) : null; };
    const terrContrib = async () => { await only(pg, []); await settle(pg, 200); const ref = await shot(pg); await only(pg, ['territory']); await settle(pg, 200); return analyse(pg, contrib, free, ref); };
    const statOn = await terrContrib();
    await pg.evaluate(() => window.scene.setStatLayer(null)); await settle(pg, 300);
    const statOff = await terrContrib();
    check(`#50 territory steps back while a stat layer is on: its contribution ${statOn} vs ${statOff} with no stat layer (<= 75 %, ${free.inner.length} starbases away from columns)`,
      free.inner.length >= 5 && statOff > 2 && statOn <= statOff * 0.75, {on: statOn, off: statOff});
    await pg.close();
  } catch (e) { check('task #50 territory drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (4) routes: faction-tinted (not white) and a constant thin px width at home and close in
  if (part(4)) try {
    const pg = await dev('?reduced=1&replay=1'); // replay clock: the snapshot's transits are in flight (on the real clock most have landed)
    await only(pg, ['routes']);
    // close view: on the in-flight warp with the most transits within 6 units at the replay clock (snapshot - 5 min)
    const t0 = latest.generatedAt - 300, tr = latest.fleets.filter((f) => f.s && (f.s.kind === 'warp' || f.s.kind === 'subwarp') && f.s.to && f.s.arrives > t0 + 20);
    const hub = tr.map((f) => ({f, n: tr.filter((g) => Math.hypot(g.x - f.x, g.y - f.y) < 6).length})).sort((a, b) => b.n - a.n)[0].f;
    const mx = hub.x, my = hub.y;
    const measure = ({d, W, H, d0}) => { // lit = changed by the routes layer (on vs off, same frozen view); colour = the added light
      const lit = new Uint8Array(W * H); let n = 0, chroma = 0, white = 0;
      for (let i = 0, p = 0; p < W * H; p++, i += 4) {
        const r = Math.max(0, d[i] - d0[i]), g = Math.max(0, d[i + 1] - d0[i + 1]), b = Math.max(0, d[i + 2] - d0[i + 2]);
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        if (mx > 24) { lit[p] = 1; n++; chroma += (mx - mn) / mx; if ((mx - mn) / mx < 0.25 && mx > 110) white++; }
      }
      const th = [];
      for (let y = 1; y < H - 1; y += 2) for (let x = 1; x < W - 1; x += 2) {
        if (!lit[y * W + x]) continue;
        let a = x, b = x; while (a > 0 && lit[y * W + a - 1]) a--; while (b < W - 1 && lit[y * W + b + 1]) b++;
        let c = y, e = y; while (c > 0 && lit[(c - 1) * W + x]) c--; while (e < H - 1 && lit[(e + 1) * W + x]) e++;
        th.push(Math.min(b - a + 1, e - c + 1));
      }
      th.sort((p, q) => p - q);
      return {lit: n, chroma: n ? +(chroma / n).toFixed(3) : null, whitePct: n ? +(100 * white / n).toFixed(1) : null, thick: th.length ? th[th.length >> 1] : null, thick90: th.length ? th[Math.floor(th.length * 0.9)] : null};
    };
    const withRef = async () => { await only(pg, []); await settle(pg, 200); const ref = await shot(pg); await only(pg, ['routes']); await settle(pg, 200); return analyse(pg, measure, null, ref); };
    await pg.evaluate(() => window.scene.focusOwner(null)); await settle(pg, 300);
    const home = await withRef();
    await pg.evaluate(([x, y]) => window.scene.focusPoint(x, y, 6), [mx, my]); await settle(pg, 300);
    const close = await withRef();
    console.log('INFO  #50 routes', JSON.stringify({home, close}));
    // v4 bundle measured: near-white 8.7 % / 16.8 %, chroma 0.45 / 0.28; run p90 2 px at home but 23 px close in
    check(`#50 routes are faction-tinted, not white scratches: near-white lit px ${home.whitePct} % at home / ${close.whitePct} % close (<= 3 %), mean chroma ${home.chroma} / ${close.chroma} (>= 0.33; NPC grey is the house colour)`,
      home.lit > 200 && close.lit > 200 && home.whitePct <= 3 && close.whitePct <= 3 && home.chroma >= 0.33 && close.chroma >= 0.33, {home, close});
    check(`#50 route width is constant on screen: median lit run ${home.thick} px at home, ${close.thick} px close in (<= 3), 90th pct ${home.thick90} / ${close.thick90} (<= 5)`,
      home.thick != null && close.thick != null && Math.max(home.thick, close.thick) <= 3 && Math.max(home.thick90, close.thick90) <= 5, {home, close});
    await pg.close();
  } catch (e) { check('task #50 routes drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (5) stat columns: rise over ~400 ms on a layer change, a min on-screen height, a base disc, no flicker
  if (part(5)) try {
    let pg = await dev('');
    const colH = () => pg.evaluate(() => { const o = []; for (let i = 0; ; i++) { const c = window.scene.statColumnScreen(i); if (!c) break; o.push(c.base.clientY - c.top.clientY); } return o; });
    await pg.evaluate(() => window.scene.focusOwner(null)); await settle(pg, 200);
    const early = await pg.evaluate(async () => { window.scene.setStatLayer('mining'); for (let i = 0; i < 3; i++) await new Promise((r) => requestAnimationFrame(() => r()));
      const c = window.scene.statColumnScreen(0); return c ? c.base.clientY - c.top.clientY : null; });
    await new Promise((r) => setTimeout(r, 700));
    const full = (await colH())[0];
    check(`#50 columns rise on a layer change: column 1 is ${early && early.toFixed(1)} px three frames in, ${full && full.toFixed(1)} px after 700 ms (< 70 %)`, early != null && full > 20 && early < full * 0.7, {early, full});
    // min on-screen height at the farthest zoom (camera 240): every column >= 6.5 px (STAT_MIN_PX 8 at the target; farther columns a little less)
    await pg.evaluate(() => window.scene.focusPoint(0.5, 0.5, 0.533)); await settle(pg, 700);
    const far = (await colH()).filter((h) => h > 0);
    check(`#50 min column height at the farthest zoom: shortest of ${far.length} columns ${far.length ? Math.min(...far).toFixed(1) : '?'} px (>= 6.5)`, far.length > 5 && Math.min(...far) >= 6.5, far.slice().sort((a, b) => a - b).slice(0, 3));
    // flicker: the hot combat columns, columns only, 8 grabs 45 ms apart - mean frame-to-frame change vs mean light
    await pg.evaluate(() => { window.scene.setStatLayer('combat'); for (const l of window.C4Scene.layers) window.scene.setLayer(l, false); document.querySelector('.c4-stat-layer').style.visibility = 'hidden'; });
    await pg.evaluate(() => window.scene.focusOwner(null)); await settle(pg, 900);
    const c0 = await pg.evaluate(() => { const c = window.scene.statColumnScreen(0); return c && [c.base.clientX, c.base.clientY, c.top.clientY]; });
    const box = {x: Math.round(c0[0] - 12), y: Math.round(c0[2] - 4), width: 24, height: Math.max(12, Math.round(c0[1] - c0[2] + 8))};
    const grabs = [];
    for (let i = 0; i < 8; i++) { grabs.push((await pg.screenshot({clip: box})).toString('base64')); await new Promise((r) => setTimeout(r, 45)); }
    const flick = await pg.evaluate(async (gs) => {
      const lum = []; for (const b of gs) { const im = new Image(); im.src = 'data:image/png;base64,' + b; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height).data, l = []; for (let i = 0; i < d.length; i += 4) l.push(0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]); lum.push(l); }
      let ch = 0, tot = 0, n = 0; for (let k = 1; k < lum.length; k++) for (let i = 0; i < lum[k].length; i++) { ch += Math.abs(lum[k][i] - lum[k - 1][i]); tot += lum[k][i]; n++; }
      return {change: +(ch / n).toFixed(2), mean: +(tot / n).toFixed(2), ratio: +(ch / Math.max(1, tot)).toFixed(3)};
    }, grabs);
    console.log('INFO  #50 flicker', JSON.stringify(flick));
    check(`#50 the hottest combat column does not flicker: frame-to-frame change ${flick.ratio} of its light (<= ${T50_FLICK_MAX}; the v4 bundle measured 0.068)`, flick.mean > 2 && flick.ratio <= T50_FLICK_MAX, flick);
    await pg.close();
    // base disc: columns only, bloom off, mid zoom - light just BELOW the column's base point (a column alone starts there)
    pg = await dev('?reduced=1');
    await pg.evaluate(() => { for (const l of window.C4Scene.layers) window.scene.setLayer(l, false); window.scene.tune({strength: 0}); window.scene.setStatLayer('mining'); });
    await pg.evaluate(() => window.scene.focusPoint(0.5, 0.5, 2)); await settle(pg, 700);
    await pg.evaluate(() => { document.querySelector('.c4-stat-layer').style.visibility = 'hidden'; });
    const bases = await pg.evaluate(() => { const o = []; for (let i = 0; ; i++) { const c = window.scene.statColumnScreen(i); if (!c) break; if (c.base.clientX > 20 && c.base.clientX < innerWidth - 20 && c.base.clientY > 20 && c.base.clientY < innerHeight - 20) o.push([c.base.clientX, c.base.clientY]); } return o.slice(0, 12); });
    await pg.evaluate(() => window.scene.setStatLayer(null)); await settle(pg, 300);
    const ref = await shot(pg); // the same view without the columns: the light below a base point must come from the stat layer
    await pg.evaluate(() => window.scene.setStatLayer("mining")); await settle(pg, 300);
    await pg.evaluate(() => { document.querySelector(".c4-stat-layer").style.visibility = "hidden"; });
    const below = await analyse(pg, ({L, L0}, bs) => bs.map(([x, y]) => { let m = 0; for (let dy = 1; dy <= 2; dy++) for (let dx = -1; dx <= 1; dx++) { const yy = Math.floor(y) + dy; m = Math.max(m, L(x + dx, yy) - L0(x + dx, yy)); } return Math.round(m); }), bases, ref);
    const lit = below.filter((v) => v > 20).length;
    check(`#50 each column stands on a base disc: light in the 2 pixel rows below the base point on ${lit}/${below.length} columns (added light > 20, >= 75 %, bloom off)`, below.length >= 4 && lit >= below.length * 0.75, below);
    await pg.close();
  } catch (e) { check('task #50 columns drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  // (7) frame budget: mean JS time per frame (getStats().cpuMs) at home, home + a stat layer, and the Serene view
  if (part(7)) try {
    const pg = await dev('');
    const cpu = () => pg.evaluate(async () => { await new Promise((r) => setTimeout(r, 2300)); return window.scene.getStats().cpuMs; });
    await pg.evaluate((h) => { window.scene.setInsets(h); window.scene.focusOwner(null); }, HUD); await settle(pg, 300);
    const a = await cpu();
    await pg.evaluate(() => window.scene.setStatLayer('combat')); await settle(pg, 300);
    const b = await cpu();
    await pg.evaluate(() => window.scene.setStatLayer(null));
    await pg.evaluate((s) => window.scene.focusSystem(s), sysN('Serene').a); await settle(pg, 300);
    const c = await cpu();
    check(`#50 frame budget (JS per frame, headless): home ${a} ms, home + stat ${b} ms, Serene ${c} ms (each <= 1.0; the v4 bundle measured ~0.4 / 0.5 / 0.55)`, [a, b, c].every((v) => v > 0 && v <= 1.0), {a, b, c});
    await pg.close();
  } catch (e) { check('task #50 frame budget drive completed without throwing', false, String(e && e.message || e).slice(0, 200)); }

  check('task #50 pages: no page errors', errs.length === 0, errs.slice(0, 5));
}
const T50_FILL_MAX = 20, T50_FLICK_MAX = 0.03; // v4 bundle measured 29.4 and 0.068; v5 11.9 and 0.004 (2026-11-07)
