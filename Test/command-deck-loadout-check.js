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
check('  Mining Max fits the Tap to 27.54 / s (Loadouts engine; the research skill records 27.54)', safe(() => ctL.fitted('Armstrong IMP Tap', 'Mining Max').rate), v => near(v, 27.54, 0.01));
check('  an unknown config name falls back to Default', safe(() => ctL.fitted('Armstrong IMP Tap', 'No Such Fit').cfg), 'Default');
check('  the Tap offers its 48 configurations', safe(() => ctL.fitted('Armstrong IMP Tap', 'Default').cfgs.length), 48);
STORE.s.calc.cfg = 'Mining Max';
check('  compute() uses the saved config: the verdict hull mines 27.54 / s', safe(() => ctL.compute().ref.rate), v => near(v, 27.54, 0.01));
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
const dh = head(safe(() => dup.haul(dup.rows()))), dm = head(safe(() => dup.mine(dup.rows()))), dc = head(safe(() => dup.cost(dup.rows())));
check('A = B at the top: haul, mine and cost say they tie (never "1× B" or "0 % less")', [/A · [^<]*<\/b> and <b[^>]*>B · [^<]*<\/b> tie for the most cargo/.test(dh), /tie for the most ore/.test(dm), /tie for the cheapest fit/.test(dc), /1× B|0 % less/.test(dh + dm + dc)], [true, true, true, false]);
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

console.log(`\n${pass} PASS, ${fail} FAIL${oldArg ? ' (run against ' + SRC + ': failures are expected)' : ''}`);
process.exit(fail ? 1 : 0);
