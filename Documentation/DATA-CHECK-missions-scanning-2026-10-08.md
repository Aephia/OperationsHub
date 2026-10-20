# Missions and scanning overlays - data check (roadmap item 8)

Data check 2026-10-08 against `uber-export-2026-09-11.json` (62 MB, `meta.exportDate` 2026-09-11T01:12Z; `uber-export-latest.json` is the same file). Hub data read: `JSON/research.json`, `JSON/resources.json`, `Data/combat-data.js`, `Data/ships-data.js`. No project file was changed. Every table below was emitted by the scripts in this scratchpad (`shape1.py`, `detail2.py` .. `detail6.py`; outputs `detail2.out` .. `detail5.out`).

## Recommendation: SKIP (both layers)

**Reward per region cannot be drawn from the data: no mission names a region, and the 51 region settings carry no reward.** The `missions` section is a self-declared "Phase-1 seed" (`_meta.note`, source file `missions-seed.json`): 6 hand-written sample missions, all pinned to "MUD-3" / Frenir / Hopla lore, with reward tables whose loot ids include four that no cargo type or resource in the export knows. The 51 `regionKnobs` hold three distinct values across all 51 rows (order seed 72 / 70 / 60, which is exactly the zone type) and a siege block identical on all 51; `neighbors` is empty on every row. The only derivable "reward per region" is the threat-tier reward scalar implied by the seed, which is one value for sanctuaries and one for medium-risk space, and which hinges on an unstated boundary rule. **Scan coverage for a hull has no field to draw from**: the four hull scan stats are cooldown, cost, power and SDU per scan, none of them a range or radius, and the Command Deck's Loadouts page already shows SDU an hour per hull and fit. The scan patterns do carry map-coordinate noise maps, but the actual signal value needs five noise functions and a seed the export does not hold, so a map layer would show the authoring envelope, not what a scan finds. Nothing here changes a decision the owner makes today (which region, which hull, which node): the SKILL rule from 2026-10-08 already says "`missions` and `dailyCheckIn` are Phase-1 seeds - never size them". Re-check when an export arrives with `missions` sourced from something other than `missions-seed.json`, or with a per-region or per-mission region id.

## 1. Shapes

### 1.1 `missions` (8 keys)

| key | shape | notes |
|---|---|---|
| `schemaVersion` | int = 1 | |
| `_meta` | `{tool, note}` | note: "Phase-1 seed. Magnitudes are calibrate-together starting values ... 16-type taxonomy per 80-mission-types.md" |
| `craftingRecipes` | list[3] | crew-gear recipes (Forged Combat Blade T3/T4, Spectral Array T3); inputs `bp_*` / `comp_*` ids; none of the outputs exists in `resources` |
| `tuning` | dict[8]: success(22), crew(3), gearWear(10), threat(10), economy(15), penalties(6), siege(7), rng(5) | balance knobs in basis points; `economy.winAtlasGrid` / `winXpGrid` = ATLAS and XP by 16 mission types at levels 1 / 5 / 10 |
| `missions` | list[6], 18 keys each | see 1.2 |
| `connections` | list[2] `{from,to,type:"chain"}` | Survey -> Patrol -> Salvage |
| `rewardTables` | dict[6], 7 keys each | see 1.3 |
| `regionKnobs` | dict[51], 13 keys each | see 1.4 |

Meta source: `meta.sources.missions = {"file": "missions-seed.json"}`.

### 1.2 `missions.missions` (6 rows)

