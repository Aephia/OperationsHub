// c4-live-check.js - checks the C4 Live panel computations (C4Live/c4-ui-model.js) against the real collector files
// in Data/c4-live/. Run from the repo root:  node Test/c4-live-check.js
// Exit 0 = all pass, 1 = a check failed, 2 = no data (run Tools/c4-live first).
// Every rule check is also run against a deliberately broken version of the rule (a "mutant"); a check that does not
// FAIL on its mutant is itself reported as a failure, so a check that cannot see breakage never passes silently.
// C4_BREAK=<name> breaks the real module before the run (concentration | ownerUps | projection | verdict | destroyed |
// stale | dtsec | bodyverdict | sysmember) to show the whole suite going red.

'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'Data', 'c4-live');
// C4_PAGE_DIR=<dir>: run the whole suite against another copy of the four page files (index.html, app.js,
// c4-ui-model.js, c4.css), e.g. a saved start state, to show that a new check FAILS on the code it was written against
const PAGE_DIR = process.env.C4_PAGE_DIR ? path.resolve(process.env.C4_PAGE_DIR) : null;
const PAGE_FILES = ['index.html', 'app.js', 'c4-ui-model.js', 'c4.css'];
const M = require(path.join(PAGE_DIR || path.join(ROOT, 'C4Live'), 'c4-ui-model.js'));
if (PAGE_DIR) console.log('PAGE FILES FROM ' + PAGE_DIR);

