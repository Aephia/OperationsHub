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
        this.recipeCostCache = new Map();
        this.configResourceSummary = null;
        this.configResourceTotalsCache = new Map();
        this.analyticsRefreshTimer = null;

        this.statDefinitions = this.getStatDefinitions();
        this.statPathMap = {};
        this.statDefinitions.forEach(def => {
            this.statPathMap[def.key] = def.path;
        });
        this.statKeys = this.statDefinitions.map(def => def.key);

        this.configCalculator = new ShipConfigCalculator({ multiplierStackingMode: 'linear' });
        this.activeDetailOverlay = null;
        this.activeResourceOverlay = null;

        // Initialize new management modules
        this.attributeManager = null;
        this.attributesPanel = null;
        this.componentManager = null;
        this.customShipManager = null;
        this.recipeLookup = null;

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
            this.configResourceSummary = null;
            this.configResourceTotalsCache.clear();
            this.recipeCostCache.clear();
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

            const basePath = '../JSON/';

            const [componentsData, formulasData] = await Promise.all([
                this.fetchComponentDataset(basePath),
                this.fetchJsonOrThrow(`${basePath}ship-formulas.json`, 'ship formulas')
            ]);

            // Build component lookup from components file
            if (componentsData.components?.rewardTree) {
                this.buildComponentLookup(componentsData.components.rewardTree);
            }

            // Get formulas from formulas file
            this.componentAttributes = formulasData.componentAttributes || {};
            this.classScalingFormulas = formulasData.classScalingFormulas || {};
            this.tierScalingFormulas = formulasData.tierScalingFormulas || {};

            this.configCalculator.setData({
                componentsById: this.componentsById,
                componentAttributes: this.componentAttributes,
                classScalingFormulas: this.classScalingFormulas,
                tierScalingFormulas: this.tierScalingFormulas,
                statPathMap: this.statPathMap,
                statKeys: this.statKeys
            });

            this.recipeCostCache.clear();
            this.configResourceSummary = null;
            this.configResourceTotalsCache.clear();

            this.componentDataLoaded = true;
            console.log('[ShipExplorer] Component data loaded from split files');

            // Initialize management modules after component data is loaded
            this.initializeManagementModules();

            this.modifiedStatsCache.clear();
            this.renderComparison();
            if (this.currentTab === 'analytics') {
                this.renderAnalytics();
            }
        } catch (error) {
            console.error('[ShipExplorer] Failed to load component metadata:', error);
        }
    }

    async fetchJsonOrThrow(url, label) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error while loading ${label}: ${response.status}`);
        }
        return response.json();
    }

    async fetchComponentDataset(basePath) {
        const manifestUrl = `${basePath}ship-components.json`;
        const manifestResponse = await fetch(manifestUrl);
        if (!manifestResponse.ok) {
            throw new Error(`HTTP error while loading component manifest: ${manifestResponse.status}`);
        }

        const manifest = await manifestResponse.json();

        // Backward compatibility: manifest already contains full data
        if (!Array.isArray(manifest.parts) || manifest.parts.length === 0) {
            return manifest;
        }

        console.log(`[ShipExplorer] Component manifest references ${manifest.parts.length} part(s)`);

        const combined = {
            version: manifest.version || null,
            timestamp: manifest.timestamp || null,
            shipConfigurations: [],
            components: {
                rewardTree: [],
                categories: [],
                nextId: manifest.components?.nextId || manifest.nextId || null,
                allComponents: [],
                componentsById: {}
            }
        };

        const seenConfigNames = new Set();
        const seenComponentIds = new Set();

        const mergePart = (part) => {
            if (!part || typeof part !== 'object') return;

            if (Array.isArray(part.shipConfigurations)) {
                part.shipConfigurations.forEach(config => {
                    const key = config?.name || config?.id || JSON.stringify(config);
                    if (!seenConfigNames.has(key)) {
                        seenConfigNames.add(key);
                        combined.shipConfigurations.push(config);
                    }
                });
            }

            if (part.components && typeof part.components === 'object') {
                const partComponents = part.components;

                if (Array.isArray(partComponents.rewardTree) && combined.components.rewardTree.length === 0) {
                    combined.components.rewardTree = partComponents.rewardTree;
                }

                if (Array.isArray(partComponents.categories) && combined.components.categories.length === 0) {
                    combined.components.categories = partComponents.categories;
                }

                if (partComponents.nextId) {
                    combined.components.nextId = Math.max(
                        combined.components.nextId || 0,
                        partComponents.nextId
                    );
                }

                if (Array.isArray(partComponents.allComponents)) {
                    partComponents.allComponents.forEach(component => {
                        const key = component?.id ?? JSON.stringify(component);
                        if (!seenComponentIds.has(key)) {
                            seenComponentIds.add(key);
                            combined.components.allComponents.push(component);
                        }
                    });
                }

                if (partComponents.componentsById && typeof partComponents.componentsById === 'object') {
                    Object.entries(partComponents.componentsById).forEach(([key, value]) => {
                        combined.components.componentsById[key] = value;
                        if (!seenComponentIds.has(key)) {
                            seenComponentIds.add(key);
                        }
                    });
                }
            }
        };

        // Ensure we also merge any component data shipped directly within the manifest
        mergePart(manifest);

        for (const partName of manifest.parts) {
            const partUrl = `${basePath}${partName}`;
            try {
                const partData = await this.fetchJsonOrThrow(partUrl, `component part ${partName}`);
                mergePart(partData);
                console.log(`[ShipExplorer] Loaded component part: ${partName}`);
            } catch (partError) {
                console.error('[ShipExplorer] Failed to load component data part:', partName, partError);
            }
        }

        if (combined.components.rewardTree.length === 0 && Object.keys(combined.components.componentsById).length === 0) {
            throw new Error('Component dataset is empty after merging parts');
        }

        if (combined.shipConfigurations.length === 0 && Array.isArray(manifest.shipConfigurations)) {
            combined.shipConfigurations = manifest.shipConfigurations;
        }

        return combined;
    }

    initializeManagementModules() {
        if (typeof AttributeManager !== 'undefined') {
            this.attributeManager = new AttributeManager(this);
            console.log('[ShipExplorer] AttributeManager initialized');
        }

        if (typeof AttributesPanel !== 'undefined') {
            this.attributesPanel = new AttributesPanel(this);
            console.log('[ShipExplorer] AttributesPanel initialized');
        }

        if (typeof ComponentManager !== 'undefined') {
            this.componentManager = new ComponentManager(this);
            console.log('[ShipExplorer] ComponentManager initialized');
        }

        if (typeof CustomShipManager !== 'undefined') {
            this.customShipManager = new CustomShipManager(this);
            console.log('[ShipExplorer] CustomShipManager initialized');
        }

        if (typeof RecipeLookup !== 'undefined') {
            this.recipeLookup = new RecipeLookup();
            const recipePromise = this.recipeLookup.loadRecipes();
            if (recipePromise && typeof recipePromise.then === 'function') {
                recipePromise.then(() => {
                    this.recipeCostCache.clear();
                    this.configResourceSummary = null;
                    this.configResourceTotalsCache.clear();
                    if (this.currentTab === 'analytics') {
                        this.renderAnalytics();
                    }
                }).catch(error => {
                    console.error('[ShipExplorer] Recipe data failed to load:', error);
                });
            }
            console.log('[ShipExplorer] RecipeLookup initialized');
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
        const sizeTier = ship?.sizeTier || '';
        return sizeTier ? `${manufacturer} ${name} (${sizeTier})` : `${manufacturer} ${name}`;
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
                        html += '<td class="stat-value stat-empty">�</td>';
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
        if (value === null || value === undefined || Number.isNaN(value)) return '�';
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
        const averageConfigs = this.shipData?.configStats?.averageComponentsPerConfig ?? '�';
        const avgFilled = this.shipData?.configStats?.averageSlotFillRate ?? '�';

        const overviewSection = `
            <div class="analytics-section">
                <h3>Ship Dataset Overview</h3>
                <p>Total ships indexed: <strong>${totalShips}</strong></p>
                <p>Average components per configuration: <strong>${averageConfigs}</strong></p>
                <p>Average slot fill rate: <strong>${avgFilled}%</strong></p>
            </div>
        `;

        const resourcesSection = this.buildConfigResourceAnalyticsSection();

        container.innerHTML = `
            ${overviewSection}
            ${resourcesSection}
        `;
    }

    buildConfigResourceAnalyticsSection() {
        if (!this.componentDataLoaded) {
            return `
                <div class="analytics-section">
                    <h3>Configuration Resource Totals</h3>
                    <p>Component metadata is still loading. Please check back in a moment.</p>
                </div>
            `;
        }

        if (!this.recipeLookup || !this.recipeLookup.recipesLoaded) {
            if (!this.analyticsRefreshTimer) {
                this.analyticsRefreshTimer = setTimeout(() => {
                    this.analyticsRefreshTimer = null;
                    this.renderAnalytics();
                }, 500);
            }
            return `
                <div class="analytics-section">
                    <h3>Configuration Resource Totals</h3>
                    <p>Recipe data is loading. Totals will appear as soon as the recipes are available.</p>
                </div>
            `;
        }

        if (this.analyticsRefreshTimer) {
            clearTimeout(this.analyticsRefreshTimer);
            this.analyticsRefreshTimer = null;
        }

        if (!this.configResourceSummary) {
            this.configResourceSummary = this.calculateConfigResourceSummary();
        }

        const summary = this.configResourceSummary;
        if (!summary || summary.rows.length === 0) {
            return `
                <div class="analytics-section">
                    <h3>Configuration Resource Totals</h3>
                    <p>No configuration resource data available.</p>
                </div>
            `;
        }

        const rowsHtml = summary.rows.map(row => {
            const cachedTotals = this.configResourceTotalsCache.get(row.configName);
            const totalCell = cachedTotals
                ? cachedTotals.totalQuantity.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : '<span class="analytics-hint">Click to calculate</span>';
            const buttonLabel = cachedTotals ? 'View Again' : 'View Raw Inputs';

            return `
                <tr>
                    <td>${this.escapeHtml(row.configName)}</td>
                    <td>${row.configCount.toLocaleString()}</td>
                    <td>${row.componentCount.toLocaleString()}</td>
                    <td>${totalCell}</td>
                    <td>
                        <button
                            type="button"
                            class="view-resource-btn"
                            onclick="window.shipExplorer.showConfigResourceBreakdown('${this.escapeAttribute(row.configName)}')"
                        >
                            ${buttonLabel}
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        const noteHtml = `
            <div class="analytics-note">
                ℹ️ Totals are calculated on-demand. Click a configuration to compute the complete raw input breakdown.
            </div>
        `;

        return `
            <div class="analytics-section">
                <h3>Configuration Resource Totals</h3>
                <p>Spot-check resource requirements per configuration without incurring up-front processing costs.</p>
                <div class="analytics-table-wrapper">
                    <table class="analytics-table">
                        <thead>
                            <tr>
                                <th>Configuration</th>
                                <th>Configs Counted</th>
                                <th>Components</th>
                                <th>Total Raw Inputs</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
                ${noteHtml}
            </div>
        `;
    }

    collectComponentIds(config) {
        const ids = [];
        if (!config || !config.components) {
            return ids;
        }

        Object.values(config.components).forEach(category => {
            if (!category || typeof category !== 'object') {
                return;
            }
            Object.values(category).forEach(slot => {
                if (!slot || !Array.isArray(slot.items)) {
                    return;
                }
                slot.items.forEach(itemId => {
                    if (itemId !== null && itemId !== undefined) {
                        ids.push(itemId);
                    }
                });
            });
        });

        return ids;
    }

    getResourceCostForComponent(componentId) {
        if (componentId === null || componentId === undefined) {
            return null;
        }

        const cacheKey = componentId.toString();
        if (this.recipeCostCache.has(cacheKey)) {
            return this.recipeCostCache.get(cacheKey);
        }

        if (!this.recipeLookup || !this.recipeLookup.recipesLoaded) {
            return null;
        }

        const component = this.componentsById[cacheKey];
        if (!component) {
            this.recipeCostCache.set(cacheKey, null);
            return null;
        }

        const componentType = component.componentType || component.properties?.['Ship Component'] || component.name;
        const componentClass = component.className || component.properties?.Class;
        const componentTier = component.tierName || component.properties?.Tier;

        const recipes = this.recipeLookup.findComponentRecipes(componentType, componentClass, componentTier);
        if (!recipes || recipes.length === 0) {
            this.recipeCostCache.set(cacheKey, null);
            return null;
        }

        const recipeCost = this.recipeLookup.calculateRecipeCost(recipes[0]);
        if (!recipeCost || !recipeCost.totalResources) {
            this.recipeCostCache.set(cacheKey, null);
            return null;
        }

        const normalizedResources = {};
        Object.entries(recipeCost.totalResources).forEach(([resource, amount]) => {
            if (typeof amount === 'number' && !Number.isNaN(amount)) {
                normalizedResources[resource] = (normalizedResources[resource] || 0) + amount;
            }
        });

        const cacheEntry = {
            resources: normalizedResources,
            time: recipeCost.totalTime || 0
        };

        this.recipeCostCache.set(cacheKey, cacheEntry);
        return cacheEntry;
    }

    calculateConfigResourceSummary() {
        const totals = new Map();

        this.ships.forEach(ship => {
            const configurations = Array.isArray(ship?.configurations) ? ship.configurations : [];
            configurations.forEach(config => {
                const entry = totals.get(config.name) || {
                    configCount: 0,
                    componentCount: 0
                };

                entry.configCount += 1;

                const componentIds = this.collectComponentIds(config);
                entry.componentCount += componentIds.length;

                totals.set(config.name, entry);
            });
        });

        const rows = Array.from(totals.entries()).map(([configName, data]) => {
            return {
                configName,
                configCount: data.configCount,
                componentCount: data.componentCount
            };
        }).sort((a, b) => {
            if (b.configCount !== a.configCount) return b.configCount - a.configCount;
            if (b.componentCount !== a.componentCount) return b.componentCount - a.componentCount;
            return a.configName.localeCompare(b.configName);
        });

        return { rows };
    }

    getConfigResourceTotals(configName) {
        if (!configName) return null;
        if (!this.componentDataLoaded || !this.recipeLookup || !this.recipeLookup.recipesLoaded) {
            return null;
        }

        if (this.configResourceTotalsCache.has(configName)) {
            return this.configResourceTotalsCache.get(configName);
        }

        let configCount = 0;
        let componentCount = 0;
        let evaluatedComponents = 0;
        let missingRecipes = 0;
        const resourceMap = new Map();

        this.ships.forEach(ship => {
            const configurations = Array.isArray(ship?.configurations) ? ship.configurations : [];
            configurations.forEach(config => {
                if (config.name !== configName) {
                    return;
                }

                configCount += 1;
                const componentIds = this.collectComponentIds(config);
                componentCount += componentIds.length;

                componentIds.forEach(componentId => {
                    evaluatedComponents += 1;
                    const cost = this.getResourceCostForComponent(componentId);
                    if (!cost) {
                        missingRecipes += 1;
                        return;
                    }

                    Object.entries(cost.resources).forEach(([resource, amount]) => {
                        resourceMap.set(resource, (resourceMap.get(resource) || 0) + amount);
                    });
                });
            });
        });

        const resources = Array.from(resourceMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([resource, amount]) => ({ resource, amount }));
        const totalQuantity = resources.reduce((sum, entry) => sum + entry.amount, 0);

        const result = {
            configName,
            configCount,
            componentCount,
            totalQuantity,
            resources,
            missingRecipes,
            evaluatedComponents
        };

        this.configResourceTotalsCache.set(configName, result);
        return result;
    }

    showConfigResourceBreakdown(configName) {
        if (!configName) return;

        if (!this.componentDataLoaded) {
            alert('Component metadata has not finished loading yet. Please try again shortly.');
            return;
        }

        if (!this.recipeLookup || !this.recipeLookup.recipesLoaded) {
            alert('Recipe data is still loading. Please try again once recipes are available.');
            return;
        }

        const totals = this.getConfigResourceTotals(configName);
        if (!totals) {
            alert('Unable to calculate resource totals for this configuration.');
            return;
        }

        // Refresh the analytics table so the cached total appears
        this.renderAnalytics();

        if (this.activeResourceOverlay) {
            this.activeResourceOverlay.remove();
            this.activeResourceOverlay = null;
        }

        const overlay = document.createElement('div');
        overlay.className = 'stat-details-overlay';

        const modal = document.createElement('div');
        modal.className = 'stat-details-modal resource-breakdown-modal';

        const resourceRows = totals.resources.length > 0
            ? totals.resources.map(entry => `
                <tr>
                    <td>${this.escapeHtml(entry.resource)}</td>
                    <td>${entry.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                </tr>
            `).join('')
            : '<tr><td colspan="2">No raw resource inputs found for this configuration.</td></tr>';

        const noteMessage = totals.missingRecipes > 0
            ? `⚠️ ${totals.missingRecipes.toLocaleString()} component slots were missing recipe data and are excluded.`
            : '✅ All component recipes were resolved for this calculation.';

        modal.innerHTML = `
            <div class="stat-details-header">
                <h2>Raw Inputs: ${this.escapeHtml(configName)}</h2>
                <button type="button" class="close-button" aria-label="Close">&times;</button>
            </div>
            <div class="stat-details-body">
                <div class="resource-breakdown-summary">
                    <div><span class="metric-label">Configurations:</span> ${totals.configCount.toLocaleString()}</div>
                    <div><span class="metric-label">Components Evaluated:</span> ${totals.componentCount.toLocaleString()}</div>
                    <div><span class="metric-label">Total Raw Inputs:</span> ${totals.totalQuantity.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
                <div class="resource-breakdown-note">${this.escapeHtml(noteMessage)}</div>
                <div class="resource-breakdown-table-wrapper">
                    <table class="resource-breakdown-table">
                        <thead>
                            <tr>
                                <th>Resource</th>
                                <th>Total Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${resourceRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        this.activeResourceOverlay = overlay;

        const closeOverlay = () => {
            if (this.activeResourceOverlay) {
                this.activeResourceOverlay.remove();
                this.activeResourceOverlay = null;
            }
        };

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeOverlay();
            }
        });

        const closeButton = modal.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', closeOverlay);
        }
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
        console.log('[showStatDetails] rawEffects:', rawEffects);
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
                                        <td>${entry.additiveTotal ? this.formatSignedValue(entry.additiveTotal) : '�'}</td>
                                        <td>${entry.multiplierBonus ? this.formatPercentage(entry.multiplierBonus) : '�'}</td>
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
                                <li class="component-item">
                                    <div>
                                        <span class="component-name">${this.escapeHtml(effect.componentName || effect.groupName || 'Component')}</span>
                                        <span class="component-meta">
                                            ${this.escapeHtml(effect.category || '')}${effect.componentType ? ` &middot; ${this.escapeHtml(effect.componentType)}` : ''}
                                            ${effect.className || effect.tierName ? ` &middot; ${[effect.className, effect.tierName].filter(Boolean).join(' ')}` : ''}
                                        </span>
                                    </div>
                                    ${effect.componentType && effect.className ? `
                                        <button class="view-recipe-btn"
                                                data-component-type="${this.escapeAttribute(effect.componentType)}"
                                                data-component-class="${this.escapeAttribute(effect.className)}"
                                                data-component-tier="${this.escapeAttribute(effect.tierName || '')}"
                                                title="View crafting recipes">
                                            📋 Recipe
                                        </button>
                                    ` : ''}
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

        // Add event listeners for recipe buttons
        modal.querySelectorAll('.view-recipe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const componentType = btn.dataset.componentType;
                const componentClass = btn.dataset.componentClass;
                const componentTier = btn.dataset.componentTier;
                this.showRecipeCosts(componentType, componentClass, componentTier);
            });
        });
    }

    hideStatDetails() {
        if (this.activeDetailOverlay && this.activeDetailOverlay.parentNode) {
            this.activeDetailOverlay.parentNode.removeChild(this.activeDetailOverlay);
        }
        this.activeDetailOverlay = null;
    }

    async showRecipeCosts(componentType, componentClass, componentTier) {
        if (!this.recipeLookup) {
            alert('Recipe lookup not initialized.');
            return;
        }

        // Wait for recipes to load if not loaded yet
        if (!this.recipeLookup.recipesLoaded) {
            console.log('[showRecipeCosts] Waiting for recipes to load...');
            await this.recipeLookup.loadRecipes();

            // Retry a few times if still not loaded
            let retries = 0;
            while (!this.recipeLookup.recipesLoaded && retries < 5) {
                await new Promise(resolve => setTimeout(resolve, 500));
                retries++;
            }

            if (!this.recipeLookup.recipesLoaded) {
                alert('Recipe data failed to load. Please refresh the page.');
                return;
            }
        }

        // Find the specific tier recipe
        const recipes = this.recipeLookup.findComponentRecipes(componentType, componentClass, componentTier);

        if (recipes.length === 0) {
            console.error('❌ No recipes found for:', componentType, componentClass, componentTier);
            console.log('Available recipes:', this.recipeLookup.recipes.slice(0, 10).map(r => r.outputName));
            alert(`No recipes found for ${componentType} ${componentClass} ${componentTier}`);
            return;
        }

        const recipe = recipes[0];
        const allTierRecipes = [{ tier: componentTier, recipes: [recipe] }];

        const overlay = document.createElement('div');
        overlay.className = 'stat-details-overlay';

        const modal = document.createElement('div');
        modal.className = 'stat-details-modal recipe-modal';

        modal.innerHTML = `
            <div class="stat-details-header">
                <h2>Recipe Costs: ${this.escapeHtml(componentType)} ${this.escapeHtml(componentClass)}</h2>
                <button type="button" class="close-button">&times;</button>
            </div>
            <div class="stat-details-body">
                ${allTierRecipes.map(tierData => {
                    const tier = tierData.tier;
                    const recipe = tierData.recipes[0]; // Get first recipe for this tier
                    const costs = this.recipeLookup.calculateRecipeCost(recipe);

                    return `
                        <div class="recipe-tier-section">
                            <h3>${tier}</h3>
                            <div class="recipe-summary">
                                <p><strong>Construction Time:</strong> ${this.recipeLookup.formatTime(recipe.constructionTime)}</p>
                                <p><strong>Production Steps:</strong> ${recipe.productionSteps || 0}</p>
                            </div>
                            <div class="recipe-ingredients">
                                <h4>Direct Ingredients (${recipe.ingredients?.length || 0})</h4>
                                <ul>
                                    ${(recipe.ingredients || []).map(ing => `
                                        <li>${this.escapeHtml(ing.name)}: ${ing.quantity}</li>
                                    `).join('')}
                                </ul>
                            </div>
                            ${costs && Object.keys(costs.totalResources).length > 0 ? `
                                <div class="recipe-total-resources">
                                    <h4>Total Resources Required (${Object.keys(costs.totalResources).length})</h4>
                                    <ul>
                                        ${Object.entries(costs.totalResources)
                                            .sort((a, b) => b[1] - a[1])
                                            .map(([resource, amount]) => `
                                                <li>${this.escapeHtml(resource)}: ${Math.ceil(amount)}</li>
                                            `).join('')}
                                    </ul>
                                    <p><strong>Total Time (including sub-recipes):</strong> ${this.recipeLookup.formatTime(costs.totalTime)}</p>
                                </div>
                            ` : ''}
                            <div class="recipe-actions">
                                <a href="${this.recipeLookup.getRecipeExplorerUrl(recipe.outputName)}"
                                   target="_blank"
                                   class="recipe-explorer-link">
                                    View in Recipe Explorer →
                                </a>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const close = () => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        };

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
        modal.querySelector('.close-button').addEventListener('click', close);
    }

    formatPercentage(value) {
        if (value === null || value === undefined || Number.isNaN(value)) return '�';
        return `${(value * 100).toFixed(1)}%`;
    }

    formatSignedValue(value) {
        if (value === null || value === undefined || Number.isNaN(value)) return '�';
        const sign = value >= 0 ? '+' : '-';
        return `${sign}${this.formatStatValue(Math.abs(value))}`;
    }

    formatSignedPercent(value) {
        if (value === null || value === undefined || Number.isNaN(value)) return '�';
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












