/**
 * Trade Route Analytics
 * Identifies profitable trade routes based on resource scarcity
 */

class TradeRouteAnalytics {
    constructor() {
        this.crossAnalytics = new CrossExplorerAnalytics();
        this.data = null;
        this.isLoading = false;

        // Pagination and filtering state
        this.profitablePage = 1;
        this.efficiencyPage = 1;
        this.resourcesPage = 1;
        this.pageSize = 50;

        this.profitableFilters = { resource: '', tier: '', system: '', value: '', profit: '' };
        this.efficiencyFilters = { resource: '', tier: '', system: '', efficiency: '' };
        this.resourceFilters = { resource: '', tier: '', locations: '', scarcity: '', value: '' };

        this.filteredProfitable = [];
        this.filteredEfficiency = [];
        this.filteredResources = [];
    }

    async renderTradeRoutes() {
        if (this.isLoading) return;

        const loadingMsg = document.getElementById('tradeLoadingMessage');
        const content = document.getElementById('tradeContent');

        if (loadingMsg) loadingMsg.style.display = 'block';
        if (content) content.innerHTML = '';

        this.isLoading = true;

        try {
            if (!this.data) {
                await this.loadData();
            }

            if (loadingMsg) loadingMsg.style.display = 'none';

            this.renderMostProfitableRoutes();
            this.renderBestProfitPerDistance();
            this.renderResourceAnalysis();
        } catch (error) {
            console.error('[TradeRoute] Error rendering:', error);
            if (loadingMsg) {
                loadingMsg.innerHTML = '<p style="color: #e74c3c;">❌ Error loading trade route analysis</p>';
            }
        } finally {
            this.isLoading = false;
        }
    }

    async loadData() {
        console.log('[TradeRoute] Loading data...');
        await this.crossAnalytics.loadAllData();
        this.data = await this.crossAnalytics.analyzeTradeRoutes();
        console.log('[TradeRoute] Data loaded:', this.data);
    }

    // ===== MOST PROFITABLE ROUTES =====
    renderMostProfitableRoutes() {
        const container = document.getElementById('tradeContent');
        const section = document.createElement('div');
        section.className = 'trade-section';
        section.id = 'profitableRoutesSection';

        this.filteredProfitable = [...this.data.mostProfitableRoutes];
        const totalPages = Math.ceil(this.filteredProfitable.length / this.pageSize);

        section.innerHTML = `
            <h3>💰 Most Profitable Routes</h3>
            <p class="section-description">Trade routes with highest profit margins</p>
            <p class="section-note"><strong>Trade Value:</strong> Base Value × (Scarcity Score / 10) × Avg Richness. <strong>Profit:</strong> (Trade Value × 0.5) - Fuel Cost. Higher scarcity and richness = higher profits.</p>

            <div class="pagination-controls">
                <button id="profitablePrevPage" class="pagination-btn">⟵ Previous</button>
                <span id="profitablePageInfo" class="page-info">Page 1 of ${totalPages}</span>
                <button id="profitableNextPage" class="pagination-btn">Next ⟶</button>
                <span class="filter-info" id="profitableFilterInfo"></span>
            </div>

            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Resource</th>
                            <th>Tier</th>
                            <th>Source System</th>
                            <th>Richness</th>
                            <th>Distance</th>
                            <th>Trade Value</th>
                            <th>Fuel Cost</th>
                            <th>Profit</th>
                        </tr>
                        <tr class="filter-row">
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="profitable" data-column="resource" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="profitable" data-column="tier" placeholder="Tier..."></th>
                            <th><input type="text" class="column-filter" data-table="profitable" data-column="system" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="profitable" data-column="richness" placeholder="Min..."></th>
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="profitable" data-column="value" placeholder="Min..."></th>
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="profitable" data-column="profit" placeholder="Min..."></th>
                        </tr>
                    </thead>
                    <tbody id="profitableTableBody"></tbody>
                </table>
            </div>

            <div class="pagination-controls">
                <button id="profitablePrevPageBottom" class="pagination-btn">⟵ Previous</button>
                <span id="profitablePageInfoBottom" class="page-info">Page 1 of ${totalPages}</span>
                <button id="profitableNextPageBottom" class="pagination-btn">Next ⟶</button>
            </div>
        `;

        container.appendChild(section);
        this.renderProfitableTablePage(1);
        this.setupProfitableEventListeners();
    }

