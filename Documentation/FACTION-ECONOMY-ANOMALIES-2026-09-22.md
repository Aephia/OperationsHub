# Faction economy anomalies - Star Atlas SAGE data, 2026-09-22

**Question:** which things in the SAGE economy data give MUD, ONI or USTUR an advantage over the others?
**Data:** the 2026-09-11 uber export as split into `JSON/*` (945 systems, 3,901 planets, 3,526 resources,
5,251 recipes, 1,620 claim-stake buildings) plus the unconsumed export sections (`starbaseBalance`, `missions`,
`researchNodes`, `cargoTypes`, `levelThresholds`, `globalCombatConfig`).
**Method:** three independent computed passes (territory and raw supply; recipe and building chains; the raw
export), every headline re-derived from the source files by a second script before it was written here.
"Verified" below means that second derivation matched. Territory = `mapData[].closestFaction` (agrees with
`faction` and the legacy code prefix on 945/945 systems); supply = sum of `planets[].resources[].richness`.

## The one-screen answer

The map and the recipe book are **symmetric by construction** (315 systems, 23 regions, 5 safe regions, 200
faction weapons, 4 locked raws and 1 locked component per faction, identical extractor rates, identical
research costs). The asymmetries are in **where the locked raws were placed, what tier they were given, and a
handful of authoring errors**. They do not all point the same way: USTUR has the largest and riskiest supply
and the lowest starbase gate; ONI has the safest, scarcest and most expensive weapon chain; MUD is in the
middle on every axis but starts with twice the tier-2 starbases.