| id | name | type | level | planetType | durationSecs | crew | stakeAtlas | stakeRes | entryFee | rewardTableRef | fitTarget | apt |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| mission_asteroid_survey_mud3_01 | Asteroid Survey | Mining | 1 | AsteroidBelt/A | 2700 | 2/5 | 20 | 0 | 0 | rt_asteroid_survey_l1 | 700 | Science+Scanning |
| mission_pirate_patrol_mud3_02 | Pirate Patrol | Combat | 2 | AsteroidBelt/A | 7200 | 4/5 | 50 | 1 | 0 | rt_pirate_patrol_l2 | 1000 | Fitness+Command |
| mission_derelict_salvage_mud3_04 | Derelict Salvage | Salvage | 4 | AsteroidBelt/A | 14400 | 3/5 | 80 | 0 | 0 | rt_derelict_salvage_l4 | 750 | Engineering+Operator |
| mission_gmu_triage_frenir_01 | Frenir Outbreak Triage | Triage | 3 | Oceanic/A | 10800 | 4/5 | 40 | 1 | 0 | rt_gmu_triage_l3 | 1000 | Medical+Hospitality |
| mission_whisper_station_intel_01 | Whisper Station Intel | Espionage | 5 | Dark/A | 14400 | 3/5 | 70 | 0 | 0 | rt_whisper_intel_l5 | 1100 | Operator+Scanning |
| mission_hopla_vault_heist_01 | Hopla Vault Heist | Heist | 9 | Dark/B | 28800 | 6/8 | 200 | 0 | 0 | rt_hopla_heist_l9 | 1800 | Operator+Engineering |

| id | unlock | sectorDelta | tierWindow | lossPenaltyClass | rotation |
|---|---|---|---|---|---|
| mission_asteroid_survey_mud3_01 | {"threatTier": {"min": 1, "max": 3}} | {"win": 3, "loss": -2} | [1, 3] | Fatigue | {"set": "B"} |
| mission_pirate_patrol_mud3_02 | {"threatTier": {"min": 1, "max": 4}} | {"win": 5, "loss": -4} | [1, 4] | Fatigue | {"set": "A"} |
| mission_derelict_salvage_mud3_04 | {"councilRank": {"minRankGrade": "5b", "requiredResearchTags": [5001]}, "threatTier": {"min": 2, "max": 5}, "owns": {"consumedCargo": {"lead_derelict_mud3": 1}}, "sectorState": [...]} | {"win": 4, "loss": -3} | [2, 5] | InjuryRespawn | null |
| mission_gmu_triage_frenir_01 | {"threatTier": {"min": 1, "max": 3}, "sectorState": ["Threatened", "Besieged", "Fallen", "Reclaiming"]} | {"win": 6, "loss": -3} | [1, 3] | Fatigue | null |
| mission_whisper_station_intel_01 | {"threatTier": {"min": 2, "max": 4}, "owns": {"claimInSystem": true}} | {"win": 4, "loss": -5} | [2, 4] | Fatigue | null |
| mission_hopla_vault_heist_01 | {"threatTier": {"min": 4, "max": 5}} | {"win": 8, "loss": -10} | [4, 5] | InjuryRespawn | null |

Keys: `crewSlots, durationSecs, id, level, loreText, lossPenaltyClass, maxCrew, name, planetType, rewardTableRef, rotation, sectorDelta, stakeCost, successParams, templateId, tierWindow, type, unlock` (`rotation` is absent on 4 of 6). **No mission carries a region id, system id or planet id.** `planetType.family` is a planet category word (AsteroidBelt / Oceanic / Dark), not a join to `mapData` planets (which use numeric `type`). The "mud3" in three ids is lore text only. `rewardTableRef` joins `rewardTables` 6 of 6. The Derelict Salvage unlock names research tag 5001: `research.json` `tagToNode` has 242 tags in the range 0..465 and no 5001.

### 1.3 `missions.rewardTables` (6 tables, 24 loot rows)

| id | name | winXp | winAtlas | winResource | winRes in resources? | crateTierFloor | lootEntries | weight sum |
|---|---|---|---|---|---|---|---|---|
| rt_asteroid_survey_l1 | Asteroid Survey L1 | 20 | 25 | carbon x150 | True | 1 | 3 | 1.0 |
| rt_pirate_patrol_l2 | Pirate Patrol L2 | 40 | 60 | ammunition x200 | True | 3 | 5 | 1.08 |
| rt_derelict_salvage_l4 | Derelict Salvage L4 | 120 | 160 | steel x80 | True | 4 | 5 | 1.05 |
| rt_gmu_triage_l3 | Frenir Triage L3 | 70 | 80 | medical-nanites x40 | False | 2 | 3 | 1.0 |
| rt_whisper_intel_l5 | Whisper Intel L5 | 115 | 180 | quantum-computational-substrate x5 | True | 3 | 4 | 1.0 |
| rt_hopla_heist_l9 | Hopla Vault Heist L9 | 300 | 540 | heavy-alloy x100 | True | 4 | 4 | 1.0 |