    setupProfitableEventListeners() {
        ['profitablePrevPage', 'profitablePrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeProfitablePage(-1));
        });

        ['profitableNextPage', 'profitableNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeProfitablePage(1));
        });

        document.querySelectorAll('.column-filter[data-table="profitable"]').forEach(input => {
            input.addEventListener('input', (e) => this.handleProfitableFilter(e));
        });
    }

    handleProfitableFilter(event) {
        const column = event.target.getAttribute('data-column');
        this.profitableFilters[column] = event.target.value.toLowerCase().trim();
        this.applyProfitableFilters();
    }

    applyProfitableFilters() {
        this.filteredProfitable = this.data.mostProfitableRoutes.filter(route => {
            if (this.profitableFilters.resource && !route.resource.toLowerCase().includes(this.profitableFilters.resource)) return false;
            if (this.profitableFilters.tier && route.tier.toString() !== this.profitableFilters.tier) return false;
            if (this.profitableFilters.system && !route.sourceSystem.toLowerCase().includes(this.profitableFilters.system)) return false;

            if (this.profitableFilters.richness) {
                const min = parseFloat(this.profitableFilters.richness);
                if (!isNaN(min) && route.sourceRichness < min) return false;
            }

            if (this.profitableFilters.value) {
                const min = parseFloat(this.profitableFilters.value);
                if (!isNaN(min) && route.tradeValue < min) return false;
            }

            if (this.profitableFilters.profit) {
                const min = parseFloat(this.profitableFilters.profit);
                if (!isNaN(min) && route.profitMargin < min) return false;
            }

            return true;
        });

        const filterInfo = document.getElementById('profitableFilterInfo');
        if (filterInfo) {
            filterInfo.textContent = this.filteredProfitable.length === this.data.mostProfitableRoutes.length
                ? '' : `Showing ${this.filteredProfitable.length} of ${this.data.mostProfitableRoutes.length} routes`;
        }

        this.profitablePage = 1;
        this.renderProfitableTablePage(1);
    }

    changeProfitablePage(delta) {
        this.renderProfitableTablePage(this.profitablePage + delta);
    }

    renderProfitableTablePage(page) {
        const totalPages = Math.max(1, Math.ceil(this.filteredProfitable.length / this.pageSize));
        const clampedPage = Math.min(Math.max(page, 1), totalPages);
        this.profitablePage = clampedPage;

        const startIdx = (clampedPage - 1) * this.pageSize;
        const routesToShow = this.filteredProfitable.slice(startIdx, startIdx + this.pageSize);
        const tbody = document.getElementById('profitableTableBody');
        if (!tbody) return;

        tbody.innerHTML = routesToShow.map((route, index) => {
            const rank = startIdx + index + 1;
            return `
                <tr>
                    <td class="rank-cell">${rank}</td>
                    <td>${this.escapeHtml(route.resource)}</td>
                    <td class="tier-cell">T${route.tier}</td>
                    <td>${this.escapeHtml(route.sourceSystem)}</td>
                    <td class="number-cell">${route.sourceRichness.toFixed(1)}</td>
                    <td class="number-cell">${route.estimatedDistance} systems</td>
                    <td class="number-cell">${route.tradeValue.toFixed(0)}</td>
                    <td class="number-cell warning-cell">${route.estimatedFuelCost}</td>
                    <td class="number-cell highlight-cell">${route.profitMargin.toFixed(0)}</td>
                </tr>
            `;
        }).join('');

        ['profitablePageInfo', 'profitablePageInfoBottom'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = `Page ${clampedPage} of ${totalPages}`;
        });

        const disablePrev = clampedPage === 1;
        const disableNext = clampedPage === totalPages;

        ['profitablePrevPage', 'profitablePrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disablePrev;
        });

        ['profitableNextPage', 'profitableNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disableNext;
        });
    }

    // ===== BEST PROFIT PER DISTANCE =====
    renderBestProfitPerDistance() {
        const container = document.getElementById('tradeContent');
        const section = document.createElement('div');
        section.className = 'trade-section';
        section.id = 'efficiencyRoutesSection';

        this.filteredEfficiency = [...this.data.bestProfitPerDistance];
        const totalPages = Math.ceil(this.filteredEfficiency.length / this.pageSize);

        section.innerHTML = `
            <h3>📈 Best Profit per Distance</h3>
            <p class="section-description">Most efficient routes for short-haul trading</p>
            <p class="section-note"><strong>Efficiency:</strong> Profit ÷ Distance (higher = better for short trips). Best for maximizing profit with minimal travel.</p>

            <div class="pagination-controls">
                <button id="efficiencyPrevPage" class="pagination-btn">⟵ Previous</button>
                <span id="efficiencyPageInfo" class="page-info">Page 1 of ${totalPages}</span>
                <button id="efficiencyNextPage" class="pagination-btn">Next ⟶</button>
                <span class="filter-info" id="efficiencyFilterInfo"></span>
            </div>

            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Resource</th>
                            <th>Tier</th>
                            <th>Source System</th>
                            <th>Distance</th>
                            <th>Profit</th>
                            <th>Efficiency</th>
                        </tr>
                        <tr class="filter-row">
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="efficiency" data-column="resource" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="efficiency" data-column="tier" placeholder="Tier..."></th>
                            <th><input type="text" class="column-filter" data-table="efficiency" data-column="system" placeholder="Filter..."></th>
                            <th></th>
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="efficiency" data-column="efficiency" placeholder="Min..."></th>
                        </tr>
                    </thead>
                    <tbody id="efficiencyTableBody"></tbody>
                </table>
            </div>

            <div class="pagination-controls">
                <button id="efficiencyPrevPageBottom" class="pagination-btn">⟵ Previous</button>
                <span id="efficiencyPageInfoBottom" class="page-info">Page 1 of ${totalPages}</span>
                <button id="efficiencyNextPageBottom" class="pagination-btn">Next ⟶</button>
            </div>
        `;

        container.appendChild(section);
        this.renderEfficiencyTablePage(1);
        this.setupEfficiencyEventListeners();
    }

    setupEfficiencyEventListeners() {
        ['efficiencyPrevPage', 'efficiencyPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeEfficiencyPage(-1));
        });

        ['efficiencyNextPage', 'efficiencyNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeEfficiencyPage(1));
        });

        document.querySelectorAll('.column-filter[data-table="efficiency"]').forEach(input => {
            input.addEventListener('input', (e) => this.handleEfficiencyFilter(e));
        });
    }

    handleEfficiencyFilter(event) {
        const column = event.target.getAttribute('data-column');
        this.efficiencyFilters[column] = event.target.value.toLowerCase().trim();
        this.applyEfficiencyFilters();
    }

    applyEfficiencyFilters() {
        this.filteredEfficiency = this.data.bestProfitPerDistance.filter(route => {
            if (this.efficiencyFilters.resource && !route.resource.toLowerCase().includes(this.efficiencyFilters.resource)) return false;
            if (this.efficiencyFilters.tier && route.tier.toString() !== this.efficiencyFilters.tier) return false;
            if (this.efficiencyFilters.system && !route.sourceSystem.toLowerCase().includes(this.efficiencyFilters.system)) return false;

            if (this.efficiencyFilters.efficiency) {
                const min = parseFloat(this.efficiencyFilters.efficiency);
                if (!isNaN(min) && route.profitPerUnit < min) return false;
            }

            return true;
        });

        const filterInfo = document.getElementById('efficiencyFilterInfo');
        if (filterInfo) {
            filterInfo.textContent = this.filteredEfficiency.length === this.data.bestProfitPerDistance.length
                ? '' : `Showing ${this.filteredEfficiency.length} of ${this.data.bestProfitPerDistance.length} routes`;
        }

        this.efficiencyPage = 1;
        this.renderEfficiencyTablePage(1);
    }

    changeEfficiencyPage(delta) {
        this.renderEfficiencyTablePage(this.efficiencyPage + delta);
    }

    renderEfficiencyTablePage(page) {
        const totalPages = Math.max(1, Math.ceil(this.filteredEfficiency.length / this.pageSize));
        const clampedPage = Math.min(Math.max(page, 1), totalPages);
        this.efficiencyPage = clampedPage;

        const startIdx = (clampedPage - 1) * this.pageSize;
        const routesToShow = this.filteredEfficiency.slice(startIdx, startIdx + this.pageSize);
        const tbody = document.getElementById('efficiencyTableBody');
        if (!tbody) return;

        tbody.innerHTML = routesToShow.map((route, index) => {
            const rank = startIdx + index + 1;
            return `
                <tr>
                    <td class="rank-cell">${rank}</td>
                    <td>${this.escapeHtml(route.resource)}</td>
                    <td class="tier-cell">T${route.tier}</td>
                    <td>${this.escapeHtml(route.sourceSystem)}</td>
                    <td class="number-cell">${route.estimatedDistance} systems</td>
                    <td class="number-cell">${route.profitMargin.toFixed(0)}</td>
                    <td class="number-cell highlight-cell">${route.profitPerUnit.toFixed(1)}</td>
                </tr>
            `;
        }).join('');

        ['efficiencyPageInfo', 'efficiencyPageInfoBottom'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = `Page ${clampedPage} of ${totalPages}`;
        });

        const disablePrev = clampedPage === 1;
        const disableNext = clampedPage === totalPages;

        ['efficiencyPrevPage', 'efficiencyPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disablePrev;
        });

        ['efficiencyNextPage', 'efficiencyNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disableNext;
        });
    }

    // ===== RESOURCE ANALYSIS =====
    renderResourceAnalysis() {
        const container = document.getElementById('tradeContent');
        const section = document.createElement('div');
        section.className = 'trade-section';
        section.id = 'resourceAnalysisSection';

        this.filteredResources = [...this.data.resourceAnalysis];
        const totalPages = Math.ceil(this.filteredResources.length / this.pageSize);

        section.innerHTML = `
            <h3>💎 Most Valuable Trade Resources</h3>
            <p class="section-description">Resources with highest trade potential based on scarcity and value</p>
            <p class="section-note"><strong>Scarcity Score:</strong> 100 - Location Count (fewer locations = rarer). <strong>Trade Value:</strong> Base Value × (Scarcity / 10) × Avg Richness. Rare resources in rich deposits = highest value.</p>

            <div class="pagination-controls">
                <button id="resourcesPrevPage" class="pagination-btn">⟵ Previous</button>
                <span id="resourcesPageInfo" class="page-info">Page 1 of ${totalPages}</span>
                <span id="resourcesNextPage" class="pagination-btn">Next ⟶</button>
                <span class="filter-info" id="resourcesFilterInfo"></span>
            </div>

            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Resource</th>
                            <th>Tier</th>
                            <th>Base Value</th>
                            <th>Locations</th>
                            <th>Scarcity Score</th>
                            <th>Avg Richness</th>
                            <th>Trade Value</th>
                        </tr>
                        <tr class="filter-row">
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="resources" data-column="resource" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="resources" data-column="tier" placeholder="Tier..."></th>
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="resources" data-column="locations" placeholder="Max..."></th>
                            <th><input type="text" class="column-filter" data-table="resources" data-column="scarcity" placeholder="Min..."></th>
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="resources" data-column="value" placeholder="Min..."></th>
                        </tr>
                    </thead>
                    <tbody id="resourcesTableBody"></tbody>
                </table>
            </div>

            <div class="pagination-controls">
                <button id="resourcesPrevPageBottom" class="pagination-btn">⟵ Previous</button>
                <span id="resourcesPageInfoBottom" class="page-info">Page 1 of ${totalPages}</span>
                <button id="resourcesNextPageBottom" class="pagination-btn">Next ⟶</button>
            </div>
        `;

        container.appendChild(section);
        this.renderResourcesTablePage(1);
        this.setupResourcesEventListeners();
    }

    setupResourcesEventListeners() {
        ['resourcesPrevPage', 'resourcesPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeResourcesPage(-1));
        });

        ['resourcesNextPage', 'resourcesNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeResourcesPage(1));
        });

        document.querySelectorAll('.column-filter[data-table="resources"]').forEach(input => {
            input.addEventListener('input', (e) => this.handleResourcesFilter(e));
        });
    }

    handleResourcesFilter(event) {
        const column = event.target.getAttribute('data-column');
        this.resourceFilters[column] = event.target.value.toLowerCase().trim();
        this.applyResourcesFilters();
    }

    applyResourcesFilters() {
        this.filteredResources = this.data.resourceAnalysis.filter(resource => {
            if (this.resourceFilters.resource && !resource.resource.toLowerCase().includes(this.resourceFilters.resource)) return false;
            if (this.resourceFilters.tier && resource.tier.toString() !== this.resourceFilters.tier) return false;

            if (this.resourceFilters.locations) {
                const max = parseFloat(this.resourceFilters.locations);
                if (!isNaN(max) && resource.locations > max) return false;
            }

            if (this.resourceFilters.scarcity) {
                const min = parseFloat(this.resourceFilters.scarcity);
                if (!isNaN(min) && resource.scarcityScore < min) return false;
            }

            if (this.resourceFilters.value) {
                const min = parseFloat(this.resourceFilters.value);
                if (!isNaN(min) && resource.tradeValue < min) return false;
            }

            return true;
        });

        const filterInfo = document.getElementById('resourcesFilterInfo');
        if (filterInfo) {
            filterInfo.textContent = this.filteredResources.length === this.data.resourceAnalysis.length
                ? '' : `Showing ${this.filteredResources.length} of ${this.data.resourceAnalysis.length} resources`;
        }

        this.resourcesPage = 1;
        this.renderResourcesTablePage(1);
    }

    changeResourcesPage(delta) {
        this.renderResourcesTablePage(this.resourcesPage + delta);
    }

    renderResourcesTablePage(page) {
        const totalPages = Math.max(1, Math.ceil(this.filteredResources.length / this.pageSize));
        const clampedPage = Math.min(Math.max(page, 1), totalPages);
        this.resourcesPage = clampedPage;

        const startIdx = (clampedPage - 1) * this.pageSize;
        const resourcesToShow = this.filteredResources.slice(startIdx, startIdx + this.pageSize);
        const tbody = document.getElementById('resourcesTableBody');
        if (!tbody) return;

        tbody.innerHTML = resourcesToShow.map((resource, index) => {
            const rank = startIdx + index + 1;
            return `
                <tr>
                    <td class="rank-cell">${rank}</td>
                    <td>${this.escapeHtml(resource.resource)}</td>
                    <td class="tier-cell">T${resource.tier}</td>
                    <td class="number-cell">${resource.baseValue}</td>
                    <td class="number-cell">${resource.locations}</td>
                    <td class="number-cell warning-cell">${resource.scarcityScore.toFixed(0)}</td>
                    <td class="number-cell">${resource.avgRichness.toFixed(2)}</td>
                    <td class="number-cell highlight-cell">${resource.tradeValue.toFixed(0)}</td>
                </tr>
            `;
        }).join('');

        ['resourcesPageInfo', 'resourcesPageInfoBottom'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = `Page ${clampedPage} of ${totalPages}`;
        });

        const disablePrev = clampedPage === 1;
        const disableNext = clampedPage === totalPages;

        ['resourcesPrevPage', 'resourcesPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disablePrev;
        });

        ['resourcesNextPage', 'resourcesNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disableNext;
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Make available globally
window.TradeRouteAnalytics = TradeRouteAnalytics;
