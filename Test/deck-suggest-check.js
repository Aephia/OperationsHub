// deck-suggest-check.js - Command Deck, Empire tab: suggestions from the player's own C4 inventory (2026-11-27).
//   node Test/deck-suggest-check.js
// Node check (no browser) of Empire.suggest (CommandDeck/deck-model.js) on the hub's own game data, and of the panel
// the Empire tab draws from it (deck-empire.js, prototype only, no DOM): a line the player holds, makes or has planned
// asks for nothing; a missing raw gets a stake a stake can really extract it on, and a body ships can mine; the page
// wiring. Each mutant must make at least one check fail.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
global.window = global;
const load = f => require(path.join(ROOT, f));
const D = { buildings: load('Data/buildings-data.js'), ships: load('Data/ships-data.js'), recipes: load('Data/recipes-data.js'), resources: load('Data/resources-data.js'), planets: load('Data/planet-data.js') };
load('ResourcesExplorer/resource-model.js'); load('RecipeExplorer/recipe-model.js'); load('CommandDeck/deck-model.js');
const MODEL_SRC = fs.readFileSync(path.join(ROOT, 'CommandDeck/deck-model.js'), 'utf8');
const slug = window.CommandDeck.slug;

function models(src) {
    let CD = window.CommandDeck;
    if (src) { const box = { window: {} }; box.window.ResourceModel = window.ResourceModel; box.window.RecipeModel = window.RecipeModel; vm.runInNewContext(src, box); CD = box.window.CommandDeck; }
    const rm = new window.ResourceModel(D.resources.resources, D.recipes.recipes, D.planets, D.buildings.buildings);
    const rc = new window.RecipeModel(rm);
    const se = new CD.StakeEngine(D.buildings, rm, D.planets);
    return { rm, rc, se, empire: new CD.Empire(se, rc, D.ships.ships) };
}

