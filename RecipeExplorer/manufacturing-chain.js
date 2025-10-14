/**
 * ManufacturingChainAnalytics - Recipe dependency graph visualizer
 */

class ManufacturingChainAnalytics {
    constructor() {
        this.crossAnalytics = new CrossExplorerAnalytics();
        this.data = null;
    }

    async loadData() {
        console.log('[ManufacturingChain] Loading manufacturing chain data...');
        this.data = await this.crossAnalytics.analyzeManufacturingChain();
        console.log('[ManufacturingChain] Data loaded:', this.data);
    }

    async renderManufacturingChain() {
        const loadingMessage = document.getElementById('chainLoadingMessage');
        const content = document.getElementById('chainContent');

        if (loadingMessage) loadingMessage.style.display = 'block';

        try {
            if (!this.data) {
                await this.loadData();
            }

            if (loadingMessage) loadingMessage.style.display = 'none';

            this.renderBottlenecks();
            this.renderComplexChains();
            this.renderParallelPaths();
            this.renderRawMaterials();
            this.renderFinalProducts();
            this.renderInsights();

        } catch (error) {
            console.error('[ManufacturingChain] Error rendering:', error);
            if (content) {
                content.innerHTML = `
                    <div class="error-message">
                        <p>⚠️ Error loading manufacturing chain data</p>
                        <p>${error.message}</p>
                    </div>
                `;
            }
            if (loadingMessage) loadingMessage.style.display = 'none';
        }
    }

