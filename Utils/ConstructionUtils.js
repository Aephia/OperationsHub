// Shared Construction Utilities
// Common functions for facility construction used by GaliaViewer and ClaimStakeExplorer

class ConstructionUtils {
    // Get available slots for claim stake tier
    static getClaimStakeSlots(tier) {
        const slotsByTier = {
            1: 32,     // Tier 1: 32 slots
            2: 243,    // Tier 2: 243 slots
            3: 1024,   // Tier 3: 1024 slots
            4: 3125,   // Tier 4: 3125 slots
            5: 7776    // Tier 5: 7776 slots
        };
        return slotsByTier[tier] || 32;
    }

    // Get base power output for claim stake tier
    static getClaimStakePower(tier) {
        const powerByTier = {
            1: 100,    // Tier 1: 100 power
            2: 200,    // Tier 2: 200 power
            3: 300,    // Tier 3: 300 power
            4: 400,    // Tier 4: 400 power
            5: 500     // Tier 5: 500 power
        };
        return powerByTier[tier] || 100;
    }

    // Check if planet type is compatible with building requirements
    static checkPlanetTypeCompatibility(planetTypeNum, requiredTags) {
        if (!requiredTags || requiredTags.length === 0) return true;

        // Comprehensive mapping from numeric planet types to descriptive planet tags used by buildings
        const numericToPlanetTag = {
            0: 'terrestrial-planet',    // Rocky/Terrestrial
            1: 'gas-planet',           // Gas Giant (rare buildings)
            2: 'ice-planet',           // Ice/Frozen worlds
            3: 'volcanic-planet',      // Volcanic/Lava worlds
            4: 'oceanic-planet',       // Ocean worlds
            5: 'desert-planet',        // Desert/Arid worlds
            6: 'oceanic-planet',       // Ocean (alternate)
            7: 'terrestrial-planet',   // Forest worlds (Earth-like)
            8: 'toxic-planet',         // Toxic worlds
            9: 'barren-planet',        // Barren worlds
            10: 'terrestrial-planet',  // Tropical worlds (Earth-like)
            11: 'ice-planet',          // Arctic worlds
            12: 'terrestrial-planet', // Continental
            13: 'oceanic-planet',     // Archipelago
            14: 'desert-planet',      // Savanna
            15: 'ice-planet',         // Tundra
            16: 'volcanic-planet',    // Molten
            17: 'barren-planet',      // Asteroid
            18: 'dark-planet',        // Dark/Shadow worlds
            19: 'toxic-planet',       // Polluted
            20: 'terrestrial-planet'  // Alpine
            // Types 21+ default to barren-planet for compatibility
        };

        // Get the descriptive planet tag for this numeric type
        const planetTag = numericToPlanetTag[planetTypeNum] || 'barren-planet';

        // Check if any required tag matches this planet type
        return requiredTags.some(tag => {
            const tagLower = tag.toLowerCase();
            return tagLower === planetTag.toLowerCase();
        });
    }

    // Get buildings compatible with the planet type
    static getCompatibleBuildings(planet, system, claimStakeTier = 1) {
        if (typeof window.rawBuildingData === 'undefined') {
            return [];
        }

        const buildings = window.rawBuildingData.buildings || [];
        const planetTypeNum = planet.type;

        return buildings.filter(building => {
            // Check planet type requirements
            const requiredTags = building.requiredTags || [];
            const planetTypeCompatible = this.checkPlanetTypeCompatibility(planetTypeNum, requiredTags);

            // Check claim stake tier compatibility
            const tierCompatible = building.minimumTier <= claimStakeTier;

            return planetTypeCompatible && tierCompatible;
        }).sort((a, b) => {
            // Sort by tier, then by name
            if (a.tier !== b.tier) return a.tier - b.tier;
            return a.name.localeCompare(b.name);
        });
    }

    // Validate facility plan for power and slot requirements
    static validateFacilityPlan(buildings, claimStakeTier) {
        if (!buildings || buildings.length === 0) {
            return { valid: true };
        }

        // Calculate total slots used
        const totalSlotsUsed = buildings.reduce((sum, building) => sum + (building.slots || 0), 0);
        const availableSlots = this.getClaimStakeSlots(claimStakeTier);

        // Calculate power consumption and generation
        const basePower = this.getClaimStakePower(claimStakeTier);
        const buildingPowerOutput = buildings.reduce((sum, building) => sum + (building.power || 0), 0);
        const totalPowerOutput = basePower + buildingPowerOutput;

        // Find buildings that have power consumption (negative power)
        const powerConsumption = buildings.reduce((sum, building) => {
            if (building.resourceRate) {
                Object.values(building.resourceRate).forEach(rate => {
                    if (rate < 0) sum += Math.abs(rate) * 10; // Convert to power units
                });
            }
            return sum;
        }, 0);

        const validation = {
            valid: totalSlotsUsed <= availableSlots && totalPowerOutput >= powerConsumption,
            slotsUsed: totalSlotsUsed,
            availableSlots: availableSlots,
            slotsExceeded: totalSlotsUsed > availableSlots,
            powerOutput: totalPowerOutput,
            powerConsumption: powerConsumption,
            powerInsufficient: totalPowerOutput < powerConsumption,
            basePower: basePower,
            buildingPower: buildingPowerOutput
        };

        return validation;
    }

