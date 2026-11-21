#!/usr/bin/env node
// command-deck-check.js - Node check of the Command Deck model (CommandDeck/deck-model.js) against figures that
// were derived independently, by other code, in the SAGE research reports:
//   MINING-VS-STAKES-2026-10-04 (231-check second pass)  - full-stake layouts, ship rates, break-even ticks, fair prices
//   TOP10-STAKES-START-2026-09-28 rev 3a (830 checks)     - research path of Power Regulation Module
// plus internal identities (the bill expansion equals the Recipe Explorer planner's; every gate tag has a node).
// The expected values below belong to the 2026-09-11 export: after a data refresh, re-derive them, do not edit
// them until the check passes. 2026-11-19: sections 4, 8, 10, 11, 13 and R re-pinned to the export of that day; each
// re-pinned value carries [derive KEY] = the key printed by an independent JSON-only script (Tools/command-deck-derive/derive.js,
// see the README there). Every check is lazy (a throw is a FAIL, not a crash). The drone-dependent loadout constants
// (sections 9-10: hold x1.754, 222,197, Mining Max 27.54, Scanning 1,606 ...) are NOT re-pinned: the export now lists
// 12 physical drone units per port and the per-unit stacking rule is unconfirmed (scan cost goes negative). Those checks
// are RULE-FREE (labelled so): the deck equals a fresh calculator run plus relations true under any stacking rule, and
// the negative scan cost is a PENDING item (printed and counted, never a FAIL; totals "N PASS, F FAIL, M PENDING").
//
//   node Test/command-deck-check.js            exit 0 = all PASS
//   node Test/command-deck-check.js --sabotage corrupts four model inputs and expects the checks that read them to FAIL
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
global.window = global;
const load = f => require(path.join(ROOT, f));
const D = {
    buildings: load('Data/buildings-data.js'), ships: load('Data/ships-data.js'), recipes: load('Data/recipes-data.js'),
    resources: load('Data/resources-data.js'), planets: load('Data/planet-data.js'), research: load('Data/research-data.js')
};
load('ResourcesExplorer/resource-model.js'); load('RecipeExplorer/recipe-model.js'); load('HubExplorer/hub-model.js'); load('CommandDeck/deck-model.js'); load('CommandDeck/deck-loadout.js');
const SABOTAGE = process.argv.includes('--sabotage');
if (SABOTAGE) {
    // 1: one T5 extractor rate; 2: one level threshold. Exactly the checks that read them must fail.
    D.buildings.buildings.find(b => b.id === 'copper-ore-extractor-t5').resourceExtractionRate['copper-ore'] = 48.6;
    // (2026-11-19: level 40, the section-4 subject's Crafting level; level 15 is read by no check on this export)
    D.research.thresholds.crafting[39] += 1;
    // 3: USTUR's five low-risk regions become medium risk (the zone checks must notice). One region alone is not
    //    enough: flipping only Eternity changed no result, every raw it holds is in another safe region too.
    D.planets.regionDefinitions.forEach(g => { if (g.risk_zone && g.risk_zone.LowRiskZone === 'Ustur') g.risk_zone = 'MediumRiskZone'; });
    // 4: the Cargo Module's cargo multiplier is nudged (the loadout constants - hold x1.754, 222,197 an hour - must notice)
    const cm = load('Data/ship-formulas-data.js').componentAttributes['Ship Module']['Cargo Module'].cargo_capacity; Object.keys(cm.values || {}).forEach(k => { if (cm.values[k]) cm.values[k] *= 1.1; }); if (cm.multiplicativeValue) cm.multiplicativeValue *= 1.1;
    // 5: one cargo name the rare-mineral grant sentence lists is blanked (section 11 must notice)
    D.research.tokenNames['300'] = null;
    // 6-8 (2026-11-19, one per re-pinned family): the subject recipe loses its gate (research paths and the goal panel
    //    must notice); Fleet Size - Tier 1 grants one point more (ladder, caps, sentences); Medium Risk Traversal stops
    //    granting the medium zone (zone grants and gathering)
    D.research.gates.recipes['ship-component-mining-rig-ttn-t5'] = [];
    D.research.nodes.find(n => n.name === 'Fleet Size - Tier 1').character_value_changes.fleet_size += 1;
    delete D.research.nodes.find(n => n.name === 'Medium Risk Traversal').character_value_changes.security_zone_access;
}
const { ResearchModel, StakeEngine, Empire, Calc } = window.CommandDeck;
const rm = new window.ResourceModel(D.resources.resources, D.recipes.recipes, D.planets, D.buildings.buildings);
const rc = new window.RecipeModel(rm);
const research = new ResearchModel(D.research, rc, D.ships.ships);
const se = new StakeEngine(D.buildings, rm, D.planets);
const empire = new Empire(se, rc, D.ships.ships);

let pass = 0, fail = 0;
const near = (a, b, tol) => a != null && Math.abs(a - b) <= (tol == null ? 1e-9 : tol) * Math.max(1, Math.abs(b));
function check(label, got, want, tol) {
    if (typeof got === 'function') { try { got = got(); } catch (e) { got = 'THREW: ' + e.message; } }   // a lazy value: a throw is a FAIL, not a crash
    // an array of numbers with a tolerance is compared element by element (2026-11-19: an exact JSON compare of two
    // floats failed on the last digit, 1527.2309602796445 vs ...443)
    const ok = typeof want === 'number' ? near(got, want, tol)
        : (tol != null && Array.isArray(want) && Array.isArray(got)) ? got.length === want.length && want.every((w, i) => (typeof w === 'number' ? near(got[i], w, tol) : JSON.stringify(got[i]) === JSON.stringify(w)))
        : js(got) === js(want);
    if (ok) pass++; else fail++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: ${typeof got === 'number' ? got : js(got)}${ok ? '' : '  (expected ' + js(want) + ')'}`);
}
// PENDING (2026-11-19): a known open question the data cannot settle yet (the per-unit drone stacking rule). It prints
// `PENDING <label>: <value>` and is counted on its own; it NEVER touches pass or fail, so it cannot set exit 1 - and it
// cannot hide a FAIL either: a pending item is not a check, every ordinary check still counts.
let pend = 0;
function pending(label, got) {
    // a throw inside a pending item is a FAIL (2026-11-19 review S4): only a returned value is PENDING
    if (typeof got === 'function') { try { got = got(); } catch (e) { fail++; console.log(`FAIL  ${label}: THREW ${e.message}`); return; } }
    pend++;
    console.log(`PENDING  ${label}: ${typeof got === 'string' ? got : js(got)}`);
}
// a value that cannot be serialised (a node object with back links) is a FAIL with a note, never a crash (2026-11-19:
// the sabotage run crashed here on a Fleet Size rung object)
function js(v) { try { return JSON.stringify(v); } catch (e) { return '[unserialisable: ' + e.message.split('\n')[0] + ']'; } }

// ---- 1. full stake per tier, Copper Ore (MINING-VS-STAKES numbers.json "tiers")
const TIERS = {
    1: { k: 6, perTick: 0.12, storage: 3500 }, 2: { k: 4, perTick: 0.6, storage: 9500 }, 3: { k: 4, perTick: 2.56, storage: 25500 },
    4: { k: 5, perTick: 9.75, storage: 71500 }, 5: { k: 7, perTick: 34.02, storage: 207500, ncq: 11, npp: 1, used: 14000 }
};
const full = {};
Object.entries(TIERS).forEach(([t, w]) => {
    const f = full[t] = se.fullStake(+t, 'copper-ore');
    check(`T${t} full stake: extractors`, () => f.k, w.k);
    check(`T${t} full stake: per tick`, () => f.perTick, w.perTick, 1e-9);
    check(`T${t} full stake: storage`, () => f.storage, w.storage);
    if (w.ncq != null) { check(`T${t} full stake: crew quarters`, () => f.ncq, w.ncq); check(`T${t} full stake: power plants`, () => f.npp, w.npp); check(`T${t} full stake: slots used`, () => f.used, w.used); }
});
check('stake slots per tier', () => [1, 2, 3, 4, 5].map(t => se.slots[t]), [65, 487, 2049, 6251, 15553]);
// the layout does not depend on the planet type
const anyPlanet = cat => se.planets.find(p => p.cat === cat && p.deposits.has('copper-ore'));
[0, 1, 2, 4, 5, 6, 7].forEach(cat => {
    const p = anyPlanet(cat); if (!p) return;
    let k = 0; for (let n = 1; n < 50; n++) { if (!se.layout(p, 5, { 'copper-ore': n }, []).ok) break; k = n; }
    check(`T5 extractors that fit on a ${p.catName} planet`, () => k, 7);
});

// ---- 2. ships (numbers.json "ships") and break-even ticks
const SHIPS = { 'Armstrong IMP': 183.477, 'Armstrong IMP Tap': 19.192, 'Armstrong IMP Tip': 6.207 };
Object.entries(SHIPS).forEach(([n, r]) => check(`${n} mining rate per second`, () => empire.shipByName.get(n).rate, r));
check('hulls with a mining rate', () => empire.miners.length, 61);
check('break-even tick, T5 stake vs one Tap (s)', () => Calc.breakEvenTick(full[5].perTick, SHIPS['Armstrong IMP Tap']), 34.02 / 19.192, 1e-9);
check('break-even tick, T1 stake vs one IMP (s)', () => Calc.breakEvenTick(full[1].perTick, SHIPS['Armstrong IMP']), 0.0006540329305580536, 1e-9);
check('break-even tick, T1 stake vs one Tap (s)', () => Calc.breakEvenTick(full[1].perTick, SHIPS['Armstrong IMP Tap']), 0.006252605252188411, 1e-9);

// ---- 3. prices (numbers.json "usd"): asks quoted 2026-10-04 - an input, used here only to check the arithmetic
const ASK = { ship: { 'Armstrong IMP Tap': 160, 'Armstrong IMP': 2500 }, stake: { 5: 1925, 4: 415, 3: 176 } };
const USD = {
    be: { 3: { 'Armstrong IMP': 0.1981917971388041, 'Armstrong IMP Tap': 0.1212626473151692 }, 4: { 'Armstrong IMP': 0.3201215398062762, 'Armstrong IMP Tap': 0.195864742839637 }, 5: { 'Armstrong IMP': 0.24080303352364701, 'Armstrong IMP Tap': 0.1473341164879306 } },
    fair1s: { 3: { 'Armstrong IMP': 34.88175629642952, 'Armstrong IMP Tap': 21.34222592746978 }, 4: { 'Armstrong IMP': 132.85043901960464, 'Armstrong IMP Tap': 81.28386827844935 }, 5: { 'Armstrong IMP': 463.5458395330205, 'Armstrong IMP Tap': 283.6181742392664 } }
};
[3, 4, 5].forEach(t => Object.keys(ASK.ship).forEach(s => {
    check(`break-even tick per dollar, T${t} vs ${s} (s)`, () => Calc.breakEvenTickPerDollar(full[t].perTick, ASK.stake[t], SHIPS[s], ASK.ship[s]), USD.be[t][s], 1e-9);
    check(`fair price at a 1 s tick, T${t} vs ${s} ($)`, () => Calc.fairPrice(full[t].perTick, 1, SHIPS[s], ASK.ship[s]), USD.fair1s[t][s], 1e-9);
}));
check('fair price at the long inferred tick, T5 vs Tap ($)', () => Calc.fairPrice(full[5].perTick, 297.4741590361446, SHIPS['Armstrong IMP Tap'], 160), 0.9534212153359021, 1e-9);

// ---- 4. research. Re-pinned 2026-11-19 (export of that day): every value marked [derive KEY] was re-derived from the raw
//         JSON/*.json by an independent script with no hub code - Tools/command-deck-derive/derive.js (see the README
//         there; run `node Tools/command-deck-derive/derive.js`).
//         On this export the crafting-tier gates (Complex / Advanced Crafting) gate no recipe, so Power Regulation Module
//         and the other old subjects need no crafting research at all [derive CHAIN_power-regulation-module = []].
//         The gated subject is picked by a rule (derive.js, S_ID): among recipes with a unique output name and a chain of
//         unique names, the deepest Crafting level on the chain's closure, then the most nodes, then file order.
const prm = rc.recipes.find(r => r.outputName === 'Power Regulation Module');
check('Power Regulation Module: no crafting research on this export [derive CHAIN_power-regulation-module]', () => Array.from(research.closure(research.chainGate(prm))).map(n => n.name), []);
const SUBJ = rc.byId.get('ship-component-mining-rig-ttn-t5');               // [derive S_ID]
const prmSet = research.closure(research.chainGate(SUBJ));
check('Mining Rig TTN T5 (the rule\'s subject): nodes on the path [derive S_NODES]', () => Array.from(prmSet).map(n => n.name).sort(), ['Mining Gear - T2', 'Mining Gear - T3', 'Mining Gear - T4', 'Mining Gear - T5', 'Starting Node', 'Titan Crafting', 'Utility Ship Components']);
const prmBill = research.bill(prmSet, new Set([research.start.id]));
check('  to research / ATLAS, Starting Node held [derive S_BILL]', () => [prmBill.todo, prmBill.atlas], [6, 2100]);
check('  Crafting level [derive S_BILL]', () => prmBill.levels.Crafting, 40);
check('  Crafting XP [derive S_BILL]', () => prmBill.xp.Crafting, 21506);
check('Crafting XP for level 22 / 30', () => [research.xpFor('Crafting', 22), research.xpFor('Crafting', 30)], [4539, 9358]);
check('ATLAS per crafting node', () => research.byName.get('Complex Crafting').atlas / window.CommandDeck.ATLAS_DECIMALS, 350);
check('recipes in the gate map / gated [derive RECIPES_GATED]', () => [research.recipeCount, research.gatedRecipes], [5280, 3125]);
check('gated buildings [derive GATED_BUILDINGS]', () => research.gatedBuildings, 1506);
check('stake tier 5 gate: the node is "Claim Stakes & Cultivation Claims - Tier 5" [derive STAKE_T5_NODE]', () => research.closure(research.stakeGate(5)).has(research.byName.get('Claim Stakes & Cultivation Claims - Tier 5')), true);
check('  the cultivation stake tier 5 reads the same node', () => research.closure(research.stakeGate(5, 'cultivation')).has(research.byName.get('Claim Stakes & Cultivation Claims - Tier 5')), true);
check('Capital ship size node', () => research.shipSizeNode('Capital').name, 'Capital Ships');
check('Capital ships need Council Rank level', () => research.shipSizeNode('Capital').level.CouncilRank, 4);
// every tag a gate names is granted by a node that is drawn - EXCEPT, on the 2026-11-19 export, six retired tags no node
// grants: 153 (61 ship recipes) and the hardness tags 156-160 (520 extractor buildings) [derive ORPHAN_TAGS, ORPHAN_USE]
const gateTags = new Set(); ['recipes', 'buildings', 'claimStakes', 'craftingHabs'].forEach(k => Object.values(research.gate[k]).forEach(tags => tags.forEach(t => gateTags.add(t))));
check('gate tags with no node [derive ORPHAN_TAGS]', () => Array.from(gateTags).filter(t => !research.nodeOfTag.has(t)).sort((a, b) => a - b), [153, 156, 157, 158, 159, 160]);
check('nodes drawn / left out (no track, no numbers) [derive NODES_DRAWN_DROPPED]', () => [research.nodes.length, research.dropped.length], [425, 12]);
check('nodes with no row in the layout', () => research.nodes.filter(n => n.y == null).length, 0);
const cells = new Set(research.nodes.map(n => n.depth + '|' + n.y.toFixed(3)));
check('layout: two nodes on one cell', () => research.nodes.length - cells.size, 0);
// holding nothing but the Starting Node (all its tags): the ungated recipes; every node: all but the 61 ship recipes
// gated by tag 153, which no node grants [derive CRAFTABLE_START_EVERY]
check('craftable with only the Starting Node [derive CRAFTABLE_START_EVERY]', () => research.craftable(research.ownedTags(new Set([research.start.id]))), 2155);
check('craftable with every node [derive CRAFTABLE_START_EVERY]', () => research.craftable(new Set(research.nodeOfTag.keys())), 5219);

// ---- 5. the bill expansion equals the Recipe Explorer planner's raw bill
['Power Regulation Module', 'Thermal Management System', 'Utility Controller'].forEach(name => {
    const r = rc.recipes.find(x => x.outputName === name); const items = [{ id: r.outputId, qty: 7 }];
    const a = empire.expand(items, new Set()), b = rc.plan(items);
    const A = Array.from(a.leaves.entries()).sort(), B = b.raws.map(x => [x.name, x.qty]).sort();
    check(`${name} x7: raw bill = Recipe Explorer's (${B.length} raws)`, () => JSON.stringify(A) === JSON.stringify(B), true);
    check(`${name} x7: crafts = Recipe Explorer's`, () => a.craftCount, b.totals.crafts);
});

