// Hab Builder App
let habData = null;
let buildPlan = [];

// Initialize app
async function init() {
    await loadData();
    setupTabs();
    renderHabs();
    renderCraftingStations();
    renderStorageCalculator();
    setupModal();
    setupPlanActions();
}

// Load hab data
async function loadData() {
    try {
        // Use validated, processed data from RefreshData pipeline
        const response = await fetch('../Data/crafting-hab-data.js');
        const text = await response.text();
        // Execute the script to load the global variable
        eval(text);
        // craftingHabData is now available as a global variable
        habData = window.craftingHabData || craftingHabData;
        console.log('Hab data loaded from processed source:', habData);
    } catch (error) {
        console.error('Error loading hab data:', error);
    }
}

// Tab switching
function setupTabs() {
    const tabButtons = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;

            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab
            button.classList.add('active');
            // Convert tab name to camelCase + Tab (habs -> habsTab, crafting -> craftingTab)
            const tabId = tabName + 'Tab';
            const tabElement = document.getElementById(tabId);
            if (tabElement) {
                tabElement.classList.add('active');
            }
        });
    });
}

// Render Habs
function renderHabs() {
    const habsList = document.getElementById('habs-list');
    const landingPadsList = document.getElementById('landing-pads-list');
    const decorativeList = document.getElementById('decorative-list');

    // Separate habs into categories
    const habTiers = habData.habs.filter(h => h.id.startsWith('hab-t'));
    const landingPads = habData.habs.filter(h => h.id.includes('landing-pad'));
    const decorative = habData.habs.filter(h => !h.id.startsWith('hab-t') && !h.id.includes('landing-pad'));

    // Render hab tiers
    habsList.innerHTML = habTiers.map(hab => createBuildingCard(hab, 'hab')).join('');

    // Render landing pads
    landingPadsList.innerHTML = landingPads.map(hab => createBuildingCard(hab, 'hab')).join('');

    // Render decorative
    decorativeList.innerHTML = decorative.map(hab => createBuildingCard(hab, 'hab')).join('');

    // Add click listeners
    document.querySelectorAll('.building-card').forEach(card => {
        card.addEventListener('click', () => {
            const buildingId = card.dataset.id;
            const buildingType = card.dataset.type;
            showBuildingDetails(buildingId, buildingType);
        });
    });
}

// Create building card HTML
function createBuildingCard(building, type) {
    const timeStr = formatTime(building.constructionTime);

    let badge = '';
    if (building.tier) {
        badge = `<span class="tier-badge">Tier ${building.tier}</span>`;
    } else if (building.size) {
        badge = `<span class="size-badge">${building.size}</span>`;
    }

    let stats = '';
    if (type === 'hab') {
        stats = `
            <div class="building-stats">
                <div class="stat-item">
                    <label>Slots</label>
                    <span>${building.slots || 'N/A'}</span>
                </div>
                <div class="stat-item">
                    <label>Storage</label>
                    <span>${building.storage || 0}</span>
                </div>
                <div class="stat-item">
                    <label>Build Time</label>
                    <span>${timeStr}</span>
                </div>
                <div class="stat-item">
                    <label>Materials</label>
                    <span>${Object.keys(building.constructionCost || {}).length}</span>
                </div>
            </div>
        `;
    } else if (type === 'crafting') {
        stats = `
            <div class="building-stats">
                <div class="stat-item">
                    <label>Speed Bonus</label>
                    <span>${building.speedBonus}x</span>
                </div>
                <div class="stat-item">
                    <label>Slots</label>
                    <span>${building.slots}</span>
                </div>
                <div class="stat-item">
                    <label>Job Slots</label>
                    <span>${building.jobSlots}</span>
                </div>
                <div class="stat-item">
                    <label>Build Time</label>
                    <span>${timeStr}</span>
                </div>
            </div>
        `;
    } else if (type === 'storage') {
        stats = `
            <div class="building-stats">
                <div class="stat-item">
                    <label>Slots</label>
                    <span>${building.slots}</span>
                </div>
                <div class="stat-item">
                    <label>Storage Bonus</label>
                    <span>+${building.storageBonus}</span>
                </div>
                <div class="stat-item">
                    <label>Job Slot Bonus</label>
                    <span>+${building.jobSlotBonus}</span>
                </div>
                <div class="stat-item">
                    <label>Build Time</label>
                    <span>${timeStr}</span>
                </div>
            </div>
        `;
    }

    return `
        <div class="building-card" data-id="${building.id}" data-type="${type}">
            <h3>${building.name}</h3>
            ${badge}
            <p>${building.description || ''}</p>
            ${stats}
        </div>
    `;
}

