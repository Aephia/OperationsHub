#!/usr/bin/env node
// hub-profile-check.js - Node check of the shared profile (Utils/HubProfile.js) and of the planner's "count what I hold"
// maths (RecipeModel.expand with opts.stock) on the recipe rows the hub ships.
//   HP  the stored profile: only addresses are kept, the C4 marks survive a form save, a refused write says so
//   HM  what is yours in a C4 Live read: by mark, by player profile, by wallet; NPC fleets never; cargo summed
//   HS  the plan counted against stock: expected values come from OTHER plans of the unchanged model (the plan with no
//       stock, the plan of one ingredient alone), never from the stock code itself
//   node Test/hub-profile-check.js      exit 0 = all PASS
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const ok = (cond, msg, detail) => { if (cond) { pass++; console.log('  PASS ' + msg); } else { fail++; console.log('  FAIL ' + msg + (detail !== undefined ? '  -> ' + detail : '')); } };

// ------------------------------------------------------------------------------------------------ HP
const H = require(path.join(ROOT, 'Utils', 'HubProfile.js'));
const mem = () => { let s = {}; return { getItem: k => (k in s ? s[k] : null), setItem: (k, v) => { s[k] = String(v); }, removeItem: k => { delete s[k]; }, dump: () => s }; };
const A = n => String(n).repeat(40).slice(0, 40).replace(/[0OIl]/g, '1');   // 40 base58 characters
const W1 = A('W1'), P1 = A('P1'), Z1 = A('Z1'), Z2 = A('Z2'), X1 = A('X1');
console.log('\n[HP] the stored profile');
{
    ok(H.isAddress(W1) && !H.isAddress('abc') && !H.isAddress(W1 + '0') && !H.isAddress(''), 'positive control: a 40-character base58 string is an address; "abc", a string with a 0 and the empty string are not');
    const c = H.clean({ wallet: ' ' + W1 + ' ', profile: '<script>', c4: [Z1, 'nope', Z1, Z2, 7], extra: 1 });
    ok(c.wallet === W1 && c.profile === '' && c.c4.join() === [Z1, Z2].join() && Object.keys(c).sort().join() === 'c4,profile,v,wallet', 'clean keeps addresses only: trimmed wallet, a non-address profile dropped, marks de-duplicated, no extra key');
    ok(H.clean(null).wallet === '' && H.clean('x').c4.length === 0 && !H.isSet(H.clean({})), 'nothing stored reads as an empty profile that is not set');
    ok(H.problem({ wallet: 'short', profile: '' }) !== '' && H.problem({ wallet: W1, profile: 'bad!' }) !== '' && H.problem({ wallet: W1, profile: P1 }) === '' && H.problem({ wallet: '', profile: '' }) === '', 'a typed non-address is named as the problem; valid or empty fields are not');
    const st = mem();
    H.markC4(Z1, true, st);
    const saved = H.update({ wallet: W1, profile: P1 }, st);
    ok(saved && saved.wallet === W1 && saved.profile === P1 && saved.c4.join() === Z1 && H.get(st).c4.join() === Z1, 'a form save keeps the C4 mark made before it');
    H.update({ wallet: '' }, st);
    ok(H.get(st).wallet === '' && H.get(st).profile === P1, 'an emptied field clears that value and leaves the other');
    H.update({ wallet: X1, profile: X1 }, st, true);
    ok(H.get(st).wallet === X1 && H.get(st).profile === P1, 'fill-only mode fills the empty field and does not replace the one already set');
    H.update({ profile: 'not an address' }, st);
    ok(H.get(st).profile === P1, 'a non-address never replaces a stored value');
    H.markC4(Z1, false, st); H.markC4('junk', true, st);
    ok(H.get(st).c4.length === 0, 'a mark is removed again; a non-address is never marked');
    H.clear(st);
    ok(!(H.KEY in st.dump()) && !H.isSet(H.get(st)), 'forgetting the profile removes the stored record');
    const broken = { getItem: () => '{not json', setItem: () => { throw new Error('quota'); }, removeItem: () => { throw new Error('quota'); } };
    ok(!H.isSet(H.get(broken)) && H.set({ wallet: W1 }, broken) === false, 'unreadable storage reads as empty, and a refused write returns false');
    let heard = 0; const off = H.onChange(() => heard++); H.set({ wallet: W1 }, st); off(); H.set({ wallet: X1 }, st);
    ok(heard === 1, 'a listener hears a change, and no longer after it is removed');
}

