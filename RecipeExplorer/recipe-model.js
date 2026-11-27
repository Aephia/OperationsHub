// recipe-model.js - Recipe Explorer model (rebuilt 2026-10-01). Sits on top of ResourceModel (shared with the
// Resources Explorer: recipe per output name live-first, deduplicated supply DAG, deposits, extractor kits) and adds
// what a PRODUCTION PLAN needs:
//   - every recipe by outputId (5,251; 318 output names repeat across tiers, so the plan keys by id)
//   - expand(recipeId, qty): walk the tree with quantities - units needed and crafts per intermediate
//     (crafts = ceil(units / outputQuantity)), raw totals, the aggregated DAG with quantities on the edges
//   - plan(items): the merged bill for several recipes: raws (with stake-minable / belt-only / fleet flags from
//     ResourceModel), craft list in build order (deepest first), time: critical path (longest chain of
//     constructionTime, everything in parallel) and total craft time (every craft in sequence), where it can be
//     crafted (planet types common to every crafted step, highest starbase level, faction limits), release status
// constructionTime is read as seconds, as the ClaimStake Explorer reads it (units are not stated in the export).
// Alternative recipes (owner rule): a row whose output name carries a bracket tag ("<Name> [<tag>]") is another way
// to make the PLAIN item (every " [..]" tag
// stripped), there so a faction does not depend on a rival's exclusive raw. A tagged ingredient name is the plain item
// too. baseName / tags / isAlternative / res per recipe; alternatives(recipe); canMakeWithoutRivals(recipe, faction);
// expand / plan take { faction } to route each step away from rival raws. No faction = the old behaviour, unchanged.
(function () {
    'use strict';

    // the data spells USTUR three ways (USTUR, Ustur, UST)
    const FAC_CANON = { MUD: 'MUD', ONI: 'ONI', USTUR: 'USTUR', UST: 'USTUR' };
    const FACTIONS = ['MUD', 'ONI', 'USTUR'];
    const canonFaction = f => FAC_CANON[String(f == null ? '' : f).trim().toUpperCase()] || null;
    const TAG_RE = /\s*\[([^\]]*)\]/g;
    // a readable label per tag; tag families the export does not explain keep their own text
    const tagLabel = raw => {
        const t = String(raw).trim(); let m;
        if ((m = /^starter T(\d+)\/(\w+)$/i.exec(t))) return `Starter T${m[1]} · ${canonFaction(m[2]) || m[2]}`;
        if ((m = /^Zone (\d+) manufacture$/i.exec(t))) return `Zone ${m[1]} manufacture`;
        if ((m = /^Zone (\d+)\/(\w+) manufacture$/i.exec(t))) return `Zone ${m[1]} manufacture · ${canonFaction(m[2]) || m[2]}`;
        if ((m = /^common starter construction T(\d+)$/i.exec(t))) return `Common starter construction T${m[1]}`;
        if ((m = /^(\S+) (MUD|ONI|UST|USTUR)$/i.exec(t))) return `${m[1]} · ${canonFaction(m[2])}`;
        return t;
    };
    // Addendum 3 G2 (owner): a recipe row's KIND for the list's filter chips, in words. From the tags when the name has
    // any ("Z<n>" = Zone <n> and "CS<n>" = Starter construction, as their ids say; "G<n>" stays as written; a tag of no
    // known shape stays as written); an untagged row from its
    // id (candidate:starter:... = Starter, zone:N: = Zone N). A row with none of those is "Standard". Then the faction a
    // tag names and, for a faction-only row, its faction(s). Two families: KIND_FAMILY.kind and .faction.
    // Rule: every kind matching /^Zone \d+/ ranks in the ZONE_SLOT position (after 'Starter'), in number order (Zone 2
    // before Zone 10), so a zone the data adds later needs no edit here. KIND_ORDER lists the fixed kinds only.
    const KIND_ORDER = ['Standard', 'Starter', 'Zone N', 'Starter construction', 'G1', 'G2', 'MUD', 'ONI', 'USTUR'];
    const ZONE_SLOT = KIND_ORDER.indexOf('Zone N');
    // the position of a kind in KIND_ORDER (a zone kind: inside its slot by number); a kind not listed gets `missing`
    const kindIndex = (x, missing) => {
        const z = /^Zone (\d+)/.exec(x);
        if (z) return ZONE_SLOT + Number(z[1]) / (Number(z[1]) + 1);
        const i = KIND_ORDER.indexOf(x);
        return i < 0 ? missing : i;
    };
    const kindsOf = (outputName, outputId, fac) => {
        const k = new Set(), tags = RecipeModel.tagsOf(outputName), F = f => { const c = canonFaction(f); if (c) k.add(c); };
        tags.forEach(t => {
            let m;
            if ((m = /^Zone (\d+)(?:\/(\w+))? manufacture$/i.exec(t)) || (m = /^Z(\d+)(?: (\w+))?$/.exec(t))) { k.add('Zone ' + m[1]); if (m[2]) F(m[2]); }
            else if (/^CS\d+$/.test(t) || /^common starter construction T\d+$/i.test(t)) k.add('Starter construction');
            else if ((m = /^starter T\d+\/(\w+)$/i.exec(t))) { k.add('Starter'); F(m[1]); }
            else if ((m = /^(G\d+) (\w+)$/.exec(t))) { k.add(m[1]); F(m[2]); }
            else k.add(t);
        });
        if (!tags.length) {
            const s = String(outputId || '').split(':'), z = s.indexOf('zone');
            if (s[0] === 'candidate' && s[1] === 'starter') k.add('Starter');
            if (z >= 0 && /^\d+$/.test(s[z + 1] || '')) k.add('Zone ' + s[z + 1]);
        }
        if (!Array.from(k).some(x => !FACTIONS.includes(x))) k.add('Standard');
        if (fac && fac.length && fac.length < 3) fac.forEach(F);
        const at = x => kindIndex(x, KIND_ORDER.indexOf('MUD') - 0.5);
        return Array.from(k).sort((a, b) => at(a) - at(b) || a.localeCompare(b));
    };

    const STATUS_RANK = { v1: 0, 'v1-add': 1, v2: 2 };
    const TYPE_LABEL = {
        BUILDING: 'Building', SHIP_WEAPONS: 'Ship weapon', SHIP_COMPONENTS: 'Ship component', COUNTERMEASURES: 'Countermeasure', MISSILES: 'Missile',
        COMPONENT: 'Component', SHIP_MODULES: 'Ship module', INGREDIENT: 'Ingredient', 'BASIC RESOURCE': 'Basic resource', SHIP: 'Ship',
        'ORGANIC CONSUMABLE': 'Organic consumable', HAB_ASSETS: 'Hab asset', DRONE: 'Drone', 'BASIC ORGANIC RESOURCE': 'Basic organic', 'ORGANIC COMPONENT': 'Organic component', R4: 'R4'
    };
    const TYPE_ORDER = ['SHIP', 'SHIP_COMPONENTS', 'SHIP_MODULES', 'SHIP_WEAPONS', 'MISSILES', 'COUNTERMEASURES', 'DRONE', 'COMPONENT', 'INGREDIENT', 'BUILDING', 'HAB_ASSETS', 'ORGANIC CONSUMABLE', 'ORGANIC COMPONENT', 'BASIC RESOURCE', 'BASIC ORGANIC RESOURCE', 'R4'];

    class RecipeModel {
        constructor(resourceModel) {
            this.rm = resourceModel;
            this.recipes = resourceModel.recipes.map(r => {
                const fac = Array.from(new Set((r.factions || []).map(canonFaction).filter(Boolean)));
                const base = RecipeModel.baseName(r.outputName), tagRaw = RecipeModel.tagsOf(r.outputName);
                return Object.assign({}, r, {
                    typeLabel: TYPE_LABEL[r.outputType] || r.outputType,
                    starbase: parseInt(String(r.min_starbase_level || '').replace(/\D/g, ''), 10) || 1,
                    fac: fac.length ? fac : FACTIONS.slice(),   // canonical; a row naming no faction is open to all
                    factionOnly: fac.length && fac.length < 3 ? fac.join(', ') : '',
                    ingredientCount: new Set((r.ingredients || []).map(i => i.name)).size,
                    outputQuantity: r.outputQuantity || 1,
                    baseName: base, tagRaw, tags: tagRaw.map(tagLabel), isAlternative: tagRaw.length > 0,
                    kinds: kindsOf(r.outputName, r.outputId, fac),   // addendum 3 G2: the list's kind chips
                    res: resourceModel.byName.get(base) || null,
                    // a tagged row makes its base item, so it counts as that item (owner rule)
                    isResource: resourceModel.byName.has(base)
                });
            });
            this.byId = new Map(this.recipes.map(r => [r.outputId, r]));
            this.byBase = new Map();
            this.recipes.forEach(r => { const l = this.byBase.get(r.baseName); if (l) l.push(r); else this.byBase.set(r.baseName, [r]); });
            this._safe = new Map(); this._route = new Map(); this._excl = new Map();
            this.recipes.forEach(r => { r.depth = this.rm.dag(r.outputName).depth; r.nodeCount = this.rm.dag(r.outputName).nodes.size - 1; });
            this.stats = this.computeStats();
        }

        // --------------------------------------------------------------- alternative recipes
        // the resource a recipe or an ingredient name stands for: its own name, else its base name
        resOf(name) { return this.rm.byName.get(name) || this.rm.byName.get(RecipeModel.baseName(name)) || null; }

        // ResourceModel hands out the data rows; this model's own copy of a row carries fac / tags / starbase
        own(r) { return r ? (this.byId.get(r.outputId) || r) : r; }

        // the faction that owns an exclusive raw (18 raws carry `faction`), or null
        ownerOf(name) { const r = this.rm.byName.get(name); return r && r.category === 'raw' && r.faction ? canonFaction(r.faction) : null; }

        // Base names a faction can make with no rival exclusive raw, by any route (least fixed point): a raw is fine
        // unless a rival owns it; an item is fine when one of its recipes the faction may craft (or, if it may craft
        // none, any of its recipes) has every ingredient fine. Buildings are not routes. Memoised per faction.
        safeSet(faction) {
            const f = canonFaction(faction); if (!f) return null;
            if (this._safe.has(f)) return this._safe.get(f);
            const B = RecipeModel.baseName;
            const raw = new Set(this.rm.list.filter(r => r.category === 'raw').map(r => r.name));
            const nb = this.recipes.filter(r => String(r.outputType || '').toUpperCase() !== 'BUILDING');
            const prod = new Map();
            nb.forEach(r => { const b = B(r.outputName); if (raw.has(b)) return; const l = prod.get(b); if (l) l.push(r); else prod.set(b, [r]); });
            const ok = new Set(Array.from(raw).filter(n => { const o = this.ownerOf(n); return !o || o === f; }));
            nb.forEach(r => (r.ingredients || []).forEach(i => { const b = B(i.name); if (!raw.has(b) && !prod.has(b)) ok.add(b); }));
            let changed = true;
            while (changed) {
                changed = false;
                prod.forEach((rows, n) => {
                    if (ok.has(n)) return;
                    const mine = rows.filter(r => r.fac.includes(f)), pool = mine.length ? mine : rows;
                    if (pool.some(r => (r.ingredients || []).every(i => ok.has(B(i.name))))) { ok.add(n); changed = true; }
                });
            }
            this._safe.set(f, ok);
            return ok;
        }

        // can this faction make this recipe with no rival exclusive raw, by any allowed route?
        // { allowed: the faction may craft the row, clean: every ingredient can be had with no rival raw, ok: both }
        canMakeWithoutRivals(recipe, faction) {
            const r = typeof recipe === 'string' ? this.byId.get(recipe) : recipe, f = canonFaction(faction), ok = this.safeSet(f);
            if (!r || !ok) return null;
            const allowed = r.fac.includes(f), clean = (r.ingredients || []).every(i => ok.has(RecipeModel.baseName(i.name)));
            return { allowed, clean, ok: allowed && clean };
        }

        // The recipe a faction uses for an item name. Candidates: the recipe as named (a tagged ingredient keeps its
        // own tagged recipe), then the plain one, then the other alternatives nearest in tier. Of those the faction
        // may craft (all of them if it may craft none), the first whose ingredients need no rival raw; else the first.
        route(name, faction, via) {
            const f = canonFaction(faction), def = via || this.own(this.rm.recipeByName.get(name));
            if (!f) return def;
            const key = f + '\u0000' + name + '\u0000' + (via ? via.outputId : '');
            if (this._route.has(key)) return this._route.get(key);
            const res = this.rm.byName.get(name);
            let pick = def;
            if (!(res && res.category === 'raw')) {
                const base = RecipeModel.baseName(name), ok = this.safeSet(f);
                const tier = def ? def.outputTier : 0;
                const rest = (this.byBase.get(base) || []).filter(r => r !== def && String(r.outputType || '').toUpperCase() !== 'BUILDING')
                    .sort((a, b) => (b.outputName === base) - (a.outputName === base) || Math.abs(a.outputTier - tier) - Math.abs(b.outputTier - tier) || a.starbase - b.starbase || a.outputId.localeCompare(b.outputId));
                const cands = (def ? [def] : []).concat(rest).filter(r => r.ingredients && r.ingredients.length);
                const mine = cands.filter(r => r.fac.includes(f)), pool = mine.length ? mine : cands;
                pick = pool.find(r => r.ingredients.every(i => ok.has(RecipeModel.baseName(i.name)))) || pool[0] || def;
            }
            this._route.set(key, pick);
            return pick;
        }

        // the exclusive raws anywhere in a recipe's tree as written (no routing), with their owner
        exclusiveRaws(recipe) {
            if (this._excl.has(recipe.outputId)) return this._excl.get(recipe.outputId);
            const out = [];
            this.expand([{ id: recipe.outputId, qty: 1 }]).raws.forEach((q, n) => { const o = this.ownerOf(n); if (o) out.push({ name: n, owner: o }); });
            out.sort((a, b) => a.owner.localeCompare(b.owner) || a.name.localeCompare(b.name));
            this._excl.set(recipe.outputId, out);
            return out;
        }

        // the rival raws a faction still needs for one recipe kept as it is, its ingredients routed (sheet verdicts)
        rivalRawsFor(recipe, faction) {
            const f = canonFaction(faction); if (!f) return [];
            return this.plan([{ id: recipe.outputId, qty: 1 }], { faction: f, pinRoots: true }).rival;
        }

        // every OTHER recipe that makes the same base item (plain and tagged), for the "Other ways to make it" panel
        alternatives(recipe) {
            const r = typeof recipe === 'string' ? this.byId.get(recipe) : recipe; if (!r) return [];
            return (this.byBase.get(r.baseName) || []).filter(x => x !== r).map(x => ({
                recipe: x, id: x.outputId, label: x.isAlternative ? x.tags.join(' · ') : 'Standard', tags: x.tags,
                factions: x.fac.slice(), starbase: x.starbase, tier: x.outputTier,
                ingredients: (x.ingredients || []).map(i => ({ name: i.name, quantity: i.quantity })),
                exclusive: this.exclusiveRaws(x)
            })).sort((a, b) => (a.recipe.isAlternative - b.recipe.isAlternative) || a.tier - b.tier || a.label.localeCompare(b.label));
        }

        // --------------------------------------------------------------- items and ways (owner rule)
        // The finder lists ITEMS, not recipe rows. An item = an output name at one outputTier: untagged rows of the SAME
        // name and the SAME outputTier are one item made different ways (fix 1 L1 + add-on #11: a standard row with
        // a faction's own candidate:starter row of the same tier, or several numbered rows of one name). BUILDING rows are excluded and
        // stay one row each (the Storage Module rows of one tier differ by planet type; routing never uses a building).
        // Rows of another tier stay apart ("Other tiers of this output"). The item's HEAD (its finder row) is the plain-id
        // row (no ':' in the id), preferring one all three factions may craft, then the lowest id; its other same-tier
        // rows are `sibs`. A tagged row never gets a row of its own: it is a WAY of the head of its base nearest in tier
        // (then by id). A base with no untagged row joins the item its ids name (addendum 3, "attach by id" below), else
        // shows once, through its first tagged row. These items are the list's HEADINGS since addendum 3 (the list shows
        // every recipe row under its item: findRecipeRows). Memoised.
        finderRows() {
            if (this._rows) return this._rows;
            const rows = [], first = (a, b) => a.outputTier - b.outputTier || a.outputId.localeCompare(b.outputId);
            const isB = r => String(r.outputType || '').toUpperCase() === 'BUILDING';
            const headOf = g => g.slice().sort((a, b) => /:/.test(a.outputId) - /:/.test(b.outputId) || (b.fac.length === 3) - (a.fac.length === 3) || a.outputId.localeCompare(b.outputId))[0];
            this._itemOf = new Map();
            const orphans = [], headRow = new Map();
            this.byBase.forEach(list => {
                let std = list.filter(r => !r.isAlternative), alt = list.filter(r => r.isAlternative);
                // A starter row may carry no tag, only its id (candidate:starter:<item>:<hash>, the plain item name, at a
                // tier next to the standard row's). An untagged starter row at a tier where its name has no other (non-building) row is a way
                // of the item nearest in tier, as the tagged starter rows were - else it was an item of its own while
                // route() still sent a faction's plan through it, a recipe the sheet's ways never listed.
                const starter = r => /^candidate:starter:/.test(r.outputId) && !isB(r);
                const own = new Set(std.filter(r => !starter(r) && !isB(r)).map(r => r.outputTier));
                if (own.size) { const mv = std.filter(r => starter(r) && !own.has(r.outputTier)); if (mv.length) { std = std.filter(r => !mv.includes(r)); alt = alt.concat(mv); } }
                alt.sort(first);
                if (!std.length) { orphans.push(alt); return; }   // addendum 3: placed after every base with a standard row
                const groups = new Map();
                std.forEach(r => { const k = isB(r) ? 'B\u0000' + r.outputId : r.outputName + '\u0000' + r.outputTier; const g = groups.get(k); if (g) g.push(r); else groups.set(k, [r]); });
                const heads = std.length
                    ? Array.from(groups.values()).map(g => { const h = headOf(g); return { r: h, sibs: g.filter(x => x !== h), alts: [], ways: 1 }; })
                    : [{ r: alt[0], sibs: [], alts: [], ways: 1 }];
                alt.forEach(a => {
                    if (a === heads[0].r) return;
                    const h = heads.slice().sort((x, y) => Math.abs(x.r.outputTier - a.outputTier) - Math.abs(y.r.outputTier - a.outputTier) || x.r.outputId.localeCompare(y.r.outputId))[0];
                    h.alts.push(a); this._itemOf.set(a.outputId, h.r);
                });
                heads.forEach(h => { this._itemOf.set(h.r.outputId, h.r); h.sibs.forEach(s => this._itemOf.set(s.outputId, h.r)); rows.push(h); headRow.set(h.r.outputId, h); });
            });
            // Addendum 3 G1 "attach by id": a tagged row whose base has NO standard recipe joins the item whose standard
            // (untagged, non-building) row has the outputId named by the tagged row's id - its last ':' segment, a trailing
            // hex hash skipped ("<kind>:...:<item id>:<hash>" joins the item whose standard row is <item id>). No such
            // row: the base stays an item
            // of its own, headed by its first tagged row (tier, id), as before. `attached` lists every row moved.
            this.attached = [];
            orphans.forEach(alt => {
                const stay = alt.filter(a => {
                    const s = a.outputId.split(':'); if (s.length > 2 && /^[0-9a-f]{8,}$/.test(s[s.length - 1]) && !this.byId.has(s[s.length - 1])) s.pop();
                    const t = this.byId.get(s[s.length - 1]), h = t && !t.isAlternative && !isB(t) && headRow.get((this._itemOf.get(t.outputId) || t).outputId);
                    if (!h) return true;
                    h.alts.push(a); h.alts.sort(first); this._itemOf.set(a.outputId, h.r); this.attached.push({ id: a.outputId, to: h.r.outputId });
                    return false;
                });
                if (!stay.length) return;
                const h = { r: stay[0], sibs: [], alts: stay.slice(1), ways: 1 };
                stay.forEach(a => this._itemOf.set(a.outputId, h.r)); rows.push(h); headRow.set(h.r.outputId, h);
            });
            this._rows = rows; this._rowOf = new Map(rows.map(x => [x.r.outputId, x]));
            this._ways = new Map();
            rows.forEach(x => { x.ways = this.wayRecipes(x.r).length; });   // the "N ways" marker = the ways box
            return rows;
        }

        // every recipe that makes a recipe's item: the head, its same-tier untagged siblings, then its tagged
        // alternatives. Memoised per item; any way gives its item's list.
        wayRecipes(recipe) {
            const item = this.itemOf(recipe); if (!item) return [];
            if (this._ways.has(item.outputId)) return this._ways.get(item.outputId);
            const row = this._rowOf.get(item.outputId), out = row ? [row.r].concat(row.sibs, row.alts) : [item];
            this._ways.set(item.outputId, out);
            return out;
        }

        // is `way` one of the ways to make `item` (both recipes or ids)?
        isWayOf(way, item) { const w = typeof way === 'string' ? this.byId.get(way) : way; return !!w && this.wayRecipes(item).includes(w); }

        // the default recipe the unrouted walk uses for an output name (ResourceModel's first row of that name)
        defaultOf(name) { return this.own(this.rm.recipeByName.get(name)) || null; }

        // what a way IS, in words: its tags (a tagged alternative), "Standard" (the item's head row), a faction's own
        // recipe ("USTUR recipe", an untagged faction-only sibling), else "Other recipe" (an untagged all-faction sibling)
        wayLabel(recipe) {
            const r = typeof recipe === 'string' ? this.byId.get(recipe) : recipe; if (!r) return '';
            if (r.isAlternative) return r.tags.join(' · ');
            if (this.itemOf(r) === r) return 'Standard';
            if (r.fac.length < 3) return `${r.fac.join('/')} recipe`;
            // 2026-11-19: an untagged starter row open to all factions says what tells it apart now its tag is gone - its
            // tier and the exclusive raws of its chain with their owner ("Starter T1 · Diamond (MUD)")
            if (/^candidate:starter:/.test(r.outputId)) { const x = this.starterNote(r); return `Starter T${r.outputTier}` + (x ? ' · ' + x : ''); }
            return 'Other recipe';
        }

        // 2026-11-19: the exclusive raws (with owner) of an untagged starter row open to all factions, else '' - the list
        // row and the way label use it so two starter rows of one item never read the same
        starterNote(recipe) {
            const r = typeof recipe === 'string' ? this.byId.get(recipe) : recipe;
            if (!r || r.isAlternative || r.fac.length < 3 || !/^candidate:starter:/.test(r.outputId)) return '';
            return this.exclusiveRaws(r).map(e => `${e.name} (${e.owner})`).join(', ');
        }

        // untagged rows with the item's name that are NOT among its ways (other tiers; same-tier buildings): the sheet's
        // "Other tiers of this output" links, as before fix 0 (M4)
        otherTiers(recipe) {
            const item = this.itemOf(recipe); if (!item) return [];
            const ways = this.wayRecipes(item);
            return this.recipes.filter(x => x.outputName === item.outputName && !ways.includes(x));
        }

        // the finder row (item) a recipe belongs to: an untagged row is its own item, a tagged row its row's item
        itemOf(recipe) {
            const r = typeof recipe === 'string' ? this.byId.get(recipe) : recipe; if (!r) return null;
            this.finderRows();
            return this._itemOf.get(r.outputId) || r;
        }

        // a link's recipe (?recipe=, ?plan=): an id, else an output id or name, else an id suffix -> { item, way }
        // where way is the recipe the link named when it is not the item's own row (a tagged id), else null
        resolveLink(text) {
            const s = String(text == null ? '' : text), lower = s.toLowerCase();
            // fix 1 L3: a plain item name finds its item even when it has no untagged row (a tagged-only name)
            const r = this.byId.get(s) || this.recipes.find(x => x.outputId.toLowerCase() === lower) || this.recipes.find(x => x.outputName.toLowerCase() === lower) || this.recipes.find(x => x.baseName.toLowerCase() === lower) || this.recipes.find(x => x.outputId.toLowerCase().endsWith('-' + lower));
            if (!r) return null;
            // fix 2 M-b: a link BY NAME (output or base name) is the item (its head row), never the first row of that name;
            // addendum 3: unless the name is not the item's own (a tagged row attached to another item by
            // its id) - then the first row of that name is the way, so the link still shows what it named
            const item = this.itemOf(r), byName = r.outputId !== s && r.outputId.toLowerCase() !== lower && (r.outputName.toLowerCase() === lower || r.baseName.toLowerCase() === lower);
            return { item, way: item === r || (byName && r.baseName === item.baseName) ? null : r };
        }

        // The finder: filters { q (lower case), mode 'name' | 'ingredient', types, tiers, star (Sets of strings) } over
        // the item rows. By name: the base name or the row's id. By ingredient: the row's own recipe or ANY of its
        // alternative ways; `via` names the alternative ways that matched when the row's own recipe does not.
        findRows(filters) {
            const f = filters || {}, q = String(f.q || '').toLowerCase(), mode = f.mode === 'ingredient' ? 'ingredient' : 'name';
            const has = (s, v) => !s || !s.size || s.has(String(v));
            const uses = r => (r.ingredients || []).some(i => i.name.toLowerCase().includes(q));
            // fix 1 M3: a row matches when ANY of its ways passes the type / tier / starbase filters (and, by ingredient,
            // uses the ingredient); when only other ways match, `via` names them and the row says "in an intermediate recipe"
            const fits = w => has(f.types, w.outputType) && has(f.tiers, w.outputTier) && has(f.star, w.starbase) && (!q || mode === 'name' || uses(w));
            const out = [];
            this.finderRows().forEach(x => {
                const r = x.r;
                if (q && mode === 'name' && !(r.baseName.toLowerCase().includes(q) || r.outputId.includes(q))) return;
                let via = null;
                if (!fits(r)) { const alt = this.wayRecipes(r).filter(w => w !== r && fits(w)); if (!alt.length) return; via = alt.map(a => this.wayLabel(a)); }
                out.push({ r, ways: x.ways, via });
            });
            return out;
        }

        // Addendum 3 G1/G2 (owner): THE LIST - every recipe row under the heading of its item. filters
        // as findRows plus kinds / facs (Sets of kind words, RecipeModel.KIND_ORDER): each filter tests the recipe ROW
        // itself. By name: the row's full name, its item's plain name, or its id holds q. By ingredient: the row's own
        // ingredients. Chips of one family OR (kinds: Standard / Starter / Zone N / ...; facs: MUD / ONI / USTUR), the
        // families and the other filters AND; an empty set = no filter. -> [{ item: the heading's recipe (finder row),
        // rows: the item's rows that pass, in way order (wayRecipes), total: the item's row count }], items with no row
        // passing left out, in finderRows order (the planner sorts).
        findRecipeRows(filters) {
            const f = filters || {}, q = String(f.q || '').toLowerCase(), mode = f.mode === 'ingredient' ? 'ingredient' : 'name';
            const has = (s, v) => !s || !s.size || s.has(String(v));
            const any = (s, list) => !s || !s.size || list.some(v => s.has(v));
            const out = [];
            this.finderRows().forEach(x => {
                const ways = this.wayRecipes(x.r), plain = x.r.baseName.toLowerCase();
                const rows = ways.filter(r => has(f.types, r.outputType) && has(f.tiers, r.outputTier) && has(f.star, r.starbase)
                    && any(f.kinds, r.kinds) && any(f.facs, r.kinds)
                    && (!q || (mode === 'name' ? r.outputName.toLowerCase().includes(q) || plain.includes(q) || r.outputId.includes(q) : (r.ingredients || []).some(i => i.name.toLowerCase().includes(q)))));
                if (rows.length) out.push({ item: x.r, rows, total: ways.length });
            });
            return out;
        }

        // the ores of a recipe's whole chain as written (no routing): every leaf of expand(), with its owner when it
        // is a faction's exclusive raw, and whether it is a raw at all (a leaf can be an item with no recipe). Memoised.
        oresOf(recipe) {
            const r = typeof recipe === 'string' ? this.byId.get(recipe) : recipe; if (!r) return [];
            this._ores = this._ores || new Map();
            if (this._ores.has(r.outputId)) return this._ores.get(r.outputId);
            const out = [];
            this.expand([{ id: r.outputId, qty: 1 }]).raws.forEach((qty, name) => { const res = this.rm.byName.get(name); out.push({ name, qty, owner: this.ownerOf(name), raw: !!(res && res.category === 'raw') }); });
            out.sort((a, b) => b.raw - a.raw || a.name.localeCompare(b.name));
            this._ores.set(r.outputId, out);
            return out;
        }

        // Every way to make a recipe's item, for the sheet's "Ways to make it" box: the item's head row first ("Standard"),
        // then its untagged same-tier siblings ("USTUR recipe", "Other recipe"), then its tagged alternatives (by tier,
        // label). Each with its label, who may craft it, starbase, direct ingredients and its ores (the raws of its whole
        // chain, exclusive ones with their owner). Any way gives its item's ways.
        ways(recipe) {
            return this.wayRecipes(recipe).map(x => {
                const label = this.wayLabel(x);
                return {
                    recipe: x, id: x.outputId, standard: label === 'Standard', label, tags: x.tags,
                    factions: x.fac.slice(), starbase: x.starbase, tier: x.outputTier,
                    ingredients: (x.ingredients || []).map(i => ({ name: i.name, quantity: i.quantity })),
                    ores: this.oresOf(x)
                };
            }).sort((a, b) => (b.standard - a.standard) || (a.recipe.isAlternative - b.recipe.isAlternative) || a.tier - b.tier || a.label.localeCompare(b.label) || a.id.localeCompare(b.id));
        }

        // --------------------------------------------------------------- supply chain with alternative ores (addendum 2)
        // The sheet's "Supply chain" graph (owner: "the supply chain should also show rochinol/arco or
        // any other ore in the same supply chain box"). dag = the chain of the way shown, in ResourceModel.dag's shape
        // (unique nodes, unique parent -> child edges with the per-craft quantity, depth); with no faction it is exactly
        // rm.dag() whenever the way shown is the first row of its name. opts.faction routes every step as the plan does
        // (route()), the root too unless opts.pin. alts = at EVERY crafted node whose item has more than one way, the ores
        // (whole-chain leaves, never the other way's intermediates) another way would use that the drawn chain under that
        // node does not: { node, ore, owner, raw, rival, ways: [{ id, label }] using it, replaces: the drawn ores under
        // the node that way does not use }. An alternative way's ores: as written (oresOf) with no faction; with one, that
        // way pinned and its steps routed (what the faction would really mine). Sorted by node, then ore.
        chainView(recipe, opts) {
            const r = typeof recipe === 'string' ? this.byId.get(recipe) : recipe; if (!r) return null;
            const f = canonFaction(opts && opts.faction), pin = !!(opts && opts.pin);
            // the root: routed with a faction (unless pinned); else the way shown - but an item with ONE way keeps the
            // drawing it had before (addendum 2 item 7: ResourceModel.dag's first row of the name)
            const single = this.wayRecipes(r).length < 2;
            const pick = (n, root) => root ? (f && !pin ? this.route(n, f, r) : single && !f ? this.rm.recipeByName.get(n) : r) : (f ? this.route(n, f) : this.rm.recipeByName.get(n));
            const nodes = new Map(), edges = [], seen = new Set(), recOf = new Map();
            // the walk of ResourceModel.dag, with pick() choosing each step's recipe
            const walk = (n, trail, root) => {
                if (nodes.has(n)) return nodes.get(n).depth;
                const res = this.rm.byName.get(n), rec = pick(n, root);
                const leaf = (res && res.category === 'raw') || !rec || !rec.ingredients || !rec.ingredients.length;
                const node = { name: n, res: res || null, depth: 0, leaf, parents: 0 };
                nodes.set(n, node);
                if (leaf || trail.has(n)) return 0;
                recOf.set(n, rec);
                trail.add(n);
                let depth = 0;
                rec.ingredients.forEach(i => {
                    const k = n + '\u0000' + i.name;
                    if (!seen.has(k)) { seen.add(k); edges.push({ from: n, to: i.name, quantity: i.quantity }); }
                    depth = Math.max(depth, 1 + walk(i.name, trail, false));
                });
                trail.delete(n);
                node.depth = depth;
                return depth;
            };
            walk(r.outputName, new Set(), true);
            edges.forEach(e => { nodes.get(e.to).parents++; });
            const kids = new Map(); edges.forEach(e => { const l = kids.get(e.from); if (l) l.push(e.to); else kids.set(e.from, [e.to]); });
            const lmemo = new Map();
            const leavesOf = n => { if (lmemo.has(n)) return lmemo.get(n); const s = new Set(); lmemo.set(n, s); const ks = kids.get(n); if (!ks) s.add(n); else ks.forEach(k => leavesOf(k).forEach(x => s.add(x))); return s; };
            this._altOres = this._altOres || new Map();
            const oresBy = w => {
                const k = (f || '') + '\u0000' + w.outputId;
                if (!this._altOres.has(k)) this._altOres.set(k, f ? Array.from(this.expand([{ id: w.outputId, qty: 1, pin: true }], { faction: f }).raws.keys()) : this.oresOf(w).map(o => o.name));
                return this._altOres.get(k);
            };
            // the leaves an ingredient NAME of another way would bring: a raw (or a name with no recipe) itself, else the
            // ores of the recipe the walk would use for it (routed when a faction is set)
            const oresOfName = b => { const res = this.rm.byName.get(b), rb = f ? this.route(b, f) : this.rm.recipeByName.get(b); return (res && res.category === 'raw') || !rb || !rb.ingredients || !rb.ingredients.length ? [b] : oresBy(this.own(rb)); };
            const alts = [];
            recOf.forEach((rec, n) => {
                const ways = this.wayRecipes(rec); if (ways.length < 2) return;
                const drawn = this.own(rec), D = leavesOf(n), by = new Map();
                // SLOTS: each ingredient of the other way is paired with the drawn way's ingredient of the same base
                // item, the rest in order. A pair of the same item made another way is shown at THAT item's node (it
                // has its own ways), so only pairs of different items add ores here: a way whose ingredient is another item's
                // other way shows that ore at THAT item's node, not at the root.
                const mine = (rec.ingredients || []).map(i => i.name), B = RecipeModel.baseName;
                ways.forEach(w => {
                    if (w === drawn) return;
                    const left = mine.slice(), pairs = [], rest = [];
                    (w.ingredients || []).forEach(i => { const k = left.findIndex(a => B(a) === B(i.name)); if (k >= 0) { pairs.push([left[k], i.name]); left.splice(k, 1); } else rest.push(i.name); });
                    rest.forEach(b => pairs.push([left.length ? left.shift() : null, b]));
                    pairs.forEach(([a, b]) => {
                        if (a === b) return;
                        if (a && B(a) === B(b)) { const ra = recOf.get(a), rb = this.rm.recipeByName.get(b); if (ra && rb && this.isWayOf(this.own(rb), ra)) return; }
                        const La = a ? leavesOf(a) : new Set(), Lb = new Set(oresOfName(b));
                        const add = Array.from(Lb).filter(x => !D.has(x)); if (!add.length) return;
                        const rep = Array.from(La).filter(x => !Lb.has(x));
                        add.forEach(o => { const x = by.get(o) || { ways: [], replaces: new Set() }; if (!x.ways.some(y => y.id === w.outputId)) x.ways.push({ id: w.outputId, label: this.wayLabel(w) }); rep.forEach(y => x.replaces.add(y)); by.set(o, x); });
                    });
                });
                by.forEach((a, o) => { const res = this.rm.byName.get(o), owner = this.ownerOf(o); alts.push({ node: n, ore: o, owner, raw: !!(res && res.category === 'raw'), rival: !!(f && owner && owner !== f), ways: a.ways, replaces: Array.from(a.replaces).sort() }); });
            });
            alts.sort((a, b) => a.node.localeCompare(b.node) || a.ore.localeCompare(b.ore));
            return { dag: { root: r.outputName, nodes, edges, depth: nodes.get(r.outputName).depth }, way: this.own(recOf.get(r.outputName) || r), faction: f, alts };
        }

        // plan items { id: the item's row, qty, way: the recipe the user picked for it (its own row included), or none }
        // -> expand() input: a picked way is the root and stays pinned when a faction routes the plan; no pick = the
        // item's row, routed by the faction as before
        // fix 2 M-b: an entry may also carry `rec` - an untagged sibling id that came in BARE (a stored plan, a link, the
        // Command Deck). Not a pick: at faction None it plans exactly that recipe (the pre-change plan of that id); with a
        // faction (pass it) it is routed like the item's own entry.
        planInputs(items, faction) {
            const f = canonFaction(faction);
            return (items || []).map(it => {
                const w = it.way ? this.byId.get(it.way) : null; if (w) return { id: w.outputId, qty: it.qty, pin: true };
                const s = it.rec && !f ? this.byId.get(it.rec) : null;
                return { id: s ? s.outputId : it.id, qty: it.qty };
            });
        }

        // --------------------------------------------------------------- expansion with quantities
        // returns { units: Map(name -> units), crafts: Map(name -> crafts), raws: Map(name -> units), nodes, edges, time }
        // opts.faction (MUD / ONI / USTUR, any spelling): route every crafted step through route(); opts.pinRoots keeps
        // the plan's own recipes as given. No faction = exactly the walk from before the ways work.
        expand(items, opts) {
            const units = new Map(), crafts = new Map(), raws = new Map(), nodes = new Map(), edges = new Map();
            const stepTime = new Map();
            const f = canonFaction(opts && opts.faction), pin = !!(opts && opts.pinRoots);
            const swapped = new Set();   // names whose step uses another recipe than the unrouted walk would
            // fix 1 M1: a craft STEP is a (name, recipe) pair - one name made by two recipes in a plan is two steps, each
            // with its own crafts and ingredients (the graph keeps one node per name). Map key name \0 recipe id.
            const steps = new Map();
            let swap = false;   // set by choose() for the walk call that follows it
            const choose = f
                // fix 2 L-a: "switched" = routing moved the step off its recipe as named AND onto a way that is not the
                // item's Standard (head) way; a step routed TO the Standard way is not switched
                ? (name, via, pinned) => { const d = via || this.own(this.rm.recipeByName.get(name)), r = via && (pin || pinned) ? via : this.route(name, f, via); swap = !!(r && r !== d && this.wayLabel(r) !== 'Standard'); if (swap) swapped.add(name); return r; }
                : (name, via) => via || this.rm.recipeByName.get(name);
            const addNode = (name, cat, recipe) => { if (!nodes.has(name)) nodes.set(name, { name, res: this.rm.byName.get(name) || null, cat, recipe: recipe || null, leaf: !recipe }); };
            // opts.stock (2026-11-26): Map(name -> whole units already held). A need is met from what is held first, in
            // walk order, and only the rest is crafted or gathered: an item held is neither crafted nor are its
            // ingredients asked for. `held` = units taken per name. No stock = the walk exactly as before.
            const left = opts && opts.stock ? new Map(opts.stock) : null, held = new Map();
            const walk = (name, qty, trail, viaRecipe, pinned) => {
                const res = this.rm.byName.get(name);
                swap = false;
                const rec = choose(name, viaRecipe, pinned), swappedHere = swap;
                const isRaw = res && res.category === 'raw';
                const craftable = !isRaw && rec && rec.ingredients && rec.ingredients.length && !trail.has(name);
                if (left) { const have = left.get(name) || 0, take = Math.min(have, qty); if (take > 0) { left.set(name, have - take); held.set(name, (held.get(name) || 0) + take); qty -= take; } }
                units.set(name, (units.get(name) || 0) + qty);
                if (!craftable) { addNode(name, isRaw ? 'raw' : (res ? res.category : 'processed'), null); if (qty > 0 && (isRaw || !rec || !rec.ingredients || !rec.ingredients.length)) raws.set(name, (raws.get(name) || 0) + qty); return; }
                addNode(name, res ? res.category : 'processed', rec);
                if (qty <= 0) return;   // all of it is held: nothing to craft, nothing asked of its ingredients
                const n = Math.ceil(qty / (rec.outputQuantity || 1));
                crafts.set(name, (crafts.get(name) || 0) + n);
                const sk = name + '\u0000' + rec.outputId, st = steps.get(sk) || { name, rec, crafts: 0, units: 0, switched: false };
                st.crafts += n; st.units += qty; st.switched = st.switched || swappedHere; steps.set(sk, st);
                stepTime.set(name, Math.max(stepTime.get(name) || 0, rec.constructionTime || 0));
                trail.add(name);
                rec.ingredients.forEach(i => {
                    const k = name + '\u0000' + i.name; const e = edges.get(k) || { from: name, to: i.name, quantity: 0, per: i.quantity };
                    e.quantity += i.quantity * n; edges.set(k, e);
                    walk(i.name, i.quantity * n, trail, null);
                });
                trail.delete(name);
            };
            items.forEach(it => { const rec = this.byId.get(it.id); if (!rec) return; walk(rec.outputName, it.qty, new Set(), rec, !!it.pin); });
            // critical path: longest constructionTime chain from any leaf up to a root (DAG, memoised)
            const kids = new Map(); edges.forEach(e => (kids.get(e.from) || kids.set(e.from, []).get(e.from)).push(e.to));
            const memo = new Map();
            const longest = n => { if (memo.has(n)) return memo.get(n); const own = stepTime.get(n) || 0; const below = (kids.get(n) || []).map(longest); const v = own + (below.length ? Math.max(...below) : 0); memo.set(n, v); return v; };
            const roots = items.map(it => this.byId.get(it.id)).filter(Boolean).map(r => r.outputName);
            const critical = roots.length ? Math.max(...roots.map(longest)) : 0;
            let sequential = 0; steps.forEach(st => { sequential += st.crafts * (st.rec.constructionTime || 0); });
            // depth inside THIS expansion (a routed step can have a different chain than the name's default one)
            const dmemo = new Map();
            const depth = n => { if (dmemo.has(n)) return dmemo.get(n); dmemo.set(n, 0); const below = (kids.get(n) || []).map(depth); const v = below.length ? 1 + Math.max(...below) : 0; dmemo.set(n, v); return v; };
            return { units, crafts, steps, raws, nodes, edges: Array.from(edges.values()), time: { critical, sequential }, roots, faction: f, depth, swapped, held };
        }

        // --------------------------------------------------------------- plan sheet
        plan(items, opts) {
            const x = this.expand(items, opts), f = x.faction;
            const rawList = Array.from(x.raws.entries()).map(([name, qty]) => { const res = this.rm.byName.get(name); return { name, qty, res, stake: !!(res && res.stakeMinable), beltOnly: !!(res && res.beltOnly), fleet: !!(res && res.category === 'raw' && !res.stakeMinable), unknown: !res }; }).sort((a, b) => b.qty - a.qty || a.name.localeCompare(b.name));
            // one row per STEP (name + recipe, fix 1 M1): two recipes for one name in a plan are two rows
            const perName = new Map(); x.steps.forEach(st => perName.set(st.name, (perName.get(st.name) || 0) + 1));
            const craftList = Array.from(x.steps.values()).map(st => {
                const name = st.name, n = st.crafts, rec = st.rec, node = x.nodes.get(name);
                const c = { name, crafts: n, units: perName.get(name) > 1 ? st.units : x.units.get(name), split: perName.get(name) > 1, rec, res: node.res, depth: f ? x.depth(name) : this.rm.dag(name).depth, time: (rec.constructionTime || 0) * n, each: rec.constructionTime || 0, ingredients: rec.ingredients.map(i => ({ name: i.name, qty: i.quantity * n })) };
                if (f) { const o = this.own(rec); c.switched = st.switched; c.foreign = !!o.fac && !o.fac.includes(f); }
                return c;
            }).sort((a, b) => a.depth - b.depth || b.crafts - a.crafts || a.name.localeCompare(b.name) || a.rec.outputId.localeCompare(b.rec.outputId));
            // with a faction: the rival exclusive raws the routed plan still needs, and which steps take them
            const rival = [];
            if (f) x.raws.forEach((qty, name) => { const o = this.ownerOf(name); if (o && o !== f) rival.push({ name, owner: o, qty, steps: Array.from(new Set(x.edges.filter(e => e.to === name).map(e => e.from))).sort() }); });
            rival.sort((a, b) => b.qty - a.qty || a.name.localeCompare(b.name));
            // where: planet types common to every crafted step; starbase: max; factions: intersection; status
            // where: planet types common to the plan's FINAL recipes (every intermediate has its own list, and the
            // intersection over a whole chain is empty for any real plan); starbase: max over every step
            let where = null; let starbase = 1; let factions = null;
            items.forEach(it => { const rec = this.byId.get(it.id); if (!rec) return; const pts = (rec.planetTypes || []).map(t => t.replace(/ Planet$/, '')); if (!pts.includes('All Types')) where = where === null ? new Set(pts) : new Set(pts.filter(t => where.has(t))); });
            craftList.forEach(c => {
                starbase = Math.max(starbase, parseInt(String(c.rec.min_starbase_level || '').replace(/\D/g, ''), 10) || 1);
                const f = c.rec.factions || []; if (f.length && f.length < 3) factions = factions === null ? new Set(f) : new Set(f.filter(v => factions.has(v)));
            });
            const byDepth = new Map(); craftList.forEach(c => { const d = byDepth.get(c.depth) || { depth: c.depth, crafts: 0, time: 0, names: [] }; d.crafts += c.crafts; d.time += c.time; if (!d.names.includes(c.name)) d.names.push(c.name); byDepth.set(c.depth, d); });
            return {
                items, raws: rawList, crafts: craftList, time: x.time, nodes: x.nodes, edges: x.edges, roots: x.roots, held: x.held,
                faction: f, rival, switched: f ? craftList.filter(c => c.switched).length : 0,
                where: where === null ? ['All types'] : Array.from(where).sort(), starbase, factions: factions === null ? [] : Array.from(factions),
                stages: Array.from(byDepth.values()).sort((a, b) => a.depth - b.depth),
                totals: { rawUnits: rawList.reduce((a, r) => a + r.qty, 0), rawKinds: rawList.length, crafts: craftList.reduce((a, c) => a + c.crafts, 0), steps: perName.size, stakeless: rawList.filter(r => r.fleet).length }
            };
        }

        // How far each box of a plan's tree is covered by what is held (2026-11-26). p = the plan with no stock,
        // pl = the same plan counted against stock. -> { share(name), held(name) }, each 0..1 or null when the plan
        // does not need the name. held = the part met from stock as that very item (or not needed any more because
        // an item made from it is held). share = held + the part still to craft x the average share of its
        // ingredients: holding every input of a step fills its box, though the craft itself is still to do.
        cover(p, pl) {
            const unitsOf = (plan, name) => { const cs = plan.crafts.filter(c => c.name === name); if (cs.length) return cs.reduce((a, c) => a + c.units, 0); const r = plan.raws.find(x => x.name === name); return r ? r.qty : 0; };
            const kidsOf = new Map(); pl.edges.forEach(e => (kidsOf.get(e.from) || kidsOf.set(e.from, []).get(e.from)).push(e.to));
            const leftOf = name => { const need = unitsOf(p, name); return need > 0 ? Math.min(need, unitsOf(pl, name)) / need : null; };
            const held = name => { const l = leftOf(name); return l == null ? null : 1 - l; };
            const memo = new Map();
            const share = name => {
                if (memo.has(name)) return memo.get(name);
                const left = leftOf(name); if (left == null) return null;
                memo.set(name, 1 - left);   // a name met again below itself counts as it stands (no loop)
                const kids = kidsOf.get(name) || [];
                const below = left > 0 && kids.length ? kids.reduce((a, k) => { const s = share(k); return a + (s == null ? 1 : s); }, 0) / kids.length : 0;
                const v = Math.min(1, 1 - left + left * below);
                memo.set(name, v); return v;
            };
            return { share, held };
        }

        // the DAG for ChainGraph: a plan with one root draws that recipe's chain; several get a virtual "Plan" root
        planDag(p) {
            const nodes = new Map(p.nodes);
            let root;
            if (p.roots.length === 1) root = p.roots[0];
            else { root = 'Production plan'; nodes.set(root, { name: root, res: null, cat: 'plan', leaf: false }); }
            const edges = p.edges.slice();
            if (p.roots.length > 1) p.items.forEach(it => { const r = this.byId.get(it.id); if (r) edges.unshift({ from: root, to: r.outputName, quantity: it.qty, per: 1 }); });
            return { root, nodes, edges };
        }

        // --------------------------------------------------------------- analytics
        // fix 2: every recipe that is ANOTHER way to make an item (a tagged row, or an untagged same-tier sibling of the
        // item's head), and how many items have one - the Analytics tab's "intermediate recipes" figure. Memoised.
        otherWayStats() {
            if (this._ows) return this._ows;
            const other = this.recipes.filter(r => r.isAlternative || this.itemOf(r) !== r);
            this._ows = { recipes: other.length, tagged: other.filter(r => r.isAlternative).length, siblings: other.filter(r => !r.isAlternative).length, items: new Set(other.map(r => this.itemOf(r).outputId)).size };
            return this._ows;
        }

        computeStats() {
            const byType = new Map(), byStar = [0, 0, 0, 0, 0, 0], timeBuckets = new Map(), ptByType = new Map(), factionOnly = { MUD: 0, ONI: 0, USTUR: 0 };
            const TB = [[0, '0'], [60, '≤ 1 min'], [600, '≤ 10 min'], [1800, '≤ 30 min'], [3600, '≤ 1 h'], [14400, '≤ 4 h'], [Infinity, '> 4 h']];
            this.recipes.forEach(r => {
                const t = byType.get(r.outputType) || { type: r.outputType, label: r.typeLabel, n: 0, time: 0, resources: 0, ingredients: 0, tiers: [0, 0, 0, 0, 0, 0] };
                t.n++; t.time += r.constructionTime || 0; if (r.isResource) t.resources++; t.ingredients += r.ingredientCount; t.tiers[r.outputTier] = (t.tiers[r.outputTier] || 0) + 1; byType.set(r.outputType, t);
                byStar[r.starbase] = (byStar[r.starbase] || 0) + 1;
                const b = TB.find(([lim]) => (r.constructionTime || 0) <= lim)[1]; const tb = timeBuckets.get(b) || {}; tb[r.outputType] = (tb[r.outputType] || 0) + 1; timeBuckets.set(b, tb);
                (r.planetTypes || []).forEach(pt => { const k = pt.replace(/ Planet$/, ''); const m = ptByType.get(k) || {}; m[r.outputType] = (m[r.outputType] || 0) + 1; ptByType.set(k, m); });
                if (r.factionOnly) factionOnly[r.fac[0]] = (factionOnly[r.fac[0]] || 0) + 1;   // canonical: "Ustur" rows count as USTUR
            });
            const types = TYPE_ORDER.filter(t => byType.has(t)).map(t => byType.get(t));
            const longest = this.recipes.slice().sort((a, b) => (b.constructionTime || 0) - (a.constructionTime || 0)).slice(0, 8);
            const deepest = this.recipes.slice().sort((a, b) => b.depth - a.depth || b.nodeCount - a.nodeCount).slice(0, 8);
            const alts = this.recipes.filter(r => r.isAlternative);
            const exotic = this.recipes.filter(r => r.exotic), research = this.recipes.filter(r => r.research_requirements && r.research_requirements.length);
            return { total: this.recipes.length, types, byStar, timeBuckets: TB.map(([, l]) => [l, timeBuckets.get(l) || {}]), ptByType, factionOnly, longest, deepest, exotic, research, outputsNotResources: this.recipes.filter(r => !r.isResource).length,
                alternatives: alts.length, altBases: new Set(alts.map(r => r.baseName)).size };
        }
    }

    // every " [..]" tag stripped: the plain item a tagged recipe or ingredient name stands for
    RecipeModel.baseName = name => String(name == null ? '' : name).replace(TAG_RE, '').trim();
    // the raw text of each tag, in order
    RecipeModel.tagsOf = name => { const out = []; String(name == null ? '' : name).replace(TAG_RE, (m, t) => { out.push(t.trim()); return m; }); return out; };
    // fix 2 L-b: THE plan-quantity parser for every source (stored plan, ?plan=, the input box, merged totals): a finite
    // number, rounded down, clamped to 1..100000; anything else is 1
    RecipeModel.MAX_QTY = 100000;
    RecipeModel.qty = v => { const n = typeof v === 'number' ? v : parseFloat(String(v == null ? '' : v)); return Number.isFinite(n) ? Math.max(1, Math.min(RecipeModel.MAX_QTY, Math.floor(n))) : 1; };
    RecipeModel.tagLabel = tagLabel;
    RecipeModel.canonFaction = canonFaction;
    RecipeModel.kindsOf = kindsOf;
    RecipeModel.KIND_ORDER = KIND_ORDER;
    RecipeModel.kindIndex = kindIndex;
    RecipeModel.FACTIONS = FACTIONS;
    RecipeModel.TYPE_LABEL = TYPE_LABEL;
    RecipeModel.TYPE_ORDER = TYPE_ORDER;
    window.RecipeModel = RecipeModel;
})();
