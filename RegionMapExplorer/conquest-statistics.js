/**
 * Conquest Statistics Calculator
 * Analyzes resource losses and production impact when regions are conquered
 */

class ConquestStatistics {
    constructor() {
        // Will be loaded from global data
        this.buildingsData = null;
        this.recipesData = null;
        this.resourcesData = null;
    }

    /**
     * Initialize with global data
     */
    init() {
        if (typeof buildingsData !== 'undefined') {
            this.buildingsData = buildingsData;
        }
        if (typeof recipesData !== 'undefined') {
            this.recipesData = recipesData;
        }
        if (typeof resourcesData !== 'undefined') {
            this.resourcesData = resourcesData;
        }
    }

    /**
     * Calculate resource locations lost if a region is conquered
     */
    calculateResourceLoss(region) {
        const resourceLocations = new Map(); // resource name -> count of locations
        const planetTypes = new Map(); // planet type -> count

        region.systems.forEach(system => {
            if (system.planets && system.planets.length > 0) {
                system.planets.forEach(planet => {
                    // Track planet types
                    const planetTypeName = planet.type || 'Unknown';
                    planetTypes.set(planetTypeName, (planetTypes.get(planetTypeName) || 0) + 1);

                    // Track resource locations
                    if (planet.resources && planet.resources.length > 0) {
                        planet.resources.forEach(resource => {
                            const resourceName = resource.name || `Resource-${resource.type}`;
                            const richness = resource.richness || 1;

                            if (!resourceLocations.has(resourceName)) {
                                resourceLocations.set(resourceName, {
                                    count: 0,
                                    totalRichness: 0,
                                    richnessCounts: { 1: 0, 2: 0, 3: 0 } // Poor, Medium, Rich
                                });
                            }

                            const data = resourceLocations.get(resourceName);
                            data.count++;
                            data.totalRichness += richness;
                            data.richnessCounts[richness]++;
                        });
                    }
                });
            }
        });

        return {
            resourceLocations: Array.from(resourceLocations.entries()).map(([name, data]) => ({
                name,
                ...data,
                avgRichness: data.totalRichness / data.count
            })).sort((a, b) => b.count - a.count),
            planetTypes: Array.from(planetTypes.entries()).map(([type, count]) => ({
                type,
                count
            })).sort((a, b) => b.count - a.count),
            totalResourceLocations: Array.from(resourceLocations.values()).reduce((sum, data) => sum + data.count, 0),
            uniqueResources: resourceLocations.size,
            totalPlanets: region.systems.reduce((sum, sys) => sum + (sys.planets?.length || 0), 0)
        };
    }

    /**
     * Calculate hypothetical claim stake production losses
     * Assumes 50 claim stakes distributed across the region
     */
    calculateClaimStakeProductionLoss(region, hypotheticalStakes = 50) {
        const resourceLoss = this.calculateResourceLoss(region);

        // Calculate how many stakes per system (weighted by system type)
        const totalSystemWeight = region.systems.reduce((sum, sys) => {
            if (sys.type === 'King') return sum + 5;
            if (sys.type === 'Core') return sum + 3;
            return sum + 1;
        }, 0);

        const stakesPerSystem = region.systems.map(sys => {
            let weight = 1;
            if (sys.type === 'King') weight = 5;
            else if (sys.type === 'Core') weight = 3;

            return {
                system: sys,
                stakes: Math.round((weight / totalSystemWeight) * hypotheticalStakes)
            };
        });

        // Simulate production facilities on these stakes
        const productionEstimate = this.estimateProduction(stakesPerSystem);

        return {
            totalStakes: hypotheticalStakes,
            stakesDistribution: stakesPerSystem,
            estimatedProduction: productionEstimate,
            resourceLoss
        };
    }

