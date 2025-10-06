# Resource Mapping Analysis: planets.json → resources.json

## Executive Summary

Successfully mapped 93 unique resource types from `planets.json` to their tier classifications in `resources.json`. The mapping reveals a clear resource distribution pattern across 3,901 planets.

## 1. Resource Type to Tier Mapping

### Complete Type → Tier Mapping Table

| Type | Resource Name | Tier | Resource ID |
|------|---------------|------|-------------|
| **TIER 5 RESOURCES (8 types)** |
| 20 | Beryllium Crystals | 5 | beryllium-crystals |
| 33 | Fusion Catalyst Deposits | 5 | fusion-catalyst-deposits |
| 43 | Jasphorus Crystals | 5 | jasphorus-crystals |
| 46 | Living Metal Symbionts | 5 | living-metal-symbionts |
| 48 | Lunar Echo Crystals | 5 | lunar-echo-crystals |
| 64 | Quantum Particle | 5 | quantum-particle |
| 67 | Resonium Ore | 5 | resonium-ore |
| 78 | Strontium Crystals | 5 | strontium-crystals |
| **TIER 4 RESOURCES (9 types)** |
| 15 | Abyssal Energy Crystals | 4 | abyssal-energy-crystals |
| 28 | Dodiline Crystals | 4 | dodiline-crystals |
| 30 | Dysprosium Ore | 4 | dysprosium-ore |
| 35 | Germanium Ore | 4 | germanium-ore |
| 38 | Hicenium Crystals | 4 | hicenium-crystals |
| 41 | Iridium Ore | 4 | iridium-ore |
| 63 | Quantum Computational Substrate | 4 | quantum-computational-substrate |
| 69 | Rhodium Ore | 4 | rhodium-ore |
| 93 | Zirconium Ore | 4 | zirconium-ore |
| **TIER 3 RESOURCES (24 types)** |
| 12 | Frostcore Bryophyte | 3 | frostcore-bryophyte |
| 13 | Mind Shade Fungus | 3 | mind-shade-fungus |
| 14 | Aegis Barrier Cactus | 3 | aegis-barrier-cactus |
| 19 | Bathysphere Pearls | 3 | bathysphere-pearls |
| 26 | Cryo Formation Crystals | 3 | cryo-formation-crystals |
| 27 | Diamond | 3 | diamond |
| 29 | Drywater | 3 | drywater |
| 31 | Emerald Crystals | 3 | emerald-crystals |
| 36 | Gold Ore | 3 | gold-ore |
| 51 | Nanosil | 3 | nanosil |
| 53 | Neon | 3 | neon |
| 54 | Neural Coral Compounds | 3 | neural-coral-compounds |
| 58 | Palladium Ore | 3 | palladium-ore |
| 60 | Phase Shift Crystals | 3 | phase-shift-crystals |
| 61 | Plasma Containment Minerals | 3 | plasma-containment-minerals |
| 62 | Platinum Ore | 3 | platinum-ore |
| 66 | Raw Chisenic | 3 | raw-chisenic |
| 72 | Sapphire Crystals | 3 | sapphire-crystals |
| 80 | Tenon Gas | 3 | tenon-gas |
| 83 | Thermoplastic Resin | 3 | thermoplastic-resin |
| 85 | Titanium Ore | 3 | titanium-ore |
| 88 | Tungsten Ore | 3 | tungsten-ore |
| 89 | Vanadium Ore | 3 | vanadium-ore |
| 90 | Viscovite Crystals | 3 | viscovite-crystals |
| **TIER 2 RESOURCES (25 types)** |
| 2 | Blazing Snapdragon | 2 | blazing-snapdragon |
| 4 | Bioluminous Algae | 2 | bioluminous-algae |
| 6 | Spectral Lichen | 2 | spectral-lichen |
| 8 | Bastion Agave | 2 | bastion-agave |
| 9 | Swiftvine | 2 | swiftvine |
| 10 | Electric Fern | 2 | electric-fern |
| 11 | Temporal Flux Orchid | 2 | temporal-flux-orchid |
| 16 | Aluminum Ore | 2 | aluminum-ore |
| 18 | Argon | 2 | argon |
| 22 | Boron Ore | 2 | boron-ore |
| 32 | Fluorine Gas | 2 | fluorine-gas |
| 34 | Garnet Crystals | 2 | garnet-crystals |
| 37 | Hafnium Ore | 2 | hafnium-ore |
| 45 | Lithium Ore | 2 | lithium-ore |
| 49 | Manganese Ore | 2 | manganese-ore |
| 50 | Methane | 2 | methane |
| 57 | Oxygen | 2 | oxygen |
| 59 | Peridot Crystals | 2 | peridot-crystals |
| 70 | Rochinol | 2 | rochinol |
| 71 | Ruby Crystals | 2 | ruby-crystals |
| 73 | Scandium Ore | 2 | scandium-ore |
| 76 | Silver Ore | 2 | silver-ore |
| 82 | Thermodyne | 2 | thermodyne |
| 86 | Topaz Crystals | 2 | topaz-crystals |
| 91 | Xenon | 2 | xenon |
| **TIER 1 RESOURCES (27 types)** |
| 0 | Magmaroot | 1 | magmaroot |
| 1 | Pyroclast Energen | 1 | pyroclast-energen |
| 3 | Tidal Kelp | 1 | tidal-kelp |
| 5 | Shadowmoss | 1 | shadowmoss |
| 7 | Ironshell Cactus | 1 | ironshell-cactus |
| 17 | Arco | 1 | arco |
| 21 | Biomass | 1 | biomass |
| 23 | Carbon | 1 | carbon |
| 24 | Chromite Ore | 1 | chromite-ore |
| 25 | Copper Ore | 1 | copper-ore |
| 39 | Hydrogen | 1 | hydrogen |
| 42 | Iron Ore | 1 | iron-ore |
| 44 | Krypton | 1 | krypton |
| 47 | Lumanite | 1 | lumanite |
| 52 | Neodymium Ore | 1 | neodymium-ore |
| 55 | Nitrogen | 1 | nitrogen |
| 56 | Osmium Ore | 1 | osmium-ore |
| 65 | Quartz Crystals | 1 | quartz-crystals |
| 68 | Rhenium Ore | 1 | rhenium-ore |
| 74 | Silica | 1 | silica |
| 75 | Silicon Crystal | 1 | silicon-crystal |
| 77 | Sodium Crystals | 1 | sodium-crystals |
| 79 | Tantalum Ore | 1 | tantalum-ore |
| 81 | Thermal Regulator Stone | 1 | thermal-regulator-stone |
| 84 | Tin Ore | 1 | tin-ore |
| 87 | Tritium Ore | 1 | tritium-ore |
| 92 | Zinc Ore | 1 | zinc-ore |