// ------------------------------------------------------------------------------------------------ HM
console.log('\n[HM] what is yours in a C4 Live read');
{
    const latest = {
        generatedAt: 1795677559,
        owners: [{ p: Z1, name: 'Me', wallet: W1 }, { p: Z2, name: 'Alt', wallet: X1 }, { p: P1, name: 'ByProfile', wallet: null }, { p: A('Q9'), name: 'Other', wallet: A('Q8') }],
        fleets: [
            { a: 'f1', o: Z1, npc: 0, hold: [{ n: 'Iron Ore', q: 10 }, { n: 'Fuel', q: 5.5 }] },
            { a: 'f2', o: Z1, npc: 0, hold: [{ n: 'Iron Ore', q: 4 }, { n: 'Bad', q: -3 }, { n: '', q: 9 }, null] },
            { a: 'f3', o: Z2, npc: 0, hold: [{ n: 'Copper Ore', q: 7 }] },
            { a: 'f4', o: A('Q9'), npc: 0, hold: [{ n: 'Iron Ore', q: 1000 }] },
            { a: 'f5', o: Z1, npc: 2, hold: [{ n: 'Iron Ore', q: 500 }] },
            { a: 'f6', o: P1, npc: 0 },
        ],
        stakes: [{ a: 's1', o: Z1, inv: [{ r: 'Iron Ore', q: 6 }, { r: 'Biomass', q: 3 }] }, { a: 's2', o: A('Q9'), inv: [{ r: 'Biomass', q: 99 }] }],
    };
    const none = H.assets(latest, H.empty());
    ok(none.owners.length === 0 && none.fleets.length === 0 && none.stakes.length === 0 && none.stock.length === 0, 'no profile: nothing is yours');
    const byWallet = H.assets(latest, H.clean({ wallet: W1 }));
    ok(byWallet.owners.map(o => o.p).join() === Z1 && byWallet.fleets.map(f => f.a).join() === 'f1,f2' && byWallet.stakes.map(s => s.a).join() === 's1', 'by wallet: that wallet\'s player, its two player fleets and its claim stake; the NPC fleet under the same profile is not yours');
    const iron = byWallet.stock.find(s => s.name === 'Iron Ore');
    ok(iron && iron.units === 20 && iron.inFleets === 14 && iron.inStakes === 6 && byWallet.stock.map(s => s.name).join() === 'Iron Ore,Fuel,Biomass', 'cargo is summed per name over holds (14) and stake inventories (6), largest first; a negative amount, an empty name and a null row add nothing', JSON.stringify(byWallet.stock));
    ok(H.whyMine(latest.owners[0], H.clean({ wallet: W1 })) === 'wallet' && H.whyMine(latest.owners[2], H.clean({ profile: P1 })) === 'profile' && H.whyMine(latest.owners[1], H.clean({ c4: [Z2] })) === 'marked' && H.whyMine(latest.owners[3], H.clean({ wallet: W1, profile: P1, c4: [Z2] })) === '', 'why it is yours: wallet, player profile or mark; another player is not');
    ok(H.whyMine({ p: Z2, wallet: null }, H.clean({ profile: P1 })) === '' && H.whyMine({ p: Z2 }, H.empty()) === '', 'a player with no known wallet does not match an empty wallet');
    const all = H.assets(latest, H.clean({ wallet: W1, profile: P1, c4: [Z2] }));
    ok(all.owners.length === 3 && all.fleets.map(f => f.a).join() === 'f1,f2,f3,f6' && all.stock.find(s => s.name === 'Copper Ore').units === 7 && all.at === 1795677559, 'mark + profile + wallet together: three players, their four fleets, the read time');
    const ms = H.mineSet({ owners: [] }, H.clean({ c4: [Z2], profile: P1 }));
    ok(ms.has(Z2) && ms.has(P1) && ms.size === 2 && H.mineSet(latest, H.empty()).size === 0, 'a marked profile is yours even when the read does not list it; no profile gives an empty set');
    ok(H.assets(null, H.clean({ wallet: W1 })).stock.length === 0 && H.assets({ owners: 'x', fleets: 5 }, H.clean({ wallet: W1 })).fleets.length === 0, 'a missing or malformed read gives nothing and does not throw');
}

