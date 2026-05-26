class PlanetResourceAnalytics extends BaseAnalytics {
    constructor(data) {
        super(data);
        this.resourceAnalytics = null;
    }

    generateAnalytics() {
        const resourceCounts = new Map();
        const resourceRichness = new Map();
        const systemResourceCounts = new Map();
        const locationData = new Map();
        const regionResourceMap = new Map(); // Track resources per region

        // Analyze all resources
        this.data.forEach(system => {
            if (system.planets) {
                let systemResourceTotal = 0;
                const systemUniqueResources = new Set(); // Track unique resources per system

                // Region is faction-specific: the same name prefix under a different
                // faction is a different in-game region (e.g. ONI-003 vs UST-003).
                const region = (system.closestFaction || '?') + '-' + system.name.substring(0, 3);

                system.planets.forEach(planet => {
                    if (planet.resources) {
                        systemResourceTotal += planet.resources.length;
                        planet.resources.forEach(resource => {
                            const resourceName = resource.name;

                            // Add to system's unique resources
                            systemUniqueResources.add(resourceName);

                            // Count occurrences
                            resourceCounts.set(resourceName, (resourceCounts.get(resourceName) || 0) + 1);

                            // Track richness levels
                            if (!resourceRichness.has(resourceName)) {
                                resourceRichness.set(resourceName, []);
                            }
                            resourceRichness.get(resourceName).push(resource.richness);

                            // Track location data
                            if (!locationData.has(resourceName)) {
                                locationData.set(resourceName, []);
                            }
                            locationData.get(resourceName).push({
                                system: system.name,
                                planet: planet.name,
                                richness: resource.richness,
                                systemKey: system.key,
                                region: region
                            });

                            // Track resources per region
                            if (!regionResourceMap.has(resourceName)) {
                                regionResourceMap.set(resourceName, new Set());
                            }
                            regionResourceMap.get(resourceName).add(region);
                        });
                    }
                });
                systemResourceCounts.set(system.name, {
                    count: systemResourceTotal,
                    uniqueCount: systemUniqueResources.size, // Store unique resource count
                    system: system
                });
            }
        });

        // Calculate analytics
        const totalResources = Array.from(resourceCounts.values()).reduce((a, b) => a + b, 0);
        const totalRichness = Array.from(resourceRichness.values()).flat().reduce((a, b) => a + b, 0);
        const averageRichness = totalRichness / Array.from(resourceRichness.values()).flat().length;

        console.log('📊 Total unique resources found:', resourceCounts.size);
        console.log('📊 Resource counts sample:', Array.from(resourceCounts.entries()).slice(0, 5));

        // Find highest quality resources (more lenient threshold)
        const qualityResources = Array.from(resourceRichness.entries())
            .map(([name, richnesses]) => ({
                name,
                averageRichness: richnesses.reduce((a, b) => a + b, 0) / richnesses.length,
                maxRichness: Math.max(...richnesses),
                locations: richnesses.length
            }))
            .sort((a, b) => b.averageRichness - a.averageRichness);

        // First try richness >= 4, then >= 3.5, then just top 30
        let highestQualityResources = qualityResources.filter(resource => resource.averageRichness >= 4).slice(0, 30);
        if (highestQualityResources.length === 0) {
            highestQualityResources = qualityResources.filter(resource => resource.averageRichness >= 3.5).slice(0, 30);
        }
        if (highestQualityResources.length === 0) {
            highestQualityResources = qualityResources.slice(0, 30);
        }

        console.log('💎 High quality resources found:', highestQualityResources.length);
        console.log('💎 High quality resources:', highestQualityResources);

        // Find top resource locations (systems with most unique resources)
        const topLocations = Array.from(systemResourceCounts.entries())
            .sort((a, b) => b[1].uniqueCount - a[1].uniqueCount)
            .slice(0, 30);

        // Calculate total number of unique regions
        const allRegions = new Set();
        this.data.forEach(system => {
            const region = (system.closestFaction || '?') + '-' + system.name.substring(0, 3);
            allRegions.add(region);
        });
        const totalRegions = allRegions.size;

        // Find resources NOT present in all regions
        const regionallyLimitedResources = Array.from(regionResourceMap.entries())
            .filter(([resourceName, regions]) => regions.size < totalRegions)
            .map(([resourceName, regions]) => ({
                name: resourceName,
                presentInRegions: regions.size,
                totalRegions: totalRegions,
                missingFromRegions: totalRegions - regions.size,
                regions: Array.from(regions).sort(),
                missingRegions: Array.from(allRegions).filter(r => !regions.has(r)).sort(),
                totalLocations: resourceCounts.get(resourceName) || 0,
                averageRichness: resourceRichness.has(resourceName)
                    ? (resourceRichness.get(resourceName).reduce((a, b) => a + b, 0) / resourceRichness.get(resourceName).length).toFixed(2)
                    : 0
            }))
            .sort((a, b) => a.presentInRegions - b.presentInRegions); // Sort by most regionally limited first

        this.resourceAnalytics = {
            highestQualityResources,
            topLocations,
            totalResources,
            averageRichness: averageRichness.toFixed(2),
            resourceCounts,
            locationData,
            regionallyLimitedResources,
            totalRegions,
            allRegions: Array.from(allRegions).sort()
        };
    }

    updateStats() {
        const analytics = this.resourceAnalytics;
        if (!analytics) return;

        document.getElementById('averageRichness').textContent = analytics.averageRichness;
        document.getElementById('topSystemsCount').textContent = analytics.topLocations.length;

        // Update regional stats
        const regionalStatsEl = document.getElementById('regionalResourcesCount');
        if (regionalStatsEl) {
            regionalStatsEl.textContent = analytics.regionallyLimitedResources.length;
        }
        const totalRegionsEl = document.getElementById('totalRegions');
        if (totalRegionsEl) {
            totalRegionsEl.textContent = analytics.totalRegions;
        }
    }

    renderAnalytics() {
        this.generateAnalytics();
        super.renderAnalytics();

        const analytics = this.resourceAnalytics;
        if (!analytics) return;

        // Render highest quality resources
        const qualityContainer = document.getElementById('highestQuality');
        qualityContainer.innerHTML = analytics.highestQualityResources.map(resource => `
            <div class="analysis-card quality">
                <div class="analysis-header">
                    <h4>${resource.name}</h4>
                    <span class="quality-badge high-quality">★ ${resource.averageRichness.toFixed(1)}</span>
                </div>
                <div class="analysis-stats">
                    <div class="stat-item">
                        <span class="stat-label">Avg Richness:</span>
                        <span class="stat-value">${resource.averageRichness.toFixed(2)}/5</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Max Richness:</span>
                        <span class="stat-value">${resource.maxRichness}/5</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Locations:</span>
                        <span class="stat-value">${resource.locations}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Render top locations
        const locationsContainer = document.getElementById('topLocations');
        locationsContainer.innerHTML = analytics.topLocations.map(([systemName, data]) => {
            const system = data.system;
            return `
                <div class="location-card" data-system-key="${system.key}">
                    <div class="location-header">
                        <h4>🌟 ${systemName}</h4>
                        <span class="resource-count-badge">${data.uniqueCount} Unique Resources</span>
                    </div>
                    <div class="location-stats">
                        <div class="stat-item">
                            <span class="stat-label">Unique Resources:</span>
                            <span class="stat-value">${data.uniqueCount}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Deposits:</span>
                            <span class="stat-value">${data.count}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Planets:</span>
                            <span class="stat-value">${system.planets ? system.planets.length : 0}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Faction:</span>
                            <span class="stat-value">${system.closestFaction || 'Unknown'}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Strategic Score:</span>
                            <span class="stat-value">${system.strategicScore}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers for location cards
        document.querySelectorAll('.location-card').forEach(card => {
            card.addEventListener('click', () => {
                const systemKey = card.getAttribute('data-system-key');
                const system = this.data.find(s => s.key === systemKey);
                if (system && window.planetExplorer) {
                    window.planetExplorer.showSystemModal(system);
                }
            });
        });

        // Render regionally limited resources
        const regionalContainer = document.getElementById('regionallyLimitedResources');
        if (regionalContainer && analytics.regionallyLimitedResources) {
            regionalContainer.innerHTML = analytics.regionallyLimitedResources.map(resource => `
                <div class="analysis-card regional">
                    <div class="analysis-header">
                        <h4>${resource.name}</h4>
                        <span class="regional-badge">${resource.presentInRegions}/${resource.totalRegions} Regions</span>
                    </div>
                    <div class="analysis-stats">
                        <div class="stat-item">
                            <span class="stat-label">Present In:</span>
                            <span class="stat-value">${resource.presentInRegions} / ${resource.totalRegions} regions</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Missing From:</span>
                            <span class="stat-value">${resource.missingFromRegions} region(s)</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Locations:</span>
                            <span class="stat-value">${resource.totalLocations}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Avg Richness:</span>
                            <span class="stat-value">${resource.averageRichness}/5</span>
                        </div>
                    </div>
                    <div class="regional-details">
                        <div class="region-section">
                            <strong>Found in regions:</strong> <span class="region-hint">(click to see locations)</span>
                            <div class="region-tags">
                                ${this.getRegionsSortedByRichness(resource.name, resource.regions).map(r => `<span class="region-tag present clickable" data-resource="${resource.name}" data-region="${r.region}" title="Avg Richness: ${r.avgRichness.toFixed(2)}">${r.region}</span>`).join('')}
                            </div>
                        </div>
                        ${resource.missingRegions.length > 0 ? `
                            <div class="region-section">
                                <strong>Missing from regions:</strong>
                                <div class="region-tags">
                                    ${resource.missingRegions.map(r => `<span class="region-tag missing">${r}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');

            // Add click handlers for region tags
            this.attachRegionTagHandlers();
        }
    }

    attachRegionTagHandlers() {
        document.querySelectorAll('.region-tag.present.clickable').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                const resourceName = tag.getAttribute('data-resource');
                const region = tag.getAttribute('data-region');
                this.showRegionLocationsPopup(resourceName, region);
            });
        });
    }

    showRegionLocationsPopup(resourceName, region) {
        const locations = this.getLocationsForRegion(resourceName, region);

        // Play popup open sound
        if (window.spaceSounds) window.spaceSounds.openPopup();

        // Remove any existing popup
        const existingPopup = document.querySelector('.region-locations-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Create popup
        const popup = document.createElement('div');
        popup.className = 'region-locations-popup';
        popup.innerHTML = `
            <div class="popup-overlay"></div>
            <div class="popup-content">
                <div class="popup-header">
                    <h3>${resourceName} in ${region}</h3>
                    <button class="popup-close">&times;</button>
                </div>
                <div class="popup-body">
                    <div class="locations-list">
                        ${locations.length > 0 ? locations.map(loc => `
                            <div class="location-item">
                                <span class="location-system">${loc.system}</span>
                                <span class="location-planet">${loc.planet}</span>
                                <span class="location-richness">Richness: ${loc.richness}/5</span>
                            </div>
                        `).join('') : '<p>No locations found</p>'}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Add close handlers
        popup.querySelector('.popup-close').addEventListener('click', () => {
            if (window.spaceSounds) window.spaceSounds.closePopup();
            popup.remove();
        });
        popup.querySelector('.popup-overlay').addEventListener('click', () => {
            if (window.spaceSounds) window.spaceSounds.closePopup();
            popup.remove();
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                if (window.spaceSounds) window.spaceSounds.closePopup();
                popup.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    getLocationsForRegion(resourceName, region) {
        const locations = this.resourceAnalytics.locationData.get(resourceName) || [];
        return locations
            .filter(loc => loc.region === region)
            .sort((a, b) => {
                if (b.richness !== a.richness) {
                    return b.richness - a.richness;
                }
                return a.system.localeCompare(b.system);
            });
    }

    getRegionsSortedByRichness(resourceName, regions) {
        const locations = this.resourceAnalytics.locationData.get(resourceName) || [];

        // Calculate average richness per region
        const regionRichness = regions.map(region => {
            const regionLocations = locations.filter(loc => loc.region === region);
            const avgRichness = regionLocations.length > 0
                ? regionLocations.reduce((sum, loc) => sum + loc.richness, 0) / regionLocations.length
                : 0;
            return { region, avgRichness };
        });

        // Sort by average richness (highest first)
        return regionRichness.sort((a, b) => b.avgRichness - a.avgRichness);
    }

    getResourceLocations(resourceName, limit = 5) {
        const locations = this.resourceAnalytics.locationData.get(resourceName) || [];
        const topLocations = locations
            .sort((a, b) => b.richness - a.richness)
            .slice(0, limit);

        return topLocations.map(location =>
            `<span class="location-tag" title="${location.system} - ${location.planet}">
                ${location.system} (${location.richness}/5)
            </span>`
        ).join('');
    }

    getAllResourceLocations(resourceName) {
        const locations = this.resourceAnalytics.locationData.get(resourceName) || [];

        // Sort by richness (highest first), then by system name for consistency
        const sortedLocations = locations.sort((a, b) => {
            if (b.richness !== a.richness) {
                return b.richness - a.richness;
            }
            return a.system.localeCompare(b.system);
        });

        return sortedLocations.map(location =>
            `<span class="location-tag-compact" title="${location.planet} in ${location.system} - Richness: ${location.richness}/5">
                ${location.system} (${location.richness})
            </span>`
        ).join('');
    }

    getRegionalResourceLocations(resourceName) {
        const locations = this.resourceAnalytics.locationData.get(resourceName) || [];

        // Group locations by region
        const byRegion = new Map();
        locations.forEach(location => {
            const region = location.region;
            if (!byRegion.has(region)) {
                byRegion.set(region, []);
            }
            byRegion.get(region).push(location);
        });

        // Sort regions and create grouped display
        const sortedRegions = Array.from(byRegion.entries()).sort((a, b) => a[0].localeCompare(b[0]));

        return sortedRegions.map(([region, regionLocations]) => {
            // Sort locations by richness
            const sorted = regionLocations.sort((a, b) => {
                if (b.richness !== a.richness) {
                    return b.richness - a.richness;
                }
                return a.system.localeCompare(b.system);
            });

            const locationTags = sorted.map(loc =>
                `<span class="location-tag-compact" title="${loc.planet} in ${loc.system} - Richness: ${loc.richness}/5">
                    ${loc.system} (${loc.richness})
                </span>`
            ).join('');

            return `<div class="region-location-group">
                <strong class="region-name">${region}:</strong> ${locationTags}
            </div>`;
        }).join('');
    }

    getAnalyticsData() {
        return this.resourceAnalytics;
    }

    // Method for testing - returns resource distribution data
    getResourceDistribution() {
        if (!this.resourceAnalytics) {
            return {};
        }

        const distribution = {};

        // Create distribution data from locationData
        if (this.resourceAnalytics.locationData) {
            this.resourceAnalytics.locationData.forEach((locations, resourceName) => {
                // Count unique systems for this resource
                const uniqueSystems = new Set(locations.map(loc => loc.system));
                distribution[resourceName] = {
                    systems: uniqueSystems.size,
                    totalOccurrences: locations.length,
                    locations: locations
                };
            });
        }

        return distribution;
    }
}