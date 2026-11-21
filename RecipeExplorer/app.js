// app.js - Recipe Explorer bootstrap (rebuilt 2026-10-01). Builds the shared ResourceModel from the four data bundles,
// the RecipeModel on top, then the Planner tab and the Analytics tab. URL: ?recipe=<outputId or name> adds that
// recipe to the plan (kept from the previous build for cross-module links), ?search= pre-fills the finder.
class RecipeExplorerApp extends BaseApp {
    constructor() { super(); this.init(); }

    async loadData() {
        const t0 = performance.now();
        const rm = new ResourceModel((window.resourcesData && window.resourcesData.resources) || [], (window.rawRecipeData && window.rawRecipeData.recipes) || [], window.planetData || { mapData: [], regionDefinitions: [] }, (window.rawBuildingData && window.rawBuildingData.buildings) || []);
        this.model = new RecipeModel(rm);
        // the research path per recipe comes from the Command Deck's model over the same RecipeModel, so the two pages agree
        this.research = window.CommandDeck && window.researchData ? new window.CommandDeck.ResearchModel(window.researchData, this.model, []) : null;
        this.data = this.model.recipes;
        console.log(`Recipe Explorer: ${this.data.length} recipes over ${rm.list.length} resources - models built in ${Math.round(performance.now() - t0)} ms`);
    }

    initializeModules() {
        if (!this.data.length) { console.error('Recipe Explorer: no recipes loaded'); return; }
        this.modules.explorer = new RecipePlanner(this.model, this.research);
        this.modules.analytics = new RecipeAnalytics(this.model, this.modules.explorer);
        window.recipePlanner = this.modules.explorer;
        document.addEventListener('visibilitychange', () => document.body.classList.toggle('is-hidden', document.hidden));
    }

    updateInitialView() {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('search');
        if (q) { const input = document.getElementById('searchInput'); if (input) input.value = q; this.modules.explorer.handleSearch(q); }
        const rp = params.get('recipe');
        // a link naming a tagged (alternative) recipe adds its ITEM with that way picked; a link by NAME adds the
        // item; a bare untagged sibling id adds the item with that recipe, NOT pinned (fix 2 M-b, decided in norm()); a link never
        // changes an entry already in the plan (fix 1 L2)
        if (rp) {
            const hit = this.model.resolveLink(rp);
            if (hit) this.modules.explorer.addItem((hit.way || hit.item).outputId, 1);
        }
        // ?plan=id:qty,id:qty replaces the plan with several recipes at once (the Hub Explorer hands a hab build over this way)
        const pl = params.get('plan');
        if (pl) {
            // tagged ids hold ':' themselves ("candidate:starter:x:hash:2"): a whole part that is an id has qty 1, else
            // the quantity is after the LAST ':'
            // the quantity goes through the one plan-quantity parser (RecipeModel.qty, fix 2 L-b); duplicates of one item + way add up (fix 1 M2)
            const pairs = pl.split(',').map(part => { if (this.model.byId.has(part)) return { id: part, qty: 1 }; const k = part.lastIndexOf(':'); return k >= 0 ? { id: part.slice(0, k), qty: window.RecipeModel.qty(part.slice(k + 1)) } : { id: part, qty: 1 }; });
            this.modules.explorer.setPlan(pairs);
        }
    }

    getModalId() { return 'rpNoLegacyModal'; }
}

document.addEventListener('DOMContentLoaded', () => {
    try { window.recipeExplorerApp = new RecipeExplorerApp(); }
    catch (error) { console.error('Recipe Explorer failed to start:', error); }
});
