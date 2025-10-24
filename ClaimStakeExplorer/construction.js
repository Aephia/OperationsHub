// Construction Facility Manager for ClaimStake Explorer
// Complete replication of GaliaViewer/ui.js building functionality (lines 576-1460)

class ConstructionManager {
    constructor() {
        this.currentFacilityPlan = null;
        this.systems = [];
    }

    // Initialize construction tab with planet data
    async initializeWithPlanetData() {
        if (typeof window.planetData !== 'undefined' && window.planetData.mapData) {
            this.systems = window.planetData.mapData;
            console.log('✅ Loaded', this.systems.length, 'systems for construction');
            this.renderPlanetSelector();
        } else {
            console.warn('⚠️ Planet data not available, loading...');
            const script = document.createElement('script');
            script.src = '../Data/planet-data.js';
            script.onload = () => {
                if (window.planetData && window.planetData.mapData) {
                    this.systems = window.planetData.mapData;
                    this.renderPlanetSelector();
                }
            };
            document.head.appendChild(script);
        }
    }

    // Render planet selection interface
    renderPlanetSelector() {
        const container = document.getElementById('constructionContent');
        if (!container) return;

        let html = `
            <div style="background: #2a2a3e; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #4CAF50; margin-bottom: 15px;">🪐 Select Planet for Construction</h3>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #ccc;">System:</label>
                    <select id="systemSelect" onchange="window.constructionManager.onSystemChange()"
                            style="width: 100%; padding: 8px; background: #1a1a2e; color: white; border: 1px solid #444; border-radius: 4px;">
                        <option value="">Select a system...</option>
        `;

        this.systems.forEach((system, index) => {
            if (system.planets && system.planets.length > 0) {
                html += `<option value="${index}">${system.name || system.key} (${system.planets.length} planets)</option>`;
            }
        });

        html += `
                    </select>
                </div>
                <div id="planetSelectContainer" style="display: none; margin-top: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #ccc;">Planet:</label>
                    <select id="planetSelect" onchange="window.constructionManager.onPlanetChange()"
                            style="width: 100%; padding: 8px; background: #1a1a2e; color: white; border: 1px solid #444; border-radius: 4px;">
                        <option value="">Select a planet...</option>
                    </select>
                </div>
            </div>
            <div id="buildingInterface" style="display: none;"></div>
        `;

        container.innerHTML = html;
    }

    // Handle system selection change
    onSystemChange() {
        const systemIndex = document.getElementById('systemSelect').value;
        const planetContainer = document.getElementById('planetSelectContainer');
        const planetSelect = document.getElementById('planetSelect');

        if (!systemIndex) {
            planetContainer.style.display = 'none';
            document.getElementById('buildingInterface').style.display = 'none';
            return;
        }

        const system = this.systems[parseInt(systemIndex)];

        let options = '<option value="">Select a planet...</option>';
        system.planets.forEach((planet, index) => {
            const planetName = planet.name || `Planet ${index + 1}`;
            const planetType = this.getPlanetTypeName(planet.type || 0);
            options += `<option value="${index}">${planetName} - ${planetType}</option>`;
        });

        planetSelect.innerHTML = options;
        planetContainer.style.display = 'block';
        document.getElementById('buildingInterface').style.display = 'none';
    }

    // Handle planet selection change
    onPlanetChange() {
        const systemIndex = document.getElementById('systemSelect').value;
        const planetIndex = document.getElementById('planetSelect').value;
        if (!planetIndex || !systemIndex) return;

        const system = this.systems[parseInt(systemIndex)];
        const planet = system.planets[parseInt(planetIndex)];
        const planetName = planet.name || `Planet ${parseInt(planetIndex) + 1}`;

        this.openBuildingInterface(system, planet, planetName);
    }

    // Open building interface - GaliaViewer: openBuildingInterface()
    openBuildingInterface(system, planet, planetName) {
        this.showBuildingModal(system, planet, planetName);
    }

