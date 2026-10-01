// Resource Analytics (Planet Explorer > Analytics > Resource Analytics), rebuilt 2026-09-30.
// Regions are the map data's own regionDefinitions (names like Exodus, Verzan), not a code prefix.
// Richness is only comparable WITHIN a resource (tier-1 ores run to 7.0, tiers 2-5 stay under 2.2),
// so nothing here ranks resources against each other by richness.
class PlanetResourceAnalytics extends BaseAnalytics {
    constructor(data) {
        super(data);
        this.resourceAnalytics = null;
        this.atlasSort = 'tier';
        this.atlasQuery = '';
    }

    regionName(system) {
        if (!this.regionById) {
            this.regionById = new Map();
            ((window.planetData && window.planetData.regionDefinitions) || []).forEach(r => this.regionById.set(r.id, r.name));
        }
        return this.regionById.get(system.regionId) || `${system.closestFaction || '?'}-${(system.code || system.name).substring(0, 3)}`;
    }

    resourceMeta(name) {
        if (!this.resourceInfo) {
            this.resourceInfo = new Map();
            ((window.resourcesData && window.resourcesData.resources) || []).forEach(r => this.resourceInfo.set(r.name, r));
        }
        return this.resourceInfo.get(name) || {};
    }

    generateAnalytics() {
        const resourceCounts = new Map();
        const resourceRichness = new Map();
        const systemResourceCounts = new Map();
        const locationData = new Map();
        const regionResourceMap = new Map();
        const byCategory = new Map();
        const byTier = new Map();
        const tierByFaction = new Map();     // faction -> tier -> deposits
        const allRegions = new Set();
        let totalDeposits = 0;

        this.data.forEach(system => {
            if (!system.planets) return;
            const region = this.regionName(system);
            allRegions.add(region);
            const faction = (system.closestFaction || '?').toUpperCase();
            let systemTotal = 0;
            const systemUnique = new Set();

            system.planets.forEach((planet, planetIndex) => {
                const category = typeof getPlanetCategory === 'function' ? getPlanetCategory(planet.type) : 'Unknown';
                (planet.resources || []).forEach(resource => {
                    const name = resource.name;
                    totalDeposits++;
                    systemTotal++;
                    systemUnique.add(name);
                    resourceCounts.set(name, (resourceCounts.get(name) || 0) + 1);
                    if (!resourceRichness.has(name)) resourceRichness.set(name, []);
                    resourceRichness.get(name).push(resource.richness);
                    if (!locationData.has(name)) locationData.set(name, []);
                    locationData.get(name).push({
                        system: system.name, systemKey: system.key, systemCode: system.code || null,
                        planet: planet.name, planetIndex, richness: resource.richness, region, faction, category
                    });
                    if (!regionResourceMap.has(name)) regionResourceMap.set(name, new Set());
                    regionResourceMap.get(name).add(region);
                    byCategory.set(category, (byCategory.get(category) || 0) + 1);
                    const tier = this.resourceMeta(name).tier || 0;
                    byTier.set(tier, (byTier.get(tier) || 0) + 1);
                    if (!tierByFaction.has(faction)) tierByFaction.set(faction, new Map());
                    const tf = tierByFaction.get(faction);
                    tf.set(tier, (tf.get(tier) || 0) + 1);
                });
            });
            systemResourceCounts.set(system.name, { count: systemTotal, uniqueCount: systemUnique.size, system });
        });

        const totalRegions = allRegions.size;

        // Atlas rows: one per resource
        const atlas = Array.from(resourceCounts.keys()).map(name => {
            const locs = locationData.get(name) || [];
            const rich = resourceRichness.get(name) || [];
            const sorted = rich.slice().sort((a, b) => a - b);
            const meta = this.resourceMeta(name);
            const best = locs.reduce((b, l) => (!b || l.richness > b.richness ? l : b), null);
            return {
                name, tier: meta.tier || 0, category: meta.category || 'raw', faction: meta.faction || null,
                deposits: locs.length,
                systems: new Set(locs.map(l => l.systemKey)).size,
                regions: (regionResourceMap.get(name) || new Set()).size,
                maxRichness: sorted.length ? sorted[sorted.length - 1] : 0,
                medianRichness: sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0,
                minRichness: sorted.length ? sorted[0] : 0,
                best
            };
        });

        const regionallyLimitedResources = Array.from(regionResourceMap.entries())
            .filter(([, regions]) => regions.size < totalRegions)
            .map(([name, regions]) => ({
                name,
                tier: this.resourceMeta(name).tier || 0,
                presentInRegions: regions.size,
                totalRegions,
                missingFromRegions: totalRegions - regions.size,
                regions: Array.from(regions).sort(),
                missingRegions: Array.from(allRegions).filter(r => !regions.has(r)).sort(),
                totalLocations: resourceCounts.get(name) || 0,
                averageRichness: resourceRichness.has(name)
                    ? (resourceRichness.get(name).reduce((a, b) => a + b, 0) / resourceRichness.get(name).length).toFixed(2)
                    : 0
            }))
            .sort((a, b) => a.presentInRegions - b.presentInRegions || a.name.localeCompare(b.name));

        const topLocations = Array.from(systemResourceCounts.entries())
            .sort((a, b) => b[1].uniqueCount - a[1].uniqueCount || b[1].count - a[1].count)
            .slice(0, 30);

        const allRich = Array.from(resourceRichness.values()).flat();
        this.resourceAnalytics = {
            atlas,
            topLocations,
            totalResources: totalDeposits,
            totalDeposits,
            averageRichness: (allRich.reduce((a, b) => a + b, 0) / (allRich.length || 1)).toFixed(2),
            resourceCounts,
            locationData,
            regionallyLimitedResources,
            totalRegions,
            allRegions: Array.from(allRegions).sort(),
            byCategory, byTier, tierByFaction,
            // kept for older callers
            highestQualityResources: atlas.slice().sort((a, b) => b.maxRichness - a.maxRichness).slice(0, 30)
        };
    }

