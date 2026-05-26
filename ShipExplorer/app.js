/**
 * Ship Explorer - Configuration Comparison Tool
 * Applies Ship Config Lite component logic to multi-ship comparisons.
 */

class ShipExplorer {
    constructor() {
        this.ships = [];
        this.shipData = null;
        this.selectedShips = new Set();
        this.selectedConfigurations = new Set(); // Set of "shipId::configName" strings
        this.configSelections = [{}, {}, {}, {}]; // keyed by shipId
        this.currentTab = 'explorer';
        this.viewMode = 'ships'; // 'ships' or 'configurations'
        this.searchTerm = '';

        // Analytics table filters
        this.analyticsFilters = {
            ship: '',
            configuration: '',
            components: '',
            totalRawInputs: ''
        };

        // Pagination
        this.analyticsCurrentPage = 1;
        this.analyticsPageSize = 50;

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

        // View mode toggle
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                this.switchViewMode(event.target.dataset.mode);
            });
        });

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                this.handleSearch(event.target.value);
            });
        }
    }

    switchViewMode(mode) {
        this.viewMode = mode;

        // Play tab switch sound
        if (window.spaceSounds) window.spaceSounds.tabSwitch();

        // Update button states
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Update sidebar title
        const title = document.getElementById('sidebarTitle');
        if (title) {
            title.textContent = mode === 'ships' ? '🚀 Ships' : '⚙️ Configurations';
        }

        // Update search placeholder
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.placeholder = mode === 'ships' ? 'Search ships...' : 'Search configurations...';
        }

        this.renderCheckboxes();

        // Update main content area based on mode
        if (mode === 'configurations') {
            this.renderConfigurationDetails();
        } else {
            this.renderComparison();
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

    matchesConfigSearch(ship, config) {
        if (!this.searchTerm) return true;

        // Search by ship name/manufacturer should return ALL configs for that ship
        const shipTokens = [
            ship?.name,
            ship?.manufacturer,
            ship?.sizeTier
        ].filter(Boolean).join(' ').toLowerCase();

        if (shipTokens.includes(this.searchTerm)) {
            return true; // Return all configs if ship matches
        }

        // Otherwise search by config name specifically
        const configName = (config?.name || '').toLowerCase();
        return configName.includes(this.searchTerm);
    }

    renderCheckboxes() {
        if (this.viewMode === 'ships') {
            this.renderShipsCheckboxes();
        } else {
            this.renderConfigurationsCheckboxes();
        }
    }

    renderShipsCheckboxes() {
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

        // Group ships into collapsible sections by size tier
        const SIZE_ORDER = ['XXS', 'XS', 'Small', 'Medium', 'Large', 'Capital', 'Commander', 'Class 8', 'Titan'];
        const groups = new Map();
        filtered.forEach(entry => {
            const size = entry.ship?.sizeTier || 'Other';
            if (!groups.has(size)) groups.set(size, []);
            groups.get(size).push(entry);
        });

        const orderedSizes = [
            ...SIZE_ORDER.filter(s => groups.has(s)),
            ...Array.from(groups.keys()).filter(s => !SIZE_ORDER.includes(s)).sort()
        ];

        orderedSizes.forEach(size => {
            const entries = groups.get(size);

            const details = document.createElement('details');
            details.className = 'collapsible-group';

            const summary = document.createElement('summary');
            summary.className = 'collapsible-group-title';
            summary.textContent = `${size} (${entries.length})`;
            details.appendChild(summary);

            let hasSelected = false;
            entries.forEach(({ ship, index }) => {
                const div = document.createElement('div');
                div.className = 'checkbox-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `ship-${index}`;
                checkbox.checked = this.selectedShips.has(index);
                if (checkbox.checked) hasSelected = true;
                checkbox.addEventListener('change', () => {
                    this.toggleShip(index);
                });

                const label = document.createElement('label');
                label.htmlFor = `ship-${index}`;
                label.textContent = this.getShipDisplayName(ship);

                div.appendChild(checkbox);
                div.appendChild(label);
                details.appendChild(div);
            });

            // Expand groups while searching, or when they contain a selected ship
            if (this.searchTerm || hasSelected) details.open = true;

            container.appendChild(details);
        });
    }

    renderConfigurationsCheckboxes() {
        const container = document.getElementById('shipCheckboxes');
        if (!container) return;

        container.innerHTML = '';

        // Collect matching configurations grouped by size tier -> ship
        const SIZE_ORDER = ['XXS', 'XS', 'Small', 'Medium', 'Large', 'Capital', 'Commander', 'Class 8', 'Titan'];
        const bySize = new Map(); // size -> Map(shipId -> { ship, configs: [] })

        this.ships.forEach(ship => {
            if (!Array.isArray(ship.configurations)) return;

            const matching = ship.configurations.filter(config =>
                config.name &&
                config.name.toLowerCase() !== 'default' &&
                this.matchesConfigSearch(ship, config)
            );
            if (matching.length === 0) return;

            const size = ship.sizeTier || 'Other';
            if (!bySize.has(size)) bySize.set(size, new Map());
            bySize.get(size).set(ship.id, { ship, configs: matching });
        });

        if (bySize.size === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent = 'No configurations match your search.';
            container.appendChild(empty);
            return;
        }

        const orderedSizes = [
            ...SIZE_ORDER.filter(s => bySize.has(s)),
            ...Array.from(bySize.keys()).filter(s => !SIZE_ORDER.includes(s)).sort()
        ];

        orderedSizes.forEach(size => {
            const ships = bySize.get(size);
            const configCount = Array.from(ships.values()).reduce((n, e) => n + e.configs.length, 0);

            const sizeDetails = document.createElement('details');
            sizeDetails.className = 'collapsible-group';

            const sizeSummary = document.createElement('summary');
            sizeSummary.className = 'collapsible-group-title';
            sizeSummary.textContent = `${size} (${configCount})`;
            sizeDetails.appendChild(sizeSummary);

            let sizeHasSelected = false;

            const shipEntries = Array.from(ships.values())
                .sort((a, b) => (a.ship.name || '').localeCompare(b.ship.name || ''));

            shipEntries.forEach(({ ship, configs }) => {
                const shipDetails = document.createElement('details');
                shipDetails.className = 'collapsible-group collapsible-subgroup';

                const shipSummary = document.createElement('summary');
                shipSummary.className = 'collapsible-group-title collapsible-subgroup-title';
                shipSummary.textContent = `${ship.manufacturer || 'Unknown'} ${ship.name || 'Ship'} (${configs.length})`;
                shipDetails.appendChild(shipSummary);

                let shipHasSelected = false;

                configs.forEach(config => {
                    const configKey = `${ship.id}::${config.name}`;

                    const div = document.createElement('div');
                    div.className = 'checkbox-item';

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `config-${configKey}`;
                    checkbox.checked = this.selectedConfigurations.has(configKey);
                    if (checkbox.checked) { shipHasSelected = true; sizeHasSelected = true; }
                    checkbox.addEventListener('change', () => {
                        this.toggleConfiguration(configKey, ship, config);
                    });

                    const label = document.createElement('label');
                    label.htmlFor = `config-${configKey}`;
                    label.textContent = config.name || 'Unnamed Configuration';

                    div.appendChild(checkbox);
                    div.appendChild(label);
                    shipDetails.appendChild(div);
                });

                if (this.searchTerm || shipHasSelected) shipDetails.open = true;
                sizeDetails.appendChild(shipDetails);
            });

            if (this.searchTerm || sizeHasSelected) sizeDetails.open = true;
            container.appendChild(sizeDetails);
        });
    }

    renderComponentsList(config) {
        const listDiv = document.createElement('div');
        listDiv.className = 'config-components-list expanded';

        const components = this.getAllComponentsFromConfig(config);

        if (components.length === 0) {
            const noComponents = document.createElement('div');
            noComponents.className = 'component-list-item';
            noComponents.textContent = 'No components in this configuration';
            listDiv.appendChild(noComponents);
            return listDiv;
        }

        components.forEach(comp => {
            const compItem = document.createElement('div');
            compItem.className = 'component-list-item';

            const idSpan = document.createElement('span');
            idSpan.className = 'component-id';
            idSpan.textContent = `#${comp.componentId}`;

            const detailsSpan = document.createElement('span');
            detailsSpan.className = 'component-details';

            const parts = [comp.componentName];
            if (comp.className) parts.push(comp.className);
            if (comp.tierName) parts.push(comp.tierName);

            detailsSpan.textContent = parts.join(' • ');

            compItem.appendChild(idSpan);
            compItem.appendChild(detailsSpan);
            listDiv.appendChild(compItem);
        });

        return listDiv;
    }

    toggleConfiguration(configKey, ship, config) {
        if (this.selectedConfigurations.has(configKey)) {
            this.selectedConfigurations.delete(configKey);
        } else {
            this.selectedConfigurations.add(configKey);
        }

        this.renderCheckboxes();
        this.renderConfigurationDetails();
    }

    renderConfigurationDetails() {
        const wrapper = document.getElementById('comparisonTableWrapper');
        if (!wrapper) return;

        if (this.selectedConfigurations.size === 0) {
            wrapper.innerHTML = '<div class="empty-state">Select configurations from the list to view their details.</div>';
            return;
        }

        // Get selected configurations with their ship info
        const selectedConfigs = [];
        this.selectedConfigurations.forEach(configKey => {
            const [shipId, configName] = configKey.split('::');
            const ship = this.shipMap.get(shipId) || this.ships.find(s => s.id === shipId);
            if (!ship) return;

            const config = ship.configurations?.find(c => c.name === configName);
            if (!config) return;

            selectedConfigs.push({ ship, config, configKey });
        });

        if (selectedConfigs.length === 0) {
            wrapper.innerHTML = '<div class="empty-state">No valid configurations selected.</div>';
            return;
        }

        // Build the details view
        let html = '<div class="config-details-container">';

        selectedConfigs.forEach(({ ship, config }) => {
            const components = this.getAllComponentsFromConfig(config);
            const componentsByCategory = this.groupComponentsByCategory(components);

            html += `
                <div class="config-detail-card">
                    <div class="config-detail-header">
                        <h3>${this.escapeHtml(config.name || 'Unnamed Configuration')}</h3>
                        <div class="config-ship-info">
                            ${this.escapeHtml(ship.manufacturer || 'Unknown')} ${this.escapeHtml(ship.name || 'Ship')}
                            ${ship.sizeTier ? `<span class="size-tier-badge">${this.escapeHtml(ship.sizeTier)}</span>` : ''}
                        </div>
                    </div>
                    <div class="config-detail-body">
                        <div class="config-summary">
                            <div class="summary-stat">
                                <span class="summary-label">Total Components:</span>
                                <span class="summary-value">${components.length}</span>
                            </div>
                            <div class="summary-stat">
                                <span class="summary-label">Categories:</span>
                                <span class="summary-value">${Object.keys(componentsByCategory).length}</span>
                            </div>
                        </div>
                        ${this.renderComponentsByCategory(componentsByCategory)}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        wrapper.innerHTML = html;

        // Add event listeners for recipe buttons
        wrapper.querySelectorAll('.mini-recipe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const componentType = btn.dataset.componentType;
                const componentClass = btn.dataset.componentClass;
                const componentTier = btn.dataset.componentTier;
                this.showRecipeCosts(componentType, componentClass, componentTier);
            });
        });
    }

    groupComponentsByCategory(components) {
        const grouped = {};
        components.forEach(comp => {
            const category = comp.category || 'Uncategorized';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(comp);
        });
        return grouped;
    }

    renderComponentsByCategory(componentsByCategory) {
        let html = '<div class="components-by-category">';

        Object.entries(componentsByCategory).forEach(([category, components]) => {
            html += `
                <div class="category-section">
                    <h4 class="category-title">${this.escapeHtml(category)} (${components.length})</h4>
                    <div class="category-components">
            `;

            components.forEach(comp => {
                const hasRecipe = comp.componentType && comp.className;
                html += `
                    <div class="component-detail-item">
                        <div class="component-main-info">
                            <span class="component-id-badge">#${comp.componentId}</span>
                            <span class="component-name-text">${this.escapeHtml(comp.componentName)}</span>
                        </div>
                        <div class="component-meta-info">
                            ${comp.componentType ? `<span class="meta-type">${this.escapeHtml(comp.componentType)}</span>` : ''}
                            ${comp.className ? `<span class="meta-class">${this.escapeHtml(comp.className)}</span>` : ''}
                            ${comp.tierName ? `<span class="meta-tier">${this.escapeHtml(comp.tierName)}</span>` : ''}
                        </div>
                        ${hasRecipe ? `
                            <button class="mini-recipe-btn"
                                    data-component-type="${this.escapeAttribute(comp.componentType)}"
                                    data-component-class="${this.escapeAttribute(comp.className)}"
                                    data-component-tier="${this.escapeAttribute(comp.tierName || '')}"
                                    title="View recipe">
                                📋
                            </button>
                        ` : ''}
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
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

        // Play tab switch sound
        if (window.spaceSounds) window.spaceSounds.tabSwitch();

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

        const resourcesSection = this.buildConfigResourceAnalyticsSection();

        container.innerHTML = resourcesSection;

        // Attach event listeners to filter inputs and pagination
        this.attachAnalyticsFilterListeners();
        this.attachPaginationListeners();
    }

    attachAnalyticsFilterListeners() {
        const filterShip = document.getElementById('filterShip');
        const filterConfiguration = document.getElementById('filterConfiguration');
        const filterComponents = document.getElementById('filterComponents');
        const filterTotalRawInputs = document.getElementById('filterTotalRawInputs');
        const clearFiltersBtn = document.getElementById('clearAnalyticsFilters');

        // Apply filter on Enter key press only
        const applyFilterOnEnter = (e, filterProperty) => {
            if (e.key === 'Enter') {
                this.analyticsFilters[filterProperty] = e.target.value;
                this.analyticsCurrentPage = 1; // Reset to first page when filtering
                this.renderAnalytics();
            }
        };

        if (filterShip) {
            filterShip.addEventListener('keydown', (e) => applyFilterOnEnter(e, 'ship'));
        }

        if (filterConfiguration) {
            filterConfiguration.addEventListener('keydown', (e) => applyFilterOnEnter(e, 'configuration'));
        }

        if (filterComponents) {
            filterComponents.addEventListener('keydown', (e) => applyFilterOnEnter(e, 'components'));
        }

        if (filterTotalRawInputs) {
            filterTotalRawInputs.addEventListener('keydown', (e) => applyFilterOnEnter(e, 'totalRawInputs'));
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.analyticsFilters.ship = '';
                this.analyticsFilters.configuration = '';
                this.analyticsFilters.components = '';
                this.analyticsFilters.totalRawInputs = '';

                // Clear the input field values
                if (filterShip) filterShip.value = '';
                if (filterConfiguration) filterConfiguration.value = '';
                if (filterComponents) filterComponents.value = '';
                if (filterTotalRawInputs) filterTotalRawInputs.value = '';

                this.analyticsCurrentPage = 1; // Reset to first page when clearing filters
                this.renderAnalytics();
            });
        }
    }

    attachPaginationListeners() {
        const firstPageBtn = document.getElementById('firstPage');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const lastPageBtn = document.getElementById('lastPage');

        if (firstPageBtn) {
            firstPageBtn.addEventListener('click', () => {
                this.analyticsCurrentPage = 1;
                this.renderAnalytics();
            });
        }

        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                if (this.analyticsCurrentPage > 1) {
                    this.analyticsCurrentPage--;
                    this.renderAnalytics();
                }
            });
        }

        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                // Calculate total pages based on filtered results
                const filteredRows = this.getFilteredConfigRows();
                const totalPages = Math.ceil(filteredRows.length / this.analyticsPageSize);

                if (this.analyticsCurrentPage < totalPages) {
                    this.analyticsCurrentPage++;
                    this.renderAnalytics();
                }
            });
        }

        if (lastPageBtn) {
            lastPageBtn.addEventListener('click', () => {
                // Calculate total pages based on filtered results
                const filteredRows = this.getFilteredConfigRows();
                const totalPages = Math.ceil(filteredRows.length / this.analyticsPageSize);

                this.analyticsCurrentPage = totalPages;
                this.renderAnalytics();
            });
        }
    }

    getFilteredConfigRows() {
        // Extract the filtering logic to reuse it
        const allRows = [];

        this.ships.forEach(ship => {
            if (!ship || !ship.configurations) return;

            Object.entries(ship.configurations).forEach(([configName, config]) => {
                if (!config) return;

                const componentIds = this.collectComponentIds(config);
                allRows.push({
                    shipName: ship.name,
                    configName,
                    componentCount: componentIds.length,
                    shipId: ship.id,
                    config
                });
            });
        });

        // Apply filters
        const shipFilter = this.analyticsFilters.ship.toLowerCase();
        const configFilter = this.analyticsFilters.configuration.toLowerCase();
        const componentsFilter = this.analyticsFilters.components.toLowerCase();
        const totalRawInputsFilter = this.analyticsFilters.totalRawInputs.toLowerCase();

        return allRows.filter(row => {
            if (shipFilter && !row.shipName.toLowerCase().includes(shipFilter)) {
                return false;
            }
            if (configFilter && !row.configName.toLowerCase().includes(configFilter)) {
                return false;
            }
            if (componentsFilter && !row.componentCount.toString().includes(componentsFilter)) {
                return false;
            }
            // Note: totalRawInputsFilter would require computing the resources, which is expensive
            // For now, we'll skip this filter in the extraction method
            return true;
        });
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

        // Apply filters
        const filteredRows = summary.rows.filter(row => {
            const cacheKey = `${row.shipId}::${row.configName}`;
            const cachedTotals = this.configResourceTotalsCache.get(cacheKey);

            const shipDisplayName = row.manufacturer
                ? `${row.manufacturer} ${row.shipName} ${row.sizeTier || ''}`
                : `${row.shipName} ${row.sizeTier || ''}`;

            // Filter by ship
            if (this.analyticsFilters.ship && !shipDisplayName.toLowerCase().includes(this.analyticsFilters.ship.toLowerCase())) {
                return false;
            }

            // Filter by configuration
            if (this.analyticsFilters.configuration && !row.configName.toLowerCase().includes(this.analyticsFilters.configuration.toLowerCase())) {
                return false;
            }

            // Filter by components count
            if (this.analyticsFilters.components) {
                const searchTerm = this.analyticsFilters.components.toLowerCase();
                if (!row.componentCount.toString().includes(searchTerm)) {
                    return false;
                }
            }

            // Filter by total raw inputs
            if (this.analyticsFilters.totalRawInputs && cachedTotals) {
                const searchTerm = this.analyticsFilters.totalRawInputs.toLowerCase();
                const totalStr = cachedTotals.totalQuantity.toLocaleString(undefined, { maximumFractionDigits: 2 });
                if (!totalStr.toLowerCase().includes(searchTerm)) {
                    return false;
                }
            }

            return true;
        });

        // Apply pagination
        const totalPages = Math.ceil(filteredRows.length / this.analyticsPageSize);
        const startIndex = (this.analyticsCurrentPage - 1) * this.analyticsPageSize;
        const endIndex = startIndex + this.analyticsPageSize;
        const paginatedRows = filteredRows.slice(startIndex, endIndex);

        const rowsHtml = paginatedRows.map(row => {
            const cacheKey = `${row.shipId}::${row.configName}`;
            const cachedTotals = this.configResourceTotalsCache.get(cacheKey);
            const totalCell = cachedTotals
                ? cachedTotals.totalQuantity.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : '<span class="analytics-hint">Click to calculate</span>';
            const buttonLabel = cachedTotals ? 'View Again' : 'View Raw Inputs';

            const shipDisplayName = row.manufacturer
                ? `${this.escapeHtml(row.manufacturer)} ${this.escapeHtml(row.shipName)}`
                : this.escapeHtml(row.shipName);

            return `
                <tr>
                    <td>${shipDisplayName}${row.sizeTier ? ` <span class="tier-badge">${this.escapeHtml(row.sizeTier)}</span>` : ''}</td>
                    <td>${this.escapeHtml(row.configName)}</td>
                    <td>${row.componentCount.toLocaleString()}</td>
                    <td>${totalCell}</td>
                    <td class="action-cell">
                        <button
                            type="button"
                            class="view-resource-btn"
                            onclick="window.shipExplorer.showShipConfigResourceBreakdown('${this.escapeAttribute(row.shipId)}', '${this.escapeAttribute(row.configName)}')"
                        >
                            ${buttonLabel}
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        const filterActive = this.analyticsFilters.ship || this.analyticsFilters.configuration ||
                             this.analyticsFilters.components || this.analyticsFilters.totalRawInputs;

        // Pagination controls
        const paginationHtml = totalPages > 1 ? `
            <div class="pagination-controls">
                <button type="button" class="pagination-btn" id="firstPage" ${this.analyticsCurrentPage === 1 ? 'disabled' : ''}>⏮️ First</button>
                <button type="button" class="pagination-btn" id="prevPage" ${this.analyticsCurrentPage === 1 ? 'disabled' : ''}>◀️ Prev</button>
                <span class="pagination-info">Page ${this.analyticsCurrentPage} of ${totalPages} (${startIndex + 1}-${Math.min(endIndex, filteredRows.length)} of ${filteredRows.length})</span>
                <button type="button" class="pagination-btn" id="nextPage" ${this.analyticsCurrentPage === totalPages ? 'disabled' : ''}>Next ▶️</button>
                <button type="button" class="pagination-btn" id="lastPage" ${this.analyticsCurrentPage === totalPages ? 'disabled' : ''}>Last ⏭️</button>
            </div>
        ` : '';

        const filterInfoHtml = filterActive
            ? `<div class="analytics-note" style="color: var(--accent-cyan); display: flex; align-items: center; gap: 1rem;">
                <span>📊 Showing ${filteredRows.length} of ${summary.rows.length} configurations</span>
                <button type="button" class="clear-filters-btn" id="clearAnalyticsFilters" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">Clear Filters</button>
               </div>`
            : '';

        const noteHtml = `
            <div class="analytics-note">
                ℹ️ Totals are calculated on-demand. Click a configuration to compute the complete raw input breakdown.
            </div>
        `;

        return `
            <div class="analytics-section">
                <h3>Configuration Resource Totals</h3>
                <p>Spot-check resource requirements per ship configuration without incurring up-front processing costs.</p>
                ${filterInfoHtml}
                <div class="analytics-table-wrapper">
                    <table class="analytics-table" id="configResourceTable">
                        <thead>
                            <tr>
                                <th>Ship</th>
                                <th>Configuration</th>
                                <th>Components</th>
                                <th>Total Raw Inputs</th>
                                <th></th>
                            </tr>
                            <tr class="filter-row">
                                <th>
                                    <input
                                        type="text"
                                        class="analytics-filter-input"
                                        id="filterShip"
                                        placeholder="Filter ships..."
                                        value="${this.escapeAttribute(this.analyticsFilters.ship)}"
                                    />
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        class="analytics-filter-input"
                                        id="filterConfiguration"
                                        placeholder="Filter configs..."
                                        value="${this.escapeAttribute(this.analyticsFilters.configuration)}"
                                    />
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        class="analytics-filter-input"
                                        id="filterComponents"
                                        placeholder="Filter..."
                                        value="${this.escapeAttribute(this.analyticsFilters.components)}"
                                    />
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        class="analytics-filter-input"
                                        id="filterTotalRawInputs"
                                        placeholder="Filter..."
                                        value="${this.escapeAttribute(this.analyticsFilters.totalRawInputs)}"
                                    />
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
                ${paginationHtml}
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
        if (!recipeCost || !recipeCost.allMaterials) {
            this.recipeCostCache.set(cacheKey, null);
            return null;
        }

        const normalizedResources = {};
        // Use allMaterials instead of totalResources to show ALL materials (raw + intermediate)
        Object.entries(recipeCost.allMaterials).forEach(([resource, amount]) => {
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
        const rows = [];

        // Group configurations by ship
        this.ships.forEach(ship => {
            const configurations = Array.isArray(ship?.configurations) ? ship.configurations : [];
            configurations.forEach(config => {
                // Skip "Default" configurations
                if (config.name && config.name.toLowerCase() === 'default') {
                    return;
                }

                const componentIds = this.collectComponentIds(config);

                rows.push({
                    shipId: ship.id,
                    shipName: ship.name,
                    manufacturer: ship.manufacturer,
                    sizeTier: ship.sizeTier,
                    configName: config.name,
                    configCount: 1, // One config per row now
                    componentCount: componentIds.length
                });
            });
        });

        // Sort by ship name, then config name
        rows.sort((a, b) => {
            const shipCompare = (a.shipName || '').localeCompare(b.shipName || '');
            if (shipCompare !== 0) return shipCompare;
            return (a.configName || '').localeCompare(b.configName || '');
        });

        return { rows };
    }

    getShipConfigResourceTotals(shipId, configName) {
        if (!shipId || !configName) return null;
        if (!this.componentDataLoaded || !this.recipeLookup || !this.recipeLookup.recipesLoaded) {
            return null;
        }

        const cacheKey = `${shipId}::${configName}`;
        if (this.configResourceTotalsCache.has(cacheKey)) {
            return this.configResourceTotalsCache.get(cacheKey);
        }

        const ship = this.shipMap.get(shipId) || this.ships.find(s => s.id === shipId);
        if (!ship) return null;

        const config = ship.configurations?.find(c => c.name === configName);
        if (!config) return null;

        let componentCount = 0;
        let evaluatedComponents = 0;
        let missingRecipes = 0;
        const resourceMap = new Map();
        const missingComponentsMap = new Map();

        const componentIds = this.collectComponentIds(config);
        componentCount = componentIds.length;

        componentIds.forEach(componentId => {
            evaluatedComponents += 1;
            const cost = this.getResourceCostForComponent(componentId);
            if (!cost) {
                missingRecipes += 1;

                // Track which components are missing
                const componentKey = componentId.toString();
                const info = this.componentsById[componentKey];

                if (info) {
                    const missingKey = `${info.name}|${info.componentType || ''}|${info.className || ''}|${info.tierName || ''}`;
                    const existing = missingComponentsMap.get(missingKey);
                    if (existing) {
                        existing.count += 1;
                    } else {
                        missingComponentsMap.set(missingKey, {
                            id: componentId,
                            name: info.name,
                            componentType: info.componentType || 'Unknown',
                            className: info.className || '',
                            tierName: info.tierName || '',
                            count: 1
                        });
                    }
                } else {
                    // Component ID not found in lookup
                    const missingKey = `unknown-${componentId}`;
                    const existing = missingComponentsMap.get(missingKey);
                    if (existing) {
                        existing.count += 1;
                    } else {
                        missingComponentsMap.set(missingKey, {
                            id: componentId,
                            name: `Unknown (ID: ${componentId})`,
                            componentType: 'Unknown',
                            className: '',
                            tierName: '',
                            count: 1
                        });
                    }
                }
                return;
            }

            Object.entries(cost.resources).forEach(([resource, amount]) => {
                resourceMap.set(resource, (resourceMap.get(resource) || 0) + amount);
            });
        });

        const resources = Array.from(resourceMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([resource, amount]) => ({ resource, amount }));
        const totalQuantity = resources.reduce((sum, entry) => sum + entry.amount, 0);

        // Convert missing components map to sorted array
        const missingComponents = Array.from(missingComponentsMap.values())
            .sort((a, b) => b.count - a.count);

        const shipDisplayName = ship.manufacturer
            ? `${ship.manufacturer} ${ship.name}`
            : ship.name;

        const result = {
            shipId,
            shipName: shipDisplayName,
            configName,
            configCount: 1,
            componentCount,
            totalQuantity,
            resources,
            missingRecipes,
            evaluatedComponents,
            missingComponents
        };

        this.configResourceTotalsCache.set(cacheKey, result);
        return result;
    }

    // Keep old method for backwards compatibility
    getConfigResourceTotals(configName) {
        // This now aggregates all ships with this config name
        if (!configName) return null;
        if (!this.componentDataLoaded || !this.recipeLookup || !this.recipeLookup.recipesLoaded) {
            return null;
        }

        // Try to return cached value with old key format
        if (this.configResourceTotalsCache.has(configName)) {
            return this.configResourceTotalsCache.get(configName);
        }

        // Aggregate from all ships
        let configCount = 0;
        let componentCount = 0;
        let evaluatedComponents = 0;
        let missingRecipes = 0;
        const resourceMap = new Map();
        const missingComponentsMap = new Map();

        this.ships.forEach(ship => {
            const config = ship.configurations?.find(c => c.name === configName);
            if (!config) return;

            const totals = this.getShipConfigResourceTotals(ship.id, configName);
            if (!totals) return;

            configCount += 1;
            componentCount += totals.componentCount;
            evaluatedComponents += totals.evaluatedComponents;
            missingRecipes += totals.missingRecipes;

            totals.resources.forEach(({ resource, amount }) => {
                resourceMap.set(resource, (resourceMap.get(resource) || 0) + amount);
            });

            totals.missingComponents.forEach(comp => {
                const key = `${comp.name}|${comp.componentType}|${comp.className}|${comp.tierName}`;
                const existing = missingComponentsMap.get(key);
                if (existing) {
                    existing.count += comp.count;
                } else {
                    missingComponentsMap.set(key, { ...comp });
                }
            });
        });

        const resources = Array.from(resourceMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([resource, amount]) => ({ resource, amount }));
        const totalQuantity = resources.reduce((sum, entry) => sum + entry.amount, 0);

        const missingComponents = Array.from(missingComponentsMap.values())
            .sort((a, b) => b.count - a.count);

        const result = {
            configName,
            configCount,
            componentCount,
            totalQuantity,
            resources,
            missingRecipes,
            evaluatedComponents,
            missingComponents
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

        this.showResourceBreakdownModal(totals);
    }

    showShipConfigResourceBreakdown(shipId, configName) {
        if (!shipId || !configName) return;

        if (!this.componentDataLoaded) {
            alert('Component metadata has not finished loading yet. Please try again shortly.');
            return;
        }

        if (!this.recipeLookup || !this.recipeLookup.recipesLoaded) {
            alert('Recipe data is still loading. Please try again once recipes are available.');
            return;
        }

        const totals = this.getShipConfigResourceTotals(shipId, configName);
        if (!totals) {
            alert('Unable to calculate resource totals for this ship configuration.');
            return;
        }

        // Refresh the analytics table so the cached total appears
        this.renderAnalytics();

        this.showResourceBreakdownModal(totals);
    }

    showResourceBreakdownModal(totals) {
        // Play popup open sound
        if (window.spaceSounds) window.spaceSounds.openPopup();

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

        // Build missing components section
        const missingComponentsSection = (totals.missingComponents && totals.missingComponents.length > 0) ? `
            <div class="missing-components-section">
                <button type="button" class="missing-components-toggle" onclick="this.classList.toggle('expanded'); this.nextElementSibling.classList.toggle('expanded');">
                    <span class="toggle-icon">▶</span>
                    View Missing Components (${totals.missingComponents.length} unique types, ${totals.missingRecipes} total slots)
                </button>
                <div class="missing-components-details">
                    <table class="missing-components-table">
                        <thead>
                            <tr>
                                <th>Component Name</th>
                                <th>Type</th>
                                <th>Class</th>
                                <th>Tier</th>
                                <th>Occurrences</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${totals.missingComponents.map(comp => `
                                <tr>
                                    <td>${this.escapeHtml(comp.name)}</td>
                                    <td>${this.escapeHtml(comp.componentType)}</td>
                                    <td>${this.escapeHtml(comp.className || '—')}</td>
                                    <td>${this.escapeHtml(comp.tierName || '—')}</td>
                                    <td>${comp.count.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        ` : '';

        // Build title based on whether we have ship name
        const title = totals.shipName
            ? `Raw Inputs: ${this.escapeHtml(totals.shipName)} - ${this.escapeHtml(totals.configName)}`
            : `Raw Inputs: ${this.escapeHtml(totals.configName)}`;

        // Build summary - hide "Configurations" count for single ship+config view
        const summaryItems = [];
        if (totals.configCount > 1) {
            summaryItems.push(`<div><span class="metric-label">Configurations:</span> ${totals.configCount.toLocaleString()}</div>`);
        }
        summaryItems.push(`<div><span class="metric-label">Components Evaluated:</span> ${totals.componentCount.toLocaleString()}</div>`);
        summaryItems.push(`<div><span class="metric-label">Total Raw Inputs:</span> ${totals.totalQuantity.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>`);

        modal.innerHTML = `
            <div class="stat-details-header">
                <h2>${title}</h2>
                <button type="button" class="close-button" aria-label="Close">&times;</button>
            </div>
            <div class="stat-details-body">
                <div class="resource-breakdown-summary">
                    ${summaryItems.join('')}
                </div>
                <div class="resource-breakdown-note">${this.escapeHtml(noteMessage)}</div>
                ${missingComponentsSection}
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
            if (window.spaceSounds) window.spaceSounds.closePopup();
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

    getAllComponentsFromConfig(config) {
        if (!config || !config.components) return [];

        const allComponents = [];
        const components = config.components;

        // Iterate through all categories
        Object.entries(components).forEach(([category, componentTypes]) => {
            if (!componentTypes) return;

            // Iterate through all component types within this category
            Object.entries(componentTypes).forEach(([componentType, value]) => {
                if (!value) return;

                let items = [];

                // Handle different data structures
                if (Array.isArray(value)) {
                    items = value.filter(Boolean);
                } else if (value.items && Array.isArray(value.items)) {
                    items = value.items.filter(Boolean);
                } else if (typeof value === 'number' || typeof value === 'string') {
                    items = [value];
                }

                // For each component ID, look up its details
                items.forEach(componentId => {
                    const componentKey = componentId.toString();
                    const info = this.componentsById[componentKey];

                    if (info) {
                        allComponents.push({
                            componentId,
                            componentName: info.name || componentType,
                            category,
                            componentType,
                            className: info.className,
                            tierName: info.tierName
                        });
                    } else {
                        // Even if we don't have info, add it with basic details
                        allComponents.push({
                            componentId,
                            componentName: componentType,
                            category,
                            componentType,
                            className: null,
                            tierName: null
                        });
                    }
                });
            });
        });

        return allComponents;
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

        // Get ALL components from the configuration, not just those affecting this stat
        const config = (ship.configurations || []).find(cfg => cfg.name === configName);
        const allComponents = this.getAllComponentsFromConfig(config);

        const rawEffects = detail?.rawEffects || [];
        console.log('[showStatDetails] rawEffects:', rawEffects);
        console.log('[showStatDetails] allComponents:', allComponents);
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
                ${allComponents.length ? `
                    <div class="stat-detail-section">
                        <h3>All Installed Components (${allComponents.length})</h3>
                        <ul class="stat-detail-list">
                            ${allComponents.map(comp => `
                                <li class="component-item">
                                    <div>
                                        <span class="component-name">${this.escapeHtml(comp.componentName || 'Component')}</span>
                                        <span class="component-meta">
                                            ${this.escapeHtml(comp.category || '')}${comp.componentType ? ` &middot; ${this.escapeHtml(comp.componentType)}` : ''}
                                            ${comp.className || comp.tierName ? ` &middot; ${[comp.className, comp.tierName].filter(Boolean).join(' ')}` : ''}
                                        </span>
                                    </div>
                                    ${comp.componentType && comp.className ? `
                                        <button class="view-recipe-btn"
                                                data-component-type="${this.escapeAttribute(comp.componentType)}"
                                                data-component-class="${this.escapeAttribute(comp.className)}"
                                                data-component-tier="${this.escapeAttribute(comp.tierName || '')}"
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
            // Capacities
            { key: 'cargo_capacity', label: 'Cargo Capacity', path: ['stats', 'capacities', 'cargoCapacity'] },
            { key: 'fuel_capacity', label: 'Fuel Capacity', path: ['stats', 'capacities', 'fuelCapacity'] },
            { key: 'ammo_capacity', label: 'Ammo Capacity', path: ['stats', 'capacities', 'ammoCapacity'] },

            // Mining
            { key: 'asteroid_mining_rate', label: 'Asteroid Mining Rate', path: ['stats', 'mining', 'asteroidMiningRate'] },
            { key: 'asteroid_mining_food_rate', label: 'Asteroid Mining Food Rate', path: ['stats', 'mining', 'asteroidMiningFoodRate'] },
            { key: 'asteroid_mining_ammo_rate', label: 'Asteroid Mining Ammo Rate', path: ['stats', 'mining', 'asteroidMiningAmmoRate'] },

            // Travel
            { key: 'subwarp_speed', label: 'Subwarp Speed', path: ['stats', 'travel', 'subwarpSpeed'] },
            { key: 'warp_speed', label: 'Warp Speed', path: ['stats', 'travel', 'warpSpeed'] },
            { key: 'max_warp_distance', label: 'Max Warp Distance', path: ['stats', 'travel', 'maxWarpDistance'] },
            { key: 'warp_cool_down', label: 'Warp Cooldown', path: ['stats', 'travel', 'warpCoolDown'] },
            { key: 'warp_fuel_consumption', label: 'Warp Fuel Consumption', path: ['stats', 'travel', 'warpFuelConsumption'] },
            { key: 'subwarp_fuel_consumption', label: 'Subwarp Fuel Consumption', path: ['stats', 'travel', 'subwarpFuelConsumption'] },
            { key: 'planet_exit_fuel', label: 'Planet Exit Fuel', path: ['stats', 'travel', 'planetExitFuel'] },
            { key: 'warp_lane_speed', label: 'Warp Lane Speed', path: ['stats', 'travel', 'warpLaneSpeed'] },
            { key: 'warp_lane_fee', label: 'Warp Lane Fee', path: ['stats', 'travel', 'warpLaneFee'] },
            { key: 'warp_spool_time', label: 'Warp Spool Time', path: ['stats', 'travel', 'warpSpoolTime'] },
            { key: 'loading_rate', label: 'Loading Rate', path: ['stats', 'travel', 'loadingRate'] },

            // Scanning
            { key: 'scan_power', label: 'Scan Power', path: ['stats', 'scanning', 'scanPower'] },
            { key: 'scan_cool_down', label: 'Scan Cooldown', path: ['stats', 'scanning', 'scanCoolDown'] },
            { key: 'sdu_per_scan', label: 'SDU Per Scan', path: ['stats', 'scanning', 'sduPerScan'] },
            { key: 'scan_cost', label: 'Scan Cost', path: ['stats', 'scanning', 'scanCost'] },

            // Combat
            { key: 'damage', label: 'Damage', path: ['stats', 'combat', 'damage'] },
            { key: 'damage_range', label: 'Damage Range', path: ['stats', 'combat', 'damageRange'] },
            { key: 'max_ap', label: 'Max AP', path: ['stats', 'combat', 'maxAp'] },
            { key: 'ap_recharge_time', label: 'AP Recharge Time', path: ['stats', 'combat', 'apRechargeTime'] },
            { key: 'hit_points', label: 'Hit Points', path: ['stats', 'combat', 'hitPoints'] },
            { key: 'shield_points', label: 'Shield Points', path: ['stats', 'combat', 'shieldPoints'] },
            { key: 'shield_recharge_rate', label: 'Shield Recharge Rate', path: ['stats', 'combat', 'shieldRechargeRate'] },
            { key: 'shield_break_delay', label: 'Shield Break Delay', path: ['stats', 'combat', 'shieldBreakDelay'] },
            { key: 'stealth_power', label: 'Stealth Power', path: ['stats', 'combat', 'stealthPower'] },
            { key: 'missile_power', label: 'Missile Power', path: ['stats', 'combat', 'missilePower'] },
            { key: 'missile_capacity', label: 'Missile Capacity', path: ['stats', 'combat', 'missileCapacity'] },
            { key: 'hit_chance', label: 'Hit Chance', path: ['stats', 'combat', 'hitChance'] },
            { key: 'hit_points_range', label: 'Hit Points Range', path: ['stats', 'combat', 'hitPointsRange'] },
            { key: 'shield_points_range', label: 'Shield Points Range', path: ['stats', 'combat', 'shieldPointsRange'] },
            { key: 'stealth_power_range', label: 'Stealth Power Range', path: ['stats', 'combat', 'stealthPowerRange'] },
            { key: 'missile_power_range', label: 'Missile Power Range', path: ['stats', 'combat', 'missilePowerRange'] },
            { key: 'crit_chance', label: 'Crit Chance', path: ['stats', 'combat', 'critChance'] },
            { key: 'crit_multiplier', label: 'Crit Multiplier', path: ['stats', 'combat', 'critMultiplier'] },
            { key: 'damage_bomb', label: 'Bomb Damage', path: ['stats', 'combat', 'damageBomb'] },

            // Damage Types
            { key: 'damage_kinetic', label: 'Kinetic Damage', path: ['stats', 'damageTypes', 'kinetic'] },
            { key: 'damage_energy', label: 'Energy Damage', path: ['stats', 'damageTypes', 'energy'] },
            { key: 'damage_emp', label: 'EMP Damage', path: ['stats', 'damageTypes', 'emp'] },
            { key: 'damage_superchill', label: 'Superchill Damage', path: ['stats', 'damageTypes', 'superchill'] },
            { key: 'damage_shockwave', label: 'Shockwave Damage', path: ['stats', 'damageTypes', 'shockwave'] },
            { key: 'damage_graygoo', label: 'Graygoo Damage', path: ['stats', 'damageTypes', 'graygoo'] },
            { key: 'damage_heat', label: 'Heat Damage', path: ['stats', 'damageTypes', 'heat'] },

            // Defense Counters
            { key: 'counter_decoy', label: 'Decoy Counter', path: ['stats', 'defense', 'counters', 'decoy'] },
            { key: 'counter_energy_capacitor', label: 'Energy Capacitor Counter', path: ['stats', 'defense', 'counters', 'energyCapacitor'] },
            { key: 'counter_fire_suppressor', label: 'Fire Suppressor Counter', path: ['stats', 'defense', 'counters', 'fireSuppressor'] },
            { key: 'counter_flare', label: 'Flare Counter', path: ['stats', 'defense', 'counters', 'flare'] },
            { key: 'counter_healing_nanobots', label: 'Healing Nanobots Counter', path: ['stats', 'defense', 'counters', 'healingNanobots'] },
            { key: 'counter_mine', label: 'Mine Counter', path: ['stats', 'defense', 'counters', 'mine'] },
            { key: 'counter_negative_rem_plating', label: 'Negative REM Plating Counter', path: ['stats', 'defense', 'counters', 'negativeRemPlating'] },
            { key: 'counter_warming_plates', label: 'Warming Plates Counter', path: ['stats', 'defense', 'counters', 'warmingPlates'] },
            { key: 'counter_faraday_shielding', label: 'Faraday Shielding Counter', path: ['stats', 'defense', 'counters', 'faradayShielding'] },

            // Repair
            { key: 'repair_cost', label: 'Repair Cost', path: ['stats', 'repair', 'repairCost'] },
            { key: 'repair_rate', label: 'Repair Rate', path: ['stats', 'repair', 'repairRate'] },
            { key: 'repair_ability', label: 'Repair Ability', path: ['stats', 'repair', 'repairAbility'] },
            { key: 'repair_efficiency', label: 'Repair Efficiency', path: ['stats', 'repair', 'repairEfficiency'] },
            { key: 'repair_cooldown', label: 'Repair Cooldown', path: ['stats', 'repair', 'repairCooldown'] },

            // Economics
            { key: 'loot_rate', label: 'Loot Rate', path: ['stats', 'economics', 'lootRate'] },
            { key: 'ship_size_value', label: 'Ship Size Value', path: ['stats', 'economics', 'shipSizeValue'] },
            { key: 'lp_value', label: 'LP Value', path: ['stats', 'economics', 'lpValue'] },

            // Crew
            { key: 'required_crew', label: 'Required Crew', path: ['crew', 'required'] },
            { key: 'passengers', label: 'Passengers', path: ['crew', 'passengers'] }
        ];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.shipExplorer = new ShipExplorer();
});












