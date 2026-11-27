#!/usr/bin/env node
// stake-builder-onchain-check.js - Node check of the Stake Builder's on-chain loading (ClaimStakeExplorer/construction.js),
// run against the real C4 Live read (Data/c4-live/latest.json + bodies.json) with stand-ins for window / document /
// localStorage / fetch (no browser, no server).
//   SK  every stake of the read that can be matched to a planet loads with overflow 0, placed + missing = total, and no
//       two buildings on one cell; the pad grows by whole rings (37 -> 61 -> 91 ...) and the drawn grid and tiles follow
//   WH  whose stake it is: a stake that is not the visitor's loads through the ?stake= path and is labelled with its
//       owner (escaped); the visitor's own keeps "Your claim stake"; "My claim stakes" still lists only the visitor's
//   BD  a bad ?stake= value (not base58, unknown address, markup, empty) loads nothing, says why in words, throws nothing
//   PL  a normal plan keeps the 37-cell pad; a saved plan with a bigger pad restores its rings
//   NG  negative control: with the ring growth compiled out, the biggest stake overflows
// Subjects are picked from the read BY RULE (see pick()). If the read is not there (Data/c4-live/ is git-ignored on the
// other machine) the check says SKIPPED and exits 0.
//   node Test/stake-builder-onchain-check.js      exit 0 = all PASS (or SKIPPED)
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const LATEST = path.join(ROOT, 'Data', 'c4-live', 'latest.json'), BODIES = path.join(ROOT, 'Data', 'c4-live', 'bodies.json');
if (!fs.existsSync(LATEST)) {
    console.log('SKIPPED: Data/c4-live/latest.json is not here (the C4 Live read is git-ignored and only the machine running the collector has it), so no on-chain stake can be checked. Nothing was tested.');
    process.exit(0);
}
let pass = 0, fail = 0;
const ok = (cond, msg, detail) => { if (cond) { pass++; console.log('  PASS ' + msg); } else { fail++; console.log('  FAIL ' + msg + (detail !== undefined ? '  -> ' + detail : '')); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ------------------------------------------------------------------------------------------ stand-ins
global.window = global;
const registry = {};                       // selector -> the one stand-in element the page gets for it
const mkEl = () => {
    const t = {
        classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } }, style: { setProperty() {} }, dataset: {},
        hidden: false, innerHTML: '', textContent: '', clientWidth: 700, className: '', children: [], parent: null, value: '',
        appendChild(n) { n.parent = t; t.children.push(n); return n; },
        remove() { if (t.parent) t.parent.children = t.parent.children.filter(x => x !== t); },
        querySelectorAll(sel) { return /data-uid/.test(sel) ? t.children.slice() : []; },
        querySelector(sel) {
            const m = /data-uid="(\d+)"/.exec(sel);
            if (m) return t.children.find(x => x.dataset.uid === m[1]) || null;
            return registry[sel] || (registry[sel] = mkEl());
        },
        closest() { return null; }, addEventListener() {}, setAttribute() {}, getBoundingClientRect() { return { left: 0, top: 0, width: 0, height: 0 }; }
    };
    return t;
};
global.document = {
    getElementById: id => registry['#' + id] || (registry['#' + id] = mkEl()), createElement: () => mkEl(), addEventListener() {}, hidden: false,
    body: mkEl(), querySelector: () => mkEl(), querySelectorAll: () => []
};
global.localStorage = (() => { let s = {}; return { getItem: k => (k in s ? s[k] : null), setItem: (k, v) => { s[k] = String(v); }, removeItem: k => { delete s[k]; }, clear: () => { s = {}; } }; })();
global.matchMedia = () => ({ matches: false });
global.addEventListener = () => {};
global.location = { protocol: 'file:', hostname: '', search: '' };
const rd = f => fs.readFileSync(f, 'utf8');
global.fetch = async url => {
    const u = String(url);
    if (/Data\/c4-live\/latest\.json$/.test(u)) return { ok: true, json: async () => JSON.parse(rd(LATEST)) };
    if (/Data\/c4-live\/bodies\.json$/.test(u) && fs.existsSync(BODIES)) return { ok: true, json: async () => JSON.parse(rd(BODIES)) };
    return { ok: false, json: async () => null };
};
const load = f => require(path.join(ROOT, f));
['Data/buildings-data.js', 'Data/planet-data.js', 'Data/resources-data.js'].forEach(load);
load('ClaimStakeExplorer/stake-visual.js');
window.HubProfile = load('Utils/HubProfile.js');
const H = window.HubProfile;
const CONSTRUCTION = rd(path.join(ROOT, 'ClaimStakeExplorer', 'construction.js'));

