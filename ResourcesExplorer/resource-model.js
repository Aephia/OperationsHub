// resource-model.js - Resources Explorer data model (rebuilt 2026-10-01).
// One pass over the loaded bundles (resources, recipes, planets, buildings) that gives every resource the facts the
// export can actually support:
//   - identity: category, tier, release status (v1 = live on chain now, v1-add / v2 = unreleased)
//   - source: for a raw, every planet and belt that carries the deposit (planets.json), best richness, territories,
//     planet types, and whether an extractor family exists in buildings.json (six raws are fleet-mined only);
//     for anything crafted, the recipe that makes it (one per output name, live status first) with its ingredients,
//     construction time, planet types, starbase level and production steps
//   - demand: how many recipes list it as a DIRECT ingredient (each recipe once, all statuses - the same count the
//     Recipe Explorer's Analytics tab shows, e.g. Power Regulation Module 962), and for raws the REACH: how many
//     resources need it anywhere in their tree
//   - chain: the deduplicated supply DAG down to raws (nodes, edges, depth) for the chain graph, and the raw bill
// What the export does NOT support and this model refuses to invent: a value (baseValue is tier x 10 for all 3,526
// resources and stackSize is 100 for every one), supply/demand "bottleneck" scores, criticality formulas.
(function () {
    'use strict';

    const STATUS_RANK = { v1: 0, 'v1-add': 1, v2: 2 };
    const CAT_ORDER = ['raw', 'processed', 'component', 'advanced'];
    const CAT_LABEL = { raw: 'Raw', processed: 'Processed', component: 'Component', advanced: 'Advanced' };
    const PT_NAME = ['Terrestrial', 'Volcanic', 'Barren', 'Asteroid Belt', 'Gas Giant', 'Ice Giant', 'Dark', 'Oceanic'];
    const PT_SLUG = ['terrestrial', 'volcanic', 'barren', 'asteroid-belt', 'gas-giant', 'ice-giant', 'dark', 'oceanic'];
    const FAC = { MUD: 'mud', ONI: 'oni', UST: 'ustur', USTUR: 'ustur', Ustur: 'ustur' };
    const slug = n => String(n || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    class ResourceModel {
        constructor(resources, recipes, planets, buildings) {
            this.list = (resources || []).map(r => Object.assign({}, r));
            this.byName = new Map(this.list.map(r => [r.name, r]));
            this.byId = new Map(this.list.map(r => [r.id, r]));
            this.recipes = recipes || [];
            this.map = planets || { mapData: [], regionDefinitions: [] };
            this.buildings = buildings || [];
            this.regions = new Map((this.map.regionDefinitions || []).map(g => [g.id, g]));
            this._dag = new Map();
            this.build();
        }

        build() {
            this.indexRecipes();
            this.indexDemand();
            this.indexDeposits();
            this.indexExtractors();
            this.list.forEach(r => {
                r.live = r.c4_status === 'v1';
                r.statusLabel = r.live ? 'live' : (r.c4_status === 'v2' ? 'unreleased' : 'added later');
                r.recipe = this.recipeByName.get(r.name) || null;
                r.ingredients = r.recipe ? r.recipe.ingredients.map(i => ({ name: i.name, quantity: i.quantity, res: this.byName.get(i.name) || null })) : [];
                r.depth = this.depthOf(r.name);
                // a stake can run an extractor only on a planet: a kit with belt-only deposits is still fleet-mined
                r.beltOnly = r.category === 'raw' && !!r.deposit && r.deposit.planets === 0 && r.deposit.belts > 0;
                r.stakeMinable = r.category === 'raw' && !!r.extractor && !!r.deposit && r.deposit.planets > 0;
                r.source = r.category === 'raw' ? (r.stakeMinable ? 'mined' : 'fleet') : (r.recipe && r.ingredients.length ? 'crafted' : 'none');
            });
            this.indexReach();
            this.stats = this.computeStats();
        }

        // ------------------------------------------------------------ recipes
        indexRecipes() {
            // one recipe per output name, live status first (a v1 recipe beats a v2 one for the same output)
            this.recipeByName = new Map();
            this.recipes.forEach(r => {
                const cur = this.recipeByName.get(r.outputName);
                if (!cur || (STATUS_RANK[r.c4_status] ?? 3) < (STATUS_RANK[cur.c4_status] ?? 3)) this.recipeByName.set(r.outputName, r);
            });
        }

        indexDemand() {
            // direct demand: each recipe counts once per distinct ingredient name, all statuses
            const direct = new Map(), consumers = new Map();
            this.recipes.forEach(r => {
                const seen = new Set();
                (r.ingredients || []).forEach(i => {
                    if (seen.has(i.name)) return; seen.add(i.name);
                    direct.set(i.name, (direct.get(i.name) || 0) + 1);
                    let c = consumers.get(i.name); if (!c) { c = []; consumers.set(i.name, c); }
                    c.push({ name: r.outputName, id: r.outputId, type: r.outputType, tier: r.outputTier, quantity: i.quantity, status: r.c4_status });
                });
            });
            this.list.forEach(r => {
                r.demand = direct.get(r.name) || 0;
                const c = consumers.get(r.name) || [];
                r.consumers = c;
                r.liveDemand = c.filter(x => x.status === 'v1').length;
            });
            this.maxDemand = Math.max(1, ...this.list.map(r => r.demand));
        }

        // ------------------------------------------------------------ deposits
        indexDeposits() {
            const dep = new Map();
            (this.map.mapData || []).forEach(s => {
                const terr = FAC[s.closestFaction] || FAC[s.faction] || slug(s.closestFaction || s.faction || '');
                const reg = this.regions.get(s.regionId);
                (s.planets || []).forEach((p, pi) => {
                    const cat = p.type % 8, belt = cat === 3;
                    (p.resources || []).forEach(q => {
                        let d = dep.get(q.name);
                        if (!d) { d = { planets: 0, belts: 0, best: 0, fac: { mud: 0, oni: 0, ustur: 0 }, types: new Map(), systems: new Map(), top: [], regions: new Map() }; dep.set(q.name, d); }
                        if (belt) d.belts++; else { d.planets++; d.fac[terr] = (d.fac[terr] || 0) + 1; }
                        d.types.set(cat, (d.types.get(cat) || 0) + 1);
                        if (q.richness > d.best) d.best = q.richness;
                        const sysKey = s.key;
                        const se = d.systems.get(sysKey) || { key: sysKey, name: s.name || sysKey, xy: s.coordinates, terr, best: 0, n: 0 };
                        se.n++; se.best = Math.max(se.best, q.richness); d.systems.set(sysKey, se);
                        if (reg) { const re = d.regions.get(reg.id) || { name: reg.name, n: 0, safe: typeof reg.risk_zone !== 'string' }; re.n++; d.regions.set(reg.id, re); }
                        d.top.push({ key: sysKey + ':' + pi, name: p.name, system: s.name || sysKey, terr, cat, richness: q.richness, belt });
                    });
                });
            });
            dep.forEach(d => {
                d.top.sort((a, b) => b.richness - a.richness || (a.belt - b.belt) || a.name.localeCompare(b.name));
                d.top = d.top.slice(0, 12);
                d.typeList = Array.from(d.types.entries()).sort((a, b) => b[1] - a[1]).map(([cat, n]) => ({ cat, name: PT_NAME[cat], slug: PT_SLUG[cat], n }));
                d.systemList = Array.from(d.systems.values());
                d.regionList = Array.from(d.regions.values()).sort((a, b) => b.n - a.n);
            });
            this.deposits = dep;
            this.list.forEach(r => { r.deposit = r.category === 'raw' ? (dep.get(r.name) || null) : null; });
            this.systems = (this.map.mapData || []).map(s => ({ key: s.key, name: s.name || s.key, xy: s.coordinates, terr: FAC[s.closestFaction] || FAC[s.faction] || 'none' }));
        }

        indexExtractors() {
            const ext = new Map();
            this.buildings.forEach(b => {
                if (!(b.addedTags || []).includes('extractor') || !b.resourceExtractionRate) return;
                const dep = b.id.replace(/-extractor-t\d$/, '');
                const rate = Object.values(b.resourceExtractionRate)[0];
                const e = ext.get(dep) || { tiers: new Map(), name: b.name.replace(/\s+Extractor$/, '') };
                e.tiers.set(b.tier, rate); ext.set(dep, e);
            });
            this.extractors = ext;
            this.list.forEach(r => {
                if (r.category !== 'raw') return;
                const e = ext.get(r.id) || ext.get(slug(r.name));
                r.extractor = e ? { t1: e.tiers.get(1) || null, tiers: Array.from(e.tiers.keys()).sort() } : null;
            });
        }

        // ------------------------------------------------------------ chain
        // The supply DAG under a resource name: nodes (unique names), edges (unique parent -> child with quantity),
        // depth = longest path to a leaf. Memoised per name. Leaves are raws, or anything with no recipe.
        dag(name) {
            if (this._dag.has(name)) return this._dag.get(name);
            const nodes = new Map(), edges = [];
            const seenEdge = new Set();
            const walk = (n, trail) => {
                if (nodes.has(n)) return nodes.get(n).depth;
                const res = this.byName.get(n), rec = this.recipeByName.get(n);
                const leaf = (res && res.category === 'raw') || !rec || !rec.ingredients || !rec.ingredients.length;
                const node = { name: n, res: res || null, depth: 0, leaf, parents: 0 };
                nodes.set(n, node);
                if (leaf || trail.has(n)) return 0;
                trail.add(n);
                let depth = 0;
                rec.ingredients.forEach(i => {
                    const k = n + '\u0000' + i.name;
                    if (!seenEdge.has(k)) { seenEdge.add(k); edges.push({ from: n, to: i.name, quantity: i.quantity }); }
                    depth = Math.max(depth, 1 + walk(i.name, trail));
                });
                trail.delete(n);
                node.depth = depth;
                return depth;
            };
            walk(name, new Set());
            edges.forEach(e => { nodes.get(e.to).parents++; });
            const out = { root: name, nodes, edges, depth: nodes.get(name).depth };
            this._dag.set(name, out);
            return out;
        }

        depthOf(name) { return this.dag(name).depth; }

        // raws under a resource, with how many distinct recipes in its tree use each one
        rawBill(name) {
            const d = this.dag(name), bill = new Map();
            d.nodes.forEach(n => { if (n.res && n.res.category === 'raw' && n.name !== name) bill.set(n.name, { res: n.res, parents: n.parents }); });
            return Array.from(bill.values()).sort((a, b) => b.parents - a.parents || a.res.name.localeCompare(b.res.name));
        }

        indexReach() {
            // reach of a raw = number of resources whose tree contains it; computed by walking each resource's DAG once
            const reach = new Map();
            this.list.forEach(r => {
                if (r.category === 'raw') return;
                const d = this.dag(r.name);
                d.nodes.forEach(n => { if (n.res && n.res.category === 'raw') reach.set(n.name, (reach.get(n.name) || 0) + 1); });
            });
            this.list.forEach(r => { r.reach = r.category === 'raw' ? (reach.get(r.name) || 0) : 0; r.nodeCount = this.dag(r.name).nodes.size - 1; });
            this.maxReach = Math.max(1, ...this.list.map(r => r.reach));
        }

        // ------------------------------------------------------------ stats
        computeStats() {
            const byCat = {}, byTier = {}, byCatTier = {}, byStatus = { live: 0, unreleased: 0 }, byCatStatus = {};
            const depthHist = new Map(), ingHist = new Map();
            CAT_ORDER.forEach(c => { byCat[c] = 0; byCatTier[c] = [0, 0, 0, 0, 0, 0]; byCatStatus[c] = { live: 0, unreleased: 0 }; });
            this.list.forEach(r => {
                byCat[r.category] = (byCat[r.category] || 0) + 1;
                byTier[r.tier] = (byTier[r.tier] || 0) + 1;
                if (byCatTier[r.category]) byCatTier[r.category][r.tier] = (byCatTier[r.category][r.tier] || 0) + 1;
                const st = r.live ? 'live' : 'unreleased';
                byStatus[st]++; if (byCatStatus[r.category]) byCatStatus[r.category][st]++;
                const dh = depthHist.get(r.depth) || { raw: 0, processed: 0, component: 0, advanced: 0 }; dh[r.category] = (dh[r.category] || 0) + 1; depthHist.set(r.depth, dh);
                if (r.recipe) { const k = r.ingredients.length; const ih = ingHist.get(k) || { raw: 0, processed: 0, component: 0, advanced: 0 }; ih[r.category]++; ingHist.set(k, ih); }
            });
            const raws = this.list.filter(r => r.category === 'raw');
            const typeRaws = PT_NAME.map((name, cat) => ({ cat, name, slug: PT_SLUG[cat], raws: raws.filter(r => r.deposit && r.deposit.types.has(cat)).length }));
            const gaps = {
                noRecipe: this.list.filter(r => r.category !== 'raw' && !r.recipe),
                fleetOnly: raws.filter(r => !r.extractor),
                beltOnly: raws.filter(r => r.beltOnly),
                stakeless: raws.filter(r => !r.stakeMinable),
                outputsNotResources: (() => { const m = new Map(); this.recipeByName.forEach((r, n) => { if (!this.byName.has(n)) m.set(r.outputType || 'other', (m.get(r.outputType || 'other') || 0) + 1); }); return Array.from(m.entries()).sort((a, b) => b[1] - a[1]); })(),
                stepsMismatch: this.list.filter(r => r.recipe && r.recipe.productionSteps != null && r.recipe.productionSteps !== r.depth).length
            };
            return { total: this.list.length, byCat, byTier, byCatTier, byStatus, byCatStatus, depthHist, ingHist, typeRaws, gaps, raws: raws.length, maxDepth: Math.max(...this.list.map(r => r.depth)) };
        }
    }

    ResourceModel.CAT_ORDER = CAT_ORDER;
    ResourceModel.CAT_LABEL = CAT_LABEL;
    ResourceModel.PT_NAME = PT_NAME;
    ResourceModel.PT_SLUG = PT_SLUG;
    ResourceModel.slug = slug;
    window.ResourceModel = ResourceModel;
})();
