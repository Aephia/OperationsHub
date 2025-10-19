# C4 Regions Analytics - Requirements Document

## Document Information
- **Version:** 1.0
- **Date:** 2025-01-14
- **Status:** Planning Phase
- **Priority:** High - Aligned with upcoming C4 game release
- **Source:** SA-C4-Regions-Part-1-3.pdf and SA-C4-Regions-Part-2-1.pdf

---

## Executive Summary

The C4 (Community Combat & Conquest) update introduces a new regional hierarchy system that fundamentally changes how Star Atlas territory, resources, and strategic control work. This document outlines analytics requirements to help players understand and navigate the new Regions → Star Systems → Planets hierarchy.

### Key Changes in C4:
- **Regions:** Groups of connected star systems (Neutral, Border, or Safe)
- **King Systems:** Special core systems with Local Markets
- **Core Systems:** Strategic control points determining region ownership
- **Warp Lanes:** Connections between systems (enable/disable based on ownership)
- **Cascading Ownership:** Conquering systems affects neighboring regions

---

## 1. Region Explorer (New Application)

### 1.1 Core Analytics

#### 1.1.1 Region Ownership Distribution
**Priority:** HIGH
**Difficulty:** MEDIUM
**Description:** Visualize the distribution of region types across all factions.

**Requirements:**
- Pie chart showing Neutral/Border/Safe regions globally
- Breakdown by faction (MUD, ONI, USTUR)
- Region count with ownership percentages
- Visual color coding:
  - Neutral: Gray/White
  - Border: Blue/Orange gradient
  - Safe: Green/Solid color
- Click to filter by region type

**Data Sources:**
- `planets.json` - Star system ownership
- New: `regions.json` (to be created) - Region definitions and boundaries
- New: `warp-lanes.json` (to be created) - Connectivity data

**Metrics:**
```javascript
{
  totalRegions: 69,          // 3 factions × 17 regions + 18 neutral
  neutralRegions: 18,
  borderRegions: 24,         // Partially/fully owned but contested
  safeRegions: 15,           // 5 per faction in safe zone
  factionBreakdown: {
    MUD: { safe: 5, border: 8, neutral: 4 },
    ONI: { safe: 5, border: 8, neutral: 4 },
    USTUR: { safe: 5, border: 8, neutral: 4 }
  }
}
```

---

#### 1.1.2 Regional Control Map
**Priority:** HIGH
**Difficulty:** HIGH
**Description:** Interactive visual map showing faction control percentages per region.

**Requirements:**
- Visual region map with boundaries
- Color gradient based on faction ownership (0-100%)
- Hover to show region details:
  - Region name
  - Owner faction (if owned)
  - Control percentage
  - Type (Neutral/Border/Safe)
  - King system name
  - Core systems count
  - Total systems count
- Click region to drill down into systems view
- Filter by faction
- Legend showing ownership thresholds:
  - 0-39%: Not owned (Neutral)
  - 40-59%: Contested (Border)
  - 60-99%: Partially owned (Border)
  - 100%: Fully owned (Border/Safe depending on neighbors)

**Technical Implementation:**
- SVG-based map or Canvas rendering
- Use Voronoi diagrams for region boundaries
- Real-time calculation of ownership percentages
- Animated transitions when filtering

---

#### 1.1.3 King Systems Analysis
**Priority:** HIGH
**Difficulty:** MEDIUM
**Description:** Identify and analyze all King Systems (most important systems with Local Markets).

**Requirements:**
- List all 69 King Systems (51 from existing T1+ starbases + 18 new neutrals)
- Show controlling faction
- Display key attributes:
  - Local Market status (only available in King Systems)
  - Number of planets
  - Unique resources
  - Manufacturing capability
  - Strategic value score
- Highlight T5 King Systems (fully owned from start)
- Highlight T1-4 King Systems (only King owned, rest neutral)
- Sort by strategic value
- Filter by faction ownership
- Click to view full region details

**Metrics:**
```javascript
{
  kingSystemId: "system-abc",
  kingSystemName: "Veles",
  region: "Region Alpha",
  owningFaction: "MUD",
  starbaseTier: 5,           // T5 = full region ownership at C4 start
  hasLocalMarket: true,
  planetCount: 12,
  uniqueResources: 18,
  manufacturingScore: 85,
  strategicValue: 920,
  regionControlStatus: "Fully Owned" // or "King Only" for T1-4
}
```

---

#### 1.1.4 Core Systems Distribution
**Priority:** MEDIUM
**Difficulty:** MEDIUM
**Description:** Analyze the distribution and importance of Core Systems.

**Requirements:**
- Show count of Core Systems per region
- Highlight ownership status of Core Systems
- Calculate 60% threshold for region ownership
- Show how close regions are to changing ownership
- Identify vulnerable Core Systems (in Border regions)
- Display faction ownership of Core Systems per region
- Warnings for regions close to 40%/60% thresholds
- Color coding:
  - Green: Faction controls >80% of cores
  - Yellow: 60-80% (safe ownership)
  - Orange: 40-60% (contested)
  - Red: <40% (losing ownership)

