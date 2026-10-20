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
    D.research.thresholds.crafting[14] += 1;
    // 3: USTUR's five low-risk regions become medium risk (the zone checks must notice). One region alone is not
    //    enough: flipping only Eternity changed no result, every raw it holds is in another safe region too.
    D.planets.regionDefinitions.forEach(g => { if (g.risk_zone && g.risk_zone.LowRiskZone === 'Ustur') g.risk_zone = 'MediumRiskZone'; });
    // 4: the Cargo Module's cargo multiplier is nudged (the loadout constants - hold x1.754, 222,197 an hour - must notice)
    const cm = load('Data/ship-formulas-data.js').componentAttributes['Ship Module']['Cargo Module'].cargo_capacity; Object.keys(cm.values || {}).forEach(k => { if (cm.values[k]) cm.values[k] *= 1.1; }); if (cm.multiplicativeValue) cm.multiplicativeValue *= 1.1;
    // 5: one cargo name the rare-mineral grant sentence lists is blanked (section 11 must notice)
    D.research.tokenNames['300'] = null;
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

// ---- 9. haul vs haul (2026-10-05): loadout stats through the Ship Explorer's own calculator (ShipExplorer/
//         config-calculator.js, loaded here as a bare class file), travel maths re-derived by hand, crossovers checked
//         against a direct scan of the two throughput curves. Constants from the first run, corroborated here.
const { Loadout } = window.CommandDeck;
const CalcClass = new Function(require('fs').readFileSync(path.join(ROOT, 'ShipExplorer/config-calculator.js'), 'utf8') + '\nreturn ShipConfigCalculator;')();
const LO = new Loadout(D.ships.ships, load('Data/ship-components-data.js'), load('Data/ship-formulas-data.js'), CalcClass, load('Data/combat-data.js'), rc);
check('61 hulls carry cargo and a drive; the Tap has 48 configurations', [LO.ships.length, LO.configsOf('Armstrong IMP Tap').length], [61, 48]);
check('components resolved', Object.keys(LO.componentsById).length, 3756);
const CB = LO.stats('Armstrong IMP Tap', 'Cargo Boost Max'), FF = LO.stats('Armstrong IMP Tap', 'Fast Freight Max'), BASE = LO.stats('Armstrong IMP Tap', 'Default');
check('Default = the bare hull: every multiplier 1', Object.values(BASE.mult).every(m => m === 1), true);
check('Cargo Boost Max: hold x1.754, warp speed x1.2, warp range x1.621 (constants)', [CB.mult.cargo_capacity, CB.mult.warp_speed, CB.mult.max_warp_distance].map(v => +v.toFixed(3)), [1.754, 1.2, 1.621]);
check('Fast Freight Max: hold x1.385, warp speed x1.6, warp range x1.755, warp fuel x0.712 (constants)', [FF.mult.cargo_capacity, FF.mult.warp_speed, FF.mult.max_warp_distance, FF.mult.warp_fuel_consumption].map(v => +v.toFixed(3)), [1.385, 1.6, 1.755, 0.712]);
check('Cargo Boost Max fits 4 Cargo Modules M-T5 and a Freight drone', [CB.fit.find(f => f.type === 'Cargo Module').n, CB.fit.find(f => f.type === 'Cargo Module').cls + '-' + CB.fit.find(f => f.type === 'Cargo Module').tier, !!CB.fit.find(f => f.type === 'Freight')], [4, 'M-T5', true]);
// the calculator's answer equals the Ship Explorer's own: the same class, same inputs, same stacking mode
// the same class on the flat row (Data/combat-data.js allShips), every stat key, paths [key] - the Ship Explorer's
// own reading of the same configuration
const direct = (() => { const c = new CalcClass({ multiplierStackingMode: 'linear' }); const spm = {}; LO.statKeys.forEach(k => { spm[k] = [k]; }); c.setData({ componentsById: LO.componentsById, componentAttributes: load('Data/ship-formulas-data.js').componentAttributes, classScalingFormulas: load('Data/ship-formulas-data.js').classScalingFormulas, tierScalingFormulas: load('Data/ship-formulas-data.js').tierScalingFormulas, statPathMap: spm, statKeys: LO.statKeys }); const row = load('Data/combat-data.js').allShips.find(s => s['Ship Name'] === 'Armstrong IMP Tap'); return c.calculateModifiedStats(row, D.ships.ships.find(s => s.name === 'Armstrong IMP Tap').configurations.find(x => x.name === 'Cargo Boost Max')).values; })();
check('loadout stats = a fresh ShipConfigCalculator run, every one of the flat stat keys', LO.statKeys.every(k => Math.abs((CB.mod[k] || 0) - (direct[k] || 0)) <= 1e-9 * Math.max(1, Math.abs(direct[k] || 0))), true);
check('the flat row and the hub\'s nested stats agree on the Tap\'s hold, tank, warp speed and mining rate', [CB.base.cargo_capacity, CB.base.fuel_capacity, CB.base.warp_speed, CB.base.asteroid_mining_rate], (s => [s.stats.capacities.cargoCapacity, s.stats.capacities.fuelCapacity, s.stats.travel.warpSpeed, s.stats.mining.asteroidMiningRate])(D.ships.ships.find(s => s.name === 'Armstrong IMP Tap')));
// travel maths by hand at 10 units for Cargo Boost Max
const tCB = Loadout.trip(CB.mod, 10, 'warp'), m = CB.mod;
const jH = Math.ceil(10 / m.max_warp_distance), flyH = jH * m.warp_spool_time + 10 / m.warp_speed + (jH - 1) * m.warp_cool_down, loadH2 = m.cargo_capacity / m.loading_rate;
check('Cargo Boost Max at 10 units: 1 jump (range 12.16)', [tCB.jumps, jH], [1, 1]);
check('  round trip = 2 x fly + 2 x load + cooldown', tCB.time, 2 * flyH + 2 * loadH2 + m.warp_cool_down, 1e-12);
check('  cargo an hour = hold x 3600 / round trip (constant 222,197)', [tCB.perHour, Math.round(tCB.perHour)], [m.cargo_capacity * 3600 / tCB.time, 222197]);
check('  fuel per unit = (2 x warp fuel x d + exit) / hold (constant 0.169)', [tCB.fuelPerUnit, +tCB.fuelPerUnit.toFixed(3)], [(2 * m.warp_fuel_consumption * 10 + m.planet_exit_fuel) / m.cargo_capacity, 0.169]);
check('  the fitted Tap hauls 2.96x the bare Tap at 10 units', +(tCB.perHour / Loadout.trip(BASE.mod, 10, 'warp').perHour).toFixed(2), 2.96);
// crossovers: direct scan of A - B on 3,000 points must find sign changes at the same places (within one step)
const xs = Loadout.crossovers(CB.mod, FF.mod, 'warp', 0.5, 60);
const flips = []; let pv = null; for (let i = 0; i <= 3000; i++) { const d = 0.5 * Math.pow(120, i / 3000); const v = Loadout.trip(CB.mod, d, "warp").perHour - Loadout.trip(FF.mod, d, "warp").perHour; if (pv != null && Math.sign(v) !== Math.sign(pv)) flips.push(d); pv = v; }
check('8 crossovers between 0.5 and 60 units, each within 0.3 % of a direct-scan sign change', [xs.length, xs.every(x => flips.some(d => Math.abs(d - x.d) / x.d < 0.003))], [8, true]);
check('the first two: Fast Freight leads from 12.16 (Cargo Boost range) to 13.16 (Fast Freight range) units', [+xs[0].d.toFixed(3), xs[0].winnerAfter, +xs[1].d.toFixed(3), xs[1].winnerAfter], [+CB.mod.max_warp_distance.toFixed(3), 'B', +FF.mod.max_warp_distance.toFixed(3), 'A']);
check('every crossover sits at a warp-range multiple of one of the two loadouts', xs.every(x => [CB.mod.max_warp_distance, FF.mod.max_warp_distance].some(r => Math.abs(x.d / r - Math.round(x.d / r)) < 1e-3)), true);
check('subwarp: no jumps, no crossover (Cargo Boost leads at every length)', [Loadout.trip(CB.mod, 10, 'subwarp').jumps, Loadout.crossovers(CB.mod, FF.mod, 'subwarp', 0.5, 60).length], [0, 0]);

