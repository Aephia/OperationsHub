// analytics.js - ClaimStake Explorer Analytics tab (rebuilt 2026-09-30). Three questions the export can answer:
//   1. Which stake tier to buy: what a tier-N stake holds once the hubs are up, derived from buildings.json
//      (slots per stake from claimStakeDefinitions, every hub / extractor / processor at that tier, crew binding).
//   2. Deposit atlas: where each of the 93 raw deposits sits (stakeable planets, belts, best richness, territory),
//      and whether an extractor family exists for it (six raws are fleet-mined only).
//   3. Where to stake for a recipe: expand a recipe to its raws and rank stakeable planets by coverage.
// Replaces the 2025 tier-recommendation / recipe-optimizer code, which read faction and region out of planet NAMES
// with a pattern from the old naming scheme ("004-MUD-..."); today's names ("Serene Anchorage") made every planet
// faction "SER" and region "Other", and the optimizer's faction filter then matched nothing.
(function () {
    'use strict';

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const slug = n => String(n || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const num = (v, d) => (typeof v === 'number' ? v.toLocaleString(undefined, { maximumFractionDigits: d == null ? 3 : d }) : '0');
    const CAT_NAME = ['Terrestrial', 'Volcanic', 'Barren', 'Asteroid Belt', 'Gas Giant', 'Ice Giant', 'Dark', 'Oceanic'];
    const CAT_SLUG = ['terrestrial', 'volcanic', 'barren', 'asteroid-belt', 'gas-giant', 'ice-giant', 'dark', 'oceanic'];
    const CAT_COLOR = ['#3fae79', '#e2512b', '#b7a58a', '#9a9a9a', '#d99a4e', '#7fd0ff', '#6b70b8', '#2f8cff'];
    const FAC = { MUD: 'mud', ONI: 'oni', UST: 'ustur', USTUR: 'ustur', Ustur: 'ustur' };
    const FAC_LABEL = { mud: 'MUD', oni: 'ONI', ustur: 'USTUR' };
    const facOf = s => FAC[s] || slug(s || '');

    class BuildingAnalytics {
        constructor(data) {
            this.data = data;
            this.filters = { tierType: 0, atlasQ: '', atlasSort: 'planets', recipeFactions: new Set(), recipeQ: '' };
            this.recipe = null;
            this.prepared = false;
        }

        // ---------------------------------------------------------------- data
        prepare() {
            if (this.prepared) return;
            const SD = window.StakeData; SD.init();
            this.SD = SD;
            this.buildings = SD.buildings;
            this.byId = new Map(this.buildings.map(b => [b.id, b]));
            this.regions = new Map(((window.planetData && window.planetData.regionDefinitions) || []).map(r => [r.id, r]));
            // stakeable planets with territory + region
            this.planets = SD.planets.filter(p => p.cat !== 3).map(p => {
                const s = p.system, reg = this.regions.get(s.regionId);
                const names = new Set((p.planet.resources || []).map(r => slug(r.name)));
                const rich = new Map((p.planet.resources || []).map(r => [slug(r.name), r.richness]));
                return Object.assign({ territory: facOf(s.closestFaction || s.faction), region: reg ? reg.name : 'unknown', risk: reg ? (typeof reg.risk_zone === 'string' ? 'medium' : 'safe') : '', names, rich }, p);
            });
            // deposit atlas
            const ext = new Set(this.buildings.filter(b => (b.addedTags || []).includes('extractor')).map(b => b.id.replace(/-extractor-t\d$/, '')));
            const atlas = new Map();
            SD.planets.forEach(p => {
                const belt = p.cat === 3, s = p.system, terr = facOf(s.closestFaction || s.faction);
                (p.planet.resources || []).forEach(r => {
                    const k = slug(r.name);
                    let d = atlas.get(k);
                    if (!d) { d = { id: k, name: r.name, tier: SD.resTier(k) || 0, planets: 0, belts: 0, best: 0, fac: { mud: 0, oni: 0, ustur: 0 }, extractor: ext.has(k), top: [] }; atlas.set(k, d); }
                    if (belt) d.belts++; else { d.planets++; d.fac[terr] = (d.fac[terr] || 0) + 1; d.top.push({ key: p.key, name: p.planet.name, system: s.name || s.key, terr, cat: p.cat, richness: r.richness }); }
                    if (r.richness > d.best) d.best = r.richness;
                });
            });
            atlas.forEach(d => { d.top.sort((a, b) => b.richness - a.richness || a.name.localeCompare(b.name)); d.top = d.top.slice(0, 10); const e = this.byId.get(d.id + '-extractor-t1'); d.rate = e ? Object.values(e.resourceExtractionRate || {})[0] : null; });
            this.atlas = Array.from(atlas.values());
            // recipes: one recipe per output name (live status first), ingredients by name
            const recs = (window.rawRecipeData && window.rawRecipeData.recipes) || [];
            const rank = { v1: 0, 'v1-add': 1, v2: 2 };
            this.recipeByName = new Map();
            recs.forEach(r => { const cur = this.recipeByName.get(r.outputName); if (!cur || (rank[r.c4_status] ?? 3) < (rank[cur.c4_status] ?? 3)) this.recipeByName.set(r.outputName, r); });
            this.recipeNames = Array.from(this.recipeByName.keys()).sort();
            this.rawByName = new Map(this.atlas.map(d => [d.name, d]));
            this.resByName = new Map(Array.from(SD.res.values()).map(r => [r.name, r]));
            this.prepared = true;
        }

        // raws behind an output name (deterministic: the recipe map above), plus every intermediate
        expand(name) {
            const raws = new Map(), mids = [], seen = new Set();
            const walk = (n, depth) => {
                if (seen.has(n) || depth > 12) return; seen.add(n);
                const res = this.resByName.get(n);
                if (res && res.category === 'raw') { raws.set(n, (raws.get(n) || 0) + 1); return; }
                const r = this.recipeByName.get(n);
                if (!r || !r.ingredients || !r.ingredients.length) { raws.set(n, (raws.get(n) || 0) + 1); return; }
                if (depth) mids.push(n);
                r.ingredients.forEach(i => walk(i.name, depth + 1));
            };
            walk(name, 0);
            return { raws: Array.from(raws.keys()), mids };
        }

        // ------------------------------------------------------------- render
        async renderAnalytics() {
            this.prepare();
            const root = document.getElementById('analyticsContent');
            if (!root) return;
            root.innerHTML = `
                <div class="an-stats">
                    ${[[this.planets.length, 'stakeable planets'], [this.SD.planets.length - this.planets.length, 'asteroid belts (no stake)'], [this.atlas.length, 'raw deposits'], [this.atlas.filter(d => !d.extractor).length, 'fleet-mined only'], [this.regions.size, 'regions'], [this.recipeNames.length, 'craftable outputs']].map(([n, l]) => `<div class="an-stat"><b>${n.toLocaleString()}</b><span>${l}</span></div>`).join('')}
                </div>
                <nav class="an-jump"><a href="#anTier">Which tier to buy</a><a href="#anAtlas">Deposit atlas</a><a href="#anRecipe">Where to stake for a recipe</a></nav>
                <section class="an-section" id="anTier"></section>
                <section class="an-section" id="anAtlas"></section>
                <section class="an-section" id="anRecipe"></section>`;
            this.renderTier(); this.renderAtlas(); this.renderRecipe();
            if (!root.dataset.bound) { root.dataset.bound = '1'; this.bind(root); }
        }

        bind(root) {
            const snd = n => { if (window.spaceSounds && window.spaceSounds[n]) window.spaceSounds[n](); };
            root.addEventListener('click', e => {
                const tt = e.target.closest('[data-tier-type]'); if (tt) { this.filters.tierType = +tt.dataset.tierType; snd('select'); this.renderTier(); return; }
                const row = e.target.closest('[data-dep]'); if (row && !e.target.closest('[data-plan]')) { row.classList.toggle('open'); snd('click'); return; }
                const plan = e.target.closest('[data-plan]'); if (plan) { snd('success'); this.openBuilder(plan.dataset.plan); return; }
                const rr = e.target.closest('[data-recipe]'); if (rr) { snd('click'); this.pickRecipe(rr.dataset.recipe); return; }
                const fc = e.target.closest('[data-rf]'); if (fc) { const f = fc.dataset.rf; this.filters.recipeFactions.has(f) ? this.filters.recipeFactions.delete(f) : this.filters.recipeFactions.add(f); snd('select'); this.renderRecipeResults(); return; }
                const clr = e.target.closest('[data-recipe-clear]'); if (clr) { this.recipe = null; this.filters.recipeQ = ''; this.renderRecipe(); return; }
            });
            root.addEventListener('input', e => {
                if (e.target.id === 'anAtlasQ') { this.filters.atlasQ = e.target.value.trim().toLowerCase(); this.renderAtlasRows(); }
                if (e.target.id === 'anRecipeQ') { this.filters.recipeQ = e.target.value.trim().toLowerCase(); this.renderRecipeHits(); }
            });
            root.addEventListener('change', e => { if (e.target.id === 'anAtlasSort') { this.filters.atlasSort = e.target.value; this.renderAtlasRows(); } });
        }

        async openBuilder(key) {
            const app = window.claimStakeApp; if (!app) return;
            await app.switchTab('construction');
            if (window.constructionManager) { window.constructionManager.selectPlanet(key); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        }

        // ---- 1. which tier to buy
        tierFacts(type, tier) {
            const b = k => this.byId.get(`${CAT_SLUG[type]}-${k}-t${tier}`);
            const central = b('central-hub'), hubs = { extraction: b('extraction-hub'), processing: b('processing-hub'), storage: b('storage-hub'), farm: b('farm-hub'), power: b('power-plant'), crew: b('crew-quarters'), module: b('storage-module') };
            const ex = this.byId.get(`copper-ore-extractor-t${tier}`), pr = this.byId.get(`copper-processor-t${tier}`);
            if (!central || !ex || !pr || Object.values(hubs).some(h => !h)) return null;
            const slots = this.SD.slots.standard[tier];
            const set = [hubs.extraction, hubs.processing, hubs.storage, hubs.farm, hubs.power];
            const sum = (list, f) => list.reduce((a, x) => a + (f(x) || 0), 0);
            const full = { slots: sum(set, x => x.slots), power: central.power + sum(set, x => x.power), housed: central.crewSlots + sum(set, x => x.crewSlots), needed: central.neededCrew + sum(set, x => x.neededCrew), storage: central.storage + sum(set, x => x.storage), time: sum(set, x => x.constructionTime), units: sum(set, x => Object.values(x.constructionCost || {}).reduce((a, v) => a + v, 0)) };
            // best mix on a lean stake (central + extraction hub + power plant + k crew quarters): most extractors that fit slots, crew and power
            const lean = [hubs.extraction, hubs.power];
            let best = { n: 0, k: 0, bound: 'slots' };
            for (let k = 0; k <= 40; k++) {
                const used = sum(lean, x => x.slots) + k * hubs.crew.slots;
                const housed = central.crewSlots + sum(lean, x => x.crewSlots) + k * hubs.crew.crewSlots - central.neededCrew - sum(lean, x => x.neededCrew);
                const power = central.power + sum(lean, x => x.power) + k * hubs.crew.power;
                const bySlots = Math.floor((slots - used) / ex.slots), byCrew = Math.floor(housed / ex.neededCrew), byPower = Math.floor(power / -ex.power);
                const n = Math.max(0, Math.min(bySlots, byCrew, byPower));
                if (n > best.n) best = { n, k, bound: n === bySlots ? 'slots' : (n === byCrew ? 'crew' : 'power') };
            }
            const ex1 = this.byId.get('copper-ore-extractor-t1');
            return { tier, slots, central, hubs, ex, pr, full, best, mult: Object.values(ex.resourceExtractionRate)[0] / Object.values(ex1.resourceExtractionRate)[0], proc: Object.values(pr.resourceRate).find(v => v > 0) };
        }

        fmtTime(sec) { if (!sec) return '0'; if (sec < 60) return sec + ' s'; const m = Math.round(sec / 60); if (m < 60) return m + ' min'; const h = Math.floor(m / 60), mm = m % 60; return h + ' h' + (mm ? ' ' + mm + ' min' : ''); }

        renderTier() {
            const el = document.getElementById('anTier'); if (!el) return;
            const type = this.filters.tierType;
            const facts = [1, 2, 3, 4, 5].map(t => this.tierFacts(type, t));
            const row = (label, f, cls) => `<tr class="${cls || ''}"><th>${label}</th>${facts.map(x => `<td>${x ? f(x) : '–'}</td>`).join('')}</tr>`;
            const sign = v => (v > 0 ? '+' : '') + num(v);
            el.innerHTML = `
                <div class="an-head"><h3>Which tier to buy</h3><p>A stake is bought per tier and holds tier-N buildings only, so the question is what one tier-N stake can run once its hubs are up. Numbers from buildings.json for a <b>${CAT_NAME[type]}</b> planet; the central hub comes with the stake.</p></div>
                <div class="chips an-types">${CAT_NAME.map((n, i) => i === 3 ? '' : `<button type="button" class="chip${i === type ? ' on' : ''}" data-tier-type="${i}" style="--c:${CAT_COLOR[i]}"><i></i>${n}</button>`).join('')}</div>
                <div class="an-tablewrap"><table class="an-table">
                    <thead><tr><th></th>${facts.map(x => `<th><span class="t t${x.tier}">T${x.tier}</span></th>`).join('')}</tr></thead>
                    <tbody>
                        ${row('Stake slots', x => `<b>${x.slots.toLocaleString()}</b>`, 'hl')}
                        ${row('Central hub power / crew housed / storage', x => `${sign(x.central.power)} / ${x.central.crewSlots} / ${x.central.storage.toLocaleString()}`)}
                        <tr class="sub"><th colspan="6">Full hub set: extraction, processing, storage, farm hubs + power plant</th></tr>
                        ${row('Slots used by the set', x => `${x.full.slots.toLocaleString()} <small>${Math.round(100 * x.full.slots / x.slots)}% of the stake</small>`)}
                        ${row('Net power with central hub', x => sign(x.full.power))}
                        ${row('Crew housed / needed by the set', x => `${x.full.housed} / ${x.full.needed}`)}
                        ${row('Storage', x => x.full.storage.toLocaleString())}
                        ${row('Build time / material units', x => `${this.fmtTime(x.full.time)} / ${x.full.units}`)}
                        <tr class="sub"><th colspan="6">One extractor (Copper Ore shown; every deposit scales the same way) and one processor</th></tr>
                        ${row('Extractor slots / power / crew', x => `${x.ex.slots} / ${x.ex.power} / <b>${x.ex.neededCrew}</b>`)}
                        ${row('Extractor output vs tier 1', x => `${num(Object.values(x.ex.resourceExtractionRate)[0])} /tick <small>&times;${num(x.mult, 1)}</small>`)}
                        ${row('Processor slots / power / crew / throughput', x => `${x.pr.slots} / ${x.pr.power} / ${x.pr.neededCrew} / ${x.proc} per tick`)}
                        ${row('Build time (extractor / processor)', x => `${this.fmtTime(x.ex.constructionTime)} / ${this.fmtTime(x.pr.constructionTime)}`)}
                        <tr class="sub"><th colspan="6">Best lean stake: central + extraction hub + power plant + crew quarters as needed</th></tr>
                        ${row('Extractors that fit', x => `<b class="big">${x.best.n}</b> <small>with ${x.best.k} crew quarters, bound by ${x.best.bound}</small>`, 'hl')}
                        ${row('Crew needed by those extractors', x => (x.best.n * x.ex.neededCrew).toLocaleString())}
                    </tbody>
                </table></div>
                <p class="sb-foot">Extractor crew grows as n&sup3; (1 / 8 / 27 / 64 / 125) while crew quarters house 5 / 10 / 20 / 40 / 80, so from tier 3 the crew binds before the slots do. Rates are per tick as exported; richness is not applied.</p>`;
        }

        // ---- 2. deposit atlas
        renderAtlas() {
            const el = document.getElementById('anAtlas'); if (!el) return;
            el.innerHTML = `
                <div class="an-head"><h3>Deposit atlas</h3><p>Every raw deposit on the map: how many stakeable planets carry it, the best richness anywhere, which territories, and whether an extractor family exists. Click a deposit for its richest planets.</p></div>
                <div class="an-tools"><input type="text" id="anAtlasQ" class="sb-input" placeholder="Find a deposit" value="${esc(this.filters.atlasQ)}" autocomplete="off"><select id="anAtlasSort" class="sb-input an-select"><option value="planets">Most planets</option><option value="rare">Rarest first</option><option value="tier">Highest tier</option><option value="richness">Best richness</option><option value="name">Name</option></select></div>
                <div class="an-atlas" id="anAtlasRows"></div>`;
            el.querySelector('#anAtlasSort').value = this.filters.atlasSort;
            this.renderAtlasRows();
        }

        renderAtlasRows() {
            const el = document.getElementById('anAtlasRows'); if (!el) return;
            const q = this.filters.atlasQ, sort = this.filters.atlasSort;
            let rows = this.atlas.filter(d => !q || d.name.toLowerCase().includes(q));
            const cmp = { planets: (a, b) => b.planets - a.planets, rare: (a, b) => a.planets - b.planets, tier: (a, b) => b.tier - a.tier || b.planets - a.planets, richness: (a, b) => b.best - a.best, name: (a, b) => a.name.localeCompare(b.name) }[sort];
            rows.sort((a, b) => cmp(a, b) || a.name.localeCompare(b.name));
            const maxP = Math.max(1, ...this.atlas.map(d => d.planets));
            el.innerHTML = `<div class="an-dep head"><span>Deposit</span><span>Stakeable planets</span><span>Belts</span><span>Best richness</span><span>Territory</span><span>Extractor</span></div>` + rows.map(d => `
                <div class="an-dep" data-dep="${esc(d.id)}">
                    <span class="nm"><i class="t t${d.tier}">T${d.tier}</i>${esc(d.name)}</span>
                    <span class="bar"><b style="width:${Math.round(100 * d.planets / maxP)}%"></b><em>${d.planets.toLocaleString()}</em></span>
                    <span class="n">${d.belts.toLocaleString()}</span>
                    <span class="n">${d.best}</span>
                    <span class="fac">${['mud', 'oni', 'ustur'].map(f => d.fac[f] ? `<em class="f-${f}">${FAC_LABEL[f]} ${d.fac[f]}</em>` : '').join('')}</span>
                    <span>${d.extractor ? `<em class="ok">yes</em> <small>${d.rate != null ? num(d.rate) + ' /tick at T1' : ''}</small>` : '<em class="no">fleet only</em>'}</span>
                    <div class="an-dep-more">${d.planets ? d.top.map(p => `<div class="an-pl"><i class="pdot" style="--c:${CAT_COLOR[p.cat]}"></i><b>${esc(p.name)}</b><span>${esc(p.system)}</span><em class="f-${p.terr}">${FAC_LABEL[p.terr] || ''}</em><span class="rbar"><i style="width:${Math.round(100 * p.richness / d.best)}%"></i></span><span class="rv">${p.richness}</span><button type="button" class="sb-btn ghost" data-plan="${esc(p.key)}">Plan stake</button></div>`).join('') : '<p class="sb-muted">Only on asteroid belts: mine it with a fleet.</p>'}</div>
                </div>`).join('');
        }

        // ---- 3. where to stake for a recipe
        renderRecipe() {
            const el = document.getElementById('anRecipe'); if (!el) return;
            el.innerHTML = `
                <div class="an-head"><h3>Where to stake for a recipe</h3><p>Pick anything craftable. Its recipe tree is expanded to raw deposits, then every stakeable planet is ranked by how many of those raws it holds. Full coverage means one stake can feed the whole tree; raws without an extractor family must come from fleet mining.</p></div>
                <div class="an-tools"><input type="text" id="anRecipeQ" class="sb-input" placeholder="Search a recipe output, e.g. Copper Wire, Power Regulation Module" value="${esc(this.filters.recipeQ)}" autocomplete="off"><div class="chips">${['mud', 'oni', 'ustur'].map(f => `<button type="button" class="chip f-${f}${this.filters.recipeFactions.has(f) ? ' on' : ''}" data-rf="${f}">${FAC_LABEL[f]} territory</button>`).join('')}</div></div>
                <div class="an-hits" id="anRecipeHits"></div>
                <div id="anRecipeOut"></div>`;
            this.renderRecipeHits(); this.renderRecipeResults();
        }

        renderRecipeHits() {
            const el = document.getElementById('anRecipeHits'); if (!el) return;
            const q = this.filters.recipeQ;
            if (!q || q.length < 2 || (this.recipe && this.recipe.outputName.toLowerCase() === q)) { el.innerHTML = ''; return; }
            const hits = this.recipeNames.filter(n => n.toLowerCase().includes(q)).slice(0, 12);
            el.innerHTML = hits.map(n => { const r = this.recipeByName.get(n); return `<button type="button" class="an-hit" data-recipe="${esc(n)}"><b>${esc(n)}</b><span>${esc(r.outputType || '')}${r.outputTier ? ' · T' + r.outputTier : ''}</span></button>`; }).join('') || '<p class="sb-muted">No recipe matches.</p>';
        }

        pickRecipe(name) {
            this.recipe = this.recipeByName.get(name) || null;
            this.filters.recipeQ = name.toLowerCase();
            const q = document.getElementById('anRecipeQ'); if (q) q.value = name;
            this.renderRecipeHits(); this.renderRecipeResults();
        }

        renderRecipeResults() {
            const el = document.getElementById('anRecipeOut'); if (!el) return;
            if (!this.recipe) { el.innerHTML = '<p class="sb-muted an-empty">Search a recipe above to rank the planets for it.</p>'; return; }
            const r = this.recipe, { raws, mids } = this.expand(r.outputName);
            const rawInfo = raws.map(n => ({ name: n, id: slug(n), d: this.rawByName.get(n) }));
            const fleetOnly = rawInfo.filter(x => x.d && !x.d.extractor), unknown = rawInfo.filter(x => !x.d);
            const need = rawInfo.filter(x => x.d).map(x => x.id);
            const fs = this.filters.recipeFactions;
            const ranked = this.planets.filter(p => !fs.size || fs.has(p.territory)).map(p => {
                const have = need.filter(k => p.names.has(k));
                return { p, have, cov: need.length ? have.length / need.length : 0, rich: have.reduce((a, k) => a + (p.rich.get(k) || 0), 0) };
            }).filter(x => x.have.length).sort((a, b) => b.cov - a.cov || b.rich - a.rich || a.p.planet.name.localeCompare(b.p.planet.name));
            const top = ranked.slice(0, 12), full = ranked.filter(x => x.cov === 1).length;
            const byRegion = new Map();
            ranked.forEach(x => { const k = x.p.region; const e = byRegion.get(k) || { name: k, risk: x.p.risk, terr: x.p.territory, full: 0, best: 0, n: 0 }; e.n++; if (x.cov === 1) e.full++; e.best = Math.max(e.best, x.cov); byRegion.set(k, e); });
            const regions = Array.from(byRegion.values()).sort((a, b) => b.full - a.full || b.best - a.best || b.n - a.n).slice(0, 6);
            el.innerHTML = `
                <div class="an-recipe-head">
                    <div><b>${esc(r.outputName)}</b><span>${esc(r.outputType || '')}${r.outputTier ? ' · T' + r.outputTier : ''} · ${raws.length} raw${raws.length === 1 ? '' : 's'}${mids.length ? ' · ' + mids.length + ' intermediate' + (mids.length === 1 ? '' : 's') : ''}</span></div>
                    <button type="button" class="sb-btn ghost" data-recipe-clear>Clear</button>
                </div>
                <div class="an-raws">${rawInfo.map(x => `<span class="rtag ${x.d ? (x.d.extractor ? '' : 'fleet') : 'unk'}" title="${x.d ? x.d.planets + ' stakeable planets' : 'not a mapped deposit'}">${x.d && x.d.tier ? `<i class="t t${x.d.tier}">T${x.d.tier}</i>` : '<i></i>'}<span class="rname">${esc(x.name)}</span><span class="rval">${x.d ? x.d.planets.toLocaleString() : '?'}</span></span>`).join('')}</div>
                ${fleetOnly.length ? `<p class="an-note warn">${fleetOnly.map(x => esc(x.name)).join(', ')}: no extractor family exists, so a fleet mines ${fleetOnly.length === 1 ? 'it' : 'these'} (belts included).</p>` : ''}
                ${unknown.length ? `<p class="an-note">${unknown.map(x => esc(x.name)).join(', ')}: not a mapped deposit and no recipe makes it; left out of the ranking.</p>` : ''}
                ${mids.length ? `<p class="an-note">Intermediates: ${mids.slice(0, 14).map(esc).join(', ')}${mids.length > 14 ? ' and ' + (mids.length - 14) + ' more' : ''}.</p>` : ''}
                <div class="an-summary"><div class="an-stat"><b>${full.toLocaleString()}</b><span>planets with every raw</span></div><div class="an-stat"><b>${ranked.length.toLocaleString()}</b><span>planets with any</span></div><div class="an-stat"><b>${top.length ? Math.round(100 * top[0].cov) + '%' : '–'}</b><span>best coverage</span></div></div>
                ${regions.length ? `<div class="an-regions">${regions.map(g => `<span class="an-region"><b>${esc(g.name)}</b><em class="f-${g.terr}">${FAC_LABEL[g.terr] || ''}</em><small>${g.risk === 'safe' ? 'safe zone' : 'medium risk'} · ${g.full ? g.full + ' full' : Math.round(100 * g.best) + '% best'} · ${g.n} planet${g.n === 1 ? '' : 's'}</small></span>`).join('')}</div>` : ''}
                <div class="an-planets">${top.map((x, i) => `
                    <div class="an-pcard${x.cov === 1 ? ' full' : ''}">
                        <div class="an-pcard-head"><span class="rank">#${i + 1}</span><i class="pdot" style="--c:${CAT_COLOR[x.p.cat]}"></i><b>${esc(x.p.planet.name)}</b><em class="f-${x.p.territory}">${FAC_LABEL[x.p.territory] || ''}</em></div>
                        <div class="an-pcard-sub">${esc(x.p.system.name || x.p.system.key)} · ${esc(x.p.region)} · ${x.p.risk === 'safe' ? 'safe zone' : 'medium risk'} · ${CAT_NAME[x.p.cat]}</div>
                        <div class="an-cov"><b style="width:${Math.round(100 * x.cov)}%"></b><em>${x.have.length} / ${need.length}</em></div>
                        <div class="an-pcard-tags">${need.map(k => `<span class="${x.p.names.has(k) ? 'has' : 'miss'}">${esc(this.SD.resName(k))}${x.p.names.has(k) ? ' <small>' + x.p.rich.get(k) + '</small>' : ''}</span>`).join('')}</div>
                        <button type="button" class="sb-btn" data-plan="${esc(x.p.key)}">Plan a stake here</button>
                    </div>`).join('') || '<p class="sb-muted">No stakeable planet carries any of these raws in the selected territories.</p>'}</div>`;
        }
    }

    window.BuildingAnalytics = BuildingAnalytics;
})();
