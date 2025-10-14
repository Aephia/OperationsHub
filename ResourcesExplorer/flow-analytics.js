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
            tier: 'all'
        };
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

        const section = document.createElement('div');
        section.className = 'analytics-section';
        section.innerHTML = `
            <h3>🎯 Critical Resources</h3>
            <p class="section-note">Resources with highest demand across recipes and buildings (criticality score = recipe usage × 10 + extraction × 5 + consumption × 3 + chain depth × 2)</p>
            ${this.createResourceTable(this.flowData.criticalResources, 'critical')}
        `;
        container.appendChild(section);
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
            // Get unique tiers for filter
            const tiers = [...new Set(this.flowData.bottlenecks.map(r => r.resourceData?.tier).filter(t => t))].sort();

            // Apply filters
            const filteredBottlenecks = this.getFilteredBottlenecks();
            const totalFiltered = filteredBottlenecks.length;
            const startIdx = this.bottleneckPage * this.bottleneckPageSize;
            const endIdx = Math.min(startIdx + this.bottleneckPageSize, totalFiltered);
            const paginatedBottlenecks = filteredBottlenecks.slice(startIdx, endIdx);

            section.innerHTML = `
                <h3>⚠️ Supply Bottlenecks</h3>
                <p class="section-note">Resources where demand significantly exceeds supply (demand > supply × 2)</p>

                <!-- Filter Controls -->
                <div class="filter-row">
                    <input type="text" id="bottleneckSearchInput" class="column-filter" placeholder="Search resources..." value="${this.bottleneckFilters.search}">
                    <select id="bottleneckTierFilter" class="column-filter">
                        <option value="all">All Tiers</option>
                        ${tiers.map(tier => `<option value="${tier}" ${this.bottleneckFilters.tier == tier ? 'selected' : ''}>Tier ${tier}</option>`).join('')}
                    </select>
                </div>

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

        return filtered;
    }

    setupBottleneckFilters() {
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

        // Get unique tiers for filter
        const tiers = [...new Set(this.flowData.bottlenecks.map(r => r.resourceData?.tier).filter(t => t))].sort();

        // Apply filters
        const filteredBottlenecks = this.getFilteredBottlenecks();
        const totalFiltered = filteredBottlenecks.length;
        const startIdx = this.bottleneckPage * this.bottleneckPageSize;
        const endIdx = Math.min(startIdx + this.bottleneckPageSize, totalFiltered);
        const paginatedBottlenecks = filteredBottlenecks.slice(startIdx, endIdx);

        section.innerHTML = `
            <h3>⚠️ Supply Bottlenecks</h3>
            <p class="section-note">Resources where demand significantly exceeds supply (demand > supply × 2)</p>

            <!-- Filter Controls -->
            <div class="filter-row">
                <input type="text" id="bottleneckSearchInput" class="column-filter" placeholder="Search resources..." value="${this.bottleneckFilters.search}">
                <select id="bottleneckTierFilter" class="column-filter">
                    <option value="all">All Tiers</option>
                    ${tiers.map(tier => `<option value="${tier}" ${this.bottleneckFilters.tier == tier ? 'selected' : ''}>Tier ${tier}</option>`).join('')}
                </select>
            </div>

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
                                <th>Chain Depth</th>
                                <th>Recipe Usage</th>
                                <th>Demand Score</th>
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
                                <th>Chain Depth</th>
                                <th>Extracted By</th>
                                <th>Consumed By</th>
                                <th>Recipe Usage</th>
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

        return `
            <tr>
                <td class="resource-name-cell">
                    <strong>${this.escapeHtml(resource.name)}</strong>
                </td>
                <td>
                    <span class="tier-badge-mini" style="background: ${tierColor}">T${resource.resourceData?.tier || '?'}</span>
                </td>
                <td>${resource.criticalityScore.toFixed(0)}</td>
                <td>${resource.supplyChainDepth}</td>
                <td>${resource.extractedBy.length}</td>
                <td>${resource.consumedBy.length}</td>
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
                <td>${resource.supplyChainDepth}</td>
                <td>
                    ${recipeCount > 0 ? `
                        <span class="recipe-usage-link" data-resource="${this.escapeHtml(resource.name)}" data-recipes='${JSON.stringify(resource.usedInRecipes)}'>
                            ${recipeCount} recipe${recipeCount !== 1 ? 's' : ''}
                        </span>
                    ` : '—'}
                </td>
                <td class="demand-score-cell">${resource.demandScore}</td>
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
