#!/usr/bin/env node
// command-deck-loadout-check.js - Node check of the Command Deck Ships vs Stakes and Loadouts code
// (CommandDeck/deck-calc.js, deck-vs.js, deck-loadout.js) after the 2026-10-25 audit fixes:
//   B1 stake fuel in the Ships vs Stakes tab      B2 every fitted component priced (case-insensitive recipe names,
//   generic weapons as their cheapest variant)    B3 Titan / Commander composition limits   B4 capacity points
//   B5 measure-your-tick adds the central hub's passive   B8 bouts 200 / 500   B10 miners only in the dropdown
// The tabs are driven headless: window.DeckUI / window.DeckStore are small stubs, the tab root is a plain object, and
// the HTML the tab builds is read back as a string.
//
//   node Test/command-deck-loadout-check.js < /dev/null      exit 0 = all PASS
//   node Test/command-deck-loadout-check.js --old=<dir>      load deck-calc/deck-vs/deck-loadout from <dir> instead
//                                                           (the pre-fix copies: the NEGATIVE run, which must FAIL)
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
global.window = global;
const oldArg = process.argv.find(a => a.startsWith('--old='));
const SRC = oldArg ? oldArg.slice(6) : path.join(ROOT, 'CommandDeck');
const load = f => require(path.join(ROOT, f));
const D = {
    buildings: load('Data/buildings-data.js'), ships: load('Data/ships-data.js'), recipes: load('Data/recipes-data.js'),
    resources: load('Data/resources-data.js'), planets: load('Data/planet-data.js'), research: load('Data/research-data.js')
};
// --old-model=<dir>: load deck-model.js from <dir> (the pre-cultivation copy: the cultivation checks must FAIL)
const oldModel = process.argv.find(a => a.startsWith('--old-model='));
load('ResourcesExplorer/resource-model.js'); load('RecipeExplorer/recipe-model.js'); load('HubExplorer/hub-model.js'); require(oldModel ? path.join(oldModel.slice(12), 'deck-model.js') : path.join(ROOT, 'CommandDeck/deck-model.js'));
require(path.join(SRC, 'deck-loadout.js'));
const { ResearchModel, StakeEngine, Empire, Loadout } = window.CommandDeck;
const rm = new window.ResourceModel(D.resources.resources, D.recipes.recipes, D.planets, D.buildings.buildings);
const rc = new window.RecipeModel(rm);
const research = new ResearchModel(D.research, rc, D.ships.ships);
const se = new StakeEngine(D.buildings, rm, D.planets);
const empire = new Empire(se, rc, D.ships.ships);
const CalcClass = new Function(require('fs').readFileSync(path.join(ROOT, 'ShipExplorer/config-calculator.js'), 'utf8') + '\nreturn ShipConfigCalculator;')();
const combat = load('Data/combat-data.js');
const LO = new Loadout(D.ships.ships, load('Data/ship-components-data.js'), load('Data/ship-formulas-data.js'), CalcClass, combat, rc);

