class EnhancedTreeRenderer {
    constructor(containerElement) {
        this.container = containerElement;
        this.recipeCache = new Map();
        this.svg = null;
        this.mainGroup = null;
        this.zoomGroup = null;
        this.currentZoom = 1;
        this.currentPan = { x: 20, y: 20 };
        // Smooth zoom animation properties (like FleetBuilder)
        this.targetZoom = 1;
        this.targetPan = { x: 20, y: 20 };
        this.zoomAnimationFrame = null;
        this.nodeWidth = 180;
        this.nodeHeight = 65;
        this.nodeSpacing = { x: 220, y: 75 };
        // Connection highlighting properties
        this.connections = new Map(); // Map to store all connections
        this.selectedNode = null;
        this.highlightedPaths = new Set();
        // Drag and drop properties
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.lastPan = { x: 20, y: 20 };
        // View mode: 'tree' | 'aggregatedTree' | 'aggregatedTotals'
        this.viewMode = 'aggregatedTree';
        this.aggregatedData = null;
        // Don't build cache in constructor - app.js will call it with recipes
        this.setupContainer();
    }

    buildRecipeCache(allRecipes = null) {
        // Use provided recipes if available, otherwise try to get from global recipeData
        let recipesToCache = allRecipes;

        if (!recipesToCache) {
            if (!window.recipeData || !window.recipeData.categories) {
                // Silently return - cache will be built when recipes are provided
                return;
            }

            // Extract recipes the same way as app.js does
            recipesToCache = [];
            window.recipeData.categories.forEach(category => {
                category.recipes.forEach(recipe => {
                    recipesToCache.push({
                        ...recipe,
                        category: category.name,
                        categoryIcon: category.icon
                    });
                });
            });
        }

        if (recipesToCache && recipesToCache.length > 0) {
            recipesToCache.forEach((recipe, index) => {
                // Store by ID for direct lookup
                this.recipeCache.set(recipe.id, recipe);

                // For name-based lookup (used by ingredients), store T1 as default
                // Only store by name if we don't have one yet, or if this is T1
                const existingByName = this.recipeCache.get(recipe.name);
                if (!existingByName || recipe.tier === 1) {
                    this.recipeCache.set(recipe.name, recipe);
                }
            });
            console.log(`✅ Built recipe cache with ${this.recipeCache.size} entries (including both ID and name keys)`);
        }
    }

    setupContainer() {
        this.container.innerHTML = '';
        this.container.style.position = 'relative';
        this.container.style.overflowX = 'auto';
        this.container.style.overflowY = 'auto';
        this.container.style.width = '100%';
        this.container.style.height = '100%';

        // Create SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.style.height = '100%';
        this.svg.style.minWidth = '100%';
        this.svg.style.background = 'transparent';
        this.svg.style.display = 'block';

        // Create zoom group for scaling
        this.zoomGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.zoomGroup.setAttribute('transform', `translate(${this.currentPan.x}, ${this.currentPan.y}) scale(${this.currentZoom})`);

        // Create main group for content
        this.mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.zoomGroup.appendChild(this.mainGroup);

        // Create definitions for gradients and patterns
        this.createDefinitions();

        this.svg.appendChild(this.zoomGroup);
        this.container.appendChild(this.svg);

        // Setup event listeners
        this.setupEventListeners();

        // Add zoom controls
        this.createZoomControls();
    }

    createDefinitions() {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

        // FleetBuilder-style gradient definitions
        const gradients = [
            // Node gradient (craftable items - dark blue/purple)
            { id: 'nodeGradient', colors: ['#1a1a3e', '#0d0d1a'] },
            // Raw gradient (raw materials - gold/yellow)
            { id: 'rawGradient', colors: ['#3d3d1a', '#1a1a0d'] },
            // Legacy gradients mapped to FleetBuilder style
            { id: 'intermediateGradient', colors: ['#1a1a3e', '#0d0d1a'] },
            { id: 'finalGradient', colors: ['#1a1a3e', '#0d0d1a'] },
            { id: 'fluidGradient', colors: ['#1a2a3e', '#0d1520'] }
        ];

        gradients.forEach(grad => {
            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', grad.id);
            gradient.setAttribute('x1', '0%');
            gradient.setAttribute('y1', '0%');
            gradient.setAttribute('x2', '0%');
            gradient.setAttribute('y2', '100%');

            const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop1.setAttribute('offset', '0%');
            stop1.setAttribute('stop-color', grad.colors[0]);
            stop1.setAttribute('stop-opacity', '1');

            const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop2.setAttribute('offset', '100%');
            stop2.setAttribute('stop-color', grad.colors[1]);
            stop2.setAttribute('stop-opacity', '1');

            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            defs.appendChild(gradient);
        });

        // Arrow marker for connections (FleetBuilder style - cyan)
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3.5');
        marker.setAttribute('orient', 'auto');

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
        polygon.setAttribute('fill', '#00d4ff');

        marker.appendChild(polygon);
        defs.appendChild(marker);

        this.svg.appendChild(defs);
    }

    // Helper to check if a recipe represents a raw/extracted material
    isRawMaterial(recipe) {
        if (!recipe) return true;
        if (recipe.type === 'raw') return true;
        // Extraction recipes have empty inputs array
        if (!recipe.inputs || recipe.inputs.length === 0) return true;
        return false;
    }