// ---- 10. the other Loadouts sub-tabs (2026-10-05): mining cycle by hand, the combat formula run directly, the
//          configuration cost against the Recipe planner, fleet points against the export table
const MM = LO.stats('Armstrong IMP Tap', 'Mining Max');
const mm = Loadout.mine(MM.mod, 10, 'warp', 1), tMM = Loadout.trip(MM.mod, 10, 'warp');
check('Mining Max: rate x1.2 + 3.758 additive (constant 27.54/s)', +MM.mod.asteroid_mining_rate.toFixed(2), 27.54);
check('  cycle = hold / rate + round trip; ore an hour = hold x 3600 / cycle', [mm.fill, mm.cycle, mm.perHour], [MM.mod.cargo_capacity / MM.mod.asteroid_mining_rate, MM.mod.cargo_capacity / MM.mod.asteroid_mining_rate + tMM.time, MM.mod.cargo_capacity * 3600 / (MM.mod.cargo_capacity / MM.mod.asteroid_mining_rate + tMM.time)]);
check('  richness 2 halves the fill and leaves the trip alone', [Loadout.mine(MM.mod, 10, 'warp', 2).fill * 2, Loadout.mine(MM.mod, 10, 'warp', 2).trip.time], [mm.fill, tMM.time]);
check('  food per unit = food rate x fill / hold', mm.foodPerUnit, MM.mod.asteroid_mining_food_rate * mm.fill / MM.mod.cargo_capacity, 1e-12);
check('  Mining Max out-mines Cargo Boost Max at 10 units (69.8 k vs 52.7 k an hour)', [Math.round(mm.perHour / 100) * 100, Math.round(Loadout.mine(CB.mod, 10, 'warp', 1).perHour / 100) * 100], [69800, 52700]);
check('  a hull with no mining rate returns null', Loadout.mine(Object.assign({}, MM.mod, { asteroid_mining_rate: 0 }), 10, 'warp', 1), null);
// the combat formula run directly on the same rows, N=200, first strike alternating, must agree with the engine's share within 10 points
const KD = LO.stats('Armstrong IMP Tap', 'Kinetic Damage Max'), DEF = LO.stats('Armstrong IMP Tap', 'Default');
const fightSrc = load('Data/combat-data.js').combatFormula, fightFn = new Function('left', 'right', 'window', 'document', 'console', fightSrc.trim().replace(/^\(function\s*\(\)\s*\{/, '').replace(/\}\)\(\)\s*;?$/, ''));
const directFight = (a, b, n) => { let L = 0, R = 0; for (let i = 0; i < n; i++) { const t = fightFn(a, b, { combatResultsStyleAdded: true, combatFirstStriker: i % 2 ? 'right' : 'left' }, null, { log() { }, warn() { }, error() { } }).replace(/<[^>]+>/g, ' '); if (/LEFT WINS/.test(t)) L++; else if (/RIGHT WINS/.test(t)) R++; } return [L / n, R / n]; };
const fKD = LO.fight(KD.mod, DEF.mod, 200), dKD = directFight(KD.mod, DEF.mod, 200);
check('Kinetic Damage Max beats the bare Tap every bout, engine and direct run alike', [fKD.pA, dKD[0]], [1, 1]);
check('  rounds are parsed (mean > 0) and shares sum to 1', [fKD.meanRounds > 0, Math.abs(fKD.pA + fKD.pB + fKD.pDraw - 1) < 1e-9], [true, true]);
const fM = LO.fight(DEF.mod, DEF.mod, 400);
check('  mirror match: neither side above 65 % over 400 bouts (first strike alternates)', fM.pA < 0.65 && fM.pB < 0.65, true);
const fX = LO.fight(LO.stats('Pearce X4', 'Default').mod, LO.stats('Armstrong IMP', 'Default').mod, 100);
check('  an X4 does not beat a bare IMP', fX.pA < 0.1, true);
// cost: the configuration's recipes equal the Recipe planner's bill for the same items
const cCB = LO.cost(CB);
check('Cargo Boost Max costs 9 recipes, none unpriced (4 x Cargo M T5, 7 x M T5 components, 1 drone at T1)', [cCB.found, cCB.unpriced.length, cCB.recipes.find(r => r.name === 'Cargo M T5').qty, cCB.recipes.filter(r => r.assumed).length], [9, 0, 4, 1]);
const planBill = rc.plan(cCB.recipes.map(r => ({ id: r.id, qty: r.qty })));
check('  its raw bill = the Recipe planner\'s for the same recipes (units and kinds)', [Math.round(cCB.rawUnits), cCB.rawList.length], [Math.round(planBill.totals.rawUnits), planBill.totals.rawKinds]);
check('  top raw is Copper Ore (constant 137,672 units)', [cCB.rawList[0].name, Math.round(cCB.rawList[0].qty)], ['Copper Ore', 137672]);
check('  the bare hull costs nothing', LO.cost(DEF).found, 0);
check('  Kinetic Damage Max: every component priced (weapons by name)', LO.cost(KD).unpriced.length, 0);
// scanning: one scan per cooldown
const SM = LO.stats('Armstrong IMP Tap', 'Scanning Max'), sc = Loadout.scan(SM.mod), sc0 = Loadout.scan(DEF.mod);
check('Scanning Max: SDU an hour = SDU per scan x 3600 / cooldown; tokens an hour likewise; SDU per token = SDU / cost', [sc.sduPerHour, sc.tokensPerHour, sc.sduPerToken].map(v => +v.toFixed(6)), [SM.mod.sduPerScan * 3600 / SM.mod.scan_cool_down, SM.mod.scan_cost * 3600 / SM.mod.scan_cool_down, SM.mod.sduPerScan / SM.mod.scan_cost].map(v => +v.toFixed(6)));
check('  the bare Tap: 193 SDU every 732 s = 949 an hour (constant)', [DEF.mod.sduPerScan, DEF.mod.scan_cool_down, Math.round(sc0.sduPerHour)], [193, 732, 949]);
check('  Scanning Max raises SDU an hour (1,606, constant) and scan power', [Math.round(sc.sduPerHour), sc.power > sc0.power], [1606, true]);
check('  no scanner -> null', Loadout.scan(Object.assign({}, DEF.mod, { scan_cool_down: 0 })), null);
// fleet points
const fp = load('Data/combat-data.js').fleetPoints.classes;
check('fleet points per class = the export table (1, 4, 9 ... 81)', [1, 2, 3, 4, 5, 6, 7, 9].map(c => LO.points.get(c).combat_points), [1, 4, 9, 16, 25, 36, 49, 81]);
check('  combat and capacity points agree in every class but Titan (81 combat / 128 capacity)', [fp.filter(c => c.combat_points !== c.capacity_points).map(c => c.token), fp.find(c => c.token === 'TTN').capacity_points], [['TTN'], 128]);
check('  a Tap is Medium = 16 points, an IMP Capital = 36', [CB.points, LO.stats('Armstrong IMP', 'Default').points], [16, 36]);
check('  Fleet Size ladder in the research nodes: start 4, tiers 7 .. 84', [(research.nodes.find(n => n.name === 'Starting Node') || {}).grants.fleet_size].concat([1, 2, 3, 4, 5, 6, 7, 8].map(t => research.nodes.find(n => n.name === `Fleet Size - Tier ${t}`).grants.fleet_size)), [4, 7, 12, 19, 28, 39, 52, 67, 84]);
// the grants are ADDITIVE: every tier's description names the running total ("raising cumulative capacity to 11"), so
// the cap the Fleet sub-tab shows is the cumulative sum, and each sum must match the number the description itself quotes
check('  the Fleet Size CAP is cumulative: 4, 11, 23 .. 312, and every tier\'s description quotes that running total', (() => {
    let run = research.nodes.find(n => n.name === 'Starting Node').grants.fleet_size; const caps = [run], quoted = [];
    for (const t of [1, 2, 3, 4, 5, 6, 7, 8]) { const n = research.nodes.find(x => x.name === `Fleet Size - Tier ${t}`); run += n.grants.fleet_size; caps.push(run); const m = /cumulative capacity to (?:the maximum of )?(\d+)/.exec(n.description || ''); quoted.push(m ? +m[1] : null); }
    return [caps, quoted];
})(), [[4, 11, 23, 42, 70, 109, 161, 228, 312], [11, 23, 42, 70, 109, 161, 228, 312]]);

