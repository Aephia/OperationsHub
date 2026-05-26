class PlanetExplorer extends BaseExplorer {
    constructor(data) {
        super(data);

        // Initialize properties after calling super
        this.allResources = new Set();

        // Now initialize properly
        this.initialize();
    }

    extractMetadata() {
        this.allResources.clear();
        this.data.forEach(system => {
            if (system.planets) {
                system.planets.forEach(planet => {
                    if (planet.resources) {
                        planet.resources.forEach(resource => {
                            this.allResources.add(resource.name);
                        });
                    }
                });
            }
        });
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
        // Group systems by region (first 3 chars of the name) + faction
        const entries = systems.map(system => ({
            value: system.key,
            label: system.name,
            group: `${(system.name || '').slice(0, 3)} - ${system.closestFaction || '???'}`
        }));
        this.renderGroupedCheckboxes('systemCheckboxes', 'system', entries);
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
    // { value, label, group }. Preserves checked state for entries still present,
    // prunes the stored selection, and auto-expands groups with an active selection.
    renderGroupedCheckboxes(containerId, filterType, entries) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const previouslyChecked = this.selectedFilters.get(filterType) || new Set();

        const groups = new Map();
        entries.forEach(entry => {
            if (!groups.has(entry.group)) groups.set(entry.group, []);
            groups.get(entry.group).push(entry);
        });

        container.innerHTML = '';
        const stillChecked = new Set();

        Array.from(groups.keys()).sort().forEach(groupKey => {
            const groupEntries = groups.get(groupKey)
                .sort((a, b) => a.label.localeCompare(b.label));

            const details = document.createElement('details');
            details.className = 'collapsible-group';

            const summary = document.createElement('summary');
            summary.className = 'collapsible-group-title';
            summary.textContent = `${groupKey} (${groupEntries.length})`;
            details.appendChild(summary);

            let groupHasChecked = false;
            groupEntries.forEach(({ value, label }) => {
                const item = document.createElement('div');
                item.className = 'checkbox-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `${filterType}-${value}`;
                checkbox.value = value;
                if (previouslyChecked.has(value)) {
                    checkbox.checked = true;
                    stillChecked.add(value);
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
                labelEl.textContent = label;

                item.appendChild(checkbox);
                item.appendChild(labelEl);
                details.appendChild(item);
            });

            // Keep a group expanded if it contains an active selection
            if (groupHasChecked) details.open = true;

            container.appendChild(details);
        });

        this.selectedFilters.set(filterType, stillChecked);
    }

    // When an upstream (faction / planet type) filter changes, narrow the dependent
    // System and Resource option lists before re-applying.
    handleFilterChange(filterType) {
        super.handleFilterChange(filterType);
        if (filterType === 'faction' || filterType === 'planetType') {
            this.refreshDependentLists();
            this.applyFilters();
        }
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
            placeholderDiv.innerHTML = `
                <div class="placeholder-content">
                    <div class="placeholder-icon">🔍</div>
                    <h3>Start Exploring</h3>
                    <p>Select filters from the sidebars to begin exploring the galaxy.</p>
                    <div class="placeholder-tips">
                        <div class="tip">⚔️ <strong>Faction:</strong> Filter systems by ONI, MUD, or UST</div>
                        <div class="tip">🪐 <strong>Planet Type:</strong> Narrow to Gas Giants, Asteroid Belts, and more</div>
                        <div class="tip">⭐ <strong>Systems:</strong> Check boxes on the left to filter by specific systems</div>
                        <div class="tip">💎 <strong>Resources:</strong> Check boxes on the right to find systems with specific resources</div>
                    </div>
                </div>
            `;
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

        // Render filtered systems
        this.filteredData.forEach(system => {
            const systemCard = this.createSystemCard(system);
            grid.appendChild(systemCard);
        });
    }

    createSystemCard(system) {
        const card = document.createElement('div');
        card.className = 'system-card';

        const starTypeName = this.getStarTypeName(system.star?.type);
        const planetCount = system.planets ? system.planets.length : 0;

        card.innerHTML = `
            <div class="system-header">
                <div class="system-name">${system.name}</div>
                <div class="star-type">${starTypeName}</div>
            </div>
            <div class="system-info">
                <div class="info-item">Planets: ${planetCount}</div>
                <div class="info-item">Faction: ${system.closestFaction || 'Unknown'}</div>
                <div class="info-item">Strategic Score: ${system.strategicScore}</div>
                <div class="info-item">Links: ${system.links ? system.links.length : 0}</div>
            </div>
            <div class="planets-list">
                <div class="planets-header">Planets & Resources (Click system for details)</div>
                ${this.createPlanetsPreviewHTML(system.planets || [])}
            </div>
        `;

        // Add click handler for the entire system card
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on a planet item
            if (!e.target.closest('.planet-item')) {
                this.showSystemModal(system);
            }
        });

        return card;
    }

    createPlanetsPreviewHTML(planets) {
        return this.getMatchingPlanets(planets).map(planet => {
            const resources = planet.resources || [];
            const planetTypeName = this.getPlanetTypeName(planet.type);

            // Narrow displayed resources to the selected resource filter (if any)
            let filteredResources = resources;
            const selectedResources = this.selectedFilters.get('resource');
            if (selectedResources && selectedResources.size > 0) {
                filteredResources = filteredResources.filter(resource =>
                    selectedResources.has(resource.name)
                );
            }

            // Show filtered resources with richness information
            const resourceTags = filteredResources.map(resource => {
                const richnessStars = '★'.repeat(resource.richness) + '☆'.repeat(5 - resource.richness);
                return `<span class="resource-tag" title="Richness: ${resource.richness}/5">${resource.name} ${richnessStars}</span>`;
            }).join('');

            const planetDiv = document.createElement('div');
            planetDiv.className = 'planet-item';

            // Show resource count based on what filters are active
            let resourceCountText = resources.length.toString();
            if (selectedResources && selectedResources.size > 0) {
                resourceCountText = `${filteredResources.length}/${resources.length}`;
            }

            planetDiv.innerHTML = `
                <div class="planet-header-info">
                    <div class="planet-name">🪐 ${planet.name}</div>
                    <div class="planet-type">${planetTypeName}</div>
                    <div class="planet-meta">
                        Orbit: ${planet.orbit?.toFixed(2) || 'N/A'} |
                        Scale: ${planet.scale || 'N/A'} |
                        Resources: ${resourceCountText}
                    </div>
                </div>
                <div class="resources">
                    ${resourceTags || '<span class="no-resources">No matching resources found</span>'}
                </div>
            `;

            planetDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showPlanetModal(planet);
            });

            return planetDiv.outerHTML;
        }).join('');
    }

    getStarTypeName(type) {
        const starTypes = {
            1: 'Red Dwarf',
            2: 'Yellow Dwarf',
            3: 'Blue Giant',
            4: 'White Dwarf',
            5: 'Red Giant'
        };
        return starTypes[type] || 'Unknown';
    }

    showSystemModal(system) {
        const modal = document.getElementById('planetModal');
        const modalContent = document.getElementById('modalContent');

        const starTypeName = this.getStarTypeName(system.star?.type);
        const planetCount = system.planets ? system.planets.length : 0;
        const shownPlanetCount = this.getMatchingPlanets(system.planets || []).length;
        const totalResources = system.planets ?
            system.planets.reduce((sum, planet) => sum + (planet.resources ? planet.resources.length : 0), 0) : 0;

        modalContent.innerHTML = `
            <h2>🌟 ${system.name}</h2>

            <div class="system-details">
                <div class="system-overview">
                    <h3>System Overview</h3>
                    <div class="system-info">
                        <div class="info-item">Star Type: ${starTypeName}</div>
                        <div class="info-item">Star Scale: ${system.star?.scale || 'Unknown'}</div>
                        <div class="info-item">Planets: ${planetCount}</div>
                        <div class="info-item">Total Resources: ${totalResources}</div>
                        <div class="info-item">Faction: ${system.closestFaction || 'Unknown'}</div>
                        <div class="info-item">Strategic Score: ${system.strategicScore}</div>
                        <div class="info-item">System Key: ${system.key}</div>
                        <div class="info-item">Main Planet: ${system.mainPlanet || 'Unknown'}</div>
                    </div>

                    ${system.coordinates ? `
                        <h4>Coordinates</h4>
                        <div class="coordinates">
                            X: ${system.coordinates[0]?.toFixed(4)}, Y: ${system.coordinates[1]?.toFixed(4)}
                        </div>
                    ` : ''}

                    ${system.links && system.links.length > 0 ? `
                        <h4>Connected Systems (${system.links.length})</h4>
                        <div class="system-links">
                            ${system.links.map(link => `<span class="link-tag">${link}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>

            <h3>🪐 Planets in ${system.name} (${shownPlanetCount === planetCount ? planetCount : `${shownPlanetCount}/${planetCount}`})</h3>
            <div class="detailed-planets">
                ${this.createDetailedPlanetsHTML(system.planets || [])}
            </div>
        `;

        modal.style.display = 'block';
    }

    showPlanetModal(planet) {
        const modal = document.getElementById('planetModal');
        const modalContent = document.getElementById('modalContent');

        modalContent.innerHTML = `
            <h2>${planet.name}</h2>
            <div class="system-info">
                <div class="info-item">Type: ${this.getPlanetTypeName(planet.type)}</div>
                <div class="info-item">Orbit: ${planet.orbit?.toFixed(2) || 'Unknown'}</div>
                <div class="info-item">Scale: ${planet.scale || 'Unknown'}</div>
                <div class="info-item">Angle: ${planet.angle || 'Unknown'}°</div>
            </div>

            <h3>Resources (${planet.resources ? planet.resources.length : 0})</h3>
            <div class="resource-details">
                ${this.createResourceDetailsHTML(planet.resources || [])}
            </div>
        `;

        modal.style.display = 'block';
    }

    createDetailedPlanetsHTML(planets) {
        return this.getMatchingPlanets(planets).map(planet => {
            const resources = planet.resources || [];
            const planetTypeName = this.getPlanetTypeName(planet.type);

            return `
                <div class="detailed-planet-card">
                    <div class="planet-header">
                        <h4>🪐 ${planet.name}</h4>
                        <span class="planet-type-badge">${planetTypeName}</span>
                    </div>

                    <div class="planet-meta">
                        <div class="meta-grid">
                            <div class="meta-item">
                                <span class="meta-label">Orbit:</span>
                                <span class="meta-value">${planet.orbit?.toFixed(2) || 'Unknown'}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Scale:</span>
                                <span class="meta-value">${planet.scale || 'Unknown'}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Angle:</span>
                                <span class="meta-value">${planet.angle || 'Unknown'}°</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Type ID:</span>
                                <span class="meta-value">${planet.type}</span>
                            </div>
                        </div>
                    </div>

                    <div class="planet-resources">
                        <h5>Resources (${resources.length})</h5>
                        ${resources.length > 0 ? `
                            <div class="resource-details">
                                ${this.createResourceDetailsHTML(resources)}
                            </div>
                        ` : '<div class="no-resources">No resources found on this planet</div>'}
                    </div>
                </div>
            `;
        }).join('');
    }

    createResourceDetailsHTML(resources) {
        return resources.map(resource => `
            <div class="resource-card">
                <div class="resource-name">${resource.name}</div>
                <div class="resource-richness">Richness: ${resource.richness}/5</div>
                <div class="richness-bar">
                    <div class="richness-fill" style="width: ${(resource.richness / 5) * 100}%"></div>
                </div>
                <div class="resource-type-id">Type ID: ${resource.type}</div>
            </div>
        `).join('');
    }

    getPlanetTypeName(type) {
        // Use shared utility from PlanetTypeUtils.js
        return getPlanetTypeName(type);
    }
}