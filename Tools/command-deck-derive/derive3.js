// derive3.js - INDEPENDENT re-derivation (no hub code) of a fitted stat multiplier for an Armstrong IMP Tap configuration,
// from JSON/Ships/<tap>.json (the configuration's component ids, one id per physical unit), JSON/ship-components*.json
// (id -> category / type / class / tier) and JSON/ship-formulas.json (per-component stat values).
// Rule implemented (linear stacking, as the hub's calculator is run): multiplier = 1 + sum over every listed unit of
// (value - 1), value = values["<class>-<tier>"] if present, else values.base, else multiplicativeValue. Additive stats
// add `additiveValue`. Prints, per config and stat: the multiplier with every unit counted, and with each drone port
// counted ONCE (the pre-2026-11-12 reading), so the two readings sit side by side.
'use strict';
const fs = require('fs'), H = require('path').join(__dirname, '..', '..', 'JSON') + '/';
const F = require(H + 'ship-formulas.json'), CA = F.componentAttributes || F;
const shipFile = fs.readdirSync(H + 'Ships').find(f => /Armstrong_IMP_Tap/.test(f));
const SHIP = require(H + 'Ships/' + shipFile);
const tree = []; require(H + 'ship-components.json').parts.forEach(p => { const c = require(H + p).components || {}; (c.rewardTree || []).forEach(r => tree.push(r)); (c.allComponents || []).forEach(r => tree.push(r)); });
const byId = new Map();
const walk = (node, ctx) => { if (!node) return; const p = node.properties || {}; const c = { category: p.Category || ctx.category, type: p['Ship Component'] || p['Ship Module'] || p['Ship Modules'] || p['Damage Type'] || p['Countermeasure'] || p['Missiles'] || p['Drone Type'] || p['Drones'] || ctx.type, cls: p.Class || ctx.cls, tier: p.Tier || ctx.tier }; if (node.id != null) byId.set(String(node.id), Object.assign({ name: node.name }, c)); (node.children || []).forEach(ch => walk(ch, c)); };
(Array.isArray(tree) ? tree : [tree]).forEach(r => walk(r, {}));
const out = (k, v) => console.log(k + '=' + JSON.stringify(v));
out('COMPONENTS_RESOLVED', byId.size);
const cfgOf = name => SHIP.configurations.find(c => c.name === name);
const attr = (u, stat) => { const cat = CA[u.category] || CA[u.category === 'Ship Modules' ? 'Ship Module' : u.category] || {}; const a = (cat[u.type] || {})[stat]; if (!a || !a.values || (!Object.keys(a.values).length && a.multiplicativeValue == null && !a.additiveValue)) return null; const key = `${u.cls}-${u.tier}`; const v = a.values[key] != null ? a.values[key] : a.values.base != null ? a.values.base : a.multiplicativeValue; return { type: a.type, v, add: a.additiveValue || 0 }; };
const mult = (cfgName, stat, dronesOnce) => {
    const cfg = cfgOf(cfgName); let m = 1, add = 0; const used = [];
    Object.entries(cfg.components || {}).forEach(([cat, types]) => Object.entries(types || {}).forEach(([type, v]) => {
        let ids = Array.isArray(v) ? v : ((v && v.items) || []); if (dronesOnce && /Drone/.test(cat)) ids = ids.slice(0, 1);
        ids.forEach(id => { const u = byId.get(String(id)); if (!u) { used.push('unresolved ' + id); return; } const a = attr(u, stat); if (!a) return; if (a.type === 'additive') add += a.add || a.v; else m += (a.v - 1); add += a.type === 'additive' ? 0 : a.add; used.push(`${u.type} ${u.cls || ''}-${u.tier || ''}`); });
    }));
    return { m: +m.toFixed(6), add, used: used.length };
};
[['Cargo Boost Max', 'cargo_capacity'], ['Fast Freight Max', 'cargo_capacity'], ['Cargo Boost Max', 'warp_speed'], ['Mining Max', 'asteroid_mining_rate'], ['Scanning Max', 'scan_cost'], ['Scanning Max', 'sduPerScan'], ['Scanning Max', 'scan_cool_down']].forEach(([c, s]) => {
    out(`MULT ${c} ${s}`, { everyUnit: mult(c, s, false), dronePortOnce: mult(c, s, true) });
});
out('DRONE_PORTS', ['Cargo Boost Max', 'Fast Freight Max', 'Mining Max', 'Scanning Max'].map(c => [c, Object.entries(cfgOf(c).components.Drones || {}).map(([t, v]) => [t, (Array.isArray(v) ? v : v.items).length])]));