    // Show building construction modal - EXACT GaliaViewer implementation
    showBuildingModal(system, planet, planetName) {
        const container = document.getElementById('buildingInterface');
        const compatibleBuildings = this.getCompatibleBuildings(planet, system);

        // Store for filtering
        this.currentCompatibleBuildings = compatibleBuildings;
        this.currentSystem = system;
        this.currentPlanet = planet;

        const modalHTML = `
            <div style="background: #1a1a2e; color: white; padding: 20px; border-radius: 10px; border: 2px solid #444;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                    <h2 style="margin: 0; color: #4CAF50;">🏗️ Build Facility - ${planetName}</h2>
                </div>

                <!-- Claim Stake Selection -->
                <div style="margin-bottom: 15px; padding: 10px; background: #2a2a3e; border-radius: 6px;">
                    <div style="margin-bottom: 10px;">
                        <strong>🏗️ Select Your Claim Stake Tier:</strong>
                        <select id="claimStakeTier" onchange="window.constructionManager.updateCompatibleBuildings()"
                                style="margin-left: 10px; padding: 4px 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                            <option value="1">Tier 1 - Basic Stake</option>
                            <option value="2">Tier 2 - Advanced Stake</option>
                            <option value="3">Tier 3 - Professional Stake</option>
                            <option value="4">Tier 4 - Industrial Stake</option>
                            <option value="5">Tier 5 - Mega Stake</option>
                        </select>
                    </div>
                    <div>
                        <strong>Planet Type:</strong> ${planet.type || 'Unknown'} |
                        <strong>Available Resources:</strong> ${planet.resources ? planet.resources.map(r => r.name).join(', ') : 'None'}
                    </div>
                </div>

                <!-- Two-column layout -->
                <div style="display: flex; gap: 20px;">
                    <!-- Left Panel: Building List (30%) -->
                    <div style="flex: 0 0 30%; display: flex; flex-direction: column;">
                        <h3 style="color: #FF9800; margin-bottom: 10px;">Compatible Buildings <span id="buildingCount">(${compatibleBuildings.length})</span></h3>

                        <!-- Search Bar -->
                        <div style="margin-bottom: 15px;">
                            <input
                                type="text"
                                id="buildingSearchInput"
                                placeholder="🔍 Search buildings..."
                                style="width: 100%; padding: 10px 15px; background: #2a2a3e; border: 2px solid #444; border-radius: 6px; color: #fff; font-size: 14px; transition: border-color 0.3s;"
                                oninput="window.constructionManager.filterBuildings(this.value)"
                                onfocus="this.style.borderColor='#4CAF50'"
                                onblur="this.style.borderColor='#444'"
                            />
                        </div>

                        <div id="buildingsList" style="display: flex; flex-direction: column; gap: 10px; max-height: 800px; overflow-y: auto; padding-right: 10px;">
                            ${this.renderBuildingOptions(compatibleBuildings, system, planet)}
                        </div>
                    </div>

                    <!-- Right Panel: Facility Plan Summary (70%) -->
                    <div style="flex: 0 0 70%; display: flex; flex-direction: column;">
                        <div id="facilityPlan" style="padding: 15px; background: #2a2a3e; border-radius: 6px; max-height: 800px; overflow-y: auto;">
                            <h3 style="color: #2196F3; margin-bottom: 10px;">🏭 Facility Plan Summary</h3>
                            <div id="selectedBuildings">
                                <div style="text-align: center; padding: 60px 20px; color: #666;">
                                    <div style="font-size: 48px; margin-bottom: 15px;">👈</div>
                                    <div style="font-size: 16px;">Select buildings to start planning</div>
                                </div>
                            </div>
                            <div id="facilityPlanActions" style="margin-top: 15px; text-align: center; display: none;">
                                <button onclick="window.constructionManager.clearFacilityPlan()"
                                        style="background: #ff4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                                    Clear Plan
                                </button>
                                <button onclick="window.constructionManager.exportFacilityDiagram()"
                                        style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                                    📊 Export Diagram
                                </button>
                                <button onclick="window.constructionManager.constructFacility()"
                                        style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                                    🚀 Construct Facility
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = modalHTML;
        container.style.display = 'block';

        // Initialize facility plan storage - EXACT GaliaViewer structure
        this.currentFacilityPlan = {
            system: system,
            planet: planet,
            planetName: planetName,
            buildings: [],
            claimStakeTier: 1,
            availableSlots: this.getClaimStakeSlots(1),
            totalPowerOutput: 0
        };

        // Auto-add buildings that come with the stake for this planet type and tier
        this.autoAddStakeBuildings(planet, 1);
        this.updateFacilityPlanDisplay();
    }

    // Auto-add buildings that come with the claim stake
    autoAddStakeBuildings(planet, claimStakeTier) {
        if (!window.rawBuildingData || !window.rawBuildingData.buildings) return;

        const buildings = window.rawBuildingData.buildings;
        const planetType = planet.type;

        // Find buildings that come with stake and are compatible with this planet/tier
        const stakeBuildings = buildings.filter(building => {
            if (!building.comesWithStake) return false;
            if (building.tier !== claimStakeTier) return false;

            // Only include standard stake buildings, not cultivation stake buildings
            const requiredTags = building.requiredTags || [];
            if (requiredTags.includes('cultivation-stake-only')) return false;

            // Check planet type compatibility
            return ConstructionUtils.checkPlanetTypeCompatibility(planetType, requiredTags);
        });

        // Add these buildings to the facility plan
        stakeBuildings.forEach(building => {
            // Don't add duplicates
            if (!this.currentFacilityPlan.buildings.find(b => b.id === building.id)) {
                this.currentFacilityPlan.buildings.push(building);
            }
        });
    }

    // Get buildings compatible with the planet type - Uses shared utility
    getCompatibleBuildings(planet, system, claimStakeTier = 1) {
        return ConstructionUtils.getCompatibleBuildings(planet, system, claimStakeTier);
    }

    // Update compatible buildings when claim stake tier changes - EXACT GaliaViewer
    updateCompatibleBuildings() {
        if (!this.currentFacilityPlan) return;

        const claimStakeTier = parseInt(document.getElementById('claimStakeTier').value) || 1;
        this.currentFacilityPlan.claimStakeTier = claimStakeTier;
        this.currentFacilityPlan.availableSlots = this.getClaimStakeSlots(claimStakeTier);

        // Remove manually added buildings but keep track of them
        const manuallyAddedBuildings = this.currentFacilityPlan.buildings.filter(b => !b.comesWithStake);

        // Reset buildings and re-add stake buildings for new tier
        this.currentFacilityPlan.buildings = [];
        this.autoAddStakeBuildings(this.currentFacilityPlan.planet, claimStakeTier);

        // Re-add manually added buildings that are still compatible
        manuallyAddedBuildings.forEach(building => {
            if (building.minimumTier <= claimStakeTier) {
                this.currentFacilityPlan.buildings.push(building);
            }
        });

        const compatibleBuildings = this.getCompatibleBuildings(
            this.currentFacilityPlan.planet,
            this.currentFacilityPlan.system,
            claimStakeTier
        );

        // Update buildings list
        const buildingsList = document.getElementById('buildingsList');
        const buildingCount = document.getElementById('buildingCount');

        if (buildingsList && buildingCount) {
            buildingsList.innerHTML = this.renderBuildingOptions(
                compatibleBuildings,
                this.currentFacilityPlan.system,
                this.currentFacilityPlan.planet
            );
            buildingCount.textContent = `(${compatibleBuildings.length})`;
        }

        // Update stored buildings for search
        this.currentCompatibleBuildings = compatibleBuildings;

        // Update display and re-validate
        this.updateFacilityPlanDisplay();
        this.validateFacilityPlan();
    }

    // Filter buildings based on search input
    filterBuildings(searchTerm) {
        if (!this.currentCompatibleBuildings) return;

        const searchLower = searchTerm.toLowerCase().trim();

        // If search is empty, show all buildings
        if (!searchLower) {
            this.displayFilteredBuildings(this.currentCompatibleBuildings);
            return;
        }

        // Filter buildings by name, tier, or type
        const filtered = this.currentCompatibleBuildings.filter(building => {
            const nameMatch = building.name.toLowerCase().includes(searchLower);
            const tierMatch = building.tier && building.tier.toString().includes(searchLower);
            const typeMatch = this.getBuildingType(building).toLowerCase().includes(searchLower);
            const descMatch = building.description && building.description.toLowerCase().includes(searchLower);

            return nameMatch || tierMatch || typeMatch || descMatch;
        });

        this.displayFilteredBuildings(filtered);
    }

    // Display filtered buildings
    displayFilteredBuildings(buildings) {
        const buildingsList = document.getElementById('buildingsList');
        const buildingCount = document.getElementById('buildingCount');

        if (buildingsList) {
            if (buildings.length === 0) {
                buildingsList.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <h4 style="color: #FF9800; margin-bottom: 10px;">🔍 No buildings match your search</h4>
                        <p>Try different keywords or clear the search</p>
                    </div>
                `;
            } else {
                buildingsList.innerHTML = this.renderBuildingOptions(
                    buildings,
                    this.currentSystem,
                    this.currentPlanet
                );
            }
        }

        if (buildingCount) {
            buildingCount.textContent = `(${buildings.length}${buildings.length !== this.currentCompatibleBuildings.length ? ' / ' + this.currentCompatibleBuildings.length : ''})`;
        }
    }

    // Helper: Get building type for search
    getBuildingType(building) {
        if (building.addedTags?.includes('central-hub')) return 'Hub';
        if (building.addedTags?.includes('processing-hub')) return 'Processing';
        if (building.addedTags?.includes('storage-hub')) return 'Storage';
        if (building.addedTags?.includes('extraction-hub')) return 'Extraction';
        if (building.addedTags?.includes('farm-hub')) return 'Farm';
        if (building.resourceExtractionRate) return 'Extractor';
        if (building.power && building.power > 0) return 'Power';
        return 'Other';
    }

    // Get available slots for claim stake tier - Uses shared utility
    getClaimStakeSlots(tier) {
        return ConstructionUtils.getClaimStakeSlots(tier);
    }

    // Get base power output for claim stake tier - Uses shared utility
    getClaimStakePower(tier) {
        return ConstructionUtils.getClaimStakePower(tier);
    }

    // Validate facility plan for power and slot requirements - EXACT GaliaViewer
    validateFacilityPlan() {
        if (!this.currentFacilityPlan) return { valid: true };

        const buildings = this.currentFacilityPlan.buildings;
        const claimStakeTier = this.currentFacilityPlan.claimStakeTier;

        // Calculate total slots used
        const totalSlotsUsed = buildings.reduce((sum, building) => sum + (building.slots || 0), 0);
        const availableSlots = this.getClaimStakeSlots(claimStakeTier);

        // Calculate power consumption and generation
        const basePower = this.getClaimStakePower(claimStakeTier);
        const buildingPowerOutput = buildings.reduce((sum, building) => sum + (building.power || 0), 0);
        const totalPowerOutput = basePower + buildingPowerOutput;

        // Find buildings that have power consumption (negative power)
        const powerConsumption = buildings.reduce((sum, building) => {
            if (building.resourceRate) {
                Object.values(building.resourceRate).forEach(rate => {
                    if (rate < 0) sum += Math.abs(rate) * 10; // Convert to power units
                });
            }
            return sum;
        }, 0);

        const validation = {
            valid: totalSlotsUsed <= availableSlots && totalPowerOutput >= powerConsumption,
            slotsUsed: totalSlotsUsed,
            availableSlots: availableSlots,
            slotsExceeded: totalSlotsUsed > availableSlots,
            powerOutput: totalPowerOutput,
            powerConsumption: powerConsumption,
            powerInsufficient: totalPowerOutput < powerConsumption,
            basePower: basePower,
            buildingPower: buildingPowerOutput
        };

        this.currentFacilityPlan.validation = validation;
        return validation;
    }

    // Check if planet type is compatible with building requirements - Uses shared utility
    checkPlanetTypeCompatibility(planetTypeNum, requiredTags) {
        return ConstructionUtils.checkPlanetTypeCompatibility(planetTypeNum, requiredTags);
    }

    // Generate detailed explanation when no buildings match - EXACT GaliaViewer
    generateDetailedNoMatchesMessage(planet, system) {
        if (typeof window.rawBuildingData === 'undefined') {
            return '<div style="grid-column: 1 / -1; text-align: center; color: #666;">Building data not available.</div>';
        }

        const buildings = window.rawBuildingData.buildings || [];
        const planetTypeNum = planet.type;
        const claimStakeTier = this.currentFacilityPlan ? this.currentFacilityPlan.claimStakeTier : 1;

        // Get planet type name using shared utility
        const planetTypeName = getPlanetTypeName(planetTypeNum);

        // Analyze why buildings don't match
        let planetTypeIncompatible = 0;
        let tierIncompatible = 0;
        let bothIncompatible = 0;

        buildings.forEach(building => {
            const requiredTags = building.requiredTags || [];
            const planetTypeCompatible = this.checkPlanetTypeCompatibility(planetTypeNum, requiredTags);
            const tierCompatible = building.minimumTier <= claimStakeTier;

            if (!planetTypeCompatible && !tierCompatible) {
                bothIncompatible++;
            } else if (!planetTypeCompatible) {
                planetTypeIncompatible++;
            } else if (!tierCompatible) {
                tierIncompatible++;
            }
        });

        let explanation = `
            <div style="grid-column: 1 / -1; text-align: center; color: #666; padding: 20px; background: #2a2a2a; border-radius: 6px; border: 1px solid #444;">
                <h4 style="color: #FF9800; margin-bottom: 15px;">❌ No Compatible Buildings Found</h4>

                <div style="text-align: left; max-width: 500px; margin: 0 auto;">
                    <p style="margin-bottom: 10px;"><strong>Planet:</strong> ${planet.name} (${planetTypeName})</p>
                    <p style="margin-bottom: 15px;"><strong>Current Claim Stake:</strong> Tier ${claimStakeTier}</p>

                    <div style="margin-bottom: 10px;"><strong>Analysis of ${buildings.length} available buildings:</strong></div>
        `;

        if (planetTypeIncompatible > 0) {
            explanation += `<div style="margin-left: 10px; color: #f44336;">• ${planetTypeIncompatible} building(s) incompatible with ${planetTypeName} planets</div>`;
        }

        if (tierIncompatible > 0) {
            explanation += `<div style="margin-left: 10px; color: #ff9800;">• ${tierIncompatible} building(s) require higher than Tier ${claimStakeTier} claim stake</div>`;
        }

        if (bothIncompatible > 0) {
            explanation += `<div style="margin-left: 10px; color: #9e9e9e;">• ${bothIncompatible} building(s) incompatible with both planet type and claim stake tier</div>`;
        }

        explanation += `
                    <div style="margin-top: 15px; padding: 10px; background: #1a1a1a; border-radius: 4px; border-left: 3px solid #4CAF50;">
                        <strong>💡 Suggestions:</strong>
                        <div style="margin-top: 5px;">
                            ${tierIncompatible > 0 ? `• Upgrade your claim stake to access ${tierIncompatible} more building(s)` : ''}
                            ${planetTypeIncompatible > 0 ? `• Try building on a different planet type` : ''}
                            ${tierIncompatible === 0 && planetTypeIncompatible === 0 ? '• Check if building data is loaded properly' : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        return explanation;
    }

    // Render building options - EXACT GaliaViewer
    renderBuildingOptions(buildings, system, planet) {
        if (buildings.length === 0) {
            return this.generateDetailedNoMatchesMessage(planet, system);
        }

        return buildings.map(building => {
            const constructionCost = building.constructionCost || {};
            const costEntries = Object.entries(constructionCost);

            return `
                <div style="background: #333; padding: 15px; border-radius: 6px; border: 1px solid #555;">
                    <h4 style="margin: 0 0 8px 0; color: #4CAF50;">${building.name}</h4>
                    <div style="font-size: 11px; color: #ccc; margin-bottom: 8px;">Tier ${building.tier} • ${building.constructionTime || 0} minutes</div>
                    <div style="font-size: 11px; margin-bottom: 10px;">${building.description || 'No description'}</div>

                    ${costEntries.length > 0 ? `
                        <div style="margin-bottom: 10px;">
                            <div style="font-size: 11px; color: #aaa; margin-bottom: 4px;">Construction Cost:</div>
                            ${costEntries.map(([resource, amount]) =>
                                `<div style="font-size: 10px;">• ${resource}: ${amount}</div>`
                            ).join('')}
                        </div>
                    ` : ''}

                    <div style="display: flex; gap: 5px; margin-top: 10px;">
                        <button onclick="window.constructionManager.addBuildingToPlan('${building.id}')"
                                style="background: #2196F3; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; flex: 1;">
                            ➕ Add to Plan
                        </button>
                        <button onclick="window.constructionManager.openRecipeExplorer('${building.name}', ${building.tier})"
                                style="background: #9C27B0; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; flex: 0 0 auto;">
                            🧪 Recipe
                        </button>
                        <button onclick="window.constructionManager.showBuildingDetails('${building.id}')"
                                style="background: #FF9800; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; flex: 0 0 auto;">
                            📋 Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Add building to facility plan - EXACT GaliaViewer with validation
    addBuildingToPlan(buildingId) {
        if (!this.currentFacilityPlan) return;

        const building = window.rawBuildingData.buildings.find(b => b.id === buildingId);
        if (!building) return;

        // Check if building is compatible with current claim stake tier
        if (building.minimumTier > this.currentFacilityPlan.claimStakeTier) {
            alert(`❌ This building requires a Tier ${building.minimumTier} claim stake. You currently have Tier ${this.currentFacilityPlan.claimStakeTier}.`);
            return;
        }

        // Temporarily add building to check validation
        this.currentFacilityPlan.buildings.push(building);
        const validation = this.validateFacilityPlan();

        if (!validation.valid) {
            // Remove the building if validation fails
            this.currentFacilityPlan.buildings.pop();

            let errorMessage = '❌ Cannot add building:\n\n';
            if (validation.slotsExceeded) {
                errorMessage += `• Exceeds available slots: ${validation.slotsUsed}/${validation.availableSlots}\n`;
            }
            if (validation.powerInsufficient) {
                errorMessage += `• Insufficient power: ${validation.powerOutput} available, ${validation.powerConsumption} required\n`;
            }
            errorMessage += '\nPlease upgrade your claim stake tier or remove other buildings first.';

            alert(errorMessage);
            return;
        }

        // Building successfully added
        this.updateFacilityPlanDisplay();
    }

    // Update facility plan display - Enhanced with Analytics Dashboard
    updateFacilityPlanDisplay() {
        const facilityPlan = document.getElementById('facilityPlan');
        const selectedBuildings = document.getElementById('selectedBuildings');
        const facilityPlanActions = document.getElementById('facilityPlanActions');

        if (!facilityPlan || !selectedBuildings || !this.currentFacilityPlan) return;

        if (this.currentFacilityPlan.buildings.length === 0) {
            // Show placeholder message
            selectedBuildings.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #666;">
                    <div style="font-size: 48px; margin-bottom: 15px;">👈</div>
                    <div style="font-size: 16px;">Select buildings to start planning</div>
                </div>
            `;
            if (facilityPlanActions) facilityPlanActions.style.display = 'none';
            // Destroy analytics if it exists
            if (this.facilityAnalytics) {
                this.facilityAnalytics.destroy();
                this.facilityAnalytics = null;
            }
            return;
        }

        // Show action buttons when buildings are added
        if (facilityPlanActions) facilityPlanActions.style.display = 'block';

        const facilityStats = this.calculateFacilityStats();
        const validation = this.validateFacilityPlan();
        const totalTime = this.currentFacilityPlan.buildings.reduce((sum, b) => sum + (b.constructionTime || 0), 0);

        // Validation status display
        let validationDisplay = '';
        if (!validation.valid) {
            validationDisplay = `
                <div style="background: #ff4444; padding: 8px; border-radius: 4px; margin-bottom: 10px; font-size: 12px;">
                    ⚠️ <strong>Validation Issues:</strong><br>
                    ${validation.slotsExceeded ? `• Slots exceeded: ${validation.slotsUsed}/${validation.availableSlots}<br>` : ''}
                    ${validation.powerInsufficient ? `• Power insufficient: ${validation.powerOutput}/${validation.powerConsumption}<br>` : ''}
                </div>
            `;
        } else {
            validationDisplay = `
                <div style="background: #4CAF50; padding: 8px; border-radius: 4px; margin-bottom: 10px; font-size: 12px;">
                    ✅ <strong>Facility plan is valid!</strong>
                </div>
            `;
        }

        selectedBuildings.innerHTML = `
            ${validationDisplay}
            <div style="margin-bottom: 15px;">
                <strong>Buildings Selected: ${this.currentFacilityPlan.buildings.length}</strong><br>
                <strong>Total Construction Time: ${totalTime} minutes</strong><br>
                <strong>Claim Stake: Tier ${this.currentFacilityPlan.claimStakeTier}</strong><br>
                <strong>Slots Used: ${validation.slotsUsed}/${validation.availableSlots}</strong>
                ${validation.slotsExceeded ? ' <span style="color: #ff4444;">⚠️</span>' : ' <span style="color: #4CAF50;">✓</span>'}<br>
                <strong>Power: ${validation.powerOutput} output, ${validation.powerConsumption} consumption</strong>
                ${validation.powerInsufficient ? ' <span style="color: #ff4444;">⚠️</span>' : ' <span style="color: #4CAF50;">✓</span>'}
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px; margin-bottom: 15px;">
                ${this.currentFacilityPlan.buildings.map((building, index) => `
                    <div style="background: #444; padding: 10px; border-radius: 4px; font-size: 11px; position: relative; ${building.comesWithStake ? 'border: 2px solid #FF9800;' : ''}">
                        ${!building.comesWithStake ? `
                        <button onclick="window.constructionManager.removeBuildingFromPlan(${index})"
                                style="background: #f44; color: white; border: none; padding: 2px 6px; border-radius: 2px; cursor: pointer; font-size: 10px; position: absolute; top: 5px; right: 5px;">
                            ✕
                        </button>
                        ` : ''}
                        <div style="margin-right: 25px;">
                            <strong style="color: #4CAF50;">${building.name}</strong><br>
                            <div style="color: #ccc; margin: 4px 0;">Tier ${building.tier} • ${building.constructionTime || 0} min</div>
                            <div style="display: flex; gap: 10px; margin-top: 6px;">
                                <span>👥 ${building.neededCrew || 0}/${building.crewSlots || 0}</span>
                                <span>⚡ ${building.power || 0}</span>
                                <span>📦 ${(building.storage || 0).toLocaleString()}</span>
                            </div>
                            ${building.comesWithStake ? '<div style="color: #FF9800; font-size: 10px; margin-top: 4px;">📍 Included with Stake (Cannot Remove)</div>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px;">
                <!-- Recipe Ingredients Cost -->
                ${Object.keys(facilityStats.totalRecipeCost).length > 0 ? `
                <div style="background: #2a2a3e; padding: 10px; border-radius: 4px;">
                    <strong>🧪 Recipe Ingredients:</strong><br>
                    ${Object.entries(facilityStats.totalRecipeCost).map(([resource, amount]) =>
                        `<div style="font-size: 11px;">• ${resource}: ${amount}</div>`
                    ).join('')}
                </div>
                ` : ''}

                <!-- Crew & Operations -->
                <div style="background: #2a2a3e; padding: 10px; border-radius: 4px;">
                    <strong>👥 Crew & Operations:</strong><br>
                    <div style="font-size: 11px;">• Total Crew Slots: ${facilityStats.totalCrewSlots}</div>
                    <div style="font-size: 11px;">• Crew Required: ${facilityStats.totalNeededCrew}</div>
                    <div style="font-size: 11px;">• Power Output: <span style="color: ${facilityStats.totalPower < 0 ? '#f44336' : 'inherit'}">${facilityStats.totalPower}</span></div>
                    <div style="font-size: 11px;">• Storage Capacity: ${facilityStats.totalStorage.toLocaleString()}</div>
                </div>

                <!-- Facility Features -->
                <div style="background: #2a2a3e; padding: 10px; border-radius: 4px;">
                    <strong>🏗️ Facility Features:</strong><br>
                    <div style="font-size: 11px;">• Building Slots: ${facilityStats.totalSlots}</div>
                    <div style="font-size: 11px;">• Comes with Stake: ${facilityStats.comesWithStake ? 'Yes' : 'No'}</div>
                    <div style="font-size: 11px;">• Removable Buildings: ${facilityStats.removableBuildings}</div>
                    ${facilityStats.enabledFeatures.length > 0 ? `<div style="font-size: 11px;">• Enables: ${facilityStats.enabledFeatures.slice(0, 3).join(', ')}${facilityStats.enabledFeatures.length > 3 ? '...' : ''}</div>` : ''}
                </div>

                <!-- Resource Production -->
                ${Object.keys(facilityStats.resourceExtraction).length > 0 || Object.keys(facilityStats.resourceConsumption).length > 0 ? `
                <div style="background: #2a2a3e; padding: 10px; border-radius: 4px;">
                    <strong>🔄 Resource Production:</strong><br>
                    ${Object.entries(facilityStats.resourceExtraction).map(([resource, rate]) =>
                        `<div style="font-size: 11px; color: #4CAF50;">• ${resource}: +${rate.toFixed(3)}/hour</div>`
                    ).join('')}
                    ${Object.entries(facilityStats.resourceConsumption).map(([resource, rate]) =>
                        `<div style="font-size: 11px; color: #f44336;">• ${resource}: -${rate.toFixed(3)}/hour</div>`
                    ).join('')}
                </div>
                ` : ''}
            </div>
        `;

        // Create analytics dashboard container (innerHTML above destroyed any previous one)
        const analyticsContainer = document.createElement('div');
        analyticsContainer.id = 'facilityAnalyticsDashboard';
        selectedBuildings.appendChild(analyticsContainer);

        // Render analytics dashboard if FacilityAnalytics is available
        if (typeof FacilityAnalytics !== 'undefined') {
            try {
                // Destroy old analytics instance if it exists
                if (this.facilityAnalytics) {
                    this.facilityAnalytics.destroy();
                }
                // Create new instance and render
                this.facilityAnalytics = new FacilityAnalytics('facilityAnalyticsDashboard');
                this.facilityAnalytics.renderFacilityAnalytics(this.currentFacilityPlan, facilityStats, validation);
                console.log('✅ Analytics dashboard rendered');
            } catch (error) {
                console.error('❌ Error rendering analytics:', error);
            }
        } else {
            console.warn('⚠️ FacilityAnalytics class not available');
        }
    }

    // Calculate comprehensive facility statistics - EXACT GaliaViewer
    calculateFacilityStats() {
        if (!this.currentFacilityPlan) return {};

        const buildings = this.currentFacilityPlan.buildings;
        const stats = {
            totalCost: {},
            totalRecipeCost: {},
            totalCrewSlots: 0,
            totalNeededCrew: 0,
            totalPower: 0,
            totalStorage: 0,
            totalSlots: 0,
            comesWithStake: false,
            removableBuildings: 0,
            enabledFeatures: [],
            resourceExtraction: {},
            resourceConsumption: {}
        };

        // Calculate totals from all buildings
        buildings.forEach(building => {
            // Resource costs
            const cost = building.constructionCost || {};
            Object.entries(cost).forEach(([resource, amount]) => {
                stats.totalCost[resource] = (stats.totalCost[resource] || 0) + amount;
            });

            // Recipe costs - look up recipe ingredients by matching pattern
            if (typeof window.rawRecipeData !== 'undefined' && window.rawRecipeData.recipes) {
                const buildingPattern = building.name.toLowerCase().replace(/\s+/g, '-');
                const recipe = window.rawRecipeData.recipes.find(r =>
                    r.outputId.includes(buildingPattern) && r.outputTier === building.tier
                );
                if (recipe && recipe.ingredients) {
                    recipe.ingredients.forEach(ingredient => {
                        stats.totalRecipeCost[ingredient.name] = (stats.totalRecipeCost[ingredient.name] || 0) + ingredient.quantity;
                    });
                }
            }

            // Crew and operations
            stats.totalCrewSlots += building.crewSlots || 0;
            // Crew required is the max of neededCrew and crewSlots for each building
            const crewRequired = Math.max(building.neededCrew || 0, building.crewSlots || 0);
            stats.totalNeededCrew += crewRequired;
            stats.totalPower += building.power || 0;
            stats.totalStorage += building.storage || 0;
            stats.totalSlots += building.slots || 0;

            // Special properties
            if (building.comesWithStake) {
                stats.comesWithStake = true;
            }
            if (!building.cannotRemove) {
                stats.removableBuildings++;
            }

            // Resource extraction rates
            if (building.resourceExtractionRate) {
                Object.entries(building.resourceExtractionRate).forEach(([resource, rate]) => {
                    stats.resourceExtraction[resource] = (stats.resourceExtraction[resource] || 0) + rate;
                });
            }

            // Resource consumption rates (negative rates)
            if (building.resourceRate) {
                Object.entries(building.resourceRate).forEach(([resource, rate]) => {
                    if (rate < 0) {
                        stats.resourceConsumption[resource] = (stats.resourceConsumption[resource] || 0) + Math.abs(rate);
                    } else {
                        stats.resourceExtraction[resource] = (stats.resourceExtraction[resource] || 0) + rate;
                    }
                });
            }

            // Enabled features (from addedTags)
            if (building.addedTags) {
                building.addedTags.forEach(tag => {
                    if (tag.startsWith('enables-') && !stats.enabledFeatures.includes(tag)) {
                        // Convert enables-processing-hub to "Processing Hub"
                        const featureName = tag.replace('enables-', '').replace(/-/g, ' ')
                            .replace(/\b\w/g, l => l.toUpperCase());
                        stats.enabledFeatures.push(featureName);
                    }
                });
            }
        });

        return stats;
    }

    // Remove building from plan - EXACT GaliaViewer
    removeBuildingFromPlan(index) {
        if (!this.currentFacilityPlan || index < 0 || index >= this.currentFacilityPlan.buildings.length) return;

        const building = this.currentFacilityPlan.buildings[index];

        // Prevent removal of buildings that come with the stake
        if (building.comesWithStake) {
            alert('❌ Cannot remove this building - it is included with your claim stake and cannot be removed.');
            return;
        }

        this.currentFacilityPlan.buildings.splice(index, 1);
        this.updateFacilityPlanDisplay();
    }

    // Clear facility plan - EXACT GaliaViewer
    clearFacilityPlan() {
        if (!this.currentFacilityPlan) return;

        // Only remove manually added buildings, keep the ones that come with stake
        this.currentFacilityPlan.buildings = this.currentFacilityPlan.buildings.filter(b => b.comesWithStake);
        this.updateFacilityPlanDisplay();
    }

    // Construct facility (simulation) - EXACT GaliaViewer
    constructFacility() {
        if (!this.currentFacilityPlan || this.currentFacilityPlan.buildings.length === 0) {
            alert('No buildings selected for construction!');
            return;
        }

        // Validate facility plan before construction
        const validation = this.validateFacilityPlan();
        if (!validation.valid) {
            let errorMessage = '❌ Cannot construct facility due to validation errors:\n\n';
            if (validation.slotsExceeded) {
                errorMessage += `• Slots exceeded: ${validation.slotsUsed}/${validation.availableSlots}\n`;
            }
            if (validation.powerInsufficient) {
                errorMessage += `• Insufficient power: ${validation.powerOutput} available, ${validation.powerConsumption} required\n`;
            }
            errorMessage += '\nPlease fix these issues before constructing the facility.';
            alert(errorMessage);
            return;
        }

        const facilityStats = this.calculateFacilityStats();
        const totalTime = this.currentFacilityPlan.buildings.reduce((sum, b) => sum + (b.constructionTime || 0), 0);
        const buildingNames = this.currentFacilityPlan.buildings.map(b => b.name);

        // Enhanced confirmation message with comprehensive stats
        let confirmMessage = `🏗️ Construct facility on ${this.currentFacilityPlan.planetName}?\n\n`;
        confirmMessage += `📋 Buildings (${this.currentFacilityPlan.buildings.length}): ${buildingNames.join(', ')}\n\n`;
        confirmMessage += `⏱️ Total Construction Time: ${totalTime} minutes\n`;
        confirmMessage += `👥 Crew: ${facilityStats.totalNeededCrew}/${facilityStats.totalCrewSlots} required/available\n`;
        confirmMessage += `⚡ Power Output: ${facilityStats.totalPower}${facilityStats.totalPower < 0 ? ' ⚠️ NEGATIVE!' : ''}\n`;
        confirmMessage += `📦 Storage: ${facilityStats.totalStorage.toLocaleString()}\n\n`;

        const costEntries = Object.entries(facilityStats.totalCost);
        if (costEntries.length > 0) {
            confirmMessage += `💰 Resources Needed:\n${costEntries.map(([r, a]) => `  • ${r}: ${a}`).join('\n')}\n\n`;
        }

        if (Object.keys(facilityStats.resourceExtraction).length > 0) {
            confirmMessage += `📈 Resource Production:\n${Object.entries(facilityStats.resourceExtraction).map(([r, rate]) =>
                `  • ${r}: +${rate.toFixed(3)}/hour`).join('\n')}\n\n`;
        }

        confirmMessage += `⚠️ This is a simulation - no actual resources will be consumed.`;

        if (confirm(confirmMessage)) {
            let successMessage = `🎉 Facility construction started!\n\n`;
            successMessage += `Buildings are now being constructed on ${this.currentFacilityPlan.planetName}.\n`;
            successMessage += `Estimated completion: ${totalTime} minutes\n`;
            successMessage += `Crew required: ${facilityStats.totalNeededCrew} personnel\n`;
            successMessage += `Power generation: ${facilityStats.totalPower} units${facilityStats.totalPower < 0 ? ' (⚠️ Negative Power!)' : ''}`;

            alert(successMessage);

            // Log construction for reference
            console.log('Facility Construction Started:', {
                planet: this.currentFacilityPlan.planetName,
                system: this.currentFacilityPlan.system.name,
                buildings: this.currentFacilityPlan.buildings,
                facilityStats: facilityStats,
                totalTime: totalTime
            });
        }
    }

    // Show detailed building information in a modal - EXACT GaliaViewer
    showBuildingDetails(buildingId) {
        const building = window.rawBuildingData.buildings.find(b => b.id === buildingId);
        if (!building) {
            console.error('Building not found:', buildingId);
            return;
        }

        // Remove existing detail modal if any
        const existingModal = document.getElementById('buildingDetailModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Construction cost details
        const constructionCostHTML = building.constructionCost ? `
            <div class="details-section" style="margin-bottom: 20px;">
                <h3 style="color: #FF9800; border-bottom: 1px solid #444; padding-bottom: 5px;">Construction Cost</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 10px;">
                    ${Object.entries(building.constructionCost).map(([material, amount]) => `
                        <div style="background: #2a2a3e; padding: 8px; border-radius: 4px;">
                            <span style="font-weight: bold;">${material}</span>
                            <span style="float: right; color: #4CAF50;">${amount}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        // Resource extraction details
        const extractionHTML = building.resourceExtractionRate ? `
            <div class="details-section" style="margin-bottom: 20px;">
                <h3 style="color: #4CAF50; border-bottom: 1px solid #444; padding-bottom: 5px;">Resource Extraction Rate</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 10px;">
                    ${Object.entries(building.resourceExtractionRate).map(([resource, rate]) => `
                        <div style="background: #2a2a3e; padding: 8px; border-radius: 4px;">
                            <span style="font-weight: bold;">${resource}</span>
                            <span style="float: right; color: #4CAF50;">+${rate}/hour</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        // Resource consumption details
        const consumptionHTML = building.resourceRate ? `
            <div class="details-section" style="margin-bottom: 20px;">
                <h3 style="color: #f44336; border-bottom: 1px solid #444; padding-bottom: 5px;">Resource Consumption</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 10px;">
                    ${Object.entries(building.resourceRate).map(([resource, rate]) => `
                        <div style="background: #2a2a3e; padding: 8px; border-radius: 4px;">
                            <span style="font-weight: bold;">${resource}</span>
                            <span style="float: right; color: ${rate < 0 ? '#f44336' : '#4CAF50'};">${rate}/hour</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        // Build enabled features list
        const enabledFeatures = building.addedTags ? building.addedTags.filter(tag => tag.startsWith('enables-')).map(tag =>
            tag.replace('enables-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        ) : [];

        const modalHTML = `
            <div id="buildingDetailModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background: #1a1a2e; color: white; padding: 20px; border-radius: 10px; max-width: 90%; max-height: 90%; overflow-y: auto; min-width: 600px; border: 2px solid #444;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                        <h2 style="margin: 0; color: #4CAF50;">${building.name}</h2>
                        <button onclick="document.getElementById('buildingDetailModal').remove()"
                                style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                            ✕ Close
                        </button>
                    </div>

                    <div class="building-overview" style="margin-bottom: 20px;">
                        <p style="color: #ccc; font-style: italic; margin-bottom: 15px;">${building.description || 'No description available'}</p>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
                            <div style="background: #2a2a3e; padding: 10px; border-radius: 6px; text-align: center;">
                                <div style="font-size: 12px; color: #aaa;">Tier</div>
                                <div style="font-size: 18px; font-weight: bold; color: #4CAF50;">${building.tier || 'Unknown'}</div>
                            </div>
                            <div style="background: #2a2a3e; padding: 10px; border-radius: 6px; text-align: center;">
                                <div style="font-size: 12px; color: #aaa;">Min Tier</div>
                                <div style="font-size: 18px; font-weight: bold; color: #FF9800;">${building.minimumTier || 'N/A'}</div>
                            </div>
                            <div style="background: #2a2a3e; padding: 10px; border-radius: 6px; text-align: center;">
                                <div style="font-size: 12px; color: #aaa;">Power</div>
                                <div style="font-size: 18px; font-weight: bold; color: #2196F3;">${building.power || 0}W</div>
                            </div>
                            <div style="background: #2a2a3e; padding: 10px; border-radius: 6px; text-align: center;">
                                <div style="font-size: 12px; color: #aaa;">Slots</div>
                                <div style="font-size: 18px; font-weight: bold; color: #9C27B0;">${building.slots || 0}</div>
                            </div>
                            <div style="background: #2a2a3e; padding: 10px; border-radius: 6px; text-align: center;">
                                <div style="font-size: 12px; color: #aaa;">Storage</div>
                                <div style="font-size: 18px; font-weight: bold; color: #607D8B;">${(building.storage || 0).toLocaleString()}</div>
                            </div>
                            <div style="background: #2a2a3e; padding: 10px; border-radius: 6px; text-align: center;">
                                <div style="font-size: 12px; color: #aaa;">Build Time</div>
                                <div style="font-size: 18px; font-weight: bold; color: #FF5722;">${building.constructionTime || 0}min</div>
                            </div>
                            <div style="background: #2a2a3e; padding: 10px; border-radius: 6px; text-align: center;">
                                <div style="font-size: 12px; color: #aaa;">Crew Slots</div>
                                <div style="font-size: 18px; font-weight: bold; color: #795548;">${building.crewSlots || 0}</div>
                            </div>
                            <div style="background: #2a2a3e; padding: 10px; border-radius: 6px; text-align: center;">
                                <div style="font-size: 12px; color: #aaa;">Crew Needed</div>
                                <div style="font-size: 18px; font-weight: bold; color: #E91E63;">${building.neededCrew || 0}</div>
                            </div>
                        </div>
                    </div>

                    ${constructionCostHTML}
                    ${extractionHTML}
                    ${consumptionHTML}

                    <div class="details-section" style="margin-bottom: 20px;">
                        <h3 style="color: #9C27B0; border-bottom: 1px solid #444; padding-bottom: 5px;">Properties</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
                            ${building.comesWithStake ? '<span style="background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">Comes with Stake</span>' : ''}
                            ${building.cannotRemove ? '<span style="background: #f44336; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">Cannot Remove</span>' : ''}
                            ${Object.keys(building.resourceExtractionRate || {}).length > 0 ? '<span style="background: #FF9800; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">Has Resource Extraction</span>' : ''}
                            ${enabledFeatures.length > 0 ? enabledFeatures.map(f => `<span style="background: #2196F3; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">Enables: ${f}</span>`).join('') : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Get planet type name - uses shared utility
    getPlanetTypeName(type) {
        return getPlanetTypeName(type);
    }

    // Open Recipe Explorer with selected building - Uses shared utility
    openRecipeExplorer(buildingName, tier) {
        ConstructionUtils.openRecipeExplorer(buildingName, tier);
    }

    // Export facility diagram as image
    async exportFacilityDiagram() {
        if (!this.currentFacilityPlan || this.currentFacilityPlan.buildings.length === 0) {
            alert('❌ No facility plan to export. Please add buildings first.');
            return;
        }

        // Check if html2canvas is available
        if (typeof html2canvas === 'undefined') {
            alert('❌ Export library not loaded. Please refresh the page and try again.');
            console.error('html2canvas library not found');
            return;
        }

        try {
            // Create export view
            const exportContainer = this.createExportView();
            document.body.appendChild(exportContainer);

            // Give browser time to render
            await new Promise(resolve => setTimeout(resolve, 100));

            // Capture as image
            const canvas = await html2canvas(exportContainer, {
                backgroundColor: '#1a1a2e',
                scale: 2, // Higher quality
                logging: false,
                windowWidth: 1200,
                windowHeight: exportContainer.scrollHeight
            });

            // Remove export container
            document.body.removeChild(exportContainer);

            // Download image
            const link = document.createElement('a');
            const planetName = this.currentFacilityPlan.planetName.replace(/[^a-z0-9]/gi, '_');
            const timestamp = new Date().toISOString().slice(0, 10);
            link.download = `facility_${planetName}_${timestamp}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            console.log('✅ Facility diagram exported successfully');
        } catch (error) {
            console.error('❌ Error exporting diagram:', error);
            alert('Failed to export diagram. Check console for details.');
        }
    }

    // Create export-friendly view of the facility
    createExportView() {
        const facilityStats = this.calculateFacilityStats();
        const validation = this.validateFacilityPlan();
        const totalTime = this.currentFacilityPlan.buildings.reduce((sum, b) => sum + (b.constructionTime || 0), 0);

        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            width: 1200px;
            background: #1a1a2e;
            color: white;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            box-sizing: border-box;
        `;

        container.innerHTML = `
            <div style="margin-bottom: 30px; text-align: center;">
                <h1 style="color: #4CAF50; margin: 0 0 10px 0; font-size: 32px;">🏗️ Facility Construction Plan</h1>
                <div style="font-size: 18px; color: #ccc;">${this.currentFacilityPlan.planetName}</div>
                <div style="font-size: 14px; color: #888; margin-top: 5px;">${this.currentFacilityPlan.system.name || 'System'} • Tier ${this.currentFacilityPlan.claimStakeTier} Claim Stake</div>
                <div style="font-size: 12px; color: #666; margin-top: 10px;">Generated: ${new Date().toLocaleString()}</div>
            </div>

            ${validation.valid ? `
                <div style="background: #2e7d32; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
                    <div style="font-size: 20px; font-weight: bold;">✅ Facility Plan Valid</div>
                </div>
            ` : `
                <div style="background: #c62828; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">⚠️ Validation Issues</div>
                    ${validation.slotsExceeded ? `<div>• Slots exceeded: ${validation.slotsUsed}/${validation.availableSlots}</div>` : ''}
                    ${validation.powerInsufficient ? `<div>• Power insufficient: ${validation.powerOutput}/${validation.powerConsumption}</div>` : ''}
                </div>
            `}

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                <div style="background: #2a2a3e; padding: 20px; border-radius: 8px;">
                    <h3 style="color: #4CAF50; margin-top: 0;">📊 Facility Summary</h3>
                    <div style="line-height: 1.8;">
                        <div><strong>Buildings:</strong> ${this.currentFacilityPlan.buildings.length}</div>
                        <div><strong>Construction Time:</strong> ${totalTime} minutes</div>
                        <div><strong>Slots Used:</strong> ${validation.slotsUsed}/${validation.availableSlots}</div>
                        <div><strong>Crew Required:</strong> ${facilityStats.totalNeededCrew}/${facilityStats.totalCrewSlots}</div>
                        <div><strong>Power Output:</strong> <span style="color: ${facilityStats.totalPower < 0 ? '#ff4444' : '#4CAF50'}">${facilityStats.totalPower}</span></div>
                        <div><strong>Storage:</strong> ${facilityStats.totalStorage.toLocaleString()}</div>
                    </div>
                </div>

                <div style="background: #2a2a3e; padding: 20px; border-radius: 8px;">
                    <h3 style="color: #4CAF50; margin-top: 0;">💰 Resource Cost</h3>
                    <div style="line-height: 1.6; font-size: 13px; max-height: 200px; overflow-y: auto;">
                        ${Object.entries(facilityStats.totalRecipeCost).length > 0 ?
                            Object.entries(facilityStats.totalRecipeCost).map(([resource, amount]) =>
                                `<div>• ${resource}: <strong>${amount}</strong></div>`
                            ).join('') :
                            '<div style="color: #888;">No recipe ingredients required</div>'
                        }
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 25px;">
                <h3 style="color: #4CAF50;">🏢 Building Architecture</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                    ${this.currentFacilityPlan.buildings.map(building => `
                        <div style="background: #2a2a3e; padding: 15px; border-radius: 6px; ${building.comesWithStake ? 'border: 2px solid #FF9800;' : 'border: 1px solid #444;'}">
                            <div style="font-weight: bold; color: #4CAF50; margin-bottom: 8px; font-size: 14px;">${building.name}</div>
                            <div style="font-size: 11px; color: #ccc; margin-bottom: 8px;">Tier ${building.tier} • ${building.constructionTime || 0} min</div>
                            <div style="display: flex; gap: 12px; font-size: 12px; flex-wrap: wrap;">
                                <span title="Crew">👥 ${building.neededCrew || 0}/${building.crewSlots || 0}</span>
                                <span title="Power">⚡ ${building.power || 0}</span>
                                <span title="Storage">📦 ${(building.storage || 0).toLocaleString()}</span>
                            </div>
                            ${building.comesWithStake ? '<div style="color: #FF9800; font-size: 10px; margin-top: 8px;">📍 Included with Stake</div>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>

            ${Object.keys(facilityStats.resourceExtraction).length > 0 || Object.keys(facilityStats.resourceConsumption).length > 0 ? `
                <div style="background: #2a2a3e; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h3 style="color: #4CAF50; margin-top: 0;">🔄 Resource Production Flow</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        ${Object.keys(facilityStats.resourceExtraction).length > 0 ? `
                            <div>
                                <h4 style="color: #66bb6a; font-size: 14px;">Production (+)</h4>
                                <div style="font-size: 12px; line-height: 1.6;">
                                    ${Object.entries(facilityStats.resourceExtraction).map(([resource, rate]) =>
                                        `<div>• ${resource}: <span style="color: #66bb6a;">+${rate.toFixed(3)}/hour</span></div>`
                                    ).join('')}
                                </div>
                            </div>
                        ` : ''}
                        ${Object.keys(facilityStats.resourceConsumption).length > 0 ? `
                            <div>
                                <h4 style="color: #ef5350; font-size: 14px;">Consumption (-)</h4>
                                <div style="font-size: 12px; line-height: 1.6;">
                                    ${Object.entries(facilityStats.resourceConsumption).map(([resource, rate]) =>
                                        `<div>• ${resource}: <span style="color: #ef5350;">-${rate.toFixed(3)}/hour</span></div>`
                                    ).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            ` : ''}

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #444; text-align: center; color: #666; font-size: 12px;">
                Generated by ClaimStake Explorer • Star Atlas Planning Tool
            </div>
        `;

        return container;
    }
}

// Initialize when tab is switched
function initializeConstructionTab() {
    if (!window.constructionManager) {
        window.constructionManager = new ConstructionManager();
        window.constructionManager.initializeWithPlanetData();
    }
}