Loot rows: `kind` is Resource (16 rows, joined to `resources.json` by slug id: 15 of 16 resolve, `medical-nanites` does not), GearBlueprint (4), Cosmetic (3), MissionLead (1), MissionExclusive (1), CrewXpBonus (1). The 9 non-Resource ids (`armament_t3`, `hull_blueprint_t4`, `pirate_decal_01`, `lead_derelict_mud3`, `derelict_memory_core`, `medical_xp_cache`, `stealth_module_t4`, `whisper_sigil_01`, `vault_breaker_t5`, `hopla_vault_trophy`) exist nowhere else in the export. Two tables' weights sum to 1.08 and 1.05, not 1.

ATLAS an hour if every run is won (winAtlas x 3600 / durationSecs), with the grid value for the type at level 1 / 5 / 10 beside it:

| mission | level | type | durationSecs | winAtlas | winXp | ATLAS/h if won every run | stakeAtlas | grid ATLAS at L1/5/10 |
|---|---|---|---|---|---|---|---|---|
| Asteroid Survey | 1 | Mining | 2700 | 25 | 20 | 33.3 | 20 | 30 / 90 / 180 |
| Pirate Patrol | 2 | Combat | 7200 | 60 | 40 | 30.0 | 50 | 60 / 180 / 360 |
| Derelict Salvage | 4 | Salvage | 14400 | 160 | 120 | 40.0 | 80 | 50 / 150 / 300 |
| Frenir Outbreak Triage | 3 | Triage | 10800 | 80 | 70 | 26.7 | 40 | 40 / 120 / 240 |
| Whisper Station Intel | 5 | Espionage | 14400 | 180 | 115 | 45.0 | 70 | 60 / 180 / 360 |
| Hopla Vault Heist | 9 | Heist | 28800 | 540 | 300 | 67.5 | 200 | 100 / 300 / 600 |

`tuning.economy` caps: `atlasOutCapPerEpoch` 50,000 and `atlasOutSubCapPerProfilePerEpoch` 2,000 per 86,400 s epoch, `houseEdgeBps` 300, `variancePremiumBps` 2200. `winAtlasGrid` has 16 types (Mining, Recon, Combat, Salvage, Diplomacy, Escort, Triage, Containment, Relief, Hosting, Espionage, Heist, Sabotage, Manufacturing, Research, BeastHunt); the seed uses 6 of them.

### 1.4 `missions.regionKnobs` (51 rows, 13 keys)

Keys: `regionId, name, baseline, decayRate, winGainMult, lossDrainMult, orderSeed, ownershipMode, incumbentFaction, occupierPool, occupiedBaseline, neighbors, siege{cooldownEpochs, entryDwell, exitThreshold, windowEpochs}`.

Distinct values across the 51 rows:

| knob | values (count) |
|---|---|
| baseline / orderSeed | 72 (5), 70 (10), 60 (36) |
| decayRate | 0.05 (51) |
| winGainMult | 5 (51) |
| lossDrainMult | 4 (51) |
| occupiedBaseline | 24 (51) |
| ownershipMode | SANCTUARY (15), DOMINANCE (36) |
| incumbentFaction | MUD (17), ONI Consortium (16), Ustur Regency (18) |
| siege | one block on all 51: cooldownEpochs 12, entryDwell 2, exitThreshold 42, windowEpochs 72 |
| neighbors | empty on all 51 |
| occupierPool | non-empty on the 36 DOMINANCE rows (NPC faction names: Jorvik, ECOS, Sorkof Pirates ...) |

Join to `mapData.regionDefinitions` (69 regions, every one `c4_status: v1`): `regionId` values `MUD-1..5`, `ONI-1..5`, `UST-1..5`, `MRZ-1..36` match no `regionDefinitions.id` (those are `region-<timestamp>`) and are not the `c4_numerical_id` (1..69). By exact name 38 of 51 join; by name with a roman-numeral suffix stripped (Redam-VII -> Redam, Valiant-I -> Valiant ...) 50 of 51 join; "Neuno" vs "The Neuno Region" is the last one. The 18 regionDefinitions with no knob are the newer lore-named ones (The Broken March, The Crownstakes, Xictus Vanguard ...). Mode vs zone agrees where joined: SANCTUARY = LowRiskZone (14), DOMINANCE = MediumRiskZone (36). The 51-row set is the 15 + 36 regions of an older 51-region map.

