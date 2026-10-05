#!/usr/bin/env node
// command-deck-check.js - Node check of the Command Deck model (CommandDeck/deck-model.js) against figures that
// were derived independently, by other code, in the SAGE research reports:
//   MINING-VS-STAKES-2026-10-04 (231-check second pass)  - full-stake layouts, ship rates, break-even ticks, fair prices
//   TOP10-STAKES-START-2026-09-28 rev 3a (830 checks)     - research path of Power Regulation Module
// plus internal identities (the bill expansion equals the Recipe Explorer planner's; every gate tag has a node).
// The expected values below belong to the 2026-09-11 export: after a data refresh, re-derive them, do not edit
// them until the check passes.
//
//   node Test/command-deck-check.js            exit 0 = all PASS
//   node Test/command-deck-check.js --sabotage corrupts three model inputs and expects the checks that read them to FAIL
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
global.window = global;
const load = f => require(path.join(ROOT, f));
const D = {
    buildings: load('Data/buildings-data.js'), ships: load('Data/ships-data.js'), recipes: load('Data/recipes-data.js'),
    resources: load('Data/resources-data.js'), planets: load('Data/planet-data.js'), research: load('Data/research-data.js')
};
load('ResourcesExplorer/resource-model.js'); load('RecipeExplorer/recipe-model.js'); load('CommandDeck/deck-model.js');
const SABOTAGE = process.argv.includes('--sabotage');
if (SABOTAGE) {
    // 1: one T5 extractor rate; 2: one level threshold. Exactly the checks that read them must fail.
    D.buildings.buildings.find(b => b.id === 'copper-ore-extractor-t5').resourceExtractionRate['copper-ore'] = 48.6;
    D.research.thresholds.crafting[14] += 1;
    // 3: USTUR's five low-risk regions become medium risk (the zone checks must notice). One region alone is not
    //    enough: flipping only Eternity changed no result, every raw it holds is in another safe region too.
    D.planets.regionDefinitions.forEach(g => { if (g.risk_zone && g.risk_zone.LowRiskZone === 'Ustur') g.risk_zone = 'MediumRiskZone'; });
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
    const ok = typeof want === 'number' ? near(got, want, tol) : JSON.stringify(got) === JSON.stringify(want);
    if (ok) pass++; else fail++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: ${typeof got === 'number' ? got : JSON.stringify(got)}${ok ? '' : '  (expected ' + JSON.stringify(want) + ')'}`);
}

// ---- 1. full stake per tier, Copper Ore (MINING-VS-STAKES numbers.json "tiers")
const TIERS = {
    1: { k: 6, perTick: 0.12, storage: 3500 }, 2: { k: 4, perTick: 0.6, storage: 9500 }, 3: { k: 4, perTick: 2.56, storage: 25500 },
    4: { k: 5, perTick: 9.75, storage: 71500 }, 5: { k: 7, perTick: 34.02, storage: 207500, ncq: 11, npp: 1, used: 14000 }
};
const full = {};
Object.entries(TIERS).forEach(([t, w]) => {
    const f = full[t] = se.fullStake(+t, 'copper-ore');
    check(`T${t} full stake: extractors`, f.k, w.k);
    check(`T${t} full stake: per tick`, f.perTick, w.perTick, 1e-9);
    check(`T${t} full stake: storage`, f.storage, w.storage);
    if (w.ncq != null) { check(`T${t} full stake: crew quarters`, f.ncq, w.ncq); check(`T${t} full stake: power plants`, f.npp, w.npp); check(`T${t} full stake: slots used`, f.used, w.used); }
});
check('stake slots per tier', [1, 2, 3, 4, 5].map(t => se.slots[t]), [65, 487, 2049, 6251, 15553]);
// the layout does not depend on the planet type
const anyPlanet = cat => se.planets.find(p => p.cat === cat && p.deposits.has('copper-ore'));
[0, 1, 2, 4, 5, 6, 7].forEach(cat => {
    const p = anyPlanet(cat); if (!p) return;
    let k = 0; for (let n = 1; n < 50; n++) { if (!se.layout(p, 5, { 'copper-ore': n }, []).ok) break; k = n; }
    check(`T5 extractors that fit on a ${p.catName} planet`, k, 7);
});

// ---- 2. ships (numbers.json "ships") and break-even ticks
const SHIPS = { 'Armstrong IMP': 183.477, 'Armstrong IMP Tap': 19.192, 'Armstrong IMP Tip': 6.207 };
Object.entries(SHIPS).forEach(([n, r]) => check(`${n} mining rate per second`, empire.shipByName.get(n).rate, r));
check('hulls with a mining rate', empire.miners.length, 61);
check('break-even tick, T5 stake vs one Tap (s)', Calc.breakEvenTick(full[5].perTick, SHIPS['Armstrong IMP Tap']), 34.02 / 19.192, 1e-9);
check('break-even tick, T1 stake vs one IMP (s)', Calc.breakEvenTick(full[1].perTick, SHIPS['Armstrong IMP']), 0.0006540329305580536, 1e-9);
check('break-even tick, T1 stake vs one Tap (s)', Calc.breakEvenTick(full[1].perTick, SHIPS['Armstrong IMP Tap']), 0.006252605252188411, 1e-9);

// ---- 3. prices (numbers.json "usd"): asks quoted 2026-10-04 - an input, used here only to check the arithmetic
const ASK = { ship: { 'Armstrong IMP Tap': 160, 'Armstrong IMP': 2500 }, stake: { 5: 1925, 4: 415, 3: 176 } };
const USD = {
    be: { 3: { 'Armstrong IMP': 0.1981917971388041, 'Armstrong IMP Tap': 0.1212626473151692 }, 4: { 'Armstrong IMP': 0.3201215398062762, 'Armstrong IMP Tap': 0.195864742839637 }, 5: { 'Armstrong IMP': 0.24080303352364701, 'Armstrong IMP Tap': 0.1473341164879306 } },
    fair1s: { 3: { 'Armstrong IMP': 34.88175629642952, 'Armstrong IMP Tap': 21.34222592746978 }, 4: { 'Armstrong IMP': 132.85043901960464, 'Armstrong IMP Tap': 81.28386827844935 }, 5: { 'Armstrong IMP': 463.5458395330205, 'Armstrong IMP Tap': 283.6181742392664 } }
};
[3, 4, 5].forEach(t => Object.keys(ASK.ship).forEach(s => {
    check(`break-even tick per dollar, T${t} vs ${s} (s)`, Calc.breakEvenTickPerDollar(full[t].perTick, ASK.stake[t], SHIPS[s], ASK.ship[s]), USD.be[t][s], 1e-9);
    check(`fair price at a 1 s tick, T${t} vs ${s} ($)`, Calc.fairPrice(full[t].perTick, 1, SHIPS[s], ASK.ship[s]), USD.fair1s[t][s], 1e-9);
}));
check('fair price at the long inferred tick, T5 vs Tap ($)', Calc.fairPrice(full[5].perTick, 297.4741590361446, SHIPS['Armstrong IMP Tap'], 160), 0.9534212153359021, 1e-9);

// ---- 4. research (TOP10 numbers.json "research": Power Regulation Module, chain from raws)
const prm = rc.recipes.find(r => r.outputName === 'Power Regulation Module');
const prmSet = research.closure(research.chainGate(prm));
check('Power Regulation Module: nodes on the path', Array.from(prmSet).map(n => n.name).sort(), ['Advanced Recipe Unlock', 'Complex Crafting', 'Freelance Crafter', 'Starting Node']);
const prmBill = research.bill(prmSet, new Set());
check('Power Regulation Module: Crafting level', prmBill.levels.Crafting, 15);
check('Power Regulation Module: Crafting XP', prmBill.xp.Crafting, 2180);
check('Crafting XP for level 22 / 30', [research.xpFor('Crafting', 22), research.xpFor('Crafting', 30)], [4539, 9358]);
check('ATLAS per crafting node', research.byName.get('Complex Crafting').atlas / window.CommandDeck.ATLAS_DECIMALS, 350);
check('recipes in the gate map / gated', [research.recipeCount, research.gatedRecipes], [5251, 3630]);
check('gated buildings', research.gatedBuildings, 1501);
check('stake tier 5 gate', research.closure(research.stakeGate(5)).has(research.byName.get('Claim Stakes - Tier 5')), true);
check('Capital ship size node', research.shipSizeNode('Capital').name, 'Capital Ships');
check('Capital ships need Council Rank level', research.shipSizeNode('Capital').level.CouncilRank, 4);
// every tag a gate names is granted by a node that is drawn
const gateTags = new Set(); ['recipes', 'buildings', 'claimStakes', 'craftingHabs'].forEach(k => Object.values(research.gate[k]).forEach(tags => tags.forEach(t => gateTags.add(t))));
check('gate tags with no node', Array.from(gateTags).filter(t => !research.nodeOfTag.has(t)), []);
check('nodes drawn / left out (no track, no numbers)', [research.nodes.length, research.dropped.length], [282, 12]);
check('nodes with no row in the layout', research.nodes.filter(n => n.y == null).length, 0);
const cells = new Set(research.nodes.map(n => n.depth + '|' + n.y.toFixed(3)));
check('layout: two nodes on one cell', research.nodes.length - cells.size, 0);
// holding nothing but the Starting Node: only the ungated recipes
check('craftable with only the Starting Node', research.craftable(new Set([0])), 5251 - 3630);
check('craftable with every node', research.craftable(new Set(research.nodeOfTag.keys())), 5251);

// ---- 5. the bill expansion equals the Recipe Explorer planner's raw bill
['Power Regulation Module', 'Thermal Management System', 'Utility Controller'].forEach(name => {
    const r = rc.recipes.find(x => x.outputName === name); const items = [{ id: r.outputId, qty: 7 }];
    const a = empire.expand(items, new Set()), b = rc.plan(items);
    const A = Array.from(a.leaves.entries()).sort(), B = b.raws.map(x => [x.name, x.qty]).sort();
    check(`${name} x7: raw bill = Recipe Explorer's (${B.length} raws)`, JSON.stringify(A) === JSON.stringify(B), true);
    check(`${name} x7: crafts = Recipe Explorer's`, a.craftCount, b.totals.crafts);
});