// Render Crafting Stations
function renderCraftingStations() {
    const craftingComparison = document.getElementById('crafting-comparison');

    craftingComparison.innerHTML = habData.craftingStations.map(station => {
        const timeStr = formatTime(station.constructionTime);
        const efficiencyPercent = (station.speedBonus / 2) * 100; // 2x is max

        return `
            <div class="comparison-card">
                <h3>${station.name}</h3>
                <div class="building-stats">
                    <div class="stat-item">
                        <label>Size</label>
                        <span>${station.size}</span>
                    </div>
                    <div class="stat-item">
                        <label>Speed Bonus</label>
                        <span>${station.speedBonus}x</span>
                    </div>
                    <div class="stat-item">
                        <label>Slots Required</label>
                        <span>${station.slots}</span>
                    </div>
                    <div class="stat-item">
                        <label>Job Slots</label>
                        <span>${station.jobSlots}</span>
                    </div>
                    <div class="stat-item">
                        <label>Construction Time</label>
                        <span>${timeStr}</span>
                    </div>
                    <div class="stat-item">
                        <label>Materials Required</label>
                        <span>${Object.keys(station.constructionCost).length}</span>
                    </div>
                </div>
                <div style="margin-top: 1rem;">
                    <label style="color: #8892b0; font-size: 0.9rem;">Efficiency Rating</label>
                    <div class="efficiency-bar">
                        <div class="efficiency-fill" style="width: ${efficiencyPercent}%">
                            ${station.speedBonus}x Speed
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm" style="width: 100%; margin-top: 1rem;"
                    onclick="showBuildingDetails('${station.id}', 'crafting')">
                    View Details
                </button>
            </div>
        `;
    }).join('');
}

// Render Storage Calculator
function renderStorageCalculator() {
    const storageCalculator = document.getElementById('storage-calculator');

    storageCalculator.innerHTML = `
        <div class="building-grid">
            ${habData.cargoStorage.map(storage => createBuildingCard(storage, 'storage')).join('')}
        </div>
    `;

    // Add click listeners
    storageCalculator.querySelectorAll('.building-card').forEach(card => {
        card.addEventListener('click', () => {
            const buildingId = card.dataset.id;
            showBuildingDetails(buildingId, 'storage');
        });
    });
}