**Calculations:**
```javascript
// Ownership threshold calculation
const coreSystemsOwned = region.coreSystems.filter(
  sys => sys.owner === faction
).length;

const totalCoreSystems = region.coreSystems.length;
const ownershipPercent = (coreSystemsOwned / totalCoreSystems) × 100;

// Status determination
let status;
if (ownershipPercent >= 60 && includesKingSystem) {
  status = "Owned";
} else if (ownershipPercent >= 40) {
  status = "Contested";
} else {
  status = "Neutral";
}
```

---

#### 1.1.5 Warp Lane Network Analysis
**Priority:** MEDIUM
**Difficulty:** HIGH
**Description:** Analyze and visualize the warp lane connectivity network.

**Requirements:**
- Show all warp lanes between systems
- Indicate open vs. closed lanes:
  - **Open:** Both endpoints owned by same faction
  - **Closed:** One or both endpoints not owned
- Calculate connectivity metrics per faction
- Identify strategic chokepoints (systems controlling multiple lanes)
- Show isolated systems/regions (no open lanes)
- Display regional connectivity (lanes between regions)
- Highlight cross-faction warp lanes (potential invasion routes)
- Interactive lane highlighting (hover to show connections)

**Visualizations:**
- Network graph with nodes (systems) and edges (lanes)
- Color coding for lane status
- Thickness representing lane importance (traffic potential)

**Metrics:**
```javascript
{
  totalWarpLanes: 450,
  openLanes: 280,
  closedLanes: 170,
  factionConnectivity: {
    MUD: {
      internalLanes: 95,      // Within MUD territory
      borderLanes: 42,        // To contested/neutral
      isolatedSystems: 8
    }
  },
  chokepoints: [
    {
      systemId: "sys-123",
      laneCount: 8,           // Controls 8 warp lanes
      strategicValue: "Critical"
    }
  ]
}
```

---

#### 1.1.6 Tier 5 Starbase Regions
**Priority:** MEDIUM
**Difficulty:** LOW
**Description:** Identify regions with T5 starbases (fully owned at C4 launch).

**Requirements:**
- List all T5 starbase locations
- Show which regions they control
- Display full ownership status
- Highlight that these regions start as Border (not Safe)
- Show path to Safe status (need to own all neighbor regions)
- Compare T5 vs. T1-4 starbase regions
- Strategic value of T5 vs. lower tier regions

**Data:**
```javascript
{
  tier5Regions: [
    {
      region: "MUD Alpha",
      kingSystem: "Veles",
      starbaseTier: 5,
      initialStatus: "Border Region",
      coreSystemsOwned: 5,    // All cores owned at start
      totalSystems: 12,       // All systems owned at start
      pathToSafe: "Own 3 neighboring regions",
      strategicValue: 950
    }
  ],
  tier1to4Regions: [
    {
      region: "MUD Beta",
      kingSystem: "Solis",
      starbaseTier: 3,
      initialStatus: "Neutral Region",
      coreSystemsOwned: 1,    // Only King system owned
      totalSystems: 15,       // 14 systems neutral
      pathToOwnership: "Conquer 60%+ of core systems",
      strategicValue: 720
    }
  ]
}
```

---

#### 1.1.7 Safe Zone vs Medium Risk Zone
**Priority:** LOW
**Difficulty:** LOW
**Description:** Compare region characteristics between Safe and Medium Risk Zones.

**Requirements:**
- Region count per zone
- Ownership distribution
- Resource availability comparison
- Manufacturing capability comparison
- Strategic value differences
- Safety guarantees (Safe Zone always safe, MRZ can change)

---

### 1.2 Advanced Analytics

#### 1.2.1 Cascading Risk Analysis
**Priority:** HIGH
**Difficulty:** HIGH
**Description:** Analyze and predict cascading effects of system conquests.

**Requirements:**
- "What-if" simulator:
  - Input: "If faction X conquers system Y..."
  - Output: Show cascading ownership changes
- Identify critical systems (conquest causes region flip)
- Show domino effect across connected regions
- Visualize before/after ownership states
- Calculate probability of cascading failures
- Highlight vulnerable region chains

**Algorithm:**
```javascript
function analyzeCascadingEffects(conqueredSystem, conqueringFaction) {
  const affectedRegions = [];

  // 1. Check if conquered system is a Core or King system
  const isCore = conqueredSystem.isCore;
  const isKing = conqueredSystem.isKing;

  // 2. Calculate new ownership percentage
  const region = conqueredSystem.region;
  const newOwnership = calculateOwnership(region, conqueringFaction);

  // 3. Check ownership thresholds (40%, 60%)
  if (newOwnership >= 60 && hasKingSystem) {
    region.status = "Owned";
    affectedRegions.push(region);

    // 4. Check if ownership change affects neighbor regions
    region.neighbors.forEach(neighbor => {
      // If neighbor was Safe but now borders contested/enemy
      if (neighbor.status === "Safe" && hasEnemyBorder(neighbor)) {
        neighbor.status = "Border";
        affectedRegions.push(neighbor);
      }
    });
  } else if (newOwnership < 40) {
    region.status = "Neutral";
    affectedRegions.push(region);
  }

  return {
    directImpact: region,
    cascadingEffects: affectedRegions,
    warpLaneChanges: calculateWarpLaneChanges(affectedRegions),
    safeRegionsLost: countSafeToBorder(affectedRegions)
  };
}
```