function run(M, quiet) {
    const { rm, se, empire } = M, fails = []; let n = 0;
    const check = (name, ok, detail) => { n++; if (!ok) { fails.push(name); if (!quiet) console.log('  FAIL ' + name + (detail ? '  <- ' + detail : '')); } };
    const safe = (name, fn) => { try { fn(); } catch (e) { check(name + ' (threw)', false, e.message); } };
    const raws = rm.list.filter(r => r.category === 'raw');
    const stakeRaws = raws.filter(r => r.stakeMinable).map(r => r.name).sort(), fleetRaws = raws.filter(r => !r.stakeMinable && se.bodiesOf(slug(r.name)).length).map(r => r.name).sort();
    const row = (name, need, perHour) => ({ name, res: rm.byName.get(name) || null, need, perHour: perHour || 0 });

    safe('[1] status', () => {
        const [a, b, c, d] = stakeRaws;
        const S = empire.suggest([row(a, 100), row(b, 100), row(c, 100, 50), row(d, 100)], { stock: new Map([[a, 100.9], [b, 30], [d, 10]]), made: new Map([[b, { perHour: 35, from: ['your claim stake in X'] }]]) });
        const L = k => S.lines.find(l => l.name === k);
        check('[1] a line the stock covers is held and asks for nothing', L(a).status === 'held' && L(a).short === 0 && L(a).have === 100 && !L(a).stake && !L(a).ships, JSON.stringify(L(a)));
        check('[1] a line the player already makes is producing: the missing part at that rate', L(b).status === 'producing' && L(b).short === 70 && L(b).perHour === 35 && L(b).hours === 2 && L(b).from[0] === 'your claim stake in X' && !L(b).stake);
        check('[1] a line the plan sources is planned', L(c).status === 'planned' && L(c).short === 100 && L(c).hours === 2 && !L(c).stake);
        check('[1] a line with stock short of the need and no source is lacking the difference', L(d).status === 'lacking' && L(d).have === 10 && L(d).short === 90);
        check('[1] the counts add up to the lines', S.counts.held === 1 && S.counts.producing === 1 && S.counts.planned === 1 && S.counts.lacking === 1 && S.lines.length === 4);
        check('[1] only the lacking line gets a stake and a body', S.picks.length === 1 && S.picks[0].covers.length === 1 && S.picks[0].covers[0].name === d && S.ships.length === 1 && S.ships[0].name === d);
        const E = empire.suggest([], {});
        check('[1] an empty bill suggests nothing', E.lines.length === 0 && E.picks.length === 0 && E.ships.length === 0);
        const N = empire.suggest([row(a, 5)]);
        check('[1] with no inventory at all every line is lacking', N.counts.lacking === 1 && N.lines[0].have === 0);
    });

    safe('[2] stakes', () => {
        check('[2] the data has raws a stake can extract and raws only ships can mine', stakeRaws.length > 5 && fleetRaws.length > 0, stakeRaws.length + ' / ' + fleetRaws.length);
        const S = empire.suggest(stakeRaws.map(k => row(k, 1000)), { maxStakes: 500 });
        const ok = S.picks.every(p => p.planet.stakeable && p.covers.length > 0 && p.covers.every(x => { const e = se.extractable(p.planet, p.tier).find(y => y.raw === x.raw); return !!e && e.kind === p.kind && p.planet.deposits.get(x.raw).richness === x.richness; }));
        check('[2] every pick is a stakeable planet whose stake of that tier and kind really extracts each raw it names', S.picks.length > 0 && ok, S.picks.length + ' picks');
        const named = S.picks.reduce((a, p) => a.concat(p.covers.map(x => x.name)), []);
        check('[2] no raw is named by two picks, and every stake-minable raw is named by one', new Set(named).size === named.length && named.length === stakeRaws.length, named.length + ' of ' + stakeRaws.length);
        check('[2] each lacking line points at the pick that names it', S.lines.every(l => l.stake && l.stake.covers.some(x => x.name === l.name)));
        check('[2] the first pick covers at least as many raws as any later one of its tier (greedy)', S.picks.every((p, i) => !i || p.tier !== S.picks[0].tier || p.covers.length <= S.picks[0].covers.length));
        // the first pick is the best there is at tier 1: no stakeable planet extracts more of the lacking raws with one kind
        let top = 0; se.planets.forEach(p => { if (!p.stakeable) return; const e = se.extractable(p, 1); ['standard', 'cultivation'].forEach(k => { top = Math.max(top, e.filter(x => x.kind === k && stakeRaws.includes(x.name)).length); }); });
        check('[2] no planet extracts more of the missing raws on one tier-1 stake than the first pick', S.picks[0].tier === 1 && S.picks[0].covers.length === top, S.picks[0].covers.length + ' vs ' + top);
        check('[2] the number of picks is capped (default 6)', empire.suggest(stakeRaws.map(k => row(k, 1000))).picks.length <= 6);
        // with zone and starbase equal, the richer deposit wins: for each raw alone, the pick is the richest tier-1 planet
        const richest = k => Math.max(...se.planets.filter(p => p.stakeable).map(p => (se.extractable(p, 1).find(x => x.name === k) || { richness: -1 }).richness));
        const varied = stakeRaws.filter(k => { const v = new Set(se.planets.filter(p => p.stakeable).map(p => (se.extractable(p, 1).find(x => x.name === k) || {}).richness).filter(x => x != null)); return v.size > 1; });
        check('[2] all else equal, the richer deposit wins (every raw whose tier-1 planets differ in richness)', varied.length > 0 && varied.every(k => { const p = empire.suggest([row(k, 10)], {}).picks[0]; return p && p.tier === 1 && p.covers[0].richness === richest(k); }), varied.length + ' raws');
        // rank and gate decide between equal picks
        const one = stakeRaws[0], cands = se.planets.filter(p => p.stakeable && se.extractable(p, 1).some(x => x.name === one));
        if (cands.length > 1) {
            const fav = cands[cands.length - 1];
            check('[2] the better placed planet wins a tie (rank)', empire.suggest([row(one, 10)], { rank: p => (p === fav ? 0 : 1) }).picks[0].planet === fav);
            check('[2] a system whose starbase allows the tier wins before the zone', (() => { const p = empire.suggest([row(one, 10)], { rank: p => (p === fav ? 0 : 1), gate: p => p === fav }).picks[0]; return p.planet !== fav && p.gated === false; })());
        } else if (!quiet) console.log('  skip the tie checks: one planet carries ' + one);
    });

    safe('[3] ships', () => {
        const f = fleetRaws[0];
        const S = empire.suggest([row(f, 500)], {});
        const bodies = se.bodiesOf(slug(f)), best = Math.max(...bodies.map(p => p.deposits.get(slug(f)).richness));
        check('[3] a raw no stake can extract gets no stake and the richest body', S.picks.length === 0 && S.ships.length === 1 && S.ships[0].ships.richness === best && !S.lines[0].stake, f);
        const far = bodies[bodies.length - 1];
        check('[3] the better placed body comes before a richer one', empire.suggest([row(f, 500)], { rank: p => (p === far ? 0 : 1) }).ships[0].ships.planet === far);
        const X = empire.suggest([{ name: 'Not A Resource', res: null, need: 5, perHour: 0 }], {});
        check('[3] a line that is no raw in the data is reported as stuck, with no stake and no body', X.stuck.length === 1 && X.picks.length === 0 && X.ships.length === 0);
    });

    safe('[6] eight raws a fleet', () => {
        // a body with three or more raws of different richness
        const body = se.planets.find(p => p.deposits.size >= 3 && new Set(Array.from(p.deposits.values()).map(d => d.richness)).size > 1);
        const all = Array.from(body.deposits.values()), odd = all.find(d => d.richness !== all[0].richness), ds = [all[0], odd].concat(all.filter(d => d !== all[0] && d !== odd)), names = ds.map(d => d.name), miner = empire.miners[0];
        const f = { id: 'f', task: 'mine', ship: miner.name, count: 2, raw: names[0], more: names.slice(1, 3), body: body.key };
        f.richness = empire.fleetRichness(f);
        const sh = empire.fleetShares(f), n = 3, rich = k => body.deposits.get(slug(k)).richness;
        check('[6] the fleet richness is the mean over the raws it mines', Math.abs(f.richness - (rich(names[0]) + rich(names[1]) + rich(names[2])) / 3) < 1e-12);
        check('[6] the shares add to one', Math.abs(sh.reduce((a, x) => a + x.share, 0) - 1) < 1e-12 && sh.length === 3);
        const cov = empire.coverage([], [], [f], {}), src = cov.sources[0];
        check('[6] each raw comes at hull rate x count x its richness / n (the rule of the chain read)', names.slice(0, 3).every(k => Math.abs(src.supply.get(k) - miner.rate * 2 * rich(k) / n * 3600) < 1e-6 * Math.max(1, src.supply.get(k))), JSON.stringify(Array.from(src.supply)));
        const one = { id: 'g', task: 'mine', ship: miner.name, count: 2, raw: names[0], body: body.key, richness: rich(names[0]) };
        check('[6] a fleet with one raw supplies it at the full rate, as before', (s => s.size === 1 && Math.abs(s.get(names[0]) - miner.rate * 2 * rich(names[0]) * 3600) < 1e-6)(empire.coverage([], [], [one], {}).sources[0].supply));
        const many = { raw: names[0], more: names.slice(1).concat(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']), body: body.key };
        check('[6] never more than eight raws, none twice', empire.fleetRaws(many).length <= 8 && empire.fleetRaws({ raw: names[0], more: [names[0], names[1], names[1]], body: body.key }).length === 2);
        // a saved fleet whose body does not carry its first raw: read as that one raw at its saved richness, nothing else booked
        const alien = stakeRaws.concat(fleetRaws).find(k => !body.deposits.has(slug(k)));
        const stale = { id: 's', task: 'mine', ship: miner.name, count: 1, raw: alien, more: [names[0], names[1]], body: body.key, richness: 3 };
        check('[6] a body without the fleet\'s first raw: one raw at the saved richness, no other raw booked', (m => m.size === 1 && Math.abs(m.get(alien) - miner.rate * 3 * 3600) < 1e-6 * m.get(alien))(empire.coverage([], [], [stale], {}).sources[0].supply) && empire.fleetRaws(stale).length === 1);
        check('[6] an extra raw the body does not carry is dropped; the others keep the rule', (r => r.length === 2 && r.every(x => body.deposits.has(slug(x.name))))(empire.fleetRaws({ raw: names[0], more: [alien, names[1]], body: body.key })));
        const ops = empire.ops([], [f], { tick: 60, richness: true });
        check('[6] the ledger books each raw its share of what the fleet mines', names.slice(0, 3).every(k => { const e = ops.ledger.get(k); return e && Math.abs(e.made - miner.rate * 2 * rich(k) / n * 3600) < 1e-6 * Math.max(1, e.made); }));
        // suggestions: fewest fleets
        const lack = names.slice(0, Math.min(names.length, 10)).map(k => row(k, 100));
        const S = empire.suggest(lack, {});
        check('[6] every missing raw is in exactly one fleet group, each group one body that carries all its raws, at most eight', S.fleets.every(g => g.raws.length >= 1 && g.raws.length <= 8 && g.raws.every(x => g.body.planet.deposits.get(slug(x.name)).richness === x.richness)) && (a => a.length === lack.length && new Set(a).size === a.length)(S.fleets.reduce((a, g) => a.concat(g.raws.map(x => x.name)), [])));
        let top = 0; se.planets.forEach(p => { top = Math.max(top, Math.min(8, lack.filter(l => p.deposits.has(slug(l.name))).length)); });
        check('[6] no body carries more of the missing raws than the first group (fewest fleets first)', S.fleets[0].raws.length === top, S.fleets[0].raws.length + ' vs ' + top);
        check('[6] each lacking line points at the body of its group', S.lines.every(l => l.ships && S.fleets.some(g => g.body.key === l.ships.key && g.raws.some(x => x.name === l.name))));
        // the rule itself, on the real read when it is on this machine
        const fp = path.join(ROOT, 'Data', 'c4-live', 'latest.json');
        if (fs.existsSync(fp)) {
            const L = JSON.parse(fs.readFileSync(fp, 'utf8')), ast = new Map((L.asteroids || []).map(a => [a.a, a])); let ok = 0, bad = 0, max = 0;
            L.fleets.forEach(fl => { if (!fl.s || fl.s.kind !== 'mining' || !fl.mine || !Array.isArray(fl.mine.out)) return; const a = ast.get(fl.s.asteroid), k = fl.mine.out.length; max = Math.max(max, k); if (!a || !a.res) return;
                fl.mine.out.forEach(o => { const r = a.res[o.r]; if (!r || !r.rich) return; const want = fl.mineRate * r.rich / k; if (Math.abs(o.ups - want) <= 0.02 * want) ok++; else bad++; }); });
            check('[6] the chain read: every mining fleet gets each raw at rate x richness / n, and none mines more than eight', ok > 0 && bad === 0 && max <= 8, ok + ' agree, ' + bad + ' do not, most raws at once ' + max);
        } else if (!quiet) console.log('  skip the chain rule check: no Data/c4-live/latest.json on this machine');
    });
    return { fails, n };
}

// the panel, drawn by the tab's prototype with no DOM
function panel(quiet) {
    const fails = []; let n = 0;
    const check = (name, ok, detail) => { n++; if (!ok) { fails.push(name); if (!quiet) console.log('  FAIL ' + name + (detail ? '  <- ' + detail : '')); } };
    try {
        const M = models();
        const HP = load('Utils/HubProfile.js'); window.HubProfile = Object.assign({}, HP, { get: () => ({ v: 1, wallet: '', profile: 'ME', c4: [] }) });
        load('CommandDeck/deck-store.js'); load('CommandDeck/deck-empire.js');
        const raws = M.rm.list.filter(r => r.category === 'raw' && r.stakeMinable).map(r => r.name).sort(), [a, b, c] = raws;
        const EVIL = '<img src=x onerror=alert(1)>';
        const latest = { generatedAt: 1, owners: [{ p: 'ME', name: EVIL }], fleets: [{ o: 'ME', n: EVIL, hold: [{ n: a, q: 500 }], mine: { out: [{ r: b, ups: 1 }] } }, { o: 'OTHER', hold: [{ n: c, q: 99999 }] }],
            stakes: [{ o: 'ME', sysName: EVIL, inv: [{ r: a, q: 500 }], out: [{ r: b, ps: 1 }] }] };
        const mk = c4 => Object.assign(Object.create(window.DeckEmpireTab.prototype), { ctx: { galaxy: null, research: null }, empire: M.empire, se: M.se, rc: M.rc, rm: M.rm, stakes: [], fleets: [], cov: null, c4 });
        const row = (name, need) => ({ name, res: M.rm.byName.get(name), need, perHour: 0 });
        const cov = { rows: [row(a, 1000), row(b, 7200), row(c, 50)] };
        const t = mk({ ready: true, latest, why: '', profile: window.HubProfile.get(), mine: HP.assets(latest, window.HubProfile.get()) }); t.cov = cov;
        const sup = t.c4Supply();
        check('[4] stock = your fleet holds + your stake storage, never another player\'s', sup.stock.get(a) === 1000 && !sup.stock.has(c));
        check('[4] made = your stakes and mining fleets, per hour', sup.made.get(b).perHour === 7200 && sup.made.get(b).from.length === 2);
        const h = t.suggestHTML([{ id: 'x', qty: 1 }], cov), text = h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        check('[4] chain text (player, fleet and system names) is escaped', h.indexOf(EVIL) < 0 && h.indexOf('&lt;img src=x onerror=alert(1)&gt;') > 0);
        check('[4] the chips count held, produced and missing lines', /<b>1<\/b> already in your inventory/.test(h) && /<b>1<\/b> you already produce/.test(h) && /<b>1<\/b> still without a source/.test(h), text.slice(0, 300));
        check('[4] the missing raw gets a Place button per tier and a mining fleet button', (h.match(/data-stake-add="[^"]+\|[1-5]"/g) || []).length === 5 && /data-sug-fleet="0"/.test(h) && text.indexOf('A tier-1 ') > 0, text.slice(300, 700));
        check('[4] the produced line gives the rate and the time for the missing part', text.indexOf('missing 7,200') > 0 && text.indexOf('7,200 / h from') > 0, text);
        check('[4] no undefined or NaN in the panel', !/undefined|NaN|\[object/.test(h));
        const all = mk(t.c4); const covAll = { rows: [row(a, 10)] }; all.cov = covAll;
        check('[4] with everything in hand the panel says there is nothing to place', all.suggestHTML([{ id: 'x', qty: 1 }], covAll).indexOf('Nothing to place.') > 0 && all.suggestHTML([{ id: 'x', qty: 1 }], covAll).indexOf('data-stake-add') < 0);
        check('[4] an empty plan draws no panel', t.suggestHTML([], cov) === '');
        // fixFleet, on the tab's prototype: the extra raws are other raws of the body (seven at most), the richness their mean
        const big = M.se.planets.filter(p => p.deposits.size >= 3).sort((x, y) => y.deposits.size - x.deposits.size)[0], dn = Array.from(big.deposits.values()).map(d => d.name);
        const gone = raws.find(k => !big.deposits.has(window.CommandDeck.slug(k)));
        const ff = { raw: dn[0], more: [dn[0], dn[1], dn[1], gone, 7].concat(dn.slice(2)), body: big.key, richness: 99 }; t.fixFleet(ff);
        check('[4] fixFleet keeps only other raws of the body, none twice, seven at most, and sets the mean richness', ff.more.length === Math.min(7, dn.length - 1) && !ff.more.includes(dn[0]) && !ff.more.includes(gone) && new Set(ff.more).size === ff.more.length && Math.abs(ff.richness - [dn[0]].concat(ff.more).reduce((a, k) => a + big.deposits.get(window.CommandDeck.slug(k)).richness, 0) / (1 + ff.more.length)) < 1e-12, JSON.stringify(ff));
        const fg = { raw: gone, more: [dn[0], dn[1]], body: big.key, richness: 3 }; t.fixFleet(fg);
        check('[4] fixFleet on a body without the first raw clears the extra raws and leaves the saved richness', fg.more.length === 0 && fg.richness === 3);
        window.HubProfile.get = () => HP.empty();
        check('[4] without a profile the panel asks for one and suggests nothing', (x => x.indexOf('Set your wallet or profile') > 0 && x.indexOf('data-stake-add') < 0)(mk({ ready: true, latest, why: '', profile: HP.empty(), mine: HP.assets(latest, HP.empty()) }).suggestHTML([{ id: 'x', qty: 1 }], cov)));
        window.HubProfile.get = () => ({ v: 1, wallet: '', profile: 'ME', c4: [] });
        check('[4] without the C4 read the panel says why', mk({ ready: true, latest: null, why: 'Open C4 Live once.', profile: window.HubProfile.get(), mine: null }).suggestHTML([{ id: 'x', qty: 1 }], cov).indexOf('Open C4 Live once.') > 0);
        check('[4] a profile no player of the read matches is told so', (x => x.indexOf('matches your profile') > 0 && x.indexOf('data-stake-add') < 0)(mk({ ready: true, latest, why: '', profile: { v: 1, wallet: '', profile: 'NOBODY', c4: [] }, mine: HP.assets(latest, { v: 1, wallet: '', profile: 'NOBODY', c4: [] }) }).suggestHTML([{ id: 'x', qty: 1 }], cov)));
        const page = fs.readFileSync(path.join(ROOT, 'CommandDeck/index.html'), 'utf8'), src = fs.readFileSync(path.join(ROOT, 'CommandDeck/deck-empire.js'), 'utf8'), css = fs.readFileSync(path.join(ROOT, 'CommandDeck/deck.css'), 'utf8');
        check('[5] the page loads the shared profile before the Empire tab', page.indexOf('Utils/HubProfile.js?v=') > 0 && page.indexOf('Utils/HubProfile.js?v=') < page.indexOf('deck-empire.js?v='));
        check('[5] step 1 draws the panel and the page routes the mining fleet button', /this\.goalHTML\(items\) \+ this\.suggestHTML\(items, cov\)/.test(src) && /q\('\[data-sug-fleet\]'\)\)\) \{ const g = this\.sug && this\.sug\.fleets\[\+el\.dataset\.sugFleet\]; if \(g\) this\.addMiningFleet\(g\.raws\[0\]\.name, g\.body\.key, g\.raws\.slice\(1\)\.map\(x => x\.name\)\)/.test(src));
        check('[5] a profile change redraws the tab, and the C4 read is fetched only once a profile is set', /H\.onChange\(\(\) => \{ load\(\); apply\(\); \}\)/.test(src) && /if \(this\.c4\.asked \|\| !H\.isSet\(H\.get\(\)\)\) return false;/.test(src));
        check('[5] the panel\'s rules carry two classes (they outrank the step\'s generic rules)', /\.cd-stage-body \.cd-sug \{/.test(css) && /\.cd-sug \.cd-sug-p \{/.test(css));
    } catch (e) { check('[4] panel (threw)', false, e.stack); }
    return { fails, n };
}

console.log('deck-suggest-check');
const base = run(models(), false), pan = panel(false);
let failed = base.fails.length + pan.fails.length;
console.log('mutants');
const MUTANTS = [
    ['stock ignored', "const have = Math.max(0, Math.floor(stock.get(r.name) || 0))", "const have = 0"],
    ['a held line still gets a suggestion', "if (short <= 0) line.status = 'held';", "if (short < 0) line.status = 'held';"],
    ['what the player makes ignored', "else if (m && m.perHour > 0) {", "else if (false) {"],
    ['a planned line treated as lacking', "else if (r.perHour > 0) { line.status = 'planned';", "else if (false) { line.status = 'planned';"],
    ['a belt or gas giant offered for a stake', "if (!p.stakeable) return;\n                    const ext = this.se.extractable(p, tier).filter(x => want.has(x.raw)); if (!ext.length) return;", "const ext = Array.from(p.deposits.entries()).filter(([raw]) => want.has(raw)).map(([raw, d]) => ({ raw, name: d.name, richness: d.richness, kind: 'standard' })); if (!ext.length) return;"],
    ['standard and cultivation raws put on one stake', "['standard', 'cultivation'].forEach(kind => { const k = ext.filter(x => x.kind === kind);", "['standard'].forEach(kind => { const k = ext;"],
    ['a raw named by two picks', "want.get(x.raw).stake = best; want.delete(x.raw);", "want.get(x.raw).stake = best;"],
    ['fewest raws first', "v.covers.length > best.covers.length ||", "v.covers.length < best.covers.length ||"],
    ['rank ignored in a tie', "!v.gated : v.rank !== best.rank ? v.rank < best.rank :", "!v.gated : false ? v.rank < best.rank :"],
    ['richness ignored in a tie', "!v.gated : v.rank !== best.rank ? v.rank < best.rank : v.rich !== best.rich ? v.rich > best.rich :", "!v.gated : v.rank !== best.rank ? v.rank < best.rank : false ? v.rich > best.rich :"],
    ['the highest tier tried first', "for (let tier = 1; tier <= 5 && want.size && picks.length < max; tier++) {", "for (let tier = 5; tier >= 1 && want.size && picks.length < max; tier--) {"],
    ['the starbase gate ignored', "(v.gated !== best.gated ? !v.gated :", "(false ? !v.gated :"],
    ['a second raw mined at the full rate (no sharing)', "fleetShares(f) { const r = this.fleetRaws(f), sum = r.reduce((a, x) => a + x.richness, 0); return r.map(x => Object.assign(x, { share: sum > 0 ? x.richness / sum : 1 / r.length })); }", "fleetShares(f) { const r = this.fleetRaws(f); return r.map(x => Object.assign(x, { share: 1 })); }"],
    ['the rate shared by count, richness ignored', "{ share: sum > 0 ? x.richness / sum : 1 / r.length }", "{ share: 1 / r.length }"],
    ['more than eight raws a fleet', "Empire.MAX_RAWS = 8;", "Empire.MAX_RAWS = 99;"],
    ['one fleet per raw (no grouping by body)', "raws.length = Math.min(raws.length, Empire.MAX_RAWS);", "raws.length = 1;"],
    ['the fleet with the fewest raws first', "if (!best || v.raws.length > best.raws.length ||", "if (!best || v.raws.length < best.raws.length ||"],
    ['fleet grouping: rank ignored in a tie', "(v.raws.length === best.raws.length && (v.rank !== best.rank ? v.rank < best.rank :", "(v.raws.length === best.raws.length && (false ? v.rank < best.rank :"],
    ['fleet grouping: richness ignored in a tie', "(v.raws.length === best.raws.length && (v.rank !== best.rank ? v.rank < best.rank : v.rich !== best.rich ? v.rich > best.rich :", "(v.raws.length === best.raws.length && (v.rank !== best.rank ? v.rank < best.rank : false ? v.rich > best.rich :"],
    ['a body without the first raw still books the extra raws', "if (!body.deposits.has(slug(names[0]))) names.length = 1; else", "if (false) names.length = 1; else"],
    ['stake cap ignored', "while (want.size && picks.length < max) {", "while (want.size) {"]
];
for (const [name, from, to] of MUTANTS) {
    if (MODEL_SRC.split(from).length !== 2) { console.log('  MUTANT NOT APPLIED  ' + name); failed++; continue; }
    let r; try { r = run(models(MODEL_SRC.replace(from, to)), true); } catch (e) { r = { fails: ['threw: ' + e.message] }; }
    if (r.fails.length) console.log('  caught  ' + name + '  (' + r.fails.length + ' checks failed, first: ' + r.fails[0] + ')');
    else { console.log('  MISSED  ' + name); failed++; }
}
console.log((base.n + pan.n - base.fails.length - pan.fails.length) + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
