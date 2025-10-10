/**
 * Custom Ship Management Module
 * Handles creation, editing, and management of custom ship builds
 */

class CustomShipManager {
    constructor(shipExplorer) {
        this.explorer = shipExplorer;
        this.customShips = new Map(); // shipId -> customConfigs[]
        this.loadFromLocalStorage();
    }

    /**
     * Create a new custom configuration for a ship
     */
    createCustomConfig(shipId, configName) {
        if (!configName || configName.trim() === '') {
            throw new Error('Configuration name is required');
        }

        const ship = this.explorer.shipMap.get(shipId);
        if (!ship) {
            throw new Error('Ship not found');
        }

        // Check if config name already exists
        if (this.getCustomConfig(shipId, configName)) {
            throw new Error('Configuration name already exists');
        }

        const customConfig = {
            id: this.generateConfigId(),
            name: configName.trim(),
            components: [],
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            isCustom: true
        };

        if (!this.customShips.has(shipId)) {
            this.customShips.set(shipId, []);
        }

        this.customShips.get(shipId).push(customConfig);
        this.saveToLocalStorage();

        return customConfig;
    }

    /**
     * Get custom configuration
     */
    getCustomConfig(shipId, configName) {
        const configs = this.customShips.get(shipId) || [];
        return configs.find(cfg => cfg.name === configName);
    }

    /**
     * Get all custom configurations for a ship
     */
    getCustomConfigs(shipId) {
        return this.customShips.get(shipId) || [];
    }

    /**
     * Update custom configuration
     */
    updateCustomConfig(shipId, configName, updates) {
        const config = this.getCustomConfig(shipId, configName);
        if (!config) {
            throw new Error('Configuration not found');
        }

        Object.assign(config, updates, {
            modified: new Date().toISOString()
        });

        this.saveToLocalStorage();
        return config;
    }

    /**
     * Delete custom configuration
     */
    deleteCustomConfig(shipId, configName) {
        const configs = this.customShips.get(shipId);
        if (!configs) return false;

        const index = configs.findIndex(cfg => cfg.name === configName);
        if (index === -1) return false;

        configs.splice(index, 1);
        this.saveToLocalStorage();
        return true;
    }

    /**
     * Clone an existing configuration
     */
    cloneConfig(shipId, sourceConfigName, newConfigName) {
        if (!newConfigName || newConfigName.trim() === '') {
            throw new Error('New configuration name is required');
        }

        const ship = this.explorer.shipMap.get(shipId);
        if (!ship) {
            throw new Error('Ship not found');
        }

        // Find source configuration (could be custom or original)
        let sourceConfig = this.getCustomConfig(shipId, sourceConfigName);
        if (!sourceConfig) {
            sourceConfig = (ship.configurations || []).find(cfg => cfg.name === sourceConfigName);
        }

        if (!sourceConfig) {
            throw new Error('Source configuration not found');
        }

        // Check if new name already exists
        if (this.getCustomConfig(shipId, newConfigName)) {
            throw new Error('Configuration name already exists');
        }

        const clonedConfig = {
            id: this.generateConfigId(),
            name: newConfigName.trim(),
            components: JSON.parse(JSON.stringify(sourceConfig.components || [])),
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            isCustom: true,
            clonedFrom: sourceConfigName
        };

        if (!this.customShips.has(shipId)) {
            this.customShips.set(shipId, []);
        }

        this.customShips.get(shipId).push(clonedConfig);
        this.saveToLocalStorage();

        return clonedConfig;
    }

    /**
     * Add component to custom configuration
     */
    addComponentToConfig(shipId, configName, componentId, slotId = null) {
        const config = this.getCustomConfig(shipId, configName);
        if (!config) {
            throw new Error('Configuration not found');
        }

        const component = this.explorer.componentsById[componentId.toString()];
        if (!component) {
            throw new Error('Component not found');
        }

        // Generate slot ID if not provided
        if (!slotId) {
            slotId = this.generateSlotId(config);
        }

        config.components.push({
            id: componentId,
            component: { id: componentId },
            slotId: slotId,
            quantity: 1
        });

        config.modified = new Date().toISOString();
        this.saveToLocalStorage();

        return config;
    }

    /**
     * Remove component from custom configuration
     */
    removeComponentFromConfig(shipId, configName, slotId) {
        const config = this.getCustomConfig(shipId, configName);
        if (!config) {
            throw new Error('Configuration not found');
        }

        const index = config.components.findIndex(comp => comp.slotId === slotId);
        if (index === -1) {
            throw new Error('Component not found in configuration');
        }

        config.components.splice(index, 1);
        config.modified = new Date().toISOString();
        this.saveToLocalStorage();

        return config;
    }

