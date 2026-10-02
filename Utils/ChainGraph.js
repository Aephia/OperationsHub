// ChainGraph.js - layered SVG graph of a recipe DAG (2026-10-01), shared by the Resources Explorer (one resource's
// supply chain) and the Recipe Explorer (a production plan). Layout: layer = longest path from the root, one
// barycenter pass down, up, down; pills coloured by category; bezier edges with a dashed-flow animation (CSS).
// Pointer model: drag pans (pointer capture on the host), a click without movement opens the node, hover tracing comes
// from pointermove only and is cleared when the pointer leaves, mousedown is cancelled so a drag never selects text.
// The SVG is sized in pixels (k clamped) so nodes stay legible and wide chains pan.
(function () {
    'use strict';

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const CAT_LABEL = { raw: 'Raw', processed: 'Processed', component: 'Component', advanced: 'Advanced' };

    class ChainGraph {
        // opts: { onOpen(name), sound(name), label(node) -> second line text, edgeLabel(edge) -> title, kMax }
        constructor(host, opts) {
            this.host = host; this.opts = opts || {};
            this.g = null;
        }

        // dag: { root, nodes: Map(name -> {name, res, leaf}), edges: [{from, to, quantity, label?}] }
        layout(dag) {
            const layer = new Map(); layer.set(dag.root, 0);
            const kids = new Map(), parents = new Map();
            dag.edges.forEach(e => { (kids.get(e.from) || kids.set(e.from, []).get(e.from)).push(e); (parents.get(e.to) || parents.set(e.to, []).get(e.to)).push(e); });
            const order = []; const state = new Map();
            const visit = n => { if (state.get(n)) return; state.set(n, 1); (kids.get(n) || []).forEach(e => visit(e.to)); state.set(n, 2); order.push(n); };
            visit(dag.root); order.reverse();
            order.forEach(n => { (kids.get(n) || []).forEach(e => { layer.set(e.to, Math.max(layer.get(e.to) || 0, (layer.get(n) || 0) + 1)); }); });
            const rows = []; layer.forEach((l, n) => { (rows[l] = rows[l] || []).push(n); });
            const W = n => Math.min(176, Math.max(92, 14 + 7.2 * n.length)), GAP = 16, ROW = 92;
            const pos = new Map();
            rows.forEach(row => row.sort());
            const place = row => { const widths = row.map(W); const total = widths.reduce((a, b) => a + b, 0) + GAP * (row.length - 1); let x = -total / 2; row.forEach((n, i) => { pos.set(n, { x: x + widths[i] / 2, w: widths[i] }); x += widths[i] + GAP; }); };
            rows.forEach(place);
            const bary = (row, rel) => { const key = new Map(row.map(n => { const es = rel.get(n) || []; const xs = es.map(e => pos.get(rel === parents ? e.from : e.to)).filter(Boolean).map(p => p.x); return [n, xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : (pos.get(n) || { x: 0 }).x]; })); row.sort((a, b) => key.get(a) - key.get(b)); place(row); };
            for (let i = 1; i < rows.length; i++) bary(rows[i], parents);
            for (let i = rows.length - 2; i >= 1; i--) bary(rows[i], kids);
            for (let i = 1; i < rows.length; i++) bary(rows[i], parents);
            const nodes = []; let minX = Infinity, maxX = -Infinity;
            rows.forEach((row, l) => row.forEach(n => { const p = pos.get(n); const d = dag.nodes.get(n); nodes.push({ name: n, x: p.x, y: l * ROW, w: p.w, layer: l, res: d && d.res, data: d }); minX = Math.min(minX, p.x - p.w / 2); maxX = Math.max(maxX, p.x + p.w / 2); }));
            return { nodes, rows: rows.length, minX, maxX, height: (rows.length - 1) * ROW + 44, kids, parents };
        }

        draw(dag) {
            const host = this.host, L = this.layout(dag), H = 40, PAD = 24;
            const byName = new Map(L.nodes.map(n => [n.name, n]));
            const label = this.opts.label || (n => n.res ? `T${n.res.tier} · ${CAT_LABEL[n.res.category] || ''}` : '');
            const edges = dag.edges.map(e => {
                const a = byName.get(e.from), b = byName.get(e.to); if (!a || !b) return '';
                const x1 = a.x, y1 = a.y + H / 2, x2 = b.x, y2 = b.y - H / 2, c = (y2 - y1) * 0.5;
                const cat = (b.res && b.res.category) || (b.data && b.data.cat) || 'processed';
                const title = this.opts.edgeLabel ? this.opts.edgeLabel(e) : `${e.from} needs ${e.to} ×${e.quantity}`;
                return `<path class="ed cat-${cat}" data-from="${esc(e.from)}" data-to="${esc(e.to)}" d="M${x1.toFixed(1)},${y1.toFixed(1)} C${x1.toFixed(1)},${(y1 + c).toFixed(1)} ${x2.toFixed(1)},${(y2 - c).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}"><title>${esc(title)}</title></path>`;
            }).join('');
            const nodes = L.nodes.map(n => {
                const cat = (n.res && n.res.category) || (n.data && n.data.cat) || 'processed';
                const text = n.name.length > 24 ? n.name.slice(0, 23) + '…' : n.name;
                const sub = label(n);
                return `<g class="nd cat-${cat}${n.layer === 0 ? ' root' : ''}" data-name="${esc(n.name)}" transform="translate(${n.x.toFixed(1)},${n.y.toFixed(1)})"><g class="in" style="animation-delay:${Math.min(1200, n.layer * 70)}ms"><rect x="${(-n.w / 2).toFixed(1)}" y="${-H / 2}" width="${n.w.toFixed(1)}" height="${H}" rx="9"/><text class="nm" y="${sub ? -2 : 5}">${esc(text)}</text>${sub ? `<text class="tr" y="13">${esc(sub)}</text>` : ''}<title>${esc(n.name)}</title></g></g>`;
            }).join('');
            const vbW = (L.maxX - L.minX) + PAD * 2, vbH = L.height + PAD * 2;
            host.innerHTML = `<svg class="cg-svg" viewBox="${(L.minX - PAD).toFixed(1)} ${-PAD - H / 2} ${vbW.toFixed(1)} ${vbH.toFixed(1)}"><g class="edges">${edges}</g><g class="nodes">${nodes}</g></svg>`;
            this.g = { svg: host.querySelector('svg'), kids: L.kids, parents: L.parents, vbW, vbH, k: 1, s: 1, tx: 0, ty: 0, hover: null };
            if (!host.dataset.cgBound) { host.dataset.cgBound = '1'; this.bind(); }
            this.fit();
            return L;
        }

        fit() {
            const g = this.g; if (!g) return;
            const hw = this.host.clientWidth || 800, hh = this.host.clientHeight || 520;
            g.k = Math.max(0.6, Math.min(this.opts.kMax || 1.8, hw / g.vbW, hh / g.vbH));
            g.svg.setAttribute('width', (g.vbW * g.k).toFixed(0)); g.svg.setAttribute('height', (g.vbH * g.k).toFixed(0));
            g.s = 1; g.tx = 0; g.ty = 0; this.apply();
        }

        apply() { const g = this.g; if (g && g.svg) g.svg.style.transform = `translate(calc(-50% + ${g.tx}px), ${g.ty}px) scale(${g.s})`; }

        bind() {
            const host = this.host; let drag = null;
            const snd = n => { if (this.opts.sound) this.opts.sound(n); };
            host.addEventListener('mousedown', e => e.preventDefault());
            host.addEventListener('dragstart', e => e.preventDefault());
            host.addEventListener('pointerdown', e => { const g = this.g; if (e.button !== 0 || !g) return; drag = { x: e.clientX, y: e.clientY, tx: g.tx, ty: g.ty, moved: false }; host.setPointerCapture(e.pointerId); });
            host.addEventListener('pointermove', e => {
                const g = this.g; if (!g) return;
                if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 3) { drag.moved = true; this.trace(null); } g.tx = drag.tx + dx; g.ty = drag.ty + dy; this.apply(); return; }
                const nd = e.target.closest('.nd'); const name = nd ? nd.dataset.name : null;
                if (name !== g.hover) { g.hover = name; this.trace(name); }
            });
            const up = e => { if (!drag) return; const was = drag; drag = null; if (!was.moved) { const nd = e.target.closest('.nd'); if (nd && this.opts.onOpen) { snd('click'); this.trace(null); this.opts.onOpen(nd.dataset.name); } } };
            host.addEventListener('pointerup', up); host.addEventListener('pointercancel', () => { drag = null; });
            host.addEventListener('pointerleave', () => { if (!drag && this.g) { this.g.hover = null; this.trace(null); } });
            host.addEventListener('wheel', e => { const g = this.g; if (!g) return; e.preventDefault(); const f = e.deltaY < 0 ? 1.15 : 1 / 1.15; g.s = Math.max(0.3, Math.min(4, g.s * f)); this.apply(); }, { passive: false });
        }

        trace(name) {
            const g = this.g; if (!g || !g.svg || !g.svg.isConnected) return;
            g.svg.classList.toggle('tracing', !!name);
            g.svg.querySelectorAll('.hi, .hov').forEach(el => el.classList.remove('hi', 'hov'));
            if (!name) return;
            const own = g.svg.querySelector(`.nd[data-name="${CSS.escape(name)}"]`); if (own) own.classList.add('hov');
            const up = new Set(), down = new Set();
            const walkUp = n => { if (up.has(n)) return; up.add(n); (g.parents.get(n) || []).forEach(e => walkUp(e.from)); };
            const walkDown = n => { if (down.has(n)) return; down.add(n); (g.kids.get(n) || []).forEach(e => walkDown(e.to)); };
            walkUp(name); walkDown(name);
            const lit = new Set([...up, ...down]);
            g.svg.querySelectorAll('.nd').forEach(el => { if (lit.has(el.dataset.name)) el.classList.add('hi'); });
            g.svg.querySelectorAll('.ed').forEach(el => { const a = el.dataset.from, b = el.dataset.to; if ((up.has(a) && up.has(b)) || (down.has(a) && down.has(b))) el.classList.add('hi'); });
        }
    }

    window.ChainGraph = ChainGraph;
})();
