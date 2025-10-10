/**
 * Component Management Module
 * Handles component selection, filtering, and slot management
 */

class ComponentManager {
    constructor(shipExplorer) {
        this.explorer = shipExplorer;
        this.selectedComponents = new Map(); // shipId -> componentIds[]
        this.componentFilters = {
            category: null,
            type: null,
            class: null,
            tier: null,
            searchTerm: ''
        };
    }

    /**
     * Get all available components
     */
    getAllComponents() {
        return Object.values(this.explorer.componentsById || {});
    }

    /**
     * Get components filtered by criteria
     */
    getFilteredComponents() {
        const components = this.getAllComponents();

        return components.filter(comp => {
            // Category filter
            if (this.componentFilters.category && comp.category !== this.componentFilters.category) {
                return false;
            }

            // Type filter
            if (this.componentFilters.type && comp.componentType !== this.componentFilters.type) {
                return false;
            }

            // Class filter
            if (this.componentFilters.class && comp.className !== this.componentFilters.class) {
                return false;
            }

            // Tier filter
            if (this.componentFilters.tier && comp.tierName !== this.componentFilters.tier) {
                return false;
            }

            // Search term
            if (this.componentFilters.searchTerm) {
                const term = this.componentFilters.searchTerm.toLowerCase();
                const searchable = [
                    comp.name,
                    comp.category,
                    comp.componentType,
                    comp.className,
                    comp.tierName
                ].filter(Boolean).join(' ').toLowerCase();

                if (!searchable.includes(term)) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Set filter value
     */
    setFilter(filterName, value) {
        if (this.componentFilters.hasOwnProperty(filterName)) {
            this.componentFilters[filterName] = value;
        }
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.componentFilters = {
            category: null,
            type: null,
            class: null,
            tier: null,
            searchTerm: ''
        };
    }

    /**
     * Get unique categories
     */
    getCategories() {
        const components = this.getAllComponents();
        const categories = new Set();
        components.forEach(comp => {
            if (comp.category) categories.add(comp.category);
        });
        return Array.from(categories).sort();
    }

    /**
     * Get unique component types
     */
    getComponentTypes() {
        const components = this.getAllComponents();
        const types = new Set();
        components.forEach(comp => {
            if (comp.componentType) types.add(comp.componentType);
        });
        return Array.from(types).sort();
    }

    /**
     * Get unique classes
     */
    getClasses() {
        const components = this.getAllComponents();
        const classes = new Set();
        components.forEach(comp => {
            if (comp.className) classes.add(comp.className);
        });
        return Array.from(classes).sort();
    }

    /**
     * Get unique tiers
     */
    getTiers() {
        const components = this.getAllComponents();
        const tiers = new Set();
        components.forEach(comp => {
            if (comp.tierName) tiers.add(comp.tierName);
        });
        return Array.from(tiers).sort();
    }

    /**
     * Get component by ID
     */
    getComponent(componentId) {
        const key = componentId.toString();
        return this.explorer.componentsById[key] || null;
    }

    /**
     * Get components in a ship configuration
     */
    getConfigurationComponents(ship, configName) {
        const config = (ship.configurations || []).find(cfg => cfg.name === configName);
        if (!config) return [];

        // Components is an object with category -> type -> component arrays
        const componentsData = config.components || {};
        const allComponents = [];

        // Flatten the nested component structure
        Object.entries(componentsData).forEach(([category, categoryData]) => {
            if (typeof categoryData === 'object' && categoryData !== null) {
                Object.entries(categoryData).forEach(([type, typeArray]) => {
                    if (Array.isArray(typeArray)) {
                        typeArray.forEach(comp => {
                            const componentId = comp?.id;
                            if (componentId) {
                                const componentData = this.getComponent(componentId);
                                if (componentData) {
                                    allComponents.push({
                                        ...componentData,
                                        category: category,
                                        componentType: type,
                                        quantity: comp.quantity || 1
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });

        return allComponents;
    }

    /**
     * Add component to ship
     */
    addComponent(shipId, componentId) {
        if (!this.selectedComponents.has(shipId)) {
            this.selectedComponents.set(shipId, []);
        }

        const components = this.selectedComponents.get(shipId);
        if (!components.includes(componentId)) {
            components.push(componentId);
        }
    }

    /**
     * Remove component from ship
     */
    removeComponent(shipId, componentId) {
        if (!this.selectedComponents.has(shipId)) return;

        const components = this.selectedComponents.get(shipId);
        const index = components.indexOf(componentId);
        if (index > -1) {
            components.splice(index, 1);
        }
    }

    /**
     * Get selected components for ship
     */
    getSelectedComponents(shipId) {
        return this.selectedComponents.get(shipId) || [];
    }

    /**
     * Clear selected components for ship
     */
    clearSelectedComponents(shipId) {
        this.selectedComponents.delete(shipId);
    }

    /**
     * Get component slot information
     */
    getSlotInfo(ship, configName) {
        const config = (ship.configurations || []).find(cfg => cfg.name === configName);
        if (!config) return null;

        // Get all components using the same method as getConfigurationComponents
        const componentsData = config.components || {};
        let componentCount = 0;
        const slotsByCategory = {};

        // Flatten the nested component structure
        Object.entries(componentsData).forEach(([category, categoryData]) => {
            if (typeof categoryData === 'object' && categoryData !== null) {
                Object.values(categoryData).forEach(typeArray => {
                    if (Array.isArray(typeArray)) {
                        const count = typeArray.length;
                        componentCount += count;
                        slotsByCategory[category] = (slotsByCategory[category] || 0) + count;
                    }
                });
            }
        });

        const totalSlots = ship.slots?.total || componentCount;

        return {
            used: componentCount,
            total: totalSlots,
            available: totalSlots - componentCount,
            byCategory: slotsByCategory
        };
    }

    /**
     * Check if component can be added to configuration
     */
    canAddComponent(ship, configName, componentId) {
        const slotInfo = this.getSlotInfo(ship, configName);
        if (!slotInfo) return false;

        // Check if slots available
        if (slotInfo.available <= 0) return false;

        // Additional checks could be added here
        // - Category restrictions
        // - Type restrictions
        // - Compatibility checks

        return true;
    }

    /**
     * Get component statistics
     */
    getComponentStats(componentId) {
        const component = this.getComponent(componentId);
        if (!component) return null;

        const attributes = [];

        // Get attributes from componentAttributes
        if (this.explorer.componentAttributes) {
            for (const [attrName, attrData] of Object.entries(this.explorer.componentAttributes)) {
                const componentIds = attrData.components || [];
                if (componentIds.includes(componentId)) {
                    attributes.push({
                        name: attrName,
                        additive: attrData.additive || 0,
                        multiplier: attrData.multiplier || 0
                    });
                }
            }
        }

        return {
            id: component.id,
            name: component.name,
            category: component.category,
            type: component.componentType,
            class: component.className,
            tier: component.tierName,
            attributes: attributes
        };
    }

    /**
     * Search components by name
     */
    searchComponents(searchTerm) {
        this.setFilter('searchTerm', searchTerm);
        return this.getFilteredComponents();
    }

    /**
     * Get component count by category
     */
    getComponentCountByCategory() {
        const components = this.getAllComponents();
        const counts = {};

        components.forEach(comp => {
            const category = comp.category || 'Unknown';
            counts[category] = (counts[category] || 0) + 1;
        });

        return counts;
    }

    /**
     * Get component count by type
     */
    getComponentCountByType() {
        const components = this.getAllComponents();
        const counts = {};

        components.forEach(comp => {
            const type = comp.componentType || 'Unknown';
            counts[type] = (counts[type] || 0) + 1;
        });

        return counts;
    }

    /**
     * Export components as JSON
     */
    exportComponents() {
        return JSON.stringify(this.getAllComponents(), null, 2);
    }

    /**
     * Get components compatible with ship
     */
    getCompatibleComponents(ship) {
        // This would require ship-specific compatibility data
        // For now, return all components
        return this.getAllComponents();
    }

    /**
     * Compare two components
     */
    compareComponents(componentId1, componentId2) {
        const comp1Stats = this.getComponentStats(componentId1);
        const comp2Stats = this.getComponentStats(componentId2);

        if (!comp1Stats || !comp2Stats) return null;

        return {
            component1: comp1Stats,
            component2: comp2Stats,
            differences: {
                category: comp1Stats.category !== comp2Stats.category,
                type: comp1Stats.type !== comp2Stats.type,
                class: comp1Stats.class !== comp2Stats.class,
                tier: comp1Stats.tier !== comp2Stats.tier,
                attributeCount: comp1Stats.attributes.length !== comp2Stats.attributes.length
            }
        };
    }

    /**
     * Get recommended components for ship
     */
    getRecommendedComponents(ship, category = null) {
        let components = this.getAllComponents();

        if (category) {
            components = components.filter(comp => comp.category === category);
        }

        // Sort by tier and class (higher tier/class first)
        components.sort((a, b) => {
            const tierOrder = { 'Tier 5': 5, 'Tier 4': 4, 'Tier 3': 3, 'Tier 2': 2, 'Tier 1': 1 };
            const classOrder = { 'Capital': 4, 'Large': 3, 'Medium': 2, 'Small': 1 };

            const aTier = tierOrder[a.tierName] || 0;
            const bTier = tierOrder[b.tierName] || 0;

            if (aTier !== bTier) return bTier - aTier;

            const aClass = classOrder[a.className] || 0;
            const bClass = classOrder[b.className] || 0;

            return bClass - aClass;
        });

        return components.slice(0, 10); // Return top 10
    }
}
