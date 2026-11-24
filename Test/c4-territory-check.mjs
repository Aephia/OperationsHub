// C4 Live map: the territory glow and its push-back off regions nobody owns (C4Live/scene-src/model.js territoryField).
//   node Test/c4-territory-check.mjs
// Pure maths, no browser. The expected values are recomputed here by a separate direct formula (per point, in map units,
// no grid), and the source is then MUTATED to prove the checks fail when the rule is broken.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = fs.readFileSync(path.join(ROOT, 'C4Live/scene-src/model.js'), 'utf8');
const load = (src) => import('data:text/javascript,' + encodeURIComponent(src));
const TEX = 256, SPAN = 140, CX = 0.5, CY = 0.5, PX = TEX / SPAN;
const FA = ['mud', 'oni', 'ustur'];

// the weight of faction fi at a map point, read from the grid (nearest texel)
const cell = (x, y) => Math.floor((y - (CY - SPAN / 2)) * PX) * TEX + Math.floor((x - (CX - SPAN / 2)) * PX);
const plain = (systems, x, y, fi) => { let w = 0; for (const s of systems) if (s.f === FA[fi]) w += (0.6 + (s.lvl || 0) * 0.4) * Math.exp(-((s.x - x) ** 2 + (s.y - y) ** 2) / (2 * 3.3 * 3.3)); return w; };
// texel centre of a map point, so the direct formula and the grid are compared at the same place
const centre = (x, y) => [(Math.floor((x - (CX - SPAN / 2)) * PX) + 0.5) / PX + (CX - SPAN / 2), (Math.floor((y - (CY - SPAN / 2)) * PX) + 0.5) / PX + (CY - SPAN / 2)];

// a hand-built map: Ustur holds region 1 (x 0..6), region 2 next to it (x 8..14) is all unaligned, region 3 (x 30..) is
// ONI with one unaligned starbase of its own; one unaligned starbase carries no region id
const sys = (n, x, y, f, r, lvl = 1) => ({n, x, y, f, r, lvl, a: n});
const MAP = [
  sys('U1', 0, 0, 'ustur', 1), sys('U2', 3, 0, 'ustur', 1, 3), sys('U3', 6, 0, 'ustur', 1), sys('U4', 6, 2, 'ustur', 1),
  sys('N1', 8, 0, 'unaligned', 2), sys('N2', 10, 0, 'unaligned', 2, 3), sys('N3', 12, 0, 'unaligned', 2), sys('N4', 10, 2, 'unaligned', 2), sys('N5', 14, 1, 'unaligned', 2),
  sys('O1', 30, 0, 'oni', 3), sys('O2', 32, 0, 'oni', 3), sys('O3n', 31, 1, 'unaligned', 3),
  sys('X', 20, 0, 'unaligned', null),
];