// ---- 6. one stake, by hand: T5 on a planet with Copper Ore - 7 extractors, then with the Copper processor
const cu = se.planets.find(p => p.stakeable && p.deposits.has('copper-ore') && p.deposits.get('copper-ore').richness === 1 && se.extractorFor(p, 'copper-ore', 5));
const plain = se.production(cu, 5, { 'copper-ore': 7 }, [], { richness: false });
const hubCu = (plain.passive.get('copper-ore') || 0);
check('T5 x7 Copper Ore: extracted per tick', plain.extracted.get('copper-ore'), 34.02, 1e-9);
check('T5 x7 Copper Ore: net = extractors + hub passive', plain.net.get('copper-ore'), 34.02 + hubCu, 1e-9);
const withProc = se.production(cu, 5, { 'copper-ore': 6 }, ['copper-processor-t5'], { richness: false });
check('T5 x6 + Copper processor: layout fits', withProc.layout.ok, true);
check('T5 x6 + Copper processor: processor fed at its full 16 per tick', withProc.procs[0].fed, 1);
check('T5 x6 + Copper processor: Copper per tick', withProc.net.get('copper'), 16, 1e-9);
check('T5 x6 + Copper processor: ore left per tick', withProc.net.get('copper-ore'), 6 * 4.86 + hubCu - 16, 1e-9);
check('a belt holds no stake', se.layout(se.planets.find(p => p.cat === 3), 1, {}, []).ok, false);
// hub passive extraction: only raws the planet has a deposit of (owner rule 2026-10-03)
const hub = plain.layout.central;
check('hub passive raws are all deposits of the planet', Array.from(plain.passive.keys()).every(k => cu.deposits.has(k)), true);
check('hub lists more raws than this planet holds', Object.keys(hub.resourceExtractionRate).length > plain.passive.size, true);

