// c4-governance-check.js - checks the C4 Live governance read (Tools/c4-live/governance.mjs) and its hook in
// collector.mjs (latest.gov, enrichment rules).
// Run from the repo root:  node Test/c4-governance-check.js          (offline cases + one live read of z.ink)
//                          C4_OFFLINE=1 node Test/c4-governance-check.js   (no network)
// Fixture: C4_GOV_PROBE (probe dump, default Test/fixtures/c4-gov-probe.json) and C4_GOV_FIXTURE (the contract by
// example, default Test/fixtures/c4-gov-fixture.json). Missing = FAIL, never a skip.
// Every guard is also run as a MUTANT (a copy of the source with that guard removed, written next to the original so
// its imports resolve, deleted afterwards); a mutant that no case catches is itself a failure.
// Exit 0 = all pass, 1 = a check failed. Network (live case only): z.ink reads.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { pathToFileURL } = require('url');

const ROOT = path.join(__dirname, '..');
const KIT_DIR = path.join(ROOT, 'Tools', 'c4-live');
const GOV_SRC = path.join(KIT_DIR, 'governance.mjs');
const COLLECTOR_SRC = path.join(KIT_DIR, 'collector.mjs');
const OFFLINE = process.env.C4_OFFLINE === '1' || process.argv.includes('--offline');
const PROBE = process.env.C4_GOV_PROBE || path.join(ROOT, 'Test', 'fixtures', 'c4-gov-probe.json');
const FIXTURE = process.env.C4_GOV_FIXTURE || path.join(ROOT, 'Test', 'fixtures', 'c4-gov-fixture.json');
// Optional second reference fixture (the hand-written transform of the 2026-11-24 build), compared only when named.
const LEAD_FIXTURE = process.env.C4_GOV_LEAD_FIXTURE || null;
// cargo names as the 2026-11-24 live pass read them; c4-gov-fixture.json was built with exactly this map
const FIXTURE_NAMES = { 1007: 'Alloy Frame', 1027: 'Control Circuit', 1102: 'Generator Coils', 1016: 'Bio Stabilizer', 1199: 'Processing Matrix', 1243: 'Signal Booster' };

let fails = 0, passes = 0, skips = 0;
let quiet = false; // inside a mutant run: record, do not print
const ok = (cond, msg) => {
  if (quiet) { if (!cond) quiet.push(msg); return; }
  if (cond) { passes++; console.log('  PASS ' + msg); } else { fails++; console.log('  FAIL ' + msg); }
};
const throwsMsg = async (fn) => { try { await fn(); return null; } catch (e) { return String(e && e.message || e); } };

// ---- fake chain ------------------------------------------------------------------------------------
// accounts[type] = list of Buffers (whole account data). fail = { [type]: Error } -> that type's call throws.
function fakeRpc(G, accounts, fail = {}, calls = []) {
  const byDisc = new Map(Object.entries(G.GOV_TYPES).map(([n, [disc]]) => [Buffer.from(disc).toString('base64'), n]));
  return {
    getProgramAccounts(program, cfg) {
      return { send: async () => {
        const n = byDisc.get(cfg.filters[0].memcmp.bytes);
        calls.push({ program: String(program), n, offset: cfg.filters[0].memcmp.offset });
        if (!n) throw new Error('unknown discriminator filter');
        if (fail[n]) throw fail[n];
        return (accounts[n] || []).map((b, i) => ({ pubkey: `${n}-${i}`, account: { data: [b.toString('base64'), 'base64'] } }));
      } };
    },
  };
}
// a well-formed account of type n: its discriminator + zeros (every decoder here is fixed-size)
const zeroAcc = (G, n, extra = 0) => {
  const [disc, dec] = G.GOV_TYPES[n];
  const b = Buffer.alloc(dec().fixedSize + extra); Buffer.from(disc).copy(b, 0); return b;
};
const oneOfEach = (G) => Object.fromEntries(Object.keys(G.GOV_TYPES).map((n) => [n, [zeroAcc(G, n)]]));

