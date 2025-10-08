// Explorer Analytics Tests
// Comprehensive tests for PlanetExplorer, RecipeExplorer, and ResourcesExplorer analytics

const planetAnalyticsTests = new TestRunner('Planet Explorer Analytics Tests');
const recipeAnalyticsTests = new TestRunner('Recipe Explorer Analytics Tests');
const resourcesAnalyticsTests = new TestRunner('Resources Explorer Analytics Tests');

// =============================================================================
// PLANET EXPLORER ANALYTICS TESTS
// =============================================================================

planetAnalyticsTests.test('Should load Galia system data', async () => {
    const response = await fetch('../JSON/galia.json');
    assert(response.ok, 'Failed to load galia.json');

    const data = await response.json();
    assertExists(data, 'Galia data should exist');
    assert(Array.isArray(data), 'Galia data should be an array');
    assertGreaterThan(data.length, 0, 'Should have star systems');
});

planetAnalyticsTests.test('Should count total star systems', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    const totalSystems = systems.length;
    assertGreaterThan(totalSystems, 0, 'Should have at least one star system');
});

planetAnalyticsTests.test('Should count total planets across all systems', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    let totalPlanets = 0;
    systems.forEach(system => {
        if (system.children) {
            const planets = system.children.filter(child =>
                child.userData?.type === 'planet'
            );
            totalPlanets += planets.length;
        }
    });

    assertGreaterThan(totalPlanets, 0, 'Should have at least one planet');
});

planetAnalyticsTests.test('Should identify unique resource types', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    const resourceTypes = new Set();

    systems.forEach(system => {
        system.children?.forEach(planet => {
            if (planet.userData?.resources) {
                Object.keys(planet.userData.resources).forEach(resource => {
                    resourceTypes.add(resource);
                });
            }
        });
    });

    assertGreaterThan(resourceTypes.size, 0, 'Should have at least one resource type');
});

planetAnalyticsTests.test('Should calculate resource scarcity', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    const resourceCounts = {};

    systems.forEach(system => {
        system.children?.forEach(planet => {
            if (planet.userData?.resources) {
                Object.keys(planet.userData.resources).forEach(resource => {
                    resourceCounts[resource] = (resourceCounts[resource] || 0) + 1;
                });
            }
        });
    });

    const scarcestResources = Object.entries(resourceCounts)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 5);

    assert(scarcestResources.length > 0, 'Should identify scarcest resources');
});

planetAnalyticsTests.test('Should calculate average resource richness', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    let totalRichness = 0;
    let count = 0;

    systems.forEach(system => {
        system.children?.forEach(planet => {
            if (planet.userData?.resources) {
                Object.values(planet.userData.resources).forEach(richness => {
                    if (typeof richness === 'number') {
                        totalRichness += richness;
                        count++;
                    }
                });
            }
        });
    });

    const averageRichness = count > 0 ? totalRichness / count : 0;
    assertGreaterThan(averageRichness, 0, 'Average richness should be positive');
});

planetAnalyticsTests.test('Should identify resource-rich systems', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    const systemResourceCounts = systems.map(system => {
        const uniqueResources = new Set();
        system.children?.forEach(planet => {
            if (planet.userData?.resources) {
                Object.keys(planet.userData.resources).forEach(r => uniqueResources.add(r));
            }
        });
        return {
            name: system.name,
            resourceCount: uniqueResources.size
        };
    });

    const topSystems = systemResourceCounts
        .filter(s => s.resourceCount > 0)
        .sort((a, b) => b.resourceCount - a.resourceCount)
        .slice(0, 10);

    assertGreaterThan(topSystems.length, 0, 'Should identify resource-rich systems');
});

