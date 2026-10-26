# Cross-module analytics roadmap

Written 2026-10-04 for Siphaawal (Aephia Industries), extended 2026-10-05, 2026-10-08 and 2026-10-26. Twelve analytics that join data across the hub's modules.
Eight are built, in the **Command Deck** module (1, 2, 3, 6, 7, 11 - the last three as sub-tabs of one Loadouts tab - and 9 and 12 inside the Empire tab); two were built and dropped (4, 5); one was skipped after its data check (8); one is next (10). Every item says what question it answers,
which data it joins, how it is drawn, and what has to be checked before it is built.

Data for all of it is the SAGE uber-export of 2026-09-11. Counts below belong to that export.

## Status

| # | Analytic | Status | Where |
|---|---|---|---|
| 1 | Research tree | **Built 2026-10-04** | Command Deck, Research tab |
| 2 | Empire planner | **Built 2026-10-04** | Command Deck, Empire tab |
| 3 | Ships vs stakes calculator | **Built 2026-10-04** | Command Deck, Ships vs Stakes tab |
| 4 | Chokepoint chart | **Dropped 2026-10-05** - built, looked at, "not finding it useful"; removed the same evening | - |
| 5 | Logistics map | **Dropped 2026-10-05** - built as "Hauling", "same, not useful"; removed | - |
| 6 | Fleet builder against the fleet-point cap | **Built 2026-10-05** as the Fleet sub-tab | Command Deck, Loadouts > Fleet |
| 7 | Combat matchup matrix | **Built 2026-10-05** as the Fight sub-tab (the formula is JavaScript and runs headless) | Command Deck, Loadouts > Fight |
| 8 | Missions and scanning overlays | **Skipped 2026-10-08** - data check done: `missions` is seed data with no region join, scan has no range stat | - |
| 9 | Hab schedule | **Built 2026-10-08** inside the Empire tab (a pure `Empire.schedule` in `deck-model.js`, runs headless) | Command Deck, Empire tab |
| 10 | What changed between exports | Next | Landing page or its own page |
| 11 | Loadouts: haul, mine, fight, fleet, cost with configurations | **Built 2026-10-05** (Siphaawal's ask after 4 and 5, then "add all 4 as sub tabs") | Command Deck, Loadouts tab |
| 12 | Empire map + ledger: place stakes, give fleets jobs (mine / haul / supply), read made / burned / moved per hour | **Built 2026-10-26** (Siphaawal's ask: "a calculator to see how things will look if I do something"); replaces the top of the Empire tab. Unlike item 5 it is a what-if over the player's own plan, not a readout | Command Deck, Empire tab |

## Rules every item follows

These are standing rules for the hub, not preferences of one page.

- **No invented scores.** A chart shows quantities the export holds, or simple arithmetic on them. No weights,
  no "criticality", no "efficiency rating".
- **Everything visible.** Charts are always on the page; a chart and a table of the same numbers is a duplicate;
  a toggle is a hiding place.
- **Release status is never shown.** The release is v2, so every recipe and node counts.
- **Say what the data does not hold.** Each page names its inputs that are assumptions.
- **Game rules that override the data:** a claim stake is bought per tier and holds tier-N buildings only; a belt
  holds no stake, ships mine belts; the central hub yields only raws the planet has a deposit of; a processor's
  construction bill is a one-off purchase, never a reason to leave it out.
- **Verified before it ships.** Numbers are checked against a second derivation
  (`node Test/command-deck-check.js` for the Command Deck), and the page is driven in a browser.

## What the export does not hold

Any item that needs one of these takes it as a player input and labels it.

| Missing | Used by | How it is handled today |
|---|---|---|
| Length of a claim-stake tick | 2, 3 | One input for the whole Command Deck, shown as "assumed" until set or measured. The Ships vs Stakes tab has the measuring recipe |
| How deposit richness scales a stake's output | 2 | A switch, on by default (a multiplier, as the SAGE manual gives for ships) |
| Prices of hulls, stake deeds, crew, food, fuel, materials | 2, 3, 6 | Price boxes the player fills; they start with asks quoted on 2026-10-04 |
| Hardness of a deposit | 2, 3, 5 | Not applied; the pages say so |
| How track XP and points are earned | 1 | Bills stop at "level N needs X XP" |
| Which zone-access node covers which activity | 1, 2 | The grant on the activity's own track, else the cheapest; the others are named |
| A research gate on what a ship may mine | 1, 2 | None in the export; a fleet adds only zone access |
| The player's faction | 1, 2 | A chip on the page, default USTUR |
| Whether a second-stage processor can be placed | 2 | Not offered: nothing on a planet satisfies its placement tag |

## 1. Research tree (built)

- **Question:** what do I unlock to craft X, build a tier-N stake or fly this hull, and what does it cost?
- **Data joined:** `researchNodes` (294 nodes, 306 connections), `researchGateMap` (gates for 5,251 recipes, 1,501
  stake buildings, the stake tiers and the hab tiers), `levelThresholds` (8 tracks), with recipes, buildings and
  ships. None of this was in the hub before; `RefreshData/split-uber-export.js` now writes `JSON/research.json`.
- **Drawn as:** one SVG tree, a band per track, x = prerequisite depth. A goal lights its path in gold; the side
  panel prices it (track level and XP, points, ATLAS, tokens). A node's sheet shows what it grants and how many
  recipes and buildings it gates. Nodes marked researched are remembered, and "Next nodes" ranks what is open.
- **2026-10-06 (Siphaawal: "when I click on a node, it should explain what benefit it provides"):** the sheet now
  opens with the export's own description (179 of 294 nodes have one; it was in the data and never shown), each
  grant written as a sentence from the `character_value_changes` key and value (22 keys, all covered; a prestige
  track's grant says "per level"; the rare-mineral multiplier names its resources from the export's cargo table),
  and "Leads to", the nodes that require this one. 13 checks in section 11 of `Test/command-deck-check.js`; a fifth
  sabotage input blanks one cargo name and fails exactly the check that lists it.
- **A recipe's path includes getting its raws** (claim stakes, a mining fleet, or already in hand): extractor
  gates and the tier-1 stake, and zone access for raws outside the player's own low-risk zone. The player's
  faction is a setting. A level needed on a track is written on its band.
- **Reference figures:** 3,630 of 5,251 recipes sit behind a gate; Power Regulation Module needs Complex Crafting,
  Crafting level 15, 2,180 XP; every crafting node costs 350 ATLAS. With stakes for its raws, a USTUR player needs
  13 nodes for it instead of 3. For USTUR, 54 raws are in the home low-risk zone, 35 only in medium risk, 4 only
  in another faction's zone.
- **Open question for someone who plays:** which node lets a fleet mine, and a stake stand, in a medium-risk zone?
  The export has two that grant the access (Medium Risk Building, Contested Space Scanning) and does not say what
  each covers. The page uses Medium Risk Building (the cheapest) and names the other.
- **Still open:** links from the Ship Explorer's hull view and the Stake Builder's building sheet into the tree
  (the Recipe Explorer's sheet has one; the tree already accepts `?ship=` and `?building=`).

## 2. Empire planner (built)

- **Question:** do my stakes and ships cover this production plan, where is the shortfall, and how long does the
  bill take to gather?
- **Data joined:** the Recipe Explorer's plan, planets and deposits, stake buildings, ships, the Hub Explorer's
  hab build, the research gates, and the prices typed on the Ships vs Stakes tab.
- **Drawn as:** a flow chart that is also the sheet: stakes and fleets on the left, one row per line of the bill
  with the time to gather it, the plan's recipes on the right. Stake cards with a slot gauge and extractor steppers.
  A ranked list of planets that carry the most of what is still missing.
- **Still open:** import a layout from the Stake Builder (today the planner lays a stake out itself); the stakes'
  construction bill handed to the Recipe planner; a save/load of named empires; farms and cultivation stakes.

## 3. Ships vs stakes calculator (built)

- **Question:** at this tick length and these prices, which is the better buy?
- **Data joined:** ship mining rate, hold, crew and food; extractor rates, stake slots, crew, power and storage.
- **Drawn as:** output per hour against tick length on log-log axes, per hull/deed and per dollar; break-even
  ticks; the price a stake would need to match a hull; what each asks of the player; "measure your tick".
- **Reference figures (Copper Ore):** a full stake makes 0.12 / 0.6 / 2.56 / 9.75 / 34.02 per tick at tiers 1-5; an
  IMP Tap mines 19.192 per second; a T5 stake equals one Tap only if a tick lasts 1.77 s or less. Source report:
  `MINING-VS-STAKES-2026-10-04`.
- **Still open:** the tick length itself. One measurement in game settles it.

## 4. Chokepoint chart (dropped 2026-10-05)

Built as a Command Deck tab (scatter of bodies-with-deposit against full-chain demand, three demand measures, Galia
map on click, demand-per-body table), verified, shown to Siphaawal, judged not useful and removed the same evening.
Not to be rebuilt in this form. The one finding worth keeping: supply as a body COUNT and demand as a per-recipe
expansion both flatten what matters to a player (richness, zone, who can extract it); the Empire tab already
answers "can I get this raw" for a real plan. The spec is left below for the record.

- **Question:** which raws are wanted everywhere and found almost nowhere, and who holds them?
- **Data to join:** per raw, supply (stakeable planets, belts, best and median richness, by faction) from the
  Resources model's deposit index, against demand as full-chain units (the Recipe model's expansion summed over
  every recipe, or over a chosen plan).
- **Draw as:** one scatter, a dot per raw, supply on x and demand on y, both real quantities, coloured by the
  faction that holds most of it; click a dot to light its systems on the Galia map.
- **Check first:** which demand measure to plot. Recipe count ignores quantity (weapon recipes use hundreds of
  units per craft, building kits tens); full-chain units is the candidate, and the page must name the one it uses.
- **Size:** small. Both models already exist.

## 5. Logistics map (built and dropped 2026-10-05)

Built as a "Hauling" tab (below), shown to Siphaawal with item 4 the same evening: "same, not useful. I am looking
for deeper analytics." Removed. What replaced it is item 11 - the same travel maths, but applied to hull
CONFIGURATIONS against distance, which is a decision (what to fit) rather than a readout. Spec and build record kept.

- **Question:** what can this ship reach in one warp from here, and how many trips a day from my stake to the
  Central Space Station?
- **Data to join:** system coordinates and warp links (planet data), each hull's `maxWarpDistance`, warp and
  subwarp speed, cooldown, fuel use and cargo (ship data), and the starbase tier of each system.
- **Draw as:** range rings on the Galia map from a chosen system; a route line with jumps, travel time, fuel and
  trips per day for a chosen hull; stake storage fill time beside it (from item 3) to show how often a haul is due.
- **Check first:** the units of speed and distance in the export against one timed trip in game.
- **Size:** medium. The Galia map exists in the Resources and Planet explorers.
- **Was built as (removed):** `CommandDeck/deck-haul.js` on a `Haul` engine in `deck-model.js`, framed as the action - from MY
  stake, with THIS hull, how often must a haul leave. Origin = an Empire stake (default) or any system; destination
  = the faction CSS (default) or any system; warp / subwarp. Map: route with a dot per jump, 1 / 2 / 3-warp rings.
  Round trip itemised from `stats.travel` (spools, straight-line flight, cooldowns, unload + load at the loading
  rate, fuel out + back + one planet exit against the tank). Stake origin: output a day at the tick length
  (`StakeEngine.production`), storage fill, **between hauls**, flagged when the hull cannot fly that many. Table:
  every hull on the route, cargo a day first, with the hauls a day the stake needs from each. **The unit check is
  on the page:** "unverified" until one timed leg is typed, then every time is scaled to it (stored). Warp lanes
  and starbase tiers are not used. Reference: Tap, Foy -> Eternity 10.19 units, 2 jumps, 26 min round trip, 10.9 k
  fuel; a full T5 copper stake at a 60 s tick = one Tap haul every 15.8 h. 21 checks in `Test/command-deck-check.js`
  section 9 (hand derivation from the travel fields and coordinates, constants; a fourth sabotage input doubles the
  Tap's warp speed and fails exactly the hauling constants); 22-step headless-Chrome drive, 0 console errors, no
  horizontal scroll at 390 / 1100 / 1440.

## 6. Fleet builder against the fleet-point cap (built 2026-10-05 as Loadouts > Fleet)

- **Question:** what is the best fleet I can field at my Council Rank, and what does it need?
- **Data to join:** `globalCombatConfig.fleet_points` (points per hull class), the Fleet Size nodes of the research
  tree (cap per tier), ship stats, crew and food, ship recipes for the build bill.
- **Draw as:** a points gauge that fills as hulls are added; totals for crew, food per second, cargo and mining
  rate; the build bill handed to the Recipe planner; the research needed handed to the tree.
- **Check first:** which point scale the game enforces. The export's class table (XXS 1 ... Capital 36, Titan
  81/128) and the ship sheet used for earlier research (IMP 5, Tap 3) are different scales.
- **Size:** medium.
- **Built as:** the Fleet sub-tab of Loadouts. The export's table is used (v1; combat and capacity points equal in
  every class but Titan, 81 / 128 - which one the cap counts is unstated, combat points are used and the page says
  so); the cap is the Fleet Size ladder from the research nodes (start 4, Tier 1..8 = 7 / 12 / 19 / 28 / 39 / 52 /
  67 / 84). Rows = hull + configuration + count, added from the loadout cards; totals for points, hulls, crew, hold,
  cargo and ore an hour on the Haul / Mine route, HP, SP, damage; "what still fits" per loadout; a row can be sent
  back to the cards. Not built from the spec: food per second and the research hand-off (the Research tab's
  `?ship=` link covers hull research; crew food is not a per-hull stat in the export). The build bill is the Cost
  sub-tab.

## 7. Combat matchup matrix (built 2026-10-05 as Loadouts > Fight)

- **Question:** which hull beats which, per fleet point?
- **Data to join:** `globalCombatConfig.combat`, the `combatFormula` text in `shipConfigurations`, ship combat
  stats and the configurations the Ship Explorer already resolves.
- **Draw as:** a ship-by-ship heat map of time to kill, with a row per hull class.
- **Check first:** whether the combat formula in the export can be evaluated as shipped. If it is prose or
  editor code, this item waits.
- **Checked and built:** `shipConfigurations.combatFormula` is a 1,534-line JavaScript IIFE (hull and shields,
  damage by type against counters, size-ratio hit chance, crits, missiles, ammo, repair, stimulants, up to 1,000
  rounds, Math.random hit rolls) that reads two flat stat rows (`allShips` keys) and `window.*` options and returns
  an HTML battle report. The Loadout engine wraps it as `new Function('left','right','window','document','console',
  body)` and runs it headless N times per pair with the first strike alternating (0.4 ms a bout), parsing the
  winner and round count from the report. Built as the Fight sub-tab: every pair of the loadouts, win share bar,
  draw / mutual share, mean rounds, N = 50..500 with a re-roll; the combat stats base -> fitted. A ship-by-ship
  heat map over all 61 hulls is a later step (61 x 61 x 200 bouts is ~15 min of browser time; it would need a
  worker and a cache). Reference: Tap Kinetic Damage Max beats the bare Tap 100 % in ~42 rounds; an X4 does not
  beat a bare IMP.

## 8. Missions and scanning overlays (checked 2026-10-08, skipped)

- **Question:** where do missions pay best, and what does my scan power cover?
- **Data to join:** `missions` (6 missions, 6 reward tables, 51 region settings), `scanPatternsDefault` and
  `scanPatternsAdvanced`, ship scan stats, the Data Running track of the research tree.
- **Draw as:** two layers on the Galia map: reward per region, and scan coverage for a chosen hull.
- **Data check (2026-10-08, export 2026-09-11):** the export cannot support either layer.
  - `missions` declares itself a Phase-1 seed (`meta.sources.missions.file` = `missions-seed.json`): the 6 missions carry
    no region, system or planet id (`planetType` is a category word) and rewards vary by type and level only. The 51
    `regionKnobs` carry no reward; the only knob that differs across regions is the order seed, which is exactly the
    zone type (3 values), and the ids join nothing (names join `regionDefinitions` 50/51). A "reward per region" layer
    would be a three-colour zone map, a readout.
  - Scan has no range stat: hull scan stats are cooldown, cost, power and SDU per scan. The scan patterns carry noise-map
    centres in Galia coordinates, but every pattern reaches all 945 systems and the signal needs noise functions and a
    seed the export lacks. "Coverage" cannot be computed. SDU an hour per hull is already on Loadouts, and the Data
    Running grants are already on the research tree.
  - Dangling ids: a reward resource (`medical-nanites`) and nine gear or cosmetic ids exist nowhere in the export;
    `scanPatternsAdvanced` is `status: archival`, not live; the six Starbase rows in `allShips` would top any
    scan-power ranking and must be dropped from one.
- **Revisit when** the export's `meta.sources.missions.file` is no longer `missions-seed.json`, or a mission carries a
  region id.

## 9. Hab schedule (built 2026-10-08)

- **Question:** how long does this plan take with my hab's real job count, and which craft or job is the bottleneck?
  The decision it serves: add jobs (another station, a storage with a job bonus) or a faster station - or neither.
- **Data joined:** the Recipe planner's craft list (the Empire tab's own expansion, which stops at anything a stake
  processor already makes), each craft's `constructionTime`, output quantity and ingredient quantities; the Hub
  Explorer's saved build (`hubExplorer.plan.v1`) read through `HubModel.plan` for the hab's jobs, each station's jobs
  and speed, and each storage's job bonus.
