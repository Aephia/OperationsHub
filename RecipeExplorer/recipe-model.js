// recipe-model.js - Recipe Explorer model (rebuilt 2026-10-01). Sits on top of ResourceModel (shared with the
// Resources Explorer: recipe per output name live-first, deduplicated supply DAG, deposits, extractor kits) and adds
// what a PRODUCTION PLAN needs:
//   - every recipe by outputId (5,251; 318 output names repeat across tiers, so the plan keys by id)
//   - expand(recipeId, qty): walk the tree with quantities - units needed and crafts per intermediate
//     (crafts = ceil(units / outputQuantity)), raw totals, the aggregated DAG with quantities on the edges
//   - plan(items): the merged bill for several recipes: raws (with stake-minable / belt-only / fleet flags from
//     ResourceModel), craft list in build order (deepest first), time: critical path (longest chain of
//     constructionTime, everything in parallel) and total craft time (every craft in sequence), where it can be
//     crafted (planet types common to every crafted step, highest starbase level, faction limits), release status
// constructionTime is read as seconds, as the ClaimStake Explorer reads it (units are not stated in the export).
(function () {
    'use strict';

    const STATUS_RANK = { v1: 0, 'v1-add': 1, v2: 2 };
    const TYPE_LABEL = {
        BUILDING: 'Building', SHIP_WEAPONS: 'Ship weapon', SHIP_COMPONENTS: 'Ship component', COUNTERMEASURES: 'Countermeasure', MISSILES: 'Missile',
        COMPONENT: 'Component', SHIP_MODULES: 'Ship module', INGREDIENT: 'Ingredient', 'BASIC RESOURCE': 'Basic resource', SHIP: 'Ship',
        'ORGANIC CONSUMABLE': 'Organic consumable', HAB_ASSETS: 'Hab asset', DRONE: 'Drone', 'BASIC ORGANIC RESOURCE': 'Basic organic', 'ORGANIC COMPONENT': 'Organic component', R4: 'R4'
    };
    const TYPE_ORDER = ['SHIP', 'SHIP_COMPONENTS', 'SHIP_MODULES', 'SHIP_WEAPONS', 'MISSILES', 'COUNTERMEASURES', 'DRONE', 'COMPONENT', 'INGREDIENT', 'BUILDING', 'HAB_ASSETS', 'ORGANIC CONSUMABLE', 'ORGANIC COMPONENT', 'BASIC RESOURCE', 'BASIC ORGANIC RESOURCE', 'R4'];

    class RecipeModel {
        constructor(resourceModel) {
            this.rm = resourceModel;
            this.recipes = resourceModel.recipes.map(r => Object.assign({}, r, {
                typeLabel: TYPE_LABEL[r.outputType] || r.outputType,
                starbase: parseInt(String(r.min_starbase_level || '').replace(/\D/g, ''), 10) || 1,
                factionOnly: (r.factions || []).length && r.factions.length < 3 ? r.factions.join(', ') : '',
                ingredientCount: new Set((r.ingredients || []).map(i => i.name)).size,
                outputQuantity: r.outputQuantity || 1,
                isResource: resourceModel.byName.has(r.outputName)
            }));
            this.byId = new Map(this.recipes.map(r => [r.outputId, r]));
            this.recipes.forEach(r => { r.depth = this.rm.dag(r.outputName).depth; r.nodeCount = this.rm.dag(r.outputName).nodes.size - 1; });
            this.stats = this.computeStats();
        }

        // --------------------------------------------------------------- expansion with quantities
        // returns { units: Map(name -> units), crafts: Map(name -> crafts), raws: Map(name -> units), nodes, edges, time }
        expand(items) {
            const units = new Map(), crafts = new Map(), raws = new Map(), nodes = new Map(), edges = new Map();
            const stepTime = new Map();
            const addNode = (name, cat, recipe) => { if (!nodes.has(name)) nodes.set(name, { name, res: this.rm.byName.get(name) || null, cat, recipe: recipe || null, leaf: !recipe }); };
            const walk = (name, qty, trail, viaRecipe) => {
                const res = this.rm.byName.get(name);
                const rec = viaRecipe || this.rm.recipeByName.get(name);
                const isRaw = res && res.category === 'raw';
                const craftable = !isRaw && rec && rec.ingredients && rec.ingredients.length && !trail.has(name);
                units.set(name, (units.get(name) || 0) + qty);
                if (!craftable) { addNode(name, isRaw ? 'raw' : (res ? res.category : 'processed'), null); if (isRaw || !rec || !rec.ingredients || !rec.ingredients.length) raws.set(name, (raws.get(name) || 0) + qty); return; }
                addNode(name, res ? res.category : 'processed', rec);
                const n = Math.ceil(qty / (rec.outputQuantity || 1));
                crafts.set(name, (crafts.get(name) || 0) + n);
                stepTime.set(name, rec.constructionTime || 0);
                trail.add(name);
                rec.ingredients.forEach(i => {
                    const k = name + '\u0000' + i.name; const e = edges.get(k) || { from: name, to: i.name, quantity: 0, per: i.quantity };
                    e.quantity += i.quantity * n; edges.set(k, e);
                    walk(i.name, i.quantity * n, trail, null);
                });
                trail.delete(name);
            };
            items.forEach(it => { const rec = this.byId.get(it.id); if (!rec) return; walk(rec.outputName, it.qty, new Set(), rec); });
            // critical path: longest constructionTime chain from any leaf up to a root (DAG, memoised)
            const kids = new Map(); edges.forEach(e => (kids.get(e.from) || kids.set(e.from, []).get(e.from)).push(e.to));
            const memo = new Map();
            const longest = n => { if (memo.has(n)) return memo.get(n); const own = stepTime.get(n) || 0; const below = (kids.get(n) || []).map(longest); const v = own + (below.length ? Math.max(...below) : 0); memo.set(n, v); return v; };
            const roots = items.map(it => this.byId.get(it.id)).filter(Boolean).map(r => r.outputName);
            const critical = roots.length ? Math.max(...roots.map(longest)) : 0;
            let sequential = 0; crafts.forEach((n, name) => { sequential += n * (stepTime.get(name) || 0); });
            return { units, crafts, raws, nodes, edges: Array.from(edges.values()), time: { critical, sequential }, roots };
        }

        // --------------------------------------------------------------- plan sheet
        plan(items) {
            const x = this.expand(items);
            const rawList = Array.from(x.raws.entries()).map(([name, qty]) => { const res = this.rm.byName.get(name); return { name, qty, res, stake: !!(res && res.stakeMinable), beltOnly: !!(res && res.beltOnly), fleet: !!(res && res.category === 'raw' && !res.stakeMinable), unknown: !res }; }).sort((a, b) => b.qty - a.qty || a.name.localeCompare(b.name));
            const craftList = Array.from(x.crafts.entries()).map(([name, n]) => { const node = x.nodes.get(name); const rec = node.recipe; return { name, crafts: n, units: x.units.get(name), rec, res: node.res, depth: this.rm.dag(name).depth, time: (rec.constructionTime || 0) * n, each: rec.constructionTime || 0, ingredients: rec.ingredients.map(i => ({ name: i.name, qty: i.quantity * n })) }; }).sort((a, b) => a.depth - b.depth || b.crafts - a.crafts || a.name.localeCompare(b.name));
            // where: planet types common to every crafted step; starbase: max; factions: intersection; status
            // where: planet types common to the plan's FINAL recipes (every intermediate has its own list, and the
            // intersection over a whole chain is empty for any real plan); starbase: max over every step
            let where = null; let starbase = 1; let factions = null;
            items.forEach(it => { const rec = this.byId.get(it.id); if (!rec) return; const pts = (rec.planetTypes || []).map(t => t.replace(/ Planet$/, '')); if (!pts.includes('All Types')) where = where === null ? new Set(pts) : new Set(pts.filter(t => where.has(t))); });
            craftList.forEach(c => {
                starbase = Math.max(starbase, parseInt(String(c.rec.min_starbase_level || '').replace(/\D/g, ''), 10) || 1);
                const f = c.rec.factions || []; if (f.length && f.length < 3) factions = factions === null ? new Set(f) : new Set(f.filter(v => factions.has(v)));
            });
            const byDepth = new Map(); craftList.forEach(c => { const d = byDepth.get(c.depth) || { depth: c.depth, crafts: 0, time: 0, names: [] }; d.crafts += c.crafts; d.time += c.time; d.names.push(c.name); byDepth.set(c.depth, d); });
            return {
                items, raws: rawList, crafts: craftList, time: x.time, nodes: x.nodes, edges: x.edges, roots: x.roots,
                where: where === null ? ['All types'] : Array.from(where).sort(), starbase, factions: factions === null ? [] : Array.from(factions),
                stages: Array.from(byDepth.values()).sort((a, b) => a.depth - b.depth),
                totals: { rawUnits: rawList.reduce((a, r) => a + r.qty, 0), rawKinds: rawList.length, crafts: craftList.reduce((a, c) => a + c.crafts, 0), steps: craftList.length, stakeless: rawList.filter(r => r.fleet).length }
            };
        }

        // the DAG for ChainGraph: a plan with one root draws that recipe's chain; several get a virtual "Plan" root
        planDag(p) {
            const nodes = new Map(p.nodes);
            let root;
            if (p.roots.length === 1) root = p.roots[0];
            else { root = 'Production plan'; nodes.set(root, { name: root, res: null, cat: 'plan', leaf: false }); }
            const edges = p.edges.slice();
            if (p.roots.length > 1) p.items.forEach(it => { const r = this.byId.get(it.id); if (r) edges.unshift({ from: root, to: r.outputName, quantity: it.qty, per: 1 }); });
            return { root, nodes, edges };
        }

        // --------------------------------------------------------------- analytics
        computeStats() {
            const byType = new Map(), byStar = [0, 0, 0, 0, 0, 0], timeBuckets = new Map(), ptByType = new Map(), factionOnly = { MUD: 0, ONI: 0, USTUR: 0 };
            const TB = [[0, '0'], [60, '≤ 1 min'], [600, '≤ 10 min'], [1800, '≤ 30 min'], [3600, '≤ 1 h'], [14400, '≤ 4 h'], [Infinity, '> 4 h']];
            this.recipes.forEach(r => {
                const t = byType.get(r.outputType) || { type: r.outputType, label: r.typeLabel, n: 0, time: 0, resources: 0, ingredients: 0, tiers: [0, 0, 0, 0, 0, 0] };
                t.n++; t.time += r.constructionTime || 0; if (r.isResource) t.resources++; t.ingredients += r.ingredientCount; t.tiers[r.outputTier] = (t.tiers[r.outputTier] || 0) + 1; byType.set(r.outputType, t);
                byStar[r.starbase] = (byStar[r.starbase] || 0) + 1;
                const b = TB.find(([lim]) => (r.constructionTime || 0) <= lim)[1]; const tb = timeBuckets.get(b) || {}; tb[r.outputType] = (tb[r.outputType] || 0) + 1; timeBuckets.set(b, tb);
                (r.planetTypes || []).forEach(pt => { const k = pt.replace(/ Planet$/, ''); const m = ptByType.get(k) || {}; m[r.outputType] = (m[r.outputType] || 0) + 1; ptByType.set(k, m); });
                if (r.factionOnly) factionOnly[r.factions[0]] = (factionOnly[r.factions[0]] || 0) + 1;
            });
            const types = TYPE_ORDER.filter(t => byType.has(t)).map(t => byType.get(t));
            const longest = this.recipes.slice().sort((a, b) => (b.constructionTime || 0) - (a.constructionTime || 0)).slice(0, 8);
            const deepest = this.recipes.slice().sort((a, b) => b.depth - a.depth || b.nodeCount - a.nodeCount).slice(0, 8);
            const exotic = this.recipes.filter(r => r.exotic), research = this.recipes.filter(r => r.research_requirements && r.research_requirements.length);
            return { total: this.recipes.length, types, byStar, timeBuckets: TB.map(([, l]) => [l, timeBuckets.get(l) || {}]), ptByType, factionOnly, longest, deepest, exotic, research, outputsNotResources: this.recipes.filter(r => !r.isResource).length };
        }
    }

    RecipeModel.TYPE_LABEL = TYPE_LABEL;
    RecipeModel.TYPE_ORDER = TYPE_ORDER;
    window.RecipeModel = RecipeModel;
})();