// ------------------------------------------------------------------------------------------ the read, subjects by rule
const latest = JSON.parse(rd(LATEST));
const total = st => (st.bl || []).reduce((a, x) => a + (x && x.q > 0 ? Math.floor(x.q) : 0), 0);
const stakes = latest.stakes;
const ownerName = p => { const o = latest.owners.find(x => x.p === p); return o && o.name; };
// rule: BIG = the stake with the most buildings; SMALL = the stake with the most buildings among those with <= 37 that has an
// owner name; THEIRS = the biggest stake not owned by the test profile (the owner of SMALL)
const byTotal = stakes.slice().sort((a, b) => total(b) - total(a) || String(a.a).localeCompare(String(b.a)));
const BIG = byTotal[0];
const SMALL = byTotal.find(s => total(s) <= 37 && total(s) > 1 && ownerName(s.o));
const THEIRS = byTotal.find(s => s.o !== SMALL.o);
const PROFILE = SMALL.o;

const cellsOfRings = n => 3 * n * (n + 1) + 1;
const dist = c => Math.max(Math.abs(c[0]), Math.abs(c[1]), Math.abs(c[0] + c[1]));
// (the grid is drawn once with the shell, in root.innerHTML, and redrawn into .sb-grid when a plan needs another ring count)
const gridCells = () => { const g = registry['.sb-grid'] && registry['.sb-grid'].innerHTML; const h = g || (registry['#constructionContent'] && registry['#constructionContent'].innerHTML) || ''; return h.split('class="cell"').length - 1; };

// a fresh builder over the current source (src = construction.js text, possibly sabotaged), profile = the test visitor
async function newBuilder(src) {
    for (const k of Object.keys(registry)) delete registry[k];
    delete window.constructionManager; delete window.initializeConstructionTab;
    localStorage.removeItem('csx.stakePlan');
    H.set({ profile: PROFILE });
    new Function(src)();
    window.initializeConstructionTab();
    const b = window.constructionManager;
    for (let i = 0; i < 200 && !b.mine.ready; i++) await sleep(10);
    return b;
}
const toastEl = () => registry['#sbToast'] || (registry['#sbToast'] = mkEl());
const toast = () => toastEl().textContent;
const tileCentres = () => {                // where the drawn tiles' cells are on the stage: left/top + the tile anchor at its drawn scale
    const T = window.StakeTiles, [ax, ay] = T.anchor(), out = [];
    for (const n of registry['#sbTiles'].children) {
        const kind = [...n.className.matchAll(/k-(\w+)/g)].map(m => m[1])[0], [w] = T.size(kind), s = parseFloat(n.style.width) / w;
        out.push([parseFloat(n.style.left) + ax * s, parseFloat(n.style.top) + ay * s]);
    }
    return out;
};

