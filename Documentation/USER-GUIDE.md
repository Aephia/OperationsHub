# Siphawaal.xyz - Complete User Guide

**Star Atlas Economic Tools & Analytics Platform**

---

## 🚀 Quick Start

### Starting the Application

**Option 1: Double-click START-SERVER.bat** (Easiest)
- Located in root directory
- Opens server automatically
- Browse to `http://localhost:8000`

**Option 2: Manual Start**
```bash
python -m http.server 8000
# or
python3 -m http.server 8000
```
Then open browser to: `http://localhost:8000`

---

## 📂 Explorer Applications

### 1. 🪐 Planet Explorer
**URL:** `/PlanetExplorer/index.html`

**Purpose:** Discover and analyze planets, star systems, and territorial control

**Features:**
- **Explorer Tab:**
  - Browse 3,901 planets across all star systems
  - Filter by faction (MUD, ONI, USTUR)
  - Filter by planet type (20+ types)
  - Search by planet or system name
  - View detailed planet resources with tier badges
  - See resource richness ratings

- **🏭 Manufacturing Tab:**
  - Top manufacturing planets by self-sufficiency score
  - Specialized manufacturing hubs (Infrastructure, Processing, Ship Components, etc.)
  - Self-sufficiency distribution (5 tiers from 80-100% down to 0-20%)
  - Manufacturing insights (best planets, most recipes, most resources)

- **🌍 Territory Tab:**
  - Most valuable star systems ranked by strategic score
  - Faction dominance analysis (MUD vs ONI vs USTUR)
  - Territory comparison charts
  - Strategic insights (dominant faction, best territory, quality systems)

**How to Use:**
1. Open Planet Explorer
2. Use filters on left sidebar to narrow down planets
3. Click on any planet card to view full details
4. Switch tabs to view Manufacturing or Territory analytics
5. Click "View All X Locations" in analytics to see detailed breakdowns

---

### 2. 🧪 Recipe Explorer
**URL:** `/RecipeExplorer/index.html`

**Purpose:** Explore manufacturing recipes, production chains, and resource requirements

**Features:**
- **Explorer Tab:**
  - Browse 247 manufacturing recipes
  - Filter by category (Infrastructure, Processing, Ship Components, etc.)
  - Filter by tier (T1-T5) and output type
  - View recipe ingredients and outputs
  - See construction times
  - Analyze resource requirements

- **Analytics Tab:**
  - Recipe complexity analysis
  - Tier distribution charts
  - Category breakdown
  - Resource bottleneck identification
  - Construction time analysis
  - Dependency depth calculations

- **Manufacturing Chain:**
  - Visualize full production chains
  - Track ingredient sources
  - Identify supply chain bottlenecks
  - See recursive dependencies

**How to Use:**
1. Open Recipe Explorer
2. Use category/tier filters to find specific recipes
3. Click on recipe cards to view details
4. Switch to Analytics tab for data insights
5. Use search to find specific recipes quickly

---

### 3. 💎 Resources Explorer
**URL:** `/ResourcesExplorer/index.html`

**Purpose:** Analyze resource types, values, tiers, and supply chains

**Features:**
- **Explorer Tab:**
  - Browse all 93 resource types
  - Filter by tier (T1-T5), category (Raw, Processed, Organic)
  - Filter by source type (Extraction, Processing, Organic Farming)
  - View resource base values and tiers
  - See resource properties (tradeable, consumable, craftable)

- **Analytics Tab:**
  - Resource tier distribution
  - Category breakdown (Raw/Processed/Tradeable)
  - Value metrics and rarity analysis
  - Source type grouping
  - Special property detection

- **🔄 Resource Flow Tab:**
  - Critical resources dashboard with scoring
  - Supply bottleneck detection
  - Supply chain depth analysis (0-N processing steps)
  - Resource usage patterns (extraction, consumption, recipes)
  - Critical resource identification

**How to Use:**
1. Open Resources Explorer
2. Filter by tier to find rare resources (T4-T5)
3. Use category filters to focus on specific resource types
4. Switch to Analytics tab for data insights
5. Go to Resource Flow tab to analyze supply chains

---

### 4. 🏗️ ClaimStake Explorer
**URL:** `/ClaimStakeExplorer/index.html`

**Purpose:** Plan claim stake construction, analyze building efficiency

