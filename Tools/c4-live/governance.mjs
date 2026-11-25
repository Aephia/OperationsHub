// C4 Live governance read - the `gov` block of latest.json (contract: the C4 Live section of README.md).
// One getProgramAccounts per account type below (discriminator memcmp at offset 0), all decoded with the
// @staratlas/dev-sage decoders the kit itself is built on. ALL OR NOTHING: one failed type, one account of an
// unexpected size, or one decode error throws, and the caller keeps its previous block (collector.mjs).
// Runs in Node and in the visitor's browser (C4Live/collect-src): no node:* imports; Buffer is the global the
// browser bundle shims (Buffer.from(base64 string), Buffer.from(Uint8Array).toString('base64')).
//
// buildGov() is pure (no I/O) so Test/c4-governance-check.js can feed it the probe dump and sabotaged rows.
import {
  SAGE_PROGRAM_ADDRESS,
  STARBASE_GOVERNANCE_DISCRIMINATOR, getStarbaseGovernanceDecoder,
  DEMOCRACY_SYSTEM_HISTORY_DISCRIMINATOR, getDemocracySystemHistoryDecoder,
  DEMOCRACY_GENERATION_HISTORY_DISCRIMINATOR, getDemocracyGenerationHistoryDecoder,
  DEMOCRACY_HISTORY_DAY_DISCRIMINATOR, getDemocracyHistoryDayDecoder,
  DEMOCRACY_WEEKLY_BALLOT_DISCRIMINATOR, getDemocracyWeeklyBallotDecoder,
  GOVERNANCE_MODULE_STATUS_DISCRIMINATOR, getGovernanceModuleStatusDecoder,
  GOVERNANCE_MODULE_PROJECT_DISCRIMINATOR, getGovernanceModuleProjectDecoder,
  GOVERNANCE_MODULE_CONTRIBUTION_DISCRIMINATOR, getGovernanceModuleContributionDecoder,
  DEMOCRACY_PTR_ALLOCATION_DISCRIMINATOR, getDemocracyPtrAllocationDecoder,
  DEMOCRACY_PTR_BACKING_DISCRIMINATOR, getDemocracyPtrBackingDecoder,
  DEMOCRACY_HISTORY_POLICY_DISCRIMINATOR, getDemocracyHistoryPolicyDecoder,
  GOVERNANCE_MODULE_POLICY_DISCRIMINATOR, getGovernanceModulePolicyDecoder,
  DEMOCRACY_CURVE_CONFIG_DISCRIMINATOR, getDemocracyCurveConfigDecoder,
  DEMOCRACY_HOUSING_MAP_DISCRIMINATOR, getDemocracyHousingMapDecoder,
  DEMOCRACY_PTR_ROOT_DISCRIMINATOR, getDemocracyPtrRootDecoder,
} from '@staratlas/dev-sage';

export { SAGE_PROGRAM_ADDRESS };

// IDL account name -> [discriminator, decoder factory]. Only what the contract needs (15 reads per pass).
export const GOV_TYPES = {
  starbaseGovernance: [STARBASE_GOVERNANCE_DISCRIMINATOR, getStarbaseGovernanceDecoder],
  democracySystemHistory: [DEMOCRACY_SYSTEM_HISTORY_DISCRIMINATOR, getDemocracySystemHistoryDecoder],
  democracyGenerationHistory: [DEMOCRACY_GENERATION_HISTORY_DISCRIMINATOR, getDemocracyGenerationHistoryDecoder],
  democracyHistoryDay: [DEMOCRACY_HISTORY_DAY_DISCRIMINATOR, getDemocracyHistoryDayDecoder],
  democracyWeeklyBallot: [DEMOCRACY_WEEKLY_BALLOT_DISCRIMINATOR, getDemocracyWeeklyBallotDecoder],
  governanceModuleStatus: [GOVERNANCE_MODULE_STATUS_DISCRIMINATOR, getGovernanceModuleStatusDecoder],
  governanceModuleProject: [GOVERNANCE_MODULE_PROJECT_DISCRIMINATOR, getGovernanceModuleProjectDecoder],
  governanceModuleContribution: [GOVERNANCE_MODULE_CONTRIBUTION_DISCRIMINATOR, getGovernanceModuleContributionDecoder],
  democracyPtrAllocation: [DEMOCRACY_PTR_ALLOCATION_DISCRIMINATOR, getDemocracyPtrAllocationDecoder],
  democracyPtrBacking: [DEMOCRACY_PTR_BACKING_DISCRIMINATOR, getDemocracyPtrBackingDecoder],
  democracyHistoryPolicy: [DEMOCRACY_HISTORY_POLICY_DISCRIMINATOR, getDemocracyHistoryPolicyDecoder],
  governanceModulePolicy: [GOVERNANCE_MODULE_POLICY_DISCRIMINATOR, getGovernanceModulePolicyDecoder],
  democracyCurveConfig: [DEMOCRACY_CURVE_CONFIG_DISCRIMINATOR, getDemocracyCurveConfigDecoder],
  democracyHousingMap: [DEMOCRACY_HOUSING_MAP_DISCRIMINATOR, getDemocracyHousingMapDecoder],
  democracyPtrRoot: [DEMOCRACY_PTR_ROOT_DISCRIMINATOR, getDemocracyPtrRootDecoder],
};
export const GOV_CALLS = Object.keys(GOV_TYPES).length;
const GOV_CONCURRENCY = 4; // the z.ink endpoint is shared and rate-limited (the page runs this in every visitor's browser)

