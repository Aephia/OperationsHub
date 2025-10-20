/**
 * Territory Analytics module
 * Calculates territory control value and faction dominance across the galaxy.
 */
class TerritoryAnalytics {
    constructor() {
        this.crossAnalytics = new CrossExplorerAnalytics();
        this.data = null;

        // Formula weights with defaults
        this.formulaWeights = {
            uniqueResources: { enabled: true, value: 10 },
            manufacturableRecipes: { enabled: true, value: 5 },
            rareResources: { enabled: true, value: 20 },
            avgRichness: { enabled: true, value: 5 }
        };
    }

    async renderTerritoryAnalytics() {
        const loadingMsg = document.getElementById('terrLoadingMessage');
        const content = document.getElementById('territoryContent');

        if (loadingMsg) {
            loadingMsg.style.display = 'block';
            if (!loadingMsg.querySelector('.loading-progress')) {
                const progress = document.createElement('div');
                progress.className = 'loading-progress';
                progress.innerHTML = '<div class="loading-bar"></div>';
                loadingMsg.appendChild(progress);
            }
        }

        if (content) {
            content.innerHTML = '';
        }

        try {
            this.data = await this.crossAnalytics.analyzeTerritoryControl();
        } catch (error) {
            console.error('[TerritoryAnalytics] Failed to compute analytics', error);
            if (loadingMsg) {
                loadingMsg.innerHTML = '<p style="color:#ff6b6b">⚠️ Failed to load territory analytics. See console for details.</p>';
            }
            return;
        }

        if (loadingMsg) {
            loadingMsg.style.display = 'none';
        }

        // Stats section removed from UI, no need to update
        // this.updateStats();
        this.renderTopSystems();
        this.renderFactionDominance();
    }

    recalculateTerritoryValues() {
        if (!this.data?.territoryAnalysis) return;

        // Recalculate territory values with current weights
        this.data.territoryAnalysis.forEach(system => {
            system.territoryValue =
                (this.formulaWeights.uniqueResources.enabled ? system.uniqueResources * this.formulaWeights.uniqueResources.value : 0) +
                (this.formulaWeights.manufacturableRecipes.enabled ? system.manufacturingCapability * this.formulaWeights.manufacturableRecipes.value : 0) +
                (this.formulaWeights.rareResources.enabled ? system.rareResourceCount * this.formulaWeights.rareResources.value : 0) +
                (this.formulaWeights.avgRichness.enabled ? parseFloat(system.avgRichness) * this.formulaWeights.avgRichness.value : 0);
        });

        // Re-sort by new values
        this.data.territoryAnalysis.sort((a, b) => b.territoryValue - a.territoryValue);
        this.data.topSystems = this.data.territoryAnalysis.slice(0, 30);

        // Update faction summaries with new values
        const factionTerritory = new Map();
        this.data.territoryAnalysis.forEach(territory => {
            if (!factionTerritory.has(territory.faction)) {
                factionTerritory.set(territory.faction, []);
            }
            factionTerritory.get(territory.faction).push(territory);
        });

        this.data.factionSummary = Array.from(factionTerritory.entries()).map(([faction, territories]) => ({
            name: faction,
            controlledSystems: territories.length,
            contestedSystems: territories.filter(t => t.contested).length || 0,
            totalValue: territories.reduce((sum, t) => sum + t.territoryValue, 0),
            averageValue: territories.reduce((sum, t) => sum + t.territoryValue, 0) / territories.length,
            keyRegions: [...new Set(territories.map(t => t.system.substring(0, 3)))].slice(0, 5)
        })).sort((a, b) => b.totalValue - a.totalValue);
    }