    /**
     * Replace component in custom configuration
     */
    replaceComponentInConfig(shipId, configName, slotId, newComponentId) {
        const config = this.getCustomConfig(shipId, configName);
        if (!config) {
            throw new Error('Configuration not found');
        }

        const component = config.components.find(comp => comp.slotId === slotId);
        if (!component) {
            throw new Error('Component not found in configuration');
        }

        const newComponent = this.explorer.componentsById[newComponentId.toString()];
        if (!newComponent) {
            throw new Error('New component not found');
        }

        component.id = newComponentId;
        component.component = { id: newComponentId };
        config.modified = new Date().toISOString();
        this.saveToLocalStorage();

        return config;
    }

    /**
     * Export custom configuration as JSON
     */
    exportConfig(shipId, configName) {
        const config = this.getCustomConfig(shipId, configName);
        if (!config) {
            throw new Error('Configuration not found');
        }

        const ship = this.explorer.shipMap.get(shipId);
        const exportData = {
            ship: {
                id: shipId,
                name: ship?.name,
                manufacturer: ship?.manufacturer
            },
            configuration: config,
            exported: new Date().toISOString(),
            version: '1.0'
        };

        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Import custom configuration from JSON
     */
    importConfig(shipId, jsonData) {
        let data;
        try {
            data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        } catch (error) {
            throw new Error('Invalid JSON data');
        }

        if (!data.configuration || !data.configuration.name) {
            throw new Error('Invalid configuration data');
        }

        // Check if config already exists
        if (this.getCustomConfig(shipId, data.configuration.name)) {
            throw new Error('Configuration name already exists');
        }

        const importedConfig = {
            id: this.generateConfigId(),
            name: data.configuration.name,
            components: data.configuration.components || [],
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            isCustom: true,
            imported: true
        };

        if (!this.customShips.has(shipId)) {
            this.customShips.set(shipId, []);
        }

        this.customShips.get(shipId).push(importedConfig);
        this.saveToLocalStorage();

        return importedConfig;
    }

    /**
     * Get all custom configurations across all ships
     */
    getAllCustomConfigs() {
        const allConfigs = [];
        this.customShips.forEach((configs, shipId) => {
            configs.forEach(config => {
                allConfigs.push({
                    shipId,
                    ...config
                });
            });
        });
        return allConfigs;
    }

    /**
     * Validate custom configuration
     */
    validateConfig(shipId, configName) {
        const config = this.getCustomConfig(shipId, configName);
        if (!config) {
            throw new Error('Configuration not found');
        }

        const ship = this.explorer.shipMap.get(shipId);
        if (!ship) {
            throw new Error('Ship not found');
        }

        const errors = [];
        const warnings = [];

        // Check component count
        const totalSlots = ship.slots?.total || 0;
        if (config.components.length > totalSlots) {
            errors.push(`Too many components: ${config.components.length}/${totalSlots}`);
        }

        // Check for duplicate slot IDs
        const slotIds = new Set();
        config.components.forEach((comp, index) => {
            if (slotIds.has(comp.slotId)) {
                errors.push(`Duplicate slot ID: ${comp.slotId} at position ${index}`);
            }
            slotIds.add(comp.slotId);
        });

        // Check for invalid components
        config.components.forEach((comp, index) => {
            const componentId = comp.component?.id || comp.id;
            const component = this.explorer.componentsById[componentId?.toString()];
            if (!component) {
                errors.push(`Invalid component at position ${index}: ID ${componentId}`);
            }
        });

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Generate unique configuration ID
     */
    generateConfigId() {
        return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Generate unique slot ID
     */
    generateSlotId(config) {
        const existingIds = new Set(config.components.map(comp => comp.slotId));
        let slotId = config.components.length;
        while (existingIds.has(slotId)) {
            slotId++;
        }
        return slotId;
    }

    /**
     * Save to localStorage
     */
    saveToLocalStorage() {
        try {
            const data = {};
            this.customShips.forEach((configs, shipId) => {
                data[shipId] = configs;
            });
            localStorage.setItem('shipExplorer_customConfigs', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save custom configurations:', error);
        }
    }

    /**
     * Load from localStorage
     */
    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem('shipExplorer_customConfigs');
            if (data) {
                const parsed = JSON.parse(data);
                Object.entries(parsed).forEach(([shipId, configs]) => {
                    this.customShips.set(shipId, configs);
                });
            }
        } catch (error) {
            console.error('Failed to load custom configurations:', error);
        }
    }

    /**
     * Clear all custom configurations
     */
    clearAll() {
        this.customShips.clear();
        localStorage.removeItem('shipExplorer_customConfigs');
    }

    /**
     * Get statistics about custom configurations
     */
    getStats() {
        let totalConfigs = 0;
        let totalComponents = 0;

        this.customShips.forEach(configs => {
            totalConfigs += configs.length;
            configs.forEach(config => {
                totalComponents += config.components.length;
            });
        });

        return {
            totalShipsWithCustomConfigs: this.customShips.size,
            totalCustomConfigs: totalConfigs,
            totalComponents: totalComponents,
            averageComponentsPerConfig: totalConfigs > 0 ? (totalComponents / totalConfigs).toFixed(1) : 0
        };
    }
}