### 1.5 `scanPatternsDefault` (5 patterns) and `scanPatternsAdvanced` (5 + `_meta`)

| key | name | noise_maps | x_center range | y_center range | origin_max_distance | cooldown_multiplier | blank_weight | blank_xp_value | costs | loot rows |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 | Broad Spectrum Pattern | 64 | -44.57..45.92 | -45.7..46.17 | 10.64..14.93 | 1 | 5 | 1 | token 3 = Repair Kit x1 | 13 |
| 1 | Focused Array Pattern | 60 | -45..44.84 | -44.86..44.49 | 8.75..24.8 | 1 | 5 | 1 | token 3 = Repair Kit x1 | 20 |
| 2 | Enhanced Signal Pattern | 60 | -42.48..40.22 | -42.83..43.57 | 6.45..23.92 | 1 | 5 | 1 | token 3 = Repair Kit x1 | 18 |
| 3 | Deep Resonance Pattern | 64 | -42.16..41.99 | -43.08..43.68 | 5.13..23.91 | 1 | 5 | 1 | token 3 = Repair Kit x1 | 18 |
| 4 | Spatial Anomaly Pattern | 60 | -41.5..41.15 | -40.36..41.11 | 3.62..29.81 | 1 | 5 | 1 | token 3 = Repair Kit x1 | 16 |

Pattern keys: `name, noise_maps[], cooldown_multiplier, blank_weight, blank_xp_value, costs[{token, cost_multiplier}], scanning_loot_table[{output, output_amount, threshold, roll_weight, xp_value}]`. Noise map keys: `noise_map_type` (SuperSimplex 70, OpenSimplex 67, Simplex 64, PerlinSurflet 62, Perlin 45), `noise_power_function` (Linear 84, Cubic 79, Sqrt 73, Quadratic 72), `x_multiplier, y_multiplier, z_multiplier, x_center, y_center, weight, origin_max_distance, seed_offset`. No seed, no formula, no sidecar policies in the export (the advanced `_meta` names `scan_v2_pattern_policies.json` as a separate file). `scanning_loot_table.output` joins `cargoTypes` (3,642 ids) 85 of 85; `xp_value` is 10 on every default row. The five pattern names are exactly the five Data Running nodes Broad Spectrum / Focused Array / Enhanced Signal / Deep Resonance / Spatial Anomaly Patterns (level 1, required tag 76), so pattern -> node joins by name.

`scanPatternsAdvanced._meta`: `status: "archival"`, `emit: false`, "Design-aspirational advanced set kept for history only ... marked archival 2026-09-08". Its costs are token 2 = Fuel x3 / x5 / x7 / x10 / x15 and 3-5 noise maps per pattern. Not live under any reading; ignored below.

Expected units per scan for the default tables (roll_weight / (sum of weights + blank_weight) x output_amount), the rows that matter:

| pattern | output | p(roll) | E units/scan |
|---|---|---|---|
| Broad Spectrum | Fuel 150 | 0.136 | 20.43 |
| Broad Spectrum | Survey Data Unit 8 | 0.078 | 0.62 |
| Focused Array | Ammunition 100 | 0.144 | 14.45 |
| Enhanced Signal | Fuel 50 | 0.105 | 5.27 |
| Deep Resonance | Survey Data Unit 10 | 0.099 | 0.99 |
| Deep Resonance | Dysprosium Ore 10 | 0.074 | 0.74 |
| Spatial Anomaly | Fuel 75 | 0.199 | 14.9 |
| Spatial Anomaly | Survey Data Unit 15 | 0.149 | 2.23 |
| Spatial Anomaly | Titan Scale Framework 1 | 0.003 | 0.0 |

Full 85-row table in `detail3.out`.

Noise-map centres against the 945 systems (`mapData[].coordinates` span x -49.99..51.22, y -44.98..46.25, the same frame):

