// deck-calc.js - Command Deck, Ships vs Stakes tab (2026-10-04, layout reworked 2026-10-26).
// A mining hull's rate is per SECOND, a claim-stake extractor's is per TICK, and no source gives the tick length.
// So the tick is an input, and the page leads with what it decides: buy a hull or a stake for this raw.
//   - verdict: one hull against one full stake of the chosen tier, in words - how many of one equal the other, the
//     same per dollar, the tick at which the answer flips, and what each asks of the player (unload vs storage full)
//   - head to head: the two side by side (art from Images/ships and Images/stake), asks typed on the cards
//   - one chart: the chosen hull and stake only, output (or per dollar) against the tick length, log-log; drag or
//     click it to set the tick. Any hull with a mining rate can be picked (61 of 67; the Tap by default)
//   - "measure your tick" sits right under the tick setting: one extractor, storage read twice an hour apart
//   - every tier and hull in a fold-away: break-even ticks, fair prices, hold / storage / fuel / food / crew
// The reference stake is the fullest same-tier layout (storage hub + extraction hub + every extractor that fits,
// crew quarters and power plants as needed), all extractors on the chosen raw. Hull and stake are compared on the
// same deposit, so richness cancels. Prices are the player's input; nothing here knows crew, food, fuel or
// building-material prices.
(function () {
    'use strict';

    const { esc, num, dur, usd, snd, settingsStrip, bindStrip, PRICE_DATE } = window.DeckUI;
    const Store = window.DeckStore, Calc = window.CommandDeck.Calc;
    const TIER_COLOR = { 1: '#9ec3d6', 2: '#7ee8a4', 3: '#4fd8ff', 4: '#b98cff', 5: '#ffd36b' };
    const short = n => n.replace(/^Armstrong /, '');
    const art = n => (/^([aeiou]|8\d*(\D|$)|11(\D|$)|18(\D|$))/i.test(n) ? 'an' : 'a');
    const usdF = v => (v != null && v > 0 && v < 0.01 ? '< $0.01' : usd(v));
    const times = v => (v >= 100 ? num(v, 0) : num(v, v >= 10 ? 1 : 2));
    const log10 = Math.log10;
    // chart frame (viewBox units); the tick axis runs 0.01 s to 1 h
    const CW = 1200, CH = 380, ML = 62, MR = 104, MT = 34, MB = 40, X0 = 0.01, X1 = 3600;
    const px = x => ML + (log10(x) - log10(X0)) / (log10(X1) - log10(X0)) * (CW - ML - MR);
    const tickAt = vx => Math.pow(10, log10(X0) + (Math.min(CW - MR, Math.max(ML, vx)) - ML) / (CW - ML - MR) * (log10(X1) - log10(X0)));
    const ART_SHIPS = '../Images/ships/', STAKE_ART = '../Images/stake/extractor.webp';

    class CalcTab {
        constructor(root, ctx) {
            this.root = root; this.se = ctx.se; this.empire = ctx.empire; this.rm = ctx.rm;
            this.loadout = ctx.loadout || null;                                          // fits a hull with one of its configurations
            // raws a stake can extract at every tier
            this.raws = this.rm.list.filter(r => r.category === 'raw' && [1, 2, 3, 4, 5].every(t => (this.se.extractors.get(r.id + '|' + t) || []).length)).sort((a, b) => a.name.localeCompare(b.name));
            this.measure = { tier: 3, richness: 1, units: '', ptype: '' };
            this.mode = 'units';                                                         // chart: 'units' | 'usd'
            this.shipArt = {};
            bindStrip(root); this.bind();
            Store.on(() => { if (this.visible()) this.render(); else this.stale = true; });
            this.stale = true;
            // hull portraits: the Ship Explorer's art manifest (keyed by ship name); the page works without it
            if (typeof fetch === 'function') fetch(ART_SHIPS + 'manifest.json').then(r => (r.ok ? r.json() : {})).then(m => { this.shipArt = m || {}; if (this.visible() && this.c) this.render(); }).catch(() => { });
        }
        visible() { return this.root.closest('.tab-content').classList.contains('active'); }
        show() { if (this.stale) this.render(); }

        bind() {
            this.root.addEventListener('change', e => {
                const raw = e.target.closest('[data-raw]'); if (raw) { Store.s.calc.raw = raw.value; Store.save(); return; }
                const ref = e.target.closest('[data-ref]'); if (ref) { Store.s.calc.ref = ref.value; Store.save(); return; }
                const cfg = e.target.closest('[data-cfg]'); if (cfg) { Store.s.calc.cfg = cfg.value; Store.save(); return; }
                const ps = e.target.closest('[data-price-ship]'); if (ps) { Store.setPrice('ships', ps.dataset.priceShip, ps.value); return; }
                const pt = e.target.closest('[data-price-stake]'); if (pt) { Store.setPrice('stakes', pt.dataset.priceStake, pt.value); return; }
            });
            this.root.addEventListener('input', e => {
                const m = e.target.closest('[data-measure]'); if (!m) return;
                this.measure[m.dataset.measure] = m.value; this.renderMeasure();
            });
            // the strip's own handler puts the box back to the tick in use; read what was typed first (capture phase) so we can say so
            this.root.addEventListener('change', e => { const t = e.target.closest('[data-tick]'); if (t) this.typedTick = parseFloat(t.value); }, true);
            this.root.addEventListener('change', e => {
                const t = e.target.closest('[data-tick]'); if (!t) return;
                const v = this.typedTick, used = Store.s.tick, clamped = v > 0 && Math.abs(v - used) > 1e-9;
                const box = this.root.querySelector('[data-tick]') || t;      // a good value re-rendered the tab: use the live box
                box.value = used;
                const old = box.parentNode.querySelector('.cd-clamp'); if (old) old.remove();
                if (!(v > 0) || clamped) box.parentNode.insertAdjacentHTML('beforeend', `<em class="cd-clamp">${v > 0 ? 'clamped to' : 'not a number, using'} ${used}</em>`);
            });
            this.root.addEventListener('click', e => {
                const use = e.target.closest('[data-use-tick]'); if (use && this.measured > 0) { snd('success'); Store.setTick(this.measured, 'measured'); return; }
                const tr = e.target.closest('[data-calc-tier]'); if (tr) { snd('select'); Store.s.calc.tier = +tr.dataset.calcTier; Store.save(); return; }
                // extractors on the chosen stake: 1..the most that fit (kept per tier)
                const ex = e.target.closest('[data-ext-step]'); if (ex && this.c) { const st = this.c.stake, n = Math.max(1, Math.min(st.max, st.k + +ex.dataset.extStep)); if (n !== st.k) { snd('select'); Store.s.calc.ext = Object.assign({}, Store.s.calc.ext, { [st.tier]: n }); Store.save(); } return; }
                const md = e.target.closest('[data-chart-mode]'); if (md) { snd('select'); this.mode = md.dataset.chartMode; this.render(); return; }
            });
            this.root.addEventListener('toggle', e => { if (e.target.matches && e.target.matches('details[data-fold]')) this.folds = Object.assign(this.folds || {}, { [e.target.dataset.fold]: e.target.open }); }, true);
            // the chart's tick line: press anywhere on the plot and drag; the tick is set on release
            this.root.addEventListener('pointerdown', e => {
                const svg = e.target.closest('svg[data-tick-chart]'); if (!svg || e.button !== 0) return;
                this.drag = { svg }; svg.setPointerCapture(e.pointerId); this.dragTo(e); e.preventDefault();
            });
            this.root.addEventListener('pointermove', e => { if (this.drag) this.dragTo(e); });
            const end = () => { if (!this.drag) return; const v = this.drag.tick; this.drag = null; if (v > 0) { snd('select'); Store.setTick(Number(v.toPrecision(3)), 'set'); } };
            this.root.addEventListener('pointerup', end);
            this.root.addEventListener('pointercancel', () => { this.drag = null; this.render(); });
        }
        // move the tick line under the pointer (viewBox x from the SVG's screen matrix) and say the tick
        dragTo(e) {
            const svg = this.drag.svg, m = svg.getScreenCTM(); if (!m) return;
            const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
            const v = tickAt(p.matrixTransform(m.inverse()).x), x = px(v).toFixed(1);
            this.drag.tick = v;
            const line = svg.querySelector('.mark'), lab = svg.querySelector('.lb.mk');
            if (line) { line.setAttribute('x1', x); line.setAttribute('x2', x); }
            if (lab) { lab.setAttribute('x', x); lab.textContent = `tick: ${dur(Number(v.toPrecision(3)))}`; }
        }

        compute() {
            const s = Store.s, raw = this.raws.find(r => r.id === s.calc.raw) || this.raws.find(r => r.id === 'copper-ore') || this.raws[0];
            const refShip = this.empire.shipByName.get(s.calc.ref), refName = refShip && refShip.rate > 0 ? s.calc.ref : 'Armstrong IMP Tap';   // any hull that mines; the Tap by default
            const ref = this.fitted(refName, s.calc.cfg), ships = [ref];
            const tiers = [1, 2, 3, 4, 5].map(t => this.se.fullStake(t, raw.id)).filter(Boolean).map(t => Object.assign(t, this.stakeFuel(t, raw.id)));
            // the chosen stake: its tier with the extractor count the player set (full when unset)
            const tier = (tiers.find(x => x.tier === s.calc.tier) || tiers[tiers.length - 1]).tier;
            const stake = this.se.stakeWith(tier, raw.id, (s.calc.ext || {})[tier]); Object.assign(stake, this.stakeFuel(stake, raw.id));
            return { s, raw, ref, ships, tiers, stake, tick: s.tick };
        }
        // the hull with a configuration fitted (the Loadouts engine): mining rate, hold, food and crew as fitted.
        // 'Default' is the export's own fit and equals the base row; no Loadouts engine -> the base row
        fitted(name, cfg) {
            const base = this.empire.shipByName.get(name), cfgs = this.loadout ? this.loadout.configsOf(name) : [];
            const use = cfgs.includes(cfg) ? cfg : (cfgs.includes('Default') ? 'Default' : cfgs[0] || null);
            const st = use && this.loadout.stats(name, use);
            if (!st) return Object.assign({}, base, { cfg: null, cfgs });
            const m = st.mod;
            return Object.assign({}, base, { cfg: use, cfgs, rate: m.asteroid_mining_rate || 0, cargo: m.cargo_capacity || 0, food: m.asteroid_mining_food_rate || 0, crew: m.required_crew || 0 });
        }

        // fuel the full stake burns per tick (power plants and hubs), from the Stake Engine's production on a real planet
        // that can host the extractor; the export gives the rate per tick only
        stakeFuel(t, raw) {
            for (const p of this.se.planets) {
                if (!p.stakeable) continue;
                const pl = Object.assign({}, p, { deposits: new Map([[raw, { name: raw, richness: 1 }]]) });      // the raw is on the planet by assumption, as in fullStake
                if (!this.se.extractorFor(pl, raw, t.tier)) continue;
                const pr = this.se.production(pl, t.tier, { [raw]: t.k }, [], { richness: false });
                if (pr.layout.ok && pr.layout.npp === t.npp && pr.layout.ncq === t.ncq) return { fuel: pr.fuel, fuelPerUnit: t.perTick > 0 ? pr.fuel / t.perTick : null };
            }
            return { fuel: null, fuelPerUnit: null };
        }
        // planet types that can host a stake on this raw, with the central hub's passive trickle of it per tick
        planetTypes(raw, tier) {
            const out = new Map();
            this.se.planets.forEach(p => { if (!p.stakeable || !p.deposits.has(raw) || out.has(p.catName)) return; const pr = this.se.production(p, tier, { [raw]: 1 }, [], { richness: false }); out.set(p.catName, pr.passive.get(raw) || 0); });
            return out;
        }

        // log-log chart. series: [{label, color, perTick, sel}] fall as 1/tick; flats: [{label, value, sel}] are horizontal.
        // The chosen tier and hull are drawn bright, the rest dim; a dot marks where the chosen pair is equal.
        chart(series, flats, tick, unit) {
            const vals = []; series.forEach(sr => { vals.push(sr.perTick * 3600 / X0, sr.perTick * 3600 / X1); }); flats.forEach(f => vals.push(f.value));
            const pos = vals.filter(v => v > 0); if (!pos.length) return '<p class="rx-note">Nothing to draw: type an ask for the stake and the hull on the cards above.</p>';
            const y0 = Math.floor(log10(Math.min(...pos))), y1 = Math.ceil(log10(Math.max(...pos)));
            const py = v => MT + (y1 - log10(v)) / Math.max(1, y1 - y0) * (CH - MT - MB);
            const pow = e => (e >= 6 ? num(Math.pow(10, e - 6)) + 'M' : e >= 3 ? num(Math.pow(10, e - 3)) + 'k' : e >= 0 ? num(Math.pow(10, e)) : (e >= -6 ? Math.pow(10, e).toFixed(-e) : '1e' + e));
            let g = '';
            for (let e = y0; e <= y1; e++) g += `<line class="grid" x1="${ML}" x2="${CW - MR}" y1="${py(Math.pow(10, e)).toFixed(1)}" y2="${py(Math.pow(10, e)).toFixed(1)}"></line><text class="ax" x="${ML - 8}" y="${(py(Math.pow(10, e)) + 3.5).toFixed(1)}" text-anchor="end">${pow(e)}</text>`;
            [[0.01, '0.01 s'], [0.1, '0.1 s'], [1, '1 s'], [10, '10 s'], [60, '1 min'], [600, '10 min'], [3600, '1 h']].forEach(([x, l]) => { g += `<line class="grid" x1="${px(x).toFixed(1)}" x2="${px(x).toFixed(1)}" y1="${MT}" y2="${CH - MB}"></line><text class="ax" x="${px(x).toFixed(1)}" y="${CH - MB + 16}" text-anchor="middle">${l}</text>`; });
            g += `<text class="ax ttl" x="${(ML + CW - MR) / 2}" y="${CH - 6}" text-anchor="middle">stake tick length - drag to set yours</text><text class="ax ttl" x="8" y="12">${esc(unit)}</text>`;
            let lines = '', dots = '';
            const ends = series.map(sr => ({ sr, y: py(sr.perTick * 3600 / X1) })).sort((p, q) => p.y - q.y);
            let prev = -Infinity; ends.forEach(o => { o.ly = Math.max(o.y, prev + 12); prev = o.ly; });
            const selFlat = flats.find(f => f.sel);
            series.forEach(sr => {
                const a = sr.perTick * 3600 / X0, b = sr.perTick * 3600 / X1, end = ends.find(o => o.sr === sr);
                lines += `<line class="ln${sr.sel ? ' sel' : ' dim'}" x1="${px(X0).toFixed(1)}" y1="${py(a).toFixed(1)}" x2="${px(X1).toFixed(1)}" y2="${py(b).toFixed(1)}" style="stroke:${sr.color}"><title>${esc(sr.label)}</title></line><text class="lb${sr.sel ? ' sel' : ' dim'}" x="${px(X1) + 6}" y="${(end.ly + 4).toFixed(1)}" style="fill:${sr.color}">${esc(sr.label)}</text>`;
                if (sr.sel && selFlat) { const x = sr.perTick * 3600 / selFlat.value; if (x >= X0 && x <= X1) dots += `<circle class="dotx" cx="${px(x).toFixed(1)}" cy="${py(selFlat.value).toFixed(1)}" r="5" style="fill:${sr.color}"><title>${esc(sr.label)} = ${esc(selFlat.label)} at ${art(dur(x))} ${dur(x)} tick</title></circle><text class="lb eq" x="${px(x).toFixed(1)}" y="${(py(selFlat.value) - 10).toFixed(1)}" text-anchor="middle">equal at ${dur(x)}</text>`; }
            });
            const fl = flats.map(f => ({ f, y: py(f.value) })).sort((a, b) => a.y - b.y);
            let last = -Infinity; fl.forEach(o => { o.ly = Math.max(o.y, last + 13); last = o.ly; });
            fl.forEach(o => { lines += `<line class="ln flat${o.f.sel ? ' sel' : ' dim'}" x1="${ML}" x2="${CW - MR}" y1="${o.y.toFixed(1)}" y2="${o.y.toFixed(1)}"><title>${esc(o.f.label)}: ${num(o.f.value)} ${esc(unit)}</title></line><text class="lb flat${o.f.sel ? ' sel' : ' dim'}" x="${CW - MR + 6}" y="${(o.ly + 4).toFixed(1)}">${esc(o.f.label)}</text>`; });
            const tx = Math.min(X1, Math.max(X0, tick));
            const mark = `<line class="mark" x1="${px(tx).toFixed(1)}" x2="${px(tx).toFixed(1)}" y1="${MT - 4}" y2="${CH - MB}"></line><text class="lb mk" x="${px(tx).toFixed(1)}" y="${MT - 10}" text-anchor="middle">your tick: ${dur(tick)}</text>`;
            const hit = `<rect class="hitarea" x="${ML}" y="${MT - 20}" width="${CW - ML - MR}" height="${CH - MT - MB + 20}"></rect>`;
            return `<svg class="cd-chart" data-tick-chart viewBox="0 0 ${CW} ${CH}" role="img" aria-label="Output against stake tick length, logarithmic axes; drag to set the tick">${g}${lines}${dots}${mark}${hit}</svg>`;
        }

        // the verdict: the chosen hull against one full stake of the chosen tier, in words
        verdictHTML(c, t) {
            const { raw, ref, tick, s } = c;
            const hullH = ref.rate * 3600, stakeH = t.perTick * 3600 / tick, hp = Store.shipPrice(ref.name), sp = Store.stakePrice(t.tier);
            const fit = ref.cfg && ref.cfg !== 'Default' ? ` (${esc(ref.cfg)})` : '', H = esc(short(ref.name)), part = t.k < t.max;
            const T = part ? `a T${t.tier} stake with ${t.k} of ${t.max} extractors` : `a full T${t.tier} stake`, Ts = `T${t.tier} stakes${part ? ` (${t.k} extractor${t.k === 1 ? '' : 's'})` : ''}`, at = `${art(dur(tick))} ${dur(tick)} tick${s.tickSource === 'assumed' ? ' (assumed)' : ''}`;
            const hullWins = hullH >= stakeH, r = hullWins ? hullH / Math.max(1e-12, stakeH) : stakeH / hullH;
            const head = hullWins ? `One ${H}${fit} mines what <b>${times(r)}</b> ${Ts} do` : `One T${t.tier} stake${part ? ` (${t.k} extractor${t.k === 1 ? '' : 's'})` : ''} mines what <b>${times(r)}</b> ${H}s${fit} do`;
            const be = Calc.breakEvenTick(t.perTick, ref.rate);
            const flip = be == null ? '' : hullWins ? `The stake only out-mines it if a tick is shorter than <b>${dur(be)}</b>.` : `The ${H} only catches up if a tick is longer than <b>${dur(be)}</b>.`;
            let dollar;
            if (hp && sp) {
                const hd = hullH / hp, sd = stakeH / sp, w = hd >= sd, k = w ? hd / sd : sd / hd, beD = Calc.breakEvenTickPerDollar(t.perTick, sp, ref.rate, hp);
                dollar = `Per dollar (${usd(hp)} against ${usd(sp)}) the <b class="${w ? 'hull' : 'stake'}">${w ? H : 'stake'}</b> gives <b>${times(k)}×</b> more${beD != null ? `; they are even at ${art(dur(beD))} ${dur(beD)} tick` : ''}.`;
            } else dollar = `Type ${hp ? '' : `the ${H}'s ask${sp ? '' : ' and '}`}${sp ? '' : `the T${t.tier} stake's ask`} on the cards below to compare per dollar.`;
            const fill = ref.cargo / ref.rate, full = t.storage / t.perTick * tick;
            return `<section class="cd-verdict ${hullWins ? 'hull' : 'stake'}">
                <p class="cd-verdict-ctx">${esc(raw.name)} · ${H}${fit} against ${T} · at ${at}</p>
                <h2>${head}.</h2>
                <ul>
                    <li>${flip}</li>
                    <li>${dollar}</li>
                    <li>What each asks of you: the ${H} needs unloading every <b>${dur(fill)}</b>; the stake fills its storage in <b>${dur(full)}</b> and needs no pilot.</li>
                </ul>
            </section>`;
        }

        // the two cards side by side
        duelHTML(c, t) {
            const { ref, tick } = c, hp = Store.shipPrice(ref.name), sp = Store.stakePrice(t.tier);
            const hullH = ref.rate * 3600, stakeH = t.perTick * 3600 / tick, win = hullH >= stakeH ? 'hull' : 'stake';
            const a = this.shipArt[ref.name], img = a && a.hero ? `<img src="${ART_SHIPS}${esc(a.hero)}" alt="" loading="lazy">` : '';
            const fill = ref.cargo / ref.rate, full = t.storage / t.perTick * tick;
            const row = (k, v, cls) => `<div${cls ? ` class="${cls}"` : ''}><dt>${k}</dt><dd>${v}</dd></div>`;
            const hull = `<article class="cd-duel-card hull${win === 'hull' ? ' win' : ''}">
                <div class="cd-duel-art">${img}</div>
                <div class="cd-duel-head"><small>Hull · ${esc(ref.cfg || 'Default')} configuration</small><b>${esc(ref.name)}</b></div>
                <dl>
                    ${row('Mines', `<b>${num(hullH)}</b> / h`, 'big')}
                    ${row('Per dollar', hp ? `${num(hullH / hp)} / h per $` : '–')}
                    ${row('Ask', `<input type="number" class="sb-input" min="0" step="any" value="${hp || ''}" placeholder="USD" data-price-ship="${esc(ref.name)}">`)}
                    ${row('Hold', `${num(ref.cargo)} · full in ${dur(fill)} · ${num(86400 / fill, 0)} unloads a day`)}
                    ${row('Upkeep', `${num(ref.food * 3600)} food / h while mining`)}
                    ${row('Crew', num(ref.crew))}
                </dl>
            </article>`;
            const stake = `<article class="cd-duel-card stake${win === 'stake' ? ' win' : ''}">
                <div class="cd-duel-art"><img src="${STAKE_ART}" alt="" loading="lazy"><i class="t t${t.tier}">T${t.tier}</i></div>
                <div class="cd-duel-head"><small>Claim stake${t.k === t.max ? ', full' : ''}</small><b>T${t.tier} · ${t.k} of ${t.max} extractors</b></div>
                <dl>
                    ${row('Mines', `<b>${num(stakeH)}</b> / h`, 'big')}
                    ${row('Extractors', `<span class="cd-extstep"><button type="button" data-ext-step="-1" ${t.k > 1 ? '' : 'disabled'} aria-label="One fewer extractor">−</button><b>${t.k}</b><button type="button" data-ext-step="1" ${t.k < t.max ? '' : 'disabled'} aria-label="One more extractor">+</button></span><small>of ${t.max} that fit</small>`)}
                    ${row('Per dollar', sp ? `${num(stakeH / sp)} / h per $` : '–')}
                    ${row('Ask', `<input type="number" class="sb-input" min="0" step="any" value="${sp || ''}" placeholder="USD" data-price-stake="${t.tier}">`)}
                    ${row('Storage', `${num(t.storage)} · full in ${dur(full)}`)}
                    ${row('Upkeep', t.fuel == null ? '–' : `${num(t.fuel * 3600 / tick)} fuel / h (${num(t.fuel)} a tick, power plant + central hub)`)}
                    ${row('Crew', `${num(t.crew)} · ${num(t.used)} of ${num(t.S)} slots`)}
                </dl>
            </article>`;
            return `<div class="cd-duel">${hull}<span class="cd-duel-vs">vs</span>${stake}</div>`;
        }

        render() {
            this.stale = false;
            const c = this.c = this.compute(), { s, raw, ref, ships, tiers, tick } = c;
            const t = c.stake;                                                         // the chosen tier, with the extractors set
            const refPrice = Store.shipPrice(ref.name), folds = this.folds || {};

            // the one chart: only the chosen hull and the chosen stake tier (owner rule 2026-10-26: no default miners or
            // tiers on it); units, or units per dollar when both have an ask
            const sp = Store.stakePrice(t.tier);
            const chart = this.mode === 'usd'
                ? this.chart(sp ? [{ label: 'T' + t.tier, color: TIER_COLOR[t.tier], perTick: t.perTick / sp, sel: true }] : [], refPrice ? [{ label: short(ref.name), value: ref.rate * 3600 / refPrice, sel: true }] : [], tick, 'units per hour per dollar')
                : this.chart([{ label: 'T' + t.tier, color: TIER_COLOR[t.tier], perTick: t.perTick, sel: true }], [{ label: short(ref.name), value: ref.rate * 3600, sel: true }], tick, 'units per hour');

            // every tier against the chosen hull (the old break-even, per-dollar and fair-price bars, in one table)
            const tierRows = tiers.map(x => {
                const sp = Store.stakePrice(x.tier), be = Calc.breakEvenTick(x.perTick, ref.rate), beD = Calc.breakEvenTickPerDollar(x.perTick, sp, ref.rate, refPrice), fair = Calc.fairPrice(x.perTick, tick, ref.rate, refPrice);
                return `<tr${x.tier === t.tier ? ' class="on"' : ''}><th><span class="t t${x.tier}">T${x.tier}</span></th><td>${x.k}</td><td>${num(x.perTick * 3600 / tick)}</td><td>${num(x.perTick / tick / ref.rate)}</td><td class="${be != null && be >= tick ? 'pos' : ''}">${dur(be)}</td><td class="ask"><input type="number" class="sb-input" min="0" step="any" value="${sp || ''}" placeholder="–" data-price-stake="${x.tier}"></td><td class="${beD != null && beD >= tick ? 'pos' : ''}">${beD == null ? '–' : dur(beD)}</td><td>${fair == null ? '–' : usdF(fair)}</td></tr>`;
            }).join('');

            const pts = this.planetTypes(raw.id, +this.measure.tier || 3);
            if (!pts.has(this.measure.ptype)) this.measure.ptype = pts.size ? pts.keys().next().value : '';
            const ptypeOpts = Array.from(pts.keys()).map(k => `<option value="${esc(k)}"${k === this.measure.ptype ? ' selected' : ''}>${esc(k)}</option>`).join('');
            const passTypes = Array.from(pts.entries()).filter(([, v]) => v > 0).map(([k]) => k);
            const exRate = n => ((this.se.extractors.get(raw.id + '|' + n) || [{}])[0].resourceExtractionRate || {})[raw.id] || 0;
            const measureOpen = folds.measure != null ? folds.measure : false;
            this.root.innerHTML = `
                ${settingsStrip({ richness: false, measureHere: true })}
                <details class="cd-fold cd-measure" data-fold="measure"${measureOpen ? ' open' : ''}>
                    <summary><b>Measure your tick</b><span>${s.tickSource === 'measured' ? `measured: ${dur(tick)}` : `every answer here hangs on it - one extractor, storage read twice an hour apart`}</span></summary>
                    <p class="rx-note">Build one extractor, read the stake's storage, read it again an hour later. Tick length = 3,600 × rate × richness ÷ units gained. A T1 extractor gains little (about ${num(3600 * exRate(1) / tick, 1)} an hour at your ${dur(tick)} tick); a T3 or better reads cleanly (about ${num(3600 * exRate(3) / tick, 0)} an hour).</p>
                    <div class="cd-measure-grid">
                        <label><span>Planet type</span><select class="sb-input" data-measure="ptype">${ptypeOpts}</select></label>
                        <label><span>Extractor tier</span><select class="sb-input" data-measure="tier">${[1, 2, 3, 4, 5].map(n => `<option value="${n}"${+this.measure.tier === n ? ' selected' : ''}>T${n}</option>`).join('')}</select></label>
                        <label><span>Deposit richness</span><input type="number" class="sb-input" min="0" step="any" value="${esc(this.measure.richness)}" data-measure="richness"></label>
                        <label><span>${esc(raw.name)} gained in one hour</span><input type="number" class="sb-input" min="0" step="any" value="${esc(this.measure.units)}" placeholder="units" data-measure="units"></label>
                    </div>
                    <div id="cdMeasureOut"></div>
                    <p class="rx-note">Uses the raw chosen below. The planet type matters because the central hub of some planet types adds a small passive trickle of this raw on top of the extractor${passTypes.length ? ` (${passTypes.join(', ')})` : ' (none for this raw)'}. It assumes richness multiplies the rate; if the answer changes with a second deposit of different richness, that assumption is wrong and worth knowing.</p>
                </details>
                <section class="cd-inputs">
                    <label><span>Raw mined</span><select class="sb-input" data-raw>${this.raws.map(r => `<option value="${esc(r.id)}"${r.id === raw.id ? ' selected' : ''}>${esc(r.name)} (T${r.tier})</option>`).join('')}</select></label>
                    <label><span>Hull</span><select class="sb-input" data-ref>${this.empire.miners.map(h => `<option value="${esc(h.name)}"${h.name === ref.name ? ' selected' : ''}>${esc(h.name)} - ${num(h.rate)} /s</option>`).join('')}</select></label>
                    <label><span>Config</span><select class="sb-input" data-cfg ${ref.cfgs.length ? '' : 'disabled'}>${(ref.cfgs.length ? ref.cfgs : ['Default']).map(n => `<option value="${esc(n)}"${n === (ref.cfg || 'Default') ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select></label>
                    <div class="chips"><span class="cd-inputs-lbl">Stake</span>${tiers.map(x => `<button type="button" class="chip${x.tier === t.tier ? ' on' : ''}" data-calc-tier="${x.tier}"><i class="t t${x.tier}">T${x.tier}</i></button>`).join('')}</div>
                </section>
                ${this.verdictHTML(c, t)}
                ${this.duelHTML(c, t)}
                <section class="an-section cd-onechart">
                    <div class="an-head"><h3>Where the answer flips</h3><div class="chips"><button type="button" class="chip${this.mode === 'units' ? ' on' : ''}" data-chart-mode="units">Units / h</button><button type="button" class="chip${this.mode === 'usd' ? ' on' : ''}" data-chart-mode="usd">Per dollar</button></div></div>
                    <p class="rx-note">The T${t.tier} stake line falls as the tick gets longer; the ${esc(short(ref.name))} does not care. The dot is where they are equal - left of it the stake wins. Both axes are logarithmic. Drag or click the chart to set your tick.</p>
                    ${chart}
                </section>
                <details class="cd-fold cd-alltiers" data-fold="all"${folds.all ? ' open' : ''}>
                    <summary><b>Every tier and hull</b><span>break-even ticks, fair prices, hold, storage, fuel, food and crew</span></summary>
                    <div class="an-tablewrap"><table class="an-table"><thead><tr><th>Stake</th><th>extractors</th><th>per hour at your tick</th><th>= ${esc(short(ref.name))}s</th><th>break-even tick</th><th>ask (USD)</th><th>break-even tick per $</th><th>fair price at your tick</th></tr></thead><tbody>${tierRows}</tbody></table></div>
                    <p class="rx-note">Break-even tick: the tick length at which one full stake mines what one ${esc(short(ref.name))} does - the stake wins only if the real tick is <b>shorter</b> (green). Fair price: what the stake would have to cost to match the ${esc(short(ref.name))}${refPrice ? ` at ${usd(refPrice)}` : ''} per dollar at your tick${refPrice ? '' : ' (type the hull\'s ask)'}.</p>
                    <div class="an-tablewrap"><table class="an-table"><thead><tr><th>Hull</th><th>per second</th><th>hold</th><th>hold full in</th><th>hold fills a day (no travel)</th><th>food per unit</th><th>crew</th><th>ask (USD)</th></tr></thead><tbody>
                        ${ships.map(h => `<tr${h.name === ref.name ? ' class="on"' : ''}><th>${esc(h.name)}</th><td>${num(h.rate)}</td><td>${num(h.cargo)}</td><td>${dur(h.cargo / h.rate)}</td><td>${num(86400 / (h.cargo / h.rate), 1)}</td><td>${num(h.food / h.rate, 4)}</td><td>${h.crew}</td><td class="ask"><input type="number" class="sb-input" min="0" step="any" value="${Store.shipPrice(h.name) || ''}" placeholder="–" data-price-ship="${esc(h.name)}"></td></tr>`).join('')}
                    </tbody></table></div>
                    <div class="an-tablewrap"><table class="an-table"><thead><tr><th>Stake</th><th>extractors</th><th>per tick</th><th>fuel per tick</th><th>fuel per unit</th><th>storage</th><th>ticks to fill</th><th>full in, at your tick</th><th>crew</th></tr></thead><tbody>
                        ${tiers.map(x => `<tr${x.tier === t.tier ? ' class="on"' : ''}><th><span class="t t${x.tier}">T${x.tier}</span> ${num(x.used)} of ${num(x.S)} slots</th><td>${x.k}</td><td>${num(x.perTick)}</td><td>${x.fuel == null ? '–' : num(x.fuel)}</td><td>${x.fuelPerUnit == null ? '–' : num(x.fuelPerUnit, 2)}</td><td>${num(x.storage)}</td><td>${num(x.storage / x.perTick, 0)}</td><td>${dur(x.storage / x.perTick * tick)}</td><td>${num(x.crew)}</td></tr>`).join('')}
                    </tbody></table></div>
                    <p class="rx-note">The export has no prices: the asks start as quoted on ${PRICE_DATE} (Tap, IMP, T3 to T5) and what you type stays in this browser. Hull and stake are compared on the same deposit; richness cancels if it scales both alike (not in the data). Hardness slows the hull, so the break-even ticks are a lower bound. Hold and food are the hull's figures in the export; no stake building carries a food field. Stake fuel is the export's rate per tick for the power plant + central hub, unverified in play; a hull's fuel depends on the route (Loadouts tab). Mining rate is at richness 1.</p>
                </details>`;
            this.renderMeasure();
        }

        renderMeasure() {
            const out = this.root.querySelector('#cdMeasureOut'); if (!out || !this.c) return;
            const tier = +this.measure.tier || 1, b = (this.se.extractors.get(this.c.raw.id + '|' + tier) || [])[0];
            const pass = this.planetTypes(this.c.raw.id, tier).get(this.measure.ptype) || 0;
            const rate = b ? b.resourceExtractionRate[this.c.raw.id] + pass : 0, rich = parseFloat(this.measure.richness) || 0, units = parseFloat(this.measure.units) || 0;
            this.measured = Calc.measuredTick(rate, rich, units);
            out.innerHTML = `<div class="rx-facts"><div><b>${num(rate)}</b><span>per tick, one T${tier} extractor${pass ? ` + ${num(pass)} hub trickle` : ''}</span></div><div><b>${this.measured ? dur(this.measured) : '–'}</b><span>tick length</span></div></div>${this.measured ? `<div class="rx-actions"><button type="button" class="sb-btn" data-use-tick>Use ${dur(this.measured)} as my tick</button></div>` : ''}`;
        }
    }

    window.DeckCalcTab = CalcTab;
})();
