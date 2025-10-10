# Ship Explorer - Multi-Ship Comparison Tool

A comprehensive multi-ship stat comparison tool inspired by the Star Atlas Ship Config Lite application. Compare multiple ships side-by-side with different configuration tiers and see real-time stat modifications.

## Features

### ✅ Fully Implemented

- **Multi-Ship Comparison**: Add unlimited ships for side-by-side comparison
- **Tier Selection**: Choose from 6 configuration tiers per ship:
  - Base (no config)
  - Tier One
  - Tier Two
  - Tier Three
  - Combat Build
  - Cargo Hauler
- **Real-time Calculations**: Modified stats calculated instantly with percentage changes
- **Color-coded Changes**:
  - Green for stat increases
  - Red for stat decreases
  - Gold for large changes (>100%)
- **Stat Filtering**: Search/filter stats by name in real-time
- **Ship Management**:
  - Add ships from complete database (67 ships)
  - Remove ships individually
  - Copy ship configurations
  - Search ships by name/manufacturer
- **Save/Load Configurations**: Export and import your comparison setups as JSON
- **Comprehensive Stats**: 40+ ship statistics across all categories:
  - Capacities (cargo, fuel, ammo)
  - Mining rates (asteroid mining)
  - Travel (warp, subwarp, fuel consumption)
  - Scanning (power, cooldown, cost)
  - Combat (damage, shields, armor, stealth, missiles)
  - Repair (cost, rate, efficiency)

## Quick Start

1. **Open the Tool**
   ```
   Open ShipExplorer/index.html in your browser
   ```

2. **Add Ships**
   - Click "+ Add Ship" button in left panel
   - Search for ships by name or manufacturer
   - Click on a ship to add it to comparison

3. **Select Configuration Tier**
   - Use dropdown in each ship card
   - Choose from Base, Tier One-Three, Combat, or Cargo
   - Stats update automatically in real-time

4. **View Comparison**
   - Base values shown in gray
   - Modified values shown in color:
     - Green = increased
     - Red = decreased
     - Percentage change displayed
   - Sticky headers for easy navigation

5. **Filter Stats**
   - Use search box at top of stat table
   - Type stat name (e.g., "cargo", "warp", "shield")
   - Table filters instantly

6. **Ship Actions**
   - **⚙ Components**: Open component panel (placeholder)
   - **📋 Copy**: Duplicate ship with current config
   - **×**: Remove ship from comparison

## Configuration System

### Golden Ratio Scaling

Uses authentic Star Atlas scaling formulas with the golden ratio (φ = 1.618...):

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
finalStat = baseStat × classMultiplier × tierMultiplier
```

### Stat Types

1. **Multiplicative** (`×`): Percentage-based bonuses
   - Example: Engine +30% warp speed
   - Formula: `finalStat = baseStat × multiplier`

2. **Additive** (`+`): Flat value additions
   - Example: Cargo Extension +100 m³
   - Formula: `finalStat = baseStat + additiveValue`

3. **Both** (`±`): Combined effects
   - Formula: `finalStat = (baseStat + additive) × multiplier`

### Preset Configurations

| Config | Components | Focus | Typical Changes |
|--------|-----------|-------|-----------------|
| **Tier One** | Cargo (M-T1), Engine (M-T1) | Basic upgrades | +18-20% cargo, +98% fuel |
| **Tier Two** | +Shields (M-T2) | Balanced + defense | Higher % than T1, shields active |
| **Tier Three** | +Armor (M-T3) | Advanced all-around | Significant increases across board |
| **Combat Build** | Shields, Armor, 3× Weapons (M-T2) | Maximum combat | +50 damage, +40-50% defense |
| **Cargo Hauler** | Cargo, 2× Extensions (M-T2) | Maximum cargo | +200-400 cargo capacity |

## File Structure

```
ShipExplorer/
├── index.html              # Main application HTML
├── app.js                  # Application logic (650 lines)
├── styles.css              # Dark theme styling (615 lines)
├── config-calculator.js    # Calculation engine (375 lines)
├── README.md              # This file
├── README-CONFIG.md       # Detailed config system docs
└── SHIP-CONFIG-SYSTEM.md  # Technical documentation

