class BuildingAnalytics {
    constructor(data) {
        this.data = data;
        this.resourceTierData = null;
        this.allPlanetsData = null;
        this.tierPlanetIndex = null;
        this.generateAnalytics();
    }

    generateAnalytics() {
        this.tierAnalysis = this.analyzeTiers();
        this.typeAnalysis = this.analyzeTypes();
        this.resourceAnalysis = this.analyzeResources();
        this.costAnalysis = this.analyzeCosts();
        this.propertyAnalysis = this.analyzeProperties();
    }

    async loadResourceTierData() {
        if (this.resourceTierData) return;

        try {
            const response = await fetch('../JSON/resource_tier_analysis.json');
            if (!response.ok) throw new Error('Failed to load resource tier data');
            this.resourceTierData = await response.json();
        } catch (error) {
            console.error('Error loading resource tier data:', error);
            this.resourceTierData = null;
        }
    }
    async loadAllPlanetsData() {
        if (this.allPlanetsData) {
            return this.allPlanetsData;
        }

        const response = await fetch('../JSON/planets.json');
        if (!response.ok) {
            throw new Error('Failed to load planet data');
        }

        const data = await response.json();
        this.allPlanetsData = data.mapData || [];
        return this.allPlanetsData;
    }


    extractRegionCode(planetName) {
        if (!planetName) {
            return 'Other';
        }

        const match = planetName.match(/^(\d{3}|CSS)/);
        return match ? match[1] : 'Other';
    }

    extractFactionCode(planetName, systemName = '') {
        const sources = [planetName, systemName].filter(Boolean);

        for (const source of sources) {
            const factionMatch = source.match(/-(\w{3})-/i);
            if (factionMatch && factionMatch[1]) {
                return factionMatch[1].toUpperCase();
            }

            const prefixMatch = source.match(/^(\w{3})/i);
            if (prefixMatch && prefixMatch[1]) {
                return prefixMatch[1].toUpperCase();
            }
        }

        return 'UNK';
    }

    async buildTierPlanetIndex() {
        if (this.tierPlanetIndex) {
            return this.tierPlanetIndex;
        }

        await this.loadResourceTierData();
        const typeLookup = (this.resourceTierData && this.resourceTierData.type_to_tier_mapping) || {};
        const systems = await this.loadAllPlanetsData();

        const tiers = {};

        systems.forEach(system => {
            (system.planets || []).forEach(planet => {
                if (!planet.resources || planet.resources.length === 0) {
                    return;
                }

                const tierCounts = {};
                let highestTier = 0;

                planet.resources.forEach(resource => {
                    const tierInfo = typeLookup[resource.type];
                    if (!tierInfo || !tierInfo.tier) {
                        return;
                    }

                    const tier = tierInfo.tier;
                    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
                    highestTier = Math.max(highestTier, tier);
                });

                if (!highestTier) {
                    return;
                }

                const tierKey = `tier_${highestTier}`;
                if (!tiers[tierKey]) {
                    tiers[tierKey] = {
                        totalPlanets: 0,
                        totalTierResources: 0,
                        totalRegions: 0,
                        factions: new Map()
                    };
                }

                const tierBucket = tiers[tierKey];
                tierBucket.totalPlanets += 1;

                const factionCode = this.extractFactionCode(planet.name, system.name);
                if (!tierBucket.factions.has(factionCode)) {
                    tierBucket.factions.set(factionCode, {
                        code: factionCode,
                        planetCount: 0,
                        totalTierResources: 0,
                        regions: new Map()
                    });
                }

                const factionBucket = tierBucket.factions.get(factionCode);
                factionBucket.planetCount += 1;

                const regionCode = this.extractRegionCode(planet.name);
                if (!factionBucket.regions.has(regionCode)) {
                    factionBucket.regions.set(regionCode, {
                        code: regionCode,
                        planetCount: 0,
                        totalTierResources: 0,
                        planets: []
                    });
                }

                const targetTierCount = tierCounts[highestTier] || 0;
                const planetSummary = {
                    planet: planet.name,
                    system: system.name,
                    tier_counts: tierCounts,
                    total_resources: planet.resources.length,
                    highestTier: highestTier,
                    highestTierCount: targetTierCount
                };

                const regionBucket = factionBucket.regions.get(regionCode);
                regionBucket.planets.push(planetSummary);
                regionBucket.planetCount += 1;
                regionBucket.totalTierResources += targetTierCount;

                factionBucket.totalTierResources += targetTierCount;
                tierBucket.totalTierResources += targetTierCount;
            });
        });

        Object.keys(tiers).forEach(key => {
            const bucket = tiers[key];
            let totalRegions = 0;

            bucket.factions = Array.from(bucket.factions.values()).map(faction => {
                faction.regions = Array.from(faction.regions.values()).map(region => {
                    region.planets.sort((a, b) => {
                        const countDiff = (b.highestTierCount || 0) - (a.highestTierCount || 0);
                        if (countDiff !== 0) {
                            return countDiff;
                        }

                        const totalDiff = (b.total_resources || 0) - (a.total_resources || 0);
                        if (totalDiff !== 0) {
                            return totalDiff;
                        }

                        return a.planet.localeCompare(b.planet);
                    });

                    region.avgTierResources = region.planetCount
                        ? region.totalTierResources / region.planetCount
                        : 0;

                    return region;
                }).sort((a, b) => {
                    const planetDiff = b.planetCount - a.planetCount;
                    if (planetDiff !== 0) {
                        return planetDiff;
                    }
                    return a.code.localeCompare(b.code);
                });

                totalRegions += faction.regions.length;
                faction.avgTierResources = faction.planetCount
                    ? faction.totalTierResources / faction.planetCount
                    : 0;

                return faction;
            }).sort((a, b) => {
                const planetDiff = b.planetCount - a.planetCount;
                if (planetDiff !== 0) {
                    return planetDiff;
                }
                return a.code.localeCompare(b.code);
            });

            bucket.totalRegions = totalRegions;
            bucket.avgTierResources = bucket.totalPlanets
                ? bucket.totalTierResources / bucket.totalPlanets
                : 0;
        });

        this.tierPlanetIndex = tiers;
        return this.tierPlanetIndex;
    }