    // Calculate comprehensive facility statistics
    static calculateFacilityStats(buildings) {
        if (!buildings) return {};

        const stats = {
            totalCost: {},
            totalRecipeCost: {},
            totalCrewSlots: 0,
            totalNeededCrew: 0,
            totalPower: 0,
            totalStorage: 0,
            totalSlots: 0,
            comesWithStake: false,
            removableBuildings: 0,
            enabledFeatures: [],
            resourceExtraction: {},
            resourceConsumption: {}
        };

        // Calculate totals from all buildings
        buildings.forEach(building => {
            // Resource costs
            const cost = building.constructionCost || {};
            Object.entries(cost).forEach(([resource, amount]) => {
                stats.totalCost[resource] = (stats.totalCost[resource] || 0) + amount;
            });

            // Recipe costs - look up recipe ingredients by matching pattern
            if (typeof window.rawRecipeData !== 'undefined' && window.rawRecipeData.recipes) {
                const buildingPattern = building.name.toLowerCase().replace(/\s+/g, '-');
                const recipe = window.rawRecipeData.recipes.find(r =>
                    r.outputId.includes(buildingPattern) && r.outputTier === building.tier
                );
                if (recipe && recipe.ingredients) {
                    recipe.ingredients.forEach(ingredient => {
                        stats.totalRecipeCost[ingredient.name] = (stats.totalRecipeCost[ingredient.name] || 0) + ingredient.quantity;
                    });
                }
            }

            // Crew and operations
            stats.totalCrewSlots += building.crewSlots || 0;
            // Crew required is the max of neededCrew and crewSlots for each building
            const crewRequired = Math.max(building.neededCrew || 0, building.crewSlots || 0);
            stats.totalNeededCrew += crewRequired;
            stats.totalPower += building.power || 0;
            stats.totalStorage += building.storage || 0;
            stats.totalSlots += building.slots || 0;

            // Special properties
            if (building.comesWithStake) {
                stats.comesWithStake = true;
            }
            if (!building.cannotRemove) {
                stats.removableBuildings++;
            }

            // Resource extraction rates
            if (building.resourceExtractionRate) {
                Object.entries(building.resourceExtractionRate).forEach(([resource, rate]) => {
                    stats.resourceExtraction[resource] = (stats.resourceExtraction[resource] || 0) + rate;
                });
            }

            // Resource consumption rates (negative rates)
            if (building.resourceRate) {
                Object.entries(building.resourceRate).forEach(([resource, rate]) => {
                    if (rate < 0) {
                        stats.resourceConsumption[resource] = (stats.resourceConsumption[resource] || 0) + Math.abs(rate);
                    } else {
                        stats.resourceExtraction[resource] = (stats.resourceExtraction[resource] || 0) + rate;
                    }
                });
            }

            // Enabled features (from addedTags)
            if (building.addedTags) {
                building.addedTags.forEach(tag => {
                    if (tag.startsWith('enables-') && !stats.enabledFeatures.includes(tag)) {
                        // Convert enables-processing-hub to "Processing Hub"
                        const featureName = tag.replace('enables-', '').replace(/-/g, ' ')
                            .replace(/\b\w/g, l => l.toUpperCase());
                        stats.enabledFeatures.push(featureName);
                    }
                });
            }
        });

        return stats;
    }

    // Open Recipe Explorer with selected building
    static openRecipeExplorer(buildingName, tier) {
        // Find matching recipe by searching for building name pattern
        let recipeId = null;

        if (typeof window.rawRecipeData !== 'undefined' && window.rawRecipeData.recipes) {
            // Search for recipe that matches the building name and tier
            const buildingPattern = buildingName.toLowerCase().replace(/\s+/g, '-');
            const recipe = window.rawRecipeData.recipes.find(r =>
                r.outputId.includes(buildingPattern) && r.outputTier === tier
            );

            if (recipe) {
                recipeId = recipe.outputId;
            } else {
                // Fallback: construct ID from building name and tier
                recipeId = buildingPattern + '-t' + tier;
            }
        } else {
            // Fallback if recipe data not available
            recipeId = buildingName.toLowerCase().replace(/\s+/g, '-') + '-t' + tier;
        }

        // Open Recipe Explorer in new tab with recipe pre-selected
        const url = `../RecipeExplorer/index.html?recipe=${encodeURIComponent(recipeId)}`;
        window.open(url, '_blank');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConstructionUtils;
}
