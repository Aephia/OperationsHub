// app.js - Command Deck bootstrap (2026-10-04). Builds the shared models once (the Resources and Recipe explorers'
// own models, so every count here matches theirs), then the four tabs: Research, Empire, Ships vs Stakes (calc) and
// Loadouts (vs; on the Ship Explorer's ShipConfigCalculator + component bundles + the combat bundle, engine in deck-loadout.js).
// Cross-module links IN:  ?tab=research|empire|calc|vs
//                         ?recipe=<outputId or name>  ?building=<id>  ?ship=<name>  ?stake=<tier>  ?hab=<id>
//                         ?node=<id> (a name still resolves; a name used by two nodes takes its "(after ...)" suffix)
//                         (each opens the Research tab with that goal lit)
class CommandDeckApp extends BaseApp {
    constructor() { super(); this.currentTab = 'research'; this.init(); }

    async loadData() {
        const D = window.CommandDeck;
        const resources = (window.resourcesData && window.resourcesData.resources) || [];
        const recipes = (window.rawRecipeData && window.rawRecipeData.recipes) || [];
        const buildings = window.rawBuildingData || { buildings: [], claimStakeDefinitions: [] };
        this.ships = (window.rawShipData && window.rawShipData.ships) || [];
        this.rm = new ResourceModel(resources, recipes, window.planetData, buildings.buildings);
        this.rc = new RecipeModel(this.rm);
        this.research = new D.ResearchModel(window.researchData, this.rc, this.ships);
        this.se = new D.StakeEngine(buildings, this.rm, window.planetData);
        this.empire = new D.Empire(this.se, this.rc, this.ships, window.combatData && window.combatData.fleetPoints);
        this.loadout = new D.Loadout(this.ships, window.shipComponentsData, window.shipFormulasData, window.ShipConfigCalculator, window.combatData, this.rc);
        this.data = this.research.nodes;
        console.log(`Command Deck: ${this.research.nodes.length} research nodes, ${this.se.planets.length} bodies, ${this.empire.miners.length} mining hulls, ${this.rc.recipes.length} recipes`);
    }

    initializeModules() {
        if (!this.research.nodes.length) console.error('Command Deck: no research data loaded (Data/research-data.js)');
        const ctx = { app: this, rm: this.rm, rc: this.rc, se: this.se, empire: this.empire, research: this.research, ships: this.ships, loadout: this.loadout };
        this.researchTab = new DeckResearchTab(document.getElementById('cdResearch'), this.research, ctx);
        this.empireTab = new DeckEmpireTab(document.getElementById('cdEmpire'), ctx);
        this.calcTab = new DeckCalcTab(document.getElementById('cdCalc'), ctx);
        this.vsTab = new DeckVsTab(document.getElementById('cdVs'), ctx);
        document.addEventListener('visibilitychange', () => document.body.classList.toggle('is-hidden', document.hidden));
        this.applyParams();
    }

    applyParams() {
        const p = new URLSearchParams(window.location.search);
        const kinds = ['recipe', 'building', 'ship', 'stake', 'hab', 'node'];
        const kind = kinds.find(k => p.get(k));
        if (kind) { const g = this.researchTab.makeGoal(kind, p.get(kind)); if (g) this.researchTab.setGoal(g); }
        const tab = p.get('tab');
        if (!kind && (tab === 'empire' || tab === 'calc' || tab === 'vs')) this.switchTab(tab);
    }

    switchTab(tabName) {
        super.switchTab(tabName);
        if (tabName === 'empire') this.empireTab.show();
        if (tabName === 'calc') this.calcTab.show();
        if (tabName === 'vs') this.vsTab.show();
        if (tabName === 'research') this.researchTab.update();
    }

    // the Empire tab hands its whole research need to the tree
    showResearchGoal(kind, extra) {
        const g = this.researchTab.makeGoal(kind, null, extra);
        this.switchTab('research');
        if (g) this.researchTab.setGoal(g);
    }

    updateInitialView() { /* each tab renders itself */ }
    getModalId() { return 'cdNoLegacyModal'; }
}

document.addEventListener('DOMContentLoaded', () => {
    try { window.commandDeckApp = new CommandDeckApp(); }
    catch (error) { console.error('Command Deck failed to start:', error); }
});
