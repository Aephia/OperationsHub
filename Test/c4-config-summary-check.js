// c4-config-summary-check.js - Tools/c4-live/config-summary.mjs against a hand-made set of tables whose answers are
// typed below (not computed by the tool's own code), then source mutants that must each make a check fail, then the
// committed C4Live/config-summary.json for shape. Offline. Prints "N passed, M failed".
//   node Test/c4-config-summary-check.js
const fs = require('fs'), os = require('os'), path = require('path'), { pathToFileURL } = require('url');
const ROOT = path.join(__dirname, '..');
const TOOL = path.join(ROOT, 'Tools', 'c4-live', 'config-summary.mjs');
const SRC = fs.readFileSync(TOOL, 'utf8');

const C = (id, name, categoryId) => ({ id, name, categoryId });
const I = (id, q) => ({ id, quantityRaw: String(q) });
const REC = (name, ins, out, lvl, extra) => Object.assign({ name, ingredients: ins, outputs: [out], minimumStarbaseLevel: 'level-' + lvl, researchRequirementIds: [], fee: { amountAtlas: 0.5 } }, extra || {});
const SHIP = (name, sizeClass, cargo, req) => ({ name, sizeClass, componentRequirements: req || [], stats: { cargo: { cargoCapacity: String(cargo), fuelCapacity: '10', ammoCapacity: '1', miningRate: { value: 0.25 } }, misc: { requiredCrew: 2, recoveryFeeAtlas: 4, respawnTimeWithoutFeeSeconds: 60 }, combat: { hp: 5, sp: 6 }, movement: { warpFuelConsumptionRate: { value: 1 }, subwarpFuelConsumptionRate: { value: 1 }, warpSpeed: { value: 1 }, warpLaneSpeed: { value: 1 } } } });
function tables() {
    return {
        index: { takenAt: 1795000000, epoch: { sage: 42 } },
        cargo: { rows: [C(1, 'OreA', 2), C(2, 'OreB', 2), C(3, 'Plate', 4), C(4, 'Frame', 4), C(5, 'Part', 6), C(6, 'Loop1', 4), C(7, 'Loop2', 4)] },
        recipes: { rows: [
            REC('Plate', [I(1, 2)], I(3, 1), 1),                                   // Plate = 2 raw
            REC('Frame', [I(3, 3), I(2, 1)], I(4, 2), 2, { researchRequirementIds: [9] }),   // (3 x 2 + 1) / 2 = 3.5
            REC('Frame (alt)', [I(1, 10)], I(4, 1), 2, { fee: { amountAtlas: 0 } }),          // 10: the dearer way
            REC('Part', [I(4, 2), I(3, 1)], I(5, 1), 3),                           // cheapest 2 x 3.5 + 2 = 9; dearest 2 x 10 + 2 = 22
            REC('Loop1', [I(7, 1)], I(6, 1), 1), REC('Loop2', [I(6, 1)], I(7, 1), 1)]   // a loop: no finite cost, left out
        },
        ship_configurations: { rows: [SHIP('A Default Config', 'small', 100), SHIP('B Default Config', 'small', 300), SHIP('A Tier One Config', 'small', 100, [{ cargoId: 5, quantityRaw: '2' }]), SHIP('T Default Config', 'titan', 9000)] },
        research_catalog: { rows: [{ name: 'Lane Cut', atlasCost: 350, cargoCosts: [], modifier: { warpLaneFeeModifier: -0.25 } }, { name: 'Other', atlasCost: 350, cargoCosts: [{}], modifier: { warpLaneFeeModifier: 0 } }, { name: 'Free', atlasCost: 0, cargoCosts: [], modifier: {} }] },
        faction_relations: { rows: [{ alliedTollBps: 5000, neutralTollBps: 20000, territoryAccessEnabled: false, crossFactionEconomicsEnabled: false }] },
        atlas_reward_config: { rows: [{ upgradeLpRates: [{ cargo: { id: 4, name: 'Frame' }, lpPerRawUnit: '7' }, { cargo: { id: 5, name: 'Part' }, lpPerRawUnit: '3' }] }] },
        claim_stake_definitions: { rows: [{ name: 'Stake T1', slots: 65, rentMultiplier: { value: 1 }, placementFeeMultiplier: { value: 16 } }] }
    };
}

