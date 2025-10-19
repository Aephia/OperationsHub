// Unified Data Loader for all Explorer applications
class DataLoader {
    /**
     * Load data for a specific explorer type
     * @param {string} explorerType - 'recipe', 'claimstake', or 'planet'
     * @param {string} basePath - Path to data directory (default: '../Data/')
     * @returns {Object} Processed data for the explorer
     */
    static async loadExplorerData(explorerType, basePath = '../Data/') {
        console.log(`📦 Loading ${explorerType} data...`);

        try {
            switch (explorerType.toLowerCase()) {
                case 'recipe':
                    return await this.loadRecipeData(basePath);
                case 'claimstake':
                    return await this.loadClaimStakeData(basePath);
                case 'planet':
                    return await this.loadPlanetData(basePath);
                case 'resources':
                    return await this.loadResourcesData();
                case 'ship':
                case 'ships':
                    return await this.loadShipData(basePath);
                default:
                    throw new Error(`Unknown explorer type: ${explorerType}`);
            }
        } catch (error) {
            console.error(`❌ Error loading ${explorerType} data:`, error);
            return this.getEmptyDataStructure(explorerType);
        }
    }

    /**
     * Load resources data
     */
    static async loadResourcesData() {
        try {
            console.log('📦 Loading resources data...');
            // Try to get data from global variable first (for backward compatibility)
            if (typeof window.resourcesData !== 'undefined' && window.resourcesData?.resources) {
                console.log('✅ Using resources data from global variable');
                return window.resourcesData;
            }

            // Fallback to loading from JSON file
            const response = await fetch('../JSON/resources.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('✅ Loaded resources data from JSON file');
            return data;
        } catch (error) {
            console.warn('⚠️ Could not load resources data:', error);
            throw error;
        }
    }

    /**
     * Load recipe data
     */
    static async loadRecipeData(basePath) {
        // Try to get data from global variable first (for backward compatibility)
        if (typeof window.rawRecipeData !== 'undefined' && window.rawRecipeData?.recipes) {
            console.log('✅ Using recipe data from global variable');
            return this.processRecipeData(window.rawRecipeData);
        }

        // Try to load from data directory
        try {
            const response = await fetch(`${basePath}recipes.json`);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Loaded recipe data from JSON file');
                return this.processRecipeData(data);
            }
        } catch (error) {
            console.warn('⚠️ Could not load recipes.json, using fallback');
        }

        // Fallback to processing global rawRecipeData if it exists
        if (typeof rawRecipeData !== 'undefined') {
            return this.processRecipeData(rawRecipeData);
        }

        throw new Error('No recipe data source found');
    }

    /**
     * Load ClaimStake building data
     */
    static async loadClaimStakeData(basePath) {
        // Try to get data from global variable first
        if (typeof window.rawBuildingData !== 'undefined' && window.rawBuildingData?.buildings) {
            console.log('✅ Using building data from global variable');
            return this.processClaimStakeData(window.rawBuildingData);
        }

        // Try to load from data directory
        try {
            const response = await fetch(`${basePath}buildings.json`);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Loaded building data from JSON file');
                return this.processClaimStakeData(data);
            }
        } catch (error) {
            console.warn('⚠️ Could not load buildings.json, using fallback');
        }

        // Fallback to processing global rawBuildingData if it exists
        if (typeof rawBuildingData !== 'undefined') {
            return this.processClaimStakeData(rawBuildingData);
        }

