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
load('ResourcesExplorer/resource-model.js'); load('RecipeExplorer/recipe-model.js'); load('HubExplorer/hub-model.js'); load('CommandDeck/deck-model.js');
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

// ---- B2: unpriced fits
console.log('-- B2 unpriced fits');
const KDM = LO.cost(LO.stats('Pearce X4', 'Kinetic Damage Max'));
check('Pearce X4 Kinetic Damage Max: 0 unpriced components', KDM.unpriced.length, 0);
check('  its weapon is the exact recipe from the component data: 4 x Kinetic Rapidfire XXS T5, nothing assumed', KDM.recipes.filter(r => /^Kinetic /.test(r.name)).map(r => [r.name, r.qty, r.assumed]), [['Kinetic Rapidfire XXS T5', 4, '']]);
check('  raw units of the whole fit', KDM.rawUnits, v => Math.abs(v - 10335) < 1);
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
check('"Compare against" lists the three Miner-spec hulls only', refOpts.length, 3);
STORE.s.calc.ref = 'Busan The Last Stand mk. VIII';
check('  a saved non-miner falls back to the Tap', safe(() => ct.compute().ref.name), 'Armstrong IMP Tap');
STORE.s.calc.ref = 'Armstrong IMP Tap';
const pt = safe(() => ct.planetTypes('copper-ore', 1));
check('measure tick: Terrestrial hub adds a 0.002 a tick passive on Copper Ore, Barren adds none', safe(() => [pt.get('Terrestrial'), pt.get('Barren')]), [0.002, 0]);
const allFuel = []; ct.raws.forEach(r => [1, 2, 3, 4, 5].forEach(t => { const f = se.fullStake(t, r.id); if (f && ct.stakeFuel(f, r.id).fuel == null) allFuel.push(r.id + ' T' + t); }));
check('stake fuel is found for every raw at every tier (strontium-crystals, titanium-ore included)', allFuel, []);
check('  strontium-crystals T5 stake burns fuel', safe(() => ct.stakeFuel(se.fullStake(5, 'strontium-crystals'), 'strontium-crystals').fuel), v => v > 0);
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
check('cheapest fit skips a configuration that is not fully priced (and says so)', [/cheapest fit in raw units: 1 /.test(ch), /not fully priced, left out/.test(ch)], [false, true]);

console.log(`\n${pass} PASS, ${fail} FAIL${oldArg ? ' (run against ' + SRC + ': failures are expected)' : ''}`);
process.exit(fail ? 1 : 0);
