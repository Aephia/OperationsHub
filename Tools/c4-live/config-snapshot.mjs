// Config snapshot: the game's CONFIG as the chain holds it today, saved so two snapshots can be diffed
// when the game team redeploys. Local tool only: not part of the hourly collector pass, not bundled for
// the browser, not served by the page.
//
//   node Tools/c4-live/config-snapshot.mjs [--out <dir>] [--only <table,...>] [--accept-empty <table,...>]
//
// Default out dir: Data/c4-live/config. See CONFIG-SNAPSHOT.md for the file shapes and failure rules.
// Exit: 0 all tables ok, 2 some failed (the others are written; index.json says which), 1 nothing written.
import { mkdirSync, readFileSync, writeFileSync, appendFileSync, renameSync, existsSync, statSync, unlinkSync, copyFileSync, openSync, closeSync, readSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomBytes } from 'node:crypto';

const HERE = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_OUT = join(HERE, '..', '..', 'Data', 'c4-live', 'config');
const DEFAULT_RPC = 'https://testnet-rpc.z.ink';
const MAX_FIELDS_PER_ROW = 500;
const LOCK_STALE_MS = 30 * 60_000;
const FACTION_IDS = [1, 2, 3];

// ---------------------------------------------------------------- canonical form
// bigint -> decimal string, snapshot objects -> their toJSON(), object keys sorted, undefined dropped.
// { raw, value } pairs are plain objects and are kept as they are (their own bigints become strings).
export function canon(v, depth = 0) {
  if (depth > 40) throw new Error('config value nested deeper than 40');
  if (v === undefined) return undefined;
  if (v === null) return null;
  const t = typeof v;
  if (t === 'bigint') return v.toString();
  if (t === 'number') return Number.isFinite(v) ? v : String(v);
  if (t === 'string' || t === 'boolean') return v;
  if (t === 'function' || t === 'symbol') return undefined;
  if (v instanceof Uint8Array) return Buffer.from(v).toString('hex');
  if (typeof v.toJSON === 'function') {
    const j = v.toJSON();
    if (j !== v) return canon(j, depth + 1);
  }
  if (Array.isArray(v)) return v.map((x) => { const c = canon(x, depth + 1); return c === undefined ? null : c; });
  const out = {};
  for (const k of Object.keys(v).sort()) {
    const c = canon(v[k], depth + 1);
    if (c !== undefined) out[k] = c;
  }
  return out;
}

// Row key: id, else address, else name; a row with none of them gets its position-free canonical hash.
export function rowKey(row, keyField) {
  if (row && typeof row === 'object') {
    if (keyField && (typeof row[keyField] === 'number' || (typeof row[keyField] === 'string' && row[keyField] !== ''))) return row[keyField];
    for (const f of ['id', 'address', 'name']) {
      const v = row[f];
      if (typeof v === 'number' || (typeof v === 'string' && v !== '')) return v;
    }
  }
  return 'h:' + createHash('sha256').update(JSON.stringify(row)).digest('hex').slice(0, 16);
}
function cmpKey(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'number') return -1;
  if (typeof b === 'number') return 1;
  return a < b ? -1 : a > b ? 1 : 0;
}
// Canonical rows sorted by key (ties by their JSON), duplicate keys suffixed #2, #3 so a key is unique.
export function sortRows(rowsIn, keyField) {
  const items = rowsIn.map((r) => { const row = canon(r); return { row, key: rowKey(row, keyField), js: JSON.stringify(row) }; });
  items.sort((a, b) => cmpKey(a.key, b.key) || (a.js < b.js ? -1 : a.js > b.js ? 1 : 0));
  const seen = new Map();
  for (const it of items) {
    const n = (seen.get(it.key) || 0) + 1;
    seen.set(it.key, n);
    it.ukey = n === 1 ? it.key : `${it.key}#${n}`;
  }
  return items;
}

