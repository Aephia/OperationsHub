// deck-model.js - Command Deck data model (2026-10-04). The one module that joins every data set in the hub:
//   research  (Data/research-data.js: nodes, gate AND-sets, level thresholds - split from the SAGE export)
//   recipes + resources + planets + buildings  (through ResourcesExplorer/resource-model.js and
//             RecipeExplorer/recipe-model.js, the same models those explorers use, so counts agree)
//   ships     (Data/ships-data.js)
// Three engines, no invented scores:
//   ResearchModel - what a node needs (prerequisite closure, track levels -> XP, points, ATLAS, tokens) and what it
//                   gates (recipes, stake buildings, stake tiers, hab tiers, ship sizes)
//   StakeEngine   - one same-tier claim stake on one planet: hubs follow what is placed, crew quarters and power
//                   plants are added until crew and power balance, the slot count decides whether it fits;
//                   production per TICK (extractors + the central hub's passive extraction on this planet's deposits,
//                   processors fed by the stake's own extraction)
//   Empire        - many stakes + mining fleets against a production plan's bill: who supplies what, how long
// UNITS: a stake rate is per TICK, a ship's mining rate is per SECOND, and the tick length is in no source. Every
// figure that mixes the two takes the tick length as an input.
// Owner rules applied: a stake is bought per tier and holds tier-N buildings only; belts hold no stake; the central
// hub yields only raws the planet has a deposit of; release status is never surfaced.
(function () {
    'use strict';

    const PT_SLUG = ['terrestrial', 'volcanic', 'barren', 'asteroid-belt', 'gas-giant', 'ice-giant', 'dark', 'oceanic'];
    const PT_NAME = ['Terrestrial', 'Volcanic', 'Barren', 'Asteroid Belt', 'Gas Giant', 'Ice Giant', 'Dark', 'Oceanic'];
    const PT_TAG = ['terrestrial-planet', 'volcanic-planet', 'barren-planet', 'asteroid-belt', 'gas-giant-planet', 'ice-giant-planet', 'dark-planet', 'oceanic-planet'];
    const FACTION = ['oni', 'mud', 'ustur'];                       // planet.type / 8, as the Stake Builder reads it
    const HUB_FOR = {                                              // required tag -> the hub that grants it
        'enables-extractors': 'extraction-hub', 'enables-processors': 'processing-hub', 'storage-hub': 'storage-hub',
        'enables-storage-modules': 'storage-hub', 'enables-organic-extractors': 'farm-hub', 'enables-plant-extractors': 'farm-hub',
        'enables-biomass-extractor': 'farm-hub', 'enables-food-processor': 'farm-hub'
    };
    const HUB_LABEL = { 'extraction-hub': 'Extraction Hub', 'processing-hub': 'Processing Hub', 'storage-hub': 'Storage Hub', 'farm-hub': 'Farm Hub' };
    // research: the keys node costs and level requirements use -> track label (the node "tag") and thresholds key
    const TRACKS = [
        { key: 'CouncilRank', label: 'Council Rank', xp: 'council_rank' }, { key: 'Pilot', label: 'Pilot', xp: 'pilot' },
        { key: 'Mining', label: 'Mining', xp: 'mining' }, { key: 'Building', label: 'Building', xp: 'building' },
        { key: 'Crafting', label: 'Crafting', xp: 'crafting' }, { key: 'DataRunner', label: 'Data Running', xp: 'data_runner' },
        { key: 'Combat', label: 'Combat', xp: 'combat' }
    ];
    const TRACK_BY_KEY = new Map(TRACKS.map(t => [t.key, t]));
    const TRACK_BY_LABEL = new Map(TRACKS.map(t => [t.label, t]));
    const SIZE_VALUE = { XXS: 'XxSmall', XS: 'XSmall', Small: 'Small', Medium: 'Medium', Large: 'Large', Capital: 'Capital', Commander: 'Commander', Titan: 'Titan' };
    const ATLAS_DECIMALS = 1e8;                                    // the ATLAS mint has 8 decimals; costs are in base units
    const slug = n => String(n || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // ------------------------------------------------------------------------------------------------ research
    class ResearchModel {
        constructor(data, recipeModel, ships) {
            const D = data || {};
            this.exportDate = D.exportDate || null;
            this.thresholds = D.thresholds || {};
            this.tokenNames = D.tokenNames || {};
            const G = D.gates || {};
            this.gate = { recipes: G.recipes || {}, buildings: G.buildings || {}, claimStakes: G.claimStakes || {}, craftingHabs: G.craftingHabs || {} };
            this.recipeCount = G.recipeCount || 0;
            this.rc = recipeModel || null;
            this.ships = ships || [];
            this.buildNodes(D.nodes || []);
            this.indexGates();
            this.indexZones();
            this.layout = this.computeLayout();
        }

        // ---- zones. A region is a faction's low-risk zone or a medium-risk zone (the export has no high-risk region
        // yet). Access is a character value some nodes grant: security_zone_access (Medium / High) and
        // enemy_faction_zone_access. Several nodes grant the same value, one per activity ladder (scanning in Data
        // Running, extraction in Mining, construction in Building); the export does not say whether each covers
        // every activity, so the grant on the activity's own track is preferred, else the cheapest, and the page
        // names the others.
        indexZones() {
            const cost = n => { const b = this.bill(this.closureOfNode(n), new Set(this.start ? [this.start.id] : [])); return [b.todo, Object.values(b.xp).reduce((a, v) => a + (v || 0), 0), n.order]; };
            const sort = list => list.map(n => ({ n, c: cost(n) })).sort((a, b) => a.c[0] - b.c[0] || a.c[1] - b.c[1] || a.c[2] - b.c[2]).map(x => x.n);
            this.zoneGrants = {
                medium: sort(this.nodes.filter(n => n.grants.security_zone_access === 'MediumRiskZone')),
                high: sort(this.nodes.filter(n => n.grants.security_zone_access === 'HighRiskZone')),
                enemy: sort(this.nodes.filter(n => n.grants.enemy_faction_zone_access))
            };
        }
        // 'own' | 'medium' | 'enemy' | 'high' for a body, seen by a player of `faction` ('mud' | 'oni' | 'ustur')
        zoneClass(body, faction) {
            const z = body.zone || { risk: 'medium' };
            if (z.risk === 'low') return z.faction === faction ? 'own' : 'enemy';
            return z.risk === 'high' ? 'high' : 'medium';
        }
        zoneGrant(cls, preferTrackKey) {
            const list = this.zoneGrants[cls] || [];
            return list.find(n => n.track.key === preferTrackKey) || list[0] || null;
        }
        zoneTags(cls, preferTrackKey) { const n = this.zoneGrant(cls, preferTrackKey); return n ? n.tags : []; }

        // How a player of `faction` gets one raw, and the research that takes.
        //   mode 'stake': a tier-1 claim stake where one can extract it (the least research a stake needs: the
        //                 extractor's own gates - drill type, Mining Gear T1, hardness, a faction-building node if
        //                 the kit is faction-locked - plus owning a tier-1 stake), a mining fleet where none can
        //   mode 'fleet': a mining fleet (the export gates no raw behind research for a ship; only the zone counts)
        // In both, the nearest zone class that has it wins: own low-risk zone, then medium risk, then another
        // faction's low-risk zone.
        rawRoute(res, faction, mode, se) {
            const bodies = se.bodiesOf(res.id);
            const exts = (se.extractors.get(res.id + '|1') || []);
            const mine = exts.filter(b => { const f = se.factionTag(b); return !f || f === faction; });
            const order = ['own', 'medium', 'enemy', 'high'];
            // within a zone class: bodies in the player's own territory first, then the richest
            const home = p => (String(p.terr).toLowerCase().startsWith(faction.slice(0, 3)) ? 0 : 1);
            const inClass = cls => bodies.filter(p => this.zoneClass(p, faction) === cls).sort((a, b) => home(a) - home(b) || b.deposits.get(res.id).richness - a.deposits.get(res.id).richness || a.name.localeCompare(b.name));
            const out = { res, route: 'none', cls: null, body: null, extractor: null, zoneNode: null, zoneAlts: [], tags: [], why: '' };
            const finish = (route, cls, body, prefer) => {
                out.route = route; out.cls = cls; out.body = { name: body.name, system: body.system, richness: body.deposits.get(res.id).richness, belt: body.cat === 3 };
                out.zoneNode = this.zoneGrant(cls, prefer); out.zoneAlts = (this.zoneGrants[cls] || []).filter(n => n !== out.zoneNode);
                const tags = new Set(out.zoneNode ? out.zoneNode.tags : []);
                if (route === 'stake') { this.buildingGate(out.extractor.id).forEach(t => tags.add(t)); this.stakeGate(1).forEach(t => tags.add(t)); }
                out.tags = Array.from(tags);
                return out;
            };
            if (mode === 'stake') {
                for (const cls of order) {
                    for (const p of inClass(cls)) { const b = p.stakeable && mine.find(x => se.usable(x, p, 1)); if (b) { out.extractor = b; return finish('stake', cls, p, 'Building'); } }
                }
                out.why = !exts.length ? 'no extractor kit' : !mine.length ? `extractor kit locked to ${se.factionTag(exts[0]).toUpperCase()}` : !bodies.some(p => p.stakeable) ? 'found on belts only' : 'no planet a stake can extract it on';
            }
            for (const cls of order) { const list = inClass(cls); if (list.length) return finish('fleet', cls, list[0], 'Mining'); }
            out.why = 'no deposit in the map data';
            return out;
        }
        // every raw under a recipe, each with its route; tags = the research all of it takes
        gather(recipe, faction, mode, se) {
            const rows = [], tags = new Set();
            if (!this.rc || mode === 'hand') return { rows, tags, mode };
            const rm = this.rc.rm;
            rm.dag(recipe.outputName).nodes.forEach(node => {
                if (!node.res || node.res.category !== 'raw' || node.name === recipe.outputName) return;
                const r = this.rawRoute(node.res, faction, mode, se); rows.push(r); r.tags.forEach(t => tags.add(t));
            });
            const rank = { own: 0, medium: 1, enemy: 2, high: 3 };
            rows.sort((a, b) => (a.route === 'none') - (b.route === 'none') || (rank[a.cls] || 0) - (rank[b.cls] || 0) || (a.route === 'fleet') - (b.route === 'fleet') || a.res.name.localeCompare(b.res.name));
            return { rows, tags, mode };
        }

        buildNodes(raw) {
            // a node's track is its tag, or the track its cost is paid on (Daily Check-In has no tag)
            const trackOf = n => {
                if (n.tag && TRACK_BY_LABEL.has(n.tag)) return TRACK_BY_LABEL.get(n.tag);
                const xp = n.cost && n.cost.xp_cost ? Object.keys(n.cost.xp_cost)[0] : null;
                return xp && TRACK_BY_KEY.has(xp) ? TRACK_BY_KEY.get(xp) : null;
            };
            this.nodes = []; this.dropped = [];
            raw.forEach((n, order) => {
                const track = trackOf(n);
                const cv = n.character_value_changes || null, cost = n.cost || null, req = n.requirements || null;
                if (!track) { this.dropped.push(n.name); return; }           // no track and no numbers: nothing to draw
                const grants = {}; if (cv) Object.keys(cv).forEach(k => { if (k !== 'research_tags') grants[k] = cv[k]; });
                this.nodes.push({
                    id: n.id, name: n.name, order, track, parentId: n.parent || null, hasData: !!(cv || cost || req),
                    tags: (cv && cv.research_tags) || [], grants,
                    level: (req && req.level) || {}, reqTags: (req && req.required_tags) || [],
                    atlas: (cost && cost.atlas_cost) || 0, points: (cost && cost.xp_cost) || {}, tokens: (cost && cost.token_cost) || {},
                    scalability: n.scalability || '', description: n.description || ''
                });
            });
            this.byId = new Map(this.nodes.map(n => [n.id, n]));
            this.byName = new Map(this.nodes.map(n => [n.name, n]));
            this.nodeOfTag = new Map();
            this.nodes.forEach(n => n.tags.forEach(t => this.nodeOfTag.set(t, n)));
            // prerequisites: the nodes that grant the required tags (the real gate); a node with no numbers hangs
            // off its editor parent so it still has a place in the tree
            this.nodes.forEach(n => {
                n.prereqs = n.reqTags.map(t => this.nodeOfTag.get(t)).filter(p => p && p !== n);
                n.primary = n.prereqs[0] || (!n.hasData && n.parentId ? this.byId.get(n.parentId) || null : null);
            });
            const depth = (n, trail) => {
                if (n.depth != null) return n.depth;
                if (trail.has(n)) return 0;
                trail.add(n);
                const ups = n.prereqs.length ? n.prereqs : (n.primary ? [n.primary] : []);
                n.depth = ups.length ? 1 + Math.max(...ups.map(p => depth(p, trail))) : 0;
                trail.delete(n);
                return n.depth;
            };
            this.nodes.forEach(n => depth(n, new Set()));
            this.start = this.nodes.find(n => n.tags.includes(0)) || null;
            this.tracks = TRACKS.filter(t => this.nodes.some(n => n.track === t));
        }

        indexGates() {
            // tag -> the recipes / buildings it is one of the gates of
            this.recipesByTag = new Map(); this.buildingsByTag = new Map();
            const add = (map, tag, id) => { let a = map.get(tag); if (!a) { a = []; map.set(tag, a); } a.push(id); };
            Object.entries(this.gate.recipes).forEach(([id, tags]) => tags.forEach(t => add(this.recipesByTag, t, id)));
            Object.entries(this.gate.buildings).forEach(([id, tags]) => tags.forEach(t => add(this.buildingsByTag, t, id)));
            this.gatedRecipes = Object.keys(this.gate.recipes).length;
            this.gatedBuildings = Object.keys(this.gate.buildings).length;
        }

        // every node needed to hold `tags`, prerequisites included
        closure(tags) {
            const need = new Set(), stack = Array.from(tags || []);
            while (stack.length) {
                const n = this.nodeOfTag.get(stack.pop());
                if (!n || need.has(n)) continue;
                need.add(n);
                n.reqTags.forEach(t => stack.push(t));
            }
            return need;
        }
        closureOfNode(node) { const s = this.closure(node.reqTags); s.add(node); return s; }

        xpFor(trackKey, level) {
            const t = TRACK_BY_KEY.get(trackKey), lv = t && this.thresholds[t.xp];
            if (!level) return 0;
            return lv && level >= 1 && level <= lv.length ? lv[level - 1] : null;
        }

        // what a set of nodes costs. owned (Set of node ids) is left out of the totals: the bill is what is still to do
        bill(nodeSet, owned) {
            const has = owned || new Set();
            const rows = Array.from(nodeSet).sort((a, b) => a.depth - b.depth || a.order - b.order).map(n => ({ node: n, owned: has.has(n.id) }));
            const levels = {}, points = {}, tokens = {}; let atlas = 0, todo = 0;
            rows.forEach(({ node: n, owned: o }) => {
                if (o) return;
                todo++;
                Object.entries(n.level).forEach(([k, v]) => { levels[k] = Math.max(levels[k] || 0, v); });
                Object.entries(n.points).forEach(([k, v]) => { points[k] = (points[k] || 0) + v; });
                Object.entries(n.tokens).forEach(([k, v]) => { const name = this.tokenNames[k] || ('cargo #' + k); tokens[name] = (tokens[name] || 0) + v; });
                atlas += n.atlas;
            });
            const xp = {}; Object.entries(levels).forEach(([k, v]) => { xp[k] = this.xpFor(k, v); });
            return { rows, todo, levels, xp, points, tokens, atlasBase: atlas, atlas: atlas / ATLAS_DECIMALS };
        }

        ownedTags(ownedIds) { const s = new Set(); (ownedIds || []).forEach(id => { const n = this.byId.get(id); if (n) n.tags.forEach(t => s.add(t)); }); return s; }

        // ---- gates of things
        recipeGate(outputId) { return this.gate.recipes[outputId] || []; }
        // craft it yourself from raws: the gates of every recipe in the chain (resolved the way the hub resolves chains)
        chainGate(recipe) {
            const tags = new Set(this.recipeGate(recipe.outputId));
            if (!this.rc) return tags;
            const rm = this.rc.rm;
            rm.dag(recipe.outputName).nodes.forEach(node => {
                if (node.name === recipe.outputName) return;
                const r = rm.recipeByName.get(node.name);
                if (r && r.ingredients && r.ingredients.length) this.recipeGate(r.outputId).forEach(t => tags.add(t));
            });
            return tags;
        }
        buildingGate(id) { return this.gate.buildings[id] || []; }
        stakeGate(tier) { return this.gate.claimStakes['claim-stake-tier-' + tier] || []; }
        habGate(id) { return this.gate.craftingHabs[id] || []; }
        shipSizeNode(sizeTier) { const v = SIZE_VALUE[sizeTier]; return v ? this.nodes.find(n => n.grants.max_ship_size === v) || null : null; }
        shipGate(ship) { const n = this.shipSizeNode(ship.sizeTier); return n ? n.tags : []; }

        // ---- what a node is a gate of
        unlocks(node) {
            const recipes = new Set(), buildings = new Set();
            node.tags.forEach(t => { (this.recipesByTag.get(t) || []).forEach(id => recipes.add(id)); (this.buildingsByTag.get(t) || []).forEach(id => buildings.add(id)); });
            const byType = new Map();
            if (this.rc) recipes.forEach(id => { const r = this.rc.byId.get(id); const k = r ? r.typeLabel : 'Other'; byType.set(k, (byType.get(k) || 0) + 1); });
            const stakes = Object.entries(this.gate.claimStakes).filter(([, tags]) => tags.some(t => node.tags.includes(t))).map(([id]) => id);
            const habs = Object.entries(this.gate.craftingHabs).filter(([, tags]) => tags.some(t => node.tags.includes(t))).map(([id]) => id);
            return { recipes: recipes.size, buildings: buildings.size, byType: Array.from(byType.entries()).sort((a, b) => b[1] - a[1]), stakes, habs, recipeIds: recipes };
        }
        // recipes whose every gate is held
        craftable(tagSet) {
            let n = this.recipeCount - this.gatedRecipes;
            Object.values(this.gate.recipes).forEach(tags => { if (tags.every(t => tagSet.has(t))) n++; });
            return n;
        }
        // recipes that become craftable the moment this node is added to what is held
        completes(node, tagSet) {
            const ids = new Set(); node.tags.forEach(t => (this.recipesByTag.get(t) || []).forEach(id => ids.add(id)));
            let n = 0;
            ids.forEach(id => { if (this.gate.recipes[id].every(t => tagSet.has(t) || node.tags.includes(t))) n++; });
            return n;
        }
        available(node, tagSet) { return node.hasData && node.reqTags.every(t => tagSet.has(t)); }

        // ---- tree layout: one band per track, x = prerequisite depth, rows from a leaf-order walk of the in-track tree
        computeLayout() {
            const bands = []; let row0 = 0;
            const maxDepth = Math.max(0, ...this.nodes.map(n => n.depth));
            this.tracks.forEach(track => {
                const mine = this.nodes.filter(n => n.track === track);
                const kids = new Map();
                const roots = [];
                mine.forEach(n => { if (n.primary && n.primary.track === track) { (kids.get(n.primary) || kids.set(n.primary, []).get(n.primary)).push(n); } else roots.push(n); });
                let row = 0; const seen = new Set();
                const place = n => {
                    if (seen.has(n)) return n.row; seen.add(n);
                    const ks = (kids.get(n) || []).filter(k => !seen.has(k));
                    if (!ks.length) { n.row = row++; return n.row; }
                    const ys = ks.map(place);
                    n.row = (ys[0] + ys[ys.length - 1]) / 2;
                    return n.row;
                };
                roots.sort((a, b) => a.depth - b.depth || a.order - b.order).forEach(place);
                mine.forEach(n => { if (!seen.has(n)) place(n); n.y = row0 + n.row; });
                bands.push({ track, from: row0, rows: row, count: mine.length });
                row0 += row + 1.2;
            });
            return { bands, rows: row0, maxDepth };
        }
    }
    ResearchModel.TRACKS = TRACKS; ResearchModel.TRACK_BY_KEY = TRACK_BY_KEY; ResearchModel.SIZE_VALUE = SIZE_VALUE;

    // -------------------------------------------------------------------------------------------- claim stakes
    class StakeEngine {
        constructor(buildingData, resourceModel, planetData) {
            const B = buildingData || {};
            this.bl = B.buildings || [];
            this.by = new Map(this.bl.map(b => [b.id, b]));
            this.rm = resourceModel;
            this.slots = {};
            (B.claimStakeDefinitions || []).forEach(d => { if (d.id.startsWith('claim-stake-')) this.slots[d.tier] = d.slots; });
            // extractors by the raw they extract, processors by tier
            this.extractors = new Map(); this.processors = new Map();
            this.bl.forEach(b => {
                const tags = b.addedTags || [];
                if (tags.includes('extractor') && b.resourceExtractionRate) {
                    Object.keys(b.resourceExtractionRate).forEach(raw => { const k = raw + '|' + b.tier; (this.extractors.get(k) || this.extractors.set(k, []).get(k)).push(b); });
                } else if (tags.includes('processor') && b.resourceRate) {
                    (this.processors.get(b.tier) || this.processors.set(b.tier, []).get(b.tier)).push(b);
                }
            });
            this.planets = []; this.planetByKey = new Map(); this._bodies = new Map();
            // region -> zone: {LowRiskZone: faction} is that faction's safe zone, a string is the risk level
            const zones = new Map(((planetData && planetData.regionDefinitions) || []).map(g => {
                const z = g.risk_zone;
                if (z && typeof z === 'object' && z.LowRiskZone) return [g.id, { risk: 'low', faction: String(z.LowRiskZone).toLowerCase(), region: g.name }];
                return [g.id, { risk: /high/i.test(String(z)) ? 'high' : 'medium', faction: null, region: g.name }];
            }));
            ((planetData && planetData.mapData) || []).forEach(s => (s.planets || []).forEach((p, i) => {
                const cat = p.type % 8;
                const deposits = new Map(); (p.resources || []).forEach(r => deposits.set(slug(r.name), { name: r.name, richness: r.richness }));
                const pl = { key: s.key + ':' + i, name: p.name, system: s.name || s.key, sysKey: s.key, xy: s.coordinates, type: p.type, cat, slug: PT_SLUG[cat], catName: PT_NAME[cat], faction: FACTION[Math.floor(p.type / 8)] || 'oni', terr: s.closestFaction || s.faction || '', deposits, stakeable: cat !== 3, zone: zones.get(s.regionId) || { risk: 'medium', faction: null, region: '' } };
                this.planets.push(pl); this.planetByKey.set(pl.key, pl);
                deposits.forEach((d, raw) => { (this._bodies.get(raw) || this._bodies.set(raw, []).get(raw)).push(pl); });
            }));
        }
        bodiesOf(raw) { return this._bodies.get(raw) || []; }                     // every body with a deposit of it, belts included
        factionTag(b) { return (b.requiredTags || []).find(t => FACTION.includes(t)) || null; }

        infra(planet, kind, tier) { return this.by.get(`${planet.slug}-${kind}-t${tier}`) || null; }
        resName(id) { const r = this.rm && this.rm.byId.get(id); return r ? r.name : id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
        inputs(b) { return Object.entries(b.resourceRate || {}).filter(([, v]) => v < 0); }
        outputs(b) { return Object.entries(b.resourceRate || {}).filter(([, v]) => v > 0); }

        // can this building stand on this planet in a standard stake of this tier (hubs aside)?
        usable(b, planet, tier) {
            if (b.tier !== tier) return false;
            return (b.requiredTags || []).every(t => {
                if (/-t\d$/.test(t)) return true;                                   // upgrade-path tags: ignored (fixed-tier rule)
                if (t.endsWith('-planet') || t === 'asteroid-belt') return t === PT_TAG[planet.cat];
                if (FACTION.includes(t)) return t === planet.faction;
                if (t === 'standard-stake-only') return true;
                if (t === 'cultivation-stake-only' || t === 'organic-focused') return false;
                if (t === 'tier-3-plus') return tier >= 3;
                let m;
                if ((m = /^enables-(.+)-(extraction|farming)$/.exec(t))) return planet.deposits.has(m[1]);
                if (/^enables-(.+)-processing$/.test(t)) return this.inputs(b).every(([k]) => planet.deposits.has(k));   // first-stage only
                return true;                                                         // hub and central-hub tags: the layout adds the hub
            });
        }
        extractorFor(planet, raw, tier) { return (this.extractors.get(raw + '|' + tier) || []).find(b => this.usable(b, planet, tier)) || null; }
        // raws this planet lets a tier-N stake extract, and the first-stage processors it lets it run
        extractable(planet, tier) { const out = []; planet.deposits.forEach((d, raw) => { const b = this.extractorFor(planet, raw, tier); if (b) out.push({ raw, name: d.name, richness: d.richness, b, rate: b.resourceExtractionRate[raw] }); }); return out; }
        processable(planet, tier) { return (this.processors.get(tier) || []).filter(b => this.inputs(b).length && this.usable(b, planet, tier)); }

        // One stake: alloc {raw: extractor count}, procs [processor id]. Hubs follow what is placed (plus the storage
        // hub), then crew quarters and power plants until crew is housed and power is not negative.
        layout(planet, tier, alloc, procs, opts) {
            const o = Object.assign({ storage: true }, opts || {});
            const S = this.slots[tier], central = this.infra(planet, 'central-hub', tier);
            if (!central || !planet.stakeable) return { ok: false, reason: 'no stake can stand here', S, used: 0, items: [], extractors: 0, processors: 0 };
            const items = [];                                                        // {b, n, role}
            Object.entries(alloc || {}).forEach(([raw, n]) => { if (n > 0) { const b = this.extractorFor(planet, raw, tier); if (b) items.push({ b, n, role: 'extractor', raw }); } });
            (procs || []).forEach(id => { const b = this.by.get(id); if (b && this.usable(b, planet, tier)) items.push({ b, n: 1, role: 'processor' }); });
            const hubs = new Set(); if (o.storage) hubs.add('storage-hub');
            items.forEach(it => (it.b.requiredTags || []).forEach(t => { if (HUB_FOR[t]) hubs.add(HUB_FOR[t]); }));
            const fixed = Array.from(hubs).map(k => this.infra(planet, k, tier)).filter(Boolean);
            const cq = this.infra(planet, 'crew-quarters', tier), pp = this.infra(planet, 'power-plant', tier);
            const sum = f => fixed.reduce((a, b) => a + (f(b) || 0), 0) + items.reduce((a, it) => a + (f(it.b) || 0) * it.n, 0);
            const s0 = sum(b => b.slots), p0 = central.power + sum(b => b.power);
            const cap0 = central.crewSlots + sum(b => b.crewSlots), need0 = central.neededCrew + sum(b => b.neededCrew);
            let ncq = 0, npp = 0, cap = cap0, need = need0, pw = p0;
            for (let guard = 0; guard < 20000; guard++) {
                cap = cap0 + ncq * cq.crewSlots + npp * pp.crewSlots;
                need = need0 + ncq * cq.neededCrew + npp * pp.neededCrew;
                pw = p0 + ncq * cq.power + npp * pp.power;
                if (cap < need) ncq++; else if (pw < 0) npp++; else break;
            }
            const used = s0 + ncq * cq.slots + npp * pp.slots;
            const all = [{ b: central, n: 1, role: 'central' }].concat(fixed.map(b => ({ b, n: 1, role: 'hub' })), ncq ? [{ b: cq, n: ncq, role: 'crew' }] : [], npp ? [{ b: pp, n: npp, role: 'power' }] : [], items);
            const extractors = items.filter(i => i.role === 'extractor').reduce((a, i) => a + i.n, 0);
            return {
                ok: used <= S, S, used, ncq, npp, hubs: Array.from(hubs), extractors, processors: items.filter(i => i.role === 'processor').length,
                power: pw, crewCap: cap, crewNeed: need, items: all, central,
                storage: all.reduce((a, it) => a + (it.b.storage || 0) * it.n, 0)
            };
        }

        // spread as many extractors as fit over `raws` (in that order, round-robin)
        autoAlloc(planet, tier, raws, procs) {
            const alloc = {}; const list = raws.filter(r => this.extractorFor(planet, r, tier));
            if (!list.length) return alloc;
            for (let i = 0, guard = 0; guard < 5000; guard++, i = (i + 1) % list.length) {
                const next = Object.assign({}, alloc); next[list[i]] = (next[list[i]] || 0) + 1;
                if (!this.layout(planet, tier, next, procs).ok) break;
                alloc[list[i]] = next[list[i]];
            }
            return alloc;
        }

        // production per TICK. richness: multiply deposit-based extraction by the deposit's richness (an assumption
        // the page states: the export has no formula for it)
        production(planet, tier, alloc, procs, opts) {
            const o = Object.assign({ richness: false }, opts || {});
            const L = this.layout(planet, tier, alloc, procs, o);
            const mult = raw => (o.richness && planet.deposits.has(raw) ? planet.deposits.get(raw).richness : 1);
            const ext = new Map(), passive = new Map();
            L.items.forEach(it => {
                if (it.role === 'extractor') ext.set(it.raw, (ext.get(it.raw) || 0) + it.n * it.b.resourceExtractionRate[it.raw] * mult(it.raw));
                if (it.role === 'central') Object.entries(it.b.resourceExtractionRate || {}).forEach(([raw, v]) => { if (planet.deposits.has(raw)) passive.set(raw, v * mult(raw)); });   // owner rule 2026-10-03
            });
            const avail = new Map(ext); passive.forEach((v, k) => avail.set(k, (avail.get(k) || 0) + v));
            const gross = new Map(avail), made = new Map(), procRows = [];
            L.items.filter(it => it.role === 'processor').forEach(it => {
                const ins = this.inputs(it.b), outs = this.outputs(it.b);
                const f = ins.length ? Math.min(1, ...ins.map(([k, v]) => (avail.get(k) || 0) / -v)) : 0;
                ins.forEach(([k, v]) => avail.set(k, (avail.get(k) || 0) + v * f));
                outs.forEach(([k, v]) => made.set(k, (made.get(k) || 0) + v * f));
                procRows.push({ b: it.b, fed: f, makes: outs.map(([k, v]) => ({ id: k, name: this.resName(k), rate: v, out: v * f })), from: ins.map(([k, v]) => ({ id: k, name: this.resName(k), rate: -v, used: -v * f })) });
            });
            const net = new Map(); avail.forEach((v, k) => { if (v > 1e-12) net.set(k, v); }); made.forEach((v, k) => net.set(k, (net.get(k) || 0) + v));
            let fuel = 0; L.items.forEach(it => { const v = (it.b.resourceRate || {}).fuel; if (v < 0) fuel += -v * it.n; });
            return { layout: L, net, gross, extracted: ext, passive, made, procs: procRows, fuel };
        }

        // the reference "full stake": every extractor that fits, all on one raw (stats are the same on every planet type)
        fullStake(tier, raw) {
            const planet = { slug: 'terrestrial', cat: 0, faction: 'oni', stakeable: true, deposits: new Map([[raw, { name: raw, richness: 1 }]]) };
            const cands = this.extractors.get(raw + '|' + tier) || [];
            const b = cands[0] || null; if (!b) return null;
            const fake = Object.assign({}, planet, { cat: PT_TAG.findIndex(t => (b.requiredTags || []).includes(t)) }); if (fake.cat < 0) fake.cat = 0; fake.slug = PT_SLUG[fake.cat];
            const fac = (b.requiredTags || []).find(t => FACTION.includes(t)); if (fac) fake.faction = fac;
            let k = 0, L = this.layout(fake, tier, {}, []);
            for (let n = 1; n < 5000; n++) { const t = this.layout(fake, tier, { [raw]: n }, []); if (!t.ok) break; k = n; L = t; }
            return { tier, raw, k, rate: b.resourceExtractionRate[raw], perTick: k * b.resourceExtractionRate[raw], storage: L.storage, ncq: L.ncq, npp: L.npp, used: L.used, S: L.S, crew: L.crewNeed };
        }
    }
    StakeEngine.HUB_LABEL = HUB_LABEL; StakeEngine.PT_NAME = PT_NAME;

    // ------------------------------------------------------------------------------------------------- empire
    class Empire {
        constructor(stakeEngine, recipeModel, ships) {
            this.se = stakeEngine; this.rc = recipeModel; this.rm = recipeModel.rm;
            this.ships = (ships || []).map(s => ({
                name: s.name, size: s.sizeTier, spec: s.spec, crew: (s.crew && s.crew.required) || 0,
                rate: (s.stats && s.stats.mining && s.stats.mining.asteroidMiningRate) || 0,
                food: (s.stats && s.stats.mining && s.stats.mining.asteroidMiningFoodRate) || 0,
                cargo: (s.stats && s.stats.capacities && s.stats.capacities.cargoCapacity) || 0
            }));
            this.shipByName = new Map(this.ships.map(s => [s.name, s]));
            this.miners = this.ships.filter(s => s.rate > 0).sort((a, b) => b.rate - a.rate || a.name.localeCompare(b.name));
        }

        // the plan's bill, expanded like the Recipe Explorer's planner but stopping at anything in `stop` (goods a
        // stake processor already makes). items: [{id, qty}]
        expand(items, stop) {
            const stopAt = stop || new Set();
            const leaves = new Map(), crafts = new Map(), byItem = [];
            let sequential = 0;
            const walk = (name, qty, trail, viaRecipe, own) => {
                const res = this.rm.byName.get(name), rec = viaRecipe || this.rm.recipeByName.get(name);
                const isRaw = res && res.category === 'raw';
                const craftable = !isRaw && rec && rec.ingredients && rec.ingredients.length && !trail.has(name) && !(stopAt.has(name) && !viaRecipe);
                if (!craftable) { leaves.set(name, (leaves.get(name) || 0) + qty); own.set(name, (own.get(name) || 0) + qty); return; }
                const n = Math.ceil(qty / (rec.outputQuantity || 1));
                crafts.set(name, (crafts.get(name) || 0) + n); sequential += n * (rec.constructionTime || 0);
                trail.add(name);
                rec.ingredients.forEach(i => walk(i.name, i.quantity * n, trail, null, own));
                trail.delete(name);
            };
            (items || []).forEach(it => { const rec = this.rc.byId.get(it.id); if (!rec) return; const own = new Map(); walk(rec.outputName, it.qty, new Set(), rec, own); byItem.push({ id: it.id, name: rec.outputName, qty: it.qty, leaves: own }); });
            let craftCount = 0; crafts.forEach(n => { craftCount += n; });
            return { leaves, crafts, craftCount, sequential, byItem };
        }

        // stakes: [{id, key, tier, alloc, procs}], fleets: [{id, ship, count, raw (name), richness}]
        // tick: seconds per stake tick (INPUT - not in the data). Supply is returned per hour.
        coverage(items, stakes, fleets, opts) {
            const o = Object.assign({ tick: 60, richness: true }, opts || {});
            const perTickToHour = 3600 / o.tick;
            const sources = [];
            const stop = new Set();
            (stakes || []).forEach(s => {
                const planet = this.se.planetByKey.get(s.key); if (!planet) return;
                const p = this.se.production(planet, s.tier, s.alloc, s.procs, { richness: o.richness });
                const supply = new Map(); p.net.forEach((v, id) => supply.set(this.se.resName(id), v * perTickToHour));
                p.made.forEach((v, id) => { if (v > 0) stop.add(this.se.resName(id)); });
                sources.push({ id: s.id, kind: 'stake', label: `T${s.tier} ${planet.name}`, planet, tier: s.tier, prod: p, supply });
            });
            (fleets || []).forEach(f => {
                const ship = this.shipByName.get(f.ship); if (!ship || !f.raw) return;
                const perSec = ship.rate * (f.count || 1) * (f.richness || 1);
                sources.push({ id: f.id, kind: 'fleet', label: `${f.count || 1} × ${ship.name.replace(/^Armstrong /, '')}`, ship, count: f.count || 1, perSec, supply: new Map([[f.raw, perSec * 3600]]) });
            });
            const x = this.expand(items, stop);
            const rows = Array.from(x.leaves.entries()).map(([name, need]) => {
                const res = this.rm.byName.get(name) || null;
                const from = sources.map(s => ({ id: s.id, perHour: s.supply.get(name) || 0 })).filter(r => r.perHour > 0);
                const perHour = from.reduce((a, r) => a + r.perHour, 0);
                return { name, res, need, perHour, hours: perHour > 0 ? need / perHour : Infinity, from, users: x.byItem.filter(b => b.leaves.has(name)).map(b => ({ id: b.id, name: b.name, units: b.leaves.get(name) })) };
            }).sort((a, b) => (b.hours === a.hours ? b.need - a.need : (b.hours === Infinity ? 1 : a.hours === Infinity ? -1 : b.hours - a.hours)));
            const covered = rows.filter(r => r.perHour > 0);
            return { rows, sources, expansion: x, stop, covered: covered.length, uncovered: rows.filter(r => r.perHour <= 0), hours: covered.length ? Math.max(...covered.map(r => r.hours)) : 0, tick: o.tick };
        }

        // bodies that carry a raw (belts included: ships mine anywhere). rank(planet) orders them first - the page
        // passes the zone seen by the player's faction, so the home zone comes before riskier ones - then richness
        bodiesFor(rawName, rank) {
            const id = slug(rawName), out = [];
            this.se.bodiesOf(id).forEach(p => { out.push({ key: p.key, name: p.name, system: p.system, catName: p.catName, belt: p.cat === 3, richness: p.deposits.get(id).richness, rank: rank ? rank(p) : 0, planet: p }); });
            return out.sort((a, b) => a.rank - b.rank || b.richness - a.richness || a.name.localeCompare(b.name));
        }
    }

    // ----------------------------------------------------------------------------------- ships vs stakes maths
    // perTick: what the stake makes in one tick; perSec: what the ship mines in one second (same deposit, so richness
    // cancels). Everything else follows from the tick length.
    const Calc = {
        breakEvenTick(perTick, perSec) { return perSec > 0 ? perTick / perSec : null; },                // tick at which they are equal
        perHourStake(perTick, tick) { return perTick * 3600 / tick; },
        perHourShip(perSec) { return perSec * 3600; },
        breakEvenTickPerDollar(perTick, stakePrice, perSec, shipPrice) { return perSec > 0 && stakePrice > 0 && shipPrice > 0 ? (perTick / stakePrice) / (perSec / shipPrice) : null; },
        fairPrice(perTick, tick, perSec, shipPrice) { return perSec > 0 && shipPrice > 0 ? (perTick / tick) / (perSec / shipPrice) : null; },   // stake price that matches the ship per dollar
        measuredTick(rate, richness, unitsPerHour) { return unitsPerHour > 0 ? 3600 * rate * richness / unitsPerHour : null; }
    };

    window.CommandDeck = { ResearchModel, StakeEngine, Empire, Calc, slug, PT_NAME, PT_SLUG, FACTION, TRACKS, ATLAS_DECIMALS };
})();
