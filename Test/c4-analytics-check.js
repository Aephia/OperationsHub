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
        ok(tag + '@' + w + ': seven section headings (governance added)', heads === 7);
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
    safe('economy', () => {
        // fixture written out by hand; the expected figures below are per-second sums typed from it, times 86,400
        const P2 = 'P2aaaaaaaaaaaaaaaaZZZZ';
        const mf = (a, o, ups, out, st) => ({ a, n: a, o, fa: 'mud', npc: 0, s: { kind: st || 'mining' }, ships: 1, crew: 1, flagSize: 'small', mine: { ups, out } });
        const L = {
            owners: [{ p: 'P1', name: '<i>Ann', fa: 'mud' }, { p: P2, fa: 'oni' }, { p: 'P3', name: 'Cy', fa: 'ustur' }],
            fleets: [
                mf('F1', 'P1', 3, [{ r: 'Iron', ups: 2 }, { r: 'Copper', ups: 1 }]), mf('F2', P2, 4, [{ r: 'Iron', ups: 4 }]),
                mf('F3', 'P3', 9, [{ r: 'Iron', ups: 9 }], 'idle'), mf('F4', 'P3', 0, [{ r: 'Iron', ups: 0 }]),
                mf('G1', 'Q1', 0.1, [{ r: 'Tin', ups: 0.1 }]), mf('G2', 'Q2', 0.2, [{ r: 'Tin', ups: 0.2 }]),
                mf('G3', 'Q3', 0.3, [{ r: 'Tin', ups: 0.3 }]), mf('G4', 'Q4', 0.4, [{ r: 'Tin', ups: 0.4 }])],
            stakes: [
                { a: 'S1', o: 'P1', out: [{ r: 'Iron', ps: 0.5 }, { r: 'Fuel', ps: 0.25 }], use: [{ r: 'Fuel', ps: 0.1 }], rent: { bal: 10 } }, { a: 'S2', o: 'P4', out: [{ r: 'Copper Ore', ps: 1 }], use: [{ r: 'Iron', ps: 1 }, { r: 'Fuel', ps: 0.05 }, { r: 'Gel', ps: 0.01 }], rent: { bal: 2.5 } },
                { a: 'S3', o: P2, out: [{ r: 'Iron', ps: 0 }], use: [{ r: 'Iron', ps: 0 }] }, { a: 'S4', o: 'P3', rent: { bal: 'x' } }],
            systems: [{ lvl: 0, f: 'unaligned' }, { lvl: 1, f: 'mud' }, { lvl: 1, f: 'mud' }, { lvl: 1, f: 'oni' }, { lvl: 2, f: 'ustur' }, { lvl: 'x', f: 'mud' }, { lvl: 1.5, f: 'mud' }, { lvl: 3, f: 'weird' }]
        };
        const D = 86400, e = A.build(L, null).economy;
        ok('economy: resources in order of units per day', JSON.stringify(e.res.map(r => r.r)) === JSON.stringify(['Iron', 'Copper', 'Copper Ore', 'Tin', 'Fuel']), JSON.stringify(e.res.map(r => r.r)));
        ok('economy: Iron is 6 a second from ships and 0.5 from stakes', near(e.res[0].ships, 6 * D) && near(e.res[0].stakes, 0.5 * D) && near(e.res[0].day, 6.5 * D));
        ok('economy: a stake-only output (Fuel) is counted', near(e.res[4].stakes, 0.25 * D) && e.res[4].ships === 0);
        ok('economy: totals', near(e.day, 9.75 * D) && near(e.shipsDay, 8 * D) && near(e.stakesDay, 1.75 * D), [e.day, e.shipsDay, e.stakesDay].join());
        ok('economy: 6 mining fleets (idle and zero-yield ones left out), 2 stakes with output', e.fleets === 6 && e.stakesOut === 2, e.fleets + '/' + e.stakesOut);
        ok('economy: 7 producers, largest first', e.producers === 7 && JSON.stringify(e.head.map(p => p.o)) === JSON.stringify([P2, 'P1', 'P4', 'Q4', 'Q3']), JSON.stringify(e.head.map(p => p.o)));
        ok('economy: a player with ships and a stake is one producer with both added', near(e.head[1].day, 3.75 * D));
        ok('economy: median and average producer', near(e.median, 0.4 * D) && near(e.mean, 9.75 / 7 * D), e.median + ' ' + e.mean);
        ok('economy: the five largest and the rest', near(e.headDay, 9.45 * D) && near(e.restDay, 0.3 * D) && near(e.namedDay, 9.75 * D), e.headDay + ' ' + e.restDay);
        ok('economy: starbase levels', JSON.stringify(e.levels.map(l => [l.lvl, l.n])) === JSON.stringify([[0, 1], [1, 3], [2, 1], [3, 1]]) && e.systems === 6 && e.systemsRead === 8, JSON.stringify(e.levels));
        ok('economy: levels split by faction, an unknown faction counts as unaligned', e.levels[1].by.mud === 2 && e.levels[1].by.oni === 1 && e.levels[2].by.ustur === 1 && e.levels[3].by.unaligned === 1);
        ok('sinks: what stakes consume, largest first, each beside its own emission', JSON.stringify(e.sinks.map(x => x.r)) === JSON.stringify(['Iron', 'Fuel', 'Gel']) && near(e.sinks[0].day, D) && near(e.sinks[0].emit, 6.5 * D) && near(e.sinks[1].day, 0.15 * D) && near(e.sinks[1].emit, 0.25 * D) && e.sinks[2].emit === 0, JSON.stringify(e.sinks));
        ok('sinks: total, stakes consuming and rent balances', near(e.sinkDay, 1.16 * D) && e.stakesUse === 2 && near(e.rentBal, 12.5) && e.rentN === 2 && e.stakesRead === 4, [e.sinkDay, e.stakesUse, e.rentBal, e.rentN].join());
        const el = { innerHTML: '', addEventListener() {} }; A.render(el, A.build(L, null), { width: 900 });
        const h = el.innerHTML, sec = h.slice(h.indexOf('id="c4an-economy"'));
        ok('economy: section drawn with the 30-day figure', h.includes('id="c4an-economy"') && sec.includes('25,272,000 over 30 days'), '');
        ok('economy: an owner name is escaped, an unnamed owner shows a short address', !sec.includes('<i>Ann') && sec.includes('&lt;i&gt;Ann') && sec.includes('P2aa...ZZZZ'));
        ok('economy: the five largest make 97% of it', sec.includes('make 97%'), '');
        ok('sinks: drawn with the share of emission, and the unseen sinks are listed', sec.includes('(15% of emission)') && sec.includes('(60% of emission)') && sec.includes('(not emitted)') && sec.includes('Starbase upgrade contributions.') && sec.includes('Warp lane tolls.'), '');
        const e0 = A.build({}, null).economy, el0 = { innerHTML: '', addEventListener() {} }; A.render(el0, A.build({}, null), { width: 400 });
        ok('economy: an empty read says so', e0.day === 0 && e0.producers === 0 && el0.innerHTML.includes('Nothing is being produced') && el0.innerHTML.includes('No system reports a starbase level'));
        if (realData) {
            const r = A.build(realData.L, realData.B).economy, k = realData.L.kpis;
            if (k && isNum(k.galaxyUps)) ok('economy (real data): ship emission equals the collector\'s own galaxy total', Math.abs(r.shipsDay - k.galaxyUps * D) <= 1e-6 * r.shipsDay + 1, r.shipsDay + ' vs ' + k.galaxyUps * D);
            ok('economy (real data): every system with a level is counted once', r.levels.reduce((t, l) => t + l.n, 0) === r.systems && r.systems <= r.systemsRead);
        }
    });
    safe('layout', () => {
        [[1000, 'c4an-wide', null], [1500, 'c4an-x3', 'c4an-x4'], [2000, 'c4an-x4', 'c4an-x5'], [3000, 'c4an-x5', null]].forEach(([w, has, not]) => {
            const e = { innerHTML: '', className: '', addEventListener() {} }; A.render(e, A.build({}, null), { width: w });
            ok('layout: at ' + w + ' px the class is ' + has + (not ? ', not ' + not : ''), e.className.includes(has) && (!not || !e.className.includes(not)), e.className);
        });
    });
    safe('crafting', () => {
        // jobs per recipe typed by hand: Fuel 10 jobs of 3 Hydrogen; Mix 4 jobs of 2 Hydrogen + 1 Ore (Hydrogen listed twice
        // in Dup to prove a recipe's jobs are counted once per ingredient); a zero-use and two malformed rows to drop
        const DOC = { v: 1, generatedAt: 1795000000, read: 50, used: 4, jobs: 17, recipes: [
            { n: 'Fuel', u: 10, i: [['Hydrogen', 3]], o: [['Fuel', 1]] },
            { n: 'Mix <b>', u: 4, i: [['Hydrogen', 2], ['Ore', 1]], o: [['Mix', 1]] },
            { n: 'Dup', u: 3, i: [['Hydrogen', 1], ['Hydrogen', 1], ['bad'], ['Neg', -1]], o: [] },
            { n: 'Zero', u: 0, i: [['Ore', 9]], o: [] }, { n: '', u: 5, i: [], o: [] }, { n: 'NoCount', i: [], o: [] }] };
        const c = A.build({}, null, DOC).crafting;
        ok('crafting: 3 recipes used, 17 jobs, most jobs first', c.state === 'ok' && c.used === 3 && c.jobs === 17 && JSON.stringify(c.recipes.map(r => [r.n, r.u])) === JSON.stringify([['Fuel', 10], ['Mix <b>', 4], ['Dup', 3]]), JSON.stringify(c.recipes && c.recipes.map(r => [r.n, r.u])));
        const hy = c.byIng.find(x => x.r === 'Hydrogen'), ore = c.byIng.find(x => x.r === 'Ore');
        ok('crafting: Hydrogen is in 17 jobs across 3 recipes (a recipe listing it twice counts its jobs once)', hy && hy.jobs === 17 && hy.recipes === 3, JSON.stringify(hy));
        ok('crafting: the floor is jobs x quantity over every line (10x3 + 4x2 + 3x1 + 3x1 = 44)', hy && hy.floor === 44, hy && String(hy.floor));
        ok('crafting: Ore is in 4 jobs (the unused recipe adds nothing); malformed ingredient rows are dropped', ore && ore.jobs === 4 && ore.floor === 4 && c.ingN === 2, JSON.stringify(c.byIng));
        const el = { innerHTML: '', addEventListener() {} }; A.render(el, A.build({}, null, DOC), { width: 900 });
        const h = el.innerHTML, sec = h.slice(h.indexOf('id="c4an-crafting"'));
        ok('crafting: the section says jobs are runs, not units', sec.length > 100 && sec.includes('this counts runs, not units'));
        ok('crafting: shares of all jobs (Fuel 59%, Dup 18%) and the read time', sec.includes('>10 59%<') && sec.includes('>3 18%<') && sec.includes('Read 2026-11-18 11:06 UTC'), sec.replace(/<[^>]+>/g, ' ').slice(0, 300));
        ok('crafting: a recipe name is escaped', sec.includes('Mix &lt;b&gt;') && !sec.includes('Mix <b>'));
        ok('crafting: the amount consumed is offered only as a floor in the hover text', sec.includes('at least 44 consumed if every job made one unit') && sec.includes('the amount consumed is not known'));
        ok('crafting: no NaN / undefined / Infinity', !/NaN|undefined|Infinity/.test(sec));
        const st = d => { const e = { innerHTML: '', addEventListener() {} }; A.render(e, A.build({}, null, d), { width: 400 }); return [A.build({}, null, d).crafting.state, e.innerHTML]; };
        const [s1, h1] = st({ pending: true }), [s2, h2] = st({ failed: true }), [s3, h3] = st(undefined), [s4, h4] = st({ recipes: 'x' }), [s5, h5] = st({ recipes: [], read: 9 });
        ok('crafting: pending, failed and never-read each say so', s1 === 'pending' && h1.includes('Reading the recipe counters') && s2 === 'failed' && h2.includes('could not be read') && s3 === 'none' && h3.includes('have not been read'));
        ok('crafting: a malformed answer counts as failed; an empty one says no job is on record', s4 === 'failed' && s5 === 'ok' && h5.includes('No recipe has a crafting job on record (9 recipes read)'));
        ok('crafting: the model keeps the document it was built from (the page swaps the section in by it)', A.build({}, null, DOC).crafting.src === DOC);
    });
    safe('heroes', () => {
        const k = A.kfmt;
        ok('headline numbers: plain below ten thousand, then K / M / B to three figures', k(9999) === '9,999' && k(12345) === '12.3K' && k(139393765) === '139M' && k(4181812951) === '4.18B' && k(1500000) === '1.50M' && k(0) === '0' && k(NaN) === '-',
            [k(9999), k(12345), k(139393765), k(4181812951), k(1500000), k(0), k(NaN)].join(' '));
        // one mining fleet making 2 a second: 172,800 a day from one producer, who is therefore 100% of it
        const L = { owners: [{ p: 'P1', name: 'Ann', fa: 'mud', rank: 3 }], fleets: [{ a: 'F1', n: 'F1', o: 'P1', fa: 'mud', npc: 0, s: { kind: 'mining' }, ships: 1, crew: 1, flagSize: 'small', mine: { ups: 2, out: [{ r: 'Iron', ups: 2 }] } }], stakes: [], systems: [] };
        const el = { innerHTML: '', addEventListener() {} }; A.render(el, A.build(L, null, { recipes: [{ n: 'Fuel', u: 25000, i: [['Hydrogen', 3]], o: [] }], read: 100000, generatedAt: 1 }), { width: 900 });
        const h = el.innerHTML, sec = id => { const a = h.indexOf('id="c4an-' + id + '"'), b = h.indexOf('<section', a + 1); return h.slice(a, b < 0 ? h.length : b); };
        const kp = id => (sec(id).match(/<dd>[^<]*<\/dd><dt>[^<]*<\/dt>/g) || []).map(x => x.replace(/<\/dd><dt>/, '|').replace(/<[^>]+>/g, ''));
        ok('every section opens with a hero that carries its own emblem class', A.sections.every(id => sec(id).includes('class="c4an-hero"') && sec(id).includes('c4an-emb emb-' + id + '"')) && (h.match(/class="c4an-hero"/g) || []).length === A.sections.length);
        ok('emission headline: 173K units a day, 1 producer, 100% from the top 1', JSON.stringify(kp('economy')) === JSON.stringify(['173K|units a day', '1|producers', '100%|from the top 1']), JSON.stringify(kp('economy')));
        ok('mining headline: 1 mining fleet, 2 units a second, 1 resource', JSON.stringify(kp('mining')) === JSON.stringify(['1|mining fleets', '2|units a second', '1|resources mined']), JSON.stringify(kp('mining')));
        ok('council headline: 1 ranked player, highest rank 3', JSON.stringify(kp('council')) === JSON.stringify(['1|ranked players', '3|highest rank']), JSON.stringify(kp('council')));
        ok('crafting headline: 25.0K jobs, 1 recipe used, 0.0% of all recipes', JSON.stringify(kp('crafting')) === JSON.stringify(['25.0K|crafting jobs', '1|recipes used', '0.0%|of all recipes']), JSON.stringify(kp('crafting')));
        ok('every bar of a bar list sits on a rail', (sec('economy').match(/class="an-track"/g) || []).length >= 2 && (h.match(/class="an-track"/g) || []).length > 5);
        const e0 = { innerHTML: '', addEventListener() {} }; A.render(e0, A.build({}, null), { width: 900 });
        const s0 = e0.innerHTML.slice(e0.innerHTML.indexOf('id="c4an-economy"'), e0.innerHTML.indexOf('id="c4an-crafting"'));
        ok('an empty read draws no headline numbers for emission (nothing to headline)', s0.includes('class="c4an-hero"') && !s0.includes('c4an-kpis'));
        ok('headline text is escaped and no hero uses a style attribute', !/c4an-hero[^>]*style=/.test(h) && !/NaN|undefined|Infinity/.test(h));
    });
    safe('skills', () => {
        // four ranked players and one unranked, levels typed by hand; one skill entry malformed, one player with no xp at all
        const X = (p, rank, lv) => ({ p, fa: 'mud', rank, xp: lv && Object.fromEntries(Object.entries(lv).map(([k, v]) => [k, { xp: 0, lvl: v }])) });
        const L = { owners: [X('a', 0, { pilot: 1, combat: 0, mining: 2 }), X('b', 0, { pilot: 3, combat: 4, mining: 2, crafting: 'x' }), X('c', 2, { pilot: 5, combat: 9, dataRunner: 1 }), X('d', 2, null), { p: 'e', fa: 'oni', xp: { pilot: { lvl: 50 } } }] };
        const c = A.build(L, null).council, r0 = c.ranks.find(r => r.rank === 0), r2 = c.ranks.find(r => r.rank === 2);
        ok('skills: levels per rank, sorted (rank 0 pilot 1,3; combat 0,4; rank 2 combat 9)', r0 && r2 && r0.skills.pilot.join() === '1,3' && r0.skills.combat.join() === '0,4' && r2.skills.combat.join() === '9' && r2.skills.dataRunner.join() === '1', JSON.stringify(r0 && r0.skills));
        ok('skills: a malformed level is dropped and an unranked player is not counted', r0.skills.crafting.length === 0 && c.skill.pilot.max === 5 && c.skill.pilot.n === 3);
        ok('skills: median and highest over all ranked players (pilot 1,3,5 -> 3 and 5; combat 0,4,9 -> 4 and 9)', c.skill.pilot.med === 3 && c.skill.combat.med === 4 && c.skill.combat.max === 9 && c.skill.mining.med === 2 && c.skill.building.n === 0);
        ok('skills: 3 of the 4 ranked players have skill levels', c.withSkill === 3, String(c.withSkill));
        const el = { innerHTML: '', addEventListener() {} }; A.render(el, A.build(L, null), { width: 900 });
        const h = el.innerHTML, sec = h.slice(h.indexOf('id="c4an-council"'), h.indexOf('id="c4an-stakes"'));
        ok('skills: a grid for each of the six skills, and a note for the one nobody has', ['Pilot', 'Data runner', 'Mining', 'Building', 'Crafting', 'Combat'].every(n => sec.includes('<h5 class="c4an-ch">' + n + '</h5>')) && sec.includes('No player reports a building level.'));
        ok('skills: the summary names the median and the highest level (Combat 4, top 9)', sec.includes('Combat: median level 4, highest 9, 3 players') && sec.includes('>4 (top 9)<'), '');
        ok('skills: no NaN / undefined / Infinity', !/NaN|undefined|Infinity/.test(sec));
    });
    safe('fold', () => {
        const draw = () => { const e = { innerHTML: '', addEventListener() {} }; A.render(e, A.build({}, null), { width: 900 }); return e.innerHTML; };
        const part = (h, id) => { const a = h.indexOf('id="c4an-' + id + '"'), b = h.indexOf('<section', a + 1); return h.slice(h.lastIndexOf('<section', a), b < 0 ? h.length : b); };
        let h = draw();
        ok('fold: every section starts open, with a chevron button that says so', A.sections.every(id => !A.isFolded(id) && part(h, id).includes('data-an-fold="' + id + '" aria-expanded="true" aria-controls="c4an-grid-' + id + '"') && !/c4an-grid" id="c4an-grid-[a-z]+" hidden/.test(part(h, id))) && h.includes('>Collapse all</button>'));
        try {
            A.setFolded(null, 'economy', true);
            h = draw();
            ok('fold: a collapsed section keeps its header and hides its charts, across a redraw', A.isFolded('economy') && part(h, 'economy').includes('class="c4an-sec c4an-fold"') && part(h, 'economy').includes('aria-expanded="false"') && part(h, 'economy').includes('id="c4an-grid-economy" hidden') && part(h, 'economy').includes('class="c4an-hero"'));
            ok('fold: the other sections stay open', A.sections.filter(id => id !== 'economy').every(id => !part(h, id).includes('c4an-fold"') && part(h, id).includes('aria-expanded="true"')));
            A.sections.forEach(id => A.setFolded(null, id, true));
            ok('fold: with every section collapsed the top button offers to expand all', draw().includes('aria-pressed="true">Expand all</button>'));
            A.setFolded(null, 'nonsense', true);
            ok('fold: an unknown section id is ignored', !A.isFolded('nonsense'));
        } finally { A.sections.forEach(id => A.setFolded(null, id, false)); }
        ok('fold: expanding restores the charts', !A.isFolded('economy') && !part(draw(), 'economy').includes(' hidden'));
    });
    safe('contract', () => {
        ok('version 1', A.version === '1');
        ok('sections list', JSON.stringify(A.sections) === JSON.stringify(['mining', 'council', 'governance', 'stakes', 'compare', 'economy', 'crafting']));
        ok('build is pure: same input twice gives the same model', JSON.stringify(A.build(F.L, F.B)) === JSON.stringify(A.build(F.L, F.B)));
        const before = JSON.stringify(F.L); A.build(F.L, F.B); ok('build does not mutate its input', JSON.stringify(F.L) === before);
    });
    // ---- governance section: a gov block built to the contract (36 systems 12 / 12 / 12, 3 modules, 3 voting enabled, 40,000 of 280,000,000)
    safe('governance', () => {
        const HOSTILE = 'Evil<img src=x onerror=1>', HB = 'Bill"><script>x</script>';
        const FEES = { craft: 10000, mkt: 0, local: 0, dist: 0 };
        const addr = i => 'GovSys' + String(i).padStart(2, '0') + 'x'.repeat(30);
        const mkL = (mut) => {
            const L = JSON.parse(JSON.stringify(F.L));
            L.systems = []; for (let i = 0; i < 36; i++) L.systems.push({ a: addr(i), n: i === 3 ? HOSTILE + ' Sys' : 'Sys ' + i });
            L.owners.push({ p: 'PL1', name: HOSTILE, fa: 'mud' }, { p: 'PL2', name: 'Two', fa: 'oni' });
            const systems = {};
            for (let i = 0; i < 36; i++) systems[addr(i)] = { ctl: i % 3 + 1, lvl: 2, on: 0, mod: null, fees: Object.assign({}, FEES), src: 'baseline', power: 0, nextPower: 0, want: null, voters: 0, crew: 0 };
            [0, 1, 3].forEach(i => { Object.assign(systems[addr(i)], { on: 1, src: 'generation', mod: { inst: 1, at: 1795580000, funded: [10, 5], need: [10, 5], contributors: 1 } }); });
            Object.assign(systems[addr(3)], { power: 40000, voters: 1, crew: 10, want: { craft: 10000, mkt: 0, local: 3000, dist: 10000 } });
            systems[addr(5)].mod = { inst: 0, funded: [50, 0], need: [100, 100], contributors: 2 };
            L.gov = {
                policy: { defaults: Object.assign({}, FEES), bounds: { minCraftingFeeBps: 10000, maxCraftingFeeBps: 15000, maxLocalMarketFeeBps: 300, maxTreasuryDistributionBps: 10000 } },
                module: { minTier: 2, bill: [{ id: 1007, q: 2360, n: HB }, { id: 1027, q: 1620 }] },
                systems, voters: { profiles: 280, pvpIssued: 280000000, pvpReserved: 40000, allocating: 1, top: [{ p: 'PL1', sys: addr(3), power: 40000, pending: 40000, crew: 10 }] },
                contributors: [{ p: 'PL1', sys: addr(3), lp: 29010, units: 5100, rows: 7, res: [{ id: 1007, q: 2360, n: HB }, { id: 1027, q: 2740 }, { id: 5, q: 0 }, null] }, { p: 'PL2', sys: addr(1), lp: 29010, units: 7460, rows: 7, res: [{ id: 1007, q: 7460 }] }, { p: 'FVRNa2j29ZsbHNVUkRwgE5AWWeUZgGqoNZ7P8f6mdzEB', sys: addr(0), lp: 1, units: 5100, rows: 6 }]
            };
            if (mut) mut(L.gov, L);
            return L;
        };
        const draw = L => { const e = { innerHTML: '', addEventListener() {} }; A.render(e, A.build(L, F.B), { width: 900 }); return e.innerHTML; };
        const part = (h, id) => { const a = h.indexOf('id="c4an-' + id + '"'), b = h.indexOf('<section', a + 1); return h.slice(h.lastIndexOf('<section', a), b < 0 ? h.length : b); };
        const clean = s => !/NaN|undefined|Infinity|\[object/.test(s);
        const L0 = mkL(), m0 = A.build(L0, F.B), g0 = m0.gov, h0 = part(draw(L0), 'governance');
        // exact numbers
        ok('gov: 36 systems, 3 modules installed, 3 voting enabled, 1 where votes set the fees (only one has power)', g0 && g0.n === 36 && g0.mods === 3 && g0.on === 3 && g0.votesSet === 1, JSON.stringify(g0 && [g0.n, g0.mods, g0.on, g0.votesSet]));
        ok('gov: 40,000 allocated of 280,000,000 issued', g0.voters.allocated === 40000 && g0.voters.issued === 280000000 && g0.voters.profiles === 280);
        ok('gov: per faction systems 12 / 12 / 12', g0.facs.map(f => f.fa + f.n).join() === 'mud12,oni12,ustur12', g0.facs.map(f => f.fa + f.n).join());
        ok('gov: per faction modules 2 / 1 / 0, voting enabled 2 / 1 / 0, power 40000 / 0 / 0', g0.facs.map(f => f.mods).join() === '2,1,0' && g0.facs.map(f => f.on).join() === '2,1,0' && g0.facs.map(f => f.power).join() === '40000,0,0');
        ok('gov: the four headline tiles', ['<dd>36</dd><dt>systems with governance</dt>', '<dd>3</dd><dt>modules installed</dt>', '<dd>1</dd><dt>systems where votes set the fees</dt>', '<dd>40.0K</dd><dt>voting power allocated</dt>'].every(s => h0.includes(s)));
        ok('gov: the section follows Council rank and precedes Claim stakes', (() => { const h = draw(L0); return h.indexOf('id="c4an-council"') < h.indexOf('id="c4an-governance"') && h.indexOf('id="c4an-governance"') < h.indexOf('id="c4an-stakes"'); })());
        ok('gov: output clean (no NaN, undefined, style=, script)', clean(h0) && !/ style=/.test(h0) && !/<script/i.test(h0));
        // card 2: fees. The contract fixture has one system whose voters ask for something else; that row is the only one
        ok('gov: fees card lists the one system whose voters ask for more, with the wording of the page', g0.fees.rows.length === 1 && /<tr><th scope="row"><i class="c4an-sw f-mud" title="MUD"><\/i> Evil&lt;img src=x onerror=1&gt; Sys<\/th><td>x1\.00<\/td><td>0 %<\/td><td>0 %<\/td><td>0 %<\/td><td class="c4an-l">local treasury share 30 %, paid out to voters 100 %<\/td><\/tr>/.test(h0), h0.slice(h0.indexOf('<tbody>'), h0.indexOf('<tbody>') + 400));
        ok('gov: fees card lists no other system and no "default fees" sentence while a row is shown', (h0.match(/<tr><th scope="row"><i class="c4an-sw/g) || []).length === 1 && !h0.includes('Every governed system charges the default fees'));
        const LD = mkL(g => { g.systems[addr(3)].want = null; }), hd = part(draw(LD), 'governance');
        ok('gov: default fees and nobody asking for more: the one sentence with the defaults and the allowed range', hd.includes('Every governed system charges the default fees (crafting x1.00, local market fee 0 %, local treasury share 0 %, treasury paid out to voters 0 %)') && hd.includes('Allowed range: crafting x1.00 to x1.50; local market fee up to 3 %; treasury paid out to voters up to 100 %.') && !hd.includes('<th scope="col">Crafting fee</th>'));
        const LM = mkL(g => { Object.assign(g.systems[addr(7)].fees, { craft: 15000, mkt: 120, local: 500, dist: 2000 }); g.systems[addr(7)].want = { craft: 15000, mkt: 120, local: 500, dist: 3000 }; }), mM = A.build(LM, F.B), hM = part(draw(LM), 'governance');
        ok('gov: a system whose fees differ from the defaults gets a row with the right numbers (x1.50, 1.2 %, 5 %, 20 %)', mM.gov.fees.rows.length === 2 && hM.includes('Sys 7</th><td>x1.50</td><td>1.2 %</td><td>5 %</td><td>20 %</td><td class="c4an-l">paid out to voters 30 %</td></tr>'), hM.slice(hM.indexOf('<tbody>'), hM.indexOf('<tbody>') + 700));
        const LN = mkL(g => { g.systems[addr(11)].fees.craft = 12000; g.systems[addr(9)].on = 1; }), mN = A.build(LN, F.B), hN = part(draw(LN), 'governance');
        ok('gov: fees differing from the defaults with nobody asking for more still get a row (x1.20, asks: dash)', mN.gov.fees.rows.map(r => r.name).join() === 'Evil<img src=x onerror=1> Sys,Sys 11' && hN.includes('Sys 11</th><td>x1.20</td><td>0 %</td><td>0 %</td><td>0 %</td><td class="c4an-l">-</td></tr>'), mN.gov.fees.rows.map(r => r.name).join());
        ok('gov: voting enabled (4) is not the same count as votes setting the fees (1: enabled AND power)', mN.gov.on === 4 && mN.gov.votesSet === 1 && hN.includes('<dd>1</dd><dt>systems where votes set the fees</dt>'));
        // fix round B2-B5 (2026-11-25)
        const LB2 = mkL(g => { g.systems[addr(3)].want = { craft: 10000.4, mkt: 0.2, local: 0, dist: 0 }; }), mB2 = A.build(LB2, F.B), hB2 = part(draw(LB2), 'governance');
        ok('gov B2: a weighted-mean ask that prints the same as the fees in force is no difference (no row, default sentence)', mB2.gov.fees.rows.length === 0 && hB2.includes('Every governed system charges the default fees') && !hB2.includes('<th scope="col">Crafting fee</th>'), JSON.stringify(mB2.gov.fees.rows.map(r => r.name)));
        const LB2b = mkL(g => { g.systems[addr(3)].want = { craft: 10000.4, mkt: 100.2, local: 0, dist: 0 }; }), mB2b = A.build(LB2b, F.B), hB2b = part(draw(LB2b), 'governance');
        ok('gov B2: positive control, a real ask (1 % market fee) still shows its row, and only that field', mB2b.gov.fees.rows.length === 1 && hB2b.includes('<td class="c4an-l">local market fee 1 %</td>'), hB2b.slice(hB2b.indexOf('<tbody>'), hB2b.indexOf('<tbody>') + 300));
        const LB3 = mkL(g => { g.policy.defaults = { craft: 11000, mkt: 30, local: 250, dist: 1000 }; }), mB3 = A.build(LB3, F.B), hB3 = part(draw(LB3), 'governance');
        ok('gov B3: policy.defaults 11000/30/250/1000 with every system on the constant: 0 rows, the sentence quotes the constant', mB3.gov.fees.rows.every(r => r.fdiff.length === 0) && mB3.gov.fees.rows.length === 1 && hB3.includes('crafting x1.00, market 0 %') && !hB3.includes('x1.10'), JSON.stringify(mB3.gov.fees.rows.map(r => [r.name, r.fdiff])));
        const LB3b = mkL(g => { g.policy.defaults = { craft: 11000, mkt: 30, local: 250, dist: 1000 }; g.policy.constant = { craft: 12000, mkt: 0, local: 0, dist: 0 }; }), mB3b = A.build(LB3b, F.B);
        ok('gov B3: positive control, a stated policy.constant is the reference (all 36 systems differ from x1.20)', mB3b.gov.fees.rows.length === 36, String(mB3b.gov.fees.rows.length));
        const LB4 = mkL(g => { g.systems[addr(8)].ctl = '__proto__'; g.systems[addr(9)].ctl = 'constructor'; }), mB4 = A.build(LB4, F.B), hB4 = part(draw(LB4), 'governance');
        ok('gov B4: ctl "__proto__" and "constructor" go to Unaligned (2), every system still counted (36), no junk class', mB4.gov.facs.map(f => f.fa + f.n).join() === 'mud11,oni12,ustur11,unaligned2' && mB4.gov.n === 36 && clean(hB4) && !/f-\[object|f-function/.test(hB4), mB4.gov.facs.map(f => f.fa + f.n).join());
        const LB5 = mkL(g => { g.voters.pvpReserved = 99999; }), mB5 = A.build(LB5, F.B), hB5 = part(draw(LB5), 'governance');
        ok('gov B5: allocated voting power is the sum of system power everywhere (tile, bars, sentence), not pvpReserved', mB5.gov.voters.allocated === 40000 && hB5.includes('<dd>40.0K</dd><dt>voting power allocated</dt>') && hB5.includes('40,000 of it is allocated to systems') && !/99,?999|100K|100.0K/.test(hB5) && mB5.gov.facs.reduce((t, f) => t + f.power, 0) === 40000, String(mB5.gov.voters.allocated));
        ok('gov B7: the fees table carries the fit class (cells wrap, no clipping) and the stylesheet defines it', hM.includes('<table class="c4an-tbl c4an-fit">') && fs.readFileSync(path.join(__dirname, '..', 'C4Live', 'c4-analytics.css'), 'utf8').includes('.c4an-tbl.c4an-fit td.c4an-l { min-width: 0;'));
        ok('gov: the unmutated system is not in that table', !/Sys 8<\/th>/.test(hM) && !/Sys 0<\/th>/.test(hM));
        // card 3: modules
        ok('gov: three installed modules at 100 %, a fourth at 25 % funded, contributors counted', g0.modRows.length === 4 && g0.modRows.map(r => Math.round(r.mod.pct)).join() === '100,100,100,25' && /installed 2026-11-2\d, 1 contributor</.test(h0) && h0.includes('being built, 2 contributors<') && h0.includes('(Ustur): 25% funded') && /<li><i class="c4an-sw f-ustur"><\/i>Ustur<\/li>/.test(h0) && h0.includes('>25%<'), JSON.stringify(g0.modRows.map(r => [r.name, r.mod])) + ' ' + (h0.match(/installed[^<]*|being built[^<]*/g) || []).join('|'));
        ok('gov: the bill (name x quantity) and the minimum tier', h0.includes('<li><b>resource 1027</b> x 1,620</li>') && h0.includes('Needs a starbase of at least tier 2.'));
        ok('gov: contributors by player name else short address, units only (the loyalty-point reading is not confirmed from the kit)', /<th scope="row">Two<\/th><td class="c4an-l">[^<]+<\/td><td class="c4an-l">resource 1007 7,460<\/td><td>7,460<\/td>/.test(h0) && h0.includes('FVRN...dzEB') && !/loyalty/i.test(h0) && g0.contrib[0].units === 7460 && g0.contrib.every(c => !('lp' in c)), JSON.stringify([/<th scope="row">Two<\/th>/.test(h0), h0.includes('FVRN...dzEB'), /loyalty/i.test(h0), g0.contrib[0]]));
        ok('gov: who put what where: each row lists its resources with units, in the order given, zero and junk rows skipped', h0.includes('<td class="c4an-l">Bill&quot;&gt;&lt;script&gt;x&lt;/script&gt; 2,360, resource 1027 2,740</td><td>5,100</td>') && g0.contrib.find(c => c.units === 5100 && c.res.length).res.length === 2, JSON.stringify(g0.contrib.map(c => c.res)));
        ok('gov: a row from a copy without the split shows a dash and the caption says to refresh', /FVRN\.\.\.dzEB<\/th><td class="c4an-l">[^<]+<\/td><td class="c4an-l">-<\/td><td>5,100<\/td>/.test(h0) && h0.includes('refresh to read it'));
        ok('gov: with the split on every row the caption has no refresh hint', !part(draw(mkL(g => { g.contributors.splice(2); })), 'governance').includes('refresh to read it'));
        // card 4: voting power
        ok('gov: one allocation is one table row: player, system, voting power, crew', h0.includes('280 players hold 280,000,000 voting power in total. 40,000 of it is allocated to systems (under 0.1%).') && /Who committed voting power where<\/h5>.*<tr><th scope="row">[^<]+<\/th><td class="c4an-l">Evil&lt;img src=x onerror=1&gt; Sys<\/td><td>40,000<\/td><td>10<\/td><\/tr><\/tbody>/s.test(h0) && h0.includes('1 allocation, most voting power first'), (h0.match(/Who committed.*?<\/table>/s) || [''])[0].slice(0, 400));
        const L2 = mkL(g => { g.voters.top.unshift({ p: 'PL2', sys: addr(1), power: 1000, pending: 0, crew: 2 }); }), h2 = part(draw(L2), 'governance');
        ok('gov: two allocations are two rows, most voting power first', (() => { const t = (h2.match(/Who committed voting power where.*?<\/table>/s) || [''])[0], r = [...t.matchAll(/<td>([\d,]+)<\/td><td>(\d+|-)<\/td><\/tr>/g)].map(x => x[1] + '/' + x[2]); return r.join() === '40,000/10,1,000/2'; })(), (h2.match(/Who committed.*?<\/table>/s) || [''])[0].slice(0, 500));
        const hV0 = part(draw(mkL(g => { g.voters.top = [{ p: 'PL2', sys: addr(1), power: 5, crew: 0 }, { p: 'PL1', sys: addr(3), power: 0, pending: 9, crew: 1 }]; })), 'governance');
        ok('gov: an allocation without crew shows a dash, one without voting power is not listed', /<td>5<\/td><td>-<\/td><\/tr><\/tbody>/.test(hV0) && (hV0.match(/Who committed.*?<\/table>/s)[0].match(/<tr><th scope="row">/g) || []).length === 1);
        // hostile text comes out escaped
        ok('gov: hostile player name, system name and bill name are escaped everywhere', !/<img/i.test(h0 + h2) && !/<script/i.test(h0) && h0.includes('Bill&quot;&gt;&lt;script&gt;x&lt;/script&gt;') && h0.includes('Evil&lt;img src=x onerror=1&gt;'));
        const LH = mkL(g => { g.contributors.splice(1); }), hH = part(draw(LH), 'governance');
        ok('gov: one contributor is one table row with the name escaped', /<th scope="row">Evil&lt;img src=x onerror=1&gt;<\/th>/.test(hH) && ((hH.match(/Who put what where.*?<\/table>/s) || [''])[0].match(/<th scope="row">Evil/g) || []).length === 1 && !/<img/i.test(hH));
        // absent, null, empty
        const absent = mkL(); delete absent.gov;
        const nul = mkL(); nul.gov = null;
        [['absent', absent], ['null', nul]].forEach(([n, L]) => {
            const h = part(draw(L), 'governance');
            ok('gov ' + n + ': one note and no card', h.includes('Governance has not been read in this copy of the data. Refresh to read it.') && (h.match(/<figure/g) || []).length === 1 && !h.includes('c4an-chart') && clean(h) && A.build(L, F.B).gov === null);
        });
        const cases = {
            'systems: {}': g => { g.systems = {}; },
            'voters.top: []': g => { g.voters.top = []; },
            'contributors: []': g => { g.contributors = []; },
            'zero issued': g => { g.voters.pvpIssued = 0; g.voters.pvpReserved = 0; g.voters.profiles = 0; g.voters.top = []; },
            'zero issued, something allocated': g => { g.voters.pvpIssued = 0; },
            'empty gov {}': g => { Object.keys(g).forEach(k => delete g[k]); },
            'junk values': g => { g.systems = { x: null, y: 5, z: { ctl: 'a', fees: { craft: 'q' }, mod: { funded: 'no', need: [0, 0] } } }; g.voters = { top: [null, { p: null, sys: 3, power: 'x' }], pvpIssued: 'big' }; g.contributors = [null, { units: NaN }]; g.module = { bill: [{ q: 'x' }, null] }; g.policy = { defaults: 3 }; }
        };
        Object.keys(cases).forEach(n => {
            let h = '';
            try { h = part(draw(mkL(cases[n])), 'governance'); ok('gov ' + n + ': no throw, a section', h.includes('id="c4an-governance"')); } catch (e) { ok('gov ' + n + ' (threw)', false, String(e.message)); return; }
            ok('gov ' + n + ': no NaN / undefined / Infinity in the HTML', clean(h), (/.{30}(NaN|undefined|Infinity).{30}/.exec(h) || [''])[0]);
        });
        const hz = part(draw(mkL(cases['zero issued, something allocated'])), 'governance');
        ok('gov zero issued: the share is left out, not divided', hz.includes('40,000 of it is allocated to systems.') && A.build(mkL(cases['zero issued, something allocated']), F.B).gov.voters.share === null);
        const he = part(draw(mkL(cases['systems: {}'])), 'governance');
        ok('gov systems {}: each card has its own empty state', he.includes('No system has started a governance module in this read.') && (he.match(/No system has governance in this read\./g) || []).length === 2);
        ok('gov: the model without a gov block is null and the other sections are unchanged', A.build(F.L, F.B).gov === null && JSON.stringify(A.build(L0, F.B).council) === JSON.stringify(A.build(absent, F.B).council) && JSON.stringify(A.build(L0, F.B).stakes) === JSON.stringify(A.build(absent, F.B).stakes));
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
    safe('median / daily total switch', () => {
        // totals re-derived here from the raw fixture rows, with no call into the module
        const SL = JSON.parse(JSON.stringify(F.L));
        // the one fleet with the best yield per ship is its own model (highest median, small total); every other fleet is the common model
        const mine0 = SL.fleets.filter(f => f && f.s && f.s.kind === 'mining' && f.mine && f.mine.ups > 0 && f.ships > 0);
        const best = mine0.slice().sort((a, b) => b.mine.ups / b.ships - a.mine.ups / a.ships)[0];
        SL.fleets.forEach(f => { if (f && f.s && f.s.kind === 'mining') f.types = { [(f === best ? 'Solo' : 'Common') + ' Default Config']: f.ships }; });
        // ATLAS in the hundreds of thousands (a median prints in full, a total as K / M); one more tier whose only stake has no building list
        SL.owners.forEach(o => { if (isNum(o.atlas)) o.atlas *= 1500; });
        SL.stakes.push({ a: 'sa9', o: 'C', st: 'active', tier: 2, b: 0, crew: 1, body: 'p2', sysName: 'Delta', pw: { gen: 1, use: 1 }, cap: { used: 1, total: 10 }, out: [{ r: 'Iron Ore', ps: 0.7 }], use: [] });
        const DAYS = 86400, near = (a, b) => Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a), Math.abs(b));
        const mfl = SL.fleets.filter(f => f && f.s && f.s.kind === 'mining' && f.mine && f.mine.ups > 0 && f.ships > 0);
        const bySize = {}; for (const f of mfl) bySize[f.flagSize || 'unknown'] = (bySize[f.flagSize || 'unknown'] || 0) + f.mine.ups * DAYS;
        const byRank = {}; for (const o of SL.owners) { if (!isNum(o.rank)) continue; const t = byRank[o.rank] = byRank[o.rank] || { fleets: 0, ships: 0, stakes: 0, ups: 0, atlas: 0 }; for (const k of Object.keys(t)) if (isNum(o[k])) t[k] += o[k] * (k === 'ups' ? DAYS : 1); }
        A.setStat('med');
        const m = A.build(SL, F.B);
        ok('stat: positive control, the fixture has mining fleets in more than one size and ranked players', Object.keys(bySize).length > 1 && Object.keys(byRank).length > 1, Object.keys(bySize).length + ' sizes, ' + Object.keys(byRank).length + ' ranks');
        ok('stat: daily total per flagship size = sum of fleet yield x 86,400', m.mining.bySize.length === Object.keys(bySize).length && m.mining.bySize.every(s => near(s.day, bySize[s.size])), m.mining.bySize.map(s => s.size + ':' + s.day).join());
        ok('stat: per-rank totals = the sum over the rank\'s players (mining x 86,400)', m.council.ranks.every(r => ['fleets', 'ships', 'stakes', 'ups', 'atlas'].every(k => near(r.tot[k], byRank[r.rank][k]))), JSON.stringify(m.council.ranks.map(r => r.tot)));
        const rows = m.compare.rate.rows;
        ok('stat: positive control, the rate chart has ship and tier rows', rows.some(r => r.kind === 'model') && rows.some(r => r.kind === 'tier'), rows.map(r => r.kind).join());
        ok('stat: a ship model row totals its own fleets, a tier row its own stakes', rows.every(r => near(r.day, r.list.reduce((t, e) => t + (r.kind === 'model' ? mfl.find(f => f.a === e.id).mine.ups : e.v), 0) * DAYS)), rows.map(r => r.label + ':' + r.day).join());
        ok('stat: the extractor rows of a tier add up to no more than the tier', rows.filter(r => r.kind === 'tier').every(t => t.ext.reduce((a, x) => a + x.day, 0) <= t.day * (1 + 1e-9)));
        ok('stat: positive control, a tier whose stakes have no extractor count still has a total', rows.some(r => r.kind === 'tier' && r.day > 0 && r.list.some(e => e.ext == null)), rows.filter(r => r.kind === 'tier').map(r => r.label + ':' + r.day).join());
        // ---- default draws medians, with the pair in the top bar
        const fakeEl = () => ({ handlers: [], addEventListener(t, f) { if (t === 'click') this.handlers.push(f); } });
        const press = (e, v) => { const btn = { getAttribute: k => (k === 'data-an-stat' ? v : null) }; e.handlers.forEach(h => h({ target: { closest: sel => (sel === '[data-an-stat]' ? btn : null) } })); };
        const el = fakeEl(); A.render(el, m, { width: 900 });
        const h0 = el.innerHTML, on = (h, v) => new RegExp('data-an-stat="' + v + '" aria-pressed="true"').test(h);
        ok('stat: default is median (pair in the top bar, Median pressed)', A.getStat() === 'med' && on(h0, 'med') && !on(h0, 'day') && h0.indexOf('data-an-stat') < h0.indexOf('<section'));
        // the same pair sits on the banner of each section that has a chart with a total, and nowhere else
        const pairIn = (h, id) => { const i = h.indexOf('<section class="c4an-sec" id="c4an-' + id + '"'), j = h.indexOf('<div class="c4an-grid"', i); return i < 0 ? null : [...h.slice(i, j).matchAll(/data-an-stat="(med|day)" aria-pressed="(true|false)"[^>]*data-an-at="([a-z]+)"/g)].map(x => x[1] + ':' + x[2] + ':' + x[3]).join(); };
        ok('stat: the pair is also on the Mining, Council rank and Ships against claim stakes banners, Median pressed', ['mining', 'council', 'compare'].every(id => pairIn(h0, id) === 'med:true:' + id + ',day:false:' + id), ['mining', 'council', 'compare'].map(id => pairIn(h0, id)).join(' | '));
        ok('stat: sections without a chart that has a total carry no pair', A.sections.filter(id => !['mining', 'council', 'compare'].includes(id)).every(id => pairIn(h0, id) === '') && A.sections.length === 7, A.sections.map(id => id + '=' + pairIn(h0, id)).join(' | '));
        ok('stat: the banner pair stands before the fold button, inside the banner', /<span class="c4an-hc"><span class="c4an-tg"[^>]*>(<button[^>]*data-an-at="mining">[^<]*<\/button>){2}<\/span><\/span><button type="button" class="c4an-fb" data-an-fold="mining"/.test(h0));
        ok('stat: median mode draws the median charts and no total chart', h0.includes('Median per player') && h0.includes('Units per second per ship') && !h0.includes('Total per rank') && !h0.includes('Units per day, all fleets of the size') && h0.includes('>Units per second per ship</h5>'));
        // the council chart on its own: headings and the text on every bar, against this file's own sums and medians
        const councilOf = (h, title) => { const i = h.indexOf('<h5 class="c4an-ch">' + title + '</h5>'); return i < 0 ? '' : h.slice(i, h.indexOf('</figure>', i)); };
        const h5Of = c => [...c.matchAll(/<h5 class="c4an-ch">([^<]*)<\/h5>/g)].map(x => x[1]);
        const barsOf = c => [...c.matchAll(/class="c4an-tx an-val"[^>]*>([^<]*)</g)].map(x => x[1]);
        const KEYS = ['fleets', 'ships', 'stakes', 'ups', 'atlas'], rankIds = Object.keys(byRank).map(Number).sort((a, b) => a - b);
        const nOf = r => SL.owners.filter(o => o.rank === r).length, plain = v => (Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('en-US') : String(v));
        const c0 = councilOf(h0, 'Median per player');
        const medAtlas = rankIds.map(r => plain(q7(SL.owners.filter(o => o.rank === r).map(o => o.atlas), 0.5)) + ' n=' + nOf(r));
        ok('stat: median mode prints an ATLAS median in full, not as K (' + medAtlas[0] + ')', /\d,\d{3} n=/.test(medAtlas[0]) && barsOf(c0).slice(-rankIds.length).join('|') === medAtlas.join('|'), barsOf(c0).slice(-rankIds.length).join('|') + ' vs ' + medAtlas.join('|'));
        // ---- one press: every median chart becomes its daily total
        press(el, 'day');
        const h1 = el.innerHTML;
        ok('stat: a press on Daily total redraws with it pressed', A.getStat() === 'day' && on(h1, 'day') && !on(h1, 'med'));
        ok('stat: after the press every banner pair shows Daily total pressed too', ['mining', 'council', 'compare'].every(id => pairIn(h1, id) === 'med:false:' + id + ',day:true:' + id), ['mining', 'council', 'compare'].map(id => pairIn(h1, id)).join(' | '));
        ok('stat: daily mode draws the totals in place of the medians', h1.includes('Total per rank') && h1.includes('Units per day, all fleets of the size') && h1.includes('Total units per day: ship models and claim stake tiers') && !h1.includes('Median per player') && !h1.includes('>Units per second per ship</h5>'));
        const c1 = councilOf(h1, 'Total per rank');
        ok('stat: daily council headings: only mining is per day', h5Of(c1).join('|') === 'Total per rank|Fleets|Ships|Claim stakes|Mining units per day|ATLAS held', h5Of(c1).join('|'));
        const medRank = (r, k) => q7(SL.owners.filter(o => o.rank === r).map(o => o[k]), 0.5) * (k === 'ups' ? DAYS : 1);
        const wantBars = []; KEYS.forEach(k => rankIds.forEach(r => wantBars.push(A.kfmt(byRank[r][k]) + ' med ' + A.kfmt(medRank(r, k)) + ', n=' + nOf(r))));
        ok('stat: positive control, a rank\'s median mining a day is not its median a second', medRank(rankIds[0], 'ups') === 86400 * q7(SL.owners.filter(o => o.rank === rankIds[0]).map(o => o.ups), 0.5) && medRank(rankIds[0], 'ups') > 0);
        ok('stat: positive control, a rank total differs from its median', byRank[rankIds[0]].fleets !== q7(SL.owners.filter(o => o.rank === rankIds[0]).map(o => o.fleets), 0.5));
        ok('stat: daily council bars print each rank\'s total and its median per player (mining a day)', barsOf(c1).join('|') === wantBars.join('|'), barsOf(c1).join('|') + ' vs ' + wantBars.join('|'));
        // the extractor rows stay under their own tier, fewest extractors first, after the re-order
        const rateSvg = (() => { const i = h1.indexOf('aria-label="Total units per day: ship models and claim stake tiers"'); return i < 0 ? '' : h1.slice(i, h1.indexOf('</svg>', i)); })();
        const drawn = [...rateSvg.matchAll(/data-an-k="(r\d+)"/g)].map(x => rows.find(r => r.k === x[1]));
        let cur = null, grouped = drawn.length === rows.length && drawn.every(Boolean), lastExt = -1;
        drawn.forEach(r => { if (!r) return; if (r.kind !== 'ext') { cur = r; lastExt = -1; return; } if (!cur || cur.kind !== 'tier' || cur.ext.indexOf(r) < 0 || r.ext <= lastExt) grouped = false; lastExt = r.ext; });
        const tiersDrawn = drawn.filter(r => r && r.kind === 'tier');
        ok('stat: positive control, a second tier\'s total falls between the first tier\'s extractor rows', tiersDrawn.length > 1 && tiersDrawn[0].ext.some(x => x.day > tiersDrawn[1].day) && tiersDrawn[0].ext.some(x => x.day < tiersDrawn[1].day), tiersDrawn.map(t => t.label + ':' + t.day + '[' + t.ext.map(x => x.day).join() + ']').join(' '));
        ok('stat: daily extractor rows stay under their own tier, fewest first', grouped, drawn.map(r => r && r.k + ':' + r.kind).join());
        const big = m.mining.bySize.slice().sort((a, b) => b.day - a.day)[0];
        ok('stat: the largest size total is printed on its bar (' + A.kfmt(big.day) + ')', h1.includes('>' + A.kfmt(big.day) + ' med ' + A.kfmt(q7(mfl.filter(f => (f.flagSize || 'unknown') === big.size).map(f => f.mine.ups / f.ships), 0.5) * DAYS) + ', n=' + big.n + '<'), A.kfmt(big.day));
        ok('stat: every daily caption says a day is the rate times 86,400', (h1.match(/a day is the rate in this read times 86,400 seconds, not a measured day/g) || []).length >= 3);
        ok('stat: the daily view keeps the median in the hover text', /a day in total from \d+ fleets?; median /.test(h1) && /a day in total, median /.test(h1));
        ok('stat: daily view has no NaN, Infinity, undefined, style= or <script', !/NaN|Infinity|undefined|style=|<script/.test(h1));
        const topRate = rows.slice().sort((a, b) => b.day - a.day)[0];
        const topTxt = '>' + A.kfmt(topRate.day) + ' med ' + A.kfmt(q7(topRate.list.map(e => e.v), 0.5) * DAYS) + ', n=' + topRate.n + '<';
        ok('stat: the rate chart prints each row\'s daily total (' + A.kfmt(topRate.day) + ')', h1.includes(topTxt) && !h0.includes(topTxt) && rows.every(r => h1.includes('>' + A.kfmt(r.day) + ' med ' + A.kfmt(q7(r.list.map(e => e.v), 0.5) * DAYS) + ', n=' + r.n + '<')), topTxt);
        const medOrder = rows.filter(r => r.kind !== 'ext').map(r => (r.kind === 'model' ? r.model : r.label));
        const order = [...h1.matchAll(/aria-label="([^"]*?): [\d,.]+ a day in total, median/g)].map(x => x[1]);
        const want = rows.filter(r => r.kind !== 'ext').slice().sort((a, b) => b.day - a.day).map(r => (r.kind === 'model' ? r.model : r.label));
        ok('stat: positive control, the fixture\'s median order differs from its total order', medOrder.join('|') !== want.join('|'), medOrder.join('|'));
        ok('stat: daily rate rows run largest total first', order.filter(l => want.includes(l)).join('|') === want.join('|'), order.join('|') + ' vs ' + want.join('|'));
        // ---- the order pair on the daily card: largest median first on a press, back on the other
        const pressSort = (e, v) => { const btn = { getAttribute: k => (k === 'data-an-rsort' ? v : null) }; e.handlers.forEach(h => h({ target: { closest: sel => (sel === '[data-an-rsort]' ? btn : null) } })); };
        const sOn = (h, v) => new RegExp('data-an-rsort="' + v + '" aria-pressed="true"').test(h);
        const orderOf = h => [...h.matchAll(/aria-label="([^"]*?): [\d,.]+ a day in total, median/g)].map(x => x[1]).filter(l => want.includes(l));
        ok('sort: the pair is on the daily card only, total pressed by default', A.getRateSort() === 'day' && sOn(h1, 'day') && !sOn(h1, 'med') && !h0.includes('data-an-rsort') && /Rows run largest total first/.test(h1));
        pressSort(el, 'med');
        const h1m = el.innerHTML;
        ok('sort: a press on Sort: median redraws largest median first', A.getRateSort() === 'med' && sOn(h1m, 'med') && orderOf(h1m).join('|') === medOrder.join('|') && /Rows run largest median first/.test(h1m), orderOf(h1m).join('|') + ' vs ' + medOrder.join('|'));
        const drawnM = [...h1m.slice(h1m.indexOf('aria-label="Total units per day: ship models and claim stake tiers"')).split('</svg>')[0].matchAll(/data-an-k="(r\d+)"/g)].map(x => x[1]);
        ok('sort: by median the rows are the model order (extractor rows under their tier), still daily totals on the bars', drawnM.join() === rows.map(r => r.k).join() && h1m.includes(topTxt), drawnM.join());
        pressSort(el, 'bogus'); A.setRateSort('bogus');
        ok('sort: an unknown value is ignored', A.getRateSort() === 'med');
        pressSort(el, 'day');
        ok('sort: a press on Sort: total puts the largest total first again', A.getRateSort() === 'day' && orderOf(el.innerHTML).join('|') === want.join('|'));
        // ---- profitability against origination price: a day's output at marketplace prices, per ship / per stake
        {
            const DAYS = 86400, RATE = 0.0001, EVIL = '<img src=x onerror=1>';
            const idx = A.msrpIndex({ 'Armstrong IMP': 10, 'Armstrong IMP Tip': 20, 'Zero': 0, 'Neg': -5, 'Text': 'x', 'Nan': NaN });
            ok('profit: a configuration is priced as the LONGEST listed hull name it starts with, on a whole word; junk prices are dropped', idx.length === 2 && A.msrpOf(idx, 'Armstrong IMP Tip Mining Min Config') === 20 && A.msrpOf(idx, 'Armstrong IMP Default Config') === 10 && A.msrpOf(idx, 'Armstrong IMPX Default Config') === null && A.msrpOf(idx, '') === null && A.msrpIndex(null).length === 0 && A.msrpIndex([1]).length === 0, JSON.stringify(idx));
            ok('profit: a read without prices says so and draws no table', m.compare.profit.state === 'unread' && m.compare.profit.rows.length === 0 && /Profitability against origination price[^]*?have not been read in this copy of the data\. Refresh to read them\./.test(el.innerHTML) && !el.innerHTML.includes('data-an-psort'));
            // prices for every resource but one; one resource with an ask and no bid; a model the list does not price; a hostile model
            const SP = JSON.parse(JSON.stringify(SL));
            const pureOf = f => { const k = Object.keys(f.types || {}); return k.length === 1 ? k[0] : null; };
            const mfl = () => SP.fleets.filter(f => f.s && f.s.kind === 'mining' && f.mine && f.mine.ups > 0 && f.ships > 0);
            const evilF = JSON.parse(JSON.stringify(mfl().find(pureOf))); evilF.a = 'EVILFLEET'; evilF.types = { [EVIL + ' Default Config']: evilF.ships }; SP.fleets.push(evilF);
            const mixF = JSON.parse(JSON.stringify(evilF)); mixF.a = 'MIXFLEET'; mixF.ships = 2; mixF.types = { 'Mix A Default Config': 1, 'Mix B Default Config': 1 }; SP.fleets.push(mixF);   // two models: belongs to no row
            const resAll = [...new Set([].concat(...mfl().map(f => (f.mine.out || []).map(o => o.r)), ...SP.stakes.map(s => (s.out || []).map(o => o.r))))].sort();
            const px = {}; resAll.slice(1).forEach((r, i) => { px[r] = [i === 0 ? null : 0.001 * (i + 1), 0.002 * (i + 2)]; });
            const hull = c => c.replace(/ (Default )?Config$/, ''), modelsAll = [...new Set(mfl().map(pureOf).filter(Boolean))].sort();
            const msrp = {}; modelsAll.slice(1).forEach((c, i) => { msrp[hull(c)] = 100 + 50 * i; }); [...new Set(SP.stakes.map(s => s.tier))].forEach(t => { msrp['Claim Stake Tier ' + t] = 30 * t; });
            SP.ref = Object.assign({}, SP.ref, { px, msrp, atlasUsd: RATE, atlasUsdAt: 1700000000, pricesAt: 1700003600 });
            // what things burn: Food and Ammunition on every mining fleet's stat row but one (unknown cost), consumption on the stakes
            px.Food = [0.004, 0.005]; px.Ammunition = [null, 0.003]; px[resAll[1]] = px[resAll[1]] || [0.001, 0.002];
            SP.statKeys = ['cargo.ammoConsumptionRate', 'cargo.foodConsumptionRate', 'combat.hp'];
            mfl().forEach((f, i) => { f.st = [0.01 * (i + 1), 0.02 * (i + 1), 100]; });
            const soloNoSt = mfl().find(f => pureOf(f) === modelsAll[modelsAll.length - 1]); delete soloNoSt.st;
            SP.stakes.forEach((s, i) => { if (Array.isArray(s.out)) s.use = [{ r: resAll[1], ps: 0.001 * (i + 1) }, { r: 'Unpriced Burn', ps: 5 }, { r: 'Food', ps: 0 }]; });
            const tier0 = SP.stakes.find(s => Array.isArray(s.out) && typeof s.tier === 'number');
            const costOf = list => list.reduce((t, [r, u]) => { const q = px[r]; return t + (u > 0 && q ? u * (q[1] != null ? q[1] : q[0]) : 0); }, 0);
            const mp = A.build(SP, F.B), P = mp.compare.profit;
            // this file's own figures
            const valOf = list => { let bid = 0, ask = 0, priced = 0, total = 0; for (const [r, u] of list) { if (!(u > 0)) continue; total += u; const p = px[r]; if (!p) continue; priced += u; if (p[0] != null) bid += u * p[0]; ask += u * p[1]; } return { bid, ask, priced, total }; };
            const want = [];
            for (const c of modelsAll) {
                const vs = mfl().filter(f => pureOf(f) === c).map(f => { const v = valOf((f.mine.out || []).map(o => [o.r, o.ups])); return { bid: v.bid / f.ships, ask: v.ask / f.ships, priced: v.priced / f.ships, total: v.total / f.ships, cost: f.st ? costOf([['Food', f.st[1]], ['Ammunition', f.st[0]]]) / f.ships : null }; }).filter(v => v.total > 0);
                if (vs.length) want.push({ name: c, usd: msrp[hull(c)] || null, vs });
            }
            for (const t of [...new Set(SP.stakes.map(s => s.tier))].filter(t => typeof t === 'number' && isFinite(t))) {
                const vs = SP.stakes.filter(s => s.tier === t && Array.isArray(s.out)).map(s => Object.assign(valOf(s.out.map(o => [o.r, o.ps])), { cost: costOf(s.use.map(o => [o.r, o.ps])) })).filter(v => v.total > 0);
                if (vs.length) want.push({ name: 'Claim Stake Tier ' + t, usd: msrp['Claim Stake Tier ' + t] || null, vs });
            }
            const near = (a, b) => (a == null || b == null ? a === b : Math.abs(a - b) <= 1e-9 * Math.max(1e-12, Math.abs(a), Math.abs(b)));
            const sum = (a, k) => a.reduce((t, v) => t + v[k], 0);
            ok('profit: positive control, the fixture gives several rows, an unpriced resource, a bid-less resource, an unpriced model and a mixed fleet', P.state === 'ok' && mfl().some(f => f.a === 'MIXFLEET') && !P.rows.some(r => /Mix [AB]|null/.test(r.label)) && want.length >= 4 && want.some(w => !w.usd) && want.some(w => sum(w.vs, 'priced') < sum(w.vs, 'total') - 1e-12) && P.pricedRes >= resAll.length - 1, want.length + ' rows');
            ok('profit: one row per ship model with a one-model mining fleet and per stake tier with production', P.rows.length === want.length && want.every(w => P.rows.some(r => r.name === w.name)), P.rows.map(r => r.name).join('|') + ' WANT ' + want.map(w => w.name + ':' + w.vs.length).join('|'));
            const cmp = want.map(w => { const r = P.rows.find(x => x.name === w.name) || {}; const bid = q7(w.vs.map(v => v.bid), 0.5) * DAYS, ask = q7(w.vs.map(v => v.ask), 0.5) * DAYS; return { w, r, bid, ask }; });
            ok('profit: ATLAS a day = the median over the fleets (per ship) or stakes of units a second x price x 86,400, at bids and at asks', cmp.every(c => near(c.r.bid, c.bid) && near(c.r.ask, c.ask) && c.r.n === c.w.vs.length), JSON.stringify(cmp.filter(c => !near(c.r.bid, c.bid) || !near(c.r.ask, c.ask)).map(c => [c.w.name, c.r.bid, c.bid, c.r.ask, c.ask])));
            cmp.forEach(c => { c.known = c.w.vs.every(v => v.cost !== null); c.cost = c.known ? q7(c.w.vs.map(v => v.cost), 0.5) * DAYS : null; });
            const payW = (usd, net) => (!usd || net === null ? null : net > 0 ? usd / (net * RATE) : Infinity);
            ok('profit: positive control, the fixture has a row with costs, a row whose costs are unknown, a burned resource with no price and one bought at its bid', cmp.some(c => c.known && c.cost > 0) && cmp.some(c => !c.known) && P.unpricedCost.join() === 'Unpriced Burn' && px.Ammunition[0] === null && px[resAll[1]][1] != null, JSON.stringify(cmp.map(c => [c.w.name, c.cost])));
            ok('profit: costs a day = what it burns x the best ask (the bid when nothing is offered) x 86,400, the median per ship or per stake; unknown when a fleet has no stat row', cmp.every(c => near(c.r.cost, c.cost)) && P.shipCosts === true, JSON.stringify(cmp.map(c => [c.w.name, c.r.cost, c.cost])));
            ok('profit: net = earns minus costs, at bids and at asks; nothing when the costs are unknown', cmp.every(c => near(c.r.netBid, c.known ? c.bid - c.cost : null) && near(c.r.netAsk, c.known ? c.ask - c.cost : null)));
            ok('profit: dollars = ATLAS x the ATLAS price; days to pay back = origination price / NET dollars a day, "never" (Infinity) when the net is not above zero', cmp.every(c => near(c.r.usdBid, c.bid * RATE) && near(c.r.usdAsk, c.ask * RATE) && near(c.r.usdCost, c.known ? c.cost * RATE : null) && near(c.r.usdNetBid, c.known ? (c.bid - c.cost) * RATE : null) &&
                (c.r.payBid === payW(c.w.usd, c.known ? c.bid - c.cost : null) || near(c.r.payBid, payW(c.w.usd, c.known ? c.bid - c.cost : null))) && (c.r.payAsk === payW(c.w.usd, c.known ? c.ask - c.cost : null) || near(c.r.payAsk, payW(c.w.usd, c.known ? c.ask - c.cost : null))) && (c.r.usd || null) === c.w.usd), JSON.stringify(cmp.map(c => [c.w.name, c.r.payBid, payW(c.w.usd, c.known ? c.bid - c.cost : null)])));
            // a stake that burns more than it earns never pays back
            const SNv = JSON.parse(JSON.stringify(SP)); SNv.stakes.forEach(s => { if (Array.isArray(s.out)) s.use = [{ r: 'Food', ps: 1e6 }]; });
            const Pnv = A.build(SNv, F.B).compare.profit, tNever = Pnv.rows.filter(r => r.kind === 'tier' && r.usd);
            const elnv = fakeEl(); A.setProfitSort('payBid', 1); A.render(elnv, A.build(SNv, F.B), { width: 900 });
            ok('profit: a net at or below zero reads "never" and sorts after every finite payback', tNever.length > 0 && tNever.every(r => r.payBid === Infinity && r.usdNetBid < 0) && /<td>never<\/td><td>never<\/td><\/tr>/.test(elnv.innerHTML) && !/Infinity/.test(elnv.innerHTML));
            ok('profit: the share of output with a price is priced units over all units', cmp.every(c => near(c.r.cover, sum(c.w.vs, 'priced') / sum(c.w.vs, 'total'))));
            const elp = fakeEl(); A.setProfitSort('payBid', 1); A.render(elp, mp, { width: 900 });
            const cardOf = h => { const i = h.indexOf('Profitability against origination price'); return i < 0 ? '' : h.slice(i, h.indexOf('</figure>', i)); };
            const labelsOf = h => [...cardOf(h).matchAll(/<th scope="row"><i class="c4an-sw f-s[12]"><\/i>([^<]*?) <em class="c4an-n">/g)].map(x => x[1]);
            const lab = r => (r.kind === 'model' ? r.label : r.label), E = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
            const sorted = (k, d) => P.rows.slice().sort((a, b) => { const x = k === 'name' ? a.label.toLowerCase() : a[k], y = k === 'name' ? b.label.toLowerCase() : b[k]; if ((x == null) !== (y == null)) return x == null ? 1 : -1; if (x != null && x !== y) return (x < y ? -1 : 1) * d; return a.label < b.label ? -1 : a.label > b.label ? 1 : 0; }).map(r => E(lab(r)));
            const h0p = elp.innerHTML;
            ok('profit: the table opens fastest payback at bids first, rows without a payback last, and says so on its header', labelsOf(h0p).join('|') === sorted('payBid', 1).join('|') && /<th scope="col" aria-sort="ascending"><button type="button" class="c4an-sortb" data-an-psort="payBid"/.test(h0p) && (cardOf(h0p).match(/aria-sort=/g) || []).length === 1 && (cardOf(h0p).match(/data-an-psort=/g) || []).length === 7, labelsOf(h0p).join('|') + ' vs ' + sorted('payBid', 1).join('|'));
            const pressP = (e, k) => { const btn = { getAttribute: a => (a === 'data-an-psort' ? k : null) }; e.handlers.forEach(h => h({ target: { closest: sel => (sel === '[data-an-psort]' ? btn : null) } })); };
            pressP(elp, 'payBid');
            ok('profit: a second press on the same header reverses it, the empty rows still last', A.getProfitSort().d === -1 && labelsOf(elp.innerHTML).join('|') === sorted('payBid', -1).join('|') && sorted('payBid', -1).join('|') !== sorted('payBid', 1).join('|') && /aria-sort="descending"><button type="button" class="c4an-sortb" data-an-psort="payBid"/.test(elp.innerHTML));
            pressP(elp, 'name');
            ok('profit: a press on the name header runs A to Z', A.getProfitSort().k === 'name' && A.getProfitSort().d === 1 && labelsOf(elp.innerHTML).join('|') === sorted('name', 1).join('|'));
            pressP(elp, 'usdBid');
            ok('profit: a press on a value header runs largest first', A.getProfitSort().k === 'usdBid' && A.getProfitSort().d === -1 && labelsOf(elp.innerHTML).join('|') === sorted('usdBid', -1).join('|'));
            pressP(elp, 'usd'); const byUsd = labelsOf(elp.innerHTML).join('|'); pressP(elp, 'usdCost'); const byCover = labelsOf(elp.innerHTML).join('|');
            ok('profit: every column orders the rows by its own figure', byUsd === sorted('usd', -1).join('|') && byCover === sorted('usdCost', -1).join('|') && byUsd !== byCover);
            pressP(elp, 'bogus'); pressP(elp, 'cover'); A.setProfitSort('bogus', 1); A.setProfitSort('usd', 5);
            ok('profit: an unknown column or direction is ignored', A.getProfitSort().k === 'usdCost' && A.getProfitSort().d === -1);
            A.setProfitSort('payBid', 1); const elq = fakeEl(); A.render(elq, mp, { width: 900 }); const hq = cardOf(elq.innerHTML);
            const best = P.rows.filter(r => r.payBid != null).sort((a, b) => a.payBid - b.payBid)[0], none = P.rows.find(r => !r.usd);
            const rowHtml = r => { const i = hq.indexOf('</i>' + E(lab(r)) + ' <em'); return hq.slice(i, hq.indexOf('</tr>', i)); };
            ok('profit: a row prints its origination price, what it earns, costs and nets in dollars a day, and the two paybacks', new RegExp('<td>\\$' + best.usd + '(\\.00)?</td><td>\\$[0-9.,KM]+</td><td>\\$[0-9.,KMe-]+</td><td>\\$[0-9.,KM]+</td><td>[0-9.,KM]+</td><td>[0-9.,KM]+</td></tr>'.replace('</tr>', '')).test(rowHtml(best)), rowHtml(best));
            ok('profit: a model the list does not price shows dashes for its price and paybacks, and the caption counts it', /<td>-<\/td><td>\$[^<]+<\/td><td>[^<]+<\/td><td>[^<]+<\/td><td>-<\/td><td>-<\/td>/.test(rowHtml(none)) && /; 2 rows have none listed|; 1 row has none listed/.test(hq), rowHtml(none));
            const unk = P.rows.find(r => r.cost === null);
            ok('profit: a row whose costs were not read shows no cost, no net and no payback, the caption counts it, and a burned resource with no price is named', /<td>\$[^<]+<\/td><td>-<\/td><td>-<\/td><td>-<\/td><td>-<\/td>/.test(rowHtml(unk)) && /1 row has no cost figure in this copy of the data/.test(hq) && /Burned with no market price, counted as free: Unpriced Burn\./.test(hq), rowHtml(unk));
            ok('profit: the caption says what the costs cover and that a ship\'s travelling fuel is not in them', /for a stake everything it consumes/.test(hq) && /food and ammunition its fleet uses while mining/.test(hq) && /fuel for travelling and hauling is NOT in the costs/.test(hq) && /"never" = the net is zero or less/.test(hq));
            ok('profit: a hostile model name is escaped in the cell and in the hover text', !hq.includes('<img src=x') && hq.includes('&lt;img src=x onerror=1&gt;') && P.rows.some(r => r.label === EVIL));
            ok('profit: the caption says where the prices come from, what is not subtracted, and that it is a reference', /best bid on the Galactic Marketplace \(sell now\)/.test(hq) && /ATLAS at \$0\.0001 \(CoinGecko, 2023-11-14 22:13 UTC\)/.test(hq) && /from 2023-11-14 23:13 UTC/.test(hq) && /not what it trades for now/.test(hq) && /a reference, not a forecast/.test(hq), hq.slice(hq.indexOf('One ship of the model')).slice(0, 300));
            ok('profit: no NaN, undefined or Infinity in the table', !/NaN|undefined|Infinity/.test(hq));
            // no ATLAS price: ATLAS figures stay, dollars and paybacks are empty, the caption says why
            const SN = JSON.parse(JSON.stringify(SP)); delete SN.ref.atlasUsd; const Pn = A.build(SN, F.B).compare.profit; const eln = fakeEl(); A.render(eln, A.build(SN, F.B), { width: 900 });
            ok('profit: without an ATLAS price the dollar and payback columns are empty and the caption says so', Pn.state === 'ok' && Pn.rate === null && Pn.rows.every(r => r.usdBid === null && r.usdCost === null && r.payBid === null && r.bid >= 0) && /The ATLAS price in dollars was not read/.test(cardOf(eln.innerHTML)) && !/NaN|undefined|Infinity/.test(cardOf(eln.innerHTML)));
            // junk in every price field
            const SJ = JSON.parse(JSON.stringify(SP)); SJ.ref.px = Object.assign({ Junk1: 'x', Junk2: [NaN, -1], Junk3: null, Junk4: [0, 0], '__proto__x': [1, 1] }, SJ.ref.px); SJ.ref.msrp = Object.assign({ J: 'x', K: -1 }, SJ.ref.msrp); SJ.ref.atlasUsd = 'x';
            const Pj = A.build(SJ, F.B).compare.profit, elj = fakeEl(); A.render(elj, A.build(SJ, F.B), { width: 900 });
            ok('profit: junk prices are ignored, never printed', Pj.state === 'ok' && Pj.rate === null && Pj.pricedRes === P.pricedRes + 1 && !/NaN|undefined|Infinity/.test(cardOf(elj.innerHTML)) && A.build(Object.assign(JSON.parse(JSON.stringify(SP)), { ref: { px: { A: 'x' }, msrp: msrp } }), F.B).compare.profit.state === 'unread');
            A.setProfitSort('payBid', 1);
        }
        // ---- it survives a redraw, ignores junk, and the # / % modes are untouched
        const el2 = fakeEl(); A.render(el2, m, { width: 360 });
        ok('stat: a redraw at another width keeps Daily total', on(el2.innerHTML, 'day') && el2.innerHTML.includes('Total per rank'));
        press(el2, 'bogus'); A.setStat('bogus'); A.setStat(null);
        ok('stat: an unknown value is ignored', A.getStat() === 'day');
        ok('stat: the # / % mode is not changed by the switch', A.getMode() === 'num');
        press(el2, 'med');
        ok('stat: back to median restores the first drawing', A.getStat() === 'med' && (() => { const e3 = fakeEl(); A.render(e3, m, { width: 900 }); return e3.innerHTML === h0; })());
        A.setStat('med');
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
    ["fold: a collapsed section still shows its charts","'\"' + (f ? ' hidden' : '') + '>' + cards.join('')","'\">' + cards.join('')"],
    ["fold: the chevron always says expanded","aria-expanded=\"' + (f ? 'false' : 'true') + '\" aria-controls","aria-expanded=\"true\" aria-controls"],
    ["fold: collapsing is forgotten on a redraw","folded[id] = !!on;","folded[id] = false;"],
    ["fold: any id can be collapsed","if (SECTIONS.indexOf(id) < 0) return;\n        folded[id] = !!on;","folded[id] = !!on;"],
    ["skills: every skill reads the mining level","var x = obj(o.xp), m = x && obj(x[sk[0]]); return m ? m.lvl : NaN; }).filter(","var x = obj(o.xp), m = x && obj(x.mining); return m ? m.lvl : NaN; }).filter("],
    ["skills: the highest level is the lowest","max: l.length ? l[l.length - 1] : null","max: l.length ? l[0] : null"],
    ["skills: a malformed level kept","return m ? m.lvl : NaN; }).filter(function (v) { return fin(v) && v >= 0; })","return m ? m.lvl : NaN; })"],
    ["skills: only the first skill gets a grid","var grids = SKILLS.map(function (sk) {","var grids = SKILLS.slice(0, 1).map(function (sk) {"],
    ["hero: thousands divided as millions","a >= 1e4 ? [1e3, 'K']","a >= 1e4 ? [1e6, 'K']"],
    ["hero: headline numbers drawn for an empty read","e.day > 0 ? [[kfmt(e.day), 'units a day']","true ? [[kfmt(e.day), 'units a day']"],
    ["hero: every section wears the same emblem","c4an-emb emb-' + id + '","c4an-emb emb-mining"],
    ["hero: emission headline shows the hourly figure","[[kfmt(e.day), 'units a day']","[[kfmt(e.day / 24), 'units a day']"],
    ["hero: crafting share of recipes inverted","pctTxt(c.used / c.read * 100)","pctTxt(c.read / c.used * 100)"],
    ["bars: no rail behind the bars","b += '<rect class=\"an-track\"","b += '<rect class=\"an-none\""],
    ["crafting: a recipe listing an ingredient twice counts its jobs twice","if (!seen[x.r]) { seen[x.r] = 1; e.jobs += r.u; e.recipes++; }","e.jobs += r.u; if (!seen[x.r]) { seen[x.r] = 1; e.recipes++; }"],
    ["crafting: the floor ignores the recipe quantity","e.floor += r.u * x.q;","e.floor += r.u;"],
    ["crafting: recipes with no jobs kept","str(r.n) && fin(r.u) && r.u > 0; }).map(function (r) { return { n: r.n, u: r.u,","str(r.n) && fin(r.u); }).map(function (r) { return { n: r.n, u: r.u,"],
    ["crafting: fewest jobs first","return b.u - a.u || (a.n < b.n ? -1 : 1); });\n        var jobs","return a.u - b.u || (a.n < b.n ? -1 : 1); });\n        var jobs"],
    ["crafting: a failed read drawn as no crafting","if (d.failed === true || !Array.isArray(d.recipes)) return { state: 'failed', src: doc };","if (!Array.isArray(d.recipes)) d = { recipes: [] };"],
    ["crafting: the floor presented as the amount consumed","'; at least ' + fnum(x.floor) + ' consumed if every job made one unit'","'; ' + fnum(x.floor) + ' consumed'"],
    ["crafting: section not drawn"," + secCrafting(ctx, model)",""],
    ["layout: four columns never used","width >= 1900 ? 4","width >= 99999 ? 4"],
    ["economy: stake output left out of the total","st += x.ps; any = true;","any = true;"],
    ["economy: a day is an hour","var DAY = 86400,","var DAY = 3600,"],
    ["economy: six largest producers instead of five","ECO_HEAD = 5","ECO_HEAD = 6"],
    ["economy: producers smallest first","return b.day - a.day || (a.o < b.o","return a.day - b.day || (a.o < b.o"],
    ["economy: a system of an unknown faction dropped from the split","e.n++; e.by[fac(s.f)]++; sbN++;","e.n++; if (e.by[s.f] != null) e.by[s.f]++; sbN++;"],
    ["economy: a fractional level counted"," || Math.floor(s.lvl) !== s.lvl) return;",") return;"],
    ["economy: a stake's output not credited to its owner","add(x.r, str(s.o), x.ps, 'stakes')","add(x.r, '', x.ps, 'stakes')"],
    ["sinks: smallest first","return b.day - a.day || (a.r < b.r ? -1 : 1); });\n        // starbases","return a.day - b.day || (a.r < b.r ? -1 : 1); });\n        // starbases"],
    ["sinks: a rent balance that is not a number added","if (r && fin(r.bal) && r.bal >= 0) {","if (r) {"],
    ["sinks: emission of the consumed resource not looked up","emit: emitDay[k] || 0 }","emit: 0 }"],
    ["sinks: a zero-rate stake counted as consuming","fin(x.ps) && x.ps > 0) { bump(use, x.r, x.ps); any = true; }","fin(x.ps)) { bump(use, x.r, x.ps); any = true; }"],
    ["economy: section not drawn"," + secEconomy(ctx, model) + secCrafting"," + secCrafting"],
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
    ['section id dropped', "'\" id=\"c4an-' + id + '\"><div class=\"c4an-hero\"", "'\" data-id=\"' + id + '\"><div class=\"c4an-hero\""],
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
    ["stat: daily total without the 86,400 (size)","crew: cs, day: sum(list.map(function (r) { return r.ups; })) * DAY };","crew: cs, day: sum(list.map(function (r) { return r.ups; })) };"],
    ["stat: rank total is the median","tot: { fleets: sum(vals(g, function (o) { return o.fleets; }))","tot: { fleets: median(vals(g, function (o) { return o.fleets; }))"],
    ["stat: rank mining total not per day","ups: sum(vals(g, function (o) { return o.ups; })) * DAY,","ups: sum(vals(g, function (o) { return o.ups; })),"],
    ["stat: ship model total sums the per-ship yield","n: l.length, day: sum(l.map(function (r) { return r.ups; })) * DAY,","n: l.length, day: sum(l.map(function (r) { return r.yps; })) * DAY,"],
    ["stat: tier total is the median","it.day = sum(l.map(function (e) { return e.v; })) * DAY;","it.day = it.v * DAY;"],
    ["stat: switch forgotten on render","function isDay() { return stat === 'day'; }","function isDay() { return false; }"],
    ["sort: the order switch is ignored","if (day && rateSort !== 'med') {","if (day) {"],
    ["sort: the press does nothing","rateSort = rv;","void rv;"],
    ["sort: any value accepted","if (v === 'med' || v === 'day') rateSort = v;","rateSort = v;"],
    ["stat: no pair on the section banners","var ctrl = STAT_SECTIONS.indexOf(id) >= 0 ?","var ctrl = false ?"],
    ["stat: the pair on every section banner","var ctrl = STAT_SECTIONS.indexOf(id) >= 0 ?","var ctrl = true ?"],
    ["stat: a banner pair is not marked with its section","(at ? ' data-an-at=\"' + at + '\"' : '') + '>' + text","'>' + text"],
    ["profit: value not per day","var med = function (f) { return median(vals.map(f)) * DAY; };","var med = function (f) { return median(vals.map(f)); };"],
    ["profit: the mean, not the median","var med = function (f) { return median(vals.map(f)) * DAY; };","var med = function (f) { return sum(vals.map(f)) / vals.length * DAY; };"],
    ["profit: ask column valued at bids","if (p[1] !== null) o.ask += x.u * p[1];","if (p[0] !== null) o.ask += x.u * p[0];"],
    ["profit: fleet value not divided by its ships","['bid', 'ask', 'priced', 'total', 'cost'].forEach(function (k) { if (v[k] !== null) v[k] = v[k] / m.ships; });   // per ship","if (v.cost !== null) v.cost = v.cost / m.ships;"],
    ["profit: mixed fleets counted under a model","if (!m.pure) return;\n            var v = value(","var v = value("],
    ["profit: dollars without the ATLAS price","return v !== null && P.rate !== null ? v * P.rate : null; };","return v; };"],
    ["profit: payback upside down","return !usd || net === null ? null : net > 0 ? usd / net : Infinity; };","return !usd || net === null ? null : net > 0 ? net / usd : Infinity; };"],
    ["profit: payback at asks uses the bids","r.payBid = pay(r.usdNetBid); r.payAsk = pay(r.usdNetAsk);","r.payBid = pay(r.usdNetBid); r.payAsk = pay(r.usdNetBid);"],
    ["profit: payback on the gross figure","r.payBid = pay(r.usdNetBid); r.payAsk = pay(r.usdNetAsk);","r.payBid = pay(r.usdBid); r.payAsk = pay(r.usdAsk);"],
    ["profit: a negative net pays back in negative days","return !usd || net === null ? null : net > 0 ? usd / net : Infinity; };","return !usd || net === null ? null : usd / net; };"],
    ["profit: costs not subtracted","if (r.cost !== null) { r.netBid = r.bid - r.cost; r.netAsk = r.ask - r.cost; }","if (r.cost !== null) { r.netBid = r.bid; r.netAsk = r.ask; }"],
    ["profit: costs bought at the bid","at = p ? (p[1] !== null ? p[1] : p[0]) : null;","at = p ? (p[0] !== null ? p[0] : p[1]) : null;"],
    ["profit: a burned resource with no price not named","if (at === null) { noCost[x.r] = 1; return; }","if (at === null) { return; }"],
    ["profit: a fleet without a stat row costs nothing","v.cost = burn[m.a] ? cost(burn[m.a]) : null;","v.cost = burn[m.a] ? cost(burn[m.a]) : 0;"],
    ["profit: fleet costs not divided by its ships","['bid', 'ask', 'priced', 'total', 'cost'].forEach(function (k) { if (v[k] !== null) v[k] = v[k] / m.ships; });   // per ship","['bid', 'ask', 'priced', 'total'].forEach(function (k) { if (v[k] !== null) v[k] = v[k] / m.ships; });   // per ship"],
    ["profit: food read from the ammunition column","var fo = f.st[iFood], am = f.st[iAmmo];","var fo = f.st[iAmmo], am = f.st[iAmmo];"],
    ["profit: a stake's consumption ignored","v.cost = Array.isArray(s.use) ? cost(s.use.filter(","v.cost = Array.isArray(s.use) ? 0 * cost(s.use.filter("],
    ["profit: never printed as Infinity","function paybackText(v) { return v === Infinity ? 'never' : daysText(v); }","function paybackText(v) { return String(v); }"],
    ["profit: share with a price always 100%","cover: total > 0 ? priced / total : null,","cover: total > 0 ? 1 : null,"],
    ["profit: a bid-less resource counted as unpriced","o.priced += x.u;\n                if (p[0] !== null) o.bid","if (p[0] !== null) o.priced += x.u;\n                if (p[0] !== null) o.bid"],
    ["profit: hull name matched on part of a word","if (n === idx[i].n || n.indexOf(idx[i].n + ' ') === 0) return idx[i].usd;","if (n === idx[i].n || n.indexOf(idx[i].n) === 0) return idx[i].usd;"],
    ["profit: hull names not tried longest first","out.sort(function (a, b) { return b.n.length - a.n.length || (a.n < b.n ? -1 : a.n > b.n ? 1 : 0); });\n        return out;\n    }\n    function msrpOf","return out;\n    }\n    function msrpOf"],
    ["profit: zero, negative and text prices kept","if (n && fin(o[k]) && o[k] > 0) out.push({ n: n, usd: o[k] });","if (n) out.push({ n: n, usd: o[k] });"],
    ["profit: junk resource prices kept","var b = fin(v[0]) && v[0] > 0 ? v[0] : null, a = fin(v[1]) && v[1] > 0 ? v[1] : null;","var b = v[0], a = v[1];"],
    ["profit: empty rows sorted among the rest","if (xn !== yn) return xn ? 1 : -1;",""],
    ["profit: the order ignores the direction","if (!xn && x !== y) return (x < y ? -1 : 1) * d;","if (!xn && x !== y) return (x < y ? -1 : 1);"],
    ["profit: a press does not reverse the same column","d: profitSort.k === pk ? -profitSort.d : profitFirstDir(pk) };","d: profitFirstDir(pk) };"],
    ["profit: a value column opens smallest first","return k === 'name' || k === 'payBid' || k === 'payAsk' ? 1 : -1;","return 1;"],
    ["profit: any column name accepted","if (PROFIT_COLS.indexOf(k) >= 0 && (d === 1 || d === -1)) profitSort","if (true) profitSort"],
    ["profit: model name not escaped","</i>' + E(r.label) + ' <em class=\"c4an-n\">","</i>' + r.label + ' <em class=\"c4an-n\">"],
    ["profit: hover text not escaped","'<tr title=\"' + E(tip) + '\">","'<tr title=\"' + tip + '\">"],
    ["profit: no note on a read without prices","if (P.state !== 'ok') return card('Profitability against origination price', chart('', note('Marketplace and origination prices have not been read in this copy of the data. Refresh to read them.'), base + ' read.'));","if (P.state !== 'ok') return '';"],
    ["profit: the sort mark is on every header","var on = profitSort.k === h[0];","var on = true;"],
    ["stat: any value accepted","if (v === 'med' || v === 'day') stat = v;","stat = v;"],
    ["stat: the press does nothing","stat = sv;","void sv;"],
    ["stat: daily bars still measure the median","var val = function (r) { return day ? r.day : r.v; };","var val = function (r) { return r.v; };"],
    ["stat: daily council bars draw the median","return D ? { label: 'rank ' + r.rank, v: r.tot[mm[0]],","return D ? { label: 'rank ' + r.rank, v: r[mm[0]],"],
    ["stat: extractor rows sorted loose among the models","if (r.kind === 'ext' && groups.length) groups[groups.length - 1].push(r); else groups.push([r]);","groups.push([r]);"],
    ["stat: every council heading says per day","var name = D && mm[0] === 'ups' ? 'Mining units per day' : mm[1];","var name = D ? mm[1] + ' per day' : mm[1];"],
    ["stat: median council bars printed as K","fmt: D ? kfmt : fnum, cw: D","fmt: kfmt, cw: D"],
    ["stat: tier total skips stakes without an extractor count","it.day = sum(l.map(function (e) { return e.v; })) * DAY;","it.day = sum(l.filter(function (e) { return e.ext != null; }).map(function (e) { return e.v; })) * DAY;"],
    ["stat: size median shown per second in the daily view","tag: 'med ' + kfmt(s.med * DAY) + ', n=' + s.n","tag: 'med ' + kfmt(s.med) + ', n=' + s.n"],
    ["stat: rank mining median shown per second in the daily view","var md = r[mm[0]] * (mm[0] === 'ups' ? DAY : 1);","var md = r[mm[0]];"],
    ["stat: rank count medians multiplied by a day","var md = r[mm[0]] * (mm[0] === 'ups' ? DAY : 1);","var md = r[mm[0]] * DAY;"],
    ["stat: rate median shown per second in the daily view","' med ' + kfmt(r.v * DAY) + ', n=' + r.n","' med ' + kfmt(r.v) + ', n=' + r.n"],
    ["stat: daily view drops the median","tag: 'med ' + kfmt(md) + ', n=' + r.n","tag: 'n=' + r.n"],
    ["stat: daily rate rows left in median order","groups.sort(function (a, b) { return b[0].day - a[0].day || (a[0].label < b[0].label ? -1 : a[0].label > b[0].label ? 1 : 0); });","void groups;"],
    ["stat: daily rate rows smallest total first","groups.sort(function (a, b) { return b[0].day - a[0].day","groups.sort(function (a, b) { return a[0].day - b[0].day"],
    ["gov: section not registered","var SECTIONS = ['mining', 'council', 'governance', 'stakes',","var SECTIONS = ['mining', 'council', 'stakes',"],
    ["gov: faction taken from nothing","var fa = Object.prototype.hasOwnProperty.call(GOV_FAC, s.ctl) ? GOV_FAC[s.ctl] : 'unaligned', fees","var fa = 'mud', fees"],
    ["gov B7: fees table without the fit class","<table class=\"c4an-tbl c4an-fit\"><thead>","<table class=\"c4an-tbl\"><thead>"],
    ["gov B4: faction by plain lookup (prototype keys leak)","var fa = Object.prototype.hasOwnProperty.call(GOV_FAC, s.ctl) ? GOV_FAC[s.ctl] : 'unaligned', fees","var fa = GOV_FAC[s.ctl] || 'unaligned', fees"],
    ["gov B2: fee ask compared by raw number","return feeTxt(k, a[k]) !== feeTxt(k, b[k]);","return a[k] !== b[k];"],
    ["gov B3: reference is policy.defaults","def = feesOf(pol.constant) || { craft: 10000, mkt: 0, local: 0, dist: 0 }","def = feesOf(pol.defaults)"],
    ["gov B3: stated policy.constant ignored","def = feesOf(pol.constant) || {","def = feesOf(null) || {"],
    ["gov B5: allocated read from pvpReserved","allocated = sum(rows.map(function (r) { return r.power; }));","allocated = fin(V.pvpReserved) && V.pvpReserved > 0 ? V.pvpReserved : 0;"],
    ["gov: voting enabled counts every system","on: s.on === 1, votes:","on: true, votes:"],
    ["gov: votes-set tile counts voting enabled","return r.on && r.power > 0; }).length,","return r.on; }).length,"],
    ["gov: modules installed counts every started module","inst = !!(mod && mod.inst === 1);","inst = !!mod;"],
    ["gov: fees never compared with the defaults","fdiff: fees && def ? feeDiff(fees, def) : [],","fdiff: [],"],
    ["gov: what voters ask for ignored","ask: want ? (fees ? feeDiff(want, fees) : FEE_KEYS.slice()) : [],","ask: [],"],
    ["gov: no default-fees sentence","else if (!F.rows.length) {","else if (false) {"],
    ["gov: crafting multiple off by a hundred","function craftTxt(b) { return 'x' + (b / 10000).toFixed(2); }","function craftTxt(b) { return 'x' + (b / 100).toFixed(2); }"],
    ["gov: percent of a fee in basis points not divided","function bpsTxt(b) { return Number((b / 100).toFixed(2)) + ' %'; }","function bpsTxt(b) { return Number(b.toFixed(2)) + ' %'; }"],
    ["gov: share funded is not a share","Math.min(100, fund / need * 100)","Math.min(100, fund / need)"],
    ["gov: share of voting power divides by zero","share: issued > 0 ? allocated / issued * 100 : null","share: allocated / issued * 100"],
    ["gov: tiny share printed as 0.0%","p < 0.1 ? 'under 0.1%' : pctTxt(p)","pctTxt(p)"],
    ["gov: absent gov throws instead of a note","if (!g) return section('governance',","if (false) return section('governance',"],
    ["gov: bill name not escaped","'<li><b>' + E(b.n) + '</b>","'<li><b>' + b.n + '</b>"],
    ["gov: system name not escaped in the fees table","\"></i> ' + E(r.name) + '</th>","\"></i> ' + r.name + '</th>"],
    ["gov: contributor name not escaped","return '<tr><th scope=\"row\">' + E(c.player) + '</th>","return '<tr><th scope=\"row\">' + c.player + '</th>"],
    ["gov: contributed resource name not escaped","return E(r.n) + ' ' + E(fnum(r.q)); }).join(', ')","return r.n + ' ' + E(fnum(r.q)); }).join(', ')"],
    ["gov: contributed resources dropped","units: c.units, res: res };","units: c.units, res: [] };"],
    ["gov: zero-quantity resource rows kept","return obj(r) && fin(r.q) && r.q > 0; }).map(function (r) { return { n: str(r.n) ||","return obj(r); }).map(function (r) { return { n: str(r.n) ||"],
    ["gov: allocation system not escaped","E(t.system) + '</td><td>' + E(fnum(t.power))","t.system + '</td><td>' + E(fnum(t.power))"],
    ["gov: allocations listed in the order read","}).sort(function (x, y) { return y.power - x.power || (x.player < y.player ? -1 : x.player > y.player ? 1 : 0); });\n        var con","}).sort(function (x, y) { return 0; });\n        var con"],
    ["gov: contributors ranked by name","return { player: plName(c.p), system: sysName(str(c.sys)), units: c.units, res: res };\n        }).sort(function (x, y) { return y.units - x.units ||","return { player: plName(c.p), system: sysName(str(c.sys)), units: c.units, res: res };\n        }).sort(function (x, y) { return 0 ||"],
    ["gov: loyalty points shown without confirmation","<th scope=\"col\">Units</th></tr></thead><tbody>' +","<th scope=\"col\">Units</th><th scope=\"col\">Loyalty points</th></tr></thead><tbody>' +"],
    ["gov: junk system rows not skipped","            var s = obj(S[a]);\n            if (!s) return;\n            var fa = Object","            var s = S[a];\n            var fa = Object"],
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
