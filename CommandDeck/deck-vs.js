// deck-vs.js - Command Deck, Loadouts tab (2026-10-05). Siphaawal: "try haul vs haul with configs" -> "add all 4 along
// with haul vs haul under one tab as sub tabs". One set of two to four LOADOUTS (a hull + one of its configurations)
// shared by six views:
//   Haul   cargo delivered an hour and fuel per unit against route length; crossovers; the hauling stats
//   Mine   ore delivered an hour (fill the hold at rate x richness, haul it, repeat) against route length; food and
//          fuel per unit; crossovers; the mining stats
//   Scan   SDU an hour and Toolkits per SDU from the scan cooldown; the scanning stats
//   Fight  the export's combat formula run N times for every pair - win share, mean rounds; the combat stats
//   Fleet  a fleet of hulls+configurations against the Fleet Size cap of a Council Rank tier - capacity points, the
//          Titan and Commander limits, totals
//   Cost   what each configuration costs to craft: components -> recipes -> raws, and a button into the Recipe plan
// Engine: deck-loadout.js (the Ship Explorer's calculator on the flat stat rows). Units are the export's: AU, AU/s,
// fuel per AU, CU.
(function () {
    'use strict';

    const { esc, num, dur, snd } = window.DeckUI;
    const Store = window.DeckStore, Loadout = window.CommandDeck.Loadout;
    const KEY = 'commandDeck.vs.v1', PLAN_KEY = 'recipeExplorer.plan.v1';
    const COLORS = ['#4fd8ff', '#ffd36b', '#ff6fb0', '#b9ff6b'];
    const LETTER = ['A', 'B', 'C', 'D'];
    const DMIN = 0.5, DMAX = 60, PICKS = [1, 2, 5, 10, 20, 40];
    const SUBS = [['haul', 'Haul'], ['mine', 'Mine'], ['scan', 'Scan'], ['fight', 'Fight'], ['fleet', 'Fleet'], ['cost', 'Cost']];
    const log10 = Math.log10;
    const art = n => (/^(8\d*|11|18)(\D|$)/.test(n) ? 'an' : 'a');
    const big = v => (v == null || !isFinite(v) ? '–' : v >= 1e9 ? num(v / 1e9, 1) + ' B' : v >= 1e6 ? num(v / 1e6, v >= 1e7 ? 0 : 1) + ' M' : v >= 1e4 ? num(v / 1e3, 0) + ' k' : num(v, v < 10 ? 2 : 0));
    const pct = v => (v == null ? '–' : num(100 * v, 0) + ' %');
    const DEFAULTS = [{ ship: 'Armstrong IMP Tap', cfg: 'Cargo Boost Max' }, { ship: 'Armstrong IMP Tap', cfg: 'Fast Freight Max' }];
    const uid = p => p + Math.random().toString(36).slice(2, 8);

    class LoadoutsTab {
        constructor(root, ctx) {
            this.root = root; this.lo = ctx.loadout; this.rc = ctx.rc; this.research = ctx.research; this.app = ctx.app;
            const saved = Store.read(KEY, {});
            this.s = {
                d: saved.d > 0 ? Math.min(DMAX, Math.max(DMIN, +saved.d)) : 10,
                mode: saved.mode === 'subwarp' ? 'subwarp' : 'warp',
                richness: saved.richness > 0 ? +saved.richness : 1,
                fights: +saved.fights === 500 ? 500 : 200,
                sub: SUBS.some(([k]) => k === saved.sub) ? saved.sub : 'haul',
                loadouts: (Array.isArray(saved.loadouts) ? saved.loadouts : DEFAULTS).filter(l => l && this.lo.byName.has(l.ship)).slice(0, 4).map(l => ({ ship: l.ship, cfg: this.lo.configsOf(l.ship).includes(l.cfg) ? l.cfg : 'Default' })),
                fleet: { tier: saved.fleet && saved.fleet.tier >= 0 && saved.fleet.tier <= 8 ? +saved.fleet.tier : 3, ships: (saved.fleet && Array.isArray(saved.fleet.ships) ? saved.fleet.ships : []).filter(x => x && this.lo.byName.has(x.ship)).map(x => ({ id: x.id || uid('f'), ship: x.ship, cfg: this.lo.configsOf(x.ship).includes(x.cfg) ? x.cfg : 'Default', n: Math.max(1, Math.min(99, +x.n || 1)) })) }
            };
            if (this.s.loadouts.length < 2) this.s.loadouts = DEFAULTS.filter(l => this.lo.byName.has(l.ship)).slice(0, 2);
            // the Fleet Size ladder, from the research nodes (Starting Node 4, Tier 1..8). Each tier GRANTS fleet_size
            // points on top of the previous ("Grants 7 additional fleet-capacity points, raising cumulative capacity to
            // 11"), so the cap at a tier is the running sum: 4, 11, 23, 42, 70, 109, 161, 228, 312 (2026-10-08 fix: the
            // grant was shown as the cap).
            const nodes = (this.research && this.research.nodes) || [];
            const start = nodes.find(n => n.name === 'Starting Node'), cv = n => n.grants || n.character_value_changes || {};
            let run = (start && cv(start).fleet_size) || 4;
            this.fleetCaps = [{ tier: 0, cap: run, label: 'start' }].concat([1, 2, 3, 4, 5, 6, 7, 8].map(t => { const n = nodes.find(x => x.name === `Fleet Size - Tier ${t}`); run += n ? (cv(n).fleet_size || 0) : [7, 12, 19, 28, 39, 52, 67, 84][t - 1]; return { tier: t, cap: run, label: 'Tier ' + t }; }));
            this.fightCache = new Map();
            this.stale = true; this.bind();
            Store.on(() => { if (this.visible()) this.render(); else this.stale = true; });
        }
        visible() { return this.root.closest('.tab-content').classList.contains('active'); }
        show() { if (this.stale) this.render(); }
        save() { Store.write(KEY, this.s); }

        bind() {
            this.root.addEventListener('change', e => {
                let el;
                if ((el = e.target.closest('[data-lo-ship]'))) { const i = +el.dataset.loShip, l = this.s.loadouts[i]; if (!l) return; l.ship = el.value; const cs = this.lo.configsOf(l.ship); if (!cs.includes(l.cfg)) l.cfg = cs.includes('Default') ? 'Default' : (cs[0] || 'Default'); this.save(); snd('select'); this.render(); return; }
                if ((el = e.target.closest('[data-lo-cfg]'))) { const i = +el.dataset.loCfg, l = this.s.loadouts[i]; if (!l) return; l.cfg = el.value; this.save(); snd('select'); this.render(); return; }
                if ((el = e.target.closest('[data-dist]'))) { const v = parseFloat(el.value); this.distNote = !(v > 0) ? `not a number, using ${num(this.s.d, 2)} AU` : (v < DMIN || v > DMAX) ? `clamped to ${num(Math.min(DMAX, Math.max(DMIN, v)), 2)} AU (range ${DMIN} to ${DMAX})` : ''; if (v > 0) { this.s.d = Math.min(DMAX, Math.max(DMIN, v)); this.save(); } this.render(); return; }
                if ((el = e.target.closest('[data-richness]'))) { const v = parseFloat(el.value); this.richNote = !(v > 0) ? `not a number, using ${num(this.s.richness, 2)}` : v > 10 ? 'clamped to 10' : ''; if (v > 0) { this.s.richness = Math.min(10, v); this.save(); } this.render(); return; }
                if ((el = e.target.closest('[data-fights]'))) { this.s.fights = +el.value; this.fightCache.clear(); this.save(); this.render(); return; }
                if ((el = e.target.closest('[data-fl-ship]'))) { const f = this.s.fleet.ships.find(x => x.id === el.dataset.flShip); if (!f) return; f.ship = el.value; const cs = this.lo.configsOf(f.ship); if (!cs.includes(f.cfg)) f.cfg = 'Default'; this.save(); snd('select'); this.render(); return; }
                if ((el = e.target.closest('[data-fl-cfg]'))) { const f = this.s.fleet.ships.find(x => x.id === el.dataset.flCfg); if (f) { f.cfg = el.value; this.save(); snd('select'); this.render(); } return; }
                if ((el = e.target.closest('[data-fl-n]'))) { const f = this.s.fleet.ships.find(x => x.id === el.dataset.flN); if (f) { f.n = Math.max(1, Math.min(99, parseInt(el.value, 10) || 1)); this.save(); this.render(); } return; }
            });
            this.root.addEventListener('click', e => {
                let el;
                if ((el = e.target.closest('[data-sub]'))) { this.s.sub = el.dataset.sub; this.save(); snd('select'); this.render(); return; }
                if ((el = e.target.closest('[data-dist-pick]'))) { this.distNote = ''; this.s.d = +el.dataset.distPick; this.save(); snd('select'); this.render(); return; }
                if ((el = e.target.closest('[data-mode]'))) { this.s.mode = el.dataset.mode; this.save(); snd('select'); this.render(); return; }
                if ((el = e.target.closest('[data-lo-add]'))) { if (this.s.loadouts.length < 4) { const last = this.s.loadouts[this.s.loadouts.length - 1]; const cs = this.lo.configsOf(last.ship); const alt = cs.find(c => c !== last.cfg && c !== 'Default') || 'Default'; this.s.loadouts.push({ ship: last.ship, cfg: alt }); this.save(); snd('select'); this.render(); } return; }
                if ((el = e.target.closest('[data-lo-remove]'))) { if (this.s.loadouts.length > 2) { this.s.loadouts.splice(+el.dataset.loRemove, 1); this.save(); snd('deselect'); this.render(); } return; }
                if ((el = e.target.closest('[data-refight]'))) { this.fightCache.clear(); snd('select'); this.render(); return; }
                if ((el = e.target.closest('[data-formula-toggle]'))) { this.showFormula = !this.showFormula; snd('select'); this.render(); if (this.showFormula) { const pre = this.root.querySelector('.vs-formula'); if (pre) pre.scrollIntoView({ block: 'start', behavior: 'smooth' }); } return; }
                if ((el = e.target.closest('[data-formula-download]'))) { const blob = new Blob([this.lo.combat.combatFormula], { type: 'text/javascript' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `combat-formula-${this.lo.combat.exportDate || 'export'}.js`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); snd('success'); return; }
                if ((el = e.target.closest('[data-fl-tier]'))) { this.s.fleet.tier = +el.dataset.flTier; this.save(); snd('select'); this.render(); return; }
                if ((el = e.target.closest('[data-fl-add]'))) { const i = +el.dataset.flAdd, l = this.s.loadouts[i]; if (!l) return; const same = this.s.fleet.ships.find(x => x.ship === l.ship && x.cfg === l.cfg); if (same) same.n = Math.min(99, same.n + 1); else this.s.fleet.ships.push({ id: uid('f'), ship: l.ship, cfg: l.cfg, n: 1 }); this.save(); snd('select'); this.render(); return; }
                if ((el = e.target.closest('[data-fl-remove]'))) { this.s.fleet.ships = this.s.fleet.ships.filter(x => x.id !== el.dataset.flRemove); this.save(); snd('deselect'); this.render(); return; }
                if ((el = e.target.closest('[data-fl-clear]'))) { this.s.fleet.ships = []; this.save(); snd('deselect'); this.render(); return; }
                if ((el = e.target.closest('[data-fl-research]'))) { const need = this.fleetResearch(); if (need && this.app) { snd('click'); this.app.showResearchGoal('empire', need); } return; }
                if ((el = e.target.closest('[data-fl-to-lo]'))) { const f = this.s.fleet.ships.find(x => x.id === el.dataset.flToLo); if (!f) return; const idx = this.s.loadouts.findIndex(l => l.ship === f.ship && l.cfg === f.cfg); if (idx < 0) { if (this.s.loadouts.length < 4) this.s.loadouts.push({ ship: f.ship, cfg: f.cfg }); else this.s.loadouts[3] = { ship: f.ship, cfg: f.cfg }; } this.s.sub = 'haul'; this.save(); snd('select'); this.render(); return; }
                if ((el = e.target.closest('[data-plan-add]'))) { const i = +el.dataset.planAdd, r = this.rows().find(x => x.i === i); if (!r) return; const c = this.lo.cost(r.st); const plan = (Store.read(PLAN_KEY, []) || []).filter(x => x && x.id); c.recipes.forEach(it => { const ex = plan.find(p => p.id === it.id); if (ex) ex.qty = Math.min(100000, (+ex.qty || 0) + it.qty); else plan.push({ id: it.id, qty: it.qty }); }); Store.write(PLAN_KEY, plan); snd('success'); el.textContent = `added ${c.recipes.length} recipes to the plan`; el.disabled = true; return; }
            });
        }

        rows() { return this.s.loadouts.map((l, i) => ({ i, letter: LETTER[i], color: COLORS[i], st: this.lo.stats(l.ship, l.cfg) })); }

        // ---------------------------------------------------------------- shared pieces
        cards(rows) {
            const sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(c => this.lo.ships.some(s => this.lo.classOf(s) === c));
            const shipSel = (attr, cur) => `<select class="sb-input" ${attr} aria-label="Hull">${sizes.map(c => `<optgroup label="${Loadout.CLASS_NAME[c]} · ${this.lo.points.get(c) ? this.lo.points.get(c).capacity_points + ' pts' : ''}">${this.lo.ships.filter(s => this.lo.classOf(s) === c).sort((a, b) => a.name.localeCompare(b.name)).map(s => `<option value="${esc(s.name)}"${s.name === cur ? ' selected' : ''}>${esc(s.name)}</option>`).join('')}</optgroup>`).join('')}</select>`;
            const cfgSel = (attr, ship, cur) => `<select class="sb-input" ${attr} aria-label="Configuration">${this.lo.configsOf(ship).map(n => `<option value="${esc(n)}"${n === cur ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select>`;
            this.shipSel = shipSel; this.cfgSel = cfgSel;
            return `<div class="vs-los">${rows.map(r => `<div class="vs-lo" style="--c:${r.color}"><b class="vs-letter">${r.letter}</b>${shipSel(`data-lo-ship="${r.i}"`, r.st.ship.name)}${cfgSel(`data-lo-cfg="${r.i}"`, r.st.ship.name, r.st.name)}<small>${esc(r.st.size)} · ${r.st.points != null ? r.st.points + ' pts · ' : ''}slots ${esc(r.st.slots)}</small>${rows.length > 2 ? `<button type="button" class="vs-x" data-lo-remove="${r.i}" aria-label="Remove loadout ${r.letter}">×</button>` : ''}</div>`).join('')}${rows.length < 4 ? '<button type="button" class="chip vs-add" data-lo-add>+ loadout</button>' : ''}</div>`;
        }
        routeControls(withRichness) {
            const { d, mode } = this.s;
            return `<label class="cd-tick"><span>Route length</span><input type="number" class="sb-input" min="${DMIN}" max="${DMAX}" step="any" value="${num(d, 2)}" data-dist aria-label="Route length in AU"><em>AU one way${this.distNote ? ` - ${esc(this.distNote)}` : ''}</em></label>
                <div class="chips">${PICKS.map(p => `<button type="button" class="chip${Math.abs(d - p) < 1e-9 ? ' on' : ''}" data-dist-pick="${p}">${p}</button>`).join('')}</div>
                <span class="cd-me"><span>Drive</span><button type="button" class="chip${mode === 'warp' ? ' on' : ''}" data-mode="warp">Warp</button><button type="button" class="chip${mode === 'subwarp' ? ' on' : ''}" data-mode="subwarp">Subwarp</button></span>
                ${withRichness ? `<label class="cd-tick"><span>Deposit richness</span><input type="number" class="sb-input" min="0.1" max="10" step="any" value="${num(this.s.richness, 2)}" data-richness aria-label="Deposit richness"><em>× rate${this.richNote ? ` - ${esc(this.richNote)}` : ''}</em></label>` : ''}`;
        }
        // log-log chart against route length; yOf(st, d) -> value
        chart(rows, d, mode, yOf, unit, label) {
            const W = 720, H = 330, ML = 62, MR = 150, MT = 16, MB = 40, N = 420;
            const xs = Array.from({ length: N + 1 }, (_, i) => DMIN * Math.pow(DMAX / DMIN, i / N));
            const series = rows.map(r => ({ r, pts: xs.map(x => [x, yOf(r.st.mod, x)]).filter(p => isFinite(p[1]) && p[1] > 0) }));
            const ys = series.flatMap(s => s.pts.map(p => p[1])); if (!ys.length) return `<figure class="vs-fig"><figcaption>${esc(label)}</figcaption><p class="rx-note">Nothing to draw for this drive.</p></figure>`;
            const y0 = Math.floor(log10(Math.min(...ys))), y1 = Math.ceil(log10(Math.max(...ys)) + 0.01);
            const px = x => ML + (log10(x) - log10(DMIN)) / (log10(DMAX) - log10(DMIN)) * (W - ML - MR);
            const py = v => MT + (y1 - log10(v)) / Math.max(1, y1 - y0) * (H - MT - MB);
            const pow = e => (e >= 6 ? num(Math.pow(10, e - 6)) + ' M' : e >= 3 ? num(Math.pow(10, e - 3)) + ' k' : e >= 0 ? num(Math.pow(10, e)) : Math.pow(10, e).toFixed(-e));
            let g = '';
            for (let e = y0; e <= y1; e++) g += `<line class="grid" x1="${ML}" x2="${W - MR}" y1="${py(Math.pow(10, e)).toFixed(1)}" y2="${py(Math.pow(10, e)).toFixed(1)}"></line><text class="ax" x="${ML - 8}" y="${(py(Math.pow(10, e)) + 3.5).toFixed(1)}" text-anchor="end">${pow(e)}</text>`;
            [0.5, 1, 2, 5, 10, 20, 50].forEach(x => { g += `<line class="grid" x1="${px(x).toFixed(1)}" x2="${px(x).toFixed(1)}" y1="${MT}" y2="${H - MB}"></line><text class="ax" x="${px(x).toFixed(1)}" y="${H - MB + 16}" text-anchor="middle">${x}</text>`; });
            g += `<text class="ax ttl" x="${(ML + W - MR) / 2}" y="${H - 6}" text-anchor="middle">route length, AU (one way)</text><text class="ax ttl" x="8" y="12">${esc(unit)}</text>`;
            let lines = '', labels = '';
            const ends = series.map(s => ({ s, y: s.pts.length ? py(s.pts[s.pts.length - 1][1]) : 0 })).sort((p, q) => p.y - q.y);
            let prev = -Infinity; ends.forEach(o => { o.ly = Math.max(o.y, prev + 14.5); prev = o.ly; });
            series.forEach(s => {
                if (!s.pts.length) return;
                lines += `<path class="vs-ln" d="${s.pts.map((p, i) => `${i ? 'L' : 'M'}${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`).join('')}" style="stroke:${s.r.color}"><title>${esc(s.r.letter)} · ${esc(s.r.st.label)}</title></path>`;
                const e = ends.find(o => o.s === s);
                labels += `<text class="lb" x="${W - MR + 6}" y="${(e.ly + 4).toFixed(1)}" style="fill:${s.r.color}">${s.r.letter} · ${esc(s.r.st.ship.name.replace(/^Armstrong /, ''))} ${esc(s.r.st.name)}</text>`;
            });
            const mark = `<line class="mark" x1="${px(d).toFixed(1)}" x2="${px(d).toFixed(1)}" y1="${MT - 2}" y2="${H - MB}"></line><text class="lb mk" x="${px(d).toFixed(1)}" y="${MT - 4}" text-anchor="middle">${num(d, 1)} AU</text>`;
            const dots = rows.map(r => { const v = yOf(r.st.mod, d); return isFinite(v) && v > 0 ? `<circle class="dotx" cx="${px(d).toFixed(1)}" cy="${py(v).toFixed(1)}" r="4" style="fill:${r.color}"><title>${esc(r.letter)}: ${num(v)} ${esc(unit)} at ${num(d, 1)} AU</title></circle>` : ''; }).join('');
            return `<figure class="vs-fig"><figcaption>${esc(label)}</figcaption><svg class="cd-chart vs-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">${g}${lines}${dots}${mark}${labels}</svg></figure>`;
        }
        crossList(rows, mode, metric, what) {
            const cross = [];
            for (let a = 0; a < rows.length; a++) for (let b = a + 1; b < rows.length; b++) {
                const A = rows[a], B = rows[b];
                Loadout.crossovers(A.st.mod, B.st.mod, mode, DMIN, DMAX, metric).forEach(x => {
                    const j = (st, d) => { const t = Loadout.trip(st, d, mode); return t ? t.jumps : 0; };
                    let why = '';
                    if (j(A.st.mod, x.d * 1.001) > j(A.st.mod, x.d * 0.999)) why = `${A.letter} needs jump ${j(A.st.mod, x.d * 1.001)} from here`;
                    else if (j(B.st.mod, x.d * 1.001) > j(B.st.mod, x.d * 0.999)) why = `${B.letter} needs jump ${j(B.st.mod, x.d * 1.001)} from here`;
                    cross.push({ d: x.d, winner: x.winnerAfter === 'A' ? A : B, loser: x.winnerAfter === 'A' ? B : A, why });
                });
            }
            cross.sort((p, q) => p.d - q.d);
            return { cross, html: cross.length ? `<ul class="vs-cross">${cross.map(x => `<li><b style="color:${x.winner.color}">${x.winner.letter}</b> overtakes <b style="color:${x.loser.color}">${x.loser.letter}</b> on ${what} from <b>${num(x.d, 1)}</b> AU${x.why ? `<small>${esc(x.why)}</small>` : ''}</li>`).join('')}</ul>` : `<p class="rx-note">One loadout leads on ${what} at every length between ${DMIN} and ${DMAX} AU.</p>` };
        }
        statTable(rows, defs) {
            const live = defs.filter(([k]) => rows.some(r => r.st.base[k] || r.st.mod[k]));     // a fit can set a stat the bare hull has at 0 (kinetic damage)
            return `<div class="an-tablewrap"><table class="an-table vs-stats"><thead><tr><th>Stat</th>${rows.map(r => `<th style="--c:${r.color}"><i class="vs-dot"></i>${r.letter} · ${esc(r.st.name)}</th>`).join('')}</tr></thead>
                <tbody>${live.map(([k, label, unit, lower]) => { const vals = rows.map(r => r.st.mod[k] || 0); const bestV = lower ? Math.min(...vals) : Math.max(...vals); const spread = Math.max(...vals) !== Math.min(...vals); return `<tr><th>${esc(label)} <small>${esc(unit)}</small></th>${rows.map(r => { const v = r.st.mod[k] || 0, m = r.st.mult[k] || 1; const b = r.st.base[k] || 0; const shown = k === 'required_crew' ? num(Math.ceil(v - 1e-9), 0) : num(v, v !== 0 && Math.abs(v) < 1 ? 4 : Math.abs(v) < 100 ? 2 : 0); const zero = v === 0 || !(Math.abs(parseFloat(String(shown).replace(/,/g, ''))) > 0); const tag = zero ? '<small class="dim">–</small>' : b === 0 ? '<small>fitted</small>' : Math.abs(m - 1) > 1e-6 ? `<small>×${num(m, 2)}</small>` : '<small class="dim">base</small>'; return `<td class="${spread && v === bestV ? 'best' : ''}">${shown}${tag}</td>`; }).join('')}</tr>`; }).join('')}</tbody></table></div>`;
        }
        fits(rows) {
            return `<div class="vs-fits">${rows.map(r => `<div class="vs-fit" style="--c:${r.color}"><h4><i class="vs-dot"></i>${r.letter} · ${esc(r.st.label)} <small>${esc(r.st.slots)} slots</small></h4>${r.st.fit.length ? `<div class="chips">${r.st.fit.map(f => `<span class="chip static">${esc(f.name)}${f.cls ? ` <small>${esc(f.cls)}${f.tier ? '-' + esc(f.tier) : ''}</small>` : ''}${f.n > 1 ? ` <b>×${f.n}</b>` : ''}</span>`).join('')}</div>` : '<p class="rx-note">Nothing fitted - the bare hull.</p>'}</div>`).join('')}</div>`;
        }
        stat(v, l, warn) { return `<div class="an-stat${warn ? ' warn' : ''}"><b>${v}</b><span>${l}</span></div>`; }
        dot(r) { return `<i class="vs-dot" style="background:${r.color}"></i>${r.letter}`; }

        // ---------------------------------------------------------------- page
        render() {
            this.stale = false;
            const rows = this.rows();
            const sub = this.s.sub;
            this.root.innerHTML = `
                <section class="cd-strip vs-strip" data-strip>
                    ${this.cards(rows)}
                    <nav class="vs-subs">${SUBS.map(([k, l]) => `<button type="button" class="chip${sub === k ? ' on' : ''}" data-sub="${k}">${l}</button>`).join('')}</nav>
                    ${sub === 'haul' || sub === 'mine' ? this.routeControls(sub === 'mine') : ''}
                    <p class="cd-strip-note">${this.note(sub)}</p>
                </section>
                <div class="vs-body">${this[sub](rows)}</div>`;
        }
        note(sub) {
            const base = 'A loadout is a hull with one of its 48 configurations; the fitted components change the stats (the Ship Explorer’s calculator, same numbers). ';
            return base + ({
                haul: 'Round trip = straight line, one jump per <b>warp range</b> with a spool before each and a cooldown between, unload and load at the loading rate, planet-exit fuel once. Distances are map AU (neighbouring systems about 1.1 AU apart, Foy-Eternity 10.2); speeds AU/s, fuel per AU, as the export states.',
                mine: 'A mining cycle = fill the hold at <b>mining rate × richness</b> (richness is an input), haul it the route length to the drop-off, come back empty, repeat. Food and ammo burn while mining, fuel while flying. Ore an hour = hold / cycle. The game also divides by a hardness the export lacks, so ore an hour is an upper bound.',
                scan: 'One scan every <b>scan cooldown</b>; SDU an hour and Toolkits an hour follow from SDU per scan and scan cost. <b>Scan power</b> is "a multiplier for scan results" in the export’s own words - it is shown, not applied, because what it multiplies is not stated. Scanning fittings (Scanner Array, Power Core, the Scanning kits) move these stats; the Data Running track gates where you may scan.',
                fight: 'Each pair is fought with the export’s own combat formula (<code>shipConfigurations.combatFormula</code>), N times with the first strike alternating. Each hull starts with its own full ammo, missiles and countermeasures; no stimulants, no alpha-strike or skill levels. Hit rolls are random, so the result is a share; raise N to tighten it. Mean rounds counts the fights the winner won.',
                fleet: 'Fleet points are fleet-capacity points per hull class (<code>globalCombatConfig.fleet_points</code>: XXS 1 · XS 4 · S 9 · M 16 · L 25 · CAP 36 · CMD 49 · TTN 128). The cap is the Council Rank <b>Fleet Size</b> tier, cumulative: 4 at start, 11 at Tier 1, 42 at Tier 3, 312 at Tier 8. At most one Titan, and at most two Commanders and Titans together.',
                cost: 'Each fitted component is matched to its recipe by name (<code>Cargo M T5</code>, <code>Power Core CAP T1</code> ...) and expanded to raws with the Recipe Explorer’s planner. A drone fit names a hull with no tier, so it is priced at T1; a generic weapon (Kinetic, Energy) is priced as its cheapest variant. Anything that finds no recipe is listed as unpriced.'
            })[sub];
        }

        // ---- Haul
        haul(rows) {
            const { d, mode } = this.s;
            const at = rows.map(r => Object.assign({ trip: Loadout.trip(r.st.mod, d, mode), base: Loadout.trip(r.st.base, d, mode) }, r));
            const best = at.filter(r => r.trip).sort((p, q) => q.trip.perHour - p.trip.perHour), top = best[0];
            const fuelBest = at.filter(r => r.trip).sort((p, q) => p.trip.fuelPerUnit - q.trip.fuelPerUnit)[0];
            const gain = best.length > 1 && best[1].trip.perHour > 0 ? best[0].trip.perHour / best[1].trip.perHour : null;
            const cx = this.crossList(rows, mode, null, 'cargo an hour');
            return `
                <section class="an-stats cd-stats">
                    ${top ? this.stat(this.dot(top), `most cargo an hour at ${num(d, 1)} AU: ${esc(top.st.label)}${gain ? ` · ${num(gain, 2)}× the runner-up` : ''}`) : ''}
                    ${fuelBest ? this.stat(this.dot(fuelBest), `least fuel per unit delivered: ${num(fuelBest.trip.fuelPerUnit, 3)} (${esc(fuelBest.st.name)})`) : ''}
                    ${this.stat(num(cx.cross.length, 0), `crossover${cx.cross.length === 1 ? '' : 's'} between ${DMIN} and ${DMAX} AU - where the ranking flips`)}
                    ${top ? this.stat(mode === 'warp' ? String(top.trip.jumps) : 'sub', `jump${top.trip.jumps === 1 ? '' : 's'} for ${top.letter} at ${num(d, 1)} AU · round trip ${dur(top.trip.time)}`) : ''}
                </section>
                <section class="rx-panel vs-charts">
                    ${this.chart(rows, d, mode, (st, x) => { const t = Loadout.trip(st, x, mode); return t ? t.perHour : NaN; }, 'cargo units delivered an hour', 'Cargo delivered an hour against route length - a line steps down where that loadout needs one more jump')}
                    ${this.chart(rows, d, mode, (st, x) => { const t = Loadout.trip(st, x, mode); return t ? t.fuelPerUnit : NaN; }, 'fuel per cargo unit delivered', 'Fuel burned per cargo unit delivered against route length')}
                </section>
                <section class="vs-grid">
                    <div class="rx-panel"><h3 class="vs-h">At ${num(d, 1)} AU</h3>
                        <div class="an-tablewrap"><table class="an-table vs-table"><thead><tr><th>Loadout</th><th>jumps</th><th>one way</th><th>round trip</th><th>cargo / hour</th><th>hold</th><th>fuel / trip</th><th>fuel per unit</th><th>trips a tank</th><th>vs base hull</th></tr></thead>
                        <tbody>${at.map(r => r.trip ? `<tr style="--c:${r.color}"><th><i class="vs-dot"></i>${r.letter} · ${esc(r.st.label)}</th><td>${mode === 'warp' ? r.trip.jumps : 'sub'}</td><td>${dur(r.trip.oneWay)}</td><td>${dur(r.trip.time)}</td><td class="${r === top ? 'best' : ''}">${big(r.trip.perHour)}</td><td>${big(r.st.mod.cargo_capacity)}</td><td>${big(r.trip.fuel)}</td><td class="${r === fuelBest ? 'best' : ''}">${num(r.trip.fuelPerUnit, 3)}</td><td class="${r.trip.tankOk ? '' : 'warn'}">${r.trip.tankOk ? num(r.trip.tripsPerTank, 1) : 'under 1'}</td><td>${r.base && r.base.perHour > 0 ? `×${num(r.trip.perHour / r.base.perHour, 2)}` : '–'}</td></tr>` : `<tr><th>${r.letter} · ${esc(r.st.label)}</th><td colspan="9">no ${mode} drive</td></tr>`).join('')}</tbody></table></div>
                        <p class="rx-note">"vs base hull" is this loadout's cargo an hour over the same hull with nothing fitted. Trips a tank = tank / fuel per round trip.</p></div>
                    <div class="rx-panel"><h3 class="vs-h">Where the ranking flips</h3>${cx.html}<p class="rx-note">A flip is almost always a jump window: the loadout with the shorter warp range needs its next jump (a spool and a cooldown) a few AU before the other one does, and loses until the other catches up.</p></div>
                </section>
                <section class="rx-panel"><h3 class="vs-h">What the configurations change</h3>${this.statTable(rows, Loadout.HAUL_STATS)}${this.fits(rows)}</section>`;
        }

        // ---- Mine
        mine(rows) {
            const { d, mode, richness } = this.s;
            const at = rows.map(r => Object.assign({ m: Loadout.mine(r.st.mod, d, mode, richness), base: Loadout.mine(r.st.base, d, mode, richness) }, r));
            const live = at.filter(r => r.m), best = live.slice().sort((p, q) => q.m.perHour - p.m.perHour), top = best[0];
            const crewBest = live.filter(r => r.m.perCrewHour).sort((p, q) => q.m.perCrewHour - p.m.perCrewHour)[0];
            const gain = best.length > 1 && best[1].m.perHour > 0 ? best[0].m.perHour / best[1].m.perHour : null;
            const metric = (t, st, x) => { const m = Loadout.mine(st, x, mode, richness); return m ? m.perHour : NaN; };
            const cx = this.crossList(rows, mode, metric, 'ore an hour');
            return `
                <section class="an-stats cd-stats">
                    ${top ? this.stat(this.dot(top), `most ore delivered an hour at ${num(d, 1)} AU: ${esc(top.st.label)}${gain ? ` · ${num(gain, 2)}× the runner-up` : ''}`) : this.stat('–', 'none of these hulls mines')}
                    ${top ? this.stat(pct(top.m.miningShare), `of ${top.letter}'s time is spent mining, the rest hauling (${dur(top.m.fill)} to fill, ${dur(top.m.trip.time)} round trip)`) : ''}
                    ${crewBest ? this.stat(this.dot(crewBest), `most ore per crew-hour: ${big(crewBest.m.perCrewHour)} (${esc(crewBest.st.name)}, crew ${num(Math.ceil(crewBest.st.mod.required_crew), 0)})`) : ''}
                    ${this.stat(num(cx.cross.length, 0), `crossover${cx.cross.length === 1 ? '' : 's'} between ${DMIN} and ${DMAX} AU`)}
                </section>
                <section class="rx-panel vs-charts">
                    ${this.chart(rows, d, mode, (st, x) => { const m = Loadout.mine(st, x, mode, richness); return m ? m.perHour : NaN; }, 'ore units delivered an hour', `Ore delivered an hour against the route to the drop-off (richness ${num(richness, 2)})`)}
                    ${this.chart(rows, d, mode, (st, x) => { const m = Loadout.mine(st, x, mode, richness); return m ? m.miningShare * 100 : NaN; }, '% of the cycle spent mining', 'Share of each cycle spent mining rather than hauling')}
                </section>
                <section class="vs-grid">
                    <div class="rx-panel"><h3 class="vs-h">At ${num(d, 1)} AU, richness ${num(richness, 2)}</h3>
                        <div class="an-tablewrap"><table class="an-table vs-table"><thead><tr><th>Loadout</th><th>rate /s</th><th>hold</th><th>fill</th><th>round trip</th><th>cycle</th><th>ore / hour</th><th>mining %</th><th>food per unit</th><th>fuel per unit</th><th>crew</th><th>ore / crew-hour</th><th>vs base hull</th></tr></thead>
                        <tbody>${at.map(r => r.m ? `<tr style="--c:${r.color}"><th><i class="vs-dot"></i>${r.letter} · ${esc(r.st.label)}</th><td>${num(r.m.rate)}</td><td>${big(r.st.mod.cargo_capacity)}</td><td>${dur(r.m.fill)}</td><td>${dur(r.m.trip.time)}</td><td>${dur(r.m.cycle)}</td><td class="${r === top ? 'best' : ''}">${big(r.m.perHour)}</td><td>${pct(r.m.miningShare)}</td><td>${num(r.m.foodPerUnit, 4)}</td><td>${num(r.m.fuelPerUnit, 3)}</td><td>${num(Math.ceil(r.st.mod.required_crew), 0)}</td><td class="${r === crewBest ? 'best' : ''}">${big(r.m.perCrewHour)}</td><td>${r.base && r.base.perHour > 0 ? `×${num(r.m.perHour / r.base.perHour, 2)}` : '–'}</td></tr>` : `<tr><th>${r.letter} · ${esc(r.st.label)}</th><td colspan="12">no mining rate${mode === 'subwarp' ? ' or no subwarp drive' : ''}</td></tr>`).join('')}</tbody></table></div>
                        <p class="rx-note">Only the three Miner-spec hulls (IMP, Tap, Tip) mine for real; every other hull carries a small default of 2.29/s or less. Fittings (Mining Rig, drones) raise the rate; cargo fittings raise the hold and so the time per fill.</p></div>
                    <div class="rx-panel"><h3 class="vs-h">Where the ranking flips</h3>${cx.html}<p class="rx-note">A bigger hold mines longer per trip, a bigger rig fills faster; the route length decides how much the haul back weighs.</p></div>
                </section>
                <section class="rx-panel"><h3 class="vs-h">What the configurations change</h3>${this.statTable(rows, Loadout.MINE_STATS)}${this.fits(rows)}</section>`;
        }

        // ---- Scan
        scan(rows) {
            const at = rows.map(r => Object.assign({ sc: Loadout.scan(r.st.mod), base: Loadout.scan(r.st.base) }, r));
            const live = at.filter(r => r.sc), top = live.slice().sort((p, q) => q.sc.sduPerHour - p.sc.sduPerHour)[0];
            const perTok = live.filter(r => isFinite(r.sc.sduPerToken)).sort((p, q) => q.sc.sduPerToken - p.sc.sduPerToken)[0];
            const perCrew = live.filter(r => r.sc.sduPerCrewHour).sort((p, q) => q.sc.sduPerCrewHour - p.sc.sduPerCrewHour)[0];
            const bars = (key, fmt) => { const max = Math.max(1e-12, ...live.map(r => r.sc[key] || 0)); return live.map(r => `<div class="ch-row"><span class="ch-lbl" style="color:${r.color}">${r.letter} · ${esc(r.st.name)}</span><div class="ch-bar"><b style="width:${Math.max(0.6, 100 * (r.sc[key] || 0) / max).toFixed(1)}%;background:${r.color}"></b></div><span class="ch-val">${fmt(r.sc[key])}</span></div>`).join(''); };
            return `
                <section class="an-stats cd-stats">
                    ${top ? this.stat(this.dot(top), `most SDU an hour: ${big(top.sc.sduPerHour)} (${esc(top.st.label)})`) : this.stat('–', 'none of these hulls scans')}
                    ${perTok ? this.stat(this.dot(perTok), `most SDU per Toolkit spent: ${num(perTok.sc.sduPerToken, 2)} (${esc(perTok.st.name)})`) : ''}
                    ${perCrew ? this.stat(this.dot(perCrew), `most SDU per crew-hour: ${big(perCrew.sc.sduPerCrewHour)} (${esc(perCrew.st.name)})`) : ''}
                </section>
                <section class="rx-panel vs-charts vs-scanbars">
                    <div><h3 class="vs-h">SDU an hour</h3>${bars('sduPerHour', big)}</div>
                    <div><h3 class="vs-h">SDU per Toolkit</h3>${bars('sduPerToken', v => isFinite(v) ? num(v, 2) : 'free')}</div>
                </section>
                <section class="rx-panel"><h3 class="vs-h">Per loadout</h3>
                    <div class="an-tablewrap"><table class="an-table vs-table"><thead><tr><th>Loadout</th><th>scan power</th><th>SDU / scan</th><th>cooldown</th><th>scans / hour</th><th>SDU / hour</th><th>Toolkits / scan</th><th>Toolkits / hour</th><th>SDU per Toolkit</th><th>crew</th><th>SDU / crew-hour</th><th>vs base hull</th></tr></thead>
                    <tbody>${at.map(r => r.sc ? `<tr style="--c:${r.color}"><th><i class="vs-dot"></i>${r.letter} · ${esc(r.st.label)}</th><td>${num(r.sc.power, 0)}</td><td>${num(r.st.mod.sduPerScan, 0)}</td><td>${dur(r.st.mod.scan_cool_down)}</td><td>${num(r.sc.scansPerHour, 2)}</td><td class="${r === top ? 'best' : ''}">${big(r.sc.sduPerHour)}</td><td>${num(r.st.mod.scan_cost, 0)}</td><td>${big(r.sc.tokensPerHour)}</td><td class="${r === perTok ? 'best' : ''}">${isFinite(r.sc.sduPerToken) ? num(r.sc.sduPerToken, 2) : 'free'}</td><td>${num(Math.ceil(r.st.mod.required_crew), 0)}</td><td class="${r === perCrew ? 'best' : ''}">${big(r.sc.sduPerCrewHour)}</td><td>${r.base && r.base.sduPerHour > 0 ? `×${num(r.sc.sduPerHour / r.base.sduPerHour, 2)}` : '–'}</td></tr>` : `<tr><th>${r.letter} · ${esc(r.st.label)}</th><td colspan="11">no scanner</td></tr>`).join('')}</tbody></table></div>
                    <p class="rx-note">SDU = Survey Data Units, the Data Running currency (research nodes such as Contested Space Scanning cost them). Scan cost: the hull stat says tokens; the export's scan patterns charge cargo 3, the Toolkit.</p>
                </section>
                <section class="rx-panel"><h3 class="vs-h">What the configurations change</h3>${this.statTable(rows, Loadout.SCAN_STATS)}${this.fits(rows)}</section>`;
        }

        // ---- Fight
        fight(rows) {
            if (!this.lo.fightFn()) return '<section class="rx-panel"><p class="rx-note">The combat formula is not in the data bundle (Data/combat-data.js).</p></section>';
            const N = this.s.fights, pairs = [];
            for (let a = 0; a < rows.length; a++) for (let b = a + 1; b < rows.length; b++) {
                const A = rows[a], B = rows[b], key = `${A.st.label}|${B.st.label}|${N}`;
                let f = this.fightCache.get(key); if (!f) { f = this.lo.fight(A.st.mod, B.st.mod, N); this.fightCache.set(key, f); }
                pairs.push({ A, B, f });
            }
            // a win tally per loadout across its pairs
            const wins = rows.map(r => ({ r, w: 0, n: 0 })); pairs.forEach(p => { wins[p.A.i].w += p.f.pA; wins[p.A.i].n++; wins[p.B.i].w += p.f.pB; wins[p.B.i].n++; });
            const rank = wins.filter(w => w.n).sort((p, q) => q.w / q.n - p.w / p.n), top = rank[0];
            const bar = f => `<div class="vs-fbar"><i style="width:${(100 * f.pA).toFixed(1)}%;background:var(--ca)"></i><i style="width:${(100 * f.pDraw).toFixed(1)}%;background:rgba(255,255,255,0.18)"></i><i style="width:${(100 * f.pB).toFixed(1)}%;background:var(--cb)"></i></div>`;
            return `
                <section class="an-stats cd-stats">
                    ${top ? this.stat(this.dot(top.r), `wins most often across its pairs: ${pct(top.w / top.n)} (${esc(top.r.st.label)})`) : ''}
                    ${this.stat(num(pairs.length, 0), `pair${pairs.length === 1 ? '' : 's'} fought, ${num(N, 0)} bouts each, first strike alternating`)}
                    ${pairs.length ? this.stat(num(pairs.reduce((a, p) => a + p.f.meanRounds, 0) / pairs.length, 0), 'mean rounds per bout') : ''}
                    <div class="an-stat vs-fightctl"><label><span>Bouts per pair</span><select class="sb-input" data-fights>${[200, 500].map(n => `<option value="${n}"${n === N ? ' selected' : ''}>${n}</option>`).join('')}</select></label><button type="button" class="sb-btn ghost" data-refight>Re-roll</button></div>
                </section>
                <section class="rx-panel"><h3 class="vs-h">Every pair</h3>
                    <div class="vs-pairs">${pairs.map(p => `<div class="vs-pair" style="--ca:${p.A.color};--cb:${p.B.color}">
                        <div class="vs-pair-head"><b style="color:${p.A.color}">${p.A.letter}</b> <span>${esc(p.A.st.label)}</span><em>vs</em><span>${esc(p.B.st.label)}</span> <b style="color:${p.B.color}">${p.B.letter}</b></div>
                        ${bar(p.f)}
                        <div class="vs-pair-nums"><span style="color:${p.A.color}">${pct(p.f.pA)}${p.f.meanRoundsA ? ` · ${num(p.f.meanRoundsA, 0)} rounds` : ''}</span><span class="dim">${p.f.pDraw ? pct(p.f.pDraw) + ' draw / mutual' : ''}</span><span style="color:${p.B.color}">${pct(p.f.pB)}${p.f.meanRoundsB ? ` · ${num(p.f.meanRoundsB, 0)} rounds` : ''}</span></div>
                        ${p.f.error ? `<p class="rx-note warn">formula error: ${esc(p.f.error)}</p>` : ''}</div>`).join('')}</div>
                    <p class="rx-note">The formula models hull and shields, damage by type against counters, hit chance by size ratio, crits, missiles and ammo, repair and stimulants; what it cannot see is a pilot. A share near 50 / 50 with few draws is a coin-flip matchup, not a mirror. Shares move about ±3.5 points between re-rolls at 200 bouts; treat a gap under 10 points as even. A loss in a medium-risk zone destroys every fitting of the losing fleet - the Cost tab is what that loss costs.</p>
                    <div class="vs-formula-bar"><button type="button" class="sb-btn ghost" data-formula-toggle>${this.showFormula ? 'Hide the formula' : 'Show the formula'}</button><button type="button" class="sb-btn ghost" data-formula-download>Download combat-formula.js</button><small>${num(this.lo.combat.combatFormula.split('\n').length, 0)} lines, ${num(this.lo.combat.combatFormula.length / 1024, 0)} KB, <code>shipConfigurations.combatFormula</code> as exported ${esc(this.lo.combat.exportDate || '')}, run here unchanged</small></div>
                    ${this.showFormula ? `<pre class="vs-formula" tabindex="0">${esc(this.lo.combat.combatFormula)}</pre>` : ''}
                </section>
                <section class="rx-panel"><h3 class="vs-h">What the configurations change</h3>${this.statTable(rows, Loadout.FIGHT_STATS)}${this.fits(rows)}</section>`;
        }

        // ---- Fleet
        fleet(rows) {
            const F = this.s.fleet, cap = this.fleetCaps.find(c => c.tier === F.tier) || this.fleetCaps[0];
            const lines = F.ships.map(x => { const st = this.lo.stats(x.ship, x.cfg); const pts = st.points || 0; const t = Loadout.trip(st.mod, this.s.d, this.s.mode), m = Loadout.mine(st.mod, this.s.d, this.s.mode, this.s.richness); return { x, st, pts, total: pts * x.n, t, m }; });
            const used = lines.reduce((a, l) => a + l.total, 0), hulls = lines.reduce((a, l) => a + l.x.n, 0);
            const sum = k => lines.reduce((a, l) => a + (l.st.mod[k] || 0) * l.x.n, 0);
            const cargoH = lines.reduce((a, l) => a + (l.t ? l.t.perHour * l.x.n : 0), 0), oreH = lines.reduce((a, l) => a + (l.m ? l.m.perHour * l.x.n : 0), 0);
            const left = cap.cap - used;
            const lim = (this.lo.combat && this.lo.combat.fleetPoints && this.lo.combat.fleetPoints.composition_limits) || {};
            const titans = lines.filter(l => l.st.cls === 9).reduce((a, l) => a + l.x.n, 0), cmds = lines.filter(l => l.st.cls === 7).reduce((a, l) => a + l.x.n, 0);
            const comp = [];
            if (lim.max_titans != null && titans > lim.max_titans) comp.push(`${titans} Titans (at most ${lim.max_titans})`);
            if (lim.max_commanders_plus_titans != null && cmds + titans > lim.max_commanders_plus_titans) comp.push(`${cmds + titans} Commanders plus Titans (at most ${lim.max_commanders_plus_titans})`);
            const maxCap = this.fleetCaps[this.fleetCaps.length - 1].cap, ptsOf = c => (this.lo.points.get(c) || {}).capacity_points || 0;
            // what else fits: every loadout's points against what is left
            const fits = rows.map(r => ({ r, n: r.st.points ? Math.floor(Math.max(0, left) / r.st.points) : 0 }));
            return `
                <section class="an-stats cd-stats">
                    ${this.stat(`${num(used, 0)} <small>/ ${cap.cap}</small>`, `fleet points used at Fleet Size ${cap.label}${left < 0 ? ` · ${num(-left, 0)} OVER the cap` : ` · ${num(left, 0)} left`}`, left < 0)}
                    ${this.stat(num(hulls, 0), `hull${hulls === 1 ? '' : 's'} · crew ${num(lines.reduce((a, l) => a + Math.ceil((l.st.mod.required_crew || 0) - 1e-9) * l.x.n, 0), 0)}`)}
                    ${comp.length ? this.stat('!', `fleet breaks a composition limit: ${comp.join('; ')}`, true) : ''}
                    ${this.stat(big(sum('cargo_capacity')), `hold in total · ${big(cargoH)} cargo an hour on ${art(num(this.s.d, 1))} ${num(this.s.d, 1)} AU route`)}
                    ${this.stat(big(oreH), `ore an hour at richness ${num(this.s.richness, 2)} on that route`)}
                </section>
                <section class="cd-strip"><span class="cd-me"><span>Fleet Size</span>${this.fleetCaps.map(c => `<button type="button" class="chip${F.tier === c.tier ? ' on' : ''}" data-fl-tier="${c.tier}">${c.label}<small>${c.cap}</small></button>`).join('')}</span>
                    <span class="cd-me"><span>Add</span>${rows.map(r => `<button type="button" class="chip" data-fl-add="${r.i}" style="--c:${r.color}"><i class="vs-dot"></i>${r.letter} · ${esc(r.st.ship.name.replace(/^Armstrong /, ''))} ${esc(r.st.name)} <small>${r.st.points || '?'} pts</small></button>`).join('')}</span>
                    ${F.ships.length ? '<button type="button" class="sb-btn ghost" data-fl-clear>Clear fleet</button>' : ''}
                    ${F.ships.length && this.research ? `<button type="button" class="sb-btn" data-fl-research>Research this fleet needs →</button>` : ''}
                </section>
                <section class="vs-grid">
                    <div class="rx-panel"><h3 class="vs-h">The fleet</h3>
                        ${lines.length ? `<div class="an-tablewrap"><table class="an-table vs-table vs-fleet"><thead><tr><th>Hull · configuration</th><th>×</th><th>pts each</th><th>pts</th><th>crew</th><th>hold</th><th>cargo / h</th><th>ore / h</th><th>HP</th><th>damage</th><th></th></tr></thead>
                        <tbody>${lines.map(l => `<tr><th>${this.shipSel(`data-fl-ship="${l.x.id}"`, l.x.ship)}${this.cfgSel(`data-fl-cfg="${l.x.id}"`, l.x.ship, l.x.cfg)}</th><td><input type="number" class="sb-input vs-n" min="1" max="99" value="${l.x.n}" data-fl-n="${l.x.id}" aria-label="Count"></td><td>${l.pts || '?'}</td><td>${num(l.total, 0)}</td><td>${num(Math.ceil((l.st.mod.required_crew || 0) - 1e-9) * l.x.n, 0)}</td><td>${big(l.st.mod.cargo_capacity * l.x.n)}</td><td>${l.t ? big(l.t.perHour * l.x.n) : '–'}</td><td>${l.m ? big(l.m.perHour * l.x.n) : '–'}</td><td>${big((l.st.mod.hit_points || 0) * l.x.n)}</td><td>${num((l.st.mod.damage || 0) * l.x.n, 0)}</td><td><button type="button" class="vs-x inline" data-fl-to-lo="${l.x.id}" title="Compare this loadout on the Haul tab">⇄</button><button type="button" class="vs-x inline" data-fl-remove="${l.x.id}" aria-label="Remove">×</button></td></tr>`).join('')}</tbody></table></div>` : '<p class="rx-note">Add loadouts with the buttons above; each row takes a count.</p>'}
                        <div class="vs-gauge"><i style="width:${Math.min(100, 100 * used / Math.max(1, cap.cap)).toFixed(1)}%;background:${left < 0 ? 'var(--warn)' : 'var(--ok)'}"></i></div>
                        <p class="rx-note">Cargo and ore an hour use the Haul / Mine route length and richness. Damage is the hull's per-hit figure; the Fight tab settles who wins.</p></div>
                    <div class="rx-panel"><h3 class="vs-h">What still fits</h3>
                        <ul class="vs-cross">${fits.map(f => `<li><b style="color:${f.r.color}">${f.r.letter}</b> ${esc(f.r.st.label)}: <b>${f.r.st.points ? num(f.n, 0) : '?'}</b> more${f.r.st.points ? ` at ${f.r.st.points} pts each` : ''}</li>`).join('')}</ul>
                        <h4 class="vs-h small">Points by class</h4>
                        <div class="chips">${Array.from(this.lo.points.values()).sort((a, b) => a.size - b.size).map(c => `<span class="chip static">${esc(c.token)} <b>${c.capacity_points}</b>${c.capacity_points !== c.combat_points ? `<small>combat ${c.combat_points}</small>` : ''}${c.player_fleet_class === false ? '<small>not a player class</small>' : ''}</span>`).join('')}</div>
                        <p class="rx-note">Points grow with the square of the class index (1, 4, 9 ... 64; a Titan counts 128 against the cap): a Tier 8 cap of ${maxCap} holds ${num(Math.floor(maxCap / ptsOf(4)), 0)} Taps (M, ${ptsOf(4)}) or ${num(Math.floor(maxCap / ptsOf(6)), 0)} IMPs (CAP, ${ptsOf(6)}).</p></div>
                </section>`;
        }

        // the research the Fleet sub-tab's fleet needs: a size node per hull size flown, plus the Fleet Size tier chosen
        // (the Research tab's 'empire' goal takes a tag set and a caption and lights the closure)
        fleetResearch() {
            const m = this.research; if (!m) return null;
            const F = this.s.fleet, tags = new Set(), sizes = new Set(), missing = [];
            F.ships.forEach(x => { const s = this.lo.byName.get(x.ship); if (!s) return; sizes.add(s.sizeTier); const n = m.shipSizeNode && m.shipSizeNode(s.sizeTier); if (n) n.tags.forEach(t => tags.add(t)); else if (s.sizeTier !== 'XXS') missing.push(s.sizeTier); });
            const cap = this.fleetCaps.find(c => c.tier === F.tier);
            const fsNode = cap && cap.tier > 0 ? (m.byName && m.byName.get(`Fleet Size - Tier ${cap.tier}`)) : null;
            if (fsNode) fsNode.tags.forEach(t => tags.add(t));
            const hulls = F.ships.reduce((a, x) => a + x.n, 0);
            return { tags: Array.from(tags), sub: `${hulls} hull${hulls === 1 ? '' : 's'} on the Fleet tab (${Array.from(sizes).join(', ')})${fsNode ? ` and Fleet Size ${cap.label} (${cap.cap} points)` : ''}${missing.length ? ` - no size node in the export for ${missing.join(', ')}` : ''}` };
        }

        // ---- Cost
        cost(rows) {
            const costs = rows.map(r => Object.assign({ c: this.lo.cost(r.st) }, r));
            const allRaws = new Map(); costs.forEach(r => r.c.rawList.forEach(x => { const e = allRaws.get(x.name) || { name: x.name, res: x.res, by: {} }; e.by[r.i] = x.qty; allRaws.set(x.name, e); }));
            const rawRows = Array.from(allRaws.values()).sort((a, b) => Object.values(b.by).reduce((s, v) => s + v, 0) - Object.values(a.by).reduce((s, v) => s + v, 0));
            const priced = costs.filter(r => r.c.found && !r.c.unpriced.length), skipped = costs.length - priced.length;
            const cheapest = priced.slice().sort((p, q) => p.c.rawUnits - q.c.rawUnits)[0];
            return `
                <section class="an-stats cd-stats">
                    ${cheapest ? this.stat(this.dot(cheapest), `cheapest fit in raw units: ${big(cheapest.c.rawUnits)} (${esc(cheapest.st.name)})${skipped ? ` · ${skipped} not fully priced, left out` : ''}`) : this.stat('–', 'no configuration fully priced')}
                    ${costs.map(r => this.stat(big(r.c.rawUnits), `${r.letter} · ${esc(r.st.name)}: ${num(r.c.found, 0)} recipe${r.c.found === 1 ? '' : 's'}, ${big(r.c.crafts)} crafts${r.c.unpriced.length ? `, ${r.c.unpriced.length} unpriced` : ''}`, r.c.unpriced.length > 0)).join('')}
                </section>
                <div class="vs-fits vs-costs">${costs.map(r => `<div class="rx-panel vs-fit" style="--c:${r.color}"><h4><i class="vs-dot"></i>${r.letter} · ${esc(r.st.label)}</h4>
                    ${r.c.recipes.length ? `<ul class="vs-recipes">${r.c.recipes.map(it => `<li><b>${esc(it.name)}</b> ×${it.qty}${it.assumed ? ` <small>${esc(it.assumed)}</small>` : ''}</li>`).join('')}</ul>` : '<p class="rx-note">Nothing fitted.</p>'}
                    ${r.c.unpriced.length ? `<p class="rx-note warn">No recipe found for: ${r.c.unpriced.map(u => esc(u.name + (u.cls ? ' ' + u.cls : '') + (u.tier ? ' ' + u.tier : ''))).join(', ')}</p>` : ''}
                    ${r.c.found ? `<p class="rx-note">${big(r.c.rawUnits)} raw units of ${num(r.c.rawList.length, 0)} kinds, ${big(r.c.crafts)} crafts${r.c.time ? `, critical path ${dur(r.c.time.critical)}` : ''}.</p><button type="button" class="sb-btn" data-plan-add="${r.i}">Add these recipes to the production plan</button>` : ''}
                </div>`).join('')}</div>
                ${rawRows.length ? `<section class="rx-panel"><h3 class="vs-h">Raw bill side by side</h3>
                    <div class="an-tablewrap"><table class="an-table vs-stats vs-rawbill"><thead><tr><th>Raw</th>${costs.map(r => `<th style="--c:${r.color}"><i class="vs-dot"></i>${r.letter}</th>`).join('')}</tr></thead>
                    <tbody>${rawRows.map(x => { const vals = costs.map(r => x.by[r.i] || 0); const mn = Math.min(...vals.filter(v => v > 0)); return `<tr><th>${esc(x.name)}${x.res ? ` <i class="t t${x.res.tier}">T${x.res.tier}</i>` : ''}</th>${vals.map(v => `<td class="${v > 0 && v === mn && vals.filter(q => q > 0).length > 1 ? 'best' : ''}">${v ? big(v) : '<small class="dim">–</small>'}</td>`).join('')}</tr>`; }).join('')}</tbody></table></div>
                    <p class="rx-note">Units of each raw in the full crafting chain of the configuration's components, one set of components per hull. The Recipe Explorer plan button adds the component recipes themselves; the planner shows the same bill with build order and time.</p></section>` : ''}`;
        }
    }

    window.DeckVsTab = LoadoutsTab;
})();
