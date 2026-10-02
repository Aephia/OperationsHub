// app.js - Resources Explorer bootstrap (rebuilt 2026-10-01). Builds the ResourceModel from the four data bundles the
// page loads as globals, then the Explorer tab, the Analytics tab and the resource sheet. ?r=<name> opens a sheet,
// ?search=<text> pre-fills the search (both used by cross-module links).
class ResourcesApp extends BaseApp {
    constructor() {
        super();
        this.init();
    }

    async loadData() {
        const resources = (window.resourcesData && window.resourcesData.resources) || [];
        const recipes = (window.rawRecipeData && window.rawRecipeData.recipes) || [];
        const planets = window.planetData || { mapData: [], regionDefinitions: [] };
        const buildings = (window.rawBuildingData && window.rawBuildingData.buildings) || [];
        const t0 = performance.now();
        this.model = new ResourceModel(resources, recipes, planets, buildings);
        this.data = this.model.list;
        console.log(`Resources Explorer: ${this.data.length} resources, ${recipes.length} recipes, ${this.model.systems.length} systems, ${buildings.length} buildings - model built in ${Math.round(performance.now() - t0)} ms`);
    }

    initializeModules() {
        if (!this.data.length) { console.error('Resources Explorer: no resources loaded'); return; }
        window.resourceVisual = new ResourceVisual(this.model);
        this.modules.explorer = new ResourcesExplorer(this.model);
        this.modules.analytics = new ResourceAnalytics(this.model);
        window.resourcesExplorer = this.modules.explorer;
        document.addEventListener('visibilitychange', () => document.body.classList.toggle('is-hidden', document.hidden));
    }

    updateInitialView() {
        super.updateInitialView();
        const params = new URLSearchParams(window.location.search);
        const q = params.get('search');
        if (q) { const input = document.getElementById('searchInput'); if (input) input.value = q; this.modules.explorer.handleSearch(q); }
        const r = params.get('r');
        if (r && this.model.byName.has(r)) window.resourceVisual.open(r);
    }

    getModalId() { return 'rxNoLegacyModal'; }
}

document.addEventListener('DOMContentLoaded', () => {
    try { window.resourcesApp = new ResourcesApp(); }
    catch (error) { console.error('Resources Explorer failed to start:', error); }
});
