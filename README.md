# OperationsHub - Star Atlas Economic Tools & Analytics

**Aephia Industries**
*Comprehensive economic analysis and planning tools for Star Atlas*

[![Version](https://img.shields.io/badge/version-2.1-blue.svg)](https://github.com/yourusername/OperationsHub)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-production-success.svg)](README.md)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.x (for local server)
- Modern web browser (Chrome, Edge, Firefox)
- Node.js (optional, for data refresh utilities)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/OperationsHub.git
cd OperationsHub

# Install dependencies (optional, for data refresh)
npm install

# Start the local server
python -m http.server 8000
# or use the provided batch file
./START-SERVER.bat
```

Then open your browser to: `http://localhost:8000`

---

## 🛰️ Landing page (`index.html` + `landing.css`, redesigned 2026-09-30)

The hub's front page is a Star Atlas "operations deck": a Cycles-rendered planet backdrop, three
transparent hull renders drifting at three depths, a marquee of 16 hulls, and one art card per module
(official claim-stake and station art and hull renders). The Region Map Explorer and its Galia-chart card were
removed on 2026-10-01 (owner: "we dont need it"); the Planet Explorer's Territory tab keeps the Galia map.

**Motion budget.** Every continuous effect is a CSS `transform`/`opacity` animation (compositor only):
no per-frame JavaScript, no `backdrop-filter`, the starfield is drawn once per resize, pointer and
scroll parallax write two CSS variables and only while the pointer moves or the hero is on screen.
Everything pauses when the tab is hidden and switches off under `prefers-reduced-motion`. The whole
image set is ~570 KB of WebP (`Images/landing/`).

**Rebuilding the images** (`Tools/landing/`, all read the Star Atlas raw assets in the Battle Arena repo):

```bash
# 1. planet backdrop - Blender 5.2, Cycles 128 spp on the GPU, ~1 min
"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b -P Tools/landing/ops_planet.py -- <out.png> 2560 1440 128
# 2. hull cut-outs, card crops and the planet crops -> Images/landing/*.webp
python Tools/landing/pack_landing.py <out.png>
```

**Module Guides** (the button on every card) read `Documentation/module-help-content.js`, rewritten 2026-10-01 for
the rebuilt modules. They had been dead since the landing redesign: the file declares the table with a top-level
`const`, which is not a `window` property, and the click handler tested `window.moduleHelpContent` first; the handler
now tests the identifier and the file also assigns it to `window`.

`styles.css` still owns the JSON Manager and Module Guide modals; `landing.css` owns everything else on
the page and is loaded after it.

## 📂 Explorer Applications

### 1. 🪐 **Planet Explorer**
Discover and analyze 3,901 planets across all star systems

**Visual upgrade (2026-09-30):** every system is drawn as an **orrery** (`PlanetExplorer/orrery.js`, SVG) from
the data's own `orbit`, `angle` and `scale`: the star is coloured by `star.type`, planets by category
(`type % 8`), asteroid belts are dotted rings, gas giants carry a ring. The system modal animates it (CSS
transforms only, off under reduced motion) and names every planet; planet rows and orrery bodies open the
planet modal, warp-link chips jump to the linked system. Cards carry badges for faction, star type, starbase
level (L6 = Central Space Station), King, Core and the region's risk zone and raw-tier cap. **Richness** is
shown as the value plus a bar against the richest deposit of the same resource in Galia (the old "x/5" was
wrong: tier-1 ores run to 7.0, tiers 2-5 stay under 2.2); tier badges come from `resources.json`. Belts are
marked "ships only" (no central hub, so no claim stake). Styles live in `PlanetExplorer/planet-visual.css`,
loaded after `styles.css`.

**Analytics tab (same date).** *Resource Analytics* was rebuilt (`analytics.js`): three bar charts (deposits
by planet category, by resource tier, tier mix by territory), a sortable, searchable **resource atlas** (one row
per resource: tier, deposits, systems, regions, min / median / best richness and the best deposit; a row opens
its ten richest deposits, each linking to the system view), "not in every region" using the map data's real
region names, and the most diverse systems as rank bars. *Territory* gained a **Galia map** (all 945 systems in
faction colour, the top 25 by the formula as pins, redrawn on Apply) and the Faction Dominance cards now render
on first load with real region names (they used to need an Apply click and showed name fragments). Chart faction
colours (MUD `#e8503a`, ONI `#3a86f0`, USTUR `#bf8a28`) passed the colour-vision checks of the dataviz skill on the
page's surface; category bars are single-hue by design.

**Features:**
- Filter by faction (MUD, ONI, USTUR) and planet type
- Star Systems list grouped by region number, each entry showing the SAGE code and the lore name
  (`004-MUD-KING-01 Verzan`), with a finder box above it that matches every word against code,
  name and faction (`004 king`, `verzan`, `css oni`)
- View detailed planet resources with tier badges; system and planet details show both the lore
  name and the legacy code (`Romaria 004-MUD-KING-01-P1`), and connected systems are named
- **Manufacturing Tab:** Top manufacturing planets by self-sufficiency score
- **Territory Tab:** Strategic system analysis and faction dominance

**Use Case:** Finding the best planets for manufacturing specific goods or identifying strategic territories

---

### 2. 🧪 **Recipe Explorer**
The 5,251 recipes as a **production planner** (rebuilt 2026-10-01). Sits on the Resources Explorer's data model
(`ResourcesExplorer/resource-model.js`: recipe per output name live-first, deduplicated supply DAG, deposits,
extractor kits) plus `recipe-model.js` (recipes by `outputId` - 318 output names repeat across tiers - and the
quantity expansion). The chain graph is the shared `Utils/ChainGraph.js`, the same one the Resources sheet draws.

- **Planner tab:** left, the recipe finder - search by output or by ingredient, chips for what it makes (16 output
  types), output tier, starbase level, five sorts, 100 rows at a time.
  **+** adds a recipe to the plan; the plan survives a reload (localStorage). Right, the plan: each item with an
  editable quantity - **click an item to show its chain alone in the graph, click it again for the whole plan**
  (no modal; owner, 2026-10-01) - then the always-on sheet, whose numbers, raw bill and craft list always total
  every recipe in the plan:
  - **the whole chain** - one aggregated graph for the plan (a virtual "Production plan" root when there is more
    than one recipe) with total quantities on every link; drag, zoom, hover to trace, click to open
  - **raw bill** - every deposit to gather with units, coloured claim-stake extractor vs fleet-mining-only
  - **craft list in build order** - every intermediate deepest first, crafts = units ÷ output per craft rounded up,
    time = crafts × build time; the headline numbers carry the critical path (longest chain of build times,
    everything in parallel), the sequential total, the highest starbase level any step needs and the raws no claim
    stake can mine
- **Recipe sheet** (any row, plan item or node): the recipe's own chain, ingredients, build time, production steps,
  starbase level, planet types, research nodes, the other tiers of the same output, who uses the output, add to /
  remove from the plan; links into the Resources Explorer. `?recipe=<outputId or name>` adds a recipe to the plan,
  `?search=` pre-fills the finder (both kept for cross-module links)
- **Analytics tab (five always-on sections, HTML bars):** what the catalogue makes (by output type, and each type
  by tier); build time by output type with the longest crafts and deepest chains; where things are crafted (planet
  type × output type, starbase level, the 616 faction-exclusive recipes); **ingredient demand** (every resource
  ranked by the recipes listing it, category chips, 50 per page, search keeps the global rank, click a row for the
  recipes using it - the one recipe-side ranking kept from the 2026-09-28 build); gated recipes (11 exotic, 45
  research-gated). Release status is not shown (see the Resources Explorer note)
- **Gone, and why:** the nested category checkboxes and the horizontal tree renderer (`enhanced-tree-renderer.js`,
  1,571 lines, replaced by the shared graph), the unreferenced `manufacturing-chain.js` /
  `chain-visualizer-styles.css`, and the recipe modal's complexity score (tier × 10 + ingredients × 5 + time ÷ 10 +
  unique × 3), "resource intensity", "time efficiency", "tier progression" and "material efficiency" labels -
  invented weights and thresholds. `styles.css` 1,930 → 362 lines
- Build times are the export's `constructionTime` read as seconds (units are not stated), as the ClaimStake
  Explorer reads them

**Use Case:** "what do I need, in what order, and how long, to make N of this" - before a stake plan or a trade

---

### 3. 💎 **Resources Explorer**
Every one of the 3,526 resources (93 raw, 757 processed, 1,372 components, 1,304 advanced): where it comes from, what
it is made of, who asks for it. **Rebuilt 2026-10-01** on a single data model (`resource-model.js`) read from the four
bundles the page loads (resources, recipes, planets, buildings); nothing derived, no Chart.js.

- **Explorer tab:** cards carry tier, the source line (a raw: planets, belts, best richness, planet types; crafted:
  the ingredients) and the demand bar (recipes that list it as a direct ingredient). Filters: category, tier,
  comes-from (claim-stake extractor / fleet mining only / crafted); sort by use, reach, name, tier or steps from raw;
  120 cards at a time with "show more". **Release status (`c4_status`) is deliberately not shown anywhere in the hub
  (owner, 2026-10-01): the release will be v2, so every recipe counts** - it survives only as a tie-break when several
  recipes share one output name
- **Resource sheet** (click a card): the **supply-chain graph** - the deduplicated recipe DAG laid out in layers
  (longest path from the output, one barycenter pass), pills coloured by category, dashed-flow edges, drag to pan,
  wheel to zoom, hover a node to light its upstream and downstream path, click a node to open it (back button keeps
  the trail). Chains run up to 168 resources / 271 links / 14 levels (Drone Port TTN T5); the SVG is sized in pixels
  so nodes stay legible and wide chains pan; the graph takes the full sheet width and ~74% of the viewport height
  (a 160-node chain fits whole on a 2560-wide screen). Under it, the **raw bill**: every deposit in the tree with how
  many recipes in that chain use it. Below, side by side: **Where it is found** for a raw (galaxy map of the 945 systems with
  the carrying systems lit by territory colour and sized by richness, planets / belts / best richness / T1 extractor
  rate, territory, planet types, regions, the twelve richest bodies) or **How it is made** for anything crafted
  (ingredients, build time, production steps, starbase level, planet types), then **Who asks for it** (the largest
  consumers per craft, live share, product types). Links into the Recipe Explorer (`?search=`), ClaimStake and
  Planet explorers; `?r=<name>` opens a sheet and `?search=` pre-fills the search for cross-module links
- **Analytics tab (five always-on sections, HTML bars):** the economy's shape (category x tier, and tier x category);
  steps from raw (depth histogram and ingredients-per-recipe, both by category); **demand** (all
  3,526 ranked by direct recipe use, 50 per page, search keeps the global rank - Power Regulation Module 962, the
  same count as the Recipe Explorer's Analytics tab); **raw backbone** (the 93 deposits ranked by reach = how many
  crafted resources need them anywhere in their tree, with direct use, planets, belts, richness, extractor; raw
  kinds per planet type; the raws no claim stake can mine); data gaps
- **Gone, and why:** "Most valuable resources" and "Average value" ranked tier, because `baseValue` is tier x 10 for
  all 3,526 resources and `stackSize` is 100 for every one; the Resource Flow tab's criticality score was invented
  weights and its "bottlenecks" counted extractor buildings as supply, so every crafted resource with a user was a
  bottleneck (`flow-analytics.js` deleted; 530 dead lines cut from `styles.css`). Base value, stack size and the
  generated descriptions are not shown anywhere
- **Rules applied:** a raw is stake-minable only if an extractor family exists AND a planet carries it - six raws
  have no kit (Aluminum, Garnet, Manganese, Osmium, Tritium, Zinc) and the belt-only deposits (e.g. Strontium
  Crystals: 0 planets, 271 belts, kit exists) are fleet-mined because no stake can sit on a belt

**Use Case:** what a resource depends on and what depends on it, before planning a stake or a production line

---

### 4. 🏗️ **ClaimStake Explorer**
Plan claim stake construction and analyze building efficiency

**Features:**
- Browse 100+ building types with filtering
- **Analytics tab (rebuilt 2026-09-30):** three questions the export can answer, all computed from the loaded
  data bundles (no derived JSON, no Chart.js)
  - **Which tier to buy:** per planet type, a T1-T5 table from `buildings.json`: stake slots, the central hub, the
    full hub set, one extractor and one processor at that tier, and the best lean stake (central + extraction hub
    + power plant + crew quarters as needed) expressed as "extractors that fit" with the binding limit (slots, crew
    or power). Extractor crew grows as n^3 while crew quarters house 5/10/20/40/80, so tiers 2-3 bind on crew
  - **Deposit atlas:** the 93 raw deposits with stakeable-planet count, belt count, best richness, territory
    counts, and whether an extractor family exists (six raws are fleet-mined only); click one for its ten richest
    planets and a "Plan stake" button into the Stake Builder
  - **Where to stake for a recipe:** search any of the 3,951 craftable outputs, expand its tree to raws, rank
    every stakeable planet by coverage (then richness), filter by territory, see the regions with full coverage
    and hand a planet to the Stake Builder. Fleet-only raws and unmapped ingredients are called out
  - The previous tab parsed faction and region out of planet NAMES with a pattern from the old naming scheme, so
    every planet was faction "SER"/region "Other" and the optimizer's faction filter matched nothing; it is gone
    (`recipe-optimizer.js`, `competitive-advantage.js`, `analytics-styles.css` deleted)
- **Stake Builder tab (rebuilt 2026-09-30):** plan one claim stake visually
  - pick a planet (3,901 bodies, searchable, faction and category chips; asteroid belts are listed but cannot hold a stake)
  - pick the stake you will buy: Standard or Cultivation, tier 1-5 with the slot counts from `claimStakeDefinitions`
    (65 / 487 / 2,049 / 6,251 / 15,553). A stake is bought per tier and holds tier-N buildings only, so the catalogue
    shows one tier at a time and the export's `-tN` upgrade-path tags are ignored
  - the catalogue knows the rules: hubs unlock their family (adding an extractor adds the Extraction Hub for you),
    extractors need their deposit on the planet, processors need every input on the planet (an input made by another
    building in the plan is allowed but flagged as an unverified chain), the Fuel processor needs a tier 3+ stake
  - the pad is an isometric hex grid with a Blender-rendered tile per building kind (`Images/stake/`, 12 tiles,
    143 KB); extractors cluster by the Extraction Hub, processors by the Processing Hub, resource chains are drawn
    producer -> consumer; click a tile or a card for the full sheet (rates, cost, remove)
  - three gauges: slots, power (drawn / generated, the signed sum of every building's `power`) and crew
    (`neededCrew` against `crewSlots`)
  - **Construct facility** plays the build sequence on the pad (tiles rise in dependency order with the running
    clock); Export PNG draws the pad and the three sheets to a 2,800 px image
  - the sheet is five always-on charts drawn as plain HTML bars (no Chart.js on this page any more), one row of
    three plus a row of two: bill of materials (with build time, storage and fuel burn), net production per tick
    (deficits in orange, made / used in the tooltip; since 2026-10-03 the central hub's passive extraction is listed by
    default, each row tagged HUB, or HUB? when the planet has no deposit of that raw - for the no-kit raws such as
    Zinc Ore the hub is the stake's only source), build timeline (gantt in build order, with the plan verdict),
    power budget per building, slots and crew stacked by building kind; the kind palette passed the dataviz
    validator (CVD, lightness, contrast)
  - the plan survives a reload (localStorage)

**Art:** `Tools/landing/stake_tiles.py` renders the twelve tiles with Blender 5.2 (orthographic camera, elevation 32
deg, so a hex of circumradius r projects to 1.732r x 1.06r, the squash the page's grid uses) and
`Tools/landing/pack_stake_tiles.py` crops them with one fixed box and writes `Images/stake/manifest.json` (unit =
pixels per world unit, anchor = the ground centre), which is how the page scales a tile to a cell.

**Use Case:** Optimizing claim stake layouts and identifying strategic manufacturing locations

---

### 5. 🏠 **Hub Explorer**
A crafting-hab **builder** (rebuilt 2026-10-01) on `hub-model.js`, which joins the hab export
(`JSON/craftingHabBuildings.json`: 5 hab tiers, 4 crafting stations, 5 cargo storages with slots, storage, jobs,
speed, fee, XP, install time and module cost) with the 21 `HAB_ASSETS` recipes that craft those items (the recipes
also supply the 4 landing pads, 2 paints and the pet house the hab export does not list). Each tier consumes the
previous one, so the model also reports the **cumulative** modules and install time from nothing.

- **Builder tab:** left, the catalogue - every hab asset as a card with its four key numbers, the modules it needs,
  what it consumes, the cumulative figure, and a "craft it" link into the Recipe Explorer; right, the hab build:
  one hab tier, any number of stations, storages, pads and decorations with quantities, four gauges (slots used by
  storage and pads against the hab's slots, storage, jobs, throughput = jobs × speed), the module bill, install and
  craft time, and **"Raw bill for the whole build"**, which opens the Recipe Explorer planner with every asset's
  recipe loaded (`?plan=id:qty,…`). The build survives a reload (localStorage)
- **Ladders tab:** hab tiers (slots, storage, install from nothing, table with fee / XP / modules / recipe),
  crafting stations (speed, jobs, throughput), cargo storage (bonus, storage per slot), landing pads and
  decorations from their recipes
- **Slots:** every asset takes the slot figure the SAGE export gives it (`split-uber-export.js` copies the
  `craftingHabs` section verbatim): stations 8 / 64 / 216 / 512, cargo storage 1..5; the gauge goes red when a hab
  is over capacity. Landing pads and decorations carry no slot figure in the export and count as 0, which the page
  says. Install time is the hab export's `constructionTime`, craft time the recipe's; both read as seconds
- **Gone:** the four-tab page (Hubs / Crafting / Storage / Planner) whose Landing Pads and Decorative sections were
  always empty (they filtered a list that holds neither), the `eval` of the data file, the JSON export button and
  the "efficiency rating" bar (speed ÷ 2); the old `styles.css` replaced by the shared base + `hub-visual.css`

**Use Case:** what a hab of tier N with these stations and storages gives you, what to bring, and what it all
costs in raws

---

### 6. 🚢 **Ship Explorer**
Compare ships, analyze configurations, and plan fleets

**Visual upgrade (2026-09-30):** the comparison pane opens as a **hull gallery** (one card per ship with its
Cycles render, size chip, role, class and four key stats; size chips, manufacturer and role filters; a card
adds the ship to the comparison). Selected ships show as a strip above the comparison table. **Ship view**
opens a modal with a drag-to-rotate **turntable** (12 views) and a spec sheet whose bars compare each stat
with the best ship of the same size tier. The sidebar list carries thumbnails. Art: `Tools/landing/pack_ships.py`
packs the Battle Arena renders into `Images/ships/` (51 of 67 ships have a hull render) with `manifest.json`
keyed by the record's Ship Name; nine hulls without a model (Pulse, Ruch, Shipit, IMP Tap, Ranger, Butch,
Sledbarge, The Last Stand, Phi) fall back to the official store image from the Star Atlas galaxy catalogue
(`galaxy.staratlas.com/nfts`, the same images the market shows), still only; the six Custom starbases and the
unreleased Gallowspine show initials. The Analytics
tab opens with a **Fleet overview** (hulls by size and role, leaders by cargo, hit points, mining rate, scan
power, subwarp speed and warp distance) above the configuration resource totals. Display names no longer
repeat the manufacturer. Files: `ShipExplorer/ship-visual.js`, `ship-visual.css` (hooks in `app.js`).

**Features:**
- Multi-ship side-by-side comparison (67 ships available)
- Real-time stat calculations with component modifiers
- 40+ tracked stats (cargo, combat, travel, mining, scanning, repair)
- Stat search above the Stat column, and a **Changed only** filter for stats the selected configurations change
- Hover (or tab to) the ⓘ next to any stat for what it means and its unit, e.g. *Cargo Capacity - The amount
  of cargo this ship can hold. Unit: CU* (descriptions from the SAGE export, `JSON/stat-descriptions.json`)
- **Analytics Tab:**
  - Fleet construction costs per configuration
  - Resource efficiency rankings (cargo haulers, combat ships, etc.)
  - Component breakdown with recipe navigation

**Use Case:** Fleet planning, ship comparison, and component sourcing

---

## 🔬 Analytics Features

### Cross-Explorer Analytics Engine

All analytics are powered by the **CrossExplorerAnalytics** engine, combining data from:
- 3,901 planets
- 5,251 recipes
- 93 resource types
- 1,620 buildings
- 67 ships with configurations

### Available Analytics:

1. **Resource Flow Analysis** (Resources Explorer)
   - Critical resource identification
   - Supply bottleneck detection
   - Usage pattern analysis

2. **Manufacturing Optimization** (Planet Explorer)
   - Self-sufficiency scoring
   - Specialized manufacturing hubs
   - Capability distribution

3. **Territory Control** (Planet Explorer)
   - Strategic system valuation
   - Faction dominance analysis
   - Territory quality metrics

4. **Stake planning** (ClaimStake Explorer)
   - Which tier to buy: what one tier-N stake runs once its hubs are up
   - Deposit atlas: where every raw sits, and which are fleet-mined only
   - Where to stake for a recipe: planets ranked by raw coverage, handed to the Stake Builder

5. **Fleet Resource Footprint** (Ship Explorer)
   - Construction costs per configuration
   - Component breakdown and sourcing
   - Modified stats analysis

---

## 🛠️ Data Pipeline

### RefreshData System v2.1

Enterprise-grade data validation and processing pipeline that transforms raw JSON files into validated, optimized data files.

**Features:**
- ✅ JSON Schema validation with Ajv
- ✅ Change detection with SHA-256 hashing
- ✅ Breaking change alerts
- ✅ Multi-part file processing
- ✅ Comprehensive validation reports
- ✅ Processes ALL 11 data sources

**Usage:**
```bash
# 1. Split a SAGE uber-export into the per-dataset sources under JSON/
#    (refuses to write if the component tree does not cover every ship configuration)
node RefreshData/split-uber-export.js "C:\Users\khawa\Desktop\StarAtlas\uber-export-latest.json"

# 2. Validate and regenerate Data/*.js
npm run refresh
# or
cd RefreshData && node refresh-data.js

# 3. (optional) PDF report of the dataset and what changed since the previous import
python RefreshData/data-report.py      # -> Documentation/DATA-REPORT-<date>.pdf (needs Chrome or Edge)
```

The refresh's "breaking changes" alert compares element `[0]` of each list, so a re-ordered
export reads as removed fields; check the field set across all entries before treating it as real.

**Legacy system codes.** The 2026-09-11 export renamed every system and planet to a lore name
(`004-MUD-KING-01` -> `Verzan`, `...-P1` -> `Romaria`) and every region likewise (`R-MUD-004`).
System keys and region ids are stable, so `RefreshData/legacy-system-codes.js` rebuilds the codes
from the last code-named snapshot (git `27137dd^:JSON/planets.json` by default) into
`JSON/system-codes.json` and `Data/system-codes-data.js`; Planet Explorer attaches them at load
(`system.code`, `system.regionCode`, `planet.code`) and uses them for grouping, search and analytics
regions. It is a frozen reference, not part of `npm run refresh`: re-run it only if the snapshot
changes, and it refuses to write when any current system or region would be left without a code.
The export also carries sections nothing here consumes yet (`missions`, `researchGateMap`,
`cargoTypes`, ...); the split script lists them at the end of its run.

The split also writes `JSON/stat-descriptions.json` (Ship Explorer's stat tooltips) from
`shipConfigurations.statDescriptions`. Ship Explorer loads it directly, no `npm run refresh` needed.
A malformed section keeps the previous file and warns instead of failing the import. To regenerate
only that file, or pull it from the live SAGE Editor Suite (same 78 descriptions as of 2026-09-13):

```bash
node RefreshData/stat-descriptions.js "C:\Users\khawa\Desktop\StarAtlas\uber-export-latest.json"
node RefreshData/stat-descriptions.js --ses
```

**Output:**
- Validated data files in `Data/` directory
- Validation report: `Data/REFRESH-REPORT.json`
- Exit code 1 on failures (CI/CD ready)

**See:** [RefreshData/IMPLEMENTATION-SUMMARY.md](RefreshData/IMPLEMENTATION-SUMMARY.md)

---

## 📁 Project Structure

```
OperationsHub/
├── index.html                          # Home page
├── START-SERVER.bat                    # Quick server start
│
├── PlanetExplorer/                     # Planet & territory analysis
├── RecipeExplorer/                     # Recipe & production chains
├── ResourcesExplorer/                  # Resource analysis & flow
├── ClaimStakeExplorer/                 # Building & facility planning
├── HubExplorer/                        # Space hub construction
├── ShipExplorer/                       # Ship comparison & fleet
│
├── Utils/
│   ├── CrossExplorerAnalytics.js      # Analytics engine
│   └── DataLoader.js                  # Data loading system
│
├── Data/                               # Processed data files
│   ├── recipes-data.js                 # 5,251 recipes (5.1 MB)
│   ├── buildings-data.js               # 1,620 buildings (2.1 MB)
│   ├── planet-data.js                  # 3,901 planets (7.4 MB)
│   ├── resources-data.js               # 93 resources (864 KB)
│   ├── ships-data.js + .json           # 67 ships (12 MB each)
│   ├── crafting-hab-data.js            # Hub buildings
│   ├── ship-formulas-data.js           # Ship formulas (5.6 MB)
│   ├── ship-components-data.js         # Ship components (8.2 MB)
│   ├── resource-tier-data.js           # Resource tier analysis
│   ├── system-codes-data.js            # Legacy SAGE system/region codes (see Data Pipeline)
│   └── REFRESH-REPORT.json             # Validation report
│
├── JSON/                               # Raw JSON source files
├── RefreshData/                        # Data processing pipeline
│   ├── split-uber-export.js            # uber-export -> JSON/ sources (run first)
│   ├── stat-descriptions.js            # -> JSON/stat-descriptions.json (called by the split)
│   ├── legacy-system-codes.js          # -> JSON/system-codes.json + Data/system-codes-data.js
│   ├── refresh-data.js                 # Enhanced v2.1
│   ├── validation.js                   # Schema validator
│   ├── change-detection.js             # Change tracker
│   ├── reporting.js                    # Report generator
│   └── schemas/                        # 9 JSON schemas
│
├── Documentation/                      # User guides and docs
│   ├── USER-GUIDE.md                  # Complete user guide
│   ├── ANALYTICS-OVERVIEW.md          # Analytics architecture
│   ├── IMPLEMENTATION-STATUS.md       # Feature status
│   └── Archive/                       # Archived documentation
│
└── Test/                               # Test suite (216 tests)
```

---

## 💡 Key Features

### Where to stake for a recipe
The ClaimStake Explorer's Analytics tab answers "where do I put a stake to feed this item": pick an output, the
recipe tree is expanded to raw deposits (one recipe per output name, the live `v1` one preferred), and every
stakeable planet is ranked by how many of those raws it carries, with richness as the tiebreak. Full coverage means
one stake feeds the whole tree; raws with no extractor family (Tritium Ore, Garnet Crystals, Aluminum Ore, Zinc Ore,
Osmium Ore, Manganese Ore) must come from fleet mining and are flagged. "Plan a stake here" opens the Stake Builder on
that planet.

## 🧪 Testing

Comprehensive test suite with **216 tests** across 35 suites:

```bash
# Run all tests
npm test

# Run specific test file
node Test/test-recipes.js
```

**Coverage:**
- Data loading and validation
- Analytics calculations
- Cross-explorer integration
- Component formula application
- Resource flow analysis

---

## 🎯 Common Use Cases

### 1. Finding Manufacturing Hubs
1. Go to **Planet Explorer** → Manufacturing tab
2. Sort by self-sufficiency score
3. Click "View All Locations" for specific industries

### 2. Planning Claim Stake Construction
1. Go to **ClaimStake Explorer** → Construction tab
2. Select planet and tier
3. Add buildings while monitoring slot/power limits
4. Export plan as JSON

### 3. Optimizing Recipe Production
1. Go to **ClaimStake Explorer** → Recipe Optimizer tab
2. Search for recipe
3. Review top regions and resource availability
4. Identify single-planet vs multi-planet requirements

### 4. Comparing Ship Configurations
1. Go to **Ship Explorer** → Explorer tab
2. Add ships and select configurations
3. Compare modified stats side-by-side
4. Switch to Analytics for efficiency rankings

### 5. Analyzing Resource Supply Chains
1. Go to **Resources Explorer** → Resource Flow tab
2. Review critical resources and bottlenecks
3. Check supply chain depth
4. Plan manufacturing around availability

---

## 🔧 Technical Details

### Browser Requirements
- Modern browser (Chrome, Edge, Firefox recommended)
- JavaScript enabled
- Local storage enabled
- Canvas support (for 3D viewer)

### Data Sources
- Star Atlas game data: SAGE uber-export of 2026-09-11 (5,251 recipes, 1,620 buildings, 3,901 planets with lore names, 3,756 ship components)
- Legacy SAGE system codes (`004-MUD-KING-01`) recovered from the May 2026 export, keyed by system key
- Manually curated component formulas
- Community-validated recipes

### Performance
- Lazy-loaded analytics (1-3 seconds initial load)
- Cached data for instant subsequent loads
- Pagination for large datasets (50 per page)
- Optimized rendering for 3,000+ items

---

## 🐛 Troubleshooting

### Data Not Loading
1. Check browser console (F12) for errors
2. Verify JSON files exist in `/Data/` folder
3. Hard refresh (Ctrl+Shift+R)
4. Check server is running on port 8000

### Analytics Not Showing
1. First load takes 1-3 seconds (loading indicator shown)
2. Check console for errors
3. Verify `CrossExplorerAnalytics.js` is loaded
4. Try switching tabs to force reload

### Ship Modified Stats Not Working
1. Wait for component data to load (few seconds)
2. Check console for calculator errors
3. Try switching configurations

---

## 📚 Documentation

- **[USER-GUIDE.md](Documentation/USER-GUIDE.md)** - Complete user guide ⭐ START HERE
- **[ANALYTICS-OVERVIEW.md](Documentation/ANALYTICS-OVERVIEW.md)** - Analytics architecture
- **[IMPLEMENTATION-STATUS.md](Documentation/IMPLEMENTATION-STATUS.md)** - Feature status
- **[RefreshData/IMPLEMENTATION-SUMMARY.md](RefreshData/IMPLEMENTATION-SUMMARY.md)** - Data pipeline details

---

## 🎓 Key Concepts

### Tiers (T1-T5)
- **T1:** Very Common - Basic resources, low value
- **T2:** Common - Intermediate resources
- **T3:** Uncommon - Valuable resources
- **T4:** Very Rare - High-value resources
- **T5:** Rarest - Premium resources, highest value

### Factions
- **MUD:** Brown/Orange faction
- **ONI:** Royal Blue faction
- **USTUR:** Dark Violet faction

### Self-Sufficiency Score
Percentage of recipes a planet can manufacture locally based on available resources. Higher score = less import dependency.

### Territory Value
Strategic score combining:
- Unique resources × 10
- Manufacturable recipes × 5
- Rare resources (T4-T5) × 20
- Average richness × 5

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **Star Atlas** team for the game data
- **Aephia Industries** community for feedback and testing
- **Three.js** for 3D visualization
- **Ajv** for JSON schema validation

---

## 📊 Statistics

- **Explorers:** 7 applications
- **Analytics Features:** 6 major systems
- **Test Coverage:** 216 tests across 35 suites
- **Data Points:** 4,261 total (planets, recipes, resources, buildings, ships)
- **Processing Pipeline:** 11 validated data sources
- **Code Quality:** Schema-validated, change-detected, CI/CD ready

---

**Last Updated:** September 10, 2026 (data refresh from the 2026-09-11 uber-export)
**Version:** 2.1
**Status:** Production Ready 🚀

---

🎯 **Ready to explore the Star Atlas economy!** 🌌
