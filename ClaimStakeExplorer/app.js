// Updated with DOM safety checks - v2025-09-26
class ClaimStakeApp {
    constructor() {
        this.data = null;
        this.buildingExplorer = null;
        this.buildingAnalytics = null;
        this.currentTab = 'explorer';
        this.init();
    }

    async init() {
        await this.loadData();
        this.initializeModules();
        this.setupEventListeners();
        this.updateInitialView();
    }

    async loadData() {
        try {
            // Check if DataLoader is available
            if (typeof DataLoader === 'undefined') {
                console.error('DataLoader is not available! Make sure DataLoader.js is loaded before app.js');
                throw new Error('DataLoader is not defined');
            }

            this.data = await DataLoader.loadExplorerData('claimstake');

            if (!this.data || this.data.allBuildings.length === 0) {
                console.error('No building data loaded');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = { allBuildings: [], categories: [], metadata: { tiers: [], resources: [], constructionMaterials: [], buildingTypes: [] } };
        }
    }

    initializeModules() {
        const explorerElements = ['tierFilters', 'buildingsContainer'];
        const missingExplorerElements = explorerElements.filter(id => !document.getElementById(id));
        const analyticsRoot = document.getElementById('analyticsContent');

        if (!this.data || this.data.allBuildings.length === 0) {
            console.error('Cannot initialize modules - no data available');
            return;
        }

        try {
            if (missingExplorerElements.length === 0) {
                this.buildingExplorer = new BuildingExplorer(this.data);
                window.buildingExplorer = this.buildingExplorer; // Available globally for modal interactions
            }

            if (analyticsRoot) {
                this.buildingAnalytics = new BuildingAnalytics(this.data);
                window.buildingAnalytics = this.buildingAnalytics; // Available globally for planet modal
            }

            // Initialize sub-tab navigation
            this.initSubTabNavigation();
        } catch (error) {
            console.error('Error initializing modules:', error.message);
        }
    }

    initSubTabNavigation() {
        const subNavButtons = document.querySelectorAll('.sub-nav-tab');
        subNavButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const subtab = e.target.dataset.subtab;

                // Remove active class from all sub-tabs
                document.querySelectorAll('.sub-nav-tab').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.subtab-content').forEach(content => content.classList.remove('active'));

                // Add active class to clicked button
                e.target.classList.add('active');

                // Show corresponding content
                const subtabContent = document.getElementById(`${subtab}AnalyticsSubtab`);
                if (subtabContent) {
                    subtabContent.classList.add('active');
                }
            });
        });
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const closeModal = document.getElementById('closeModal');
        const modal = document.getElementById('buildingModal');
        const navTabs = document.querySelectorAll('.nav-tab');

        // Explorer search events
        if (searchInput && this.buildingExplorer) {
            searchInput.addEventListener('input', (e) => {
                this.buildingExplorer.handleSearch(e.target.value);
            });
        }

        // Modal events
        if (closeModal && modal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }

        // Tab switching events
        if (navTabs.length > 0) {
            navTabs.forEach((tab) => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetTab = e.target.getAttribute('data-tab');
                    this.switchTab(targetTab);
                });
            });
        }
    }

    async switchTab(tabName) {
        const navTabs = document.querySelectorAll('.nav-tab');
        const targetTabButton = document.querySelector(`[data-tab="${tabName}"]`);
        const targetTabContent = document.getElementById(`${tabName}Tab`);

        if (navTabs.length > 0 && targetTabButton && targetTabContent) {
            // Remove active from all tabs
            navTabs.forEach(tab => tab.classList.remove('active'));

            // Add active to target tab
            targetTabButton.classList.add('active');

            // Show/hide tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            targetTabContent.classList.add('active');
            this.currentTab = tabName;

            // Render appropriate content for the tab
            if (tabName === 'analytics' && this.buildingAnalytics) {
                document.getElementById('analyticsContent').innerHTML = '';
                await this.buildingAnalytics.renderAnalytics();
            } else if (tabName === 'explorer' && this.buildingExplorer) {
                this.buildingExplorer.renderBuildings();
                this.buildingExplorer.updateStats();
            } else if (tabName === 'construction') {
                if (typeof initializeConstructionTab === 'function') {
                    initializeConstructionTab(this.data);
                }
            }
        } else {
            console.error('Tab switch failed - missing elements');
        }
    }

    updateInitialView() {
        if (this.buildingExplorer) {
            this.buildingExplorer.renderBuildings();
            this.buildingExplorer.updateStats();
        }
    }

    updateStats() {
        if (this.buildingExplorer) {
            this.buildingExplorer.updateStats();
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM Content Loaded - Starting ClaimStake App');
    try {
        window.claimStakeApp = new ClaimStakeApp();
        console.log('✅ ClaimStake App instance created successfully');
    } catch (error) {
        console.error('💥 Failed to create ClaimStake App:', error);
    }
});