## 2. Resource Distribution Summary

### By Tier
- **Tier 1**: 27 resource types (29%)
- **Tier 2**: 25 resource types (27%)
- **Tier 3**: 24 resource types (26%)
- **Tier 4**: 9 resource types (10%)
- **Tier 5**: 8 resource types (9%)

### By Planet Highest Tier
- **Tier 5 Planets**: 2,535 planets (65%)
- **Tier 4 Planets**: 991 planets (25%)
- **Tier 3 Planets**: 375 planets (10%)

## 3. Top Tier 5 Planets (Most T5 Resources)

| Rank | Planet Name | T5 Count | Total Resources | Tier Distribution |
|------|-------------|----------|-----------------|-------------------|
| 1 | 011-MUD-KING-01-P1 | 7 | 78 | T1:27, T2:22, T3:16, T4:6, T5:7 |
| 2 | 016-ONI-KING-01-P1 | 7 | 78 | T1:27, T2:22, T3:17, T4:5, T5:7 |
| 3 | 009-ONI-CORE-05-P1 | 7 | 69 | T1:25, T2:21, T3:13, T4:3, T5:7 |
| 4 | 008-ONI-SEC-08-P1 | 7 | 61 | T1:23, T2:18, T3:11, T4:2, T5:7 |
| 5 | 004-MUD-KING-01-P1 | 7 | 60 | T1:23, T2:18, T3:10, T4:2, T5:7 |
| 6 | 006-MUD-CORE-02-P1 | 7 | 60 | T1:23, T2:18, T3:10, T4:2, T5:7 |
| 7 | 006-UST-KING-01-P1 | 6 | 79 | T1:27, T2:22, T3:17, T4:7, T5:6 |
| 8 | 005-MUD-KING-01-P1 | 6 | 78 | T1:26, T2:24, T3:15, T4:7, T5:6 |
| 9 | 021-ONI-KING-01-P1 | 6 | 78 | T1:26, T2:24, T3:16, T4:6, T5:6 |
| 10 | 017-UST-KING-01-P1 | 6 | 78 | T1:26, T2:24, T3:14, T4:8, T5:6 |
| 11 | CSS-MUD-KING-01-P1 | 6 | 76 | T1:26, T2:23, T3:14, T4:7, T5:6 |
| 12 | 006-MUD-KING-01-P1 | 6 | 74 | T1:26, T2:21, T3:15, T4:6, T5:6 |
| 13 | 013-MUD-KING-01-P1 | 6 | 74 | T1:26, T2:21, T3:15, T4:6, T5:6 |
| 14 | 016-MUD-KING-01-P1 | 6 | 74 | T1:26, T2:21, T3:15, T4:6, T5:6 |
| 15 | 008-UST-KING-01-P1 | 6 | 74 | T1:26, T2:21, T3:14, T4:7, T5:6 |
| 16 | 020-UST-KING-01-P1 | 6 | 74 | T1:25, T2:24, T3:14, T4:5, T5:6 |
| 17 | 008-ONI-KING-01-P1 | 6 | 73 | T1:26, T2:21, T3:15, T4:5, T5:6 |
| 18 | 013-ONI-KING-01-P1 | 6 | 73 | T1:26, T2:21, T3:15, T4:5, T5:6 |
| 19 | 004-UST-KING-01-P1 | 6 | 72 | T1:25, T2:20, T3:14, T4:7, T5:6 |
| 20 | 010-UST-KING-01-P1 | 6 | 72 | T1:25, T2:20, T3:14, T4:7, T5:6 |

