// crew-fetch.js - Crew Explorer network reads (2026-11-10). Loaded by CrewExplorer/index.html (window.CrewFetch) and
// by Test/crew-explorer-check.js (require) with a fake fetch. Read-only: it only ever sends the addresses the visitor
// typed, to one public service, and needs no key.
//
//   Star Atlas crew feed   GET  https://galaxy.staratlas.com/crew/inventory/<owner>?page=N
//                          -> { total, crew: [...] }, 100 cards a page; `total` is the count on THAT page, so the
//                             only way to reach the end is to ask until a page comes back empty.
//
// Crew deposited into SAGE is not in the wallet: it is held by the profile's SagePlayerProfile account, whose address
// is computed here (CrewModel.sagePlayerProfileAddress) without any network call. A wallet's profiles are NOT looked
// up: that needs a Solana RPC, and on 2026-11-10 none of five public ones answered it from a browser without a key.
(function (root) {
    'use strict';
    const M = (typeof module !== 'undefined' && module.exports) ? require('./crew-model.js') : root.CrewModel;

    const FEED = 'https://galaxy.staratlas.com/crew/inventory/';
    const PAGE_SIZE = 100;
    const LIMIT_MS = 5 * 60 * 1000;   // the whole load stops after five minutes and keeps what it has
    const MAX_CARDS = 40000;          // about what five minutes can fetch at the measured pace
    const GAP_MS = 100;               // pause between calls; the feed allows 1,000 calls a window
    const RETRIES = 3;                // on "too many requests" only

    function deps(d) {
        d = d || {};
        return {
            fetch: d.fetch || ((...a) => globalThis.fetch(...a)),
            now: d.now || (() => Date.now()),
            sleep: d.sleep || (ms => new Promise(r => setTimeout(r, ms))),
            setTimeout: d.setTimeout || ((fn, ms) => setTimeout(fn, ms)),
            clearTimeout: d.clearTimeout || (t => clearTimeout(t)),
            signal: d.signal || null
        };
    }
    // One feed call that cannot outlive the load: it is cancelled when the visitor presses stop AND when the time
    // limit passes, so a request that never answers cannot hold the loading screen open.
    async function timedFetch(d, url, msLeft) {
        const ac = new AbortController();
        const stop = () => ac.abort();
        if (d.signal) { if (d.signal.aborted) ac.abort(); else d.signal.addEventListener('abort', stop, { once: true }); }
        const t = d.setTimeout(stop, Math.max(0, msLeft));
        try { return await d.fetch(url, { signal: ac.signal, credentials: 'omit', referrerPolicy: 'no-referrer' }); }
        finally { d.clearTimeout(t); if (d.signal) d.signal.removeEventListener('abort', stop); }
    }
    // a pause that ends at once when the visitor presses stop
    function pause(d, ms) {
        if (!d.signal) return d.sleep(ms);
        if (d.signal.aborted) return Promise.resolve();
        return new Promise(resolve => {
            const done = () => { d.signal.removeEventListener('abort', done); resolve(); };
            d.signal.addEventListener('abort', done, { once: true });
            d.sleep(ms).then(done);
        });
    }

    // One owner address, every page. ctl = { deadline, room } is shared by all owners of one load: `room` is how many
    // more cards may still be taken. Never throws: returns { rows, pages, complete, reason, error }. reason is ''
    // when the end was reached, else 'time' | 'cap' | 'stopped' | 'repeat' (the feed returned a page with nothing new,
    // so paging is not working) | 'error' (with the message in `error`). Cards read before a failure are kept.
    async function walkInventory(owner, d, ctl, onPage) {
        d = deps(d);
        const rows = [], seen = new Set();
        let pages = 0;
        const out = (reason, error) => ({ rows, pages, complete: !reason, reason: reason || '', error: error || '' });
        const aborted = () => !!(d.signal && d.signal.aborted);
        for (let page = 1; ; page++) {
            if (aborted()) return out('stopped');
            if (d.now() >= ctl.deadline) return out('time');
            if (ctl.room <= 0) return out('cap');
            let body;
            try {
                let res;
                for (let attempt = 0; ; attempt++) {
                    res = await timedFetch(d, FEED + encodeURIComponent(owner) + '?page=' + page, ctl.deadline - d.now());
                    if (res.status !== 429) break;
                    if (attempt >= RETRIES) return out('error', 'the crew feed is rate-limiting this address (HTTP 429)');
                    const wait = 2000 * Math.pow(2, attempt);
                    if (d.now() + wait >= ctl.deadline) return out('time');
                    await pause(d, wait);
                    if (aborted()) return out('stopped');
                }
                if (!res.ok) return out('error', 'the crew feed answered HTTP ' + res.status);
                try { body = await res.json(); }
                catch (e) { if (aborted()) return out('stopped'); if (d.now() >= ctl.deadline) return out('time'); return out('error', 'the crew feed sent an answer that could not be read'); }
            } catch (e) {
                if (aborted()) return out('stopped');
                if (d.now() >= ctl.deadline) return out('time');
                return out('error', 'could not reach the crew feed (' + String(e && e.message || e).slice(0, 120) + ')');
            }
            if (!body || !Array.isArray(body.crew)) return out('error', 'the crew feed sent an answer in an unknown shape');
            pages++;
            if (!body.crew.length) return out('');
            let fresh = 0;
            for (const r of body.crew) {
                const id = r && r.mintOffset;
                if (!M.validId(id) || seen.has(id)) continue;   // not a card (the rule normalize uses), or already seen
                seen.add(id);
                if (ctl.room <= 0) break;
                rows.push(r); fresh++; ctl.room--;
            }
            if (onPage) onPage({ pages, cards: rows.length });
            if (!fresh) return out(ctl.room <= 0 ? 'cap' : 'repeat');
            await pause(d, GAP_MS);
        }
    }

    // input { wallet, profile } (either may be empty). Returns
    //   { cards, sources: [{ kind, key, owner, count, pages, complete, reason, error }], notes: [], partial, tookMs }
    // One source failing never throws away what the others returned. onProgress({ label, step, steps, pages, cards, elapsedMs })
    async function load(input, dIn, onProgress) {
        const d = deps(dIn);
        const wallet = (input.wallet || '').trim(), profile = (input.profile || '').trim();
        if (!wallet && !profile) throw new Error('enter a wallet or a SAGE player profile');
        if (wallet && !M.isAddress(wallet)) throw new Error('the wallet is not a valid address');
        if (profile && !M.isAddress(profile)) throw new Error('the player profile is not a valid address');
        const started = d.now();
        const ctl = { deadline: started + LIMIT_MS, room: MAX_CARDS };
        const notes = [], sources = [];
        if (wallet) sources.push({ kind: 'wallet', key: wallet, owner: wallet });
        if (profile && profile !== wallet) sources.push({ kind: 'profile', key: profile, owner: await M.sagePlayerProfileAddress(profile) });
        if (!profile) notes.push('Only crew held in the wallet is shown. Crew deposited into SAGE is listed under the SAGE player profile: enter it to see them.');
        if (!wallet) notes.push('Only crew deposited into SAGE is shown. Enter the wallet as well to add crew still held in it.');

        const lists = [];
        let total = 0;
        for (let i = 0; i < sources.length; i++) {
            const s = sources[i];
            const label = s.kind === 'wallet' ? 'Wallet' : 'SAGE profile ' + M.shortAddr(s.key);
            const tick = pg => onProgress && onProgress({ label, step: i + 1, steps: sources.length, pages: pg.pages, cards: total + pg.cards, elapsedMs: d.now() - started });
            tick({ pages: 0, cards: 0 });
            const r = await walkInventory(s.owner, d, ctl, tick);
            const cards = r.rows.map(M.normalize).filter(Boolean);
            Object.assign(s, { count: cards.length, pages: r.pages, complete: r.complete, reason: r.reason, error: r.error });
            lists.push(cards); total += r.rows.length;
        }
        const cards = M.mergeCards(lists);
        return { cards, sources, notes, partial: sources.some(s => !s.complete), tookMs: d.now() - started };
    }

    const REASONS = new Map([['time', 'stopped at the five-minute limit'], ['cap', 'stopped at the ' + MAX_CARDS.toLocaleString('en-US') + '-card limit'], ['stopped', 'stopped by you'], ['repeat', 'the feed stopped returning new cards'], ['error', 'failed']]);
    const reasonText = r => REASONS.get(r) || 'incomplete';

    // What to tell the visitor when a load came back with no cards. "No crew found" is only said when every address
    // was read to its end; a stop, a time-out or a failure is named as what it was.
    function describeEmpty(res) {
        const src = res.sources;
        if (src.some(s => s.reason === 'stopped')) return 'Stopped before any crew was read.';
        const failed = src.filter(s => !s.complete);
        if (failed.length) {
            const why = [...new Set(failed.map(s => s.error || reasonText(s.reason)))].join('; ');
            return (failed.length === src.length ? 'Could not load the crew: ' : 'No crew found, but not every address could be read: ') + why + '.';
        }
        return 'No crew found for ' + (src.length > 1 ? 'these addresses' : 'this address') + '. ' + (res.notes.length ? res.notes.join(' ') : 'Check the address.');
    }

    const api = { FEED, PAGE_SIZE, LIMIT_MS, MAX_CARDS, GAP_MS, RETRIES, reasonText, describeEmpty, walkInventory, load };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.CrewFetch = api;
})(typeof window !== 'undefined' ? window : globalThis);
