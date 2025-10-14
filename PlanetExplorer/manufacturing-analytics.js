/**
 * Manufacturing Analytics Module
 * Provides self-sufficiency insights for every planet by walking the recipe graph
 * and highlighting depth-aware manufacturable chains.
 */
class ManufacturingAnalytics {
    constructor() {
        this.crossAnalytics = new CrossExplorerAnalytics();
        this.data = null;
        this.currentPage = 1;
        this.itemsPerPage = 50;
        this.allPlanets = [];
        this.filteredPlanets = [];
        this.filters = {
            planet: '',
            type: '',
            resources: '',
            recipes: '',
            sufficiency: ''
        };
    }

    async renderManufacturingAnalytics() {
        const loadingMsg = document.getElementById('mfgLoadingMessage');
        const content = document.getElementById('manufacturingContent');

        if (loadingMsg) {
            loadingMsg.style.display = 'block';
            if (!loadingMsg.querySelector('.loading-progress')) {
                const progress = document.createElement('div');
                progress.className = 'loading-progress';
                progress.innerHTML = '<div class="loading-bar"></div>';
                loadingMsg.appendChild(progress);
            }
        }

        if (content) {
            content.innerHTML = '';
        }

        try {
            this.data = await this.crossAnalytics.analyzePlanetProductOptimization();
        } catch (error) {
            console.error('[ManufacturingAnalytics] Failed to compute analytics', error);
            if (loadingMsg) {
                loadingMsg.innerHTML = '<p style="color:#ff6b6b">⚠️ Failed to load manufacturing analytics. See console for details.</p>';
            }
            return;
        }

        if (loadingMsg) {
            loadingMsg.style.display = 'none';
        }

        this.updateStats();
        this.renderTopManufacturingPlanets();
    }

    updateStats() {
        if (!this.data || !this.data.planetScores) return;

        const planets = this.data.planetScores;
        const totalPlanets = planets.length;
        const topSufficiency = planets.length > 0 ? Math.max(...planets.map(p => p.selfSufficiencyScore)) : 0;

        // Count unique specializations
        const specializations = new Set();
        planets.forEach(p => {
            const details = this.getManufacturingDetails(p);
            if (details.topSpecialization) {
                specializations.add(details.topSpecialization.type);
            }
        });

        // Total recipes available across all planets
        const allRecipes = this.crossAnalytics?.dataCache?.recipes || [];
        const totalRecipes = allRecipes.length;

        document.getElementById('mfgTotalPlanets').textContent = totalPlanets.toLocaleString();
        document.getElementById('mfgTopSufficiency').textContent = topSufficiency.toFixed(1) + '%';
        document.getElementById('mfgSpecializations').textContent = specializations.size;
        document.getElementById('mfgTotalRecipes').textContent = totalRecipes.toLocaleString();
    }

