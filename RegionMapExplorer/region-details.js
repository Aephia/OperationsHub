/**
 * Region Details Display - Enhanced UI for conquest information
 */

class RegionDetailsManager {
    constructor(conquestManager) {
        this.conquestManager = conquestManager;
        this.expandedSection = null; // Track which section is expanded
    }

    /**
     * Calculate strategic value of a region
     */
    calculateRegionValue(region, systems) {
        const regionalSystems = region.systems;

        let totalPlanets = 0;
        let uniqueResources = new Set();
        let totalClaimStakes = 0;

        regionalSystems.forEach(sys => {
            totalPlanets += sys.planetCount || 0;

            // Estimate claimstakes (King=5, Core=3, Normal=1)
            if (sys.type === 'King') {
                totalClaimStakes += 5;
            } else if (sys.type === 'Core') {
                totalClaimStakes += 3;
            } else {
                totalClaimStakes += 1;
            }
        });

        return {
            totalPlanets,
            totalClaimStakes,
            kingSystem: regionalSystems.find(s => s.type === 'King'),
            coreSystems: regionalSystems.filter(s => s.type === 'Core'),
            normalSystems: regionalSystems.filter(s => s.type === 'Normal')
        };
    }

    /**
     * Render region details with conquest information
     */
    renderRegionDetails(container, data) {
        const { system, region } = data;
        const regionStatus = this.conquestManager.getRegionStatus(region.id);
        const regionalValue = this.calculateRegionValue(region, region.systems);

        // Calculate ownership distribution
        const ownership = this.calculateOwnership(region.systems);
        const status = this.getRegionStatusDisplay(regionStatus);

        // Build HTML
        const html = `
            <div class="region-info">
                <h2>${region.name}</h2>
                <div class="region-faction" style="color: ${this.getFactionColor(region.originalFaction)}">
                    Original: ${region.originalFaction} Territory
                </div>
                <div style="margin-top: 0.5rem; color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">
                    Selected: ${system.name}
                </div>
            </div>

            <div class="conquest-status-card">
                <h4>Conquest Status</h4>
                <div class="status-badge ${status.class}">${status.text}</div>
                ${regionStatus.faction ? `<div class="status-owner">Controlled by: <strong>${regionStatus.faction}</strong></div>` : '<div class="status-owner">Neutral Territory</div>'}
                <div class="status-metrics">
                    <div class="metric">
                        <span class="metric-label">Core Control:</span>
                        <span class="metric-value">${regionStatus.corePercent.toFixed(1)}%</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Total Control:</span>
                        <span class="metric-value">${regionStatus.allSystemsPercent.toFixed(1)}%</span>
                    </div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card clickable" data-detail="total-systems">
                    <div class="stat-label">Total Systems 🔍</div>
                    <div class="stat-value">${region.systems.length}</div>
                </div>
                <div class="stat-card clickable" data-detail="king-core">
                    <div class="stat-label">King/Core Systems 🔍</div>
                    <div class="stat-value">${regionalValue.coreSystems.length + (regionalValue.kingSystem ? 1 : 0)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Est. ClaimStakes</div>
                    <div class="stat-value">${regionalValue.totalClaimStakes}</div>
                </div>
                <div class="stat-card clickable" data-detail="planets">
                    <div class="stat-label">Total Planets 🔍</div>
                    <div class="stat-value">${regionalValue.totalPlanets}</div>
                </div>
            </div>

            <div class="strategic-value-section">
                <h4>Strategic Value</h4>
                <div class="value-grid">
                    <div class="value-item">
                        <span class="value-icon">👑</span>
                        <div class="value-content">
                            <div class="value-label">King System</div>
                            <div class="value-detail">${regionalValue.kingSystem ? regionalValue.kingSystem.name : 'None'}</div>
                            ${regionalValue.kingSystem ? '<div class="value-note">Has Local Market</div>' : ''}
                        </div>
                    </div>
                    <div class="value-item">
                        <span class="value-icon">⭐</span>
                        <div class="value-content">
                            <div class="value-label">Core Systems</div>
                            <div class="value-detail">${regionalValue.coreSystems.length} systems</div>
                            <div class="value-note">Must control 60%+ for ownership</div>
                        </div>
                    </div>
                    <div class="value-item">
                        <span class="value-icon">🏗️</span>
                        <div class="value-content">
                            <div class="value-label">Est. ClaimStakes</div>
                            <div class="value-detail">${regionalValue.totalClaimStakes} available</div>
                            <div class="value-note">Estimated industrial capacity</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ownership-section">
                <h4>Current Ownership</h4>
                ${this.renderOwnershipBars(ownership)}
            </div>

            <div class="systems-section">
                <h4>Systems in Region (${region.systems.length})</h4>
                <div class="systems-list">
                    ${region.systems.slice(0, 10).map(sys => {
                        const sysOwner = this.conquestManager.conquestState.get(sys.id) || sys.controllingFaction;
                        const typeIcon = sys.type === 'King' ? '👑' : sys.type === 'Core' ? '⭐' : '⚫';
                        return `
                        <div class="system-item ${sys.id === system.id ? 'selected-system' : ''} ${sys.type.toLowerCase()}-system">
                            <div class="system-header">
                                <span class="system-icon">${typeIcon}</span>
                                <span class="system-name">${sys.name}</span>
                            </div>
                            <div class="system-meta">
                                <span class="system-type">${sys.type}</span>
                                <span class="system-controller" style="color: ${this.getFactionColor(sysOwner)}">${sysOwner}</span>
                                <span class="system-planets">${sys.planetCount || 0} planets</span>
                            </div>
                        </div>
                    `}).join('')}
                    ${region.systems.length > 10 ? `<div class="more-items">+ ${region.systems.length - 10} more systems</div>` : ''}
                </div>
            </div>

            <div class="conquest-tips">
                <h4>Conquest Requirements</h4>
                <ul>
                    <li><strong>To Claim Region:</strong> Control King System + 60%+ of Core Systems (${Math.ceil((regionalValue.coreSystems.length + 1) * 0.6)} of ${regionalValue.coreSystems.length + 1})</li>
                    <li><strong>To Make Border → Neutral:</strong> Enemy needs 40%+ Core control</li>
                    <li><strong>To Make Safe:</strong> Control all systems + all neighboring regions</li>
                </ul>
            </div>
        `;

        container.innerHTML = html;

        // Add click handlers for stat cards
        this.attachDetailHandlers(region, regionalValue);
    }

