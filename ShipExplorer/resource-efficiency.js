/**
 * Resource Efficiency Analytics
 * Analyzes which ships provide best value for construction cost
 */

class ResourceEfficiencyAnalytics {
    constructor() {
        this.crossAnalytics = new CrossExplorerAnalytics();
        this.data = null;
        this.isLoading = false;

        // Pagination and filtering state
        this.cargoPage = 1;
        this.combatPage = 1;
        this.speedPage = 1;
        this.fuelPage = 1;
        this.pageSize = 50;

        this.cargoFilters = { ship: '', config: '', cargo: '', cost: '', efficiency: '' };
        this.combatFilters = { ship: '', config: '', power: '', cost: '', efficiency: '' };
        this.speedFilters = { ship: '', config: '', speed: '', cost: '', efficiency: '' };
        this.fuelFilters = { ship: '', config: '', efficiency: '', speed: '' };

        this.filteredCargo = [];
        this.filteredCombat = [];
        this.filteredSpeed = [];
        this.filteredFuel = [];
    }

    async renderResourceEfficiency() {
        if (this.isLoading) return;

        const loadingMsg = document.getElementById('efficiencyLoadingMessage');
        const content = document.getElementById('efficiencyContent');

        if (loadingMsg) loadingMsg.style.display = 'block';
        if (content) content.innerHTML = '';

        this.isLoading = true;

        try {
            if (!this.data) {
                await this.loadData();
            }

            if (loadingMsg) loadingMsg.style.display = 'none';

            this.renderBestCargoHaulers();
            this.renderBestCombatShips();
            this.renderBestSpeedShips();
            this.renderMostFuelEfficient();
        } catch (error) {
            console.error('[ResourceEfficiency] Error rendering:', error);
            if (loadingMsg) {
                loadingMsg.innerHTML = '<p style="color: #e74c3c;">❌ Error loading resource efficiency analysis</p>';
            }
        } finally {
            this.isLoading = false;
        }
    }

    async loadData() {
        console.log('[ResourceEfficiency] Loading data...');
        await this.crossAnalytics.loadAllData();
        this.data = await this.crossAnalytics.analyzeShipResourceEfficiency();
        console.log('[ResourceEfficiency] Data loaded:', this.data);
    }

    // ===== CARGO HAULERS =====
    renderBestCargoHaulers() {
        const container = document.getElementById('efficiencyContent');
        const section = document.createElement('div');
        section.className = 'efficiency-section';
        section.id = 'cargoHaulersSection';

        this.filteredCargo = [...this.data.bestCargoHaulers];
        const totalPages = Math.ceil(this.filteredCargo.length / this.pageSize);

        section.innerHTML = `
            <h3>📦 Best Cargo Haulers</h3>
            <p class="section-description">Ship configurations with highest cargo capacity relative to build cost</p>
            <p class="section-note"><strong>Build Cost:</strong> Sum of all component resource costs for this configuration. <strong>Efficiency:</strong> Cargo Capacity ÷ Build Cost (higher = better value).</p>

            <div class="pagination-controls">
                <button id="cargoPrevPage" class="pagination-btn">⟵ Previous</button>
                <span id="cargoPageInfo" class="page-info">Page 1 of ${totalPages}</span>
                <button id="cargoNextPage" class="pagination-btn">Next ⟶</button>
                <span class="filter-info" id="cargoFilterInfo"></span>
            </div>

            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ship</th>
                            <th>Configuration</th>
                            <th>Cargo</th>
                            <th>Build Cost</th>
                            <th>Efficiency</th>
                        </tr>
                        <tr class="filter-row">
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="cargo" data-column="ship" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="cargo" data-column="config" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="cargo" data-column="cargo" placeholder="Min..."></th>
                            <th><input type="text" class="column-filter" data-table="cargo" data-column="cost" placeholder="Max..."></th>
                            <th><input type="text" class="column-filter" data-table="cargo" data-column="efficiency" placeholder="Min..."></th>
                        </tr>
                    </thead>
                    <tbody id="cargoTableBody"></tbody>
                </table>
            </div>

            <div class="pagination-controls">
                <button id="cargoPrevPageBottom" class="pagination-btn">⟵ Previous</button>
                <span id="cargoPageInfoBottom" class="page-info">Page 1 of ${totalPages}</span>
                <button id="cargoNextPageBottom" class="pagination-btn">Next ⟶</button>
            </div>
        `;

        container.appendChild(section);
        this.renderCargoTablePage(1);
        this.setupCargoEventListeners();
    }

