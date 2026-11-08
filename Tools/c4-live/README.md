# C4 Live collector

Reads the **SAGE C4 test realm on z.ink** with [`@aephia/atlas-kit`](https://docs.atlaskit.dev/) and writes
the files the `C4Live/` module animates from. One pass is about 15 s and reads about 1,600 fleets, 324 owners,
945 systems and 92 claim stakes (first run, 2026-11-06). Owner names, wallets and reference prices added
about 3.5 s and 6 calls on 2026-11-07 (5 z.ink: 1 names read + 4 wallet batches; 1 mainnet order-book read, only
when the cached prices are 55+ minutes old); a whole pass took 28.5 s.

```
cd Tools/c4-live
npm ci --ignore-scripts      # pinned: @aephia/atlas-kit 0.6.1, @solana/kit 6.10.0
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

## Safety rules the code enforces

- Output goes to `Data/c4-live/`, git-ignored because it changes every run.
- Every file is written to a per-process temp file, then renamed.
- **`db.json` is the single commit point**: the diff cursor, history, events and owner series are written in
  one atomic rename. A crash can therefore never pair a new history point with an old cursor.
- The served `history.json`, `events.json` and `owners.json` are copies of `db.json`. `latest.json` is written
  last.
- A pass that reads zero fleets refuses to write.
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
  quality: { mineFailed, mineTotal, charFailed, charTotal, partial, vanished?, suspectDiscovery?, bodiesFailed?, stakeDefsFailed?,
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
             mine?:{ ups (sum of out = yield, richness applied), baseUps (fleet stat), out:[{r resource, ups}], since } }],
  owners: [{ p profile, fa, fleets, ships, mining, ups, destroyed, atlas, rank,
             xp:{pilot,dataRunner,mining,building,crafting,combat:{xp,lvl}}, stakes, habs, stakesLive?, lastCombat,
             name (sanitised display name | null), nameAt (unix s it was read | null), nameLen? (raw length, only when cut),
             wallet (auth wallet address | null), walletAt, walletWhy? (why wallet is null),
             holdings: { atlas, fleets, ships, hulls{shipConfigName:n}, cargo:[{name, units}] (largest first),
                         refValue?: { basis:'mainnet reference', currency:'ATLAS', atBid, atAsk, priced, unpriced,
                                      pricesAt, top:[{kind:hull|cargo, name, ref (mainnet item), qty, bid, ask}] (8 largest) } } }],
  systems: [{ a, n, r region, x, y, f starbase faction, lvl, hp, sp, lc, built (builtDestroyedAt), links }],
  asteroids: [{ a, sys, sysName, x, y, fleets, ups, res:{resource:{cum, miners, ups, rich}} }],
  stakes: [{ a, o, st, def, defName ("Claim Stake Tier 1" / "Cultivation Stake Tier 2"), tier (1..n), slots, b buildings,
            sys, sysName, x, y, crew, body (planet address) }] }
```
Sum of `owners[].ups` plus NPC fleets' `mine.ups` equals `kpis.galaxyUps`, and so does the sum of `byFaction[].ups`.

`bodies.json` (for the system view): `{ generatedAt, bodies: [{ a, id, n, k: planet|asteroid, sys, sub? (planet type:
oceanic|barren|gas-giant|ice-giant|volcanic|terrestrial|dark), claimed? (planet plots with structures), stakes?[stake addr],
res: [{ r resource, rich, mined? (asteroid counter, units), miners? (active miners) }] }] }`. All 3,901 bodies: 2,543
planets and 1,358 asteroids, up to 7 planets and 4 asteroids per system. **The chain gives no position for a body
inside its system**, so the scene lays the bodies out on stylised orbits. `stakes[].body` links a claim stake to its
planet; `fleets[].s.asteroid` links a mining fleet to its asteroid. A failed bodies read keeps the previous file and
sets `quality.bodiesFailed`.

`history.json`: `[{ t, fleets, ships, players, mining, galaxyUps, resUps, minedDelta, minedDtSec, combat, destroyed, byFaction, atlasTotal }]`, one per full run, last 90 days.
`events.json`: `[{ t, k: combat|destroyed|gone|newFleet|starbaseCombat|captured, f|sys, n, o?, fa, from?, npc?, x, y, hp0?, hp1?, sp0?, sp1?, hpMax?, dmg?, vs?[{f,n,o,fa,npc}], dead?, afterCombat?, seed?, ships? }]`, sorted by `t`, last 8,000.
`owners.json`: `{ profile: [[t, fleets, mining, ups, atlas, rank], ...] }`, last 14 days. An owner not seen for 14 days is dropped.

`prices.json` (cache, refreshed at most once per 55 min): `{ fetchedAt, source:'solana-mainnet galactic marketplace', rpc
(host), program, currencies:{atlas:{mint, priceDecimals:8}, usdc:{mint, priceDecimals:6}}, counts:{orders, used, unknownMint,
otherCurrency, items}, items:[{ mint, name, symbol, itemType, atlas?:{bestBid, bestAsk, bids, asks, orders}, usdc?:{...} }] }`.
`prices.attempt.json` stamps every mainnet attempt (`{at, ok, error?}`), so a failing endpoint is also retried at most once
per 55 minutes. `db.json` `state.ident` holds the last known name/wallet per owner (`{n, nt?, na, w, wy?, wa}`), dropped
after 14 days unseen.

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