// A slim fake world for collect() (same shape as Test/c4-collector-check.js fakeWorld).
function fakeWorld() {
  const sys = Array.from({ length: 10 }, (_, i) => ({ address: `S${i}`, name: `system ${i}`, regionId: 1, coordinates: { x: i, y: -i },
    starbase: null, celestialBodyAddresses: [`B${i}`], connections: [] }));
  const fl = Array.from({ length: 10 }, (_, i) => ({ address: `F${i}`, name: `fleet ${i}`, ownerProfile: { address: `P${i % 3}` },
    faction: 'mud', npcFactionId: 0, state: { kind: 'idle' }, location: { x: i, y: i }, hp: 100, sp: 50,
    stats: { combat: { hp: 100, sp: 50 }, cargo: {} }, shipCounts: { total: 1, small: 1 }, ships: [{ name: 'Pearce X4', quantity: 1, sizeClass: 'small' }],
    crewCount: 1, lastCombatUpdate: 1700000000 + i, lastUpdateAt: 1700000000, cargoHold: { items: [] } }));
  const bodies = sys.map((s, i) => ({ address: `B${i}`, id: i, name: `body ${i}`, kind: 'planet', system: { address: s.address }, details: { resources: [], claimedPlots: [] } }));
  return {
    createSageContext: () => ({ dispose: async () => {} }),
    discoverFleetAddresses: async () => fl.map((f) => f.address), getFleets: async () => fl, getStarSystems: async () => sys,
    getAllClaimStakes: async () => [], getFleetMiningState: async () => null, getCharacterForProfile: async () => ({ atlas: 1, xp: {}, counts: {} }),
    listClaimStakeDefinitions: async () => [], listClaimStakeBuildingDefinitions: async () => [], getAllCelestialBodies: async () => bodies,
    listCargoDefinitions: async () => [{ id: 0, name: 'Zero Cargo' }],
  };
}
const identStub = async (rpc, ownerIds) => ({ names: new Map(ownerIds.map((p) => [p, { name: 'N-' + p, trunc: false }])), wallets: new Map(), notes: [], calls: 0, ms: 0 });
const pricesStub = async () => ({ prices: null, fetched: false, notes: [], calls: 0, ms: 0 });
let imports = 0;
// The scenario's RPC URL carries a fake key, like a paid endpoint: it must never reach latest.json (A4).
const RPC_T = 'http://127.0.0.1:9/?api-key=GOVTESTKEY';
// steps: [{ epoch, accounts, fail, reader?, govLimitMs?, watchdogMs?, before? }] -> one { code, err, ms, latest, db }
// per pass, in ONE out dir. reader(pass, G, fakeRpc) replaces the governance reader; before(dir) runs before the pass.
async function scenario(collectorFile, govFile, steps) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'c4-gov-check-'));
  process.env.C4_OUT_DIR = dir;
  process.env.C4_RPC_URL = RPC_T; // a reader that reached the "real" chain here fails fast, offline
  const M = await import(pathToFileURL(collectorFile).href + `?gov=${++imports}`); // OUT is read at import time
  const G = await import(pathToFileURL(govFile).href);
  const out = [];
  try {
    for (const st of steps) {
      const pass = { aborted: false, ctx: null, abort: new AbortController() };
      const rpc = fakeRpc(G, st.accounts(G), st.fail || {});
      const readGovernance = st.reader ? st.reader(pass, G, rpc) : (_realRpc, opts) => G.readGovernance(rpc, opts);
      if (st.before) st.before(dir);
      const orig = console.log; console.log = () => {};
      let code, err = null, wdT = null;
      const deps = { chain: fakeWorld(), readEpoch: async () => ({ ...st.epoch }), readIdentities: identStub, refreshPrices: pricesStub };
      if (!st.noReader) deps.readGovernance = readGovernance;
      if (st.govLimitMs) deps.govLimitMs = st.govLimitMs;
      const t = Date.now();
      // a hung pass must fail THIS check, not hang it (a mutant without the governance limit hangs forever)
      const wd = new Promise((_, rej) => { wdT = setTimeout(() => rej(new Error(`WATCHDOG: the pass did not finish in ${st.watchdogMs || 20000} ms`)), st.watchdogMs || 20000); });
      try { code = await Promise.race([M.collect(pass, deps), wd]); }
      catch (e) { err = e; } finally { console.log = orig; clearTimeout(wdT); }
      const ms = Date.now() - t;
      const j = (f) => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { return null; } };
      out.push({ code, err, ms, latest: j('latest.json'), db: j('db.json') });
      if (err && /WATCHDOG/.test(err.message)) break; // the hung pass still holds the lock: later steps cannot run
    }
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  return out;
}

// ---- the cases ---------------------------------------------------------------------------------------
const E1 = { genesis: 'G1', sage: 1 }, E2 = { genesis: 'G2', sage: 2 };
const ALL_EMPTY = () => ({});
const noteHas = (r, s) => ((r.latest && r.latest.quality && r.latest.quality.notes) || []).some((n) => n.includes(s));

// The fees in force, one case per branch of the kit's resolver. Each edit makes the wrong source DIFFERENT from
// the right one (on the real chain today every candidate holds the same default, so the plain fixture cannot tell).
function feeBranchCases(G, rows0, at) {
  const R = JSON.parse(JSON.stringify(rows0));
  const DEF = { craft: 10000, mkt: 0, local: 0, dist: 0 };
  const P = (c, m, l, d) => ({ craftingFeeBps: c, localMarketFeeBps: m, localTreasuryShareBps: l, treasuryDistributionBps: d });
  const hist = R.democracySystemHistory, govs = R.starbaseGovernance;
  const on = hist.find((h) => Number(h.enabled) === 1 && R.democracyGenerationHistory.some((x) => x.address === h.generation));
  const off = hist.filter((h) => Number(h.enabled) === 0);
  const [B, C, D] = [off[0].system, off[1].system, off[2].system];
  ok(on && off.length >= 3, 'fee branches: the probe has an enabled history and 3 disabled ones to edit (positive control)');
  R.democracyGenerationHistory.find((x) => x.address === on.generation).activeParams = P(12000, 60, 500, 2000);
  for (const g of govs) g.activeParams = P(14000, 240, 4000, 8000);          // the legacy value, distinct everywhere
  off[0].baselineParams = P(13000, 120, 1000, 4000);                          // B keeps its (disabled) history
  R.democracyHistoryPolicy[0].defaultParams = P(11000, 30, 250, 1000);        // a policy default distinct from the constant
  R.democracySystemHistory = hist.filter((h) => h.system !== C && h.system !== D); // C and D lose their history
  govs.find((g) => g.system === C).enabled = 1;
  govs.find((g) => g.system === D).enabled = 0;
  const GB = G.buildGov(R, at, {}), S = GB.systems;
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  ok(eq(GB.policy.constant, DEF) && GB.policy.defaults.craft === 11000, `policy.constant stays the kit's constant when the policy default differs (${JSON.stringify(GB.policy.constant)})`);
  ok(S[on.system].src === 'generation' && eq(S[on.system].fees, { craft: 12000, mkt: 60, local: 500, dist: 2000 }), `fee branch: history enabled -> the generation's activeParams, src generation (${JSON.stringify(S[on.system].fees)} ${S[on.system].src})`);
  ok(S[B].src === 'baseline' && eq(S[B].fees, DEF), `fee branch: history disabled -> the constant default (not baselineParams, not legacy), src baseline (${JSON.stringify(S[B].fees)} ${S[B].src})`);
  ok(S[C].src === 'governance' && eq(S[C].fees, { craft: 14000, mkt: 240, local: 4000, dist: 8000 }), `fee branch: no history + governance enabled -> starbaseGovernance.activeParams, src governance (${JSON.stringify(S[C].fees)} ${S[C].src})`);
  ok(S[D].src === 'default' && eq(S[D].fees, DEF), `fee branch: no history + governance off -> the constant default (not the policy default), src default (${JSON.stringify(S[D].fees)} ${S[D].src})`);
  const legacy = Object.values(S).filter((s) => s.fees.mkt === 240).length;
  ok(legacy === 1, `the legacy governance fees appear only where the kit uses them (${legacy} system)`);
}

