/**
 * CrossExplorerAnalytics - Shared utility for cross-data analysis
 * Combines data from Ships, Planets, Resources, Recipes, and Buildings
 */

class CrossExplorerAnalytics {
    constructor() {
        this.dataCache = {
            ships: null,
            planets: null,
            resources: null,
            recipes: null,
            buildings: null,
            resourceTierData: null
        };
        this.dataLoader = window.DataLoader || null;
    }

    /**
     * Load all necessary data for cross-analytics
     */
    async loadAllData() {
        try {
            console.log('🔄 Loading all data for cross-explorer analytics...');

            // Load data in parallel
            const [shipsData, planetsData, resourcesData, recipesData, buildingsData, resourceTierData] = await Promise.all([
                this.loadShipData(),
                this.loadPlanetData(),
                this.loadResourceData(),
                this.loadRecipeData(),
                this.loadBuildingData(),
                this.loadResourceTierData()
            ]);

            console.log('✅ All cross-explorer data loaded');
            return true;
        } catch (error) {
            console.error('❌ Error loading cross-explorer data:', error);
            return false;
        }
    }

    async loadShipData() {
        if (this.dataCache.ships) return this.dataCache.ships;

        try {
            const response = await fetch('../Data/ships-data.json');
            if (!response.ok) throw new Error('Failed to load ships data');
            const data = await response.json();
            this.dataCache.ships = data.ships || [];
            return this.dataCache.ships;
        } catch (error) {
            console.error('Error loading ships data:', error);
            this.dataCache.ships = [];
            return [];
        }
    }

    async loadPlanetData() {
        if (this.dataCache.planets) return this.dataCache.planets;

        try {
            const response = await fetch('../JSON/planets.json');
            if (!response.ok) throw new Error('Failed to load planets data');
            const data = await response.json();
            this.dataCache.planets = data.mapData || [];
            return this.dataCache.planets;
        } catch (error) {
            console.error('Error loading planets data:', error);
            this.dataCache.planets = [];
            return [];
        }
    }

    async loadResourceData() {
        if (this.dataCache.resources) return this.dataCache.resources;

        try {
            const response = await fetch('../JSON/resources.json');
            if (!response.ok) throw new Error('Failed to load resources data');
            const data = await response.json();
            this.dataCache.resources = data.resources || [];
            return this.dataCache.resources;
        } catch (error) {
            console.error('Error loading resources data:', error);
            this.dataCache.resources = [];
            return [];
        }
    }

    async loadRecipeData() {
        if (this.dataCache.recipes) return this.dataCache.recipes;

        try {
            const response = await fetch('../JSON/recipes.json');
            if (!response.ok) throw new Error('Failed to load recipes data');
            const data = await response.json();
            this.dataCache.recipes = data.recipes || [];
            return this.dataCache.recipes;
        } catch (error) {
            console.error('Error loading recipes data:', error);
            this.dataCache.recipes = [];
            return [];
        }
    }

    async loadBuildingData() {
        if (this.dataCache.buildings) return this.dataCache.buildings;

        try {
            const response = await fetch('../JSON/buildings.json');
            if (!response.ok) throw new Error('Failed to load buildings data');
            const data = await response.json();
            this.dataCache.buildings = data.buildings || [];
            return this.dataCache.buildings;
        } catch (error) {
            console.error('Error loading buildings data:', error);
            this.dataCache.buildings = [];
            return [];
        }
    }

    async loadResourceTierData() {
        if (this.dataCache.resourceTierData) return this.dataCache.resourceTierData;

        try {
            const response = await fetch('../JSON/resource_tier_analysis.json');
            if (!response.ok) throw new Error('Failed to load resource tier data');
            this.dataCache.resourceTierData = await response.json();
            return this.dataCache.resourceTierData;
        } catch (error) {
            console.warn('Resource tier data not available:', error);
            this.dataCache.resourceTierData = null;
            return null;
        }
    }

    /**
     * ANALYTICS 1: Resource Flow Analysis
     * Complete supply chain from raw resources to final products
     */
    async analyzeResourceFlow() {
        await this.loadAllData();

        const resourceUsage = new Map(); // resource -> {usedInRecipes: [], extractedBy: [], consumedBy: []}
        const resources = this.dataCache.resources;
        const recipes = this.dataCache.recipes;
        const buildings = this.dataCache.buildings;

        // Initialize all resources
        resources.forEach(resource => {
            resourceUsage.set(resource.name, {
                resourceData: resource,
                usedInRecipes: [],
                extractedBy: [],
                consumedBy: [],
                finalProducts: [],
                supplyChainDepth: 0
            });
        });

        // Analyze recipe usage
        recipes.forEach(recipe => {
            if (recipe.ingredients) {
                recipe.ingredients.forEach(ingredient => {
                    const usage = resourceUsage.get(ingredient.name);
                    if (usage) {
                        usage.usedInRecipes.push({
                            recipe: recipe.outputName,
                            recipeId: recipe.outputId,  // Add recipe ID for linking to Recipe Explorer
                            quantity: ingredient.quantity,
                            outputTier: recipe.outputTier
                        });
                    }
                });
            }

            // Track final products
            const outputUsage = resourceUsage.get(recipe.outputName);
            if (outputUsage) {
                outputUsage.finalProducts.push(recipe);
            }
        });

        // Analyze building extraction/consumption
        buildings.forEach(building => {
            if (building.resourceExtractionRate) {
                Object.entries(building.resourceExtractionRate).forEach(([resource, rate]) => {
                    const usage = resourceUsage.get(resource);
                    if (usage) {
                        usage.extractedBy.push({
                            building: building.name,
                            rate: rate,
                            tier: building.tier
                        });
                    }
                });
            }

            if (building.resourceRate) {
                Object.entries(building.resourceRate).forEach(([resource, rate]) => {
                    const usage = resourceUsage.get(resource);
                    if (usage) {
                        usage.consumedBy.push({
                            building: building.name,
                            rate: Math.abs(rate),
                            tier: building.tier
                        });
                    }
                });
            }
        });

        // Calculate supply chain depth (how many processing steps from raw to final)
        const calculateDepth = (resourceName, visited = new Set()) => {
            if (visited.has(resourceName)) return 0;
            visited.add(resourceName);

            const usage = resourceUsage.get(resourceName);
            if (!usage || usage.usedInRecipes.length === 0) return 0;

            let maxDepth = 0;
            usage.usedInRecipes.forEach(recipeUse => {
                const depth = 1 + calculateDepth(recipeUse.recipe, new Set(visited));
                maxDepth = Math.max(maxDepth, depth);
            });

            return maxDepth;
        };

        resourceUsage.forEach((usage, resourceName) => {
            usage.supplyChainDepth = calculateDepth(resourceName);
        });

        // Calculate criticality score
        const flowAnalysis = Array.from(resourceUsage.entries()).map(([name, usage]) => {
            const criticalityScore =
                usage.usedInRecipes.length * 10 +
                usage.extractedBy.length * 5 +
                usage.consumedBy.length * 3 +
                usage.supplyChainDepth * 2;

            return {
                name,
                ...usage,
                criticalityScore,
                demandScore: usage.usedInRecipes.length + usage.consumedBy.length,
                supplyScore: usage.extractedBy.length
            };
        });

        return {
            resourceUsage: flowAnalysis,
            bottlenecks: flowAnalysis.filter(r => r.demandScore > r.supplyScore * 2),
            criticalResources: flowAnalysis.sort((a, b) => b.criticalityScore - a.criticalityScore).slice(0, 30)
        };
    }

