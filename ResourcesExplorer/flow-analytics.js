/**
 * Resource Flow Analytics
 * Analyzes supply chains and resource dependencies across the economy
 */

class ResourceFlowAnalytics {
    constructor() {
        this.crossAnalytics = new CrossExplorerAnalytics();
        this.flowData = null;
        this.bottleneckPage = 0;
        this.bottleneckPageSize = 100;
        this.bottleneckFilters = {
            search: '',
            tier: 'all',
            recipeUsage: '',
            demandScore: ''
        };
        this.criticalPage = 0;
        this.criticalPageSize = 100;
        this.criticalFilters = {
            resource: '',
            tier: '',
            criticality: '',
            extractedBy: '',
            consumedBy: ''
        };
        this.filteredCriticalResources = [];
    }

    async renderFlowAnalytics() {
        const loadingMessage = document.getElementById('flowLoadingMessage');
        const content = document.getElementById('flowAnalysisContent');

        if (loadingMessage) loadingMessage.style.display = 'block';
        if (content) content.innerHTML = '';

        try {
            // Load and analyze data
            this.flowData = await this.crossAnalytics.analyzeResourceFlow();

            if (loadingMessage) loadingMessage.style.display = 'none';

            // Update stats
            this.updateFlowStats();

            // Render sections
            this.renderCriticalResources();
            this.renderBottlenecks();

            // Setup event listeners for recipe usage links
            this.setupRecipeUsageListeners();

        } catch (error) {
            console.error('Error rendering flow analytics:', error);
            if (loadingMessage) {
                loadingMessage.innerHTML = '<p style="color: #e74c3c;">❌ Error loading flow analysis. Please try again.</p>';
            }
        }
    }