    setupCargoEventListeners() {
        ['cargoPrevPage', 'cargoPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeCargoPage(-1));
        });

        ['cargoNextPage', 'cargoNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeCargoPage(1));
        });

        document.querySelectorAll('.column-filter[data-table="cargo"]').forEach(input => {
            input.addEventListener('input', (e) => this.handleCargoFilter(e));
        });
    }

    handleCargoFilter(event) {
        const column = event.target.getAttribute('data-column');
        this.cargoFilters[column] = event.target.value.toLowerCase().trim();
        this.applyCargoFilters();
    }

    applyCargoFilters() {
        this.filteredCargo = this.data.bestCargoHaulers.filter(ship => {
            if (this.cargoFilters.ship && !ship.name.toLowerCase().includes(this.cargoFilters.ship)) return false;
            if (this.cargoFilters.config && !ship.configName.toLowerCase().includes(this.cargoFilters.config)) return false;
            if (this.cargoFilters.cargo) {
                const min = parseFloat(this.cargoFilters.cargo);
                if (!isNaN(min) && ship.cargoCapacity < min) return false;
            }
            if (this.cargoFilters.cost) {
                const max = parseFloat(this.cargoFilters.cost);
                if (!isNaN(max) && ship.estimatedBuildCost > max) return false;
            }
            if (this.cargoFilters.efficiency) {
                const min = parseFloat(this.cargoFilters.efficiency);
                if (!isNaN(min) && ship.cargoEfficiency < min) return false;
            }
            return true;
        });

        const filterInfo = document.getElementById('cargoFilterInfo');
        if (filterInfo) {
            filterInfo.textContent = this.filteredCargo.length === this.data.bestCargoHaulers.length
                ? '' : `Showing ${this.filteredCargo.length} of ${this.data.bestCargoHaulers.length} configurations`;
        }

        this.cargoPage = 1;
        this.renderCargoTablePage(1);
    }

    changeCargoPage(delta) {
        this.renderCargoTablePage(this.cargoPage + delta);
    }

    renderCargoTablePage(page) {
        const totalPages = Math.max(1, Math.ceil(this.filteredCargo.length / this.pageSize));
        const clampedPage = Math.min(Math.max(page, 1), totalPages);
        this.cargoPage = clampedPage;

        const startIdx = (clampedPage - 1) * this.pageSize;
        const shipsToShow = this.filteredCargo.slice(startIdx, startIdx + this.pageSize);
        const tbody = document.getElementById('cargoTableBody');
        if (!tbody) return;

        tbody.innerHTML = shipsToShow.map((ship, index) => {
            const rank = startIdx + index + 1;
            return `
                <tr>
                    <td class="rank-cell">${rank}</td>
                    <td>${this.escapeHtml(ship.name)}</td>
                    <td>${this.escapeHtml(ship.configName)}</td>
                    <td class="number-cell">${ship.cargoCapacity.toLocaleString()}</td>
                    <td class="number-cell">${ship.estimatedBuildCost.toLocaleString()}</td>
                    <td class="number-cell highlight-cell">${ship.cargoEfficiency.toFixed(4)}</td>
                </tr>
            `;
        }).join('');

        ['cargoPageInfo', 'cargoPageInfoBottom'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = `Page ${clampedPage} of ${totalPages}`;
        });

        const disablePrev = clampedPage === 1;
        const disableNext = clampedPage === totalPages;

        ['cargoPrevPage', 'cargoPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disablePrev;
        });

        ['cargoNextPage', 'cargoNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disableNext;
        });
    }

    // ===== COMBAT SHIPS =====
    renderBestCombatShips() {
        const container = document.getElementById('efficiencyContent');
        const section = document.createElement('div');
        section.className = 'efficiency-section';
        section.id = 'combatShipsSection';

        this.filteredCombat = [...this.data.bestCombatShips];
        const totalPages = Math.ceil(this.filteredCombat.length / this.pageSize);

        section.innerHTML = `
            <h3>⚔️ Best Combat Ships</h3>
            <p class="section-description">Ship configurations with highest combat effectiveness relative to build cost</p>
            <p class="section-note"><strong>Build Cost:</strong> Sum of all component resource costs for this configuration. <strong>Combat Power:</strong> Combined offensive capability from weapons. <strong>Efficiency:</strong> Combat Power ÷ Build Cost (higher = better value).</p>

            <div class="pagination-controls">
                <button id="combatPrevPage" class="pagination-btn">⟵ Previous</button>
                <span id="combatPageInfo" class="page-info">Page 1 of ${totalPages}</span>
                <button id="combatNextPage" class="pagination-btn">Next ⟶</button>
                <span class="filter-info" id="combatFilterInfo"></span>
            </div>

            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ship</th>
                            <th>Configuration</th>
                            <th>Combat Power</th>
                            <th>Build Cost</th>
                            <th>Efficiency</th>
                        </tr>
                        <tr class="filter-row">
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="combat" data-column="ship" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="combat" data-column="config" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="combat" data-column="power" placeholder="Min..."></th>
                            <th><input type="text" class="column-filter" data-table="combat" data-column="cost" placeholder="Max..."></th>
                            <th><input type="text" class="column-filter" data-table="combat" data-column="efficiency" placeholder="Min..."></th>
                        </tr>
                    </thead>
                    <tbody id="combatTableBody"></tbody>
                </table>
            </div>

            <div class="pagination-controls">
                <button id="combatPrevPageBottom" class="pagination-btn">⟵ Previous</button>
                <span id="combatPageInfoBottom" class="page-info">Page 1 of ${totalPages}</span>
                <button id="combatNextPageBottom" class="pagination-btn">Next ⟶</button>
            </div>
        `;

        container.appendChild(section);
        this.renderCombatTablePage(1);
        this.setupCombatEventListeners();
    }

    setupCombatEventListeners() {
        ['combatPrevPage', 'combatPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeCombatPage(-1));
        });

        ['combatNextPage', 'combatNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeCombatPage(1));
        });

        document.querySelectorAll('.column-filter[data-table="combat"]').forEach(input => {
            input.addEventListener('input', (e) => this.handleCombatFilter(e));
        });
    }

    handleCombatFilter(event) {
        const column = event.target.getAttribute('data-column');
        this.combatFilters[column] = event.target.value.toLowerCase().trim();
        this.applyCombatFilters();
    }

    applyCombatFilters() {
        this.filteredCombat = this.data.bestCombatShips.filter(ship => {
            if (this.combatFilters.ship && !ship.name.toLowerCase().includes(this.combatFilters.ship)) return false;
            if (this.combatFilters.config && !ship.configName.toLowerCase().includes(this.combatFilters.config)) return false;
            if (this.combatFilters.power) {
                const min = parseFloat(this.combatFilters.power);
                if (!isNaN(min) && ship.combatPower < min) return false;
            }
            if (this.combatFilters.cost) {
                const max = parseFloat(this.combatFilters.cost);
                if (!isNaN(max) && ship.estimatedBuildCost > max) return false;
            }
            if (this.combatFilters.efficiency) {
                const min = parseFloat(this.combatFilters.efficiency);
                if (!isNaN(min) && ship.combatEfficiency < min) return false;
            }
            return true;
        });

        const filterInfo = document.getElementById('combatFilterInfo');
        if (filterInfo) {
            filterInfo.textContent = this.filteredCombat.length === this.data.bestCombatShips.length
                ? '' : `Showing ${this.filteredCombat.length} of ${this.data.bestCombatShips.length} configurations`;
        }

        this.combatPage = 1;
        this.renderCombatTablePage(1);
    }

    changeCombatPage(delta) {
        this.renderCombatTablePage(this.combatPage + delta);
    }

    renderCombatTablePage(page) {
        const totalPages = Math.max(1, Math.ceil(this.filteredCombat.length / this.pageSize));
        const clampedPage = Math.min(Math.max(page, 1), totalPages);
        this.combatPage = clampedPage;

        const startIdx = (clampedPage - 1) * this.pageSize;
        const shipsToShow = this.filteredCombat.slice(startIdx, startIdx + this.pageSize);
        const tbody = document.getElementById('combatTableBody');
        if (!tbody) return;

        tbody.innerHTML = shipsToShow.map((ship, index) => {
            const rank = startIdx + index + 1;
            return `
                <tr>
                    <td class="rank-cell">${rank}</td>
                    <td>${this.escapeHtml(ship.name)}</td>
                    <td>${this.escapeHtml(ship.configName)}</td>
                    <td class="number-cell">${ship.combatPower.toFixed(0)}</td>
                    <td class="number-cell">${ship.estimatedBuildCost.toLocaleString()}</td>
                    <td class="number-cell highlight-cell">${ship.combatEfficiency.toFixed(4)}</td>
                </tr>
            `;
        }).join('');

        ['combatPageInfo', 'combatPageInfoBottom'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = `Page ${clampedPage} of ${totalPages}`;
        });

        const disablePrev = clampedPage === 1;
        const disableNext = clampedPage === totalPages;

        ['combatPrevPage', 'combatPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disablePrev;
        });

        ['combatNextPage', 'combatNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disableNext;
        });
    }

    // ===== SPEED SHIPS =====
    renderBestSpeedShips() {
        const container = document.getElementById('efficiencyContent');
        const section = document.createElement('div');
        section.className = 'efficiency-section';
        section.id = 'speedShipsSection';

        this.filteredSpeed = [...this.data.bestSpeedShips];
        const totalPages = Math.ceil(this.filteredSpeed.length / this.pageSize);

        section.innerHTML = `
            <h3>⚡ Best Speed Ships</h3>
            <p class="section-description">Fastest ship configurations relative to build cost</p>
            <p class="section-note"><strong>Build Cost:</strong> Sum of all component resource costs for this configuration. <strong>Warp Speed:</strong> Maximum faster-than-light travel speed. <strong>Efficiency:</strong> Warp Speed ÷ Build Cost (higher = better value).</p>

            <div class="pagination-controls">
                <button id="speedPrevPage" class="pagination-btn">⟵ Previous</button>
                <span id="speedPageInfo" class="page-info">Page 1 of ${totalPages}</span>
                <button id="speedNextPage" class="pagination-btn">Next ⟶</button>
                <span class="filter-info" id="speedFilterInfo"></span>
            </div>

            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ship</th>
                            <th>Configuration</th>
                            <th>Warp Speed</th>
                            <th>Build Cost</th>
                            <th>Efficiency</th>
                        </tr>
                        <tr class="filter-row">
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="speed" data-column="ship" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="speed" data-column="config" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="speed" data-column="speed" placeholder="Min..."></th>
                            <th><input type="text" class="column-filter" data-table="speed" data-column="cost" placeholder="Max..."></th>
                            <th><input type="text" class="column-filter" data-table="speed" data-column="efficiency" placeholder="Min..."></th>
                        </tr>
                    </thead>
                    <tbody id="speedTableBody"></tbody>
                </table>
            </div>

            <div class="pagination-controls">
                <button id="speedPrevPageBottom" class="pagination-btn">⟵ Previous</button>
                <span id="speedPageInfoBottom" class="page-info">Page 1 of ${totalPages}</span>
                <button id="speedNextPageBottom" class="pagination-btn">Next ⟶</button>
            </div>
        `;

        container.appendChild(section);
        this.renderSpeedTablePage(1);
        this.setupSpeedEventListeners();
    }

    setupSpeedEventListeners() {
        ['speedPrevPage', 'speedPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeSpeedPage(-1));
        });

        ['speedNextPage', 'speedNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeSpeedPage(1));
        });

        document.querySelectorAll('.column-filter[data-table="speed"]').forEach(input => {
            input.addEventListener('input', (e) => this.handleSpeedFilter(e));
        });
    }

    handleSpeedFilter(event) {
        const column = event.target.getAttribute('data-column');
        this.speedFilters[column] = event.target.value.toLowerCase().trim();
        this.applySpeedFilters();
    }

    applySpeedFilters() {
        this.filteredSpeed = this.data.bestSpeedShips.filter(ship => {
            if (this.speedFilters.ship && !ship.name.toLowerCase().includes(this.speedFilters.ship)) return false;
            if (this.speedFilters.config && !ship.configName.toLowerCase().includes(this.speedFilters.config)) return false;
            if (this.speedFilters.speed) {
                const min = parseFloat(this.speedFilters.speed);
                if (!isNaN(min) && ship.warpSpeed < min) return false;
            }
            if (this.speedFilters.cost) {
                const max = parseFloat(this.speedFilters.cost);
                if (!isNaN(max) && ship.estimatedBuildCost > max) return false;
            }
            if (this.speedFilters.efficiency) {
                const min = parseFloat(this.speedFilters.efficiency);
                if (!isNaN(min) && ship.speedEfficiency < min) return false;
            }
            return true;
        });

        const filterInfo = document.getElementById('speedFilterInfo');
        if (filterInfo) {
            filterInfo.textContent = this.filteredSpeed.length === this.data.bestSpeedShips.length
                ? '' : `Showing ${this.filteredSpeed.length} of ${this.data.bestSpeedShips.length} configurations`;
        }

        this.speedPage = 1;
        this.renderSpeedTablePage(1);
    }

    changeSpeedPage(delta) {
        this.renderSpeedTablePage(this.speedPage + delta);
    }

    renderSpeedTablePage(page) {
        const totalPages = Math.max(1, Math.ceil(this.filteredSpeed.length / this.pageSize));
        const clampedPage = Math.min(Math.max(page, 1), totalPages);
        this.speedPage = clampedPage;

        const startIdx = (clampedPage - 1) * this.pageSize;
        const shipsToShow = this.filteredSpeed.slice(startIdx, startIdx + this.pageSize);
        const tbody = document.getElementById('speedTableBody');
        if (!tbody) return;

        tbody.innerHTML = shipsToShow.map((ship, index) => {
            const rank = startIdx + index + 1;
            return `
                <tr>
                    <td class="rank-cell">${rank}</td>
                    <td>${this.escapeHtml(ship.name)}</td>
                    <td>${this.escapeHtml(ship.configName)}</td>
                    <td class="number-cell">${ship.warpSpeed}</td>
                    <td class="number-cell">${ship.estimatedBuildCost.toLocaleString()}</td>
                    <td class="number-cell highlight-cell">${ship.speedEfficiency.toFixed(6)}</td>
                </tr>
            `;
        }).join('');

        ['speedPageInfo', 'speedPageInfoBottom'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = `Page ${clampedPage} of ${totalPages}`;
        });

        const disablePrev = clampedPage === 1;
        const disableNext = clampedPage === totalPages;

        ['speedPrevPage', 'speedPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disablePrev;
        });

        ['speedNextPage', 'speedNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disableNext;
        });
    }

    // ===== FUEL EFFICIENT =====
    renderMostFuelEfficient() {
        const container = document.getElementById('efficiencyContent');
        const section = document.createElement('div');
        section.className = 'efficiency-section';
        section.id = 'fuelEfficiencySection';

        this.filteredFuel = [...this.data.mostFuelEfficient];
        const totalPages = Math.ceil(this.filteredFuel.length / this.pageSize);

        section.innerHTML = `
            <h3>⛽ Most Fuel Efficient</h3>
            <p class="section-description">Ship configurations with best fuel economy for long-distance travel</p>
            <p class="section-note"><strong>Fuel Efficiency:</strong> Distance traveled per unit of fuel consumed (higher = better range).</p>

            <div class="pagination-controls">
                <button id="fuelPrevPage" class="pagination-btn">⟵ Previous</button>
                <span id="fuelPageInfo" class="page-info">Page 1 of ${totalPages}</span>
                <button id="fuelNextPage" class="pagination-btn">Next ⟶</button>
                <span class="filter-info" id="fuelFilterInfo"></span>
            </div>

            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ship</th>
                            <th>Configuration</th>
                            <th>Fuel Efficiency</th>
                            <th>Warp Speed</th>
                        </tr>
                        <tr class="filter-row">
                            <th></th>
                            <th><input type="text" class="column-filter" data-table="fuel" data-column="ship" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="fuel" data-column="config" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-table="fuel" data-column="efficiency" placeholder="Min..."></th>
                            <th><input type="text" class="column-filter" data-table="fuel" data-column="speed" placeholder="Min..."></th>
                        </tr>
                    </thead>
                    <tbody id="fuelTableBody"></tbody>
                </table>
            </div>

            <div class="pagination-controls">
                <button id="fuelPrevPageBottom" class="pagination-btn">⟵ Previous</button>
                <span id="fuelPageInfoBottom" class="page-info">Page 1 of ${totalPages}</span>
                <button id="fuelNextPageBottom" class="pagination-btn">Next ⟶</button>
            </div>
        `;

        container.appendChild(section);
        this.renderFuelTablePage(1);
        this.setupFuelEventListeners();
    }

    setupFuelEventListeners() {
        ['fuelPrevPage', 'fuelPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeFuelPage(-1));
        });

        ['fuelNextPage', 'fuelNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.changeFuelPage(1));
        });

        document.querySelectorAll('.column-filter[data-table="fuel"]').forEach(input => {
            input.addEventListener('input', (e) => this.handleFuelFilter(e));
        });
    }

    handleFuelFilter(event) {
        const column = event.target.getAttribute('data-column');
        this.fuelFilters[column] = event.target.value.toLowerCase().trim();
        this.applyFuelFilters();
    }

    applyFuelFilters() {
        this.filteredFuel = this.data.mostFuelEfficient.filter(ship => {
            if (this.fuelFilters.ship && !ship.name.toLowerCase().includes(this.fuelFilters.ship)) return false;
            if (this.fuelFilters.config && !ship.configName.toLowerCase().includes(this.fuelFilters.config)) return false;
            if (this.fuelFilters.efficiency) {
                const min = parseFloat(this.fuelFilters.efficiency);
                if (!isNaN(min) && ship.fuelEfficiency < min) return false;
            }
            if (this.fuelFilters.speed) {
                const min = parseFloat(this.fuelFilters.speed);
                if (!isNaN(min) && ship.warpSpeed < min) return false;
            }
            return true;
        });

        const filterInfo = document.getElementById('fuelFilterInfo');
        if (filterInfo) {
            filterInfo.textContent = this.filteredFuel.length === this.data.mostFuelEfficient.length
                ? '' : `Showing ${this.filteredFuel.length} of ${this.data.mostFuelEfficient.length} configurations`;
        }

        this.fuelPage = 1;
        this.renderFuelTablePage(1);
    }

    changeFuelPage(delta) {
        this.renderFuelTablePage(this.fuelPage + delta);
    }

    renderFuelTablePage(page) {
        const totalPages = Math.max(1, Math.ceil(this.filteredFuel.length / this.pageSize));
        const clampedPage = Math.min(Math.max(page, 1), totalPages);
        this.fuelPage = clampedPage;

        const startIdx = (clampedPage - 1) * this.pageSize;
        const shipsToShow = this.filteredFuel.slice(startIdx, startIdx + this.pageSize);
        const tbody = document.getElementById('fuelTableBody');
        if (!tbody) return;

        tbody.innerHTML = shipsToShow.map((ship, index) => {
            const rank = startIdx + index + 1;
            return `
                <tr>
                    <td class="rank-cell">${rank}</td>
                    <td>${this.escapeHtml(ship.name)}</td>
                    <td>${this.escapeHtml(ship.configName)}</td>
                    <td class="number-cell highlight-cell">${ship.fuelEfficiency.toFixed(2)}</td>
                    <td class="number-cell">${ship.warpSpeed}</td>
                </tr>
            `;
        }).join('');

        ['fuelPageInfo', 'fuelPageInfoBottom'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = `Page ${clampedPage} of ${totalPages}`;
        });

        const disablePrev = clampedPage === 1;
        const disableNext = clampedPage === totalPages;

        ['fuelPrevPage', 'fuelPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disablePrev;
        });

        ['fuelNextPage', 'fuelNextPageBottom'].forEach(id => {
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
window.ResourceEfficiencyAnalytics = ResourceEfficiencyAnalytics;
