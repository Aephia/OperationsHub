/**
 * Ship Explorer - Configuration Comparison Tool
 * Applies Ship Config Lite component logic to multi-ship comparisons.
 */

class ShipExplorer {
    constructor() {
        this.ships = [];
        this.shipData = null;
        this.selectedShips = new Set();
        this.configSelections = [{}, {}, {}, {}]; // keyed by shipId
        this.currentTab = 'explorer';
        this.searchTerm = '';

        this.componentDataLoaded = false;
        this.shipMap = new Map();
        this.componentsById = {};
        this.componentAttributes = {};
        this.classScalingFormulas = {};
        this.tierScalingFormulas = {};
        this.modifiedStatsCache = new Map();

        this.statDefinitions = this.getStatDefinitions();
        this.statPathMap = {};
        this.statDefinitions.forEach(def => {
            this.statPathMap[def.key] = def.path;
        });
        this.statKeys = this.statDefinitions.map(def => def.key);

        this.configCalculator = new ShipConfigCalculator({ multiplierStackingMode: 'linear' });
        this.activeDetailOverlay = null;

        this.init();
    }

    async init() {
        console.log('[ShipExplorer] Initialising...');
        await this.loadShips();
        this.setupEventListeners();
        this.renderCheckboxes();
        this.renderComparison();
        this.updateStats();

        // Load component data asynchronously; re-render once modifiers become available.
        this.loadComponentData();
    }

    async loadShips() {
        try {
            const data = await DataLoader.loadExplorerData('ship');
            this.shipData = data;
            this.ships = data?.ships || [];
            this.shipMap = new Map();
            this.ships.forEach(ship => {
                if (ship && ship.id !== undefined && ship.id !== null) {
                    this.shipMap.set(ship.id, ship);
                }
            });
            console.log(`[ShipExplorer] Loaded ${this.ships.length} ships`);
        } catch (error) {
            console.error('[ShipExplorer] Error loading ship dataset:', error);
            this.ships = [];
            this.shipMap = new Map();
        }
    }

    async loadComponentData() {
        if (this.componentDataLoaded) return;

        try {
            console.log('[ShipExplorer] Loading component metadata...');
            const response = await fetch('../ship_configurations-combatv5.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.components?.rewardTree) {
                this.buildComponentLookup(data.components.rewardTree);
            }

            this.componentAttributes = data.componentAttributes || {};
            this.classScalingFormulas = data.classScalingFormulas || {};
            this.tierScalingFormulas = data.tierScalingFormulas || {};

            this.configCalculator.setData({
                componentsById: this.componentsById,
                componentAttributes: this.componentAttributes,
                classScalingFormulas: this.classScalingFormulas,
                tierScalingFormulas: this.tierScalingFormulas,
                statPathMap: this.statPathMap,
                statKeys: this.statKeys
            });

            this.componentDataLoaded = true;
            console.log('[ShipExplorer] Component data loaded');

            this.modifiedStatsCache.clear();
            this.renderComparison();
        } catch (error) {
            console.error('[ShipExplorer] Failed to load component metadata:', error);
        }
    }

