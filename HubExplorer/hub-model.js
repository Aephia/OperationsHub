// hub-model.js - Hub Explorer model (rebuilt 2026-10-01). Two sources, joined by id:
//   - JSON/craftingHabBuildings.json (window.craftingHabData): the hab-side stats of the 14 buildings a crafting
//     hab is made of - 5 hab tiers, 4 crafting stations, 5 cargo storages: slots, storage, jobs, speed, fee, xp,
//     install time and the module cost (which includes the PREVIOUS tier: each tier consumes the one before)
//   - JSON/recipes.json (window.rawRecipeData): the 21 HAB_ASSETS recipes that CRAFT those items (habs, stations,
//     storages, plus the landing pads, paints and pet house that the hab JSON does not list) - ingredients, craft
//     time, production steps, starbase level. The Recipe Explorer's planner expands them to raws.
// Cumulative ladders: because tier N consumes tier N-1, reaching tier N from nothing costs the sum of every tier's
// own modules and every tier's install time; the model reports both the step and the cumulative figures.
(function () {
    'use strict';

    const KIND = { hab: 'Hab', station: 'Crafting station', storage: 'Cargo storage', pad: 'Landing pad', decor: 'Decoration' };
    const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const nameOf = id => id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    class HubModel {
        constructor(habData, recipes, resources) {
            this.recipes = (recipes || []).filter(r => r.outputType === 'HAB_ASSETS');
            this.recipeById = new Map(this.recipes.map(r => [r.outputId, r]));
            this.resByName = new Map((resources || []).map(r => [r.name, r]));
            this.resById = new Map((resources || []).map(r => [r.id, r]));
            const H = habData || { habs: [], craftingStations: [], cargoStorage: [] };
            this.items = [];
            (H.habs || []).forEach(b => this.items.push(this.norm(b, 'hab')));
            (H.craftingStations || []).forEach(b => this.items.push(this.norm(b, 'station')));
            (H.cargoStorage || []).forEach(b => this.items.push(this.norm(b, 'storage')));
            // hab assets the JSON does not list: landing pads and decorations come from their recipes only
            this.recipes.forEach(r => {
                if (this.items.some(i => i.id === r.outputId)) return;
                const kind = /landing-pad/.test(r.outputId) ? 'pad' : 'decor';
                this.items.push({ id: r.outputId, name: r.outputName, kind, kindLabel: KIND[kind], tier: null, size: (r.outputId.match(/-(xxs|xs|s|m)$/) || [])[1]?.toUpperCase() || null, slots: null, storage: 0, jobs: 0, speed: null, installTime: null, fee: null, xp: null, cost: {}, prev: null, recipe: r, fromRecipeOnly: true });
            });
            this.items.forEach(i => { i.recipe = i.recipe || this.recipeById.get(i.id) || null; i.prevItem = i.prev ? this.items.find(x => x.id === i.prev) || null : null; });
            this.byId = new Map(this.items.map(i => [i.id, i]));
            this.ladders = { hab: this.ladder('hab'), station: this.ladder('station'), storage: this.ladder('storage'), pad: this.ladder('pad'), decor: this.items.filter(i => i.kind === 'decor') };
        }

        norm(b, kind) {
            const cost = Object.assign({}, b.constructionCost || {});
            let prev = null;
            Object.keys(cost).forEach(k => { if (k.startsWith('hab-') && k !== b.id) { prev = k; delete cost[k]; } });
            return {
                id: b.id, name: b.name, kind, kindLabel: KIND[kind], tier: b.tier || null, size: b.size || null,
                slots: b.slots != null ? b.slots : null, storage: b.resource_storage != null ? b.resource_storage : (b.storageBonus || b.storage || 0),
                jobs: kind === 'hab' ? (b.crafting_job_concurrency || 1) : kind === 'station' ? (b.jobSlots || b.crafting_job_concurrency || 0) : (b.jobSlotBonus || 0),
                speed: b.speedBonus != null ? b.speedBonus : (b.crafting_speed ? b.crafting_speed / 100 : null),
                installTime: b.constructionTime || 0, fee: b.crafting_fee != null ? b.crafting_fee : null, xp: b.xp_value != null ? b.xp_value : null,
                cost, prev, fromRecipeOnly: false
            };
        }

        // cumulative cost and install time from nothing to this rung (walking prev links)
        ladder(kind) {
            const rungs = this.items.filter(i => i.kind === kind).sort((a, b) => (a.tier || 0) - (b.tier || 0) || ['XXS', 'XS', 'S', 'M', 'L'].indexOf(a.size) - ['XXS', 'XS', 'S', 'M', 'L'].indexOf(b.size));
            rungs.forEach(r => {
                const cum = {}; let time = 0, craft = 0; let cur = r; const chain = [];
                while (cur) { chain.unshift(cur); Object.entries(cur.cost).forEach(([k, v]) => { cum[k] = (cum[k] || 0) + v; }); time += cur.installTime || 0; craft += cur.recipe ? (cur.recipe.constructionTime || 0) : 0; cur = cur.prevItem; }
                r.cumCost = cum; r.cumInstall = time; r.cumCraft = craft; r.chain = chain.map(c => c.id);
                r.throughput = r.kind === 'station' ? (r.jobs || 0) * (r.speed || 1) : null;
            });
            return rungs;
        }

        // resource lookup for a cost key (module ids are resource ids, e.g. 'habitat-module')
        resource(key) { return this.resById.get(key) || this.resByName.get(nameOf(key)) || null; }
        label(key) { const r = this.resource(key); return r ? r.name : nameOf(key); }

        // ------------------------------------------------------------- plan
        // items: [{id, qty}]; the hab itself is the first hab in the plan (one hab per plan)
        plan(items) {
            const rows = items.map(it => ({ it, item: this.byId.get(it.id) })).filter(x => x.item);
            const hab = rows.find(x => x.item.kind === 'hab');
            const modules = {}; let install = 0, craft = 0, storage = 0, jobs = 0, slotsUsed = 0;
            const recipesForPlanner = [];
            rows.forEach(({ it, item }) => {
                Object.entries(item.cost).forEach(([k, v]) => { modules[k] = (modules[k] || 0) + v * it.qty; });
                install += (item.installTime || 0) * it.qty;
                craft += (item.recipe ? item.recipe.constructionTime || 0 : 0) * it.qty;
                storage += (item.storage || 0) * it.qty;
                jobs += (item.jobs || 0) * it.qty;
                if (item.kind !== 'hab' && item.slots != null) slotsUsed += item.slots * it.qty;
                if (item.recipe) recipesForPlanner.push({ id: item.recipe.outputId, qty: it.qty });
            });
            const capacity = hab ? hab.item.slots : null;
            const stations = rows.filter(x => x.item.kind === 'station');
            const throughput = stations.reduce((a, x) => a + (x.item.throughput || 0) * x.it.qty, 0) + (hab ? hab.item.jobs : 0);
            const bill = Object.entries(modules).map(([k, n]) => ({ key: k, name: this.label(k), n, res: this.resource(k) })).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
            return { rows, hab: hab ? hab.item : null, bill, install, craft, storage, jobs, slotsUsed, capacity, throughput, recipesForPlanner };
        }
    }

    HubModel.KIND = KIND;
    window.HubModel = HubModel;
})();