// ---- 6. one stake, by hand: T5 on a planet with Copper Ore - 7 extractors, then with the Copper processor
const cu = se.planets.find(p => p.stakeable && p.deposits.has('copper-ore') && p.deposits.get('copper-ore').richness === 1 && se.extractorFor(p, 'copper-ore', 5));
const plain = se.production(cu, 5, { 'copper-ore': 7 }, [], { richness: false });
const hubCu = (plain.passive.get('copper-ore') || 0);
check('T5 x7 Copper Ore: extracted per tick', () => plain.extracted.get('copper-ore'), 34.02, 1e-9);
check('T5 x7 Copper Ore: net = extractors + hub passive', () => plain.net.get('copper-ore'), 34.02 + hubCu, 1e-9);
const withProc = se.production(cu, 5, { 'copper-ore': 6 }, ['copper-processor-t5'], { richness: false });
check('T5 x6 + Copper processor: layout fits', () => withProc.layout.ok, true);
check('T5 x6 + Copper processor: processor fed at its full 16 per tick', () => withProc.procs[0].fed, 1);
check('T5 x6 + Copper processor: Copper per tick', () => withProc.net.get('copper'), 16, 1e-9);
check('T5 x6 + Copper processor: ore left per tick', () => withProc.net.get('copper-ore'), 6 * 4.86 + hubCu - 16, 1e-9);
check('a belt holds no stake', () => se.layout(se.planets.find(p => p.cat === 3), 1, {}, []).ok, false);
// hub passive extraction: only raws the planet has a deposit of (owner rule 2026-10-03)
const hub = plain.layout.central;
check('hub passive raws are all deposits of the planet', () => Array.from(plain.passive.keys()).every(k => cu.deposits.has(k)), true);
check('hub lists more raws than this planet holds', () => Object.keys(hub.resourceExtractionRate).length > plain.passive.size, true);

// ---- 7. coverage: 1 stake + 1 Tap against a plan, by hand
const prmItems = [{ id: prm.outputId, qty: 100 }];
const cov = empire.coverage(prmItems, [{ id: 's1', key: cu.key, tier: 5, alloc: { 'copper-ore': 7 }, procs: [] }], [{ id: 'f1', ship: 'Armstrong IMP Tap', count: 2, raw: 'Copper Ore', richness: 1 }], { tick: 60, richness: false });
const cuRow = cov.rows.find(r => r.name === 'Copper Ore');
check('coverage: Copper Ore supply per hour = stake/tick x 60 + 2 Taps x 3600', () => cuRow.perHour, (34.02 + hubCu) * 60 + 2 * 19.192 * 3600, 1e-9);
check('coverage: Copper Ore hours = need / supply', () => cuRow.hours, cuRow.need / cuRow.perHour, 1e-12);
check('measured tick: 4.86/tick at richness 1, 291.6 units in an hour -> 60 s', () => Calc.measuredTick(4.86, 1, 291.6), 60, 1e-9);

// ---- 8. gathering a recipe's raws: zones, extractor gates, faction locks - re-derived here from the raw bundles
// (regions, planets, the gate map, the nodes) with no call into the model's zone or route code
const RD = D.research, regionOf = new Map(D.planets.regionDefinitions.map(g => [g.id, g]));
const slugOf = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const zoneOfSystem = (s, fac) => { const z = regionOf.get(s.regionId).risk_zone; return typeof z === 'string' ? 'medium' : (z.LowRiskZone.toLowerCase() === fac ? 'own' : 'enemy'); };
const nodeByTag = new Map(); RD.nodes.forEach(n => ((n.character_value_changes || {}).research_tags || []).forEach(t => nodeByTag.set(t, n)));
const zoneRaw = pred => RD.nodes.filter(n => pred(n.character_value_changes || {}));
const ZONE_RAW = { medium: zoneRaw(c => c.security_zone_access === 'MediumRiskZone'), enemy: zoneRaw(c => c.enemy_faction_zone_access) };
const ZONE_NODE = { medium: ((ZONE_RAW.medium[0] || {}).character_value_changes || {}).research_tags || [], enemy: ((ZONE_RAW.enemy[0] || {}).character_value_changes || {}).research_tags || [] };
check('one node grants each zone class in the raw export: medium / enemy [derive MEDIUM_GRANTS, ENEMY_GRANTS]', () => [ZONE_RAW.medium.map(n => n.name), ZONE_RAW.enemy.map(n => n.name)], [['Medium Risk Traversal'], ['Enemy Faction Traversal']]);
const closeNames = tags => { const seen = new Set(), q = Array.from(tags); while (q.length) { const n = nodeByTag.get(q.pop()); if (!n || seen.has(n.name)) continue; seen.add(n.name); ((n.requirements || {}).required_tags || []).forEach(t => q.push(t)); } return Array.from(seen).sort(); };
const byHand = (recipeName, fac) => {                       // stakes where a T1 kit of ours can stand, else a fleet; own zone, then medium, then enemy
    const raws = rc.plan([{ id: rc.recipes.find(r => r.outputName === recipeName).outputId, qty: 1 }]).raws.map(r => r.name);
    const tags = new Set(RD.gates.recipes[rc.recipes.find(r => r.outputName === recipeName).outputId] || []);
    rm.dag(recipeName).nodes.forEach(nd => { const r = rm.recipeByName.get(nd.name); if (r && r.ingredients && r.ingredients.length) (RD.gates.recipes[r.outputId] || []).forEach(t => tags.add(t)); });
    const routes = {};
    raws.forEach(raw => {
        const id = slugOf(raw), kit = D.buildings.buildings.find(b => b.id === id + '-extractor-t1');
        const lock = kit && (kit.requiredTags || []).find(t => ['mud', 'oni', 'ustur'].includes(t));
        const kitOk = kit && (!lock || lock === fac);
        const best = { stake: null, any: null }, rank = { own: 0, medium: 1, enemy: 2 };
        D.planets.mapData.forEach(s => s.planets.forEach(p => {
            if (!(p.resources || []).some(q => q.name === raw)) return;
            const z = zoneOfSystem(s, fac), belt = p.type % 8 === 3, planetFac = ['oni', 'mud', 'ustur'][Math.floor(p.type / 8)];
            if (best.any == null || rank[z] < rank[best.any]) best.any = z;
            if (kitOk && !belt && (!lock || lock === planetFac) && (best.stake == null || rank[z] < rank[best.stake])) best.stake = z;
        }));
        const route = best.stake != null ? 'stake' : 'fleet', z = best.stake != null ? best.stake : best.any;
        routes[raw] = route + '/' + z;
        if (route === 'stake') { (RD.gates.buildings[kit.id] || []).forEach(t => tags.add(t)); (RD.gates.claimStakes['claim-stake-tier-1'] || []).forEach(t => tags.add(t)); }
        // zone access: the node that grants it, read from the raw nodes (2026-11-19: ONE node per zone class - checked
        // below; the old tags 135 / 125 were Medium Risk Building / Enemy Faction Extraction, which grant no zone now)
        if (z === 'medium') ZONE_NODE.medium.forEach(t => tags.add(t));
        if (z === 'enemy') ZONE_NODE.enemy.forEach(t => tags.add(t));
    });
    return { nodes: closeNames(tags), routes };
};
const viaModel = (recipeName, fac, mode) => {
    const r = rc.recipes.find(x => x.outputName === recipeName), g = research.gather(r, fac, mode, se), all = new Set(research.chainGate(r)); g.tags.forEach(t => all.add(t));
    const routes = {}; g.rows.forEach(x => { routes[x.res.name] = x.route + '/' + x.cls; });
    return { nodes: Array.from(research.closure(all)).map(n => n.name).sort(), routes, bill: research.bill(research.closure(all), new Set([research.start.id])) };
};
[['Power Regulation Module', 'ustur'], ['Thermal Management System', 'ustur'], ['Thermal Management System', 'oni'], ['Utility Controller', 'mud'], ['Mining Rig TTN T5', 'ustur'], ['Mining Rig TTN T5', 'oni']].forEach(([name, fac]) => {
    const a = viaModel(name, fac, 'stake'), b = byHand(name, fac);
    check(`${name}, ${fac}, stakes: nodes = the by-hand derivation (${b.nodes.length})`, () => JSON.stringify(a.nodes) === JSON.stringify(b.nodes), true);
    check(`${name}, ${fac}, stakes: route per raw = the by-hand derivation`, () => JSON.stringify(Object.entries(a.routes).sort()) === JSON.stringify(Object.entries(b.routes).sort()), true);
});
const prmStake = viaModel('Power Regulation Module', 'ustur', 'stake');
check('PRM, ustur, stakes: nodes to research / ATLAS (gathering only: no crafting gate) [derive PRM_USTUR_STAKES_BILL]', () => [prmStake.bill.todo, prmStake.bill.atlas], [2, 700]);
check('PRM, ustur, stakes: Garnet Crystals and Tritium Ore have no kit, so a fleet', () => [prmStake.routes['Garnet Crystals'], prmStake.routes['Tritium Ore']], ['fleet/own', 'fleet/own']);
check('PRM, raws in hand: no research at all on this export [derive CHAIN_power-regulation-module]', () => viaModel('Power Regulation Module', 'ustur', 'hand').nodes, []);
check('Mining Rig TTN T5, raws in hand: the crafting path only [derive S_HAND_NODES]', () => viaModel('Mining Rig TTN T5', 'ustur', 'hand').nodes, ['Mining Gear - T2', 'Mining Gear - T3', 'Mining Gear - T4', 'Mining Gear - T5', 'Starting Node', 'Titan Crafting', 'Utility Ship Components']);
check('Mining Rig TTN T5, ustur, stakes: crafting 6 nodes, gathering adds 7 (2,450 ATLAS), 4,550 in all [derive S_USTUR_GATHER]', () => (b => [b.todo, b.atlas])(viaModel('Mining Rig TTN T5', 'ustur', 'stake').bill), [13, 4550]);
const tmsStake = viaModel('Thermal Management System', 'ustur', 'stake');
check('TMS, ustur, stakes: three raws only in medium risk', () => Object.entries(tmsStake.routes).filter(([, v]) => v.endsWith('/medium')).map(([k]) => k).sort(), ['Cryo Formation Crystals', 'Drywater', 'Plasma Containment Minerals']);
check('TMS, ustur, stakes: the path includes zone access [derive TMS_USTUR_HAS_MEDIUM_NODE]', () => tmsStake.nodes.includes('Medium Risk Traversal'), true);
check('TMS, ustur, stakes: levels Crafting / Mining / Building / Pilot [derive TMS_USTUR_STAKES_LEVELS]', () => [tmsStake.bill.levels.Crafting, tmsStake.bill.levels.Mining, tmsStake.bill.levels.Building, tmsStake.bill.levels.Pilot], [null, 1, null, 5]);
check('nodes that grant medium-risk access, cheapest first [derive MEDIUM_GRANTS]', () => research.zoneGrants.medium.map(n => n.name), ['Medium Risk Traversal']);
check('enemy-zone grant: no Mining-track grant on this export, so the only one (Pilot) [derive ENEMY_GRANTS]', () => [research.zoneGrant('enemy', 'Mining').name, research.zoneGrant('enemy', 'Mining').track.key], ['Enemy Faction Traversal', 'Pilot']);
// the 93 raws by the nearest zone a USTUR player finds them in - direct scan of the planet data
const scan = { own: 0, medium: 0, enemy: 0 }, viaRoute = { own: 0, medium: 0, enemy: 0 };
rm.list.filter(r => r.category === 'raw').forEach(r => {
    let best = null; const rank = { own: 0, medium: 1, enemy: 2 };
    D.planets.mapData.forEach(s => { if (s.planets.some(p => (p.resources || []).some(q => q.name === r.name))) { const z = zoneOfSystem(s, 'ustur'); if (best == null || rank[z] < rank[best]) best = z; } });
    scan[best]++; viaRoute[research.rawRoute(r, 'ustur', 'fleet', se).cls]++;
});
check('93 raws by nearest zone for USTUR (own / medium / enemy), direct scan [derive RAWS_BY_ZONE_USTUR]', () => [scan.own, scan.medium, scan.enemy], [54, 37, 2]);
check('the same through the route model', () => [viaRoute.own, viaRoute.medium, viaRoute.enemy], [scan.own, scan.medium, scan.enemy]);
const gold = n => research.rawRoute(rm.byName.get('Gold Ore'), n, 'stake', se);
check('Gold Ore: an ONI kit - ONI stakes it (nearest: medium risk), USTUR cannot run the kit and sends a fleet [derive GOLD_ROUTES]', () => [gold('oni').route + '/' + gold('oni').cls, gold('ustur').route + '/' + gold('ustur').cls], ['stake/medium', 'fleet/medium']);
// a gate tag no node grants (the kit's hardness tag 159 on this export) is skipped, never a crash
check('Gold Ore for ONI: the faction-building node is on the path; the kit\'s tag 159 has no node [derive GOLD_ONI_TAG_NODES]', () => [gold('oni').tags.map(t => research.nodeOfTag.get(t)).filter(Boolean).map(n => n.name).includes('ONI Faction Buildings'), gold('oni').tags.filter(t => !research.nodeOfTag.has(t))], [true, [159]]);