    buildComponentLookup(rewardTree = []) {
        this.componentsById = {};

        const traverse = (node, context) => {
            if (!node) return;
            const properties = node.properties || {};

            const category = properties.Category || context.category || null;

            let componentType = context.componentType || null;
            componentType = properties['Ship Component'] || properties['Ship Modules'] ||
                properties['Damage Type'] || properties['Countermeasure'] ||
                properties['Missiles'] || properties['Drone Type'] ||
                properties['Drones'] || componentType;

            const className = properties.Class || context.className || null;
            const tierName = properties.Tier || context.tierName || null;

            if (node.id !== undefined && node.id !== null) {
                const key = node.id.toString();
                this.componentsById[key] = {
                    id: node.id,
                    name: node.name || componentType || `Component ${node.id}`,
                    properties,
                    category,
                    componentType,
                    className,
                    tierName
                };
            }

            if (Array.isArray(node.children)) {
                node.children.forEach(child => traverse(child, {
                    category,
                    componentType,
                    className,
                    tierName
                }));
            }
        };

        rewardTree.forEach(root => traverse(root, {
            category: null,
            componentType: null,
            className: null,
            tierName: null
        }));
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (event) => {
                this.switchTab(event.target.dataset.tab);
            });
        });

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                this.handleSearch(event.target.value);
            });
        }
    }

    handleSearch(value) {
        this.searchTerm = (value || '').toLowerCase().trim();
        this.renderCheckboxes();
    }

    matchesSearch(ship) {
        if (!this.searchTerm) return true;
        const tokens = [
            ship?.name,
            ship?.manufacturer,
            ship?.spec,
            ship?.sizeTier,
            ship?.id
        ].filter(Boolean).join(' ').toLowerCase();
        return tokens.includes(this.searchTerm);
    }

    renderCheckboxes() {
        const container = document.getElementById('shipCheckboxes');
        if (!container) return;

        container.innerHTML = '';

        const filtered = this.ships
            .map((ship, index) => ({ ship, index }))
            .filter(({ ship }) => this.matchesSearch(ship));

        if (filtered.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent = 'No ships match your search.';
            container.appendChild(empty);
            return;
        }

        filtered.forEach(({ ship, index }) => {
            const div = document.createElement('div');
            div.className = 'checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `ship-${index}`;
            checkbox.checked = this.selectedShips.has(index);
            checkbox.addEventListener('change', () => {
                this.toggleShip(index);
            });

            const label = document.createElement('label');
            label.htmlFor = `ship-${index}`;
            label.textContent = this.getShipDisplayName(ship);

            div.appendChild(checkbox);
            div.appendChild(label);
            container.appendChild(div);
        });
    }

    getShipDisplayName(ship) {
        const manufacturer = ship?.manufacturer || 'Unknown';
        const name = ship?.name || 'Ship';
        return `${manufacturer} ${name}`;
    }

    toggleShip(index) {
        if (this.selectedShips.has(index)) {
            this.selectedShips.delete(index);
        } else {
            this.selectedShips.add(index);
        }

        const ship = this.ships[index];
        if (ship) {
            this.invalidateCacheForShip(ship.id);
        }

        this.renderCheckboxes();
        this.renderComparison();
        this.updateStats();
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}Tab`);
        });

        if (tabName === 'analytics') {
            this.renderAnalytics();
        }
    }

    renderComparison() {
        const wrapper = document.getElementById('comparisonTableWrapper');
        if (!wrapper) return;

        const selectedIndexes = Array.from(this.selectedShips).sort((a, b) => a - b);
        const selectedShipData = selectedIndexes
            .map(index => this.ships[index])
            .filter(Boolean);

        if (selectedShipData.length === 0) {
            wrapper.innerHTML = '<div class="empty-state">Select ships from the list to begin comparing configurations.</div>';
            return;
        }

        let html = '<table class="comparison-table">';
        html += '<thead>';
        html += '<tr><th>Stat</th>';
        selectedShipData.forEach(ship => {
            html += `<th colspan="5">${this.getShipDisplayName(ship)}</th>`;
        });
        html += '</tr>';

        html += '<tr><th></th>';
        selectedShipData.forEach((ship, shipIdx) => {
            html += '<th>Base</th>';
            for (let configIdx = 0; configIdx < 4; configIdx++) {
                const selectedValue = this.configSelections[configIdx][ship.id] || '';
                html += `<th>${this.getConfigSelect(ship, shipIdx, configIdx, selectedValue)}</th>`;
            }
        });
        html += '</tr>';
        html += '</thead><tbody>';

        this.statDefinitions.forEach(stat => {
            const shipRows = [];
            let bestCell = null;

            selectedShipData.forEach(ship => {
                const baseValue = this.getBaseStatValue(ship, stat.key);
                const rowEntry = {
                    ship,
                    baseValue,
                    cells: []
                };

                for (let configIdx = 0; configIdx < 4; configIdx++) {
                    const selectedConfig = this.configSelections[configIdx][ship.id] || '';

                    if (!selectedConfig) {
                        rowEntry.cells.push({ type: 'empty' });
                        continue;
                    }

                    const modifiedValue = this.applyModifiers(ship, selectedConfig, stat.key);
                    const change = this.calculateChange(baseValue, modifiedValue);
                    const cell = {
                        type: 'value',
                        value: modifiedValue,
                        change,
                        shipId: ship.id,
                        configName: selectedConfig,
                        statKey: stat.key,
                        canShowDetails: this.componentDataLoaded
                    };

                    if (change > 0 && Number.isFinite(change)) {
                        if (!bestCell || change > bestCell.change) {
                            bestCell = cell;
                        }
                    }

                    rowEntry.cells.push(cell);
                }

                shipRows.push(rowEntry);
            });

            if (bestCell) {
                bestCell.isBest = true;
            }

            html += `<tr><td>${stat.label}</td>`;

            shipRows.forEach(entry => {
                html += `<td class="stat-value">${this.formatStatValue(entry.baseValue)}</td>`;
                entry.cells.forEach(cell => {
                    if (cell.type === 'empty') {
                        html += '<td class="stat-value stat-empty">—</td>';
                        return;
                    }

                    const classes = ['stat-value'];
                    if (cell.change > 0) {
                        classes.push('increased');
                    } else if (cell.change < 0) {
                        classes.push('decreased');
                    }
                    if (cell.isBest) {
                        classes.push('best-value');
                    }
                    if (cell.canShowDetails) {
                        classes.push('clickable');
                    }

                    const changeHtml = cell.change !== 0 && Number.isFinite(cell.change)
                        ? `<span class="stat-change">(${cell.change > 0 ? '+' : ''}${cell.change.toFixed(1)}%)</span>`
                        : '';

                    const dataAttributes = cell.canShowDetails
                        ? ` data-stat-detail="true" data-ship-id="${cell.shipId}" data-config-name="${this.escapeAttribute(cell.configName)}" data-stat-key="${stat.key}"`
                        : '';

                    html += `<td class="${classes.join(' ')}"${dataAttributes}>
                            ${this.formatStatValue(cell.value)}
                            ${changeHtml}
                        </td>`;
                });
            });


            html += '</tr>';
        });

        html += '</tbody></table>';
        wrapper.innerHTML = html;

        wrapper.querySelectorAll('.config-select').forEach(select => {
            select.addEventListener('change', (event) => {
                const shipId = event.target.dataset.ship;
                const configIdx = parseInt(event.target.dataset.config, 10);
                this.invalidateCacheForShip(shipId);
                this.configSelections[configIdx][shipId] = event.target.value;
                this.renderComparison();
            });
        });

        wrapper.querySelectorAll('td[data-stat-detail="true"]').forEach(cell => {
            cell.addEventListener('click', () => {
                const shipId = cell.getAttribute('data-ship-id');
                const configName = cell.getAttribute('data-config-name');
                const statKey = cell.getAttribute('data-stat-key');
                this.showStatDetails(shipId, configName, statKey);
            });
        });
    }

    getConfigSelect(ship, shipIdx, configIdx, selectedValue) {
        const options = ['<option value="">Select Config</option>'];

        (ship.configurations || []).forEach(config => {
            const value = config.name || '';
            if (!value) return;
            const isSelected = value === selectedValue ? ' selected' : '';
            options.push(`<option value="${this.escapeAttribute(value)}"${isSelected}>${this.escapeHtml(value)}</option>`);
        });

        return `<select class="config-select" data-ship="${ship.id}" data-config="${configIdx}" data-ship-index="${shipIdx}">
            ${options.join('')}
        </select>`;
    }

    getBaseStatValue(ship, statKey) {
        const path = this.statPathMap[statKey];
        if (!path) return null;

        let current = ship;
        for (const segment of path) {
            if (current === null || current === undefined) return null;
            current = current[segment];
        }

        return typeof current === 'number' ? current : null;
    }

    applyModifiers(ship, configName, statKey) {
        const baseValue = this.getBaseStatValue(ship, statKey);
        if (!this.componentDataLoaded || !configName) {
            return baseValue;
        }

        const calcResult = this.getModifiedStatsForConfig(ship, configName);
        const modifiedStats = calcResult?.values;
        if (!modifiedStats || modifiedStats[statKey] === undefined) {
            return baseValue;
        }

        return modifiedStats[statKey];
    }

    getModifiedStatsForConfig(ship, configName) {
        if (!configName) return null;
        const cacheKey = `${ship.id}::${configName}`;

        if (this.modifiedStatsCache.has(cacheKey)) {
            return this.modifiedStatsCache.get(cacheKey);
        }

        const config = (ship.configurations || []).find(cfg => cfg.name === configName);
        if (!config) return null;

        const result = this.configCalculator.calculateModifiedStats(ship, config);
        this.modifiedStatsCache.set(cacheKey, result);
        return result;
    }

    calculateChange(baseValue, modifiedValue) {
        if (baseValue === null || baseValue === undefined) return 0;
        if (modifiedValue === null || modifiedValue === undefined) return 0;
        if (baseValue === 0) return 0;
        return ((modifiedValue - baseValue) / Math.abs(baseValue)) * 100;
    }

    formatStatValue(value) {
        if (value === null || value === undefined || Number.isNaN(value)) return '—';
        if (typeof value !== 'number') return value;

        if (value === 0) return '0';
        if (Math.abs(value) >= 1000) return value.toFixed(0);
        if (Math.abs(value) >= 100) return value.toFixed(1);
        if (Math.abs(value) >= 10) return value.toFixed(2);
        if (Math.abs(value) >= 1) return value.toFixed(3);
        return value.toFixed(4);
    }

    updateStats() {
        const totalShipsEl = document.getElementById('totalShips');
        const selectedShipsEl = document.getElementById('selectedShips');
        const manufacturersEl = document.getElementById('uniqueManufacturers');

        if (totalShipsEl) totalShipsEl.textContent = this.ships.length;
        if (selectedShipsEl) selectedShipsEl.textContent = this.selectedShips.size;

        const manufacturers = new Set(this.ships.map(ship => ship?.manufacturer).filter(Boolean));
        if (manufacturersEl) manufacturersEl.textContent = manufacturers.size;
    }

    renderAnalytics() {
        const container = document.getElementById('analyticsContent');
        if (!container) return;

        const totalShips = this.ships.length;
        const averageConfigs = this.shipData?.configStats?.averageComponentsPerConfig ?? '—';
        const avgFilled = this.shipData?.configStats?.averageSlotFillRate ?? '—';

        container.innerHTML = `
            <div class="analytics-section">
                <h3>Ship Dataset Overview</h3>
                <p>Total ships indexed: <strong>${totalShips}</strong></p>
                <p>Average components per configuration: <strong>${averageConfigs}</strong></p>
                <p>Average slot fill rate: <strong>${avgFilled}%</strong></p>
            </div>
        `;
    }

    invalidateCacheForShip(shipId) {
        if (!shipId) return;
        const prefix = `${shipId}::`;
        Array.from(this.modifiedStatsCache.keys()).forEach(key => {
            if (key.startsWith(prefix)) {
                this.modifiedStatsCache.delete(key);
            }
        });
    }

    getStatLabel(statKey) {
        const definition = this.statDefinitions.find(def => def.key === statKey);
        return definition ? definition.label : statKey;
    }

    showStatDetails(shipId, configName, statKey) {
        if (!this.componentDataLoaded) {
            alert('Component data is still loading. Please try again in a moment.');
            return;
        }

        const ship = this.shipMap.get(shipId) || this.ships.find(s => s.id === shipId);
        if (!ship || !configName || !statKey) return;

        const calcResult = this.getModifiedStatsForConfig(ship, configName);
        if (!calcResult) return;

        const detail = calcResult.details?.[statKey];
        const baseValue = detail?.baseValue ?? this.getBaseStatValue(ship, statKey);
        const modifiedValue = detail?.modifiedValue ?? calcResult.values?.[statKey] ?? baseValue;
        const deltaValue = modifiedValue - baseValue;
        const deltaPercent = this.calculateChange(baseValue, modifiedValue);

        const effectiveBase = (detail?.baseValue ?? 0) + (detail?.totalAdditive ?? 0);
        const contributions = (detail?.contributions || []).map(entry => {
            const additiveImpact = entry.additiveTotal || 0;
            const multiplierImpact = effectiveBase * (entry.multiplierBonus || 0);
            const impactScore = Math.abs(additiveImpact) + Math.abs(multiplierImpact);
            return {
                ...entry,
                additiveImpact,
                multiplierImpact,
                impactScore
            };
        }).sort((a, b) => b.impactScore - a.impactScore);

        const rawEffects = detail?.rawEffects || [];
        const statLabel = this.getStatLabel(statKey);
        const shipLabel = this.getShipDisplayName(ship);

        if (this.activeDetailOverlay) {
            this.hideStatDetails();
        }

        const overlay = document.createElement('div');
        overlay.className = 'stat-details-overlay';

        const modal = document.createElement('div');
        modal.className = 'stat-details-modal';
        modal.innerHTML = `
            <div class="stat-details-header">
                <h2>${this.escapeHtml(statLabel)}</h2>
                <button type="button" class="close-button">&times;</button>
            </div>
            <div class="stat-details-body">
                <div class="stat-detail-summary">
                    <p><strong>Ship:</strong> ${this.escapeHtml(shipLabel)}</p>
                    <p><strong>Configuration:</strong> ${this.escapeHtml(configName)}</p>
                </div>
                <div class="stat-detail-metrics">
                    <div><span class="metric-label">Base:</span> ${this.formatStatValue(baseValue)}</div>
                    <div><span class="metric-label">Modified:</span> ${this.formatStatValue(modifiedValue)}</div>
                    <div><span class="metric-label">Delta:</span> ${this.formatSignedValue(deltaValue)}</div>
                    <div><span class="metric-label">Change:</span> ${this.formatSignedPercent(deltaPercent)}</div>
                </div>
                <div class="stat-detail-metrics secondary">
                    <div><span class="metric-label">Total Additive:</span> ${this.formatStatValue(detail?.totalAdditive || 0)}</div>
                    <div><span class="metric-label">Total Multiplier:</span> ${this.formatPercentage((detail?.totalMultiplier || 1) - 1)}</div>
                </div>
                <div class="stat-detail-section">
                    <h3>Component Contributions</h3>
                    ${contributions.length === 0 ? '<p>No components modify this stat in this configuration.</p>' : `
                        <table class="stat-detail-table">
                            <thead>
                                <tr>
                                    <th>Component</th>
                                    <th>Category</th>
                                    <th>Count</th>
                                    <th>Additive</th>
                                    <th>Multiplier</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${contributions.map(entry => `
                                    <tr>
                                        <td>${this.escapeHtml(entry.componentName || entry.groupName || 'Component')}</td>
                                        <td>${this.escapeHtml(entry.category || entry.componentType || '')}</td>
                                        <td>${entry.count}</td>
                                        <td>${entry.additiveTotal ? this.formatSignedValue(entry.additiveTotal) : '—'}</td>
                                        <td>${entry.multiplierBonus ? this.formatPercentage(entry.multiplierBonus) : '—'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                </div>
                ${rawEffects.length ? `
                    <div class="stat-detail-section">
                        <h3>Installed Components</h3>
                        <ul class="stat-detail-list">
                            ${rawEffects.map(effect => `
                                <li>
                                    <span class="component-name">${this.escapeHtml(effect.componentName || effect.groupName || 'Component')}</span>
                                    <span class="component-meta">
                                        ${this.escapeHtml(effect.category || '')}${effect.componentType ? ` &middot; ${this.escapeHtml(effect.componentType)}` : ''}
                                        ${effect.className || effect.tierName ? ` &middot; ${[effect.className, effect.tierName].filter(Boolean).join(' ')}` : ''}
                                    </span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        this.activeDetailOverlay = overlay;

        const close = () => this.hideStatDetails();
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                close();
            }
        });
        modal.querySelector('.close-button').addEventListener('click', close);
        modal.addEventListener('click', event => event.stopPropagation());
    }

    hideStatDetails() {
        if (this.activeDetailOverlay && this.activeDetailOverlay.parentNode) {
            this.activeDetailOverlay.parentNode.removeChild(this.activeDetailOverlay);
        }
        this.activeDetailOverlay = null;
    }

    formatPercentage(value) {
        if (value === null || value === undefined || Number.isNaN(value)) return '—';
        return `${(value * 100).toFixed(1)}%`;
    }

    formatSignedValue(value) {
        if (value === null || value === undefined || Number.isNaN(value)) return '—';
        const sign = value >= 0 ? '+' : '-';
        return `${sign}${this.formatStatValue(Math.abs(value))}`;
    }

    formatSignedPercent(value) {
        if (value === null || value === undefined || Number.isNaN(value)) return '—';
        const sign = value >= 0 ? '+' : '-';
        return `${sign}${Math.abs(value).toFixed(1)}%`;
    }

    escapeHtml(text) {
        if (text === null || text === undefined) return '';
        return text.toString().replace(/[&<>"']/g, (char) => {
            switch (char) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case '\'': return '&#39;';
                default: return char;
            }
        });
    }

    escapeAttribute(value) {
        return this.escapeHtml(value);
    }

    getStatDefinitions() {
        return [
            { key: 'cargo_capacity', label: 'Cargo Capacity', path: ['stats', 'capacities', 'cargoCapacity'] },
            { key: 'fuel_capacity', label: 'Fuel Capacity', path: ['stats', 'capacities', 'fuelCapacity'] },
            { key: 'ammo_capacity', label: 'Ammo Capacity', path: ['stats', 'capacities', 'ammoCapacity'] },
            { key: 'subwarp_speed', label: 'Subwarp Speed', path: ['stats', 'travel', 'subwarpSpeed'] },
            { key: 'warp_speed', label: 'Warp Speed', path: ['stats', 'travel', 'warpSpeed'] },
            { key: 'max_warp_distance', label: 'Max Warp Distance', path: ['stats', 'travel', 'maxWarpDistance'] },
            { key: 'warp_cool_down', label: 'Warp Cooldown', path: ['stats', 'travel', 'warpCoolDown'] },
            { key: 'warp_fuel_consumption', label: 'Warp Fuel Consumption', path: ['stats', 'travel', 'warpFuelConsumption'] },
            { key: 'subwarp_fuel_consumption', label: 'Subwarp Fuel Consumption', path: ['stats', 'travel', 'subwarpFuelConsumption'] },
            { key: 'scan_power', label: 'Scan Power', path: ['stats', 'scanning', 'scanPower'] },
            { key: 'scan_cool_down', label: 'Scan Cooldown', path: ['stats', 'scanning', 'scanCoolDown'] },
            { key: 'hit_points', label: 'Hit Points', path: ['stats', 'combat', 'hitPoints'] },
            { key: 'shield_points', label: 'Shield Points', path: ['stats', 'combat', 'shieldPoints'] },
            { key: 'shield_recharge_rate', label: 'Shield Recharge Rate', path: ['stats', 'combat', 'shieldRechargeRate'] },
            { key: 'damage', label: 'Damage', path: ['stats', 'combat', 'damage'] },
            { key: 'damage_range', label: 'Damage Range', path: ['stats', 'combat', 'damageRange'] },
            { key: 'repair_rate', label: 'Repair Rate', path: ['stats', 'repair', 'repairRate'] },
            { key: 'required_crew', label: 'Required Crew', path: ['crew', 'required'] }
        ];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.shipExplorer = new ShipExplorer();
});