function run(M, label) {
  const out = [];
  const ok = (name, pass, detail = '') => out.push({name, pass: !!pass, detail});
  const field = (systems) => M.territoryField(systems, TEX, SPAN, CX, CY);
  const at = (W, x, y, fi) => W[fi][cell(x, y)];
  const W = field(MAP);

  ok('pushers: exactly the unaligned starbases of the region nobody owns (N1..N5)', M.territoryPushers(MAP).map((s) => s.n).join() === 'N1,N2,N3,N4,N5', M.territoryPushers(MAP).map((s) => s.n).join());
  // control: with the region ids removed there is no push-back and the grid equals the plain glow
  const noReg = MAP.map((s) => ({...s, r: null})), W0 = field(noReg);
  const cmp = MAP.map((s) => { const [x, y] = centre(s.x, s.y); return Math.abs(at(W0, s.x, s.y, 2) - plain(MAP, x, y, 2)); });
  ok('control: without region ids the grid equals the plain Gaussian glow at every starbase (within 0.03: the grid cuts each glow off at 3 sigma)', Math.max(...cmp) < 0.03, String(Math.max(...cmp)));
  const [nx, ny] = centre(10, 0), glowN2 = plain(MAP, nx, ny, 2);
  ok('control: the plain Ustur glow does reach the neutral region (N2 > 0.15, N1 > 1)', glowN2 > 0.15 && at(W0, 8, 0, 2) > 1, glowN2.toFixed(3) + ' / ' + at(W0, 8, 0, 2).toFixed(3));
  // the rule
  const neutral = ['N1', 'N2', 'N3', 'N4', 'N5'].map((n) => MAP.find((s) => s.n === n)).map((s) => at(W, s.x, s.y, 2) / at(W0, s.x, s.y, 2));
  ok('push-back: at every starbase of the unowned region under 2% of the plain glow is left', Math.max(...neutral) < 0.02, neutral.map((v) => v.toFixed(4)).join(' '));
  const own = ['U1', 'U2', 'U3', 'U4'].map((n) => MAP.find((s) => s.n === n)).map((s) => at(W, s.x, s.y, 2) / at(W0, s.x, s.y, 2));
  ok('push-back: the owner keeps its glow at its own starbases (>= 95%, U3 / U4 sit 2 units from neutral ground)', Math.min(...own) >= 0.95, own.map((v) => v.toFixed(4)).join(' '));
  // the border runs midway: at x = 7 (1 from U3, 1 from N1) about half is left; exact value from the direct formula
  const [bx, by] = centre(7, 0), dN = Math.min(...MAP.filter((s) => s.r === 2).map((s) => Math.hypot(s.x - bx, s.y - by))), dO = Math.min(...MAP.filter((s) => s.f === 'ustur').map((s) => Math.hypot(s.x - bx, s.y - by)));
  const want = 1 / (1 + Math.exp(-(dN - dO) / 0.35)), got = at(W, 7, 0, 2) / at(W0, 7, 0, 2);
  ok('push-back: midway between an owned and a neutral starbase the glow is scaled by sigmoid((dN - dO) / 0.35)', Math.abs(got - want) < 0.02 && got > 0.2 && got < 0.8, got.toFixed(4) + ' vs ' + want.toFixed(4));
  ok('reach: 3.5 units or more from every pushing starbase nothing changes (x = 3.9, y = 0: N1 is 4.1 away)', Math.abs(at(W, 3.9, 0, 2) - at(W0, 3.9, 0, 2)) < 1e-6);
  // inside the fade band (2..3.5 units from the nearest pushing starbase) the push-back eases off: (11, 4.8) is about 3
  // from N4 and far from every Ustur starbase, so m is ~0 and what is left is the smoothstep of the distance
  const [fx, fy] = centre(11, 4.8), fd = Math.min(...MAP.filter((s) => s.r === 2).map((s) => Math.hypot(s.x - fx, s.y - fy))), ft = (fd - 2) / 1.5, fWant = ft * ft * (3 - 2 * ft), fGot = at(W, 11, 4.8, 2) / at(W0, 11, 4.8, 2);
  ok('reach: in the fade band the push-back eases off by smoothstep((dN - 2) / 1.5)', fd > 2.3 && fd < 3.3 && Math.abs(fGot - fWant) < 0.03 && fGot > 0.3, fGot.toFixed(4) + ' vs ' + fWant.toFixed(4) + ' at dN ' + fd.toFixed(2));
  ok('an unaligned starbase inside an OWNED region does not push (ONI glow at O3n unchanged)', Math.abs(at(W, 31, 1, 1) - at(W0, 31, 1, 1)) < 1e-6 && at(W, 31, 1, 1) > 1);
  ok('an unaligned starbase with no region id does not push (Ustur glow at X unchanged)', Math.abs(at(W, 20, 0, 2) - at(W0, 20, 0, 2)) < 1e-9);
  // somebody takes a starbase in the neutral region: it stops being neutral ground
  const taken = MAP.map((s) => (s.n === 'N5' ? {...s, f: 'oni'} : s)), Wt = field(taken);
  ok('capture: once a faction holds a starbase there the region no longer pushes (pushers = none, Ustur glow back at N1)', M.territoryPushers(taken).length === 0 && Math.abs(at(Wt, 8, 0, 2) - at(W0, 8, 0, 2)) < 1e-6);
  ok('capture: the new owner glows at its starbase (ONI at N5 >= 0.9)', at(Wt, 14, 1, 1) >= 0.9, at(Wt, 14, 1, 1).toFixed(3));
  // degenerate inputs
  const We = field([]), Wn = field([{x: NaN, y: 1, f: 'mud', r: 1}, null, {x: 1, y: 1}]);
  ok('no systems, a null row or a row with no number for x: all-zero grids, no throw', [We, Wn].every((w) => w.length === 3 && w.every((a) => a.length === TEX * TEX && a.every((v) => v === 0))));
  ok('only unowned regions on the map: nothing to push back, all zero', field(MAP.filter((s) => s.r === 2)).every((a) => a.every((v) => v === 0)));
  ok('no NaN anywhere in the grids', W.every((a) => a.every((v) => Number.isFinite(v) && v >= 0)));

  // the live read, when this machine has one (the Ledgerlight report, 2026-11-23)
  const lp = path.join(ROOT, 'Data/c4-live/latest.json');
  if (fs.existsSync(lp)) {
    const S = JSON.parse(fs.readFileSync(lp, 'utf8')).systems, Wl = field(S), Wp = field(S.map((s) => ({...s, r: null})));
    const tint = (v) => Math.round(255 * (1 - Math.exp(-v * 0.9)));
    const best = (Wx, s) => Math.max(...[0, 1, 2].map((c) => tint(Wx[c][cell(s.x, s.y)])));
    const led = S.find((s) => s.n === 'Ledgerlight');
    if (led && !FA.includes(led.f)) {
      const reg = S.filter((s) => s.r === led.r), unowned = !reg.some((s) => FA.includes(s.f));
      if (unowned) {
        const after = reg.map((s) => best(Wl, s)), before = reg.map((s) => best(Wp, s));
        ok(`live: Ledgerlight's region (${reg.length} unaligned starbases) had a faction tint before (max ${Math.max(...before)}/255) and reads neutral now (max <= 40)`, Math.max(...before) > 100 && Math.max(...after) <= 40, 'after ' + after.join(' '));
      } else out.push({name: 'live: Ledgerlight region has an owner now - neutral check skipped', pass: true, detail: 'skipped'});
    }
    const ownedS = S.filter((s) => FA.includes(s.f)), loss = ownedS.map((s) => 1 - best(Wl, s) / Math.max(1, best(Wp, s)));
    ok(`live: none of the ${ownedS.length} faction starbases loses more than 8% of its tint`, ownedS.length > 0 && Math.max(...loss) <= 0.08, 'max loss ' + Math.max(...loss).toFixed(3));
  }
  return out;
}

