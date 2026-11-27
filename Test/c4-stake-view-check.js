// c4-stake-view-check.js - the C4 Live claim stake view (2026-11-22).
//   node Test/c4-stake-view-check.js            model rules + mutants, then the headless-browser scenarios + negative controls
//   NO_BROWSER=1 node ...                       model part only
//   SHOTS=<dir> node ...                        also saves screenshots (desktop 1440x900, phone 390x844) into <dir>
// Part 1 (pure, c4-ui-model.js): M.stakeLayout rules over generated stakes (no shared cell, every hex corner inside the
// clearing ellipse, tile count = min(sum q, 37), painter's order, hubs on the inner rings) and M.buildStake (a missing
// field is null and listed, never 0), each with a source mutant that must FAIL the matching check.
// Part 2 (headless Chromium, localhost = LOCAL mode, the collector files served with fixture stakes added): the view opens
// from BOTH row types, shows the fixture's numbers, closes by Escape / X / scrim with the drawer restored, honours reduced
// motion, shows the design / old-data / 37-cap states, keeps open across a data reload, opens from ?stake=. Negative
// controls rerun the page with a broken click wiring and a broken cap and require the matching checks to FAIL.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const MODEL_FILE = path.join(ROOT, 'C4Live', 'c4-ui-model.js');
let pass = 0, fail = 0;
function check(name, ok, detail) {
    if (ok) { pass++; console.log('  ok   ' + name); } else { fail++; console.log('  FAIL ' + name + (detail ? '  -> ' + detail : '')); }
    return !!ok;
}
const loadModel = src => { const m = { exports: {} }; new Function('module', 'exports', src)(m, m.exports); return m.exports; };
const MODEL_SRC = fs.readFileSync(MODEL_FILE, 'utf8');

