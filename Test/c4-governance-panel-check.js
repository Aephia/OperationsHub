// c4-governance-panel-check.js - C4 Live: the Governance block of the system panel and the owner drawer lines (2026-11-24).
//   node Test/c4-governance-panel-check.js
// Pure model checks (no browser): C4Live/c4-ui-model.js governanceForSystem / governanceHtml / governanceForOwner.
// Real data: the latest.json named by env GOV_LATEST (default: the local read in Data/c4-live, read only) with the
// contract fixture (env GOV_FIXTURE, default Test/fixtures/c4-gov-fixture.json) merged in as latest.gov; if either file is missing that part
// is skipped with a message and the synthetic parts still run. The negative cases re-load the model with ONE guard removed
// from its source text and require the named check to fail.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const MODEL = path.join(ROOT, 'C4Live', 'c4-ui-model.js');
const LATEST = process.env.GOV_LATEST || path.join(ROOT, 'Data', 'c4-live', 'latest.json');   // the repo's local read; gov is replaced by the fixture
const FIXTURE = process.env.GOV_FIXTURE || path.join(ROOT, 'Test', 'fixtures', 'c4-gov-fixture.json');
let pass = 0, fail = 0;
function check(name, ok, detail) {
    if (ok) { pass++; console.log('  ok   ' + name); } else { fail++; console.log('  FAIL ' + name + (detail !== undefined ? '  -> ' + detail : '')); }
    return !!ok;
}
const clone = o => JSON.parse(JSON.stringify(o));
const BAD = /undefined|NaN|\[object|Infinity|null/;
// scan every string in a value (and the html) for the tokens that must never be printed
function badTokens(v) {
    const hits = [];
    (function walk(x) {
        if (typeof x === 'string') { if (BAD.test(x)) hits.push(x); } else if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object') Object.values(x).forEach(walk);
    })(v);
    return hits;
}
function loadModel(mutate) {
    if (!mutate) return require(MODEL);
    let src = fs.readFileSync(MODEL, 'utf8');
    const out = mutate(src);
    if (out === src) throw new Error('mutation did not change the source');
    const f = path.join(os.tmpdir(), 'c4-ui-model-mut-' + process.pid + '-' + Math.random().toString(36).slice(2) + '.js');
    fs.writeFileSync(f, out);
    try { return require(f); } finally { try { fs.unlinkSync(f); } catch (e) { /* temp file */ } }
}

const IZAR = '4StXzBqD1BprBizKfYrCVYYGT1dk2P88YZQjpbceuD5F';   // voting power 40,000, module installed, voters want other fees
const DREAM = 'H4FRDkfSMvREG8bKaZAahzc7pWXju57CrhVk18ASe8H4';  // default fees, module not started
const VEGA = 'FDnc4UqYLxYSBimofE4cyA9sRGVy457a1wnVeinKSt95';
const OWNER = '2aCsVB58nEyB8vfyhwUAoj32MrA6GcZkiRDqmHHqxURy';

// ------------------------------------------------------------------ the checks, run against one model
function suite(M, label, real, synth) {
    const r = {};
    // [1] formatters
    r.fmt = check(label + 'formatters: 10000 x1.00, 15000 x1.50, 100 "1 %", 2500 "25 %", 60 "0.6 %"',
        M.govMult(10000) === 'x1.00' && M.govMult(15000) === 'x1.50' && M.govPct(100) === '1 %' && M.govPct(2500) === '25 %' && M.govPct(60) === '0.6 %',
        [M.govMult(10000), M.govMult(15000), M.govPct(100), M.govPct(2500), M.govPct(60)].join(' | '));
    r.fmtBad = check(label + 'formatters: a non-number gives null, not "NaN"', M.govMult(undefined) === null && M.govPct('x') === null && M.govPct(NaN) === null);
    r.day = check(label + 'chain day 20779 -> 2026-11-22 (day x 86,400 s, UTC)', M.govDay(20779) === '2026-11-22', M.govDay(20779));
    // [2] real data
    if (real) {
        const L = real;
        const iz = M.governanceForSystem(L, IZAR);
        r.izar = check(label + 'Izar: faction MUD level 2, module installed 2026-11-24, set by votes',
            iz && iz.factionLabel === 'MUD' && iz.group === 'mud' && iz.level === 2 && iz.module.text === 'installed 2026-11-24' && iz.feeSrc === 'set by votes', JSON.stringify(iz && [iz.factionLabel, iz.level, iz.module, iz.feeSrc]));
        r.izarVote = check(label + 'Izar: voting power 40000, 1 voter, 10 crew; voters ask for 30 % local share and 100 % payout (craft and market equal, so absent)',
            iz && iz.voting && iz.voting.power === 40000 && iz.voting.voters === 1 && iz.voting.crew === 10 && iz.want.map(x => x.label + ' ' + x.now).join(', ') === 'Share kept by the local treasury 30 %, Treasury paid out to voters 100 %',
            iz && JSON.stringify([iz.voting, iz.want]));
        r.izarLast = check(label + 'Izar: last weekly vote 2026-11-22, 0 of 0 counted, no outcome line (winner equals the fees in force)',
            iz && iz.lastVote && iz.lastVote.date === '2026-11-22' && iz.lastVote.power === 0 && iz.lastVote.expected === 0 && iz.lastVote.outcome.length === 0, iz && JSON.stringify(iz.lastVote));
        const html = M.governanceHtml(iz);
        r.izarHtml = check(label + 'Izar html: names the page faction (fc-mud), "40,000", "1 / 10", "installed 2026-11-24", the heading',
            /fc-mud/.test(html) && html.includes('>40,000<') && html.includes('1 / 10') && html.includes('installed 2026-11-24') && html.includes('<span>Governance</span>') && html.includes('Voters are asking for'), html.slice(0, 160));
        const dr = M.governanceForSystem(L, DREAM);
        r.dream = check(label + 'Dream Reach (default fees): says "default fees (voting not enabled here)", module "not started", no voting, no last vote, no marks',
            dr && dr.group === 'ustur' && dr.feeSrc === 'default fees (voting not enabled here)' && dr.module.text === 'not started' && dr.voting === null && dr.lastVote === null && dr.fees.every(x => !x.changed) && dr.want.length === 0,
            dr && JSON.stringify([dr.feeSrc, dr.module, dr.voting]));
        r.dreamHtml = check(label + 'Dream Reach html: has the default-fees wording and "Crafting fee ... x1.00"', M.governanceHtml(dr).includes('default fees (voting not enabled here)') && /Crafting fee<\/span><span class="n">x1\.00/.test(M.governanceHtml(dr)));
        const none = (L.systems || []).find(s => !(L.gov.systems || {})[s.a]);
        r.noEntry = check(label + 'a system with no gov entry gives null and renders ""', none && M.governanceForSystem(L, none.a) === null && M.governanceHtml(M.governanceForSystem(L, none.a)) === '', none && none.n);
        const ow = M.governanceForOwner(L, OWNER).map(x => x.text);
        r.owner = check(label + 'owner drawer lines: voting power in Izar and contribution to Izar (exact)',
            ow.length === 2 && ow[0] === 'Voting power: 40,000 in Izar' && ow[1] === 'Governance module: contributed 5,100 units to Izar', JSON.stringify(ow));
        r.ownerNone = check(label + 'an owner with no voting power or contribution gets no lines; null / unknown p gets none',
            M.governanceForOwner(L, (L.owners.find(o => o.p && o.p !== OWNER) || {}).p).length === 0 && M.governanceForOwner(L, null).length === 0 && M.governanceForOwner(L, 'nope').length === 0);
        const L2 = clone(L); L2.gov.contributors.push({ p: OWNER, sys: 'UNKNOWN-ADDRESS-0000000000000000', units: 1, lp: 1, rows: 1 });
        const ow2 = M.governanceForOwner(L2, OWNER).map(x => x.text);
        r.ownerUnknown = check(label + 'an unknown system address shows a short address, never "undefined"', ow2.length === 3 && /^Governance module: contributed 1 unit to UNKN.*0000$/.test(ow2[2]) && !BAD.test(ow2[2]), ow2[2]);
    }
    // [3] synthetic: absent / null / empty / null parts
    const base = synth;
    const AD = 'SYN-ADDR-1';
    const absent = clone(base); delete absent.gov;
    const nul = clone(base); nul.gov = null;
    const emptySys = clone(base); emptySys.gov.systems = {};
    let threw = null, outs = [];
    try {
        outs = [M.governanceForSystem(absent, AD), M.governanceForSystem(nul, AD), M.governanceForSystem(emptySys, AD), M.governanceForSystem(null, AD), M.governanceForSystem({}, AD), M.governanceForSystem(base, '__proto__'),
            M.governanceForOwner(absent, 'p1'), M.governanceForOwner(nul, 'p1'), M.governanceForOwner(emptySys, 'p1')];
    } catch (e) { threw = e; }
    r.absent = check(label + 'gov absent / null / systems empty / no latest / "__proto__" address: no throw and nothing built',
        !threw && outs.slice(0, 6).every(x => x === null) && outs.slice(6).every(x => Array.isArray(x) && x.length === 0), threw ? String(threw.stack).split('\n')[0] : JSON.stringify(outs));
    const hole = clone(base);
    Object.assign(hole.gov.systems[AD], { mod: null, ballot: null, want: null, days: [], fees: null, poolRaw: null, power: undefined, voters: null, crew: 'x', lvl: 'x', ctl: 9 });
    delete hole.gov.systems[AD].fees; hole.gov.module = null;
    let t2 = null, v2 = null, h2 = '';
    try { v2 = M.governanceForSystem(hole, AD); h2 = M.governanceHtml(v2); } catch (e) { t2 = e; }
    r.holes = check(label + 'entry with mod / ballot / want / fees / poolRaw null, days [], junk numbers: no throw, a block still renders', !t2 && v2 && h2.includes('Governance'), t2 ? String(t2.stack).split('\n')[0] : h2.slice(0, 100));
    r.holesTok = check(label + 'no "undefined" / "NaN" / "null" / "[object" in any produced string (holes case + every real system)', badTokens([v2, h2]).length === 0, JSON.stringify(badTokens([v2, h2]).slice(0, 3)));
    if (real) {
        const all = Object.keys(real.gov.systems).map(a => M.governanceForSystem(real, a));
        const allHtml = all.map(M.governanceHtml);
        r.allTok = check(label + 'the 36 real systems: no bad token in any value or html', all.length === 36 && badTokens([all, allHtml]).length === 0, all.length + ' ' + JSON.stringify(badTokens([all, allHtml]).slice(0, 3)));
        const mixed = clone(real); mixed.gov.systems[IZAR].mod = null; mixed.gov.systems[IZAR].ballot = null; mixed.gov.systems[IZAR].want = null; mixed.gov.systems[IZAR].days = [];
        let t3 = null, m3 = null; try { m3 = M.governanceHtml(M.governanceForSystem(mixed, IZAR)); } catch (e) { t3 = e; }
        r.realHoles = check(label + 'real Izar with mod / ballot / want nulled and days []: no throw, "not started", no bad token', !t3 && m3.includes('not started') && !BAD.test(m3));
    }
    // [4] synthetic: building module, hostile bill name, changed fees, pool amounts
    const b = clone(base); const e = b.gov.systems[AD];
    e.mod = { inst: 0, at: 0, funded: [1000, 0, 225, 0, 0, 0, 0], need: [2000, 1620, 450, 370, 200, 100, 0], contributors: 2 };
    b.gov.module.bill = [{ id: 1007, q: 2000, n: '<img src=x onerror=1>' }, { id: 1027, q: 1620 }, { id: 1102, q: 450, n: 'Fuel' }, { id: 1016, q: 370, n: 'Ore' }, { id: 1199, q: 200 }, { id: 1243, q: 100 }];
    e.fees = { craft: 15000, mkt: 60, local: 2500, dist: 100 }; e.src = 'generation';
    e.ballot = { status: 2, cutoffDay: 20779, power: 40000, expected: 120000, receipts: 3, winner: { craft: 12000, mkt: 60, local: 2500, dist: 100 } };
    const bv = M.governanceForSystem(b, AD), bh = M.governanceHtml(bv);
    r.build = check(label + 'module being built: 1225 of 4740 = 25 % funded, per-resource list with names (cargo #id fallback)',
        bv.module.text === 'being built: 25 % funded' && bv.module.parts.length === 6 && bv.module.parts[1].name === 'cargo #1027' && bv.module.parts[2].name === 'Fuel' && bv.module.parts[0].funded === 1000, JSON.stringify(bv.module));
    r.fees = check(label + 'changed fees are marked with the default: x1.50 (default x1.00), 0.6 % (default 0 %), "set by votes"',
        bv.feeSrc === 'set by votes' && bv.fees[0].text === 'x1.50' && bv.fees[0].changed && bv.fees[0].def === 'x1.00' && bv.fees[1].text === '0.6 %' && bv.fees[1].changed && bv.fees[1].def === '0 %' && /default x1\.00/.test(bh), JSON.stringify(bv.fees));
    r.outcome = check(label + 'vote outcome line only when the winner differs from the fees in force (craft x1.20)', bv.lastVote.outcome.length === 1 && bv.lastVote.outcome[0].now === 'x1.20' && /Vote outcome/.test(bh) && /40,000 of 120,000/.test(bh), JSON.stringify(bv.lastVote));
    r.escape = check(label + 'hostile bill name comes out escaped in the html (no raw <img, shown as &lt;img)', !/<img/i.test(bh) && bh.includes('&lt;img src=x onerror=1&gt;'), bh.slice(bh.indexOf('c4-gov-parts'), bh.indexOf('c4-gov-parts') + 200));
    const sg = clone(b); sg.gov.systems[AD].src = 'governance';
    const su = clone(b); su.gov.systems[AD].src = 'weird-new-value';
    r.src = check(label + 'src "governance" -> "set by the starbase\'s governance"; an unknown src -> default fees wording, no throw',
        M.governanceForSystem(sg, AD).feeSrc === "set by the starbase's governance" && M.governanceForSystem(su, AD).feeSrc === 'default fees (voting not enabled here)', JSON.stringify([M.governanceForSystem(sg, AD).feeSrc, M.governanceForSystem(su, AD).feeSrc]));
    // pool: absent decimals = no amounts; with decimals only the non-zero ones
    e.poolRaw = { open: 2500000000, vault: 0, dao: 150000000, funded: 0, claimed: 0 };
    const p0 = M.governanceForSystem(b, AD);
    r.poolOff = check(label + 'reward pool amounts hidden while gov.atlasDecimals is absent', p0.pool.length === 0 && !/Reward pool/.test(M.governanceHtml(p0)));
    b.gov.atlasDecimals = 8;
    const p1 = M.governanceForSystem(b, AD), p1h = M.governanceHtml(p1);
    r.poolOn = check(label + 'with atlasDecimals 8: only the non-zero amounts, 25 ATLAS open and 1.5 ATLAS DAO', p1.pool.length === 2 && p1.pool[0].text === '25 ATLAS' && p1.pool[1].text === '1.5 ATLAS' && /Reward pool open/.test(p1h) && !/in the vault/.test(p1h), JSON.stringify(p1.pool));
    const hostile = clone(b); hostile.systems = [{ a: 'S1', n: '<script>x</script>' }]; hostile.gov.contributors = [{ p: 'P<b>', sys: 'S1', units: 2, lp: 1, rows: 1 }]; hostile.gov.voters = { top: [] };
    const hl = M.governanceOwnerHtml(M.governanceForOwner(hostile, 'P<b>'));
    r.ownerEsc = check(label + 'owner lines escape a hostile address / name', hl.includes('&lt;script&gt;') && !/<script/i.test(hl), hl);
    // ---- fix round 2026-11-25 (B2-B4, B6, B8)
    // B8: the owner lines carry a GOVERNANCE heading in the drawer's section style, then two label / value rows
    const oh = clone(base); oh.systems = [{ a: AD, n: 'Synth', x: 0, y: 0 }]; oh.gov.voters = { top: [{ p: 'p1', sys: AD, power: 5, pending: 0, crew: 1 }] }; oh.gov.contributors = [{ p: 'p1', sys: AD, units: 3, lp: 1, rows: 1 }];
    const ohh = M.governanceOwnerHtml(M.governanceForOwner(oh, 'p1'));
    r.ownerHead = check(label + 'B8 owner drawer: "Governance" section heading, then rows "Voting power | 5 in Synth" and "Governance module | contributed 3 units to Synth"',
        ohh.startsWith('<div class="c4-dsec"><span>Governance</span></div><ul class="c4-list c4-gov-own">') && ohh.includes('<li><span class="l">Voting power</span><span class="n">5 in Synth</span></li>') && ohh.includes('<li><span class="l">Governance module</span><span class="n">contributed 3 units to Synth</span></li>'), ohh);
    r.ownerNoHead = check(label + 'B8 positive control: an owner with nothing to show gets no heading at all', M.governanceOwnerHtml(M.governanceForOwner(oh, 'nobody')) === '' && M.governanceOwnerHtml([]) === '');
    // B6: the panel names the faction only (the header already says the starbase level)
    const lvh = M.governanceHtml(M.governanceForSystem(base, AD));
    r.noLevel = check(label + 'B6 system panel: "Controlled by" shows the faction (fc-mud) and no governance level', /Controlled by<\/span><span class="n"><span class="c4-fa fc-mud"><i><\/i>MUD<\/span><\/span>/.test(lvh) && !/level/i.test(lvh), lvh.slice(0, 260));
    // B2: a weighted-mean ask that prints the same as the fees in force is not a difference
    const w1 = clone(base); w1.gov.systems[AD].want = { craft: 10000.4, mkt: 0.2, local: 0, dist: 0 };
    const w2 = clone(base); w2.gov.systems[AD].want = { craft: 15000.4, mkt: 0.2, local: 0, dist: 0 };
    const wv1 = M.governanceForSystem(w1, AD), wv2 = M.governanceForSystem(w2, AD);
    r.wantRound = check(label + 'B2 voters ask for x1.00 / 0 % while exactly that is in force: no "asking for" line; positive control: x1.50 still is one',
        wv1.want.length === 0 && !/Voters are asking for/.test(M.governanceHtml(wv1)) && wv2.want.length === 1 && wv2.want[0].now === 'x1.50' && /Voters are asking for<\/span><span class="n">Crafting fee x1\.50</.test(M.governanceHtml(wv2)), JSON.stringify([wv1.want, wv2.want]));
    // B3: the reference for the "default" marker is the constant a system without voting charges, not policy.defaults
    const d1 = clone(base); d1.gov.policy.defaults = { craft: 11000, mkt: 30, local: 250, dist: 1000 };
    const d2 = clone(d1); d2.gov.policy.constant = { craft: 12000, mkt: 0, local: 0, dist: 0 };
    const dv1 = M.governanceForSystem(d1, AD), dv2 = M.governanceForSystem(d2, AD);
    r.constant = check(label + 'B3 policy.defaults 11000/30/250/1000 but the system charges the constant: no "default" marker; with a stated policy.constant x1.20 the craft fee is marked (default x1.20)',
        dv1.fees.length === 4 && dv1.fees.every(x => !x.changed) && !/default x/.test(M.governanceHtml(dv1)) && dv2.fees[0].changed && dv2.fees[0].def === 'x1.20' && dv2.fees.slice(1).every(x => !x.changed), JSON.stringify([dv1.fees, dv2.fees[0]]));
    // B4: faction by own property: prototype keys give no faction, never a junk class or a throw
    const px = ['__proto__', 'constructor', 'toString', 'hasOwnProperty'].map(k => { const c = clone(base); c.gov.systems[AD].ctl = k; let v = null, h = ''; try { v = M.governanceForSystem(c, AD); h = M.governanceHtml(v); } catch (er) { v = null; } return [v, h]; });
    r.ctlOwn = check(label + 'B4 ctl "__proto__" / "constructor" / "toString" / "hasOwnProperty": no faction, no Controlled-by row, no junk class, block still renders',
        px.every(([v, h]) => v && v.group === null && v.factionLabel === null && !/Controlled by|fc-|function|\[object/.test(h) && h.includes('Governance module')), JSON.stringify(px.map(([v]) => v && v.group)));
    return r;
}

// ------------------------------------------------------------------ data
function synthetic() {
    return {
        systems: [{ a: 'SYN-ADDR-1', n: 'Synth', x: 0, y: 0 }],
        owners: [{ p: 'p1' }],
        gov: {
            at: 1, day: 20779, policy: { defaults: { craft: 10000, mkt: 0, local: 0, dist: 0 } }, module: { minTier: 2, bill: [] },
            systems: { 'SYN-ADDR-1': { ctl: 1, lvl: 2, on: 1, mod: null, fees: { craft: 10000, mkt: 0, local: 0, dist: 0 }, src: 'baseline', power: 0, voters: 0, crew: 0, want: null, poolRaw: null, ballot: null, days: [] } },
            voters: { top: [] }, contributors: []
        }
    };
}
let real = null;
if (fs.existsSync(LATEST) && fs.existsSync(FIXTURE)) {
    real = JSON.parse(fs.readFileSync(LATEST, 'utf8'));
    real.gov = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
} else console.log('SKIP real-data checks: missing ' + (!fs.existsSync(LATEST) ? 'GOV_LATEST ' + LATEST : 'GOV_FIXTURE ' + FIXTURE) + ' (the synthetic checks still run)');

console.log('[1] the model as shipped');
const base = suite(loadModel(), '', real, synthetic());

// ------------------------------------------------------------------ negative cases: one guard removed -> the named check must FAIL
console.log('[2] negative cases (each mutant: the named checks must FAIL while they passed above)');
const NEG = [
    ['no escaping of the bill name (esc removed from the parts row)', s => s.replace('<span class="l">${esc(p.name)}</span>', '<span class="l">${p.name}</span>'), ['escape']],
    ['src "governance" falls to the default wording', s => s.replace("e.src === 'governance' ? \"set by the starbase's governance\" : ", ''), ['src']],
    ['owner lines are not escaped', s => s.replace('<span class="n">${esc(l.n)}</span>', '<span class="n">${l.n}</span>'), ['ownerEsc']],
    ['formatter: 60 bps as a whole percent (rounded)', s => s.replace('String(Math.round(bps) / 100)', 'String(Math.round(bps / 100))'), ['fmt']],
    ['multiple prints the raw bps', s => s.replace("(bps / 10000).toFixed(2)", "(bps / 1000).toFixed(2)"), ['fmt']],
    ['gov absent is not guarded (reads latest.gov.systems directly)', s => s.replace("if (!govObj(gov) || !govOwn(gov.systems, addr)) return null;", "if (!govOwn(gov.systems, addr)) return null;"), ['absent']],
    ['a null mod is not guarded (reads mod.funded directly)', s => s.replace("const funded = mod && Array.isArray(mod.funded) ? mod.funded : [], need = mod && Array.isArray(mod.need) ? mod.need : [];", "const funded = mod.funded, need = mod.need;"), ['holes', 'realHoles']],
    ['non-finite numbers are printed (govNum accepts NaN / undefined)', s => s.replace("const govNum = v => typeof v === 'number' && isFinite(v);", "const govNum = v => true;"), ['fmtBad', 'holesTok']],
    ['the default-fee mark is dropped', s => s.replace("defaults[k] !== f[k] ? govFee(kind, defaults[k]) : null", 'null'), ['fees']],
    ['reward pool shown without the decimals divisor', s => s.replace("if (govNum(gov.atlasDecimals) && gov.atlasDecimals >= 0 && govObj(e.poolRaw))", "if (govObj(e.poolRaw))"), ['poolOff']],
    ['a zero pool amount is listed', s => s.replace("if (!govNum(raw) || raw === 0) continue;", "if (!govNum(raw)) continue;"), ['poolOn']],
    ['an entry-less system still renders a block', s => s.replace("if (!v) return '';", "if (!v) v = { module: { text: 'x', parts: [] }, fees: [], want: [], pool: [] };"), ['noEntry']],
    ['unknown system address is printed as "undefined"', s => s.replace("shortAddr(String(a == null ? '' : a)) || 'an unknown system'", "'undefined'"), ['ownerUnknown']],
    ['outcome line shown even when equal to the fees in force', s => s.replace("if (now === was) continue;", "if (false) continue;"), ['izarLast', 'izarVote']],
    ['B2: the ask is compared as a raw number, not as printed', s => s.replace("if (now === was) continue;", "if (a[k] === b[k]) continue;"), ['wantRound']],
    ['B3: the default marker compares with policy.defaults', s => s.replace("const defaults = gov.policy && govObj(gov.policy.constant) ? gov.policy.constant : GOV_CONSTANT;", "const defaults = gov.policy && govObj(gov.policy.defaults) ? gov.policy.defaults : null;"), ['constant']],
    ['B3: a stated policy.constant is ignored', s => s.replace("govObj(gov.policy.constant) ? gov.policy.constant : GOV_CONSTANT", "false ? 0 : GOV_CONSTANT"), ['constant']],
    ['B4: faction by plain lookup (prototype keys leak)', s => s.replace("govOwn(GOV_CTL, e.ctl) ? GOV_CTL[e.ctl] : null", "GOV_CTL[e.ctl] || null"), ['ctlOwn']],
    ['B6: the governance level is printed again in the panel', s => s.replace("if (v.group) row('Controlled by', `<span class=\"c4-fa fc-${esc(v.group)}\"><i></i>${esc(v.factionLabel)}</span>`);", "if (v.group) row('Controlled by', `<span class=\"c4-fa fc-${esc(v.group)}\"><i></i>${esc(v.factionLabel)}</span> level ${esc(v.level)}`);"), ['noLevel']],
    ['B8: the owner lines have no Governance heading', s => s.replace('<div class="c4-dsec"><span>Governance</span></div><ul class="c4-list c4-gov-own">', '<ul class="c4-list c4-gov-own">'), ['ownerHead']],
    ['B8: the owner lines are one unlabelled text again', s => s.replace('<span class="l">${esc(l.l)}</span><span class="n">${esc(l.n)}</span>', '<span class="l">${esc(l.text)}</span>'), ['ownerHead', 'ownerEsc']],
    ['the chain day is read as unix seconds', s => s.replace("const govDay = day => govNum(day) ? govDate(day * DAY) : null;", "const govDay = day => govNum(day) ? govDate(day) : null;"), ['day', 'izarLast']]
];
for (const [name, mut, names] of NEG) {
    let M, err = null;
    try { M = loadModel(mut); } catch (e) { err = e; }
    if (err) { check('negative "' + name + '": the mutant loaded', false, err.message); continue; }
    // swallow the mutant's own output; only the named checks' verdicts matter
    const log = console.log; const keep = pass, keepF = fail; console.log = () => { };
    let res, threw = null;
    try { res = suite(M, '', real, synthetic()); } catch (e) { threw = e; }
    console.log = log; pass = keep; fail = keepF;
    const unnamed = names.filter(n => base[n] === undefined);
    const stillOk = names.filter(n => base[n] && (threw ? false : res[n] === true));
    // the named checks passed unbroken (base) and at least one of them FAILS (or the suite throws) with the guard removed
    check('negative "' + name + '": passes unbroken, FAILS with the guard removed' + (threw ? ' (suite threw: ' + String(threw.message).slice(0, 60) + ')' : ''),
        (real || names.every(n => !['izar', 'izarVote', 'izarLast', 'noEntry', 'ownerUnknown', 'realHoles', 'day'].includes(n))) && unnamed.length === 0 && names.every(n => base[n] === true) && (threw || stillOk.length < names.length),
        'unbroken ok: ' + names.map(n => n + '=' + base[n]).join(',') + '; still passing with the mutant: ' + stillOk.join(',') + (unnamed.length ? '; not run: ' + unnamed.join(',') : ''));
}
// [3] the Analytics nav label map in app.js covers every section id (a missing id shows the raw lowercase id)
{
    const app = fs.readFileSync(path.join(ROOT, 'C4Live', 'app.js'), 'utf8');
    const m = /const AN_LABEL = \{([^}]*)\}/.exec(app);
    const keys = m ? [...m[1].matchAll(/(\w+):\s*'/g)].map(x => x[1]) : [];
    const secs = require(path.join(ROOT, 'C4Live', 'c4-analytics.js')).sections || [];
    const missing = secs.filter(id => !keys.includes(id));
    check('[3] AN_LABEL covers every C4Analytics.sections id (positive control: "mining" is a key)', keys.includes('mining') && secs.length > 0 && missing.length === 0, 'missing: ' + missing.join(',') + ' of ' + secs.join(','));
    const gone = keys.filter(k => k !== 'governance');
    check('[3] negative: with the governance label removed the coverage check fails', secs.includes('governance') ? secs.filter(id => !gone.includes(id)).length > 0 : true);
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
