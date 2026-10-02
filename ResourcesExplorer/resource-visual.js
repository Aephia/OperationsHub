// resource-visual.js - the resource sheet (2026-10-01): a full-screen overlay with the supply-chain graph, the source
// panel (galaxy map of the deposit for a raw, the recipe for anything crafted), the demand panel and the raw bill.
// Graph: the deduplicated DAG from resource-model, laid out in layers (longest path from the output), one barycenter
// pass per layer, pills coloured by category, bezier edges with a dashed-flow animation (CSS, paused when hidden).
// Drag to pan, wheel to zoom, hover a node to light its whole upstream/downstream path, click a node to open it.
(function () {
    'use strict';

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const CAT = { raw: { label: 'Raw', color: '#dd7429' }, processed: { label: 'Processed', color: '#2a9fcf' }, component: { label: 'Component', color: '#2fa985' }, advanced: { label: 'Advanced', color: '#9476db' } };
    const FAC_COLOR = { mud: '#ff6040', oni: '#3ec8ff', ustur: '#b98cff', none: '#8a93a8' };
    const FAC_LABEL = { mud: 'MUD', oni: 'ONI', ustur: 'USTUR' };
    const PT_COLOR = ['#3fae79', '#e2512b', '#b7a58a', '#9a9a9a', '#d99a4e', '#7fd0ff', '#6b70b8', '#2f8cff'];
    const fmtTime = sec => { if (!sec) return '0 s'; if (sec < 60) return sec + ' s'; const m = Math.round(sec / 60); if (m < 60) return m + ' min'; const h = Math.floor(m / 60), mm = m % 60; return h + ' h' + (mm ? ' ' + mm + ' min' : ''); };
    const num = (v, d) => (typeof v === 'number' ? v.toLocaleString(undefined, { maximumFractionDigits: d == null ? 3 : d }) : '0');

    class ResourceVisual {
        constructor(model) {
            this.m = model;
            this.history = [];
            this.overlay = null;
            this.mapBox = null;
            this._esc = e => { if (e.key === 'Escape') this.close(); };
        }

        snd(n) { if (window.spaceSounds && window.spaceSounds[n]) window.spaceSounds[n](); }

        open(name, push = true) {
            const r = this.m.byName.get(name); if (!r) return;
            if (push && this.current && this.current !== name) this.history.push(this.current);
            if (!push) { /* back navigation */ }
            this.current = name;
            if (!this.overlay) {
                this.overlay = document.createElement('div');
                this.overlay.className = 'rx-modal';
                document.body.appendChild(this.overlay);
                document.addEventListener('keydown', this._esc);
                this.overlay.addEventListener('click', e => {
                    if (e.target === this.overlay || e.target.closest('[data-close]')) { this.close(); return; }
                    const back = e.target.closest('[data-back]'); if (back) { const prev = this.history.pop(); if (prev) { this.snd('click'); this.open(prev, false); } return; }
                    const go = e.target.closest('[data-go]'); if (go) { this.snd('click'); this.open(go.dataset.go); return; }
                    const fit = e.target.closest('[data-fit]'); if (fit) { this.fitGraph(); return; }
                });
                this.snd('openPopup');
                document.body.classList.add('rx-modal-open');
            }
            this.render(r);
        }

        close() {
            if (!this.overlay) return;
            this.overlay.remove(); this.overlay = null; this.current = null; this.history = [];
            document.removeEventListener('keydown', this._esc);
            document.body.classList.remove('rx-modal-open');
            this.snd('closePopup');
        }

        // ------------------------------------------------------------- sheet
        render(r) {
            const c = CAT[r.category] || CAT.processed;
            const dag = this.m.dag(r.name);
            const bill = this.m.rawBill(r.name);
            this.overlay.innerHTML = `
                <div class="rx-sheet" style="--c:${c.color}">
                    <button type="button" class="rx-x" data-close aria-label="Close">&times;</button>
                    <header class="rx-head">
                        ${this.history.length ? `<button type="button" class="sb-btn ghost rx-back" data-back>&larr; ${esc(this.history[this.history.length - 1])}</button>` : ''}
                        <div class="rx-title"><i class="t t${r.tier}">T${r.tier}</i><h2>${esc(r.name)}</h2><em class="rc-status ${r.live ? 'live' : 'unr'}">${r.statusLabel}</em></div>
                        <div class="rx-badges">
                            <span class="badge" style="--c:${c.color}"><i></i>${c.label}</span>
                            <span class="badge">${r.category === 'raw' ? (r.stakeMinable ? 'claim-stake extractor' : (r.beltOnly ? 'belts only: fleet mining' : 'fleet mining only')) : (r.recipe && r.ingredients.length ? `${r.depth} step${r.depth === 1 ? '' : 's'} from raw` : 'no recipe')}</span>
                            ${r.category !== 'raw' && dag.nodes.size > 1 ? `<span class="badge">${(dag.nodes.size - 1).toLocaleString()} resources in its chain</span>` : ''}
                            <span class="badge">${r.demand ? `ingredient of ${r.demand.toLocaleString()} recipe${r.demand === 1 ? '' : 's'}` : 'not an ingredient anywhere'}</span>
                            ${r.category === 'raw' ? `<span class="badge">reaches ${r.reach.toLocaleString()} crafted resources</span>` : ''}
                        </div>
                    </header>
                    <div class="rx-body">
                        <section class="rx-graph-wrap">
                            <div class="rx-panel-head"><h3>Supply chain</h3><span>${r.category === 'raw' ? 'A raw has no chain under it; its map is on the right.' : (dag.nodes.size > 1 ? `${(dag.nodes.size - 1).toLocaleString()} resources, ${dag.edges.length.toLocaleString()} links, ${dag.depth} levels &middot; drag to pan, wheel to zoom, hover a node to trace it, click to open it` : 'This resource has no recipe in the export.')}</span>${dag.nodes.size > 1 ? '<button type="button" class="sb-btn ghost" data-fit>Fit</button>' : ''}</div>
                            <div class="rx-graph" id="rxGraph">${dag.nodes.size > 1 ? '' : this.rawPortrait(r)}</div>
                            ${bill.length ? `<div class="rx-bill"><h4>Raw bill &middot; ${bill.length} deposit${bill.length === 1 ? '' : 's'} under it</h4><div class="chips">${bill.map(b => `<button type="button" class="chip${b.res.extractor ? '' : ' fleet'}" data-go="${esc(b.res.name)}" title="${b.res.extractor ? 'claim-stake extractor exists' : 'fleet mining only'} - feeds ${b.parents} recipe${b.parents === 1 ? '' : 's'} in this chain"><i class="t t${b.res.tier}">T${b.res.tier}</i>${esc(b.res.name)}<small>&times;${b.parents}</small></button>`).join('')}</div></div>` : ''}
                        </section>
                        <aside class="rx-side">
                            ${this.sourcePanel(r)}
                            ${this.demandPanel(r)}
                        </aside>
                    </div>
                </div>`;
            if (dag.nodes.size > 1) this.drawGraph(dag);
            if (r.category === 'raw' && r.deposit) this.drawMap(r);
            this.overlay.querySelector('.rx-sheet').scrollTop = 0;
        }

        rawPortrait(r) {
            const c = CAT.raw.color;
            const how = r.stakeMinable ? `A claim stake on a planet that carries it can run a ${esc(r.name)} Extractor (${num(r.extractor.t1)} per tick at tier 1).`
                : r.beltOnly ? `It occurs only in asteroid belts${r.extractor ? ', and although an extractor kit exists' : ''}, no claim stake can sit on a belt, so a fleet mines it.`
                : 'No extractor family exists for it in this export, so a fleet mines it (asteroid belts included).';
            return `<div class="rx-raw-portrait"><div class="rx-ore" style="--c:${c}"><i></i><i></i><i></i></div><p>${esc(r.name)} is a raw deposit. ${how}</p></div>`;
        }

        // ------------------------------------------------------------- panels
        sourcePanel(r) {
            if (r.category === 'raw') {
                const d = r.deposit;
                if (!d) return '<section class="rx-panel"><div class="rx-panel-head"><h3>Where it is found</h3></div><p class="sb-muted">No planet on the map carries this deposit.</p></section>';
                const terr = ['mud', 'oni', 'ustur'].filter(f => d.fac[f]).map(f => `<em class="f-${f}">${FAC_LABEL[f]} ${d.fac[f].toLocaleString()}</em>`).join('');
                return `<section class="rx-panel">
                    <div class="rx-panel-head"><h3>Where it is found</h3><span>${d.systemList.length.toLocaleString()} of ${this.m.systems.length.toLocaleString()} systems</span></div>
                    <div class="rx-map" id="rxMap"></div>
                    <div class="rx-facts">
                        <div><b>${d.planets.toLocaleString()}</b><span>planets</span></div>
                        <div><b>${d.belts.toLocaleString()}</b><span>asteroid belts</span></div>
                        <div><b>${d.best}</b><span>best richness</span></div>
                        <div><b>${r.extractor ? num(r.extractor.t1) : '&ndash;'}</b><span>${r.stakeMinable ? 'per tick, T1 extractor' : (r.extractor ? 'kit exists, no planet to stake' : 'no extractor kit')}</span></div>
                    </div>
                    <div class="rx-row"><h4>Territory</h4><div class="rx-terr">${terr || '<span class="sb-muted">none</span>'}</div></div>
                    <div class="rx-row"><h4>Planet types</h4><div class="chips">${d.typeList.map(t => `<span class="chip static" style="--c:${PT_COLOR[t.cat]}"><i></i>${esc(t.name)} <small>${t.n.toLocaleString()}</small></span>`).join('')}</div></div>
                    ${d.regionList.length ? `<div class="rx-row"><h4>Regions</h4><p class="rx-regions">${d.regionList.slice(0, 8).map(g => `<span>${esc(g.name)}<small>${g.n}${g.safe ? '' : ' &middot; risk'}</small></span>`).join('')}${d.regionList.length > 8 ? `<span class="sb-muted">+${d.regionList.length - 8} more</span>` : ''}</p></div>` : ''}
                    <div class="rx-row"><h4>Richest bodies</h4><div class="rx-planets">${d.top.map(p => `<div class="rx-pl"><i class="pdot" style="--c:${PT_COLOR[p.cat]}"></i><b>${esc(p.name)}</b><span>${esc(p.system)}</span><em class="f-${p.terr}">${FAC_LABEL[p.terr] || ''}</em><span class="rv">${p.richness}${p.belt ? ' belt' : ''}</span></div>`).join('')}</div></div>
                    <div class="rx-actions"><a class="sb-btn" href="../ClaimStakeExplorer/index.html" title="Deposit atlas and Stake Builder">Plan a stake &rarr;</a><a class="sb-btn ghost" href="../PlanetExplorer/index.html">Planet Explorer &rarr;</a></div>
                </section>`;
            }
            const rec = r.recipe;
            if (!rec || !r.ingredients.length) return `<section class="rx-panel"><div class="rx-panel-head"><h3>How it is made</h3></div><p class="sb-muted">${rec ? 'The recipe lists no ingredients.' : 'No recipe in this export produces it.'}</p></section>`;
            const where = (rec.planetTypes || []).map(t => t.replace(/ Planet$/, '')).join(', ');
            return `<section class="rx-panel">
                <div class="rx-panel-head"><h3>How it is made</h3><span>${esc(rec.resourceType || '')}${rec.outputType ? ' &middot; ' + esc(rec.outputType.toLowerCase()) : ''}</span></div>
                <div class="rx-ings">${r.ingredients.map(i => `<button type="button" class="rx-ing" data-go="${esc(i.name)}" style="--c:${(i.res && CAT[i.res.category] || CAT.processed).color}"><i></i><b>${esc(i.name)}</b>${i.res ? `<em class="t t${i.res.tier}">T${i.res.tier}</em>` : ''}<span>&times;${i.quantity}</span></button>`).join('')}</div>
                <div class="rx-facts">
                    <div><b>${fmtTime(rec.constructionTime)}</b><span>build time</span></div>
                    <div><b>${rec.productionSteps != null ? rec.productionSteps : r.depth}</b><span>production steps</span></div>
                    <div><b>${esc(String(rec.min_starbase_level || '').replace('Level', 'L') || '&ndash;')}</b><span>starbase level</span></div>
                    <div><b>${r.ingredients.length}</b><span>ingredients</span></div>
                </div>
                ${where ? `<div class="rx-row"><h4>Crafted on</h4><p class="rx-where">${esc(where)}${(rec.factions || []).length && rec.factions.length < 3 ? ` &middot; ${rec.factions.map(esc).join(', ')} only` : ''}</p></div>` : ''}
                ${rec.research_requirements && rec.research_requirements.length ? `<div class="rx-row"><h4>Research</h4><p class="rx-where">${rec.research_requirements.map(x => esc(typeof x === 'string' ? x : (x.name || JSON.stringify(x)))).join(', ')}</p></div>` : ''}
                <div class="rx-actions"><a class="sb-btn" href="../RecipeExplorer/index.html?search=${encodeURIComponent(r.name)}" target="_blank" rel="noopener">Open in Recipe Explorer &rarr;</a></div>
            </section>`;
        }

        demandPanel(r) {
            const top = r.consumers.slice().sort((a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name)).slice(0, 8);
            const maxQ = Math.max(1, ...top.map(x => x.quantity));
            const byType = new Map(); r.consumers.forEach(x => byType.set(x.type || 'other', (byType.get(x.type || 'other') || 0) + 1));
            const types = Array.from(byType.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
            return `<section class="rx-panel">
                <div class="rx-panel-head"><h3>Who asks for it</h3><span>${r.demand ? `${r.demand.toLocaleString()} recipes, ${r.liveDemand.toLocaleString()} live` : 'nothing lists it as an ingredient'}</span></div>
                ${r.demand ? `
                <div class="ch rx-cons">${top.map(x => `<div class="ch-row"><button type="button" class="ch-lbl rx-link" data-go="${esc(x.name)}" title="${esc(x.name)}">${esc(x.name)}</button><div class="ch-bar"><b style="width:${Math.round(100 * x.quantity / maxQ)}%"><span class="ct">${esc(x.name)}: &times;${num(x.quantity, 0)} per craft${x.tier ? ' &middot; T' + x.tier : ''}${x.status === 'v1' ? ' &middot; live' : ''}</span></b></div><span class="ch-val">&times;${num(x.quantity, 0)}</span></div>`).join('')}</div>
                <p class="rx-note">Largest quantities per craft. ${r.demand > 8 ? `${(r.demand - 8).toLocaleString()} more recipes use it.` : ''}</p>
                <div class="rx-row"><h4>By product type</h4><div class="chips">${types.map(([t, n]) => `<span class="chip static">${esc(t.toLowerCase().replace(/_/g, ' '))} <small>${n.toLocaleString()}</small></span>`).join('')}</div></div>` : ''}
            </section>`;
        }

        // ------------------------------------------------------------- graph
        layout(dag) {
            // layer = longest path from the root (so an ingredient used at two depths sits below both users)
            const layer = new Map(); layer.set(dag.root, 0);
            const kids = new Map(), parents = new Map();
            dag.edges.forEach(e => { (kids.get(e.from) || kids.set(e.from, []).get(e.from)).push(e); (parents.get(e.to) || parents.set(e.to, []).get(e.to)).push(e); });
            const order = []; const state = new Map();
            const visit = n => { if (state.get(n) === 2) return; if (state.get(n) === 1) return; state.set(n, 1); (kids.get(n) || []).forEach(e => visit(e.to)); state.set(n, 2); order.push(n); };
            visit(dag.root); order.reverse();
            order.forEach(n => { (kids.get(n) || []).forEach(e => { layer.set(e.to, Math.max(layer.get(e.to) || 0, (layer.get(n) || 0) + 1)); }); });
            const rows = []; layer.forEach((l, n) => { (rows[l] = rows[l] || []).push(n); });
            const W = n => Math.min(176, Math.max(92, 14 + 7.2 * n.length)), GAP = 16, ROW = 92;
            const pos = new Map();
            // first pass: alphabetical, then two barycenter passes (down, then up) to untangle
            rows.forEach(row => row.sort());
            const place = row => { let x = 0; const widths = row.map(W); const total = widths.reduce((a, b) => a + b, 0) + GAP * (row.length - 1); x = -total / 2; row.forEach((n, i) => { pos.set(n, { x: x + widths[i] / 2, w: widths[i] }); x += widths[i] + GAP; }); };
            rows.forEach(place);
            const bary = (row, rel) => { const key = new Map(row.map(n => { const es = rel.get(n) || []; const xs = es.map(e => pos.get(rel === parents ? e.from : e.to)).filter(Boolean).map(p => p.x); return [n, xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : (pos.get(n) || { x: 0 }).x]; })); row.sort((a, b) => key.get(a) - key.get(b)); place(row); };
            for (let i = 1; i < rows.length; i++) bary(rows[i], parents);
            for (let i = rows.length - 2; i >= 1; i--) bary(rows[i], kids);
            for (let i = 1; i < rows.length; i++) bary(rows[i], parents);
            const nodes = []; let minX = Infinity, maxX = -Infinity;
            rows.forEach((row, l) => row.forEach(n => { const p = pos.get(n); nodes.push({ name: n, x: p.x, y: l * ROW, w: p.w, layer: l, res: dag.nodes.get(n).res }); minX = Math.min(minX, p.x - p.w / 2); maxX = Math.max(maxX, p.x + p.w / 2); }));
            return { nodes, rows: rows.length, minX, maxX, height: (rows.length - 1) * ROW + 44, kids, parents };
        }

        drawGraph(dag) {
            const host = document.getElementById('rxGraph'); if (!host) return;
            const L = this.layout(dag);
            const byName = new Map(L.nodes.map(n => [n.name, n]));
            const H = 40, PAD = 24;
            const edges = dag.edges.map(e => {
                const a = byName.get(e.from), b = byName.get(e.to);
                const x1 = a.x, y1 = a.y + H / 2, x2 = b.x, y2 = b.y - H / 2, c = (y2 - y1) * 0.5;
                const cat = (b.res && b.res.category) || 'processed';
                return `<path class="ed cat-${cat}" data-from="${esc(e.from)}" data-to="${esc(e.to)}" d="M${x1.toFixed(1)},${y1.toFixed(1)} C${x1.toFixed(1)},${(y1 + c).toFixed(1)} ${x2.toFixed(1)},${(y2 - c).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}"><title>${esc(e.from)} needs ${esc(e.to)} &times;${e.quantity}</title></path>`;
            }).join('');
            const nodes = L.nodes.map(n => {
                const cat = (n.res && n.res.category) || 'processed';
                const label = n.name.length > 24 ? n.name.slice(0, 23) + '…' : n.name;
                // the layout transform lives on the outer group; the reveal animation runs on the inner one so CSS never overrides it
                return `<g class="nd cat-${cat}${n.layer === 0 ? ' root' : ''}" data-name="${esc(n.name)}" transform="translate(${n.x.toFixed(1)},${n.y.toFixed(1)})"><g class="in" style="animation-delay:${Math.min(1200, n.layer * 70)}ms"><rect x="${(-n.w / 2).toFixed(1)}" y="${-H / 2}" width="${n.w.toFixed(1)}" height="${H}" rx="9"/><text class="nm" y="${n.res ? -2 : 5}">${esc(label)}</text>${n.res ? `<text class="tr" y="13">T${n.res.tier} &middot; ${CAT[n.res.category] ? CAT[n.res.category].label : ''}${n.res.demand ? ' &middot; ' + n.res.demand.toLocaleString() + ' uses' : ''}</text>` : ''}<title>${esc(n.name)}</title></g></g>`;
            }).join('');
            const vbW = (L.maxX - L.minX) + PAD * 2, vbH = L.height + PAD * 2;
            host.innerHTML = `<svg class="rx-svg" viewBox="${(L.minX - PAD).toFixed(1)} ${-PAD - H / 2} ${vbW.toFixed(1)} ${vbH.toFixed(1)}"><g class="edges">${edges}</g><g class="nodes">${nodes}</g></svg>`;
            this.graph = { host, svg: host.querySelector('svg'), kids: L.kids, parents: L.parents, vbW, vbH, k: 1, s: 1, tx: 0, ty: 0 };
            this.bindGraph();
            this.fitGraph();
        }

        // Size the SVG in pixels: fit the host when the chain is small, otherwise keep nodes legible (k >= 0.6) and let
        // the user pan; zoom (s) and pan (tx, ty) are a CSS transform on the SVG itself, origin top centre.
        fitGraph() {
            const g = this.graph; if (!g) return;
            const hw = g.host.clientWidth || 800, hh = g.host.clientHeight || 520;
            g.k = Math.max(0.6, Math.min(1.8, hw / g.vbW, hh / g.vbH));
            g.svg.setAttribute('width', (g.vbW * g.k).toFixed(0)); g.svg.setAttribute('height', (g.vbH * g.k).toFixed(0));
            g.s = 1; g.tx = 0; g.ty = 0; this.applyPan();
        }

        applyPan() { const g = this.graph; g.svg.style.transform = `translate(calc(-50% + ${g.tx}px), ${g.ty}px) scale(${g.s})`; }

        bindGraph() {
            const g = this.graph; let drag = null;
            g.host.addEventListener('pointerdown', e => { if (e.button !== 0) return; drag = { x: e.clientX, y: e.clientY, tx: g.tx, ty: g.ty, moved: false }; g.host.setPointerCapture(e.pointerId); });
            g.host.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true; g.tx = drag.tx + dx; g.ty = drag.ty + dy; this.applyPan(); });
            const up = e => { if (!drag) return; const was = drag; drag = null; if (!was.moved) { const nd = e.target.closest('.nd'); if (nd) { this.snd('click'); this.open(nd.dataset.name); } } };
            g.host.addEventListener('pointerup', up); g.host.addEventListener('pointercancel', () => { drag = null; });
            g.host.addEventListener('wheel', e => { e.preventDefault(); const f = e.deltaY < 0 ? 1.15 : 1 / 1.15; g.s = Math.max(0.3, Math.min(4, g.s * f)); this.applyPan(); }, { passive: false });
            g.host.addEventListener('pointerover', e => { const nd = e.target.closest('.nd'); if (nd) this.trace(nd.dataset.name); });
            g.host.addEventListener('pointerout', e => { const nd = e.target.closest('.nd'); if (nd && !e.relatedTarget?.closest?.('.nd')) this.trace(null); });
        }

        trace(name) {
            const g = this.graph; if (!g) return;
            g.svg.classList.toggle('tracing', !!name);
            g.svg.querySelectorAll('.hi').forEach(el => el.classList.remove('hi'));
            if (!name) return;
            const up = new Set(), down = new Set();
            const walkUp = n => { if (up.has(n)) return; up.add(n); (g.parents.get(n) || []).forEach(e => walkUp(e.from)); };
            const walkDown = n => { if (down.has(n)) return; down.add(n); (g.kids.get(n) || []).forEach(e => walkDown(e.to)); };
            walkUp(name); walkDown(name);
            const lit = new Set([...up, ...down]);
            g.svg.querySelectorAll('.nd').forEach(el => { if (lit.has(el.dataset.name)) el.classList.add('hi'); });
            g.svg.querySelectorAll('.ed').forEach(el => { const a = el.dataset.from, b = el.dataset.to; if ((up.has(a) && up.has(b)) || (down.has(a) && down.has(b))) el.classList.add('hi'); });
        }

        // --------------------------------------------------------------- map
        drawMap(r) {
            const host = document.getElementById('rxMap'); if (!host) return;
            const d = r.deposit, sys = this.m.systems;
            if (!this.mapBox) {
                const xs = sys.map(s => s.xy[0]), ys = sys.map(s => s.xy[1]);
                const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
                this.mapBox = { x0, y0, w: x1 - x0 || 1, h: y1 - y0 || 1 };
            }
            const B = this.mapBox, W = 420, H = Math.round(420 * B.h / B.w), pad = 10;
            const P = xy => [pad + (xy[0] - B.x0) / B.w * (W - pad * 2), H - pad - (xy[1] - B.y0) / B.h * (H - pad * 2)];
            const lit = new Map(d.systemList.map(s => [s.key, s]));
            const dim = sys.filter(s => !lit.has(s.key)).map(s => { const [x, y] = P(s.xy); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.3" fill="${FAC_COLOR[s.terr] || FAC_COLOR.none}"/>`; }).join('');
            const hot = d.systemList.map(s => { const [x, y] = P(s.xy); const rr = 2.2 + Math.min(4, s.best) * 0.9; return `<g class="hot" style="animation-delay:${Math.round(Math.random() * 1200)}ms"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(rr * 2.6).toFixed(1)}" class="glow" fill="${FAC_COLOR[s.terr] || FAC_COLOR.none}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${FAC_COLOR[s.terr] || FAC_COLOR.none}"><title>${esc(s.name)} &middot; ${s.n} bod${s.n === 1 ? 'y' : 'ies'} &middot; best richness ${s.best}</title></circle></g>`; }).join('');
            host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="rx-map-svg"><g class="dim" opacity="0.35">${dim}</g><g class="lit">${hot}</g></svg><div class="rx-map-key"><span><i style="background:${FAC_COLOR.mud}"></i>MUD</span><span><i style="background:${FAC_COLOR.oni}"></i>ONI</span><span><i style="background:${FAC_COLOR.ustur}"></i>USTUR</span><span class="sb-muted">bright = carries ${esc(r.name)}, size = richness</span></div>`;
        }
    }

    window.ResourceVisual = ResourceVisual;
})();