    async renderPlanetRecommendations() {
        await this.loadResourceTierData();

        if (!this.resourceTierData) return;

        const tierPlanetIndex = await this.buildTierPlanetIndex();
        const tierSummaries = tierPlanetIndex || {};
        const tierDataByHighest = this.resourceTierData.planets_by_highest_tier || {};
        const tierFiveData = tierDataByHighest.tier_5 || {};
        const tierFiveTotal = tierFiveData.total_planets || 0;
        const container = document.getElementById('analyticsContent');

        const recommendationsSection = document.createElement('div');
        recommendationsSection.className = 'planet-recommendations analytics-section';
        recommendationsSection.innerHTML = `
            <h3>ClaimStake Tier Recommendations</h3>
            <p class="section-note">Match your claim stake tier with planet resources to maximize efficiency.</p>

            <div class="label-explanation">
                <h4>How to Read Planet Cards:</h4>
                <div class="explanation-grid">
                    <div class="explanation-item">
                        <span class="example-label" style="color: #9b59b6; font-weight: 700;">7 T5</span>
                        <span class="explanation-text">= Number of Tier 5 resources on this planet</span>
                    </div>
                    <div class="explanation-item">
                        <span class="example-label" style="color: rgba(255,255,255,0.6);">78 total</span>
                        <span class="explanation-text">= Total resources across all tiers (T1-T5)</span>
                    </div>
                    <div class="explanation-item">
                        <span class="example-label" style="background: rgba(255,255,255,0.1); padding: 0.3rem 0.6rem; border-radius: 4px;">${tierFiveTotal} planets</span>
                        <span class="explanation-text">= Planets where this is the highest available tier</span>
                    </div>
                </div>
            </div>

            <div class="tier-recommendations-grid">
                ${this.renderTierRecommendation(5, 'Legendary', '#9b59b6', 'T5', tierSummaries['tier_5'])}
                ${this.renderTierRecommendation(4, 'Epic', '#3498db', 'T4', tierSummaries['tier_4'])}
                ${this.renderTierRecommendation(3, 'Rare', '#2ecc71', 'T3', tierSummaries['tier_3'])}
                ${this.renderTierRecommendation(2, 'Uncommon', '#95a5a6', 'T2', tierSummaries['tier_2'])}
                ${this.renderTierRecommendation(1, 'Common', '#7f8c8d', 'T1', tierSummaries['tier_1'])}
            </div>
        `;

        container.appendChild(recommendationsSection);
        this.attachPlanetCardHandlers(recommendationsSection);
        this.attachRegionButtonHandlers(recommendationsSection);
    }