    setupRecipeUsageListeners() {
        // Add click handlers for recipe usage links
        document.querySelectorAll('.recipe-usage-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const resourceName = e.target.getAttribute('data-resource');
                const recipesJson = e.target.getAttribute('data-recipes');
                try {
                    const recipes = JSON.parse(recipesJson);
                    this.showRecipeUsageModal(resourceName, recipes);
                } catch (error) {
                    console.error('Error parsing recipe data:', error);
                }
            });
        });

        // Add click handlers for building usage links
        document.querySelectorAll('.building-usage-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const resourceName = e.target.getAttribute('data-resource');
                const buildingsJson = e.target.getAttribute('data-buildings');
                const type = e.target.getAttribute('data-type');
                try {
                    const buildings = JSON.parse(buildingsJson);
                    this.showBuildingUsageModal(resourceName, buildings, type);
                } catch (error) {
                    console.error('Error parsing building data:', error);
                }
            });
        });
    }

    setupColumnFilters() {
        const filters = document.querySelectorAll('#criticalResourcesSection .column-filter');
        filters.forEach(input => {
            input.addEventListener('input', (e) => {
                const column = e.target.getAttribute('data-column');
                const value = e.target.value.trim();
                this.criticalFilters[column] = value;
                this.criticalPage = 0; // Reset to first page
                this.updateCriticalResourcesTable();
            });
        });
    }

    setupCriticalPagination() {
        const prevBtn = document.getElementById('criticalPrevBtn');
        const nextBtn = document.getElementById('criticalNextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.criticalPage > 0) {
                    this.criticalPage--;
                    this.updateCriticalResourcesTable();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredCriticalResources.length / this.criticalPageSize);
                if (this.criticalPage < totalPages - 1) {
                    this.criticalPage++;
                    this.updateCriticalResourcesTable();
                }
            });
        }
    }

    applyColumnFilters() {
        this.filteredCriticalResources = this.flowData.criticalResources.filter(resource => {
            // Resource name filter
            if (this.criticalFilters.resource) {
                const searchLower = this.criticalFilters.resource.toLowerCase();
                if (!resource.name.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }

            // Tier filter
            if (this.criticalFilters.tier) {
                const tier = parseInt(this.criticalFilters.tier);
                if (!isNaN(tier) && resource.resourceData?.tier !== tier) {
                    return false;
                }
            }

            // Criticality filter (min value)
            if (this.criticalFilters.criticality) {
                const min = parseFloat(this.criticalFilters.criticality);
                if (!isNaN(min) && resource.criticalityScore < min) {
                    return false;
                }
            }

            // Extracted By filter (min value)
            if (this.criticalFilters.extractedBy) {
                const min = parseInt(this.criticalFilters.extractedBy);
                if (!isNaN(min) && resource.extractedBy.length < min) {
                    return false;
                }
            }

            // Consumed By filter (min value)
            if (this.criticalFilters.consumedBy) {
                const min = parseInt(this.criticalFilters.consumedBy);
                if (!isNaN(min) && resource.consumedBy.length < min) {
                    return false;
                }
            }

            return true;
        });
    }

    updateCriticalResourcesTable() {
        const section = document.getElementById('criticalResourcesSection');
        if (!section) return;

        // Apply filters
        this.applyColumnFilters();

        const totalFiltered = this.filteredCriticalResources.length;
        const startIdx = this.criticalPage * this.criticalPageSize;
        const endIdx = Math.min(startIdx + this.criticalPageSize, totalFiltered);
        const paginatedResources = this.filteredCriticalResources.slice(startIdx, endIdx);

        section.innerHTML = `
            <h3>🎯 Critical Resources</h3>
            <p class="section-note">Resources with highest demand across recipes and buildings (criticality score = recipe usage × 10 + extraction × 5 + consumption × 3 + chain depth × 2)</p>
            <p class="section-note">Showing ${startIdx + 1}-${endIdx} of ${totalFiltered} ${totalFiltered !== this.flowData.criticalResources.length ? `(filtered from ${this.flowData.criticalResources.length})` : ''}</p>
            ${this.createResourceTable(paginatedResources, 'critical')}
            <div class="pagination-controls">
                <button class="pagination-btn" id="criticalPrevBtn" ${this.criticalPage === 0 ? 'disabled' : ''}>
                    ← Previous
                </button>
                <span class="pagination-info">Page ${this.criticalPage + 1} of ${Math.ceil(totalFiltered / this.criticalPageSize)}</span>
                <button class="pagination-btn" id="criticalNextBtn" ${endIdx >= totalFiltered ? 'disabled' : ''}>
                    Next →
                </button>
            </div>
        `;

        // Re-setup listeners
        this.setupCriticalPagination();
        this.setupColumnFilters();
        this.setupRecipeUsageListeners();
    }

    updateFlowStats() {
        const data = this.flowData;
        if (!data) return;

        const totalResources = data.resourceUsage.length;
        const criticalResources = data.criticalResources.length;
        const bottlenecks = data.bottlenecks.length;
        const maxDepth = Math.max(...data.resourceUsage.map(r => r.supplyChainDepth));

        document.getElementById('flowTotalResources').textContent = totalResources;
        document.getElementById('flowCriticalResources').textContent = criticalResources;
        document.getElementById('flowBottlenecks').textContent = bottlenecks;
        document.getElementById('flowMaxDepth').textContent = maxDepth;
    }

    renderCriticalResources() {
        const container = document.getElementById('flowAnalysisContent');
        if (!container || !this.flowData) return;

        // Initialize filtered resources if not done
        if (this.filteredCriticalResources.length === 0) {
            this.filteredCriticalResources = [...this.flowData.criticalResources];
        }

        // Apply filters
        this.applyColumnFilters();

        const totalFiltered = this.filteredCriticalResources.length;
        const startIdx = this.criticalPage * this.criticalPageSize;
        const endIdx = Math.min(startIdx + this.criticalPageSize, totalFiltered);
        const paginatedResources = this.filteredCriticalResources.slice(startIdx, endIdx);

        const section = document.createElement('div');
        section.className = 'analytics-section';
        section.id = 'criticalResourcesSection';
        section.innerHTML = `
            <h3>🎯 Critical Resources</h3>
            <p class="section-note">Resources with highest demand across recipes and buildings (criticality score = recipe usage × 10 + extraction × 5 + consumption × 3 + chain depth × 2)</p>
            <p class="section-note">Showing ${startIdx + 1}-${endIdx} of ${totalFiltered} ${totalFiltered !== this.flowData.criticalResources.length ? `(filtered from ${this.flowData.criticalResources.length})` : ''}</p>
            ${this.createResourceTable(paginatedResources, 'critical')}
            <div class="pagination-controls">
                <button class="pagination-btn" id="criticalPrevBtn" ${this.criticalPage === 0 ? 'disabled' : ''}>
                    ← Previous
                </button>
                <span class="pagination-info">Page ${this.criticalPage + 1} of ${Math.ceil(totalFiltered / this.criticalPageSize)}</span>
                <button class="pagination-btn" id="criticalNextBtn" ${endIdx >= totalFiltered ? 'disabled' : ''}>
                    Next →
                </button>
            </div>
        `;
        container.appendChild(section);

        // Setup pagination
        this.setupCriticalPagination();

        // Setup column filters
        this.setupColumnFilters();
    }

    renderBottlenecks() {
        const container = document.getElementById('flowAnalysisContent');
        if (!container || !this.flowData) return;

        const section = document.createElement('div');
        section.className = 'analytics-section';
        section.id = 'bottleneckSection';

        if (this.flowData.bottlenecks.length === 0) {
            section.innerHTML = `
                <h3>⚠️ Supply Bottlenecks</h3>
                <p class="section-note">Resources where demand significantly exceeds supply (demand > supply × 2)</p>
                <p class="empty-state">No significant bottlenecks detected</p>
            `;
        } else {
            // Apply filters
            const filteredBottlenecks = this.getFilteredBottlenecks();
            const totalFiltered = filteredBottlenecks.length;
            const startIdx = this.bottleneckPage * this.bottleneckPageSize;
            const endIdx = Math.min(startIdx + this.bottleneckPageSize, totalFiltered);
            const paginatedBottlenecks = filteredBottlenecks.slice(startIdx, endIdx);

            section.innerHTML = `
                <h3>⚠️ Supply Bottlenecks</h3>
                <p class="section-note">Resources where demand significantly exceeds supply (demand > supply × 2). Demand Score = Recipe Usage + Consumed By buildings.</p>
                <p class="section-note">Showing ${startIdx + 1}-${endIdx} of ${totalFiltered} ${totalFiltered !== this.flowData.bottlenecks.length ? `(filtered from ${this.flowData.bottlenecks.length})` : ''}</p>

                ${this.createResourceTable(paginatedBottlenecks, 'bottleneck')}

                <div class="pagination-controls">
                    <button class="pagination-btn" id="bottleneckPrevBtn" ${this.bottleneckPage === 0 ? 'disabled' : ''}>
                        ← Previous
                    </button>
                    <span class="pagination-info">Page ${this.bottleneckPage + 1} of ${Math.ceil(totalFiltered / this.bottleneckPageSize)}</span>
                    <button class="pagination-btn" id="bottleneckNextBtn" ${endIdx >= totalFiltered ? 'disabled' : ''}>
                        Next →
                    </button>
                </div>
            `;
        }

        container.appendChild(section);

        // Setup listeners
        this.setupBottleneckPagination();
        this.setupBottleneckFilters();
    }

    getFilteredBottlenecks() {
        let filtered = [...this.flowData.bottlenecks];

        // Apply search filter
        if (this.bottleneckFilters.search) {
            const searchLower = this.bottleneckFilters.search.toLowerCase();
            filtered = filtered.filter(r =>
                r.name.toLowerCase().includes(searchLower)
            );
        }

        // Apply tier filter
        if (this.bottleneckFilters.tier !== 'all') {
            filtered = filtered.filter(r =>
                r.resourceData?.tier == this.bottleneckFilters.tier
            );
        }

        // Apply recipe usage filter (min value)
        if (this.bottleneckFilters.recipeUsage) {
            const min = parseInt(this.bottleneckFilters.recipeUsage);
            if (!isNaN(min)) {
                filtered = filtered.filter(r =>
                    r.usedInRecipes.length >= min
                );
            }
        }

        // Apply demand score filter (min value)
        if (this.bottleneckFilters.demandScore) {
            const min = parseInt(this.bottleneckFilters.demandScore);
            if (!isNaN(min)) {
                filtered = filtered.filter(r =>
                    r.demandScore >= min
                );
            }
        }

        return filtered;
    }

    setupBottleneckFilters() {
        // Handle old-style filters (if they exist)
        const searchInput = document.getElementById('bottleneckSearchInput');
        const tierFilter = document.getElementById('bottleneckTierFilter');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.bottleneckFilters.search = e.target.value;
                this.bottleneckPage = 0; // Reset to first page
                this.updateBottleneckTable();
            });
        }

        if (tierFilter) {
            tierFilter.addEventListener('change', (e) => {
                this.bottleneckFilters.tier = e.target.value;
                this.bottleneckPage = 0; // Reset to first page
                this.updateBottleneckTable();
            });
        }

        // Handle new column filters in the bottleneck section
        const section = document.getElementById('bottleneckSection');
        if (section) {
            const filters = section.querySelectorAll('.column-filter');
            filters.forEach(input => {
                input.addEventListener('input', (e) => {
                    const column = e.target.getAttribute('data-column');
                    const value = e.target.value.trim();

                    if (column === 'resource') {
                        this.bottleneckFilters.search = value;
                    } else if (column === 'tier') {
                        this.bottleneckFilters.tier = value || 'all';
                    } else if (column === 'recipeUsage') {
                        this.bottleneckFilters.recipeUsage = value;
                    } else if (column === 'demandScore') {
                        this.bottleneckFilters.demandScore = value;
                    }

                    this.bottleneckPage = 0; // Reset to first page
                    this.updateBottleneckTable();
                });
            });
        }
    }

    setupBottleneckPagination() {
        const prevBtn = document.getElementById('bottleneckPrevBtn');
        const nextBtn = document.getElementById('bottleneckNextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.bottleneckPage > 0) {
                    this.bottleneckPage--;
                    this.updateBottleneckTable();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.flowData.bottlenecks.length / this.bottleneckPageSize);
                if (this.bottleneckPage < totalPages - 1) {
                    this.bottleneckPage++;
                    this.updateBottleneckTable();
                }
            });
        }
    }

    updateBottleneckTable() {
        const section = document.getElementById('bottleneckSection');
        if (!section) return;

        // Apply filters
        const filteredBottlenecks = this.getFilteredBottlenecks();
        const totalFiltered = filteredBottlenecks.length;
        const startIdx = this.bottleneckPage * this.bottleneckPageSize;
        const endIdx = Math.min(startIdx + this.bottleneckPageSize, totalFiltered);
        const paginatedBottlenecks = filteredBottlenecks.slice(startIdx, endIdx);

        section.innerHTML = `
            <h3>⚠️ Supply Bottlenecks</h3>
            <p class="section-note">Resources where demand significantly exceeds supply (demand > supply × 2). Demand Score = Recipe Usage + Consumed By buildings.</p>
            <p class="section-note">Showing ${startIdx + 1}-${endIdx} of ${totalFiltered} ${totalFiltered !== this.flowData.bottlenecks.length ? `(filtered from ${this.flowData.bottlenecks.length})` : ''}</p>

            ${this.createResourceTable(paginatedBottlenecks, 'bottleneck')}

            <div class="pagination-controls">
                <button class="pagination-btn" id="bottleneckPrevBtn" ${this.bottleneckPage === 0 ? 'disabled' : ''}>
                    ← Previous
                </button>
                <span class="pagination-info">Page ${this.bottleneckPage + 1} of ${Math.ceil(totalFiltered / this.bottleneckPageSize)}</span>
                <button class="pagination-btn" id="bottleneckNextBtn" ${endIdx >= totalFiltered ? 'disabled' : ''}>
                    Next →
                </button>
            </div>
        `;

        // Re-setup listeners after update
        this.setupBottleneckPagination();
        this.setupBottleneckFilters();
        this.setupRecipeUsageListeners();
    }

    createResourceTable(resources, type) {
        if (type === 'bottleneck') {
            // Simplified bottleneck table - only show relevant columns
            return `
                <div class="flow-table-container">
                    <table class="flow-table">
                        <thead>
                            <tr>
                                <th>Resource</th>
                                <th>Tier</th>
                                <th>Recipe Usage</th>
                                <th title="Demand Score = Recipe Usage + Consumed By (higher = more critical)">Demand Score</th>
                            </tr>
                            <tr class="filter-row">
                                <th><input type="text" class="column-filter" data-column="resource" placeholder="Filter..." value="${this.bottleneckFilters.search}"></th>
                                <th><input type="text" class="column-filter" data-column="tier" placeholder="Tier..." value="${this.bottleneckFilters.tier === 'all' ? '' : this.bottleneckFilters.tier}"></th>
                                <th><input type="text" class="column-filter" data-column="recipeUsage" placeholder="Min..." value="${this.bottleneckFilters.recipeUsage || ''}"></th>
                                <th><input type="text" class="column-filter" data-column="demandScore" placeholder="Min..." value="${this.bottleneckFilters.demandScore || ''}"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${resources.map(resource => this.createBottleneckTableRow(resource)).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            // Full table for critical resources
            return `
                <div class="flow-table-container">
                    <table class="flow-table">
                        <thead>
                            <tr>
                                <th>Resource</th>
                                <th>Tier</th>
                                <th>Criticality</th>
                                <th>Extracted By</th>
                                <th>Consumed By</th>
                                <th>Recipe Usage</th>
                            </tr>
                            <tr class="filter-row">
                                <th><input type="text" class="column-filter" data-column="resource" placeholder="Filter..." value="${this.criticalFilters.resource}"></th>
                                <th><input type="text" class="column-filter" data-column="tier" placeholder="Tier..." value="${this.criticalFilters.tier}"></th>
                                <th><input type="text" class="column-filter" data-column="criticality" placeholder="Min..." value="${this.criticalFilters.criticality}"></th>
                                <th><input type="text" class="column-filter" data-column="extractedBy" placeholder="Min..." value="${this.criticalFilters.extractedBy}"></th>
                                <th><input type="text" class="column-filter" data-column="consumedBy" placeholder="Min..." value="${this.criticalFilters.consumedBy}"></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${resources.map(resource => this.createResourceTableRow(resource)).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }

    createResourceTableRow(resource) {
        const tierColor = this.getTierColor(resource.resourceData?.tier || 1);
        const recipeCount = resource.usedInRecipes.length;
        const extractedByCount = resource.extractedBy.length;
        const consumedByCount = resource.consumedBy.length;

        return `
            <tr>
                <td class="resource-name-cell">
                    <strong>${this.escapeHtml(resource.name)}</strong>
                </td>
                <td>
                    <span class="tier-badge-mini" style="background: ${tierColor}">T${resource.resourceData?.tier || '?'}</span>
                </td>
                <td>${resource.criticalityScore.toFixed(0)}</td>
                <td>
                    ${extractedByCount > 0 ? `
                        <span class="building-usage-link" data-resource="${this.escapeHtml(resource.name)}" data-buildings='${JSON.stringify(resource.extractedBy)}' data-type="extraction">
                            ${extractedByCount} building${extractedByCount !== 1 ? 's' : ''}
                        </span>
                    ` : '—'}
                </td>
                <td>
                    ${consumedByCount > 0 ? `
                        <span class="building-usage-link" data-resource="${this.escapeHtml(resource.name)}" data-buildings='${JSON.stringify(resource.consumedBy)}' data-type="consumption">
                            ${consumedByCount} building${consumedByCount !== 1 ? 's' : ''}
                        </span>
                    ` : '—'}
                </td>
                <td>
                    ${recipeCount > 0 ? `
                        <span class="recipe-usage-link" data-resource="${this.escapeHtml(resource.name)}" data-recipes='${JSON.stringify(resource.usedInRecipes)}'>
                            ${recipeCount} recipe${recipeCount !== 1 ? 's' : ''}
                        </span>
                    ` : '—'}
                </td>
            </tr>
        `;
    }

    createBottleneckTableRow(resource) {
        const tierColor = this.getTierColor(resource.resourceData?.tier || 1);
        const recipeCount = resource.usedInRecipes.length;

        return `
            <tr>
                <td class="resource-name-cell">
                    <strong>${this.escapeHtml(resource.name)}</strong>
                </td>
                <td>
                    <span class="tier-badge-mini" style="background: ${tierColor}">T${resource.resourceData?.tier || '?'}</span>
                </td>
                <td>
                    ${recipeCount > 0 ? `
                        <span class="recipe-usage-link" data-resource="${this.escapeHtml(resource.name)}" data-recipes='${JSON.stringify(resource.usedInRecipes)}'>
                            ${recipeCount} recipe${recipeCount !== 1 ? 's' : ''}
                        </span>
                    ` : '—'}
                </td>
                <td class="demand-score-cell" title="Recipe Usage (${recipeCount}) + Consumed By (${resource.consumedBy?.length || 0}) = ${resource.demandScore}">${resource.demandScore}</td>
            </tr>
        `;
    }

    showRecipeUsageModal(resourceName, recipes) {
        // Remove existing modal if any
        const existingModal = document.getElementById('recipeUsageModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'recipeUsageModal';
        modal.className = 'recipe-usage-modal-overlay';
        modal.innerHTML = `
            <div class="recipe-usage-modal">
                <div class="recipe-usage-modal-header">
                    <h3>Recipe Usage: ${this.escapeHtml(resourceName)}</h3>
                    <button class="close-modal-btn" onclick="document.getElementById('recipeUsageModal').remove()">✕</button>
                </div>
                <div class="recipe-usage-modal-body">
                    <p class="recipe-count-info">This resource is used in ${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}:</p>
                    <div class="recipe-usage-list">
                        ${recipes.map(recipe => `
                            <div class="recipe-usage-item">
                                <div class="recipe-usage-info">
                                    <span class="recipe-usage-name">${this.escapeHtml(recipe.recipe)}</span>
                                    <span class="tier-badge-mini" style="background: ${this.getTierColor(recipe.outputTier)}">T${recipe.outputTier}</span>
                                </div>
                                <button class="view-recipe-btn" onclick="window.flowAnalytics.openRecipeInExplorer('${this.escapeAttribute(recipe.recipeId)}')">
                                    View Recipe →
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showBuildingUsageModal(resourceName, buildings, type) {
        // Remove existing modal if any
        const existingModal = document.getElementById('buildingUsageModal');
        if (existingModal) {
            existingModal.remove();
        }

        const typeLabel = type === 'extraction' ? 'Extracted By' : 'Consumed By';
        const typeVerb = type === 'extraction' ? 'extracts' : 'consumes';

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'buildingUsageModal';
        modal.className = 'recipe-usage-modal-overlay';
        modal.innerHTML = `
            <div class="recipe-usage-modal">
                <div class="recipe-usage-modal-header">
                    <h3>${typeLabel}: ${this.escapeHtml(resourceName)}</h3>
                    <button class="close-modal-btn" onclick="document.getElementById('buildingUsageModal').remove()">✕</button>
                </div>
                <div class="recipe-usage-modal-body">
                    <p class="recipe-count-info">${buildings.length} building${buildings.length !== 1 ? 's' : ''} ${typeVerb} this resource:</p>
                    <div class="recipe-usage-list">
                        ${buildings.map(building => `
                            <div class="recipe-usage-item">
                                <div class="recipe-usage-info">
                                    <span class="recipe-usage-name">${this.escapeHtml(building.building)}</span>
                                    <span class="tier-badge-mini" style="background: ${this.getTierColor(building.tier)}">T${building.tier}</span>
                                </div>
                                <div class="building-rate">
                                    Rate: ${building.rate.toFixed(4)}/s
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    openRecipeInExplorer(recipeId) {
        // Close the modal
        const modal = document.getElementById('recipeUsageModal');
        if (modal) modal.remove();

        // Navigate to Recipe Explorer with the recipe ID
        window.location.href = `../RecipeExplorer/index.html?recipe=${encodeURIComponent(recipeId)}`;
    }

    escapeAttribute(text) {
        if (!text) return '';
        return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    getTierColor(tier) {
        const colors = {
            1: '#7f8c8d',
            2: '#95a5a6',
            3: '#2ecc71',
            4: '#3498db',
            5: '#9b59b6'
        };
        return colors[tier] || '#7f8c8d';
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Make available globally
window.ResourceFlowAnalytics = ResourceFlowAnalytics;