**Features:**
- **Explorer Tab:**
  - Browse all building types
  - Filter by tier (T1-T5)
  - Filter by special properties (Comes with Stake, Cannot Remove, Has Extraction)
  - Filter by building functions (Processing Hub, Storage Hub, etc.)
  - View building costs, slots, power requirements
  - See resource generation/consumption rates

- **📈 Building Analytics Tab:**
  - Total buildings count and statistics
  - Tier distribution
  - Building type breakdown
  - Resource requirements analysis
  - Power consumption/generation analysis
  - Storage capacity analysis

- **📊 Competitive Advantage Tab:**
  - Manufacturing capability by faction
  - Resource control & dominance
  - Strategic vulnerabilities analysis
  - Strategic chokepoints (critical resource control)
  - Faction competition metrics

- **🏗️ Construction Tab:**
  - Select planet and claim stake tier (T1-T5)
  - Build facility plans with validation
  - Slot limits: T1=4, T2=32, T3=108, T4=256, T5=500
  - Power requirements: T1=100, T2=200, T3=300, T4=400, T5=500
  - Real-time stats: resource costs, crew, power, storage, features
  - Comprehensive validation (slots, power, tier compatibility)
  - Export facility plan as JSON

**How to Use:**
1. Open ClaimStake Explorer
2. Browse buildings and filter by needs
3. Switch to Building Analytics for data insights
4. Go to Competitive Advantage to analyze faction control
5. Use Construction tab to plan your facility:
   - Select a planet from dropdown
   - Choose claim stake tier
   - Add buildings to plan
   - Monitor slot/power limits in stats panel
   - Export plan when complete

---

### 5. 🏠 Hub Explorer
**URL:** `/HubExplorer/index.html`

**Purpose:** Plan and optimize space hub construction

**Features:**
- **Explorer Tab:**
  - Browse hub modules and components
  - Habitat tier progression (T1-T5)
  - Crafting station efficiency and speed bonuses
  - Cargo storage capacity calculations
  - Construction cost validation

- **Analytics:**
  - Hub configuration comparison
  - Resource optimization
  - Efficiency scoring
  - Cost/benefit analysis

**How to Use:**
1. Open Hub Explorer
2. Select habitat tier
3. Add crafting stations and storage modules
4. View total costs and capabilities
5. Optimize for efficiency or capacity

---

### 6. 🚢 Ship Explorer
**URL:** `/ShipExplorer/index.html`

**Purpose:** Compare ships, analyze configurations, fleet planning

**Features:**
- **Explorer Tab:**
  - Multi-ship side-by-side comparison
  - 67 ships available
  - Multiple configurations per ship
  - Real-time stat calculations with component modifiers
  - 40+ stats tracked (cargo, combat, travel, mining, scanning, repair)
  - Color-coded changes (green=increase, red=decrease, gold=>100%)
  - Stat filtering and search
  - Save/load configurations as JSON

- **📊 Analytics Tab:**
  - **Fleet Analytics:**
    - Construction costs per configuration (not aggregated!)
    - Shows Configuration name, not manufacturer
    - Total resources and component count per config
    - "View Breakdown" button shows:
      - All components in that configuration
      - Recipe buttons for each component
      - Estimated resource costs

  - **Resource Efficiency:**
    - Best cargo haulers per configuration with modified stats
    - Best combat ships per configuration with modified stats
    - Fastest ships per configuration with modified stats
    - Most fuel efficient per configuration with modified stats
    - Each configuration shows actual modified cargo/combat/speed values
    - Example: Rainbow Phi "Tier Three" shows 49M cargo (not base 15M!)

**How to Use:**
1. Open Ship Explorer
2. **Explorer Tab:** Click "+ Add Ship" to compare ships
3. Select configuration for each ship (dropdown)
4. View modified stats in real-time
5. Use search to filter stats
6. **Analytics Tab:** Switch to see fleet data
7. Review construction costs per configuration
8. Click "View Breakdown" to see components
9. Click "📋 Recipe" buttons to navigate to Recipe Explorer
10. Check Resource Efficiency for best ships per role

---

## 🔬 Analytics Features

### Cross-Explorer Analytics

All analytics use the **CrossExplorerAnalytics** engine which combines data from:
- Resources (tier, value, category)
- Recipes (ingredients, outputs, construction time)
- Planets (resources, factions, locations)
- Buildings (extraction, consumption, power)
- Ships (configurations, components, stats)