// ATLAS amounts in these accounts are the program's internal ledger unit. The kit divides every such field by
// FLOYDS_PER_ATLAS = 100_000_000 (atlas-kit dist/internal/c4/faction-treasury.js vault, character.js atlas,
// crafting/index.js feeEscrowRaw - the fee escrow these pools are paid from), as collector.mjs ATLAS_DECIMALS does.
// So 8 decimals is LIKELY, but no non-zero governance pool existed on 2026-11-24 to confirm against a known amount:
// the block does NOT carry an `atlasDecimals` divisor until it is verified (the page then shows no amounts).

// Shape version of the emitted block. collector.mjs drops a persisted block of another shape instead of
// re-serving it. Bump it whenever a field is added, removed or changes meaning.
export const GOV_SHAPE = 1;

const SYSTEM_PROGRAM = '11111111111111111111111111111111';
const DEFAULT_FEES = { craft: 10000, mkt: 0, local: 0, dist: 0 }; // the kit's constant default (democracy-history.js)
const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);
// u64 / u128 values: a Number when it is exactly representable (|v| <= 2^53 - 1), else a decimal STRING, so a
// huge value is never silently rounded. Today every value is far below that (largest: maxPvp 1e12). Accepts the
// decoders' bigint, a number, or the probe dump's decimal string; anything else throws (a decode sabotage).
export function N(v) {
  if (v === undefined || v === null) return 0;
  if (typeof v === 'number') { if (!Number.isFinite(v)) throw new Error(`not a number: ${v}`); return v; }
  const b = BigInt(v);
  return b <= MAX_SAFE && b >= -MAX_SAFE ? Number(b) : b.toString();
}
const B = (v) => (v === undefined || v === null ? 0n : BigInt(v));
// Plain JSON for a passed-through struct (bounds): bigint -> N(), arrays and objects recursively.
const plain = (v) => (typeof v === 'bigint' ? N(v)
  : Array.isArray(v) ? v.map(plain)
    : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, plain(x)])) : v);
const fees = (p) => ({ craft: N(p.craftingFeeBps), mkt: N(p.localMarketFeeBps), local: N(p.localTreasuryShareBps), dist: N(p.treasuryDistributionBps) });
const by = (arr, k) => { const m = new Map(); for (const r of arr) { const key = String(r[k]); if (!m.has(key)) m.set(key, []); m.get(key).push(r); } return m; };
// weighted / power as a float without going through a rounded Number for a huge numerator (u128 sums)
const ratio = (w, p) => { const q = B(w) / p, r = B(w) % p; return Number(q) + Number(r) / Number(p); };
const nameOf = (cargoNames, id) => {
  const n = cargoNames instanceof Map ? cargoNames.get(id) ?? cargoNames.get(String(id)) : cargoNames ? cargoNames[id] : undefined;
  return n === undefined || n === null ? undefined : String(n);
};