    updateStats() {
        const a = this.resourceAnalytics;
        if (!a) return;
        const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        set('totalDeposits', a.totalDeposits.toLocaleString());
        set('totalResourceTypes', a.atlas.length);
        set('regionalResourcesCount', a.regionallyLimitedResources.length);
        set('totalRegions', a.totalRegions);
        set('averageRichness', a.averageRichness);
        set('topSystemsCount', a.topLocations.length);
    }

    renderAnalytics() {
        this.generateAnalytics();
        super.renderAnalytics();
        if (!this.resourceAnalytics) return;
        this.renderCharts();
        this.renderAtlas();
        this.renderRegional();
        this.renderTopLocations();
    }

    esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    // ---- charts: plain HTML bars, one colour per series, faction colours only where faction is the series
    barChart(title, note, rows, opts) {
        const max = Math.max(...rows.map(r => r.value), 1);
        const o = Object.assign({ unit: '', cls: '' }, opts || {});
        return `
            <div class="chart ${o.cls}">
                <h4>${this.esc(title)}</h4>
                ${note ? `<p class="chart-note">${note}</p>` : ''}
                <div class="bars">${rows.map(r => `
                    <div class="bar-row" title="${this.esc(r.label)}: ${r.value.toLocaleString()}${o.unit}">
                        <span class="bar-label">${this.esc(r.label)}</span>
                        <span class="bar-track"><i style="width:${(100 * r.value / max).toFixed(1)}%"></i></span>
                        <span class="bar-value">${r.value.toLocaleString()}</span>
                    </div>`).join('')}
                </div>
            </div>`;
    }