| Axis | MUD | ONI | USTUR | Verified |
|---|---|---|---|---|
| Locked-raw deposits (planets / richness) | 142 / 145 | **86 / 82** | **390 / 271** | yes |
| Weapon raws inside the 5 safe (LowRisk) regions | 70 % / 64 % (Resonium, Tenon) | **100 %** (Gold, Chisenic, Thermoplastic) | **0 %** (Viscovite, Germanium) | yes |
| Tier of the weapon raws | T5 + T3 | T3 x3 (+ T5 matrix) | T3 + T4 | yes |
| Effective starbase level to build ANY own weapon | L5 for 200/200 | L5 for 200/200 | **L4 for 128/200**, L5 for 72 | yes (assumes a raw's `min_starbase_level` gates it) |
| Ingredient load per weapon (sum of quantities, 200 weapons) | 33.6 M | **37.4 M (+11.2 %)** | 33.6 M | yes |
| Scarcest weapon input | Hicenium 15 planets / 15.6 | **Raw Chisenic 7 planets / 6.1, in 4 systems** | Viscovite 12 planets / 9.7 | yes |
| Locked-raw `baseValue` | 30,20,20,20,20 | 30,20,20,20,20 | **30,40,40,30,30** | agent C |
| Faction-tagged building families (x5 tiers) | 10 | 9 | **12** | agent B/C |
| Tier-2 starbases at start (`starbase.tier`) | **61** | 26 | 29 | agent A/C |
| Share of all T4 richness / T5 richness | 27 % / 31 % | **18 % / 39 %** | **56 % / 30 %** | agent A |
| Systems in max-tier-5 regions | 89 | **114** | 76 | agent C |
| Home system degree / mean hops to own linked systems | 4 / 8.0 | 4 / 8.1 | **3 / 9.1** | agent A (28 % of links populated) |

## Ranked findings

### 1. USTUR is the only faction that must leave its safe zone to arm itself (verified)
Every one of USTUR's five locked raws - 390 planets - sits in `MediumRiskZone` regions; zero in its five
`LowRiskZone` home regions. 110 of the 180 Germanium planets are on `controllingFaction: Neutral` systems.
ONI's three weapon raws are 100 % inside its safe zone; MUD's two are 64-70 % inside. Whether this is a
handicap (exposure, PvP loss rules) or an advantage (4.5x ONI's deposit count, 3.3x the richness, higher
`baseValue`) depends on risk-zone rules the export does not carry. It is the largest structural asymmetry
in the data either way. Fields: `resources[].faction`, `regionDefinitions[].risk_zone`, `mapData[].regionId`.

### 2. USTUR is the only faction that can build T1-T4 weapons below a Level 5 starbase (verified)
Expanding each faction's 200 weapon recipes to raw: MUD hits L5 on every weapon because Resonium Ore is a
T5 raw (`min_starbase_level: Level5`); ONI hits L5 on every weapon because its Jasphorus Weapon Matrix is
T5/L5 (the other two matrices are T4/L4); USTUR's raws are T3/T4, so 128 of its 200 weapons gate at L4.
A `Kinetic Burst XXXS T1` or `Energy Burst XXXS T1` says `Level1` on its own row and cannot be built below
L5. Caveat: this assumes the `min_starbase_level` on a BASIC RESOURCE row gates that raw. Fields:
`recipes[].min_starbase_level`, `recipes[].ingredients[].name`.

### 3. ONI weapons need a third locked raw, and it is the scarcest resource on the map (verified)
ONI weapons consume Gold Ore + Raw Chisenic + Thermoplastic Resin at full per-slot quantity where MUD and
USTUR consume two raws: 8.8 vs 7.8 ingredients per recipe, +11.2 % total quantity (37,411,940 vs 33,647,260
over the 200), and because `cargoTypes` storage cost derives from ingredient mass, +11.2 % storage cost too.
Raw Chisenic exists on 7 planets in 4 systems (richness 6.1); Gold Ore on 10 planets in 6. Losing two king
systems (Communion, Segal) costs ONI ~43 % of its Chisenic. MUD's thinnest weapon raw has 15 planets.

### 4. The faction processor buildings contradict the recipe book (verified for the worst case)
11 of 158 T1 processors in `buildings.json` list `resourceRate` inputs that differ from the same output's
`recipes[].ingredients`, and all 11 are faction-tagged or downstream of one. The worst: `signal-modulator-
processor-t1..t5` carries `requiredTags: [..., "oni", "ustur"]` and consumes Viscovite (USTUR-locked) +
Raw Chisenic (ONI-locked) + Neural Coral, while the recipe says Quartz + Silicon + Neural Coral for all
three factions. `researchGateMap._meta` says building tags are subset-AND, which makes the building
unbuildable by anyone; under OR each of ONI/USTUR needs the other's raw. Signal Modulator sits upstream
of 287 buildings, 240 ship components, 190 countermeasures and 70 missiles. Which file the game actually
runs is the open question; if it is `buildings.json`, USTUR gates 1,661 recipes for the others and is itself
blocked on 1,138 (MUD 1,694, ONI 1,772 blocked). Authoring error, not design.

### 5. The three organic plants are "anyone may grow it" in recipes and single-faction on the map (verified)
`frostcore-bryophyte` (MUD), `mind-shade-fungus` (ONI), `aegis-barrier-cactus` (USTUR) have
`factions: [MUD, ONI, USTUR]` in `recipes.json` and a single `faction` in `resources.json`. Result: 11
all-faction T3 organics (cryostabilin, psyconine, ballistene, overkill-stim, ...) are unbuildable in-territory
by two factions each - MUD is blocked on 3, ONI and USTUR on 4. Rotational, small, but the only place the
"symmetric" recipe book actually excludes a faction.

### 6. Eight of ten re-tiered raws are MUD/ONI locked raws; none are USTUR's (verified)
`resources[].tier` says T2 for Diamond, Hicenium, Resonium, Tenon (MUD) and Gold, Jasphorus, Raw Chisenic,
Thermoplastic (ONI) while their recipe `outputTier` is T3/T4/T5; USTUR's four agree. Extractor rates follow
the recipe tier (T5 = 0.004/h vs T2 = 0.010), so `resources.json` is the stale side. Two consequences: MUD
and ONI locked raws are priced at T2 `baseValue` 20 while USTUR's comparable raws are 30-40, and any tool
that reads `resources.tier` under-tiers two factions' supply.

### 7. Tier skew by faction (agent A, consistent across both computations)
ONI holds 43 % of T3 and 39 % of T5 richness but 18 % of T4 and 27 % of T2; USTUR holds 56 % of T4 (41 %
without its exclusives) and the weakest T5 top end (133 T5-capped planets vs 149 / 203; T5 richness 131.5 vs
135.5 / 172.0; thinnest T3 slots, median 0.6 vs 0.8 / 1.1); MUD holds 38 % of T2. Driven by region
`resource_tiers` counts (ONI 8 x [1,3] / 4 x [1,4] / 6 x [1,5]; USTUR 7 x [1,4] / 4 x [1,5]).

### 8. MUD starts with 61 tier-2 starbases; ONI 26, USTUR 29 (agents A and C)
`mapData[].starbase.tier` on secondary systems. 936 all-faction recipes and 40 weapons per faction carry
`min_starbase_level: Level2`, so MUD has ~35 more systems where Level-2 crafting is possible from day one.
What the field means on non-king systems is undocumented.

### 9. Common-raw supply skew that feeds thousands of recipes (agent B)
ONI ~50 % of Tungsten and Sapphire, ~47 % of Bathysphere Pearls, Drywater, Vanadium, Cryo Formation (1,201 /
613 / 609 / 827 / 623 / 840 recipes) but ~21 % of Garnet, Thermodyne, Oxygen, Peridot (990-2,130 recipes
each) and 19 % of T5 Living Metal Symbionts; USTUR 21 % of Palladium (1,131 recipes, and an input to all four
USTUR-tagged processors); MUD 44 % of Rhodium. Aggregate value is flat (686k / 687k / 698k richness x
baseValue) - the skew is in what each faction must import, not how much.

### 10. Other lopsided authoring (agent C)
- `starbaseBalance` is a single MUD system-0 archetype (`starting_faction: MUD`); no ONI/USTUR matrices
  exist, so any consumer applies MUD's numbers to everyone.
- 5 of 6 seed missions are in MUD space, 1 ONI, 0 USTUR; the 51 mission `regionKnobs` and the map's 69
  `regionDefinitions` do not share ids and only 39 names match.
- USTUR has 6 exclusive processor lines vs MUD 4 vs ONI 3 (12 / 10 / 9 building families); MUD has the only
  second faction-locked component (`component-crystal-lattice-1`).
- `Crystal Lattice` has three alternative recipes; the MUD-only one (Diamond) is first, so any tool that
  resolves by first match reports ONI/USTUR at 90 % buildable instead of the true 99.8 %.

## Data-quality issues (faction-neutral, but they distort every analysis above)
- `links` (warp lanes) populated on 264 of 945 systems; hop distances are over a 28 % skeleton.
- `controllingFaction` is `""` on 184 systems and `Neutral` on 432; the tool falls back to `closestFaction`.
- `resources[].planet_types` contradicts 61 % of actual placements (asteroid belts, 35 % of planets and
  43-45 % of richness, have no slug and no building tag); it cannot be used for validation.
- 6 raws have no extractor building at all, including Garnet Crystals (1,736 recipes).
- 212 of 242 research nodes cost a flat 35,000,000,000 ATLAS; `dailyCheckIn` is all 100s; 35 recipes have
  `constructionTime: 0`; `Combat Medallion I` has a 10x lower circuit breaker and xp 0.
- Duplicate research nodes `Enemy Faction Scanning` (#19 DataRunner 22 vs #109 DataRunner 1) and `Deep
  Space Scanning` (#20 / #110): whichever the game reads moves enemy-zone access by ~20 levels.
- `RESOURCE_MAPPING_ANALYSIS.md` in this folder describes an older export (78-resource planets, 7-of-8 T5;
  today's max is 44 and 6).

## What the data cannot say
- Risk-zone rules (what MediumRiskZone costs a miner), so the sign of finding 1 is open.
- Whether `min_starbase_level` on a raw gates its extraction (finding 2).
- Which of `recipes.json` / `buildings.json` the game runs for claim-stake processing (finding 4), and whether
  building tags are AND or OR.
- Whether asteroid-belt resources are claim-stake extractable.
- Combat balance of kinetic vs energy vs emp (only cost and supply were compared).
- Richness semantics (rate vs cap); it was summed as a weight, as the tool's own analytics do.

## What to do with it
1. Send findings 4, 5 and 6 to ATMTA as data bugs - they are contradictions between files, not balance.
2. Ask about 1 and 2 as design questions: was "USTUR mines in medium-risk at a lower starbase gate; ONI mines
   in safe space at L5 with a third raw" intended?
3. For the guild: ONI's weapon line hangs on 4 systems (Raw Chisenic); USTUR's on 102 (Germanium). Whoever
   plans conquest should read that as a target list.

Scripts and full tables: session scratch `econ/A|B|C/` (2026-09-22); the per-resource supply and hop tables
are in `econ/A/tables.md`.
