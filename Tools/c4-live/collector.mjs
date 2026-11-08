// C4 Live collector - reads the SAGE C4 test realm on z.ink through @aephia/atlas-kit and writes the
// files the C4Live/ tab animates from. Runs hourly (owner rule 2026-11-06): `npm run collect` loops,
// `npm run collect:once` runs one pass (for Task Scheduler).
//
// Output (Data/c4-live/, git-ignored - it changes every hour):
//   latest.json   slim snapshot: fleets, owners, systems, asteroids, stakes, kpis
//   history.json  one KPI point per run (bounded)
//   events.json   combat / destruction / starbase events derived by diffing runs (bounded)
//   owners.json   per-owner series (bounded), for the owner drill-down
//   db.json       the commit point: diff cursor + history + events + owner series in ONE atomic file;
//                 the three served files above are copies of it. (A legacy state.json from the first
//                 version is migrated once, then renamed state.json.migrated.)
//
// The chain keeps no combat log and no mining history, so both are DERIVED here:
//   combat  = a fleet's lastCombatUpdate moved (hp/sp before -> after), or a starbase's did
//   mining  = per-asteroid cumulative amountMinedUnitsRaw, differenced between runs
// Env: C4_RPC_URL (default: the public z.ink test endpoint), C4_INTERVAL_MIN (default 60),
//      C4_MAINNET_RPC_URL (default: the public Solana mainnet endpoint; reference prices only, <= 1 call / 55 min).
//
// Owner identity and wealth (2026-11-07) are ENRICHMENT: a failed name, wallet or price read never fails the
// pass and never marks it partial. It keeps the last known values (with the time they were read) and adds a
// note to quality.notes. Never a partial read written as truth.
//   names   one getProgramAccounts on the z.ink player-profile program (PlayerName accounts), sanitised here
//   wallet  profileKeys[0] of each owner's Profile account, only when that key is scoped to the profile program
//   cargo   rolled up from the fleet accounts already read (cargo pods are nested in the Fleet account: 0 calls)
//   prices  Solana MAINNET Galactic Marketplace order book + galaxy.staratlas.com/nfts, cached in prices.json