function suite(summarize, quiet) {
    const res = { pass: 0, fail: 0, names: [] };
    const ok = (name, cond, detail) => { if (cond) res.pass++; else { res.fail++; res.names.push(name); if (!quiet) console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); } };
    let s;
    try { s = summarize(tables()); } catch (e) { ok('summarize runs on the fixture', false, String(e && e.message)); return res; }
    const r = s.recipes, dear = Object.fromEntries(r.dear.map(d => [d.r, d]));
    ok('stamp: taken at and game version', s.takenAt === 1795000000 && s.sage === 42);
    ok('recipes: 6 rows, 5 items, 1 item made two ways, 1 gated by research, 5 with a fee of 0.5', r.n === 6 && r.outputs === 5 && r.multi === 1 && r.gated === 1 && r.withFee === 5 && r.feeAtlas === 0.5, JSON.stringify([r.n, r.outputs, r.multi, r.gated, r.withFee, r.feeAtlas]));
    ok('recipes by starbase level: 3 / 2 / 1', JSON.stringify(r.byLevel) === JSON.stringify([{ lvl: 1, n: 3 }, { lvl: 2, n: 2 }, { lvl: 3, n: 1 }]), JSON.stringify(r.byLevel));
    ok('raw inputs: OreA is an ingredient of 2 recipes, OreB of 1; 2 raw inputs', JSON.stringify(r.rawUse) === JSON.stringify([{ r: 'OreA', n: 2 }, { r: 'OreB', n: 1 }]) && r.rawN === 2, JSON.stringify(r.rawUse));
    ok('raw units: Plate 2', dear.Plate && dear.Plate.min === 2 && dear.Plate.max === 2, JSON.stringify(dear.Plate));
    ok('raw units: Frame 3.5 the cheap way, 10 the dear way (output quantity divides)', dear.Frame && dear.Frame.min === 3.5 && dear.Frame.max === 10 && dear.Frame.ways === 2, JSON.stringify(dear.Frame));
    ok('raw units: Part 9 to 22 (ingredient quantities multiply, through two levels)', dear.Part && dear.Part.min === 9 && dear.Part.max === 22, JSON.stringify(dear.Part));
    ok('a recipe loop has no cost and is left out; costliest first', !dear.Loop1 && !dear.Loop2 && r.dearN === 3 && r.dear[0].r === 'Part' && r.rawEqMedian === 3.5, JSON.stringify(r.dear.map(d => d.r)));
    ok('upgrade materials: Part 9 raw for 3 LP, Frame 3.5 raw for 7 LP, costliest first', JSON.stringify(r.upgrade.map(u => [u.r, u.lp, u.raw])) === JSON.stringify([['Part', 3, 9], ['Frame', 7, 3.5]]), JSON.stringify(r.upgrade));
    const sm = s.ships.bySize.find(b => b.size === 'small'), tt = s.ships.bySize.find(b => b.size === 'titan');
    ok('ships: 4 configurations, 3 default hulls; small = 2 hulls, median cargo 200', s.ships.configs === 4 && s.ships.hulls === 3 && sm && sm.n === 2 && sm.cargo === 200 && sm.mining === 0.25 && sm.crew === 2, JSON.stringify(sm));
    ok('ships: fit-out of the small tier configuration is 2 Parts = 18 raw (1 configuration)', sm && sm.fitN === 1 && sm.fit === 18, JSON.stringify(sm));
    ok('ships: a size with no fitted configuration has no fit-out figure; sizes in size order', tt && tt.fitN === 0 && tt.fit === null && s.ships.bySize.map(b => b.size).join() === 'small,titan');
    ok('tolls: rates as stored, and only research that changes the lane fee', s.tolls.allied === 5000 && s.tolls.neutral === 20000 && s.tolls.crossFaction === false && JSON.stringify(s.tolls.research) === JSON.stringify([{ r: 'Lane Cut', mod: -0.25, atlas: 350 }]), JSON.stringify(s.tolls));
    ok('research: 3 nodes, 2 cost ATLAS, 700 in all, 1 with a cargo cost', s.research.n === 3 && s.research.paid === 2 && s.research.atlas === 700 && s.research.withCargo === 1 && JSON.stringify(s.research.byCost) === JSON.stringify([{ atlas: 350, n: 2 }]), JSON.stringify(s.research));
    ok('claim stake definitions', JSON.stringify(s.stakes) === JSON.stringify([{ r: 'Stake T1', slots: 65, rent: 1, place: 16 }]));
    let threw = false; const t = tables(); t.recipes.rows = [];
    try { summarize(t); } catch (e) { threw = /recipes/.test(String(e.message)); }
    ok('an empty table is refused by name (nothing would be written)', threw);
    return res;
}

