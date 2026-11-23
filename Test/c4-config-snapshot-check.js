// Offline check of Tools/c4-live/config-snapshot.mjs: fake chain reads, temp dirs, no network.
//   node Test/c4-config-snapshot-check.js          the checks against the real tool
//   node Test/c4-config-snapshot-check.js --neg    each rule against a mutant of the tool: every mutant must FAIL a check
// Prints "N passed, M failed"; exit 0 when none failed (in --neg: when every mutant was caught), else 1.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');
const { spawnSync } = require('child_process');

const REAL_TOOL = path.join(__dirname, '..', 'Tools', 'c4-live', 'config-snapshot.mjs');
const TOOL = process.env.CS_TOOL || REAL_TOOL;

// ------------------------------------------------------------------ --neg: run this file against mutants
const MUTANTS = [
  ['M01 rows not sorted', 'items.sort((a, b) =>', 'items.sort((a, b) => 0 &&'],
  ['M02 bigint kept as a number', "if (t === 'bigint') return v.toString();", "if (t === 'bigint') return Number(v);"],
  ['M03 cargo name not added', 'node.cargo = n;', ';'],
  ['M04 unchanged table rewritten', 'if (prevDigest === digest) {', 'if (false) {'],
  ['M05 changed fields not diffed', 'if (!oi) continue;\n    const a = new Map()', 'continue;\n    const a = new Map()'],
  ['M06 removed rows not listed', 'for (const oi of oldItems) if (oldOnly.has(oi)) removed.push(oi.ukey);', ';'],
  ['M07 failed read marked ok', '{ ok: false, error: c.code, message', '{ ok: true, error: c.code, message'],
  ['M08 empty-after-rows accepted', 'rows.length === 0 && prevCount > 0 && !acceptEmpty.has(name)', 'false'],
  ['M09 epoch failure ignored', "return { code: 1, error: 'epoch', detail: c };", "epoch = { genesis: 'x', sage: null };"],
  ['M10 rpc written as full url', 'rpc: hostOf(rpcUrl)', 'rpc: rpcUrl'],
  ['M11 error text keeps urls', ".replace(/https?:\\/\\/\\S+/gi, '<url>')", ''],
  ['M12 write not via temp file', 'const tmp = `${path}.tmp-${process.pid}`;\n  try {', 'const tmp = path;\n  try {'],
  ['M13 no history copy', 'if (prevFile) copyIntoHistory', 'if (false) copyIntoHistory'],
  ['M14 change log not written', 'if (changeLine) appendLine', 'if (false) appendLine'],
  ['M15 no retry', 'return await fn();\n    }\n  };', 'throw e1;\n    }\n  };'],
  ['M16 volatile fields kept', 'if (segs.length === 1) { delete node[key]; return; }', 'if (segs.length === 1) { return; }'],
  ['M17 keyField ignored', 'if (keyField &&', 'if (false &&'],
  ['M18 rpc url kept in error text', 'if (rpcUrl) {\n    const parts', 'if (false) {\n    const parts'],
  ['M19 unknown table accepted', 'if (!safeName(n) || !Object.hasOwn(defs, n))', 'if (false)'],
  ['M20 index forgets other tables', 'const tablesIdx = prevIndex && typeof prevIndex.tables === \'object\' && prevIndex.tables ? { ...prevIndex.tables } : {};', 'const tablesIdx = {};'],
  // fix round 2026-11-22
  ['M21 a write failure aborts the run', 'log(`${name}: WRITE_FAILED at ${stage}: ${c.code}`);', 'throw e;'],
  ['M22 change line before the table file', "stage = 'replace';\n        atomicWrite(file, text);\n        wrote++;\n        stage = 'log';\n        if (changeLine) appendLine(join(out, 'changes.jsonl'), changeLine);", "stage = 'replace';\n        if (changeLine) appendLine(join(out, 'changes.jsonl'), changeLine);\n        atomicWrite(file, text);\n        wrote++;\n        stage = 'log';"],
  ['M23 index entry of a failed write has no on-disk values', 'keptPrevious: !!existsSync(file), ...disk };', 'keptPrevious: !!existsSync(file) };'],
  ['M24 lost change lines not rebuilt', 'if (rebuildChangeLine(out, name, defs[name].keyField, entries))', 'if (false)'],
  ['M25 nested drop does not descend into arrays', 'if (Array.isArray(child)) for (const el of child) dropAt(el, segs.slice(1));', ';'],
  ['M26 reserves dropped whole', "'reserves[].quantityRaw'], keyField", "'reserves'], keyField"],
  ['M27 duplicate keys paired by position only', 'const j = oLeft.findIndex((oi) => oi.js === ni.js);', 'const j = -1;'],
  ['M28 duplicateKeys not recorded', 'const dupField = duplicateKeys > 0 ? { duplicateKeys } : {};', 'const dupField = {};'],
  ['M29 rpc url path kept in error text', "for (const s of [...parts].filter((x) => x && x.length >= 3).sort((a, b) => b.length - a.length)) msg = msg.split(s).join('<url>');", "if (parts.has(rpcUrl)) msg = msg.split(rpcUrl).join('<url>');"],
  ['M30 cli prints the raw error', "console.log('[config-snapshot] ERROR', scrubText(e && e.message, process.env.C4_RPC_URL || DEFAULT_RPC));", "console.log('[config-snapshot] ERROR', e.message);"],
  ['M31 release removes any lock', "if (f.readFileSync(p, 'utf8') === mine) f.unlinkSync(p);", 'f.unlinkSync(p);'],
  ['M32 stale takeover without a re-check', "if (f.readFileSync(p, 'utf8') !== seen || f.now() - f.statSync(p).mtimeMs <= LOCK_STALE_MS) return null;", ''],
  ['M33 lock not verified after the write', 'return held === mine ? { release, token: mine } : null;', 'return { release, token: mine };'],
  ['M34 a fresh lock counts as stale', 'const LOCK_STALE_MS = 30 * 60_000;', 'const LOCK_STALE_MS = 0;'],
  ['M35 append joins a partial last line', "if (b[0] !== 10) lead = '\\n';", ';'],
  ['M36 reader counts a bad line as nothing', '} catch { skipped++; }', '} catch { /* silent */ }'],
  ['M37 history copy not reused', 'if (readFileSync(hp).equals(readFileSync(file))) return hp;', ''],
  ['M38 rebuild repeats an existing line', 'if (entries.some((c) => c.table === name && c.at === cur.readAt)) return false;', ''],
  ['M39 no index when every write failed', 'wrote === 0 && touched === 0 &&', 'wrote === 0 &&'],
];
if (process.argv.includes('--neg')) {
  const src = fs.readFileSync(REAL_TOOL, 'utf8');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cs-neg-'));
  let bad = 0;
  for (const [label, from, to] of MUTANTS) {
    const n = src.split(from).length - 1;
    if (n !== 1) { console.log(`BAD  ${label}: pattern found ${n} times (need exactly 1)`); bad++; continue; }
    const f = path.join(dir, 'mut.mjs');
    fs.writeFileSync(f, src.replace(from, () => to));
    const r = spawnSync(process.execPath, [__filename], { env: { ...process.env, CS_TOOL: f }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    const fails = (r.stdout.match(/^FAIL /gm) || []).length;
    const first = (r.stdout.match(/^FAIL (.*)$/m) || [])[1] || (r.stderr || '').split('\n')[0];
    if (r.status === 0) { console.log(`BAD  ${label}: SURVIVED (no check failed)`); bad++; } else console.log(`ok   ${label}: ${fails} check(s) fail, e.g. ${String(first).slice(0, 80)}`);
  }
  // positive control: the unmodified tool passes
  const r0 = spawnSync(process.execPath, [__filename], { env: { ...process.env, CS_TOOL: REAL_TOOL }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (r0.status !== 0) { console.log('BAD  control: the unmodified tool fails its own check'); bad++; } else console.log('ok   control: the unmodified tool passes');
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`${MUTANTS.length} mutants, ${bad} problem(s)`);
  process.exit(bad ? 1 : 0);
}

// ------------------------------------------------------------------ harness
let pass = 0, fail = 0;
const ok = (label, cond, detail) => { if (cond) pass++; else { fail++; console.log(`FAIL ${label}${detail === undefined ? '' : ' :: ' + String(detail).slice(0, 300)}`); } };
const tmpDirs = [];
const mk = () => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'cs-chk-')); tmpDirs.push(d); return d; };
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const readJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const rdS = (p) => { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } };
const GEN = 'G'.repeat(44);
const identity = (x) => x;

