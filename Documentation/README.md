# Documentation Directory

## 📚 Main Documentation

### [USER-GUIDE.md](USER-GUIDE.md) ⭐ START HERE
**Complete user guide for all explorers and analytics**
- Quick start instructions
- All 7 explorers explained
- All 6 analytics features documented
- Common use cases and pro tips
- Troubleshooting guide
- Technical details

### [ANALYTICS-OVERVIEW.md](ANALYTICS-OVERVIEW.md)
**Analytics system architecture and design**
- CrossExplorerAnalytics engine overview
- Data flow and caching
- Performance optimization
- Design patterns

### [CROSS-EXPLORER-ANALYTICS-GUIDE.md](CROSS-EXPLORER-ANALYTICS-GUIDE.md)
**Detailed analytics implementation guide**
- Step-by-step implementation for each analytics feature
- Code examples and patterns
- Integration instructions
- Best practices

### [IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md)
**Current feature status and testing checklist**
- Completed features (5 of 12)
- Implementation statistics
- Testing checklist
- Known issues and next steps

### [GaliaViewer-README.md](GaliaViewer-README.md)
**3D visualization system documentation**
- Galia Viewer features
- Configuration options
- Performance settings
- WebGL effects

---

## 🔄 Data Pipeline Documentation

### RefreshData/
**Enhanced data validation and processing pipeline**

The RefreshData system transforms raw JSON files into validated, processed data files for all explorers.

**Key Documents:**
- `REFRESH-DATA-ANALYSIS.md` - Initial analysis and recommendations
- `IMPLEMENTATION-SUMMARY.md` - Complete implementation details
- `schemas/*.schema.json` - 9 JSON schemas for validation

**Features:**
- ✅ JSON Schema validation with Ajv
- ✅ Change detection with SHA-256 hashing
- ✅ Breaking change alerts
- ✅ Multi-part file processing
- ✅ Comprehensive validation reports
- ✅ Processes ALL 11 data files (recipes, buildings, planets, resources, ships, etc.)

**Usage:**
```bash
npm run refresh
# or
cd RefreshData && node refresh-data.js
```

**Output:**
- Validated data files in `Data/` directory
- Validation report: `Data/REFRESH-REPORT.json`
- CI/CD ready with exit code handling

See [RefreshData/IMPLEMENTATION-SUMMARY.md](../RefreshData/IMPLEMENTATION-SUMMARY.md) for complete details.

---

## 📂 Subdirectories

### Reference/
**Resource and technical reference materials**
- `QUICK_REFERENCE.md` - Resource tier lookup table
- `RESOURCE_MAPPING_ANALYSIS.md` - Detailed resource analysis

### Archive/
**Archived documentation (historical reference only)**
- `ANALYTICS-IMPLEMENTATION-SUMMARY.md` - Old implementation summary (superseded by IMPLEMENTATION-STATUS.md)

---

## 🏗️ Explorer-Specific Documentation

Some explorers have their own documentation in their folders:

### ShipExplorer/
- `README.md` - Ship Explorer overview
- `README-CONFIG.md` - Configuration system guide
- `SHIP-CONFIG-SYSTEM.md` - Technical documentation

---

## 📖 Documentation Updates

**Last Major Update:** 2025-10-13

### Recent Changes:
- ✅ Enhanced RefreshData system with validation, change detection, and reporting
- ✅ Created comprehensive USER-GUIDE.md
- ✅ Moved Ship Explorer docs to ShipExplorer/ folder
- ✅ Moved resource references to Reference/ subfolder
- ✅ Archived redundant documentation
- ✅ Organized directory structure

### Removed Features (No longer documented):
- ❌ Profitability Analytics (removed from ClaimStake Explorer - inaccurate calculations)
- ❌ Optimizer (removed from ClaimStake Explorer - not useful)
- ❌ Building Efficiency (removed from ClaimStake Explorer - not useful)

---

## 🎯 Quick Links

**For Users:**
→ Start with [USER-GUIDE.md](USER-GUIDE.md)

**For Developers:**
→ Read [ANALYTICS-OVERVIEW.md](ANALYTICS-OVERVIEW.md)
→ Then [CROSS-EXPLORER-ANALYTICS-GUIDE.md](CROSS-EXPLORER-ANALYTICS-GUIDE.md)

**For Status Updates:**
→ Check [IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md)

**For 3D Viewer:**
→ See [GaliaViewer-README.md](GaliaViewer-README.md)

---

## 📝 Contributing

When adding new documentation:
1. Place explorer-specific docs in explorer folders
2. Place general guides in Documentation/
3. Place reference materials in Documentation/Reference/
4. Update this README.md with links
5. Update USER-GUIDE.md if user-facing features change

---

**Documentation maintained by:** Claude with Anthropic
**Last Updated:** 2025-10-13