// A2 (a): a system whose starbase changed hands. The OLD governance keeps its own history, generation, days,
// ballot, module status / project / contribution and allocation / backing on chain; each old row is listed FIRST
// (the order a by-system [0] would take) and carries values distinct from the live ones. Expected = the block of
// the same chain WITHOUT the old rows: only the live governance's rows may appear.
function supersededCases(G, rows0, at) {
  const C = (o) => JSON.parse(JSON.stringify(o));
  const L = C(rows0);
  const al0 = L.democracyPtrAllocation[0], X = al0.system;
  const g = L.starbaseGovernance.find((r) => r.system === X);
  const h = L.democracySystemHistory.find((r) => r.system === X);
  const gen = L.democracyGenerationHistory.find((r) => r.address === h.generation);
  const pj = L.governanceModuleProject.find((r) => r.system === X), st = L.governanceModuleStatus.find((r) => r.system === X);
  const ct = L.governanceModuleContribution.find((r) => r.project === pj.address), bk = L.democracyPtrBacking.find((r) => r.allocation === al0.address);
  const bl = L.democracyWeeklyBallot.find((r) => r.generation === h.generation), dy = L.democracyHistoryDay.find((r) => r.system === X);
  ok([g, h, gen, pj, st, ct, bk, bl, dy].every(Boolean), 'superseded: the probe system with an allocation has every per-system row to copy (positive control)');
  if (![g, h, gen, pj, st, ct, bk, bl, dy].every(Boolean)) return;
  // the live governance is sequence 1 now; every live row of X follows it
  g.starbaseSeqId = '1'; g.previousGovernance = 'OLDGOV';
  for (const n of Object.keys(L)) for (const r of L[n]) if (r.starbaseSeqId !== undefined && (r.system === X || r.project === pj.address || r.allocation === al0.address)) r.starbaseSeqId = '1';
  pj.installedAt = '0'; st.installedAt = '1795000001';                        // so the module status is read
  const M = C(L);
  const old = (o, f) => Object.assign(C(o), { starbaseSeqId: '0' }, f);
  const first = (n, ...r) => { M[n] = [...r, ...M[n]]; };
  first('starbaseGovernance', old(g, { address: 'OLDGOV', successorGovernance: g.address, previousGovernance: '11111111111111111111111111111111', controllerFaction: '1' }));
  first('democracySystemHistory', old(h, { address: 'OLDHIST', governance: 'OLDGOV', generation: 'OLDGEN', enabled: '1', openPool: '777' }));
  first('democracyGenerationHistory', old(gen, { address: 'OLDGEN', governance: 'OLDGOV', eligiblePower: '999999', fundedAtlas: '5' }));
  first('democracyHistoryDay', ...[1, 2, 3].map((i) => old(dy, { address: 'OLDDAY' + i, governance: 'OLDGOV', generation: 'OLDGEN', day: String(30000 + i), eligiblePower: '55' })));
  first('democracyWeeklyBallot', old(bl, { address: 'OLDBALLOT', generation: 'OLDGEN', cutoffDay: '30000', receiptCount: '9' }));
  first('governanceModuleStatus', old(st, { address: 'OLDST', installedAt: '123' }));
  first('governanceModuleProject', old(pj, { address: 'OLDPJ', installed: '0', funded: pj.funded.map(() => '5') }));
  first('governanceModuleContribution', old(ct, { address: 'OLDCT1', project: 'OLDPJ', profile: 'OLDPROFILE1', lpEarned: '99999999' }),
    old(ct, { address: 'OLDCT2', profile: 'OLDPROFILE2', lpEarned: '88888888' }));       // the LIVE project, the old sequence
  first('democracyPtrAllocation', old(al0, { address: 'OLDAL', governance: 'OLDGOV', activePvp: '9000000', crew: '77' }),
    old(al0, { address: 'OLDAL2', governance: 'OLDGOV', starbaseSeqId: '1', activePvp: '8000000', crew: '66' })); // same sequence, other governance
  first('democracyPtrBacking', old(bk, { address: 'OLDBK1', allocation: 'OLDAL', playerProfile: 'OLDPROFILE3' }),
    old(bk, { address: 'OLDBK2', playerProfile: 'OLDPROFILE4' }));                       // the LIVE allocation, the old sequence
  const want = G.buildGov(L, at, {}), got = G.buildGov(M, at, {});
  const J = JSON.stringify;
  const s0 = want.systems[X], s1 = got.systems[X];
  ok(s1 && s1.ctl === s0.ctl && Object.keys(got.systems).length === Object.keys(want.systems).length, 'superseded: one system entry, the live governance (controller of the live one)');
  ok(s1 && J(s1.mod) === J(s0.mod) && s1.mod.at === 1795000001, `superseded: the module project and status are the live governance's (${s1 && J(s1.mod).slice(0, 80)})`);
  ok(s1 && s1.power === s0.power && J(s1.poolRaw) === J(s0.poolRaw) && s1.on === s0.on, `superseded: history + generation are the live ones (power ${s1 && s1.power}, open pool ${s1 && s1.poolRaw && s1.poolRaw.open})`);
  ok(s1 && J(s1.ballot) === J(s0.ballot), `superseded: the ballot of the old generation is not shown (cutoff ${s1 && s1.ballot && s1.ballot.cutoffDay})`);
  ok(s1 && J(s1.days) === J(s0.days), `superseded: no day of the old governance (${s1 && s1.days.map((d) => d.d).join(',')})`);
  ok(s1 && s1.voters === s0.voters && s1.crew === s0.crew, `superseded: only the live allocations count (voters ${s1 && s1.voters}, crew ${s1 && s1.crew})`);
  ok(J(got.voters) === J(want.voters), `superseded: voters.top holds only the live allocations and backings (${J(got.voters.top.map((t) => t.p))})`);
  ok(J(got.contributors) === J(want.contributors), `superseded: contributors only of the live project and sequence (${J(got.contributors.map((c) => c.p)).slice(0, 120)})`);
  const same = (() => { try { assert.deepStrictEqual(got.systems, want.systems); return true; } catch { return false; } })(); // key order may differ
  ok(same, 'superseded: the whole systems map equals the chain without the old rows');
}

