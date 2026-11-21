// Runs Tools/c4-live/collector.mjs in the visitor's browser: window.C4Collect.run(saved, pricesText).
// `saved` is the Map of files from the last good pass; the result is a new Map, returned only after a whole pass.
// C4Collect.epoch() reads only the chain version (3 calls) so the page can tell whether the game was updated on chain;
// C4Collect.sameEpoch is the collector's own comparison, so both sides decide "same game" the same way.
import { collect, readChainEpoch, sameEpoch, openRpc } from '../../Tools/c4-live/collector.mjs';
import { seed, dump } from './fs-shim.js';

const PASS_TIMEOUT_MS = 5 * 60_000;
const EPOCH_TIMEOUT_MS = 15_000;
const isObject = v => !!v && typeof v === 'object' && !Array.isArray(v);
const SHAPE = {
    'db.json': v => isObject(v) && isObject(v.state),
    'history.json': Array.isArray,
    'events.json': Array.isArray,
    'owners.json': isObject,
};
// The collector stops on a damaged file and asks a person to fix it. A visitor can't, so a damaged file is dropped here
// and that part starts fresh, rather than every future read failing.
function usable(saved) {
    const out = new Map();
    for (const [name, text] of saved) {
        try {
            const value = JSON.parse(text);
            if (!SHAPE[name] || SHAPE[name](value)) out.set(name, text);
        } catch { /* dropped */ }
    }
    return out;
}
const epochChangedIn = files => { try { return JSON.parse(files.get('latest.json')).epoch?.changed === true; } catch { return false; } };

window.C4Collect = {
    async run(saved, pricesText) {
        // Mainnet refuses browser requests, so reference prices are the file shipped with the site, never a live read.
        const parseBook = text => { try { const p = JSON.parse(text); return p && Array.isArray(p.items) ? p : null; } catch { return null; } };
        const files = usable(saved);
        const shipped = parseBook(pricesText);
        if (shipped) files.set('prices.json', pricesText);
        // A failed download must not wipe the book this visitor already has.
        const prices = shipped || parseBook(files.get('prices.json'));
        const notes = shipped ? [] : [prices ? 'The reference prices could not be updated; keeping the saved ones.' : 'The reference prices could not be loaded.'];
        seed(files);
        const pass = { aborted: false, ctx: null, abort: new AbortController() };
        let timer;
        const timeout = new Promise((_, reject) => {
            timer = setTimeout(() => {
                pass.aborted = true;   // the collector's commit point checks this
                pass.abort.abort();
                Promise.resolve(pass.ctx?.dispose?.()).catch(() => {});
                reject(new Error('the read timed out'));
            }, PASS_TIMEOUT_MS);
        });
        try {
            const refreshPrices = async () => ({ prices, fetched: false, notes, calls: 0, ms: 0 });
            const code = await Promise.race([collect(pass, { refreshPrices }), timeout]);
            if (code !== 0 && code !== 2) throw new Error(`the read failed (${code})`);
            const out = dump();
            return { files: out, partial: code === 2, epochChanged: epochChangedIn(out) };
        } finally {
            clearTimeout(timer);
        }
    },
    // { genesis, sage } of the chain right now. At most 3 RPC calls; rejects on failure or after 15 s.
    async epoch() {
        const ac = new AbortController();
        let timer;
        const timeout = new Promise((_, reject) => {
            timer = setTimeout(() => { ac.abort(); reject(new Error('the chain version check timed out')); }, EPOCH_TIMEOUT_MS);
        });
        try {
            const e = await Promise.race([readChainEpoch(openRpc(), ac.signal), timeout]);
            return { genesis: e.genesis, sage: e.sage };
        } finally {
            clearTimeout(timer);
        }
    },
    sameEpoch,
};