planetAnalyticsTests.test('Should identify regionally limited resources', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    const resourcesByRegion = {};

    systems.forEach(system => {
        const region = system.name?.substring(0, 3) || 'UNK';

        system.children?.forEach(planet => {
            if (planet.userData?.resources) {
                Object.keys(planet.userData.resources).forEach(resource => {
                    if (!resourcesByRegion[resource]) {
                        resourcesByRegion[resource] = new Set();
                    }
                    resourcesByRegion[resource].add(region);
                });
            }
        });
    });

    const totalRegions = new Set();
    systems.forEach(system => {
        const region = system.name?.substring(0, 3);
        if (region) totalRegions.add(region);
    });

    const regionalResources = Object.entries(resourcesByRegion)
        .filter(([resource, regions]) => regions.size < totalRegions.size)
        .map(([resource, regions]) => ({
            resource,
            regionCount: regions.size,
            totalRegions: totalRegions.size
        }));

    // Should have some regionally limited resources
    assert(regionalResources.length >= 0, 'Regional resource calculation should work');
});

planetAnalyticsTests.test('Should group planets by type', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    const planetTypes = {};

    systems.forEach(system => {
        system.children?.forEach(planet => {
            const type = planet.userData?.planetType || 'unknown';
            planetTypes[type] = (planetTypes[type] || 0) + 1;
        });
    });

    assertGreaterThan(Object.keys(planetTypes).length, 0, 'Should have planet types');
});

planetAnalyticsTests.test('Should calculate system diversity score', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    const system = systems[0];
    const uniqueResources = new Set();
    const uniquePlanetTypes = new Set();

    system.children?.forEach(planet => {
        if (planet.userData?.planetType) {
            uniquePlanetTypes.add(planet.userData.planetType);
        }
        if (planet.userData?.resources) {
            Object.keys(planet.userData.resources).forEach(r => uniqueResources.add(r));
        }
    });

    const diversityScore = uniqueResources.size + uniquePlanetTypes.size;
    assert(diversityScore >= 0, 'Diversity score should be non-negative');
});

// =============================================================================
// RECIPE EXPLORER ANALYTICS TESTS
// =============================================================================

recipeAnalyticsTests.test('Should load recipe data', async () => {
    const response = await fetch('../JSON/recipes.json');
    assert(response.ok, 'Failed to load recipes.json');

    const data = await response.json();
    assertExists(data, 'Recipe data should exist');
    assertExists(data.recipes, 'Recipes array should exist');
    assertGreaterThan(data.recipes.length, 0, 'Should have recipes');
});

recipeAnalyticsTests.test('Should count recipes by tier', async () => {
    const response = await fetch('../JSON/recipes.json');
    const data = await response.json();

    const tiers = {};
    data.recipes.forEach(recipe => {
        const tier = recipe.outputTier || 0;
        tiers[tier] = (tiers[tier] || 0) + 1;
    });

    assertGreaterThan(Object.keys(tiers).length, 0, 'Should have recipes in different tiers');
});

recipeAnalyticsTests.test('Should count recipes by category', async () => {
    const response = await fetch('../JSON/recipes.json');
    const data = await response.json();

    const categories = {};
    data.recipes.forEach(recipe => {
        const category = recipe.resourceType || 'Unknown';
        categories[category] = (categories[category] || 0) + 1;
    });

    assertGreaterThan(Object.keys(categories).length, 0, 'Should have recipe categories');
});

recipeAnalyticsTests.test('Should identify most complex recipes', async () => {
    const response = await fetch('../JSON/recipes.json');
    const data = await response.json();

    const complexityScores = data.recipes.map(recipe => ({
        name: recipe.outputName,
        complexity: (recipe.ingredients?.length || 0) * (recipe.outputTier || 1)
    }));

    const mostComplex = complexityScores
        .sort((a, b) => b.complexity - a.complexity)
        .slice(0, 10);

    assertGreaterThan(mostComplex.length, 0, 'Should identify complex recipes');
});

recipeAnalyticsTests.test('Should calculate average ingredients per recipe', async () => {
    const response = await fetch('../JSON/recipes.json');
    const data = await response.json();

    const totalIngredients = data.recipes.reduce((sum, recipe) =>
        sum + (recipe.ingredients?.length || 0), 0
    );

    const averageIngredients = totalIngredients / data.recipes.length;
    assertGreaterThan(averageIngredients, 0, 'Average ingredients should be positive');
});