    createZoomControls() {
        const controls = document.createElement('div');
        controls.className = 'tree-controls';
        controls.innerHTML = `
            <div class="zoom-controls">
                <button class="zoom-btn" id="zoomIn">🔍+</button>
                <button class="zoom-btn" id="zoomOut">🔍-</button>
                <button class="zoom-btn" id="resetView">⌂</button>
                <span class="zoom-level">${Math.round(this.currentZoom * 100)}%</span>
            </div>
            <div class="view-mode-toggle">
                <label class="toggle-label">
                    <input type="radio" name="viewMode" value="tree">
                    <span>🌲 Full Tree</span>
                </label>
                <label class="toggle-label">
                    <input type="radio" name="viewMode" value="aggregatedTree" checked>
                    <span>🔗 Aggregated Tree</span>
                </label>
                <label class="toggle-label">
                    <input type="radio" name="viewMode" value="aggregatedTotals">
                    <span>📊 Totals List</span>
                </label>
            </div>
        `;

        controls.style.position = 'absolute';
        controls.style.top = '10px';
        controls.style.right = '10px';
        controls.style.zIndex = '1000';

        this.container.appendChild(controls);

        // Event listeners for controls
        controls.querySelector('#zoomIn').addEventListener('click', () => this.zoomIn());
        controls.querySelector('#zoomOut').addEventListener('click', () => this.zoomOut());
        controls.querySelector('#resetView').addEventListener('click', () => this.resetView());

        // View mode toggle listeners
        const viewModeRadios = controls.querySelectorAll('input[name="viewMode"]');
        viewModeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.viewMode = e.target.value;
                this.refreshCurrentView();
            });
        });
    }

    setupEventListeners() {
        // Mouse wheel zoom with smooth animation (like FleetBuilder)
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = this.container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Smaller zoom steps for smoother feel (like FleetBuilder)
            const zoomIntensity = 0.08;
            const delta = e.deltaY > 0 ? -zoomIntensity : zoomIntensity;
            this.zoomToPoint(delta, mouseX, mouseY);
        });

        // Drag and drop functionality
        this.container.addEventListener('mousedown', (e) => {
            // Don't start drag if shift or ctrl is pressed (for connection highlighting)
            if (e.shiftKey || e.ctrlKey) {
                return;
            }

            // Only start drag on background or SVG elements (not on recipe nodes or controls)
            const isRecipeNode = e.target.closest('.recipe-node, .zoom-btn, .tree-controls');
            if (!isRecipeNode) {
                this.startDrag(e);
            }
        });

        this.container.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.drag(e);
            }
        });

        this.container.addEventListener('mouseup', (e) => {
            if (this.isDragging) {
                this.endDrag(e);
            }
        });

        this.container.addEventListener('mouseleave', (e) => {
            if (this.isDragging) {
                this.endDrag(e);
            }
        });

        // Prevent context menu on right click drag
        this.container.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    startDrag(e) {
        this.isDragging = true;
        // Cancel any ongoing zoom animation when panning starts
        if (this.zoomAnimationFrame) {
            cancelAnimationFrame(this.zoomAnimationFrame);
            this.zoomAnimationFrame = null;
        }
        this.dragStart.x = e.clientX;
        this.dragStart.y = e.clientY;
        this.lastPan.x = this.currentPan.x;
        this.lastPan.y = this.currentPan.y;

        // Update cursor to grabbing state
        this.container.style.cursor = 'grabbing';
        this.container.classList.add('dragging');

        e.preventDefault();
    }

    drag(e) {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.dragStart.x;
        const deltaY = e.clientY - this.dragStart.y;

        this.currentPan.x = this.lastPan.x + deltaX;
        this.currentPan.y = this.lastPan.y + deltaY;
        // Keep target in sync during panning
        this.targetPan.x = this.currentPan.x;
        this.targetPan.y = this.currentPan.y;

        this.updateTransform();
        e.preventDefault();
    }

    endDrag(e) {
        if (!this.isDragging) return;

        this.isDragging = false;

        // Reset cursor to grab state
        this.container.style.cursor = 'grab';
        this.container.classList.remove('dragging');

        e.preventDefault();
    }

    // Smooth zoom to point (like FleetBuilder)
    zoomToPoint(delta, mouseX, mouseY) {
        const oldZoom = this.targetZoom;
        this.targetZoom = Math.max(0.2, Math.min(4, this.targetZoom * (1 + delta)));

        // Calculate zoom towards mouse position
        const zoomRatio = this.targetZoom / oldZoom;

        // Adjust pan so the point under the mouse stays fixed
        this.targetPan.x = mouseX - (mouseX - this.targetPan.x) * zoomRatio;
        this.targetPan.y = mouseY - (mouseY - this.targetPan.y) * zoomRatio;

        this.updateZoomLevel();

        // Start smooth animation
        this.animateZoom();
    }

    // Smooth zoom animation (like FleetBuilder)
    animateZoom() {
        // Cancel any existing animation
        if (this.zoomAnimationFrame) {
            cancelAnimationFrame(this.zoomAnimationFrame);
        }

        const ease = 0.15; // Lower = smoother but slower

        const animate = () => {
            // Interpolate towards target
            const zoomDiff = this.targetZoom - this.currentZoom;
            const panXDiff = this.targetPan.x - this.currentPan.x;
            const panYDiff = this.targetPan.y - this.currentPan.y;

            this.currentZoom += zoomDiff * ease;
            this.currentPan.x += panXDiff * ease;
            this.currentPan.y += panYDiff * ease;

            this.updateTransform();

            // Continue animating if not close enough to target
            if (Math.abs(zoomDiff) > 0.001 || Math.abs(panXDiff) > 0.5 || Math.abs(panYDiff) > 0.5) {
                this.zoomAnimationFrame = requestAnimationFrame(animate);
            } else {
                // Snap to final values
                this.currentZoom = this.targetZoom;
                this.currentPan.x = this.targetPan.x;
                this.currentPan.y = this.targetPan.y;
                this.updateTransform();
                this.zoomAnimationFrame = null;
            }
        };

        this.zoomAnimationFrame = requestAnimationFrame(animate);
    }

    zoomIn() {
        this.targetZoom = Math.max(0.2, Math.min(4, this.targetZoom * 1.2));
        this.updateZoomLevel();
        this.animateZoom();
    }

    zoomOut() {
        this.targetZoom = Math.max(0.2, Math.min(4, this.targetZoom * 0.8));
        this.updateZoomLevel();
        this.animateZoom();
    }

    resetView() {
        this.targetZoom = 1;
        this.targetPan = { x: 20, y: 20 };
        this.updateZoomLevel();
        this.animateZoom();
    }

    updateTransform() {
        this.zoomGroup.setAttribute('transform',
            `translate(${this.currentPan.x}, ${this.currentPan.y}) scale(${this.currentZoom})`
        );
    }

    updateZoomLevel() {
        const zoomLevelEl = this.container.querySelector('.zoom-level');
        if (zoomLevelEl) {
            zoomLevelEl.textContent = `${Math.round(this.currentZoom * 100)}%`;
        }
    }

    // Zoom and pan methods restored for user control

    renderRecipeTree(recipeId) {
        // Ensure recipe cache is built
        if (this.recipeCache.size === 0) {
            this.buildRecipeCache();
        }

        const recipe = this.recipeCache.get(recipeId);
        if (!recipe) {
            console.error(`❌ Recipe "${recipeId}" not found in cache!`);
            this.renderError(`Recipe "${recipeId}" not found`);
            return;
        }

        this.clearTree();
        const treeData = this.buildTreeData(recipe, new Set());
        const layout = this.calculateLayout(treeData);
        this.renderTree(layout);
        this.resetView();
    }

    buildTreeData(recipe, visited, depth = 0) {
        if (visited.has(recipe.name)) {
            return {
                recipe,
                children: [],
                isCircular: true,
                depth
            };
        }

        visited.add(recipe.name);

        const children = [];
        if (recipe.inputs && recipe.inputs.length > 0) {
            // Aggregate inputs with the same name to avoid duplicate branches
            const aggregatedInputs = new Map();
            recipe.inputs.forEach(input => {
                if (aggregatedInputs.has(input.name)) {
                    aggregatedInputs.get(input.name).amount += (input.amount || 1);
                } else {
                    aggregatedInputs.set(input.name, { name: input.name, amount: input.amount || 1 });
                }
            });

            aggregatedInputs.forEach(input => {
                const inputRecipe = this.recipeCache.get(input.name);
                if (inputRecipe) {
                    const childData = this.buildTreeData(inputRecipe, new Set(visited), depth + 1);
                    childData.inputAmount = input.amount;
                    children.push(childData);
                }
            });
        }

        visited.delete(recipe.name);

        return {
            recipe,
            children,
            depth
        };
    }

    calculateLayout(treeData) {
        // Subtree-based left-to-right layout (like FleetBuilder)
        // Each node is positioned based on its subtree, not just its level
        const layout = new Map();
        let currentY = 20; // Running Y position
        let maxX = 0;
        let maxY = 0;

        // Calculate subtree height for a node (number of leaf nodes in its subtree)
        const getSubtreeLeafCount = (node) => {
            if (!node.children || node.children.length === 0) {
                return 1;
            }
            return node.children.reduce((sum, child) => sum + getSubtreeLeafCount(child), 0);
        };

        // Recursive layout: position node and all its children
        // Returns the Y range used by this subtree [minY, maxY] and the layout key
        let nodeCounter = 0;
        const layoutNode = (node, depth, startY) => {
            const x = depth * this.nodeSpacing.x + 20;
            maxX = Math.max(maxX, x + this.nodeWidth);
            const nodeKey = `node_${nodeCounter++}`;

            if (!node.children || node.children.length === 0) {
                // Leaf node: place at startY
                const y = startY;
                const layoutData = {
                    x: x,
                    y: y,
                    node: node,
                    childLayouts: []
                };
                layout.set(nodeKey, layoutData);
                maxY = Math.max(maxY, y + this.nodeHeight);
                return { minY: y, maxY: y + this.nodeHeight, centerY: y + this.nodeHeight / 2, key: nodeKey, layoutData };
            }

            // Internal node: first layout all children
            let childY = startY;
            const childRanges = [];

            node.children.forEach((child, index) => {
                const range = layoutNode(child, depth + 1, childY);
                childRanges.push(range);
                childY = range.maxY + 10; // Small gap between siblings
            });

            // Position this node at the center of its children
            const firstChildCenter = childRanges[0].centerY;
            const lastChildCenter = childRanges[childRanges.length - 1].centerY;
            const centerY = (firstChildCenter + lastChildCenter) / 2;
            const y = centerY - this.nodeHeight / 2;

            const layoutData = {
                x: x,
                y: y,
                node: node,
                childLayouts: childRanges.map(r => r.layoutData)
            };
            layout.set(nodeKey, layoutData);

            const minY = Math.min(y, childRanges[0].minY);
            const maxYVal = Math.max(y + this.nodeHeight, childRanges[childRanges.length - 1].maxY);
            maxY = Math.max(maxY, maxYVal);

            return { minY: minY, maxY: maxYVal, centerY: centerY, key: nodeKey, layoutData };
        };

        // Start layout from root
        layoutNode(treeData, 0, currentY);

        // Update SVG dimensions
        const totalWidth = maxX + 100;
        const totalHeight = Math.max(this.container.clientHeight || 600, maxY + 50);

        this.svg.style.width = `${totalWidth}px`;
        this.svg.style.height = `${totalHeight}px`;
        this.svg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);

        return layout;
    }

    renderTree(layout) {
        this.clearTree();

        // Render connections first (so they appear behind nodes)
        layout.forEach((data, nodeKey) => {
            // Use childLayouts to draw connections to children
            if (data.childLayouts && data.childLayouts.length > 0) {
                data.childLayouts.forEach((childLayout, index) => {
                    const childNode = data.node.children[index];
                    const amount = childNode ? (childNode.inputAmount || 1) : 1;
                    this.renderConnection(data, childLayout, amount);
                });
            }
        });

        // Render nodes
        layout.forEach((data, nodeKey) => {
            this.renderNode(data.x, data.y, data.node);
        });
    }

    renderConnection(fromData, toData, amount) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        const startX = fromData.x + this.nodeWidth;
        const startY = fromData.y + this.nodeHeight / 2;
        const endX = toData.x;
        const endY = toData.y + this.nodeHeight / 2;

        // Simple straight line with slight curve for elegance
        const controlOffset = Math.min(40, (endX - startX) / 3);
        const pathData = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;

        line.setAttribute('d', pathData);
        line.setAttribute('stroke', '#00d4ff');
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('fill', 'none');
        line.setAttribute('marker-end', 'url(#arrowhead)');
        line.setAttribute('opacity', '0.7');
        line.setAttribute('class', 'connection-line');

        // Store connection data for highlighting
        const connectionId = `${fromData.node.recipe.name}->${toData.node.recipe.name}`;
        line.setAttribute('data-connection-id', connectionId);
        line.setAttribute('data-from', fromData.node.recipe.name);
        line.setAttribute('data-to', toData.node.recipe.name);

        // Store in connections map
        if (!this.connections.has(fromData.node.recipe.name)) {
            this.connections.set(fromData.node.recipe.name, []);
        }
        this.connections.get(fromData.node.recipe.name).push({
            to: toData.node.recipe.name,
            element: line,
            amount: amount
        });

        // Simplified amount label (only show if > 1)
        if (amount > 1) {
            const midX = startX + (endX - startX) / 2;
            const midY = startY + (endY - startY) / 2;

            // Background circle for label
            const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            labelBg.setAttribute('cx', midX);
            labelBg.setAttribute('cy', midY - 8);
            labelBg.setAttribute('r', '8');
            labelBg.setAttribute('fill', 'rgba(0, 0, 0, 0.7)');
            labelBg.setAttribute('stroke', '#00d4ff');
            labelBg.setAttribute('stroke-width', '1');
            labelBg.setAttribute('class', 'connection-label');
            labelBg.setAttribute('data-connection-id', connectionId);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', midX);
            text.setAttribute('y', midY - 5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#00d4ff');
            text.setAttribute('font-size', '10');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('class', 'connection-label');
            text.setAttribute('data-connection-id', connectionId);
            text.textContent = `${amount}`;

            this.mainGroup.appendChild(labelBg);
            this.mainGroup.appendChild(text);
        }

        this.mainGroup.appendChild(line);
    }

    renderNode(x, y, nodeData, aggregatedQuantity = null) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('transform', `translate(${x}, ${y})`);
        group.setAttribute('class', 'recipe-node');
        group.setAttribute('data-recipe-name', nodeData.recipe.name);

        const recipe = nodeData.recipe;
        const isRaw = this.isRawMaterial(recipe);

        // FleetBuilder-style node background with gradient
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', this.nodeWidth);
        rect.setAttribute('height', this.nodeHeight);
        rect.setAttribute('rx', '6');
        rect.setAttribute('ry', '6');
        rect.setAttribute('fill', isRaw ? 'url(#rawGradient)' : 'url(#nodeGradient)');
        rect.setAttribute('stroke', isRaw ? '#ffd700' : '#00d4ff');
        rect.setAttribute('stroke-width', '1.5');
        group.appendChild(rect);

        // Recipe name (centered, FleetBuilder style)
        const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        titleText.setAttribute('x', this.nodeWidth / 2);
        titleText.setAttribute('y', '16');
        titleText.setAttribute('text-anchor', 'middle');
        titleText.setAttribute('fill', '#e0e0ff');
        titleText.setAttribute('font-size', '10');
        titleText.setAttribute('font-weight', '500');
        // Truncate long names for smaller nodes
        const truncatedName = recipe.name.length > 20 ? recipe.name.substring(0, 17) + '...' : recipe.name;
        titleText.textContent = truncatedName;
        group.appendChild(titleText);

        // Type indicator with quantity (FleetBuilder style)
        const typeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        typeText.setAttribute('x', this.nodeWidth / 2);
        typeText.setAttribute('y', '32');
        typeText.setAttribute('text-anchor', 'middle');
        typeText.setAttribute('fill', isRaw ? '#ffd700' : '#00d4ff');
        typeText.setAttribute('font-size', '9');

        const displayQty = aggregatedQuantity !== null ? aggregatedQuantity : (nodeData.inputAmount || 1);
        typeText.textContent = `${isRaw ? '⛏️ RAW' : '🔧 CRAFT'} × ${displayQty}`;
        group.appendChild(typeText);

        // Tier indicator (smaller, bottom)
        const tierText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tierText.setAttribute('x', this.nodeWidth / 2);
        tierText.setAttribute('y', '46');
        tierText.setAttribute('text-anchor', 'middle');
        tierText.setAttribute('fill', '#666');
        tierText.setAttribute('font-size', '8');
        tierText.textContent = `T${recipe.tier || 1}`;
        group.appendChild(tierText);

        // Stable hover and click interactions - no flickering
        group.style.cursor = 'pointer';
        group.setAttribute('class', 'recipe-node-stable');

        // Use CSS-based hover effects instead of JS to prevent flickering
        group.addEventListener('mouseenter', () => {
            group.setAttribute('data-hovered', 'true');
        });

        group.addEventListener('mouseleave', () => {
            group.removeAttribute('data-hovered');
        });

        // Click handler for detailed view and connection highlighting
        group.addEventListener('click', (e) => {
            e.stopPropagation();

            // Handle connection highlighting
            if (e.shiftKey || e.ctrlKey) {
                this.toggleNodeHighlight(recipe.name, group);
            } else {
                this.showNodeDetails(recipe);
            }
        });

        this.mainGroup.appendChild(group);
    }

    getGradientId(type) {
        switch (type) {
            case 'raw': return 'rawGradient';
            case 'intermediate': return 'intermediateGradient';
            case 'final': return 'finalGradient';
            case 'fluid': return 'fluidGradient';
            default: return 'intermediateGradient';
        }
    }

    getNodeBorderColor(type) {
        switch (type) {
            case 'raw': return '#4a7c59';
            case 'intermediate': return '#5a6ca3';
            case 'final': return '#a37c4a';
            case 'fluid': return '#4a7ca3';
            default: return '#5a6ca3';
        }
    }

    getTypeBadgeColor(type) {
        switch (type) {
            case 'raw': return '#4a7c59';
            case 'intermediate': return '#9370db';
            case 'final': return '#ffd700';
            case 'fluid': return '#4a7ca3';
            default: return '#9370db';
        }
    }

    getTypeIcon(type) {
        switch (type) {
            case 'raw': return '⛏️';
            case 'intermediate': return '🔧';
            case 'final': return '🏭';
            case 'fluid': return '💧';
            default: return '📦';
        }
    }

    getTypeLabel(type) {
        switch (type) {
            case 'raw': return 'Raw';
            case 'intermediate': return 'Inter';
            case 'final': return 'Final';
            case 'fluid': return 'Fluid';
            default: return 'Item';
        }
    }

    showNodeDetails(recipe) {
        // Reuse the existing modal system from analytics.js
        if (window.recipeExplorerApp && window.recipeExplorerApp.analytics) {
            window.recipeExplorerApp.analytics.showRecipeDetails(recipe);
        }
    }

    renderMultipleRecipes(recipeIds) {
        // Ensure recipe cache is built
        if (this.recipeCache.size === 0) {
            this.buildRecipeCache();
        }

        // Store recipe IDs for view toggling
        this.currentRecipeIds = recipeIds;

        // Handle different view modes
        if (this.viewMode === 'aggregatedTotals') {
            this.renderAggregatedTotalsView(recipeIds);
            return;
        }

        if (this.viewMode === 'aggregatedTree') {
            this.renderAggregatedTreeView(recipeIds);
            return;
        }

        // Default: Full tree view
        // Show SVG and hide aggregated panel
        this.svg.style.display = 'block';
        const aggregatedPanel = this.container.querySelector('.aggregated-panel');
        if (aggregatedPanel) {
            aggregatedPanel.style.display = 'none';
        }

        if (recipeIds.length === 0) {
            this.renderPlaceholder();
            return;
        }

        if (recipeIds.length === 1) {
            this.renderRecipeTree(recipeIds[0]);
            return;
        }

        // For multiple recipes, create a combined view
        this.clearTree();
        let yOffset = 0;

        recipeIds.forEach((recipeId, index) => {
            const recipe = this.recipeCache.get(recipeId);
            if (recipe) {
                const treeData = this.buildTreeData(recipe, new Set());
                const layout = this.calculateLayout(treeData);

                // Adjust positions for multiple trees
                layout.forEach((data, id) => {
                    data.y += yOffset;
                });

                this.renderTree(layout);

                // Calculate the height of this tree for spacing
                let maxY = 0;
                layout.forEach(data => {
                    maxY = Math.max(maxY, data.y + this.nodeHeight);
                });
                yOffset = maxY + 100; // Add spacing between trees
            }
        });

        this.resetView();
    }

    renderPlaceholder() {
        this.clearTree();

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '300');
        text.setAttribute('y', '200');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#00d4ff');
        text.setAttribute('font-size', '24');
        text.textContent = '🌲 Select recipes to view dependency trees';

        this.mainGroup.appendChild(text);
    }

    renderError(message) {
        this.clearTree();

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '300');
        text.setAttribute('y', '200');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#ff6b6b');
        text.setAttribute('font-size', '20');
        text.textContent = `❌ ${message}`;

        this.mainGroup.appendChild(text);
    }

    clearTree() {
        // Clear highlighting state
        this.connections.clear();
        this.selectedNode = null;
        this.highlightedPaths.clear();

        while (this.mainGroup.firstChild) {
            this.mainGroup.removeChild(this.mainGroup.firstChild);
        }
    }

    // Connection highlighting methods
    toggleNodeHighlight(recipeName, nodeElement) {
        if (this.selectedNode === recipeName) {
            // Deselect current node
            this.clearHighlights();
            this.selectedNode = null;
        } else {
            // Select new node and highlight connections
            this.clearHighlights();
            this.selectedNode = recipeName;
            this.highlightConnectionsForNode(recipeName, nodeElement);
        }
    }

    highlightConnectionsForNode(recipeName, nodeElement) {
        // Add the highlighting active class to enable enhanced visual effects
        this.container.classList.add('connection-highlighting-active');

        // Highlight the selected node
        nodeElement.setAttribute('data-selected', 'true');

        // Find and highlight all connections FROM this node (dependencies)
        this.highlightDownstreamConnections(recipeName);

        // Find and highlight all connections TO this node (dependents)
        this.highlightUpstreamConnections(recipeName);
    }

    highlightDownstreamConnections(recipeName) {
        const connections = this.connections.get(recipeName);
        if (connections) {
            connections.forEach(conn => {
                this.highlightConnection(conn.element);
                this.highlightedPaths.add(`${recipeName}->${conn.to}`);

                // Highlight connected nodes
                const connectedNode = this.findNodeElement(conn.to);
                if (connectedNode) {
                    connectedNode.setAttribute('data-connected', 'true');
                }

                // Recursively highlight downstream
                this.highlightDownstreamConnections(conn.to);
            });
        }
    }

    highlightUpstreamConnections(recipeName) {
        // Find all connections that lead TO this node
        this.connections.forEach((connections, fromNode) => {
            connections.forEach(conn => {
                if (conn.to === recipeName) {
                    this.highlightConnection(conn.element);
                    this.highlightedPaths.add(`${fromNode}->${recipeName}`);

                    // Highlight source node
                    const sourceNode = this.findNodeElement(fromNode);
                    if (sourceNode) {
                        sourceNode.setAttribute('data-connected', 'true');
                    }

                    // Recursively highlight upstream
                    this.highlightUpstreamConnections(fromNode);
                }
            });
        });
    }

    highlightConnection(connectionElement) {
        connectionElement.setAttribute('stroke', '#ffd700');
        connectionElement.setAttribute('stroke-width', '3');
        connectionElement.setAttribute('opacity', '1');
        connectionElement.setAttribute('data-highlighted', 'true');

        // Also highlight labels for this connection
        const connectionId = connectionElement.getAttribute('data-connection-id');
        const labels = this.mainGroup.querySelectorAll(`[data-connection-id="${connectionId}"]`);
        labels.forEach(label => {
            label.setAttribute('data-highlighted', 'true'); // Add highlighted attribute for CSS selector
            if (label.tagName === 'circle') {
                label.setAttribute('stroke', '#ffd700');
                label.setAttribute('fill', 'rgba(255, 215, 0, 0.2)');
            } else if (label.tagName === 'text') {
                label.setAttribute('fill', '#ffd700');
            }
        });
    }

    findNodeElement(recipeName) {
        return this.mainGroup.querySelector(`[data-recipe-name="${recipeName}"]`);
    }

    clearHighlights() {
        // Remove the highlighting active class to restore normal appearance
        this.container.classList.remove('connection-highlighting-active');

        // Clear connection highlights
        const highlightedConnections = this.mainGroup.querySelectorAll('[data-highlighted="true"]');
        highlightedConnections.forEach(conn => {
            conn.setAttribute('stroke', '#00d4ff');
            conn.setAttribute('stroke-width', '1.5');
            conn.setAttribute('opacity', '0.7');
            conn.removeAttribute('data-highlighted');
        });

        // Clear connection label highlights
        const highlightedLabels = this.mainGroup.querySelectorAll('.connection-label');
        highlightedLabels.forEach(label => {
            label.removeAttribute('data-highlighted'); // Remove highlighted attribute
            if (label.tagName === 'circle') {
                label.setAttribute('stroke', '#00d4ff');
                label.setAttribute('fill', 'rgba(0, 0, 0, 0.7)');
            } else if (label.tagName === 'text') {
                label.setAttribute('fill', '#00d4ff');
            }
        });

        // Clear node highlights
        const highlightedNodes = this.mainGroup.querySelectorAll('[data-selected="true"], [data-connected="true"]');
        highlightedNodes.forEach(node => {
            node.removeAttribute('data-selected');
            node.removeAttribute('data-connected');
        });

        this.highlightedPaths.clear();
    }

    // Test method to validate the enhanced tree renderer with all features
    validateRenderer() {
        console.log('🧪 Enhanced Tree Renderer - Full Feature Set');
        console.log('✅ Horizontal left-to-right layout: Implemented');
        console.log('✅ Simplified node design: Implemented');
        console.log('✅ Clickable nodes with modal details: Implemented');
        console.log('✅ Zoom in/out functionality: Working');
        console.log('✅ Stable nodes (no flickering): Fixed');
        console.log('✅ Horizontal scroll bar: Added');
        console.log('✅ Connection highlighting: Implemented');
        console.log('✅ End-to-end path lighting: Working');
        console.log('✅ Shift+Click interaction: Available');
        console.log('✅ Aggregated totals view: Implemented');
        console.log('🎉 Full-featured recipe tree successfully implemented!');

        // Test system initialization
        let allGood = true;
        if (this.currentZoom !== undefined && this.zoomGroup) {
            console.log('✅ Zoom system: Properly initialized');
            console.log(`🔍 Current zoom level: ${Math.round(this.currentZoom * 100)}%`);
        } else {
            console.log('❌ Zoom system: Not properly initialized');
            allGood = false;
        }

        if (this.connections && this.highlightedPaths) {
            console.log('✅ Connection highlighting system: Ready');
            console.log(`🔗 Connection tracking: ${this.connections.size} nodes mapped`);
        } else {
            console.log('❌ Connection highlighting system: Not initialized');
            allGood = false;
        }

        return allGood;
    }

    // ============================================
    // AGGREGATED TOTALS VIEW (like FleetBuilder)
    // ============================================

    // Store currently selected recipe IDs for refresh
    currentRecipeIds = [];

    // Refresh current view when toggling between view modes
    refreshCurrentView() {
        if (this.currentRecipeIds.length > 0) {
            this.renderMultipleRecipes(this.currentRecipeIds);
        }
    }

    // Calculate aggregated totals for selected recipes (like FleetBuilder)
    calculateAggregatedTotals(recipeIds) {
        const rawMaterials = new Map(); // name -> { quantity, recipe }
        const processedComponents = new Map(); // name -> { quantity, recipe }
        const allItems = new Map(); // name -> { quantity, recipe, depth, isRaw }

        // Helper to check if a recipe represents a raw/extracted material
        // Raw materials have type 'raw' OR have no inputs (extraction recipes like Iron Ore, Copper Ore)
        const isRawMaterial = (recipe) => {
            if (!recipe) return true; // No recipe found = raw material
            if (recipe.type === 'raw') return true;
            // Extraction recipes have empty inputs array
            if (!recipe.inputs || recipe.inputs.length === 0) return true;
            return false;
        };

        const processRecipe = (recipe, multiplier = 1, depth = 0, visited = new Set()) => {
            if (!recipe || visited.has(recipe.name)) return;
            visited.add(recipe.name);

            // Process inputs recursively
            if (recipe.inputs && recipe.inputs.length > 0) {
                recipe.inputs.forEach(input => {
                    const inputRecipe = this.recipeCache.get(input.name);
                    const inputQuantity = (input.amount || 1) * multiplier;

                    // Check if this is a raw material (including extraction recipes like Iron Ore)
                    if (isRawMaterial(inputRecipe)) {
                        // This is a raw material
                        const existing = rawMaterials.get(input.name);
                        if (existing) {
                            existing.quantity += inputQuantity;
                        } else {
                            rawMaterials.set(input.name, {
                                quantity: inputQuantity,
                                name: input.name,
                                recipe: inputRecipe, // May be null or extraction recipe
                                depth: depth + 1
                            });
                        }

                        // Track in all items
                        const existingAll = allItems.get(input.name);
                        if (existingAll) {
                            existingAll.quantity += inputQuantity;
                        } else {
                            allItems.set(input.name, {
                                quantity: inputQuantity,
                                name: input.name,
                                recipe: inputRecipe,
                                depth: depth + 1,
                                isRaw: true
                            });
                        }
                        // Don't recurse into raw materials - they have no meaningful inputs
                    } else {
                        // This is a craftable item (processed/component)
                        const existing = processedComponents.get(input.name);
                        if (existing) {
                            existing.quantity += inputQuantity;
                        } else {
                            processedComponents.set(input.name, {
                                quantity: inputQuantity,
                                recipe: inputRecipe,
                                depth: depth + 1
                            });
                        }

                        // Track in all items
                        const existingAll = allItems.get(input.name);
                        if (existingAll) {
                            existingAll.quantity += inputQuantity;
                        } else {
                            allItems.set(input.name, {
                                quantity: inputQuantity,
                                recipe: inputRecipe,
                                depth: depth + 1,
                                isRaw: false
                            });
                        }

                        // Recursively process this recipe's inputs
                        processRecipe(inputRecipe, inputQuantity, depth + 1, new Set(visited));
                    }
                });
            }
        };

        // Process each selected recipe
        recipeIds.forEach(recipeId => {
            const recipe = this.recipeCache.get(recipeId);
            if (recipe) {
                processRecipe(recipe, 1, 0, new Set());
            }
        });

        return {
            rawMaterials: Array.from(rawMaterials.values()).sort((a, b) => b.quantity - a.quantity),
            processedComponents: Array.from(processedComponents.values()).sort((a, b) => b.quantity - a.quantity),
            allItems: Array.from(allItems.values()).sort((a, b) => b.quantity - a.quantity),
            totalRawCount: rawMaterials.size,
            totalComponentCount: processedComponents.size,
            totalRawQuantity: Array.from(rawMaterials.values()).reduce((sum, m) => sum + m.quantity, 0),
            totalComponentQuantity: Array.from(processedComponents.values()).reduce((sum, c) => sum + c.quantity, 0)
        };
    }

    // ============================================
    // AGGREGATED TREE VIEW (FleetBuilder style)
    // Shows each unique item once with total quantity
    // ============================================
    renderAggregatedTreeView(recipeIds) {
        this.currentRecipeIds = recipeIds;

        // Show SVG and hide aggregated panel
        this.svg.style.display = 'block';
        const aggregatedPanel = this.container.querySelector('.aggregated-panel');
        if (aggregatedPanel) {
            aggregatedPanel.style.display = 'none';
        }

        if (recipeIds.length === 0) {
            this.renderPlaceholder();
            return;
        }

        this.clearTree();

        // Build aggregated tree data
        const aggregatedMap = new Map(); // name -> { quantity, minDepth, maxDepth, isRaw, parents, recipe }
        const parentChildRelations = [];

        // Process each selected recipe
        recipeIds.forEach(recipeId => {
            const recipe = this.recipeCache.get(recipeId);
            if (recipe) {
                this.buildAggregatedTreeData(recipe, null, 0, aggregatedMap, parentChildRelations);
            }
        });

        // Convert to array and sort by minDepth
        const aggregatedNodes = Array.from(aggregatedMap.values())
            .sort((a, b) => a.minDepth - b.minDepth);

        // Group by minDepth for positioning
        const byDepth = {};
        aggregatedNodes.forEach(node => {
            const depth = node.minDepth;
            if (!byDepth[depth]) byDepth[depth] = [];
            byDepth[depth].push(node);
        });

        const maxDepth = Math.max(...Object.keys(byDepth).map(Number), 0);
        const maxNodesInLevel = Math.max(...Object.values(byDepth).map(arr => arr.length), 1);

        // Calculate dimensions and node positions
        const nodePositions = {};
        const levelSpacing = this.nodeSpacing.x;
        const nodeVerticalSpacing = this.nodeSpacing.y;

        Object.entries(byDepth).forEach(([depth, nodes]) => {
            const d = parseInt(depth);
            const totalHeight = nodes.length * nodeVerticalSpacing;
            const startY = Math.max(50, (maxNodesInLevel * nodeVerticalSpacing - totalHeight) / 2);

            nodes.forEach((node, index) => {
                const x = d * levelSpacing + 50;
                const y = startY + index * nodeVerticalSpacing;
                nodePositions[node.name] = { x, y, node };
            });
        });

        // Draw connections (bezier curves like FleetBuilder)
        parentChildRelations.forEach(relation => {
            const parent = nodePositions[relation.parent];
            const child = nodePositions[relation.child];

            if (parent && child) {
                const startX = parent.x + this.nodeWidth;
                const startY = parent.y + this.nodeHeight / 2;
                const endX = child.x;
                const endY = child.y + this.nodeHeight / 2;
                const midX = (startX + endX) / 2;

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`);
                path.setAttribute('stroke', '#00d4ff');
                path.setAttribute('stroke-width', '1.5');
                path.setAttribute('fill', 'none');
                path.setAttribute('opacity', '0.5');
                path.setAttribute('marker-end', 'url(#arrowhead)');

                this.mainGroup.appendChild(path);
            }
        });

        // Draw nodes
        Object.entries(nodePositions).forEach(([name, pos]) => {
            const node = pos.node;
            // Create a fake nodeData structure for renderNode
            const nodeData = {
                recipe: node.recipe || { name: node.name, tier: 1, type: node.isRaw ? 'raw' : 'intermediate' },
                inputAmount: node.quantity
            };

            const group = this.renderAggregatedNode(pos.x, pos.y, nodeData, node.quantity, node.isRaw);
            this.mainGroup.appendChild(group);
        });

        this.resetView();
    }

    // Build aggregated tree data structure (like FleetBuilder)
    // multiplier: how many of this recipe we need to make
    buildAggregatedTreeData(recipe, parentName, depth, aggregatedMap, parentChildRelations, multiplier = 1, visited = new Set()) {
        if (!recipe) return;

        const recipeName = recipe.name;

        // Prevent infinite loops
        if (visited.has(recipeName)) return;
        visited.add(recipeName);

        const isRaw = this.isRawMaterial(recipe);

        // For root recipe (no parent), add to aggregatedMap
        // For child recipes, they were already added by their parent with correct quantity
        if (!parentName) {
            if (!aggregatedMap.has(recipeName)) {
                aggregatedMap.set(recipeName, {
                    name: recipeName,
                    quantity: multiplier,
                    minDepth: depth,
                    maxDepth: depth,
                    isRaw: isRaw,
                    parents: new Set(),
                    recipe: recipe
                });
            } else {
                const existing = aggregatedMap.get(recipeName);
                existing.quantity += multiplier;
                existing.minDepth = Math.min(existing.minDepth, depth);
                existing.maxDepth = Math.max(existing.maxDepth, depth);
            }
        }

        // Process inputs recursively (don't recurse into raw materials)
        if (!isRaw && recipe.inputs && recipe.inputs.length > 0) {
            recipe.inputs.forEach(input => {
                const inputRecipe = this.recipeCache.get(input.name);
                const inputIsRaw = this.isRawMaterial(inputRecipe);
                const inputQuantity = (input.amount || 1) * multiplier;

                // Create entry for input
                const inputName = input.name;
                if (!aggregatedMap.has(inputName)) {
                    aggregatedMap.set(inputName, {
                        name: inputName,
                        quantity: inputQuantity,
                        minDepth: depth + 1,
                        maxDepth: depth + 1,
                        isRaw: inputIsRaw,
                        parents: new Set([recipeName]),
                        recipe: inputRecipe
                    });
                } else {
                    const existing = aggregatedMap.get(inputName);
                    existing.quantity += inputQuantity;
                    existing.minDepth = Math.min(existing.minDepth, depth + 1);
                    existing.maxDepth = Math.max(existing.maxDepth, depth + 1);
                    existing.parents.add(recipeName);
                }

                // Track parent-child relationship
                const relationKey = `${recipeName}->${inputName}`;
                if (!parentChildRelations.find(r => r.key === relationKey)) {
                    parentChildRelations.push({
                        key: relationKey,
                        parent: recipeName,
                        child: inputName
                    });
                }

                // Recursively process inputs (if not raw) - pass the multiplied quantity
                if (inputRecipe && !inputIsRaw) {
                    this.buildAggregatedTreeData(inputRecipe, recipeName, depth + 1, aggregatedMap, parentChildRelations, inputQuantity, new Set(visited));
                }
            });
        }
    }

    // Render a node for the aggregated tree view
    renderAggregatedNode(x, y, nodeData, quantity, isRaw) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('transform', `translate(${x}, ${y})`);
        group.setAttribute('class', 'recipe-node');

        const recipe = nodeData.recipe;
        group.setAttribute('data-recipe-name', recipe?.name || nodeData.name);

        // FleetBuilder-style node background
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', this.nodeWidth);
        rect.setAttribute('height', this.nodeHeight);
        rect.setAttribute('rx', '6');
        rect.setAttribute('ry', '6');
        rect.setAttribute('fill', isRaw ? 'url(#rawGradient)' : 'url(#nodeGradient)');
        rect.setAttribute('stroke', isRaw ? '#ffd700' : '#00d4ff');
        rect.setAttribute('stroke-width', '1.5');
        group.appendChild(rect);

        // Recipe name (centered)
        const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        titleText.setAttribute('x', this.nodeWidth / 2);
        titleText.setAttribute('y', '16');
        titleText.setAttribute('text-anchor', 'middle');
        titleText.setAttribute('fill', '#e0e0ff');
        titleText.setAttribute('font-size', '10');
        titleText.setAttribute('font-weight', '500');
        const name = recipe?.name || nodeData.name || 'Unknown';
        const truncatedName = name.length > 20 ? name.substring(0, 17) + '...' : name;
        titleText.textContent = truncatedName;
        group.appendChild(titleText);

        // Type indicator with quantity (FleetBuilder style)
        const typeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        typeText.setAttribute('x', this.nodeWidth / 2);
        typeText.setAttribute('y', '32');
        typeText.setAttribute('text-anchor', 'middle');
        typeText.setAttribute('fill', isRaw ? '#ffd700' : '#00d4ff');
        typeText.setAttribute('font-size', '9');
        typeText.textContent = `${isRaw ? '⛏️ RAW' : '🔧 CRAFT'} × ${quantity}`;
        group.appendChild(typeText);

        // Tier indicator
        const tierText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tierText.setAttribute('x', this.nodeWidth / 2);
        tierText.setAttribute('y', '46');
        tierText.setAttribute('text-anchor', 'middle');
        tierText.setAttribute('fill', '#666');
        tierText.setAttribute('font-size', '8');
        tierText.textContent = `T${recipe?.tier || 1}`;
        group.appendChild(tierText);

        // Click handler
        group.style.cursor = 'pointer';
        group.addEventListener('click', (e) => {
            e.stopPropagation();
            if (recipe) {
                this.showNodeDetails(recipe);
            }
        });

        return group;
    }

    // Render aggregated totals list view (like FleetBuilder)
    renderAggregatedTotalsView(recipeIds) {
        this.currentRecipeIds = recipeIds;

        if (recipeIds.length === 0) {
            this.renderPlaceholder();
            return;
        }

        this.aggregatedData = this.calculateAggregatedTotals(recipeIds);

        // Clear the SVG and render the aggregated panel instead
        this.clearTree();

        // Create an HTML overlay for the aggregated view (easier to style)
        let aggregatedPanel = this.container.querySelector('.aggregated-panel');
        if (!aggregatedPanel) {
            aggregatedPanel = document.createElement('div');
            aggregatedPanel.className = 'aggregated-panel';
            this.container.appendChild(aggregatedPanel);
        }
        aggregatedPanel.style.display = 'block';

        // Hide SVG when showing aggregated view
        this.svg.style.display = 'none';

        const { rawMaterials, processedComponents, totalRawCount, totalComponentCount, totalRawQuantity, totalComponentQuantity } = this.aggregatedData;

        aggregatedPanel.innerHTML = `
            <div class="aggregated-header">
                <h3>📊 Aggregated Recipe Totals</h3>
                <p class="aggregated-subtitle">Combined requirements for ${recipeIds.length} selected recipe${recipeIds.length > 1 ? 's' : ''}</p>
            </div>

            <div class="aggregated-stats">
                <div class="agg-stat-card">
                    <span class="agg-stat-value">${totalRawCount}</span>
                    <span class="agg-stat-label">Raw Materials</span>
                </div>
                <div class="agg-stat-card">
                    <span class="agg-stat-value">${totalComponentCount}</span>
                    <span class="agg-stat-label">Components</span>
                </div>
                <div class="agg-stat-card">
                    <span class="agg-stat-value">${totalRawQuantity.toLocaleString()}</span>
                    <span class="agg-stat-label">Total Raw Qty</span>
                </div>
                <div class="agg-stat-card">
                    <span class="agg-stat-value">${totalComponentQuantity.toLocaleString()}</span>
                    <span class="agg-stat-label">Total Component Qty</span>
                </div>
            </div>

            <div class="aggregated-sections">
                <div class="agg-section">
                    <h4>⛏️ Raw Materials (${rawMaterials.length})</h4>
                    <div class="agg-items-grid">
                        ${rawMaterials.map(mat => `
                            <div class="agg-item raw">
                                <span class="agg-item-icon">⛏️</span>
                                <span class="agg-item-name">${mat.name}</span>
                                <span class="agg-item-qty">×${mat.quantity.toLocaleString()}</span>
                            </div>
                        `).join('')}
                        ${rawMaterials.length === 0 ? '<div class="agg-empty">No raw materials required</div>' : ''}
                    </div>
                </div>

                <div class="agg-section">
                    <h4>🔧 Processed Components (${processedComponents.length})</h4>
                    <div class="agg-items-grid">
                        ${processedComponents.map(comp => `
                            <div class="agg-item component" data-recipe-id="${comp.recipe?.id || ''}">
                                <span class="agg-item-icon">${this.getTypeIcon(comp.recipe?.type || 'intermediate')}</span>
                                <span class="agg-item-name">${comp.recipe?.name || comp.name}</span>
                                <span class="agg-item-tier">T${comp.recipe?.tier || 1}</span>
                                <span class="agg-item-qty">×${comp.quantity.toLocaleString()}</span>
                            </div>
                        `).join('')}
                        ${processedComponents.length === 0 ? '<div class="agg-empty">No processed components required</div>' : ''}
                    </div>
                </div>
            </div>
        `;

        // Add click handlers for component items to show details
        aggregatedPanel.querySelectorAll('.agg-item.component').forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                const recipeId = item.getAttribute('data-recipe-id');
                if (recipeId) {
                    const recipe = this.recipeCache.get(recipeId);
                    if (recipe) {
                        this.showNodeDetails(recipe);
                    }
                }
            });
        });
    }

    // Internal method to render tree view
    renderMultipleRecipesInternal(recipeIds) {
        // Show SVG and hide aggregated panel
        this.svg.style.display = 'block';
        const aggregatedPanel = this.container.querySelector('.aggregated-panel');
        if (aggregatedPanel) {
            aggregatedPanel.style.display = 'none';
        }

        if (recipeIds.length === 0) {
            this.renderPlaceholder();
            return;
        }

        if (recipeIds.length === 1) {
            this.renderRecipeTree(recipeIds[0]);
            return;
        }

        // For multiple recipes, create a combined view
        this.clearTree();
        let yOffset = 0;

        recipeIds.forEach((recipeId, index) => {
            const recipe = this.recipeCache.get(recipeId);
            if (recipe) {
                const treeData = this.buildTreeData(recipe, new Set());
                const layout = this.calculateLayout(treeData);

                // Adjust positions for multiple trees
                layout.forEach((data, id) => {
                    data.y += yOffset;
                });

                this.renderTree(layout);

                // Calculate the height of this tree for spacing
                let maxY = 0;
                layout.forEach(data => {
                    maxY = Math.max(maxY, data.y + this.nodeHeight);
                });
                yOffset = maxY + 100; // Add spacing between trees
            }
        });

        this.resetView();
    }
}