// Facility Analytics & Visualization System
// Provides nerdy charts, graphs, and data analysis for facility construction

class FacilityAnalytics {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.charts = {};
        this.currentFacilityStats = null; // Store for re-rendering
        this.showBalancedResources = false; // Toggle state
    }

    // Main method to render all analytics for a facility plan
    renderFacilityAnalytics(facilityPlan, facilityStats, validation) {
        if (!this.container) return;

        // Store stats for toggle functionality
        this.currentFacilityStats = facilityStats;

        const html = `
            <div class="facility-analytics-dashboard">
                <!-- Header Stats -->
                <div class="analytics-header">
                    ${this.renderHeaderStats(facilityPlan, facilityStats, validation)}
                </div>

                <!-- Charts Grid -->
                <div class="analytics-charts-grid">
                    <!-- Resource Flow -->
                    <div class="analytics-card">
                        <h4>📊 Resource Flow Analysis</h4>
                        <canvas id="resourceFlowChart"></canvas>
                        <div id="resourceFlowLegend" class="chart-legend"></div>
                    </div>

                    <!-- Power Distribution -->
                    <div class="analytics-card">
                        <h4>⚡ Power Distribution</h4>
                        <canvas id="powerDistributionChart"></canvas>
                        <div id="powerStats" class="chart-stats"></div>
                    </div>

                    <!-- Building Composition -->
                    <div class="analytics-card">
                        <h4>🏗️ Building Composition</h4>
                        <canvas id="buildingCompositionChart"></canvas>
                    </div>

                    <!-- Crew Allocation -->
                    <div class="analytics-card">
                        <h4>👥 Crew Allocation</h4>
                        <canvas id="crewAllocationChart"></canvas>
                        <div id="crewStats" class="chart-stats"></div>
                    </div>

                    <!-- Slot Utilization -->
                    <div class="analytics-card">
                        <h4>📦 Slot Utilization</h4>
                        <canvas id="slotUtilizationChart"></canvas>
                        <div id="slotStats" class="chart-stats"></div>
                    </div>

                    <!-- Construction Timeline -->
                    <div class="analytics-card">
                        <h4>⏱️ Construction Timeline</h4>
                        <canvas id="constructionTimelineChart"></canvas>
                        <div id="timelineStats" class="chart-stats"></div>
                    </div>

                    <!-- Resource Production Efficiency -->
                    <div class="analytics-card analytics-card-wide">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h4 style="margin: 0;">🔄 Resource Production & Consumption</h4>
                            <label style="font-size: 12px; color: #ccc; cursor: pointer;">
                                <input type="checkbox" id="showBalancedResources" style="margin-right: 5px;" />
                                Show Balanced Resources (net = 0)
                            </label>
                        </div>
                        <canvas id="resourceEfficiencyChart"></canvas>
                        <div id="efficiencyStats" class="chart-stats"></div>
                    </div>

                    <!-- Building Tier Distribution -->
                    <div class="analytics-card">
                        <h4>⭐ Tier Distribution</h4>
                        <canvas id="tierDistributionChart"></canvas>
                    </div>

                    <!-- Cost Breakdown -->
                    <div class="analytics-card analytics-card-wide">
                        <h4>💰 Construction Cost Breakdown</h4>
                        <canvas id="costBreakdownChart"></canvas>
                        <div id="costStats" class="chart-stats"></div>
                    </div>
                </div>

                <!-- Detailed Statistics Tables -->
                <div class="analytics-tables">
                    ${this.renderDetailedTables(facilityPlan, facilityStats)}
                </div>
            </div>
        `;

        this.container.innerHTML = html;

        // Render all charts after DOM update
        setTimeout(() => {
            this.renderAllCharts(facilityPlan, facilityStats, validation);
            this.setupEventListeners();
        }, 100);
    }

    // Setup event listeners for interactive elements
    setupEventListeners() {
        const balancedToggle = document.getElementById('showBalancedResources');
        if (balancedToggle) {
            balancedToggle.addEventListener('change', (e) => {
                this.showBalancedResources = e.target.checked;
                this.renderResourceEfficiencyChart(this.currentFacilityStats);
            });
        }
    }

    // Render header stats cards
    renderHeaderStats(facilityPlan, facilityStats, validation) {
        const buildings = facilityPlan.buildings || [];
        const totalTime = buildings.reduce((sum, b) => sum + (b.constructionTime || 0), 0);

        return `
            <div class="stat-cards">
                <div class="stat-card ${validation.valid ? 'valid' : 'invalid'}">
                    <div class="stat-label">Validation Status</div>
                    <div class="stat-value">${validation.valid ? '✅ VALID' : '❌ INVALID'}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Buildings</div>
                    <div class="stat-value">${buildings.length}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Build Time</div>
                    <div class="stat-value">${(totalTime / 60).toFixed(1)}h</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Crew</div>
                    <div class="stat-value">${facilityStats.totalNeededCrew}/${facilityStats.totalCrewSlots}</div>
                </div>
                <div class="stat-card ${validation.powerInsufficient ? 'warning' : ''}">
                    <div class="stat-label">Net Power</div>
                    <div class="stat-value">${validation.powerOutput - validation.powerConsumption}W</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Storage Capacity</div>
                    <div class="stat-value">${(facilityStats.totalStorage / 1000).toFixed(1)}k</div>
                </div>
            </div>
        `;
    }

    // Render all charts
    renderAllCharts(facilityPlan, facilityStats, validation) {
        this.renderResourceFlowChart(facilityStats);
        this.renderPowerDistributionChart(facilityPlan.buildings, validation);
        this.renderBuildingCompositionChart(facilityPlan.buildings);
        this.renderCrewAllocationChart(facilityPlan.buildings, facilityStats);
        this.renderSlotUtilizationChart(validation);
        this.renderConstructionTimelineChart(facilityPlan.buildings);
        this.renderResourceEfficiencyChart(facilityStats);
        this.renderTierDistributionChart(facilityPlan.buildings);
        this.renderCostBreakdownChart(facilityStats);
    }

    // Resource Flow Chart (Production vs Consumption)
    renderResourceFlowChart(facilityStats) {
        const ctx = document.getElementById('resourceFlowChart');
        if (!ctx) return;

        const allResources = new Set([
            ...Object.keys(facilityStats.resourceExtraction || {}),
            ...Object.keys(facilityStats.resourceConsumption || {})
        ]);

        const data = {
            labels: Array.from(allResources),
            datasets: [
                {
                    label: 'Production',
                    data: Array.from(allResources).map(r => facilityStats.resourceExtraction[r] || 0),
                    backgroundColor: 'rgba(76, 175, 80, 0.7)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Consumption',
                    data: Array.from(allResources).map(r => -(facilityStats.resourceConsumption[r] || 0)),
                    backgroundColor: 'rgba(244, 67, 54, 0.7)',
                    borderColor: 'rgba(244, 67, 54, 1)',
                    borderWidth: 2
                }
            ]
        };

        if (this.charts.resourceFlow) this.charts.resourceFlow.destroy();
        this.charts.resourceFlow = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Units/Hour', color: '#ccc' },
                        ticks: { color: '#ccc' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#ccc', maxRotation: 45, minRotation: 45 },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#ccc' } },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = Math.abs(context.parsed.y);
                                return `${context.dataset.label}: ${value.toFixed(3)}/hr`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Power Distribution Chart
    renderPowerDistributionChart(buildings, validation) {
        const ctx = document.getElementById('powerDistributionChart');
        if (!ctx) return;

        const powerBuildings = buildings.filter(b => b.power && b.power !== 0);
        const generators = powerBuildings.filter(b => b.power > 0);
        const consumers = powerBuildings.filter(b => b.power < 0);

        const data = {
            labels: ['Base Power', 'Generators', 'Consumers', 'Net Power'],
            datasets: [{
                data: [
                    validation.basePower,
                    validation.buildingPower > 0 ? validation.buildingPower : 0,
                    Math.abs(validation.buildingPower < 0 ? validation.buildingPower : 0),
                    validation.powerOutput - validation.powerConsumption
                ],
                backgroundColor: [
                    'rgba(33, 150, 243, 0.8)',
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(244, 67, 54, 0.8)',
                    validation.powerOutput >= validation.powerConsumption ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)'
                ],
                borderColor: [
                    'rgba(33, 150, 243, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(244, 67, 54, 1)',
                    validation.powerOutput >= validation.powerConsumption ? 'rgba(76, 175, 80, 1)' : 'rgba(244, 67, 54, 1)'
                ],
                borderWidth: 2
            }]
        };

        if (this.charts.powerDistribution) this.charts.powerDistribution.destroy();
        this.charts.powerDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: '#ccc' } },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.parsed}W`
                        }
                    }
                }
            }
        });

        // Update power stats
        const statsDiv = document.getElementById('powerStats');
        if (statsDiv) {
            statsDiv.innerHTML = `
                <div class="stat-row">Total Output: <strong>${validation.powerOutput}W</strong></div>
                <div class="stat-row">Total Consumption: <strong>${validation.powerConsumption}W</strong></div>
                <div class="stat-row ${validation.powerOutput >= validation.powerConsumption ? 'positive' : 'negative'}">
                    Net Power: <strong>${validation.powerOutput - validation.powerConsumption}W</strong>
                </div>
            `;
        }
    }

    // Building Composition Chart (by type)
    renderBuildingCompositionChart(buildings) {
        const ctx = document.getElementById('buildingCompositionChart');
        if (!ctx) return;

        const typeCount = {};
        buildings.forEach(building => {
            const type = this.getBuildingType(building);
            typeCount[type] = (typeCount[type] || 0) + 1;
        });

        const data = {
            labels: Object.keys(typeCount),
            datasets: [{
                data: Object.values(typeCount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
                borderWidth: 2
            }]
        };

        if (this.charts.buildingComposition) this.charts.buildingComposition.destroy();
        this.charts.buildingComposition = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: '#ccc' } }
                }
            }
        });
    }

    // Crew Allocation Chart
    renderCrewAllocationChart(buildings, facilityStats) {
        const ctx = document.getElementById('crewAllocationChart');
        if (!ctx) return;

        const data = {
            labels: buildings.map(b => b.name.substring(0, 20)),
            datasets: [
                {
                    label: 'Crew Needed',
                    data: buildings.map(b => b.neededCrew || 0),
                    backgroundColor: 'rgba(255, 152, 0, 0.7)',
                    borderColor: 'rgba(255, 152, 0, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Crew Slots',
                    data: buildings.map(b => b.crewSlots || 0),
                    backgroundColor: 'rgba(33, 150, 243, 0.7)',
                    borderColor: 'rgba(33, 150, 243, 1)',
                    borderWidth: 2
                }
            ]
        };

        if (this.charts.crewAllocation) this.charts.crewAllocation.destroy();
        this.charts.crewAllocation = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Crew', color: '#ccc' },
                        ticks: { color: '#ccc' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#ccc', maxRotation: 90, minRotation: 45, font: { size: 10 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#ccc' } }
                }
            }
        });

        // Update crew stats
        const statsDiv = document.getElementById('crewStats');
        if (statsDiv) {
            statsDiv.innerHTML = `
                <div class="stat-row">Total Crew Needed: <strong>${facilityStats.totalNeededCrew}</strong></div>
                <div class="stat-row">Total Crew Slots: <strong>${facilityStats.totalCrewSlots}</strong></div>
                <div class="stat-row">Efficiency: <strong>${((facilityStats.totalNeededCrew / Math.max(facilityStats.totalCrewSlots, 1)) * 100).toFixed(1)}%</strong></div>
            `;
        }
    }

    // Slot Utilization Chart
    renderSlotUtilizationChart(validation) {
        const ctx = document.getElementById('slotUtilizationChart');
        if (!ctx) return;

        const usedSlots = validation.slotsUsed;
        const availableSlots = validation.availableSlots;
        const remainingSlots = Math.max(0, availableSlots - usedSlots);

        const data = {
            labels: ['Used Slots', 'Remaining Slots'],
            datasets: [{
                data: [usedSlots, remainingSlots],
                backgroundColor: [
                    validation.slotsExceeded ? 'rgba(244, 67, 54, 0.8)' : 'rgba(76, 175, 80, 0.8)',
                    'rgba(158, 158, 158, 0.4)'
                ],
                borderColor: [
                    validation.slotsExceeded ? 'rgba(244, 67, 54, 1)' : 'rgba(76, 175, 80, 1)',
                    'rgba(158, 158, 158, 0.8)'
                ],
                borderWidth: 2
            }]
        };

        if (this.charts.slotUtilization) this.charts.slotUtilization.destroy();
        this.charts.slotUtilization = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: '#ccc' } }
                }
            }
        });

        // Update slot stats
        const statsDiv = document.getElementById('slotStats');
        if (statsDiv) {
            const utilization = (usedSlots / availableSlots * 100).toFixed(1);
            statsDiv.innerHTML = `
                <div class="stat-row">Used: <strong>${usedSlots}/${availableSlots}</strong></div>
                <div class="stat-row">Utilization: <strong>${utilization}%</strong></div>
                <div class="stat-row ${validation.slotsExceeded ? 'negative' : ''}">
                    Status: <strong>${validation.slotsExceeded ? 'EXCEEDED ⚠️' : 'OK ✓'}</strong>
                </div>
            `;
        }
    }

    // Construction Timeline Chart
    renderConstructionTimelineChart(buildings) {
        const ctx = document.getElementById('constructionTimelineChart');
        if (!ctx) return;

        const sortedBuildings = [...buildings].sort((a, b) => (b.constructionTime || 0) - (a.constructionTime || 0));

        const data = {
            labels: sortedBuildings.map(b => b.name.substring(0, 25)),
            datasets: [{
                label: 'Build Time (minutes)',
                data: sortedBuildings.map(b => b.constructionTime || 0),
                backgroundColor: 'rgba(156, 39, 176, 0.7)',
                borderColor: 'rgba(156, 39, 176, 1)',
                borderWidth: 2
            }]
        };

        if (this.charts.constructionTimeline) this.charts.constructionTimeline.destroy();
        this.charts.constructionTimeline = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Minutes', color: '#ccc' },
                        ticks: { color: '#ccc' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#ccc', font: { size: 10 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#ccc' } }
                }
            }
        });

        // Update timeline stats
        const totalTime = buildings.reduce((sum, b) => sum + (b.constructionTime || 0), 0);
        const avgTime = totalTime / buildings.length;
        const statsDiv = document.getElementById('timelineStats');
        if (statsDiv) {
            statsDiv.innerHTML = `
                <div class="stat-row">Total Time: <strong>${totalTime} min (${(totalTime / 60).toFixed(1)}h)</strong></div>
                <div class="stat-row">Average: <strong>${avgTime.toFixed(0)} min</strong></div>
                <div class="stat-row">Longest: <strong>${sortedBuildings[0]?.name.substring(0, 20)}: ${sortedBuildings[0]?.constructionTime || 0} min</strong></div>
            `;
        }
    }

    // Resource Efficiency Chart
    renderResourceEfficiencyChart(facilityStats) {
        const ctx = document.getElementById('resourceEfficiencyChart');
        if (!ctx) return;

        const production = facilityStats.resourceExtraction || {};
        const consumption = facilityStats.resourceConsumption || {};

        const allResources = new Set([...Object.keys(production), ...Object.keys(consumption)]);

        // Build resource data with production and consumption
        const resourceData = [];
        allResources.forEach(resource => {
            const prod = production[resource] || 0;
            const cons = consumption[resource] || 0;
            const netFlow = prod - cons;

            // Filter based on toggle
            if (!this.showBalancedResources && Math.abs(netFlow) < 0.001) {
                return; // Skip balanced resources if toggle is off
            }

            resourceData.push({
                name: resource,
                production: prod,
                consumption: -cons, // Make negative for display
                netFlow: netFlow
            });
        });

        // Sort by net flow (highest production to highest consumption)
        resourceData.sort((a, b) => b.netFlow - a.netFlow);

        const labels = resourceData.map(r => r.name);

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Production',
                    data: resourceData.map(r => r.production),
                    backgroundColor: 'rgba(76, 175, 80, 0.7)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Consumption',
                    data: resourceData.map(r => r.consumption),
                    backgroundColor: 'rgba(244, 67, 54, 0.7)',
                    borderColor: 'rgba(244, 67, 54, 1)',
                    borderWidth: 2
                }
            ]
        };

        if (this.charts.resourceEfficiency) this.charts.resourceEfficiency.destroy();
        this.charts.resourceEfficiency = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Units/Hour', color: '#ccc' },
                        ticks: {
                            color: '#ccc',
                            callback: function(value) {
                                return value.toFixed(2);
                            }
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#ccc', font: { size: 11 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: '#ccc' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = Math.abs(context.parsed.x);
                                return `${label}: ${value.toFixed(3)}/hour`;
                            }
                        }
                    }
                }
            }
        });

        // Update efficiency stats summary
        this.updateEfficiencyStats(production, consumption);
    }

    // Update efficiency stats summary below the chart
    updateEfficiencyStats(production, consumption) {
        const statsDiv = document.getElementById('efficiencyStats');
        if (!statsDiv) return;

        // Calculate totals
        const totalProduction = Object.values(production).reduce((sum, val) => sum + val, 0);
        const totalConsumption = Object.values(consumption).reduce((sum, val) => sum + val, 0);
        const netBalance = totalProduction - totalConsumption;

        // Find most produced and consumed resources
        const prodEntries = Object.entries(production).sort((a, b) => b[1] - a[1]);
        const consEntries = Object.entries(consumption).sort((a, b) => b[1] - a[1]);

        const topProduced = prodEntries.length > 0 ? prodEntries[0] : null;
        const topConsumed = consEntries.length > 0 ? consEntries[0] : null;

        statsDiv.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 10px;">
                <div style="background: rgba(76, 175, 80, 0.2); padding: 8px; border-radius: 4px; border-left: 3px solid rgba(76, 175, 80, 1);">
                    <div style="font-size: 11px; color: #aaa;">Total Production</div>
                    <div style="font-size: 16px; color: #4CAF50; font-weight: bold;">${totalProduction.toFixed(3)} /hour</div>
                    ${topProduced ? `<div style="font-size: 10px; color: #ccc; margin-top: 4px;">Top: ${topProduced[0]} (${topProduced[1].toFixed(3)})</div>` : ''}
                </div>
                <div style="background: rgba(244, 67, 54, 0.2); padding: 8px; border-radius: 4px; border-left: 3px solid rgba(244, 67, 54, 1);">
                    <div style="font-size: 11px; color: #aaa;">Total Consumption</div>
                    <div style="font-size: 16px; color: #f44336; font-weight: bold;">${totalConsumption.toFixed(3)} /hour</div>
                    ${topConsumed ? `<div style="font-size: 10px; color: #ccc; margin-top: 4px;">Top: ${topConsumed[0]} (${topConsumed[1].toFixed(3)})</div>` : ''}
                </div>
                <div style="background: rgba(33, 150, 243, 0.2); padding: 8px; border-radius: 4px; border-left: 3px solid rgba(33, 150, 243, 1);">
                    <div style="font-size: 11px; color: #aaa;">Net Balance</div>
                    <div style="font-size: 16px; color: ${netBalance >= 0 ? '#4CAF50' : '#f44336'}; font-weight: bold;">${netBalance >= 0 ? '+' : ''}${netBalance.toFixed(3)} /hour</div>
                    <div style="font-size: 10px; color: #ccc; margin-top: 4px;">${Object.keys(production).length} produced, ${Object.keys(consumption).length} consumed</div>
                </div>
            </div>
        `;
    }

    // Tier Distribution Chart
    renderTierDistributionChart(buildings) {
        const ctx = document.getElementById('tierDistributionChart');
        if (!ctx) return;

        const tierCount = {};
        buildings.forEach(building => {
            const tier = building.tier || 1;
            tierCount[`Tier ${tier}`] = (tierCount[`Tier ${tier}`] || 0) + 1;
        });

        const data = {
            labels: Object.keys(tierCount).sort(),
            datasets: [{
                data: Object.values(tierCount),
                backgroundColor: [
                    'rgba(158, 158, 158, 0.8)',
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(33, 150, 243, 0.8)',
                    'rgba(156, 39, 176, 0.8)',
                    'rgba(255, 152, 0, 0.8)'
                ],
                borderWidth: 2
            }]
        };

        if (this.charts.tierDistribution) this.charts.tierDistribution.destroy();
        this.charts.tierDistribution = new Chart(ctx, {
            type: 'polarArea',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: '#ccc' } }
                },
                scales: {
                    r: {
                        ticks: { color: '#ccc', backdropColor: 'transparent' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    // Cost Breakdown Chart
    renderCostBreakdownChart(facilityStats) {
        const ctx = document.getElementById('costBreakdownChart');
        if (!ctx) return;

        const totalCost = facilityStats.totalCost || {};
        const sortedCosts = Object.entries(totalCost).sort((a, b) => b[1] - a[1]);

        const data = {
            labels: sortedCosts.map(([name]) => name),
            datasets: [{
                label: 'Quantity',
                data: sortedCosts.map(([, value]) => value),
                backgroundColor: 'rgba(255, 193, 7, 0.7)',
                borderColor: 'rgba(255, 193, 7, 1)',
                borderWidth: 2
            }]
        };

        if (this.charts.costBreakdown) this.charts.costBreakdown.destroy();
        this.charts.costBreakdown = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Quantity', color: '#ccc' },
                        ticks: { color: '#ccc' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#ccc', font: { size: 11 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Update cost stats
        const totalItems = Object.values(totalCost).reduce((sum, val) => sum + val, 0);
        const uniqueMaterials = Object.keys(totalCost).length;
        const statsDiv = document.getElementById('costStats');
        if (statsDiv) {
            statsDiv.innerHTML = `
                <div class="stat-row">Total Items: <strong>${totalItems.toLocaleString()}</strong></div>
                <div class="stat-row">Unique Materials: <strong>${uniqueMaterials}</strong></div>
                <div class="stat-row">Most Needed: <strong>${sortedCosts[0]?.[0]}: ${sortedCosts[0]?.[1]}</strong></div>
            `;
        }
    }

    // Render detailed statistics tables
    renderDetailedTables(facilityPlan, facilityStats) {
        return `
            <div class="analytics-table-grid">
                <!-- Resource Production Table -->
                <div class="analytics-table-card">
                    <h4>📊 Resource Production Details</h4>
                    <table class="analytics-table">
                        <thead>
                            <tr>
                                <th>Resource</th>
                                <th>Production</th>
                                <th>Consumption</th>
                                <th>Net</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderResourceTable(facilityStats)}
                        </tbody>
                    </table>
                </div>

                <!-- Building Details Table -->
                <div class="analytics-table-card">
                    <h4>🏗️ Building Details</h4>
                    <table class="analytics-table">
                        <thead>
                            <tr>
                                <th>Building</th>
                                <th>Tier</th>
                                <th>Slots</th>
                                <th>Power</th>
                                <th>Crew</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderBuildingTable(facilityPlan.buildings)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderResourceTable(facilityStats) {
        const production = facilityStats.resourceExtraction || {};
        const consumption = facilityStats.resourceConsumption || {};
        const allResources = new Set([...Object.keys(production), ...Object.keys(consumption)]);

        return Array.from(allResources).sort().map(resource => {
            const prod = production[resource] || 0;
            const cons = consumption[resource] || 0;
            const net = prod - cons;

            return `
                <tr>
                    <td>${resource}</td>
                    <td class="positive">+${prod.toFixed(3)}</td>
                    <td class="negative">-${cons.toFixed(3)}</td>
                    <td class="${net >= 0 ? 'positive' : 'negative'}">${net.toFixed(3)}</td>
                </tr>
            `;
        }).join('');
    }

    renderBuildingTable(buildings) {
        return buildings.map(building => `
            <tr>
                <td>${building.name}</td>
                <td>T${building.tier}</td>
                <td>${building.slots || 0}</td>
                <td class="${building.power > 0 ? 'positive' : building.power < 0 ? 'negative' : ''}">${building.power || 0}W</td>
                <td>${building.neededCrew || 0}/${building.crewSlots || 0}</td>
            </tr>
        `).join('');
    }

    // Helper: Get building type
    getBuildingType(building) {
        if (building.addedTags?.includes('central-hub')) return 'Hub';
        if (building.addedTags?.includes('processing-hub')) return 'Processing';
        if (building.addedTags?.includes('storage-hub')) return 'Storage';
        if (building.resourceExtractionRate) return 'Extraction';
        if (building.power && building.power > 0) return 'Power';
        return 'Other';
    }

    // Destroy all charts (cleanup)
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}