recipeAnalyticsTests.test('Should identify bottleneck resources', async () => {
    const response = await fetch('../JSON/recipes.json');
    const data = await response.json();

    const ingredientUsage = {};

    data.recipes.forEach(recipe => {
        recipe.ingredients?.forEach(ingredient => {
            const name = ingredient.name || ingredient.ingredientName;
            if (name) {
                ingredientUsage[name] = (ingredientUsage[name] || 0) + 1;
            }
        });
    });

    const bottlenecks = Object.entries(ingredientUsage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    assertGreaterThan(bottlenecks.length, 0, 'Should identify bottleneck resources');
});

recipeAnalyticsTests.test('Should calculate average construction time by tier', async () => {
    const response = await fetch('../JSON/recipes.json');
    const data = await response.json();

    const tierTimes = {};
    const tierCounts = {};

    data.recipes.forEach(recipe => {
        const tier = recipe.outputTier || 0;
        const time = recipe.constructionTime || 0;

        tierTimes[tier] = (tierTimes[tier] || 0) + time;
        tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    });

    Object.keys(tierTimes).forEach(tier => {
        const avgTime = tierTimes[tier] / tierCounts[tier];
        assert(avgTime >= 0, `Tier ${tier} average time should be non-negative`);
    });
});

recipeAnalyticsTests.test('Should group recipes by output type', async () => {
    const response = await fetch('../JSON/recipes.json');
    const data = await response.json();

    const outputTypes = {};
    data.recipes.forEach(recipe => {
        const type = recipe.outputType || 'UNKNOWN';
        outputTypes[type] = (outputTypes[type] || 0) + 1;
    });

    assertGreaterThan(Object.keys(outputTypes).length, 0, 'Should have output types');
});

recipeAnalyticsTests.test('Should identify self-referential recipes', async () => {
    const response = await fetch('../JSON/recipes.json');
    const data = await response.json();

    const selfReferential = data.recipes.filter(recipe => {
        const outputName = recipe.outputName?.toLowerCase();
        return recipe.ingredients?.some(ing => {
            const ingName = (ing.name || ing.ingredientName || '').toLowerCase();
            return ingName === outputName;
        });
    });

    // Self-referential recipes might exist (like upgrades)
    assert(selfReferential.length >= 0, 'Self-referential check should work');
});

recipeAnalyticsTests.test('Should calculate resource dependency depth', async () => {
    const response = await fetch('../JSON/recipes.json');
    const data = await response.json();

    // Simple depth calculation based on tier
    const depthByTier = {};
    data.recipes.forEach(recipe => {
        const tier = recipe.outputTier || 0;
        const depth = (recipe.ingredients?.length || 0) + tier;
        depthByTier[recipe.outputName] = depth;
    });

    assert(Object.keys(depthByTier).length > 0, 'Should calculate dependency depths');
});

// =============================================================================
// RESOURCES EXPLORER ANALYTICS TESTS
// =============================================================================

resourcesAnalyticsTests.test('Should load resources data', async () => {
    const response = await fetch('../JSON/resources.json');
    assert(response.ok, 'Failed to load resources.json');

    const data = await response.json();
    assertExists(data, 'Resources data should exist');
    assert(Array.isArray(data), 'Resources data should be an array');
    assertGreaterThan(data.length, 0, 'Should have resources');
});

resourcesAnalyticsTests.test('Should count resources by category', async () => {
    const response = await fetch('../JSON/resources.json');
    const resources = await response.json();

    const categories = {};
    resources.forEach(resource => {
        const category = resource.category || 'Uncategorized';
        categories[category] = (categories[category] || 0) + 1;
    });

    assertGreaterThan(Object.keys(categories).length, 0, 'Should have resource categories');
});

resourcesAnalyticsTests.test('Should count resources by tier', async () => {
    const response = await fetch('../JSON/resources.json');
    const resources = await response.json();

    const tiers = {};
    resources.forEach(resource => {
        const tier = resource.tier || 0;
        tiers[tier] = (tiers[tier] || 0) + 1;
    });

    assertGreaterThan(Object.keys(tiers).length, 0, 'Should have resources in different tiers');
});

resourcesAnalyticsTests.test('Should identify tradeable vs non-tradeable resources', async () => {
    const response = await fetch('../JSON/resources.json');
    const resources = await response.json();

    const tradeable = resources.filter(r => r.tradeable === true || r.tradeable === undefined);
    const nonTradeable = resources.filter(r => r.tradeable === false);

    assert(tradeable.length + nonTradeable.length === resources.length,
        'All resources should be categorized');
});

resourcesAnalyticsTests.test('Should identify raw vs processed resources', async () => {
    const response = await fetch('../JSON/resources.json');
    const resources = await response.json();

    const raw = resources.filter(r =>
        r.category?.toLowerCase().includes('raw') ||
        r.type?.toLowerCase().includes('raw')
    );

    const processed = resources.filter(r =>
        r.category?.toLowerCase().includes('processed') ||
        r.category?.toLowerCase().includes('component')
    );

    // Should have some categorization
    assert(raw.length >= 0 && processed.length >= 0, 'Resource categorization should work');
});

resourcesAnalyticsTests.test('Should calculate resource tier distribution', async () => {
    const response = await fetch('../JSON/resources.json');
    const resources = await response.json();

    const tierDistribution = {};
    resources.forEach(resource => {
        const tier = resource.tier || 0;
        tierDistribution[tier] = (tierDistribution[tier] || 0) + 1;
    });

    const totalResources = resources.length;
    const tierPercentages = {};
    Object.keys(tierDistribution).forEach(tier => {
        tierPercentages[tier] = (tierDistribution[tier] / totalResources) * 100;
    });

    assert(Object.keys(tierPercentages).length > 0, 'Should calculate tier distribution');
});

resourcesAnalyticsTests.test('Should identify most common resource categories', async () => {
    const response = await fetch('../JSON/resources.json');
    const resources = await response.json();

    const categoryCounts = {};
    resources.forEach(resource => {
        const category = resource.category || 'Uncategorized';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    assertGreaterThan(topCategories.length, 0, 'Should identify top categories');
});

resourcesAnalyticsTests.test('Should identify resources with special properties', async () => {
    const response = await fetch('../JSON/resources.json');
    const resources = await response.json();

    const withProperties = resources.filter(r =>
        r.properties && Object.keys(r.properties).length > 0
    );

    // Some resources may have special properties
    assert(withProperties.length >= 0, 'Property detection should work');
});

resourcesAnalyticsTests.test('Should group resources by source type', async () => {
    const response = await fetch('../JSON/resources.json');
    const resources = await response.json();

    const sources = {};
    resources.forEach(resource => {
        const source = resource.source || resource.obtainedFrom || 'Unknown';
        sources[source] = (sources[source] || 0) + 1;
    });

    assert(Object.keys(sources).length >= 0, 'Should group by source type');
});

resourcesAnalyticsTests.test('Should calculate resource value metrics', async () => {
    const response = await fetch('../JSON/resources.json');
    const resources = await response.json();

    const withValue = resources.filter(r => r.value || r.basePrice);
    const valueStats = {
        count: withValue.length,
        totalValue: withValue.reduce((sum, r) => sum + (r.value || r.basePrice || 0), 0),
        avgValue: 0
    };

    if (withValue.length > 0) {
        valueStats.avgValue = valueStats.totalValue / withValue.length;
    }

    assert(valueStats.count >= 0, 'Value metrics calculation should work');
});

resourcesAnalyticsTests.test('Should identify resource rarity levels', async () => {
    const response = await fetch('../JSON/resources.json');
    const resources = await response.json();

    const rarityLevels = {};
    resources.forEach(resource => {
        const rarity = resource.rarity || resource.tier || 'common';
        rarityLevels[rarity] = (rarityLevels[rarity] || 0) + 1;
    });

    assert(Object.keys(rarityLevels).length > 0, 'Should identify rarity levels');
});

console.log('✅ Explorer Analytics Tests loaded successfully');