    /**
     * ANALYTICS 2: Planet-to-Product Optimization
     * Best planets for specific manufacturing chains
     */
    async analyzePlanetProductOptimization() {
        await this.loadAllData();

        const planets = this.dataCache.planets;
        const recipes = this.dataCache.recipes;
        const buildings = this.dataCache.buildings;
        const resourceTierData = this.dataCache.resourceTierData;

        const planetScores = [];

        planets.forEach(system => {
            if (!system.planets) return;

            system.planets.forEach(planet => {
                if (!planet.resources) return;

                // Get available resources on this planet
                const availableResources = new Set(planet.resources.map(r => r.name));

                // Depth-aware manufacturability calculation (matches manufacturing-analytics.js)
                const planetTypeName = this.getPlanetTypeName(planet.type);
                // Strip faction prefix (e.g., "UST Terrestrial Planet" -> "Terrestrial Planet")
                const planetTypeWithoutFaction = planetTypeName.replace(/^(ONI|MUD|UST|USTUR)\s+/, '');
                const planetTypeNameLower = planetTypeWithoutFaction.toLowerCase();

                const matchesPlanetType = (recipe) => {
                    if (!recipe.planetTypes || recipe.planetTypes.length === 0) {
                        return true;
                    }
                    return recipe.planetTypes.some(type => {
                        const lower = type.toLowerCase();
                        return lower.includes(planetTypeNameLower) || planetTypeNameLower.includes(lower);
                    });
                };

                const relevantRecipes = recipes.filter(recipe =>
                    recipe.ingredients &&
                    recipe.ingredients.length > 0 &&
                    matchesPlanetType(recipe)
                );

                const maxDepthIterations = 6;
                const availableItems = new Set(availableResources);
                const remaining = [...relevantRecipes];
                const manufacturableRecipes = [];

                let depth = 1;
                while (remaining.length > 0 && depth <= maxDepthIterations) {
                    const nextRemaining = [];
                    const newlyManufacturable = [];

                    for (const recipe of remaining) {
                        const canManufacture = recipe.ingredients.every(ingredient =>
                            availableItems.has(ingredient.name)
                        );
                        if (canManufacture) {
                            newlyManufacturable.push({ ...recipe, depth });
                        } else {
                            nextRemaining.push(recipe);
                        }
                    }

                    if (newlyManufacturable.length === 0) {
                        break;
                    }

                    newlyManufacturable.forEach(recipe => {
                        manufacturableRecipes.push(recipe);

                        // Add recipe outputs to available items for next depth
                        const outputs = new Set();
                        if (recipe.outputName) {
                            outputs.add(recipe.outputName);
                        }
                        if (Array.isArray(recipe.outputs)) {
                            recipe.outputs.forEach(output => {
                                if (output && output.name) {
                                    outputs.add(output.name);
                                }
                            });
                        }
                        outputs.forEach(item => availableItems.add(item));
                    });

                    remaining.length = 0;
                    remaining.push(...nextRemaining);
                    depth += 1;
                }

                // Calculate self-sufficiency score (depth-aware)
                const totalRecipes = recipes.length;
                const selfSufficiencyScore = (manufacturableRecipes.length / totalRecipes) * 100;

                // DEBUG: Log for first few planets to verify calculation
                if (planet.name === '016-UST-KING-01-P8') {
                    console.log(`[CrossExplorerAnalytics] Planet: ${planet.name}`);
                    console.log(`  Planet type ID: ${planet.type}`);
                    console.log(`  Planet type name (full): ${planetTypeName}`);
                    console.log(`  Planet type name (stripped): ${planetTypeWithoutFaction}`);
                    console.log(`  Available resources (${availableResources.size}):`, Array.from(availableResources).slice(0, 5));
                    console.log(`  Total recipes in game: ${totalRecipes}`);
                    console.log(`  Recipes with ingredients: ${recipes.filter(r => r.ingredients && r.ingredients.length > 0).length}`);
                    console.log(`  Relevant recipes (matching planet type): ${relevantRecipes.length}`);
                    if (relevantRecipes.length > 0) {
                        console.log(`  Sample relevant recipe:`, relevantRecipes[0]);
                    }
                    console.log(`  Manufacturable recipes: ${manufacturableRecipes.length}`);
                    console.log(`  Self-Sufficiency: ${selfSufficiencyScore.toFixed(3)}%`);
                }

                // Calculate specialization (what this planet is best at)
                const specializationMap = new Map();
                manufacturableRecipes.forEach(recipe => {
                    const type = recipe.resourceType || 'General';
                    specializationMap.set(type, (specializationMap.get(type) || 0) + 1);
                });

                const topSpecialization = Array.from(specializationMap.entries())
                    .sort((a, b) => b[1] - a[1])[0];

                planetScores.push({
                    system: system.name,
                    planet: planet.name,
                    planetType: planet.type,
                    totalResources: planet.resources.length,
                    availableResources: Array.from(availableResources),
                    manufacturableRecipes: manufacturableRecipes.length,
                    selfSufficiencyScore,
                    topSpecialization: topSpecialization ? {
                        type: topSpecialization[0],
                        count: topSpecialization[1]
                    } : null,
                    strategicScore: system.strategicScore || 0
                });
            });
        });

        return {
            planetScores: planetScores.sort((a, b) => b.selfSufficiencyScore - a.selfSufficiencyScore),
            topManufacturingPlanets: planetScores.slice(0, 30),
            specializedPlanets: this.groupBySpecialization(planetScores)
        };
    }

    /**
     * ANALYTICS 3: Economic Profitability Dashboard
     * Most profitable manufacturing chains
     */
    async analyzeEconomicProfitability() {
        await this.loadAllData();

        const recipes = this.dataCache.recipes;
        const resources = this.dataCache.resources;
        const planets = this.dataCache.planets;

        // Create resource value lookup
        const resourceValues = new Map();
        resources.forEach(r => resourceValues.set(r.name, r.baseValue || 0));

        const profitabilityAnalysis = recipes.map(recipe => {
            if (!recipe.ingredients || recipe.ingredients.length === 0) return null;

            // Calculate input cost
            const inputCost = recipe.ingredients.reduce((sum, ing) => {
                const value = resourceValues.get(ing.name) || 0;
                return sum + (value * ing.quantity);
            }, 0);

            // Calculate output value (estimated)
            const outputValue = resourceValues.get(recipe.outputName) || inputCost * 1.5;

            // Calculate profit metrics
            const profit = outputValue - inputCost;
            const profitMargin = inputCost > 0 ? (profit / inputCost) * 100 : 0;
            const timeAdjustedProfit = recipe.constructionTime > 0 ?
                (profit / recipe.constructionTime) * 3600 : 0; // Per hour

            const valueDensity = recipe.ingredients.length > 0 ?
                outputValue / recipe.ingredients.length : 0;

            return {
                recipe: recipe.outputName,
                recipeData: recipe,
                inputCost,
                outputValue,
                profit,
                profitMargin,
                timeAdjustedProfit,
                valueDensity,
                constructionTime: recipe.constructionTime,
                tier: recipe.outputTier
            };
        }).filter(Boolean);

        return {
            profitableRecipes: profitabilityAnalysis
                .sort((a, b) => b.profit - a.profit)
                .slice(0, 50),
            bestMargins: profitabilityAnalysis
                .sort((a, b) => b.profitMargin - a.profitMargin)
                .slice(0, 30),
            bestTimeAdjusted: profitabilityAnalysis
                .sort((a, b) => b.timeAdjustedProfit - a.timeAdjustedProfit)
                .slice(0, 30),
            highestValueDensity: profitabilityAnalysis
                .sort((a, b) => b.valueDensity - a.valueDensity)
                .slice(0, 30)
        };
    }

