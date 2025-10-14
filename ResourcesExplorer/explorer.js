// Fixed tier checkbox string/number type mismatch - v2025-09-26c
class ResourcesExplorer extends BaseExplorer {
    constructor(data) {
        super(data);

        // Initialize properties after calling super
        this.allCategories = new Set();
        this.allTiers = new Set();

        // Now initialize properly
        this.initialize();
    }

    extractMetadata() {
        this.allCategories.clear();
        this.allTiers.clear();

        this.data.forEach(resource => {
            if (resource.category) {
                this.allCategories.add(resource.category);
            }
            if (resource.tier) {
                this.allTiers.add(resource.tier);
            }
        });

        console.log(`📊 Extracted metadata:`, {
            categories: Array.from(this.allCategories),
            tiers: Array.from(this.allTiers)
        });
    }

    populateFilters() {
        this.populateCategoryCheckboxes();
        this.populateTierCheckboxes();
    }

    populateCategoryCheckboxes() {
        const sortedCategories = Array.from(this.allCategories).sort();
        this.createCheckboxFilter('categoryCheckboxes', sortedCategories, 'category', (category) => {
            return category.charAt(0).toUpperCase() + category.slice(1);
        });
    }

    populateTierCheckboxes() {
        const sortedTiers = Array.from(this.allTiers).sort((a, b) => a - b);
        this.createCheckboxFilter('tierCheckboxes', sortedTiers, 'tier', (tier) => {
            return `Tier ${tier}`;
        });
    }

    applyFilters() {
        const categoryFilters = this.selectedFilters.get('category');
        const tierFilters = this.selectedFilters.get('tier');

        const hasActiveFilters = this.currentSearchTerm ||
                                 (categoryFilters && categoryFilters.size > 0) ||
                                 (tierFilters && tierFilters.size > 0);

        console.log(`🔍 ResourcesExplorer applyFilters:`, {
            searchTerm: this.currentSearchTerm,
            categoryFilters: categoryFilters?.size || 0,
            tierFilters: tierFilters?.size || 0,
            hasActiveFilters,
            totalData: this.data.length
        });

        if (!hasActiveFilters) {
            // No filters active - show all data
            this.filteredData = [...this.data];
            console.log(`✅ No filters active, showing all ${this.filteredData.length} items`);
        } else {
            // Apply filters using parent logic
            super.applyFilters();
            console.log(`🔍 Filters applied, showing ${this.filteredData.length} items`);
        }

        this.renderItems();
        this.updateStats();
    }

    matchesSearch(resource, searchTerm) {
        const nameMatch = resource.name.toLowerCase().includes(searchTerm);
        const descMatch = resource.description && resource.description.toLowerCase().includes(searchTerm);
        const idMatch = resource.id && resource.id.toLowerCase().includes(searchTerm);
        const categoryMatch = resource.category && resource.category.toLowerCase().includes(searchTerm);

        return nameMatch || descMatch || idMatch || categoryMatch;
    }

    matchesFilter(resource, filterType, selectedItems) {
        if (filterType === 'category') {
            const matches = selectedItems.has(resource.category);
            if (selectedItems.size > 0) {
                console.log(`🏷️ Category filter: ${resource.name} (${resource.category}) → ${matches}`);
            }
            return matches;
        } else if (filterType === 'tier') {
            // Convert tier to string for comparison since checkbox values are strings
            const tierString = String(resource.tier);
            const matches = selectedItems.has(tierString);
            if (selectedItems.size > 0) {
                console.log(`🎯 Tier filter: ${resource.name} (tier ${resource.tier} → "${tierString}") against [${Array.from(selectedItems).join(', ')}] → ${matches}`);
            }
            return matches;
        }
        return true;
    }

    renderItems() {
        const container = document.getElementById('resourcesGrid');
        if (!container) {
            console.error('❌ Resources grid container not found');
            return;
        }

        container.innerHTML = '';

        if (this.filteredData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>🔍 No resources found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }

        console.log(`🎨 Rendering ${this.filteredData.length} resources`);

        this.filteredData.forEach(resource => {
            const card = this.createResourceCard(resource);
            container.appendChild(card);
        });
    }

    createResourceCard(resource) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.onclick = () => this.showModal(resource);

        const tierBadge = resource.tier ? `<span class="item-tier">Tier ${resource.tier}</span>` : '';
        const category = resource.category || 'unknown';

        card.innerHTML = `
            <div class="item-header">
                <h3>${resource.name || 'Unknown Resource'}</h3>
                ${tierBadge}
            </div>
            <div class="item-category">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
            <div class="item-details">
                <div class="detail-item">
                    <span class="detail-label">Base Value:</span>
                    <span class="detail-value value-highlight">${resource.baseValue || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Stack Size:</span>
                    <span class="detail-value">${resource.stackSize || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">ID:</span>
                    <span class="detail-value">${resource.id || 'N/A'}</span>
                </div>
            </div>
        `;