- **Drawn as:** a job timeline inside the Empire tab, under *Who supplies what*: one lane per job (the hab's job at
  1x, each station job at its speed, each storage bonus at 1x), a block per run of one craft kind, a time axis, the
  busy share of each lane at the right, the critical path outlined in gold. Below it the critical path as a chain of
  segments (each marked *after a free job* or *after an input*), one sentence that says whether the queue or the
  chain sets the time, the craft that holds most of the path, the busiest and idlest job; then **the queue** - every
  craft kind in start order with crafts, time each, first start, last done, job time and its share of the path.
  The tile that used to show the lower bound now shows the scheduled time, with the lower bound (work / speed, "if
  every job ran in parallel") beside it; the facts row adds the chain alone (unlimited jobs).
- **Built as:** `Empire.schedule(plan, hab)` in `CommandDeck/deck-model.js` - list scheduling with a pooled
  inventory: `expand()` now keeps a step per craft kind (time, output per craft, inputs per craft); a craft may
  start when every crafted input is in the pool (made - reserved >= the recipe's quantity, so the first of a kind
  starts before every input craft is done) and a lane is free; the fastest free lane takes the ready craft with the
  longest tail (its time plus the longest tail of anything that uses it), on a tie the kind the lane just ran. Each
  start records what it waited for, so the chain from the last craft back to time 0 is the critical path and its
  waits say where the time went. `Empire.lanesFromHab(rows)` turns the Hub Explorer build into lanes. Raws are taken
  as in hand (gathering them is the bill); a storage's job bonus is read as a 1x job because the export gives it no
  speed - the page says both. No hab build saved: one job at 1x stands in and the page says so.
- **Reference figures (Power Regulation Module x100, T3 hab + S station + T3 storage = 5 jobs, 5.5x):** 1,200 crafts
  take 88.4 min scheduled against 87.2 min work / speed and 3.5 min for the chain alone; every job is 98-100 % busy,
  the whole path is lane waits (the queue sets the time), the module itself holds 32 min of it. On one job: 9.4 h.
- **Checked:** 22 checks in section 12 of `Test/command-deck-check.js` (a chain A x2 -> B x2 -> C x1 on 1 and 2 jobs
  by hand, a craft with no inputs on 1x and 2x lanes, a pooled output, an empty plan, the real plan on 1 job = every
  craft in sequence and on unlimited jobs = the Recipe planner's critical path, every placed craft re-checked
  directly for lane overlap, duration and inputs in the pool, the hab lanes against the Hub Explorer's job count).
  The script emits 175 PASS, 0 FAIL; the five existing sabotage inputs still fail 23. A hand sabotage of the pool
  rule (ignore the input quantity) failed exactly the pooled-output check and was reverted. Headless-Chrome drive
  seeded from empty with both localStorage keys: 13 steps, every value on the timeline, path and queue read and
  equal to the Node run, 0 console errors, no horizontal scroll at 390 / 1100 / 1440.
- **Not in it:** crafting fees and XP, the station a craft is actually placed on in game (the lanes are the model's
  choice), a research node that cuts crafting time (the tree shows it; the schedule does not apply it yet).

## 10. What changed between exports (next)

- **Question:** what did the last balance pass do to my plan?
- **Data to join:** two exports (the pipeline already hashes and diffs them, and `RefreshData/data-report.py`
  writes a PDF).
- **Draw as:** a page of changed rates, costs, recipes and nodes, with the player's saved plan and empire marked
  where a change touches them.
- **Size:** medium; needs the previous export kept beside the current one.

## 11. Loadouts - haul, mine, fight, fleet and cost with configurations (built 2026-10-05)

- **Ask (Siphaawal, after dropping 4 and 5):** "I am looking for deeper analytics ... try haul vs haul with configs."
- **Question:** which hull configuration hauls best on my route - and where does the answer change?
- **Data joined:** `ships-data.js` configurations (48 per hull: Tier One..Five, Cargo Boost / Fast Freight / Mining /
  Scanning / Salvage / Repair / Rescue / damage kits, each Min / Mid / Max) resolved through the Ship Explorer's
  `ShipConfigCalculator` with `Data/ship-components-data.js` (3,756 components) and `Data/ship-formulas-data.js`
  (per-component, per-class-tier effects; class and tier scaling formulas). Hauling stats moved by components:
  Cargo Module (hold, subwarp speed), Fuel Module (tank), Power Core (speeds, range, fuel, spool, loading), Warp
  Drive (warp speed, range, warp fuel, spool), Subwarp Engine and Thrusters (subwarp speed and fuel, exit fuel),
  Heat Sink (cooldown, spool, loading), Tractor Beam (hold, loading), Freight drone (hold).
- **Second ask the same night ("I like this one ... add all 4 along with haul vs haul under one tab as sub tabs"):**
  the tab became **Loadouts** with six sub-tabs sharing one set of cards - Haul (the above), Mine, Scan, Fight, Fleet,
  Cost - and the engine moved to `CommandDeck/deck-loadout.js`, now working on each hull's FLAT stat row
  (`Data/combat-data.js` `allShips`, 74 keys, a new `combat.json` projection in the split) so one fitted row serves
  hauling, mining and the combat formula alike. Items 6 and 7 were built as the Fleet and Fight sub-tabs (their
  sections say how); Mine applies the same cycle maths to mining (fill at rate x richness, haul, repeat); Cost
  matches each fitted component to its recipe by name and expands it with the Recipe planner, with a button into the
  production plan.
- **Built as (Haul):** `CommandDeck/deck-vs.js`. Two to four loadouts; route length
  as a number (0.5-60 units) with quick picks; warp / subwarp. Charts: cargo delivered an hour and fuel per unit
  delivered against route length (log-log) - each line a staircase that steps at every extra jump. At-distance table
  (jumps, times, cargo an hour, hold, fuel, trips a tank, gain over the bare hull). Crossover list with the reason
  (who needs the next jump). Eleven-stat table base -> fitted with multipliers, best per row, and the fit list.
- **Finding worth keeping:** for a Tap, *Cargo Boost Max* (hold x1.75, warp x1.2, range 12.16) out-hauls *Fast
  Freight Max* (hold x1.39, warp x1.6, range 13.16) at every length EXCEPT the jump windows 12.2-13.2, 24.3-26.3,
  36.5-39.5, 48.6-52.7 units - a flip is a range boundary, not a speed story. By subwarp there is no flip. The fitted
  Tap hauls 2.96x the bare Tap at 10 units.
- **Mine finding:** Tap *Mining Max* (rig x1.2 + 3.76/s, hold x1.55) delivers 69.8 k ore an hour at 10 units and
  richness 1 against *Cargo Boost Max* 52.7 k and the bare Tap 36.0 k - no crossover, the rig wins at every length;
  76 % of a Cargo Boost cycle is spent mining at 10 units. **Fight finding:** *Kinetic Damage Max* beats the bare Tap
  100 % (~42 rounds); *Cargo Boost Max* (T5 shields + hull plating) also beats the bare Tap 100 %. **Cost finding:**
  Cargo Boost Max = 9 recipes, 1.18 M raw units of 53 kinds (Copper Ore 137.7 k on top); a drone fit is priced at T1
  (the fit names a hull with no tier). **Fleet:** five Taps (M, 16) or two IMPs (CAP, 36) fill a Tier 8 cap of 84.
- **Not in it:** warp lanes, a stake origin, a 61 x 61 combat heat map (needs a worker), crew food per hull.
- **Checked:** 40 checks in `Test/command-deck-check.js` sections 9-10 (loadout stats equal a fresh calculator run on
  every one of the 67 flat stat keys; the flat row agrees with the hub's nested stats; travel maths by hand;
  crossovers against a 3,000-point direct scan and at the two warp ranges; the mining cycle by hand; the combat
  formula run directly agrees with the engine's share, a mirror match stays within noise over 400 bouts; the
  configuration's raw bill equals the Recipe planner's for the same recipes; fleet points equal the export table with
  the Titan exception; the Fleet Size ladder from the nodes). A fourth sabotage input (Cargo Module cargo effect x1.1)
  fails exactly the hold / throughput / crossover / mining checks. 30-step headless-Chrome drive over all six
  sub-tabs, 0 console errors, no horizontal scroll at 390 / 1100 / 1440 on each.

## Order

4 and 5 were built and dropped; 11 built, then widened to five sub-tabs that also close 6 and 7 - all 2026-10-05.
9 (hab schedule) built 2026-10-08 inside the Empire tab. Left: 10 (at
the next export). Scan vs Scan and the Fleet -> Research hand-off were added the same night on request. Natural extensions of 11: a 61 x 61 combat heat map in a worker, crew food per hull once the export
carries it. Before the next item: say in one line what they will DECIDE with it - 4 and 5 were readouts, 11 is a
fitting decision, and that is the depth Siphaawal called useful.
