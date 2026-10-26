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
// The top of the tab (2026-10-26) is the Empire map (deck-map.js): stakes are placed and fleets formed there, each
// fleet with a job (mine / haul / supply), and the ledger under it gives made, burned and moved per hour.
// What it does not do: second-stage processors (nothing on a planet satisfies their placement tag), hardness, and
// any price the player has not typed.
(function () {
    'use strict';

    const { esc, num, dur, usd, snd, recipeName, recipeLabel, settingsStrip, bindStrip, ZONE_TEXT } = window.DeckUI;
    const plural = (n, one, many) => `${num(n)} ${n === 1 ? one : (many || one + 's')}`;
    const Store = window.DeckStore;
    const OPEN_KEY = 'commandDeck.empire.open.v1';
    const KEY = 'commandDeck.empire.v1', PLAN_KEY = 'recipeExplorer.plan.v1', HAB_KEY = 'hubExplorer.plan.v1';
    const CAT_COLOR = ['#3fae79', '#e2512b', '#b7a58a', '#9a9a9a', '#d99a4e', '#7fd0ff', '#6b70b8', '#2f8cff'];
    const FAC_LABEL = { oni: 'ONI', mud: 'MUD', ustur: 'USTUR' };
    const ZONE_RANK = { own: 0, medium: 1, enemy: 2, high: 3 };
    const trunc = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
    let seq = 0; const uid = p => p + Date.now().toString(36) + (seq++).toString(36);
    // schedule axis steps in seconds: clock-friendly up to half a year, then 1-2-5 x 10^k years with no upper bound
    const YEAR = 365 * 86400;
    const NICE = [0.1, 0.2, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600, 7200, 10800, 21600, 43200, 86400, 172800, 432000, 604800, 1209600, 2592000, 5184000, 7776000, 15552000];
    const axisStep = span => {
        if (!(span > 0) || !isFinite(span)) return span > 0 ? span : 1;
        const s = NICE.find(v => span / v <= 10); if (s) return s;
        for (let k = YEAR; ; k *= 10) for (const m of [1, 2, 5]) if (span / (m * k) <= 10) return m * k;
    };

    class EmpireTab {
        constructor(root, ctx) {
            this.root = root; this.ctx = ctx; this.se = ctx.se; this.empire = ctx.empire; this.rc = ctx.rc; this.rm = ctx.rm;
            // saved bytes are untrusted (2026-10-25): every shape checked, ids re-made unless plain word characters (they
            // land unescaped in data- attributes), stakes kept only on a planet that exists and can hold one
            const saved = Store.read(KEY, {}) || {};
            const arr = v => (Array.isArray(v) ? v : []), obj = v => v && typeof v === 'object' && !Array.isArray(v), str = v => (typeof v === 'string' ? v : '');
            const idOr = (v, p) => (typeof v === 'string' && /^[\w-]{1,40}$/.test(v) ? v : uid(p));
            this.stakes = arr(saved.stakes).filter(s => obj(s) && [1, 2, 3, 4, 5].includes(+s.tier) && this.se.planetByKey.has(s.key) && this.se.planetByKey.get(s.key).stakeable)
                .map(s => ({ id: idOr(s.id, 's'), key: s.key, tier: +s.tier, alloc: obj(s.alloc) ? Object.fromEntries(Object.entries(s.alloc).filter(([, n]) => +n > 0).map(([k, n]) => [k, Math.floor(+n)])) : {}, procs: arr(s.procs).filter(x => typeof x === 'string') }));
            // a fleet's job (2026-10-26): mine (raw at body, dest = drop-off system or ''), haul / supply (stake `from` <-> dest)
            const G = ctx.galaxy, sysOr = v => (typeof v === 'string' && G && G.byKey.has(v) ? v : '');
            this.fleets = arr(saved.fleets).filter(f => obj(f) && this.empire.shipByName.has(f.ship)).map(f => ({ id: idOr(f.id, 'f'), task: ['haul', 'supply'].includes(f.task) ? f.task : 'mine', ship: f.ship, count: Math.max(1, Math.min(999, Math.floor(+f.count) || 1)), raw: str(f.raw), richness: +f.richness > 0 ? +f.richness : 1, body: str(f.body), dest: sysOr(f.dest), from: str(f.from) }))
                .filter(f => f.task === 'mine' || this.stakes.some(s => s.id === f.from));
            this.add = { q: '' };
            // which input steps are open: a per-viewer convenience, all open the first time
            const op = Store.read(OPEN_KEY, {}) || {};
            this.open = { plan: op.plan !== false, stakes: op.stakes !== false, fleets: op.fleets !== false };
            this.goalQ = '';
            bindStrip(root); this.bind();
            this.map = G && window.DeckEmpireMap ? new window.DeckEmpireMap(this) : null;
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
                if (e.target.id === 'cdeGoalFind') { this.goalQ = e.target.value; this.renderGoalResults(); }
                if (e.target.id === 'cdePlanetFind') { this.add.q = e.target.value; this.renderPlanetResults(); if (this.map) { this.map.q = this.add.q; this.map.redraw(); } }
            });
            // 'toggle' does not bubble: listen in the capture phase
            root.addEventListener('toggle', e => { const d = e.target; if (d.dataset && d.dataset.step) { this.open[d.dataset.step] = d.open; Store.write(OPEN_KEY, this.open); } }, true);
            root.addEventListener('change', e => {
                const t = e.target;
                if (t.dataset.goalQty) { const items = this.items(); const it = items.find(i => i.id === t.dataset.goalQty); if (it) { it.qty = Math.max(1, Math.min(100000, parseInt(t.value, 10) || 1)); this.saveItems(items); this.render(); } return; }
                const f = t.dataset.fleet && this.fleets.find(x => x.id === t.dataset.fleet);
                if (f) {
                    const G = this.ctx.galaxy, field = t.dataset.field;
                    if (field === 'ship') f.ship = t.value;
                    if (field === 'count') f.count = Math.max(1, Math.min(999, parseInt(t.value, 10) || 1));
                    // a new body keeps a drop-off, moved to the new body's nearest starbase
                    const redrop = () => { if (f.dest && G) { const p = this.se.planetByKey.get(f.body), n = p && G.nearestStarbase(p.sysKey); f.dest = n ? n.sys.key : ''; } };
                    if (field === 'raw') { f.raw = t.value; const b = this.bodies(f.raw)[0]; f.body = b ? b.key : ''; f.richness = b ? b.richness : 1; redrop(); }
                    if (field === 'body') { const b = this.bodies(f.raw).find(x => x.key === t.value); if (b) { f.body = b.key; f.richness = b.richness; redrop(); } }
                    if (field === 'dest') f.dest = G && G.byKey.has(t.value) ? t.value : '';
                    if (field === 'from' && this.stakes.some(s => s.id === t.value)) f.from = t.value;
                    if (field === 'task') {
                        const task = ['haul', 'supply'].includes(t.value) ? t.value : 'mine';
                        if (task !== 'mine' && !this.stakes.length) { snd('error'); t.value = f.task; return; }
                        f.task = task;
                        if (task === 'mine') { const raw = f.raw || this.defaultRaw(), b = this.bodies(raw)[0]; Object.assign(f, this.miningDefaults(raw, f.body || (b ? b.key : ''))); }
                        else { if (!this.stakes.some(s => s.id === f.from)) f.from = this.stakes[0].id; f.dest = this.haulDest(task, f.from); }
                    }
                    this.save(); this.render();
                }
            });
            root.addEventListener('click', e => {
                const q = sel => e.target.closest(sel);
                let el;
                if ((el = q('[data-goal-add]'))) { const items = this.items(); if (!items.some(i => i.id === el.dataset.goalAdd)) items.push({ id: el.dataset.goalAdd, qty: 1 }); this.saveItems(items); this.goalQ = ''; snd('success'); this.render(); return; }
                if ((el = q('[data-goal-remove]'))) { this.saveItems(this.items().filter(i => i.id !== el.dataset.goalRemove)); snd('deselect'); this.render(); return; }
                if ((el = q('[data-stake-remove]'))) { const id = el.dataset.stakeRemove; this.stakes = this.stakes.filter(s => s.id !== id); this.fleets = this.fleets.filter(f => f.task === 'mine' || f.from !== id); snd('deselect'); this.save(); this.render(); return; }
                if ((el = q('[data-stake-auto]'))) { const s = this.stakes.find(x => x.id === el.dataset.stakeAuto); if (s) { this.refill(s); snd('select'); this.save(); this.render(); } return; }
                if ((el = q('[data-alloc]'))) { const [id, raw, d] = el.dataset.alloc.split('|'); this.bump(id, raw, +d); return; }
                if ((el = q('[data-proc]'))) { const [id, pid] = el.dataset.proc.split('|'); this.toggleProc(id, pid); return; }
                if ((el = q('[data-fleet-add]'))) { this.addFleet(); return; }
                if ((el = q('[data-run-add]'))) { const task = el.dataset.runAdd, s = this.stakes.find(k => !this.fleets.some(f => f.task === task && f.from === k.id)) || this.stakes[0]; if (s) this.addHaulFleet(task, s.id); return; }
                if ((el = q('[data-stake-add]'))) { const [key, t] = el.dataset.stakeAdd.split('|'); this.addStake(key, +t); return; }
                if ((el = q('[data-fleet-remove]'))) { this.fleets = this.fleets.filter(f => f.id !== el.dataset.fleetRemove); snd('deselect'); this.save(); this.render(); return; }
                if ((el = q('[data-show-research]'))) { if (this.ctx.app && this.lastResearch) { snd('click'); this.ctx.app.showResearchGoal('empire', this.lastResearch); } return; }
                if ((el = q('[data-clear-empire]'))) { this.stakes = []; this.fleets = []; snd('deselect'); this.save(); this.render(); return; }
            });
        }

        addStake(key, tier) {
            const planet = this.se.planetByKey.get(key); if (!planet || !planet.stakeable) return;
            if (![1, 2, 3, 4, 5].includes(tier)) return;
            const s = { id: uid('s'), key, tier, alloc: {}, procs: [] };
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
        // the raw a new mining fleet takes: a bill line no stake can extract and nothing supplies, else any unsupplied one
        defaultRaw() {
            const rows = this.cov ? this.cov.rows.filter(r => r.res && r.res.category === 'raw') : [];
            const target = rows.find(r => r.perHour <= 0 && !r.res.stakeMinable) || rows.find(r => r.perHour <= 0) || rows[0];
            return target ? target.name : (this.rm.list.find(r => r.category === 'raw') || { name: '' }).name;
        }
        addFleet() {
            const raw = this.defaultRaw(), body = this.bodies(raw)[0];
            this.fleets.push(Object.assign({ id: uid('f'), task: 'mine', count: 1, from: '' }, this.miningDefaults(raw, body ? body.key : '')));
            snd('success'); this.save(); this.render();
        }
        // a mining fleet: the strongest miner not yet in a fleet, the body's richness, a drop-off at its nearest starbase
        miningDefaults(raw, bodyKey) {
            const p = this.se.planetByKey.get(bodyKey), d = p && this.empire.rm && p.deposits.get(window.CommandDeck.slug(raw));
            const ship = this.empire.miners.find(m => !this.fleets.some(f => f.task === 'mine' && f.ship === m.name)) || this.empire.miners[0];
            const near = p && this.ctx.galaxy ? this.ctx.galaxy.nearestStarbase(p.sysKey) : null;
            return { ship: ship.name, raw: raw || '', body: p ? p.key : '', richness: d ? d.richness : 1, dest: near ? near.sys.key : '' };
        }
        addMiningFleet(raw, bodyKey) {
            if (!this.se.planetByKey.has(bodyKey)) return;
            this.fleets.push(Object.assign({ id: uid('f'), task: 'mine', count: 1, from: '' }, this.miningDefaults(raw, bodyKey)));
            snd('success'); this.save(); this.render();
        }
        // haul: to the faction's CSS (the market); supply: from the stake's nearest starbase
        haulDest(task, stakeId) {
            const G = this.ctx.galaxy, s = this.stakes.find(x => x.id === stakeId), p = s && this.se.planetByKey.get(s.key); if (!G || !p) return '';
            const css = task === 'haul' ? G.css(Store.s.faction) : null, near = G.nearestStarbase(p.sysKey);
            return css ? css.key : near ? near.sys.key : '';
        }
        statsOf(name) { const x = this.ctx.loadout && this.ctx.loadout.stats(name, null); return x ? x.mod : null; }
        // the default hauler for a run of d AU that must move `need` units an hour: the smallest hull class (fleet-capacity
        // points) that keeps up alone with a tank that lasts the round trip, then the least fuel per unit; if no hull
        // keeps up alone, the one that moves the most
        bestHauler(d, need) {
            const LO = window.CommandDeck.Loadout; if (!this.ctx.loadout || !LO) return this.empire.ships[0].name;
            const c = this.ctx.loadout.ships.filter(s => this.empire.shipByName.has(s.name)).map(s => { const st = this.statsOf(s.name), t = st && LO.trip(st, d, 'warp'); return t && t.tankOk ? { name: s.name, t, pts: this.empire.capacityPoints(s.name) == null ? 1e9 : this.empire.capacityPoints(s.name) } : null; }).filter(Boolean);
            const ok = c.filter(x => x.t.perHour >= need);
            if (ok.length) return ok.sort((a, b) => a.pts - b.pts || a.t.fuelPerUnit - b.t.fuelPerUnit || a.name.localeCompare(b.name))[0].name;
            return c.length ? c.sort((a, b) => b.t.perHour - a.t.perHour || a.name.localeCompare(b.name))[0].name : this.empire.ships[0].name;
        }
        addHaulFleet(task, stakeId) {
            const s = this.stakes.find(x => x.id === stakeId), G = this.ctx.galaxy; if (!s || !G) return;
            const dest = this.haulDest(task, stakeId), d = G.dist(this.se.planetByKey.get(s.key).sysKey, dest);
            const r = this.ops && this.ops.stakes.find(x => x.id === stakeId), need = r ? (task === 'haul' ? r.out : r.fuel) : 0;
            this.fleets.push({ id: uid('f'), task, ship: this.bestHauler(d || 0, need), count: 1, raw: '', richness: 1, body: '', from: stakeId, dest });
            snd('success'); this.save(); this.render();
        }

        // ------------------------------------------------------------------ render
        render() {
            this.stale = false;
            const s = Store.s, items = this.items();
            // operations first: a mining fleet with a drop-off supplies what its whole cycle delivers, not its rate at the body
            const ops = this.ops = this.empire.ops(this.stakes, this.fleets, { tick: s.tick, richness: s.richness, galaxy: this.ctx.galaxy, stats: n => this.statsOf(n) });
            const opsById = new Map(ops.fleets.map(r => [r.id, r]));
            if (this.map) this.map.ops = ops;                                         // step 2's system card reads it before the map draws
            const cov = this.cov = this.empire.coverage(items, this.stakes, this.fleets, { tick: s.tick, richness: s.richness, fleetPerSec: f => { const r = opsById.get(f.id); return r && r.dest ? r.perHour / 3600 : null; } });
            const plain = this.empire.expand(items, new Set());                       // every craft, for processor hints
            this.intermediates = new Set(plain.crafts.keys());
            const srcById = new Map(cov.sources.map(x => [x.id, x]));
            // the hab schedule: the plan's crafts (what a stake processor makes is not crafted) on the hab's job lanes
            const hab = this.habLanes();
            const sched = this.sched = this.empire.schedule(cov.expansion, hab.lanes.length ? { lanes: hab.lanes } : { jobs: 1 });
            // inputs first (three steps that fold away), then what they add up to: the map, the ledger, the sheets
            const names = items.slice(0, 3).map(it => { const r = this.rc.byId.get(it.id); return `${esc(recipeName(r))} ×${num(it.qty)}`; }).join(', ') + (items.length > 3 ? ` and ${items.length - 3} more` : '');
            const ext = cov.sources.filter(q => q.kind === 'stake').reduce((a, q) => a + q.prod.layout.extractors, 0), made = ops.stakes.reduce((a, r) => a + r.out, 0);
            const byTask = t => this.fleets.filter(f => f.task === t).length, fuel = ops.ledger.get('Fuel');
            this.root.innerHTML = `
                ${settingsStrip({ faction: true })}
                <div class="cd-build">
                    ${this.stepHTML('plan', 1, 'What to make', items.length ? `${names} · ${cov.covered} of ${cov.rows.length} bill lines have a source` : 'pick the recipes you want to craft', this.goalHTML(items), items.length > 0)}
                    ${this.stepHTML('stakes', 2, 'Claim stakes', this.stakes.length ? `${plural(this.stakes.length, 'stake')} · ${plural(ext, 'extractor')} · ${num(made)} units / h` : 'search a planet and place a stake', this.stakesHTML(srcById), this.stakes.length > 0)}
                    ${this.stepHTML('fleets', 3, 'Fleets', this.fleets.length ? `${[[byTask('mine'), 'mining'], [byTask('haul'), 'haul'], [byTask('supply'), 'supply']].filter(([n]) => n).map(([n, l]) => `${n} ${l}`).join(' · ')}${fuel && fuel.burned ? ` · ${num(fuel.burned)} fuel / h burned in all` : ''}` : 'form fleets and give each a job', this.fleetsHTML(cov), this.fleets.length > 0)}
                </div>
                ${this.map ? this.map.html(ops) + this.map.ledgerHTML(ops, cov) : ''}
                ${this.tilesHTML(items, cov, sched, hab)}
                <div class="cd-sheets">
                    ${this.scheduleHTML(items, cov, sched, hab)}
                    ${this.researchHTML(items, cov)}
                </div>`;
            this.renderGoalResults(); this.renderPlanetResults();
        }
        // one input step: a fold-away section whose closed line says what is in it
        stepHTML(key, n, title, summary, body, done) {
            return `<details class="cd-stage${done ? ' done' : ''}" data-step="${key}"${this.open[key] !== false ? ' open' : ''}>
                <summary><i class="cd-stage-n">${done ? '✓' : n}</i><b>${title}</b><span>${summary}</span><em class="cd-stage-chev" aria-hidden="true"></em></summary>
                <div class="cd-stage-body">${body}</div>
            </details>`;
        }

        // the Hub Explorer's saved build as job lanes (hubExplorer.plan.v1: [{id, qty}] of hab items)
        habLanes() {
            const out = { lanes: [], rows: [], jobs: 0, label: '' };
            try {
                if (!window.HubModel || !window.craftingHabData) return out;
                const hm = this.hubModel || (this.hubModel = new window.HubModel(window.craftingHabData, window.rawRecipeData.recipes, window.resourcesData.resources));
                const hp = Store.read(HAB_KEY, []);
                if (!Array.isArray(hp) || !hp.length) return out;
                const p = hm.plan(hp.filter(i => i && hm.byId.has(i.id)));
                out.rows = p.rows; out.jobs = p.jobs || 0; out.lanes = window.CommandDeck.Empire.lanesFromHab(p.rows);
                // every part names its own jobs, and the parts add up to the lane count shown with them
                const parts = [], jobs = n => plural(n, 'job');
                p.rows.forEach(({ it, item }) => { if (item.kind === 'hab') parts.push(`T${item.tier} hab (${jobs(item.jobs || 0)} at 1×)`); else if (item.kind === 'station') parts.push(`${it.qty > 1 ? it.qty + ' × ' : ''}${item.size} station${it.qty > 1 ? 's' : ''} (${jobs(item.jobs * it.qty)} at ${num(item.speed || 1)}×)`); else if (item.kind === 'storage' && item.jobs) parts.push(`${it.qty > 1 ? it.qty + ' × ' : ''}T${item.tier} storage (${jobs(item.jobs * it.qty)} at 1×)`); });
                out.label = parts.join(' + ') + ` = ${jobs(out.lanes.length)}`;
            } catch (e) { out.lanes = []; }
            return out;
        }

        goalHTML(items) {
            return `<div class="cd-goalbar">
                <p class="rx-note">The recipes you want to craft, and how many. This is the same plan the Recipe Explorer holds: edit it here or there. <a href="../RecipeExplorer/index.html" target="_blank" rel="noopener">Open the planner</a></p>
                <div class="rp-items">
                    ${items.map(it => { const r = this.rc.byId.get(it.id); return `<div class="rp-item"><span class="rp-item-name"><i class="t t${r.outputTier}">T${r.outputTier}</i>${esc(recipeName(r))}<small>${esc(r.typeLabel)}</small></span><label>&times;<input type="number" min="1" max="100000" value="${it.qty}" data-goal-qty="${esc(it.id)}"></label><button type="button" class="rp-x" data-goal-remove="${esc(it.id)}" title="Remove from the plan">&times;</button></div>`; }).join('')}
                    <div class="cd-find cd-goalfind"><input type="search" class="sb-input" id="cdeGoalFind" placeholder="Add a recipe to the plan…" autocomplete="off" spellcheck="false" value="${esc(this.goalQ)}"><div class="cd-results" id="cdeGoalResults" hidden></div></div>
                </div>
            </div>`;
        }
        renderGoalResults() {
            const box = this.root.querySelector('#cdeGoalResults'); if (!box) return;
            const words = this.goalQ.toLowerCase().split(/\s+/).filter(Boolean);
            if (!words.length) { box.hidden = true; box.innerHTML = ''; return; }
            const have = new Set(this.items().map(i => i.id));
            const hits = this.rc.recipes.filter(r => !have.has(r.outputId) && words.every(w => r.outputName.toLowerCase().includes(w))).sort((a, b) => a.outputName.length - b.outputName.length || a.outputName.localeCompare(b.outputName) || a.outputTier - b.outputTier).slice(0, 12);
            box.hidden = !hits.length;
            box.innerHTML = hits.map(r => `<button type="button" data-goal-add="${esc(r.outputId)}"><em>${esc(r.typeLabel)}</em><b>${esc(recipeLabel(r))}</b></button>`).join('');
        }

        tilesHTML(items, cov, sched, hab) {
            const s = Store.s, x = cov.expansion;
            const ext = cov.sources.filter(q => q.kind === 'stake').reduce((a, q) => a + q.prod.layout.extractors, 0);
            const hulls = this.fleets.reduce((a, f) => a + f.count, 0);
            const crew = this.fleets.reduce((a, f) => a + f.count * this.empire.shipByName.get(f.ship).crew, 0);
            const food = this.fleets.reduce((a, f) => a + f.count * this.empire.shipByName.get(f.ship).food, 0);
            const binding = cov.rows.filter(r => r.perHour > 0)[0];
            const jobs = sched.lanes.length;
            // cost at the asks typed on the Ships vs Stakes tab
            let cost = 0, unpriced = 0;
            this.stakes.forEach(k => { const p = Store.stakePrice(k.tier); if (p) cost += p; else unpriced++; });
            this.fleets.forEach(f => { const p = Store.shipPrice(f.ship); if (p) cost += p * f.count; else unpriced += f.count; });
            const tiles = [];
            if (!items.length) tiles.push(['–', 'no plan yet: add a recipe above']);
            else if (cov.uncovered.length) tiles.push([`${cov.uncovered.length} <small>of ${cov.rows.length}</small>`, 'bill lines with no source', 'warn']);
            else tiles.push([dur(cov.hours * 3600), `to gather the whole bill${binding ? ' - ' + esc(binding.name) + ' is last' : ''}`]);
            if (items.length && cov.uncovered.length && binding) tiles.push([dur(cov.hours * 3600), `to gather what has a source - ${esc(binding.name)} is last`]);
            tiles.push([`${this.stakes.length}`, `claim stake${this.stakes.length === 1 ? '' : 's'} · ${plural(ext, 'extractor')}`]);
            tiles.push([`${hulls}`, `mining hull${hulls === 1 ? '' : 's'} · ${num(crew)} crew · ${num(food)} food / s`]);
            if (items.length) tiles.push([dur(sched.makespan), `to craft ${plural(x.craftCount, 'craft')} on ${hab.lanes.length ? `your hab's ${plural(jobs, 'job')}` : '1 job (no hab build saved)'}`]);
            if (this.stakes.length || this.fleets.length) tiles.push([cost ? usd(cost) : '–', `at the asks on the Ships vs Stakes tab${unpriced ? ` · ${unpriced} without a price` : ''}`]);
            return `<div class="an-stats cd-stats">${tiles.map(([n, l, c]) => `<div class="an-stat${c ? ' ' + c : ''}"><b>${n}</b><span>${l}</span></div>`).join('')}</div>`;
        }

        zoneOf(p) { const R = this.ctx.research; return R ? R.zoneClass(p, Store.s.faction) : 'medium'; }
        // bodies for a fleet: the player's own zone and territory first, then the richest
        bodies(raw) { return this.empire.bodiesFor(raw, p => ZONE_RANK[this.zoneOf(p)] + (String(p.terr).toLowerCase().startsWith(Store.s.faction.slice(0, 3)) ? 0 : 0.5)); }
        zoneWord(p) { const z = this.zoneOf(p); return z === 'own' ? '' : z === 'enemy' ? ' · ' + FAC_LABEL[p.zone.faction] + ' zone' : ' · ' + z + ' risk'; }
        zoneBadge(p) { const z = this.zoneOf(p); return `<span class="cd-zone ${z}">${z === 'own' ? 'low risk' : z === 'enemy' ? 'low risk, ' + FAC_LABEL[p.zone.faction] + ' zone' : z + ' risk'}</span>`; }

        // ---- stakes: search a planet by name, place a stake of any tier on it (the map only draws the result)
        // a planet in the stake search: its plan raws, and one Place button per stake tier
        planetRow(p) {
            const rows = this.cov ? this.cov.rows : [];
            const chips = Array.from(p.deposits.values()).map(d => ({ d, row: rows.find(r => r.name === d.name) })).filter(o => o.row).sort((a, b) => (a.row.perHour > 0) - (b.row.perHour > 0) || b.d.richness - a.d.richness).slice(0, 6)
                .map(o => `<span class="cd-raw${o.row.perHour > 0 ? '' : ' need'}">${esc(o.d.name)} <b>×${num(o.d.richness)}</b></span>`).join('');
            const sys = this.ctx.galaxy && this.ctx.galaxy.byKey.get(p.sysKey);
            const tiers = [1, 2, 3, 4, 5].map(t => {
                const n = this.se.extractable(p, t).length, gate = sys && t > sys.sb;
                const title = `Place a T${t} stake here: ${num(this.se.slots[t])} slots, ${n} raw${n === 1 ? '' : 's'} it can extract` + (gate ? `. Tier-${t} kits need a Level-${t} starbase; this system's is ${sys.sb ? 'Level ' + sys.sb : 'none'}` : '');
                return `<button type="button" class="sb-btn${gate ? ' gate' : ''}" data-stake-add="${esc(p.key)}|${t}" title="${esc(title)}">T${t}</button>`;
            }).join('');
            return `<div class="cd-prow"><i class="pdot" style="--c:${CAT_COLOR[p.cat]}"></i><b>${esc(p.name)}</b><small>${esc(p.system)} · ${esc(p.catName)} · <span class="f-${p.faction}">${FAC_LABEL[p.faction]}</span> · ${this.zoneBadge(p)}${sys ? ` · ${sys.sb === 6 ? 'CSS' : sys.sb ? 'L' + sys.sb + ' starbase' : 'no starbase'}` : ''}</small>
                <span class="cd-raws">${chips}</span>
                <span class="cd-prow-act">${tiers}</span></div>`;
        }
        renderPlanetResults() {
            const box = this.root.querySelector('#cdePlanetResults'); if (!box) return;
            const words = this.add.q.toLowerCase().split(/\s+/).filter(Boolean);
            if (!words.length) { box.innerHTML = ''; return; }
            const hits = this.se.planets.filter(p => p.stakeable && words.every(w => (p.name + ' ' + p.system).toLowerCase().includes(w))).slice(0, 8);
            box.innerHTML = hits.length ? hits.map(p => this.planetRow(p)).join('') : '<p class="rx-note">No planet matches. Asteroid belts are not listed: a belt holds no stake (send a mining fleet in step 3).</p>';
        }
        stakesHTML(srcById) {
            const cards = this.stakes.map(s => this.stakeCard(s, srcById.get(s.id))).join('');
            return `<div class="cd-addstake">
                    <input type="search" class="sb-input" id="cdePlanetFind" placeholder="Search a planet or system by name…" autocomplete="off" spellcheck="false" value="${esc(this.add.q)}">
                    <div class="cd-planets" id="cdePlanetResults"></div>
                </div>
                ${cards ? `<div class="cd-cards">${cards}</div><div class="cd-stage-foot"><p class="rx-note">◆ before a raw marks a raw in the plan's bill. Use + / − to move extractors between raws.</p><button type="button" class="sb-btn ghost" data-clear-empire>Clear stakes and fleets</button></div>` : ''}`;
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
                    ${ext.map(x => { const n = s.alloc[x.raw] || 0, out = (p.extracted.get(x.raw) || 0); return `<div class="cd-alloc-row${n ? ' on' : ''}"><span class="nm${inBill(x.name) ? ' need' : ''}" title="${esc(x.name)} - ${inBill(x.name) ? 'in the bill' : 'not in the bill'}">${esc(x.name)}</span><span class="rk">×${num(x.richness)}</span><span class="rt">${num(x.rate)} / tick</span><span class="st"><button type="button" data-alloc="${s.id}|${esc(x.raw)}|-1" ${n ? '' : 'disabled'} aria-label="One fewer ${esc(x.name)} extractor">−</button><b>${n}</b><button type="button" data-alloc="${s.id}|${esc(x.raw)}|1" ${anyRoom ? '' : 'disabled'} aria-label="One more ${esc(x.name)} extractor">+</button></span><span class="ot">${n ? num(out) + ' / tick' : ''}</span></div>`; }).join('') || '<p class="rx-note">No raw on this planet has an extractor a stake of this tier can run.</p>'}
                </div>
                ${shown.length ? `<div class="cd-procs"><span>Processors</span>${shown.map(b => { const on = s.procs.includes(b.id); const row = on && p.procs.find(r => r.b.id === b.id); return `<button type="button" class="chip${on ? ' on' : ''}" data-proc="${s.id}|${esc(b.id)}" title="${esc(this.se.inputs(b).map(([k, v]) => `${-v} ${this.se.resName(k)}`).join(' + '))} → ${esc(this.se.outputs(b).map(([k, v]) => `${v} ${this.se.resName(k)}`).join(' + '))} per tick">${esc(procOut(b).join(', '))}${row ? `<small>${num(row.makes[0].out)} of ${num(row.makes[0].rate)} / tick · ${(100 * row.fed).toFixed(0)} % fed</small>` : ''}</button>`; }).join('')}</div>` : ''}
                <div class="cd-stake-foot"><span>${Array.from(p.passive.keys()).length ? `Hub passive: ${Array.from(p.passive.entries()).map(([k, v]) => `${esc(this.se.resName(k))} ${num(v)}`).join(', ')} / tick. ` : ''}${p.fuel ? `Burns ${num(p.fuel)} fuel / tick.` : ''}${procs.length > shown.length ? ` ${procs.length - shown.length} other first-stage processors could run here; none makes anything in the plan.` : ''}</span><button type="button" class="sb-btn ghost" data-stake-auto="${s.id}" title="Clear this stake's extractors and fill every slot that fits again - the raws the plan still lacks first, then the ones it needs. Processors stay.">Auto-fill extractors</button></div>
            </article>`;
        }

        // ---- fleets
        fleetsHTML(cov) {
            const raws = cov.rows.filter(r => r.res && r.res.category === 'raw').map(r => r.name);
            const allRaws = this.rm.list.filter(r => r.category === 'raw').map(r => r.name).sort();
            const G = this.ctx.galaxy, opsById = new Map((this.ops ? this.ops.fleets : []).map(r => [r.id, r]));
            const haulers = (this.ctx.loadout ? this.ctx.loadout.ships.map(s => s.name) : this.empire.ships.map(s => s.name)).filter(n => this.empire.shipByName.has(n)).sort();
            const sel = (f, field, label, options) => `<select class="sb-input" data-fleet="${f.id}" data-field="${field}" aria-label="${label}">${options}</select>`;
            // drop-off / destination choices: the nearest starbase to `sysKey`, (a miner) the systems of your stakes - a
            // miner that drops off there restocks there, so the stake's R4 supply carries its fuel, food and ammo - the
            // three CSS, and whatever is set now
            const destOpts = (f, sysKey, none, withStakes) => {
                const list = [], seen = new Set(), push = (key, text) => { if (!key || seen.has(key)) return; seen.add(key); list.push([key, text]); };
                const near = sysKey && G ? G.nearestStarbase(sysKey) : null;
                if (near) push(near.sys.key, `${near.sys.name} - nearest starbase (L${near.sys.sb}, ${num(near.d, 1)} AU)`);
                if (withStakes && G) this.stakes.forEach(s => { const p = this.se.planetByKey.get(s.key); if (p) push(p.sysKey, `${p.system} - your T${s.tier} ${p.name}, restock from its R4 supply (${num(G.dist(sysKey, p.sysKey) || 0, 1)} AU)`); });
                if (G) ['ustur', 'mud', 'oni'].forEach(k => { const c = G.css(k); if (c) push(c.key, `${c.name} - ${k === 'ustur' ? 'USTUR' : k.toUpperCase()} CSS, the market (${num(G.dist(sysKey, c.key) || 0, 1)} AU)`); });
                if (f.dest && G && G.byKey.has(f.dest)) push(f.dest, `${G.byKey.get(f.dest).name} (${num(G.dist(sysKey, f.dest) || 0, 1)} AU)`);
                return (none ? `<option value=""${f.dest ? '' : ' selected'}>${none}</option>` : '') + list.map(([k, t]) => `<option value="${esc(k)}"${k === f.dest ? ' selected' : ''}>${esc(t)}</option>`).join('');
            };
            const taskSel = f => sel(f, 'task', 'Job', [['mine', 'Mine'], ['haul', 'Haul output'], ['supply', 'R4 supply']].map(([k, l]) => `<option value="${k}"${k === f.task ? ' selected' : ''}${k !== 'mine' && !this.stakes.length ? ' disabled' : ''}>${l}</option>`).join(''));
            const rows = this.fleets.map(f => {
                const o = opsById.get(f.id), ship = this.empire.shipByName.get(f.ship);
                const head = `<div class="cd-fleet-row">${taskSel(f)}<label>&times;<input type="number" class="sb-input" min="1" max="999" value="${f.count}" data-fleet="${f.id}" data-field="count" aria-label="Hull count"></label><button type="button" class="rp-x" data-fleet-remove="${f.id}" title="Remove this fleet">&times;</button></div>`;
                if (f.task === 'mine') {
                    const bodies = this.bodies(f.raw).slice(0, 10), body = this.se.planetByKey.get(f.body);
                    const opts = Array.from(new Set(raws.concat(f.raw ? [f.raw] : [])));
                    const out = o && o.dest && o.trip
                        ? `<b>${num(o.perHour)}</b> / h delivered<small>cycle ${dur(o.trip.cycle)} (${(100 * o.trip.miningShare).toFixed(0)} % mining) · ${num(o.fuel)} fuel and ${num(o.food)} food / h</small>`
                        : `<b>${num(ship.rate * f.count * f.richness)}</b> / s at the body<small>${ship.crew * f.count} crew · hold full in ${dur(ship.cargo / (ship.rate * f.richness))} · no trip counted</small>`;
                    return `<div class="cd-fleet task-mine">${head}
                        <div class="cd-fleet-row">${sel(f, 'ship', 'Hull', this.empire.miners.map(m => `<option value="${esc(m.name)}"${m.name === f.ship ? ' selected' : ''}>${esc(m.name)} - ${num(m.rate)} /s</option>`).join(''))}</div>
                        <div class="cd-fleet-row">${sel(f, 'raw', 'Raw mined', `<optgroup label="In the bill">${opts.map(n => `<option${n === f.raw ? ' selected' : ''}>${esc(n)}</option>`).join('')}</optgroup><optgroup label="Every raw">${allRaws.filter(n => !opts.includes(n)).map(n => `<option>${esc(n)}</option>`).join('')}</optgroup>`)}${sel(f, 'body', 'Body mined', bodies.concat(body && !bodies.some(b => b.key === body.key) ? this.bodies(f.raw).filter(b => b.key === body.key) : []).map(b => `<option value="${esc(b.key)}"${b.key === f.body ? ' selected' : ''}>${esc(b.name)} ×${num(b.richness)} · ${esc(b.system)}${b.belt ? ' · belt' : ''}${this.zoneWord(b.planet)}</option>`).join('') || '<option>no body carries it</option>')}</div>
                        <div class="cd-fleet-row">${sel(f, 'dest', 'Drop-off', destOpts(f, body && body.sysKey, 'No drop-off - rate at the body, no trip', true))}</div>
                        <div class="cd-fleet-out">${out}${o && o.warn.length ? `<small class="warn">${o.warn.map(esc).join('; ')}</small>` : ''}</div>
                    </div>`;
                }
                const stake = this.stakes.find(s => s.id === f.from), sp = stake && this.se.planetByKey.get(stake.key), sr = o && o.stake;
                const out = o && o.trip
                    ? `<b>${num(o.perHour)}</b> / h ${f.task === 'haul' ? 'hauled' : 'R4 brought'} of ${num(o.cap)} it could move (${(100 * o.busy).toFixed(0)} % busy)${sr ? ` · ${f.task === 'haul' ? `the stake makes ${num(sr.out)} / h` : `the base needs ${num(sr.r4.total)} / h: ${Object.entries(sr.r4.need).filter(([, v]) => v > 1e-9).map(([k, v]) => `${k} ${num(v)}`).join(', ') || 'nothing yet'}`}` : ''}<small>${o.trip.jumps} jump${o.trip.jumps === 1 ? '' : 's'} · round trip ${dur(o.trip.time)} · ${num(o.fuel)} fuel / h on the road (${num(o.fuelPerUnit)} per unit moved)</small>`
                    : '<small>pick a stake and a destination</small>';
                return `<div class="cd-fleet task-${f.task}">${head}
                    <div class="cd-fleet-row">${sel(f, 'ship', 'Hull', haulers.map(n => { const st = this.statsOf(n); return `<option value="${esc(n)}"${n === f.ship ? ' selected' : ''}>${esc(n)}${st ? ` - ${num(st.cargo_capacity)} CU` : ''}</option>`; }).join(''))}</div>
                    <div class="cd-fleet-row">${sel(f, 'from', 'Stake', this.stakes.map(s => { const p = this.se.planetByKey.get(s.key); return `<option value="${esc(s.id)}"${s.id === f.from ? ' selected' : ''}>T${s.tier} ${esc(p ? p.name : s.key)}</option>`; }).join(''))}<span class="cd-arrow">${f.task === 'haul' ? '→' : '←'}</span>${sel(f, 'dest', f.task === 'haul' ? 'Deliver to' : 'Fuel from', destOpts(f, sp && sp.sysKey, ''))}</div>
                    <div class="cd-fleet-out">${out}${o && o.warn.length ? `<small class="warn">${o.warn.map(esc).join('; ')}</small>` : ''}</div>
                </div>`;
            }).join('');
            const noStake = this.stakes.length ? '' : ' disabled title="Place a claim stake first (step 2)"';
            return `<div class="cd-fleet-add"><span class="sb-muted">Each fleet has one job</span>
                    <button type="button" class="sb-btn" data-fleet-add title="Mine one raw at one body and drop it off at a starbase">+ Mining fleet</button>
                    <button type="button" class="sb-btn" data-run-add="haul"${noStake} title="Carry a stake's whole output to a starbase (default: your CSS, the market)">+ Haul run</button>
                    <button type="button" class="sb-btn" data-run-add="supply"${noStake} title="Bring a stake the R4 - Fuel, Food, Ammunition, Repair Kits - it and the fleets based on it burn">+ R4 supply</button></div>
                ${rows ? `<div class="cd-cards">${rows}</div>` : '<p class="rx-note">No fleet yet. A mining fleet is the only source for raws no stake can extract; a haul run and an R4 supply serve a stake from step 2.</p>'}
                ${this.fleets.length ? '<p class="rx-note">Mining = hull rate × count × the body\'s richness; with a drop-off, the hold is flown there and back each cycle. The game also divides by a hardness the export does not list.</p>' : ''}`;
        }

        // ---- hab schedule (2026-10-08): one lane per job, crafts in dependency order, the critical path in gold
        scheduleHTML(items, cov, S, hab) {
            const head = (sub, extra) => `<div class="rx-panel-head"><h3>Hab schedule</h3><span>${sub}</span><a class="sb-btn ghost" href="../HubExplorer/index.html" target="_blank" rel="noopener">${extra || 'Open the Hub Explorer'}</a></div>`;
            if (!items.length) return `<section class="rx-panel cd-sched">${head('the plan is empty')}<p class="rx-note">Add a recipe above: its crafts are placed on your hab's jobs here, one lane per job, each craft starting when its inputs are crafted, and the critical path says whether the queue or the chain sets the time.</p></section>`;
            const habText = hab.lanes.length ? esc(hab.label) : 'one job at 1× (no hab build saved - build a hab in the Hub Explorer)';
            if (!S.crafts) return `<section class="rx-panel cd-sched">${head(`nothing to craft: every good in the plan is made by a stake processor · ${habText}`)}</section>`;
            const W = 1040, LW = 150, RW = 58, TOP = 22, RH = 24, H = TOP + S.lanes.length * RH + 6, span = Math.max(S.makespan, 1e-9), plotW = W - LW - RW - 10;
            const x = t => LW + plotW * t / span;
            const colorOf = new Map(S.byType.map((ty, i) => [ty.name, CAT_COLOR[i % CAT_COLOR.length]]));
            // axis: the smallest "nice" step that gives at most ten ticks (so 4-11), no upper bound on the step (a big
            // plan runs for centuries; a 30-day cap once drew 3,181 labels); a label that repeats, or crowds the end, is dropped
            const step = axisStep(span);
            let axis = ''; const seen = new Set([dur(span)]);
            for (let k = 0; k * step <= span + 1e-9; k++) {
                const t = k * step, lab = t === 0 ? '0' : dur(t);
                if (seen.has(lab) || (t > 0 && x(span) - x(t) < 40)) continue;
                seen.add(lab);
                axis += `<line class="grid" x1="${x(t).toFixed(1)}" y1="${TOP - 4}" x2="${x(t).toFixed(1)}" y2="${H - 6}"></line><text class="ax" x="${x(t).toFixed(1)}" y="${TOP - 8}" text-anchor="${t === 0 ? 'start' : 'middle'}">${esc(lab)}</text>`;
            }
            axis += `<line class="grid end" x1="${x(span).toFixed(1)}" y1="${TOP - 4}" x2="${x(span).toFixed(1)}" y2="${H - 6}"></line><text class="ax end" x="${x(span).toFixed(1)}" y="${TOP - 8}" text-anchor="end">${esc(dur(span))}</text>`;
            const laneRows = S.lanes.map((l, i) => {
                const y = TOP + i * RH;
                const runs = l.runs.map(r => {
                    const x0 = x(r.start), w = Math.max(1.5, x(r.end) - x0), label = w >= 44 ? trunc(r.name, Math.max(3, Math.floor((w - 8) / 6.4))) + (w >= 44 + 6.4 * (String(r.n).length + 2) ? ` ×${num(r.n)}` : '') : '';
                    return `<g class="run${r.path ? ' path' : ''}" data-craft="${esc(r.name)}"><title>${esc(r.name)} × ${num(r.n)}: ${esc(dur(r.start))} → ${esc(dur(r.end))} (${esc(dur(r.end - r.start))}) on ${esc(l.label)}${r.path ? ' · on the critical path' : ''}</title><rect x="${x0.toFixed(1)}" y="${y + 3}" width="${w.toFixed(1)}" height="${RH - 6}" rx="3" fill="${colorOf.get(r.name)}"></rect>${label ? `<text x="${(x0 + 4).toFixed(1)}" y="${y + RH / 2 + 4}">${esc(label)}</text>` : ''}</g>`;
                }).join('');
                return `<g class="lane"><rect class="trk" x="${LW}" y="${y + 2}" width="${plotW}" height="${RH - 4}" rx="3"></rect><text class="ln" x="6" y="${y + RH / 2 + 4}">${esc(trunc(l.label, 20))}</text><text class="sp" x="${LW - 6}" y="${y + RH / 2 + 4}" text-anchor="end">${num(l.speed)}×</text>${runs}<text class="ut" x="${W - 6}" y="${y + RH / 2 + 4}" text-anchor="end">${(100 * l.util).toFixed(0)} %</text></g>`;
            }).join('');
            // the critical path, the bottleneck in words, the busiest and idlest lanes
            const pathHTML = S.path.map(p => `<span class="cd-seg ${p.kind}"><i style="background:${colorOf.get(p.name)}"></i><b>${esc(p.name)}</b> ×${num(p.n)} <small>${esc(dur(p.end - p.start))}${p.kind === 'input' ? ' · after an input' : p.kind === 'lane' ? ' · after a free job' : ''}</small></span>`).join('<em>→</em>');
            const onPath = S.byType.filter(t => t.onPath > 0).sort((a, b) => b.onPath - a.onPath)[0];
            const busiest = S.lanes.slice().sort((a, b) => b.util - a.util)[0], idlest = S.lanes.slice().sort((a, b) => a.util - b.util)[0];
            const uneven = S.lanes.length > 1 && Math.round(100 * busiest.util) !== Math.round(100 * idlest.util);   // equal lanes: nothing to name
            const queueWins = S.pathBy.lane > S.pathBy.input;
            const verdict = S.lanes.length === 1
                ? `One job: every craft queues behind the one before it, so the time is the work itself (${esc(dur(S.work))} at 1×).`
                : queueWins
                    ? `The queue sets the time: ${esc(dur(S.pathBy.lane))} of the ${esc(dur(S.makespan))} path is crafts that waited for a free job, ${esc(dur(S.pathBy.input))} crafts that waited for an input. More jobs shorten it; the chain alone would take ${esc(dur(S.chain))}.`
                    : `The chain sets the time: ${esc(dur(S.pathBy.input))} of the ${esc(dur(S.makespan))} path is crafts that waited for an input, ${esc(dur(S.pathBy.lane))} crafts that waited for a free job. More jobs barely help; a faster station does. The chain alone takes ${esc(dur(S.chain))}.`;
            const rows = S.byType.map(t => `<tr><th><i class="cd-dot" style="background:${colorOf.get(t.name)}"></i>${esc(t.name)}${t.needs.length ? `<small>needs ${esc(t.needs.join(', '))}</small>` : '<small>from raws</small>'}</th><td>${num(t.crafts)}</td><td>${esc(dur(t.each))}</td><td>${esc(dur(t.first))}</td><td>${esc(dur(t.last))}</td><td>${esc(dur(t.laneTime))}</td><td${t.onPath > 0 ? ' class="on"' : ''}>${t.onPath > 0 ? esc(dur(t.onPath)) : '–'}</td></tr>`).join('');
            return `<section class="rx-panel cd-sched">
                ${head(`${plural(S.crafts, 'craft')} on ${habText} · raws in hand · gold outline = the critical path · hover a block`)}
                <div class="rx-facts cd-sched-facts"><div><b>${esc(dur(S.makespan))}</b><span>scheduled on your hab's jobs</span></div><div><b>${esc(dur(S.parallel))}</b><span>if every job ran in parallel (work ÷ speed)</span></div><div><b>${esc(dur(S.chain))}</b><span>the chain alone (unlimited jobs)</span></div><div><b>${(100 * S.lanes.reduce((a, l) => a + l.util, 0) / S.lanes.length).toFixed(0)} %</b><span>of the jobs' time busy</span></div></div>
                <div class="cd-sched-wrap"><svg class="cd-gantt" viewBox="0 0 ${W} ${H}" role="img" aria-label="Job timeline: one lane per job, crafts in order">${axis}${laneRows}</svg></div>
                ${S.complete ? '' : '<p class="rx-note warn">The schedule stopped early: a craft never had its inputs. Please report this plan.</p>'}
                <div class="cd-path"><h4>Critical path</h4><p class="cd-path-chain">${pathHTML}</p><p class="rx-note">${verdict}${onPath ? ` <b>${esc(onPath.name)}</b> holds ${esc(dur(onPath.onPath))} of the path.` : ''}${uneven ? ` Busiest job: ${esc(busiest.label)} at ${(100 * busiest.util).toFixed(0)} %; idlest: ${esc(idlest.label)} at ${(100 * idlest.util).toFixed(0)} %.` : ''}</p></div>
                <h4 class="cd-sched-h">The queue · in start order</h4>
                <div class="an-tablewrap"><table class="an-table cd-queue"><thead><tr><th>Craft</th><th>crafts</th><th>each at 1×</th><th>first start</th><th>last done</th><th>job time</th><th>on the path</th></tr></thead><tbody>${rows}</tbody></table></div>
                <p class="rx-note">A job runs one craft at a time; a station's speed divides the craft time; a storage's job bonus is read as a 1× job (the export gives it no speed). A craft starts when its crafted inputs are in the pool, so the first of a kind can start before every input craft is done. Raws are taken as in hand: gathering them is the bill above. Build times are the export's <i>constructionTime</i> read as seconds, as the Recipe Explorer reads them. Research bonuses (Rapid Fabrication, Station Expansion) are not applied.</p>
            </section>`;
        }

        // ---- research the whole thing needs
        // the research the stakes, fleets and plan need: stake tiers, every building placed, hull sizes, the Fleet Size
        // tier the largest fleet needs (count x capacity points; each fleet row is one fleet), zone access, and the
        // plan's recipe chains. Without arguments it builds the coverage itself (the Research tab asks on a faction change).
        researchNeed(items, cov) {
            const R = this.ctx.research; if (!R) return null;
            items = items || this.items();
            cov = cov || this.empire.coverage(items, this.stakes, this.fleets, { tick: Store.s.tick, richness: Store.s.richness });
            const run = new Set(), craft = new Set(), zones = new Map();
            const zone = (body, prefer) => { if (!body) return; const cls = R.zoneClass(body, Store.s.faction), n = R.zoneGrant(cls, prefer); if (n) { n.tags.forEach(t => run.add(t)); zones.set(cls + '|' + n.name, { cls, n }); } };
            cov.sources.forEach(x => {
                if (x.kind === 'stake') { R.stakeGate(x.tier).forEach(t => run.add(t)); x.prod.layout.items.forEach(it => R.buildingGate(it.b.id).forEach(t => run.add(t))); zone(x.planet, 'Building'); }
                else { R.shipGate({ sizeTier: x.ship.size }).forEach(t => run.add(t)); const f = this.fleets.find(q => q.id === x.id); zone(f && this.se.planetByKey.get(f.body), 'Mining'); }
            });
            this.fleets.filter(f => f.task === 'haul' || f.task === 'supply').forEach(f => { const s = this.empire.shipByName.get(f.ship); if (s) R.shipGate({ sizeTier: s.size }).forEach(t => run.add(t)); });   // haulers fly too
            const fp = this.empire.fleetPoints(this.fleets), ladder = R.fleetLadder(), top = ladder.length ? ladder[ladder.length - 1].cap : 0;
            const rung = fp.max ? R.fleetSizeFor(fp.max) || null : null;
            if (rung) rung.node.tags.forEach(t => run.add(t)); else if (fp.max > top && ladder.length) ladder[ladder.length - 1].node.tags.forEach(t => run.add(t));
            items.forEach(it => { const r = this.rc.byId.get(it.id); if (r) R.chainGate(r).forEach(t => craft.add(t)); });
            const all = new Set([...run, ...craft]);
            return { run, craft, zones, fleet: { fp, rung, top }, tags: Array.from(all), sub: `${plural(this.stakes.length, 'stake')}, ${plural(this.fleets.length, 'fleet')} and the plan's recipes` };
        }
        researchHTML(items, cov) {
            const R = this.ctx.research; if (!R) return '';
            const need = this.researchNeed(items, cov), { run, craft, zones, fleet } = need;
            this.lastResearch = { tags: need.tags, sub: need.sub };
            if (!need.tags.length) return '';
            const fp = fleet.fp, warns = fp.rows.filter(r => r.warn.length);
            const fleetNote = fp.max ? `<p class="rx-note${fp.max > fleet.top || warns.length ? ' warn' : ''}">Fleet Size: the largest fleet counts ${num(fp.max)} capacity points (hull count × class points; a Titan counts 128)${fp.rows.length > 1 ? `; all ${plural(fp.rows.length, 'fleet')} together ${num(fp.sum)} (the export does not say whether the cap is per fleet or across fleets)` : ''}.${fleet.rung ? ` That takes ${esc(fleet.rung.node.name)} (a cap of ${num(fleet.rung.cap)}).` : ` That is above the top cap of ${num(fleet.top)}: split the fleet.`}${warns.length ? ' Too many large hulls in one fleet: ' + warns.map(r => `${esc(r.ship)} - ${r.warn.map(esc).join(', ')}`).join('; ') + '.' : ''}${fp.unknown ? ` ${plural(fp.unknown, 'fleet')} with no class in the points table not counted.` : ''}</p>` : '';
            const owned = this.ctx.app && this.ctx.app.researchTab ? this.ctx.app.researchTab.owned : new Set(R.start ? [R.start.id] : []);
            const T = window.CommandDeck.ResearchModel.TRACK_BY_KEY;
            const line = (label, tags) => { if (!tags.size) return ''; const b = R.bill(R.closure(tags), owned); const lv = Object.entries(b.levels).filter(([, v]) => v > 0).sort((a, c) => (b.xp[c[0]] || 0) - (b.xp[a[0]] || 0)); return `<div class="cd-res-line"><h4>${label}</h4><div class="rx-facts"><div><b>${b.todo}</b><span>node${b.todo === 1 ? '' : 's'} to research</span></div><div><b>${num(b.atlas)}</b><span>ATLAS</span></div><div><b>${b.rows.filter(r => r.owned && r.node !== R.start).length}</b><span>already researched</span></div></div>${lv.length ? `<p class="rx-note">Levels: ${lv.map(([k, v]) => `${esc((T.get(k) || { label: k }).label)} L${v}${b.xp[k] != null ? ' (' + num(b.xp[k]) + ' XP)' : ''}`).join(', ')}.${b.levels.CouncilRank ? ' (Council Rank levels cost 1 XP each in the export.)' : ''}</p>` : ''}</div>`; };
            // every node still to research (both lines, prerequisites included), one list per category, three columns
            const todo = R.bill(R.closure(new Set([...run, ...craft])), owned).rows.filter(r => !r.owned && r.node !== R.start).map(r => r.node);
            const cats = window.CommandDeck.ResearchModel.TRACKS.map(t => ({ t, nodes: todo.filter(n => n.track === t) })).filter(c => c.nodes.length);
            const lists = cats.length ? `<div class="cd-res-cats">${cats.map(c => `<div class="cd-res-cat"><h4>${esc(c.t.label)} <small>${c.nodes.length}</small></h4><ul>${c.nodes.map(n => `<li>${esc(n.name)}${n.level[c.t.key] ? `<small>L${n.level[c.t.key]}</small>` : ''}</li>`).join('')}</ul></div>`).join('')}</div>` : '';
            return `<section class="rx-panel cd-res">
                <div class="rx-panel-head"><h3>Research this needs</h3><span>from the gate map: stake tiers, every building placed, hull sizes, fleet size, zone access, and the plan's recipes</span><button type="button" class="sb-btn" data-show-research>Show on the tree</button></div>
                <div class="cd-res-two">${line('To run the stakes and fleets', run)}${line('To craft the plan yourself', craft)}</div>
                ${lists}
                ${fleetNote}
                ${zones.size ? `<p class="rx-note">Zone access counted for a ${Store.s.faction.toUpperCase()} player: ${Array.from(zones.values()).map(z => `${ZONE_TEXT[z.cls]} → ${esc(z.n.name)}`).join('; ')}. Several nodes grant the same access; the one on the activity's own track, or else the cheapest, is used.</p>` : ''}
            </section>`;
        }
    }

    window.DeckEmpireTab = EmpireTab;
})();
