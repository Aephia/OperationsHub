#!/usr/bin/env node
// chain-graph-check.js - real-browser check of Utils/ChainGraph.js node clicks (2026-11-20).
// The graph host holds pointer capture (setPointerCapture on pointerdown), so in Chromium pointerup's target is the host
// and a node can only be found by position (document.elementFromPoint). Before this fix that lookup was opt-in
// (hitTest: true) and the Resources Explorer graph did not opt in: clicking a node did nothing.
//   node Test/chain-graph-check.js          serves the repo on a free local port, drives headless Chromium (playwright
//                                           is found through the teardown skill's node_modules); exit 0 = all PASS
//   node Test/chain-graph-check.js --neg    the same run with the OLD default path compiled back in (server-side
//                                           rewrite of ChainGraph.js; nothing on disk changes): the first check must FAIL
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
const NEG = process.argv.includes('--neg');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
let chromium;
try { chromium = require('module').createRequire(path.join(os.homedir(), '.claude/skills/teardown/node_modules/x.js'))('playwright').chromium; }
catch (e) { console.log('SKIP  playwright not found (teardown skill node_modules): ' + e.message); process.exit(0); }

let pass = 0, fail = 0;
const check = (label, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: ${JSON.stringify(got)}${ok ? '' : '  (expected ' + JSON.stringify(want) + ')'}`); };

const OLD = "const tg = this.opts.hitTest ? (document.elementFromPoint(e.clientX, e.clientY) || e.target) : e.target;";
const CUR = "const tg = (document.elementFromPoint(e.clientX, e.clientY) || e.target);";
(async () => {
    const src = fs.readFileSync(path.join(ROOT, 'Utils/ChainGraph.js'), 'utf8');
    // positive control for the mutation itself: the current line must be present, or the --neg run proves nothing
    if (!src.includes(CUR)) { console.log('FAIL  Utils/ChainGraph.js no longer holds the lookup line this check rewrites for --neg'); process.exit(1); }
    const server = http.createServer((q, r) => {
        const u = decodeURIComponent(q.url.split('?')[0]);
        const p = path.join(ROOT, u);
        if (!p.startsWith(ROOT)) { r.writeHead(403); r.end(); return; }
        fs.readFile(p, (e, b) => {
            if (e) { r.writeHead(404); r.end(); return; }
            if (NEG && u === '/Utils/ChainGraph.js') b = Buffer.from(b.toString('utf8').replace(CUR, OLD));
            r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); r.end(b);
        });
    });
    await new Promise(ok => server.listen(0, '127.0.0.1', ok));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ headless: true });
    const errs = [];
    try {
        const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
        page.on('pageerror', e => errs.push(e.message));
        const center = async sel => { const el = page.locator(sel).first(); await el.waitFor({ timeout: 8000 }); const b = await el.boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };

        // ---- Resources Explorer: ?r=Steel opens the sheet and its chain graph; a node is clicked
        await page.goto(`${base}/ResourcesExplorer/index.html?r=Steel`, { waitUntil: 'load' });
        const head = async () => (await page.locator('.rx-modal .rx-title').first().innerText()).replace(/\s+/g, ' ').trim();
        await page.locator('#rxGraph .nd').first().waitFor({ timeout: 8000 });
        const h0 = await head();
        const names = await page.locator('#rxGraph .nd').evaluateAll(a => a.map(n => n.dataset.name));
        check('RX ?r=Steel: the sheet is open and its graph holds the node "Carbon" (positive control)', [/Steel/.test(h0), names.includes('Carbon')], [true, true]);

        // a drag that starts on a node must pan and must not navigate
        const nd = '#rxGraph .nd[data-name="Carbon"]';
        let c = await center(nd);
        await page.mouse.move(c.x, c.y); await page.mouse.down(); await page.mouse.move(c.x + 30, c.y + 20, { steps: 6 }); await page.mouse.move(c.x + 60, c.y + 40, { steps: 6 }); await page.mouse.up();
        const hDrag = await head();
        check('RX a drag starting on a node pans: the heading is unchanged', /Steel/.test(hDrag) && !/Carbon/.test(hDrag), true);

        // a click (no movement) opens the node
        c = await center(nd);
        await page.mouse.click(c.x, c.y);
        await page.waitForTimeout(400);
        const h1 = await head();
        check('RX a click on the node "Carbon" opens it: the heading becomes Carbon', [/Carbon/.test(h1), /Steel/.test(h1)], [true, false]);

        // ---- Recipe Explorer: a plan graph node still opens its sheet
        await page.goto(`${base}/RecipeExplorer/index.html?recipe=${encodeURIComponent('Power Regulation Module')}`, { waitUntil: 'load' });
        const have = await page.locator('#rpGraph .nd').first().waitFor({ timeout: 8000 }).then(() => true, () => false);
        await page.waitForTimeout(1500);   // the page redraws and fits the graph after load; click a settled one
        check('RE the plan graph is drawn for the added recipe (positive control)', have, true);
        if (have) {
            const rnames = await page.locator('#rpGraph .nd').evaluateAll(a => a.map(n => n.dataset.name));
            const target = rnames.find(n => n !== 'Power Regulation Module') || rnames[0];
            const vis = () => page.evaluate(() => !!document.querySelector('.rx-modal #rpSheetGraph'));   // the item sheet's own graph
            const before = await vis();
            const cc = await center(`#rpGraph .nd[data-name="${target}"]`);
            await page.mouse.click(cc.x, cc.y);
            await page.waitForTimeout(1500);
            const opened = await vis();
            const popup = (await page.context().pages()).length > 1;   // a raw with no recipe opens its Resources page instead
            check('RE a click on a graph node ("' + target + '") opens its sheet (it was closed before)', [before, opened || popup], [false, true]);
        }
        check('no page errors', errs, []);
    } catch (e) { fail++; console.log('FAIL  THREW ' + e.message); }
    await browser.close(); server.close();
    console.log(`\n${pass} PASS, ${fail} FAIL${NEG ? ' (--neg run: the click check is expected to FAIL)' : ''}`);
    process.exit(fail ? 1 : 0);
})();
