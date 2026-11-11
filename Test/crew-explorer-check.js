// crew-explorer-check.js - checks the Crew Explorer computations (CrewExplorer/crew-model.js) and its feed reader
// (CrewExplorer/crew-fetch.js, against a scripted fake feed - this file makes no network call).
// Run from the repo root:  node Test/crew-explorer-check.js        Exit 0 = all pass, 1 = a check failed.
//
// Every rule is also run against deliberately broken copies of the real source (a "mutant": one line of the shipped
// file changed in memory). A rule that does not FAIL on its mutant is itself reported as a failure, so a check that
// cannot see breakage never passes silently. A mutant whose target line is no longer in the source is a failure too.
// Expected values come from brute-force loops written here, and the address vectors from a separate Python
// implementation (sha256 + curve test), not from the code under test.

'use strict';
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '..', 'CrewExplorer');
const MODEL_SRC = fs.readFileSync(path.join(DIR, 'crew-model.js'), 'utf8');
const FETCH_SRC = fs.readFileSync(path.join(DIR, 'crew-fetch.js'), 'utf8');

function loadSrc(src, req) { const mod = { exports: {} }; new Function('module', 'exports', 'require', src)(mod, mod.exports, req || require); return mod.exports; }
const M0 = loadSrc(MODEL_SRC);
const loadFetch = (src, model) => loadSrc(src, id => (id === './crew-model.js' ? model : require(id)));
const F0 = loadFetch(FETCH_SRC, M0);

let pass = 0, fail = 0;
const failures = [];
function report(ok, name, detail) { if (ok) pass++; else { fail++; failures.push(name + (detail ? ' :: ' + detail : '')); } console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok || !detail ? '' : ' :: ' + detail)); }
// rule(name, run, mutants): run(M, F) returns a list of problems (empty = holds). mutants: [{ file, name, find, put, via }]
// A mutant counts as caught only when the rule REPORTS a problem. A rule that throws or never returns on the mutant
// proves nothing by itself, so that is a failure - unless the mutant says that is exactly the breakage it makes
// (via: 'hang' for "the load never ends", via: 'throw').
const HANG_MS = 3000;
const HUNG = Symbol('hung');
function settle(promise) {
    let t;
    return Promise.race([promise.then(p => ({ p }), e => ({ threw: e })), new Promise(r => { t = setTimeout(() => r({ hung: HUNG }), HANG_MS); })]).finally(() => clearTimeout(t));
}
async function rule(name, run, mutants) {
    const real = await settle(Promise.resolve().then(() => run(M0, F0)));
    const problems = real.hung ? ['never returned'] : real.threw ? ['threw ' + (real.threw && real.threw.stack || real.threw)] : real.p;
    report(!problems.length, name, problems.slice(0, 3).join(' | '));
    for (const mu of mutants || []) {
        const src = mu.file === 'fetch' ? FETCH_SRC : MODEL_SRC;
        const hits = src.split(mu.find).length - 1;
        if (hits !== 1) { report(false, name + ' [mutant ' + mu.name + ']', 'target line found ' + hits + ' times, expected exactly 1'); continue; }
        let out;
        try {
            const Mm = mu.file === 'fetch' ? M0 : loadSrc(src.replace(mu.find, mu.put));
            const Fm = mu.file === 'fetch' ? loadFetch(src.replace(mu.find, mu.put), M0) : loadFetch(FETCH_SRC, Mm);
            out = await settle(Promise.resolve().then(() => run(Mm, Fm)));
        } catch (e) { out = { threw: e }; }
        const how = out.hung ? 'hang' : out.threw ? 'throw' : 'report';
        const caught = how === (mu.via || 'report') && (how !== 'report' || out.p.length > 0);
        report(caught, name + ' [mutant ' + mu.name + ' must fail]', caught ? '' : how === 'report' ? 'the rule still passed with the code broken' : 'the rule did not report a problem, it ended by ' + how + (out.threw ? ': ' + String(out.threw.message).slice(0, 80) : ''));
    }
}
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const near = (a, b) => Math.abs(a - b) < 1e-9;
// same content whatever order the keys were written in
const canon = v => JSON.stringify(v, (k, x) => (x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.keys(x).sort().map(key => [key, x[key]])) : x));
const same = (a, b) => canon(a) === canon(b);

// ------------------------------------------------------------------ made-up feed rows (seeded, so every run is the same)
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const R = rng(20261110);
const pick = a => a[Math.floor(R() * a.length)];
const APT = ['Command', 'Flight', 'Engineering', 'Medical', 'Science', 'Operator', 'Hospitality', 'Fitness'];
const RAR = ['Common', 'Common', 'Common', 'Common', 'Uncommon', 'Rare', 'Rare', 'Epic', 'Legendary', 'Anomaly'];
function row(id) {
    const rarity = pick(RAR);
    const n = rarity === 'Common' ? 1 : rarity === 'Uncommon' ? 2 : 3;
    const apts = {};
    const pool = APT.slice().sort(() => R() - 0.5);
    for (let i = 0; i < n; i++) apts[pool[i]] = rarity === 'Anomaly' && i === 0 ? pick(['anomalous', 'anomaly']) : pick(['minor', 'major']);
    const tr = () => Math.round(R() * 100) / 100;
    return { _id: 'x' + id, mintOffset: id, dasID: '5dbVXrhGSAz3Lw4ywXnVCJcf5ckAdekhZapNmmze5Zvq', faction: pick(['MUD', 'ONI', 'Ustur', 'Unaligned']), species: pick(['Human', 'Ustur', 'Sogmian', 'Mierese', 'Tufa']), sex: pick(['Male', 'Female', 'Body 1', 'Body 2']),
        name: 'Crew ' + pick(['Ana', 'bo', 'Cy', 'dee']) + ' ' + id, university: pick(['MUD Academy', 'ONI Institute', 'Ustur Central University']), age: 18 + Math.round(R() * 600) / 10,
        openness: tr(), conscientiousness: tr(), extraversion: tr(), agreeableness: tr(), neuroticism: tr(), rarity, aptitudes: apts, imageUrl: 'https://evil.example/' + id + '.jpg' };
}
const ROWS = [];
for (let i = 0; i < 600; i++) ROWS.push(row(1000 + i * 7));
ROWS[3].openness = 1; ROWS[4].openness = 0; ROWS[5].age = 115; ROWS[6].neuroticism = null; ROWS[7].name = '<img src=x onerror=alert(1)>';
// an unknown aptitude name, an unknown rate, and two rates that are property names every plain object answers to
ROWS[8].aptitudes = { Flight: 'major', Piloting: 'minor', Science: 'legendary', Medical: 'constructor', Command: '__proto__', Fitness: 'toString' };
ROWS[9].aptitudes = { constructor: 'minor' };   // an aptitude NAME that is one of those property names
// rates that are not text: an object whose toString is not callable (String() of it throws), arrays, numbers
ROWS[10].aptitudes = { Flight: { toString: 1 }, Science: ['major'], Medical: [['anomaly']], Fitness: 7, Command: true, Operator: null, Engineering: 'MAJOR' };
const BAD_ROWS = [null, {}, { mintOffset: '12' }, { mintOffset: 1.5 }, { mintOffset: -1 }, 'x'];
// a rate is text, read without regard to case; anything else is not a rate
const gainOf = g => (typeof g !== 'string' ? '' : g.toLowerCase() === 'anomaly' ? 'anomalous' : g.toLowerCase());
const XP = { minor: 0.25, major: 0.5, anomalous: 1 };
// the test's own reading of a row, independent of normalize()
const aptsOf = r => Object.entries(r.aptitudes).map(([k, g]) => [k, gainOf(g)]).filter(([, g]) => g === 'minor' || g === 'major' || g === 'anomalous');
const valOf = (r, dim) => (dim === 'aptitude' ? aptsOf(r).map(a => a[0]) : dim === 'aptCount' ? [String(aptsOf(r).length)] : [r[dim]]);

