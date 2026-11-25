# C4 Live collector

Reads the **SAGE C4 test realm on z.ink** with [`@aephia/atlas-kit`](https://docs.atlaskit.dev/) and writes
the files the `C4Live/` module animates from. One pass is about 15 s and reads about 1,600 fleets, 324 owners,
945 systems and 92 claim stakes (first run, 2026-11-06). Owner names, wallets and reference prices added
about 3.5 s and 6 calls on 2026-11-07 (5 z.ink: 1 names read + 4 wallet batches; 1 mainnet order-book read, only
when the cached prices are 55+ minutes old); a whole pass took 28.5 s.

```
cd Tools/c4-live
npm ci --ignore-scripts      # pinned: @aephia/atlas-kit (vendored build, see below), @solana/kit 6.10.0
npm run collect              # loops: one pass now, then every C4_INTERVAL_MIN (default 60, minimum 5)
npm run collect:once         # one pass; exit 0 = full, 2 = partial (written, marked), 1 = failed (nothing written)
powershell -ExecutionPolicy Bypass -File install-schedule.ps1          # hourly Windows task (-Remove to undo); logs to collector.log (rotated at 5 MB via --log)
```

Env: `C4_RPC_URL` (default `https://testnet-rpc.z.ink`, the public shared endpoint; it is rate-limited, so
use your own endpoint for anything heavier than hourly; only its **host** is ever written out, since paid
endpoints carry the key in the path or query), `C4_INTERVAL_MIN`, `C4_OUT_DIR`, `C4_MAINNET_RPC_URL` (default
`https://api.mainnet-beta.solana.com`, used only for reference prices, at most once per 55 minutes; host only
written out).

Check: `node Test/c4-collector-check.js` (from the repo root; `--offline` for the unit part only). It runs
the real `collect()` three times against z.ink in temp dirs, never touching `Data/c4-live/`.

## The vendored kit (2026-11-22, temporary)

The game moved to SAGE C4 3.2 on 2026-11-21 and the galaxy was reset. The released kit (0.7.0) ships the
dev-sage 0.55.0 bindings, which cannot read it: zero fleets, an invalid game account, and
`claimStakeInstance ... could not be decoded` on the public page. Forcing dev-sage 0.56.0 under 0.7.0 does not
work either (the kit refuses the new fixed-point combat stats).

So the dependency is `vendor/aephia-atlas-kit-0.7.0-pr1156-6011d71f.tgz`: a local build of the kit's
**unreleased draft** PR [Aephia/atlas-kit#1156](https://github.com/Aephia/atlas-kit/pull/1156), commit
`6011d71fb2b0e33cbd1fd47e5fbd0ff113fb1eb9`, on `@staratlas/dev-sage` 0.56.0. Owner-approved; only reads are
used. sha256 `a0bcfacb3149829a1820ceafd62226332c9c52f708b0a3c770ffc007100e601a`. To rebuild it:

```
git clone --depth 1 --branch feat/sage-3.2-support https://github.com/Aephia/atlas-kit.git   # check the commit
corepack pnpm install --frozen-lockfile --ignore-scripts --filter @aephia/atlas-kit...
cd packages/sage && corepack pnpm exec tsc -p tsconfig.json --types node && corepack pnpm pack
```

**Go back to a registry version** as soon as a kit release ships the 0.56 bindings: pin it in `package.json`,
delete `vendor/`, `npm install --ignore-scripts`, rebuild `C4Live/c4-collect.js`, rerun both checks.

Measured on the vendored build, 2026-11-22: 217 fleets, 63 owners, 945 systems, 16 claim stakes, 10 stake
definitions, 3,901 bodies; a pass took 13 s. The pre-reset local copy (2026-11-08, 1,614 fleets) is kept in
`Data/c4-live/pre-reset-2026-11-08/`.

## Safety rules the code enforces

- Output goes to `Data/c4-live/`, git-ignored because it changes every run.
- Every file is written to a per-process temp file, then renamed.
- **`db.json` is the single commit point**: the diff cursor, history, events and owner series are written in
  one atomic rename. A crash can therefore never pair a new history point with an old cursor.
- The served `history.json`, `events.json` and `owners.json` are copies of `db.json`. `latest.json` is written
  last.
- A pass that reads zero fleets refuses to write, except when at least one star system was read AND there is no
  fleet of this game to protect: a first run, a new chain version, or a saved state that itself has zero fleets
  (an empty galaxy written before). The empty galaxy is then written with a quality note.
- **Chain version** (2026-11-20): every pass first reads `{ genesis, sage }` = the genesis hash and the SAGE
  program's last deploy slot (3 calls; `readChainEpoch`). Stored in `db.json` `state.epoch` with `since`.
  Same version = same genesis and (same slot, or either slot unknown; `sameEpoch`). A **new version** starts a
  fresh cursor before anything is diffed: state, history, events, owner series and the identity cache start
  again (first-run semantics, no `gone` events, not partial), `latest.epoch.changed` is true and a note says so.
  A failed version read changes nothing (the pass diffs as usual, with a note); data saved without a version
  adopts the one read.
- **Decode sanity**: the pass throws, writing nothing, when no star system was read, or fewer than 95 % of systems
  have a finite position and a name, or fewer than 95 % of fleets are in a state the collector knows. Measured
  2026-11-20: 945/945 systems and 1,641/1,641 fleets pass.
- An unreadable data file is moved to `<name>.corrupt-<ms>` and the pass aborts before any network read; it
  is never treated as empty.
- One collector at a time: a `.lock` in the output dir, taken over when older than 30 minutes.
- **Partial passes**: if more than 5 % of the per-fleet mining reads or per-owner character reads fail,
  `latest.json` carries `quality.partial: true`. In that case no history or owner point is added, and the
  asteroid counters are not advanced, so the next full pass still covers the whole interval.
- A pass is cut off after 10 minutes. A timed-out pass is disposed (its reads abort), writes nothing and
  releases its lock. The lock holds a token, so a pass only ever removes its own lock.
- **Enrichment never fails a pass.** Owner names, wallets and reference prices are read after the core
  data. If one of those reads fails, or the names read looks truncated (fewer than half of last pass's
  named owners), the pass still commits. Each owner keeps its **last known** name and wallet with the time
  they were read (`nameAt`, `walletAt`), and the cached `prices.json` stays in use. The failure is recorded
  in `quality.namesFailed` / `walletsFailed` / `pricesFailed` and `quality.notes`. These reads never set
  `quality.partial`, and a partial read is never written as truth: each read either completes or is
  discarded whole.
- **Governance is enrichment too (2026-11-24).** `governance.mjs` reads 15 governance account types (one
  `getProgramAccounts` each, about 1 s, ~26 KB in `latest.json`). One failed type, one account of an unexpected
  size or discriminator, or one decode error fails the whole read. A failed read, or one that suddenly finds 0
  governed systems after some, keeps the previous block from `db.json` `state.gov` (it carries its own `at`),
  sets `quality.govFailed` and adds a note; on a new chain version the old block is dropped instead (`gov: null`).
- The first version's `state.json` is migrated once and renamed `state.json.migrated`. If `db.json` is
  later missing, the next pass starts a **fresh cursor**: first-run seeding, deduped against the events
  copy, with history and owners recovered from the served copies. It never silently resumes an old cursor.

## What the chain gives vs what is derived

The chain keeps **no combat log and no mining history**, so the collector derives both by diffing runs:

- **Combat event**: a fleet's `lastCombatUpdate` moved forward since the last run, dated at that chain time.
  The stamp moves for **both sides** of a fight: attacker and defender share the exact second (verified
  2026-11-06). So the event means "took part", not "took damage". `dmg` is true only if hp or shields
  fell since the previous run; attackers usually show shields going UP from regen. `vs` lists the other
  fleets stamped with the same second, i.e. the likely opponents.
  `hp0`/`sp0` are the values at the **previous run** and `hp1`/`sp1` the values now, not the values just
  before and after the fight. Several fights within one interval become one event, and repairs in between
  blur the numbers.
  `seed: true` marks events found on the first run, or on a fleet never seen before. They have no "before"
  values.
- **Destroyed**: a fleet that was live at the previous run is now `destroyed` or `respawn`. Destroyed and
  respawn can both happen within one hour.
- **Gone**: a fleet account that existed at the previous run and is now closed. NPC fleets are closed when
  they die, so a closed fleet leaves no state to diff. The event carries the last known values;
  `afterCombat` is true if it had fought within the 3 hours before the previous run. Destroyed counts are
  therefore a **lower bound** at an hourly cadence: a player can die, respawn and redeploy within the hour.
- **Starbase combat**: a starbase's `lastCombatUpdate` is ALSO written at the second it is built, upgraded
  or destroyed. The kit's `builtOrDestroyedAt` (`systems[].built`) then holds the same second; on
  2026-11-06 that was 604 exact matches.
  - Only that **exact match** is a build stamp, and those are purged from the log.
  - `lc < built` is a real fight followed by a later build or destroy (87 on 2026-11-06).
  - `lc > built` is a fight since (92).
  - A kill in the same second as the destroy stamp is indistinguishable from a build stamp; the `captured`
    event (owner changed to none) covers it.
- **Suspect discovery**: if more than 10 % of the previous run's fleets vanish at once, the pass is flagged
  `quality.suspectDiscovery`, emits no `gone` events and keeps those fleets' state, so a truncated
  discovery cannot fake a mass death. A suspect pass is also marked `partial` (no history point). A fleet
  missed on 3 consecutive suspect passes is accepted as gone, so a real mass vanish cannot keep the guard on
  forever. `quality.vanished` always holds the count.
- **Captured**: a starbase's owner faction changed, including to or from none.
- **Mined**: each asteroid carries a cumulative counter per resource (`amountMinedUnitsRaw`, shared by every
  fleet on that asteroid). `minedDelta` is the sum of positive deltas over `minedDtSec` seconds. It is empty
  on the first run. A key counts only if its baseline came from the previous full pass; an asteroid that was
  idle then is re-based instead, so hours of output never land in a one-hour interval. `history[].combat`
  and `destroyed` count the non-seed events since the previous history point. Observed 2026-11-06: over
  497 s and 717 s the counters moved 0.31x and 0.48x what the live rates imply.
  Counters likely advance only when a fleet's mining settles on chain, so short intervals undercount; treat
  `minedDelta` as settled output, and the live rate as current output.
- **Live rate**: each mining fleet's `outputs[].unitsPerSecond` from `getFleetMiningState`. Per the kit docs,
  this is already split across the selected resources and multiplied by richness. The UI projects between
  hourly runs as `units = ups * (now - generatedAt)`.

## Data contract (`v: 1`)

`latest.json`
```
{ v, generatedAt (unix s), rpc (host only), intervalMin, tookMs,
  quality: { mineFailed, mineTotal, charFailed, charTotal, partial, vanished?, suspectDiscovery?, bodiesFailed?, stakeDefsFailed?, buildingDefsFailed?,
             namesFailed?, walletsFailed?, pricesFailed?, notes?[string] },
  ref: null | { pricesAt (unix s of the mainnet read), source, fetchedThisPass, stale (older than 26 h),
                match: { hulls:{matched,total}, cargo:{matched,total} } },   // distinct z.ink names seen this pass
  kpis: { t, fleets, ships, players, npcFleets, byState{kind:n}, byFaction{fa:{fleets,ships,mining,ups}},
          sbByFaction{fa:n}, galaxyUps, resUps{resource:ups}, minedDelta{resource:units}, minedDtSec,
          activeAsteroids, combat24h, destroyed24h, stakes, stakesActive, atlasTotal },
  fleets: [{ a addr, n name, o ownerProfile, fa faction(mud|oni|ustur|unaligned), npc (0 = player),
             s:{kind: idle|docked|mining|warp|subwarp|destroyed|respawn|claimStakeTransfer,
                departs?, arrives?, from?[x,y], to?[x,y], asteroid?, resources?[], system?, recovers?},
             x, y, hp, hpMax, sp, spMax, ships, size{xxSmall..}, types{shipConfigName:n}, crew,
             flag (flagship config name = largest size class), flagSize (xx-small..titan),
             mineRate, cargo, cargoCap, lc lastCombat(unix s, 0 = never), lu lastUpdate,
             mine?:{ ups (sum of out = yield, richness applied), baseUps (fleet stat), out:[{r resource, ups}], since },
             // added 2026-11-25; optional (a saved copy from before it has none)
             st:[number] (the fleet's stat totals, aligned to statKeys), ap, fuel (units), ammo (units),
             hold:[{ n item name (cargo#id when nameless), q }] (cargo hold, largest first, zero quantities dropped),
             stance? (ammoUsage: light|...), pend? (pendingHp, only when > 0), rent? (rentedCrew, only when > 0) }],
  statKeys: ["group.key"] (sorted union of every stat with a finite value this pass, over all fleets' and ships' stats;
             group = cargo|combat|misc|movement; *Raw keys skipped),
  shipDefs: { shipConfigName (as in fleets[].types): { sz sizeClass, seq definitionSequenceId (the higher wins on a clash),
             st:[number] (ONE ship's stats, aligned to statKeys) } },
  owners: [{ p profile, fa, fleets, ships, mining, ups, destroyed, atlas, rank,
             xp:{pilot,dataRunner,mining,building,crafting,combat:{xp,lvl}}, stakes, habs, stakesLive?, lastCombat,
             name (sanitised display name | null), nameAt (unix s it was read | null), nameLen? (raw length, only when cut),
             wallet (auth wallet address | null), walletAt, walletWhy? (why wallet is null),
             holdings: { atlas, fleets, ships, hulls{shipConfigName:n}, cargo:[{name, units}] (largest first),
                         refValue?: { basis:'mainnet reference', currency:'ATLAS', atBid, atAsk, priced, unpriced,
                                      pricesAt, top:[{kind:hull|cargo, name, ref (mainnet item), qty, bid, ask}] (8 largest) } } }],
  systems: [{ a, n, r region, x, y, f starbase faction, lvl, hp, sp, lc, built (builtDestroyedAt), links, id (chain systemId or null), to (sorted ids of the gate-linked systems; links = to.length) }],
  asteroids: [{ a, sys, sysName, x, y, fleets, ups, res:{resource:{cum, miners, ups, rich}} }],
  stakes: [{ a, o, st, def, defName ("Claim Stake Tier 1" / "Cultivation Stake Tier 2"), tier (1..n), slots, b buildings,
            sys, sysName, x, y, crew (needed), body (planet address),
            // detail for the stake view; every field below is optional (a saved copy from before it has none)
            bl:[{ id, n, q, k }] (building definition id, name, quantity, kind: central_hub|cultivation_hub|extraction_hub|processing_hub|
               storage_hub|farm_hub|power_plant|crew_quarters|storage_module|farm|extractor|processor; read from the name),
            pw:{ gen (sum of positive power x q), use (sum of |negative| x q) }, cs (crew slots provided), su (slots used),
            inv:[{ r resource, q }] (largest first, zero quantities dropped), cap:{ used, total } (storage), fuel (quantity of "Fuel", 0 when none),
            rent:{ bal (ATLAS, 8 decimals applied), at (last rent, unix s) }, con:{ rem (construction seconds left), at (progress time, unix s) },
            out:[{ r, ps }] (the stake's OWN stored production: the positive entries of the chain's resources.netProduction, units per SECOND,
               largest first; zero rates dropped),
            use:[{ r, ps }] (what the stake consumes, e.g. Fuel burn: the negative entries of resources.netProduction as POSITIVE numbers,
               largest first, [] when none) }],
  epoch: null | { genesis, sage (deploy slot | null), since (unix s this store first saw it), changed (this pass started it) } }
```
`quality.buildingDefsFailed`: the building definitions could not be read; then `bl[].n` is "building #id", `k` is "processor", and `pw`, `cs`,
`su` are absent (also absent for a stake with a building that is not in the definitions). `out` and `use` do NOT depend on the definitions:
they come from the stake row itself, so they are present even then, and absent only when the stake has no `resources.netProduction`.
(The old `out` summed the building definitions' rates x quantity - the maximum for every resource a hub type could extract, wrong on every
live stake.) One extra read per pass (`listClaimStakeBuildingDefinitions`, only the ids the live stakes use are kept); cargo names come from
the one cargo read the bodies use (a resource not in it is named from the production entry, else `cargo#id`; a building definition without a
name is "building #id").
`inv[].q` is an item count while `cap` is in storage units (item count x storageCost / 256, rounded up) - they are only equal today because
every stored item costs 256; do not draw an inventory sum against `cap`. `cap.used` can exceed `cap.total` (the chain models over capacity).
`st` arrays (fleets and `shipDefs`): a chain stat is a number, a numeric string or `{ raw, value }` (the `value` is used); each entry
is rounded to 6 decimals, a stat missing on that fleet or ship is 0, and every array has `statKeys.length` entries. `hpMax`, `spMax`,
`mineRate` and `cargoCap` equal their `st` entries (combat.hp, combat.sp, cargo.miningRate, cargo.cargoCapacity). Fleet `st` is the
chain's fleet total; on the 2026-11-25 pass a one-model fleet's total equalled that model's `st` x quantity on hp and cargoCapacity.
Cost: ~75 keys, ~440 KB more `latest.json` for ~1,100 fleets.

Sum of `owners[].ups` plus NPC fleets' `mine.ups` equals `kpis.galaxyUps`, and so does the sum of `byFaction[].ups`.

`bodies.json` (for the system view): `{ generatedAt, bodies: [{ a, id, n, k: planet|asteroid, sys, sub? (planet type:
oceanic|barren|gas-giant|ice-giant|volcanic|terrestrial|dark), claimed? (planet plots with structures), stakes?[stake addr],
res: [{ r resource, rich, mined? (asteroid counter, units), miners? (active miners) }] }] }`. All 3,901 bodies: 2,543
planets and 1,358 asteroids, up to 7 planets and 4 asteroids per system. **The chain gives no position for a body
inside its system**, so the scene lays the bodies out on stylised orbits. `stakes[].body` links a claim stake to its
planet; `fleets[].s.asteroid` links a mining fleet to its asteroid. A failed bodies read keeps the previous file and
sets `quality.bodiesFailed`, except on a new chain version: the old file then belongs to the old game and is replaced
by `{ generatedAt, bodies: null, failed: true }`. On a new chain version that marker is written BEFORE the `db.json`
commit point (a crash after it never leaves the new version's cursor beside the old game's planets) and replaced by
the new read, even an empty one, after it.

`history.json`: `[{ t, fleets, ships, players, mining, galaxyUps, resUps, minedDelta, minedDtSec, combat, destroyed, byFaction, atlasTotal }]`, one per full run, last 90 days.
`events.json`: `[{ t, k: combat|destroyed|gone|newFleet|starbaseCombat|captured, f|sys, n, o?, fa, from?, npc?, x, y, hp0?, hp1?, sp0?, sp1?, hpMax?, dmg?, vs?[{f,n,o,fa,npc}], dead?, afterCombat?, seed?, ships? }]`, sorted by `t`, last 8,000.
`owners.json`: `{ profile: [[t, fleets, mining, ups, atlas, rank], ...] }`, last 14 days. An owner not seen for 14 days is dropped.

`prices.json` (cache, refreshed at most once per 55 min): `{ fetchedAt, source:'solana-mainnet galactic marketplace', rpc
(host), program, currencies:{atlas:{mint, priceDecimals:8}, usdc:{mint, priceDecimals:6}}, counts:{orders, used, unknownMint,
otherCurrency, items}, items:[{ mint, name, symbol, itemType, atlas?:{bestBid, bestAsk, bids, asks, orders}, usdc?:{...} }] }`.
`prices.attempt.json` stamps every mainnet attempt (`{at, ok, error?}`), so a failing endpoint is also retried at most once
per 55 minutes. `db.json` `state.ident` holds the last known name/wallet per owner (`{n, nt?, na, w, wy?, wa}`), dropped
after 14 days unseen.

`latest.gov` (governance, `governance.mjs`; `null` = not read on this chain version): `{ v: 1, at, day, voteEpoch, voteEpochSecs,
policy:{defaults, constant, bounds}, module:{minTier, bill:[{id, q, n?}]}, curve, housing[], systems:{ [system
address]: { ctl, lvl, on, mod, fees, src, power, nextPower, want, voters, crew, poolRaw, ballot, days[] } }, voters:{profiles,
pvpIssued, pvpReserved, allocating, top[<=50]}, contributors[{p, sys, lp, units, rows, res:[{id, q, n?}]}], counts }`. `res` (2026-11-25) splits a contributor's units by module resource, in bill order. Fees are basis points (`craft` 10000 = x1.00);
`policy.constant` is the fee set a system without voting charges (10000 / 0 / 0 / 0, the kit's constant), not
`policy.defaults`. `*Raw` amounts are the program's raw ATLAS ledger units; the divisor (8 decimals is likely, as the kit's
FLOYDS_PER_ATLAS) is NOT emitted until a non-zero pool confirms it, so the page shows no amounts. A u64 above 2^53 is
written as a decimal string, never rounded. `v` is the block's shape version: a stored block (`db.json` `state.gov`) of
another shape, or one still carrying `atlasDecimals`, is never re-served after a failed read (note: "older shape").
Per system only the rows of the LIVE governance count (no successor, highest `starbaseSeqId`): history, days, module
status / project, allocations match its address (where the row carries a `governance`) and its `starbaseSeqId`;
generation and ballot follow the live history's `generation`; contributions and backings follow their live project /
allocation and its sequence. After a starbase changes hands, the old owner's rows are ignored. The read has its own
60 s limit inside the pass (combined with the pass abort); on timeout it is a failed read (previous block + note).
Error text in the note has the RPC URL replaced by its host.
`fees` follow the kit's resolver: history enabled = its generation's fees (`src: 'generation'`); history disabled = the
constant default 10000 / 0 / 0 / 0 (`'baseline'`); no history = `starbaseGovernance.activeParams` if that governance is
enabled (`'governance'`), else the constant default (`'default'`). Wherever a history exists, `starbaseGovernance.activeParams`
is a stale legacy value (100 / 2500 / 5000 on every system on 2026-11-24) and is never written.
Check: `node Test/c4-governance-check.js` (`C4_OFFLINE=1` skips the one live read).

### Owner identity and wealth (2026-11-07)

- **Names are on chain.** (An earlier version of this README said profiles have no display name; that was wrong.)
  The z.ink player-profile program `C4PRoFNroxxzdgeCoM31LJjYRg7kT6ymogSTAT99iD1u` holds a `PlayerName` account per
  named profile (PDA `["player_name", profile]`): discriminator, version, profile @9..41, bump, UTF-8 name @42..end.
  One `getProgramAccounts` per pass reads all of them (3,560 names on 2026-11-07; all 326 collector owners named).
  `name: null` means the profile has no PlayerName, not a failed read (that is `quality.namesFailed`).
- **Names are user-written text.** They are not unique, and anyone can pick any name, including another player's.
  The collector strips control characters (C0, C1, DEL), zero-width and bidi controls (U+061C, U+200B, U+200E/F,
  U+202A-202E, U+2066-2069, U+FEFF), collapses whitespace, trims, and cuts at 32 code points (`nameLen` keeps the
  original length). The page must still render a name as **text** (never `innerHTML`) and keep the profile
  address reachable, since the name alone identifies nobody.
- **Wallet** = `profileKeys[0]` of the Profile account (u16 key count @28, 80-byte keys from @30), and only when
  that key is scoped to the player-profile program. A SAGE-scoped key is a session (hot) key, not the wallet:
  `wallet: null` with `walletWhy`. Read with `getMultipleAccounts`, 100 per call (4 calls for 326 owners).
- **Holdings are z.ink test-realm items.** `hulls` comes from each fleet's ships and `cargo` from each fleet's
  cargo hold, fuel and ammo tanks. These pods are nested in the Fleet account the pass already reads, so this
  costs **no** extra calls. `units` are the cargo's raw on-chain units. Not included: starbase storage (that is
  per-owner, per-starbase reads), the fleet's `components` pod, and cargo in a respawning fleet.
- **`refValue` is a MAINNET REFERENCE, not a z.ink value.** z.ink items cannot be sold on mainnet. This prices
  the same-named mainnet item in ATLAS from the Galactic Marketplace order book (Solana mainnet, program
  `traderDnaR5w6Tcoi3NFm53i48FTDNbGjBSZwWXDRrg`; names from `galaxy.staratlas.com/nfts`).
  - Hulls match by the longest whole-word mainnet ship name prefix ("Armstrong IMP Tip Mining Min Config" ->
    "Armstrong IMP Tip"), and cargo by exact name. Match on 2026-11-07: 84 of 85 hull configs (not "Fimbul BYOS
    Gallowspine") and 21 of 92 cargo names (most C4 resources do not exist on mainnet). `unpriced` counts the rest.
  - `atBid` sums quantity x best bid, and `atAsk` sums quantity x best ask. Each sum covers **only the lines that
    have that side of the book**, so `atAsk` can be below `atBid`. Thin books swing these numbers a lot (e.g. one
    1,000,200 ATLAS bid on a Rainbow Arc). Show them as a range with the "mainnet reference" label and `pricesAt`.
  - Prices are cached in `prices.json`; `ref.stale` is true past 26 hours.

Coordinates are galaxy map units: systems span x -50..51, y -45..46 (measured 2026-11-06); fleets can sit slightly outside (x -52..53).