    renderBottlenecks() {
        const content = document.getElementById('chainContent');
        if (!content) return;

        const bottlenecks = this.data.bottlenecks || [];

        const html = `
            <div class="chain-section">
                <h3>🚧 Manufacturing Bottlenecks</h3>
                <p class="section-description">Resources used by many recipes - critical for production chains</p>
                <div class="bottleneck-grid">
                    ${bottlenecks.map((bottleneck, index) => `
                        <div class="bottleneck-card ${index < 3 ? 'critical' : ''}">
                            ${index < 3 ? `<div class="criticality-badge">Critical</div>` : ''}
                            <div class="bottleneck-header">
                                <h4>${bottleneck.resource}</h4>
                                <span class="tier-badge tier-${bottleneck.tier}">T${bottleneck.tier}</span>
                            </div>
                            <div class="bottleneck-stats">
                                <div class="bottleneck-stat primary">
                                    <span class="stat-label">Bottleneck Score:</span>
                                    <span class="stat-value">${bottleneck.bottleneckScore}</span>
                                </div>
                                <div class="bottleneck-stat">
                                    <span class="stat-label">Used By:</span>
                                    <span class="stat-value">${bottleneck.branches} recipes</span>
                                </div>
                                <div class="bottleneck-stat">
                                    <span class="stat-label">Chain Depth:</span>
                                    <span class="stat-value">${bottleneck.depth} steps</span>
                                </div>
                            </div>
                            <button class="btn-view-dependencies" data-resource="${bottleneck.resource}" data-uses='${JSON.stringify(bottleneck.usedBy)}'>
                                View Dependencies
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        content.innerHTML = html;

        // Add event listeners for viewing dependencies
        document.querySelectorAll('.btn-view-dependencies').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const resource = e.target.dataset.resource;
                const usedBy = JSON.parse(e.target.dataset.uses);
                this.showDependencyModal(resource, usedBy);
            });
        });
    }

    renderComplexChains() {
        const content = document.getElementById('chainContent');
        if (!content) return;

        const complexChains = this.data.complexChains || [];

        const html = `
            <div class="chain-section">
                <h3>🔗 Most Complex Production Chains</h3>
                <p class="section-description">Products with the longest manufacturing paths</p>
                <div class="complex-chain-grid">
                    ${complexChains.map((chain, index) => `
                        <div class="complex-chain-card ${index < 5 ? 'highlighted' : ''}">
                            <div class="chain-rank">#${index + 1}</div>
                            <div class="chain-header">
                                <h4>${chain.product}</h4>
                                <span class="tier-badge tier-${chain.tier}">T${chain.tier}</span>
                            </div>
                            <div class="chain-stats">
                                <div class="chain-stat primary">
                                    <span class="stat-label">Complexity Score:</span>
                                    <span class="stat-value">${chain.complexity}</span>
                                </div>
                                <div class="chain-stat">
                                    <span class="stat-label">Chain Depth:</span>
                                    <span class="stat-value">${chain.depth} steps</span>
                                </div>
                                <div class="chain-stat">
                                    <span class="stat-label">Ingredients:</span>
                                    <span class="stat-value">${chain.ingredientCount}</span>
                                </div>
                                <div class="chain-stat">
                                    <span class="stat-label">Used By:</span>
                                    <span class="stat-value">${chain.branchCount} recipes</span>
                                </div>
                            </div>
                            <div class="complexity-bar">
                                <div class="complexity-fill" style="width: ${Math.min((chain.complexity / complexChains[0].complexity) * 100, 100)}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        content.insertAdjacentHTML('beforeend', html);
    }

    renderParallelPaths() {
        const content = document.getElementById('chainContent');
        if (!content) return;

        const parallelPaths = this.data.parallelPaths || [];

        const html = `
            <div class="chain-section">
                <h3>🔀 Parallel Production Paths</h3>
                <p class="section-description">Products with multiple alternative recipes</p>
                <div class="parallel-path-grid">
                    ${parallelPaths.slice(0, 20).map(path => `
                        <div class="parallel-path-card">
                            <div class="path-header">
                                <h4>${path.product}</h4>
                                <span class="path-count-badge">${path.pathCount} paths</span>
                            </div>
                            <div class="path-alternatives">
                                ${path.recipes.map((recipe, index) => `
                                    <div class="alternative-recipe">
                                        <h5>Path ${index + 1}</h5>
                                        <div class="recipe-info">
                                            <span class="tier-badge tier-${recipe.tier}">T${recipe.tier}</span>
                                            <span class="ingredient-count">${recipe.ingredients.length} ingredients</span>
                                            <span class="construction-time">${this.formatTime(recipe.constructionTime)}</span>
                                        </div>
                                        <div class="ingredients-list">
                                            ${recipe.ingredients.slice(0, 5).join(', ')}${recipe.ingredients.length > 5 ? '...' : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        content.insertAdjacentHTML('beforeend', html);
    }

    renderRawMaterials() {
        const content = document.getElementById('chainContent');
        if (!content) return;

        const rawMaterials = this.data.rawMaterials || [];

        const html = `
            <div class="chain-section">
                <h3>⛏️ Raw Materials</h3>
                <p class="section-description">Base resources that start production chains</p>
                <div class="raw-materials-grid">
                    ${rawMaterials.map(material => `
                        <div class="raw-material-card">
                            <div class="material-header">
                                <h4>${material.resource}</h4>
                                <span class="tier-badge tier-${material.tier}">T${material.tier}</span>
                            </div>
                            <div class="material-stat">
                                <span class="stat-label">Used in:</span>
                                <span class="stat-value">${material.usedInRecipes} recipes</span>
                            </div>
                            <div class="usage-indicator">
                                <div class="usage-fill" style="width: ${Math.min((material.usedInRecipes / rawMaterials[0].usedInRecipes) * 100, 100)}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        content.insertAdjacentHTML('beforeend', html);
    }

    renderFinalProducts() {
        const content = document.getElementById('chainContent');
        if (!content) return;

        const finalProducts = this.data.finalProducts || [];

        const html = `
            <div class="chain-section">
                <h3>🎯 Final Products</h3>
                <p class="section-description">End products not used in other recipes</p>
                <div class="final-products-grid">
                    ${finalProducts.map(product => `
                        <div class="final-product-card">
                            <div class="product-header">
                                <h4>${product.product}</h4>
                                <span class="tier-badge tier-${product.tier}">T${product.tier}</span>
                            </div>
                            <div class="product-stats">
                                <div class="product-stat">
                                    <span class="stat-label">Ingredients:</span>
                                    <span class="stat-value">${product.ingredientCount}</span>
                                </div>
                                <div class="product-stat">
                                    <span class="stat-label">Chain Depth:</span>
                                    <span class="stat-value">${product.depth} steps</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        content.insertAdjacentHTML('beforeend', html);
    }

    renderInsights() {
        const content = document.getElementById('chainContent');
        if (!content) return;

        const insights = this.data.insights;
        if (!insights) return;

        const html = `
            <div class="chain-section">
                <h3>💡 Manufacturing Chain Insights</h3>
                <div class="insights-grid">
                    <div class="insight-card">
                        <h4>📊 Chain Statistics</h4>
                        <div class="insight-stats">
                            <div class="insight-stat">
                                <span class="label">Total Nodes:</span>
                                <span class="value">${insights.totalNodes}</span>
                            </div>
                            <div class="insight-stat">
                                <span class="label">Max Chain Depth:</span>
                                <span class="value">${insights.maxChainDepth} steps</span>
                            </div>
                        </div>
                    </div>

                    ${insights.criticalBottleneck ? `
                        <div class="insight-card critical">
                            <h4>🚧 Critical Bottleneck</h4>
                            <div class="insight-content">
                                <div class="insight-title">${insights.criticalBottleneck.resource}</div>
                                <div class="insight-description">
                                    Used by ${insights.criticalBottleneck.branches} recipes with a bottleneck score of ${insights.criticalBottleneck.bottleneckScore}
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    ${insights.mostComplexProduct ? `
                        <div class="insight-card">
                            <h4>🔗 Most Complex Product</h4>
                            <div class="insight-content">
                                <div class="insight-title">${insights.mostComplexProduct.product}</div>
                                <div class="insight-description">
                                    ${insights.mostComplexProduct.depth} step chain with ${insights.mostComplexProduct.ingredientCount} ingredients
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        content.insertAdjacentHTML('beforeend', html);
    }

    showDependencyModal(resource, usedBy) {
        const modal = document.createElement('div');
        modal.className = 'dependency-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Dependencies for ${resource}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>This resource is used by ${usedBy.length} recipes:</p>
                    <div class="dependency-list">
                        ${usedBy.map(recipe => `
                            <div class="dependency-item">${recipe}</div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal on click
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    formatTime(seconds) {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        return `${Math.floor(seconds / 3600)}h`;
    }
}

// Make available globally
window.ManufacturingChainAnalytics = ManufacturingChainAnalytics;