import { createSolanaRpc, getAddressDecoder } from '@solana/kit';
import { createSageContext } from '@aephia/atlas-kit/client';
import { discoverFleetAddresses, getFleets } from '@aephia/atlas-kit/fleets';
import { getFleetMiningState } from '@aephia/atlas-kit/mining';
import { getCharacterForProfile } from '@aephia/atlas-kit/identity';
import { getAllClaimStakes, listClaimStakeDefinitions } from '@aephia/atlas-kit/claim-stakes';
import { getStarSystems, getAllCelestialBodies } from '@aephia/atlas-kit/world';
import { listCargoDefinitions } from '@aephia/atlas-kit/cargo';
import { mkdirSync, readFileSync, writeFileSync, appendFileSync, renameSync, existsSync, statSync, unlinkSync, openSync, closeSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = process.env.C4_OUT_DIR || join(HERE, '..', '..', 'Data', 'c4-live');
const DEFAULT_RPC = 'https://testnet-rpc.z.ink';
const RPC_URL = process.env.C4_RPC_URL || DEFAULT_RPC;
// Only the HOST is ever written out: paid endpoints carry their key in the path or query string, and
// latest.json is served to every visitor of the page.
const RPC_LABEL = (() => { try { return new URL(RPC_URL).host; } catch { return 'custom'; } })();
const INTERVAL_MIN = (() => {
  const raw = process.env.C4_INTERVAL_MIN;
  const v = raw === undefined || raw === '' ? 60 : Number(raw);
  if (!Number.isFinite(v) || v < 5) { console.log(`[c4-live] C4_INTERVAL_MIN=${JSON.stringify(raw)} is not a number >= 5 - using 60`); return 60; }
  return v;
})();
const MAX_HISTORY = 24 * 90;     // 90 days of hourly points
const MAX_EVENTS = 8000;
const MAX_OWNER_POINTS = 24 * 14; // 14 days per owner
const OWNER_TTL_SEC = 14 * 86400; // drop the series of an owner not seen for 14 days
const CONCURRENCY = 8;
const MAX_FAIL_SHARE = 0.05;      // more failed per-fleet / per-owner reads than this = a partial pass
const PASS_TIMEOUT_MS = Number(process.env.C4_PASS_TIMEOUT_MS) > 0 ? Number(process.env.C4_PASS_TIMEOUT_MS) : 10 * 60_000; // env only for tests
const LOCK_STALE_MS = 30 * 60_000;

const resName = (o) => o.cargo?.name || `cargo#${o.cargo?.id}`;
const num = (v) => (v === undefined || v === null ? 0 : typeof v === 'bigint' ? Number(v) : Number(v));
const round = (v, d = 3) => Math.round(v * 10 ** d) / 10 ** d;
// --log <file>: also append every log line to <file>, rotated to <file>.1 once it passes 5 MB (checked at
// start and every pass) so an hourly scheduled job cannot grow it without bound. Used by install-schedule.ps1.
const LOG_FILE = (() => { const i = process.argv.indexOf('--log'); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : null; })();
const LOG_MAX_BYTES = 5 * 1024 * 1024;
function rotateLog() {
  if (!LOG_FILE) return;
  try { if (existsSync(LOG_FILE) && statSync(LOG_FILE).size > LOG_MAX_BYTES) renameSync(LOG_FILE, `${LOG_FILE}.1`); } catch { /* best effort */ }
}
rotateLog();
const log = (...a) => {
  const line = [new Date().toISOString(), '[c4-live]', ...a].map((x) => (typeof x === 'string' ? x : String(x))).join(' ');
  console.log(line);
  if (LOG_FILE) { try { appendFileSync(LOG_FILE, line + '\n'); } catch { /* logging must never fail a pass */ } }
};

// A corrupt file must ABORT the pass, never silently become "empty" and overwrite months of data.
function readJson(name, fallback) {
  const p = join(OUT, name);
  if (!existsSync(p)) return fallback;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch (e) {
    const moved = `${p}.corrupt-${Date.now()}`;
    renameSync(p, moved);
    throw new Error(`${name} is unreadable (${e.message}); moved to ${moved} - pass aborted, restore it or delete it (the next pass then starts a fresh cursor and recovers history/events/owners from the served copies)`);
  }
}
// Temp + rename: a failed serialise never truncates the previous file (LESSONS #38). Per-process temp
// name, so two collectors can never rename each other's half-written temp into place.
function writeJson(name, obj) {
  const p = join(OUT, name);
  const tmp = `${p}.tmp.${process.pid}`;
  writeFileSync(tmp, JSON.stringify(obj));
  renameSync(tmp, p);
}
// One collector at a time (the loop and the scheduled --once job could otherwise overlap).
function takeLock() {
  const p = join(OUT, '.lock');
  try {
    if (existsSync(p) && Date.now() - statSync(p).mtimeMs > LOCK_STALE_MS) { log('WARN removing stale lock', p); unlinkSync(p); }
    // A token, so a pass only ever removes ITS OWN lock - never one a later pass took over.
    const token = `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const fd = openSync(p, 'wx'); writeFileSync(fd, token); closeSync(fd);
    return () => {
      try { if (readFileSync(p, 'utf8') === token) unlinkSync(p); else log('WARN lock was taken over by another pass - leaving it'); }
      catch { /* already gone */ }
    };
  } catch (e) {
    if (e.code === 'EEXIST') throw new Error(`another collector holds ${p} - skipping this pass`);
    throw e;
  }
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0, failed = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const k = i++;
      try { out[k] = await fn(items[k]); } catch (e) { failed++; out[k] = undefined; if (failed <= 3) log('WARN read failed', e.code || '', String(e.message).slice(0, 160)); }
    }
  }));
  return { out, failed };
}

// ==== owner identity: names + wallet (z.ink player-profile program) ===================================
export const PROFILE_PROGRAM = 'C4PRoFNroxxzdgeCoM31LJjYRg7kT6ymogSTAT99iD1u';
// PlayerName: disc(8) version(1) profile(32) bump(1) name UTF-8 @42..end (verified against
// @staratlas/dev-player-profile getPlayerNameDecoder by Test/c4-collector-check.js).
export const PLAYER_NAME_DISC = Uint8Array.from([102, 9, 241, 98, 96, 196, 212, 161]);
// Profile: 28-byte header, u16 key count @28, ProfileKey[] @30, 80 B each (key 32, scope 32, expire i64, perms 8).
const PROFILE_KEYS_AT = 30, PROFILE_KEY_SIZE = 80;
export const NAME_MAX = 32;
const MULTI_CHUNK = 100;               // getMultipleAccounts limit
const IDENT_TTL_SEC = OWNER_TTL_SEC;   // last-known identity of an owner not seen for 14 days is dropped
const addrDec = getAddressDecoder();
const addrOf = (bytes) => addrDec.decode(bytes);
const b64 = (data) => Buffer.from(Array.isArray(data) ? data[0] : data, 'base64');

// Names are USER TEXT shown to every visitor. Strip C0/C1 controls, DEL, zero-width and bidi controls
// (U+061C, U+200B, U+200E/F, U+202A-202E, U+2066-2069, U+FEFF), collapse whitespace, trim, cap at NAME_MAX
// code points. The UI must still render it as text (never innerHTML). Names are not unique.
const NAME_STRIP = /[\u0000-\u001F\u007F-\u009F؜​‎‏‪-‮⁦-⁩﻿]/g;
export function sanitizeName(raw) {
  if (typeof raw !== 'string') return { name: null, len: 0, trunc: false };
  const clean = raw.replace(NAME_STRIP, '').replace(/\s+/g, ' ').trim();
  const cps = Array.from(clean); // code points, so a cap never splits a surrogate pair
  if (!cps.length) return { name: null, len: 0, trunc: false };
  return { name: cps.slice(0, NAME_MAX).join(''), len: cps.length, trunc: cps.length > NAME_MAX };
}
const utf8 = new TextDecoder('utf-8', { fatal: false });
export function decodePlayerName(buf) {
  if (!buf || buf.length < 42) throw new Error(`PlayerName account too short (${buf?.length} B)`);
  for (let i = 0; i < 8; i++) if (buf[i] !== PLAYER_NAME_DISC[i]) throw new Error('not a PlayerName account (discriminator)');
  return { profile: addrOf(buf.subarray(9, 41)), raw: utf8.decode(buf.subarray(42)) };
}
// The auth wallet is profileKeys[0] when its scope is the profile program itself. A SAGE-scoped key is a
// session key (a hot key the game signs with), never the wallet, so it yields null + a reason.
export function decodeProfileWallet(buf, owner) {
  if (owner && owner !== PROFILE_PROGRAM) return { wallet: null, why: 'account not owned by the player-profile program' };
  if (!buf || buf.length < PROFILE_KEYS_AT) return { wallet: null, why: 'profile account too short' };
  const n = buf.readUInt16LE(28);
  if (n < 1) return { wallet: null, why: 'profile has no keys' };
  if (buf.length < PROFILE_KEYS_AT + n * PROFILE_KEY_SIZE) return { wallet: null, why: 'profile key list truncated' };
  const key = addrOf(buf.subarray(PROFILE_KEYS_AT, PROFILE_KEYS_AT + 32));
  const scope = addrOf(buf.subarray(PROFILE_KEYS_AT + 32, PROFILE_KEYS_AT + 64));
  if (scope !== PROFILE_PROGRAM) return { wallet: null, why: `profileKeys[0] is scoped to ${scope}, not the player-profile program` };
  return { wallet: key, why: null };
}

// Two independent reads; each returns null on failure (with a note), never a partial map.
export async function readIdentities(rpc, ownerIds, signal) {
  const res = { names: null, wallets: null, notes: [], calls: 0, ms: 0 };
  const t = Date.now();
  try {
    res.calls++;
    const accs = await rpc.getProgramAccounts(PROFILE_PROGRAM, {
      encoding: 'base64',
      filters: [{ memcmp: { offset: 0n, bytes: Buffer.from(PLAYER_NAME_DISC).toString('base64'), encoding: 'base64' } }],
    }).send({ abortSignal: signal });
    const names = new Map();
    for (const a of accs) {
      const { profile, raw } = decodePlayerName(b64(a.account.data));
      if (!names.has(profile)) names.set(profile, sanitizeName(raw));
    }
    res.names = names;
  } catch (e) { res.notes.push(`names read failed: ${String(e.message).slice(0, 120)}`); }
  try {
    const wallets = new Map();
    for (let i = 0; i < ownerIds.length; i += MULTI_CHUNK) {
      const chunk = ownerIds.slice(i, i + MULTI_CHUNK);
      res.calls++;
      const { value } = await rpc.getMultipleAccounts(chunk, { encoding: 'base64' }).send({ abortSignal: signal });
      if (!Array.isArray(value) || value.length !== chunk.length) throw new Error('getMultipleAccounts returned a short list');
      chunk.forEach((p, k) => {
        const v = value[k];
        wallets.set(p, v ? decodeProfileWallet(b64(v.data), v.owner) : { wallet: null, why: 'profile account not found' });
      });
    }
    res.wallets = wallets;
  } catch (e) { res.notes.push(`wallet read failed: ${String(e.message).slice(0, 120)}`); }
  res.ms = Date.now() - t;
  return res;
}

// ==== mainnet reference prices (Galactic Marketplace on Solana mainnet) ===============================
// Reference only: z.ink items are test-realm items, these are what the same-named item trades for on mainnet.
const MAINNET_RPC_URL = process.env.C4_MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com';
const MAINNET_LABEL = (() => { try { return new URL(MAINNET_RPC_URL).host; } catch { return 'custom'; } })();
export const GM_PROGRAM = 'traderDnaR5w6Tcoi3NFm53i48FTDNbGjBSZwWXDRrg';
export const ATLAS_MINT = 'ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx';
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const PRICE_SCALE = { [ATLAS_MINT]: 1e8, [USDC_MINT]: 1e6 };
const NFTS_URL = 'https://galaxy.staratlas.com/nfts';
const PRICES_MIN_AGE_SEC = 55 * 60;   // the public mainnet RPC is rate-limited: at most one book read per 55 min
const PRICES_STALE_SEC = 26 * 3600;   // older than this the page should say "stale"
export const ORDER_SIZE = 201;
// OrderAccount (201 B, no version byte): disc 8, initializer 8..40, currencyMint 40..72, assetMint 72..104,
// two token accounts, side u8 @168 (0 buy, 1 sell), price u64 @169, origQty @177, remainingQty @185, createdAt i64 @193.
export function decodeOrder(buf) {
  if (!buf || buf.length !== ORDER_SIZE) throw new Error(`order account is ${buf?.length} B, expected ${ORDER_SIZE}`);
  return {
    currency: addrOf(buf.subarray(40, 72)), asset: addrOf(buf.subarray(72, 104)), side: buf[168],
    priceRaw: buf.readBigUInt64LE(169), origQty: buf.readBigUInt64LE(177), remQty: buf.readBigUInt64LE(185),
    createdAt: Number(buf.readBigInt64LE(193)),
  };
}
// orders: decoded orders; nfts: the galaxy API list. Only items the API names are kept.
export function buildPriceBook(orders, nfts, fetchedAt) {
  const meta = new Map();
  for (const n of nfts) if (n && typeof n.mint === 'string' && typeof n.name === 'string') {
    meta.set(n.mint, { name: n.name, symbol: n.symbol ?? null, itemType: n.attributes?.itemType ?? null });
  }
  const book = new Map();
  let used = 0, unknownMint = 0, otherCurrency = 0;
  for (const o of orders) {
    const scale = PRICE_SCALE[o.currency];
    if (!scale) { otherCurrency++; continue; }
    if (o.remQty <= 0n || (o.side !== 0 && o.side !== 1)) continue;
    if (!meta.has(o.asset)) { unknownMint++; continue; }
    const cur = o.currency === ATLAS_MINT ? 'atlas' : 'usdc';
    const it = (book.get(o.asset) ?? book.set(o.asset, { mint: o.asset, ...meta.get(o.asset) }).get(o.asset));
    const B = (it[cur] ??= { bestBid: null, bestAsk: null, bids: 0, asks: 0 });
    const px = Number(o.priceRaw) / scale;
    if (o.side === 0) { B.bids++; if (B.bestBid === null || px > B.bestBid) B.bestBid = px; }
    else { B.asks++; if (B.bestAsk === null || px < B.bestAsk) B.bestAsk = px; }
    used++;
  }
  const items = [...book.values()].map((it) => {
    for (const c of ['atlas', 'usdc']) if (it[c]) it[c].orders = it[c].bids + it[c].asks;
    return it;
  }).sort((a, b) => a.name.localeCompare(b.name));
  return {
    fetchedAt, source: 'solana-mainnet galactic marketplace', rpc: MAINNET_LABEL, program: GM_PROGRAM,
    currencies: { atlas: { mint: ATLAS_MINT, priceDecimals: 8 }, usdc: { mint: USDC_MINT, priceDecimals: 6 } },
    counts: { orders: orders.length, used, unknownMint, otherCurrency, items: items.length },
    items,
  };
}
async function rpcPost(url, method, params, signal, timeoutMs) {
  const sig = AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)].filter(Boolean));
  const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, signal: sig,
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) });
  if (!r.ok) throw new Error(`${method} HTTP ${r.status}`);
  const j = await r.json();
  if (j.error) throw new Error(`${method} ${JSON.stringify(j.error).slice(0, 120)}`);
  return j.result;
}
// Reads prices.json without ever aborting the pass: a corrupt cache is moved aside and treated as none.
function readPricesCache() {
  const p = join(OUT, 'prices.json');
  if (!existsSync(p)) return null;
  try { const j = JSON.parse(readFileSync(p, 'utf8')); return j && Array.isArray(j.items) ? j : null; } catch {
    try { renameSync(p, `${p}.corrupt-${Date.now()}`); } catch { /* best effort */ }
    return null;
  }
}
// Returns { prices (fresh or cached, or null), fetched, notes[], calls }. Writes prices.json only from a
// complete, validated read. Every mainnet attempt is stamped in prices.attempt.json BEFORE the call, so a
// failing endpoint is also retried at most once per 55 min, even in a 5-minute loop.
export async function refreshPrices(pass, nowSec) {
  const res = { prices: readPricesCache(), fetched: false, notes: [], calls: 0, ms: 0 };
  let attempt = null;
  try { attempt = JSON.parse(readFileSync(join(OUT, 'prices.attempt.json'), 'utf8')); } catch { /* none yet */ }
  const lastAt = Math.max(res.prices?.fetchedAt || 0, attempt?.at || 0);
  if (nowSec - lastAt < PRICES_MIN_AGE_SEC) {
    if (attempt && attempt.ok === false && attempt.at >= (res.prices?.fetchedAt || 0)) res.notes.push(`price refresh failed at ${attempt.at} (${attempt.error}); next try after ${attempt.at + PRICES_MIN_AGE_SEC}`);
    return res;
  }
  const t = Date.now();
  writeJson('prices.attempt.json', { at: nowSec, ok: null });
  try {
    const signal = pass.abort?.signal;
    const nr = await fetch(NFTS_URL, { signal: AbortSignal.any([signal, AbortSignal.timeout(60_000)].filter(Boolean)) });
    if (!nr.ok) throw new Error(`nfts HTTP ${nr.status}`);
    const nfts = await nr.json();
    if (!Array.isArray(nfts) || nfts.length < 100) throw new Error(`nfts list looks wrong (${Array.isArray(nfts) ? nfts.length : typeof nfts} entries)`);
    res.calls++;
    const accs = await rpcPost(MAINNET_RPC_URL, 'getProgramAccounts', [GM_PROGRAM, { encoding: 'base64', filters: [{ dataSize: ORDER_SIZE }] }], signal, 180_000);
    if (!Array.isArray(accs) || !accs.length) throw new Error('order book read returned no orders');
    const orders = accs.map((a) => decodeOrder(b64(a.account.data)));
    const prices = buildPriceBook(orders, nfts, nowSec);
    if (!prices.items.length) throw new Error('no priced items after decoding');
    if (pass.aborted) throw new Error('pass timed out');
    writeJson('prices.json', prices);
    writeJson('prices.attempt.json', { at: nowSec, ok: true });
    res.prices = prices; res.fetched = true;
  } catch (e) {
    const msg = String(e.message).slice(0, 120);
    try { writeJson('prices.attempt.json', { at: nowSec, ok: false, error: msg }); } catch { /* best effort */ }
    res.notes.push(`price refresh failed: ${msg}${res.prices ? ` - keeping prices from ${res.prices.fetchedAt}` : ' - no reference prices'}`);
  }
  res.ms = Date.now() - t;
  return res;
}

// ==== holdings + reference match ======================================================================
const normName = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
// Only items with an ATLAS price can value anything. Hulls match by the LONGEST mainnet ship name that is a
// whole-word prefix of the z.ink config name ("Armstrong IMP Tip Mining Min Config" -> "Armstrong IMP Tip");
// cargo matches a non-ship item by exact normalised name.
export function priceIndex(prices) {
  const ships = [], other = new Map();
  for (const it of prices?.items || []) {
    if (!it.atlas || (it.atlas.bestBid === null && it.atlas.bestAsk === null)) continue;
    const e = { name: it.name, mint: it.mint, n: normName(it.name), bid: it.atlas.bestBid, ask: it.atlas.bestAsk };
    if (it.itemType === 'ship') ships.push(e); else if (!other.has(e.n)) other.set(e.n, e);
  }
  ships.sort((a, b) => b.n.length - a.n.length);
  return { ships, other };
}
export function matchHull(configName, idx) {
  const n = normName(configName);
  return idx.ships.find((s) => n === s.n || n.startsWith(s.n + ' ')) || null;
}
export const matchCargo = (name, idx) => idx.other.get(normName(name)) || null;
const itemUnits = (it) => num(it?.amount ?? it?.quantityRaw);
// Per owner, from the fleet accounts already read: hull counts and cargo hold + fuel + ammo by cargo name.
export function rollupHoldings(fleetsRaw) {
  const by = {};
  for (const f of fleetsRaw) {
    const p = f.ownerProfile?.address;
    if (!p || f.npcFactionId) continue;
    const H = (by[p] ??= { hulls: {}, cargo: {} });
    for (const s of f.ships || []) H.hulls[s.name] = (H.hulls[s.name] || 0) + num(s.quantity ?? 1);
    for (const it of [...(f.cargoHold?.items || []), f.fuel, f.ammo]) {
      const u = itemUnits(it);
      if (it && u > 0) H.cargo[it.name || `cargo#${it.id}`] = (H.cargo[it.name || `cargo#${it.id}`] || 0) + u;
    }
  }
  return by;
}
export function refValue(h, idx, pricesAt) {
  let bid = 0, ask = 0, priced = 0, unpriced = 0;
  const lines = [];
  const add = (kind, name, qty, m) => {
    if (!m) { unpriced++; return; }
    priced++;
    if (m.bid !== null) bid += qty * m.bid;
    if (m.ask !== null) ask += qty * m.ask;
    lines.push({ kind, name, ref: m.name, qty, bid: m.bid, ask: m.ask });
  };
  for (const [name, q] of Object.entries(h.hulls)) add('hull', name, q, matchHull(name, idx));
  for (const [name, q] of Object.entries(h.cargo)) add('cargo', name, q, matchCargo(name, idx));
  if (!priced) return null;
  lines.sort((a, b) => (b.qty * (b.bid ?? b.ask ?? 0)) - (a.qty * (a.bid ?? a.ask ?? 0)));
  return { basis: 'mainnet reference', currency: 'ATLAS', atBid: round(bid, 2), atAsk: round(ask, 2), priced, unpriced,
    pricesAt, top: lines.slice(0, 8) };
}

