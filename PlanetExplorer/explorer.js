class PlanetExplorer extends BaseExplorer {
    constructor(data) {
        super(data);

        // Initialize properties after calling super
        this.allResources = new Set();

        // Now initialize properly
        this.initialize();
        this.setupSystemSearch();
    }

    // Live finder above the Star Systems list: matches every word against the
    // legacy SAGE code (004-MUD-KING-01), the lore name and the faction. Only the
    // checkbox list re-renders, so the input keeps focus and selections survive.
    setupSystemSearch() {
        const input = document.getElementById('systemSearch');
        if (!input) return;
        this.systemSearchTerm = '';
        input.addEventListener('input', (e) => {
            this.systemSearchTerm = e.target.value;
            this.refreshSystemOptions(this.getContextSystems());
        });
    }

    extractMetadata() {
        this.allResources.clear();
        this.systemByKey = new Map(this.data.map(system => [system.key, system]));
        // Richness is on a different scale per resource (tier-1 ores run to 7.0, tier 2-5 stay under
        // 2.2), so every deposit is shown against the richest deposit of the SAME resource.
        this.maxRichness = new Map();
        this.data.forEach(system => {
            if (system.planets) {
                system.planets.forEach(planet => {
                    if (planet.resources) {
                        planet.resources.forEach(resource => {
                            this.allResources.add(resource.name);
                            const cur = this.maxRichness.get(resource.name) || 0;
                            if ((resource.richness || 0) > cur) this.maxRichness.set(resource.name, resource.richness);
                        });
                    }
                });
            }
        });
        // Resource tier + category from the resources bundle (Data/resources-data.js), by name.
        this.resourceInfo = new Map();
        const resList = (window.resourcesData && window.resourcesData.resources) || [];
        resList.forEach(r => this.resourceInfo.set(r.name, { tier: r.tier, category: r.category, faction: r.faction }));
        // Region definitions (name, risk zone, resource tier cap), by regionId.
        this.regionById = new Map();
        const regions = (window.planetData && window.planetData.regionDefinitions) || [];
        regions.forEach(r => {
            const z = r.risk_zone;
            const zone = z && typeof z === 'object' ? Object.keys(z)[0] : (z || '');
            this.regionById.set(r.id, {
                name: r.name,
                color: r.color,
                zone: zone === 'LowRiskZone' ? 'Safe zone' : zone === 'MediumRiskZone' ? 'Medium risk' : (zone || 'Unknown zone'),
                tiers: Array.isArray(r.resource_tiers) && r.resource_tiers.length
                    ? (Math.min(...r.resource_tiers) === Math.max(...r.resource_tiers) ? `T${r.resource_tiers[0]}` : `T${Math.min(...r.resource_tiers)}-T${Math.max(...r.resource_tiers)}`)
                    : ''
            });
        });
    }

    regionOf(system) {
        return this.regionById.get(system.regionId) || { name: system.regionCode || system.regionId || 'Unknown', zone: '', tiers: '' };
    }

    tierOf(name) {
        const info = this.resourceInfo.get(name);
        return info ? info.tier : null;
    }

    // Faction / star / starbase / king / core badges for a system
    systemBadgesHTML(system) {
        const f = (system.closestFaction || '').toUpperCase();
        const region = this.regionOf(system);
        const sb = system.starbase && system.starbase.tier != null ? system.starbase.tier : null;
        let html = `<span class="badge faction-${f.toLowerCase()}">${f || '???'}</span>`;
        html += `<span class="badge star">${this.getStarTypeName(system)}</span>`;
        if (sb != null) html += `<span class="badge sb${sb >= 5 ? ' sb-high' : ''}" title="Starbase level">${sb === 6 ? 'CSS' : 'Starbase L' + sb}</span>`;
        if (system.isKing) html += `<span class="badge king">King</span>`;
        if (system.isCore) html += `<span class="badge core">Core</span>`;
        if (region.zone) html += `<span class="badge zone ${region.zone === 'Safe zone' ? 'safe' : 'risk'}">${region.zone}</span>`;
        return html;
    }

    richnessBarHTML(resource) {
        const max = this.maxRichness.get(resource.name) || resource.richness || 1;
        const pct = Math.max(4, Math.round(100 * (resource.richness || 0) / max));
        const tier = this.tierOf(resource.name);
        return `<span class="rtag" title="Richness ${resource.richness} (best deposit of ${resource.name}: ${max})">` +
            (tier ? `<b class="t t${tier}">T${tier}</b>` : '') +
            `<span class="rname">${resource.name}</span><i class="rbar"><i style="width:${pct}%"></i></i><span class="rval">${resource.richness}</span></span>`;
    }

    populateFilters() {
        this.populateFactionCheckboxes();
        this.populatePlanetTypeCheckboxes();
        // System + resource option lists are derived from the faction/planet-type
        // selections so they shrink for easier selection.
        this.refreshDependentLists();
    }

    populateFactionCheckboxes() {
        const factions = [...new Set(this.data.map(s => s.closestFaction).filter(Boolean))];
        this.createCheckboxFilter('factionCheckboxes', factions, 'faction');
    }

    populatePlanetTypeCheckboxes() {
        // Faction-agnostic categories (Gas Giant, Asteroid Belt, ...) present in the data
        const categories = new Set();
        this.data.forEach(system => {
            (system.planets || []).forEach(planet => {
                categories.add(getPlanetCategory(planet.type));
            });
        });
        this.createCheckboxFilter('planetTypeCheckboxes', categories, 'planetType');
    }

    // Systems that satisfy the upstream faction + planet-type selections. Used to
    // narrow the System and Resource option lists (faceted filtering).
    getContextSystems() {
        const factions = this.selectedFilters.get('faction');
        const types = this.selectedFilters.get('planetType');
        const factionActive = factions && factions.size > 0;
        const typeActive = types && types.size > 0;

        return this.data.filter(system => {
            if (factionActive && !factions.has(system.closestFaction)) return false;
            if (typeActive && !(system.planets || []).some(p => types.has(getPlanetCategory(p.type)))) {
                return false;
            }
            return true;
        });
    }

    // Planets in a system that match the selected planet types (ignores resource filter)
    planetsMatchingType(system) {
        const types = this.selectedFilters.get('planetType');
        if (!types || types.size === 0) return system.planets || [];
        return (system.planets || []).filter(p => types.has(getPlanetCategory(p.type)));
    }

    refreshDependentLists() {
        const contextSystems = this.getContextSystems();
        this.refreshSystemOptions(contextSystems);
        this.refreshResourceOptions(contextSystems);
    }

    refreshSystemOptions(systems) {
        // Group systems by region number (first 3 chars of the legacy SAGE code,
        // e.g. 004-MUD-KING-01 -> "004 - MUD"). Falls back to the lore name when
        // a system has no code.
        const entries = systems.map(system => ({
            value: system.key,
            label: system.name,
            code: system.code || null,
            keywords: `${system.code || ''} ${system.name || ''} ${system.closestFaction || ''}`.toLowerCase(),
            group: `${(system.code || system.name || '').slice(0, 3)} - ${system.closestFaction || '???'}`
        }));
        this.renderGroupedCheckboxes('systemCheckboxes', 'system', entries, this.systemSearchTerm || '');
    }

    refreshResourceOptions(systems) {
        // Only resources found on planets that match the selected planet types
        const names = new Set();
        systems.forEach(system => {
            this.planetsMatchingType(system).forEach(planet => {
                (planet.resources || []).forEach(r => names.add(r.name));
            });
        });
        const entries = Array.from(names).map(name => ({
            value: name,
            label: name,
            group: (name[0] || '#').toUpperCase()
        }));
        this.renderGroupedCheckboxes('resourceCheckboxes', 'resource', entries);
    }

    // Render a list of checkboxes into collapsible <details> groups. Each entry is
    // { value, label, group, code?, keywords? }. Preserves checked state for entries
    // still present, prunes the stored selection, and auto-expands groups with an
    // active selection. `searchTerm` hides entries whose keywords (or label) do not
    // contain every word; hidden entries keep their checked state.
    renderGroupedCheckboxes(containerId, filterType, entries, searchTerm = '') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const previouslyChecked = this.selectedFilters.get(filterType) || new Set();

        // Selection is pruned against ALL entries, never against the search subset.
        const stillChecked = new Set();
        entries.forEach(entry => {
            if (previouslyChecked.has(entry.value)) stillChecked.add(entry.value);
        });

        const words = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
        const visible = words.length === 0 ? entries : entries.filter(entry => {
            const haystack = entry.keywords || entry.label.toLowerCase();
            return words.every(word => haystack.includes(word));
        });

        const groups = new Map();
        visible.forEach(entry => {
            if (!groups.has(entry.group)) groups.set(entry.group, []);
            groups.get(entry.group).push(entry);
        });

        container.innerHTML = '';
        if (visible.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'no-matches';
            empty.textContent = words.length ? `No matches for "${searchTerm.trim()}"` : 'Nothing to show';
            container.appendChild(empty);
        }

        Array.from(groups.keys()).sort().forEach(groupKey => {
            const groupEntries = groups.get(groupKey)
                .sort((a, b) => (a.code || a.label).localeCompare(b.code || b.label));

            const details = document.createElement('details');
            details.className = 'collapsible-group';

            const summary = document.createElement('summary');
            summary.className = 'collapsible-group-title';
            summary.textContent = `${groupKey} (${groupEntries.length})`;
            details.appendChild(summary);

            let groupHasChecked = false;
            groupEntries.forEach(({ value, label, code }) => {
                const item = document.createElement('div');
                item.className = 'checkbox-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `${filterType}-${value}`;
                checkbox.value = value;
                if (stillChecked.has(value)) {
                    checkbox.checked = true;
                    groupHasChecked = true;
                }
                checkbox.addEventListener('change', (e) => {
                    if (window.spaceSounds) {
                        e.target.checked ? window.spaceSounds.select() : window.spaceSounds.deselect();
                    }
                    this.handleFilterChange(filterType);
                });

                const labelEl = document.createElement('label');
                labelEl.htmlFor = `${filterType}-${value}`;
                if (code) {
                    const codeEl = document.createElement('span');
                    codeEl.className = 'system-code';
                    codeEl.textContent = code;
                    labelEl.appendChild(codeEl);
                    labelEl.appendChild(document.createTextNode(label));
                } else {
                    labelEl.textContent = label;
                }

                item.appendChild(checkbox);
                item.appendChild(labelEl);
                details.appendChild(item);
            });

            // Keep a group expanded if it contains an active selection or a search hit
            if (groupHasChecked || words.length > 0) details.open = true;

            container.appendChild(details);
        });

        this.selectedFilters.set(filterType, stillChecked);
    }

    // When an upstream (faction / planet type) filter changes, narrow the dependent
    // System and Resource option lists before re-applying.
    handleFilterChange(filterType) {
        // One pass: read the checkboxes, narrow the dependent lists FIRST (so the Star Systems and
        // Resources panels update at once), then render once. The base class rendered before the
        // lists narrowed and this override rendered a second time, which doubled the wait.
        const checked = document.querySelectorAll(`#${filterType}Checkboxes input[type="checkbox"]:checked`);
        this.selectedFilters.set(filterType, new Set(Array.from(checked, c => c.value)));
        if (filterType === 'faction' || filterType === 'planetType') {
            this.refreshDependentLists();
        }
        this.applyFilters();
    }


    hasActiveFilters() {
        return this.selectedFilters.get('system')?.size > 0 ||
               this.selectedFilters.get('resource')?.size > 0 ||
               this.selectedFilters.get('faction')?.size > 0 ||
               this.selectedFilters.get('planetType')?.size > 0;
    }

    applyFilters() {
        const hasActiveFilters = this.hasActiveFilters();

        console.log(`🔍 PlanetExplorer applyFilters:`, {
            systemFilters: this.selectedFilters.get('system')?.size || 0,
            resourceFilters: this.selectedFilters.get('resource')?.size || 0,
            factionFilters: this.selectedFilters.get('faction')?.size || 0,
            planetTypeFilters: this.selectedFilters.get('planetType')?.size || 0,
            hasActiveFilters
        });

        if (!hasActiveFilters) {
            this.filteredData = [];
            console.log(`📭 No filters active, showing empty state`);
        } else {
            super.applyFilters();
            console.log(`📋 Applied filters, got ${this.filteredData.length} results`);
        }

        this.renderSystems();
        this.updateStats();
    }

    matchesFilter(system, filterType, selectedItems) {
        if (filterType === 'system') {
            return selectedItems.has(system.key);
        } else if (filterType === 'faction') {
            return selectedItems.has(system.closestFaction);
        } else if (filterType === 'resource' || filterType === 'planetType') {
            // Planet-level filters must be satisfied by the SAME planet: a system
            // only matches if it has a planet that meets every active planet-level
            // filter (selected type AND containing a selected resource).
            return this.getMatchingPlanets(system.planets).length > 0;
        }
        return true;
    }

    // Returns planets that satisfy all active planet-level filters (planet type +
    // resource). When neither filter is active, returns the planets unchanged.
    getMatchingPlanets(planets) {
        const selectedTypes = this.selectedFilters.get('planetType');
        const selectedResources = this.selectedFilters.get('resource');
        const typeActive = selectedTypes && selectedTypes.size > 0;
        const resourceActive = selectedResources && selectedResources.size > 0;

        return (planets || []).filter(planet => {
            if (typeActive && !selectedTypes.has(getPlanetCategory(planet.type))) {
                return false;
            }
            if (resourceActive && !(planet.resources || []).some(r => selectedResources.has(r.name))) {
                return false;
            }
            return true;
        });
    }


    updateStats() {
        const hasActiveFilters = this.hasActiveFilters();

        const dataToCount = hasActiveFilters ? this.filteredData : this.data;
        const totalSystems = dataToCount ? dataToCount.length : 0;
        let totalPlanets = 0;

        if (dataToCount) {
            dataToCount.forEach(system => {
                if (system.planets) {
                    totalPlanets += system.planets.length;
                }
            });
        }

        document.getElementById('totalSystems').textContent = totalSystems;
        document.getElementById('totalPlanets').textContent = totalPlanets;
        document.getElementById('uniqueResources').textContent = this.allResources.size;
    }

    renderItems() {
        this.renderSystems();
    }

    getModalId() {
        return 'planetModal';
    }

    populateModal(system) {
        this.showSystemModal(system);
    }

    renderSystems() {
        const grid = document.getElementById('systemsGrid');
        grid.innerHTML = '';

        // Check if no filters are active - use the same logic as applyFilters()
        const hasActiveFilters = this.hasActiveFilters();

        console.log(`🎨 PlanetExplorer renderSystems:`, {
            hasActiveFilters,
            filteredDataLength: this.filteredData.length
        });

        if (!hasActiveFilters) {
            // Show placeholder message when no filters are active
            const placeholderDiv = document.createElement('div');
            placeholderDiv.className = 'filter-placeholder';
            const kings = this.data.filter(s => s.isKing).length;
            const css = this.data.filter(s => s.starbase && s.starbase.tier === 6).map(s => `${s.closestFaction} ${s.name}`);
            placeholderDiv.innerHTML = `
                <div class="placeholder-content">
                    <h3>Start Exploring</h3>
                    <p>${this.data.length} systems, ${this.data.reduce((n, s) => n + (s.planets || []).length, 0)} planets, ${this.allResources.size} deposit types. Pick a faction to see its systems drawn as orreries, then narrow by planet type, system or resource.</p>
                    <div class="quick-picks">
                        <button type="button" class="quick faction-mud" data-quick="faction" data-value="MUD">MUD territory</button>
                        <button type="button" class="quick faction-oni" data-quick="faction" data-value="ONI">ONI territory</button>
                        <button type="button" class="quick faction-ust" data-quick="faction" data-value="UST">USTUR territory</button>
                    </div>
                    <div class="placeholder-tips">
                        <div class="tip"><strong>${kings} king systems</strong> anchor the regions; the three Central Space Stations are ${css.join(', ')}.</div>
                        <div class="tip"><strong>Orreries</strong> are drawn from each planet's orbit, angle and size in the data. Belts are dotted rings.</div>
                        <div class="tip"><strong>Richness bars</strong> compare a deposit with the richest deposit of the same resource in Galia.</div>
                        <div class="tip"><strong>Resources</strong> on the right narrow to planets that hold them, tier badges from the resources table.</div>
                    </div>
                </div>
            `;
            placeholderDiv.addEventListener('click', (e) => {
                const q = e.target.closest('[data-quick]');
                if (!q) return;
                const box = document.getElementById(`${q.dataset.quick}-${q.dataset.value}`);
                if (box) { box.checked = true; box.dispatchEvent(new Event('change', { bubbles: true })); }
            });
            grid.appendChild(placeholderDiv);
            return;
        }

        if (this.filteredData.length === 0) {
            // Show no results message
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results-placeholder';
            noResultsDiv.innerHTML = `
                <div class="placeholder-content">
                    <div class="placeholder-icon">🚫</div>
                    <h3>No Results Found</h3>
                    <p>No systems match your current filters. Try adjusting your search terms or selected filters.</p>
                </div>
            `;
            grid.appendChild(noResultsDiv);
            return;
        }

        // Render collapsed rows in chunks so the first screen paints at once; a row draws its orrery
        // and planet list only when expanded. Small result sets open expanded.
        const expandAll = this.filteredData.length <= 6;
        if (this.renderToken) cancelAnimationFrame(this.renderToken);
        const list = this.filteredData;
        let i = 0;
        const step = () => {
            const frag = document.createDocumentFragment();
            const end = Math.min(i + 40, list.length);
            for (; i < end; i++) frag.appendChild(this.createSystemCard(list[i], expandAll));
            grid.appendChild(frag);
            if (i < list.length) this.renderToken = requestAnimationFrame(step);
        };
        step();
    }

    // Fill a collapsed card's body (orrery + planet rows) the first time it opens.
    expandSystemCard(card, system) {
        if (card.dataset.filled) return;
        card.dataset.filled = '1';
        const planets = system.planets || [];
        const matching = this.getMatchingPlanets(planets);
        const highlight = matching.length !== planets.length ? new Set(matching.map(p => planets.indexOf(p))) : null;
        card.querySelector('.sys-visual').innerHTML = window.Orrery.renderOrrerySVG(system, { size: 200, highlight });
        card.querySelector('.planets-list').innerHTML = this.createPlanetsPreviewHTML(planets);
    }

    createSystemCard(system, expanded) {
        const card = document.createElement('div');
        card.className = 'system-card' + (expanded ? ' open' : '');

        const planets = system.planets || [];
        const matching = this.getMatchingPlanets(planets);
        const deposits = planets.reduce((n, p) => n + (p.resources ? p.resources.length : 0), 0);
        const region = this.regionOf(system);
        const shown = matching.length !== planets.length ? `${matching.length}/${planets.length}` : `${planets.length}`;

        card.innerHTML = `
            <div class="sys-head" role="button" tabindex="0" aria-expanded="${expanded ? 'true' : 'false'}">
                <span class="chev" aria-hidden="true"></span>
                <div class="system-name">${system.name}${system.code ? ` <span class="system-code">${system.code}</span>` : ''}</div>
                <div class="sys-region">${region.name}${region.tiers ? ` <em>${region.tiers} raws</em>` : ''}</div>
                <div class="badges">${this.systemBadgesHTML(system)}</div>
                <div class="sys-facts">
                    <span><b>${shown}</b> planets</span>
                    <span><b>${deposits}</b> deposits</span>
                    <span><b>${system.links ? system.links.length : 0}</b> links</span>
                </div>
                <button type="button" class="sys-open" data-open="1">System view</button>
            </div>
            <div class="sys-detail">
                <div class="sys-visual"></div>
                <div class="sys-body">
                    <div class="planets-list"></div>
                    <div class="sys-hint">Click a planet for its deposits, the orrery for the system</div>
                </div>
            </div>
        `;
        if (expanded) this.expandSystemCard(card, system);

        // One delegated handler: header toggles, "System view" and the orrery open the system,
        // a planet row or an orrery body opens the planet.
        card.addEventListener('click', (e) => {
            if (e.target.closest('[data-open]') || e.target.closest('.sys-visual svg') && !e.target.closest('[data-planet]')) {
                e.stopPropagation();
                this.showSystemModal(system);
                return;
            }
            const hit = e.target.closest('[data-planet]');
            if (hit && planets[+hit.dataset.planet]) {
                e.stopPropagation();
                this.showPlanetModal(planets[+hit.dataset.planet], system);
                return;
            }
            if (e.target.closest('.sys-head')) {
                const open = card.classList.toggle('open');
                card.querySelector('.sys-head').setAttribute('aria-expanded', open ? 'true' : 'false');
                if (open) this.expandSystemCard(card, system);
                if (window.spaceSounds) open ? window.spaceSounds.expand() : window.spaceSounds.collapse();
            }
        });
        card.querySelector('.sys-head').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.target.click(); }
        });

        return card;
    }

    createPlanetsPreviewHTML(planets) {
        const selectedResources = this.selectedFilters.get('resource');
        const resourceActive = selectedResources && selectedResources.size > 0;
        return this.getMatchingPlanets(planets).map(planet => {
            const resources = planet.resources || [];
            const idx = planets.indexOf(planet);
            const cat = getPlanetCategory(planet.type);
            const cs = window.Orrery.CATEGORY_STYLE[cat] || {};
            // With a resource filter on, show only the matching deposits (that is what the user searched for)
            const shown = resourceActive ? resources.filter(r => selectedResources.has(r.name)) : resources;
            const tags = shown.map(r => this.richnessBarHTML(r)).join('');
            const count = resourceActive ? `${shown.length}/${resources.length}` : `${resources.length}`;
            return `
                <div class="planet-row" data-planet="${idx}">
                    <i class="pdot" style="--c:${cs.base || '#999'}"></i>
                    <div class="planet-row-main">
                        <div class="planet-row-head">
                            <span class="planet-name">${planet.name}${planet.code ? ` <span class="system-code">${planet.code}</span>` : ''}</span>
                            <span class="planet-cat">${cat}</span>
                            <span class="planet-count">${count} deposits</span>
                        </div>
                        <div class="rtags">${tags || '<span class="no-resources">No matching deposits</span>'}</div>
                    </div>
                </div>`;
        }).join('');
    }

    // The data names its own star types (0 White Dwarf, 1 Red Dwarf, 2 Solar, 3 Hot Blue, 4 Red Giant);
    // accept a system or a bare type for older callers.
    getStarTypeName(systemOrType) {
        if (systemOrType && typeof systemOrType === 'object') {
            return (systemOrType.star && systemOrType.star.name) || 'Unknown star';
        }
        const names = { 0: 'White Dwarf', 1: 'Red Dwarf', 2: 'Solar', 3: 'Hot Blue', 4: 'Red Giant' };
        return names[systemOrType] || 'Unknown star';
    }

    showSystemModal(system) {
        const modal = document.getElementById('planetModal');
        const modalContent = document.getElementById('modalContent');
        if (window.spaceSounds) window.spaceSounds.openPopup();

        const planets = system.planets || [];
        const planetCount = planets.length;
        const shownPlanetCount = this.getMatchingPlanets(planets).length;
        const totalResources = planets.reduce((sum, planet) => sum + (planet.resources ? planet.resources.length : 0), 0);
        const region = this.regionOf(system);
        const extraStars = (system.stars || []).map(s => s.name).filter(Boolean);
        const sb = system.starbase && system.starbase.tier != null ? system.starbase.tier : null;

        const linkLabel = (key) => {
            const target = this.systemByKey?.get(key);
            if (!target) return `<span class="link-tag">${key}</span>`;
            return `<button type="button" class="link-tag" data-system="${key}">${target.code ? `${target.code} · ` : ''}${target.name}</button>`;
        };

        modalContent.innerHTML = `
            <div class="sysmodal">
                <div class="sysmodal-visual">
                    ${window.Orrery.renderOrrerySVG(system, { size: 420, animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches, labels: true })}
                </div>
                <div class="sysmodal-info">
                    <h2>${system.name}${system.code ? ` <span class="system-code">${system.code}</span>` : ''}</h2>
                    <div class="badges">${this.systemBadgesHTML(system)}</div>
                    <dl class="facts">
                        <dt>Region</dt><dd>${region.name}${region.tiers ? ` · raws ${region.tiers}` : ''}${region.zone ? ` · ${region.zone}` : ''}</dd>
                        <dt>Star</dt><dd>${this.getStarTypeName(system)} · scale ${system.star?.scale ?? '?'}${extraStars.length ? `<br><small>${extraStars.join(', ')}</small>` : ''}</dd>
                        <dt>Starbase</dt><dd>${sb == null ? 'none' : sb === 6 ? 'Central Space Station (L6)' : sb === 0 ? 'none (L0)' : `Level ${sb}`}</dd>
                        <dt>Planets</dt><dd>${planetCount} with ${totalResources} deposits</dd>
                        <dt>Scores</dt><dd>strategic ${system.strategicScore} · richness ${system.richnessScore ?? '?'}</dd>
                        <dt>Position</dt><dd>${system.coordinates ? `${system.coordinates[0].toFixed(2)}, ${system.coordinates[1].toFixed(2)}` : 'unknown'}</dd>
                        <dt>Control</dt><dd>${system.controllingFaction || 'none'} (territory ${system.closestFaction || '?'})</dd>
                    </dl>
                    ${system.links && system.links.length ? `<h4>Warp links (${system.links.length})</h4><div class="system-links">${system.links.map(linkLabel).join('')}</div>` : '<h4>Warp links</h4><div class="muted">None recorded in this export</div>'}
                </div>
            </div>

            <h3>Planets (${shownPlanetCount === planetCount ? planetCount : `${shownPlanetCount}/${planetCount}`})</h3>
            <div class="detailed-planets">
                ${this.createDetailedPlanetsHTML(planets)}
            </div>
        `;

        // planet rows and orrery bodies open the planet; link tags jump to the linked system
        modalContent.onclick = (e) => {
            const link = e.target.closest('[data-system]');
            if (link) { const t = this.systemByKey.get(link.dataset.system); if (t) this.showSystemModal(t); return; }
            const hit = e.target.closest('[data-planet]');
            if (hit && planets[+hit.dataset.planet]) this.showPlanetModal(planets[+hit.dataset.planet], system);
        };
        modal.style.display = 'flex';
        modal.scrollTop = 0;
    }

    showPlanetModal(planet, system) {
        const modal = document.getElementById('planetModal');
        const modalContent = document.getElementById('modalContent');
        if (window.spaceSounds) window.spaceSounds.openPopup();

        const cat = getPlanetCategory(planet.type);
        const faction = getPlanetFaction(planet.type);
        const resources = (planet.resources || []).slice().sort((a, b) => (this.tierOf(b.name) || 0) - (this.tierOf(a.name) || 0) || b.richness - a.richness);
        const stakeable = cat !== 'Asteroid Belt';
        const sysName = system ? `${system.name}${system.code ? ` (${system.code})` : ''}` : '';

        modalContent.innerHTML = `
            <div class="planetmodal">
                <div class="planetmodal-visual">${window.Orrery.planetSphereHTML(planet, 180)}</div>
                <div class="planetmodal-info">
                    <h2>${planet.name}${planet.code ? ` <span class="system-code">${planet.code}</span>` : ''}</h2>
                    <div class="badges">
                        <span class="badge faction-${faction.toLowerCase()}">${faction}</span>
                        <span class="badge cat">${cat}</span>
                        <span class="badge ${stakeable ? 'safe' : 'risk'}" title="${stakeable ? 'Can hold a claim stake' : 'No central hub: cannot hold a claim stake, mining ships only'}">${stakeable ? 'Claim stakes OK' : 'Ships only'}</span>
                    </div>
                    <dl class="facts">
                        ${system ? `<dt>System</dt><dd><button type="button" class="link-tag" data-back="1">${sysName}</button></dd>` : ''}
                        <dt>Orbit</dt><dd>${planet.orbit != null ? planet.orbit.toFixed(2) : '?'} · angle ${planet.angle ?? '?'}°</dd>
                        <dt>Size</dt><dd>scale ${planet.scale ?? '?'}</dd>
                        <dt>Deposits</dt><dd>${resources.length}${resources.length ? ` · best tier T${Math.max(...resources.map(r => this.tierOf(r.name) || 1))}` : ''}</dd>
                    </dl>
                </div>
            </div>
            <h3>Deposits (${resources.length})</h3>
            <p class="muted">Richness bars compare each deposit with the richest deposit of the same resource anywhere in Galia.</p>
            <div class="resource-details">${this.createResourceDetailsHTML(resources)}</div>
        `;
        modalContent.onclick = (e) => {
            if (e.target.closest('[data-back]') && system) this.showSystemModal(system);
        };
        modal.style.display = 'flex';
        modal.scrollTop = 0;
    }

    createDetailedPlanetsHTML(planets) {
        return this.getMatchingPlanets(planets).map(planet => {
            const resources = planet.resources || [];
            const idx = planets.indexOf(planet);
            const cat = getPlanetCategory(planet.type);
            return `
                <div class="detailed-planet-card" data-planet="${idx}">
                    ${window.Orrery.planetSphereHTML(planet, 64)}
                    <div class="dp-body">
                        <div class="planet-header">
                            <h4>${planet.name}${planet.code ? ` <span class="system-code">${planet.code}</span>` : ''}</h4>
                            <span class="planet-cat">${cat}</span>
                            <span class="planet-count">orbit ${planet.orbit != null ? planet.orbit.toFixed(2) : '?'} · scale ${planet.scale ?? '?'}</span>
                        </div>
                        <div class="rtags">${resources.length ? resources.map(r => this.richnessBarHTML(r)).join('') : '<span class="no-resources">No deposits</span>'}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    createResourceDetailsHTML(resources) {
        return resources.map(resource => {
            const max = this.maxRichness.get(resource.name) || resource.richness || 1;
            const pct = Math.max(3, Math.round(100 * (resource.richness || 0) / max));
            const tier = this.tierOf(resource.name);
            const info = this.resourceInfo.get(resource.name) || {};
            return `
            <div class="resource-card">
                <div class="resource-name">${tier ? `<b class="t t${tier}">T${tier}</b>` : ''}${resource.name}</div>
                <div class="resource-richness">Richness <b>${resource.richness}</b> <span class="muted">of ${max} best · ${pct}%</span></div>
                <div class="richness-bar"><div class="richness-fill" style="width: ${pct}%"></div></div>
                <div class="resource-type-id">${info.category || 'raw'}${info.faction ? ` · ${info.faction} exclusive` : ''}</div>
            </div>`;
        }).join('');
    }

    getPlanetTypeName(type) {
        // Use shared utility from PlanetTypeUtils.js
        return getPlanetTypeName(type);
    }
}