// ---- 7. coverage: 1 stake + 1 Tap against a plan, by hand
const prmItems = [{ id: prm.outputId, qty: 100 }];
const cov = empire.coverage(prmItems, [{ id: 's1', key: cu.key, tier: 5, alloc: { 'copper-ore': 7 }, procs: [] }], [{ id: 'f1', ship: 'Armstrong IMP Tap', count: 2, raw: 'Copper Ore', richness: 1 }], { tick: 60, richness: false });
const cuRow = cov.rows.find(r => r.name === 'Copper Ore');
check('coverage: Copper Ore supply per hour = stake/tick x 60 + 2 Taps x 3600', cuRow.perHour, (34.02 + hubCu) * 60 + 2 * 19.192 * 3600, 1e-9);
check('coverage: Copper Ore hours = need / supply', cuRow.hours, cuRow.need / cuRow.perHour, 1e-12);
check('measured tick: 4.86/tick at richness 1, 291.6 units in an hour -> 60 s', Calc.measuredTick(4.86, 1, 291.6), 60, 1e-9);

// ---- 8. gathering a recipe's raws: zones, extractor gates, faction locks - re-derived here from the raw bundles
// (regions, planets, the gate map, the nodes) with no call into the model's zone or route code
const RD = D.research, regionOf = new Map(D.planets.regionDefinitions.map(g => [g.id, g]));
const slugOf = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const zoneOfSystem = (s, fac) => { const z = regionOf.get(s.regionId).risk_zone; return typeof z === 'string' ? 'medium' : (z.LowRiskZone.toLowerCase() === fac ? 'own' : 'enemy'); };
const nodeByTag = new Map(); RD.nodes.forEach(n => ((n.character_value_changes || {}).research_tags || []).forEach(t => nodeByTag.set(t, n)));
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
        if (route === 'stake') { RD.gates.buildings[kit.id].forEach(t => tags.add(t)); RD.gates.claimStakes['claim-stake-tier-1'].forEach(t => tags.add(t)); }
        if (z === 'medium') tags.add(135);                  // Medium Risk Building: the cheapest of the two nodes that grant MediumRiskZone
        if (z === 'enemy') tags.add(125);                   // Enemy Faction Extraction: the Mining-track grant
    });
    return { nodes: closeNames(tags), routes };
};
const viaModel = (recipeName, fac, mode) => {
    const r = rc.recipes.find(x => x.outputName === recipeName), g = research.gather(r, fac, mode, se), all = new Set(research.chainGate(r)); g.tags.forEach(t => all.add(t));
    const routes = {}; g.rows.forEach(x => { routes[x.res.name] = x.route + '/' + x.cls; });
    return { nodes: Array.from(research.closure(all)).map(n => n.name).sort(), routes, bill: research.bill(research.closure(all), new Set([research.start.id])) };
};
[['Power Regulation Module', 'ustur'], ['Thermal Management System', 'ustur'], ['Thermal Management System', 'oni'], ['Utility Controller', 'mud']].forEach(([name, fac]) => {
    const a = viaModel(name, fac, 'stake'), b = byHand(name, fac);
    check(`${name}, ${fac}, stakes: nodes = the by-hand derivation (${b.nodes.length})`, JSON.stringify(a.nodes) === JSON.stringify(b.nodes), true);
    check(`${name}, ${fac}, stakes: route per raw = the by-hand derivation`, JSON.stringify(Object.entries(a.routes).sort()) === JSON.stringify(Object.entries(b.routes).sort()), true);
});
const prmStake = viaModel('Power Regulation Module', 'ustur', 'stake');
check('PRM, ustur, stakes: nodes to research / ATLAS', [prmStake.bill.todo, prmStake.bill.atlas], [13, 4200]);
check('PRM, ustur, stakes: Garnet Crystals and Tritium Ore have no kit, so a fleet', [prmStake.routes['Garnet Crystals'], prmStake.routes['Tritium Ore']], ['fleet/own', 'fleet/own']);
check('PRM, raws in hand: the four crafting nodes only', viaModel('Power Regulation Module', 'ustur', 'hand').nodes, ['Advanced Recipe Unlock', 'Complex Crafting', 'Freelance Crafter', 'Starting Node']);
const tmsStake = viaModel('Thermal Management System', 'ustur', 'stake');
check('TMS, ustur, stakes: three raws only in medium risk', Object.entries(tmsStake.routes).filter(([, v]) => v.endsWith('/medium')).map(([k]) => k).sort(), ['Cryo Formation Crystals', 'Drywater', 'Plasma Containment Minerals']);
check('TMS, ustur, stakes: the path includes zone access', tmsStake.nodes.includes('Medium Risk Building'), true);
check('TMS, ustur, stakes: levels', [tmsStake.bill.levels.Crafting, tmsStake.bill.levels.Mining, tmsStake.bill.levels.Building], [15, 1, 1]);
check('nodes that grant medium-risk access, cheapest first', research.zoneGrants.medium.map(n => n.name), ['Medium Risk Building', 'Contested Space Scanning']);
check('enemy-zone grant on the Mining track', research.zoneGrant('enemy', 'Mining').name, 'Enemy Faction Extraction');
// the 93 raws by the nearest zone a USTUR player finds them in - direct scan of the planet data
const scan = { own: 0, medium: 0, enemy: 0 }, viaRoute = { own: 0, medium: 0, enemy: 0 };
rm.list.filter(r => r.category === 'raw').forEach(r => {
    let best = null; const rank = { own: 0, medium: 1, enemy: 2 };
    D.planets.mapData.forEach(s => { if (s.planets.some(p => (p.resources || []).some(q => q.name === r.name))) { const z = zoneOfSystem(s, 'ustur'); if (best == null || rank[z] < rank[best]) best = z; } });
    scan[best]++; viaRoute[research.rawRoute(r, 'ustur', 'fleet', se).cls]++;
});
check('93 raws by nearest zone for USTUR (own / medium / enemy), direct scan', [scan.own, scan.medium, scan.enemy], [54, 35, 4]);
check('the same through the route model', [viaRoute.own, viaRoute.medium, viaRoute.enemy], [scan.own, scan.medium, scan.enemy]);
const gold = n => research.rawRoute(rm.byName.get('Gold Ore'), n, 'stake', se);
check('Gold Ore: an ONI kit - ONI stakes it at home, USTUR needs a fleet in an enemy zone', [gold('oni').route + '/' + gold('oni').cls, gold('ustur').route + '/' + gold('ustur').cls], ['stake/own', 'fleet/enemy']);
check('Gold Ore for ONI: the faction-building node is on the path', gold('oni').tags.map(t => research.nodeOfTag.get(t).name).includes('ONI Faction Buildings'), true);

console.log(`\n${pass} PASS, ${fail} FAIL${SABOTAGE ? ' (sabotage run: failures are expected)' : ''}`);
process.exit(fail ? 1 : 0);
