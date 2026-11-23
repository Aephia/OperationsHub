// Check for C4Live/c4-analytics.js (plain node: `node Test/c4-analytics-check.js`, exit 0/1, prints "N passed, M failed").
// Every figure build() emits is re-derived below by an INDEPENDENT loop over the raw rows (ref(): its own quartile, its own
// grouping, no call into the module) on the real data files (when present) and on hand-built fixtures with literal answers.
// Each rule also has a MUTANT: the module source with one deliberate break, run through the same suite; a mutant that the
// suite does not fail is reported as a failure of the check itself. Render output is checked for no style=, no <script,
// every section id, no NaN/undefined, escaped chain names, and the width contract at 360 and 900 px.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const SRC_FILE = path.join(ROOT, 'C4Live', 'c4-analytics.js');
const SRC = fs.readFileSync(SRC_FILE, 'utf8');

function load(src) {
    const mod = { exports: {} };
    new Function('module', 'window_', 'require', src.replace(/typeof window/g, 'typeof window_'))(mod, undefined, require);
    return mod.exports;
}
const REAL = load(SRC);

// ---------------------------------------------------------------- independent reference
const isNum = v => typeof v === 'number' && Number.isFinite(v);
function q7(vals, q) {
    const a = vals.filter(isNum).sort((x, y) => x - y);
    if (!a.length) return null;
    const h = (a.length - 1) * q, i = Math.floor(h), j = Math.min(i + 1, a.length - 1);
    return a[i] + (h - i) * (a[j] - a[i]);
}
const FACS = ['mud', 'oni', 'ustur'];
const facOf = f => (FACS.includes(f) ? f : 'unaligned');
// one quantity rule: the floor of a finite positive number, anything else is not a building (re-stated here, not imported)
const qn = b => (typeof b.q === 'number' && isFinite(b.q) && b.q > 0 ? Math.floor(b.q) : 0);
function ref(L, B) {
    const out = { mining: {}, council: {}, stakes: {}, compare: {} };
    const fleets = L.fleets || [], owners = L.owners || [], stakes = L.stakes || [];
    // mining
    const rows = [];
    for (const f of fleets) {
        if (!f.s || f.s.kind !== 'mining' || !f.mine) continue;
        if (!(f.mine.ups > 0) || !(f.ships > 0)) continue;
        rows.push(f);
    }
    out.mining.n = rows.length;
    const bySize = {};
    for (const f of rows) (bySize[f.flagSize] = bySize[f.flagSize] || []).push(f.mine.ups / f.ships);
    out.mining.bySize = {};
    for (const k in bySize) out.mining.bySize[k] = [bySize[k].length, q7(bySize[k], 0.25), q7(bySize[k], 0.5), q7(bySize[k], 0.75), Math.min(...bySize[k]), Math.max(...bySize[k])];
    const crewBySize = {};
    for (const f of rows) if (f.crew > 0) (crewBySize[f.flagSize] = crewBySize[f.flagSize] || []).push(f.mine.ups / f.crew);
    out.mining.crewBySize = {};
    for (const k in crewBySize) out.mining.crewBySize[k] = [crewBySize[k].length, q7(crewBySize[k], 0.5)];
    out.mining.sumYps = rows.reduce((t, f) => t + f.mine.ups / f.ships, 0);
    const rich = rows.filter(f => f.mine.baseUps > 0);
    out.mining.richN = rich.length;
    out.mining.richMed = q7(rich.map(f => f.mine.ups / f.mine.baseUps), 0.5);
    const rs = {};
    for (const f of rows) {
        const seen = new Set();
        for (const o of f.mine.out || []) {
            rs[o.r] = rs[o.r] || { ups: 0, ships: 0 };
            rs[o.r].ups += o.ups;
            if (!seen.has(o.r)) { seen.add(o.r); rs[o.r].ships += f.ships; }
        }
    }
    out.mining.res = {};
    for (const r in rs) out.mining.res[r] = rs[r].ups / rs[r].ships;
    // council
    const g = {};
    for (const o of owners) if (isNum(o.rank)) (g[o.rank] = g[o.rank] || []).push(o);
    out.council.ranks = {};
    for (const k in g) {
        const m = key => q7(g[k].map(o => o[key]), 0.5);
        out.council.ranks[k] = [g[k].length, m('fleets'), m('ships'), m('stakes'), m('ups'), m('atlas'),
            q7(g[k].map(o => o.xp && o.xp.mining ? o.xp.mining.lvl : NaN), 0.5)];
    }
    // stakes
    const sub = {};
    for (const b of (B && B.bodies) || []) sub[b.a] = b.sub;
    const tally = (list, fn) => { const m = {}; for (const s of list) { const k = fn(s); if (k !== undefined) m[k] = (m[k] || 0) + 1; } return m; };
    out.stakes.n = stakes.length;
    out.stakes.byType = tally(stakes, s => (B && B.bodies && sub[s.body]) || 'unknown');
    out.stakes.byTier = tally(stakes, s => String(s.tier));
    out.stakes.byState = tally(stakes, s => s.st);
    out.stakes.bld = tally(stakes, s => (Array.isArray(s.bl) ? s.bl.reduce((t, b) => t + qn(b), 0) : (s.b >= 0 ? s.b : undefined)));
    const kinds = {};
    for (const s of stakes) for (const b of s.bl || []) if (qn(b) > 0) kinds[b.k] = (kinds[b.k] || 0) + qn(b);
    out.stakes.kinds = kinds;
    const pw = stakes.filter(s => s.pw && isNum(s.pw.gen) && isNum(s.pw.use));
    out.stakes.netSum = pw.reduce((t, s) => t + (s.pw.gen - s.pw.use), 0);
    out.stakes.surplus = pw.filter(s => s.pw.gen > s.pw.use).length;
    out.stakes.deficit = pw.filter(s => s.pw.gen < s.pw.use).length;
    const b5 = [0, 0, 0, 0, 0];
    for (const s of stakes) if (s.cap && s.cap.total > 0) { let i = Math.floor(5 * s.cap.used / s.cap.total); b5[i > 4 ? 4 : i < 0 ? 0 : i]++; }
    out.stakes.fill = b5;
    const fills = stakes.filter(s => s.cap && s.cap.total > 0).map(s => s.cap.used / s.cap.total);
    out.stakes.fillMed = q7(fills, 0.5);
    out.stakes.prod = {};
    for (const s of stakes) for (const o of s.out || []) out.stakes.prod[o.r] = (out.stakes.prod[o.r] || 0) + o.ps * 3600;
    out.stakes.fuel = refFuel(stakes);
    const po = {};
    for (const s of stakes) po[s.o] = (po[s.o] || 0) + 1;
    out.stakes.ownerDist = {};
    for (const o in po) out.stakes.ownerDist[po[o]] = (out.stakes.ownerDist[po[o]] || 0) + 1;
    // compare
    const res = {};
    for (const f of rows) for (const o of f.mine.out || []) { res[o.r] = res[o.r] || [0, 0]; res[o.r][0] += o.ups * 3600; }
    // like with like: a stake output counts only when some mining row of the same read lists that resource
    const mined = new Set(); for (const f of rows) for (const o of f.mine.out || []) mined.add(o.r);
    const minedOf = s => (s.out || []).filter(o => mined.has(o.r));
    out.compare.otherOut = [...new Set(stakes.flatMap(s => (s.out || []).filter(o => !mined.has(o.r)).map(o => o.r)))].sort();
    for (const s of stakes) for (const o of minedOf(s)) { res[o.r] = res[o.r] || [0, 0]; res[o.r][1] += o.ps * 3600; }
    out.compare.res = res;
    let fu = 0, fc = 0, su = 0, sc = 0;
    for (const f of rows) if (f.crew > 0) { fu += f.mine.ups * 3600; fc += f.crew; }
    for (const s of stakes) if (Array.isArray(s.out) && s.crew > 0) { su += minedOf(s).reduce((t, o) => t + o.ps, 0) * 3600; sc += s.crew; }
    out.compare.crew = [fc > 0 ? fu / fc : null, sc > 0 ? su / sc : null];
    const of = {};
    for (const o of owners) of[o.p] = facOf(o.fa);
    const fa = {};
    const add = (f, i, v) => { fa[f] = fa[f] || [0, 0]; fa[f][i] += v; };
    for (const f of rows) add(facOf(f.fa), 0, f.mine.ups * 3600);
    for (const s of stakes) for (const o of minedOf(s)) add(facOf(of[s.o]), 1, o.ps * 3600);
    out.compare.fa = fa;
    const U = new Set(owners.map(o => o.p)), sh = new Set(), stk = new Set();
    for (const f of fleets) if (!f.npc) { U.add(f.o); if (f.s && f.s.kind === 'mining' && f.mine && f.mine.ups > 0) sh.add(f.o); }
    for (const s of stakes) { U.add(s.o); stk.add(s.o); }
    const mix = { shipsOnly: 0, stakesOnly: 0, both: 0, neither: 0, total: U.size };
    for (const p of U) { const a = sh.has(p), b = stk.has(p); if (a && b) mix.both++; else if (a) mix.shipsOnly++; else if (b) mix.stakesOnly++; else mix.neither++; }
    out.compare.mix = mix;
    return out;
}

// ---------------------------------------------------------------- fixtures
const SIZE = (id, o, size, ships, ups, extra) => Object.assign({ a: id, n: 'f-' + id, o, fa: 'mud', npc: 0, s: { kind: 'mining' }, ships, crew: ships, flagSize: size, mine: { ups, baseUps: ups / 2, out: [{ r: 'Iron Ore', ups }] } }, extra || {});
function fixtureFull() {
    const fleets = [];
    // small: ships 2, ups 2,4,6,8,10 -> yield per ship 1,2,3,4,5 (q1 2, median 3, q3 4)
    [2, 4, 6, 8, 10].forEach((u, i) => fleets.push(SIZE('s' + i, i % 2 ? 'B' : 'A', 'small', 2, u)));
    // medium: ups 1,2,3,4 on one ship -> q1 1.75, median 2.5, q3 3.25
    [1, 2, 3, 4].forEach((u, i) => fleets.push(SIZE('m' + i, 'C', 'medium', 1, u, { fa: 'oni' })));
    fleets.push(SIZE('z0', 'A', 'small', 0, 3));                                                   // ships 0: excluded, no division
    fleets.push(SIZE('z1', 'A', 'small', 2, 0));                                                   // ups 0: excluded
    fleets.push(SIZE('nc', 'D', 'x-small', 1, 0.5, { crew: 0, fa: 'ustur' }));                     // crew 0: per-crew null
    fleets.push(SIZE('dup', 'D', 'x-small', 3, 6, { fa: 'weird', mine: { ups: 6, baseUps: 0, out: [{ r: 'Evil"><script>x</script>', ups: 3 }, { r: 'Evil"><script>x</script>', ups: 3 }] } }));
    fleets.push({ a: 'idle', n: 'idle', o: 'E', fa: 'oni', npc: 0, s: { kind: 'idle' }, ships: 4, crew: 4, flagSize: 'small', mine: { ups: 99, out: [{ r: 'Iron Ore', ups: 99 }] } });
    const x = (p, rank, fa, lvl, o) => Object.assign({ p, fa, rank, fleets: 2, ships: 3, stakes: 1, ups: 5, atlas: 100, xp: { mining: { xp: 1, lvl } } }, o);
    const owners = [x('A', 0, 'mud', 1), x('B', 0, 'oni', 3, { fleets: 4, ships: 5 }), x('C', 1, 'oni', 3), x('D', 1, 'ustur', 4, { atlas: 300 }), x('E', 2, 'mud', 0), x('F', undefined, 'mud', 2)];
    const stakes = [
        { a: 'sa1', o: 'A', st: 'active', tier: 1, b: 4, crew: 2, body: 'p1', sysName: 'Alpha', bl: [{ id: 1, n: 'x', q: 3, k: 'extractor' }, { id: 2, n: 'y', q: 1, k: 'central_hub' }], pw: { gen: 10, use: 4 }, cap: { used: 5, total: 10 }, out: [{ r: 'Iron Ore', ps: 0.5 }, { r: 'Evil"><script>x</script>', ps: 0.25 }] },
        { a: 'sa2', o: 'A', st: 'design', tier: 2, b: 0, crew: 0, body: 'p2', sysName: 'Beta', bl: [], pw: { gen: 2, use: 6 }, cap: { used: 0, total: 0 }, out: [] },
        { a: 'sa3', o: 'C', st: 'active', tier: 1, b: 1, crew: 1, body: 'nope', sysName: '<img src=x onerror=1>', bl: [{ id: 3, n: 'z', q: 0, k: 'processor' }], pw: { gen: 3, use: 3 }, cap: { used: 9, total: 10 }, out: [{ r: 'Iron Ore', ps: 1 }] },
        { a: 'sa4', o: 'Z', st: 'active', tier: 1, b: 2, crew: 3, body: 'p1', sysName: 'Gamma', bl: [{ id: 4, n: 'w', q: 2, k: 'extractor' }, { id: 5, n: 'f', q: 2.7, k: 'farm' }, { id: 6, n: 'n', q: -3, k: 'processor' }, { id: 7, n: 's', q: '4', k: 'storage_module' }, { id: 8, n: 'p', q: null, k: 'power_plant' }, { id: 9, n: 'h', q: 0.5, k: 'crew_quarters' }], pw: { gen: 1, use: 5 }, cap: { used: 10, total: 10 }, out: [{ r: 'Hydrogen', ps: 2 }, { r: 'Fuel', ps: 3 }, { r: 'Iron Ore', ps: 0.1 }] }
    ];
    // fuel: 36 / 36 per h = 1 h (under 6 h); 0 fuel with a burn = empty; fuel 10 with no burn = no fuel burn; 90000 / 1800 = 50 h (1-3 days)
    stakes[0].fuel = 36; stakes[0].use = [{ r: 'Fuel', ps: 0.01 }];
    stakes[1].fuel = 0; stakes[1].use = [{ r: 'Fuel', ps: 0.001 }, { r: 'Hydrogen', ps: 0.5 }];
    stakes[2].fuel = 10; stakes[2].use = [];
    stakes[3].fuel = 90000; stakes[3].use = [{ r: 'Fuel', ps: 0.5 }];
    return { L: { fleets, owners, stakes }, B: { bodies: [{ a: 'p1', k: 'planet', sub: 'oceanic' }, { a: 'p2', k: 'planet', sub: 'ice-giant' }] } };
}
const NEWF = ['bl', 'pw', 'cs', 'su', 'inv', 'cap', 'fuel', 'rent', 'con', 'out', 'use'];
function stripStakes(L) { const c = JSON.parse(JSON.stringify(L)); c.stakes.forEach(s => NEWF.forEach(k => delete s[k])); return c; }
function noStakes(L) { const c = JSON.parse(JSON.stringify(L)); c.stakes = []; return c; }