// A2 (b)-(d): newest ballot wins, last 7 of 9 days ascending, voters.top sorted by power and capped at 50 of 60.
function orderCases(G, rows0, at) {
  const C = (o) => JSON.parse(JSON.stringify(o));
  const R = C(rows0);
  const al0 = R.democracyPtrAllocation[0], X = al0.system, bk0 = R.democracyPtrBacking[0];
  const h = R.democracySystemHistory.find((r) => r.system === X);
  const bl = R.democracyWeeklyBallot.find((r) => r.generation === h.generation);
  // (b) an older ballot of the same generation, listed first
  R.democracyWeeklyBallot = [Object.assign(C(bl), { address: 'BALLOT-OLDER', cutoffDay: String(Number(bl.cutoffDay) - 7), receiptCount: '3' }), ...R.democracyWeeklyBallot];
  // (c) 9 days of X, listed newest first
  const d0 = R.democracyHistoryDay.find((r) => r.system === X);
  R.democracyHistoryDay = R.democracyHistoryDay.filter((r) => r.system !== X);
  const dayNums = Array.from({ length: 9 }, (_, i) => 21000 + i);
  for (const d of [...dayNums].reverse()) R.democracyHistoryDay.push(Object.assign(C(d0), { address: 'DAY' + d, day: String(d), eligiblePower: String(d - 20000) }));
  // (d) 60 allocations in X, powers in a scrambled order, each with its backing
  R.democracyPtrAllocation = []; R.democracyPtrBacking = [];
  for (let i = 0; i < 60; i++) {
    const pw = 1000 + ((i * 37) % 60) * 10;
    R.democracyPtrAllocation.push(Object.assign(C(al0), { address: 'AL' + i, activePvp: String(pw) }));
    R.democracyPtrBacking.push(Object.assign(C(bk0), { address: 'BK' + i, allocation: 'AL' + i, playerProfile: 'P' + pw }));
  }
  const g = G.buildGov(R, at, {}), s = g.systems[X];
  ok(s.ballot && s.ballot.cutoffDay === Number(bl.cutoffDay) && s.ballot.receipts === Number(bl.receiptCount), `order: the newest ballot (largest cutoffDay) wins (${s.ballot && s.ballot.cutoffDay})`);
  ok(JSON.stringify(s.days.map((d) => d.d)) === JSON.stringify(dayNums.slice(-7)), `order: days = the last 7 of 9, ascending (${s.days.map((d) => d.d).join(',')})`);
  const pw = g.voters.top.map((t) => t.power);
  ok(g.voters.allocating === 60 && pw.length === 50 && pw.every((p, i) => !i || pw[i - 1] >= p) && pw[0] === 1590 && pw[49] === 1100,
    `order: voters.top sorted by power, 50 of 60 (allocating ${g.voters.allocating}, ${pw.length} rows, ${pw[0]}..${pw[pw.length - 1]})`);
  ok(g.voters.top[0].p === 'P1590', `order: a top row carries its own backing's profile (${g.voters.top[0].p})`);
}

