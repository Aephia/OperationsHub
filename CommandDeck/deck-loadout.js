// deck-loadout.js - Command Deck, the Loadout engine (2026-10-05). A LOADOUT is a hull plus one of its configurations
// (Data/ships-data.js `configurations`, 48 per hull). The Ship Explorer's ShipConfigCalculator (ShipExplorer/
// config-calculator.js with Data/ship-components-data.js + Data/ship-formulas-data.js) turns the fitted components into
// modified stats; this engine works on the FLAT stat row of each hull (Data/combat-data.js `allShips`, 74 snake_case
// keys - the keys the calculator modifies and the keys the export's combat formula reads) and answers five questions:
//   stats    the fitted row: base, modified, multiplier per stat, the fitted components
//   trip     hauling: one round trip of d map units (jumps, times, fuel) and cargo delivered an hour
//   mine     mining: fill the hold at the rate x richness, haul it d units, repeat - ore delivered an hour, food and
//            fuel per unit, crew
//   fight    combat: the export's own combat formula (shipConfigurations.combatFormula, a JavaScript IIFE) run
//            headless N times with the first striker alternating - win share and mean rounds
//   cost     what the configuration's components cost to craft: each component -> its recipe by name -> the Recipe
//            Explorer's expansion to raws
//   points   fleet points of the hull's class (globalCombatConfig.fleet_points) for the fleet cap
// Units: the export's travel units are unstated (map units per second, fuel per map unit), so every figure here is a
// COMPARISON between loadouts under one reading. The combat formula is stochastic (hit rolls); N fights give a share.
(function () {
    'use strict';

    const CLASS_TOKEN = { 1: 'XXS', 2: 'XS', 3: 'S', 4: 'M', 5: 'L', 6: 'CAP', 7: 'CMD', 8: 'CLASS8', 9: 'TTN' };
    const CLASS_NAME = { 1: 'XXSmall', 2: 'XSmall', 3: 'Small', 4: 'Medium', 5: 'Large', 6: 'Capital', 7: 'Commander', 8: 'Class 8', 9: 'Titan' };
    const RECIPE_CLASS = { XXXS: 'XXXS', XXS: 'XXS', XS: 'XS', S: 'S', M: 'M', L: 'L', CAP: 'CAP', CMD: 'CMD', 'Class 8': 'CLASS8', TTN: 'TTN' };
    const MODULE_ALIAS = { 'Cargo Module': 'Cargo', 'Fuel Module': 'Fuel', 'Ammo Module': 'Ammo', 'Passenger Module': 'Passenger' };
    // the stats shown on each sub-tab: [key, label, unit, lowerIsBetter]
    const HAUL_STATS = [
        ['cargo_capacity', 'Hold', 'cargo units', false], ['fuel_capacity', 'Tank', 'fuel', false],
        ['warp_speed', 'Warp speed', 'units/s', false], ['max_warp_distance', 'Warp range', 'units per jump', false],
        ['warp_spool_time', 'Spool', 's', true], ['warp_cool_down', 'Cooldown', 's', true], ['warp_fuel_consumption', 'Warp fuel', 'per unit', true],
        ['subwarp_speed', 'Subwarp speed', 'units/s', false], ['subwarp_fuel_consumption', 'Subwarp fuel', 'per unit', true],
        ['planet_exit_fuel', 'Planet exit', 'fuel', true], ['loading_rate', 'Loading', 'units/s', false]
    ];
    const MINE_STATS = [
        ['asteroid_mining_rate', 'Mining rate', 'units/s', false], ['asteroid_mining_food_rate', 'Food while mining', 'per s', true],
        ['asteroid_mining_ammo_rate', 'Ammo while mining', 'per s', true], ['cargo_capacity', 'Hold', 'cargo units', false],
        ['required_crew', 'Crew', '', true], ['warp_speed', 'Warp speed', 'units/s', false], ['max_warp_distance', 'Warp range', 'units', false],
        ['warp_fuel_consumption', 'Warp fuel', 'per unit', true], ['loading_rate', 'Loading', 'units/s', false]
    ];
    const SCAN_STATS = [
        ['scan_power', 'Scan power', 'result multiplier', false], ['sduPerScan', 'SDU per scan', '', false], ['scan_cool_down', 'Scan cooldown', 's', true],
        ['scan_cost', 'Scan cost', 'tokens', true], ['required_crew', 'Crew', '', true], ['cargo_capacity', 'Hold', 'cargo units', false],
        ['subwarp_speed', 'Subwarp speed', 'units/s', false], ['max_warp_distance', 'Warp range', 'units', false], ['stealth_power', 'Stealth', '', false]
    ];
    const FIGHT_STATS = [
        ['hit_points', 'Hull', 'HP', false], ['shield_points', 'Shields', 'SP', false], ['shield_recharge_rate', 'Shield recharge', '/s', false],
        ['damage', 'Damage', 'per hit', false], ['damage_range', 'Range', '', false], ['hit_chance', 'Hit chance', '', false],
        ['crit_chance', 'Crit chance', '', false], ['crit_multiplier', 'Crit x', '', false], ['damage_kinetic', 'Kinetic', '', false],
        ['damage_energy', 'Energy', '', false], ['damage_emp', 'EMP', '', false], ['missile_power', 'Missile power', '', false],
        ['missile_capacity', 'Missiles', '', false], ['counter_flare', 'Flares', '', false], ['counter_decoy', 'Decoys', '', false],
        ['stealth_power', 'Stealth', '', false], ['repair_rate', 'Repair rate', '/s', false], ['ammo_capacity', 'Ammo', '', false], ['required_crew', 'Crew', '', true]
    ];

    class Loadout {
        // ships: hub ships (for configurations, names, size); components / formulas / Calc: the calculator's inputs;
        // combat: Data/combat-data.js; recipeModel: the Recipe Explorer's (for costs)
        constructor(ships, components, formulas, Calc, combat, recipeModel) {
            this.combat = combat || null; this.rc = recipeModel || null;
            const rows = new Map(((combat && combat.allShips) || []).map(r => [r['Ship Name'], r]));
            this.ships = (ships || []).filter(s => rows.has(s.name) || (s.stats && s.stats.capacities)).map(s => Object.assign({}, s, { row: rows.get(s.name) || Loadout.flatten(s) }));
            this.ships = this.ships.filter(s => s.row && s.row.cargo_capacity > 0 && (s.row.warp_speed > 0 || s.row.subwarp_speed > 0));
            this.byName = new Map(this.ships.map(s => [s.name, s]));
            // every numeric key of the flat row is a stat the calculator may modify
            const keys = new Set(); this.ships.forEach(s => Object.entries(s.row).forEach(([k, v]) => { if (typeof v === 'number' && !['id', 'Class', 'ship_size_value', 'lp_value'].includes(k)) keys.add(k); }));
            this.statKeys = Array.from(keys);
            this.calc = null; this.componentsById = {};
            if (Calc && components && formulas) {
                const tree = components.components && components.components.rewardTree ? components.components.rewardTree : (components.components || []);
                const walk = (node, ctx) => {        // the Ship Explorer's component lookup (app.js buildComponentLookup), repeated here
                    if (!node) return;
                    const p = node.properties || {};
                    const category = p.Category || ctx.category || null;
                    const componentType = p['Ship Component'] || p['Ship Modules'] || p['Damage Type'] || p['Countermeasure'] || p['Missiles'] || p['Drone Type'] || p['Drones'] || ctx.componentType || null;
                    const className = p.Class || ctx.className || null, tierName = p.Tier || ctx.tierName || null;
                    if (node.id != null) this.componentsById[String(node.id)] = { id: node.id, name: node.name || componentType || `Component ${node.id}`, properties: p, category, componentType, className, tierName };
                    (node.children || []).forEach(ch => walk(ch, { category, componentType, className, tierName }));
                };
                tree.forEach(r => walk(r, {}));
                const statPathMap = {}; this.statKeys.forEach(k => { statPathMap[k] = [k]; });
                this.calc = new Calc({ multiplierStackingMode: 'linear' });
                this.calc.setData({ componentsById: this.componentsById, componentAttributes: formulas.componentAttributes || {}, classScalingFormulas: formulas.classScalingFormulas || {}, tierScalingFormulas: formulas.tierScalingFormulas || {}, statPathMap, statKeys: this.statKeys });
            }
            this._cache = new Map(); this._fight = null;
            this.points = new Map(((combat && combat.fleetPoints && combat.fleetPoints.classes) || []).map(c => [c.size, c]));
        }
        // a flat row from the hub's nested stats, for a hull the combat bundle does not list
        static flatten(s) {
            const t = s.stats || {}, c = t.capacities || {}, m = t.mining || {}, v = t.travel || {}, k = t.combat || {}, d = t.damageTypes || {}, r = t.repair || {}, sc = t.scanning || {};
            const out = { 'Ship Name': s.name, Class: s.class, ship_size: s.shipSize, required_crew: (s.crew && s.crew.required) || 0, cargo_capacity: c.cargoCapacity || 0, fuel_capacity: c.fuelCapacity || 0, ammo_capacity: c.ammoCapacity || 0, asteroid_mining_rate: m.asteroidMiningRate || 0, asteroid_mining_food_rate: m.asteroidMiningFoodRate || 0, asteroid_mining_ammo_rate: m.asteroidMiningAmmoRate || 0, scan_power: sc.scanPower || 0, repair_rate: r.repairRate || 0, repair_ability: r.repairAbility || 0, repair_efficiency: r.repairEfficiency || 0 };
            Object.entries(v).forEach(([a, b]) => { out[a.replace(/[A-Z]/g, ch => '_' + ch.toLowerCase())] = b; });
            Object.entries(k).forEach(([a, b]) => { out[a.replace(/[A-Z]/g, ch => '_' + ch.toLowerCase())] = b; });
            Object.entries(d).forEach(([a, b]) => { out['damage_' + a] = b; });
            Object.entries((t.defense && t.defense.counters) || {}).forEach(([a, b]) => { out['counter_' + a.replace(/[A-Z]/g, ch => '_' + ch.toLowerCase())] = b; });
            return out;
        }
        configsOf(shipName) { const s = this.byName.get(shipName); return s ? (s.configurations || []).map(c => c.name) : []; }
        classOf(ship) { return ship.row.Class || ship.class || 0; }
        pointsOf(ship) { const p = this.points.get(this.classOf(ship)); return p ? p.combat_points : null; }

        // ---- the fitted row
        stats(shipName, cfgName) {
            const key = shipName + '\u0000' + (cfgName || 'Default');
            if (this._cache.has(key)) return this._cache.get(key);
            const ship = this.byName.get(shipName); if (!ship) return null;
            const cfg = (ship.configurations || []).find(c => c.name === cfgName) || null;
            const base = Object.assign({}, ship.row), mod = Object.assign({}, ship.row), mult = {};
            this.statKeys.forEach(k => { mult[k] = 1; });
            if (cfg && this.calc) {
                const r = this.calc.calculateModifiedStats(ship.row, cfg);
                this.statKeys.forEach(k => { const d = r.details[k]; if (d && d.modifiedValue != null) { mod[k] = d.modifiedValue; mult[k] = base[k] ? d.modifiedValue / base[k] : 1; } });
            }
            const items = [];
            if (cfg) Object.entries(cfg.components || {}).forEach(([cat, types]) => Object.entries(types || {}).forEach(([type, v]) => { (v && v.items || []).forEach(id => { const c = this.componentsById[String(id)] || {}; items.push({ id, category: cat, type, name: c.name || type, cls: c.className || '', tier: c.tierName || '' }); }); }));
            const fit = new Map(); items.forEach(it => { const k = `${it.name}|${it.cls}|${it.tier}`; const f = fit.get(k) || { name: it.name, type: it.type, category: it.category, cls: it.cls, tier: it.tier, n: 0 }; f.n++; fit.set(k, f); });
            const out = { ship, cfg, name: cfgName || 'Default', label: `${ship.name} · ${cfgName || 'Default'}`, size: CLASS_NAME[this.classOf(ship)] || ship.sizeTier, cls: this.classOf(ship), points: this.pointsOf(ship), base, mod, mult, fit: Array.from(fit.values()), slots: cfg ? `${cfg.summary.totalFilled}/${cfg.summary.totalSlots}` : '0/0' };
            this._cache.set(key, out);
            return out;
        }

        // ---- hauling: one round trip of d units for a stat row
        static trip(st, d, mode) {
            const warpable = mode !== 'subwarp' && st.max_warp_distance > 0 && st.warp_speed > 0;
            let jumps = 0, fly, fuelLeg;
            if (warpable) { jumps = d === 0 ? 0 : Math.ceil(d / st.max_warp_distance - 1e-9); fly = jumps * (st.warp_spool_time || 0) + d / st.warp_speed + Math.max(0, jumps - 1) * (st.warp_cool_down || 0); fuelLeg = (st.warp_fuel_consumption || 0) * d; }
            else { if (!(st.subwarp_speed > 0)) return null; fly = d / st.subwarp_speed; fuelLeg = (st.subwarp_fuel_consumption || 0) * d; }
            const load = st.loading_rate > 0 ? st.cargo_capacity / st.loading_rate : 0;
            const time = 2 * fly + 2 * load + (warpable && jumps > 0 ? (st.warp_cool_down || 0) : 0);
            const fuel = 2 * fuelLeg + (st.planet_exit_fuel || 0);
            return { mode: warpable ? 'warp' : 'subwarp', jumps, oneWay: fly, load, time, fuel, perHour: time > 0 ? st.cargo_capacity * 3600 / time : 0, fuelPerUnit: st.cargo_capacity > 0 ? fuel / st.cargo_capacity : Infinity, tripsPerTank: fuel > 0 ? st.fuel_capacity / fuel : Infinity, tankOk: fuel <= st.fuel_capacity };
        }
        // distances where A's cargo an hour overtakes B's or vice versa
        static crossovers(stA, stB, mode, dmin, dmax, metric) {
            const f = d => { const a = Loadout.trip(stA, d, mode), b = Loadout.trip(stB, d, mode); return a && b ? (metric ? metric(a, stA, d) - metric(b, stB, d) : a.perHour - b.perHour) : NaN; };
            const out = []; const N = 600; let prevD = dmin, prevV = f(dmin);
            for (let i = 1; i <= N; i++) {
                const d = dmin * Math.pow(dmax / dmin, i / N), v = f(d);
                if (isFinite(prevV) && isFinite(v) && Math.sign(prevV) !== Math.sign(v) && prevV !== 0) { let lo = prevD, hi = d; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (Math.sign(f(m)) === Math.sign(prevV)) lo = m; else hi = m; } out.push({ d: (lo + hi) / 2, winnerAfter: v > 0 ? 'A' : 'B' }); }
                prevD = d; prevV = v;
            }
            return out;
        }

        // ---- mining: fill the hold at rate x richness, haul it d units to the drop-off, come back, repeat
        static mine(st, d, mode, richness) {
            const rate = (st.asteroid_mining_rate || 0) * (richness || 1);
            if (!(rate > 0)) return null;
            const trip = Loadout.trip(st, d, mode); if (!trip) return null;
            const fill = st.cargo_capacity / rate;
            const cycle = fill + trip.time;
            const food = (st.asteroid_mining_food_rate || 0) * fill, ammo = (st.asteroid_mining_ammo_rate || 0) * fill;
            return { rate, fill, trip, cycle, perHour: st.cargo_capacity * 3600 / cycle, miningShare: fill / cycle, food, ammo, fuel: trip.fuel, foodPerUnit: food / st.cargo_capacity, fuelPerUnit: trip.fuel / st.cargo_capacity, perCrewHour: st.required_crew > 0 ? st.cargo_capacity * 3600 / cycle / st.required_crew : null };
        }

        // ---- scanning: one scan every cooldown; SDU and tokens per hour follow. scan_power is "a multiplier for scan
        // results" in the export's own words - shown, not applied, because what it multiplies is not stated
        static scan(st) {
            if (!(st.scan_cool_down > 0) || !(st.sduPerScan > 0)) return null;
            const perHour = 3600 / st.scan_cool_down;
            return { scansPerHour: perHour, sduPerHour: st.sduPerScan * perHour, tokensPerHour: (st.scan_cost || 0) * perHour, sduPerToken: st.scan_cost > 0 ? st.sduPerScan / st.scan_cost : Infinity, sduPerCrewHour: st.required_crew > 0 ? st.sduPerScan * perHour / st.required_crew : null, power: st.scan_power || 0 };
        }

        // ---- combat: the export's formula, N fights, first striker alternating
        fightFn() {
            if (this._fight !== null) return this._fight;
            const src = this.combat && this.combat.combatFormula;
            if (!src) return (this._fight = false);
            try {
                const body = src.trim().replace(/^\(function\s*\(\)\s*\{/, '').replace(/\}\)\(\)\s*;?$/, '');
                this._fight = new Function('left', 'right', 'window', 'document', 'console', body);
            } catch (e) { this._fight = false; }
            return this._fight;
        }
        fight(stA, stB, n) {
            const fn = this.fightFn(); if (!fn) return null;
            const N = n || 100, out = { a: 0, b: 0, draw: 0, rounds: 0, n: N, roundsA: 0, roundsB: 0 };
            const quiet = { log() { }, warn() { }, error() { } };
            for (let i = 0; i < N; i++) {
                const W = { combatResultsStyleAdded: true, combatFirstStriker: i % 2 ? 'right' : 'left' };
                let html = ''; try { html = fn(stA, stB, W, null, quiet); } catch (e) { out.error = e.message; break; }
                const text = html.replace(/<[^>]+>/g, ' ');
                const m = /(LEFT WINS|RIGHT WINS|MUTUAL DESTRUCTION|STALEMATE|DRAW)[^\d]{0,60}?(\d+)\s*Rounds?/i.exec(text) || /(LEFT WINS|RIGHT WINS|MUTUAL DESTRUCTION|STALEMATE|DRAW)/i.exec(text);
                const r = m ? m[1].toUpperCase() : 'DRAW', rounds = m && m[2] ? +m[2] : 0;
                if (r === 'LEFT WINS') { out.a++; out.roundsA += rounds; } else if (r === 'RIGHT WINS') { out.b++; out.roundsB += rounds; } else out.draw++;
                out.rounds += rounds;
            }
            const done = out.a + out.b + out.draw || 1;
            return Object.assign(out, { pA: out.a / done, pB: out.b / done, pDraw: out.draw / done, meanRounds: out.rounds / done, meanRoundsA: out.a ? out.roundsA / out.a : null, meanRoundsB: out.b ? out.roundsB / out.b : null });
        }

        // ---- cost: the configuration's components as recipes and raws
        cost(st) {
            const out = { recipes: [], unpriced: [], raws: new Map(), crafts: 0, found: 0 };
            if (!this.rc || !st) return out;
            const items = [];
            st.fit.forEach(f => {
                const cls = RECIPE_CLASS[f.cls] || f.cls, tier = f.tier || '';
                const names = [];
                if (f.category === 'Drones') { names.push(`${f.name} T1`, f.name); }
                else {
                    const base = MODULE_ALIAS[f.type] || f.name || f.type;
                    if (cls && tier) names.push(`${base} ${cls} ${tier}`, `${f.type} ${cls} ${tier}`);
                    if (tier) names.push(`${base} ${tier}`);
                    names.push(base);
                }
                const rec = names.map(n => this.rc.rm.recipeByName.get(n)).find(Boolean);
                if (rec) items.push({ id: rec.outputId, qty: f.n, fit: f, name: rec.outputName, assumed: f.category === 'Drones' ? 'tier assumed T1' : '' });
                else out.unpriced.push(f);
            });
            if (items.length) {
                const x = this.rc.expand(items.map(it => ({ id: it.id, qty: it.qty })));
                x.raws.forEach((q, n) => out.raws.set(n, q));
                out.crafts = Array.from(x.crafts.values()).reduce((a, v) => a + v, 0);
                out.time = x.time;
            }
            out.recipes = items; out.found = items.length;
            out.rawList = Array.from(out.raws.entries()).map(([name, qty]) => ({ name, qty, res: this.rc.rm.byName.get(name) || null })).sort((a, b) => b.qty - a.qty);
            out.rawUnits = out.rawList.reduce((a, r) => a + r.qty, 0);
            return out;
        }
    }
    Loadout.HAUL_STATS = HAUL_STATS; Loadout.MINE_STATS = MINE_STATS; Loadout.FIGHT_STATS = FIGHT_STATS; Loadout.SCAN_STATS = SCAN_STATS;
    Loadout.CLASS_TOKEN = CLASS_TOKEN; Loadout.CLASS_NAME = CLASS_NAME;
    window.CommandDeck = window.CommandDeck || {};
    window.CommandDeck.Loadout = Loadout;
})();
