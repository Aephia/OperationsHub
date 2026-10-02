// analytics.js - Resources Explorer Analytics tab (rebuilt 2026-10-01). Five questions the export can answer, every
// chart always on, drawn as plain HTML bars (no Chart.js):
//   1. The economy's shape - how the 3,526 resources split by category and tier, and how much of it is live on chain.
//   2. Steps from raw - how deep the chains run (0 = raw) and how many ingredients a recipe takes.
//   3. Demand - every resource ranked by how many recipes list it as a direct ingredient (each recipe once, all
//      statuses; the same count as the Recipe Explorer's Analytics tab), 50 per page, search keeps the global rank.
//   4. Raw backbone - the 93 deposits ranked by reach (how many crafted resources need them somewhere in the tree),
//      next to how many raw kinds each planet type hosts and which raws no stake can extract.
//   5. Data gaps - what the export leaves out, so a zero here is read as a gap and not as a fact.
// Gone: "Most valuable resources" (value is tier x 10, so it ranked tier), "Category distribution" with total value,
// and the Resource Flow tab's criticality / bottleneck scores (invented weights; supply was the count of extractor
// buildings, so every crafted resource with a user was a "bottleneck").
(function () {
    'use strict';

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const CAT = { raw: { label: 'Raw', color: '#dd7429' }, processed: { label: 'Processed', color: '#2a9fcf' }, component: { label: 'Component', color: '#2fa985' }, advanced: { label: 'Advanced', color: '#9476db' } };
    const CATS = ['raw', 'processed', 'component', 'advanced'];
    const TIER_COLOR = ['', '#9ec3d6', '#7ee8a4', '#4fd8ff', '#b98cff', '#ffd36b'];
    const PT_COLOR = ['#3fae79', '#e2512b', '#b7a58a', '#9a9a9a', '#d99a4e', '#7fd0ff', '#6b70b8', '#2f8cff'];
    const PAGE = 50;
    const num = v => (v || 0).toLocaleString();

    class ResourceAnalytics {
        constructor(model) {
            this.m = model;
            this.demandQ = ''; this.demandPage = 1;
            this.rawSort = 'reach';
            this.demandList = model.list.slice().sort((a, b) => b.demand - a.demand || b.reach - a.reach || a.name.localeCompare(b.name));
            this.demandList.forEach((r, i) => { r.rank = i + 1; });
            this.raws = model.list.filter(r => r.category === 'raw');
        }

        snd(n) { if (window.spaceSounds && window.spaceSounds[n]) window.spaceSounds[n](); }

        renderAnalytics() {
            const root = document.getElementById('analyticsContent'); if (!root) return;
            const st = this.m.stats;
            root.innerHTML = `
                <div class="an-root">
                    <div class="an-stats">${[[st.total, 'resources'], [st.byCat.raw, 'raw deposits'], [st.byStatus.live, 'live on chain now'], [st.byStatus.unreleased, 'unreleased'], [st.maxDepth, 'deepest chain (steps)'], [this.m.recipes.length, 'recipes read']].map(([n, l]) => `<div class="an-stat"><b>${num(n)}</b><span>${l}</span></div>`).join('')}</div>
                    <nav class="an-jump"><a href="#anShape">The economy's shape</a><a href="#anDepth">Steps from raw</a><a href="#anDemand">Demand</a><a href="#anRaw">Raw backbone</a><a href="#anGaps">Data gaps</a></nav>
                    <section class="an-section" id="anShape"></section>
                    <section class="an-section" id="anDepth"></section>
                    <section class="an-section" id="anDemand"></section>
                    <section class="an-section" id="anRaw"></section>
                    <section class="an-section" id="anGaps"></section>
                </div>`;
            this.renderShape(); this.renderDepth(); this.renderDemand(); this.renderRaw(); this.renderGaps();
            if (!root.dataset.bound) { root.dataset.bound = '1'; this.bind(root); }
        }

        bind(root) {
            root.addEventListener('click', e => {
                const go = e.target.closest('[data-go]'); if (go) { this.snd('click'); window.resourceVisual && window.resourceVisual.open(go.dataset.go); return; }
                const pg = e.target.closest('[data-page]'); if (pg && !pg.disabled) { this.demandPage = +pg.dataset.page; this.snd('click'); this.renderDemandRows(); document.getElementById('anDemand').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
                const rs = e.target.closest('[data-raw-sort]'); if (rs) { this.rawSort = rs.dataset.rawSort; this.snd('select'); this.renderRawRows(); return; }
            });
            root.addEventListener('input', e => { if (e.target.id === 'anDemandQ') { this.demandQ = e.target.value.trim().toLowerCase(); this.demandPage = 1; this.renderDemandRows(); } });
        }

        // shared: a stacked track with segments [{n, color, label}]
        track(segs, total, cap) {
            const T = Math.max(1, cap || total);
            return `<div class="ch-track">${segs.filter(s => s.n).map(s => `<b style="width:${(100 * s.n / T).toFixed(2)}%;background:${s.color}"><span class="ct">${esc(s.label)}: ${num(s.n)}${total ? ` (${Math.round(100 * s.n / total)}%)` : ''}</span></b>`).join('')}</div>`;
        }

        // ---- 1. shape
        renderShape() {
            const el = document.getElementById('anShape'); const st = this.m.stats;
            const maxCat = Math.max(...CATS.map(c => st.byCat[c] || 0));
            el.innerHTML = `
                <div class="an-head"><h3>The economy's shape</h3><p><b>${num(st.total)}</b> resources: ${CATS.map(c => `${num(st.byCat[c])} ${CAT[c].label.toLowerCase()}`).join(', ')}. Left, each category split by tier; right, how much of each category is live on chain today (status v1) against what the export lists for later (v1-add, v2).</p></div>
                <div class="an-two">
                    <div class="ch">
                        <div class="ch-key">${[1, 2, 3, 4, 5].map(t => `<span><i style="background:${TIER_COLOR[t]}"></i>Tier ${t}</span>`).join('')}</div>
                        ${CATS.map(c => `<div class="ch-stack"><div class="ch-stack-head"><span><i class="dot" style="background:${CAT[c].color}"></i>${CAT[c].label}</span><b>${num(st.byCat[c])}</b></div>${this.track([1, 2, 3, 4, 5].map(t => ({ n: st.byCatTier[c][t] || 0, color: TIER_COLOR[t], label: `${CAT[c].label} tier ${t}` })), st.byCat[c], maxCat)}</div>`).join('')}
                        <p class="sb-foot">Every category has a tier 1 to 5 band; the 93 raws split ${[1, 2, 3, 4, 5].map(t => st.byCatTier.raw[t] || 0).join(' / ')} across the tiers.</p>
                    </div>
                    <div class="ch">
                        <div class="ch-key"><span><i style="background:#7ee8a4"></i>Live now</span><span><i style="background:#ffb86b"></i>Unreleased</span></div>
                        ${CATS.map(c => { const s = st.byCatStatus[c]; return `<div class="ch-stack"><div class="ch-stack-head"><span><i class="dot" style="background:${CAT[c].color}"></i>${CAT[c].label}</span><b>${Math.round(100 * s.live / Math.max(1, s.live + s.unreleased))}% live</b></div>${this.track([{ n: s.live, color: '#7ee8a4', label: 'live' }, { n: s.unreleased, color: '#ffb86b', label: 'unreleased' }], s.live + s.unreleased, maxCat)}</div>`; }).join('')}
                        <p class="sb-foot">${num(st.byStatus.live)} of ${num(st.total)} resources are craftable or minable on chain now (${Math.round(100 * st.byStatus.live / st.total)}%).</p>
                    </div>
                </div>`;
        }

        // ---- 2. depth
        renderDepth() {
            const el = document.getElementById('anDepth'); const st = this.m.stats;
            const depths = Array.from(st.depthHist.keys()).sort((a, b) => a - b);
            const maxD = Math.max(...depths.map(d => CATS.reduce((a, c) => a + (st.depthHist.get(d)[c] || 0), 0)));
            const ings = Array.from(st.ingHist.keys()).sort((a, b) => a - b);
            const maxI = Math.max(...ings.map(k => CATS.reduce((a, c) => a + (st.ingHist.get(k)[c] || 0), 0)));
            const row = (label, hist, max) => `<div class="ch-row"><span class="ch-lbl">${label}</span>${this.track(CATS.map(c => ({ n: hist[c] || 0, color: CAT[c].color, label: CAT[c].label })), CATS.reduce((a, c) => a + (hist[c] || 0), 0), max)}<span class="ch-val">${num(CATS.reduce((a, c) => a + (hist[c] || 0), 0))}</span></div>`;
            const deepest = this.m.list.slice().sort((a, b) => b.depth - a.depth || b.nodeCount - a.nodeCount).slice(0, 5);
            el.innerHTML = `
                <div class="an-head"><h3>Steps from raw</h3><p>Left, how many resources sit at each depth, where depth is the longest path from the resource down to a raw deposit (0 = raw itself). Right, how many distinct ingredients a recipe lists. Both coloured by the category of the resource.</p></div>
                <div class="an-two">
                    <div class="ch"><div class="ch-key">${CATS.map(c => `<span><i style="background:${CAT[c].color}"></i>${CAT[c].label}</span>`).join('')}</div>${depths.map(d => row(d === 0 ? '0 · raw' : `${d} step${d === 1 ? '' : 's'}`, st.depthHist.get(d), maxD)).join('')}
                        <p class="sb-foot">Deepest: ${deepest.map(r => `<button type="button" class="rx-link" data-go="${esc(r.name)}">${esc(r.name)}</button> (${r.depth})`).join(', ')}. The export's own <i>productionSteps</i> agrees with this depth on ${num(st.total - st.gaps.stepsMismatch)} of ${num(st.total)} resources.</p></div>
                    <div class="ch"><div class="ch-key">${CATS.map(c => `<span><i style="background:${CAT[c].color}"></i>${CAT[c].label}</span>`).join('')}</div>${ings.map(k => row(k === 0 ? 'no ingredients' : `${k} ingredient${k === 1 ? '' : 's'}`, st.ingHist.get(k), maxI)).join('')}
                        <p class="sb-foot">Recipes with no ingredients are the raws' own entries and a few buildings' outputs.</p></div>
                </div>`;
        }

        // ---- 3. demand
        renderDemand() {
            const el = document.getElementById('anDemand');
            el.innerHTML = `
                <div class="an-head"><h3>Demand: what the economy asks for</h3><p>Every resource ranked by how many recipes list it as a direct ingredient, each recipe counted once, all release statuses (the same count the Recipe Explorer's Analytics tab shows). <b>Live</b> is the share of those recipes craftable on chain now. Search keeps the global rank.</p></div>
                <div class="an-tools"><input type="text" id="anDemandQ" class="sb-input" placeholder="Find a resource in the ranking" value="${esc(this.demandQ)}" autocomplete="off"></div>
                <div class="an-rank" id="anDemandRows"></div>
                <div class="pager" id="anDemandPager"></div>`;
            this.renderDemandRows();
        }

        renderDemandRows() {
            const el = document.getElementById('anDemandRows'), pager = document.getElementById('anDemandPager'); if (!el) return;
            const q = this.demandQ;
            const items = q ? this.demandList.filter(r => r.name.toLowerCase().includes(q)) : this.demandList;
            const pages = Math.max(1, Math.ceil(items.length / PAGE));
            const page = Math.min(Math.max(this.demandPage, 1), pages); this.demandPage = page;
            const start = (page - 1) * PAGE, slice = items.slice(start, start + PAGE), max = this.m.maxDemand;
            el.innerHTML = `<div class="an-rk head"><span>#</span><span>Resource</span><span>Recipes using it</span><span>Live</span><span>Steps</span></div>` +
                (slice.map(r => `<button type="button" class="an-rk" data-go="${esc(r.name)}"><span class="rk">${r.rank}</span><span class="nm"><i class="dot" style="background:${CAT[r.category].color}"></i><i class="t t${r.tier}">T${r.tier}</i>${esc(r.name)}</span><span class="bar"><b style="width:${(100 * r.demand / max).toFixed(2)}%"></b><em>${num(r.demand)}</em></span><span class="n">${r.demand ? Math.round(100 * r.liveDemand / r.demand) + '%' : '&ndash;'}</span><span class="n">${r.depth}</span></button>`).join('') || `<p class="sb-muted an-empty">No resource matches "${esc(q)}".</p>`);
            const btn = (label, target, cls) => `<button type="button" class="pager-btn ${cls || ''}" data-page="${target}"${target < 1 || target > pages || target === page ? ' disabled' : ''}>${label}</button>`;
            const shown = new Set([1, pages]); for (let p = page - 2; p <= page + 2; p++) if (p >= 1 && p <= pages) shown.add(p);
            let nums = '', prev = 0; [...shown].sort((a, b) => a - b).forEach(p => { if (p - prev > 1) nums += '<span class="pager-gap">&hellip;</span>'; nums += btn(p, p, p === page ? 'active' : ''); prev = p; });
            pager.innerHTML = `<span class="pager-info">Showing ${items.length ? start + 1 : 0}-${Math.min(start + PAGE, items.length)} of ${num(items.length)}${q ? ` matching "${esc(q)}" (of ${num(this.demandList.length)})` : ''}</span>${pages > 1 ? `<span class="pager-buttons">${btn('Prev', page - 1)}${nums}${btn('Next', page + 1)}</span>` : ''}`;
        }

        // ---- 4. raw backbone
        renderRaw() {
            const el = document.getElementById('anRaw'); const st = this.m.stats;
            const maxT = Math.max(...st.typeRaws.map(t => t.raws));
            el.innerHTML = `
                <div class="an-head"><h3>Raw backbone</h3><p>The ${this.raws.length} deposits ranked by <b>reach</b>: how many of the ${num(st.total - st.raws)} crafted resources need the raw somewhere in their tree. Direct is the number of recipes that list it as an ingredient themselves. A deposit with no extractor family is mined by a fleet (belts included), never by a claim stake.</p></div>
                <div class="an-two wide">
                    <div>
                        <div class="an-tools"><div class="chips">${[['reach', 'Reach'], ['demand', 'Direct use'], ['planets', 'Most planets'], ['rare', 'Rarest'], ['richness', 'Richness'], ['tier', 'Tier'], ['name', 'Name']].map(([k, l]) => `<button type="button" class="chip${this.rawSort === k ? ' on' : ''}" data-raw-sort="${k}">${l}</button>`).join('')}</div></div>
                        <div class="an-rank" id="anRawRows"></div>
                    </div>
                    <div class="an-aside">
                        <div class="ch"><h4>Raw kinds per planet type</h4>${st.typeRaws.map(t => `<div class="ch-row"><span class="ch-lbl"><i class="dot" style="background:${PT_COLOR[t.cat]}"></i>${esc(t.name)}</span><div class="ch-bar"><b style="width:${(100 * t.raws / maxT).toFixed(1)}%;background:${PT_COLOR[t.cat]}"><span class="ct">${esc(t.name)}: ${t.raws} of ${this.raws.length} raws occur there</span></b></div><span class="ch-val">${t.raws}</span></div>`).join('')}
                            <p class="sb-foot">Counted from the deposits on the map, so a raw that occurs on both volcanic and dark worlds counts for both.</p></div>
                        <div class="ch"><h4>No claim stake can mine these</h4><div class="chips">${st.gaps.stakeless.map(r => `<button type="button" class="chip fleet" data-go="${esc(r.name)}" title="${r.extractor ? 'extractor kit exists, but the deposit is belt-only and a stake cannot sit on a belt' : 'no extractor family in the export'}"><i class="t t${r.tier}">T${r.tier}</i>${esc(r.name)}<small>${r.extractor ? 'belts only' : 'no kit'} &middot; reach ${num(r.reach)}</small></button>`).join('') || '<span class="sb-muted">every raw can be staked</span>'}</div>
                            <p class="sb-foot">${st.gaps.fleetOnly.length} have no extractor family in the export; ${st.gaps.beltOnly.length} sit only in asteroid belts, where no stake can be placed. A plan that needs one of these is fed by a fleet, never by a stake alone.</p></div>
                    </div>
                </div>`;
            this.renderRawRows();
        }

        renderRawRows() {
            const el = document.getElementById('anRawRows'); if (!el) return;
            document.querySelectorAll('[data-raw-sort]').forEach(b => b.classList.toggle('on', b.dataset.rawSort === this.rawSort));
            const rows = this.raws.slice();
            const dep = r => r.deposit || { planets: 0, belts: 0, best: 0 };
            const cmp = {
                reach: (a, b) => b.reach - a.reach, demand: (a, b) => b.demand - a.demand, planets: (a, b) => dep(b).planets - dep(a).planets, rare: (a, b) => dep(a).planets - dep(b).planets,
                richness: (a, b) => dep(b).best - dep(a).best, tier: (a, b) => b.tier - a.tier || b.reach - a.reach, name: (a, b) => a.name.localeCompare(b.name)
            }[this.rawSort];
            rows.sort((a, b) => cmp(a, b) || a.name.localeCompare(b.name));
            const maxR = this.m.maxReach, maxP = Math.max(1, ...this.raws.map(r => dep(r).planets));
            el.innerHTML = `<div class="an-rk raw head"><span>#</span><span>Deposit</span><span>Reach</span><span>Direct</span><span>Planets</span><span>Belts</span><span>Best</span><span>Extractor</span></div>` +
                rows.map((r, i) => `<button type="button" class="an-rk raw" data-go="${esc(r.name)}"><span class="rk">${i + 1}</span><span class="nm"><i class="t t${r.tier}">T${r.tier}</i>${esc(r.name)}</span><span class="bar"><b style="width:${(100 * r.reach / maxR).toFixed(1)}%"></b><em>${num(r.reach)}</em></span><span class="n">${num(r.demand)}</span><span class="bar p"><b style="width:${(100 * dep(r).planets / maxP).toFixed(1)}%"></b><em>${num(dep(r).planets)}</em></span><span class="n">${num(dep(r).belts)}</span><span class="n">${dep(r).best}</span><span>${r.stakeMinable ? `<em class="ok">yes</em> <small>${r.extractor.t1 != null ? r.extractor.t1 + ' /tick' : ''}</small>` : (r.extractor ? '<em class="no">belts only</em>' : '<em class="no">fleet</em>')}</span></button>`).join('');
        }

        // ---- 5. gaps
        renderGaps() {
            const el = document.getElementById('anGaps'); const g = this.m.stats.gaps;
            const outs = g.outputsNotResources.reduce((a, [, n]) => a + n, 0);
            el.innerHTML = `
                <div class="an-head"><h3>Data gaps</h3><p>What this export leaves out, so a zero above reads as a gap and not as a fact.</p></div>
                <div class="an-gaps">
                    <div class="an-gap"><b>${g.noRecipe.length}</b><span>crafted resources with no recipe</span><p>${g.noRecipe.map(r => `<button type="button" class="rx-link" data-go="${esc(r.name)}">${esc(r.name)}</button>`).join(', ') || 'none'}</p></div>
                    <div class="an-gap"><b>${num(outs)}</b><span>recipe outputs that are not resources</span><p>${g.outputsNotResources.map(([t, n]) => `${esc(t.toLowerCase().replace(/_/g, ' '))} ${num(n)}`).join(' &middot; ')}. Buildings, ships and extractors are made by recipes but are not inventory, so they carry no card here; their ingredients still count toward demand.</p></div>
                    <div class="an-gap"><b>${g.stakeless.length}</b><span>raws no claim stake can mine</span><p>${g.fleetOnly.length} with no extractor family (${g.fleetOnly.map(r => esc(r.name)).join(', ')}) and ${g.beltOnly.length} found only in asteroid belts (${g.beltOnly.map(r => esc(r.name)).join(', ')}). The Stake Builder flags any plan that needs one.</p></div>
                    <div class="an-gap"><b>${num(g.stepsMismatch)}</b><span>production-step disagreements</span><p>Resources where the export's <i>productionSteps</i> differs from the depth computed from the recipe tree. The tree is what is shown.</p></div>
                    <div class="an-gap"><b>0</b><span>prices</span><p>The export carries no market data; <i>baseValue</i> is tier &times; 10 for every resource and <i>stackSize</i> is 100, so neither is shown anywhere in this explorer.</p></div>
                </div>`;
        }
    }

    window.ResourceAnalytics = ResourceAnalytics;
})();