// Show building details in modal
function showBuildingDetails(buildingId, type) {
    let building;
    if (type === 'hab') {
        building = habData.habs.find(h => h.id === buildingId);
    } else if (type === 'crafting') {
        building = habData.craftingStations.find(c => c.id === buildingId);
    } else if (type === 'storage') {
        building = habData.cargoStorage.find(s => s.id === buildingId);
    }

    if (!building) return;

    const modal = document.getElementById('building-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const addToPlanBtn = document.getElementById('add-to-plan-btn');

    modalTitle.textContent = building.name;

    let detailsHTML = `
        <div class="modal-section">
            <h3>Description</h3>
            <p>${building.description || 'No description available'}</p>
        </div>

        <div class="modal-section">
            <h3>Statistics</h3>
            <div class="building-stats">
    `;

    if (building.tier) {
        detailsHTML += `
            <div class="stat-item">
                <label>Tier</label>
                <span>${building.tier}</span>
            </div>
        `;
    }
    if (building.size) {
        detailsHTML += `
            <div class="stat-item">
                <label>Size</label>
                <span>${building.size}</span>
            </div>
        `;
    }
    if (building.slots !== undefined) {
        detailsHTML += `
            <div class="stat-item">
                <label>Slots</label>
                <span>${building.slots}</span>
            </div>
        `;
    }
    if (building.storage) {
        detailsHTML += `
            <div class="stat-item">
                <label>Storage</label>
                <span>${building.storage}</span>
            </div>
        `;
    }
    if (building.speedBonus) {
        detailsHTML += `
            <div class="stat-item">
                <label>Speed Bonus</label>
                <span>${building.speedBonus}x</span>
            </div>
        `;
    }
    if (building.jobSlots) {
        detailsHTML += `
            <div class="stat-item">
                <label>Job Slots</label>
                <span>${building.jobSlots}</span>
            </div>
        `;
    }
    if (building.storageBonus) {
        detailsHTML += `
            <div class="stat-item">
                <label>Storage Bonus</label>
                <span>+${building.storageBonus}</span>
            </div>
        `;
    }
    if (building.jobSlotBonus !== undefined) {
        detailsHTML += `
            <div class="stat-item">
                <label>Job Slot Bonus</label>
                <span>+${building.jobSlotBonus}</span>
            </div>
        `;
    }

    detailsHTML += `
                <div class="stat-item">
                    <label>Construction Time</label>
                    <span>${formatTime(building.constructionTime)}</span>
                </div>
            </div>
        </div>

        <div class="modal-section">
            <h3>Construction Cost</h3>
            <div class="resource-list">
    `;

    if (building.constructionCost) {
        for (const [resource, amount] of Object.entries(building.constructionCost)) {
            detailsHTML += `
                <div class="resource-item">
                    <span>${formatResourceName(resource)}</span>
                    <span>${amount}</span>
                </div>
            `;
        }
    }

    detailsHTML += `
            </div>
        </div>

        <div class="modal-section">
            <h3>Dependencies</h3>
            <div class="dependency-tree">
    `;

    const deps = findDependencies(building, type);
    if (deps.length > 0) {
        detailsHTML += deps.map(dep => `<div class="dependency-item">${dep}</div>`).join('');
    } else {
        detailsHTML += '<p style="color: #8892b0;">No dependencies - can be built directly</p>';
    }

    detailsHTML += `
            </div>
        </div>
    `;

    modalBody.innerHTML = detailsHTML;

    // Setup add to plan button
    addToPlanBtn.onclick = () => {
        addToPlan(building, type);
        modal.classList.remove('active');
    };

    modal.classList.add('active');
}

// Find dependencies
function findDependencies(building, type) {
    const deps = [];
    if (building.constructionCost) {
        for (const resource of Object.keys(building.constructionCost)) {
            // Check if resource is another building
            const isHab = habData.habs.find(h => h.id === resource);
            const isCrafting = habData.craftingStations.find(c => c.id === resource);
            const isStorage = habData.cargoStorage.find(s => s.id === resource);

            if (isHab) {
                deps.push(`${isHab.name} (Hab)`);
            } else if (isCrafting) {
                deps.push(`${isCrafting.name} (Crafting Station)`);
            } else if (isStorage) {
                deps.push(`${isStorage.name} (Storage)`);
            }
        }
    }
    return deps;
}

// Setup modal close
function setupModal() {
    const modal = document.getElementById('building-modal');
    const closeBtn = document.querySelector('.close');

    closeBtn.onclick = () => modal.classList.remove('active');
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    };
}

// Plan management
function addToPlan(building, type) {
    const existing = buildPlan.find(item => item.building.id === building.id);
    if (existing) {
        existing.quantity++;
    } else {
        buildPlan.push({ building, type, quantity: 1 });
    }
    updatePlanDisplay();
}

