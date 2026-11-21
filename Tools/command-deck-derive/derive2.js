// derive2.js - INDEPENDENT re-derivation of the loadout suite's re-pinned values from the raw export (no hub code):
//   KDM_RAW_UNITS : Pearce X4 'Kinetic Damage Max' - the fit's component recipes expanded to raw units over recipes.json
//                   (ingredients by NAME, best c4_status per name; a recipe makes 1 per craft - recipes.json has no output
//                   quantity field; the recipe list of the fit is passed in as the subject list, see FIT below)
//   HUB_PASSIVE   : the T1 central hub's resourceExtractionRate['copper-ore'] per planet type that holds Copper Ore on a
//                   stakeable (non-belt) body - the passive the Measure-your-tick panel adds (owner rule 2026-10-03)
'use strict';
const H = require('path').join(__dirname, '..', '..', 'JSON') + '/';
const RJ = require(H + 'recipes.json'), BJ = require(H + 'buildings.json'), PJ = require(H + 'planets.json');
const RECIPES = Array.isArray(RJ) ? RJ : RJ.recipes, BLD = Array.isArray(BJ) ? BJ : BJ.buildings;
const out = (k, v) => console.log(k + '=' + JSON.stringify(v));
const RANK = { v1: 0, 'v1-add': 1, v2: 2 };
const byName = new Map(); RECIPES.forEach(r => { const c = byName.get(r.outputName); if (!c || (RANK[r.c4_status] ?? 3) < (RANK[c.c4_status] ?? 3)) byName.set(r.outputName, r); });
out('OUTPUT_QTY_FIELDS', Object.keys(RECIPES[0]).filter(k => /qty|quant|yield|amount/i.test(k)));
const raws = new Map();
const expand = (name, q, depth) => { const r = byName.get(name); if (depth > 60) throw new Error('cycle at ' + name); if (!r || !(r.ingredients || []).length || /^BASIC/.test(r.outputType)) { raws.set(name, (raws.get(name) || 0) + q); return; } r.ingredients.forEach(i => expand(i.name, q * i.quantity, depth + 1)); };
// FIT: the recipe list of the fit as the deck prices it (subject list only; printed by q6.js from LO.cost) - the units are
// computed here
// Default = Pearce X4 'Kinetic Damage Max' (the nine recipes the deck prices for it); pass another list as argv[2] (JSON).
const FIT_X4_KDM = [['Power Core XXS T5', 1], ['Warp Drive XXS T5', 1], ['Subwarp Engine XXS T5', 1], ['Maneuvering Thrusters XXS T5', 1], ['Shield Generator XXS T5', 1], ['Hull Reinforcement XXS T5', 1], ['Heat Sink XXS T5', 1], ['Ammo XXS T5', 1], ['Kinetic Rapidfire XXS T5', 4]];
const FIT = process.argv[2] ? JSON.parse(process.argv[2]) : FIT_X4_KDM;
FIT.forEach(([name, qty]) => expand(name, qty, 0));
out('KDM_RAW_KINDS', raws.size);
out('KDM_RAW_UNITS', Array.from(raws.values()).reduce((a, v) => a + v, 0));
// hub passive per planet type (planet type id -> name as the hub's buildings spell it)
const TYPE = ['terrestrial', 'volcanic', 'barren', 'asteroid-belt', 'gas-giant', 'ice-giant', 'dark', 'oceanic'];
const typesWithCopper = new Set(); PJ.mapData.forEach(s => s.planets.forEach(p => { if ((p.resources || []).some(q => q.name === 'Copper Ore') && p.type % 8 !== 3) typesWithCopper.add(TYPE[p.type % 8]); }));
out('COPPER_STAKE_TYPES', Array.from(typesWithCopper).sort());
out('HUB_PASSIVE', Object.fromEntries(Array.from(typesWithCopper).sort().map(t => [t, ((BLD.find(b => b.id === t + '-central-hub-t1') || {}).resourceExtractionRate || {})['copper-ore'] || 0])));