    /**
     * ANALYTICS 4: Fleet Resource Footprint
     * Total resource requirements for fleet construction and operation
     */
    async analyzeFleetResourceFootprint() {
        await this.loadAllData();

        const ships = this.dataCache.ships;
        const resources = this.dataCache.resources;

        // Create resource value lookup
        const resourceValues = new Map();
        resources.forEach(r => resourceValues.set(r.name, r.baseValue || 0));

        // Analyze each ship configuration separately
        const shipConstructionCosts = [];
        ships.forEach(ship => {
            const configurations = ship.configurations || [];

            // Create a row for each configuration
            configurations.forEach(config => {
                let totalComponents = 0;
                let totalConstructionTime = 0;
                const resourceMap = new Map();

                // Count components in this configuration
                if (config.components) {
                    Object.values(config.components).forEach(category => {
                        if (category && typeof category === 'object') {
                            Object.values(category).forEach(slot => {
                                if (slot && Array.isArray(slot.items)) {
                                    totalComponents += slot.items.length;
                                }
                            });
                        }
                    });
                }

                // Estimate resource costs for this configuration (simplified)
                const estimatedResources = Math.max(totalComponents * 100, 1000);
                resourceMap.set('Estimated Total', estimatedResources);

                if (totalComponents > 0) {
                    shipConstructionCosts.push({
                        id: ship.id,
                        configName: config.name || 'Default',
                        name: ship.name,
                        manufacturer: ship.manufacturer,
                        sizeTier: ship.sizeTier,
                        componentCount: totalComponents,
                        totalConstructionTime: totalConstructionTime || 3600,
                        totalResourceCost: estimatedResources,
                        uniqueResourceCount: 1,
                        resourceBreakdown: [{ name: 'Estimated Total', amount: estimatedResources, tier: 3 }]
                    });
                }
            });
        });

        // Analyze operating costs
        const shipOperatingCosts = ships.map(ship => {
            const crewRequired = ship.crew?.required || 0;
            const cargoCapacity = ship.stats?.capacities?.cargoCapacity || 0;
            const warpSpeed = ship.stats?.travel?.warpSpeed || 0;
            const warpFuelConsumption = ship.stats?.travel?.warpFuelConsumption || 1;
            const subwarpSpeed = ship.stats?.travel?.subwarpSpeed || 0;
            const subwarpFuelConsumption = ship.stats?.travel?.subwarpFuelConsumption || 1;
            const maxWarpDistance = ship.stats?.travel?.maxWarpDistance || 0;

            // Calculate fuel efficiency
            const warpEfficiency = maxWarpDistance > 0 && warpFuelConsumption > 0 ?
                maxWarpDistance / warpFuelConsumption : 0;
            const subwarpEfficiency = subwarpSpeed > 0 && subwarpFuelConsumption > 0 ?
                subwarpSpeed / subwarpFuelConsumption : 0;
            const fuelEfficiency = warpEfficiency + subwarpEfficiency;

            const warpFuelPerDistance = maxWarpDistance > 0 ?
                warpFuelConsumption / maxWarpDistance : 0;

            // Calculate operational complexity
            const operationalComplexity =
                (ship.configurations?.[0]?.components ? Object.keys(ship.configurations[0].components).length : 0) * 0.5 +
                crewRequired * 0.3 +
                5 * 0.2;

            // Calculate combat power
            const hitPoints = ship.stats?.combat?.hitPoints || 0;
            const shieldPoints = ship.stats?.combat?.shieldPoints || 0;
            const damage = ship.stats?.combat?.damage || 0;
            const combatPower = hitPoints * 0.3 + shieldPoints * 0.3 + damage * 0.4;

            return {
                id: ship.id,
                name: ship.name,
                manufacturer: ship.manufacturer,
                sizeTier: ship.sizeTier,
                crewRequired,
                fuelEfficiency,
                warpFuelPerDistance,
                operationalComplexity,
                cargoCapacity,
                combatPower,
                warpSpeed
            };
        }).filter(s => s.crewRequired > 0 || s.fuelEfficiency > 0);

        // Get capability leaders
        const fleetCapabilityRankings = {
            cargoLeaders: [...ships]
                .filter(s => s.stats?.capacities?.cargoCapacity)
                .sort((a, b) => (b.stats.capacities.cargoCapacity || 0) - (a.stats.capacities.cargoCapacity || 0))
                .slice(0, 10)
                .map(s => ({
                    name: s.name,
                    manufacturer: s.manufacturer,
                    sizeTier: s.sizeTier,
                    cargoCapacity: s.stats.capacities.cargoCapacity
                })),
            combatLeaders: [...ships]
                .map(s => {
                    const hp = s.stats?.combat?.hitPoints || 0;
                    const shields = s.stats?.combat?.shieldPoints || 0;
                    const dmg = s.stats?.combat?.damage || 0;
                    return { ...s, combatPower: hp * 0.3 + shields * 0.3 + dmg * 0.4 };
                })
                .filter(s => s.combatPower > 0)
                .sort((a, b) => b.combatPower - a.combatPower)
                .slice(0, 10)
                .map(s => ({
                    name: s.name,
                    manufacturer: s.manufacturer,
                    sizeTier: s.sizeTier,
                    combatPower: s.combatPower
                })),
            speedLeaders: [...ships]
                .filter(s => s.stats?.travel?.warpSpeed)
                .sort((a, b) => (b.stats.travel.warpSpeed || 0) - (a.stats.travel.warpSpeed || 0))
                .slice(0, 10)
                .map(s => ({
                    name: s.name,
                    manufacturer: s.manufacturer,
                    sizeTier: s.sizeTier,
                    warpSpeed: s.stats.travel.warpSpeed
                })),
            fuelEfficiencyLeaders: [...shipOperatingCosts]
                .sort((a, b) => b.fuelEfficiency - a.fuelEfficiency)
                .slice(0, 10)
        };

        // Calculate insights
        const insights = {
            mostExpensiveShip: shipConstructionCosts.sort((a, b) => b.totalResourceCost - a.totalResourceCost)[0],
            highestCrewRequirement: shipOperatingCosts.sort((a, b) => b.crewRequired - a.crewRequired)[0],
            bestFuelEfficiency: shipOperatingCosts.sort((a, b) => b.fuelEfficiency - a.fuelEfficiency)[0],
            fastestWarpSpeed: fleetCapabilityRankings.speedLeaders[0],
            largestCargo: fleetCapabilityRankings.cargoLeaders[0],
            highestCombatPower: fleetCapabilityRankings.combatLeaders[0]
        };

        // Calculate summary stats
        const totalComponents = shipConstructionCosts.reduce((sum, s) => sum + s.componentCount, 0);
        const uniqueResources = new Set();
        shipConstructionCosts.forEach(s => {
            s.resourceBreakdown.forEach(r => uniqueResources.add(r.name));
        });

        return {
            stats: {
                totalShips: ships.length,
                averageComponents: totalComponents / ships.length,
                totalComponents,
                uniqueResources: uniqueResources.size
            },
            shipConstructionCosts: shipConstructionCosts.sort((a, b) => b.totalResourceCost - a.totalResourceCost),
            shipOperatingCosts: shipOperatingCosts.sort((a, b) =>
                (b.crewRequired + b.operationalComplexity) - (a.crewRequired + a.operationalComplexity)
            ),
            fleetCapabilityRankings,
            insights
        };
    }

    /**
     * Helper: Get planet type name from type ID (using global utility)
     */
    getPlanetTypeName(typeId) {
        // Use global getPlanetTypeName if available
        if (typeof getPlanetTypeName === 'function') {
            return getPlanetTypeName(typeId);
        }
        // Fallback to basic types
        const types = {
            1: 'Terrestrial Planet', 2: 'Desert Planet', 3: 'Ice Planet',
            4: 'Oceanic Planet', 5: 'Volcanic Planet', 6: 'Gas Giant',
            7: 'Rocky Planet', 8: 'Toxic Planet', 9: 'Barren Planet',
            10: 'Forest Planet', 11: 'Tundra Planet', 12: 'Jungle Planet',
            13: 'Swamp Planet', 14: 'Lava Planet', 15: 'Crystalline Planet'
        };
        return types[typeId] || `Type ${typeId}`;
    }

    /**
     * Helper: Group planets by specialization
     */
    groupBySpecialization(planetScores) {
        const grouped = new Map();

        planetScores.forEach(planet => {
            if (planet.topSpecialization) {
                const type = planet.topSpecialization.type;
                if (!grouped.has(type)) {
                    grouped.set(type, []);
                }
                grouped.get(type).push(planet);
            }
        });

        return Array.from(grouped.entries()).map(([type, planets]) => ({
            specialization: type,
            planetCount: planets.length,
            topPlanets: planets.sort((a, b) =>
                b.topSpecialization.count - a.topSpecialization.count
            ).slice(0, 10)
        }));
    }