---

#### 1.2.2 Border Vulnerability Score
**Priority:** MEDIUM
**Difficulty:** MEDIUM
**Description:** Calculate vulnerability scores for Border Regions.

**Requirements:**
- Vulnerability factors:
  - Distance from Safe Zone (farther = more vulnerable)
  - Number of contested Core Systems
  - Enemy presence in neighboring regions
  - Warp lane accessibility
  - Strategic importance of resources
  - Defensive capability (starbases, player activity)
- Score range: 0-100 (100 = extremely vulnerable)
- Color-coded threat levels
- Prioritization for defense
- Early warning system for region loss

**Scoring Formula:**
```javascript
const vulnerabilityScore =
  (100 - ownershipPercent) × 0.3 +         // Lower ownership = more vulnerable
  enemyNeighborCount × 15 +                 // More enemy neighbors = higher risk
  (10 - distanceFromSafeZone) × 3 +        // Farther from safe zone = more exposed
  contestedCoreCount × 10 +                 // Contested cores = instability
  (100 - defensiveStrength) × 0.2;         // Weaker defenses = higher risk
```

---

#### 1.2.3 Path to Safe Region
**Priority:** MEDIUM
**Difficulty:** MEDIUM
**Description:** Show what needs to be conquered to create new Safe Regions.

**Requirements:**
- For each Border Region, calculate:
  - Systems still needing conquest
  - Neighbor regions that must also be owned
  - Estimated difficulty/cost
  - Optimal conquest order
- Visual path planning:
  - Show systems in optimal order
  - Highlight dependencies
  - Estimate timeline based on resources
- Strategic recommendations:
  - Easiest regions to convert to Safe
  - Highest-value regions to secure
  - Regions providing best Safe Zone expansion

**Output Format:**
```javascript
{
  region: "MUD Expansion Alpha",
  currentStatus: "Border (Partially Owned)",
  pathToSafe: {
    systemsToConquer: [
      { system: "Sys-A", type: "Core", difficulty: "Medium" },
      { system: "Sys-B", type: "Normal", difficulty: "Low" }
    ],
    neighborRegionsRequired: [
      { region: "MUD Beta", status: "Must own 60%+", currentOwn: 45% },
      { region: "MUD Gamma", status: "Already owned", currentOwn: 85% }
    ],
    estimatedCost: "25,000 resources",
    estimatedTime: "2-3 weeks",
    difficulty: "Medium",
    strategicValue: 875
  }
}
```

---

#### 1.2.4 Strategic Chokepoints
**Priority:** MEDIUM
**Difficulty:** MEDIUM
**Description:** Identify systems controlling multiple warp lanes (bottlenecks).

**Requirements:**
- Calculate systems with high warp lane connectivity
- Identify regional gateways (only path between regions)
- Show impact of losing/conquering chokepoint systems
- Defensive priority ranking
- Trade route importance
- Invasion vulnerability

**Metrics:**
```javascript
{
  chokepointSystems: [
    {
      systemId: "sys-gateway-alpha",
      systemName: "Gateway Prime",
      warpLaneCount: 9,
      connectsRegions: ["Alpha", "Beta", "Gamma"],
      controllingFaction: "MUD",
      strategicImportance: "Critical",
      trafficVolume: "High",
      defensivePriority: 1,
      lossImpact: "Isolates 2 regions, closes 6 warp lanes"
    }
  ]
}
```

---

## 2. Planet Explorer Enhancements

### 2.1 New Analytics

#### 2.1.1 Planets by Region Type
**Priority:** HIGH
**Difficulty:** LOW
**Description:** Categorize and filter planets by their region type.

**Requirements:**
- New filter: Region Type (Neutral/Border/Safe)
- Show planet counts per region type
- Highlight planets in Safe Zones vs. risky areas
- Resource distribution by region type
- Manufacturing capability by region type
- Visual indicators for region status

**Implementation:**
```javascript
// Add to planet data structure
planet.regionType = determineRegionType(planet.starSystem);
planet.regionName = planet.starSystem.region;
planet.isInSafeZone = planet.starSystem.zone === "Safe";

// Filter categories
filters.regionType = {
  neutral: true,
  border: true,
  safe: true
};
```

---

#### 2.1.2 King System Planets
**Priority:** MEDIUM
**Difficulty:** LOW
**Description:** Highlight and analyze planets within King Systems.

**Requirements:**
- Filter to show only King System planets
- Badge/indicator for King System planets
- Note Local Market access (only in King Systems)
- Calculate strategic premium (King Systems more valuable)
- Show all King System planets in ranked list
- Compare King vs. non-King system planets

**Display:**
```javascript
{
  planet: "Veles Prime",
  system: "Veles (King System) 👑",
  hasLocalMarket: true,
  strategicPremium: 25%, // King systems worth 25% more
  accessibility: "High (Regional Hub)",
  description: "King System - Local Market available"
}
```

