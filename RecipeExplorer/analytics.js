// analytics.js - Recipe Explorer Analytics tab (rebuilt 2026-10-01). Recipe-side questions, every chart always on,
// plain HTML bars:
//   1. What the catalogue makes - the 5,251 recipes by output type, and each type by output tier. (Release status is
//      deliberately not shown anywhere: the release will be v2, so every recipe counts - owner, 2026-10-01.)
//   2. Build time - how long recipes take, by output type; the longest and the deepest.
//   3. Where things are crafted - planet type x output type, starbase level, faction-exclusive recipes.
//   4. Ingredient demand - every resource ranked by the recipes that list it (each recipe once, all statuses; the same
//      count the Resources Explorer shows), with a category filter, 50 per page, search keeps the global rank; click a
//      row for the recipes that use it. Kept from the 2026-09-28 build because the click-through is recipe-side.
//   5. Gated recipes - exotic outputs and research-gated recipes.
// Gone: the recipe modal's complexity score (tier x 10 + ingredients x 5 + time / 10 + unique x 3), "resource
// intensity", "time efficiency", "tier progression" and "material efficiency" labels - invented weights and thresholds.
(function () {
    'use strict';

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const CAT = { raw: { label: 'Raw', color: '#dd7429' }, processed: { label: 'Processed', color: '#2a9fcf' }, component: { label: 'Component', color: '#2fa985' }, advanced: { label: 'Advanced', color: '#9476db' } };
    const TYPE_COLOR = ['#2a9fcf', '#2fa985', '#9476db', '#dd7429', '#a8842a', '#4fd8ff', '#7ee8a4', '#b98cff', '#ffd36b', '#ff7a6b', '#9ec3d6', '#e2512b', '#3fae79', '#7fd0ff', '#6b70b8', '#d99a4e'];
    const PT_COLOR = { Terrestrial: '#3fae79', Volcanic: '#e2512b', Barren: '#b7a58a', 'Asteroid Belt': '#9a9a9a', 'Gas Giant': '#d99a4e', 'Ice Giant': '#7fd0ff', Dark: '#6b70b8', Oceanic: '#2f8cff', 'All Types': '#cfd8e6' };
    const PAGE = 50;
    const num = v => (v || 0).toLocaleString();
    const fmtTime = sec => { if (!sec) return '0 s'; if (sec < 60) return Math.round(sec) + ' s'; const m = Math.round(sec / 60); if (m < 60) return m + ' min'; const h = Math.floor(m / 60), mm = m % 60; return h + ' h' + (mm ? ' ' + mm + ' min' : ''); };

    class RecipeAnalytics {
        constructor(model, planner) {
            this.m = model; this.rm = model.rm; this.planner = planner;
            this.typeColor = new Map(model.stats.types.map((t, i) => [t.type, TYPE_COLOR[i % TYPE_COLOR.length]]));
            this.demandQ = ''; this.demandPage = 1; this.demandCat = new Set();
            this.demandList = this.rm.list.slice().sort((a, b) => b.demand - a.demand || a.name.localeCompare(b.name));
            this.demandList.forEach((r, i) => { r.rank = i + 1; });
        }

        snd(n) { if (window.spaceSounds && window.spaceSounds[n]) window.spaceSounds[n](); }

        renderAnalytics() {
            const root = document.getElementById('analyticsContent'); if (!root) return;
            const st = this.m.stats;
            root.innerHTML = `
                <div class="an-root">
                    <div class="an-stats">${[[st.total, 'recipes'], [st.types.length, 'output types'], [st.total - st.outputsNotResources, 'make an inventory resource'], [st.outputsNotResources, 'make a building, ship or extractor'], [st.exotic.length, 'exotic outputs'], [st.research.length, 'research-gated']].map(([n, l]) => `<div class="an-stat"><b>${num(n)}</b><span>${l}</span></div>`).join('')}</div>
                    <nav class="an-jump"><a href="#anMakes">What the catalogue makes</a><a href="#anTime">Build time</a><a href="#anWhere">Where things are crafted</a><a href="#anDemand">Ingredient demand</a><a href="#anGated">Gated recipes</a></nav>
                    <section class="an-section" id="anMakes"></section>
                    <section class="an-section" id="anTime"></section>
                    <section class="an-section" id="anWhere"></section>
                    <section class="an-section" id="anDemand"></section>
                    <section class="an-section" id="anGated"></section>
                </div>`;
            this.renderMakes(); this.renderTime(); this.renderWhere(); this.renderDemand(); this.renderGated();
            if (!root.dataset.bound) { root.dataset.bound = '1'; this.bind(root); }
        }

        bind(root) {
            root.addEventListener('click', e => {
                const open = e.target.closest('[data-open]'); if (open) { this.snd('click'); this.planner.openSheet(open.dataset.open); return; }
                const uses = e.target.closest('[data-uses]'); if (uses) { this.snd('click'); this.showUses(uses.dataset.uses); return; }
                const pg = e.target.closest('[data-page]'); if (pg && !pg.disabled) { this.demandPage = +pg.dataset.page; this.snd('click'); this.renderDemandRows(); document.getElementById('anDemand').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
                const dc = e.target.closest('[data-dcat]'); if (dc) { const v = dc.dataset.dcat; this.demandCat.has(v) ? this.demandCat.delete(v) : this.demandCat.add(v); dc.classList.toggle('on', this.demandCat.has(v)); this.demandPage = 1; this.snd('select'); this.renderDemandRows(); return; }
                const close = e.target.closest('[data-uses-close]'); if (close) { close.closest('.an-uses').remove(); return; }
            });
            root.addEventListener('input', e => { if (e.target.id === 'anDemandQ') { this.demandQ = e.target.value.trim().toLowerCase(); this.demandPage = 1; this.renderDemandRows(); } });
        }

        track(segs, total, cap) {
            const T = Math.max(1, cap || total);
            return `<div class="ch-track">${segs.filter(s => s.n).map(s => `<b style="width:${(100 * s.n / T).toFixed(2)}%;background:${s.color}"><span class="ct">${esc(s.label)}: ${num(s.n)}${total ? ` (${Math.round(100 * s.n / total)}%)` : ''}</span></b>`).join('')}</div>`;
        }
        typeKey() { return `<div class="ch-key">${this.m.stats.types.map(t => `<span><i style="background:${this.typeColor.get(t.type)}"></i>${esc(t.label)}</span>`).join('')}</div>`; }

        // ---- 1
        renderMakes() {
            const el = document.getElementById('anMakes'), st = this.m.stats, max = Math.max(...st.types.map(t => t.n));
            el.innerHTML = `
                <div class="an-head"><h3>What the catalogue makes</h3><p><b>${num(st.total)}</b> recipes. Left, by output type; right, each type split by output tier.</p></div>
                <div class="an-two">
                    <div class="ch">${st.types.map(t => `<div class="ch-row"><span class="ch-lbl"><i class="dot" style="background:${this.typeColor.get(t.type)}"></i>${esc(t.label)}</span><div class="ch-bar"><b style="width:${(100 * t.n / max).toFixed(1)}%;background:${this.typeColor.get(t.type)}"><span class="ct">${esc(t.label)}: ${num(t.n)} recipes · ${num(t.resources)} are inventory resources · avg ${(t.ingredients / t.n).toFixed(1)} ingredients</span></b></div><span class="ch-val">${num(t.n)}</span></div>`).join('')}</div>
                    <div class="ch"><div class="ch-key">${[1, 2, 3, 4, 5].map(i => `<span><i style="background:${['', '#9ec3d6', '#7ee8a4', '#4fd8ff', '#b98cff', '#ffd36b'][i]}"></i>Tier ${i}</span>`).join('')}</div>
                        ${st.types.map(t => `<div class="ch-row"><span class="ch-lbl">${esc(t.label)}</span>${this.track([1, 2, 3, 4, 5].map(i => ({ n: t.tiers[i] || 0, color: ['', '#9ec3d6', '#7ee8a4', '#4fd8ff', '#b98cff', '#ffd36b'][i], label: `${t.label} tier ${i}` })), t.n, t.n)}<span class="ch-val">${num(t.n)}</span></div>`).join('')}
                        <p class="sb-foot">Most types come in five tiers of equal size; the basic and organic resources sit at tiers 1 to 3.</p></div>
                </div>`;
        }

        // ---- 2
        renderTime() {
            const el = document.getElementById('anTime'), st = this.m.stats;
            const maxB = Math.max(...st.timeBuckets.map(([, m]) => Object.values(m).reduce((a, b) => a + b, 0)));
            el.innerHTML = `
                <div class="an-head"><h3>Build time</h3><p>How long one craft takes (the export's <i>constructionTime</i>, read as seconds), by output type. Right, the longest single crafts and the deepest chains.</p></div>
                <div class="an-two">
                    <div class="ch">${this.typeKey()}${st.timeBuckets.map(([l, m]) => { const tot = Object.values(m).reduce((a, b) => a + b, 0); return `<div class="ch-row"><span class="ch-lbl">${esc(l)}</span>${this.track(st.types.map(t => ({ n: m[t.type] || 0, color: this.typeColor.get(t.type), label: t.label })), tot, maxB)}<span class="ch-val">${num(tot)}</span></div>`; }).join('')}</div>
                    <div class="an-aside">
                        <div class="ch"><h4>Longest crafts</h4>${st.longest.map(r => `<div class="ch-row"><button type="button" class="ch-lbl rx-link" data-open="${esc(r.outputId)}">${esc(r.outputName)}</button><div class="ch-bar"><b style="width:${(100 * (r.constructionTime || 0) / (st.longest[0].constructionTime || 1)).toFixed(1)}%"><span class="ct">${esc(r.outputName)} · ${esc(r.typeLabel)} T${r.outputTier}</span></b></div><span class="ch-val">${fmtTime(r.constructionTime)}</span></div>`).join('')}</div>
                        <div class="ch"><h4>Deepest chains</h4>${st.deepest.map(r => `<div class="ch-row"><button type="button" class="ch-lbl rx-link" data-open="${esc(r.outputId)}">${esc(r.outputName)}</button><div class="ch-bar"><b style="width:${(100 * r.depth / st.deepest[0].depth).toFixed(1)}%;background:#9476db"><span class="ct">${esc(r.outputName)}: ${r.depth} steps, ${num(r.nodeCount)} resources in the chain</span></b></div><span class="ch-val">${r.depth} · ${num(r.nodeCount)}</span></div>`).join('')}</div>
                    </div>
                </div>`;
        }

        // ---- 3
        renderWhere() {
            const el = document.getElementById('anWhere'), st = this.m.stats;
            const pts = Array.from(st.ptByType.entries()).map(([pt, m]) => ({ pt, m, n: Object.values(m).reduce((a, b) => a + b, 0) })).sort((a, b) => b.n - a.n);
            const maxP = Math.max(...pts.map(p => p.n)), maxS = Math.max(...st.byStar.slice(1));
            el.innerHTML = `
                <div class="an-head"><h3>Where things are crafted</h3><p>Each recipe lists the planet types it can be crafted on (a recipe allowing four types counts four times). Right, the starbase level a recipe needs, and the recipes locked to one faction.</p></div>
                <div class="an-two">
                    <div class="ch">${this.typeKey()}${pts.map(p => `<div class="ch-row"><span class="ch-lbl"><i class="dot" style="background:${PT_COLOR[p.pt] || '#888'}"></i>${esc(p.pt)}</span>${this.track(st.types.map(t => ({ n: p.m[t.type] || 0, color: this.typeColor.get(t.type), label: t.label })), p.n, maxP)}<span class="ch-val">${num(p.n)}</span></div>`).join('')}</div>
                    <div class="an-aside">
                        <div class="ch"><h4>Starbase level required</h4>${[1, 2, 3, 4, 5].map(l => `<div class="ch-row"><span class="ch-lbl">Level ${l}</span><div class="ch-bar"><b style="width:${(100 * st.byStar[l] / maxS).toFixed(1)}%;background:#4fd8ff"><span class="ct">${num(st.byStar[l])} recipes need a level ${l} starbase</span></b></div><span class="ch-val">${num(st.byStar[l])}</span></div>`).join('')}</div>
                        <div class="ch"><h4>Faction-exclusive recipes</h4>${['MUD', 'ONI', 'USTUR'].map(f => `<div class="ch-row"><span class="ch-lbl f-${f.toLowerCase()}">${f}</span><div class="ch-bar"><b style="width:${(100 * st.factionOnly[f] / Math.max(1, ...Object.values(st.factionOnly))).toFixed(1)}%;background:${{ MUD: '#ff6040', ONI: '#3ec8ff', USTUR: '#b98cff' }[f]}"><span class="ct">${num(st.factionOnly[f])} recipes only ${f} can craft</span></b></div><span class="ch-val">${num(st.factionOnly[f])}</span></div>`).join('')}
                            <p class="sb-foot">${num(st.total - Object.values(st.factionOnly).reduce((a, b) => a + b, 0))} recipes are open to all three factions.</p></div>
                    </div>
                </div>`;
        }

        // ---- 4
        renderDemand() {
            const el = document.getElementById('anDemand');
            el.innerHTML = `
                <div class="an-head"><h3>Ingredient demand</h3><p>Every resource ranked by how many recipes list it as a direct ingredient, each recipe once (the Resources Explorer shows the same count). Click a row for the recipes that use it. Search keeps the global rank.</p></div>
                <div class="an-tools"><input type="text" id="anDemandQ" class="sb-input" placeholder="Find a resource in the ranking" value="${esc(this.demandQ)}" autocomplete="off"><div class="chips">${Object.entries(CAT).map(([k, c]) => `<button type="button" class="chip${this.demandCat.has(k) ? ' on' : ''}" data-dcat="${k}" style="--c:${c.color}"><i></i>${c.label}</button>`).join('')}</div></div>
                <div class="an-rank" id="anDemandRows"></div><div class="pager" id="anDemandPager"></div>`;
            this.renderDemandRows();
        }

        renderDemandRows() {
            const el = document.getElementById('anDemandRows'), pager = document.getElementById('anDemandPager'); if (!el) return;
            const q = this.demandQ;
            const items = this.demandList.filter(r => (!q || r.name.toLowerCase().includes(q)) && (!this.demandCat.size || this.demandCat.has(r.category)));
            const pages = Math.max(1, Math.ceil(items.length / PAGE)), page = Math.min(Math.max(this.demandPage, 1), pages); this.demandPage = page;
            const start = (page - 1) * PAGE, slice = items.slice(start, start + PAGE), max = this.rm.maxDemand;
            el.innerHTML = `<div class="an-rk head"><span>#</span><span>Resource</span><span>Recipes using it</span><span>Steps</span></div>` +
                (slice.map(r => `<button type="button" class="an-rk" data-uses="${esc(r.name)}"><span class="rk">${r.rank}</span><span class="nm"><i class="dot" style="background:${CAT[r.category].color}"></i><i class="t t${r.tier}">T${r.tier}</i>${esc(r.name)}</span><span class="bar"><b style="width:${(100 * r.demand / max).toFixed(2)}%"></b><em>${num(r.demand)}</em></span><span class="n">${r.depth}</span></button>`).join('') || `<p class="sb-muted an-empty">No resource matches.</p>`);
            const btn = (label, target, cls) => `<button type="button" class="pager-btn ${cls || ''}" data-page="${target}"${target < 1 || target > pages || target === page ? ' disabled' : ''}>${label}</button>`;
            const shown = new Set([1, pages]); for (let p = page - 2; p <= page + 2; p++) if (p >= 1 && p <= pages) shown.add(p);
            let nums = '', prev = 0; [...shown].sort((a, b) => a - b).forEach(p => { if (p - prev > 1) nums += '<span class="pager-gap">&hellip;</span>'; nums += btn(p, p, p === page ? 'active' : ''); prev = p; });
            pager.innerHTML = `<span class="pager-info">Showing ${items.length ? start + 1 : 0}-${Math.min(start + PAGE, items.length)} of ${num(items.length)}${q || this.demandCat.size ? ` (of ${num(this.demandList.length)})` : ''}</span>${pages > 1 ? `<span class="pager-buttons">${btn('Prev', page - 1)}${nums}${btn('Next', page + 1)}</span>` : ''}`;
        }

        // the recipes that list a resource, inline under the ranking (no modal)
        showUses(name) {
            const res = this.rm.byName.get(name); if (!res) return;
            document.querySelectorAll('.an-uses').forEach(x => x.remove());
            const rows = res.consumers.slice().sort((a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name));
            const box = document.createElement('div'); box.className = 'an-uses';
            box.innerHTML = `<div class="rx-panel-head"><h3>${esc(name)}</h3><span>${num(rows.length)} recipes list it · largest quantity per craft first</span><button type="button" class="sb-btn ghost" data-uses-close>Close</button></div>
                <div class="an-uses-grid">${rows.slice(0, 120).map(u => `<button type="button" class="rx-ing" data-open="${esc(u.id)}" style="--c:#4fd8ff"><i></i><b>${esc(u.name)}</b>${u.tier ? `<em class="t t${u.tier}">T${u.tier}</em>` : ''}<span>&times;${num(u.quantity)}</span></button>`).join('')}</div>${rows.length > 120 ? `<p class="sb-muted">Showing 120 of ${num(rows.length)}.</p>` : ''}`;
            const anchor = document.getElementById('anDemandRows'); anchor.insertAdjacentElement('beforebegin', box);
            box.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // ---- 5
        renderGated() {
            const el = document.getElementById('anGated'), st = this.m.stats;
            el.innerHTML = `
                <div class="an-head"><h3>Gated recipes</h3><p>Outputs the export marks as <b>exotic</b>, and recipes that list research-tree nodes as a prerequisite (the node ids are the SAGE research tree's; the tree itself is not in this export).</p></div>
                <div class="an-two">
                    <div class="ch"><h4>Exotic · ${st.exotic.length}</h4><div class="chips">${st.exotic.map(r => `<button type="button" class="chip" data-open="${esc(r.outputId)}"><i class="t t${r.outputTier}">T${r.outputTier}</i>${esc(r.outputName)}</button>`).join('') || '<span class="sb-muted">none</span>'}</div></div>
                    <div class="ch"><h4>Research-gated · ${st.research.length}</h4><div class="chips">${st.research.slice(0, 60).map(r => `<button type="button" class="chip" data-open="${esc(r.outputId)}" title="nodes ${esc(r.research_requirements.join(', '))}"><i class="t t${r.outputTier}">T${r.outputTier}</i>${esc(r.outputName)}<small>${r.research_requirements.length} nodes</small></button>`).join('') || '<span class="sb-muted">none</span>'}</div></div>
                </div>`;
        }
    }

    window.RecipeAnalytics = RecipeAnalytics;
})();
