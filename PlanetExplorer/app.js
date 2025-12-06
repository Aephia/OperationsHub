class PlanetApp extends BaseApp {
    constructor() {
        super();
        this.init();
    }

    async loadData() {
        try {
            const planetDataResult = await DataLoader.loadExplorerData('planet');
            this.data = planetDataResult.mapData;
            console.log(`✅ Loaded ${this.data.length} star systems using DataLoader`);
        } catch (error) {
            console.error('💥 Error loading planet data:', error);
            this.data = [];
        }
    }

    initializeModules() {
        if (this.data && this.data.length > 0) {
            this.modules.explorer = new PlanetExplorer(this.data);
            this.modules.analytics = new PlanetResourceAnalytics(this.data);
            this.modules.manufacturingAnalytics = new ManufacturingAnalytics();
            this.modules.territoryAnalytics = new TerritoryAnalytics();

            // Keep backward compatibility
            this.planetExplorer = this.modules.explorer;
            this.resourceAnalytics = this.modules.analytics;
            this.manufacturingAnalytics = this.modules.manufacturingAnalytics;
            this.territoryAnalytics = this.modules.territoryAnalytics;

            // Make available globally for modal interactions
            window.planetExplorer = this.modules.explorer;

            console.log(`📈 Modules initialized with ${this.data.length} star systems`);
            console.log(`🔬 Found ${this.modules.explorer.allResources.size} unique resources`);

            // Initialize sub-tab navigation
            this.initSubTabNavigation();
        } else {
            console.error('❌ Cannot initialize modules - no data available');
        }
    }

    initSubTabNavigation() {
        const subNavButtons = document.querySelectorAll('.sub-nav-tab');
        subNavButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const subtab = e.target.dataset.subtab;

                // Play tab switch sound
                if (window.spaceSounds) window.spaceSounds.tabSwitch();

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

                // Load analytics when tabs are clicked
                if (subtab === 'manufacturing' && this.manufacturingAnalytics) {
                    await this.manufacturingAnalytics.renderManufacturingAnalytics();
                } else if (subtab === 'territory' && this.territoryAnalytics) {
                    await this.territoryAnalytics.renderTerritoryAnalytics();
                }
            });
        });
    }

    getModalId() {
        return 'planetModal';
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM Content Loaded - Starting Planet App');
    try {
        window.planetApp = new PlanetApp();
        console.log('✅ Planet App instance created successfully');
    } catch (error) {
        console.error('💥 Failed to create Planet App:', error);
    }
});