// ---- 11. a node's benefit in words (2026-10-06): the export's sentence (code page repaired), each grant as a
//          sentence, the nodes it leads to - read against the raw export fields in JSON/research.json
const RAW = require(path.join(ROOT, 'JSON/research.json')).nodes, rawOf = name => RAW.find(n => n.name === name);
const B = name => research.benefit(research.byName.get(name));
check('Fleet Size - Tier 1: fleet_size 7 reads as one sentence', [B('Fleet Size - Tier 1').grants.map(g => g.text), rawOf('Fleet Size - Tier 1').character_value_changes.fleet_size], [['Fleet cap +7 points'], 7]);
check('  its description is the export\'s own sentence', B('Fleet Size - Tier 1').text, rawOf('Fleet Size - Tier 1').description.trim());
check('  Medium Ships: max_ship_size Medium -> fly hulls up to Medium', B('Medium Ships').grants.map(g => g.text), ['Fly hulls up to Medium']);
check('  Contested Space Scanning: MediumRiskZone in words', B('Contested Space Scanning').grants.map(g => g.text), ['Travel into medium-risk zones (faction-owned or neutral)']);
check('  Warp Lane Fee Reduction: a -0.25 modifier reads as -25 %', B('Warp Lane Fee Reduction').grants.map(g => g.text), ['Warp lane fees -25 %']);
const rmd = B('Rare Mineral Discoveries').grants[0], rmdRaw = rawOf('Rare Mineral Discoveries').character_value_changes.rare_mineral_discovery;
check('  Rare Mineral Discoveries: +5 % per level on the 31 resources the export lists, every one named from its cargo table', [rmd.text, rmd.list.length, rmd.list.includes('Abyssal Energy Crystals')], [`+5 % yield per level on ${Object.keys(rmdRaw).length} asteroid-mined resources`, Object.keys(rmdRaw).length, true]);
check('  Residential Expansion (Unlimited): +1 plot per level, not "up to 1"', B('Residential Expansion').grants.map(g => g.text), ['+1 residential (crafting-hab) plot per level']);
check('  Fleet Concurrency - Tier 1: the mis-coded em dash is repaired on display and left in the data', [/â€/.test(B('Fleet Concurrency - Tier 1').text), B('Fleet Concurrency - Tier 1').text.includes('Phase 1.5a add - was C4-only'), /â€/.test(rawOf('Fleet Concurrency - Tier 1').description)], [false, true, true]);
check('  no description survives with code-page damage', research.nodes.filter(n => /â€|Â /.test(research.benefit(n).text)).length, 0);
check('  every grant key the export uses has a sentence (no raw-key fallback)', research.nodes.flatMap(n => research.benefit(n).grants).filter(g => g.raw).length, 0);
check('  Hull Integrity leads to Novice Hull Integrity; Freelance Pilot opens 7 nodes; a leaf opens none', [B('Hull Integrity').leadsTo.map(c => c.name), B('Freelance Pilot').leadsTo.length, B('Elite Hull Integrity').leadsTo.length], [['Novice Hull Integrity'], 7, 0]);
check('  leads-to is the inverse of prerequisites, over the whole tree', research.nodes.every(n => n.children.every(c => c.prereqs.includes(n) || c.primary === n)) && research.nodes.filter(n => n.prereqs.length).every(n => n.prereqs.every(p => p.children.includes(n))), true);
check('  Mining Gear - T1: no sentence and no grant in the export (the page says so)', [B('Mining Gear - T1').text, B('Mining Gear - T1').grants.length, rawOf('Mining Gear - T1').description], ['', 0, '']);

