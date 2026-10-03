// construction.js - the Stake Builder (2026-09-30). Pick a planet, pick the stake tier you will buy, place buildings on
// an isometric hex pad (Blender-rendered tiles, Images/stake/), watch slots / power / crew, read the bill of materials
// and the production ledger, then play the construction sequence. Replaces the 2025 GaliaViewer port.
//
// Rules the data does not state (owner-confirmed, see the star-atlas-sage-research skill):
//   - a stake is bought per tier and holds tier-N buildings only; the export's "-tN" upgrade-path tags are ignored
//   - asteroid belts cannot hold a stake (no central hub exists for them)
//   - a processor's on-chain placement tag is its INPUT's cargo id: every input must be a deposit on the planet;
//     an input made by another building in the plan is shown as an unverified "chain"
// Slots per tier come from claimStakeDefinitions (65 / 487 / 2,049 / 6,251 / 15,553). Power is the signed sum of
// every building's power (the central hub supplies +100 at T1). Crew: neededCrew must fit in crewSlots.
(function () {
    'use strict';

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const slug = n => String(n || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const num = (v, d) => (typeof v === 'number' ? v.toLocaleString(undefined, { maximumFractionDigits: d == null ? (v && Math.abs(v) < 0.01 ? 4 : 3) : d }) : '0');
    const T = window.StakeTiles;
    const kindOf = T.kindOf, KIND_LABEL = T.KIND_LABEL, KIND_GROUP = T.KIND_GROUP;

    const CAT_TAG = ['terrestrial-planet', 'volcanic-planet', 'barren-planet', 'asteroid-belt', 'gas-giant-planet', 'ice-giant-planet', 'dark-planet', 'oceanic-planet'];
    const CAT_NAME = ['Terrestrial', 'Volcanic', 'Barren', 'Asteroid Belt', 'Gas Giant', 'Ice Giant', 'Dark', 'Oceanic'];
    const CAT_COLOR = ['#3fae79', '#e2512b', '#b7a58a', '#9a9a9a', '#d99a4e', '#7fd0ff', '#6b70b8', '#2f8cff'];
    const FACTION = ['oni', 'mud', 'ustur'];
    const FACTION_LABEL = { oni: 'ONI', mud: 'MUD', ustur: 'USTUR' };
    const HUB_FOR = {
        'enables-extractors': 'extraction_hub', 'enables-processors': 'processing_hub', 'storage-hub': 'storage_hub',
        'enables-storage-modules': 'storage_hub', 'enables-organic-extractors': 'farm_hub', 'enables-plant-extractors': 'farm_hub',
        'enables-biomass-extractor': 'farm_hub', 'enables-food-processor': 'farm_hub'
    };
    // What a building of each kind ENABLES on a per-tier stake. The export only puts the enables-* tags on the
    // tier-1 hubs (its upgrade-path model); a stake bought at tier N holds tier-N hubs, so the grants follow the kind.
    const KIND_GRANTS = {
        central_hub: ['enables-processing-hub', 'enables-storage-hub', 'enables-extraction-hub', 'enables-farm-hub', 'enables-crew-quarters', 'enables-power-plant'],
        cultivation_hub: ['enables-processing-hub', 'enables-storage-hub', 'enables-extraction-hub', 'enables-farm-hub', 'enables-crew-quarters', 'enables-power-plant'],
        extraction_hub: ['enables-extractors'], processing_hub: ['enables-processors'], storage_hub: ['storage-hub', 'enables-storage-modules'],
        farm_hub: ['enables-organic-extractors', 'enables-biomass-extractor', 'enables-food-processor', 'enables-plant-extractors']
    };
    const PARENT_HUB = { extractor: 'extraction_hub', processor: 'processing_hub', storage_module: 'storage_hub', farm: 'farm_hub' };
    const HUB_CELL = { extraction_hub: [1, -1], processing_hub: [-1, 1], storage_hub: [1, 0], farm_hub: [-1, 0], power_plant: [0, -1], crew_quarters: [0, 1] };
    const GROUPS = [['all', 'All'], ['hubs', 'Hubs'], ['extractors', 'Extractors'], ['processors', 'Processors'], ['farms', 'Farms'], ['support', 'Support']];
    const BUILD_RANK = { central_hub: 0, cultivation_hub: 0, power_plant: 1, crew_quarters: 1, extraction_hub: 2, processing_hub: 2, storage_hub: 2, farm_hub: 2 };
    const STORE_KEY = 'csx.stakePlan';

    // ---- pad geometry (pointy-top axial hexes, squashed by the tile camera's elevation)
    const R = 54, RINGS = 3, SQRT3 = Math.sqrt(3);
    const SQ = T.squash();
    const STAGE_W = 700, STAGE_H = 420, CX = STAGE_W / 2, CY = 250;
    const toScreen = (q, r) => [CX + R * SQRT3 * (q + r / 2), CY + R * 1.5 * r * SQ];
    const SPIRAL = (() => {
        const cells = [[0, 0]];
        const dirs = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
        for (let n = 1; n <= RINGS; n++) {
            let q = 0, r = -n;
            for (let side = 0; side < 6; side++) {
                for (let i = 0; i < n; i++) { cells.push([q, r]); q += dirs[side][0]; r += dirs[side][1]; }
            }
        }
        return cells;
    })();
    const hexPoints = (cx, cy) => { const pts = []; for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i - 30); pts.push((cx + R * Math.cos(a)).toFixed(1) + ',' + (cy + R * Math.sin(a) * SQ).toFixed(1)); } return pts.join(' '); };

    // ---- data
    const StakeData = {
        ready: false,
        init() {
            if (this.ready) return;
            this.buildings = (window.rawBuildingData && window.rawBuildingData.buildings) || [];
            const defs = (window.rawBuildingData && window.rawBuildingData.claimStakeDefinitions) || [];
            this.slots = { standard: {}, cultivation: {} };
            defs.forEach(d => { const k = d.id.startsWith('cultivation') ? 'cultivation' : 'standard'; this.slots[k][d.tier] = d.slots; });
            [1, 2, 3, 4, 5].forEach(t => { this.slots.standard[t] = this.slots.standard[t] || [65, 487, 2049, 6251, 15553][t - 1]; this.slots.cultivation[t] = this.slots.cultivation[t] || this.slots.standard[t]; });
            this.res = new Map(((window.resourcesData && window.resourcesData.resources) || []).map(r => [r.id, r]));
            this.systems = ((window.planetData && window.planetData.mapData) || []).filter(s => s.planets && s.planets.length);
            this.maxRich = new Map();
            this.planets = [];
            this.systems.forEach(s => s.planets.forEach((p, i) => {
                (p.resources || []).forEach(r => { const k = slug(r.name); if ((this.maxRich.get(k) || 0) < r.richness) this.maxRich.set(k, r.richness); });
                this.planets.push({ key: s.key + ':' + i, system: s, planet: p, index: i, cat: p.type % 8, faction: FACTION[Math.floor(p.type / 8)] || 'oni', deposits: (p.resources || []).length });
            }));
            this.ready = true;
        },
        resName(id) { if (!this.ready) this.init(); const r = this.res.get(id); return r ? r.name : id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); },
        resTier(id) { if (!this.ready) this.init(); const r = this.res.get(id); return r ? r.tier : null; },
        resCat(id) { if (!this.ready) this.init(); const r = this.res.get(id); return r ? r.category : ''; },
        inputs(b) { return Object.entries(b.resourceRate || {}).filter(([, v]) => v < 0).map(([k]) => k); },
        outputs(b) { return Object.entries(b.resourceRate || {}).filter(([, v]) => v > 0).map(([k]) => k).concat(Object.keys(b.resourceExtractionRate || {})); }
    };
    window.StakeData = StakeData;

    // ---- the builder
    class StakeBuilder {
        constructor(root) {
            this.root = root;
            this.plan = null;              // { key, system, planet, index, tier, kind, items: [{uid, b, cell}] }
            this.uid = 0;
            this.filters = { q: '', factions: new Set(), cats: new Set() };
            this.cat = { q: '', group: 'all' };
            this.listLimit = 60;
            this.sequence = null;
            StakeData.init();
            this.renderShell();
            this.bind();
            this.renderPlanetList();
            this.restore();
            this.renderAll();
            T.ready.then(() => this.renderPad());
        }

        // ------------------------------------------------------------------ shell
        renderShell() {
            this.root.innerHTML = `
            <div class="sb">
                <aside class="sb-side">
                    <div class="sb-side-head"><h3>Planet</h3><span class="sb-count" id="sbPlanetCount"></span></div>
                    <input type="text" id="sbSearch" class="sb-input" placeholder="System or planet name" autocomplete="off">
                    <div class="chips" id="sbFactions">${FACTION.map(f => `<button type="button" class="chip f-${f}" data-f="${f}">${FACTION_LABEL[f]}</button>`).join('')}</div>
                    <div class="chips" id="sbCats">${CAT_NAME.map((n, i) => i === 3 ? '' : `<button type="button" class="chip" data-c="${i}" style="--c:${CAT_COLOR[i]}"><i></i>${n}</button>`).join('')}</div>
                    <div class="sb-planets" id="sbPlanets"></div>
                </aside>
                <section class="sb-main">
                    <div class="sb-top">
                        <div class="sb-planet-card" id="sbPlanetCard"></div>
                        <div class="sb-stake" id="sbStake"></div>
                        <div class="sb-gauges" id="sbGauges"></div>
                    </div>
                    <div class="sb-pad-wrap" id="sbPadWrap">
                        <div class="sb-pad-bar">
                            <div class="sb-pad-title"><b id="sbPadTitle">Stake pad</b><span id="sbPadSub"></span></div>
                            <div class="sb-pad-actions">
                                <button type="button" class="sb-btn" data-act="construct" title="Play the construction sequence">&#x25B6; Construct facility</button>
                                <button type="button" class="sb-btn ghost" data-act="export">Export PNG</button>
                                <button type="button" class="sb-btn ghost danger" data-act="clear">Clear</button>
                            </div>
                        </div>
                        <div class="sb-stage-box" id="sbStageBox">
                            <div class="sb-stage" id="sbStage" style="width:${STAGE_W}px;height:${STAGE_H}px">
                                <svg class="sb-grid" viewBox="0 0 ${STAGE_W} ${STAGE_H}" width="${STAGE_W}" height="${STAGE_H}" aria-hidden="true">${SPIRAL.map(([q, r]) => { const [x, y] = toScreen(q, r); return `<polygon class="cell" data-q="${q}" data-r="${r}" points="${hexPoints(x, y)}"/>`; }).join('')}</svg>
                                <svg class="sb-flow" viewBox="0 0 ${STAGE_W} ${STAGE_H}" width="${STAGE_W}" height="${STAGE_H}" aria-hidden="true"></svg>
                                <div class="sb-tiles" id="sbTiles"></div>
                                <div class="sb-empty" id="sbEmpty"><b>Pick a planet</b><span>The pad opens on any planet that can hold a claim stake.</span></div>
                            </div>
                            <div class="sb-build-strip" id="sbStrip" hidden></div>
                        </div>
                        <div class="sb-legend">
                            <span><i style="--c:#4fd8ff"></i>hub</span><span><i style="--c:#ff9a3c"></i>extractor</span><span><i style="--c:#b48cff"></i>processor</span><span><i style="--c:#ffd36b"></i>storage</span><span><i style="--c:#7ee8a4"></i>farm</span><span class="flowkey"><svg width="34" height="10"><path d="M1 5 H33" class="flow"/></svg>resource chain</span>
                        </div>
                    </div>
                    <div class="sb-charts" id="sbCharts"></div>
                </section>
                <aside class="sb-cat">
                    <div class="sb-side-head"><h3>Catalogue</h3><span class="sb-count" id="sbCatCount"></span></div>
                    <input type="text" id="sbCatSearch" class="sb-input" placeholder="Search buildings" autocomplete="off">
                    <div class="chips" id="sbGroups">${GROUPS.map(([k, n]) => `<button type="button" class="chip${k === 'all' ? ' on' : ''}" data-g="${k}">${n}</button>`).join('')}</div>
                    <div class="sb-cat-list" id="sbCatList"></div>
                </aside>
            </div>
            <div class="sb-tip" id="sbTip" hidden></div>
            <div class="sb-toast" id="sbToast" hidden></div>`;
            this.$ = id => this.root.querySelector('#' + id) || document.getElementById(id);
        }

        bind() {
            const root = this.root;
            const snd = (n) => { if (window.spaceSounds && window.spaceSounds[n]) window.spaceSounds[n](); };
            this.$('sbSearch').addEventListener('input', e => { this.filters.q = e.target.value.trim().toLowerCase(); this.listLimit = 60; this.renderPlanetList(); });
            this.$('sbFactions').addEventListener('click', e => { const c = e.target.closest('[data-f]'); if (!c) return; const f = c.dataset.f; this.filters.factions.has(f) ? this.filters.factions.delete(f) : this.filters.factions.add(f); c.classList.toggle('on'); snd('select'); this.listLimit = 60; this.renderPlanetList(); });
            this.$('sbCats').addEventListener('click', e => { const c = e.target.closest('[data-c]'); if (!c) return; const k = +c.dataset.c; this.filters.cats.has(k) ? this.filters.cats.delete(k) : this.filters.cats.add(k); c.classList.toggle('on'); snd('select'); this.listLimit = 60; this.renderPlanetList(); });
            this.$('sbPlanets').addEventListener('click', e => {
                const more = e.target.closest('[data-more]'); if (more) { this.listLimit += 120; this.renderPlanetList(); return; }
                const row = e.target.closest('[data-key]'); if (!row || row.classList.contains('belt')) return;
                snd('click'); this.selectPlanet(row.dataset.key);
            });
            this.$('sbStake').addEventListener('click', e => {
                const t = e.target.closest('[data-tier]'); if (t) { snd('select'); this.setTier(+t.dataset.tier); return; }
                const k = e.target.closest('[data-kind]'); if (k) { snd('select'); this.setKind(k.dataset.kind); }
            });
            this.$('sbCatSearch').addEventListener('input', e => { this.cat.q = e.target.value.trim().toLowerCase(); this.renderCatalogue(); });
            this.$('sbGroups').addEventListener('click', e => { const c = e.target.closest('[data-g]'); if (!c) return; this.cat.group = c.dataset.g; this.$('sbGroups').querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === c)); snd('select'); this.renderCatalogue(); });
            const list = this.$('sbCatList');
            list.addEventListener('click', e => {
                const add = e.target.closest('[data-add]'); if (add) { e.stopPropagation(); this.addBuilding(add.dataset.add, true); return; }
                const card = e.target.closest('[data-id]'); if (card) this.showTip(card.dataset.id, e.clientX, e.clientY, null);
            });
            list.addEventListener('mouseover', e => { const card = e.target.closest('[data-id]'); this.hotDeposits(card ? this.byId(card.dataset.id) : null); });
            list.addEventListener('mouseleave', () => this.hotDeposits(null));
            this.$('sbTiles').addEventListener('click', e => { const t = e.target.closest('[data-uid]'); if (!t) return; snd('click'); const it = this.plan.items.find(i => i.uid === +t.dataset.uid); if (it) this.showTip(it.b.id, e.clientX, e.clientY, it); });
            root.querySelector('.sb-pad-actions').addEventListener('click', e => {
                const b = e.target.closest('[data-act]'); if (!b) return;
                ({ construct: () => this.construct(), export: () => this.exportPNG(), clear: () => this.clear() })[b.dataset.act]();
            });
            const tip = this.$('sbTip');
            tip.addEventListener('click', e => {
                const a = e.target.closest('[data-tip]'); if (!a) return;
                if (a.dataset.tip === 'close') this.hideTip();
                else if (a.dataset.tip === 'add') { this.addBuilding(a.dataset.id, true); this.hideTip(); }
                else if (a.dataset.tip === 'remove') { this.removeItem(+a.dataset.uid); this.hideTip(); }
                else if (a.dataset.tip === 'recipe') { if (window.ConstructionUtils) ConstructionUtils.openRecipeExplorer(a.dataset.name, +a.dataset.tier); }
            });
            document.addEventListener('keydown', e => { if (e.key === 'Escape') { this.hideTip(); this.stopSequence(); } });
            document.addEventListener('click', e => { if (!tip.hidden && !tip.contains(e.target) && !e.target.closest('[data-id],[data-uid]')) this.hideTip(); });
            document.addEventListener('visibilitychange', () => { this.$('sbStage').classList.toggle('paused', document.hidden); });
            const fit = () => { const box = this.$('sbStageBox'); const s = Math.min(1, (box.clientWidth - 8) / STAGE_W); this.$('sbStage').style.transform = `scale(${s})`; box.style.height = Math.round(STAGE_H * s) + 'px'; };
            this.fit = fit;
            window.addEventListener('resize', fit);
            fit();
        }

        byId(id) { return StakeData.buildings.find(b => b.id === id); }

        // --------------------------------------------------------------- planets
        filteredPlanets() {
            const f = this.filters;
            return StakeData.planets.filter(p => {
                if (f.factions.size && !f.factions.has(p.faction)) return false;
                if (f.cats.size && !f.cats.has(p.cat)) return false;
                if (f.q) { const s = p.system; if (!(String(p.planet.name || '').toLowerCase().includes(f.q) || String(s.name || '').toLowerCase().includes(f.q) || String(s.key || '').toLowerCase().includes(f.q))) return false; }
                return true;
            });
        }

        renderPlanetList() {
            const all = this.filteredPlanets();
            const shown = all.slice(0, this.listLimit);
            const cur = this.plan && this.plan.key;
            this.$('sbPlanetCount').textContent = `${all.length.toLocaleString()} of ${StakeData.planets.length.toLocaleString()}`;
            this.$('sbPlanets').innerHTML = shown.map(p => {
                const belt = p.cat === 3;
                return `<button type="button" class="sb-prow${belt ? ' belt' : ''}${p.key === cur ? ' on' : ''}" data-key="${esc(p.key)}" ${belt ? 'title="Asteroid belts cannot hold a claim stake (no central hub exists for them)"' : ''}>
                    <i class="pdot" style="--c:${CAT_COLOR[p.cat]}"></i>
                    <span class="pn">${esc(p.planet.name || 'Planet ' + (p.index + 1))}</span>
                    <span class="ps">${esc(p.system.name || p.system.key)}</span>
                    <span class="pb"><em class="f-${p.faction}">${FACTION_LABEL[p.faction]}</em><em>${CAT_NAME[p.cat]}</em>${belt ? '<em class="no">no stake</em>' : `<em>${p.deposits} deposits</em>`}</span>
                </button>`;
            }).join('') + (all.length > shown.length ? `<button type="button" class="sb-more" data-more>Show more (${(all.length - shown.length).toLocaleString()} left)</button>` : '');
        }

        selectPlanet(key) {
            const p = StakeData.planets.find(x => x.key === key);
            if (!p || p.cat === 3) return;
            const tier = this.plan ? this.plan.tier : 1, kind = this.plan ? this.plan.kind : 'standard';
            this.plan = { key, system: p.system, planet: p.planet, index: p.index, tier, kind, items: [] };
            this.addStakeBuildings();
            this.hideTip(); this.stopSequence();
            this.renderPlanetList();
            this.renderAll();
            this.save();
        }

        setTier(tier) {
            if (!this.plan || this.plan.tier === tier) return;
            const old = this.plan.items.filter(i => !i.b.comesWithStake).map(i => i.b.id.replace(/-t\d$/, '-t' + tier));
            this.plan.tier = tier; this.plan.items = [];
            this.addStakeBuildings();
            let kept = 0;
            old.forEach(id => { const b = this.byId(id); if (b && this.catalogue().includes(b) && this.addBuilding(id, false)) kept++; });
            this.toast(`Tier ${tier} stake: ${StakeData.slots[this.plan.kind][tier].toLocaleString()} slots. ${kept ? kept + ' building' + (kept > 1 ? 's' : '') + ' carried over at tier ' + tier + '.' : 'A stake is bought per tier, so the pad holds tier ' + tier + ' buildings.'}`);
            this.renderAll(); this.save();
        }

        setKind(kind) {
            if (!this.plan || this.plan.kind === kind) return;
            this.plan.kind = kind; this.plan.items = [];
            this.addStakeBuildings();
            this.toast(kind === 'cultivation' ? 'Cultivation stake: the cultivation hub replaces the central hub and farms unlock.' : 'Standard stake.');
            this.renderAll(); this.save();
        }

        addStakeBuildings() {
            const p = this.plan;
            const want = p.kind === 'cultivation' ? 'cultivation_hub' : 'central_hub';
            const hub = StakeData.buildings.find(b => b.comesWithStake && b.tier === p.tier && kindOf(b) === want && this.planetOK(b));
            if (hub) p.items.push({ uid: ++this.uid, b: hub, cell: [0, 0] });
        }

        // ------------------------------------------------------------- rules
        planetGrants() {
            if (this._pgKey === this.plan.key && this._pg) return this._pg;
            const p = this.plan.planet;
            const g = new Set([CAT_TAG[p.type % 8], FACTION[Math.floor(p.type / 8)] || 'oni']);
            const deposits = new Set();
            (p.resources || []).forEach(r => { const s = slug(r.name); deposits.add(s); g.add('enables-' + s + '-extraction'); g.add('enables-' + s + '-farming'); });
            this._pg = g; this._deposits = deposits; this._pgKey = this.plan.key;
            return g;
        }
        deposits() { this.planetGrants(); return this._deposits; }
        // owner rule 2026-10-03: the central hub only yields raws this planet has a deposit of (its list is per planet TYPE)
        extOf(b) {
            const e = Object.entries(b.resourceExtractionRate || {});
            if (!b.comesWithStake || !this.plan) return e;
            const d = this.deposits();
            return e.filter(([k]) => d.has(k));
        }
        outputsOf(b) { return Object.entries(b.resourceRate || {}).filter(([, v]) => v > 0).map(([k]) => k).concat(this.extOf(b).map(([k]) => k)); }
        stakeGrants() {
            const g = new Set([this.plan.kind === 'cultivation' ? 'cultivation-stake-only' : 'standard-stake-only']);
            if (this.plan.kind === 'cultivation') g.add('organic-focused');
            if (this.plan.tier >= 3) g.add('tier-3-plus');
            return g;
        }
        planetOK(b) {
            const pg = this.planetGrants(), sg = this.stakeGrants();
            return (b.requiredTags || []).every(t => {
                if (/-t\d$/.test(t)) return true;
                if (t.endsWith('-planet') || t === 'asteroid-belt' || FACTION.includes(t)) return pg.has(t);
                if (t.endsWith('-stake-only') || t === 'organic-focused') return sg.has(t);
                return true;
            });
        }
        catalogue() {
            const k = this.plan.key + '|' + this.plan.tier + '|' + this.plan.kind;
            if (this._catKey === k) return this._cat;
            this._cat = StakeData.buildings.filter(b => b.tier === this.plan.tier && !b.comesWithStake && this.planetOK(b));
            this._catKey = k;
            return this._cat;
        }
        ctx() {
            const grants = new Set(), produced = new Set();
            this.plan.items.forEach(i => { (i.b.addedTags || []).forEach(t => grants.add(t)); (KIND_GRANTS[kindOf(i.b)] || []).forEach(t => grants.add(t)); this.outputsOf(i.b).forEach(o => produced.add(o)); });
            return { pg: this.planetGrants(), sg: this.stakeGrants(), grants, produced, deposits: this.deposits() };
        }
        status(b, ctx) {
            const missing = []; let chain = false;
            for (const t of b.requiredTags || []) {
                if (/-t\d$/.test(t)) continue;
                if (ctx.pg.has(t) || ctx.sg.has(t) || ctx.grants.has(t)) continue;
                let m;
                if ((m = /^enables-(.+)-processing$/.exec(t))) {
                    const ins = StakeData.inputs(b);
                    const bad = ins.filter(x => !ctx.deposits.has(x) && !ctx.produced.has(x));
                    if (bad.length) missing.push({ tag: t, text: 'needs ' + bad.map(x => StakeData.resName(x)).join(' + ') + ' on this planet' });
                    else if (ins.some(x => !ctx.deposits.has(x))) chain = true;
                    continue;
                }
                if ((m = /^enables-(.+)-(extraction|farming)$/.exec(t))) { missing.push({ tag: t, text: 'no ' + StakeData.resName(m[1]) + ' deposit here' }); continue; }
                if (HUB_FOR[t]) { missing.push({ tag: t, hub: HUB_FOR[t], text: 'needs a ' + KIND_LABEL[HUB_FOR[t]] }); continue; }
                if (t === 'tier-3-plus') { missing.push({ tag: t, text: 'needs a tier 3+ stake' }); continue; }
                if (t.startsWith('enables-')) { missing.push({ tag: t, text: 'needs the central hub' }); continue; }
                missing.push({ tag: t, text: 'needs ' + t });
            }
            const hubs = [...new Set(missing.filter(x => x.hub).map(x => x.hub))];
            return { ok: !missing.length, chain, missing, hubs, hard: missing.some(x => !x.hub) };
        }

        compute() {
            const p = this.plan, bs = p.items.map(i => i.b);
            const slotsMax = StakeData.slots[p.kind][p.tier];
            const sum = f => bs.reduce((a, b) => a + (f(b) || 0), 0);
            const prod = {}, cons = {}, cost = {};
            bs.forEach(b => {
                this.extOf(b).forEach(([k, v]) => { prod[k] = (prod[k] || 0) + v; });
                Object.entries(b.resourceRate || {}).forEach(([k, v]) => { if (v > 0) prod[k] = (prod[k] || 0) + v; else cons[k] = (cons[k] || 0) + -v; });
                Object.entries(b.constructionCost || {}).forEach(([k, v]) => { cost[k] = (cost[k] || 0) + v; });
            });
            const keys = [...new Set([...Object.keys(prod), ...Object.keys(cons)])];
            const ledger = keys.map(k => ({ id: k, name: StakeData.resName(k), prod: prod[k] || 0, cons: cons[k] || 0, net: (prod[k] || 0) - (cons[k] || 0), passive: !!(prod[k] && !bs.some(b => kindOf(b) !== 'central_hub' && kindOf(b) !== 'cultivation_hub' && ((b.resourceExtractionRate || {})[k] || ((b.resourceRate || {})[k] > 0)))) }))
                .sort((a, b) => Math.abs(b.net) - Math.abs(a.net) || a.name.localeCompare(b.name));
            const v = {
                slotsUsed: sum(b => b.slots), slotsMax, power: sum(b => b.power), powerIn: sum(b => Math.max(0, b.power)), powerOut: sum(b => Math.max(0, -b.power)),
                crewSlots: sum(b => b.crewSlots), crewNeeded: sum(b => b.neededCrew), storage: sum(b => b.storage), time: sum(b => b.constructionTime),
                cost: Object.entries(cost).sort((a, b) => b[1] - a[1]), ledger, fuel: cons.fuel || 0
            };
            v.slotsOk = v.slotsUsed <= slotsMax; v.powerOk = v.power >= 0; v.crewOk = v.crewNeeded <= v.crewSlots;
            v.valid = v.slotsOk && v.powerOk && v.crewOk;
            return v;
        }

        buildOrder() {
            const rank = i => (BUILD_RANK[kindOf(i.b)] != null ? BUILD_RANK[kindOf(i.b)] : 3);
            return this.plan.items.slice().sort((a, b) => rank(a) - rank(b) || a.uid - b.uid);
        }

        // ------------------------------------------------------------ mutate
        addBuilding(id, announce) {
            if (!this.plan) { this.toast('Pick a planet first.'); return false; }
            const b = this.byId(id); if (!b) return false;
            const st = this.status(b, this.ctx());
            if (st.hard) { this.toast(`${b.name}: ${st.missing.filter(x => !x.hub).map(x => x.text).join('; ')}.`, 'bad'); return false; }
            const added = [];
            for (const hubKind of st.hubs) {
                const hub = this.catalogue().find(x => kindOf(x) === hubKind && this.status(x, this.ctx()).ok);
                if (!hub) { this.toast(`${b.name} needs a ${KIND_LABEL[hubKind]}, and none fits this stake.`, 'bad'); return false; }
                if (!this.place(hub)) return false;
                added.push(hub.name);
            }
            if (!this.place(b)) return false;
            if (announce) {
                if (window.spaceSounds) window.spaceSounds.success();
                this.toast(added.length ? `Added ${b.name} with ${added.join(' and ')}.` : `Added ${b.name}.`, st.chain ? 'warn' : 'ok');
            }
            this.renderAll(); this.save();
            return true;
        }

        place(b) {
            const v = this.compute();
            const slots = v.slotsUsed + (b.slots || 0), max = v.slotsMax;
            if (slots > max) { this.toast(`No room: ${b.name} needs ${b.slots} slots, ${(max - v.slotsUsed).toLocaleString()} left on this tier ${this.plan.tier} stake.`, 'bad'); return false; }
            const item = { uid: ++this.uid, b, cell: null };
            item.cell = this.findCell(item);
            if (!item.cell) { this.toast('The pad is full.', 'bad'); return false; }
            this.plan.items.push(item);
            this.lastAdded = item.uid;
            return true;
        }

        findCell(item) {
            const used = new Set(this.plan.items.filter(i => i.cell).map(i => i.cell.join(',')));
            const free = c => !used.has(c.join(','));
            const kind = kindOf(item.b);
            if (HUB_CELL[kind] && free(HUB_CELL[kind])) return HUB_CELL[kind];
            let anchor = [0, 0];
            const parentKind = PARENT_HUB[kind] || kind;
            const parent = this.plan.items.find(i => kindOf(i.b) === parentKind && i.cell);
            if (parent) anchor = parent.cell; else if (HUB_CELL[parentKind]) anchor = HUB_CELL[parentKind];
            const [ax, ay] = toScreen(anchor[0], anchor[1]);
            let best = null, bestD = Infinity;
            SPIRAL.forEach(c => {
                if (!free(c)) return;
                if (c[0] === 0 && c[1] === 0) return;
                const [x, y] = toScreen(c[0], c[1]);
                const d = Math.hypot(x - ax, (y - ay) / SQ) + 0.25 * Math.hypot(x - CX, (y - CY) / SQ);
                if (d < bestD) { bestD = d; best = c; }
            });
            return best;
        }

        removeItem(uid) {
            const i = this.plan.items.findIndex(x => x.uid === uid);
            if (i < 0) return;
            if (this.plan.items[i].b.comesWithStake) { this.toast('The hub comes with the stake and cannot be removed.', 'bad'); return; }
            const b = this.plan.items[i].b;
            this.plan.items.splice(i, 1);
            if (window.spaceSounds) window.spaceSounds.deselect();
            this.toast(`Removed ${b.name}.`);
            this.renderAll(); this.save();
        }

        clear() {
            if (!this.plan) return;
            this.plan.items = this.plan.items.filter(i => i.b.comesWithStake);
            this.stopSequence(); this.hideTip();
            this.renderAll(); this.save();
        }

        save() {
            try {
                if (!this.plan) return;
                localStorage.setItem(STORE_KEY, JSON.stringify({ key: this.plan.key, tier: this.plan.tier, kind: this.plan.kind, ids: this.plan.items.filter(i => !i.b.comesWithStake).map(i => i.b.id) }));
            } catch (e) { /* storage is a convenience only */ }
        }
        restore() {
            try {
                const s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
                if (!s || !s.key) return;
                const p = StakeData.planets.find(x => x.key === s.key);
                if (!p || p.cat === 3) return;
                this.plan = { key: s.key, system: p.system, planet: p.planet, index: p.index, tier: s.tier || 1, kind: s.kind || 'standard', items: [] };
                this.addStakeBuildings();
                (s.ids || []).forEach(id => { if (this.byId(id)) this.addBuilding(id, false); });
                this.renderPlanetList();
            } catch (e) { /* ignore a bad save */ }
        }

        // ------------------------------------------------------------ render
        renderAll() { this.renderPlanetCard(); this.renderStake(); this.renderGauges(); this.renderPad(); this.renderCharts(); this.renderCatalogue(); }

        renderPlanetCard() {
            const el = this.$('sbPlanetCard');
            if (!this.plan) { el.innerHTML = `<div class="sb-pc-empty">No planet selected</div>`; return; }
            const p = this.plan.planet, s = this.plan.system, cat = p.type % 8, fac = FACTION[Math.floor(p.type / 8)] || 'oni';
            const sphere = window.Orrery ? Orrery.planetSphereHTML(p, 84) : `<i class="pdot big" style="--c:${CAT_COLOR[cat]}"></i>`;
            const deps = (p.resources || []).slice().sort((a, b) => (StakeData.resTier(slug(a.name)) || 9) - (StakeData.resTier(slug(b.name)) || 9) || a.name.localeCompare(b.name));
            el.innerHTML = `
                <div class="sb-pc-visual">${sphere}</div>
                <div class="sb-pc-body">
                    <div class="sb-pc-name">${esc(p.name || 'Planet ' + (this.plan.index + 1))}</div>
                    <div class="sb-pc-sub"><em class="f-${fac}">${FACTION_LABEL[fac]}</em> ${esc(CAT_NAME[cat])} &middot; ${esc(s.name || s.key)}${s.starbase && s.starbase.tier ? ' &middot; starbase T' + s.starbase.tier : ''}${s.closestFaction ? ' &middot; ' + esc(s.closestFaction) + ' territory' : ''}</div>
                    <div class="rtags" id="sbDeposits">${deps.map(r => { const k = slug(r.name), t = StakeData.resTier(k), mx = StakeData.maxRich.get(k) || 1; return `<span class="rtag" data-res="${esc(k)}" title="${esc(r.name)} richness ${r.richness} (best anywhere ${mx})">${t ? `<i class="t t${t}">T${t}</i>` : '<i></i>'}<span class="rname">${esc(r.name)}</span><span class="rbar"><i style="width:${Math.round(100 * Math.min(1, r.richness / mx))}%"></i></span><span class="rval">${r.richness}</span></span>`; }).join('')}</div>
                </div>`;
        }

        renderStake() {
            const el = this.$('sbStake');
            if (!this.plan) { el.innerHTML = ''; return; }
            const p = this.plan;
            el.innerHTML = `
                <div class="sb-kind">${['standard', 'cultivation'].map(k => `<button type="button" class="chip${p.kind === k ? ' on' : ''}" data-kind="${k}">${k === 'standard' ? 'Standard stake' : 'Cultivation stake'}</button>`).join('')}</div>
                <div class="sb-tiers">${[1, 2, 3, 4, 5].map(t => `<button type="button" class="sb-tier${p.tier === t ? ' on' : ''}" data-tier="${t}"><b>T${t}</b><span>${StakeData.slots[p.kind][t].toLocaleString()}</span><small>slots</small></button>`).join('')}</div>
                <div class="sb-rule">A stake is bought per tier and holds tier ${p.tier} buildings. The ${p.kind === 'cultivation' ? 'cultivation' : 'central'} hub comes with it.</div>`;
        }

        gauge(label, used, max, ok, unit, hint) {
            const f = max > 0 ? Math.min(1, used / max) : (used > 0 ? 1 : 0);
            const C = 2 * Math.PI * 27, arc = C * 0.75;
            const cls = !ok ? 'bad' : (f > 0.85 ? 'warn' : 'ok');
            return `<div class="sb-gauge ${cls}" title="${esc(hint || '')}">
                <svg viewBox="0 0 64 64" width="64" height="64"><circle class="track" cx="32" cy="32" r="27" stroke-dasharray="${arc} ${C}" transform="rotate(135 32 32)"/><circle class="val" cx="32" cy="32" r="27" stroke-dasharray="${arc} ${C}" stroke-dashoffset="${arc * (1 - f)}" transform="rotate(135 32 32)"/></svg>
                <div class="sb-gauge-text"><b>${esc(used.toLocaleString())}</b><span>/ ${esc(max.toLocaleString())}${unit || ''}</span></div>
                <div class="sb-gauge-label">${esc(label)}</div>
            </div>`;
        }

        renderGauges() {
            const el = this.$('sbGauges');
            if (!this.plan) { el.innerHTML = ''; return; }
            const v = this.compute();
            el.innerHTML = this.gauge('Slots', v.slotsUsed, v.slotsMax, v.slotsOk, '', 'Building slots used on this stake')
                + this.gauge('Power', v.powerOut, v.powerIn, v.powerOk, '', `Power drawn / generated (net ${v.power >= 0 ? '+' : ''}${v.power})`)
                + this.gauge('Crew', v.crewNeeded, v.crewSlots, v.crewOk, '', 'Crew needed / crew housed');
        }

        renderPad() {
            const tiles = this.$('sbTiles'), flow = this.root.querySelector('.sb-flow'), empty = this.$('sbEmpty');
            const stage = this.$('sbStage');
            stage.classList.toggle('reduced', !!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
            if (!this.plan) { tiles.innerHTML = ''; flow.innerHTML = ''; empty.hidden = false; this.$('sbPadTitle').textContent = 'Stake pad'; this.$('sbPadSub').textContent = ''; return; }
            empty.hidden = true;
            const p = this.plan, cat = p.planet.type % 8;
            stage.style.setProperty('--pad-tint', CAT_COLOR[cat]);
            this.$('sbPadTitle').textContent = `${p.planet.name || 'Planet'} · tier ${p.tier} ${p.kind === 'cultivation' ? 'cultivation' : 'claim'} stake`;
            this.$('sbPadSub').textContent = `${p.items.length} building${p.items.length === 1 ? '' : 's'}`;
            const unit = T.unit(), [ax, ay] = T.anchor(), s = R / unit;
            const seen = new Set(this.plan.items.map(i => i.uid));
            // keep existing tile nodes (so the drop animation only plays for new ones), remove the gone, add the new
            tiles.querySelectorAll('[data-uid]').forEach(n => { if (!seen.has(+n.dataset.uid)) n.remove(); });
            p.items.forEach(it => {
                if (!it.cell) return;
                const [x, y] = toScreen(it.cell[0], it.cell[1]);
                const kind = kindOf(it.b), [w, h] = T.size(kind);
                let n = tiles.querySelector(`[data-uid="${it.uid}"]`);
                if (!n) {
                    n = document.createElement('div');
                    n.className = `tile k-${kind}${it.uid === this.lastAdded ? ' drop' : ''}`;
                    n.dataset.uid = it.uid;
                    n.innerHTML = `<img src="${T.url(kind)}" alt="" draggable="false"><span class="tile-tag">${esc(it.b.name)}</span>`;
                    tiles.appendChild(n);
                }
                n.style.left = (x - ax * s) + 'px'; n.style.top = (y - ay * s) + 'px'; n.style.width = (w * s) + 'px'; n.style.height = (h * s) + 'px';
                n.style.zIndex = 10 + Math.round(y);
            });
            this.lastAdded = null;
            // resource chains: producer -> consumer; hubs -> central hub (faint)
            const pos = new Map(p.items.filter(i => i.cell).map(i => [i.uid, toScreen(i.cell[0], i.cell[1])]));
            const paths = [];
            const centre = p.items.find(i => i.b.comesWithStake);
            p.items.forEach(i => {
                const k = kindOf(i.b);
                if (centre && i !== centre && KIND_GROUP[k] === 'hubs') { const [x1, y1] = pos.get(i.uid), [x2, y2] = pos.get(centre.uid); paths.push(`<path class="hub" d="M${x1} ${y1} L${x2} ${y2}"/>`); }
                if (k !== 'processor') return;
                StakeData.inputs(i.b).forEach(res => {
                    p.items.forEach(src => {
                        if (src === i || !StakeData.outputs(src.b).includes(res) || src.b.comesWithStake) return;
                        const [x1, y1] = pos.get(src.uid), [x2, y2] = pos.get(i.uid);
                        const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 28;
                        paths.push(`<path class="flow c-${esc(StakeData.resCat(res) || 'raw')}" d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}"><title>${esc(StakeData.resName(res))}: ${esc(src.b.name)} → ${esc(i.b.name)}</title></path>`);
                    });
                });
            });
            flow.innerHTML = paths.join('');
            // mark the cells that hold a building
            const used = new Set(p.items.filter(i => i.cell).map(i => i.cell.join(',')));
            this.root.querySelectorAll('.sb-grid .cell').forEach(c => c.classList.toggle('used', used.has(c.dataset.q + ',' + c.dataset.r)));
            this.fit && this.fit();
        }

        fmtTime(sec) {
            if (!sec) return '0';
            if (sec < 60) return sec + ' s';
            const m = Math.round(sec / 60);
            if (m < 60) return m + ' min';
            const h = Math.floor(m / 60), mm = m % 60;
            return h + ' h' + (mm ? ' ' + mm + ' min' : '');
        }

        renderCatalogue() {
            const list = this.$('sbCatList'), count = this.$('sbCatCount');
            if (!this.plan) { list.innerHTML = '<p class="sb-muted">Pick a planet to see what can be built there.</p>'; count.textContent = ''; return; }
            const ctx = this.ctx();
            const q = this.cat.q, g = this.cat.group;
            let rows = this.catalogue().map(b => ({ b, kind: kindOf(b), st: this.status(b, ctx) }));
            if (g !== 'all') rows = rows.filter(r => KIND_GROUP[r.kind] === g);
            if (q) rows = rows.filter(r => r.b.name.toLowerCase().includes(q) || StakeData.outputs(r.b).some(o => StakeData.resName(o).toLowerCase().includes(q)) || StakeData.inputs(r.b).some(o => StakeData.resName(o).toLowerCase().includes(q)));
            const rank = r => (r.st.ok ? (r.st.chain ? 1 : 0) : (r.st.hard ? 3 : 2));
            rows.sort((a, b) => rank(a) - rank(b) || (KIND_GROUP[a.kind] === 'hubs' ? -1 : 0) - (KIND_GROUP[b.kind] === 'hubs' ? -1 : 0) || a.b.name.localeCompare(b.b.name));
            const placed = new Map(); this.plan.items.forEach(i => placed.set(i.b.id, (placed.get(i.b.id) || 0) + 1));
            count.textContent = `${rows.length} of ${this.catalogue().length}`;
            list.innerHTML = rows.length ? rows.map(r => {
                const b = r.b, st = r.st;
                const cls = st.ok ? (st.chain ? 'chain' : 'ok') : (st.hard ? 'locked' : 'hub');
                const ins = StakeData.inputs(b), outs = StakeData.outputs(b);
                let line = '';
                if (r.kind === 'extractor' || r.kind === 'farm') line = Object.entries(b.resourceExtractionRate || {}).map(([k, v]) => `+${num(v)} ${esc(StakeData.resName(k))}`).join(', ');
                else if (r.kind === 'processor') line = `${ins.map(k => esc(StakeData.resName(k))).join(' + ')} &rarr; ${outs.map(k => esc(StakeData.resName(k))).join(', ')}`;
                else if (b.storage) line = `${b.storage.toLocaleString()} storage`;
                else if (b.crewSlots) line = `houses ${b.crewSlots} crew`;
                else if (b.power > 0) line = `+${b.power} power`;
                const why = st.ok ? (st.chain ? 'input made on this stake (chain not verified in game)' : '') : st.missing.map(x => x.text).join('; ');
                const n = placed.get(b.id) || 0;
                return `<div class="sb-bcard ${cls}" data-id="${esc(b.id)}" data-res="${esc(outs.concat(ins).join(' '))}">
                    ${T.thumbHTML(r.kind)}
                    <div class="sb-bbody">
                        <div class="sb-bhead"><span class="nm">${esc(b.name)}</span>${n ? `<span class="placed">&times;${n}</span>` : ''}</div>
                        <div class="sb-bstats"><span>&#x25A3; ${b.slots}</span><span class="${b.power < 0 ? 'neg' : 'pos'}">&#x26A1; ${b.power > 0 ? '+' : ''}${b.power}</span><span>&#x1F465; ${b.neededCrew || 0}${b.crewSlots ? '/' + b.crewSlots : ''}</span></div>
                        ${line ? `<div class="sb-bline">${line}</div>` : ''}
                        ${why ? `<div class="sb-bwhy">${esc(why)}</div>` : ''}
                    </div>
                    <button type="button" class="sb-add" data-add="${esc(b.id)}" ${st.hard ? 'disabled' : ''} title="${st.hubs.length ? 'Adds the ' + st.hubs.map(h => KIND_LABEL[h]).join(' and ') + ' first' : 'Add to the pad'}">${st.hubs.length ? '+ hub' : '+'}</button>
                </div>`;
            }).join('') : '<p class="sb-muted">Nothing matches.</p>';
        }

        hotDeposits(b) {
            const want = new Set(b ? StakeData.inputs(b).concat(this.extOf(b).map(([k]) => k)) : []);
            this.root.querySelectorAll('#sbDeposits .rtag').forEach(t => t.classList.toggle('hot', want.has(t.dataset.res)));
        }

        // -------------------------------------------------------------- tip
        showTip(id, x, y, item) {
            const b = this.byId(id); if (!b) return;
            const tip = this.$('sbTip'), kind = kindOf(b);
            const st = this.plan ? this.status(b, this.ctx()) : { ok: false, missing: [], hubs: [], hard: true };
            const rows = [['Tier', 'T' + b.tier], ['Slots', b.slots], ['Power', (b.power > 0 ? '+' : '') + b.power], ['Crew needed', b.neededCrew || 0], ['Crew housed', b.crewSlots || 0], ['Storage', (b.storage || 0).toLocaleString()], ['Build time', b.constructionTime ? this.fmtTime(b.constructionTime) : 'with stake']];
            const ext = this.extOf(b), rate = Object.entries(b.resourceRate || {});
            tip.innerHTML = `
                <button type="button" class="sb-tip-x" data-tip="close" aria-label="Close">&times;</button>
                <div class="sb-tip-head">${T.thumbHTML(kind, 'tile-thumb lg')}<div><b>${esc(b.name)}</b><span>${esc(KIND_LABEL[kind])}${b.comesWithStake ? ' · comes with the stake' : ''}</span></div></div>
                <div class="sb-tip-grid">${rows.map(([k, v]) => `<span>${k}</span><b>${esc(String(v))}</b>`).join('')}</div>
                ${ext.length ? `<div class="sb-tip-sec"><h5>Extracts / tick</h5>${ext.map(([k, v]) => `<span class="pos">+${num(v)} ${esc(StakeData.resName(k))}</span>`).join('')}</div>` : ''}
                ${rate.length ? `<div class="sb-tip-sec"><h5>Rates / tick</h5>${rate.map(([k, v]) => `<span class="${v < 0 ? 'neg' : 'pos'}">${v > 0 ? '+' : ''}${num(v)} ${esc(StakeData.resName(k))}</span>`).join('')}</div>` : ''}
                ${Object.keys(b.constructionCost || {}).length ? `<div class="sb-tip-sec"><h5>Construction cost</h5>${Object.entries(b.constructionCost).map(([k, v]) => `<span>${v} ${esc(StakeData.resName(k))}</span>`).join('')}</div>` : ''}
                ${!item && !st.ok ? `<div class="sb-tip-why">${esc(st.missing.map(m => m.text).join('; '))}</div>` : ''}
                <div class="sb-tip-actions">
                    ${item ? (item.b.comesWithStake ? '' : `<button type="button" class="sb-btn danger" data-tip="remove" data-uid="${item.uid}">Remove</button>`) : `<button type="button" class="sb-btn" data-tip="add" data-id="${esc(b.id)}" ${st.hard ? 'disabled' : ''}>${st.hubs.length ? 'Add with ' + st.hubs.map(h => KIND_LABEL[h]).join(' + ') : 'Add to pad'}</button>`}
                    <button type="button" class="sb-btn ghost" data-tip="recipe" data-name="${esc(b.name)}" data-tier="${b.tier}">Recipe</button>
                </div>`;
            tip.hidden = false;
            const w = tip.offsetWidth, h = tip.offsetHeight;
            tip.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, x + 12)) + 'px';
            tip.style.top = Math.max(8, Math.min(window.innerHeight - h - 8, y + 12)) + 'px';
            if (window.spaceSounds) window.spaceSounds.openPopup();
        }
        hideTip() { const tip = this.$('sbTip'); if (tip && !tip.hidden) { tip.hidden = true; } }

        toast(msg, cls) {
            const t = this.$('sbToast');
            t.textContent = msg; t.className = 'sb-toast ' + (cls || ''); t.hidden = false;
            clearTimeout(this._toastT); this._toastT = setTimeout(() => { t.hidden = true; }, 3800);
        }

        // ------------------------------------------------- construction sequence
        construct() {
            if (!this.plan) { this.toast('Pick a planet first.'); return; }
            const v = this.compute();
            if (!v.valid) { this.toast('Fix the plan first: ' + [!v.slotsOk ? 'slots' : '', !v.powerOk ? 'power' : '', !v.crewOk ? 'crew' : ''].filter(Boolean).join(', ') + ' over the limit.', 'bad'); return; }
            if (this.plan.items.length < 2) { this.toast('Add at least one building to construct.'); return; }
            this.stopSequence(); this.hideTip();
            if (window.spaceSounds) window.spaceSounds.scan();
            const order = this.buildOrder(), total = Math.max(1, v.time);
            const stage = this.$('sbStage'), strip = this.$('sbStrip'), tiles = this.$('sbTiles');
            const reduced = stage.classList.contains('reduced');
            stage.classList.add('building');
            tiles.querySelectorAll('.tile').forEach(n => n.classList.add('ghost'));
            strip.hidden = false;
            const steps = order.map(i => ({ i, ms: reduced ? 120 : Math.max(380, Math.min(1900, 9000 * (i.b.constructionTime || 0) / total)) + 250 }));
            let k = 0, elapsed = 0;
            const seq = this.sequence = { timer: null, done: false };
            const step = () => {
                if (seq !== this.sequence) return;
                if (k >= steps.length) {
                    strip.innerHTML = `<div class="sb-strip-done"><b>Facility online</b><span>${order.length} buildings · ${this.fmtTime(v.time)} · ${v.slotsUsed.toLocaleString()} of ${v.slotsMax.toLocaleString()} slots · power ${v.power >= 0 ? '+' : ''}${v.power} · crew ${v.crewNeeded}/${v.crewSlots}</span><button type="button" class="sb-btn ghost" data-stop>Close</button></div>`;
                    strip.querySelector('[data-stop]').addEventListener('click', () => this.stopSequence());
                    stage.classList.remove('building'); stage.classList.add('online');
                    if (window.spaceSounds) window.spaceSounds.success();
                    seq.done = true;
                    return;
                }
                const { i, ms } = steps[k];
                const n = tiles.querySelector(`[data-uid="${i.uid}"]`);
                if (n) { n.classList.remove('ghost'); n.classList.add('rise'); n.style.setProperty('--ms', ms + 'ms'); }
                elapsed += i.b.constructionTime || 0;
                strip.innerHTML = `<div class="sb-strip-row"><span class="st">${k + 1} / ${steps.length}</span><b>${esc(i.b.name)}</b><span class="tm">${i.b.constructionTime ? this.fmtTime(i.b.constructionTime) : 'with stake'}</span><span class="el">elapsed ${this.fmtTime(elapsed)}</span></div><div class="sb-strip-bar"><i style="width:${Math.round(100 * (k + 1) / steps.length)}%"></i></div>`;
                k++;
                seq.timer = setTimeout(step, ms);
            };
            step();
        }
        stopSequence() {
            if (!this.sequence) return;
            clearTimeout(this.sequence.timer); this.sequence = null;
            const stage = this.$('sbStage'); stage.classList.remove('building', 'online');
            this.$('sbTiles').querySelectorAll('.tile').forEach(n => { n.classList.remove('ghost', 'rise'); });
            this.$('sbStrip').hidden = true;
        }

        // ------------------------------------------------------------ charts
        // Plain HTML bars in the page's own style (no Chart.js): thin marks, rounded data ends, 2 px gaps between
        // stacked segments, one hue for nominal series, a warm/cool pair with a neutral axis for signed values,
        // kind colours (validated for CVD) for identity, hover tooltips on every mark, values in text tokens.
        renderCharts() {
            const el = this.$('sbCharts');
            if (!this.plan) { el.innerHTML = ''; return; }
            const v = this.compute(), items = this.plan.items, order = this.buildOrder();
            const KC = { central_hub: 'hub', cultivation_hub: 'hub', extraction_hub: 'hub', processing_hub: 'hub', storage_hub: 'hub', farm_hub: 'hub', power_plant: 'hub', crew_quarters: 'hub', extractor: 'extractor', processor: 'processor', storage_module: 'storage', farm: 'farm' };
            const kc = b => KC[kindOf(b)] || 'hub';
            const legend = `<div class="ch-legend">${[['hub', 'Hubs & support'], ['extractor', 'Extractors'], ['processor', 'Processors'], ['storage', 'Storage'], ['farm', 'Farms']].map(([k, n]) => `<span><i class="c-${k}"></i>${n}</span>`).join('')}</div>`;
            const short = n => n.replace(/^(Ice Giant|Gas Giant|Terrestrial|Volcanic|Barren|Dark|Oceanic) /, '');
            const tip = t => `<span class="ct">${esc(t)}</span>`;

            // 1. power budget: generation right (cool), draw left (warm), one row per building
            const pmax = Math.max(1, ...items.map(i => Math.abs(i.b.power || 0)));
            const prow = items.slice().sort((x, y) => Math.abs(y.b.power || 0) - Math.abs(x.b.power || 0)).map(i => {
                const pw = i.b.power || 0, w = Math.abs(pw) / pmax * 50;
                return `<div class="ch-row"><span class="ch-lbl">${esc(short(i.b.name))}</span><div class="ch-div"><i class="axis"></i>${pw < 0 ? `<b class="neg" style="right:50%;width:${w}%">${tip(short(i.b.name) + ' draws ' + -pw)}</b>` : `<b class="pos" style="left:50%;width:${w}%">${tip(short(i.b.name) + ' generates +' + pw)}</b>`}</div><span class="ch-val ${pw < 0 ? 'neg' : 'pos'}">${pw > 0 ? '+' : ''}${pw}</span></div>`;
            }).join('');
            const power = `<div class="sb-card ch half"><h4>Power budget <span>net ${v.power >= 0 ? '+' : ''}${v.power}</span></h4><div class="ch-key"><span><i class="k-neg"></i>draw ${v.powerOut}</span><span><i class="k-pos"></i>generation ${v.powerIn}</span></div>${prow}</div>`;

            // 2. slots and crew: stacked by kind over the stake's limits
            const byKind = key => { const m = {}; items.forEach(i => { const k = kc(i.b); m[k] = (m[k] || 0) + (i.b[key] || 0); }); return Object.entries(m).filter(([, n]) => n > 0); };
            const stack = (title, parts, max, unit) => {
                const total = parts.reduce((a, [, n]) => a + n, 0), over = total > max, span = Math.max(max, total);
                return `<div class="ch-stack"><div class="ch-stack-head"><span>${title}</span><b class="${over ? 'neg' : ''}">${total.toLocaleString()} / ${max.toLocaleString()}${unit}</b></div><div class="ch-track">${parts.map(([k, n]) => `<b class="c-${k}" style="width:${n / span * 100}%">${tip(k + ': ' + n.toLocaleString())}</b>`).join('')}${over ? '' : `<i class="cap" style="left:${max / span * 100}%"></i>`}</div></div>`;
            };
            const slots = `<div class="sb-card ch half"><h4>Slots and crew <span>tier ${this.plan.tier}</span></h4>${stack('Slots used', byKind('slots'), v.slotsMax, '')}${stack('Crew needed', byKind('neededCrew'), v.crewSlots, ' housed')}${legend}</div>`;

            // 3. build timeline: sequential gantt in build order
            let cum = 0; const T = Math.max(1, v.time);
            const trow = order.map(i => { const d = i.b.constructionTime || 0, x = cum / T * 100, w = Math.max(0.6, d / T * 100); cum += d; return `<div class="ch-row"><span class="ch-lbl">${esc(short(i.b.name))}</span><div class="ch-gantt"><b class="c-${kc(i.b)}" style="left:${x}%;width:${w}%">${tip(short(i.b.name) + ': ' + (d ? this.fmtTime(d) : 'with the stake') + ', done at ' + this.fmtTime(cum))}</b></div><span class="ch-val">${d ? this.fmtTime(d) : '–'}</span></div>`; }).join('');
            const ticks = [0, 0.5, 1].map(f => `<span style="left:${f * 100}%">${this.fmtTime(Math.round(T * f))}</span>`).join('');
            const timeline = `<div class="sb-card ch"><h4>Build timeline <span>${this.fmtTime(v.time)} sequential</span></h4>${trow}<div class="ch-row"><span class="ch-lbl"></span><div class="ch-axis">${ticks}</div><span class="ch-val"></span></div><div class="sb-verdict ${v.valid ? 'ok' : 'bad'}">${v.valid ? 'Plan is valid: slots, power and crew all fit.' : [!v.slotsOk ? `slots over by ${(v.slotsUsed - v.slotsMax).toLocaleString()}` : '', !v.powerOk ? `power short by ${(-v.power).toLocaleString()}` : '', !v.crewOk ? `crew short by ${v.crewNeeded - v.crewSlots}` : ''].filter(Boolean).join(' · ')}</div></div>`;

            // 4. production net per resource: positive right (cool), negative left (warm)
            // the central hub extracts every raw its planet type lists, passively, from the moment the stake exists - shown by default
            const led = v.ledger.filter(r => !r.passive).concat(v.ledger.filter(r => r.passive));
            const nPassive = v.ledger.filter(r => r.passive).length;
            const hubTag = r => r.passive ? '<i class="hubt" title="Passive output of the central hub (only raws this planet has a deposit of)">HUB</i>' : '';
            const nmax = Math.max(0.001, ...led.map(r => Math.abs(r.net)));
            const nrow = led.map(r => { const w = Math.abs(r.net) / nmax * 50; return `<div class="ch-row${r.passive ? ' passive' : ''}"><span class="ch-lbl">${hubTag(r)}${esc(r.name)}</span><div class="ch-div"><i class="axis"></i>${r.net < 0 ? `<b class="neg" style="right:50%;width:${w}%">${tip(r.name + ': made +' + num(r.prod) + ', used -' + num(r.cons))}</b>` : `<b class="pos" style="left:50%;width:${w}%">${tip(r.name + ': made +' + num(r.prod) + ', used -' + num(r.cons))}</b>`}</div><span class="ch-val ${r.net < 0 ? 'neg' : 'pos'}">${(r.net > 0 ? '+' : '') + num(r.net)}</span></div>`; }).join('');
            const prod = `<div class="sb-card ch"><h4>Net production per tick <span>${nPassive ? 'incl. ' + nPassive + ' from the central hub' : ''}</span></h4><div class="ch-key"><span><i class="k-neg"></i>deficit (haul in)</span><span><i class="k-pos"></i>surplus</span></div>${nrow || '<p class="sb-muted">Nothing is produced yet.</p>'}<p class="sb-foot">A negative net must be hauled in (or the chain runs faster than the extractor feeding it). Richness is not applied: the export has no yield formula. <b>HUB</b> rows are the central hub's passive extraction: it comes with the stake and yields, from day one, each raw its planet type lists that this planet has a deposit of.</p></div>`;

            // 5. construction materials: the bill itself - every material as one-hue bars, plus the plan totals
            const cmax = Math.max(1, ...v.cost.map(([, q]) => q));
            const crow = v.cost.map(([k, q]) => { const t = StakeData.resTier(k); return `<div class="ch-row"><span class="ch-lbl">${t ? `<i class="t t${t}">T${t}</i>` : ''}${esc(StakeData.resName(k))}</span><div class="ch-bar"><b style="width:${q / cmax * 100}%">${tip(StakeData.resName(k) + ': ' + q.toLocaleString())}</b></div><span class="ch-val">${q.toLocaleString()}</span></div>`; }).join('');
            const mats = `<div class="sb-card ch"><h4>Bill of materials <span>${v.cost.length} material${v.cost.length === 1 ? '' : 's'}</span></h4>${crow || '<p class="sb-muted">The hub comes with the stake. Add buildings to see what they cost.</p>'}
                <div class="sb-kv"><span>Build time (sequential)</span><b>${this.fmtTime(v.time)}</b></div>
                <div class="sb-kv"><span>Storage on the stake</span><b>${v.storage.toLocaleString()}</b></div>
                <div class="sb-kv"><span>Fuel burn</span><b class="${v.fuel ? 'neg' : ''}">${v.fuel ? '-' + num(v.fuel) + ' / tick' : 'none'}</b></div>
                <p class="sb-foot">Costs from buildings.json; a tier-N stake pays for tier-N buildings only. Times are the export's values read as seconds.</p></div>`;

            el.innerHTML = mats + prod + timeline + power + slots;
        }

        // ------------------------------------------------------------ export
        async exportPNG() {
            if (!this.plan) { this.toast('Pick a planet first.'); return; }
            const v = this.compute(), p = this.plan;
            const W = 1400, PADX = 40;
            const order = this.buildOrder();
            const rowsL = Math.max(v.cost.length, v.ledger.length, order.length);
            const H = 150 + STAGE_H + 60 + 24 * Math.min(rowsL, 22) + 100;
            const c = document.createElement('canvas'); c.width = W * 2; c.height = H * 2;
            const g = c.getContext('2d'); g.scale(2, 2);
            g.fillStyle = '#04060f'; g.fillRect(0, 0, W, H);
            g.fillStyle = '#4fd8ff'; g.font = '700 12px Orbitron, sans-serif'; g.fillText('AEPHIA INDUSTRIES · OPERATIONS HUB · STAKE BUILDER', PADX, 40);
            g.fillStyle = '#fff'; g.font = '700 30px Rajdhani, sans-serif'; g.fillText(`${p.planet.name || 'Planet'} · tier ${p.tier} ${p.kind} stake`, PADX, 78);
            g.fillStyle = '#b4c6ef'; g.font = '500 15px Rajdhani, sans-serif';
            g.fillText(`${p.system.name || p.system.key} · ${CAT_NAME[p.planet.type % 8]} · ${FACTION_LABEL[FACTION[Math.floor(p.planet.type / 8)] || 'oni']} · ${order.length} buildings · slots ${v.slotsUsed.toLocaleString()} / ${v.slotsMax.toLocaleString()} · power ${v.power >= 0 ? '+' : ''}${v.power} · crew ${v.crewNeeded} / ${v.crewSlots} · ${new Date().toLocaleString()}`, PADX, 104);
            // the pad
            const ox = (W - STAGE_W) / 2, oy = 130;
            g.strokeStyle = 'rgba(120,200,255,0.18)'; g.lineWidth = 1;
            SPIRAL.forEach(([q, r]) => { const [x, y] = toScreen(q, r); g.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i - 30); const px = ox + x + R * Math.cos(a), py = oy + y + R * Math.sin(a) * SQ; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.closePath(); g.stroke(); });
            const unit = T.unit(), [ax, ay] = T.anchor(), s = R / unit;
            const items = p.items.filter(i => i.cell).map(i => ({ i, xy: toScreen(i.cell[0], i.cell[1]) })).sort((a, b) => a.xy[1] - b.xy[1]);
            await Promise.all(items.map(({ i, xy }) => new Promise(res => {
                const kind = kindOf(i.b), [w, h] = T.size(kind), im = new Image();
                im.onload = () => { g.drawImage(im, ox + xy[0] - ax * s, oy + xy[1] - ay * s, w * s, h * s); res(); }; im.onerror = res; im.src = T.url(kind);
            })));
            // three columns
            const y0 = oy + STAGE_H + 40, colW = (W - PADX * 2) / 3;
            const col = (n, title, lines) => {
                const x = PADX + n * colW;
                g.fillStyle = '#4fd8ff'; g.font = '700 11px Orbitron, sans-serif'; g.fillText(title.toUpperCase(), x, y0);
                g.font = '500 14px Rajdhani, sans-serif';
                lines.slice(0, 22).forEach((l, k) => { g.fillStyle = l[2] || '#e6edf7'; g.fillText(l[0], x, y0 + 24 + k * 22); g.textAlign = 'right'; g.fillText(l[1], x + colW - 24, y0 + 24 + k * 22); g.textAlign = 'left'; });
                if (lines.length > 22) { g.fillStyle = '#64748b'; g.fillText(`+ ${lines.length - 22} more`, x, y0 + 24 + 22 * 22); }
            };
            col(0, 'Bill of materials', v.cost.map(([k, q]) => [StakeData.resName(k), q.toLocaleString()]));
            col(1, 'Production per tick', v.ledger.map(r => [r.name, (r.net > 0 ? '+' : '') + num(r.net), r.net < 0 ? '#ff8a7a' : '#7ee8a4']));
            let cum = 0;
            col(2, 'Build order', order.map((i, n) => { cum += i.b.constructionTime || 0; return [`${n + 1}. ${i.b.name}`, this.fmtTime(cum)]; }));
            g.fillStyle = '#64748b'; g.font = '500 12px Rajdhani, sans-serif'; g.fillText('Generated by the ClaimStake Explorer · costs from buildings.json · times read as seconds', PADX, H - 24);
            const a = document.createElement('a');
            const now = new Date(), ymd = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
            a.download = `stake_${slug(p.planet.name || 'planet')}_T${p.tier}_${ymd}.png`;
            a.href = c.toDataURL('image/png'); a.click();
            this.toast('PNG exported.');
        }
    }

    // ---- entry point used by app.js when the Construction tab opens
    window.initializeConstructionTab = function () {
        if (window.constructionManager) return;
        const root = document.getElementById('constructionContent');
        if (!root) return;
        window.constructionManager = new StakeBuilder(root);
    };
})();