    /**
     * ANALYTICS 5: Component Sourcing Strategy
     * Optimal locations for ship component manufacturing
     */
    async analyzeComponentSourcing() {
        await this.loadAllData();

        const recipes = this.dataCache.recipes;
        const planets = this.dataCache.planets;

        // Filter recipes for ship components
        const componentRecipes = recipes.filter(r =>
            r.outputType === 'COMPONENT' || r.resourceType === 'Ship Component'
        );

        const sourcingStrategies = componentRecipes.map(recipe => {
            // Find planets that can produce this component
            const viablePlanets = [];

            planets.forEach(system => {
                if (!system.planets) return;

                system.planets.forEach(planet => {
                    if (!planet.resources) return;

                    const availableResources = new Set(planet.resources.map(r => r.name));
                    const matchedIngredients = recipe.ingredients?.filter(ing =>
                        availableResources.has(ing.name)
                    ) || [];

                    if (matchedIngredients.length > 0) {
                        const completeness = recipe.ingredients ?
                            (matchedIngredients.length / recipe.ingredients.length) * 100 : 0;

                        viablePlanets.push({
                            system: system.name,
                            planet: planet.name,
                            completeness,
                            matchedIngredients: matchedIngredients.length,
                            totalIngredients: recipe.ingredients?.length || 0
                        });
                    }
                });
            });

            return {
                component: recipe.outputName,
                tier: recipe.outputTier,
                constructionTime: recipe.constructionTime,
                viablePlanets: viablePlanets.sort((a, b) => b.completeness - a.completeness),
                bestLocation: viablePlanets[0] || null,
                totalViableLocations: viablePlanets.length
            };
        });

        return {
            componentSourcing: sourcingStrategies,
            easiestToSource: sourcingStrategies
                .sort((a, b) => b.totalViableLocations - a.totalViableLocations)
                .slice(0, 30),
            hardestToSource: sourcingStrategies
                .sort((a, b) => a.totalViableLocations - b.totalViableLocations)
                .slice(0, 30)
        };
    }

    /**
     * ANALYTICS 6: Territory Control Value
     * Strategic value of controlling specific systems
     */
    async analyzeTerritoryControl() {
        await this.loadAllData();

        const planets = this.dataCache.planets;
        const resources = this.dataCache.resources;
        const recipes = this.dataCache.recipes;

        const territoryAnalysis = planets.map(system => {
            if (!system.planets) return null;

            // Collect all resources in system
            const systemResources = new Set();
            const resourceRichness = new Map();

            system.planets.forEach(planet => {
                if (planet.resources) {
                    planet.resources.forEach(resource => {
                        systemResources.add(resource.name);
                        const current = resourceRichness.get(resource.name) || [];
                        current.push(resource.richness);
                        resourceRichness.set(resource.name, current);
                    });
                }
            });

            // Calculate manufacturing capability
            const manufacturableRecipes = recipes.filter(recipe => {
                if (!recipe.ingredients) return false;
                const available = recipe.ingredients.filter(ing =>
                    systemResources.has(ing.name)
                ).length;
                return available === recipe.ingredients.length;
            });

            // Calculate average richness
            const avgRichness = Array.from(resourceRichness.values())
                .flat()
                .reduce((sum, r) => sum + r, 0) /
                (Array.from(resourceRichness.values()).flat().length || 1);

            // Count rare resources (tier 4-5)
            const rareResourceCount = Array.from(systemResources).filter(name => {
                const resource = resources.find(r => r.name === name);
                return resource && resource.tier >= 4;
            }).length;

            return {
                system: system.name,
                faction: system.closestFaction,
                strategicScore: system.strategicScore || 0,
                planetCount: system.planets.length,
                uniqueResources: systemResources.size,
                avgRichness: avgRichness.toFixed(2),
                manufacturingCapability: manufacturableRecipes.length,
                rareResourceCount,
                territoryValue:
                    systemResources.size * 10 +
                    manufacturableRecipes.length * 5 +
                    rareResourceCount * 20 +
                    avgRichness * 5
            };
        }).filter(Boolean);

        // Group by faction
        const factionTerritory = new Map();
        territoryAnalysis.forEach(territory => {
            if (!factionTerritory.has(territory.faction)) {
                factionTerritory.set(territory.faction, []);
            }
            factionTerritory.get(territory.faction).push(territory);
        });

        return {
            territoryAnalysis: territoryAnalysis.sort((a, b) => b.territoryValue - a.territoryValue),
            topSystems: territoryAnalysis.slice(0, 30),
            factionDominance: Array.from(factionTerritory.entries()).map(([faction, territories]) => ({
                faction,
                systemCount: territories.length,
                totalValue: territories.reduce((sum, t) => sum + t.territoryValue, 0),
                avgValue: territories.reduce((sum, t) => sum + t.territoryValue, 0) / territories.length,
                topSystems: territories.sort((a, b) => b.territoryValue - a.territoryValue).slice(0, 5)
            })).sort((a, b) => b.totalValue - a.totalValue)
        };
    }

