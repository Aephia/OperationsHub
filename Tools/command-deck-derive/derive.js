// derive.js - INDEPENDENT re-derivation of the Command Deck suite's research / zone pins from the raw export
// (JSON/research.json, recipes.json, buildings.json, planets.json). No hub code is loaded: no deck-model, no
// resource-model, no recipe-model. Rules re-implemented here from the export's own fields:
//   closure   = a tag's granting node, then its requirements.required_tags, recursively
//   bill      = closure minus the Starting Node: count, ATLAS (atlas_cost / 1e8), max level per track, XP from thresholds
//   chain     = ingredients walked by NAME; a name resolves to its recipe with the best c4_status (v1 < v1-add < v2 < other),
//               first in file order on a tie; a name with no ingredients (or a BASIC* type) is a raw
//   zones     = a region's risk_zone: {LowRiskZone: faction} = that faction's low-risk zone, a string = medium
// Run: node derive.js < /dev/null  (prints JSON lines KEY=value; the suite cites these keys beside each pin)
'use strict';
const H = require('path').join(__dirname, '..', '..', 'JSON') + '/';
const R = require(H + 'research.json'), RJ = require(H + 'recipes.json'), BJ = require(H + 'buildings.json'), PJ = require(H + 'planets.json');
const RECIPES = Array.isArray(RJ) ? RJ : RJ.recipes, BLD = Array.isArray(BJ) ? BJ : BJ.buildings;
const out = (k, v) => console.log(k + '=' + JSON.stringify(v));

// ---- nodes and tags
const N = R.nodes, granters = new Map();
N.forEach(n => ((n.character_value_changes || {}).research_tags || []).forEach(t => { if (!granters.has(t)) granters.set(t, []); granters.get(t).push(n); }));
out('TAGS_GRANTED_TWICE', [...granters].filter(([, a]) => a.length > 1).map(([t]) => t));
const nodeOf = t => { const a = granters.get(t); return a ? a[a.length - 1] : null; };
const START = N.find(n => ((n.character_value_changes || {}).research_tags || []).includes(0));
const closure = tags => { const seen = new Set(), q = Array.from(tags); while (q.length) { const n = nodeOf(q.pop()); if (!n || seen.has(n)) continue; seen.add(n); ((n.requirements || {}).required_tags || []).forEach(t => q.push(t)); } return seen; };
const names = set => Array.from(set).map(n => n.name).sort();
const XPKEY = { Crafting: 'crafting', Mining: 'mining', Building: 'building', CouncilRank: 'council_rank', Pilot: 'pilot', DataRunner: 'data_runner', Combat: 'combat' };
const xpFor = (k, L) => { const t = R.thresholds[XPKEY[k]]; const lv = t && (t.levels || t); return L ? (Array.isArray(lv) && L <= lv.length ? lv[L - 1] : null) : 0; };
const bill = set => { let todo = 0, atlas = 0; const levels = {}; set.forEach(n => { if (n === START) return; todo++; atlas += ((n.cost || {}).atlas_cost || 0) / 1e8; Object.entries((n.requirements || {}).level || {}).forEach(([k, v]) => { levels[k] = Math.max(levels[k] || 0, v); }); }); const xp = {}; Object.entries(levels).forEach(([k, v]) => { xp[k] = xpFor(k, v); }); return { todo, atlas, levels, xp }; };