// ------------------------------------------------------------------ address vectors (from pda_vectors.py, 2026-11-10)
const PDA = [
    ['5dbVXrhGSAz3Lw4ywXnVCJcf5ckAdekhZapNmmze5Zvq', 'AQxZM4cnKif2oujQt6edrK8iSK22Q2PB4zPQApovZm19', 255],
    ['HACAJ9f3v76HnnWfQKGPjrSHVS4X1JinP28Jr5CA3m7x', 'CLDJZZS8vvMaoYKLmCkfn5qMqNfPJhGU157oQa8vZxDe', 255],
    ['DnBmdcv1WxMDY2RCxiDfGbrjFpdNd9wonyTs9nGmXfLx', 'HWr4UE9u5k8By39DyaiGqxAQw3iAfLzADjWgK729jCGd', 254],
    ['F5ce8DDsJvbEmqVmcsdbb3RbmL7grgkxMRhJ76NHHGhX', '8BZBJBmPxn1F2Tj7bgY8FKqBWDFvktnV5fKPhAemffkp', 255],
    ['4gqvZTSSCbEiwXHRr7gskKdhHendgHdKd6f7tvVFqvFr', '7s68LkNDXEvarRAbpV7zSzrbLQpR6qBzkWmAU1xG8GBt', 254],
    ['8UeSjNoexBDeciafYuay3hEqGdCF4z2dgXndKQeYrn8H', '7oH1SWmCZvF1iw4vG2fmSfq7wDRye1zDypzGWyqmQ29F', 254],
    ['Gu7G6ouowM4fs1fUg1Wh3Nged3XsfLWzqHSdoDXcPdyG', '9xNPAAeUbyCDcgvdxn28KNYgYx622ZsDZaFRZTNAhTuZ', 254],
    ['EGCzVd3xCdPBi8fjRfLPUWbAVr4gmV1cvap9a8RqP1xh', 'G458jzm3jUcs7GHDEb6HxRSHbbzczJAYPmGs5c6ysX8J', 254]
];
const CURVE = [['e35387039eabad1e667a5a3a4588ba76c185557129a07769034fdf1fe4ded510', true], ['bf7e66f428893c2a66fe80faba05b7811e97cbba9a9377540db45dc7344cd18e', true], ['db3b4b37e2301def6a10cc66d0f09a739fcea0691a30fc5ff06beacbe1857676', true], ['141560462eb67898b5d52e82b4d878054321acf21871e33ec6da3e10da442aa8', false], ['10f0c17e0a5a34a300d449a3d485048e66ed6ad7c3f939cb9cad9b0c576b7518', false], ['0eb96ee1622dda69e3b83df73c2d6449dc14bcba57672c6be3a8eb054f500be9', false], ['0cbfb9545eb73983efa1fc07fe112a853ecd7e0007647b8290edfceb2b129683', false], ['04b184018272b9fcae78e4491324316527f00fa5d66ac6518d2f11d0a0053829', true], ['97ee77628ec24f4b4a8415195d488c36d3545647693dc1f98273ee518cd2127f', true], ['36447bebe0bb9d072a0dd88a290048df5e97be33056abe7a0ada36aa107add34', false], ['5a981fa80a30ebd0587b9cdaeb4e05ec09b2f1576634fb4b3afe5f5cb7612c2f', true], ['c533ac6e97c000d85d819e4979c7f645fdee21b02b0c9931d186df5259c6f592', true]];
const LEADING_ZERO = '11Jtt6dt1gSqgMWjq6TrYLLRcQr7E9TmxeiFAp5vFHP';   // 2 zero bytes + 30 bytes
const hex = h => Uint8Array.from(h.match(/../g).map(x => parseInt(x, 16)));

// ------------------------------------------------------------------ a scripted fake feed
// script(url, call) -> { status, body } | throws. The clock moves 300 ms a call and by every sleep.
function fakeNet(script) {
    const net = { t: 1e6, calls: [], slept: [] };
    net.now = () => net.t;
    net.sleep = async ms => { net.slept.push(ms); net.t += ms; };
    net.fetch = async (url, opt) => {
        net.calls.push({ url, opt }); net.t += 300;
        const r = await script(url, net.calls.length, opt);
        return { status: r.status || 200, ok: (r.status || 200) >= 200 && (r.status || 200) < 300, json: async () => { if (r.notJson) throw new SyntaxError('Unexpected token <'); return r.body; } };
    };
    return net;
}
const pageOf = url => Number(new URL(url).searchParams.get('page'));
const ownerOf = url => decodeURIComponent(new URL(url).pathname.split('/').pop());
const slice = (rows, page) => ({ body: { total: rows.slice((page - 1) * 100, page * 100).length, crew: rows.slice((page - 1) * 100, page * 100) } });
const ctlFor = (F, net, room) => ({ deadline: net.now() + F.LIMIT_MS, room: room == null ? F.MAX_CARDS : room });