---

#### 2.1.3 Core System Resources
**Priority:** MEDIUM
**Difficulty:** LOW
**Description:** Analyze resource distribution in Core vs. Normal systems.

**Requirements:**
- Separate resource counts for Core vs. Normal systems
- Identify resources unique to Core Systems
- Strategic value of Core System resources
- Manufacturing dependencies on Core Systems
- Show which resources require controlling Core Systems

---

#### 2.1.4 Regional Resource Diversity
**Priority:** MEDIUM
**Difficulty:** MEDIUM
**Description:** Calculate which regions have the most diverse resource pools.

**Requirements:**
- Resource diversity score per region
- Unique resources per region
- Tier distribution (T1-T5 resources)
- Self-sufficiency score (can region produce all tiers?)
- Strategic value based on resource exclusivity
- Highlight regions with rare/unique resources

**Metrics:**
```javascript
{
  region: "Alpha Region",
  uniqueResources: 42,
  tierDistribution: {
    T1: 12,
    T2: 10,
    T3: 8,
    T4: 7,
    T5: 5
  },
  diversityScore: 87,           // Out of 100
  selfSufficiency: 65,          // Can produce 65% of all recipes
  exclusiveResources: [         // Only found here
    "Rare Element X",
    "Crystal Formation Y"
  ],
  strategicValue: "Very High"
}
```

---

#### 2.1.5 Cross-Region Supply Chains
**Priority:** LOW
**Difficulty:** MEDIUM
**Description:** Identify resources requiring access to multiple regions.

**Requirements:**
- List resources distributed across multiple regions
- Show minimum regions needed for full resource access
- Identify single-region bottlenecks
- Calculate faction resource accessibility
- Highlight risks (resources in enemy/contested regions)

---

#### 2.1.6 Safe Zone vs MRZ Resources
**Priority:** LOW
**Difficulty:** LOW
**Description:** Compare resource availability between Safe and Medium Risk Zones.

**Requirements:**
- Resource count comparison (Safe vs. MRZ)
- Identify Safe Zone-exclusive resources
- Identify MRZ-exclusive resources (high-risk, high-reward)
- Strategic trade-offs (safety vs. resource access)
- Manufacturing capability comparison

---

## 3. Resource Explorer Enhancements

### 3.1 New Analytics

#### 3.1.1 Regional Resource Availability
**Priority:** HIGH
**Difficulty:** MEDIUM
**Description:** Show which regions contain which resources.

**Requirements:**
- Resource availability matrix (Resources × Regions)
- Filter by region type (Neutral/Border/Safe)
- Highlight resource scarcity (few regions)
- Show resource abundance (many regions)
- Click resource to see all regions containing it
- Click region to see all resources in it
- Heatmap visualization

**Display Format:**
```javascript
{
  resource: "Titanium",
  tier: 3,
  availableInRegions: [
    { region: "Alpha", type: "Safe", faction: "MUD", planets: 5 },
    { region: "Beta", type: "Border", faction: "ONI", planets: 3 },
    { region: "Gamma", type: "Neutral", faction: null, planets: 7 }
  ],
  totalRegions: 15,
  scarcityScore: "Medium",    // Available in 15/69 regions
  controlDifficulty: "Easy"   // Mostly in Safe/friendly regions
}
```

---

#### 3.1.2 Cross-Regional Dependencies
**Priority:** MEDIUM
**Difficulty:** MEDIUM
**Description:** Identify resources requiring control of multiple regions.

**Requirements:**
- List resources not available in any single region
- Minimum region count for resource access
- Show faction accessibility (can faction access all needed regions?)
- Strategic bottlenecks (key regions for resource access)
- Trade route implications

---

#### 3.1.3 Strategic Resource Control
**Priority:** HIGH
**Difficulty:** MEDIUM
**Description:** Identify resources only available in specific faction regions.

