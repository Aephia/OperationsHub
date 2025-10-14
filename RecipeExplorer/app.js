class RecipeExplorerApp {
    constructor() {
        this.treeRenderer = null;
        this.analytics = null;
        this.selectedRecipes = new Set();
        this.allRecipes = [];
        this.filteredRecipes = [];
        this.currentTab = 'explorer';
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Recipe Explorer App...');

        await this.loadData();
        this.extractAllRecipes();

        try {
            this.initializeTreeRenderer();
        } catch (error) {
            console.error('❌ Tree renderer initialization failed, but continuing:', error);
        }

        try {
            this.initializeAnalytics();
        } catch (error) {
            console.error('❌ Analytics initialization failed, but continuing:', error);
        }

        this.populateRecipeCheckboxes();
        this.setupEventListeners();
        this.setupTabSwitching();

        console.log('✅ Recipe Explorer App initialization complete');

        // Check URL parameters after checkboxes are fully rendered
        setTimeout(() => this.checkURLParameters(), 200);
    }

    async loadData() {
        try {
            console.log('📦 Loading Recipe Explorer data...');
            this.recipeData = await DataLoader.loadExplorerData('recipe');
            console.log(`✅ Loaded ${this.recipeData.categories.length} recipe categories using DataLoader`);
        } catch (error) {
            console.error('💥 Error loading recipe data:', error);
            this.recipeData = { categories: [] };
        }
    }

    extractAllRecipes() {
        this.allRecipes = [];

        if (!this.recipeData || !this.recipeData.categories) {
            console.error('❌ No recipe data available');
            return;
        }

        console.log('📊 Extracting recipes from', this.recipeData.categories.length, 'categories');

        this.recipeData.categories.forEach((category, categoryIndex) => {
            category.recipes.forEach((recipe, recipeIndex) => {
                this.allRecipes.push({
                    ...recipe,
                    category: category.name,
                    categoryIcon: category.icon
                });
            });
        });

        this.filteredRecipes = [...this.allRecipes];
        console.log('✅ Extracted', this.allRecipes.length, 'total recipes');
    }

    initializeTreeRenderer() {
        const treeContainer = document.getElementById('treeContainer');

        // Check if we're in a test environment or missing DOM elements
        if (!treeContainer) {
            console.log('ℹ️ Tree container not found - likely in test environment, skipping tree renderer initialization');
            return;
        }

        // Check if EnhancedTreeRenderer is available
        if (typeof EnhancedTreeRenderer === 'undefined') {
            console.error('❌ EnhancedTreeRenderer class not found! Make sure enhanced-tree-renderer.js is loaded.');
            console.log('Available globals:', Object.keys(window).filter(k => k.includes('Tree')));
            treeContainer.innerHTML = `
                <div class="error-message">
                    <h3>❌ Tree Renderer Error</h3>
                    <p>Enhanced Tree Renderer not loaded. Please refresh the page.</p>
                    <p>If this persists, clear your browser cache.</p>
                </div>
            `;
            return;
        }

        try {
            this.treeRenderer = new EnhancedTreeRenderer(treeContainer);
        } catch (error) {
            console.error('❌ Failed to create EnhancedTreeRenderer:', error);
            treeContainer.innerHTML = `
                <div class="error-message">
                    <h3>❌ Tree Renderer Error</h3>
                    <p>Failed to initialize tree renderer: ${error.message}</p>
                </div>
            `;
            return;
        }

        // Ensure the tree renderer uses the same recipes as the app
        if (this.allRecipes.length > 0) {
            this.treeRenderer.buildRecipeCache(this.allRecipes);
        }
    }

    initializeAnalytics() {
        if (typeof RecipeAnalytics !== 'undefined' && this.recipeData) {
            this.analytics = new RecipeAnalytics(this.recipeData);
        } else {
            console.warn('⚠️ RecipeAnalytics or recipeData not available');
        }
    }

    populateRecipeCheckboxes() {
        const container = document.getElementById('recipeCheckboxes');
        if (!container) {
            console.log('ℹ️ Recipe checkboxes container not found - likely in test environment, skipping');
            return;
        }

        container.innerHTML = '';

        if (!this.recipeData || !this.recipeData.categories) {
            console.error('❌ Recipe data not available for populating checkboxes');
            container.innerHTML = `
                <div class="error-message">
                    <h3>❌ Recipe Data Error</h3>
                    <p>Recipe data not loaded. Please refresh the page.</p>
                </div>
            `;
            return;
        }

        console.log('📦 Populating recipe checkboxes with', this.recipeData.categories.length, 'categories');

        // Create expandable categories
        this.recipeData.categories.forEach((category, categoryIndex) => {
            // Filter recipes for this category based on current filters
            const categoryRecipes = category.recipes.filter(recipe =>
                this.filteredRecipes.some(filtered => filtered.id === recipe.id)
            );

            if (categoryRecipes.length === 0) {
                return;
            }

            // Create category container
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'category-container';
            categoryContainer.setAttribute('data-category', category.name);

            // Category header (expandable)
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header expandable';
            categoryHeader.innerHTML = `
                <div class="category-title">
                    <span class="expand-icon">▶</span>
                    <span class="category-info">
                        ${category.icon} ${category.name} (${categoryRecipes.length})
                    </span>
                </div>
            `;

            // Recipe content container (initially hidden)
            const recipeContent = document.createElement('div');
            recipeContent.className = 'category-recipes collapsed';

            // Recipe checkboxes
            categoryRecipes.forEach(recipe => {

                const checkboxItem = document.createElement('div');
                checkboxItem.className = 'checkbox-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `recipe-${recipe.id}`;
                checkbox.value = recipe.id;  // Use ID for matching URL params
                checkbox.setAttribute('data-name', recipe.name);  // Store name as data attribute
                checkbox.addEventListener('change', () => this.handleRecipeSelection());

                const label = document.createElement('label');
                label.htmlFor = `recipe-${recipe.id}`;
                const tierText = recipe.tier ? ` (T${recipe.tier})` : '';
                label.innerHTML = `
                    ${this.getTypeIcon(recipe.type)} ${recipe.name}${tierText}
                `;

                const typeSpan = document.createElement('span');
                typeSpan.className = `recipe-count ${recipe.type}`;
                typeSpan.textContent = this.getTypeLabel(recipe.type);

                checkboxItem.appendChild(checkbox);
                checkboxItem.appendChild(label);
                checkboxItem.appendChild(typeSpan);
                recipeContent.appendChild(checkboxItem);
            });

            // Add click handler for category expansion
            categoryHeader.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleCategory(categoryContainer);
            });

            categoryContainer.appendChild(categoryHeader);
            categoryContainer.appendChild(recipeContent);
            container.appendChild(categoryContainer);
        });
    }

    toggleCategory(categoryContainer) {
        const recipeContent = categoryContainer.querySelector('.category-recipes');
        const expandIcon = categoryContainer.querySelector('.expand-icon');

        if (!recipeContent || !expandIcon) {
            console.error('Could not find recipe content or expand icon');
            return;
        }

        const isCollapsed = recipeContent.classList.contains('collapsed');

        if (isCollapsed) {
            // Expand
            recipeContent.classList.remove('collapsed');
            expandIcon.textContent = '▼';
        } else {
            // Collapse
            recipeContent.classList.add('collapsed');
            expandIcon.textContent = '▶';
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    setupTabSwitching() {
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {

        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');

        this.currentTab = tabName;

        // Initialize analytics data when switching to analytics tab
        if (tabName === 'analytics' && this.analytics) {
            this.analytics.renderAnalytics();
        }
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase();

        if (!term) {
            this.filteredRecipes = [...this.allRecipes];
        } else {
            this.filteredRecipes = this.allRecipes.filter(recipe =>
                recipe.name.toLowerCase().includes(term) ||
                (recipe.description && recipe.description.toLowerCase().includes(term)) ||
                recipe.category.toLowerCase().includes(term) ||
                (recipe.inputs && recipe.inputs.some(input => input.name.toLowerCase().includes(term)))
            );
        }

        this.populateRecipeCheckboxes();
        this.handleRecipeSelection(); // Refresh the tree if recipes were selected
    }

    handleRecipeSelection() {
        // Get selected recipes
        this.selectedRecipes.clear();
        const checkboxes = document.querySelectorAll('#recipeCheckboxes input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            this.selectedRecipes.add(checkbox.value);
        });

        this.updateTreeDisplay();
    }

    updateTreeDisplay() {
        const titleElement = document.getElementById('selectedRecipeTitle');
        const descriptionElement = document.getElementById('selectedRecipeDescription');

        if (this.selectedRecipes.size === 0) {
            titleElement.textContent = 'Select a Recipe';
            descriptionElement.textContent = 'Choose recipes from the left sidebar to view their dependency trees';
            this.treeRenderer.renderMultipleRecipes([]);
            return;
        }

        // Update header
        const recipeIds = Array.from(this.selectedRecipes);
        if (recipeIds.length === 1) {
            const recipe = this.findRecipeById(recipeIds[0]);
            if (recipe) {
                titleElement.textContent = `${this.getTypeIcon(recipe.type)} ${recipe.name}`;
                descriptionElement.textContent = recipe.description || '';
            }
        } else {
            titleElement.textContent = `${recipeIds.length} Recipes Selected`;
            descriptionElement.textContent = `Viewing dependency trees for multiple recipes`;
        }

        // Render the tree(s) - pass IDs directly to the tree renderer
        this.treeRenderer.renderMultipleRecipes(recipeIds);
    }

    findRecipeById(recipeId) {
        return this.allRecipes.find(recipe => recipe.id === recipeId);
    }

    findRecipeByName(recipeName) {
        return this.allRecipes.find(recipe => recipe.name === recipeName);
    }

    resolveRecipeFromParam(recipeParam) {
        if (!recipeParam) {
            return null;
        }

        console.log('🔍 Resolving recipe from param:', recipeParam);

        // Direct ID match
        let recipe = this.findRecipeById(recipeParam);
        if (recipe) {
            console.log('✅ Found recipe by direct ID match:', { id: recipe.id, name: recipe.name, tier: recipe.tier });
            return recipe;
        }

        const lowerParam = recipeParam.toLowerCase();

        // Case-insensitive ID match
        recipe = this.allRecipes.find(r => r.id.toLowerCase() === lowerParam);
        if (recipe) {
            return recipe;
        }

        // Extract tier from param if present (e.g., "ice-giant-central-hub-t1" -> tier 1)
        const tierMatch = lowerParam.match(/-t(\d+)$/);
        const tier = tierMatch ? parseInt(tierMatch[1], 10) : null;
        const paramWithoutTier = tierMatch ? lowerParam.replace(/-t\d+$/, '') : lowerParam;

        if (tier !== null) {
            console.log(`🔍 Extracted tier ${tier} from URL, searching for: "${paramWithoutTier}"`);
        }

        // Slug-style normalization (matches names or IDs that omit prefixes)
        const normalizedParam = paramWithoutTier
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // If tier is specified, try to match by name + tier first
        if (tier !== null) {
            recipe = this.allRecipes.find(r => {
                const normalizedName = r.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                return normalizedName === normalizedParam && r.tier === tier;
            });
            if (recipe) {
                return recipe;
            }
        }

        // Match by normalized ID (handles prefixes like ship-component-)
        recipe = this.allRecipes.find(r => {
            const normalizedId = r.id.toLowerCase();
            const matchesId = normalizedId === normalizedParam
                || normalizedId.endsWith(`-${normalizedParam}`)
                || normalizedId.includes(normalizedParam);

            if (tier !== null) {
                return matchesId && r.tier === tier;
            }
            return matchesId;
        });
        if (recipe) {
            return recipe;
        }

        // Match by exact name
        recipe = this.allRecipes.find(r => {
            const matchesName = r.name.toLowerCase() === paramWithoutTier;
            if (tier !== null) {
                return matchesName && r.tier === tier;
            }
            return matchesName;
        });
        if (recipe) {
            return recipe;
        }

        // Match by normalized name slug
        recipe = this.allRecipes.find(r => {
            const normalizedName = r.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            const matchesName = normalizedName === normalizedParam;
            if (tier !== null) {
                return matchesName && r.tier === tier;
            }
            return matchesName;
        });

        return recipe || null;
    }

    getRecipeIcon(recipeId) {
        const recipe = this.findRecipeById(recipeId);
        return recipe ? this.getTypeIcon(recipe.type) : '📦';
    }

    getTypeIcon(type) {
        switch (type) {
            case 'raw': return '⛏️';
            case 'intermediate': return '🔧';
            case 'final': return '🏭';
            case 'fluid': return '💧';
            default: return '📦';
        }
    }

    getTypeLabel(type) {
        switch (type) {
            case 'raw': return 'Raw';
            case 'intermediate': return 'Inter';
            case 'final': return 'Final';
            case 'fluid': return 'Fluid';
            default: return 'Item';
        }
    }

    // Check URL parameters and pre-select recipe if specified
    checkURLParameters(retryCount = 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const maxRetries = 5;
        const recipeId = urlParams.get('recipe');

        if (!recipeId) return;

        console.log('\U0001f517 Recipe ID from URL:', recipeId);

        const availableCheckboxes = document.querySelectorAll('#recipeCheckboxes input[type="checkbox"]');
        if (availableCheckboxes.length === 0) {
            if (retryCount < maxRetries) {
                console.warn(`\u26a0\ufe0f Recipe checkboxes not rendered yet. Retrying (${retryCount + 1}/${maxRetries})...`);
                setTimeout(() => this.checkURLParameters(retryCount + 1), 200 * (retryCount + 1));
            } else {
                console.error('\u274c Unable to apply recipe selection: checkboxes not available after retries.');
            }
            return;
        }

        const recipeMatch = this.resolveRecipeFromParam(recipeId);
        if (!recipeMatch) {
            console.error('\u274c Recipe not found in data:', recipeId);
            console.log('Available recipe IDs:', this.allRecipes.slice(0, 10).map(r => r.id));
            // Try to find all Ice Giant Central Hub recipes for debugging
            const iceGiantRecipes = this.allRecipes.filter(r => r.name && r.name.toLowerCase().includes('ice giant central hub'));
            if (iceGiantRecipes.length > 0) {
                console.log('🔍 Found Ice Giant Central Hub recipes:', iceGiantRecipes.map(r => ({ id: r.id, name: r.name, tier: r.tier })));
            }
            return;
        }

        console.log('✅ Resolved recipe:', { id: recipeMatch.id, name: recipeMatch.name, tier: recipeMatch.tier });

        const normalizedId = recipeMatch.id;
        if (normalizedId !== recipeId) {
            console.log(`\u2705 Normalized recipe parameter to: ${normalizedId}`);
        }

        const checkbox = document.querySelector(`input[value="${normalizedId}"]`);

        if (checkbox) {
            console.log('\u2705 Found checkbox for recipe:', normalizedId);
            checkbox.checked = true;

            const categoryRecipes = checkbox.closest('.category-recipes');
            if (categoryRecipes && categoryRecipes.classList.contains('collapsed')) {
                const categoryHeader = categoryRecipes.previousElementSibling;
                if (categoryHeader) {
                    categoryHeader.click();
                }
            }

            this.handleRecipeSelection();
        } else {
            console.warn(`\u26a0\ufe0f Checkbox not found for recipe: ${normalizedId} (attempt ${retryCount + 1}/${maxRetries})`);

            if (retryCount < maxRetries) {
                setTimeout(() => this.checkURLParameters(retryCount + 1), 200 * (retryCount + 1));
            } else {
                console.warn(`\u26a0\ufe0f Checkbox not found after retries. Manually selecting recipe: ${recipeMatch.name}`);
                this.selectedRecipes.add(normalizedId);
                this.updateTreeDisplay();
            }
        }
    }

}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.recipeExplorerApp = new RecipeExplorerApp();
    } catch (error) {
        console.error('💥 Failed to create Recipe Explorer App:', error);
    }
});
