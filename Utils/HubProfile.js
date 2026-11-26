// HubProfile.js - the visitor's own profile, shared by every module (2026-11-26). Set on the landing page or in the
// Crew Explorer; read by C4 Live (marks what is yours) and the Recipe Explorer's planner (plans against what you hold
// in C4). Kept in this browser only (localStorage): nothing here is sent anywhere.
//
//   { v: 1, wallet, profile, c4: [...] }
//     wallet   your wallet address
//     profile  your SAGE player profile address
//     c4       player profiles of the C4 game on z.ink marked "this is me" on the C4 Live page (the C4 game is on
//              another chain, so its profile address is not the SAGE one)
//
// An owner in the C4 Live data { p: profile, wallet } is YOURS when its profile is in c4, or equals `profile`, or its
// wallet equals `wallet`.
//
// Loaded by the pages (window.HubProfile) and by Test/hub-profile-check.js (require).
(function (root) {
    'use strict';
    const KEY = 'hub.profile.v1';
    const MAX_C4 = 20;
    const isAddress = s => typeof s === 'string' && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s);
    const empty = () => ({ v: 1, wallet: '', profile: '', c4: [] });

    // Anything stored or typed -> a well-formed profile. A value that is not an address is dropped, never kept.
    function clean(v) {
        const out = empty();
        if (!v || typeof v !== 'object') return out;
        const addr = x => { const s = typeof x === 'string' ? x.trim() : ''; return isAddress(s) ? s : ''; };
        out.wallet = addr(v.wallet); out.profile = addr(v.profile);
        if (Array.isArray(v.c4)) for (const a of v.c4) { const s = addr(a); if (s && !out.c4.includes(s) && out.c4.length < MAX_C4) out.c4.push(s); }
        return out;
    }
    const isSet = p => !!(p && (p.wallet || p.profile || (p.c4 && p.c4.length)));
    // What is wrong with typed input, in words; '' when it can be saved. Empty fields are fine (they clear the value).
    function problem(input) {
        const w = String((input && input.wallet) || '').trim(), p = String((input && input.profile) || '').trim();
        if (w && !isAddress(w)) return 'The wallet is not a valid address.';
        if (p && !isAddress(p)) return 'The player profile is not a valid address.';
        return '';
    }

    const store = () => { try { return root.localStorage || null; } catch (e) { return null; } };
    const listeners = new Set();
    function get(st) {
        st = st || store();
        try { return clean(JSON.parse((st && st.getItem(KEY)) || 'null')); } catch (e) { return empty(); }
    }
    // Saves and returns the cleaned profile; false when the browser refused the write.
    function set(v, st) {
        st = st || store();
        const p = clean(v);
        try {
            if (!st) return false;
            if (isSet(p)) st.setItem(KEY, JSON.stringify(p)); else st.removeItem(KEY);
        } catch (e) { return false; }
        listeners.forEach(fn => { try { fn(p); } catch (e) { /* one listener must not stop the others */ } });
        return p;
    }
    const clear = st => set(empty(), st);
    // wallet / profile from a form: keeps the C4 marks. `only` = fill empty fields only (the Crew Explorer's load).
    function update(input, st, only) {
        const cur = get(st), next = { v: 1, wallet: cur.wallet, profile: cur.profile, c4: cur.c4 };
        for (const k of ['wallet', 'profile']) {
            if (!input || input[k] === undefined) continue;
            const s = String(input[k] || '').trim();
            if (only && cur[k]) continue;
            if (s && !isAddress(s)) continue;
            next[k] = s;
        }
        return set(next, st);
    }
    // mark or unmark one C4 player profile as "this is me"
    function markC4(addr, on, st) {
        const cur = get(st);
        if (!isAddress(addr)) return cur;
        const c4 = cur.c4.filter(a => a !== addr);
        if (on) c4.push(addr);
        return set({ v: 1, wallet: cur.wallet, profile: cur.profile, c4 }, st);
    }
    // fn(profile) after every change, in this tab and (through the storage event) in the other tabs of this site
    function onChange(fn) {
        listeners.add(fn);
        if (root.addEventListener) root.addEventListener('storage', ev => { if (ev.key === KEY || ev.key === null) fn(get()); });
        return () => listeners.delete(fn);
    }

    // ---- what is yours in a C4 Live read (latest.json) ----------------------------------------------------------
    // why: 'marked' (in c4) | 'profile' | 'wallet' | '' (not yours)
    function whyMine(owner, p) {
        if (!owner || !p || typeof owner.p !== 'string') return '';
        if (p.c4 && p.c4.includes(owner.p)) return 'marked';
        if (p.profile && owner.p === p.profile) return 'profile';
        if (p.wallet && owner.wallet === p.wallet) return 'wallet';
        return '';
    }
    const isMine = (owner, p) => !!whyMine(owner, p);
    // the set of C4 player profile addresses that are yours in this read
    function mineSet(latest, p) {
        const out = new Set();
        if (!isSet(p)) return out;
        for (const a of p.c4 || []) out.add(a);                 // a marked profile is yours even if it holds nothing now
        if (p.profile) out.add(p.profile);
        for (const o of (latest && Array.isArray(latest.owners) ? latest.owners : [])) if (isMine(o, p)) out.add(o.p);
        return out;
    }
    const qty = v => (typeof v === 'number' && isFinite(v) && v > 0 ? v : 0);
    // { owners, fleets, stakes, stock: [{ name, units, inFleets, inStakes }] (largest first), at }
    // stock = cargo in your fleets' holds + the inventory of your claim stakes. A starbase's stores are NOT in the
    // C4 Live read, so they are not counted.
    function assets(latest, p) {
        const ids = mineSet(latest, p);
        const L = latest && typeof latest === 'object' ? latest : {};
        const owners = (Array.isArray(L.owners) ? L.owners : []).filter(o => o && ids.has(o.p));
        const fleets = (Array.isArray(L.fleets) ? L.fleets : []).filter(f => f && !f.npc && ids.has(f.o));
        const stakes = (Array.isArray(L.stakes) ? L.stakes : []).filter(s => s && ids.has(s.o));
        const by = new Map();
        const add = (name, n, key) => {
            if (typeof name !== 'string' || !name || !qty(n)) return;
            const r = by.get(name) || { name, units: 0, inFleets: 0, inStakes: 0 };
            r.units += n; r[key] += n; by.set(name, r);
        };
        for (const f of fleets) for (const h of (Array.isArray(f.hold) ? f.hold : [])) add(h && h.n, h && h.q, 'inFleets');
        for (const s of stakes) for (const i of (Array.isArray(s.inv) ? s.inv : [])) add(i && i.r, i && i.q, 'inStakes');
        const stock = [...by.values()].sort((a, b) => b.units - a.units || a.name.localeCompare(b.name));
        return { owners, fleets, stakes, stock, at: typeof L.generatedAt === 'number' ? L.generatedAt : 0 };
    }

    // ---- the C4 Live read this browser can see ---------------------------------------------------------------------
    // On the local server: the collector's file. On the public site: the copy the C4 Live page saved in this browser
    // (it reads the chain itself). base = path from the page to the site root ('' or '../').
    // -> { latest, source: 'file' | 'saved' } or { latest: null, source: '', why }
    // opts.bodies: also hand back the planets file (bodies.json: [{ a address, n name, sys, sub, ... }]) as `bodies`,
    // or null when it is not there. It is large (1.4 MB): ask only where a planet has to be named.
    const isLocal = () => { const loc = root.location || {}; return (loc.protocol === 'file:' || /^(localhost|127\.|\[::1\])/.test(loc.hostname || '')) && !/[?&]chain=1\b/.test(loc.search || ''); };
    async function c4File(base, name) {
        if (isLocal()) {
            try {
                const r = await root.fetch((base || '') + 'Data/c4-live/' + name, { cache: 'no-store' });
                if (r.ok) return { doc: await r.json(), source: 'file' };
            } catch (e) { /* fall through to the saved copy */ }
        }
        const text = await savedC4(name);
        return text ? { doc: JSON.parse(text), source: 'saved' } : { doc: null, source: '' };
    }
    async function loadC4(base, opts) {
        let got;
        try { got = await c4File(base, 'latest.json'); }
        catch (e) { return { latest: null, source: '', why: 'The saved C4 Live data could not be read.' }; }
        if (!got.doc) return { latest: null, source: '', why: isLocal() ? 'The collector has not written Data/c4-live/latest.json yet.' : 'Open C4 Live once: it reads the game from the chain and keeps a copy in this browser.' };
        const out = { latest: got.doc, source: got.source };
        if (opts && opts.bodies) {
            try { const b = await c4File(base, 'bodies.json'); out.bodies = b.doc && Array.isArray(b.doc.bodies) ? b.doc.bodies : null; }
            catch (e) { out.bodies = null; }
        }
        return out;
    }
    // the C4 Live page's own store (C4Live/c4-store.js): database 'c4-live', store 'files', keys = file names.
    // The store is created here exactly as that page creates it, so opening it first cannot leave it without one.
    function savedC4(name) {
        return new Promise((resolve, reject) => {
            if (!root.indexedDB) return resolve(null);
            const r = root.indexedDB.open('c4-live', 1);
            r.onupgradeneeded = () => r.result.createObjectStore('files');
            r.onerror = () => reject(r.error);
            r.onsuccess = () => {
                const db = r.result;
                try {
                    const g = db.transaction('files').objectStore('files').get(name);
                    g.onsuccess = () => { db.close(); resolve(typeof g.result === 'string' ? g.result : null); };
                    g.onerror = () => { db.close(); reject(g.error); };
                } catch (e) { db.close(); reject(e); }
            };
        });
    }

    const api = { KEY, MAX_C4, isAddress, empty, clean, isSet, problem, get, set, clear, update, markC4, onChange, whyMine, isMine, mineSet, assets, loadC4 };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.HubProfile = api;
})(typeof window !== 'undefined' ? window : globalThis);
