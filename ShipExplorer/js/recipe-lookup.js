/**
 * Recipe Lookup Module
 * Maps ship components to their crafting recipes and calculates costs
 */

class RecipeLookup {
    constructor() {
        this.recipes = [];
        this.recipesLoaded = false;
        this.recipesByOutput = new Map(); // outputId -> recipe
    }

    /**
     * Load recipe data
     */
    async loadRecipes() {
        if (this.recipesLoaded) return;

        try {
            console.log('[RecipeLookup] Loading recipe data...');
            const response = await fetch('../JSON/recipes.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            this.recipes = data.recipes || [];

            // Build lookup map
            this.recipes.forEach(recipe => {
                if (recipe.outputId) {
                    this.recipesByOutput.set(recipe.outputId, recipe);
                }
            });

            this.recipesLoaded = true;
            console.log(`[RecipeLookup] Loaded ${this.recipes.length} recipes`);
        } catch (error) {
            console.error('[RecipeLookup] Failed to load recipes:', error);
        }
    }

    /**
     * Map component class to recipe abbreviation
     */
    getRecipeClassAbbreviation(componentClass) {
        const mapping = {
            'XXS': 'XXS',
            'XS': 'XS',
            'S': 'S',
            'M': 'M',
            'L': 'L',
            'XL': 'CLASS8', // Special case
            'XXL': 'CMD',    // Commander
            'CAP': 'CAP',    // Capital
            'Capital': 'CAP',
            'Titan': 'TTN'
        };
        return mapping[componentClass] || componentClass;
    }

    /**
     * Provide alternate search tokens for component types whose recipe names differ
     */
    getTypeSearchVariants(componentType) {
        const base = (componentType || '').toString().trim();
        if (!base) return [];

        const aliasMap = {
            'ammo module': ['Ammo'],
            'fuel module': ['Fuel'],
            'cargo module': ['Cargo'],
            'passenger module': ['Passenger']
        };

        const variants = [base];
        const lower = base.toLowerCase();

        // Drop trailing "Module" when present (e.g., "Ammo Module" -> "Ammo")
        if (lower.endsWith(' module')) {
            const trimmed = base.replace(/\\s+module$/i, '').trim();
            if (trimmed && !variants.includes(trimmed)) {
                variants.push(trimmed);
            }
        }

        const aliases = aliasMap[lower] || [];
        aliases.forEach(alias => {
            if (alias && !variants.includes(alias)) {
                variants.push(alias);
            }
        });

        return variants;
    }

    /**
     * Find recipes for a component by type, class, and tier
     */
    findComponentRecipes(componentType, componentClass, componentTier) {
        if (!this.recipesLoaded) {
            console.warn('[RecipeLookup] Recipes not loaded yet');
            return [];
        }

        const safeType = (componentType || '').toString().trim();
        const safeClass = (componentClass || '').toString().trim();
        const safeTier = (componentTier || '').toString().trim();

        if (!safeType) {
            console.warn('[RecipeLookup] Missing component type, cannot search for recipe');
            return [];
        }

        const classAbbrRaw = this.getRecipeClassAbbreviation(safeClass);
        const classAbbr = (classAbbrRaw || '').toString().trim();

        console.log('[RecipeLookup] Searching for:', { componentType, componentClass, componentTier });
        const typeCandidates = this.getTypeSearchVariants(safeType);

        const tryPatterns = (candidateType) => {
            const parts = [candidateType];
            if (classAbbr) parts.push(classAbbr);
            if (safeTier) parts.push(safeTier);
            const exactPattern = parts.join(' ').trim();

            if (exactPattern) {
                console.log('[RecipeLookup] Exact pattern:', exactPattern);
                const recipe = this.recipes.find(r => r.outputName === exactPattern);
                if (recipe) {
                    return recipe;
                }
            }

            if (classAbbr && safeClass && classAbbr.toLowerCase() !== safeClass.toLowerCase()) {
                const altParts = [candidateType, safeClass];
                if (safeTier) altParts.push(safeTier);
                const altPattern = altParts.join(' ').trim();
                console.log('[RecipeLookup] Trying alternate pattern:', altPattern);
                const recipe = this.recipes.find(r => r.outputName === altPattern);
                if (recipe) {
                    return recipe;
                }
            }

            const slugParts = ['ship-component', candidateType.toLowerCase().replace(/\s+/g, '-')];
            if (classAbbr) {
                slugParts.push(classAbbr.toLowerCase());
            } else if (safeClass) {
                slugParts.push(safeClass.toLowerCase());
            }
            if (safeTier) {
                slugParts.push(safeTier.toLowerCase());
            }
            const idPattern = slugParts.join('-').replace(/-+/g, '-').replace(/-$/, '');
            console.log('[RecipeLookup] Trying ID pattern:', idPattern);
            const recipe = this.recipes.find(r => r.outputId === idPattern);
            if (recipe) {
                return recipe;
            }

            const exactMatch = this.recipes.find(r => r.outputName?.toLowerCase() === candidateType.toLowerCase());
            if (exactMatch) {
                return exactMatch;
            }

            const partialMatch = this.recipes.find(r => r.outputName?.toLowerCase().includes(candidateType.toLowerCase()));
            if (partialMatch) {
                return partialMatch;
            }

            return null;
        };

        for (const candidate of typeCandidates) {
            const recipe = tryPatterns(candidate);
            if (recipe) {
                console.log('[RecipeLookup] ✅ Found recipe:', recipe.outputName);
                return [recipe];
            }
        }

        console.warn('[RecipeLookup] ⚠️ Recipe not found', { componentType, componentClass, componentTier });
        return [];
    }

    /**
     * Get all tiers of recipes for a component type and class
     */
    getAllTierRecipes(componentType, componentClass) {
        if (!this.recipesLoaded) return [];

        const classAbbr = this.getRecipeClassAbbreviation(componentClass);
        const tiers = ['T1', 'T2', 'T3', 'T4', 'T5'];
        const recipesByTier = [];

        tiers.forEach(tier => {
            const recipes = this.findComponentRecipes(componentType, componentClass, tier);
            if (recipes.length > 0) {
                recipesByTier.push({
                    tier,
                    recipes
                });
            }
        });

        return recipesByTier;
    }

    /**
     * Calculate total resource cost for a recipe (recursive)
     */
    calculateRecipeCost(recipe, depth = 0, maxDepth = 10) {
        if (!recipe || depth > maxDepth) return null;

        const costs = {
            totalResources: {},
            totalTime: recipe.constructionTime || 0,
            steps: recipe.productionSteps || 0
        };

        if (!recipe.ingredients) return costs;

        recipe.ingredients.forEach(ingredient => {
            const qty = ingredient.quantity || 1;

            // Try to find sub-recipe for this ingredient
            const subRecipe = this.recipes.find(r => r.outputName === ingredient.name);

            if (subRecipe && depth < maxDepth) {
                // Recursive: get costs of sub-recipe
                const subCosts = this.calculateRecipeCost(subRecipe, depth + 1, maxDepth);
                if (subCosts) {
                    // Add sub-recipe resources
                    Object.entries(subCosts.totalResources).forEach(([resource, amount]) => {
                        costs.totalResources[resource] = (costs.totalResources[resource] || 0) + (amount * qty);
                    });
                    costs.totalTime += subCosts.totalTime * qty;
                    costs.steps += subCosts.steps;
                }
            } else {
                // Leaf ingredient (base resource)
                costs.totalResources[ingredient.name] = (costs.totalResources[ingredient.name] || 0) + qty;
            }
        });

        return costs;
    }

    /**
     * Format time in human-readable format
     */
    formatTime(seconds) {
        if (!seconds) return '0s';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (secs > 0) parts.push(`${secs}s`);

        return parts.join(' ') || '0s';
    }

    /**
     * Get recipe explorer URL with recipe pre-selected
     */
    getRecipeExplorerUrl(recipeOutputName) {
        // Encode the recipe name for URL
        const encodedName = encodeURIComponent(recipeOutputName);
        return `../RecipeExplorer/index.html?recipe=${encodedName}`;
    }
}