function readJson(f, dflt) { try { return JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch (e) { if (dflt !== undefined) return dflt; throw e; } }
let L;
try { L = readJson('latest.json'); } catch (e) { console.log('NO DATA: Data/c4-live/latest.json missing - run: cd Tools/c4-live && npm run collect:once'); process.exit(2); }
const E = readJson('events.json', []), H = readJson('history.json', []), O = readJson('owners.json', {});

// ---- optional sabotage of the real module (negative control for the whole suite)
const BREAK = process.env.C4_BREAK;
if (BREAK === 'concentration') { const orig = M.concentration; M.concentration = (v, n) => orig(v.slice().reverse().map((x, i) => i === 0 ? 0 : x), n); }
// the bug this guards: summing the base rate (no richness) instead of mine.out[].ups. The collector wrote the base
// rate into mine.ups until 2026-11-06 ~22:10 EDT; since then it is mine.baseUps and mine.ups is the out sum.
const baseRateOwners = orig => (f, r) => { const list = orig(f, r); list.forEach(o => { o.ups = o.fleetList.reduce((s, x) => s + (x.mine ? (x.mine.baseUps != null ? x.mine.baseUps : x.mine.ups) : 0), 0); }); return list; };
if (BREAK === 'ownerUps') M.aggregateOwners = baseRateOwners(M.aggregateOwners);
if (BREAK === 'projection') M.projectMined = (ups) => ups * 3600;
if (BREAK === 'verdict') M.miningVerdict = () => '<b>Hydrogen</b> is <b>39%</b> of the <b>15.0k u/s</b> being mined.';
if (BREAK === 'bodyverdict') { const orig = M.buildBody; M.buildBody = (...a) => { const o = orig(...a); if (o) o.verdict = '<b>3</b> fleets from <b>2</b> owners mine <b>99.5 u/s</b> here'; return o; }; }
if (BREAK === 'sysmember') { const orig = M.buildSystem; M.buildSystem = (l, e, i, a) => { const v = orig(l, e, i, a); const sys = l.systems.find(x => x.a === a); v.fleets = v.fleets.filter(f => Math.abs(f.x - sys.x) < 0.05 && Math.abs(f.y - sys.y) < 0.05 || f.s.kind === 'docked' || f.s.kind === 'mining'); return v; }; }
if (BREAK === 'destroyed') M.destroyedFleets = evs => ({ size: evs.filter(e => e.k === 'destroyed' || (e.k === 'combat' && e.dead)).length });
if (BREAK === 'stale') M.liveMined = (ups, l, t) => ({ units: M.projectMined(ups, l.generatedAt, t), frozen: false });
if (BREAK === 'dtsec') { const orig = M.minedSeries; M.minedSeries = h => { const r = orig(h.map((x, i) => i ? { ...x, minedDtSec: x.t - h[i - 1].t } : x)); return r; }; }

let pass = 0, fail = 0;
function check(name, ok, detail) {
    if (ok) { pass++; console.log('  PASS ' + name + (detail ? '  (' + detail + ')' : '')); }
    else { fail++; console.log('  FAIL ' + name + (detail ? '  (' + detail + ')' : '')); }
}
const near = (a, b, tol) => Math.abs(a - b) <= (tol != null ? tol : 1e-6 * Math.max(1, Math.abs(b)));
// run a rule check on the real implementation (must pass) and on a mutant (must fail)
function ruleCheck(name, test, impl, mutant) {
    let real; try { real = test(impl); } catch (e) { real = false; }
    check(name, real);
    let mut; try { mut = test(mutant); } catch (e) { mut = false; }
    check(name + ' - negative control: the broken rule is caught', !mut, mut ? 'mutant PASSED, the check is blind' : 'mutant failed as it must');
}
// model calls go through M.* at call time so C4_BREAK reaches them
const build = (f, lat, ev) => { lat = lat || L; ev = ev || E;
    const fleets = lat.fleets.filter(x => f === 'all' || M.groupOf(x) === f);
    const D = M.build(lat, ev, H, O, { faction: f });
    if (BREAK) {   // rebuild the parts the sabotage targets through the (possibly patched) exports
        D.owners = M.aggregateOwners(fleets, lat.owners); D.players = D.owners.filter(o => !o.npc);
        D.mining.cOwners = M.concentration(D.owners.filter(o => o.ups > 0).map(o => o.ups), 10);
        D.mining.cFleets = M.concentration(D.mining.fleets.map(x => x.ups), 10);
        D.verdicts.mining = M.miningVerdict(D.mining);
    }
    return D;
};

console.log(`C4 Live check - snapshot ${new Date(L.generatedAt * 1000).toISOString()}, ${L.fleets.length} fleets, ${E.length} events, ${H.length} history points`);
const D = build('all');
const K = L.kpis;

console.log('\n[1] Panel totals equal the collector KPIs (independent sums over fleets[])');
check('fleets', D.kpi.fleets === K.fleets, `${D.kpi.fleets} vs ${K.fleets}`);
check('ships', D.kpi.ships === K.ships, `${D.kpi.ships} vs ${K.ships}`);
check('players (distinct non-NPC owners)', D.kpi.players === K.players, `${D.kpi.players} vs ${K.players}`);
check('NPC fleets', D.kpi.npcFleets === K.npcFleets, `${D.kpi.npcFleets} vs ${K.npcFleets}`);
check('mining fleets = byState.mining', D.kpi.miningFleets === K.byState.mining, `${D.kpi.miningFleets} vs ${K.byState.mining}`);
check('galaxy u/s', near(D.kpi.ups, K.galaxyUps, 1e-3), `${D.kpi.ups.toFixed(3)} vs ${K.galaxyUps}`);
const resBad = Object.entries(K.resUps).filter(([r, u]) => { const x = D.mining.resources.find(y => y.r === r); return !x || !near(x.ups, u, 1e-3); });
check('per-resource u/s (' + Object.keys(K.resUps).length + ' resources)', !resBad.length && D.mining.resources.length === Object.keys(K.resUps).length, resBad.slice(0, 3).map(x => x[0]).join(', '));
check('fleet fights 24 h = kpis.combat24h', D.kpi.combat24 === K.combat24h, `${D.kpi.combat24} vs ${K.combat24h}`);
check('claim stakes', D.kpi.stakes === K.stakes, `${D.kpi.stakes} vs ${K.stakes}`);
for (const k of Object.keys(K.byState)) check(`state ${k}`, (D.fleetsView.byState[k].player + D.fleetsView.byState[k].npc) === K.byState[k], `${D.fleetsView.byState[k].player + D.fleetsView.byState[k].npc} vs ${K.byState[k]}`);
const astBad = L.asteroids.filter(a => { const x = D.mining.asteroids.find(y => y.a === a.a); return !x || !near(x.ups, a.ups, 1e-3); });
check('asteroid u/s rebuilt from fleets = asteroids[].ups', !astBad.length && D.mining.asteroids.length === L.asteroids.length, `${D.mining.asteroids.length} vs ${L.asteroids.length}; ${astBad.length} differ`);

console.log('\n[2] Faction filter partitions the galaxy (no fleet lost or double-counted)');
const parts = ['mud', 'oni', 'ustur', 'npc', 'unaligned'].map(f => build(f));
check('fleets', parts.reduce((s, p) => s + p.kpi.fleets, 0) === D.kpi.fleets);
check('ships', parts.reduce((s, p) => s + p.kpi.ships, 0) === D.kpi.ships);
check('mining u/s', near(parts.reduce((s, p) => s + p.kpi.ups, 0), D.kpi.ups, 1e-3));
check('players', parts.reduce((s, p) => s + p.kpi.players, 0) === D.kpi.players);
check('NPC filter has no players and no player fleets', parts[3].kpi.players === 0 && parts[3].kpi.playerFleets === 0);

console.log('\n[3] Owner aggregation');
const recBy = new Map(L.owners.map(o => [o.p, o]));
const ownBad = D.players.filter(o => { const r = recBy.get(o.p); return !r || r.fleets !== o.fleets || r.ships !== o.ships || r.mining !== o.mining; });
check('every player matches the collector owner record (fleets, ships, mining)', !ownBad.length && D.players.length === L.owners.length, `${ownBad.length} differ`);
ruleCheck('owner u/s sums to the galaxy u/s (richness applied, not owners[].ups)',
    agg => near(agg(L.fleets, L.owners).reduce((s, o) => s + o.ups, 0), K.galaxyUps, 1e-3), M.aggregateOwners,
    baseRateOwners(M.aggregateOwners));
// collector contract since ~22:10 EDT 2026-11-06 (snapshots carrying mine.baseUps): sum(owners[].ups) + NPC ups = galaxyUps
const newContract = L.fleets.some(f => f.mine && f.mine.baseUps != null);
if (newContract) {
    const npcUps = L.fleets.filter(f => f.npc).reduce((s, f) => s + M.fleetUps(f), 0);
    const ownUps = L.owners.reduce((s, o) => s + (o.ups || 0), 0);
    check('collector owners[].ups + NPC ups = galaxyUps (new contract)', near(ownUps + npcUps, K.galaxyUps, 1e-3), `${(ownUps + npcUps).toFixed(3)} vs ${K.galaxyUps}`);
} else console.log('  SKIP collector owners[].ups check: snapshot predates mine.baseUps');
check('NPC owner is flagged npc and has no profile record', D.owners.filter(o => o.npc).every(o => !o.hasRecord));

console.log('\n[4] Concentration rule');
const conc = M.concentration;
ruleCheck('synthetic [10,5,3,1,1]: top 2 = 75%, half reached by 1 item',
    c => { const r = c([1, 10, 3, 5, 1], 2); return near(r.topShare, 0.75) && r.forHalf === 1 && r.total === 20; }, conc,
    (v, n) => {   // mutant: sorts ascending, so "top n" are the smallest
        const s = v.filter(x => x > 0).sort((a, b) => a - b), t = s.reduce((a, b) => a + b, 0);
        let acc = 0, k = 0; while (k < s.length && acc < t / 2) acc += s[k++];
        return { total: t, topShare: s.slice(0, n).reduce((a, b) => a + b, 0) / t, forHalf: k };
    });
const ups = L.fleets.map(M.fleetUps).filter(x => x > 0).sort((a, b) => b - a);
const top10 = ups.slice(0, 10).reduce((a, b) => a + b, 0) / ups.reduce((a, b) => a + b, 0);
check('real data: top-10 fleet share matches an independent sort', near(D.mining.cFleets.topShare, top10, 1e-9), `${(D.mining.cFleets.topShare * 100).toFixed(2)}% vs ${(top10 * 100).toFixed(2)}%`);
check('concentration label thresholds', M.concLabel(0.5) === 'highly concentrated' && M.concLabel(0.49) === 'concentrated' && M.concLabel(0.24) === 'broad');

console.log('\n[5] Live projection, data age, read quality');
ruleCheck('projectMined(10 u/s, snapshot 100, now 160) = 600; before the snapshot = 0',
    p => p(10, 100, 160) === 600 && p(10, 100, 50) === 0, M.projectMined, (u) => u * 60);
const a1 = M.dataAge({ generatedAt: 1000, intervalMin: 60 }, 1000 + 720);
check('age 12 min of a 60 min interval: ok, next in 48 min', a1.state === 'ok' && a1.next === 2880 && !a1.stale);
check('age 61 min: late (run overdue), not stopped', M.dataAge({ generatedAt: 1000, intervalMin: 60 }, 1000 + 61 * 60).state === 'late');
check('age 121 min (> 2 intervals): stopped, no next estimate', (a => a.state === 'stopped' && a.stale && a.next === null)(M.dataAge({ generatedAt: 1000, intervalMin: 60 }, 1000 + 121 * 60)));
const snap = { generatedAt: 1000, intervalMin: 60 };
ruleCheck('live counter: ticks while fresh, then HOLDS the value reached when the collector stopped (3 days later = ups x 2 intervals)',
    lm => { const a = lm(2, snap, 1000 + 600), b = lm(2, snap, 1000 + 3 * 86400); return a.units === 1200 && !a.frozen && b.frozen && b.units === 2 * 2 * 3600; },
    M.liveMined, (ups, l, t) => ({ units: M.projectMined(ups, l.generatedAt, t), frozen: false }));
// continuity across the stop boundary (age = 2 intervals): one second either side differs by at most ups x 1 s
ruleCheck('live counter is continuous across the freeze (no drop from 2 x interval to 1 x interval)',
    lm => { const b = 1000 + 2 * 3600; const x = lm(10, snap, b - 1), y = lm(10, snap, b + 1); return !x.frozen && y.frozen && y.units >= x.units && y.units - x.units <= 10; },
    M.liveMined, (ups, l, t) => { const a = M.dataAge(l, t); return a.stale ? { units: ups * a.interval, frozen: true } : { units: Math.max(0, ups * (t - l.generatedAt)), frozen: false }; });
ruleCheck('quality notes: partial read names failed counts; suspectDiscovery noted; clean pass = no note',
    qn => { const n = qn({ partial: true, mineFailed: 3, mineTotal: 387, charFailed: 0, charTotal: 324, suspectDiscovery: true }); return n.length === 2 && n[0].includes('3 of 387 mining states failed') && /disappeared/.test(n[1]) && qn({ partial: true, mineFailed: 0, charFailed: 0, suspectDiscovery: true }).length === 1 && qn({ partial: false, mineFailed: 0, mineTotal: 387 }).length === 0; },
    M.qualityNotes, q => (q.partial ? ['Partial read'] : []));
check('real snapshot quality notes match latest.quality', M.qualityNotes(L.quality).length === ((L.quality && L.quality.partial && (L.quality.mineFailed || L.quality.charFailed || !L.quality.suspectDiscovery) ? 1 : 0) + (L.quality && L.quality.suspectDiscovery ? 1 : 0)), JSON.stringify(L.quality || null));

console.log('\n[6] History degrades honestly');
const ms = M.minedSeries(H);
const expectPts = H.filter(h => h.minedDelta && Object.keys(h.minedDelta).length && h.minedDtSec > 0).length;
check(`real history (${H.length} run${H.length === 1 ? '' : 's'}): one settled point per run with minedDelta and minedDtSec`, ms.points.length === expectPts, `${ms.points.length} points, ${ms.skipped} skipped`);
check('one run -> no chart points (empty state, not a fake line)', M.minedSeries([{ t: 1, minedDelta: {} }]).points.length === 0);
ruleCheck('settled rate divides by minedDtSec, not the gap between history points (500 units over 300 s = 6000/h, runs 1800 s apart)',
    ser => { const r = ser([{ t: 0, minedDelta: {} }, { t: 1800, minedDelta: { A: 300, B: 200 }, minedDtSec: 300 }]); return r.points.length === 1 && near(r.points[0].perHour, 6000); },
    M.minedSeries, h => ({ points: [{ perHour: 500 / ((h[1].t - h[0].t) / 3600) }] }));
check('a run without minedDtSec is skipped, not guessed', (r => r.points.length === 0 && r.skipped === 1)(M.minedSeries([{ t: 0, minedDelta: {} }, { t: 1800, minedDelta: { A: 5 } }])));
const os1 = M.ownerSeries(O, L.owners[0].p);
check('owner sparkline series length = owners.json rows', os1.n === (O[L.owners[0].p] || []).length, `${os1.n} point(s)`);

console.log('\n[7] Combat');
const hourSum = D.combat.hours.reduce((s, h) => s + h.fleet, 0);
const part24 = E.filter(e => e.k === 'combat' && e.t > L.generatedAt - 86400).length;
check('hourly columns sum to the combat participations of the last 24 h', hourSum === part24, `${hourSum} vs ${part24}`);
check('feed is newest first and holds no newFleet events', D.combat.feed.every((e, i, a) => (!i || a[i - 1].t >= e.t) && e.k !== 'newFleet'));
// a kill can produce a 'destroyed' event AND a combat event with dead:true for the same fleet
const kill = [{ k: 'destroyed', f: 'X', t: 5 }, { k: 'combat', f: 'X', t: 5, dead: true }, { k: 'combat', f: 'Y', t: 5, dead: false }];
ruleCheck('destroyed counts distinct fleets: one fleet with both a destroyed and a dead combat event = 1',
    df => df(kill).size === 1, M.destroyedFleets, evs => ({ size: evs.filter(e => e.k === 'destroyed' || e.dead).length }));
const killsReal = new Set(E.filter(e => e.t > L.generatedAt - 86400 && (e.k === 'destroyed' || (e.k === 'combat' && e.dead))).map(e => e.f)).size;
check('real data: 24 h destroyed = distinct fleets', D.combat.destroyed24 === killsReal, `${D.combat.destroyed24}`);
check('probable kills: gone after combat counted only when not already destroyed', M.probableKills([{ k: 'gone', f: 'X', afterCombat: true }, { k: 'gone', f: 'Z', afterCombat: true }, { k: 'gone', f: 'W', afterCombat: false }], new Set(['X'])).size === 1);
const V = (f, fa, npc, t, vs) => ({ k: 'combat', f, o: 'o' + f, fa, npc, t, x: 0, y: 0, vs: vs && vs.map(v => ({ f: v[0], o: 'o' + v[0], fa: v[1], npc: v[2], n: v[0] })), n: f });
const duel = [V('a', 'mud', 0, 10, [['b', 'unaligned', 4]]), V('b', 'unaligned', 4, 10, [['a', 'mud', 0]])];
ruleCheck('likely pairing from vs: a duel stamped on both sides counts ONCE as MUD-NPC',
    vp => { const r = vp(duel); return r.matrix.mud.npc === 1 && r.matrix.npc.mud === 1 && r.pairs === 1 && r.pairings.length === 1 && r.pairings[0].count === 1; },
    M.vsPairs, evs => { const r = M.vsPairs(evs.slice(0, 1)); r.matrix.mud.npc = 2; return r; });
// all NPC fleets share one owner profile: NPC vs NPC must not become an owner pairing "NPC vs NPC" / "X vs X"
const npcDuel = [V('n1', 'unaligned', 4, 30, [['n2', 'unaligned', 4]]), V('n2', 'unaligned', 4, 30, [['n1', 'unaligned', 4]])].map(e => ({ ...e, o: 'NPCPROFILE', vs: e.vs.map(v => ({ ...v, o: 'NPCPROFILE' })) }));
ruleCheck('same-owner pair (NPC vs NPC on the shared profile) is left out of owner pairings, still on the matrix diagonal',
    vp => { const r = vp(npcDuel); return r.pairings.length === 0 && r.selfPairs === 1 && r.matrix.npc.npc === 1; },
    M.vsPairs, evs => ({ pairings: [{ a: { o: 'NPCPROFILE' }, b: { o: 'NPCPROFILE' } }], selfPairs: 0, matrix: { npc: { npc: 1 } } }));
check('real data: no owner pairing has the same owner on both sides', D.combat.pairsAll.pairings.every(p => p.a.o !== p.b.o), `${D.combat.pairsAll.selfPairs} same-owner pair(s) left out`);
ruleCheck('fleets verdict formats the fleet count (1593 -> "1,593")',
    fv => { const v = fv(D.fleetsView); return D.fleetsView.n < 1000 || (v.includes(M.fmt(D.fleetsView.n, 0)) && !v.includes('<b>' + D.fleetsView.n + '</b>')); },
    M.fleetsVerdict, fl => `Of <b>${fl.n}</b> fleets`);
ruleCheck('engagements: the duel is 1 engagement; an unrelated fight in the same second with vs is a 2nd; seed events in one second group',
    en => en(duel) === 1 && en(duel.concat([V('c', 'oni', 0, 10, [['d', 'ustur', 0]]), V('d', 'ustur', 0, 10, [['c', 'oni', 0]])])) === 2 && en([V('s1', 'mud', 0, 20), V('s2', 'oni', 0, 20)]) === 1,
    M.engagements, evs => evs.filter(e => e.k === 'combat').length);
const destroyedState = L.fleets.filter(f => f.s.kind === 'destroyed').length;
check('destroyed list = fleets in the destroyed state', D.combat.destroyedNow.length === destroyedState, `${D.combat.destroyedNow.length}`);

console.log('\n[8] Verdicts are computed, not typed');
const topRes = Object.entries(K.resUps).sort((a, b) => b[1] - a[1])[0];
ruleCheck('mining verdict names the top resource and its share from resUps',
    mv => { const v = mv(D.mining); return v.includes(topRes[0]) && v.includes(M.pct(topRes[1] / K.galaxyUps)); }, M.miningVerdict,
    () => '<b>Hydrogen</b> is <b>12%</b> of output.');
// perturb the data: every verdict must move with it
const L2 = JSON.parse(JSON.stringify(L));
L2.fleets = L2.fleets.filter((f, i) => i % 3 !== 0);
L2.fleets.forEach(f => { if (f.mine) f.mine.out.forEach(q => { if (q.r === topRes[0]) q.ups *= 0.2; }); });
const D2 = build('all', L2, E.filter((e, i) => i % 2));
for (const k of Object.keys(D.verdicts)) check(`${k} verdict changes when the data changes`, D.verdicts[k] !== D2.verdicts[k]);
check('KPI strip changes when the data changes', ['fleets', 'ships', 'miningFleets', 'ups'].every(k => D.kpi[k] !== D2.kpi[k]));
const nums = s => (s.replace(/<[^>]+>/g, '').match(/[\d][\d,.]*[kMB%]?/g) || []).map(n => n.replace(/[.,]$/, ''));
const verdictNums = Object.values(D.verdicts).flatMap(nums);
const pool = new Set();
const add = v => { if (v == null || !isFinite(v)) return; pool.add(M.fmt(v)); pool.add(M.fmt(v, 0)); pool.add(M.pct(v)); pool.add(String(v)); };
[D.kpi, D.fleetsView, D.combat].forEach(o => Object.values(o).forEach(v => typeof v === 'number' && add(v)));
add(D.mining.ups); add(D.mining.miningFleets); add(D.mining.cFleets.forHalf); add(D.mining.cOwners.topShare); add(D.mining.resources[0].share);
add(D.fleetsView.mining / D.fleetsView.n); add(D.fleetsView.moving / D.fleetsView.n); add(D.fleetsView.parked / D.fleetsView.n); add(D.combat.npcPart24 / D.combat.part24); D.combat.pairs24.pairings.forEach(p => add(p.count));
Object.values(D.fleetsView.byGroup).forEach(b => { add(b.ships); add(b.fleets); });
D.players.forEach(o => { add(o.fleets); add(o.ships); });
const pl = D.players.length; add(pl); add(D.players.filter(o => o.fleets === 1).length / pl); add(D.players.filter(o => o.mining === 0).length / pl);
const untraced = verdictNums.filter(n => !pool.has(n) && !/^(10|24)$/.test(n));
check('every number in the four verdicts traces to a computed value (allowed literals: "top 10", "24 h"; suffix k/M/B kept)', !untraced.length, untraced.length ? 'untraced: ' + untraced.join(' ') : `${verdictNums.length} numbers traced`);

console.log('\n[9] Untrusted chain strings are escaped');
const evil = '<img src=x onerror=alert(1)>';
const m3 = { ...D.mining, resources: [{ r: evil, ups: 1, share: 1 }, ...D.mining.resources.slice(1)] };
ruleCheck('a resource name with HTML is escaped in the mining verdict', mv => { const v = mv(m3); return !v.includes('<img') && v.includes('&lt;img'); }, M.miningVerdict, m => `<b>${m.resources[0].r}</b>`);
check('shortAddr shortens a profile', M.shortAddr('GZKKAAVrZSWCdySeBTGFLGWr3pNRxr1uaRjbKaXiSrtG') === 'GZKK…iSrtG');


console.log('\n[10] Systems and bodies (bodies.json)');
const BJ = readJson('bodies.json', null);
if (!BJ || !Array.isArray(BJ.bodies)) console.log('  SKIP no Data/c4-live/bodies.json');
else {
    const I = M.indexBodies(BJ.bodies);
    check('index holds every body once', I.n === BJ.bodies.length, `${I.n} bodies`);
    // independent sums, written without the model's helpers
    const fleetsOn = a => L.fleets.filter(f => f.s.kind === 'mining' && f.s.asteroid === a);
    const outSum = fs_ => fs_.reduce((s, f) => s + (f.mine ? f.mine.out.reduce((t, q) => t + q.ups, 0) : 0), 0);
    ruleCheck('every asteroid: fleets mining it and u/s = independent sums = latest.asteroids[] (fleets, ups)',
        bb => L.asteroids.every(x => { const o = bb(L, I, x.a); const f = fleetsOn(x.a); return o && o.fleets.length === f.length && o.fleets.length === x.fleets && near(o.ups, outSum(f), 1e-6) && near(o.ups, x.ups, 1e-3); }),
        M.buildBody, (l, i, a) => { const o = M.buildBody(l, i, a); if (o && o.fleets) o.ups = o.fleets.reduce((s, x) => s + (x.f.mine.baseUps != null ? x.f.mine.baseUps : x.f.mine.ups / 2), 0); return o; });
    const planetsWithStakes = BJ.bodies.filter(b => b.k === 'planet' && b.stakes && b.stakes.length);
    ruleCheck(`every planet with stakes (${planetsWithStakes.length}): stake count = latest.stakes joined on body = bodies[].stakes`,
        bb => planetsWithStakes.every(b => { const o = bb(L, I, b.a); return o.stakes.length === L.stakes.filter(s => s.body === b.a).length && o.stakes.length === b.stakes.length; }),
        M.buildBody, (l, i, a) => { const o = M.buildBody(l, i, a); const b = i.byA.get(a); o.stakes = l.stakes.filter(s => s.sys === b.sys); return o; });
    // u/s, stakes and state totals per system (membership itself is checked against the scene in [11])
    ruleCheck(`every system (${L.systems.length}): u/s = its asteroids' ups; stakes = stakes in that system; states sum to the fleet count`,
        bs => L.systems.every(sys => { const v = bs(L, E, I, sys.a); const au = L.asteroids.filter(x => x.sys === sys.a).reduce((s, x) => s + x.ups, 0);
            return near(v.ups, au, 1e-3) && v.stakes.length === L.stakes.filter(s => s.sys === sys.a).length && Object.values(v.byState).reduce((a, b) => a + b, 0) === v.fleets.length; }),
        M.buildSystem, (l, e, i, a) => { const v = M.buildSystem(l, e, i, a); v.stakes = l.stakes.filter(s => s.o && s.sys !== a).slice(0, 1); return v; });
    const allSys = L.systems.map(sys => M.buildSystem(L, E, I, sys.a));
    check('systems partition the galaxy output: sum of system u/s = galaxyUps', near(allSys.reduce((s, v) => s + v.ups, 0), K.galaxyUps, 1e-3));
    check('every mining fleet belongs to exactly one system', allSys.reduce((s, v) => s + v.miners, 0) === L.fleets.filter(f => M.fleetUps(f) > 0).length);
    const inFlight = f => (f.s.kind === 'warp' || f.s.kind === 'subwarp') && M.restPoint(f, L.generatedAt - 120) === null;
    check('no transit still in flight is counted in any system', allSys.every(v => v.fleets.every(f => !inFlight(f))));
    check('no fleet is counted in two systems', (() => { const seen = new Set(); return allSys.every(v => v.fleets.every(f => !seen.has(f.a) && seen.add(f.a))); })());
    // verdict numbers trace to the computed object
    const traceV = (txt, vals, names) => { (names || []).forEach(n => { txt = txt.split(M.esc(n)).join(" "); }); const pool = new Set(); vals.forEach(v => { if (v == null || !isFinite(v)) return; pool.add(M.fmt(v)); pool.add(M.fmt(v, 0)); pool.add(M.pct(v)); pool.add(String(v)); }); return nums(txt).filter(n => !pool.has(n)); };
    const sample = allSys.filter(v => v.ups).slice(0, 15).concat(allSys.filter(v => !v.ups).slice(0, 5));
    const badS = sample.flatMap(v => traceV(v.verdict, [v.planets.length, v.asteroids.length, v.miners, v.ups, v.share, v.stakes.length, v.stakePlanets], [v.sys.n].concat(v.live.map(r => r.r))));
    check(`system verdict numbers trace to the system (${sample.length} systems)`, !badS.length, badS.slice(0, 5).join(' '));
    const bodiesS = BJ.bodies.filter(b => b.k === 'asteroid').slice(0, 40).concat(planetsWithStakes.slice(0, 20), BJ.bodies.filter(b => b.k === 'planet').slice(0, 20)).map(b => M.buildBody(L, I, b.a));
    const badB = bodiesS.flatMap(o => traceV(o.verdict, [o.res.length, o.res[0] && o.res[0].rich, o.fleets && o.fleets.length, o.owners, o.ups, o.share, o.mined, o.stakes && o.stakes.length, o.stakeOwners, o.buildings, o.crew], [o.name].concat(o.res.map(r => r.r))));
    check(`body verdict numbers trace to the body (${bodiesS.length} bodies)`, !badB.length, badB.slice(0, 5).join(' '));
    // chain strings escaped
    const evilB = { a: 'EVIL', id: 7, n: '<img src=x onerror=alert(1)>', k: 'asteroid', sys: 'S', res: [{ r: '<b>Ore', rich: 2, mined: 5 }] };
    const I2 = M.indexBodies([evilB]);
    ruleCheck('a body and resource name with HTML is escaped in the body verdict',
        bv => { const o = M.buildBody(L, I2, 'EVIL'); const v = bv(o); return !v.includes('<img') && v.includes('&lt;img') && !v.includes('<b>Ore'); },
        M.bodyVerdict, o => `Nobody mines <b>${o.name}</b>. Richest: ${o.res[0].r}`);
    check('system verdict escapes the system name', !M.systemVerdict({ sys: { n: '<script>x' }, planets: [], asteroids: [], ups: 0, stakes: [], live: [] }).includes('<script>'));
    // claim stake definition names (stakes[].defName / tier, collector 2026-11-06 23:15 EDT)
    ruleCheck('stake label: defName when present; "def N" fallback; "tier unknown (read failed)" when quality.stakeDefsFailed',
        sl => sl({ def: 3, defName: 'Claim Stake Tier 2' }, {}) === 'Claim Stake Tier 2' && sl({ def: 3, defName: null }, {}) === 'def 3'
            && sl({ def: 3, defName: null }, { stakeDefsFailed: true }) === 'def 3, tier unknown (read failed)',
        M.stakeLabel, k => `def ${k.def}`);
    const withName = L.stakes.filter(k => k.defName).length;
    check(`real data: stakes carry defName (${withName} of ${L.stakes.length}) and the label shows it`, L.stakes.every(k => !k.defName || M.stakeLabel(k, L.quality) === k.defName), JSON.stringify(L.stakes.reduce((m, k) => (m[k.defName || 'null'] = (m[k.defName || 'null'] || 0) + 1, m), {})));
    check('quality notes: bodiesFailed and stakeDefsFailed each produce a note', M.qualityNotes({ bodiesFailed: true }).length === 1 && /stake tiers are unknown/.test(M.qualityNotes({ stakeDefsFailed: true })[0]));
    // hover tip = the scene's bodyLabel facts
    const tipAst = M.buildBody(L, I, L.asteroids[0].a);
    const tipPl = M.buildBody(L, I, planetsWithStakes[0].a);
    ruleCheck('body hover tip: top 3 resources with richness; asteroid fleets + u/s; planet stake count',
        bt => { const a = bt(tipAst), p = bt(tipPl); const top3 = tipAst.res.slice(0, 3).map(r => `${r.r} x${r.rich}`).join(', ');
            return a[0] === tipAst.name && a.includes(top3) && a.some(l => l.startsWith(`${tipAst.fleets.length} fleet`) && l.includes(M.fmt(tipAst.ups) + ' u/s'))
                && p.some(l => l === `${tipPl.stakes.length} claim stake${tipPl.stakes.length === 1 ? '' : 's'}`); },
        M.bodyTip, o => [o.name, o.kind, 'click for resources']);
    check('body hover tip: an unmined asteroid says so', M.bodyTip(M.buildBody(L, I, BJ.bodies.find(b => b.k === 'asteroid' && !L.fleets.some(f => f.s.asteroid === b.a)).a)).includes('nobody mining'));
    ruleCheck('ship hint: shown with a filter at overview scale; hidden once zoomed in; never without a filter; shown with no scale reading',
        sh => { const T = M.SHIP_HINT_PX_PER_UNIT; return sh(true, T * 0.1) && !sh(true, T * 10) && !sh(false, T * 0.1) && !sh(false, null) && sh(true, null); },   // scale-relative (2026-11-08: the world scale moved the threshold 76.7 -> 718.75 px/unit)
        M.shipHintVisible, (f, px) => true);
    check('body images map to existing files', [...new Set(BJ.bodies.map(b => M.bodyImage(b, 128)))].every(f => fs.existsSync(path.join(ROOT, 'C4Live', f))));
}
// ---------------------------------------------------------------------------------------------------------------- [15]
// v5 (task #49, 2026-11-07): owner names, wallet chip, wealth range, Find by name - against the real collector files.
console.log('\n[15] Owner identity and wealth (owners[].name / wallet / holdings.refValue)');
if (!L.owners || !L.owners.some(o => o.name !== undefined)) console.log('  SKIP the snapshot predates owner names');
else (() => {
    let IDX, PL;
    try { IDX = M.ownerIndex(L); PL = L.owners.find(o => o.p.startsWith('6D19UB')); } catch (e) { check('v5 model exports ownerIndex / displayName / findOwners / wealthView', false, e.message); return; }
    check('positive control: profile 6D19UB... is in the snapshot with name and wallet', !!(PL && PL.name && PL.wallet), PL ? PL.name : 'missing');
    check('real data: 6D19UB... displays "L3V3L-X"', M.displayName(IDX.get(PL.p), PL.p).text === 'L3V3L-X', M.displayName(IDX.get(PL.p), PL.p).text);
    check('real data: the wallet chip shows "7RhX" = the first 4 of the WALLET, not of the profile', M.walletShort(PL.wallet) === '7RhX' && M.walletShort(PL.wallet) !== PL.p.slice(0, 4));
    const named = L.owners.filter(o => o.name);
    check(`real data: every named owner (${named.length}) displays its cleaned name (+ ellipsis when cut)`, named.every(o => M.displayName(o, o.p).text === M.cleanName(o.name) + (o.nameLen != null ? '…' : '')));
    check('real data: the owners verdict names the largest owner by NAME', (() => { const big = D.players.slice().sort((a, b) => b.ships - a.ships)[0]; return !big.name || D.verdicts.owners.includes(M.esc(M.cleanName(big.name))); })());
    ruleCheck('null name -> short profile address; a cut name -> ellipsis + truncated flag',
        dn => dn({ name: null }, 'AbCdEfGhIjKlMnOpQrStUvWxYz123456').text === M.shortAddr('AbCdEfGhIjKlMnOpQrStUvWxYz123456') && !dn({ name: null }, 'AbCdEfGhIjKlMnOpQrStUvWxYz123456').named
            && dn({ name: 'x'.repeat(32), nameLen: 40 }, 'P').text === 'x'.repeat(32) + '…' && dn({ name: 'x'.repeat(32), nameLen: 40 }, 'P').truncated && dn({ name: 'Ok' }, 'P').text === 'Ok',
        M.displayName,
        (rec, p) => ({ text: rec && rec.name ? String(rec.name) : String(rec && rec.name), named: !!(rec && rec.name), truncated: false }));   // mutant: "null" text, no ellipsis
    ruleCheck('names are cleaned: bidi overrides, zero-width and control characters are stripped, whitespace collapsed',
        cn => cn('‮ab​c⁦ \u0007 d﻿') === 'abc d' && cn(null) === '',
        M.cleanName, s => s == null ? '' : String(s).trim());
    const SYN = [{ p: 'p1', name: 'Bobcat', ships: 5 }, { p: 'p2', name: 'bob', ships: 1 }, { p: 'p3', name: 'Ann Bobby', ships: 99 }, { p: 'p4', name: 'BOB', ships: 3 }, { p: 'p5', name: null, ships: 50 }, { p: 'p6', name: 'Bobby', ships: 9 }];
    ruleCheck('Find by name: case-insensitive, exact > prefix > substring (then more ships); duplicates all listed',
        fo => JSON.stringify(fo(SYN, 'Bob').map(x => x.p)) === JSON.stringify(['p4', 'p2', 'p6', 'p1', 'p3']) && JSON.stringify(fo(SYN, 'bob').map(x => x.tier)) === JSON.stringify([0, 0, 1, 1, 2]) && fo(SYN, '').length === 0
            && fo(L.owners, 'l3v3l-x')[0].p === PL.p && fo(L.owners, 'l3v3l-x')[0].tier === 0,
        M.findOwners,
        (recs, q) => recs.filter(r => r.name && r.name.includes(q)).map(r => ({ p: r.p, name: r.name, tier: 0 })));   // mutant: case-sensitive, unranked
    const dups = (() => { const c = {}; for (const o of named) { const k = M.cleanName(o.name).toLowerCase(); (c[k] = c[k] || []).push(o.p); } return Object.entries(c).filter(e => e[1].length > 1); })();
    check(`real data: names are NOT unique (${dups.length} shared) and Find returns every holder of a shared name`, dups.length > 0 && dups.every(([k, ps]) => { const r = M.findOwners(L.owners, k).filter(x => x.tier === 0).map(x => x.p); return ps.every(p => r.includes(p)); }), dups.map(d => d[0]).join(', '));
    const withRef = L.owners.filter(o => o.holdings && o.holdings.refValue);
    const askBelow = withRef.filter(o => o.holdings.refValue.atAsk < o.holdings.refValue.atBid).length;
    ruleCheck(`wealth range = [min, max] of atBid/atAsk for all ${withRef.length} owners with a reference value (${askBelow} have atAsk < atBid)`,
        wv => withRef.every(o => { const v = wv(o, L), r = o.holdings.refValue; return v.range && v.range.lo === Math.min(r.atBid, r.atAsk) && v.range.hi === Math.max(r.atBid, r.atAsk) && v.range.priced === r.priced && v.range.lines === r.priced + r.unpriced; }) && askBelow > 0,
        M.wealthView,
        (o, l) => { const v = M.wealthView(o, l); const r = o.holdings.refValue; v.range = { ...v.range, lo: r.atBid, hi: r.atAsk }; return v; });   // mutant: bid = low end
    ruleCheck('wealth notes: stale prices and a failed price read are each said; a fresh pass says neither',
        wv => { const fresh = wv(PL, { ...L, ref: { ...L.ref, stale: false, pricesAt: L.generatedAt - 3600 }, quality: { ...L.quality, pricesFailed: false } });
            const stale = wv(PL, { ...L, ref: { ...L.ref, stale: true }, quality: { ...L.quality, pricesFailed: true } });
            const old = wv({ ...PL, holdings: { ...PL.holdings, refValue: { ...PL.holdings.refValue, pricesAt: L.generatedAt - 30 * 3600 } } }, { ...L, ref: { ...L.ref, stale: false } });
            return !fresh.notes.length && stale.notes.some(n => /stale/.test(n)) && stale.notes.some(n => /price read failed/.test(n)) && old.stale && /no mainnet market/.test(fresh.caveat) && fresh.caveat.includes(`${L.ref.match.cargo.matched} of ${L.ref.match.cargo.total} cargo`); },
        M.wealthView,
        (o, l) => { const v = M.wealthView(o, { ...l, ref: { ...l.ref, stale: false }, quality: {} }); return v; });   // mutant: ignores staleness
    check('wealth: an owner without holdings or refValue gets no range and a note (never a made-up number)', M.wealthView({ p: 'x' }, L) === null && (() => { const v = M.wealthView({ p: 'x', holdings: { atlas: 1, fleets: 1, ships: 1, hulls: {}, cargo: [] } }, L); return v.range === null && v.notes.length === 1 && M.rangeText(v.range) === '-'; })());
    ruleCheck('verdicts escape a hostile name (owners verdict)',
        ov => { const pl = D.players.map(o => ({ ...o })); pl.sort((a, b) => b.ships - a.ships)[0].name = '<img src=x onerror=alert(1)>'; const s = ov(pl, D.mining); return !s.includes('<img') && s.includes('&lt;img'); },
        M.ownersVerdict,
        (pl, m) => M.ownersVerdict(pl, m).replace(/&lt;/g, '<'));
})();

// [11] needs the scene's ES module, so the summary waits for it
(async () => {
    console.log('\n[11] System membership equals the scene (C4Live/scene-src/model.js systemMembers)');
    if (!BJ || !Array.isArray(BJ.bodies)) console.log('  SKIP no bodies.json');
    else {
        const SM = await import(require('url').pathToFileURL(path.join(ROOT, 'C4Live', 'scene-src', 'model.js')).href);
        // the scene's own call (main.js setData): finite fleets/systems, bodies with a and sys, settledBy = generatedAt - 120
        const sceneFleets = L.fleets.filter(f => f && f.s && Number.isFinite(f.x) && Number.isFinite(f.y));
        const sceneSystems = L.systems.filter(s => Number.isFinite(s.x) && Number.isFinite(s.y));
        const members = SM.systemMembers(sceneFleets, sceneSystems, BJ.bodies.filter(b => b && b.a && b.sys), L.generatedAt - 120);
        const sceneCount = a => { const m = members.get(a); return m ? m.docked.length + m.mining.length + m.cst.length + m.idle.length : 0; };
        const sceneSet = a => { const m = members.get(a); return new Set(m ? [...m.docked, ...m.mining, ...m.cst, ...m.idle].map(i => sceneFleets[i].a) : []); };
        const I3 = M.indexBodies(BJ.bodies);
        ruleCheck(`ALL ${L.systems.length} systems: panel fleet count AND fleet set = scene systemMembers`,
            bs => { const bad = L.systems.filter(sys => { const v = bs(L, E, I3, sys.a); const ss = sceneSet(sys.a); return v.fleets.length !== sceneCount(sys.a) || v.fleets.some(f => !ss.has(f.a)); }); if (bad.length) console.log('    systems that differ (printed for whichever implementation is under test, here or the mutant):', bad.length, bad.slice(0, 3).map(s => s.n)); return !bad.length; },
            M.buildSystem,
            (l, e, i, a) => {   // mutant: the old 0.05-box rule (parked only, warp never counted)
                const v = M.buildSystem(l, e, i, a); const sys = l.systems.find(x => x.a === a);
                v.fleets = l.fleets.filter(f => f.s.kind === 'docked' ? f.s.system === a : f.s.kind === 'mining' ? (i.byA.get(f.s.asteroid) || {}).sys === a
                    : ['idle', 'respawn', 'destroyed', 'claimStakeTransfer'].includes(f.s.kind) && Math.abs(f.x - sys.x) < 0.05 && Math.abs(f.y - sys.y) < 0.05);
                return v; });
        // [12] the ship hint threshold re-derived from the scene's own exports: the draw cutoff HULL_PX.collapse and the
        // medium hull's projected length per map unit (SHIP_BASE.galaxy x sizeScale x 2, the FLEET_VS formula)
        const hullPerUnit = (SM.SHIP_BASE ? SM.SHIP_BASE.galaxy : 1) * SM.sizeScale('medium') * 2;
        const derived = SM.HULL_PX.collapse / hullPerUnit;
        check('panel hull-length table = scene HULL_LEN (every class)', JSON.stringify(M.SHIP_HULL_LEN) === JSON.stringify(SM.HULL_LEN), Object.keys(SM.HULL_LEN).join(','));
        check('pxPerUnitFromHull inverts the scene size: a medium hull at exactly the cutoff reads the threshold', near(M.pxPerUnitFromHull(SM.HULL_PX.collapse, 'medium'), derived, 1e-9));
        check(`ship hint threshold = px/unit at which the scene first draws a medium hull (HULL_PX.collapse ${SM.HULL_PX.collapse} px, HULL_LEN.medium ${SM.HULL_LEN.medium})`, near(M.SHIP_HINT_PX_PER_UNIT, derived, 1e-9), `${M.SHIP_HINT_PX_PER_UNIT.toFixed(2)} vs ${derived.toFixed(2)}`);
        const ser = L.systems.find(s => s.n === 'Serene');
        if (ser) console.log(`    Serene: panel ${M.buildSystem(L, E, I3, ser.a).fleets.length}, scene ${sceneCount(ser.a)}`);
    }
    console.log('\n[13] Dock insets rule (M.coverInsets, v2 layout)');
    const VP = { left: 0, top: 0, right: 1600, bottom: 900 };
    const dockR = { left: 1600 - 12 - 440, right: 1588, top: 12, bottom: 888 }, kpiR = { left: 12, right: 1136, top: 12, bottom: 76 };
    ruleCheck('desktop: right = map right - dock left (452); top = KPI bottom (76); a wider open drawer wins (532); no left/bottom',
        ci => { const a = ci(VP, { dock: dockR, kpi: kpiR }), b = ci(VP, { dock: dockR, kpi: kpiR, drawer: { left: 1068, right: 1588, top: 12, bottom: 888 } });
            return a.right === 452 && a.top === 76 && a.left === 0 && a.bottom === 0 && b.right === 532; },
        M.coverInsets, (m, o) => ({ left: 0, right: o.dock.right - o.dock.left, top: o.kpi.bottom, bottom: 0 }));
    ruleCheck('phone sheet: the dock covers the BOTTOM (844 - 490 = 354), right stays 0; hidden parts (null) cover nothing',
        ci => { const a = ci({ left: 0, top: 0, right: 390, bottom: 844 }, { sheet: true, dock: { left: 0, right: 390, top: 490, bottom: 844 }, kpi: null }); return a.bottom === 354 && a.right === 0 && a.top === 0; },
        M.coverInsets, (m, o) => ({ left: 0, right: m.right - o.dock.left, top: 0, bottom: 0 }));
    // v3 `avoid`: HUD boxes in canvas-relative px (map offset subtracted), rounded outward, clipped, empty ones dropped
    ruleCheck('avoid rects: canvas-relative (map at 10,20), rounded outward, clipped to the map, empty and inverted boxes dropped',
        ci => { const a = ci({ left: 10, top: 20, right: 1610, bottom: 920 }, { dock: null, kpi: null, avoid: [{ left: 22.4, top: 107.6, right: 212.2, bottom: 392.1 }, { left: 1500, top: 900, right: 1700, bottom: 1000 }, { left: 5, top: 5, right: 5, bottom: 50 }, { left: 30, top: 30, right: 20, bottom: 40 }] }).avoid;
            return Array.isArray(a) && a.length === 2 && JSON.stringify(a[0]) === JSON.stringify({ left: 12, top: 87, right: 203, bottom: 373 }) && JSON.stringify(a[1]) === JSON.stringify({ left: 1490, top: 880, right: 1600, bottom: 900 }); },
        M.coverInsets, (m, o) => ({ ...M.coverInsets(m, o), avoid: (o.avoid || []).map(r => ({ left: Math.round(r.left), top: Math.round(r.top), right: Math.round(r.right), bottom: Math.round(r.bottom) })) }));
    ruleCheck('sameInsets sees an avoid-rect change (so a HUD resize reaches the scene)',
        si => { const a = { left: 0, right: 452, top: 76, bottom: 0, avoid: [{ left: 12, top: 87, right: 202, bottom: 372 }] }; return si(a, JSON.parse(JSON.stringify(a))) && !si(a, { ...a, avoid: [{ left: 12, top: 87, right: 202, bottom: 400 }] }) && !si(a, { ...a, avoid: [] }); },
        M.sameInsets, (a, b) => ['left', 'right', 'top', 'bottom'].every(k => a[k] === b[k]));

    console.log('\n[13b] Combat hot spots: nearest system within 1.2 units, else a 0.5-unit deep-space cell (shared rule with the map)');
    const SY = [{ a: 'A', n: 'Alpha', x: 0, y: 0 }, { a: 'B', n: 'Beta', x: 2, y: 0 }];
    const ce = (x, y, t, k, f, extra) => ({ k: k || 'combat', f: f || ('f' + x + y + t), x, y, t, ...(extra || {}) });
    const hsEv = [ce(0.9, 0, 990), ce(1.1, 0, 991), ce(0, 1.19, 992), ce(0, 1.3, 993), ce(0.1, 1.35, 994), ce(10, 10, 995, 'destroyed', 'K'), ce(10, 10, 995, 'combat', 'K', { dead: true }),
        ce(0, 0, -85400), ce(2, 0, 996, 'newFleet'), ce(2, 0, 997, 'gone', 'G1', { afterCombat: false }), ce(2, 0, 998, 'gone', 'G2', { afterCombat: true }), ce(2, 0.5, 999, 'starbaseCombat')];
    // independent statement of the rule, written without the model's helpers
    // v7: deep-space cells are named after the nearest system to the cell's mean point, any distance (lead pin)
    const expectHs = { Alpha: 2, Beta: 3, 'Deep space near Alpha': 2, 'Deep space near Beta': 1 };
    ruleCheck('synthetic: 0.9 -> Alpha, 1.1 -> Beta (nearest), 1.19 -> Alpha, 1.3 / 1.35 -> one deep-space cell "near Alpha"; a kill counts once; out-of-window, newFleet and quiet gone are ignored',
        hs => { const r = hs(SY, hsEv, 1000); const byName = o => JSON.stringify(Object.entries(o).sort((a, b) => a[0] < b[0] ? -1 : 1)); return r.length === 4 && byName(Object.fromEntries(r.map(h => [h.name, h.n]))) === byName(expectHs) && r[0].name === 'Beta' && r[0].sys === 'B' && r.find(h => h.name === 'Deep space near Alpha').sys === null; },
        M.combatHotSpots || (() => null),
        (sys, evs, ref) => {   // mutant: the v2 panel rule (per-cell counts named after the nearest system, any distance)
            const cells = new Map(); for (const e of evs) { if (e.t <= ref - 86400 || e.t > ref || !/^(combat|destroyed|starbaseCombat|captured)$/.test(e.k)) continue; const k = Math.round(e.x * 2) + ',' + Math.round(e.y * 2); const c = cells.get(k) || { x: e.x, y: e.y, n: 0 }; c.n++; cells.set(k, c); }
            return [...cells.values()].map(c => { const s = M.nearestSystem(sys, c.x, c.y); return { name: s.n, sys: s.a, n: c.n }; }).sort((a, b) => b.n - a.n); });
    // tie-break: an event exactly between two systems goes to the lower address, whatever the array order
    const TIE = [{ a: 'Z9', n: 'Zed', x: 2, y: 0 }, { a: 'A1', n: 'Ace', x: 0, y: 0 }];
    ruleCheck('tie: an event equidistant from two systems goes to the one whose address sorts lower (array order ignored)',
        hs => { const r1 = hs(TIE, [ce(1, 0, 999)], 1000), r2 = hs(TIE.slice().reverse(), [ce(1, 0, 999)], 1000); return r1.length === 1 && r1[0].sys === 'A1' && r2[0].sys === 'A1'; },
        M.combatHotSpots || (() => null),
        (sys, evs, ref) => { const s = sys[0]; return [{ sys: s.a, name: s.n, n: 1 }]; });   // mutant: first in array wins
    {   // real data: every system's 24 h count = an independent nearest-within-1.2 assignment of the event file
        const t0 = L.generatedAt, hot = e => /^(combat|destroyed|starbaseCombat|captured)$/.test(e.k) || (e.k === 'gone' && e.afterCombat === true);
        const seenKill = new Set(), bySys = new Map();
        for (const e of E) {
            if (!hot(e) || !(e.t > t0 - 86400 && e.t <= t0) || !Number.isFinite(e.x) || !Number.isFinite(e.y)) continue;
            if ((e.k === 'destroyed' || e.dead === true) && e.f) { if (seenKill.has(e.f)) continue; seenKill.add(e.f); }
            let best = null, bd = Infinity; for (const s of L.systems) { const d = Math.hypot(s.x - e.x, s.y - e.y); if (d < bd) { bd = d; best = s; } }
            if (best && bd < 1.2) bySys.set(best.n, (bySys.get(best.n) || 0) + 1);
        }
        const panel = (D.combat.hotSpots || []).filter(h => h.sys);
        const bad = panel.filter(h => bySys.get(h.name) !== h.n).concat([...bySys.keys()].filter(n => !panel.some(h => h.name === n)).map(n => ({ name: n, n: 'missing' })));
        const top = [...bySys.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
        check(`real data: panel hot-spot counts per system = an independent nearest-within-1.2 count (${bySys.size} systems); top ${top.map(x => x.join(' ')).join(', ')}`, panel.length > 0 && !bad.length, bad.slice(0, 3).map(b => `${b.name} ${b.n} vs ${bySys.get(b.name)}`).join('; '));
        const hs0 = (D.combat.hotSpots || [])[0];
        check('combat verdict / hottest spot = the top hot spot by that rule', !!hs0 && D.combat.hotCount === hs0.n && hs0.n === Math.max(...(D.combat.hotSpots || []).map(h => h.n)), hs0 ? `${hs0.name} ${hs0.n}` : 'no hotSpots');
    }
    await crossImplHotSpots();
    try { dacChecks(); } catch (e) { check('[16] DAC checks ran without throwing', false, String(e).split('\n')[0]); }

    await browserLayout();
    console.log(`\n${pass} passed, ${fail} failed${BREAK ? `  (C4_BREAK=${BREAK})` : ''}`);
    process.exit(fail ? 1 : 0);
})().catch(e => { console.log('FAIL [11-14] could not run: ' + (e && e.stack || e)); process.exit(1); });

// ---------------------------------------------------------------------------------------------------------------- [13c]
// Cross-implementation (reviewer P3-3, task #45): the panel's combatHotSpots and the scene's REAL combatSpots
// (C4Live/scene-src/model.js, imported as is) must give the same rows - key, name, n, last - in the same ORDER, for every
// filter, on the real Data/c4-live files and on a synthetic set built to hit ties, the 1.2 boundary and deep-space cells.
// The one tie order (lead rule 2026-11-07): n desc, then last desc, then key asc. Mutants are the real function's own
// source with one change each (so a mutant can never differ from the real code in some other, unintended way).
async function crossImplHotSpots() {
    console.log('\n[13c] Hot spots: panel combatHotSpots = the scene\'s own combatSpots, rows AND order, every filter');
    const scenePath = path.join(ROOT, 'C4Live', 'scene-src', 'model.js');
    const SM = await import(require('url').pathToFileURL(scenePath).href);
    const sceneHash = require('crypto').createHash('sha256').update(fs.readFileSync(scenePath)).digest('hex').slice(0, 8);
    const FILTERS = ['all', 'mud', 'oni', 'ustur', 'npc', 'unaligned'];
    const row = h => [h.key, h.name, h.n, h.last].join('|');
    const sceneRows = (sys, evs, ref, f) => SM.combatSpots(evs, sys, ref, 86400, f === 'all' ? null : f).map(row);
    // the panel path: the dock filters events by eventGroup first (buildCombat), then the shared rule
    const panelRows = (impl, sys, evs, ref, f) => impl(sys, evs.filter(e => f === 'all' || M.eventGroup(e) === f), ref).map(row);
    // synthetic: systems with upper- and lower-case addresses (code-unit order: 'A1' < 'B2' < 'a9' < 'deep:...' < 'zz')
    const SYS = [{ a: 'zz', n: 'Zulu', x: 20, y: 0 }, { a: 'B2', n: 'Bee', x: 10, y: 0 }, { a: 'a9', n: 'Ayn', x: 30, y: 0 }, { a: 'A1', n: 'Ace', x: 0, y: 0 }];
    const REF = 100000, T = 99990;
    let fid = 0;
    const ev = (x, y, t, extra) => ({ k: 'combat', f: 'F' + (fid++), x, y, t, ...(extra || {}) });
    const SYN = [
        ev(0, 0, T, { fa: 'mud' }), ev(0.5, 0, 99000, { fa: 'mud' }),                         // Ace: n2, last T
        ev(10, 0, T, { fa: 'oni' }), ev(11.19, 0, 98000, { fa: 'oni' }),                      // Bee: n2, last T (1.19 is inside)
        ev(20, 0, T, { fa: 'ustur' }), ev(20.1, 0, T, { k: 'destroyed', f: 'K', fa: 'ustur' }), ev(20.1, 0, T, { f: 'K', dead: true, fa: 'ustur' }),   // Zulu: n2 (a kill counts once)
        ev(30, 0, T, { npc: 1, fa: 'unaligned' }), ev(30.2, 0, T, { npc: 1, fa: 'unaligned' }),                                                         // Ayn: n2, NPC only
        ev(45.3, 0, T), ev(45.6, 0, T, { npc: 1, fa: 'unaligned' }),                         // deep:91,0 (Math.floor would split it: 90 / 91)
        ev(55.55, -3.7, T), ev(55.65, -3.7, T, { fa: 'mud' }),                               // deep:111,-7 "Deep space near Ayn" (v7 label: nearest system, any distance)
        ev(10, 1.2, 99500, { fa: 'oni' })                                                    // exactly 1.2 from Bee: NOT inside -> deep:20,2
    ];
    const EXPECT_ALL = ['A1|Ace|2|99990', 'B2|Bee|2|99990', 'a9|Ayn|2|99990', 'deep:111,-7|Deep space near Ayn|2|99990', 'deep:91,0|Deep space near Ayn|2|99990', 'zz|Zulu|2|99990', 'deep:20,2|Deep space near Bee|1|99500'];
    const sets = [['real data', L.systems, E, L.generatedAt], ['synthetic', SYS, SYN, REF]];
    // one call = every (data set, filter) pair; returns the list of mismatches for impl
    const mismatches = impl => {
        const bad = [];
        for (const [nm, sys, evs, ref] of sets) for (const f of FILTERS) {
            const a = panelRows(impl, sys, evs, ref, f), b = sceneRows(sys, evs, ref, f);
            if (JSON.stringify(a) !== JSON.stringify(b)) bad.push(`${nm}/${f}: panel [${a.slice(0, 4).join('; ')}] vs scene [${b.slice(0, 4).join('; ')}]`);
        }
        const all = panelRows(impl, SYS, SYN, REF, 'all');
        if (JSON.stringify(all) !== JSON.stringify(EXPECT_ALL)) bad.push(`synthetic/all vs the hand-written order: [${all.join('; ')}]`);
        return bad;
    };
    for (const [nm, sys, evs, ref] of sets) for (const f of FILTERS) {
        const a = panelRows(M.combatHotSpots, sys, evs, ref, f), b = sceneRows(sys, evs, ref, f);
        const firstDiff = a.findIndex((x, i) => x !== b[i]);
        check(`${nm} / ${f}: panel hot spots = scene combatSpots (model.js ${sceneHash}), ${a.length} rows, same order`, JSON.stringify(a) === JSON.stringify(b),
            firstDiff < 0 ? `lengths ${a.length} vs ${b.length}` : `row ${firstDiff}: panel ${a[firstDiff]} vs scene ${b[firstDiff]}`);
    }
    check('synthetic / all: the order is the hand-written one (n desc, last desc, key asc; 1.2 is outside; Math.round cells)', JSON.stringify(panelRows(M.combatHotSpots, SYS, SYN, REF, 'all')) === JSON.stringify(EXPECT_ALL), panelRows(M.combatHotSpots, SYS, SYN, REF, 'all').join('; '));
    // the dock's real path (buildCombat) = the function the check above tested
    check('real data: the dock\'s buildCombat hot spots = combatHotSpots on the filtered events, every filter',
        FILTERS.every(f => JSON.stringify(M.buildCombat(L, E, f).hotSpots.map(row)) === JSON.stringify(panelRows(M.combatHotSpots, L.systems, E, L.generatedAt, f))));
    // mutants of the real source
    const src = M.combatHotSpots.toString();
    const mk = (from, to) => { if (!src.includes(from)) throw new Error('mutation target missing: ' + from); return new Function('HOT_R2', 'isHotKind', 'DAY', 'hotOrder', 'deepSpaceName', 'return ' + src.split(from).join(to))(1.2 * 1.2, M.isHotKind, 86400, M.hotOrder, M.deepSpaceName); };
    const MUT = [
        ['reversed tie sort (key desc)', () => mk('.sort(hotOrder)', '.sort((a, b) => b.n - a.n || b.last - a.last || (a.key < b.key ? 1 : a.key > b.key ? -1 : 0))')],
        ['the v3 sort (n, last; no key tiebreak)', () => mk('.sort(hotOrder)', '.sort((a, b) => b.n - a.n || b.last - a.last)')],
        ['deep-cell key Math.floor', () => mk("'deep:' + Math.round(e.x * 2) + ',' + Math.round(e.y * 2)", "'deep:' + Math.floor(e.x * 2) + ',' + Math.floor(e.y * 2)")],
        ['deep-space name = the v6 coordinate dump', () => mk('deepSpaceName(sys, x, y)', '`Deep space ${Math.round(x)}, ${Math.round(y)}`')],
        ['1.2 boundary inclusive (<=)', () => mk('if (d < bd ||', 'if (d <= bd ||')]
    ];
    for (const [nm, make] of MUT) {
        let bad; try { bad = mismatches(make()); } catch (e) { bad = null; console.log('    mutant could not be built: ' + e.message); }
        check(`cross-implementation - negative control "${nm}": the mutant FAILS it`, !!bad && bad.length > 0, bad ? (bad.length ? `${bad.length} mismatches, e.g. ${bad[0].slice(0, 140)}` : 'mutant PASSED, the check is blind') : 'mutant missing');
    }
    // item 4: 'unaligned' never includes NPCs on the panel side (an NPC event carries fa 'unaligned' in the data)
    ruleCheck('unaligned filter: eventGroup puts every NPC event in "npc", never "unaligned" (synthetic: the unaligned player event is kept, both NPC events dropped)',
        eg => { const u = SYN.filter(e => eg(e) === 'unaligned'); return u.length === 2 && u.every(e => !e.npc) && SYN.filter(e => e.npc).every(e => eg(e) === 'npc'); },
        M.eventGroup, e => e.fa || 'unaligned');
    {
        const npcCombat = E.filter(e => e.npc && /^(combat|destroyed|starbaseCombat|captured|gone)$/.test(e.k)).length;
        const feed = M.buildCombat(L, E, 'unaligned').feed, npcFeed = M.buildCombat(L, E, 'npc').feed;
        check(`real data: the dock's "unaligned" combat holds no NPC event (${feed.length} events) while "npc" holds all ${npcCombat} NPC combat events (positive control)`,
            npcCombat > 0 && feed.every(e => !e.npc) && npcFeed.length === npcCombat && npcFeed.every(e => e.npc));
    }
}

// ---------------------------------------------------------------------------------------------------------------- [14]
// The v2 full-screen page in a real headless Chromium (the teardown skill's playwright; SKIP when absent or NO_BROWSER=1).
// The page's real index.html / app.js / c4.css / data are served from the repo. C4Live/c4-scene.js is replaced by a
// RECORDING STUB (window.__calls) so the scene contract calls the page makes can be read back; one extra pass loads
// the REAL scene bundle as a smoke test. Negative controls serve a mutated app.js / index.html (each mutation asserts
// its target text exists, so a mutant can never silently equal the real file) and the same check must FAIL on it.
async function browserLayout() {
    console.log('\n[14] Full-screen layout, dock and scene contract (headless Chromium)');
    if (process.env.NO_BROWSER) { console.log('  SKIP NO_BROWSER set'); return; }
    let chromium;
    try { chromium = require('module').createRequire(path.join(require('os').homedir(), '.claude/skills/teardown/node_modules/x.js'))('playwright').chromium; }
    catch (e) { console.log('  SKIP teardown skill playwright not installed'); return; }
    const http = require('http');
    const STUB = `window.__calls = [];
        window.C4Scene = { mount(el) { const h = {}; const rec = n => (...a) => { window.__calls.push([n, a.length && typeof a[0] !== 'object' || n === 'setInsets' || n === 'focusSystem' || n === 'setDacs' ? JSON.parse(JSON.stringify(a)) : []]); };
            window.__emit = (ev, v) => h[ev] && h[ev](v);
            return { on: (ev, fn) => { h[ev] = fn; }, setData: rec('setData'), setFilter: rec('setFilter'), setLayer: rec('setLayer'), focusOwner: rec('focusOwner'), focusPoint: rec('focusPoint'),
                focusSystem: rec('focusSystem'), pulseEvent: rec('pulseEvent'), dispose() {}, screenOf: () => null, setStatLayer: rec('setStatLayer'), setInsets: rec('setInsets'), setDacs: rec('setDacs') }; } };`;
    let mut = {};   // url path -> transform(text)
    const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
    let useStub = true;
    const mutErrors = [];
    let delay = {};   // url path -> ms the server waits before answering (the deep-link race: bundle after the data)
    let gone = {};    // url path -> true: answer 404 (DACs: a missing dacs.json)
    const server = http.createServer(async (q, r) => {
        const u = decodeURIComponent(q.url.split('?')[0]);
        if (delay[u]) await new Promise(ok => setTimeout(ok, delay[u]));
        if (gone[u]) { r.writeHead(404); r.end(); return; }
        if (useStub && u === '/C4Live/c4-scene.js') { r.writeHead(200, { 'content-type': 'text/javascript' }); r.end(STUB); return; }
        const pf = u.match(/^\/C4Live\/([^/]+)$/);
        const p = PAGE_DIR && pf && PAGE_FILES.includes(pf[1]) ? path.join(PAGE_DIR, pf[1]) : path.join(ROOT, u);
        if (!p.startsWith(ROOT) && !(PAGE_DIR && p.startsWith(PAGE_DIR))) { r.writeHead(403); r.end(); return; }
        fs.readFile(p, (e, b) => {
            if (e) { r.writeHead(404); r.end(); return; }
            // a mutation whose target text is missing must never crash the run or silently serve the real file:
            // it is recorded and reported as a FAIL at the end (with C4_PAGE_DIR, other code is under test: noted only)
            if (mut[u]) { try { b = Buffer.from(mut[u](b.toString('utf8'))); } catch (err) { if (!mutErrors.includes(u + ': ' + err.message)) mutErrors.push(u + ': ' + err.message); } }
            r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); r.end(b);
        });
    });
    await new Promise(ok => server.listen(0, '127.0.0.1', ok));
    const base = `http://127.0.0.1:${server.address().port}/C4Live/index.html`;
    const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
    const sleep = ms => new Promise(ok => setTimeout(ok, ms));
    const replaceOnce = (txt, from, to) => { if (!txt.includes(from)) throw new Error('mutation target missing: ' + from); return txt.split(from).join(to); };
    async function open(w, h, query, opts) {
        const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: (opts && opts.reducedMotion) || 'no-preference' });
        const page = await ctx.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(String(e)));
        if (opts && opts.init) await page.addInitScript(opts.init);   // v5: clipboard stubs
        // real bundle: keep a handle on the mounted scene (window.__scene) to read its getStats() - the page never exposes it
        if (!useStub) await page.addInitScript(() => { let v; Object.defineProperty(window, 'C4Scene', { configurable: true, get: () => v, set: x => { v = x; if (x && typeof x.mount === 'function') { const m = x.mount; x.mount = function () { const s = m.apply(this, arguments); window.__scene = s; return s; }; } } }); });
        await page.goto(base + (query || ''));
        await page.waitForFunction(() => document.querySelector('.c4-sec.active .c4-verdict') && (!window.C4Scene || (window.__calls ? window.__calls.some(c => c[0] === 'setData') : document.querySelector('#c4Map canvas'))), null, { timeout: 30000 });
        await sleep(1200);   // dock entrance spring + first insets settle
        return { page, ctx, errors };
    }
    // ------------------------------------------------------------------ v7 (task #55): the DAC conquest lens UI
    // Real (empty) list then the example: Colour by DAC, Power chips (multi-select, one always stays on), scope select, the
    // legend = M.dacConquest on the example assignment, the HUD switch; plus fix A (the example banner is opaque while the
    // dock scrolls under it). The stub records setDacs; every check has a mutant that must FAIL it.
    async function lensScenarios() {
        console.log('\n[17b] DAC conquest lens in the page (stub scene records setDacs)');
        const J = JSON.parse(fs.readFileSync(DAC_FILE, 'utf8'));
        const exD = M.resolveDacs(L, M.exampleDacs(L, M.parseDacs(J).dacs)).dacs;
        // on a start state without M.dacConquest (C4_PAGE_DIR) the expectations are empty, so every lens check FAILS
        // one by one and fix A still runs, instead of the whole browser section crashing
        const cq = (ms, sc) => typeof M.dacConquest === 'function' ? M.dacConquest(L, E, exD.map(d => ({ tag: d.tag, members: d.profiles })), ms, sc) : { systems: [], byDac: { NONE: -1 }, contested: -1 };
        const want = cq(['mining'], null);
        const topTag = Object.entries(want.byDac).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0][0];
        const wantScope = cq(['mining'], topTag);
        async function run(appMut, cssMut) {
            mut = {}; if (appMut) mut['/C4Live/app.js'] = appMut; if (cssMut) mut['/C4Live/c4.css'] = cssMut;
            const o = { steps: {}, errors: [] };
            const { page, ctx, errors } = await open(1600, 900, '?tab=dacs', { reducedMotion: 'reduce' });
            page.setDefaultTimeout(5000);
            const st = () => page.evaluate(() => {
                const calls = (window.__calls || []).filter(c => c[0] === 'setDacs'), last = calls.length ? calls[calls.length - 1][1][0] : null;
                const sec = document.getElementById('sec-dacs');
                const legend = sec ? [...sec.querySelectorAll('.c4-dac-legend li[data-dac-legend]')].map(li => [li.dataset.dacLegend, (li.querySelector('b') || {}).textContent, !!li.querySelector('b.c4-dacn.ex')]) : [];
                const hudOn = (document.querySelector('#c4Controls [data-dac-colour].on') || {}).dataset;
                return { lens: last && last.lens ? last.lens : null, example: last ? last.example : null, members: last ? last.dacs.reduce((s, d) => s + d.members.length, 0) : -1,
                    none: !!(sec && sec.querySelector('p.c4-dac-legend.none')), legend,
                    dockOn: [...(sec ? sec.querySelectorAll('[data-dac-colour].on, [data-dac-metric].on') : [])].map(b => b.dataset.dacColour || b.dataset.dacMetric),
                    hud: hudOn ? hudOn.dacColour : null, hudNote: (document.querySelector('#c4Controls .c4-hud-lensnote') || {}).textContent || '' };
            });
            try {
                o.steps.real0 = await st();
                await page.click('#sec-dacs [data-dac-colour="dac"]'); await sleep(250); o.steps.realOn = await st();
                await page.click('#sec-dacs [data-dac-metric="combat"]'); await sleep(200); o.steps.mc = await st();
                await page.click('#sec-dacs [data-dac-metric="mining"]'); await sleep(200); o.steps.c = await st();
                await page.click('#sec-dacs [data-dac-metric="combat"]'); await sleep(200); o.steps.cStill = await st();   // the last one stays on
                await page.click('#sec-dacs [data-dac-metric="mining"]'); await sleep(200);
                await page.click('#sec-dacs [data-dac-metric="combat"]'); await sleep(200); o.steps.m = await st();
                await page.click('#sec-dacs [data-dac-example]'); await sleep(400); o.steps.ex = await st();
                await page.selectOption('#sec-dacs [data-dac-scope]', topTag); await sleep(300); o.steps.scope = await st();
                await page.selectOption('#sec-dacs [data-dac-scope]', ''); await sleep(300);
                // fix A: scroll the dock 70 px; the sticky banner must be opaque with rows underneath it (positive control)
                o.banner = await page.evaluate(() => {
                    const body = document.getElementById('c4Main'); body.scrollTop = 70;
                    const b = document.querySelector('#sec-dacs .c4-dac-banner'); if (!b) return null;
                    const r = b.getBoundingClientRect(), bg = getComputedStyle(b).backgroundColor;
                    const m = bg.match(/rgba?\(([^)]+)\)/), parts = m ? m[1].split(',').map(Number) : [];
                    const alpha = parts.length === 4 ? parts[3] : 1;
                    const pts = [[0.2, 0.3], [0.5, 0.5], [0.8, 0.7]].map(([fx, fy]) => [r.left + r.width * fx, r.top + r.height * fy]);
                    const top = pts.every(([x, y]) => b.contains(document.elementFromPoint(x, y)));
                    const under = pts.some(([x, y]) => document.elementsFromPoint(x, y).some(e => !b.contains(e) && e.closest('#sec-dacs') && e !== document.getElementById('sec-dacs') && e.textContent.trim()));
                    return { scrollTop: body.scrollTop, alpha, top, under, bg };
                });
                await page.evaluate(() => { document.getElementById('c4Main').scrollTop = 0; });
                await page.click('#c4Controls [data-dac-colour="faction"]'); await sleep(250); o.steps.hudOff = await st();
            } catch (e) { o.errors.push('scenario stopped: ' + String(e).split('\n')[0]); }
            finally { o.errors = o.errors.concat(errors); await ctx.close(); mut = {}; }
            return o;
        }
        const legendOk = (lg, r, scope) => {
            const tags = Object.keys(r.byDac).filter(t => !scope || t === scope);
            const got = new Map(lg.map(x => [x[0], x]));
            return tags.every(t => got.has(t) && +got.get(t)[1] === r.byDac[t] && got.get(t)[2]) && (scope ? !got.has('contested') && lg.length === 1 : +got.get('contested')[1] === r.contested);
        };
        const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        const verdict = o => {
            const s = o.steps, bad = [];
            if (!s.real0 || !s.real0.lens || s.real0.lens.on !== false || !same(s.real0.lens.metrics, ['mining'])) bad.push('initial lens ' + JSON.stringify(s.real0 && s.real0.lens));
            if (!s.realOn || !s.realOn.lens || !s.realOn.lens.on || s.realOn.members !== 0 || !s.realOn.none || s.realOn.hud !== 'dac' || !/Mining/.test(s.realOn.hudNote)) bad.push('real ON ' + JSON.stringify(s.realOn || {}).slice(0, 160));
            if (!s.mc || !s.mc.lens || !same(s.mc.lens.metrics, ['mining', 'combat'])) bad.push('mining+combat ' + JSON.stringify(s.mc && s.mc.lens));
            if (!s.c || !s.c.lens || !same(s.c.lens.metrics, ['combat'])) bad.push('combat ' + JSON.stringify(s.c && s.c.lens));
            if (!s.cStill || !s.cStill.lens || !same(s.cStill.lens.metrics, ['combat'])) bad.push('last metric removable ' + JSON.stringify(s.cStill && s.cStill.lens));
            if (!s.m || !s.m.lens || !same(s.m.lens.metrics, ['mining'])) bad.push('back to mining ' + JSON.stringify(s.m && s.m.lens));
            if (!s.ex || !s.ex.lens || !s.ex.lens.on || s.ex.example !== true || !legendOk(s.ex.legend, want, null) || !/EXAMPLE/.test(s.ex.hudNote)) bad.push('example legend ' + String(JSON.stringify(s.ex && s.ex.legend)).slice(0, 200));
            if (!s.scope || !s.scope.lens || s.scope.lens.scope !== topTag || !legendOk(s.scope.legend, wantScope, topTag)) bad.push('scope ' + String(JSON.stringify(s.scope && [s.scope.lens, s.scope.legend])).slice(0, 200));
            if (!s.hudOff || !s.hudOff.lens || s.hudOff.lens.on !== false || !s.hudOff.dockOn.includes('faction')) bad.push('HUD switch off ' + JSON.stringify(s.hudOff && s.hudOff.lens));
            if (o.errors.length) bad.push('errors ' + o.errors[0]);
            return bad;
        };
        const R = await run();
        const b1 = verdict(R);
        check(`lens UI: Colour by Faction|DAC (dock + HUD), Power chips multi-select with one always on, scope select (${topTag}), legend = M.dacConquest on the example (${Object.values(want.byDac).reduce((a, b) => a + b, 0)} systems, ${want.contested} contested), real list -> "no members yet" and no members sent, setDacs carries lens`, !b1.length, b1.join(' | ').slice(0, 400));
        const bannerOk = b => !!b && b.scrollTop >= 70 && b.alpha === 1 && b.top && b.under;
        check('fix A: at dock scrollTop 70 the sticky example banner is OPAQUE (alpha 1) and on top, with dock rows under it (positive control)', bannerOk(R.banner), JSON.stringify(R.banner));
        const M1 = await run(t => replaceOnce(t, 'on: !!(d && L0.on)', 'on: false'));
        check('lens UI - negative control: setDacs without lens.on is caught', verdict(M1).length > 0, verdict(M1).slice(0, 2).join(' | ').slice(0, 200));
        const M2 = await run(t => replaceOnce(t, 'if (has && cur.length === 1) return;', ''));
        check('lens UI - negative control: removing the "one metric stays on" guard is caught', verdict(M2).length > 0, verdict(M2).slice(0, 2).join(' | ').slice(0, 200));
        const M3 = await run(t => replaceOnce(t, 'const c = dacConquestNow(), any', 'const c = { byDac: {}, contested: 0 }, any'));
        check('lens UI - negative control: a legend not computed by dacConquest is caught', verdict(M3).length > 0, verdict(M3).slice(0, 2).join(' | ').slice(0, 200));
        const M4 = await run(null, t => replaceOnce(t, 'background: #281804;', 'background: rgba(40, 24, 4, 0.92);'));
        check('fix A - negative control: the old 92 % alpha banner is caught', !bannerOk(M4.banner), JSON.stringify(M4.banner));
    }
    // v7 fixes B (wallet chip at rest), C (hull variant names), D (compact stopped chip), E (deep-space label in Hot spots)
    async function fixScenarios() {
        console.log('\n[17c] v7 fixes: wallet chip at rest, hull names, stopped chip, deep-space label');
        const nowS = Math.floor(Date.now() / 1000);
        const staleMut = t => { const j = JSON.parse(t); if (nowS - j.generatedAt < 3 * 3600) j.generatedAt = nowS - 4 * 3600; return JSON.stringify(j); };
        const hullOwner = L.owners.find(o => o.holdings && o.holdings.hulls && Object.keys(o.holdings.hulls).some(k => / Min Config$/.test(k) && o.holdings.hulls[k] > 0)
            && Object.entries(o.holdings.hulls).filter(e => e[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 8).some(e => / Min Config$/.test(e[0])));
        async function run(appMut, cssMut) {
            mut = { '/Data/c4-live/latest.json': staleMut }; if (appMut) mut['/C4Live/app.js'] = appMut; if (cssMut) mut['/C4Live/c4.css'] = cssMut;
            const o = { errors: [] };
            const { page, ctx, errors } = await open(1600, 900, '?tab=owners', { reducedMotion: 'reduce' });
            page.setDefaultTimeout(5000);
            try {
                await page.waitForSelector('#c4OwnerTable tr[data-owner]', { timeout: 10000 });
                await page.mouse.move(5, 450); await sleep(300);
                o.wal = await page.evaluate(() => {
                    const rows = [...document.querySelectorAll('#c4OwnerTable tr[data-owner]')].slice(0, 25), out = { n: 0, shown: 0, four: 0, overlap: 0 };
                    for (const r of rows) {
                        const w = r.querySelector('.c4-wal.row'); if (!w) continue; out.n++;
                        const cs = getComputedStyle(w), code = w.querySelector('code');
                        if (+cs.opacity >= 0.5 && cs.visibility !== 'hidden' && w.getClientRects().length) out.shown++;
                        if (code && code.textContent.length === 4 && w.dataset.copy && w.dataset.copy.length > 30) out.four++;
                        const fa = r.querySelector('td.c2 .c4-fa'); if (fa) { const a = fa.getBoundingClientRect(), b = w.getBoundingClientRect(); if (a.right > b.left + 1 && a.left < b.right && a.bottom > b.top && a.top < b.bottom) out.overlap++; }
                    }
                    return out;
                });
                // C: the hull owner's drawer
                if (hullOwner) { await page.evaluate(p => { const b = document.createElement('div'); b.dataset.owner = p; document.body.appendChild(b); b.click(); b.remove(); }, hullOwner.p); await sleep(600); }
                o.hulls = await page.evaluate(() => [...document.querySelectorAll('#c4Drawer .c4-hulls li')].map(li => { const l = li.querySelector('.l'); return { title: li.title, name: (li.querySelector('.c4-hn') || l).textContent.trim(), tag: (li.querySelector('.c4-hv') || {}).textContent || '', cut: l.scrollWidth > l.clientWidth + 1 }; }));
                await page.evaluate(() => { const x = document.querySelector('#c4Drawer [data-close]'); if (x) x.click(); }); await sleep(300);
                // D: the stopped chip
                o.age = await page.evaluate(() => { const b = document.getElementById('c4AgeBox'); const r = b.getBoundingClientRect(); const chip = b.querySelector('.c4-stopchip');
                    return { h: Math.round(r.height), w: Math.round(r.width), chip: chip ? chip.textContent.trim() : '', tip: (chip && chip.title) || '', detail: !!b.querySelector('.c4-stopdetail'), bg: getComputedStyle(chip || b).backgroundColor }; });
                if (o.age.chip) { await page.click('#c4AgeBox .c4-stopchip'); await sleep(200); o.ageOpen = await page.evaluate(() => (document.querySelector('#c4AgeBox .c4-stopdetail') || {}).textContent || ''); }
                // E: the Hot spots card
                await page.click('.c4-tab[data-tab="combat"]'); await sleep(500);
                o.hot = await page.evaluate(() => { const card = [...document.querySelectorAll('#sec-combat .c4-card, #sec-combat [class*="card"]')].find(c => /Hot spots/i.test(c.textContent)); return card ? card.textContent : document.getElementById('sec-combat').textContent; });
            } catch (e) { o.errors.push('scenario stopped: ' + String(e).split('\n')[0]); }
            finally { o.errors = o.errors.concat(errors); await ctx.close(); mut = {}; }
            return o;
        }
        const walOk = o => !!o.wal && o.wal.n > 5 && o.wal.shown === o.wal.n && o.wal.four === o.wal.n && o.wal.overlap === 0;
        const hullOk = o => !!o.hulls && o.hulls.length > 0 && o.hulls.every(h => !h.cut) && o.hulls.some(h => / Min Config$/.test(h.title) && h.tag && !/Config/.test(h.name) && h.title.startsWith(h.name));
        const ageOk = o => !!o.age && /Collector stopped/i.test(o.age.chip) && /npm run collect/.test(o.age.tip) && !o.age.detail && o.age.h <= 40 && /npm run collect/.test(o.ageOpen || '');
        const hotOk = o => typeof o.hot === 'string' && /Deep space near \S/.test(o.hot) && !/Deep space -?\d/.test(o.hot);
        const R = await run();
        check(`fix B: owners table - the wallet chip shows its first 4 characters AT REST (${R.wal ? R.wal.shown : 0}/${R.wal ? R.wal.n : 0} rows, opacity >= 0.5), copies the full wallet, never covers the faction label`, walOk(R), JSON.stringify(R.wal));
        check(`fix C: wealth hull mix - "... Min Config" shows a short name + a variant tag, nothing ellipsised, full name in the tooltip (${hullOwner ? 'owner ' + hullOwner.p.slice(0, 6) : 'NO OWNER with a Min Config hull'})`, !!hullOwner && hullOk(R), JSON.stringify((R.hulls || []).slice(0, 4)));
        check('fix D: collector stopped = a compact chip (box <= 40 px tall at 1600x900), instruction in the tooltip, opens on click', ageOk(R), JSON.stringify({ age: R.age, open: (R.ageOpen || '').slice(0, 60) }));
        check('fix E: the Hot spots card names deep-space spots "Deep space near <system>", never a coordinate dump', hotOk(R), (R.hot || '').slice(0, 160));
        check('v7 fixes page: no page errors', !R.errors.length, R.errors.slice(0, 2).join(' | '));
        const N1 = await run(null, t => replaceOnce(t, 'opacity: 0.72;', 'opacity: 0;'));
        check('fix B - negative control: the hover-only chip (opacity 0 at rest) is caught', !walOk(N1), JSON.stringify(N1.wal));
        const N2 = await run(t => replaceOnce(t, '${silIcon(c)}${hullCell(c)}', '${silIcon(c)}${esc(String(c).replace(/ Default Config$/, \'\'))}'));
        check('fix C - negative control: the v5 full config name is caught', !hullOk(N2), JSON.stringify((N2.hulls || []).slice(0, 2)));
    }
    // ------------------------------------------------------------------ v5 (task #49): names, wallet chip, wealth, Find, XSS
    // A COPY of latest.json is served with three owners rewritten: the top miner gets a HOSTILE name (an <img onerror>
    // plus a bidi override), the second loses its name (null -> short-address fallback), the third gets a name the
    // collector cut (nameLen 45); ref.stale + quality.pricesFailed are set. The real files on disk are never touched.
    async function identityScenarios() {
        const HOSTILE = '<img src=x onerror="window.__xss=1">‮evil';
        // the test's own cleaner (not the module's, so this section also runs - and fails per check - on a start state)
        const clean = s => String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f-\u009f؜​-‏‪-‮⁦-⁩﻿]/g, '').replace(/\s+/g, ' ').trim();
        const HOSTILE_SHOWN = clean(HOSTILE);   // bidi override stripped, the markup kept as TEXT
        const byUps = D.players.slice().sort((a, b) => b.ups - a.ups);
        const [hostP, nullP, cutP] = byUps.slice(0, 3).map(o => o.p);
        const PL = L.owners.find(o => o.p.startsWith('6D19UB'));
        const CUT = 'A truncated name of 32 chars ok';
        const dataMut = t => { const j = JSON.parse(t);
            for (const o of j.owners) { if (o.p === hostP) o.name = HOSTILE; if (o.p === nullP) { o.name = null; o.nameAt = null; } if (o.p === cutP) { o.name = CUT; o.nameLen = 45; } }
            j.ref = { ...(j.ref || {}), stale: true }; j.quality = { ...(j.quality || {}), pricesFailed: true };
            return JSON.stringify(j); };
        const STUB_CLIP = () => { window.__copied = []; Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async t => { window.__copied.push(t); } } }); };
        const NO_CLIP = () => { window.__exec = []; Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
            const orig = document.execCommand.bind(document); document.execCommand = (c, ...a) => { const el = document.activeElement; window.__exec.push([c, el && el.value != null ? el.value.slice(el.selectionStart, el.selectionEnd) : null]); return c === 'copy' ? true : orig(c, ...a); }; };
        const short = M.shortAddr;
        async function run(appMut, modelMut) {
            mut = { '/Data/c4-live/latest.json': dataMut }; if (appMut) mut['/C4Live/app.js'] = appMut; if (modelMut) mut['/C4Live/c4-ui-model.js'] = modelMut;
            // defaults so a page without the v5 UI (C4_PAGE_DIR start state) fails check by check instead of crashing
            const out = { table: {}, drawer: { worth: '', wealth: '' }, copied: { list: [] }, hostDrawer: {}, findDup: [], dupWant: [], xss: {}, errors: [] };
            const { page, ctx, errors } = await open(1600, 900, '?tab=owners', { init: STUB_CLIP });
            page.setDefaultTimeout(5000);
            try {
                await page.waitForSelector('#c4OwnerTable tr[data-owner]', { timeout: 10000 });
                out.table = await page.evaluate(([h, n, c]) => { const cell = p => { const b = document.querySelector(`#c4OwnerTable tr[data-owner="${p}"] td.c2 b`); return b ? { text: b.textContent, title: (b.querySelector('[title]') || {}).title || '' } : null; };
                    return { host: cell(h), nul: cell(n), cut: cell(c), wealthTh: !!document.querySelector('#c4OwnerTable th[data-sort="wealth"]') }; }, [hostP, nullP, cutP]);
                // Wealth sort: the first row is the player with the largest atBid
                await page.click('#c4OwnerTable th[data-sort="wealth"]'); await sleep(150);
                out.wealthFirst = await page.evaluate(() => { const r = document.querySelector('#c4OwnerTable tbody tr'); return r && r.dataset.owner; });
                // the leaderboard row's wallet chip (filter to the known player)
                await page.fill('#c4OwnerQ', 'l3v3l'); await sleep(400);
                out.rowChip = await page.evaluate(p => { const b = document.querySelector(`#c4OwnerTable tr[data-owner="${p}"] .c4-wal`); return b ? { code: b.querySelector('code').textContent, copy: b.dataset.copy } : null; }, PL.p);
                // drawer of the known player
                await page.click(`#c4OwnerTable tr[data-owner="${PL.p}"] td.c2 b`); await sleep(700);
                out.drawer = await page.evaluate(() => { const d = document.getElementById('c4Drawer'); const w = d.querySelector('#c4Worth b'); const chip = d.querySelector('.c4-ident .c4-wal');
                    return { name: (d.querySelector('h2 .c4-dname') || {}).textContent, prof: (d.querySelector('.c4-prof') || {}).textContent, chip: chip && chip.querySelector('code').textContent,
                        lo: w && +w.dataset.lo, hi: w && +w.dataset.hi, range: w && w.textContent, worth: (d.querySelector('#c4Worth') || {}).textContent || '', wealth: (d.querySelector('#c4Wealth') || {}).textContent || '' }; });
                await page.focus('#c4Drawer .c4-ident .c4-wal'); await page.keyboard.press('Enter'); await sleep(300);
                out.copied = await page.evaluate(() => ({ list: window.__copied.slice(), toast: (document.getElementById('c4Toast') || {}).textContent || '', show: !!(document.getElementById('c4Toast') || { classList: { contains: () => false } }).classList.contains('show') }));
                // the hostile owner's drawer
                await page.evaluate(p => { document.querySelector('#c4Drawer [data-close]').click(); }, null); await sleep(300);
                await page.fill('#c4Find', 'ONERROR'); await page.press('#c4Find', 'Enter'); await sleep(700);
                out.hostDrawer = await page.evaluate(() => { const d = document.getElementById('c4Drawer'); return { open: d.classList.contains('open'), name: (d.querySelector('h2 .c4-dname') || {}).textContent }; });
                // Find by name: exact (case-insensitive) opens; a duplicated name lists all; a profile address still works
                await page.fill('#c4Find', 'l3v3l-x'); await page.press('#c4Find', 'Enter'); await sleep(600);
                out.findExact = await page.evaluate(() => (document.querySelector('#c4Drawer h2 .c4-dname') || {}).textContent);
                const dup = (() => { const c = {}; for (const o of L.owners) if (o.name) { const k = clean(o.name).toLowerCase(); (c[k] = c[k] || []).push(o.p); } return Object.entries(c).find(e => e[1].length > 1); })();
                await page.fill('#c4Find', dup ? dup[0].toUpperCase() : 'zzzz'); await page.press('#c4Find', 'Enter'); await sleep(300);
                out.findDup = await page.evaluate(() => [...document.querySelectorAll('#c4FindMsg button[data-owner]')].map(b => b.dataset.owner));
                out.dupWant = dup ? dup[1].slice().sort() : [];
                out.xss = await page.evaluate(() => ({ flag: window.__xss === 1, imgs: document.querySelectorAll('img[src="x"]').length, rtl: document.body.innerHTML.includes('‮') }));
                out.errors = errors.slice();
            } catch (e) { out.errors = errors.concat('scenario stopped: ' + String(e).split('\n')[0]); }
            finally { await ctx.close(); mut = {}; }
            return out;
        }
        const R = await run();
        const sortedBid = D.players.filter(o => o.refBid != null).sort((a, b) => b.refBid - a.refBid)[0];
        check('v5 owners table: a null name falls back to the short profile address', R.table.nul && R.table.nul.text === short(nullP) && R.table.nul.title.includes(nullP), JSON.stringify(R.table.nul));
        check('v5 owners table: a cut name ends in an ellipsis and its tooltip carries the full profile address', R.table.cut && R.table.cut.text === CUT + '…' && R.table.cut.title.includes(cutP), JSON.stringify(R.table.cut));
        const xssOk = r => r.table.host && r.table.host.text === HOSTILE_SHOWN && r.hostDrawer.name === HOSTILE_SHOWN && !r.xss.flag && !r.xss.imgs && !r.xss.rtl;
        check('v5 XSS: a hostile name (<img onerror> + bidi override) renders as TEXT in the table, the drawer and via Find; no element, no handler run, override stripped', xssOk(R), JSON.stringify({ t: R.table.host, d: R.hostDrawer, x: R.xss }));
        check('v5 Wealth column sorts by the mainnet reference at best bids', R.table.wealthTh && R.wealthFirst === (sortedBid && sortedBid.p), `${R.wealthFirst} vs ${sortedBid && sortedBid.p}`);
        check('v5 leaderboard row: wallet chip "7RhX" copies the FULL wallet', R.rowChip && R.rowChip.code === '7RhX' && R.rowChip.copy === PL.wallet, JSON.stringify(R.rowChip));
        check(`v5 drawer: 6D19UB... is "L3V3L-X" with the short profile address under it and wallet chip 7RhX`, R.drawer.name === 'L3V3L-X' && R.drawer.prof === short(PL.p) && R.drawer.chip === '7RhX', JSON.stringify({ n: R.drawer.name, p: R.drawer.prof, c: R.drawer.chip }));
        check('v5 copy (keyboard Enter on the chip): navigator.clipboard got the FULL wallet and a "Copied" toast shows', R.copied.list.length === 1 && R.copied.list[0] === PL.wallet && /^Copied/.test(R.copied.toast) && R.copied.show, JSON.stringify(R.copied));
        const rv = PL.holdings.refValue;
        check('v5 wealth range = min/max of the data\'s atBid and atAsk, labelled mainnet reference with priced N of M', R.drawer.lo === Math.min(rv.atBid, rv.atAsk) && R.drawer.hi === Math.max(rv.atBid, rv.atAsk) && R.drawer.range === `${M.fmt(Math.min(rv.atBid, rv.atAsk), 0)} - ${M.fmt(Math.max(rv.atBid, rv.atAsk), 0)} ATLAS` && R.drawer.worth.includes(`mainnet reference, priced ${rv.priced} of ${rv.priced + rv.unpriced} line`), `${R.drawer.range} | ${R.drawer.worth.replace(/\s+/g, ' ').slice(0, 160)}`);
        check('v5 wealth: stale prices and a failed price read are each said, plus the mainnet caveat with the match rates', /stale/.test(R.drawer.wealth) && /price read failed/.test(R.drawer.wealth) && R.drawer.wealth.includes(`${L.ref.match.hulls.matched} of ${L.ref.match.hulls.total} hull configs`) && /no mainnet market/.test(R.drawer.wealth), R.drawer.wealth.replace(/\s+/g, ' ').slice(0, 200));
        check('v5 Find: "l3v3l-x" (case-insensitive exact name) opens L3V3L-X', R.findExact === 'L3V3L-X', R.findExact);
        check('v5 Find: a name two players share lists BOTH owners (no silent pick)', R.dupWant.length >= 2 && R.findDup.length >= 2 && R.dupWant.every(p => R.findDup.includes(p)), `${R.findDup.length} listed, want ${R.dupWant.length}`);
        check('v5 page: no page errors', !R.errors.length, R.errors.slice(0, 2).join(' | '));
        // negative controls: the same checks against mutants must FAIL
        const R1 = await run(t => replaceOnce(t, '${esc(d.text)}</span>`; };', '${d.text}</span>`; };'));
        check('v5 XSS - negative control: an ownerLabel without esc() lets the hostile name create an element (check FAILS)', !xssOk(R1), JSON.stringify(R1.xss));
        const R2 = await run(t => replaceOnce(t, 'class="c4-wal${inRow ? \' row\' : \'\'}" data-copy="${esc(w)}"', 'class="c4-wal${inRow ? \' row\' : \'\'}" data-copy="${esc(s)}"'));
        check('v5 copy - negative control: a chip that copies only the 4 shown characters is caught', !(R2.copied.list[0] === PL.wallet), JSON.stringify(R2.copied.list));
        // fallback path: no Clipboard API -> select + execCommand('copy') gets the full wallet, toast still says Copied
        mut = { '/Data/c4-live/latest.json': dataMut };
        const fb = await (async () => { const { page, ctx } = await open(1600, 900, `?owner=${PL.p}`, { init: NO_CLIP });
            try { page.setDefaultTimeout(5000); await sleep(500); await page.click('#c4Drawer .c4-ident .c4-wal'); await sleep(300);
                return await page.evaluate(() => ({ exec: window.__exec, toast: (document.getElementById('c4Toast') || {}).textContent || '', focus: document.activeElement && document.activeElement.className })); }
            catch (e) { return { exec: [], toast: '', focus: '', err: String(e).split('\n')[0] }; }
            finally { await ctx.close(); mut = {}; } })();
        check('v5 copy fallback (no Clipboard API): select + execCommand copies the FULL wallet, toast "Copied", focus back on the chip', fb.exec.some(e => e[0] === 'copy' && e[1] === PL.wallet) && /^Copied/.test(fb.toast) && /c4-wal/.test(fb.focus), JSON.stringify(fb));
    }
    const lastCall = (page, name) => page.evaluate(n => { const c = (window.__calls || []).filter(x => x[0] === n); return c.length ? c[c.length - 1][1] : null; }, name);
    const geom = page => page.evaluate(() => {
        const r = el => { const b = el.getBoundingClientRect(); return { left: Math.round(b.left), right: Math.round(b.right), top: Math.round(b.top), bottom: Math.round(b.bottom) }; };
        window.scrollTo(0, 99999);
        return { iw: innerWidth, ih: innerHeight, sh: document.documentElement.scrollHeight, bsh: document.body.scrollHeight, sy: window.scrollY,
            map: r(document.getElementById('c4Map')), dock: r(document.getElementById('c4Dock')), kpi: r(document.getElementById('c4Kpis')),
            drawerOpen: document.getElementById('c4Drawer').classList.contains('open'), drawer: r(document.getElementById('c4Drawer')),
            hud: [...document.querySelectorAll('#c4Controls > .c4-glass, .c4-brand, #c4Age > .c4-age, .c4-shiphint.show')].filter(e => e.getClientRects().length).map(e => { const b = e.getBoundingClientRect(); return [Math.floor(b.left), Math.floor(b.top), Math.ceil(b.right), Math.ceil(b.bottom)].join(); }).sort() };
    });
    const fullScreenOk = g => g.sh === g.ih && g.bsh <= g.ih && g.sy === 0 && g.map.left === 0 && g.map.top === 0 && g.map.right === g.iw && g.map.bottom === g.ih;
    // the insets the scene was last told = the dock / KPI geometry measured on the page now
    const insetsMatch = (ins, g) => !!ins && ins[0] && Math.abs(ins[0].right - (g.iw - Math.min(g.dock.left, g.drawerOpen ? g.drawer.left : 1e9))) <= 1 && Math.abs(ins[0].top - g.kpi.bottom) <= 1 && ins[0].left === 0 && ins[0].bottom === 0;
    async function dockScenario() {   // returns {ok, detail}: insets correct expanded, after D (rail), after D again
        const { page, ctx, errors } = await open(1280, 720);
        try {
            const out = [];
            let g = await geom(page); out.push(['expanded', await lastCall(page, 'setInsets'), g]);
            await page.keyboard.press('d'); await sleep(1100);
            g = await geom(page); out.push(['collapsed', await lastCall(page, 'setInsets'), g]);
            await page.keyboard.press('d'); await sleep(1100);
            g = await geom(page); out.push(['expanded again', await lastCall(page, 'setInsets'), g]);
            const railW = out[1][2].dock.right - out[1][2].dock.left;
            // v3: the avoid rects told must be where the HUD boxes are NOW (they move with the KPI bar height)
            const toldAvoid = ins => ins && ins[0] && Array.isArray(ins[0].avoid) ? ins[0].avoid.map(r => [r.left, r.top, r.right, r.bottom].join()).sort() : null;
            const avoidOk = out.every(([, ins, gg]) => JSON.stringify(toldAvoid(ins)) === JSON.stringify(gg.hud));
            const avoidDetail = out.map(([n, ins, gg]) => `${n}: HUD ${gg.hud.join(' ')} / told ${(toldAvoid(ins) || ['none']).join(' ')}`).join('; ');
            const ok = out.every(([, ins, gg]) => insetsMatch(ins, gg)) && railW < 80 && out[0][1][0].right > 400 && out[1][1][0].right < 90 && !errors.length;
            return { ok, avoidOk, avoidDetail, detail: out.map(([n, ins, gg]) => `${n}: told ${ins ? JSON.stringify(ins[0]) : 'nothing'} / dock left ${gg.dock.left} of ${gg.iw}`).join('; ') + (errors.length ? ' ERR ' + errors[0] : '') };
        } finally { await ctx.close(); }
    }
    async function statScenario(query, expectFirst) {   // setStatLayer = active tab at mount, then follows tab clicks
        const { page, ctx } = await open(1600, 900, query);
        try {
            const first = await lastCall(page, 'setStatLayer');
            await page.click('.c4-tab[data-tab="combat"]'); await sleep(300);
            const second = await lastCall(page, 'setStatLayer');
            await page.click('.c4-tab[data-tab="owners"]'); await sleep(300);
            const third = await lastCall(page, 'setStatLayer');
            const ok = !!first && first[0] === expectFirst && second && second[0] === 'combat' && third && third[0] === 'owners';
            return { ok, detail: `mount ${JSON.stringify(first)}, Combat click ${JSON.stringify(second)}, Owners click ${JSON.stringify(third)}` };
        } finally { await ctx.close(); }
    }
    try {
        // full screen at the two acceptance sizes
        for (const [w, h] of [[1600, 900], [1280, 720]]) {
            const { page, ctx, errors } = await open(w, h);
            const g = await geom(page);
            check(`${w}x${h}: document scroll height = viewport height, page does not scroll, map fills the viewport`, fullScreenOk(g), `scrollHeight ${g.sh}, body ${g.bsh}, scrollY ${g.sy}, map ${JSON.stringify(g.map)}`);
            check(`${w}x${h}: dock on the right inside the viewport (${g.dock.right - g.dock.left} px wide), KPI bar clear of it`, g.dock.right <= w && g.dock.left > w / 2 && g.kpi.right <= g.dock.left && g.dock.bottom <= h, `dock ${JSON.stringify(g.dock)}, kpi ${JSON.stringify(g.kpi)}`);
            const ins = await lastCall(page, 'setInsets');
            check(`${w}x${h}: scene told the covered area = measured dock + KPI geometry`, insetsMatch(ins, g), JSON.stringify(ins && ins[0]));
            check(`${w}x${h}: no page errors`, !errors.length, errors.slice(0, 2).join(' | '));
            await ctx.close();
        }
        {   // negative: the v1 structure (analytics below the map, in page flow) must fail the full-screen check
            mut = { '/C4Live/index.html': t => replaceOnce(replaceOnce(t, '<html lang="en" class="c4-full">', '<html lang="en">'), '<div class="c4-tip" id="c4Tip" hidden></div>\n    </div>', '<div class="c4-tip" id="c4Tip" hidden></div>\n    </div><main style="padding-top:100vh">below the fold</main>') };
            const { page, ctx } = await open(1280, 720); const g = await geom(page); await ctx.close(); mut = {};
            check('full-screen check - negative control: a page with content below the map FAILS it', !fullScreenOk(g), `scrollHeight ${g.sh} vs ${g.ih}`);
        }
        // dock collapse / expand keeps the scene's insets equal to the geometry
        const d1 = await dockScenario();
        check('dock: D collapses to a rail and D expands it; setInsets follows each change (1280x720)', d1.ok, d1.detail);
        check('dock (v3): after each collapse / expand the avoid rects told = where the HUD boxes are now (they move with the KPI bar)', d1.avoidOk, d1.avoidDetail);
        mut = { '/C4Live/app.js': t => replaceOnce(t, 'try { S.scene.setInsets(ins); }', 'try { /* removed */ }') };
        const d2 = await dockScenario(); mut = {};
        check('dock insets - negative control: with the setInsets call removed the check FAILS', !d2.ok, d2.detail.slice(0, 160));
        // stat layer follows the tab
        const s1 = await statScenario('', 'mining');
        check('setStatLayer: "mining" at mount, then "combat", "owners" on tab clicks', s1.ok, s1.detail);
        const s2 = await statScenario('?tab=fleets', 'fleets');
        check('setStatLayer: a ?tab=fleets deep link reaches the scene as "fleets"', s2.ok, s2.detail);
        mut = { '/C4Live/app.js': t => replaceOnce(t, 'S.scene.setStatLayer(M.STAT_TABS', 'void (M.STAT_TABS') };
        const s3 = await statScenario('', 'mining'); mut = {};
        check('setStatLayer - negative control: with the call removed the check FAILS', !s3.ok, s3.detail);
        {   // system view in the dock, drawer over the dock, deep links
            const L0 = JSON.parse(fs.readFileSync(path.join(DIR, 'latest.json'), 'utf8'));
            const sys = L0.systems.find(s => s.f) || L0.systems[0];
            const owner = (L0.owners[0] || {}).p;
            const { page, ctx, errors } = await open(1600, 900, `?owner=${encodeURIComponent(owner)}`);
            let g = await geom(page);
            const ownerShown = await page.evaluate(() => document.getElementById('c4Drawer').textContent.includes('Fleets'));
            const centreX = (g.iw - Math.max(0, g.iw - g.dock.left)) / 2;
            check('?owner= deep link opens the owner drawer OVER the dock: map centre of the open area stays uncovered', g.drawerOpen && ownerShown && g.drawer.left > centreX && g.drawer.right <= g.iw, `drawer ${JSON.stringify(g.drawer)}, open-area centre x ${centreX}`);
            check('drawer open: scene insets cover the drawer too', insetsMatch(await lastCall(page, 'setInsets'), g), JSON.stringify((await lastCall(page, 'setInsets') || [])[0]));
            await page.keyboard.press('Escape'); await sleep(700);
            await page.evaluate(a => window.__emit('systemView', { sys: a }), sys.a); await sleep(900);
            await page.click('.c4-tab-sys'); await sleep(500);   // 2026-11-08: a scene entry no longer opens the dock view by itself
            const sv = await page.evaluate(() => { const p = document.getElementById('c4SysPanel'), t = document.querySelector('.c4-tab-sys'); return { inDock: !!p.closest('#c4Dock'), visible: !p.hidden && p.classList.contains('active') && p.getBoundingClientRect().height > 50, tab: !t.hidden && t.classList.contains('active'), name: t.textContent.trim(), others: [...document.querySelectorAll('.c4-sec.active')].length }; });
            check('scene systemView adds the System tab; clicking it shows the system as a dock view (active, the only visible section)', sv.inDock && sv.visible && sv.tab && sv.others === 1 && sv.name === sys.n, JSON.stringify(sv));
            await page.click('.c4-tab[data-tab="combat"]'); await sleep(400);
            const sw = await page.evaluate(() => ({ combat: document.getElementById('sec-combat').classList.contains('active'), sysTab: !document.querySelector('.c4-tab-sys').hidden }));
            await page.click('.c4-tab-sys'); await sleep(400);
            const back = await page.evaluate(() => document.getElementById('c4SysPanel').classList.contains('active'));
            check('while in a system: a data tab can be read and the System tab brings the system back', sw.combat && sw.sysTab && back, JSON.stringify({ ...sw, back }));
            await page.click('#c4SysPanel [data-galaxy]'); await sleep(500);
            const gone = await page.evaluate(() => ({ tab: document.querySelector('.c4-tab-sys').hidden, active: [...document.querySelectorAll('.c4-sec.active')].map(s => s.id) }));
            const fs1 = await lastCall(page, 'focusSystem');
            check('Back to galaxy: system tab removed, the data tab returns, scene focusSystem(null)', gone.tab && gone.active.join() === 'sec-combat' && fs1 && fs1[0] === null, JSON.stringify({ ...gone, fs1 }));
            check('no page errors in the system / drawer pass', !errors.length, errors.slice(0, 2).join(' | '));
            await ctx.close();
        }
        {   // 2026-11-08 owner: "I am still seeing a transition" (after the same-pane scene, #56). A wheel zoom into a system
            // (the scene's systemView event) must leave the page still: the dock keeps its open/collapsed state and its active
            // section, the scene gets NO new setInsets (a dock width change shifts the whole map via setViewOffset), and only
            // the System tab appears (pulsed). Collapsed and open dock; leaving the system also changes nothing.
            const L0 = JSON.parse(fs.readFileSync(path.join(DIR, 'latest.json'), 'utf8'));
            const sysS = L0.systems.find(s => s.f) || L0.systems[0];
            const still = async (collapsed) => {
                const { page, ctx, errors } = await open(1600, 900);
                try {
                    if (collapsed) { await page.evaluate(() => localStorage.setItem('c4.dock.collapsed', '1')); await page.reload(); await page.waitForFunction(() => window.__calls && window.__calls.some(c => c[0] === 'setData'), null, { timeout: 30000 }); await sleep(1500); }
                    const snap = () => page.evaluate(() => ({ collapsed: document.getElementById('c4Dock').classList.contains('collapsed'), active: [...document.querySelectorAll('.c4-sec.active')].map(s => s.id).join(), insets: window.__calls.filter(c => c[0] === 'setInsets').length, dockW: Math.round(document.getElementById('c4Dock').getBoundingClientRect().width), sysTab: !document.querySelector('.c4-tab-sys').hidden, pulse: document.querySelector('.c4-tab-sys').classList.contains('pulse') }));
                    const before = await snap();
                    await page.evaluate(a => window.__emit('systemView', { sys: a }), sysS.a); await sleep(1100);
                    const inside = await snap();
                    await page.evaluate(() => window.__emit('systemView', null)); await sleep(900);
                    const after = await snap();
                    const same = (x) => x.collapsed === before.collapsed && x.active === before.active && x.insets === before.insets && x.dockW === before.dockW;
                    return { ok: same(inside) && same(after) && inside.sysTab && inside.pulse && after.sysTab && !errors.length, detail: JSON.stringify({ before, inside, after }) + (errors.length ? ' ERR ' + errors[0] : '') };
                } finally { await ctx.close(); }
            };
            for (const c of [false, true]) { const r = await still(c); check(`seamless: a scene system entry + exit leaves the page still (dock ${c ? 'collapsed' : 'open'}: same state, same section, no setInsets, same width; System tab appears pulsed and keeps the last system after the exit)`, r.ok, r.detail); }
            mut = { '/C4Live/app.js': t => replaceOnce(t, 'if (!fromScene) { setDockCollapsed(false);', 'if (true) { setDockCollapsed(false);') };
            const rn = await still(true); mut = {};
            check('seamless - negative control: the pre-2026-11-08 rule (every entry opens the dock on the System view) FAILS the check', !rn.ok, rn.detail.slice(0, 220));
        }
        {   // v4 (task #45): every tab, the contextual System tab included, fully visible and clickable WITHOUT scrolling the
            // row: elementFromPoint at each tab's centre is that tab, the tab lies inside the tab row and the dock, the row has
            // no hidden overflow. Dock widths 360 / 440 / 720 at 1600x900 and 1280x720, and the phone sheet (390x844); in the
            // system view (System active) and with a data tab active while the system stays open. Longest system name.
            const L0 = JSON.parse(fs.readFileSync(path.join(DIR, 'latest.json'), 'utf8'));
            const longSys = L0.systems.slice().sort((a, b) => (b.n || '').length - (a.n || '').length)[0];
            async function tabsScenario(w, h, dockW) {
                const { page, ctx, errors } = await open(w, h);
                try {
                    if (dockW) {
                        await page.evaluate(d => localStorage.setItem('c4.dock.w', String(d)), dockW);
                        await page.reload();
                        await page.waitForFunction(() => document.querySelector('.c4-sec.active .c4-verdict') && window.__calls && window.__calls.some(c => c[0] === 'setData'), null, { timeout: 30000 });
                        await sleep(1200);
                    }
                    await page.evaluate(a => window.__emit('systemView', { sys: a }), longSys.a); await sleep(900);
                    await page.evaluate(() => document.querySelector('.c4-tab-sys').click()); await sleep(500);   // System active (2026-11-08: not automatic)
                    const probe = () => page.evaluate(() => {
                        const nav = document.getElementById('c4Tabs'), dock = document.getElementById('c4Dock').getBoundingClientRect(), nr = nav.getBoundingClientRect();
                        const bad = [];
                        const tabs = [...nav.querySelectorAll('.c4-tab')].filter(t => !t.hidden);
                        for (const t of tabs) {
                            const r = t.getBoundingClientRect(), cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2;
                            const hit = document.elementFromPoint(cx, cy), hitTab = hit && hit.closest('.c4-tab');
                            const nm = t.dataset.tab || 'system';
                            if (hitTab !== t) bad.push(`${nm}: centre (${Math.round(cx)},${Math.round(cy)}) hits ${hit ? (hit.id || hit.className || hit.tagName) : 'nothing'}`);
                            if (r.left < nr.left - 1 || r.right > nr.right + 1 || r.left < dock.left - 1 || r.right > dock.right + 1) bad.push(`${nm}: x ${Math.round(r.left)}-${Math.round(r.right)} outside row ${Math.round(nr.left)}-${Math.round(nr.right)}`);
                            if (r.width < 28) bad.push(`${nm}: only ${Math.round(r.width)} px wide`);
                        }
                        if (nav.scrollWidth > nav.clientWidth + 1) bad.push(`row overflows: scrollWidth ${nav.scrollWidth} > clientWidth ${nav.clientWidth}`);
                        // 5 = four data tabs + System; the DACs tab (2026-11-07) adds one when dacs.json loaded
                        const want = nav.querySelector('.c4-tab[data-tab="dacs"]:not([hidden])') ? 6 : 5;
                        if (tabs.length !== want) bad.push(`${tabs.length} tabs shown, expected ${want}`);
                        return { bad, fit: nav.dataset.fit, sysLabel: getComputedStyle(nav.querySelector('.c4-tab-sys span')).display !== 'none', dockW: Math.round(dock.right - dock.left) };
                    });
                    const a = await probe();
                    await page.evaluate(() => document.querySelector('.c4-tab[data-tab="combat"]').click()); await sleep(500);
                    const b = await probe();
                    // and the System tab, clicked by its centre point (a real pointer, no scroll-into-view), brings the system back
                    const sr = await page.evaluate(() => { const r = document.querySelector('.c4-tab-sys').getBoundingClientRect(); return [(r.left + r.right) / 2, (r.top + r.bottom) / 2]; });
                    await page.mouse.click(sr[0], sr[1]); await sleep(500);
                    const back = await page.evaluate(() => document.getElementById('c4SysPanel').classList.contains('active') && document.querySelector('.c4-tab-sys').classList.contains('active'));
                    const ok = !a.bad.length && !b.bad.length && back && !errors.length;
                    return { ok, detail: `dock ${a.dockW}px, fit ${a.fit}/${b.fit}, System label ${a.sysLabel ? 'shown' : 'icon'}: ${[...a.bad.map(x => 'system view: ' + x), ...b.bad.map(x => 'combat tab: ' + x)].slice(0, 3).join('; ') || 'all tabs hit'}${back ? '' : '; System tab click did NOT return to the system'}${errors.length ? ' ERR ' + errors[0] : ''}` };
                } finally { await ctx.close(); }
            }
            for (const [w, h] of [[1600, 900], [1280, 720]]) for (const dw of [360, 440, 720]) {
                const r = await tabsScenario(w, h, dw);
                check(`tabs (v4) ${w}x${h}, dock ${dw}: all tabs (6 with DACs) incl. System ("${longSys.n}") fully visible and hit at their centres, row does not scroll`, r.ok, r.detail);
            }
            {
                const r = await tabsScenario(390, 844, null);
                check(`tabs (v4) phone sheet 390x844: all five tabs incl. System fully visible and hit at their centres`, r.ok, r.detail);
            }
            mut = { '/C4Live/app.js': t => replaceOnce(t, 'nav.dataset.fit = String(lv);', 'nav.dataset.fit = "0";') };
            const rm = await tabsScenario(1600, 900, 440); mut = {};
            check('tabs - negative control: with fitTabs neutered (labels never shed) the check FAILS at 1600x900 dock 440', !rm.ok, rm.detail.slice(0, 200));
        }
        {   // phone: bottom sheet
            const { page, ctx, errors } = await open(390, 844);
            const g = await geom(page); const ins = await lastCall(page, 'setInsets');
            check('390x844: no page scroll; dock is a bottom sheet; scene told bottom = sheet height, right = 0', fullScreenOk(g) && g.dock.bottom === 844 && g.dock.left === 0 && ins && ins[0].right === 0 && Math.abs(ins[0].bottom - (844 - g.dock.top)) <= 1 && !errors.length, `dock ${JSON.stringify(g.dock)}, told ${JSON.stringify(ins && ins[0])}`);
            await ctx.close();
        }
        {   // reduced motion: dock toggles instantly and still reports
            const { page, ctx } = await open(1280, 720, '', { reducedMotion: 'reduce' });
            await page.keyboard.press('d'); await sleep(150);
            const g = await geom(page); const ins = await lastCall(page, 'setInsets');
            check('reduced motion: collapse is immediate and the insets match at once', insetsMatch(ins, g) && g.dock.right - g.dock.left < 80, `dock ${g.dock.right - g.dock.left} px, told ${JSON.stringify(ins && ins[0])}`);
            await ctx.close();
        }
        // ------------------------------------------------------------------ v3 (2026-11-07)
        const L0 = JSON.parse(fs.readFileSync(path.join(DIR, 'latest.json'), 'utf8'));
        const sysT = L0.systems.find(s => s.n === 'Xictarn') || L0.systems.find(s => s.f) || L0.systems[0];
        {   // avoid rects reach the scene and follow the HUD
            const run = async () => {
                const { page, ctx } = await open(1600, 900);
                try {
                    const hud = () => page.evaluate(() => [...document.querySelectorAll('#c4Controls > .c4-glass, .c4-brand, #c4Age > .c4-age, .c4-shiphint.show')].filter(e => e.getClientRects().length).map(e => { const b = e.getBoundingClientRect(); return [Math.floor(b.left), Math.floor(b.top), Math.ceil(b.right), Math.ceil(b.bottom)].join(','); }).sort());
                    const told = async () => { const a = await lastCall(page, 'setInsets'); return a && a[0] && Array.isArray(a[0].avoid) ? a[0].avoid.map(r => [r.left, r.top, r.right, r.bottom].join(',')).sort() : null; };
                    const h1 = await hud(), t1 = await told();
                    // the Map focus box appears in #c4Controls when a state filter is set: the HUD grows, the scene must hear it
                    await page.click('.c4-tab[data-tab="fleets"]'); await sleep(400); await page.click('#sec-fleets [data-state]'); await sleep(600);
                    const h2 = await hud(), t2 = await told();
                    const same = (a, b) => !!a && !!b && a.length === b.length && a.every((x, i) => x === b[i]);
                    return { ok: h1.length >= 3 && same(h1, t1) && h2.length > h1.length && same(h2, t2), detail: `HUD ${h1.length} boxes, told ${t1 ? t1.length : 'none'}; after a state filter HUD ${h2.length}, told ${t2 ? t2.length : 'none'}; HUD ${h2.join(' ')} / told ${(t2 || []).join(' ')}` };
                } finally { await ctx.close(); }
            };
            const a1 = await run();
            check('setInsets carries `avoid` = every floating HUD box (controls, brand, age banner), and follows a HUD change', a1.ok, a1.detail);
            mut = { '/C4Live/app.js': t => replaceOnce(t, 'avoid: hudRects()', 'avoid: []') }; const a2 = await run(); mut = {};
            check('avoid rects - negative control: with the HUD rects not sent the check FAILS', !a2.ok, a2.detail.slice(0, 140));
        }
        {   // a callout click enters the SYSTEM VIEW; a plain map system click keeps the starbase drawer
            const run = async () => {
                const { page, ctx } = await open(1600, 900);
                try {
                    await page.evaluate(a => { window.__calls.length = 0; window.__emit('pick', { type: 'system', id: a, source: 'callout' }); }, sysT.a); await sleep(900);
                    const c = await page.evaluate(() => ({ sys: document.getElementById('c4SysPanel').classList.contains('active'), tab: !document.querySelector('.c4-tab-sys').hidden, drawer: document.getElementById('c4Drawer').classList.contains('open'), fs: (window.__calls.filter(x => x[0] === 'focusSystem').pop() || [])[1], fp: window.__calls.filter(x => x[0] === 'focusPoint').length }));
                    await page.evaluate(() => { const b = document.querySelector('#c4SysPanel [data-galaxy]'); if (b) b.click(); }); await sleep(500);
                    await page.evaluate(a => window.__emit('pick', { type: 'system', id: a }), sysT.a); await sleep(900);
                    const p = await page.evaluate(() => ({ drawer: document.getElementById('c4Drawer').classList.contains('open'), sys: document.getElementById('c4SysPanel').classList.contains('active') }));
                    return { ok: c.sys && c.tab && !c.drawer && c.fs && c.fs[0] === sysT.a && p.drawer && !p.sys, detail: `callout: ${JSON.stringify(c)}; plain: ${JSON.stringify(p)}` };
                } finally { await ctx.close(); }
            };
            const c1 = await run();
            check(`callout pick {source:'callout'} enters ${sysT.n}'s system view (focusSystem, System tab, no drawer); a plain system pick still opens the starbase drawer`, c1.ok, c1.detail);
            mut = { '/C4Live/app.js': t => replaceOnce(t, "p.source === 'callout' && p.id", "p.source === 'never' && p.id") }; const c2 = await run(); mut = {};
            check('callout pick - negative control: without the callout branch the check FAILS', !c2.ok, c2.detail.slice(0, 160));
        }
        {   // D works with a layer checkbox focused; typing in a text field still does not collapse the dock
            const run = async () => {
                const { page, ctx } = await open(1280, 720);
                try {
                    await page.click('#c4Find'); await page.keyboard.press('d'); await sleep(200);
                    const typing = await page.evaluate(() => ({ collapsed: document.getElementById('c4Dock').classList.contains('collapsed'), v: document.getElementById('c4Find').value }));
                    await page.click('[data-layer="labels"]'); await page.click('[data-layer="labels"]');   // toggle twice: back on, focus stays on it
                    const focus = await page.evaluate(() => document.activeElement && document.activeElement.dataset.layer);
                    await page.keyboard.press('d'); await sleep(200);
                    const cb = await page.evaluate(() => document.getElementById('c4Dock').classList.contains('collapsed'));
                    return { ok: !typing.collapsed && typing.v === 'd' && focus === 'labels' && cb, detail: `typing d in Find: collapsed ${typing.collapsed}, value "${typing.v}"; checkbox focused (${focus}) + d: collapsed ${cb}` };
                } finally { await ctx.close(); }
            };
            const k1 = await run();
            check('D collapses the dock while a layer checkbox has focus; typing "d" in Find does not', k1.ok, k1.detail);
            mut = { '/C4Live/app.js': t => replaceOnce(t, "(tg.tagName === 'INPUT' && !NOTEXT.test(tg.type || 'text'))", "tg.tagName === 'INPUT'") }; const k2 = await run(); mut = {};
            check('D key - negative control: the v2 rule (any INPUT blocks D) FAILS the check', !k2.ok, k2.detail);
        }
        {   // KPI bar: nothing ellipsised or clipped with the dock open; dock tables fit their column
            const kpiCut = page => page.evaluate(() => [...document.querySelectorAll('.c4-kpi span, .c4-kpi small, .c4-kpi b')].filter(e => e.getClientRects().length && (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1)).map(e => `${e.textContent.trim()} ${e.scrollWidth}>${e.clientWidth}`));
            const tableCut = async page => { const out = []; for (const tab of ['mining', 'combat', 'fleets', 'owners']) { await page.click(`.c4-tab[data-tab="${tab}"]`); await sleep(450);
                out.push(...await page.evaluate(t => { const body = document.getElementById('c4Main').getBoundingClientRect(); return [...document.querySelectorAll('.c4-sec.active .c4-tw')].filter(w => w.scrollWidth > w.clientWidth + 1 || w.getBoundingClientRect().right > body.right + 1).map(w => `${t} table ${w.scrollWidth}>${w.clientWidth}`); }, tab)); } return out; };
            const runAll = async () => {
                const bad = [];
                for (const [w, h, dw] of [[1600, 900, 0], [1280, 720, 0], [1280, 720, 360], [1600, 900, 720], [390, 844, 0]]) {
                    const { page, ctx } = await open(w, h);
                    try {
                        if (dw) { await page.evaluate(d => localStorage.setItem('c4.dock.w', d), dw); await page.reload(); await page.waitForFunction(() => document.querySelector('.c4-sec.active .c4-verdict')); await sleep(1200); }
                        const k = await kpiCut(page), t = await tableCut(page);
                        // phone strip: at rest every KPI is wholly in view or wholly out of it (no half-cut "MINI 39")
                        const half = w < 700 ? await page.evaluate(() => { const s = document.querySelector('.c4-kpis').getBoundingClientRect(); return [...document.querySelectorAll('.c4-kpi')].filter(e => { const b = e.getBoundingClientRect(); const vis = Math.min(b.right, s.right) - Math.max(b.left, s.left); return vis > 1 && vis < b.width - 1; }).map(e => e.querySelector('span').textContent); }) : [];
                        if (k.length || t.length || half.length) bad.push(`${w}x${h}${dw ? ' dock ' + dw : ''}: ${k.concat(t, half.map(x => 'half-cut ' + x)).slice(0, 4).join(', ')}`);
                    } finally { await ctx.close(); }
                }
                return bad;
            };
            const b1 = await runAll();
            check('KPI labels / values / sub-lines never cut, dock tables fit their column, phone KPI strip rests on whole KPIs (1600x900, 1280x720, dock 360 and 720, 390x844)', !b1.length, b1.join(' | ') || 'all clean');
            mut = { '/C4Live/c4.css': t => replaceOnce(replaceOnce(t, '.c4-table .opt { display: none; }', ''), '.c4-kpi small { display: none; } .c4-kpi { padding: 0.1rem 0.45rem; }', '.c4-kpi small { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }') };
            const b2 = await runAll(); mut = {};
            check('KPI / table fit - negative control: sub-lines kept on one line and the optional columns shown FAILS the check', b2.length > 0, b2.join(' | ').slice(0, 200));
        }
        {   // phone: the age / collector banner is one compact line
            const { page, ctx } = await open(390, 844);
            const ag = await page.evaluate(() => { const boxes = [...document.querySelectorAll('#c4Age > .c4-age')].filter(e => e.getClientRects().length); const r = boxes.map(e => e.getBoundingClientRect()); const sheet = document.getElementById('c4Dock').getBoundingClientRect().top; return { n: boxes.length, h: r.map(b => Math.round(b.height)), w: r.map(b => Math.round(b.width)), cut: boxes.filter(e => e.scrollWidth > e.clientWidth + 1).length, sheet: Math.round(sheet), text: boxes.map(e => e.textContent.trim()) }; });
            await ctx.close();
            check('390x844: the age / collector banner is ONE line (one box <= 30 px tall, nothing cut)', ag.n === 1 && ag.h[0] <= 30 && !ag.cut, JSON.stringify(ag));
        }
        {   // deep-link race: data first, the REAL bundle 1.5 s later; ?system= must still end in that system's view
            const race = async () => {
                useStub = false; delay = { '/C4Live/c4-scene.js': 1500 };
                const { page, ctx, errors } = await open(1600, 900, `?system=${encodeURIComponent(sysT.a)}`);
                try {
                    const ok = await page.waitForFunction(() => { const s = window.__scene && window.__scene.getStats && window.__scene.getStats(); return s && s.systemView; }, null, { timeout: 8000 }).then(() => true, () => false);
                    const st = await page.evaluate(() => { const s = window.__scene && window.__scene.getStats(); return { scene: !!window.__scene, systemView: !!(s && s.systemView), dock: document.getElementById('c4SysPanel').classList.contains('active') }; });
                    return { ok: ok && st.systemView && st.dock && !errors.length, detail: JSON.stringify(st) + (errors.length ? ' ERR ' + errors[0] : '') };
                } finally { await ctx.close(); useStub = true; delay = {}; }
            };
            const r1 = await race();
            check(`deep-link race: ?system=${sysT.n} with c4-scene.js served 1.5 s after the data ends in the scene's system view (real bundle)`, r1.ok, r1.detail);
            mut = { '/C4Live/app.js': t => replaceOnce(t, '        replaySceneState();\n', '\n') }; const r2 = await race(); mut = {};
            check('deep-link race - negative control: without the replay the scene stays in the galaxy', !r2.ok, r2.detail);
        }
        {   // [16] DACs in the page (task #52): the real (empty) list, the example preview and its isolation, a missing /
            // invalid file, a hostile file. The stub records setDacs; dacs.json is served from the repo (or mutated / 404).
            const dacState = page => page.evaluate(() => {
                const sec = document.getElementById('sec-dacs'), tab = document.querySelector('.c4-tab[data-tab="dacs"]');
                const calls = (window.__calls || []).filter(c => c[0] === 'setDacs'), last = calls.length ? calls[calls.length - 1][1][0] : null;
                const sl = (window.__calls || []).filter(c => c[0] === 'setStatLayer');
                const ex = document.getElementById('c4DacEx');
                return { tab: !!tab && !tab.hidden, active: !!sec && sec.classList.contains('active'), rows: sec ? sec.querySelectorAll('.c4-dac').length : 0,
                    memberRows: sec ? sec.querySelectorAll('.c4-dac li[data-owner]').length : 0,
                    members: last ? Object.fromEntries(last.dacs.map(d => [d.tag, d.members])) : null, example: last ? last.example : null, nSetDacs: calls.length,
                    stat: sl.length ? sl[sl.length - 1][1][0] : null,
                    banner: !!ex && !ex.hidden && ex.getClientRects().length > 0, secBanner: !!(sec && sec.querySelector('.c4-dac-banner')),
                    nums: sec ? sec.querySelectorAll('.c4-dacn').length : 0, numsEx: sec ? sec.querySelectorAll('.c4-dacn.ex').length : 0,
                    howTo: sec ? (sec.querySelector('.c4-note') || {}).textContent || '' : '', btn: (sec && sec.querySelector('[data-dac-example]') || {}).textContent || '',
                    store: Object.keys(localStorage).filter(k => /dac/i.test(k) || /dac|example/i.test(localStorage.getItem(k) || '')) };
            });
            // Owners leaderboard + KPI bar as rendered: must be byte-identical with the example on (no leak outside DAC views)
            const ownersSnap = async page => { await page.click('.c4-tab[data-tab="owners"]'); await sleep(400);
                return page.evaluate(() => ({ owners: document.getElementById('c4OwnerTable').innerHTML, kpi: [...document.querySelectorAll('#c4Kpis b')].filter(b => b.id !== 'kpiMined').map(b => b.id + '=' + b.textContent).join(' '), verdict: document.querySelector('#sec-owners .c4-verdict').textContent })); };
            async function dacRun(appMut) {
                mut = appMut ? { '/C4Live/app.js': appMut } : {};
                const out = { errors: [] };
                const { page, ctx, errors } = await open(1600, 900, '?tab=dacs', { reducedMotion: 'reduce' });
                page.setDefaultTimeout(5000);
                try {
                    out.real = await dacState(page);
                    out.own0 = await ownersSnap(page);
                    await page.click('.c4-tab[data-tab="dacs"]'); await sleep(300);
                    await page.click('#sec-dacs [data-dac-example]'); await sleep(400);
                    out.ex = await dacState(page);
                    // an example member's drawer: the REAL row says none, the example row is labelled EXAMPLE
                    const m = await page.evaluate(() => { const li = document.querySelector('#sec-dacs .c4-dac li[data-owner]'); return li && li.dataset.owner; });
                    if (m) { await page.evaluate(p => document.querySelector(`#sec-dacs .c4-dac li[data-owner="${p}"]`).click(), m); await sleep(500); }
                    out.drawer = await page.evaluate(() => { const rows = [...document.querySelectorAll('#c4Drawer .c4-dacrow')]; return rows.map(r => ({ ex: r.classList.contains('ex'), text: r.textContent.replace(/\s+/g, ' ').trim() })); });
                    await page.evaluate(() => { const x = document.querySelector('#c4Drawer [data-close]'); if (x) x.click(); }); await sleep(300);
                    out.own1 = await ownersSnap(page);
                    out.exStill = await dacState(page);   // banner persists on another tab
                    await page.click('.c4-tab[data-tab="dacs"]'); await sleep(300);
                    out.exStat = (await dacState(page)).stat;
                    await page.click('#sec-dacs [data-dac-example]'); await sleep(400);
                    out.off = await dacState(page);
                    if (m) { await page.evaluate(p => { const b = document.createElement('div'); b.dataset.owner = p; document.body.appendChild(b); b.click(); b.remove(); }, m); await sleep(500); }
                    out.drawerOff = await page.evaluate(() => [...document.querySelectorAll('#c4Drawer .c4-dacrow')].map(r => r.textContent.replace(/\s+/g, ' ').trim()));
                } catch (e) { out.errors.push('scenario stopped: ' + String(e).split('\n')[0]); }
                finally { out.errors = out.errors.concat(errors); await ctx.close(); mut = {}; }
                return out;
            }
            const R = await dacRun();
            const J = JSON.parse(fs.readFileSync(path.join(ROOT, 'C4Live', 'dacs.json'), 'utf8'));
            const total = s => s && s.members ? Object.values(s.members).reduce((a, m) => a + m.length, 0) : -1;
            check(`DACs tab: ?tab=dacs shows the hand-kept list (${J.dacs.length} DACs, all empty), the how-to note names C4Live/dacs.json and z.ink, setStatLayer("dacs"), setDacs({example:false}) with no members`,
                !!R.real && R.real.tab && R.real.active && R.real.rows === J.dacs.length && R.real.memberRows === 0 && R.real.stat === 'dacs' && R.real.example === false && total(R.real) === 0
                && /C4Live\/dacs\.json/.test(R.real.howTo) && /profile address/.test(R.real.howTo) && /z\.ink/.test(R.real.howTo) && !R.real.banner && /Show example/.test(R.real.btn), JSON.stringify(R.real || {}).slice(0, 300));
            const exOk = r => !!r.ex && r.ex.banner && r.ex.secBanner && r.ex.example === true && total(r.ex) > 0 && r.ex.memberRows > 0 && r.ex.nums > 0 && r.ex.numsEx === r.ex.nums && r.exStill && r.exStill.banner && r.exStat === 'dacs';
            check('example ON: persistent banner on the map (still there on the Owners tab) and in the dock, EVERY DAC number marked .ex, setDacs({example:true}) with members', exOk(R),
                R.ex ? `banner ${R.ex.banner}/${R.ex.secBanner}, ${total(R.ex)} members, ${R.ex.numsEx}/${R.ex.nums} numbers marked, banner on owners tab ${R.exStill && R.exStill.banner}` : 'no state');
            const isoOk = r => !!r.own0 && !!r.own1 && r.own0.owners === r.own1.owners && r.own0.kpi === r.own1.kpi && r.own0.verdict === r.own1.verdict && r.ex && !r.ex.store.length
                && r.drawer && r.drawer.length === 2 && !r.drawer[0].ex && /none on the hand-kept list/.test(r.drawer[0].text) && r.drawer[1].ex && /EXAMPLE/.test(r.drawer[1].text);
            check('example isolation: the Owners leaderboard, its verdict and the KPI bar are byte-identical with the example on; nothing saved to localStorage; the drawer\'s REAL DAC row stays "none", the example row is labelled EXAMPLE',
                isoOk(R), R.drawer ? JSON.stringify(R.drawer) + ` owners same ${R.own0 && R.own1 && R.own0.owners === R.own1.owners} kpi same ${R.own0 && R.own1 && R.own0.kpi === R.own1.kpi} store ${R.ex && R.ex.store}` : 'no drawer');
            const offOk = r => !!r.off && !r.off.banner && !r.off.secBanner && r.off.example === false && total(r.off) === 0 && r.off.memberRows === 0 && r.off.numsEx === 0 && /Show example/.test(r.off.btn)
                && r.drawerOff && r.drawerOff.length === 1 && /none on the hand-kept list/.test(r.drawerOff[0]);
            check('example OFF restores the real (empty) list: no banner, no members, no marked numbers, setDacs({example:false}) empty, drawer real row "none"', offOk(R), JSON.stringify(R.off || {}).slice(0, 240) + ' ' + JSON.stringify(R.drawerOff));
            check('DACs page: no page errors', !R.errors.length, R.errors.slice(0, 2).join(' | '));
            // determinism across page loads: a second page places the same players in the same DACs
            const R2 = await dacRun();
            check('example preview is stable across page loads (same players in the same DACs)', !!R.ex && !!R2.ex && total(R.ex) > 0 && JSON.stringify(R.ex.members) === JSON.stringify(R2.ex.members), `${total(R.ex)} vs ${total(R2.ex)}`);
            // negative control: a toggle that writes the example members INTO the real list leaks; the checks above FAIL
            const RM1 = await dacRun(t => replaceOnce(t, 'M.resolveDacs(S.latest, M.exampleDacs(S.latest, S.dac.list))', 'M.resolveDacs(S.latest, (S.dac.list = M.exampleDacs(S.latest, S.dac.list)))'));
            check('example isolation - negative control: a toggle that writes example members into the real list is caught (OFF no longer restores the empty list)', !offOk(RM1), `off ok ${offOk(RM1)}, iso ok ${isoOk(RM1)}; ${total(RM1.off)} members after OFF`);
            const RM2 = await dacRun(t => replaceOnce(t, "<b class=\"c4-dacn${ex ? ' ex' : ''}\"", '<b class="c4-dacn"'));
            check('example marking - negative control: numbers without the .ex mark are caught', !exOk(RM2), RM2.ex ? `${RM2.ex.numsEx}/${RM2.ex.nums}` : 'no state');
            // a missing file and an invalid file: no DACs tab, no page error, the rest of the page works
            for (const [label, setup] of [['missing (404)', () => { gone = { '/C4Live/dacs.json': true }; }], ['invalid JSON', () => { mut = { '/C4Live/dacs.json': () => '{"version": 1, "dacs": [' }; }], ['wrong version', () => { mut = { '/C4Live/dacs.json': t => t.replace('"version": 1', '"version": 9') }; }]]) {
                setup();
                const { page, ctx, errors } = await open(1600, 900, '?tab=dacs');
                const st = await dacState(page).catch(e => ({ err: String(e) }));
                const mining = await page.evaluate(() => document.getElementById('sec-mining').classList.contains('active') && !!document.querySelector('#sec-mining .c4-verdict'));
                await ctx.close(); gone = {}; mut = {};
                check(`dacs.json ${label}: no DACs tab, ?tab=dacs falls back to Mining, no page error`, !st.tab && !st.active && mining && !errors.length, JSON.stringify({ tab: st.tab, active: st.active, mining, err: errors[0] }));
            }
            // hostile file: an <img onerror> name and a CSS-carrying colour render as TEXT / grey
            const EVILN = '<img src=x onerror="window.__xss=2">Rome';
            const evilMut = t => { const j = JSON.parse(t); j.dacs[0].name = EVILN; j.dacs[0].color = 'red;background:url(javascript:window.__xss=3)'; j.dacs[0].source = '<img src=x onerror="window.__xss=4">'; return JSON.stringify(j); };
            const xssRun = async appMut => {
                mut = { '/C4Live/dacs.json': evilMut }; if (appMut) mut['/C4Live/app.js'] = appMut;
                const { page, ctx, errors } = await open(1600, 900, '?tab=dacs');
                try { return await page.evaluate(tag => { const r = document.querySelector(`#sec-dacs .c4-dac[data-dac="${tag}"]`); return { name: r && r.querySelector('.nm').textContent, col: r && r.style.getPropertyValue('--dac'), imgs: document.querySelectorAll('img[src="x"]').length, xss: window.__xss || 0, errors: [] }; }, J.dacs[0].tag).then(x => ({ ...x, errors })); }
                finally { await ctx.close(); mut = {}; }
            };
            const xssOk = r => r.name === EVILN && r.col.trim() === '#9aa3b5' && !r.imgs && !r.xss && !r.errors.length;
            const X1 = await xssRun();
            check('DACs XSS: a hostile DAC name and source from the file render as TEXT, a CSS-carrying colour is replaced by grey, no element created, no handler ran', xssOk(X1), JSON.stringify(X1));
            const X2 = await xssRun(t => replaceOnce(t, '<span class="nm">${esc(x.name)}</span>', '<span class="nm">${x.name}</span>'));
            check('DACs XSS - negative control: a DAC name without esc() is caught', !xssOk(X2), JSON.stringify(X2));
        }
        await lensScenarios();
        await fixScenarios();
        if (L.owners && L.owners.some(o => o.name !== undefined)) await identityScenarios();
        else console.log('  SKIP v5 identity: the snapshot predates owner names');
        {   // REAL scene: no stat callout sits under a floating HUD box (P2: Evernat under the Faction/Layers box). Runs the
            // real bundle; it needs the scene to honour setInsets({avoid}) (scene builder, task #38)
            useStub = false;
            const bad = [];
            let shown = 0;
            for (const [w, h] of [[1600, 900], [1280, 720]]) {
                const { page, ctx } = await open(w, h);
                try {
                    for (const tab of ['mining', 'combat', 'fleets', 'owners']) {
                        await page.click(`.c4-tab[data-tab="${tab}"]`); await sleep(2500);
                        const r = await page.evaluate(() => {
                            const hud = [...document.querySelectorAll('#c4Controls > .c4-glass, .c4-brand, #c4Age > .c4-age, .c4-shiphint.show, #c4Kpis, #c4Dock')].filter(e => e.getClientRects().length).map(e => ({ id: e.id || e.className.split(' ')[0], b: e.getBoundingClientRect() }));
                            const layer = document.querySelector('.c4-stat-layer'); if (!layer || layer.style.display === 'none') return { n: 0, bad: [] };
                            const cs = [...layer.children].filter((e, i) => i % 3 === 2 && e.style.display !== 'none');
                            const out = [];
                            for (const c of cs) {
                                const b = c.getBoundingClientRect(), cx = (b.left + b.right) / 2, cy = (b.top + b.bottom) / 2;
                                const hit = document.elementFromPoint(cx, cy);
                                const over = hud.filter(x => b.left < x.b.right && b.right > x.b.left && b.top < x.b.bottom && b.bottom > x.b.top).map(x => x.id);
                                if (!(hit && c.contains(hit)) || over.length) out.push(`${c.textContent.slice(0, 24)} @${Math.round(cx)},${Math.round(cy)} under ${over.join('+') || (hit && hit.closest('.c4-stat-layer') ? 'another callout (' + hit.closest('.c4-stat-layer > div').textContent.slice(0, 20) + ')' : hit ? (hit.id || hit.className || hit.tagName) : 'nothing')}`);
                            }
                            return { n: cs.length, bad: out };
                        });
                        shown += r.n;
                        r.bad.forEach(x => bad.push(`${w}x${h} ${tab}: ${x}`));
                    }
                } finally { await ctx.close(); }
            }
            useStub = true;
            let sh = '?'; try { sh = require('crypto').createHash('sha256').update(fs.readFileSync(path.join(ROOT, 'C4Live', 'c4-scene.js'))).digest('hex').slice(0, 8); } catch (e) { /* missing */ }
            check(`real scene (c4-scene.js ${sh}): no stat callout under the HUD; elementFromPoint at every callout centre is the callout (${shown} callouts, 4 tabs x 1600x900 + 1280x720)`, shown > 0 && !bad.length, bad.slice(0, 4).join(' | ') || `${shown} callouts clear`);
        }
        {   // the REAL scene bundle: page still full-screen and error-free
            useStub = false;
            const { page, ctx, errors } = await open(1600, 900);
            const g = await geom(page);
            const canvas = await page.evaluate(() => { const c = document.querySelector('#c4Map canvas'); if (!c) return null; const b = c.getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height)]; });
            check('real scene: canvas fills the 1600x900 viewport, page does not scroll, no page errors', fullScreenOk(g) && canvas && canvas[0] === 1600 && canvas[1] === 900 && !errors.length, `canvas ${JSON.stringify(canvas)}; ${errors.slice(0, 2).join(' | ')}`);
            await page.screenshot({ path: path.join(require('os').tmpdir(), 'c4-live-v2-1600.png') });
            await ctx.close(); useStub = true;
        }
    } finally { await browser.close(); server.close(); }
    check('every negative-control mutation found its target text (a missing target would make its control meaningless)', !mutErrors.length, mutErrors.join(' | ') || `all applied`);
}

