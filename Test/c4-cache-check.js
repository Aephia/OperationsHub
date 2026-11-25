// c4-cache-check.js - C4 Live: long cache life is only safe while every stamp is the file's own hash (2026-11-25).
//   node Test/c4-cache-check.js
// [1] every ?v= stamp in C4Live/index.html and C4Live/app.js equals the first 10 hex of the sha256 of the file it names
//     (recomputed here, not by Tools/c4-live/stamp.mjs), and no script or style of the page is loaded without a stamp.
// [2] _headers: the month-long rules cover only stamped C4Live scripts and styles; the page itself and every .json
//     keep the default, so new stamps and new data reach visitors at once. Syntax limits of Cloudflare Pages.
// [3] negatives: the same checkers must reject a stale stamp, an unstamped script and a rule that would freeze the page.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const PAGE = path.join(ROOT, 'C4Live');
let pass = 0, fail = 0;
function check(name, ok, detail) {
    if (ok) { pass++; console.log('  ok   ' + name); } else { fail++; console.log('  FAIL ' + name + (detail !== undefined ? '  -> ' + detail : '')); }
    return !!ok;
}
const lf = file => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const hash10 = file => crypto.createHash('sha256').update(lf(file)).digest('hex').slice(0, 10);
// the browser collector's first line names its own sources and one hash over them (C4Live/collect-src/build.mjs)
function bundleProblem(bundleText, read) {
    const m = /^\/\* c4-collect-src ([0-9a-f]{16}) ([^*]+) \*\//.exec(bundleText);
    if (!m) return 'the bundle has no source line (rebuild: node C4Live/collect-src/build.mjs)';
    const files = m[2].trim().split(' '), h = crypto.createHash('sha256');
    if (!files.includes('Tools/c4-live/collector.mjs') || !files.includes('C4Live/collect-src/main.js')) return 'the source line does not name the collector';
    for (const f of files) { let t; try { t = read(f); } catch (e) { return 'source ' + f + ' is missing'; } h.update(f + '\n' + t + '\n'); }
    return h.digest('hex').slice(0, 16) === m[1] ? null : 'c4-collect.js is older than its sources (run node C4Live/collect-src/build.mjs, then node Tools/c4-live/stamp.mjs)';
}