// rowsByType: { [IDL account name]: [{ address, ...decoded fields }] } for EVERY name in GOV_TYPES (a missing
// name is a caller bug and throws). takenAt: unix seconds. cargoNames: cargo id -> name (object or Map), optional.
export function buildGov(rowsByType, takenAt, cargoNames) {
  for (const n of Object.keys(GOV_TYPES)) if (!Array.isArray(rowsByType?.[n])) throw new Error(`governance rows missing for ${n}`);
  const rows = (n) => rowsByType[n];
  // One governance per system: a system whose starbase changed hands has older ones (a successor set, or a lower
  // starbaseSeqId). Keep the live one - no successor, highest sequence.
  const govBySys = new Map();
  for (const g of rows('starbaseGovernance')) {
    const k = String(g.system), cur = govBySys.get(k);
    const live = (x) => String(x.successorGovernance ?? SYSTEM_PROGRAM) === SYSTEM_PROGRAM;
    if (!cur || (live(g) && !live(cur)) || (live(g) === live(cur) && B(g.starbaseSeqId) > B(cur.starbaseSeqId))) govBySys.set(k, g);
  }
  const govs = [...govBySys.values()];
  // Every per-system table keeps only the rows of the system's LIVE governance: after a starbase changes hands the
  // old owner's history, project, allocations and contributions stay on chain beside the new ones. A row matches
  // when its `governance` (where it carries one; the zero address = not set) is the live governance's address and
  // its `starbaseSeqId` (where it carries one) is the live sequence. Rows keyed through another row (generation,
  // ballot, contribution, backing) are matched through that row below.
  const ofLive = (r) => {
    const g = govBySys.get(String(r.system));
    if (!g) return false;
    if (r.governance !== undefined && String(r.governance) !== SYSTEM_PROGRAM && String(r.governance) !== String(g.address)) return false;
    return r.starbaseSeqId === undefined || B(r.starbaseSeqId) === B(g.starbaseSeqId);
  };
  const sameSeq = (r, owner) => r.starbaseSeqId === undefined || B(r.starbaseSeqId) === B(owner.starbaseSeqId);
  const hist = by(rows('democracySystemHistory').filter(ofLive), 'system');
  const gens = new Map(rows('democracyGenerationHistory').map((g) => [String(g.address), g])); // reached only through a live history's `generation`
  const days = by(rows('democracyHistoryDay').filter(ofLive), 'system');
  const ballots = by(rows('democracyWeeklyBallot'), 'generation'); // a ballot belongs to one history generation
  const status = by(rows('governanceModuleStatus').filter(ofLive), 'system');
  const projects = by(rows('governanceModuleProject').filter(ofLive), 'system');
  const liveProject = new Map([...projects.values()].flat().map((pj) => [String(pj.address), pj]));
  const contribs = by(rows('governanceModuleContribution').filter((c) => liveProject.has(String(c.project)) && sameSeq(c, liveProject.get(String(c.project)))), 'project');
  const allocs = by(rows('democracyPtrAllocation').filter(ofLive), 'system');
  const liveAlloc = new Map([...allocs.values()].flat().map((a) => [String(a.address), a]));
  const backing = by(rows('democracyPtrBacking').filter((k) => liveAlloc.has(String(k.allocation)) && sameSeq(k, liveAlloc.get(String(k.allocation)))), 'allocation');
  const policy = rows('democracyHistoryPolicy')[0] || null, modPol = rows('governanceModulePolicy')[0] || null;
  const curve = rows('democracyCurveConfig')[0] || null, housing = rows('democracyHousingMap')[0] || null;
  const roots = rows('democracyPtrRoot');

  const systems = {};
  let day = 0n, voteEpoch = 0n;
  for (const g of govs) {
    const sys = String(g.system);
    if (B(g.currentRewardEpoch) > day) day = B(g.currentRewardEpoch);
    if (B(g.currentVoteEpoch) > voteEpoch) voteEpoch = B(g.currentVoteEpoch);
    const h = (hist.get(sys) || [])[0] || null;
    const gen = h ? gens.get(String(h.generation)) || null : null;
    const on = h ? N(h.enabled) : 0;
    const powerB = gen ? B(gen.eligiblePower) : 0n;
    // The fees in force, as the kit resolves them (atlas-kit planning/democracy-history.js + governance-fees.js):
    //   history enabled          -> its generation's activeParams        src 'generation'
    //   history present, disabled -> the constant default               src 'baseline'
    //   no history, governance on -> starbaseGovernance.activeParams     src 'governance'
    //   no history, governance off -> the constant default              src 'default'
    // starbaseGovernance.activeParams is used ONLY in the third case: wherever a history exists it is a stale legacy
    // value (100 / 2500 / 5000 on all 36 systems on 2026-11-24). An enabled history without its generation is an
    // inconsistent chain (the kit refuses it): the constant default, src 'baseline'.
    const [feesNow, src] = h ? (on && gen ? [fees(gen.activeParams), 'generation'] : [{ ...DEFAULT_FEES }, 'baseline'])
      : N(g.enabled) === 1 ? [fees(g.activeParams), 'governance'] : [{ ...DEFAULT_FEES }, 'default'];
    const pj = (projects.get(sys) || [])[0] || null, st = (status.get(sys) || [])[0] || null;
    const cs = pj ? contribs.get(String(pj.address)) || [] : [];
    const al = allocs.get(sys) || [];
    const b = [...((h && ballots.get(String(h.generation))) || [])].filter((x) => String(x.system) === sys).sort((x, y) => (B(y.cutoffDay) > B(x.cutoffDay) ? 1 : B(y.cutoffDay) < B(x.cutoffDay) ? -1 : 0))[0] || null;
    systems[sys] = {
      ctl: N(g.controllerFaction),                    // 1 MUD, 2 ONI, 3 USTUR (the faction that controls the starbase)
      lvl: N(g.governanceLevel),
      on,                                             // 1 = the system's Democracy history is enabled (votes set the fees)
      mod: pj ? { inst: N(pj.installed), at: N(pj.installedAt) || (st ? N(st.installedAt) : 0), funded: pj.funded.map(N), need: pj.configured.map(N),
        contributors: new Set(cs.map((c) => String(c.profile))).size } : null,
      fees: feesNow,                                  // bps, in force (see above)
      src,
      power: N(powerB),                               // voting power eligible in this system now
      nextPower: gen ? N(gen.nextPower) : 0,
      want: powerB > 0n ? { craft: ratio(gen.weighted[0], powerB), mkt: ratio(gen.weighted[1], powerB), local: ratio(gen.weighted[2], powerB), dist: ratio(gen.weighted[3], powerB) } : null,
      voters: al.length,                              // allocations of voting power to this system
      crew: N(al.reduce((s, a) => s + B(a.crew), 0n)),
      // raw ATLAS ledger units (the divisor is not verified yet - see the top of this file)
      poolRaw: h ? { open: N(h.openPool), vault: N(h.unallocatedVault), dao: N(h.pendingDaoAtlas), funded: gen ? N(gen.fundedAtlas) : 0, claimed: gen ? N(gen.claimedAtlas) : 0 } : null,
      ballot: b ? { status: N(b.status), cutoffDay: N(b.cutoffDay), power: N(b.collectedPower), expected: N(b.expectedPower), receipts: N(b.receiptCount), winner: fees(b.winnerParams) } : null,
      days: [...(days.get(sys) || [])].sort((x, y) => (B(x.day) > B(y.day) ? 1 : B(x.day) < B(y.day) ? -1 : 0)).slice(-7)
        .map((d) => ({ d: N(d.day), fees: fees(d.dailyOutcome), power: N(d.eligiblePower), poolRaw: N(d.poolAtClose), daoRaw: N(d.daoAtlas) })),
    };
  }
  // voters: one row per allocation of voting power (profile from its backing account)
  const top = [];
  for (const [sys, al] of allocs) for (const a of al) {
    const bk = (backing.get(String(a.address)) || [])[0];
    top.push({ pb: B(a.activePvp), row: { p: bk ? String(bk.playerProfile) : null, sys, power: N(a.activePvp), pending: N(a.pendingPvp), crew: N(a.crew) } });
  }
  top.sort((a, b) => (b.pb > a.pb ? 1 : b.pb < a.pb ? -1 : 0));
  // contributors: one row per profile + system, summed over the module's resources
  const cmap = new Map();
  for (const [sys, pjs] of projects) for (const pj of pjs) for (const c of contribs.get(String(pj.address)) || []) {
    const k = String(c.profile) + '|' + sys;
    const r = cmap.get(k) || cmap.set(k, { p: String(c.profile), sys, lp: 0n, units: 0n, rows: 0 }).get(k);
    r.lp += B(c.lpEarned); r.units += B(c.quantity); r.rows++;
  }
  const contributors = [...cmap.values()].sort((a, b) => (b.lp > a.lp ? 1 : b.lp < a.lp ? -1 : 0)).map((r) => ({ ...r, lp: N(r.lp), units: N(r.units) }));
  return {
    at: takenAt, day: N(day), voteEpoch: N(voteEpoch), voteEpochSecs: govs.length ? N(govs[0].voteEpochDurationSecs) : null,
    v: GOV_SHAPE,
    // constant = the fees a system without voting charges (the kit's constant default), NOT the policy defaults
    policy: policy ? { defaults: fees(policy.defaultParams), constant: { ...DEFAULT_FEES }, bounds: plain(policy.bounds) } : null,
    module: modPol ? { minTier: N(modPol.minimumTier), bill: modPol.resourceIds.map((id, i) => {
      const r = { id: N(id), q: N(modPol.quantities[i]) }; const n = nameOf(cargoNames, r.id); if (n !== undefined) r.n = n; return r;
    }).filter((r) => r.id) } : null, // id = cargo id
    curve: curve ? { pvpThreshold: N(curve.values.pvpThreshold), basePvpPerCrew: N(curve.values.basePvpPerCrew), maxPvp: N(curve.values.maxPvp) } : null,
    housing: housing ? housing.entries.filter((e) => N(e.enabled)).map((e) => ({ id: N(e.cargoId), f: N(e.factionId), tier: N(e.tier), cap: N(e.capacityPerUnit) })) : [],
    systems,
    voters: { profiles: roots.length, pvpIssued: N(roots.reduce((s, r) => s + B(r.issuedPvp), 0n)), pvpReserved: N(roots.reduce((s, r) => s + B(r.reservedPvp), 0n)),
      allocating: top.length, top: top.slice(0, 50).map((t) => t.row) },
    contributors,
    counts: Object.fromEntries(Object.keys(GOV_TYPES).map((n) => [n, rows(n).length])),
  };
}

