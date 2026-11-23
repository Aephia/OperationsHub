// c4-panel-check.js - C4 Live: the Analytics tab and the expandable right panel (2026-11-22).
//   node Test/c4-panel-check.js            page scenarios, then the negative controls (each reruns the page with one piece
//                                          of app.js broken and requires the named check to FAIL after it passed unbroken)
//   SHOTS=<dir> node Test/c4-panel-check.js   also saves screenshots into <dir>
// Headless Chromium on a local static server (the page's LOCAL mode reads Data/c4-live/*; the 3D scene is a stub that records
// setInsets). Scenarios: A the Analytics tab (six sections, nav, numbers equal C4Analytics.build on the same files, a data
// reload redraws), B the expand button (width before / after / after reload, map inset, Mining tab fits, auto-expand once,
// the visitor's choice wins), C the claim stake view beside a wide dock, D phone widths (nothing changes).
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const ROOT = path.resolve(__dirname, '..');
const A = require(path.join(ROOT, 'C4Live', 'c4-analytics.js'));
let pass = 0, fail = 0;
function check(name, ok, detail) {
    if (ok) { pass++; console.log('  ok   ' + name); } else { fail++; console.log('  FAIL ' + name + (detail ? '  -> ' + detail : '')); }
    return !!ok;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fmt = n => Math.round(n).toLocaleString('en-US');

function fixtures() {
    const DIR = path.join(ROOT, 'Data', 'c4-live');
    const L = JSON.parse(fs.readFileSync(path.join(DIR, 'latest.json'), 'utf8'));
    const B = JSON.parse(fs.readFileSync(path.join(DIR, 'bodies.json'), 'utf8'));
    // a stake with buildings, so the claim stake view has something to draw
    const base = L.stakes[0], gen = L.generatedAt;
    const bl = [{ id: 101, n: 'Central Hub', q: 1, k: 'central_hub' }, { id: 102, n: 'Processing Hub', q: 1, k: 'processing_hub' }, { id: 106, n: 'Power Plant', q: 1, k: 'power_plant' }, { id: 107, n: 'Crew Quarters', q: 1, k: 'crew_quarters' }, { id: 108, n: 'Storage Module', q: 1, k: 'storage_module' }, { id: 109, n: 'Fuel Processor', q: 3, k: 'processor' }, { id: 111, n: 'Gas Condenser', q: 5, k: 'extractor' }];
    const FIX = Object.assign({}, base, { a: 'FIXTURE-PANEL-0000000000000000000000000000000000', b: 13, bl, pw: { gen: 120, use: 95 }, cs: 6, su: 20, inv: [{ r: 'Hydrogen', q: 1800 }], cap: { used: 2092, total: 5000 }, fuel: 252, rent: { bal: 12.5, at: gen - 3600 }, con: { rem: 0, at: gen - 100 }, out: [{ r: 'Fuel', ps: 0.01 }] });
    L.stakes = L.stakes.concat([FIX]);
    return { L, B, FIX };
}
// the same change a data reload would bring: a newer run with more stakes
function newer(L, extra) {
    const L2 = JSON.parse(JSON.stringify(L));
    L2.generatedAt = L.generatedAt + 600;
    for (let i = 0; i < extra; i++) L2.stakes.push(Object.assign({}, L.stakes[0], { a: 'FIXTURE-EXTRA-' + i + '-00000000000000000000000000000000' }));
    return L2;
}
const SCENE_STUB = 'window.__ins = []; window.C4Scene = { mount() { return new Proxy({}, { get(t, k) { if (k === "then") return undefined; if (k === "setInsets") return v => { window.__ins.push(v); }; return () => null; } }); } };';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

async function main() {
    let chromium;
    try { chromium = require('module').createRequire(path.join(os.homedir(), '.claude/skills/teardown/node_modules/x.js'))('playwright').chromium; }
    catch (e) { console.log('SKIP playwright not installed'); return; }
    const FX = fixtures();
    const state = { latest: JSON.stringify(FX.L), mut: null };
    const server = http.createServer((q, r) => {
        const u = decodeURIComponent(q.url.split('?')[0]);
        if (u === '/Data/c4-live/latest.json') { r.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }); r.end(state.latest); return; }
        if (u === '/C4Live/c4-scene.js') { r.writeHead(200, { 'content-type': 'text/javascript' }); r.end(SCENE_STUB); return; }
        const p = path.join(ROOT, u);
        if (!p.startsWith(ROOT)) { r.writeHead(403); r.end(); return; }
        fs.readFile(p, (e, b) => {
            if (e) { r.writeHead(404); r.end(); return; }
            if (state.mut && u === '/C4Live/app.js') { const t = b.toString('utf8'), t2 = state.mut(t); if (t2 === t) process.stderr.write('  MUTATION APPLIED NOTHING (app.js)\n'); b = Buffer.from(t2); }
            if (state.mutAn && u === '/C4Live/c4-analytics.js') { const t = b.toString('utf8'), t2 = state.mutAn(t); if (t2 === t) process.stderr.write('  MUTATION APPLIED NOTHING (c4-analytics.js)\n'); b = Buffer.from(t2); }
            if (state.mutCss && u === '/C4Live/c4.css') { const t = b.toString('utf8'), t2 = state.mutCss(t); if (t2 === t) process.stderr.write('  MUTATION APPLIED NOTHING (c4.css)\n'); b = Buffer.from(t2); }
            r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); r.end(b);
        });
    });
    await new Promise(ok => server.listen(0, '127.0.0.1', ok));
    const base = 'http://127.0.0.1:' + server.address().port + '/C4Live/index.html';
    const browser = await chromium.launch({ headless: true });
    const SHOTS = process.env.SHOTS;
    if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
    let shotsOn = true;
    const shot = async (page, name) => { if (SHOTS && shotsOn) await page.screenshot({ path: path.join(SHOTS, name + '.png') }); };

    // storage: a map of localStorage keys set before the page starts (a returning visitor)
    async function open(query, opt) {
        opt = opt || {};
        const ctx = opt.ctx || await browser.newContext({ viewport: opt.viewport || { width: 1440, height: 900 }, reducedMotion: opt.rm ? 'reduce' : 'no-preference' });
        if (opt.storage) await ctx.addInitScript(s => { for (const [k, v] of Object.entries(s)) { if (sessionStorage.getItem('__init')) return; localStorage.setItem(k, v); } sessionStorage.setItem('__init', '1'); }, opt.storage);
        const page = await ctx.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(String(e)));
        page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
        await page.goto(base + (query || ''));
        await page.waitForFunction(() => document.querySelector('#c4Empty') && document.querySelector('#c4Empty').hidden && document.querySelectorAll('.c4-tab').length > 0 && /ago|Live|Saved|min|\bs\b/i.test((document.querySelector('#c4Age') || {}).innerText || 'x'), null, { timeout: 25000 }).catch(() => {});
        await sleep(700);
        return { page, ctx, errors };
    }
    const dockRect = page => page.evaluate(() => { const r = document.querySelector('#c4Dock').getBoundingClientRect(); return { left: r.left, right: r.right, width: r.width }; });
    // wait until the dock stops moving (the width transition runs ~0.55 s) and the analytics redraw (debounced) is done
    async function settle(page) {
        let last = -1, same = 0;
        for (let i = 0; i < 40 && same < 3; i++) { const w = (await dockRect(page)).width; same = Math.abs(w - last) < 0.5 ? same + 1 : 0; last = w; await sleep(120); }
        await sleep(450);
        return last;
    }
    const lastIns = page => page.evaluate(() => { const a = window.__ins || []; return a.length ? a[a.length - 1] : null; });
    const mountInfo = page => page.evaluate(() => { const m = document.querySelector('#c4AnMount'); return m ? { cls: m.className, w: m.clientWidth, text: m.innerText.replace(/\s+/g, ' '), ids: [...m.querySelectorAll('.c4an-sec')].map(s => s.id) } : null; });
    const openTab = async (page, tab) => { await page.click('.c4-tab[data-tab="' + tab + '"]'); return settle(page); };
    const paneFits = page => page.evaluate(() => { const m = document.querySelector('#c4Main'); return { sw: m.scrollWidth, cw: m.clientWidth }; });
    // the two dock widths are read from app.js (not typed a second time): the remembered wide size and the Analytics size
    const APPSRC = fs.readFileSync(path.join(ROOT, 'C4Live', 'app.js'), 'utf8');
    const konst = (n, rx) => { const m = rx.exec(APPSRC); if (!m) throw new Error('constant ' + n + ' not found in app.js'); return Number(m[1]); };
    const WIDE_MAX = konst('WIDE_MAX', /const WIDE_MAX = (\d+)/), WIDE_FRAC = konst('WIDE_FRAC', /WIDE_FRAC = ([\d.]+)/);
    const AN_MAX = konst('AN_MAX', /const AN_MAX = (\d+)/), AN_FRAC = konst('AN_FRAC', /AN_FRAC = ([\d.]+)/);
    const wideW = vw => Math.min(WIDE_MAX, WIDE_FRAC * vw);
    const anW = vw => Math.min(AN_MAX, AN_FRAC * vw - 2 * 12);   // 12 = EDGE, the dock's margin to the viewport edge

    // ---------------------------------------------------------------- A: the Analytics tab
    async function scenA() {
        const res = {};
        const { page, ctx, errors } = await open('');
        try {
            res['the dock has an Analytics tab (positive control: the Mining tab is there too)'] = await page.evaluate(() => !!document.querySelector('.c4-tab[data-tab="analytics"]') && !!document.querySelector('.c4-tab[data-tab="mining"]'));
            await openTab(page, 'analytics');
            const mi = await mountInfo(page);
            res['analytics tab shows all six sections (' + A.sections.join(', ') + ')'] = !!mi && A.sections.length === 6 && A.sections.every(id => mi.ids.includes('c4an-' + id));
            if (!mi || !mi.ids.length) return res;   // nothing drawn: the rest cannot run (a broken page ends here, with the check above FAIL)
            const model = A.build(FX.L, FX.B);
            const small = model.mining.bySize.slice().sort((a, b) => b.n - a.n)[0];
            res['mining section number = C4Analytics.build on the same files (' + small.size + ' n=' + small.n + ')'] = !!mi && mi.text.includes(small.size + ' n=' + small.n);
            res['council section number = build (' + model.council.ranked + ' ranked players of ' + model.council.owners + ')'] = !!mi && mi.text.includes(model.council.ranked + ' ranked players of ' + model.council.owners);
            res['stakes section number = build (' + model.stakes.n + ' claim stakes read)'] = !!mi && mi.text.includes(model.stakes.n + ' claim stakes read');
            res['game rules section is drawn from config-summary.json (recipe count on the page)'] = !!mi && /Game rules on chain/i.test(mi.text) && /\d+ recipes making/.test(mi.text);
            const r0 = model.compare.res[0];
            res['ships-vs-stakes section number = build (' + r0.r + ' ' + fmt(r0.ships) + ')'] = !!mi && mi.text.includes(r0.r + ' ' + fmt(r0.ships));
            res['the page mount equals a fresh C4Analytics render of the same model at the same width'] = await page.evaluate(async ([m, bodies, latest]) => {
                const el = document.createElement('div'), mount = document.querySelector('#c4AnMount');
                const cfg = await fetch('config-summary.json').then(r => (r.ok ? r.json() : null)).catch(() => null);   // the page draws the game rules from this file
                window.C4Analytics.render(el, window.C4Analytics.build(latest, bodies, cfg), { width: mount.clientWidth, reducedMotion: false });
                return el.innerHTML === mount.innerHTML;
            }, [null, { bodies: FX.B.bodies }, FX.L]);
            const nav = await page.evaluate(() => [...document.querySelectorAll('#c4AnNav button')].map(b => b.dataset.an + '|' + b.textContent));
            res['section nav has six buttons: Mining / Council rank / Claim stakes / Ships vs stakes / Emission / Game rules'] = nav.join(';') === 'mining|Mining;council|Council rank;stakes|Claim stakes;compare|Ships vs stakes;economy|Emission;config|Game rules';
            await shot(page, 'analytics-expanded-top');
            const pos = {};
            for (const id of A.sections) {
                await page.click('#c4AnNav button[data-an="' + id + '"]');
                await sleep(900);
                pos[id] = await page.evaluate(id2 => { const s = document.getElementById('c4an-' + id2), m = document.querySelector('#c4Main'); const sr = s.getBoundingClientRect(), mr = m.getBoundingClientRect(); const nv = document.querySelector('#c4AnNav').getBoundingClientRect(); return { top: sr.top - mr.top, nav: nv.bottom - mr.top, st: m.scrollTop }; }, id);
                await shot(page, 'analytics-expanded-' + id);
            }
            const lastOk = A.sections.every(id => pos[id].top >= -2 && pos[id].top <= pos[id].nav + 140);
            res['nav buttons scroll their section to the top of the pane, below the sticky nav'] = lastOk && pos.compare.st > pos.mining.st;
            res['the sticky nav stays at the top of the pane while scrolled'] = Math.abs(pos.compare.nav - pos.mining.nav) < 2 && pos.compare.nav > 0;
            const fit = await paneFits(page);
            res['analytics pane has no horizontal scrollbar (expanded)'] = fit.sw <= fit.cw + 1;
            // normal width: the visitor restores the dock
            await page.click('#c4DockWide'); await settle(page);
            const mn = await mountInfo(page), fn = await paneFits(page);
            res['normal width: analytics is c4an-narrow, all six sections, no horizontal scrollbar'] = !!mn && /c4an-narrow/.test(mn.cls) && A.sections.every(id => mn.ids.includes('c4an-' + id)) && fn.sw <= fn.cw + 1;
            await page.evaluate(() => { document.querySelector('#c4Main').scrollTop = 0; }); await sleep(200);
            await shot(page, 'analytics-normal-top');
            res['no page errors on the Analytics tab'] = errors.length === 0;
            if (errors.length) console.log('    ' + errors.join(' | '));
        } finally { await ctx.close(); }
        return res;
    }
    // a data reload redraws the open Analytics tab
    async function scenReload() {
        const res = {};
        const { page, ctx } = await open('');
        try {
            await openTab(page, 'analytics');
            const before = await mountInfo(page), nb = A.build(FX.L, FX.B).stakes.n;
            if (!before) return res;
            const L2 = newer(FX.L, 3), n2 = A.build(L2, FX.B).stakes.n;
            res['(setup) the fixture reload changes the stake count (' + nb + ' -> ' + n2 + ')'] = n2 === nb + 3 && before.text.includes(nb + ' claim stakes read');
            state.latest = JSON.stringify(L2);
            try {
                await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
                await page.waitForFunction(n => /claim stakes read/.test(document.querySelector('#c4AnMount').innerText) && document.querySelector('#c4AnMount').innerText.includes(n + ' claim stakes read'), n2, { timeout: 6000 }).catch(() => {});
                const after = await mountInfo(page);
                res['a data reload redraws the Analytics tab: ' + n2 + ' claim stakes read'] = !!after && after.text.includes(n2 + ' claim stakes read') && !after.text.includes(nb + ' claim stakes read');
            } finally { state.latest = JSON.stringify(FX.L); }
        } finally { await ctx.close(); }
        return res;
    }

    // ---------------------------------------------------------------- B: the expand button
    async function scenB() {
        const res = {};
        const { page, ctx } = await open('');
        try {
            const w0 = (await dockRect(page)).width, i0 = await lastIns(page);
            res['normal dock width is 440 on a fresh visit (1440x900)'] = Math.abs(w0 - 440) < 1;
            res['the expand button is shown, aria-pressed false, titled'] = await page.evaluate(() => { const b = document.querySelector('#c4DockWide'); return !!b && b.offsetParent !== null && b.getAttribute('aria-pressed') === 'false' && /larger/i.test(b.title); });
            await page.click('#c4DockWide'); const w1 = await settle(page);
            const i1 = await lastIns(page);
            res['expand: the dock takes min(1000px, 62vw) = ' + wideW(1440).toFixed(0) + ' px'] = Math.abs(w1 - wideW(1440)) < 2;
            res['expand: the map inset follows (right inset ' + (i0 && i0.right) + ' -> ' + (i1 && i1.right) + ')'] = !!i0 && !!i1 && i1.right > i0.right + 300;
            res['expand: button says pressed and offers to restore'] = await page.evaluate(() => { const b = document.querySelector('#c4DockWide'); return b.getAttribute('aria-pressed') === 'true' && /normal|smaller|back/i.test(b.title); });
            // every tab at the wide width: no horizontal scrollbar, and something drawn
            const tabs = await page.evaluate(() => [...document.querySelectorAll('.c4-tab[data-tab]')].filter(b => !b.hidden).map(b => b.dataset.tab));
            res['(positive control) the tab list has mining, resource, combat, fleets, owners, analytics'] = ['mining', 'resource', 'combat', 'fleets', 'owners', 'analytics'].every(t => tabs.includes(t));
            const bad = [];
            for (const t of tabs) { await openTab(page, t); const f = await paneFits(page); const filled = await page.evaluate(tt => document.querySelector('#sec-' + tt).innerText.trim().length > 20, t); if (f.sw > f.cw + 1 || !filled) bad.push(t + ' ' + f.sw + '/' + f.cw + (filled ? '' : ' empty')); if (t === 'mining') await shot(page, 'mining-expanded'); }
            res['every tab works at the wide width: no horizontal scrollbar, content drawn'] = bad.length === 0;
            if (bad.length) console.log('    ' + bad.join(' | '));
            await openTab(page, 'mining');
            const m = await paneFits(page);
            res['Mining tab at the expanded width: scrollWidth <= clientWidth (' + m.sw + ' <= ' + m.cw + ')'] = m.sw <= m.cw + 1;
            // the choice persists
            await page.reload(); await page.waitForFunction(() => document.querySelectorAll('.c4-tab').length > 0 && document.querySelector('#c4Empty').hidden, null, { timeout: 25000 }).catch(() => {}); await sleep(900);
            const w2 = await settle(page);
            res['after a reload the dock is still expanded (' + w2.toFixed(0) + ' px)'] = Math.abs(w2 - wideW(1440)) < 2;
            await page.click('#c4DockWide'); const w3 = await settle(page);
            res['restore: back to 440 and the choice persists across a reload'] = Math.abs(w3 - 440) < 1 && await (async () => { await page.reload(); await page.waitForFunction(() => document.querySelectorAll('.c4-tab').length > 0, null, { timeout: 25000 }).catch(() => {}); await sleep(900); return Math.abs((await settle(page)) - 440) < 1; })();
        } finally { await ctx.close(); }
        // Analytics is always large: min(2200px, 90vw) (constants read from app.js); the visitor's remembered choice only
        // decides the OTHER tabs, and the size button on Analytics shrinks / regrows that tab for this visit
        {
            const { page: p2, ctx: c2 } = await open('');
            try {
                const a0 = (await dockRect(p2)).width;
                await openTab(p2, 'analytics'); const a1 = (await dockRect(p2)).width;
                res['opening Analytics at the normal width takes the dock to min(2200px, 90vw) (' + a0.toFixed(0) + ' -> ' + a1.toFixed(0) + ', want ' + anW(1440).toFixed(0) + ')'] = Math.abs(a0 - 440) < 1 && Math.abs(a1 - anW(1440)) < 2;
                const mi = await mountInfo(p2);
                res['analytics draws c4an-x3 (three columns) when the pane is 1100 px or wider (pane ' + mi.w + ' px)'] = mi.w >= 1100 && /c4an-x3/.test(mi.cls) && /c4an-wide/.test(mi.cls);
                await openTab(p2, 'mining');
                res['leaving Analytics returns the dock to 440'] = Math.abs((await dockRect(p2)).width - 440) < 1;
                await openTab(p2, 'analytics');
                await p2.click('#c4DockWide'); const s1 = await settle(p2);
                res['the size button on Analytics shrinks it to 440 for the visit'] = Math.abs(s1 - 440) < 1;
                await p2.click('#c4DockWide'); const s2 = await settle(p2);
                res['a second press of the size button on Analytics regrows it'] = Math.abs(s2 - anW(1440)) < 2;
            } finally { await c2.close(); }
        }
        {
            const { page: p3, ctx: c3 } = await open('', { storage: { 'c4.dock.wide': '0' } });
            try {
                await openTab(p3, 'analytics');
                res['a visitor whose stored choice is normal STILL gets the large Analytics'] = Math.abs((await dockRect(p3)).width - anW(1440)) < 2;
                await openTab(p3, 'mining');
                res['a visitor whose stored choice is normal still gets 440 on Mining'] = Math.abs((await dockRect(p3)).width - 440) < 1;
            } finally { await c3.close(); }
        }
        {
            const { page: p5, ctx: c5 } = await open('', { storage: { 'c4.dock.wide': '1' } });
            try {
                await openTab(p5, 'analytics'); await openTab(p5, 'mining');
                res['the remembered wide choice gives min(1000px, 62vw) on Mining after a visit to Analytics'] = Math.abs((await dockRect(p5)).width - wideW(1440)) < 2;
            } finally { await c5.close(); }
        }
        {
            const { page: p6, ctx: c6 } = await open('', { viewport: { width: 1000, height: 800 } });
            try {
                await openTab(p6, 'analytics');
                const mi = await mountInfo(p6);
                res['analytics draws c4an-wide (two columns, not c4an-x3) when the pane is 640 to 1099 px (pane ' + mi.w + ' px at 1000 wide)'] = mi.w >= 640 && mi.w < 1100 && /c4an-wide/.test(mi.cls) && !/c4an-x3/.test(mi.cls);
            } finally { await c6.close(); }
        }
        // the size button on Analytics never changes the remembered wide choice of the other tabs (page review 2026-11-23, task 13)
        {
            const { page: p7, ctx: c7 } = await open('');
            try {
                const stored = () => p7.evaluate(() => { try { return localStorage.getItem('c4.dock.wide'); } catch (e) { return 'ERR'; } });
                const pressed = () => p7.evaluate(() => document.querySelector('#c4DockWide').getAttribute('aria-pressed'));
                const isBig = async () => (await dockRect(p7)).width > 700;
                await p7.click('#c4DockWide'); const m1 = await settle(p7);
                res['remembered choice: the size button on Mining widens the dock to min(1000px, 62vw), stored c4.dock.wide = 1'] = Math.abs(m1 - wideW(1440)) < 2 && await stored() === '1';
                await openTab(p7, 'analytics');
                await p7.click('#c4DockWide'); const a1 = await settle(p7);
                res['remembered choice: pressing the size button on Analytics returns that tab to the normal 440'] = Math.abs(a1 - 440) < 1;
                await openTab(p7, 'mining'); const m2 = (await dockRect(p7)).width;
                res['remembered choice: back on Mining the dock is STILL min(1000px, 62vw) after the Analytics press'] = Math.abs(m2 - wideW(1440)) < 2;
                res['remembered choice: localStorage c4.dock.wide is still 1 after the Analytics press'] = await stored() === '1';
                // aria-pressed follows whether the dock is large, across the phone sheet and back
                res['aria-pressed is true on Mining with the wide dock'] = await pressed() === 'true' && await isBig();
                await p7.setViewportSize({ width: 390, height: 844 }); await sleep(900);
                res['phone sheet: the size button reports not pressed (the dock is a sheet, not large)'] = await pressed() === 'false';
                await p7.setViewportSize({ width: 1440, height: 900 }); await sleep(1100);
                res['back on desktop: aria-pressed matches the dock again (wide dock, true)'] = await pressed() === 'true' && await isBig();
                res['remembered choice still 1 after the viewport round trips'] = await stored() === '1';
            } finally { await c7.close(); }
        }
        {
            const { page: p8, ctx: c8 } = await open('');
            try {
                const pressed = () => p8.evaluate(() => document.querySelector('#c4DockWide').getAttribute('aria-pressed'));
                const isBig = async () => (await dockRect(p8)).width > 700;
                await openTab(p8, 'analytics'); await sleep(700);
                res['Analytics large (remembered choice off): aria-pressed is true while the dock is large'] = await isBig() && await pressed() === 'true';
                await p8.setViewportSize({ width: 390, height: 844 }); await sleep(900);
                const onPhone = await pressed();
                await p8.setViewportSize({ width: 1440, height: 900 }); await sleep(1100);
                res['Analytics after a phone round trip: aria-pressed matches whether the dock is large (' + onPhone + ' on the phone sheet)'] = onPhone === 'false' && await isBig() && await pressed() === 'true';
            } finally { await c8.close(); }
        }
        return res;
    }

    // ---------------------------------------------------------------- C: the stake view beside a wide dock
    async function scenC() {
        const res = {};
        for (const [vw, vh, wantFull] of [[1440, 900, true], [1920, 1080, false]]) {
            const { page, ctx } = await open('?stake=' + FX.FIX.a, { viewport: { width: vw, height: vh }, storage: { 'c4.dock.wide': '1' } });
            try {
                await page.waitForFunction(() => { const e = document.querySelector('#c4StakeView'); return e && e.classList.contains('open') && e.querySelector('.sv-stage'); }, null, { timeout: 9000 }).catch(() => {});
                await sleep(900);
                const g = await page.evaluate(() => { const v = document.querySelector('#c4StakeView').getBoundingClientRect(), d = document.querySelector('#c4Dock').getBoundingClientRect(); return { vr: v.right, vl: v.left, vt: v.top, vb: v.bottom, dl: d.left, dw: d.width, full: document.querySelector('#c4StakeView').classList.contains('sv-full'), tiles: document.querySelectorAll('.sv-t').length }; });
                const label = vw + 'x' + vh;
                res['stake view opens with the dock expanded (' + label + ', ' + g.tiles + ' tiles)'] = g.tiles === 13;
                res['dock is expanded (' + label + '): ' + g.dw.toFixed(0) + ' px'] = Math.abs(g.dw - wideW(vw)) < 2;
                const beside = g.vr <= g.dl + 1, covers = g.vl <= 1 && g.vt <= 1 && g.vr >= vw - 1 && g.vb >= vh - 1;
                res['stake view right edge <= dock left edge, or it covers the viewport (' + label + ')'] = beside || covers;
                res['stake view is ' + (wantFull ? 'full screen' : 'left of the dock') + ' at ' + label + ' (threshold: full screen when less than 700 px is left beside the dock)'] = wantFull ? covers && g.full : beside && !g.full;
                await shot(page, 'stake-expanded-' + label);
            } finally { await ctx.close(); }
        }
        return res;
    }

    // ---------------------------------------------------------------- D: phones
    async function scenD() {
        const res = {};
        const { page, ctx, errors } = await open('', { viewport: { width: 390, height: 844 }, storage: { 'c4.dock.wide': '1' } });
        try {
            const d0 = await page.evaluate(() => { const r = document.querySelector('#c4Dock').getBoundingClientRect(); return { w: r.width, h: r.height }; });
            res['phone: the expand button is hidden'] = await page.evaluate(() => document.querySelector('#c4DockWide').offsetParent === null);
            await openTab(page, 'analytics');
            const d1 = await page.evaluate(() => { const r = document.querySelector('#c4Dock').getBoundingClientRect(); return { w: r.width, h: r.height }; });
            res['phone: the sheet stays full width and its height does not change (saved wide choice ignored)'] = Math.abs(d1.w - 390) < 2 && Math.abs(d0.h - d1.h) < 2 && Math.abs(d0.w - 390) < 2;
            const mi = await mountInfo(page), f = await paneFits(page);
            res['phone: Analytics shows all six sections, narrow, no horizontal scrollbar'] = !!mi && /c4an-narrow/.test(mi.cls) && A.sections.every(id => mi.ids.includes('c4an-' + id)) && f.sw <= f.cw + 1;
            await shot(page, 'phone-analytics');
            res['phone: no page errors'] = errors.length === 0;
        } finally { await ctx.close(); }
        return res;
    }

    // ---------------------------------------------------------------- E: the dot cards (2026-11-23)
    async function scenE() {
        const res = {};
        const { page, ctx, errors } = await open('');
        try {
            await openTab(page, 'analytics');
            const model = A.build(FX.L, { bodies: FX.B.bodies });
            const rows = model.mining.rows;
            const inPane = () => page.evaluate(() => {
                const pop = document.querySelector('#c4AnMount .c4an-pop'), pane = document.querySelector('#c4Main');
                if (!pop || pop.hidden) return null;
                const r = pop.getBoundingClientRect(), p = pane.getBoundingClientRect();
                return { inside: r.left >= p.left - 0.5 && r.right <= p.right + 0.5 && r.top >= p.top - 0.5 && r.bottom <= p.bottom + 0.5, w: r.width, h: r.height, text: pop.innerText.replace(/\s+/g, ' '), hasStyleAttr: pop.hasAttribute('style') };
            });
            // the dot used below must be one the pointer can reach: in a busy galaxy two fleets with the same yield sit on one point,
            // and the later one covers the earlier (seen 2026-11-23: f206 over f0). Take the first dot that is on top at its own centre.
            const di = await page.evaluate(() => {
                const ds = Array.from(document.querySelectorAll('#c4AnMount svg circle.an-dot[data-an-k]'));
                for (const d of ds) { d.scrollIntoView({ block: 'center' }); const r = d.getBoundingClientRect(); if (document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === d) return Number(d.getAttribute('data-an-k').slice(1)); }
                return -1;
            });
            res['dots: at least one dot is reachable by the pointer (not covered by another dot)'] = di >= 0;
            const dotSel = '#c4AnMount svg circle.an-dot[data-an-k="f' + di + '"]', dotRow = rows[di] || rows[0];
            res['dots: both scatters are drawn with a keyed, focusable dot per mining fleet (positive control: model rows > 0)'] = rows.length > 0 && await page.evaluate(n => document.querySelectorAll('#c4AnMount circle.an-dot[data-an-k][tabindex="0"]').length === n, rows.length + model.mining.richness.points.length);
            await page.locator(dotSel).first().scrollIntoViewIfNeeded();
            await page.locator(dotSel).first().hover();
            await sleep(150);
            const h1 = await inPane();
            const clear = await page.evaluate(sel => { const d = document.querySelector(sel).getBoundingClientRect(), p = document.querySelector('#c4AnMount .c4an-pop'); if (!p || p.hidden) return false; const r = p.getBoundingClientRect(); const off = r.top >= d.bottom - 0.5 || r.bottom <= d.top + 0.5 || r.left >= d.right - 0.5 || r.right <= d.left + 0.5;
                // "next to" is measured too (a card left at the mount's corner is clear of most dots): just under or just over the dot, and over its column
                const gap = r.top >= d.bottom - 0.5 ? r.top - d.bottom : d.top - r.bottom; return off && gap >= -0.5 && gap <= 12 && r.left <= d.right && r.right >= d.left; }, dotSel);
            res['dots: hovering a dot opens its card inside the pane, next to the dot (not on it), naming the fleet and its composition'] = !!h1 && h1.inside && clear && h1.text.includes(dotRow.n || 'fleet') && /Ships in the fleet/.test(h1.text) && (!dotRow.comp.length || h1.text.includes(dotRow.comp[0].name.replace(/\s+Default Config$/, '') + ' x ' + dotRow.comp[0].n));
            res['dots: the card is placed through the CSSOM (a style set by script is allowed by the page CSP) and the markup has no style attribute'] = !!h1 && await page.evaluate(() => { const p = document.querySelector('#c4AnMount .c4an-pop'); return p.style.left !== '' && p.style.top !== '' && !/\sstyle\s*=/i.test(document.querySelector('#c4AnMount').innerHTML.replace(/<div class="c4an-pop"[^>]*>/, '')); });
            await shot(page, 'dot-card-hover');
            await page.mouse.move(5, 5);
            await sleep(100);
            res['dots: leaving the dot closes an unpinned card'] = (await inPane()) === null;
            await page.locator(dotSel).first().click();
            await sleep(150);
            const h2 = await inPane();
            res['dots: a click pins the card (it stays when the pointer leaves)'] = !!h2 && (await page.mouse.move(5, 5), await sleep(100), (await inPane()) !== null);
            await shot(page, 'dot-card-pinned');
            // the owner name in the card opens that owner's drawer; the Analytics tab stays
            const ownerO = dotRow.o;
            const ob = page.locator('#c4AnMount .c4an-pop button[data-an-pick="owner"]');
            const hasOwnerBtn = await ob.count() > 0;
            if (hasOwnerBtn) await ob.first().click();
            await sleep(500);
            if (process.env.PANEL_DEBUG) console.log('    owner pick: button ' + hasOwnerBtn + ', drawer ' + await page.evaluate(() => { const d = document.querySelector('#c4Drawer'); return d.className + ' | ' + d.innerText.slice(0, 80); }));
            res['dots: clicking the owner name opens that owner\'s drawer and leaves the Analytics tab as it is'] = hasOwnerBtn && await page.evaluate(o => { const d = document.querySelector('#c4Drawer'); const k = d.querySelector('.kind'), nm = d.querySelector('.c4-dname'); return d.classList.contains('open') && !!k && !!nm && /owner|player/i.test(k.textContent) && nm.textContent.trim().length > 0; }, ownerO) &&
                await page.evaluate(() => !!document.querySelector('#c4AnMount .c4an-sec'));
            res['dots: after the pick the card is closed'] = (await inPane()) === null;
            await page.keyboard.press('Escape'); await sleep(200);
            // keyboard: focus a dot, Enter opens, Escape closes and returns focus to the dot
            await page.locator(dotSel).first().scrollIntoViewIfNeeded();
            await page.locator(dotSel).first().focus();
            await sleep(150);
            const k1 = await inPane();
            res['keyboard: focusing a dot shows its card'] = !!k1 && k1.inside;
            await page.keyboard.press('Enter'); await sleep(150);
            res['keyboard: Enter pins the card and puts focus on its first button'] = await page.evaluate(() => { const a = document.activeElement; return !!a && a.classList.contains('c4an-pk') && !!a.closest('.c4an-pop'); });
            await page.keyboard.press('Escape'); await sleep(150);
            res['keyboard: Escape closes the card and focus goes back to the dot'] = (await inPane()) === null && await page.evaluate(k => document.activeElement && document.activeElement.getAttribute('data-an-k') === k, 'f' + di);
            // outside click
            await page.locator(dotSel).first().click(); await sleep(100);
            await page.mouse.click(5, 450); await sleep(150);
            res['an outside click closes the card'] = (await inPane()) === null;
            // edges: the dot furthest right, and a chart row at the pane's bottom
            const far = await page.evaluate(() => { let best = null, bx = -1; document.querySelectorAll('#c4AnMount circle.an-dot[data-an-k]').forEach(c => { const x = c.getBoundingClientRect().right; if (x > bx) { bx = x; best = c.getAttribute('data-an-k') + '|' + [...document.querySelectorAll('#c4AnMount circle.an-dot')].indexOf(c); } }); return best; });
            const farIdx = Number(far.split('|')[1]);
            const farDot = page.locator('#c4AnMount circle.an-dot[data-an-k]').nth(farIdx);
            await farDot.scrollIntoViewIfNeeded(); await farDot.hover(); await sleep(150);
            const e1 = await inPane();
            res['edge: the card of the dot furthest to the right stays inside the pane'] = !!e1 && e1.inside;
            await shot(page, 'dot-card-right-edge');
            await page.mouse.move(5, 5);
            // the second scatter, and the chart rows (ship models against stake tiers)
            const hit = page.locator('#c4AnMount rect.an-hit[data-an-k]');
            const nHit = await hit.count();
            res['rows: the ship models against stake tiers chart has one hit area per row (positive control: more than 8)'] = nHit > 8;
            await page.evaluate(() => { const l = [...document.querySelectorAll('#c4AnMount rect.an-hit')].pop(); l.scrollIntoView({ block: 'end' }); });
            await sleep(150);
            await hit.last().hover(); await sleep(150);
            const e2 = await inPane();
            res['edge: the card of the last chart row, at the bottom of the pane, stays inside the pane'] = !!e2 && e2.inside;
            await shot(page, 'row-card-bottom');
            await page.mouse.move(5, 5);
            const mrow = page.locator('#c4AnMount rect.an-hit[data-an-k="r0"]');
            await mrow.scrollIntoViewIfNeeded(); await mrow.click(); await sleep(150);
            const e3 = await inPane();
            res['rows: a click on the first row lists the fleets or stakes counted'] = !!e3 && e3.inside && /Median [\d.,]+ units per second per (ship|stake)/.test(e3.text);
            await shot(page, 'row-card-first');
            res['only one card in the page'] = await page.evaluate(() => [...document.querySelectorAll('.c4an-pop')].filter(p => !p.hidden).length <= 1);
            res['no page errors with the dot cards (the page CSP raised nothing)'] = errors.length === 0;
            if (errors.length) console.log('    ' + errors.join(' | '));
            // the 360 px look and the three-column look
            await page.keyboard.press('Escape');
        } finally { await ctx.close(); }
        return res;
    }

    const report = (res, label) => { for (const [k, v] of Object.entries(res)) check(k, v); return res; };
    if (process.env.PANEL_E_ONLY) { report(await scenE()); await browser.close(); server.close(); return; }   // quick loop on the dot cards alone
    console.log('\n[A] Analytics tab'); const rA = report(await scenA());
    console.log('\n[A2] Data reload'); const rR = report(await scenReload());
    console.log('\n[B] Expandable panel'); const rB = report(await scenB());
    console.log('\n[C] Claim stake view beside the wide dock'); const rC = report(await scenC());
    console.log('\n[D] Phone'); const rD = report(await scenD());
    console.log(String.fromCharCode(10)+'[E] Dot and row cards'); const rE = report(await scenE());

    // ---------------------------------------------------------------- negative controls
    shotsOn = false;   // the broken pages must not overwrite the screenshots
    console.log('\n[N] Negative controls: app.js broken in one place; the named check must FAIL (it passed above)');
    const NEG = [
        ['Analytics tab draws nothing (renderTab entry removed)', t => t.replace('analytics: renderAnalytics,', 'analytics: () => {},'), scenA, /analytics tab shows all six sections/, rA],
        ['tab clicks do nothing (tab handler removed)', t => t.replace("if (tab) { setDockCollapsed(false);", 'if (false) { setDockCollapsed(false);'), scenA, /analytics tab shows all six sections/, rA],
        // two paths redraw the tab after a reload (rebuild() and the bodies reload), so both are cut
        ['a data reload does not redraw Analytics (rendered cache kept, bodies redraw removed)', t => t.replace('S.rendered = {};', 'S.rendered = S.rendered || {};').replace('if (S.rendered.analytics) paintAnalytics();', ''), scenReload, /a data reload redraws the Analytics tab/, rR],
        ['the old Analytics button line is back (shrinking Analytics also clears the remembered wide choice)', t => t.replace('S.dock.anOff = !S.dock.anOff; syncDockW(); }', 'S.dock.anOff = !S.dock.anOff; if (S.dock.anOff && S.dock.wide) setDockWide(false, true); else syncDockW(); }'), scenB, /back on Mining the dock is STILL/, rB],
        ['the old Analytics button line is back (localStorage check)', t => t.replace('S.dock.anOff = !S.dock.anOff; syncDockW(); }', 'S.dock.anOff = !S.dock.anOff; if (S.dock.anOff && S.dock.wide) setDockWide(false, true); else syncDockW(); }'), scenB, /localStorage c4.dock.wide is still 1 after the Analytics press/, rB],
        ['aria-pressed follows only the remembered flag (not whether the dock is large)', t => t.replace("b.setAttribute('aria-pressed', dockBig() ? 'true' : 'false');", "b.setAttribute('aria-pressed', S.dock.wide ? 'true' : 'false');"), scenB, /Analytics large .remembered choice off.: aria-pressed is true/, rB],
        ['aria-pressed ignores the phone sheet', t => t.replace("b.setAttribute('aria-pressed', dockBig() ? 'true' : 'false');", "b.setAttribute('aria-pressed', S.dock.wide ? 'true' : 'false');"), scenB, /phone sheet: the size button reports not pressed/, rB],
        ['Analytics not redrawn at a new width (width observer removed)', t => t.replace('S.an.ro.observe(mount);', ''), scenA, /normal width: analytics is c4an-narrow/, rA],
        ['expand button does nothing on Mining (handler removed)', t => t.replace('else setDockWide(!S.dock.wide, true);', ''), scenB, /expand: the dock takes/, rB],
        ['dock width ignores the expanded flag', t => t.replace('return S.dock.wide ? Math.max(S.dock.w, Math.round(Math.min(WIDE_MAX', 'return false ? Math.max(S.dock.w, Math.round(Math.min(WIDE_MAX'), scenB, /expand: the map inset follows/, rB],
        ['the choice is not saved (localStorage write removed)', t => t.replace("localStorage.setItem('c4.dock.wide', on ? '1' : '0')", '0'), scenB, /after a reload the dock is still expanded/, rB],
        ['Analytics is never large (anBig always false)', t => t.replace("const anBig = () => S.view === 'tab'", "const anBig = () => false && S.view === 'tab'"), scenB, /opening Analytics at the normal width takes the dock/, rB],
        ['leaving Analytics keeps the large dock (sticky)', t => t.replace('return S.dock.wide ? Math.max(S.dock.w, Math.round(Math.min(WIDE_MAX', 'return (S.dock.wide || S.dock.lastW > 800) ? Math.max(S.dock.w, Math.round(Math.min(WIDE_MAX'), scenB, /leaving Analytics returns the dock to 440/, rB],
        ['a stored "normal" choice shrinks Analytics again (the old rule)', t => t.replace('&& !S.dock.anOff && !SHEET_MQ.matches;', '&& !S.dock.anOff && (S.dock.wide || !S.dock.wideUsed) && !SHEET_MQ.matches;'), scenB, /a visitor whose stored choice is normal STILL gets the large Analytics/, rB],
        ['the size button on Analytics does nothing', t => t.replace('S.dock.anOff = !S.dock.anOff; syncDockW();', 'syncDockW();'), scenB, /the size button on Analytics shrinks it to 440/, rB],
        ['the size button on Analytics only shrinks (no regrow)', t => t.replace('S.dock.anOff = !S.dock.anOff; syncDockW();', 'S.dock.anOff = true; syncDockW();'), scenB, /a second press of the size button on Analytics regrows it/, rB],
        ['analytics never uses three columns (module)', t => t.replace('width >= 1100 ? 3', 'width >= 99999 ? 3').replace('width >= 1900 ? 4', 'width >= 99999 ? 4').replace('width >= 2700 ? 5', 'width >= 99999 ? 5'), scenB, /analytics draws c4an-x3/, rB, 'an'],
        ['analytics never uses two columns (module)', t => t.replace('var wide = width >= 640,', 'var wide = width >= 99999,'), scenB, /analytics draws c4an-wide/, rB, 'an'],
        ['stake view never goes full screen beside a wide dock', t => t.replace("el.classList.toggle('sv-full', dockBig() && !SHEET_MQ.matches && left < SV_FULL_PX)", "el.classList.toggle('sv-full', false)"), scenC, /stake view is full screen at 1440x900/, rC],
        ['the card asks for nothing: onPick wiring removed from the Analytics mount', t => t.replace('esc, onPick: anPick });', 'esc });'), scenE, /clicking the owner name opens that owner/, rE],
        ['Escape does not close the card (module)', t => t.replace('closePop(true); if (typeof ev.stopPropagation', 'if (typeof ev.stopPropagation'), scenE, /Escape closes the card and focus goes back/, rE, 'an'],
        ['the card is never placed (module: place removed)', t => t.replace('        place(el, pop, mark);\n        return true;', '        return true;'), scenE, /hovering a dot opens its card inside the pane/, rE, 'an'],
        ['an outside click does not close the card (module)', t => t.replace("if (typeof openEl.contains === 'function' && openEl.contains(t)) return;", 'return;'), scenE, /an outside click closes the card/, rE, 'an'],
        ['phone: the expand button is shown on a sheet (css)', t => t.replace('.c4-dock-grip, .c4-dock-wide { display: none; }', '.c4-dock-grip { display: none; }'), scenD, /phone: the expand button is hidden/, rD, 'css']
    ];
    for (const [name, fn, scen, rx, base0, kind] of NEG) {
        const key = Object.keys(base0).find(k => rx.test(k));
        if (!key) { check('negative "' + name + '": the named check exists', false, String(rx)); continue; }
        check('negative "' + name + '": the check passed on the unbroken page (positive control)', base0[key] === true, key);
        const slot = kind === 'css' ? 'mutCss' : kind === 'an' ? 'mutAn' : 'mut';
        state[slot] = fn;
        let r2; const log = console.log; console.log = () => {};
        try { r2 = await scen(); } catch (e) { r2 = { __err: String(e) }; } finally { console.log = log; state[slot] = null; }
        const k2 = Object.keys(r2).find(k => rx.test(k));
        check('negative "' + name + '": the named check FAILS with the change in', !r2.__err && !!k2 && r2[k2] === false, r2.__err || (k2 ? 'the check still passed' : 'the named check did not run'));
    }
    await browser.close(); server.close();
}
main().then(() => { console.log('\n' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); }, e => { console.log('CRASH', e); process.exit(2); });