Dependencies:
├── ../Data/ships-data.js            # Ship database (67 ships)
├── ../Data/component-attributes.js  # Component definitions
└── config-calculator.js             # Shared calculation engine
```

## Save/Load System

**Save Configuration:**
1. Click "Save Configs" button
2. Downloads JSON file with timestamp
3. Includes all ships and tier selections

**Load Configuration:**
1. Click "Load Configs" button
2. Select previously saved JSON file
3. Ships and configurations restored

**File Format:**
```json
{
  "ships": [
    {
      "shipId": "busan-pulse-busan",
      "shipName": "Busan Pulse",
      "config": "Tier One"
    }
  ],
  "timestamp": "2025-10-08T12:00:00.000Z"
}
```

## UI Components

### Ship Card (Left Panel)
- **Header**: Ship name with remove button (×)
- **Info**: Manufacturer and class
- **Tier Selector**: Dropdown for configuration
- **Actions**: Component panel and copy buttons

### Stat Table (Main Area)
- **Sticky Column Headers**: Ship names stay visible when scrolling vertically
- **Sticky Row Headers**: Stat names stay visible when scrolling horizontally
- **Base Values**: Original ship stats (gray)
- **Modified Values**: Config-adjusted stats (colored)
- **Change Percentage**: Exact modification amount

### Component Panel (Right Slide-in)
- Opens from right side
- Will allow individual component selection
- Currently shows placeholder

## Color Scheme

| Element | Color | Usage |
|---------|-------|-------|
| Primary Gold | `#f0a040` | Headers, highlights, active states |
| Background Dark | `#1a1a1a` | Main background |
| Panel Dark | `#1f1f1f` | Panels and cards |
| Border | `#2a2a2a` | Separators and borders |
| Text Primary | `#e0e0e0` | Main text |
| Text Secondary | `#888` | Labels and secondary info |
| Stat Increased | `#4CAF50` | Green for positive changes |
| Stat Decreased | `#ff6b6b` | Red for negative changes |

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ IE11 (not supported)

## Performance

- **Optimized Rendering**: Only re-renders changed components
- **Efficient Calculations**: Cached stat calculations
- **Smooth Scrolling**: Hardware-accelerated with sticky positioning
- **Instant Filtering**: Real-time stat search

## Keyboard Shortcuts (Coming Soon)

Planned shortcuts:
- `Ctrl+S`: Save configs
- `Ctrl+O`: Load configs
- `Escape`: Close modals/panels
- `Ctrl+F`: Focus stat filter

## Known Limitations

1. **Component Management**: Placeholder only (custom component selection coming)
2. **Custom Configs**: Can't create configs beyond 6 presets
3. **Stat Sorting**: Can filter but not sort by value
4. **Mobile**: Optimized for desktop (mobile support planned)
5. **Export**: No PDF/CSV export yet

## Troubleshooting

### Ships Not Loading
- Check browser console for errors
- Verify `ships-data.js` path in HTML
- Ensure file is loaded before app.js

### Stats Not Calculating
- Verify `config-calculator.js` is loaded
- Check `component-attributes.js` is present
- Review browser console for errors

### Percentage Shows NaN
- Base stat may be 0 or null
- Check ship data structure
- Verify stat key path is correct

### Save/Load Not Working
- Check browser allows file downloads
- Verify JSON file format if loading fails
- Try different browser if issues persist

## Future Enhancements

### Phase 2 (Next Update)
- [ ] Full component management system
- [ ] Individual component selection per ship
- [ ] Component slot restrictions by ship class
- [ ] Visual component builder
- [ ] Component compatibility checking

### Phase 3
- [ ] Stat tooltips showing component breakdown
- [ ] Comparison analytics dashboard
- [ ] Fleet composition analyzer
- [ ] Total cost calculator
- [ ] Stat sorting (ascending/descending)

### Phase 4
- [ ] Mobile responsive design
- [ ] Dark/light theme toggle
- [ ] Export to PDF/CSV
- [ ] Keyboard shortcuts
- [ ] Multi-language support

## Customization

### Adding New Configurations

Edit `component-attributes.js`:

```javascript
SampleConfigurations["My Custom Build"] = {
    name: "My Custom Build",
    tier: "T3",
    components: {
        "Ship Component": {
            "Cargo": "cargo-l-t3",
            "Engine": "engine-l-t3",
            "Shields": "shields-l-t3"
        },
        "Ship Weapons": {
            "Kinetic": ["kinetic-l-t3", "kinetic-l-t3"]
        }
    }
};
```

Then update tier dropdown in `app.js` (createShipCard method).

### Adding New Component Types

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

## Credits

- **Inspired by**: [Star Atlas Ship Config Lite](https://ses.staratlas.com/Ship%20Config%20Lite/)
- **Data Source**: Star Atlas ship specifications
- **Fonts**: Rajdhani & Orbitron (Google Fonts)
- **Built with**: Vanilla JavaScript (no frameworks)
- **Calculation System**: Golden ratio scaling formulas

## Version History

- **v2.0.0** (2025-10-08)
  - Complete redesign as ship comparison tool
  - Multi-ship side-by-side comparison
  - 6 preset configurations
  - 40+ stats tracked
  - Save/load functionality
  - Real-time filtering

- **v1.0.0** (2025-10-07)
  - Initial ship explorer release
  - Single ship modal view
  - Basic tier selection

## Documentation

- **[README-CONFIG.md](README-CONFIG.md)** - User-friendly configuration guide
- **[SHIP-CONFIG-SYSTEM.md](SHIP-CONFIG-SYSTEM.md)** - Technical system documentation
- **[config-calculator.js](config-calculator.js)** - Calculation engine source

---

**Last Updated**: 2025-10-08
**Author**: Claude with Anthropic
**License**: MIT
**Homepage**: [Siphawaal.xyz](../index.html)