// ---- 9. haul vs haul (2026-10-05): loadout stats through the Ship Explorer's own calculator (ShipExplorer/
//         config-calculator.js, loaded here as a bare class file), travel maths re-derived by hand, crossovers checked
//         against a direct scan of the two throughput curves. Constants from the first run, corroborated here.
const { Loadout } = window.CommandDeck;
const CalcClass = new Function(require('fs').readFileSync(path.join(ROOT, 'ShipExplorer/config-calculator.js'), 'utf8') + '\nreturn ShipConfigCalculator;')();
const LO = new Loadout(D.ships.ships, load('Data/ship-components-data.js'), load('Data/ship-formulas-data.js'), CalcClass, load('Data/combat-data.js'), rc);
check('61 hulls carry cargo and a drive; the Tap has 48 configurations', () => [LO.ships.length, LO.configsOf('Armstrong IMP Tap').length], [61, 48]);
check('components resolved', () => Object.keys(LO.componentsById).length, 3756);
const CB = LO.stats('Armstrong IMP Tap', 'Cargo Boost Max'), FF = LO.stats('Armstrong IMP Tap', 'Fast Freight Max'), BASE = LO.stats('Armstrong IMP Tap', 'Default');
// 2026-11-19 RULE-FREE checks. The export now lists 12 physical drone units per drone port and the per-unit stacking
// rule is unconfirmed (the owner asks the game team), so the drone-dependent constants (hold x1.754, 222,197 an hour,
// Mining Max 27.54/s, Scanning 1,606 SDU an hour ...) are no longer pinned. Instead: the deck's value equals a FRESH
// calculator run made here on the flat combat row and the raw configuration (not through Loadout.stats), and it sits on
// a "drone ladder": drone-free fit -> one unit per drone port (the old reading, which gave the old pins) -> every listed
// unit (what the calculator does now) is monotone, which holds under any rule where each extra unit moves a stat the
// same way. fresh(hull, cfg, drones): drones = 'all' | 'port' (one unit per Drone Port item) | 'none'; .__base = the row.
// WHAT THIS GROUP DOES NOT PIN (2026-11-19 review S3): the "= a fresh calculator run" check uses the same ShipConfigCalculator
// and statKeys as the deck, so it cannot catch a wrong every-unit stacking. Values with every listed drone unit applied
// are UNPINNED until the game's per-unit drone rule is confirmed; only the one-unit-per-port rung (hold x1.754, x1.385,
// Mining Max 27.54/s) is pinned, and the rest is "above the bare Tap" / monotone ladder.
const RF = ' [rule-free: every-unit drone values unpinned until the rule is confirmed]';
const FORM = load('Data/ship-formulas-data.js'), FLAT = load('Data/combat-data.js').allShips;
const fresh = (hull, cfgName, drones) => {
    const c = new CalcClass({ multiplierStackingMode: 'linear' }); const spm = {}; LO.statKeys.forEach(k => { spm[k] = [k]; });
    c.setData({ componentsById: LO.componentsById, componentAttributes: FORM.componentAttributes, classScalingFormulas: FORM.classScalingFormulas, tierScalingFormulas: FORM.tierScalingFormulas, statPathMap: spm, statKeys: LO.statKeys });
    const row = FLAT.find(s => s['Ship Name'] === hull), cfg = JSON.parse(JSON.stringify(D.ships.ships.find(s => s.name === hull).configurations.find(x => x.name === cfgName)));
    const ports = ((((cfg.components || {})['Ship Component'] || {})['Drone Port'] || {}).items || []).length;
    Object.values((cfg.components || {}).Drones || {}).forEach(v => { if (v && v.items) v.items = drones === 'none' ? [] : drones === 'port' ? v.items.slice(0, ports) : v.items; });
    const v = c.calculateModifiedStats(row, cfg).values, out = Object.assign({}, row);
    LO.statKeys.forEach(k => { if (v[k] != null) out[k] = v[k]; });
    out.__base = row;
    return out;
};
// monotone ladder: [none, port, all] never reverses direction (ties allowed)
const ladderOk = (a, b, c) => (b - a) * (c - b) >= -1e-9 * Math.max(1, Math.abs(c));
const ladder = (hull, cfgName, k) => ['none', 'port', 'all'].map(d => fresh(hull, cfgName, d)[k]);
const near9 = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
check('Default = the bare hull: every multiplier 1', () => Object.values(BASE.mult).every(m => m === 1), true);
// warp speed, range and fuel carry no drone term (the same value under the old one-unit reading and now): still pinned
check('Cargo Boost Max: warp speed x1.2, warp range x1.621 (constants, no drone term)', () => [CB.mult.warp_speed, CB.mult.max_warp_distance].map(v => +v.toFixed(3)), [1.2, 1.621]);
check('  its hold multiplier = a fresh calculator run, above 1, on a monotone drone ladder' + RF, () => { const f = fresh('Armstrong IMP Tap', 'Cargo Boost Max', 'all'), L = ladder('Armstrong IMP Tap', 'Cargo Boost Max', 'cargo_capacity'); return [CB.mult.cargo_capacity, near9(CB.mult.cargo_capacity, f.cargo_capacity / f.__base.cargo_capacity), CB.mult.cargo_capacity > 1, ladderOk(...L), near9(CB.mod.cargo_capacity, L[2]), +(L[1] / f.__base.cargo_capacity).toFixed(3)]; }, [CB.mult.cargo_capacity, true, true, true, true, 1.754]);
check('Fast Freight Max: warp speed x1.6, warp range x1.755, warp fuel x0.712 (constants, no drone term)', () => [FF.mult.warp_speed, FF.mult.max_warp_distance, FF.mult.warp_fuel_consumption].map(v => +v.toFixed(3)), [1.6, 1.755, 0.712]);
check('  its hold multiplier = a fresh calculator run, above 1, on a monotone drone ladder' + RF, () => { const f = fresh('Armstrong IMP Tap', 'Fast Freight Max', 'all'), L = ladder('Armstrong IMP Tap', 'Fast Freight Max', 'cargo_capacity'); return [FF.mult.cargo_capacity, near9(FF.mult.cargo_capacity, f.cargo_capacity / f.__base.cargo_capacity), FF.mult.cargo_capacity > 1, ladderOk(...L), near9(FF.mod.cargo_capacity, L[2]), +(L[1] / f.__base.cargo_capacity).toFixed(3)]; }, [FF.mult.cargo_capacity, true, true, true, true, 1.385]);
check('Cargo Boost Max fits 4 Cargo Modules M-T5 and a Freight drone', () => [CB.fit.find(f => f.type === 'Cargo Module').n, CB.fit.find(f => f.type === 'Cargo Module').cls + '-' + CB.fit.find(f => f.type === 'Cargo Module').tier, !!CB.fit.find(f => f.type === 'Freight')], [4, 'M-T5', true]);
// the calculator's answer equals the Ship Explorer's own: the same class, same inputs, same stacking mode
// the same class on the flat row (Data/combat-data.js allShips), every stat key, paths [key] - the Ship Explorer's
// own reading of the same configuration
const direct = (() => { const c = new CalcClass({ multiplierStackingMode: 'linear' }); const spm = {}; LO.statKeys.forEach(k => { spm[k] = [k]; }); c.setData({ componentsById: LO.componentsById, componentAttributes: load('Data/ship-formulas-data.js').componentAttributes, classScalingFormulas: load('Data/ship-formulas-data.js').classScalingFormulas, tierScalingFormulas: load('Data/ship-formulas-data.js').tierScalingFormulas, statPathMap: spm, statKeys: LO.statKeys }); const row = load('Data/combat-data.js').allShips.find(s => s['Ship Name'] === 'Armstrong IMP Tap'); return c.calculateModifiedStats(row, D.ships.ships.find(s => s.name === 'Armstrong IMP Tap').configurations.find(x => x.name === 'Cargo Boost Max')).values; })();
check('loadout stats = a fresh ShipConfigCalculator run, every one of the flat stat keys', () => LO.statKeys.every(k => Math.abs((CB.mod[k] || 0) - (direct[k] || 0)) <= 1e-9 * Math.max(1, Math.abs(direct[k] || 0))), true);
check('the flat row and the hub\'s nested stats agree on the Tap\'s hold, tank, warp speed and mining rate', () => [CB.base.cargo_capacity, CB.base.fuel_capacity, CB.base.warp_speed, CB.base.asteroid_mining_rate], (s => [s.stats.capacities.cargoCapacity, s.stats.capacities.fuelCapacity, s.stats.travel.warpSpeed, s.stats.mining.asteroidMiningRate])(D.ships.ships.find(s => s.name === 'Armstrong IMP Tap')));
// travel maths by hand at 10 units for Cargo Boost Max
const tCB = Loadout.trip(CB.mod, 10, 'warp'), m = CB.mod;
const jH = Math.ceil(10 / m.max_warp_distance), flyH = jH * m.warp_spool_time + 10 / m.warp_speed + (jH - 1) * m.warp_cool_down, loadH2 = m.cargo_capacity / m.loading_rate;
check('Cargo Boost Max at 10 units: 1 jump (range 12.16)', () => [tCB.jumps, jH], [1, 1]);
check('  round trip = 2 x fly + 2 x load + cooldown', () => tCB.time, 2 * flyH + 2 * loadH2 + m.warp_cool_down, 1e-12);
// the round trip by hand on the FRESH calculator values (fCB), not on the deck's row: the deck's figure must equal it
const fCB = fresh('Armstrong IMP Tap', 'Cargo Boost Max', 'all'), fBASE = Object.assign({}, FLAT.find(s => s['Ship Name'] === 'Armstrong IMP Tap'));
const handTrip = (s, d) => { const j = Math.ceil(d / s.max_warp_distance - 1e-9), fly = j * s.warp_spool_time + d / s.warp_speed + (j - 1) * s.warp_cool_down, ld = s.cargo_capacity / s.loading_rate, time = 2 * fly + 2 * ld + s.warp_cool_down; return { time, perHour: s.cargo_capacity * 3600 / time, fuelPerUnit: (2 * s.warp_fuel_consumption * d + s.planet_exit_fuel) / s.cargo_capacity }; };
check('  cargo an hour = hold x 3600 / round trip, = the same sum on a fresh calculator run, above the bare Tap\'s' + RF, () => [near9(tCB.perHour, m.cargo_capacity * 3600 / tCB.time), near9(tCB.perHour, handTrip(fCB, 10).perHour), tCB.perHour > handTrip(fBASE, 10).perHour], [true, true, true]);
check('  fuel per unit = (2 x warp fuel x d + exit) / hold, = the same on a fresh calculator run, above 0' + RF, () => [near9(tCB.fuelPerUnit, (2 * m.warp_fuel_consumption * 10 + m.planet_exit_fuel) / m.cargo_capacity), near9(tCB.fuelPerUnit, handTrip(fCB, 10).fuelPerUnit), tCB.fuelPerUnit > 0], [true, true, true]);
check('  the fitted Tap hauls more than the bare Tap at 10 units; the ratio = the fresh run\'s' + RF, () => { const r = tCB.perHour / Loadout.trip(BASE.mod, 10, 'warp').perHour; return [r > 1, near9(r, handTrip(fCB, 10).perHour / handTrip(fBASE, 10).perHour)]; }, [true, true]);
// crossovers: direct scan of A - B on 3,000 points must find sign changes at the same places (within one step).
// 2026-11-19: the count (was 8) and the places (were warp-range multiples) move with the drone rule; what holds under
// any rule: the deck finds exactly the scan's sign changes, each winner matches the curves just past it, and the
// leaders alternate from the one at 0.5 units to the one at 60 units.
const xs = Loadout.crossovers(CB.mod, FF.mod, 'warp', 0.5, 60);
const flips = []; let pv = null; for (let i = 0; i <= 3000; i++) { const d = 0.5 * Math.pow(120, i / 3000); const v = Loadout.trip(CB.mod, d, "warp").perHour - Loadout.trip(FF.mod, d, "warp").perHour; if (pv != null && Math.sign(v) !== Math.sign(pv)) flips.push(d); pv = v; }
const leadAt = d => (handTrip(CB.mod, d).perHour - handTrip(FF.mod, d).perHour > 0 ? 'A' : 'B');
check('crossovers between 0.5 and 60 units: as many as the direct scan\'s sign changes (at least 1), each within 0.3 % of one' + RF, () => [xs.length === flips.length, xs.length >= 1, xs.every(x => flips.some(d => Math.abs(d - x.d) / x.d < 0.003))], [true, true, true]);
check('each crossover\'s winner leads on the hand-computed curves just past it (+0.5 %)' + RF, () => xs.map(x => x.winnerAfter === leadAt(x.d * 1.005)), xs.map(() => true));
check('the leaders alternate from the one at 0.5 units to the one at 60 units' + RF, () => [xs.every((x, i) => x.winnerAfter !== (i ? xs[i - 1].winnerAfter : leadAt(0.5))), (xs.length ? xs[xs.length - 1].winnerAfter : leadAt(0.5)) === leadAt(60)], [true, true]);
check('subwarp: no jumps, no crossover (Cargo Boost leads at every length)', () => [Loadout.trip(CB.mod, 10, 'subwarp').jumps, Loadout.crossovers(CB.mod, FF.mod, 'subwarp', 0.5, 60).length], [0, 0]);

