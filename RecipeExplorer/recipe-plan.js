// recipe-plan.js - Recipe Explorer, Planner tab (rebuilt 2026-10-01): the recipe finder (left) and the production plan
// (right). Add recipes with a quantity; the sheet is always on: the raw bill, the craft list in build order, time,
// where it can be crafted, and the aggregated chain graph (shared Utils/ChainGraph.js) with quantities on the edges.
// A recipe sheet opens for any row or node: output, ingredients, facts, who uses it, add to plan. The plan survives
// a reload (localStorage) and ?recipe=<id|name> adds one, ?search= pre-fills the finder.
(function () {
    'use strict';

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const CAT = { raw: { label: 'Raw', color: '#dd7429' }, processed: { label: 'Processed', color: '#2a9fcf' }, component: { label: 'Component', color: '#2fa985' }, advanced: { label: 'Advanced', color: '#9476db' }, plan: { label: 'Plan', color: '#4fd8ff' } };
    const fmtTime = sec => { if (!sec) return '0 s'; if (sec < 60) return Math.round(sec) + ' s'; const m = Math.round(sec / 60); if (m < 60) return m + ' min'; const h = Math.floor(m / 60), mm = m % 60; if (h < 48) return h + ' h' + (mm ? ' ' + mm + ' min' : ''); return (h / 24).toFixed(1) + ' days'; };
    const num = v => (v || 0).toLocaleString();
    const PAGE = 100, KEY = 'recipeExplorer.plan.v1';

    class RecipePlanner {
        constructor(model) {
            this.m = model; this.rm = model.rm;
            this.filters = { q: '', mode: 'name', types: new Set(), tiers: new Set(), star: new Set(), sort: 'name' };
            this.shown = PAGE;
            this.items = this.load();
            this.history = [];
            this.renderFinder(); this.bind(); this.applyFinder(); this.renderPlan();
        }

        snd(n) { if (window.spaceSounds && window.spaceSounds[n]) window.spaceSounds[n](); }
        load() { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter(x => x && this.m.byId.has(x.id)).map(x => ({ id: x.id, qty: Math.max(1, Math.min(100000, +x.qty || 1)) })) : []; } catch (e) { return []; } }
        save() { try { localStorage.setItem(KEY, JSON.stringify(this.items)); } catch (e) { /* storage unavailable */ } }

        // ------------------------------------------------------------- finder
        renderFinder() {
            const side = document.getElementById('rpSide'); if (!side) return;
            const st = this.m.stats;
            side.innerHTML = `
                <div class="rx-side-head"><h3>Find a recipe</h3><span class="sb-count" id="rpCount"></span></div>
                <input type="text" id="searchInput" class="sb-input" placeholder="Output name, e.g. Copper Wire, Mining Rig" autocomplete="off">
                <div class="chips" data-group="mode"><button type="button" class="chip on" data-v="name">By output</button><button type="button" class="chip" data-v="ingredient">By ingredient</button></div>
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
            const f = this.filters, q = f.q;
            this.found = this.m.recipes.filter(r =>
                (!q || (f.mode === 'ingredient' ? (r.ingredients || []).some(i => i.name.toLowerCase().includes(q)) : (r.outputName.toLowerCase().includes(q) || r.outputId.includes(q)))) &&
                (!f.types.size || f.types.has(r.outputType)) && (!f.tiers.size || f.tiers.has(String(r.outputTier))) && (!f.star.size || f.star.has(String(r.starbase))));
            const cmp = { name: (a, b) => a.outputName.localeCompare(b.outputName) || a.outputTier - b.outputTier, tier: (a, b) => a.outputTier - b.outputTier || a.outputName.localeCompare(b.outputName), time: (a, b) => (b.constructionTime || 0) - (a.constructionTime || 0), depth: (a, b) => b.depth - a.depth, ingredients: (a, b) => b.ingredientCount - a.ingredientCount }[f.sort];
            this.found.sort((a, b) => cmp(a, b) || a.outputName.localeCompare(b.outputName));
            this.shown = PAGE; this.renderList();
        }

        renderList() {
            const el = document.getElementById('rpList'), c = document.getElementById('rpCount'); if (!el) return;
            if (c) c.textContent = `${num(this.found.length)} of ${num(this.m.recipes.length)}`;
            const inPlan = new Set(this.items.map(i => i.id));
            el.innerHTML = this.found.slice(0, this.shown).map(r => `
                <div class="rp-row${inPlan.has(r.outputId) ? ' in' : ''}" data-id="${esc(r.outputId)}">
                    <div class="rp-row-main" data-open="${esc(r.outputId)}"><b><i class="t t${r.outputTier}">T${r.outputTier}</i>${esc(r.outputName)}</b><span>${esc(r.typeLabel)} · ${r.ingredientCount ? r.ingredientCount + ' ingr.' : 'no inputs'} · ${fmtTime(r.constructionTime)}</span></div>
                    <button type="button" class="rp-add" data-add="${esc(r.outputId)}" title="Add to the plan">${inPlan.has(r.outputId) ? '✓' : '+'}</button>
                </div>`).join('') + (this.found.length > this.shown ? `<button type="button" class="sb-more" data-more>Show ${Math.min(PAGE, this.found.length - this.shown)} more of ${num(this.found.length - this.shown)}</button>` : '') || '<p class="sb-muted an-empty">No recipe matches.</p>';
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
                if (e.target.id === 'rpClear') { ['types', 'tiers', 'star'].forEach(g => this.filters[g].clear()); this.filters.q = ''; document.getElementById('searchInput').value = ''; side.querySelectorAll('.chip.on').forEach(x => { if (x.closest('[data-group]').dataset.group !== 'mode') x.classList.remove('on'); }); this.snd('deselect'); this.applyFinder(); return; }
                const add = e.target.closest('[data-add]'); if (add) { this.toggleItem(add.dataset.add); return; }
                const more = e.target.closest('[data-more]'); if (more) { this.shown += PAGE; this.snd('click'); this.renderList(); return; }
                const open = e.target.closest('[data-open]'); if (open) { this.snd('click'); this.openSheet(open.dataset.open); }
            });
            side.addEventListener('change', e => { if (e.target.id === 'rpSort') { this.filters.sort = e.target.value; this.applyFinder(); } });
            main.addEventListener('click', e => {
                const rm = e.target.closest('[data-remove]'); if (rm) { this.items = this.items.filter(i => i.id !== rm.dataset.remove); this.snd('deselect'); this.save(); this.renderList(); this.renderPlan(); return; }
                const clr = e.target.closest('[data-plan-clear]'); if (clr) { this.items = []; this.focus = null; this.snd('deselect'); this.save(); this.renderList(); this.renderPlan(); return; }
                const fc = e.target.closest('[data-focus]'); if (fc) { this.focus = this.focus === fc.dataset.focus ? null : fc.dataset.focus; this.snd(this.focus ? 'select' : 'deselect'); this.renderPlan(); return; }
                const open = e.target.closest('[data-open]'); if (open) { this.snd('click'); this.openSheet(open.dataset.open); return; }
                const go = e.target.closest('[data-go]'); if (go) { this.snd('click'); this.openByName(go.dataset.go); return; }
                const fit = e.target.closest('[data-fit]'); if (fit && this.graph) { this.graph.fit(); return; }
            });
            main.addEventListener('change', e => { const q = e.target.closest('[data-qty]'); if (q) { const it = this.items.find(i => i.id === q.dataset.qty); if (it) { it.qty = Math.max(1, Math.min(100000, parseInt(q.value, 10) || 1)); q.value = it.qty; this.save(); this.renderPlan(); } } });
        }

        handleSearch(q) { this.filters.q = (q || '').trim().toLowerCase(); this.applyFinder(); }

        toggleItem(id) {
            const i = this.items.findIndex(x => x.id === id);
            if (i >= 0) { this.items.splice(i, 1); this.snd('deselect'); } else { this.items.push({ id, qty: 1 }); this.snd('success'); }
            this.save(); this.renderList(); this.renderPlan();
        }
        addItem(id, qty) { if (!this.m.byId.has(id)) return; const it = this.items.find(x => x.id === id); if (it) it.qty = qty || it.qty; else this.items.push({ id, qty: qty || 1 }); this.save(); this.renderList(); this.renderPlan(); }

        // ------------------------------------------------------------- plan
        renderPlan() {
            const main = document.getElementById('rpMain'); if (!main) return;
            if (!this.items.length) {
                main.innerHTML = `<div class="rp-empty"><h3>Production plan</h3><p>Add recipes from the finder with <b>+</b> and set quantities. The sheet shows every raw to gather, every intermediate to craft in build order, how long it takes, where it can be crafted, and the whole chain in one graph.</p><p class="sb-muted">Try: search <b>Mining Rig</b>, add one, then add a <b>Power Regulation Module</b>.</p></div>`;
                return;
            }
            // the numbers, the raw bill and the craft list always total EVERY recipe in the plan (owner, 2026-10-01);
            // focus (click a plan item) changes only the chain graph, which then shows that recipe alone at its quantity
            if (this.focus && !this.items.some(i => i.id === this.focus)) this.focus = null;
            const p = this.plan = this.m.plan(this.items);
            const pg = this.focus ? this.m.plan(this.items.filter(i => i.id === this.focus)) : p;
            const maxRaw = Math.max(1, ...p.raws.map(r => r.qty)), maxCraft = Math.max(1, ...p.crafts.map(c => c.time));
            const focused = this.focus ? this.m.byId.get(this.focus) : null;
            main.innerHTML = `
                <div class="rp-plan">
                    <div class="rp-items">
                        ${this.items.map(it => { const r = this.m.byId.get(it.id); return `<div class="rp-item${this.focus === it.id ? ' on' : ''}"><button type="button" class="rp-item-name" data-focus="${esc(it.id)}" title="${this.focus === it.id ? 'Back to the whole plan' : 'Show only this recipe'}"><i class="t t${r.outputTier}">T${r.outputTier}</i>${esc(r.outputName)}<small>${esc(r.typeLabel)}</small></button><label>&times;<input type="number" min="1" max="100000" value="${it.qty}" data-qty="${esc(it.id)}"></label><button type="button" class="rp-x" data-remove="${esc(it.id)}" title="Remove">&times;</button></div>`; }).join('')}
                        <button type="button" class="sb-btn ghost" data-plan-clear>Clear plan</button>
                        ${this.items.length > 1 ? `<span class="rp-focus-hint">${focused ? `Chain shows <b>${esc(focused.outputName)}</b> only &middot; click it again for the whole plan` : 'Click a recipe to see its chain alone'}</span>` : ''}
                    </div>
                    <div class="an-stats rp-stats">
                        <div class="an-stat"><b>${num(p.totals.rawKinds)}</b><span>raw kinds · ${num(p.totals.rawUnits)} units</span></div>
                        <div class="an-stat"><b>${num(p.totals.steps)}</b><span>intermediates · ${num(p.totals.crafts)} crafts</span></div>
                        <div class="an-stat"><b>${fmtTime(p.time.critical)}</b><span>critical path (all in parallel)</span></div>
                        <div class="an-stat"><b>${fmtTime(p.time.sequential)}</b><span>every craft in sequence</span></div>
                        <div class="an-stat"><b>L${p.starbase}</b><span>starbase level needed</span></div>
                        <div class="an-stat ${p.totals.stakeless ? 'warn' : ''}"><b>${num(p.totals.stakeless)}</b><span>raws no claim stake can mine</span></div>
                    </div>
                    <section class="rx-graph-wrap">
                        <div class="rx-panel-head"><h3>${focused ? esc(focused.outputName) + ' chain' : 'The whole chain'}</h3><span>${num(pg.nodes.size)} resources, ${num(pg.edges.length)} links · quantities on the links are totals${focused ? ' for this recipe at its quantity' : ' for this plan'} · drag to pan, wheel to zoom, hover to trace, click to open</span><button type="button" class="sb-btn ghost" data-fit>Fit</button></div>
                        <div class="rx-graph" id="rpGraph"></div>
                    </section>
                    <div class="rp-sheet">
                        <section class="rx-panel">
                            <div class="rx-panel-head"><h3>Raw bill</h3><span>${num(p.totals.rawKinds)} deposits to gather${p.totals.stakeless ? ` · <em class="warn">${p.totals.stakeless} no claim stake can mine</em>` : ''}</span></div>
                            <div class="ch">${p.raws.map(r => `<div class="ch-row"><button type="button" class="ch-lbl rx-link" data-go="${esc(r.name)}" title="${esc(r.name)}">${r.res ? `<i class="t t${r.res.tier}">T${r.res.tier}</i>` : ''}${esc(r.name)}</button><div class="ch-bar"><b style="width:${(100 * r.qty / maxRaw).toFixed(1)}%;background:${r.fleet ? '#ffd36b' : '#dd7429'}"><span class="ct">${esc(r.name)}: ${num(r.qty)} units · ${r.stake ? 'claim-stake extractor' : r.beltOnly ? 'belts only, fleet mining' : r.fleet ? 'no extractor kit, fleet mining' : 'not a mapped deposit'}</span></b></div><span class="ch-val">${num(r.qty)}</span></div>`).join('')}</div>
                            <div class="ch-key" style="margin-top:0.6rem"><span><i style="background:#dd7429"></i>claim-stake extractor</span><span><i style="background:#ffd36b"></i>fleet mining only</span></div>
                        </section>
                        <section class="rx-panel">
                            <div class="rx-panel-head"><h3>Craft list · build order</h3><span>deepest first; crafts = units ÷ output per craft, rounded up; time = crafts × build time</span></div>
                            <div class="rp-crafts">${p.crafts.map(c => `<div class="rp-craft"><span class="d">${c.depth}</span><button type="button" class="nm rx-link" data-go="${esc(c.name)}">${c.res ? `<i class="t t${c.res.tier}">T${c.res.tier}</i>` : ''}${esc(c.name)}</button><span class="n">&times;${num(c.crafts)}<small>${num(c.units)} units</small></span><span class="bar"><b style="width:${(100 * c.time / maxCraft).toFixed(1)}%"></b></span><span class="n">${fmtTime(c.time)}<small>${fmtTime(c.each)} each</small></span></div>`).join('')}</div>
                            <p class="sb-foot">Build times are the export's <i>constructionTime</i> read as seconds. Critical path = the longest chain of build times from a raw to an output with every craft running in parallel; the sequential figure adds every craft up.</p>
                        </section>
                    </div>
                </div>`;
            const host = document.getElementById('rpGraph');
            this.graph = new ChainGraph(host, {
                onOpen: name => this.openByName(name), sound: n => this.snd(n),
                label: n => { const u = pg.crafts.find(c => c.name === n.name); const units = pg.raws.find(r => r.name === n.name); return n.data && n.data.cat === 'plan' ? `${pg.items.length} recipes` : (u ? `×${num(u.crafts)} crafts · ${num(u.units)} units` : units ? `${num(units.qty)} units · raw` : (n.res ? `T${n.res.tier} · ${CAT[n.res.category] ? CAT[n.res.category].label : ''}` : '')); },
                edgeLabel: e => `${e.from} needs ${e.to}: ${num(e.quantity)} units (${e.per} per craft)`
            });
            this.graph.draw(this.m.planDag(pg));
        }

        // ------------------------------------------------------------- recipe sheet
        openByName(name) { const r = this.rm.recipeByName.get(name); if (r) this.openSheet(r.outputId); else if (this.rm.byName.has(name)) window.open(`../ResourcesExplorer/index.html?r=${encodeURIComponent(name)}`, '_blank', 'noopener'); }

        openSheet(id, push = true) {
            const r = this.m.byId.get(id); if (!r) return;
            if (push && this.current && this.current !== id) this.history.push(this.current);
            this.current = id;
            if (!this.overlay) {
                this.overlay = document.createElement('div'); this.overlay.className = 'rx-modal'; document.body.appendChild(this.overlay);
                this._esc = e => { if (e.key === 'Escape') this.closeSheet(); }; document.addEventListener('keydown', this._esc);
                this.overlay.addEventListener('click', e => {
                    if (e.target === this.overlay || e.target.closest('[data-close]')) { this.closeSheet(); return; }
                    const back = e.target.closest('[data-back]'); if (back) { const prev = this.history.pop(); if (prev) { this.snd('click'); this.openSheet(prev, false); } return; }
                    const go = e.target.closest('[data-go]'); if (go) { this.snd('click'); const rr = this.rm.recipeByName.get(go.dataset.go); if (rr) this.openSheet(rr.outputId); return; }
                    const open = e.target.closest('[data-open]'); if (open) { this.snd('click'); this.openSheet(open.dataset.open); return; }
                    const add = e.target.closest('[data-add]'); if (add) { this.toggleItem(add.dataset.add); this.renderSheet(this.m.byId.get(this.current)); return; }
                    const fit = e.target.closest('[data-fit]'); if (fit && this.sheetGraph) { this.sheetGraph.fit(); return; }
                });
                document.body.classList.add('rx-modal-open'); this.snd('openPopup');
            }
            this.renderSheet(r);
        }

        closeSheet() { if (!this.overlay) return; this.overlay.remove(); this.overlay = null; this.current = null; this.history = []; document.removeEventListener('keydown', this._esc); document.body.classList.remove('rx-modal-open'); this.snd('closePopup'); }

        renderSheet(r) {
            const res = this.rm.byName.get(r.outputName);
            const dag = this.rm.dag(r.outputName);
            const inPlan = this.items.some(i => i.id === r.outputId);
            const users = (res ? res.consumers : []).slice().sort((a, b) => b.quantity - a.quantity).slice(0, 10);
            const variants = this.m.recipes.filter(x => x.outputName === r.outputName && x.outputId !== r.outputId);
            const where = (r.planetTypes || []).map(t => t.replace(/ Planet$/, '')).join(', ');
            const back = this.history.length ? this.m.byId.get(this.history[this.history.length - 1]) : null;
            this.overlay.innerHTML = `
                <div class="rx-sheet" style="--c:${(res && CAT[res.category] || CAT.plan).color}">
                    <button type="button" class="rx-x" data-close aria-label="Close">&times;</button>
                    <header class="rx-head">
                        ${back ? `<button type="button" class="sb-btn ghost rx-back" data-back>&larr; ${esc(back.outputName)}</button>` : ''}
                        <div class="rx-title"><i class="t t${r.outputTier}">T${r.outputTier}</i><h2>${esc(r.outputName)}</h2></div>
                        <div class="rx-badges">
                            <span class="badge">${esc(r.typeLabel)}</span>${r.resourceType && r.resourceType !== r.typeLabel ? `<span class="badge">${esc(r.resourceType)} recipe</span>` : ''}
                            <span class="badge">${r.ingredientCount ? `${r.depth} step${r.depth === 1 ? '' : 's'} from raw` : 'no inputs'}</span>
                            ${dag.nodes.size > 1 ? `<span class="badge">${num(dag.nodes.size - 1)} resources in its chain</span>` : ''}
                            <span class="badge">starbase L${r.starbase}</span>${r.factionOnly ? `<span class="badge">${esc(r.factionOnly)} only</span>` : ''}${r.exotic ? '<span class="badge">exotic</span>' : ''}
                            <button type="button" class="sb-btn rp-sheet-add" data-add="${esc(r.outputId)}">${inPlan ? '✓ In the plan · remove' : '+ Add to plan'}</button>
                        </div>
                    </header>
                    <div class="rx-body">
                        <section class="rx-graph-wrap"><div class="rx-panel-head"><h3>Supply chain</h3><span>${dag.nodes.size > 1 ? `${num(dag.nodes.size - 1)} resources, ${num(dag.edges.length)} links, ${dag.depth} levels` : 'This recipe has no inputs.'}</span>${dag.nodes.size > 1 ? '<button type="button" class="sb-btn ghost" data-fit>Fit</button>' : ''}</div><div class="rx-graph rp-sheet-graph" id="rpSheetGraph"></div></section>
                        <div class="rx-side">
                            <section class="rx-panel">
                                <div class="rx-panel-head"><h3>Recipe</h3><span>makes ${r.outputQuantity} per craft</span></div>
                                <div class="rx-ings">${(r.ingredients || []).map(i => { const ir = this.rm.byName.get(i.name); return `<button type="button" class="rx-ing" data-go="${esc(i.name)}" style="--c:${(ir && CAT[ir.category] || CAT.processed).color}"><i></i><b>${esc(i.name)}</b>${ir ? `<em class="t t${ir.tier}">T${ir.tier}</em>` : ''}<span>&times;${i.quantity}</span></button>`; }).join('') || '<p class="sb-muted">No ingredients: an extraction or basic recipe.</p>'}</div>
                                <div class="rx-facts"><div><b>${fmtTime(r.constructionTime)}</b><span>build time</span></div><div><b>${r.productionSteps != null ? r.productionSteps : r.depth}</b><span>production steps</span></div><div><b>L${r.starbase}</b><span>starbase</span></div><div><b>${r.ingredientCount}</b><span>ingredients</span></div></div>
                                ${where ? `<div class="rx-row"><h4>Crafted on</h4><p class="rx-where">${esc(where)}</p></div>` : ''}
                                ${r.research_requirements && r.research_requirements.length ? `<div class="rx-row"><h4>Research nodes</h4><p class="rx-where">${r.research_requirements.map(x => esc(typeof x === 'object' ? (x.name || JSON.stringify(x)) : x)).join(', ')}</p></div>` : ''}
                                ${variants.length ? `<div class="rx-row"><h4>Other tiers of this output</h4><div class="chips">${variants.map(v => `<button type="button" class="chip" data-open="${esc(v.outputId)}"><i class="t t${v.outputTier}">T${v.outputTier}</i>${esc(v.typeLabel)}</button>`).join('')}</div></div>` : ''}
                                ${res ? `<div class="rx-actions"><a class="sb-btn ghost" href="../ResourcesExplorer/index.html?r=${encodeURIComponent(r.outputName)}" target="_blank" rel="noopener">Open in Resources Explorer &rarr;</a></div>` : ''}
                            </section>
                            <section class="rx-panel">
                                <div class="rx-panel-head"><h3>Who uses the output</h3><span>${res ? (res.demand ? `${num(res.demand)} recipes` : 'nothing lists it as an ingredient') : 'buildings, ships and extractors are not ingredients'}</span></div>
                                ${users.length ? `<div class="rx-ings">${users.map(u => `<button type="button" class="rx-ing" data-open="${esc(u.id)}" style="--c:#4fd8ff"><i></i><b>${esc(u.name)}</b>${u.tier ? `<em class="t t${u.tier}">T${u.tier}</em>` : ''}<span>&times;${num(u.quantity)}</span></button>`).join('')}</div>${res.demand > 10 ? `<p class="rx-note">${num(res.demand - 10)} more in the Resources Explorer.</p>` : ''}` : ''}
                            </section>
                        </div>
                    </div>
                </div>`;
            if (dag.nodes.size > 1) {
                this.sheetGraph = new ChainGraph(document.getElementById('rpSheetGraph'), { onOpen: name => { const rr = this.rm.recipeByName.get(name); if (rr) this.openSheet(rr.outputId); }, sound: n => this.snd(n), label: n => n.res ? `T${n.res.tier} · ${CAT[n.res.category] ? CAT[n.res.category].label : ''}` : '' });
                this.sheetGraph.draw(dag);
            } else { const g = document.getElementById('rpSheetGraph'); if (g) g.innerHTML = '<div class="rx-raw-portrait"><p>Nothing below this recipe: it is extracted or a basic resource.</p></div>'; }
            this.overlay.querySelector('.rx-sheet').scrollTop = 0;
        }
    }

    window.RecipePlanner = RecipePlanner;
})();