function slimFleet(f) {
  const s = f.state || {};
  const st = { kind: s.kind };
  if (s.kind === 'warp' || s.kind === 'subwarp') {
    st.departs = num(s.departsAtUnixSeconds); st.arrives = num(s.arrivesAtUnixSeconds);
    if (s.from) st.from = [round(s.from.x), round(s.from.y)];
    st.to = s.to ? [round(s.to.x), round(s.to.y)] : undefined;
  } else if (s.kind === 'mining') {
    st.asteroid = s.asteroid?.address;
    st.resources = (s.resources || []).map((r) => r.name);
  } else if (s.kind === 'docked') {
    st.system = s.system?.address;
  } else if (s.kind === 'respawn') {
    st.recovers = num(s.recoversAtUnixSeconds);
  }
  const shipNames = {};
  for (const sh of f.ships || []) shipNames[sh.name] = (shipNames[sh.name] || 0) + num(sh.quantity ?? 1);
  // Flagship = the largest size class in the fleet (ties: the most numerous), drawn as the fleet's silhouette.
  const SIZE_RANK = { 'xx-small': 0, 'x-small': 1, small: 2, medium: 3, large: 4, capital: 5, commander: 6, titan: 7 };
  let flag = null;
  for (const sh of f.ships || []) {
    const r = SIZE_RANK[sh.sizeClass] ?? -1, q = num(sh.quantity ?? 1);
    if (!flag || r > flag.r || (r === flag.r && q > flag.q)) flag = { r, q, name: sh.name, size: sh.sizeClass };
  }
  return {
    a: f.address,
    n: f.name,
    o: f.ownerProfile?.address,
    fa: f.faction,
    npc: f.npcFactionId || 0,
    s: st,
    x: round(f.location?.x ?? 0), y: round(f.location?.y ?? 0),
    hp: num(f.hp), hpMax: num(f.stats?.combat?.hp), sp: num(f.sp), spMax: num(f.stats?.combat?.sp),
    ships: num(f.shipCounts?.total),
    size: Object.fromEntries(Object.entries(f.shipCounts || {}).filter(([k, v]) => k !== 'total' && num(v) > 0).map(([k, v]) => [k, num(v)])),
    types: shipNames,
    flag: flag ? flag.name : null, flagSize: flag ? flag.size : null,
    crew: num(f.crewCount),
    mineRate: round(f.stats?.cargo?.miningRate?.value ?? 0, 6),
    cargo: num(f.cargoHold?.storageCost), cargoCap: num(f.stats?.cargo?.cargoCapacity),
    lc: num(f.lastCombatUpdate),
    lu: num(f.lastUpdateAt),
  };
}

