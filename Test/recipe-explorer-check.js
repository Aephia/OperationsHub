#!/usr/bin/env node
// recipe-explorer-check.js - Node check of the Recipe Explorer (RecipeExplorer/recipe-model.js, recipe-plan.js) on the
// recipe rows the hub ships (Data/recipes-data.js, whatever export it holds). Every expected value is computed from the
// raw rows with no model code, and every subject is picked from the data by a rule, so a data refresh needs no edit.
//   VE  "can this faction make it with no rival raw by any route" = an independent fixpoint over the raw rows
//   VA  items and ways = the raw-row item map (a recipe row whose name carries a bracket tag is another way to make the
//       plain item; an untagged starter row at a tier where its name has no other row is a way of its name's item)
//   VS  those starter rows: grouped under their item, labelled "Starter T<tier> · <exclusive raws (owner)>"
//   VP  planted rows: the starter label with no exclusive raw and with two
//   VR  faction routing stays inside the item's ways, for every name and faction (the data's own spellings too)
//   VC  faction None = the pre-change model (Test/fixtures/recipe-model.baseline.js, the committed model before the
//       ways work) for every recipe and for 2,000 seeded random plans
//   VG  the rendered list (a heading per item with 2+ recipes, full names as written) and the filter chips (a chip only
//       for a kind some row has; a family with nothing to tell apart is not drawn)
//   VW  the "Ways to make it" box (only with 2+ ways), links to a way, a picked way against faction routing
// A further PINNED suite (named subjects on a frozen row set) lives in Test/fixtures/local/, which git ignores; this file
// runs it only when it is there, and prints "PINNED suite skipped: local fixture not present" when it is not.
//
//   node Test/recipe-explorer-check.js              LIVE (+ PINNED when present); exit 0 = all PASS
//   node Test/recipe-explorer-check.js --live       LIVE only
//   node Test/recipe-explorer-check.js --neg [--live]   negative controls: each sabotage switches one feature off and
//                                                   the groups it names must FAIL; every check must fail under at least
//                                                   one sabotage (positive controls exempt); exit 0 = every control bit
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
global.window = global;
const load = f => require(path.join(ROOT, f));
const D = { recipes: load('Data/recipes-data.js'), resources: load('Data/resources-data.js'), planets: load('Data/planet-data.js'), buildings: load('Data/buildings-data.js') };
load('ResourcesExplorer/resource-model.js');
load('Test/fixtures/recipe-model.baseline.js');   // byte-identical to the committed model before the ways work
const Before = window.RecipeModel;
load('RecipeExplorer/recipe-model.js');
const After = window.RecipeModel;
if (Before === After) { console.log('FAIL  the fixture and the live model are the same class'); process.exit(1); }
// the planner's plan-entry logic (fix 1: M2 migration, L2 links) runs without a page: a stand-in localStorage and a
// planner object with no rendering
global.localStorage = (() => { let s = {}; return { getItem: k => (k in s ? s[k] : null), setItem: (k, v) => { s[k] = String(v); }, clear: () => { s = {}; } }; })();
global.document = { getElementById: () => null };
global.ChainGraph = class { draw() {} fit() {} };   // renderSheet draws a graph; the text checks do not need it
load('RecipeExplorer/recipe-plan.js');
load('RecipeExplorer/analytics.js');   // fix 2: the Analytics tab's figure is read from its rendered text
const Planner = window.RecipePlanner;
// window.RecipePlanner is read at call time, so a sabotage can swap in the pre-fix planner (Test/fixtures)
const fakePlanner = m => { const o = Object.create(window.RecipePlanner.prototype); o.m = m; o.rm = m.rm; o.items = []; o.faction = null; o.renderList = () => {}; o.renderPlan = () => {}; o.snd = () => {}; return o; };
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };   // mulberry32, repeatable
// recipe-row sets by name: 'live' = Data/recipes-data.js; the local PINNED module adds its own. Resources / planets /
// buildings are the live files, and each set gets its OWN copy (ResourceModel writes into the resource rows).
const ROWS = { live: D.recipes.recipes };
let rm, before, RAW_ATTACHED, RAW_ITEM, RAW_BY_ID, rawWaysOf, ENV = '';
const ENVS = {};
const useEnv = name => {
    if (!ENVS[name]) {
        const c = x => JSON.parse(JSON.stringify(x));
        rm = new window.ResourceModel(c(D.resources.resources), c(ROWS[name]), c(D.planets), c(D.buildings.buildings));
        before = new Before(rm); RAW_ATTACHED = []; RAW_ITEM = rawItemMap(); RAW_BY_ID = new Map(rm.recipes.map(r => [r.outputId, r]));
        const by = new Map(); RAW_ITEM.forEach((h, id) => (by.get(h) || by.set(h, []).get(h)).push(RAW_BY_ID.get(id))); rawWaysOf = h => by.get(h) || [];
        ENVS[name] = { rm, before, RAW_ATTACHED, RAW_ITEM, RAW_BY_ID, rawWaysOf };
    }
    ({ rm, before, RAW_ATTACHED, RAW_ITEM, RAW_BY_ID, rawWaysOf } = ENVS[name]); ENV = name;
};