        throw new Error('No building data source found');
    }

    /**
     * Load Planet data
     */
    static async loadPlanetData(basePath) {
        // Try to get data from global variable first
        if (typeof window.planetData !== 'undefined' && window.planetData?.mapData) {
            console.log('✅ Using planet data from global variable');
            return {
                mapData: window.planetData.mapData,
                totalSystems: window.planetData.mapData.length
            };
        }

        // Try to load from data directory
        try {
            const response = await fetch(`${basePath}planets.json`);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Loaded planet data from JSON file');
                return {
                    mapData: data.mapData || data,
                    totalSystems: (data.mapData || data).length
                };
            }
        } catch (error) {
            console.warn('⚠️ Could not load planets.json, using fallback');
        }

        // Fallback to processing global planetData if it exists
        if (typeof planetData !== 'undefined') {
            return {
                mapData: planetData.mapData || planetData,
                totalSystems: (planetData.mapData || planetData).length
            };
        }

        throw new Error('No planet data source found');
    }

    /**
     * Load Ship data
     */
    static async loadShipData(basePath) {
        // Prefer global variable if available
        if (typeof window.rawShipData !== 'undefined' && window.rawShipData?.ships) {
            console.log('�o. Using ship data from global variable');
            return this.processShipData(window.rawShipData);
        }

        // Attempt to fetch aggregated JSON file
        try {
            const response = await fetch(`${basePath}ships-data.json`);
            if (response.ok) {
                const data = await response.json();
                console.log('�o. Loaded ship data from JSON file');
                return this.processShipData(data);
            }
        } catch (error) {
            console.warn('�s��,? Could not load ships-data.json, checking fallback sources');
        }

        // Fallback to global variable defined without window attachment
        if (typeof rawShipData !== 'undefined') {
            return this.processShipData(rawShipData);
        }

        throw new Error('No ship data source found');
    }

    /**
     * Process recipe data into the expected format
     */
    static processRecipeData(rawData) {
        if (!rawData || !rawData.recipes) {
            throw new Error('Invalid recipe data format');
        }

        console.log(`🔄 Processing ${rawData.recipes.length} recipes`);

        // Group recipes by resourceType
        const grouped = {};
        rawData.recipes.forEach(recipe => {
            const category = recipe.resourceType || 'Other';
            if (!grouped[category]) {
                grouped[category] = [];
            }

            // Convert to our format
            const convertedRecipe = {
                id: recipe.outputId,
                name: recipe.outputName,
                type: this.getRecipeType(recipe.outputType),
                inputs: recipe.ingredients ? recipe.ingredients.map(ing => ({
                    name: ing.name,
                    amount: ing.quantity,
                    type: 'material'
                })) : [],
                outputs: [{
                    name: recipe.outputName,
                    amount: recipe.outputQuantity || 1,
                    type: 'product'
                }],
                time: recipe.constructionTime || 0,
                craftingTime: recipe.constructionTime || 0,  // Add for analytics compatibility
                tier: recipe.outputTier || 1,
                buildingTier: recipe.buildingResourceTier || 1,  // Add building tier
                planetTypes: recipe.planetTypes || [],  // Add planet types
                factions: recipe.factions || [],  // Add factions
                productionSteps: recipe.productionSteps || 1,  // Add production steps
                category: category,
                description: recipe.description || '',
                rawData: recipe
            };

            grouped[category].push(convertedRecipe);
        });

        // Convert to categories array
        const categories = Object.entries(grouped).map(([name, recipes]) => ({
            name,
            icon: this.getCategoryIcon(name),
            recipes
        }));

        console.log(`✅ Processed into ${categories.length} categories`);

        return { categories };
    }

    /**
     * Process ClaimStake building data
     */
    static processClaimStakeData(rawData) {
        if (!rawData || !rawData.buildings) {
            throw new Error('Invalid building data format');
        }

        console.log(`🔄 Processing ${rawData.buildings.length} buildings`);

        const categories = new Map();
        const tiers = new Set();
        const allResources = new Set();
        const constructionMaterials = new Set();
        const buildingTypes = new Set();

        rawData.buildings.forEach(building => {
            // Extract tier
            if (building.tier) tiers.add(building.tier);

            // Extract building type
            const type = this.getBuildingType(building);
            buildingTypes.add(type);

            // Extract resources and construction materials
            if (building.resourceExtractionRate) {
                Object.keys(building.resourceExtractionRate).forEach(resource =>
                    allResources.add(resource));
            }

            if (building.constructionCost) {
                Object.keys(building.constructionCost).forEach(material =>
                    constructionMaterials.add(material));
            }

            // Group by type for categories
            if (!categories.has(type)) {
                categories.set(type, []);
            }

            // Add processed building properties
            building.type = type;
            building.comesWithStake = building.addedTags?.includes('central-hub') || false;
            building.cannotRemove = building.addedTags?.includes('cannot-remove') || false;
            building.hasExtraction = building.resourceExtractionRate &&
                Object.keys(building.resourceExtractionRate).length > 0;

            categories.get(type).push(building);
        });

        const result = {
            categories: Array.from(categories.entries()).map(([name, buildings]) => ({
                name,
                buildings
            })),
            allBuildings: rawData.buildings,
            metadata: {
                tiers: Array.from(tiers).sort((a, b) => a - b),
                resources: Array.from(allResources),
                constructionMaterials: Array.from(constructionMaterials),
                buildingTypes: Array.from(buildingTypes)
            }
        };

        console.log(`✅ Processed ${result.allBuildings.length} buildings into ${result.categories.length} categories`);

        return result;
    }

    /**
     * Process ship data into explorer-friendly format
     */
    static processShipData(rawData) {
        if (!rawData || !Array.isArray(rawData.ships)) {
            return {
                ships: [],
                metadata: rawData?.metadata || {},
                shipCount: 0,
                lastUpdated: rawData?.lastUpdated || null,
                shipIndex: {},
                statRanges: {},
                distributions: {},
                componentUsage: { categories: {}, slots: {} },
                configStats: { totalConfigurations: 0, averageComponentsPerConfig: 0, averageSlotFillRate: 0 }
            };
        }

        const shipIndex = {};
        const manufacturerCounts = {};
        const specCounts = {};
        const sizeTierCounts = {};
        const classCounts = {};
        const statRanges = {};
        const componentCategoryUsage = {};
        const componentSlotUsage = {};

        let totalConfigurations = 0;
        let totalFilledSlots = 0;
        let totalSlots = 0;

        const rangePaths = [
            { key: 'cargoCapacity', path: ['stats', 'capacities', 'cargoCapacity'] },
            { key: 'fuelCapacity', path: ['stats', 'capacities', 'fuelCapacity'] },
            { key: 'ammoCapacity', path: ['stats', 'capacities', 'ammoCapacity'] },
            { key: 'warpSpeed', path: ['stats', 'travel', 'warpSpeed'] },
            { key: 'subwarpSpeed', path: ['stats', 'travel', 'subwarpSpeed'] },
            { key: 'maxWarpDistance', path: ['stats', 'travel', 'maxWarpDistance'] },
            { key: 'warpFuelConsumption', path: ['stats', 'travel', 'warpFuelConsumption'] },
            { key: 'subwarpFuelConsumption', path: ['stats', 'travel', 'subwarpFuelConsumption'] },
            { key: 'planetExitFuel', path: ['stats', 'travel', 'planetExitFuel'] },
            { key: 'warpLaneSpeed', path: ['stats', 'travel', 'warpLaneSpeed'] },
            { key: 'warpLaneFee', path: ['stats', 'travel', 'warpLaneFee'] },
            { key: 'damage', path: ['stats', 'combat', 'damage'] },
            { key: 'damageRange', path: ['stats', 'combat', 'damageRange'] },
            { key: 'hitPoints', path: ['stats', 'combat', 'hitPoints'] },
            { key: 'shieldPoints', path: ['stats', 'combat', 'shieldPoints'] },
            { key: 'shieldRechargeRate', path: ['stats', 'combat', 'shieldRechargeRate'] },
            { key: 'missilePower', path: ['stats', 'combat', 'missilePower'] },
            { key: 'stealthPower', path: ['stats', 'combat', 'stealthPower'] },
            { key: 'scanPower', path: ['stats', 'scanning', 'scanPower'] },
            { key: 'scanCoolDown', path: ['stats', 'scanning', 'scanCoolDown'] },
            { key: 'repairCost', path: ['stats', 'repair', 'repairCost'] },
            { key: 'repairRate', path: ['stats', 'repair', 'repairRate'] },
            { key: 'repairAbility', path: ['stats', 'repair', 'repairAbility'] },
            { key: 'repairEfficiency', path: ['stats', 'repair', 'repairEfficiency'] }
        ];

        const updateRange = (key, value) => {
            if (typeof value !== 'number' || Number.isNaN(value)) {
                return;
            }
            if (!statRanges[key]) {
                statRanges[key] = { min: value, max: value };
            } else {
                statRanges[key].min = Math.min(statRanges[key].min, value);
                statRanges[key].max = Math.max(statRanges[key].max, value);
            }
        };

        rawData.ships.forEach((ship) => {
            if (!ship) {
                return;
            }

            if (ship.id) {
                shipIndex[ship.id] = ship;
            }

            if (ship.manufacturer) {
                manufacturerCounts[ship.manufacturer] = (manufacturerCounts[ship.manufacturer] || 0) + 1;
            }

            if (ship.spec) {
                specCounts[ship.spec] = (specCounts[ship.spec] || 0) + 1;
            }

            if (ship.sizeTier) {
                sizeTierCounts[ship.sizeTier] = (sizeTierCounts[ship.sizeTier] || 0) + 1;
            }

            if (ship.class !== null && ship.class !== undefined) {
                classCounts[ship.class] = (classCounts[ship.class] || 0) + 1;
            }

            rangePaths.forEach(({ key, path }) => {
                let value = ship;

                for (const segment of path) {
                    if (value && Object.prototype.hasOwnProperty.call(value, segment)) {
                        value = value[segment];
                    } else {
                        value = undefined;
                        break;
                    }
                }

                if (typeof value === 'number' && !Number.isNaN(value)) {
                    updateRange(key, value);
                }
            });

            const configurations = Array.isArray(ship.configurations) ? ship.configurations : [];
            totalConfigurations += configurations.length;

            configurations.forEach((config) => {
                const summary = config?.summary || {};
                if (summary.totalFilled) {
                    totalFilledSlots += summary.totalFilled;
                }
                if (summary.totalSlots) {
                    totalSlots += summary.totalSlots;
                }

                if (summary.byCategory) {
                    Object.entries(summary.byCategory).forEach(([category, data]) => {
                        if (!componentCategoryUsage[category]) {
                            componentCategoryUsage[category] = { filled: 0, slots: 0 };
                        }
                        componentCategoryUsage[category].filled += data?.filled || 0;
                        componentCategoryUsage[category].slots += data?.slots || 0;
                    });
                }

                const components = config?.components || {};
                Object.entries(components).forEach(([category, slots]) => {
                    Object.entries(slots || {}).forEach(([slotName, detail]) => {
                        const usageKey = `${category}::${slotName}`;
                        if (!componentSlotUsage[usageKey]) {
                            componentSlotUsage[usageKey] = { filled: 0, slots: 0 };
                        }
                        componentSlotUsage[usageKey].filled += detail?.items?.length || 0;
                        componentSlotUsage[usageKey].slots += detail?.totalSlots || 0;
                    });
                });
            });
        });

        const componentUsage = {
            categories: componentCategoryUsage,
            slots: componentSlotUsage
        };

        const configStats = {
            totalConfigurations,
            averageComponentsPerConfig: totalConfigurations > 0
                ? Number((totalFilledSlots / totalConfigurations).toFixed(2))
                : 0,
            averageSlotFillRate: totalSlots > 0
                ? Number(((totalFilledSlots / totalSlots) * 100).toFixed(2))
                : 0
        };

        const metadata = rawData.metadata || {};
        if (metadata.manufacturers) {
            metadata.manufacturers = metadata.manufacturers.slice().sort((a, b) => a.localeCompare(b));
        }
        if (metadata.specs) {
            metadata.specs = metadata.specs.slice().sort((a, b) => a.localeCompare(b));
        }
        if (metadata.sizeTiers) {
            metadata.sizeTiers = metadata.sizeTiers.slice();
        }
        if (metadata.classes) {
            metadata.classes = metadata.classes.slice().sort((a, b) => a - b);
        }

        return {
            ships: rawData.ships,
            metadata,
            shipCount: rawData.shipCount || rawData.ships.length,
            lastUpdated: rawData.lastUpdated || null,
            shipIndex,
            statRanges,
            distributions: {
                manufacturers: manufacturerCounts,
                specs: specCounts,
                sizeTiers: sizeTierCounts,
                classes: classCounts
            },
            componentUsage,
            configStats
        };
    }

    /**
     * Get recipe type classification
     */
    static getRecipeType(outputType) {
        switch (outputType) {
            case 'BUILDING': return 'final';
            case 'COMPONENT': return 'intermediate';
            case 'RESOURCE': return 'raw';
            default: return 'intermediate';
        }
    }

    /**
     * Get category icon
     */
    static getCategoryIcon(category) {
        const iconMap = {
            'Component': '🔧',
            'Infrastructure': '🏭',
            'Defense': '🛡️',
            'Resource': '📦',
            'Other': '📦'
        };
        return iconMap[category] || '📦';
    }

    /**
     * Get building type from building data
     */
    static getBuildingType(building) {
        // Determine building type based on properties
        if (building.addedTags?.includes('central-hub')) {
            return 'Hub';
        } else if (building.resourceExtractionRate && Object.keys(building.resourceExtractionRate).length > 0) {
            return 'Extraction';
        } else if (building.power && building.power > 0) {
            return 'Power';
        } else if (building.storage && building.storage > 0) {
            return 'Storage';
        } else {
            return 'Other';
        }
    }

    /**
     * Get empty data structure for fallback
     */
    static getEmptyDataStructure(explorerType) {
        switch (explorerType.toLowerCase()) {
            case 'recipe':
                return { categories: [] };
            case 'claimstake':
                return {
                    categories: [],
                    allBuildings: [],
                    metadata: { tiers: [], resources: [], constructionMaterials: [], buildingTypes: [] }
                };
            case 'planet':
                return { mapData: [], totalSystems: 0 };
            case 'resources':
                return { resources: [] };
            case 'ship':
            case 'ships':
                return {
                    ships: [],
                    metadata: {},
                    shipCount: 0,
                    lastUpdated: null,
                    shipIndex: {},
                    statRanges: {},
                    distributions: {},
                    componentUsage: { categories: {}, slots: {} },
                    configStats: { totalConfigurations: 0, averageComponentsPerConfig: 0, averageSlotFillRate: 0 }
                };
            default:
                return {};
        }
    }
}