| pattern | noise maps | systems inside >= 1 radius | mean maps covering a system | max |
|---|---|---|---|---|
| Broad Spectrum Pattern | 64 | 945 of 945 | 3.3 | 6 |
| Focused Array Pattern | 60 | 945 of 945 | 6.5 | 12 |
| Enhanced Signal Pattern | 60 | 945 of 945 | 5.6 | 12 |
| Deep Resonance Pattern | 64 | 945 of 945 | 6.4 | 18 |
| Spatial Anomaly Pattern | 60 | 945 of 945 | 4.3 | 23 |

| pattern | mean covering maps, low-risk systems | medium-risk systems | mean summed weight, low | medium |
|---|---|---|---|---|
| Broad Spectrum Pattern | 3.2 | 3.3 | 6.1 | 6.7 |
| Focused Array Pattern | 3.3 | 6.9 | 5.5 | 15.3 |
| Enhanced Signal Pattern | 2.8 | 5.9 | 3.4 | 14.9 |
| Deep Resonance Pattern | 3.1 | 6.8 | 1.4 | 20.3 |
| Spatial Anomaly Pattern | 2.4 | 4.6 | 0.5 | 10.9 |

Every pattern's maps reach every system; the summed weight (an amplitude ceiling, not the signal) is tilted toward medium-risk space for patterns 1-4. Inference, labelled: the higher patterns are authored to pay in medium-risk space. The actual field value at a system needs the noise functions and a seed the export lacks.

### 1.6 Ship scan stats (`shipConfigurations.allShips`, 67 rows = 61 hulls + 6 "Starbase - Tier 0..5" rows)

Keys: `scan_cool_down` ("Time this ship must wait to scan again. Unit: s"), `scan_cost` ("Tokens spent per scan. Unit: Tokens"), `scan_power` ("Multiplier for scan results. Unit: Unitless"), `sduPerScan` ("SDU per scan"). There is no scan range, radius or sensor field on any row (the only `*_range` keys are combat buff ranges). `Data/combat-data.js` carries all four on all 67 rows; `Data/ships-data.js` carries `sduPerScan` only (14 hits in its first 2 MB). The hull name key is `Ship Name`; `Class` is a numeric size class.

SDU an hour at the stat reading (sduPerScan x 3600 / scan_cool_down), by class:

| class | hulls | SDU/h min | SDU/h max |
|---|---|---|---|
| 9 (Titan) | 5 | 237,962 | 302,592 |
| 7 | 3 | 24,890 | 31,653 |
| 6 | 9 | 6,902 | 10,538 |
| 5 | 7 | 2,435 | 3,311 |
| 4 | 12 | 753 | 4,536 |
| 3 | 12 | 266 | 1,396 |
| 2 | 6 | 86 | 98 |
| 1 | 7 | 27 | 42 |

Free-scan hulls (`scan_cost` 0, cooldown 300-312 s): Fimbul BYOS Ranger, VZUS opod, Opal Rayfam, the three Data Runner specs. The 6 starbase rows have cooldown 0, cost 0, `scan_power` 5,000-65,000 and no SDU: not hulls, drop them from any hull table. Toolkits per SDU runs 1.25-6.91 across the 58 paying hulls (Titans 1.28-1.96). Per-hull table in `detail5.out`.

### 1.7 Data Running track (`JSON/research.json`, 34 nodes with `tag: Data Running`)

Grants across the 34: `research_tags` 33, `security_zone_access` 3 (Contested Space Scanning = MediumRiskZone at level 5; Deep Space Scanning = HighRiskZone twice), `enemy_faction_zone_access` 2, `scan_power_modifier` 3 (Signal Amplification I/II/III: +0.2 / +0.3 / +0.5 at levels 10 / 20 / 30), `scan_cool_down_modifier` 3 (Rapid Cycling I/II/III: -0.1 / -0.15 / -0.15 at levels 12 / 24 / 36). Every costed node is 35,000,000,000 ATLAS base units + 1 DataRunner point; 19 nodes also cost Survey Data Unit (token 366), 55,500 SDU in total. The five pattern nodes are level 1 with empty cost beyond ATLAS. Signal Refinement (level 10, 1,000 SDU) "Unlocks alternate noise patterns for Scanning"; Regional Tiers (level 3, 150 SDU) "Unlocks scanning in distant flagged regions"; `regionDefinitions.scanning_research_requirements` is empty on all 69 regions, so no region is flagged. Thresholds `data_runner`: level 5 = 407 XP, 10 = 1,125, 20 = 3,731, 30 = 9,358, 36 = 15,510. No mojibake in any of the 34.

