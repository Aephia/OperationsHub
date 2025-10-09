# Ship Configuration System Documentation

## Overview
This document explains how Star Atlas ship configurations modify base ship stats through component installations. The system is based on the Star Atlas Ship Config Lite tool.

---

## Core Concepts

### 1. **Base Stats vs Modified Stats**
- **Base Stats**: Default ship statistics from `ships-data.json`
- **Modified Stats**: Stats after applying component modifiers from configurations

### 2. **Component Categories**
Components are organized into categories:
- **Ship Component**: Core systems (Engine, Shields, Cargo, etc.)
- **Ship Module**: Additional modules
- **Ship Weapons**: Weapons by damage type
- **Countermeasures**: Defensive systems
- **Missiles**: Missile systems
- **Drones**: Drone units

### 3. **Component Properties**
Each component has:
- **Class**: Size tier (XXS, XS, S, M, L, CAP, CMD, Class 8, TTN)
- **Tier**: Tech level (T1-T5)
- **Type**: Specific component type (varies by category)
- **Attributes**: Stat modifiers

---

## Stat Modification System

### Stat Types

There are **3 types** of stat modifications:

#### 1. **MULTIPLICATIVE** (`×`)
```javascript
finalStat = baseStat × multiplier
```
- Default type for most stats
- Example: `baseStat = 100, multiplier = 1.5 → finalStat = 150`

#### 2. **ADDITIVE** (`+`)
```javascript
finalStat = baseStat + additiveValue
```
- Flat value additions
- Example: `baseStat = 100, additive = 50 → finalStat = 150`

#### 3. **BOTH** (`±`)
```javascript
finalStat = (baseStat + additive) × multiplier
```
- Combines both methods
- Example: `baseStat = 100, additive = 20, multiplier = 1.5 → finalStat = 180`

### Stat Object Structure

```javascript
{
  type: 'multiplicative' | 'additive' | 'both',
  baseValue: 1.0,              // Base multiplier/value
  multiplicativeValue: 1.0,    // Multiplier component
  additiveValue: 0,            // Additive component
  values: {},                  // Scaled values by class-tier
  scaledValue: 1.2             // Final scaled value for specific class-tier
}
```

---

## Scaling Formulas

### Class Scaling
Components scale based on ship class size:

```javascript
const classScalingFormulas = {
  default: "base * pow(pow(1.61803398875, classIndex+1) / 2.2360679775, 2)"
};

const classMap = {
  "XXS": 1, "XS": 2, "S": 3, "M": 4, "L": 5,
  "CAP": 6, "CMD": 7, "Class 8": 8, "TTN": 9
};
```

**Example**: XXS (index=1) vs M (index=4)
- XXS multiplier: ~2.62
- M multiplier: ~11.09

### Tier Scaling
Components scale based on tech tier:

```javascript
const tierScalingFormulas = {
  default: "base * (pow(1.61803398875, tierIndex) / 2.2360679775)"
};

const tierMap = {
  "T1": 1, "T2": 2, "T3": 3, "T4": 4, "T5": 5
};
```

**Example**: T1 vs T5
- T1 multiplier: ~0.724
- T5 multiplier: ~3.146

### Combined Scaling
```javascript
// For multiplicative bonuses:
baseBonus = baseMultiplier - 1.0
scaledBonus = applyClassScaling(baseBonus, className)
scaledBonus = applyTierScaling(scaledBonus, tierName)
finalMultiplier = 1.0 + scaledBonus

// For additive values:
scaledAdditive = applyClassScaling(baseAdditive, className)
scaledAdditive = applyTierScaling(scaledAdditive, tierName)
```

---

## Calculation Flow

### Step 1: Collect Component Effects

```javascript
// For each installed component
componentIds.forEach(componentId => {
  const component = findComponentById(componentId);
  const className = component.properties.Class;  // e.g., "M"
  const tierName = component.properties.Tier;    // e.g., "T1"

  // Look up component attributes
  const attributes = componentAttributes[category][groupName];

  // For each stat this component affects
  Object.keys(attributes).forEach(statName => {
    const statValue = findStatValueInTree(attributes, component, statName, className, tierName, category);

    // Store effect with metadata
    statEffects[statName].push({
      multiplier: statValue.multiplicativeValue || 1.0,
      additive: statValue.additiveValue || 0,
      type: statValue.type || 'multiplicative',
      componentId: componentId,
      componentName: component.name,
      className: className,
      tierName: tierName
    });
  });
});
```

