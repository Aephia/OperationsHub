// deck-map.js - Command Deck, the Empire map (2026-10-26). Output only: it draws the stakes and fleets placed in the
// Empire tab's steps on the galaxy map, and the ledger under it says what the whole thing makes, burns and moves per
// hour. Its one click is a planet (zoomed in to its orrery), which opens that planet's details card.
//   - one plan: the stakes and fleets are the Empire tab's own (commandDeck.empire.v1); the cards and the schedule
//     further down read the same lists
//   - trips are Loadout.trip / Loadout.mine (deck-loadout.js) over the straight-line distance between two systems,
//     read as AU; hulls fly their Default configuration
// Drag to pan, wheel to zoom. Motion budget: none (the map redraws on input only).
(function () {
    'use strict';

    const { esc, num, dur, snd } = window.DeckUI;
    const Store = window.DeckStore;
    const FAC_COLOR = { mud: '#ff4444', oni: '#5b6bff', ustur: '#ffaa00' };
    const FAC_LABEL = { mud: 'MUD', oni: 'ONI', ustur: 'USTUR' };
    const TIER_COLOR = ['#888', '#b9c6d6', '#7ee8a4', '#4fd8ff', '#c38bff', '#ffb86b'];
    const TASK_LABEL = { mine: 'Mine', haul: 'Haul output', supply: 'R4 supply' };
    const W = 1000, H = 560, LABEL_CAP = 160;
    // planet-level zoom: a system's orrery is drawn once its radius (a share of the gap to its nearest neighbour) is at
    // least ORRERY_PX on screen; at most ORRERY_CAP systems at once (the ones nearest the centre of the view)
    const ORRERY_PX = 26, ORRERY_CAP = 60, SYS_R = 0.42, MAX_S = 2500, O0 = 0.75, O1 = 8.25;
    const plural = (n, one, many) => `${num(n)} ${n === 1 ? one : (many || one + 's')}`;
    const au = d => (d == null ? '–' : `${num(d, d < 10 ? 2 : 1)} AU`);
    // an R4 need as words: "Fuel 6,866, Food 1,214" (basics with no need left out; all zero -> "none")
    const R4_SHORT = { Fuel: 'Fuel', Food: 'Food', Ammunition: 'Ammo', 'Repair Kit': 'Repair Kits' };
    const r4List = need => Object.entries(need).filter(([, v]) => v > 1e-9).map(([k, v]) => `${R4_SHORT[k] || k} ${num(v)}`).join(', ') || 'none';

    class EmpireMap {
        constructor(tab) {
            this.tab = tab; this.G = tab.ctx.galaxy; this.se = tab.se;
            this.q = ''; this.view = null; this.drag = null;
            this.bodiesBySys = new Map();
            this.se.planets.forEach(p => { (this.bodiesBySys.get(p.sysKey) || this.bodiesBySys.set(p.sysKey, []).get(p.sysKey)).push(p); });
            this.bind();
        }

        // ------------------------------------------------------------------ view (world units -> the svg's pixels)
        fit() {
            const xs = this.G.systems.map(s => s.xy[0]), ys = this.G.systems.map(s => s.xy[1]);
            const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
            return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, s: Math.min(W / (x1 - x0 + 6), H / (y1 - y0 + 6)) };
        }
        v() { return this.view || (this.view = this.fit()); }
        P(xy) { const v = this.v(); return [W / 2 + (xy[0] - v.cx) * v.s, H / 2 - (xy[1] - v.cy) * v.s]; }   // north up
        toPx(e, svg) { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
        zoomTo(sysKey, s) { const sys = this.G.byKey.get(sysKey); if (!sys) return; const v = this.v(); this.view = { cx: sys.xy[0], cy: sys.xy[1], s: Math.max(v.s, s || 0) }; }

        // ------------------------------------------------------------------ events (delegated on the tab root)
        bind() {
            const root = this.tab.root;
            root.addEventListener('click', e => {
                const q = sel => e.target.closest(sel); let el;
                if ((el = q('[data-m-fit]'))) { this.view = null; snd('click'); this.redraw(); return; }
            });
            root.addEventListener('pointerdown', e => {
                const svg = e.target.closest('#cdmSvg'); if (!svg || e.button !== 0) return;
                const [px, py] = this.toPx(e, svg), v = this.v(), hit = e.target.closest('[data-pkey]');
                this.drag = { svg, px, py, cx: v.cx, cy: v.cy, moved: 0, pkey: hit ? hit.dataset.pkey : null };
                svg.setPointerCapture(e.pointerId);
            });
            root.addEventListener('pointermove', e => {
                const d = this.drag; if (!d) return;
                const [px, py] = this.toPx(e, d.svg), v = this.v();
                d.moved = Math.max(d.moved, Math.hypot(px - d.px, py - d.py));
                if (d.moved < 4) return;
                this.view = { cx: d.cx - (px - d.px) / v.s, cy: d.cy + (py - d.py) / v.s, s: v.s };
                this.redraw();
            });
            // the map is output only: the one click it answers is a planet (zoomed in to the orreries), which opens its details
            root.addEventListener('pointerup', () => { const d = this.drag; this.drag = null; if (d && d.moved < 4 && d.pkey) this.openPlanet(d.pkey); });
            root.addEventListener('wheel', e => {
                const svg = e.target.closest('#cdmSvg'); if (!svg) return;
                e.preventDefault();
                const [px, py] = this.toPx(e, svg), v = this.v(), f = Math.exp(-e.deltaY * 0.0015);
                const s = Math.max(this.fit().s * 0.8, Math.min(MAX_S, v.s * f));
                const wx = v.cx + (px - W / 2) / v.s, wy = v.cy - (py - H / 2) / v.s;         // keep the point under the pointer
                this.view = { cx: wx - (px - W / 2) / s, cy: wy + (py - H / 2) / s, s };
                this.redraw();
            }, { passive: false });
        }

        // ------------------------------------------------------------------ html
        html(ops) {
            this.ops = ops;
            const own = this.G.css(Store.s.faction);
            return `<section class="rx-panel cd-mappanel">
                <div class="rx-panel-head"><h3>Empire map</h3><span>what steps 1-3 add up to · hover for names · drag to pan, wheel to zoom</span><button type="button" class="sb-btn ghost" data-m-fit>Fit</button></div>
                <div class="cd-map-box">
                    <svg class="cd-map" id="cdmSvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Galaxy map with your stakes and fleet routes">${this.svgInner()}</svg>
                    <div class="cd-map-key"><span><i style="background:${FAC_COLOR.mud}"></i>MUD</span><span><i style="background:${FAC_COLOR.oni}"></i>ONI</span><span><i style="background:${FAC_COLOR.ustur}"></i>USTUR</span><span><i class="ring"></i>starbase (size = level)</span><span><i class="star"></i>CSS - the market</span><span><i class="pinkey"></i>your stake (tier)</span><span><i class="ln mine"></i>mining run</span><span><i class="ln haul"></i>haul</span><span><i class="ln supply"></i>R4 supply</span>${own ? `<span class="sb-muted">your CSS: ${esc(own.name)}</span>` : ''}</div>
                </div>
            </section>`;
        }
        redraw() { const svg = this.tab.root.querySelector('#cdmSvg'); if (svg) svg.innerHTML = this.svgInner(); }

        // a system's orrery radius in map units: SYS_R, shrunk where a neighbour sits closer than ~1 unit
        sysR(s) {
            if (!this._nn) {
                this._nn = new Map(); const L = this.G.systems;
                L.forEach(a => { let m = Infinity; L.forEach(b => { if (a !== b) { const d = Math.hypot(a.xy[0] - b.xy[0], a.xy[1] - b.xy[1]); if (d < m) m = d; } }); this._nn.set(a.key, m); });
            }
            return Math.min(SYS_R, 0.45 * (this._nn.get(s.key) || 1));
        }
        // one system as an orrery around its map position: the Cycles star and planet sprites (PlanetExplorer/orrery.js),
        // rings by the export's orbit, bodies at its angle, sprites turned so the lit side faces the star. Fills bodyXY.
        orreryAt(s, c, Rpx) {
            const O = window.Orrery, raw = s.raw || {}, star = raw.star || { type: 2, scale: 1 };
            const st = O.STAR_STYLE[star.type] ? star.type : 2, starR = Math.max(3, Rpx * 0.075 * Math.min(1.6, (star.scale || 1) * O.STAR_STYLE[st].r));
            const rMin = starR + Rpx * 0.14, ring = orbit => rMin + (Rpx - rMin) * Math.min(1, Math.max(0, ((orbit || O0) - O0) / (O1 - O0)));
            const sh = starR / O.STAR_R, labels = Rpx > 110;
            let g = `<image href="${O.ART}star_${st}_384.webp" x="${(c[0] - sh).toFixed(1)}" y="${(c[1] - sh).toFixed(1)}" width="${(2 * sh).toFixed(1)}" height="${(2 * sh).toFixed(1)}" pointer-events="none"/>`;
            let bodies = '', lab = '';
            (raw.planets || []).forEach((p, i) => {
                const key = s.key + ':' + i, pl = this.se.planetByKey.get(key), cat = getPlanetCategory(p.type), cs = O.CATEGORY_STYLE[cat] || O.CATEGORY_STYLE['Barren Planet'];
                const r = ring(p.orbit), a = ((p.angle || 0) - 90) * Math.PI / 180, x = c[0] + r * Math.cos(a), y = c[1] + r * Math.sin(a);
                const name = `${esc(p.name)} - ${esc(cat)}${pl && pl.deposits.size ? ` · ${pl.deposits.size} deposits` : ''} · click for details`;
                g += `<circle class="oring" cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="${r.toFixed(1)}"></circle>`;
                if (cat === 'Asteroid Belt') {
                    bodies += `<circle class="obelt" cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="${r.toFixed(1)}" stroke="${cs.base}" stroke-width="${Math.max(1.5, Rpx * 0.025).toFixed(1)}" stroke-dasharray="${Math.max(2, Rpx * 0.02).toFixed(1)} ${Math.max(3, Rpx * 0.035).toFixed(1)}"></circle>`;
                    // the belt's hit target: a small handle where its angle points, plus the ring itself
                    bodies += `<circle class="ohit" data-pkey="${esc(key)}" cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="transparent" stroke-width="${Math.max(8, Rpx * 0.06).toFixed(1)}"><title>${name}</title></circle>`;
                    this.bodyXY.set(key, [x, y, Math.max(4, Rpx * 0.03)]);
                } else {
                    const pr = Math.max(2.2, Rpx * (0.018 + (p.scale || 0.2) * 0.075)), h = pr / O.PLANET_R, toStar = a * 180 / Math.PI + 180;
                    bodies += `<image href="${O.planetArt(p, cs.slug, 128)}" x="${(x - h).toFixed(1)}" y="${(y - h).toFixed(1)}" width="${(2 * h).toFixed(1)}" height="${(2 * h).toFixed(1)}" transform="rotate(${(toStar - O.LIGHT_DEG).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" pointer-events="none"/>`;
                    bodies += `<circle class="ohit" data-pkey="${esc(key)}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${Math.max(pr, 6).toFixed(1)}" fill="transparent"><title>${name}</title></circle>`;
                    this.bodyXY.set(key, [x, y, pr]);
                }
                if (labels) lab += `<text class="olb" x="${(x + 7).toFixed(1)}" y="${(y - 6).toFixed(1)}">${esc(p.name)}</text>`;
            });
            return g + bodies + lab;
        }

        svgInner() {
            const v = this.v(), G = this.G, ops = this.ops || { fleets: [] }, tab = this.tab;
            const inView = ([x, y], m) => x > -m && x < W + m && y > -m && y < H + m;
            const labelAll = v.s > 30, labelBases = v.s > 13;
            this.bodyXY = new Map();
            // which systems open into orreries at this zoom (the nearest the centre first, ORRERY_CAP at most)
            const open = new Set();
            G.systems.map(s => ({ s, p: this.P(s.xy), R: this.sysR(s) * v.s })).filter(o => o.R >= ORRERY_PX && inView(o.p, o.R))
                .sort((a, b) => Math.hypot(a.p[0] - W / 2, a.p[1] - H / 2) - Math.hypot(b.p[0] - W / 2, b.p[1] - H / 2)).slice(0, ORRERY_CAP).forEach(o => open.add(o.s.key));
            let dots = '', labels = '', orr = '', nLab = 0;
            G.systems.forEach(s => {
                const p = this.P(s.xy); if (!inView(p, open.has(s.key) ? this.sysR(s) * v.s : 10)) return;
                const c = FAC_COLOR[s.terr] || '#777';
                if (open.has(s.key)) {
                    const R = this.sysR(s) * v.s;
                    orr += `<g class="orr"><circle class="ozone" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(R * 1.08).toFixed(1)}" stroke="${c}"></circle>${this.orreryAt(s, p, R)}</g>`;
                    if (nLab < LABEL_CAP) { nLab++; labels += `<text class="lb sysname${s.sb === 6 ? ' css' : ''}" x="${p[0].toFixed(1)}" y="${(p[1] - R * 1.08 - 5).toFixed(1)}" text-anchor="middle">${esc(s.name)}${s.sb === 6 ? ' · CSS' : s.sb ? ` · L${s.sb} starbase` : ''}</text>`; }
                    return;
                }
                if (s.sb === 6) dots += `<path class="css" d="${star(p[0], p[1], 9, 4)}" fill="${c}"><title>${esc(s.name)} - ${FAC_LABEL[s.terr] || ''} CSS, the market</title></path>`;
                else if (s.sb > 0) dots += `<circle class="sb" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(1.8 + s.sb * 0.55).toFixed(1)}" fill="${c}" stroke="${c}"><title>${esc(s.name)} - Level ${s.sb} starbase</title></circle>`;
                else dots += `<circle class="sy" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="1.4" fill="${c}"><title>${esc(s.name)} - no starbase</title></circle>`;
                if (nLab < LABEL_CAP && (s.sb === 6 || (labelBases && s.sb > 0) || labelAll)) { nLab++; labels += `<text class="lb${s.sb === 6 ? ' css' : ''}" x="${(p[0] + 6).toFixed(1)}" y="${(p[1] + 3).toFixed(1)}">${esc(s.name)}</text>`; }
            });
            // routes: one line per fleet with a destination
            let routes = '';
            ops.fleets.forEach(f => {
                const from = f.task === 'mine' ? f.body && f.body.sysKey : f.stake && f.stake.planet.sysKey, to = f.dest && f.dest.key;
                if (!from || !to) return;
                const fromBody = this.bodyXY.get(f.task === 'mine' ? f.body.key : f.stake.planet.key);   // zoomed into the orrery: start at the planet itself
                const a = fromBody ? [fromBody[0], fromBody[1]] : this.P(G.byKey.get(from).xy), b = this.P(G.byKey.get(to).xy);
                const [p, q] = f.task === 'supply' ? [b, a] : [a, b];
                routes += `<line class="rt ${f.task}" x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}"><title>${esc(f.label)} · ${esc(TASK_LABEL[f.task])} · ${au(f.d)}</title></line>`;
                const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], ang = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
                routes += `<path class="ar ${f.task}" d="M-5,-4 L4,0 L-5,4 z" transform="translate(${m[0].toFixed(1)},${m[1].toFixed(1)}) rotate(${ang.toFixed(0)})"></path>`;
            });
            // mining fleets: a diamond on the body's system
            let fleets = '';
            ops.fleets.filter(f => f.task === 'mine' && f.body).forEach(f => {
                const b = this.bodyXY.get(f.body.key), p = b ? [b[0] - b[2] - 6, b[1]] : this.P(G.byKey.get(f.body.sysKey).xy); if (!inView(p, 10)) return;
                fleets += `<path class="fm" d="M${p[0].toFixed(1)},${(p[1] - 6).toFixed(1)} l5,6 l-5,6 l-5,-6 z"><title>${esc(f.label)} mining ${esc(f.raw)} at ${esc(f.body.name)}</title></path>`;
            });
            // stakes: a pin per stake, fanned out when a system holds several
            let pins = '';
            const bySys = new Map(); tab.stakes.forEach(s => { const pl = this.se.planetByKey.get(s.key); if (pl) (bySys.get(pl.sysKey) || bySys.set(pl.sysKey, []).get(pl.sysKey)).push({ s, pl }); });
            bySys.forEach((list, key) => {
                const c = this.P(G.byKey.get(key).xy); if (!inView(c, open.has(key) ? this.sysR(G.byKey.get(key)) * v.s : 40)) return;
                // zoomed into the orrery: each pin sits on its own planet
                if (open.has(key)) {
                    list.forEach(({ s, pl }) => { const b = this.bodyXY.get(pl.key); if (!b) return; const x = b[0] + b[2] * 0.75, y = b[1] - b[2] * 0.75; pins += `<g class="pin"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${TIER_COLOR[s.tier]}"></circle><text class="pt" x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="middle">${s.tier}</text><title>Your T${s.tier} stake on ${esc(pl.name)}</title></g>`; });
                    return;
                }
                list.forEach(({ s, pl }, i) => {
                    const ang = list.length > 1 ? (i / list.length) * 2 * Math.PI - Math.PI / 2 : 0, r = list.length > 1 ? 11 : 0;
                    const x = c[0] + r * Math.cos(ang), y = c[1] + r * Math.sin(ang);
                    pins += `<g class="pin"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${TIER_COLOR[s.tier]}"></circle><text class="pt" x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="middle">${s.tier}</text><title>T${s.tier} stake on ${esc(pl.name)} (${esc(pl.system)})</title></g>`;
                    if (i === 0) pins += `<text class="pl" x="${(c[0] + 11 + r).toFixed(1)}" y="${(c[1] - 7).toFixed(1)}">${esc(list.length > 1 ? `${pl.system} · ${list.length} stakes` : pl.name)}</text>`;
                });
            });
            // the selection and the search hits
            let marks = '';
            this.hits().slice(0, 40).forEach(h => { const b = h.p && this.bodyXY.get(h.p.key), p = b ? [b[0], b[1]] : this.P(G.byKey.get(h.sys).xy); if (inView(p, 0)) marks += `<circle class="hit" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${b ? Math.max(8, b[2] + 4).toFixed(1) : 8}"></circle>`; });
            const hint = open.size ? '' : v.s > 10 ? `<text class="zhint" x="${W - 10}" y="${H - 10}" text-anchor="end">zoom in further to open the systems into planets</text>` : '';
            return `<rect class="bg" width="${W}" height="${H}"></rect><g class="dots">${dots}</g>${orr}<g class="routes">${routes}</g><g class="labels">${labels}</g>${fleets}${pins}${marks}${hint}`;
        }

        // ------------------------------------------------------------------ planet details (a click on a zoomed-in planet)
        // the Planet Explorer's planet card (rendered portrait, deposits with tier, icon and richness against the galaxy
        // best of that raw) plus what the Empire knows: which stake tiers can extract each raw, the plan's need, your
        // stakes and fleets on it. Read-only; Escape, the x or a click outside closes it.
        maxRich(name) {
            if (!this._maxRich) { this._maxRich = new Map(); this.se.planets.forEach(p => p.deposits.forEach(d => { if (!(this._maxRich.get(d.name) >= d.richness)) this._maxRich.set(d.name, d.richness); })); }
            return this._maxRich.get(name) || 1;
        }
        openPlanet(pkey) {
            const pl = this.se.planetByKey.get(pkey); if (!pl) return;
            const sys = this.G.byKey.get(pl.sysKey), raw = sys && sys.raw && sys.raw.planets ? sys.raw.planets[+pkey.split(':').pop()] : null; if (!raw) return;
            const tab = this.tab, G = this.G, own = G.css(Store.s.faction), near = sys.sb ? null : G.nearestStarbase(sys.key);
            const rows = tab.cov ? tab.cov.rows : [], row = name => rows.find(r => r.name === name);
            const rm = this.se.rm, tierOf = n => { const r = rm && rm.byName.get(n); return r ? r.tier : null; };
            const deps = Array.from(pl.deposits.entries()).sort((a, b) => (tierOf(b[1].name) || 0) - (tierOf(a[1].name) || 0) || b[1].richness - a[1].richness);
            const depHTML = deps.map(([id, d]) => {
                const t = tierOf(d.name), max = this.maxRich(d.name), pct = Math.max(3, Math.round(100 * d.richness / max)), r = row(d.name);
                const kits = [1, 2, 3, 4, 5].filter(k => this.se.extractorFor(pl, id, k));
                const how = !pl.stakeable ? 'fleet only (a belt holds no stake)' : kits.length ? `stake T${kits.join(', T')}` : 'fleet only (no extractor kit)';
                return `<div class="cd-pdep${r ? (r.perHour > 0 ? ' bill' : ' need') : ''}">
                    <div class="cd-pdep-n">${window.ResourceIcons ? `<img src="${window.ResourceIcons.url(d.name, 'raw')}" alt="" loading="lazy" decoding="async">` : ''}${t ? `<b class="t t${t}">T${t}</b>` : ''}<span>${esc(d.name)}</span></div>
                    <div class="cd-pdep-r">richness <b>${num(d.richness)}</b> <small>of ${num(max)} best · ${pct} %</small></div>
                    <div class="cd-pdep-bar"><b style="width:${pct}%"></b></div>
                    <div class="cd-pdep-k"><small>${how}</small>${r ? `<small class="${r.perHour > 0 ? 'ok' : 'warn'}">${r.perHour > 0 ? 'in your plan' : 'your plan needs it - no source yet'}</small>` : ''}</div>
                </div>`;
            }).join('');
            const ops = this.ops || { stakes: [], fleets: [] };
            const mineHere = ops.stakes.filter(s => s.planet.key === pl.key).map(s => `<li><i class="t t${s.tier}">T${s.tier}</i> your stake · makes ${num(s.out)} / h${s.backlog > 1e-9 ? ` · <span class="warn">storage full in ${esc(dur(s.fullIn * 3600))}</span>` : ''}</li>`)
                .concat(ops.fleets.filter(f => f.task === 'mine' && f.body && f.body.key === pl.key).map(f => `<li><i class="cd-tdot mine"></i> ${esc(f.label)} mining ${esc(f.raw)} · ${num(f.perHour)} / h</li>`)).join('');
            const box = document.createElement('div');
            box.className = 'cd-pmodal'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', pl.name + ' details');
            box.innerHTML = `<div class="cd-pcard">
                <button type="button" class="rp-x cd-pclose" title="Close (Esc)">&times;</button>
                <div class="cd-phead">
                    <div class="cd-pvis">${window.Orrery ? window.Orrery.planetSphereHTML(raw, 150) : ''}</div>
                    <div>
                        <h2>${esc(pl.name)}</h2>
                        <p class="cd-pbadges"><span>${esc(pl.catName)}</span><span class="f-${pl.faction}">${FAC_LABEL[pl.faction]}</span>${tab.zoneBadge(pl)}<span class="${pl.stakeable ? 'ok' : 'warn'}">${pl.stakeable ? 'claim stakes OK' : 'ships only'}</span></p>
                        <dl class="cd-pfacts">
                            <dt>System</dt><dd>${esc(sys.name)} · ${sys.sb === 6 ? 'CSS - the market' : sys.sb ? 'Level ' + sys.sb + ' starbase' : `no starbase${near ? ` (nearest ${esc(near.sys.name)}, L${near.sys.sb}, ${au(near.d)})` : ''}`}</dd>
                            ${own && own.key !== sys.key ? `<dt>Your CSS</dt><dd>${esc(own.name)} · ${au(G.dist(sys.key, own.key))}</dd>` : ''}
                            <dt>Orbit</dt><dd>${raw.orbit != null ? num(raw.orbit) : '?'} · angle ${raw.angle != null ? raw.angle : '?'}° · scale ${raw.scale != null ? raw.scale : '?'}</dd>
                            <dt>Deposits</dt><dd>${deps.length}${deps.length ? ` · best tier T${Math.max(...deps.map(([, d]) => tierOf(d.name) || 1))}` : ''}</dd>
                        </dl>
                    </div>
                </div>
                ${mineHere ? `<h4>Yours here</h4><ul class="cd-phere">${mineHere}</ul>` : ''}
                <h4>Deposits <small>richness against the richest deposit of the same raw anywhere in Galia</small></h4>
                <div class="cd-pdeps">${depHTML || '<p class="rx-note">No deposits.</p>'}</div>
            </div>`;
            box.addEventListener('click', e => { if (e.target === box || e.target.closest('.cd-pclose')) this.closePlanet(); });
            this.closePlanet(); document.body.appendChild(box); this.modal = box; snd('click');
            document.addEventListener('keydown', this._esc = e => { if (e.key === 'Escape') this.closePlanet(); });
        }
        closePlanet() { if (this.modal) { this.modal.remove(); this.modal = null; } if (this._esc) { document.removeEventListener('keydown', this._esc); this._esc = null; } }

        // ------------------------------------------------------------------ search
        hits() {
            const words = this.q.toLowerCase().split(/\s+/).filter(Boolean); if (!words.length) return [];
            const out = [], seen = new Set();
            this.G.systems.forEach(s => { if (words.every(w => s.name.toLowerCase().includes(w))) { out.push({ sys: s.key, kind: 'system', s }); seen.add(s.key); } });
            this.se.planets.forEach(p => { if (words.every(w => (p.name + ' ' + p.system).toLowerCase().includes(w)) && !words.every(w => p.system.toLowerCase().includes(w))) out.push({ sys: p.sysKey, kind: 'body', p }); });
            const exact = h => ((h.p ? h.p.name : h.s.name).toLowerCase() === this.q.trim().toLowerCase() ? 0 : 1);
            return out.sort((a, b) => exact(a) - exact(b) || (a.kind === 'system' ? 0 : 1) - (b.kind === 'system' ? 0 : 1) || (a.p ? a.p.name : a.s.name).localeCompare(b.p ? b.p.name : b.s.name));
        }

        // ------------------------------------------------------------------ the ledger under the map
        ledgerHTML(ops, cov) {
            const tick = Store.s.tick;
            const byName = new Map();
            ops.rows.forEach(r => byName.set(r.name, { name: r.name, made: r.made, burned: r.burned, net: r.net, by: r.by, need: null, hours: null }));
            // a plan line also carries what "Who supplies what" drew (merged 2026-10-26): the recipes that use it, and why
            // a line without a source has none (fleet only, made by a stake processor, no recipe)
            cov.rows.forEach(c => {
                const r = byName.get(c.name) || byName.set(c.name, { name: c.name, made: 0, burned: 0, net: 0, by: [], need: null, hours: null }).get(c.name);
                r.need = c.need; r.hours = c.perHour > 0 ? c.hours : Infinity; r.users = c.users;
                r.kind = !c.res ? 'not a resource in the export' : c.res.category === 'raw' ? (c.res.stakeMinable ? '' : 'fleet only - no stake can extract it') : cov.stop.has(c.name) ? 'made by a stake processor' : 'no recipe makes it';
            });
            const rows = Array.from(byName.values());
            const maxH = Math.max(1e-12, ...rows.filter(r => r.need != null && r.hours !== Infinity).map(r => r.hours)), lastH = rows.filter(r => r.need != null && r.hours !== Infinity).reduce((a, r) => Math.max(a, r.hours), 0);
            const rank = r => (r.net < -1e-9 ? 0 : r.need != null && r.hours === Infinity ? 1 : r.need != null ? 2 : 3);
            rows.sort((a, b) => rank(a) - rank(b) || (rank(a) === 0 ? a.net - b.net : rank(a) === 2 ? b.hours - a.hours : b.made - a.made) || a.name.localeCompare(b.name));
            if (!rows.length && !ops.fleets.length) return `<section class="rx-panel cd-ledger"><div class="rx-panel-head"><h3>Ledger</h3><span>per hour</span></div><p class="rx-note">Nothing placed yet. Place a stake (step 2) or form a fleet (step 3): what it makes, burns and moves shows up here, and the recipes in step 1 add what they need.</p></section>`;
            // alerts: what the owner would act on
            const alerts = [];
            rows.filter(r => r.net < -1e-9 && r.made > 0).forEach(r => alerts.push(['bad', `<b>${esc(r.name)}</b>: you burn ${num(r.burned)} / h and make ${num(r.made)} - ${num(-r.net)} / h must be bought or made.`]));
            rows.filter(r => r.net < -1e-9 && !(r.made > 0)).forEach(r => alerts.push(['warn', `<b>${esc(r.name)}</b>: ${num(r.burned)} / h burned, none made - buy it at a starbase${r.name === 'Fuel' || r.name === 'Food' ? `, or put a ${esc(r.name)} processor on a stake` : ''}.`]));
            ops.stakes.forEach(s => {
                if (s.haulers.length && s.backlog > 1e-9) {
                    const h = s.haulers[0], per = h.cap / h.count, more = per > 0 ? Math.ceil(s.backlog / per - 1e-9) : null;
                    alerts.push(['warn', `<b>${esc(s.label)}</b> makes ${num(s.out)} / h, its haulers can move ${num(s.haulCap)} / h: storage (${num(s.storage)}) full in ${dur(s.fullIn * 3600)}.${more ? ` ${plural(more, 'more ' + h.ship.replace(/^Armstrong /, ''), 'more ' + h.ship.replace(/^Armstrong /, ''))} on that run would keep up.` : ''}`]);
                }
                if (s.suppliers.length && s.r4.gap > 1e-9) alerts.push(['warn', `<b>${esc(s.label)}</b> and what is based there need ${num(s.r4.total)} R4 / h (${r4List(s.r4.need)}), its R4 runs can bring ${num(s.supplyCap)}.`]);
            });
            ops.fleets.forEach(f => f.warn.forEach(w => alerts.push(['bad', `<b>${esc(f.label)}</b> (${esc(TASK_LABEL[f.task])}): ${esc(w)}.`])));
            const fuel = byName.get('Fuel');
            const behind = ops.stakes.filter(s => s.backlog > 1e-9);
            const facts = [
                [fuel ? num(fuel.burned) : '0', `fuel burned an hour${fuel && fuel.made ? ` · ${num(fuel.made)} made` : ''}`, fuel && fuel.net < -1e-9 ? 'warn' : ''],
                [`${rows.filter(r => r.net < -1e-9).length + rows.filter(r => r.need != null && r.hours === Infinity).length}`, 'shortfalls: burned more than made, or a plan line with no source', rows.some(r => r.net < -1e-9 || (r.need != null && r.hours === Infinity)) ? 'warn' : ''],
                [`${behind.length} <small>of ${ops.stakes.length}</small>`, 'stakes filling up (more made than hauled)']
            ];
            const who = r => { const m = new Map(); r.by.forEach(b => m.set(b.who, (m.get(b.who) || 0) + (b.field === 'made' ? b.v : -b.v))); return Array.from(m.entries()).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 3).map(([w, v]) => `${esc(w)} <span class="${v < 0 ? 'neg' : 'pos'}">${v < 0 ? '−' : '+'}${num(Math.abs(v))}</span>`).join(', ') + (m.size > 3 ? ` and ${m.size - 3} more` : ''); };
            const tr = r => `<tr class="${r.net < -1e-9 ? 'neg' : r.need != null && r.hours === Infinity ? 'none' : ''}"><th>${esc(r.name)}</th><td>${r.made ? num(r.made) : '–'}</td><td>${r.burned ? num(r.burned) : '–'}</td><td class="net">${r.made || r.burned ? (r.net < 0 ? '−' : '') + num(Math.abs(r.net)) : '–'}</td><td>${r.need != null ? num(r.need) : ''}</td><td class="gath">${r.need == null ? '' : r.hours === Infinity ? `<span class="nosrc" title="${esc(r.kind || 'no stake or fleet supplies it')}">${r.kind && r.kind.startsWith('fleet') ? 'needs a fleet' : 'no source'}</span>` : `<span class="gbar${r.hours === lastH ? ' last' : ''}" title="${esc(r.name)}: ${num(r.need)} at ${num(r.made)} / h${r.hours === lastH ? ' - gathered last' : ''}"><b style="width:${Math.max(2, 100 * r.hours / maxH).toFixed(1)}%"></b></span>${esc(dur(r.hours * 3600))}`}</td><td class="who">${who(r)}</td><td class="who">${(r.users || []).slice(0, 3).map(u => `${esc(u.name)} <small>×${num(u.units)}</small>`).join(', ')}${r.users && r.users.length > 3 ? ` and ${r.users.length - 3} more` : ''}</td></tr>`;
            const stakeRows = ops.stakes.map(s => `<tr><th>${esc(s.label)}<small>${esc(s.planet.system)}</small></th><td>${num(s.out)}</td><td>${s.haulers.length ? `${num(s.hauled)} <small>of ${num(s.haulCap)}</small>` : '–'}</td><td>${num(s.storage)}</td><td class="${s.backlog > 1e-9 ? 'warn' : 'ok'}">${s.backlog > 1e-9 ? esc(dur(s.fullIn * 3600)) : 'never'}</td><td class="txt">${s.r4.total ? `<b>${num(s.r4.total)}</b> <small>${r4List(s.r4.need)}${s.r4.from.length ? ` · incl. ${s.r4.from.map(esc).join(', ')}` : ''}</small>` : '–'}</td><td>${s.suppliers.length ? `${num(s.supplied)} <small>of ${num(s.supplyCap)}</small>` : s.r4.total ? '<small class="warn">no R4 run - buy it there</small>' : '–'}</td></tr>`).join('');
            const fleetRows = ops.fleets.map(f => {
                const route = f.task === 'mine' ? `${esc(f.raw || '?')} at ${esc(f.body ? f.body.name : '?')}${f.dest ? ` → ${esc(f.dest.name)}` : ' (no drop-off)'}` : `${f.stake ? esc(f.stake.label) : '?'} ${f.task === 'haul' ? '→' : '←'} ${f.dest ? esc(f.dest.name) : '?'}`;
                const t = f.trip, trip = t ? (f.task === 'mine' ? t.trip : t) : null;
                return `<tr><th>${esc(f.label)}<small>${esc(TASK_LABEL[f.task])}</small></th><td class="txt">${route}</td><td>${f.d != null ? au(f.d) : '–'}</td><td>${trip ? (f.d === 0 ? 'same system' : `${trip.jumps} ${trip.mode === 'warp' ? 'warp' : 'subwarp'}`) : '–'}</td><td>${t ? esc(dur(f.task === 'mine' ? t.cycle : t.time)) : '–'}</td><td>${num(f.perHour)}${f.task !== 'mine' && f.cap ? ` <small>${(100 * f.busy).toFixed(0)} % busy</small>` : ''}</td><td>${f.fuel ? num(f.fuel) : '–'}</td><td>${f.food ? num(f.food) : '–'}</td><td>${f.fuel && f.perHour ? num(f.fuel / f.perHour) : '–'}</td></tr>`;
            }).join('');
            return `<section class="rx-panel cd-ledger">
                <div class="rx-panel-head"><h3>Ledger</h3><span>per hour at a ${esc(dur(tick))} stake tick (${esc(Store.s.tickSource === 'assumed' ? 'assumed' : 'yours')}) · shortfalls first</span></div>
                <div class="rx-facts cd-ledger-facts">${facts.map(([b, s, c]) => `<div${c ? ` class="${c}"` : ''}><b>${b}</b><span>${s}</span></div>`).join('')}</div>
                ${alerts.length ? `<ul class="cd-alerts">${alerts.map(([c, t]) => `<li class="${c}">${t}</li>`).join('')}</ul>` : ''}
                ${rows.length ? `<div class="an-tablewrap"><table class="an-table cd-ledger-t"><thead><tr><th>Resource</th><th>made / h</th><th>burned / h</th><th>net / h</th><th>plan needs</th><th class="l">gathered in <small>(bar: longest = gathered last)</small></th><th class="l">from</th><th class="l">used by (plan)</th></tr></thead><tbody>${rows.map(tr).join('')}</tbody></table></div>` : ''}
                ${cov.stop && cov.stop.size ? `<p class="rx-note">The plan's bill stops at ${Array.from(cov.stop).map(esc).join(', ')}: a stake processor already makes ${cov.stop.size > 1 ? 'them' : 'it'}, so the ore behind ${cov.stop.size > 1 ? 'them' : 'it'} is not billed again.</p>` : ''}
                ${ops.stakes.length ? `<h4 class="cd-sched-h">Stakes · storage and R4</h4><div class="an-tablewrap"><table class="an-table"><thead><tr><th>Stake</th><th>makes / h</th><th>hauled / h</th><th>storage</th><th>full in</th><th class="l">R4 needed / h <small>(the stake, its haulers, miners dropping off there)</small></th><th>R4 brought / h</th></tr></thead><tbody>${stakeRows}</tbody></table></div>` : ''}
                ${ops.fleets.length ? `<h4 class="cd-sched-h">Fleets · trips</h4><div class="an-tablewrap"><table class="an-table"><thead><tr><th>Fleet</th><th class="l">route</th><th>distance</th><th>jumps</th><th>cycle</th><th>moves / h</th><th>fuel / h</th><th>food / h</th><th>fuel per unit</th></tr></thead><tbody>${fleetRows}</tbody></table></div>` : ''}
                <p class="rx-note">Made = stake output (extraction, hub passive, processors) at the tick above, plus what mining fleets deliver. A fleet with a drop-off runs a full cycle - fill the hold at rate × richness, fly there and back - so its rate is per hour on the road, not at the body. Distance is the straight line between two systems read as AU; hulls fly their Default configuration; 1 unit = 1 CU of hold. Hardness, warp-lane fees and prices are not in the export. A stake's storage counts every hub and storage building it holds.</p>
            </section>`;
        }
    }

    function star(x, y, R, r) {
        let d = '';
        for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? r : R; d += (i ? 'L' : 'M') + (x + k * Math.cos(a)).toFixed(1) + ',' + (y + k * Math.sin(a)).toFixed(1); }
        return d + 'z';
    }

    window.DeckEmpireMap = EmpireMap;
})();
