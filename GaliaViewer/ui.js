// UI Management v3.0 - Handle UI controls, buttons, and information displays - UPDATED WITH BUILD FACILITY
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { GlobalState } from './state.js';

export class UIManager {
    constructor(container, connectionManager) {
        this.container = container;
        this.connectionManager = connectionManager;

        // Object pooling for performance
        this.tempVector = new THREE.Vector3();
        this.tempVector2 = new THREE.Vector3();
    }

    // Show the center button when a system is clicked
    showCenterButton() {
        const centerBtn = document.getElementById('centerLastClickedBtn');
        if (centerBtn) {
            centerBtn.style.display = 'inline-block';
        }
    }

    // Show click status display with information about clicked object
    showClickStatus(type, objectData) {
        const statusDisplay = document.getElementById('clickStatusDisplay');
        const statusContent = document.getElementById('clickStatusContent');

        if (!statusDisplay || !statusContent) return;

        let content = '';

        if (type === 'star') {
            const system = objectData.system;
            const planetCount = system.planets ? system.planets.length : 0;
            content = `
                <div style="color: #4CAF50; font-weight: bold; margin-bottom: 5px;">⭐ Star System Selected</div>
                <div><strong>Name:</strong> ${system.name || system.key}</div>
                <div><strong>Planets:</strong> ${planetCount}</div>
                <div style="margin-top: 8px; font-size: 11px; color: #ccc;">
                    • Showing system connections<br>
                    • Use center button to focus camera<br>
                    • Double-click for system overview
                </div>
            `;
        } else if (type === 'planet') {
            const planet = objectData.planet;
            const system = objectData.parentSystem;
            content = `
                <div style="color: #2196F3; font-weight: bold; margin-bottom: 5px;">🪐 Planet Selected</div>
                <div><strong>Planet:</strong> ${planet.name}</div>
                <div><strong>System:</strong> ${system.name || system.key}</div>
                <div style="margin-top: 8px; font-size: 11px; color: #ccc;">
                    • Double-click for building interface<br>
                    • Shows parent system connections
                </div>
            `;
        }

        statusContent.innerHTML = content;
        statusDisplay.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            statusDisplay.style.display = 'none';
        }, 5000);
    }

    // Show detailed popup for objects
    showObjectDetails(type, objectData) {
        const popup = document.getElementById('objectDetailsPopup');
        const title = document.getElementById('objectDetailsTitle');
        const content = document.getElementById('objectDetailsContent');

        if (!popup || !title || !content) return;

        // Hide the simple click status when showing detailed popup
        const statusDisplay = document.getElementById('clickStatusDisplay');
        if (statusDisplay) statusDisplay.style.display = 'none';

        if (type === 'star') {
            const system = objectData.system;
            const planetCount = system.planets ? system.planets.length : 0;
            const connectionCount = system.links ? system.links.length : 0;

            title.innerHTML = `⭐ ${system.name || system.key}`;

            let planetsInfo = '';
            if (system.planets && system.planets.length > 0) {
                planetsInfo = `
                    <div style="margin-top: 12px;">
                        <div style="color: #2196F3; font-weight: bold; margin-bottom: 6px;">🪐 Planets (${planetCount}):</div>
                        <div style="display: grid; gap: 6px;">
                            ${system.planets.slice(0, 5).map((planet, index) => `
                                <div style="background: rgba(255, 255, 255, 0.05); padding: 6px; border-radius: 3px; font-size: 11px;">
                                    <strong style="color: #fff;">${planet.name || `Planet ${index + 1}`}</strong>
                                    <div style="color: #ccc; margin-top: 2px;">
                                        Type: ${getPlanetTypeName(planet.type || 0)}
                                        ${planet.resources && planet.resources.length > 0 ?
                                            `<br>Resources: ${planet.resources.slice(0, 3).map(r => r.name).join(', ')}${planet.resources.length > 3 ? '...' : ''}`
                                            : ''}
                                    </div>
                                </div>
                            `).join('')}
                            ${planetCount > 5 ? `<div style="color: #888; font-size: 10px; text-align: center;">+ ${planetCount - 5} more planets</div>` : ''}
                        </div>
                    </div>
                `;
            }

            let connectionsInfo = '';
            if (system.links && system.links.length > 0) {
                connectionsInfo = `
                    <div style="margin-top: 12px;">
                        <div style="color: #FF9800; font-weight: bold; margin-bottom: 6px;">🔗 Connected Systems (${connectionCount}):</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                            ${system.links.slice(0, 8).map(link => `
                                <span style="background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">
                                    ${link}
                                </span>
                            `).join('')}
                            ${connectionCount > 8 ? `<span style="color: #888; font-size: 10px;">+ ${connectionCount - 8} more</span>` : ''}
                        </div>
                    </div>
                `;
            }

            content.innerHTML = `
                <div style="margin-bottom: 8px;">
                    <div style="color: #ccc; font-size: 11px;">
                        <div><strong>System Type:</strong> Star System</div>
                        <div><strong>Planets:</strong> ${planetCount}</div>
                        <div><strong>Connections:</strong> ${connectionCount}</div>
                    </div>
                </div>
                ${planetsInfo}
                ${connectionsInfo}
                <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 10px; color: #888;">
                    Double-click for system overview • Use center button to focus camera
                </div>
            `;
        } else if (type === 'planet') {
            const planet = objectData.planet;
            const system = objectData.parentSystem;

            title.innerHTML = `🪐 ${planet.name || 'Unknown Planet'}`;

            let resourcesInfo = '';
            if (planet.resources && planet.resources.length > 0) {
                resourcesInfo = `
                    <div style="margin-top: 12px;">
                        <div style="color: #4CAF50; font-weight: bold; margin-bottom: 6px;">💎 Resources (${planet.resources.length}):</div>
                        <div style="display: grid; gap: 4px;">
                            ${planet.resources.map(resource => `
                                <div style="background: rgba(76, 175, 80, 0.1); padding: 4px 8px; border-radius: 3px; font-size: 11px; border-left: 2px solid #4CAF50;">
                                    <strong style="color: #4CAF50;">${resource.name}</strong>
                                    ${resource.richness ? `<span style="color: #ccc; margin-left: 8px;">(${resource.richness})</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            content.innerHTML = `
                <div style="margin-bottom: 8px;">
                    <div style="color: #ccc; font-size: 11px;">
                        <div><strong>Planet Type:</strong> ${getPlanetTypeName(planet.type || 0)}</div>
                        <div><strong>System:</strong> ${system.name || system.key}</div>
                        <div><strong>Resources:</strong> ${planet.resources ? planet.resources.length : 0}</div>
                    </div>
                </div>
                ${resourcesInfo}
                <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 10px; color: #888;">
                    Double-click for building interface • Click star to see system overview
                </div>
            `;
        }

        popup.style.display = 'block';
    }

    // Show system overview modal with planet selection
    showSystemOverviewModal(system) {
        // Remove existing modal if any
        const existingModal = document.getElementById('systemOverviewModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'systemOverviewModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #1a1a2e;
            color: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            border: 2px solid #4CAF50;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;

        const planetCount = system.planets ? system.planets.length : 0;
        const planetsHTML = system.planets ? system.planets.map((planet, index) => `
            <div style="background: #2a2a3e; border-radius: 8px; padding: 15px; margin-bottom: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: #2196F3;">🪐 ${planet.name}</h4>
                    <button onclick="window.galiaViewer.uiManager.openBuildingInterface('${system.name}', ${index}); document.getElementById('systemOverviewModal').remove();"
                            style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        🏗️ Build Facility
                    </button>
                </div>
                <div style="font-size: 12px; color: #ccc;">
                    <div>Type: ${getPlanetTypeName(planet.type || 0)}</div>
                    ${planet.resources ? `<div>Resources: ${planet.resources.map(r => r.name).join(', ')}</div>` : ''}
                </div>
            </div>
        `).join('') : '<div style="color: #ccc; text-align: center; padding: 20px;">No planets found in this system</div>';

        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #4CAF50;">⭐ ${system.name || system.key}</h2>
                <button onclick="document.getElementById('systemOverviewModal').remove()"
                        style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                    ✕ Close
                </button>
            </div>

            <div style="margin-bottom: 20px; padding: 15px; background: #16213e; border-radius: 8px;">
                <div style="color: #ccc; font-size: 14px;">
                    <div><strong>Planets:</strong> ${planetCount}</div>
                    <div style="margin-top: 8px; font-size: 12px; color: #888;">
                        Double-click a planet directly in the 3D view for quick access, or use the "Build Facility" buttons below.
                    </div>
                </div>
            </div>

            <div>
                <h3 style="color: #FF9800; margin-bottom: 15px;">Planets in System:</h3>
                ${planetsHTML}
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }


    // Center camera on last clicked star
    centerOnLastClickedStar() {
        if (!GlobalState.lastClickedSystemData) return;

        const sysObj = GlobalState.lastClickedSystemData.sysObj;
        this.tempVector.copy(sysObj.containerGroup.position);
        const targetPos = this.tempVector.clone();

        // Calculate appropriate camera position using object pooling
        const cameraDistance = 20;
        this.tempVector2.set(
            targetPos.x + cameraDistance * 0.7,
            targetPos.y + cameraDistance * 0.5,
            targetPos.z + cameraDistance * 0.7
        );

        this.smoothCameraTransition(this.tempVector2.clone(), targetPos, 1000);
    }

    smoothCameraTransition(targetPos, lookAtPos, duration = 1000) {
        const startPos = GlobalState.sceneManager.camera.position.clone();
        const startTarget = GlobalState.sceneManager.controls.target.clone();
        const startTime = performance.now();

        const animateCamera = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Use easing function for smooth transition
            const ease = 1 - Math.pow(1 - progress, 3);

            // Use object pooling for interpolation
            this.tempVector.lerpVectors(startPos, targetPos, ease);
            GlobalState.sceneManager.camera.position.copy(this.tempVector);

            this.tempVector2.lerpVectors(startTarget, lookAtPos, ease);
            GlobalState.sceneManager.controls.target.copy(this.tempVector2);

            GlobalState.sceneManager.controls.update();

            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };

        animateCamera();
    }

    // Toggle showing all connections
    toggleShowAllConnections(enabled) {
        GlobalState.showAllConnectionsMode = enabled;

        if (enabled) {
            this.connectionManager.showAllSystemConnections();
        } else {
            this.connectionManager.clearAllSystemConnections();
        }
    }

    // Handle center button click (now with checkbox behavior)
    handleCenterButtonClick() {
        if (!GlobalState.lastClickedSystemData) return;

        // Toggle connection display for the last clicked system
        GlobalState.centerButtonConnectionsVisible = !GlobalState.centerButtonConnectionsVisible;

        const button = document.getElementById('centerLastClickedBtn');
        const buttonText = document.getElementById('centerButtonText');
        const buttonIndicator = document.getElementById('centerButtonIndicator');

        if (GlobalState.centerButtonConnectionsVisible) {
            // Show connections and center camera
            console.log('Showing connections and centering on:', GlobalState.lastClickedSystemData.system.name);

            // Update button appearance
            button.style.background = '#FF9800';
            buttonIndicator.style.display = 'inline';
            buttonText.textContent = '🎯 Connected View';

            // Center camera
            this.centerOnLastClickedStar();

            // Show connections
            this.connectionManager.showConnectedSystems(GlobalState.lastClickedSystemData.sysObj);

        } else {
            // Hide connections but keep centered
            // Update button appearance
            button.style.background = '#4CAF50';
            buttonIndicator.style.display = 'none';
            buttonText.textContent = '🎯 Center on Last Star';

            // Clear connections but stay centered
            this.connectionManager.clearConnectionView();
        }
    }

    // Toggle fullscreen
    toggleFullscreen() {
        const planetMapContainer = document.getElementById('planetMap');

        if (!document.fullscreenElement) {
            planetMapContainer.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Show system information - UPDATED VERSION
    showSystemInformation(system) {
        const infoWidget = document.getElementById('systemInfoWidget');
        if (!infoWidget) return;

        const systemName = system.name || system.key || 'Unknown System';
        const planets = system.planets || [];

        let content = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #4CAF50;">${systemName}</h3>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span style="background: #333; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                        ${planets.length} planets
                    </span>
                    <button onclick="window.galiaViewer.eventHandlers.restoreAllSystems()" 
                            style="background:#ff4444;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">
                        ✕ Close & Show All Systems
                    </button>
                </div>
            </div>
        `;

        if (planets.length > 0) {
            content += '<div style="margin-bottom: 15px;"><strong>Planets:</strong></div>';
            content += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">';

            planets.forEach((planet, index) => {
                const planetName = planet.name || `Planet ${index + 1}`;
                const planetType = planet && planet.type !== undefined ? getPlanetTypeName(planet.type) : 'Unknown';
                const resources = planet.resources || [];

                content += `
                    <div style="background: #2a2a3e; padding: 12px; border-radius: 6px; border: 1px solid #444;">
                        <div style="font-weight: bold; color: #fff; margin-bottom: 8px;">${planetName}</div>
                        <div style="font-size: 12px; color: #ccc; margin-bottom: 6px;">${planetType}</div>
                `;

                if (resources.length > 0) {
                    content += '<div style="font-size: 11px; color: #aaa;">Resources:</div>';
                    content += '<div style="font-size: 11px; margin-top: 4px;">';
                    resources.forEach(resource => {
                        const resourceData = this.getResourceData(resource.name);
                        const richness = resource.richness || 'Unknown';
                        content += `<div style="margin: 2px 0;">• ${resource.name} (${richness})</div>`;
                    });
                    content += '</div>';
                } else {
                    content += '<div style="font-size: 11px; color: #666;">No resources</div>';
                }

                // Add building construction button
                content += `
                    <div style="margin-top: 8px;">
                        <button onclick="window.galiaViewer.uiManager.openBuildingInterface('${system.name}', ${index})"
                                style="background: #4CAF50; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; width: 100%;">
                            🏗️ Build Facility
                        </button>
                    </div>
                `;

                content += '</div>';
            });

            content += '</div>';
        }

        // Show connections
        if (system.links && system.links.length > 0) {
            content += `
                <div style="margin-top: 20px;">
                    <strong>Connected Systems (${system.links.length}):</strong>
                    <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px;">
            `;

            system.links.forEach(link => {
                content += `
                    <span style="background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">
                        ${link}
                    </span>
                `;
            });

            content += '</div></div>';
        }


        infoWidget.querySelector('#systemInfoContent').innerHTML = content;
        infoWidget.style.display = 'block';
    }

    hideSystemInformation() {
        const infoWidget = document.getElementById('systemInfoWidget');
        if (infoWidget) {
            infoWidget.style.display = 'none';
        }
    }


    // Helper function to get resource data from Data folder
    getResourceData(resourceName) {
        if (typeof window.resourcesData !== 'undefined' && window.resourcesData.resources) {
            const resource = window.resourcesData.resources.find(r =>
                r.name.toLowerCase() === resourceName.toLowerCase() ||
                r.id.toLowerCase() === resourceName.toLowerCase()
            );
            return resource || { name: resourceName, category: 'Unknown', tier: 'Unknown' };
        }
        return { name: resourceName, category: 'Unknown' };
    }

    // Helper function to get suitable buildings for a system
    getSuitableBuildingsForSystem(system) {
        // This is a simplified version - in a real implementation,
        // this would analyze system resources and match against building requirements
        const suitableBuildings = [
            { name: 'Mining Station', type: 'resource' },
            { name: 'Research Lab', type: 'science' },
            { name: 'Defense Platform', type: 'military' }
        ];

        return suitableBuildings.slice(0, 10); // Limit to first 10 for display
    }

    // Reset UI controls
    resetUIControls() {
        // Reset show all connections checkbox
        const showAllCheckbox = document.getElementById('showAllConnectionsCheckbox');
        if (showAllCheckbox) {
            showAllCheckbox.checked = false;
        }
        GlobalState.showAllConnectionsMode = false;

        // Reset center button
        const button = document.getElementById('centerLastClickedBtn');
        const buttonText = document.getElementById('centerButtonText');
        const buttonIndicator = document.getElementById('centerButtonIndicator');

        if (button && buttonText && buttonIndicator) {
            button.style.background = '#4CAF50';
            buttonIndicator.style.display = 'none';
            buttonText.textContent = '🎯 Center on Last Star';
            button.style.display = 'none'; // Hide until next click
        }

        GlobalState.centerButtonConnectionsVisible = false;
    }

    // Open building construction interface for a specific planet
    openBuildingInterface(systemName, planetIndex) {
        const system = GlobalState.systems.find(s => s.name === systemName);
        if (!system || !system.planets || !system.planets[planetIndex]) {
            console.error('Planet not found:', systemName, planetIndex);
            return;
        }

        const planet = system.planets[planetIndex];
        const planetName = planet.name || `Planet ${planetIndex + 1}`;

        // Create or show building modal
        this.showBuildingModal(system, planet, planetName);
    }

    // Show building construction modal - Star Atlas Theme
    showBuildingModal(system, planet, planetName) {
        // Play modal open sound
        if (window.spaceSounds) window.spaceSounds.openPopup();

        // Remove existing modal if any
        const existingModal = document.getElementById('buildingModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Get compatible buildings for this planet
        const compatibleBuildings = this.getCompatibleBuildings(planet, system);

        // Store for filtering
        this.currentCompatibleBuildings = compatibleBuildings;
        this.currentSystem = system;
        this.currentPlanet = planet;

        const modal = document.createElement('div');
        modal.id = 'buildingModal';
        modal.className = 'construction-modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.className = 'construction-modal';
        modalContent.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            overflow-y: auto;
            min-width: 600px;
        `;

        modalContent.innerHTML = `
            <div class="construction-modal-header">
                <h2 class="construction-modal-title">🏗️ Build Facility - ${planetName}</h2>
                <button class="construction-close-btn" onclick="if(window.spaceSounds)window.spaceSounds.closePopup();this.closest('#buildingModal').remove()">
                    ✕ Close
                </button>
            </div>

            <!-- Claim Stake Selection -->
            <div class="construction-stake-info">
                <div class="construction-stake-row">
                    <strong>🏗️ Select Your Claim Stake Tier:</strong>
                    <select id="claimStakeTier" class="construction-stake-select" onchange="if(window.spaceSounds)window.spaceSounds.select();window.galiaViewer.uiManager.updateCompatibleBuildings()">
                        <option value="1">Tier 1 - Basic Stake</option>
                        <option value="2">Tier 2 - Advanced Stake</option>
                        <option value="3">Tier 3 - Professional Stake</option>
                        <option value="4">Tier 4 - Industrial Stake</option>
                        <option value="5">Tier 5 - Mega Stake</option>
                    </select>
                </div>
                <div>
                    <strong>Planet Type:</strong> ${getPlanetTypeName(planet.type || 0)} |
                    <strong>Available Resources:</strong> ${ConstructionUtils.formatResourcesWithTiers(planet.resources)}
                </div>
            </div>

            <!-- Two-column layout -->
            <div class="construction-layout">
                <!-- Left Panel: Building List -->
                <div class="construction-buildings-panel">
                    <h3 class="construction-section-title">Compatible Buildings <span class="building-count" id="buildingCount">(${compatibleBuildings.length})</span></h3>

                    <!-- Search Bar -->
                    <input
                        type="text"
                        id="buildingSearchInput"
                        class="construction-search-input"
                        placeholder="🔍 Search buildings..."
                        oninput="window.galiaViewer.uiManager.filterBuildings(this.value)"
                    />

                    <!-- Tier Filters -->
                    <div class="construction-filters">
                        <span class="construction-filter-label">Filter by Tier:</span>
                        <div class="construction-filter-group">
                            <label class="construction-filter-checkbox">
                                <input type="checkbox" id="tierFilter1" checked onchange="if(window.spaceSounds)window.spaceSounds.select();window.galiaViewer.uiManager.applyTierFilters()">
                                T1
                            </label>
                            <label class="construction-filter-checkbox">
                                <input type="checkbox" id="tierFilter2" checked onchange="if(window.spaceSounds)window.spaceSounds.select();window.galiaViewer.uiManager.applyTierFilters()">
                                T2
                            </label>
                            <label class="construction-filter-checkbox">
                                <input type="checkbox" id="tierFilter3" checked onchange="if(window.spaceSounds)window.spaceSounds.select();window.galiaViewer.uiManager.applyTierFilters()">
                                T3
                            </label>
                            <label class="construction-filter-checkbox">
                                <input type="checkbox" id="tierFilter4" checked onchange="if(window.spaceSounds)window.spaceSounds.select();window.galiaViewer.uiManager.applyTierFilters()">
                                T4
                            </label>
                            <label class="construction-filter-checkbox">
                                <input type="checkbox" id="tierFilter5" checked onchange="if(window.spaceSounds)window.spaceSounds.select();window.galiaViewer.uiManager.applyTierFilters()">
                                T5
                            </label>
                        </div>
                        <span class="construction-filter-label">Filter by Type:</span>
                        <div class="construction-filter-group">
                            <label class="construction-filter-checkbox">
                                <input type="checkbox" id="typeFilterExtractor" checked onchange="if(window.spaceSounds)window.spaceSounds.select();window.galiaViewer.uiManager.applyTierFilters()">
                                Extractors
                            </label>
                            <label class="construction-filter-checkbox">
                                <input type="checkbox" id="typeFilterProcessor" checked onchange="if(window.spaceSounds)window.spaceSounds.select();window.galiaViewer.uiManager.applyTierFilters()">
                                Processors
                            </label>
                        </div>
                    </div>

                    <div id="buildingsList" class="construction-buildings-list">
                        ${this.renderBuildingOptions(compatibleBuildings, system, planet)}
                    </div>
                </div>

                <!-- Right Panel: Facility Plan Summary -->
                <div class="construction-plan-panel">
                    <div id="facilityPlan" class="construction-facility-plan">
                        <h3 class="construction-plan-title">🏭 Facility Plan Summary</h3>
                        <div id="selectedBuildings">
                            <div class="construction-empty-state">
                                <div class="construction-empty-state-icon">👈</div>
                                <div class="construction-empty-state-text">Select buildings to start planning</div>
                            </div>
                        </div>
                        <div id="facilityPlanActions" class="construction-plan-actions" style="display: none;">
                            <button class="construction-btn-clear" onclick="if(window.spaceSounds)window.spaceSounds.click();window.galiaViewer.uiManager.clearFacilityPlan()">
                                Clear Plan
                            </button>
                            <button class="construction-btn-construct" onclick="if(window.spaceSounds)window.spaceSounds.scan();window.galiaViewer.uiManager.constructFacility()">
                                🚀 Construct Facility
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Initialize facility plan storage
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

    // Get buildings compatible with the planet type and available resources
    getCompatibleBuildings(planet, system, claimStakeTier = 1) {
        return ConstructionUtils.getCompatibleBuildings(planet, system, claimStakeTier);
    }

    // Update compatible buildings when claim stake tier changes
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

        // Apply tier and type filters first using shared utility
        let filtered = ConstructionUtils.filterBuildingsByTiersAndTypes(this.currentCompatibleBuildings);

        // Then apply search filter if present
        if (searchLower) {
            filtered = filtered.filter(building => {
                const nameMatch = building.name.toLowerCase().includes(searchLower);
                const tierMatch = building.tier && building.tier.toString().includes(searchLower);
                const typeMatch = ConstructionUtils.getBuildingType(building).toLowerCase().includes(searchLower);
                const descMatch = building.description && building.description.toLowerCase().includes(searchLower);

                return nameMatch || tierMatch || typeMatch || descMatch;
            });
        }

        this.displayFilteredBuildings(filtered);
    }

    // Apply tier filters to building list
    applyTierFilters() {
        const searchInput = document.getElementById('buildingSearchInput');
        const searchTerm = searchInput ? searchInput.value : '';
        this.filterBuildings(searchTerm);
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

    // Get available slots for claim stake tier
    getClaimStakeSlots(tier) {
        return ConstructionUtils.getClaimStakeSlots(tier);
    }

    // Get base power output for claim stake tier
    getClaimStakePower(tier) {
        return ConstructionUtils.getClaimStakePower(tier);
    }

    // Validate facility plan for power, slot, and crew requirements - Uses shared utility
    validateFacilityPlan() {
        if (!this.currentFacilityPlan) return { valid: true };

        const buildings = this.currentFacilityPlan.buildings;
        const claimStakeTier = this.currentFacilityPlan.claimStakeTier;

        const validation = ConstructionUtils.validateFacilityPlan(buildings, claimStakeTier);
        this.currentFacilityPlan.validation = validation;
        return validation;
    }

    // Check if planet type is compatible with building requirements - Delegates to shared utility
    checkPlanetTypeCompatibility(planetTypeNum, requiredTags) {
        return ConstructionUtils.checkPlanetTypeCompatibility(planetTypeNum, requiredTags);
    }

    // Generate detailed explanation when no buildings match
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
            const planetTypeCompatible = ConstructionUtils.checkPlanetTypeCompatibility(planetTypeNum, requiredTags);
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

    // Render building options - Star Atlas Theme
    renderBuildingOptions(buildings, system, planet) {
        if (buildings.length === 0) {
            return this.generateDetailedNoMatchesMessage(planet, system);
        }

        return buildings.map(building => {
            // Prepare crew, power, and storage info
            const crewSlots = building.crewSlots || 0;
            const neededCrew = building.neededCrew || 0;
            const power = building.power || 0;
            const storage = building.storage || 0;

            const stats = [];
            if (neededCrew > 0 || crewSlots > 0) {
                stats.push(`👥 ${neededCrew}/${crewSlots}`);
            }
            if (power !== 0) {
                const powerClass = power > 0 ? 'construction-stat-positive' : 'construction-stat-negative';
                stats.push(`<span class="${powerClass}">⚡ ${power > 0 ? '+' : ''}${power}</span>`);
            }
            if (storage > 0) {
                stats.push(`📦 ${storage.toLocaleString()}`);
            }

            return `
                <div class="construction-building-card">
                    <h4 class="construction-building-name">${building.name}</h4>
                    <div class="construction-building-meta">Tier ${building.tier} • ${building.constructionTime || 0} minutes</div>
                    <div class="construction-building-desc">${building.description || 'No description'}</div>

                    ${stats.length > 0 ? `
                        <div class="construction-building-stats">
                            ${stats.join(' • ')}
                        </div>
                    ` : ''}

                    <div class="construction-building-actions">
                        <button class="construction-btn construction-btn-add" onclick="if(window.spaceSounds)window.spaceSounds.click();window.galiaViewer.uiManager.addBuildingToPlan('${building.id}')">
                            ➕ Add to Plan
                        </button>
                        <button class="construction-btn construction-btn-recipe" onclick="if(window.spaceSounds)window.spaceSounds.click();ConstructionUtils.openRecipeExplorer('${building.name}', ${building.tier})">
                            🧪 Recipe
                        </button>
                        <button class="construction-btn construction-btn-details" onclick="if(window.spaceSounds)window.spaceSounds.openPopup();window.galiaViewer.uiManager.showBuildingDetails('${building.id}')">
                            📋 Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Add building to facility plan - with sounds
    addBuildingToPlan(buildingId) {
        if (!this.currentFacilityPlan) return;

        const building = window.rawBuildingData.buildings.find(b => b.id === buildingId);
        if (!building) return;

        // Check if building is compatible with current claim stake tier
        if (building.minimumTier > this.currentFacilityPlan.claimStakeTier) {
            if (window.spaceSounds) window.spaceSounds.error();
            alert(`❌ This building requires a Tier ${building.minimumTier} claim stake. You currently have Tier ${this.currentFacilityPlan.claimStakeTier}.`);
            return;
        }

        // Temporarily add building to check validation
        this.currentFacilityPlan.buildings.push(building);
        const validation = this.validateFacilityPlan();

        if (!validation.valid) {
            // Remove the building if validation fails
            this.currentFacilityPlan.buildings.pop();

            // Play error sound
            if (window.spaceSounds) window.spaceSounds.error();

            let errorMessage = '❌ Cannot add building:\n\n';
            if (validation.slotsExceeded) {
                errorMessage += `• Exceeds available slots: ${validation.slotsUsed}/${validation.availableSlots}\n`;
            }
            if (validation.powerInsufficient) {
                errorMessage += `• Insufficient power: ${validation.powerOutput} available, ${validation.powerConsumption} required\n`;
            }
            if (validation.crewInsufficient) {
                errorMessage += `• Insufficient crew slots: ${validation.crewRequired} required, ${validation.crewSlots} available\n`;
            }
            errorMessage += '\nPlease upgrade your claim stake tier, add crew quarters, or remove other buildings first.';

            alert(errorMessage);
            return;
        }

        // Building successfully added - play success sound
        if (window.spaceSounds) window.spaceSounds.success();
        this.updateFacilityPlanDisplay();
    }

    // Update facility plan display - Star Atlas Theme
    updateFacilityPlanDisplay() {
        const facilityPlan = document.getElementById('facilityPlan');
        const selectedBuildings = document.getElementById('selectedBuildings');
        const facilityPlanActions = document.getElementById('facilityPlanActions');

        if (!facilityPlan || !selectedBuildings || !this.currentFacilityPlan) return;

        if (this.currentFacilityPlan.buildings.length === 0) {
            // Show placeholder message
            selectedBuildings.innerHTML = `
                <div class="construction-empty-state">
                    <div class="construction-empty-state-icon">👈</div>
                    <div class="construction-empty-state-text">Select buildings to start planning</div>
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
        if (facilityPlanActions) facilityPlanActions.style.display = 'flex';

        const facilityStats = this.calculateFacilityStats();
        const validation = this.validateFacilityPlan();
        const totalTime = this.currentFacilityPlan.buildings.reduce((sum, b) => sum + (b.constructionTime || 0), 0);

        // Validation status display
        let validationDisplay = '';
        if (!validation.valid) {
            validationDisplay = `
                <div class="construction-validation construction-validation-error">
                    ⚠️ <strong>Validation Issues:</strong><br>
                    ${validation.slotsExceeded ? `• Slots exceeded: ${validation.slotsUsed}/${validation.availableSlots}<br>` : ''}
                    ${validation.powerInsufficient ? `• Power insufficient: ${validation.powerOutput}/${validation.powerConsumption}<br>` : ''}
                    ${validation.crewInsufficient ? `• Crew insufficient: ${validation.crewRequired} required, ${validation.crewSlots} available<br>` : ''}
                </div>
            `;
        } else {
            validationDisplay = `
                <div class="construction-validation construction-validation-success">
                    ✅ <strong>Facility plan is valid!</strong>
                </div>
            `;
        }

        selectedBuildings.innerHTML = `
            ${validationDisplay}
            <div class="construction-plan-stats">
                <strong>Buildings Selected: ${this.currentFacilityPlan.buildings.length}</strong><br>
                <strong>Total Construction Time: ${totalTime} minutes</strong><br>
                <strong>Claim Stake: Tier ${this.currentFacilityPlan.claimStakeTier}</strong><br>
                <strong>Slots Used: ${validation.slotsUsed}/${validation.availableSlots}</strong>
                ${validation.slotsExceeded ? ' <span class="construction-stat-warn">⚠️</span>' : ' <span class="construction-stat-ok">✓</span>'}<br>
                <strong>Power: ${validation.powerOutput} output, ${validation.powerConsumption} consumption</strong>
                ${validation.powerInsufficient ? ' <span class="construction-stat-warn">⚠️</span>' : ' <span class="construction-stat-ok">✓</span>'}<br>
                <strong>Crew: ${validation.crewRequired || 0} required, ${validation.crewSlots || 0} available</strong>
                ${validation.crewInsufficient ? ' <span class="construction-stat-warn">⚠️</span>' : ' <span class="construction-stat-ok">✓</span>'}
            </div>

            <div class="construction-selected-grid">
                ${this.currentFacilityPlan.buildings.map((building, index) => `
                    <div class="construction-selected-card ${building.comesWithStake ? 'stake-building' : ''}">
                        ${!building.comesWithStake ? `
                        <button class="construction-selected-card-remove" onclick="if(window.spaceSounds)window.spaceSounds.deselect();window.galiaViewer.uiManager.removeBuildingFromPlan(${index})">
                            ✕
                        </button>
                        ` : ''}
                        <div style="margin-right: 25px;">
                            <div class="construction-selected-card-name">${building.name}</div>
                            <div class="construction-selected-card-meta">Tier ${building.tier} • ${building.constructionTime || 0} min</div>
                            <div class="construction-selected-card-stats">
                                <span>👥 ${building.neededCrew || 0}/${building.crewSlots || 0}</span>
                                <span>⚡ ${building.power || 0}</span>
                                <span>📦 ${(building.storage || 0).toLocaleString()}</span>
                            </div>
                            ${building.comesWithStake ? '<div class="construction-stake-badge">📍 Included with Stake (Cannot Remove)</div>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="construction-info-grid">
                <!-- Recipe Ingredients Cost -->
                ${Object.keys(facilityStats.totalRecipeCost || {}).length > 0 ? `
                <div class="construction-info-card">
                    <div class="construction-info-card-title">🧪 Recipe Ingredients:</div>
                    ${Object.entries(facilityStats.totalRecipeCost).map(([resource, amount]) =>
                        `<div class="construction-info-card-item">• ${resource}: ${amount}</div>`
                    ).join('')}
                </div>
                ` : ''}

                <!-- Crew & Operations -->
                <div class="construction-info-card">
                    <div class="construction-info-card-title">👥 Crew & Operations:</div>
                    <div class="construction-info-card-item">• Total Crew Slots: ${facilityStats.totalCrewSlots}</div>
                    <div class="construction-info-card-item">• Crew Required: ${facilityStats.totalNeededCrew}</div>
                    <div class="construction-info-card-item">• Power Output: <span class="${facilityStats.totalPower < 0 ? 'construction-stat-negative' : ''}">${facilityStats.totalPower}</span></div>
                    <div class="construction-info-card-item">• Storage Capacity: ${facilityStats.totalStorage.toLocaleString()}</div>
                </div>

                <!-- Resource Production -->
                ${Object.keys(facilityStats.resourceExtraction).length > 0 || Object.keys(facilityStats.resourceConsumption).length > 0 ? `
                <div class="construction-info-card">
                    <div class="construction-info-card-title">🔄 Resource Production:</div>
                    ${Object.entries(facilityStats.resourceExtraction).map(([resource, rate]) =>
                        `<div class="construction-info-card-item construction-stat-positive">📈 ${resource}: +${rate.toFixed(3)}/hour</div>`
                    ).join('')}
                    ${Object.entries(facilityStats.resourceConsumption).map(([resource, rate]) =>
                        `<div class="construction-info-card-item construction-stat-negative">📉 ${resource}: -${rate.toFixed(3)}/hour</div>`
                    ).join('')}
                    ${Object.keys(facilityStats.resourceExtraction).length === 0 && Object.keys(facilityStats.resourceConsumption).length === 0 ?
                        '<div class="construction-info-card-item" style="color: #666;">No resource production</div>' : ''}
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

    // Calculate total construction cost
    calculateTotalCost() {
        if (!this.currentFacilityPlan) return {};

        const totalCost = {};
        this.currentFacilityPlan.buildings.forEach(building => {
            const cost = building.constructionCost || {};
            Object.entries(cost).forEach(([resource, amount]) => {
                totalCost[resource] = (totalCost[resource] || 0) + amount;
            });
        });
        return totalCost;
    }

    // Calculate comprehensive facility statistics
    calculateFacilityStats() {
        if (!this.currentFacilityPlan) return {};

        const buildings = this.currentFacilityPlan.buildings;

        // Use shared utility for comprehensive stats including recipe costs
        return ConstructionUtils.calculateFacilityStats(buildings);
    }

    // Remove building from plan - with sounds
    removeBuildingFromPlan(index) {
        if (!this.currentFacilityPlan || index < 0 || index >= this.currentFacilityPlan.buildings.length) return;

        const building = this.currentFacilityPlan.buildings[index];

        // Prevent removal of buildings that come with the stake
        if (building.comesWithStake) {
            if (window.spaceSounds) window.spaceSounds.error();
            alert('❌ Cannot remove this building - it is included with your claim stake and cannot be removed.');
            return;
        }

        // Play deselect sound
        if (window.spaceSounds) window.spaceSounds.deselect();
        this.currentFacilityPlan.buildings.splice(index, 1);
        this.updateFacilityPlanDisplay();
    }

    // Clear facility plan
    clearFacilityPlan() {
        if (!this.currentFacilityPlan) return;

        // Only remove manually added buildings, keep the ones that come with stake
        this.currentFacilityPlan.buildings = this.currentFacilityPlan.buildings.filter(b => b.comesWithStake);
        this.updateFacilityPlanDisplay();
    }

    // Construct facility (simulation) - with sounds
    constructFacility() {
        if (!this.currentFacilityPlan || this.currentFacilityPlan.buildings.length === 0) {
            if (window.spaceSounds) window.spaceSounds.error();
            alert('No buildings selected for construction!');
            return;
        }

        // Validate facility plan before construction
        const validation = this.validateFacilityPlan();
        if (!validation.valid) {
            if (window.spaceSounds) window.spaceSounds.error();
            let errorMessage = '❌ Cannot construct facility due to validation errors:\n\n';
            if (validation.slotsExceeded) {
                errorMessage += `• Slots exceeded: ${validation.slotsUsed}/${validation.availableSlots}\n`;
            }
            if (validation.powerInsufficient) {
                errorMessage += `• Insufficient power: ${validation.powerOutput} available, ${validation.powerConsumption} required\n`;
            }
            if (validation.crewInsufficient) {
                errorMessage += `• Insufficient crew slots: ${validation.crewRequired} required, ${validation.crewSlots} available\n`;
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
            // Play success sound
            if (window.spaceSounds) window.spaceSounds.success();

            let successMessage = `🎉 Facility construction started!\n\n`;
            successMessage += `Buildings are now being constructed on ${this.currentFacilityPlan.planetName}.\n`;
            successMessage += `Estimated completion: ${totalTime} minutes\n`;
            successMessage += `Crew required: ${facilityStats.totalNeededCrew} personnel\n`;
            successMessage += `Power generation: ${facilityStats.totalPower} units${facilityStats.totalPower < 0 ? ' (⚠️ Negative Power!)' : ''}`;

            alert(successMessage);

            // Play close popup sound and close modal
            if (window.spaceSounds) window.spaceSounds.closePopup();
            const modal = document.getElementById('buildingModal');
            if (modal) modal.remove();

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

    // Show detailed building information in a modal - Star Atlas Theme
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

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'buildingDetailModal';
        modal.className = 'construction-modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.className = 'construction-details-modal';
        modalContent.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            overflow-y: auto;
            min-width: 600px;
        `;

        // Construction cost details
        const constructionCostHTML = building.constructionCost ? `
            <div class="construction-details-section">
                <h3 class="construction-details-section-title" style="color: var(--sa-accent-gold);">Construction Cost</h3>
                <div class="construction-details-cost-grid">
                    ${Object.entries(building.constructionCost).map(([material, amount]) => `
                        <div class="construction-details-cost-item">
                            <span style="font-weight: bold;">${material}</span>
                            <span class="construction-stat-positive">${amount}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        // Resource extraction details
        const extractionHTML = building.resourceExtractionRate ? `
            <div class="construction-details-section">
                <h3 class="construction-details-section-title" style="color: var(--sa-accent-green);">Resource Extraction Rate</h3>
                <div class="construction-details-cost-grid">
                    ${Object.entries(building.resourceExtractionRate).map(([resource, rate]) => `
                        <div class="construction-details-cost-item">
                            <span style="font-weight: bold;">${resource}</span>
                            <span class="construction-details-rate-positive">+${rate}/hour</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        // Resource consumption details
        const consumptionHTML = building.resourceRate ? `
            <div class="construction-details-section">
                <h3 class="construction-details-section-title" style="color: var(--sa-accent-red);">Resource Consumption</h3>
                <div class="construction-details-cost-grid">
                    ${Object.entries(building.resourceRate).map(([resource, rate]) => `
                        <div class="construction-details-cost-item">
                            <span style="font-weight: bold;">${resource}</span>
                            <span class="${rate < 0 ? 'construction-details-rate-negative' : 'construction-details-rate-positive'}">${rate}/hour</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        // Build enabled features list
        const enabledFeatures = building.addedTags ? building.addedTags.filter(tag => tag.startsWith('enables-')).map(tag =>
            tag.replace('enables-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        ) : [];

        modalContent.innerHTML = `
            <div class="construction-details-header">
                <h2 class="construction-details-title">${building.name}</h2>
                <button class="construction-close-btn" onclick="if(window.spaceSounds)window.spaceSounds.closePopup();this.closest('#buildingDetailModal').remove()">
                    ✕ Close
                </button>
            </div>

            <div class="building-overview">
                <p class="construction-details-desc">${building.description || 'No description available'}</p>

                <div class="construction-details-stats-grid">
                    <div class="construction-details-stat">
                        <div class="construction-details-stat-label">Tier</div>
                        <div class="construction-details-stat-value" style="color: var(--sa-accent-cyan);">${building.tier || 'Unknown'}</div>
                    </div>
                    <div class="construction-details-stat">
                        <div class="construction-details-stat-label">Min Tier</div>
                        <div class="construction-details-stat-value" style="color: var(--sa-accent-gold);">${building.minimumTier || 'N/A'}</div>
                    </div>
                    <div class="construction-details-stat">
                        <div class="construction-details-stat-label">Power</div>
                        <div class="construction-details-stat-value" style="color: #3b82f6;">${building.power || 0}W</div>
                    </div>
                    <div class="construction-details-stat">
                        <div class="construction-details-stat-label">Slots</div>
                        <div class="construction-details-stat-value" style="color: var(--sa-accent-purple);">${building.slots || 0}</div>
                    </div>
                    <div class="construction-details-stat">
                        <div class="construction-details-stat-label">Storage</div>
                        <div class="construction-details-stat-value" style="color: #64748b;">${(building.storage || 0).toLocaleString()}</div>
                    </div>
                    <div class="construction-details-stat">
                        <div class="construction-details-stat-label">Build Time</div>
                        <div class="construction-details-stat-value" style="color: #f97316;">${building.constructionTime || 0}min</div>
                    </div>
                    <div class="construction-details-stat">
                        <div class="construction-details-stat-label">Crew Slots</div>
                        <div class="construction-details-stat-value" style="color: #78716c;">${building.crewSlots || 0}</div>
                    </div>
                    <div class="construction-details-stat">
                        <div class="construction-details-stat-label">Crew Needed</div>
                        <div class="construction-details-stat-value" style="color: #ec4899;">${building.neededCrew || 0}</div>
                    </div>
                </div>
            </div>

            ${constructionCostHTML}
            ${extractionHTML}
            ${consumptionHTML}

            <div class="construction-details-section">
                <h3 class="construction-details-section-title">Properties</h3>
                <div class="construction-details-tags">
                    ${building.comesWithStake ? '<span class="construction-details-tag construction-details-tag-green">Comes with Stake</span>' : ''}
                    ${building.cannotRemove ? '<span class="construction-details-tag construction-details-tag-red">Cannot Remove</span>' : ''}
                    ${Object.keys(building.resourceExtractionRate || {}).length > 0 ? '<span class="construction-details-tag construction-details-tag-gold">Has Resource Extraction</span>' : ''}
                    ${enabledFeatures.length > 0 ? enabledFeatures.map(feature =>
                        `<span class="construction-details-tag construction-details-tag-blue">Enables ${feature}</span>`
                    ).join('') : ''}
                </div>
            </div>

            <div class="construction-details-section">
                <h3 class="construction-details-section-title" style="color: #64748b;">Technical Details</h3>
                <div class="construction-details-technical">
                    <p><strong>ID:</strong> ${building.id}</p>
                    ${building.requiredTags ? `<p><strong>Required Tags:</strong> ${building.requiredTags.join(', ')}</p>` : ''}
                    ${building.addedTags ? `<p><strong>Added Tags:</strong> ${building.addedTags.join(', ')}</p>` : ''}
                </div>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}