    stackedChart(title, note, rows, series) {
        // rows: [{label, parts: {seriesKey: value}}]; series: [{key, label, cls}]
        const max = Math.max(...rows.map(r => series.reduce((s, k) => s + (r.parts[k.key] || 0), 0)), 1);
        return `
            <div class="chart">
                <h4>${this.esc(title)}</h4>
                ${note ? `<p class="chart-note">${note}</p>` : ''}
                <div class="legend">${series.map(s => `<span><i class="${s.cls}"></i>${this.esc(s.label)}</span>`).join('')}</div>
                <div class="bars">${rows.map(r => {
                    const total = series.reduce((s, k) => s + (r.parts[k.key] || 0), 0);
                    return `
                    <div class="bar-row" title="${this.esc(r.label)}: ${series.map(s => `${s.label} ${(r.parts[s.key] || 0).toLocaleString()}`).join(', ')}">
                        <span class="bar-label">${this.esc(r.label)}</span>
                        <span class="bar-track stacked">${series.map(s => `<i class="${s.cls}" style="width:${(100 * (r.parts[s.key] || 0) / max).toFixed(2)}%"></i>`).join('')}</span>
                        <span class="bar-value">${total.toLocaleString()}</span>
                    </div>`;
                }).join('')}
                </div>
            </div>`;
    }

    renderCharts() {
        const a = this.resourceAnalytics;
        const el = document.getElementById('resourceCharts');
        if (!el) return;
        const catOrder = typeof getPlanetCategories === 'function' ? getPlanetCategories() : Array.from(a.byCategory.keys());
        const catRows = catOrder.filter(c => a.byCategory.has(c)).map(c => ({ label: c.replace(' Planet', ''), value: a.byCategory.get(c) }))
            .sort((x, y) => y.value - x.value);
        const tiers = [1, 2, 3, 4, 5];
        const tierRows = tiers.map(t => ({ label: `Tier ${t}`, value: a.byTier.get(t) || 0 }));
        const factions = [{ key: 'MUD', label: 'MUD', cls: 'f-mud' }, { key: 'ONI', label: 'ONI', cls: 'f-oni' }, { key: 'UST', label: 'USTUR', cls: 'f-ust' }];
        const mixRows = tiers.map(t => ({ label: `Tier ${t}`, parts: Object.fromEntries(factions.map(f => [f.key, (a.tierByFaction.get(f.key) || new Map()).get(t) || 0])) }));
        el.innerHTML =
            this.barChart('Deposits by planet category', 'Where the deposits are, across all 3,901 planets.', catRows) +
            this.barChart('Deposits by resource tier', 'Tier from the resources table; tier 1 is the bulk of every planet.', tierRows) +
            this.stackedChart('Tier mix by territory', 'The same deposits split by the territory faction of the system.', mixRows, factions);
    }

    // ---- resource atlas
    sortedAtlas() {
        const q = this.atlasQuery.trim().toLowerCase();
        let rows = this.resourceAnalytics.atlas.filter(r => !q || r.name.toLowerCase().includes(q) || r.category.includes(q));
        const by = {
            tier: (x, y) => y.tier - x.tier || y.deposits - x.deposits || x.name.localeCompare(y.name),
            deposits: (x, y) => y.deposits - x.deposits || x.name.localeCompare(y.name),
            scarce: (x, y) => x.deposits - y.deposits || x.name.localeCompare(y.name),
            regions: (x, y) => x.regions - y.regions || x.deposits - y.deposits || x.name.localeCompare(y.name),
            name: (x, y) => x.name.localeCompare(y.name)
        };
        return rows.sort(by[this.atlasSort] || by.tier);
    }

