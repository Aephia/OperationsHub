/**
 * Region Map Explorer - Main Application
 * 2D visualization of all star systems with region status
 */

class RegionMapApp {
    constructor() {
        this.regionMap = null;
        this.systems = [];
        this.warpLanes = [];
        this.conquestManager = null;

        // Set global reference early so region-map.js can access conquestManager
        window.regionMapApp = this;

        console.log('[RegionMapApp] Initializing...');
        this.init();
    }

    async init() {
        try {
            // Load data
            await this.loadData();

            console.log('[RegionMapApp] After loadData:', {
                systems: this.systems.length,
                warpLanes: this.warpLanes.length
            });

            // Initialize map - pass systems directly, map will calculate regions
            const canvas = document.getElementById('regionMap');
            this.regionMap = new RegionMap(canvas, this.systems, this.warpLanes);

            console.log('[RegionMapApp] After RegionMap creation:', {
                mapSystems: this.regionMap.systems.length,
                mapWarpLanes: this.regionMap.warpLanes.length
            });

            // Initialize conquest manager
            this.conquestManager = new ConquestManager(this.systems, this.regionMap.regions, this.warpLanes);

            // Initialize region details manager
            this.regionDetailsManager = new RegionDetailsManager(this.conquestManager);

            // Setup UI controls
            this.setupControls();
            this.setupConquestControls();

            // Initial render to show Safe regions (green borders)
            // ConquestManager has already calculated region statuses, now render them
            this.regionMap.render();

            // Listen for system/region selection
            window.addEventListener('regionSelected', (e) => {
                this.displayRegionDetails(e.detail);
            });

            console.log('[RegionMapApp] Initialization complete');
        } catch (error) {
            console.error('[RegionMapApp] Initialization error:', error);
        }
    }

    async loadData() {
        console.log('[RegionMapApp] Loading Star Atlas data...');

        if (typeof planetData !== 'undefined' && planetData.mapData) {
            this.parseStarAtlasData(planetData.mapData);
        } else {
            console.error('[RegionMapApp] planetData not found');
        }

        console.log('[RegionMapApp] Data loaded:', {
            systems: this.systems.length,
            warpLanes: this.warpLanes.length
        });
    }

    parseStarAtlasData(mapData) {
        console.log('[RegionMapApp] Parsing Star Atlas data...');

        const systemsMap = new Map();
        const systemsByName = new Map(); // Map systems by name for link lookup
        const warpLanes = [];

        // First pass: Create all systems and index them
        mapData.forEach(system => {
            // Extract region from system name (first 3 characters)
            // Example: "CSS-MUD-KING-01" -> region "CSS"
            // Example: "004-MUD-KING-01" -> region "004"
            const systemName = system.name || '';
            const nameParts = systemName.split('-');

            if (nameParts.length >= 2) {
                const regionCode = nameParts[0]; // First 3 chars (CSS, 004, 016, etc.)
                const faction = nameParts[1]; // MUD, ONI, UST

                // Use controllingFaction from data if available, otherwise fall back to closestFaction or faction from name
                const controllingFaction = system.controllingFaction || system.closestFaction || faction;

                // Determine system type
                // King systems: structure.type === 1 OR name contains "-KING-"
                // Core systems: name contains "-CORE-" (structure is null for these)
                // Normal systems: everything else
                let systemType = 'Normal';
                if ((system.structure && system.structure.type === 1) || systemName.includes('-KING-')) {
                    systemType = 'King';
                } else if (systemName.includes('-CORE-')) {
                    systemType = 'Core';
                }

                const ownershipValue = systemType === 'King' ? 15 :
                                      systemType === 'Core' ? 8 : 3;

                const systemObj = {
                    id: system.key,
                    name: system.name,
                    mainPlanet: system.mainPlanet || '',
                    originalFaction: faction,
                    controllingFaction: controllingFaction,
                    initialControllingFaction: controllingFaction, // Save initial state for reset
                    regionId: `${regionCode}-${faction}`, // e.g., "CSS-MUD", "004-MUD", "016-UST"
                    regionCode: regionCode,
                    type: systemType,
                    ownershipValue: ownershipValue,
                    coordinates: system.coordinates,
                    strategicScore: system.strategicScore || 0,
                    planetCount: system.planets ? system.planets.length : 0,
                    planets: system.planets || [], // Store full planet data with resources
                    links: system.links || []
                };

                systemsMap.set(system.key, systemObj);
                systemsByName.set(system.name, systemObj); // Index by name
            }
        });

        // Second pass: Create warp lanes from links
        // NOTE: Links use system KEY, not system NAME!
        const processedConnections = new Set(); // Avoid duplicate lanes
        let linksProcessed = 0;
        let linksFound = 0;
        let linksNotFound = 0;

        mapData.forEach(system => {
            if (system.links && system.links.length > 0) {
                linksProcessed++;
                const fromSystem = systemsMap.get(system.key); // Use key, not name

                if (fromSystem) {
                    system.links.forEach(linkedSystemKey => {
                        const toSystem = systemsMap.get(linkedSystemKey); // Links contain keys

                        if (toSystem) {
                            linksFound++;
                            // Create unique connection ID to avoid duplicates (bidirectional)
                            const connectionId = [fromSystem.id, toSystem.id].sort().join('|');

                            if (!processedConnections.has(connectionId)) {
                                processedConnections.add(connectionId);

                                warpLanes.push({
                                    id: `${fromSystem.id}_to_${toSystem.id}`,
                                    fromSystemId: fromSystem.id,
                                    toSystemId: toSystem.id,
                                    fromSystemName: fromSystem.name,
                                    toSystemName: toSystem.name,
                                    active: true
                                });
                            }
                        } else {
                            linksNotFound++;
                            if (linksNotFound <= 5) {
                                console.warn('[RegionMapApp] Link not found:', linkedSystemKey, 'from', system.name, system.key);
                            }
                        }
                    });
                }
            }
        });

        console.log('[RegionMapApp] Link processing:', {
            systemsWithLinks: linksProcessed,
            linksFound: linksFound,
            linksNotFound: linksNotFound,
            uniqueWarpLanes: warpLanes.length
        });

        this.systems = Array.from(systemsMap.values());
        this.warpLanes = warpLanes;

        // Count system types for verification
        const typeCounts = {
            King: this.systems.filter(s => s.type === 'King').length,
            Core: this.systems.filter(s => s.type === 'Core').length,
            Normal: this.systems.filter(s => s.type === 'Normal').length
        };

        console.log('[RegionMapApp] Parsed data:', {
            totalSystems: this.systems.length,
            totalWarpLanes: this.warpLanes.length,
            systemTypes: typeCounts,
            sampleSystem: this.systems[0],
            sampleLane: this.warpLanes[0]
        });
    }

