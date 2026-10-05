// deck-calc.js - Command Deck, Ships vs Stakes tab (2026-10-04).
// A mining hull's rate is per SECOND, a claim-stake extractor's is per TICK, and no source gives the tick length.
// So this tab never prints one answer: it takes the tick as an input and shows where the answer flips.
//   - output per hour against the tick length (log-log): stake lines fall, hull lines are flat, they cross at the
//     break-even tick; the same per dollar once prices are typed in
//   - break-even ticks, per hull/deed and per dollar; the price a stake would need to match the hull per dollar
//   - what each asks of the player: hold fill time and unload trips for a hull, storage fill time for a stake
//   - "measure your tick": one extractor, storage read twice an hour apart
// The reference stake is the fullest same-tier layout (storage hub + extraction hub + every extractor that fits,
// crew quarters and power plants as needed), all extractors on the chosen raw. Hull and stake are compared on the
// same deposit, so richness cancels. Prices are the player's input; nothing here knows crew, food, fuel or
// building-material prices.
(function () {
    'use strict';

    const { esc, num, dur, usd, snd, settingsStrip, bindStrip, PRICE_DATE } = window.DeckUI;
    const Store = window.DeckStore, Calc = window.CommandDeck.Calc;
    const TIER_COLOR = { 1: '#9ec3d6', 2: '#7ee8a4', 3: '#4fd8ff', 4: '#b98cff', 5: '#ffd36b' };
    const SHIP_COLOR = '#ff9f6b';
    const CORE = ['Armstrong IMP', 'Armstrong IMP Tap', 'Armstrong IMP Tip'];
    const short = n => n.replace(/^Armstrong /, '');
    const log10 = Math.log10;

    class CalcTab {
        constructor(root, ctx) {
            this.root = root; this.se = ctx.se; this.empire = ctx.empire; this.rm = ctx.rm;
            // raws a stake can extract at every tier
            this.raws = this.rm.list.filter(r => r.category === 'raw' && [1, 2, 3, 4, 5].every(t => (this.se.extractors.get(r.id + '|' + t) || []).length)).sort((a, b) => a.name.localeCompare(b.name));
            this.measure = { tier: 1, richness: 1, units: '' };
            bindStrip(root); this.bind();
            Store.on(() => { if (this.visible()) this.render(); else this.stale = true; });
            this.stale = true;
        }
        visible() { return this.root.closest('.tab-content').classList.contains('active'); }
        show() { if (this.stale) this.render(); }

        bind() {
            this.root.addEventListener('change', e => {
                const raw = e.target.closest('[data-raw]'); if (raw) { Store.s.calc.raw = raw.value; Store.save(); return; }
                const ref = e.target.closest('[data-ref]'); if (ref) { Store.s.calc.ref = ref.value; Store.save(); return; }
                const ps = e.target.closest('[data-price-ship]'); if (ps) { Store.setPrice('ships', ps.dataset.priceShip, ps.value); return; }
                const pt = e.target.closest('[data-price-stake]'); if (pt) { Store.setPrice('stakes', pt.dataset.priceStake, pt.value); return; }
            });
            this.root.addEventListener('input', e => {
                const m = e.target.closest('[data-measure]'); if (!m) return;
                this.measure[m.dataset.measure] = m.value; this.renderMeasure();
            });
            this.root.addEventListener('click', e => {
                const use = e.target.closest('[data-use-tick]'); if (use && this.measured > 0) { snd('success'); Store.setTick(this.measured, 'measured'); }
            });
        }

        compute() {
            const s = Store.s, raw = this.raws.find(r => r.id === s.calc.raw) || this.raws.find(r => r.id === 'copper-ore') || this.raws[0];
            const refName = this.empire.shipByName.has(s.calc.ref) ? s.calc.ref : 'Armstrong IMP Tap';
            const names = Array.from(new Set([refName].concat(CORE))).filter(n => this.empire.shipByName.has(n));
            const ships = names.map(n => this.empire.shipByName.get(n)).sort((a, b) => b.rate - a.rate);
            const tiers = [1, 2, 3, 4, 5].map(t => this.se.fullStake(t, raw.id)).filter(Boolean);
            return { s, raw, ref: this.empire.shipByName.get(refName), ships, tiers, tick: s.tick };
        }

        // log-log chart. series: [{label, color, perTick}] fall as 1/tick; flats: [{label, value}] are horizontal
        chart(series, flats, tick, unit) {
            const W = 660, H = 396, ML = 62, MR = 96, MT = 40, MB = 40, X0 = 0.01, X1 = 3600;
            const vals = []; series.forEach(sr => { vals.push(sr.perTick * 3600 / X0, sr.perTick * 3600 / X1); }); flats.forEach(f => vals.push(f.value));
            const pos = vals.filter(v => v > 0); if (!pos.length) return '<p class="rx-note">Nothing to draw: type a price for at least one stake tier and one hull.</p>';
            const y0 = Math.floor(log10(Math.min(...pos))), y1 = Math.ceil(log10(Math.max(...pos)));
            const px = x => ML + (log10(x) - log10(X0)) / (log10(X1) - log10(X0)) * (W - ML - MR);
            const py = v => MT + (y1 - log10(v)) / Math.max(1, y1 - y0) * (H - MT - MB);
            const pow = e => (e >= 6 ? num(Math.pow(10, e - 6)) + 'M' : e >= 3 ? num(Math.pow(10, e - 3)) + 'k' : e >= 0 ? num(Math.pow(10, e)) : (e >= -6 ? Math.pow(10, e).toFixed(-e) : '1e' + e));
            let g = '';
            for (let e = y0; e <= y1; e++) g += `<line class="grid" x1="${ML}" x2="${W - MR}" y1="${py(Math.pow(10, e)).toFixed(1)}" y2="${py(Math.pow(10, e)).toFixed(1)}"></line><text class="ax" x="${ML - 8}" y="${(py(Math.pow(10, e)) + 3.5).toFixed(1)}" text-anchor="end">${pow(e)}</text>`;
            [[0.01, '0.01 s'], [0.1, '0.1 s'], [1, '1 s'], [10, '10 s'], [60, '1 min'], [600, '10 min'], [3600, '1 h']].forEach(([x, l]) => { g += `<line class="grid" x1="${px(x).toFixed(1)}" x2="${px(x).toFixed(1)}" y1="${MT}" y2="${H - MB}"></line><text class="ax" x="${px(x).toFixed(1)}" y="${H - MB + 16}" text-anchor="middle">${l}</text>`; });
            g += `<text class="ax ttl" x="${(ML + W - MR) / 2}" y="${H - 6}" text-anchor="middle">stake tick length</text><text class="ax ttl" x="8" y="12">${esc(unit)}</text>`;
            let lines = '', dots = '';
            // tier labels sit at the right end of each line, pushed apart when lines run close together
            const ends = series.map(sr => ({ sr, y: py(sr.perTick * 3600 / X1) })).sort((p, q) => p.y - q.y);
            let prev = -Infinity; ends.forEach(o => { o.ly = Math.max(o.y, prev + 12); prev = o.ly; });
            series.forEach(sr => {
                const a = sr.perTick * 3600 / X0, b = sr.perTick * 3600 / X1, end = ends.find(o => o.sr === sr);
                lines += `<line class="ln" x1="${px(X0).toFixed(1)}" y1="${py(a).toFixed(1)}" x2="${px(X1).toFixed(1)}" y2="${py(b).toFixed(1)}" style="stroke:${sr.color}"><title>${esc(sr.label)}</title></line><text class="lb" x="${px(X1) + 6}" y="${(end.ly + 4).toFixed(1)}" style="fill:${sr.color}">${esc(sr.label)}</text>`;
                flats.forEach(f => { const x = sr.perTick * 3600 / f.value; if (x >= X0 && x <= X1) dots += `<circle class="dotx" cx="${px(x).toFixed(1)}" cy="${py(f.value).toFixed(1)}" r="3.6" style="fill:${sr.color}"><title>${esc(sr.label)} = ${esc(f.label)} at a ${dur(x)} tick</title></circle>`; });
            });
            // hull labels in the right margin, pushed apart when two rates are close
            const fl = flats.map(f => ({ f, y: py(f.value) })).sort((a, b) => a.y - b.y);
            let last = -Infinity; fl.forEach(o => { o.ly = Math.max(o.y, last + 13); last = o.ly; });
            fl.forEach(o => { lines += `<line class="ln flat" x1="${ML}" x2="${W - MR}" y1="${o.y.toFixed(1)}" y2="${o.y.toFixed(1)}"><title>${esc(o.f.label)}: ${num(o.f.value)} ${esc(unit)}</title></line><text class="lb flat" x="${W - MR + 6}" y="${(o.ly + 4).toFixed(1)}">${esc(o.f.label)}</text>`; });
            const tx = Math.min(X1, Math.max(X0, tick));
            const mark = `<line class="mark" x1="${px(tx).toFixed(1)}" x2="${px(tx).toFixed(1)}" y1="${MT - 4}" y2="${H - MB}"></line><text class="lb mk" x="${px(tx).toFixed(1)}" y="${MT - 8}" text-anchor="middle">your tick: ${dur(tick)}</text>`;
            return `<svg class="cd-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Output against stake tick length, logarithmic axes">${g}${lines}${dots}${mark}</svg>`;
        }

        render() {
            this.stale = false;
            const c = this.c = this.compute(), { s, raw, ref, ships, tiers, tick } = c;
            const refPrice = Store.shipPrice(ref.name);
            const bars = (rows, fmt, color) => { const max = Math.max(1e-12, ...rows.filter(r => r.v != null).map(r => r.v)); return rows.map(r => `<div class="ch-row"><span class="ch-lbl">${r.l}</span><div class="ch-bar">${r.v == null ? '' : `<b style="width:${Math.max(0.6, 100 * r.v / max).toFixed(1)}%;background:${r.c || color}"><span class="ct">${esc(r.tip || '')}</span></b>`}</div><span class="ch-val">${r.v == null ? (r.none || '–') : fmt(r.v)}</span></div>`).join(''); };

            // tiles: at this tick, what one full stake is worth in reference hulls
            const tiles = tiers.map(t => { const hulls = t.perTick / tick / ref.rate; return `<div class="an-stat"><b>${num(hulls)}</b><span>${esc(short(ref.name))}s one full <i class="t t${t.tier}">T${t.tier}</i> stake equals</span></div>`; }).join('');

            // charts
            const unitsChart = this.chart(tiers.map(t => ({ label: 'T' + t.tier, color: TIER_COLOR[t.tier], perTick: t.perTick })), ships.map(h => ({ label: short(h.name), value: h.rate * 3600 })), tick, 'units per hour');
            const pricedT = tiers.filter(t => Store.stakePrice(t.tier)), pricedS = ships.filter(h => Store.shipPrice(h.name));
            const usdChart = this.chart(pricedT.map(t => ({ label: 'T' + t.tier, color: TIER_COLOR[t.tier], perTick: t.perTick / Store.stakePrice(t.tier) })), pricedS.map(h => ({ label: short(h.name), value: h.rate * 3600 / Store.shipPrice(h.name) })), tick, 'units per hour per dollar');

            // break-even bars against the reference hull
            const beRows = tiers.map(t => { const v = Calc.breakEvenTick(t.perTick, ref.rate); return { l: `<i class="t t${t.tier}">T${t.tier}</i>${t.k} extractors`, v, c: TIER_COLOR[t.tier], tip: `A full T${t.tier} stake (${t.k} extractors, ${num(t.perTick)} per tick) equals one ${ref.name} (${num(ref.rate)} per second) when a tick lasts ${dur(v)}` }; });
            const beUsdRows = tiers.map(t => { const sp = Store.stakePrice(t.tier); const v = Calc.breakEvenTickPerDollar(t.perTick, sp, ref.rate, refPrice); return { l: `<i class="t t${t.tier}">T${t.tier}</i>${sp ? usd(sp) : 'no price'}`, v, c: TIER_COLOR[t.tier], none: 'no price', tip: v == null ? '' : `Per dollar, a T${t.tier} stake at ${usd(sp)} equals a ${ref.name} at ${usd(refPrice)} when a tick lasts ${dur(v)}` }; });
            const fairRows = []; tiers.forEach(t => {
                const sp = Store.stakePrice(t.tier), fair = Calc.fairPrice(t.perTick, tick, ref.rate, refPrice);
                fairRows.push({ l: `<i class="t t${t.tier}">T${t.tier}</i>fair`, v: fair, c: TIER_COLOR[t.tier], none: 'no hull price', tip: fair == null ? '' : `At a ${dur(tick)} tick a T${t.tier} stake gives the same output per dollar as a ${ref.name} at ${usd(refPrice)} if it costs ${usd(fair)}` });
                if (sp) fairRows.push({ l: `<i class="t t${t.tier}">T${t.tier}</i>ask`, v: sp, c: 'rgba(255,255,255,0.35)', tip: `Ask you typed: ${usd(sp)}` });
            });
            const wins = tiers.filter(t => Calc.breakEvenTick(t.perTick, ref.rate) >= tick).map(t => 'T' + t.tier);
            const winsUsd = tiers.filter(t => { const v = Calc.breakEvenTickPerDollar(t.perTick, Store.stakePrice(t.tier), ref.rate, refPrice); return v != null && v >= tick; }).map(t => 'T' + t.tier);

            this.root.innerHTML = `
                ${settingsStrip({ richness: false })}
                <section class="cd-inputs">
                    <label><span>Raw mined</span><select class="sb-input" data-raw>${this.raws.map(r => `<option value="${esc(r.id)}"${r.id === raw.id ? ' selected' : ''}>${esc(r.name)} (T${r.tier})</option>`).join('')}</select></label>
                    <label><span>Compare against</span><select class="sb-input" data-ref>${this.empire.miners.map(h => `<option value="${esc(h.name)}"${h.name === ref.name ? ' selected' : ''}>${esc(h.name)} - ${num(h.rate)} /s</option>`).join('')}</select></label>
                    <div class="cd-prices"><span>Asks in USD</span>
                        ${ships.map(h => `<label>${esc(short(h.name))}<input type="number" class="sb-input" min="0" step="any" value="${Store.shipPrice(h.name) || ''}" placeholder="–" data-price-ship="${esc(h.name)}"></label>`).join('')}
                        ${[1, 2, 3, 4, 5].map(t => `<label><i class="t t${t}">T${t}</i><input type="number" class="sb-input" min="0" step="any" value="${Store.stakePrice(t) || ''}" placeholder="–" data-price-stake="${t}"></label>`).join('')}
                    </div>
                    <p class="cd-strip-note">The export has no prices. The boxes start with asks quoted on ${PRICE_DATE} (Tap, IMP, T3 to T5); type today's and they stay in this browser. Hull and stake are compared on the same deposit, so richness cancels.</p>
                </section>
                <div class="an-stats cd-stats"><div class="an-stat"><b>${num(ref.rate * 3600)}</b><span>${esc(raw.name)} per hour, one ${esc(short(ref.name))}</span></div>${tiles}</div>
                <div class="an-two cd-charts">
                    <section class="an-section"><div class="an-head"><h3>Output per hour, by tick length</h3><p>A full stake of each tier on ${esc(raw.name)} against the hulls. Stake lines fall as the tick gets longer; a hull does not care. A dot is where they are equal. Both axes are logarithmic.</p></div>${unitsChart}</section>
                    <section class="an-section"><div class="an-head"><h3>The same, per dollar</h3><p>Each line divided by the ask you typed. Tiers and hulls with no price are left out.</p></div>${usdChart}</section>
                </div>
                <div class="an-three cd-bars">
                    <section class="an-section"><div class="an-head"><h3>Break-even tick</h3><p>The tick length at which one full stake mines what one ${esc(short(ref.name))} does. The stake wins only if the real tick is <b>shorter</b>.</p></div><div class="ch">${bars(beRows, dur)}</div><p class="rx-note">${wins.length ? `At your ${dur(tick)} tick: ${wins.join(', ')} out-mine${wins.length === 1 ? 's' : ''} one ${esc(short(ref.name))}.` : `At your ${dur(tick)} tick no single stake out-mines one ${esc(short(ref.name))}.`}</p></section>
                    <section class="an-section"><div class="an-head"><h3>Break-even tick, per dollar</h3><p>The same once price is counted: stake output per dollar equals the ${esc(short(ref.name))}'s at this tick.</p></div><div class="ch">${refPrice ? bars(beUsdRows, dur) : `<p class="rx-note">Type an ask for the ${esc(short(ref.name))}.</p>`}</div>${refPrice ? `<p class="rx-note">${winsUsd.length ? `At your ${dur(tick)} tick: ${winsUsd.join(', ')} beat${winsUsd.length === 1 ? 's' : ''} the ${esc(short(ref.name))} per dollar.` : `At your ${dur(tick)} tick the ${esc(short(ref.name))} gives more output per dollar than every priced stake.`}</p>` : ''}</section>
                    <section class="an-section"><div class="an-head"><h3>What a stake should cost</h3><p>The price at which a stake matches the ${esc(short(ref.name))} per dollar <b>at your tick</b>, beside the ask. Mining output only.</p></div><div class="ch">${refPrice ? bars(fairRows, usd) : `<p class="rx-note">Type an ask for the ${esc(short(ref.name))}.</p>`}</div><p class="rx-note">The gap is what the ask charges for what a hull cannot do: no pilot time, no food, several raws at once, processors.</p></section>
                </div>
                <div class="an-two cd-attn">
                    <section class="an-section"><div class="an-head"><h3>What each asks of you</h3><p>A hull stops when its hold is full; a stake stops when its storage is. Storage is the central hub plus the storage hub.</p></div>
                        <div class="an-tablewrap"><table class="an-table"><thead><tr><th>Hull</th><th>per second</th><th>hold</th><th>hold full in</th><th>unloads a day</th><th>food per unit</th><th>crew</th></tr></thead><tbody>
                            ${ships.map(h => `<tr><th>${esc(h.name)}</th><td>${num(h.rate)}</td><td>${num(h.cargo)}</td><td>${dur(h.cargo / h.rate)}</td><td>${num(86400 / (h.cargo / h.rate), 1)}</td><td>${num(h.food / h.rate, 4)}</td><td>${h.crew}</td></tr>`).join('')}
                        </tbody></table></div>
                        <div class="an-tablewrap"><table class="an-table"><thead><tr><th>Stake</th><th>extractors</th><th>per tick</th><th>storage</th><th>ticks to fill</th><th>full in, at your tick</th><th>crew</th></tr></thead><tbody>
                            ${tiers.map(t => `<tr><th><span class="t t${t.tier}">T${t.tier}</span> ${num(t.used)} of ${num(t.S)} slots</th><td>${t.k}</td><td>${num(t.perTick)}</td><td>${num(t.storage)}</td><td>${num(t.storage / t.perTick, 0)}</td><td>${dur(t.storage / t.perTick * tick)}</td><td>${num(t.crew)}</td></tr>`).join('')}
                        </tbody></table></div>
                        <p class="rx-note">Hold and food are the hull's figures in the export; no stake building carries a food field. Mining rate is at richness 1; the game also divides by a hardness the export does not list.</p>
                    </section>
                    <section class="an-section cd-measure"><div class="an-head"><h3>Measure your tick</h3><p>Build one extractor, read the stake's storage, read it again an hour later. Tick length = 3,600 × rate × richness ÷ units gained.</p></div>
                        <div class="cd-measure-grid">
                            <label><span>Extractor tier</span><select class="sb-input" data-measure="tier">${[1, 2, 3, 4, 5].map(t => `<option value="${t}"${+this.measure.tier === t ? ' selected' : ''}>T${t}</option>`).join('')}</select></label>
                            <label><span>Deposit richness</span><input type="number" class="sb-input" min="0" step="any" value="${esc(this.measure.richness)}" data-measure="richness"></label>
                            <label><span>${esc(raw.name)} gained in one hour</span><input type="number" class="sb-input" min="0" step="any" value="${esc(this.measure.units)}" placeholder="units" data-measure="units"></label>
                        </div>
                        <div id="cdMeasureOut"></div>
                        <p class="rx-note">Uses the raw chosen above. It assumes richness multiplies the rate; if the answer changes with a second deposit of different richness, that assumption is wrong and worth knowing.</p>
                    </section>
                </div>`;
            this.renderMeasure();
        }

        renderMeasure() {
            const out = this.root.querySelector('#cdMeasureOut'); if (!out || !this.c) return;
            const tier = +this.measure.tier || 1, b = (this.se.extractors.get(this.c.raw.id + '|' + tier) || [])[0];
            const rate = b ? b.resourceExtractionRate[this.c.raw.id] : 0, rich = parseFloat(this.measure.richness) || 0, units = parseFloat(this.measure.units) || 0;
            this.measured = Calc.measuredTick(rate, rich, units);
            out.innerHTML = `<div class="rx-facts"><div><b>${num(rate)}</b><span>per tick, one T${tier} extractor</span></div><div><b>${this.measured ? dur(this.measured) : '–'}</b><span>tick length</span></div></div>${this.measured ? `<div class="rx-actions"><button type="button" class="sb-btn" data-use-tick>Use ${dur(this.measured)} as my tick</button></div>` : ''}`;
        }
    }

    window.DeckCalcTab = CalcTab;
})();