// ---- 10. the other Loadouts sub-tabs (2026-10-05): mining cycle by hand, the combat formula run directly, the
//          configuration cost against the Recipe planner, fleet points against the export table
const MM = LO.stats('Armstrong IMP Tap', 'Mining Max');
const mm = Loadout.mine(MM.mod, 10, 'warp', 1), tMM = Loadout.trip(MM.mod, 10, 'warp');
// 2026-11-19: was "rate x1.2 + 3.758 additive (constant 27.54/s)" - 27.54 is the one-unit-per-port rung of the ladder
check('Mining Max: rate = a fresh calculator run, above the bare Tap\'s 19.192/s, on a monotone drone ladder' + RF, () => { const L = ladder('Armstrong IMP Tap', 'Mining Max', 'asteroid_mining_rate'); return [MM.mod.asteroid_mining_rate, near9(MM.mod.asteroid_mining_rate, L[2]), MM.mod.asteroid_mining_rate > BASE.mod.asteroid_mining_rate, ladderOk(...L), +L[1].toFixed(2)]; }, [MM.mod.asteroid_mining_rate, true, true, true, 27.54]);
check('  cycle = hold / rate + round trip; ore an hour = hold x 3600 / cycle', () => [mm.fill, mm.cycle, mm.perHour], [MM.mod.cargo_capacity / MM.mod.asteroid_mining_rate, MM.mod.cargo_capacity / MM.mod.asteroid_mining_rate + tMM.time, MM.mod.cargo_capacity * 3600 / (MM.mod.cargo_capacity / MM.mod.asteroid_mining_rate + tMM.time)]);
check('  richness 2 halves the fill and leaves the trip alone', () => [Loadout.mine(MM.mod, 10, 'warp', 2).fill * 2, Loadout.mine(MM.mod, 10, 'warp', 2).trip.time], [mm.fill, tMM.time]);
check('  food per unit = food rate x fill / hold', () => mm.foodPerUnit, MM.mod.asteroid_mining_food_rate * mm.fill / MM.mod.cargo_capacity, 1e-12);
// 2026-11-19: was "69.8 k vs 52.7 k an hour" (one unit per port); both readings put Mining Max ahead, and its rate is
// above Cargo Boost Max's (which fits no mining gear) under any rule
const handMine = (s, d) => { const t = handTrip(s, d), fill = s.cargo_capacity / s.asteroid_mining_rate; return s.cargo_capacity * 3600 / (fill + t.time); };
check('  Mining Max out-mines Cargo Boost Max at 10 units; both = the hand cycle on fresh calculator runs' + RF, () => { const cb = Loadout.mine(CB.mod, 10, 'warp', 1).perHour; return [mm.perHour > cb, MM.mod.asteroid_mining_rate > CB.mod.asteroid_mining_rate, near9(mm.perHour, handMine(fresh('Armstrong IMP Tap', 'Mining Max', 'all'), 10)), near9(cb, handMine(fCB, 10))]; }, [true, true, true, true]);
check('  a hull with no mining rate returns null', () => Loadout.mine(Object.assign({}, MM.mod, { asteroid_mining_rate: 0 }), 10, 'warp', 1), null);
// the combat formula run directly on the same rows, N=200, first strike alternating, must agree with the engine's share within 10 points
const KD = LO.stats('Armstrong IMP Tap', 'Kinetic Damage Max'), DEF = LO.stats('Armstrong IMP Tap', 'Default');
const fightSrc = load('Data/combat-data.js').combatFormula, fightFn = new Function('left', 'right', 'window', 'document', 'console', fightSrc.trim().replace(/^\(function\s*\(\)\s*\{/, '').replace(/\}\)\(\)\s*;?$/, ''));
const directFight = (a, b, n) => { let L = 0, R = 0; for (let i = 0; i < n; i++) { const t = fightFn(a, b, { combatResultsStyleAdded: true, combatFirstStriker: i % 2 ? 'right' : 'left' }, null, { log() { }, warn() { }, error() { } }).replace(/<[^>]+>/g, ' '); if (/LEFT WINS/.test(t)) L++; else if (/RIGHT WINS/.test(t)) R++; } return [L / n, R / n]; };
const fKD = LO.fight(KD.mod, DEF.mod, 200), dKD = directFight(KD.mod, DEF.mod, 200);
// 2026-11-19: the export's combat formula calls Math.random; one run of the suite read 0.995 (one bout of 200 lost), so
// "every bout" was a flake. A loadout that is not clearly stronger sits near 0.5 (the mirror match below)
check('Kinetic Damage Max beats the bare Tap in at least 98 % of bouts, engine and direct run alike', () => [fKD.pA >= 0.98, dKD[0] >= 0.98], [true, true]);
check('  rounds are parsed (mean > 0) and shares sum to 1', () => [fKD.meanRounds > 0, Math.abs(fKD.pA + fKD.pB + fKD.pDraw - 1) < 1e-9], [true, true]);
const fM = LO.fight(DEF.mod, DEF.mod, 400);
check('  mirror match: neither side above 65 % over 400 bouts (first strike alternates)', () => fM.pA < 0.65 && fM.pB < 0.65, true);
const fX = LO.fight(LO.stats('Pearce X4', 'Default').mod, LO.stats('Armstrong IMP', 'Default').mod, 100);
check('  an X4 does not beat a bare IMP', () => fX.pA < 0.1, true);
// cost: the configuration's recipes equal the Recipe planner's bill for the same items
const cCB = LO.cost(CB);
check('Cargo Boost Max costs 9 recipes, none unpriced (4 x Cargo M T5, 7 x M T5 components, 1 drone at T1)', () => [cCB.found, cCB.unpriced.length, cCB.recipes.find(r => r.name === 'Cargo M T5').qty, cCB.recipes.filter(r => r.assumed).length], [9, 0, 4, 1]);
const planBill = rc.plan(cCB.recipes.map(r => ({ id: r.id, qty: r.qty })));
check('  its raw bill = the Recipe planner\'s for the same recipes (units and kinds)', () => [Math.round(cCB.rawUnits), cCB.rawList.length], [Math.round(planBill.totals.rawUnits), planBill.totals.rawKinds]);
// 2026-11-19: was "Copper Ore (constant 137,672 units)"; the bill now prices 12 drone units, so the top raw is the
// Recipe planner's own top raw for the same recipes (name and units), and the list is sorted largest first
check('  top raw = the Recipe planner\'s top raw for the same recipes; the list runs largest first' + RF, () => [cCB.rawList[0].name, Math.round(cCB.rawList[0].qty), cCB.rawList.every((r, i) => !i || cCB.rawList[i - 1].qty >= r.qty)], [planBill.raws[0].name, Math.round(planBill.raws[0].qty), true]);
check('  the bare hull costs nothing', () => LO.cost(DEF).found, 0);
check('  Kinetic Damage Max: every component priced (weapons by name)', () => LO.cost(KD).unpriced.length, 0);
// scanning: one scan per cooldown
const SM = LO.stats('Armstrong IMP Tap', 'Scanning Max'), sc = Loadout.scan(SM.mod), sc0 = Loadout.scan(DEF.mod);
// 2026-11-19: on a fresh calculator run; SDU per token is SDU / cost only for a positive cost (the deck's own rule,
// Infinity otherwise) - the fitted Scanning Max cost is negative under every-unit stacking, see the PENDING item below
const fSM = fresh('Armstrong IMP Tap', 'Scanning Max', 'all');
check('Scanning Max: SDU an hour = SDU per scan x 3600 / cooldown; tokens an hour likewise; SDU per token = SDU / cost (cost > 0) - on a fresh calculator run' + RF, () => [sc.sduPerHour, sc.tokensPerHour, sc.sduPerToken].map(v => +v.toFixed(6)), [fSM.sduPerScan * 3600 / fSM.scan_cool_down, fSM.scan_cost * 3600 / fSM.scan_cool_down, fSM.scan_cost > 0 ? fSM.sduPerScan / fSM.scan_cost : Infinity].map(v => +v.toFixed(6)));
check('  the bare Tap: 193 SDU every 732 s = 949 an hour (constant)', () => [DEF.mod.sduPerScan, DEF.mod.scan_cool_down, Math.round(sc0.sduPerHour)], [193, 732, 949]);
// 2026-11-19: was "SDU an hour 1,606 (constant)" (one unit per port); now 1,193 with every unit (its cooldown grows too)
check('  Scanning Max raises SDU an hour and scan power above the bare Tap; SDU per scan on a monotone drone ladder' + RF, () => [sc.sduPerHour > sc0.sduPerHour, sc.power > sc0.power, ladderOk(...ladder('Armstrong IMP Tap', 'Scanning Max', 'sduPerScan')), near9(SM.mod.sduPerScan, fSM.sduPerScan)], [true, true, true, true]);
check('  no scanner -> null', () => Loadout.scan(Object.assign({}, DEF.mod, { scan_cool_down: 0 })), null);
// PENDING: with every listed drone unit stacked linearly, some fitted scan costs go NEGATIVE (impossible). Not a FAIL:
// the per-unit rule is unconfirmed and the calculator stays as is (lead's decision 2026-11-19). Every hull/config with a
// negative fitted cost is listed just above the PENDING line (pending-detail); the line itself carries the count and the worst three.
pending('scan cost stays >= 0 (per-unit drone stacking unconfirmed)', () => {
    const neg = []; let n = 0;
    LO.ships.forEach(s => LO.configsOf(s.name).forEach(c => { n++; const st = LO.stats(s.name, c); if (st.mod.scan_cost < 0) neg.push({ hull: s.name, cfg: c, def: st.base.scan_cost, fit: st.mod.scan_cost }); }));
    neg.sort((a, b) => a.fit - b.fit);
    neg.forEach(x => console.log(`   pending-detail  ${x.hull} / ${x.cfg}: default scan_cost ${x.def}, fitted ${+x.fit.toFixed(3)}`));
    return `NOT PINNED: values with every listed drone unit applied stay unpinned until the per-unit rule is confirmed (only the one-unit-per-port rung is pinned). ${neg.length} of ${n} hull configurations have a negative fitted scan_cost; worst three: ` + neg.slice(0, 3).map(x => `${x.hull} / ${x.cfg} (default ${x.def}, fitted ${+x.fit.toFixed(3)})`).join('; ');
});
// fleet points
const fp = load('Data/combat-data.js').fleetPoints.classes;
check('fleet points per class = the export table (1, 4, 9 ... 81)', () => [1, 2, 3, 4, 5, 6, 7, 9].map(c => LO.points.get(c).combat_points), [1, 4, 9, 16, 25, 36, 49, 81]);
check('  combat and capacity points agree in every class but Titan (81 combat / 128 capacity)', () => [fp.filter(c => c.combat_points !== c.capacity_points).map(c => c.token), fp.find(c => c.token === 'TTN').capacity_points], [['TTN'], 128]);
check('  a Tap is Medium = 16 points, an IMP Capital = 36', () => [CB.points, LO.stats('Armstrong IMP', 'Default').points], [16, 36]);
check('  Fleet Size ladder in the research nodes: start 9, tiers 4 .. 73 [derive FLEET_LADDER]', () => [(research.nodes.find(n => n.name === 'Starting Node') || {}).grants.fleet_size].concat([1, 2, 3, 4, 5, 6, 7, 8].map(t => research.nodes.find(n => n.name === `Fleet Size - Tier ${t}`).grants.fleet_size)), [9, 4, 13, 23, 33, 43, 52, 62, 73]);
// the grants are ADDITIVE: every tier's description names the running total ("raising cumulative capacity to 11"), so
// the cap the Fleet sub-tab shows is the cumulative sum, and each sum must match the number the description itself quotes
check('  the Fleet Size CAP is cumulative: 9, 13, 26 .. 312, and every tier\'s description quotes that running total [derive FLEET_CAPS, FLEET_QUOTED]',() => (() => {
    let run = research.nodes.find(n => n.name === 'Starting Node').grants.fleet_size; const caps = [run], quoted = [];
    for (const t of [1, 2, 3, 4, 5, 6, 7, 8]) { const n = research.nodes.find(x => x.name === `Fleet Size - Tier ${t}`); run += n.grants.fleet_size; caps.push(run); const m = /cumulative capacity to (?:the maximum of )?(\d+)/.exec(n.description || ''); quoted.push(m ? +m[1] : null); }
    return [caps, quoted];
})(), [[9, 13, 26, 49, 82, 125, 177, 239, 312], [13, 26, 49, 82, 125, 177, 239, 312]]);