// Drop paths: 'name' = a top-level key; 'a[].b' = key b of every element of the array a; 'a.b' = key b of object a.
// The last segment is a plain key (it is the thing deleted).
const DROP_PATH = /^[A-Za-z_][A-Za-z0-9_]*(\[\])?(\.[A-Za-z_][A-Za-z0-9_]*(\[\])?)*$/;
export function validDropPath(p) {
  return typeof p === 'string' && DROP_PATH.test(p) && !p.endsWith('[]') && !p.split('.').some((s) => s.replace('[]', '') === '__proto__');
}
function dropAt(node, segs) {
  if (!node || typeof node !== 'object') return;
  const seg = segs[0], isArr = seg.endsWith('[]'), key = isArr ? seg.slice(0, -2) : seg;
  if (!Object.hasOwn(node, key)) return;
  if (segs.length === 1) { delete node[key]; return; }
  const child = node[key];
  if (isArr) { if (Array.isArray(child)) for (const el of child) dropAt(el, segs.slice(1)); } else dropAt(child, segs.slice(1));
}
export function applyDrops(row, dropPaths) {
  const c = canon(row);
  if (c && typeof c === 'object') for (const p of dropPaths) dropAt(c, p.split('.'));
  return c;
}

// Every object that carries a cargoId gets the cargo NAME next to it (`cargo`), the id stays.
export function addCargoNames(node, names) {
  if (Array.isArray(node)) { for (const x of node) addCargoNames(x, names); return; }
  if (!node || typeof node !== 'object') return;
  if ('cargoId' in node && !('cargo' in node)) {
    const n = names.get(String(node.cargoId));
    if (n !== undefined) node.cargo = n;
  }
  for (const k of Object.keys(node)) addCargoNames(node[k], names);
}

// ---------------------------------------------------------------- diff
function flatten(v, path, out) {
  if (v !== null && typeof v === 'object') {
    const ks = Array.isArray(v) ? v.map((_, i) => i) : Object.keys(v);
    if (ks.length === 0) { out.set(path, Array.isArray(v) ? [] : {}); return; }
    for (const k of ks) flatten(v[k], Array.isArray(v) ? `${path}[${k}]` : (path ? `${path}.${k}` : k), out);
  } else out.set(path, v);
}
// Rows with the same key (a weak key) are paired in two passes: identical rows first, then what is left in
// sorted order; so one changed row among duplicates is one change, not a shifted run of them.
// An entry's key is the NEW row's ukey (`7`, `7#2`, ...); `oldKey` is added when the old row's ukey differs.
export function diffRows(oldItems, newItems) {
  const byKey = (items) => { const m = new Map(); for (const it of items) { const a = m.get(it.key); if (a) a.push(it); else m.set(it.key, [it]); } return m; };
  const og = byKey(oldItems), ng = byKey(newItems);
  const newOnly = new Set(), oldOnly = new Set(), pairOf = new Map();
  for (const k of new Set([...og.keys(), ...ng.keys()])) {
    const oLeft = [...(og.get(k) || [])], nLeft = [];
    for (const ni of ng.get(k) || []) {
      const j = oLeft.findIndex((oi) => oi.js === ni.js);
      if (j >= 0) oLeft.splice(j, 1); else nLeft.push(ni);
    }
    const m = Math.min(oLeft.length, nLeft.length);
    for (let i = 0; i < m; i++) pairOf.set(nLeft[i], oLeft[i]);
    for (const ni of nLeft.slice(m)) newOnly.add(ni);
    for (const oi of oLeft.slice(m)) oldOnly.add(oi);
  }
  const added = [], removed = [], changed = [];
  for (const ni of newItems) if (newOnly.has(ni)) added.push(ni.ukey);
  for (const oi of oldItems) if (oldOnly.has(oi)) removed.push(oi.ukey);
  for (const ni of newItems) {
    const oi = pairOf.get(ni);
    if (!oi) continue;
    const a = new Map(), b = new Map();
    flatten(oi.row, '', a); flatten(ni.row, '', b);
    const fields = [];
    for (const p of new Set([...a.keys(), ...b.keys()])) {
      const x = a.has(p) ? a.get(p) : null, y = b.has(p) ? b.get(p) : null;
      if (JSON.stringify(x) !== JSON.stringify(y)) fields.push({ path: p, from: x, to: y });
    }
    fields.sort((p, q) => (p.path < q.path ? -1 : p.path > q.path ? 1 : 0));
    const e = { key: ni.ukey };
    if (oi.ukey !== ni.ukey) e.oldKey = oi.ukey;
    if (typeof ni.row.name === 'string') e.name = ni.row.name;
    if (fields.length > MAX_FIELDS_PER_ROW) { e.fields = fields.slice(0, MAX_FIELDS_PER_ROW); e.fieldsTruncated = fields.length; } else e.fields = fields;
    changed.push(e);
  }
  return { added, removed, changed };
}

