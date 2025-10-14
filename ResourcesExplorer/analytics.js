class ResourceAnalytics extends BaseAnalytics {
    constructor(data) {
        super(data);
        this.resourceAnalytics = null;
        this.valuableResourcesPage = 0;
        this.valuableResourcesPageSize = 50;
        this.valuableResourcesFilters = {
            search: '',
            tier: 'all',
            category: 'all'
        };
    }

    generateAnalytics() {
        const categoryStats = new Map();
        const tierStats = new Map();
        const valueAnalysis = [];
        const stackSizeGroups = new Map();

        // Analyze all resources
        this.data.forEach(resource => {
            const category = resource.category || 'unknown';
            const tier = resource.tier || 0;
            const baseValue = resource.baseValue || 0;
            const stackSize = resource.stackSize || 0;

            // Category statistics
            if (!categoryStats.has(category)) {
                categoryStats.set(category, {
                    count: 0,
                    totalValue: 0,
                    averageValue: 0,
                    resources: []
                });
            }
            const categoryData = categoryStats.get(category);
            categoryData.count++;
            categoryData.totalValue += baseValue;
            categoryData.resources.push(resource);

            // Tier statistics
            if (!tierStats.has(tier)) {
                tierStats.set(tier, {
                    count: 0,
                    totalValue: 0,
                    categories: new Set(),
                    resources: []
                });
            }
            const tierData = tierStats.get(tier);
            tierData.count++;
            tierData.totalValue += baseValue;
            tierData.categories.add(category);
            tierData.resources.push(resource);

            // Value analysis
            valueAnalysis.push({
                name: resource.name,
                baseValue: baseValue,
                category: category,
                tier: tier,
                stackSize: stackSize,
                totalStackValue: baseValue * stackSize
            });

            // Stack size grouping
            const stackGroup = this.getStackSizeGroup(stackSize);
            if (!stackSizeGroups.has(stackGroup)) {
                stackSizeGroups.set(stackGroup, {
                    range: stackGroup,
                    count: 0,
                    resources: [],
                    averageValue: 0,
                    totalValue: 0
                });
            }
            const stackGroupData = stackSizeGroups.get(stackGroup);
            stackGroupData.count++;
            stackGroupData.resources.push(resource);
            stackGroupData.totalValue += baseValue;
        });

        // Calculate averages
        categoryStats.forEach(data => {
            data.averageValue = data.count > 0 ? Math.round(data.totalValue / data.count) : 0;
        });

        tierStats.forEach(data => {
            data.averageValue = data.count > 0 ? Math.round(data.totalValue / data.count) : 0;
        });

        stackSizeGroups.forEach(data => {
            data.averageValue = data.count > 0 ? Math.round(data.totalValue / data.count) : 0;
        });

        // Sort value analysis - keep all resources for table
        const mostValuable = valueAnalysis
            .sort((a, b) => b.baseValue - a.baseValue);

        const bestStackValue = valueAnalysis
            .sort((a, b) => b.totalStackValue - a.totalStackValue)
            .slice(0, 20);

        // Calculate overall statistics
        const totalResources = this.data.length;
        const totalValue = this.data.reduce((sum, resource) => sum + (resource.baseValue || 0), 0);
        const averageValue = totalResources > 0 ? Math.round(totalValue / totalResources) : 0;
        const averageTier = totalResources > 0
            ? (this.data.reduce((sum, resource) => sum + (resource.tier || 0), 0) / totalResources).toFixed(1)
            : 0;

        const mostExpensive = Math.max(...this.data.map(r => r.baseValue || 0));

        this.resourceAnalytics = {
            overview: {
                totalResources,
                totalValue,
                averageValue,
                averageTier,
                mostExpensive,
                uniqueCategories: categoryStats.size,
                uniqueTiers: tierStats.size
            },
            categories: categoryStats,
            tiers: tierStats,
            mostValuable,
            bestStackValue,
            stackSizeGroups
        };

        console.log('📊 Resource analytics generated:', this.resourceAnalytics);
        return this.resourceAnalytics;
    }

    getStackSizeGroup(stackSize) {
        if (stackSize <= 10) return '1-10';
        if (stackSize <= 50) return '11-50';
        if (stackSize <= 100) return '51-100';
        if (stackSize <= 200) return '101-200';
        return '200+';
    }

    renderAnalytics() {
        if (!this.resourceAnalytics) {
            this.generateAnalytics();
        }

        this.renderMostValuableResources();
        this.renderCategoryDistribution();
    }

    renderMostValuableResources() {
        const container = document.getElementById('mostValuableResources');
        if (!container) {
            console.error('❌ Most valuable resources container not found');
            return;
        }

        const analytics = this.resourceAnalytics;

        // Get unique tiers and categories for filters
        const tiers = [...new Set(analytics.mostValuable.map(r => r.tier))].filter(t => t).sort();
        const categories = [...new Set(analytics.mostValuable.map(r => r.category))].sort();

        // Apply filters
        const filteredResources = this.getFilteredValuableResources();
        const totalFiltered = filteredResources.length;
        const startIdx = this.valuableResourcesPage * this.valuableResourcesPageSize;
        const endIdx = Math.min(startIdx + this.valuableResourcesPageSize, totalFiltered);
        const paginatedResources = filteredResources.slice(startIdx, endIdx);

        container.innerHTML = `
            <!-- Filter Controls -->
            <div class="filter-row">
                <input type="text" id="valuableSearchInput" class="column-filter" placeholder="Search resources..." value="${this.valuableResourcesFilters.search}">
                <select id="valuableTierFilter" class="column-filter">
                    <option value="all">All Tiers</option>
                    ${tiers.map(tier => `<option value="${tier}" ${this.valuableResourcesFilters.tier == tier ? 'selected' : ''}>Tier ${tier}</option>`).join('')}
                </select>
                <select id="valuableCategoryFilter" class="column-filter">
                    <option value="all">All Categories</option>
                    ${categories.map(cat => `<option value="${cat}" ${this.valuableResourcesFilters.category == cat ? 'selected' : ''}>${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`).join('')}
                </select>
            </div>

            <p class="section-note">Showing ${startIdx + 1}-${endIdx} of ${totalFiltered} ${totalFiltered !== analytics.mostValuable.length ? `(filtered from ${analytics.mostValuable.length})` : ''}</p>

            ${this.createValuableResourcesTable(paginatedResources)}

            <div class="pagination-controls">
                <button class="pagination-btn" id="valuablePrevBtn" ${this.valuableResourcesPage === 0 ? 'disabled' : ''}>
                    ← Previous
                </button>
                <span class="pagination-info">Page ${this.valuableResourcesPage + 1} of ${Math.ceil(totalFiltered / this.valuableResourcesPageSize)}</span>
                <button class="pagination-btn" id="valuableNextBtn" ${endIdx >= totalFiltered ? 'disabled' : ''}>
                    Next →
                </button>
            </div>
        `;

        // Setup listeners
        this.setupValuableResourcesPagination();
        this.setupValuableResourcesFilters();
    }

    createValuableResourcesTable(resources) {
        return `
            <div class="flow-table-container">
                <table class="flow-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Resource</th>
                            <th>Category</th>
                            <th>Tier</th>
                            <th>Base Value</th>
                            <th>Stack Size</th>
                            <th>Stack Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${resources.map((resource, idx) => {
                            const globalRank = this.valuableResourcesPage * this.valuableResourcesPageSize + idx + 1;
                            const rankEmoji = globalRank <= 3 ? ['🥇', '🥈', '🥉'][globalRank - 1] : `#${globalRank}`;
                            const tierColor = this.getTierColor(resource.tier);

                            return `
                                <tr>
                                    <td>${rankEmoji}</td>
                                    <td class="resource-name-cell"><strong>${this.escapeHtml(resource.name)}</strong></td>
                                    <td>${this.escapeHtml(resource.category.charAt(0).toUpperCase() + resource.category.slice(1))}</td>
                                    <td>
                                        <span class="tier-badge-mini" style="background: ${tierColor}">T${resource.tier || '?'}</span>
                                    </td>
                                    <td>${resource.baseValue.toLocaleString()}</td>
                                    <td>${resource.stackSize}</td>
                                    <td>${resource.totalStackValue.toLocaleString()}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    getFilteredValuableResources() {
        let filtered = [...this.resourceAnalytics.mostValuable];

        // Apply search filter
        if (this.valuableResourcesFilters.search) {
            const searchLower = this.valuableResourcesFilters.search.toLowerCase();
            filtered = filtered.filter(r =>
                r.name.toLowerCase().includes(searchLower)
            );
        }

        // Apply tier filter
        if (this.valuableResourcesFilters.tier !== 'all') {
            filtered = filtered.filter(r =>
                r.tier == this.valuableResourcesFilters.tier
            );
        }

        // Apply category filter
        if (this.valuableResourcesFilters.category !== 'all') {
            filtered = filtered.filter(r =>
                r.category == this.valuableResourcesFilters.category
            );
        }

        return filtered;
    }

    setupValuableResourcesFilters() {
        const searchInput = document.getElementById('valuableSearchInput');
        const tierFilter = document.getElementById('valuableTierFilter');
        const categoryFilter = document.getElementById('valuableCategoryFilter');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.valuableResourcesFilters.search = e.target.value;
                this.valuableResourcesPage = 0;
                this.renderMostValuableResources();
            });
        }

        if (tierFilter) {
            tierFilter.addEventListener('change', (e) => {
                this.valuableResourcesFilters.tier = e.target.value;
                this.valuableResourcesPage = 0;
                this.renderMostValuableResources();
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.valuableResourcesFilters.category = e.target.value;
                this.valuableResourcesPage = 0;
                this.renderMostValuableResources();
            });
        }
    }

    setupValuableResourcesPagination() {
        const prevBtn = document.getElementById('valuablePrevBtn');
        const nextBtn = document.getElementById('valuableNextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.valuableResourcesPage > 0) {
                    this.valuableResourcesPage--;
                    this.renderMostValuableResources();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const filteredResources = this.getFilteredValuableResources();
                const totalPages = Math.ceil(filteredResources.length / this.valuableResourcesPageSize);
                if (this.valuableResourcesPage < totalPages - 1) {
                    this.valuableResourcesPage++;
                    this.renderMostValuableResources();
                }
            });
        }
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

    renderCategoryDistribution() {
        const container = document.getElementById('categoryDistribution');
        if (!container) {
            console.error('❌ Category distribution container not found');
            return;
        }

        container.innerHTML = '';
        const analytics = this.resourceAnalytics;

        // Sort categories by count
        const sortedCategories = Array.from(analytics.categories.entries())
            .sort((a, b) => b[1].count - a[1].count);

        sortedCategories.forEach(([category, data]) => {
            const card = document.createElement('div');
            card.className = 'analysis-item';

            // Get tier distribution for this category
            const tierDistribution = {};
            data.resources.forEach(resource => {
                const tier = resource.tier || 0;
                tierDistribution[tier] = (tierDistribution[tier] || 0) + 1;
            });

            const tierInfo = Object.entries(tierDistribution)
                .sort((a, b) => a[0] - b[0])
                .map(([tier, count]) => `T${tier}: ${count}`)
                .join(', ');

            card.innerHTML = `
                <h4>📦 ${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                <div class="analysis-metric">
                    <span class="label">Total Resources:</span>
                    <span class="value">${data.count}</span>
                </div>
                <div class="analysis-metric">
                    <span class="label">Average Value:</span>
                    <span class="value">${data.averageValue.toLocaleString()}</span>
                </div>
                <div class="analysis-metric">
                    <span class="label">Total Value:</span>
                    <span class="value">${data.totalValue.toLocaleString()}</span>
                </div>
                <div class="analysis-metric">
                    <span class="label">Tier Distribution:</span>
                    <span class="value">${tierInfo}</span>
                </div>
            `;

            container.appendChild(card);
        });
    }

    updateStatElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            if (typeof value === 'number' && value !== Math.floor(value)) {
                element.textContent = value; // Keep decimal for averages
            } else {
                element.textContent = value.toLocaleString();
            }
        } else {
            console.warn(`⚠️ Stat element not found: ${elementId}`);
        }
    }
}