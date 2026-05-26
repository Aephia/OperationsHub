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

## 📂 Explorer Applications

### 1. 🪐 **Planet Explorer**
Discover and analyze 3,901 planets across all star systems

**Features:**
- Filter by faction (MUD, ONI, USTUR) and planet type
- View detailed planet resources with tier badges
- **Manufacturing Tab:** Top manufacturing planets by self-sufficiency score
- **Territory Tab:** Strategic system analysis and faction dominance

**Use Case:** Finding the best planets for manufacturing specific goods or identifying strategic territories

---

### 2. 🧪 **Recipe Explorer**
Explore 247 manufacturing recipes and production chains

**Features:**
- Filter by category (Infrastructure, Processing, Ship Components)
- Tier-based filtering (T1-T5)
- **Analytics Tab:** Recipe complexity and dependency analysis
- **Manufacturing Chain:** Visualize full production chains

**Use Case:** Planning production strategies and identifying supply chain bottlenecks

---

### 3. 💎 **Resources Explorer**
Analyze 93 resource types, values, and supply chains

**Features:**
- Filter by tier, category (Raw, Processed, Organic), and source type
- **Resource Flow Tab:** Critical resources dashboard with bottleneck detection
- Supply chain depth analysis (0-N processing steps)

**Use Case:** Understanding resource economics and planning extraction operations

---

### 4. 🏗️ **ClaimStake Explorer**
Plan claim stake construction and analyze building efficiency

**Features:**
- Browse 100+ building types with filtering
- **Building Analytics:** Tier distribution and resource requirements
- **Recipe-Based ClaimStake Optimizer:** Find optimal planet placement for any recipe
  - Analyzes raw material availability and processing chains
  - Identifies single-planet craftable items (🔨 icon)
  - Detects multi-planet cooperation needs (🔗 icon)
  - Ranks regions by coverage score and proximity
  - Color-coded resources (🟢 raw, 🟠 processed)
- **Construction Tab:** Build facility plans with slot/power validation
  - Slot limits: T1=4, T2=32, T3=108, T4=256, T5=500
  - Power requirements: T1=100, T2=200, T3=300, T4=400, T5=500
  - Export plans as JSON

**Use Case:** Optimizing claim stake layouts and identifying strategic manufacturing locations

---

### 5. 🏠 **Hub Explorer**
Plan and optimize space hub construction

**Features:**
- Habitat tier progression (T1-T5)
- Crafting station efficiency calculations
- Cargo storage capacity planning

**Use Case:** Designing efficient space hub configurations

---

### 6. 🚢 **Ship Explorer**
Compare ships, analyze configurations, and plan fleets

**Features:**
- Multi-ship side-by-side comparison (67 ships available)
- Real-time stat calculations with component modifiers
- 40+ tracked stats (cargo, combat, travel, mining, scanning, repair)
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
- 247 recipes
- 93 resources
- 100+ buildings
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

4. **Recipe-Based Optimization** (ClaimStake Explorer)
   - Optimal planet placement for recipes
   - Raw material proximity analysis
   - Multi-planet vs single-planet detection
   - Regional coverage and proximity scoring

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
npm run refresh
# or
cd RefreshData && node refresh-data.js
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
│   ├── recipes-data.js                 # 247 recipes (4.7 MB)
│   ├── buildings-data.js               # 100+ buildings (2.4 MB)
│   ├── planet-data.js                  # 3,901 planets (14 MB)
│   ├── resources-data.js               # 93 resources (864 KB)
│   ├── ships-data.js + .json           # 67 ships (12 MB each)
│   ├── crafting-hab-data.js            # Hub buildings
│   ├── ship-formulas-data.js           # Ship formulas (5.6 MB)
│   ├── ship-components-data.js         # Ship components (8.2 MB)
│   ├── resource-tier-data.js           # Resource tier analysis
│   └── REFRESH-REPORT.json             # Validation report
│
├── JSON/                               # Raw JSON source files
├── RefreshData/                        # Data processing pipeline
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

### Recipe-Based ClaimStake Optimizer
One of the most powerful features - find the best planet(s) to manufacture any item:

1. Search for any recipe (e.g., "Basic Hydraulics")
2. System analyzes:
   - Raw material locations (🟢 green tags)
   - Processed ingredient locations (🟠 orange tags)
   - Single-planet craftability (🔨 hammer icon)
   - Multi-planet requirements (🔗 chain icon)
3. Ranks regions by:
   - Coverage score (% of resources available)
   - Proximity score (planets closer together)
4. Shows top 10 optimal regions with detailed breakdowns

**Example Use Cases:**
- "Where can I craft Electromagnetic Fuses?"
- "Which planets have all materials for Ship Shields?"
- "What regions support multi-stage component manufacturing?"

---

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
- Star Atlas game data (October 2025)
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

**Last Updated:** November 19, 2025
**Version:** 2.1
**Status:** Production Ready 🚀

---

🎯 **Ready to explore the Star Atlas economy!** 🌌