    /**
     * ANALYTICS 7: Competitive Advantage Matrix
     * Faction-based resource control and manufacturing capabilities
     */
    async analyzeCompetitiveAdvantage() {
        await this.loadAllData();

        const planets = this.dataCache.planets;
        const resources = this.dataCache.resources;
        const recipes = this.dataCache.recipes;

        // Initialize faction data
        const factionData = new Map();
        const resourceControl = new Map(); // resource -> {factions: {factionName: count}}

        // Analyze faction territories
        planets.forEach(system => {
            if (!system.planets) return;

            const faction = system.closestFaction || 'Unclaimed';

            if (!factionData.has(faction)) {
                factionData.set(faction, {
                    faction: faction,
                    systemCount: 0,
                    planetCount: 0,
                    resources: new Set(),
                    resourceCounts: new Map(),
                    manufacturableRecipes: new Set(),
                    totalValue: 0
                });
            }

            const data = factionData.get(faction);
            data.systemCount++;
            data.planetCount += system.planets.length;

            // Collect resources
            system.planets.forEach(planet => {
                if (planet.resources) {
                    planet.resources.forEach(resource => {
                        data.resources.add(resource.name);
                        data.resourceCounts.set(
                            resource.name,
                            (data.resourceCounts.get(resource.name) || 0) + 1
                        );

                        // Track global resource control
                        if (!resourceControl.has(resource.name)) {
                            resourceControl.set(resource.name, {});
                        }
                        const control = resourceControl.get(resource.name);
                        control[faction] = (control[faction] || 0) + 1;
                    });
                }
            });

            // Calculate manufacturing capability
            const systemResources = new Set();
            system.planets.forEach(planet => {
                if (planet.resources) {
                    planet.resources.forEach(r => systemResources.add(r.name));
                }
            });

            recipes.forEach(recipe => {
                if (!recipe.ingredients) return;
                const canMake = recipe.ingredients.every(ing =>
                    systemResources.has(ing.name)
                );
                if (canMake) {
                    data.manufacturableRecipes.add(recipe.outputName);
                }
            });
        });

        // Calculate faction manufacturing capabilities
        const factionManufacturing = Array.from(factionData.entries()).map(([faction, data]) => {
            const totalRecipes = recipes.length;
            const capability = (data.manufacturableRecipes.size / totalRecipes) * 100;

            return {
                faction,
                systemCount: data.systemCount,
                planetCount: data.planetCount,
                uniqueResources: data.resources.size,
                manufacturableRecipes: data.manufacturableRecipes.size,
                manufacturingCapability: capability
            };
        }).sort((a, b) => b.manufacturingCapability - a.manufacturingCapability);

        // Identify resource dominance (>50% control)
        const resourceDominance = Array.from(resourceControl.entries())
            .map(([resourceName, control]) => {
                const total = Object.values(control).reduce((sum, count) => sum + count, 0);
                const dominant = Object.entries(control)
                    .map(([faction, count]) => ({
                        faction,
                        count,
                        percentage: (count / total) * 100
                    }))
                    .sort((a, b) => b.percentage - a.percentage);

                const resource = resources.find(r => r.name === resourceName);

                return {
                    resource: resourceName,
                    tier: resource?.tier || 1,
                    dominantFaction: dominant[0],
                    allControl: dominant,
                    isMonopoly: dominant[0].percentage >= 75,
                    isDominated: dominant[0].percentage >= 50
                };
            })
            .filter(r => r.isDominated)
            .sort((a, b) => b.dominantFaction.percentage - a.dominantFaction.percentage);

        // Identify strategic vulnerabilities (dependencies)
        const vulnerabilities = Array.from(factionData.entries()).map(([faction, data]) => {
            const dependencies = [];

            // Check which critical resources this faction lacks
            recipes.forEach(recipe => {
                if (!recipe.ingredients) return;

                const missingIngredients = recipe.ingredients.filter(ing =>
                    !data.resources.has(ing.name)
                );

                if (missingIngredients.length > 0 && missingIngredients.length < recipe.ingredients.length) {
                    missingIngredients.forEach(ing => {
                        // Find who controls this resource
                        const control = resourceControl.get(ing.name);
                        if (control) {
                            const controllers = Object.entries(control)
                                .filter(([f, _]) => f !== faction)
                                .sort((a, b) => b[1] - a[1]);

                            if (controllers.length > 0) {
                                dependencies.push({
                                    resource: ing.name,
                                    dependsOn: controllers[0][0],
                                    recipeAffected: recipe.outputName
                                });
                            }
                        }
                    });
                }
            });

            // Count dependencies by faction
            const dependencyMap = new Map();
            dependencies.forEach(dep => {
                dependencyMap.set(dep.dependsOn, (dependencyMap.get(dep.dependsOn) || 0) + 1);
            });

            return {
                faction,
                totalDependencies: dependencies.length,
                uniqueResourceDependencies: new Set(dependencies.map(d => d.resource)).size,
                dependsOnFactions: Array.from(dependencyMap.entries())
                    .map(([f, count]) => ({ faction: f, dependencyCount: count }))
                    .sort((a, b) => b.dependencyCount - a.dependencyCount)
            };
        }).sort((a, b) => b.totalDependencies - a.totalDependencies);

        // Identify chokepoints (resources controlled by single faction with >90% control)
        const chokepoints = Array.from(resourceControl.entries())
            .map(([resourceName, control]) => {
                const total = Object.values(control).reduce((sum, count) => sum + count, 0);
                const entries = Object.entries(control);

                if (entries.length === 1 || (entries.length > 0 && (entries[0][1] / total) >= 0.9)) {
                    const controller = entries.sort((a, b) => b[1] - a[1])[0];
                    const resource = resources.find(r => r.name === resourceName);

                    // Count how many recipes need this resource
                    const recipesNeedingResource = recipes.filter(r =>
                        r.ingredients?.some(ing => ing.name === resourceName)
                    ).length;

                    return {
                        resource: resourceName,
                        tier: resource?.tier || 1,
                        controlledBy: controller[0],
                        controlPercentage: (controller[1] / total) * 100,
                        locationCount: controller[1],
                        recipesAffected: recipesNeedingResource,
                        strategicValue: recipesNeedingResource * (resource?.tier || 1)
                    };
                }
                return null;
            })
            .filter(Boolean)
            .sort((a, b) => b.strategicValue - a.strategicValue);

        return {
            factionManufacturing,
            resourceDominance,
            vulnerabilities,
            chokepoints,
            insights: {
                mostCapableFaction: factionManufacturing[0],
                mostVulnerableFaction: vulnerabilities[0],
                criticalChokepoint: chokepoints[0],
                totalMonopolies: resourceDominance.filter(r => r.isMonopoly).length
            }
        };
    }

    /**
     * ANALYTICS 8: Ship-to-Resource Efficiency
     * Analyze which ships provide best value for construction cost
     */
    async analyzeShipResourceEfficiency() {
        await this.loadAllData();

        const ships = this.dataCache.ships;

        // Try to get ShipExplorer's calculator if available
        const calculator = window.shipExplorer?.configCalculator;
        const hasCalculator = calculator &&
            calculator.componentsById &&
            Object.keys(calculator.componentsById).length > 0;

        console.log('[CrossExplorerAnalytics] Ship calculator available:', hasCalculator);
        if (hasCalculator) {
            console.log('[CrossExplorerAnalytics] Components loaded:', Object.keys(calculator.componentsById).length);
        }

        // Calculate efficiency metrics for each ship configuration
        const shipEfficiency = [];
        ships.forEach(ship => {
            const configurations = ship.configurations || [];

            // Create efficiency metrics for each configuration
            configurations.forEach(config => {
                let totalComponents = 0;

                // Count components in this configuration
                if (config.components) {
                    Object.values(config.components).forEach(category => {
                        if (category && typeof category === 'object') {
                            Object.values(category).forEach(slot => {
                                if (slot && Array.isArray(slot.items)) {
                                    totalComponents += slot.items.length;
                                }
                            });
                        }
                    });
                }

                if (totalComponents === 0) return; // Skip empty configurations

                const estimatedBuildCost = Math.max(totalComponents * 100, 1000);

                // Get modified stats for this configuration if calculator is available
                let cargoCapacity, hitPoints, shieldPoints, damage, warpSpeed, warpFuelConsumption, maxWarpDistance, crew;

                if (hasCalculator) {
                    try {
                        const calcResult = calculator.calculateModifiedStats(ship, config);
                        const values = calcResult.values || {};

                        // Use modified stats from calculator
                        cargoCapacity = values.cargo_capacity ?? ship.stats?.capacities?.cargoCapacity ?? 0;
                        hitPoints = values.hit_points ?? ship.stats?.combat?.hitPoints ?? 0;
                        shieldPoints = values.shield_points ?? ship.stats?.combat?.shieldPoints ?? 0;
                        damage = values.damage ?? ship.stats?.combat?.damage ?? 0;
                        warpSpeed = values.warp_speed ?? ship.stats?.travel?.warpSpeed ?? 0;
                        warpFuelConsumption = values.warp_fuel_consumption ?? ship.stats?.travel?.warpFuelConsumption ?? 1;
                        maxWarpDistance = values.max_warp_distance ?? ship.stats?.travel?.maxWarpDistance ?? 0;
                        crew = ship.crew?.required || 0;

                        // Debug log for first ship
                        if (ship.name === 'Rainbow Rainbow Phi (Titan)' && config.name) {
                            console.log(`[CrossExplorerAnalytics] ${ship.name} ${config.name}:`, {
                                cargo_capacity: values.cargo_capacity,
                                baseCargo: ship.stats?.capacities?.cargoCapacity,
                                finalCargo: cargoCapacity
                            });
                        }
                    } catch (error) {
                        console.error('[CrossExplorerAnalytics] Error calculating modified stats:', error);
                        // Fall back to base stats
                        cargoCapacity = ship.stats?.capacities?.cargoCapacity || 0;
                        hitPoints = ship.stats?.combat?.hitPoints || 0;
                        shieldPoints = ship.stats?.combat?.shieldPoints || 0;
                        damage = ship.stats?.combat?.damage || 0;
                        warpSpeed = ship.stats?.travel?.warpSpeed || 0;
                        warpFuelConsumption = ship.stats?.travel?.warpFuelConsumption || 1;
                        maxWarpDistance = ship.stats?.travel?.maxWarpDistance || 0;
                        crew = ship.crew?.required || 0;
                    }
                } else {
                    // Use base stats (calculator not available)
                    cargoCapacity = ship.stats?.capacities?.cargoCapacity || 0;
                    hitPoints = ship.stats?.combat?.hitPoints || 0;
                    shieldPoints = ship.stats?.combat?.shieldPoints || 0;
                    damage = ship.stats?.combat?.damage || 0;
                    warpSpeed = ship.stats?.travel?.warpSpeed || 0;
                    warpFuelConsumption = ship.stats?.travel?.warpFuelConsumption || 1;
                    maxWarpDistance = ship.stats?.travel?.maxWarpDistance || 0;
                    crew = ship.crew?.required || 0;
                }

                // Calculate efficiency ratios
                const cargoEfficiency = cargoCapacity > 0 ? cargoCapacity / estimatedBuildCost : 0;
                const combatPower = (hitPoints * 0.3) + (shieldPoints * 0.3) + (damage * 0.4);
                const combatEfficiency = combatPower > 0 ? combatPower / estimatedBuildCost : 0;
                const speedEfficiency = warpSpeed > 0 ? warpSpeed / estimatedBuildCost : 0;
                const fuelEfficiency = maxWarpDistance > 0 && warpFuelConsumption > 0 ? maxWarpDistance / warpFuelConsumption : 0;
                const crewEfficiency = crew > 0 ? estimatedBuildCost / crew : estimatedBuildCost;

                shipEfficiency.push({
                    id: ship.id,
                    configName: config.name || 'Default',
                    name: ship.name,
                    manufacturer: ship.manufacturer,
                    sizeTier: ship.sizeTier,
                    estimatedBuildCost,
                    cargoCapacity,
                    combatPower,
                    warpSpeed,
                    fuelEfficiency,
                    crew,
                    cargoEfficiency,
                    combatEfficiency,
                    speedEfficiency,
                    crewEfficiency
                });
            });
        });

        // Best cargo haulers (cargo per resource)
        const bestCargoHaulers = shipEfficiency
            .filter(s => s.cargoCapacity > 0)
            .sort((a, b) => b.cargoEfficiency - a.cargoEfficiency);

        // Best combat ships (combat power per resource)
        const bestCombatShips = shipEfficiency
            .filter(s => s.combatPower > 0)
            .sort((a, b) => b.combatEfficiency - a.combatEfficiency);

        // Best speed ships (speed per resource)
        const bestSpeedShips = shipEfficiency
            .filter(s => s.warpSpeed > 0)
            .sort((a, b) => b.speedEfficiency - a.speedEfficiency);

        // Most fuel efficient (distance per fuel)
        const mostFuelEfficient = shipEfficiency
            .filter(s => s.fuelEfficiency > 0)
            .sort((a, b) => b.fuelEfficiency - a.fuelEfficiency);

        // Best crew efficiency (build cost per crew member - lower is better)
        const bestCrewEfficiency = shipEfficiency
            .filter(s => s.crew > 0)
            .sort((a, b) => a.crewEfficiency - b.crewEfficiency)
            .slice(0, 20);

        // Mission recommendations
        const missionRecommendations = {
            exploration: mostFuelEfficient.slice(0, 5),
            combat: bestCombatShips.slice(0, 5),
            hauling: bestCargoHaulers.slice(0, 5),
            budget: bestCrewEfficiency.slice(0, 5)
        };

        return {
            bestCargoHaulers,
            bestCombatShips,
            bestSpeedShips,
            mostFuelEfficient,
            bestCrewEfficiency,
            missionRecommendations,
            insights: {
                mostEfficientHauler: bestCargoHaulers[0],
                mostEfficientCombat: bestCombatShips[0],
                mostEfficientSpeed: bestSpeedShips[0],
                mostEfficientFuel: mostFuelEfficient[0],
                mostEfficientCrew: bestCrewEfficiency[0]
            }
        };
    }

