// deck-store.js - Command Deck shared state and formatting (2026-10-04).
// One settings object for the Empire and Ships-vs-Stakes tabs, kept in localStorage:
//   tick      seconds per claim-stake tick. NOT IN THE DATA - an input. tickSource says where the value came from
//             ('assumed' until the player sets or measures it), and both tabs show that label next to the number.
//   richness  multiply a stake's extraction by the deposit's richness. Also not in the data (the export has no
//             formula for it); on by default so stakes and ships are treated alike.
//   faction   the player's faction ('mud' | 'oni' | 'ustur'): decides which low-risk zone is "yours" and which
//             faction-locked extractor kits a stake of yours can run. A choice, default USTUR.
//   gather    how a recipe's raws are had on the Research tab: 'stake' (claim stakes, a fleet where no stake can),
//             'fleet', or 'hand' (already bought - crafting research only).
//   prices    USD asks the player types. The export carries no prices. The defaults are asks quoted on 2026-10-04
//             and say so on the page.
(function () {
    'use strict';

    const KEY = 'commandDeck.settings.v1';
    const PRICE_DATE = '2026-10-04';
    const DEFAULTS = {
        tick: 60, tickSource: 'assumed', richness: true, faction: 'ustur', gather: 'stake',
        prices: { ships: { 'Armstrong IMP Tap': 160, 'Armstrong IMP': 2500 }, stakes: { 3: 176, 4: 415, 5: 1925 } },
        calc: { raw: 'copper-ore', ref: 'Armstrong IMP Tap' }
    };
    const clone = o => JSON.parse(JSON.stringify(o));

    const Store = {
        listeners: [],
        s: (() => {
            const d = clone(DEFAULTS);
            try {
                const v = JSON.parse(localStorage.getItem(KEY) || 'null');
                if (v && typeof v === 'object') {
                    if (v.tick > 0) d.tick = +v.tick;
                    if (v.tickSource) d.tickSource = v.tickSource;
                    if (typeof v.richness === 'boolean') d.richness = v.richness;
                    if (['mud', 'oni', 'ustur'].includes(v.faction)) d.faction = v.faction;
                    if (['stake', 'fleet', 'hand'].includes(v.gather)) d.gather = v.gather;
                    if (v.prices && v.prices.ships) d.prices.ships = v.prices.ships;
                    if (v.prices && v.prices.stakes) d.prices.stakes = v.prices.stakes;
                    if (v.calc && v.calc.raw) d.calc.raw = v.calc.raw;
                    if (v.calc && v.calc.ref) d.calc.ref = v.calc.ref;
                }
            } catch (e) { /* storage unavailable or corrupt: defaults */ }
            return d;
        })(),
        save() { try { localStorage.setItem(KEY, JSON.stringify(this.s)); } catch (e) { /* storage unavailable */ } this.listeners.forEach(f => f(this.s)); },
        on(f) { this.listeners.push(f); },
        setTick(v, source) { v = +v; if (!(v > 0)) return; this.s.tick = Math.max(0.001, Math.min(86400, v)); this.s.tickSource = source || 'set'; this.save(); },
        setRichness(on) { this.s.richness = !!on; this.save(); },
        setFaction(f) { if (['mud', 'oni', 'ustur'].includes(f)) { this.s.faction = f; this.save(); } },
        setGather(g) { if (['stake', 'fleet', 'hand'].includes(g)) { this.s.gather = g; this.save(); } },
        setPrice(kind, key, v) { const n = parseFloat(v); if (n > 0) this.s.prices[kind][key] = n; else delete this.s.prices[kind][key]; this.save(); },
        shipPrice(name) { return this.s.prices.ships[name] || null; },
        stakePrice(tier) { return this.s.prices.stakes[tier] || null; },
        read(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v == null ? fallback : v; } catch (e) { return fallback; } },
        write(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
    };

    // ---- formatting shared by the three tabs
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const num = (v, d) => {
        if (v == null || !isFinite(v)) return '–';
        const a = Math.abs(v);
        if (d == null && a > 0 && a < 1) return Number(v.toPrecision(3)).toLocaleString('en-US', { maximumFractionDigits: 8 });   // three significant figures
        const digits = d != null ? d : (a < 100 ? 2 : a < 1000 ? 1 : 0);
        return v.toLocaleString('en-US', { maximumFractionDigits: digits });
    };
    const dur = sec => {
        if (sec == null || !isFinite(sec)) return '–';
        if (sec < 10) return num(sec) + ' s';
        if (sec < 90) return num(sec, 1) + ' s';
        const m = sec / 60; if (m < 90) return num(m, 1) + ' min';
        const h = m / 60; if (h < 48) return num(h, 1) + ' h';
        const dd = h / 24; if (dd < 730) return num(dd, 1) + ' days';
        return num(dd / 365, 1) + ' years';
    };
    const usd = v => (v == null || !isFinite(v) ? '–' : '$' + num(v, v < 10 ? 2 : 0));
    const snd = n => { if (window.spaceSounds && window.spaceSounds[n]) window.spaceSounds[n](); };
    const tickLabel = s => `${num(s.tick, s.tick < 10 ? 3 : 1)} s`;
    const TICK_SOURCE = { assumed: 'assumed - not measured', set: 'set by you', measured: 'measured by you' };
    const FACTIONS = [['mud', 'MUD'], ['oni', 'ONI'], ['ustur', 'USTUR']];
    const factionChips = () => `<span class="cd-me"><span>My faction</span>${FACTIONS.map(([k, l]) => `<button type="button" class="chip${Store.s.faction === k ? ' on' : ''}" data-faction="${k}"><i style="background:var(--${k === 'ustur' ? 'ust' : k})"></i>${l}</button>`).join('')}</span>`;
    const ZONE_TEXT = { own: 'your low-risk zone', medium: 'medium-risk zone', enemy: "another faction's low-risk zone", high: 'high-risk zone' };

    // the settings strip both tabs show: tick length (number + quick picks) and the richness switch
    function settingsStrip(opts) {
        const s = Store.s, o = opts || {};
        const picks = [1, 6, 60, 600, 3600];
        return `<section class="cd-strip" data-strip>
            <label class="cd-tick"><span>Stake tick length</span><input type="number" class="sb-input" min="0.001" step="any" value="${s.tick}" data-tick aria-label="Stake tick length in seconds"><em>s</em></label>
            <div class="chips">${picks.map(p => `<button type="button" class="chip${s.tick === p ? ' on' : ''}" data-tick-pick="${p}">${p >= 3600 ? '1 h' : p >= 60 ? (p / 60) + ' min' : p + ' s'}</button>`).join('')}</div>
            <span class="cd-flag ${s.tickSource === 'assumed' ? 'warn' : 'ok'}">${TICK_SOURCE[s.tickSource] || s.tickSource}</span>
            ${o.richness === false ? '' : `<label class="cd-check"><input type="checkbox" data-richness ${s.richness ? 'checked' : ''}><span>stake output × deposit richness</span></label>`}
            ${o.faction ? factionChips() : ''}
            <p class="cd-strip-note">A stake's rate is <b>per tick</b>, a ship's is <b>per second</b>, and the tick length is in no export field. Every number on this tab that compares the two uses the value above${o.richness === false ? '' : '; how richness scales a stake is not in the data either'}. Measure the tick on the Ships vs Stakes tab.</p>
        </section>`;
    }
    function bindStrip(root) {
        root.addEventListener('change', e => {
            const t = e.target.closest('[data-tick]'); if (t) { Store.setTick(t.value, 'set'); return; }
            const r = e.target.closest('[data-richness]'); if (r) { Store.setRichness(r.checked); }
        });
        root.addEventListener('click', e => {
            const p = e.target.closest('[data-tick-pick]'); if (p) { snd('select'); Store.setTick(+p.dataset.tickPick, 'set'); return; }
            const f = e.target.closest('[data-faction]'); if (f) { snd('select'); Store.setFaction(f.dataset.faction); }
        });
    }

    window.DeckStore = Store;
    window.DeckUI = { esc, num, dur, usd, snd, tickLabel, settingsStrip, bindStrip, factionChips, PRICE_DATE, TICK_SOURCE, FACTIONS, ZONE_TEXT };
})();