// ---------------------------------------------------------------- files
export function atomicWrite(path, text) {
  const tmp = `${path}.tmp-${process.pid}`;
  try {
    writeFileSync(tmp, text);
    renameSync(tmp, path);
  } catch (e) { try { unlinkSync(tmp); } catch { /* best effort */ } throw e; }
}
const sha = (s) => createHash('sha256').update(s).digest('hex');
function readJsonFile(p) {
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return undefined; } // undefined = unreadable
}
const safeName = (s) => typeof s === 'string' && /^[a-z][a-z0-9_]{0,40}$/.test(s);

// The lock file holds a token (pid:random). Taken with an exclusive create; a lock older than LOCK_STALE_MS is
// taken over only if it still holds the content seen when it was judged stale; after writing, the file is re-read
// and the lock counts only if it holds OUR token; release removes the file only while it still holds our token.
// (A takeover race needs two runs judging the same lock stale within the same few milliseconds; the re-read
// catches the loser, but a loser that already unlinked the winner's fresh file is the one window left.)
// io: injectable fs functions, now() and token() for tests. Returns { release, token } or null.
export function takeLock(out, io = {}) {
  const f = { openSync, writeFileSync, closeSync, readFileSync, statSync, unlinkSync, now: Date.now, token: () => `${process.pid}:${randomBytes(8).toString('hex')}`, ...io };
  const p = join(out, '.lock');
  const mine = f.token();
  const release = () => { try { if (f.readFileSync(p, 'utf8') === mine) f.unlinkSync(p); } catch { /* gone, or not ours */ } };
  for (let i = 0; i < 2; i++) {
    let fd;
    try { fd = f.openSync(p, 'wx'); } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      let seen, age;
      try { seen = f.readFileSync(p, 'utf8'); age = f.now() - f.statSync(p).mtimeMs; } catch { continue; } // vanished: try the create again
      if (age <= LOCK_STALE_MS) return null;
      try { // stale: take over only if it is still the same stale lock
        if (f.readFileSync(p, 'utf8') !== seen || f.now() - f.statSync(p).mtimeMs <= LOCK_STALE_MS) return null;
        f.unlinkSync(p);
      } catch { /* raced */ }
      continue;
    }
    try { f.writeFileSync(fd, mine); } finally { f.closeSync(fd); }
    let held; try { held = f.readFileSync(p, 'utf8'); } catch { held = null; }
    return held === mine ? { release, token: mine } : null;
  }
  return null;
}

// changes.jsonl: a crash mid-append can leave a partial last line; the next append starts on a new line.
export function appendLine(path, line) {
  let lead = '';
  try {
    const size = statSync(path).size;
    if (size > 0) { const fd = openSync(path, 'r'); try { const b = Buffer.alloc(1); readSync(fd, b, 0, 1, size - 1); if (b[0] !== 10) lead = '\n'; } finally { closeSync(fd); } }
  } catch (e) { if (e.code !== 'ENOENT') throw e; }
  appendFileSync(path, lead + line + '\n');
}
// The reader of the change log: { entries, skipped } - lines that are not a JSON object with `table` and `at` are skipped and counted.
export function readChanges(dir) {
  let text;
  try { text = readFileSync(join(dir, 'changes.jsonl'), 'utf8'); } catch (e) { if (e.code === 'ENOENT') return { entries: [], skipped: 0 }; throw e; }
  const entries = []; let skipped = 0;
  for (const line of text.split('\n')) {
    if (line.trim() === '') continue;
    try {
      const o = JSON.parse(line);
      if (o && typeof o === 'object' && !Array.isArray(o) && typeof o.table === 'string' && typeof o.at === 'number') entries.push(o); else skipped++;
    } catch { skipped++; }
  }
  return { entries, skipped };
}
const changeLineOf = (at, fromEpoch, toEpoch, table, d) => JSON.stringify({ at, fromEpoch, toEpoch, table, added: d.added, removed: d.removed, changed: d.changed });
const hasChange = (d) => d.added.length > 0 || d.removed.length > 0 || d.changed.length > 0;