(async () => {
    console.log('read: ' + stakes.length + ' stakes, ' + latest.owners.length + ' owners; BIG ' + total(BIG) + ' buildings, SMALL ' + total(SMALL) + ', THEIRS ' + total(THEIRS) + ' (owner differs from the test profile)');
    ok(total(BIG) > 37 && total(SMALL) > 1 && total(SMALL) <= 37 && THEIRS && THEIRS.o !== PROFILE, 'positive control: the three subjects are what their rules say (BIG > 37, 1 < SMALL <= 37, THEIRS not the visitor\'s)');
    const b = await newBuilder(CONSTRUCTION);
    ok(b.mine.ready && !!b.mine.latest && b.mine.stakes.length > 0 && b.mine.stakes.every(s => s.o === PROFILE), 'the builder read the C4 data and lists only the visitor\'s stakes (' + b.mine.stakes.length + ')');
    ok(!b.mine.stakes.some(s => s.a === THEIRS.a), 'THEIRS is not in "My claim stakes"');

    // ---------------------------------------------------------------- SK every stake of the read
    console.log('\n[SK] every stake of the read');
    let matched = 0, unmatched = 0, bad = [], grown = 0, maxRings = 3, worstTile = 0;
    for (const st of stakes) {
        const r = b.openStake(st.a);
        if (!r) { unmatched++; continue; }
        matched++;
        const items = b.plan.items.filter(i => i.cell), seen = new Set(), n = total(st);
        let dup = false; for (const i of items) { const k = i.cell.join(','); if (seen.has(k)) dup = true; seen.add(k); }
        const rings = b.plan.rings || 3;
        if (r.overflow !== 0 || r.placed + r.missing !== r.total || r.total !== n || dup || items.some(i => dist(i.cell) > rings) || cellsOfRings(rings) < r.placed) bad.push(st.a + ' ovf=' + r.overflow + ' placed=' + r.placed + ' missing=' + r.missing + ' total=' + r.total + '/' + n + ' dup=' + dup);
        if (rings > 3) { grown++; maxRings = Math.max(maxRings, rings); }
        if (gridCells() !== cellsOfRings(rings)) bad.push(st.a + ' drawn grid has ' + gridCells() + ' cells, pad has ' + cellsOfRings(rings));
        for (const [x, y] of tileCentres()) if (x < 0 || x > 700 || y < 0 || y > 420) worstTile++;
    }
    ok(matched > 0 && bad.length === 0, 'all ' + matched + ' stakes with a matched planet load: overflow 0, placed + missing = total, no shared cell, grid drawn with the pad\'s cells', bad.slice(0, 3).join(' | '));
    console.log('       (' + unmatched + ' of ' + stakes.length + ' stakes have a planet that cannot be matched: they toast and load nothing; ' + grown + ' stakes needed a bigger pad, up to ' + maxRings + ' rings = ' + cellsOfRings(maxRings) + ' cells)');
    ok(grown >= 6 || grown >= stakes.filter(s => total(s) > 37).length - unmatched, 'positive control: the stakes of the read that hold more than 37 buildings did grow the pad (' + grown + ')');
    ok(worstTile === 0, 'every drawn tile of every stake has its cell centre on the 700 x 420 stage (' + worstTile + ' outside)');
    const rb = b.openStake(BIG.a);
    ok(rb && rb.overflow === 0 && rb.rings > 3 && rb.placed + rb.missing === rb.total, 'BIG (' + total(BIG) + ' buildings) loads on a pad of ' + (rb && rb.rings) + ' rings = ' + cellsOfRings(rb ? rb.rings : 0) + ' cells, overflow 0');
    ok(cellsOfRings(rb.rings - 1) < rb.placed && cellsOfRings(rb.rings) >= rb.placed, 'the pad is the SMALLEST whole-ring pad that holds them (' + rb.placed + ' placed; ' + cellsOfRings(rb.rings - 1) + ' would not do)');
    ok(!/do not fit/.test(b.onChainNote()) && /rings wide/.test(b.onChainNote()), 'the note names the grown pad instead of "do not fit"');

    // ---------------------------------------------------------------- WH whose stake it is
    console.log('\n[WH] whose stake it is');
    const q = window.stakeFromQuery('?x=1&stake=' + THEIRS.a);
    ok(q === THEIRS.a && window.stakeFromQuery('') === null && window.stakeFromQuery('?stake=') === '', 'the query value is read from ?stake= (and absent -> null)');
    const t = b.openStake(q);
    const note = t ? b.onChainNote() : '';
    ok(!!t && t.mine === false && b.plan.onChain.a === THEIRS.a, 'a stake that is not the visitor\'s loads through the query path');
    const nm = ownerName(THEIRS.o);
    ok(!/Your claim stake/.test(note) && note.includes('Claim stake of ') && (nm ? note.includes(nm.replace(/&/g, '&amp;').replace(/</g, '&lt;')) : /\.\.\./.test(note)), 'it is labelled with its owner (' + (nm ? 'name' : 'shortened profile') + '), not "Your claim stake"');
    const mineSt = b.mine.stakes[0], rm = b.openStake(mineSt.a);
    ok(rm && rm.mine === true && /Your claim stake/.test(b.onChainNote()) && !/Claim stake of /.test(b.onChainNote()), 'the visitor\'s own stake keeps "Your claim stake"');
    // an owner name with markup is escaped
    const L = b.mine.latest, o = L.owners.find(x => x.p === THEIRS.o), keep = o.name;
    o.name = '<img src=x onerror=alert(1)>';
    b.openStake(THEIRS.a);
    const evil = b.onChainNote();
    o.name = keep;
    ok(!/<img/.test(evil) && /&lt;img/.test(evil), 'an owner name with markup is escaped in the note');
    const orphan = JSON.parse(JSON.stringify(THEIRS)); orphan.a = 'Q'.repeat(40); orphan.o = 'Z'.repeat(40);
    L.stakes.push(orphan); b.openStake(orphan.a); L.stakes.pop();
    ok(/Claim stake of ZZZZ\.\.\.ZZZZ/.test(b.onChainNote()), 'an owner the read does not name is shown by the shortened profile address');
    ok(registry['#sbMine'].innerHTML.includes('data-stake="' + mineSt.a + '"') && !registry['#sbMine'].innerHTML.includes(THEIRS.a), '"My claim stakes" lists the visitor\'s stake and not THEIRS');
    ok(b.plan.onChain && b.plan.rings === undefined || b.plan.rings > 3, 'positive control: this plan is an on-chain plan (loaded last)');

    // ---------------------------------------------------------------- BD bad values
    console.log('\n[BD] bad ?stake= values');
    const before = b.plan;
    const badValues = ['not base58 !!', '0OIl' + 'A'.repeat(36), '<img src=x onerror=alert(1)>', '', '   ', 'A'.repeat(40), 'A'.repeat(31), 'A'.repeat(45), THEIRS.a + '<b>', '"><script>alert(1)</script>', null, undefined, 42, {}];
    let threw = null;
    for (const v of badValues) {
        toastEl().textContent = '';
        let r; try { r = b.openStake(v); } catch (e) { threw = e; }
        if (r !== null || b.plan !== before || !toast() || /[<>]/.test(toast())) { threw = threw || new Error('value ' + JSON.stringify(v) + ' -> ' + JSON.stringify(r && r.a) + ' toast=' + toast()); }
    }
    ok(!threw, 'every bad value (' + badValues.length + '): returns null, plan untouched, a toast in words without markup, no throw', threw && threw.message);
    ok(toast().includes('claim stake') || toast().includes('stake'), 'positive control: the toast is a sentence about the stake: "' + toast() + '"');
    const keepRead = b.mine.latest; b.mine.latest = null; b.mine.why = 'The collector has not written Data/c4-live/latest.json yet.';
    const noRead = b.openStake(BIG.a);
    ok(noRead === null && /cannot be shown/.test(toast()) && b.plan === before, 'no C4 read: says so in words, loads nothing');
    b.mine.latest = keepRead; b.mine.why = '';

    // the ?stake= before the read is in: it waits, then loads (a fresh builder)
    const b2 = await (async () => {
        for (const k of Object.keys(registry)) delete registry[k];
        delete window.constructionManager; delete window.initializeConstructionTab; localStorage.removeItem('csx.stakePlan'); H.set({ profile: PROFILE });
        new Function(CONSTRUCTION)(); window.initializeConstructionTab();
        const nb = window.constructionManager, early = nb.openStake(THEIRS.a);
        const waited = nb.pendingStake === THEIRS.a && early === null && !nb.plan;
        for (let i = 0; i < 200 && !(nb.plan && nb.plan.onChain); i++) await sleep(10);
        return { nb, waited };
    })();
    ok(b2.waited && b2.nb.plan && b2.nb.plan.onChain && b2.nb.plan.onChain.a === THEIRS.a && b2.nb.pendingStake === null, 'a ?stake= that arrives before the C4 read waits for it and then loads the stake');

    // a link must not cost the visitor their own plan (review 2026-11-26): the saved plan survives a link load, and a
    // planet picked while the link waits for the read is kept
    {
        const mk = () => { for (const k of Object.keys(registry)) delete registry[k]; delete window.constructionManager; delete window.initializeConstructionTab; new Function(CONSTRUCTION)(); window.initializeConstructionTab(); return window.constructionManager; };
        localStorage.removeItem('csx.stakePlan');
        const u = mk(); for (let i = 0; i < 200 && !u.mine.ready; i++) await sleep(10);
        const own = u.loadStake(SMALL.a), mineSaved = localStorage.getItem('csx.stakePlan');
        ok(!!own && !!mineSaved && u.plan.onChain.a === SMALL.a, 'positive control: a stake loaded from the list IS saved as the visitor\'s plan');
        const viaLink = u.openStake(THEIRS.a);
        ok(!!viaLink && u.plan.onChain.a === THEIRS.a && localStorage.getItem('csx.stakePlan') === mineSaved, 'a stake opened from a link is shown but the saved plan is byte for byte the visitor\'s own');
        const w = mk(), key0 = w.plan && w.plan.key;                      // restored: the visitor's saved plan
        w.openStake(THEIRS.a); const waiting = w.pendingStake === THEIRS.a;
        const other = window.StakeData.planets.find(p => p.cat !== 3 && p.key !== key0).key; w.selectPlanet(other);
        for (let i = 0; i < 200 && !w.mine.ready; i++) await sleep(10); await sleep(30);
        ok(waiting && w.pendingStake === null && w.plan && w.plan.key === other && !w.plan.onChain, 'a planet picked while the link waits for the C4 read is kept: the link gives way', w.plan && w.plan.key);
    }

    // ---------------------------------------------------------------- PL a normal plan, save and restore
    console.log('\n[PL] normal plan and save/restore');
    const b3 = await newBuilder(CONSTRUCTION);
    const pk = window.StakeData.planets.find(p => p.cat !== 3 && p.planet.resources && p.planet.resources.length > 2);
    b3.selectPlanet(pk.key);
    const ids = b3.catalogue().filter(x => !x.comesWithStake).map(x => x.id);
    let added = 0; for (const id of ids) if (added < 60 && b3.addBuilding(id, false)) added++;
    const placed = b3.plan.items.filter(i => i.cell);
    ok(placed.length > 5 && b3.plan.rings === undefined && placed.every(i => dist(i.cell) <= 3) && gridCells() === 37, 'a normal plan (' + placed.length + ' buildings) keeps the 37-cell pad: no rings on the plan, every cell within 3, grid has ' + gridCells() + ' cells');
    b3.loadStake(BIG.a);   // as a click in the list: saved (a ?stake= link is shown but not saved, see above)
    const bigRings = b3.plan.rings;
    const saved = JSON.parse(localStorage.getItem('csx.stakePlan'));
    ok(bigRings > 3 && saved.rings === bigRings, 'a loaded big stake is saved with its ring count (' + bigRings + ')');
    b3.selectPlanet(pk.key);
    ok(b3.plan.rings === undefined && gridCells() === 37, 'selecting a normal planet after a big stake returns to the 37-cell pad and redraws the grid');
    localStorage.setItem('csx.stakePlan', JSON.stringify(saved));
    delete window.constructionManager; new Function(CONSTRUCTION)(); window.initializeConstructionTab();
    const b4 = window.constructionManager;
    ok(b4.plan && b4.plan.rings === bigRings && b4.plan.key === saved.key, 'a saved plan with a bigger pad restores with its ' + bigRings + ' rings');
    ok(b4.plan.items.every(i => dist(i.cell) <= bigRings), 'restored buildings sit on cells of that pad');
    localStorage.setItem('csx.stakePlan', JSON.stringify({ key: saved.key, tier: saved.tier, kind: saved.kind, ids: [] }));
    delete window.constructionManager; new Function(CONSTRUCTION)(); window.initializeConstructionTab();
    ok(window.constructionManager.plan && window.constructionManager.plan.rings === undefined, 'an old save without rings restores on the 37-cell pad');
    localStorage.setItem('csx.stakePlan', JSON.stringify({ key: saved.key, tier: saved.tier, kind: saved.kind, rings: 9999, ids: [] }));
    delete window.constructionManager; new Function(CONSTRUCTION)(); window.initializeConstructionTab();
    ok(window.constructionManager.plan && window.constructionManager.plan.rings === undefined, 'a save with an absurd ring count is ignored');

    // ---------------------------------------------------------------- NG negative control
    console.log('\n[NG] negative control: ring growth compiled out');
    const needle = 'this.plan.rings = res.rings = ringsFor(count);';
    ok(CONSTRUCTION.includes(needle), 'positive control: the line that grows the pad is in the source');
    const SAB = CONSTRUCTION.replace(needle, 'this.plan.rings = res.rings = 3;');
    ok(SAB !== CONSTRUCTION, 'the sabotaged source differs');
    const bn = await newBuilder(SAB);
    const rn = bn.openStake(BIG.a);
    ok(rn && rn.overflow > 0 && rn.placed < rn.total - rn.missing, 'WITHOUT ring growth the biggest stake overflows (overflow ' + (rn && rn.overflow) + ') - so the PASS lines above are the growth, not luck');
    const small = bn.openStake(SMALL.a);
    ok(small && small.overflow === 0, 'and the small stake still fits with it off (control: the sabotage only bites stakes over 37)');

    console.log('\n' + pass + ' passed, ' + fail + ' failed');
    process.exit(fail ? 1 : 0);
})().catch(e => { console.log('FAIL  the check crashed: ' + (e && e.stack || e)); process.exit(1); });
