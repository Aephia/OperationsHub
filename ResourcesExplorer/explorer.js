// explorer.js - Resources Explorer, Explorer tab (rebuilt 2026-10-01).
// Cards carry what the export knows about a resource: tier, release status, where it comes from (deposits for a raw,
// the recipe for anything crafted), how many steps it sits from raw, and how many recipes ask for it. The three
// numbers the old cards showed (base value, stack size, id) were constants - value is tier x 10 and every stack is 100.
(function () {
    'use strict';

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const CAT = { raw: { label: 'Raw', color: '#dd7429' }, processed: { label: 'Processed', color: '#2a9fcf' }, component: { label: 'Component', color: '#2fa985' }, advanced: { label: 'Advanced', color: '#9476db' } };
    const SORTS = { demand: 'Most used', reach: 'Widest reach', name: 'Name', tier: 'Tier', depth: 'Steps from raw' };
    const PAGE = 120;

    class ResourcesExplorer {
        constructor(model) {
            this.m = model;
            this.filters = { q: '', cats: new Set(), tiers: new Set(), source: new Set(), sort: 'demand' };
            this.shown = PAGE;
            this.filtered = model.list.slice();
            this.renderSidebar();
            this.bind();
            this.apply();
        }

        snd(n) { if (window.spaceSounds && window.spaceSounds[n]) window.spaceSounds[n](); }

        renderSidebar() {
            const side = document.getElementById('rxSide'); if (!side) return;
            const st = this.m.stats;
            side.innerHTML = `
                <div class="rx-side-head"><h3>Find a resource</h3><span class="sb-count" id="rxCount"></span></div>
                <input type="text" id="searchInput" class="sb-input" placeholder="Name, e.g. Copper Ore, Power Regulation Module" autocomplete="off">
                <h4>Category</h4>
                <div class="chips" data-group="cats">${Object.entries(CAT).map(([k, c]) => `<button type="button" class="chip" data-v="${k}" style="--c:${c.color}"><i></i>${c.label} <small>${(st.byCat[k] || 0).toLocaleString()}</small></button>`).join('')}</div>
                <h4>Tier</h4>
                <div class="chips" data-group="tiers">${[1, 2, 3, 4, 5].map(t => `<button type="button" class="chip" data-v="${t}"><i class="t t${t}">T${t}</i><small>${(st.byTier[t] || 0).toLocaleString()}</small></button>`).join('')}</div>
                <h4>Comes from</h4>
                <div class="chips" data-group="source"><button type="button" class="chip" data-v="mined" style="--c:#dd7429"><i></i>Claim-stake extractor</button><button type="button" class="chip" data-v="fleet" style="--c:#ffd36b"><i></i>Fleet mining only</button><button type="button" class="chip" data-v="crafted" style="--c:#2a9fcf"><i></i>Crafted</button></div>
                <h4>Sort</h4>
                <select id="rxSort" class="sb-input">${Object.entries(SORTS).map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}</select>
                <button type="button" class="sb-btn ghost" id="rxClear">Clear filters</button>
                <p class="sb-foot">Value and stack size are not shown: the export gives every resource a value of tier &times; 10 and a stack of 100, so neither tells one resource from another.</p>`;
        }

        bind() {
            const side = document.getElementById('rxSide'), grid = document.getElementById('resourcesGrid');
            side.addEventListener('click', e => {
                const chip = e.target.closest('.chip');
                if (chip) {
                    const g = chip.closest('[data-group]').dataset.group, v = chip.dataset.v, set = this.filters[g];
                    set.has(v) ? set.delete(v) : set.add(v);
                    chip.classList.toggle('on', set.has(v));
                    this.snd(set.has(v) ? 'select' : 'deselect');
                    this.apply(); return;
                }
                if (e.target.id === 'rxClear') {
                    ['cats', 'tiers', 'source'].forEach(g => this.filters[g].clear());
                    this.filters.q = ''; const q = document.getElementById('searchInput'); if (q) q.value = '';
                    side.querySelectorAll('.chip.on').forEach(c => c.classList.remove('on'));
                    this.snd('deselect'); this.apply();
                }
            });
            side.addEventListener('change', e => { if (e.target.id === 'rxSort') { this.filters.sort = e.target.value; this.snd('click'); this.apply(); } });
            grid.addEventListener('click', e => {
                const more = e.target.closest('[data-more]'); if (more) { this.shown += PAGE; this.snd('click'); this.renderItems(); return; }
                const card = e.target.closest('.rc'); if (card) { this.snd('click'); window.resourceVisual && window.resourceVisual.open(card.dataset.name); }
            });
        }

        handleSearch(q) { this.filters.q = (q || '').trim().toLowerCase(); this.apply(); }

        apply() {
            const f = this.filters;
            this.filtered = this.m.list.filter(r =>
                (!f.q || r.name.toLowerCase().includes(f.q) || r.id.includes(f.q)) &&
                (!f.cats.size || f.cats.has(r.category)) &&
                (!f.tiers.size || f.tiers.has(String(r.tier))) &&
                (!f.source.size || f.source.has(r.source)));
            const cmp = {
                demand: (a, b) => b.demand - a.demand || b.reach - a.reach,
                reach: (a, b) => b.reach - a.reach || b.demand - a.demand,
                name: (a, b) => a.name.localeCompare(b.name),
                tier: (a, b) => a.tier - b.tier || b.demand - a.demand,
                depth: (a, b) => b.depth - a.depth || b.demand - a.demand
            }[f.sort];
            this.filtered.sort((a, b) => cmp(a, b) || a.name.localeCompare(b.name));
            this.shown = PAGE;
            this.renderItems(); this.updateStats();
        }

        line(r) {
            if (r.category === 'raw') {
                const d = r.deposit;
                if (!d) return 'No deposit on the map';
                const types = d.typeList.filter(t => t.cat !== 3).slice(0, 3).map(t => t.name).join(', ');
                return `Found on <b>${d.planets.toLocaleString()}</b> planets${d.belts ? ` and ${d.belts.toLocaleString()} belts` : ''} &middot; best richness ${d.best}${types ? ` &middot; ${esc(types)}` : ''}`;
            }
            if (!r.recipe || !r.ingredients.length) return 'No recipe makes it in this export';
            const parts = r.ingredients.slice(0, 4).map(i => `${esc(i.name)}${i.quantity > 1 ? ` &times;${i.quantity}` : ''}`);
            return `From ${parts.join(', ')}${r.ingredients.length > 4 ? ` and ${r.ingredients.length - 4} more` : ''}`;
        }

        card(r) {
            const c = CAT[r.category] || CAT.processed;
            const kind = r.category === 'raw'
                ? (r.stakeMinable ? 'Raw &middot; claim-stake extractor' : (r.beltOnly ? 'Raw &middot; belts only, fleet mining' : 'Raw &middot; fleet mining only'))
                : `${c.label} &middot; ${r.depth} step${r.depth === 1 ? '' : 's'} from raw`;
            const pct = Math.round(100 * r.demand / this.m.maxDemand);
            return `<article class="rc" data-name="${esc(r.name)}" style="--c:${c.color}">
                <div class="rc-head"><i class="t t${r.tier}">T${r.tier}</i><b class="rc-name">${esc(r.name)}</b></div>
                <div class="rc-kind">${kind}</div>
                <div class="rc-line">${this.line(r)}</div>
                <div class="rc-demand"><span>${r.demand ? `used by <b>${r.demand.toLocaleString()}</b> recipe${r.demand === 1 ? '' : 's'}` : 'not an ingredient anywhere'}${r.category === 'raw' && r.reach ? ` &middot; reaches <b>${r.reach.toLocaleString()}</b>` : ''}</span><i class="bar"><b style="width:${pct}%"></b></i></div>
            </article>`;
        }

        renderItems() {
            const grid = document.getElementById('resourcesGrid'); if (!grid) return;
            const items = this.filtered.slice(0, this.shown);
            if (!items.length) { grid.innerHTML = '<div class="rx-empty"><h3>No resources match</h3><p>Loosen a filter or clear the search.</p></div>'; return; }
            grid.innerHTML = items.map(r => this.card(r)).join('') +
                (this.filtered.length > this.shown ? `<button type="button" class="sb-more rc-more" data-more>Show ${Math.min(PAGE, this.filtered.length - this.shown)} more of ${(this.filtered.length - this.shown).toLocaleString()} remaining</button>` : '');
        }

        updateStats() {
            const c = document.getElementById('rxCount'); if (c) c.textContent = `${this.filtered.length.toLocaleString()} of ${this.m.list.length.toLocaleString()}`;
            const strip = document.getElementById('rxStats'); if (!strip || strip.dataset.done) return;
            const st = this.m.stats;
            strip.innerHTML = [[st.total, 'resources'], [st.byCat.raw, 'raw deposits'], [st.byCat.processed, 'processed'], [st.byCat.component, 'components'], [st.byCat.advanced, 'advanced'], [st.maxDepth, 'deepest chain (steps)']]
                .map(([n, l]) => `<div class="an-stat"><b>${(n || 0).toLocaleString()}</b><span>${l}</span></div>`).join('');
            strip.dataset.done = '1';
        }
    }

    ResourcesExplorer.CAT = CAT;
    window.ResourcesExplorer = ResourcesExplorer;
})();
