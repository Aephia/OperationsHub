// c4-browser-collect-check.js - drives C4Live as a public visitor: a real browser on a non-local hostname reading the
// REAL z.ink chain and saving to IndexedDB. Makes a few real reads of the shared endpoint, so do not loop it.
// Usage: node Test/c4-browser-collect-check.js
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const ROOT = path.join(__dirname, '..');
const { chromium } = require('module').createRequire(path.join(os.homedir(), '.claude/skills/teardown/node_modules/x.js'))('playwright');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
const READ_TIMEOUT = 180000;
let pass = 0, fail = 0;
const check = (n, ok, d) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + n + (ok || d === undefined ? '' : ' ' + JSON.stringify(d).slice(0, 400))); };

const server = http.createServer((q, s) => {
    const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!p.startsWith(path.normalize(ROOT)) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { s.writeHead(404); return s.end(); }
    s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(s);
});

const idb = (page, name) => page.evaluate(async n => (await window.C4Store.getAll()).get(n) ?? null, name);
const idbKeys = page => page.evaluate(async () => [...(await window.C4Store.getAll()).keys()].sort());
// Makes the saved snapshot look older so the cooldown has passed: the test creates that condition rather than waiting.
const ageSaved = (page, minutes) => page.evaluate(async m => {
    const all = await window.C4Store.getAll();
    const l = JSON.parse(all.get('latest.json')); l.generatedAt -= m * 60; all.set('latest.json', JSON.stringify(l));
    await window.C4Store.putAll(all); localStorage.removeItem('c4.read.at'); return l.generatedAt;
}, minutes);
const savedAt = async page => JSON.parse(await idb(page, 'latest.json')).generatedAt;
// Polls from Node: an async predicate handed to waitForFunction returns a truthy promise at once.
async function newer(page, before) {
    for (const end = Date.now() + READ_TIMEOUT; Date.now() < end; await page.waitForTimeout(1000)) if (await savedAt(page) > before) return true;
    return false;
}

async function open(ctx, url) {
    const page = await ctx.newPage();
    const seen = { rpc: [], mainnet: [], local: [], github: [], errors: [], csp: [] };
    page.on('console', m => { if (/Content Security Policy/i.test(m.text())) seen.csp.push(m.text().slice(0, 200)); });
    page.on('request', r => {
        const u = r.url();
        if (u.includes('testnet-rpc.z.ink')) seen.rpc.push(u);
        if (u.includes('mainnet-beta')) seen.mainnet.push(u);
        if (u.includes('/Data/c4-live/')) seen.local.push(u);
        if (u.includes('raw.githubusercontent')) seen.github.push(u);
    });
    page.on('pageerror', e => seen.errors.push(String(e.message)));
    await page.goto(url, { waitUntil: 'load' });
    return { page, seen };
}
const emptyState = page => page.evaluate(() => { const e = document.querySelector('#c4Empty'); return { hidden: e.hidden, text: e.innerText }; });
const rendered = page => page.waitForFunction(() => document.querySelector('#c4Empty').hidden && document.querySelectorAll('.c4-fa').length > 0, null, { timeout: READ_TIMEOUT });
const button = page => page.evaluate(() => { const b = document.querySelector('[data-c4-refresh]'); return b ? { text: b.textContent, disabled: b.disabled } : null; });

