# Ship Configuration System

## Overview

The Ship Configuration System allows you to see how different component loadouts modify base ship statistics. This implementation is based on the Star Atlas Ship Config Lite tool and uses the golden ratio (φ) for scaling calculations.

## Features

- **Tier Selection**: Choose from multiple configuration tiers (T1-T5)
- **Sample Configurations**: Pre-built configs for testing (Tier One, Tier Two, Tier Three, Combat Build, Cargo Hauler)
- **Real-time Calculation**: See modified stats instantly
- **Color-coded Changes**: Green for increases, red for decreases
- **Percentage Indicators**: Shows exact percentage change from base stats
- **Component Breakdown**: Lists installed components for each configuration

## Files

### Core System
- **config-calculator.js**: Main calculation engine
  - Scaling formulas (class and tier)
  - Stat modification logic
  - Stacking rules (compound/linear)

### Data Files
- **component-attributes.js**: Component definitions and stat modifiers
  - Ship components (Cargo, Engine, Shields, etc.)
  - Ship modules (extensions and upgrades)
  - Weapons, Countermeasures, Drones
  - Sample configurations

### UI Integration
- **explorer.js**: Updated with config UI
  - `setupTierSelector()`: Handles tier dropdown
  - `renderStatComparison()`: Displays base vs modified stats
  - Color-coded stat comparison table

### Styles
- **styles.css**: Added styles for:
  - `.config-tier-selector`: Tier selection dropdown
  - `.stat-comparison-table`: Comparison table
  - `.stat-increased/decreased/neutral`: Color classes
  - `.config-breakdown`: Component list display

### Documentation
- **SHIP-CONFIG-SYSTEM.md**: Complete technical documentation
  - Formulas and algorithms
  - Stat type system
  - Scaling calculations
  - Example calculations

## Usage

### In Ship Modal

1. Open any ship details (click on a ship card)
2. Look for "Configuration Tier Selector" section
3. Select a tier from the dropdown:
   - **Base (No Config)**: Shows original stats only
   - **Tier One**: Basic T1 components
   - **Tier Two**: Upgraded T2 components
   - **Tier Three**: Advanced T3 components
   - **Combat Build**: T2 combat-focused loadout
   - **Cargo Hauler**: T2 cargo-optimized loadout

4. View the comparison table:
   - **Stat**: Name of the ship statistic
   - **Base**: Original ship value
   - **Modified**: Value after applying config
   - **Change**: Percentage difference

5. Check the component breakdown:
   - Lists all installed components by category
   - Shows component counts for multi-slot items

## How It Works

### Scaling Formula

The system uses the golden ratio (φ = 1.618...) for exponential scaling:

**Class Scaling:**
```
multiplier = (φ^(classIndex+1) / √5)^2
```

**Tier Scaling:**
```
multiplier = φ^(tierIndex) / √5
```

**Combined:**
```
scaledValue = baseValue × classMultiplier × tierMultiplier
```

### Stat Types

1. **Multiplicative** (`×`): Percentage-based bonuses
   - Example: Engine gives +30% warp speed
   - Formula: `finalStat = baseStat × multiplier`

2. **Additive** (`+`): Flat value additions
   - Example: Cargo Extension adds +100 m³
   - Formula: `finalStat = baseStat + additiveValue`

3. **Both** (`±`): Combined effects
   - Formula: `finalStat = (baseStat + additive) × multiplier`

### Stacking

**Additive Stacking** (always linear):
```
totalAdditive = count × additiveValue
```

**Multiplicative Stacking** (compound mode):
```
totalMultiplier = multiplier1 × multiplier2 × ...
```

## Sample Configurations

### Tier One
- **Components**: Cargo (M-T1), Engine (M-T1)
- **Focus**: Basic upgrades to cargo and fuel
- **Expected Changes**: +18-20% cargo, +97-98% fuel capacity

### Tier Two
- **Components**: Cargo (M-T2), Engine (M-T2), Shields (M-T2)
- **Focus**: Balanced upgrades with defense
- **Expected Changes**: Higher percentages than T1, shields active

### Tier Three
- **Components**: Cargo (M-T3), Engine (M-T3), Shields (M-T3), Armor (M-T3)
- **Focus**: Advanced all-around performance
- **Expected Changes**: Significant stat increases across the board

### Combat Build
- **Components**: Engine (M-T2), Shields (M-T2), Armor (M-T2), 2× Kinetic (M-T2), Energy (M-T2)
- **Focus**: Maximum combat capability
- **Expected Changes**: +50 damage (additive from weapons), +40-50% shields/armor

### Cargo Hauler
- **Components**: Cargo (M-T2), Engine (M-T2), 2× Cargo Extension (M-T2)
- **Focus**: Maximum cargo capacity
- **Expected Changes**: +200-400 cargo (combined multiplicative + additive)

## Testing

Open `test-config.html` in a browser to run unit tests:
- Calculator initialization
- Scaling calculations
- Component attribute loading
- Modified stat calculations
- Comparison table generation

All tests should show green checkmarks (✓) if working correctly.

## Customization

### Adding New Components

Edit `component-attributes.js`:

```javascript
ComponentAttributes["Ship Component"]["NewComponent"] = {
    "capacities.cargoCapacity": {
        type: "multiplicative",
        baseValue: 1.5,  // +50% base
        multiplicativeValue: 1.5
    }
};
```

### Adding New Configurations

Edit `component-attributes.js`:

```javascript
SampleConfigurations["My Config"] = {
    name: "My Config",
    tier: "T3",
    components: {
        "Ship Component": {
            "Cargo": "cargo-m-t3",
            "Engine": "engine-m-t3"
        }
    }
};
```

Then add the option to the tier selector in `explorer.js`.

### Component ID Format

Component IDs must follow this pattern:
```
category-type-class-tier
```

Examples:
- `cargo-m-t1` → Cargo component, M class, Tier 1
- `engine-xs-t2` → Engine component, XS class, Tier 2
- `shields-cap-t5` → Shields component, CAP class, Tier 5

The calculator parses these IDs to extract class and tier for scaling.

## Known Limitations

1. **Simplified Component System**: Uses basic component IDs rather than full component database
2. **Class Assumption**: All sample configs use "M" class components
3. **No Dynamic Component Loading**: Components must be pre-defined in `component-attributes.js`
4. **Limited Stat Coverage**: Only shows commonly used stats in comparison table

## Future Enhancements

- [ ] Full component database integration
- [ ] Component slot system (limited slots per ship)
- [ ] Component compatibility checking (class restrictions)
- [ ] Save custom configurations
- [ ] Import/export configs
- [ ] Visual component builder
- [ ] Stat tooltips showing component contributions
- [ ] Multiple ship comparison with configs

## Troubleshooting

### Stats Not Changing
- Check browser console for errors
- Verify `component-attributes.js` is loaded
- Ensure component IDs match expected format

### Incorrect Calculations
- Verify base ship stats are numbers, not strings
- Check component attribute definitions
- Review scaling formula constants (PHI, SQRT5)

### UI Not Updating
- Clear browser cache
- Check cache version in `index.html`
- Verify event listeners are attached

## References

- [SHIP-CONFIG-SYSTEM.md](./SHIP-CONFIG-SYSTEM.md) - Complete technical documentation
- [Star Atlas Ship Config Lite](https://ses.staratlas.com/Ship%20Config%20Lite/) - Original implementation
- [Golden Ratio Wikipedia](https://en.wikipedia.org/wiki/Golden_ratio) - Mathematical background

---

**Version**: 1.0.0
**Last Updated**: 2025-10-08
**Author**: Claude with Anthropic