// ---- gate map figures
const G = R.gates;
out('RECIPES_GATED', [G.recipeCount, Object.keys(G.recipes).length]);
out('GATED_BUILDINGS', Object.keys(G.buildings).length);
const allGateTags = new Set(); ['recipes', 'buildings', 'claimStakes', 'craftingHabs'].forEach(k => Object.values(G[k]).forEach(a => a.forEach(t => allGateTags.add(t))));
out('ORPHAN_TAGS', Array.from(allGateTags).filter(t => !granters.has(t)).sort((a, b) => a - b));
out('ORPHAN_USE', Object.fromEntries(Array.from(allGateTags).filter(t => !granters.has(t)).map(t => [t, ['recipes', 'buildings'].map(k => Object.values(G[k]).filter(a => a.includes(t)).length)])));
const hasTrack = n => !!(n.tag || (n.cost && n.cost.xp_cost && Object.keys(n.cost.xp_cost).length));
out('NODES_DRAWN_DROPPED', [N.filter(hasTrack).length, N.filter(n => !hasTrack(n)).length]);
const startTags = new Set(START.character_value_changes.research_tags), everyTag = new Set(granters.keys());
const ungated = G.recipeCount - Object.keys(G.recipes).length;
out('CRAFTABLE_START_EVERY', [ungated + Object.values(G.recipes).filter(a => a.every(t => startTags.has(t))).length, ungated + Object.values(G.recipes).filter(a => a.every(t => everyTag.has(t))).length]);
out('STAKE_T5_NODE', G.claimStakes['claim-stake-tier-5'].map(t => (nodeOf(t) || {}).name));
out('STAKE_T2_NODE', G.claimStakes['claim-stake-tier-2'].map(t => (nodeOf(t) || {}).name));

// ---- fleet size ladder: the Starting Node, then Fleet Size - Tier 1..8; caps add up; the quoted total in each description
const fsNode = t => N.find(n => n.name === `Fleet Size - Tier ${t}`);
const ladder = [START.character_value_changes.fleet_size].concat([1, 2, 3, 4, 5, 6, 7, 8].map(t => fsNode(t).character_value_changes.fleet_size));
const caps = []; ladder.reduce((a, v) => { caps.push(a + v); return a + v; }, 0);
out('FLEET_LADDER', ladder); out('FLEET_CAPS', caps);
out('FLEET_QUOTED', [1, 2, 3, 4, 5, 6, 7, 8].map(t => { const m = /cumulative capacity to (?:the maximum of )?(\d+)/.exec(fsNode(t).description || ''); return m ? +m[1] : null; }));
out('TITAN_128_TIER', (() => { const i = caps.findIndex(c => c >= 128); return i <= 0 ? null : [`Fleet Size - Tier ${i}`, caps[i]]; })());
out('CAPITAL3_108_TIER', (() => { const i = caps.findIndex(c => c >= 108); return [`Fleet Size - Tier ${i}`, caps[i]]; })());

// ---- zone grants
const zoneNodes = pred => N.filter(n => pred(n.character_value_changes || {}));
out('MEDIUM_GRANTS', zoneNodes(c => c.security_zone_access === 'MediumRiskZone').map(n => n.name));
out('ENEMY_GRANTS', zoneNodes(c => c.enemy_faction_zone_access).map(n => [n.name, n.tag]));
const MED = zoneNodes(c => c.security_zone_access === 'MediumRiskZone'), ENE = zoneNodes(c => c.enemy_faction_zone_access);

// ---- prerequisite graph: children = nodes whose required_tags include one of a node's tags
const tagsOf = n => (n.character_value_changes || {}).research_tags || [];
// (the page's documented rule: plus the drawn nodes with no numbers at all that hang off it by their editor `parent`)
const noData = c => !c.character_value_changes && !c.cost && !c.requirements;
const childrenOf = n => N.filter(c => c !== n && hasTrack(c) && (((c.requirements || {}).required_tags || []).some(t => tagsOf(n).includes(t) && nodeOf(t) === n) || (noData(c) && c.parent === n.id)));
const most = N.map(n => [n, childrenOf(n).length]).sort((a, b) => b[1] - a[1] || N.indexOf(a[0]) - N.indexOf(b[0]));
out('MOST_CHILDREN', [most[0][0].name, most[0][1]]);
out('HULL_INTEGRITY_CHILDREN', childrenOf(N.find(n => n.name === 'Hull Integrity')).map(n => n.name));
out('ELITE_HULL_CHILDREN', childrenOf(N.find(n => n.name === 'Elite Hull Integrity')).length);
out('DESC_CP1252_DAMAGE', N.filter(n => /â€/.test(n.description || '')).map(n => n.name).slice(0, 5));
out('DESC_CP1252_COUNT', N.filter(n => /â€/.test(n.description || '')).length);

