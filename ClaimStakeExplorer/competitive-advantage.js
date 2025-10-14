/**
 * Competitive Advantage Analytics
 * Analyzes faction-based resource control and manufacturing capabilities
 */

class CompetitiveAdvantageAnalytics {
    constructor() {
        this.crossAnalytics = new CrossExplorerAnalytics();
        this.data = null;
        this.isLoading = false;
    }

    async renderCompetitiveAdvantage() {
        if (this.isLoading) return;

        const loadingMsg = document.getElementById('competitiveLoadingMessage');
        const content = document.getElementById('competitiveContent');

        if (loadingMsg) loadingMsg.style.display = 'block';
        if (content) content.innerHTML = '';

        this.isLoading = true;

        try {
            if (!this.data) {
                await this.loadData();
            }

            if (loadingMsg) loadingMsg.style.display = 'none';

            this.renderFactionManufacturing();
            this.renderResourceDominance();
            this.renderVulnerabilities();
            this.renderChokepoints();
            this.renderInsights();
        } catch (error) {
            console.error('[CompetitiveAdvantage] Error rendering:', error);
            if (loadingMsg) {
                loadingMsg.innerHTML = '<p style="color: #e74c3c;">❌ Error loading competitive advantage analysis</p>';
            }
        } finally {
            this.isLoading = false;
        }
    }

    async loadData() {
        console.log('[CompetitiveAdvantage] Loading data...');
        await this.crossAnalytics.loadAllData();
        this.data = await this.crossAnalytics.analyzeCompetitiveAdvantage();
        console.log('[CompetitiveAdvantage] Data loaded:', this.data);
    }

    renderFactionManufacturing() {
        const container = document.getElementById('competitiveContent');
        const section = document.createElement('div');
        section.className = 'competitive-section';

        const factions = this.data.factionManufacturing;

        section.innerHTML = `
            <h3>🏭 Manufacturing Capability by Faction</h3>
            <p class="section-description">
                Percentage of total recipes each faction can manufacture in their territory
            </p>

            <div class="manufacturing-grid">
                ${factions.map((faction, index) => `
                    <div class="faction-card ${this.getFactionClass(faction.faction)}">
                        <div class="faction-header">
                            <div class="faction-rank">#${index + 1}</div>
                            <div class="faction-name">${this.escapeHtml(faction.faction)}</div>
                        </div>
                        <div class="faction-stats">
                            <div class="stat-row">
                                <span class="stat-label">Systems</span>
                                <span class="stat-value">${faction.systemCount}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Planets</span>
                                <span class="stat-value">${faction.planetCount}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Resources</span>
                                <span class="stat-value">${faction.uniqueResources}</span>
                            </div>
                            <div class="stat-row highlight">
                                <span class="stat-label">Recipes</span>
                                <span class="stat-value">${faction.manufacturableRecipes}</span>
                            </div>
                        </div>
                        <div class="capability-bar">
                            <div class="capability-fill ${this.getCapabilityClass(faction.manufacturingCapability)}"
                                 style="width: ${faction.manufacturingCapability}%"></div>
                        </div>
                        <div class="capability-text">
                            ${faction.manufacturingCapability.toFixed(1)}% Manufacturing Capability
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.appendChild(section);
    }