### Step 2: Group Effects

Components of the same type are grouped to handle stacking:

```javascript
const groupedEffects = {};
statEffects[statName].forEach(effect => {
  const key = `${effect.category}-${effect.groupName}-${effect.componentType}-${effect.type}`;

  if (!groupedEffects[key]) {
    groupedEffects[key] = {
      multiplier: effect.multiplier,
      additive: effect.additive,
      type: effect.type,
      count: 1
    };
  } else {
    groupedEffects[key].count++;
  }
});
```

### Step 3: Apply Stacking Rules

#### Additive Stacking (Linear)
```javascript
totalAdditive = 0;
groupedEffects.forEach(group => {
  if (group.type === 'additive' || group.type === 'both') {
    totalAdditive += group.count * group.additive;
  }
});
```

#### Multiplicative Stacking (Compound or Linear)

**Compound Mode** (default):
```javascript
totalMultiplier = 1.0;
groupedEffects.forEach(group => {
  if (group.type === 'multiplicative' || group.type === 'both') {
    for (let i = 0; i < group.count; i++) {
      totalMultiplier *= group.multiplier;
    }
  }
});
```

**Linear Mode**:
```javascript
totalBonus = 0;
groupedEffects.forEach(group => {
  if (group.type === 'multiplicative' || group.type === 'both') {
    const bonus = group.multiplier - 1.0;
    totalBonus += group.count * bonus;
  }
});
totalMultiplier = 1.0 + totalBonus;
```

### Step 4: Calculate Final Stats

```javascript
// For each stat
Object.keys(statEffects).forEach(statName => {
  const baseValue = ship[statName];

  // Calculate totals
  let totalAdditive = 0;
  let totalMultiplier = 1.0;
  // ... (from Step 3)

  // Apply based on primary type
  if (hasBothTypes) {
    // Both types present: add first, then multiply
    modifiedStats[statName] = (baseValue + totalAdditive) * totalMultiplier;
  } else if (hasAdditiveOnly) {
    // Only additive
    modifiedStats[statName] = baseValue + totalAdditive;
  } else {
    // Only multiplicative
    modifiedStats[statName] = baseValue * totalMultiplier;
  }
});
```

---

## Configuration Tier Upgrade

### Automatic Component Upgrade
When upgrading a configuration to the next tier:

```javascript
function findUpgradedComponent(componentId, ship) {
  const currentComponent = findComponentById(componentId);
  const currentTier = currentComponent.properties.Tier;  // e.g., "T1"
  const nextTier = getNextTier(currentTier);              // → "T2"

  // Find component with same properties but next tier
  const upgradedComponent = compatibleComponents.find(comp => {
    return comp.properties.Class === currentComponent.properties.Class &&
           comp.properties.Tier === nextTier &&
           isSameComponentType(currentComponent, comp);
  });

  return upgradedComponent?.id || null;
}

const tierMap = {
  'T1': 'T2',
  'T2': 'T3',
  'T3': 'T4',
  'T4': 'T5',
  'T5': null  // Max tier
};
```

---

## Example Calculation

### Scenario: Busan Pulse with Tier One Config

**Base Stats:**
```javascript
{
  cargo_capacity: 249,
  fuel_capacity: 450,
  subwarp_speed: 0.0086,
  warp_speed: 0.1
}
```

**Installed Components:**
```javascript
{
  "Ship Component": {
    "Cargo": "cargo-m-t1",     // M class, Tier 1
    "Engine": "engine-m-t1"     // M class, Tier 1
  }
}
```

**Component Attributes:**
```javascript
// Cargo M-T1
{
  cargo_capacity: {
    type: 'multiplicative',
    baseValue: 1.2,  // +20% base bonus
    scaledValue: 1.186  // After class/tier scaling
  }
}

// Engine M-T1
{
  subwarp_speed: {
    type: 'multiplicative',
    baseValue: 1.3,
    scaledValue: 1.277
  },
  fuel_capacity: {
    type: 'multiplicative',
    baseValue: 2.0,
    scaledValue: 1.98
  }
}
```

