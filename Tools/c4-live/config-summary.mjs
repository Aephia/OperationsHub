// config-summary.mjs - boil the local config snapshot (Data/c4-live/config, written by config-snapshot.mjs) down to
// the small public file the C4 Live Analytics tab reads: C4Live/config-summary.json. The snapshot is ~20 MB and
// stays local; this summary is counts, medians and short ranked lists, all of it public chain config.
//   node Tools/c4-live/config-summary.mjs [--in <config dir>] [--out <file>]
// Re-run after config-snapshot.mjs whenever the game is redeployed. Exit 1 and nothing written when a table this
// needs is missing or empty.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SIZE_ORDER = ['xx-small', 'x-small', 'small', 'medium', 'large', 'capital', 'commander', 'titan'];
// category ids the cargo table uses; only the ones whose meaning is plain from their rows get a name
const CAT_NAME = { 0: 'Consumables', 2: 'Raw resources', 9: 'Ships', 14: 'Claim stakes', 15: 'Crafting habs' };
const TOP = 12;

const num = v => (typeof v === 'number' && Number.isFinite(v) ? v : typeof v === 'string' && v !== '' && Number.isFinite(Number(v)) ? Number(v) : null);
const val = v => (v && typeof v === 'object' ? num(v.value) : num(v));
function median(list) {
    const s = list.filter(v => v != null).sort((a, b) => a - b);
    if (!s.length) return null;
    return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
}
const r4 = v => (v == null ? null : Number(v.toPrecision(6)));
const byCount = (a, b) => b.n - a.n || (a.r < b.r ? -1 : a.r > b.r ? 1 : 0);

