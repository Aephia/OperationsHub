// c4-inventory-check.js - C4 Live: the inventory (everything one owner holds, full screen), 2026-11-27.
//   node Test/c4-inventory-check.js
// Pure checks (no browser) of C4Live/c4-inventory.js: the hangar, cargo, crew and claim stake numbers against a
// fixture counted by hand and against an independent recount of the real local read (when Data/c4-live/latest.json
// exists), escaping of chain text, and the page wiring. Each mutant must make at least one check fail.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const SRC_PATH = path.join(ROOT, 'C4Live', 'c4-inventory.js');
const SRC = fs.readFileSync(SRC_PATH, 'utf8');
const FV = require(path.join(ROOT, 'C4Live', 'c4-fleet-view.js'));

function load(src) {
    const box = { C4FleetView: FV, module: { exports: {} }, require: () => FV };
    box.globalThis = box;
    vm.runInNewContext(src, box);
    return box.module.exports;
}

const P = 'OWNERaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', Q = 'OTHERbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
const EVIL = '<img src=x onerror=alert(1)>';
function fixture() {
    return {
        generatedAt: 1, statKeys: [], shipDefs: { 'Busan Pulse Default Config': { sz: 'xx-small' }, 'Busan Pulse Mining Min Config': { sz: 'xx-small' }, 'Opal Jet Default Config': { sz: 'small' } },
        owners: [{ p: P, name: 'Tester', atlas: 1234.6 }, { p: Q, name: 'Other', atlas: 5 }],
        fleets: [
            { a: 'F1', o: P, fa: 'oni', types: { 'Busan Pulse Default Config': 2, 'Busan Pulse Mining Min Config': 1 }, crew: 7, rent: 2, fuel: 100, ammo: 40, hold: [{ n: 'Iron Ore', q: 50 }, { n: 'Fuel', q: 5 }] },
            { a: 'F2', o: P, fa: 'oni', types: { 'Opal Jet Default Config': 4, 'Busan Pulse Default Config': 1 }, crew: 3, fuel: 10, ammo: 0, hold: [{ n: 'Iron Ore', q: 25 }, { n: EVIL, q: 3 }, { n: 'Zero', q: 0 }] },
            { a: 'F3', o: Q, fa: 'mud', types: { 'Opal Jet Default Config': 9 }, crew: 99, fuel: 999, ammo: 999, hold: [{ n: 'Iron Ore', q: 999 }] }
        ],
        stakes: [
            { a: 'S1', o: P, st: 'active', defName: 'Claim Stake Tier 2', tier: 2, sysName: 'Izar', crew: 11, b: 6, pw: { gen: 100, use: 60 }, fuel: 9, cap: { used: 50, total: 200 },
                bl: [{ n: 'Fuel Processor Tier 1', q: 3, k: 'processor' }, { n: 'Hub', q: 1, k: 'central_hub' }, { n: 'Odd', q: 2, k: 'Bad Kind"' }],
                inv: [{ r: 'Iron Ore', q: 10 }, { r: 'Claim Stake Tier 1', q: 1 }], out: [{ r: 'Fuel', ps: 2 }] },
            { a: 'S2', o: P, st: 'design', def: 4, sysName: EVIL, crew: 0, b: 5, inv: [], out: [] },
            { a: 'S3', o: Q, st: 'active', defName: 'Claim Stake Tier 3', crew: 500, b: 40, bl: [{ n: 'Hub', q: 40, k: 'central_hub' }], inv: [{ r: 'Iron Ore', q: 5000 }] }
        ]
    };
}
const CATS = { 'Iron Ore': 'raw', Fuel: 'processed', Ammunition: 'component' };
const catOf = n => CATS[n] || null;
// hull names come from the ship art manifest: without it a variant cannot be told from the hull (the view then draws one card per configuration)
const ART = FV.artIndex({ 'Busan Pulse': { hero: 'Busan_Pulse_store.webp', source: 'store' }, 'Opal Jet': { hero: 'Opal_Jet_hero.webp', source: 'render' } });
const O = { ownerName: 'Tester', artBase: '../Images/ships/', stakeArtBase: '../Images/stake/', iconOf: (n, c) => c ? 'icons/' + c + '.webp' : '', canFleets: true, canStake: true };