async function readerCases(G, P, F) {
  // [1] fixture: buildGov(probe) deep-equals the contract by example, apart from the fields this builder adds
  if (P && F) {
    const rows = Object.fromEntries(Object.keys(G.GOV_TYPES).map((n) => [n, ((P.types[n] || {}).samples || []).map((s) => ({ address: s.address, ...s.data }))]));
    const full = Object.keys(G.GOV_TYPES).every((n) => P.types[n] && P.types[n].count === rows[n].length);
    ok(full, 'probe dump holds every row of the 15 read types (count == samples)');
    let g = null, err = null;
    try { g = G.buildGov(rows, P.takenAt, FIXTURE_NAMES); } catch (e) { err = e; }
    ok(!err, `buildGov runs on the probe dump${err ? ': ' + err.message : ''}`);
    const diffOf = (a, b) => { try { assert.deepStrictEqual(a, b); return null; } catch (e) { return e.message.split('\n').slice(0, 12).join(' | '); } };
    if (g) {
      const d = diffOf(JSON.parse(JSON.stringify(g)), F);
      ok(!d, `buildGov(probe) deep-equals Test/fixtures/c4-gov-fixture.json, every field${d ? ': ' + d : ''}`);
      // the lead's reference fixture (scratch, while it exists): equal on every field it has
      const LF = LEAD_FIXTURE && (() => { try { return JSON.parse(fs.readFileSync(LEAD_FIXTURE, 'utf8')); } catch { return null; } })();
      if (LF) {
        // fields added after the lead's fixture: v, policy.constant (A3, A5), bill[].n; atlasDecimals is removed (A3)
        const strip = JSON.parse(JSON.stringify(g)); delete strip.v; delete strip.policy.constant; for (const r of strip.module.bill) delete r.n;
        const LF2 = { ...LF }; delete LF2.atlasDecimals;
        const d2 = diffOf(strip, { ...LF2, counts: Object.fromEntries(Object.keys(G.GOV_TYPES).map((n) => [n, LF.counts[n]])) });
        ok(!d2, `buildGov(probe) equals the lead's reference fixture on the shared fields${d2 ? ': ' + d2 : ''}`);
      } else if (!quiet && LEAD_FIXTURE) { skips++; console.log(`  SKIP the lead's reference fixture is gone (${LEAD_FIXTURE})`); }
      const g3 = G.buildGov(rows, P.takenAt, { 1007: 'Cargo 1007' });
      ok(g3.module.bill.find((r) => r.id === 1007).n === 'Cargo 1007' && !('n' in g3.module.bill.find((r) => r.id === 1102)), 'bill[].n = the cargo name when known, absent when not (positive + negative)');
      ok(!('atlasDecimals' in g) && g.v === 1, `the block carries shape v 1 and NO atlasDecimals (unverified divisor) (v ${g.v}, atlasDecimals ${'atlasDecimals' in g ? g.atlasDecimals : 'absent'})`);
      ok(JSON.stringify(g.policy.constant) === JSON.stringify({ craft: 10000, mkt: 0, local: 0, dist: 0 }), `policy.constant = the kit's constant fees (${JSON.stringify(g.policy.constant)})`);
      supersededCases(G, rows, P.takenAt);
      orderCases(G, rows, P.takenAt);
      ok(JSON.stringify(g).length > 10000 && Object.keys(g.systems).length === 36, `positive control: the probe block has 36 systems (${Object.keys(g.systems).length})`);
      // the same rows as the decoders give them live (bigint, not the dump's strings) build the same block
      const big = (v) => (typeof v === 'string' && /^-?\d+$/.test(v) && v.length > 0 ? BigInt(v) : Array.isArray(v) ? v.map(big) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === 'address' || k === 'system' ? x : big(x)])) : v);
      let g2 = null; try { g2 = G.buildGov(big(rows), P.takenAt, FIXTURE_NAMES); } catch (e) { g2 = { err: e.message }; }
      ok(JSON.stringify(g2) === JSON.stringify(g), 'bigint rows (as the live decoders give) build the identical block');
      feeBranchCases(G, rows, P.takenAt);
    }
  } else ok(false, `fixture files present (${PROBE}, ${FIXTURE})`);

  // [2] u64 beyond 2^53 is kept as a string, never rounded
  ok(G.N(9007199254740993n) === '9007199254740993' && G.N(40000n) === 40000 && G.N('12') === 12, 'N(): exact Number below 2^53, decimal string above');

  // [3] empty chain: 0 accounts of every type = a well-formed empty block
  {
    const calls = [];
    let g = null; const e = await throwsMsg(async () => { g = await G.readGovernance(fakeRpc(G, {}, {}, calls), { takenAt: 1 }); });
    ok(!e, `empty chain: no crash${e ? ' (' + e + ')' : ''}`);
    ok(g && g.at === 1 && JSON.stringify(g.systems) === '{}' && g.voters.top.length === 0 && g.contributors.length === 0 && g.policy === null && g.module === null
      && Array.isArray(g.housing) && Object.values(g.counts).every((c) => c === 0) && Object.keys(g.counts).length === 15, 'empty chain: empty systems/voters/contributors, null policy/module, 15 zero counts');
    ok(calls.length === 15 && calls.every((c) => c.program === G.SAGE_PROGRAM_ADDRESS && c.offset === 0n) && new Set(calls.map((c) => c.n)).size === 15, `one call per type, on the SAGE program, memcmp at 0 (${calls.length} calls)`);
  }
  // [4] one well-formed zero account of every type decodes (positive control for the sabotage cases)
  {
    let g = null; const e = await throwsMsg(async () => { g = await G.readGovernance(fakeRpc(G, oneOfEach(G)), { takenAt: 1 }); });
    ok(!e && g && Object.keys(g.systems).length === 1, `positive control: one zero account per type reads (${e || Object.keys(g.systems).length + ' system'})`);
  }
  // [5] decode sabotage: a truncated / extended / wrong-discriminator account throws - the whole read
  for (const [label, mk] of [
    ['truncated by 1 byte', (G2) => { const b = zeroAcc(G2, 'democracyHistoryDay'); return b.subarray(0, b.length - 1); }],
    ['8 trailing bytes', (G2) => zeroAcc(G2, 'democracyHistoryDay', 8)],
    ['wrong discriminator', (G2) => { const b = zeroAcc(G2, 'democracyHistoryDay'); b[0] ^= 0xff; return b; }],
  ]) {
    const acc = oneOfEach(G); acc.democracyHistoryDay = [acc.democracyHistoryDay[0], mk(G)];
    const e = await throwsMsg(() => G.readGovernance(fakeRpc(G, acc), { takenAt: 1 }));
    ok(e && /democracyHistoryDay/.test(e), `decode sabotage (${label}) makes the read throw${e ? ': ' + e.slice(0, 90) : ''}`);
  }
  // [6] an RPC failure on ONE type fails the whole read (never a partial block)
  {
    const e = await throwsMsg(() => G.readGovernance(fakeRpc(G, oneOfEach(G), { democracyPtrRoot: new Error('INJECTED rpc 429') }), { takenAt: 1 }));
    ok(e && e.includes('INJECTED'), `one failed type fails the read${e ? ': ' + e : ''}`);
  }
  // [7] rows of another game on the same program are dropped
  {
    const acc = oneOfEach(G);
    const g = await G.readGovernance(fakeRpc(G, acc), { takenAt: 1, game: 'EKEj47SzaCjPM3m4T4vRXrrsVtkEmiNgPMMFye3AkXj4' });
    const g0 = await G.readGovernance(fakeRpc(G, acc), { takenAt: 1, game: '11111111111111111111111111111111' });
    ok(Object.keys(g.systems).length === 0 && Object.keys(g0.systems).length === 1, 'game filter: another game\'s rows dropped, this game\'s kept');
  }
}

async function collectorCases(collectorFile, govFile) {
  const r = await scenario(collectorFile, govFile, [
    { epoch: E1, accounts: oneOfEach },                                               // 0 good read
    { epoch: E1, accounts: oneOfEach, fail: { democracyHistoryDay: new Error('INJECTED 429') } }, // 1 one type fails
    { epoch: E2, accounts: oneOfEach, fail: { democracyHistoryDay: new Error('INJECTED 429') } }, // 2 new version + fail
    { epoch: E2, accounts: ALL_EMPTY },                                               // 3 empty chain, nothing before
    { epoch: E2, accounts: oneOfEach },                                               // 4 good
    { epoch: E2, accounts: ALL_EMPTY },                                               // 5 suddenly empty = suspect
    { epoch: E2, accounts: ALL_EMPTY, noReader: true },                               // 6 fake chain, no reader given
  ]);
  const [a, b, c, d, e, f, g] = r;
  ok(g.latest && g.latest.gov === null && !noteHas(g, 'governance') && !g.latest.quality.govFailed, 'a fake chain without a governance reader reads no governance (no real-chain call, no note)');
  ok(r.every((x) => !x.err && x.code === 0), `every pass completes, exit 0 (${r.map((x) => x.err ? 'ERR ' + x.err.message.slice(0, 60) : x.code).join(', ')})`);
  ok(a.latest && a.latest.gov && Object.keys(a.latest.gov.systems).length === 1 && a.db.state.gov && !a.latest.quality.govFailed, 'good read: latest.gov written, kept in db.json state.gov, no govFailed');
  ok(b.latest && JSON.stringify(b.latest.gov) === JSON.stringify(a.latest.gov), 'one type fails: latest.gov is the PREVIOUS block, unchanged (its own at)');
  ok(b.latest && noteHas(b, 'governance read failed') && noteHas(b, 'keeping governance read at') && b.latest.quality.govFailed === true, 'one type fails: a quality note + govFailed');
  ok(b.latest && b.latest.quality.partial === false, 'one type fails: the pass is NOT partial');
  ok(c.latest && c.latest.gov === null && noteHas(c, 'no governance shown') && !(c.db && c.db.state.gov), 'new chain version + failed read: the old block is dropped (latest.gov null, not in db)');
  ok(d.latest && d.latest.gov && JSON.stringify(d.latest.gov.systems) === '{}' && !d.latest.quality.govFailed, 'empty chain with nothing before: a well-formed empty block, no note');
  ok(f.latest && JSON.stringify(f.latest.gov) === JSON.stringify(e.latest.gov) && noteHas(f, 'governance read suspect'), 'suddenly 0 systems after 1: suspect, previous block kept + note');
  return r;
}