// ---- chains by name
const RANK = { v1: 0, 'v1-add': 1, v2: 2 };
const byName = new Map(); RECIPES.forEach(r => { const c = byName.get(r.outputName); if (!c || (RANK[r.c4_status] ?? 3) < (RANK[c.c4_status] ?? 3)) byName.set(r.outputName, r); });
const isRawName = nm => { const r = byName.get(nm); return !r || !(r.ingredients || []).length || /^BASIC/.test(r.outputType); };
const chain = rec => { const crafted = [], raws = new Set(), seen = new Set([rec.outputName]); const walk = r => (r.ingredients || []).forEach(i => { if (seen.has(i.name)) return; seen.add(i.name); if (isRawName(i.name)) { raws.add(i.name); return; } const s = byName.get(i.name); crafted.push(s); walk(s); }); walk(rec); return { crafted, raws }; };
const chainTags = rec => { const t = new Set(G.recipes[rec.outputId] || []); chain(rec).crafted.forEach(r => (G.recipes[r.outputId] || []).forEach(x => t.add(x))); return t; };
// subject S: among non-building, non-raw recipes, the deepest Crafting level on the chain's closure, then the most
// nodes, then file order. Restricted to chains whose every name is unique in the export (no name ambiguity at all)
const nameCount = new Map(); RECIPES.forEach(r => nameCount.set(r.outputName, (nameCount.get(r.outputName) || 0) + 1));
const cands = RECIPES.filter(r => r.outputType !== 'BUILDING' && !/^BASIC/.test(r.outputType) && (r.ingredients || []).length && nameCount.get(r.outputName) === 1 && chain(r).crafted.every(c => nameCount.get(c.outputName) === 1))
    .map(r => { const s = closure(chainTags(r)), b = bill(s); return { r, s, b }; })
    .filter(x => x.b.todo > 0)
    .sort((a, b) => (b.b.levels.Crafting || 0) - (a.b.levels.Crafting || 0) || b.s.size - a.s.size || RECIPES.indexOf(a.r) - RECIPES.indexOf(b.r));
out('GATED_CANDIDATES', cands.length);
const S = cands[0];
out('S_ID', S.r.outputId); out('S_NAME_TIER', [S.r.outputName, S.r.outputTier]); out('S_RAWS', Array.from(chain(S.r).raws).sort());
out('S_NODES', names(S.s)); out('S_BILL', S.b);
// PRM / TMS / UC chain tags now (the old subjects)
['power-regulation-module', 'thermal-management-system', 'utility-controller', 'oceanic-processing-hub-t3', 'framework-processor-t1'].forEach(id => { const r = RECIPES.find(x => x.outputId === id); out('CHAIN_' + id, r ? names(closure(chainTags(r))) : 'missing'); });
// S's raw in-hand path (crafting only)
out('S_HAND_NODES', names(S.s));

