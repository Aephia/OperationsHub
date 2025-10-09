class ShipConfigCalculator {
    constructor(options = {}) {
        this.PHI = 1.61803398875;
        this.SQRT5 = 2.2360679775;

        this.STAT_TYPES = {
            MULTIPLICATIVE: 'multiplicative',
            ADDITIVE: 'additive',
            BOTH: 'both'
        };

        this.classIndexMap = {
            XXXS: 0,
            XXS: 1,
            XS: 2,
            S: 3,
            M: 4,
            L: 5,
            CAP: 6,
            CMD: 7,
            'Class 8': 8,
            TTN: 9
        };

        this.tierIndexMap = {
            T1: 1,
            T2: 2,
            T3: 3,
            T4: 4,
            T5: 5
        };

        this.componentsById = {};
        this.componentAttributes = {};
        this.classScalingFormulas = {};
        this.tierScalingFormulas = {};
        this.statPathMap = {};
        this.statKeys = new Set();
        this.missingComponents = new Set();

        this.DEFAULT_CLASS_FORMULA = "base * pow( pow(1.61803398875 , classIndex+1) / 2.2360679775 , 2 )";
        this.DEFAULT_TIER_FORMULA = "base * ( pow(1.61803398875 , tierIndex) / 2.2360679775 )";

        this.multiplierStackingMode = options.multiplierStackingMode === 'compound' ? 'compound' : 'linear';
    }

    setData({
        componentsById = {},
        componentAttributes = {},
        classScalingFormulas = {},
        tierScalingFormulas = {},
        statPathMap = {},
        statKeys = [],
        multiplierStackingMode
    } = {}) {
        this.componentsById = {};

        Object.entries(componentsById).forEach(([id, info]) => {
            if (!id) return;
            const key = id.toString();
            this.componentsById[key] = {
                ...info,
                id: info.id ?? key,
                name: info.name ?? key,
                properties: info.properties || {},
                category: info.category || null,
                componentType: info.componentType || null,
                className: info.className || null,
                tierName: info.tierName || null
            };
        });

        this.componentAttributes = componentAttributes || {};
        this.classScalingFormulas = classScalingFormulas || {};
        this.tierScalingFormulas = tierScalingFormulas || {};
        this.statPathMap = statPathMap || {};

        if (Array.isArray(statKeys)) {
            this.statKeys = new Set(statKeys.map(key => key.toString()));
        }

        if (multiplierStackingMode) {
            this.setMultiplierStackingMode(multiplierStackingMode);
        }
    }

    setMultiplierStackingMode(mode) {
        this.multiplierStackingMode = mode === 'compound' ? 'compound' : 'linear';
    }

    calculateModifiedStats(shipEntry, config) {
        if (!shipEntry) {
            return { values: {}, details: {} };
        }

        const values = {};
        const details = {};
        const baseValues = {};
        const statEffects = {};

        this.statKeys.forEach(statKey => {
            const baseValue = this.getBaseStat(shipEntry, statKey);
            baseValues[statKey] = baseValue;
            values[statKey] = baseValue;
            statEffects[statKey] = [];
        });

        if (!config || !config.components || this.statKeys.size === 0) {
            return { values, details };
        }

        const normalizedComponents = this.normalizeComponents(config.components);

        Object.entries(normalizedComponents).forEach(([category, componentTypes]) => {
            Object.entries(componentTypes).forEach(([componentType, componentIds]) => {
                componentIds.forEach(componentId => {
                    this.collectComponentEffect(componentId, category, componentType, statEffects);
                });
            });
        });

        this.statKeys.forEach(statKey => {
            const baseValue = baseValues[statKey];
            const effects = statEffects[statKey];

            if (baseValue === null || baseValue === undefined) {
                return;
            }

            if (!effects || effects.length === 0) {
                details[statKey] = {
                    baseValue,
                    modifiedValue: baseValue,
                    totalAdditive: 0,
                    totalMultiplier: 1,
                    contributions: [],
                    rawEffects: []
                };
                return;
            }

            const { totalAdditive, totalMultiplier, contributions, rawEffects } = this.calculateTotals(effects);

            const hasAdditive = totalAdditive !== 0;
            const hasMultiplier = totalMultiplier !== 1.0;

            let modifiedValue = baseValue;
            if (hasAdditive && hasMultiplier) {
                modifiedValue = (baseValue + totalAdditive) * totalMultiplier;
            } else if (hasAdditive) {
                modifiedValue = baseValue + totalAdditive;
            } else if (hasMultiplier) {
                modifiedValue = baseValue * totalMultiplier;
            }

            values[statKey] = modifiedValue;
            details[statKey] = {
                baseValue,
                modifiedValue,
                totalAdditive,
                totalMultiplier,
                contributions,
                rawEffects
            };
        });

        return { values, details };
    }

    normalizeComponents(components) {
        const normalized = {};

        Object.entries(components || {}).forEach(([category, componentTypes]) => {
            if (!componentTypes) return;
            normalized[category] = {};

            Object.entries(componentTypes).forEach(([componentType, value]) => {
                if (!value) {
                    normalized[category][componentType] = [];
                    return;
                }

                if (Array.isArray(value)) {
                    normalized[category][componentType] = value.filter(Boolean);
                    return;
                }

                if (Array.isArray(value.items)) {
                    normalized[category][componentType] = value.items.filter(Boolean);
                    return;
                }

                if (typeof value === 'number' || typeof value === 'string') {
                    normalized[category][componentType] = [value];
                    return;
                }

                normalized[category][componentType] = [];
            });
        });

        return normalized;
    }

    collectComponentEffect(componentId, category, componentType, statEffects) {
        if (!componentId) return;

        const componentKey = componentId.toString();
        const info = this.componentsById[componentKey];

        if (!info) {
            if (!this.missingComponents.has(componentKey)) {
                console.warn(`[ShipConfigCalculator] Component ID ${componentKey} not found in lookup table.`);
                this.missingComponents.add(componentKey);
            }
            return;
        }

        const effectiveCategory = category || info.category;
        const groupName = this.getComponentGroupName(info, effectiveCategory);

        if (!effectiveCategory || !groupName) {
            return;
        }

        const groupAttributes = this.componentAttributes?.[effectiveCategory]?.[groupName];
        if (!groupAttributes) {
            return;
        }

        const className = info.className || info.properties?.Class || null;
        const tierName = info.tierName || info.properties?.Tier || null;

        Object.entries(groupAttributes).forEach(([statName, statData]) => {
            if (statName === 'subGroups') return;
            if (!this.statKeys.has(statName)) return;
            if (!statData) return;

            const stat = this.initializeStatWithType(statData);
            const additive = this.getScaledAdditive(stat, effectiveCategory, className, tierName);
            const multiplier = this.getScaledMultiplier(stat, effectiveCategory, className, tierName);

            if (additive === 0 && multiplier === 1.0) {
                return;
            }

            statEffects[statName].push({
                type: stat.type,
                additive,
                multiplier,
                componentId: info.id,
                componentName: info.name,
                category: effectiveCategory,
                groupName,
                componentType: info.componentType || componentType || groupName
            });
        });
    }

    getComponentGroupName(info, category) {
        if (!info) return null;
        if (info.componentType) return info.componentType;

        const properties = info.properties || {};

        switch (category) {
            case 'Ship Component':
                return properties['Ship Component'] || info.name || null;
            case 'Ship Module':
                return properties['Ship Modules'] || info.name || null;
            case 'Ship Weapons':
                return properties['Damage Type'] || info.name || null;
            case 'Countermeasures':
                return properties['Countermeasure'] || info.name || null;
            case 'Missiles':
                return properties['Missiles'] || info.name || null;
            case 'Drones':
                return properties['Drone Type'] || properties['Drones'] || info.name || null;
            default:
                return info.name || null;
        }
    }

    initializeStatWithType(stat = {}) {
        if (stat.type) {
            return {
                baseValue: stat.baseValue ?? 0,
                multiplicativeValue: stat.multiplicativeValue ?? 1.0,
                additiveValue: stat.additiveValue ?? 0,
                type: stat.type,
                values: stat.values || {}
            };
        }

        return {
            baseValue: stat.baseValue ?? 0,
            multiplicativeValue: stat.multiplicativeValue ?? stat.baseValue ?? 1.0,
            additiveValue: stat.additiveValue ?? 0,
            type: this.STAT_TYPES.MULTIPLICATIVE,
            values: stat.values || {}
        };
    }

    getScaledAdditive(stat, category, className, tierName) {
        if (stat.type === this.STAT_TYPES.MULTIPLICATIVE) {
            return 0;
        }

        const key = this.buildScalingKey(className, tierName);

        if (stat.values && key && stat.values[key] !== undefined) {
            return stat.values[key];
        }

        if (stat.values && stat.values.base !== undefined) {
            return stat.values.base;
        }

        const baseAdditive = stat.additiveValue || 0;
        if (baseAdditive === 0) return 0;

        return this.scaleValue(baseAdditive, category, className, tierName);
    }

    getScaledMultiplier(stat, category, className, tierName) {
        if (stat.type === this.STAT_TYPES.ADDITIVE) {
            return 1.0;
        }

        const key = this.buildScalingKey(className, tierName);

        if (stat.values && key && stat.values[key] !== undefined) {
            return stat.values[key];
        }

        if (stat.values && stat.values.base !== undefined) {
            return stat.values.base;
        }

        const baseMultiplier = stat.multiplicativeValue !== undefined ? stat.multiplicativeValue : 1.0;
        if (baseMultiplier === 1.0) return 1.0;

        const scaledBonus = this.scaleValue(baseMultiplier - 1.0, category, className, tierName);
        return 1.0 + scaledBonus;
    }

    scaleValue(baseValue, category, className, tierName) {
        let result = baseValue;

        const classIndex = this.getClassIndex(className);
        const tierIndex = this.getTierIndex(tierName);

        const classFormula = this.classScalingFormulas?.[category] ||
            this.classScalingFormulas?.default ||
            this.DEFAULT_CLASS_FORMULA;

        const tierFormula = this.tierScalingFormulas?.[category] ||
            this.tierScalingFormulas?.default ||
            this.DEFAULT_TIER_FORMULA;

        if (classIndex !== null) {
            result = this.evaluateFormulaSafe(classFormula, { base: result, classIndex });
        }

        if (tierIndex !== null) {
            result = this.evaluateFormulaSafe(tierFormula, { base: result, tierIndex });
        }

        return result;
    }

    evaluateFormulaSafe(formula, variables) {
        if (!formula) return variables.base;
        try {
            return this.evaluateFormula(formula, variables);
        } catch (error) {
            console.warn('[ShipConfigCalculator] Failed to evaluate formula:', formula, error);
            return variables.base;
        }
    }

    evaluateFormula(formula, variables) {
        const mathFunctions = {
            abs: Math.abs,
            ceil: Math.ceil,
            floor: Math.floor,
            max: Math.max,
            min: Math.min,
            pow: Math.pow,
            round: Math.round,
            sqrt: Math.sqrt
        };

        const context = { ...variables, ...mathFunctions };
        const keys = Object.keys(context);
        const values = keys.map(key => context[key]);

        // eslint-disable-next-line no-new-func
        const func = new Function(...keys, `"use strict"; return ${formula};`);
        return func(...values);
    }

    buildScalingKey(className, tierName) {
        if (!className || !tierName) return null;
        return `${className}-${tierName}`;
    }

    getClassIndex(className) {
        if (!className) return null;
        const trimmed = className.toString().trim();
        if (this.classIndexMap.hasOwnProperty(trimmed)) {
            return this.classIndexMap[trimmed];
        }

        const upper = trimmed.toUpperCase();
        if (this.classIndexMap.hasOwnProperty(upper)) {
            return this.classIndexMap[upper];
        }

        return null;
    }

    getTierIndex(tierName) {
        if (!tierName) return null;
        const upper = tierName.toString().trim().toUpperCase();
        if (this.tierIndexMap.hasOwnProperty(upper)) {
            return this.tierIndexMap[upper];
        }
        return null;
    }

    getBaseStat(shipEntry, statKey) {
        const path = this.statPathMap[statKey];
        if (!path || path.length === 0) return null;

        let current = shipEntry;
        for (const segment of path) {
            if (current === null || current === undefined) {
                return null;
            }
            current = current[segment];
        }

        return typeof current === 'number' ? current : null;
    }

    calculateTotals(effects) {
        const grouped = this.groupEffects(effects);

        let totalAdditive = 0;
        let totalMultiplier = 1.0;
        const contributions = [];
        const rawEffects = effects.map(effect => ({
            componentId: effect.componentId,
            componentName: effect.componentName,
            category: effect.category,
            groupName: effect.groupName,
            componentType: effect.componentType,
            type: effect.type,
            additive: effect.additive,
            multiplier: effect.multiplier,
            className: effect.className,
            tierName: effect.tierName
        }));

        Object.values(grouped).forEach(group => {
            if (group.type === this.STAT_TYPES.ADDITIVE || group.type === this.STAT_TYPES.BOTH) {
                totalAdditive += group.count * group.additive;
            }

            let multiplierPerInstance = group.multiplier;
            let multiplierTotal = 1;
            let multiplierBonus = 0;

            if (group.type === this.STAT_TYPES.MULTIPLICATIVE || group.type === this.STAT_TYPES.BOTH) {
                if (this.multiplierStackingMode === 'compound') {
                    multiplierTotal = Math.pow(multiplierPerInstance, group.count);
                    multiplierBonus = multiplierTotal - 1;
                    totalMultiplier *= multiplierTotal;
                } else {
                    multiplierBonus = group.count * (multiplierPerInstance - 1.0);
                    multiplierTotal = 1 + multiplierBonus;
                    totalMultiplier += multiplierBonus;
                }
            }

            const additivePerInstance = group.additive;
            const additiveTotal = (group.type === this.STAT_TYPES.ADDITIVE || group.type === this.STAT_TYPES.BOTH)
                ? group.count * additivePerInstance
                : 0;

            contributions.push({
                category: group.sample?.category || null,
                groupName: group.sample?.groupName || null,
                componentType: group.sample?.componentType || null,
                componentName: group.sample?.componentName || null,
                componentId: group.sample?.componentId || null,
                count: group.count,
                type: group.type,
                additivePerInstance,
                additiveTotal,
                multiplierPerInstance,
                multiplierTotal,
                multiplierBonus,
                stackingMode: this.multiplierStackingMode
            });
        });

        return { totalAdditive, totalMultiplier, contributions, rawEffects };
    }

    groupEffects(effects) {
        const grouped = {};

        effects.forEach(effect => {
            const key = [
                effect.category || '',
                effect.groupName || '',
                effect.componentType || '',
                effect.type || ''
            ].join('|');

            if (!grouped[key]) {
                grouped[key] = {
                    type: effect.type || this.STAT_TYPES.MULTIPLICATIVE,
                    additive: effect.additive || 0,
                    multiplier: effect.multiplier || 1.0,
                    count: 1,
                    sample: effect
                };
            } else {
                grouped[key].count += 1;
            }
        });

        return grouped;
    }
}

if (typeof window !== 'undefined') {
    window.ShipConfigCalculator = ShipConfigCalculator;
}