    getFormulaString() {
        const parts = [];
        if (this.formulaWeights.uniqueResources.enabled) {
            parts.push(`(Unique Resources × ${this.formulaWeights.uniqueResources.value})`);
        }
        if (this.formulaWeights.manufacturableRecipes.enabled) {
            parts.push(`(Manufacturable Recipes × ${this.formulaWeights.manufacturableRecipes.value})`);
        }
        if (this.formulaWeights.rareResources.enabled) {
            parts.push(`(Rare Resources × ${this.formulaWeights.rareResources.value})`);
        }
        if (this.formulaWeights.avgRichness.enabled) {
            parts.push(`(Avg Richness × ${this.formulaWeights.avgRichness.value})`);
        }
        return parts.length > 0 ? parts.join(' + ') : 'No factors enabled';
    }

    renderTopSystems() {
        const container = document.getElementById('territoryContent');
        if (!container || !this.data?.territoryAnalysis) {
            return;
        }

        // Enhance systems data with full information from planet data
        const enhancedSystems = this.data.territoryAnalysis.map(system => {
            // Find the full system data
            const fullSystemData = this.crossAnalytics.dataCache.planets.find(s => s.name === system.system);

            // Collect all resources from all planets in the system
            const allResources = new Set();
            if (fullSystemData && fullSystemData.planets) {
                fullSystemData.planets.forEach(planet => {
                    if (planet.resources) {
                        planet.resources.forEach(res => allResources.add(res.name));
                    }
                });
            }

            return {
                ...system,
                topResources: Array.from(allResources),
                faction: system.faction || fullSystemData?.closestFaction || '—'
            };
        });

        this.allSystems = enhancedSystems;
        this.filteredSystems = [...enhancedSystems];
        this.currentPage = 1;

        const section = document.createElement('section');
        section.className = 'analytics-section';
        section.innerHTML = `
            <h3>🏰 Highest Value Systems</h3>
            <p class="section-note">Territory scores calculated as: <strong id="formulaDisplay">${this.getFormulaString()}</strong></p>

            <!-- Formula Customization Controls -->
            <div class="formula-customization">
                <h4>🔧 Customize Formula</h4>
                <div class="formula-controls">
                    <div class="formula-control-item">
                        <label class="checkbox-label">
                            <input type="checkbox" id="enableUniqueResources" ${this.formulaWeights.uniqueResources.enabled ? 'checked' : ''}>
                            Unique Resources
                        </label>
                        <input type="number" id="weightUniqueResources"
                               value="${this.formulaWeights.uniqueResources.value}"
                               min="0" max="100" step="1"
                               ${!this.formulaWeights.uniqueResources.enabled ? 'disabled' : ''}>
                    </div>
                    <div class="formula-control-item">
                        <label class="checkbox-label">
                            <input type="checkbox" id="enableManufacturableRecipes" ${this.formulaWeights.manufacturableRecipes.enabled ? 'checked' : ''}>
                            Manufacturable Recipes
                        </label>
                        <input type="number" id="weightManufacturableRecipes"
                               value="${this.formulaWeights.manufacturableRecipes.value}"
                               min="0" max="100" step="1"
                               ${!this.formulaWeights.manufacturableRecipes.enabled ? 'disabled' : ''}>
                    </div>
                    <div class="formula-control-item">
                        <label class="checkbox-label">
                            <input type="checkbox" id="enableRareResources" ${this.formulaWeights.rareResources.enabled ? 'checked' : ''}>
                            Rare Resources (T4, T5)
                        </label>
                        <input type="number" id="weightRareResources"
                               value="${this.formulaWeights.rareResources.value}"
                               min="0" max="100" step="1"
                               ${!this.formulaWeights.rareResources.enabled ? 'disabled' : ''}>
                    </div>
                    <div class="formula-control-item">
                        <label class="checkbox-label">
                            <input type="checkbox" id="enableAvgRichness" ${this.formulaWeights.avgRichness.enabled ? 'checked' : ''}>
                            Avg Richness
                        </label>
                        <input type="number" id="weightAvgRichness"
                               value="${this.formulaWeights.avgRichness.value}"
                               min="0" max="100" step="0.1"
                               ${!this.formulaWeights.avgRichness.enabled ? 'disabled' : ''}>
                    </div>
                </div>
                <button id="applyFormulaBtn" class="apply-formula-btn">Apply Formula</button>
                <button id="resetFormulaBtn" class="reset-formula-btn">Reset to Defaults</button>
            </div>

            <div class="pagination-controls">
                <button id="terrPrevPage" class="pagination-btn">⟵ Previous</button>
                <span id="terrPageInfo" class="page-info">Page 1 of ${Math.ceil(this.filteredSystems.length / 20)}</span>
                <button id="terrNextPage" class="pagination-btn">Next ⟶</button>
                <span class="filter-info" id="terrFilterInfo"></span>
            </div>

            <div class="location-analysis-grid">
                <table class="location-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>System</th>
                            <th title="Score based on custom formula">Score</th>
                            <th>Faction</th>
                            <th class="clickable-header" title="Total unique resources across all planets in the system">Unique Resources</th>
                        </tr>
                        <tr class="filter-row">
                            <th></th>
                            <th><input type="text" class="column-filter" data-column="system" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-column="value" placeholder="Min..."></th>
                            <th><input type="text" class="column-filter" data-column="faction" placeholder="Filter..."></th>
                            <th><input type="text" class="column-filter" data-column="resources" placeholder="Min..."></th>
                        </tr>
                    </thead>
                    <tbody id="terrSystemsTableBody"></tbody>
                </table>
            </div>

            <div class="pagination-controls">
                <button id="terrPrevPageBottom" class="pagination-btn">⟵ Previous</button>
                <span id="terrPageInfoBottom" class="page-info">Page 1 of ${Math.ceil(this.filteredSystems.length / 20)}</span>
                <button id="terrNextPageBottom" class="pagination-btn">Next ⟶</button>
            </div>
        `;

        container.appendChild(section);

        // Render first page
        this.renderSystemTablePage(1);

        // Setup pagination
        const prevButtons = [
            document.getElementById('terrPrevPage'),
            document.getElementById('terrPrevPageBottom')
        ];
        const nextButtons = [
            document.getElementById('terrNextPage'),
            document.getElementById('terrNextPageBottom')
        ];

        prevButtons.forEach(btn => btn?.addEventListener('click', () => this.changeSystemPage(-1)));
        nextButtons.forEach(btn => btn?.addEventListener('click', () => this.changeSystemPage(1)));

        // Setup filters
        section.querySelectorAll('.column-filter').forEach(input => {
            input.addEventListener('input', (event) => this.handleSystemFilter(event));
        });

        // Setup formula customization controls
        this.setupFormulaControls();
    }

