// deck-empire.js - Command Deck, Empire tab (2026-10-04).
// Every module in one plan: the production plan from the Recipe Explorer (the same localStorage plan - edit it
// here or there), any number of claim stakes (Stake Builder rules), mining fleets (Ship Explorer hulls), the hab
// build from the Hub Explorer, and the research all of it needs (Research tab).
//   - the BILL is the plan expanded to raws, stopping at any good a stake processor already makes
//   - SUPPLY is what the stakes net per tick and what the fleets mine per second, both turned into units per hour
//     with the tick length the player set (the tick is not in the data - see deck-store.js)
//   - the flow chart is the sheet: sources on the left, one row per bill line in the middle with the time it takes
//     to gather it, the plan's recipes on the right; link width = share of that line's supply / of its need
// A stake here is laid out automatically: the hubs its buildings need, the storage hub, crew quarters and power
// plants until crew and power balance; the player chooses the extractors and first-stage processors.
// What it does not do: second-stage processors (nothing on a planet satisfies their placement tag), hardness, and
// any price the player has not typed.
(function () {
    'use strict';

    const { esc, num, dur, usd, snd, settingsStrip, bindStrip, ZONE_TEXT } = window.DeckUI;
    const Store = window.DeckStore;
    const KEY = 'commandDeck.empire.v1', PLAN_KEY = 'recipeExplorer.plan.v1', HAB_KEY = 'hubExplorer.plan.v1';
    const CAT_COLOR = ['#3fae79', '#e2512b', '#b7a58a', '#9a9a9a', '#d99a4e', '#7fd0ff', '#6b70b8', '#2f8cff'];
    const FAC_LABEL = { oni: 'ONI', mud: 'MUD', ustur: 'USTUR' };
    const SRC_COLOR = { stake: '#2a9fcf', fleet: '#dd7429' };
    const ZONE_RANK = { own: 0, medium: 1, enemy: 2, high: 3 };
    const trunc = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
    let seq = 0; const uid = p => p + Date.now().toString(36) + (seq++).toString(36);

    class EmpireTab {
        constructor(root, ctx) {
            this.root = root; this.ctx = ctx; this.se = ctx.se; this.empire = ctx.empire; this.rc = ctx.rc; this.rm = ctx.rm;
            const saved = Store.read(KEY, {});
            this.stakes = (saved.stakes || []).filter(s => s && this.se.planetByKey.has(s.key) && s.tier >= 1 && s.tier <= 5).map(s => ({ id: s.id || uid('s'), key: s.key, tier: s.tier, alloc: s.alloc || {}, procs: s.procs || [] }));
            this.fleets = (saved.fleets || []).filter(f => f && this.empire.shipByName.has(f.ship)).map(f => ({ id: f.id || uid('f'), ship: f.ship, count: Math.max(1, +f.count || 1), raw: f.raw || '', richness: +f.richness || 1, body: f.body || '' }));
            this.add = { q: '', tier: 5, fac: 'all' };
            this.goalQ = '';
            bindStrip(root); this.bind();
            Store.on(() => { if (this.visible()) this.render(); else this.stale = true; });
            this.stale = true;
        }
        visible() { return this.root.closest('.tab-content').classList.contains('active'); }
        show() { this.render(); }                                   // the plan may have changed in another tab or module
        save() { Store.write(KEY, { stakes: this.stakes, fleets: this.fleets }); }
        items() { const v = Store.read(PLAN_KEY, []); return Array.isArray(v) ? v.filter(x => x && this.rc.byId.has(x.id)).map(x => ({ id: x.id, qty: Math.max(1, Math.min(100000, +x.qty || 1)) })) : []; }
        saveItems(items) { Store.write(PLAN_KEY, items); }

        // ------------------------------------------------------------------ actions
        bind() {
            const root = this.root;
            root.addEventListener('input', e => {
                if (e.target.id === 'cdePlanetFind') { this.add.q = e.target.value; this.renderPlanetResults(); }
                if (e.target.id === 'cdeGoalFind') { this.goalQ = e.target.value; this.renderGoalResults(); }
            });
            root.addEventListener('change', e => {
                const t = e.target;
                if (t.dataset.goalQty) { const items = this.items(); const it = items.find(i => i.id === t.dataset.goalQty); if (it) { it.qty = Math.max(1, Math.min(100000, parseInt(t.value, 10) || 1)); this.saveItems(items); this.render(); } return; }
                const f = t.dataset.fleet && this.fleets.find(x => x.id === t.dataset.fleet);
                if (f) {
                    if (t.dataset.field === 'ship') f.ship = t.value;
                    if (t.dataset.field === 'count') f.count = Math.max(1, Math.min(999, parseInt(t.value, 10) || 1));
                    if (t.dataset.field === 'raw') { f.raw = t.value; const b = this.bodies(f.raw)[0]; f.body = b ? b.key : ''; f.richness = b ? b.richness : 1; }
                    if (t.dataset.field === 'body') { const b = this.bodies(f.raw).find(x => x.key === t.value); if (b) { f.body = b.key; f.richness = b.richness; } }
                    this.save(); this.render();
                }
            });
            root.addEventListener('click', e => {
                const q = sel => e.target.closest(sel);
                let el;
                if ((el = q('[data-goal-add]'))) { const items = this.items(); if (!items.some(i => i.id === el.dataset.goalAdd)) items.push({ id: el.dataset.goalAdd, qty: 1 }); this.saveItems(items); this.goalQ = ''; snd('success'); this.render(); return; }
                if ((el = q('[data-goal-remove]'))) { this.saveItems(this.items().filter(i => i.id !== el.dataset.goalRemove)); snd('deselect'); this.render(); return; }
                if ((el = q('[data-add-tier]'))) { this.add.tier = +el.dataset.addTier; snd('select'); this.render(); return; }
                if ((el = q('[data-add-fac]'))) { this.add.fac = el.dataset.addFac; snd('select'); this.render(); return; }
                if ((el = q('[data-stake-add]'))) { this.addStake(el.dataset.stakeAdd); return; }
                if ((el = q('[data-stake-remove]'))) { this.stakes = this.stakes.filter(s => s.id !== el.dataset.stakeRemove); snd('deselect'); this.save(); this.render(); return; }
                if ((el = q('[data-stake-auto]'))) { const s = this.stakes.find(x => x.id === el.dataset.stakeAuto); if (s) { this.refill(s); snd('select'); this.save(); this.render(); } return; }
                if ((el = q('[data-alloc]'))) { const [id, raw, d] = el.dataset.alloc.split('|'); this.bump(id, raw, +d); return; }
                if ((el = q('[data-proc]'))) { const [id, pid] = el.dataset.proc.split('|'); this.toggleProc(id, pid); return; }
                if ((el = q('[data-fleet-add]'))) { this.addFleet(); return; }
                if ((el = q('[data-fleet-remove]'))) { this.fleets = this.fleets.filter(f => f.id !== el.dataset.fleetRemove); snd('deselect'); this.save(); this.render(); return; }
                if ((el = q('[data-show-research]'))) { if (this.ctx.app && this.lastResearch) { snd('click'); this.ctx.app.showResearchGoal('empire', this.lastResearch); } return; }
                if ((el = q('[data-clear-empire]'))) { this.stakes = []; this.fleets = []; snd('deselect'); this.save(); this.render(); return; }
            });
            // flow chart hover: light the links of the node under the pointer
            root.addEventListener('pointerover', e => {
                const n = e.target.closest('[data-flow]'); const svg = root.querySelector('.cd-flow'); if (!svg) return;
                svg.querySelectorAll('.hi').forEach(x => x.classList.remove('hi'));
                svg.classList.toggle('tracing', !!n);
                if (!n) return;
                const [kind, id] = n.dataset.flow.split('|');
                svg.querySelectorAll(`[data-${kind}="${CSS.escape(id)}"]`).forEach(x => x.classList.add('hi'));
                n.classList.add('hi');
            });
        }

        neededRaws() {                                              // bill lines, uncovered first
            const c = this.cov; if (!c) return [];
            return c.rows.map(r => r.name);
        }
        addStake(key) {
            const planet = this.se.planetByKey.get(key); if (!planet || !planet.stakeable) return;
            const s = { id: uid('s'), key, tier: this.add.tier, alloc: {}, procs: [] };
            this.refill(s);
            this.stakes.push(s); snd('success'); this.save(); this.render();
        }
        // spread every extractor that fits: over the raws the bill still lacks, else the raws it needs, else all
        refill(s) {
            const planet = this.se.planetByKey.get(s.key), ext = this.se.extractable(planet, s.tier);
            const rows = this.cov ? this.cov.rows : [];
            const order = name => { const i = rows.findIndex(r => r.name === name); return i < 0 ? 1e9 : i; };
            const lacking = ext.filter(x => rows.some(r => r.name === x.name && r.perHour <= 0));
            const needed = ext.filter(x => rows.some(r => r.name === x.name));
            const pick = (lacking.length ? lacking : needed.length ? needed : ext).sort((a, b) => order(a.name) - order(b.name) || b.richness - a.richness);
            s.alloc = this.se.autoAlloc(planet, s.tier, pick.map(x => x.raw), s.procs);
        }
        bump(id, raw, d) {
            const s = this.stakes.find(x => x.id === id); if (!s) return;
            const next = Object.assign({}, s.alloc); next[raw] = Math.max(0, (next[raw] || 0) + d); if (!next[raw]) delete next[raw];
            if (d > 0 && !this.se.layout(this.se.planetByKey.get(s.key), s.tier, next, s.procs).ok) { snd('error'); return; }
            s.alloc = next; snd('click'); this.save(); this.render();
        }
        toggleProc(id, pid) {
            const s = this.stakes.find(x => x.id === id); if (!s) return;
            const planet = this.se.planetByKey.get(s.key);
            if (s.procs.includes(pid)) s.procs = s.procs.filter(x => x !== pid);
            else {
                s.procs = s.procs.concat(pid);
                // make room: take extractors off the largest allocation until the stake fits again
                for (let guard = 0; guard < 200 && !this.se.layout(planet, s.tier, s.alloc, s.procs).ok; guard++) {
                    const top = Object.entries(s.alloc).sort((a, b) => b[1] - a[1])[0]; if (!top) break;
                    if (top[1] <= 1) delete s.alloc[top[0]]; else s.alloc[top[0]] = top[1] - 1;
                }
                if (!this.se.layout(planet, s.tier, s.alloc, s.procs).ok) { s.procs = s.procs.filter(x => x !== pid); snd('error'); this.render(); return; }
            }
            snd('select'); this.save(); this.render();
        }
        addFleet() {
            const rows = this.cov ? this.cov.rows.filter(r => r.res && r.res.category === 'raw') : [];
            const target = rows.find(r => r.perHour <= 0 && !r.res.stakeMinable) || rows.find(r => r.perHour <= 0) || rows[0];
            const raw = target ? target.name : (this.rm.list.find(r => r.category === 'raw') || { name: '' }).name;
            const body = this.bodies(raw)[0];
            const ship = this.empire.miners.find(m => !this.fleets.some(f => f.ship === m.name)) || this.empire.miners[0];
            this.fleets.push({ id: uid('f'), ship: ship.name, count: 1, raw, richness: body ? body.richness : 1, body: body ? body.key : '' });
            snd('success'); this.save(); this.render();
        }

        // ------------------------------------------------------------------ render
        render() {
            this.stale = false;
            const s = Store.s, items = this.items();
            const cov = this.cov = this.empire.coverage(items, this.stakes, this.fleets, { tick: s.tick, richness: s.richness });
            const plain = this.empire.expand(items, new Set());                       // every craft, for processor hints
            this.intermediates = new Set(plain.crafts.keys());
            const srcById = new Map(cov.sources.map(x => [x.id, x]));
            this.root.innerHTML = `
                ${settingsStrip({ faction: true })}
                ${this.goalHTML(items)}
                ${this.tilesHTML(items, cov)}
                <div class="cd-empire">
                    <div class="cd-col">
                        ${this.stakesHTML(srcById)}
                        ${this.fleetsHTML(cov)}
                    </div>
                    <div class="cd-col">
                        ${this.flowHTML(items, cov)}
                        ${this.researchHTML(items, cov)}
                    </div>
                </div>`;
            this.renderPlanetResults(); this.renderGoalResults();
        }

        goalHTML(items) {
            return `<section class="rx-panel cd-goalbar">
                <div class="rx-panel-head"><h3>Production plan</h3><span>${items.length ? `${items.length} recipe${items.length > 1 ? 's' : ''} - the same plan the Recipe Explorer holds` : 'empty - add a recipe, or build the plan in the Recipe Explorer'}</span><a class="sb-btn ghost" href="../RecipeExplorer/index.html" target="_blank" rel="noopener">Open the planner</a></div>
                <div class="rp-items">
                    ${items.map(it => { const r = this.rc.byId.get(it.id); return `<div class="rp-item"><span class="rp-item-name"><i class="t t${r.outputTier}">T${r.outputTier}</i>${esc(r.outputName)}<small>${esc(r.typeLabel)}</small></span><label>&times;<input type="number" min="1" max="100000" value="${it.qty}" data-goal-qty="${esc(it.id)}"></label><button type="button" class="rp-x" data-goal-remove="${esc(it.id)}" title="Remove from the plan">&times;</button></div>`; }).join('')}
                    <div class="cd-find cd-goalfind"><input type="search" class="sb-input" id="cdeGoalFind" placeholder="Add a recipe to the plan…" autocomplete="off" spellcheck="false" value="${esc(this.goalQ)}"><div class="cd-results" id="cdeGoalResults" hidden></div></div>
                </div>
            </section>`;
        }
        renderGoalResults() {
            const box = this.root.querySelector('#cdeGoalResults'); if (!box) return;
            const words = this.goalQ.toLowerCase().split(/\s+/).filter(Boolean);
            if (!words.length) { box.hidden = true; box.innerHTML = ''; return; }
            const have = new Set(this.items().map(i => i.id));
            const hits = this.rc.recipes.filter(r => !have.has(r.outputId) && words.every(w => r.outputName.toLowerCase().includes(w))).sort((a, b) => a.outputName.length - b.outputName.length || a.outputName.localeCompare(b.outputName) || a.outputTier - b.outputTier).slice(0, 12);
            box.hidden = !hits.length;
            box.innerHTML = hits.map(r => `<button type="button" data-goal-add="${esc(r.outputId)}"><em>${esc(r.typeLabel)}</em><b>${esc(r.outputName)} T${r.outputTier}</b></button>`).join('');
        }

        tilesHTML(items, cov) {
            const s = Store.s, x = cov.expansion;
            const ext = cov.sources.filter(q => q.kind === 'stake').reduce((a, q) => a + q.prod.layout.extractors, 0);
            const hulls = this.fleets.reduce((a, f) => a + f.count, 0);
            const crew = this.fleets.reduce((a, f) => a + f.count * this.empire.shipByName.get(f.ship).crew, 0);
            const food = this.fleets.reduce((a, f) => a + f.count * this.empire.shipByName.get(f.ship).food, 0);
            const binding = cov.rows.filter(r => r.perHour > 0)[0];
            // hab jobs from the Hub Explorer's saved build
            let jobs = 0;
            try { if (window.HubModel && window.craftingHabData) { const hm = this.hubModel || (this.hubModel = new window.HubModel(window.craftingHabData, window.rawRecipeData.recipes, window.resourcesData.resources)); const hp = Store.read(HAB_KEY, []); if (Array.isArray(hp) && hp.length) jobs = hm.plan(hp.filter(i => i && hm.byId.has(i.id))).jobs || 0; } } catch (e) { jobs = 0; }
            // cost at the asks typed on the Ships vs Stakes tab
            let cost = 0, unpriced = 0;
            this.stakes.forEach(k => { const p = Store.stakePrice(k.tier); if (p) cost += p; else unpriced++; });
            this.fleets.forEach(f => { const p = Store.shipPrice(f.ship); if (p) cost += p * f.count; else unpriced += f.count; });
            const tiles = [];
            if (!items.length) tiles.push(['–', 'no plan yet: add a recipe above']);
            else if (cov.uncovered.length) tiles.push([`${cov.uncovered.length} <small>of ${cov.rows.length}</small>`, 'bill lines with no source', 'warn']);
            else tiles.push([dur(cov.hours * 3600), `to gather the whole bill${binding ? ' - ' + esc(binding.name) + ' is last' : ''}`]);
            if (items.length && cov.uncovered.length && binding) tiles.push([dur(cov.hours * 3600), `to gather what has a source - ${esc(binding.name)} is last`]);
            tiles.push([`${this.stakes.length}`, `claim stakes · ${ext} extractors`]);
            tiles.push([`${hulls}`, `mining hulls · ${crew} crew · ${num(food)} food / s`]);
            if (items.length) tiles.push([num(x.craftCount), `crafts · ${dur(x.sequential)} one at a time${jobs > 1 ? ` · at best ${dur(x.sequential / jobs)} on your hab's ${jobs} jobs` : ''}`]);
            if (this.stakes.length || this.fleets.length) tiles.push([cost ? usd(cost) : '–', `at the asks you typed${unpriced ? ` · ${unpriced} without a price` : ''}`]);
            return `<div class="an-stats cd-stats">${tiles.map(([n, l, c]) => `<div class="an-stat${c ? ' ' + c : ''}"><b>${n}</b><span>${l}</span></div>`).join('')}</div>`;
        }

        zoneOf(p) { const R = this.ctx.research; return R ? R.zoneClass(p, Store.s.faction) : 'medium'; }
        // bodies for a fleet: the player's own zone and territory first, then the richest
        bodies(raw) { return this.empire.bodiesFor(raw, p => ZONE_RANK[this.zoneOf(p)] + (String(p.terr).toLowerCase().startsWith(Store.s.faction.slice(0, 3)) ? 0 : 0.5)); }
        zoneWord(p) { const z = this.zoneOf(p); return z === 'own' ? '' : z === 'enemy' ? ' · ' + FAC_LABEL[p.zone.faction] + ' zone' : ' · ' + z + ' risk'; }
        zoneBadge(p) { const z = this.zoneOf(p); return `<span class="cd-zone ${z}">${z === 'own' ? 'low risk' : z === 'enemy' ? 'low risk, ' + FAC_LABEL[p.zone.faction] + ' zone' : z + ' risk'}</span>`; }

        // ---- stakes
        planetRow(p, tier) {
            const rows = this.cov ? this.cov.rows : [];
            const ext = this.se.extractable(p, tier);
            const chips = ext.map(x => ({ x, row: rows.find(r => r.name === x.name) })).filter(o => o.row).sort((a, b) => (a.row.perHour > 0) - (b.row.perHour > 0) || b.x.richness - a.x.richness).slice(0, 6)
                .map(o => `<span class="cd-raw${o.row.perHour > 0 ? '' : ' need'}">${esc(o.x.name)} <b>×${num(o.x.richness)}</b></span>`).join('');
            return `<button type="button" class="cd-planet" data-stake-add="${esc(p.key)}"><i class="pdot" style="--c:${CAT_COLOR[p.cat]}"></i><b>${esc(p.name)}</b><small>${esc(p.system)} · ${esc(p.catName)} · <span class="f-${p.faction}">${FAC_LABEL[p.faction]}</span> · ${this.zoneBadge(p)}</small><span class="cd-raws">${chips || `<span class="sb-muted">${ext.length} extractable raws, none in the bill</span>`}</span></button>`;
        }
        suggestions() {
            const tier = this.add.tier, fac = this.add.fac, rows = this.cov ? this.cov.rows : [];
            const lacking = rows.filter(r => r.perHour <= 0 && r.res && r.res.stakeMinable);
            const want = lacking.length ? lacking : rows.filter(r => r.res && r.res.stakeMinable);
            if (!want.length) return { list: [], lacking: lacking.length, want: 0 };
            const ids = want.map(r => r.res.id);
            const taken = new Set(this.stakes.map(s => s.key));
            const scored = [];
            this.se.planets.forEach(p => {
                if (!p.stakeable || taken.has(p.key) || (fac !== 'all' && p.faction !== fac)) return;
                let n = 0, rich = 0;
                ids.forEach(id => { const d = p.deposits.get(id); if (d && this.se.extractorFor(p, id, tier)) { n++; rich += d.richness; } });
                if (n) scored.push({ p, n, rich, z: ZONE_RANK[this.zoneOf(p)] + (String(p.terr).toLowerCase().startsWith(Store.s.faction.slice(0, 3)) ? 0 : 0.5) });   // own territory first within a zone class
            });
            scored.sort((a, b) => b.n - a.n || a.z - b.z || b.rich - a.rich || a.p.name.localeCompare(b.p.name));
            return { list: scored.slice(0, 4), lacking: lacking.length, want: want.length };
        }
        renderPlanetResults() {
            const box = this.root.querySelector('#cdePlanetResults'); if (!box) return;
            const words = this.add.q.toLowerCase().split(/\s+/).filter(Boolean);
            if (!words.length) {
                const sg = this.suggestions();
                box.innerHTML = sg.list.length ? `<h4>${sg.lacking ? `Planets that carry the most of the ${sg.lacking} bill lines still without a source` : `Planets that carry the most of the bill's ${sg.want} stake-minable raws`} <small>(count, then your zone before riskier ones, then richness)</small></h4>${sg.list.map(o => this.planetRow(o.p, this.add.tier)).join('')}`
                    : `<p class="rx-note">${this.items().length ? 'No planet in this territory adds a stake-minable raw the bill lacks.' : 'Add a recipe to the plan and the planets that carry its raws are ranked here. Or search any planet by name.'}</p>`;
                return;
            }
            const fac = this.add.fac;
            const hits = this.se.planets.filter(p => p.stakeable && (fac === 'all' || p.faction === fac) && words.every(w => (p.name + ' ' + p.system + ' ' + p.sysKey).toLowerCase().includes(w))).slice(0, 8);
            box.innerHTML = hits.length ? hits.map(p => this.planetRow(p, this.add.tier)).join('') : '<p class="rx-note">No planet matches. Asteroid belts are not listed: a belt holds no stake (send a fleet instead).</p>';
        }
        stakesHTML(srcById) {
            const a = this.add;
            const cards = this.stakes.map(s => this.stakeCard(s, srcById.get(s.id))).join('');
            return `<section class="rx-panel cd-stakes">
                <div class="rx-panel-head"><h3>Claim stakes</h3><span>${this.stakes.length ? `${this.stakes.length} placed` : 'none yet'}</span>${this.stakes.length || this.fleets.length ? '<button type="button" class="sb-btn ghost" data-clear-empire>Clear all</button>' : ''}</div>
                <div class="cd-addstake">
                    <div class="chips">${[1, 2, 3, 4, 5].map(t => `<button type="button" class="chip${a.tier === t ? ' on' : ''}" data-add-tier="${t}"><i class="t t${t}">T${t}</i>${num(this.se.slots[t])} slots</button>`).join('')}</div>
                    <div class="chips">${[['all', 'All'], ['mud', 'MUD'], ['oni', 'ONI'], ['ustur', 'USTUR']].map(([k, l]) => `<button type="button" class="chip${a.fac === k ? ' on' : ''}" data-add-fac="${k}">${l}</button>`).join('')}</div>
                    <input type="search" class="sb-input" id="cdePlanetFind" placeholder="Search a planet or system to stake…" autocomplete="off" spellcheck="false" value="${esc(a.q)}">
                    <div class="cd-planets" id="cdePlanetResults"></div>
                </div>
                ${cards}
            </section>`;
        }
        stakeCard(s, src) {
            const planet = this.se.planetByKey.get(s.key), p = src ? src.prod : this.se.production(planet, s.tier, s.alloc, s.procs, { richness: Store.s.richness }), L = p.layout;
            const rows = this.cov ? this.cov.rows : [];
            const inBill = name => rows.some(r => r.name === name);
            const ext = this.se.extractable(planet, s.tier).sort((x, y) => (inBill(y.name) - inBill(x.name)) || ((s.alloc[y.raw] || 0) - (s.alloc[x.raw] || 0)) || x.name.localeCompare(y.name));
            const canAdd = raw => { const next = Object.assign({}, s.alloc); next[raw] = (next[raw] || 0) + 1; return this.se.layout(planet, s.tier, next, s.procs).ok; };
            const anyRoom = ext.length ? canAdd(ext[0].raw) : false;
            const procs = this.se.processable(planet, s.tier);
            const procOut = b => this.se.outputs(b).map(([k]) => this.se.resName(k));
            const shown = procs.filter(b => s.procs.includes(b.id) || procOut(b).some(n => this.intermediates.has(n) || inBill(n)));
            const pct = Math.min(100, 100 * L.used / L.S);
            return `<article class="cd-stake${L.ok ? '' : ' over'}">
                <div class="cd-stake-head"><i class="t t${s.tier}">T${s.tier}</i><b>${esc(planet.name)}</b><small>${esc(planet.system)} · ${esc(planet.catName)} · <span class="f-${planet.faction}">${FAC_LABEL[planet.faction]}</span> · ${this.zoneBadge(planet)}</small><button type="button" class="rp-x" data-stake-remove="${s.id}" title="Remove this stake">&times;</button></div>
                <div class="hb-gauge${L.ok ? '' : ' over'}"><div class="hb-gauge-head"><span>Slots</span><b>${num(L.used)} / ${num(L.S)}</b></div><div class="hb-gauge-bar"><b style="width:${pct.toFixed(1)}%;background:#4fd8ff"></b></div><small>${L.extractors} extractors${L.processors ? ` · ${L.processors} processor${L.processors > 1 ? 's' : ''}` : ''} · ${L.ncq} crew quarters · ${L.npp} power plant${L.npp === 1 ? '' : 's'} · ${L.hubs.map(h => esc(window.CommandDeck.StakeEngine.HUB_LABEL[h])).join(', ')} · crew ${num(L.crewNeed)} / ${num(L.crewCap)}</small></div>
                <div class="cd-alloc">
                    ${ext.map(x => { const n = s.alloc[x.raw] || 0, out = (p.extracted.get(x.raw) || 0); return `<div class="cd-alloc-row${n ? ' on' : ''}"><span class="nm${inBill(x.name) ? ' need' : ''}" title="${inBill(x.name) ? 'in the bill' : 'not in the bill'}">${esc(x.name)}</span><span class="rk">×${num(x.richness)}</span><span class="rt">${num(x.rate)} / tick</span><span class="st"><button type="button" data-alloc="${s.id}|${esc(x.raw)}|-1" ${n ? '' : 'disabled'} aria-label="One fewer ${esc(x.name)} extractor">−</button><b>${n}</b><button type="button" data-alloc="${s.id}|${esc(x.raw)}|1" ${anyRoom ? '' : 'disabled'} aria-label="One more ${esc(x.name)} extractor">+</button></span><span class="ot">${n ? num(out) + ' / tick' : ''}</span></div>`; }).join('') || '<p class="rx-note">No raw on this planet has an extractor a stake of this tier can run.</p>'}
                </div>
                ${shown.length ? `<div class="cd-procs"><span>Processors</span>${shown.map(b => { const on = s.procs.includes(b.id); const row = on && p.procs.find(r => r.b.id === b.id); return `<button type="button" class="chip${on ? ' on' : ''}" data-proc="${s.id}|${esc(b.id)}" title="${esc(this.se.inputs(b).map(([k, v]) => `${-v} ${this.se.resName(k)}`).join(' + '))} → ${esc(this.se.outputs(b).map(([k, v]) => `${v} ${this.se.resName(k)}`).join(' + '))} per tick">${esc(procOut(b).join(', '))}${row ? `<small>${num(row.makes[0].out)} of ${num(row.makes[0].rate)} / tick · ${(100 * row.fed).toFixed(0)} % fed</small>` : ''}</button>`; }).join('')}</div>` : ''}
                <div class="cd-stake-foot"><span>${Array.from(p.passive.keys()).length ? `Hub passive: ${Array.from(p.passive.entries()).map(([k, v]) => `${esc(this.se.resName(k))} ${num(v)}`).join(', ')} / tick. ` : ''}${p.fuel ? `Burns ${num(p.fuel)} fuel / tick.` : ''}${procs.length > shown.length ? ` ${procs.length - shown.length} other first-stage processors could run here; none makes anything in the plan.` : ''}</span><button type="button" class="sb-btn ghost" data-stake-auto="${s.id}">Re-fill</button></div>
            </article>`;
        }

        // ---- fleets
        fleetsHTML(cov) {
            const raws = cov.rows.filter(r => r.res && r.res.category === 'raw').map(r => r.name);
            const allRaws = this.rm.list.filter(r => r.category === 'raw').map(r => r.name).sort();
            const rows = this.fleets.map(f => {
                const ship = this.empire.shipByName.get(f.ship), bodies = this.bodies(f.raw).slice(0, 10);
                const opts = Array.from(new Set(raws.concat(f.raw ? [f.raw] : [])));
                return `<div class="cd-fleet">
                    <select class="sb-input" data-fleet="${f.id}" data-field="ship" aria-label="Hull">${this.empire.miners.map(m => `<option value="${esc(m.name)}"${m.name === f.ship ? ' selected' : ''}>${esc(m.name)} - ${num(m.rate)} /s</option>`).join('')}</select>
                    <label>&times;<input type="number" class="sb-input" min="1" max="999" value="${f.count}" data-fleet="${f.id}" data-field="count" aria-label="Hull count"></label>
                    <select class="sb-input" data-fleet="${f.id}" data-field="raw" aria-label="Raw mined"><optgroup label="In the bill">${opts.map(n => `<option${n === f.raw ? ' selected' : ''}>${esc(n)}</option>`).join('')}</optgroup><optgroup label="Every raw">${allRaws.filter(n => !opts.includes(n)).map(n => `<option>${esc(n)}</option>`).join('')}</optgroup></select>
                    <select class="sb-input" data-fleet="${f.id}" data-field="body" aria-label="Body mined">${bodies.map(b => `<option value="${esc(b.key)}"${b.key === f.body ? ' selected' : ''}>${esc(b.name)} ×${num(b.richness)} · ${esc(b.system)}${b.belt ? ' · belt' : ''}${this.zoneWord(b.planet)}</option>`).join('') || '<option>no body carries it</option>'}</select>
                    <span class="cd-fleet-out"><b>${num(ship.rate * f.count * f.richness)}</b> / s<small>${ship.crew * f.count} crew · hold full in ${dur(ship.cargo / (ship.rate * f.richness))}</small></span>
                    <button type="button" class="rp-x" data-fleet-remove="${f.id}" title="Remove this fleet">&times;</button>
                </div>`;
            }).join('');
            return `<section class="rx-panel cd-fleets">
                <div class="rx-panel-head"><h3>Mining fleets</h3><span>one raw at one body per fleet; a ship can mine belts and any raw, kit or no kit</span><button type="button" class="sb-btn" data-fleet-add>Add a fleet</button></div>
                ${rows || '<p class="rx-note">No fleet yet. Fleets are the only source for raws no stake can extract.</p>'}
                ${this.fleets.length ? '<p class="rx-note">Output = hull rate × count × the body\'s richness, per second. The game also divides by a hardness the export does not list.</p>' : ''}
            </section>`;
        }

        // ---- flow chart: sources -> bill lines -> recipes
        flowHTML(items, cov) {
            if (!items.length) return `<section class="rx-panel cd-flowpanel"><div class="rx-panel-head"><h3>Who supplies what</h3></div><p class="rx-note">The plan is empty. Add a recipe above: its bill appears here, one row per raw, and every stake and fleet you add links to the rows it supplies.</p></section>`;
            const rows = cov.rows, srcs = cov.sources, recs = cov.expansion.byItem;
            const RH = 27, TOP = 26, W = 1040, SX = 4, SW = 196, RX = 300, NAMEW = 170, BARW = 190, VALW = 96, QX = W - 200, QW = 196;
            const H = TOP + Math.max(rows.length, srcs.length, recs.length, 1) * RH + 10;
            const rowY = i => TOP + i * RH + RH / 2;
            const spread = (n, i) => { const total = Math.max(rows.length, n) * RH; const step = total / n; return TOP + step * i + step / 2; };
            const maxH = Math.max(1e-12, ...rows.filter(r => r.perHour > 0).map(r => r.hours));
            const rEnd = RX + NAMEW + BARW + VALW;
            let links = '';
            rows.forEach((r, i) => {
                r.from.forEach(f => { const si = srcs.findIndex(x => x.id === f.id), src = srcs[si]; const y1 = spread(srcs.length, si), y2 = rowY(i), share = f.perHour / r.perHour; links += `<path class="fl ${src.kind}" data-src="${esc(src.id)}" data-res="${i}" d="M${SX + SW},${y1.toFixed(1)} C${SX + SW + 50},${y1.toFixed(1)} ${RX - 50},${y2.toFixed(1)} ${RX - 4},${y2.toFixed(1)}" style="stroke-width:${(1 + 5 * share).toFixed(1)}"><title>${esc(src.label)} supplies ${num(f.perHour)} ${esc(r.name)} per hour, ${(100 * share).toFixed(0)} % of the supply</title></path>`; });
                r.users.forEach(u => { const qi = recs.findIndex(x => x.id === u.id); const y1 = rowY(i), y2 = spread(recs.length, qi), share = u.units / r.need; links += `<path class="fl use" data-res="${i}" data-rec="${esc(u.id)}" d="M${rEnd + 4},${y1.toFixed(1)} C${rEnd + 44},${y1.toFixed(1)} ${QX - 44},${y2.toFixed(1)} ${QX},${y2.toFixed(1)}" style="stroke-width:${(0.8 + 3.2 * share).toFixed(1)}"><title>${esc(u.name)} needs ${num(u.units)} ${esc(r.name)}, ${(100 * share).toFixed(0)} % of the bill line</title></path>`; });
            });
            const srcNodes = srcs.map((x, i) => { const y = spread(srcs.length, i); return `<g class="fn src ${x.kind}" data-flow="src|${esc(x.id)}" data-src="${esc(x.id)}" transform="translate(${SX},${(y - 11).toFixed(1)})"><rect width="${SW}" height="22" rx="5"></rect><text x="8" y="15">${esc(trunc(x.label, 30))}</text></g>`; }).join('');
            const recNodes = recs.map((x, i) => { const y = spread(recs.length, i); return `<g class="fn rec" data-flow="rec|${esc(x.id)}" data-rec="${esc(x.id)}" transform="translate(${QX},${(y - 11).toFixed(1)})"><rect width="${QW}" height="22" rx="5"></rect><text x="8" y="15">${esc(trunc(x.name, 24))} ×${num(x.qty)}</text></g>`; }).join('');
            const resNodes = rows.map((r, i) => {
                const y = rowY(i), ok = r.perHour > 0, w = ok ? Math.max(2, BARW * r.hours / maxH) : 0;
                const kind = !r.res ? 'unknown' : r.res.category !== 'raw' ? 'made' : r.res.stakeMinable ? 'stake' : 'fleetonly';
                const hint = kind === 'made' ? 'made by a stake processor' : kind === 'fleetonly' ? 'fleet only: no stake can extract it' : kind === 'unknown' ? 'not a resource in the export' : 'stake or fleet';
                return `<g class="fr${ok ? '' : ' none'}${ok && i === rows.findIndex(q => q.perHour > 0) ? ' last' : ''}" data-flow="res|${i}" data-res="${i}" transform="translate(${RX},${(y - RH / 2).toFixed(1)})"><title>${esc(r.name)}: need ${num(r.need)}${ok ? `, supply ${num(r.perHour)} per hour, gathered in ${dur(r.hours * 3600)}` : ', no source'} (${hint})</title>
                    <rect class="bg" width="${NAMEW + BARW + VALW}" height="${RH - 3}" y="1.5" rx="4"></rect>
                    <text class="nm" x="8" y="${RH / 2 + 4}">${r.res ? '' : '? '}${esc(trunc(r.name, 23))}</text>
                    <rect class="trk" x="${NAMEW}" y="${RH / 2 - 4}" width="${BARW}" height="8" rx="2"></rect>
                    ${ok ? `<rect class="bar" x="${NAMEW}" y="${RH / 2 - 4}" width="${w.toFixed(1)}" height="8" rx="2"></rect>` : ''}
                    <text class="vl" x="${NAMEW + BARW + VALW - 8}" y="${RH / 2 + 4}" text-anchor="end">${ok ? dur(r.hours * 3600) : (kind === 'fleetonly' ? 'needs a fleet' : 'no source')}</text></g>`;
            }).join('');
            // what the sources make that the plan does not use
            const used = new Set(rows.map(r => r.name)), extra = new Map();
            srcs.forEach(x => x.supply.forEach((v, name) => { if (!used.has(name)) extra.set(name, (extra.get(name) || 0) + v); }));
            const extraList = Array.from(extra.entries()).sort((a, b) => b[1] - a[1]);
            return `<section class="rx-panel cd-flowpanel">
                <div class="rx-panel-head"><h3>Who supplies what</h3><span>${rows.length} bill lines · the bar is the time to gather that line at a ${dur(cov.tick)} tick, longest first · hover anything to trace it</span></div>
                <div class="cd-flow-head"><span style="width:${(100 * (RX - 4) / W).toFixed(1)}%">Stakes and fleets</span><span style="width:${(100 * (QX - RX) / W).toFixed(1)}%">The bill: resource · time to gather</span><span>The plan</span></div>
                <div class="cd-flow-wrap"><svg class="cd-flow" viewBox="0 0 ${W} ${H}" role="img" aria-label="Sources, bill lines and the recipes that need them">${links}${srcNodes}${resNodes}${recNodes}</svg></div>
                <div class="ch-key"><span><i style="background:${SRC_COLOR.stake}"></i>claim stake</span><span><i style="background:${SRC_COLOR.fleet}"></i>mining fleet</span><span><i style="background:#ffb86b"></i>the line gathered last</span><span><i style="background:#ff7a6b"></i>no source</span></div>
                ${cov.stop.size ? `<p class="rx-note">The bill stops at ${Array.from(cov.stop).map(esc).join(', ')}: a stake processor already makes ${cov.stop.size > 1 ? 'them' : 'it'}, so the ore behind ${cov.stop.size > 1 ? 'them' : 'it'} is not billed again.</p>` : ''}
                ${extraList.length ? `<p class="rx-note">Made but not in the bill, per hour: ${extraList.slice(0, 14).map(([n, v]) => `${esc(n)} ${num(v)}`).join(', ')}${extraList.length > 14 ? ` and ${extraList.length - 14} more` : ''}.</p>` : ''}
            </section>`;
        }

        // ---- research the whole thing needs
        researchHTML(items, cov) {
            const R = this.ctx.research; if (!R) return '';
            const run = new Set(), craft = new Set(), zones = new Map();
            const zone = (body, prefer) => { if (!body) return; const cls = R.zoneClass(body, Store.s.faction), n = R.zoneGrant(cls, prefer); if (n) { n.tags.forEach(t => run.add(t)); zones.set(cls + '|' + n.name, { cls, n }); } };
            cov.sources.forEach(x => {
                if (x.kind === 'stake') { R.stakeGate(x.tier).forEach(t => run.add(t)); x.prod.layout.items.forEach(it => R.buildingGate(it.b.id).forEach(t => run.add(t))); zone(x.planet, 'Building'); }
                else { R.shipGate({ sizeTier: x.ship.size }).forEach(t => run.add(t)); const f = this.fleets.find(q => q.id === x.id); zone(f && this.se.planetByKey.get(f.body), 'Mining'); }
            });
            items.forEach(it => { const r = this.rc.byId.get(it.id); if (r) R.chainGate(r).forEach(t => craft.add(t)); });
            const all = new Set([...run, ...craft]);
            this.lastResearch = { tags: Array.from(all), sub: `${this.stakes.length} stake${this.stakes.length === 1 ? '' : 's'}, ${this.fleets.length} fleet${this.fleets.length === 1 ? '' : 's'} and the plan's recipes` };
            if (!all.size) return '';
            const owned = this.ctx.app && this.ctx.app.researchTab ? this.ctx.app.researchTab.owned : new Set(R.start ? [R.start.id] : []);
            const T = window.CommandDeck.ResearchModel.TRACK_BY_KEY;
            const line = (label, tags) => { if (!tags.size) return ''; const b = R.bill(R.closure(tags), owned); const lv = Object.entries(b.levels).filter(([, v]) => v > 0).sort((a, c) => (b.xp[c[0]] || 0) - (b.xp[a[0]] || 0)); return `<div class="cd-res-line"><h4>${label}</h4><div class="rx-facts"><div><b>${b.todo}</b><span>nodes to research</span></div><div><b>${num(b.atlas)}</b><span>ATLAS</span></div><div><b>${b.rows.length - b.todo}</b><span>already researched</span></div></div>${lv.length ? `<p class="rx-note">Levels: ${lv.map(([k, v]) => `${esc((T.get(k) || { label: k }).label)} L${v}${b.xp[k] != null ? ' (' + num(b.xp[k]) + ' XP)' : ''}`).join(', ')}.</p>` : ''}</div>`; };
            return `<section class="rx-panel cd-res">
                <div class="rx-panel-head"><h3>Research this needs</h3><span>from the gate map: stake tiers, every building placed, hull sizes, zone access, and the plan's recipes</span><button type="button" class="sb-btn" data-show-research>Show on the tree</button></div>
                <div class="cd-res-two">${line('To run the stakes and fleets', run)}${line('To craft the plan yourself', craft)}</div>
                ${zones.size ? `<p class="rx-note">Zone access counted for a ${Store.s.faction.toUpperCase()} player: ${Array.from(zones.values()).map(z => `${ZONE_TEXT[z.cls]} → ${esc(z.n.name)}`).join('; ')}. Several nodes grant the same access; the one on the activity's own track, or else the cheapest, is used.</p>` : ''}
            </section>`;
        }
    }

    window.DeckEmpireTab = EmpireTab;
})();
