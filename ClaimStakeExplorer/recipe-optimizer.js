/**
 * Recipe-Based ClaimStake Placement Optimizer
 * Finds optimal regions and planets for claim stake placement based on recipe resource requirements
 */

class RecipeOptimizer {
    constructor() {
        this.recipes = [];
        this.planets = [];
        this.resources = [];
        this.resourceTierData = null;
        this.selectedRecipe = null;

        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
    }

    async loadData() {
        try {
            // Load recipes
            if (typeof rawRecipeData !== 'undefined' && rawRecipeData.recipes) {
                this.recipes = rawRecipeData.recipes;
                console.log(`✅ Loaded ${this.recipes.length} recipes`);
            }

            // Load planets data
            const planetsResponse = await fetch('../JSON/planets.json');
            const planetsData = await planetsResponse.json();
            this.planets = planetsData.mapData || [];
            console.log(`✅ Loaded ${this.planets.length} systems with planets`);

            // Load resources data
            const resourcesResponse = await fetch('../JSON/resources.json');
            const resourcesData = await resourcesResponse.json();
            this.resources = resourcesData.resources || [];
            console.log(`✅ Loaded ${this.resources.length} resources`);

            // Load resource tier data
            const tierResponse = await fetch('../JSON/resource_tier_analysis.json');
            this.resourceTierData = await tierResponse.json();
            console.log(`✅ Loaded resource tier data`);

        } catch (error) {
            console.error('❌ Error loading data:', error);
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('recipeOptimizerSearch');
        const optimizeButton = document.getElementById('optimizeButton');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleRecipeSearch(e.target.value));
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && this.selectedRecipe) {
                    this.optimizePlacement();
                }
            });
        }

        if (optimizeButton) {
            optimizeButton.addEventListener('click', () => {
                if (window.spaceSounds) window.spaceSounds.scan();
                this.optimizePlacement();
            });
        }

        // Add faction filter listeners
        const factionCheckboxes = ['factionMUD', 'factionONI', 'factionUST'];
        factionCheckboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    if (window.spaceSounds) {
                        e.target.checked ? window.spaceSounds.select() : window.spaceSounds.deselect();
                    }
                    // Re-optimize if a recipe is selected
                    if (this.selectedRecipe) {
                        this.optimizePlacement();
                    }
                });
            }
        });
    }

    /**
     * Get selected factions from checkboxes
     * UST includes USTUR as they are the same faction
     */
    getSelectedFactions() {
        const factions = [];
        const checkboxes = [
            { id: 'factionMUD', value: 'MUD' },
            { id: 'factionONI', value: 'ONI' },
            { id: 'factionUST', value: ['UST', 'USTUR'] }
        ];

        checkboxes.forEach(({ id, value }) => {
            const checkbox = document.getElementById(id);
            if (checkbox && checkbox.checked) {
                if (Array.isArray(value)) {
                    factions.push(...value);
                } else {
                    factions.push(value);
                }
            }
        });

        return factions;
    }

    handleRecipeSearch(query) {
        const resultsContainer = document.getElementById('recipeSearchResults');
        const optimizeButton = document.getElementById('optimizeButton');

        if (!resultsContainer) return;

        if (!query || query.length < 2) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
            optimizeButton.disabled = true;
            this.selectedRecipe = null;
            return;
        }

        // Filter recipes by query
        const filteredRecipes = this.recipes.filter(recipe =>
            recipe.outputName.toLowerCase().includes(query.toLowerCase())
        );

        // Group recipes by outputName and take unique ones
        const uniqueRecipes = [];
        const seen = new Set();

        filteredRecipes.forEach(recipe => {
            if (!seen.has(recipe.outputName)) {
                seen.add(recipe.outputName);
                uniqueRecipes.push(recipe);
            }
        });

        if (uniqueRecipes.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No recipes found</div>';
            resultsContainer.style.display = 'block';
            optimizeButton.disabled = true;
            this.selectedRecipe = null;
            return;
        }

        // Display results
        resultsContainer.innerHTML = uniqueRecipes.slice(0, 10).map(recipe => `
            <div class="recipe-result-item" data-recipe="${encodeURIComponent(JSON.stringify(recipe))}">
                <div class="recipe-result-name">${recipe.outputName}</div>
                <div class="recipe-result-meta">
                    ${recipe.outputType} | ${recipe.ingredients.length} ingredients
                </div>
            </div>
        `).join('');

        resultsContainer.style.display = 'block';

        // Add click handlers
        resultsContainer.querySelectorAll('.recipe-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (window.spaceSounds) window.spaceSounds.click();
                const recipeData = JSON.parse(decodeURIComponent(e.currentTarget.dataset.recipe));
                this.selectRecipe(recipeData);
            });
        });
    }

    selectRecipe(recipe) {
        if (window.spaceSounds) window.spaceSounds.success();
        this.selectedRecipe = recipe;
        const searchInput = document.getElementById('recipeOptimizerSearch');
        const resultsContainer = document.getElementById('recipeSearchResults');
        const optimizeButton = document.getElementById('optimizeButton');

        if (searchInput) {
            searchInput.value = recipe.outputName;
        }

        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }

        if (optimizeButton) {
            optimizeButton.disabled = false;
        }

        console.log('✅ Selected recipe:', recipe.outputName);
    }

    /**
     * Main optimization algorithm
     * Finds best regions for claim stake placement based on recipe requirements
     */
    async optimizePlacement() {
        if (!this.selectedRecipe) {
            console.warn('No recipe selected');
            return;
        }

        console.log('🎯 Optimizing placement for:', this.selectedRecipe.outputName);

        // Get all unique resource names needed for the recipe
        const directIngredients = this.selectedRecipe.ingredients.map(ing => ing.name);
        console.log('Direct ingredients:', directIngredients);

        // Expand processed/component ingredients to raw materials
        const { rawResources, processedResources } = this.expandToRawMaterials(directIngredients);
        console.log('Raw resources needed:', rawResources);
        console.log('Processed resources:', processedResources);

        // Identify which processed items require multi-planet cooperation
        const multiPlanetItems = this.identifyMultiPlanetItems(processedResources);
        console.log('Multi-planet items:', multiPlanetItems);

        // Use raw resources for planet searching
        const requiredResources = [...rawResources];

        // Get resource tier information
        const resourceTiers = this.getResourceTiers(requiredResources);
        const maxTier = Math.max(...Object.values(resourceTiers).map(r => r.tier || 1));
        console.log('Resource tiers:', resourceTiers);
        console.log('Max tier required:', maxTier);

        // Store the recipe context for filtering craftable items
        this.currentRecipeContext = {
            directIngredients,
            rawResources,
            processedResources,
            allRequiredResources: [...directIngredients, ...processedResources]
        };

        // Get selected factions
        const selectedFactions = this.getSelectedFactions();
        console.log('Selected factions:', selectedFactions);

        // Analyze all planets and group by region
        const regionAnalysis = this.analyzePlanetsByRegion(requiredResources, resourceTiers, selectedFactions);

        // Calculate scores and rank regions
        const rankedRegions = this.rankRegions(regionAnalysis, requiredResources.length);

        // Display results
        this.displayResults(rankedRegions, requiredResources, maxTier, processedResources, multiPlanetItems);
    }

    /**
     * Expand processed/component materials to their raw material requirements
     * This uses a depth-first search through the recipe tree
     */
    expandToRawMaterials(ingredientNames) {
        const rawResources = new Set();
        const processedResources = new Set();
        const visited = new Set();

        const expandIngredient = (ingredientName, depth = 0) => {
            if (depth > 10) return; // Prevent infinite recursion
            if (visited.has(ingredientName)) return;
            visited.add(ingredientName);

            // Check if this is a raw resource
            const resource = this.resources.find(r => r.name === ingredientName);
            if (resource && resource.category === 'raw') {
                rawResources.add(ingredientName);
                return;
            }

            // Check if this ingredient has a recipe (meaning it's processed/component)
            const recipe = this.recipes.find(r => r.outputName === ingredientName);
            if (recipe && recipe.ingredients) {
                processedResources.add(ingredientName);
                // Recursively expand its ingredients
                recipe.ingredients.forEach(ing => {
                    expandIngredient(ing.name, depth + 1);
                });
            } else {
                // If we can't find it in resources or recipes, assume it's raw
                rawResources.add(ingredientName);
            }
        };

        // Expand all ingredients
        ingredientNames.forEach(name => expandIngredient(name));

        return {
            rawResources: Array.from(rawResources),
            processedResources: Array.from(processedResources)
        };
    }

    /**
     * Identify which processed/component items cannot be crafted on a single planet
     * within any region and require materials from multiple planets
     * Optimized to only check planets that have relevant resources
     */
    identifyMultiPlanetItems(processedResources) {
        const multiPlanetItems = new Set();

        console.log('🔍 Checking multi-planet items for:', processedResources);

        // For each processed resource, check if it can be made on any single planet
        processedResources.forEach(itemName => {
            // Find the recipe for this item
            const recipe = this.recipes.find(r => r.outputName === itemName);
            if (!recipe || !recipe.ingredients) {
                console.log(`  ❌ ${itemName}: No recipe found`);
                return;
            }

            // Get the raw materials needed for this item
            const { rawResources: itemRawResources } = this.expandToRawMaterials([itemName]);

            console.log(`  📋 ${itemName} requires raw resources:`, itemRawResources);

            // Quick check: if no raw resources needed, skip
            if (itemRawResources.length === 0) {
                console.log(`  ⚠️ ${itemName}: No raw resources needed`);
                return;
            }

            // Check if any single planet has all these raw resources
            let canBeCraftedOnSinglePlanet = false;
            let planetsChecked = 0;

            // Asteroid belt planet types (cannot place claim stakes)
            const asteroidBeltTypes = [3, 11, 19];

            // Check ALL systems for accuracy
            for (const system of this.planets) {
                if (!system.planets || canBeCraftedOnSinglePlanet) continue;

                for (const planet of system.planets) {
                    if (!planet.resources) continue;

                    // Skip asteroid belts - claim stakes cannot be placed on them
                    if (asteroidBeltTypes.includes(planet.type)) {
                        continue;
                    }

                    planetsChecked++;
                    const planetResourceNames = planet.resources.map(r => r.name);

                    // Quick check: does this planet have ALL the raw resources?
                    const hasAllRawResources = itemRawResources.every(raw =>
                        planetResourceNames.includes(raw)
                    );

                    if (hasAllRawResources) {
                        console.log(`  ✅ ${itemName}: CAN be crafted on ${planet.name} (type: ${planet.type})`);
                        canBeCraftedOnSinglePlanet = true;
                        break;
                    }
                }
            }

            console.log(`  📊 ${itemName}: Checked ${planetsChecked} planets, craftable: ${canBeCraftedOnSinglePlanet}`);

            if (!canBeCraftedOnSinglePlanet) {
                console.log(`  🔗 ${itemName}: REQUIRES MULTI-PLANET cooperation`);
                multiPlanetItems.add(itemName);
            }
        });

        console.log('🔗 Final multi-planet items:', Array.from(multiPlanetItems));
        return Array.from(multiPlanetItems);
    }

    /**
     * Get tier information for each required resource
     */
    getResourceTiers(resourceNames) {
        const tierMapping = this.resourceTierData?.type_to_tier_mapping || {};
        const resourceTiers = {};

        resourceNames.forEach(resourceName => {
            // Find the resource in our resources data
            const resource = this.resources.find(r => r.name === resourceName);

            if (resource) {
                resourceTiers[resourceName] = {
                    tier: resource.tier || 1,
                    category: resource.category || 'unknown'
                };
            } else {
                // Try to find in tier mapping
                const tierInfo = Object.values(tierMapping).find(t => t.name === resourceName);
                resourceTiers[resourceName] = {
                    tier: tierInfo?.tier || 1,
                    category: tierInfo?.category || 'unknown'
                };
            }
        });

        return resourceTiers;
    }

    /**
     * Analyze all planets and group by region
     * Now includes craftable items that can be made from planet's raw resources
     * Excludes asteroid belts (types 3, 11, 19) as claim stakes cannot be placed on them
     * Filters by selected factions
     */
    analyzePlanetsByRegion(requiredResources, resourceTiers, selectedFactions = []) {
        const regionData = new Map();

        // Asteroid belt planet types (cannot place claim stakes)
        const asteroidBeltTypes = [3, 11, 19];

        // Iterate through all systems and their planets
        this.planets.forEach(system => {
            if (!system.planets || system.planets.length === 0) return;

            system.planets.forEach(planet => {
                if (!planet.resources || planet.resources.length === 0) return;

                // Skip asteroid belts - claim stakes cannot be placed on them
                if (asteroidBeltTypes.includes(planet.type)) {
                    return;
                }

                // Extract region code from planet name
                const regionCode = this.extractRegionCode(planet.name);
                const factionCode = this.extractFactionCode(planet.name, system.name);

                // Filter by selected factions (if any are selected)
                if (selectedFactions.length > 0 && !selectedFactions.includes(factionCode)) {
                    return;
                }

                // Get planet's raw resources
                const planetResourceNames = planet.resources.map(r => r.name);

                // Check which required raw resources this planet has
                const matchedRawResources = requiredResources.filter(rr =>
                    planetResourceNames.includes(rr)
                );

                // Check which processed/component items can be crafted on this planet
                const craftableItems = this.getCraftableItemsOnPlanet(planetResourceNames) || [];

                // Combine matched raw resources with craftable processed/component items
                const matchedResources = [...matchedRawResources];
                if (craftableItems && craftableItems.length > 0) {
                    craftableItems.forEach(item => {
                        if (!matchedResources.includes(item)) {
                            matchedResources.push(item);
                        }
                    });
                }

                if (matchedResources.length === 0) return; // Skip planets with no matching resources

                // Initialize region data if not exists
                if (!regionData.has(regionCode)) {
                    regionData.set(regionCode, {
                        regionCode,
                        factions: new Map(),
                        totalPlanets: 0,
                        totalMatchedResources: 0,
                        uniqueResources: new Set()
                    });
                }

                const region = regionData.get(regionCode);

                // Initialize faction data if not exists
                if (!region.factions.has(factionCode)) {
                    region.factions.set(factionCode, {
                        factionCode,
                        planets: [],
                        uniqueResources: new Set(),
                        totalMatchedResources: 0
                    });
                }

                const faction = region.factions.get(factionCode);

                // Add planet to faction
                faction.planets.push({
                    name: planet.name,
                    systemName: system.name,
                    position: planet.position || { x: 0, y: 0, z: 0 },
                    matchedResources,
                    matchedRawResources,
                    craftableItems,
                    totalResources: planet.resources.length,
                    allResources: planet.resources
                });

                // Update counts
                matchedResources.forEach(r => {
                    faction.uniqueResources.add(r);
                    region.uniqueResources.add(r);
                });

                faction.totalMatchedResources += matchedResources.length;
                region.totalPlanets++;
                region.totalMatchedResources += matchedResources.length;
            });
        });

        return regionData;
    }

    /**
     * Determine which processed/component items can be crafted on a planet
     * based on the raw resources available
     * Only returns items that are relevant to the current recipe being optimized
     * Uses recursive checking to handle multi-level crafting
     */
    getCraftableItemsOnPlanet(planetResourceNames) {
        const craftable = [];

        if (!this.recipes || this.recipes.length === 0) {
            return craftable;
        }

        // Get the list of processed/component items needed for the current recipe
        const relevantProcessedItems = this.currentRecipeContext?.allRequiredResources || [];
        if (relevantProcessedItems.length === 0) {
            return craftable;
        }

        // Build a set of what we can make with the planet's resources
        const availableItems = new Set(planetResourceNames);

        // Iteratively check what can be crafted (up to 5 iterations for multi-step crafting)
        let itemsAdded = true;
        let iterations = 0;
        const maxIterations = 5;

        while (itemsAdded && iterations < maxIterations) {
            itemsAdded = false;
            iterations++;

            this.recipes.forEach(recipe => {
                if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) return;

                // Skip if we already know we can make this
                if (availableItems.has(recipe.outputName)) return;

                // Only check recipes whose output is needed for the current recipe
                if (!relevantProcessedItems.includes(recipe.outputName)) return;

                // Check if all ingredients are now available (either raw or craftable)
                const canCraft = recipe.ingredients.every(ingredient => {
                    if (!ingredient || !ingredient.name) return false;
                    return availableItems.has(ingredient.name);
                });

                if (canCraft && recipe.outputName) {
                    availableItems.add(recipe.outputName);

                    // Only add to craftable list if it's not a raw resource
                    const outputResource = this.resources.find(r => r.name === recipe.outputName);
                    if (!outputResource || outputResource.category !== 'raw') {
                        craftable.push(recipe.outputName);
                        itemsAdded = true;
                    }
                }
            });
        }

        return craftable;
    }

    /**
     * Rank regions by their suitability for claim stake placement
     */
    rankRegions(regionData, totalRequiredResources) {
        const rankedRegions = [];

        regionData.forEach((region, regionCode) => {
            // Calculate coverage score (how many of the required resources are available)
            const coverageScore = region.uniqueResources.size / totalRequiredResources;

            // Calculate concentration score (how many planets have the resources)
            const concentrationScore = region.totalPlanets;

            // Calculate faction diversity (more factions = more options)
            const factionScore = region.factions.size;

            // Calculate proximity score for each faction
            const factionAnalysis = [];
            region.factions.forEach((faction, factionCode) => {
                const proximityScore = this.calculateProximityScore(faction.planets);
                factionAnalysis.push({
                    factionCode,
                    planets: faction.planets,
                    uniqueResources: Array.from(faction.uniqueResources),
                    proximityScore,
                    resourceCoverage: faction.uniqueResources.size / totalRequiredResources
                });
            });

            // Sort factions by coverage then proximity
            factionAnalysis.sort((a, b) => {
                const coverageDiff = b.resourceCoverage - a.resourceCoverage;
                if (Math.abs(coverageDiff) > 0.01) return coverageDiff;
                return b.proximityScore - a.proximityScore;
            });

            // Overall score
            const overallScore = (coverageScore * 10) + (concentrationScore * 0.5) + (factionScore * 0.2);

            rankedRegions.push({
                regionCode,
                coverageScore,
                concentrationScore,
                factionScore,
                overallScore,
                uniqueResourcesCount: region.uniqueResources.size,
                uniqueResources: Array.from(region.uniqueResources),
                totalPlanets: region.totalPlanets,
                factions: factionAnalysis
            });
        });

        // Sort by overall score
        rankedRegions.sort((a, b) => b.overallScore - a.overallScore);

        return rankedRegions;
    }

    /**
     * Calculate proximity score for a group of planets
     * Higher score = planets are closer together
     */
    calculateProximityScore(planets) {
        if (planets.length <= 1) return 0;

        // Calculate average distance between all planet pairs
        let totalDistance = 0;
        let pairCount = 0;

        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                const p1 = planets[i].position || { x: 0, y: 0, z: 0 };
                const p2 = planets[j].position || { x: 0, y: 0, z: 0 };

                const distance = Math.sqrt(
                    Math.pow(p2.x - p1.x, 2) +
                    Math.pow(p2.y - p1.y, 2) +
                    Math.pow(p2.z - p1.z, 2)
                );

                totalDistance += distance;
                pairCount++;
            }
        }

        const avgDistance = pairCount > 0 ? totalDistance / pairCount : 0;

        // Convert to proximity score (inverse of distance, normalized)
        // Lower average distance = higher proximity score
        const proximityScore = avgDistance > 0 ? 100 / avgDistance : 100;

        return proximityScore;
    }

    /**
     * Display optimization results
     */
    displayResults(rankedRegions, requiredResources, maxTier, processedResources = [], multiPlanetItems = []) {
        const resultsContainer = document.getElementById('recipeOptimizerResults');
        if (!resultsContainer) return;

        if (rankedRegions.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results-found">
                    <h3>❌ No Suitable Regions Found</h3>
                    <p>No regions found with planets containing the required raw resources for ${this.selectedRecipe.outputName}</p>
                    ${processedResources.length > 0 ? `
                        <div style="margin-top: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                            <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 0.5rem;">
                                <strong>Note:</strong> This recipe requires processed/component materials that must be crafted first:
                            </p>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${processedResources.map(r => `<span class="resource-tag">${r}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            return;
        }

        // Take top 10 regions
        const topRegions = rankedRegions.slice(0, 10);

        resultsContainer.innerHTML = `
            <div class="optimizer-results-header">
                <h3>🎯 Optimal ClaimStake Placement for: ${this.selectedRecipe.outputName}</h3>
                <div class="recipe-summary">
                    <div class="summary-item">
                        <span class="summary-label">Raw Resources Needed:</span>
                        <span class="summary-value">${requiredResources.length}</span>
                    </div>
                    ${processedResources.length > 0 ? `
                        <div class="summary-item">
                            <span class="summary-label">Processed Materials:</span>
                            <span class="summary-value">${processedResources.length}</span>
                        </div>
                    ` : ''}
                    <div class="summary-item">
                        <span class="summary-label">Recommended Tier:</span>
                        <span class="summary-value">T${maxTier}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Suitable Regions:</span>
                        <span class="summary-value">${rankedRegions.length}</span>
                    </div>
                </div>
                ${processedResources.length > 0 ? `
                    <div style="margin-top: 1rem; padding: 1rem; background: rgba(79, 172, 254, 0.1); border: 1px solid rgba(79, 172, 254, 0.2); border-radius: 8px;">
                        <p style="color: rgba(255, 255, 255, 0.9); margin-bottom: 0.75rem;">
                            <strong>ℹ️ Recipe Requirements:</strong> This recipe requires the following materials:
                        </p>
                        ${multiPlanetItems.length > 0 ? `
                            <div style="margin-bottom: 0.75rem; padding: 0.75rem; background: rgba(231, 76, 60, 0.1); border: 1px solid rgba(231, 76, 60, 0.2); border-radius: 6px;">
                                <div style="color: #e74c3c; font-size: 0.85rem; margin-bottom: 0.5rem;">
                                    <strong>⚠️ Multi-Planet Cooperation Required:</strong>
                                    <div style="color: rgba(255, 255, 255, 0.7); font-size: 0.8rem; margin-top: 0.25rem;">
                                        These items cannot be crafted on any single planet. You will need to transport materials between planets:
                                    </div>
                                </div>
                                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                    ${multiPlanetItems.map(r => {
                                        const resourceType = this.getResourceType(r);
                                        return `<span class="resource-tag-small ${resourceType}" style="border: 2px solid #e74c3c;">🔗 ${r}</span>`;
                                    }).join('')}
                                </div>
                            </div>
                        ` : ''}
                        <div style="margin-bottom: 0.75rem;">
                            <div style="color: rgba(255, 255, 255, 0.7); font-size: 0.85rem; margin-bottom: 0.5rem;">
                                <strong>Processed/Component Materials (can be crafted on single planets):</strong>
                            </div>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${processedResources.filter(r => !multiPlanetItems.includes(r)).map(r => {
                                    const resourceType = this.getResourceType(r);
                                    return `<span class="resource-tag-small ${resourceType}">${r}</span>`;
                                }).join('')}
                            </div>
                        </div>
                        <div>
                            <div style="color: rgba(255, 255, 255, 0.7); font-size: 0.85rem; margin-bottom: 0.5rem;">
                                <strong>Raw Resources (found on planets):</strong>
                            </div>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${requiredResources.map(r => {
                                    const resourceType = this.getResourceType(r);
                                    return `<span class="resource-tag-small ${resourceType}">${r}</span>`;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}

                <div class="resource-legend" style="margin-top: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.03); border-radius: 8px;">
                    <div style="color: rgba(255, 255, 255, 0.8); margin-bottom: 0.5rem; font-weight: 600;">Resource Legend:</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span class="resource-tag-small raw-resource">Raw</span>
                            <span style="color: rgba(255, 255, 255, 0.7); font-size: 0.85rem;">Found on planets</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span class="resource-tag-small processed-resource">Processed/Component</span>
                            <span style="color: rgba(255, 255, 255, 0.7); font-size: 0.85rem;">Must be crafted</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; border-left: 1px solid rgba(255, 255, 255, 0.2); padding-left: 1rem;">
                            <span style="font-size: 1rem;">🔨</span>
                            <span style="color: rgba(255, 255, 255, 0.7); font-size: 0.85rem;">Craftable on planet</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="regions-grid">
                ${topRegions.map((region, index) => this.renderRegionCard(region, index + 1, requiredResources, maxTier)).join('')}
            </div>
        `;
    }

    renderRegionCard(region, rank, requiredResources, maxTier) {
        const coveragePercent = (region.coverageScore * 100).toFixed(0);
        const coverageColor = region.coverageScore >= 0.8 ? '#2ecc71' :
                              region.coverageScore >= 0.5 ? '#f39c12' : '#e74c3c';

        return `
            <div class="region-card" data-region="${region.regionCode}">
                <div class="region-card-header">
                    <div class="region-rank">#${rank}</div>
                    <div class="region-title">
                        <h4>Region ${region.regionCode}</h4>
                        <div class="region-score" style="color: ${coverageColor}">
                            ${coveragePercent}% Coverage
                        </div>
                    </div>
                </div>

                <div class="region-stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Resources Found:</span>
                        <span class="stat-value">${region.uniqueResourcesCount}/${requiredResources.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Planets:</span>
                        <span class="stat-value">${region.totalPlanets}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Factions:</span>
                        <span class="stat-value">${region.factionScore}</span>
                    </div>
                </div>

                <div class="missing-resources">
                    ${this.renderMissingResources(region.uniqueResources, requiredResources)}
                </div>

                <div class="faction-recommendations">
                    <h5>📍 Best Faction Placement:</h5>
                    ${region.factions.slice(0, 3).map(faction => this.renderFactionRecommendation(faction, requiredResources)).join('')}
                </div>
            </div>
        `;
    }

    renderMissingResources(foundResources, requiredResources) {
        const missing = requiredResources.filter(r => !foundResources.includes(r));

        if (missing.length === 0) {
            return '<div class="all-resources-found">✅ All resources available in this region!</div>';
        }

        return `
            <div class="missing-resources-list">
                <strong>⚠️ Missing Resources:</strong>
                <div class="resource-tags">
                    ${missing.map(r => `<span class="resource-tag missing">${r}</span>`).join('')}
                </div>
            </div>
        `;
    }

    renderFactionRecommendation(faction, requiredResources) {
        const coveragePercent = (faction.resourceCoverage * 100).toFixed(0);

        return `
            <div class="faction-recommendation">
                <div class="faction-header">
                    <span class="faction-name">${faction.factionCode}</span>
                    <span class="faction-coverage">${coveragePercent}% coverage · ${faction.planets.length} planet${faction.planets.length !== 1 ? 's' : ''}</span>
                </div>
                <div class="faction-planets-scrollable">
                    ${faction.planets.map(planet => `
                        <div class="planet-item-detailed">
                            <div class="planet-item-header">
                                <div class="planet-name">${planet.name}</div>
                                <div class="planet-resources-count">${planet.matchedResources.length} resource${planet.matchedResources.length !== 1 ? 's' : ''}</div>
                            </div>
                            <div class="planet-resources-list">
                                ${(planet.matchedResources || []).map(r => {
                                    const resourceType = this.getResourceType(r);
                                    const isCraftable = planet.craftableItems && Array.isArray(planet.craftableItems) && planet.craftableItems.includes(r);
                                    const isRaw = planet.matchedRawResources && Array.isArray(planet.matchedRawResources) && planet.matchedRawResources.includes(r);

                                    let icon = '';
                                    if (isCraftable) {
                                        icon = '<span style="font-size: 0.7em; margin-right: 2px;" title="Craftable on this planet">🔨</span>';
                                    }

                                    return `<span class="resource-tag-small ${resourceType}">${icon}${r}</span>`;
                                }).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Determine if a resource is raw, processed, or component
     */
    getResourceType(resourceName) {
        // Check in resources data first
        const resource = this.resources.find(r => r.name === resourceName);
        if (resource) {
            if (resource.category === 'raw') return 'raw-resource';
            if (resource.category === 'processed') return 'processed-resource';
            if (resource.category === 'component') return 'component-resource';
        }

        // Check if it has a recipe (meaning it's crafted)
        const recipe = this.recipes.find(r => r.outputName === resourceName);
        if (recipe) {
            return 'processed-resource';
        }

        // Default to raw
        return 'raw-resource';
    }

    extractRegionCode(planetName) {
        if (!planetName) return 'Other';
        const match = planetName.match(/^(\d{3}|CSS)/);
        return match ? match[1] : 'Other';
    }

    extractFactionCode(planetName, systemName = '') {
        const sources = [planetName, systemName].filter(Boolean);

        for (const source of sources) {
            const factionMatch = source.match(/-(\w{3})-/i);
            if (factionMatch && factionMatch[1]) {
                return factionMatch[1].toUpperCase();
            }

            const prefixMatch = source.match(/^(\w{3})/i);
            if (prefixMatch && prefixMatch[1]) {
                return prefixMatch[1].toUpperCase();
            }
        }

        return 'UNK';
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.recipeOptimizer = new RecipeOptimizer();
    });
} else {
    window.recipeOptimizer = new RecipeOptimizer();
}