export function summarize(T) {
    const need = ['recipes', 'cargo', 'ship_configurations', 'research_catalog', 'faction_relations', 'atlas_reward_config', 'claim_stake_definitions'];
    for (const t of need) if (!T[t] || !Array.isArray(T[t].rows) || !T[t].rows.length) throw new Error('table missing or empty: ' + t);
    const R = T.recipes.rows, cargo = T.cargo.rows;

    // ---- recipes
    const ways = new Map();                                   // output cargo id -> recipes that make it
    for (const r of R) for (const o of r.outputs || []) { if (!ways.has(o.id)) ways.set(o.id, []); ways.get(o.id).push(r); }
    const nameOf = new Map(cargo.map(c => [c.id, c.name]));
    const catOf = new Map(cargo.map(c => [c.id, c.categoryId]));
    // raw-equivalent of one unit: a cargo nothing makes is 1; otherwise the cheapest and the dearest way to make it
    const memo = new Map();
    function rawEq(id, trail) {
        if (memo.has(id)) return memo.get(id);
        const list = ways.get(id);
        if (!list) { const e = { min: 1, max: 1 }; memo.set(id, e); return e; }
        if (trail.has(id)) return null;                        // a loop in the recipes: no finite answer down this branch
        trail.add(id);
        let min = Infinity, max = -Infinity;
        for (const r of list) {
            const out = (r.outputs || []).find(o => o.id === id), q = out ? num(out.quantityRaw) : null;
            if (!(q > 0)) continue;
            let lo = 0, hi = 0, ok = true;
            for (const i of r.ingredients || []) {
                const e = rawEq(i.id, trail), n = num(i.quantityRaw);
                if (!e || !(n >= 0)) { ok = false; break; }
                lo += n * e.min; hi += n * e.max;
            }
            if (!ok) continue;
            min = Math.min(min, lo / q); max = Math.max(max, hi / q);
        }
        trail.delete(id);
        const e = Number.isFinite(min) ? { min, max } : null;
        if (e) memo.set(id, e);
        return e;
    }
    const levels = {}, cats = {}, ing = {}, rawUse = new Map();
    let gated = 0, withFee = 0, feeAtlas = 0;
    for (const r of R) {
        const lv = num(String(r.minimumStarbaseLevel || '').replace(/^level-/, ''));
        if (lv != null) levels[lv] = (levels[lv] || 0) + 1;
        const c = r.outputs && r.outputs[0] ? r.outputs[0].categoryId : null;
        if (c != null) cats[c] = (cats[c] || 0) + 1;
        const n = (r.ingredients || []).length; ing[n] = (ing[n] || 0) + 1;
        if ((r.researchRequirementIds || []).length) gated++;
        const f = r.fee ? num(r.fee.amountAtlas) : null;
        if (f > 0) { withFee++; feeAtlas = Math.max(feeAtlas, f); }
        const seen = new Set();
        for (const i of r.ingredients || []) if (!ways.has(i.id) && !seen.has(i.id)) { seen.add(i.id); rawUse.set(i.id, (rawUse.get(i.id) || 0) + 1); }
    }
    const firstOfCat = {}; for (const c of cargo) if (!(c.categoryId in firstOfCat)) firstOfCat[c.categoryId] = c.name;
    const dear = [];
    for (const id of ways.keys()) { const e = rawEq(id, new Set()); if (e) dear.push({ r: nameOf.get(id) || String(id), min: r4(e.min), max: r4(e.max), ways: ways.get(id).length, cat: catOf.get(id) }); }
    dear.sort((a, b) => b.min - a.min || (a.r < b.r ? -1 : 1));
    const up = (T.atlas_reward_config.rows[0].upgradeLpRates || []).map(u => {
        const e = rawEq(u.cargo.id, new Set()), lp = num(u.lpPerRawUnit);
        return { r: u.cargo.name, lp, raw: e ? r4(e.min) : null, rawMax: e ? r4(e.max) : null };
    }).sort((a, b) => (b.raw || 0) - (a.raw || 0) || (a.r < b.r ? -1 : 1));

    // ---- ships: the default configuration of each hull, medians per size class
    const S = T.ship_configurations.rows, def = S.filter(s => /Default Config$/.test(s.name || ''));
    const bySize = SIZE_ORDER.map(size => {
        const l = def.filter(s => s.sizeClass === size);
        if (!l.length) return null;
        const m = f => r4(median(l.map(f)));
        // what it takes to fit a hull out: the raw-equivalent of the components each non-default configuration lists
        const fit = S.filter(x => x.sizeClass === size && (x.componentRequirements || []).length).map(x => {
            let t = 0;
            for (const c of x.componentRequirements) { const e = rawEq(c.cargoId, new Set()), q = num(c.quantityRaw); if (!e || !(q >= 0)) return null; t += q * e.min; }
            return t;
        }).filter(v => v != null);
        return {
            size, n: l.length, fitN: fit.length, fit: r4(median(fit)), fitMin: fit.length ? r4(Math.min(...fit)) : null, fitMax: fit.length ? r4(Math.max(...fit)) : null,
            cargo: m(s => num(s.stats.cargo.cargoCapacity)), fuel: m(s => num(s.stats.cargo.fuelCapacity)), ammo: m(s => num(s.stats.cargo.ammoCapacity)),
            mining: m(s => val(s.stats.cargo.miningRate)), crew: m(s => num(s.stats.misc.requiredCrew)),
            hp: m(s => num(s.stats.combat.hp)), sp: m(s => num(s.stats.combat.sp)),
            recovery: m(s => num(s.stats.misc.recoveryFeeAtlas)), respawn: m(s => num(s.stats.misc.respawnTimeWithoutFeeSeconds)),
            warpFuel: m(s => val(s.stats.movement.warpFuelConsumptionRate)), subwarpFuel: m(s => val(s.stats.movement.subwarpFuelConsumptionRate)),
            warpSpeed: m(s => val(s.stats.movement.warpSpeed)), laneSpeed: m(s => val(s.stats.movement.warpLaneSpeed))
        };
    }).filter(Boolean);

    // ---- tolls, research, stakes
    const fr = T.faction_relations.rows[0], RC = T.research_catalog.rows;
    const laneRes = RC.filter(r => r.modifier && num(r.modifier.warpLaneFeeModifier)).map(r => ({ r: r.name, mod: num(r.modifier.warpLaneFeeModifier), atlas: num(r.atlasCost) || 0 }));
    const paid = RC.filter(r => num(r.atlasCost) > 0).map(r => ({ r: r.name, atlas: num(r.atlasCost) })).sort((a, b) => b.atlas - a.atlas || (a.r < b.r ? -1 : 1));
    const stakeDefs = T.claim_stake_definitions.rows.map(d => ({ r: d.name, slots: num(d.slots), rent: val(d.rentMultiplier), place: val(d.placementFeeMultiplier) }));

    return {
        v: 1, takenAt: num(T.index && T.index.takenAt), sage: T.index && T.index.epoch ? num(T.index.epoch.sage) : null,
        recipes: {
            n: R.length, outputs: ways.size, multi: [...ways.values()].filter(l => l.length > 1).length, gated, withFee, feeAtlas,
            byLevel: Object.keys(levels).map(Number).sort((a, b) => a - b).map(k => ({ lvl: k, n: levels[k] })),
            byCat: Object.keys(cats).map(Number).sort((a, b) => cats[b] - cats[a] || a - b).map(k => ({ cat: k, name: CAT_NAME[k] || null, eg: firstOfCat[k] || null, n: cats[k] })),
            byIngredients: Object.keys(ing).map(Number).sort((a, b) => a - b).map(k => ({ k, n: ing[k] })),
            rawN: rawUse.size, rawUse: [...rawUse].map(([id, n]) => ({ r: nameOf.get(id) || String(id), n })).sort(byCount).slice(0, TOP),
            dear: dear.slice(0, TOP).map(({ r, min, max, ways: w }) => ({ r, min, max, ways: w })), dearN: dear.length,
            rawEqMedian: r4(median(dear.map(d => d.min))), upgrade: up
        },
        ships: { configs: S.length, hulls: def.length, bySize },
        tolls: { allied: num(fr.alliedTollBps), neutral: num(fr.neutralTollBps), territoryAccess: !!fr.territoryAccessEnabled, crossFaction: !!fr.crossFactionEconomicsEnabled, research: laneRes },
        research: { n: RC.length, paid: paid.length, atlas: r4(paid.reduce((t, r) => t + r.atlas, 0)), withCargo: RC.filter(r => (r.cargoCosts || []).length).length,
            byCost: [...paid.reduce((m, r) => m.set(r.atlas, (m.get(r.atlas) || 0) + 1), new Map())].map(([atlas, n]) => ({ atlas, n })).sort((a, b) => a.atlas - b.atlas) },
        stakes: stakeDefs
    };
}

function main() {
    const a = process.argv.slice(2), arg = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
    const dir = path.resolve(arg('--in') || path.join(HERE, '..', '..', 'Data', 'c4-live', 'config'));
    const out = path.resolve(arg('--out') || path.join(HERE, '..', '..', 'C4Live', 'config-summary.json'));
    const T = {};
    for (const f of fs.readdirSync(dir)) if (f.endsWith('.json')) T[f.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const sum = summarize(T);
    const text = JSON.stringify(sum);
    const tmp = out + '.tmp';
    fs.writeFileSync(tmp, text); fs.renameSync(tmp, out);
    console.log('[config-summary] wrote ' + out + ' (' + text.length + ' bytes): ' + sum.recipes.n + ' recipes, ' + sum.ships.hulls + ' hulls, ' + sum.research.n + ' research nodes, chain version ' + sum.sage);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try { main(); } catch (e) { console.error('[config-summary] ERROR ' + (e && e.message)); process.exit(1); }
}