// fake tables: the real tool's table-def shape (read is never called: deps.read answers)
const DEFS = {
  cargo: { rows: identity },
  claim_stake_buildings: { rows: identity },
  recipes: { rows: identity, drop: ['usageCountRaw'] },
  king_systems: { rows: identity, keyField: 'systemId' },
};
const baseRaw = () => ({
  cargo: [{ id: 5, name: 'Iron Ore', mint: 'm5' }, { id: 6, name: 'Copper', mint: 'm6' }, { id: 7, name: 'Zinc', mint: 'm7' }],
  claim_stake_buildings: [
    { id: 2, name: 'Mine B', constructionCost: [{ cargoId: 6, quantityRaw: 20n }], resourceExtraction: [{ cargoId: 5, rate: { raw: 1000n, value: 0.5 } }] },
    { id: 1, name: 'Mine A', constructionCost: [{ cargoId: 5, quantityRaw: 10n }], resourceExtraction: [{ cargoId: 5, rate: { raw: 2000n, value: 1 } }] },
    { id: 3, name: 'Mine C', constructionCost: [], resourceExtraction: [] },
  ],
  recipes: [{ id: 1, name: 'R1', usageCountRaw: 4n, ingredients: [{ cargoId: 7, quantityRaw: 2n }] }, { id: 2, name: 'R2', usageCountRaw: 9n, ingredients: [] }],
  king_systems: [{ systemId: 30, factionId: 2, system: { address: 'aa' } }, { systemId: 10, factionId: 1, system: { address: 'bb' } }],
});
const clone = (o) => JSON.parse(JSON.stringify(o, (k, v) => (typeof v === 'bigint' ? { __b: v.toString() } : v)), (k, v) => (v && typeof v === 'object' && '__b' in v ? BigInt(v.__b) : v));
let clock = 1000;
const mkDeps = (raw, extra = {}) => ({
  tables: extra.tables || DEFS,
  epoch: extra.epoch || (async () => ({ genesis: GEN, sage: 77 })),
  read: Object.fromEntries(Object.keys(raw).map((k) => [k, async () => raw[k]])),
  sleep: async () => {},
  now: () => clock,
  rpcUrl: extra.rpcUrl || 'https://rpc.example.test',
  ...(extra.more || {}),
});