// ------------------------------------------------------------------------------------------------ HS
console.log('\n[HS] the plan counted against what is held (real recipe rows)');
{
    global.window = global;
    const load = f => require(path.join(ROOT, f));
    const D = { recipes: load('Data/recipes-data.js'), resources: load('Data/resources-data.js'), planets: load('Data/planet-data.js'), buildings: load('Data/buildings-data.js') };
    load('ResourcesExplorer/resource-model.js'); load('RecipeExplorer/recipe-model.js');
    const pick = (o, k) => (o && o[k]) || (global[k]) || o;
    const rm = new window.ResourceModel((global.resourcesData && global.resourcesData.resources) || pick(D.resources, 'resources') || [], (global.rawRecipeData && global.rawRecipeData.recipes) || pick(D.recipes, 'recipes') || [], global.planetData || D.planets || { mapData: [], regionDefinitions: [] }, (global.rawBuildingData && global.rawBuildingData.buildings) || pick(D.buildings, 'buildings') || []);
    const m = new window.RecipeModel(rm);
    ok(m.recipes.length > 1000, `positive control: the model holds the shipped recipes (${m.recipes.length})`);
    const QTY = 7;
    const mapOf = list => new Map(list.map(r => [r.name, r.qty]));
    const stepKey = c => c.name + '|' + c.rec.outputId;
    // subject, by rule: the first recipe (by id) whose chain is at least 3 deep and whose first ingredient is itself
    // crafted, used by exactly one step of the plan, and has raws below it
    let S = null;
    for (const r of m.recipes.slice().sort((a, b) => a.outputId.localeCompare(b.outputId))) {
        if (!r.ingredients || r.ingredients.length < 2 || r.depth < 3) continue;
        const full = m.plan([{ id: r.outputId, qty: QTY }], {});
        const ing = r.ingredients[0], step = full.crafts.find(c => c.name === ing.name);
        if (!step || full.crafts.filter(c => c.name === ing.name).length !== 1 || full.edges.filter(e => e.to === ing.name).length !== 1) continue;
        if (full.crafts.some(c => c.name === r.outputName && c.rec.outputId !== r.outputId)) continue;
        if (full.raws.length < 2) continue;
        S = { r, full, ing, step }; break;
    }
    ok(!!S, 'positive control: a subject recipe exists (3+ deep, first ingredient crafted once)' + (S ? `: ${S.r.outputName}, first ingredient ${S.ing.name}` : ''));
    if (S) {
        const { r, full, ing, step } = S, item = [{ id: r.outputId, qty: QTY }];
        const sig = p => JSON.stringify([p.raws.map(x => [x.name, x.qty]), p.crafts.map(c => [stepKey(c), c.crafts, c.units]), p.totals, p.time]);
        const empty = m.plan(item, { stock: new Map() });
        ok(sig(empty) === sig(full) && empty.held.size === 0, 'holding nothing: the plan is the plan with no stock, and nothing is taken');
        const unrelated = m.plan(item, { stock: new Map([['No Such Thing', 1e9]]) });
        ok(sig(unrelated) === sig(full) && unrelated.held.size === 0, 'holding only things the plan does not use changes nothing');

        const rootHeld = m.plan(item, { stock: new Map([[r.outputName, QTY + 5]]) });
        ok(rootHeld.raws.length === 0 && rootHeld.crafts.length === 0 && rootHeld.held.get(r.outputName) === QTY && rootHeld.totals.rawUnits === 0, 'holding the finished item: nothing left to craft or gather, and exactly the planned quantity is taken (not all 12 held)');

        const allRaws = m.plan(item, { stock: mapOf(full.raws) });
        ok(allRaws.raws.length === 0 && allRaws.totals.crafts === full.totals.crafts && full.raws.every(x => allRaws.held.get(x.name) === x.qty), 'holding every raw in full: no raw left, every craft still to do, each raw taken in full');

        const first = full.raws[0], half = Math.floor(first.qty / 2) || 1;
        const partRaw = m.plan(item, { stock: new Map([[first.name, half]]) });
        ok(mapOf(partRaw.raws).get(first.name) === first.qty - half && partRaw.held.get(first.name) === half && partRaw.totals.crafts === full.totals.crafts, `holding part of one raw (${half} of ${first.qty} ${first.name}): the rest is left, the crafts are unchanged`, mapOf(partRaw.raws).get(first.name));

        // an ingredient held in full: its step is gone and the raw bill falls by exactly the raw bill of making that
        // many of it alone (a plan of the unchanged model with no stock)
        const need = full.edges.find(e => e.to === ing.name).quantity;
        const alone = m.plan([{ id: step.rec.outputId, qty: need }], {}), aloneRaw = mapOf(alone.raws), fullRaw = mapOf(full.raws);
        const ingHeld = m.plan(item, { stock: new Map([[ing.name, need]]) }), leftRaw = mapOf(ingHeld.raws);
        const expectRaw = new Map(); fullRaw.forEach((q, n) => { const v = q - (aloneRaw.get(n) || 0); if (v > 0) expectRaw.set(n, v); });
        const same = (a, b) => a.size === b.size && [...a].every(([k, v]) => b.get(k) === v);
        ok(!ingHeld.crafts.some(c => c.name === ing.name) && ingHeld.held.get(ing.name) === need, `holding the first ingredient in full (${need} ${ing.name}): its craft step is gone and exactly that many are taken`);
        ok(same(leftRaw, expectRaw), 'the raw bill then falls by exactly the raw bill of making that ingredient alone', JSON.stringify([...leftRaw].slice(0, 4)) + ' vs ' + JSON.stringify([...expectRaw].slice(0, 4)));
        ok(ingHeld.totals.crafts === full.totals.crafts - alone.totals.crafts, `and the crafts fall by that sub-plan's crafts (${full.totals.crafts} - ${alone.totals.crafts} = ${ingHeld.totals.crafts})`);
        ok(alone.totals.crafts > 0 && alone.totals.rawUnits > 0, 'positive control: that sub-plan has crafts and raws of its own (the two checks above can fail)');

        // one unit short: the step stays, with fewer units to make
        if (need > 1) {
            const short = m.plan(item, { stock: new Map([[ing.name, need - 1]]) }), st = short.crafts.find(c => c.name === ing.name);
            ok(!!st && st.units === 1 && short.held.get(ing.name) === need - 1, 'holding one unit less than needed: the step stays, with 1 unit left to make');
        }
        const given = new Map([[ing.name, need], [first.name, half]]), before = JSON.stringify([...given]);
        m.plan(item, { stock: given });
        ok(JSON.stringify([...given]) === before, 'the stock handed in is not changed by planning');
        // never more left than needed, never more taken than held, over a spread of other recipes
        let bad = 0, tried = 0;
        const sample = m.recipes.filter((x, i) => i % 97 === 0 && x.ingredients && x.ingredients.length).slice(0, 40);
        for (const x of sample) {
            const f = m.plan([{ id: x.outputId, qty: 3 }], {}); if (!f.raws.length) continue; tried++;
            const stock = new Map(f.raws.map((q, i) => [q.name, i % 2 ? q.qty : Math.floor(q.qty / 3)]));
            const l = m.plan([{ id: x.outputId, qty: 3 }], { stock }), lr = mapOf(l.raws);
            for (const q of f.raws) { const left = lr.get(q.name) || 0, took = l.held.get(q.name) || 0; if (left + took !== q.qty || took > stock.get(q.name) || left < 0) bad++; }
        }
        ok(tried >= 10 && bad === 0, `across ${tried} other recipes: for every raw, left + taken = needed and taken never exceeds what is held`, bad);
    }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
