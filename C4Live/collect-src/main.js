// Runs Tools/c4-live/collector.mjs in the visitor's browser: window.C4Collect.run(saved, pricesText).
// `saved` is the Map of files from the last good pass; the result is a new Map, returned only after a whole pass.
import { collect } from '../../Tools/c4-live/collector.mjs';
import { seed, dump } from './fs-shim.js';

const PASS_TIMEOUT_MS = 5 * 60_000;
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
            return { files: dump(), partial: code === 2 };
        } finally {
            clearTimeout(timer);
        }
    },
};