const MUTANTS = [
  ['every unaligned starbase pushes, owned region or not', '!TERR_FA.includes(s.f) && s.r != null && !ownedRegions.has(s.r)', '!TERR_FA.includes(s.f) && s.r != null'],
  ['a starbase with no region id pushes', '!TERR_FA.includes(s.f) && s.r != null && !ownedRegions.has(s.r)', '!TERR_FA.includes(s.f) && !ownedRegions.has(s.r)'],
  ['the push-back is switched off', 'const scale = 1 - (1 - m) * near;', 'const scale = 1;'],
  ['the push-back ignores its reach', 'const scale = 1 - (1 - m) * near;', 'const scale = m;'],
  ['the border is drawn at the neutral starbase, not midway', 'Math.exp(-(dn - Math.sqrt(d2)) / soft)', 'Math.exp(-(dn - 0) / soft)'],
  ['the glow ignores the starbase level', 'wt = 0.6 + (s.lvl || 0) * 0.4, arr = W[fi];', 'wt = 1, arr = W[fi];'],
];

const M = await load(SRC);
const res = run(M, 'source');
let pass = 0, fail = 0;
for (const r of res) { console.log((r.pass ? '  ok   ' : '  FAIL ') + r.name + (r.pass || !r.detail ? '' : '  [' + r.detail + ']')); r.pass ? pass++ : fail++; }
console.log('\nMutants (each must turn at least one check red)');
for (const [name, a, b] of MUTANTS) {
  if (SRC.split(a).length !== 2) { console.log('  FAIL mutant target not found exactly once: ' + name); fail++; continue; }
  let red = [];
  try { red = run(await load(SRC.replace(a, b)), name).filter((r) => !r.pass).map((r) => r.name); } catch (e) { red = ['threw: ' + e.message]; }
  if (red.length) { console.log('  ok   caught: ' + name + '  (' + red.length + ' red, e.g. ' + red[0].slice(0, 60) + ')'); pass++; }
  else { console.log('  FAIL survived: ' + name); fail++; }
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
