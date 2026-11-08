// In-memory stand-in for the few node:fs calls Tools/c4-live/collector.mjs makes, so the same tested collector runs in
// the browser. Keys are bare file names. C4Live/c4-store.js persists the result only after a whole pass has succeeded,
// which keeps the collector's "one commit point" guarantee: a failed pass changes nothing on the visitor's PC.
const files = new Map();
const fds = new Map();
let nextFd = 1;
const base = p => String(p).split('/').pop();
const enoent = p => Object.assign(new Error(`ENOENT: ${p}`), { code: 'ENOENT' });

export function seed(saved) {
    files.clear(); fds.clear();
    for (const [k, v] of saved) files.set(k, v);
}
// Only finished .json files: not the lock, temp files, corrupt copies or the price-attempt stamp.
export function dump() {
    const out = new Map();
    for (const [k, v] of files) if (k.endsWith('.json') && k !== 'prices.attempt.json') out.set(k, v);
    return out;
}

export function mkdirSync() {}
export function appendFileSync() {}
export function existsSync(p) { return files.has(base(p)); }
export function readFileSync(p) { const k = base(p); if (!files.has(k)) throw enoent(p); return files.get(k); }
export function statSync(p) { const k = base(p); if (!files.has(k)) throw enoent(p); return { size: files.get(k).length, mtimeMs: Date.now() }; }
export function unlinkSync(p) { if (!files.delete(base(p))) throw enoent(p); }
export function renameSync(a, b) { const k = base(a); if (!files.has(k)) throw enoent(a); files.set(base(b), files.get(k)); files.delete(k); }
export function writeFileSync(target, data) { files.set(typeof target === 'number' ? fds.get(target) : base(target), String(data)); }
export function openSync(p, flags) {
    const k = base(p);
    if (flags === 'wx' && files.has(k)) throw Object.assign(new Error(`EEXIST: ${p}`), { code: 'EEXIST' });
    files.set(k, '');
    fds.set(nextFd, k);
    return nextFd++;
}
export function closeSync(fd) { fds.delete(fd); }