### Available Analytics:

1. **Resource Flow Analysis** (Resources Explorer)
   - Critical resources identification
   - Supply bottlenecks
   - Supply chain depth
   - Usage patterns

2. **Manufacturing Optimization** (Planet Explorer)
   - Top manufacturing planets
   - Self-sufficiency scoring
   - Specialization grouping
   - Capability distribution

3. **Territory Control** (Planet Explorer)
   - Strategic system value
   - Faction dominance
   - Comparative metrics
   - Territory quality

4. **Competitive Advantage** (ClaimStake Explorer)
   - Manufacturing capability by faction
   - Resource dominance analysis
   - Strategic vulnerabilities
   - Critical chokepoints

5. **Fleet Resource Footprint** (Ship Explorer)
   - Construction costs per configuration
   - Operating costs (crew, fuel)
   - Fleet capabilities by role
   - Strategic insights

6. **Ship Resource Efficiency** (Ship Explorer)
   - Best cargo haulers (modified stats!)
   - Best combat ships (modified stats!)
   - Fastest ships (modified stats!)
   - Most fuel efficient (modified stats!)

---

## 💡 Pro Tips

### General Navigation
- Use breadcrumb links at top to navigate between explorers
- All explorers have consistent tab structure
- Use browser back button to return to home page

### Filtering Efficiently
- **Stack filters:** Apply multiple filters simultaneously
- **Search first:** Use search boxes to narrow down quickly
- **Tier filtering:** T4-T5 resources are rarest and most valuable
- **Faction filtering:** Helps with territorial planning

### Using Analytics
- **Analytics tabs load lazily:** First click loads data (1-3 seconds)
- **Subsequent loads are instant:** Data is cached
- **Click cards/rows:** Many analytics have detailed modals
- **Export data:** Save configurations as JSON when available

### Ship Explorer Specific
- **Configuration vs Ship:** Each config is a separate entry
- **Modified stats:** Analytics show ACTUAL modified stats, not base
- **Component breakdown:** Click "View Breakdown" to see all components
- **Recipe navigation:** Click "📋 Recipe" to learn how to craft components

### Performance
- **Pagination:** Large lists are paginated (50 per page)
- **Filters:** Filter before loading analytics for better performance
- **Cache clear:** Hard refresh (Ctrl+Shift+R) if data seems stale

---

## 🎯 Common Use Cases

### 1. Finding Best Planets for Manufacturing
1. Go to Planet Explorer → Manufacturing tab
2. Sort by self-sufficiency score
3. Click "View All Locations" for specific industries
4. Choose planets with highest local resource availability

### 2. Planning Claim Stake Construction
1. Go to ClaimStake Explorer → Construction tab
2. Select your planet from dropdown
3. Choose claim stake tier (determines slots & power)
4. Add buildings one by one
5. Watch stats panel for slot/power limits
6. Export plan as JSON when done

### 3. Comparing Ship Configurations
1. Go to Ship Explorer → Explorer tab
2. Add ships you want to compare
3. Select different configurations for each ship
4. Compare modified stats side-by-side
5. Go to Analytics tab to see efficiency rankings

### 4. Analyzing Resource Supply Chains
1. Go to Resources Explorer → Resource Flow tab
2. Review critical resources list
3. Check bottlenecks section
4. Analyze supply chain depth
5. Plan manufacturing around available resources

### 5. Identifying Strategic Territories
1. Go to Planet Explorer → Territory tab
2. Review most valuable systems
3. Check faction dominance
4. Analyze rare resource distribution
5. Plan territorial expansion

### 6. Component Sourcing for Ships
1. Go to Ship Explorer → Analytics
2. Click "View Breakdown" on any ship
3. See all components required
4. Click "📋 Recipe" to see crafting requirements
5. Go to Planet Explorer to find manufacturing locations

---

## 🔧 Technical Details

### Data Sources
- `planets.json` - 3,901 planets across star systems
- `recipes.json` - 247 manufacturing recipes
- `resources.json` - 93 resource types
- `buildings.json` - 100+ building types
- `ships.json` - 67 ships with configurations

### Browser Requirements
- Modern browser (Chrome, Edge, Firefox recommended)
- JavaScript enabled
- Local storage enabled (for saved configurations)