(async () => {
  const T = await import(pathToFileURL(TOOL).href);
  const snap = (out, raw, extra, opts) => T.snapshot({ out, ...(opts || {}) }, mkDeps(raw, extra));

  // ---- canonical form
  const c = T.canon({ z: 1n, a: { value: 1.5, raw: 3n }, arr: [2n, { y: 1, x: undefined }], t: { toJSON() { return { q: 9n }; } }, u: undefined });
  ok('canon bigint -> decimal string', c.z === '1');
  ok('canon keeps {raw,value} (bigint raw as string)', JSON.stringify(c.a) === '{"raw":"3","value":1.5}', JSON.stringify(c.a));
  ok('canon sorts object keys', Object.keys(c).join() === 'a,arr,t,z', Object.keys(c).join());
  ok('canon uses toJSON and drops undefined', JSON.stringify(c.t) === '{"q":"9"}' && !('u' in c) && JSON.stringify(c.arr[1]) === '{"y":1}', JSON.stringify(c));

  // ---- first run, ordering, cargo names
  const o1 = mk(), o2 = mk();
  const raw1 = baseRaw();
  clock = 1000;
  const r1 = await snap(o1, raw1);
  ok('first run exits 0', r1.code === 0, JSON.stringify(r1));
  const shuffled = baseRaw();
  for (const k of Object.keys(shuffled)) shuffled[k].reverse();
  clock = 1000;
  const r2 = await snap(o2, shuffled);
  ok('shuffled input: run ok', r2.code === 0);
  for (const f of ['cargo', 'claim_stake_buildings', 'recipes', 'king_systems']) {
    ok(`shuffled input gives the same bytes: ${f}`, fs.readFileSync(path.join(o1, f + '.json'), 'utf8') === fs.readFileSync(path.join(o2, f + '.json'), 'utf8'));
  }
  const cs1 = readJ(path.join(o1, 'claim_stake_buildings.json'));
  ok('rows sorted by id', cs1.rows.map((r) => r.id).join() === '1,2,3', cs1.rows.map((r) => r.id).join());
  ok('doc shape: table, readAt, epoch, count', cs1.table === 'claim_stake_buildings' && cs1.readAt === 1000 && cs1.epoch.genesis === GEN && cs1.epoch.sage === 77 && cs1.count === 3);
  ok('bigint written as decimal string', cs1.rows[1].constructionCost[0].quantityRaw === '20', JSON.stringify(cs1.rows[1].constructionCost));
  ok('{raw,value} written as it is', JSON.stringify(cs1.rows[0].resourceExtraction[0].rate) === '{"raw":"2000","value":1}', JSON.stringify(cs1.rows[0].resourceExtraction[0].rate));
  ok('cargo name added next to cargoId (cost)', cs1.rows[0].constructionCost[0].cargoId === 5 && cs1.rows[0].constructionCost[0].cargo === 'Iron Ore', JSON.stringify(cs1.rows[0].constructionCost));
  ok('cargo name added next to cargoId (extraction)', cs1.rows[1].resourceExtraction[0].cargo === 'Iron Ore');
  const kg = readJ(path.join(o1, 'king_systems.json'));
  ok('keyField orders king_systems by systemId', kg.rows.map((r) => r.systemId).join() === '10,30', kg.rows.map((r) => r.systemId).join());
  const rc = readJ(path.join(o1, 'recipes.json'));
  ok('volatile field dropped, listed in the file', !('usageCountRaw' in rc.rows[0]) && rc.dropped.join() === 'usageCountRaw');
  const ix = readJ(path.join(o1, 'index.json'));
  ok('index: takenAt, epoch, rpc, tables', ix.takenAt === 1000 && ix.epoch.genesis === GEN && ix.rpc === 'rpc.example.test' && ix.tables.cargo.ok === true && ix.tables.cargo.count === 3 && /^[0-9a-f]{64}$/.test(ix.tables.cargo.sha256), JSON.stringify(ix).slice(0, 300));
  ok('first run: no changes.jsonl, no history', !fs.existsSync(path.join(o1, 'changes.jsonl')) && fs.readdirSync(path.join(o1, 'history')).length === 0);

  // ---- no-change run writes nothing
  const past = new Date('2020-01-01T00:00:00Z');
  for (const f of fs.readdirSync(o1).filter((x) => x.endsWith('.json') && x !== 'index.json')) fs.utimesSync(path.join(o1, f), past, past);
  const before = Object.fromEntries(fs.readdirSync(o1).filter((x) => x.endsWith('.json') && x !== 'index.json').map((f) => [f, fs.readFileSync(path.join(o1, f), 'utf8')]));
  clock = 2000;
  // usageCountRaw moves: still "no change"
  const raw1b = baseRaw(); raw1b.recipes[0].usageCountRaw = 99n;
  const r3 = await snap(o1, raw1b);
  ok('no-change run exits 0', r3.code === 0, JSON.stringify(r3));
  for (const f of Object.keys(before)) {
    ok(`no-change run leaves ${f} untouched (mtime + bytes)`, fs.statSync(path.join(o1, f)).mtimeMs === past.getTime() && fs.readFileSync(path.join(o1, f), 'utf8') === before[f]);
  }
  ok('no-change run: no changes.jsonl, no history file', !fs.existsSync(path.join(o1, 'changes.jsonl')) && fs.readdirSync(path.join(o1, 'history')).length === 0);
  const ix2 = readJ(path.join(o1, 'index.json'));
  ok('no-change run: index takenAt moves, unchangedSince = first readAt', ix2.takenAt === 2000 && ix2.tables.cargo.unchangedSince === 1000 && ix2.tables.cargo.readAt === 2000, JSON.stringify(ix2.tables.cargo));

  // ---- diff: added, removed, nested change
  const raw2 = baseRaw();
  raw2.claim_stake_buildings = raw2.claim_stake_buildings.filter((r) => r.id !== 3);               // removed 3
  raw2.claim_stake_buildings.find((r) => r.id === 1).resourceExtraction[0].rate.raw = 2500n;       // nested change
  raw2.claim_stake_buildings.push({ id: 4, name: 'Mine D', constructionCost: [], resourceExtraction: [] }); // added 4
  clock = 3000;
  const r4 = await snap(o1, raw2);
  ok('diff run exits 0', r4.code === 0, JSON.stringify(r4));
  const ch = rdS(path.join(o1, 'changes.jsonl')).trim().split('\n').map((l) => JSON.parse(l));
  ok('exactly one change entry (only the changed table)', ch.length === 1 && ch[0].table === 'claim_stake_buildings', JSON.stringify(ch).slice(0, 200));
  const e = ch[0] || {};
  ok('entry: at, fromEpoch, toEpoch', e.at === 3000 && e.fromEpoch && e.fromEpoch.genesis === GEN && e.toEpoch && e.toEpoch.sage === 77);
  ok('entry: added [4]', JSON.stringify(e.added) === '[4]', JSON.stringify(e.added));
  ok('entry: removed [3]', JSON.stringify(e.removed) === '[3]', JSON.stringify(e.removed));
  ok('entry: changed row 1 with nested path, from and to', e.changed && e.changed.length === 1 && e.changed[0].key === 1 && e.changed[0].name === 'Mine A' &&
    JSON.stringify(e.changed[0].fields) === '[{"path":"resourceExtraction[0].rate.raw","from":"2000","to":"2500"}]', JSON.stringify(e.changed));
  const hist = fs.readdirSync(path.join(o1, 'history'));
  ok('previous file moved to history/<table>.<previous readAt>.json', hist.join() === 'claim_stake_buildings.1000.json', hist.join());
  ok('history file holds the OLD rows', readJ(path.join(o1, 'history', 'claim_stake_buildings.1000.json')).rows.length === 3);
  const nowFile = readJ(path.join(o1, 'claim_stake_buildings.json'));
  ok('table file holds the NEW rows', nowFile.readAt === 3000 && nowFile.rows.map((r) => r.id).join() === '1,2,4');
  // epoch change is carried into the entry
  const raw3 = clone(raw2); raw3.claim_stake_buildings.find((r) => r.id === 1).name = 'Mine A2';
  clock = 3500;
  await snap(o1, raw3, { epoch: async () => ({ genesis: GEN, sage: 78 }) });
  const ch2 = rdS(path.join(o1, 'changes.jsonl')).trim().split('\n').map((l) => JSON.parse(l));
  ok('second entry appended, epoch change recorded', ch2.length === 2 && ch2[1].fromEpoch.sage === 77 && ch2[1].toEpoch.sage === 78, JSON.stringify(ch2[1] || {}).slice(0, 200));
  ok('field path for a top-level field', ch2[1] && ch2[1].changed[0].fields.some((f) => f.path === 'name' && f.from === 'Mine A' && f.to === 'Mine A2'));
  // key from keyField appears in the diff
  const raw4 = clone(raw3); raw4.king_systems[0].factionId = 3;
  clock = 3600;
  await snap(o1, raw4);
  const ch3 = rdS(path.join(o1, 'changes.jsonl')).trim().split('\n').map((l) => JSON.parse(l)).pop();
  ok('changed row keyed by keyField (systemId 30)', ch3.table === 'king_systems' && ch3.changed.length === 1 && ch3.changed[0].key === 30, JSON.stringify(ch3.changed));
  ok('keyField key is the systemId number, not a hash', typeof ch3.changed[0].key === 'number', JSON.stringify(ch3.changed[0]));

  // ---- failed read keeps the old file
  const o3 = mk();
  clock = 100; await snap(o3, baseRaw());
  const recipesBefore = fs.readFileSync(path.join(o3, 'recipes.json'), 'utf8');
  let calls = 0;
  const rawF = baseRaw(); rawF.cargo[0].name = 'Iron Ore v2';
  const depsF = mkDeps(rawF);
  depsF.read.recipes = async () => { calls++; const e2 = new Error('boom'); e2.code = 'RPC_DOWN'; throw e2; };
  clock = 200;
  const rF = await T.snapshot({ out: o3 }, depsF);
  ok('failed read: exit 2 (others written)', rF.code === 2, JSON.stringify(rF));
  ok('failed read was retried once (2 calls)', calls === 2, calls);
  ok('failed read keeps the previous file byte for byte', fs.readFileSync(path.join(o3, 'recipes.json'), 'utf8') === recipesBefore);
  const ixF = readJ(path.join(o3, 'index.json'));
  ok('failed read: ok false with the error code, previous count kept', ixF.tables.recipes.ok === false && ixF.tables.recipes.error === 'RPC_DOWN' && ixF.tables.recipes.count === 2, JSON.stringify(ixF.tables.recipes));
  ok('failed read: the other tables were still written', readJ(path.join(o3, 'cargo.json')).readAt === 200 && ixF.tables.cargo.ok === true);
  // positive control for "a table is written": the same table with a good read goes through
  ok('control: a good read of recipes in a later run is written', (clock = 300, (await snap(o3, baseRaw())).code === 0) && readJ(path.join(o3, 'index.json')).tables.recipes.ok === true);
  // retry that succeeds
  let n2 = 0; const depsR = mkDeps(baseRaw()); depsR.read.cargo = async () => { n2++; if (n2 === 1) throw new Error('flaky'); return baseRaw().cargo; };
  const rR = await T.snapshot({ out: mk() }, depsR);
  ok('one failure then success: table ok, exit 0', rR.code === 0 && n2 === 2, JSON.stringify(rR) + ' calls ' + n2);
  // every table fails
  const o3b = mk();
  const depsAll = mkDeps(baseRaw()); for (const k of Object.keys(depsAll.read)) depsAll.read[k] = async () => { throw new Error('down'); };
  const rAll = await T.snapshot({ out: o3b }, depsAll);
  ok('every table failed: exit 1, no table files, no index', rAll.code === 1 && !fs.existsSync(path.join(o3b, 'index.json')) && fs.readdirSync(o3b).filter((x) => x.endsWith('.json')).length === 0, JSON.stringify(rAll).slice(0, 150));

  // ---- empty after non-empty is refused
  const o4 = mk();
  clock = 10; await snap(o4, baseRaw());
  const kBefore = fs.readFileSync(path.join(o4, 'king_systems.json'), 'utf8');
  const rawE = baseRaw(); rawE.king_systems = [];
  clock = 20;
  const rE = await snap(o4, rawE);
  ok('empty-after-rows: exit 2', rE.code === 2, JSON.stringify(rE));
  ok('empty-after-rows: file untouched', fs.readFileSync(path.join(o4, 'king_systems.json'), 'utf8') === kBefore);
  const ixE = readJ(path.join(o4, 'index.json'));
  ok('empty-after-rows: marked EMPTY_READ, ok false', ixE.tables.king_systems.ok === false && ixE.tables.king_systems.error === 'EMPTY_READ', JSON.stringify(ixE.tables.king_systems));
  clock = 30;
  const rE2 = await snap(o4, rawE, undefined, { acceptEmpty: ['king_systems'] });
  ok('--accept-empty writes the empty table', rE2.code === 0 && readJ(path.join(o4, 'king_systems.json')).count === 0, JSON.stringify(rE2));
  ok('--accept-empty: the removal is in the change log', rdS(path.join(o4, 'changes.jsonl')).includes('"table":"king_systems"'));
  const o4b = mk(); clock = 40;
  const rE3 = await snap(o4b, { ...baseRaw(), king_systems: [] });
  ok('empty on a first run is written (nothing to lose)', rE3.code === 0 && readJ(path.join(o4b, 'king_systems.json')).count === 0, JSON.stringify(rE3));

  // ---- epoch failure writes nothing
  const o5 = path.join(mk(), 'never-created');
  let en = 0;
  const rEp = await snap(o5, baseRaw(), { epoch: async () => { en++; throw new Error('no genesis'); } });
  ok('epoch unreadable: exit 1', rEp.code === 1, JSON.stringify(rEp));
  ok('epoch unreadable: retried once, then nothing written (no dir at all)', en === 2 && !fs.existsSync(o5), `calls ${en}`);
  const o5b = mk(); fs.writeFileSync(path.join(o5b, 'cargo.json'), '{"keep":1}');
  await snap(o5b, baseRaw(), { epoch: async () => ({ genesis: '' }) });
  ok('epoch with an empty genesis writes nothing and keeps files', fs.readFileSync(path.join(o5b, 'cargo.json'), 'utf8') === '{"keep":1}' && fs.readdirSync(o5b).length === 1);

  // ---- rpc is host only; no secret in any written file
  const o6 = mk();
  const SECRET = 'SECRETKEY123', SECRETQ = 'QSECRET456';
  const urlWithKey = `https://rpc.example.test:8899/v1/${SECRET}/x?api-key=${SECRETQ}`;
  const depsK = mkDeps(baseRaw(), { rpcUrl: urlWithKey });
  depsK.read.recipes = async () => { const e3 = new Error(`fetch failed for ${urlWithKey} (also https://other.test/p/${SECRET})`); e3.code = 'FETCH'; throw e3; };
  clock = 5; const rK = await T.snapshot({ out: o6 }, depsK);
  const ixK = readJ(path.join(o6, 'index.json'));
  ok('index.rpc is the host only', ixK.rpc === 'rpc.example.test:8899', ixK.rpc);
  ok('failed table message does not carry the url', ixK.tables.recipes.ok === false && !/SECRET/.test(JSON.stringify(ixK.tables.recipes)), JSON.stringify(ixK.tables.recipes));
  const leaks = walk(o6).filter((f) => { const t = fs.readFileSync(f, 'utf8'); return t.includes(SECRET) || t.includes(SECRETQ); });
  ok('the key string is in NO written file', leaks.length === 0 && walk(o6).length >= 4, leaks.join());
  ok('control: the scan can see a planted key', (() => { const p = path.join(o6, 'planted.txt'); fs.writeFileSync(p, SECRET); const hit = walk(o6).some((f) => fs.readFileSync(f, 'utf8').includes(SECRET)); fs.unlinkSync(p); return hit; })());
  // an error whose message holds only the secret url, without a code
  const o6b = mk(); const depsK2 = mkDeps(baseRaw(), { rpcUrl: urlWithKey });
  depsK2.read.cargo = async () => { throw new Error(`bad ${urlWithKey}`); };
  await T.snapshot({ out: o6b }, depsK2);
  ok('error text with the rpc url is cleaned (cargo failure path)', walk(o6b).every((f) => !fs.readFileSync(f, 'utf8').includes(SECRET)) && walk(o6b).length > 0);

  // an rpc url that is not parseable as a url (no scheme): the exact string is still scrubbed from error text
  const o6c = mk(); const bare = 'rpc.example.test/v1/BARESECRET789';
  const depsK3 = mkDeps(baseRaw(), { rpcUrl: bare });
  depsK3.read.recipes = async () => { throw new Error(`socket hang up at ${bare}`); };
  await T.snapshot({ out: o6c }, depsK3);
  const ixK3 = readJ(path.join(o6c, 'index.json'));
  ok('scheme-less rpc url: index.rpc is a placeholder, error text scrubbed', ixK3.rpc === 'custom' && ixK3.tables.recipes.ok === false && walk(o6c).every((f) => !fs.readFileSync(f, 'utf8').includes('BARESECRET789')), JSON.stringify(ixK3.tables.recipes));

  // ---- atomic write: a write that throws midway leaves the old file intact
  const o7 = mk();
  clock = 1; await snap(o7, baseRaw());
  const oldBytes = rdS(path.join(o7, 'recipes.json'));
  const raw7 = baseRaw(); raw7.recipes[0].name = 'changed';
  const realWrite = fs.writeFileSync, realRename = fs.renameSync;
  const sync = require('module').syncBuiltinESMExports;
  const hurt = async (what, patch) => {
    patch(); sync();
    clock = 2;
    let threw = false, res;
    try { res = await snap(o7, raw7); } catch { threw = true; } finally { fs.writeFileSync = realWrite; fs.renameSync = realRename; sync(); }
    return { threw, res };
  };
  const t1 = await hurt('half write', () => { fs.writeFileSync = (p, d, ...a) => { if (String(p).includes('recipes.json') && !String(p).includes('history')) { realWrite(p, String(d).slice(0, 10)); throw new Error('disk full'); } return realWrite(p, d, ...a); }; });
  ok('write throws midway: the run does not throw, it reports exit 2 with that table WRITE_FAILED', t1.threw === false && t1.res && t1.res.code === 2 && t1.res.results.recipes.error === 'WRITE_FAILED', JSON.stringify(t1));
  ok('write throws midway: old recipes.json intact', rdS(path.join(o7, 'recipes.json')) === oldBytes);
  ok('write throws midway: no temp file left behind', walk(o7).every((f) => !/\.tmp-/.test(f)), walk(o7).filter((f) => /\.tmp-/.test(f)).join());
  const t2 = await hurt('rename', () => { fs.renameSync = (a, b) => { if (String(b).endsWith('recipes.json')) throw new Error('locked'); return realRename(a, b); }; });
  ok('rename fails: WRITE_FAILED, old file intact, no temp left', t2.threw === false && t2.res.results.recipes.error === 'WRITE_FAILED' && rdS(path.join(o7, 'recipes.json')) === oldBytes && walk(o7).every((f) => !/\.tmp-/.test(f)));
  clock = 3; const rAfter = await snap(o7, raw7);
  ok('control: the same change goes through once the disk is fine', rAfter.code === 0 && readJ(path.join(o7, 'recipes.json')).rows[0].name === 'changed', JSON.stringify(rAfter));

  // ---- --only keeps the other tables in the index; unknown names are refused
  const o8 = mk();
  clock = 7; await snap(o8, baseRaw());
  clock = 8; const rO = await snap(o8, baseRaw(), undefined, { only: ['cargo'] });
  const ixO = readJ(path.join(o8, 'index.json'));
  ok('--only: other tables stay in the index', rO.code === 0 && Object.keys(ixO.tables).length === 4 && ixO.tables.recipes.ok === true, Object.keys(ixO.tables).join());
  const rU = await snap(mk(), baseRaw(), undefined, { only: ['../evil'] });
  ok('table name with a separator is refused', rU.code === 1 && /unknown table/.test(rU.error || ''), JSON.stringify(rU));
  const rU2 = await snap(mk(), baseRaw(), undefined, { only: ['nosuchtable'] });
  ok('unknown table name is refused', rU2.code === 1, JSON.stringify(rU2));

  // ================================================================== fix round 2026-11-22
  const sha256 = (s) => require('crypto').createHash('sha256').update(s).digest('hex');
  const sync2 = require('module').syncBuiltinESMExports;
  const scenario = async (label, fn) => { try { await fn(); } catch (e) { fail++; console.log(`FAIL ${label} :: threw ${String(e && e.message || e).slice(0, 200)}`); } };
  const patchFs = async (patch, fn) => { // run fn with fs functions patched, always restored
    const saved = { rename: fs.renameSync, write: fs.writeFileSync, append: fs.appendFileSync };
    patch(saved); sync2();
    try { return await fn(); } finally { fs.renameSync = saved.rename; fs.writeFileSync = saved.write; fs.appendFileSync = saved.append; sync2(); }
  };
  const changedRaw = () => { const r = baseRaw(); r.cargo[0].name = 'Iron Ore v2'; r.claim_stake_buildings[0].name = 'B2'; r.recipes[0].name = 'R1b'; r.king_systems[0].factionId = 3; return r; };
  const TBL = ['cargo', 'claim_stake_buildings', 'recipes', 'king_systems'];
  const logTables = (o) => rdS(path.join(o, 'changes.jsonl')).split('\n').filter((l) => l.trim()).map((l) => { try { return JSON.parse(l).table; } catch { return '?'; } });

  // ---- 1. one write failure does not abort the run
  await scenario('write failure: table path is a directory', async () => {
    const o = mk(); clock = 100; await snap(o, baseRaw());
    const bp = path.join(o, 'claim_stake_buildings.json');
    fs.rmSync(bp); fs.mkdirSync(bp); fs.writeFileSync(path.join(bp, 'x'), 'x');
    clock = 200; const r = await snap(o, changedRaw());
    const ixw = readJ(path.join(o, 'index.json'));
    ok('write failure: run returns exit 2 (does not throw)', r.code === 2 && r.results.claim_stake_buildings.error === 'WRITE_FAILED', JSON.stringify(r).slice(0, 200));
    ok('write failure: the tables before AND after it were written', ['cargo', 'recipes', 'king_systems'].every((t) => readJ(path.join(o, t + '.json')).readAt === 200), '');
    ok('write failure: index.json is fresh and says which table failed', ixw.takenAt === 200 && ixw.tables.claim_stake_buildings.ok === false && ixw.tables.claim_stake_buildings.error === 'WRITE_FAILED' && ixw.tables.recipes.readAt === 200 && ixw.tables.recipes.ok === true, JSON.stringify(ixw.tables.claim_stake_buildings));
    ok('write failure: no change line for the table that was not written; lines for the others', !logTables(o).includes('claim_stake_buildings') && ['cargo', 'recipes', 'king_systems'].every((t) => logTables(o).includes(t)), logTables(o).join());
    ok('write failure: lock released', !fs.existsSync(path.join(o, '.lock')));
  });
  await scenario('write failure: rename of one table fails (file in use)', async () => {
    const o = mk(); clock = 100; await snap(o, baseRaw());
    const bp = path.join(o, 'claim_stake_buildings.json'), bOld = fs.readFileSync(bp, 'utf8');
    const oldRows = JSON.parse(bOld).rows;
    clock = 200;
    const r = await patchFs((s) => { fs.renameSync = (a, b) => { if (/claim_stake_buildings\.json$/.test(String(b))) throw new Error('EPERM: file in use'); return s.rename(a, b); }; }, () => snap(o, changedRaw()));
    const ixr = readJ(path.join(o, 'index.json'));
    ok('rename fails: exit 2, old file byte for byte, no temp file', r.code === 2 && fs.readFileSync(bp, 'utf8') === bOld && walk(o).every((f) => !/\.tmp-/.test(f)), JSON.stringify(r).slice(0, 150));
    ok('rename fails: NO change line for it (the log never runs ahead of the file)', !logTables(o).includes('claim_stake_buildings') && logTables(o).includes('recipes'), logTables(o).join());
    const eb = ixr.tables.claim_stake_buildings;
    ok('rename fails: index entry describes the file on disk (old count and sha256, kept)', eb.ok === false && eb.error === 'WRITE_FAILED' && eb.keptPrevious === true && eb.count === 3 && eb.sha256 === sha256(JSON.stringify(oldRows)), JSON.stringify(eb));
    clock = 300; const r3 = await snap(o, changedRaw());
    ok('rename fixed: the next run writes it, ONE change line, history copy reused (no duplicate)', r3.code === 0 && readJ(bp).readAt === 300 && logTables(o).filter((t) => t === 'claim_stake_buildings').length === 1 && fs.readdirSync(path.join(o, 'history')).filter((f) => /^claim_stake_buildings\./.test(f)).join() === 'claim_stake_buildings.100.json', fs.readdirSync(path.join(o, 'history')).join());
  });
  await scenario('write failure: every table fails to replace', async () => {
    const o = mk(); clock = 100; await snap(o, baseRaw());
    clock = 200;
    const r = await patchFs((s) => { fs.renameSync = (a, b) => { if (/[\\/](cargo|claim_stake_buildings|recipes|king_systems)\.json$/.test(String(b))) throw new Error('EPERM'); return s.rename(a, b); }; }, () => snap(o, changedRaw()));
    const ixa = readJ(path.join(o, 'index.json'));
    ok('all replaces fail: exit 2 and a fresh index naming each table', r.code === 2 && ixa.takenAt === 200 && TBL.every((t) => ixa.tables[t].ok === false && ixa.tables[t].error === 'WRITE_FAILED'), JSON.stringify(r).slice(0, 150));
  });
  await scenario('write failure: crash after the table file, partial change line', async () => {
    const ref = mk(); clock = 100; await snap(ref, baseRaw()); clock = 200; await snap(ref, changedRaw());
    const refEntries = T.readChanges(ref).entries;
    const o = mk(); clock = 100; await snap(o, baseRaw());
    clock = 200; let first = true;
    const r = await patchFs((s) => { fs.appendFileSync = (p, d, ...a) => { if (/changes\.jsonl$/.test(String(p))) { if (first) { first = false; s.append(p, String(d).slice(0, 25)); } throw new Error('killed'); } return s.append(p, d, ...a); }; }, () => snap(o, changedRaw()));
    const ixc = readJ(path.join(o, 'index.json'));
    ok('log fails after replace: files ARE replaced, index says so (logPending, new sha256)', r.code === 2 && TBL.every((t) => readJ(path.join(o, t + '.json')).readAt === 200 && ixc.tables[t].logPending === true && ixc.tables[t].sha256 === sha256(JSON.stringify(readJ(path.join(o, t + '.json')).rows))), JSON.stringify(ixc.tables.recipes));
    ok('log fails: only a partial line is in changes.jsonl', T.readChanges(o).entries.length === 0 && T.readChanges(o).skipped === 1);
    clock = 300; const r3 = await snap(o, changedRaw());
    const got = T.readChanges(o);
    ok('next run rebuilds every lost change line from history (exit 0, tables named)', r3.code === 0 && (r3.reconciled || []).slice().sort().join() === TBL.slice().sort().join(), JSON.stringify(r3.reconciled));
    ok('rebuilt lines are identical to the lines a normal run writes', JSON.stringify(got.entries) === JSON.stringify(refEntries) && got.entries.length === 4, got.entries.length);
    ok('the partial line is skipped and counted, not joined onto a rebuilt line', got.skipped === 1);
    clock = 400; await snap(o, changedRaw());
    ok('a third run does not append the lines again', T.readChanges(o).entries.length === 4 && T.readChanges(o).skipped === 1);
    clock = 400; await snap(ref, changedRaw());
    ok('control: a normal two-run history gets no rebuild on a later run', T.readChanges(ref).entries.length === 4);
  });

  // ---- 2. nested drops
  const TDEF = { cargo: { rows: identity }, treas: { rows: identity, drop: ['atlasBalanceRaw', 'reserves[].quantityRaw'], keyField: 'factionId' } };
  const treasRaw = (qty, floor) => ({ cargo: baseRaw().cargo, treas: [{ factionId: 1, atlasBalanceRaw: 5n, epochLength: 7, reserves: [{ cargoId: 5, floorRaw: floor, quantityRaw: qty }, { cargoId: 6, floorRaw: 0n, quantityRaw: qty }] }] });
  await scenario('nested drop', async () => {
    const o = mk(); clock = 10; const raw = treasRaw(99n, 10n);
    const r = await snap(o, raw, { tables: TDEF });
    const t = readJ(path.join(o, 'treas.json'));
    ok('nested drop: the state field is gone from every array element', r.code === 0 && t.rows[0].reserves.length === 2 && t.rows[0].reserves.every((x) => !('quantityRaw' in x)), JSON.stringify(t.rows[0]));
    ok('nested drop: the config fields stay (floorRaw, cargoId, cargo name)', t.rows[0].reserves[0].floorRaw === '10' && t.rows[0].reserves[0].cargoId === 5 && t.rows[0].reserves[0].cargo === 'Iron Ore', JSON.stringify(t.rows[0].reserves[0]));
    ok('nested drop: top-level drop still works, and `dropped` lists the paths', !('atlasBalanceRaw' in t.rows[0]) && t.dropped.join() === 'atlasBalanceRaw,reserves[].quantityRaw', JSON.stringify(t.dropped));
    ok('nested drop: the caller\'s rows are not modified', raw.treas[0].reserves[0].quantityRaw === 99n);
    clock = 20; const r2 = await snap(o, treasRaw(5n, 10n), { tables: TDEF });
    ok('state-only change (quantityRaw moves): no change line, file untouched', r2.code === 0 && r2.results.treas.changed === false && !fs.existsSync(path.join(o, 'changes.jsonl')) && readJ(path.join(o, 'treas.json')).readAt === 10, JSON.stringify(r2.results.treas));
    clock = 30; await snap(o, treasRaw(5n, 11n), { tables: TDEF });
    const ent = T.readChanges(o).entries;
    ok('control: a floorRaw change IS a change, at its nested path', ent.length === 1 && JSON.stringify(ent[0].changed[0].fields) === '[{"path":"reserves[0].floorRaw","from":"10","to":"11"}]', JSON.stringify(ent).slice(0, 200));
    const bad1 = await snap(mk(), baseRaw(), { tables: { cargo: { rows: identity, drop: ['reserves[]'] } } });
    const bad2 = await snap(mk(), baseRaw(), { tables: { cargo: { rows: identity, drop: ['a..b'] } } });
    ok('a malformed drop path is refused up front', bad1.code === 1 && /bad drop path/.test(bad1.error) && bad2.code === 1, JSON.stringify([bad1, bad2]).slice(0, 200));
    const sample = { factionId: 1, atlasBalance: 5, atlasBalanceRaw: 5n, atlasOutThisEpochRaw: 1n, atlasOutCapPerEpochRaw: 9n, reserves: [{ cargoId: 5, floorRaw: 10n, quantityRaw: 99n }] };
    const dd = T.applyDrops(sample, T.TABLES.faction_treasuries.drop);
    ok('TABLES.faction_treasuries: keeps reserve floors, drops reserve quantities and the balances', dd.reserves.length === 1 && dd.reserves[0].floorRaw === '10' && !('quantityRaw' in dd.reserves[0]) && !('atlasBalance' in dd) && !('atlasOutThisEpochRaw' in dd) && dd.atlasOutCapPerEpochRaw === '9', JSON.stringify(dd));
    ok('applyDrops: missing keys and non-arrays are ignored', JSON.stringify(T.applyDrops({ a: 1 }, ['reserves[].quantityRaw', 'x.y'])) === '{"a":1}' && JSON.stringify(T.applyDrops({ r: { q: 1, k: 2 } }, ['r.q'])) === '{"r":{"k":2}}');
  });

  // ---- 3. duplicate keys
  const DDEF = { cargo: { rows: identity }, dupt: { rows: identity } };
  await scenario('duplicate keys', async () => {
    const o = mk(); const dr = (rows) => ({ cargo: baseRaw().cargo, dupt: rows });
    clock = 1; await snap(o, dr([{ id: 7, v: 'b' }, { id: 7, v: 'c' }]), { tables: DDEF });
    clock = 2; await snap(o, dr([{ id: 7, v: 'b' }, { id: 7, v: 'a' }]), { tables: DDEF });
    const e1 = T.readChanges(o).entries[0] || {};
    ok('duplicate keys: one changed row among two is ONE change with the right from/to', e1.added && e1.added.length === 0 && e1.removed.length === 0 && e1.changed.length === 1 && JSON.stringify(e1.changed[0].fields) === '[{"path":"v","from":"c","to":"a"}]', JSON.stringify(e1).slice(0, 300));
    ok('duplicate keys: the change names both ukeys', e1.changed && e1.changed[0].key === 7 && e1.changed[0].oldKey === '7#2', JSON.stringify(e1.changed && e1.changed[0]).slice(0, 120));
    const ixd = readJ(path.join(o, 'index.json'));
    ok('index records duplicateKeys for the table, and not for a table without them', ixd.tables.dupt.duplicateKeys === 1 && !('duplicateKeys' in ixd.tables.cargo), JSON.stringify(ixd.tables.dupt));
    clock = 3; await snap(o, dr([{ id: 7, v: 'b' }]), { tables: DDEF });
    const e2 = T.readChanges(o).entries[1] || {};
    ok('duplicate keys: one row gone = one removed, nothing changed', e2.removed && e2.removed.length === 1 && e2.added.length === 0 && e2.changed.length === 0, JSON.stringify(e2).slice(0, 200));
    clock = 4; await snap(o, dr([{ id: 7, v: 'b' }, { id: 7, v: 'x' }]), { tables: DDEF });
    const e3 = T.readChanges(o).entries[2] || {};
    ok('duplicate keys: one row more = one added (#2), nothing changed', JSON.stringify(e3.added) === '["7#2"]' && e3.removed.length === 0 && e3.changed.length === 0, JSON.stringify(e3).slice(0, 200));
    clock = 5; await snap(o, dr([{ id: 7, v: 'b' }, { id: 7, v: 'x' }]), { tables: DDEF });
    ok('unchanged table keeps duplicateKeys in the index', readJ(path.join(o, 'index.json')).tables.dupt.duplicateKeys === 1);
  });

  // ---- 4. --only / table names are own properties of the table list
  await scenario('prototype names', async () => {
    for (const nm of ['constructor', 'toString', 'hasOwnProperty', '__proto__']) {
      const o = mk();
      const a = await snap(o, baseRaw(), undefined, { only: [nm] });
      const b = await snap(o, baseRaw(), undefined, { only: ['cargo', nm] });
      const c2 = await snap(o, baseRaw(), undefined, { acceptEmpty: [nm] });
      ok(`table name "${nm}" is refused (only / accept-empty), nothing written`, a.code === 1 && b.code === 1 && c2.code === 1 && !fs.existsSync(path.join(o, 'index.json')), JSON.stringify([a, b, c2]).slice(0, 200));
    }
    const o = mk(); const okRun = await snap(o, baseRaw(), undefined, { only: ['cargo'] });
    ok('control: a real table name is accepted with --only', okRun.code === 0 && Object.keys(readJ(path.join(o, 'index.json')).tables).join() === 'cargo');
  });

  // ---- 5. the rpc url is scrubbed from every printed or written text
  await scenario('url scrub', async () => {
    const RPC = 'https://rpc.example.test/KEY123';
    const o = mk();
    const r = await T.snapshot({ out: o }, { ...mkDeps(baseRaw(), { rpcUrl: RPC }), epoch: async () => { throw new Error('request to rpc.example.test/KEY123 failed, reason: ECONNRESET'); } });
    ok('scheme-less host+path from the rpc url is scrubbed from the epoch error detail (and the reason stays)', r.code === 1 && !/KEY123/.test(JSON.stringify(r.detail)) && /ECONNRESET/.test(r.detail.message), JSON.stringify(r.detail));
    const FULL = 'https://user:PASS99@rpc.example.test:8899/v1/KEY123?api-key=QQ99&x=1';
    const st = (m) => T.scrubText(m, FULL);
    ok('scrubText: path only', !/KEY123/.test(st('GET /v1/KEY123 -> 502')) && /502/.test(st('GET /v1/KEY123 -> 502')), st('GET /v1/KEY123 -> 502'));
    ok('scrubText: query only (with and without ?)', !/QQ99/.test(st('bad ?api-key=QQ99&x=1')) && !/QQ99/.test(st('bad api-key=QQ99&x=1')), st('bad ?api-key=QQ99&x=1'));
    ok('scrubText: userinfo password', !/PASS99/.test(st('auth user:PASS99 failed')), st('auth user:PASS99 failed'));
    ok('scrubText: rpc url given percent-encoded, error text has it decoded', !/KEY123/.test(T.scrubText('at /v1/KEY123', 'https://h.test/v1/K%45Y123')), T.scrubText('at /v1/KEY123', 'https://h.test/v1/K%45Y123'));
    ok('scrubText: a bare "/" path does not mangle other text; plain text without the url is untouched', T.scrubText('a/b/c ECONNRESET', 'https://h.test/') === 'a/b/c ECONNRESET' && T.scrubText('plain error', FULL) === 'plain error');
    ok('scrubText: http urls are still replaced', T.scrubText('see https://other.test/p?k=1 now', RPC) === 'see <url> now');
    const cli = spawnSync(process.execPath, [TOOL, 'rpc.example.test/KEY123'], { env: { ...process.env, C4_RPC_URL: RPC }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    ok('CLI: an argument error carrying the rpc path is scrubbed before printing (and the message is still shown)', cli.status === 1 && !/KEY123/.test(cli.stdout + cli.stderr) && /unknown argument/.test(cli.stdout), cli.stdout.slice(0, 120));
  });

  // ---- 6. lock with a token
  await scenario('lock', async () => {
    const mkLock = (content, ageMs) => { const d = mk(); const p = path.join(d, '.lock'); fs.writeFileSync(p, content); if (ageMs) { const t = new Date(Date.now() - ageMs); fs.utimesSync(p, t, t); } return d; };
    const MIN = 60000;
    const d1 = mkLock('other:tok', 5 * MIN);
    ok('fresh lock is refused and left alone', T.takeLock(d1) === null && rdS(path.join(d1, '.lock')) === 'other:tok');
    const d1b = mkLock('other:tok', 29 * MIN);
    ok('lock 29 min old is still fresh', T.takeLock(d1b) === null);
    const d2 = mkLock('other:tok', 31 * MIN);
    const l2 = T.takeLock(d2, { token: () => 'me:1' });
    ok('stale lock (31 min) is taken over: the file now holds OUR token', l2 && l2.token === 'me:1' && rdS(path.join(d2, '.lock')) === 'me:1');
    const d2b = mk(); fs.writeFileSync(path.join(d2b, '.lock'), 'other:tok');
    const l2b = T.takeLock(d2b, { token: () => 'me:2', now: () => Date.now() + 31 * MIN });
    ok('stale by a fake clock (+31 min): taken over', l2b && rdS(path.join(d2b, '.lock')) === 'me:2');
    const d2c = mk(); fs.writeFileSync(path.join(d2c, '.lock'), 'other:tok');
    ok('fake clock +29 min: refused', T.takeLock(d2c, { now: () => Date.now() + 29 * MIN }) === null);
    // a lock that changes hands between "judged stale" and "taken over" is not taken
    const d3 = mkLock('old:tok', 31 * MIN); let reads = 0, unlinks = 0;
    const l3 = T.takeLock(d3, { readFileSync: (p, e) => { reads++; return reads === 1 ? 'old:tok' : 'new-owner:tok'; }, unlinkSync: (p) => { unlinks++; } });
    ok('lock replaced by another run during takeover: not removed, not taken', l3 === null && unlinks === 0, `unlinks ${unlinks}`);
    const d3c = mkLock('old:tok', 31 * MIN); let un3 = 0;
    ok('control: the same stale lock, unchanged between the two reads, IS taken over (the unlink happens)', T.takeLock(d3c, { unlinkSync: (p) => { un3++; fs.unlinkSync(p); } }) !== null && un3 === 1);
    // the file does not hold our token after the write: not ours
    const d4 = mk(); let rd4 = 0;
    ok('someone else\'s token in the file after our write: the lock is not ours', T.takeLock(d4, { readFileSync: () => { rd4++; return 'someone-else'; } }) === null);
    ok('control: with nothing in the way a fresh dir is taken', T.takeLock(mk()) !== null);
    // exclusive
    const d5 = mk(); const a = T.takeLock(d5), b = T.takeLock(d5);
    ok('two takes on one dir: the second gets null', a && b === null);
    ok('release removes the lock while it holds our token', (a.release(), !fs.existsSync(path.join(d5, '.lock'))));
    const d6 = mk(); const l6 = T.takeLock(d6); fs.writeFileSync(path.join(d6, '.lock'), 'another-run:tok'); l6.release();
    ok('release does NOT remove a lock that changed hands', rdS(path.join(d6, '.lock')) === 'another-run:tok');
    // through snapshot()
    const o = mk(); clock = 50;
    fs.writeFileSync(path.join(o, '.lock'), 'x:y');
    const rl = await snap(o, baseRaw());
    ok('snapshot with a fresh foreign lock: exit 1, nothing written, lock untouched', rl.code === 1 && /lock/.test(rl.error) && rdS(path.join(o, '.lock')) === 'x:y' && !fs.existsSync(path.join(o, 'index.json')));
    const o2 = mk(); fs.writeFileSync(path.join(o2, '.lock'), 'x:y'); const old = new Date(Date.now() - 31 * MIN); fs.utimesSync(path.join(o2, '.lock'), old, old);
    const rs = await snap(o2, baseRaw());
    ok('snapshot over a stale lock: runs, and removes its own lock at the end', rs.code === 0 && !fs.existsSync(path.join(o2, '.lock')));
    const o3 = mk(); const depsL = mkDeps(baseRaw());
    depsL.read.recipes = async () => { fs.writeFileSync(path.join(o3, '.lock'), 'stolen:tok'); return baseRaw().recipes; };
    const r3 = await T.snapshot({ out: o3 }, depsL);
    ok('lock taken by another run mid-run: our unlock leaves it in place', r3.code === 0 && rdS(path.join(o3, '.lock')) === 'stolen:tok');
  });

  // ---- 7. changes.jsonl: partial last line, and its reader
  await scenario('change log', async () => {
    const o = mk(); const p = path.join(o, 'changes.jsonl');
    fs.writeFileSync(p, '{"at":1,"table":"a","added":[],"removed":[],"changed":[]}\n{"at":2,"table":"b","adde');
    T.appendLine(p, '{"at":3,"table":"c","added":[],"removed":[],"changed":[]}');
    const txt = rdS(p);
    const rc = T.readChanges(o);
    ok('truncated last line: the next append starts on its own line', txt.split('\n').length === 4 && txt.endsWith('}\n') && /adde\n\{"at":3/.test(txt), JSON.stringify(txt.slice(-80)));
    ok('readChanges: skips the truncated line, counts it, keeps the other three in order', rc.skipped === 1 && rc.entries.map((e) => e.table).join() === 'a,c', JSON.stringify(rc).slice(0, 200));
    const o2 = mk(); fs.writeFileSync(path.join(o2, 'changes.jsonl'), '\n[1]\nnull\n{"x":1}\n"s"\n{"at":1,"table":"a"}\n');
    const r2 = T.readChanges(o2);
    ok('readChanges: lines that are not entries are skipped and counted; blank lines are not', r2.skipped === 4 && r2.entries.length === 1, JSON.stringify(r2));
    const o3 = mk(); const p3 = path.join(o3, 'changes.jsonl'); T.appendLine(p3, '{"at":1,"table":"a"}'); T.appendLine(p3, '{"at":2,"table":"a"}');
    ok('appendLine: no blank line when the file already ends with a newline; a missing file is created', rdS(p3) === '{"at":1,"table":"a"}\n{"at":2,"table":"a"}\n');
    ok('readChanges on a missing file: nothing, nothing skipped', JSON.stringify(T.readChanges(mk())) === '{"entries":[],"skipped":0}');
    // through a real run: a partial line left by a crash, then a changed table
    const o4 = mk(); clock = 1; await snap(o4, baseRaw());
    fs.writeFileSync(path.join(o4, 'changes.jsonl'), '{"at":0,"table":"zzz","adde');
    clock = 2; await snap(o4, changedRaw());
    const rc4 = T.readChanges(o4);
    ok('a run after a crash mid-append: all four real lines readable, the partial one skipped', rc4.entries.length === 4 && rc4.skipped === 1, JSON.stringify(rc4).slice(0, 150));
  });

  // ---- real table definitions: shapes the real extractors depend on
  ok('TABLES: 18 tables, each with read and rows', Object.keys(T.TABLES).length === 18 && Object.values(T.TABLES).every((d) => typeof d.read === 'function' && typeof d.rows === 'function'), Object.keys(T.TABLES).length);
  ok('TABLES: territory_regions rows = its regions', T.TABLES.territory_regions.rows({ regions: [{ id: 1 }, { id: 2 }], x: 1 }).length === 2);
  ok('TABLES: single object becomes one row', T.TABLES.combat_configuration.rows({ a: 1 }).length === 1);
  ok('rowKey fallbacks: id, address, name, hash', T.rowKey({ id: 3 }) === 3 && T.rowKey({ address: 'ad' }) === 'ad' && T.rowKey({ name: 'n' }) === 'n' && /^h:/.test(T.rowKey({ q: 1 })));

  for (const d of tmpDirs) fs.rmSync(d, { recursive: true, force: true });
  console.log(`${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.log('FAIL harness crashed ::', e && e.stack || e); console.log(`${pass} passed, ${fail + 1} failed`); process.exit(1); });