// ---------------------------------------------------------------------------------------------------------------- [16]
// DACs (task #52, 2026-11-07): the hand-kept C4Live/dacs.json, member matching, per-system influence, the example preview.
// The file is read from the repo (it is not one of the four page files). Every rule check runs against a mutant too.
const DAC_FILE = path.join(ROOT, 'C4Live', 'dacs.json');
const FACTION_COL = { mud: '#ff6040', oni: '#3ec8ff', ustur: '#ffcc33', npc: '#8a94a6' };
const srgbLin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
function hexLab(h) {   // sRGB -> CIE Lab (D65)
    const [r, g, b] = hexRgb(h).map(srgbLin);
    const X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047, Y = 0.2126 * r + 0.7152 * g + 0.0722 * b, Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
    const f = t => t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116;
    return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
const deltaE = (a, b) => { const A = hexLab(a), B = hexLab(b); return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]); };   // CIE76
const relLum = h => { const [r, g, b] = hexRgb(h).map(srgbLin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const x = relLum(a), y = relLum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
// colour rule: every DAC colour is a #rrggbb, >= 4.5:1 on the page background #04060f, at least DE_MIN (CIE76) from every
// other DAC colour and from every faction colour (MUD, ONI, Ustur gold, NPC)
const DE_MIN = 15;
function paletteReport(dacs) {
    let min = Infinity, at = '', lowC = [];
    for (let i = 0; i < dacs.length; i++) {
        if (contrast(dacs[i].color, '#04060f') < 4.5) lowC.push(dacs[i].tag);
        for (let j = i + 1; j < dacs.length; j++) { const d = deltaE(dacs[i].color, dacs[j].color); if (d < min) { min = d; at = `${dacs[i].tag}/${dacs[j].tag}`; } }
        for (const [f, c] of Object.entries(FACTION_COL)) { const d = deltaE(dacs[i].color, c); if (d < min) { min = d; at = `${dacs[i].tag}/${f.toUpperCase()}`; } }
    }
    return { ok: min >= DE_MIN && !lowC.length && dacs.every(d => /^#[0-9a-f]{6}$/i.test(d.color)), min, at, lowC };
}
// the influence rule, written independently of the module: docked -> s.system; mining -> its asteroid's system; anything
// else at its resting point (x,y, or s.to of a warp that arrived by generatedAt - 120 s; in flight = nowhere) -> the
// nearest system within 0.6; stakes at their sys. Returns Map "sys|tag" -> {fleets, ships, stakes, ups}.
function influenceByHand(l, dacs) {
    const ast = new Map((l.asteroids || []).map(a => [a.a, a.sys]));
    const sys = (l.systems || []).filter(s => Number.isFinite(s.x) && Number.isFinite(s.y));
    const by = new Map(), get = k => by.get(k) || by.set(k, { fleets: 0, ships: 0, stakes: 0, ups: 0 }).get(k);
    const tagOf = new Map(); for (const d of dacs) for (const p of d.members) tagOf.set(p, (tagOf.get(p) || []).concat(d.tag));
    for (const f of l.fleets) {
        const tags = tagOf.get(f.o); if (!tags || f.npc || !f.s || !Number.isFinite(f.x) || !Number.isFinite(f.y)) continue;
        let at = null;
        if (f.s.kind === 'docked' && f.s.system) at = f.s.system;
        else if (f.s.kind === 'mining') at = ast.get(f.s.asteroid) || null;
        else {
            let pt = [f.x, f.y];
            if ((f.s.kind === 'warp' || f.s.kind === 'subwarp') && Array.isArray(f.s.to) && Number.isFinite(f.s.arrives) && Number.isFinite(f.s.departs)) pt = f.s.arrives <= l.generatedAt - 120 ? f.s.to : null;
            if (pt) { let bd = 0.36; for (const s of sys) { const d = (s.x - pt[0]) ** 2 + (s.y - pt[1]) ** 2; if (d < bd) { bd = d; at = s.a; } } }
        }
        if (!at) continue;
        const u = (f.mine && f.mine.out || []).reduce((s, q) => s + (q.ups || 0), 0);
        for (const t of tags) { const c = get(at + '|' + t); c.fleets++; c.ships += f.ships || 0; c.ups += u; }
    }
    for (const k of l.stakes || []) { const tags = tagOf.get(k.o); if (tags && k.sys) for (const t of tags) get(k.sys + '|' + t).stakes++; }
    return by;
}
function dacChecks() {
    console.log('\n[16] DACs: the hand-kept dacs.json, member matching, influence, example preview');
    let J = null; try { J = JSON.parse(fs.readFileSync(DAC_FILE, 'utf8')); } catch (e) { J = null; }
    // schema, checked by the test's own rules (not the module's)
    const TAGS = new Set(), bad = [];
    for (const d of (J && J.dacs) || []) {
        if (!/^[A-Z0-9]{2,6}$/.test(d.tag) || TAGS.has(d.tag)) bad.push('tag ' + d.tag); TAGS.add(d.tag);
        if (typeof d.name !== 'string' || !d.name.trim()) bad.push(d.tag + ' name');
        if (!['mud', 'oni', 'ustur', 'all'].includes(d.faction)) bad.push(d.tag + ' faction');
        if (!/^#[0-9a-f]{6}$/i.test(d.color)) bad.push(d.tag + ' color');
        if (!Array.isArray(d.members) || d.members.length) bad.push(d.tag + ' members (must start EMPTY: no real membership claims)');
        if (typeof d.source !== 'string' || !(/^owner/.test(d.source) || (/^web https:\/\/\S+ \(\d{4}-\d\d-\d\d\), unverified$/.test(d.source)))) bad.push(d.tag + ' source');
    }
    const want = J && J.dacs ? ['ROME:oni', 'AEP:all', 'VGD:mud'].filter(x => { const [t, f] = x.split(':'); const d = J.dacs.find(y => y.tag === t); return !(d && d.faction === f && /^owner/.test(d.source)); }) : ['file'];
    let parsed = null; try { parsed = M.parseDacs(J); } catch (e) { parsed = null; }
    check(`dacs.json schema: version 1, ${J && J.dacs ? J.dacs.length : 0} DACs with tag / name / faction / #rrggbb / source, members EMPTY; owner tags ROME=ONI, AEP=all, Vanguard=MUD; the module parses it with no error`,
        !!J && J.version === 1 && J.dacs.length >= 3 && !bad.length && !want.length && !!parsed && parsed.ok && !parsed.errors.length && parsed.dacs.length === J.dacs.length,
        bad.concat(want).slice(0, 4).join(', ') || (parsed ? `${parsed.dacs.length} parsed, ${parsed.errors.length} errors` : 'M.parseDacs missing'));
    const pr = J && J.dacs ? paletteReport(J.dacs) : { ok: false, min: 0, at: 'no file', lowC: [] };
    check(`dacs.json colours: readable on #04060f (>= 4.5:1) and distinct - min pairwise CIE76 deltaE ${pr.min.toFixed(1)} (${pr.at}) >= ${DE_MIN}, faction colours included`, pr.ok, pr.lowC.length ? 'low contrast: ' + pr.lowC.join(', ') : '');
    const nearCopy = J && J.dacs ? J.dacs.map((d, i) => i === 1 ? { ...d, color: '#ff6a2d' } : i === 2 ? { ...d, color: '#ff6b2e' } : d) : [];
    check('dacs.json colours - negative control: two near-identical colours are caught', !paletteReport(nearCopy).ok, `min ${paletteReport(nearCopy).min.toFixed(1)}`);
    // parser: hostile / broken entries are dropped or neutralised, never thrown
    const hostile = { version: 1, dacs: [{ tag: 'EVIL', name: '<img src=x onerror=alert(1)>‮x', faction: 'oni', color: 'red;background:url(javascript:alert(1))', source: 's', members: ['not an address', L.owners[0].p] }, { tag: 'x', name: 'n', faction: 'oni', color: '#ffffff' }, { tag: 'EVIL', name: 'dup', faction: 'all', color: '#ffffff' }] };
    let hp = null; try { hp = M.parseDacs(hostile); } catch (e) { hp = null; }
    check('parseDacs: a CSS-carrying colour becomes grey, a non-address member is skipped, a bad or duplicate tag is dropped, bidi stripped (name kept as text)',
        !!hp && hp.ok && hp.dacs.length === 1 && hp.dacs[0].color === '#9aa3b5' && hp.dacs[0].members.length === 1 && hp.dacs[0].name === '<img src=x onerror=alert(1)>x' && hp.errors.length >= 3, hp ? JSON.stringify(hp.dacs) : 'missing');
    let bad0 = null; try { bad0 = [M.parseDacs(null), M.parseDacs({ version: 2, dacs: [] }), M.parseDacs({ version: 1 })].map(r => r.ok); } catch (e) { bad0 = null; }
    check('parseDacs: a missing / wrong-version / list-less file is not ok (the page hides DACs)', !!bad0 && bad0.every(x => x === false), JSON.stringify(bad0));

    // matching: one member by PROFILE, one by WALLET, one near-miss (the wallet with its last character changed) unmatched
    const withW = L.owners.filter(o => o.wallet && o.p);
    const [A, B] = [withW[0], withW[1]];
    const miss = B.wallet.slice(0, -1) + (B.wallet.slice(-1) === '1' ? '2' : '1');
    const testDac = [{ tag: 'TST', name: 'Test', faction: 'all', color: '#ffffff', members: [A.p, B.wallet, miss] }];
    ruleCheck('matching: a member matches an owner by profile address AND by auth wallet (exact; a one-character-off wallet stays unmatched)',
        rd => { const r = rd(L, testDac); const d = r.dacs[0]; return d.profiles.includes(A.p) && d.profiles.includes(B.p) && d.profiles.length === 2 && d.unmatched.length === 1 && d.unmatched[0] === miss && (r.tagsOf.get(B.p) || []).includes('TST'); },
        (l, d) => M.resolveDacs(l, d),
        (l, d) => M.resolveDacs({ ...l, owners: l.owners.map(o => ({ ...o, wallet: null })) }, d));   // mutant: profile only

    // influence: members = top 3 players by ships + top 2 stake holders, compared cell by cell with the by-hand rule
    const stakeBy = {}; for (const k of L.stakes || []) stakeBy[k.o] = (stakeBy[k.o] || 0) + 1;
    const mem = [...new Set(D.players.slice().sort((a, b) => b.ships - a.ships).slice(0, 3).map(o => o.p).concat(Object.entries(stakeBy).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0])))];
    const infDacs = [{ tag: 'AAA', members: mem.slice(0, 3) }, { tag: 'BBB', members: mem.slice(2) }];   // one shared member
    const hand = influenceByHand(L, infDacs);
    const sameInf = r => { const got = new Map(); for (const s of r.systems) for (const [t, c] of Object.entries(s.byDac)) got.set(s.a + '|' + t, c);
        if (got.size !== hand.size || !hand.size) return false;
        for (const [k, c] of hand) { const g = got.get(k); if (!g || g.fleets !== c.fleets || g.ships !== c.ships || g.stakes !== c.stakes || !near(g.ups, c.ups, 1e-6)) return false; }
        return ['AAA', 'BBB'].every(t => (r.byDac[t] || []).length === [...hand.keys()].filter(k => k.endsWith('|' + t)).length); };
    const handStakes = [...hand.values()].reduce((s, c) => s + c.stakes, 0), handUps = [...hand.values()].reduce((s, c) => s + c.ups, 0);
    ruleCheck(`dacInfluence = the by-hand rule, every system x DAC cell (${hand.size} cells, ${handStakes} stakes, ${handUps.toFixed(1)} u/s, members ${mem.length})`,
        f => sameInf(f(L, infDacs)), (l, d) => M.dacInfluence(l, d),
        (l, d) => { const r = M.dacInfluence(l, d); for (const s of r.systems) for (const c of Object.values(s.byDac)) c.stakes = 0; return r; });   // mutant: no stakes
    ruleCheck('dacInfluence: a mining fleet counts at its ASTEROID\'s system (not the nearest system to its coordinates)',
        f => sameInf(f(L, infDacs)), (l, d) => M.dacInfluence(l, d),
        (l, d) => M.dacInfluence({ ...l, asteroids: [] }, d));   // mutant: no asteroid -> system link
    check('dacInfluence: the summary is exported for the scene (same function the panel uses)', typeof M.dacInfluence === 'function' && typeof M.dacSummary === 'function');

    // example preview: deterministic, input untouched, faction-correct, most players unassigned
    const parsed2 = parsed && parsed.ok ? parsed.dacs : [];
    const exOk = fn => {
        const before = JSON.stringify(parsed2);
        const a = fn(L, parsed2), b = fn(L, parsed2);
        const fa = new Map(L.owners.map(o => [o.p, o.fa]));
        const all = a.flatMap(d => d.members);
        const share = all.length / L.owners.length;
        const facOk = a.every(d => d.members.every(p => d.faction === 'all' || fa.get(p) === d.faction));
        // owner 2026-11-07: "show DAC within one faction for now" - no example DAC spans factions, all-faction ones included
        const oneFa = a.every(d => d.faction !== 'all' && new Set(d.members.map(p => fa.get(p))).size <= 1);
        return { ok: JSON.stringify(a) === JSON.stringify(b) && JSON.stringify(parsed2) === before && parsed2.every(d => !d.members.length) && a.every(d => d.example === true)
            && new Set(all).size === all.length && all.every(p => fa.has(p)) && facOk && oneFa && share > 0.05 && share < 0.35 && a.filter(d => d.members.length).length >= 3, share, n: all.length };
    };
    let ex1 = { ok: false, share: 0, n: 0 }; try { ex1 = exOk(M.exampleDacs); } catch (e) { /* missing */ }
    check(`example preview: deterministic (two runs equal), the real list untouched, every DAC inside ONE faction (all-faction ones previewed in one), ${ex1.n} of ${L.owners.length} players placed (${(ex1.share * 100).toFixed(0)}%, most unassigned)`, ex1.ok && parsed2.length > 0);
    let exM1 = { ok: true }, exM2 = { ok: true };
    try { exM1 = exOk((l, d) => d.map(x => ({ ...x, example: true, members: l.owners.filter(() => Math.random() < 0.02).map(o => o.p) }))); } catch (e) { exM1 = { ok: false }; }
    try { exM2 = exOk((l, d) => { const r = M.exampleDacs(l, d); r.forEach((x, i) => { if (d[i]) d[i].members = x.members; }); return r; }); } catch (e) { exM2 = { ok: false }; }
    check('example preview - negative controls: an unseeded (random) assignment and one that writes into the real list are both caught', !exM1.ok && !exM2.ok, `random ${exM1.ok ? 'PASSED' : 'caught'}, writes-real ${exM2.ok ? 'PASSED' : 'caught'}`);
    parsed2.forEach(d => { d.members = []; });   // undo the mutant's write (it ran on the test's copy)
    // the pre-23:40 rule (an all-faction DAC drew from every faction) must be caught by the one-faction check
    let exM3 = { ok: true };
    try {
        exM3 = exOk((l, d) => {
            const out = d.map(x => ({ ...x, members: [], example: true }));
            for (const o of l.owners.filter(o => o && o.p && !o.npc).slice().sort((p, q) => (p.p < q.p ? -1 : 1))) {
                if (o.p.charCodeAt(3) % 5) continue;
                const c = out.filter(x => x.faction === 'all' || x.faction === o.fa);
                if (c.length) c[o.p.charCodeAt(5) % c.length].members.push(o.p);
            }
            return out;
        });
    } catch (e) { exM3 = { ok: false }; }
    check('example preview - negative control: an all-faction DAC drawing members from several factions is caught', !exM3.ok, exM3.ok ? 'PASSED' : 'caught');
    conquestChecks(parsed2);
}

// ---------------------------------------------------------------------------------------------------------------- [17]
// v7 (task #55, 2026-11-07): the DAC CONQUEST lens. The lead-pinned rule, restated here WITHOUT the module's helpers:
// per system and DAC, v = members' mining u/s (fleets at their system by the shared membership rule), claim stakes,
// ships at rest, and hot-combat events (24 h, kill once, nearest system within 1.2, tie lower address); T = the same over
// EVERY fleet / player / event (NPC included); score = sum of v/T over the selected metrics with T > 0; winner = the max
// score > 0, a tie within 1e-9 = contested; strength = score / number of metrics with T > 0; scope = one DAC competes.
function fleetSystemByHand(l, f, ast, sys) {
    if (!f.s || !Number.isFinite(f.x) || !Number.isFinite(f.y)) return null;
    if (f.s.kind === 'docked' && f.s.system) return f.s.system;
    if (f.s.kind === 'mining') return ast.get(f.s.asteroid) || null;
    let pt = [f.x, f.y];
    if ((f.s.kind === 'warp' || f.s.kind === 'subwarp') && Array.isArray(f.s.to) && Number.isFinite(f.s.arrives) && Number.isFinite(f.s.departs)) pt = f.s.arrives <= l.generatedAt - 120 ? f.s.to : null;
    if (!pt) return null;
    let at = null, bd = 0.36; for (const s of sys) { const d = (s.x - pt[0]) ** 2 + (s.y - pt[1]) ** 2; if (d < bd) { bd = d; at = s.a; } }
    return at;
}
function conquestByHand(l, evs, dacs, metrics, scope) {
    const ast = new Map((l.asteroids || []).map(a => [a.a, a.sys]));
    const sys = (l.systems || []).filter(s => Number.isFinite(s.x) && Number.isFinite(s.y));
    const comp = dacs.filter(d => !scope || d.tag === scope);
    const tagOf = new Map(); for (const d of comp) for (const p of d.members) tagOf.set(p, (tagOf.get(p) || []).concat(d.tag));
    const tot = {}, val = {};
    const T = (s, m, v) => { tot[s] = tot[s] || { mining: 0, stakes: 0, combat: 0, fleets: 0 }; tot[s][m] += v; };
    const V = (s, p, m, v) => { for (const t of tagOf.get(p) || []) { val[s] = val[s] || {}; val[s][t] = val[s][t] || { mining: 0, stakes: 0, combat: 0, fleets: 0 }; val[s][t][m] += v; } };
    for (const f of l.fleets) {
        const at = fleetSystemByHand(l, f, ast, sys); if (!at) continue;
        const u = (f.mine && f.mine.out || []).reduce((s, q) => s + (q.ups || 0), 0);
        T(at, 'mining', u); T(at, 'fleets', f.ships || 0);
        if (!f.npc) { V(at, f.o, 'mining', u); V(at, f.o, 'fleets', f.ships || 0); }
    }
    for (const k of l.stakes || []) if (k.sys) { T(k.sys, 'stakes', 1); V(k.sys, k.o, 'stakes', 1); }
    const ownerOfFleet = new Map(l.fleets.map(f => [f.a, f.o])), seen = new Set(), ref = l.generatedAt;
    for (const e of evs) {
        const hot = ['combat', 'destroyed', 'starbaseCombat', 'captured'].includes(e.k) || (e.k === 'gone' && e.afterCombat === true);
        if (!hot || !(e.t > ref - 86400 && e.t <= ref) || !Number.isFinite(e.x) || !Number.isFinite(e.y)) continue;
        if ((e.k === 'destroyed' || e.dead === true) && e.f) { if (seen.has(e.f)) continue; seen.add(e.f); }
        const c = sys.map(s => ({ s, d: (s.x - e.x) ** 2 + (s.y - e.y) ** 2 })).filter(x => x.d < 1.44).sort((a, b) => a.d - b.d || (a.s.a < b.s.a ? -1 : 1));
        if (!c.length) continue;
        T(c[0].s.a, 'combat', 1);
        if (e.npc !== true) V(c[0].s.a, typeof e.o === 'string' ? e.o : ownerOfFleet.get(e.f), 'combat', 1);
    }
    const out = new Map();
    for (const [a, t] of Object.entries(tot)) {
        const live = metrics.filter(m => t[m] > 0); if (!live.length) continue;
        const sc = {}; for (const [tag, v] of Object.entries(val[a] || {})) { const x = live.reduce((s, m) => s + v[m] / t[m], 0); if (x > 0) sc[tag] = x; }
        const best = Math.max(0, ...Object.values(sc)), lead = Object.keys(sc).filter(k => best - sc[k] <= 1e-9);
        out.set(a, { winner: best > 0 && lead.length === 1 ? lead[0] : null, contested: best > 0 && lead.length > 1, strength: best > 0 && lead.length === 1 ? best / live.length : 0, scores: sc });
    }
    return out;
}
function conquestChecks(parsedDacs) {
    console.log('\n[17] DAC conquest lens: M.dacConquest = an independent recount (real data, example assignment) + ties, contested, scope');
    const exD = M.resolveDacs(L, M.exampleDacs(L, parsedDacs)).dacs.map(d => ({ tag: d.tag, members: d.profiles }));
    const SETS = [['mining'], ['stakes'], ['combat'], ['fleets'], ['mining', 'stakes', 'combat', 'fleets'], ['mining', 'combat']];
    const sameAs = (r, hand) => {
        if (!r || !Array.isArray(r.systems) || r.systems.length !== hand.size) return `systems ${r && r.systems ? r.systems.length : '?'} vs ${hand.size}`;
        for (const s of r.systems) {
            const h = hand.get(s.a); if (!h) return 'extra ' + s.a;
            if (s.winner !== h.winner || s.contested !== h.contested || !near(s.strength, h.strength, 1e-9)) return `${s.n || s.a}: ${s.winner}/${s.contested}/${s.strength} vs ${h.winner}/${h.contested}/${h.strength}`;
            const ks = Object.keys(h.scores); if (ks.length !== Object.keys(s.scores).length || ks.some(k => !near(s.scores[k], h.scores[k], 1e-9))) return `${s.n || s.a}: scores differ`;
        }
        const by = {}; for (const h of hand.values()) if (h.winner) by[h.winner] = (by[h.winner] || 0) + 1;
        if (Object.keys(by).some(t => r.byDac[t] !== by[t]) || Object.entries(r.byDac).some(([t, n]) => (by[t] || 0) !== n)) return 'byDac differs';
        if (r.contested !== [...hand.values()].filter(h => h.contested).length) return 'contested count differs';
        const addrs = r.systems.map(s => s.a); if (addrs.join() !== addrs.slice().sort().join()) return 'not sorted by address';
        return '';
    };
    const conq = (l, e, d, m, s) => M.dacConquest(l, e, d, m, s);
    const stats = [];
    const realTest = f => SETS.every(ms => { const hand = conquestByHand(L, E, exD, ms, null); const why = sameAs(f(L, E, exD, ms, null), hand); if (f === conq) stats.push(`${ms.join('+')}: ${[...hand.values()].filter(h => h.winner).length} won/${hand.size}${why ? ' FAIL ' + why : ''}`); return !why; });
    const wonAll = [...conquestByHand(L, E, exD, SETS[4], null).values()].filter(h => h.winner).length;
    check(`real data + example assignment: positive control - the recount finds conquered systems (${wonAll} with all 4 metrics)`, wonAll > 5);
    ruleCheck('real data + example assignment: dacConquest = the by-hand recount for every metric set (winner, contested, strength, scores, byDac, address order)',
        realTest, typeof M.dacConquest === 'function' ? conq : (() => null),
        (l, e, d, m, s) => {   // mutant: totals from DAC members only (non-DAC players and NPCs ignored)
            const mem = new Set(d.flatMap(x => x.members));
            return M.dacConquest({ ...l, fleets: l.fleets.filter(f => mem.has(f.o) && !f.npc), stakes: (l.stakes || []).filter(k => mem.has(k.o)) }, e.filter(x => mem.has(x.o)), d, m, s); });
    console.log('    ' + stats.join('; '));
    ruleCheck('real data, all 4 metrics: the recount sees a wrong score (mutant: one DAC score per system inflated x7) - the comparison is not blind to scores',
        f => !sameAs(f(L, E, exD, SETS[4], null), conquestByHand(L, E, exD, SETS[4], null)), typeof M.dacConquest === 'function' ? conq : (() => null),
        (l, e, d, m, s) => { const r = M.dacConquest(l, e, d, m, s); for (const x of r.systems) { const k = Object.keys(x.scores); if (k.length) { x.scores[k[0]] *= 7; } } return r; });
    // synthetic: three systems, two DACs. A: AAA mines 3 of 6 u/s, BBB 3 of 6 -> contested; B: AAA 1 stake of 2, BBB none,
    // one non-DAC stake -> AAA 0.5; C: BBB ships 4 of 10 (NPC 6 ships count in T) -> BBB 0.4. Scope AAA: A -> AAA (BBB ignored).
    const SL = { generatedAt: 1000, systems: [{ a: 'SA', n: 'Sa', x: 0, y: 0 }, { a: 'SB', n: 'Sb', x: 10, y: 0 }, { a: 'SC', n: 'Sc', x: 20, y: 0 }], asteroids: [{ a: 'AST', sys: 'SA' }],
        fleets: [
            { a: 'f1', o: 'pa', x: 0, y: 0, ships: 1, s: { kind: 'mining', asteroid: 'AST' }, mine: { out: [{ ups: 3 }] } },
            { a: 'f2', o: 'pb', x: 0, y: 0, ships: 1, s: { kind: 'mining', asteroid: 'AST' }, mine: { out: [{ ups: 3 }] } },
            { a: 'f3', o: 'pb', x: 20, y: 0, ships: 4, s: { kind: 'idle' } },
            { a: 'f4', o: 'npc1', npc: true, x: 20.1, y: 0, ships: 6, s: { kind: 'idle' } }],
        stakes: [{ o: 'pa', sys: 'SB' }, { o: 'px', sys: 'SB' }] };
    const SD = [{ tag: 'AAA', members: ['pa'] }, { tag: 'BBB', members: ['pb'] }];
    const synth = f => {
        const r1 = f(SL, [], SD, ['mining'], null), r2 = f(SL, [], SD, ['stakes'], null), r3 = f(SL, [], SD, ['fleets'], null), r4 = f(SL, [], SD, ['mining'], 'AAA');
        const g = (r, a) => (r.systems || []).find(s => s.a === a) || {};
        return g(r1, 'SA').winner === null && g(r1, 'SA').contested === true && r1.contested === 1 && r1.byDac.AAA === 0
            && g(r2, 'SB').winner === 'AAA' && near(g(r2, 'SB').strength, 0.5) && r2.byDac.AAA === 1
            && g(r3, 'SC').winner === 'BBB' && near(g(r3, 'SC').strength, 0.4) && near(g(r3, 'SA').scores.AAA, 0.5) && g(r3, 'SA').contested === true
            && g(r4, 'SA').winner === 'AAA' && !g(r4, 'SA').contested && near(g(r4, 'SA').strength, 0.5) && !('BBB' in r4.byDac) && r4.byDac.AAA === 1;
    };
    ruleCheck('synthetic: an equal share is CONTESTED (no winner), stakes 1 of 2 -> strength 0.5, NPC ships count in the total (4 of 10 -> 0.4), scope = one DAC competes alone',
        synth, typeof M.dacConquest === 'function' ? conq : (() => null),
        (l, e, d, m, s) => { const r = M.dacConquest(l, e, d, m, null); return r; });   // mutant: scope ignored
    ruleCheck('synthetic: a tie never picks a winner by array order (mutant: first DAC wins a tie)',
        synth, typeof M.dacConquest === 'function' ? conq : (() => null),
        (l, e, d, m, s) => { const r = M.dacConquest(l, e, d, m, s); for (const x of r.systems) if (x.contested) { x.contested = false; x.winner = Object.keys(x.scores)[0]; r.byDac[x.winner]++; r.contested--; } return r; });
    // the real (empty) list: nothing conquered, every system neutral
    let empty = null; try { empty = M.dacConquest(L, E, parsedDacs.map(d => ({ tag: d.tag, members: [] })), SETS[4], null); } catch (e) { empty = null; }
    check('real (empty) DAC list: nothing conquered (every system winner null, byDac all 0, contested 0) - the map stays neutral', !!empty && empty.systems.length > 0 && empty.systems.every(s => s.winner === null && !s.contested) && Object.values(empty.byDac).every(n => n === 0) && empty.contested === 0);
    // hull names (fix C) and the deep-space label (fix E)
    const HL = [['Busan Pulse Mining Min Config', 'Busan Pulse', 'Mining Min'], ['Opal Jet Superchill Damage Min Config', 'Opal Jet', 'Superchill Damage Min'], ['Fimbul Lowbie Cargo Boost Min Config', 'Fimbul Lowbie', 'Cargo Boost Min'], ['Armstrong IMP Tip Default Config', 'Armstrong IMP Tip', ''], ['Fimbul BYOS Earp Default Config', 'Fimbul BYOS Earp', '']];
    ruleCheck('hull names: "X <variant> Min Config" -> short name X + variant tag, "X Default Config" -> X (5 real config names)',
        f => HL.every(([c, b, v]) => { const r = f(c); return r && r.base === b && r.variant === v; }), M.hullLabel || (() => null),
        c => ({ base: String(c).replace(/ Default Config$/, ''), variant: '' }));   // mutant: the v5 name (ellipsised in the drawer)
    const DS = [{ a: 'Z9', n: 'Zed', x: 2, y: 0 }, { a: 'A1', n: 'Ace', x: -2, y: 0 }, { a: 'M5', n: 'Mid', x: 0, y: 50 }];
    ruleCheck('deep-space label: "Deep space near <nearest system at ANY distance>", a tie goes to the lower address',
        f => f(DS, 0, 0) === 'Deep space near Ace' && f(DS.slice().reverse(), 0, 0) === 'Deep space near Ace' && f(DS, 1.5, 9) === 'Deep space near Zed' && f(DS, 0, 40) === 'Deep space near Mid',
        M.deepSpaceName || (() => null),
        (sys, x, y) => `Deep space ${Math.round(x)}, ${Math.round(y)}`);
}