// ---- 12. hab schedule (2026-10-08): synthetic plans worked by hand, then the real plan - on 1 job it must equal
//          every craft in sequence, on unlimited jobs the Recipe planner's critical path - and every placed craft
//          re-checked against the pool rule and the lanes directly
const mk = defs => { const crafts = new Map(), steps = new Map(); defs.forEach(([name, n, each, outQ, ings]) => { crafts.set(name, n); steps.set(name, { name, each, outQ, ings: (ings || []).map(([nm, q]) => ({ name: nm, qty: q })) }); }); return { crafts, steps }; };
const chainPlan = mk([['A', 2, 100, 1], ['B', 2, 200, 1, [['A', 1]]], ['C', 1, 300, 1, [['B', 2]]]]);
const s1 = empire.schedule(chainPlan, { jobs: 1 }), s2 = empire.schedule(chainPlan, { jobs: 2 });
check('chain A x2 -> B x2 -> C x1 on 1 job: 900 s, the one lane busy throughout', [s1.makespan, s1.lanes.length, s1.lanes[0].util, s1.crafts], [900, 1, 1, 5]);
check('  the order on the lane: A A B B C', s1.jobs.map(j => j.name), ['A', 'A', 'B', 'B', 'C']);
check('  on 2 jobs: 600 s (A | A, then B | B, then C), lane 2 idle during the C', [s2.makespan, s2.lanes[0].busy, s2.lanes[1].busy], [600, 600, 300]);
check('  each B starts when an A is done (100 s), C when both B are (300 s)', s2.jobs.filter(j => j.name === 'B').map(j => j.start).concat(s2.jobs.find(j => j.name === 'C').start), [100, 100, 300]);
check('  critical path on 2 jobs: A -> B -> C, every wait an input', s2.path.map(p => p.name + ':' + p.kind), ['A:start', 'B:input', 'C:input']);
check('  on 1 job: A2, B1, B2 (500 s) each followed a lane wait, C (300 s) waited for the second B, A1 (100 s) opened', [s1.pathBy.lane, s1.pathBy.input, s1.pathBy.start], [500, 300, 100]);
check('  lower bounds: work / jobs = 450 s on 2 jobs, 900 on 1; the chain alone = 600 s', [s2.parallel, s1.parallel, s2.chain], [450, 900, 600]);
const flat = mk([['X', 3, 50, 1]]);
const s3 = empire.schedule(flat, { jobs: 2 });
check('3 X (50 s, no inputs) on 2 jobs: 100 s, lanes busy 100 + 50', [s3.makespan, s3.lanes[0].busy, s3.lanes[1].busy, s3.crafts], [100, 100, 50, 3]);
check('  on a 1x hab job and a 2x station: the station takes the first craft, 50 s in all (station 25 + 25, hab 50)', (s => [s.makespan, s.jobs[0].lane, s.lanes.map(l => l.jobs.length)])(empire.schedule(flat, { lanes: [{ label: 'Hab', speed: 1 }, { label: 'S', speed: 2 }] })), [50, 1, [1, 2]]);
const pool = mk([['M', 1, 10, 4], ['T', 4, 5, 1, [['M', 1]]]]);
const s4 = empire.schedule(pool, { jobs: 3 });
check('M x1 makes 4, T x4 take 1 each, 3 jobs: M alone first (2 lanes idle), 3 T at 10 s, the last at 15 s; 20 s in all', [s4.makespan, s4.jobs.map(j => j.start), s4.lanes.map(l => l.busy)], [20, [0, 10, 10, 10, 15], [20, 5, 5]]);
const s0 = empire.schedule({ crafts: new Map(), steps: new Map() }, { jobs: 3 });
check('an empty plan: 0 s, 0 crafts, 3 empty lanes, no path', [s0.makespan, s0.crafts, s0.lanes.length, s0.path.length, s0.parallel, s0.chain], [0, 0, 3, 0, 0, 0]);
check('an empty plan through expand(): the same', (s => [s.makespan, s.crafts])(empire.schedule(empire.expand([], new Set()), { jobs: 2 })), [0, 0]);
// the real plan (Power Regulation Module x100, nothing stopped at a processor)
const X = empire.expand(prmItems, new Set()), P1 = empire.schedule(X, { jobs: 1 }), P3 = empire.schedule(X, { lanes: [{ label: 'Hab T3', speed: 1 }, { label: 'S station', speed: 1.5 }, { label: 'S station', speed: 1.5 }] }), PN = empire.schedule(X, { jobs: X.craftCount });
check('PRM x100: expand keeps a step per craft kind, with its time, output and inputs', [X.steps.size === X.crafts.size, X.steps.get('Power Regulation Module').each, X.steps.get('Power Regulation Module').ings.length > 0], [true, prm.constructionTime, true]);
check('  on 1 job = every craft in sequence (1,200 crafts, 34,000 s)', [P1.makespan, P1.crafts, P1.lanes[0].util], [X.sequential, X.craftCount, 1]);
check('  on unlimited jobs = the Recipe planner\'s critical path (210 s)', [PN.makespan, rc.plan(prmItems).time.critical], [210, 210]);
check('  on a hab job + two S-station jobs (1 + 2 x 1.5 = 4 x): work / speed is 8,500 s, the schedule is not below it and places every craft', [Math.round(P3.parallel), P3.makespan >= P3.parallel - 1e-9, P3.crafts], [Math.round(X.sequential / 4), true, X.craftCount]);
// every placed craft re-checked directly: no overlap on a lane, the right duration, inputs in the pool at the start
const verify = S => {
    const bad = [];
    S.lanes.forEach(l => l.jobs.forEach((j, i) => { if (i && j.start < l.jobs[i - 1].end - 1e-9) bad.push('overlap ' + j.id); if (Math.abs(j.end - j.start - X.steps.get(j.name).each / l.speed) > 1e-9) bad.push('duration ' + j.id); }));
    S.jobs.forEach(j => X.steps.get(j.name).ings.forEach(i => { if (!X.steps.has(i.name)) return; const made = S.jobs.filter(q => q.name === i.name && q.end <= j.start + 1e-9).length * X.steps.get(i.name).outQ; const taken = S.jobs.filter(q => q.id <= j.id && X.steps.get(q.name).ings.some(z => z.name === i.name)).reduce((a, q) => a + X.steps.get(q.name).ings.find(z => z.name === i.name).qty, 0); if (made < taken - 1e-9) bad.push('input ' + j.id); }));
    const kinds = new Map(); S.jobs.forEach(j => kinds.set(j.name, (kinds.get(j.name) || 0) + 1)); X.crafts.forEach((n, name) => { if (kinds.get(name) !== n) bad.push('count ' + name); });
    return bad;
};
check('  every craft on the 3-lane schedule: no lane overlap, duration = each / speed, inputs in the pool, counts = the plan', verify(P3), []);
check('  the same on 1 job', verify(P1), []);
check('  the critical path ends at the last craft and starts at 0', [P3.path[P3.path.length - 1].end, P3.path[0].start, P3.path[0].kind], [P3.makespan, 0, 'start']);
check('  lane waits + input waits + the first craft = the whole path', Math.abs(P3.pathBy.lane + P3.pathBy.input + P3.pathBy.start - P3.path.reduce((a, p) => a + p.end - p.start, 0)) < 1e-6, true);
// the Hub Explorer's build as lanes
const HM = new window.HubModel(load('Data/crafting-hab-data.js'), D.recipes.recipes, D.resources.resources);
const HP = HM.plan([{ id: 'hab-t3', qty: 1 }, { id: 'hab-crafting-station-s', qty: 1 }, { id: 'hab-cargo-storage-t3', qty: 1 }]);
const LN = Empire.lanesFromHab(HP.rows);
check('T3 hab + S station + T3 storage: 5 lanes = the Hub Explorer\'s 5 jobs; speeds 1, 1.5 x3, 1', [LN.length, HP.jobs, LN.map(l => l.speed)], [5, 5, [1, 1.5, 1.5, 1.5, 1]]);
check('  no build: no lanes', Empire.lanesFromHab([]), []);

console.log(`\n${pass} PASS, ${fail} FAIL${SABOTAGE ? ' (sabotage run: failures are expected)' : ''}`);
process.exit(fail ? 1 : 0);