// fix 2 L-d: the item each raw row belongs to, computed from the RAW rows (ResourceModel's recipes) with no model code:
// untagged non-building rows of one name and tier = one item, head = id with no ':', then open to all three factions,
// then lowest id; a building row is its own item; a tagged row joins the head of its base nearest in tier (then by id);
// a base with no untagged row = one item headed by its first tagged row (tier, id)
// RAW_ATTACHED (useEnv): addendum 3: [tagged id, the untagged id its own id names], from the raw rows
// an untagged starter row (id candidate:starter:..., not a building) at a tier where its name has no other non-building
// row counts as TAGGED here (it joins the head of its name nearest in tier, then by id); a name with no other row at all
// keeps the plain rule
const rawItemMap = () => {
    const strip = s => String(s).replace(/\s*\[[^\]]*\]/g, '').trim(), bracket = r => /\[[^\]]*\]/.test(r.outputName);
    const isBld0 = r => String(r.outputType || '').toUpperCase() === 'BUILDING', starter = r => r.outputId.startsWith('candidate:starter:') && !isBld0(r) && !bracket(r);
    const plainTiers = new Map(); rm.recipes.filter(r => !bracket(r) && !isBld0(r) && !starter(r)).forEach(r => (plainTiers.get(r.outputName) || plainTiers.set(r.outputName, new Set()).get(r.outputName)).add(r.outputTier));
    const tagged = r => bracket(r) || (starter(r) && plainTiers.has(r.outputName) && !plainTiers.get(r.outputName).has(r.outputTier));
    const canonF = f => { const u = String(f || '').toUpperCase(); return u.startsWith('UST') ? 'USTUR' : (u === 'MUD' || u === 'ONI') ? u : null; };
    const all3 = r => { const s = new Set((r.factions || []).map(canonF).filter(Boolean)); return s.size === 0 || s.size === 3; };
    const isBld = r => String(r.outputType || '').toUpperCase() === 'BUILDING';
    const byId = (a, b) => a.outputId.localeCompare(b.outputId);
    const itemOf = new Map(), headsOfBase = new Map();
    const groups = new Map();
    rm.recipes.filter(r => !tagged(r)).forEach(r => { const k = isBld(r) ? 'B:' + r.outputId : r.outputName + '\u0000' + r.outputTier; (groups.get(k) || groups.set(k, []).get(k)).push(r); });
    groups.forEach(g => { const h = g.slice().sort((a, b) => /:/.test(a.outputId) - /:/.test(b.outputId) || all3(b) - all3(a) || byId(a, b))[0]; g.forEach(r => itemOf.set(r.outputId, h.outputId)); (headsOfBase.get(h.outputName) || headsOfBase.set(h.outputName, []).get(h.outputName)).push(h); });
    const tags = new Map(); rm.recipes.filter(tagged).forEach(r => { const b = strip(r.outputName); (tags.get(b) || tags.set(b, []).get(b)).push(r); });
    // addendum 3 "attach by id": a base with no untagged row - each tagged row whose id names (last ':' part, a trailing
    // hex hash dropped) an untagged non-building row joins that row's item; the rest stay one item as before
    const untaggedById = new Map(rm.recipes.filter(r => !tagged(r) && !isBld(r)).map(r => [r.outputId, r]));
    tags.forEach((list, b) => {
        const heads = headsOfBase.get(b);
        if (!heads) {
            const named = r => { const p = r.outputId.split(':'); const last = /^[0-9a-f]{8,}$/.test(p[p.length - 1]) && p.length > 2 ? p[p.length - 2] : p[p.length - 1]; return untaggedById.get(last); };
            list.filter(named).forEach(r => { itemOf.set(r.outputId, '\u0001' + named(r).outputId); RAW_ATTACHED.push([r.outputId, named(r).outputId]); });
            list = list.filter(r => !named(r)); if (!list.length) return;
            const s = list.slice().sort((a, c) => a.outputTier - c.outputTier || byId(a, c)); s.forEach(r => itemOf.set(r.outputId, s[0].outputId)); return;
        }
        list.forEach(a => itemOf.set(a.outputId, heads.slice().sort((x, y) => Math.abs(x.outputTier - a.outputTier) - Math.abs(y.outputTier - a.outputTier) || byId(x, y))[0].outputId));
    });
    itemOf.forEach((h, id) => { if (h.startsWith('\u0001')) itemOf.set(id, itemOf.get(h.slice(1))); });
    return itemOf;
};
// RAW_BY_ID, rawWaysOf: set by useEnv
const rawStarbase = r => parseInt(String(r.min_starbase_level || '').replace(/\D/g, ''), 10) || 1;

// fix 2: render the planner's plan / route line / analytics into stand-in elements and read the text and classes
const withDom = (els, fn) => { const o = global.document.getElementById; global.document.getElementById = id => els[id] || null; try { return fn(); } finally { global.document.getElementById = o; } };
const stubEl = () => ({ innerHTML: '', dataset: {}, addEventListener() {}, querySelector: () => null, querySelectorAll: () => [] });