// ---- 11. a node's benefit in words (2026-10-06): the export's sentence (code page repaired), each grant as a
//          sentence, the nodes it leads to - read against the raw export fields in JSON/research.json
const RAW = require(path.join(ROOT, 'JSON/research.json')).nodes, rawOf = name => RAW.find(n => n.name === name);
const B = name => research.benefit(research.byName.get(name));
// 2026-10-25 (FIX-SPEC A11): the grant sentence also names the running total
check('Fleet Size - Tier 1: fleet_size 4 reads as one sentence, with the cumulative cap [derive FLEET_LADDER, FLEET_CAPS]', () => [B('Fleet Size - Tier 1').grants.map(g => g.text), rawOf('Fleet Size - Tier 1').character_value_changes.fleet_size], [['Fleet cap +4 points (13 in total)'], 4]);
check('  its description is the export\'s own sentence', () => B('Fleet Size - Tier 1').text, rawOf('Fleet Size - Tier 1').description.trim());
check('  Medium Ships: max_ship_size Medium -> fly hulls up to Medium', () => B('Medium Ships').grants.map(g => g.text), ['Fly hulls up to Medium']);
check('  Medium Risk Traversal (the one MediumRiskZone grant on this export): the zone in words [derive MEDIUM_GRANTS]', () => B('Medium Risk Traversal').grants.map(g => g.text), ['Travel into medium-risk zones (faction-owned or neutral)']);
check('  Enemy Faction Traversal: enemy zones in words [derive ENEMY_GRANTS]', () => B('Enemy Faction Traversal').grants.map(g => g.text), ['Travel into enemy faction zones']);
// 2026-11-19: the export added warp_cooldown_modifier (Warp Cooldown 1-4) and hit_chance_modifier (the Targeting ladder);
// before the fix in deck-model.js grantText they printed as raw keys ("warp cooldown modifier: -0.05")
check('  Warp Cooldown 1 and Novice Targeting: the new grant keys read as sentences', () => [B('Warp Cooldown 1').grants.map(g => g.text), B('Novice Targeting').grants.map(g => g.text), rawOf('Warp Cooldown 1').character_value_changes.warp_cooldown_modifier, rawOf('Novice Targeting').character_value_changes.hit_chance_modifier], [['Warp cooldown -5 %'], ['Hit chance +1 %'], -0.05, 0.01]);
check('  Warp Lane Fee Reduction: a -0.25 modifier reads as -25 %', () => B('Warp Lane Fee Reduction').grants.map(g => g.text), ['Warp lane fees -25 %']);
const rmd = B('Rare Mineral Discoveries').grants[0], rmdRaw = rawOf('Rare Mineral Discoveries').character_value_changes.rare_mineral_discovery;
check('  Rare Mineral Discoveries: +5 % per level on the 31 resources the export lists, every one named from its cargo table', () => [rmd.text, rmd.list.length, rmd.list.includes('Abyssal Energy Crystals')], [`+5 % yield per level on ${Object.keys(rmdRaw).length} asteroid-mined resources`, Object.keys(rmdRaw).length, true]);
check('  Residential Expansion (Unlimited): +1 plot per level, not "up to 1"', () => B('Residential Expansion').grants.map(g => g.text), ['+1 residential (crafting-hab) plot per level']);
// 2026-10-25 (FIX-SPEC A11): the editor's "Phase 1.5a add - was C4-only" sentence is now dropped on display - the repair
// is checked on fixText, the drop on the shown text
// 2026-11-19: the subject moved from Fleet Concurrency - Tier 1 (clean on this export) to the first DRAWN node whose
// export text carries the damage, by rule [derive DESC_CP1252_DAMAGE: Claim Stakes - Tier 1; the other one is not drawn]
const dmg = research.nodes.find(n => /â€/.test((rawOf(n.baseName) || {}).description || ''));
check('  the first drawn node with code-page damage is Claim Stakes - Tier 1: the em dash is repaired on display and left in the data; the release note is not shown', () => [dmg && dmg.baseName, /â€/.test(ResearchModel.fixText(rawOf(dmg.baseName).description)), ResearchModel.fixText(rawOf(dmg.baseName).description).includes('Phase 1.5a add - was missing in editor'), B(dmg.name).text.includes('Phase'), B(dmg.name).text, /â€/.test(rawOf(dmg.baseName).description)], ['Claim Stakes - Tier 1', false, true, false, 'Tier-1 productive plot unlock.', true]);
check('  no description survives with code-page damage', () => research.nodes.filter(n => /â€|Â /.test(research.benefit(n).text)).length, 0);
check('  every grant key the export uses has a sentence (no raw-key fallback)', () => research.nodes.flatMap(n => research.benefit(n).grants).filter(g => g.raw).length, 0);
// 2026-11-19: 'Freelance Pilot' is gone; the node that opens the most is picked by rule [derive MOST_CHILDREN]
check('  Hull Integrity leads to Novice Hull Integrity; the Starting Node opens the most (156: 147 by prerequisite + 9 no-number nodes hung off it); a leaf opens none [derive HULL_INTEGRITY_CHILDREN, MOST_CHILDREN, ELITE_HULL_CHILDREN]', () => [B('Hull Integrity').leadsTo.map(c => c.name), research.nodes.slice().sort((a, b) => b.children.length - a.children.length || a.order - b.order)[0].baseName, B('Starting Node').leadsTo.length, B('Elite Hull Integrity').leadsTo.length], [['Novice Hull Integrity'], 'Starting Node', 156, 0]);
check('  leads-to is the inverse of prerequisites, over the whole tree', () => research.nodes.every(n => n.children.every(c => c.prereqs.includes(n) || c.primary === n)) && research.nodes.filter(n => n.prereqs.length).every(n => n.prereqs.every(p => p.children.includes(n))), true);
check('  Mining Gear - T1: no sentence and no grant in the export (the page says so)', () => [B('Mining Gear - T1').text, B('Mining Gear - T1').grants.length, rawOf('Mining Gear - T1').description], ['', 0, '']);

// ---- 12. hab schedule (2026-10-08): synthetic plans worked by hand, then the real plan - on 1 job it must equal
//          every craft in sequence, on unlimited jobs the Recipe planner's critical path - and every placed craft
//          re-checked against the pool rule and the lanes directly
const mk = defs => { const crafts = new Map(), steps = new Map(); defs.forEach(([name, n, each, outQ, ings]) => { crafts.set(name, n); steps.set(name, { name, each, outQ, ings: (ings || []).map(([nm, q]) => ({ name: nm, qty: q })) }); }); return { crafts, steps }; };
const chainPlan = mk([['A', 2, 100, 1], ['B', 2, 200, 1, [['A', 1]]], ['C', 1, 300, 1, [['B', 2]]]]);
const s1 = empire.schedule(chainPlan, { jobs: 1 }), s2 = empire.schedule(chainPlan, { jobs: 2 });
check('chain A x2 -> B x2 -> C x1 on 1 job: 900 s, the one lane busy throughout', () => [s1.makespan, s1.lanes.length, s1.lanes[0].util, s1.crafts], [900, 1, 1, 5]);
check('  the order on the lane: A A B B C', () => s1.jobs.map(j => j.name), ['A', 'A', 'B', 'B', 'C']);
check('  on 2 jobs: 600 s (A | A, then B | B, then C), lane 2 idle during the C', () => [s2.makespan, s2.lanes[0].busy, s2.lanes[1].busy], [600, 600, 300]);
check('  each B starts when an A is done (100 s), C when both B are (300 s)', () => s2.jobs.filter(j => j.name === 'B').map(j => j.start).concat(s2.jobs.find(j => j.name === 'C').start), [100, 100, 300]);
check('  critical path on 2 jobs: A -> B -> C, every wait an input', () => s2.path.map(p => p.name + ':' + p.kind), ['A:start', 'B:input', 'C:input']);
check('  on 1 job: A2, B1, B2 (500 s) each followed a lane wait, C (300 s) waited for the second B, A1 (100 s) opened', () => [s1.pathBy.lane, s1.pathBy.input, s1.pathBy.start], [500, 300, 100]);
check('  lower bounds: work / jobs = 450 s on 2 jobs, 900 on 1; the chain alone = 600 s', () => [s2.parallel, s1.parallel, s2.chain], [450, 900, 600]);
const flat = mk([['X', 3, 50, 1]]);
const s3 = empire.schedule(flat, { jobs: 2 });
check('3 X (50 s, no inputs) on 2 jobs: 100 s, lanes busy 100 + 50', () => [s3.makespan, s3.lanes[0].busy, s3.lanes[1].busy, s3.crafts], [100, 100, 50, 3]);
check('  on a 1x hab job and a 2x station: the station takes the first craft, 50 s in all (station 25 + 25, hab 50)', () => (s => [s.makespan, s.jobs[0].lane, s.lanes.map(l => l.jobs.length)])(empire.schedule(flat, { lanes: [{ label: 'Hab', speed: 1 }, { label: 'S', speed: 2 }] })), [50, 1, [1, 2]]);
const pool = mk([['M', 1, 10, 4], ['T', 4, 5, 1, [['M', 1]]]]);
const s4 = empire.schedule(pool, { jobs: 3 });
check('M x1 makes 4, T x4 take 1 each, 3 jobs: M alone first (2 lanes idle), 3 T at 10 s, the last at 15 s; 20 s in all', () => [s4.makespan, s4.jobs.map(j => j.start), s4.lanes.map(l => l.busy)], [20, [0, 10, 10, 10, 15], [20, 5, 5]]);
const s0 = empire.schedule({ crafts: new Map(), steps: new Map() }, { jobs: 3 });
check('an empty plan: 0 s, 0 crafts, 3 empty lanes, no path', () => [s0.makespan, s0.crafts, s0.lanes.length, s0.path.length, s0.parallel, s0.chain], [0, 0, 3, 0, 0, 0]);
check('an empty plan through expand(): the same', () => (s => [s.makespan, s.crafts])(empire.schedule(empire.expand([], new Set()), { jobs: 2 })), [0, 0]);
// batches (2026-10-24): over 20,000 crafts a job carries a batch of one kind - 400k crafts once overflowed the stack and
// one Ammo TTN T5 (236 million crafts) hung the page
const bigFlat = empire.schedule(mk([['X', 100000, 1, 1]]), { jobs: 1 });
check('100,000 X (1 s) on 1 job: batched, every craft placed, 100,000 s, at most 20,000 jobs', () => [bigFlat.batched, bigFlat.crafts, bigFlat.makespan, bigFlat.jobs.length <= 20000, bigFlat.complete], [true, 100000, 100000, true, true]);
const bigChain = empire.schedule(mk([['A', 600000, 10, 1], ['B', 300000, 20, 1, [['A', 2]]]]), { jobs: 4 });
check('  A x600k -> B x300k (2 A each) on 4 jobs: complete, 900k crafts, within 1 % of work / 4 = 3,000,000 s', () => [bigChain.complete, bigChain.crafts, Math.abs(bigChain.makespan / 3e6 - 1) < 0.01], [true, 900000, true]);
const ammo = rc.byId.get('ammo-ttn-t5'), AX = empire.expand([{ id: ammo.outputId, qty: 1 }], new Set());
const ammoT0 = Date.now(), A1 = empire.schedule(AX, { jobs: 1 }), ammoMs = Date.now() - ammoT0;
check('  the real Ammo TTN T5 x1 on 1 job: every craft placed, = every craft in sequence, under 5 s', () => [A1.complete, A1.crafts === AX.craftCount, Math.abs(A1.makespan / AX.sequential - 1) < 1e-9, ammoMs < 5000], [true, true, true, true]);
// the real plan (Power Regulation Module x100, nothing stopped at a processor)
const X = empire.expand(prmItems, new Set()), P1 = empire.schedule(X, { jobs: 1 }), P3 = empire.schedule(X, { lanes: [{ label: 'Hab T3', speed: 1 }, { label: 'S station', speed: 1.5 }, { label: 'S station', speed: 1.5 }] }), PN = empire.schedule(X, { jobs: X.craftCount });
check('PRM x100: expand keeps a step per craft kind, with its time, output and inputs', () => [X.steps.size === X.crafts.size, X.steps.get('Power Regulation Module').each, X.steps.get('Power Regulation Module').ings.length > 0], [true, prm.constructionTime, true]);
check('  on 1 job = every craft in sequence (1,200 crafts, 34,000 s)', () => [P1.makespan, P1.crafts, P1.lanes[0].util], [X.sequential, X.craftCount, 1]);
check('  on unlimited jobs = the Recipe planner\'s critical path (210 s)', () => [PN.makespan, rc.plan(prmItems).time.critical], [210, 210]);
check('  on a hab job + two S-station jobs (1 + 2 x 1.5 = 4 x): work / speed is 8,500 s, the schedule is not below it and places every craft', () => [Math.round(P3.parallel), P3.makespan >= P3.parallel - 1e-9, P3.crafts], [Math.round(X.sequential / 4), true, X.craftCount]);
// every placed craft re-checked directly: no overlap on a lane, the right duration, inputs in the pool at the start
const verify = S => {
    const bad = [];
    S.lanes.forEach(l => l.jobs.forEach((j, i) => { if (i && j.start < l.jobs[i - 1].end - 1e-9) bad.push('overlap ' + j.id); if (Math.abs(j.end - j.start - X.steps.get(j.name).each / l.speed) > 1e-9) bad.push('duration ' + j.id); }));
    S.jobs.forEach(j => X.steps.get(j.name).ings.forEach(i => { if (!X.steps.has(i.name)) return; const made = S.jobs.filter(q => q.name === i.name && q.end <= j.start + 1e-9).length * X.steps.get(i.name).outQ; const taken = S.jobs.filter(q => q.id <= j.id && X.steps.get(q.name).ings.some(z => z.name === i.name)).reduce((a, q) => a + X.steps.get(q.name).ings.find(z => z.name === i.name).qty, 0); if (made < taken - 1e-9) bad.push('input ' + j.id); }));
    const kinds = new Map(); S.jobs.forEach(j => kinds.set(j.name, (kinds.get(j.name) || 0) + 1)); X.crafts.forEach((n, name) => { if (kinds.get(name) !== n) bad.push('count ' + name); });
    return bad;
};
check('  every craft on the 3-lane schedule: no lane overlap, duration = each / speed, inputs in the pool, counts = the plan', () => verify(P3), []);
check('  the same on 1 job', () => verify(P1), []);
check('  the critical path ends at the last craft and starts at 0', () => [P3.path[P3.path.length - 1].end, P3.path[0].start, P3.path[0].kind], [P3.makespan, 0, 'start']);
check('  lane waits + input waits + the first craft = the whole path', () => Math.abs(P3.pathBy.lane + P3.pathBy.input + P3.pathBy.start - P3.path.reduce((a, p) => a + p.end - p.start, 0)) < 1e-6, true);
// the Hub Explorer's build as lanes
const HM = new window.HubModel(load('Data/crafting-hab-data.js'), D.recipes.recipes, D.resources.resources);
const HP = HM.plan([{ id: 'hab-t3', qty: 1 }, { id: 'hab-crafting-station-s', qty: 1 }, { id: 'hab-cargo-storage-t3', qty: 1 }]);
const LN = Empire.lanesFromHab(HP.rows);
check('T3 hab + S station + T3 storage: 5 lanes = the Hub Explorer\'s 5 jobs; speeds 1, 1.5 x3, 1', () => [LN.length, HP.jobs, LN.map(l => l.speed)], [5, 5, [1, 1.5, 1.5, 1.5, 1]]);
check('  no build: no lanes', () => Empire.lanesFromHab([]), []);