// A1 (own limit + pass abort), A3 (old-shape block not re-served), A4 (RPC URL redacted)
async function collectorCases2(collectorFile, govFile) {
  const editDb = (dir, f) => { const p = path.join(dir, 'db.json'); const db = JSON.parse(fs.readFileSync(p, 'utf8')); f(db.state.gov); fs.writeFileSync(p, JSON.stringify(db)); };
  let sawSig = null;
  const hung = () => (_rpc, opts) => { sawSig = opts.signal; return new Promise(() => {}); }; // never settles, ignores the signal
  const abortsPass = (pass) => (_rpc, opts) => {
    setTimeout(() => pass.abort.abort(), 50);
    return new Promise((_, rej) => opts.signal.addEventListener('abort', () => rej(new Error('reader saw the abort')), { once: true }));
  };
  const r = await scenario(collectorFile, govFile, [
    { epoch: E1, accounts: oneOfEach },                                                         // 0 good
    { epoch: E1, accounts: oneOfEach, reader: hung, govLimitMs: 300 },                           // 1 hung read, 0.3 s limit
    { epoch: E1, accounts: oneOfEach, reader: abortsPass, govLimitMs: 20000, watchdogMs: 4000 }, // 2 pass abort mid read
    { epoch: E1, accounts: oneOfEach, fail: { democracyPtrRoot: new Error(`request to ${RPC_T} failed, reason: 429`) } }, // 3 URL in the error
    { epoch: E1, accounts: oneOfEach },                                                         // 4 good again
    { epoch: E1, accounts: oneOfEach, fail: { democracyPtrRoot: new Error('INJECTED') }, before: (d) => editDb(d, (g) => { delete g.v; }) }, // 5 old shape: no v
    { epoch: E1, accounts: oneOfEach },                                                         // 6 good again
    { epoch: E1, accounts: oneOfEach, fail: { democracyPtrRoot: new Error('INJECTED') }, before: (d) => editDb(d, (g) => { g.atlasDecimals = 8; }) }, // 7 v 1 + atlasDecimals
  ]);
  const [a, b, c, d, , f, , h] = r;
  const fine = (x) => x && !x.err && x.code === 0 && x.latest;
  ok(r.length === 8 && r.every((x) => !x.err && x.code === 0), `limits: every pass completes, exit 0 (${r.map((x) => x.err ? 'ERR ' + x.err.message.slice(0, 70) : x.code).join(', ')})`);
  ok(fine(b) && b.ms < 5000 && noteHas(b, 'governance read failed: timed out after 0.3 s') && JSON.stringify(b.latest.gov) === JSON.stringify(a.latest.gov),
    `limits: a governance read that never settles fails at its own limit, the pass still writes and keeps the previous block (${b && b.ms} ms)`);
  ok(sawSig && sawSig.aborted, 'limits: the reader\'s signal is aborted when the limit fires (in-flight calls are cancelled)');
  ok(fine(c) && c.ms < 3000 && noteHas(c, 'governance read failed'), `limits: the pass abort reaches the governance reader through the combined signal (${c && c.ms} ms)`);
  ok(fine(d) && noteHas(d, 'governance read failed') && !JSON.stringify(d.latest).includes('GOVTESTKEY') && noteHas(d, '127.0.0.1:9'),
    `redact: an RPC error quoting the URL reaches the note as the host only (${fine(d) && (d.latest.quality.notes || []).find((n) => n.includes('governance'))})`);
  ok(fine(f) && f.latest.gov === null && noteHas(f, 'older shape') && !(f.db && f.db.state.gov), `shape: a stored block without v + a failed read -> gov null, note says why`);
  ok(fine(h) && h.latest.gov === null && noteHas(h, 'older shape'), 'shape: a stored block carrying atlasDecimals + a failed read -> gov null, note says why');
  ok(fine(a) && a.latest.gov.v === 1 && !('atlasDecimals' in a.latest.gov), 'shape: a fresh block is written with v 1 and no atlasDecimals (positive control: step 3 kept it)');
  return r;
}