function removeFromPlan(buildingId) {
    buildPlan = buildPlan.filter(item => item.building.id !== buildingId);
    updatePlanDisplay();
}

function updateQuantity(buildingId, delta) {
    const item = buildPlan.find(item => item.building.id === buildingId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        updatePlanDisplay();
    }
}

function updatePlanDisplay() {
    const planList = document.getElementById('plan-list');

    if (buildPlan.length === 0) {
        planList.innerHTML = '<div class="empty-state"><p>No buildings in plan</p><p style="font-size: 0.9rem;">Click on buildings to add them</p></div>';
    } else {
        planList.innerHTML = buildPlan.map(item => `
            <div class="plan-item">
                <div class="plan-item-info">
                    <h4>${item.building.name}</h4>
                    <p>${item.type.charAt(0).toUpperCase() + item.type.slice(1)} - ${formatTime(item.building.constructionTime * item.quantity)}</p>
                </div>
                <div class="plan-item-actions">
                    <div class="plan-item-qty">
                        <button onclick="updateQuantity('${item.building.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.building.id}', 1)">+</button>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removeFromPlan('${item.building.id}')">Remove</button>
                </div>
            </div>
        `).join('');
    }

    updatePlanStats();
}

function updatePlanStats() {
    let totalSlots = 0;
    let totalStorage = 0;
    let totalJobs = 0;
    let totalTime = 0;
    const resources = {};

    buildPlan.forEach(item => {
        const building = item.building;
        const qty = item.quantity;

        totalSlots += (building.slots || 0) * qty;
        totalStorage += (building.storage || 0) * qty;
        totalStorage += (building.storageBonus || 0) * qty;
        totalJobs += (building.jobSlots || 0) * qty;
        totalJobs += (building.jobSlotBonus || 0) * qty;
        totalTime += (building.constructionTime || 0) * qty;

        if (building.constructionCost) {
            for (const [resource, amount] of Object.entries(building.constructionCost)) {
                resources[resource] = (resources[resource] || 0) + (amount * qty);
            }
        }
    });

    document.getElementById('total-slots').textContent = totalSlots;
    document.getElementById('total-storage').textContent = totalStorage;
    document.getElementById('total-jobs').textContent = totalJobs;
    document.getElementById('total-time').textContent = formatTime(totalTime);

    const resourceList = document.getElementById('plan-resources');
    if (Object.keys(resources).length === 0) {
        resourceList.innerHTML = '<p style="color: #8892b0; text-align: center; padding: 1rem;">No resources required</p>';
    } else {
        resourceList.innerHTML = Object.entries(resources)
            .map(([resource, amount]) => `
                <div class="resource-item">
                    <span>${formatResourceName(resource)}</span>
                    <span>${amount}</span>
                </div>
            `).join('');
    }
}

function setupPlanActions() {
    document.getElementById('clear-plan-btn').onclick = () => {
        if (confirm('Clear all buildings from plan?')) {
            buildPlan = [];
            updatePlanDisplay();
        }
    };

    document.getElementById('export-plan-btn').onclick = () => {
        const planData = {
            buildings: buildPlan.map(item => ({
                id: item.building.id,
                name: item.building.name,
                type: item.type,
                quantity: item.quantity
            })),
            summary: {
                totalSlots: parseInt(document.getElementById('total-slots').textContent),
                totalStorage: parseInt(document.getElementById('total-storage').textContent),
                totalJobs: parseInt(document.getElementById('total-jobs').textContent),
                totalTime: document.getElementById('total-time').textContent
            }
        };

        const blob = new Blob([JSON.stringify(planData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hab-build-plan.json';
        a.click();
        URL.revokeObjectURL(url);
    };
}

// Utility functions
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0) {
        return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
}

function formatResourceName(resource) {
    return resource.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Make functions global for onclick handlers
window.showBuildingDetails = showBuildingDetails;
window.removeFromPlan = removeFromPlan;
window.updateQuantity = updateQuantity;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