const MUTANTS = [
    ['the output quantity is ignored', 'min = Math.min(min, lo / q); max = Math.max(max, hi / q);', 'min = Math.min(min, lo); max = Math.max(max, hi);'],
    ['the ingredient quantity is ignored', 'lo += n * e.min; hi += n * e.max;', 'lo += e.min; hi += e.max;'],
    ['the dearest way is reported as the cheapest', 'min = Math.min(min, lo / q);', 'min = Math.min(min, hi / q);'],
    ['a raw input counts as 0', 'const e = { min: 1, max: 1 }; memo.set(id, e); return e;', 'const e = { min: 0, max: 0 }; memo.set(id, e); return e;'],
    ['a raw input is counted once per recipe line, crafted inputs included', 'if (!ways.has(i.id) && !seen.has(i.id))', 'if (!seen.has(i.id))'],
    ['every configuration counts as a hull', "def = S.filter(s => /Default Config$/.test(s.name || ''));", 'def = S.slice();'],
    ['free research listed as changing the lane fee', 'r.modifier && num(r.modifier.warpLaneFeeModifier)).map', 'r.modifier).map'],
    ['an empty table is accepted', "|| !T[t].rows.length) throw new Error('table missing or empty: ' + t);", ") throw new Error('table missing or empty: ' + t);"],
    ['fit-out uses the dearest recipe', 't += q * e.min; }', 't += q * e.max; }']
];

(async () => {
    let pass = 0, fail = 0;
    const real = (await import(pathToFileURL(TOOL).href)).summarize;
    console.log('[1] the tool on the fixture');
    const base = suite(real, false); pass += base.pass; fail += base.fail;
    console.log('  ' + base.pass + ' passed, ' + base.fail + ' failed');
    console.log('[2] mutants: each must make a check fail');
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'c4-cfgsum-'));
    let i = 0;
    for (const [name, from, to] of MUTANTS) {
        if (SRC.split(from).length !== 2) { console.log('  FAIL mutant target missing or not unique: ' + name); fail++; continue; }
        const f = path.join(tmpDir, 'm' + (i++) + '.mjs'); fs.writeFileSync(f, SRC.replace(from, to));
        let r;
        try { r = suite((await import(pathToFileURL(f).href)).summarize, true); } catch (e) { r = { fail: 1, names: ['load threw ' + e.message] }; }
        if (r.fail > 0) { pass++; console.log('  caught  ' + name + '  (first: ' + r.names[0] + ')'); } else { fail++; console.log('  FAIL mutant NOT caught: ' + name); }
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
    console.log('[3] the committed summary file');
    const ok = (name, cond, detail) => { if (cond) pass++; else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); } };
    let S = null; try { S = JSON.parse(fs.readFileSync(path.join(ROOT, 'C4Live', 'config-summary.json'), 'utf8')); } catch (e) { /* reported below */ }
    ok('C4Live/config-summary.json parses', !!S);
    if (S) {
        const size = fs.statSync(path.join(ROOT, 'C4Live', 'config-summary.json')).size;
        ok('it is small enough to ship with the page (under 60 KB; ' + size + ' bytes)', size < 60000);
        ok('it carries a date and a game version', S.takenAt > 1.7e9 && S.sage > 0);
        ok('recipes, levels, raw inputs and costs are filled', S.recipes.n > 100 && S.recipes.byLevel.length >= 1 && S.recipes.rawUse.length > 0 && S.recipes.dear.length > 0 && S.recipes.dear.every(d => d.min >= 1 && d.max >= d.min));
        ok('the level counts add up to the recipe count', S.recipes.byLevel.reduce((t, l) => t + l.n, 0) === S.recipes.n);
        ok('no wallet or account address in the file (32-44 character base58 runs)', !/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(JSON.stringify(S)));
    }
    console.log(pass + ' passed, ' + fail + ' failed');
    process.exit(fail ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(1); });