// Crash recovery: the order per table is history copy, table file, change line. A crash after the table file leaves a
// file whose readAt has no change line; the newest history file older than it is the file it replaced, so the line
// is rebuilt from the two (same at, epochs and diff as the lost one). Returns true when a line was appended.
function rebuildChangeLine(out, name, keyField, entries) {
  const cur = readJsonFile(join(out, `${name}.json`));
  if (!cur || !Array.isArray(cur.rows) || typeof cur.readAt !== 'number') return false;
  if (entries.some((c) => c.table === name && c.at === cur.readAt)) return false;
  let pred = null;
  const re = new RegExp(`^${name}\\.(\\d+)(?:\\.\\d+)?\\.json$`);
  for (const fn of readdirSync(join(out, 'history')).sort()) {
    const m = re.exec(fn);
    if (m && Number(m[1]) < cur.readAt && (!pred || Number(m[1]) >= pred.at)) pred = { at: Number(m[1]), fn };
  }
  if (!pred) return false;
  const prev = readJsonFile(join(out, 'history', pred.fn));
  if (!prev || !Array.isArray(prev.rows)) return false;
  const d = diffRows(sortRows(prev.rows, keyField), sortRows(cur.rows, keyField));
  if (!hasChange(d)) return false;
  appendLine(join(out, 'changes.jsonl'), changeLineOf(cur.readAt, prev.epoch ?? null, cur.epoch ?? null, name, d));
  return true;
}
// The previous table file goes into history (named by its own readAt), via a temp file; a copy already there with the same bytes is reused.
function copyIntoHistory(out, name, file, prevReadAt) {
  const hp = join(out, 'history', `${name}.${prevReadAt}.json`);
  let dest = hp;
  if (existsSync(hp)) {
    if (readFileSync(hp).equals(readFileSync(file))) return hp;
    dest = join(out, 'history', `${name}.${prevReadAt}.${process.pid}.json`);
  }
  const tmp = `${dest}.tmp-${process.pid}`;
  try { copyFileSync(file, tmp); renameSync(tmp, dest); } catch (e) { try { unlinkSync(tmp); } catch { /* best effort */ } throw e; }
  return dest;
}