    /**
     * ANALYTICS 9: Trade Route Planner
     * Identify profitable trade routes based on resource scarcity
     */
    async analyzeTradeRoutes() {
        await this.loadAllData();

        const planets = this.dataCache.planets;
        const resources = this.dataCache.resources;

        // Build resource availability map
        const resourceLocations = new Map();

        planets.forEach(system => {
            if (!system.planets) return;

            system.planets.forEach(planet => {
                if (!planet.resources) return;

                planet.resources.forEach(resource => {
                    if (!resourceLocations.has(resource.name)) {
                        resourceLocations.set(resource.name, []);
                    }

                    resourceLocations.get(resource.name).push({
                        systemName: system.name,
                        planetName: planet.name,
                        richness: resource.richness || 1,
                        coordinates: system.coordinates
                    });
                });
            });
        });

        // Calculate scarcity and value
        const resourceAnalysis = Array.from(resourceLocations.entries()).map(([resourceName, locations]) => {
            const resource = resources.find(r => r.name === resourceName);
            const tier = resource?.tier || 1;
            const baseValue = resource?.value || 100;

            // Scarcity score (fewer locations = higher scarcity)
            const scarcityScore = Math.max(1, 100 - locations.length);

            // Average richness
            const avgRichness = locations.reduce((sum, loc) => sum + loc.richness, 0) / locations.length;

            return {
                resource: resourceName,
                tier,
                baseValue,
                locations: locations.length,
                scarcityScore,
                avgRichness,
                tradeValue: baseValue * (scarcityScore / 10) * avgRichness
            };
        }).sort((a, b) => b.tradeValue - a.tradeValue);

        // Identify profitable routes (resource is scarce at destination but abundant at source)
        const tradeRoutes = [];

        resourceAnalysis.forEach(resourceInfo => {
            const locations = resourceLocations.get(resourceInfo.resource);

            // Find pairs: abundant sources (high richness) to scarce destination (few other locations nearby)
            const abundantSources = locations
                .sort((a, b) => b.richness - a.richness);

            abundantSources.forEach(source => {
                // Simulate destination as a location with few resources
                // In real implementation, this would calculate actual supply/demand
                const estimatedDistance = 5; // Placeholder
                const estimatedFuelCost = estimatedDistance * 10;
                const profitMargin = (resourceInfo.tradeValue * 0.5) - estimatedFuelCost;

                if (profitMargin > 0) {
                    tradeRoutes.push({
                        resource: resourceInfo.resource,
                        tier: resourceInfo.tier,
                        sourceSystem: source.systemName,
                        sourcePlanet: source.planetName,
                        sourceRichness: source.richness,
                        baseValue: resourceInfo.baseValue,
                        tradeValue: resourceInfo.tradeValue,
                        estimatedDistance,
                        estimatedFuelCost,
                        profitMargin,
                        profitPerUnit: profitMargin / estimatedDistance
                    });
                }
            });
        });

        // Sort by profit margin
        const mostProfitableRoutes = tradeRoutes
            .sort((a, b) => b.profitMargin - a.profitMargin);

        // Best profit per distance
        const bestProfitPerDistance = tradeRoutes
            .sort((a, b) => b.profitPerUnit - a.profitPerUnit);

        // Routes by resource tier
        const routesByTier = {
            tier1: tradeRoutes.filter(r => r.tier === 1).slice(0, 10),
            tier2: tradeRoutes.filter(r => r.tier === 2).slice(0, 10),
            tier3: tradeRoutes.filter(r => r.tier === 3).slice(0, 10),
            tier4: tradeRoutes.filter(r => r.tier === 4).slice(0, 10),
            tier5: tradeRoutes.filter(r => r.tier === 5).slice(0, 10)
        };

        return {
            mostProfitableRoutes,
            bestProfitPerDistance,
            routesByTier,
            resourceAnalysis: resourceAnalysis.slice(0, 30),
            insights: {
                mostProfitableRoute: mostProfitableRoutes[0],
                bestEfficiencyRoute: bestProfitPerDistance[0],
                mostValuableResource: resourceAnalysis[0],
                totalRoutes: tradeRoutes.length
            }
        };
    }

