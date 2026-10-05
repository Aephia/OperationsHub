# Cross-module analytics roadmap

Written 2026-10-04 for Siphaawal (Aephia Industries). Ten analytics that join data across the hub's modules.
Three are built, in the new **Command Deck** module; seven are next. Every item says what question it answers,
which data it joins, how it is drawn, and what has to be checked before it is built.

Data for all of it is the SAGE uber-export of 2026-09-11. Counts below belong to that export.

## Status

| # | Analytic | Status | Where |
|---|---|---|---|
| 1 | Research tree | **Built 2026-10-04** | Command Deck, Research tab |
| 2 | Empire planner | **Built 2026-10-04** | Command Deck, Empire tab |
| 3 | Ships vs stakes calculator | **Built 2026-10-04** | Command Deck, Ships vs Stakes tab |
| 4 | Chokepoint chart | Next | Command Deck (new tab) or Resources Explorer |
| 5 | Logistics map | Next | Command Deck (new tab) |
| 6 | Fleet builder against the fleet-point cap | Next | Ship Explorer or Command Deck |
| 7 | Combat matchup matrix | Needs a data check first | Ship Explorer |
| 8 | Missions and scanning overlays | Needs a data check first | Planet Explorer map |
| 9 | Hab schedule | Next | Recipe Explorer planner |
| 10 | What changed between exports | Next | Landing page or its own page |

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

## 4. Chokepoint chart (next)

- **Question:** which raws are wanted everywhere and found almost nowhere, and who holds them?
- **Data to join:** per raw, supply (stakeable planets, belts, best and median richness, by faction) from the
  Resources model's deposit index, against demand as full-chain units (the Recipe model's expansion summed over
  every recipe, or over a chosen plan).
- **Draw as:** one scatter, a dot per raw, supply on x and demand on y, both real quantities, coloured by the
  faction that holds most of it; click a dot to light its systems on the Galia map.
- **Check first:** which demand measure to plot. Recipe count ignores quantity (weapon recipes use hundreds of
  units per craft, building kits tens); full-chain units is the candidate, and the page must name the one it uses.
- **Size:** small. Both models already exist.

## 5. Logistics map (next)

- **Question:** what can this ship reach in one warp from here, and how many trips a day from my stake to the
  Central Space Station?
- **Data to join:** system coordinates and warp links (planet data), each hull's `maxWarpDistance`, warp and
  subwarp speed, cooldown, fuel use and cargo (ship data), and the starbase tier of each system.
- **Draw as:** range rings on the Galia map from a chosen system; a route line with jumps, travel time, fuel and
  trips per day for a chosen hull; stake storage fill time beside it (from item 3) to show how often a haul is due.
- **Check first:** the units of speed and distance in the export against one timed trip in game.
- **Size:** medium. The Galia map exists in the Resources and Planet explorers.

## 6. Fleet builder against the fleet-point cap (next)

- **Question:** what is the best fleet I can field at my Council Rank, and what does it need?
- **Data to join:** `globalCombatConfig.fleet_points` (points per hull class), the Fleet Size nodes of the research
  tree (cap per tier), ship stats, crew and food, ship recipes for the build bill.
- **Draw as:** a points gauge that fills as hulls are added; totals for crew, food per second, cargo and mining
  rate; the build bill handed to the Recipe planner; the research needed handed to the tree.
- **Check first:** which point scale the game enforces. The export's class table (XXS 1 ... Capital 36, Titan
  81/128) and the ship sheet used for earlier research (IMP 5, Tap 3) are different scales.
- **Size:** medium.

## 7. Combat matchup matrix (needs a data check)

- **Question:** which hull beats which, per fleet point?
- **Data to join:** `globalCombatConfig.combat`, the `combatFormula` text in `shipConfigurations`, ship combat
  stats and the configurations the Ship Explorer already resolves.
- **Draw as:** a ship-by-ship heat map of time to kill, with a row per hull class.
- **Check first:** whether the combat formula in the export can be evaluated as shipped. If it is prose or
  editor code, this item waits.

## 8. Missions and scanning overlays (needs a data check)

- **Question:** where do missions pay best, and what does my scan power cover?
- **Data to join:** `missions` (6 missions, 6 reward tables, 51 region settings), `scanPatternsDefault` and
  `scanPatternsAdvanced`, ship scan stats, the Data Running track of the research tree.
- **Draw as:** two layers on the Galia map: reward per region, and scan coverage for a chosen hull.
- **Check first:** neither section has been read in detail yet; the shapes decide what can be drawn.

## 9. Hab schedule (next)

- **Question:** how long does this plan take with my hab's real job count?
- **Data to join:** the Recipe planner's craft list and build order, the Hub Explorer's jobs and station speed.
- **Draw as:** a job timeline: one lane per job slot, crafts placed in dependency order, the queue visible.
- **Note:** the Empire tab shows a lower bound today (crafting time one at a time, divided by the hab's jobs).
  The schedule replaces that with the real order.
- **Size:** small to medium.

## 10. What changed between exports (next)

- **Question:** what did the last balance pass do to my plan?
- **Data to join:** two exports (the pipeline already hashes and diffs them, and `RefreshData/data-report.py`
  writes a PDF).
- **Draw as:** a page of changed rates, costs, recipes and nodes, with the player's saved plan and empire marked
  where a change touches them.
- **Size:** medium; needs the previous export kept beside the current one.

## Order

4 and 9 are the cheapest, and both sharpen what is already built. 5 and 6 are the next real tools. 7 and 8 start
with reading the data. 10 pays off at the next export.
