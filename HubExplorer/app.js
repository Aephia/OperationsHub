// app.js - Hub Explorer bootstrap (rebuilt 2026-10-01). Builds HubModel from the hab export (crafting-hab-data.js),
// the recipes and the resources, then the Builder tab and the Ladders tab.
class HubExplorerApp extends BaseApp {
    constructor() { super(); this.init(); }

    async loadData() {
        const hab = window.craftingHabData || { habs: [], craftingStations: [], cargoStorage: [] };
        this.model = new HubModel(hab, (window.rawRecipeData && window.rawRecipeData.recipes) || [], (window.resourcesData && window.resourcesData.resources) || []);
        this.data = this.model.items;
        console.log(`Hub Explorer: ${this.data.length} hab assets, ${this.model.recipes.length} hab-asset recipes`);
    }

    initializeModules() {
        if (!this.data.length) { console.error('Hub Explorer: no hab data loaded'); return; }
        this.modules.explorer = new HubBuilder(this.model);
        this.modules.analytics = new HubLadders(this.model);
        window.hubBuilder = this.modules.explorer;
        document.addEventListener('visibilitychange', () => document.body.classList.toggle('is-hidden', document.hidden));
    }

    updateInitialView() { /* the builder renders itself; nothing to refresh */ }
    getModalId() { return 'hbNoLegacyModal'; }
}

document.addEventListener('DOMContentLoaded', () => {
    try { window.hubExplorerApp = new HubExplorerApp(); }
    catch (error) { console.error('Hub Explorer failed to start:', error); }
});