// ---- mutants: each removes one guard; the named cases must catch it --------------------------------------
const MUTANTS = [
  { file: 'gov', label: 'no size check', from: "if (typeof decoder.fixedSize === 'number' && data.length !== decoder.fixedSize)", to: 'if (false)' },
  { file: 'gov', label: 'no discriminator check', from: 'if (data[i] !== disc[i]) throw', to: 'if (false) throw' },
  { file: 'gov', label: 'a failed type becomes empty (partial block)', from: 'try { rowsByType[n] = await readGovType(rpc, program, n, { signal, game }); } catch (e) { failed ??= e; throw e; }', to: 'try { rowsByType[n] = await readGovType(rpc, program, n, { signal, game }); } catch (e) { rowsByType[n] = []; }' },
  { file: 'gov', label: 'disabled history uses baselineParams', from: "[{ ...DEFAULT_FEES }, 'baseline']", to: "[fees(h.baselineParams), 'baseline']" },
  { file: 'gov', label: 'disabled history uses the legacy governance fees', from: "[{ ...DEFAULT_FEES }, 'baseline']", to: "[fees(g.activeParams), 'baseline']" },
  { file: 'gov', label: 'enabled history uses the legacy governance fees', from: "on && gen ? [fees(gen.activeParams), 'generation']", to: "on && gen ? [fees(g.activeParams), 'generation']" },
  { file: 'gov', label: 'no history ignores governance.enabled', from: ': N(g.enabled) === 1 ?', to: ': false ?' },
  { file: 'gov', label: 'no history uses the policy default', from: "[{ ...DEFAULT_FEES }, 'default']", to: "[policy ? fees(policy.defaultParams) : { ...DEFAULT_FEES }, 'default']" },
  { file: 'gov', label: 'empty chain crashes on govs[0]', from: 'govs.length ? N(govs[0].voteEpochDurationSecs) : null', to: 'N(govs[0].voteEpochDurationSecs)' },
  { file: 'gov', label: 'no game filter', from: "if (game && row.gameId !== undefined && String(row.gameId) !== String(game)) continue;", to: '' },
  { file: 'gov', label: 'u64 rounded through Number', from: 'return b <= MAX_SAFE && b >= -MAX_SAFE ? Number(b) : b.toString();', to: 'return Number(b);' },
  { file: 'col', label: 'failed read does not keep the previous block', from: '      gov = prevGov;\n', to: '      gov = null;\n' },
  { file: 'col', label: 'previous block read from disk, surviving a new chain version', from: 'const storedGov = db.state.gov && typeof db.state.gov === \'object\' ? db.state.gov : null;', to: 'const storedGov = loadDb().state.gov || null;' },
  // A1 own limit
  { file: 'col', label: 'no governance limit (timer never set)', from: 'const govTimer = setTimeout(', to: 'const govTimer = 0 && setTimeout(' },
  { file: 'col', label: 'no race (a reader that ignores the signal hangs the pass)', from: 'gov = await Promise.race([', to: 'gov = await Promise.any([' },
  { file: 'col', label: 'pass abort not combined into the governance signal', from: 'AbortSignal.any([pass.abort.signal, govCtl.signal])', to: 'AbortSignal.any([govCtl.signal])' },
  { file: 'col', label: 'the limit does not abort the reader\'s signal', from: '() => govCtl.abort(new Error(', to: '() => govCtl.signal.dispatchEvent(new Event(\'abort\')) && (new Error(' },
  // A3 shape
  { file: 'col', label: 'a stored block without v is re-served', from: "storedGov && storedGov.v === GOV_SHAPE && !('atlasDecimals' in storedGov)", to: "storedGov && !('atlasDecimals' in storedGov)" },
  { file: 'col', label: 'a stored block with atlasDecimals is re-served', from: "storedGov && storedGov.v === GOV_SHAPE && !('atlasDecimals' in storedGov)", to: 'storedGov && storedGov.v === GOV_SHAPE' },
  { file: 'col', label: 'the note does not say the stored block was dropped', from: "storedGov && !prevGov ? ' (the stored block has an older shape and was dropped)' : ''", to: "''" },
  { file: 'gov', label: 'block without its shape version', from: '    v: GOV_SHAPE,\n', to: '' },
  { file: 'gov', label: 'atlasDecimals still emitted', from: '    v: GOV_SHAPE,\n', to: '    v: GOV_SHAPE, atlasDecimals: 8,\n' },
  // A4 redaction
  { file: 'col', label: 'governance note not redacted', from: 'String(e?.message ?? e).split(RPC_URL).join(RPC_LABEL).slice(0, 120)', to: 'String(e?.message ?? e).slice(0, 120)' },
  // A5 constant
  { file: 'gov', label: 'policy.constant = the policy defaults', from: 'constant: { ...DEFAULT_FEES }', to: 'constant: fees(policy.defaultParams)' },
  // A2 live-governance filters, one each
  { file: 'gov', label: 'history of an old governance mixes in', from: "rows('democracySystemHistory').filter(ofLive)", to: "rows('democracySystemHistory')" },
  { file: 'gov', label: 'days of an old governance mix in', from: "rows('democracyHistoryDay').filter(ofLive)", to: "rows('democracyHistoryDay')" },
  { file: 'gov', label: 'ballots keyed by system (an old generation\'s ballot wins)', from: ["by(rows('democracyWeeklyBallot'), 'generation')", '(h && ballots.get(String(h.generation)))'], to: ["by(rows('democracyWeeklyBallot'), 'system')", 'ballots.get(sys)'] },
  { file: 'gov', label: 'module status of an old governance mixes in', from: "rows('governanceModuleStatus').filter(ofLive)", to: "rows('governanceModuleStatus')" },
  { file: 'gov', label: 'module project of an old governance mixes in', from: "rows('governanceModuleProject').filter(ofLive)", to: "rows('governanceModuleProject')" },
  { file: 'gov', label: 'contributions of an old sequence mix in', from: "rows('governanceModuleContribution').filter((c) => liveProject.has(String(c.project)) && sameSeq(c, liveProject.get(String(c.project))))", to: "rows('governanceModuleContribution')" },
  { file: 'gov', label: 'allocations of an old governance mix in', from: "rows('democracyPtrAllocation').filter(ofLive)", to: "rows('democracyPtrAllocation')" },
  { file: 'gov', label: 'backings of an old sequence mix in', from: "rows('democracyPtrBacking').filter((k) => liveAlloc.has(String(k.allocation)) && sameSeq(k, liveAlloc.get(String(k.allocation))))", to: "rows('democracyPtrBacking')" },
  { file: 'gov', label: 'governance address not compared', from: "String(r.governance) !== String(g.address)) return false;", to: 'false) return false;' },
  { file: 'gov', label: 'sequence not compared', from: 'return r.starbaseSeqId === undefined || B(r.starbaseSeqId) === B(g.starbaseSeqId);', to: 'return true;' },
  { file: 'gov', label: 'ballot not sorted (first listed wins)', from: '.sort((x, y) => (B(y.cutoffDay) > B(x.cutoffDay) ? 1 : B(y.cutoffDay) < B(x.cutoffDay) ? -1 : 0))[0]', to: '[0]' },
  { file: 'gov', label: 'days not sorted', from: '.sort((x, y) => (B(x.day) > B(y.day) ? 1 : B(x.day) < B(y.day) ? -1 : 0)).slice(-7)', to: '.slice(-7)' },
  { file: 'gov', label: 'days: the first 7, not the last 7', from: ': 0)).slice(-7)', to: ': 0)).slice(0, 7)' },
  { file: 'gov', label: 'voters.top not sorted', from: 'top.sort((a, b) => (b.pb > a.pb ? 1 : b.pb < a.pb ? -1 : 0));', to: '' },
  { file: 'gov', label: 'voters.top not capped at 50', from: 'top: top.slice(0, 50).map(', to: 'top: top.map(' },
  { file: 'col', label: 'no suspect guard', from: 'if (!n && prevN) {', to: 'if (false) {' },
  { file: 'col', label: 'governance failure marks the pass partial', from: '      quality.govFailed = true;\n', to: '      quality.govFailed = true; quality.partial = true;\n' },
  { file: 'col', label: 'a fake chain falls through to the real reader', from: 'deps.readGovernance || (deps.chain ? null : readGovernance)', to: 'deps.readGovernance || readGovernance' },
  { file: 'col', label: 'block not kept in db.json', from: '        ...(gov ? { gov } : {}), // last good', to: '        // last good' },
];
async function runMutants(G0, P, F) {
  console.log('\n[mut] each guard removed must fail a case');
  const govText = fs.readFileSync(GOV_SRC, 'utf8'), colText = fs.readFileSync(COLLECTOR_SRC, 'utf8');
  for (const [i, m] of MUTANTS.entries()) {
    const src = m.file === 'gov' ? govText : colText;
    const froms = [].concat(m.from), tos = [].concat(m.to);
    if (!froms.every((x) => src.split(x).length === 2)) { ok(false, `mutant "${m.label}": its source line is found exactly once`); continue; }
    const mutated = froms.reduce((s, x, k) => s.replace(x, () => tos[k]), src);
    const tag = `.gov-mut-${process.pid}-${i}`;
    const govFile = path.join(KIT_DIR, `${tag}-governance.mjs`), colFile = path.join(KIT_DIR, `${tag}-collector.mjs`);
    try {
      fs.writeFileSync(govFile, m.file === 'gov' ? mutated : govText);
      fs.writeFileSync(colFile, (m.file === 'col' ? mutated : colText).replace("from './governance.mjs'", `from './${tag}-governance.mjs'`));
      const G = await import(pathToFileURL(govFile).href);
      const caught = []; quiet = caught;
      try { await readerCases(G, P, F); await collectorCases(colFile, govFile); await collectorCases2(colFile, govFile); } catch (e) { caught.push('threw: ' + e.message.slice(0, 80)); } finally { quiet = false; }
      ok(caught.length > 0, `mutant "${m.label}" is caught (${caught.length} case(s): ${caught.slice(0, 2).join('; ').slice(0, 160)})`);
    } finally { for (const f of [govFile, colFile]) try { fs.unlinkSync(f); } catch { /* gone */ } }
  }
}