    renderTopManufacturingPlanets() {
        const container = document.getElementById('manufacturingContent');
        if (!container || !this.data) {
            return;
        }

        this.currentPage = 1;
        this.allPlanets = this.data.planetScores || [];
        this.filteredPlanets = [...this.allPlanets];

        const section = document.createElement('section');
        section.className = 'analytics-section';
        section.id = 'manufacturingLeaderboard';
        section.innerHTML = `
            <h3>🏭 Top Manufacturing Planets</h3>
            <p class="section-note">Planets ranked by self-sufficiency - ability to manufacture recipes using only local resources. Click on "Total Recipes" to view manufacturing details.</p>

            <div class="pagination-controls">
                <button id="mfgPrevPage" class="pagination-btn">⟵ Previous</button>
                <span id="mfgPageInfo" class="page-info">Page 1 of ${Math.max(1, Math.ceil(this.filteredPlanets.length / this.itemsPerPage))}</span>
                <button id="mfgNextPage" class="pagination-btn">Next ⟶</button>
                <span class="filter-info" id="mfgFilterInfo"></span>
            </div>

            <div class="location-analysis-grid">
                <table class="location-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Planet</th>
                            <th>Type</th>
                            <th>Resources</th>
                            <th>Self-Sufficiency</th>
                            <th class="clickable-header">Total Recipes</th>
                        </tr>
                        <tr class="filter-row">
                            <th></th>
                            <th><input type="text" class="column-filter" data-column="planet" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-column="type" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-column="resources" placeholder="Min..."></th>
                            <th><input type="text" class="column-filter" data-column="sufficiency" placeholder="Min %..."></th>
                            <th><input type="text" class="column-filter" data-column="recipes" placeholder="Min..."></th>
                        </tr>
                    </thead>
                    <tbody id="mfgTableBody"></tbody>
                </table>
            </div>

            <div class="pagination-controls">
                <button id="mfgPrevPageBottom" class="pagination-btn">⟵ Previous</button>
                <span id="mfgPageInfoBottom" class="page-info">Page 1 of ${Math.max(1, Math.ceil(this.filteredPlanets.length / this.itemsPerPage))}</span>
                <button id="mfgNextPageBottom" class="pagination-btn">Next ⟶</button>
            </div>
        `;

        container.appendChild(section);

        // Render page one
        this.renderPlanetTablePage(1);

        const prevButtons = [
            document.getElementById('mfgPrevPage'),
            document.getElementById('mfgPrevPageBottom')
        ];
        const nextButtons = [
            document.getElementById('mfgNextPage'),
            document.getElementById('mfgNextPageBottom')
        ];

        prevButtons.forEach(btn => btn?.addEventListener('click', () => this.changePage(-1)));
        nextButtons.forEach(btn => btn?.addEventListener('click', () => this.changePage(1)));

        section.querySelectorAll('.column-filter').forEach(input => {
            input.addEventListener('input', (event) => this.handleFilter(event));
        });
    }

    handleFilter(event) {
        const column = event.target.getAttribute('data-column');
        if (!column) {
            return;
        }

        this.filters[column] = event.target.value.toLowerCase().trim();
        this.applyFilters();
    }

    applyFilters() {
        this.filteredPlanets = this.allPlanets.filter(planet => {
            if (this.filters.planet && !planet.planet.toLowerCase().includes(this.filters.planet)) {
                return false;
            }

            if (this.filters.type) {
                const typeName = this.getPlanetTypeName(planet.planetType).toLowerCase();
                if (!typeName.includes(this.filters.type)) {
                    return false;
                }
            }

            if (this.filters.resources) {
                const min = parseFloat(this.filters.resources);
                if (!Number.isNaN(min) && planet.totalResources < min) {
                    return false;
                }
            }

            if (this.filters.recipes) {
                const minRecipes = parseFloat(this.filters.recipes);
                if (!Number.isNaN(minRecipes) && planet.manufacturableRecipes < minRecipes) {
                    return false;
                }
            }

            if (this.filters.sufficiency) {
                const minSuff = parseFloat(this.filters.sufficiency);
                if (!Number.isNaN(minSuff) && planet.selfSufficiencyScore < minSuff) {
                    return false;
                }
            }

            return true;
        });

        const filterInfo = document.getElementById('mfgFilterInfo');
        if (filterInfo) {
            filterInfo.textContent = this.filteredPlanets.length === this.allPlanets.length
                ? ''
                : `Showing ${this.filteredPlanets.length} of ${this.allPlanets.length} planets`;
        }

        this.currentPage = 1;
        this.renderPlanetTablePage(1);
    }