    renderResourceDominance() {
        const container = document.getElementById('competitiveContent');
        const section = document.createElement('div');
        section.className = 'competitive-section';

        const dominance = this.data.resourceDominance.slice(0, 30);

        section.innerHTML = `
            <h3>💎 Resource Control & Dominance</h3>
            <p class="section-description">
                Resources where one faction controls >50% of all locations (showing top 30)
            </p>

            <div class="dominance-grid">
                ${dominance.map(dom => `
                    <div class="dominance-card ${dom.isMonopoly ? 'monopoly' : ''}">
                        <div class="dominance-header">
                            <div class="resource-info">
                                <div class="resource-name">${this.escapeHtml(dom.resource)}</div>
                                <span class="tier-badge tier-${dom.tier}">T${dom.tier}</span>
                                ${dom.isMonopoly ? '<span class="monopoly-badge">MONOPOLY</span>' : ''}
                            </div>
                            <div class="control-percentage ${this.getFactionClass(dom.dominantFaction.faction)}">
                                ${dom.dominantFaction.percentage.toFixed(1)}%
                            </div>
                        </div>
                        <div class="dominant-faction">
                            <strong>${this.escapeHtml(dom.dominantFaction.faction)}</strong>
                            controls ${dom.dominantFaction.count} location${dom.dominantFaction.count !== 1 ? 's' : ''}
                        </div>
                        ${dom.allControl.length > 1 ? `
                            <div class="other-control">
                                ${dom.allControl.slice(1, 3).map(ctrl =>
                                    `<span class="control-chip">${this.escapeHtml(ctrl.faction)}: ${ctrl.percentage.toFixed(0)}%</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;

        container.appendChild(section);
    }

    renderVulnerabilities() {
        const container = document.getElementById('competitiveContent');
        const section = document.createElement('div');
        section.className = 'competitive-section';

        const vulnerabilities = this.data.vulnerabilities;

        section.innerHTML = `
            <h3>⚠️ Strategic Vulnerabilities</h3>
            <p class="section-description">
                Resource dependencies between factions - who relies on whom for critical materials
            </p>

            <div class="vulnerability-grid">
                ${vulnerabilities.map(vuln => `
                    <div class="vulnerability-card ${this.getFactionClass(vuln.faction)}">
                        <div class="vulnerability-header">
                            <h4>${this.escapeHtml(vuln.faction)}</h4>
                            <div class="vulnerability-stats">
                                <div class="vuln-stat">
                                    <span class="vuln-number">${vuln.uniqueResourceDependencies}</span>
                                    <span class="vuln-label">Missing Resources</span>
                                </div>
                                <div class="vuln-stat">
                                    <span class="vuln-number">${vuln.totalDependencies}</span>
                                    <span class="vuln-label">Total Dependencies</span>
                                </div>
                            </div>
                        </div>
                        ${vuln.dependsOnFactions.length > 0 ? `
                            <div class="dependency-list">
                                <div class="dependency-label">Depends on:</div>
                                ${vuln.dependsOnFactions.slice(0, 3).map(dep => `
                                    <div class="dependency-item">
                                        <span class="dep-faction ${this.getFactionClass(dep.faction)}">
                                            ${this.escapeHtml(dep.faction)}
                                        </span>
                                        <span class="dep-count">${dep.dependencyCount} resource${dep.dependencyCount !== 1 ? 's' : ''}</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<div class="no-dependencies">✅ No major dependencies</div>'}
                    </div>
                `).join('')}
            </div>
        `;

        container.appendChild(section);
    }

    renderChokepoints() {
        const container = document.getElementById('competitiveContent');
        const section = document.createElement('div');
        section.className = 'competitive-section';

        const chokepoints = this.data.chokepoints.slice(0, 20);

        section.innerHTML = `
            <h3>🎯 Strategic Chokepoints</h3>
            <p class="section-description">
                Critical resources controlled almost exclusively (>90%) by a single faction
            </p>

            ${chokepoints.length > 0 ? `
                <div class="chokepoint-list">
                    ${chokepoints.map((choke, index) => `
                        <div class="chokepoint-item ${index < 3 ? 'critical' : ''}">
                            <div class="chokepoint-rank">${index + 1}</div>
                            <div class="chokepoint-info">
                                <div class="chokepoint-header">
                                    <span class="chokepoint-resource">${this.escapeHtml(choke.resource)}</span>
                                    <span class="tier-badge tier-${choke.tier}">T${choke.tier}</span>
                                </div>
                                <div class="chokepoint-details">
                                    <span class="controller ${this.getFactionClass(choke.controlledBy)}">
                                        ${this.escapeHtml(choke.controlledBy)}
                                    </span>
                                    <span class="control-stat">${choke.controlPercentage.toFixed(1)}% control</span>
                                    <span class="location-stat">${choke.locationCount} location${choke.locationCount !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                            <div class="chokepoint-impact">
                                <div class="impact-stat">
                                    <span class="impact-number">${choke.recipesAffected}</span>
                                    <span class="impact-label">Recipes</span>
                                </div>
                                <div class="impact-stat">
                                    <span class="impact-number">${choke.strategicValue}</span>
                                    <span class="impact-label">Value</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<div class="no-data-message">No strategic chokepoints identified</div>'}
        `;

        container.appendChild(section);
    }

    renderInsights() {
        const container = document.getElementById('competitiveContent');
        const section = document.createElement('div');
        section.className = 'competitive-section';

        const insights = this.data.insights;

        section.innerHTML = `
            <h3>📊 Strategic Insights</h3>

            <div class="insights-grid">
                <div class="insight-card success">
                    <div class="insight-icon">🏆</div>
                    <div class="insight-content">
                        <div class="insight-label">Most Capable Faction</div>
                        <div class="insight-value">${this.escapeHtml(insights.mostCapableFaction?.faction || 'N/A')}</div>
                        ${insights.mostCapableFaction ? `
                            <div class="insight-detail">
                                ${insights.mostCapableFaction.manufacturingCapability.toFixed(1)}% manufacturing capability
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="insight-card warning">
                    <div class="insight-icon">⚠️</div>
                    <div class="insight-content">
                        <div class="insight-label">Most Vulnerable Faction</div>
                        <div class="insight-value">${this.escapeHtml(insights.mostVulnerableFaction?.faction || 'N/A')}</div>
                        ${insights.mostVulnerableFaction ? `
                            <div class="insight-detail">
                                ${insights.mostVulnerableFaction.uniqueResourceDependencies} missing resources
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="insight-card danger">
                    <div class="insight-icon">🎯</div>
                    <div class="insight-content">
                        <div class="insight-label">Critical Chokepoint</div>
                        <div class="insight-value">${this.escapeHtml(insights.criticalChokepoint?.resource || 'N/A')}</div>
                        ${insights.criticalChokepoint ? `
                            <div class="insight-detail">
                                Controlled by ${this.escapeHtml(insights.criticalChokepoint.controlledBy)}
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="insight-card info">
                    <div class="insight-icon">💎</div>
                    <div class="insight-content">
                        <div class="insight-label">Resource Monopolies</div>
                        <div class="insight-value">${insights.totalMonopolies}</div>
                        <div class="insight-detail">
                            Resources with >75% control
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(section);
    }

    getFactionClass(factionName) {
        const name = factionName.toLowerCase();
        if (name.includes('mud')) return 'faction-mud';
        if (name.includes('oni')) return 'faction-oni';
        if (name.includes('ustur')) return 'faction-ustur';
        return 'faction-neutral';
    }

    getCapabilityClass(capability) {
        if (capability >= 75) return 'capability-excellent';
        if (capability >= 50) return 'capability-good';
        if (capability >= 25) return 'capability-moderate';
        return 'capability-low';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Make available globally
window.CompetitiveAdvantageAnalytics = CompetitiveAdvantageAnalytics;