async function liveCase(G) {
  console.log('\n[live] one real read of the z.ink testnet');
  if (OFFLINE) { skips++; console.log('  SKIP (C4_OFFLINE=1)'); return; }
  const imp = (p) => import(pathToFileURL(path.join(KIT_DIR, 'node_modules', ...p.split('/'))).href);
  const kit = await imp('@solana/kit/dist/index.node.mjs');
  const { createSageContext } = await import(pathToFileURL(path.join(KIT_DIR, 'node_modules', '@aephia', 'atlas-kit', 'dist', 'client', 'index.js')).href);
  const { getStarSystems } = await import(pathToFileURL(path.join(KIT_DIR, 'node_modules', '@aephia', 'atlas-kit', 'dist', 'world', 'index.js')).href);
  const C = await import(pathToFileURL(COLLECTOR_SRC).href);
  const rpc = kit.createSolanaRpc('https://testnet-rpc.z.ink');
  const ctx = createSageContext({ cluster: 'zink-ptr', rpc });
  try {
    ok(ctx.programs.sage === G.SAGE_PROGRAM_ADDRESS && C.SAGE_PROGRAM === G.SAGE_PROGRAM_ADDRESS, `one SAGE program: kit context = dev-sage = collector (${ctx.programs.sage})`);
    const t = Date.now();
    const g = await G.readGovernance(rpc, { program: ctx.programs.sage, game: ctx.game });
    const ms = Date.now() - t;
    const sysAddrs = new Set((await getStarSystems(ctx)).map((s) => String(s.address)));
    const gs = Object.keys(g.systems);
    ok(gs.length >= 30, `live: ${gs.length} governed systems (>= 30), ${G.GOV_CALLS} calls, ${ms} ms, ${JSON.stringify(g).length} bytes`);
    ok(sysAddrs.size > 900 && gs.every((a) => sysAddrs.has(a)), `live: every governed system is a star system (${gs.filter((a) => sysAddrs.has(a)).length}/${gs.length} of ${sysAddrs.size})`);
    const notSys = Object.keys(g.counts).length && g.voters.top[0] ? g.voters.top[0].p : null;
    ok(notSys === null || !sysAddrs.has(notSys), 'live negative control: a player profile address is not among the star systems');
    ok(Object.values(g.counts).every((c) => Number.isInteger(c)) && g.counts.starbaseGovernance === gs.length, 'live: counts per type, one system per governance');
  } finally { await ctx.dispose?.(); }
}

async function main() {
  const G = await import(pathToFileURL(GOV_SRC).href);
  const read = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
  const P = read(PROBE), F = read(FIXTURE);
  console.log('[reader] governance.mjs (probe ' + (P ? 'loaded' : 'MISSING') + ', fixture ' + (F ? 'loaded' : 'MISSING') + ')');
  await readerCases(G, P, F);
  console.log('\n[collector] enrichment rules in collect()');
  await collectorCases(COLLECTOR_SRC, GOV_SRC);
  console.log('\n[collector] governance limit, pass abort, stored shape, redaction');
  await collectorCases2(COLLECTOR_SRC, GOV_SRC);
  await runMutants(G, P, F);
  await liveCase(G);
  console.log(`\n${passes} passed, ${fails} failed, ${skips} skipped`);
  process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.log('CRASH ' + (e.stack || e)); process.exit(1); });