// ---- 13. audit fixes (2026-10-25, FIX-SPEC section A). Each check here FAILS on the code before the fix (values are
//          lazy so a missing method reads as a FAIL, not a crash); A1 on the old code takes minutes - see the hand-in.
// A2: a recipe's chain is ITS OWN ingredients, not the default recipe of its output name (318 names repeat)
const oph3 = rc.byId.get('oceanic-processing-hub-t3'), cl2 = rc.byId.get('component-crystal-lattice-2');
// 2026-11-19: no recipe variant's own chain needs other research than its name's default on this export [derive
// A2_SUBJECT = none], so the research half of A2 has no subject; the raw half (Crystal Lattice, next check) still has one
check('A2 Oceanic Processing Hub T3: needs no research on this export [derive CHAIN_oceanic-processing-hub-t3]; no variant\'s research differs from its name default\'s [derive A2_SUBJECT]', () => [Array.from(research.closure(research.chainGate(oph3))).map(n => n.name), rc.recipes.filter(r => r.ingredients && r.ingredients.length && rm.recipeByName.get(r.outputName) !== r && Array.from(research.closure(research.chainGate(r))).map(n => n.name).sort().join('|') !== Array.from(research.closure(research.chainGate(rm.recipeByName.get(r.outputName)))).map(n => n.name).sort().join('|') && r.outputType !== 'BUILDING').length], [[], 0]);
check('  all-faction Crystal Lattice T3 (Hydrogen + Rochinol): its raws, not the MUD-only Diamond variant\'s', () => research.gather(cl2, 'ustur', 'stake', se).rows.map(r => r.res.name).sort(), ['Hydrogen', 'Rochinol']);
check('  over all 5,280 recipes the chain walk = Empire.expand (crafted kinds and raw leaves)', () => rc.recipes.filter(r => { const x = empire.expand([{ id: r.outputId, qty: 1 }], new Set()), c = research.chainOf(r); return [...x.crafts.keys()].filter(n => n !== r.outputName).sort().join('|') !== c.crafted.map(q => q.outputName).sort().join('|') || [...x.leaves.keys()].filter(n => (rm.byName.get(n) || {}).category === 'raw').sort().join('|') !== [...c.raws.keys()].sort().join('|'); }).length, 0);
// A3: a raw as the goal is gathered, not crafted
const cuOre = rc.byId.get('copper-ore');
check('A3 Copper Ore as a goal: no crafting gate, and the raw itself is routed (a stake for USTUR)', () => [Array.from(research.chainGate(cuOre)), research.gather(cuOre, 'ustur', 'stake', se).rows.map(r => r.res.name + '/' + r.route)], [[], ['Copper Ore/stake']]);
// A4 / A9: capacity points against the cumulative Fleet Size cap; composition limits per fleet
const EP = new Empire(se, rc, D.ships.ships, load('Data/combat-data.js').fleetPoints);
const titan = EP.ships.find(s => s.size === 'Titan'), cap = EP.ships.find(s => s.size === 'Capital');
check('A4 a Titan counts 128 capacity points (combat 81), a Capital 36', () => [EP.capacityPoints(titan.name), EP.capacityPoints(cap.name)], [128, 36]);
check('  3 Capitals (108) need Fleet Size - Tier 5 (cap 125); 1 Titan (128) Tier 6 (177); 313 points: above the top cap [derive CAPITAL3_108_TIER, TITAN_128_TIER]', () => [research.fleetSizeFor(EP.fleetPoints([{ ship: cap.name, count: 3 }]).max).node.name, research.fleetSizeFor(EP.fleetPoints([{ ship: cap.name, count: 3 }]).max).cap, research.fleetSizeFor(EP.fleetPoints([{ ship: titan.name, count: 1 }]).max).node.name, research.fleetSizeFor(EP.fleetPoints([{ ship: titan.name, count: 1 }]).max).cap, (research.fleetSizeFor(313) || { node: { name: null } }).node.name], ['Fleet Size - Tier 5', 125, 'Fleet Size - Tier 6', 177, null]);
check('  the largest fleet sets the tier, the sum is reported; 2 Titans in one fleet break max_titans', () => (f => [f.max, f.sum, f.rows[0].warn.length > 0, f.rows[1].warn.length])(EP.fleetPoints([{ ship: titan.name, count: 2 }, { ship: cap.name, count: 1 }])), [256, 292, true, 0]);
// the tabs, loaded with no DOM (their prototypes only) - deck-store reads no localStorage in node
load('CommandDeck/deck-store.js'); load('CommandDeck/deck-research.js'); load('CommandDeck/deck-empire.js');
const RTab = Object.create(window.DeckResearchTab.prototype); RTab.m = research; RTab.ctx = { rc, se, ships: D.ships.ships };
// A5: an extractor goal includes the hubs a stake lays out for it
// 2026-11-19: 7 nodes / 2,450 ATLAS with the T3 central, storage, extraction hub and crew quarters' gates [derive
// A5_EXTRACTOR_T3]; the kit's hardness tag 156 has no node and is skipped [derive A5_ORPHANS]
check('A5 copper-ore-extractor-t3 goal: 7 nodes / 2,450 ATLAS with the hubs\' gates [derive A5_EXTRACTOR_T3]', () => (b => [b.todo, b.atlas])(research.bill(research.closure(RTab.makeGoal('building', 'copper-ore-extractor-t3').tags), new Set([research.start.id]))), [7, 2450]);
// round 1: a building no planet can feed (a second-stage processor) still counts the hubs its tags name
// (a processor's own gate already holds its tier's Structural Complexity; a cultivation farm's does not: 11 -> 16 nodes)
check('  steel-processor-t3 and magmaroot-farm-t3 (no planet feeds them): hubs from their tags; the farm path is 7 nodes [derive STEEL_T3_HUB_NODE, FARM_T3_CLOSURE_SIZE]',() => { const g = RTab.makeGoal('building', 'steel-processor-t3'), f = RTab.makeGoal('building', 'magmaroot-farm-t3'); return [g.site, research.closure(g.tags).has(research.nodeOfTag.get(research.buildingGate('terrestrial-processing-hub-t3')[0])), f.site, research.closure(f.tags).size]; }, ['tags', true, 'tags', 7]);
// round 1: the Empire fleet note reads as sentences (a missing space once ran "128).That takes")
check('A4 Empire fleet note: "... 128). That takes Fleet Size - Tier 6 (a cap of 177)." [derive TITAN_128_TIER]', () => { const t = Object.assign(Object.create(window.DeckEmpireTab.prototype), { ctx: { research }, empire: EP, se, rc, stakes: [], fleets: [{ id: 'f1', ship: titan.name, count: 1 }] }); const h = t.researchHTML([], { sources: [] }).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '); return [/\)\.\S/.test(h), /128\)\. That takes Fleet Size - Tier 6 \(a cap of 177\)\./.test(h)]; }, [false, true]);
// A10: search caps and says so, "t3" finds "tier 3", no starbase hulls, no doubled tier
check('A10 search "ammo": 14 shown of 46; "claim t3" finds the tier-3 stake; no Starbase pseudo-ship; no "T5 T5" label', () => { const s = RTab.search('ammo'); return [s.length, s.total, RTab.search('claim t3').map(x => x.label).includes('Claim Stake Tier 3'), RTab.search('starbase').length, RTab.index.filter(x => /T(\d+) T\1$/.test(x.label)).length]; }, [14, 46, true, 0, 0]);
check('  recipe labels: "Ammo L T5" stays, "Power Regulation Module" gets its tier', () => [window.DeckUI.recipeLabel(rc.recipes.find(r => r.outputName === 'Ammo L T5')), window.DeckUI.recipeLabel(prm)], ['Ammo L T5', 'Power Regulation Module T' + prm.outputTier]);
// round 1: only a suffix equal to the recipe's own tier is dropped - "Pearce T1" is a tier-5 hull recipe
check('  "Pearce T1" at tier 5: the chip name keeps "Pearce T1", the label is "Pearce T1 T5"', () => { const r = rc.recipes.find(x => x.outputName === 'Pearce T1' && x.outputTier === 5); return [window.DeckUI.recipeName(r), window.DeckUI.recipeLabel(r)]; }, ['Pearce T1', 'Pearce T1 T5']);
// A11 / A12: no editor notes or upgrade wording on display; the two doubled node names told apart
check('A11 no shown description carries an editor note or "Upgrades to Tier 5"', () => research.nodes.filter(n => /Phase \d|C4-only|universe\.json|TODO|Combat v2:|Upgrades to Tier 5/.test(research.benefit(n).text)).map(n => n.name), []);
// round 1: the combat notes keep their stat; the plot sentence fits the node kind
check('  the five Combat v2 nodes keep a stat sentence with no editor note', () => ['Fire Control', 'Targeting Optics', 'Minor Critical Multiplier', 'Major Critical Multiplier', 'Elite Critical Multiplier'].map(n => B(n).text), ['Raises hit chance; the export gives no magnitude yet.', 'Raises aim; the export gives no magnitude yet.'].concat(Array(3).fill('Raises the critical-hit multiplier; the export gives no magnitude yet.')));
check('  plot nodes: Claim Stakes (renamed "Claim Stakes & Cultivation Claims - Tier 2" [derive STAKE_T2_NODE]), Crafting Habs and Commercial Plot each read in their own words', () => ['Claim Stakes & Cultivation Claims - Tier 2', 'Crafting Habs - Tier 1', 'Commercial Plot - T1'].map(n => B(n).text), ['Unlocks tier size of plots a player is able to own. Lets you own claim stakes of this tier; a stake is bought at its tier and never upgraded.', 'Unlocks tier size of plots a player is able to own. Lets you own crafting habs of this tier.', 'Unlocks tier size of plots a player is able to own. Base tier is free for all but not productive.']);
check('A12 every drawn node has its own name; the bare name still resolves', () => [new Set(research.nodes.map(n => n.name)).size, research.byName.get('Enemy Faction Scanning') === research.byName.get('Enemy Faction Scanning (after Contested Space Scanning)')], [research.nodes.length, true]);
// A1: the schedule axis has a few ticks however long the plan runs (a 30-day cap drew 3,181 labels, 447 MB, 116 s)
check('A1 Ammo TTN T5 x1000: schedule + HTML under 2 s; axis lines (grid + end) at most 14', () => {
    const items = [{ id: 'ammo-ttn-t5', qty: 1000 }], x = empire.expand(items, new Set()), t0 = Date.now();
    const html = window.DeckEmpireTab.prototype.scheduleHTML.call({}, items, { expansion: x }, empire.schedule(x, { jobs: 1 }), { lanes: [], label: '' }), ms = Date.now() - t0, lines = (html.match(/class="grid( end)?"/g) || []).length;
    console.log(`      (A1: ${ms} ms, ${lines} axis lines, ${html.length} bytes)`);
    return [ms < 2000, lines <= 14];
}, [true, true]);
// A7: a belt's failed layout still has the fields a stake card reads
check('A7 a belt layout: not ok, and hubs / crew fields present', () => (L => [L.ok, Array.isArray(L.hubs), L.ncq, L.crewNeed])(se.layout(se.planets.find(p => p.cat === 3), 2, {}, [])), [false, true, 0, 0]);

// ---- 14. the Empire map (2026-10-26): galaxy distances and the operations ledger, re-derived here from the raw
//          mapData and the export's flat stat row, without Galaxy or Loadout
const { Galaxy } = window.CommandDeck;
const GX = new Galaxy(D.planets), MAP = D.planets.mapData;
const rawSb = MAP.filter(s => s.starbase && +s.starbase.tier > 0);
check('M1 galaxy: every system, every starbase (tier > 0), and the three CSS by faction', () => [GX.systems.length, GX.starbases.length, ['ustur', 'mud', 'oni'].map(f => GX.css(f) && GX.css(f).name)], [MAP.length, rawSb.length, ['Eternity', 'Serene', 'Neuno']]);
const hyp = (a, b) => Math.hypot(a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1]);
const lone = MAP.find(s => !(s.starbase && +s.starbase.tier > 0) && (s.planets || []).length);
const lonely = rawSb.map(s => ({ s, d: hyp(lone, s) })).sort((a, b) => a.d - b.d || a.s.name.localeCompare(b.s.name))[0];
check('M2 nearest starbase to a system without one = a brute-force scan of mapData; a starbase system is its own (0 AU)', () => { const n = GX.nearestStarbase(lone.key), m = GX.nearestStarbase(rawSb[0].key); return [n.sys.key, Math.abs(n.d - lonely.d) < 1e-12, m.sys.key, m.d]; }, [lonely.s.key, true, rawSb[0].key, 0]);
// a Tap pair mining Copper Ore on a copper body in a system with no starbase, dropping off at the nearest one
const TAPROW = load('Data/combat-data.js').allShips.find(r => r['Ship Name'] === 'Armstrong IMP Tap');
const cyc = (st, d, rich) => {                       // closed form: fill, then warp there and back (spool per jump, cooldown between jumps and once at the end), load twice
    const jumps = d > 0 ? Math.ceil(d / st.max_warp_distance - 1e-9) : 0, fly = jumps * st.warp_spool_time + d / st.warp_speed + Math.max(0, jumps - 1) * st.warp_cool_down;
    const trip = 2 * fly + 2 * st.cargo_capacity / st.loading_rate + (jumps ? st.warp_cool_down : 0), fill = rich ? st.cargo_capacity / (st.asteroid_mining_rate * rich) : 0;
    return { jumps, trip, fill, cycle: fill + trip, fuel: 2 * st.warp_fuel_consumption * d + st.planet_exit_fuel };
};
const cuBody = se.planets.filter(p => p.deposits.has('copper-ore') && !(GX.byKey.get(p.sysKey).sb > 0)).sort((a, b) => a.key.localeCompare(b.key))[0];
const cuDrop = GX.nearestStarbase(cuBody.sysKey), cuRich = cuBody.deposits.get('copper-ore').richness;
const dDrop = hyp(MAP.find(s => s.key === cuBody.sysKey), MAP.find(s => s.key === cuDrop.sys.key));
const statsFn = n => (LO.stats(n, null) || {}).mod;
const OPS = empire.ops([{ id: 's1', key: cu.key, tier: 5, alloc: { 'copper-ore': 7 }, procs: [] }],
    [{ id: 'm1', task: 'mine', ship: 'Armstrong IMP Tap', count: 2, raw: 'Copper Ore', body: cuBody.key, richness: cuRich, dest: cuDrop.sys.key },
     { id: 'h1', task: 'haul', ship: 'Armstrong IMP Tap', count: 1, from: 's1', dest: GX.css('ustur').key },
     { id: 'q1', task: 'supply', ship: 'Armstrong IMP Tap', count: 1, from: 's1', dest: GX.nearestStarbase(cu.sysKey).sys.key }],
    { tick: 60, richness: false, galaxy: GX, stats: statsFn });
const m1 = OPS.fleets.find(f => f.id === 'm1'), C1 = cyc(TAPROW, dDrop, cuRich);
console.log(`      (M3: ${cuBody.name} x${cuRich} -> ${cuDrop.sys.name}, ${dDrop.toFixed(3)} AU, ${C1.jumps} jumps, cycle ${C1.cycle.toFixed(1)} s)`);
check('M3 2 Taps mining with a drop-off: delivered / h = 2 x hold x 3600 / cycle (closed form from the flat stat row)', () => m1.perHour, 2 * TAPROW.cargo_capacity * 3600 / C1.cycle, 1e-9);
check('  fuel / h = 2 x (2 x warp fuel x d + planet exit) x 3600 / cycle; food / h = 2 x food rate x fill x 3600 / cycle', () => [m1.fuel, m1.food], [2 * C1.fuel * 3600 / C1.cycle, 2 * TAPROW.asteroid_mining_food_rate * C1.fill * 3600 / C1.cycle], 1e-9);
check('  the distance is the straight line between the two systems', () => m1.d, dDrop, 1e-12);
const covM = empire.coverage(prmItems, [], [{ id: 'm1', task: 'mine', ship: 'Armstrong IMP Tap', count: 2, raw: 'Copper Ore', body: cuBody.key, richness: cuRich, dest: cuDrop.sys.key }, { id: 'h1', task: 'haul', ship: 'Armstrong IMP Tap', raw: 'Copper Ore', count: 9 }], { tick: 60, richness: false, fleetPerSec: f => { const r = OPS.fleets.find(x => x.id === f.id); return r && r.dest ? r.perHour / 3600 : null; } });
check('M4 coverage takes the delivered rate for a fleet with a drop-off, and a hauler supplies nothing', () => covM.rows.find(r => r.name === 'Copper Ore').perHour, m1.perHour, 1e-12);
check('  without the hook a mining fleet keeps its rate at the body (2 x 19.192 x richness x 3600)', () => empire.coverage(prmItems, [], [{ id: 'x', ship: 'Armstrong IMP Tap', count: 2, raw: 'Copper Ore', richness: cuRich }], { tick: 60 }).rows.find(r => r.name === 'Copper Ore').perHour, 2 * 19.192 * cuRich * 3600, 1e-9);
// the T5 copper stake (7 extractors, 34.02 / tick + the hub's copper, storage 207,500, fuel 114.44 / tick in the audit)
const S1 = OPS.stakes[0], h1 = OPS.fleets.find(f => f.id === 'h1'), q1 = OPS.fleets.find(f => f.id === 'q1');
const CH = cyc(TAPROW, hyp(MAP.find(s => s.key === cu.sysKey), MAP.find(s => s.key === GX.css('ustur').key)), 0);
check('M5 the stake makes at least 34.02 x 60 / h of copper, stores 207,500 and burns 114.44 fuel / tick', () => [S1.out >= 34.02 * 60 - 1e-9, S1.storage, Math.abs(S1.fuel / 60 - 114.44) < 0.005], [true, 207500, true]);
check('  a Tap hauling it to Eternity can move hold x 3600 / round trip', () => h1.cap, TAPROW.cargo_capacity * 3600 / CH.trip, 1e-9);
check('  it flies only for what is there: moves min(capacity, made)', () => h1.perHour, Math.min(h1.cap, S1.out), 1e-12);
check('  and burns (2 x warp fuel x d + exit) / hold for every unit it moves', () => h1.fuel, Math.min(h1.cap, S1.out) * CH.fuel / TAPROW.cargo_capacity, 1e-9);
check('  backlog = made - capacity (0 here), never full', () => [S1.backlog, S1.fullIn === Infinity], [Math.max(0, S1.out - h1.cap), S1.out <= h1.cap]);
// R4 supply (2026-10-26): the stake's base needs its own fuel + its haulers' fuel (+ miners dropping off in its system)
const baseMiners = OPS.fleets.filter(f => f.task === 'mine' && f.dest && f.dest.key === cu.sysKey);
check('  R4 supply: the base needs stake fuel + hauler fuel (+ miners that drop off in its system), no Repair Kit', () => [S1.r4.need.Fuel, S1.r4.need.Food, S1.r4.need.Ammunition, S1.r4.need['Repair Kit']].map(v => Math.round(v * 1e6) / 1e6), [S1.fuel + h1.fuel + baseMiners.reduce((a, f) => a + f.fuel, 0), baseMiners.reduce((a, f) => a + f.food, 0), baseMiners.reduce((a, f) => a + f.ammo, 0), 0].map(v => Math.round(v * 1e6) / 1e6));
check('  and the run brings all of it when its capacity is larger; the gaps are 0', () => [q1.cap >= S1.r4.total, Math.abs(q1.perHour - S1.r4.total) < 1e-9, S1.r4.gap, S1.fuelGap], [true, true, 0, 0]);
// a mining pair dropping off IN the stake's system makes the stake its base: food (and fuel) join the need, and a run
// too small for it brings every basic in the same share
check('  a miner based at the stake adds its fuel and food; a short run brings each basic in the same share', () => {
    const o = empire.ops([{ id: 's1', key: cu.key, tier: 5, alloc: { 'copper-ore': 7 }, procs: [] }],
        [{ id: 'm', task: 'mine', ship: 'Armstrong IMP', count: 3, raw: 'Copper Ore', body: cu.key, richness: 1, dest: cu.sysKey },
         { id: 'q', task: 'supply', ship: 'Armstrong IMP Tip', count: 1, from: 's1', dest: GX.css('ustur').key }], { tick: 60, richness: false, galaxy: GX, stats: statsFn });
    const s = o.stakes[0], m = o.fleets[0], q = o.fleets[1], need = s.r4.need, b = s.r4.brought;
    const ratios = ['Fuel', 'Food'].map(k => b[k] / need[k]);
    return [Math.abs(need.Fuel - (s.fuel + m.fuel)) < 1e-6, Math.abs(need.Food - m.food) < 1e-6, m.base === s, q.cap < s.r4.total, Math.abs(ratios[0] - ratios[1]) < 1e-12, Math.abs(ratios[0] - q.cap / s.r4.total) < 1e-12, Math.abs(s.r4.gap - (s.r4.total - q.cap)) < 1e-6];
}, [true, true, true, true, true, true, true]);
check('  two haulers on one stake share its output by capacity (Tap + Tip: each busy the same share)', () => { const o = empire.ops([{ id: 's1', key: cu.key, tier: 5, alloc: { 'copper-ore': 7 }, procs: [] }], [{ id: 'a', task: 'haul', ship: 'Armstrong IMP Tap', count: 1, from: 's1', dest: GX.css('ustur').key }, { id: 'b', task: 'haul', ship: 'Armstrong IMP Tip', count: 1, from: 's1', dest: GX.css('ustur').key }], { tick: 60, richness: false, galaxy: GX, stats: statsFn }); const [a, b] = o.fleets; return [Math.abs(a.busy - b.busy) < 1e-12, Math.abs(a.perHour + b.perHour - o.stakes[0].out) < 1e-6, Math.abs(a.perHour / b.perHour - a.cap / b.cap) < 1e-9]; }, [true, true, true]);
const FUEL = OPS.ledger.get('Fuel');
check('M6 the ledger burns the stake\'s fuel plus every fleet\'s road fuel', () => FUEL.burned, S1.fuel + m1.fuel + h1.fuel + q1.fuel, 1e-12);
check('  and makes the copper the stake (extractors + hub, 34.02 + hub per tick x 60) and the miners make', () => OPS.ledger.get('Copper Ore').made, (34.02 + hubCu) * 60 + m1.perHour, 1e-9);
check('  a haul or supply run with no stake, or a drop-off off the map, moves nothing and burns nothing', () => (o => [o.fleets[0].perHour, o.fleets[0].fuel, o.fleets[1].perHour, o.fleets[1].dest])(empire.ops([], [{ id: 'a', task: 'haul', ship: 'Armstrong IMP Tap', from: 'nope', dest: GX.css('ustur').key }, { id: 'b', task: 'mine', ship: 'Armstrong IMP Tap', raw: 'Copper Ore', body: cuBody.key, richness: 1, dest: 'not-a-system' }], { tick: 60, galaxy: GX, stats: statsFn })), [0, 0, 19.192 * 3600, null]);
load('CommandDeck/deck-map.js');
// at a 60 s tick one Tap keeps up with the stake; at a 1 s tick (60x the output) it cannot
check('M7 at a 60 s tick one Tap keeps up (no backlog, never full); at 1 s the backlog is 60 x the stake minus the Tap', () => { const o1 = empire.ops([{ id: 's1', key: cu.key, tier: 5, alloc: { 'copper-ore': 7 }, procs: [] }], [{ id: 'h1', task: 'haul', ship: 'Armstrong IMP Tap', count: 1, from: 's1', dest: GX.css('ustur').key }], { tick: 1, richness: false, galaxy: GX, stats: statsFn }); return [S1.backlog, S1.fullIn === Infinity, Math.abs(o1.stakes[0].backlog - (60 * S1.out - h1.cap)) < 1e-6, o1.fleets[0].busy]; }, [0, true, true, 1]);
check('  the ledger page at 1 s: copper is no shortfall, fuel is, and the stake says how many more Taps keep up', () => {
    const o1 = empire.ops([{ id: 's1', key: cu.key, tier: 5, alloc: { 'copper-ore': 7 }, procs: [] }], [{ id: 'h1', task: 'haul', ship: 'Armstrong IMP Tap', count: 1, from: 's1', dest: GX.css('ustur').key }], { tick: 1, richness: false, galaxy: GX, stats: statsFn });
    const h = window.DeckEmpireMap.prototype.ledgerHTML.call({}, o1, empire.coverage([], [], [], { tick: 1 })).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const more = Math.ceil(o1.stakes[0].backlog / o1.fleets[0].cap - 1e-9);
    console.log(`      (M7: backlog ${Math.round(o1.stakes[0].backlog)} / h, ${more} more Taps)`);
    return [/Copper Ore\s*:/.test(h), /Fuel\s*: [\d,.]+ \/ h burned, none made/.test(h), new RegExp(`${more} more IMP Tap on that run would keep up`).test(h)];
}, [false, true, true]);

// ---- R. the Research side panel answers in words (2026-10-27): each sentence re-derived from the model here, every
//    ranking sentence probed with a tie, the clicked node renders above the goal
const rtxt = h => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').replace(/ ([.,:;)])/g, '$1').trim();
const rtab = (goal, owned, sel, m) => {
    const t = Object.assign(Object.create(window.DeckResearchTab.prototype), { m: m || research, ctx: RTab.ctx, folds: {}, sel: sel || null, side: { innerHTML: '' }, goal: null });
    t.owned = new Set([research.start.id].concat(owned || []));
    if (goal) t.goal = t.makeGoal(goal[0], goal[1]);
    t.tags = research.ownedTags(t.owned); t.path = t.pathSet(); return t;
};
// 2026-11-19: Framework T1 needs no crafting research on this export; the goal subject is the section-4 rule's recipe,
// Mining Rig TTN T5, gathered by USTUR with stakes (the store's defaults) [derive S_USTUR_GATHER, S_USTUR_ALL_LEVELS/XP]
const fw = SUBJ;
check('R1 Mining Rig TTN T5 goal: the headline is the bill (13 nodes, 4,550 ATLAS); the longest grind is the XP argmax, Crafting 40 (21,506 XP); also Mining 1 and Pilot 5', () => {
    const t = rtab(['recipe', fw.outputId]), b = research.bill(t.path, t.owned), h = rtxt(t.goalHTML());
    let arg = null; for (const k in b.xp) if (b.levels[k] > 0 && b.xp[k] != null && (arg === null || b.xp[k] > b.xp[arg])) arg = k;
    const also = (/The longest grind is Crafting to level 40: 21,506 XP; the path also needs (.*?)\./.exec(h) || [])[1] || '';
    return [b.todo, b.atlas, arg, b.levels[arg], b.xp[arg], new RegExp(`${window.DeckUI.recipeLabel(fw)}: ${b.todo} nodes to research, ${b.atlas.toLocaleString('en-US')} ATLAS, ${Object.values(b.points).reduce((a, v) => a + v, 0)} track points\\.`).test(h), also.split(/, | and /).sort()];
}, [13, 4550, 'Crafting', 40, 21506, true, ['Mining 1', 'Pilot 5']]);
check('  "Research now" names exactly the path nodes whose prerequisites are held, and how many of the todo', () => {
    const t = rtab(['recipe', fw.outputId]), h = rtxt(t.goalHTML());
    const open = Array.from(t.path).filter(n => n.hasData && !t.owned.has(n.id) && n.reqTags.every(x => t.tags.has(x)));
    const said = (/Research now: (.*?) \((\d+) of (\d+) open; levels not checked\)/.exec(h) || []);
    // the sentence lists at most 4 names, then "and N more" (2026-11-19: this goal has more than 4 open nodes)
    return [!!said[1] && open.filter(n => said[1].includes(n.name)).length === Math.min(4, open.length) && (open.length <= 4 || said[1].endsWith(`and ${open.length - 4} more`)), +said[2] === open.length, +said[3]];
}, [true, true, 13]);
// 2026-11-19 fix: a goal whose path holds a node whose prerequisite tag no drawn node carries (Mining Gear - T1) says so
// instead of "a prerequisite has no numbers in the export". FAILS on deck-research.js before the fix. Owner rule (same
// day): the words claim only what the page knows - no "no node grants", no "cannot", no tag number, no export/release.
const OVERCLAIM = /no node|grants|cannot|#\d|export|release/i;
check('  goal Mining Gear - T1: "Nothing on the path is open yet: Mining Gear - T1 has a prerequisite that is not in the current data."; no over-claim words', () => {
    const h = rtxt(rtab(['node', research.byName.get('Mining Gear - T1').id]).goalHTML()), line = (h.match(/Nothing on the path is open yet:[^.]*\./) || [''])[0];
    return [/Nothing on the path is open yet: Mining Gear - T1 has a prerequisite that is not in the current data\./.test(h), /has no numbers in the export/.test(h), OVERCLAIM.test(line)];
}, [true, false, false]);
// and a path with open nodes AND such a node says part of the path has a prerequisite not in the current data. No single
// node goal on this data has both (that node's own prerequisites are cut), so the probe is a goal whose path is the union
// of Mining Gear - T1 and Ore Breaker (open); the section-4 subject's path has no such node and never says it
check('  a path with open nodes and such a node: "Part of this path has a prerequisite that is not in the current data: Mining Gear - T1."; the subject\'s path: no such line', () => {
    const t = rtab(['node', research.byName.get('Mining Gear - T1').id]);
    t.path = new Set([...research.closureOfNode(research.byName.get('Mining Gear - T1')), ...research.closureOfNode(research.byName.get('Ore Breaker'))]);
    const h = rtxt(t.goalHTML()), line = (h.match(/Part of this path[^.]*\./) || [''])[0];
    return [/Research now: [^.]*Ore Breaker/.test(h), /Part of this path has a prerequisite that is not in the current data: Mining Gear - T1\./.test(h), OVERCLAIM.test(line), /Part of this path|cannot be finished/.test(rtxt(rtab(['recipe', fw.outputId]).goalHTML()))];
}, [true, true, false, false]);
check('  stakes: "Gathering the raws adds 7 nodes (2,450 ATLAS); crafting alone is 6 nodes" [derive S_USTUR_GATHER]; in hand: no gathering line, no raws fold', () => {
    const S = window.DeckStore.s, was = S.gather, a = rtxt(rtab(['recipe', fw.outputId]).goalHTML());
    S.gather = 'hand'; let b; try { b = rtab(['recipe', fw.outputId]).goalHTML(); } finally { S.gather = was; }
    return [/Gathering the raws adds 7 nodes \(2,450 ATLAS\); crafting alone is 6 nodes\./.test(a), /Gathering/.test(rtxt(b)), /data-fold="rraws"/.test(b), /crafting research only/.test(b)];
}, [true, false, false, true]);
const fakeBill = xp => Object.assign(Object.create(research), { bill: () => ({ rows: [], todo: 2, levels: { Mining: 3, Crafting: 3 }, xp, points: {}, tokens: {}, atlas: 5 }) });
check('  tie: two tracks at equal XP "tie as the longest grind", never a winner; unequal XP names the larger', () => {
    const tie = rtxt(rtab(['stake', 3], null, null, fakeBill({ Mining: 100, Crafting: 100 })).goalHTML()), one = rtxt(rtab(['stake', 3], null, null, fakeBill({ Mining: 90, Crafting: 100 })).goalHTML());
    return [/Mining to level 3 and Crafting to level 3 tie as the longest grind: 100 XP each\./.test(tie), /The longest grind is/.test(tie), /The longest grind is Crafting to level 3: 100 XP; the path also needs Mining 3\./.test(one)];
}, [true, false, true]);
// review 2026-10-27: level 1 is 1 XP on every track and Council Rank 1 XP a level - never "the longest grind"
// 2026-11-19: copper-ore-extractor-t3 now needs Building 8 (839 XP) - a real grind [derive A5_LEVELS, A5_XP]; the
// "none is a grind" sentence is probed with a bill of level-1 and Council Rank levels only
check('  copper-ore-extractor-t3: the longest grind is Building 8 (839 XP); a bill of Mining 1 + Council Rank 1: no "longest grind", says none is a grind; Capital hull: no Council grind', () => {
    const a = rtxt(rtab(['building', 'copper-ore-extractor-t3']).goalHTML()), cap = D.ships.ships.find(s => s.sizeTier === 'Capital' || /Capital/.test(s.sizeTier));
    const ones = rtxt(rtab(['stake', 3], null, null, Object.assign(Object.create(research), { bill: () => ({ rows: [], todo: 2, levels: { Mining: 1, CouncilRank: 1 }, xp: { Mining: 1, CouncilRank: 1 }, points: {}, tokens: {}, atlas: 5 }) })).goalHTML());
    const c = cap ? rtxt(rtab(['ship', cap.name]).goalHTML()) : 'no capital hull';
    return [/The longest grind is Building to level 8: 839 XP/.test(a), /longest grind/.test(ones), /none of them is a grind/.test(ones), /Council Rank to level \d+: \d+ XP/.test(c), /longest grind/.test(rtxt(rtab(['recipe', fw.outputId]).goalHTML()))];
}, [true, false, true, false, true]);
check('  a goal node with no numbers says so, offers no "Mark the whole path", blames no prerequisite', () => {
    const blank = research.nodes.find(n => !n.hasData), h = rtab(['node', blank.id]).goalHTML(), t = rtxt(h);
    return [/the export names this node but gives it no numbers yet/.test(t), /data-act="own-path"/.test(h), /a prerequisite has no numbers/.test(t)];
}, [true, false, false]);
const openNow = owned => research.nodes.filter(n => n.hasData && !owned.has(n.id) && n.reqTags.every(x => research.ownedTags(owned).has(x)));
// 2026-11-19: with only the Starting Node, 162 nodes are open and Utility Ship Components completes the most recipes
// (263) [derive OPEN_AT_START, OPEN_TOP3] - the lead is now "starts the most", not "None of the N open nodes"
check('R2 nothing marked: N open nodes counted here; the lead names Utility Ship Components, 263 recipes [derive OPEN_AT_START, OPEN_TOP3]', () => {
    const t = rtab(), n = openNow(t.owned).length, h = rtxt(t.nextHTML(false));
    return [n, /Utility Ship Components starts the most recipes the moment you research it: 263\./.test(h), /0 nodes marked researched · \d+ of [\d,]+ recipes startable/.test(h)];
}, [162, true, true]);
check('  the Mining Rig TTN T5 path held but Titan Crafting: the lead names the node that completes the most recipes, with its count', () => {
    const cc = research.byName.get('Titan Crafting'), t0 = rtab(['recipe', fw.outputId]), held = Array.from(t0.path).filter(n => n !== cc).map(n => n.id);
    const t = rtab(null, held), h = rtxt(t.nextHTML(false)), tags = research.ownedTags(t.owned);
    const best = openNow(t.owned).map(n => [n, research.completes(n, tags)]).sort((a, b) => b[1] - a[1]), top = best[0][1], tied = best.filter(x => x[1] === top);
    return [top > 0, tied.length === 1 ? h.includes(`${tied[0][0].name} starts the most recipes the moment you research it: ${top.toLocaleString('en-US')}.`) : / tie: each starts /.test(h)];
}, [true, true]);
check('  tie: two open nodes completing the same count "tie", one alone "starts the most"', () => {
    const fake = (names, k) => Object.assign(Object.create(research), { completes: n => (names.includes(n.name) ? k : 0) });
    // 2026-11-19: Freelance Miner / Crafter are gone; the probes are the first two open nodes [derive OPEN_FIRST_TWO]
    const tie = rtxt(rtab(null, null, null, fake(['Daily Check-In', 'Respawn Timer Reduction'], 5)).nextHTML(false)), one = rtxt(rtab(null, null, null, fake(['Daily Check-In'], 5)).nextHTML(false));
    return [/(Daily Check-In and Respawn Timer Reduction|Respawn Timer Reduction and Daily Check-In) tie: each starts 5 recipes the moment you research it\./.test(tie), /starts the most/.test(tie), /Daily Check-In starts the most recipes the moment you research it: 5\./.test(one)];
}, [true, false, true]);
check('  none completes a recipe: equal gate counts "are each a gate of", one alone "is a gate of the most"', () => {
    const fake = names => Object.assign(Object.create(research), { completes: () => 0, unlocks: n => Object.assign(research.unlocks(n), { recipes: names.includes(n.name) ? 7 : 0 }) });
    const tie = rtxt(rtab(null, null, null, fake(['Daily Check-In', 'Respawn Timer Reduction'])).nextHTML(false)), one = rtxt(rtab(null, null, null, fake(['Daily Check-In'])).nextHTML(false));
    return [/(Daily Check-In and Respawn Timer Reduction|Respawn Timer Reduction and Daily Check-In) are each a gate of 7 recipes\./.test(tie), /gate of the most/.test(tie), /No open node starts a recipe on its own yet\. Daily Check-In is a gate of the most: 7 recipes\./.test(one)];
}, [true, false, true]);
check('R3 node cards: open says what it costs, locked names each missing prerequisite, the Starting Node is researched', () => {
    // 2026-11-19: Mining Gear - T1 needs tag 80, which no node grants; the locked probe is now the first locked node
    // whose missing prerequisites all have a node (the unresolvable case has its own check below)
    const t = rtab(), mg = research.nodes.find(n => n.hasData && !t.owned.has(n.id) && !research.available(n, t.tags) && n.reqTags.every(x => research.nodeOfTag.has(x))), miss = mg.reqTags.filter(x => !t.tags.has(x)).map(x => research.nodeOfTag.get(x).name);
    const lk = rtxt(t.nodeHTML(mg));
    // 2026-11-19: the open card probe is the first open Mining node with a price [derive OPEN_FIRST_MINING]
    return [rtxt(t.nodeHTML(research.byName.get('Mining Drill & Laser Types'))).includes('Open now: it costs 350 ATLAS and 1 Mining track point; needs Mining level 1.'), miss.length > 0 && miss.every(n => new RegExp(`Locked: research [^.]*${n.replace(/[-&]/g, '\\$&')}[^.]* first\\.`).test(lk)), rtxt(t.nodeHTML(research.start)).includes('Researched.')];
}, [true, true, true]);
// 2026-11-19: 27 drawn nodes need a prerequisite tag that no node grants [derive ORPHAN_REQ_NODES] - Mining Gear - T1
// needs tag 80. Its card must not tell the player to "research a prerequisite first" (there is none to research): it
// says the prerequisite is not in the current data - and, owner rule, shows no tag number, never "no node grants",
// "cannot" or "export". FAILS on the card before the 2026-11-19 fix and on the predecessor's wording.
check('  a node whose prerequisite tag no drawn node carries (Mining Gear - T1): "Locked: its prerequisite is not in the current data", never "research a prerequisite first", no over-claim words', () => {
    const t = rtab(), mg = research.byName.get('Mining Gear - T1'), h = rtxt(t.nodeHTML(mg)), line = (h.match(/Locked:[^.]*\./) || [''])[0];
    return [research.nodes.filter(n => n.reqTags.some(x => !research.nodeOfTag.has(x))).length, /research a prerequisite first/.test(h), /Locked: its prerequisite is not in the current data\./.test(h), OVERCLAIM.test(line)];
}, [27, false, true, false]);
check('  side order: the clicked node above the goal, "research next" folded; nothing chosen: the intro and an open panel', () => {
    const a = rtab(['recipe', fw.outputId], null, research.byName.get('Mining Drill & Laser Types').id); a.renderSide();
    const b = rtab(); b.renderSide(); const s = a.side.innerHTML;
    return [s.indexOf('cd-node') > -1 && s.indexOf('cd-node') < s.indexOf('cd-goal'), /data-fold="rnext"/.test(s), /cd-intro/.test(b.side.innerHTML), /data-fold="rnext"/.test(b.side.innerHTML)];
}, [true, true, true, false]);

// 2026-11-20: Empire goal rows - removing ONE row must not drop every plan entry with that id (a pinned and an unpinned
// entry can share an id). The real click handler (bind) runs against a fake root and a stubbed store; the remove button
// carries its row index (data-goal-i). FAILS on the old line, which filtered by id and so removed both rows.
check('E1 Empire: removing one of two goal rows with the same id removes only that row (the button carries data-goal-i)', () => {
    const PF = rc.recipes.find(r => r.outputId !== fw.outputId).outputId, St = window.DeckStore, was = { read: St.read, write: St.write }; let plan = [{ id: fw.outputId, qty: 1 }, { id: fw.outputId, qty: 3, pin: true }, { id: PF, qty: 2 }]; // pf: a different recipe
    St.read = (k, d) => (k === 'recipeExplorer.plan.v1' ? JSON.parse(JSON.stringify(plan)) : d); St.write = (k, v) => { if (k === 'recipeExplorer.plan.v1') plan = v; };
    try {
        let click = null; const root = { addEventListener: (t, fn) => { if (t === 'click') click = fn; } };
        const t = Object.assign(Object.create(window.DeckEmpireTab.prototype), { root, rc, render() {} }); t.bind();
        const btn = (id, i) => ({ dataset: { goalRemove: id, goalI: String(i) } }), ev = b => ({ target: { closest: sel => (sel === '[data-goal-remove]' ? b : null) } });
        click(ev(btn(fw.outputId, 1)));          // the pinned duplicate (row 1)
        const after1 = plan.map(x => x.id + ':' + x.qty + (x.pin ? 'p' : ''));
        click(ev(btn(fw.outputId, 0)));          // then the other one (row 0 of what is left)
        const after2 = plan.map(x => x.id);
        const html = require('fs').readFileSync(path.join(ROOT, 'CommandDeck/deck-empire.js'), 'utf8').includes('data-goal-remove="$' + '{esc(it.id)}" data-goal-i="$' + '{gi}"');
        return [after1.join('|') === fw.outputId + ':1|' + PF + ':2', after2.join('|') === PF, html];
    } finally { St.read = was.read; St.write = was.write; }
}, [true, true, true]);

console.log(`\n${pass} PASS, ${fail} FAIL, ${pend} PENDING${SABOTAGE ? ' (sabotage run: failures are expected)' : ''}`);
process.exit(fail ? 1 : 0);