server.listen(0, '127.0.0.1', async () => {
    const port = server.address().port;
    const prod = `http://localhost:${port}/C4Live/index.html?chain=1`;   // chain code needs a secure context: the site is HTTPS, localhost counts
    const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--host-resolver-rules=MAP ops.test 127.0.0.1'] });
    try {
        // --- first visit: real chain
        const ctx = await browser.newContext({ viewport: { width: 1400, height: 850 } });
        const first = await open(ctx, prod);
        await first.page.waitForFunction(() => !document.querySelector('#c4Empty').hidden, null, { timeout: 15000 }).catch(() => {});
        const during = await emptyState(first.page);
        check('first visit: loading screen, not the old popup', /Loading C4 Live/.test(during.text) && !/No C4 Live data|npm run/.test(during.text), during);
        const t0 = Date.now();
        await rendered(first.page).catch(e => check('first visit: finished', false, String(e.message)));
        console.log(`INFO first read took ${((Date.now() - t0) / 1000).toFixed(1)} s, ${first.seen.rpc.length} RPC requests`);
        check('first visit: read z.ink directly', first.seen.rpc.length > 0);
        check('first visit: no GitHub, no local folder, no mainnet', !first.seen.github.length && !first.seen.local.length && !first.seen.mainnet.length, first.seen);
        check('first visit: no page errors', !first.seen.errors.length, first.seen.errors);
        check('security policy: the working page triggers no violations', !first.seen.csp.length, first.seen.csp);
        const blocked = await first.page.evaluate(() => fetch('https://example.com/stolen').then(() => false, () => true));
        check('security policy: a request to any other site is blocked', blocked && first.seen.csp.length > 0, first.seen.csp);
        const scriptRan = await first.page.evaluate(() => new Promise(done => { const d = document.createElement('div'); d.innerHTML = '<img src=x onerror="window.__pwned=1">'; document.body.append(d); setTimeout(() => done(!!window.__pwned), 800); }));
        check('security policy: an injected inline handler does not run', !scriptRan);
        const keys = await idbKeys(first.page);
        check('saved on this PC: the files the page needs', ['bodies.json', 'db.json', 'events.json', 'history.json', 'latest.json', 'owners.json'].every(k => keys.includes(k)), keys);
        check('saved on this PC: no lock or temp files', keys.every(k => k.endsWith('.json') && k !== 'prices.attempt.json'), keys);
        const latest = JSON.parse(await idb(first.page, 'latest.json'));
        const node = JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/c4-live/latest.json'), 'utf8'));
        const ratio = latest.fleets.length / node.fleets.length;
        check('browser read agrees with the Node collector (fleets within 20 %)', ratio > 0.8 && ratio < 1.2, [latest.fleets.length, node.fleets.length]);
        const named = (latest.owners || []).filter(o => o.name).length;
        check('Buffer stand-in decoded real owner names', named > (latest.owners || []).length * 0.5, [named, (latest.owners || []).length]);
        check('wealth still priced from the shipped price file', !!latest.ref, Object.keys(latest));
        const b1 = await button(first.page);
        check('fresh data: Refresh waits out the cooldown', b1 && b1.disabled && /Refresh in/.test(b1.text), b1);
        await first.page.close();

        // --- reopen: instant from the PC
        const again = await open(ctx, prod);
        await rendered(again.page);
        check('reopen: no chain requests at all', again.seen.rpc.length === 0, again.seen.rpc.length);
        await ageSaved(again.page, 10);
        await again.page.close();

        // --- refresh button
        const r = await open(ctx, prod);
        await rendered(r.page);
        const before = JSON.parse(await idb(r.page, 'latest.json')).generatedAt;
        const b2 = await button(r.page);
        check('after the cooldown: Refresh is enabled', b2 && !b2.disabled && b2.text === 'Refresh', b2);
        check('positive control: nothing read the chain before the click', r.seen.rpc.length === 0, r.seen.rpc.length);
        const tabB = await open(ctx, prod);
        await rendered(tabB.page);
        await r.page.click('[data-c4-refresh]');
        check('refresh: finished', await newer(r.page, before));
        await r.page.waitForFunction(() => { const b = document.querySelector('[data-c4-refresh]'); return b && /Refresh in/.test(b.textContent); }, null, { timeout: 30000 }).catch(() => {});
        const after = JSON.parse(await idb(r.page, 'latest.json')).generatedAt;
        check('refresh: read the chain', r.seen.rpc.length > 0, r.seen.rpc.length);
        check('refresh: new snapshot saved on this PC', after > before, [before, after]);
        check('refresh: the page shows it without a reload', /Saved data from/.test(await r.page.innerText('#c4Age')) && (await emptyState(r.page)).hidden);
        check('refresh: no page errors', !r.seen.errors.length, r.seen.errors);
        // a second tab that still offers Refresh takes the first tab's result instead of reading the chain again
        await tabB.page.evaluate(() => localStorage.removeItem('c4.read.at'));
        await tabB.page.waitForFunction(() => { const b = document.querySelector('[data-c4-refresh]'); return b && !b.disabled; }, null, { timeout: 30000 }).catch(() => {});
        await tabB.page.click('[data-c4-refresh]').catch(e => check('second tab: could click', false, String(e.message)));
        await tabB.page.waitForFunction(() => { const b = document.querySelector('[data-c4-refresh]'); return b && /Refresh in/.test(b.textContent); }, null, { timeout: 30000 }).catch(() => {});
        check('second tab: no duplicate read of the chain', tabB.seen.rpc.length === 0, tabB.seen.rpc.length);
        await tabB.page.close();
        await ageSaved(r.page, 10);
        await r.page.close();

        // --- refresh while z.ink is down: the saved copy survives
        const d = await ctx.newPage();
        await d.route('https://testnet-rpc.z.ink/**', x => x.abort());
        await d.goto(prod, { waitUntil: 'load' });
        await rendered(d);
        const keep = await idb(d, 'latest.json');
        await d.click('[data-c4-refresh]');
        await d.waitForFunction(() => /Could not reach z\.ink/.test(document.querySelector('#c4Age').innerText), null, { timeout: READ_TIMEOUT }).catch(e => check('failed refresh: says so', false, String(e.message)));
        check('failed refresh: says it is still saved data', /still your saved data/.test(await d.innerText('#c4Age')));
        check('failed refresh: saved copy byte-identical', (await idb(d, 'latest.json')) === keep);
        const b3 = await button(d);
        check('failed refresh: cannot be hammered', b3 && b3.disabled && /Refresh in/.test(b3.text), b3);
        await ageSaved(d, 0);
        await d.close();

        // --- a damaged saved file heals on the next read instead of trapping the visitor
        const hurt = await open(ctx, prod);
        await rendered(hurt.page);
        await hurt.page.evaluate(async () => { const all = await window.C4Store.getAll(); all.set('db.json', '{"truncated'); await window.C4Store.putAll(all); });
        await ageSaved(hurt.page, 10);
        await hurt.page.close();
        const heal = await open(ctx, prod);
        await rendered(heal.page);
        const hurtAt = await savedAt(heal.page);
        await heal.page.click('[data-c4-refresh]');
        check('damaged db.json: the next refresh still succeeds', await newer(heal.page, hurtAt));
        check('damaged db.json: replaced with a good one', !!JSON.parse(await idb(heal.page, 'db.json')).state);

        // --- a wrong clock never locks the button
        await ageSaved(heal.page, -43200);
        await heal.page.close();
        const future = await open(ctx, prod);
        await rendered(future.page);
        const b4 = await button(future.page);
        check('saved data stamped in the future: Refresh stays available', b4 && !b4.disabled && b4.text === 'Refresh', b4);
        await future.page.close();
        await ctx.close();

        // --- first visit while z.ink is down
        const ctx2 = await browser.newContext({ viewport: { width: 1400, height: 850 } });
        const down = await ctx2.newPage();
        await down.route('https://testnet-rpc.z.ink/**', x => x.abort());
        await down.goto(prod, { waitUntil: 'load' });
        await down.waitForFunction(() => /Could not reach/.test(document.querySelector('#c4Empty').innerText), null, { timeout: READ_TIMEOUT }).catch(e => check('down: finished', false, String(e.message)));
        const failed = await emptyState(down);
        check('first visit, chain down: clear message with a retry', !failed.hidden && /Could not reach z\.ink/.test(failed.text) && !!(await down.$('[data-c4-retry]')), failed);
        check('first visit, chain down: no collector instructions', !/No C4 Live data|npm run|collector/i.test(failed.text), failed);
        check('first visit, chain down: nothing saved', (await idbKeys(down)).length === 0);
        await ctx2.close();

        // --- control: a local copy keeps reading the collector's folder
        const ctx3 = await browser.newContext({ viewport: { width: 1400, height: 850 } });
        const local = await open(ctx3, `http://127.0.0.1:${port}/C4Live/index.html`);
        await rendered(local.page);
        check('control, localhost: reads Data/c4-live, not the chain', local.seen.local.length > 0 && local.seen.rpc.length === 0, local.seen);
        await ctx3.close();
    } catch (e) { check('run completed', false, String(e.stack)); }
    finally { await browser.close(); server.close(); }
    console.log(`\n${pass} passed, ${fail} failed`);
    process.exit(fail ? 1 : 0);
});