**Requirements:**
- Faction-exclusive resources (only in one faction's territory)
- Contested resources (in Border/Neutral regions)
- Strategic monopolies (faction controls >80% of resource)
- Trade leverage opportunities
- Vulnerability assessment (losing region = losing resource)

**Metrics:**
```javascript
{
  resource: "Exotic Crystal",
  tier: 5,
  controlAnalysis: {
    MUD: { regions: 2, planets: 4, control: "40%" },
    ONI: { regions: 0, planets: 0, control: "0%" },
    USTUR: { regions: 3, planets: 6, control: "60%" },
    neutral: { regions: 0, planets: 0, control: "0%" }
  },
  strategicStatus: "USTUR Strategic Monopoly",
  tradeImportance: "Critical for ONI/MUD",
  vulnerabilityRating: "Medium"
}
```

---

#### 3.1.4 Warp Lane Resource Flows
**Priority:** LOW
**Difficulty:** HIGH
**Description:** Track resources requiring cross-region transport via warp lanes.

**Requirements:**
- Identify resources needing warp lane transport
- Show optimal transport routes
- Calculate transport risk (warp lanes through hostile territory)
- Highlight vulnerable supply chains
- Show alternative routes

---

#### 3.1.5 Border Region Resources
**Priority:** MEDIUM
**Difficulty:** LOW
**Description:** Resources found primarily in contested Border Regions.

**Requirements:**
- List resources in Border Regions
- Risk assessment (high-value but contested)
- Control stability (likely to change ownership)
- Strategic importance vs. risk trade-off

---

#### 3.1.6 Safe Region Self-Sufficiency
**Priority:** MEDIUM
**Difficulty:** MEDIUM
**Description:** Calculate if Safe Regions can be self-sufficient.

**Requirements:**
- Per-faction Safe Region resource inventory
- Calculate which recipes can be completed in Safe Regions
- Identify resources requiring MRZ access
- Self-sufficiency percentage
- Strategic recommendations (which regions to expand to)

---

## 4. Recipe Explorer Enhancements

### 4.1 New Analytics

#### 4.1.1 Recipes by Region Accessibility
**Priority:** HIGH
**Difficulty:** MEDIUM
**Description:** Categorize recipes by where they can be manufactured.

**Requirements:**
- Safe Zone recipes (all ingredients in Safe Regions)
- MRZ required recipes (need Medium Risk Zone access)
- Neutral region recipes (need neutral territory access)
- Cross-region recipes (ingredients scattered)
- Filter by accessibility level
- Strategic planning for manufacturing locations

**Categories:**
```javascript
{
  safeZoneRecipes: 450,        // Can complete in Safe Regions
  mrzRequiredRecipes: 280,     // Need MRZ access
  crossRegionRecipes: 180,     // Need multiple regions
  impossibleRecipes: 12,       // Resources in enemy-only territory
  difficulty: {
    easy: 450,    // Safe Zone
    medium: 280,  // MRZ but stable
    hard: 180,    // Multiple contested regions
    veryHard: 12  // Enemy exclusive resources
  }
}
```

---

#### 4.1.2 Cross-Regional Recipes
**Priority:** MEDIUM
**Difficulty:** MEDIUM
**Description:** Recipes requiring resources from multiple regions.

**Requirements:**
- List recipes with multi-region requirements
- Show minimum regions needed
- Identify warp lane dependencies
- Calculate logistics complexity
- Risk assessment (routes through hostile territory)
- Cost estimation (transport + risk premium)

---

#### 4.1.3 Border Region Manufacturing
**Priority:** LOW
**Difficulty:** LOW
**Description:** Recipes only manufacturable in Border/contested regions.

**Requirements:**
- List high-risk, high-reward recipes
- Show strategic value vs. risk
- Alternative safer manufacturing locations
- Required defensive measures

---

#### 4.1.4 Warp Lane Dependencies
**Priority:** LOW
**Difficulty:** MEDIUM
**Description:** Recipes requiring resource transport across warp lanes.

**Requirements:**
- Identify warp lane-dependent recipes
- Show critical warp lanes for manufacturing
- Calculate route vulnerability
- Alternative routes
- Strategic chokepoints

---

#### 4.1.5 Faction-Locked Recipes
**Priority:** MEDIUM
**Difficulty:** LOW
**Description:** Recipes only possible for specific factions (due to resource control).

**Requirements:**
- Per-faction recipe accessibility
- Faction advantages (unique access)
- Trade opportunities (inter-faction dependencies)
- Strategic value of faction-exclusive recipes

---

## 5. Strategic Planning Explorer (New Application)

### 5.1 Tactical Tools

#### 5.1.1 Conquest Simulator
**Priority:** HIGH
**Difficulty:** VERY HIGH
**Description:** Interactive "what-if" tool for planning conquests.

**Requirements:**
- Input: Select system to conquer
- Output: Show cascading effects
- Visual before/after comparison
- Ownership change predictions
- Warp lane status changes
- Safe/Border region transitions
- Cost/benefit analysis
- Multiple scenario comparison

**Features:**
- Drag-and-drop conquest planning
- Real-time recalculation
- Save scenarios for later
- Export conquest plans

---

#### 5.1.2 Safe Region Calculator
**Priority:** MEDIUM
**Difficulty:** HIGH
**Description:** Calculate path from Border to Safe Region.

**Requirements:**
- Select Border Region
- Calculate required conquests
- Show optimal conquest order
- Estimate resources needed
- Timeline projection
- Risk assessment
- Alternative paths

---

#### 5.1.3 Faction Expansion Paths
**Priority:** MEDIUM
**Difficulty:** HIGH
**Description:** Recommend optimal expansion strategies per faction.

**Requirements:**
- Per-faction expansion recommendations
- Prioritize by:
  - Strategic value
  - Difficulty
  - Resource gain
  - Safe Zone expansion
- Multi-step expansion plans
- Defensive considerations

---

#### 5.1.4 Defense Priority Matrix
**Priority:** MEDIUM
**Difficulty:** MEDIUM
**Description:** Rank systems by defensive importance.

**Requirements:**
- Defensive priority scoring:
  - Warp lane connectivity
  - Resource value
  - Core System status
  - King System status
  - Regional position
- Threat assessment
- Recommended garrison levels
- Early warning indicators

---

#### 5.1.5 40%/60% Threshold Tracker
**Priority:** HIGH
**Difficulty:** LOW
**Description:** Monitor regions close to ownership threshold changes.

**Requirements:**
- Real-time tracking of ownership percentages
- Alerts when approaching thresholds:
  - 40% (losing ownership)
  - 60% (gaining ownership)
- Color-coded warnings
- Trend analysis (ownership increasing/decreasing)
- Predicted flip dates
- Recommended actions

**Display:**
```javascript
{
  region: "Beta Region",
  currentOwnership: {
    MUD: 58,      // ⚠️ 2% from gaining ownership
    ONI: 25,
    USTUR: 17
  },
  threshold: "60% for ownership",
  status: "Near Threshold - 2% to go",
  trend: "Increasing (+3% this week)",
  prediction: "Will reach 60% in 4-5 days",
  recommendation: "Prioritize final 2% conquest",
  urgency: "High"
}
```

---

#### 5.1.6 Cascading Impact Analyzer
**Priority:** HIGH
**Difficulty:** VERY HIGH
**Description:** Visualize domino effects of system losses.

**Requirements:**
- Interactive network visualization
- Click system to see what breaks if lost
- Show cascading failures
- Calculate worst-case scenarios
- Identify critical systems (single point of failure)
- Recommend redundancy strategies

---

## 6. Cross-Explorer Analytics Enhancements

### 6.1 Shared Analytics Across All Explorers

#### 6.1.1 Regional Heatmaps
**Priority:** MEDIUM
**Difficulty:** HIGH
**Description:** Color-code maps by various metrics.

**Requirements:**
- Heatmap modes:
  - Ownership (faction colors)
  - Risk (safe to dangerous gradient)
  - Resource density
  - Manufacturing capability
  - Strategic value
- Smooth color gradients
- Toggle between modes
- Zoom and pan
- Click for details

---

#### 6.1.2 Warp Lane Traffic Analysis
**Priority:** LOW
**Difficulty:** MEDIUM
**Description:** Analyze theoretical traffic importance of warp lanes.

**Requirements:**
- Traffic volume estimation (based on trade value)
- Strategic lanes (military importance)
- Economic lanes (trade routes)
- Bottleneck identification
- Alternative route suggestions

---

#### 6.1.3 Faction Territory Overview
**Priority:** MEDIUM
**Difficulty:** MEDIUM
**Description:** Comprehensive dashboard per faction.

**Requirements:**
- Per-faction statistics:
  - Total regions (Neutral/Border/Safe)
  - Total systems
  - Total planets
  - Resource control
  - Manufacturing capability
  - Territory value
  - Expansion opportunities
  - Vulnerabilities
- Comparison with other factions
- Historical trends
- Strategic position assessment

---

#### 6.1.4 C4 Launch State Predictor
**Priority:** MEDIUM
**Difficulty:** LOW
**Description:** Visualize the initial state at C4 launch.

**Requirements:**
- Show T5 starbase regions (fully owned)
- Show T1-4 starbase regions (King only)
- Show neutral regions
- Calculate initial faction positions
- Identify first expansion targets
- Pre-launch strategy recommendations

---

#### 6.1.5 Conquest Timeline (Future)
**Priority:** LOW
**Difficulty:** VERY HIGH
**Description:** Historical view of region control changes over time.

**Requirements:**
- Timeline slider
- Show ownership changes
- Replay conquests
- Trend analysis
- Victory/defeat patterns
- Lessons learned

---

#### 6.1.6 Alliance Value Calculator
**Priority:** LOW
**Difficulty:** MEDIUM
**Description:** Calculate strategic value of regions for different factions.

**Requirements:**
- Per-faction value scoring
- Resource access value
- Strategic position value
- Trade route value
- Defensive value
- Alliance recommendations (trade partners)

---

## 7. Data Requirements

### 7.1 New Data Files Needed

#### 7.1.1 regions.json
**Priority:** CRITICAL
**Description:** Master list of all 69 regions.

**Structure:**
```json
{
  "regions": [
    {
      "id": "region-mud-alpha",
      "name": "MUD Alpha Region",
      "type": "safe",
      "zone": "safe",
      "owningFaction": "MUD",
      "kingSystem": {
        "id": "system-veles",
        "name": "Veles",
        "starbaseTier": 5
      },
      "coreSystems": [
        { "id": "system-a", "name": "Core A", "owner": "MUD" },
        { "id": "system-b", "name": "Core B", "owner": "MUD" }
      ],
      "normalSystems": [
        { "id": "system-n1", "name": "Normal 1", "owner": "MUD" }
      ],
      "totalSystems": 12,
      "ownershipPercent": 100,
      "neighborRegions": ["region-mud-beta", "region-neutral-1"],
      "warpLanes": [
        {
          "from": "system-veles",
          "to": "system-mud-beta-king",
          "status": "open"
        }
      ]
    }
  ]
}
```

---

#### 7.1.2 warp-lanes.json
**Priority:** HIGH
**Description:** All warp lane connections between systems.

**Structure:**
```json
{
  "warpLanes": [
    {
      "id": "lane-001",
      "fromSystem": "system-veles",
      "toSystem": "system-proxima",
      "fromRegion": "region-mud-alpha",
      "toRegion": "region-mud-beta",
      "distance": 150,
      "status": "open",
      "requiresBothOwned": true,
      "currentlyEnabled": true,
      "strategicImportance": "high",
      "trafficType": ["trade", "military"]
    }
  ]
}
```

---

#### 7.1.3 system-types.json (Enhancement to existing data)
**Priority:** HIGH
**Description:** Add system type information to existing planets.json.

**New Fields:**
```json
{
  "starSystems": [
    {
      "id": "system-veles",
      "name": "Veles",
      "systemType": "king",
      "region": "region-mud-alpha",
      "hasLocalMarket": true,
      "starbaseTier": 5,
      "controllingFaction": "MUD",
      // ... existing fields
    }
  ]
}
```

---

### 7.2 Data Enhancement Requirements

#### 7.2.1 planets.json enhancements
Add fields:
```json
{
  "region": "region-mud-alpha",
  "systemType": "king",
  "isInCoreSystem": true,
  "isInSafeZone": true,
  "regionType": "safe"
}
```

#### 7.2.2 recipes.json enhancements
Add fields:
```json
{
  "accessibilityLevel": "safe-zone",
  "requiredRegions": ["region-alpha", "region-beta"],
  "crossRegional": true,
  "warpLaneRequired": true
}
```

#### 7.2.3 resources.json enhancements
Add fields:
```json
{
  "availableRegions": ["region-alpha", "region-beta"],
  "scarcityScore": 0.45,
  "controlledBy": "MUD",
  "strategicImportance": "high"
}
```

---

## 8. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
**Goal:** Set up data infrastructure and basic region viewing

**Tasks:**
1. Create `regions.json` with all 69 regions
2. Create `warp-lanes.json` with connectivity data
3. Enhance `planets.json` with region fields
4. Create basic Region Explorer application
5. Implement Region Ownership Distribution
6. Implement King Systems Analysis

**Deliverables:**
- Data files created and validated
- Basic Region Explorer working
- Can view regions and basic stats

---

### Phase 2: Core Analytics (Weeks 3-4)
**Goal:** Add essential strategic analytics

**Tasks:**
1. Implement Regional Control Map
2. Implement Core Systems Distribution
3. Implement Warp Lane Network Analysis
4. Add Planet Explorer region filters
5. Add Resource Explorer regional availability

**Deliverables:**
- Interactive region map
- System ownership tracking
- Warp lane visualization
- Cross-explorer region filters

---

### Phase 3: Strategic Tools (Weeks 5-6)
**Goal:** Build planning and prediction tools

**Tasks:**
1. Implement Cascading Risk Analysis
2. Implement Border Vulnerability Score
3. Implement 40%/60% Threshold Tracker
4. Implement Path to Safe Region calculator
5. Add Recipe Explorer regional filters

**Deliverables:**
- Risk assessment tools
- Ownership threshold tracking
- Strategic planning capabilities

---

### Phase 4: Advanced Features (Weeks 7-8)
**Goal:** Complete advanced analytics and simulator

**Tasks:**
1. Implement Conquest Simulator
2. Implement Cascading Impact Analyzer
3. Implement Strategic Chokepoints analysis
4. Implement C4 Launch State Predictor
5. Add cross-explorer regional heatmaps

**Deliverables:**
- Full conquest simulator
- Advanced predictive analytics
- Complete strategic planning suite

---

### Phase 5: Polish & Optimization (Week 9)
**Goal:** Refine UX and optimize performance

**Tasks:**
1. Performance optimization (caching, lazy loading)
2. Mobile responsiveness
3. Visual polish (animations, transitions)
4. User testing and feedback
5. Documentation and help system

**Deliverables:**
- Production-ready application
- Optimized performance
- Comprehensive documentation

---

## 9. Technical Specifications

### 9.1 Architecture

**Frontend Stack:**
- Vanilla JavaScript (ES6+)
- HTML5/CSS3
- SVG for visualizations
- Canvas for complex maps (optional)

**Data Layer:**
- JSON-based data files
- Client-side caching
- DataLoader utility for unified loading
- CrossExplorerAnalytics for shared logic

**Rendering:**
- Progressive rendering for large datasets
- Lazy loading for analytics tabs
- Virtual scrolling for long lists
- Debounced calculations for sliders/inputs

---

### 9.2 Performance Targets

**Initial Load:**
- Region Explorer: <3 seconds
- Regional data processing: <2 seconds

**Interaction:**
- Filter/sort operations: <200ms
- Conquest simulator updates: <500ms
- Map rendering: <1 second

**Memory:**
- Total data footprint: <50MB
- Cached analytics: <20MB

---

### 9.3 Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Mobile Support:**
- Responsive design for tablets (768px+)
- Touch-friendly controls
- Mobile map navigation (pinch-zoom, pan)

---

## 10. Success Metrics

### 10.1 Feature Completeness
- ✅ All Phase 1 features implemented
- ✅ All Phase 2 features implemented
- ✅ All Phase 3 features implemented
- ✅ All Phase 4 features implemented
- ✅ All Phase 5 features implemented

### 10.2 Performance Metrics
- ✅ Load times under target
- ✅ Interaction responsiveness <200ms
- ✅ No memory leaks
- ✅ Smooth animations (60fps)

### 10.3 User Experience
- ✅ Intuitive navigation
- ✅ Clear data visualization
- ✅ Helpful tooltips and legends
- ✅ Mobile-friendly
- ✅ Accessible (WCAG 2.1 AA)

### 10.4 Data Accuracy
- ✅ All region data validated
- ✅ Ownership calculations correct
- ✅ Warp lane statuses accurate
- ✅ Cascading effects properly calculated

---

## 11. Risk Assessment

### 11.1 Technical Risks

**High Risk:**
- **Conquest Simulator Complexity:** Very complex state management
  - *Mitigation:* Start simple, iterate with user feedback
  - *Fallback:* Basic calculator instead of full simulator

**Medium Risk:**
- **Data Accuracy:** Region data not yet official from Star Atlas
  - *Mitigation:* Use best available information, mark as "estimated"
  - *Fallback:* Wait for official data release

- **Performance:** Large datasets (69 regions × ~20 systems each)
  - *Mitigation:* Aggressive caching, progressive rendering
  - *Fallback:* Reduce simultaneous visualizations

**Low Risk:**
- **Browser Compatibility:** Modern features may not work in old browsers
  - *Mitigation:* Feature detection, graceful degradation
  - *Fallback:* Display compatibility warning

---

### 11.2 Schedule Risks

**High Risk:**
- **C4 Release Date Unknown:** Features may need to be ready before official release
  - *Mitigation:* Prioritize high-value features first
  - *Fallback:* Release MVP, add features post-launch

**Medium Risk:**
- **Scope Creep:** Too many features, not enough time
  - *Mitigation:* Strict phase gates, feature prioritization
  - *Fallback:* Cut Phase 4/5 features if needed

---

## 12. Future Enhancements (Post-MVP)

### 12.1 Real-Time Integration
- Connect to blockchain for live ownership data
- Real-time conquest notifications
- Live warp lane status updates
- Player activity heatmaps

### 12.2 Social Features
- Guild/alliance planning tools
- Shared conquest plans
- Collaborative strategy sessions
- Discord bot integration

### 12.3 Advanced Analytics
- Machine learning for conquest prediction
- Player behavior analysis
- Economic impact modeling
- Supply/demand forecasting

### 12.4 Mobile App
- Native iOS/Android apps
- Push notifications for region changes
- Offline mode with cached data
- AR map viewing (future tech)

---

## 13. Appendix

### 13.1 Glossary

**Region:** Group of connected star systems (Neutral, Border, or Safe)
**King System:** Special core system with Local Market
**Core System:** Strategic systems determining region ownership
**Normal System:** Non-core, non-king systems
**Safe Zone:** Area with 5 guaranteed safe regions per faction
**Medium Risk Zone (MRZ):** Contestable area outside Safe Zone
**Warp Lane:** Connection between systems (requires both ends owned)
**Cascading Effect:** Domino effect when conquering systems changes region ownership
**60% Threshold:** Ownership of 60%+ core systems (+ King) = region ownership
**40% Threshold:** Falling below 40% core systems = loss of region ownership

### 13.2 References

- **SA-C4-Regions-Part-1-3.pdf** - Individual Regions mechanics
- **SA-C4-Regions-Part-2-1.pdf** - Regions Interplay and strategy
- **Star Atlas Official Docs** - https://docs.staratlas.com/
- **Current Implementation** - `/Siphawaal.xyz/` explorers

### 13.3 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-14 | Claude | Initial requirements document |

---

## 14. Summary

This requirements document outlines a comprehensive suite of C4 Regions analytics features across 6 major areas:

1. **Region Explorer (New)** - 7 core analytics + 4 advanced
2. **Planet Explorer Enhancements** - 6 new regional analytics
3. **Resource Explorer Enhancements** - 6 new regional analytics
4. **Recipe Explorer Enhancements** - 5 new regional analytics
5. **Strategic Planning Explorer (New)** - 6 tactical tools
6. **Cross-Explorer Enhancements** - 6 shared analytics

**Total:** 40+ new analytics features specifically designed for C4 Regions system.

**Priority Focus:**
- **Phase 1 (Critical):** Data infrastructure, basic viewing
- **Phase 2 (High):** Region maps, ownership tracking, filters
- **Phase 3 (Medium):** Risk analysis, threshold tracking, planning
- **Phase 4 (Lower):** Simulators, advanced predictions
- **Phase 5 (Polish):** Optimization, documentation

**Estimated Timeline:** 9 weeks for full implementation
**MVP Timeline:** 4 weeks (Phases 1-2)

**Key Success Factor:** Accurate regional data and ownership calculations matching C4 game mechanics.

---

**Document Status:** ✅ COMPLETE - Ready for implementation planning
**Next Step:** Review and prioritize features for Phase 1 implementation
**Owner:** Development Team
**Stakeholders:** Star Atlas community, guild leaders, strategic planners