// ================= LIVE: the page on whatever export Data/ holds (useEnv('live')). Every expected value is
// computed from the raw rows with no model code, every subject is picked from the data by a rule - never a name the
// next export can remove. --neg: every V check must fail under at least one sabotage marked `live` (positive controls
// exempt).
function liveSuite(m, log) {
    const res = {}, R = rm.recipes, N = R.length, fmt = n => n.toLocaleString('en-US');
    let group = '';
    const check = (label, got, want) => {
        if (typeof got === 'function') { try { got = got(); } catch (e) { got = 'THREW: ' + e.message; } }
        const ok = JSON.stringify(got) === JSON.stringify(want);
        const g = res[group] || (res[group] = { pass: 0, fail: 0, failed: [], labels: [] }); ok ? g.pass++ : (g.fail++, g.failed.push(label)); g.labels.push(label);
        if (log) console.log(`${ok ? 'PASS' : 'FAIL'}  [live ${fmt(N)} rows] ${group} ${label}: ${JSON.stringify(got)}${ok ? '' : '  (expected ' + JSON.stringify(want) + ')'}`);
    };
    const FS = ['MUD', 'ONI', 'USTUR'];
    const canonF = f => { const u = String(f || '').trim().toUpperCase(); return u.startsWith('UST') ? 'USTUR' : (u === 'MUD' || u === 'ONI') ? u : null; };
    const facOf = r => { const s = new Set((r.factions || []).map(canonF).filter(Boolean)); return s.size ? s : new Set(FS); };
    const strip = s => String(s).replace(/\s*\[[^\]]*\]/g, '').trim(), isBld = r => String(r.outputType || '').toUpperCase() === 'BUILDING';
    const rawRes = new Map(rm.list.filter(x => x.category === 'raw').map(x => [x.name, canonF(x.faction)]));   // raw name -> owner (or null)
    const reEsc = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // the faction-safe item set, own implementation over the raw rows: a raw is fine unless a rival owns it; an item with
    // no maker and no raw is a leaf (fine); an item is fine once a recipe of its pool (the rows the faction may craft,
    // else all rows) has every ingredient fine; repeat until nothing grows
    const SAFE = {};
    FS.forEach(f => {
        const makers = new Map(); R.forEach(r => { if (isBld(r)) return; const b = strip(r.outputName); if (!rawRes.has(b)) (makers.get(b) || makers.set(b, []).get(b)).push(r); });
        const good = new Set(); rawRes.forEach((o, n) => { if (!o || o === f) good.add(n); });
        R.forEach(r => { if (!isBld(r)) (r.ingredients || []).forEach(i => { const b = strip(i.name); if (!rawRes.has(b) && !makers.has(b)) good.add(b); }); });
        for (let grew = true; grew;) { grew = false; for (const [b, rows] of makers) { if (good.has(b)) continue; const mine = rows.filter(r => facOf(r).has(f)); if ((mine.length ? mine : rows).some(r => (r.ingredients || []).every(i => good.has(strip(i.name))))) { good.add(b); grew = true; } } }
        SAFE[f] = good;
    });
    const clean = (r, f) => (r.ingredients || []).every(i => SAFE[f].has(strip(i.name)));
    const heads = new Set(RAW_ITEM.values()), multiHeads = Array.from(heads).filter(h => rawWaysOf(h).length > 1).sort();

    // ---- VE: "can this faction make it with no rival raw by any route" = the independent count
    group = 'VE';
    const blocked = (f, model) => { const mine = R.filter(r => !isBld(r) && (r.ingredients || []).length && facOf(r).has(f)); return [mine.filter(r => model ? !m.canMakeWithoutRivals(r.outputId, f).ok : !clean(r, f)).length, mine.length]; };
    if (log) console.log('      VE (blocked, of) per faction:', JSON.stringify(FS.map(f => blocked(f, false))));
    FS.forEach(f => check(`${f}: recipes it may craft that need a rival raw by every route (blocked, of) = the independent raw-row count`, () => blocked(f, true), blocked(f, false)));
    check('positive control: each faction has blocked recipes and clean ones', FS.map(f => { const [b, n] = blocked(f, false); return b > 0 && b < n; }), [true, true, true]);

    // ---- VA: items and ways = the raw-row item map
    group = 'VA';
    check('every raw row is in the model once (outputIds unique)', [m.byId.size, m.recipes.length], [N, N]);
    check('the raw-row item map agrees with the model\'s itemOf for every row', () => R.filter(r => (m.itemOf(r.outputId) || {}).outputId !== RAW_ITEM.get(r.outputId)).length, 0);
    check('finder items = the raw items', () => m.finderRows().length, heads.size);
    check('items with 2+ ways: exactly the raw items with 2+ rows, each one\'s ways exactly its raw rows', () => m.finderRows().filter(x => x.ways > 1).map(x => [x.r.outputId, m.wayRecipes(x.r).map(w => w.outputId).sort()]).sort(), multiHeads.map(h => [h, rawWaysOf(h).map(r => r.outputId).sort()]).sort());
    check('positive control: the data has items with 2+ ways (none would make the ways checks vacuous - look at the export)', multiHeads.length > 0, true);

    // ---- VS: untagged starter rows (candidate:starter:..., plain name)
    group = 'VS';
    const starterRow = r => r.outputId.startsWith('candidate:starter:') && !isBld(r) && !/\[/.test(r.outputName);
    const plainT = new Map(); R.filter(r => !isBld(r) && !starterRow(r) && !/\[/.test(r.outputName)).forEach(r => (plainT.get(r.outputName) || plainT.set(r.outputName, new Set()).get(r.outputName)).add(r.outputTier));
    const lone = R.filter(r => starterRow(r) && plainT.has(r.outputName) && !plainT.get(r.outputName).has(r.outputTier));
    check('an untagged starter row at a tier where its name has no other row is a WAY of an item of its name (not an item of its own)', () => lone.map(r => { const it = m.itemOf(r.outputId); return [r.outputId, !!it && it.outputName === r.outputName && it.outputId !== r.outputId && m.isWayOf(r.outputId, it)]; }), lone.map(r => [r.outputId, true]));
    check('positive control: the data holds such rows', lone.length > 0, true);
    // the exclusive raws of a row's chain as written ("Name (OWNER)", by owner then name): the row's ingredients, then
    // each name's first recipe (ResourceModel.recipeByName), a raw is a leaf
    const exclOf = r => { const seen = new Set(), out = new Map(); const walk = (n, rec) => { if (rawRes.has(n)) { if (rawRes.get(n)) out.set(n, rawRes.get(n)); return; } if (seen.has(n)) return; seen.add(n); const x = rec || rm.recipeByName.get(n); if (x) (x.ingredients || []).forEach(i => walk(i.name)); }; walk(r.outputName, r); return Array.from(out).sort((a, b) => a[1].localeCompare(b[1]) || a[0].localeCompare(b[0])).map(([n, o]) => `${n} (${o})`).join(', '); };
    const sways = R.filter(r => starterRow(r) && facOf(r).size === 3 && RAW_ITEM.get(r.outputId) !== r.outputId);
    check('a starter way (all factions) is labelled "Starter T<tier> · <its chain\'s exclusive raws (owner)>", never "Other recipe"', () => sways.map(r => m.wayLabel(r.outputId)), sways.map(r => { const x = exclOf(r); return `Starter T${r.outputTier}` + (x ? ' · ' + x : ''); }));
    check('positive control: some starter way names an exclusive raw', sways.some(r => exclOf(r) !== ''), true);
    check('no two ways of one item carry the same label', () => multiHeads.filter(h => { const l = m.ways(h).map(w => w.label); return new Set(l).size !== l.length; }), []);

    // ---- VP: planted rows for the two label branches the data need not hold - a starter way with NO exclusive raw in
    // its chain ("Starter T<n>" alone) and one with TWO ("Starter T<n> · A (MUD), B (ONI)", by owner then name). The host
    // item and the raws are picked by rule (first by id / by name); the planted rows sit one tier above the host.
    group = 'VP';
    const rawsOwnedBy = o => Array.from(rawRes).filter(([, w]) => w === o).map(([n]) => n).sort();
    const neutral = rawsOwnedBy(null)[0], exA = rawsOwnedBy('MUD')[0], exB = rawsOwnedBy('ONI')[0];
    const host = R.filter(r => !isBld(r) && !starterRow(r) && !/\[/.test(r.outputName) && (r.ingredients || []).length).sort((a, b) => a.outputId.localeCompare(b.outputId))[0];
    const pt = host ? host.outputTier + 1 : 0;
    const planted = (() => { try {
        const c = x => JSON.parse(JSON.stringify(x));
        const row = (tail, ings) => Object.assign(c(host), { outputId: 'candidate:starter:planted:' + tail, outputTier: pt, factions: ['MUD', 'ONI', 'USTUR'], ingredients: ings.map(n => ({ name: n, quantity: 1 })) });
        const rm2 = new window.ResourceModel(c(D.resources.resources), [c(host), row('none', [neutral]), row('two', [exB, neutral, exA])], c(D.planets), c(D.buildings.buildings));
        const m2 = new m.constructor(rm2), p2 = fakePlanner(m2), r0 = m2.byId.get('candidate:starter:planted:none'), r2 = m2.byId.get('candidate:starter:planted:two');
        return { ways: [m2.isWayOf(r0, host.outputId), m2.isWayOf(r2, host.outputId)], labels: [m2.wayLabel(r0), m2.wayLabel(r2)], kinds: [p2.kindText(r0), p2.kindText(r2)] };
    } catch (e) { return { ways: 'THREW ' + e.message, labels: 'THREW ' + e.message, kinds: 'THREW ' + e.message }; } })();
    if (log) console.log(`      VP host ${host && host.outputId} (T${host && host.outputTier}), raws: ${neutral} / ${exA} (MUD) / ${exB} (ONI)`);
    check('positive control: a host item, a raw with no owner, a MUD raw and an ONI raw exist', [!!host, !!neutral, !!exA, !!exB], [true, true, true, true]);
    check('both planted starter rows are ways of the host item', planted.ways, [true, true]);
    check('no exclusive raw in the chain: the way label is "Starter T<n>" alone (no " · ")', planted.labels[0], `Starter T${pt}`);
    check('two exclusive raws: the way label names both, by owner then name', planted.labels[1], `Starter T${pt} · ${exA} (MUD), ${exB} (ONI)`);
    check('the list row kind text: "Starter" alone, then "Starter · <both raws>"', planted.kinds, ['Starter', `Starter · ${exA} (MUD), ${exB} (ONI)`]);

    // ---- VR: faction routing
    group = 'VR';
    const names = Array.from(new Set(m.recipes.filter(r => !r.isAlternative).map(r => r.outputName)));
    const pairs = []; FS.forEach(f => names.forEach(n => { const d = m.defaultOf(n), r = m.route(n, f, null); if (d && r && r !== d) pairs.push({ n, f, d, r }); }));
    if (log) console.log(`      VR routing switches ${pairs.length} (name, faction) pairs: ${pairs.slice(0, 8).map(p => p.f + ' ' + p.n).join(', ')}${pairs.length > 8 ? ' ...' : ''}`);
    check('every recipe routing picks for a name (3 factions and the data\'s spelling "Ustur") is one of the ways of that name\'s item (the sheet lists what the plan uses)', () => { let bad = 0; FS.concat(['Ustur']).forEach(f => names.forEach(n => { const d = m.defaultOf(n), r = m.route(n, f, null); if (d && r && r !== d && !m.isWayOf(r, d)) bad++; })); return bad; }, 0);
    check('every switch: the routed recipe needs no rival raw and the default does, or the faction may not craft the default (independent safe set)', () => pairs.filter(p => { const r = RAW_BY_ID.get(p.r.outputId), d = RAW_BY_ID.get(p.d.outputId); return !(clean(r, p.f) && (!clean(d, p.f) || !facOf(d).has(p.f))); }).map(p => p.f + ' ' + p.n), []);
    check('positive control: routing switches at least one name for some faction', pairs.length > 0, true);
    check('"Ustur", "UST" and "ust" route every name as "USTUR"', () => names.filter(n => ['Ustur', 'UST', 'ust'].some(s => m.route(n, s, null) !== m.route(n, 'USTUR', null))).length, 0);

    // ---- VC: faction None = the pre-change model (Test/fixtures/recipe-model.baseline.js)
    group = 'VC';
    const planCore = p => ({ totals: p.totals, factions: p.factions.slice().sort(), stages: p.stages.map(s => [s.depth, s.crafts, s.time, s.names.slice().sort()]), where: p.where, starbase: p.starbase, time: p.time,
        raws: p.raws.map(r => [r.name, r.qty, r.stake, r.beltOnly, r.fleet, r.unknown]), edges: p.edges.map(e => [e.from, e.to, e.quantity, e.per]),
        nodes: Array.from(p.nodes).map(([k, n]) => [k, n.cat, n.leaf, n.recipe ? n.recipe.outputId : null]), roots: p.roots });
    const fullKey = p => JSON.stringify(Object.assign(planCore(p), { rows: p.crafts.map(c => [c.name, c.crafts, c.units, c.depth, c.time, c.each, c.ingredients, c.rec.outputId]) }));
    // one item made two ways (two craft rows for a name): rows added up per name; build times and starbase are each
    // row's own recipe's (the pre-change page charged the first row of the name), so they are left out here and the
    // starbase is checked against the raw rows below
    const nameKey = p => { const by = new Map(); p.crafts.forEach(c => { const e = by.get(c.name) || [c.name, 0, 0, c.depth]; e[1] += c.crafts; e[2] += c.units; by.set(c.name, e); }); const o = planCore(p); delete o.time; delete o.starbase; o.stages = o.stages.map(s => [s[0], s[1], s[3]]); return JSON.stringify(Object.assign(o, { rows: Array.from(by.values()).sort((a, b) => a[0].localeCompare(b[0])) })); };
    { let d = 0; for (const r of m.recipes) { const items = [{ id: r.outputId, qty: 3 }], a = fullKey(before.plan(items)); if (a !== fullKey(m.plan(items)) || a !== fullKey(m.plan(items, { faction: 'None' }))) d++; }
      check('plan() of every recipe id at faction None (and none) equals the pre-change model in every field', d, 0); }
    { const rnd = rng(2026), hs = m.finderRows().map(x => x.r.outputId); let bad = 0, split = 0, sb = 0;
      for (let i = 0; i < 2000; i++) { const items = []; const k = 2 + Math.floor(rnd() * 4); for (let j = 0; j < k; j++) items.push({ id: hs[Math.floor(rnd() * hs.length)], qty: 1 + Math.floor(rnd() * 20) });
        const a = before.plan(items), b = m.plan(m.planInputs(items));
        if (b.crafts.some(c => c.split)) { split++; if (nameKey(a) !== nameKey(b)) bad++; } else if (fullKey(a) !== fullKey(b)) bad++;
        if (b.starbase !== Math.max(1, ...b.crafts.map(c => rawStarbase(RAW_BY_ID.get(c.rec.outputId))))) sb++; }
      if (log) console.log(`      VC 2,000 random plans: ${split} make one item two ways`);
      check('2,000 random multi-item plans (seeded) at faction None equal the pre-change model (one item made two ways: rows added up per name)', bad, 0);
      check('... and each plan\'s starbase is the highest min_starbase_level of its crafted recipes (raw rows)', sb, 0); }
    check('positive control: the key sees a routed plan (first switched pair: default x3 at None vs at its faction)', () => { const p = pairs[0], it = [{ id: p.d.outputId, qty: 3 }]; return fullKey(before.plan(it)) === fullKey(m.plan(it, { faction: p.f })); }, false);

    // ---- VG: the rendered list and the side panel
    group = 'VG';
    const unesc = s => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
    const listOf = (filters, mm) => { const o = fakePlanner(mm || m); o.renderList = window.RecipePlanner.prototype.renderList; o.filters = Object.assign({ q: '', mode: 'name', types: new Set(), tiers: new Set(), star: new Set(), kinds: new Set(), facs: new Set(), sort: 'name' }, filters || {}); o.shown = Infinity; const el = stubEl(), c = stubEl(); withDom({ rpList: el, rpCount: c }, () => { o.applyFinder(); o.shown = Infinity; o.renderList(); }); return { html: el.innerHTML, count: c.textContent }; };
    const parse = html => { const out = [], re = /<div class="rp-row( rp-sub| rp-head)?[^"]*" data-id="([^"]*)">\s*<div class="rp-row-main"[^>]*><b>(?:<i class="t t\d">T\d<\/i>)?(?:<span class="rp-full">)?([^<]*)/g; let x, cur = null; while ((x = re.exec(html))) { const id = unesc(x[2]), name = unesc(x[3]); if (x[1] === ' rp-head') { cur = { head: id, name, rows: [] }; out.push(cur); continue; } if (x[1] !== ' rp-sub') cur = null; (cur ? cur.rows : (out.push({ head: null, name, rows: [] }), out[out.length - 1].rows)).push({ id, name }); } return out; };
    const all = (() => { try { return listOf(); } catch (e) { return { html: '', count: 'THREW ' + e.message }; } })(), allP = parse(all.html), allRows = allP.flatMap(g => g.rows);
    const top = multiHeads.slice().sort((a, b) => rawWaysOf(b).length - rawWaysOf(a).length || a.localeCompare(b))[0];
    if (log) console.log(`      VG list: ${allRows.length} rows, ${allP.filter(g => g.head).length} headings; most ways: ${top} (${top ? rawWaysOf(top).length : 0})`);
    check('every raw row is exactly one row of the rendered list', () => { const ids = allRows.map(r => r.id), s = new Set(ids); return [ids.length, s.size, R.every(r => s.has(r.outputId))]; }, [N, N, true]);
    check('every row shows its full name as written (outputName)', () => allRows.filter(r => !RAW_BY_ID.get(r.id) || RAW_BY_ID.get(r.id).outputName !== r.name).length, 0);
    check('each heading groups exactly its raw item\'s rows; one heading per raw item with 2+ rows', () => { let bad = 0; allP.forEach(g => g.rows.forEach(r => { if (RAW_ITEM.get(r.id) !== (g.head || g.rows[0].id)) bad++; })); return [bad, allP.filter(g => g.head).length]; }, [0, multiHeads.length]);
    check('the item with the most recipes (picked from the raw rows) has a heading "<n> recipes"', () => { const x = new RegExp('rp-head[^"]*" data-id="' + reEsc(top) + '">\\s*<div class="rp-row-main"[^>]*><b>[^<]*</b><span class="rp-head-n">([^<]*)</span>').exec(all.html); return x ? x[1] : null; }, `${top ? rawWaysOf(top).length : 0} recipes`);
    check('the count line says every row', all.count, `${fmt(N)} of ${fmt(N)} recipes`);
    // the kind text at the right of each list row, read from the rendered html
    const kindAt = id => { const x = new RegExp('data-id="' + reEsc(id) + '">[\\s\\S]*?<em class="rp-kind">([^<]*)</em>').exec(all.html); return x ? unesc(x[1]) : null; };
    const rowText = id => { const x = new RegExp('data-id="' + reEsc(id) + '">([\\s\\S]*?)</em>').exec(all.html); return x ? unesc(x[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()) : null; };
    check('no two rows under one heading read the same (tier, name, type, ingredients, time, kind): an untagged starter row adds its exclusive raws', () => allP.filter(g => g.head).filter(g => { const t = g.rows.map(r => rowText(r.id)); return new Set(t).size !== t.length; }).map(g => g.head), []);
    check('a starter row\'s kind text names its exclusive raws (raw-row walk)', () => sways.filter(r => exclOf(r)).map(r => kindAt(r.outputId)), sways.filter(r => exclOf(r)).map(r => 'Starter · ' + exclOf(r)));
    // the raw kind of a row (as the G2 group): tag words in the name; an untagged row by its id; faction-only rows
    const RAW_KIND = r => {
        const k = new Set(), tags = r.outputName.match(/\[[^\]]*\]/g) || [];
        tags.forEach(t => { const w = t.slice(1, -1).trim().split(/[\s\/]+/);
            if (w[0] === 'Zone') k.add('Zone ' + w[1]); else if (/^Z\d$/.test(w[0])) k.add('Zone ' + w[0][1]);
            if (/^CS\d$/.test(w[0]) || /starter construction/.test(t)) k.add('Starter construction');
            if (w[0] === 'starter') k.add('Starter');
            if (/^G\d$/.test(w[0])) k.add(w[0]);
            w.slice(1).forEach(x => { if (/^(MUD|ONI|UST|USTUR)$/i.test(x)) k.add(canonF(x)); }); });
        if (!tags.length) { if (r.outputId.startsWith('candidate:starter:')) k.add('Starter'); const z = /(^|:)zone:(\d+):/.exec(r.outputId); if (z) k.add('Zone ' + z[2]); }
        if (!Array.from(k).some(x => /^(Starter|Zone \d+|Starter construction|G\d+)$/.test(x))) k.add('Standard');
        const fs = facOf(r); if ((r.factions || []).length && fs.size < 3) fs.forEach(f => k.add(f));
        return k;
    };
    const rawN = new Map(); R.forEach(r => RAW_KIND(r).forEach(k => rawN.set(k, (rawN.get(k) || 0) + 1)));
    const sideOf = mm => { try { const o = fakePlanner(mm); const el = stubEl(); withDom({ rpSide: el }, () => o.renderFinder()); return el.innerHTML; } catch (e) { return 'THREW ' + e.message; } };
    const side = sideOf(m), chipsIn = (html, grp) => { const sec = (new RegExp('data-group="' + grp + '">(.*?)</div>', 's').exec(html) || [])[1] || ''; const out = []; const re = /data-v="([^"]*)"[^>]*>[^<]*<small>([\d,]+)<\/small>/g; let x; while ((x = re.exec(sec))) out.push([unesc(x[1]), +x[2].replace(/,/g, '')]); return out.sort(); };
    const rawKinds = Array.from(rawN).filter(([k]) => !FS.includes(k)).sort(), rawFacs = Array.from(rawN).filter(([k]) => FS.includes(k)).sort();
    check('kind chips = exactly the kinds some raw row has, each with its raw-row count (no chip for a kind with no row)', chipsIn(side, 'kinds'), rawKinds.length > 1 ? rawKinds : []);
    check('faction chips = exactly the factions some faction-only raw row has, with their counts', chipsIn(side, 'facs'), rawFacs);
    const rowsOf = f => m.findRecipeRows(f).reduce((n, g) => n + g.rows.length, 0);
    check('each chip alone lists its raw-row count of rows', () => rawKinds.map(([k]) => rowsOf({ kinds: new Set([k]) })).concat(rawFacs.map(([k]) => rowsOf({ facs: new Set([k]) }))), rawKinds.map(([, n]) => n).concat(rawFacs.map(([, n]) => n)));
    // degrade: a cut of the data with one kind (Standard) and no faction-only row draws no kind or faction chips at all
    const cut = R.filter(r => !isBld(r) && facOf(r).size === 3 && !(r.factions || []).some(f => !canonF(f)) && RAW_KIND(r).size === 1 && RAW_KIND(r).has('Standard')).slice(0, 40);
    const cutSide = (() => { const c = x => JSON.parse(JSON.stringify(x)); const rm2 = new window.ResourceModel(c(D.resources.resources), c(cut), c(D.planets), c(D.buildings.buildings)); return sideOf(new m.constructor(rm2)); })();
    check('a 40-row cut with one kind and no faction-only row: the side panel draws no kind chips and no faction chips (no dead control, no empty heading)', [/data-group="kinds"/.test(cutSide), /data-group="facs"/.test(cutSide), /THREW/.test(cutSide)], [false, false, false]);
    check('positive control: the full data draws both chip families', [/data-group="kinds"/.test(side), /data-group="facs"/.test(side)], [rawKinds.length > 1, rawFacs.length > 0]);

    // ---- VW: the sheet's ways box, links and the planner (subjects by rule)
    group = 'VW';
    const sheetHtml = id => { const o = fakePlanner(m); o.history = []; o.research = null; o.overlay = { innerHTML: '', querySelector: () => ({ scrollTop: 0 }) }; o.renderSheet(m.byId.get(id)); return o.overlay.innerHTML; };
    check(`the sheet of the item with the most ways (${top}) has ONE ways box listing its raw rows, the head first`, () => { const h = sheetHtml(top), ids = []; const re = /class="rp-way(?: on)?" data-way="([^"]*)"/g; let x; while ((x = re.exec(h))) ids.push(unesc(x[1])); return [(h.match(/rp-ways-box/g) || []).length, ids[0], ids.slice().sort()]; }, [1, top, top ? rawWaysOf(top).map(r => r.outputId).sort() : []]);
    const one = Array.from(heads).filter(h => rawWaysOf(h).length === 1 && !isBld(RAW_BY_ID.get(h)) && (RAW_BY_ID.get(h).ingredients || []).length).sort()[0];
    check(`an item with one recipe (the first by id: ${one}) has no ways box`, () => /rp-ways-box/.test(sheetHtml(one)), false);
    const W = R.map(r => r.outputId).filter(id => RAW_ITEM.get(id) !== id).sort()[0], I = W && RAW_ITEM.get(W);
    check(`?recipe=<a way's id> (the first non-head way by id: ${W}) resolves to its item with that way`, () => { const x = m.resolveLink(W); return [x.item.outputId, x.way && x.way.outputId]; }, [I, W]);
    const clickSide = (p, attr, val) => { let h = null; const sd = { addEventListener: (t, f) => { if (t === 'click') h = f; } }, main = { addEventListener() {} }; withDom({ rpSide: sd, rpMain: main }, () => p.bind()); const target = { id: '', closest: sel => (sel === '[' + attr + ']' ? { dataset: { [attr.slice(5).replace(/-(\w)/g, (a, c) => c.toUpperCase())]: val } } : null) }; h({ target }); };
    check('that way\'s list row "+" adds its item with the way pinned', () => { const p = fakePlanner(m); p.save = () => {}; clickSide(p, 'data-pick', W); return p.items; }, [{ id: I, qty: 1, way: W }]);
    const pp = pairs.slice().sort((a, b) => a.f.localeCompare(b.f) || a.n.localeCompare(b.n))[0];
    if (log) console.log(`      VW plan subject (first switched pair by faction, name): ${pp ? pp.f + ' ' + pp.n + ' ' + pp.d.outputId + ' -> ' + pp.r.outputId : 'none'}`);
    check('a faction plan routes an item and a picked way holds against the routing (first switched pair by faction, name)', () => { const rowOf = items => { const p = m.plan(m.planInputs(items, pp.f), { faction: pp.f }); const c = p.crafts.find(x => x.name === pp.n); return c && c.rec.outputId; }; return [rowOf([{ id: pp.d.outputId, qty: 1 }]), rowOf([{ id: pp.d.outputId, qty: 1, way: pp.d.outputId }])]; }, pp ? [pp.r.outputId, pp.d.outputId] : null);
    return res;
}

const tally = res => Object.values(res).reduce((a, g) => [a[0] + g.pass, a[1] + g.fail], [0, 0]);

// ---- F: negative controls. Each switches one feature off; the listed groups must FAIL (at least one check each).
const P = After.prototype;
// task #17: re-run a LIVE source file with some strings put back to the old wording; throws when a string is not found
// (a pair that matches nothing would be a sabotage that does nothing). Undo puts the live class back.
const srcBack = (file, cls, pairs) => {
    let src = require('fs').readFileSync(path.join(ROOT, file), 'utf8');
    pairs.forEach(([a, b]) => { if (!src.includes(a)) throw new Error('srcBack: not found in ' + file + ': ' + a); src = src.split(a).join(b); });
    const o = window[cls]; new Function(src)();
    if (window[cls] === o) throw new Error('srcBack: ' + cls + ' was not replaced');
    return () => { window[cls] = o; };
};
const LIVE_SAB = [
    { name: 'route() ignores alternatives (always the default recipe)', must: ['D', 'X', 'VR', 'VW'], live: true, on: () => { const o = P.route; P.route = function (name, f, via) { return via || this.own(this.rm.recipeByName.get(name)); }; return () => { P.route = o; }; } },
    { name: 'faction None routes as MUD', must: ['C', 'VC'], live: true, on: () => { const o = P.expand; P.expand = function (items, opts) { return o.call(this, items, opts && opts.faction ? opts : Object.assign({}, opts, { faction: 'MUD' })); }; return () => { P.expand = o; }; } },
    { name: 'exclusive raws have no owner', must: ['B', 'D', 'E', 'W', 'VE', 'VR'], live: true, on:() => { const o = P.ownerOf; P.ownerOf = function () { return null; }; return () => { P.ownerOf = o; }; } },
    { name: 'a tagged recipe is not mapped to its item', must: ['W', 'P', 'VA', 'VW'], live: true, on: () => { const o = P.itemOf; P.itemOf = function (rec) { return typeof rec === 'string' ? this.byId.get(rec) : rec; }; return () => { P.itemOf = o; }; } },
    { name: 'the plan ignores a picked way', must: ['P', 'VW'], live: true, on: () => { const o = P.planInputs; P.planInputs = items => items.map(it => ({ id: it.id, qty: it.qty })); return () => { P.planInputs = o; }; } },
    { name: 'G1: the list shows the plain item name on every row (not the full name)', must: ['G1', 'VG'], live: true, on: () => srcBack('RecipeExplorer/recipe-plan.js', 'RecipePlanner', [['<span class="rp-full">${esc(r.outputName)}</span>', '<span class="rp-full">${esc(r.baseName)}</span>']]) },
    { name: 'G2: chips count items (heading rows), not recipe rows', must: ['G2', 'VG'], live: true, on: () => srcBack('RecipeExplorer/recipe-plan.js', 'RecipePlanner', [['r.kinds.forEach(k => kn.set(k, (kn.get(k) || 0) + 1));', 'if (this.m.itemOf(r) === r) r.kinds.forEach(k => kn.set(k, (kn.get(k) || 0) + 1));']]) },
    // LIVE groups (V*): `must` names the V groups that must fail
    { name: 'V: the starter rule off (an untagged starter row of a lone tier stays an item of its own)', must: ['VA', 'VS', 'VR', 'VG'], live: true, on: () => srcBack('RecipeExplorer/recipe-model.js', 'RecipeModel', [['if (own.size) {', 'if (false) {']]), make: () => new window.RecipeModel(rm) },
    { name: 'V: starter ways labelled "Other recipe" (no tier / owner label)', must: ['VS'], live: true, on: () => srcBack('RecipeExplorer/recipe-model.js', 'RecipeModel', [['if (/^candidate:starter:/.test(r.outputId)) { const x = this.starterNote(r);', 'if (false) { const x = this.starterNote(r);']]), make: () => new window.RecipeModel(rm) },
    { name: 'V: the list row kind text without the starter row\'s raws', must: ['VG'], live: true, on: () => srcBack('RecipeExplorer/recipe-plan.js', 'RecipePlanner', [["kindText(r) { const x = this.m.starterNote ? this.m.starterNote(r) : '';", "kindText(r) { const x = '';"]]) },
    { name: 'V: a chip family with one kind (or no faction) is still drawn', must: ['VG'], live: true, on: () => srcBack('RecipeExplorer/recipe-plan.js', 'RecipePlanner', [['${kindChips.length > 1 ?', '${kindChips.length > 0 ?'], ['${facChips.length ?', '${true ?']]) },
    { name: 'V: an item with one way gets a ways box', must: ['VW'], live: true, on: () => srcBack('RecipeExplorer/recipe-plan.js', 'RecipePlanner', [["const ways = this.m.ways(r); if (ways.length < 2) return '';", "const ways = this.m.ways(r); if (ways.length < 1) return '';"]]) },
    { name: 'V: route() takes the first other row of the name (even when the default needs no rival raw)', must: ['VR'], live: true, on: () => { const o = P.route; P.route = function (name, f, via) { const d = o.call(this, name, null, via); if (!After.canonFaction(f)) return d; return (this.byBase.get(After.baseName(name)) || []).find(r => r !== d && (r.ingredients || []).length && String(r.outputType || '').toUpperCase() !== 'BUILDING') || d; }; return () => { P.route = o; }; } },
    { name: 'V: route() reads only the canonical spellings ("Ustur" = no faction)', must: ['VR'], live: true, on: () => { const o = P.route; P.route = function (name, f, via) { return f == null || /^(MUD|ONI|USTUR)$/.test(String(f)) ? o.call(this, name, f, via) : o.call(this, name, null, via); }; return () => { P.route = o; }; } },
    { name: 'V: the list drops the first recipe row of every heading', must: ['VG'], live: true, on: () => { const o = P.findRecipeRows; P.findRecipeRows = function (f) { return o.call(this, f).map(g => g.rows.length > 1 ? Object.assign({}, g, { rows: g.rows.slice(1) }) : g); }; return () => { P.findRecipeRows = o; }; } },
    { name: 'V: the plan reports starbase L1', must: ['VC'], live: true, on: () => { const o = P.plan; P.plan = function (items, opts) { const p = o.call(this, items, opts); p.starbase = 1; return p; }; return () => { P.plan = o; }; } },
    { name: 'V: the ways box lists the head last', must: ['VW'], live: true, on: () => { const o = P.ways; P.ways = function (r) { return o.call(this, r).slice().reverse(); }; return () => { P.ways = o; }; } },
    { name: 'V: the model loses its last row', must: ['VA'], live: true, on: () => null, hook: m => { m.recipes.pop(); } },
    { name: 'V: a starter label with no exclusive raw still adds " · "', must: ['VP'], live: true, on: () => srcBack('RecipeExplorer/recipe-model.js', 'RecipeModel', [["return `Starter T${r.outputTier}` + (x ? ' · ' + x : '');", "return `Starter T${r.outputTier}` + ' · ' + x;"]]), make: () => new window.RecipeModel(rm) },
    { name: 'V: a starter label names only its first exclusive raw', must: ['VP'], live: true, on: () => srcBack('RecipeExplorer/recipe-model.js', 'RecipeModel', [['return this.exclusiveRaws(r).map(e =>', 'return this.exclusiveRaws(r).slice(0, 1).map(e =>']]), make: () => new window.RecipeModel(rm) }
];
const V_GROUPS = ['VE', 'VA', 'VS', 'VP', 'VR', 'VC', 'VG', 'VW'];   // every check in these needs a sabotage that fails it

// ---- the PINNED suite: a local module (git-ignored) that defines suite(), its sabotages and its own extra controls on
// a frozen row set. Evaluated in this file's scope (direct eval) so it shares rm / before / RAW_* / useEnv / srcBack;
// it sets PINNED = { suite, SAB, GROUPS, extra } or { missing } when one of its own files is absent.
const argv = process.argv.slice(2), NEG = argv.includes('--neg'), LIVE_ONLY = argv.includes('--live');
const PINNED_FILE = path.join(ROOT, 'Test/fixtures/local/pinned.check.js');
let PINNED = null;
if (!LIVE_ONLY && fs.existsSync(PINNED_FILE)) eval(fs.readFileSync(PINNED_FILE, 'utf8'));   // eslint-disable-line no-eval
const RUN_PINNED = !!(PINNED && !PINNED.missing);
const skipLine = () => console.log(LIVE_ONLY ? 'PINNED suite not run (--live)' : 'PINNED suite skipped: local fixture not present');
const line = (name, res) => { const [p, f] = tally(res); console.log(`${name} ${p} PASS, ${f} FAIL  (` + Object.entries(res).map(([g, v]) => `${g} ${v.pass}/${v.pass + v.fail}`).join(', ') + ')'); return f; };

if (!NEG) {
    useEnv('live');
    const live = liveSuite(new After(rm), true);
    let pinned = null;
    if (RUN_PINNED) { useEnv('pinned'); pinned = PINNED.suite(new After(rm), true); }
    console.log('');
    let f = line('LIVE  ', live);
    if (pinned) f += line('PINNED', pinned); else skipLine();
    process.exit(f ? 1 : 0);
}

// ---- negative controls. Each switches one feature off; the groups in `must` must FAIL (at least one check each).
// LIVE_SAB run liveSuite (and the PINNED suite when present); PINNED.SAB run the PINNED suite only. A group in `must`
// that did not run (a PINNED group with the module absent or --live) is not asked for.
let bad = 0;
const SABS = LIVE_SAB.concat(RUN_PINNED ? PINNED.SAB : []);
const BIT_GROUPS = V_GROUPS.concat(RUN_PINNED ? PINNED.GROUPS : []);
const bit = new Map();   // group + check label -> how many sabotages made it fail
// --only=<text>: run only the sabotages whose name holds <text> (a quick look while building; only a full run is the evidence)
const ONLY = (argv.find(a => a.startsWith('--only=')) || '').slice(7);
if (!RUN_PINNED) skipLine();
for (const s of SABS) {
    if (ONLY && !s.name.includes(ONLY)) continue;
    const res = {};
    const undo = s.on();
    try {
        if (RUN_PINNED) { useEnv('pinned'); const m = s.make ? s.make() : new After(rm); if (s.hook) s.hook(m); Object.assign(res, PINNED.suite(m, false)); }
        if (s.live) { useEnv('live'); const m2 = s.make ? s.make() : new After(rm); if (s.hook) s.hook(m2); Object.assign(res, liveSuite(m2, false)); }
    } finally { undo && undo(); }
    const failed = Object.entries(res).filter(([, v]) => v.fail).map(([g]) => g);
    BIT_GROUPS.forEach(g => { const v = res[g]; if (v) { v.labels.forEach(l => { if (!bit.has(g + ' ' + l)) bit.set(g + ' ' + l, 0); }); v.failed.forEach(l => bit.set(g + ' ' + l, bit.get(g + ' ' + l) + 1)); } });
    const must = s.must.filter(g => g && (RUN_PINNED || V_GROUPS.includes(g)));
    const missed = must.filter(g => !failed.includes(g));
    if (missed.length) bad++;
    console.log(`${missed.length ? 'BAD ' : 'OK  '}  sabotage "${s.name}": groups failing ${JSON.stringify(failed)}; must fail ${JSON.stringify(must)}${missed.length ? '  MISSED ' + JSON.stringify(missed) : ''}`);
}
if (RUN_PINNED && !ONLY) bad += PINNED.extra();
// per check: every check must fail under at least one sabotage; positive controls are exempt
{
    const never = Array.from(bit.entries()).filter(([l, n]) => !n && !/positive control/.test(l));
    console.log(`Checks (${BIT_GROUPS.join(' ')}) failed by at least one sabotage: ${Array.from(bit.entries()).filter(([, n]) => n).length} of ${bit.size} (${Array.from(bit.keys()).filter(l => /positive control/.test(l)).length} positive controls exempt)`);
    never.forEach(([l]) => console.log('BAD   no sabotage fails: ' + l));
    if (never.length) bad++;
}
console.log(`\n${bad ? bad + ' control(s) did not bite' : 'every negative control bit'}`);
process.exit(bad ? 1 : 0);
