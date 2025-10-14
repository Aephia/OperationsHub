/**
 * Component Sourcing Strategy Analytics
 * Analyzes where ship components can be manufactured and sourcing difficulty
 */

class ComponentSourcingAnalytics {
    constructor() {
        this.crossAnalytics = new CrossExplorerAnalytics();
        this.data = null;
        this.isLoading = false;

        // Pagination and filtering state
        this.easiestPage = 1;
        this.hardestPage = 1;
        this.allComponentsPage = 1;
        this.pageSize = 50;

        this.easiestFilters = { component: '', tier: '', locations: '', buildTime: '' };
        this.hardestFilters = { component: '', tier: '', locations: '', buildTime: '' };
        this.allComponentsFilters = { component: '', tier: '', locations: '', difficulty: '' };

        this.filteredEasiest = [];
        this.filteredHardest = [];
        this.filteredAllComponents = [];
    }

    async renderComponentSourcing() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            // Load data if not already loaded
            if (!this.data) {
                await this.loadData();
            }

            this.renderEasiestToSource();
            this.renderHardestToSource();
            this.renderAllComponents();
        } catch (error) {
            console.error('[ComponentSourcing] Error rendering analytics:', error);
            document.getElementById('sourcingContent').innerHTML = `
                <div class="error-message">
                    <p>Failed to load sourcing analytics. Please try again.</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
        } finally {
            this.isLoading = false;
        }
    }

    async loadData() {
        console.log('[ComponentSourcing] Loading data...');

        // Load all data sources
        await this.crossAnalytics.loadAllData();

        // Analyze component sourcing strategies
        this.data = await this.crossAnalytics.analyzeComponentSourcing();

        console.log('[ComponentSourcing] Data loaded:', this.data);
    }

    renderEasiestToSource() {
        const container = document.getElementById('sourcingContent');
        if (!container) return;

        const section = document.createElement('div');
        section.className = 'sourcing-section';
        section.id = 'easiestToSourceSection';

        const components = this.data?.easiestToSource || [];
        this.filteredEasiest = [...components];
        const totalPages = Math.max(1, Math.ceil(this.filteredEasiest.length / this.pageSize));

        section.innerHTML = `
            <h3>✅ Easiest to Source</h3>
            <p class="section-description">Components with many viable manufacturing locations</p>
            <p class="section-note"><strong>Viable Locations:</strong> Number of planets that can manufacture this component with available resources. <strong>Best Match:</strong> Highest resource self-sufficiency percentage.</p>

            <div class="pagination-controls">
                <button id="easiestPrevPage" class="pagination-btn">⟵ Previous</button>
                <span id="easiestPageInfo" class="page-info">Page 1 of ${totalPages}</span>
                <button id="easiestNextPage" class="pagination-btn">Next ⟶</button>
                <span class="filter-info" id="easiestFilterInfo"></span>
            </div>

            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Component</th>
                            <th>Tier</th>
                            <th>Viable Locations</th>
                            <th>Best Match %</th>
                            <th>Build Time</th>
                            <th>Best Planet</th>
                            <th>System</th>
                        </tr>
                        <tr class="filter-row">
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="easiest" data-column="component" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="easiest" data-column="tier" placeholder="Tier..."></th>
                            <th><input type="text" class="column-filter" data-table="easiest" data-column="locations" placeholder="Min..."></th>
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="easiest" data-column="buildTime" placeholder="Min hrs..."></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="easiestTableBody"></tbody>
                </table>
            </div>

            <div class="pagination-controls">
                <button id="easiestPrevPageBottom" class="pagination-btn">⟵ Previous</button>
                <span id="easiestPageInfoBottom" class="page-info">Page 1 of ${totalPages}</span>
                <button id="easiestNextPageBottom" class="pagination-btn">Next ⟶</button>
            </div>
        `;

        container.appendChild(section);
        this.renderEasiestTablePage(1);
        this.setupEasiestEventListeners();
    }

    setupEasiestEventListeners() {
        ['easiestPrevPage', 'easiestPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeEasiestPage(-1));
        });

        ['easiestNextPage', 'easiestNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeEasiestPage(1));
        });

        document.querySelectorAll('.column-filter[data-table="easiest"]').forEach(input => {
            input.addEventListener('input', (e) => this.handleEasiestFilter(e));
        });
    }

    handleEasiestFilter(event) {
        const column = event.target.getAttribute('data-column');
        this.easiestFilters[column] = event.target.value.toLowerCase().trim();
        this.applyEasiestFilters();
    }

    applyEasiestFilters() {
        const components = this.data?.easiestToSource || [];
        this.filteredEasiest = components.filter(comp => {
            if (this.easiestFilters.component && !comp.component.toLowerCase().includes(this.easiestFilters.component)) return false;
            if (this.easiestFilters.tier) {
                const tier = parseInt(this.easiestFilters.tier);
                if (!isNaN(tier) && comp.tier !== tier) return false;
            }
            if (this.easiestFilters.locations) {
                const min = parseFloat(this.easiestFilters.locations);
                if (!isNaN(min) && comp.totalViableLocations < min) return false;
            }
            if (this.easiestFilters.buildTime) {
                const minHours = parseFloat(this.easiestFilters.buildTime);
                if (!isNaN(minHours) && (comp.constructionTime / 3600) < minHours) return false;
            }
            return true;
        });

        const filterInfo = document.getElementById('easiestFilterInfo');
        if (filterInfo) {
            filterInfo.textContent = this.filteredEasiest.length === components.length
                ? '' : `Showing ${this.filteredEasiest.length} of ${components.length} components`;
        }

        this.easiestPage = 1;
        this.renderEasiestTablePage(1);
    }

    changeEasiestPage(delta) {
        this.renderEasiestTablePage(this.easiestPage + delta);
    }

    renderEasiestTablePage(page) {
        const totalPages = Math.max(1, Math.ceil(this.filteredEasiest.length / this.pageSize));
        const clampedPage = Math.min(Math.max(page, 1), totalPages);
        this.easiestPage = clampedPage;

        const startIdx = (clampedPage - 1) * this.pageSize;
        const componentsToShow = this.filteredEasiest.slice(startIdx, startIdx + this.pageSize);
        const tbody = document.getElementById('easiestTableBody');
        if (!tbody) return;

        tbody.innerHTML = componentsToShow.map((comp, index) => {
            const rank = startIdx + index + 1;
            const bestLocation = comp.bestLocation;
            const tierClass = comp.tier ? `tier-${comp.tier}` : '';

            return `
                <tr>
                    <td class="rank-cell">${rank}</td>
                    <td>${this.escapeHtml(comp.component)}</td>
                    <td class="number-cell">${comp.tier ? `<span class="tier-badge ${tierClass}">T${comp.tier}</span>` : 'N/A'}</td>
                    <td class="number-cell highlight-cell">${comp.totalViableLocations}</td>
                    <td class="number-cell positive">${bestLocation ? bestLocation.completeness.toFixed(1) : 'N/A'}%</td>
                    <td class="number-cell">${this.formatTime(comp.constructionTime)}</td>
                    <td>${bestLocation ? this.escapeHtml(bestLocation.planet) : 'N/A'}</td>
                    <td>${bestLocation ? this.escapeHtml(bestLocation.system) : 'N/A'}</td>
                </tr>
            `;
        }).join('');

        ['easiestPageInfo', 'easiestPageInfoBottom'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = `Page ${clampedPage} of ${totalPages}`;
        });

        const disablePrev = clampedPage === 1;
        const disableNext = clampedPage === totalPages;

        ['easiestPrevPage', 'easiestPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disablePrev;
        });

        ['easiestNextPage', 'easiestNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disableNext;
        });
    }

    renderHardestToSource() {
        const container = document.getElementById('sourcingContent');
        if (!container) return;

        const section = document.createElement('div');
        section.className = 'sourcing-section';
        section.id = 'hardestToSourceSection';

        const components = this.data?.hardestToSource || [];
        this.filteredHardest = [...components];
        const totalPages = Math.max(1, Math.ceil(this.filteredHardest.length / this.pageSize));

        section.innerHTML = `
            <h3>⚠️ Hardest to Source</h3>
            <p class="section-description">Components with limited manufacturing locations</p>
            <p class="section-note"><strong>Warning:</strong> Components with 0 viable locations require resource imports. Lower viable locations mean more supply chain complexity.</p>

            <div class="pagination-controls">
                <button id="hardestPrevPage" class="pagination-btn">⟵ Previous</button>
                <span id="hardestPageInfo" class="page-info">Page 1 of ${totalPages}</span>
                <button id="hardestNextPage" class="pagination-btn">Next ⟶</button>
                <span class="filter-info" id="hardestFilterInfo"></span>
            </div>

            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Component</th>
                            <th>Tier</th>
                            <th>Viable Locations</th>
                            <th>Best Match %</th>
                            <th>Build Time</th>
                            <th>Best Planet</th>
                            <th>System</th>
                        </tr>
                        <tr class="filter-row">
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="hardest" data-column="component" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="hardest" data-column="tier" placeholder="Tier..."></th>
                            <th><input type="text" class="column-filter" data-table="hardest" data-column="locations" placeholder="Max..."></th>
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="hardest" data-column="buildTime" placeholder="Min hrs..."></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="hardestTableBody"></tbody>
                </table>
            </div>

            <div class="pagination-controls">
                <button id="hardestPrevPageBottom" class="pagination-btn">⟵ Previous</button>
                <span id="hardestPageInfoBottom" class="page-info">Page 1 of ${totalPages}</span>
                <button id="hardestNextPageBottom" class="pagination-btn">Next ⟶</button>
            </div>
        `;

        container.appendChild(section);
        this.renderHardestTablePage(1);
        this.setupHardestEventListeners();
    }

    setupHardestEventListeners() {
        ['hardestPrevPage', 'hardestPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeHardestPage(-1));
        });

        ['hardestNextPage', 'hardestNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeHardestPage(1));
        });

        document.querySelectorAll('.column-filter[data-table="hardest"]').forEach(input => {
            input.addEventListener('input', (e) => this.handleHardestFilter(e));
        });
    }

    handleHardestFilter(event) {
        const column = event.target.getAttribute('data-column');
        this.hardestFilters[column] = event.target.value.toLowerCase().trim();
        this.applyHardestFilters();
    }

    applyHardestFilters() {
        const components = this.data?.hardestToSource || [];
        this.filteredHardest = components.filter(comp => {
            if (this.hardestFilters.component && !comp.component.toLowerCase().includes(this.hardestFilters.component)) return false;
            if (this.hardestFilters.tier) {
                const tier = parseInt(this.hardestFilters.tier);
                if (!isNaN(tier) && comp.tier !== tier) return false;
            }
            if (this.hardestFilters.locations) {
                const max = parseFloat(this.hardestFilters.locations);
                if (!isNaN(max) && comp.totalViableLocations > max) return false;
            }
            if (this.hardestFilters.buildTime) {
                const minHours = parseFloat(this.hardestFilters.buildTime);
                if (!isNaN(minHours) && (comp.constructionTime / 3600) < minHours) return false;
            }
            return true;
        });

        const filterInfo = document.getElementById('hardestFilterInfo');
        if (filterInfo) {
            filterInfo.textContent = this.filteredHardest.length === components.length
                ? '' : `Showing ${this.filteredHardest.length} of ${components.length} components`;
        }

        this.hardestPage = 1;
        this.renderHardestTablePage(1);
    }

    changeHardestPage(delta) {
        this.renderHardestTablePage(this.hardestPage + delta);
    }

    renderHardestTablePage(page) {
        const totalPages = Math.max(1, Math.ceil(this.filteredHardest.length / this.pageSize));
        const clampedPage = Math.min(Math.max(page, 1), totalPages);
        this.hardestPage = clampedPage;

        const startIdx = (clampedPage - 1) * this.pageSize;
        const componentsToShow = this.filteredHardest.slice(startIdx, startIdx + this.pageSize);
        const tbody = document.getElementById('hardestTableBody');
        if (!tbody) return;

        tbody.innerHTML = componentsToShow.map((comp, index) => {
            const rank = startIdx + index + 1;
            const bestLocation = comp.bestLocation;
            const tierClass = comp.tier ? `tier-${comp.tier}` : '';
            const locationClass = comp.totalViableLocations === 0 ? 'danger-cell' : 'warning-cell';

            return `
                <tr>
                    <td class="rank-cell">${rank}</td>
                    <td>${this.escapeHtml(comp.component)}</td>
                    <td class="number-cell">${comp.tier ? `<span class="tier-badge ${tierClass}">T${comp.tier}</span>` : 'N/A'}</td>
                    <td class="number-cell ${locationClass}">${comp.totalViableLocations}</td>
                    <td class="number-cell">${bestLocation ? bestLocation.completeness.toFixed(1) : 'N/A'}%</td>
                    <td class="number-cell">${this.formatTime(comp.constructionTime)}</td>
                    <td>${bestLocation ? this.escapeHtml(bestLocation.planet) : '<span class="danger-text">No viable location</span>'}</td>
                    <td>${bestLocation ? this.escapeHtml(bestLocation.system) : 'N/A'}</td>
                </tr>
            `;
        }).join('');

        ['hardestPageInfo', 'hardestPageInfoBottom'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = `Page ${clampedPage} of ${totalPages}`;
        });

        const disablePrev = clampedPage === 1;
        const disableNext = clampedPage === totalPages;

        ['hardestPrevPage', 'hardestPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disablePrev;
        });

        ['hardestNextPage', 'hardestNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disableNext;
        });
    }

    renderAllComponents() {
        const container = document.getElementById('sourcingContent');
        if (!container) return;

        const section = document.createElement('div');
        section.className = 'sourcing-section';
        section.id = 'allComponentsSection';

        const components = this.data?.componentSourcing || [];
        // Sort by tier then by viability
        const sorted = [...components].sort((a, b) => {
            if (a.tier !== b.tier) return (b.tier || 0) - (a.tier || 0);
            return b.totalViableLocations - a.totalViableLocations;
        });

        this.filteredAllComponents = sorted;
        const totalPages = Math.max(1, Math.ceil(this.filteredAllComponents.length / this.pageSize));

        section.innerHTML = `
            <h3>📋 All Components</h3>
            <p class="section-description">Complete component sourcing overview sorted by tier and viability</p>
            <p class="section-note"><strong>Difficulty:</strong> Easy (>10 locations), Medium (6-10), Hard (1-5), Impossible (0). Use filters to find components by specific criteria.</p>

            <div class="pagination-controls">
                <button id="allComponentsPrevPage" class="pagination-btn">⟵ Previous</button>
                <span id="allComponentsPageInfo" class="page-info">Page 1 of ${totalPages}</span>
                <button id="allComponentsNextPage" class="pagination-btn">Next ⟶</button>
                <span class="filter-info" id="allComponentsFilterInfo"></span>
            </div>

            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Component</th>
                            <th>Tier</th>
                            <th>Difficulty</th>
                            <th>Viable Locations</th>
                            <th>Best Match %</th>
                            <th>Build Time</th>
                        </tr>
                        <tr class="filter-row">
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="allComponents" data-column="component" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="allComponents" data-column="tier" placeholder="Tier..."></th>
                            <th><input type="text" class="column-filter" data-table="allComponents" data-column="difficulty" placeholder="Easy/Med..."></th>
                            <th><input type="text" class="column-filter" data-table="allComponents" data-column="locations" placeholder="Min..."></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="allComponentsTableBody"></tbody>
                </table>
            </div>

            <div class="pagination-controls">
                <button id="allComponentsPrevPageBottom" class="pagination-btn">⟵ Previous</button>
                <span id="allComponentsPageInfoBottom" class="page-info">Page 1 of ${totalPages}</span>
                <button id="allComponentsNextPageBottom" class="pagination-btn">Next ⟶</button>
            </div>
        `;

        container.appendChild(section);
        this.renderAllComponentsTablePage(1);
        this.setupAllComponentsEventListeners();
    }

    setupAllComponentsEventListeners() {
        ['allComponentsPrevPage', 'allComponentsPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeAllComponentsPage(-1));
        });

        ['allComponentsNextPage', 'allComponentsNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeAllComponentsPage(1));
        });

        document.querySelectorAll('.column-filter[data-table="allComponents"]').forEach(input => {
            input.addEventListener('input', (e) => this.handleAllComponentsFilter(e));
        });
    }

    handleAllComponentsFilter(event) {
        const column = event.target.getAttribute('data-column');
        this.allComponentsFilters[column] = event.target.value.toLowerCase().trim();
        this.applyAllComponentsFilters();
    }

    applyAllComponentsFilters() {
        const components = this.data?.componentSourcing || [];
        const sorted = [...components].sort((a, b) => {
            if (a.tier !== b.tier) return (b.tier || 0) - (a.tier || 0);
            return b.totalViableLocations - a.totalViableLocations;
        });

        this.filteredAllComponents = sorted.filter(comp => {
            if (this.allComponentsFilters.component && !comp.component.toLowerCase().includes(this.allComponentsFilters.component)) return false;
            if (this.allComponentsFilters.tier) {
                const tier = parseInt(this.allComponentsFilters.tier);
                if (!isNaN(tier) && comp.tier !== tier) return false;
            }
            if (this.allComponentsFilters.difficulty) {
                const difficulty = this.getDifficultyLabel(this.getDifficulty(comp.totalViableLocations)).toLowerCase();
                if (!difficulty.includes(this.allComponentsFilters.difficulty)) return false;
            }
            if (this.allComponentsFilters.locations) {
                const min = parseFloat(this.allComponentsFilters.locations);
                if (!isNaN(min) && comp.totalViableLocations < min) return false;
            }
            return true;
        });

        const filterInfo = document.getElementById('allComponentsFilterInfo');
        if (filterInfo) {
            filterInfo.textContent = this.filteredAllComponents.length === sorted.length
                ? '' : `Showing ${this.filteredAllComponents.length} of ${sorted.length} components`;
        }

        this.allComponentsPage = 1;
        this.renderAllComponentsTablePage(1);
    }

    changeAllComponentsPage(delta) {
        this.renderAllComponentsTablePage(this.allComponentsPage + delta);
    }

    renderAllComponentsTablePage(page) {
        const totalPages = Math.max(1, Math.ceil(this.filteredAllComponents.length / this.pageSize));
        const clampedPage = Math.min(Math.max(page, 1), totalPages);
        this.allComponentsPage = clampedPage;

        const startIdx = (clampedPage - 1) * this.pageSize;
        const componentsToShow = this.filteredAllComponents.slice(startIdx, startIdx + this.pageSize);
        const tbody = document.getElementById('allComponentsTableBody');
        if (!tbody) return;

        tbody.innerHTML = componentsToShow.map((comp, index) => {
            const rank = startIdx + index + 1;
            const tierClass = comp.tier ? `tier-${comp.tier}` : '';
            const difficulty = this.getDifficulty(comp.totalViableLocations);
            const difficultyLabel = this.getDifficultyLabel(difficulty);

            return `
                <tr>
                    <td class="rank-cell">${rank}</td>
                    <td>${this.escapeHtml(comp.component)}</td>
                    <td class="number-cell">${comp.tier ? `<span class="tier-badge ${tierClass}">T${comp.tier}</span>` : 'N/A'}</td>
                    <td><span class="difficulty-badge ${difficulty}">${difficultyLabel}</span></td>
                    <td class="number-cell">${comp.totalViableLocations}</td>
                    <td class="number-cell">${comp.bestLocation ? comp.bestLocation.completeness.toFixed(1) : 'N/A'}%</td>
                    <td class="number-cell">${this.formatTime(comp.constructionTime)}</td>
                </tr>
            `;
        }).join('');

        ['allComponentsPageInfo', 'allComponentsPageInfoBottom'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = `Page ${clampedPage} of ${totalPages}`;
        });

        const disablePrev = clampedPage === 1;
        const disableNext = clampedPage === totalPages;

        ['allComponentsPrevPage', 'allComponentsPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disablePrev;
        });

        ['allComponentsNextPage', 'allComponentsNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disableNext;
        });
    }

    getDifficulty(totalViableLocations) {
        if (totalViableLocations > 10) return 'easy';
        if (totalViableLocations > 5) return 'medium';
        if (totalViableLocations > 0) return 'hard';
        return 'impossible';
    }

    getDifficultyLabel(difficulty) {
        const labels = {
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard',
            impossible: 'Impossible'
        };
        return labels[difficulty] || difficulty;
    }

    formatTime(seconds) {
        if (!seconds || seconds === 0) return 'N/A';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;
            return `${days}d ${remainingHours}h`;
        }

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }

        return `${minutes}m`;
    }

    escapeHtml(text) {
        if (text === null || text === undefined) return '';
        const div = document.createElement('div');
        div.textContent = text.toString();
        return div.innerHTML;
    }

    escapeAttribute(value) {
        if (value === null || value === undefined) return '';
        return value.toString().replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
}

// Make available globally
window.ComponentSourcingAnalytics = ComponentSourcingAnalytics;
