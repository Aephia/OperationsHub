/**
 * Region Map Visualization
 * 2D map showing all star systems grouped into regions
 */

class RegionMap {
    constructor(canvas, systems, warpLanes) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.systems = systems; // All individual star systems
        this.warpLanes = warpLanes;

        // Calculate regions from systems
        this.regions = this.calculateRegions();

        // Cache for expensive computations
        this.regionHullCache = new Map(); // Cache convex hulls for regions
        this.lastRegionStatusUpdate = 0; // Track when region status was last checked

        // Map state
        this.selectedSystem = null;
        this.hoveredSystem = null;
        this.showConnections = true;
        this.showLabels = false; // Too many systems for labels by default
        this.highlightConnections = false; // Show only selected system connections

        // Animation state
        this.animationPhase = 0;
        this.animationStarted = false; // Track if animation loop has started

        // Camera/viewport
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1
        };

        // Zoom center point (in world coordinates)
        this.zoomCenter = null;

        // Mouse state
        this.mouse = {
            x: 0,
            y: 0,
            down: false,
            dragStart: { x: 0, y: 0 }
        };

        // Colors
        this.colors = {
            MUD: '#ff4444',
            ONI: '#4444ff',
            UST: '#ffaa00',
            MRZ: '#888888',
            neutral: '#666666'
        };

        this.init();
    }

    calculateRegions() {
        // Group systems by their region ID
        const regionsMap = new Map();

        this.systems.forEach(sys => {
            const regionId = sys.regionId; // e.g., "CSS-MUD", "004-MUD", "016-UST"

            if (!regionsMap.has(regionId)) {
                regionsMap.set(regionId, {
                    id: regionId,
                    name: `R-${regionId}`, // Format: R-CSS-MUD, R-004-MUD, R-016-UST
                    originalFaction: sys.originalFaction,
                    regionCode: sys.regionCode,
                    systems: []
                });
            }

            regionsMap.get(regionId).systems.push(sys);
        });

        // Calculate region bounds and center for each region
        const regions = Array.from(regionsMap.values());
        regions.forEach(region => {
            this.calculateRegionBounds(region);
        });

        return regions;
    }

    calculateRegionBounds(region) {
        // Find bounds of all systems in this region
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        region.systems.forEach(sys => {
            if (sys.coordinates) {
                minX = Math.min(minX, sys.coordinates[0]);
                maxX = Math.max(maxX, sys.coordinates[0]);
                minY = Math.min(minY, sys.coordinates[1]);
                maxY = Math.max(maxY, sys.coordinates[1]);
            }
        });

        region.bounds = {
            minX, maxX, minY, maxY,
            width: maxX - minX,
            height: maxY - minY,
            centerX: (minX + maxX) / 2,
            centerY: (minY + maxY) / 2
        };
    }

    init() {
        this.setupCanvas();
        this.calculateMapBounds();
        this.centerAndScaleMap();
        this.setupEventListeners();
        // Don't render or start animation here - wait for ConquestManager to be initialized first
        // Animation will be started by the first render() call from app.js
        // this.render(); // Removed - render() will be called from app.js after conquestManager is ready
        // this.startAnimationLoop(); // Moved - will be started on first render

        console.log('[RegionMap] Initialized with', this.systems.length, 'systems in', this.regions.length, 'regions');
        console.log('[RegionMap] Total warp lanes:', this.warpLanes.length);
    }

    startAnimationLoop() {
        let lastRenderTime = 0;
        const targetFPS = 30; // Reduce from 60 FPS to 30 FPS for better performance
        const frameInterval = 1000 / targetFPS;

        const animate = (currentTime) => {
            const elapsed = currentTime - lastRenderTime;

            // Only render at target FPS (30 FPS instead of 60)
            if (elapsed > frameInterval) {
                this.animationPhase += 0.02;
                if (this.animationPhase > Math.PI * 2) {
                    this.animationPhase -= Math.PI * 2;
                }

                // Only re-render if we have connections to animate
                if (this.showConnections || this.highlightConnections) {
                    this.render();
                }

                lastRenderTime = currentTime - (elapsed % frameInterval);
            }

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    setupCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight - 100; // Account for header
    }

    calculateMapBounds() {
        // Find the overall bounds of all systems
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        this.systems.forEach(sys => {
            if (sys.coordinates) {
                minX = Math.min(minX, sys.coordinates[0]);
                maxX = Math.max(maxX, sys.coordinates[0]);
                minY = Math.min(minY, sys.coordinates[1]);
                maxY = Math.max(maxY, sys.coordinates[1]);
            }
        });

        this.mapBounds = {
            minX, maxX, minY, maxY,
            width: maxX - minX,
            height: maxY - minY,
            centerX: (minX + maxX) / 2,
            centerY: (minY + maxY) / 2
        };

        console.log('[RegionMap] Map bounds:', this.mapBounds);
    }

    centerAndScaleMap() {
        // Calculate appropriate zoom to fit all systems
        const padding = 50; // pixels of padding
        const availableWidth = this.canvas.width - (padding * 2);
        const availableHeight = this.canvas.height - (padding * 2);

        // Calculate zoom to fit
        const zoomX = availableWidth / this.mapBounds.width;
        const zoomY = availableHeight / this.mapBounds.height;
        this.camera.zoom = Math.min(zoomX, zoomY, 20); // Initial zoom, max 20x

        // Center the map
        this.camera.x = this.canvas.width / 2 - (this.mapBounds.centerX * this.camera.zoom);
        this.camera.y = this.canvas.height / 2 - (this.mapBounds.centerY * this.camera.zoom);

        console.log('[RegionMap] Initial camera:', this.camera);
    }

    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.onMouseClick(e));
        this.canvas.addEventListener('wheel', (e) => this.onMouseWheel(e));

        // Window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.render();
        });
    }

    onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;

        // Handle dragging
        if (this.mouse.down) {
            const dx = this.mouse.x - this.mouse.dragStart.x;
            const dy = this.mouse.y - this.mouse.dragStart.y;
            this.camera.x += dx;
            this.camera.y += dy;
            this.mouse.dragStart = { x: this.mouse.x, y: this.mouse.y };
            this.render();
        } else {
            // Check for hover
            const worldPos = this.screenToWorld(this.mouse.x, this.mouse.y);
            const hoveredSystem = this.getSystemAt(worldPos.x, worldPos.y);

            if (hoveredSystem !== this.hoveredSystem) {
                this.hoveredSystem = hoveredSystem;
                this.canvas.style.cursor = hoveredSystem ? 'pointer' : 'default';
                this.render();
            }
        }
    }

    onMouseDown(e) {
        this.mouse.down = true;
        this.mouse.dragStart = { x: this.mouse.x, y: this.mouse.y };
        this.canvas.style.cursor = 'grabbing';
    }

    onMouseUp(e) {
        this.mouse.down = false;
        this.canvas.style.cursor = this.hoveredSystem ? 'pointer' : 'default';
    }

    onMouseClick(e) {
        if (this.hoveredSystem) {
            this.selectSystem(this.hoveredSystem);
        }
    }

    onMouseWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = this.camera.zoom * delta;

        // Limit zoom - allow much more zoom in for detailed region viewing
        if (newZoom >= 0.3 && newZoom <= 200) {
            // If we have a zoom center (last clicked system), zoom toward it
            if (this.zoomCenter) {
                // Get the screen position of the zoom center before zoom
                const centerScreenBefore = this.worldToScreen(this.zoomCenter.x, this.zoomCenter.y);

                // Apply the zoom
                this.camera.zoom = newZoom;

                // Get the screen position of the zoom center after zoom
                const centerScreenAfter = this.worldToScreen(this.zoomCenter.x, this.zoomCenter.y);

                // Adjust camera to keep the zoom center in the same screen position
                this.camera.x += centerScreenBefore.x - centerScreenAfter.x;
                this.camera.y += centerScreenBefore.y - centerScreenAfter.y;
            } else {
                // No zoom center, just apply zoom
                this.camera.zoom = newZoom;
            }

            this.render();
        }
    }

    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.camera.x) / this.camera.zoom,
            y: -(screenY - this.camera.y) / this.camera.zoom // Flip Y-axis
        };
    }

    worldToScreen(worldX, worldY) {
        return {
            x: worldX * this.camera.zoom + this.camera.x,
            y: -worldY * this.camera.zoom + this.camera.y // Flip Y-axis (negative Y goes down)
        };
    }

    getSystemAt(worldX, worldY) {
        const clickRadius = 10 / this.camera.zoom; // Adjust for zoom

        for (const sys of this.systems) {
            if (!sys.coordinates) continue;

            const dx = worldX - sys.coordinates[0];
            const dy = worldY - sys.coordinates[1];
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < clickRadius) {
                return sys;
            }
        }
        return null;
    }

    selectSystem(system) {
        this.selectedSystem = system;

        // Set zoom center to this system's position (in world coordinates)
        if (system.coordinates) {
            this.zoomCenter = {
                x: system.coordinates[0],
                y: system.coordinates[1]
            };
        }

        this.render();

        // Trigger custom event with the system's region
        const region = this.regions.find(r => r.id === system.regionId);
        const event = new CustomEvent('regionSelected', { detail: { system, region } });
        window.dispatchEvent(event);
    }

    resetView() {
        this.centerAndScaleMap();
        this.render();
    }

    render() {
        // Start animation loop on first render (after ConquestManager is ready)
        if (!this.animationStarted) {
            this.animationStarted = true;
            this.startAnimationLoop();
            console.log('[RegionMap] Animation loop started on first render');
        }

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas
        ctx.fillStyle = '#0c1123';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        this.drawGrid();

        // Draw connections first (underneath everything)
        if (this.showConnections) {
            this.drawConnections();
        }

        // Draw region boundaries
        this.drawRegionBoundaries();

        // Draw all systems
        this.drawSystems();

        // Draw region labels (always shown for clusters)
        this.drawRegionLabels();

        // Draw system labels if enabled
        if (this.showLabels) {
            this.drawSystemLabels();
        }
    }

    drawConnections() {
        const ctx = this.ctx;

        // If highlight mode is on and a system is selected, only show its connections
        if (this.highlightConnections && this.selectedSystem) {
            this.drawHighlightedConnections();
            return;
        }

        // Viewport bounds for culling (only draw visible connections)
        const viewportPadding = 100; // Extra padding to avoid pop-in
        const minX = -viewportPadding;
        const maxX = this.canvas.width + viewportPadding;
        const minY = -viewportPadding;
        const maxY = this.canvas.height + viewportPadding;

        // Draw all connections with appropriate styling
        let drawnCount = 0;
        let culledCount = 0;

        this.warpLanes.forEach(lane => {
            const fromSystem = this.systems.find(s => s.id === lane.fromSystemId);
            const toSystem = this.systems.find(s => s.id === lane.toSystemId);

            if (fromSystem && toSystem && fromSystem.coordinates && toSystem.coordinates) {
                const from = this.worldToScreen(fromSystem.coordinates[0], fromSystem.coordinates[1]);
                const to = this.worldToScreen(toSystem.coordinates[0], toSystem.coordinates[1]);

                // Viewport culling - skip connections completely outside viewport
                if ((from.x < minX && to.x < minX) ||
                    (from.x > maxX && to.x > maxX) ||
                    (from.y < minY && to.y < minY) ||
                    (from.y > maxY && to.y > maxY)) {
                    culledCount++;
                    return; // Skip this connection
                }

                drawnCount++;

                // Check if this is an intra-region or inter-region connection
                const sameRegion = fromSystem.regionId === toSystem.regionId;

                // Check if this connection involves the selected system
                const isSelectedConnection = this.selectedSystem &&
                    (fromSystem.id === this.selectedSystem.id || toSystem.id === this.selectedSystem.id);

                if (isSelectedConnection) {
                    // Selected system connections - bright glowing effect
                    const pulse = Math.sin(this.animationPhase) * 0.3 + 0.7;
                    ctx.strokeStyle = `rgba(0, 204, 255, ${pulse * 0.8})`;
                    ctx.lineWidth = 2.5;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = 'rgba(0, 204, 255, 0.6)';
                } else if (sameRegion) {
                    // Intra-region connection (within cluster) - brighter cyan
                    ctx.strokeStyle = 'rgba(100, 255, 218, 0.3)';
                    ctx.lineWidth = 1;
                    ctx.shadowBlur = 0;
                } else {
                    // Inter-region connection (between clusters) - dimmer cyan
                    ctx.strokeStyle = 'rgba(100, 255, 218, 0.1)';
                    ctx.lineWidth = 0.5;
                    ctx.shadowBlur = 0;
                }

                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.stroke();

                // Reset shadow
                ctx.shadowBlur = 0;

                // Draw animated particles on selected connections
                if (isSelectedConnection) {
                    this.drawConnectionParticles(from, to);
                }
            }
        });
    }

    drawHighlightedConnections() {
        const ctx = this.ctx;

        if (!this.selectedSystem || !this.selectedSystem.links) return;

        // Get all systems connected to the selected one
        const connectedSystemIds = new Set();

        // Find lanes connected to selected system
        this.warpLanes.forEach(lane => {
            if (lane.fromSystemId === this.selectedSystem.id) {
                connectedSystemIds.add(lane.toSystemId);
            } else if (lane.toSystemId === this.selectedSystem.id) {
                connectedSystemIds.add(lane.fromSystemId);
            }
        });

        // Dim all non-connected systems
        this.systems.forEach(sys => {
            if (!sys.coordinates) return;
            if (sys.id === this.selectedSystem.id || connectedSystemIds.has(sys.id)) return;

            const pos = this.worldToScreen(sys.coordinates[0], sys.coordinates[1]);

            // Draw dimmed overlay
            ctx.fillStyle = 'rgba(12, 17, 35, 0.6)';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw connection lines
        this.warpLanes.forEach(lane => {
            if (lane.fromSystemId !== this.selectedSystem.id && lane.toSystemId !== this.selectedSystem.id) {
                return;
            }

            const fromSystem = this.systems.find(s => s.id === lane.fromSystemId);
            const toSystem = this.systems.find(s => s.id === lane.toSystemId);

            if (fromSystem && toSystem && fromSystem.coordinates && toSystem.coordinates) {
                const from = this.worldToScreen(fromSystem.coordinates[0], fromSystem.coordinates[1]);
                const to = this.worldToScreen(toSystem.coordinates[0], toSystem.coordinates[1]);

                // Check if this is an intra-region or inter-region connection
                const sameRegion = fromSystem.regionId === toSystem.regionId;

                // Animated glowing effect
                const pulse = Math.sin(this.animationPhase) * 0.3 + 0.7;

                if (sameRegion) {
                    // Same region - cyan/blue
                    ctx.strokeStyle = `rgba(100, 255, 218, ${pulse * 0.9})`;
                    ctx.lineWidth = 3;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'rgba(100, 255, 218, 0.8)';
                } else {
                    // Different region - purple/magenta
                    ctx.strokeStyle = `rgba(255, 100, 255, ${pulse * 0.9})`;
                    ctx.lineWidth = 3;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'rgba(255, 100, 255, 0.8)';
                }

                // Draw curved line for visual interest
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);

                // Calculate control point for curve
                const midX = (from.x + to.x) / 2;
                const midY = (from.y + to.y) / 2;
                const dx = to.x - from.x;
                const dy = to.y - from.y;
                const perpX = -dy * 0.1;
                const perpY = dx * 0.1;

                ctx.quadraticCurveTo(midX + perpX, midY + perpY, to.x, to.y);
                ctx.stroke();

                // Reset shadow
                ctx.shadowBlur = 0;

                // Draw animated particles
                this.drawConnectionParticles(from, to, sameRegion);
            }
        });
    }

    drawConnectionParticles(from, to, sameRegion = true) {
        const ctx = this.ctx;
        const particleCount = 3; // Reduced from 5 to 3 for 40% less particle rendering

        for (let i = 0; i < particleCount; i++) {
            // Stagger particles along the line
            const offset = (this.animationPhase + (i * Math.PI * 2 / particleCount)) % (Math.PI * 2);
            const t = (Math.sin(offset) + 1) / 2; // Convert to 0-1 range

            const x = from.x + (to.x - from.x) * t;
            const y = from.y + (to.y - from.y) * t;

            // Particle color based on connection type
            const color = sameRegion ? 'rgba(100, 255, 218, 0.8)' : 'rgba(255, 100, 255, 0.8)';

            ctx.fillStyle = color;
            ctx.shadowBlur = 3; // Reduced from 5 for better performance
            ctx.shadowColor = color;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    drawSystems() {
        const ctx = this.ctx;

        this.systems.forEach(sys => {
            if (!sys.coordinates) return;

            const pos = this.worldToScreen(sys.coordinates[0], sys.coordinates[1]);

            // Base radius scales with zoom but has min/max - smaller circles
            let radius;
            if (this.camera.zoom < 10) {
                radius = Math.max(1.5, Math.min(5, 2 * this.camera.zoom));
            } else {
                // At high zoom, allow radius to grow more but keep smaller
                radius = Math.max(5, Math.min(12, 0.3 * this.camera.zoom + 2));
            }

            // King and Core systems are larger
            const isKing = sys.type === 'King';
            const isCore = sys.type === 'Core';

            if (isKing) {
                radius *= 1.3; // Reduced from 2x to 1.3x
            } else if (isCore) {
                radius *= 1.2; // Reduced from 1.5x to 1.2x
            }

            // Determine color (use controlling faction if conquest mode is active)
            const faction = sys.controllingFaction || sys.originalFaction || 'neutral';
            const baseColor = this.colors[faction] || this.colors.neutral;

            // Highlight if selected or hovered
            let alpha = 0.7;
            if (this.selectedSystem === sys) {
                alpha = 1.0;
                radius *= 1.5;
            } else if (this.hoveredSystem === sys) {
                alpha = 0.9;
                radius *= 1.2;
            }

            // Draw system dot
            ctx.fillStyle = this.hexToRgba(baseColor, alpha);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            ctx.fill();

            // Draw special indicators for King and Core systems
            if (isKing) {
                // Draw crown icon for King systems - ABOVE the system circle
                ctx.save();
                ctx.translate(pos.x, pos.y - radius - 3); // Position above the circle

                // Smaller crown to match reduced King system size
                const crownScale = Math.max(1.0, radius / 5);
                ctx.scale(crownScale, crownScale);

                ctx.fillStyle = '#ffd700'; // Gold
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1.0;

                // Simple crown shape
                ctx.beginPath();
                ctx.moveTo(-6, 3);
                ctx.lineTo(-4, -3);
                ctx.lineTo(-2, 1);
                ctx.lineTo(0, -5);
                ctx.lineTo(2, 1);
                ctx.lineTo(4, -3);
                ctx.lineTo(6, 3);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.restore();
            } else if (isCore) {
                // Draw star icon for Core systems - ABOVE the system circle
                ctx.save();
                ctx.translate(pos.x, pos.y - radius - 3); // Position above the circle

                ctx.fillStyle = '#ffffff'; // White
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 0.8;

                const starRadius = Math.max(3, radius * 0.8); // Larger star
                const points = 5;
                ctx.beginPath();
                for (let i = 0; i < points * 2; i++) {
                    const angle = (i * Math.PI) / points - Math.PI / 2;
                    const r = i % 2 === 0 ? starRadius : starRadius * 0.4;
                    const x = Math.cos(angle) * r;
                    const y = Math.sin(angle) * r;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.restore();
            }

            // Draw border for selected/hovered
            if (this.selectedSystem === sys) {
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
                ctx.stroke();
            } else if (this.hoveredSystem === sys) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
    }

    drawGrid() {
        const ctx = this.ctx;
        const gridSize = 1; // World units
        const bounds = this.mapBounds;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 0.5;

        // Vertical lines
        for (let x = Math.floor(bounds.minX); x <= Math.ceil(bounds.maxX); x += gridSize) {
            const top = this.worldToScreen(x, bounds.maxY);
            const bottom = this.worldToScreen(x, bounds.minY);
            ctx.beginPath();
            ctx.moveTo(top.x, top.y);
            ctx.lineTo(bottom.x, bottom.y);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = Math.floor(bounds.minY); y <= Math.ceil(bounds.maxY); y += gridSize) {
            const left = this.worldToScreen(bounds.minX, y);
            const right = this.worldToScreen(bounds.maxX, y);
            ctx.beginPath();
            ctx.moveTo(left.x, left.y);
            ctx.lineTo(right.x, right.y);
            ctx.stroke();
        }
    }

    drawRegionBoundaries() {
        const ctx = this.ctx;

        this.regions.forEach(region => {
            if (region.systems.length === 0) return;

            const faction = region.originalFaction || 'neutral';
            const baseColor = this.colors[faction] || this.colors.neutral;

            // Use cached convex hull if available
            let hull = this.regionHullCache.get(region.id);

            if (!hull) {
                // Calculate and cache convex hull
                const points = region.systems
                    .filter(sys => sys.coordinates)
                    .map(sys => ({ x: sys.coordinates[0], y: sys.coordinates[1] }));

                if (points.length < 3) {
                    // Not enough points for a hull, skip
                    return;
                }

                hull = this.convexHull(points);

                if (hull.length < 3) return;

                // Cache the hull (it never changes)
                this.regionHullCache.set(region.id, hull);
            }

            // Check if this region is SAFE (requires conquest manager)
            let isSafe = false;
            let isConquered = false;
            if (window.regionMapApp && window.regionMapApp.conquestManager) {
                const regionStatus = window.regionMapApp.conquestManager.getRegionStatus(region.id);
                if (regionStatus) {
                    isSafe = regionStatus.status === 'SAFE';
                    isConquered = regionStatus.faction && regionStatus.faction !== region.originalFaction;
                }
            }

            // Build the path once
            ctx.beginPath();

            // Convert first point to screen coordinates and move to it
            const firstPoint = this.worldToScreen(hull[0].x, hull[0].y);
            ctx.moveTo(firstPoint.x, firstPoint.y);

            // Draw lines to each subsequent hull point
            for (let i = 1; i < hull.length; i++) {
                const point = this.worldToScreen(hull[i].x, hull[i].y);
                ctx.lineTo(point.x, point.y);
            }

            // Close the path back to the first point
            ctx.closePath();

            // Fill the region first
            if (isSafe) {
                ctx.fillStyle = this.hexToRgba(baseColor, 0.15);
            } else if (isConquered) {
                ctx.fillStyle = this.hexToRgba(baseColor, 0.08);
            } else {
                ctx.fillStyle = this.hexToRgba(baseColor, 0.05);
            }
            ctx.fill();

            // Draw border - SAFE regions get special multi-layer treatment
            if (isSafe) {
                // Layer 1: Thick dark outline for contrast (reduced intensity)
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)'; // Reduced from 0.8 to 0.4
                ctx.lineWidth = 7; // Reduced from 14 to 7
                ctx.shadowBlur = 0;
                ctx.stroke();

                // Layer 2: Green with subtle glow (reduced intensity by half)
                ctx.strokeStyle = 'rgba(0, 255, 100, 0.5)'; // Reduced from 1.0 to 0.5
                ctx.lineWidth = 5; // Reduced from 10 to 5
                ctx.shadowBlur = 6; // Reduced from 12 to 6
                ctx.shadowColor = 'rgba(0, 255, 100, 0.4)'; // Reduced from 0.8 to 0.4
                ctx.stroke();

                // Skip Layer 3 - two layers are enough and saves ~33% rendering cost
            } else if (isConquered) {
                // Conquered regions use controlling faction color
                ctx.strokeStyle = this.hexToRgba(baseColor, 0.6);
                ctx.lineWidth = 3;
                ctx.shadowBlur = 0;
                ctx.stroke();
            } else {
                // Default styling
                ctx.strokeStyle = this.hexToRgba(baseColor, 0.4);
                ctx.lineWidth = 2;
                ctx.shadowBlur = 0;
                ctx.stroke();
            }

            // Reset shadow
            ctx.shadowBlur = 0;
        });
    }

    // Convex hull algorithm (Graham scan)
    convexHull(points) {
        if (points.length < 3) return points;

        // Sort points by x, then by y
        const sorted = points.slice().sort((a, b) => {
            if (a.x !== b.x) return a.x - b.x;
            return a.y - b.y;
        });

        // Build lower hull
        const lower = [];
        for (const p of sorted) {
            while (lower.length >= 2 && this.cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
                lower.pop();
            }
            lower.push(p);
        }

        // Build upper hull
        const upper = [];
        for (let i = sorted.length - 1; i >= 0; i--) {
            const p = sorted[i];
            while (upper.length >= 2 && this.cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
                upper.pop();
            }
            upper.push(p);
        }

        // Remove the last point of each half because it's repeated
        lower.pop();
        upper.pop();

        // Concatenate lower and upper hull
        return lower.concat(upper);
    }

    // Cross product of vectors OA and OB where O, A, B are points
    cross(o, a, b) {
        return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    }

    drawRegionLabels() {
        const ctx = this.ctx;

        this.regions.forEach(region => {
            if (!region.bounds || region.systems.length === 0) return;

            const faction = region.originalFaction || 'neutral';
            const baseColor = this.colors[faction] || this.colors.neutral;

            // Position label at top-left of region boundary
            const padding = 0.3;
            const labelPos = this.worldToScreen(
                region.bounds.minX - padding,
                region.bounds.maxY + padding
            );

            // Draw label background
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            const textMetrics = ctx.measureText(region.name);
            const textWidth = textMetrics.width;
            const textHeight = 14;

            ctx.fillStyle = 'rgba(12, 17, 35, 0.8)';
            ctx.fillRect(labelPos.x - 2, labelPos.y - textHeight, textWidth + 4, textHeight + 2);

            // Draw label text
            ctx.fillStyle = baseColor;
            ctx.fillText(region.name, labelPos.x, labelPos.y);
        });
    }

    drawSystemLabels() {
        const ctx = this.ctx;

        // Only draw system labels when zoomed in enough
        if (this.camera.zoom < 5) return;

        this.systems.forEach(sys => {
            if (!sys.coordinates) return;

            const pos = this.worldToScreen(sys.coordinates[0], sys.coordinates[1]);

            // Draw label next to system
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '10px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(sys.name, pos.x + 8, pos.y);
        });
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    setShowConnections(value) {
        this.showConnections = value;
        this.render();
    }

    setShowLabels(value) {
        this.showLabels = value;
        this.render();
    }

    setHighlightConnections(value) {
        this.highlightConnections = value;
        this.render();
    }
}

window.RegionMap = RegionMap;
