// recipe-plan.js - Recipe Explorer, Planner tab (rebuilt 2026-10-01): the recipe finder (left) and the production plan
// (right). Add recipes with a quantity; the sheet is always on: the raw bill, the craft list in build order, time,
// where it can be crafted, and the aggregated chain graph (shared Utils/ChainGraph.js) with quantities on the edges.
// A recipe sheet opens for any row or node: output, ingredients, facts, the research to craft it, who uses it, add to plan. The plan survives
// a reload (localStorage) and ?recipe=<id|name> adds one, ?search= pre-fills the finder.
(function () {
    'use strict';

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const CAT = { raw: { label: 'Raw', color: '#dd7429' }, processed: { label: 'Processed', color: '#2a9fcf' }, component: { label: 'Component', color: '#2fa985' }, advanced: { label: 'Advanced', color: '#9476db' }, plan: { label: 'Plan', color: '#4fd8ff' } };
    const fmtTime = sec => { if (!sec) return '0 s'; if (sec < 60) return Math.round(sec) + ' s'; const m = Math.round(sec / 60); if (m < 60) return m + ' min'; const h = Math.floor(m / 60), mm = m % 60; if (h < 48) return h + ' h' + (mm ? ' ' + mm + ' min' : ''); return (h / 24).toFixed(1) + ' days'; };
    const num = v => (v || 0).toLocaleString();
    const TRACK_COLOR = { CouncilRank: '#e8e3d3', Pilot: '#2fa985', Mining: '#dd7429', Building: '#a8842a', Crafting: '#9476db', DataRunner: '#2a9fcf', Combat: '#d9517c' };   // as on the Command Deck
    const PAGE = 100, KEY = 'recipeExplorer.plan.v1', FKEY = 'recipeExplorer.faction.v1';
    const FACTIONS = ['MUD', 'ONI', 'USTUR'];
    const FAC_COLOR = { MUD: '#ff6040', ONI: '#3ec8ff', USTUR: '#ffcc33' };   // as on the Analytics tab
    // Addendum 3 G3: the sheet's "ONE OF" frames and dashed ores of intermediate recipes (addendum 2) are OFF - the sheet
    // draws the plain chain of the recipe shown. The code path stays (chainView's alts, drawAltGraph, ChainGraph's
    // groups); set this to true to turn it back on. Read through RecipePlanner.showOneOf (the checks switch it there).
    const SHOW_ONE_OF = false;
    const tagChips = r => (r && r.tags && r.tags.length ? `<span class="rp-tags">${r.tags.map(t => `<span class="rp-tag">${esc(t)}</span>`).join('')}</span>` : '');

    class RecipePlanner {
        constructor(model, research) {
            this.m = model; this.rm = model.rm; this.research = research || null;   // CommandDeck ResearchModel, or null without research-data.js
            this.filters = { q: '', mode: 'name', types: new Set(), tiers: new Set(), star: new Set(), kinds: new Set(), facs: new Set(), sort: 'name' };
            this.shown = PAGE;
            this.items = this.load();
            this.faction = this.loadFaction();   // null = None: every step uses its recipe as named (the plan from before the ways work)
            this.history = [];
            this.renderFinder(); this.bind(); this.applyFinder(); this.renderPlan();
        }

        snd(n) { if (window.spaceSounds && window.spaceSounds[n]) window.spaceSounds[n](); }
        // Plan ENTRIES { id: the item's finder row, qty, way: the recipe picked for it, or none }. Fix 1 M2: an item may
        // appear more than once when the ways differ (one entry per item + way); entries with the same item and the same
        // way merge by ADDING quantities; no quantity is ever dropped or changed. A stored or linked id of a way (tagged
        // row, collapsed sibling) = that item with that way, quantity kept. Stored format: { id: the recipe the entry
        // actually uses (the way, else the item), qty, pin: true when a way is picked } - so the Command Deck, which
        // reads this key as { id, qty }, plans the right recipe. Read too: the first build's { id: item, way }.
        // Fix 2 M-b: `way` is a PINNED way - only the user's pick in the ways box or a TAGGED id pins. A bare untagged
        // sibling id is the entry's `rec`: not pinned, planned as that recipe at faction None, routed with a faction;
        // stored back as the bare { id: rec, qty }. `pin` counts only as the boolean true (fix 2 L-c).
        load() { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? this.normItems(v.filter(x => x && this.m.byId.has(x.id)).map(x => ({ id: x.id, qty: x.qty, way: x.pin === true ? x.id : (typeof x.way === 'string' ? x.way : undefined) }))) : []; } catch (e) { return []; } }
        // way: a way passed EXPLICITLY may be the item's own row (the user pinned the standard way against the faction
        // routing); a way that is not one of the item's ways is ignored (the entry keeps its item and quantity). A bare
        // id: the item's own row = no way; a tagged row = that way, pinned; an untagged sibling = rec (not pinned)
        norm(id, way) {
            const it = this.m.itemOf(id); if (!it) return null;
            if (way != null && way !== '') { const w = this.m.byId.get(way); return { id: it.outputId, way: w && this.m.isWayOf(w, it) ? w.outputId : null, rec: null }; }
            const r = this.m.byId.get(id);
            if (!r || r === it || !this.m.isWayOf(r, it)) return { id: it.outputId, way: null, rec: null };
            return r.isAlternative ? { id: it.outputId, way: r.outputId, rec: null } : { id: it.outputId, way: null, rec: r.outputId };
        }
        // an outputId holds no '|' (export ids are ':'-separated slugs); safe in an attribute. An entry with no rec keeps its fix-1 key
        keyOf(e) { return e.id + '|' + (e.way || '') + (e.rec ? '|' + e.rec : ''); }
        entry(n, qty) { const o = { id: n.id, qty: window.RecipeModel.qty(qty) }; if (n.way) o.way = n.way; if (n.rec) o.rec = n.rec; return o; }
        // a way's chip: its tags (a tagged alternative), else its label in one chip ("Standard", "USTUR recipe")
        wayChip(w) { return w.isAlternative ? tagChips(w) : `<span class="rp-tags"><span class="rp-tag std">${esc(this.m.wayLabel(w))}</span></span>`; }
        normItems(list) {
            const out = [], at = new Map();
            list.forEach(x => {
                const n = this.norm(x.id, x.way); if (!n) return;
                const o = this.entry(n, x.qty), k = this.keyOf(n);
                if (at.has(k)) { const e = at.get(k); e.qty = window.RecipeModel.qty(e.qty + o.qty); return; }   // clamped after merging too
                at.set(k, o); out.push(o);
            });
            return out;
        }
        // the plan entries of an item (any way of it), and the one entry a sheet's buttons act on: the entry with that
        // exact way when there is one, else the item's entry with no way picked, else its first entry
        entriesOf(id) { const it = this.m.itemOf(id); return it ? this.items.filter(i => i.id === it.outputId) : []; }
        planItem(id) { const n = this.norm(id); if (!n) return undefined; const es = this.entriesOf(id), k = this.keyOf(n); return es.find(e => this.keyOf(e) === k) || es.find(e => !e.way && !e.rec) || es[0]; }
        save() { try { localStorage.setItem(KEY, JSON.stringify(this.items.map(e => e.way ? { id: e.way, qty: e.qty, pin: true } : { id: e.rec || e.id, qty: e.qty })));localStorage.setItem(FKEY, this.faction || ''); } catch (e) { /* storage unavailable */ } }
        loadFaction() { try { const v = localStorage.getItem(FKEY); return FACTIONS.includes(v) ? v : null; } catch (e) { return null; } }
        // the name to show for an item or ingredient name: its base name (tags become chips beside it)
        disp(name) { return window.RecipeModel.baseName(name); }

        // ------------------------------------------------------------- finder
        renderFinder() {
            const side = document.getElementById('rpSide'); if (!side) return;
            // addendum 3: the list shows every RECIPE row, so each chip counts the recipe rows it shows (one row each)
            const tn = new Map(), byStar = [0, 0, 0, 0, 0, 0], kn = new Map();
            this.m.recipes.forEach(r => { tn.set(r.outputType, (tn.get(r.outputType) || 0) + 1); if (byStar[r.starbase] != null) byStar[r.starbase]++; r.kinds.forEach(k => kn.set(k, (kn.get(k) || 0) + 1)); });
            const st = { types: this.m.stats.types.filter(t => tn.get(t.type)).map(t => ({ type: t.type, label: t.label, n: tn.get(t.type) })), byStar };
            // G2: the kind chips (one family, any of) and the faction chips (another family, any of), built from the data
            const FAC = window.RecipeModel.FACTIONS, ORD = window.RecipeModel.KIND_ORDER, at = k => window.RecipeModel.kindIndex(k, ORD.length);
            const kinds = Array.from(kn.keys()).sort((a, b) => at(a) - at(b) || a.localeCompare(b));
            // 2026-11-19: a family with nothing to tell apart is not drawn - one kind chip would select every row (every
            // row has a kind), and no faction-only row means no faction chip (no empty heading)
            const kindChips = kinds.filter(k => !FAC.includes(k)), facChips = FAC.filter(k => kn.get(k));
            const KTIP = { Standard: 'Recipes with no tag: the standard recipe of an item', Starter: 'Starter recipes (a "starter" tag, or a faction\'s own starter recipe)', 'Starter construction': 'Recipes for building starter construction items', G1: 'Tag G1, as written in the data', G2: 'Tag G2, as written in the data' };
            const kchip = (fam, k) => `<button type="button" class="chip" data-v="${esc(k)}" title="${esc(KTIP[k] || (/^Zone \d/.test(k) ? `${k} recipes (tags "${k} manufacture" and "Z${k.slice(5)}")` : fam === 'facs' ? `Recipes only ${k} may craft, or whose tag names ${k}` : k))}">${esc(k)} <small>${num(kn.get(k))}</small></button>`;
            side.innerHTML = `
                <div class="rx-side-head"><h3>Find a recipe</h3><span class="sb-count" id="rpCount"></span></div>
                <input type="text" id="searchInput" class="sb-input" placeholder="Output name, e.g. Copper Wire, Mining Rig" autocomplete="off">
                <div class="chips" data-group="mode"><button type="button" class="chip on" data-v="name">By output</button><button type="button" class="chip" data-v="ingredient">By ingredient</button></div>
                ${kindChips.length > 1 ? `<h4>Recipe kind <small class="rp-chip-hint">shows recipes of any kind ticked</small></h4>
                <div class="chips" data-group="kinds">${kindChips.map(k => kchip('kinds', k)).join('')}</div>` : ''}
                ${facChips.length ? `<h4>Faction <small class="rp-chip-hint">any faction ticked; with a kind ticked, both must match</small></h4>
                <div class="chips" data-group="facs">${facChips.map(k => kchip('facs', k)).join('')}</div>` : ''}
                <h4>Makes</h4>
                <div class="chips" data-group="types">${st.types.map(t => `<button type="button" class="chip" data-v="${esc(t.type)}">${esc(t.label)} <small>${num(t.n)}</small></button>`).join('')}</div>
                <h4>Output tier</h4>
                <div class="chips" data-group="tiers">${[1, 2, 3, 4, 5].map(t => `<button type="button" class="chip" data-v="${t}"><i class="t t${t}">T${t}</i></button>`).join('')}</div>
                <h4>Starbase level</h4>
                <div class="chips" data-group="star">${[1, 2, 3, 4, 5].map(l => `<button type="button" class="chip" data-v="${l}">L${l} <small>${num(st.byStar[l])}</small></button>`).join('')}</div>
                <h4>Sort</h4>
                <select id="rpSort" class="sb-input"><option value="name">Name</option><option value="tier">Tier</option><option value="time">Build time</option><option value="depth">Steps from raw</option><option value="ingredients">Ingredients</option></select>
                <button type="button" class="sb-btn ghost" id="rpClear">Clear filters</button>
                <div class="rp-list" id="rpList"></div>`;
        }

        applyFinder() {
            const f = this.filters;
            // addendum 3 G1: every recipe row under the heading of its item (model findRecipeRows); each filter and both
            // searches test the recipe row itself, a heading shows when any of its rows shows
            this.found = this.m.findRecipeRows(f);
            const cmp = { name: (a, b) => a.baseName.localeCompare(b.baseName) || a.outputTier - b.outputTier || a.outputName.localeCompare(b.outputName), tier: (a, b) => a.outputTier - b.outputTier || a.baseName.localeCompare(b.baseName), time: (a, b) => (b.constructionTime || 0) - (a.constructionTime || 0), depth: (a, b) => b.depth - a.depth, ingredients: (a, b) => b.ingredientCount - a.ingredientCount }[f.sort];
            const tie = (a, b) => a.outputName.localeCompare(b.outputName) || a.outputId.localeCompare(b.outputId);
            // rows of an item: by name its standard row first, then higher tier first (as the owner's sketch); else by the
            // sort's key. Items: by name / tier their heading, else their first row
            this.found.forEach(g => g.rows.sort(f.sort === 'name' ? (a, b) => (b === g.item) - (a === g.item) || b.outputTier - a.outputTier || tie(a, b) : (a, b) => cmp(a, b) || tie(a, b)));
            const keyRow = g => (f.sort === 'name' || f.sort === 'tier' ? g.item : g.rows[0]);
            this.found.sort((a, b) => cmp(keyRow(a), keyRow(b)) || tie(a.item, b.item));
            this.foundRows = this.found.reduce((n, g) => n + g.rows.length, 0);
            this.shown = PAGE; this.renderList();
        }

        // a recipe row's kind in words ("Starter · MUD", "Standard"); a tagged row says it is an intermediate recipe
        // 2026-11-19: an untagged starter row adds its exclusive raws (two starter rows of one item read apart)
        kindText(r) { const x = this.m.starterNote ? this.m.starterNote(r) : ''; return r.kinds.join(' · ') + (x ? ' · ' + x : ''); }
        renderList() {
            const el = document.getElementById('rpList'), c = document.getElementById('rpCount'); if (!el) return;
            const found = this.found || [], total = this.foundRows || 0;
            if (c) c.textContent = `${num(total)} of ${num(this.m.recipes.length)} recipes`;
            // a heading is marked when any entry of the item is in the plan; its + / ✓ is the entry with no way picked
            // (the item unpinned); a recipe row's + / ✓ is the entry that has THAT recipe picked (pinned)
            const inPlan = new Set(this.items.map(i => i.id)), plain = new Set(this.items.filter(i => !i.way && !i.rec).map(i => i.id)), picked = new Set(this.items.filter(i => i.way).map(i => i.way));
            const addBtn = (attr, id, on, what) => `<button type="button" class="rp-add" ${attr}="${esc(id)}" title="${on ? 'In the plan: click to remove' : what}">${on ? '✓' : '+'}</button>`;
            const meta = r => `${esc(r.typeLabel)} · ${r.ingredientCount ? r.ingredientCount + ' ingr.' : 'no inputs'} · ${fmtTime(r.constructionTime)}`;
            // one item with one recipe: a plain row (no heading weight); it is the item itself (+ adds it unpinned)
            const single = (g, r) => `
                <div class="rp-row${inPlan.has(g.item.outputId) ? ' in' : ''}" data-id="${esc(r.outputId)}">
                    <div class="rp-row-main" data-open="${esc(r.outputId)}" title="${esc(r.outputName)}"><b><i class="t t${r.outputTier}">T${r.outputTier}</i>${esc(r.outputName)}</b><span>${meta(r)}<em class="rp-kind">${esc(this.kindText(r))}</em></span></div>
                    ${addBtn('data-add', g.item.outputId, plain.has(g.item.outputId), 'Add to the plan')}
                </div>`;
            const sub = (g, r) => `
                <div class="rp-row rp-sub${picked.has(r.outputId) ? ' in' : ''}" data-id="${esc(r.outputId)}">
                    <div class="rp-row-main" data-open-way="${esc(r.outputId)}" title="${esc(r.outputName)}${r.isAlternative ? ` - an intermediate recipe for ${esc(g.item.baseName)}` : ''}: open this recipe"><b><i class="t t${r.outputTier}">T${r.outputTier}</i><span class="rp-full">${esc(r.outputName)}</span></b><span>${meta(r)}<em class="rp-kind">${esc(this.kindText(r))}</em></span></div>
                    ${addBtn('data-pick', r.outputId, picked.has(r.outputId), `Add to the plan made this way (your pick: faction routing keeps it)`)}
                </div>`;
            const head = g => `
                <div class="rp-row rp-head${inPlan.has(g.item.outputId) ? ' in' : ''}" data-id="${esc(g.item.outputId)}">
                    <div class="rp-row-main" data-open="${esc(g.item.outputId)}" title="${esc(g.item.baseName)}: open its standard recipe"><b>${esc(g.item.baseName)}</b><span class="rp-head-n">${g.rows.length < g.total ? `${num(g.rows.length)} of ${num(g.total)}` : num(g.total)} recipes</span></div>
                    ${addBtn('data-add', g.item.outputId, plain.has(g.item.outputId), 'Add the item to the plan (no recipe picked: faction routing chooses)')}
                </div>`;
            // paging counts recipe rows; an item is drawn whole
            let n = 0, html = '';
            for (const g of found) {
                if (n >= this.shown) break;
                html += g.total === 1 ? single(g, g.rows[0]) : `<div class="rp-group">${head(g)}${g.rows.map(r => sub(g, r)).join('')}</div>`;
                n += g.rows.length;
            }
            el.innerHTML = html ? html + (total > n ? `<button type="button" class="sb-more" data-more>Show ${num(Math.min(PAGE, total - n))} more of ${num(total - n)} recipes</button>` : '') : '<p class="sb-muted an-empty">No recipe matches.</p>';
            this.listedRows = n;
        }

        bind() {
            const side = document.getElementById('rpSide'), main = document.getElementById('rpMain');
            side.addEventListener('click', e => {
                const chip = e.target.closest('.chip');
                if (chip) {
                    const g = chip.closest('[data-group]').dataset.group, v = chip.dataset.v;
                    if (g === 'mode') { this.filters.mode = v; side.querySelectorAll('[data-group="mode"] .chip').forEach(x => x.classList.toggle('on', x.dataset.v === v)); }
                    else { const set = this.filters[g]; set.has(v) ? set.delete(v) : set.add(v); chip.classList.toggle('on', set.has(v)); }
                    this.snd('select'); this.applyFinder(); return;
                }
                if (e.target.id === 'rpClear') { ['types', 'tiers', 'star', 'kinds', 'facs'].forEach(g => this.filters[g].clear()); this.filters.q = ''; document.getElementById('searchInput').value = ''; side.querySelectorAll('.chip.on').forEach(x => { if (x.closest('[data-group]').dataset.group !== 'mode') x.classList.remove('on'); }); this.snd('deselect'); this.applyFinder(); return; }
                const pick = e.target.closest('[data-pick]'); if (pick) { this.toggleWay(pick.dataset.pick); return; }
                const add = e.target.closest('[data-add]'); if (add) { this.toggleItem(add.dataset.add); return; }
                const more = e.target.closest('[data-more]'); if (more) { this.shown = Math.max(this.shown, this.listedRows || 0) + PAGE; this.snd('click'); this.renderList(); return; }
                // addendum 3: a recipe row opens THAT recipe's sheet with it selected (pinned, as picking it in the ways box)
                const ow = e.target.closest('[data-open-way]'); if (ow) { this.snd('click'); this.openSheet(ow.dataset.openWay, true, true); return; }
                const open = e.target.closest('[data-open]'); if (open) { this.snd('click'); this.openSheet(open.dataset.open); }
            });
            side.addEventListener('change', e => { if (e.target.id === 'rpSort') { this.filters.sort = e.target.value; this.applyFinder(); } });
            main.addEventListener('click', e => {
                const rm = e.target.closest('[data-remove]'); if (rm) { this.items = this.items.filter(i => this.keyOf(i) !== rm.dataset.remove); this.snd('deselect'); this.save(); this.renderList(); this.renderPlan(); return; }
                const clr = e.target.closest('[data-plan-clear]'); if (clr) { this.items = []; this.focus = null; this.snd('deselect'); this.save(); this.renderList(); this.renderPlan(); return; }
                const fc = e.target.closest('[data-focus]'); if (fc) { this.focus = this.focus === fc.dataset.focus ? null : fc.dataset.focus; this.snd(this.focus ? 'select' : 'deselect'); this.renderPlan(); return; }
                const open = e.target.closest('[data-open]'); if (open) { this.snd('click'); this.openSheet(open.dataset.open); return; }
                const go = e.target.closest('[data-go]'); if (go) { this.snd('click'); this.openByName(go.dataset.go); return; }
                const fit = e.target.closest('[data-fit]'); if (fit && this.graph) { this.graph.fit(); return; }
            });
            main.addEventListener('change', e => { if (e.target.matches('[data-faction]')) { this.faction = FACTIONS.includes(e.target.value) ? e.target.value : null; this.snd('select'); this.save(); this.renderPlan(); return; } });
            main.addEventListener('change', e => { const q = e.target.closest('[data-qty]'); if (q) { const it = this.items.find(i => this.keyOf(i) === q.dataset.qty); if (it) { it.qty = window.RecipeModel.qty(q.value); q.value = it.qty; this.save(); this.renderPlan(); } } });
        }

        handleSearch(q) { this.filters.q = (q || '').trim().toLowerCase(); this.applyFinder(); }

        // finder "+" and the sheet's add button: add or remove the entry of exactly this item + way (an item row = no way
        // picked; a way's id = its item with that way); other entries of the item are left alone
        toggleItem(id) {
            const n = this.norm(id); if (!n) return;
            const k = this.keyOf(n), i = this.items.findIndex(x => this.keyOf(x) === k);
            if (i >= 0) { this.items.splice(i, 1); this.snd('deselect'); } else { this.items.push(this.entry(n, 1)); this.snd('success'); }
            this.save(); this.renderList(); this.renderPlan();
        }
        // addendum 3: a recipe row's "+" - add or remove the entry of its item with THIS recipe picked (pinned, as "Plan
        // this way" in the ways box), the standard recipe too; other entries of the item are left alone
        toggleWay(id) {
            const n = this.norm(id, id); if (!n || !n.way) return;
            const k = this.keyOf(n), i = this.items.findIndex(x => this.keyOf(x) === k);
            if (i >= 0) { this.items.splice(i, 1); this.snd('deselect'); } else { this.items.push(this.entry(n, 1)); this.snd('success'); }
            this.save(); this.renderList(); this.renderPlan();
        }
        // a link (?recipe=): fix 1 L2 - a link never changes an existing entry; if the item with that way is not in the
        // plan it is added as a new entry with quantity 1
        addItem(id, qty) {
            const n = this.norm(id); if (!n) return;
            const k = this.keyOf(n);
            if (!this.items.some(x => this.keyOf(x) === k)) this.items.push(this.entry(n, qty || 1));
            this.save(); this.renderList(); this.renderPlan();
        }
        // "use this way in the plan": the sheet's entry of the item (planItem) gets this way; with no entry the item is
        // added with it. A pick is kept even for the standard way, so it holds when a faction routes the plan. If another
        // entry already has that way, the two merge by adding quantities. clearWay hands the choice back to the routing.
        setWayOf(it, way) {
            it.way = way || undefined; if (!it.way) delete it.way;
            delete it.rec;   // fix 2 M-b: a pick (or handing it back to the routing) replaces an unpinned bare-id recipe
            const k = this.keyOf(it), twin = this.items.find(x => x !== it && this.keyOf(x) === k);
            if (twin) { twin.qty = window.RecipeModel.qty(twin.qty + it.qty); this.items = this.items.filter(x => x !== it); }
        }
        useWay(id) {
            const n = this.norm(id, id); if (!n) return;
            const it = this.planItem(id);
            if (it) this.setWayOf(it, n.way); else this.items.push({ id: n.id, qty: 1, way: n.way });
            this.snd('success'); this.save(); this.renderList(); this.renderPlan();
        }
        clearWay(id) { const it = this.planItem(id); if (!it) return; this.setWayOf(it, null); this.snd('deselect'); this.save(); this.renderPlan(); }
        // the recipe the plan uses for an item: the picked way, else (faction set) the routed recipe, else its own row
        planWayOf(it) {
            if (!it) return null;
            if (it.way) return it.way;
            if (it.rec && !this.faction) return it.rec;   // fix 2 M-b: an unpinned bare-id recipe, as named at faction None
            const r = this.m.byId.get(it.id);
            return this.faction && r ? (this.m.route(r.outputName, this.faction, r) || r).outputId : it.id;
        }
        // ?plan=id:qty,id:qty replaces the plan (ids may name ways)
        setPlan(pairs) { this.items = this.normItems(pairs.filter(p => this.m.byId.has(p.id))); this.save(); this.renderList(); this.renderPlan(); }

        // ------------------------------------------------------------- plan
        renderPlan() {
            const main = document.getElementById('rpMain'); if (!main) return;
            if (!this.items.length) {
                main.innerHTML = `<div class="rp-empty"><h3>Production plan</h3><p>Add recipes from the finder with <b>+</b> and set quantities. The sheet shows every raw to gather, every intermediate to craft in build order, how long it takes, where it can be crafted, and the whole chain in one graph.</p><p class="sb-muted">Try: search <b>Mining Rig</b>, add one, then add a <b>Power Regulation Module</b>.</p></div>`;
                return;
            }
            // the numbers, the raw bill and the craft list always total EVERY recipe in the plan (owner, 2026-10-01);
            // focus (click a plan item) changes only the chain graph, which then shows that recipe alone at its quantity
            // focus = one plan ENTRY (item + way, fix 1 M2), by its key
            if (this.focus && !this.items.some(i => this.keyOf(i) === this.focus)) this.focus = null;
            const opts = { faction: this.faction };
            // an item with a way picked plans that way (pinned against the faction routing); else its own row
            const p = this.plan = this.m.plan(this.m.planInputs(this.items, this.faction), opts);
            const pg = this.focus ? this.m.plan(this.m.planInputs(this.items.filter(i => this.keyOf(i) === this.focus), this.faction), opts) : p;
            const rivalOf = new Map(p.rival.map(r => [r.name, r]));
            const own = rec => this.m.own(rec);
            const maxRaw = Math.max(1, ...p.raws.map(r => r.qty)), maxCraft = Math.max(1, ...p.crafts.map(c => c.time));
            const fe = this.focus ? this.items.find(i => this.keyOf(i) === this.focus) : null, focused = fe ? this.m.byId.get(fe.id) : null;
            main.innerHTML = `
                <div class="rp-plan">
                    <div class="rp-items">
                        <label class="rp-faction" title="Route the plan for one faction: each step uses a recipe that faction may craft, and switches to an intermediate recipe where the standard one needs a rival's exclusive raw">Faction <select data-faction>${['', ...FACTIONS].map(f => `<option value="${f}"${(this.faction || '') === f ? ' selected' : ''}>${f || 'None'}</option>`).join('')}</select></label>
                        ${this.items.map(it => { const r = this.m.byId.get(it.id), w = it.way ? this.m.byId.get(it.way) : null, sr = !w && it.rec ? this.m.byId.get(it.rec) : null, k = this.keyOf(it); return `<div class="rp-item${this.focus === k ? ' on' : ''}"><button type="button" class="rp-item-name" data-focus="${esc(k)}" title="${this.focus === k ? 'Back to the whole plan' : 'Show only this recipe'}${w ? ` - made the ${esc(this.m.wayLabel(w))} way (picked in its recipe sheet)` : ''}${sr ? ` - added as the ${esc(this.m.wayLabel(sr))}: used at faction None, routed when a faction is chosen (not picked)` : ''}"><i class="t t${r.outputTier}">T${r.outputTier}</i>${esc(r.baseName)}${w ? this.wayChip(w) : sr && !this.faction ? this.wayChip(sr) : ''}<small>${esc(r.typeLabel)}</small></button><label>&times;<input type="number" min="1" max="100000" value="${it.qty}" data-qty="${esc(k)}"></label><button type="button" class="rp-x" data-remove="${esc(k)}" title="Remove">&times;</button></div>`; }).join('')}
                        <button type="button" class="sb-btn ghost" data-plan-clear>Clear plan</button>
                        ${this.items.length > 1 ? `<span class="rp-focus-hint">${focused ? `Chain shows <b>${esc(focused.baseName)}</b> only &middot; click it again for the whole plan` : 'Click a recipe to see its chain alone'}</span>` : ''}
                    </div>
                    <div class="an-stats rp-stats">
                        <div class="an-stat"><b>${num(p.totals.rawKinds)}</b><span>raw kinds · ${num(p.totals.rawUnits)} units</span></div>
                        <div class="an-stat"><b>${num(p.totals.steps)}</b><span>intermediates · ${num(p.totals.crafts)} crafts</span></div>
                        <div class="an-stat"><b>${fmtTime(p.time.critical)}</b><span>critical path (all in parallel)</span></div>
                        <div class="an-stat"><b>${fmtTime(p.time.sequential)}</b><span>every craft in sequence</span></div>
                        <div class="an-stat"><b>L${p.starbase}</b><span>starbase level needed</span></div>
                        <div class="an-stat ${p.totals.stakeless ? 'warn' : ''}"><b>${num(p.totals.stakeless)}</b><span>raws no claim stake can mine</span></div>
                    </div>
                    ${this.routeLine(p)}
                    <section class="rx-graph-wrap">
                        <div class="rx-panel-head"><h3>${focused ? esc(focused.baseName) + ' chain' : 'The whole chain'}</h3><span>${num(pg.nodes.size)} resources, ${num(pg.edges.length)} links · quantities on the links are totals${focused ? ' for this recipe at its quantity' : ' for this plan'} · drag to pan, wheel to zoom, hover to trace, click to open</span><button type="button" class="sb-btn ghost" data-fit>Fit</button></div>
                        <div class="rx-graph" id="rpGraph"></div>
                    </section>
                    <div class="rp-sheet">
                        <section class="rx-panel">
                            <div class="rx-panel-head"><h3>Raw bill</h3><span>${num(p.totals.rawKinds)} deposits to gather${p.totals.stakeless ? ` · <em class="warn">${p.totals.stakeless} no claim stake can mine</em>` : ''}</span></div>
                            <div class="ch">${p.raws.map(r => { const rv = rivalOf.get(r.name); return `<div class="ch-row${rv ? ' rp-rival' : ''}"><button type="button" class="ch-lbl rx-link" data-go="${esc(r.name)}" title="${esc(r.name)}${rv ? ` - ${rv.owner} exclusive raw` : ''}">${r.res ? `<i class="t t${r.res.tier}">T${r.res.tier}</i>` : ''}${esc(r.name)}${rv ? `<em>${rv.owner}</em>` : ''}</button><div class="ch-bar"><b style="width:${(100 * r.qty / maxRaw).toFixed(1)}%;background:${r.fleet ? '#ffd36b' : '#dd7429'}"><span class="ct">${esc(r.name)}: ${num(r.qty)} units · ${r.stake ? 'claim-stake extractor' : r.beltOnly ? 'belts only, fleet mining' : r.fleet ? 'no extractor kit, fleet mining' : 'not a mapped deposit'}${rv ? ` · ${rv.owner} exclusive` : ''}</span></b></div><span class="ch-val">${num(r.qty)}</span></div>`; }).join('')}</div>
                            <div class="ch-key" style="margin-top:0.6rem"><span><i style="background:#dd7429"></i>claim-stake extractor</span><span><i style="background:#ffd36b"></i>fleet mining only</span></div>
                        </section>
                        <section class="rx-panel">
                            <div class="rx-panel-head"><h3>Craft list · build order</h3><span>deepest first; crafts = units ÷ output per craft, rounded up; time = crafts × build time</span></div>
                            <div class="rp-crafts">${p.crafts.map(c => { const o = own(c.rec), lbl = this.m.wayLabel(o); return `<div class="rp-craft${c.switched ? ' alt' : ''}"><span class="d">${c.depth}</span><button type="button" class="nm rx-link" data-open="${esc(c.rec.outputId)}" title="${esc(o.outputName)}${c.switched ? ` - the ${esc(lbl)} way, used instead of the standard one` : ''}${c.split ? ' - this plan makes this item more than one way: one row per way' : ''}${c.foreign ? ` - only ${esc(o.fac.join('/'))} may craft this step` : ''}">${(c.res || this.m.resOf(c.name)) ? `<i class="t t${(c.res || this.m.resOf(c.name)).tier}">T${(c.res || this.m.resOf(c.name)).tier}</i>` : ''}${esc(this.disp(c.name))}${o.isAlternative ? tagChips(o) : (lbl !== 'Standard' || c.split) ? this.wayChip(o) : ''}${c.foreign ? `<em class="rp-foreign">${esc(own(c.rec).fac.join('/'))} only</em>` : ''}</button><span class="n">&times;${num(c.crafts)}<small>${num(c.units)} units</small></span><span class="bar"><b style="width:${(100 * c.time / maxCraft).toFixed(1)}%"></b></span><span class="n">${fmtTime(c.time)}<small>${fmtTime(c.each)} each</small></span></div>`; }).join('')}</div>
                            <p class="sb-foot">Build times are the export's <i>constructionTime</i> read as seconds. Critical path = the longest chain of build times from a raw to an output with every craft running in parallel; the sequential figure adds every craft up.</p>
                        </section>
                        ${this.planResearchPanel(this.m.planInputs(this.items, this.faction))}
                    </div>
                </div>`;
            const host = document.getElementById('rpGraph');
            this.graph = new ChainGraph(host, {
                onOpen: name => this.openByName(name), sound: n => this.snd(n), hitTest: true,   // without hitTest no node click arrives (pointer capture)
                label: n => { const us = pg.crafts.filter(c => c.name === n.name), u = us.length ? { crafts: us.reduce((a, c) => a + c.crafts, 0), units: us.reduce((a, c) => a + c.units, 0) } : null; const units = pg.raws.find(r => r.name === n.name); return n.data && n.data.cat === 'plan' ? `${pg.items.length} recipes` : (u ? `×${num(u.crafts)} crafts · ${num(u.units)} units` : units ? `${num(units.qty)} units · raw` : (n.res ? `T${n.res.tier} · ${CAT[n.res.category] ? CAT[n.res.category].label : ''}` : '')); },
                display: name => this.disp(name),   // a tagged node shows its item's name; the key (and hover title) keeps the tag
                edgeLabel: e => `${e.from} needs ${e.to}: ${num(e.quantity)} units (${e.per} per craft)`
            });
            this.graph.draw(this.displayDag(this.m.planDag(pg)));
        }

        // a copy of a DAG whose tagged nodes carry their base item's resource (colour, tier, icon); the model's
        // nodes stay as they are (the ResourceModel memoises its DAGs)
        displayDag(dag) {
            const nodes = new Map(); dag.nodes.forEach((n, k) => nodes.set(k, n.res || n.cat === 'plan' ? n : Object.assign({}, n, { res: this.m.resOf(k) })));
            return Object.assign({}, dag, { nodes });
        }

        // the plan's routing result in one line: the faction, how many steps took an alternative, the rival raws left
        routeLine(p) {
            if (!p.faction) return `<p class="rp-route none">Faction <b>None</b>: every step uses its recipe as named. Pick a faction to route the plan around rival exclusive raws.</p>`;
            const f = p.faction, foreign = p.crafts.filter(c => c.foreign);
            // a way the user picked is pinned (not "switched" by routing): say so, never "every step uses its standard recipe"
            const picked = this.items.filter(i => i.way).length, offStd = this.items.filter(i => i.way && i.way !== i.id).length;
            const altParts = [];
            if (p.switched) altParts.push(`${p.switched} step${p.switched === 1 ? '' : 's'} use${p.switched === 1 ? 's' : ''} an intermediate recipe (marked)`);
            if (picked) altParts.push(`${picked} item${picked === 1 ? '' : 's'} made the way you picked${offStd ? ` (${offStd} not the standard way)` : ''}`);
            const alt = altParts.length ? altParts.join(' · ') : 'every step uses its standard recipe';
            const rv = p.rival.length
                ? `<b class="warn">Rival raws still needed:</b> ${p.rival.map(r => `<span class="rp-rv"><b>${esc(r.name)}</b> (${r.owner}) for ${r.steps.map(s => esc(this.disp(s))).join(', ')}</span>`).join('; ')}`
                : '<b class="ok">No rival raws needed.</b>';
            return `<p class="rp-route" style="--fc:${FAC_COLOR[f]}"><span class="rp-route-f">${f}</span>${rv} <span class="sb-muted">· ${alt}${foreign.length ? ` · ${foreign.length} step${foreign.length === 1 ? '' : 's'} only a rival may craft` : ''}</span></p>`;
        }

        // ------------------------------------------------------------- recipe sheet
        // fix 2 M-b: a lookup BY NAME opens the item (its head row), not the first row of that name
        itemByName(name) { const r = this.rm.recipeByName.get(name); return r ? this.m.itemOf(r) : null; }
        openByName(name) { const r = this.itemByName(name), res = this.m.resOf(name); if (r) this.openSheet(r.outputId); else if (res) window.open(`../ResourcesExplorer/index.html?r=${encodeURIComponent(res.name)}`, '_blank', 'noopener'); }

        openSheet(id, push = true, pin = false) {
            const r = this.m.byId.get(id); if (!r) return;
            this.sheetPin = !!pin;   // addendum 2: a way picked in the sheet is drawn as picked, not as the faction routes it
            if (push && this.current && this.current !== id) this.history.push(this.current);
            this.current = id;
            if (!this.overlay) {
                this.overlay = document.createElement('div'); this.overlay.className = 'rx-modal'; document.body.appendChild(this.overlay);
                this._esc = e => { if (e.key === 'Escape') this.closeSheet(); }; document.addEventListener('keydown', this._esc);
                this.overlay.addEventListener('click', e => {
                    if (e.target === this.overlay || e.target.closest('[data-close]')) { this.closeSheet(); return; }
                    const back = e.target.closest('[data-back]'); if (back) { const prev = this.history.pop(); if (prev) { this.snd('click'); this.openSheet(prev, false); } return; }
                    // the ways box: "use in plan" sets the item's way; picking a way switches the sheet IN PLACE (no history)
                    const cw = e.target.closest('[data-clear-way]'); if (cw) { this.clearWay(cw.dataset.clearWay); this.renderSheet(this.m.byId.get(this.current), true); return; }
                    const pw = e.target.closest('[data-plan-way]'); if (pw) { this.useWay(pw.dataset.planWay); this.renderSheet(this.m.byId.get(this.current)); return; }
                    const wy = e.target.closest('[data-way]'); if (wy) { if (wy.dataset.way !== this.current && this.m.byId.has(wy.dataset.way)) { this.snd('select'); this.current = wy.dataset.way; this.sheetPin = true; this.renderSheet(this.m.byId.get(this.current), true); } return; }
                    const go = e.target.closest('[data-go]'); if (go) { this.snd('click'); const rr = this.itemByName(go.dataset.go); if (rr) this.openSheet(rr.outputId); return; }
                    const open = e.target.closest('[data-open]'); if (open) { this.snd('click'); this.openSheet(open.dataset.open); return; }
                    const add = e.target.closest('[data-add]'); if (add) { this.toggleItem(add.dataset.add); this.renderSheet(this.m.byId.get(this.current), true); return; }
                    const fit = e.target.closest('[data-fit]'); if (fit && this.sheetGraph) { this.sheetGraph.fit(); return; }
                });
                document.body.classList.add('rx-modal-open'); this.snd('openPopup');
            }
            this.renderSheet(r);
        }

        closeSheet() { if (!this.overlay) return; this.overlay.remove(); this.overlay = null; this.current = null; this.history = []; document.removeEventListener('keydown', this._esc); document.body.classList.remove('rx-modal-open'); this.snd('closePopup'); }

        // Research nodes (2026-10-10): the gate map's AND-sets closed over prerequisites, through the Command Deck's
        // ResearchModel so both pages give the same path. Council Rank is named on its own line: it gates the crafting
        // hab (Crafting Habs - Tier 1), never a recipe - no recipe's path holds a Council Rank node or level. Nodes marked
        // researched on the Command Deck (same origin, its localStorage key) show a tick and leave the totals.
        // Two places: a box beside the plan's raw bill (every recipe in the plan with its whole chain, since the plan
        // crafts every intermediate) and the recipe sheet (the recipe alone, then what its chain adds).
        researchKit() {
            const R = this.research; if (!R) return null;
            const start = R.start ? R.start.id : null;
            let owned = new Set();
            try { const v = JSON.parse(localStorage.getItem('commandDeck.research.v1') || 'null'); if (v && Array.isArray(v.owned)) owned = new Set(v.owned); } catch (e) { /* storage unavailable */ }
            const track = k => (R.tracks.find(t => t.key === k) || { label: k }).label;
            const lv = n => Object.entries(n.level).filter(([, v]) => v).map(([k, v]) => `${track(k)} L${v}`).join(', ');
            const list = set => Array.from(set).filter(n => n.id !== start).sort((a, b) => a.depth - b.depth || a.order - b.order);
            const row = n => `<a class="rx-ing rx-node${owned.has(n.id) ? ' done' : ''}" href="../CommandDeck/index.html?node=${encodeURIComponent(n.name)}" target="_blank" rel="noopener" style="--c:${TRACK_COLOR[n.track.key] || '#888'}" title="${esc(n.track.label)} node${lv(n) ? ' - needs ' + esc(lv(n)) : ''}. Open it on the Command Deck"><i></i><b>${owned.has(n.id) ? '✓ ' : ''}${esc(n.name)}</b><em>${lv(n) ? '' : esc(n.track.label)}</em><span>${esc(lv(n))}</span></a>`;
            const sum = set => { const b = R.bill(set, new Set([start].concat(Array.from(owned)))); const parts = Object.entries(b.levels).filter(([, v]) => v).map(([k, v]) => `${track(k)} L${v}${b.xp[k] != null ? ` (${num(b.xp[k])} XP)` : ''}`); return b.todo ? `${b.todo} to research${parts.length ? ' · ' + parts.join(', ') : ''}` : 'all researched'; };
            const habNode = Array.from(R.closure(R.habGate('hab-t1'))).find(n => n.id !== start);
            const council = what => `<div class="rx-row"><h4>Council Rank</h4><p class="rx-where">${habNode ? `<b>${esc(habNode.name)}</b>${owned.has(habNode.id) ? ' ✓' : ''}, a hab to craft in (${lv(habNode) || 'Council Rank L0'}, free). ` : ''}No Council Rank node gates ${what}: that track gates stakes, hab tiers and fleets.</p></div>`;
            return { R, list, row, sum, council };
        }

        planResearchPanel(items) {
            const K = this.researchKit(); if (!K) return '';
            const tags = new Set();
            items.forEach(it => { const r = this.m.byId.get(it.id); if (r) K.R.chainGate(r).forEach(t => tags.add(t)); });
            const set = K.R.closure(tags), nodes = K.list(set);
            return `<section class="rx-panel rx-research rp-research">
                <div class="rx-panel-head"><h3>Research nodes</h3><span>${nodes.length ? esc(K.sum(set)) : 'no research gate'}</span></div>
                ${nodes.length ? `<div class="rx-ings">${nodes.map(K.row).join('')}</div>` : '<p class="rx-note">The gate map lists no research for this plan.</p>'}
                ${K.council(items.length > 1 ? 'these recipes' : 'this recipe')}
                <p class="sb-foot">Every recipe in the plan with its whole chain, prerequisites included. Click a node to open it on the Command Deck; nodes you mark researched there get a tick here.</p>
            </section>`;
        }

        researchPanel(r) {
            const K = this.researchKit(); if (!K) return '';
            const own = K.R.closure(K.R.recipeGate(r.outputId)), chain = K.R.closure(K.R.chainGate(r));
            const mine = K.list(own), extra = K.list(chain).filter(n => !own.has(n));
            return `<section class="rx-panel rx-research">
                <div class="rx-panel-head"><h3>Research to craft it</h3><span>${mine.length ? esc(K.sum(own)) : 'no research gate'}</span></div>
                ${mine.length ? `<div class="rx-ings">${mine.map(K.row).join('')}</div>` : '<p class="rx-note">The gate map lists no research for this recipe.</p>'}
                ${K.council('this recipe')}
                ${extra.length ? `<div class="rx-row"><h4>Crafting the chain from raws adds ${extra.length}</h4><div class="rx-ings">${extra.map(K.row).join('')}</div><p class="rx-note">${esc(K.sum(chain))} for the whole chain.</p></div>` : ''}
            </section>`;
        }

        // "Other ways to make it": every other recipe for the same base item (other tiers, the standard recipe, tagged
        // alternatives). With the plan's faction chosen, each says whether that faction may craft it and, routing its
        // ingredients, which rival exclusive raws it still needs; with None, the exclusive raws in its tree and their owner.
        altVerdict(x) {
            const f = this.faction;
            if (!f) { const ex = this.m.exclusiveRaws(x); return ex.length ? `<em class="rp-v" title="exclusive raws in its chain as written">uses ${ex.map(e => `${esc(e.name)} (${e.owner})`).join(', ')}</em>` : ''; }
            if (!x.fac.includes(f)) return `<em class="rp-v no">${esc(x.fac.join('/'))} only</em>`;
            const rv = this.m.rivalRawsFor(x, f);
            return rv.length ? `<em class="rp-v warn">${f} needs ${rv.map(e => `${esc(e.name)} (${e.owner})`).join(', ')}</em>` : `<em class="rp-v ok">${f}: no rival raws</em>`;
        }

        // "Ways to make it" (owner rule): ONE box listing every way to make the item, its own row first -
        // label, who may craft it, starbase, direct ingredients and its ORES (the raws of its whole chain as written,
        // a faction's exclusive raw marked with its owner). With the plan's faction chosen, a verdict per way. Click a
        // way to show it in this sheet; "Use in plan" makes it the way the plan uses for this item. One way = no box.
        waysPanel(r) {
            const ways = this.m.ways(r); if (ways.length < 2) return '';
            // every way some plan entry of this item uses (fix 1 M2: an item may be in the plan more than one way), and
            // whether that entry follows the faction routing; the buttons act on the sheet's entry (planItem)
            const it = this.planItem(r.outputId), used = new Map(), itemName = (this.m.itemOf(r) || r).baseName;   // addendum 3: a way attached by id makes another name
            this.entriesOf(r.outputId).forEach(e => { const w = this.planWayOf(e); if (!used.has(w)) used.set(w, !e.way && !!this.faction); });
            const ore = o => o.owner ? `<span class="rp-ore own" style="--fc:${FAC_COLOR[o.owner]}" title="${esc(o.owner)} exclusive raw">${esc(o.name)} <em>${esc(o.owner)}</em></span>` : `<span class="rp-ore${o.raw ? '' : ' leaf'}"${o.raw ? '' : ' title="no recipe and not a raw: counted as a leaf"'}>${esc(o.name)}</span>`;
            return `<section class="rx-panel rp-ways-box">
                <div class="rx-panel-head"><h3>Ways to make it</h3><span>${ways.length} ways to make ${esc(itemName)} · ores = the raws of each way's whole chain${this.faction ? '' : ' · pick a faction in the plan to see which avoid rival raws'}${it && it.way && this.faction ? ` · <button type="button" class="rp-way-use" data-clear-way="${esc(r.outputId)}" title="Forget the picked way: the ${esc(this.faction)} routing chooses again">let ${esc(this.faction)} routing choose</button>` : ''}</span></div>
                <div class="rp-way-list">${ways.map(w => `<div class="rp-way${w.id === r.outputId ? ' on' : ''}" data-way="${esc(w.id)}" title="${w.id === r.outputId ? 'Shown in this sheet' : 'Show this way in the sheet'}">
                    <div class="rp-way-h"><i class="t t${w.tier}">T${w.tier}</i>${this.wayChip(w.recipe)}${w.recipe.baseName !== itemName ? `<small class="rp-way-makes">makes ${esc(w.recipe.baseName)}</small>` : ''}<small>${esc(w.factions.length === 3 ? 'all factions' : w.factions.join('/') + ' only')} · starbase L${w.starbase}</small>
                        <button type="button" class="rp-way-use${used.has(w.id) ? ' on' : ''}" data-plan-way="${esc(w.id)}" title="${used.has(w.id) ? (used.get(w.id) ? `The ${esc(this.faction)} routing makes this item this way; click to keep it even if the faction changes` : 'The plan makes this item this way') : 'Make this item this way in the plan'}">${used.has(w.id) ? (used.get(w.id) ? `✓ Plan uses this (${esc(this.faction)} routing)` : '✓ Plan uses this') : it ? 'Use in plan' : '+ Plan this way'}</button></div>
                    <div class="rp-way-r"><span class="k">Ingredients</span><span>${w.ingredients.map(i => `${esc(this.disp(i.name))} &times;${num(i.quantity)}`).join(' · ') || 'no inputs'}</span></div>
                    <div class="rp-way-r"><span class="k">Ores</span><span>${w.ores.map(ore).join('') || 'none'}</span></div>
                    ${this.faction ? `<div class="rp-way-r"><span class="k">${esc(this.faction)}</span><span>${this.altVerdict(w.recipe)}</span></div>` : ''}
                </div>`).join('')}</div>
            </section>`;
        }

        // Addendum 2 (owner): the sheet's Supply chain also draws the ORES other ways would use. Each
        // alternative ore is an extra pill hung from the item whose way would use it (dashed link, dashed pill), framed
        // with the drawn ore(s) it replaces as "one of" with "or" between them. Its second line names the way(s) and,
        // for a faction's exclusive raw, the owner (pill edge in the owner's colour, as in the ways box; "rival" when a
        // faction is chosen and it is not theirs). Click the pill = open the ore as any ore node; click its second line =
        // show that way (in place for this item, else that item's sheet at that way).
        drawAltGraph(r, view, open, label) {
            const AK = '\u0001alt\u0001', key = a => AK + a.node + AK + a.ore, byKey = new Map(view.alts.map(a => [key(a), a]));
            const dag = this.displayDag(view.dag), nodes = new Map(dag.nodes), edges = dag.edges.slice();
            view.alts.forEach(a => { nodes.set(key(a), { name: key(a), res: this.rm.byName.get(a.ore) || null, leaf: true, cat: a.raw ? 'raw' : 'processed', alt: a }); edges.push({ from: a.node, to: key(a), quantity: 0, alt: a }); });
            // one "one of" set per drawn ore replaced; sets that share an ore merge (a frame holds every member once)
            const sets = [];
            view.alts.forEach(a => {
                const mains = a.replaces.filter(x => nodes.has(x));
                const hit = sets.filter(s => mains.some(x => s.mains.includes(x)));
                const s = { mains: mains.slice(), alts: [key(a)] };
                hit.forEach(h => { h.mains.forEach(x => { if (!s.mains.includes(x)) s.mains.push(x); }); s.alts.unshift(...h.alts); sets.splice(sets.indexOf(h), 1); });
                sets.push(s);
            });
            const groups = sets.map(s => ({ members: s.mains.sort().concat(s.alts) })).filter(g => g.members.length > 1);
            const inGroup = new Set(); groups.forEach(g => g.members.forEach(x => inGroup.add(x)));
            const f = this.faction, ownerOf = n => this.m.ownerOf(n);
            const ways = a => {   // "Starter T1 · USTUR" + "Starter T2 · USTUR" -> "Starter T1/T2 · USTUR"; unlike labels -> "first +N"
                const ls = a.ways.map(w => w.label); if (ls.length === 1) return ls[0];
                const t = ls.map(l => l.split(' ')); let p = 0, q = 0;
                while (t.every(x => x.length > p && x[p] === t[0][p])) p++;
                while (t.every(x => x.length - q > p && x[x.length - 1 - q] === t[0][t[0].length - 1 - q])) q++;
                const mid = t.map(x => x.slice(p, x.length - q).join(' '));
                return p + q && mid.every(s => s && !/\s/.test(s)) ? t[0].slice(0, p).concat([mid.join('/')], t[0].slice(t[0].length - q)).join(' ') : `${ls.slice().sort((x, y) => x.length - y.length)[0]} +${ls.length - 1}`;
            };
            const sub = a => `${a.owner ? `${a.owner} raw${a.rival ? ' (rival)' : ''} · ` : 'or · '}${ways(a)}`;
            const markOf = name => { const a = byKey.get(name), o = a ? a.owner : inGroup.has(name) ? ownerOf(name) : null; return o ? ` own own-${o}${f && o !== f ? ' rival' : ''}` : ''; };
            this.sheetGraph = new ChainGraph(document.getElementById('rpSheetGraph'), {
                onOpen: name => open(byKey.has(name) ? byKey.get(name).ore : name), sound: n => this.snd(n),
                // a drawn ore framed with alternatives says its owner too (as the alternatives and the ways box do)
                label: n => { if (n.data && n.data.alt) return sub(n.data.alt); const o = inGroup.has(n.name) ? ownerOf(n.name) : null; return o ? `${o} raw${f && o !== f ? ' (rival)' : ''} · ${label(n)}` : label(n); },
                display: name => (byKey.has(name) ? byKey.get(name).ore : this.disp(name)),
                title: n => { const a = byKey.get(n.name); if (!a) { const o = inGroup.has(n.name) ? ownerOf(n.name) : null; return o ? `${n.name} - ${o} exclusive raw${f && o !== f ? ` (a rival of ${f})` : ''}` : n.name; } return `${a.ore}${a.owner ? ` - ${a.owner} exclusive raw${a.rival ? ` (a rival of ${f})` : ''}` : ''}. The ${a.ways.map(w => w.label).join(' / ')} way${a.ways.length > 1 ? 's' : ''} of ${this.disp(a.node)} use${a.ways.length > 1 ? '' : 's'} it${a.replaces.length ? ` in place of ${a.replaces.join(', ')}` : ''}. Click to open the ore; click this second line to show that way.`; },
                nodeClass: n => `${byKey.has(n.name) ? 'alt' : ''}${markOf(n.name)}`.trim(),
                edgeClass: e => (e.alt ? 'alt' : ''),
                edgeLabel: e => (e.alt ? `${this.disp(e.from)}, made the ${e.alt.ways.map(w => w.label).join(' / ')} way, would use ${e.alt.ore}` : `${e.from} needs ${e.to} ×${e.quantity}`),
                groups, hitTest: true,
                onSub: name => { const a = byKey.get(name); if (!a) return false; this.showWay(r, a.ways[0].id); return true; }
            });
            this.sheetGraph.draw(Object.assign({}, dag, { nodes, edges }));
        }

        // show a way picked from the graph: a way of the sheet's item switches the sheet in place, pinned (the faction
        // routing does not override a pick); a way of another item opens that item's sheet at that way
        showWay(r, id) {
            if (!this.m.byId.has(id)) return;
            if (this.m.isWayOf(id, r)) { this.current = id; this.sheetPin = true; this.renderSheet(this.m.byId.get(id), true); }
            else this.openSheet(id, true, true);
        }

        // r = the way shown (an item's own row or one of its alternative ways); keepScroll after a switch in place
        renderSheet(r, keepScroll) {
            const res = r.res;   // a tagged row stands for its base item
            // addendum 2: the chain of the way shown (routed by the plan's faction unless a way was picked) and the ores
            // other ways would use; an item with one way at faction None draws exactly as before (rm.dag)
            let view = this.m.chainView(r, { faction: this.faction, pin: !!this.sheetPin || this.m.itemOf(r) !== r });
            if (!RecipePlanner.showOneOf) view = Object.assign({}, view, { alts: [] });   // addendum 3 G3: the plain chain
            const dag = view.dag;
            const routedTo = view.way !== this.m.own(r) && this.m.isWayOf(view.way, r) ? view.way : null;
            const nk = this.norm(r.outputId), inPlan = !!nk && this.items.some(x => this.keyOf(x) === this.keyOf(nk));   // this item made THIS way
            const item = this.m.itemOf(r), lbl = this.m.wayLabel(r), nWays = this.m.wayRecipes(r).length;
            const others = this.m.otherTiers(r);   // fix 1 M4: same-name rows that are not ways of this item, as before
            const sheetEl = this.overlay.querySelector('.rx-sheet'), scroll = keepScroll && sheetEl ? sheetEl.scrollTop : 0;
            const users = (res ? res.consumers : []).slice().sort((a, b) => b.quantity - a.quantity).slice(0, 10);
            const where = (r.planetTypes || []).map(t => t.replace(/ Planet$/, '')).join(', ');
            const back = this.history.length ? this.m.byId.get(this.history[this.history.length - 1]) : null;
            this.overlay.innerHTML = `
                <div class="rx-sheet" style="--c:${(res && CAT[res.category] || CAT.plan).color}">
                    <button type="button" class="rx-x" data-close aria-label="Close">&times;</button>
                    <header class="rx-head">
                        ${back ? `<button type="button" class="sb-btn ghost rx-back" data-back>&larr; ${esc(back.baseName)}${back.isAlternative ? ` (${esc(back.tags.join(' · '))})` : ''}</button>` : ''}
                        <div class="rx-title"><i class="t t${r.outputTier}">T${r.outputTier}</i><h2>${esc(r.baseName)}</h2>${r.isAlternative ? tagChips(r) : lbl !== 'Standard' ? this.wayChip(r) : ''}</div>
                        ${item && item.baseName !== r.baseName ? `<p class="rp-alt-note">Listed under <b>${esc(item.baseName)}</b> as an intermediate recipe: it makes <b>${esc(r.baseName)}</b>, which has no standard recipe of its own, and its id names ${esc(item.baseName)} (<code>${esc(item.outputId)}</code>). Every way is listed under <b>Ways to make it</b>.</p>`
                            : item && item.isAlternative ? `<p class="rp-alt-note"><b>${esc(r.baseName)}</b> has no standard recipe: it is made only by the ${nWays} ways listed under <b>Ways to make it</b>${r.isAlternative ? ', and this sheet shows one of them' : ''}. Intermediate recipes exist so a faction does not have to depend on a rival's exclusive raw.</p>`
                            : r.isAlternative ? `<p class="rp-alt-note">Showing an intermediate recipe: it makes the same <b>${esc(r.baseName)}</b> as the standard recipe, from other ingredients. Intermediate recipes exist so a faction does not have to depend on a rival's exclusive raw. Every way is listed under <b>Ways to make it</b>.</p>`
                            : lbl !== 'Standard' ? `<p class="rp-alt-note">Showing ${lbl === 'Other recipe' ? 'another recipe' : `the <b>${esc(lbl)}</b>`}: it makes the same <b>${esc(r.baseName)}</b> as the standard recipe, from its own ingredients. Every way is listed under <b>Ways to make it</b>.</p>` : ''}
                        <div class="rx-badges">
                            <span class="badge">${esc(r.typeLabel)}</span>${r.resourceType && r.resourceType !== r.typeLabel ? `<span class="badge">${esc(r.resourceType)} recipe</span>` : ''}
                            <span class="badge">${r.ingredientCount ? `${r.depth} step${r.depth === 1 ? '' : 's'} from raw` : 'no inputs'}</span>
                            ${dag.nodes.size > 1 ? `<span class="badge">${num(dag.nodes.size - 1)} resources in its chain</span>` : ''}
                            <span class="badge">starbase L${r.starbase}</span>${r.factionOnly ? `<span class="badge">${esc(r.factionOnly)} only</span>` : ''}${r.exotic ? '<span class="badge">exotic</span>' : ''}
                            <button type="button" class="sb-btn rp-sheet-add" data-add="${esc(r.outputId)}">${inPlan ? '✓ In the plan · remove' : `+ Add to plan${r.isAlternative || (lbl !== 'Standard' && !this.faction) ? ' (this way)' : ''}`}</button>
                        </div>
                    </header>
                    <div class="rx-body">
                        <section class="rx-graph-wrap"><div class="rx-panel-head"><h3>Supply chain</h3><span>${dag.nodes.size > 1 ? `${num(dag.nodes.size - 1)} resources, ${num(dag.edges.length)} links, ${dag.depth} levels` : 'This recipe has no inputs.'}${routedTo ? ` · drawn the way ${esc(this.faction)} routing makes it: <b>${esc(this.m.wayLabel(routedTo))}</b>` : ''}${view.alts.length ? ` · <span class="rp-alt-key">${num(view.alts.length)} ore${view.alts.length === 1 ? '' : 's'} of intermediate recipes (dashed): click one to open it, its second line to show that way</span>` : ''}</span>${dag.nodes.size > 1 ? '<button type="button" class="sb-btn ghost" data-fit>Fit</button>' : ''}</div><div class="rx-graph rp-sheet-graph" id="rpSheetGraph"></div></section>
                        ${this.researchPanel(r)}
                        <div class="rx-side">
                            <section class="rx-panel">
                                <div class="rx-panel-head"><h3>Recipe</h3><span>makes ${r.outputQuantity} per craft</span></div>
                                <div class="rx-ings">${(r.ingredients || []).map(i => { const ir = this.m.resOf(i.name), ia = this.rm.recipeByName.get(i.name); return `<button type="button" class="rx-ing" data-go="${esc(i.name)}" title="${esc(i.name)}" style="--c:${(ir && CAT[ir.category] || CAT.processed).color}"><i></i><b>${esc(this.disp(i.name))}${ia ? tagChips(this.m.own(ia)) : ''}</b>${ir ? `<em class="t t${ir.tier}">T${ir.tier}</em>` : ''}<span>&times;${i.quantity}</span></button>`; }).join('') || '<p class="sb-muted">No ingredients: an extraction or basic recipe.</p>'}</div>
                                <div class="rx-facts"><div><b>${fmtTime(r.constructionTime)}</b><span>build time</span></div><div><b>${r.productionSteps != null ? r.productionSteps : r.depth}</b><span>production steps</span></div><div><b>L${r.starbase}</b><span>starbase</span></div><div><b>${r.ingredientCount}</b><span>ingredients</span></div></div>
                                ${where ? `<div class="rx-row"><h4>Crafted on</h4><p class="rx-where">${esc(where)}</p></div>` : ''}
                                ${others.length ? `<div class="rx-row"><h4>Other tiers of this output</h4><div class="chips">${others.map(v => `<button type="button" class="chip" data-open="${esc(v.outputId)}"><i class="t t${v.outputTier}">T${v.outputTier}</i>${esc(v.typeLabel)}</button>`).join('')}</div></div>` : ''}
                                <div class="rx-actions">${res ? `<a class="sb-btn ghost" href="../ResourcesExplorer/index.html?r=${encodeURIComponent(r.baseName)}" target="_blank" rel="noopener">Open in Resources Explorer &rarr;</a>` : ''}<a class="sb-btn ghost" href="../CommandDeck/index.html?recipe=${encodeURIComponent(r.outputId)}" target="_blank" rel="noopener" title="The research nodes this recipe and its chain need, with levels, XP and ATLAS">Research path &rarr;</a></div>
                            </section>
                            ${this.waysPanel(r)}
                            <section class="rx-panel">
                                <div class="rx-panel-head"><h3>Who uses the output</h3><span>${res ? (res.demand ? `${num(res.demand)} recipes` : 'nothing lists it as an ingredient') : 'buildings, ships and extractors are not ingredients'}</span></div>
                                ${users.length ? `<div class="rx-ings">${users.map(u => `<button type="button" class="rx-ing" data-open="${esc(u.id)}" style="--c:#4fd8ff"><i></i><b>${esc(u.name)}</b>${u.tier ? `<em class="t t${u.tier}">T${u.tier}</em>` : ''}<span>&times;${num(u.quantity)}</span></button>`).join('')}</div>${res.demand > 10 ? `<p class="rx-note">${num(res.demand - 10)} more in the Resources Explorer.</p>` : ''}` : ''}
                            </section>
                        </div>
                    </div>
                </div>`;
            if (dag.nodes.size > 1) {
                // addendum 2: a node opens its item's sheet, a raw opens in the Resources Explorer (as on the plan graph);
                // hitTest because the graph holds pointer capture (without it no click on a node ever arrived)
                const open = name => this.openByName(name);
                const label = n => n.res ? `T${n.res.tier} · ${CAT[n.res.category] ? CAT[n.res.category].label : ''}` : '';
                if (!view.alts.length) {
                    this.sheetGraph = new ChainGraph(document.getElementById('rpSheetGraph'), { onOpen: open, sound: n => this.snd(n), label, display: name => this.disp(name), hitTest: true });
                    this.sheetGraph.draw(this.displayDag(dag));
                } else this.drawAltGraph(r, view, open, label);
            } else { const g = document.getElementById('rpSheetGraph'); if (g) g.innerHTML = '<div class="rx-raw-portrait"><p>Nothing below this recipe: it is extracted or a basic resource.</p></div>'; }
            this.overlay.querySelector('.rx-sheet').scrollTop = scroll;
        }
    }

    RecipePlanner.showOneOf = SHOW_ONE_OF;
    window.RecipePlanner = RecipePlanner;
})();