    attachDetailHandlers(region, regionalValue) {
        const statCards = document.querySelectorAll('.stat-card.clickable');

        statCards.forEach(card => {
            card.addEventListener('click', () => {
                const detailType = card.getAttribute('data-detail');

                // Show modal based on type
                if (detailType === 'total-systems') {
                    this.showModal('Systems Breakdown', this.renderSystemsBreakdown(region));
                } else if (detailType === 'king-core') {
                    this.showModal('King & Core Systems', this.renderKingCoreBreakdown(region, regionalValue));
                } else if (detailType === 'planets') {
                    this.showModal('Planet Resources', this.renderPlanetsResourcesBreakdown(region));
                }
            });
        });
    }

    showModal(title, content) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('resourceModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'resourceModal';
            modal.className = 'resource-modal';
            modal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title"></h3>
                        <button class="modal-close">✕</button>
                    </div>
                    <div class="modal-body"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close handlers
            modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
            modal.querySelector('.modal-overlay').addEventListener('click', () => this.closeModal());
        }

        // Set content
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-body').innerHTML = content;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('resourceModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    renderSystemsBreakdown(region) {
        const systemsByFaction = {};

        region.systems.forEach(sys => {
            const faction = this.conquestManager.conquestState.get(sys.id) || sys.controllingFaction;
            if (!systemsByFaction[faction]) {
                systemsByFaction[faction] = [];
            }
            systemsByFaction[faction].push(sys);
        });

        return `
            ${Object.entries(systemsByFaction).map(([faction, systems]) => `
                <div class="faction-breakdown">
                    <div class="faction-breakdown-header" style="border-left: 4px solid ${this.getFactionColor(faction)}">
                        <strong>${faction}</strong> - ${systems.length} systems (${((systems.length / region.systems.length) * 100).toFixed(1)}%)
                    </div>
                    <div class="systems-breakdown-list">
                        ${systems.map(sys => {
                            const typeIcon = sys.type === 'King' ? '👑' : sys.type === 'Core' ? '⭐' : '⚫';
                            return `
                                <div class="breakdown-system-item">
                                    <span>${typeIcon} ${sys.name}</span>
                                    <span class="system-type-badge">${sys.type}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `).join('')}
        `;
    }

    renderKingCoreBreakdown(region, regionalValue) {
        const coreSystemsByFaction = {};
        const allCoreSystems = [...(regionalValue.kingSystem ? [regionalValue.kingSystem] : []), ...regionalValue.coreSystems];

        allCoreSystems.forEach(sys => {
            const faction = this.conquestManager.conquestState.get(sys.id) || sys.controllingFaction;
            if (!coreSystemsByFaction[faction]) {
                coreSystemsByFaction[faction] = [];
            }
            coreSystemsByFaction[faction].push(sys);
        });

        return `
            <div class="breakdown-note">
                Control <strong>${Math.ceil(allCoreSystems.length * 0.6)}</strong> of ${allCoreSystems.length} King/Core systems (60%+) to claim this region.
            </div>
            ${Object.entries(coreSystemsByFaction).map(([faction, systems]) => `
                <div class="faction-breakdown">
                    <div class="faction-breakdown-header" style="border-left: 4px solid ${this.getFactionColor(faction)}">
                        <strong>${faction}</strong> - ${systems.length} / ${allCoreSystems.length} (${((systems.length / allCoreSystems.length) * 100).toFixed(1)}%)
                    </div>
                    <div class="systems-breakdown-list">
                        ${systems.map(sys => {
                            const typeIcon = sys.type === 'King' ? '👑' : '⭐';
                            const ownershipPts = sys.type === 'King' ? 15 : 8;
                            return `
                                <div class="breakdown-system-item">
                                    <span>${typeIcon} ${sys.name}</span>
                                    <span class="system-type-badge">${sys.type} (${ownershipPts} pts)</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `).join('')}
        `;
    }

    renderPlanetsResourcesBreakdown(region) {
        // Collect all resources by faction
        const resourcesByFaction = {};
        let totalPlanets = 0;
        let totalResources = {};

        region.systems.forEach(sys => {
            const faction = this.conquestManager.conquestState.get(sys.id) || sys.controllingFaction;

            if (!resourcesByFaction[faction]) {
                resourcesByFaction[faction] = {
                    planets: 0,
                    resources: {},
                    systems: []
                };
            }

            if (sys.planets && sys.planets.length > 0) {
                resourcesByFaction[faction].planets += sys.planets.length;
                totalPlanets += sys.planets.length;

                const systemResources = {};
                sys.planets.forEach(planet => {
                    if (planet.resources) {
                        planet.resources.forEach(res => {
                            const resKey = res.name;
                            // Count resources by faction
                            resourcesByFaction[faction].resources[resKey] = (resourcesByFaction[faction].resources[resKey] || 0) + 1;
                            // Count total resources
                            totalResources[resKey] = (totalResources[resKey] || 0) + 1;
                            // Track system resources
                            systemResources[resKey] = (systemResources[resKey] || 0) + 1;
                        });
                    }
                });

                if (Object.keys(systemResources).length > 0) {
                    resourcesByFaction[faction].systems.push({
                        name: sys.name,
                        type: sys.type,
                        planetCount: sys.planets.length,
                        resources: systemResources
                    });
                }
            }
        });

        return `
            <div class="breakdown-note">
                Total of <strong>${totalPlanets}</strong> planets across ${region.systems.length} systems with <strong>${Object.keys(totalResources).length}</strong> unique resources
            </div>

            ${Object.entries(resourcesByFaction).map(([faction, data]) => {
                const sortedResources = Object.entries(data.resources).sort((a, b) => b[1] - a[1]);
                return `
                    <div class="faction-breakdown">
                        <div class="faction-breakdown-header" style="border-left: 4px solid ${this.getFactionColor(faction)}">
                            <strong>${faction}</strong> - ${data.planets} planets, ${Object.keys(data.resources).length} resources
                        </div>

                        <div class="resource-summary">
                            <h5>Resource Summary:</h5>
                            <div class="resource-tags">
                                ${sortedResources.slice(0, 15).map(([resName, count]) => `
                                    <span class="resource-tag" title="${resName} appears on ${count} planet${count > 1 ? 's' : ''}">
                                        ${resName} <span class="resource-count">×${count}</span>
                                    </span>
                                `).join('')}
                                ${sortedResources.length > 15 ? `<span class="resource-tag more">+${sortedResources.length - 15} more</span>` : ''}
                            </div>
                        </div>

                        <div class="systems-breakdown-list">
                            ${data.systems.map(sys => {
                                const typeIcon = sys.type === 'King' ? '👑' : sys.type === 'Core' ? '⭐' : '⚫';
                                const topResources = Object.entries(sys.resources).slice(0, 3);
                                return `
                                    <div class="breakdown-system-item expandable">
                                        <div class="system-header-row">
                                            <span>${typeIcon} ${sys.name}</span>
                                            <span class="planet-count-badge">${sys.planetCount} planet${sys.planetCount > 1 ? 's' : ''}, ${Object.keys(sys.resources).length} resources</span>
                                        </div>
                                        <div class="system-resources-preview">
                                            ${topResources.map(([res, count]) => `<span class="resource-mini">${res} ×${count}</span>`).join(', ')}
                                            ${Object.keys(sys.resources).length > 3 ? ` +${Object.keys(sys.resources).length - 3} more` : ''}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }).join('')}
        `;
    }

    calculateOwnership(regionalSystems) {
        const ownership = {};

        regionalSystems.forEach(sys => {
            const faction = this.conquestManager.conquestState.get(sys.id) || sys.controllingFaction;
            ownership[faction] = (ownership[faction] || 0) + sys.ownershipValue;
        });

        // Convert to percentages
        const total = Object.values(ownership).reduce((sum, val) => sum + val, 0);
        const percentages = {};
        Object.keys(ownership).forEach(faction => {
            percentages[faction] = (ownership[faction] / total) * 100;
        });

        return percentages;
    }

    getRegionStatusDisplay(regionStatus) {
        if (!regionStatus) {
            return { text: 'UNKNOWN', class: 'status-unknown' };
        }

        switch (regionStatus.status) {
            case 'SAFE':
                return { text: 'SAFE', class: 'status-safe' };
            case 'BORDER':
                if (regionStatus.partiallyOwned) {
                    return { text: 'BORDER (Partially Owned)', class: 'status-border' };
                }
                return { text: 'BORDER (Fully Owned)', class: 'status-border' };
            case 'NEUTRAL':
            default:
                return { text: 'NEUTRAL', class: 'status-neutral' };
        }
    }

    renderOwnershipBars(ownership) {
        const sorted = Object.entries(ownership).sort((a, b) => b[1] - a[1]);

        return sorted.map(([faction, percentage]) => `
            <div class="ownership-bar">
                <div class="ownership-header">
                    <span class="ownership-faction">${faction}</span>
                    <span class="ownership-percentage">${percentage.toFixed(1)}%</span>
                </div>
                <div class="ownership-progress">
                    <div class="ownership-fill" style="width: ${percentage}%; background: ${this.getFactionColor(faction)}"></div>
                </div>
            </div>
        `).join('');
    }

    getFactionColor(faction) {
        const colors = {
            MUD: '#ff4444',
            ONI: '#4444ff',
            UST: '#ffaa00',
            MRZ: '#888888'
        };
        return colors[faction] || '#666666';
    }

    /**
     * Show conquest statistics modal
     */
    showConquestStatistics(region) {
        // Initialize statistics calculator if needed
        if (!window.conquestStatsCalculator) {
            window.conquestStatsCalculator = new ConquestStatistics();
            window.conquestStatsCalculator.init();
        }

        const stats = window.conquestStatsCalculator;
        const report = stats.generateConquestReport(region, 'Attacker');

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'conquest-stats-modal';
        modal.innerHTML = `
            <div class="conquest-stats-content">
                <div class="conquest-stats-header">
                    <h2>📊 Conquest Impact Analysis: ${region.name}</h2>
                    <button class="close-modal-btn">✕</button>
                </div>

                <div class="conquest-stats-body">
                    ${this.renderConquestStatistics(report)}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.close-modal-btn').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Render conquest statistics content
     */
    renderConquestStatistics(report) {
        const { region, resourceImpact, productionImpact, craftingImpact } = report;

        return `
            <div class="conquest-summary-section">
                <h3>📋 Executive Summary</h3>
                <div class="summary-grid">
                    <div class="summary-card region-info-card">
                        <div class="summary-card-icon">🗺️</div>
                        <div class="summary-card-content">
                            <div class="summary-card-label">Region</div>
                            <div class="summary-card-value">${region.name}</div>
                            <div class="summary-card-detail">${region.systemCount} systems • ${region.originalFaction} Territory</div>
                        </div>
                    </div>

                    <div class="summary-card resources-card">
                        <div class="summary-card-icon">💎</div>
                        <div class="summary-card-content">
                            <div class="summary-card-label">Resource Impact</div>
                            <div class="summary-card-value">${resourceImpact.totalResourceLocations}</div>
                            <div class="summary-card-detail">${resourceImpact.uniqueResources} unique resources on ${resourceImpact.totalPlanets} planets</div>
                        </div>
                    </div>

                    <div class="summary-card production-card">
                        <div class="summary-card-icon">🏭</div>
                        <div class="summary-card-content">
                            <div class="summary-card-label">Production Loss (Hypothetical)</div>
                            <div class="summary-card-value">${Math.round(productionImpact.estimatedProduction.totalMiningOutput)} tons/day</div>
                            <div class="summary-card-detail">From ${productionImpact.totalStakes} hypothetical claim stakes</div>
                        </div>
                    </div>

                    <div class="summary-card crafting-card">
                        <div class="summary-card-icon">🔧</div>
                        <div class="summary-card-content">
                            <div class="summary-card-label">Crafting Impact</div>
                            <div class="summary-card-value">${craftingImpact.totalRecipes}</div>
                            <div class="summary-card-detail">${craftingImpact.highDependencyRecipes} high-dependency recipes affected</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="conquest-stats-section">
                <h3>🔴 Resource Locations Lost</h3>
                <div class="stats-summary">
                    <div class="summary-stat">
                        <span class="stat-number">${resourceImpact.totalResourceLocations}</span>
                        <span class="stat-label">Total Resource Locations</span>
                    </div>
                    <div class="summary-stat">
                        <span class="stat-number">${resourceImpact.uniqueResources}</span>
                        <span class="stat-label">Unique Resources</span>
                    </div>
                    <div class="summary-stat">
                        <span class="stat-number">${resourceImpact.totalPlanets}</span>
                        <span class="stat-label">Total Planets</span>
                    </div>
                </div>

                <div class="resource-chart">
                    <h4>Top Resources Lost</h4>
                    ${resourceImpact.resourceLocations.slice(0, 15).map(res => `
                        <div class="resource-bar-item">
                            <div class="resource-bar-header">
                                <span class="resource-name">${res.name}</span>
                                <span class="resource-stat">${res.count} locations (Avg richness: ${res.avgRichness.toFixed(1)})</span>
                            </div>
                            <div class="resource-bar-container">
                                <div class="resource-bar-fill" style="width: ${(res.count / resourceImpact.resourceLocations[0].count) * 100}%"></div>
                            </div>
                            <div class="resource-richness-breakdown">
                                <span class="richness-badge poor">Poor: ${res.richnessCounts[1]}</span>
                                <span class="richness-badge medium">Medium: ${res.richnessCounts[2]}</span>
                                <span class="richness-badge rich">Rich: ${res.richnessCounts[3]}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="conquest-stats-section">
                <h3>🏭 Hypothetical Production Impact</h3>
                <div class="hypothetical-notice">
                    ⚠️ <strong>Hypothetical Scenario:</strong> Assumes 50 claim stakes distributed across the region based on system importance
                </div>

                <div class="stats-summary">
                    <div class="summary-stat">
                        <span class="stat-number">${productionImpact.totalStakes}</span>
                        <span class="stat-label">Hypothetical Claim Stakes</span>
                    </div>
                    <div class="summary-stat">
                        <span class="stat-number">${productionImpact.estimatedProduction.totalMiningFacilities}</span>
                        <span class="stat-label">Est. Mining Facilities</span>
                    </div>
                    <div class="summary-stat">
                        <span class="stat-number">${Math.round(productionImpact.estimatedProduction.totalMiningOutput)}</span>
                        <span class="stat-label">Tons/Day Production Lost</span>
                    </div>
                </div>

                <div class="production-chart">
                    <h4>Top Production Losses (tons/day)</h4>
                    ${productionImpact.estimatedProduction.mining.slice(0, 10).map(item => `
                        <div class="production-bar-item">
                            <div class="production-bar-header">
                                <span class="production-name">${item.resource}</span>
                                <span class="production-value">${item.tonsPerDay} tons/day</span>
                            </div>
                            <div class="production-bar-container">
                                <div class="production-bar-fill" style="width: ${(item.tonsPerDay / productionImpact.estimatedProduction.mining[0].tonsPerDay) * 100}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="conquest-stats-section">
                <h3>🔧 Crafting Impact</h3>
                <div class="stats-summary">
                    <div class="summary-stat">
                        <span class="stat-number">${craftingImpact.totalRecipes}</span>
                        <span class="stat-label">Recipes Using Regional Resources</span>
                    </div>
                    <div class="summary-stat">
                        <span class="stat-number">${craftingImpact.highDependencyRecipes}</span>
                        <span class="stat-label">High Dependency Recipes (>50%)</span>
                    </div>
                </div>

                <div class="crafting-recipes-list">
                    <h4>Most Impacted Recipes</h4>
                    ${craftingImpact.craftableRecipes.slice(0, 20).map(recipe => `
                        <div class="recipe-impact-item">
                            <div class="recipe-header">
                                <span class="recipe-name">${recipe.name}</span>
                                <span class="recipe-dependency">${recipe.regionalDependency.toFixed(0)}% regional inputs</span>
                            </div>
                            <div class="recipe-inputs">
                                ${recipe.regionalInputs.map(input => `<span class="recipe-input-tag">${input}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

window.RegionDetailsManager = RegionDetailsManager;