    setupControls() {
        const showConnectionsCheckbox = document.getElementById('showConnections');
        const showLabelsCheckbox = document.getElementById('showLabels');
        const highlightConnectionsCheckbox = document.getElementById('highlightConnections');
        const resetViewButton = document.getElementById('resetView');

        if (showConnectionsCheckbox) {
            showConnectionsCheckbox.addEventListener('change', (e) => {
                this.regionMap.setShowConnections(e.target.checked);
            });
        }

        if (showLabelsCheckbox) {
            showLabelsCheckbox.addEventListener('change', (e) => {
                this.regionMap.setShowLabels(e.target.checked);
            });
        }

        if (highlightConnectionsCheckbox) {
            highlightConnectionsCheckbox.addEventListener('change', (e) => {
                this.regionMap.setHighlightConnections(e.target.checked);
            });
        }

        if (resetViewButton) {
            resetViewButton.addEventListener('click', () => {
                this.regionMap.resetView();
            });
        }
    }

    setupConquestControls() {
        const factionButtons = document.querySelectorAll('.faction-btn');
        const resetConquestButton = document.getElementById('resetConquest');

        // Faction selection
        factionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                factionButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                // Set attacking faction
                const faction = btn.getAttribute('data-faction');
                this.conquestManager.setAttackingFaction(faction);
            });
        });

        // Reset conquest
        if (resetConquestButton) {
            resetConquestButton.addEventListener('click', () => {
                this.conquestManager.resetAll();
                this.regionMap.render();
                // Update region details if one is selected
                if (this.regionMap.selectedSystem) {
                    const region = this.regionMap.regions.find(r => r.id === this.regionMap.selectedSystem.regionId);
                    if (region) {
                        this.displayRegionDetails({system: this.regionMap.selectedSystem, region});
                    }
                }
            });
        }

        // Add click handler to canvas for conquest
        const canvas = document.getElementById('regionMap');
        canvas.addEventListener('click', (e) => {
            if (!this.conquestManager.attackingFaction) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const worldPos = this.regionMap.screenToWorld(x, y);
            const clickedSystem = this.regionMap.getSystemAt(worldPos.x, worldPos.y);

            if (clickedSystem) {
                // Attempt to conquer the system
                const result = this.conquestManager.conquerSystem(clickedSystem);

                if (!result.success) {
                    // Show error message
                    alert(result.reason);
                } else {
                    // Re-render map
                    this.regionMap.render();

                    // Update region details
                    const region = this.regionMap.regions.find(r => r.id === clickedSystem.regionId);
                    if (region) {
                        this.displayRegionDetails({system: clickedSystem, region});
                    }
                }
            }
        });
    }

    displayRegionDetails(data) {
        const container = document.getElementById('regionDetails');
        if (!container) return;

        const { system, region } = data;

        console.log('[RegionMapApp] Displaying details for:', system.name, 'in', region.name);

        // Use the region details manager to render
        this.regionDetailsManager.renderRegionDetails(container, data);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new RegionMapApp(); // window.regionMapApp is set in constructor
});
