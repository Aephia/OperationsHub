/**
 * Attribute Management Module
 * Handles ship attribute modifications, scaling formulas, and stat calculations
 */

class AttributeManager {
    constructor(shipExplorer) {
        this.explorer = shipExplorer;
        this.attributeCache = new Map();
    }

    /**
     * Get all attributes affected by a component
     */
    getComponentAttributes(componentId) {
        if (!this.explorer.componentAttributes) return [];

        const attributes = [];
        const componentKey = componentId.toString();
        const componentData = this.explorer.componentsById[componentKey];

        if (!componentData) return attributes;

        // Check component attributes
        for (const [attrName, attrData] of Object.entries(this.explorer.componentAttributes)) {
            const componentIds = attrData.components || [];
            if (componentIds.includes(componentId)) {
                attributes.push({
                    name: attrName,
                    type: attrData.type || 'unknown',
                    additive: attrData.additive || 0,
                    multiplier: attrData.multiplier || 0,
                    stats: attrData.stats || []
                });
            }
        }

        return attributes;
    }

    /**
     * Apply class scaling to a component attribute value
     */
    applyClassScaling(baseValue, className, attributeName) {
        if (!className || !this.explorer.classScalingFormulas) return baseValue;

        const formula = this.explorer.classScalingFormulas[className];
        if (!formula || !formula[attributeName]) return baseValue;

        const scalingData = formula[attributeName];
        const multiplier = scalingData.multiplier || 1;
        const additive = scalingData.additive || 0;

        return baseValue * multiplier + additive;
    }

    /**
     * Apply tier scaling to a component attribute value
     */
    applyTierScaling(baseValue, tierName, attributeName) {
        if (!tierName || !this.explorer.tierScalingFormulas) return baseValue;

        const formula = this.explorer.tierScalingFormulas[tierName];
        if (!formula || !formula[attributeName]) return baseValue;

        const scalingData = formula[attributeName];
        const multiplier = scalingData.multiplier || 1;
        const additive = scalingData.additive || 0;

        return baseValue * multiplier + additive;
    }

    /**
     * Calculate final attribute value with all scaling applied
     */
    calculateScaledAttribute(componentId, attributeName, baseValue) {
        const componentKey = componentId.toString();
        const componentData = this.explorer.componentsById[componentKey];

        if (!componentData) return baseValue;

        let scaledValue = baseValue;

        // Apply class scaling
        if (componentData.className) {
            scaledValue = this.applyClassScaling(scaledValue, componentData.className, attributeName);
        }

        // Apply tier scaling
        if (componentData.tierName) {
            scaledValue = this.applyTierScaling(scaledValue, componentData.tierName, attributeName);
        }

        return scaledValue;
    }

    /**
     * Get all attributes for a configuration
     */
    getConfigurationAttributes(ship, configName) {
        const cacheKey = `${ship.id}::${configName}`;

        if (this.attributeCache.has(cacheKey)) {
            return this.attributeCache.get(cacheKey);
        }

        const config = (ship.configurations || []).find(cfg => cfg.name === configName);
        if (!config) return null;

        const attributes = new Map();

        // Process each component in the configuration
        // Components is an object with category -> type -> component arrays
        const componentsData = config.components || {};
        const allComponentIds = [];

        // Flatten the nested component structure
        Object.values(componentsData).forEach(category => {
            if (typeof category === 'object' && category !== null) {
                Object.values(category).forEach(typeArray => {
                    if (Array.isArray(typeArray)) {
                        typeArray.forEach(comp => {
                            const componentId = comp?.id;
                            if (componentId) {
                                allComponentIds.push(componentId);
                            }
                        });
                    }
                });
            }
        });

        allComponentIds.forEach(componentId => {
            const componentAttrs = this.getComponentAttributes(componentId);
            componentAttrs.forEach(attr => {
                const key = attr.name;
                if (!attributes.has(key)) {
                    attributes.set(key, {
                        name: attr.name,
                        type: attr.type,
                        totalAdditive: 0,
                        totalMultiplier: 1,
                        components: []
                    });
                }

                const existing = attributes.get(key);
                const scaledAdditive = this.calculateScaledAttribute(componentId, attr.name, attr.additive);
                const scaledMultiplier = this.calculateScaledAttribute(componentId, attr.name, attr.multiplier);

                existing.totalAdditive += scaledAdditive;

                // Stack multipliers linearly (matching ShipConfigCalculator)
                if (scaledMultiplier !== 0) {
                    existing.totalMultiplier += scaledMultiplier;
                }

                existing.components.push({
                    id: componentId,
                    name: this.explorer.componentsById[componentId.toString()]?.name || 'Unknown',
                    additive: scaledAdditive,
                    multiplier: scaledMultiplier
                });
            });
        });

        const result = Array.from(attributes.values());
        this.attributeCache.set(cacheKey, result);
        return result;
    }

    /**
     * Clear cache for a specific ship
     */
    clearCache(shipId = null) {
        if (shipId) {
            const prefix = `${shipId}::`;
            Array.from(this.attributeCache.keys()).forEach(key => {
                if (key.startsWith(prefix)) {
                    this.attributeCache.delete(key);
                }
            });
        } else {
            this.attributeCache.clear();
        }
    }

    /**
     * Get attribute impact on a specific stat
     */
    getAttributeImpactOnStat(attributeName, statKey) {
        if (!this.explorer.componentAttributes) return null;

        const attrData = this.explorer.componentAttributes[attributeName];
        if (!attrData) return null;

        const stats = attrData.stats || [];
        const statMapping = stats.find(s => s.key === statKey || s.path?.join('.') === statKey);

        return statMapping || null;
    }

    /**
     * Get human-readable attribute description
     */
    getAttributeDescription(attributeName) {
        const descriptions = {
            'Weapon Damage': 'Increases damage output from ship weapons',
            'Shield Capacity': 'Increases maximum shield points',
            'Hull Integrity': 'Increases maximum hit points',
            'Cargo Expansion': 'Increases cargo capacity',
            'Fuel Efficiency': 'Reduces fuel consumption',
            'Warp Speed': 'Increases warp travel speed',
            'Scan Enhancement': 'Increases scanning power and reduces cooldown'
        };

        return descriptions[attributeName] || attributeName;
    }
}