// `pass` is shared with main(): on timeout main sets pass.aborted and disposes pass.ctx, which aborts the
// kit's in-flight reads; a pass that still reaches the commit point checks the flag and writes nothing.
// `deps` exists for Test/c4-collector-check.js: it swaps the enrichment readers to prove a failing one
// degrades instead of failing the pass.
export async function collect(pass, deps = {}) {
  const readIdent = deps.readIdentities || readIdentities;
  const readPrices = deps.refreshPrices || refreshPrices;
  const t0 = Date.now();
  mkdirSync(OUT, { recursive: true });
  const unlock = takeLock();
  let ctx;
  try {
    const db = loadDb(); // a corrupt file aborts here, before any network read
    const rpc = createSolanaRpc(RPC_URL);
    pass.abort ??= new AbortController();
    ctx = createSageContext({ cluster: 'zink-ptr', rpc });
    pass.ctx = ctx;
    // ---- reads -------------------------------------------------------------------------------
    // getFleets is all-or-nothing: a fleet closed between discovery and read throws. Re-discover once.
    let addrs = await discoverFleetAddresses(ctx);
    let fleetsRaw;
    try { fleetsRaw = await getFleets(ctx, addrs); } catch (e) {
      if (e.code !== 'ACCOUNT_NOT_FOUND') throw e;
      log('WARN a fleet vanished between discovery and read - re-discovering once');
      addrs = await discoverFleetAddresses(ctx);
      fleetsRaw = await getFleets(ctx, addrs, { refresh: true });
    }
    log('fleets discovered', addrs.length, 'read', fleetsRaw.length);
    // Guard: an empty read must never overwrite a good snapshot (LESSONS #14).
    if (!fleetsRaw.length) throw new Error('zero fleets read - refusing to write');

    const systemsRaw = await getStarSystems(ctx);
    const stakesRaw = await getAllClaimStakes(ctx);
    const fleets = fleetsRaw.map(slimFleet);

    const miningFleets = fleets.filter((f) => f.s.kind === 'mining');
    const { out: miningStates, failed: mineFailed } = await pool(miningFleets, CONCURRENCY, (f) => getFleetMiningState(ctx, f.a));

    const ownerIds = [...new Set(fleets.filter((f) => !f.npc && f.o).map((f) => f.o))];
    const { out: chars, failed: charFailed } = await pool(ownerIds, CONCURRENCY, (p) => getCharacterForProfile(ctx, p));
    log('mining states', miningStates.filter(Boolean).length, '/', miningFleets.length, 'failed', mineFailed,
      '| characters', chars.filter(Boolean).length, '/', ownerIds.length, 'failed', charFailed,
      '| systems', systemsRaw.length, '| stakes', stakesRaw.length);
    // A partial pass would write too-low totals as truth (a fake galaxy-wide dip). Record the read
    // quality in every output, and above the threshold keep it out of the time series.
    const quality = {
      mineFailed, mineTotal: miningFleets.length, charFailed, charTotal: ownerIds.length,
      partial: mineFailed > miningFleets.length * MAX_FAIL_SHARE || charFailed > ownerIds.length * MAX_FAIL_SHARE,
    };
    if (quality.partial) log(`WARN PARTIAL pass (mining ${mineFailed}/${miningFleets.length}, characters ${charFailed}/${ownerIds.length} failed) - latest.json is marked partial and no history/owner points are added`);

    // Taken from the pass START, before the reads: a chain event landing during this pass's reads then
    // falls in the NEXT history window instead of slipping between two windows.
    const nowSec = Math.floor(t0 / 1000);

    // ---- systems + body -> system map -------------------------------------------------------
    const bodyToSystem = {};
    const systems = systemsRaw.map((s) => {
      for (const b of s.celestialBodyAddresses || []) bodyToSystem[b] = s.address;
      const sb = s.starbase;
      return {
        a: s.address, n: s.name, r: s.regionId, x: round(s.coordinates.x), y: round(s.coordinates.y),
        f: sb?.owner ?? null, lvl: sb ? Number(String(sb.level).replace(/\D/g, '') || 0) : 0,
        hp: num(sb?.hp), sp: num(sb?.sp), lc: num(sb?.lastCombatUpdateUnixSeconds),
        built: num(sb?.builtDestroyedAtUnixSeconds),
        links: (s.connections || []).length,
      };
    });
    const sysByAddr = Object.fromEntries(systems.map((s) => [s.a, s]));

    // ---- mining: per-fleet live rates, per-asteroid cumulative ---------------------------------
    const asteroids = {};
    const fleetMine = {};
    miningFleets.forEach((f, i) => {
      const m = miningStates[i];
      if (!m) return;
      const out = m.outputs.map((o) => ({ r: resName(o), ups: round(num(o.unitsPerSecond), 6) }));
      fleetMine[f.a] = {
        // ups = what the fleet actually yields (sum of outputs, richness applied) - the same unit as
        // galaxyUps/resUps, so owner and faction totals add up to the galaxy. baseUps = the fleet's stat.
        ups: round(out.reduce((s, o) => s + o.ups, 0), 6),
        baseUps: round(num(m.miningRate?.unitsPerSecond), 6),
        out,
        since: num(m.lastUpdatedAtUnixSeconds),
      };
      const ast = m.asteroid?.address;
      if (!ast) return;
      const sys = sysByAddr[bodyToSystem[ast]];
      const A = (asteroids[ast] ??= { a: ast, sys: sys?.a ?? null, sysName: sys?.n ?? null, x: sys?.x ?? f.x, y: sys?.y ?? f.y, fleets: 0, ups: 0, res: {} });
      A.fleets += 1;
      for (const o of m.outputs) {
        const r = resName(o);
        const R = (A.res[r] ??= { cum: 0, miners: 0, ups: 0, rich: 0 });
        // asteroid-level counter shared by every fleet on it; reads land at slightly different times
        R.cum = Math.max(R.cum, num(o.amountMinedUnitsRaw));
        R.miners = num(o.activeMinerCountRaw);
        R.rich = round(num(o.richness?.value), 4);
        R.ups = round(R.ups + num(o.unitsPerSecond), 6);
        A.ups = round(A.ups + num(o.unitsPerSecond), 6);
      }
    });
    for (const f of fleets) if (fleetMine[f.a]) f.mine = fleetMine[f.a];

    // ---- owners --------------------------------------------------------------------------------
    const owners = {};
    ownerIds.forEach((p, i) => {
      const c = chars[i];
      const mine = fleets.filter((f) => f.o === p);
      const facCount = {};
      for (const f of mine) facCount[f.fa] = (facCount[f.fa] || 0) + 1;
      owners[p] = {
        p,
        fa: Object.entries(facCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'unaligned',
        fleets: mine.length,
        ships: mine.reduce((s, f) => s + f.ships, 0),
        mining: mine.filter((f) => f.s.kind === 'mining').length,
        ups: round(mine.reduce((s, f) => s + (f.mine?.ups || 0), 0), 6),
        destroyed: mine.filter((f) => f.s.kind === 'destroyed').length,
        atlas: c ? round(num(c.atlas), 4) : null,
        rank: c ? num(c.xp?.councilRank?.level) : null,
        xp: c ? Object.fromEntries(['pilot', 'dataRunner', 'mining', 'building', 'crafting', 'combat']
          .map((k) => [k, { xp: num(c.xp?.[k]?.earned), lvl: num(c.xp?.[k]?.level) }])) : null,
        stakes: c ? num(c.counts?.claimStakes) : 0,
        habs: c ? num(c.counts?.craftingHabs) : 0,
        lastCombat: Math.max(0, ...mine.map((f) => f.lc)),
      };
    });

    // ---- owner identity (names, wallet) - enrichment, degrades to the last known values ------------
    // A failed or suspect read keeps each owner's previous value with the time it was read (nameAt /
    // walletAt) and adds a quality note. It never touches quality.partial.
    quality.notes = [];
    const prevIdent = db.state.ident || {};
    let ident;
    try { ident = await readIdent(rpc, ownerIds, pass.abort.signal); } catch (e) { ident = { names: null, wallets: null, notes: [`identity read failed: ${String(e.message).slice(0, 120)}`], calls: 0, ms: 0 }; }
    quality.notes.push(...ident.notes);
    const prevNamed = Object.values(prevIdent).filter((v) => v.n).length;
    if (ident.names && prevNamed >= 20 && ident.names.size < prevNamed * 0.5) {
      quality.notes.push(`names read suspect: ${ident.names.size} names vs ${prevNamed} named owners last pass - keeping previous names`);
      ident.names = null;
    }
    quality.namesFailed = !ident.names || undefined;
    quality.walletsFailed = !ident.wallets || undefined;
    const nextIdent = {};
    for (const p of ownerIds) {
      const prev = prevIdent[p] || {};
      const e = { ...prev };
      if (ident.names) { const nm = ident.names.get(p); e.n = nm?.name ?? null; e.nt = nm?.trunc ? nm.len : undefined; e.na = nowSec; }
      if (ident.wallets) { const w = ident.wallets.get(p); e.w = w?.wallet ?? null; e.wy = w?.why ?? undefined; e.wa = nowSec; }
      nextIdent[p] = e;
      const o = owners[p];
      o.name = e.n ?? null; o.nameAt = e.na ?? null;
      if (e.nt) o.nameLen = e.nt; // the raw name was this many code points; `name` is cut at NAME_MAX
      o.wallet = e.w ?? null; o.walletAt = e.wa ?? null;
      if (e.wy) o.walletWhy = e.wy;
    }
    for (const [p, e] of Object.entries(prevIdent)) if (!nextIdent[p] && Math.max(e.na || 0, e.wa || 0) >= nowSec - IDENT_TTL_SEC) nextIdent[p] = e;

    // ---- holdings (z.ink) + mainnet reference value ------------------------------------------------
    const tPrices = Date.now();
    let pr;
    try { pr = await readPrices(pass, nowSec); } catch (e) { pr = { prices: readPricesCache(), fetched: false, notes: [`price refresh failed: ${String(e.message).slice(0, 120)}`], calls: 0 }; }
    quality.notes.push(...pr.notes);
    if (pr.notes.some((n) => n.startsWith('price refresh failed'))) quality.pricesFailed = true;
    const prices = pr.prices;
    const idx = priceIndex(prices);
    const holdings = rollupHoldings(fleetsRaw);
    const hullNames = new Set(), cargoNames = new Set();
    for (const p of ownerIds) {
      const o = owners[p];
      const h = holdings[p] || { hulls: {}, cargo: {} };
      for (const n of Object.keys(h.hulls)) hullNames.add(n);
      for (const n of Object.keys(h.cargo)) cargoNames.add(n);
      o.holdings = {
        atlas: o.atlas, fleets: o.fleets, ships: o.ships, hulls: h.hulls,
        cargo: Object.entries(h.cargo).map(([name, units]) => ({ name, units })).sort((a, b) => b.units - a.units),
      };
      const rv = prices ? refValue(h, idx, prices.fetchedAt) : null;
      if (rv) o.holdings.refValue = rv;
    }
    const ref = prices ? {
      pricesAt: prices.fetchedAt, source: prices.source, fetchedThisPass: pr.fetched,
      stale: nowSec - prices.fetchedAt > PRICES_STALE_SEC,
      match: {
        hulls: { matched: [...hullNames].filter((n) => matchHull(n, idx)).length, total: hullNames.size },
        cargo: { matched: [...cargoNames].filter((n) => matchCargo(n, idx)).length, total: cargoNames.size },
      },
    } : null;
    if (!quality.notes.length) delete quality.notes;
    log(`identity: names ${ident.names ? ident.names.size : 'FAILED'} wallets ${ident.wallets ? [...ident.wallets.values()].filter((w) => w.wallet).length : 'FAILED'}`,
      `(${ident.calls} calls, ${ident.ms} ms) | prices ${prices ? `${prices.items.length} items from ${prices.fetchedAt}` : 'none'} fetched=${pr.fetched}`,
      `(${pr.calls} mainnet calls, ${Date.now() - tPrices} ms)`,
      ref ? `| match hulls ${ref.match.hulls.matched}/${ref.match.hulls.total} cargo ${ref.match.cargo.matched}/${ref.match.cargo.total}` : '');

    // ---- claim stakes --------------------------------------------------------------------------
    // Definition id -> name and tier ("Claim Stake Tier 1", tier "one"). Optional: on failure stakes keep
    // only `def` (the raw id).
    let stakeDefs = {};
    try {
      stakeDefs = Object.fromEntries((await listClaimStakeDefinitions(ctx)).map((d) => [d.id, { name: d.name, tier: d.tier, slots: num(d.slots) }]));
    } catch (e) {
      quality.stakeDefsFailed = true; // the page shows "tier unknown (read failed)", not a blank
      log('WARN claim stake definitions read failed', e.code || '', String(e.message).slice(0, 120));
    }
    const TIER_NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
    const stakes = stakesRaw.map((k) => {
      const def = stakeDefs[k.claimStakeDefinitionId];
      const sys = sysByAddr[bodyToSystem[k.body?.address]];
      return {
        a: k.address, o: k.ownerProfile?.address, st: k.state?.kind, def: k.claimStakeDefinitionId,
        b: (k.buildings || []).reduce((s, b) => s + num(b.quantity), 0),
        sys: sys?.a ?? null, sysName: sys?.n ?? null, x: sys?.x ?? null, y: sys?.y ?? null,
        crew: num(k.neededCrew), body: k.body?.address ?? null,
        defName: def?.name ?? null, tier: def ? (TIER_NUM[def.tier] ?? def.tier) : null, slots: def?.slots ?? null,
      };
    });
    for (const k of stakes) if (owners[k.o]) owners[k.o].stakesLive = (owners[k.o].stakesLive || 0) + 1;

    // ---- celestial bodies (planets + asteroids) for the system view --------------------------
    // Optional: a failed read keeps the previous bodies.json (bodies change rarely) and is recorded
    // in quality.bodiesFailed - it never fails the pass. The chain gives no position inside a system;
    // the scene lays bodies out on stylised orbits.
    let bodies = null;
    try {
      const [bodiesRaw, cargoDefs] = await Promise.all([getAllCelestialBodies(ctx), listCargoDefinitions(ctx)]);
      const cargoName = Object.fromEntries(cargoDefs.map((c) => [c.id, c.name]));
      const stakesByBody = {};
      for (const k of stakes) if (k.body) (stakesByBody[k.body] ??= []).push(k.a);
      bodies = bodiesRaw.map((b) => {
        const d = b.details || {};
        const out = {
          a: b.address, id: b.id, n: b.name, k: b.kind, sys: b.system?.address ?? null,
          res: (d.resources || []).map((r) => {
            const e = { r: cargoName[r.cargoId] || `cargo#${r.cargoId}`, rich: round(num(r.richness?.value), 3) };
            if (num(r.amountMined)) e.mined = num(r.amountMined);
            if (num(r.miners)) e.miners = num(r.miners);
            return e;
          }),
        };
        if (b.kind === 'planet') {
          out.sub = d.subtype ?? null;
          out.claimed = (d.claimedPlots || []).filter((p) => (p.structures || []).length).length;
        }
        if (stakesByBody[b.address]) out.stakes = stakesByBody[b.address];
        return out;
      });
      log('bodies', bodies.length, '(planets', bodies.filter((b) => b.k === 'planet').length, ')');
    } catch (e) {
      quality.bodiesFailed = true;
      log('WARN bodies read failed - keeping the previous bodies.json', e.code || '', String(e.message).slice(0, 160));
    }

    // ---- diff against the previous run -> events ----------------------------------------------
    // db.json is the single commit point: state cursor + history + events + owner series are written in
    // ONE atomic rename, so a crash can never leave a new history point beside an old cursor (which
    // double-counted minedDelta and duplicated events). The served history/events/owners files are
    // copies written after it; losing one of those costs nothing, the next pass rewrites it.
    const state = db.state;
    const firstRun = !state.runAt;
    const events = db.events;
    const newEvents = [];
    const LIVE = new Set(['idle', 'docked', 'mining', 'warp', 'subwarp', 'claimStakeTransfer']);
    // lastCombatUpdate moves for BOTH sides of a fight (verifier 2026-11-06: attacker and defender share the
    // exact second), so a combat event means "took part". `dmg` says whether hp or shields actually fell
    // since the previous run; `vs` lists the other fleets stamped with the same second (the likely opponents).
    const byLc = {};
    for (const f of fleets) if (f.lc > 0) (byLc[f.lc] ??= []).push(f);
    const seenNow = new Set();
    for (const f of fleets) {
      seenNow.add(f.a);
      const p = state.fleets[f.a];
      if (f.lc > 0 && (!p || f.lc > p.lc)) {
        newEvents.push({
          t: f.lc, k: 'combat', f: f.a, n: f.n, o: f.o, fa: f.fa, npc: f.npc, x: f.x, y: f.y,
          hp0: p ? p.hp : null, hp1: f.hp, sp0: p ? p.sp : null, sp1: f.sp, hpMax: f.hpMax,
          dmg: p ? (f.hp < p.hp || f.sp < p.sp) : null,
          vs: (byLc[f.lc] || []).filter((g) => g.a !== f.a).slice(0, 6).map((g) => ({ f: g.a, n: g.n, o: g.o, fa: g.fa, npc: g.npc })),
          dead: f.s.kind === 'destroyed', seed: firstRun || !p,
        });
      }
      // destroyed -> respawn can both happen inside one hour, so a live fleet now respawning was destroyed too
      if (p && LIVE.has(p.k) && (f.s.kind === 'destroyed' || f.s.kind === 'respawn')) {
        newEvents.push({ t: f.lc || nowSec, k: 'destroyed', f: f.a, n: f.n, o: f.o, fa: f.fa, npc: f.npc, x: f.x, y: f.y, ships: f.ships });
      }
      if (!firstRun && !p) newEvents.push({ t: nowSec, k: 'newFleet', f: f.a, n: f.n, o: f.o, fa: f.fa, npc: f.npc, x: f.x, y: f.y, ships: f.ships });
    }
    // A fleet account that closed between runs leaves no state at all (NPC fleets are closed on death).
    // `gone` records it with its last known values; `afterCombat` = it had been in combat recently.
    // Guard: discovery that returns a truncated (non-empty) set would turn every missing fleet into `gone`
    // and drop it from state. More than 10 % of the previous fleets vanishing at once is treated as a
    // suspect read: no gone events, and their state entries are carried forward (see carriedFleets).
    const carriedFleets = {};
    if (!firstRun) {
      const vanished = Object.entries(state.fleets).filter(([a]) => !seenNow.has(a));
      const prevCount = Object.keys(state.fleets).length;
      quality.vanished = vanished.length;
      const goneEvent = (a, p) => {
        if (!p.n) return; // entries from before this field existed carry no identity
        newEvents.push({ t: nowSec, k: 'gone', f: a, n: p.n, o: p.o, fa: p.fa, npc: p.npc, x: p.x, y: p.y, ships: p.ships,
          hp0: p.hp, hpMax: p.hpMax, afterCombat: p.lc > 0 && p.lc >= state.runAt - 3 * 3600 });
      };
      if (vanished.length > prevCount * 0.10) {
        // A truncated read is unlikely to miss the SAME fleets three passes running, so a fleet missed on
        // its 3rd consecutive suspect pass is accepted as gone - otherwise a real mass vanish (an NPC wipe:
        // NPCs are 18 % of fleets) would keep the guard on forever and suppress every real `gone` after it.
        quality.suspectDiscovery = true;
        quality.partial = true; // a truncated fleet set must not reach history/owner series as truth
        let accepted = 0;
        for (const [a, p] of vanished) {
          const miss = (p.miss || 0) + 1;
          if (miss >= 3) { goneEvent(a, p); accepted++; } else carriedFleets[a] = { ...p, miss };
        }
        log(`WARN ${vanished.length}/${prevCount} fleets vanished in one pass - suspect discovery (marked partial):`,
          `${Object.keys(carriedFleets).length} carried, ${accepted} accepted as gone after 3 misses`);
      } else {
        for (const [a, p] of vanished) goneEvent(a, p);
      }
    }
    // A starbase's lastCombatUpdate is ALSO written at the second it is built, upgraded or destroyed: the
    // field the kit calls builtOrDestroyedAt then holds the SAME second (604 exact matches on 2026-11-06).
    // Only that exact match is a build stamp. lc < built is a real fight followed by a later build/destroy
    // (87 of them), and lc > built is a fight since (92). The current stamp is emitted whenever the log
    // lacks it, so stamps dropped by the earlier `lc > built` rule are restored (deduped by key).
    const keyOf = (e) => `${e.k}|${e.f || e.sys}|${e.t}`;
    for (let i = events.length - 1; i >= 0; i--) {
      const e = events[i];
      const s = sysByAddr[e.sys];
      if (e.k === 'starbaseCombat' && s && e.t === s.built) events.splice(i, 1); // build stamps from v1
    }
    const seen = new Set(events.map(keyOf));
    for (const s of systems) {
      const p = state.starbases[s.a];
      if (s.lc > 0 && s.lc !== s.built && !seen.has(`starbaseCombat|${s.a}|${s.lc}`)) {
        const moved = p && s.lc > p.lc;
        newEvents.push({ t: s.lc, k: 'starbaseCombat', sys: s.a, n: s.n, fa: s.f, x: s.x, y: s.y, hp0: moved ? p.hp : null, hp1: s.hp, seed: !moved });
      }
      if (p && p.f !== s.f && (p.f || s.f)) newEvents.push({ t: nowSec, k: 'captured', sys: s.a, n: s.n, from: p.f, fa: s.f, x: s.x, y: s.y });
    }
    // Seed events keep their own chain timestamps, so the timeline is honest. Sort, de-dup, bound.
    const added = [];
    for (const e of newEvents) { const key = keyOf(e); if (!seen.has(key)) { seen.add(key); events.push(e); added.push(e); } }
    events.sort((a, b) => a.t - b.t);
    if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);

    // Mined since last run, per resource: sum of positive deltas of each asteroid counter. A partial pass
    // does not advance the counters, so the next full pass still sees the whole interval.
    // Each key remembers WHEN its baseline was taken. A delta only counts when that baseline is from the
    // last full pass (at === state.cumAt); an asteroid idle then and mined again now would otherwise put
    // hours of output into a one-hour interval. Such keys are re-based silently.
    const asteroidCum = {};
    for (const [k, v] of Object.entries(state.asteroidCum || {})) asteroidCum[k] = typeof v === 'number' ? { cum: v, at: state.cumAt } : v;
    const minedDelta = {};
    for (const A of Object.values(asteroids)) {
      for (const [r, R] of Object.entries(A.res)) {
        const key = `${A.a}|${r}`;
        const prev = asteroidCum[key];
        if (prev && prev.at === state.cumAt && state.cumAt && R.cum > prev.cum) minedDelta[r] = (minedDelta[r] || 0) + (R.cum - prev.cum);
        // a counter that went DOWN (asteroid reset) re-bases to the new value instead of ratcheting
        if (!quality.partial) asteroidCum[key] = { cum: prev && R.cum < prev.cum ? R.cum : Math.max(prev?.cum ?? 0, R.cum), at: nowSec };
      }
    }
    const minedDtSec = state.cumAt ? nowSec - state.cumAt : 0; // the interval minedDelta covers

    // ---- KPIs ----------------------------------------------------------------------------------
    const byState = {}; const byFaction = {}; const resUps = {};
    for (const f of fleets) {
      byState[f.s.kind] = (byState[f.s.kind] || 0) + 1;
      const F = (byFaction[f.fa] ??= { fleets: 0, ships: 0, mining: 0, ups: 0 });
      F.fleets++; F.ships += f.ships; if (f.s.kind === 'mining') F.mining++; F.ups = round(F.ups + (f.mine?.ups || 0), 6);
      for (const o of f.mine?.out || []) resUps[o.r] = round((resUps[o.r] || 0) + o.ups, 6);
    }
    const sbByFaction = {};
    for (const s of systems) if (s.f) sbByFaction[s.f] = (sbByFaction[s.f] || 0) + 1;
    const dayAgo = nowSec - 86400;
    const kpis = {
      t: nowSec,
      fleets: fleets.length, ships: fleets.reduce((s, f) => s + f.ships, 0),
      players: ownerIds.length, npcFleets: fleets.filter((f) => f.npc).length,
      byState, byFaction, sbByFaction,
      galaxyUps: round(Object.values(resUps).reduce((s, v) => s + v, 0), 6),
      resUps,
      minedDelta, // units of the asteroid counter since the previous full run (empty on the first run)
      minedDtSec, // seconds that minedDelta covers (0 on the first run)
      activeAsteroids: Object.keys(asteroids).length,
      combat24h: events.filter((e) => e.k === 'combat' && e.t >= dayAgo).length,
      destroyed24h: events.filter((e) => e.k === 'destroyed' && e.t >= dayAgo).length,
      stakes: stakes.length, stakesActive: stakes.filter((k) => k.st === 'active').length,
      atlasTotal: round(Object.values(owners).reduce((s, o) => s + (o.atlas || 0), 0), 2),
    };

    // ---- history + owner series ----------------------------------------------------------------
    const history = db.history;
    if (!quality.partial) {
      // Counted from the event log since the previous history point, so events found on a partial pass
      // (which adds no history point) still land in the next one.
      const sinceT = history.length ? history[history.length - 1].t : Infinity;
      const inWindow = (e) => !e.seed && e.t > sinceT && e.t <= nowSec;
      history.push({ t: nowSec, fleets: kpis.fleets, ships: kpis.ships, players: kpis.players, mining: byState.mining || 0,
        galaxyUps: kpis.galaxyUps, resUps, minedDelta, minedDtSec,
        combat: events.filter((e) => e.k === 'combat' && inWindow(e)).length,
        destroyed: events.filter((e) => e.k === 'destroyed' && inWindow(e)).length, byFaction, atlasTotal: kpis.atlasTotal });
      if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);
    }

    const ownerSeries = db.owners;
    if (!quality.partial) {
      for (const o of Object.values(owners)) {
        const arr = (ownerSeries[o.p] ??= []);
        arr.push([nowSec, o.fleets, o.mining, round(o.ups, 4), o.atlas, o.rank]);
        if (arr.length > MAX_OWNER_POINTS) arr.splice(0, arr.length - MAX_OWNER_POINTS);
      }
    }
    for (const [p, arr] of Object.entries(ownerSeries)) if (!arr.length || arr[arr.length - 1][0] < nowSec - OWNER_TTL_SEC) delete ownerSeries[p];

    const latest = {
      v: 1, generatedAt: nowSec, rpc: RPC_LABEL, intervalMin: INTERVAL_MIN, quality,
      tookMs: Date.now() - t0, kpis, fleets, owners: Object.values(owners), systems,
      asteroids: Object.values(asteroids), stakes, ref,
    };

    // ---- write ---------------------------------------------------------------------------------
    // 1. db.json - the commit point (one atomic rename). 2. served copies. latest.json last, so the page
    // never shows a snapshot whose history/events are not on disk yet.
    if (pass.aborted) throw new Error('pass was timed out - discarding its results (nothing written)');
    writeJson('db.json', {
      v: 1,
      state: {
        runAt: nowSec,
        cumAt: quality.partial ? state.cumAt || 0 : nowSec,
        fleets: { ...carriedFleets, ...Object.fromEntries(fleets.map((f) => [f.a, { lc: f.lc, hp: f.hp, sp: f.sp, k: f.s.kind,
          n: f.n, o: f.o, fa: f.fa, npc: f.npc, x: f.x, y: f.y, ships: f.ships, hpMax: f.hpMax }])) },
        starbases: Object.fromEntries(systems.map((s) => [s.a, { lc: s.lc, hp: s.hp, f: s.f }])),
        asteroidCum,
        ident: nextIdent, // last known name / wallet per owner, with the time each was read
      },
      history, events, owners: ownerSeries,
    });
    // The first version's cursor is consumed now. Retire it, so a later missing db.json means a fresh
    // cursor - never a silent resume from a days-old one.
    if (existsSync(join(OUT, 'state.json'))) { renameSync(join(OUT, 'state.json'), join(OUT, 'state.json.migrated')); log('migrated legacy state.json -> db.json'); }
    writeJson('history.json', history);
    writeJson('events.json', events);
    writeJson('owners.json', ownerSeries);
    if (bodies && bodies.length) writeJson('bodies.json', { generatedAt: nowSec, bodies });
    writeJson('latest.json', latest);
    log(`WROTE fleets=${fleets.length} owners=${ownerIds.length} mining=${byState.mining || 0} asteroids=${kpis.activeAsteroids}`,
      `galaxyUps=${kpis.galaxyUps} addedEvents=${added.length} totalEvents=${events.length} history=${history.length}`,
      `partial=${quality.partial} firstRun=${firstRun} took=${Date.now() - t0}ms`);
    return quality.partial ? 2 : 0;
  } finally {
    try { await ctx?.dispose?.(); } catch (e) { log('WARN dispose failed', e.message); }
    unlock();
  }
}