// ------------------------------------------------------------------ part 1: the model
const SQ3 = Math.sqrt(3);
function layoutRules(M, label) {
    const res = {};
    const kinds = M.STAKE_KINDS;
    let seed = 12345; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    const cases = [];
    for (let n = 0; n < 160; n++) {
        const rows = 1 + Math.floor(rnd() * 12), bl = [];
        for (let i = 0; i < rows; i++) bl.push({ id: i + 1, n: 'b' + i, q: 1 + Math.floor(rnd() * (n % 5 === 0 ? 12 : 3)), k: kinds[Math.floor(rnd() * kinds.length)] });
        cases.push(bl);
    }
    cases.push([{ id: 1, n: 'x', q: 60, k: 'extractor' }], [{ id: 1, n: 'x', q: 37, k: 'extractor' }], [{ id: 1, n: 'x', q: 1, k: 'central_hub' }], []);
    let shared = 0, outside = 0, wrongCount = 0, order = 0, moreBad = 0, detBad = 0;
    for (const bl of cases) {
        const L = M.stakeLayout(bl), total = bl.reduce((s, b) => s + b.q, 0);
        const seen = new Set();
        for (const c of L.cells) { const key = c.q + ',' + c.r; if (seen.has(key)) shared++; seen.add(key); }
        const [a, b] = L.clear;
        for (const c of L.cells) for (let i = 0; i < 6; i++) {
            const ang = Math.PI / 6 + i * Math.PI / 3, x = c.x + L.R * Math.cos(ang), y = c.y + L.R * Math.sin(ang);
            if ((x / a) ** 2 + (y / b) ** 2 > 1 + 1e-9) { outside++; break; }
            // the cell centre really is at the axial coordinate (pointy-top hex of circumradius R)
        }
        if (L.cells.length !== Math.min(total, 37)) wrongCount++;
        if (L.more !== total - L.cells.length || L.total !== total || L.shown !== L.cells.length) moreBad++;
        for (let i = 0; i < L.cells.length; i++) { const c = L.cells[i]; if (c.ord !== i || (i && (L.cells[i - 1].y > c.y + 1e-12 || (L.cells[i - 1].y === c.y && L.cells[i - 1].x > c.x)))) order++; }
        for (const c of L.cells) if (Math.abs(c.x - L.R * SQ3 * (c.q + c.r / 2)) > 1e-9 || Math.abs(c.y - L.R * 1.5 * c.r) > 1e-9) shared++;
        if (JSON.stringify(L) !== JSON.stringify(M.stakeLayout(bl))) detBad++;
    }
    res['no two tiles share a cell, ' + cases.length + ' stakes (' + label + ')'] = shared === 0;
    res['every hex corner of every tile is inside the clearing ellipse (' + label + ')'] = outside === 0;
    res['tile count = min(sum q, 37) and the overflow count is total - shown (' + label + ')'] = wrongCount === 0 && moreBad === 0;
    res['painter order: far (small y) first, ord = index (' + label + ')'] = order === 0;
    res['same input, same layout (' + label + ')'] = detBad === 0;
    // placement: central hub in the middle, the other hubs on ring 1, then the rest outward
    const bl = [{ id: 1, n: 'p', q: 3, k: 'processor' }, { id: 2, n: 'e', q: 2, k: 'extractor' }, { id: 3, n: 'ph', q: 1, k: 'processing_hub' }, { id: 4, n: 'c', q: 1, k: 'central_hub' }, { id: 5, n: 'sh', q: 1, k: 'storage_hub' }, { id: 6, n: 'pp', q: 1, k: 'power_plant' }];
    const L = M.stakeLayout(bl), ring = c => Math.max(Math.abs(c.q), Math.abs(c.r), Math.abs(c.q + c.r));
    const cen = L.cells.filter(c => c.k === 'central_hub'), hubs = L.cells.filter(c => /_hub$/.test(c.k) && c.k !== 'central_hub'), rest = L.cells.filter(c => !/_hub$/.test(c.k));
    res['central hub at the centre (q 0, r 0, x 0, y 0) (' + label + ')'] = cen.length === 1 && cen[0].q === 0 && cen[0].r === 0 && cen[0].x === 0 && cen[0].y === 0;
    res['the other hubs sit on ring 1 (' + label + ')'] = hubs.length === 2 && hubs.every(c => ring(c) === 1);
    res['q > 1 draws that many tiles: 3 processors, 2 extractors (' + label + ')'] = rest.filter(c => c.k === 'processor').length === 3 && rest.filter(c => c.k === 'extractor').length === 2;
    res['the big stake (60 x q) draws 37 tiles and says 23 more (' + label + ')'] = (() => { const b = M.stakeLayout([{ id: 1, n: 'x', q: 60, k: 'extractor' }]); return b.cells.length === 37 && b.more === 23 && b.rings === 3; })();
    res['a full stake fills rings 0..3 exactly: the 37 axial cells within distance 3, no gaps (' + label + ')'] = (() => {
        const b = M.stakeLayout([{ id: 1, n: 'x', q: 60, k: 'extractor' }]); const have = new Set(b.cells.map(c => c.q + ',' + c.r)); let want = 0, ok = have.size === 37;
        for (let q = -3; q <= 3; q++) for (let r = -3; r <= 3; r++) if (Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) <= 3) { want++; if (!have.has(q + ',' + r)) ok = false; }
        return ok && want === 37;
    })();
    // size (2026-11-22, c): the colony fills the clearing. Footprint = the width of all hex corners / the clearing's width.
    const one = n => M.stakeLayout([{ id: 1, n: 'x', q: n, k: 'extractor' }]);
    const share = L2 => { let lo = Infinity, hi = -Infinity; for (const c of L2.cells) { lo = Math.min(lo, c.x - SQ3 / 2 * L2.R); hi = Math.max(hi, c.x + SQ3 / 2 * L2.R); } return (hi - lo) / (2 * L2.clear[0]); };
    const shares = {}; for (let n = 1; n <= 37; n++) shares[n] = share(one(n));
    res['footprint is at most 85 % of the clearing width, for 1..37 buildings (' + label + ')'] = Object.values(shares).every(s => s <= 0.85 + 1e-9);
    res['footprint is 70-85 % of the clearing width for n = 3, 7, 13, 19, 37 and every n from 3 to 37 (' + label + ')'] = [3, 7, 13, 19, 37].every(n => shares[n] >= 0.70 && shares[n] <= 0.85 + 1e-9) && Object.keys(shares).filter(n => n >= 3).every(n => shares[n] >= 0.70);
    res['two buildings fill at least 60 % of the clearing width (' + label + ')'] = shares[2] >= 0.60;
    res['one building is a hero tile: R is the cap, 4.8, and its footprint is above 50 % (' + label + ')'] = one(1).R === M.STAKE_RCAP && M.STAKE_RCAP === 4.8 && shares[1] > 0.50;
    // cap rule: the tile art is 320 px and drawn 0.082 x R of the stage width; the widest stage on 1440x900 is the full-screen
    // one, (900 - 192) * 16 / 9 = 1259 px. A tile above 1.6 x its own size goes soft.
    res['no tile is drawn above 1.6 x the art size on a 1440x900 full-screen stage (R <= 4.8 for every count) (' + label + ')'] = (() => {
        for (let n = 0; n <= 37; n++) { const L2 = n ? one(n) : M.stakeLayout([]); const px = 320 * L2.R / (150.147 * 26) * 1259; if (px / 320 > 1.6 + 1e-9) return false; }
        return true;
    })();
    res['R never shrinks as the colony shrinks from 37 to 1 (a smaller stake is never drawn smaller) (' + label + ')'] = (() => { for (let n = 2; n <= 37; n++) if (one(n - 1).R < one(n).R - 1e-9) return false; return true; })();
    return res;
}
function stakeRules(M, label) {
    const res = {};
    const L = { generatedAt: 1800000000, quality: {}, systems: [{ a: 'S1', n: 'Sys', x: 1, y: 2 }], owners: [{ p: 'O1', fa: 'ustur' }], stakes: [
        { a: 'OLD', o: 'O1', st: 'active', def: 0, b: 1, sys: 'S1', x: 1, y: 2, crew: 1, body: 'B1', defName: 'Claim Stake Tier 1', tier: 1, slots: 65 },
        { a: 'FULL', o: 'O1', st: 'active', def: 0, b: 3, sys: 'S1', x: 1, y: 2, crew: 4, body: 'B1', defName: 'Claim Stake Tier 1', tier: 1, slots: 65,
            bl: [{ id: 1, n: 'Central Hub', q: 1, k: 'central_hub' }, { id: 2, n: 'Fuel Processor', q: 2, k: 'processor' }], pw: { gen: 120, use: 95 }, cs: 6, su: 20, inv: [{ r: 'Hydrogen', q: 9 }, { r: 'Fuel', q: 252 }], cap: { used: 2000, total: 5000 }, fuel: 252, rent: { bal: 12.5, at: 1799996400 }, con: { rem: 0, at: 1799999000 }, out: [{ r: 'Fuel', ps: 0.01 }, { r: 'Hydrogen', ps: 0.5 }], use: [{ r: 'Power Cell', ps: 0.001 }, { r: 'Fuel', ps: 0.0175 }] },
        { a: 'ZERO', o: 'O1', st: 'active', def: 0, b: 1, sys: 'S1', x: 1, y: 2, crew: 1, body: 'B1', slots: 65, bl: [], pw: { gen: 0, use: 0 }, cs: 0, su: 0, inv: [], cap: { used: 0, total: 0 }, fuel: 0, rent: { bal: 0, at: 1 }, out: [], use: [{ r: 'Fuel', ps: 0.002 }] },
        { a: 'NOBURN', o: 'O1', st: 'active', def: 0, b: 1, sys: 'S1', x: 1, y: 2, crew: 1, body: 'B1', slots: 65, bl: [], pw: { gen: 0, use: 0 }, cs: 0, su: 0, inv: [], cap: { used: 9, total: 5 }, fuel: 50, rent: { bal: 0, at: 1 }, out: [], use: [] },
        { a: 'NOUSE', o: 'O1', st: 'active', def: 0, b: 1, sys: 'S1', x: 1, y: 2, crew: 1, body: 'B1', slots: 65, bl: [], pw: { gen: 0, use: 0 }, cs: 0, su: 0, inv: [], cap: { used: 1, total: 5 }, fuel: 50, rent: { bal: 0, at: 1 }, out: [] },
        { a: 'DES', o: 'O1', st: 'design', def: 0, b: 1, sys: 'S1', x: 1, y: 2, crew: 0, body: 'B1', slots: 65, con: { rem: 3600, at: 1799999000 } }] };
    const bodies = [{ a: 'B1', id: 7, n: 'Planet One', k: 'planet', sys: 'S1', sub: 'ice-giant' }];
    const o = M.buildStake(L, bodies, 'OLD'), f = M.buildStake(L, M.indexBodies(bodies), 'FULL'), z = M.buildStake(L, bodies, 'ZERO'), d = M.buildStake(L, bodies, 'DES');
    res['an unknown address gives null (' + label + ')'] = M.buildStake(L, bodies, 'NOPE') === null;
    res['old copy: fuel, power, storage, rent, buildings, slots used, crew slots are null, never 0 (' + label + ')'] = o.fuel === null && o.power === null && o.storage === null && o.rent === null && o.buildings === null && o.slots.used === null && o.crew.slots === null && o.inventory === null && o.perHour === null;
    res['old copy: flagged oldCopy, note says "Not read yet - refresh", every new field is listed missing (' + label + ')'] = o.oldCopy === true && /Not read yet - refresh/.test(o.note) && o.missing.length === 10 && o.missing.includes('use') && o.usePerHour === null && o.fuelHours === null;
    res['old copy keeps what it has: crew needed 1, slots total 65 (' + label + ')'] = o.crew.need === 1 && o.slots.total === 65 && o.ground === 'ice-giant';
    res['full stake: nothing missing, not flagged (positive control) (' + label + ')'] = f.missing.length === 0 && !f.oldCopy && f.note === '';
    res['full stake: fuel 252, crew 4 / 6, slots 20 / 65 (' + label + ')'] = f.fuel === 252 && f.crew.need === 4 && f.crew.slots === 6 && f.slots.used === 20 && f.slots.total === 65;
    res['full stake: power 120 / 95 = +25, storage 40%, buildings 3 (' + label + ')'] = f.power.net === 25 && f.storage.pct === 0.4 && f.buildings.total === 3;
    res['full stake: production per hour = ps x 3600, sorted high first (' + label + ')'] = f.perHour[0].r === 'Hydrogen' && f.perHour[0].ph === 1800 && f.perHour[1].r === 'Fuel' && Math.abs(f.perHour[1].ph - 36) < 1e-9;
    res['full stake: inventory sorted by quantity, rent 12.5 (' + label + ')'] = f.inventory[0].r === 'Fuel' && f.rent.bal === 12.5 && f.underConstruction === false;
    res['a real zero stays 0 (fuel 0, power 0 / 0, rent 0), only a missing field is null (' + label + ')'] = z.fuel === 0 && z.power.gen === 0 && z.rent.bal === 0 && z.missing.length === 0 && z.storage.pct === null;
    res['design state is under construction, with con 3600 s (' + label + ')'] = d.underConstruction === true && d.con.rem === 3600 && d.st === 'design';
    const nb = M.buildStake(L, bodies, 'NOBURN'), nu = M.buildStake(L, bodies, 'NOUSE');
    res['consumption per hour = ps x 3600, sorted high first (' + label + ')'] = f.usePerHour.length === 2 && f.usePerHour[0].r === 'Fuel' && Math.abs(f.usePerHour[0].ph - 63) < 1e-9 && Math.abs(f.usePerHour[1].ph - 3.6) < 1e-9;
    res['fuel hours = fuel / fuel burn per hour (252 / 63 = 4) (' + label + ')'] = Math.abs(f.fuelHours - 4) < 1e-9 && f.fuelHoursWhy === null;
    res['fuel 0 with a burn is 0 hours, not null (' + label + ')'] = z.fuelHours === 0 && z.fuelHoursWhy === null;
    res['fuel held but no fuel burn: null with reason "no fuel burn", never Infinity or 0 (' + label + ')'] = nb.fuelHours === null && nb.fuelHoursWhy === 'no fuel burn' && nb.usePerHour.length === 0;
    res['fuel known but use not read: null, listed missing (' + label + ')'] = nu.fuelHours === null && nu.usePerHour === null && nu.missing.includes('use') && !nu.missing.includes('fuel');
    res['storage over capacity keeps used > total with pct capped at 1 (' + label + ')'] = nb.storage.used === 9 && nb.storage.total === 5 && nb.storage.pct === 1;
    const L2 = JSON.parse(JSON.stringify(L)); L2.quality.buildingDefsFailed = true; delete L2.stakes[1].pw; delete L2.stakes[1].cs; delete L2.stakes[1].su; delete L2.stakes[1].out;
    const x = M.buildStake(L2, bodies, 'FULL');
    res['definitions failed: power / crew slots / slots used / production are null and the note says why (' + label + ')'] = x.defsFailed && x.power === null && x.crew.slots === null && x.slots.used === null && x.perHour === null && /definitions could not be read/.test(x.note) && !x.oldCopy;
    // ---- 2026-11-23 page review fixes
    const full = L.stakes.find(s => s.a === 'FULL');
    const L3 = JSON.parse(JSON.stringify(L)); L3.quality.buildingDefsFailed = true; delete L3.stakes[1].pw; delete L3.stakes[1].cs; delete L3.stakes[1].su;   // out / use / fuel stay: the stake row has them
    const x3 = M.buildStake(L3, bodies, 'FULL');
    res['definitions failed, out / use present: the note does not claim production is unknown, and the production list is built (' + label + ')'] = x3.defsFailed && /definitions could not be read/.test(x3.note) && !/production/i.test(x3.note) && Array.isArray(x3.perHour) && x3.perHour.length > 0 && Array.isArray(x3.usePerHour) && !x3.missing.includes('out');
    const mkq = bl => { const L4 = JSON.parse(JSON.stringify(L)); L4.stakes.find(s => s.a === 'FULL').bl = bl; return M.buildStake(L4, bodies, 'FULL'); };
    const q = mkq([{ id: 1, n: 'a', q: 0, k: 'farm' }, { id: 2, n: 'b', q: -3, k: 'farm' }, { id: 3, n: 'c', q: 2.7, k: 'processor' }, { id: 4, n: 'd', q: '4', k: 'farm' }, { id: 5, n: 'e', q: null, k: 'farm' }, { id: 6, n: 'f', q: 0.5, k: 'farm' }, { id: 7, n: 'g', q: 3, k: 'central_hub' }]);
    const lay = M.stakeLayout(q.buildings.list, {});
    res['building quantity, one rule: 0, -3, "4", null, 0.5 are listed with no quantity and counted nowhere; 2.7 is 2; total = tiles = 5 (' + label + ')'] = q.buildings.list.length === 7 && JSON.stringify(q.buildings.list.map(b => b.qty)) === JSON.stringify([null, null, 2, null, null, null, 3]) && q.buildings.total === 5 && lay.total === 5 && lay.shown === 5;
    const bad = M.buildStake(Object.assign({}, L, { stakes: [Object.assign({}, full, { fuel: '50', cap: {}, pw: 'x', rent: { bal: '1' }, inv: {}, use: 'no' })] }), bodies, 'FULL');
    res['present but not numeric: fuel "50", cap {}, power "x", rent.bal "1", inv {}, use "no" are named in the Not read yet note (' + label + ')'] = ['fuel', 'cap', 'pw', 'rent', 'inv', 'use'].every(f => bad.missing.includes(f)) && /^Not read yet: .*fuel/.test(bad.note) && /cap/.test(bad.note) && bad.fuel === null && bad.storage === null && bad.power === null && bad.rent === null && !bad.missing.includes('out') && !bad.missing.includes('bl');
    const cw = (c, cs) => M.buildStake(Object.assign({}, L, { stakes: [Object.assign({}, full, { crew: c, cs })] }), bodies, 'FULL').crew;
    res['crew needed above crew slots is flagged over (8 / 6), but not 6 / 6, 4 / 6, or an unread slot count (' + label + ')'] = cw(8, 6).over === true && cw(6, 6).over === false && cw(4, 6).over === false && cw(8, undefined).over === false && cw(8, 6).need === 8;
    const before = Object.getOwnPropertyNames(Object.prototype).join();
    const P = ['__proto__', 'constructor', 'central_hub', 'farm', 'toString'];
    const ly = M.stakeLayout(P.map((k, i) => ({ id: i, n: k, q: 1, k })), {});
    const centre = ly.cells.find(c => c.slot === 0), inner = ly.cells.filter(c => c.q * c.q + c.r * c.r + c.q * c.r <= 3).map(c => c.k);
    res['inherited names are not known kinds: [__proto__, constructor, central_hub, farm, toString] keeps the central hub at the centre (' + label + ')'] = !!centre && centre.k === 'central_hub' && ly.shown === 5;
    res['inherited names rank as unknown kinds: constructor is placed after the power plant, never ahead of it (' + label + ')'] = (() => { const l2 = M.stakeLayout([{ id: 1, n: 'c', q: 1, k: 'constructor' }, { id: 2, n: 'p', q: 1, k: 'power_plant' }, { id: 3, n: 'h', q: 1, k: 'central_hub' }], {}); const order = l2.cells.slice().sort((a, b) => a.slot - b.slot).map(c => c.k); return order.join() === 'central_hub,power_plant,constructor'; })();
    const ps = M.buildStake(Object.assign({}, L, { stakes: [Object.assign({}, full, { bl: P.map((k, i) => ({ id: i, n: k, q: 1, k })), out: [{ r: '__proto__', ps: 1 }], use: [{ r: 'constructor', ps: 1 }], inv: [{ r: '__proto__', q: 1 }] })] }), bodies, 'FULL');
    res['names like __proto__ / constructor in the chain rows build, and Object.prototype is untouched (' + label + ')'] = ps.buildings.total === 5 && ps.perHour[0].r === '__proto__' && Object.getOwnPropertyNames(Object.prototype).join() === before && ({}).ups === undefined && ({}).ph === undefined;
    return res;
}
function runModelPart() {
    console.log('\n[1] Model: M.stakeLayout and M.buildStake rules');
    const M = loadModel(MODEL_SRC);
    const base = Object.assign(layoutRules(M, 'real'), stakeRules(M, 'real'));
    for (const [k, v] of Object.entries(base)) check(k, v);
    console.log('\n[1b] Mutants of the model source: each must fail the checks named');
    const mutants = [
        ['STAKE_CAP 37 -> 38', s => s.replace('STAKE_CAP = 37', 'STAKE_CAP = 38'), /tile count = min/],
        ['no ellipse fit (R from the share rule only)', s => s.replace('const R = Math.min(rcap, fit, byShare);', 'const R = Math.min(rcap, byShare);'), /inside the clearing ellipse/],
        ['old cap 1.5 (the 2026-11-22 delivery)', s => s.replace('STAKE_RCAP = 4.8', 'STAKE_RCAP = 1.5'), /70-85 %|hero tile/],
        ['cap 6.5 (tile stretched past 1.6 x)', s => s.replace('STAKE_RCAP = 4.8', 'STAKE_RCAP = 6.5'), /1\.6 x the art size|hero tile/],
        ['no share limit (R from fit and cap only)', s => s.replace('const R = Math.min(rcap, fit, byShare);', 'const R = Math.min(rcap, fit);'), /at most 85 %/],
        ['partial ring not ordered by fit (plain walk order)', s => s.replace('rows.sort((a, b) => a.k - b.k || a.w - b.w || a.i - b.i);', 'rows.sort((a, b) => a.k - b.k || a.i - b.i);'), /70-85 %|never shrinks|60 %/],
        ['painter order reversed', s => s.replace('cells.sort((a, b) => a.y - b.y ||', 'cells.sort((a, b) => b.y - a.y ||'), /painter order/],
        ['ring walk repeats a corner cell', s => s.replace('for (let j = 0; j < k; j++) { cells.push', 'for (let j = 0; j <= k; j++) { cells.push'), /share a cell|fills rings/],
        ['central hub placed last', s => s.replace('STAKE_PRIORITY = { central_hub: 0,', 'STAKE_PRIORITY = { central_hub: 9,'), /central hub at the centre/],
        ['hubs placed after the workers', s => s.replace('cultivation_hub: 1, extraction_hub: 1, processing_hub: 1, storage_hub: 1, farm_hub: 1', 'cultivation_hub: 8, extraction_hub: 8, processing_hub: 8, storage_hub: 8, farm_hub: 8'), /hubs sit on ring 1/],
        ['q ignored (one tile per row)', s => s.replace("for (let i = 0; i < r.q && items.length < cap; i++) items.push(r);", 'if (r.q > 0 && items.length < cap) items.push(r);'), /q > 1 draws that many/],
        ['missing fuel becomes 0', s => s.replace("fuel: has('fuel') ? num(k.fuel) : null", "fuel: has('fuel') ? num(k.fuel) : 0"), /old copy: fuel, power/],
        ['missing power becomes 0 / 0', s => s.replace("const pw = has('pw') && isObj(k.pw) && isNum(k.pw.gen) && isNum(k.pw.use) ? { gen: k.pw.gen, use: k.pw.use, net: k.pw.gen - k.pw.use } : null;", "const pw = { gen: has('pw') ? k.pw.gen : 0, use: has('pw') ? k.pw.use : 0, net: 0 };"), /old copy: fuel, power/],
        ['per hour uses per second', s => s.replace('ph: x.ps * 3600', 'ph: x.ps'), /production per hour/],
        ['per hour for consumption uses per second', s => s.replace("ph: x.ps * 3600 })).sort((a, b) => b.ph - a.ph) : null;\n        // hours", "ph: x.ps })).sort((a, b) => b.ph - a.ph) : null;\n        // hours"), /consumption per hour|fuel hours = /],
        ['fuel 0 turned into null hours', s => s.replace('fuelHours = fuelNow / burn.ph;', 'fuelHours = fuelNow ? fuelNow / burn.ph : null;'), /fuel 0 with a burn/],
        ['no fuel burn gives Infinity', s => s.replace("if (!burn) fuelHoursWhy = 'no fuel burn';", "if (!burn) { fuelHours = Infinity; fuelHoursWhy = null; }"), /no fuel burn/],
        ['note claims production is unknown again', s => s.replace('building names, power, crew and slots are not known.', 'building names, power, crew, slots and production are not known.'), /does not claim production/],
        ['quantity kept raw (no floor)', s => s.replace('const stakeQty = q => (isNum(q) && q > 0 ? Math.floor(q) : 0);', 'const stakeQty = q => (isNum(q) && q > 0 ? q : 0);'), /building quantity, one rule/],
        ['quantity 0 kept as a building', s => s.replace("qty: stakeQty(b.q) > 0 ? stakeQty(b.q) : null", "qty: stakeQty(b.q)"), /building quantity, one rule/],
        ['list total ignores the rule', s => s.replace('(b.qty || 0)', '(isNum(b.q) ? Math.max(0, b.q) : 0)'), /building quantity, one rule/],
        ['wrong-shape field not listed as missing', s => s.replace('const missing = STAKE_NEW_FIELDS.filter(f => !has(f) || !SHAPE[f](k[f]));', 'const missing = STAKE_NEW_FIELDS.filter(f => !has(f));'), /present but not numeric/],
        ['crew over flag removed', s => s.replace('over: isNum(k.crew) && has(\'cs\') && isNum(k.cs) && k.crew > k.cs', 'over: false'), /crew needed above crew slots/],
        ['inherited kind takes a priority (constructor)', s => s.replace('b && ownKey(STAKE_PRIORITY, b.k) ? STAKE_PRIORITY[b.k] : 5', 'b && STAKE_PRIORITY[b.k] != null ? STAKE_PRIORITY[b.k] : 5'), /inherited names (are not known kinds|rank as unknown)/],
        ['a real zero turned into null', s => s.replace("fuel: has('fuel') ? num(k.fuel) : null", "fuel: has('fuel') && k.fuel ? num(k.fuel) : null"), /a real zero stays 0/]
    ];
    for (const [name, fn, rx] of mutants) {
        const src = fn(MODEL_SRC);
        if (src === MODEL_SRC) { check('mutant "' + name + '" applies to the source', false, 'replace found nothing'); continue; }
        let M2; try { M2 = loadModel(src); } catch (e) { check('mutant "' + name + '" loads', false, String(e)); continue; }
        const r = Object.assign(layoutRules(M2, 'mutant'), stakeRules(M2, 'mutant'));
        const failed = Object.entries(r).filter(([, v]) => !v).map(([k]) => k);
        check('mutant "' + name + '" is caught by a named check', failed.some(k => rx.test(k)), 'failed: ' + (failed.join(' | ') || 'none'));
    }
}

