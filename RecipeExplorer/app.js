// app.js - Recipe Explorer bootstrap (rebuilt 2026-10-01). Builds the shared ResourceModel from the four data bundles,
// the RecipeModel on top, then the Planner tab and the Analytics tab. URL: ?recipe=<outputId or name> adds that
// recipe to the plan (kept from the previous build for cross-module links), ?search= pre-fills the finder.
class RecipeExplorerApp extends BaseApp {
    constructor() { super(); this.init(); }

    async loadData() {
        const t0 = performance.now();
        const rm = new ResourceModel((window.resourcesData && window.resourcesData.resources) || [], (window.rawRecipeData && window.rawRecipeData.recipes) || [], window.planetData || { mapData: [], regionDefinitions: [] }, (window.rawBuildingData && window.rawBuildingData.buildings) || []);
        this.model = new RecipeModel(rm);
        this.data = this.model.recipes;
        console.log(`Recipe Explorer: ${this.data.length} recipes over ${rm.list.length} resources - models built in ${Math.round(performance.now() - t0)} ms`);
    }

    initializeModules() {
        if (!this.data.length) { console.error('Recipe Explorer: no recipes loaded'); return; }
        this.modules.explorer = new RecipePlanner(this.model);
        this.modules.analytics = new RecipeAnalytics(this.model, this.modules.explorer);
        window.recipePlanner = this.modules.explorer;
        document.addEventListener('visibilitychange', () => document.body.classList.toggle('is-hidden', document.hidden));
    }

    updateInitialView() {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('search');
        if (q) { const input = document.getElementById('searchInput'); if (input) input.value = q; this.modules.explorer.handleSearch(q); }
        const rp = params.get('recipe');
        if (rp) {
            const m = this.model, lower = rp.toLowerCase();
            const r = m.byId.get(rp) || m.recipes.find(x => x.outputId.toLowerCase() === lower) || m.recipes.find(x => x.outputName.toLowerCase() === lower) || m.recipes.find(x => x.outputId.toLowerCase().endsWith('-' + lower));
            if (r) this.modules.explorer.addItem(r.outputId, 1);
        }
    }

    getModalId() { return 'rpNoLegacyModal'; }
}

document.addEventListener('DOMContentLoaded', () => {
    try { window.recipeExplorerApp = new RecipeExplorerApp(); }
    catch (error) { console.error('Recipe Explorer failed to start:', error); }
});
