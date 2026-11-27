// c4-fleet-view-check.js - C4 Live: the fleet view (one owner's fleets, then one fleet's hero screen), 2026-11-25.
//   node Test/c4-fleet-view-check.js
// Pure checks (no browser) of C4Live/c4-fleet-view.js: the numbers, labels and sections of the stat sheets, ship art
// matching, the owner and fleet models, and the two HTML strings (escaping, old copies of the data, filters, limits).
// [2] re-loads the module with ONE guard removed from its source text and requires the named checks to fail.
// [3] real data: the local read in Data/c4-live/latest.json (env FV_LATEST), read only; skipped with a message when absent.
// [4] the page wiring (index.html, app.js).
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SRC_PATH = path.join(ROOT, 'C4Live', 'c4-fleet-view.js');
const SRC = fs.readFileSync(SRC_PATH, 'utf8');
const LATEST = process.env.FV_LATEST || path.join(ROOT, 'Data', 'c4-live', 'latest.json');
let pass = 0, fail = 0;
function check(name, ok, detail) {
    if (ok) { pass++; console.log('  ok   ' + name); } else { fail++; console.log('  FAIL ' + name + (detail !== undefined ? '  -> ' + detail : '')); }
    return !!ok;
}
function load(mut) {
    let src = SRC;
    if (mut) { const [a, b] = mut; if (src.split(a).length !== 2) throw new Error('mutant anchor occurs ' + (src.split(a).length - 1) + ' times: ' + a.slice(0, 70)); src = src.replace(a, () => b); }
    const module = { exports: {} };
    new Function('module', 'window', src)(module, undefined);
    return module.exports;
}
const BAD = /undefined|NaN|\[object|Infinity|>null<| null /;
const EVIL = '<img src=x onerror=1>';
const P = 'OwnerAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', Q = 'OwnerBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';
const KEYS = ['cargo.ammoCapacity', 'cargo.cargoCapacity', 'cargo.fuelCapacity', 'cargo.miningRate', 'combat.ap', 'combat.counterDecoy', 'combat.counterFlare',
    'combat.damageEnergy', 'combat.damageKinetic', 'combat.damageKineticVariance', 'combat.hp', 'combat.repairRate', 'combat.shieldBreakDelaySeconds', 'combat.sp',
    'misc.requiredCrew', 'misc.scanPower', 'movement.warpSpeed', 'zeta.newThing'];
const row = o => KEYS.map(k => (k in o ? o[k] : 0));
const MANIFEST = {
    'Armstrong IMP': { hero: 'Armstrong_Imp_hero.webp', turn: 'Armstrong_Imp_turn.webp', frames: 12, frameSize: 320, source: 'render' },
    'Armstrong IMP Tap': { hero: 'Armstrong_IMP_Tap_store.webp', turn: null, frames: 0, source: 'store' },
    'Pearce X4': { hero: 'Pearce_X4_hero.webp', turn: 'Pearce_X4_turn.webp', frames: 12, source: 'render' },
    'Starbase - Tier 0': null,
    'Bad Path': { hero: '../secret.webp' }, 'Bad Host': { hero: 'https://example.invalid/x.webp' }, 'Bad Type': { hero: 'x.png' },
    'Bad Turn': { hero: 'ok.webp', turn: 'ok_turn.webp', frames: 9999 }
};
function synthetic() {
    const fleet = (a, n, o, kind, ships, extra) => Object.assign({ a, n, o, fa: 'mud', npc: 0, s: { kind }, x: 1.26, y: -2.5, hp: 50, hpMax: 100, sp: 30, spMax: 60, ships,
        size: { small: ships }, types: { 'Pearce X4 Default Config': ships }, flag: 'Pearce X4 Default Config', flagSize: 'small', crew: ships * 2, mineRate: 0, cargo: 10, cargoCap: 40, lc: 0, lu: 5 }, extra || {});
    return {
        v: 1, generatedAt: 1000, statKeys: KEYS.slice(),
        shipDefs: { 'Pearce X4 Default Config': { sz: 'small', seq: 7, st: row({ 'combat.hp': 100, 'combat.sp': 60, 'combat.damageKinetic': 12, 'movement.warpSpeed': 0.0330047607421875 }) },
            ['Evil ' + EVIL + ' Config']: { sz: 'medium', seq: 7, st: row({ 'combat.hp': 9 }) } },
        systems: [{ a: 'SysA', n: 'Haven ' + EVIL }], asteroids: [{ a: 'AstA', sysName: 'Belt ' + EVIL }],
        fleets: [
            fleet('F1', 'Alpha', P, 'idle', 1, { st: row({ 'cargo.ammoCapacity': 500, 'cargo.cargoCapacity': 40, 'cargo.fuelCapacity': 200, 'combat.ap': 8, 'combat.hp': 100, 'combat.sp': 60, 'combat.damageKinetic': 40, 'combat.damageEnergy': 10,
                'combat.damageKineticVariance': 80, 'combat.shieldBreakDelaySeconds': 20, 'combat.repairRate': 3, 'misc.requiredCrew': 2, 'misc.scanPower': 480, 'movement.warpSpeed': 0.001708984375, 'zeta.newThing': 5 }),
                ap: 4, fuel: 50, ammo: 0, stance: 'light', pend: 3, rent: 2, hold: [{ n: 'Food', q: 7 }, { n: EVIL, q: 2 }, { n: 'Gone', q: 0 }, null] }),
            fleet('F2', 'Big ' + EVIL, P, 'mining', 5, { hpMax: 900, hp: 900, s: { kind: 'mining', asteroid: 'AstA', resources: ['Hydrogen', EVIL] }, mine: { ups: 12.5 },
                types: { 'Pearce X4 Default Config': 2, ['Evil ' + EVIL + ' Config']: 3, 'constructor': 1 }, flag: 'Evil ' + EVIL + ' Config', st: row({ 'combat.hp': 900, 'combat.ap': 20 }), ap: 20, fuel: 1, ammo: 1 }),
            fleet('F3', 'Old copy', P, 'docked', 3, { s: { kind: 'docked', system: 'SysA' }, types: { 'Armstrong IMP Tap Default Config': 3 }, flag: 'Armstrong IMP Tap Default Config', x: null }),
            fleet('F4', 'Not mine', Q, 'warp', 9, { s: { kind: 'warp', from: [0, 0], to: [3, 4] } })
        ]
    };
}

function suite(F, tag) {
    const R = {}, ok = (k, name, cond, detail) => { R[k] = check(tag + name, cond, detail); };
    const art = F.artIndex(MANIFEST), L = synthetic();
    // ---- numbers and labels
    const fm = [F.fmtN(1234567), F.fmtN(0.001708984375), F.fmtN(4.40625), F.fmtN(1234.56), F.fmtN(NaN), F.fmtN(2.5), F.fmtN(100), F.fmtN(66.157, 1), F.fmtN(-1500), F.fmtN(0)];
    ok('fmt', 'numbers: thousands separators, short fractions, a dash for a missing value', fm.join('|') === '1,234,567|0.00171|4.41|1,234.6|-|2.5|100|66.2|-1,500|0', fm.join('|'));
    const lb = ['combat.shieldBreakDelaySeconds', 'combat.damageKinetic', 'combat.damageGraygooVariance', 'combat.counterNegativeRemPlating', 'combat.hp', 'movement.maxWarpDistance', 'misc.scanCoolDownSeconds'].map(F.label);
    ok('label', 'labels read as words', lb.join('|') === 'Shield break delay|Kinetic damage|Gray goo damage variance|Negative rem plating|Hull points|Max warp distance|Scan cool down', lb.join('|'));
    ok('unit', 'a stat named ...Seconds is shown in seconds, others carry no unit', F.unitOf('combat.shieldBreakDelaySeconds') === ' s' && F.unitOf('combat.hp') === '');
    // ---- stat dict + sections
    ok('dictLen', 'a stat row that does not match the key list in length is not used', F.statDict(KEYS, [1, 2, 3]) === null && F.statDict(null, [1]) === null && F.statDict(KEYS, null) === null && F.statDict(KEYS, row({ 'combat.hp': 4 }))['combat.hp'] === 4);
    const d1 = F.statDict(KEYS, L.fleets[0].st), secs = F.statSections(d1), sec = id => secs.find(s => s.id === id);
    ok('secOrder', 'sections come in a fixed order and an unknown group lands in Other', secs.map(s => s.id).join() === 'combat,damage,counter,repair,movement,cargo,scan,crew,other' && sec('other').rows[0].label === 'New thing', secs.map(s => s.id).join());
    ok('zeroHidden', 'damage and countermeasure stats at zero are left out; an empty section says so', sec('counter').rows.length === 0 && /No countermeasure/.test(sec('counter').empty) && sec('damage').rows.length === 3 && sec('cargo').rows.some(r => r.key === 'cargo.miningRate' && r.text === '0'), JSON.stringify(sec('damage').rows.map(r => r.key)));
    const dk = sec('damage').rows.find(r => r.key === 'combat.damageKinetic'), de = sec('damage').rows.find(r => r.key === 'combat.damageEnergy'), dv = sec('damage').rows.find(r => r.key === 'combat.damageKineticVariance');
    ok('dmgBar', 'damage bars are scaled to the largest damage type; a variance row has no bar', dk.bar === 100 && de.bar === 25 && dv.bar === undefined, [dk.bar, de.bar, dv.bar].join());
    ok('secText', 'a seconds stat prints its unit; a small fraction stays readable', sec('combat').rows.find(r => r.key === 'combat.shieldBreakDelaySeconds').text === '20 s' && sec('movement').rows[0].text === '0.00171');
    // ---- art
    const a1 = F.shipArt(art, 'Armstrong IMP Tap Mining Min Config'), a2 = F.shipArt(art, 'Armstrong IMP Default Config'), a3 = F.shipArt(art, 'Armstrong IMPX Default Config');
    ok('artLongest', 'a config matches the LONGEST hull name it starts with', !!a1 && a1.name === 'Armstrong IMP Tap' && !!a2 && a2.name === 'Armstrong IMP', a1 && a1.name);
    ok('artWord', 'a hull name must match on a whole word', a3 === null && F.shipArt(art, '') === null && F.shipArt(null, 'Pearce X4') === null);
    ok('artFile', 'only plain .webp file names are taken from the manifest', art.length === 4 && !art.some(a => /Bad (Path|Host|Type)/.test(a.name)) && art.find(a => a.name === 'Bad Turn').turn === null && a2.turn.frames === 12 && a1.turn === null && a1.store === true, art.map(a => a.name).join());
    const hn = [F.hullName('Armstrong IMP Tap Mining Min Config', art), F.hullName('Pearce X4 Default Config', art), F.hullName('Unknown Hull Default Config', art), F.hullName('Unknown Hull Tier Five Config', null)];
    ok('hullName', 'a config name splits into hull and variant', hn.map(h => h.base + '/' + h.variant).join('|') === 'Armstrong IMP Tap/Mining Min|Pearce X4/|Unknown Hull/|Unknown Hull Tier Five/', hn.map(h => h.base + '/' + h.variant).join('|'));
    // ---- owner model
    const m = F.buildOwner(L, P, art);
    ok('ownerOnly', 'only this owner\'s fleets are listed', m.fleets.length === 3 && m.fleets.every(f => f.owner === P) && F.buildOwner(L, 'nobody', art).fleets.length === 0);
    ok('ownerSort', 'fleets run largest first', m.fleets.map(f => f.a).join() === 'F2,F3,F1', m.fleets.map(f => f.a).join());
    ok('ownerTotals', 'totals add up the fleets', m.totals.fleets === 3 && m.totals.ships === 9 && m.totals.crew === 18 && m.totals.hull === 1100 && m.totals.shield === 180 && m.totals.cargoCap === 120 && m.totals.ups === 12.5, JSON.stringify(m.totals));
    ok('ownerStates', 'states are counted', m.states.map(s => s.kind + s.n).sort().join() === 'docked1,idle1,mining1' && m.fa === 'mud' && m.hasStats === true);
    // ---- fleet model
    const f1 = m.fleets.find(f => f.a === 'F1'), f2 = m.fleets.find(f => f.a === 'F2'), f3 = m.fleets.find(f => f.a === 'F3');
    const g = (f, id) => f.gauges.find(x => x.id === id);
    ok('gauges', 'gauges: hull, shield, action points, cargo, fuel, ammunition with their maxima from the chain stats', f1.gauges.map(x => x.id).join() === 'hull,shield,ap,cargo,fuel,ammo' && g(f1, 'ap').max === 8 && g(f1, 'ap').p === 50 && g(f1, 'fuel').max === 200 && g(f1, 'fuel').p === 25 && g(f1, 'ammo').p === 0 && g(f1, 'hull').p === 50, JSON.stringify(f1.gauges));
    ok('oldGauges', 'a fleet read before the stats existed keeps hull, shield and cargo only and has no stat sheet', f3.gauges.map(x => x.id).join() === 'hull,shield,cargo' && f3.hasStats === false && f3.sections.length === 0, f3.gauges.map(x => x.id).join());
    ok('hold', 'the hold lists only what is there', f1.hold.length === 2 && f1.hold[0].n === 'Food' && f1.hold[0].q === 7);
    ok('comp', 'ship models run most numerous first; a model without a stat sheet has none', f2.comp.map(c => c.qty).join() === '3,2,1' && f2.comp[1].stats['combat.hp'] === 100 && f2.comp[1].size === 'small' && f2.comp[2].stats === null && f2.comp[2].size === '', JSON.stringify(f2.comp.map(c => [c.config, c.qty, !!c.stats])));
    ok('where', 'the place line: docked at a system, mining in a system, a flight, a point', f3.where === 'Docked at Haven ' + EVIL && f2.where === 'Mining Hydrogen, ' + EVIL + ' in Belt ' + EVIL && f1.where === 'Idle at 1.3, -2.5' && F.buildOwner(L, Q, art).fleets[0].where === 'In warp to 3.0, 4.0, from 0.0, 0.0', [f1.where, f2.where, f3.where].join(' | '));
    const Lk = synthetic(); Lk.fleets[0].s = { kind: 'idle fv-ghost" data-x="1' }; Lk.fleets[1].s = null;
    const mk = F.buildOwner(Lk, P, art), hk = F.htmlOwner(mk, {}) + mk.fleets.map(f => F.htmlFleet(f, {})).join('');
    ok('kindClass', 'a state that is not a plain word is shown as unknown and never becomes a class name', mk.fleets.filter(f => f.kind === 'unknown').length === 2 && !hk.includes('fv-ghost') && !hk.includes('data-x=') && hk.includes('fv-card s-unknown'), mk.fleets.map(f => f.kind).join());
    const Lc = synthetic(); Lc.fleets[0].s = { kind: 'constructor' }; Lc.fleets[0].flagSize = 'toString'; Lc.fleets[0].fa = 'valueOf';
    const mc = F.buildOwner(Lc, P, art), fc = mc.fleets.find(f => f.a === 'F1'), hc = F.htmlOwner(mc, {}) + F.htmlFleet(fc, {});
    ok('protoWords', 'a state, size or faction named like a built-in property is plain text, never a function printed on the page', fc.stateLabel === 'Constructor' && fc.where === 'Constructor at 1.3, -2.5' && fc.fa === 'unaligned' && !/native code|function/.test(hc) && hc.includes('flagship class toString'), [fc.stateLabel, fc.where, fc.fa].join(' | '));
    // hostile text in the places the first data set leaves clean: a variant of a known hull, a size class, the ammunition
    // use, a stat name, a fleet address
    const Lh = synthetic(); Lh.statKeys = KEYS.concat(['combat.z' + EVIL]); Lh.fleets.forEach(f => { if (f.st) f.st = f.st.concat([7]); });
    Object.values(Lh.shipDefs).forEach(d => { d.st = d.st.concat([7]); });
    const HV = 'Pearce X4 ' + EVIL + ' Config'; Lh.shipDefs[HV] = { sz: EVIL, seq: 7, st: row({ 'combat.hp': 5 }).concat([7]) };
    Object.assign(Lh.fleets[0], { a: 'F1' + EVIL, types: { [HV]: 2 }, flag: HV, flagSize: EVIL, stance: EVIL });
    const mh = F.buildOwner(Lh, P, art), fh = mh.fleets.find(f => f.a === 'F1' + EVIL), hhO = F.htmlOwner(mh, { artBase: 'art/' }), hhF = F.htmlFleet(fh, { artBase: 'art/' });
    const X = '&lt;img src=x onerror=1&gt;';
    ok('escMore', 'hostile variant, size class, ammunition use, stat name and fleet address are escaped wherever they are printed', fh.comp[0].variant === EVIL && !hhO.includes('<img src=x') && !hhF.includes('<img src=x') &&
        hhO.includes('Pearce X4 <em>' + X + '</em>') && hhO.includes('data-fv-fleet="F1' + X + '"') && hhF.includes('data-fv-a="F1' + X + '"') && hhF.includes('<em>' + X + '</em><small>' + X + '</small>') &&
        hhF.includes('class="fv-flag">Pearce X4 <em>' + X + '</em>') && hhF.includes('flagship class ' + X + ' &middot; ammunition use ' + X) && hhF.includes('<span>Z' + X + '</span><b>7</b>') && /aria-label="Pearce X4, drag to rotate"/.test(hhF),
        (hhO + hhF).match(/.{50}<img src=x.{20}/) || [fh.comp[0].variant]);
    ok('missile', 'a missile fire rate is a combat stat; only damage figures scale the damage bars', F.sectionOf('combat.missileFireRate') === 'combat' && F.sectionOf('combat.missileDamage') === 'damage' && F.sectionOf('combat.damageBomb') === 'damage');
    // ---- the visitor's own (2026-11-26): the view gets a plain boolean, a mine fleet and its owner get the "You" tag and c4-me
    {
        const YOU = '<i class="c4-me-tag">You</i>';
        const oY = F.htmlOwner(m, { artBase: 'art/', ownerName: 'Pat', mine: true }), oN = F.htmlOwner(m, { artBase: 'art/', ownerName: 'Pat', mine: false }), oU = F.htmlOwner(m, { artBase: 'art/', ownerName: 'Pat' });
        const hY = F.htmlFleet(f1, { artBase: 'art/', ownerName: 'Pat', mine: true }), hN = F.htmlFleet(f1, { artBase: 'art/', ownerName: 'Pat', mine: false });
        ok('mineOwner', 'a mine owner page carries the You tag, c4-me on the title and fv-mine; a not-mine and an unset one carry none', oY.includes('class="fv-h c4-me" id="c4FvTitle">Pat' + YOU + '</h2>') && /class="fv-page fv-owner fv-mine"/.test(oY) &&
            !/c4-me|fv-mine|You/.test(oN) && !/c4-me|fv-mine|You/.test(oU), oY.match(/.{40}c4FvTitle.{50}/) || 'no title');
        ok('mineFleet', 'a mine fleet screen says so beside the owner name; a not-mine fleet screen does not', hY.includes('class="fv-kind c4-me">Fleet of Pat' + YOU + '</div>') && /class="fv-page fv-hero fv-mine"/.test(hY) && !/c4-me|fv-mine|You/.test(hN));
        ok('mineEsc', 'the owner name next to the tag is still escaped', F.htmlFleet(f1, { ownerName: EVIL, mine: true }).includes('Fleet of ' + '&lt;img src=x onerror=1&gt;' + YOU) && !F.htmlFleet(f1, { ownerName: EVIL, mine: true }).includes('<img src=x'));
    }
    // ---- owner html
    const hO =F.htmlOwner(m, { artBase: 'art/', ownerName: 'Player ' + EVIL });
    const cards = [...hO.matchAll(/data-fv-fleet="([^"]*)"/g)].map(x => x[1]);
    ok('cards', 'one card per fleet, in model order', cards.join() === 'F2,F3,F1', cards.join());
    ok('escOwner', 'the list escapes every chain string (fleet name, ship name, place, owner name)', !hO.includes('<img src=x') && hO.includes('Big &lt;img src=x onerror=1&gt;') && hO.includes('Player &lt;img') && hO.includes('in Belt &lt;img') && hO.includes('Evil &lt;img'), (hO.match(/.{30}<img src=x.{20}/) || [''])[0]);
    ok('cleanOwner', 'no "undefined", "NaN" or "[object" is printed in the list', !BAD.test(hO), (hO.match(/.{40}(undefined|NaN|\[object|Infinity|>null<| null ).{20}/) || [''])[0]);
    ok('countAttr', 'each total carries the number it counts up to', /<span>Ships<\/span><b data-count="9">9<\/b>/.test(hO) && /<span>Hull<\/span><b data-count="1100">1,100<\/b>/.test(hO) && /<span>Mining u\/s<\/span><b data-count="12\.5">12\.5<\/b>/.test(hO));
    ok('cardArt', 'a card shows the flagship picture, or initials when there is none', hO.includes('src="art/Armstrong_IMP_Tap_store.webp"') && hO.includes('src="art/Pearce_X4_hero.webp"') && /fv-noart" aria-hidden="true">EIS</.test(hO), (hO.match(/fv-noart[^<]*<\/span>/) || [''])[0]);
    ok('noStaleNote', 'with stats read, the list has no refresh note', !/Refresh to read/.test(hO));
    const Lold = synthetic(); delete Lold.statKeys; delete Lold.shipDefs; Lold.fleets.forEach(f => { delete f.st; });
    const mOld = F.buildOwner(Lold, P, art), hOld = F.htmlOwner(mOld, {});
    ok('staleNote', 'a copy of the data without ship stats says to refresh, and still lists every fleet', /Ship stats have not been read in this copy of the data\. Refresh to read them\./.test(hOld) && (hOld.match(/data-fv-fleet=/g) || []).length === 3 && !BAD.test(hOld) && mOld.hasStats === false);
    const hMin = F.htmlOwner(m, { state: 'mining' });
    ok('stateFilter', 'a state chip keeps only the fleets in that state and is marked pressed', (hMin.match(/data-fv-fleet=/g) || []).length === 1 && hMin.includes('data-fv-fleet="F2"') && /class="fv-chip on" data-fv-state="mining" aria-pressed="true"/.test(hMin) && /data-fv-state="all" aria-pressed="false"/.test(hMin) && /data-fv-state="all" aria-pressed="true"/.test(hO));
    ok('stateNone', 'a state with no fleet says so', /No fleet of this owner is in that state/.test(F.htmlOwner(m, { state: 'warp' })) && /owns no fleet in the latest read/.test(F.htmlOwner(F.buildOwner(L, 'nobody', art), {})));
    const Lbig = synthetic(); for (let i = 0; i < 67; i++) Lbig.fleets.push(Object.assign({}, Lbig.fleets[0], { a: 'X' + i, n: 'x' + i }));
    const mBig = F.buildOwner(Lbig, P, art), hBig = F.htmlOwner(mBig, {}), hBig2 = F.htmlOwner(mBig, { limit: 120 });
    ok('limit', 'a long list shows the first 60 cards and a button for the rest', mBig.fleets.length === 70 && (hBig.match(/data-fv-fleet=/g) || []).length === 60 && /data-fv-more>Show 10 more of 10</.test(hBig) && (hBig2.match(/data-fv-fleet=/g) || []).length === 70 && !/data-fv-more/.test(hBig2));
    // ---- hero html
    const h1 = F.htmlFleet(f1, { artBase: 'art/', ownerName: 'Player', index: 1, count: 3 }), h2 = F.htmlFleet(f2, { artBase: 'art/', ownerName: EVIL, index: 0, count: 3 }), h3 = F.htmlFleet(f3, { artBase: 'art/', index: 2, count: 3, canFly: true });
    ok('escHero', 'the hero screen escapes every chain string (fleet, owner, ship models, place, cargo)', ![h1, h2, h3].some(h => h.includes('<img src=x')) && h2.includes('<h2 class="fv-h" id="c4FvTitle">Big &lt;img src=x onerror=1&gt;</h2>') && h2.includes('Fleet of &lt;img') && h1.includes('<span>&lt;img src=x onerror=1&gt;</span><b>2</b>') && h3.includes('Docked at Haven &lt;img') && h2.includes('title="Evil &lt;img src=x onerror=1&gt; Config"'));
    ok('cleanHero', 'no "undefined", "NaN" or "[object" is printed on a hero screen', ![h1, h2, h3].some(h => BAD.test(h)), ([h1, h2, h3].join('').match(/.{40}(undefined|NaN|\[object|Infinity|>null<| null ).{20}/) || [''])[0]);
    ok('turn', 'a hull with a turntable strip gets the turntable, sized to its frames; others get the still picture', /data-fv-turn data-frames="12" style="background-image:url\('art\/Pearce_X4_turn\.webp'\);background-size:1200% 100%"/.test(h1) && /Drag the ship to rotate it/.test(h1) && !/data-fv-turn/.test(h3) && /class="fv-hero-img fv-store" src="art\/Armstrong_IMP_Tap_store\.webp"/.test(h3) && !/Drag the ship/.test(h3));
    ok('rings', 'a gauge prints its share, its value and its maximum', /r-ap[^]*?data-count="50" data-suffix="%">50%<\/b>[^]*?Action points<\/span><span class="fv-ring-n">4 \/ 8</.test(h1) && /stroke-dashoffset="75\.00"/.test(h1) && (h1.match(/class="fv-ring /g) || []).length === 6 && (h3.match(/class="fv-ring /g) || []).length === 3);
    ok('sheet', 'the fleet stat sheet lists every section and the cargo hold', ['Combat', 'Damage', 'Countermeasures', 'Repair', 'Movement', 'Cargo and mining', 'Scanning', 'Crew and recovery', 'Other', 'Cargo hold'].every(t => h1.includes('<h4>' + t + '</h4>')) && h1.includes('<span>Kinetic damage</span><b>40</b><i class="fv-row-bar"><i style="width:100.0%">') && h1.includes('<span>Shield break delay</span><b>20 s</b>'));
    ok('shipSheet', 'each ship model has its own stat sheet for one ship; a model without one says so', /x2<\/span><\/div><details class="fv-ship-d"><summary>Stats of one ship<\/summary>/.test(h2) && h2.includes('<span>Hull points</span><b>100</b>') && /No stat sheet was read for this model/.test(h2) && /Stats not read in this copy of the data/.test(h3));
    ok('oldHero', 'a fleet from a copy without stats says to refresh instead of printing an empty sheet', /Ship stats have not been read in this copy of the data\. Refresh to read them\./.test(h3) && !/<h4>Combat<\/h4>/.test(h3));
    ok('nav', 'the hero screen shows which fleet this is and steps to the next', /data-fv-nav="-1"[^>]*>&lsaquo;<\/button><span>2 \/ 3<\/span>/.test(h1) && !/data-fv-nav/.test(F.htmlFleet(f1, {})));
    ok('fly', 'Fly to fleet is off without a position or without the map', /data-fv-fly>Fly to fleet/.test(h1) && /data-fv-fly disabled/.test(h3) && /data-fv-fly disabled/.test(F.htmlFleet(f1, { canFly: false })));
    ok('facts', 'the fact line lists ships, crew, flagship class, ammunition use, rented crew and pending hull', /1 ship &middot; 2 crew &middot; flagship class Small &middot; ammunition use light &middot; 2 rented crew &middot; 3 hull pending</.test(h1), (h1.match(/fv-facts">[^<]*/) || [''])[0]);
    return R;
}

console.log('[1] fleet view: model and HTML');
const base = suite(load(null), '');

console.log('[2] negative cases (each mutant: the named checks must FAIL while they passed above)');
const NEG = [
    ['card fleet name not escaped', ["<b class=\"fv-card-n\">' + esc(f.name)", "<b class=\"fv-card-n\">' + f.name"], ['escOwner']],
    ['card ship name not escaped', ["'x</b> ' + esc(c.base)", "'x</b> ' + c.base"], ['escOwner']],
    ['card place not escaped', ["'<span class=\"fv-card-foot\"><span>' + esc(f.where)", "'<span class=\"fv-card-foot\"><span>' + f.where"], ['escOwner']],
    ['owner name not escaped in the list', ["id=\"c4FvTitle\">' + esc(who) + meTag(o.mine) + '</h2></div>'", "id=\"c4FvTitle\">' + who + meTag(o.mine) + '</h2></div>'"], ['escOwner']],
    ['the owner page never says You', ["esc(who) + meTag(o.mine) + '</h2></div>'", "esc(who) + '</h2></div>'"], ['mineOwner']],
    ['the fleet screen never says You', ["'\">Fleet of ' + esc(who) + meTag(o.mine) + '</div>", "'\">Fleet of ' + esc(who) + '</div>"], ['mineFleet', 'mineEsc']],
    ['every owner is marked as mine', ["function meTag(on) { return on ?", "function meTag(on) { return true ?"], ['mineOwner', 'mineFleet']],
    ['hero fleet name not escaped', ["id=\"c4FvTitle\">' + esc(f.name)", "id=\"c4FvTitle\">' + f.name"], ['escHero']],
    ['hero place not escaped', ["'<p class=\"fv-where\">' + esc(f.where)", "'<p class=\"fv-where\">' + f.where"], ['escHero']],
    ['cargo name not escaped', ["return '<div class=\"fv-row\"><span>' + esc(h.n)", "return '<div class=\"fv-row\"><span>' + h.n"], ['escHero']],
    ['ship model tooltip not escaped', ["'<div class=\"fv-ship-t\"><b title=\"' + esc(c.config)", "'<div class=\"fv-ship-t\"><b title=\"' + c.config"], ['escHero']],
    ['every fleet listed, whoever owns it', ["return obj(f) && f.o === p; }", "return obj(f); }"], ['ownerOnly', 'ownerTotals']],
    ['fleets left in the order read', ["fleets.sort(function (a, b) { return b.ships - a.ships ||", "fleets.sort(function (a, b) { return 0 ||"], ['ownerSort', 'cards']],
    ['a stat row of the wrong length is used', ["!keys.length || keys.length !== row.length) return null;", "!keys.length) return null;"], ['dictLen']],
    ['zero damage and countermeasure rows kept', ["if (HIDE_ZERO[id] && !v) { by[id] = by[id] || []; return; }", ""], ['zeroHidden']],
    ['hull name matched on a part of a word', ["n.indexOf(list[i].n + ' ') === 0", "n.indexOf(list[i].n) === 0"], ['artWord']],
    ['hull names not tried longest first', ["out.sort(function (a, b) { return b.n.length - a.n.length ||", "out.sort(function (a, b) { return 0 ||"], ['artLongest', 'hullName']],
    ['any file path taken from the manifest', ["if (!e || !FILE_RE.test(str(e.hero))) return;", "if (!e || !str(e.hero)) return;"], ['artFile']],
    ['the card limit is ignored', ["var cards = list.slice(0, limit).map(", "var cards = list.slice(0).map("], ['limit']],
    ['the state filter is ignored', ["var list = state ? model.fleets.filter(function (f) { return f.kind === state; }) : model.fleets;", "var list = model.fleets;"], ['stateFilter', 'stateNone']],
    ['no refresh note on an old copy', ["var stale = model.fleets.length && !model.hasStats ?", "var stale = false ?"], ['staleNote']],
    ['gauges drawn without the chain stats', ["if (d && fin(f.ap)) gauges.push(", "if (fin(f.ap)) gauges.push("], ['oldGauges', 'gauges']],
    ['Fly to fleet always on', ["var canFly = f.x != null && f.y != null && o.canFly !== false;", "var canFly = true;"], ['fly']],
    ['empty cargo lines kept', ["return obj(h) && fin(h.q) && h.q > 0; }", "return obj(h); }"], ['hold', 'cleanHero']],
    ['seconds printed without a unit', ["return /Seconds$/.test(String(key)) ? ' s' : '';", "return '';"], ['unit', 'secText', 'sheet']],
    ['variance rows scale the damage bars', ["rows.forEach(function (r) { if (!/Variance$/.test(r.key) && r.v > mx) mx = r.v; });", "rows.forEach(function (r) { if (r.v > mx) mx = r.v; });"], ['dmgBar', 'sheet']],
    ['an old fleet prints an empty stat sheet', ["var stats = f.hasStats ? '<div class=\"fv-secs\">'", "var stats = true ? '<div class=\"fv-secs\">'"], ['oldHero']],
    ['any state text becomes a class name', ["if (!/^[A-Za-z][A-Za-z0-9]*$/.test(kind)) kind = 'unknown';", "if (!kind) kind = 'unknown';"], ['kindClass']],
    ['lookup tables inherit from Object', ["function tbl(o) { var t = Object.create(null);", "function tbl(o) { var t = {};"], ['protoWords']],
    ['card variant not escaped', ["(c.variant ? ' <em>' + esc(c.variant) + '</em>' : '') + '</span>'; }).join('')", "(c.variant ? ' <em>' + c.variant + '</em>' : '') + '</span>'; }).join('')"], ['escMore']],
    ['card fleet address not escaped', ["data-fv-fleet=\"' + esc(f.a) + '\" style=", "data-fv-fleet=\"' + f.a + '\" style="], ['escMore']],
    ['hero ship variant not escaped', ["(c.variant ? '<em>' + esc(c.variant) + '</em>' : '') + '<small>'", "(c.variant ? '<em>' + c.variant + '</em>' : '') + '<small>'"], ['escMore']],
    ['hero size class not escaped', ["'<small>' + esc(SIZE_LABEL[c.size] || c.size || '') + '</small></div>'", "'<small>' + (SIZE_LABEL[c.size] || c.size || '') + '</small></div>'"], ['escMore']],
    ['hero flagship variant not escaped', ["(f.flagName.variant ? ' <em>' + esc(f.flagName.variant) + '</em>' : '')", "(f.flagName.variant ? ' <em>' + f.flagName.variant + '</em>' : '')"], ['escMore']],
    ['fact line not escaped', ["facts.map(esc).join(' &middot; ')", "facts.join(' &middot; ')"], ['escMore']],
    ['stat name not escaped', ["return '<div class=\"fv-row\"><span>' + esc(r.label)", "return '<div class=\"fv-row\"><span>' + r.label"], ['escMore']],
    ['hero fleet address not escaped', ["data-fv-a=\"' + esc(f.a) + '\">'", "data-fv-a=\"' + f.a + '\">'"], ['escMore']],
    ['a fire rate scales the damage bars', ["if (/^damage|^missileDamage/.test(k)) return 'damage';", "if (/^damage|^missile/.test(k)) return 'damage';"], ['missile']],
    ['the turntable strip is not sized to its frames', ["background-size:' + a.turn.frames * 100 + '% 100%\"", "background-size:100% 100%\""], ['turn']],
];
for (const [name, mut, names] of NEG) {
    let F, err = null;
    try { F = load(mut); } catch (e) { err = e; }
    if (err) { check('negative "' + name + '": the mutant loaded', false, err.message); continue; }
    const log = console.log, keep = pass, keepF = fail; console.log = () => { };
    let res = {}, threw = null;
    try { res = suite(F, ''); } catch (e) { threw = e; }
    console.log = log; pass = keep; fail = keepF;
    const stillOk = names.filter(n => !threw && res[n] === true);
    check('negative "' + name + '": passes unbroken, FAILS with the guard removed' + (threw ? ' (suite threw)' : ''),
        names.every(n => base[n] === true) && (threw || stillOk.length < names.length), 'unbroken: ' + names.map(n => n + '=' + base[n]).join(',') + '; still passing: ' + stillOk.join(','));
}

console.log('[3] real data');
if (!fs.existsSync(LATEST)) console.log('  skip (no ' + path.relative(ROOT, LATEST) + ')');
else {
    const F = load(null), L = JSON.parse(fs.readFileSync(LATEST, 'utf8'));
    const art = F.artIndex(JSON.parse(fs.readFileSync(path.join(ROOT, 'Images', 'ships', 'manifest.json'), 'utf8')));
    const owners = (L.owners || []).filter(o => o && o.p);
    let bad = [], mismatch = [], cardsOff = [], heroes = 0, noArt = new Set(), files = new Set();
    for (const o of owners) {
        const m = F.buildOwner(L, o.p, art), h = F.htmlOwner(m, { artBase: 'a/', ownerName: o.name });
        if (BAD.test(h)) bad.push('list ' + o.p);
        // independent figure: the collector's own per-owner roll-up (owners[].fleets / .ships)
        if (m.totals.fleets !== o.fleets || m.totals.ships !== o.ships) mismatch.push(o.p + ' ' + m.totals.fleets + '/' + o.fleets + ' ' + m.totals.ships + '/' + o.ships);
        if ((h.match(/data-fv-fleet=/g) || []).length !== Math.min(m.fleets.length, F.CARD_LIMIT)) cardsOff.push(o.p);
        for (const f of m.fleets.slice(0, 80)) { const hh = F.htmlFleet(f, { artBase: 'a/', ownerName: o.name, index: 0, count: m.fleets.length }); heroes++; if (BAD.test(hh)) bad.push('hero ' + f.a); f.comp.forEach(c => { if (!c.art) noArt.add(c.config); else files.add(c.art.hero); }); }
    }
    check('[3] positive control: the read has owners and fleets', owners.length > 0 && (L.fleets || []).length > 0, owners.length + ' owners');
    check('[3] every owner\'s list and every hero screen (' + heroes + ') prints no "undefined" / "NaN" / "[object"', bad.length === 0, bad.slice(0, 3).join('; '));
    check('[3] fleets and ships per owner equal the collector\'s own owner roll-up', mismatch.length === 0, mismatch.slice(0, 3).join('; '));
    check('[3] cards drawn = fleets of the owner (up to the limit)', cardsOff.length === 0, cardsOff.slice(0, 3).join('; '));
    const missing = [...files].filter(f => !fs.existsSync(path.join(ROOT, 'Images', 'ships', f)));
    check('[3] every picture a ship model points at exists in Images/ships (' + files.size + ' files)', files.size > 0 && missing.length === 0, missing.join(','));
    console.log('  note ship models without a picture: ' + (noArt.size ? [...noArt].join(', ') : 'none'));
    if (Array.isArray(L.statKeys)) {
        const withSt = L.fleets.filter(f => Array.isArray(f.st)), i = L.statKeys.indexOf('combat.hp');
        check('[3] stats: every fleet row is as long as the key list and its hull maximum equals the fleet\'s hpMax', withSt.length === L.fleets.length && i >= 0 && withSt.every(f => f.st.length === L.statKeys.length && f.st[i] === f.hpMax), withSt.length + ' of ' + L.fleets.length);
        const used = new Set(); L.fleets.forEach(f => Object.keys(f.types || {}).forEach(t => used.add(t)));
        const noDef = [...used].filter(t => !Object.prototype.hasOwnProperty.call(L.shipDefs || {}, t));
        check('[3] stats: every ship model in a fleet has a stat sheet', noDef.length === 0, noDef.slice(0, 5).join(', '));
        const other = L.statKeys.filter(k => F.sectionOf(k) === 'other');
        check('[3] stats: every stat the chain states lands in a named section (none in Other)', other.length === 0, other.join(', '));
    } else console.log('  skip the stats checks: this read has no statKeys (made before the stats were collected)');
}

console.log('[4] page wiring');
{
    const html = fs.readFileSync(path.join(ROOT, 'C4Live', 'index.html'), 'utf8'), app = fs.readFileSync(path.join(ROOT, 'C4Live', 'app.js'), 'utf8');
    check('[4] index.html holds the view, its stylesheet and its script before app.js', /<section class="fv" id="c4FleetView" role="dialog" aria-modal="true"[^>]* hidden>/.test(html) && /c4-fleet-view\.css\?v=[0-9a-z]+/.test(html) && html.indexOf('c4-fleet-view.js?v=') > 0 && html.indexOf('c4-fleet-view.js?v=') < html.indexOf('<script src="app.js'));
    check('[4] the owner drawer has the Fleet view button and the page routes its click', /data-fleet-view="\$\{esc\(p\)\}"/.test(app) && /t\.closest\('\[data-fleet-view\]'\)/.test(app));
    check('[4] keys reach the fleet view before the stake view and the drawer', app.indexOf('if (FV && FV.onKey(e)) return;') > 0 && app.indexOf('if (FV && FV.onKey(e)) return;') < app.indexOf("if (e.key === 'Escape' && S.stake)"));
    check('[4] Fly to fleet aims at where the scene draws the fleet now and zooms right in (closer than the zoom 3 of the owner list)', /flyTo: \(x, y, f\) => \{[^}]*flyToFleet\(x, y, f\)/.test(app) && /s\.fleetScreen\(f\.a\)/.test(app) && (() => { const m = /const fleetZoom = f => \(f && f\.kind === 'warp' \? (\d+) : f && f\.kind === 'subwarp' \? (\d+) : (\d+)\);/.exec(app); return !!m && +m[1] > 3 && +m[2] > +m[1] && +m[3] >= +m[2]; })());
    check('[4] the fleet view and the analytics tab are handed the visitor\'s own as a callback on the live S.mine set (a profile change redraws both through rebuild)', /isMine: p => !!p && S\.mine\.has\(p\), reducedMotion/.test(app) && /onPick: anPick, isMine: p => !!p && S\.mine\.has\(p\) \}/.test(app) && /HP\.onChange\(\(\) => \{[^}]*rebuild\(true\)/.test(app) && !/HubProfile|HP\b/.test(SRC.replace(/\/\*[^]*?\*\//g, '').replace(/\/\/.*$/gm, '')));
    check('[4] fresh data redraws an open fleet view', /if \(FV\) FV\.refresh\(fvCtx\(\)\);/.test(app));
    check('[4] no inline handler or script in the generated HTML', !/ on[a-z]+=|<script|javascript:/i.test(SRC.replace(/\/\*[^]*?\*\//g, '').replace(/\/\/.*$/gm, '')));
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