// ---- stamps: [{ref, stamp}] for every .js / .css named in a text; stale = those whose stamp is not the file's hash
function refsOf(text) { return [...text.matchAll(/((?:\.\.\/)?[A-Za-z0-9_\-.\/]+\.(?:js|css))(?:\?v=([0-9A-Za-z]*))?(?=['"`\s)])/g)].map(m => ({ ref: m[1], stamp: m[2] })); }
function staleStamps(text, hashOf) {
    return refsOf(text).filter(r => r.stamp !== undefined).map(r => ({ ...r, want: hashOf(r.ref) })).filter(r => r.want !== null && r.want !== r.stamp).map(r => r.ref + ' has ' + (r.stamp || '(none)') + ', file is ' + r.want);
}
const realHash = ref => { const f = path.resolve(PAGE, ref); return f.startsWith(ROOT + path.sep) && fs.existsSync(f) ? hash10(f) : null; };
// tags of the page that load a local script or style without a stamp
function unstampedTags(html) {
    return [...html.matchAll(/<(?:script[^>]*\ssrc|link[^>]*rel="stylesheet"[^>]*\shref|link[^>]*\shref)="([^"]+)"/g)].map(m => m[1])
        .filter(u => !/^https?:/.test(u) && /\.(js|css)(\?|$)/.test(u) && !/\.(js|css)\?v=[0-9a-z]{10}$/.test(u));
}
// script URLs built in app.js: each must end in a literal stamp, never in an expression (a clock stamp defeats the cache)
function dynamicLoads(js) { return [...js.matchAll(/\.src = ([^;]+);/g)].map(m => m[1].trim()).filter(e => /\.js/.test(e)); }
const badDynamic = js => dynamicLoads(js).filter(e => !/^'[A-Za-z0-9_\-.\/]+\.js\?v=[0-9a-z]{10}'$/.test(e));

// ---- _headers: rules = [{pattern, lines:[...]}]; cacheFor(path) = the Cache-Control a path ends up with (null = default)
function parseHeaders(text) {
    const rules = []; let cur = null;
    for (const raw of text.split(/\r?\n/)) {
        if (!raw.trim() || raw.trim().startsWith('#')) continue;
        if (!/^\s/.test(raw)) { cur = { pattern: raw.trim(), lines: [] }; rules.push(cur); } else if (cur) cur.lines.push(raw.trim());
    }
    return rules;
}
function matches(pattern, p) {
    const re = new RegExp('^' + pattern.split('*').map(s => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
    return re.test(p);
}
function cacheFor(rules, p) {
    let v = null;
    for (const r of rules) if (matches(r.pattern, p)) for (const l of r.lines) { if (/^!\s*cache-control$/i.test(l)) v = null; else { const m = /^cache-control:\s*(.*)$/i.exec(l); if (m) v = v ? v + ', ' + m[1] : m[1]; } }
    return v;
}
const maxAge = v => { const m = v && /max-age=(\d+)/.exec(v); return m ? +m[1] : 0; };
// what must never be kept: the page, every json the page reads, and files of other pages that are not stamped by hash
const MUST_STAY_FRESH = ['/C4Live/', '/C4Live/index.html', '/index.html', '/C4Live/prices.json', '/C4Live/dacs.json', '/Images/ships/manifest.json',
    '/Images/ships/silhouettes/atlas.json', '/Images/stake/manifest.json', '/Images/stake/ground/manifest.json', '/ShipExplorer/app.js', '/Data/ships-data.js', '/styles.css', '/SFX/ui-sfx.js'];
function headerProblems(text, loaded) {
    const rules = parseHeaders(text), out = [];
    if (rules.length > 100) out.push('more than 100 rules');
    text.split(/\r?\n/).forEach((l, i) => { if (l.length > 2000) out.push('line ' + (i + 1) + ' is over 2,000 characters'); });
    for (const r of rules) {
        if ((r.pattern.match(/\*/g) || []).length > 1) out.push(r.pattern + ': more than one splat');
        if (!r.pattern.startsWith('/')) out.push(r.pattern + ': a pattern starts with /');
        const cc = r.lines.findIndex(l => /^cache-control:/i.test(l)), det = r.lines.findIndex(l => /^!\s*cache-control$/i.test(l));
        if (cc >= 0 && (det < 0 || det > cc)) out.push(r.pattern + ': sets Cache-Control without first removing the default (the two would be joined)');
    }
    for (const p of MUST_STAY_FRESH) if (maxAge(cacheFor(rules, p)) > 0) out.push(p + ' would be kept for ' + maxAge(cacheFor(rules, p)) + ' s');
    for (const p of loaded) if (maxAge(cacheFor(rules, p)) < 86400 * 7) out.push(p + ' is stamped by hash but gets no long cache life');
    const v = cacheFor(rules, '/C4Live/app.js'); if (v && /,.*max-age.*max-age/.test(v)) out.push('/C4Live/app.js ends up with two max-age values: ' + v);
    return out;
}

const html = fs.readFileSync(path.join(PAGE, 'index.html'), 'utf8'), app = fs.readFileSync(path.join(PAGE, 'app.js'), 'utf8');
const headers = fs.existsSync(path.join(ROOT, '_headers')) ? fs.readFileSync(path.join(ROOT, '_headers'), 'utf8') : '';
// the C4Live scripts and styles the page really loads (from index.html and app.js), as site paths
const loaded = [...new Set([...refsOf(html), ...refsOf(app)].filter(r => r.stamp !== undefined && !r.ref.startsWith('../') && fs.existsSync(path.join(PAGE, r.ref))).map(r => '/C4Live/' + r.ref))];

console.log('[1] stamps are the files\' own hashes');
check('positive control: the page loads its scripts and styles with stamps (' + loaded.length + ' C4Live files)', loaded.includes('/C4Live/app.js') && loaded.includes('/C4Live/c4-scene.js') && loaded.includes('/C4Live/c4-collect.js') && loaded.includes('/C4Live/c4.css') && loaded.length >= 10, loaded.join(' '));
const st = [...staleStamps(html, realHash), ...staleStamps(app, realHash)];
check('every stamp in index.html and app.js equals the hash of the file it names (else: node Tools/c4-live/stamp.mjs)', st.length === 0, st.join('; '));
check('index.html loads no local script or style without a 10-character stamp', unstampedTags(html).length === 0, unstampedTags(html).join(', '));
check('app.js builds every script URL with a literal stamp (2 loads: the map and the collector)', dynamicLoads(app).length === 2 && badDynamic(app).length === 0, dynamicLoads(app).join(' | '));

const bundle = fs.readFileSync(path.join(PAGE, 'c4-collect.js'), 'utf8'), readSrc = f => lf(path.join(ROOT, f));
check('the browser collector was built from the sources as they are now', bundleProblem(bundle, readSrc) === null, bundleProblem(bundle, readSrc));
check('negative: a changed source is reported as a stale bundle', /older than its sources/.test(bundleProblem(bundle, f => readSrc(f) + (f === 'Tools/c4-live/collector.mjs' ? '\n// x' : '')) || '') && /no source line/.test(bundleProblem('/* other */', readSrc)));

// the price file the site ships must carry the origination prices (a build from an old local price book drops them)
{
    let book = null; try { book = JSON.parse(fs.readFileSync(path.join(PAGE, 'prices.json'), 'utf8')); } catch (e) { /* reported below */ }
    const mp = book && book.msrp && typeof book.msrp === 'object' ? book.msrp : {};
    const tiers = [1, 2, 3, 4, 5].filter(t => typeof mp['Claim Stake Tier ' + t] === 'number' && mp['Claim Stake Tier ' + t] > 0).length;
    const rate = book && book.atlasUsd, resBids = book && Array.isArray(book.items) ? book.items.filter(i => i && i.itemType === 'resource' && i.atlas && (i.atlas.bestBid > 0 || i.atlas.bestAsk > 0)).length : 0;
    check('C4Live/prices.json carries the ATLAS price in dollars and resource prices (the profitability table needs both)', !!rate && typeof rate.usd === 'number' && rate.usd > 0 && rate.usd < 10 && resBids >= 20, JSON.stringify(rate) + ', ' + resBids + ' resources');
    check('C4Live/prices.json carries origination prices: all five claim stake tiers and at least 50 items', tiers === 5 && Object.keys(mp).length >= 50, tiers + ' tiers, ' + Object.keys(mp).length + ' items (run a collector pass, then node C4Live/collect-src/build.mjs)');
}

console.log('[2] _headers');
check('the file exists at the site root and has rules', parseHeaders(headers).length >= 2);
const hp = headerProblems(headers, loaded);
check('long cache life only for stamped C4Live scripts and styles; the page and every .json stay fresh; Cloudflare syntax limits kept', hp.length === 0, hp.join('; '));
const rules = parseHeaders(headers);
check('a stamped script is kept for a month, a ship picture for a week, the page not at all', maxAge(cacheFor(rules, '/C4Live/c4-scene.js')) === 2592000 && maxAge(cacheFor(rules, '/Images/ships/silhouettes/atlas.webp')) === 604800 && cacheFor(rules, '/C4Live/index.html') === null,
    [cacheFor(rules, '/C4Live/c4-scene.js'), cacheFor(rules, '/Images/ships/silhouettes/atlas.webp'), cacheFor(rules, '/C4Live/index.html')].join(' | '));

console.log('[3] negatives: the checkers reject what they must');
check('a stale stamp is reported', staleStamps('<script src="app.js?v=0000000000"></script>', realHash).length === 1);
check('a correct stamp is not reported (the checker does not reject everything)', staleStamps('<script src="app.js?v=' + hash10(path.join(PAGE, 'app.js')) + '"></script>', realHash).length === 0);
check('a script tag without a stamp, or with a date stamp, is reported', unstampedTags('<script src="app.js"></script><script src="x.js?v=20261125a"></script><link rel="stylesheet" href="c4.css">').length === 3);
check('a script URL stamped by the clock is reported', badDynamic("s.src = 'c4-scene.js?v=' + Date.now().toString(36);").length === 1 && badDynamic("s.src = 'c4-scene.js?v=a49033cec7';").length === 0);
check('a rule that would keep the page or its data is reported', headerProblems('/C4Live/*\n  ! Cache-Control\n  Cache-Control: public, max-age=600\n', []).some(x => /index\.html would be kept/.test(x)) && headerProblems('/*.json\n  ! Cache-Control\n  Cache-Control: max-age=60\n', []).some(x => /prices\.json would be kept/.test(x)));
check('a rule that joins with the default instead of replacing it is reported', headerProblems('/C4Live/*.js\n  Cache-Control: public, max-age=2592000\n', []).some(x => /without first removing/.test(x)));
check('two splats in one pattern are reported', headerProblems('/C4Live/*/*.js\n  ! Cache-Control\n  Cache-Control: max-age=1\n', []).some(x => /more than one splat/.test(x)));
check('a stamped file left without a long cache life is reported', headerProblems('', ['/C4Live/app.js']).length === 1);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