    renderAtlas() {
        const el = document.getElementById('resourceAtlas');
        if (!el) return;
        const a = this.resourceAnalytics;
        const rows = this.sortedAtlas();
        const maxDep = Math.max(...a.atlas.map(r => r.deposits), 1);
        el.innerHTML = `
            <div class="atlas-head"><span></span><span>Resource</span><span>Deposits</span><span>Systems</span><span>Regions</span><span>Richness (min · median · best)</span></div>
            ${rows.map(r => `
            <div class="atlas-row" data-resource="${this.esc(r.name)}">
                <span class="t t${r.tier || 1}">T${r.tier || '?'}</span>
                <span class="atlas-name"><b>${this.esc(r.name)}</b><small>${this.esc(r.category)}${r.faction ? ` · ${this.esc(r.faction)} exclusive` : ''}</small></span>
                <span class="atlas-num" data-l="deposits"><i class="mini" style="width:${(100 * r.deposits / maxDep).toFixed(1)}%"></i>${r.deposits.toLocaleString()}</span>
                <span class="atlas-num" data-l="systems">${r.systems}</span>
                <span class="atlas-num ${r.regions < a.totalRegions ? 'warn' : ''}" data-l="regions">${r.regions}/${a.totalRegions}</span>
                <span class="atlas-rich"><span class="rrange"><i style="left:${(100 * r.minRichness / r.maxRichness).toFixed(1)}%;right:0"></i><b style="left:${(100 * r.medianRichness / r.maxRichness).toFixed(1)}%"></b></span><small>${r.minRichness} · ${r.medianRichness} · <b>${r.maxRichness}</b>${r.best ? ` on ${this.esc(r.best.planet)} (${this.esc(r.best.system)})` : ''}</small></span>
                <div class="atlas-detail"></div>
            </div>`).join('')}
            ${rows.length ? '' : '<div class="muted">No resource matches.</div>'}`;

        el.onclick = (e) => {
            const link = e.target.closest('[data-system-key]');
            if (link) { const s = this.data.find(x => x.key === link.dataset.systemKey); if (s && window.planetExplorer) window.planetExplorer.showSystemModal(s); return; }
            const row = e.target.closest('.atlas-row');
            if (!row) return;
            const open = row.classList.toggle('open');
            if (window.spaceSounds) open ? window.spaceSounds.expand() : window.spaceSounds.collapse();
            const detail = row.querySelector('.atlas-detail');
            if (open && !detail.innerHTML) {
                const locs = (a.locationData.get(row.dataset.resource) || []).slice().sort((x, y) => y.richness - x.richness || x.system.localeCompare(y.system)).slice(0, 10);
                detail.innerHTML = `<div class="atlas-top">${locs.map((l, i) => `
                    <button type="button" class="loc" data-system-key="${this.esc(l.systemKey)}">
                        <span class="loc-rank">${i + 1}</span>
                        <span class="loc-planet">${this.esc(l.planet)}</span>
                        <span class="loc-system">${this.esc(l.system)}${l.systemCode ? ` · ${this.esc(l.systemCode)}` : ''}</span>
                        <span class="loc-region">${this.esc(l.region)} · <i class="f-${l.faction.toLowerCase()}"></i>${this.esc(l.faction)}</span>
                        <span class="loc-rich">${l.richness}</span>
                    </button>`).join('')}</div>`;
            }
        };

        const search = document.getElementById('atlasSearch');
        const sort = document.getElementById('atlasSort');
        if (search && !search.dataset.bound) { search.dataset.bound = '1'; search.addEventListener('input', () => { this.atlasQuery = search.value; this.renderAtlas(); }); }
        if (sort && !sort.dataset.bound) { sort.dataset.bound = '1'; sort.addEventListener('change', () => { this.atlasSort = sort.value; this.renderAtlas(); }); }
        if (search) search.value = this.atlasQuery;
        if (sort) sort.value = this.atlasSort;
    }