// ---------------------------------------------------------------- the tables
// name -> { read(ctx, kit) -> raw, rows(raw) -> array }. Each table is one logical read (a few are two or three RPC reads).
async function kit() {
  const [cargo, cs, crafting, reg, combat, factions, identity, scanning, rewards] = await Promise.all([
    import('@aephia/atlas-kit/cargo'), import('@aephia/atlas-kit/claim-stakes'), import('@aephia/atlas-kit/crafting'),
    import('@aephia/atlas-kit/fleets'), import('@aephia/atlas-kit/combat'), import('@aephia/atlas-kit/factions'),
    import('@aephia/atlas-kit/identity'), import('@aephia/atlas-kit/scanning'), import('@aephia/atlas-kit/rewards'),
  ]);
  return { cargo, cs, crafting, reg, combat, factions, identity, scanning, rewards };
}
const list = (x) => (Array.isArray(x) ? x : x == null ? [] : [x]);
const perFaction = async (fn) => { const out = []; for (const id of FACTION_IDS) { const r = await fn(id); out.push({ factionId: id, ...(canon(r) || {}) }); } return out; };
export const TABLES = {
  cargo: { read: (c, k) => k.cargo.listCargoDefinitions(c), rows: list },
  claim_stake_definitions: { read: (c, k) => k.cs.listClaimStakeDefinitions(c), rows: list },
  claim_stake_buildings: { read: (c, k) => k.cs.listClaimStakeBuildingDefinitions(c), rows: list },
  recipes: { read: (c, k) => k.crafting.listRecipes(c), rows: list, drop: ['usageCountRaw'] },
  crafting_habs: { read: (c, k) => k.crafting.listCraftingHabDefinitions(c), rows: list },
  hab_buildings: { read: (c, k) => k.crafting.listHabBuildingDefinitions(c), rows: list },
  ship_configurations: { read: (c, k) => k.reg.listShipConfigurations(c), rows: list },
  combat_configuration: { read: (c, k) => k.combat.getCombatConfiguration(c), rows: list },
  faction_relations: { read: (c, k) => k.factions.getFactionRelations(c), rows: list },
  territory_regions: { read: (c, k) => k.factions.getTerritoryRegions(c), rows: (r) => list(canon(r)?.regions ?? r) },
  king_systems: { read: (c, k) => k.factions.getKingSystems(c), rows: (r) => list(canon(r)?.systems ?? r), keyField: 'systemId' },
  factions: { read: (c, k) => perFaction((id) => k.factions.getFaction(c, id)), rows: list, drop: ['npcFleetCount', 'treasuryCount'], keyField: 'factionId' },
  faction_treasuries: { read: (c, k) => perFaction((id) => k.factions.getFactionTreasury(c, id)), rows: list, drop: ['atlasBalance', 'atlasBalanceRaw', 'atlasOutThisEpoch', 'atlasOutThisEpochRaw', 'epochStartedAtUnixSeconds', 'reserves[].quantityRaw'], keyField: 'factionId' },
  faction_economics: { read: (c, k) => k.factions.getFactionEconomics(c), rows: list },
  research_catalog: { read: (c, k) => k.identity.getResearchCatalog(c), rows: (r) => list(canon(r)?.nodes ?? r) },
  scan_patterns: { read: (c, k) => k.scanning.getScanPatterns(c), rows: list },
  atlas_reward_registry: { read: (c, k) => k.rewards.getAtlasRewardRegistry(c), rows: list, drop: ['currentEpoch', 'currentEpochStartedAtUnixSeconds', 'currentEpochEndsAtUnixSeconds'] },
  atlas_reward_config: { read: async (c, k) => { const reg = await k.rewards.getAtlasRewardRegistry(c); return k.rewards.getAtlasRewardConfig(c, reg.activeConfigVersion); }, rows: list },
};

// Text that may be printed or written: any http(s) URL, the exact RPC url, and the parts of it a key can sit in
// (host+path, path, query, userinfo; plain and percent-decoded) are replaced by <url>. Longest first.
export function scrubText(text, rpcUrl) {
  let msg = String(text).replace(/https?:\/\/\S+/gi, '<url>');
  if (rpcUrl) {
    const parts = new Set([rpcUrl]);
    let u = null;
    try { u = new URL(rpcUrl); } catch { try { u = new URL('http://' + rpcUrl); } catch { /* not a url at all */ } }
    if (u) {
      const dec = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
      const path = u.pathname.length > 1 ? u.pathname : '', q = u.search.length > 1 ? u.search : '';
      for (const s of [u.host + path + q, u.host + path, path + q, path, q, q.slice(1), u.username, u.password]) {
        if (s && s.length >= 3 && s !== '/') { parts.add(s); parts.add(dec(s)); }
      }
    }
    for (const s of [...parts].filter((x) => x && x.length >= 3).sort((a, b) => b.length - a.length)) msg = msg.split(s).join('<url>');
  }
  return msg;
}
const errCode = (e, rpcUrl) => {
  const code = e && (e.code ?? e.name);
  return { code: code === undefined ? 'ERROR' : String(code), message: scrubText(e && e.message || e, rpcUrl).slice(0, 160) };
};
export function hostOf(url) { try { return new URL(url).host; } catch { return 'custom'; } }