// ---- zones and gathering (port of the suite's byHand, on planets.json / buildings.json)
const regionOf = new Map(PJ.regionDefinitions.map(g => [g.id, g]));
const zoneOfSystem = (s, fac) => { const z = regionOf.get(s.regionId).risk_zone; return typeof z === 'string' ? 'medium' : (z.LowRiskZone.toLowerCase() === fac ? 'own' : 'enemy'); };
const slug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const rank = { own: 0, medium: 1, enemy: 2 };
const route = (raw, fac) => {
    const kit = BLD.find(b => b.id === slug(raw) + '-extractor-t1'), lock = kit && (kit.requiredTags || []).find(t => ['mud', 'oni', 'ustur'].includes(t));
    const kitOk = kit && (!lock || lock === fac), best = { stake: null, any: null };
    PJ.mapData.forEach(s => s.planets.forEach(p => {
        if (!(p.resources || []).some(q => q.name === raw)) return;
        const z = zoneOfSystem(s, fac), belt = p.type % 8 === 3, pf = ['oni', 'mud', 'ustur'][Math.floor(p.type / 8)];
        if (best.any == null || rank[z] < rank[best.any]) best.any = z;
        if (kitOk && !belt && (!lock || lock === pf) && (best.stake == null || rank[z] < rank[best.stake])) best.stake = z;
    }));
    const r = best.stake != null ? 'stake' : 'fleet', z = best.stake != null ? best.stake : best.any;
    const tags = new Set();
    if (r === 'stake') { (G.buildings[kit.id] || []).forEach(t => tags.add(t)); G.claimStakes['claim-stake-tier-1'].forEach(t => tags.add(t)); }
    if (z === 'medium') tagsOf(MED[0]).forEach(t => tags.add(t));
    if (z === 'enemy') tagsOf(ENE[0]).forEach(t => tags.add(t));
    return { r: r + '/' + z, tags, kit: kit && kit.id };
};
out('GOLD_ROUTES', ['oni', 'ustur'].map(f => route('Gold Ore', f).r));
out('GOLD_ONI_TAG_NODES', Array.from(route('Gold Ore', 'oni').tags).map(t => (nodeOf(t) || { name: '#' + t }).name));
const gatherBill = (rec, fac) => { const tags = chainTags(rec), craft = closure(tags); chain(rec).raws.forEach(raw => route(raw, fac).tags.forEach(t => tags.add(t))); const all = closure(tags); return { craft: bill(craft), all: bill(all), allNames: names(all) }; };
const prm = RECIPES.find(r => r.outputId === 'power-regulation-module'), tms = RECIPES.find(r => r.outputId === 'thermal-management-system');
out('PRM_USTUR_STAKES_BILL', (b => [b.all.todo, b.all.atlas])(gatherBill(prm, 'ustur')));
out('TMS_USTUR_STAKES_LEVELS', (b => [b.all.levels.Crafting, b.all.levels.Mining, b.all.levels.Building, b.all.levels.Pilot])(gatherBill(tms, 'ustur')));
out('TMS_USTUR_HAS_MEDIUM_NODE', gatherBill(tms, 'ustur').allNames.includes(MED[0].name));
const gS = gatherBill(S.r, 'ustur');
out('S_USTUR_GATHER', { craftTodo: gS.craft.todo, allTodo: gS.all.todo, addTodo: gS.all.todo - gS.craft.todo, addAtlas: gS.all.atlas - gS.craft.atlas, allAtlas: gS.all.atlas });
// building goals: own gate + the stake tier's gate + the gates of what stands beside it. The beside-list is the
// terrestrial T3 layout (central, storage, extraction hub, crew quarters) for the extractor, and the storage + farm
// hub for the cultivation farm (the hubs whose addedTags its requiredTags chain needs)
const bgoal = (id, stakeKey, beside) => { const t = new Set(G.buildings[id] || []); (G.claimStakes[stakeKey] || []).forEach(x => t.add(x)); beside.forEach(b => (G.buildings[b] || []).forEach(x => t.add(x))); const s = closure(t); return { b: bill(s), n: s.size, orphans: Array.from(t).filter(x => !granters.has(x)) }; };
const A5 = bgoal('copper-ore-extractor-t3', 'claim-stake-tier-3', ['terrestrial-central-hub-t3', 'terrestrial-storage-hub-t3', 'terrestrial-extraction-hub-t3', 'terrestrial-crew-quarters-t3']);
out('A5_EXTRACTOR_T3', [A5.b.todo, A5.b.atlas]); out('A5_LEVELS', A5.b.levels); out('A5_XP', A5.b.xp); out('A5_ORPHANS', A5.orphans);
const FARM = bgoal('magmaroot-farm-t3', 'cultivation-stake-tier-3', ['terrestrial-storage-hub-t3', 'terrestrial-farm-hub-t3']);
out('FARM_T3_CLOSURE_SIZE', FARM.n);
out('STEEL_T3_HUB_NODE', (G.buildings['terrestrial-processing-hub-t3'] || []).map(t => (nodeOf(t) || {}).name));
// S at USTUR, stakes, as the Research goal panel bills it (crafting + gathering), levels and XP
const gSl = (() => { const tags = chainTags(S.r); chain(S.r).raws.forEach(raw => route(raw, 'ustur').tags.forEach(t => tags.add(t))); return bill(closure(tags)); })();
out('S_USTUR_ALL_LEVELS', gSl.levels); out('S_USTUR_ALL_XP', gSl.xp);
// A2 subject: the first recipe (file order) that is NOT its name's default and whose own chain needs other research
// than the default's chain - so walking the default by name would be wrong
const a2 = RECIPES.find(r => byName.get(r.outputName) !== r && (r.ingredients || []).length && r.outputType !== 'BUILDING' && names(closure(chainTags(r))).join('|') !== names(closure(chainTags(byName.get(r.outputName)))).join('|'));
out('A2_SUBJECT', a2 && [a2.outputId, a2.outputName, a2.outputTier, names(closure(chainTags(a2))), names(closure(chainTags(byName.get(a2.outputName)))), byName.get(a2.outputName).outputId]);
// R2 / R3: what is open holding only the Starting Node (prerequisite tags only; levels not checked, as the page says)
const hasData = n => !!(n.character_value_changes || n.cost || n.requirements);
const open0 = N.filter(n => hasTrack(n) && hasData(n) && n !== START && ((n.requirements || {}).required_tags || []).every(t => startTags.has(t)));
out('OPEN_AT_START', open0.length);
const completes = n => Object.values(G.recipes).filter(a => a.some(t => tagsOf(n).includes(t)) && a.every(t => startTags.has(t) || tagsOf(n).includes(t))).length;
const gatedBy = n => Object.values(G.recipes).filter(a => a.some(t => tagsOf(n).includes(t))).length;
const ranked = open0.map(n => ({ n: n.name, done: completes(n), gated: gatedBy(n) })).sort((a, b) => b.done - a.done || b.gated - a.gated);
out('OPEN_TOP3', ranked.slice(0, 3));
out('OPEN_FIRST_TWO', open0.slice(0, 2).map(n => n.name));
const openMining = open0.find(n => n.tag === 'Mining' && (n.cost || {}).atlas_cost);
out('OPEN_FIRST_MINING', openMining && [openMining.name, openMining.cost.atlas_cost / 1e8, openMining.cost.xp_cost, openMining.requirements.level]);
// nodes whose prerequisite tags include one no node grants (drawn ones only): they can never open on this export
const orphReq = N.filter(n => hasTrack(n) && ((n.requirements || {}).required_tags || []).some(t => !granters.has(t)));
out('ORPHAN_REQ_NODES', [orphReq.length, orphReq.find(n => n.name === 'Mining Gear - T1') ? (n => n.requirements.required_tags.filter(t => !granters.has(t)))(orphReq.find(n => n.name === 'Mining Gear - T1')) : null]);
// 93 raws: nearest zone for a USTUR player (any body)
const rawNames = RECIPES.filter(r => /^BASIC/.test(r.outputType)).map(r => r.outputName);
const scan = { own: 0, medium: 0, enemy: 0 }; new Set(rawNames).forEach(nm => { let b = null; PJ.mapData.forEach(s => { if (s.planets.some(p => (p.resources || []).some(q => q.name === nm))) { const z = zoneOfSystem(s, 'ustur'); if (b == null || rank[z] < rank[b]) b = z; } }); if (b) scan[b]++; });
out('RAWS_BY_ZONE_USTUR', [new Set(rawNames).size, scan.own, scan.medium, scan.enemy]);