(async () => {
    // ================================================================ model
    await rule('addresses: base58, curve test and the SAGE profile account match the Python vectors', async M => {
        const p = [];
        for (const [h, on] of CURVE) if (M.isOnCurve(hex(h)) !== on) p.push('curve ' + h.slice(0, 8));
        for (const [profile, address] of PDA) { let got; try { got = await M.sagePlayerProfileAddress(profile); } catch (e) { got = 'threw: ' + e.message; } if (got !== address) p.push(profile.slice(0, 6) + ' -> ' + got); }
        const lz = M.b58decode(LEADING_ZERO);
        if (!lz || lz.length !== 32 || lz[0] !== 0 || lz[1] !== 0 || lz[2] === 0) p.push('leading zeros lost');
        if (M.b58encode(lz) !== LEADING_ZERO) p.push('round trip');
        if (!M.isAddress(PDA[0][0]) || !M.isAddress(' ' + PDA[0][0] + ' ')) p.push('a real address was refused');
        for (const bad of ['', 'abc', PDA[0][0] + '1', PDA[0][0].slice(4), PDA[0][0].replace(/.$/, '0'), PDA[0][0].replace(/.$/, 'l'), null, 42, 'x'.repeat(200)]) if (M.isAddress(bad)) p.push('accepted ' + JSON.stringify(bad));
        return p;
    }, [
        { name: 'seed text', find: "enc('sage_player_profile')", put: "enc('sage_player_profil')" },
        { name: 'no curve test', find: 'if (!isOnCurve(h)) return', put: 'if (true) return' },
        { name: 'curve constant', find: 'const ED_D = (P - 121665n', put: 'const ED_D = (P - 121666n' },
        { name: 'leading zeros', find: "for (let i = 0; i < s.length && s[i] === '1'; i++) bytes.push(0);", put: '' }
    ]);

    await rule('normalize: bad rows dropped, anomaly spelling folded, unknown rates dropped, portrait never from the feed', async M => {
        const p = [];
        for (const b of BAD_ROWS) if (M.normalize(b) !== null) p.push('kept ' + JSON.stringify(b));
        for (const r of ROWS) {
            let c; try { c = M.normalize(r); } catch (e) { p.push('normalize threw on card ' + r.mintOffset + ': ' + e.message); continue; }
            if (!c || c.id !== r.mintOffset) { p.push('lost ' + r.mintOffset); continue; }
            const want = aptsOf(r).sort((a, b) => (APT.indexOf(a[0]) < 0 ? 99 : APT.indexOf(a[0])) - (APT.indexOf(b[0]) < 0 ? 99 : APT.indexOf(b[0])));
            if (!eq(c.apts.map(a => [a.k, a.g]), want)) p.push('apts ' + r.mintOffset + ' ' + JSON.stringify(c.apts));
            if (JSON.stringify(c).includes('evil.example')) p.push('feed image address kept');
            if (!M.portraitUrl(c.id).startsWith('https://cdn.staratlas.com/crew/v1/' + c.id + '_')) p.push('portrait');
        }
        const c8 = M.normalize(ROWS[8]);
        if (!eq(c8.apts.map(a => a.k), ['Flight', 'Piloting'])) p.push('unknown aptitude/rate handling: ' + JSON.stringify(c8.apts));
        const c9 = M.normalize(ROWS[9]);
        if (!eq(c9.apts, [{ k: 'constructor', g: 'minor' }])) p.push('an aptitude called constructor: ' + JSON.stringify(c9.apts));
        let c10; try { c10 = M.normalize(ROWS[10]); } catch (e) { p.push('normalize threw on a non-text rate: ' + e.message); }
        if (c10 && !eq(c10.apts, [{ k: 'Engineering', g: 'major' }])) p.push('non-text rates: ' + JSON.stringify(c10.apts));
        if (!Array.isArray(M.perksOf('constructor')) || M.perksOf('constructor').length || M.perksOf('__proto__').length || M.perksOf('Flight').length !== 4) p.push('perksOf answers for a property name');
        for (const c of ROWS.map(r => { try { return M.normalize(r); } catch (e) { return null; } }).filter(Boolean)) for (const a of c.apts) if (typeof M.GAIN_LABEL[a.g] !== 'string' || typeof M.GAIN_XP[a.g] !== 'number') { p.push('card ' + c.id + ' kept the rate ' + String(a.g)); break; }
        if (M.normalize(ROWS[6]).neuroticism !== null) p.push('missing trait not null');
        if (M.esc(ROWS[7].name).includes('<')) p.push('esc');
        return p;
    }, [
        { name: 'anomaly spelling', find: "return s === 'anomaly' ? 'anomalous' : s;", put: 'return s;' },
        { name: 'keeps unknown rates', find: 'if (!isGain(g)) continue;', put: '' },
        { name: 'anything is turned into text and read as a rate', find: "if (typeof g !== 'string') return ''; const s = g.toLowerCase();", put: "const s = String(g || '').toLowerCase();" },
        { name: 'property names pass as rates', find: 'const isGain = g => GAINS.includes(g);', put: 'const isGain = g => GAIN_XP[g] !== undefined;' },
        { name: 'property names pass as aptitudes with perks', find: 'return APTITUDES.includes(aptitude) ? PERKS[aptitude] : [];', put: 'return PERKS[aptitude] || [];' },
        { name: 'accepts text card numbers', find: 'if (!validId(id)) return null;', put: 'if (id == null) return null;' }
    ]);

    const cardsOf = M => ROWS.map(M.normalize);

    await rule('mergeCards: each card number once, first list wins', async M => {
        const c = cardsOf(M), a = c.slice(0, 300), b = c.slice(250).map(x => Object.assign({}, x, { name: 'second' }));
        const m = M.mergeCards([a, b]);
        const p = [];
        if (m.length !== 600) p.push('length ' + m.length);
        if (new Set(m.map(x => x.id)).size !== m.length) p.push('duplicates');
        if (m.find(x => x.id === c[260].id).name === 'second') p.push('second list won');
        return p;
    }, [{ name: 'no dedupe', find: 'if (c && !seen.has(c.id)) seen.set(c.id, c);', put: 'if (c) seen.set(c.id + Math.random(), c);' }]);

    await rule('countBy: every dimension equals a brute-force count', async M => {
        const c = cardsOf(M), p = [];
        for (const dim of M.DIMS) {
            const want = new Map();
            for (const r of ROWS) for (const v of valOf(r, dim)) want.set(v, (want.get(v) || 0) + 1);
            const got = M.countBy(c, dim);
            if (got.length !== want.size) p.push(dim + ' keys ' + got.length + ' vs ' + want.size);
            for (const g of got) if (want.get(g.key) !== g.n) p.push(dim + ' ' + g.key + ' ' + g.n + ' vs ' + want.get(g.key));
        }
        const rar = M.countBy(c, 'rarity').map(x => x.key);
        if (!eq(rar, ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Anomaly'])) p.push('rarity order ' + rar);
        return p;
    }, [{ name: 'double count', find: 'for (const c of cards) for (const v of dimValues(c, dim)) m.set(v, (m.get(v) || 0) + 1);', put: 'for (const c of cards) for (const v of dimValues(c, dim)) m.set(v, (m.get(v) || 0) + 2);' }]);

    await rule('crosstab: cells, totals and the largest cell equal brute force', async M => {
        const c = cardsOf(M), p = [];
        for (const [rd, cd] of [['rarity', 'species'], ['faction', 'aptitude'], ['aptitude', 'aptitude'], ['aptCount', 'rarity'], ['university', 'sex']]) {
            const t = M.crosstab(c, rd, cd);
            let max = 0, sum = 0;
            t.rows.forEach((r, i) => t.cols.forEach((k, j) => {
                const want = ROWS.filter(x => valOf(x, rd).includes(r) && valOf(x, cd).includes(k)).length;
                if (t.cells[i][j] !== want) p.push(rd + '/' + cd + ' ' + r + ',' + k + ' ' + t.cells[i][j] + ' vs ' + want);
                if (want > max) max = want; sum += want;
            }));
            if (t.max !== max) p.push(rd + '/' + cd + ' max ' + t.max + ' vs ' + max);
            if (rd !== 'aptitude' && cd !== 'aptitude' && sum !== ROWS.length) p.push(rd + '/' + cd + ' cells add to ' + sum);
            t.rows.forEach((r, i) => { if (t.rowTot[i] !== ROWS.filter(x => valOf(x, rd).includes(r)).length) p.push('row total ' + r); });
        }
        return p;
    }, [
        { name: 'max never updated', find: 'if (n > max) max = n; return n;', put: 'return n;' },
        { name: 'first column only', find: 'for (const r of rs) for (const k of cs) { const key', put: 'for (const r of rs) for (const k of cs.slice(0, 1)) { const key' }
    ]);

    await rule('aptitudeMatrix: counts per rate and summed XP gain equal brute force', async M => {
        const c = cardsOf(M), p = [];
        const mx = M.aptitudeMatrix(c);
        if (!eq(mx.slice(0, 8).map(r => r.key), APT)) p.push('order');
        for (const r of mx) {
            const all = ROWS.flatMap(aptsOf).filter(a => a[0] === r.key);
            for (const g of ['minor', 'major', 'anomalous']) if (r[g] !== all.filter(a => a[1] === g).length) p.push(r.key + ' ' + g);
            if (r.any !== all.length) p.push(r.key + ' any');
            if (!near(r.xp, all.reduce((s, a) => s + XP[a[1]], 0))) p.push(r.key + ' xp ' + r.xp);
        }
        if (!mx.some(r => r.key === 'Piloting')) p.push('unknown aptitude dropped from the table');
        if (!mx.some(r => r.anomalous > 0)) p.push('fixture has no anomaly-rate crew: the check is blind');
        return p;
    }, [{ name: 'major worth a minor', find: 'const GAIN_XP = { minor: 0.25, major: 0.5, anomalous: 1 };', put: 'const GAIN_XP = { minor: 0.25, major: 0.25, anomalous: 1 };' }]);

    await rule('distributions: bins add up, the top edge lands in the last bin, mean and median equal brute force', async M => {
        const c = cardsOf(M), p = [];
        for (const d of M.traitStats(c)) {
            const vals = ROWS.map(r => r[d.field]).filter(v => typeof v === 'number').sort((a, b) => a - b);
            if (d.n !== vals.length || d.counts.length !== 10 || d.counts.reduce((s, x) => s + x, 0) !== vals.length) p.push(d.field + ' bins ' + d.counts);
            if (!near(d.mean, vals.reduce((s, x) => s + x, 0) / vals.length)) p.push(d.field + ' mean');
            const med = vals.length % 2 ? vals[(vals.length - 1) / 2] : (vals[vals.length / 2 - 1] + vals[vals.length / 2]) / 2;
            if (!near(d.median, med)) p.push(d.field + ' median');
            if (d.counts[9] !== vals.filter(v => v >= 0.9).length) p.push(d.field + ' last bin');
            if (d.peak !== Math.max(...d.counts)) p.push(d.field + ' peak');
        }
        const small = M.distribution([0.1, 0.9, 0.4, 0.2].map(v => ({ openness: v })), 'openness', 0, 1, 10);
        if (!near(small.median, 0.3) || !near(small.mean, 0.4) || !eq(small.counts, [0, 1, 1, 0, 1, 0, 0, 0, 0, 1])) p.push('four-value case: median ' + small.median + ' bins ' + small.counts);
        const open = M.traitStats(c)[0];
        if (open.max !== 1 || open.min !== 0) p.push('openness range');
        const age = M.ageStats(c);
        if (age.counts.reduce((s, x) => s + x, 0) !== ROWS.length || age.counts[9] < 1 || age.labels.length !== 10) p.push('age bins ' + age.counts);
        if (M.traitStats(c)[4].n !== ROWS.length - 1) p.push('a missing trait was counted');
        const tm = M.traitMeans(c, 'species');
        for (const g of tm) { const rs = ROWS.filter(r => r.species === g.key); if (g.n !== rs.length || !near(g.means[1], rs.reduce((s, r) => s + r.conscientiousness, 0) / rs.length)) p.push('trait mean ' + g.key); }
        return p;
    }, [
        { name: 'top edge overflows', find: 'const i = Math.min(bins - 1, Math.max(0,', put: 'const i = Math.min(bins, Math.max(0,' },
        { name: 'median takes the lower middle', find: '(sorted[n / 2 - 1] + sorted[n / 2]) / 2', put: 'sorted[n / 2 - 1]' }
    ]);

    await rule('applyFilter: equals an independent predicate; aptitudes mean ALL picked; search by name and card number', async M => {
        const c = cardsOf(M), p = [];
        const rank = { minor: 0, major: 1, anomalous: 2 };
        const brute = (f) => ROWS.filter(r => {
            const a = new Map(aptsOf(r));
            for (const d of ['rarity', 'faction', 'species', 'university', 'sex']) if (f[d] && !f[d].includes(r[d])) return false;
            if (f.aptCount && !f.aptCount.includes(String(a.size))) return false;
            if (f.aptitude && !f.aptitude.every(k => a.has(k) && (!f.minGain || rank[a.get(k)] >= rank[f.minGain]))) return false;
            if (!f.aptitude && f.minGain && ![...a.values()].some(g => rank[g] >= rank[f.minGain])) return false;
            if (f.q) { const q = f.q.trim().toLowerCase().replace(/^#/, ''); if (!(r.name.toLowerCase().includes(q) || String(r.mintOffset).startsWith(q))) return false; }
            return true;
        }).map(r => r.mintOffset);
        const cases = [{}, { rarity: ['Rare', 'Epic'] }, { faction: ['Ustur'], species: ['Human', 'Ustur'] }, { aptitude: ['Engineering'] }, { aptitude: ['Engineering', 'Science'] },
            { aptitude: ['Flight'], minGain: 'major' }, { minGain: 'major' }, { minGain: 'anomalous' }, { aptitude: ['Command', 'Flight', 'Medical'] }, { aptCount: ['2', '3'], sex: ['Male'] },
            { q: 'ANA' }, { q: '#10' }, { q: ' 1007 ' }, { university: ['ONI Institute'], rarity: ['Common'], q: 'bo' }, { aptitude: ['Piloting'] }, { q: 'zzzz-no-such' }];
        let nonEmpty = 0, shrunk = 0;
        for (const cs of cases) {
            const f = M.emptyFilter();
            for (const k of Object.keys(cs)) { if (Array.isArray(cs[k])) cs[k].forEach(v => f[k].add(v)); else f[k] = cs[k]; }
            const got = M.applyFilter(c, f).map(x => x.id), want = brute(cs);
            if (!eq(got, want)) p.push(JSON.stringify(cs) + ' ' + got.length + ' vs ' + want.length);
            if (want.length) nonEmpty++; if (want.length < ROWS.length) shrunk++;
            if (M.filterActive(f) !== (Object.keys(cs).length > 0)) p.push('filterActive ' + JSON.stringify(cs));
        }
        if (nonEmpty < 13 || shrunk < 14) p.push('cases too weak: ' + nonEmpty + ' non-empty, ' + shrunk + ' that filter');
        return p;
    }, [
        { name: 'aptitudes mean ANY picked', find: 'if (!a) return false;', put: 'if (!a) continue;' },
        { name: 'major does not count as major', find: 'return GAINS.indexOf(g) >= GAINS.indexOf(min);', put: 'return GAINS.indexOf(g) > GAINS.indexOf(min);' },
        { name: 'search ignores the card number', find: '|| String(c.id).startsWith(q))) return false;', put: ')) return false;' }
    ]);

    await rule('score and sort: XP gain on the picked aptitudes; ties by rarity, then card number; input left alone', async M => {
        const c = cardsOf(M), p = [];
        const rr = r => ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Anomaly'].indexOf(r);
        const byId = new Map(ROWS.map(r => [r.mintOffset, r]));
        for (const picks of [[], ['Engineering'], ['Flight', 'Science']]) {
            const set = new Set(picks);
            const sc = id => aptsOf(byId.get(id)).filter(a => !picks.length || picks.includes(a[0])).reduce((s, a) => s + XP[a[1]], 0);
            for (const x of c.slice(0, 80)) if (!near(M.score(x, set), sc(x.id))) p.push('score ' + x.id);
            const before = c.map(x => x.id).join();
            const s = M.sortCards(c, 'score', set);
            if (c.map(x => x.id).join() !== before) p.push('input reordered');
            if (s.length !== c.length || new Set(s.map(x => x.id)).size !== c.length) p.push('not a permutation');
            let ties = 0;
            for (let i = 1; i < s.length; i++) {
                const a = s[i - 1], b = s[i], d = sc(a.id) - sc(b.id);
                if (d < -1e-9) { p.push('score order at ' + i); break; }
                if (Math.abs(d) < 1e-9) { ties++; const dr = rr(a.rarity) - rr(b.rarity); if (dr < 0 || (dr === 0 && a.id > b.id)) { p.push('tie order at ' + i + ' [' + picks + ']'); break; } }
            }
            if (ties < 50) p.push('too few ties to test the tie rule');
        }
        const byName = M.sortCards(c, 'name').map(x => x.name.toLowerCase());
        if (!eq(byName, byName.slice().sort())) p.push('name order');
        const byOpen = M.sortCards(c, 'openness');
        if (byOpen[0].openness !== 1 || byOpen[byOpen.length - 1].openness !== 0) p.push('trait order');
        const byNeu = M.sortCards(c, 'neuroticism');
        if (byNeu[byNeu.length - 1].neuroticism !== null) p.push('a missing trait is not last');
        return p;
    }, [
        { name: 'ties ignore rarity', find: 'score: (a, b) => score(b, aptitudes) - score(a, aptitudes) || rar(a, b) || byId(a, b),', put: 'score: (a, b) => score(b, aptitudes) - score(a, aptitudes) || byId(a, b),' },
        { name: 'score ignores the picks', find: 'if (!pick || pick.has(a.k)) s += GAIN_XP[a.g];', put: 's += GAIN_XP[a.g];' }
    ]);

    await rule('verdict: numbers equal brute force; ties name every aptitude; zero and all-equal cases have their own sentence', async M => {
        const p = [];
        const mk = (id, apts, rarity) => M.normalize({ mintOffset: id, name: 'n' + id, rarity: rarity || 'Common', aptitudes: apts });
        const text = cards => M.verdict(cards).join(' ').replace(/<[^>]+>/g, '');
        if (M.verdict([]).length) p.push('empty roster produced text');
        const tie = text([mk(1, { Flight: 'major' }), mk(2, { Flight: 'minor' }), mk(3, { Science: 'minor' }), mk(4, { Science: 'major' }), mk(5, { Medical: 'minor' })]);
        if (!/Strongest aptitude: Flight and Science, on 2 crew/.test(tie)) p.push('tie: ' + tie);
        if (!/nobody has it/.test(tie)) p.push('zero branch: ' + tie);
        if (!/No crew has an anomaly-rate aptitude/.test(tie) || !/0 \(0%\) have two or more aptitudes at major/.test(tie)) p.push('rates: ' + tie);
        const one = text([mk(1, { Flight: 'major', Science: 'major', Medical: 'minor' }, 'Rare'), mk(2, { Flight: 'anomaly' }, 'Anomaly'), mk(3, { Fitness: 'minor' })]);
        if (!/1 \(33%\) have two or more aptitudes at major/.test(one)) p.push('two majors: ' + one);
        if (!/Strongest aptitude: Flight, on 2 crew \(67%\), 2 of them at major or better/.test(one)) p.push('single: ' + one);
        if (!/1 crew have an anomaly-rate aptitude/.test(one) || !/1 crew \(33%\) carry three aptitudes/.test(one)) p.push('anomaly/three: ' + one);
        const all = text(APT.map((k, i) => mk(i + 1, { [k]: 'minor' })));
        if (!/Every aptitude is on 1 crew/.test(all)) p.push('all equal: ' + all);
        // on the big fixture the quoted numbers are the brute-force ones
        const big = text(cardsOf(M));
        const cnt = APT.map(k => ROWS.filter(r => aptsOf(r).some(a => a[0] === k)).length);
        const hiN = Math.max(...cnt), loN = Math.min(...cnt);
        if (!big.includes('on ' + hiN.toLocaleString('en-US') + ' crew') || !big.includes(APT[cnt.indexOf(hiN)])) p.push('big strongest: ' + big);
        if (!big.includes(APT[cnt.indexOf(loN)] + ', on ' + loN.toLocaleString('en-US') + ' crew')) p.push('big thinnest: ' + big);
        return p;
    }, [
        { name: 'strongest = first, not all tied', find: 'const top = mx.filter(r => r.any === hi), low = mx.filter(r => r.any === lo);', put: 'const top = mx.filter(r => r.any === hi).slice(0, 1), low = mx.filter(r => r.any === lo);' },
        { name: 'thinnest uses the largest', find: 'lo = Math.min(...mx.map(r => r.any));', put: 'lo = Math.max(...mx.map(r => r.any));' }
    ]);

    // ================================================================ feed reader (fake feed)
    await rule('feed walk: asks page by page until an empty page, keeps every card once', async (M, F) => {
        // 211 cards plus one row whose number normalize() refuses: it must not be counted as loaded crew
        const rows = ROWS.slice(0, 150).concat([{ mintOffset: 2e9 }], ROWS.slice(150, 211)), net = fakeNet(url => slice(rows, pageOf(url)));
        const seen = [];
        const r = await F.walkInventory('OWNER', net, ctlFor(F, net), pg => seen.push(pg.cards));
        const p = [];
        if (!r.complete || r.reason || r.rows.length !== 211 || r.pages !== 4) p.push(JSON.stringify({ c: r.complete, r: r.reason, n: r.rows.length, pages: r.pages }));
        if (!eq(net.calls.map(c => c.url), [1, 2, 3, 4].map(n => F.FEED + 'OWNER?page=' + n))) p.push('urls ' + net.calls.map(c => c.url));
        if (!eq(seen, [100, 199, 211])) p.push('progress ' + seen);
        if (net.calls.some(c => c.opt.credentials !== 'omit')) p.push('credentials sent');
        return p;
    }, [
        { file: 'fetch', name: 'stops on a short page', find: "if (!body.crew.length) return out('');", put: "if (body.crew.length < 100) return out('');" },
        { file: 'fetch', name: 'counts rows normalize will drop', find: 'if (!M.validId(id) || seen.has(id)) continue;', put: 'if (!Number.isInteger(id) || seen.has(id)) continue;' }
    ]);

    await rule('feed walk: a feed that ignores the page number is stopped, not walked for five minutes', async (M, F) => {
        const net = fakeNet(() => slice(ROWS, 1));
        const r = await F.walkInventory('OWNER', net, ctlFor(F, net));
        return r.reason === 'repeat' && r.rows.length === 100 && net.calls.length === 2 ? [] : [JSON.stringify({ r: r.reason, n: r.rows.length, calls: net.calls.length })];
    }, [{ file: 'fetch', name: 'no repeat guard', find: "if (!fresh) return out(ctl.room <= 0 ? 'cap' : 'repeat');", put: '' }]);

    await rule('feed walk: waits and retries on "too many requests", gives up after three, keeps what it had', async (M, F) => {
        const p = [];
        let n = 0;
        const net = fakeNet(url => (pageOf(url) === 2 && n++ < 2 ? { status: 429, body: {} } : slice(ROWS.slice(0, 150), pageOf(url))));
        const r = await F.walkInventory('OWNER', net, ctlFor(F, net));
        if (!r.complete || r.rows.length !== 150) p.push('after two 429: ' + r.reason + ' ' + r.rows.length);
        if (!eq(net.slept.filter(ms => ms >= 1000), [2000, 4000])) p.push('waits ' + net.slept);
        const net2 = fakeNet(url => (pageOf(url) === 2 ? { status: 429, body: {} } : slice(ROWS, pageOf(url))));
        const r2 = await F.walkInventory('OWNER', net2, ctlFor(F, net2));
        if (r2.reason !== 'error' || !/429/.test(r2.error) || r2.rows.length !== 100 || net2.calls.length !== 1 + 4) p.push('endless 429: ' + JSON.stringify({ r: r2.reason, e: r2.error, n: r2.rows.length, calls: net2.calls.length }));
        return p;
    }, [{ file: 'fetch', name: 'never gives up', find: 'if (attempt >= RETRIES) return out(', put: 'if (attempt >= 1e9) return out(' }]);

    await rule('feed walk: an error part-way keeps the cards already read and says what failed', async (M, F) => {
        const p = [];
        const cases = [
            ['HTTP 500', url => (pageOf(url) === 3 ? { status: 500, body: {} } : slice(ROWS, pageOf(url))), /HTTP 500/],
            ['bad shape', url => (pageOf(url) === 3 ? { body: { crew: 'nope' } } : slice(ROWS, pageOf(url))), /unknown shape/],
            ['not JSON', url => (pageOf(url) === 3 ? { notJson: true } : slice(ROWS, pageOf(url))), /could not be read/],
            ['network down', url => { if (pageOf(url) === 3) throw new TypeError('Failed to fetch'); return slice(ROWS, pageOf(url)); }, /could not reach/]
        ];
        for (const [name, script, re] of cases) {
            const net = fakeNet(script);
            const r = await F.walkInventory('OWNER', net, ctlFor(F, net));
            if (r.complete || r.reason !== 'error' || !re.test(r.error) || r.rows.length !== 200) p.push(name + ': ' + JSON.stringify({ r: r.reason, e: r.error, n: r.rows.length }));
        }
        return p;
    }, [{ file: 'fetch', name: 'a failed page reads as the end', find: "if (!res.ok) return out('error', 'the crew feed answered HTTP ' + res.status);", put: "if (!res.ok) return out('');" }]);

    await rule('feed walk: stops at the time limit, at the card limit, and when the visitor presses stop', async (M, F) => {
        const p = [];
        // never runs dry, but gives up loudly long before memory does, so a walk with no limit reports instead of crashing
        const endless = (url, n) => { if (n > 5000) throw new Error('the fake feed was asked more than 5,000 times'); const pg = pageOf(url); return { body: { crew: Array.from({ length: 100 }, (_, i) => ({ mintOffset: pg * 1000 + i })) } }; };
        const net = fakeNet(endless), ctl = ctlFor(F, net, 1e9), t0 = net.now();
        const r = await F.walkInventory('OWNER', net, ctl);
        if (r.reason !== 'time' || r.complete || net.now() - t0 > F.LIMIT_MS + 1000 || net.now() - t0 < F.LIMIT_MS) p.push('time: ' + r.reason + ' after ' + (net.now() - t0) + ' ms');
        if (r.rows.length !== r.pages * 100 || r.pages < 100) p.push('time rows ' + r.rows.length);
        const net2 = fakeNet(endless), ctl2 = ctlFor(F, net2, 250);
        const r2 = await F.walkInventory('OWNER', net2, ctl2);
        if (r2.reason !== 'cap' || r2.rows.length !== 250 || ctl2.room !== 0 || net2.calls.length !== 3) p.push('cap: ' + r2.reason + ' ' + r2.rows.length + ' rows, ' + net2.calls.length + ' calls');
        const ac = new AbortController();
        const net3 = fakeNet(url => { if (pageOf(url) === 2) ac.abort(); return endless(url); });
        net3.signal = ac.signal;
        const r3 = await F.walkInventory('OWNER', net3, ctlFor(F, net3));
        if (r3.reason !== 'stopped' || r3.rows.length !== 200) p.push('stop: ' + r3.reason + ' ' + r3.rows.length);
        return p;
    }, [
        { file: 'fetch', name: 'no time limit', find: "if (d.now() >= ctl.deadline) return out('time');\n            if (ctl.room <= 0)", put: 'if (ctl.room <= 0)' },
        { file: 'fetch', name: 'no card limit', find: "if (ctl.room <= 0) return out('cap');\n            let body;", put: 'let body;' },
        { file: 'fetch', name: 'stop ignored', find: "if (aborted()) return out('stopped');\n            if (d.now() >= ctl.deadline)", put: 'if (d.now() >= ctl.deadline)' }
    ]);

    await rule('load: wallet crew + the profile read at its computed SAGE account, one card once, a failed source keeps the other', async (M, F) => {
        const p = [];
        const WALLET = PDA[3][0], P1 = PDA[0][0];
        const inv = { [WALLET]: ROWS.slice(0, 5).concat(BAD_ROWS.filter(x => x && typeof x === 'object')), [PDA[0][1]]: ROWS.slice(3, 120) };
        const feed = url => slice(inv[ownerOf(url)] || [], pageOf(url));
        const net = fakeNet(feed), prog = [];
        const res = await F.load({ wallet: ' ' + WALLET + ' ', profile: P1 }, net, x => prog.push(x));
        if (!eq(res.sources.map(s => [s.kind, s.key, s.owner]), [['wallet', WALLET, WALLET], ['profile', P1, PDA[0][1]]])) p.push('sources ' + JSON.stringify(res.sources.map(s => [s.kind, s.key, s.owner])));
        if (!eq(res.sources.map(s => s.count), [5, 117])) p.push('counts ' + res.sources.map(s => s.count));
        if (res.cards.length !== 120 || new Set(res.cards.map(c => c.id)).size !== 120) p.push('merged ' + res.cards.length);
        if (res.partial || res.notes.length) p.push('partial/notes on a clean load of both: ' + JSON.stringify(res.notes));
        if (net.calls.some(c => !c.url.startsWith(F.FEED)) || net.calls.length !== 2 + 3) p.push('calls: ' + net.calls.map(c => c.url));
        if (net.calls.some(c => ownerOf(c.url) === P1)) p.push('the profile key itself was asked for crew');
        if (!prog.length || prog[prog.length - 1].cards !== 5 + 117 || prog[prog.length - 1].steps !== 2) p.push('progress ' + JSON.stringify(prog[prog.length - 1]));
        // one address only: one source, and a note saying what is not shown
        const w = await F.load({ wallet: WALLET }, fakeNet(feed)), pr = await F.load({ profile: P1 }, fakeNet(feed));
        if (w.sources.length !== 1 || w.cards.length !== 5 || w.notes.length !== 1 || !/player profile/.test(w.notes[0])) p.push('wallet only: ' + w.cards.length + ' ' + JSON.stringify(w.notes));
        if (pr.sources.length !== 1 || pr.sources[0].owner !== PDA[0][1] || pr.cards.length !== 117 || pr.notes.length !== 1 || !/wallet/.test(pr.notes[0])) p.push('profile only: ' + pr.cards.length + ' ' + JSON.stringify(pr.notes));
        // one source failing keeps the other and marks the roster partial
        const net3 = fakeNet(url => (ownerOf(url) === WALLET ? { status: 502, body: {} } : feed(url)));
        const res3 = await F.load({ wallet: WALLET, profile: P1 }, net3);
        if (res3.cards.length !== 117 || !res3.partial || !/HTTP 502/.test(res3.sources[0].error) || res3.sources[1].error) p.push('one source down: ' + res3.cards.length + ' ' + res3.partial);
        for (const bad of [{ wallet: '', profile: '' }, { wallet: 'nope' }, { wallet: WALLET, profile: 'nope' }, {}]) {
            let threw = false; const netx = fakeNet(() => ({ body: { crew: [] } }));
            try { await F.load(bad, netx); } catch (e) { threw = true; }
            if (!threw || netx.calls.length) p.push('bad input accepted or sent: ' + JSON.stringify(bad));
        }
        return p;
    }, [
        { file: 'fetch', name: 'profile read at its own address', find: "sources.push({ kind: 'profile', key: profile, owner: await M.sagePlayerProfileAddress(profile) });", put: "sources.push({ kind: 'profile', key: profile, owner: profile });" },
        { file: 'fetch', name: 'sends an invalid address', find: "if (wallet && !M.isAddress(wallet)) throw new Error('the wallet is not a valid address');", put: '' },
        { file: 'fetch', name: 'silent about what a wallet-only load leaves out', find: "if (!profile) notes.push(", put: "if (false) notes.push(" },
        { file: 'fetch', name: 'partial never set', find: 'partial: sources.some(s => !s.complete)', put: 'partial: false' }
    ]);

    await rule('feed walk: a request that never answers ends at the time limit; stop works during a request and during a back-off wait', async (M, F) => {
        const p = [];
        // a fetch that only ever ends when its own signal is aborted, like a stalled connection
        const hang = opt => new Promise((_, reject) => opt.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError'))));
        // the injected timer jumps the fake clock to the moment it was set for, then fires
        const jump = net => { net.setTimeout = (fn, ms) => setTimeout(() => { net.t += ms; fn(); }, 0); net.clearTimeout = t => clearTimeout(t); return net; };
        const net = jump(fakeNet((url, n, opt) => (pageOf(url) === 3 ? hang(opt) : slice(ROWS, pageOf(url))))), t0 = net.now();
        const r = await F.walkInventory('OWNER', net, ctlFor(F, net));
        if (r.reason !== 'time' || r.rows.length !== 200 || net.now() - t0 < F.LIMIT_MS) p.push('stalled request: ' + JSON.stringify({ r: r.reason, e: r.error, n: r.rows.length }));
        // stop pressed while a request is stalled (no timer help: the timer never fires here)
        const ac = new AbortController();
        const net2 = fakeNet((url, n, opt) => { if (pageOf(url) === 2) { setTimeout(() => ac.abort(), 0); return hang(opt); } return slice(ROWS, pageOf(url)); });
        net2.signal = ac.signal; net2.setTimeout = () => 0; net2.clearTimeout = () => {};
        const r2 = await F.walkInventory('OWNER', net2, ctlFor(F, net2));
        if (r2.reason !== 'stopped' || r2.rows.length !== 100) p.push('stop during a request: ' + r2.reason + ' ' + r2.rows.length);
        // stop pressed during the wait after "too many requests": the wait itself never ends in this fake
        const ac3 = new AbortController();
        const net3 = fakeNet(url => (pageOf(url) === 2 ? { status: 429, body: {} } : slice(ROWS, pageOf(url))));
        net3.signal = ac3.signal;
        net3.sleep = ms => (ms >= 1000 ? (setTimeout(() => ac3.abort(), 0), new Promise(() => {})) : Promise.resolve());
        const r3 = await F.walkInventory('OWNER', net3, ctlFor(F, net3));
        if (r3.reason !== 'stopped' || r3.rows.length !== 100) p.push('stop during a wait: ' + r3.reason + ' ' + r3.rows.length);
        return p;
    }, [
        { file: 'fetch', name: 'a stalled request is never cancelled', via: 'hang', find: 'const t = d.setTimeout(stop, Math.max(0, msLeft));', put: 'const t = 0;' },
        { file: 'fetch', name: 'a time-out is reported as a failure', find: "if (d.now() >= ctl.deadline) return out('time');\n                return out('error', 'could not reach", put: "return out('error', 'could not reach" },
        { file: 'fetch', name: 'the back-off wait cannot be stopped', via: 'hang', find: 'await pause(d, wait);', put: 'await d.sleep(wait);' }
    ]);

    await rule('empty result: "no crew found" only when every address was read to its end', async (M, F) => {
        const p = [];
        const src = (reason, error) => ({ kind: 'wallet', key: PDA[0][0], count: 0, complete: !reason, reason: reason || '', error: error || '' });
        const say = (sources, notes) => F.describeEmpty({ sources, notes: notes || [] });
        if (!/^No crew found for this address\. Check the address\.$/.test(say([src()]))) p.push('read to the end: ' + say([src()]));
        if (!/^No crew found for these addresses\. NOTE$/.test(say([src(), src()], ['NOTE']))) p.push('two read to the end: ' + say([src(), src()], ['NOTE']));
        if (!/^Stopped before any crew was read\.$/.test(say([src('stopped')]))) p.push('stopped: ' + say([src('stopped')]));
        if (/No crew found/.test(say([src('time')])) || !/Could not load the crew: stopped at the five-minute limit\./.test(say([src('time')]))) p.push('time: ' + say([src('time')]));
        if (!/^Could not load the crew: could not reach the crew feed \(x\)\.$/.test(say([src('error', 'could not reach the crew feed (x)')]))) p.push('error: ' + say([src('error', 'could not reach the crew feed (x)')]));
        if (!/^No crew found, but not every address could be read: the crew feed answered HTTP 502\.$/.test(say([src(), src('error', 'the crew feed answered HTTP 502')]))) p.push('one failed: ' + say([src(), src('error', 'the crew feed answered HTTP 502')]));
        if (F.reasonText('constructor') !== 'incomplete' || F.reasonText('cap').indexOf('40,000') < 0) p.push('reasonText');
        // and from a real walk: every page rate-limited until the clock runs out
        const net = fakeNet(() => ({ status: 429, body: {} }));
        net.sleep = async ms => { net.slept.push(ms); net.t += ms >= 1000 ? 200000 : ms; };
        const res = await F.load({ wallet: PDA[3][0] }, net);
        if (res.cards.length || /No crew found/.test(F.describeEmpty(res))) p.push('rate-limited to the limit: ' + F.describeEmpty(res));
        return p;
    }, [
        { file: 'fetch', name: 'a stop reads as empty', find: "if (src.some(s => s.reason === 'stopped')) return 'Stopped before any crew was read.';", put: '' },
        { file: 'fetch', name: 'a failure reads as empty', find: 'if (failed.length) {', put: 'if (false) {' }
    ]);

    await rule('saved roster: re-checked like outside data; a clean one comes back unchanged; part of a load never replaces a whole one', async M => {
        const p = [];
        const cards = ROWS.slice(0, 40).map(M.normalize);
        const good = { v: 1, savedAt: 123, inputs: { wallet: PDA[3][0], profile: PDA[0][0] }, partial: false, notes: ['n'], cards,
            sources: [{ kind: 'wallet', key: PDA[3][0], owner: PDA[3][0], count: 5, pages: 2, complete: true, reason: '', error: '' }, { kind: 'profile', key: PDA[0][0], owner: PDA[0][1], count: 35, pages: 2, complete: true, reason: '', error: '' }] };
        const back = M.cleanRecord(JSON.parse(JSON.stringify(good)));
        if (!same(back, good)) p.push('a clean record changed: ' + canon(back).slice(0, 200));
        if (same(back, Object.assign({}, good, { savedAt: 124 }))) p.push('the comparison cannot see a changed field');
        for (const bad of [null, 5, {}, { v: 2, cards }, { v: 1, cards: 'x' }, { v: 1, cards: [] }, { v: 1, cards: [{ id: 'x', apts: [] }] }]) if (M.cleanRecord(bad) !== null) p.push('accepted ' + JSON.stringify(bad).slice(0, 60));
        const evil = '<img src=x onerror=1>';
        const dirty = M.cleanRecord({ v: 1, savedAt: 'now', inputs: { wallet: evil, profile: 7 }, partial: 'no', notes: [5, evil, null],
            sources: [{ kind: evil, key: PDA[0][0], owner: evil, count: 'many', complete: 'yes', reason: 'constructor', error: 9 }, { key: evil }, null],
            cards: [{ id: 1, name: 5, rarity: { x: 1 }, age: 'old', apts: [{ k: 'Flight' }, { k: 'Flight', g: 'constructor' }, { k: 7, g: 'major' }, { k: 'Science', g: 'major', extra: evil }, null], das: evil, junk: evil },
                { id: 1, name: 'twice', apts: [] }, { id: 2.5, apts: [] }, { id: 3, apts: 'x' }, { id: 4, name: evil, apts: [] }] });
        if (!dirty) p.push('a record with usable cards was refused');
        else {
            if (!eq(dirty.cards.map(c => c.id), [1, 4])) p.push('cards kept: ' + dirty.cards.map(c => c.id));
            if (!eq(dirty.cards[0].apts, [{ k: 'Science', g: 'major' }]) || dirty.cards[0].name !== 'Crew #1' || dirty.cards[0].rarity !== 'Unknown' || dirty.cards[0].age !== null || dirty.cards[0].das !== '' || 'junk' in dirty.cards[0]) p.push('card 1: ' + JSON.stringify(dirty.cards[0]));
            if (dirty.cards[1].name !== evil) p.push('a text name must stay text (it is escaped when drawn)');
            if (!eq(dirty.sources, [{ kind: 'wallet', key: PDA[0][0], owner: '', count: 0, pages: 0, complete: false, reason: 'error', error: '' }])) p.push('sources: ' + JSON.stringify(dirty.sources));
            if (!eq(dirty.inputs, { wallet: '', profile: '' }) || dirty.savedAt !== 0 || !eq(dirty.notes, [evil]) || dirty.partial !== true) p.push('fields: ' + JSON.stringify([dirty.inputs, dirty.savedAt, dirty.notes, dirty.partial]));
        }
        for (const c of ROWS.map(M.normalize)) if (!same(M.cleanCard(c), c)) { p.push('cleanCard changed card ' + c.id); break; }
        const T = { partial: true }, W = { partial: false };
        const table = [[W, null, true], [T, null, true], [W, W, true], [W, T, true], [T, T, true], [T, W, false]];
        for (const [fresh, saved, want] of table) if (M.shouldSave(fresh, saved) !== want) p.push('shouldSave(' + JSON.stringify(fresh) + ', ' + JSON.stringify(saved) + ')');
        return p;
    }, [
        { name: 'any rate accepted from the device', find: "if (a && typeof a.k === 'string' && a.k && isGain(a.g)) apts.push", put: "if (a && typeof a.k === 'string' && a.k) apts.push" },
        { name: 'source fields kept as stored', find: "reason: SOURCE_REASONS.includes(s.reason) ? s.reason : 'error', error: str(s.error, 200)", put: 'reason: s.reason, error: s.error' },
        { name: 'part of a load replaces a whole roster', find: 'return !fresh.partial || !saved || saved.partial === true;', put: 'return true;' }
    ]);

    await rule('compare table: picking a cell shows exactly the crew that cell counted, whatever is already filtered', async M => {
        const c = ROWS.map(M.normalize), p = [];
        const bases = [{}, { minGain: 'major' }, { aptitude: ['Engineering'] }, { aptitude: ['Flight'], minGain: 'major' }, { rarity: ['Rare', 'Epic'], q: 'a' }];
        const pairs = [['rarity', 'species'], ['aptitude', 'rarity'], ['aptitude', 'aptitude'], ['faction', 'aptitude'], ['aptCount', 'sex']];
        let cells = 0, multi = 0;
        for (const b of bases) {
            const f = M.emptyFilter();
            for (const k of Object.keys(b)) { if (Array.isArray(b[k])) b[k].forEach(v => f[k].add(v)); else f[k] = b[k]; }
            const view = M.applyFilter(c, f);
            for (const [rd, cd] of pairs) {
                const t = M.crosstab(view, rd, cd);
                t.rows.forEach((r, i) => t.cols.forEach((k, j) => {
                    const n = t.cells[i][j];
                    if (!n) return;
                    const ids = M.cellIds(view, rd, r, cd, k);
                    const shown = M.applyFilter(c, Object.assign({}, f, { pick: { label: 'x', ids } }));
                    cells++; if (rd === 'aptitude' || cd === 'aptitude') multi++;
                    if (ids.size !== n || shown.length !== n || shown.some(x => !ids.has(x.id))) p.push(JSON.stringify(b) + ' ' + rd + '=' + r + ' ' + cd + '=' + k + ': cell ' + n + ', picked ' + ids.size + ', shown ' + shown.length);
                }));
            }
        }
        if (cells < 300 || multi < 150) p.push('too few cells tried: ' + cells + ' (' + multi + ' with aptitudes)');
        const f = M.emptyFilter(); f.pick = { label: 'x', ids: new Set() };
        if (M.applyFilter(c, f).length !== 0 || !M.filterActive(f)) p.push('an empty pick must show nothing and count as a filter');
        return p.slice(0, 5);
    }, [
        { name: 'the pick is ignored', find: 'if (f.pick && !f.pick.ids.has(c.id)) return false;', put: '' },
        { name: 'the pick looks at the row only', find: 'if (dimValues(c, rowDim).includes(rowVal) && dimValues(c, colDim).includes(colVal)) ids.add(c.id);', put: 'if (dimValues(c, rowDim).includes(rowVal)) ids.add(c.id);' }
    ]);

    // ================================================================ page files
    await rule('page: content policy allows only the feed and the portrait CDN; every script it names exists', async (M, F) => {
        const p = [];
        const html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
        const csp = (html.match(/Content-Security-Policy" content="([^"]+)"/) || [])[1] || '';
        const dir = name => (csp.split(';').map(s => s.trim()).find(s => s.startsWith(name + ' ')) || '').split(/\s+/).slice(1);
        if (!eq(dir('default-src'), ["'none'"])) p.push('default-src ' + dir('default-src'));
        if (!eq(dir('script-src'), ["'self'"])) p.push('script-src ' + dir('script-src'));
        if (!eq(dir('connect-src'), ["'self'", new URL(F.FEED).origin])) p.push('connect-src ' + dir('connect-src'));
        if (!dir('img-src').includes(new URL(M.portraitUrl(1)).origin)) p.push('img-src lacks the portrait host');
        if (/unsafe-eval/.test(csp) || /\son[a-z]+="/.test(html)) p.push('eval or inline handlers');
        for (const m of html.matchAll(/<script src="([^"?]+)/g)) if (!fs.existsSync(path.join(DIR, m[1]))) p.push('missing ' + m[1]);
        const app = fs.readFileSync(path.join(DIR, 'app.js'), 'utf8');
        for (const id of new Set([...app.matchAll(/\$\('([A-Za-z0-9-]+)'\)/g)].map(m => m[1]))) if (!html.includes('id="' + id + '"') && !app.includes('id="' + id + '"')) p.push('app.js uses #' + id + ', which no file creates');
        return p;
    });

    console.log('\n' + pass + ' passed, ' + fail + ' failed');
    if (fail) { console.log(failures.map(f => '  - ' + f).join('\n')); process.exit(1); }
})().catch(e => { console.error('CHECK CRASHED', e); process.exit(1); });