    // ---- not in every region
    renderRegional() {
        const el = document.getElementById('regionallyLimitedResources');
        const a = this.resourceAnalytics;
        if (!el) return;
        el.innerHTML = a.regionallyLimitedResources.map(resource => `
            <div class="analysis-card regional">
                <div class="analysis-header">
                    <h4><span class="t t${resource.tier || 1}">T${resource.tier || '?'}</span>${this.esc(resource.name)}</h4>
                    <span class="regional-badge">${resource.presentInRegions}/${resource.totalRegions} regions</span>
                </div>
                <div class="analysis-stats">
                    <div class="stat-item"><span class="stat-label">Deposits</span><span class="stat-value">${resource.totalLocations}</span></div>
                    <div class="stat-item"><span class="stat-label">Missing from</span><span class="stat-value">${resource.missingFromRegions} regions</span></div>
                </div>
                <div class="region-tags">
                    ${this.getRegionsSortedByRichness(resource.name, resource.regions).map(r => `<span class="region-tag present clickable" data-resource="${this.esc(resource.name)}" data-region="${this.esc(r.region)}" title="Best deposit ${r.maxRichness}, ${r.count} deposits">${this.esc(r.region)} <small>${r.count}</small></span>`).join('')}
                </div>
            </div>`).join('');
        this.attachRegionTagHandlers();
    }

    // ---- most diverse systems
    renderTopLocations() {
        const el = document.getElementById('topLocations');
        const a = this.resourceAnalytics;
        if (!el) return;
        const max = a.topLocations[0] ? a.topLocations[0][1].uniqueCount : 1;
        el.innerHTML = a.topLocations.map(([name, d], i) => {
            const s = d.system;
            const f = (s.closestFaction || '?').toLowerCase();
            return `
            <button type="button" class="rank-bar" data-system-key="${this.esc(s.key)}" title="${this.esc(name)}: ${d.uniqueCount} distinct resources, ${d.count} deposits on ${s.planets ? s.planets.length : 0} planets">
                <span class="rank-n">${i + 1}</span>
                <span class="rank-name"><i class="f-${f}"></i>${this.esc(name)}${s.code ? ` <small>${this.esc(s.code)}</small>` : ''}</span>
                <span class="bar-track"><i style="width:${(100 * d.uniqueCount / max).toFixed(1)}%"></i></span>
                <span class="bar-value">${d.uniqueCount}</span>
                <span class="rank-sub">${d.count} deposits · ${s.planets ? s.planets.length : 0} planets</span>
            </button>`;
        }).join('');
        el.onclick = (e) => {
            const b = e.target.closest('[data-system-key]');
            if (!b) return;
            const system = this.data.find(s => s.key === b.dataset.systemKey);
            if (system && window.planetExplorer) window.planetExplorer.showSystemModal(system);
        };
    }