    setupFormulaControls() {
        // Checkbox event handlers
        const checkboxes = [
            { id: 'enableUniqueResources', key: 'uniqueResources', weightId: 'weightUniqueResources' },
            { id: 'enableManufacturableRecipes', key: 'manufacturableRecipes', weightId: 'weightManufacturableRecipes' },
            { id: 'enableRareResources', key: 'rareResources', weightId: 'weightRareResources' },
            { id: 'enableAvgRichness', key: 'avgRichness', weightId: 'weightAvgRichness' }
        ];

        checkboxes.forEach(({ id, key, weightId }) => {
            const checkbox = document.getElementById(id);
            const weightInput = document.getElementById(weightId);

            if (checkbox && weightInput) {
                checkbox.addEventListener('change', (e) => {
                    this.formulaWeights[key].enabled = e.target.checked;
                    weightInput.disabled = !e.target.checked;
                });

                weightInput.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value >= 0) {
                        this.formulaWeights[key].value = value;
                    }
                });
            }
        });

        // Apply button
        const applyBtn = document.getElementById('applyFormulaBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.recalculateTerritoryValues();

                // Update formula display
                const formulaDisplay = document.getElementById('formulaDisplay');
                if (formulaDisplay) {
                    formulaDisplay.textContent = this.getFormulaString();
                }

                // Re-render all systems with new values
                this.allSystems = [...this.data.territoryAnalysis.map(system => {
                    const fullSystemData = this.crossAnalytics.dataCache.planets.find(s => s.name === system.system);
                    const allResources = new Set();
                    if (fullSystemData && fullSystemData.planets) {
                        fullSystemData.planets.forEach(planet => {
                            if (planet.resources) {
                                planet.resources.forEach(res => allResources.add(res.name));
                            }
                        });
                    }
                    return {
                        ...system,
                        topResources: Array.from(allResources),
                        faction: system.faction || fullSystemData?.closestFaction || '—'
                    };
                })];
                this.filteredSystems = [...this.allSystems];
                this.currentPage = 1;
                this.renderSystemTablePage(1);
            });
        }

        // Reset button
        const resetBtn = document.getElementById('resetFormulaBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // Reset to defaults
                this.formulaWeights = {
                    uniqueResources: { enabled: true, value: 10 },
                    manufacturableRecipes: { enabled: true, value: 5 },
                    rareResources: { enabled: true, value: 20 },
                    avgRichness: { enabled: true, value: 5 }
                };

                // Update UI controls
                document.getElementById('enableUniqueResources').checked = true;
                document.getElementById('weightUniqueResources').value = 10;
                document.getElementById('weightUniqueResources').disabled = false;

                document.getElementById('enableManufacturableRecipes').checked = true;
                document.getElementById('weightManufacturableRecipes').value = 5;
                document.getElementById('weightManufacturableRecipes').disabled = false;

                document.getElementById('enableRareResources').checked = true;
                document.getElementById('weightRareResources').value = 20;
                document.getElementById('weightRareResources').disabled = false;

                document.getElementById('enableAvgRichness').checked = true;
                document.getElementById('weightAvgRichness').value = 5;
                document.getElementById('weightAvgRichness').disabled = false;

                // Trigger recalculation
                document.getElementById('applyFormulaBtn').click();
            });
        }
    }

    renderSystemTablePage(page) {
        const itemsPerPage = 20;
        const totalPages = Math.max(1, Math.ceil(this.filteredSystems.length / itemsPerPage));
        const clampedPage = Math.min(Math.max(page, 1), totalPages);
        this.currentPage = clampedPage;

        const startIdx = (clampedPage - 1) * itemsPerPage;
        const systemsToShow = this.filteredSystems.slice(startIdx, startIdx + itemsPerPage);
        const tbody = document.getElementById('terrSystemsTableBody');
        if (!tbody) return;

        tbody.innerHTML = systemsToShow.map((system, index) => {
            const rank = startIdx + index + 1;
            const resourceCount = (system.topResources || []).length;
            const faction = system.faction || '—';

            return `
                <tr>
                    <td class="rank-cell">${rank}</td>
                    <td>${this.escapeHtml(system.system)}</td>
                    <td class="number-cell">${system.territoryValue.toFixed(1)}</td>
                    <td class="faction-cell">
                        ${faction !== '—' ? `<span class="faction-badge-mini faction-${faction.toLowerCase()}">${faction}</span>` : '—'}
                    </td>
                    <td class="clickable-resources-cell" data-system-index="${startIdx + index}" title="Click to view ${resourceCount} key resources">
                        <span class="clickable-value">${resourceCount}</span>
                        <span class="click-hint">🔍 View Resources</span>
                    </td>
                </tr>
            `;
        }).join('');

        // Add click handlers for resources cells
        tbody.querySelectorAll('.clickable-resources-cell').forEach(cell => {
            cell.addEventListener('click', (event) => {
                const systemIndex = parseInt(event.currentTarget.getAttribute('data-system-index'), 10);
                const system = this.filteredSystems[systemIndex];
                if (system) {
                    this.showResourcesModal(system);
                }
            });
        });

        // Update pagination info
        const topInfo = document.getElementById('terrPageInfo');
        const bottomInfo = document.getElementById('terrPageInfoBottom');
        if (topInfo) topInfo.textContent = `Page ${clampedPage} of ${totalPages}`;
        if (bottomInfo) bottomInfo.textContent = `Page ${clampedPage} of ${totalPages}`;

        // Update button states
        const disablePrev = clampedPage === 1;
        const disableNext = clampedPage === totalPages;
        ['terrPrevPage', 'terrPrevPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disablePrev;
        });
        ['terrNextPage', 'terrNextPageBottom'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = disableNext;
        });
    }

    changeSystemPage(delta) {
        this.renderSystemTablePage(this.currentPage + delta);
    }

    handleSystemFilter(event) {
        const column = event.target.getAttribute('data-column');
        const value = event.target.value.toLowerCase().trim();

        this.filteredSystems = this.allSystems.filter(system => {
            if (column === 'system' && value) {
                return system.system.toLowerCase().includes(value);
            }
            if (column === 'value' && value) {
                const min = parseFloat(value);
                if (!Number.isNaN(min) && system.territoryValue < min) {
                    return false;
                }
            }
            if (column === 'faction' && value) {
                const faction = system.faction || '';
                return faction.toLowerCase().includes(value);
            }
            if (column === 'resources' && value) {
                const min = parseFloat(value);
                const count = (system.topResources || []).length;
                if (!Number.isNaN(min) && count < min) {
                    return false;
                }
            }
            return true;
        });

        const filterInfo = document.getElementById('terrFilterInfo');
        if (filterInfo) {
            filterInfo.textContent = this.filteredSystems.length === this.allSystems.length
                ? ''
                : `Showing ${this.filteredSystems.length} of ${this.allSystems.length} systems`;
        }

        this.currentPage = 1;
        this.renderSystemTablePage(1);
    }

    renderFactionDominance() {
        if (!this.data?.factionSummary) {
            return;
        }

        const container = document.getElementById('territoryContent');
        const section = document.createElement('section');
        section.className = 'analytics-section';
        section.innerHTML = `
            <h3>⚔️ Faction Dominance</h3>
            <p class="section-note">Breakdown of system control, territory value, and contested regions for each faction.</p>
            <div class="faction-grid">
                ${this.data.factionSummary.map(faction => `
                    <article class="faction-card faction-${faction.name.toLowerCase()}">
                        <header>
                            <h4>${this.escapeHtml(faction.name)}</h4>
                            <span class="dominance-score">${faction.totalValue.toFixed(1)}</span>
                        </header>
                        <ul>
                            <li><span>Controlled Systems</span><strong>${faction.controlledSystems}</strong></li>
                            <li><span>Contested Systems</span><strong>${faction.contestedSystems}</strong></li>
                            <li><span>Average Value</span><strong>${faction.averageValue.toFixed(1)}</strong></li>
                            <li><span>Key Regions</span><strong>${faction.keyRegions.slice(0, 3).join(', ') || '—'}</strong></li>
                        </ul>
                    </article>
                `).join('')}
            </div>
        `;

        container.appendChild(section);
    }

    showResourcesModal(system) {
        if (!system) {
            return;
        }

        const resources = system.topResources || [];

        // Get resource tier information from the cached data
        const resourcesData = this.crossAnalytics.dataCache.resources || [];
        const resourceTierMap = new Map();
        resourcesData.forEach(res => {
            resourceTierMap.set(res.name, res.tier || 1);
        });

        const modal = document.createElement('div');
        modal.className = 'recipe-modal-overlay';
        modal.innerHTML = `
            <div class="recipe-modal">
                <div class="recipe-modal-header">
                    <div>
                        <h2>${this.escapeHtml(system.system)}</h2>
                        <p class="modal-subtitle">System Resource Overview</p>
                    </div>
                    <button class="modal-close-btn" aria-label="Close">&times;</button>
                </div>
                <div class="recipe-modal-body">
                    <div class="modal-stats">
                        <div class="modal-stat">
                            <span class="stat-label">Territory Score</span>
                            <span class="stat-value">${system.territoryValue.toFixed(1)}</span>
                        </div>
                        <div class="modal-stat">
                            <span class="stat-label">Unique Resources</span>
                            <span class="stat-value">${system.uniqueResources || resources.length}</span>
                        </div>
                        <div class="modal-stat">
                            <span class="stat-label">Rare Resources (T4-T5)</span>
                            <span class="stat-value">${system.rareResourceCount || 0}</span>
                        </div>
                        <div class="modal-stat">
                            <span class="stat-label">Manufacturable Recipes</span>
                            <span class="stat-value">${system.manufacturingCapability || 0}</span>
                        </div>
                        <div class="modal-stat">
                            <span class="stat-label">Average Richness</span>
                            <span class="stat-value">${system.avgRichness || 0}</span>
                        </div>
                        <div class="modal-stat">
                            <span class="stat-label">Faction</span>
                            <span class="stat-value">${system.faction || '—'}</span>
                        </div>
                    </div>

                    <div class="score-formula">
                        <h4>📐 Score Calculation</h4>
                        <div class="formula-breakdown">
                            ${this.formulaWeights.uniqueResources.enabled ? `
                            <div class="formula-item">
                                <span class="formula-label">Unique Resources:</span>
                                <span class="formula-value">${system.uniqueResources || resources.length} × ${this.formulaWeights.uniqueResources.value} = ${(system.uniqueResources || resources.length) * this.formulaWeights.uniqueResources.value}</span>
                            </div>
                            ` : ''}
                            ${this.formulaWeights.manufacturableRecipes.enabled ? `
                            <div class="formula-item">
                                <span class="formula-label">Manufacturable Recipes:</span>
                                <span class="formula-value">${system.manufacturingCapability || 0} × ${this.formulaWeights.manufacturableRecipes.value} = ${(system.manufacturingCapability || 0) * this.formulaWeights.manufacturableRecipes.value}</span>
                            </div>
                            ` : ''}
                            ${this.formulaWeights.rareResources.enabled ? `
                            <div class="formula-item">
                                <span class="formula-label">Rare Resources (T4-T5):</span>
                                <span class="formula-value">${system.rareResourceCount || 0} × ${this.formulaWeights.rareResources.value} = ${(system.rareResourceCount || 0) * this.formulaWeights.rareResources.value}</span>
                            </div>
                            ` : ''}
                            ${this.formulaWeights.avgRichness.enabled ? `
                            <div class="formula-item">
                                <span class="formula-label">Average Richness:</span>
                                <span class="formula-value">${system.avgRichness || 0} × ${this.formulaWeights.avgRichness.value} = ${((parseFloat(system.avgRichness) || 0) * this.formulaWeights.avgRichness.value).toFixed(1)}</span>
                            </div>
                            ` : ''}
                            <div class="formula-total">
                                <span class="formula-label">Total Score:</span>
                                <span class="formula-value">${system.territoryValue.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>

                    ${resources.length > 0 ? `
                        <div class="resource-categories">
                            <h3>📦 All Unique Resources in System (${resources.length})</h3>
                            <div class="resource-grid">
                                ${resources.map(resource => {
                                    const tier = resourceTierMap.get(resource) || 1;
                                    return `
                                    <div class="resource-item-card">
                                        <div class="resource-item-name">${this.escapeHtml(resource)} <span class="resource-tier-badge tier-${tier}">(T${tier})</span></div>
                                    </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    ` : `
                        <div class="empty-state">
                            <p>⚠️ No key resources identified for this system.</p>
                        </div>
                    `}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeModal = () => modal.remove();
        modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    escapeHtml(value) {
        if (!value) return '';
        return value.replace(/[&<>"']/g, match => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match]));
    }
}

window.TerritoryAnalytics = TerritoryAnalytics;
