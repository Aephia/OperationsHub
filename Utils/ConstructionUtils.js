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

        // Comprehensive mapping from numeric planet types to descriptive planet tags and factions
        // Format: { category: 'category-tag', faction: 'faction-tag' }
        const numericToPlanetInfo = {
            // ONI planets (0-7)
            0: { category: 'terrestrial-planet', faction: 'oni' },
            1: { category: 'volcanic-planet', faction: 'oni' },
            2: { category: 'barren-planet', faction: 'oni' },
            3: { category: 'asteroid-belt', faction: 'oni' },
            4: { category: 'gas-giant-planet', faction: 'oni' },
            5: { category: 'ice-giant-planet', faction: 'oni' },
            6: { category: 'dark-planet', faction: 'oni' },
            7: { category: 'oceanic-planet', faction: 'oni' },

            // MUD planets (8-15)
            8: { category: 'terrestrial-planet', faction: 'mud' },
            9: { category: 'volcanic-planet', faction: 'mud' },
            10: { category: 'barren-planet', faction: 'mud' },
            11: { category: 'asteroid-belt', faction: 'mud' },
            12: { category: 'gas-giant-planet', faction: 'mud' },
            13: { category: 'ice-giant-planet', faction: 'mud' },
            14: { category: 'dark-planet', faction: 'mud' },
            15: { category: 'oceanic-planet', faction: 'mud' },

            // USTUR planets (16-23)
            16: { category: 'terrestrial-planet', faction: 'ustur' },
            17: { category: 'volcanic-planet', faction: 'ustur' },
            18: { category: 'barren-planet', faction: 'ustur' },
            19: { category: 'asteroid-belt', faction: 'ustur' },
            20: { category: 'gas-giant-planet', faction: 'ustur' },
            21: { category: 'ice-giant-planet', faction: 'ustur' },
            22: { category: 'dark-planet', faction: 'ustur' },
            23: { category: 'oceanic-planet', faction: 'ustur' }
        };

        // Get the planet info for this numeric type
        const planetInfo = numericToPlanetInfo[planetTypeNum] || { category: 'barren-planet', faction: 'unknown' };

        // List of all possible planet-related tags (categories and factions)
        const allPlanetTags = [
            'terrestrial-planet', 'volcanic-planet', 'barren-planet', 'asteroid-belt',
            'gas-giant-planet', 'ice-giant-planet', 'dark-planet', 'oceanic-planet',
            'system-terrestrial-planet', 'system-volcanic-planet', 'system-barren-planet', 'system-asteroid-belt-planet',
            'system-gas-giant-planet', 'system-ice-giant-planet', 'system-dark-planet', 'system-oceanic-planet',
            'oni', 'mud', 'ustur'
        ];

        // Filter required tags to only planet-related ones
        const planetRelatedTags = requiredTags.filter(tag =>
            allPlanetTags.includes(tag.toLowerCase())
        );

        // If there are no planet-related tags, the building works on any planet
        if (planetRelatedTags.length === 0) return true;

        // Check if ALL planet-related tags match this planet type
        // Buildings can require both planet category (e.g., "dark-planet") AND faction (e.g., "mud")
        return planetRelatedTags.every(tag => {
            const tagLower = tag.toLowerCase();

            // Handle "system-" prefix tags (e.g., "system-asteroid-belt-planet")
            // These need special handling to normalize to the category format
            let normalizedTag = tagLower;
            if (normalizedTag.startsWith('system-')) {
                // Remove "system-" prefix first
                normalizedTag = normalizedTag.substring(7);
                // For "system-" tags, also remove "-planet" suffix to match asteroid-belt format
                if (normalizedTag.endsWith('-planet')) {
                    normalizedTag = normalizedTag.substring(0, normalizedTag.length - 7);
                }
            }

            // Now check if it matches category or faction
            // Direct match with normalized tag OR faction match with original tag
            return normalizedTag === planetInfo.category.toLowerCase() ||
                   tagLower === planetInfo.faction.toLowerCase();
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

    // Validate facility plan for power, slot, and crew requirements
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

        // Calculate crew slots and requirements
        const totalCrewSlots = buildings.reduce((sum, building) => sum + (building.crewSlots || 0), 0);
        const totalCrewRequired = buildings.reduce((sum, building) => sum + (building.neededCrew || 0), 0);

        const slotsExceeded = totalSlotsUsed > availableSlots;
        const powerInsufficient = totalPowerOutput < powerConsumption;
        const crewInsufficient = totalCrewRequired > totalCrewSlots;

        const validation = {
            valid: !slotsExceeded && !powerInsufficient && !crewInsufficient,
            slotsUsed: totalSlotsUsed,
            availableSlots: availableSlots,
            slotsExceeded: slotsExceeded,
            powerOutput: totalPowerOutput,
            powerConsumption: powerConsumption,
            powerInsufficient: powerInsufficient,
            basePower: basePower,
            buildingPower: buildingPowerOutput,
            crewSlots: totalCrewSlots,
            crewRequired: totalCrewRequired,
            crewInsufficient: crewInsufficient
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
            // Crew required is the neededCrew value (minimum crew to operate the building)
            stats.totalNeededCrew += building.neededCrew || 0;
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