    attachRegionTagHandlers() {
        document.querySelectorAll('.region-tag.present.clickable').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showRegionLocationsPopup(tag.getAttribute('data-resource'), tag.getAttribute('data-region'));
            });
        });
    }

    showRegionLocationsPopup(resourceName, region) {
        const locations = this.getLocationsForRegion(resourceName, region);
        if (window.spaceSounds) window.spaceSounds.openPopup();
        const existingPopup = document.querySelector('.region-locations-popup');
        if (existingPopup) existingPopup.remove();

        const popup = document.createElement('div');
        popup.className = 'region-locations-popup';
        popup.innerHTML = `
            <div class="popup-overlay"></div>
            <div class="popup-content">
                <div class="popup-header">
                    <h3>${this.esc(resourceName)} in ${this.esc(region)}</h3>
                    <button class="popup-close">&times;</button>
                </div>
                <div class="popup-body">
                    <div class="locations-list">
                        ${locations.length > 0 ? locations.map(loc => `
                            <button type="button" class="location-item" data-system-key="${this.esc(loc.systemKey)}">
                                <span class="location-system">${this.esc(loc.system)}${loc.systemCode ? ` · ${this.esc(loc.systemCode)}` : ''}</span>
                                <span class="location-planet">${this.esc(loc.planet)}</span>
                                <span class="location-richness">Richness ${loc.richness}</span>
                            </button>
                        `).join('') : '<p>No locations found</p>'}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        const close = () => { if (window.spaceSounds) window.spaceSounds.closePopup(); popup.remove(); document.removeEventListener('keydown', handleEscape); };
        popup.querySelector('.popup-close').addEventListener('click', close);
        popup.querySelector('.popup-overlay').addEventListener('click', close);
        popup.querySelector('.locations-list').addEventListener('click', (e) => {
            const b = e.target.closest('[data-system-key]');
            if (!b) return;
            const system = this.data.find(s => s.key === b.dataset.systemKey);
            if (system && window.planetExplorer) { close(); window.planetExplorer.showSystemModal(system); }
        });
        const handleEscape = (e) => { if (e.key === 'Escape') close(); };
        document.addEventListener('keydown', handleEscape);
    }

    getLocationsForRegion(resourceName, region) {
        const locations = this.resourceAnalytics.locationData.get(resourceName) || [];
        return locations
            .filter(loc => loc.region === region)
            .sort((a, b) => b.richness - a.richness || a.system.localeCompare(b.system));
    }

    getRegionsSortedByRichness(resourceName, regions) {
        const locations = this.resourceAnalytics.locationData.get(resourceName) || [];
        return regions.map(region => {
            const rl = locations.filter(loc => loc.region === region);
            const avgRichness = rl.length ? rl.reduce((s, l) => s + l.richness, 0) / rl.length : 0;
            const maxRichness = rl.length ? Math.max(...rl.map(l => l.richness)) : 0;
            return { region, avgRichness, maxRichness, count: rl.length };
        }).sort((a, b) => b.maxRichness - a.maxRichness || b.count - a.count);
    }

    getResourceLocations(resourceName, limit = 5) {
        const locations = this.resourceAnalytics.locationData.get(resourceName) || [];
        return locations.slice().sort((a, b) => b.richness - a.richness).slice(0, limit)
            .map(l => `<span class="location-tag" title="${this.esc(l.system)} - ${this.esc(l.planet)}">${this.esc(l.system)} (${l.richness})</span>`).join('');
    }

    getAllResourceLocations(resourceName) {
        const locations = this.resourceAnalytics.locationData.get(resourceName) || [];
        return locations.slice().sort((a, b) => b.richness - a.richness || a.system.localeCompare(b.system))
            .map(l => `<span class="location-tag-compact" title="${this.esc(l.planet)} in ${this.esc(l.system)} - Richness: ${l.richness}">${this.esc(l.system)} (${l.richness})</span>`).join('');
    }

    getRegionalResourceLocations(resourceName) {
        const locations = this.resourceAnalytics.locationData.get(resourceName) || [];
        const byRegion = new Map();
        locations.forEach(l => { if (!byRegion.has(l.region)) byRegion.set(l.region, []); byRegion.get(l.region).push(l); });
        return Array.from(byRegion.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([region, rl]) => {
            const tags = rl.sort((a, b) => b.richness - a.richness || a.system.localeCompare(b.system))
                .map(l => `<span class="location-tag-compact" title="${this.esc(l.planet)} in ${this.esc(l.system)} - Richness: ${l.richness}">${this.esc(l.system)} (${l.richness})</span>`).join('');
            return `<div class="region-location-group"><strong class="region-name">${this.esc(region)}:</strong> ${tags}</div>`;
        }).join('');
    }

    getAnalyticsData() {
        return this.resourceAnalytics;
    }

    // Method for testing - returns resource distribution data
    getResourceDistribution() {
        if (!this.resourceAnalytics) return {};
        const distribution = {};
        this.resourceAnalytics.locationData.forEach((locations, resourceName) => {
            distribution[resourceName] = {
                systems: new Set(locations.map(loc => loc.system)).size,
                totalOccurrences: locations.length,
                locations
            };
        });
        return distribution;
    }
}