    renderPlanetTablePage(page) {
        const totalPages = Math.max(1, Math.ceil(this.filteredPlanets.length / this.itemsPerPage));
        const clampedPage = Math.min(Math.max(page, 1), totalPages);
        this.currentPage = clampedPage;

        const startIdx = (clampedPage - 1) * this.itemsPerPage;
        const planetsToShow = this.filteredPlanets.slice(startIdx, startIdx + this.itemsPerPage);
        const tbody = document.getElementById('mfgTableBody');
        if (!tbody) {
            return;
        }

        tbody.innerHTML = planetsToShow.map((planet, index) => {
            const rank = startIdx + index + 1;
            const details = this.getManufacturingDetails(planet);
            const specialization = details.topSpecialization
                ? `${this.escapeHtml(details.topSpecialization.type)} (${details.topSpecialization.count})`
                : 'No specialization detected';

            return `
                <tr>
                    <td class="rank-cell">${rank}</td>
                    <td>${this.escapeHtml(planet.planet)}</td>
                    <td>${this.getPlanetTypeName(planet.planetType)}</td>
                    <td class="number-cell">${planet.totalResources}</td>
                    <td class="number-cell">${planet.selfSufficiencyScore.toFixed(1)}%</td>
                    <td class="clickable-recipes-cell" data-planet-index="${startIdx + index}" title="Click to view ${details.count} manufacturable recipes\nTop specialization: ${specialization}">
                        <span class="clickable-value">${details.count}</span>
                        <span class="click-hint">🔍 View Details</span>
                    </td>
                </tr>
            `;
        }).join('');

        tbody.querySelectorAll('.clickable-recipes-cell').forEach(cell => {
            cell.addEventListener('click', (event) => {
                const planetIndex = parseInt(event.currentTarget.getAttribute('data-planet-index'), 10);
                const planet = this.filteredPlanets[planetIndex];
                if (planet) {
                    this.showRecipeModal(planet);
                }
            });
        });

        const topInfo = document.getElementById('mfgPageInfo');
        const bottomInfo = document.getElementById('mfgPageInfoBottom');
        if (topInfo) topInfo.textContent = `Page ${clampedPage} of ${totalPages}`;
        if (bottomInfo) bottomInfo.textContent = `Page ${clampedPage} of ${totalPages}`;

        const disablePrev = clampedPage === 1;
        const disableNext = clampedPage === totalPages;
        ['mfgPrevPage', 'mfgPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disablePrev;
        });
        ['mfgNextPage', 'mfgNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disableNext;
        });
    }

    changePage(delta) {
        this.renderPlanetTablePage(this.currentPage + delta);
    }

    getManufacturingDetails(planet) {
        if (!planet) {
            return {
                count: 0,
                recipes: [],
                recipesByType: new Map(),
                depthSummary: [],
                depthBuckets: new Map(),
                maxDepth: 0,
                topSpecialization: null,
                typeTotals: [],
                planetTypeName: ''
            };
        }

        if (planet._manufacturingDetails) {
            return planet._manufacturingDetails;
        }

        const allRecipes = this.crossAnalytics?.dataCache?.recipes || [];
        const availableResources = new Set((planet.availableResources || planet.resources || []).map(r => typeof r === 'string' ? r : r.name));
        const planetTypeName = this.getPlanetTypeName(planet.planetType);
        const planetTypeNameLower = planetTypeName.toLowerCase();

        const matchesPlanetType = (recipe) => {
            if (!recipe.planetTypes || recipe.planetTypes.length === 0) {
                return true;
            }
            return recipe.planetTypes.some(type => {
                const lower = type.toLowerCase();
                return lower.includes(planetTypeNameLower) || planetTypeNameLower.includes(lower);
            });
        };

        const relevantRecipes = allRecipes.filter(recipe => recipe.ingredients && recipe.ingredients.length > 0 && matchesPlanetType(recipe));
        const maxDepthIterations = 6;
        const availableItems = new Set(availableResources);
        const remaining = [...relevantRecipes];
        const discoveredRecipes = [];
        const depthBuckets = new Map();
        const recipesByType = new Map();

        const sortRecipes = (list) => {
            list.sort((a, b) => {
                const tierA = a.outputTier || a.tier || 0;
                const tierB = b.outputTier || b.tier || 0;
                if (tierA !== tierB) return tierA - tierB;
                const timeA = a.constructionTime || a.time || 0;
                const timeB = b.constructionTime || b.time || 0;
                if (timeA !== timeB) return timeA - timeB;
                return (a.outputName || a.name || '').localeCompare(b.outputName || b.name || '');
            });
        };

        let depth = 1;
        while (remaining.length > 0 && depth <= maxDepthIterations) {
            const nextRemaining = [];
            const newlyManufacturable = [];

            for (const recipe of remaining) {
                const canManufacture = recipe.ingredients.every(ingredient => availableItems.has(ingredient.name));
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
                discoveredRecipes.push(recipe);

                if (!depthBuckets.has(depth)) {
                    depthBuckets.set(depth, []);
                }
                depthBuckets.get(depth).push(recipe);

                const type = recipe.resourceType || 'General';
                if (!recipesByType.has(type)) {
                    recipesByType.set(type, new Map());
                }
                const depthMap = recipesByType.get(type);
                if (!depthMap.has(depth)) {
                    depthMap.set(depth, []);
                }
                depthMap.get(depth).push(recipe);

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

        depthBuckets.forEach(list => sortRecipes(list));
        recipesByType.forEach(depthMap => depthMap.forEach(list => sortRecipes(list)));

        const depthSummary = Array.from(depthBuckets.entries()).map(([depthLevel, list]) => ({ depth: depthLevel, count: list.length }));
        const typeTotals = Array.from(recipesByType.entries()).map(([type, depthMap]) => ({
            type,
            count: Array.from(depthMap.values()).reduce((sum, list) => sum + list.length, 0)
        })).sort((a, b) => b.count - a.count);

        const topSpecialization = typeTotals.length ? typeTotals[0] : null;

        const details = {
            count: discoveredRecipes.length,
            recipes: discoveredRecipes,
            recipesByType,
            depthSummary,
            depthBuckets,
            maxDepth: depthSummary.length ? Math.max(...depthSummary.map(d => d.depth)) : 0,
            topSpecialization,
            typeTotals,
            planetTypeName
        };

        planet.manufacturableRecipes = details.count;
        planet.topSpecialization = details.topSpecialization || planet.topSpecialization || null;
        planet._manufacturingDetails = details;
        return details;
    }

    async showRecipeModal(planet) {
        if (!planet) {
            return;
        }

        if (!this.crossAnalytics?.dataCache?.recipes || !this.crossAnalytics.dataCache.recipes.length) {
            await this.crossAnalytics.loadAllData();
        }

        const details = this.getManufacturingDetails(planet);
        const manufacturableRecipes = details.recipes;
        const depthSummary = details.depthSummary;
        const typeTotals = details.typeTotals;
        const recipesByType = details.recipesByType;
        const planetTypeName = details.planetTypeName;

        const modal = document.createElement('div');
        modal.className = 'recipe-modal-overlay';
        modal.innerHTML = `
            <div class="recipe-modal">
                <div class="recipe-modal-header">
                    <div>
                        <h2>${this.escapeHtml(planet.planet)}</h2>
                        <p class="modal-subtitle">${this.escapeHtml(planet.system)} · ${planetTypeName}</p>
                    </div>
                    <button class="modal-close-btn" aria-label="Close">&times;</button>
                </div>
                <div class="recipe-modal-body">
                    <div class="modal-stats">
                        <div class="modal-stat">
                            <span class="stat-label">Total Self-Sufficient Recipes</span>
                            <span class="stat-value">${manufacturableRecipes.length}</span>
                        </div>
                        <div class="modal-stat">
                            <span class="stat-label">Self-Sufficiency</span>
                            <span class="stat-value">${planet.selfSufficiencyScore.toFixed(3)}%</span>
                        </div>
                        <div class="modal-stat">
                            <span class="stat-label">Available Resources</span>
                            <span class="stat-value">${planet.totalResources}</span>
                        </div>
                        <div class="modal-stat">
                            <span class="stat-label">Primary Specialization</span>
                            <span class="stat-value">${details.topSpecialization ? `${this.escapeHtml(details.topSpecialization.type)} (${details.topSpecialization.count})` : 'None'}</span>
                        </div>
                    </div>

                    ${typeTotals.length ? `
                        <div class="specialization-breakdown">
                            <h4>Specialization Mix</h4>
                            <ul>
                                ${typeTotals.slice(0, 6).map(({ type, count }) => `
                                    <li>${this.escapeHtml(type)} <span>${count}</span></li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${depthSummary.length ? `
                        <div class="depth-summary">
                            ${depthSummary.map(({ depth, count }) => `
                                <div class="depth-pill depth-${depth}">
                                    <span class="depth-label">Depth ${depth}</span>
                                    <span class="depth-count">${count}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div class="recipe-categories">
                        ${Array.from(recipesByType.entries()).map(([type, depthMap]) => {
                            const depthEntries = Array.from(depthMap.entries()).sort((a, b) => a[0] - b[0]);
                            const total = depthEntries.reduce((sum, [, list]) => sum + list.length, 0);

                            return `
                                <div class="recipe-category">
                                    <h3>${this.getSpecializationIcon(type)} ${this.escapeHtml(type)} (${total})</h3>
                                    ${depthEntries.map(([depthLevel, recipes]) => `
                                        <div class="recipe-depth-group">
                                            <h4 class="depth-heading">Depth ${depthLevel}</h4>
                                            <div class="recipe-list">
                                                ${recipes.map(recipe => this.renderRecipeCard(recipe)).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            `;
                        }).join('')}
                    </div>

                    ${manufacturableRecipes.length === 0 ? `
                        <div class="empty-state">
                            <p>⚠️ This planet cannot manufacture any recipes with its native resources.</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeModal = () => modal.remove();
        modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        setTimeout(() => {
            modal.querySelectorAll('.recipe-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const recipeName = button.getAttribute('data-recipe-name');
                    const recipeTier = parseInt(button.getAttribute('data-recipe-tier'), 10) || 1;
                    this.openRecipeExplorer(recipeName, recipeTier);
                });
            });
        }, 100);
    }

    renderRecipeCard(recipe) {
        const ingredients = recipe.ingredients || [];
        return `
            <div class="recipe-item" data-depth="${recipe.depth || 1}">
                <div class="recipe-name">
                    <span class="tier-badge tier-${recipe.outputTier}">T${recipe.outputTier}</span>
                    ${this.escapeHtml(recipe.outputName)}
                    <span class="depth-badge depth-${recipe.depth || 1}">D${recipe.depth || 1}</span>
                </div>
                <div class="recipe-details">
                    <span class="recipe-time">⏱️ ${this.formatTime(recipe.constructionTime)}</span>
                    <span class="recipe-ingredients">📦 ${ingredients.length} ingredients</span>
                </div>
                <div class="recipe-ingredients-list">
                    ${ingredients.map(ing => `<span class="ingredient-tag">${this.escapeHtml(ing.name)} ×${ing.quantity}</span>`).join('')}
                </div>
                <div class="recipe-actions">
                    <button class="recipe-btn" data-recipe-name="${this.escapeHtml(recipe.outputName)}" data-recipe-tier="${recipe.outputTier}">
                        🔍 Recipe
                    </button>
                </div>
            </div>
        `;
    }

    openRecipeExplorer(recipeName, tier) {
        if (typeof ConstructionUtils !== 'undefined' && typeof ConstructionUtils.openRecipeExplorer === 'function') {
            ConstructionUtils.openRecipeExplorer(recipeName, tier);
        } else if (typeof window !== 'undefined') {
            const slug = `${recipeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-t${tier}`;
            window.open(`../RecipeExplorer/index.html?recipe=${encodeURIComponent(slug)}`, '_blank');
        }
    }

    getSpecializationIcon(type) {
        switch (type) {
            case 'Infrastructure': return '🏗️';
            case 'Agricultural': return '🌾';
            case 'Processing': return '⚙️';
            case 'Component':
            case 'Ship Component':
                return '🚀';
            case 'General': return '📦';
            default: return '🛠️';
        }
    }

    formatTime(seconds) {
        if (!seconds || seconds <= 0) return '—';
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        return `${(seconds / 3600).toFixed(1)}h`;
    }

    getPlanetTypeName(typeId) {
        if (typeof getPlanetTypeName === 'function') {
            return getPlanetTypeName(typeId);
        }
        return `Type ${typeId}`;
    }

    escapeHtml(value) {
        if (!value) return '';
        return value.replace(/[&<>"]+/g, (match) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[match]));
    }
}

window.ManufacturingAnalytics = ManufacturingAnalytics;
