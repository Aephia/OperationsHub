class ResourcesApp extends BaseApp {
    constructor() {
        super();
        this.init();
    }

    async loadData() {
        try {
            console.log('📦 Loading Resources Explorer data...');
            const resourcesData = await DataLoader.loadExplorerData('resources');
            this.data = resourcesData.resources || [];
            console.log(`✅ Loaded ${this.data.length} resources using DataLoader`);
        } catch (error) {
            console.error('💥 Error loading resources data:', error);
            console.error('Detailed error:', error.message);
            this.data = [];
        }
    }

    initializeModules() {
        if (this.data && this.data.length > 0) {
            this.modules.explorer = new ResourcesExplorer(this.data);
            this.modules.analytics = new ResourceAnalytics(this.data);
            this.modules.flowAnalytics = new ResourceFlowAnalytics();

            // Keep backward compatibility
            this.resourcesExplorer = this.modules.explorer;
            this.resourceAnalytics = this.modules.analytics;
            this.flowAnalytics = this.modules.flowAnalytics;

            // Make available globally for modal interactions
            window.resourcesExplorer = this.modules.explorer;
            window.flowAnalytics = this.modules.flowAnalytics;

            console.log(`📈 Modules initialized with ${this.data.length} resources`);
            console.log(`🔬 Found ${this.modules.explorer.allCategories.size} categories and ${this.modules.explorer.allTiers.size} tiers`);

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
                // Play tab switch sound
                if (window.spaceSounds) window.spaceSounds.tabSwitch();

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

                // Load flow analytics when flow tab is clicked
                if (subtab === 'flow' && this.flowAnalytics) {
                    await this.flowAnalytics.renderFlowAnalytics();
                }
            });
        });
    }

    getModalId() {
        return 'resourceModal';
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('⚒️ DOM Content Loaded - Starting Resources App');
    try {
        window.resourcesApp = new ResourcesApp();
        console.log('✅ Resources App instance created successfully');
    } catch (error) {
        console.error('💥 Failed to create Resources App:', error);
    }
});