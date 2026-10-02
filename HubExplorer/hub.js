// hub.js - Hub Explorer UI (rebuilt 2026-10-01). Two tabs, everything always visible:
//   Builder - left, the catalogue of hab assets (hab tiers, crafting stations, cargo storages, landing pads,
//             decorations) with step and cumulative figures; right, the hab build: one hab tier, any number of the
//             rest, gauges (slots, storage, jobs, throughput), the module bill, install + craft time, and a hand-off
//             that opens the whole build in the Recipe Explorer's planner (?plan=) for the raw bill.
//   Ladders - the five ladders as HTML-bar charts: what each tier/size gives and what reaching it costs from nothing.
(function () {
    'use strict';

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const num = v => (v || 0).toLocaleString();
    const fmtTime = sec => { if (!sec) return '0 s'; if (sec < 60) return Math.round(sec) + ' s'; const m = Math.round(sec / 60); if (m < 60) return m + ' min'; const h = Math.floor(m / 60), mm = m % 60; if (h < 48) return h + ' h' + (mm ? ' ' + mm + ' min' : ''); return (h / 24).toFixed(1) + ' days'; };
    const KIND_COLOR = { hab: '#4fd8ff', station: '#2fa985', storage: '#dd7429', pad: '#9476db', decor: '#ffd36b' };
    const KEY = 'hubExplorer.plan.v1';

    class HubBuilder {
        constructor(model) {
            this.m = model;
            this.items = this.load();
            this.renderCatalogue(); this.bind(); this.renderPlan();
        }
        snd(n) { if (window.spaceSounds && window.spaceSounds[n]) window.spaceSounds[n](); }
        load() { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter(x => x && this.m.byId.has(x.id)).map(x => ({ id: x.id, qty: Math.max(1, Math.min(999, +x.qty || 1)) })) : []; } catch (e) { return []; } }
        save() { try { localStorage.setItem(KEY, JSON.stringify(this.items)); } catch (e) { /* storage unavailable */ } }

        card(i) {
            const inPlan = this.items.find(x => x.id === i.id);
            const facts = i.kind === 'hab' ? [[num(i.slots), 'slots'], [num(i.storage), 'storage'], [i.jobs, 'job'], [fmtTime(i.installTime), 'install']]
                : i.kind === 'station' ? [[i.speed + '×', 'speed'], [i.jobs, 'jobs'], [num(i.slots), 'slots'], [fmtTime(i.installTime), 'install']]
                : i.kind === 'storage' ? [['+' + num(i.storage), 'storage'], ['+' + i.jobs, 'jobs'], [i.slots, 'slots'], [fmtTime(i.installTime), 'install']]
                : [[i.recipe ? i.recipe.ingredients.length : 0, 'ingredients'], [i.recipe ? fmtTime(i.recipe.constructionTime) : '–', 'craft'], [i.recipe ? 'L' + String(i.recipe.min_starbase_level || '').replace(/\D/g, '') : '–', 'starbase'], [i.size || ('T' + i.tier), i.size ? 'size' : 'tier']];
            const modules = Object.keys(i.cost).length ? Object.entries(i.cost).map(([k, v]) => `${esc(this.m.label(k))}${v > 1 ? ' ×' + v : ''}`).join(', ') : (i.recipe ? i.recipe.ingredients.map(x => esc(x.name)).join(', ') : '');
            return `<article class="hb-card${inPlan ? ' in' : ''}" data-id="${esc(i.id)}" style="--c:${KIND_COLOR[i.kind]}">
                <div class="hb-head"><b>${esc(i.name)}</b>${i.tier ? `<i class="t t${i.tier}">T${i.tier}</i>` : ''}${i.size ? `<em class="hb-size">${esc(i.size)}</em>` : ''}<button type="button" class="rp-add" data-add="${esc(i.id)}" title="${i.kind === 'hab' ? 'Use this hab' : 'Add to the build'}">${inPlan ? (i.kind === 'hab' ? '✓' : '+1') : '+'}</button></div>
                <div class="rx-facts hb-facts">${facts.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>
                <div class="hb-line">${i.prevItem ? `<span class="hb-prev">consumes ${esc(i.prevItem.name)}</span> + ` : ''}${modules || '<span class="sb-muted">no modules listed</span>'}</div>
                ${i.cumInstall != null && i.prevItem ? `<div class="hb-line sb-muted">from nothing: ${Object.keys(i.cumCost).length} module kinds, ${num(Object.values(i.cumCost).reduce((a, b) => a + b, 0))} modules, ${fmtTime(i.cumInstall)} install${i.cumCraft ? ', ' + fmtTime(i.cumCraft) + ' craft' : ''}</div>` : ''}
                ${i.recipe ? `<a class="hb-link" href="../RecipeExplorer/index.html?recipe=${encodeURIComponent(i.recipe.outputId)}" target="_blank" rel="noopener">craft it &rarr; raw bill in the Recipe Explorer</a>` : '<span class="hb-link sb-muted">no crafting recipe in this export</span>'}
            </article>`;
        }

        renderCatalogue() {
            const el = document.getElementById('hbCatalogue'); if (!el) return;
            const L = this.m.ladders;
            const section = (title, note, rows) => `<section class="hb-section"><div class="rx-panel-head"><h3>${title}</h3><span>${note}</span></div><div class="hb-grid">${rows.map(i => this.card(i)).join('')}</div></section>`;
            el.innerHTML = section('Hab tiers', 'one per build; each tier consumes the previous', L.hab)
                + section('Crafting stations', 'each size consumes the previous; throughput = jobs × speed', L.station)
                + section('Cargo storage', 'each tier consumes the previous', L.storage)
                + section('Landing pads', 'from the recipes only: the hab export does not list them', L.pad)
                + section('Decorations', 'from the recipes only', L.decor);
        }

        bind() {
            const root = document.getElementById('explorerTab');
            root.addEventListener('click', e => {
                const add = e.target.closest('[data-add]'); if (add) { this.add(add.dataset.add); return; }
                const rm = e.target.closest('[data-remove]'); if (rm) { this.items = this.items.filter(i => i.id !== rm.dataset.remove); this.snd('deselect'); this.save(); this.renderCatalogue(); this.renderPlan(); return; }
                const clr = e.target.closest('[data-plan-clear]'); if (clr) { this.items = []; this.snd('deselect'); this.save(); this.renderCatalogue(); this.renderPlan(); return; }
            });
            root.addEventListener('change', e => { const q = e.target.closest('[data-qty]'); if (q) { const it = this.items.find(i => i.id === q.dataset.qty); if (it) { it.qty = Math.max(1, Math.min(999, parseInt(q.value, 10) || 1)); q.value = it.qty; this.save(); this.renderPlan(); } } });
        }

        add(id) {
            const item = this.m.byId.get(id); if (!item) return;
            if (item.kind === 'hab') { this.items = this.items.filter(i => this.m.byId.get(i.id).kind !== 'hab'); this.items.unshift({ id, qty: 1 }); }
            else { const it = this.items.find(i => i.id === id); if (it) it.qty = Math.min(999, it.qty + 1); else this.items.push({ id, qty: 1 }); }
            this.snd('success'); this.save(); this.renderCatalogue(); this.renderPlan();
        }

        gauge(label, used, cap, color, note) {
            const pct = cap ? Math.min(100, 100 * used / cap) : 0, over = cap && used > cap;
            return `<div class="hb-gauge${over ? ' over' : ''}"><div class="hb-gauge-head"><span>${label}</span><b>${num(used)}${cap != null ? ' / ' + num(cap) : ''}</b></div><div class="hb-gauge-bar"><b style="width:${cap ? pct.toFixed(1) : (used ? 100 : 0)}%;background:${color}"></b></div>${note ? `<small>${note}</small>` : ''}</div>`;
        }

        renderPlan() {
            const el = document.getElementById('hbPlan'); if (!el) return;
            if (!this.items.length) { el.innerHTML = `<div class="rp-empty"><h3>Hab build</h3><p>Pick a hab tier with <b>+</b>, then add crafting stations, cargo storage, landing pads and decorations. The build shows the slots, storage and jobs you end up with, every module to bring, and hands the whole thing to the Recipe Explorer for the raw bill.</p></div>`; return; }
            const p = this.plan = this.m.plan(this.items);
            const hab = p.hab;
            const stationRows = p.rows.filter(x => x.item.kind === 'station');
            const slotRows = p.rows.filter(x => x.item.kind !== 'hab' && x.item.slots != null);
            const noSlotRows = p.rows.filter(x => x.item.kind !== 'hab' && x.item.slots == null);
            const slotsUsed = p.slotsUsed;
            const maxBill = Math.max(1, ...p.bill.map(b => b.n));
            const planParam = p.recipesForPlanner.map(r => `${r.id}:${r.qty}`).join(',');
            el.innerHTML = `
                <div class="rp-items">
                    ${p.rows.map(({ it, item }) => `<div class="rp-item" style="--c:${KIND_COLOR[item.kind]}"><span class="rp-item-name"><i class="dot" style="background:${KIND_COLOR[item.kind]}"></i>${esc(item.name)}<small>${esc(item.kindLabel)}</small></span>${item.kind === 'hab' ? '' : `<label>&times;<input type="number" min="1" max="999" value="${it.qty}" data-qty="${esc(it.id)}"></label>`}<button type="button" class="rp-x" data-remove="${esc(it.id)}" title="Remove">&times;</button></div>`).join('')}
                    <button type="button" class="sb-btn ghost" data-plan-clear>Clear build</button>
                </div>
                ${!hab ? '<p class="rx-note warn">No hab tier chosen yet: the slot gauge needs one.</p>' : ''}
                <div class="hb-gauges">
                    ${this.gauge('Slots', slotsUsed, hab ? hab.slots : null, '#4fd8ff', hab ? (slotsUsed > hab.slots ? `over by ${num(slotsUsed - hab.slots)}: ${hab.name} gives ${hab.slots} slots` : `${hab.name} gives ${hab.slots} slots · ${num(hab.slots - slotsUsed)} free`) : 'pick a hab tier')}
                    ${this.gauge('Storage', p.storage, null, '#dd7429', hab ? `${num(hab.storage)} from the hab + ${num(p.storage - hab.storage)} from cargo storage` : '')}
                    ${this.gauge('Jobs', p.jobs, null, '#2fa985', `${hab ? hab.jobs + ' from the hab' : ''}${stationRows.length ? ' + stations' : ''}${slotRows.some(x => x.item.jobs) ? ' + storage bonuses' : ''}`)}
                    ${this.gauge('Throughput (jobs × speed)', p.throughput, null, '#9476db', 'relative: a station at 2× speed with 5 jobs counts 10')}
                </div>
                ${slotRows.length ? `<p class="rx-note">Slots taken: ${slotRows.map(x => `${x.it.qty} × ${esc(x.item.name)} (${num(x.item.slots)} each)`).join(', ')} - the export's own figures.${noSlotRows.length ? ` ${noSlotRows.map(x => esc(x.item.name)).join(', ')}: no slot figure in the export, counted as 0.` : ''}</p>` : (noSlotRows.length ? `<p class="rx-note">${noSlotRows.map(x => esc(x.item.name)).join(', ')}: no slot figure in the export, counted as 0.</p>` : '')}
                <div class="rp-sheet hb-sheet">
                    <section class="rx-panel">
                        <div class="rx-panel-head"><h3>Modules to bring</h3><span>${num(p.bill.reduce((a, b) => a + b.n, 0))} modules of ${p.bill.length} kinds · from the hab export's cost lists</span></div>
                        <div class="ch">${p.bill.map(b => `<div class="ch-row"><span class="ch-lbl">${b.res ? `<i class="t t${b.res.tier}">T${b.res.tier}</i>` : ''}${esc(b.name)}</span><div class="ch-bar"><b style="width:${(100 * b.n / maxBill).toFixed(1)}%;background:#4fd8ff"><span class="ct">${esc(b.name)}: ${num(b.n)}</span></b></div><span class="ch-val">${num(b.n)}</span></div>`).join('') || '<p class="sb-muted">nothing yet</p>'}</div>
                    </section>
                    <section class="rx-panel">
                        <div class="rx-panel-head"><h3>Time and hand-off</h3></div>
                        <div class="rx-facts"><div><b>${fmtTime(p.install)}</b><span>install time, all items</span></div><div><b>${fmtTime(p.craft)}</b><span>craft time of the assets</span></div><div><b>${p.rows.reduce((a, x) => a + x.it.qty, 0)}</b><span>items</span></div><div><b>${p.recipesForPlanner.length}</b><span>recipes to craft</span></div></div>
                        <p class="rx-note">Install time is the hab export's <i>constructionTime</i>; craft time is each asset's recipe time. Both read as seconds. Each tier's cost already includes the previous tier, so a T3 hab built from nothing needs the T1 and T2 modules too - the catalogue cards show that cumulative figure.</p>
                        ${planParam ? `<div class="rx-actions"><a class="sb-btn" href="../RecipeExplorer/index.html?plan=${encodeURIComponent(planParam)}" target="_blank" rel="noopener">Raw bill for the whole build &rarr; Recipe Explorer</a></div>` : ''}
                    </section>
                </div>`;
        }
    }

    // --------------------------------------------------------------- ladders tab
    class HubLadders {
        constructor(model) { this.m = model; }
        renderAnalytics() {
            const root = document.getElementById('analyticsContent'); if (!root) return;
            const L = this.m.ladders;
            const bars = (rows, val, color, fmt) => { const max = Math.max(1, ...rows.map(val)); return rows.map(r => `<div class="ch-row"><span class="ch-lbl">${esc(r.name.replace(/^Hab /, '').replace(/^Crafting Hab /, 'Hab '))}</span><div class="ch-bar"><b style="width:${(100 * val(r) / max).toFixed(1)}%;background:${color}"><span class="ct">${esc(r.name)}: ${fmt ? fmt(val(r)) : num(val(r))}</span></b></div><span class="ch-val">${fmt ? fmt(val(r)) : num(val(r))}</span></div>`).join(''); };
            const chart = (title, rows, val, color, fmt) => `<div class="ch"><h4>${title}</h4>${bars(rows, val, color, fmt)}</div>`;
            const modulesOf = r => Object.entries(r.cumCost).map(([k, v]) => `${esc(this.m.label(k))}${v > 1 ? ' ×' + v : ''}`).join(', ');
            root.innerHTML = `
                <div class="an-root">
                    <div class="an-stats">${[[L.hab.length, 'hab tiers'], [L.station.length, 'station sizes'], [L.storage.length, 'storage tiers'], [L.pad.length, 'landing pads'], [L.decor.length, 'decorations'], [this.m.recipes.length, 'hab-asset recipes']].map(([n, l]) => `<div class="an-stat"><b>${num(n)}</b><span>${l}</span></div>`).join('')}</div>
                    <section class="an-section"><div class="an-head"><h3>Hab tiers</h3><p>What a hab gives at each tier, and what reaching it from nothing costs. Each tier consumes the previous one, so the cumulative figures add every lower tier's modules and install time.</p></div>
                        <div class="an-three">${chart('Slots', L.hab, r => r.slots, '#4fd8ff')}${chart('Storage', L.hab, r => r.storage, '#dd7429')}${chart('Install time from nothing', L.hab, r => r.cumInstall, '#9476db', fmtTime)}</div>
                        <div class="an-tablewrap"><table class="an-table"><thead><tr><th></th>${L.hab.map(r => `<th><span class="t t${r.tier}">T${r.tier}</span></th>`).join('')}</tr></thead><tbody>
                            <tr><th>Slots / storage / jobs</th>${L.hab.map(r => `<td>${r.slots} / ${num(r.storage)} / ${r.jobs}</td>`).join('')}</tr>
                            <tr><th>Crafting fee / XP</th>${L.hab.map(r => `<td>${r.fee} / ${num(r.xp)}</td>`).join('')}</tr>
                            <tr><th>Install (this tier)</th>${L.hab.map(r => `<td>${fmtTime(r.installTime)}</td>`).join('')}</tr>
                            <tr><th>Modules from nothing</th>${L.hab.map(r => `<td><small>${modulesOf(r)}</small></td>`).join('')}</tr>
                            <tr><th>Craft the asset (recipe)</th>${L.hab.map(r => `<td>${r.recipe ? `${fmtTime(r.recipe.constructionTime)} · ${r.recipe.ingredients.length} ingr. · L${String(r.recipe.min_starbase_level || '').replace(/\D/g, '')}` : '–'}</td>`).join('')}</tr>
                        </tbody></table></div></section>
                    <section class="an-section"><div class="an-head"><h3>Crafting stations</h3><p>Speed and concurrent jobs per size; throughput is jobs × speed, relative to a single 1× job. Each size consumes the previous.</p></div>
                        <div class="an-three">${chart('Speed', L.station, r => r.speed, '#2fa985', v => v + '×')}${chart('Jobs', L.station, r => r.jobs, '#4fd8ff')}${chart('Throughput', L.station, r => r.throughput, '#9476db', v => v.toLocaleString(undefined, { maximumFractionDigits: 2 }))}</div>
                        <div class="an-tablewrap"><table class="an-table"><thead><tr><th></th>${L.station.map(r => `<th>${esc(r.size)}</th>`).join('')}</tr></thead><tbody>
                            <tr><th>Speed / jobs / throughput</th>${L.station.map(r => `<td>${r.speed}× / ${r.jobs} / ${r.throughput}</td>`).join('')}</tr>
                            <tr><th>Slots it takes</th>${L.station.map(r => `<td>${num(r.slots)}</td>`).join('')}</tr>
                            <tr><th>Install (this size) / from nothing</th>${L.station.map(r => `<td>${fmtTime(r.installTime)} / ${fmtTime(r.cumInstall)}</td>`).join('')}</tr>
                            <tr><th>Modules from nothing</th>${L.station.map(r => `<td><small>${modulesOf(r)}</small></td>`).join('')}</tr>
                        </tbody></table></div></section>
                    <section class="an-section"><div class="an-head"><h3>Cargo storage</h3><p>Storage and job bonus per tier against the slots it takes. Each tier consumes the previous.</p></div>
                        <div class="an-three">${chart('Storage bonus', L.storage, r => r.storage, '#dd7429')}${chart('Storage per slot', L.storage, r => r.slots ? r.storage / r.slots : 0, '#ffd36b')}${chart('Install time from nothing', L.storage, r => r.cumInstall, '#9476db', fmtTime)}</div>
                        <div class="an-tablewrap"><table class="an-table"><thead><tr><th></th>${L.storage.map(r => `<th><span class="t t${r.tier}">T${r.tier}</span></th>`).join('')}</tr></thead><tbody>
                            <tr><th>Storage / job bonus / slots</th>${L.storage.map(r => `<td>+${num(r.storage)} / +${r.jobs} / ${r.slots}</td>`).join('')}</tr>
                            <tr><th>Modules from nothing</th>${L.storage.map(r => `<td><small>${modulesOf(r)}</small></td>`).join('')}</tr>
                        </tbody></table></div></section>
                    <section class="an-section"><div class="an-head"><h3>Landing pads and decorations</h3><p>The hab export lists neither; their recipes do. Each pad size consumes the previous.</p></div>
                        <div class="an-tablewrap"><table class="an-table"><thead><tr><th>Asset</th><th>Craft time</th><th>Ingredients</th><th>Starbase</th></tr></thead><tbody>
                            ${[...L.pad, ...L.decor].map(r => `<tr><th>${esc(r.name)}</th><td>${r.recipe ? fmtTime(r.recipe.constructionTime) : '–'}</td><td><small>${r.recipe ? r.recipe.ingredients.map(i => esc(i.name) + (i.quantity > 1 ? ' ×' + i.quantity : '')).join(', ') : ''}</small></td><td>L${r.recipe ? String(r.recipe.min_starbase_level || '').replace(/\D/g, '') : '–'}</td></tr>`).join('')}
                        </tbody></table></div></section>
                </div>`;
        }
    }

    window.HubBuilder = HubBuilder; window.HubLadders = HubLadders;
})();