// ------------------------------------------------------------------ part 2: the page
const sleep = ms => new Promise(r => setTimeout(r, ms));
function fixtures() {
    const DIR = path.join(ROOT, 'Data', 'c4-live');
    const L = JSON.parse(fs.readFileSync(path.join(DIR, 'latest.json'), 'utf8'));
    const B = JSON.parse(fs.readFileSync(path.join(DIR, 'bodies.json'), 'utf8'));
    const planet = B.bodies.find(b => b.k === 'planet' && b.sub === 'ice-giant') || B.bodies.find(b => b.k === 'planet');
    const rock = B.bodies.find(b => b.k === 'planet' && b.sub === 'volcanic' && b.a !== planet.a) || B.bodies.find(b => b.k === 'planet' && b.a !== planet.a);
    const sys = (L.systems || []).find(s => s.a === planet.sys) || { x: 0, y: 0, n: '?' };
    const owner = L.stakes[0].o;
    const gen = L.generatedAt;
    const mk = (a, over) => Object.assign({ a, o: owner, st: 'active', def: 0, b: 12, sys: planet.sys, sysName: sys.n, x: sys.x, y: sys.y, crew: 4, body: planet.a, defName: 'Claim Stake Tier 1', tier: 1, slots: 65 }, over);
    const hub = (id, nm, k) => ({ id, n: nm, q: 1, k });
    const FULL = mk('FIXTURE-FULL-0000000000000000000000000000000000', {
        bl: [hub(101, 'Ice Giant Central Hub Tier 1', 'central_hub'), hub(102, 'Ice Giant Processing Hub Tier 1', 'processing_hub'), hub(103, 'Ice Giant Extraction Hub Tier 1', 'extraction_hub'), hub(104, 'Ice Giant Storage Hub Tier 1', 'storage_hub'), hub(105, 'Ice Giant Farm Hub Tier 1', 'farm_hub'), hub(106, 'Power Plant Tier 1', 'power_plant'), hub(107, 'Crew Quarters Tier 1', 'crew_quarters'), hub(108, 'Storage Module Tier 1', 'storage_module'), hub(109, 'Ammunition Processor Tier 1', 'processor'), hub(110, 'Fuel Processor Tier 1', 'processor'), { id: 111, n: 'Gas Condenser - Hydrogen Tier 1', q: 2, k: 'extractor' }, hub(112, 'Zed <img src=x onerror="window.__xss=1"> Tier 1', 'processor')],
        pw: { gen: 120, use: 95 }, cs: 6, su: 20, inv: [{ r: 'Hydrogen', q: 1800 }, { r: 'Fuel', q: 252 }, { r: 'Ammunition', q: 40 }], cap: { used: 2092, total: 5000 }, fuel: 252, rent: { bal: 12.5, at: gen - 3600 }, con: { rem: 0, at: gen - 100 }, out: [{ r: 'Fuel', ps: 0.01 }, { r: 'Hydrogen', ps: 0.5 }], use: [{ r: 'Power Cell', ps: 0.001 }, { r: 'Fuel', ps: 0.0175 }] });
    const DESIGN = mk('FIXTURE-DESIGN-00000000000000000000000000000000', { st: 'design', body: rock.a, sys: rock.sys, crew: 0, bl: [hub(101, 'Volcanic Central Hub Tier 1', 'central_hub'), hub(108, 'Storage Module Tier 1', 'storage_module')], pw: { gen: 0, use: 10 }, cs: 0, su: 3, inv: [], cap: { used: 1200, total: 1000 }, fuel: 0, rent: { bal: 0, at: gen - 10 }, con: { rem: 7200, at: gen - 10 }, out: [], use: [{ r: 'Fuel', ps: 0.002 }] });
    const BIG = mk('FIXTURE-BIG-000000000000000000000000000000000000', { b: 61, bl: [hub(101, 'Central Hub', 'central_hub'), { id: 111, n: 'Ore Breaker - Iron Ore Tier 1', q: 40, k: 'extractor' }, { id: 108, n: 'Storage Module Tier 1', q: 5, k: 'storage_module' }, { id: 109, n: 'Fuel Processor Tier 1', q: 14, k: 'processor' }], pw: { gen: 10, use: 30 }, cs: 80, su: 60, inv: [{ r: 'Iron Ore', q: 5 }], cap: { used: 4800, total: 5000 }, fuel: 5, rent: { bal: 1, at: gen - 1 }, con: { rem: 0, at: gen }, out: [{ r: 'Iron Ore', ps: 2 }], use: [{ r: 'Fuel', ps: 0.00001 }] });
    // the old-data stake: a real stake with every new field stripped (the collector may already write them)
    const OLD = JSON.parse(JSON.stringify(L.stakes[0]));
    for (const f of ['bl', 'pw', 'cs', 'su', 'inv', 'cap', 'fuel', 'rent', 'con', 'out', 'use']) delete OLD[f];
    L.stakes[0] = OLD;
    // odd chain strings and quantities (page review 2026-11-23): constructor / __proto__ kinds, q of 0, -3, 2.7, "4", null; crew 8 over 6 slots
    const ODD = Object.assign({}, FULL, { a: 'FIXTURE-ODD-0000000000000000000000000000000000000', crew: 8, bl: [{ id: 301, n: 'Odd Constructor', q: 1, k: 'constructor' }, hub(302, 'Odd Central Hub', 'central_hub'), { id: 303, n: 'Odd Proto', q: 1, k: '__proto__' }, { id: 304, n: 'Odd Farm', q: 1, k: 'farm' }, { id: 305, n: 'Odd Zero', q: 0, k: 'farm' }, { id: 306, n: 'Odd Negative', q: -3, k: 'farm' }, { id: 307, n: 'Odd Fraction', q: 2.7, k: 'extractor' }, { id: 308, n: 'Odd String', q: '4', k: 'farm' }, { id: 309, n: 'Odd Null', q: null, k: 'farm' }] });
    L.stakes = L.stakes.concat([FULL, DESIGN, BIG, ODD]);
    return { L, B, planet, rock, owner, FULL, DESIGN, BIG, ODD, OLD, sys };
}
async function runBrowser() {
    console.log('\n[2] Page: the stake view (headless Chromium, LOCAL mode, fixture stakes)');
    if (process.env.NO_BROWSER) { console.log('  SKIP NO_BROWSER set'); return; }
    let chromium;
    try { chromium = require('module').createRequire(path.join(os.homedir(), '.claude/skills/teardown/node_modules/x.js'))('playwright').chromium; }
    catch (e) { console.log('  SKIP playwright not installed'); return; }
    const http = require('http');
    const FX = fixtures();
    const PREV = process.env.GROUNDS_PREV || path.join(os.tmpdir(), 'c4-grounds-prev');   // preview ground renders, used only while Images/stake/ground is absent
    const realGrounds = fs.existsSync(path.join(ROOT, 'Images', 'stake', 'ground', 'manifest.json'));
    const groundPrev = !realGrounds && fs.existsSync(PREV);
    console.log('  grounds: ' + (realGrounds ? 'the real Images/stake/ground' : groundPrev ? 'TEMPORARY previews from the scratch folder (not in Images/)' : 'none (plain stage)'));
    const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
    const SCENE_STUB = 'window.__fp = []; window.C4Scene = { mount() { return new Proxy({}, { get(t, k) { if (k === "focusPoint") return (x, y, z) => { window.__fp.push([x, y, z]); }; if (k === "then") return undefined; return () => null; } }); } };';
    const state = { latest: JSON.stringify(FX.L), mut: null, mutModel: null, noGround: false };
    const server = http.createServer((q, r) => {
        const u = decodeURIComponent(q.url.split('?')[0]);
        if (u === '/Data/c4-live/latest.json') { r.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }); r.end(state.latest); return; }
        if (u === '/C4Live/c4-scene.js') { r.writeHead(200, { 'content-type': 'text/javascript' }); r.end(SCENE_STUB); return; }
        if (groundPrev && u === '/Images/stake/ground/manifest.json') {
            const g = {}; for (const n of ['terrestrial', 'oceanic', 'volcanic', 'barren', 'ice-giant', 'gas-giant', 'dark', 'asteroid']) g[n] = n + '.png';
            r.writeHead(200, { 'content-type': 'application/json' }); r.end(JSON.stringify({ w: 1600, h: 900, scale: 26, squash: 0.5299, clear: [7.6, 7.0], grounds: g })); return;
        }
        if (groundPrev && /^\/Images\/stake\/ground\/[\w-]+\.png$/.test(u)) {
            const f = path.join(PREV, path.basename(u)); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': 'image/png' }); r.end(b); }); return;
        }
        if (state.noGround && u.startsWith('/Images/stake/ground/')) { r.writeHead(404); r.end(); return; }
        const p = path.join(ROOT, u);
        if (!p.startsWith(ROOT)) { r.writeHead(403); r.end(); return; }
        fs.readFile(p, (e, b) => {
            if (e) { r.writeHead(404); r.end(); return; }
            if (state.mut && u === '/C4Live/app.js') { const t = b.toString('utf8'), t2 = state.mut(t); if (t2 === t) console.log('  MUTATION APPLIED NOTHING'); b = Buffer.from(t2); }
            if (state.mutModel && u === '/C4Live/c4-ui-model.js') { const t = b.toString('utf8'), t2 = state.mutModel(t); if (t2 === t) console.log('  MODEL MUTATION APPLIED NOTHING'); b = Buffer.from(t2); }
            r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); r.end(b);
        });
    });
    await new Promise(ok => server.listen(0, '127.0.0.1', ok));
    const base = 'http://127.0.0.1:' + server.address().port + '/C4Live/index.html';
    const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
    const SHOTS = process.env.SHOTS;
    if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
    async function open(query, opt) {
        opt = opt || {};
        const ctx = await browser.newContext({ viewport: opt.viewport || { width: 1440, height: 900 }, reducedMotion: opt.rm ? 'reduce' : 'no-preference' });
        const page = await ctx.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(String(e)));
        page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
        await page.goto(base + (query || ''));
        await page.waitForFunction(() => document.querySelector('#c4Empty') && document.querySelector('#c4Empty').hidden && document.querySelectorAll('.c4-tab').length > 0 && /ago|Live|Saved|min|\bs\b/i.test((document.querySelector('#c4Age') || {}).innerText || 'x'), null, { timeout: 25000 }).catch(() => {});
        await sleep(600);
        return { page, ctx, errors };
    }
    const isOpen = page => page.evaluate(() => { const e = document.querySelector('#c4StakeView'); return !!e && e.classList.contains('open') && !e.hidden; });
    const waitOpen = (page, ms) => page.waitForFunction(() => { const e = document.querySelector('#c4StakeView'); return e && e.classList.contains('open') && !e.hidden && e.querySelector('.sv-stage'); }, null, { timeout: ms || 8000 }).then(() => true, () => false);
    const waitClosed = (page, ms) => page.waitForFunction(() => { const e = document.querySelector('#c4StakeView'); return !e || e.hidden || !e.classList.contains('open'); }, null, { timeout: ms || 4000 }).then(() => true, () => false);
    const kpi = (page, key) => page.evaluate(k => { const e = document.querySelector('#c4StakeView [data-kpi="' + k + '"]'); return e ? e.innerText.replace(/\s+/g, ' ').trim() : null; }, key);
    const drawerOpen = page => page.evaluate(() => document.querySelector('#c4Drawer').classList.contains('open'));
    const shot = async (page, name) => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '.png') }); };
    const rowSel = a => '#c4Drawer li[data-stake="' + a + '"]';
    const res = {};
    try {
        // ---- A: from the OWNER drawer row, the full stake
        {
            const { page, ctx, errors } = await open('?owner=' + encodeURIComponent(FX.owner));
            try {
                const rows = await page.evaluate(() => [...document.querySelectorAll('#c4OwnerStakes li')].map(l => l.dataset.stake));
                res['owner drawer: every stake row carries data-stake (positive control: the fixture row is there)'] = rows.length >= 4 && rows.every(Boolean) && rows.includes(FX.FULL.a);
                await page.evaluate(() => { window.__fp = window.__fp || []; });
                await page.click(rowSel(FX.FULL.a));
                const ok = await waitOpen(page);
                res['owner row click opens the stake view'] = ok;
                await sleep(700);
                res['the map is sent to the stake system: focusPoint(x, y, high zoom)'] = await page.evaluate(([x, y]) => (window.__fp || []).some(f => f[0] === x && f[1] === y && f[2] >= 8), [FX.FULL.x, FX.FULL.y]);
                res['the drawer the visitor came from stays open underneath'] = await drawerOpen(page);
                const st = await page.evaluate(() => { const s = document.querySelector('.sv-stage'); const cells = [...s.querySelectorAll('.sv-t')]; return { tiles: cells.length, kinds: cells.map(c => c.dataset.kind), live: s.classList.contains('live'), con: s.classList.contains('con'), ground: s.dataset.ground, noground: s.classList.contains('noground'), more: !!s.querySelector('.sv-more'), dots: s.querySelectorAll('.sv-dot').length, z: cells.map(c => +c.style.zIndex) }; });
                res['full stake draws 13 tiles (12 rows, one with q 2), central hub among them'] = st.tiles === 13 && st.kinds.includes('central_hub') && st.kinds.filter(k => k === 'extractor').length === 2;
                res['tiles carry distinct painter z-order 1..13'] = new Set(st.z).size === 13 && Math.min(...st.z) === 1 && Math.max(...st.z) === 13;
                res['stage is the live one (state active, nothing under construction) with cargo dots from the extractors'] = st.live && !st.con && st.dots === 2;
                res['ground follows the planet type (ice-giant)'] = st.ground === 'ice-giant';
                res['no "+N more" on a 13-tile stake'] = !st.more;
                res['fuel shows 252'] = /252/.test(await kpi(page, 'fuel') || '');
                res['crew shows needed 4 / slots 6'] = /\b4\b.*\/\s*6/.test(await kpi(page, 'crew') || '');
                const pw = await kpi(page, 'power');
                res['power shows 120 / 95 and "+25 surplus", in the good colour'] = /120.*\/\s*95/.test(pw || '') && /\+25 surplus/.test(pw || '') && await page.evaluate(() => document.querySelector('[data-kpi="power"]').classList.contains('good'));
                res['slots show 20 / 65'] = /20.*\/\s*65/.test(await kpi(page, 'slots') || '');
                const sg = await kpi(page, 'storage');
                res['storage shows 2,092 / 5,000 and 42% full'] = /2,092.*\/\s*5,000/.test(sg || '') && /42% full/.test(sg || '');
                res['rent shows 12.50 ATLAS'] = /12\.50\s*ATLAS/.test(await kpi(page, 'rent') || '');
                res['buildings shows 13 (sum of q)'] = /\b13\b/.test(await kpi(page, 'buildings') || '');
                const txt = await page.evaluate(() => document.querySelector('#c4StakeView').innerText);
                res['production per hour: Hydrogen 1,800 and Fuel 36 (x 3600 of the per-second rate)'] = /Hydrogen\s*\n?\s*1,800/.test(txt) && /Fuel\s*\n?\s*36/.test(txt);
                res['inventory lists Hydrogen / Fuel / Ammunition'] = /Inventory[\s\S]*Ammunition/i.test(txt);
                res['no research number, no em dash in the view text'] = !/\u2014/.test(txt);
                res['a building name with markup is shown as text (no injected image, no script ran)'] = await page.evaluate(() => !document.querySelector('#c4StakeView img[src="x"]') && !window.__xss) && /Zed <img/.test(txt);
                res['links to owner, planet and system are there'] = await page.evaluate(() => ['owner', 'body', 'system'].every(k => document.querySelector('#c4StakeView [data-sv-go="' + k + '"]')));
                res['no gap note on a complete stake'] = await page.evaluate(() => !document.querySelector('#c4StakeView [data-gap]'));
                const fl = await page.evaluate(() => { const e = document.querySelector('[data-kpi="fuel"] .sv-last'); return e ? { t: e.innerText, low: e.classList.contains('low'), col: getComputedStyle(e).color, bad: (() => { const q = document.createElement('i'); q.style.color = 'var(--bad)'; document.body.appendChild(q); const c = getComputedStyle(q).color; q.remove(); return c; })(), ok: (() => { const q = document.createElement('i'); q.style.color = 'var(--ok)'; document.body.appendChild(q); const c = getComputedStyle(q).color; q.remove(); return c; })() } : null; });
                res['fuel line: 252 fuel / 63 per hour reads "lasts about 4.0 h"'] = !!fl && /lasts about 4\.0 h/.test(fl.t);
                res['fuel line under 6 hours takes the warning colour (the deficit colour of the Power stat)'] = !!fl && fl.low && fl.col === fl.bad && fl.bad !== fl.ok;
                res['consumption per hour: a "Consumption per hour" list with Power Cell 3.60 and Fuel 63'] = /Consumption per hour\s*Fuel\s*63\.0\s*\/h\s*Power Cell\s*3\.60/i.test(txt);
                res['storage 42% full, not "over capacity"'] = !/over capacity/.test(sg || '');
                await shot(page, 'desktop-full');
                // geometry: every tile sits inside the stage and the footprint centres are inside the clearing ellipse
                const geo = await page.evaluate(() => { const s = document.querySelector('.sv-stage').getBoundingClientRect(); return [...document.querySelectorAll('.sv-t')].every(t => { const r = t.getBoundingClientRect(); return r.left >= s.left - 1 && r.right <= s.right + 1 && r.top >= s.top - 1 && r.bottom <= s.bottom + 1; }); });
                res['every tile lies inside the stage box'] = geo;
                // close paths: Escape, X, scrim
                await page.keyboard.press('Escape');
                res['Escape closes the view'] = await waitClosed(page);
                res['Escape on the view leaves the drawer open (restored)'] = await drawerOpen(page);
                await page.click(rowSel(FX.FULL.a)); await waitOpen(page); await sleep(500);
                await page.click('#c4StakeView .sv-x');
                res['the X button closes the view'] = await waitClosed(page);
                res['X leaves the drawer open'] = await drawerOpen(page);
                await page.click(rowSel(FX.FULL.a)); await waitOpen(page); await sleep(500);
                await page.mouse.click(8, 450);
                res['a click on the scrim (outside the card) closes the view'] = await waitClosed(page);
                await page.click(rowSel(FX.FULL.a)); await waitOpen(page); await sleep(500);
                // links: owner opens the owner drawer
                await page.click('#c4StakeView [data-sv-go="body"]');
                res['the planet link closes the view and opens the planet drawer'] = await waitClosed(page) && await page.evaluate(n => /Ice giant planet|planet/i.test(document.querySelector('#c4Drawer .kind').innerText) && document.querySelector('#c4Drawer h2').innerText.includes(n), FX.planet.n);
                // from the planet drawer row
                const prow = '#c4Drawer li[data-stake="' + FX.FULL.a + '"]';
                const has = await page.waitForSelector(prow, { timeout: 5000 }).then(() => true, () => false);
                res['planet drawer: its stake rows carry data-stake'] = has;
                if (has) { await page.click(prow); res['planet row click opens the stake view'] = await waitOpen(page); }
                else res['planet row click opens the stake view'] = false;
                await sleep(500);
                await page.click('#c4StakeView [data-sv-go="owner"]');
                res['the owner link closes the view and opens the owner drawer'] = await waitClosed(page) && await page.evaluate(() => /Player|NPC/i.test(document.querySelector('#c4Drawer .kind').innerText));
                res['no page error in scenario A'] = errors.length === 0;
                if (errors.length) console.log('    errors: ' + errors.slice(0, 3).join(' | '));
            } finally { await ctx.close(); }
        }
        // ---- B: design state, deficit, cap, old data
        {
            const { page, ctx, errors } = await open('?owner=' + encodeURIComponent(FX.owner));
            try {
                await page.click(rowSel(FX.DESIGN.a)); const ok = await waitOpen(page); await sleep(600);
                res['design stake opens'] = ok;
                const d = await page.evaluate(() => { const s = document.querySelector('.sv-stage'); return { con: s.classList.contains('con'), live: s.classList.contains('live'), dots: s.querySelectorAll('.sv-dot').length, bar: (s.querySelector('.sv-conbar') || {}).innerText || '', ground: s.dataset.ground, tiles: s.querySelectorAll('.sv-t').length }; });
                res['design stake: under construction (dimmed), not live, no cargo dots'] = d.con && !d.live && d.dots === 0;
                res['design stake: a progress bar says "In design" with 2 h left (con.rem 7200)'] = /In design/.test(d.bar) && /2\.0 h left/.test(d.bar) && await page.evaluate(() => !!document.querySelector('.sv-conbar .sv-bar'));
                res['design stake: ground follows its own planet (volcanic) and 2 tiles are drawn'] = d.ground === 'volcanic' && d.tiles === 2;
                res['design stake: the dimmed tile style applies (opacity < 1)'] = await page.evaluate(() => +getComputedStyle(document.querySelector('.sv-stage .sv-t img')).opacity < 0.9);
                res['design stake: the state reads "design"'] = /design/.test(await kpi(page, 'state') || '');
                res['design stake: fuel 0 with a burn reads "empty", in the warning colour'] = await page.evaluate(() => { const e = document.querySelector('[data-kpi="fuel"] .sv-last'); return !!e && e.innerText === 'empty' && e.classList.contains('low'); });
                const sgd = await kpi(page, 'storage');
                res['design stake: used 1,200 > total 1,000 shows "over capacity" and a full bar'] = /over capacity/.test(sgd || '') && !/% full/.test(sgd || '') && await page.evaluate(() => document.querySelector('[data-kpi="storage"] .sv-bar i').style.width === '100%');
                await shot(page, 'desktop-design');
                await page.keyboard.press('Escape'); await waitClosed(page);
                // big stake: the cap
                await page.click(rowSel(FX.BIG.a)); await waitOpen(page); await sleep(500);
                const b = await page.evaluate(() => { const s = document.querySelector('.sv-stage'); return { tiles: s.querySelectorAll('.sv-t').length, more: (s.querySelector('.sv-more') || {}).innerText || '' }; });
                res['60-building stake draws exactly 37 tiles'] = b.tiles === 37;
                res['60-building stake says "+23 more buildings" (60 total - 37)'] = /\+23 more buildings/.test(b.more);
                const pw = await kpi(page, 'power');
                res['power deficit shows "-20 deficit" in the bad colour'] = /-20 deficit/.test(pw || '') && await page.evaluate(() => document.querySelector('[data-kpi="power"]').classList.contains('bad'));
                res['a nearly full store (96%) shows in the warning bar'] = await page.evaluate(() => !!document.querySelector('[data-kpi="storage"] .sv-bar i.hot'));
                res['big stake: 5 fuel at 0.036 per hour reads "lasts about 5.8 days", not in the warning colour'] = await page.evaluate(() => { const e = document.querySelector('[data-kpi="fuel"] .sv-last'); return !!e && /lasts about 5\.8 days/.test(e.innerText) && !e.classList.contains('low'); });
                await shot(page, 'desktop-big');
                await page.keyboard.press('Escape'); await waitClosed(page);
                // old data: a real stake without the new fields
                await page.click(rowSel(FX.OLD.a)); const ok2 = await waitOpen(page); await sleep(500);
                res['old-data stake opens'] = ok2;
                const o = await page.evaluate(() => ({ gap: (document.querySelector('[data-gap]') || {}).innerText || '', fuel: (document.querySelector('[data-kpi="fuel"] b') || {}).innerText, power: (document.querySelector('[data-kpi="power"] b') || {}).innerText, storage: (document.querySelector('[data-kpi="storage"] b') || {}).innerText, rent: (document.querySelector('[data-kpi="rent"] b') || {}).innerText, buildings: (document.querySelector('[data-kpi="buildings"] b') || {}).innerText, tiles: document.querySelectorAll('.sv-t').length, live: document.querySelector('.sv-stage').classList.contains('live'), empty: (document.querySelector('.sv-empty') || {}).innerText || '' }));
                res['old data: one line says "Not read yet - refresh"'] = /Not read yet - refresh/.test(o.gap);
                res['old data: fuel, power, storage, rent, buildings show "-", never 0'] = [o.fuel, o.power, o.storage, o.rent, o.buildings].every(v => v === '-');
                res['old data: no tiles drawn, stage says no building list, no motion'] = o.tiles === 0 && /Not read yet/.test(o.empty) && !o.live;
                res['old data: crew needed and slots total still show (what the copy has)'] = new RegExp('^CREW NEEDED / SLOTS ' + FX.OLD.crew + ' / -$', 'i').test(await kpi(page, 'crew') || '') && new RegExp('/ ' + FX.OLD.slots + '$').test(await kpi(page, 'slots') || '');
                res['old data: no "lasts" line, no 0 hours, no Consumption heading'] = await page.evaluate(() => !document.querySelector('#c4StakeView .sv-last') && !/Consumption per hour/.test(document.querySelector('#c4StakeView').innerText) && !/lasts about|empty/.test(document.querySelector('[data-kpi="fuel"]').innerText));
                await shot(page, 'desktop-old');
                res['no page error in scenario B'] = errors.length === 0;
                if (errors.length) console.log('    errors: ' + errors.slice(0, 3).join(' | '));
            } finally { await ctx.close(); }
        }
        // ---- C: reduced motion (positive control: the same element animates without it)
        {
            const probe = page => page.evaluate(() => { const g = sel => { const e = document.querySelector(sel); return e ? getComputedStyle(e) : null; }; const img = g('.sv-stage .k-extractor img'), dot = g('.sv-stage .sv-dot'), sv = g('#c4StakeView'); return { img: img && img.animationName, dot: dot && dot.display, tr: sv && sv.transitionDuration }; });
            const norm = await open('?stake=' + encodeURIComponent(FX.FULL.a));
            try {
                res['deep link ?stake=<address> opens the view'] = await waitOpen(norm.page);
                await sleep(600);
                const p = await probe(norm.page);
                res['positive control: with motion on, the extractor animates (sv-bob) and the cargo dots are shown'] = p.img === 'sv-bob' && p.dot === 'block';
                await shot(norm.page, 'deeplink');
            } finally { await norm.ctx.close(); }
            const rm = await open('?stake=' + encodeURIComponent(FX.FULL.a), { rm: true });
            try {
                res['reduced motion: the view still opens'] = await waitOpen(rm.page);
                const p = await probe(rm.page);
                res['reduced motion: no tile animation, no cargo dots, no open transition'] = p.img === 'none' && p.dot === 'none' && /^0s/.test(p.tr || '');
            } finally { await rm.ctx.close(); }
            const bad = await open('?stake=' + encodeURIComponent('nope<script>'));
            try { await sleep(800); res['an unknown ?stake= value opens nothing and breaks nothing'] = !(await isOpen(bad.page)) && bad.errors.length === 0; } finally { await bad.ctx.close(); }
        }
        // ---- D: a data reload keeps the view open and fresh
        {
            const { page, ctx, errors } = await open('?stake=' + encodeURIComponent(FX.FULL.a));
            try {
                await waitOpen(page); await sleep(500);
                const before = await kpi(page, 'fuel');
                const L2 = JSON.parse(state.latest); L2.stakes.find(s => s.a === FX.FULL.a).fuel = 999; L2.generatedAt += 60;
                const keep = state.latest; state.latest = JSON.stringify(L2);
                await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
                const fresh = await page.waitForFunction(() => /999/.test((document.querySelector('#c4StakeView [data-kpi="fuel"]') || {}).innerText || ''), null, { timeout: 8000 }).then(() => true, () => false);
                state.latest = keep;
                res['a data reload redraws the open view from the fresh data (fuel 252 -> 999)'] = /252/.test(before || '') && fresh && await isOpen(page);
                res['no page error in scenario D'] = errors.length === 0;
            } finally { await ctx.close(); }
        }
        // ---- D2 (2026-11-23 page review): focus behind a modal, the Tab trap, the D key
        {
            const { page, ctx, errors } = await open('?owner=' + encodeURIComponent(FX.owner));
            try {
                await page.click(rowSel(FX.FULL.a)); await waitOpen(page); await sleep(500);
                res['crew 4 / 6 (needed under slots): no "needs more crew" note (positive control for the next scenario)'] = !/needs more crew/.test(await kpi(page, 'crew') || '');
                const inView = () => page.evaluate(() => !!document.activeElement && document.activeElement.closest('#c4StakeView') !== null);
                const focusables = "[...document.querySelector('#c4StakeView').querySelectorAll('button, [href], input, select, textarea, [tabindex]')].filter(n => !n.disabled && n.tabIndex >= 0 && !n.closest('[hidden]'))";
                res['before the reload focus is on the view (the close button)'] = await inView();
                const L2 = JSON.parse(state.latest); L2.stakes.find(s => s.a === FX.FULL.a).fuel = 777; L2.generatedAt += 90;
                const keep = state.latest; state.latest = JSON.stringify(L2);
                await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
                const fresh = await page.waitForFunction(() => /777/.test((document.querySelector('#c4StakeView [data-kpi="fuel"]') || {}).innerText || ''), null, { timeout: 8000 }).then(() => true, () => false);
                await sleep(500); state.latest = keep;
                res['reload while the view is open: the view redrew (fuel 777, positive control)'] = fresh;
                res['reload while the view is open: focus is still inside #c4StakeView (not the drawer behind)'] = await inView();
                res['the view has at least 3 focusable elements (the trap is exercised, not trivial)'] = await page.evaluate('(' + focusables + ').length >= 3');
                await page.evaluate('(function () { var f = ' + focusables + '; f[f.length - 1].focus(); })()');
                await page.keyboard.press('Tab');
                res['Tab from the last focusable element of the view lands on the first'] = await page.evaluate('(function () { var f = ' + focusables + '; return document.activeElement === f[0]; })()');
                await page.keyboard.press('Shift+Tab');
                res['Shift+Tab from the first focusable element lands on the last'] = await page.evaluate('(function () { var f = ' + focusables + '; return document.activeElement === f[f.length - 1]; })()');
                await page.evaluate(() => { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); });
                const dock = () => page.evaluate(() => document.querySelector('#c4Dock').classList.contains('collapsed'));
                const d0 = await dock();
                await page.keyboard.press('d'); await sleep(250);
                res['D with the view open does not collapse the dock'] = d0 === false && await dock() === false;
                await page.keyboard.press('Escape'); await waitClosed(page);
                await page.keyboard.press('Escape');   // the drawer behind
                await sleep(300);
                await page.keyboard.press('d'); await sleep(250);
                res['positive control: D with the view closed does collapse the dock'] = await dock() === true;
                res['no page error in scenario D2'] = errors.length === 0;
            } finally { await ctx.close(); }
        }
        // ---- D3: chain names and quantities that are not what they look like (constructor, __proto__, q of 0 / -3 / 2.7 / "4" / null), crew above slots
        {
            const { page, ctx, errors } = await open('?stake=' + encodeURIComponent(FX.ODD.a));
            const reqs = []; page.on('request', r => reqs.push(r.url()));
            try {
                await page.goto(base + '?stake=' + encodeURIComponent(FX.ODD.a));   // again, with the request log attached before the tiles load
                await waitOpen(page); await sleep(900);
                const st = await page.evaluate(() => { const tiles = [...document.querySelectorAll('.sv-stage .sv-t')]; const hub = tiles.find(t => t.dataset.kind === 'central_hub'); return { n: tiles.length, hubLeft: hub ? parseFloat(hub.style.left) : null, lefts: tiles.map(t => parseFloat(t.style.left)), kinds: tiles.map(t => t.dataset.kind), alts: tiles.map(t => (t.querySelector('img') || {}).alt) }; });
                res['odd names: 6 tiles (1 + 1 + 1 + 1 + 2.7 floored to 2), the rest left out'] = st.n === 6 && st.kinds.filter(k => k === 'extractor').length === 2;
                res['odd names: the central hub is the only tile at the centre column (50 %), not displaced by constructor / __proto__'] = st.hubLeft !== null && Math.abs(st.hubLeft - 50) < 0.01 && st.lefts.filter(l => Math.abs(l - 50) < 0.01).length === 1;
                res['odd names: no tile alt text is the source of a function'] = st.alts.every(a => typeof a === 'string' && !/function|native code/.test(a));
                const img = await page.evaluate(() => [...document.querySelectorAll('.sv-stage .sv-t')].filter(t => t.dataset.kind === 'constructor' || t.dataset.kind === '__proto__').map(t => t.querySelector('img').getAttribute('src')));
                res['odd names: both unknown kinds draw the fallback tile (the processor file)'] = img.length === 2 && img.every(s => /processor/.test(s));
                res['odd names: no request for constructor.webp / __proto__.webp; positive control: tile images were requested'] = !reqs.some(u => /constructor|__proto__/.test(u)) && reqs.some(u => /\/Images\/stake\/[\w.-]+\.webp/.test(u));
                const lis = await page.evaluate(() => [...document.querySelectorAll('#c4StakeView .sv-sec ul li')].filter(li => li.querySelector('img')).map(li => li.querySelector('.n').innerText.replace(/\s+/g, ' ').trim()));
                res['building list prints the one rule: "x 2" for 2.7, a dash for 0, -3, "4", null; never "x -3", "x 2.7" or "x 4"'] = lis.filter(t => t === '-').length === 4 && lis.includes('x 2') && !lis.some(t => /-3|2\.7|x 4/.test(t));
                res['buildings total equals the tiles (6)'] = /\b6\b/.test(await kpi(page, 'buildings') || '') && st.n === 6;
                const crew = await kpi(page, 'crew');
                res['crew 8 / 6: shows the numbers and the note "needs more crew than its slots give"'] = /8.*\/\s*6/.test(crew || '') && /needs more crew than its slots give/.test(crew || '');
                res['crew note is plain text: no warning colour (not the bad or warn colour, no low / bad class)'] = await page.evaluate(() => { const n = document.querySelector('[data-kpi="crew"] small'); if (!n || n.classList.contains('low') || n.classList.contains('bad')) return false; const probe = c => { const e = document.createElement('i'); e.style.color = c; document.body.appendChild(e); const v = getComputedStyle(e).color; e.remove(); return v; }; const col = getComputedStyle(n).color; const root = getComputedStyle(document.documentElement); return col !== probe(root.getPropertyValue('--bad').trim() || 'red') && col !== probe(root.getPropertyValue('--warn').trim() || 'orange') && !document.querySelector('[data-kpi="crew"]').classList.contains('bad'); });
                res['odd names: Object.prototype untouched after the view rendered'] = await page.evaluate(() => ({}).ups === undefined && ({}).ph === undefined && ({}).qty === undefined);
                await shot(page, 'desktop-odd');
                res['no page error in scenario D3'] = errors.length === 0;
            } finally { await ctx.close(); }
        }
        // ---- E: a missing ground image degrades to a plain stage
        {
            state.noGround = true;
            const { page, ctx, errors } = await open('?stake=' + encodeURIComponent(FX.FULL.a));
            try {
                const ok = await waitOpen(page); await sleep(600);
                res['no ground image: the view still opens with its tiles'] = ok && await page.evaluate(() => document.querySelectorAll('.sv-t').length === 13);
                res['no ground image: the stage is plain (noground), no broken image left'] = await page.evaluate(() => document.querySelector('.sv-stage').classList.contains('noground') && ![...document.querySelectorAll('.sv-stage img.sv-ground')].some(i => i.complete && i.naturalWidth === 0));
                await shot(page, 'desktop-noground');
                res['no page error with no ground'] = errors.length === 0;
            } finally { state.noGround = false; await ctx.close(); }
        }
        // ---- F: phone
        {
            const { page, ctx, errors } = await open('?owner=' + encodeURIComponent(FX.owner), { viewport: { width: 390, height: 844 } });
            try {
                await page.click(rowSel(FX.FULL.a)); const ok = await waitOpen(page); await sleep(700);
                res['phone: the view opens from the owner row'] = ok;
                const g = await page.evaluate(() => { const v = document.querySelector('#c4StakeView').getBoundingClientRect(), s = document.querySelector('.sv-stage').getBoundingClientRect(), c = document.querySelector('#c4StakeCard'); return { vw: innerWidth, vh: innerHeight, v: [v.left, v.top, v.width, v.height], sw: s.width, sl: s.left, sr: s.right, scroll: c.scrollWidth, cw: c.clientWidth }; });
                res['phone: the view is full screen'] = g.v[2] >= g.vw - 1 && g.v[3] >= g.vh - 1;
                res['phone: the stage fits the width and nothing scrolls sideways'] = g.sl >= 0 && g.sr <= g.vw + 1 && g.scroll <= g.cw + 1;
                await shot(page, 'phone-full');
                await page.click('#c4StakeView .sv-x'); await waitClosed(page);
                await page.click(rowSel(FX.DESIGN.a)); await waitOpen(page); await sleep(600); await shot(page, 'phone-design');
                await page.click('#c4StakeView .sv-x'); await waitClosed(page);
                await page.click(rowSel(FX.OLD.a)); await waitOpen(page); await sleep(600); await shot(page, 'phone-old');
                res['no page error on the phone'] = errors.length === 0;
                if (errors.length) console.log('    errors: ' + errors.slice(0, 3).join(' | '));
            } finally { await ctx.close(); }
        }
        // ---- G: a REAL stake from the collector files (when the saved data already carries the building fields)
        {
            const real = JSON.parse(fs.readFileSync(path.join(ROOT, 'Data', 'c4-live', 'latest.json'), 'utf8')).stakes.filter(s => s.a !== FX.OLD.a && Array.isArray(s.bl) && s.bl.length).sort((a, b) => b.bl.reduce((x, y) => x + y.q, 0) - a.bl.reduce((x, y) => x + y.q, 0))[0];
            if (!real) console.log('  (no real stake with building data in Data/c4-live yet: scenario G skipped)');
            else {
                const { page, ctx, errors } = await open('?stake=' + encodeURIComponent(real.a));
                try {
                    const ok = await waitOpen(page); await sleep(700);
                    const total = real.bl.reduce((x, y) => x + y.q, 0);
                    const g = await page.evaluate(() => ({ tiles: document.querySelectorAll('.sv-stage .sv-t').length, more: (document.querySelector('.sv-more') || {}).innerText || '', kinds: [...new Set([...document.querySelectorAll('.sv-t')].map(t => t.dataset.kind))], imgs: [...document.querySelectorAll('.sv-t img')].every(i => i.complete && i.naturalWidth > 0), gap: !!document.querySelector('[data-gap]') }));
                    res['real stake (' + total + ' buildings) opens from ?stake= with min(total, 37) tiles'] = ok && g.tiles === Math.min(total, 37);
                    res['real stake: every tile image loaded (no broken image) and "+N more" matches'] = g.imgs && (total > 37 ? g.more === '+' + (total - 37) + ' more building' + (total - 37 === 1 ? '' : 's') : g.more === '');
                    res['real stake: no page error'] = errors.length === 0;
                    await shot(page, 'desktop-real');
                } finally { await ctx.close(); }
            }
        }
        for (const [k, v] of Object.entries(res)) check(k, v);

        // ---- negative controls: break one thing, the matching checks must fail
        console.log('\n[2b] Negative controls (the page is rerun with one thing broken)');
        const NEG = [
            ['click wiring broken (data-stake handler removed)', { mut: s => s.replace("const stk = t.closest('[data-stake]'); if (stk) { openStake(stk.dataset.stake); return; }", '') }, async page => { await page.click(rowSel(FX.FULL.a)); return await waitOpen(page, 2500); }, 'owner row click opens the stake view'],
            ['Escape handler removed', { mut: s => s.replace("if (e.key === 'Escape' && S.stake) { closeStake(); return; }", '') }, async page => { await page.click(rowSel(FX.FULL.a)); await waitOpen(page); await sleep(400); await page.keyboard.press('Escape'); return await waitClosed(page, 1500); }, 'Escape closes the view'],
            ['tile cap 37 -> 38 in the model', { mutModel: s => s.replace('STAKE_CAP = 37', 'STAKE_CAP = 38') }, async page => { await page.click(rowSel(FX.BIG.a)); await waitOpen(page); await sleep(300); return await page.evaluate(() => document.querySelectorAll('.sv-stage .sv-t').length === 37); }, '60-building stake draws exactly 37 tiles'],
            ['missing fuel shown as 0', { mutModel: s => s.replace("fuel: has('fuel') ? num(k.fuel) : null", "fuel: has('fuel') ? num(k.fuel) : 0") }, async page => { await page.click(rowSel(FX.OLD.a)); await waitOpen(page); await sleep(300); return await page.evaluate(() => (document.querySelector('[data-kpi="fuel"] b') || {}).innerText === '-'); }, 'old data: fuel, power, storage, rent, buildings show "-", never 0'],
            ['fuel line shown for 0 hours as nothing (hours <= 0 hidden)', { mut: s => s.replace("if (h == null || !isFinite(h) || h < 0) return '';", "if (!h) return '';") }, async page => { await page.click(rowSel(FX.DESIGN.a)); await waitOpen(page); await sleep(300); return await page.evaluate(() => { const e = document.querySelector('[data-kpi="fuel"] .sv-last'); return !!e && e.innerText === 'empty'; }); }, 'design stake: fuel 0 with a burn reads "empty", in the warning colour'],
            ['fuel warning threshold 6 h -> 2 h', { mut: s => s.replace("${h < 6 ? ' low' : ''}", "${h < 2 ? ' low' : ''}") }, async page => { await page.click(rowSel(FX.FULL.a)); await waitOpen(page); await sleep(300); return await page.evaluate(() => { const e = document.querySelector('[data-kpi="fuel"] .sv-last'); return !!e && e.classList.contains('low'); }); }, 'fuel line under 6 hours takes the warning colour (the deficit colour of the Power stat)'],
            ['over capacity shown as a percent', { mut: s => s.replace("sg.used > sg.total ? 'over capacity' : ", "") }, async page => { await page.click(rowSel(FX.DESIGN.a)); await waitOpen(page); await sleep(300); return await page.evaluate(() => /over capacity/.test(document.querySelector('[data-kpi="storage"]').innerText)); }, 'design stake: used 1,200 > total 1,000 shows "over capacity" and a full bar'],
            ['focus kept after a redraw: refocus removed', { mut: s => s.replace('const refocus = () => { if (hadFocus) {', 'const refocus = () => { if (false) {') }, async page => { await page.click(rowSel(FX.FULL.a)); await waitOpen(page); await sleep(500); const L2 = JSON.parse(state.latest); L2.stakes.find(s => s.a === FX.FULL.a).fuel = 778; L2.generatedAt += 120; const keep = state.latest; state.latest = JSON.stringify(L2); await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange'))); await page.waitForFunction(() => /778/.test((document.querySelector('#c4StakeView [data-kpi="fuel"]') || {}).innerText || ''), null, { timeout: 8000 }); await sleep(400); state.latest = keep; return await page.evaluate(() => !!document.activeElement && document.activeElement.closest('#c4StakeView') !== null); }, 'reload while the view is open: focus is still inside'],
            ['openDrawer takes focus behind the open view again (refocus also removed)', { mut: s => s.replace('if (!S.stake) d.focus({ preventScroll: true });', 'd.focus({ preventScroll: true });').replace('const refocus = () => { if (hadFocus) {', 'const refocus = () => { if (false) {') }, async page => { await page.click(rowSel(FX.FULL.a)); await waitOpen(page); await sleep(500); const L2 = JSON.parse(state.latest); L2.generatedAt += 130; const keep = state.latest; state.latest = JSON.stringify(L2); await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange'))); await sleep(2500); state.latest = keep; return await page.evaluate(() => !!document.activeElement && document.activeElement.closest('#c4StakeView') !== null); }, 'reload while the view is open: focus is still inside'],
            ['focus trap removed', { mut: s => s.replace("if (S.stake) { if (e.key === 'Tab') svTrap(e); return; }", 'if (S.stake) { return; }') }, async page => { await page.click(rowSel(FX.FULL.a)); await waitOpen(page); await sleep(500); await page.evaluate(() => { const f = [...document.querySelector('#c4StakeView').querySelectorAll('button, [href], input, select, textarea, [tabindex]')].filter(n => !n.disabled && n.tabIndex >= 0 && !n.closest('[hidden]')); f[f.length - 1].focus(); }); await page.keyboard.press('Tab'); return await page.evaluate(() => { const f = [...document.querySelector('#c4StakeView').querySelectorAll('button, [href], input, select, textarea, [tabindex]')].filter(n => !n.disabled && n.tabIndex >= 0 && !n.closest('[hidden]')); return document.activeElement === f[0]; }); }, 'Tab from the last focusable element of the view lands on the first'],
            ['D key active behind the view again', { mut: s => s.replace("if (S.stake) { if (e.key === 'Tab') svTrap(e); return; }", "if (S.stake && e.key === 'Tab') { svTrap(e); return; }") }, async page => { await page.click(rowSel(FX.FULL.a)); await waitOpen(page); await sleep(500); await page.evaluate(() => { document.activeElement && document.activeElement.blur(); }); await page.keyboard.press('d'); await sleep(250); return await page.evaluate(() => !document.querySelector('#c4Dock').classList.contains('collapsed')); }, 'D with the view open does not collapse the dock'],
            ['inherited kind takes a priority (constructor)', { mutModel: s => s.replace('b && ownKey(STAKE_PRIORITY, b.k) ? STAKE_PRIORITY[b.k] : 5', 'b && STAKE_PRIORITY[b.k] != null ? STAKE_PRIORITY[b.k] : 5') }, async page => { await page.goto(page.url().split('?')[0] + '?stake=' + encodeURIComponent(FX.ODD.a)); await waitOpen(page); await sleep(600); return await page.evaluate(() => { const hub = [...document.querySelectorAll('.sv-stage .sv-t')].find(t => t.dataset.kind === 'central_hub'); return !!hub && Math.abs(parseFloat(hub.style.left) - 50) < 0.01; }); }, 'the central hub is the only tile at the centre column'],
            ['tile table read without an own-property test (constructor.webp requested)', { mut: s => s.replace("const t = (own(SV.tiles.tiles, kind) && SV.tiles.tiles[kind]) || (own(SV.tiles.tiles, 'processor') && SV.tiles.tiles.processor) ||", 'const t = SV.tiles.tiles[kind] || SV.tiles.tiles.processor ||') }, async page => { const reqs = []; page.on('request', r => reqs.push(r.url())); await page.goto(page.url().split('?')[0] + '?stake=' + encodeURIComponent(FX.ODD.a)); await waitOpen(page); await sleep(800); return !reqs.some(u => /constructor|__proto__/.test(u)); }, 'no request for constructor.webp'],
            ['crew note removed', { mut: s => s.replace("v.crew.over ? '<small class=\"sv-crewnote\">needs more crew than its slots give</small>' : ''", "''") }, async page => { await page.goto(page.url().split('?')[0] + '?stake=' + encodeURIComponent(FX.ODD.a)); await waitOpen(page); await sleep(500); return /needs more crew than its slots give/.test(await kpi(page, 'crew') || ''); }, 'crew 8 / 6: shows the numbers and the note'],
            ['building list prints the raw quantity', { mut: s => s.replace("${b.qty == null ? svDash : 'x ' + F(b.qty, 0)}", 'x ${F(b.q, 0)}') }, async page => { await page.goto(page.url().split('?')[0] + '?stake=' + encodeURIComponent(FX.ODD.a)); await waitOpen(page); await sleep(500); const lis = await page.evaluate(() => [...document.querySelectorAll('#c4StakeView .sv-sec ul li')].filter(li => li.querySelector('img')).map(li => li.querySelector('.n').innerText.replace(/\s+/g, ' ').trim())); return lis.filter(t => t === '-').length === 4 && lis.includes('x 2') && !lis.some(t => /-3|2\.7|x 4/.test(t)); }, 'building list prints the one rule'],
            ['reduced-motion rule removed from the CSS', { css: true }, async page => { await page.click(rowSel(FX.FULL.a)); await waitOpen(page); await sleep(400); return await page.evaluate(() => getComputedStyle(document.querySelector('.sv-stage .k-extractor img')).animationName === 'none'); }, 'reduced motion: no tile animation, no cargo dots, no open transition']
        ];
        // each probe is first run on the UNBROKEN page (it must say true: positive control, so a probe that cannot pass
        // proves nothing), then on the broken page (it must say false; a thrown error is reported as ERR, not as a pass)
        async function runProbe(m, probe, broken) {
            state.mut = broken ? m.mut || null : null; state.mutModel = broken ? m.mutModel || null : null;
            const { page, ctx } = await open('?owner=' + encodeURIComponent(FX.owner), { rm: !!m.css });
            try {
                if (m.css && broken) await page.evaluate(() => { for (const sh of document.styleSheets) { if (!/c4.css/.test(sh.href || "")) continue; let rules; try { rules = sh.cssRules; } catch (e) { continue; } for (let i = rules.length - 1; i >= 0; i--) if (rules[i].type === CSSRule.MEDIA_RULE && /reduce/.test(rules[i].conditionText || rules[i].media.mediaText)) { sh.deleteRule(i); window.__del = (window.__del || 0) + 1; } } });
                return await probe(page);
            } catch (e) { return 'ERR ' + String(e).split('\n')[0]; } finally { state.mut = null; state.mutModel = null; await ctx.close(); }
        }
        for (const [name, m, probe, label] of NEG) {
            const good = await runProbe(m, probe, false);
            // the CSS mutant's control must run under reduced motion with the rule INTACT, so the unbroken page says "none" = true
            const bad = await runProbe(m, probe, true);
            check('negative control "' + name + '": the probe passes on the unbroken page (positive control, observed ' + good + ')', good === true);
            check('negative control "' + name + '": the check "' + label + '" FAILS on the broken page (observed ' + bad + ')', bad === false);
        }
    } finally { await browser.close(); server.close(); }
}
// ------------------------------------------------------------------ the link to the Stake Builder (2026-11-26, node only)
// The contract with the Stake Builder page: ?stake=<claim stake ACCOUNT address>, any stake in the read, the same tab family
// (../ClaimStakeExplorer/index.html), a new tab with noopener. The two source lines (esc and stakeBuilderLink) are cut out of
// app.js and run here; each guard also has a mutant that must FAIL.
function runLinkPart() {
    console.log('\n[L] the Stake Builder link in the stake view (node, source of app.js cut out and run)');
    const APP = fs.readFileSync(path.join(ROOT, 'C4Live', 'app.js'), 'utf8');
    const grab = re => { const m = APP.match(re); if (!m) throw new Error('not found in app.js: ' + re); return m[0]; };
    const escSrc = grab(/const esc = s => .*\n/), linkSrc = grab(/const stakeBuilderLink = a => .*\n/);
    const make = (mut) => { let l = linkSrc; if (mut) { if (l.split(mut[0]).length !== 2) throw new Error('mutant anchor: ' + mut[0]); l = l.replace(mut[0], () => mut[1]); } return new Function(escSrc + l + '; return stakeBuilderLink;')(); };
    const run = (fn) => {
        const plain = 'StakeAcct1111111111111111111111111111111111', evil = 'A"><img src=x onerror=1>&b c/d?e#f';
        return {
            href: fn(plain).includes('href="../ClaimStakeExplorer/index.html?stake=' + plain + '"'),
            attrs: /target="_blank" rel="noopener"/.test(fn(plain)) && /class="sv-link"/.test(fn(plain)) && />Open in the Stake Builder<\/a>/.test(fn(plain)),
            enc: fn(evil).includes('?stake=' + encodeURIComponent(evil) + '"') && !/[<>]/.test(fn(evil).replace(/<\/?(span|a)\b[^>]*>/g, '')) && !fn(evil).includes('<img'),
            none: fn('') === '' && fn(null) === '' && fn(undefined) === '',
        };
    };
    const real = run(make());
    check('[L] the href is ../ClaimStakeExplorer/index.html?stake=<address> for an address that needs no escaping', real.href);
    check('[L] opens in a new tab with noopener, styled as sv-link, labelled "Open in the Stake Builder"', real.attrs);
    check('[L] a hostile address is percent-encoded into the query and cannot break out of the attribute', real.enc);
    check('[L] no link for a stake with no account address', real.none);
    check('[L] the stake view puts the link into the page for every stake (svHtml calls stakeBuilderLink(v.k.a), not only the visitor\'s)', /\$\{stakeBuilderLink\(v\.k\.a\)\}/.test(APP) && !/HP\.|S\.mine/.test(linkSrc));
    // negative: with each guard compiled out the matching probe must fail; positive control = the unbroken run passed above
    const muts = [['encodeURIComponent dropped', ['encodeURIComponent(a)', 'a'], 'enc'], ['wrong query name', ['?stake=', '?s='], 'href'], ['noopener dropped', [' rel="noopener"', ''], 'attrs'], ['a missing address still gets a link', ['a ? `', 'true ? `'], 'none']];
    for (const [name, mut, key] of muts) { const r = run(make(mut)); check('[L] negative "' + name + '": passes unbroken, FAILS with the guard removed', real[key] === true && r[key] === false, 'unbroken ' + real[key] + ', broken ' + r[key]); }
}
(async () => {
    runModelPart();
    runLinkPart();
    await runBrowser();
    console.log('\n' + pass + ' passed, ' + fail + ' failed');
    process.exit(fail ? 1 : 0);
})().catch(e => { console.log('CRASH ' + (e && e.stack || e)); process.exit(2); });
