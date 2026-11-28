// recipe-craftable-check.js - Recipe Explorer: "Craftable now" from what you hold in C4 (2026-11-27).
//   node Test/recipe-craftable-check.js
// Node check (no browser) of RecipeModel.craftsFrom and the craft filter of findRecipeRows on the hub's own recipes,
// and of the finder wiring in recipe-plan.js. Each mutant must make at least one check fail.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
global.window = global;
const load = f => require(path.join(ROOT, f));
const D = { buildings: load('Data/buildings-data.js'), recipes: load('Data/recipes-data.js'), resources: load('Data/resources-data.js'), planets: load('Data/planet-data.js') };
load('ResourcesExplorer/resource-model.js'); load('RecipeExplorer/recipe-model.js');
const SRC = fs.readFileSync(path.join(ROOT, 'RecipeExplorer/recipe-model.js'), 'utf8');
const rm = new window.ResourceModel(D.resources.resources, D.recipes.recipes, D.planets, D.buildings.buildings);

function model(src) {
    if (!src) return new window.RecipeModel(rm);
    const box = { window: {}, module: undefined }; vm.runInNewContext(src, box);
    return new box.window.RecipeModel(rm);
}
function run(m, quiet) {
    const fails = []; let n = 0;
    const check = (name, ok, detail) => { n++; if (!ok) { fails.push(name); if (!quiet) console.log('  FAIL ' + name + (detail ? '  <- ' + detail : '')); } };
    try {
        // subject: a recipe with two or more distinct ingredients
        const r = m.recipes.find(x => x.ingredients && x.ingredients.length >= 2 && x.ingredients.every(i => i.quantity > 0) && new Set(x.ingredients.map(i => i.name)).size === x.ingredients.length);
        const full = k => new Map(r.ingredients.map(i => [i.name, i.quantity * k]));
        check('[1] stock for exactly one craft, and for three', m.craftsFrom(r, full(1)) === 1 && m.craftsFrom(r, full(3)) === 3);
        const short = full(3); short.set(r.ingredients[0].name, r.ingredients[0].quantity * 3 - 1);
        check('[1] one unit short of the third craft on one ingredient: two crafts', m.craftsFrom(r, short) === 2, String(m.craftsFrom(r, short)));
        const miss = full(5); miss.delete(r.ingredients[1].name);
        check('[1] one ingredient not held: no craft', m.craftsFrom(r, miss) === 0);
        check('[1] no stock, an empty stock, a recipe with no ingredients: no craft', m.craftsFrom(r, null) === 0 && m.craftsFrom(r, new Map()) === 0 && m.craftsFrom({ ingredients: [] }, full(9)) === 0 && m.craftsFrom(null, full(9)) === 0);
        check('[1] an ingredient listed twice is summed', m.craftsFrom({ ingredients: [{ name: 'A', quantity: 2 }, { name: 'A', quantity: 3 }] }, new Map([['A', 9]])) === 1 && m.craftsFrom({ ingredients: [{ name: 'A', quantity: 2 }, { name: 'A', quantity: 3 }] }, new Map([['A', 10]])) === 2);
        const count = g => g.reduce((a, x) => a + x.rows.length, 0), all = count(m.findRecipeRows({}));
        const rows = m.findRecipeRows({ craft: full(1) }).reduce((a, g) => a.concat(g.rows), []);
        check('[2] the filter keeps only rows craftable from the stock, the subject among them', rows.length > 0 && rows.length < all && rows.includes(r) && rows.every(x => m.craftsFrom(x, full(1)) > 0), rows.length + ' of ' + all);
        // independent recount: every way of every finder row, tested by hand against the stock
        let want = 0; const st = full(1);
        m.finderRows().forEach(x => m.wayRecipes(x.r).forEach(w => { const need = new Map(); (w.ingredients || []).forEach(i => need.set(i.name, (need.get(i.name) || 0) + i.quantity)); if (need.size && [...need].every(([k, q]) => (st.get(k) || 0) >= q)) want++; }));
        check('[2] the filtered count equals a recount by hand over every recipe row', rows.length === want, rows.length + ' vs ' + want);
        check('[2] no stock given: nothing is filtered', count(m.findRecipeRows({ craft: null })) === all && all === count(m.findRecipeRows()));
        check('[2] the craft filter combines with the others', (g => g.every(x => x.rows.every(w => String(w.outputTier) === String(r.outputTier))) && count(g) > 0 && count(g) <= rows.length)(m.findRecipeRows({ craft: full(1), tiers: new Set([String(r.outputTier)]) })));
        check('[2] an empty stock map shows no recipe', count(m.findRecipeRows({ craft: new Map() })) === 0);
    } catch (e) { check('model (threw)', false, e.stack); }
    return { fails, n };
}
function wiring() {
    const fails = []; let n = 0;
    const check = (name, ok) => { n++; if (!ok) { fails.push(name); console.log('  FAIL ' + name); } };
    const plan = fs.readFileSync(path.join(ROOT, 'RecipeExplorer/recipe-plan.js'), 'utf8'), css = fs.readFileSync(path.join(ROOT, 'RecipeExplorer/recipe-visual.css'), 'utf8');
    check('[3] the finder has the inventory block and its chip toggles the filter', /<div id="rpCraftBox"><\/div>/.test(plan) && /if \(g === 'craft'\) \{ this\.filters\.craft = !this\.filters\.craft;/.test(plan) && /data-group="craft"/.test(plan));
    check('[3] the list is filtered by the stock only while the chip is on', /const stockNow = f\.craft \? this\.invStock\(\) : null;/.test(plan) && /findRecipeRows\(Object\.assign\(\{\}, f, \{ craft: stockNow \}\)\)/.test(plan));
    check('[3] a profile or data change redraws the chip and the list; Clear filters switches it off', /this\.renderPlan\(\); this\.redrawCraft\(\); \};/.test(plan) && /this\.filters\.craft = false; this\.filters\.q = '';/.test(plan));
    // behaviour, on the tab's prototype with no DOM: the list is filtered anew only when the filter is or was on
    try { load('RecipeExplorer/recipe-plan.js'); } catch (e) { /* reported by the check below */ }
    const P = window.RecipePlanner && window.RecipePlanner.prototype;
    if (P && P.redrawCraft) {
        const mk = (craft, after) => { const calls = []; const t = { filters: { craft }, renderCraftBox() { this.filters.craft = after; }, applyFinder() { calls.push('apply'); }, renderList() { calls.push('list'); } }; P.redrawCraft.call(t); return calls.join(); };
        check('[3] filter off: only the marks are redrawn (the paging stays)', mk(false, false) === 'list');
        check('[3] filter on, or just switched off because the stock went away: the list is filtered anew', mk(true, true) === 'apply' && mk(true, false) === 'apply');
    } else check('[3] the planner class is reachable for the behaviour checks', false);
    check('[3] the stock is whatever you hold, not the plan\'s switch, and the list draws without it', /invStock\(\) \{\s+const m = this\.c4 && this\.c4\.mine; if \(!m\) return null;/.test(plan));
    check('[3] the "can craft" mark has a rule as heavy as the row\'s kind mark', /\.rp-row-main span em\.rp-can \{[^}]*color:/.test(css));
    return { fails, n };
}

console.log('recipe-craftable-check');
const base = run(model(), false), w = wiring();
let failed = base.fails.length + w.fails.length;
console.log('mutants');
const MUTANTS = [
    ['rounded up to a craft the stock does not allow', "Math.floor((stock.get(name) || 0) / q)", "Math.ceil((stock.get(name) || 0) / q)"],
    ['any one ingredient is enough', "let n = Infinity; need.forEach((q, name) => { n = Math.min(n,", "let n = 0; need.forEach((q, name) => { n = Math.max(n,"],
    ['a repeated ingredient counted once', "need.set(i.name, (need.get(i.name) || 0) + i.quantity); });\n            if (!need.size) return 0;", "need.set(i.name, i.quantity); });\n            if (!need.size) return 0;"],
    ['the filter ignored', "&& (!f.craft || this.craftsFrom(r, f.craft) > 0)", ""],
    ['a recipe with no ingredients is craftable', "if (!stock || !r || !r.ingredients || !r.ingredients.length) return 0;", "if (!stock || !r || !r.ingredients) return 0; if (!r.ingredients.length) return 1;"]
];
for (const [name, from, to] of MUTANTS) {
    if (SRC.split(from).length !== 2) { console.log('  MUTANT NOT APPLIED  ' + name); failed++; continue; }
    let r; try { r = run(model(SRC.replace(from, to)), true); } catch (e) { r = { fails: ['threw: ' + e.message] }; }
    if (r.fails.length) console.log('  caught  ' + name + '  (' + r.fails.length + ' checks failed, first: ' + r.fails[0] + ')');
    else { console.log('  MISSED  ' + name); failed++; }
}
console.log((base.n + w.n - base.fails.length - w.fails.length) + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