### File Structure
```
Siphawaal.xyz/
├── index.html                  # Home page
├── START-SERVER.bat            # Quick server start
│
├── PlanetExplorer/             # Planet & territory analysis
├── RecipeExplorer/             # Recipe & production chains
├── ResourcesExplorer/          # Resource analysis & flow
├── ClaimStakeExplorer/         # Building & facility planning
├── HubExplorer/                # Space hub construction
├── ShipExplorer/               # Ship comparison & fleet
│
├── Utils/
│   ├── CrossExplorerAnalytics.js  # Analytics engine
│   └── DataLoader.js              # Data loading system
│
├── Data/                       # JSON data files
├── Documentation/              # This guide and more
└── Test/                       # Test suite (216 tests)
```

---

## 🐛 Troubleshooting

### Data Not Loading
- Check browser console (F12) for errors
- Verify JSON files exist in `/Data/` folder
- Hard refresh page (Ctrl+Shift+R)
- Check server is running on port 8000

### Analytics Not Showing
- First load takes 1-3 seconds (loading indicator shown)
- Check browser console for errors
- Verify CrossExplorerAnalytics.js is loaded
- Try switching tabs to force reload

### Ship Modified Stats Not Working
- Ensure component data has loaded (may take few seconds)
- Check browser console for calculator errors
- Verify ship configurations have components defined
- Try switching to different configuration and back

### 3D Viewer Not Rendering
- Check WebGL support in browser
- Verify Three.js library is loaded
- Check browser console for 3D errors
- Try disabling WebGL effects in config.js

### Page Styles Broken
- Check all CSS files are loaded
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Verify file paths in HTML

---

## 📚 Additional Documentation

- **CROSS-EXPLORER-ANALYTICS-GUIDE.md** - Detailed analytics guide
- **ANALYTICS-OVERVIEW.md** - Analytics system architecture
- **IMPLEMENTATION-STATUS.md** - Current feature status
- **Test/TESTPLAN.md** - Test suite structure

---

## 🎓 Key Concepts

### Tiers (T1-T5)
- **T1:** Very Common (basic resources, low value)
- **T2:** Common (intermediate resources)
- **T3:** Uncommon (valuable resources)
- **T4:** Very Rare (high-value resources)
- **T5:** Rarest (premium resources, highest value)

### Factions
- **MUD:** Brown/Orange faction
- **ONI:** Royal Blue faction
- **USTUR:** Dark Violet faction

### Ship Configurations
- Each ship has multiple preset configurations
- Configurations modify base stats via components
- Modified stats use golden ratio scaling formulas
- Stats changes are color-coded (green=increase, red=decrease)

### Self-Sufficiency Score
- Percentage of recipes a planet can manufacture locally
- Based on available resources vs. recipe requirements
- Higher score = less import dependency
- Used in manufacturing optimization

### Territory Value
- Strategic score combining multiple factors:
  - Unique resources × 10
  - Manufacturable recipes × 5
  - Rare resources (T4-T5) × 20
  - Average richness × 5
- Used in territory control analysis

---

## 🚀 Getting Started Checklist

- [ ] Start server (double-click START-SERVER.bat)
- [ ] Open browser to http://localhost:8000
- [ ] Explore each explorer from home page
- [ ] Try filtering and searching in each explorer
- [ ] Click analytics tabs to see data insights
- [ ] Click on cards/rows to see detailed modals
- [ ] Try Ship Explorer configuration comparison
- [ ] Use ClaimStake Construction planner
- [ ] Review analytics for strategic planning
- [ ] Save favorite configurations

---

## 📞 Support

### For Issues:
1. Check browser console (F12 → Console tab)
2. Verify data files are present in `/Data/` folder
3. Try hard refresh (Ctrl+Shift+R)
4. Check this guide for troubleshooting section
5. Review specific explorer documentation

### For Questions:
- Check `/Documentation/` folder for detailed guides
- Review test suite in `/Test/` for usage examples
- Examine source code - well-commented throughout

---

**Last Updated:** 2025-10-13
**Version:** 2.0
**Explorers:** 6 (Planet, Recipe, Resources, ClaimStake, Hub, Ship)
**Analytics:** 6 major features
**Test Coverage:** 216 tests across 35 suites

---

🎯 **Ready to explore the Star Atlas economy!** 🚀