        return card;
    }

    updateStats() {
        const totalResources = this.data.length;
        const filteredCount = this.filteredData.length;
        const uniqueCategories = this.allCategories.size;

        const averageValue = this.filteredData.length > 0
            ? Math.round(this.filteredData.reduce((sum, resource) => sum + (resource.baseValue || 0), 0) / this.filteredData.length)
            : 0;

        console.log(`📊 Updating stats:`, {
            totalResources,
            filteredCount,
            uniqueCategories,
            averageValue
        });

        this.updateStatElement('totalResources', totalResources);
        this.updateStatElement('filteredResources', filteredCount);
        this.updateStatElement('uniqueCategories', uniqueCategories);
        this.updateStatElement('averageValue', averageValue);
    }

    updateStatElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value.toLocaleString();
        } else {
            console.warn(`⚠️ Stat element not found: ${elementId}`);
        }
    }

    populateModal(resource) {
        const modalContent = document.getElementById('modalContent');
        if (!modalContent) {
            console.error('❌ Modal content not found');
            return;
        }

        const tierInfo = resource.tier ? `<span class="item-tier">Tier ${resource.tier}</span>` : '';
        const category = resource.category || 'unknown';

        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${resource.name || 'Unknown Resource'} ${tierInfo}</h2>
                <div class="item-category">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
            </div>

            <div class="modal-body">
                <div class="resource-info-grid">
                    <div class="info-section">
                        <h3>📝 Basic Information</h3>
                        <div class="info-item">
                            <span class="info-label">Resource ID:</span>
                            <span class="info-value">${resource.id || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Category:</span>
                            <span class="info-value">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Tier:</span>
                            <span class="info-value">${resource.tier || 'N/A'}</span>
                        </div>
                    </div>

                    <div class="info-section">
                        <h3>💰 Economic Data</h3>
                        <div class="info-item">
                            <span class="info-label">Base Value:</span>
                            <span class="info-value value-highlight">${resource.baseValue || 0}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Stack Size:</span>
                            <span class="info-value">${resource.stackSize || 0}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Value per Stack:</span>
                            <span class="info-value value-highlight">${((resource.baseValue || 0) * (resource.stackSize || 0)).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                ${resource.description ? `
                    <div class="info-section">
                        <h3>📋 Description</h3>
                        <p class="resource-description">${resource.description}</p>
                    </div>
                ` : ''}
            </div>

            <div class="modal-actions">
                <button class="view-recipe-btn" id="viewRecipeBtn" data-resource-name="${this.escapeHtml(resource.name)}">
                    View Recipes →
                </button>
            </div>
        `;

        // Setup recipe button click handler
        setTimeout(() => {
            const recipeBtn = document.getElementById('viewRecipeBtn');
            if (recipeBtn) {
                recipeBtn.addEventListener('click', () => {
                    const resourceName = recipeBtn.getAttribute('data-resource-name');
                    this.openRecipeExplorer(resourceName);
                });
            }
        }, 0);

        // Add modal-specific styles if not already present
        if (!document.querySelector('#modalStyles')) {
            const style = document.createElement('style');
            style.id = 'modalStyles';
            style.textContent = `
                .modal-header {
                    margin-bottom: 1.5rem;
                    text-align: center;
                }

                .modal-header h2 {
                    color: #4facfe;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                }

                .resource-info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                }

                .info-section {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    padding: 1rem;
                }

                .info-section h3 {
                    color: #4facfe;
                    margin-bottom: 1rem;
                    font-size: 1rem;
                }

                .info-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    padding: 0.25rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .info-item:last-child {
                    border-bottom: none;
                }

                .info-label {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9rem;
                }

                .info-value {
                    color: white;
                    font-weight: bold;
                    font-size: 0.9rem;
                }

                .resource-description {
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.5;
                    font-style: italic;
                }

                .modal-actions {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: center;
                }

                .view-recipe-btn {
                    background: linear-gradient(45deg, #4facfe, #00f2fe);
                    border: none;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }

                .view-recipe-btn:hover {
                    transform: translateX(3px);
                    box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
                }

                @media (max-width: 768px) {
                    .resource-info-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    openRecipeExplorer(resourceName) {
        // Open Recipe Explorer in new tab and search for recipes that output this resource
        const url = `../RecipeExplorer/index.html?search=${encodeURIComponent(resourceName)}`;
        window.open(url, '_blank');
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getModalId() {
        return 'resourceModal';
    }
}