    /**
     * ANALYTICS 10: Claim Stake Optimizer
     * Interactive facility builder with validation and optimization
     */
    async analyzeClaimStakeOptimization() {
        await this.loadAllData();

        const buildings = this.dataCache.buildings;
        const planets = this.dataCache.planets;
        const resources = this.dataCache.resources;

        // Tier configurations (slots and power)
        const tierConfigs = {
            1: { slots: 4, basePower: 100 },
            2: { slots: 32, basePower: 200 },
            3: { slots: 108, basePower: 300 },
            4: { slots: 256, basePower: 400 },
            5: { slots: 500, basePower: 500 }
        };

        // Categorize buildings by type
        const buildingsByType = new Map();
        buildings.forEach(building => {
            const type = building.type || 'Other';
            if (!buildingsByType.has(type)) {
                buildingsByType.set(type, []);
            }
            buildingsByType.get(type).push(building);
        });

        // Pre-configured facility templates
        const facilityTemplates = [
            {
                name: 'Mining Outpost',
                tier: 2,
                description: 'Efficient resource extraction facility',
                buildings: [
                    { name: 'Extractor', tier: 2, count: 8 },
                    { name: 'Storage', tier: 2, count: 2 },
                    { name: 'Power Plant', tier: 2, count: 1 }
                ]
            },
            {
                name: 'Manufacturing Hub',
                tier: 3,
                description: 'Full-scale production facility',
                buildings: [
                    { name: 'Factory', tier: 3, count: 10 },
                    { name: 'Warehouse', tier: 3, count: 3 },
                    { name: 'Power Plant', tier: 3, count: 2 }
                ]
            },
            {
                name: 'Research Complex',
                tier: 4,
                description: 'Advanced research and development',
                buildings: [
                    { name: 'Laboratory', tier: 4, count: 5 },
                    { name: 'Data Center', tier: 4, count: 3 },
                    { name: 'Power Plant', tier: 4, count: 2 }
                ]
            },
            {
                name: 'Trade Station',
                tier: 3,
                description: 'Commercial trading hub',
                buildings: [
                    { name: 'Market', tier: 3, count: 5 },
                    { name: 'Warehouse', tier: 3, count: 8 },
                    { name: 'Hangar', tier: 3, count: 3 }
                ]
            }
        ];

        // Calculate optimal building combinations for each tier
        const optimizedConfigurations = [];

        for (let tier = 1; tier <= 5; tier++) {
            const config = tierConfigs[tier];
            const availableBuildings = buildings.filter(b => b.tier <= tier);

            // Sort buildings by efficiency (production/consumption per slot)
            const buildingEfficiency = availableBuildings.map(building => {
                const powerGen = building.powerGenerated || 0;
                const powerCons = building.powerRequired || 0;
                const slots = building.slotsRequired || 1;
                const resourceProduction = building.resourceRate ?
                    Object.values(building.resourceRate).reduce((sum, rate) => sum + Math.max(0, rate), 0) : 0;

                return {
                    building: building.name,
                    tier: building.tier,
                    powerGen,
                    powerCons,
                    slots,
                    resourceProduction,
                    efficiencyScore: (powerGen + resourceProduction * 10) / (slots * (powerCons + 1))
                };
            }).sort((a, b) => b.efficiencyScore - a.efficiencyScore);

            optimizedConfigurations.push({
                tier,
                slots: config.slots,
                basePower: config.basePower,
                topBuildings: buildingEfficiency.slice(0, 20),
                templates: facilityTemplates.filter(t => t.tier === tier)
            });
        }

        // Analyze building compatibility with planet types
        const planetTypeCompatibility = [];
        const planetTypes = [...new Set(planets.flatMap(s =>
            s.planets.map(p => this.getPlanetTypeName(p.type))
        ))];

        planetTypes.forEach(planetType => {
            const compatibleBuildings = buildings.filter(building => {
                if (!building.planetTypes || building.planetTypes.length === 0) return true;
                return building.planetTypes.includes(planetType);
            });

            planetTypeCompatibility.push({
                planetType,
                totalBuildings: compatibleBuildings.length,
                buildingsByTier: {
                    tier1: compatibleBuildings.filter(b => b.tier === 1).length,
                    tier2: compatibleBuildings.filter(b => b.tier === 2).length,
                    tier3: compatibleBuildings.filter(b => b.tier === 3).length,
                    tier4: compatibleBuildings.filter(b => b.tier === 4).length,
                    tier5: compatibleBuildings.filter(b => b.tier === 5).length
                }
            });
        });

        return {
            tierConfigs,
            buildingsByType: Array.from(buildingsByType.entries()).map(([type, bldgs]) => ({
                type,
                count: bldgs.length,
                buildings: bldgs
            })),
            optimizedConfigurations,
            facilityTemplates,
            planetTypeCompatibility,
            insights: {
                mostEfficientBuilding: optimizedConfigurations[4]?.topBuildings[0],
                bestTemplate: facilityTemplates[2],
                totalBuildingTypes: buildings.length
            }
        };
    }

    /**
     * ANALYTICS 11: Manufacturing Chain Visualizer
     * Complete dependency graph for manufacturing chains
     */
    async analyzeManufacturingChain() {
        await this.loadAllData();

        const recipes = this.dataCache.recipes;
        const resources = this.dataCache.resources;

        // Build dependency graph
        const recipeGraph = new Map(); // outputName -> {recipe, inputs: [], outputs: []}

        recipes.forEach(recipe => {
            if (!recipeGraph.has(recipe.outputName)) {
                recipeGraph.set(recipe.outputName, {
                    recipe,
                    inputs: [],
                    outputs: [],
                    depth: 0,
                    branches: 0
                });
            }

            const node = recipeGraph.get(recipe.outputName);

            // Track inputs
            if (recipe.ingredients) {
                recipe.ingredients.forEach(ingredient => {
                    node.inputs.push(ingredient.name);

                    // Create nodes for inputs if they don't exist
                    if (!recipeGraph.has(ingredient.name)) {
                        const resource = resources.find(r => r.name === ingredient.name);
                        recipeGraph.set(ingredient.name, {
                            resource,
                            inputs: [],
                            outputs: [],
                            depth: 0,
                            branches: 0
                        });
                    }

                    // Track that this ingredient is used by this recipe
                    recipeGraph.get(ingredient.name).outputs.push(recipe.outputName);
                });
            }
        });

        // Calculate chain depth (how many steps from raw to final)
        const calculateDepth = (nodeName, visited = new Set()) => {
            if (visited.has(nodeName)) return 0;
            visited.add(nodeName);

            const node = recipeGraph.get(nodeName);
            if (!node || node.inputs.length === 0) return 0;

            let maxDepth = 0;
            node.inputs.forEach(input => {
                const depth = 1 + calculateDepth(input, new Set(visited));
                maxDepth = Math.max(maxDepth, depth);
            });

            return maxDepth;
        };

        // Calculate branches (how many different products use this)
        recipeGraph.forEach((node, name) => {
            node.depth = calculateDepth(name);
            node.branches = node.outputs.length;
        });

        // Identify bottlenecks (high branch count = many things need this)
        const bottlenecks = Array.from(recipeGraph.entries())
            .filter(([_, node]) => node.branches >= 5)
            .map(([name, node]) => ({
                resource: name,
                branches: node.branches,
                depth: node.depth,
                usedBy: node.outputs,
                tier: node.resource?.tier || node.recipe?.outputTier || 1,
                bottleneckScore: node.branches * (node.depth + 1)
            }))
            .sort((a, b) => b.bottleneckScore - a.bottleneckScore)
            .slice(0, 30);

        // Identify production chains (longest paths)
        const complexChains = Array.from(recipeGraph.entries())
            .filter(([_, node]) => node.recipe)
            .map(([name, node]) => ({
                product: name,
                depth: node.depth,
                ingredientCount: node.inputs.length,
                branchCount: node.branches,
                tier: node.recipe.outputTier,
                complexity: node.depth * node.inputs.length
            }))
            .sort((a, b) => b.complexity - a.complexity)
            .slice(0, 30);

        // Identify parallel production paths (multiple ways to make same thing)
        const parallelPaths = [];
        const outputCounts = new Map();

        recipes.forEach(recipe => {
            outputCounts.set(recipe.outputName, (outputCounts.get(recipe.outputName) || 0) + 1);
        });

        outputCounts.forEach((count, outputName) => {
            if (count > 1) {
                const alternativeRecipes = recipes.filter(r => r.outputName === outputName);
                parallelPaths.push({
                    product: outputName,
                    pathCount: count,
                    recipes: alternativeRecipes.map(r => ({
                        ingredients: r.ingredients?.map(i => i.name) || [],
                        constructionTime: r.constructionTime,
                        tier: r.outputTier
                    }))
                });
            }
        });

        // Raw materials (no inputs, only outputs)
        const rawMaterials = Array.from(recipeGraph.entries())
            .filter(([_, node]) => node.inputs.length === 0 && node.outputs.length > 0)
            .map(([name, node]) => ({
                resource: name,
                usedInRecipes: node.outputs.length,
                tier: node.resource?.tier || 1
            }))
            .sort((a, b) => b.usedInRecipes - a.usedInRecipes)
            .slice(0, 30);

        // Final products (no outputs, only inputs)
        const finalProducts = Array.from(recipeGraph.entries())
            .filter(([_, node]) => node.outputs.length === 0 && node.inputs.length > 0)
            .map(([name, node]) => ({
                product: name,
                ingredientCount: node.inputs.length,
                depth: node.depth,
                tier: node.recipe?.outputTier || 1
            }))
            .sort((a, b) => b.depth - a.depth)
            .slice(0, 30);

        return {
            recipeGraph: Array.from(recipeGraph.entries()).map(([name, node]) => ({
                name,
                ...node,
                recipe: node.recipe ? {
                    outputName: node.recipe.outputName,
                    tier: node.recipe.outputTier,
                    constructionTime: node.recipe.constructionTime
                } : null
            })),
            bottlenecks,
            complexChains,
            parallelPaths,
            rawMaterials,
            finalProducts,
            insights: {
                totalNodes: recipeGraph.size,
                maxChainDepth: Math.max(...Array.from(recipeGraph.values()).map(n => n.depth)),
                criticalBottleneck: bottlenecks[0],
                mostComplexProduct: complexChains[0]
            }
        };
    }

