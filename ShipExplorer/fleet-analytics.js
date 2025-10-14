/**
 * Fleet Resource Footprint Analytics
 * Analyzes resource costs and requirements for building and operating ship fleets
 */

class FleetAnalytics {
    constructor() {
        this.crossAnalytics = new CrossExplorerAnalytics();
        this.data = null;
        this.isLoading = false;

        // Pagination and filtering state
        this.constructionPage = 1;
        this.operatingPage = 1;
        this.pageSize = 50;

        this.constructionFilters = { ship: '', config: '', resources: '', components: '' };
        this.operatingFilters = { ship: '', manufacturer: '', crew: '', fuel: '', complexity: '' };

        this.filteredConstruction = [];
        this.filteredOperating = [];
    }

    async renderFleetAnalytics() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            // Load data if not already loaded
            if (!this.data) {
                await this.loadData();
            }

            this.renderConstructionCosts();
            this.renderOperatingCosts();
            this.renderFleetCapabilities();
            this.renderInsights();
        } catch (error) {
            console.error('[FleetAnalytics] Error rendering analytics:', error);
            document.getElementById('fleetContent').innerHTML = `
                <div class="error-message">
                    <p>Failed to load fleet analytics. Please try again.</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
        } finally {
            this.isLoading = false;
        }
    }

    async loadData() {
        console.log('[FleetAnalytics] Loading data...');

        // Load all data sources
        await this.crossAnalytics.loadAllData();

        // Analyze fleet resource footprint
        this.data = await this.crossAnalytics.analyzeFleetResourceFootprint();

        console.log('[FleetAnalytics] Data loaded:', this.data);
    }

    renderConstructionCosts() {
        const container = document.getElementById('fleetContent');
        if (!container) return;

        const section = document.createElement('div');
        section.className = 'fleet-section';
        section.id = 'constructionCostsSection';

        const ships = this.data?.shipConstructionCosts || [];
        this.filteredConstruction = [...ships];
        const totalPages = Math.max(1, Math.ceil(this.filteredConstruction.length / this.pageSize));

        section.innerHTML = `
            <h3>🏗️ Construction Costs</h3>
            <p class="section-description">Most resource-intensive ship configurations to build</p>
            <p class="section-note"><strong>Total Resources:</strong> Sum of all resources needed for this specific configuration's components.</p>

            <div class="pagination-controls">
                <button id="constructionPrevPage" class="pagination-btn">⟵ Previous</button>
                <span id="constructionPageInfo" class="page-info">Page 1 of ${totalPages}</span>
                <button id="constructionNextPage" class="pagination-btn">Next ⟶</button>
                <span class="filter-info" id="constructionFilterInfo"></span>
            </div>

            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ship</th>
                            <th>Configuration</th>
                            <th>Total Resources</th>
                            <th>Components</th>
                            <th>Actions</th>
                        </tr>
                        <tr class="filter-row">
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="construction" data-column="ship" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="construction" data-column="config" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="construction" data-column="resources" placeholder="Min..."></th>
                            <th><input type="text" class="column-filter" data-table="construction" data-column="components" placeholder="Min..."></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="constructionTableBody"></tbody>
                </table>
            </div>

            <div class="pagination-controls">
                <button id="constructionPrevPageBottom" class="pagination-btn">⟵ Previous</button>
                <span id="constructionPageInfoBottom" class="page-info">Page 1 of ${totalPages}</span>
                <button id="constructionNextPageBottom" class="pagination-btn">Next ⟶</button>
            </div>
        `;

        container.appendChild(section);
        this.renderConstructionTablePage(1);
        this.setupConstructionEventListeners();
    }

    setupConstructionEventListeners() {
        ['constructionPrevPage', 'constructionPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeConstructionPage(-1));
        });

        ['constructionNextPage', 'constructionNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeConstructionPage(1));
        });

        document.querySelectorAll('.column-filter[data-table="construction"]').forEach(input => {
            input.addEventListener('input', (e) => this.handleConstructionFilter(e));
        });
    }

    handleConstructionFilter(event) {
        const column = event.target.getAttribute('data-column');
        this.constructionFilters[column] = event.target.value.toLowerCase().trim();
        this.applyConstructionFilters();
    }

    applyConstructionFilters() {
        const ships = this.data?.shipConstructionCosts || [];
        this.filteredConstruction = ships.filter(ship => {
            if (this.constructionFilters.ship && !ship.name.toLowerCase().includes(this.constructionFilters.ship)) return false;
            if (this.constructionFilters.config && !ship.configName.toLowerCase().includes(this.constructionFilters.config)) return false;
            if (this.constructionFilters.resources) {
                const min = parseFloat(this.constructionFilters.resources);
                if (!isNaN(min) && ship.totalResourceCost < min) return false;
            }
            if (this.constructionFilters.components) {
                const min = parseFloat(this.constructionFilters.components);
                if (!isNaN(min) && ship.componentCount < min) return false;
            }
            return true;
        });

        const filterInfo = document.getElementById('constructionFilterInfo');
        if (filterInfo) {
            filterInfo.textContent = this.filteredConstruction.length === ships.length
                ? '' : `Showing ${this.filteredConstruction.length} of ${ships.length} configurations`;
        }

        this.constructionPage = 1;
        this.renderConstructionTablePage(1);
    }

    changeConstructionPage(delta) {
        this.renderConstructionTablePage(this.constructionPage + delta);
    }

    renderConstructionTablePage(page) {
        const totalPages = Math.max(1, Math.ceil(this.filteredConstruction.length / this.pageSize));
        const clampedPage = Math.min(Math.max(page, 1), totalPages);
        this.constructionPage = clampedPage;

        const startIdx = (clampedPage - 1) * this.pageSize;
        const shipsToShow = this.filteredConstruction.slice(startIdx, startIdx + this.pageSize);
        const tbody = document.getElementById('constructionTableBody');
        if (!tbody) return;

        tbody.innerHTML = shipsToShow.map((ship, index) => {
            const rank = startIdx + index + 1;
            return `
                <tr>
                    <td class="rank-cell">${rank}</td>
                    <td>${this.escapeHtml(ship.name)}</td>
                    <td>${this.escapeHtml(ship.configName)}</td>
                    <td class="number-cell">${ship.totalResourceCost.toLocaleString()}</td>
                    <td class="number-cell">${ship.componentCount}</td>
                    <td class="action-cell">
                        <button class="action-btn" onclick="window.fleetAnalytics.showShipResourceDetails('${this.escapeAttribute(ship.id)}', '${this.escapeAttribute(ship.configName)}')">
                            View Breakdown
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        ['constructionPageInfo', 'constructionPageInfoBottom'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = `Page ${clampedPage} of ${totalPages}`;
        });

        const disablePrev = clampedPage === 1;
        const disableNext = clampedPage === totalPages;

        ['constructionPrevPage', 'constructionPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disablePrev;
        });

        ['constructionNextPage', 'constructionNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disableNext;
        });
    }

    renderOperatingCosts() {
        const container = document.getElementById('fleetContent');
        if (!container) return;

        const section = document.createElement('div');
        section.className = 'fleet-section';
        section.id = 'operatingCostsSection';

        const ships = this.data?.shipOperatingCosts || [];
        this.filteredOperating = [...ships];
        const totalPages = Math.max(1, Math.ceil(this.filteredOperating.length / this.pageSize));

        section.innerHTML = `
            <h3>⚙️ Operating Costs</h3>
            <p class="section-description">Ships with highest crew and fuel requirements</p>
            <p class="section-note"><strong>Fuel Efficiency:</strong> Distance per fuel unit (higher = better). <strong>Complexity:</strong> Operational difficulty score based on crew and systems.</p>

            <div class="pagination-controls">
                <button id="operatingPrevPage" class="pagination-btn">⟵ Previous</button>
                <span id="operatingPageInfo" class="page-info">Page 1 of ${totalPages}</span>
                <button id="operatingNextPage" class="pagination-btn">Next ⟶</button>
                <span class="filter-info" id="operatingFilterInfo"></span>
            </div>

            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ship</th>
                            <th>Manufacturer</th>
                            <th>Required Crew</th>
                            <th>Fuel Efficiency</th>
                            <th>Warp Fuel/Dist</th>
                            <th>Complexity</th>
                        </tr>
                        <tr class="filter-row">
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="operating" data-column="ship" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="operating" data-column="manufacturer" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="operating" data-column="crew" placeholder="Min..."></th>
                            <th><input type="text" class="column-filter" data-table="operating" data-column="fuel" placeholder="Min..."></th>
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="operating" data-column="complexity" placeholder="Min..."></th>
                        </tr>
                    </thead>
                    <tbody id="operatingTableBody"></tbody>
                </table>
            </div>

            <div class="pagination-controls">
                <button id="operatingPrevPageBottom" class="pagination-btn">⟵ Previous</button>
                <span id="operatingPageInfoBottom" class="page-info">Page 1 of ${totalPages}</span>
                <button id="operatingNextPageBottom" class="pagination-btn">Next ⟶</button>
            </div>
        `;

        container.appendChild(section);
        this.renderOperatingTablePage(1);
        this.setupOperatingEventListeners();
    }

    setupOperatingEventListeners() {
        ['operatingPrevPage', 'operatingPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeOperatingPage(-1));
        });

        ['operatingNextPage', 'operatingNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeOperatingPage(1));
        });

        document.querySelectorAll('.column-filter[data-table="operating"]').forEach(input => {
            input.addEventListener('input', (e) => this.handleOperatingFilter(e));
        });
    }

    handleOperatingFilter(event) {
        const column = event.target.getAttribute('data-column');
        this.operatingFilters[column] = event.target.value.toLowerCase().trim();
        this.applyOperatingFilters();
    }

    applyOperatingFilters() {
        const ships = this.data?.shipOperatingCosts || [];
        this.filteredOperating = ships.filter(ship => {
            if (this.operatingFilters.ship && !ship.name.toLowerCase().includes(this.operatingFilters.ship)) return false;
            if (this.operatingFilters.manufacturer && !ship.manufacturer.toLowerCase().includes(this.operatingFilters.manufacturer)) return false;
            if (this.operatingFilters.crew) {
                const min = parseFloat(this.operatingFilters.crew);
                if (!isNaN(min) && (ship.crewRequired || 0) < min) return false;
            }
            if (this.operatingFilters.fuel) {
                const min = parseFloat(this.operatingFilters.fuel);
                if (!isNaN(min) && (ship.fuelEfficiency || 0) < min) return false;
            }
            if (this.operatingFilters.complexity) {
                const min = parseFloat(this.operatingFilters.complexity);
                if (!isNaN(min) && (ship.operationalComplexity || 0) < min) return false;
            }
            return true;
        });

        const filterInfo = document.getElementById('operatingFilterInfo');
        if (filterInfo) {
            filterInfo.textContent = this.filteredOperating.length === ships.length
                ? '' : `Showing ${this.filteredOperating.length} of ${ships.length} ships`;
        }

        this.operatingPage = 1;
        this.renderOperatingTablePage(1);
    }

    changeOperatingPage(delta) {
        this.renderOperatingTablePage(this.operatingPage + delta);
    }

    renderOperatingTablePage(page) {
        const totalPages = Math.max(1, Math.ceil(this.filteredOperating.length / this.pageSize));
        const clampedPage = Math.min(Math.max(page, 1), totalPages);
        this.operatingPage = clampedPage;

        const startIdx = (clampedPage - 1) * this.pageSize;
        const shipsToShow = this.filteredOperating.slice(startIdx, startIdx + this.pageSize);
        const tbody = document.getElementById('operatingTableBody');
        if (!tbody) return;

        tbody.innerHTML = shipsToShow.map((ship, index) => {
            const rank = startIdx + index + 1;
            const crewCost = ship.crewRequired || 0;
            const fuelEfficiency = ship.fuelEfficiency || 0;
            const operationalComplexity = ship.operationalComplexity || 0;

            return `
                <tr>
                    <td class="rank-cell">${rank}</td>
                    <td>${this.escapeHtml(ship.name)}</td>
                    <td>${this.escapeHtml(ship.manufacturer)}</td>
                    <td class="number-cell">${crewCost.toLocaleString()}</td>
                    <td class="number-cell ${fuelEfficiency > 0 ? 'positive' : ''}">${fuelEfficiency.toFixed(2)}</td>
                    <td class="number-cell">${ship.warpFuelPerDistance?.toFixed(4) || 'N/A'}</td>
                    <td class="number-cell">${operationalComplexity.toFixed(1)}</td>
                </tr>
            `;
        }).join('');

        ['operatingPageInfo', 'operatingPageInfoBottom'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = `Page ${clampedPage} of ${totalPages}`;
        });

        const disablePrev = clampedPage === 1;
        const disableNext = clampedPage === totalPages;

        ['operatingPrevPage', 'operatingPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disablePrev;
        });

        ['operatingNextPage', 'operatingNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disableNext;
        });
    }

    renderFleetCapabilities() {
        const container = document.getElementById('fleetContent');
        if (!container) return;

        const section = document.createElement('div');
        section.className = 'fleet-section';
        section.innerHTML = '<h3>🏆 Fleet Capabilities</h3><p class="section-description">Top performers by category</p><div id="fleetCapabilitiesContent"></div>';
        container.appendChild(section);

        const content = document.getElementById('fleetCapabilitiesContent');
        if (!content) return;

        const capabilities = this.data?.fleetCapabilityRankings || {};

        if (Object.keys(capabilities).length === 0) {
            content.innerHTML = '<p class="empty-message">No capability data available.</p>';
            return;
        }

        let html = '<div class="capability-sections">';

        // Cargo Capacity Leaders
        if (capabilities.cargoLeaders?.length > 0) {
            html += this.renderCapabilitySection('Cargo Capacity Leaders', capabilities.cargoLeaders, '📦', 'cargoCapacity');
        }

        // Combat Power Leaders
        if (capabilities.combatLeaders?.length > 0) {
            html += this.renderCapabilitySection('Combat Power Leaders', capabilities.combatLeaders, '⚔️', 'combatPower');
        }

        // Speed Leaders
        if (capabilities.speedLeaders?.length > 0) {
            html += this.renderCapabilitySection('Speed Leaders', capabilities.speedLeaders, '⚡', 'warpSpeed');
        }

        // Fuel Efficiency Leaders
        if (capabilities.fuelEfficiencyLeaders?.length > 0) {
            html += this.renderCapabilitySection('Fuel Efficiency Leaders', capabilities.fuelEfficiencyLeaders, '⛽', 'fuelEfficiency');
        }

        html += '</div>';
        content.innerHTML = html;
    }

    renderCapabilitySection(title, ships, emoji, metricKey) {
        let html = `
            <div class="capability-section">
                <h4>${emoji} ${this.escapeHtml(title)}</h4>
                <div class="capability-list">
        `;

        ships.slice(0, 10).forEach((ship, index) => {
            const value = ship[metricKey] !== undefined ? ship[metricKey] : 0;
            const formattedValue = typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value;

            html += `
                <div class="capability-item">
                    <div class="capability-rank">#${index + 1}</div>
                    <div class="capability-info">
                        <div class="capability-name">${this.escapeHtml(ship.name)}</div>
                        <div class="capability-meta">${this.escapeHtml(ship.manufacturer)} • ${this.escapeHtml(ship.sizeTier || 'Unknown')}</div>
                    </div>
                    <div class="capability-value">${formattedValue}</div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    renderInsights() {
        const container = document.getElementById('fleetContent');
        if (!container) return;

        const section = document.createElement('div');
        section.className = 'fleet-section';
        section.innerHTML = '<h3>💡 Fleet Insights</h3><p class="section-description">Key findings and notable ships</p><div id="fleetInsightsContent"></div>';
        container.appendChild(section);

        const content = document.getElementById('fleetInsightsContent');
        if (!content) return;

        const insights = this.data?.insights || {};

        let html = '<div class="insights-grid">';

        if (insights.mostExpensiveShip) {
            html += `
                <div class="insight-card">
                    <div class="insight-icon">💰</div>
                    <div class="insight-title">Most Expensive to Build</div>
                    <div class="insight-value">${this.escapeHtml(insights.mostExpensiveShip.name)}</div>
                    <div class="insight-detail">${insights.mostExpensiveShip.totalResourceCost.toLocaleString()} total resources</div>
                </div>
            `;
        }

        if (insights.highestCrewRequirement) {
            html += `
                <div class="insight-card">
                    <div class="insight-icon">👥</div>
                    <div class="insight-title">Highest Crew Requirement</div>
                    <div class="insight-value">${this.escapeHtml(insights.highestCrewRequirement.name)}</div>
                    <div class="insight-detail">${insights.highestCrewRequirement.crewRequired.toLocaleString()} crew members</div>
                </div>
            `;
        }

        if (insights.bestFuelEfficiency) {
            html += `
                <div class="insight-card">
                    <div class="insight-icon">⛽</div>
                    <div class="insight-title">Best Fuel Efficiency</div>
                    <div class="insight-value">${this.escapeHtml(insights.bestFuelEfficiency.name)}</div>
                    <div class="insight-detail">${insights.bestFuelEfficiency.fuelEfficiency.toFixed(2)} efficiency score</div>
                </div>
            `;
        }

        if (insights.fastestWarpSpeed) {
            html += `
                <div class="insight-card">
                    <div class="insight-icon">🚀</div>
                    <div class="insight-title">Fastest Warp Speed</div>
                    <div class="insight-value">${this.escapeHtml(insights.fastestWarpSpeed.name)}</div>
                    <div class="insight-detail">${insights.fastestWarpSpeed.warpSpeed.toLocaleString()} warp speed</div>
                </div>
            `;
        }

        if (insights.largestCargo) {
            html += `
                <div class="insight-card">
                    <div class="insight-icon">📦</div>
                    <div class="insight-title">Largest Cargo Capacity</div>
                    <div class="insight-value">${this.escapeHtml(insights.largestCargo.name)}</div>
                    <div class="insight-detail">${insights.largestCargo.cargoCapacity.toLocaleString()} units</div>
                </div>
            `;
        }

        if (insights.highestCombatPower) {
            html += `
                <div class="insight-card">
                    <div class="insight-icon">⚔️</div>
                    <div class="insight-title">Highest Combat Power</div>
                    <div class="insight-value">${this.escapeHtml(insights.highestCombatPower.name)}</div>
                    <div class="insight-detail">${insights.highestCombatPower.combatPower.toFixed(0)} combat score</div>
                </div>
            `;
        }

        html += '</div>';
        content.innerHTML = html;
    }

    async showShipResourceDetails(shipId, configName) {
        const shipEntry = this.data?.shipConstructionCosts?.find(s => s.id === shipId && s.configName === configName);
        if (!shipEntry) {
            alert('Ship configuration data not found.');
            return;
        }

        // Load ship data to get full ship and config details
        let fullShip = null;
        let fullConfig = null;
        let components = [];

        try {
            // Get the full ship data from crossAnalytics
            const ships = this.crossAnalytics?.dataCache?.ships || [];
            fullShip = ships.find(s => s.id === shipId);

            if (fullShip && fullShip.configurations) {
                fullConfig = fullShip.configurations.find(c => c.name === configName);

                if (fullConfig && fullConfig.components) {
                    // Extract all components from the configuration
                    Object.entries(fullConfig.components).forEach(([category, categoryData]) => {
                        if (categoryData && typeof categoryData === 'object') {
                            Object.entries(categoryData).forEach(([slotName, slot]) => {
                                if (slot && Array.isArray(slot.items)) {
                                    slot.items.forEach(componentId => {
                                        if (componentId !== null && componentId !== undefined) {
                                            components.push({
                                                id: componentId,
                                                category: category,
                                                slot: slotName
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        } catch (error) {
            console.error('[FleetAnalytics] Error loading component details:', error);
        }

        const overlay = document.createElement('div');
        overlay.className = 'fleet-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'fleet-modal';

        const resourceRows = shipEntry.resourceBreakdown
            .sort((a, b) => b.amount - a.amount)
            .map(r => `
                <tr>
                    <td>
                        <span class="resource-name">${this.escapeHtml(r.name)}</span>
                        ${r.tier ? `<span class="resource-tier tier-${r.tier}">T${r.tier}</span>` : ''}
                    </td>
                    <td class="text-right">${r.amount.toLocaleString()}</td>
                </tr>
            `).join('');

        // Build components list
        let componentsSection = '';
        if (components.length > 0) {
            const componentRows = components.map(comp => `
                <tr>
                    <td>${this.escapeHtml(comp.category)}</td>
                    <td>${this.escapeHtml(comp.slot)}</td>
                    <td>Component #${comp.id}</td>
                    <td>
                        <button class="recipe-btn" data-component-id="${comp.id}" title="View recipe in Recipe Explorer">
                            📋 Recipe
                        </button>
                    </td>
                </tr>
            `).join('');

            componentsSection = `
                <div class="fleet-modal-section">
                    <h3>Components (${components.length})</h3>
                    <div class="fleet-modal-table-wrapper">
                        <table class="fleet-modal-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Slot</th>
                                    <th>Component</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${componentRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        modal.innerHTML = `
            <div class="fleet-modal-header">
                <h2>Resource Breakdown: ${this.escapeHtml(shipEntry.name)} - ${this.escapeHtml(shipEntry.configName)}</h2>
                <button class="fleet-modal-close">&times;</button>
            </div>
            <div class="fleet-modal-body">
                <div class="fleet-modal-summary">
                    <div class="summary-item">
                        <span class="summary-label">Configuration:</span>
                        <span class="summary-value">${this.escapeHtml(shipEntry.configName)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Size Tier:</span>
                        <span class="summary-value">${this.escapeHtml(shipEntry.sizeTier || 'Unknown')}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Components:</span>
                        <span class="summary-value">${shipEntry.componentCount}</span>
                    </div>
                </div>
                ${componentsSection}
                <div class="fleet-modal-section">
                    <h3>Estimated Resources</h3>
                    <div class="fleet-modal-table-wrapper">
                        <table class="fleet-modal-table">
                            <thead>
                                <tr>
                                    <th>Resource</th>
                                    <th class="text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${resourceRows}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="fleet-modal-footer">
                    <div class="fleet-modal-total">
                        <span class="total-label">Total Resources:</span>
                        <span class="total-value">${shipEntry.totalResourceCost.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const closeModal = () => {
            document.body.removeChild(overlay);
        };

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        modal.querySelector('.fleet-modal-close').addEventListener('click', closeModal);

        // Add event listeners for recipe buttons
        modal.querySelectorAll('.recipe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const componentId = e.target.getAttribute('data-component-id');
                this.openRecipeForComponent(componentId);
            });
        });
    }

    openRecipeForComponent(componentId) {
        if (!componentId) return;

        // Try to get component details from ship explorer's component data
        let componentDetails = null;

        try {
            // Access ShipExplorer's componentsById if available
            if (window.shipExplorer && window.shipExplorer.componentsById) {
                componentDetails = window.shipExplorer.componentsById[componentId.toString()];
            }
        } catch (error) {
            console.error('[FleetAnalytics] Error accessing component data:', error);
        }

        if (!componentDetails) {
            alert('Component details not available. Please ensure component data is loaded.');
            return;
        }

        // Extract component information
        const componentType = componentDetails.componentType || componentDetails.properties?.['Ship Component'] || componentDetails.name;
        const componentClass = componentDetails.className || componentDetails.properties?.Class;
        const componentTier = componentDetails.tierName || componentDetails.properties?.Tier;

        if (!componentType) {
            alert('Cannot determine component type for recipe lookup.');
            return;
        }

        // Create a slug for the recipe URL (lowercase, hyphenated)
        const slug = componentType.toLowerCase().replace(/\s+/g, '-');
        const tierSuffix = componentTier ? `-${componentTier.toLowerCase()}` : '';
        const recipeSlug = `${slug}${tierSuffix}`;

        // Open Recipe Explorer in new tab
        window.open(`../RecipeExplorer/index.html?recipe=${encodeURIComponent(recipeSlug)}`, '_blank');
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
window.FleetAnalytics = FleetAnalytics;