// ---------------------------------------------------------------- the run
// deps: { epoch(): {genesis,sage}, read: { [table]: async () => raw }, ctx, sleep(ms), now(): unix s, rpcUrl, log(...) }
export async function snapshot(opts = {}, deps = {}) {
  const out = resolve(opts.out || DEFAULT_OUT);
  const log = deps.log || (() => {});
  const sleep = deps.sleep || ((ms) => new Promise((r) => setTimeout(r, ms)));
  const nowSec = () => (deps.now ? deps.now() : Math.floor(Date.now() / 1000));
  const rpcUrl = deps.rpcUrl || process.env.C4_RPC_URL || DEFAULT_RPC;
  const only = opts.only && opts.only.length ? opts.only : null;
  const acceptEmpty = new Set(opts.acceptEmpty || []);
  const names = only || Object.keys(deps.tables || TABLES);
  const defs = deps.tables || TABLES;
  for (const n of [...names, ...acceptEmpty]) if (!safeName(n) || !Object.hasOwn(defs, n)) return { code: 1, error: `unknown table: ${String(n).slice(0, 40)}` };
  for (const n of names) for (const p of defs[n].drop || []) if (!validDropPath(p)) return { code: 1, error: `bad drop path in ${n}: ${String(p).slice(0, 40)}` };

  let lazyCtx = null, lazyKit = null, lazyRpc = null;
  const getCtx = async () => {
    if (deps.ctx) return deps.ctx;
    if (!lazyCtx) {
      const { openRpc } = await import('./collector.mjs');
      const { createSageContext } = await import('@aephia/atlas-kit/client');
      lazyRpc = openRpc();
      lazyCtx = createSageContext({ cluster: 'zink-ptr', rpc: lazyRpc });
    }
    return lazyCtx;
  };
  const withRetry = async (what, fn) => {
    try { return await fn(); } catch (e1) {
      log(`${what} failed (${errCode(e1, rpcUrl).code}); retrying once`);
      await sleep(deps.retryMs ?? 2500);
      return await fn();
    }
  };

  // 1. chain version first: no version, nothing is written.
  let epoch;
  try {
    epoch = await withRetry('epoch', async () => {
      if (deps.epoch) return deps.epoch();
      const { readChainEpoch, openRpc } = await import('./collector.mjs');
      return readChainEpoch(openRpc());
    });
    if (!epoch || typeof epoch.genesis !== 'string' || !epoch.genesis) throw new Error('no genesis in epoch');
    epoch = { genesis: epoch.genesis, sage: epoch.sage ?? null };
  } catch (e) { const c = errCode(e, rpcUrl); log(`chain version unreadable: ${c.code} ${c.message}`); return { code: 1, error: 'epoch', detail: c }; }

  mkdirSync(out, { recursive: true });
  const lock = takeLock(out, deps.lockIo);
  if (!lock) return { code: 1, error: 'another snapshot is running (lock)' };
  try {
    mkdirSync(join(out, 'history'), { recursive: true });
    const readAt = nowSec();
    const prevIndex = readJsonFile(join(out, 'index.json'));
    const tablesIdx = prevIndex && typeof prevIndex.tables === 'object' && prevIndex.tables ? { ...prevIndex.tables } : {};

    // a crash after a table file was replaced but before its change line was appended: rebuild the line first
    const reconciled = [];
    try {
      const { entries } = readChanges(out);
      for (const name of names) {
        try { if (rebuildChangeLine(out, name, defs[name].keyField, entries)) { reconciled.push(name); log(`${name}: change line rebuilt from history`); } } catch (e) { log(`${name}: change line rebuild failed (${errCode(e, rpcUrl).code})`); }
      }
    } catch (e) { log(`change log unreadable (${errCode(e, rpcUrl).code}); no rebuild`); }

    // cargo names: from this run's cargo read when it is among the tables, else one extra read just for names
    const cache = new Map();
    const readTable = async (name) => {
      const raw = await withRetry(`read ${name}`, async () => {
        if (deps.read && Object.hasOwn(deps.read, name)) return deps.read[name]();
        if (!lazyKit) lazyKit = await kit();
        return defs[name].read(await getCtx(), lazyKit);
      });
      const rows = defs[name].rows(raw);
      if (!Array.isArray(rows)) throw new Error('rows is not an array');
      return rows;
    };
    const cargoNames = new Map();
    let cargoRows = null, cargoErr = null;
    try { cargoRows = await readTable('cargo'); cache.set('cargo', cargoRows); } catch (e) { cargoErr = e; log(`cargo read failed (${errCode(e, rpcUrl).code}); no cargo names this run`); }
    if (cargoRows) for (const r of cargoRows) { const c = canon(r); if (c && c.id !== undefined && typeof c.name === 'string') cargoNames.set(String(c.id), c.name); }

    const results = {};
    let wrote = 0, failed = 0, touched = 0;
    for (const name of names) {
      const file = join(out, `${name}.json`);
      let rows;
      try {
        if (name === 'cargo' && cargoErr) throw cargoErr;
        rows = cache.has(name) ? cache.get(name) : await readTable(name);
      } catch (e) {
        const c = errCode(e, rpcUrl);
        failed++;
        const prev = tablesIdx[name] || {};
        tablesIdx[name] = { ok: false, error: c.code, message: c.message, keptPrevious: !!existsSync(file), ...(prev.count !== undefined ? { count: prev.count, sha256: prev.sha256 } : {}) };
        results[name] = { ok: false, error: c.code };
        log(`${name}: FAILED ${c.code}`);
        continue;
      }
      // Everything from here on is inside the table's own try: a failure marks THIS table and the run goes on.
      // Order per changed table: history copy of the old file, atomic replace of the table file, change line.
      // `stage` says how far it got, so the index can describe what is really on disk.
      let stage = 'prepare', prevFile, prevRows = null, digest, items;
      try {
        prevFile = readJsonFile(file);
        prevRows = prevFile && Array.isArray(prevFile.rows) ? prevFile.rows : null;
        const prevCount = prevRows ? prevRows.length : 0;
        if (rows.length === 0 && prevCount > 0 && !acceptEmpty.has(name)) {
          failed++;
          const prev = tablesIdx[name] || {};
          tablesIdx[name] = { ok: false, error: 'EMPTY_READ', message: `read returned 0 rows, previous snapshot had ${prevCount}; pass --accept-empty ${name} to accept`, keptPrevious: true, count: prev.count, sha256: prev.sha256 };
          results[name] = { ok: false, error: 'EMPTY_READ' };
          log(`${name}: EMPTY_READ refused`);
          continue;
        }
        const dropKeys = defs[name].drop || [];
        items = sortRows(dropKeys.length ? rows.map((r) => applyDrops(r, dropKeys)) : rows, defs[name].keyField);
        for (const it of items) addCargoNames(it.row, cargoNames);
        for (const it of items) { it.row = canon(it.row); it.js = JSON.stringify(it.row); } // re-sort keys: the added `cargo` lands in its sorted place
        const rowsJson = JSON.stringify(items.map((i) => i.row));
        digest = sha(rowsJson);
        const duplicateKeys = items.length - new Set(items.map((i) => i.key)).size; // rows sharing a key: the key is weak for this table
        const dupField = duplicateKeys > 0 ? { duplicateKeys } : {};
        const prevDigest = prevRows ? sha(JSON.stringify(prevRows)) : null;
        if (prevDigest === digest) {
          tablesIdx[name] = { ok: true, count: items.length, sha256: digest, readAt, unchangedSince: prevFile.readAt, ...dupField };
          results[name] = { ok: true, changed: false, count: items.length };
          continue;
        }
        const doc = { table: name, readAt, epoch, count: items.length, ...(dropKeys.length ? { dropped: dropKeys } : {}), rows: items.map((i) => i.row) };
        const text = JSON.stringify(doc);
        if (text.length < 20) throw new Error('refusing to write a near-empty table file');
        let changeLine = null, res;
        if (prevRows) {
          const d = diffRows(sortRows(prevRows, defs[name].keyField), items);
          if (hasChange(d)) changeLine = changeLineOf(readAt, prevFile.epoch ?? null, epoch, name, d);
          res = { ok: true, changed: true, added: d.added.length, removed: d.removed.length, changedRows: d.changed.length, count: items.length };
        } else res = { ok: true, changed: true, first: true, count: items.length };
        stage = 'history';
        // an existing table file that cannot be parsed, or has no rows array, is never silently overwritten: a copy is
        // kept beside it as <table>.json.corrupt-<readAt> before the replace (it cannot be diffed, so no change line)
        const corrupt = prevFile === undefined || (!!prevFile && !prevRows);
        if (corrupt) { copyFileSync(file, `${file}.corrupt-${readAt}`); res.replacedCorrupt = true; }
        else if (prevFile) copyIntoHistory(out, name, file, prevFile.readAt);
        stage = 'replace';
        atomicWrite(file, text);
        wrote++;
        stage = 'log';
        if (changeLine) appendLine(join(out, 'changes.jsonl'), changeLine);
        results[name] = res;
        tablesIdx[name] = { ok: true, count: items.length, sha256: digest, readAt, ...dupField, ...(corrupt ? { replacedCorrupt: true } : {}) };
      } catch (e) {
        const c = errCode(e, rpcUrl);
        failed++;
        if (stage !== 'prepare') touched++;
        const msg = `${stage}: ${c.code} ${c.message}`.slice(0, 200);
        if (stage === 'log') {
          // the table file IS replaced; only its change line is missing, and the next run rebuilds it from history
          tablesIdx[name] = { ok: false, error: 'WRITE_FAILED', message: msg, logPending: true, count: items.length, sha256: digest, readAt };
        } else {
          const disk = prevRows ? { count: prevRows.length, sha256: sha(JSON.stringify(prevRows)) } : {};
          tablesIdx[name] = { ok: false, error: 'WRITE_FAILED', message: msg, keptPrevious: !!existsSync(file), ...disk };
        }
        results[name] = { ok: false, error: 'WRITE_FAILED', stage };
        log(`${name}: WRITE_FAILED at ${stage}: ${c.code}`);
      }
    }

    // nothing was even attempted to write and every table failed: no index (the old one stays true)
    if (failed === names.length && wrote === 0 && touched === 0 && names.every((n) => results[n] && !results[n].ok)) return { code: 1, error: 'every table failed', results };
    const index = { takenAt: readAt, epoch, rpc: hostOf(rpcUrl), tables: Object.fromEntries(Object.keys(tablesIdx).sort().map((k) => [k, tablesIdx[k]])) };
    try { atomicWrite(join(out, 'index.json'), JSON.stringify(index, null, 1)); } catch (e) {
      const c = errCode(e, rpcUrl);
      log(`index.json not written: ${c.code}`);
      return { code: 2, error: 'index not written', detail: c, results, wrote, failed: failed + 1, reconciled, out };
    }
    return { code: failed ? 2 : 0, results, wrote, failed, reconciled, out };
  } finally {
    lock.release();
    if (lazyCtx && lazyCtx.dispose) { try { await lazyCtx.dispose(); } catch { /* best effort */ } }
  }
}