let realData = null;
try {
    const R = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, 'Data', 'c4-live', n), 'utf8'));
    realData = { L: R('latest.json'), B: R('bodies.json') };
} catch (e) { realData = null; }

// independent re-derivation of the Fuel card: hours left = fuel / (Fuel burned per hour), bucket by upper bounds
function refFuel(stakes) {
    const bounds = [0.0000001, 6, 24, 72, Infinity];   // empty = exactly 0 hours; then [0,6) [6,24) [24,72) [72,..)
    const b = [0, 0, 0, 0, 0, 0]; let n = 0, burnPh = 0, burners = 0, anyUse = false;
    for (const s of stakes) {
        if (!Array.isArray(s.use)) continue;
        anyUse = true;
        let burn = 0;
        for (const u of s.use) if (u && u.r === 'Fuel' && typeof u.ps === 'number' && u.ps > 0) burn += u.ps * 3600;
        if (burn > 0) { burnPh += burn; burners++; }
        if (typeof s.fuel !== 'number') continue;
        n++;
        if (burn <= 0) { b[5]++; continue; }
        const h = s.fuel / burn;
        if (h === 0) { b[0]++; continue; }
        let i = 1; while (!(h < bounds[i])) i++;
        b[i]++;
    }
    return { anyUse, n, b, burnPh, burners };
}