    /**
     * Estimate production from claim stakes
     * This is a simplified model based on available resources
     */
    estimateProduction(stakesPerSystem) {
        const production = {
            mining: new Map(), // resource -> tons/day
            crafting: new Map(), // item -> units/day
            totalFacilities: 0
        };

        stakesPerSystem.forEach(({ system, stakes }) => {
            if (!system.planets || stakes === 0) return;

            // For each stake, assume basic mining setup
            // Typical stake might have 2-3 mining facilities
            const miningFacilitiesPerStake = 2;
            const totalMiningFacilities = stakes * miningFacilitiesPerStake;

            // Distribute mining facilities across available resources
            const availableResources = new Set();
            system.planets.forEach(planet => {
                if (planet.resources) {
                    planet.resources.forEach(res => {
                        availableResources.add(res.name);
                    });
                }
            });

            if (availableResources.size > 0) {
                const facilitiesPerResource = totalMiningFacilities / availableResources.size;

                availableResources.forEach(resourceName => {
                    // Basic mining facility produces ~10 tons/day (simplified)
                    const productionRate = facilitiesPerResource * 10;
                    production.mining.set(
                        resourceName,
                        (production.mining.get(resourceName) || 0) + productionRate
                    );
                });

                production.totalFacilities += totalMiningFacilities;
            }
        });

        return {
            mining: Array.from(production.mining.entries()).map(([resource, rate]) => ({
                resource,
                tonsPerDay: Math.round(rate)
            })).sort((a, b) => b.tonsPerDay - a.tonsPerDay),
            totalMiningFacilities: production.totalFacilities,
            totalMiningOutput: Array.from(production.mining.values()).reduce((sum, rate) => sum + rate, 0)
        };
    }

    /**
     * Calculate craftable items lost
     * Based on resources available in the region
     */
    calculateCraftingLoss(region) {
        if (!this.recipesData) {
            return { craftableRecipes: [], totalRecipes: 0 };
        }

        const availableResources = new Set();

        // Collect all resources in the region
        region.systems.forEach(system => {
            if (system.planets) {
                system.planets.forEach(planet => {
                    if (planet.resources) {
                        planet.resources.forEach(res => {
                            availableResources.add(res.name);
                        });
                    }
                });
            }
        });

        // Find recipes that use these resources
        const craftableRecipes = [];

        if (this.recipesData.recipes) {
            this.recipesData.recipes.forEach(recipe => {
                if (recipe.inputs) {
                    const usesRegionalResource = recipe.inputs.some(input =>
                        availableResources.has(input.name)
                    );

                    if (usesRegionalResource) {
                        const regionalInputs = recipe.inputs.filter(input =>
                            availableResources.has(input.name)
                        );

                        craftableRecipes.push({
                            name: recipe.name,
                            category: recipe.category,
                            regionalInputs: regionalInputs.map(i => i.name),
                            totalInputs: recipe.inputs.length,
                            regionalDependency: (regionalInputs.length / recipe.inputs.length) * 100
                        });
                    }
                }
            });
        }

        return {
            craftableRecipes: craftableRecipes.sort((a, b) => b.regionalDependency - a.regionalDependency),
            totalRecipes: craftableRecipes.length,
            highDependencyRecipes: craftableRecipes.filter(r => r.regionalDependency > 50).length
        };
    }

    /**
     * Generate full conquest impact report
     */
    generateConquestReport(region, attackingFaction) {
        const resourceLoss = this.calculateResourceLoss(region);
        const claimStakeLoss = this.calculateClaimStakeProductionLoss(region, 50);
        const craftingLoss = this.calculateCraftingLoss(region);

        return {
            region: {
                id: region.id,
                name: region.name,
                originalFaction: region.originalFaction,
                attackingFaction: attackingFaction,
                systemCount: region.systems.length
            },
            resourceImpact: resourceLoss,
            productionImpact: claimStakeLoss,
            craftingImpact: craftingLoss,
            timestamp: new Date().toISOString()
        };
    }
}

// Make available globally
window.ConquestStatistics = ConquestStatistics;