// returns the list of failed check names for one copy of the module
function run(I, quiet) {
    const fails = []; let n = 0;
    const check = (name, ok, detail) => { n++; if (!ok) { fails.push(name); if (!quiet) console.log('  FAIL ' + name + (detail ? '  <- ' + detail : '')); } };
    const safe = (name, fn) => { try { fn(); } catch (e) { check(name + ' (threw)', false, e.message); } };

    safe('[1] model', () => {
        const m = I.build(fixture(), P, { catOf, art: ART });
        const t = m.totals, it = k => m.items.filter(x => x.name === k)[0] || {};
        check('[1] ships, hulls, configurations and fleets of this owner only', t.ships === 8 && t.hulls === 2 && t.configs === 3 && t.fleets === 2, JSON.stringify(t));
        check('[1] hulls run largest first (a tie by name), each with its configurations and size', m.hulls[1].base === 'Opal Jet' && m.hulls[1].qty === 4 && m.hulls[1].size === 'small' && m.hulls[0].base === 'Busan Pulse' && m.hulls[0].qty === 4 &&
            m.hulls[0].configs.length === 2 && m.hulls[0].configs[0].qty === 3 && m.hulls[0].configs[0].variant === '' && m.hulls[0].configs[1].qty === 1 && m.hulls[0].configs[1].variant === 'Mining Min', JSON.stringify(m.hulls));
        check('[1] an item sums holds, tanks and stake storage and keeps the three apart', it('Iron Ore').total === 85 && it('Iron Ore').hold === 75 && it('Iron Ore').stake === 10 && it('Iron Ore').tank === 0 &&
            it('Fuel').total === 115 && it('Fuel').hold === 5 && it('Fuel').tank === 110 && it('Ammunition').total === 40 && it('Ammunition').tank === 40, JSON.stringify(m.items));
        check('[1] a zero line is not an item, and the lines run largest first', !m.items.some(x => x.name === 'Zero') && t.lines === 5 && m.items[0].name === 'Fuel' && m.items.every((x, i) => !i || m.items[i - 1].total >= x.total), m.items.map(x => x.name + ' ' + x.total).join(', '));
        check('[1] units = the sum of the lines', t.units === 115 + 85 + 40 + 3 + 1, String(t.units));
        check('[1] categories come from the catalog; a name it does not hold is an item', it('Iron Ore').cat === 'raw' && it('Fuel').cat === 'processed' && it('Ammunition').cat === 'component' && it('Claim Stake Tier 1').cat === 'item' &&
            JSON.stringify(m.cats.map(c => c.id + c.n)) === '["raw1","processed1","component1","item2"]', JSON.stringify(m.cats));
        check('[1] crew: fleets, rented, claim stakes, total', m.crew.fleets === 10 && m.crew.rented === 2 && m.crew.stakes === 11 && m.crew.total === 21 && t.crew === 21, JSON.stringify(m.crew));
        check('[1] claim stakes and buildings; a stake without a building list keeps the count the chain states', t.stakes === 2 && t.buildings === 11 && m.stakes[0].a === 'S1' && m.stakes[0].buildings === 6 && m.stakes[0].listed && m.stakes[1].buildings === 5 && !m.stakes[1].listed, JSON.stringify(t));
        check('[1] buildings by kind; a kind that is not a plain word is kept out of the picture path', JSON.stringify(m.kinds.map(k => k.k + ':' + k.q)) === '["processor:3",":2","central_hub:1"]' && m.stakes[0].bl.every(b => /^[a-z_]*$/.test(b.k)), JSON.stringify(m.kinds));
        check('[1] stake facts: power, storage, state, label', m.stakes[0].power.use === 60 && m.stakes[0].store.total === 200 && m.stakes[0].state === 'active' && m.stakes[0].label === 'Claim Stake Tier 2' && m.stakes[1].label === 'Definition 4' && m.stakes[1].power === null, JSON.stringify(m.stakes[1]));
        check('[1] ATLAS, faction, not NPC', m.atlas === 1234.6 && m.fa === 'oni' && m.npc === false && m.empty === false);
        const none = I.build(fixture(), 'NOBODY', { catOf, art: ART });
        check('[1] an unknown profile is empty, with zero totals', none.empty && none.totals.ships === 0 && none.totals.lines === 0 && none.totals.stakes === 0 && none.atlas === null);
        const nc = I.build(fixture(), P, { art: ART });
        check('[1] without the catalog no category is claimed', nc.hasCats === false && nc.cats.length === 0 && nc.items.every(x => x.cat === ''));
        const na = I.build(fixture(), P, { catOf });
        check('[1] without the ship art a configuration is its own card, and the ship count stays the same', na.totals.ships === 8 && na.totals.hulls === 3 && na.totals.configs === 3);
        check('[1] junk input does not throw', (() => { I.build(null, P); I.build({ fleets: [null, 5, { o: P, types: 'x', hold: 'y' }], stakes: [{ o: P, bl: [null, { q: 'z' }], inv: 7 }], owners: 3 }, P, { catOf, art: ART }); return true; })());
    });

    safe('[2] compact numbers', () => {
        check('[2] small numbers are whole, large ones are cut and never rounded up', [0, 999, 9999, 10000, 186436, 999999, 1234567, 2.5e9].map(I.compact).join(' ') === '0 999 9,999 10K 186K 999K 1.23M 2.5B', [0, 999, 9999, 10000, 186436, 999999, 1234567, 2.5e9].map(I.compact).join(' '));
        check('[2] not a number reads -', I.compact(NaN) === '-' && I.compact('7') === '-');
    });

    safe('[3] html', () => {
        const m = I.build(fixture(), P, { catOf, art: ART }), h = I.html(m, O);
        check('[3] chain text is escaped everywhere', h.indexOf(EVIL) < 0 && h.indexOf('&lt;img src=x onerror=alert(1)&gt;') > 0 && !/<script|javascript:| on[a-z]+=/i.test(h.replace(/&lt;img src=x onerror=alert\(1\)&gt;/g, '')));
        check('[3] no undefined, NaN or [object in the page', !/undefined|NaN|\[object/.test(h));
        check('[3] the four sections are there in order', ['hangar', 'cargo', 'crew', 'stakes'].every((s, i, a) => h.indexOf('data-inv-sec="' + s + '"') > 0 && (!i || h.indexOf('data-inv-sec="' + a[i - 1] + '"') < h.indexOf('data-inv-sec="' + s + '"'))));
        check('[3] a ship card shows the hull, its count and every configuration with its count', /<span class="inv-q">x4<\/span><div class="inv-ship-t"><b>Busan Pulse<\/b><small>XX-Small<\/small><\/div><ul class="inv-cfg"[^>]*><li title="Busan Pulse Default Config"><b>3x<\/b> Default<\/li><li title="Busan Pulse Mining Min Config"><b>1x<\/b> Mining Min<\/li>/.test(h));
        check('[3] a cargo slot shows the amount, the name, the category and where it sits', /<div class="inv-slot c-raw"[^>]*title="Iron Ore: 85 units \(75 in fleet holds, 10 on claim stakes\)">/.test(h) && /<b class="inv-slot-q">85<\/b><i class="inv-slot-s"[^>]*><\/i><span class="inv-slot-n">Iron Ore<\/span><small>Raw material<\/small>/.test(h) && /title="Fuel: 115 units \(5 in fleet holds, 110 in fleet tanks\)"/.test(h));
        check('[3] the category chips count the lines, All first', /data-inv-cat="all" aria-pressed="true">All <em>5<\/em>/.test(h) && /data-inv-cat="raw" aria-pressed="false">Raw materials <em>1<\/em>/.test(h) && /data-inv-cat="item"[^>]*>Items <em>2<\/em>/.test(h));
        const hr = I.html(m, Object.assign({}, O, { cat: 'raw' }));
        check('[3] a chosen category shows only its lines', (hr.match(/class="inv-slot /g) || []).length === 1 && /data-inv-cat="raw" aria-pressed="true"/.test(hr) && (h.match(/class="inv-slot /g) || []).length === 5);
        check('[3] a category the owner has none of falls back to All', (I.html(m, Object.assign({}, O, { cat: 'advanced' })).match(/class="inv-slot /g) || []).length === 5);
        check('[3] crew rows and the rented note', /On fleets<\/span>.*?<b>10<\/b>/.test(h) && /On claim stakes<\/span>.*?<b>11<\/b>/.test(h) && h.indexOf('2 of the fleet crew are rented.') > 0);
        check('[3] a stake card lists its buildings with pictures from the stake art only for a plain kind', h.indexOf('src="../Images/stake/processor.webp"') > 0 && h.indexOf('Bad Kind') < 0 && /<b>x3<\/b><span>Fuel Processor Tier 1<\/span>/.test(h) && h.indexOf('6 buildings &middot; 11 crew &middot; power 60 / 100 &middot; fuel 9 &middot; storage 25%') > 0, h.slice(h.indexOf('inv-stake-f'), h.indexOf('inv-stake-f') + 200));
        check('[3] a stake without a building list says so, and both stakes can be opened', h.indexOf('The building list has not been read in this copy of the data.') > 0 && h.indexOf('data-inv-stake="S1"') > 0 && h.indexOf('data-inv-stake="S2"') > 0);
        check('[3] totals tiles', /<span>Ships<\/span><b data-count="8">8<\/b><em>2 fleets<\/em>/.test(h) && /<span>Hulls<\/span><b data-count="2">2<\/b><em>3 configurations<\/em>/.test(h) && /<span>Crew<\/span><b data-count="21">21<\/b><em>2 rented<\/em>/.test(h) && /<span>Claim stakes<\/span><b data-count="2">2<\/b>/.test(h) && /<span>Buildings<\/span><b data-count="11">11<\/b>/.test(h) && /ATLAS in game<\/span><b data-count="1235">1,235<\/b>/.test(h));
        check('[3] another owner reads Inventory; the visitor\'s own reads My inventory with the You mark', />Inventory<\/div><h2 class="inv-h" id="c4InvTitle">Tester<\/h2>/.test(h) && /class="inv-page inv-mine"[^>]*><div class="inv-head"><div class="inv-head-t"><div class="inv-kind">My inventory<\/div><h2 class="inv-h c4-me" id="c4InvTitle">Tester<i class="c4-me-tag">You<\/i>/.test(I.html(m, Object.assign({}, O, { mine: true }))));
        check('[3] without the page callbacks there is no Fleet view and no Open stake button', (() => { const x = I.html(m, { ownerName: 'T' }); return x.indexOf('data-inv-fleets') < 0 && x.indexOf('data-inv-stake') < 0 && x.indexOf('<img') < 0 || (x.indexOf('data-inv-fleets') < 0 && x.indexOf('data-inv-stake') < 0); })());
        const e = I.html(I.build(fixture(), 'NOBODY', {}), O);
        check('[3] an empty profile says so and draws no section', e.indexOf('This profile holds no fleet and no claim stake in the latest read.') > 0 && e.indexOf('data-inv-sec') < 0);
        const big = fixture(); for (let i = 0; i < 30; i++) big.stakes.push({ a: 'X' + i, o: P, st: 'active', b: 1, bl: [{ n: 'Hub', q: 1, k: 'central_hub' }] });
        const hb = I.html(I.build(big, P, {}), O);
        check('[3] more stakes than the limit: the first ' + I.STAKE_LIMIT + ' and a Show more button', (hb.match(/class="inv-stake"/g) || []).length === I.STAKE_LIMIT && /data-inv-more>Show 8 more of 8</.test(hb), String((hb.match(/class="inv-stake"/g) || []).length));
    });

    safe('[4] the real local read', () => {
        const f = path.join(ROOT, 'Data', 'c4-live', 'latest.json');
        if (!fs.existsSync(f)) { if (!quiet) console.log('  skip: no Data/c4-live/latest.json on this machine'); return; }
        const L = JSON.parse(fs.readFileSync(f, 'utf8'));
        let bad = 0, seen = 0;
        for (const o of L.owners || []) {
            const p = o.p, m = I.build(L, p, {}), fl = L.fleets.filter(x => x.o === p), sk = (L.stakes || []).filter(x => x.o === p); seen++;
            const ships = fl.reduce((a, x) => a + Object.values(x.types || {}).reduce((u, v) => u + v, 0), 0);
            const want = {}; for (const x of fl) { for (const c of x.hold || []) want[c.n] = (want[c.n] || 0) + c.q; want.Fuel = (want.Fuel || 0) + (x.fuel || 0); want.Ammunition = (want.Ammunition || 0) + (x.ammo || 0); }
            for (const s of sk) for (const c of s.inv || []) want[c.r] = (want[c.r] || 0) + c.q;
            const got = {}; for (const it of m.items) got[it.name] = it.total;
            const names = new Set([...Object.keys(want).filter(k => want[k] > 0), ...Object.keys(got)]);
            const ok = m.totals.ships === ships && m.hulls.reduce((a, h) => a + h.qty, 0) === ships && [...names].every(k => Math.abs((want[k] || 0) - (got[k] || 0)) < 0.5) &&
                m.crew.fleets === fl.reduce((a, x) => a + (x.crew || 0), 0) && m.crew.stakes === sk.reduce((a, x) => a + (x.crew || 0), 0) && m.totals.stakes === sk.length &&
                m.kinds.reduce((a, k) => a + k.q, 0) === sk.reduce((a, s) => a + (s.bl || []).reduce((u, b) => u + b.q, 0), 0);
            if (!ok) bad++;
        }
        check('[4] every owner of the read recounts to the same ships, cargo lines, crew, stakes and buildings (' + seen + ' owners)', seen > 0 && bad === 0, bad + ' owners disagree');
    });

    safe('[5] page wiring', () => {
        const html = fs.readFileSync(path.join(ROOT, 'C4Live', 'index.html'), 'utf8'), app = fs.readFileSync(path.join(ROOT, 'C4Live', 'app.js'), 'utf8'), css = fs.readFileSync(path.join(ROOT, 'C4Live', 'c4-inventory.css'), 'utf8');
        const at = s => html.indexOf(s);
        check('[5] index.html holds the view, its stylesheet after the others, and its script after the fleet view and before app.js', /<section class="inv" id="c4Inventory" role="dialog" aria-modal="true"[^>]* hidden>/.test(html) && at('c4-inventory.css?v=') > at('c4-fleet-view.css?v=') && at('c4-fleet-view.css?v=') > 0 &&
            at('c4-inventory.js?v=') > at('c4-fleet-view.js?v=') && at('c4-inventory.js?v=') < at('<script src="app.js') && at('Utils/ResourceIcons.js?v=') > 0 && at('Utils/ResourceIcons.js?v=') < at('<script src="app.js'));
        check('[5] the owner drawer has the inventory button (not for the NPC profile) and the page routes its click', /\$\{o\.npc \? '' : invBtn\(p\)\}/.test(app) && /data-inv="\$\{esc\(p\)\}"/.test(app) && /t\.closest\('\[data-inv\]'\)/.test(app) && /S\.mine\.has\(p\) \? 'My inventory' : 'Inventory'/.test(app));
        check('[5] clicks and keys reach the inventory before the fleet view', app.indexOf('if (INV && INV.onClick(e)) return;') > 0 && app.indexOf('if (INV && INV.onClick(e)) return;') < app.indexOf('if (FV && FV.onClick(e)) return;') && app.indexOf('if (INV && INV.onKey(e)) return;') > 0 && app.indexOf('if (INV && INV.onKey(e)) return;') < app.indexOf('if (FV && FV.onKey(e)) return;'));
        check('[5] fresh data redraws an open inventory, and the catalog is fetched on the first open only', /if \(INV\) INV\.refresh\(invCtx\(\)\);/.test(app) && /INV\.open\(\$\('#c4Inventory'\), invCtx\(\), p\)\) loadCatalog\(\);/.test(app) && !/resources-data\.js/.test(html));
        check('[5] the category colour of a slot outranks the slot\'s default colour (three classes against two)', /\.inv \.inv-slot\.c-raw \{ --cc:/.test(css) && /\.inv \.inv-slot \{ --cc: var\(--line-strong\);/.test(css) && /\.c4-act\.c4-inv-btn \{/.test(css));
        const code = SRC.replace(/\/\*[^]*?\*\//g, '').replace(/\/\/.*$/gm, '');
        check('[5] no inline handler or script in the generated HTML, and the module knows nothing of the hub profile', !/ on[a-z]+=|<script|javascript:/i.test(code) && !/HubProfile/.test(code));
    });
    return { fails, n };
}

console.log('c4-inventory-check');
const base = run(load(SRC), false);
let failed = base.fails.length;
console.log('mutants');
const MUTANTS = [
    ['another owner\'s fleets counted', "filter(function (f) { return obj(f) && f.o === p; })", "filter(function (f) { return obj(f); })"],
    ['another owner\'s stakes counted', "filter(function (s) { return obj(s) && s.o === p; })", "filter(function (s) { return obj(s); })"],
    ['tanks left out of the cargo', "add('Fuel', 'tank', f.fuel); add('Ammunition', 'tank', f.ammo);", ""],
    ['stake storage left out of the cargo', "if (obj(h)) add(h.r, 'stake', h.q);", ""],
    ['item name not escaped', "'<span class=\"inv-slot-n\">' + esc(it.name) + '</span>'", "'<span class=\"inv-slot-n\">' + it.name + '</span>'"],
    ['system name not escaped', "esc(s.sysName || 'system not read')", "(s.sysName || 'system not read')"],
    ['building kind not checked before it becomes a path', "function kindKey(k) { k = str(k); return /^[a-z][a-z0-9_]*$/.test(k) ? k : ''; }", "function kindKey(k) { return str(k); }"],
    ['rented crew added to the total', "crew.total = crew.fleets + crew.stakes;", "crew.total = crew.fleets + crew.stakes + crew.rented;"],
    ['large numbers rounded up', "return String(Math.floor(x * k) / k) + u[1];", "return String(Math.round(x)) + u[1];"],
    ['category filter ignored', "var list = cat === 'all' ? m.items : m.items.filter(function (it) { return it.cat === cat; });", "var list = m.items;"],
    ['a category claimed without the catalog', "it.cat = catOf ? catKey(catOf(it.name)) : '';", "it.cat = catOf ? catKey(catOf(it.name)) : 'raw';"],
    ['configurations merged into the hull', "var c = h.cfg[cfg] || (h.cfg[cfg] = { config: cfg, variant: hn.variant, qty: 0 });", "var c = h.cfg.x || (h.cfg.x = { config: cfg, variant: hn.variant, qty: 0 });"],
    ['stake limit ignored', "var cards = m.stakes.slice(0, limit).map(", "var cards = m.stakes.map("]
];
for (const [name, from, to] of MUTANTS) {
    if (SRC.split(from).length !== 2) { console.log('  MUTANT NOT APPLIED  ' + name); failed++; continue; }
    let r; try { r = run(load(SRC.replace(from, to)), true); } catch (e) { r = { fails: ['load threw: ' + e.message] }; }
    if (r.fails.length) console.log('  caught  ' + name + '  (' + r.fails.length + ' checks failed, first: ' + r.fails[0] + ')');
    else { console.log('  MISSED  ' + name); failed++; }
}
console.log((base.n - base.fails.length) + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