## 4. Top Tier 4 Planets (Highest Tier = 4)

| Rank | Planet Name | T4 Count | Total Resources | Tier Distribution |
|------|-------------|----------|-----------------|-------------------|
| 1-3 | CSS-UST-KING-01-P6, 004-UST-KING-01-P2/P7 | 3 | 22 | T1:10, T2:6, T3:3, T4:3 |
| 4-20 | Various UST planets | 3 | 22 | T1:10, T2:6, T3:3, T4:3 |

## 5. Top Tier 3 Planets (Highest Tier = 3)

| Rank | Planet Name | T3 Count | Total Resources | Tier Distribution |
|------|-------------|----------|-----------------|-------------------|
| 1-20 | Various UST planets | 4 | 19 | T1:7, T2:8, T3:4 |

## 6. Key Insights

1. **Tier 5 Resources are Rare**: Only 8 resource types (9% of all resources) are Tier 5
   - Beryllium Crystals (Type 20)
   - Fusion Catalyst Deposits (Type 33)
   - Jasphorus Crystals (Type 43)
   - Living Metal Symbionts (Type 46)
   - Lunar Echo Crystals (Type 48)
   - Quantum Particle (Type 64)
   - Resonium Ore (Type 67)
   - Strontium Crystals (Type 78)

2. **Most Planets Have High-Tier Resources**: 65% of all planets (2,535 out of 3,901) have at least one T5 resource

3. **Best T5 Planets**: The top 6 planets have 7 different T5 resources each, which is 87.5% of all available T5 resources

4. **Faction Patterns**:
   - MUD, ONI, and UST factions all have KING-tier planets with maximum T5 resources
   - UST faction dominates T4 and T3 planet categories

5. **Resource Richness vs Quantity**: The analysis shows "richness" values but focuses on resource type availability. Top planets have both high tier diversity AND high total resource counts (60-79 total resources)

## 7. Usage Guide

### Programmatic Access
The complete mapping is available in: `C:/Users/khawa/Desktop/Siphawaal.xyz/resource_tier_analysis.json`

**Structure:**
```json
{
  "type_to_tier_mapping": {
    "20": {
      "tier": 5,
      "name": "Beryllium Crystals",
      "id": "beryllium-crystals"
    },
    ...
  },
  "tier_summary": { ... },
  "planets_by_highest_tier": { ... }
}
```

### Quick Lookup Function (JavaScript/TypeScript)
```javascript
// Example: Get tier from resource type number
const typeToTierMap = {
  20: 5,  // Beryllium Crystals
  33: 5,  // Fusion Catalyst Deposits
  30: 4,  // Dysprosium Ore
  // ... etc
};

function getResourceTier(typeNumber) {
  return typeToTierMap[typeNumber] || null;
}
```

### Finding Best Planets for Specific Tiers
- **T5 Resources**: Focus on MUD-KING, ONI-KING, and UST-KING planets with "-P1" suffix
- **T4 Resources**: Look for UST-KING and UST-SEC planets with P2-P7 suffixes
- **T3 Resources**: UST-KING, UST-SEC, and UST-CORE planets

## Files Generated
1. **resource_tier_analysis.json** - Complete JSON mapping with all data
2. **RESOURCE_MAPPING_ANALYSIS.md** - This comprehensive analysis document