    renderTierRecommendation(tier, tierName, color, icon, tierSummary) {
        const highestTierData = (this.resourceTierData.planets_by_highest_tier && this.resourceTierData.planets_by_highest_tier[`tier_${tier}`]) || null;

        if (!highestTierData && !tierSummary) {
            return `
                <div class="tier-recommendation" style="border-left-color: ${color}">
                    <div class="tier-recommendation-header">
                        <span class="tier-icon">${icon}</span>
                        <h4>T${tier} - ${tierName}</h4>
                    </div>
                    <p class="tier-info-text">No data available</p>
                </div>
            `;
        }

        const topPlanets = highestTierData && highestTierData.top_20_planets ? highestTierData.top_20_planets.slice(0, 10) : [];
        const tierSummaryData = this.resourceTierData.tier_summary ? this.resourceTierData.tier_summary[`tier_${tier}`] : null;

        let resourcePreview = '';
        if ((tier === 5 || tier === 4) && tierSummaryData && tierSummaryData.resources) {
            const previewResources = tierSummaryData.resources;
            resourcePreview = `
                <div class="resource-tags">
                    ${previewResources.map(resource =>
                        `<span class="resource-tag" style="background-color: ${color}20; border-color: ${color}60;">${resource.name}</span>`
                    ).join('')}
                </div>
            `;
        }

        const totalPlanets = highestTierData ? highestTierData.total_planets : (tierSummary ? tierSummary.totalPlanets : 0);
        const warning = tier === 5 ? `
            <div class="warning-text">
                Do not waste T5 claim stakes on planets without Tier 5 resources.
            </div>
        ` : '';

        const regionMarkup = tierSummary
            ? this.renderFullTierRegions(tierSummary, tier, color)
            : this.renderRegionalPlanets(topPlanets, tier, color);

        return `
            <div class="tier-recommendation" style="border-left-color: ${color}">
                <div class="tier-recommendation-header">
                    <div class="tier-header-left">
                        <span class="tier-icon">${icon}</span>
                        <h4 style="color: ${color}">T${tier} - ${tierName}</h4>
                    </div>
                    <div class="tier-stats">
                        <span class="planet-count">${totalPlanets} planets</span>
                    </div>
                </div>

                <p class="tier-info-text">
                    Can extract T${tier} resources${tier < 5 ? ' and lower tiers' : ' only'}.
                </p>

                ${warning}
                ${resourcePreview}

                <div class="regional-planets-section">
                    ${regionMarkup}
                </div>
            </div>
        `;
    }


renderFullTierRegions(tierSummary, tier, color) {
    if (!tierSummary || !tierSummary.factions || tierSummary.factions.length === 0) {
        return '<p class=\"tier-info-text\">No planets found for this tier.</p>';
    }

    const totalFactions = tierSummary.factions.length;
    const totalRegions = tierSummary.totalRegions || tierSummary.factions.reduce((sum, faction) => sum + faction.regions.length, 0);
    const summaryAverage = typeof tierSummary.avgTierResources === 'number' ? tierSummary.avgTierResources : 0;

    const summarySection = `
        <div class="tier-region-summary">
            <div class="summary-card">
                <span class="summary-label">Factions</span>
                <span class="summary-value">${totalFactions}</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Regions</span>
                <span class="summary-value">${totalRegions}</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Planets</span>
                <span class="summary-value">${tierSummary.totalPlanets}</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Avg T${tier} Resources</span>
                <span class="summary-value">${summaryAverage.toFixed(1)}</span>
            </div>
        </div>
    `;

    const factionsMarkup = tierSummary.factions.map(faction => {
        const factionAverage = typeof faction.avgTierResources === 'number' ? faction.avgTierResources : 0;
        const regionsMarkup = faction.regions.map(region => {
            const regionAverage = typeof region.avgTierResources === 'number' ? region.avgTierResources : 0;
            const payload = encodeURIComponent(JSON.stringify({
                faction: faction.code,
                region: region.code,
                planetCount: region.planetCount,
                avgTierResources: regionAverage,
                planets: region.planets || []
            }));

            return `
                <button type="button" class="region-chip" data-region="${payload}" data-tier="${tier}" data-color="${color}" title="${region.planetCount} planets · avg ${regionAverage.toFixed(1)} T${tier}" style="border-color: ${color}55; background: ${color}15;">
                    ${region.code}<span class="region-chip-meta">${region.planetCount}</span>
                </button>
            `;
        }).join('');

        return `
        <section class="tier-faction-block">
            <div class="tier-faction-header">
                <span class="tier-faction-name">Faction ${faction.code}</span>
                <span class="tier-faction-meta">${faction.planetCount} planets · avg ${factionAverage.toFixed(1)} T${tier}</span>
            </div>
            <div class="tier-faction-regions">
                ${regionsMarkup || '<span class="tier-info-text">No regions recorded</span>'}
            </div>
        </section>
        `;
    }).join('');

    return `
        <div class="tier-region-overview">
            ${summarySection}
            <div class="tier-faction-list">
                ${factionsMarkup}
            </div>
        </div>
    `;
}

renderRegionalPlanets(planets, tier, color) {
        const regions = this.groupPlanetsByRegion(planets);

        return Array.from(regions.entries())
            .sort((a, b) => b[1].length - a[1].length)
            .map(([region, regionPlanets]) => `
                <div class="region-group">
                    <div class="region-header">
                        <h5>Region ${region}</h5>
                        <span class="region-count">${regionPlanets.length} planets</span>
                    </div>
                    <div class="planet-grid">
                        ${regionPlanets.map(planet => {
                            const encodedPlanet = encodeURIComponent(JSON.stringify(planet));
                            return `
                                <div class="planet-card clickable" data-planet="${encodedPlanet}" data-tier="${tier}" data-color="${color}">
                                    <div class="planet-name">${planet.planet}</div>
                                    <div class="planet-resources">
                                        <span class="tier-count" style="color: ${color}">
                                            ${planet.tier_counts[tier] || 0} T${tier}
                                        </span>
                                        <span class="total-count">
                                            ${planet.total_resources} total
                                        </span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `).join('');
    }


attachRegionButtonHandlers(section) {
    if (!section || section.dataset.regionHandlersAttached === 'true') {
        return;
    }

    section.dataset.regionHandlersAttached = 'true';

    section.addEventListener('click', (event) => {
        const chip = event.target.closest('.region-chip');
        if (!chip) return;

        const encoded = chip.getAttribute('data-region');
        if (!encoded) return;

        try {
            const payload = JSON.parse(decodeURIComponent(encoded));
            const tierValue = parseInt(chip.getAttribute('data-tier'), 10) || 0;
            const color = chip.getAttribute('data-color') || '#9b59b6';
            this.showRegionModal(payload, tierValue, color);
        } catch (error) {
            console.error('Error parsing region payload:', error);
        }
    });
}

showRegionModal(regionData, tier, color) {
    if (!regionData) return;

    let overlay = document.getElementById('regionModalOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'regionModalOverlay';
        overlay.className = 'region-modal-overlay';
        overlay.innerHTML = `
            <div class="region-modal">
                <div class="region-modal-header">
                    <h3 class="region-modal-title"></h3>
                    <button type="button" class="region-modal-close" aria-label="Close">×</button>
                </div>
                <div class="region-modal-body"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                overlay.style.display = 'none';
            }
        });

        overlay.querySelector('.region-modal-close').addEventListener('click', () => {
            overlay.style.display = 'none';
        });
    }

    const titleEl = overlay.querySelector('.region-modal-title');
    const bodyEl = overlay.querySelector('.region-modal-body');

    const factionLabel = regionData.faction ? `Faction ${regionData.faction}` : 'Faction';
    titleEl.textContent = `${factionLabel} · Region ${regionData.region}`;

    const planets = Array.isArray(regionData.planets) ? regionData.planets : [];
    if (planets.length === 0) {
        bodyEl.innerHTML = '<p class="tier-info-text">No planets recorded for this region.</p>';
    } else {
        bodyEl.innerHTML = planets.map(planet => {
            const safePlanet = {
                planet: planet.planet,
                system: planet.system,
                tier_counts: planet.tier_counts,
                total_resources: planet.total_resources
            };
            const encodedPlanet = encodeURIComponent(JSON.stringify(safePlanet));
            const tierCount = (planet.tier_counts && (planet.tier_counts[tier] || planet.tier_counts[String(tier)])) || planet.highestTierCount || 0;
            return `
                <button type="button" class="planet-chip clickable" data-planet="${encodedPlanet}" data-tier="${tier}" data-color="${color}">
                    ${planet.planet} (${tierCount} x T${tier})
                </button>
            `;
        }).join('');
    }

    overlay.style.display = 'flex';
    this.attachPlanetCardHandlers(bodyEl);
}

    attachPlanetCardHandlers(section) {
        if (!section) return;

        section.addEventListener('click', (event) => {
            const target = event.target.closest('[data-planet]');
            if (!target) return;

            const encoded = target.getAttribute('data-planet');
            if (!encoded) return;

            let planetData;
            try {
                planetData = JSON.parse(decodeURIComponent(encoded));
            } catch (error) {
                console.error('Error parsing planet data for modal:', error);
                return;
            }

            let tierValue = parseInt(target.getAttribute('data-tier'), 10);
            if (isNaN(tierValue)) {
                tierValue = 5;
            }

            const color = target.getAttribute('data-color') || '#9b59b6';

            this.showPlanetModal(planetData, tierValue, color);
        });
    }


    groupPlanetsByRegion(planets) {
        const regions = new Map();

        planets.forEach(planet => {
            // Extract region from planet name (first 3 digits)
            const match = planet.planet.match(/^(\d{3}|CSS)/);
            const region = match ? match[1] : 'Other';

            if (!regions.has(region)) {
                regions.set(region, []);
            }
            regions.get(region).push(planet);
        });

        return regions;
    }

    async showPlanetModal(planetData) {
        // Load full planet data from planets.json
        let fullPlanetData = null;

        try {
            // Load planet data if not already loaded
            if (!this.allPlanetsData) {
                const response = await fetch('../JSON/planets.json');
                const data = await response.json();
                this.allPlanetsData = data.mapData;
            }

            // Find the system and planet
            for (const system of this.allPlanetsData) {
                if (system.name === planetData.system) {
                    const planet = system.planets.find(p => p.name === planetData.planet);
                    if (planet) {
                        fullPlanetData = { ...planet, system: system };
                        break;
                    }
                }
            }
        } catch (error) {
            console.error('Error loading planet data:', error);
        }

        const modal = document.getElementById('buildingModal');
        const modalContent = document.getElementById('modalContent');
        const modalTitle = document.getElementById('modalTitle');

        modalTitle.textContent = planetData.planet;

        // Get resource type to tier mapping
        const resourceTypeToTier = this.resourceTierData?.type_to_tier_mapping || {};

        modalContent.innerHTML = `
            <div class="planet-modal-content">
                <div class="planet-overview">
                    <h3>Planet Overview</h3>
                    <div class="planet-info-grid">
                        <div class="info-item">
                            <span class="info-label">System:</span>
                            <span class="info-value">${planetData.system}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Total Resources:</span>
                            <span class="info-value">${planetData.total_resources}</span>
                        </div>
                        ${fullPlanetData ? `
                            <div class="info-item">
                                <span class="info-label">Planet Type:</span>
                                <span class="info-value">${this.getPlanetTypeName(fullPlanetData.type)}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Orbit:</span>
                                <span class="info-value">${fullPlanetData.orbit?.toFixed(2) || 'Unknown'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Scale:</span>
                                <span class="info-value">${fullPlanetData.scale || 'Unknown'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Angle:</span>
                                <span class="info-value">${fullPlanetData.angle || 'Unknown'}°</span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="resource-breakdown">
                    <h3>Resources by Tier</h3>
                    <div class="tier-resource-grid">
                        ${Object.entries(planetData.tier_counts).sort((a, b) => b[0] - a[0]).map(([t, count]) => {
                            const tierColor = this.getTierColor(parseInt(t));
                            return `
                                <div class="tier-resource-item" style="border-left: 3px solid ${tierColor};">
                                    <div class="tier-resource-header">
                                        <span class="tier-badge-large" style="background: ${tierColor};">T${t}</span>
                                        <span class="tier-resource-count">${count} resources</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                ${fullPlanetData && fullPlanetData.resources ? `
                    <div class="resource-list-section">
                        <h3>All Resources (${fullPlanetData.resources.length})</h3>
                        <div class="resource-list-grid">
                            ${fullPlanetData.resources.map(resource => {
                                const tierInfo = resourceTypeToTier[resource.type];
                                const resourceTier = tierInfo?.tier || '?';
                                const resourceName = tierInfo?.name || resource.name;
                                const tierColor = this.getTierColor(resourceTier);
                                const richnessStars = '★'.repeat(resource.richness) + '☆'.repeat(5 - resource.richness);

                                return `
                                    <div class="resource-list-item">
                                        <span class="resource-tier-badge" style="background: ${tierColor};">T${resourceTier}</span>
                                        <span class="resource-name">${resourceName}</span>
                                        <span class="resource-richness" title="Richness: ${resource.richness}/5">${richnessStars}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        modal.style.display = 'block';
    }

    getTierColor(tier) {
        const colors = {
            5: '#9b59b6',
            4: '#3498db',
            3: '#2ecc71',
            2: '#95a5a6',
            1: '#7f8c8d'
        };
        return colors[tier] || '#7f8c8d';
    }

    getPlanetTypeName(type) {
        // Basic planet type mapping
        const types = {
            1: 'Terrestrial', 2: 'Desert', 3: 'Ice', 4: 'Ocean', 5: 'Volcanic',
            6: 'Gas Giant', 7: 'Rocky', 8: 'Toxic', 9: 'Barren', 10: 'Forest',
            11: 'Tundra', 12: 'Jungle', 13: 'Swamp', 14: 'Lava', 15: 'Crystalline'
        };
        return types[type] || `Type ${type}`;
    }

    analyzeTiers() {
        const tierStats = new Map();
        let totalPower = 0;
        let totalStorage = 0;

        this.data.allBuildings.forEach(building => {
            const tier = building.tier || 0;
            if (!tierStats.has(tier)) {
                tierStats.set(tier, {
                    count: 0,
                    totalPower: 0,
                    totalStorage: 0,
                    totalCrew: 0,
                    avgConstructionTime: 0,
                    buildings: []
                });
            }

            const stats = tierStats.get(tier);
            stats.count++;
            stats.totalPower += building.power || 0;
            stats.totalStorage += building.storage || 0;
            stats.totalCrew += building.crewSlots || 0;
            stats.avgConstructionTime += building.constructionTime || 0;
            stats.buildings.push(building);

            totalPower += building.power || 0;
            totalStorage += building.storage || 0;
        });

        // Calculate averages
        tierStats.forEach(stats => {
            stats.avgConstructionTime = Math.round(stats.avgConstructionTime / stats.count);
            stats.avgPower = Math.round(stats.totalPower / stats.count);
            stats.avgStorage = Math.round(stats.totalStorage / stats.count);
        });

        return {
            tierStats,
            totalPower,
            totalStorage,
            averagePower: Math.round(totalPower / this.data.allBuildings.length),
            averageStorage: Math.round(totalStorage / this.data.allBuildings.length)
        };
    }

    analyzeTypes() {
        const typeStats = new Map();

        this.data.allBuildings.forEach(building => {
            const type = building.type || 'Unknown';
            if (!typeStats.has(type)) {
                typeStats.set(type, {
                    count: 0,
                    buildings: [],
                    totalPower: 0,
                    totalStorage: 0,
                    hasExtraction: 0
                });
            }

            const stats = typeStats.get(type);
            stats.count++;
            stats.buildings.push(building);
            stats.totalPower += building.power || 0;
            stats.totalStorage += building.storage || 0;
            if (building.hasExtraction) stats.hasExtraction++;
        });

        return typeStats;
    }

    analyzeResources() {
        const extractionResources = new Map();
        const consumptionResources = new Map();

        this.data.allBuildings.forEach(building => {
            // Analyze extraction
            if (building.resourceExtractionRate) {
                Object.entries(building.resourceExtractionRate).forEach(([resource, rate]) => {
                    if (!extractionResources.has(resource)) {
                        extractionResources.set(resource, {
                            totalRate: 0,
                            buildingCount: 0,
                            buildings: []
                        });
                    }
                    const stats = extractionResources.get(resource);
                    stats.totalRate += rate;
                    stats.buildingCount++;
                    stats.buildings.push({
                        name: building.name,
                        rate: rate,
                        tier: building.tier
                    });
                });
            }

            // Analyze consumption
            if (building.resourceRate) {
                Object.entries(building.resourceRate).forEach(([resource, rate]) => {
                    if (!consumptionResources.has(resource)) {
                        consumptionResources.set(resource, {
                            totalRate: 0,
                            buildingCount: 0,
                            buildings: []
                        });
                    }
                    const stats = consumptionResources.get(resource);
                    stats.totalRate += Math.abs(rate); // Make positive for analysis
                    stats.buildingCount++;
                    stats.buildings.push({
                        name: building.name,
                        rate: rate,
                        tier: building.tier
                    });
                });
            }
        });

        return {
            extraction: extractionResources,
            consumption: consumptionResources
        };
    }

    analyzeCosts() {
        const materialCosts = new Map();
        let totalBuildingsWithCost = 0;

        this.data.allBuildings.forEach(building => {
            if (building.constructionCost) {
                totalBuildingsWithCost++;
                Object.entries(building.constructionCost).forEach(([material, amount]) => {
                    if (!materialCosts.has(material)) {
                        materialCosts.set(material, {
                            totalAmount: 0,
                            buildingCount: 0,
                            buildings: []
                        });
                    }
                    const stats = materialCosts.get(material);
                    stats.totalAmount += amount;
                    stats.buildingCount++;
                    stats.buildings.push({
                        name: building.name,
                        amount: amount,
                        tier: building.tier
                    });
                });
            }
        });

        return {
            materialCosts,
            totalBuildingsWithCost,
            averageMaterialsPerBuilding: totalBuildingsWithCost > 0 ?
                Math.round([...materialCosts.values()].reduce((sum, stats) =>
                    sum + stats.buildingCount, 0) / totalBuildingsWithCost) : 0
        };
    }

    analyzeProperties() {
        let comesWithStakeCount = 0;
        let cannotRemoveCount = 0;
        let hasExtractionCount = 0;
        let hubBuildingCount = 0;

        this.data.allBuildings.forEach(building => {
            if (building.comesWithStake) comesWithStakeCount++;
            if (building.cannotRemove) cannotRemoveCount++;
            if (building.hasExtraction) hasExtractionCount++;
            if (building.isHub) hubBuildingCount++;
        });

        return {
            comesWithStakeCount,
            cannotRemoveCount,
            hasExtractionCount,
            hubBuildingCount,
            percentageWithStake: Math.round((comesWithStakeCount / this.data.allBuildings.length) * 100),
            percentageCannotRemove: Math.round((cannotRemoveCount / this.data.allBuildings.length) * 100),
            percentageWithExtraction: Math.round((hasExtractionCount / this.data.allBuildings.length) * 100)
        };
    }

    async renderAnalytics() {
        this.updateAnalyticsStats();
        await this.renderPlanetRecommendations();
        this.renderTierAnalysis();
        this.renderTypeAnalysis();
        this.renderResourceAnalysis();
        this.renderCostAnalysis();
        this.renderPropertyAnalysis();
    }

    updateAnalyticsStats() {
        document.getElementById('analyticsTotal').textContent = this.data.allBuildings.length;
        document.getElementById('analyticsUniqueTiers').textContent = this.tierAnalysis.tierStats.size;
        document.getElementById('analyticsResourceTypes').textContent =
            this.resourceAnalysis.extraction.size + this.resourceAnalysis.consumption.size;
        document.getElementById('analyticsConstructionMaterials').textContent = this.costAnalysis.materialCosts.size;
    }

    renderTierAnalysis() {
        const container = document.getElementById('analyticsContent');

        const tierSection = document.createElement('div');
        tierSection.className = 'analytics-section';
        tierSection.innerHTML = `
            <h3>🏢 Tier Analysis</h3>
            <p class="section-note">Building distribution and capabilities by tier level</p>
            <div class="tier-analysis-grid">
                ${Array.from(this.tierAnalysis.tierStats.entries())
                    .sort(([a], [b]) => a - b)
                    .map(([tier, stats]) => `
                        <div class="analytics-item tier-item">
                            <div class="item-content">
                                <div class="item-header">
                                    <h4>Tier ${tier}</h4>
                                    <div class="tier-badge">T${tier}</div>
                                </div>
                                <div class="item-stats">
                                    <div class="primary-stat">
                                        <div class="stat-value">${stats.count}</div>
                                        <div class="stat-label">Buildings</div>
                                    </div>
                                    <div class="secondary-stat">
                                        <div class="stat-value">${stats.avgPower}</div>
                                        <div class="stat-label">Avg Power</div>
                                    </div>
                                    <div class="secondary-stat">
                                        <div class="stat-value">${stats.avgStorage}</div>
                                        <div class="stat-label">Avg Storage</div>
                                    </div>
                                </div>
                                <div class="tier-details">
                                    <p>Average Construction Time: ${stats.avgConstructionTime}s</p>
                                    <p>Total Crew Capacity: ${stats.totalCrew}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
            </div>
        `;

        container.appendChild(tierSection);
    }

    renderTypeAnalysis() {
        const container = document.getElementById('analyticsContent');

        const typeSection = document.createElement('div');
        typeSection.className = 'analytics-section';
        typeSection.innerHTML = `
            <h3>🏭 Building Type Analysis</h3>
            <p class="section-note">Distribution and characteristics by building category</p>
            <div class="type-analysis-grid">
                ${Array.from(this.typeAnalysis.entries())
                    .sort(([, a], [, b]) => b.count - a.count)
                    .map(([type, stats]) => `
                        <div class="analytics-item type-item">
                            <div class="item-content">
                                <div class="item-header">
                                    <h4>${type}</h4>
                                    <div class="type-badge">${this.getBuildingIcon(type)}</div>
                                </div>
                                <div class="item-stats">
                                    <div class="primary-stat">
                                        <div class="stat-value">${stats.count}</div>
                                        <div class="stat-label">Buildings</div>
                                    </div>
                                    <div class="secondary-stat">
                                        <div class="stat-value">${Math.round(stats.totalPower / stats.count) || 0}</div>
                                        <div class="stat-label">Avg Power</div>
                                    </div>
                                    <div class="secondary-stat">
                                        <div class="stat-value">${stats.hasExtraction}</div>
                                        <div class="stat-label">With Extraction</div>
                                    </div>
                                </div>
                                <div class="type-percentage">
                                    ${Math.round((stats.count / this.data.allBuildings.length) * 100)}% of all buildings
                                </div>
                            </div>
                        </div>
                    `).join('')}
            </div>
        `;

        container.appendChild(typeSection);
    }

    renderResourceAnalysis() {
        const container = document.getElementById('analyticsContent');

        const resourceSection = document.createElement('div');
        resourceSection.className = 'analytics-section';
        resourceSection.innerHTML = `
            <h3>💎 Resource Analysis</h3>
            <p class="section-note">Most extracted and consumed resources across all buildings</p>

            <div class="resource-analysis-tabs">
                <h4>Top Extracted Resources</h4>
                <div class="resource-grid">
                    ${Array.from(this.resourceAnalysis.extraction.entries())
                        .sort(([, a], [, b]) => b.buildingCount - a.buildingCount)
                        .slice(0, 10)
                        .map(([resource, stats]) => `
                            <div class="resource-analysis-item">
                                <div class="resource-name">${resource}</div>
                                <div class="resource-stats">
                                    <span>${stats.buildingCount} buildings</span>
                                    <span>Total Rate: ${stats.totalRate.toFixed(4)}/s</span>
                                </div>
                            </div>
                        `).join('')}
                </div>

                <h4>Top Consumed Resources</h4>
                <div class="resource-grid">
                    ${Array.from(this.resourceAnalysis.consumption.entries())
                        .sort(([, a], [, b]) => b.buildingCount - a.buildingCount)
                        .slice(0, 10)
                        .map(([resource, stats]) => `
                            <div class="resource-analysis-item">
                                <div class="resource-name">${resource}</div>
                                <div class="resource-stats">
                                    <span>${stats.buildingCount} buildings</span>
                                    <span>Total Rate: ${stats.totalRate.toFixed(4)}/s</span>
                                </div>
                            </div>
                        `).join('')}
                </div>
            </div>
        `;

        container.appendChild(resourceSection);
    }

    renderCostAnalysis() {
        const container = document.getElementById('analyticsContent');

        const costSection = document.createElement('div');
        costSection.className = 'analytics-section';
        costSection.innerHTML = `
            <h3>🔨 Construction Cost Analysis</h3>
            <p class="section-note">Most common construction materials and their usage</p>
            <div class="cost-analysis-grid">
                ${Array.from(this.costAnalysis.materialCosts.entries())
                    .sort(([, a], [, b]) => b.buildingCount - a.buildingCount)
                    .slice(0, 12)
                    .map(([material, stats]) => `
                        <div class="cost-analysis-item">
                            <div class="material-name">${material}</div>
                            <div class="material-stats">
                                <div class="stat-row">
                                    <span class="stat-label">Used in:</span>
                                    <span class="stat-value">${stats.buildingCount} buildings</span>
                                </div>
                                <div class="stat-row">
                                    <span class="stat-label">Total Amount:</span>
                                    <span class="stat-value">${stats.totalAmount}</span>
                                </div>
                                <div class="stat-row">
                                    <span class="stat-label">Avg per Building:</span>
                                    <span class="stat-value">${Math.round(stats.totalAmount / stats.buildingCount)}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
            </div>
        `;

        container.appendChild(costSection);
    }

    renderPropertyAnalysis() {
        const container = document.getElementById('analyticsContent');

        const propertySection = document.createElement('div');
        propertySection.className = 'analytics-section';
        propertySection.innerHTML = `
            <h3>⚙️ Building Properties</h3>
            <p class="section-note">Special building characteristics and their distribution</p>
            <div class="property-analysis-grid">
                <div class="property-stat-card">
                    <div class="property-icon">🏗️</div>
                    <div class="property-stat">
                        <div class="stat-number">${this.propertyAnalysis.comesWithStakeCount}</div>
                        <div class="stat-label">Comes with Stake</div>
                        <div class="stat-percentage">${this.propertyAnalysis.percentageWithStake}% of all buildings</div>
                    </div>
                </div>
                <div class="property-stat-card">
                    <div class="property-icon">🔒</div>
                    <div class="property-stat">
                        <div class="stat-number">${this.propertyAnalysis.cannotRemoveCount}</div>
                        <div class="stat-label">Cannot Remove</div>
                        <div class="stat-percentage">${this.propertyAnalysis.percentageCannotRemove}% of all buildings</div>
                    </div>
                </div>
                <div class="property-stat-card">
                    <div class="property-icon">⛏️</div>
                    <div class="property-stat">
                        <div class="stat-number">${this.propertyAnalysis.hasExtractionCount}</div>
                        <div class="stat-label">Resource Extraction</div>
                        <div class="stat-percentage">${this.propertyAnalysis.percentageWithExtraction}% of all buildings</div>
                    </div>
                </div>
                <div class="property-stat-card">
                    <div class="property-icon">🏢</div>
                    <div class="property-stat">
                        <div class="stat-number">${this.propertyAnalysis.hubBuildingCount}</div>
                        <div class="stat-label">Hub Buildings</div>
                        <div class="stat-percentage">${Math.round((this.propertyAnalysis.hubBuildingCount / this.data.allBuildings.length) * 100)}% of all buildings</div>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(propertySection);
    }

    getBuildingIcon(buildingType) {
        const icons = {
            'Hub': '🏢',
            'Extraction': '⛏️',
            'Storage': '📦',
            'Processing': '🏭',
            'Power': '⚡',
            'Agricultural': '🌱',
            'Crew': '👥',
            'Defense': '🛡️',
            'Infrastructure': '🏗️'
        };

        return icons[buildingType] || '🏢';
    }
}