    /**
     * ANALYTICS 12: Building Efficiency Comparisons
     * Compare building performance metrics
     */
    async analyzeBuildingEfficiency() {
        await this.loadAllData();

        const buildings = this.dataCache.buildings;
        const resources = this.dataCache.resources;

        // Calculate efficiency metrics for each building
        const buildingMetrics = buildings.map(building => {
            const powerGen = building.powerGenerated || 0;
            const powerCons = building.powerRequired || 0;
            const netPower = powerGen - powerCons;
            const slots = building.slotsRequired || 1;
            const crew = building.crewRequired || 0;
            const cost = building.constructionCost || 0;

            // Calculate resource production/consumption
            let resourceProduction = 0;
            let resourceConsumption = 0;
            let resourceValue = 0;

            if (building.resourceRate) {
                Object.entries(building.resourceRate).forEach(([resourceName, rate]) => {
                    const resource = resources.find(r => r.name === resourceName);
                    const value = resource?.baseValue || 100;

                    if (rate > 0) {
                        resourceProduction += rate;
                        resourceValue += rate * value;
                    } else {
                        resourceConsumption += Math.abs(rate);
                        resourceValue -= Math.abs(rate) * value;
                    }
                });
            }

            // Extraction efficiency
            let extractionRate = 0;
            let extractionValue = 0;

            if (building.resourceExtractionRate) {
                Object.entries(building.resourceExtractionRate).forEach(([resourceName, rate]) => {
                    const resource = resources.find(r => r.name === resourceName);
                    const value = resource?.baseValue || 100;
                    extractionRate += rate;
                    extractionValue += rate * value;
                });
            }

            // Calculate efficiency scores
            const powerEfficiency = netPower / slots;
            const resourceEfficiency = resourceProduction > 0 ? resourceProduction / slots : 0;
            const extractionEfficiency = extractionRate > 0 ? extractionRate / slots : 0;
            const valueEfficiency = (resourceValue + extractionValue) / (cost + 1);
            const crewEfficiency = crew > 0 ? (resourceValue + extractionValue) / crew : 0;

            const overallEfficiency =
                (powerEfficiency * 0.2) +
                (resourceEfficiency * 0.3) +
                (extractionEfficiency * 0.3) +
                (valueEfficiency * 0.2);

            return {
                name: building.name,
                tier: building.tier,
                type: building.type || 'Other',
                powerGen,
                powerCons,
                netPower,
                slots,
                crew,
                cost,
                resourceProduction,
                resourceConsumption,
                extractionRate,
                resourceValue,
                extractionValue,
                powerEfficiency,
                resourceEfficiency,
                extractionEfficiency,
                valueEfficiency,
                crewEfficiency,
                overallEfficiency
            };
        });

        // Best power generators
        const bestPowerGen = buildingMetrics
            .filter(b => b.powerGen > 0)
            .sort((a, b) => b.powerEfficiency - a.powerEfficiency)
            .slice(0, 20);

        // Best resource producers
        const bestResourceProducers = buildingMetrics
            .filter(b => b.resourceProduction > 0)
            .sort((a, b) => b.resourceEfficiency - a.resourceEfficiency)
            .slice(0, 20);

        // Best extractors
        const bestExtractors = buildingMetrics
            .filter(b => b.extractionRate > 0)
            .sort((a, b) => b.extractionEfficiency - a.extractionEfficiency)
            .slice(0, 20);

        // Best value generators
        const bestValueGenerators = buildingMetrics
            .filter(b => b.resourceValue > 0 || b.extractionValue > 0)
            .sort((a, b) => b.valueEfficiency - a.valueEfficiency)
            .slice(0, 20);

        // Most crew efficient
        const bestCrewEfficiency = buildingMetrics
            .filter(b => b.crew > 0)
            .sort((a, b) => b.crewEfficiency - a.crewEfficiency)
            .slice(0, 20);

        // Tier comparisons
        const tierComparisons = [];
        for (let tier = 1; tier <= 5; tier++) {
            const tierBuildings = buildingMetrics.filter(b => b.tier === tier);
            if (tierBuildings.length === 0) continue;

            tierComparisons.push({
                tier,
                count: tierBuildings.length,
                avgPowerGen: tierBuildings.reduce((sum, b) => sum + b.powerGen, 0) / tierBuildings.length,
                avgResourceProduction: tierBuildings.reduce((sum, b) => sum + b.resourceProduction, 0) / tierBuildings.length,
                avgExtractionRate: tierBuildings.reduce((sum, b) => sum + b.extractionRate, 0) / tierBuildings.length,
                avgCost: tierBuildings.reduce((sum, b) => sum + b.cost, 0) / tierBuildings.length,
                topBuilding: tierBuildings.sort((a, b) => b.overallEfficiency - a.overallEfficiency)[0]
            });
        }

        // Type comparisons
        const typeComparisons = new Map();
        buildingMetrics.forEach(building => {
            if (!typeComparisons.has(building.type)) {
                typeComparisons.set(building.type, []);
            }
            typeComparisons.get(building.type).push(building);
        });

        const typeAnalysis = Array.from(typeComparisons.entries()).map(([type, buildings]) => ({
            type,
            count: buildings.length,
            avgPowerEfficiency: buildings.reduce((sum, b) => sum + b.powerEfficiency, 0) / buildings.length,
            avgResourceEfficiency: buildings.reduce((sum, b) => sum + b.resourceEfficiency, 0) / buildings.length,
            avgOverallEfficiency: buildings.reduce((sum, b) => sum + b.overallEfficiency, 0) / buildings.length,
            topBuilding: buildings.sort((a, b) => b.overallEfficiency - a.overallEfficiency)[0]
        })).sort((a, b) => b.avgOverallEfficiency - a.avgOverallEfficiency);

        return {
            buildingMetrics: buildingMetrics.sort((a, b) => b.overallEfficiency - a.overallEfficiency),
            bestPowerGen,
            bestResourceProducers,
            bestExtractors,
            bestValueGenerators,
            bestCrewEfficiency,
            tierComparisons,
            typeAnalysis,
            insights: {
                mostEfficientBuilding: buildingMetrics.sort((a, b) => b.overallEfficiency - a.overallEfficiency)[0],
                bestPowerGenerator: bestPowerGen[0],
                bestExtractor: bestExtractors[0],
                bestProducer: bestResourceProducers[0],
                totalBuildings: buildings.length
            }
        };
    }

    /**
     * Get cached data for direct access
     */
    getData(dataType) {
        return this.dataCache[dataType];
    }
}

// Make available globally
window.CrossExplorerAnalytics = CrossExplorerAnalytics;
