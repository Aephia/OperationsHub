// ui-sfx.js - quiet interface sounds for an explorer page (2026-11-10). Five short files in SFX/ui/ (made and measured by
// Tools/sfx/build_ui_sfx.py): tap, tab, open, close, done. A page opts in with one tag and says WHICH elements sound:
//
//   <script src="../SFX/ui-sfx.js" data-tap=".chip, .card" data-tab=".tab" data-open-class="#drawer:open"
//           data-open-unhide="#zoom" data-mute-mount=".topbar"></script>
//
//   data-tap / data-tab     selectors: a click inside one plays that sound
//   data-open-class         "selector:class, ...": the class appearing plays open, disappearing plays close
//   data-open-unhide        selectors: the hidden attribute going away plays open, coming back plays close
//   data-mute-mount         where the on/off button goes (it is always added; without a mount it sits bottom-left)
//   window.UiSfx.play(name) for anything a selector cannot say (the Crew Explorer plays "done" when a roster arrives)
//
// Kept unobtrusive by rule, not by taste: nothing plays on hover or on page load; everything asked for in one tick
// collapses to the single most meaningful sound (a card click that opens a sheet is one "open", not tap + open); sounds
// are at least 70 ms apart; the choice to turn them off is remembered on the device for every explorer.
(function () {
    'use strict';
    const script = document.currentScript;
    const cfg = script ? script.dataset : {};
    const BASE = script ? new URL('ui/', script.src).href : 'ui/';
    // how loud each file plays. Every file is levelled to the same heard loudness (A-weighted RMS 0.09), so these are
    // the whole mix: a tap is the quietest, the chime the fullest. Raise or lower all five together to taste.
    const GAIN = { tap: 0.22, tab: 0.24, open: 0.28, close: 0.24, done: 0.30 };
    const RANK = { tap: 1, tab: 2, close: 3, open: 4, done: 5 };
    const NAMES = Object.keys(GAIN);
    const MIN_GAP_MS = 70;
    const STORE_KEY = 'aephia-ui-sfx';

    let ctx = null, bytes = null, decoding = null, pending = null, timer = 0, lastAt = -1e9, button = null;
    const buffers = {};
    const stats = { played: [], asked: 0 };
    let off = false;
    try { off = localStorage.getItem(STORE_KEY) === 'off'; } catch (e) { /* storage blocked: sounds stay on for this visit */ }

    // The files are fetched once, quietly, and only when sounds are on. They are decoded right away with an offline
    // decoder (which needs no click and starts no audio), so the first click of a visit already has its sound.
    function fetchBytes() {
        if (bytes || off) return bytes;
        bytes = Promise.all(NAMES.map(n => fetch(BASE + n + '.wav').then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); }).then(b => [n, b]).catch(() => [n, null])));
        return bytes;
    }
    function decodeAll(decoder) {
        if (decoding || off) return decoding;
        decoding = fetchBytes().then(list => Promise.all(list.map(([n, b]) => (b ? decoder.decodeAudioData(b).then(buf => { buffers[n] = buf; }).catch(() => {}) : null))));
        return decoding;
    }
    function prepare() {
        const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        if (!OC) return;   // very old browser: decoding then waits for the first click (wake)
        try { decodeAll(new OC(1, 1, 44100)); } catch (e) { /* decoded on the first click instead */ }
    }
    // only ever called from a click or key press, which is what lets a browser start audio
    function wake() {
        if (off) return;
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        if (!ctx) ctx = new AC();
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
        decodeAll(ctx);
    }
    function playNow(name, askedAt) {
        if (off || !ctx) return;
        if (!buffers[name]) {
            // the very first click arrives while the files are still being decoded: play it when they are ready,
            // unless that takes so long the sound would no longer belong to the click
            const asked = askedAt || performance.now();
            if (decoding && !askedAt) decoding.then(() => { if (buffers[name] && performance.now() - asked < 350) playNow(name, asked); });
            return;
        }
        const now = performance.now();
        if (now - lastAt < MIN_GAP_MS) return;
        lastAt = now;
        const src = ctx.createBufferSource(), gain = ctx.createGain();
        src.buffer = buffers[name]; gain.gain.value = GAIN[name];
        src.connect(gain); gain.connect(ctx.destination); src.start();
        stats.played.push(name);
        if (stats.played.length > 200) stats.played.shift();
    }
    // everything asked for in this tick becomes one sound: the highest-ranked
    function play(name) {
        if (!RANK[name]) return;
        stats.asked++;
        if (!pending || RANK[name] > RANK[pending]) pending = name;
        if (!timer) timer = setTimeout(() => { timer = 0; const n = pending; pending = null; playNow(n); }, 0);
    }

    function setOff(v) {
        off = !!v;
        try { localStorage.setItem(STORE_KEY, off ? 'off' : 'on'); } catch (e) { /* not remembered, still applied */ }
        if (!off) prepare();
        paintButton();
    }
    function paintButton() {
        if (!button) return;
        button.setAttribute('aria-pressed', String(!off));
        button.title = off ? 'Interface sounds are off - click to turn them on' : 'Interface sounds are on - click to turn them off';
        button.setAttribute('aria-label', button.title);
        button.querySelector('.ui-sfx-waves').style.display = off ? 'none' : '';
        button.querySelector('.ui-sfx-cross').style.display = off ? '' : 'none';
        button.style.opacity = off ? '0.55' : '1';
    }
    function makeButton() {
        const NS = 'http://www.w3.org/2000/svg';
        const el = (tag, attrs) => { const n = document.createElementNS(NS, tag); for (const k of Object.keys(attrs)) n.setAttribute(k, attrs[k]); return n; };
        button = document.createElement('button');
        button.type = 'button'; button.className = 'ui-sfx-btn';
        const mount = cfg.muteMount && document.querySelector(cfg.muteMount);
        button.style.cssText = 'flex:none;align-self:center;width:34px;height:34px;padding:0;border-radius:9px;border:1px solid rgba(120,200,255,0.25);background:rgba(6,10,22,0.62);color:#b4c6ef;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;pointer-events:auto;' +
            (mount ? '' : 'position:fixed;left:12px;bottom:12px;z-index:15;');
        const svg = el('svg', { viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' });
        svg.appendChild(el('path', { d: 'M4 9.5h3.2L12 5.5v13l-4.8-4H4z' }));
        svg.appendChild(el('path', { class: 'ui-sfx-waves', d: 'M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.6 7.6 0 0 1 0 11' }));
        svg.appendChild(el('path', { class: 'ui-sfx-cross', d: 'M16 9.5l5 5M21 9.5l-5 5' }));
        button.appendChild(svg);
        button.addEventListener('click', ev => { ev.stopPropagation(); setOff(!off); if (!off) { wake(); play('tap'); } });
        (mount || document.body).appendChild(button);
        paintButton();
    }

    function watch(el, isOpen, attr) {
        let was = isOpen();
        new MutationObserver(() => { const now = isOpen(); if (now !== was) { was = now; play(now ? 'open' : 'close'); } }).observe(el, { attributes: true, attributeFilter: [attr] });
    }
    function bind() {
        document.addEventListener('pointerdown', wake, true);
        document.addEventListener('keydown', wake, true);
        document.addEventListener('click', ev => {
            const t = ev.target;
            if (!t || !t.closest || (button && button.contains(t))) return;
            wake();
            if (cfg.tab && t.closest(cfg.tab)) play('tab');
            else if (cfg.tap && t.closest(cfg.tap)) play('tap');
        }, true);
        for (const part of (cfg.openClass || '').split(',')) {
            const i = part.lastIndexOf(':');
            const el = i > 0 && document.querySelector(part.slice(0, i).trim()), cls = part.slice(i + 1).trim();
            if (el && cls) watch(el, () => el.classList.contains(cls), 'class');
        }
        for (const sel of (cfg.openUnhide || '').split(',')) {
            const el = sel.trim() && document.querySelector(sel.trim());
            if (el) watch(el, () => !el.hidden, 'hidden');
        }
        makeButton();
        // not requestIdleCallback alone: a page that draws every frame (C4 Live's map) is never idle, so it would never run
        if (!off) { if (window.requestIdleCallback) window.requestIdleCallback(prepare, { timeout: 1500 }); else setTimeout(prepare, 1200); }
    }

    const debug = () => ({ state: ctx ? ctx.state : 'none', seconds: Object.fromEntries(NAMES.map(n => [n, buffers[n] ? Math.round(buffers[n].duration * 1000) / 1000 : null])) });
    window.UiSfx = { play, setOff, isOff: () => off, stats, debug, GAIN, NAMES };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