// ---- stubs for the browser side
const fmt = (v, d) => (v == null || !isFinite(v) ? '–' : Number(v).toLocaleString('en-US', { maximumFractionDigits: d == null ? (Math.abs(v) < 10 ? 2 : 0) : d, minimumFractionDigits: 0 }));
let SAVED = {};
const STORE = { s: { tick: 60, calc: { raw: 'copper-ore', ref: 'Armstrong IMP Tap' } }, on() { }, read(k, def) { return SAVED[k] !== undefined ? SAVED[k] : def; }, write() { }, save() { }, shipPrice() { return 0; }, stakePrice() { return 0; }, setPrice() { }, setTick() { } };
window.DeckStore = STORE;
window.DeckUI = { esc: s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;'), num: fmt, dur: v => fmt(v, 1) + ' s', usd: v => '$' + fmt(v, 2), snd() { }, settingsStrip: () => '', bindStrip() { }, PRICE_DATE: '2026-10-04' };
const root = () => ({ innerHTML: '', addEventListener() { }, querySelector() { return null; }, closest() { return { classList: { contains: () => true } }; } });
const fresh = f => { const p = path.join(SRC, f); delete require.cache[require.resolve(p)]; require(p); };
fresh('deck-calc.js'); fresh('deck-vs.js');

let pass = 0, fail = 0;
function check(label, got, want) {
    const ok = typeof want === 'function' ? !!want(got) : JSON.stringify(got) === JSON.stringify(want);
    if (ok) pass++; else fail++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: ${typeof got === 'number' ? got : JSON.stringify(got)}${ok ? '' : '  (expected ' + (typeof want === 'function' ? 'predicate' : JSON.stringify(want)) + ')'}`);
}
const near = (a, b, t) => a != null && Math.abs(a - b) <= t;
const safe = f => { try { return f(); } catch (e) { return 'THROWS ' + e.message; } };
// PENDING (2026-11-19): a known open question the data cannot settle yet. Printed as `PENDING <label>: <value>` and
// counted on its own; it never touches pass or fail, so it never sets exit 1 and cannot hide a FAIL. (The scanning
// pending item lives in command-deck-check.js; this suite declares none today but reports the count.)
let pend = 0;
function pending(label, got) {
    // a throw inside a pending item is a FAIL (2026-11-19 review S4): only a returned value is PENDING
    if (typeof got === 'function') { try { got = got(); } catch (e) { fail++; console.log(`FAIL  ${label}: THREW ${e.message}`); return; } }
    pend++; console.log(`PENDING  ${label}: ${typeof got === 'string' ? got : JSON.stringify(got)}`); }
// 2026-11-19 RULE-FREE: the export lists 12 physical drone units per drone port and the per-unit stacking rule is
// unconfirmed, so drone-dependent figures (Mining Max 27.54/s was the one-unit-per-port reading) are checked against a
// fresh ShipConfigCalculator run made here on the flat combat row and the raw configuration - not through the deck.
// WHAT THIS GROUP DOES NOT PIN (2026-11-19 review S3): "= a fresh calculator run" uses the same ShipConfigCalculator as the
// deck, so it cannot catch a wrong every-unit stacking. Values with every listed drone unit applied are UNPINNED until
// the game's per-unit drone rule is confirmed; only the one-unit-per-port rung is pinned (see command-deck-check.js).
const RF = ' [rule-free: every-unit drone values unpinned until the rule is confirmed]';
const freshStat = (hull, cfgName, k) => {
    const F = load('Data/ship-formulas-data.js'), c = new CalcClass({ multiplierStackingMode: 'linear' }), spm = {}; LO.statKeys.forEach(x => { spm[x] = [x]; });
    c.setData({ componentsById: LO.componentsById, componentAttributes: F.componentAttributes, classScalingFormulas: F.classScalingFormulas, tierScalingFormulas: F.tierScalingFormulas, statPathMap: spm, statKeys: LO.statKeys });
    const row = combat.allShips.find(s => s['Ship Name'] === hull), cfg = D.ships.ships.find(s => s.name === hull).configurations.find(x => x.name === cfgName);
    return c.calculateModifiedStats(row, cfg).values[k];
};
const TAP_MM = freshStat('Armstrong IMP Tap', 'Mining Max', 'asteroid_mining_rate');

// ---- B2: unpriced fits
console.log('-- B2 unpriced fits');
const KDM = LO.cost(LO.stats('Pearce X4', 'Kinetic Damage Max'));
check('Pearce X4 Kinetic Damage Max: 0 unpriced components', KDM.unpriced.length, 0);
check('  its weapon is the exact recipe from the component data: 4 x Kinetic Rapidfire XXS T5, nothing assumed', KDM.recipes.filter(r => /^Kinetic /.test(r.name)).map(r => [r.name, r.qty, r.assumed]), [['Kinetic Rapidfire XXS T5', 4, '']]);
// 2026-11-19 re-pin (was 10,335): re-derived from JSON/recipes.json with no hub code by
// Tools/command-deck-derive/derive2.js (KDM_RAW_UNITS = 32,339, 24 raw kinds; see the README there)
check('  raw units of the whole fit [derive2 KDM_RAW_UNITS]', KDM.rawUnits, v => Math.abs(v - 32339) < 1);
const TYPE = { 'Ship Weapons': 'SHIP_WEAPONS', Missiles: 'MISSILES', Countermeasures: 'COUNTERMEASURES', 'Ship Component': 'SHIP_COMPONENTS', 'Ship Module': 'SHIP_MODULES', Drones: 'DRONE' };
let unpricedConfigs = 0, totalConfigs = 0, mismatch = 0, assumedFits = 0; const left = new Set();
LO.ships.forEach(s => LO.configsOf(s.name).forEach(c => { totalConfigs++; const k = LO.cost(LO.stats(s.name, c)); k.recipes.forEach(r => { if (rm.recipeByName.get(r.name).outputType !== TYPE[r.fit.category]) mismatch++; if (/variant assumed/.test(r.assumed)) assumedFits++; }); if (k.unpriced.length) { unpricedConfigs++; k.unpriced.forEach(u => left.add(`${u.name} ${u.cls} ${u.tier}`)); } }));
console.log(`   sweep: ${unpricedConfigs} of ${totalConfigs} configurations with an unpriced component${left.size ? '; left: ' + Array.from(left).slice(0, 10).join(', ') : ''}`);
check('sweep of all configurations: none left unpriced', [totalConfigs, unpricedConfigs], [2928, 0]);
check('  every priced fit uses a recipe of its own kind (weapon -> SHIP_WEAPONS, missile -> MISSILES, countermeasure -> COUNTERMEASURES ...): mismatches', mismatch, 0);
check('  no fit needed the "variant assumed" last resort', assumedFits, 0);
const synth = fit => LO.cost({ fit: [fit] });
check('weapon "EMP" with its cadence finds the WEAPON recipe "Emp Rapidfire M T5", not the missile', safe(() => synth({ name: 'EMP', type: 'EMP', category: 'Ship Weapons', cadence: 'Rapidfire', cls: 'M', tier: 'T5', n: 1 }).recipes.map(r => r.name)), ['Emp Rapidfire M T5']);
check('  missile "EMP" (category Missiles) finds the missile recipe "Emp M T5"', safe(() => synth({ name: 'EMP', type: 'EMP', category: 'Missiles', cls: 'M', tier: 'T5', n: 1 }).recipes.map(r => r.name)), ['Emp M T5']);
check('  weapon "Energy" Beam M T1 is the weapon, not the Energy Capacitor countermeasure', safe(() => synth({ name: 'Energy', type: 'Energy', category: 'Ship Weapons', cadence: 'Beam', cls: 'M', tier: 'T1', n: 1 }).recipes.map(r => r.name)), ['Energy Beam M T1']);
check('  "Negative REM Plating" (countermeasure) finds "Negative Rem Plating S T3"', safe(() => synth({ name: 'Negative REM Plating', type: 'Negative REM Plating', category: 'Countermeasures', cls: 'S', tier: 'T3', n: 1 }).recipes.map(r => r.name)), ['Negative Rem Plating S T3']);
check('last resort: a weapon with no cadence is priced as a weapon variant, never as a countermeasure', safe(() => { const r = synth({ name: 'Energy', type: 'Energy', category: 'Ship Weapons', cls: 'M', tier: 'T1', n: 1 }).recipes[0]; return [rm.recipeByName.get(r.name).outputType, /variant assumed/.test(r.assumed)]; }), ['SHIP_WEAPONS', true]);
check('NEGATIVE control: a component with no recipe stays unpriced', safe(() => synth({ name: 'Zzz Nonexistent', type: 'Zzz Nonexistent', category: 'Ship Weapons', cls: 'M', tier: 'T5', n: 1 }).unpriced.length), 1);
const variants = ['Burst', 'Cannon', 'Rapidfire', 'Scatterfire'].map(v => rm.recipeByName.get(`Kinetic ${v} M T5`)).filter(Boolean);
const unitsOf = r => { let u = 0; rc.expand([{ id: r.outputId, qty: 1 }]).raws.forEach(q => { u += q; }); return u; };
check('generic "Kinetic M T5" is priced as the cheapest of its variants (independent expand)', safe(() => synth({ name: 'Kinetic', type: 'Kinetic', category: 'Ship Weapons', cls: 'M', tier: 'T5', n: 1 }).rawUnits), v => variants.length === 4 && Math.abs(v - Math.min(...variants.map(unitsOf))) < 1e-6);


// ---- B4: capacity points
console.log('-- B4 capacity points');
const titan = LO.ships.find(s => LO.classOf(s) === 9).name;
check('a Titan counts 128 against the cap (capacity points)', LO.stats(titan, 'Default').points, 128);
check('  a Tap (M) 16, an IMP (CAP) 36 unchanged', [LO.stats('Armstrong IMP Tap', 'Default').points, LO.stats('Armstrong IMP', 'Default').points], [16, 36]);

// ---- B1 / B5 / B10: the Ships vs Stakes tab
console.log('-- B1 stake fuel, B5 measure tick, B10 miners only');
const CalcTab = window.DeckCalcTab;
const ct = new CalcTab(root(), { se, empire, rm });
const cc = safe(() => ct.compute());
const t5 = cc.tiers && cc.tiers.find(t => t.tier === 5), t1 = cc.tiers && cc.tiers.find(t => t.tier === 1);
check('T5 copper stake burns about 114.4 fuel a tick (power plant 114.24 + hubs; independent of the table)', t5 && t5.fuel, v => near(v, 114.44, 0.3));
check('  fuel per unit mined = fuel / output per tick (T5: 3.36)', t5 && t5.fuelPerUnit, v => near(v, 114.44 / 34.02, 0.02));
check('  T1 stake: 2.51 a tick', t1 && t1.fuel, v => near(v, 2.51, 0.05));
STORE.shipPrice = () => 160;      // the fair-price bars and their notes need a hull price
try { ct.render(); } catch (e) { console.log('RENDER ERR', e.message, e.stack.split(String.fromCharCode(10))[1]); }
const html = safe(() => { ct.render(); return ct.root.innerHTML; });
check('the stake table has the fuel columns', [/fuel per tick/.test(html), /fuel per unit/.test(html)], [true, true]);
const refOpts = (html.match(/data-ref>([\s\S]*?)<\/select>/) || [, ''])[1].match(/<option/g) || [];
// owner rule 2026-10-26: any hull can be picked, not just the Miner spec - every hull with a mining rate (61 of 67)
check('the Hull select lists every hull with a mining rate', refOpts.length, empire.miners.length);
check('  that is 61 hulls, not the 3 Miner-spec ones', empire.miners.length, 61);
STORE.s.calc.ref = 'Busan The Last Stand mk. VIII';
check('  a saved non-Miner-spec hull that mines is kept', safe(() => ct.compute().ref.name), 'Busan The Last Stand mk. VIII');
STORE.s.calc.ref = 'Starbase - Tier 0';
check('  a saved hull with no mining rate falls back to the Tap', safe(() => ct.compute().ref.name), 'Armstrong IMP Tap');
// owner rule 2026-10-26: the hull takes a configuration, the stake an extractor count
const ctL = new CalcTab(root(), { se, empire, rm, loadout: LO });
check('hull config: Default equals the base row (Tap 19.192 / s, hold 32,270)', safe(() => { const f = ctL.fitted('Armstrong IMP Tap', 'Default'); return [f.rate, f.cargo, f.cfg]; }), [19.192, 32270, 'Default']);
// 2026-11-19: was "fits the Tap to 27.54 / s" (one drone unit per port)
check('  Mining Max fits the Tap to a fresh calculator run\'s rate, above the bare 19.192 / s' + RF, safe(() => ctL.fitted('Armstrong IMP Tap', 'Mining Max').rate), v => near(v, TAP_MM, 1e-9 * TAP_MM) && v > 19.192);
check('  an unknown config name falls back to Default', safe(() => ctL.fitted('Armstrong IMP Tap', 'No Such Fit').cfg), 'Default');
check('  the Tap offers its 48 configurations', safe(() => ctL.fitted('Armstrong IMP Tap', 'Default').cfgs.length), 48);
STORE.s.calc.cfg = 'Mining Max';
check('  compute() uses the saved config: the verdict hull mines at the fresh Mining Max rate, not the bare 19.192' + RF, safe(() => ctL.compute().ref.rate), v => near(v, TAP_MM, 1e-9 * TAP_MM) && v > 19.192);
STORE.s.calc.cfg = 'Default';
const s3 = se.stakeWith(5, 'copper-ore', 3), s7 = se.fullStake(5, 'copper-ore');
check('stake extractors: a T5 with 3 of 7 extractors makes 3 x 4.86 = 14.58 a tick, same storage, less crew', s3 && [s3.k, s3.max, Math.round(s3.perTick * 100) / 100, s3.storage === s7.storage, s3.crew < s7.crew], [3, 7, 14.58, true, true]);
check('  asking for 99 clamps to the 7 that fit; 0 or none means full', [se.stakeWith(5, 'copper-ore', 99).k, se.stakeWith(5, 'copper-ore', 0).k, se.stakeWith(5, 'copper-ore').k], [7, 7, 7]);
// one power plant serves 1..7 T5 extractors, so the stake burns the same fuel at every count (crew falls 125 each)
check('  fuel: 3 extractors burn the same 114.4 a tick as 7 (still one power plant); crew 395 vs 895', safe(() => [s3.npp, s7.npp, Math.abs(ct.stakeFuel(s3, 'copper-ore').fuel - ct.stakeFuel(s7, 'copper-ore').fuel) < 1e-9, s3.crew, s7.crew]), [1, 1, true, 395, 895]);
STORE.s.calc.tier = 5; STORE.s.calc.ext = { 5: 3 };
check('  compute() uses the saved count for the chosen tier', safe(() => { const c = ct.compute(); return [c.stake.tier, c.stake.k, c.tiers.find(x => x.tier === 5).k]; }), [5, 3, 7]);
STORE.s.calc.ext = {};
STORE.s.calc.ref = 'Armstrong IMP Tap';
const pt = safe(() => ct.planetTypes('copper-ore', 1));
// 2026-11-19 re-pin: no Barren body holds Copper Ore on this export, so the panel lists only the two types that do, each
// with its T1 central hub's passive [derive2 COPPER_STAKE_TYPES, HUB_PASSIVE]
check('measure tick: Copper Ore stands on Terrestrial and Oceanic only; each T1 hub adds a 0.002 a tick passive', safe(() => [Array.from(pt.keys()).sort(), pt.get('Terrestrial'), pt.get('Oceanic')]), [['Oceanic', 'Terrestrial'], 0.002, 0.002]);
// the "adds none" half moved to a raw whose hub passive is 0 on a type that holds it: a planet type with a deposit of
// the raw but no hub rate for it reads 0, never a gap
check('  a type whose hub has no rate for the raw reads 0 (not missing)', safe(() => { const raw = ct.raws.find(r => { const m = ct.planetTypes(r.id, 1); return Array.from(m.values()).some(v => v === 0); }); return raw ? Array.from(ct.planetTypes(raw.id, 1).values()).filter(v => v === 0).length > 0 : 'no such raw'; }), true);
const allFuel = []; ct.raws.forEach(r => [1, 2, 3, 4, 5].forEach(t => { const f = se.fullStake(t, r.id); if (f && ct.stakeFuel(f, r.id).fuel == null) allFuel.push(r.id + ' T' + t); }));
check('stake fuel is found for every raw at every tier (strontium-crystals, titanium-ore included)', allFuel, []);
check('  strontium-crystals T5 stake burns fuel', safe(() => ct.stakeFuel(se.fullStake(5, 'strontium-crystals'), 'strontium-crystals').fuel), v => v > 0);
// ---- cultivation stakes (2026-11-11, export 2026-11-12): the extractors of the organic raws carry
// `cultivation-stake-only`, so they stand on a cultivation stake (cultivation hub in place of the central hub).
// Expected values are derived here from the raw building rows by exhaustive search, not through the Stake Engine.
// The cultivation hub, farm hub and organic extractors carry the same stats as the central hub, extraction hub and
// a standard extractor, so the NUMBERS cannot tell the two branches apart: the hub-id, kind and refusal checks do.
console.log('-- cultivation stakes');
const BY = new Map(D.buildings.buildings.map(b => [b.id, b]));
const isExt = b => (b.addedTags || []).includes('extractor'), cultOnly = b => (b.requiredTags || []).includes('cultivation-stake-only');
const CULT_RAWS = Array.from(new Set(D.buildings.buildings.filter(b => isExt(b) && cultOnly(b)).flatMap(b => Object.keys(b.resourceExtractionRate || {})))).sort();
const STD_RAWS = Array.from(new Set(D.buildings.buildings.filter(b => isExt(b) && !cultOnly(b)).flatMap(b => Object.keys(b.resourceExtractionRate || {})))).sort();
const handStake = (raw, tier, cult) => {
    const g = k => BY.get(`terrestrial-${k}-t${tier}`), ext = BY.get(`${raw}-extractor-t${tier}`);
    const central = g(cult ? 'cultivation-hub' : 'central-hub'), hubs = [g('storage-hub'), g(cult ? 'farm-hub' : 'extraction-hub')], cq = g('crew-quarters'), pp = g('power-plant');
    const S = D.buildings.claimStakeDefinitions.find(d => d.id === `${cult ? 'cultivation' : 'claim'}-stake-tier-${tier}`).slots;
    let best = null;
    for (let n = 1; n < 60; n++) {
        let fit = null;
        for (let a = 0; a <= 60; a++) for (let p = 0; p <= 6; p++) {
            const all = [[central, 1], [hubs[0], 1], [hubs[1], 1], [cq, a], [pp, p], [ext, n]], sum = f => all.reduce((x, [b, k]) => x + (b[f] || 0) * k, 0);
            if (sum('crewSlots') < sum('neededCrew') || sum('power') < 0 || sum('slots') > S) continue;
            const fuel = all.reduce((x, [b, k]) => x + Math.max(0, -((b.resourceRate || {}).fuel || 0)) * k, 0);
            if (!fit || sum('slots') < fit.used) fit = { n, used: sum('slots'), crew: sum('neededCrew'), fuel };
        }
        if (!fit) break; best = fit;
    }
    return best;
};
check('the export locks 15 raws to cultivation stakes, and none of them also has a standard extractor', [CULT_RAWS.length, CULT_RAWS.filter(r => STD_RAWS.includes(r)).length], [15, 0]);
check('  every one of them gets a cultivation stake at every tier; copper-ore stays a standard stake', safe(() => [CULT_RAWS.filter(r => [1, 2, 3, 4, 5].every(t => (se.fullStake(t, r) || {}).kind === 'cultivation')).length, se.fullStake(5, 'copper-ore').kind]), [15, 'standard']);
const tk = [1, 2, 3, 4, 5].map(t => se.fullStake(t, 'tidal-kelp')), tkHand = [1, 2, 3, 4, 5].map(t => handStake('tidal-kelp', t, true));
check('  tidal-kelp full stake, extractors per tier = the by-hand search over the raw building rows', tk.map(f => f && f.max), tkHand.map(h => h.n));
check('  ... and its slots used and crew', tk.map(f => f && [f.used, f.crew]), tkHand.map(h => [h.used, h.crew]));
check('  ... and its fuel per tick (power plants + cultivation hub)', safe(() => tk.map(f => Math.round(ct.stakeFuel(f, 'tidal-kelp').fuel * 1e6) / 1e6)), tkHand.map(h => Math.round(h.fuel * 1e6) / 1e6));
check('  the by-hand search agrees with the engine on a standard stake too (positive control: copper-ore)', [1, 2, 3, 4, 5].map(t => se.fullStake(t, 'copper-ore').max), [1, 2, 3, 4, 5].map(t => handStake('copper-ore', t, false).n));
check('  no raw reads as a stake of thousands of extractors (an empty layout never counts as "fits")', ct.raws.filter(r => [1, 2, 3, 4, 5].some(t => { const f = se.fullStake(t, r.id); return f && f.max > 100; })).map(r => r.id), []);
// a planet holding a raw of each kind, chosen from the DATA (deposits + building tags), not through the engine's kind
const slugOf = n => String(n).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const T1EXT = new Map(D.buildings.buildings.filter(b => isExt(b) && b.tier === 1).flatMap(b => Object.keys(b.resourceExtractionRate).map(r => [r, b])));
const facOk = (b, p) => { const f = (b.requiredTags || []).find(t => ['oni', 'mud', 'ustur'].includes(t)); return !f || f === p.faction; };
const rawsOn = (p, cult) => Array.from(p.deposits.keys()).filter(r => T1EXT.has(r) && cultOnly(T1EXT.get(r)) === cult && facOk(T1EXT.get(r), p)).sort();
const mixP = se.planets.filter(p => p.stakeable && rawsOn(p, true).length && rawsOn(p, false).length).sort((a, b) => a.key.localeCompare(b.key))[0];
const mixC = rawsOn(mixP, true)[0], mixS = rawsOn(mixP, false)[0];
check('  a planet with a raw of each kind exists (precondition of the checks below)', [!!mixP, slugOf(mixC) === mixC, CULT_RAWS.includes(mixC), STD_RAWS.includes(mixS)], [true, true, true, true]);
check('  one stake, one kind: a cultivation and a standard extractor together are refused with a reason, each alone stands', safe(() => { const m = se.layout(mixP, 1, { [mixC]: 1, [mixS]: 1 }, []); return [m.ok, m.mixed, /separate stakes/.test(m.reason || ''), se.layout(mixP, 1, { [mixC]: 1 }, []).ok, se.layout(mixP, 1, { [mixS]: 1 }, []).ok]; }), [false, true, true, true, true]);
check('  the cultivation stake stands on the cultivation hub and adds the farm hub; the standard one on the central hub', safe(() => [se.layout(mixP, 1, { [mixC]: 1 }, []).items[0].b.id, se.layout(mixP, 1, { [mixC]: 1 }, []).hubs.includes('farm-hub'), se.layout(mixP, 1, { [mixS]: 1 }, []).items[0].b.id]), [`${mixP.slug}-cultivation-hub-t1`, true, `${mixP.slug}-central-hub-t1`]);
check('  auto-fill keeps to the kind of the first raw asked for AND fills the stake (counts = the by-hand maximum)', safe(() => [se.autoAlloc(mixP, 1, [mixC, mixS], []), se.autoAlloc(mixP, 1, [mixS, mixC], [])]), [{ [mixC]: handStake(mixC, 1, true).n }, { [mixS]: handStake(mixS, 1, false).n }]);
// a processor is a standard-stake building: with one on the stake, auto-fill never adds a cultivation extractor
const procP = se.planets.filter(p => p.stakeable && rawsOn(p, true).length && rawsOn(p, false).length && se.processable(p, 1).length).sort((a, b) => a.key.localeCompare(b.key))[0];
const procId = procP && se.processable(procP, 1)[0].id, pC = procP && rawsOn(procP, true)[0], pS = procP && rawsOn(procP, false)[0];
check('  with a processor on the stake, auto-fill asked for [cultivation raw, standard raw] places only the standard one', safe(() => { const a = se.autoAlloc(procP, 1, [pC, pS], [procId]); return [Object.keys(a), a[pS] > 0, se.layout(procP, 1, a, [procId]).ok]; }), [[pS], true, true]);
// the hub's passive: a planet whose cultivation hub lists a raw the planet does NOT hold (else the check is vacuous)
const passCase = (() => { for (const t of [5, 4, 3, 2, 1]) for (const p of se.planets) { if (!p.stakeable) continue; const hub = BY.get(`${p.slug}-cultivation-hub-t${t}`); const lists = Object.keys((hub && hub.resourceExtractionRate) || {}); const has = lists.filter(r => p.deposits.has(r)), lacks = lists.filter(r => !p.deposits.has(r)); const own = has.find(r => BY.get(`${r}-extractor-t${t}`) && facOk(BY.get(`${r}-extractor-t${t}`), p)); if (own && lacks.length) return { p, t, own, has, lacks }; } return null; })();
check('  the cultivation hub\'s passive trickle counts a raw the planet holds and leaves out one it lacks (owner rule 2026-10-03)', safe(() => { const pr = se.production(passCase.p, passCase.t, { [passCase.own]: 1 }, [], { richness: false }); return [passCase.lacks.length > 0, passCase.has.every(r => pr.passive.has(r)), passCase.lacks.some(r => pr.passive.has(r))]; }), [true, true, false]);
// saved stakes: the September build could save both kinds on one stake, and the map has thinned since
const goneRaw = STD_RAWS.find(r => !mixP.deposits.has(r));
check('  a saved stake that mixes kinds is cleaned to its larger kind, a tie keeps standard, a raw the planet lost is dropped', safe(() => { const a = se.cleanStake(mixP, 1, { [mixC]: 2, [mixS]: 1, [goneRaw]: 3 }, []), b = se.cleanStake(mixP, 1, { [mixC]: 1, [mixS]: 1 }, []); return [a.kind, a.alloc, a.offKind, a.gone, b.kind, b.alloc, b.offKind]; }), ['cultivation', { [mixC]: 2 }, [mixS], [goneRaw], 'standard', { [mixS]: 1 }, [mixC]]);
check('  ... the cleaned stake lays out ok; an unmixed stake comes back untouched; an empty one has no kind', safe(() => { const a = se.cleanStake(mixP, 1, { [mixC]: 2, [mixS]: 1 }, []), u = se.cleanStake(mixP, 1, { [mixS]: 3 }, []); return [se.layout(mixP, 1, a.alloc, a.procs).ok, u.alloc, u.gone.length + u.offKind.length + u.goneProcs.length, se.stakeKind(mixP, 1, {}, [])]; }), [true, { [mixS]: 3 }, 0, null]);
check('  ... and a processor on a stake cleaned to cultivation is dropped with it', safe(() => { const c = se.cleanStake(procP, 1, { [pC]: 3 }, [procId]); return [c.kind, c.procs, c.goneProcs]; }), ['cultivation', [], [procId]]);
// the Empire tab's Auto-fill (deck-empire.js refill), driven on the prototype with the stake engine and a bill
fresh('deck-empire.js');
const refill = (stake, rows) => { window.DeckEmpireTab.prototype.refill.call({ se, cov: { rows } }, stake); return stake.alloc; };
const nameOf = (p, raw) => p.deposits.get(raw).name;
check('  Auto-fill on a standard stake with a processor, when the bill lacks only a cultivation raw, still fills it with standard raws', safe(() => { const a = refill({ key: procP.key, tier: 1, alloc: {}, procs: [procId] }, [{ name: nameOf(procP, pC), perHour: 0 }, { name: nameOf(procP, pS), perHour: 5 }]); return [Object.keys(a).length > 0, Object.keys(a).some(r => CULT_RAWS.includes(r)), se.layout(procP, 1, a, [procId]).ok]; }), [true, false, true]);
check('  Auto-fill never turns a standard stake into a cultivation one (the bill lacks the cultivation raw first)', safe(() => { const a = refill({ key: mixP.key, tier: 1, alloc: { [mixS]: 3 }, procs: [] }, [{ name: nameOf(mixP, mixC), perHour: 0 }]); return [Object.keys(a).some(r => CULT_RAWS.includes(r)), Object.keys(a).length > 0]; }), [false, true]);
check('  ... an empty stake takes the kind of the raw the bill lacks', safe(() => refill({ key: mixP.key, tier: 1, alloc: {}, procs: [] }, [{ name: nameOf(mixP, mixC), perHour: 0 }])), { [mixC]: handStake(mixC, 1, true).n });
check('  the cultivation stake\'s research gate is read from its own entry in the gate map', safe(() => [research.stakeGate(3, 'cultivation'), research.stakeGate(3)]), [D.research.gates.claimStakes['cultivation-stake-tier-3'], D.research.gates.claimStakes['claim-stake-tier-3']]);
check('  a saved processor id that cannot run here is dropped and named (unknown id, and a kit of another tier)', safe(() => { const c = se.cleanStake(procP, 1, { [pS]: 2 }, [procId, 'no-such-processor-t1', procId.replace(/-t1$/, '-t3')]); return [c.procs, c.goneProcs.length, c.alloc]; }), [[procId], 2, { [pS]: 2 }]);
// the Empire tab itself, headless: a stake saved by the September build is cleaned at load and the card says so
const empTab = saved => { SAVED = { 'commandDeck.empire.v1': saved }; const t = new window.DeckEmpireTab(root(), { se, empire, rc, rm }); t.cov = { rows: [] }; t.intermediates = new Set(); return t; };
const cardOf = (t, s) => String(safe(() => t.stakeCard(s)));
const plusOff = (html, raw) => { const m = html.match(new RegExp('data-alloc="[^"|]*\\|' + raw + '\\|1"([^>]*)>')); return m ? /disabled/.test(m[1]) : null; };
const tabMixed = safe(() => empTab({ stakes: [{ id: 's_a', key: mixP.key, tier: 1, alloc: { [mixC]: 1, [mixS]: 2, [goneRaw]: 2 }, procs: [] }], fleets: [] }));
check('  Empire load: a saved stake with both kinds and a raw the planet lost comes up clean, with a note', safe(() => { const s = tabMixed.stakes[0]; return [s.alloc, /Removed/.test(s.note || ''), se.layout(mixP, 1, s.alloc, s.procs).ok]; }), [{ [mixS]: 2 }, true, true]);
check('  ... the card shows the note, naming what went, and the + of the other kind is off while a same-kind + is on', safe(() => { const h = cardOf(tabMixed, tabMixed.stakes[0]); return [h.includes(tabMixed.stakes[0].note.replace(/&/g, '&amp;')), h.includes(nameOf(mixP, mixC)), plusOff(h, mixC), plusOff(h, mixS)]; }), [true, true, true, false]);
check('  ... the note is this session\'s notice: it is not among the fields save() writes', safe(() => { let wrote = null; const w = STORE.write; STORE.write = (k, v) => { wrote = v; }; try { tabMixed.save(); } finally { STORE.write = w; } return [Object.keys(wrote.stakes[0]).sort(), 'note' in wrote.stakes[0]]; }), [['alloc', 'id', 'key', 'procs', 'tier'], false]);
const tabCult = safe(() => empTab({ stakes: [{ id: 's_c', key: mixP.key, tier: 1, alloc: { [mixC]: 2 }, procs: [] }], fleets: [] }));
check('  a cultivation stake\'s card says so, carries no note, and turns the standard raws\' + off; a standard card does not say cultivation', safe(() => { const h = cardOf(tabCult, tabCult.stakes[0]), h2 = cardOf(tabMixed, tabMixed.stakes[0]); const head = x => (x.match(/<div class="cd-stake-head">[\s\S]*?<\/div>/) || [''])[0]; return [/ · cultivation stake · /.test(head(h)), tabCult.stakes[0].note === undefined, plusOff(h, mixS), plusOff(h, mixC), / · cultivation stake · /.test(head(h2))]; }), [true, true, true, false, false]);
check('  a mixed layout that reached the card anyway says why it is refused', safe(() => { const s = { id: 's_m', key: mixP.key, tier: 1, alloc: { [mixC]: 1, [mixS]: 1 }, procs: [] }; return /need separate stakes/.test(cardOf(tabCult, s)); }), true);
SAVED = {};
check('stake note says the stake burns (power plant + central hub), not just the power plants', [/power plant \+ central hub/.test(html), /power plants burn/.test(html)], [true, false]);
check('measure note does not claim only terrestrial or oceanic hubs give a trickle', /terrestrial or oceanic/.test(html), false);
STORE.s.tick = 8; const h8 = safe(() => { ct.render(); return ct.root.innerHTML; }); STORE.s.tick = 60; STORE.shipPrice = () => 0;
check('articles before numbers: "an 8 s tick", never "a 8 s tick"', [/an 8.0 s tick|an 8 s tick/.test(h8), /a 8(.0)? s tick/.test(h8)], [true, false]);
check('the measure box defaults to a T3 extractor (T1 gains ~1.3 units an hour)', ct.measure.tier, 3);

// ---- B3 / B6 / B8 / B2 on the Loadouts tab
console.log('-- B3 composition, B6 text, B8 bouts, cheapest fit');
const VsTab = window.DeckVsTab;
const mk = saved => { SAVED = { 'commandDeck.vs.v1': saved }; return new VsTab(root(), { loadout: LO, rc, research, app: null }); };
const cmdr = LO.ships.find(s => LO.classOf(s) === 7).name;
const fleetHtml = ships => { const t = mk({ fleet: { tier: 8, ships } }); return safe(() => { t.cards(t.rows()); return t.fleet(t.rows()); }); };
const hasWarn = h => (/fleet points used/.test(h) ? /composition limit/.test(h) : 'RENDER FAILED: ' + String(h).slice(0, 80));
check('fleet with 2 Titans warns (max 1)', hasWarn(fleetHtml([{ id: 'a', ship: titan, cfg: 'Default', n: 2 }])), true);
check('  1 Titan + 1 Commander: no warning (2 of 2)', hasWarn(fleetHtml([{ id: 'a', ship: titan, cfg: 'Default', n: 1 }, { id: 'b', ship: cmdr, cfg: 'Default', n: 1 }])), false);
check('  1 Titan + 2 Commanders warns (max 2 together)', hasWarn(fleetHtml([{ id: 'a', ship: titan, cfg: 'Default', n: 1 }, { id: 'b', ship: cmdr, cfg: 'Default', n: 2 }])), true);
const tf = mk({});
const fh = safe(() => { tf.cards(tf.rows()); return tf.fleet(tf.rows()); });
check('Fleet text: a Tier 8 cap of 312 holds 19 Taps or 8 IMPs', [/312 holds 19 Taps/.test(fh), /8 IMPs/.test(fh)], [true, true]);
check('  the old "five Taps ... cap of 84" sentence is gone', /cap of 84/.test(fh), false);
check('saved bouts 50 and 100 become 200, 500 stays', [50, 100, 200, 500].map(n => mk({ fights: n }).s.fights), [200, 200, 200, 500]);
const noteAll = ['haul', 'mine', 'scan', 'fight', 'fleet', 'cost'].map(k => safe(() => tf.note(k))).join(' ');
check('notes carry no release status ("v1", "v2") and no "units unstated"', [/\bv[12]\b/.test(noteAll), /unstated/.test(noteAll)], [false, false]);
check('planet exit fuel is labelled per SG', Loadout.HAUL_STATS.find(x => x[0] === 'planet_exit_fuel')[2], 'fuel per SG');
check('fleet note: "at most two Commanders and Titans together"', /at most two Commanders and Titans together/.test(noteAll), true);
check('scan text keeps the Toolkit claim with its source (cargo 3)', /cargo 3, the Toolkit/.test(safe(() => { const t = mk({ sub: 'scan' }); t.cards(t.rows()); return t.scan(t.rows()); })), true);
check('route sentence uses "an 11 AU route" before 11', /on an 11 AU route/.test(safe(() => { const t = mk({ d: 11, fleet: { tier: 3, ships: [{ id: 'a', ship: 'Armstrong IMP Tap', cfg: 'Default', n: 1 }] } }); t.cards(t.rows()); return t.fleet(t.rows()); })), true);
check('HAUL_STATS speeds are stated in AU/s', Loadout.HAUL_STATS.find(x => x[0] === 'warp_speed')[2], 'AU/s');
// cheapest fit ranks fully priced fits only
const tc = mk({});
const real = tc.lo.cost.bind(tc.lo); let n = 0;
tc.lo.cost = st => { const c = real(st); if (n++ === 0) return Object.assign({}, c, { unpriced: [{ name: 'X', cls: '', tier: '' }], rawUnits: 1 }); return c; };
const ch = safe(() => tc.cost(tc.rows()));
tc.lo.cost = real;
check('cheapest fit skips a configuration that is not fully priced (and says so)', [/>A · [^<]*<\/b> is the cheapest fit/.test(ch), /not fully priced, left out/.test(ch)], [false, true]);
check('  ... and names the priced one (B) instead', />B · [^<]*<\/b> is the cheapest fit/.test(ch), true);

// ---- the Loadouts rework (2026-10-26): every sub-tab leads with a verdict in words
console.log('-- Loadouts verdicts');
const tv = mk({ d: 10, mode: 'warp' }); tv.cards(tv.rows());
const vr = tv.rows(), trips = vr.map(r => Loadout.trip(r.st.mod, 10, 'warp')), ti = trips[0].perHour >= trips[1].perHour ? 0 : 1;
const hv = safe(() => tv.haul(vr)), hHead = (hv.match(/<h2>([\s\S]*?)<\/h2>/) || [])[1] || '';
check('haul verdict names the loadout with the most cargo an hour (re-derived from Loadout.trip)', new RegExp('>' + 'AB'[ti] + ' · ').test(hHead), true);
check('  ... with its cargo an hour figure', (trips[ti].perHour >= 1e4 && trips[ti].perHour < 1e6 ? hHead.includes(`<b>${window.DeckUI.num(trips[ti].perHour / 1e3, 0)} k</b>`) : 'out of the k band: ' + trips[ti].perHour), true);
check('haul draws ONE chart; the toggle switches it to fuel per unit', [(hv.match(/<svg /g) || []).length, /Cargo delivered an hour/.test(hv), safe(() => { tv.s.chart.haul = 'fuel'; const h = tv.haul(vr); tv.s.chart.haul = 'cargo'; return /Fuel burned per cargo unit/.test(h) && !/Cargo delivered an hour/.test(h); })], [1, true, true]);
check('stats, flips and method sit in folds, closed by default', ['stats', 'flips', 'how'].map(k => new RegExp(`<details class="cd-fold" data-fold="${k}">`).test(hv)), [true, true, true]);
const sv = safe(() => tv.scan(vr));
check('scan: two loadouts that scan alike say so instead of naming a winner', [/They scan the same/.test(sv), /scans the most/.test(sv)], [true, false]);
const over = fleetHtml([{ id: 'a', ship: 'Armstrong IMP Tap', cfg: 'Default', n: 30 }]);
check('fleet over the cap says by how much in the verdict', /<h2><b>480<\/b> of 312 fleet points used - <b class="bad">168 over the cap<\/b>/.test(over), true);
check('  an empty fleet shows no verdict, a fleet of one does (positive twin)', [/cd-verdict/.test(fh), /cd-verdict/.test(fleetHtml([{ id: 'a', ship: 'Armstrong IMP Tap', cfg: 'Default', n: 1 }]))], [false, true]);

// ---- reviewer findings 2026-10-26: ties at the top, lead changes vs pairwise swaps, bare hull cost, fight even rule
console.log('-- Loadouts verdicts: ties and duplicates');
const head = h => (String(h).match(/<h2>([\s\S]*?)<\/h2>/) || [])[1] || 'NO VERDICT: ' + String(h).slice(0, 60);
const dup = mk({ d: 10, mode: 'warp', loadouts: [{ ship: 'Armstrong IMP Tap', cfg: 'Cargo Boost Max' }, { ship: 'Armstrong IMP Tap', cfg: 'Cargo Boost Max' }, { ship: 'Armstrong IMP Tap', cfg: 'Fast Freight Max' }] }); dup.cards(dup.rows());
// 2026-11-19: which of Cargo Boost Max / Fast Freight Max leads moves with the drone rule (Fast Freight now hauls and
// mines more at 10 AU), so the twin pair is the LEADER per metric, picked by Loadout.trip / mine / cost directly (not by
// the tab under test): [X, X, other] where X leads that metric; the tab must call A and B a tie.
const T2 = ['Cargo Boost Max', 'Fast Freight Max'], stT = c => LO.stats('Armstrong IMP Tap', c);
const lead2 = (f, better) => { const v = T2.map(c => f(stT(c))); return better(v[0], v[1]) ? 0 : 1; };
const twin = i => mk({ d: 10, mode: 'warp', loadouts: [T2[i], T2[i], T2[1 - i]].map(cfg => ({ ship: 'Armstrong IMP Tap', cfg })) });
const tH = twin(lead2(s => Loadout.trip(s.mod, 10, 'warp').perHour, (a, b) => a >= b)), tM = twin(lead2(s => Loadout.mine(s.mod, 10, 'warp', 1).perHour, (a, b) => a >= b)), tC = twin(lead2(s => LO.cost(s).rawUnits, (a, b) => a <= b));
[tH, tM, tC].forEach(t => t.cards(t.rows()));
const dh = head(safe(() => tH.haul(tH.rows()))), dm = head(safe(() => tM.mine(tM.rows()))), dc = head(safe(() => tC.cost(tC.rows())));
check('A = B at the top: haul, mine and cost say they tie (never "1× B" or "0 % less")' + RF,[/A · [^<]*<\/b> and <b[^>]*>B · [^<]*<\/b> tie for the most cargo/.test(dh), /tie for the most ore/.test(dm), /tie for the cheapest fit/.test(dc), /1× B|0 % less/.test(dh + dm + dc)], [true, true, true, false]);
// lead changes counted independently: argmax over 4,000 log-spaced lengths, a tie keeps the leader
const leadCount = (rows, f) => { let cur = null, n = 0; for (let i = 0; i <= 4000; i++) { const x = 0.5 * Math.pow(120, i / 4000), v = rows.map(r => f(r.st.mod, x)), m = Math.max(...v), L = rows.filter((r, j) => Math.abs(v[j] - m) <= 1e-9 * Math.max(1, m)); if (cur && L.includes(cur)) continue; if (cur) n++; cur = L[0]; } return n; };
const dupLead = leadCount(dup.rows(), (st, x) => Loadout.trip(st, x, 'warp').perHour);
const said = +((safe(() => dup.haul(dup.rows())).match(/changes hands <b>(\d+)<\/b>/) || [])[1]);
check('haul "lead changes hands N times" = an independent argmax count, not the pairwise swaps', [said, said === dupLead, dupLead > 0], [dupLead, true, true]);
const bare = mk({ loadouts: [{ ship: 'Busan Pulse', cfg: 'Default' }, { ship: 'Armstrong IMP Tap', cfg: 'Cargo Boost Max' }] }); bare.cards(bare.rows());
const bc = safe(() => bare.cost(bare.rows()));
check('a bare hull (nothing fitted) is the cheapest fit at 0, not "not fully priced"', [/>A · [^<]*<\/b> is the cheapest fit: nothing fitted/.test(head(bc)), /not fully priced/.test(bc)], [true, false]);
const tri = mk({ fights: 200, loadouts: [{ ship: 'Armstrong IMP Tap', cfg: 'Default' }, { ship: 'Armstrong IMP Tap', cfg: 'Default' }, { ship: 'Armstrong IMP Tap', cfg: 'Default' }] }); tri.cards(tri.rows());
// owner 2026-10-26: "VZUS ballad vs IMP Tap shows nothing in Where the ranking flips" - correct (the ballad hauls
// more at every length, the Tap mines more), so the empty fold is hidden and the verdict says the lead holds
const bal = (mode, sub) => { const t = mk({ d: 10, mode, loadouts: [{ ship: 'VZUS ballad', cfg: 'Default' }, { ship: 'Armstrong IMP Tap', cfg: 'Default' }] }); t.cards(t.rows()); return safe(() => t[sub](t.rows())); };
const balHaul = bal('warp', 'haul'), balMineSub = bal('subwarp', 'mine');
check('ballad vs Tap, warp haul: no flips fold, the verdict says the lead holds; subwarp mine (1 real flip) keeps its fold', [/data-fold="flips"/.test(balHaul), /lead on cargo an hour holds at every length/.test(balHaul), /data-fold="flips"/.test(balMineSub), /changes hands <b>1<\/b> time/.test(balMineSub)], [false, true, true, true]);
check('fight: three identical loadouts give "No clear winner", never a winner over its own twin', [/No clear winner/.test(head(safe(() => tri.fight(tri.rows())))), /wins most often/.test(head(safe(() => tri.fight(tri.rows()))))], [true, false]);

console.log(`\n${pass} PASS, ${fail} FAIL, ${pend} PENDING${oldArg ? ' (run against ' + SRC + ': failures are expected)' : ''}`);
process.exit(fail ? 1 : 0);