// ---------------------------------------------------------------- the suite (run on the real module and on every mutant)
function suite(A, quiet) {
    const res = { pass: 0, fail: 0, names: [] };
    const ok = (name, cond, detail) => { if (cond) res.pass++; else { res.fail++; res.names.push(name); if (!quiet) console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); } };
    const near = (a, b) => (a == null || b == null) ? a === b : Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
    const mapEq = (m, r, f) => { const ks = new Set([...Object.keys(m), ...Object.keys(r)]); for (const k of ks) if (!(k in m) || !(k in r) || !f(m[k], r[k])) return false; return true; };
    const arrEq = (a, b) => a.length === b.length && a.every((v, i) => near(v, b[i]));
    const kv = list => { const m = {}; list.forEach(e => { m[e.k] = e.n; }); return m; };
    let guard = 0;
    const safe = (name, fn) => { try { fn(); } catch (e) { ok(name + ' (threw)', false, String(e && e.message)); } };

    function figures(tag, D, expectMining, expectStakes) {
        safe(tag + ' build', () => {
            const m = A.build(D.L, D.B), r = ref(D.L, D.B);
            if (expectMining) ok(tag + ' control: some mining rows', r.mining.n > 0 && m.mining.n > 0);
            ok(tag + ' mining n', m.mining.n === r.mining.n, m.mining.n + ' vs ' + r.mining.n);
            ok(tag + ' mining by size (n, q1, median, q3, min, max)', mapEq(kv0(m.mining.bySize, s => [s.n, s.q1, s.med, s.q3, s.min, s.max]), r.mining.bySize, arrEq));
            ok(tag + ' mining per crew median', mapEq(kv0(m.mining.bySize.filter(s => s.crew), s => [s.crew.n, s.crew.med]), r.mining.crewBySize, arrEq));
            ok(tag + ' mining scatter sum of yield per ship', near(m.mining.scatter.reduce((t, p) => t + p.yps, 0), r.mining.sumYps) && m.mining.scatter.length === r.mining.n);
            ok(tag + ' richness count and median ratio', m.mining.richness.points.length === r.mining.richN && near(m.mining.richness.medianRatio, r.mining.richMed));
            const top = {}; m.mining.topRes.forEach(e => { top[e.r] = e.yps; });
            ok(tag + ' top resources match (sorted desc, values)', Object.keys(top).every(k => near(top[k], r.mining.res[k])) &&
                m.mining.topRes.every((e, i, a) => i === 0 || a[i - 1].yps >= e.yps) &&
                m.mining.topRes.length === Math.min(10, Object.keys(r.mining.res).length));
            // council
            const cr = {}; m.council.ranks.forEach(k => { cr[k.rank] = [k.n, k.fleets, k.ships, k.stakes, k.ups, k.atlas, k.lvl]; });
            ok(tag + ' council per rank', mapEq(cr, r.council.ranks, arrEq));
            // stakes
            const s = m.stakes;
            ok(tag + ' stakes n', s.n === r.stakes.n);
            if (!r.stakes.n) { ok(tag + ' no-stakes state', s.state === 'none'); return; }
            ok(tag + ' stakes by type', mapEq(kv(s.byType), r.stakes.byType, (a, b) => a === b));
            ok(tag + ' stakes by tier', mapEq(kv(s.byTier), r.stakes.byTier, (a, b) => a === b));
            ok(tag + ' stakes by state', mapEq(kv(s.byState), r.stakes.byState, (a, b) => a === b));
            ok(tag + ' buildings per stake distribution', mapEq(kv(s.bldDist), r.stakes.bld, (a, b) => a === b));
            ok(tag + ' building kinds', mapEq(kv(s.kinds), r.stakes.kinds, (a, b) => a === b));
            ok(tag + ' power net sum, surplus and deficit counts', near(s.power.reduce((t, p) => t + p.net, 0), r.stakes.netSum) && s.powerSurplus === r.stakes.surplus && s.powerDeficit === r.stakes.deficit);
            ok(tag + ' storage fill buckets and median', arrEq(s.fill.buckets, r.stakes.fill) && near(s.fill.med, r.stakes.fillMed));
            const pr = {}; s.prod.forEach(e => { pr[e.r] = e.uph; });
            ok(tag + ' production per hour by resource', mapEq(pr, r.stakes.prod, near));
            const rf2 = r.stakes.fuel;
            ok(tag + ' fuel card: buckets, stakes read, total burn per hour, burning stakes', arrEq(s.fuel.buckets, rf2.b) && s.fuel.n === rf2.n && near(s.fuel.burnPh, rf2.burnPh) && s.fuel.burnStakes === rf2.burners && s.has.use === rf2.anyUse, JSON.stringify(s.fuel) + ' vs ' + JSON.stringify(rf2));
            ok(tag + ' owners by number of stakes', mapEq(kv(s.ownerDist), r.stakes.ownerDist, (a, b) => a === b));
            // compare
            const c = m.compare, cres = {}; c.res.forEach(e => { cres[e.r] = [e.ships, e.stakes]; });
            ok(tag + ' compare per resource (top rows equal reference)', Object.keys(cres).every(k => r.compare.res[k] && arrEq(cres[k], r.compare.res[k])) && c.res.length === Math.min(8, Object.keys(r.compare.res).length));
            ok(tag + ' compare per crew', near(c.crew.fleets.perCrew, r.compare.crew[0]) && near(c.crew.stakes.perCrew, r.compare.crew[1]));
            const cf = {}; c.factions.forEach(f => { cf[f.fa] = [f.ships, f.stakes]; });
            const rf = {}; for (const k in r.compare.fa) if (r.compare.fa[k][0] + r.compare.fa[k][1] > 0) rf[k] = r.compare.fa[k];
            ok(tag + ' compare per faction', mapEq(cf, rf, arrEq));
            ok(tag + ' compare: the stake outputs left out equal the reference', JSON.stringify(c.otherOut) === JSON.stringify(r.compare.otherOut), JSON.stringify(c.otherOut));
            ok(tag + ' compare owner mix', JSON.stringify(c.mix) === JSON.stringify(r.compare.mix), JSON.stringify(c.mix) + ' vs ' + JSON.stringify(r.compare.mix));
        });
    }
    function kv0(list, f) { const m = {}; list.forEach(e => { m[e.size] = f(e); }); return m; }

    const F = fixtureFull();
    // ---- literal answers on the fixture
    safe('fixture literals', () => {
        const m = A.build(F.L, F.B);
        const small = m.mining.bySize.find(s => s.size === 'small'), med = m.mining.bySize.find(s => s.size === 'medium');
        ok('quartiles 1..5 (odd n): q1 2, median 3, q3 4', small && small.n === 5 && small.q1 === 2 && small.med === 3 && small.q3 === 4, JSON.stringify(small));
        ok('quartiles 1..4 (even n): 1.75, 2.5, 3.25', med && med.n === 4 && near(med.q1, 1.75) && near(med.med, 2.5) && near(med.q3, 3.25), JSON.stringify(med));
        ok('size order: x-small, small, medium', m.mining.bySize.map(s => s.size).join() === 'x-small,small,medium', m.mining.bySize.map(s => s.size).join());
        ok('ships 0 and ups 0 fleets are excluded (11 of 13 mining fleets used)', m.mining.n === 11 && m.mining.miningFleets === 13, m.mining.n + '/' + m.mining.miningFleets);
        ok('idle fleet with a mine block is not a mining row', !m.mining.rows.some(r => r.ups === 99));
        const xs = m.mining.bySize.find(s => s.size === 'x-small');
        ok('crew 0 gives no per-crew figure (only the crewed fleet counts)', xs && xs.crew && xs.crew.n === 1, JSON.stringify(xs));
        ok('crew 0 row has per-crew null, every other row finite', m.mining.rows.find(r => r.n === 'f-nc').ypc === null && m.mining.rows.every(r => r.ypc === null || Number.isFinite(r.ypc)));
        ok('tiers ascending, buildings ascending, owners-by-stakes ascending', m.stakes.byTier.map(e => e.k).join() === '1,2' && m.stakes.bldDist.map(e => e.k).join() === '0,4' && m.stakes.ownerDist.map(e => e.k).join() === '1,2', m.stakes.byTier.map(e => e.k).join() + ' ' + m.stakes.bldDist.map(e => e.k).join());
        ok('duplicate resource in one fleet counts its ships once', m.mining.topRes.find(e => e.r.startsWith('Evil')).ships === 3);
        ok('unknown faction folds into unaligned', m.mining.scatter.some(p => p.fa === 'unaligned'));
        ok('quantity rule: extractor 3+2, central_hub 1, farm 2.7 -> 2; q 0, -3, "4", null, 0.5 are not counted at all', JSON.stringify(Object.entries(kv(m.stakes.kinds)).sort()) === JSON.stringify([['central_hub', 1], ['extractor', 5], ['farm', 2]]), JSON.stringify(m.stakes.kinds));
        ok('storage total 0 is left out (3 stakes with storage)', m.stakes.fill.n === 3, JSON.stringify(m.stakes.fill));
        ok('planet type join: oceanic 2, ice-giant 1, unknown 1', kv(m.stakes.byType).oceanic === 2 && kv(m.stakes.byType)['ice-giant'] === 1 && kv(m.stakes.byType).unknown === 1, JSON.stringify(m.stakes.byType));
        ok('power: A surplus +6, deficits -4 and -4, one at zero', m.stakes.powerSurplus === 1 && m.stakes.powerDeficit === 2 && near(m.stakes.power.reduce((t, p) => t + p.net, 0), 6 - 4 - 4 + 0));
        ok('production is per HOUR: Iron Ore (0.5 + 1 + 0.1)*3600', near(m.stakes.prod.find(e => e.r === 'Iron Ore').uph, 5760));
        ok('owner mix: both A and C, stakes only Z', m.compare.mix.stakesOnly === 1 && m.compare.mix.both === 2, JSON.stringify(m.compare.mix));
        ok('stake owner Z (not in owners) takes unaligned', m.compare.factions.some(f => f.fa === 'unaligned' && f.stakes > 0));
        ok('unranked owner is counted apart', m.council.unranked === 1 && m.council.ranked === 5);
        ok('state full', m.stakes.state === 'full');
        ok('fuel literals: empty 1, under 6 h 1, 1-3 days 1, no fuel burn 1; burn 1839.6 per hour from 3 stakes', JSON.stringify(m.stakes.fuel.buckets) === '[1,1,0,1,0,1]' && near(m.stakes.fuel.burnPh, 1839.6) && m.stakes.fuel.burnStakes === 3 && m.stakes.fuel.n === 4, JSON.stringify(m.stakes.fuel));
        // bucket edges, on exact binary fractions: 5400 / 900 = 6 h exactly, 21600 / 900 = 24, 64800 / 900 = 72
        const mk = (fuel, use) => ({ a: 'e' + Math.random(), o: 'A', st: 'active', tier: 1, b: 1, crew: 1, body: 'p1', fuel, use });
        const E = A.build({ fleets: [], owners: [], stakes: [mk(0, [{ r: 'Fuel', ps: 0.25 }]), mk(5399, [{ r: 'Fuel', ps: 0.25 }]), mk(5400, [{ r: 'Fuel', ps: 0.25 }]), mk(21599, [{ r: 'Fuel', ps: 0.25 }]), mk(21600, [{ r: 'Fuel', ps: 0.25 }]), mk(64799, [{ r: 'Fuel', ps: 0.25 }]), mk(64800, [{ r: 'Fuel', ps: 0.25 }]), mk(50, []), mk(50, [{ r: 'Fuel', ps: 0 }]), mk(null, [{ r: 'Fuel', ps: 0.25 }]), mk(7, undefined)] }, F.B);
        ok('fuel edges: 0 h empty, 5399 -> under 6, 5400 (6 h) -> 6-24, 21599 -> 6-24, 21600 (24 h) -> 1-3 days, 64799 -> 1-3 days, 64800 (72 h) -> over 3 days; two no-burn; unknown fuel and unread use left out', JSON.stringify(E.stakes.fuel.buckets) === '[1,1,2,2,1,2]' && E.stakes.fuel.n === 9, JSON.stringify(E.stakes.fuel));
        ok('fuel burn is per HOUR: 8 stakes burning 0.25/s = 7200 per hour', near(E.stakes.fuel.burnPh, 8 * 900) && E.stakes.fuel.burnStakes === 8, JSON.stringify(E.stakes.fuel));
        const Er = {}; A.render(Er, E, { width: 900 });
        ok('fuel card renders its caption with the stake count and the total burn', Er.innerHTML.includes('Stakes by hours of fuel left') && /9 stakes with fuel read/.test(Er.innerHTML) && /burn 7,?200 fuel per hour/.test(Er.innerHTML), (Er.innerHTML.match(/All stakes together[^<]*/) || [''])[0]);
    });
    // ---- every figure against the independent reference
    figures('fixture', F, true);
    if (realData) figures('real', realData, true);
    else ok('real data present (Data/c4-live)', true);   // not a failure when absent; the fixture covers the rules
    const oldF = { L: stripStakes(F.L), B: F.B };
    figures('fixture-old', oldF, true);
    safe('old data state', () => {
        const m = A.build(oldF.L, oldF.B);
        ok('old data: state old, no field flagged', m.stakes.state === 'old' && !m.stakes.has.bl && !m.stakes.has.pw && !m.stakes.has.out && !m.stakes.has.cap);
        ok('old data: buildings per stake from the b field', m.stakes.bldSource === 'b' && kv(m.stakes.bldDist)[4] === 1);
        ok('old data: type, tier, state still counted', m.stakes.byType.length > 0 && m.stakes.byTier.length > 0 && m.stakes.byState.length > 0);
    });
    const noneF = { L: noStakes(F.L), B: F.B };
    figures('fixture-none', noneF, true);

    // ---- robustness: garbage in, no throw, no NaN
    [null, undefined, {}, { fleets: 'x', owners: [null, 3], stakes: [{}] }, { fleets: [{}, { s: {}, mine: {} }, { s: { kind: 'mining' }, mine: { ups: 'a' } }], owners: [{ rank: 'x' }], stakes: [null] }].forEach((g, i) => {
        safe('garbage input ' + i, () => {
            const m = A.build(g, g && g.bodies ? g : null);
            const el = {}; A.render(el, m, { width: 360 });
            ok('garbage ' + i + ': no NaN/Infinity/undefined in model or html', !/NaN|Infinity|undefined/.test(JSON.stringify(m) + el.innerHTML), (JSON.stringify(m) + el.innerHTML).match(/.{20}(NaN|Infinity|undefined).{10}/));
            ok('garbage ' + i + ': every section id', A.sections.every(id => el.innerHTML.includes('id="c4an-' + id + '"')));
        });
    });
    safe('render of a missing model', () => { const el = {}; A.render(el, null, { width: 360 }); ok('null model shows a note', /No data/.test(el.innerHTML)); });

    // ---- render contract
    const states = [['fixture', F], ['fixture-old', oldF], ['fixture-none', noneF]].concat(realData ? [['real', realData]] : []);
    states.forEach(([tag, D]) => [360, 900].forEach(w => safe('render ' + tag + ' ' + w, () => {
        const m = A.build(D.L, D.B), el = {};
        A.render(el, m, { width: w, reducedMotion: false });
        const h = el.innerHTML;
        ok(tag + '@' + w + ': no style attribute', !/\sstyle\s*=/i.test(h));
        ok(tag + '@' + w + ': no <script', !/<script/i.test(h));
        ok(tag + '@' + w + ': no inline handler attribute', !(h.match(/<[a-zA-Z][^>]*>/g) || []).some(t => /\son[a-z]+\s*=/i.test(t)));
        ok(tag + '@' + w + ': every section id', A.sections.every(id => h.includes('id="c4an-' + id + '"')));
        ok(tag + '@' + w + ': no NaN, Infinity or undefined', !/NaN|Infinity|undefined/.test(h));
        ok(tag + '@' + w + ': layout class', w >= 640 ? el.className.includes('c4an-wide') : el.className.includes('c4an-narrow'), el.className);
        const widths = (h.match(/<svg [^>]*width="(\d+)"/g) || []).map(s => Number(s.match(/width="(\d+)"/)[1]));
        ok(tag + '@' + w + ': positive control, svgs drawn', widths.length >= 4, String(widths.length));
        ok(tag + '@' + w + ': every svg fits the width (' + Math.max(0, ...widths) + ')', widths.every(x => x <= (w >= 640 ? (w - 12) / 2 : w)));
        const heads = (h.match(/<h3 class="c4an-h"/g) || []).length;
        ok(tag + '@' + w + ': four section headings', heads === 4);
        ok(tag + '@' + w + ': every chart carries a caption line', (h.match(/class="c4an-chart"/g) || []).length === (h.match(/class="c4an-cap"/g) || []).length);
    })));
    safe('width 640 is the wide breakpoint', () => { const a = {}, b = {}; const m = A.build(F.L, F.B); A.render(a, m, { width: 640 }); A.render(b, m, { width: 639 }); ok('640 wide, 639 narrow', a.className.includes('wide') && b.className.includes('narrow')); });
    safe('reduced motion drops the animation class', () => { const a = {}; A.render(a, A.build(F.L, F.B), { width: 360, reducedMotion: true }); ok('no c4an-anim', !a.className.includes('anim')); });
    safe('escaping', () => {
        const el = {}; A.render(el, A.build(F.L, F.B), { width: 900 });
        const h = el.innerHTML;
        ok('positive control: the evil stake system name is rendered (escaped; the label is clipped, so its readable prefix)', h.includes('&lt;img src=x on'), '');
        ok('no raw <img', !/<img/i.test(h));
        ok('resource name with a script tag is escaped', h.includes('Evil&quot;&gt;&lt;script&gt;x&lt;/script&gt;') && !/<script/i.test(h));
        ok('attribute breakers are escaped (no raw quote-then-angle)', !/"><script/.test(h));
        const el2 = {}; A.render(el2, A.build(F.L, F.B), { width: 900, esc: s => '[' + String(s).replace(/</g, '&lt;') + ']' });
        ok('opts.esc is honoured', el2.innerHTML.includes('[Alpha'), '');
    });
    safe('contract', () => {
        ok('version 1', A.version === '1');
        ok('sections list', JSON.stringify(A.sections) === JSON.stringify(['mining', 'council', 'stakes', 'compare']));
        ok('build is pure: same input twice gives the same model', JSON.stringify(A.build(F.L, F.B)) === JSON.stringify(A.build(F.L, F.B)));
        const before = JSON.stringify(F.L); A.build(F.L, F.B); ok('build does not mutate its input', JSON.stringify(F.L) === before);
    });
    safe('old and none render notes', () => {
        const o = {}; A.render(o, A.build(oldF.L, oldF.B), { width: 900 });
        ok('old data says "needs a fresh read"', o.innerHTML.includes('needs a fresh read'));
        ok('old data: the Fuel card says it needs a fresh read', /Fuel burn needs a fresh read/.test(o.innerHTML) && !o.innerHTML.includes('Stakes by hours of fuel left'));
        const fr = {}; A.render(fr, A.build(F.L, F.B), { width: 900 });
        ok('full data: the Fuel card is drawn once, in the Claim stakes section', fr.innerHTML.includes('Stakes by hours of fuel left') && fr.innerHTML.includes('>Fuel<'));
        ok('captions no longer say stake output is gross or that consumption is not subtracted', !/gross|consumption not subtracted/.test(fr.innerHTML) && /production rate the chain stores for each stake/.test(fr.innerHTML));
        ok('old data still draws stakes by type', o.innerHTML.includes('Stakes by planet type'));
        const n = {}; A.render(n, A.build(noneF.L, noneF.B), { width: 900 });
        ok('no stakes: no Fuel card', !n.innerHTML.includes('Fuel left'));
        ok('no stakes: a one-line note', n.innerHTML.includes('No claim stakes in this read'));
        ok('no stakes: compare says so', n.innerHTML.includes('No claim stakes in this read.') );
        ok('no stakes: owners-by-what-they-run still drawn', n.innerHTML.includes('Owners by ships and stakes'));
    });
    safe('percent toggle', () => {
        const fmtp = p => (p < 10 ? (Math.round(p * 10) / 10).toFixed(1) : String(Math.round(p))) + '%';
        const fakeEl = () => ({ handlers: [], addEventListener(t, f) { if (t === 'click') this.handlers.push(f); } });
        const press = (e, attrs) => { const btn = { getAttribute: k => (k in attrs ? attrs[k] : null) }; e.handlers.forEach(h => h({ target: { closest: () => btn } })); };
        const cardsOf = h => h.split('<figure class="c4an-card">').slice(1);
        const chartsOf = c => c.split('<div class="c4an-chart">').slice(1);
        const valsOf = c => [...c.matchAll(/class="c4an-tx an-val"[^>]*>([^<]*)</g)].map(m => m[1]);
        const pvOf = t => { const m = /^(\d+(?:\.\d+)?)%/.exec(t); return m ? Number(m[1]) : NaN; };
        const modeOf = (h, id) => { const m = new RegExp('data-an-card="' + id + '" data-an-mode="(num|pct)" aria-pressed="true"').exec(h); return m && m[1]; };
        const cardHtml = (h, id) => cardsOf(h).find(c => c.includes('data-an-card="' + id + '"')) || '';
        A.setMode('num');
        const m0 = A.build(F.L, F.B), CARDS = A.shareCards;
        ok('eight cards can show a share', Array.isArray(CARDS) && CARDS.length === 8, String(CARDS && CARDS.length));
        // ---- default is counts; no percent text, every applicable card drawn with its pair
        const e0 = {}; A.render(e0, m0, { width: 900 });
        ok('default is counts: no "Shown as %" caption, getMode num', !/Shown as %/.test(e0.innerHTML) && A.getMode() === 'num');
        const drawn = CARDS.filter(id => e0.innerHTML.includes('data-an-card="' + id + '"'));
        ok('every applicable card shows its # / % pair on the full fixture (positive control, ' + drawn.length + ' of 8)', drawn.length === 8, drawn.join());
        ok('the pair is two real buttons with aria-pressed (# pressed in counts)', modeOf(e0.innerHTML, 'council-rank') === 'num' && /<button type="button" class="c4an-tgb"[^>]*data-an-mode="pct" aria-pressed="false"/.test(e0.innerHTML));
        ok('one All charts pair at the top of the output', e0.innerHTML.indexOf('c4an-bar') < e0.innerHTML.indexOf('<section') && /data-an-all="1" data-an-mode="num" aria-pressed="true"/.test(e0.innerHTML));
        // ---- literal shares on the fixture, re-derived by hand from the raw rows
        A.setMode('pct');
        const e1 = {}; A.render(e1, m0, { width: 900 });
        const h1 = e1.innerHTML;
        ok('getMode pct after setMode pct, All charts pair says pct', A.getMode() === 'pct' && /data-an-all="1" data-an-mode="pct" aria-pressed="true"/.test(h1));
        const rank = valsOf(chartsOf(cardHtml(h1, 'council-rank'))[0]);
        ok('players per rank: ranks 0,0,1,1,2 of 5 ranked = 40%, 40%, 20%', rank.join() === '40%,40%,20%', rank.join());
        const wh = chartsOf(cardHtml(h1, 'stakes-where')), tierV = valsOf(wh[1]);
        ok('stakes per tier: 3 of 4 = 75%, 1 of 4 = 25%', tierV.join() === '75%,25%', tierV.join());
        ok('captions name what 100% is', /Shown as % of 5 ranked players/.test(cardHtml(h1, 'council-rank')) && wh.every(c => /Shown as % of 4 claim stakes/.test(c)), wh.map(c => (/Shown as[^<]*/.exec(c) || [''])[0]).join(' | '));
        const rm = ref(F.L, F.B).compare.mix, mixTot = rm.total;
        const wantMix = [rm.shipsOnly, rm.stakesOnly, rm.both, rm.neither].map(n => fmtp(n / mixTot * 100));
        ok('owners by what they run: shares re-derived from the raw rows (' + wantMix.join() + ')', valsOf(cardHtml(h1, 'compare-mix')).join() === wantMix.join(), valsOf(cardHtml(h1, 'compare-mix')).join());
        const rres = ref(F.L, F.B).compare.res, order = Object.keys(rres).sort((a, b) => (rres[b][0] + rres[b][1]) - (rres[a][0] + rres[a][1]) || (a < b ? -1 : 1));
        const wantPair = []; order.forEach(k => { const t = rres[k][0] + rres[k][1]; wantPair.push(fmtp(rres[k][0] / t * 100), fmtp(rres[k][1] / t * 100)); });
        const gotPair = valsOf(chartsOf(cardHtml(h1, 'compare-res'))[0]);
        ok('units per hour by resource: each bar a share of that resource\'s own combined total', gotPair.join() === wantPair.join(), gotPair.join() + ' vs ' + wantPair.join());
        ok('the pair chart caption says the two bars add to 100%', /add to 100%/.test(cardHtml(h1, 'compare-res')));
        ok('the raw number stays readable: hover titles carry the count and the total', /Iron Ore ships: [\d,.]+ per hour \([\d.]+% of the combined/.test(cardHtml(h1, 'compare-res')) && /tier 1: 3 \(75% of the total 4\)|tier 1: 3[^<]*75%/.test(cardHtml(h1, 'stakes-where')), '');
        // ---- sum rule on every share chart: fixtures and the real file
        const sumRule = (tag, h) => {
            let n = 0, bad = [];
            cardsOf(h).forEach(card => chartsOf(card).forEach(ch => {
                if (!/Shown as % of/.test(ch) || /rows shown cover/.test(ch)) return;
                const v = valsOf(ch).map(pvOf);
                if (!v.length) return;
                n++;
                if (/add to 100%/.test(ch)) { for (let i = 0; i < v.length; i += 2) if (!(Math.abs(v[i] + v[i + 1] - 100) <= 1)) bad.push('pair ' + i + ': ' + v[i] + '+' + v[i + 1]); }
                else if (!(Math.abs(v.reduce((t, x) => t + x, 0) - 100) <= 0.5 * v.length + 0.01)) bad.push('sum ' + v.join('+'));
            }));
            ok(tag + ': ' + n + ' share charts, each adds to 100% within rounding', n >= 8 && bad.length === 0, bad.join('; '));
        };
        sumRule('fixture', h1);
        if (realData) { const er = {}; A.render(er, A.build(realData.L, realData.B), { width: 900 }); sumRule('real data', er.innerHTML); ok('real data in percent: no NaN / Infinity / undefined', !/NaN|Infinity|undefined/.test(er.innerHTML)); }
        const eo = {}; A.render(eo, A.build(oldF.L, oldF.B), { width: 900 }); ok('old data in percent: no NaN, notes still shown', !/NaN|Infinity|undefined/.test(eo.innerHTML) && eo.innerHTML.includes('needs a fresh read'));
        // ---- top-N list: coverage of the shown rows, re-derived on a fixture with 12 resources
        const G = JSON.parse(JSON.stringify(F.L)); G.stakes[0].out = []; for (let i = 1; i <= 12; i++) G.stakes[0].out.push({ r: 'res' + i, ps: i });
        const tot = {}; G.stakes.forEach(s => (s.out || []).forEach(o => { tot[o.r] = (tot[o.r] || 0) + o.ps * 3600; }));
        const sorted = Object.values(tot).sort((a, b) => b - a), all = sorted.reduce((t, x) => t + x, 0), top10 = sorted.slice(0, 10).reduce((t, x) => t + x, 0);
        const eg = {}; A.render(eg, A.build(G, F.B), { width: 900 });
        const prodCh = chartsOf(cardHtml(eg.innerHTML, 'stakes-out'))[0];
        ok('top-N: the caption gives the coverage of the rows shown (' + fmtp(top10 / all * 100) + ')', prodCh.includes('the 10 rows shown cover ' + fmtp(top10 / all * 100) + ' of it') && /Shown as % of [\d,]+ units per hour from all/.test(prodCh) && prodCh.includes('from all ' + Object.keys(tot).length + ' resources'), (/Shown as[^<]*/.exec(prodCh) || [''])[0]);
        ok('top-N: the first bar is its share of the TOTAL, not of the rows shown', valsOf(prodCh)[0] === fmtp(sorted[0] / all * 100), valsOf(prodCh)[0] + ' vs ' + fmtp(sorted[0] / all * 100));
        // ---- zero total shows the note, never NaN
        const mz = A.build(F.L, F.B); mz.stakes.tot.tier = 0;
        const ez = {}; A.render(ez, mz, { width: 900 });
        ok('zero total: the note, no NaN or Infinity', ez.innerHTML.includes('the total is zero') && !/NaN|Infinity/.test(ez.innerHTML));
        ok('zero total: positive control, the other charts still show percentages', valsOf(chartsOf(cardHtml(ez.innerHTML, 'stakes-where'))[2]).every(t => /%$/.test(t)) && valsOf(chartsOf(cardHtml(ez.innerHTML, 'stakes-where'))[2]).length > 0);
        // ---- mode survives a second render; clicks; one listener
        const el = fakeEl(); A.setMode('num');
        A.render(el, m0, { width: 900 }); A.render(el, m0, { width: 1200 });
        ok('one delegated click listener after two renders into the same element', el.handlers.length === 1, String(el.handlers.length));
        press(el, { 'data-an-mode': 'pct', 'data-an-card': 'stakes-where' });
        ok('a click on one card\'s % changes only that card', modeOf(el.innerHTML, 'stakes-where') === 'pct' && CARDS.filter(id => id !== 'stakes-where').every(id => modeOf(el.innerHTML, id) === 'num') && A.getMode() === 'mixed', CARDS.map(id => id + ':' + modeOf(el.innerHTML, id)).join());
        ok('the clicked card now shows shares, the others still counts', /Shown as % of 4 claim stakes/.test(cardHtml(el.innerHTML, 'stakes-where')) && !/Shown as %/.test(cardHtml(el.innerHTML, 'council-rank')));
        ok('a width change keeps the mode (second render into a new element)', modeOf((() => { const e = {}; A.render(e, m0, { width: 360 }); return e.innerHTML; })(), 'stakes-where') === 'pct');
        press(el, { 'data-an-mode': 'num', 'data-an-card': 'stakes-where' });
        ok('a click on # sets the card back', modeOf(el.innerHTML, 'stakes-where') === 'num' && A.getMode() === 'num');
        press(el, { 'data-an-mode': 'pct', 'data-an-all': '1' });
        ok('All charts % sets every card', CARDS.every(id => modeOf(el.innerHTML, id) === 'pct') && A.getMode() === 'pct');
        press(el, { 'data-an-mode': 'pct', 'data-an-card': 'not-a-card' }); press(el, { 'data-an-mode': 'bogus', 'data-an-card': 'stakes-where' });
        ok('an unknown card id or mode value is ignored', CARDS.every(id => modeOf(el.innerHTML, id) === 'pct'));
        A.setMode('num');
        ok('setMode num puts every card back, setMode with junk changes nothing', (A.setMode('junk'), A.getMode()) === 'num');
        // ---- hygiene in percent mode
        A.setMode('pct');
        const ep = {}; A.render(ep, m0, { width: 900 }); const hp = ep.innerHTML;
        ok('percent mode: no style attribute, no inline handler, no <script', !/\sstyle\s*=/i.test(hp) && !(hp.match(/<[a-zA-Z][^>]*>/g) || []).some(t => /\son[a-z]+\s*=/i.test(t)) && !/<script/i.test(hp));
        ok('percent mode: positive control, the evil resource name is drawn, escaped', hp.includes('Evil&quot;&gt;&lt;script&gt;x&lt;/script&gt;') && !/"><script/.test(hp));
        A.setMode('num');
    });
    safe('like with like: stake outputs set against ships', () => {
        const m = A.build(F.L, F.B), c = m.compare, names = c.res.map(e => e.r);
        ok('compare rows: Iron Ore (mined, positive control) is there; Hydrogen and Fuel (stake outputs no fleet mines) are not', names.includes('Iron Ore') && !names.includes('Hydrogen') && !names.includes('Fuel'), names.join());
        ok('the stake outputs left out are named: Fuel, Hydrogen', JSON.stringify(c.otherOut) === JSON.stringify(['Fuel', 'Hydrogen']), JSON.stringify(c.otherOut));
        // crew: stake sa1 0.75/s, sa3 1/s, sa4 only its Iron Ore 0.1/s (Hydrogen 2 and Fuel 3 are not counted), sa2 has no crew: (0.75 + 1 + 0.1) * 3600 / (2 + 1 + 3)
        ok('output per crew on stakes counts mined resources only: 6660 per hour over 6 crew = 1110', near(c.crew.stakes.perCrew, 1110) && c.crew.stakes.n === 3, JSON.stringify(c.crew.stakes));
        const un = c.factions.find(f => f.fa === 'unaligned');
        ok('faction share: stake Z (unaligned) adds only its 0.1 Iron Ore per second = 360 per hour', un && near(un.stakes, 360), JSON.stringify(un));
        const e = {}; A.render(e, m, { width: 900 }); const h = e.innerHTML;
        const n3 = (h.match(/Stake output is counted only for resources that ships also mine; 2 other stake outputs, such as Fuel, are left out\./g) || []).length;
        ok('the four ships-vs-stakes captions each say what is left out (2 other stake outputs, such as Fuel)', n3 === 4, 'found ' + n3);
        const G = JSON.parse(JSON.stringify(F.L)); G.stakes.forEach(s => { s.out = (s.out || []).filter(o => o.r === 'Iron Ore' || o.r.startsWith('Evil')); });
        const eg = {}; A.render(eg, A.build(G, F.B), { width: 900 });
        ok('positive control: with no unmined stake output the caption says only what is counted, no "left out"', (eg.innerHTML.match(/Stake output is counted only for resources that ships also mine\./g) || []).length === 4 && !/other stake output/.test(eg.innerHTML));
        // no fleet mines anything: every stake output is unmined, nothing is compared
        const H = JSON.parse(JSON.stringify(F.L)); H.fleets = []; const mh = A.build(H, F.B);
        ok('no mining fleet in the read: no stake output is set against ships (all rows empty), every output named as left out', mh.compare.res.length === 0 && mh.compare.otherOut.length === 4 && mh.compare.crew.stakes.perCrew === 0, JSON.stringify(mh.compare.otherOut));
    });
    safe('names from the chain cannot be inherited keys (__proto__, constructor)', () => {
        const before = Object.getOwnPropertyNames(Object.prototype).sort().join(), P = ['__proto__', 'constructor', 'toString', 'hasOwnProperty'];
        const fl = [], stakes = [];
        P.forEach((p, i) => {
            fl.push(SIZE('p' + i, p, p, 2, 4 + i, { fa: p, mine: { ups: 4 + i, baseUps: 2, out: [{ r: p, ups: 4 + i }] } }));
            stakes.push({ a: 'ps' + i, o: p, st: p, tier: i, b: 1, crew: 1, body: p, sysName: p, bl: [{ id: i, n: p, q: 1, k: p }], pw: { gen: 2, use: 1 }, cap: { used: 1, total: 2 }, out: [{ r: p, ps: 1 }], fuel: 5, use: [{ r: 'Fuel', ps: 0.1 }] });
        });
        const owners = P.map((p, i) => ({ p, fa: p, rank: i % 2, fleets: 1, ships: 1, stakes: 1, ups: 1, atlas: 1 }));
        const L = { fleets: fl, owners, stakes }, B = { bodies: P.map(p => ({ a: p, k: 'planet', sub: p })) };
        let html = '', m = null, thrown = null;
        try { m = A.build(L, B); const e = {}; A.render(e, m, { width: 900 }); html = e.innerHTML; } catch (x) { thrown = x; }
        const polluted = Object.getOwnPropertyNames(Object.prototype).sort().join() !== before || ({}).ups !== undefined || ({}).ships !== undefined || ({}).r !== undefined;
        // undo whatever a broken build did, so the next check (and the next mutant) starts clean
        for (const k of Object.getOwnPropertyNames(Object.prototype)) if (!before.split(',').includes(k)) delete Object.prototype[k];
        ok('a resource, size class, planet type, building kind, state, owner named __proto__ / constructor builds and renders', !thrown && html.length > 1000, thrown && thrown.message);
        ok('afterwards ({}).ups is undefined and Object.prototype has no new keys', !polluted);
        ok('positive control: the odd names are drawn (resource rows hold __proto__ and constructor)', !!m && m.compare.res.some(e => e.r === '__proto__') && m.compare.res.some(e => e.r === 'constructor') && html.includes('__proto__'));
        const has = (list, k, key) => !!m && list.some(e => e[key || 'k'] === k && e.n !== 0);
        ok('every map keeps the odd names as ordinary rows: building kinds, planet types, states, stake production, size classes', !!m && ['__proto__', 'constructor'].every(k => has(m.stakes.kinds, k) && has(m.stakes.byType, k) && has(m.stakes.byState, k) && m.stakes.prod.some(e => e.r === k && e.uph > 0) && m.mining.bySize.some(e => e.size === k)), m && JSON.stringify([m.stakes.kinds, m.stakes.byType, m.stakes.byState].map(l => l.map(e => e.k))));
    });
    safe('ship models against stake tiers, and the dot cards', () => {
        const TIP = 'Armstrong IMP Tip Default Config', PX = 'Pearce X4 Default Config', CAL = 'Calico Shipit Default Config', EV = 'Evil"><script>x</script> Default Config';
        const mk = (a, n, o, types, ships, ups, extra) => Object.assign({ a, n, o, fa: 'mud', npc: 0, s: { kind: 'mining' }, ships, crew: 2, flagSize: 'small', types, mine: { ups, baseUps: ups / 2, out: [{ r: 'Iron Ore', ups: ups * 0.75 }, { r: 'Lumanite', ups: ups * 0.25 }] } }, extra || {});
        const fleets = [
            mk('F1', 'Mixed One', 'o1', { [TIP]: 1, [PX]: 3 }, 4, 2.0),            // mixed: Pearce is the larger part
            mk('F2', 'Tip A', 'o1', { [TIP]: 2 }, 2, 1.0),                         // yps 0.5
            mk('F3', 'Tip B', 'o2', { [TIP]: 4 }, 4, 4.0),                         // yps 1
            mk('F4', 'Tip C', 'o2', { [TIP]: 1 }, 1, 3.0),                         // yps 3   -> Tip median of three = 1
            mk('F5', 'Px A', 'o2', { [PX]: 1 }, 1, 0.2),                           // yps 0.2
            mk('F6', 'Px B', 'o2', { [PX]: 2 }, 2, 0.8),                           // yps 0.4 -> Pearce median of two = 0.3
            mk('F7', 'Cal Solo', 'o2', { [CAL]: 1 }, 1, 0.7),                      // one fleet of its model
            mk('F8', '<img src=x onerror=1>', 'ABCDEFGHIJKLMNOPQRST', { [EV]: 1 }, 1, 0.6),   // evil names, owner with no name row
            mk('F9', 'No types', 'o1', undefined, 2, 1.0),                         // composition not read: counted as mixed
            Object.assign(mk('F10', 'Fighter', 'o1', { [TIP]: 2 }, 2, 9), { s: { kind: 'combat' } })   // not a mining fleet: never drawn
        ];
        const owners = [{ p: 'o1', name: 'Alice "A" <b>', fa: 'mud' }, { p: 'o2', name: 'Bob', fa: 'oni' }];
        const bl = (e, o) => [{ n: 'Extractor', q: e, k: 'extractor' }, { n: 'Hub', q: 1, k: 'central_hub' }].concat(o || []);
        const st = (a, tier, out, e, extra) => Object.assign({ a, o: 'o1', tier, st: 'active', body: 'b1', sysName: 'Sys ' + a, out, bl: e == null ? undefined : bl(e) }, extra || {});
        const stakes = [
            st('S1', 1, [{ r: 'Iron Ore', ps: 0.1 }, { r: 'Fuel', ps: 5 }], 1),         // Fuel is not mined by any fleet: not counted -> 0.1
            st('S2', 1, [{ r: 'Iron Ore', ps: 0.3 }, { r: 'Lumanite', ps: 0.1 }], 2),   // 0.4
            st('S3', 1, [{ r: 'Iron Ore', ps: 0.2 }], 0),                               // 0.2, no extractor
            st('S4', 1, undefined, 1),                                                  // no production read: not counted
            st('S5', 2, [{ r: 'Iron Ore', ps: 0.9 }], 4), st('S6', 2, [{ r: 'Iron Ore', ps: 0.5 }], 3, { o: 'o2' }),
            st('S7', 3, [{ r: 'Fuel', ps: 7 }], 1)                                      // only unmined output: no production -> tier 3 has no row
        ];
        const L = { fleets, owners, stakes }, B = { bodies: [{ a: 'b1', k: 'planet', sub: 'terrestrial' }] };
        const m = A.build(L, B), R = m.compare.rate;
        // ---- independent reference
        const med = v => { const a = v.slice().sort((x, y) => x - y), n = a.length; return n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2; };
        const refModel = {}; let refMixed = 0;
        for (const f of fleets) {
            if (f.s.kind !== 'mining') continue;
            const ks = Object.keys(f.types || {}).filter(k => f.types[k] > 0);
            if (ks.length === 1) (refModel[ks[0]] = refModel[ks[0]] || []).push(f.mine.ups / f.ships); else refMixed++;
        }
        const mined = new Set(); fleets.filter(f => f.s.kind === 'mining').forEach(f => f.mine.out.forEach(o => mined.add(o.r)));
        const refTier = {};
        for (const s of stakes) {
            if (!s.out) continue;
            const t = s.out.filter(o => mined.has(o.r)).reduce((a, o) => a + o.ps, 0);
            if (!(t > 0)) continue;
            const e = s.bl.find(b => b.k === 'extractor').q, g = e === 0 ? 'no extractor' : e === 1 ? '1 extractor' : e + ' extractors';
            const T = refTier[s.tier] = refTier[s.tier] || { all: [], g: {} };
            T.all.push(t); (T.g[g] = T.g[g] || []).push(t);
        }
        const byLabel = {}; R.rows.forEach(r => { byLabel[r.kind + ':' + (r.kind === 'model' ? r.model : r.kind === 'tier' ? r.tier : r.label)] = r; });
        const near2 = (a, b) => Math.abs(a - b) < 1e-9;
        ok('ships: every model with a pure fleet has a row, median yield per ship and n match the raw rows', Object.keys(refModel).length === 4 &&
            Object.keys(refModel).every(k => { const r = byLabel['model:' + k]; return r && near2(r.v, med(refModel[k])) && r.n === refModel[k].length; }), JSON.stringify(R.rows.filter(r => r.kind === 'model').map(r => [r.model, r.v, r.n])));
        ok('ships: positive controls - Tip median of three fleets is 1 (not the mean 1.5), Pearce of two is 0.3, Calico with one fleet is 0.7', near2(byLabel['model:' + TIP].v, 1) && near2(byLabel['model:' + PX].v, 0.3) && byLabel['model:' + CAL].n === 1 && near2(byLabel['model:' + CAL].v, 0.7));
        ok('ships: mixed and composition-less fleets are counted (2), not drawn; a combat fleet is neither', R.mixed === refMixed && R.mixed === 2 && R.pureFleets === 7);
        ok('ships: the name shown has no trailing " Default Config", the hover text keeps the full name', byLabel['model:' + TIP].label === 'Armstrong IMP Tip' && byLabel['model:' + EV].label === 'Evil"><script>x</script>' && A.shortModel('Config Default Config Default Config') === 'Config Default Config');
        const tr = k => byLabel['tier:' + k];
        ok('stakes: tier rows are the median over stakes with production, Fuel not counted (tier 1 = 0.2 over 3, tier 2 = 0.7 over 2)', near2(tr(1).v, med(refTier[1].all)) && tr(1).n === 3 && near2(tr(1).v, 0.2) && near2(tr(2).v, med(refTier[2].all)) && tr(2).n === 2, JSON.stringify([tr(1) && [tr(1).v, tr(1).n], tr(2) && [tr(2).v, tr(2).n]]));
        ok('stakes: a tier whose only output is unmined has no row (tier 3), and a stake with no output read is not counted', !tr(3) && tr(1).list.every(e => e.id !== 'S4'));
        const extRows = R.rows.filter(r => r.kind === 'ext');
        const xr = g => extRows.find(r => r.label === g) || {};
        ok('stakes: one extractor row per exact count under its tier (no extractor 0.2, 1 = 0.1, 2 = 0.4, 3 = 0.5 over 1, 4 = 0.9 over 1; no "3 or more")', extRows.length === 5 && !extRows.some(r => /or more/.test(r.label)) &&
            near2(xr('no extractor').v, 0.2) && near2(xr('1 extractor').v, 0.1) && near2(xr('2 extractors').v, 0.4) && near2(xr('3 extractors').v, 0.5) && xr('3 extractors').n === 1 && near2(xr('4 extractors').v, 0.9) && xr('4 extractors').n === 1, JSON.stringify(extRows.map(r => [r.label, r.v, r.n])));
        ok('stakes: every extractor row equals the independent grouping of its tier, and the counts rise down the tier', Object.keys(refTier).every(k => { const mine = R.rows.filter(r => r.kind === 'ext' && r.list[0].tier === Number(k)); const gs = Object.keys(refTier[k].g); return mine.length === gs.length && mine.every(r => refTier[k].g[r.label] && near2(r.v, med(refTier[k].g[r.label])) && r.n === refTier[k].g[r.label].length) && mine.every((r, i) => i === 0 || mine[i - 1].ext < r.ext); }));
        // ---- order, asserted apart from the content: tiers and ships by value, high to low; an extractor row follows its own tier
        const top = R.rows.filter(r => r.kind !== 'ext');
        ok('order: ship rows and tier rows are one list sorted by value, high to low', top.every((r, i) => i === 0 || top[i - 1].v >= r.v), top.map(r => r.label + '=' + r.v).join());
        ok('order: every extractor row sits right after its own tier row (or after a sibling), never before it', R.rows.every((r, i) => r.kind !== 'ext' || (i > 0 && (R.rows[i - 1].kind === 'tier' || R.rows[i - 1].kind === 'ext'))));
        // ---- states
        const oldD = JSON.parse(JSON.stringify(L)); oldD.stakes.forEach(s => { delete s.out; delete s.bl; });
        const mo = A.build(oldD, B), eo = {}; A.render(eo, mo, { width: 900 });
        ok('old data (no stake output): ship rows only, the caption says stake output needs a fresh read', mo.compare.rate.noOut && mo.compare.rate.rows.every(r => r.kind === 'model') && /Stake output needs a fresh read, so no stake rows/.test(eo.innerHTML));
        const nd = JSON.parse(JSON.stringify(L)); nd.stakes = []; const mn = A.build(nd, B), en = {}; A.render(en, mn, { width: 900 });
        ok('no stakes: ship rows only, the caption says so', mn.compare.rate.noStakes && mn.compare.rate.rows.length === 4 && /No claim stakes in this read, so only ship rows/.test(en.innerHTML));
        const nb = JSON.parse(JSON.stringify(L)); nb.stakes.forEach(s => { delete s.bl; }); const mb = A.build(nb, B), eb = {}; A.render(eb, mb, { width: 900 });
        ok('stakes without a building list: tier rows stay, no extractor rows, the caption says they need a fresh read', mb.compare.rate.rows.some(r => r.kind === 'tier') && !mb.compare.rate.rows.some(r => r.kind === 'ext') && /extractor rows need the building list/.test(eb.innerHTML));
        const none = A.build({ fleets: [], owners: [], stakes: [] }, null), enone = {}; A.render(enone, none, { width: 900 });
        ok('nothing to draw: a note, not an empty chart', none.compare.rate.rows.length === 0 && /No mining fleet made of one ship model/.test(enone.innerHTML));
        // ---- the chart markup
        const e = {}; A.render(e, m, { width: 1200 }); const h = e.innerHTML;
        const hits = (h.match(/class="an-hit" data-an-k="r\d+" tabindex="0" role="button" aria-label="[^"]+"/g) || []).length;
        ok('chart: one focusable hit area per row, each with an aria label', hits === R.rows.length && hits > 8, hits + ' vs ' + R.rows.length);
        ok('chart: the caption says what a ship row and a stake row count, the like-with-like rule, and uses no verdict word', /median units per second per ship over the mining fleets made only of that model/.test(h) && /median units per second per stake over the stakes with any production/.test(h) && /Stake output is counted only for resources that ships also mine/.test(h) && !/\bcapped\b|level off|\bcap\b/i.test(h.replace(/class="[^"]*"/g, '')));
        ok('chart: ship rows wear the ship colour and stake rows the stake colour (f-s1 / f-s2 bars)', /Ship models, per ship/.test(h) && /Claim stake tiers, per stake/.test(h));
        ok('chart: no style attribute, no inline handler (attribute values stripped first: a dot label may hold the text onerror=), no <script, evil names escaped (positive control: the name is drawn)', !/\sstyle\s*=/i.test(h.replace(/"[^"]*"/g, '""')) && !(h.match(/<[a-zA-Z][^>]*>/g) || []).some(t => /\son[a-z]+\s*=/i.test(t.replace(/"[^"]*"/g, '""'))) && !/<script/i.test(h) && !/<img src/.test(h) && h.includes('Evil&quot;&gt;&lt;script') && h.includes('onerror=1'));
        // ---- the dot cards: every scatter dot is keyed to a row of the model
        const rows = m.mining.rows;
        const dots = h.match(/<circle class="an-dot[^>]*>/g) || [];
        ok('dots: both scatters give each dot a key, tabindex, role and aria label (positive control: 9 mining rows -> 9 + 9 dots)', rows.length === 9 && dots.length === 18 && dots.every(d => /data-an-k="f\d+" tabindex="0" role="button" aria-label="[^"]+"/.test(d)), dots.length + ' dots, ' + rows.length + ' rows');
        const decode = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
        const rawMining = fleets.filter(f => f.s.kind === 'mining' && f.mine.ups > 0 && f.ships > 0);
        const optsP = { esc: undefined, canPick: true };
        rawMining.forEach((f, i) => {
            const html = A.card(m, 'f' + i, optsP), txt = html ? decode(html) : '';
            const comp = Object.keys(f.types || {}).map(k => [k, f.types[k]]).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
            const pos = comp.map(c => txt.indexOf(A.shortModel(c[0]) + ' x ' + c[1]));
            const ownerShown = (owners.find(o => o.p === f.o) || {}).name || f.o.slice(0, 4) + '...' + f.o.slice(-4);
            ok('card ' + f.n + ': name, owner (name or short address), ships, crew, yield actual and base, composition largest first', !!html && txt.includes(f.n) && txt.includes(ownerShown) && txt.includes('<dt>Ships</dt><dd>' + f.ships + '<') &&
                txt.includes('<dt>Crew</dt><dd>' + f.crew + '<') && txt.includes('Iron Ore') && txt.includes('base ') && pos.every((p, j) => p >= 0 && (j === 0 || p > pos[j - 1])) && (comp.length || /not read/.test(txt)), txt.slice(0, 300));
        });
        const c0 = decode(A.card(m, 'f0', optsP));
        ok('card f0: the larger Pearce part is listed before Tip (largest first, 3 then 1)', c0.indexOf('Pearce X4 x 3') >= 0 && c0.indexOf('Pearce X4 x 3') < c0.indexOf('Armstrong IMP Tip x 1'));
        const c7 = A.card(m, 'f7', optsP), c7n = A.card(m, 'f7', { canPick: false });
        ok('card: evil fleet and model names are escaped (positive control: the name is rendered)', !/<img|<script/.test(c7) && c7.includes('&lt;img src=x onerror=1&gt;') && c7.includes('Evil&quot;&gt;&lt;script&gt;x&lt;/script&gt;') && !/<img|<script/.test(c7n) && c7n.includes('&lt;img src=x'));
        ok('card: no style attribute and no inline handler', ![c7, c0, A.card(m, 'r0', optsP)].some(x => (x.match(/<[a-zA-Z][^>]*>/g) || []).some(t => /\sstyle\s*=/i.test(t) || /\son[a-z]+\s*=/i.test(t))));
        ok('card: pick buttons only when the page gave onPick; the owner button carries the raw owner id', /data-an-pick="owner" data-an-id="ABCDEFGHIJKLMNOPQRST"/.test(c7) && !/data-an-pick/.test(c7n));
        ok('card: a key the model does not have gives nothing', A.card(m, 'f99', optsP) === null && A.card(m, 'zz', optsP) === null && A.card(m, 'r99', optsP) === null);
        // a ship-model row and a stake row: the fleets / stakes counted, up to 8 then "+N more"
        const tipRow = R.rows.findIndex(r => r.kind === 'model' && r.model === TIP), ct = decode(A.card(m, 'r' + tipRow, optsP));
        ok('row card (ship model): lists the 3 fleets counted, highest first, and names the model in full', ct.includes('Tip C') && ct.includes('Tip B') && ct.includes('Tip A') && ct.indexOf('Tip C') < ct.indexOf('Tip B') && ct.indexOf('Tip B') < ct.indexOf('Tip A') && ct.includes(TIP) && !/more</.test(ct) && !ct.includes('Mixed One'));
        const BIG = JSON.parse(JSON.stringify(L)); for (let i = 0; i < 12; i++) BIG.stakes.push(st('T' + i, 1, [{ r: 'Iron Ore', ps: 1 + i }], 1));
        const mbg = A.build(BIG, B), rb = mbg.compare.rate.rows.findIndex(r => r.kind === 'tier' && r.tier === 1), cb = decode(A.card(mbg, 'r' + rb, optsP));
        ok('row card (stake tier): 15 stakes -> shows 8 and "+7 more", highest first', (cb.match(/data-an-pick="stake"/g) || []).length === 8 && /\+7 more/.test(cb) && cb.indexOf('Sys T11') >= 0 && cb.indexOf('Sys T11') < cb.indexOf('Sys T10'));
        // ---- the Buildings card: every bar opens the stakes behind it, top five by count, each a button that opens that claim stake
        const UN = 'ABCDEFGHIJKLMNOPQRST';   // an owner with no name row
        const BLD = { fleets, owners, stakes: [1, 2, 3, 4, 5, 6, 7].map(i => st('B' + i, 1, [], i, { o: i % 2 ? 'o1' : 'o2' })).concat([st('B8', 2, [], 7, { o: UN, sysName: 'Sys <i>B8' })]) };
        const TW = { fleets, owners, stakes: [st('TWINSTAKEADDR01', 1, [], 2, { sysName: 'Twin' }), st('TWINSTAKEADDR02', 1, [], 2, { sysName: 'Twin' }), st('SOLO', 1, [], 2, { sysName: 'Solo' })] };
        const cTw = decode(A.card(A.build(TW, B), 'b0', optsP));
        ok('buildings card: two stakes of one owner in one system also show their short address, a lone one does not', cTw.includes('Twin tier 1 TWIN...DR01<') && cTw.includes('Twin tier 1 TWIN...DR02<') && cTw.includes('Solo tier 1<'), cTw);
        const mB = A.build(BLD, B), nameOf = o => (owners.find(x => x.p === o) || {}).name || '';
        const refList = pick => BLD.stakes.map(s => ({ id: s.a, o: s.o, v: pick(s) })).filter(e => e.v > 0)
            .sort((a, b) => b.v - a.v || (nameOf(a.o) < nameOf(b.o) ? -1 : nameOf(a.o) > nameOf(b.o) ? 1 : 0) || (a.id < b.id ? -1 : 1));
        const idsIn = html => (html.match(/data-an-id="([^"]+)"/g) || []).map(x => x.slice(12, -1));
        const kExt = mB.stakes.kinds.findIndex(e => e.k === 'extractor'), kHub = mB.stakes.kinds.findIndex(e => e.k === 'central_hub');
        const refExt = refList(s => s.bl.find(b => b.k === 'extractor').q), refHub = refList(s => s.bl.find(b => b.k === 'central_hub').q);
        const cE = A.card(mB, 'k' + kExt, optsP), cH = A.card(mB, 'k' + kHub, optsP), cEn = A.card(mB, 'k' + kExt, { canPick: false });
        ok('buildings card (kind): the five stakes with the most extractors, most first, ties by owner name then stake (B8,B7,B6,B5,B4), then "+3 more"', kExt >= 0 && idsIn(cE).join() === refExt.slice(0, 5).map(e => e.id).join() && idsIn(cE).join() === 'B8,B7,B6,B5,B4' && /\+3 more/.test(cE) && /Showing 5 of 8/.test(cE), idsIn(cE || '').join());
        ok('buildings card (kind): every button opens a claim stake, shows the owner (name, or short address when unnamed) and the count beside it', (cE.match(/data-an-pick="stake"/g) || []).length === 5 && !/data-an-pick="owner"/.test(cE) && decode(cE).includes('>ABCD...QRST</button>') && decode(cE).includes('>Bob</button> <span class="c4an-cdw">Sys B6 tier 1</span> <span class="c4an-cdv">x 6</span>') && /35 buildings of this kind on 8 stakes/.test(cE), decode(cE).slice(0, 400));
        ok('buildings card (kind): all the same count -> owner name order, still five (B8,B1,B3,B5,B7)', idsIn(cH).join() === refHub.slice(0, 5).map(e => e.id).join() && idsIn(cH).join() === 'B8,B1,B3,B5,B7', idsIn(cH || '').join());
        ok('buildings card: owner names are escaped, and without onPick the list is plain text (positive control: the names are there)', !/<b>"|<img|<script/.test(cE.replace(/<b>extractor<\/b>/, '')) && cE.includes('Alice &quot;A&quot; &lt;b&gt;') && cE.includes('Sys &lt;i&gt;B8 tier 2') && !/<i>/.test(cE) &&!/data-an-pick/.test(cEn) && cEn.includes('Bob') && !/Pick an owner/.test(cEn));
        const d8 = mB.stakes.bldDist.findIndex(e => Number(e.k) === 8), d3 = mB.stakes.bldDist.findIndex(e => Number(e.k) === 3), c8 = A.card(mB, 'b' + d8, optsP), c3 = A.card(mB, 'b' + d3, optsP);
        ok('buildings card (count): "8 buildings" lists exactly the two stakes with 8 (B8 unnamed first, B7), no "+more"; "3 buildings" lists B2 alone', idsIn(c8).join() === 'B8,B7' && !/more</.test(c8) && /2 stakes with 8 buildings each/.test(c8) && idsIn(c3).join() === 'B2' && /1 stake with 3 buildings each/.test(c3), idsIn(c8 || '').join() + ' | ' + idsIn(c3 || '').join());
        ok('buildings card: every model row carries its stakes and the lists add up to the bar (kinds: sum of counts = n; counts: stakes = n)', mB.stakes.kinds.every(e => e.list.reduce((t, x) => t + x.v, 0) === e.n) && mB.stakes.bldDist.every(e => e.list.length === e.n && e.list.every(x => x.v === Number(e.k))));
        ok('buildings card: a key past the rows gives nothing', A.card(mB, 'k99', optsP) === null && A.card(mB, 'b99', optsP) === null);
        const eB = {}; A.render(eB, mB, { width: 1200 }); const hB = eB.innerHTML;
        const hitN = p => (hB.match(new RegExp('class="an-hit" data-an-k="' + p + '\\d+" tabindex="0" role="button" aria-label="[^"]+"', 'g')) || []).length;
        ok('buildings chart: one focusable hit area per bar in both charts (2 kinds, 7 counts), none on the other bar charts', hitN('k') === mB.stakes.kinds.length && hitN('k') === 2 && hitN('b') === mB.stakes.bldDist.length && hitN('b') === 7 && (hB.match(/class="an-hit"/g) || []).length === hitN('k') + hitN('b') + mB.compare.rate.rows.length, hitN('k') + ' ' + hitN('b'));
        const oldB = JSON.parse(JSON.stringify(BLD)); oldB.stakes.forEach(s => { s.b = s.bl.reduce((t, b) => t + b.q, 0); delete s.bl; });
        const mOld = A.build(oldB, B), cOld = A.card(mOld, 'b0', optsP);
        ok('buildings card, old data (count field only): the count rows still open their stakes, there are no kind rows', mOld.stakes.kinds.length === 0 && A.card(mOld, 'k0', optsP) === null && idsIn(cOld).join() === 'B1');
        // ---- behaviour with a fake DOM: one card at a time, Escape, outside click, keyboard, onPick
        const D = { h: {}, addEventListener(t, f) { (D.h[t] = D.h[t] || []).push(f); } }; globalThis.document = D;
        try {
            let focused = null, picks = [];
            const unesc = decode;
            const node = (extra) => Object.assign({ _in: true, focus() { focused = this; }, contains(x) { return x === this; } }, extra);
            const mark = key => node({ getAttribute: k => (k === 'data-an-k' ? key : null), closest(sel) { return sel === '[data-an-k]' ? this : null; } });
            const mount = (opts) => {
                const h = {}, pop = { hidden: true, innerHTML: '', className: 'c4an-pop', style: {} };
                pop.querySelector = function (sel) {
                    if (sel !== '.c4an-pk') return null;
                    const r = /data-an-pick="([a-z]+)" data-an-id="([^"]*)"/.exec(this.innerHTML);
                    return r ? node({ getAttribute: k => (k === 'data-an-pick' ? r[1] : k === 'data-an-id' ? unesc(r[2]) : null), closest(s) { return s === '[data-an-pick]' ? this : null; } }) : null;
                };
                const el = { _in: true, addEventListener(t, f) { (h[t] = h[t] || []).push(f); }, querySelector(sel) { return sel === '.c4an-pop' ? pop : null; }, contains(x) { return !!x && x._in === true; }, pop, fire(t, ev) { (h[t] || []).forEach(f => f(ev)); } };
                A.render(el, m, Object.assign({ width: 900 }, opts));
                return el;
            };
            const clickPick = (el) => { const b = el.pop.querySelector('.c4an-pk'); el.fire('click', { target: b }); return b; };
            const key9 = 'f7';
            let el1 = mount({ onPick: p => picks.push(p) });
            ok('cards: closed after a draw', el1.pop.hidden === true && el1.pop.innerHTML === '');
            const mk1 = mark('f7');
            el1.fire('mouseover', { target: mk1 });
            ok('hover opens the card with the fleet detail', el1.pop.hidden === false && unesc(el1.pop.innerHTML).includes('<img src=x onerror=1>'));
            el1.fire('mouseout', { target: mk1, relatedTarget: null });
            ok('mouse leaving an unpinned card closes it', el1.pop.hidden === true);
            el1.fire('focusin', { target: mk1 });
            ok('keyboard focus opens the card', el1.pop.hidden === false);
            el1.fire('keydown', { target: mk1, key: 'Enter', preventDefault() {} });
            ok('Enter on the focused dot pins the card and moves focus to its first button (owner or fleet)', el1.pop.className.includes('c4an-pop-pin') && focused && focused.getAttribute('data-an-pick') === 'fleet');
            el1.fire('mouseout', { target: mk1, relatedTarget: null });
            ok('a pinned card stays when the pointer leaves', el1.pop.hidden === false);
            D.h.keydown.forEach(f => f({ key: 'Escape', stopPropagation() {} }));
            ok('Escape closes the card and gives focus back to the dot', el1.pop.hidden === true && focused === mk1);
            el1.fire('click', { target: mk1 });
            ok('a click pins the card', el1.pop.hidden === false && el1.pop.className.includes('c4an-pop-pin'));
            el1.fire('click', { target: mk1 });
            ok('a second click on the same dot closes it', el1.pop.hidden === true);
            el1.fire('click', { target: mk1 });
            D.h.click.forEach(f => f({ target: { _in: false, closest: () => null } }));
            ok('a click outside the mount closes the card', el1.pop.hidden === true);
            el1.fire('click', { target: mk1 });
            el1.fire('click', { target: node({ closest: () => null }) });
            ok('a click inside the mount but off the card and the dots closes it', el1.pop.hidden === true);
            // one at a time, across two mounts
            const el2 = mount({});
            el1.fire('click', { target: mark('f7') });
            el2.fire('click', { target: mark('f1') });
            ok('pinned card of dot 1 shows Tip A', unesc(el2.pop.innerHTML).includes('Tip A'));
            ok('only one card is open at a time (opening it in a second mount closes the first)', el1.pop.hidden === true && el2.pop.hidden === false);
            el2.fire('click', { target: mark('f2') });
            ok('pinning another dot replaces the card (still one)', el2.pop.hidden === false && unesc(el2.pop.innerHTML).includes('Tip B'));
            D.h.keydown.forEach(f => f({ key: 'Escape', stopPropagation() {} }));
            // picks
            picks.length = 0;
            el1.fire('click', { target: mark('f7') });
            el1.fire('click', { target: el1.pop.querySelector('.c4an-pk') });
            ok('onPick gets the fleet id the dot stands for ({kind fleet, id F8}) and the card closes', picks.length === 1 && picks[0].kind === 'fleet' && picks[0].id === 'F8' && el1.pop.hidden === true, JSON.stringify(picks));
            const ownerBtn = (el, key) => { el.fire('click', { target: mark(key) }); const re = /data-an-pick="owner" data-an-id="([^"]*)"/.exec(el.pop.innerHTML); return re ? node({ getAttribute: k => (k === 'data-an-pick' ? 'owner' : k === 'data-an-id' ? unesc(re[1]) : null), closest(s) { return s === '[data-an-pick]' ? this : null; } }) : null; };
            picks.length = 0; const ob = ownerBtn(el1, 'f2'); el1.fire('click', { target: ob });
            ok('onPick gets the owner id of the dot ({kind owner, id o2}), not the fleet id', ob && picks.length === 1 && picks[0].kind === 'owner' && picks[0].id === 'o2', JSON.stringify(picks));
            const el3 = mount({}); picks.length = 0;
            el3.fire('click', { target: mark('f1') });
            ok('without onPick the card has no buttons and nothing is called', !/data-an-pick/.test(el3.pop.innerHTML) && picks.length === 0);
            // a stake row card picks a stake
            const sRow = R.rows.findIndex(r => r.kind === 'tier' && r.tier === 2); picks.length = 0;
            el1.fire('click', { target: mark('r' + sRow) });
            el1.fire('click', { target: el1.pop.querySelector('.c4an-pk') });
            ok('onPick from a stake row gives {kind stake, id S5} (the highest of tier 2)', picks.length === 1 && picks[0].kind === 'stake' && picks[0].id === 'S5', JSON.stringify(picks));
            // a redraw closes the card
            el1.fire('click', { target: mark('f1') }); A.render(el1, m, { width: 900 });
            el1.fire('mouseover', { target: mark('f2') });
            ok('a redraw leaves no card pinned (the next hover is a preview, and the redrawn markup holds a closed card host)', !el1.pop.className.includes('c4an-pop-pin') && el1.innerHTML.includes('<div class="c4an-pop" role="dialog" aria-label="Details" hidden></div>'));
        } finally { delete globalThis.document; A.close(); }
    });
    safe('source hygiene', () => {
        ok('plain script: no import/export/require', !/^\s*(import|export)\s/m.test(SRC) && !/\brequire\(/.test(SRC));
        ok('use strict', /'use strict'/.test(SRC));
        ok('no Date.now / fetch / document in the module', !/Date\.now|\bfetch\(|\bdocument\./.test(SRC.replace(/\/\*[\s\S]*?\*\//, '')));
    });
    return res;
}

// ---------------------------------------------------------------- mutants
const MUTANTS = [
    ["ships: mixed fleets counted under their largest model","comp.length === 1 ? comp[0].name : null","comp.length > 0 ? comp[0].name : null"],
    ["ships: yield per fleet instead of per ship","median(l.map(function (r) { return r.yps; })), n: l.length","median(l.map(function (r) { return r.ups; })), n: l.length"],
    ["ships: mixed fleets drawn as a row","else R.mixed++; });","else { (byModel['Mixed'] = byModel['Mixed'] || []).push(r); R.mixed++; } });"],
    ["card: composition not sorted by count","return out.sort(function (a, b) { return b.n - a.n || (a.name","return out.sort(function (a, b) { return 0 || (a.name"],
    ["stakes: a crafted output counted","minedOut(s).forEach(function (o) { t += o.ps; });\n            if (!(t > 0)) return;\n            R.stakesCounted++;","arr(s.out).forEach(function (o) { t += o.ps; });\n            if (!(t > 0)) return;\n            R.stakesCounted++;"],
    ["stakes: median replaced by the mean","v: median(l.map(function (e) { return e.v; })), n: l.length, list: l, ext: [] };","v: sumArr(l.map(function (e) { return e.v; })) / l.length, n: l.length, list: l, ext: [] };"],
    ["stakes: 3 and more extractors merged into one row","var key = e.ext;","var key = Math.min(e.ext, 3);"],
    ["stakes: extractor rows not in count order","sort(function (a, b) { return a - b; }).forEach(function (n) {","sort(function (a, b) { return b - a; }).forEach(function (n) {"],
    ["buildings card: shows six, not five","MINES_MAX = 6, BLD_MAX = 5;","MINES_MAX = 6, BLD_MAX = 6;"],
    ["buildings card: fewest first","var byCount = function (a, b) { return b.v - a.v ||","var byCount = function (a, b) { return a.v - b.v ||"],
    ["buildings card: the button opens the owner, not the stake","return '<li>' + pickBtn(o, 'stake', e.id, who)","return '<li>' + pickBtn(o, 'owner', e.o, who)"],
    ["buildings card: owner name unescaped in the where text","<span class=\"c4an-cdw\">' + E(where) + '</span> <span class=\"c4an-cdv\">x ' + fnum(e.v)","<span class=\"c4an-cdw\">' + where + '</span> <span class=\"c4an-cdv\">x ' + fnum(e.v)"],
    ["buildings chart: bars are not clickable","if (r.k) b += '<rect class=\"an-hit\"","if (false) b += '<rect class=\"an-hit\""],
    ["buildings card: a stake's kinds counted once per building line","bump(kq, str(b.k) || 'unknown', q);","bump(kq, str(b.k) || 'unknown', 1);"],
    ["rows: sorted ascending","items.sort(function (a, b) { return b.v - a.v ||","items.sort(function (a, b) { return a.v - b.v ||"],
    ["card: Escape does not close","closePop(true); if (typeof ev.stopPropagation","if (typeof ev.stopPropagation"],
    ["card: a second card opens beside the first","if (openEl && openEl !== el) closePop(false);",""],
    ["card: owner name unescaped (no pick button)","if (!o.canPick || !id) return o.esc(text);","if (!o.canPick || !id) return String(text);"],
    ["card: owner name unescaped (pick button)","'\">' + o.esc(text) + '</button>'","'\">' + text + '</button>'"],
    ["card: onPick gets the wrong id","cb({ kind: kind, id: id })","cb({ kind: kind, id: kind })"],
    ["card: outside click does not close","if (typeof openEl.contains === 'function' && openEl.contains(t)) return;","return;"],
    ["card: a second click does not close","st.opener === mark) { closePop(false); return; }","st.opener === mark) { return; }"],
    ["card: Enter does nothing","(ev.key !== 'Enter' && ev.key !== ' ')","(ev.key !== 'Enter' && ev.key !== ' ') || true"],
    ["card: dots not focusable"," tabindex=\"0\" role=\"button\" aria-label=\"' + ctx.esc(p.tip)"," role=\"button\" aria-label=\"' + ctx.esc(p.tip)"],
    ["card: model name keeps its Default Config suffix","Default Config$/, '')","Default Config$Q/, '')"],
    ["card: pick buttons drawn without onPick","if (!o.canPick || !id) return o.esc(text);","if (!id) return o.esc(text);"],
    ["card: hover does not open","if (mk && !pinnedOn(el)) showPop(el, mk, false); });\n            el.addEventListener('mouseout'","if (false) showPop(el, mk, false); });\n            el.addEventListener('mouseout'"],
    ['quartile index off by one', 'var p = (sorted.length - 1) * q,', 'var p = sorted.length * q,'],
    ['q3 uses 0.7', 'q3: quantile(s, 0.75)', 'q3: quantile(s, 0.7)'],
    ['yield not divided by ships', 'yps: m.ups / f.ships,', 'yps: m.ups,'],
    ['ships 0 guard removed', '|| !fin(f.ships) || !(f.ships > 0)) return;', ') return;'],
    ['crew 0 guard removed', 'ypc: crew > 0 ? m.ups / crew : null', 'ypc: m.ups / crew'],
    ['esc leaves < raw', ".replace(/</g, '&lt;')", ''],
    ['esc leaves quote raw', ".replace(/\"/g, '&quot;')", ''],
    ['council mining level uses wrong slice', 'lvl: median(lv),', 'lvl: median(lv.slice(1)),'],
    ['power net sign flipped', 'net: pw.gen - pw.use', 'net: pw.use - pw.gen'],
    ['fuel burn not per hour', 'burn += u.ps * HOUR', 'burn += u.ps'],
    ['fuel bucket edge 6 h made inclusive', 'h === 0 ? 0 : h < 6 ? 1', 'h === 0 ? 0 : h <= 6 ? 1'],
    ['fuel bucket edge 24 h made inclusive', 'h < 6 ? 1 : h < 24 ? 2', 'h < 6 ? 1 : h <= 24 ? 2'],
    ['fuel bucket edge 72 h made inclusive', 'h < 24 ? 2 : h < 72 ? 3', 'h < 24 ? 2 : h <= 72 ? 3'],
    ['fuel with no burn counted as empty', 'if (!(burn > 0)) fuelB[5]++;', 'if (!(burn > 0)) fuelB[0]++;'],
    ['zero fuel not empty', 'h === 0 ? 0 : h < 6', 'h < 6'],
    ['gross caption back', 'the production rate the chain stores for each stake, top', 'gross (consumption not subtracted), top'],
    ['stake production not per hour', 'bump(prod, o.r, o.ps * HOUR)', 'bump(prod, o.r, o.ps)'],
    ['storage total 0 not guarded', 'if (cap.total > 0) fills.push(cap.used / cap.total);', 'fills.push(cap.used / cap.total);'],
    ['per-crew guard removed (stakes)', 'perCrew: sc > 0 ? su / sc : null', 'perCrew: su / sc'],
    ['style attribute added to svg', "'<svg class=\"c4an-svg\"", "'<svg style=\"x:1\" class=\"c4an-svg\""],
    ['section id dropped', "'<section class=\"c4an-sec\" id=\"c4an-' + id + '\">", "'<section class=\"c4an-sec\" data-id=\"' + id + '\">"],
    ['owner mix: both = either', 'if (hasShips[p] && hasStakes[p]) mix.both++;', 'if (hasShips[p] || hasStakes[p]) mix.both++;'],
    ['planet type join dropped', "(bodyList && subOf[s.body]) || 'unknown'", "'unknown'"],
    ['fresh-read note lost', "var FRESH = 'needs a fresh read';", "var FRESH = 'later';"],
    ['like with like: stakes count every output', 'mined[o.r] === 1 || (otherOut[o.r] = 1, false)', 'true'],
    ['like with like: crew uses every stake output', 't = 0; minedOut(s).forEach', 't = 0; arr(s.out).forEach'],
    ['like with like: faction share uses every stake output', 'minedOut(s).forEach(function (o) { fa[f].stakes', 'arr(s.out).forEach(function (o) { fa[f].stakes'],
    ['like with like: caption silent about what is left out', "' left out.' : '.');", "'.' : '.');"],
    ['proto: resource map is a plain object', 'var res = dict();', 'var res = {};'],
    ['proto: size map is a plain object', 'var sizes = dict();', 'var sizes = {};'],
    ['proto: kinds map is a plain object', 'kinds = dict(), prod', 'kinds = {}, prod'],
    ['proto: production map is a plain object', 'prod = dict(), perOwner', 'prod = {}, perOwner'],
    ['proto: compare ships map is a plain object', 'var ships = dict(), st = dict();', 'var ships = {}, st = {};'],
    ['proto: planet type map is a plain object', 'var type = dict(), tier', 'var type = {}, tier'],
    ['building quantity ignored (q = 1)', 'var q = fin(b.q) && b.q > 0 ? Math.floor(b.q) : 0;', 'var q = 1;'],
    ['building quantity not floored', 'var q = fin(b.q) && b.q > 0 ? Math.floor(b.q) : 0;', 'var q = fin(b.q) && b.q > 0 ? b.q : 0;'],
    ['building q 0 counts as 1 again', 'if (!(q > 0)) return;', 'if (!(q > 0)) q = 1;'],
    ['stake faction ignores its owner', 'var f = fac(ownerFac[s.o]);', "var f = 'unaligned';"],
    ['wide breakpoint broken', 'var wide = width >= 640,', 'var wide = false,'],
    ['duplicate resource ships counted twice', 'if (!seen[o.r]) { seen[o.r] = 1;', 'if (true) { seen[o.r] = 1;'],
    ['old-data buildings ignore b', '} else if (fin(s.b) && s.b >= 0) cnt = s.b;', '}'],
    ['stakes by tier unsorted numerically', 'if (numeric) return Number(a.k) - Number(b.k);', 'if (numeric) return a.k < b.k ? 1 : -1;'],
    ['rank grouping drops unranked check', 'if (!fin(o.rank)) { unranked++; return; }', 'if (!fin(o.rank)) { unranked++; }'],
    ['chart without caption', "'<p class=\"c4an-cap\">' + cap + '</p></div>'", "'</div>'"],
    ["pct: share over the wrong total (bar list)","r.v / pt * 100","r.v / (pt + 1) * 100"],
    ["pct: pair bars share over the wrong total","r.a / (r.a + r.b) * 100 : 0) : r.a","r.a / r.b * 100 : 0) : r.a"],
    ["pct: caption without what 100% is","cap + ' Shown as % of ' + unit","cap + ' Shown as % ' "],
    ["pct: top-N coverage sentence dropped","(top ? '; the '","(false ? '; the '"],
    ["pct: zero total not guarded","if (!(total > 0)) return chart(","if (false) return chart("],
    ["pct: per-card click leaks to every card","if (SHARE_CARDS.indexOf(id) < 0) return; modes[id] = m; }","if (SHARE_CARDS.indexOf(id) < 0) return; setMode(m); }"],
    ["pct: listener attached on every render","if (!el._c4anBound && typeof el.addEventListener","if (typeof el.addEventListener"],
    ["pct: All charts skips the first card","SHARE_CARDS.forEach(function (id) { modes[id] = m; });","SHARE_CARDS.slice(1).forEach(function (id) { modes[id] = m; });"],
    ["pct: mode forgotten on render","function isPct(id) { return modes[id] === 'pct'; }","function isPct(id) { return false; }"],
    ["pct: decimal rule dropped (always whole)","(p < 10 ? (Math.round(p * 10) / 10).toFixed(1) : String(Math.round(p)))","String(Math.round(p))"],
    ["pct: top-N share taken of the rows shown","T.prod, fnum(T.prod)","s.prod.slice(0, 10).reduce(function (t, e) { return t + e.uph; }, 0), fnum(T.prod)"],
    ['script tag in output', "return '<div class=\"c4an-chart\">'", "return '<script></script><div class=\"c4an-chart\">'"]
];

let pass = 0, fail = 0;
console.log('[1] real module');
const base = suite(REAL, false);
pass += base.pass; fail += base.fail;
console.log('  ' + base.pass + ' passed, ' + base.fail + ' failed');
console.log('[2] mutants: each must make the suite fail');
for (const [name, from, to] of MUTANTS) {
    if (!SRC.includes(from)) { console.log('  FAIL mutant target missing: ' + name); fail++; continue; }
    if (SRC.split(from).length !== 2) console.log('  note: target occurs more than once (all replaced): ' + name);
    let r;
    try { r = suite(load(SRC.split(from).join(to)), true); } catch (e) { r = { fail: 1, names: ['load threw ' + e.message] }; }
    if (r.fail > 0) { pass++; console.log('  caught  ' + name + '  (' + r.fail + ' checks failed, first: ' + r.names[0] + ')'); }
    else { fail++; console.log('  FAIL mutant NOT caught: ' + name); }
}
console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