// One type: every account of it, decoded. Throws on an RPC error, a non-array reply, a wrong size or discriminator,
// or a decode error. `game` (optional): drop rows of another game on the same program (rows without a gameId stay).
export async function readGovType(rpc, program, name, { signal, game } = {}) {
  const [disc, decoderOf] = GOV_TYPES[name];
  const decoder = decoderOf();
  const accs = await rpc.getProgramAccounts(program, {
    encoding: 'base64',
    filters: [{ memcmp: { offset: 0n, bytes: Buffer.from(disc).toString('base64'), encoding: 'base64' } }],
  }).send({ abortSignal: signal });
  const list = Array.isArray(accs) ? accs : accs?.value;
  if (!Array.isArray(list)) throw new Error(`${name}: getProgramAccounts returned no list`);
  const out = [];
  for (const a of list) {
    const data = Buffer.from(Array.isArray(a?.account?.data) ? a.account.data[0] : '', 'base64');
    if (typeof decoder.fixedSize === 'number' && data.length !== decoder.fixedSize) throw new Error(`${name} ${a?.pubkey}: ${data.length} bytes, expected ${decoder.fixedSize} - the account layout may have changed`);
    for (let i = 0; i < disc.length; i++) if (data[i] !== disc[i]) throw new Error(`${name} ${a?.pubkey}: wrong discriminator`);
    const row = { address: String(a.pubkey), ...decoder.decode(data) };
    if (game && row.gameId !== undefined && String(row.gameId) !== String(game)) continue;
    out.push(row);
  }
  return out;
}

// The whole read: every type in GOV_TYPES (GOV_CALLS calls, at most GOV_CONCURRENCY at a time), then buildGov.
// Throws on the first failure; nothing partial is ever returned.
export async function readGovernance(rpc, { signal, cargoNames, program = SAGE_PROGRAM_ADDRESS, game = null, takenAt } = {}) {
  const at = takenAt ?? Math.floor(Date.now() / 1000);
  const names = Object.keys(GOV_TYPES);
  const rowsByType = {};
  let next = 0, failed = null;
  await Promise.all(Array.from({ length: Math.min(GOV_CONCURRENCY, names.length) }, async () => {
    while (next < names.length && !failed) {
      const n = names[next++];
      try { rowsByType[n] = await readGovType(rpc, program, n, { signal, game }); } catch (e) { failed ??= e; throw e; }
    }
  }));
  if (failed) throw failed;
  return buildGov(rowsByType, at, cargoNames);
}
