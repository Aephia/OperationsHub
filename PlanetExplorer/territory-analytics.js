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
        // factionSummary only existed after "Apply Formula" (the loader returns factionDominance), so the
        // dominance cards never showed on first load: compute it once with the default weights.
        this.recalculateTerritoryValues();
        this.renderFactionDominance();
        this.renderTerritoryMap();
        this.renderTopSystems();
    }

    // Galia chart from the map data: every system as a dot in its territory's faction colour, the
    // top-ranked systems by the current formula drawn larger and labelled. Re-drawn when the formula changes.
    renderTerritoryMap() {
        const container = document.getElementById('territoryContent');
        const systems = (window.planetData && window.planetData.mapData) || [];
        if (!container || !systems.length || !this.data?.territoryAnalysis) return;

        let section = document.getElementById('territoryMapSection');
        if (!section) {
            section = document.createElement('section');
            section.className = 'analytics-section';
            section.id = 'territoryMapSection';
            container.appendChild(section);
        }

        const W = 960, H = 600, pad = 36;
        const xs = systems.map(s => s.coordinates[0]), ys = systems.map(s => s.coordinates[1]);
        const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
        const sc = Math.min((W - 2 * pad) / (x1 - x0), (H - 2 * pad) / (y1 - y0));
        const ox = (W - (x1 - x0) * sc) / 2, oy = (H - (y1 - y0) * sc) / 2;
        const P = c => [ox + (c[0] - x0) * sc, H - (oy + (c[1] - y0) * sc)];   // north up, like the Region Map Explorer
        const byName = new Map(systems.map(s => [s.name, s]));
        const fac = f => (f || '').toUpperCase().startsWith('MUD') ? 'mud' : (f || '').toUpperCase().startsWith('ONI') ? 'oni' : 'ust';

        // The pins follow the TABLE: its column filters narrow the set, the formula orders it.
        const ranked = this.filteredSystems && this.filteredSystems.length ? this.filteredSystems : this.data.territoryAnalysis;
        const filtered = this.filteredSystems && this.allSystems && this.filteredSystems.length !== this.allSystems.length;
        const inSet = new Set(ranked.map(t => t.system));
        const top = ranked.slice(0, 25);
        const topSet = new Set(top.map(t => t.system));
        const maxV = top[0] ? top[0].territoryValue : 1;

        let dots = '';
        systems.forEach(s => {
            if (topSet.has(s.name)) return;
            const [x, y] = P(s.coordinates);
            const dim = filtered && !inSet.has(s.name) ? ' dim' : '';
            dots += `<circle class="tm-dot f-${fac(s.closestFaction)}${dim}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.2"><title>${this.escapeHtml(s.name)} (${this.escapeHtml(s.closestFaction || '?')})</title></circle>`;
        });
        let pins = '', labels = '';
        top.forEach((t, i) => {
            const s = byName.get(t.system); if (!s) return;
            const [x, y] = P(s.coordinates);
            const r = 4 + 6 * (t.territoryValue / maxV);
            pins += `<circle class="tm-pin f-${fac(t.faction)}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" data-system="${this.escapeHtml(s.key)}"><title>#${i + 1} ${this.escapeHtml(t.system)} - score ${t.territoryValue.toFixed(1)}</title></circle>`;
            labels += `<text class="tm-label${i < 10 ? '' : ' tm-label-far'}" x="${(x + r + 3).toFixed(1)}" y="${(y + 4).toFixed(1)}">${i + 1} ${this.escapeHtml(t.system)}</text>`;
        });

        const note = filtered
            ? `Pins are the ${Math.min(25, ranked.length)} highest-scoring of the ${ranked.length} systems the table filter leaves; the rest are dimmed.`
            : 'All 945 systems in their territory\'s colour; the 25 highest-scoring systems by the formula below are the large pins.';
        section.innerHTML = `
            <h3>Territory map</h3>
            <p class="section-note">${note} The top 10 are named, all 25 once zoomed in. Scroll to zoom, drag to pan, click a pin for its system view.</p>
            <div class="tm-bar">
                <div class="tm-legend"><span><i class="f-mud"></i>MUD</span><span><i class="f-oni"></i>ONI</span><span><i class="f-ust"></i>USTUR</span><span><i class="pin"></i>Top by score</span></div>
                <div class="tm-zoom"><button type="button" data-zoom="in" title="Zoom in">+</button><button type="button" data-zoom="out" title="Zoom out">&minus;</button><button type="button" data-zoom="reset" title="Reset view">Reset</button><span class="tm-k"></span></div>
            </div>
            <svg class="territory-map" viewBox="0 0 ${W} ${H}" role="img" aria-label="Galia map with the highest value systems">${dots}${pins}${labels}</svg>
        `;
        this.bindMapZoom(section, W, H);
    }

    // viewBox zoom + pan, state kept across re-renders (formula apply, table filter)
    bindMapZoom(section, W, H) {
        const svg = section.querySelector('svg');
        const kLabel = section.querySelector('.tm-k');
        if (!this.mapView) this.mapView = { k: 1, cx: W / 2, cy: H / 2 };
        const v = this.mapView;
        const apply = () => {
            v.k = Math.min(8, Math.max(1, v.k));
            const w = W / v.k, h = H / v.k;
            v.cx = Math.min(W - w / 2, Math.max(w / 2, v.cx));
            v.cy = Math.min(H - h / 2, Math.max(h / 2, v.cy));
            svg.setAttribute('viewBox', `${(v.cx - w / 2).toFixed(1)} ${(v.cy - h / 2).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
            svg.style.fontSize = (12 / Math.sqrt(v.k)).toFixed(1) + 'px';   // labels grow slower than the map
            svg.style.setProperty('--ps', (1 / Math.sqrt(v.k)).toFixed(3));  // so do the pins
            svg.classList.toggle('zoomed', v.k >= 2);
            if (kLabel) kLabel.textContent = v.k.toFixed(1) + 'x';
        };
        const toMap = (e) => {
            const r = svg.getBoundingClientRect();
            const w = W / v.k, h = H / v.k;
            return [v.cx - w / 2 + (e.clientX - r.left) / r.width * w, v.cy - h / 2 + (e.clientY - r.top) / r.height * h];
        };
        const zoomAt = (factor, px, py) => {
            const k0 = v.k; v.k = Math.min(8, Math.max(1, v.k * factor));
            const f = 1 - k0 / v.k;        // keep the point under the pointer fixed
            v.cx += (px - v.cx) * f; v.cy += (py - v.cy) * f;
            apply();
        };
        svg.addEventListener('wheel', (e) => { e.preventDefault(); const [px, py] = toMap(e); zoomAt(e.deltaY < 0 ? 1.25 : 0.8, px, py); }, { passive: false });
        section.querySelector('.tm-zoom').addEventListener('click', (e) => {
            const b = e.target.closest('[data-zoom]'); if (!b) return;
            if (b.dataset.zoom === 'reset') { v.k = 1; v.cx = W / 2; v.cy = H / 2; apply(); }
            else zoomAt(b.dataset.zoom === 'in' ? 1.5 : 1 / 1.5, v.cx, v.cy);
        });
        let drag = null;
        svg.addEventListener('pointerdown', (e) => { if (e.button !== 0) return; drag = { x: e.clientX, y: e.clientY, cx: v.cx, cy: v.cy, moved: false }; svg.setPointerCapture(e.pointerId); });
        svg.addEventListener('pointermove', (e) => {
            if (!drag) return;
            const r = svg.getBoundingClientRect();
            const dx = (e.clientX - drag.x) / r.width * (W / v.k), dy = (e.clientY - drag.y) / r.height * (H / v.k);
            if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 3) drag.moved = true;
            v.cx = drag.cx - dx; v.cy = drag.cy - dy; apply();
        });
        const end = (e) => {
            if (!drag) return;
            const moved = drag.moved; drag = null;
            if (moved) return;
            const pin = e.target.closest('[data-system]');
            if (!pin || !window.planetExplorer) return;
            const sys = window.planetExplorer.systemByKey.get(pin.dataset.system);
            if (sys) window.planetExplorer.showSystemModal(sys);
        };
        svg.addEventListener('pointerup', end);
        svg.addEventListener('pointercancel', () => { drag = null; });
        apply();
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
            // real region names from the map data (the old 3-character prefix of a lore name was noise)
            keyRegions: this.topRegionsFor(territories)
        })).sort((a, b) => b.totalValue - a.totalValue);
    }

    // The faction's regions ranked by the summed territory value of their systems, by real region name.
    topRegionsFor(territories) {
        if (!this.regionOfSystem) {
            const regions = new Map(((window.planetData && window.planetData.regionDefinitions) || []).map(r => [r.id, r.name]));
            this.regionOfSystem = new Map(((window.planetData && window.planetData.mapData) || []).map(s => [s.name, regions.get(s.regionId) || null]));
        }
        const sum = new Map();
        territories.forEach(t => {
            const r = this.regionOfSystem.get(t.system);
            if (r) sum.set(r, (sum.get(r) || 0) + t.territoryValue);
        });
        return Array.from(sum.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);
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

            <div class="table-container">
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
                this.renderTerritoryMap();
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
                    <td>${this.escapeHtml(system.system)}${system.systemCode ? ` <span class="system-code">${this.escapeHtml(system.systemCode)}</span>` : ''}</td>
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
                return `${system.system} ${system.systemCode || ''}`.toLowerCase().includes(value);
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
        this.renderTerritoryMap();
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
                        <h2>${this.escapeHtml(system.system)}${system.systemCode ? ` <span class="system-code">${this.escapeHtml(system.systemCode)}</span>` : ''}</h2>
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