// ---------------------------------------------------------------- CLI
function parseArgs(argv) {
  const o = {};
  const csv = (s) => (s || '').split(',').map((x) => x.trim()).filter(Boolean);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') o.out = argv[++i];
    else if (a === '--only') o.only = csv(argv[++i]);
    else if (a === '--accept-empty') o.acceptEmpty = csv(argv[++i]);
    else throw new Error(`unknown argument: ${a}`);
  }
  if (o.out === undefined && argv.includes('--out')) throw new Error('--out needs a directory');
  return o;
}
const isMain = process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (isMain) {
  let code = 1;
  try {
    const opts = parseArgs(process.argv.slice(2));
    const r = await snapshot(opts, { log: (...a) => console.log('[config-snapshot]', ...a) });
    if (r.error) console.log(r.code === 1 ? '[config-snapshot] nothing written:' : '[config-snapshot] problem:', r.error, r.detail ? JSON.stringify(r.detail) : '');
    for (const [n, x] of Object.entries(r.results || {})) console.log(`  ${n.padEnd(26)} ${x.ok ? (x.changed ? (x.first ? 'first ' : `changed +${x.added} -${x.removed} ~${x.changedRows} `) : 'unchanged ') + x.count : 'FAILED ' + x.error + (x.stage ? ' at ' + x.stage : '')}`);
    if (r.reconciled && r.reconciled.length) console.log('  change lines rebuilt after an interrupted run:', r.reconciled.join(', '));
    code = r.code;
  } catch (e) { console.log('[config-snapshot] ERROR', scrubText(e && e.message, process.env.C4_RPC_URL || DEFAULT_RPC)); }
  process.exit(code);
}