## 2. What CAN be drawn on the Galia map today

| layer | source value | join | verdict |
|---|---|---|---|
| Reward per region, from missions | none: missions have no region field | - | cannot be drawn |
| Reward per region, from regionKnobs | `orderSeed` 72 / 70 / 60 -> `tuning.threat.orderTierBoundaries` [20, 40, 60, 80] -> `rewardScalar` [0.6, 0.85, 1, 1.4, 2] | name join to regionDefinitions, 50 of 51 | drawable but two colours: sanctuaries T4 (x1.4); medium-risk 60 sits ON the T3/T4 boundary, x1.0 or x1.4 depending on an unstated inclusive rule. It is a seed of a live "order" value that moves with play |
| Mission ATLAS an hour | `rewardTables.winAtlas / durationSecs` | none to map | a 6-row table, not a map layer |
| Scan coverage for a hull | no range or radius stat exists | - | cannot be drawn; "coverage" is undefined by the data |
| Scan pattern envelope | noise-map centres + `origin_max_distance` in map coordinates | by coordinate | drawable, but every pattern reaches all 945 systems; only the summed weight varies (low vs medium risk). The signal itself needs noise functions + seed not exported |
| SDU an hour per hull | `sduPerScan x 3600 / scan_cool_down` | hull | already on the Command Deck Loadouts page |

## 3. What the owner would decide with each overlay

- **Which region to run missions in:** nothing. Six sample missions, none placed, reward differing by type and level, not by region. The region layer would show "sanctuary vs medium risk", which the map already shows as risk zone.
- **Which hull to scan with:** already answered by Loadouts (SDU/h and Toolkits per scan). A map adds nothing: a hull's output does not vary by where it scans in this data.
- **Which research node to buy:** the Data Running numbers (Signal Amplification +20/30/50 % power, Rapid Cycling -10/15/15 % cooldown, zone access) are already in the research tree page; a scan overlay would not change the pick. `scan_power` still has no formula to apply.
- The honest answer for both proposed layers is "look at it". That is the readout type dropped twice on 2026-10-05.

## 4. Traps found

- **Status fields:** `missions` has none, only `_meta.note` "Phase-1 seed"; `scanPatternsAdvanced._meta.status: "archival", emit: false`; `scanPatternsDefault` has none (it is the canonical set per the advanced `_meta`). `regionDefinitions` are all `c4_status: v1`. The v2 rule does not bite here: there are no `c4_status` values to filter on inside these sections.
- **Mojibake:** zero non-ASCII strings in `missions`, both scan pattern sections, and the Data Running names and descriptions.
- **Duplicated parent totals on lines:** none; neither section has line / parent structure. The related trap is the 6 "Starbase - Tier N" rows inside `allShips` (cooldown 0, `scan_power` up to 65,000) that would dominate any hull ranking by scan power.
- **Dangling ids:** `medical-nanites` (reward and loot) and 9 blueprint / cosmetic / lead ids exist in no other section; research tag 5001 does not exist; the 51 `regionId` codes match nothing in `regionDefinitions` (name join only, 50 of 51); two loot weight sums are 1.08 and 1.05.
- **Scale note:** `scan_cost` is Toolkits per scan (cargo 3 = Repair Kit), consistent with the SKILL's 2026-10-08 scanning block; the mission `stakeCost.atlas` and `winAtlas` are whole ATLAS (20-540) while research nodes are 35,000,000,000 base units, so never add the two.

## 5. Recommendation

Skip item 8 and mark it in the roadmap as "checked 2026-10-08: seed data, no region join". The `missions` section is a six-row design seed with no join to the map, uniform region knobs, and reward ids the rest of the export does not know; the scan patterns define a signal field whose value cannot be computed from the export and whose envelope covers every system; hull scan stats hold no range. Both proposed layers would be two-colour pictures that decide nothing, and the scanning question the owner actually asks (which hull, which fit, SDU an hour and cost) is already answered on the Command Deck Loadouts page, with the Data Running nodes on the research tree. Revisit only when an export arrives whose `meta.sources.missions.file` is not `missions-seed.json`, or whose missions carry a region or system id.