**Calculations:**
```javascript
// cargo_capacity
modifiedStats.cargo_capacity = 249 * 1.186 = 295.314 (~295.81 displayed)

// fuel_capacity
modifiedStats.fuel_capacity = 450 * 1.98 = 891

// subwarp_speed
modifiedStats.subwarp_speed = 0.0086 * 1.277 = 0.010982 (~0.0103 displayed)

// warp_speed (no component affecting it)
modifiedStats.warp_speed = 0.1 (unchanged)
```

**Percentage Changes:**
```javascript
cargo_capacity: +18.6%   // (295.81 - 249) / 249 = 0.186
fuel_capacity: +98.0%    // (891 - 450) / 450 = 0.98
subwarp_speed: +19.8%    // (0.0103 - 0.0086) / 0.0086 = 0.198
```

---

## UI Display

### Visual Indicators

**Color Coding:**
```javascript
if (percentChange > 0) {
  color = '#4CAF50';  // Green - stat increased
} else if (percentChange < 0) {
  color = '#ff6b6b';  // Red - stat decreased
} else {
  color = '#3d8bf8';  // Blue - neutral (components present but no change)
}

if (Math.abs(percentChange) > 100) {
  color = '#FFD700';  // Gold - large change
  fontWeight = 'bold';
}
```

### Stat Display Format
```
┌─────────────────┬──────────┬──────────────────┐
│ Stat Name       │ BASE     │ TIER ONE         │
├─────────────────┼──────────┼──────────────────┤
│ cargo_capacity  │   249    │   295.812        │
│                 │          │   +18.8% (green) │
├─────────────────┼──────────┼──────────────────┤
│ fuel_capacity   │   450    │   891            │
│                 │          │   +98.0% (green) │
└─────────────────┴──────────┴──────────────────┘
```

---

## Implementation Checklist for ShipExplorer

### Data Requirements
- [ ] Component definitions with tier/class properties
- [ ] Component attribute mappings (stat modifiers)
- [ ] Ship configuration data structure
- [ ] Scaling formula constants

### Core Functions
- [ ] `findComponentById(id)` - Look up component
- [ ] `calculateModifiedStats(ship, config)` - Main calculation
- [ ] `findStatValueInTree(attributes, component, statName)` - Lookup modifier
- [ ] `applyScaling(baseValue, className, tierName)` - Scale values
- [ ] `groupEffects(statEffects)` - Group duplicate components
- [ ] `applyStacking(groupedEffects, mode)` - Handle stacking

### UI Components
- [ ] Configuration dropdown (Tier selector)
- [ ] Base vs Modified stat columns
- [ ] Percentage change indicators
- [ ] Color-coded stat differences
- [ ] Component list display
- [ ] Upgrade configuration button

### Features
- [ ] Real-time stat recalculation
- [ ] Multiple configuration comparison
- [ ] Configuration tier upgrade
- [ ] Export/import configurations
- [ ] Stat breakdown tooltip (show which components affect each stat)

---

## Key Formulas Summary

| Formula Type | Expression |
|--------------|------------|
| **Multiplicative** | `finalStat = baseStat × multiplier` |
| **Additive** | `finalStat = baseStat + additive` |
| **Both** | `finalStat = (baseStat + additive) × multiplier` |
| **Class Scaling** | `base × pow(pow(φ, classIndex+1) / √5, 2)` |
| **Tier Scaling** | `base × (pow(φ, tierIndex) / √5)` |
| **Compound Stacking** | `totalMultiplier = ∏ multipliers` |
| **Linear Stacking** | `totalBonus = Σ(multipliers - 1)` |

*φ (phi) = 1.61803398875 (Golden Ratio)*
*√5 = 2.2360679775*

---

## Configuration Data Structure

```javascript
{
  name: "Tier One",
  components: {
    "Ship Component": {
      "Cargo": "component-id-123",
      "Engine": "component-id-456",
      "Shields": ""  // Empty = not installed
    },
    "Ship Weapons": {
      "Kinetic": ["weapon-id-1", "weapon-id-2"]  // Array = multiple slots
    }
  }
}
```

---

## Notes

- The golden ratio (φ = 1.618...) is used for scaling to create exponential growth
- Components of the same type can stack either linearly or multiplicatively
- Tier 1 provides ~72% of base value, Tier 5 provides ~315%
- Class scaling is quadratic, tier scaling is linear
- "Both" type stats apply additive first, then multiplicative