// db.json; or, once, the first version's state.json + served files; or a fresh cursor. A fresh cursor
// recovers history/events/owners from the served copies and re-seeds (seed events dedupe against them).
function loadDb() {
  const db = readJson('db.json', null);
  if (db) return db;
  const legacy = readJson('state.json', null);
  if (!legacy) log('WARN no db.json - starting a fresh cursor (first-run seeding); history/events/owners recovered from the served copies');
  return {
    v: 1,
    state: legacy ? { ...legacy, cumAt: legacy.cumAt ?? legacy.runAt } : { runAt: 0, cumAt: 0, fleets: {}, starbases: {}, asteroidCum: {} },
    history: readJson('history.json', []),
    events: readJson('events.json', []),
    owners: readJson('owners.json', {}),
  };
}

const once = process.argv.includes('--once');
async function main() {
  for (;;) {
    rotateLog(); // loop mode runs for weeks: rotate per pass, not only at start
    let code = 1;
    let timer;
    const pass = { aborted: false, ctx: null, abort: new AbortController() };
    let run;
    try {
      const timeout = new Promise((_, rej) => {
        timer = setTimeout(() => {
          pass.aborted = true;                                   // the commit point checks this
          pass.abort.abort();                                    // aborts the identity / price reads
          Promise.resolve(pass.ctx?.dispose?.()).catch(() => {}); // aborts the kit's in-flight reads
          rej(new Error(`pass exceeded ${PASS_TIMEOUT_MS / 60000} min - aborted`));
        }, PASS_TIMEOUT_MS);
      });
      run = collect(pass);
      code = await Promise.race([run, timeout]);
    } catch (e) { log('ERROR', e.code || '', e.stack || e.message); } finally { clearTimeout(timer); }
    // An aborted pass still has to reach its finally (dispose + unlock) before --once exits, or the lock leaks.
    if (pass.aborted && run) await Promise.race([run.catch(() => {}), new Promise((r) => setTimeout(r, 20_000))]);
    // --once exit: 0 full pass, 2 partial pass (written, marked partial), 1 failed (nothing written)
    if (once) process.exit(code);
    log(`sleeping ${INTERVAL_MIN} min`);
    await new Promise((r) => setTimeout(r, INTERVAL_MIN * 60_000));
  }
}
// Run only as a program; Test/c4-collector-check.js imports this file for its decoders and collect().
const isMain = process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (isMain) main();
