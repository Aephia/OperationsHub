// c4-collector-check.js - checks the C4 Live collector's owner identity + wealth enrichment (Tools/c4-live/collector.mjs).
// Run from the repo root:  node Test/c4-collector-check.js            (offline units + live decoders + live degrade passes)
//                          node Test/c4-collector-check.js --offline  (units only, no network)
// Exit 0 = all pass, 1 = a check failed.
// Every rule is also run against a deliberately broken version (a "mutant"); a check that does not FAIL on its mutant
// is itself a failure. The degrade check runs the REAL collect() three times against z.ink in temp dirs (never the
// served Data/c4-live files): once as written, and twice as a mutant whose enrichment failure aborts the pass.
// C4_COLLECTOR=<file next to collector.mjs> runs the suite against another copy (e.g. the pre-change base).
// Network: z.ink (reads only). Mainnet: at most ONE getAccountInfo, ever - the known order is cached in
// Data/c4-live/.check-order.json after the first run.

'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.join(__dirname, '..');
const KIT_DIR = path.join(ROOT, 'Tools', 'c4-live');
const COLLECTOR = path.resolve(KIT_DIR, process.env.C4_COLLECTOR || 'collector.mjs');
const DATA = path.join(ROOT, 'Data', 'c4-live');
const OFFLINE = process.argv.includes('--offline');
const ZINK = 'https://testnet-rpc.z.ink';
const MAINNET = 'https://api.mainnet-beta.solana.com';
const KNOWN_PROFILE = '6D19UBwK6WvyC6EVf7JSskmuyJsECBRivMyam2jP7ADE'; // researcher-c4-chain: PlayerName "L3V3L-X"
const KNOWN_ORDER = '3zkqkPf6v4wkiog3xJBQn1DtpPHGrCamQu8RVYGN9B2j';    // researcher-c4-chain p10/p11: an ATLAS-quoted order
const SAGE_PROGRAM = 'C4SAgeKLgb3pTLWhVr6NRwWyYFuTR7ZeSXFrzoLwfMzF';

let fails = 0, passes = 0;
const ok = (cond, msg) => { if (cond) { passes++; console.log('  PASS ' + msg); } else { fails++; console.log('  FAIL ' + msg); } };
// A mutant run: `fn` returns the list of failed case names; it must be non-empty.
const mutantFails = (label, failed) => ok(failed.length > 0, `mutant "${label}" is caught (${failed.length} case(s) fail on it: ${failed.slice(0, 3).join('; ')})`);

async function rpc(url, method, params) {
  const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) });
  const j = await r.json();
  if (j.error) throw new Error(method + ' ' + JSON.stringify(j.error));
  return j.result;
}

async function main() {
  console.log('collector under test: ' + COLLECTOR);
  process.env.C4_OUT_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'c4-check-units-'));
  const C = await import(pathToFileURL(COLLECTOR).href);
  for (const k of ['sanitizeName', 'decodePlayerName', 'decodeProfileWallet', 'decodeOrder', 'buildPriceBook', 'matchHull', 'priceIndex', 'collect']) {
    ok(typeof C[k] === 'function', `collector exports ${k}()`);
  }
  if (fails) { console.log(`\n${passes} passed, ${fails} FAILED (the collector under test lacks the enrichment API)`); process.exit(1); }
  const kit = await import(pathToFileURL(path.join(KIT_DIR, 'node_modules', '@solana', 'kit', 'dist', 'index.node.mjs')).href);
  const enc = kit.getAddressEncoder();

  // ---- 1. sanitiser ------------------------------------------------------------------------------
  console.log('\n[1] name sanitiser');
  const long = 'X'.repeat(40);
  const nameCases = [
    ['bidi override stripped', 'abc‮dcba‬', (r) => r.name === 'abcdcba'],
    ['isolates + marks stripped', '⁦Admin⁩‎‏', (r) => r.name === 'Admin'],
    ['C0 / C1 / DEL controls stripped', 'a\u0000b\u0007\u001Bc\u007F\u0085d', (r) => r.name === 'abcd'],
    ['newline/tab collapse to one space, trimmed', '  Hello\n\t World  ', (r) => r.name === 'Hello World'],
    ['overlong capped at 32 + flagged', long, (r) => r.name === 'X'.repeat(32) && r.trunc === true && r.len === 40],
    ['cap never splits a surrogate pair', 'a'.repeat(31) + '\u{1F600}\u{1F600}', (r) => Array.from(r.name).length === 32 && r.name.endsWith('\u{1F600}') && !/[\uD800-\uDBFF]$/.test(r.name)],
    ['control-only name is null', '‎‮ \u0000', (r) => r.name === null],
    ['ordinary name unchanged', 'L3V3L-X', (r) => r.name === 'L3V3L-X' && r.trunc === false],
  ];
  const runNames = (fn) => nameCases.filter(([, input, pred]) => { let r; try { r = fn(input); } catch { return true; } return !pred(r); }).map(([n]) => n);
  const realNameFails = runNames(C.sanitizeName);
  for (const [n] of nameCases) ok(!realNameFails.includes(n), 'sanitizeName: ' + n);
  mutantFails('no sanitising (pass-through)', runNames((s) => ({ name: s, len: s.length, trunc: false })));
  mutantFails('cap by UTF-16 units', runNames((s) => { const c = s.replace(/[\u0000-\u001F\u007F-\u009F‎‏‪-‮⁦-⁩]/g, '').replace(/\s+/g, ' ').trim(); return { name: c.slice(0, 32) || null, len: c.length, trunc: c.length > 32 }; }));

  // ---- 2. wallet scope rule (synthetic Profile accounts) ----------------------------------------
  console.log('\n[2] wallet = profileKeys[0] only when scoped to the player-profile program');
  const WALLET = 'CJZZvk419nvr7CAG5tF61JhrEwx251EWKjTiKfP49Zz5';
  const mkProfile = (keys) => {
    const b = Buffer.alloc(30 + keys.length * 80);
    b.writeUInt16LE(keys.length, 28);
    keys.forEach(([key, scope], i) => { Buffer.from(enc.encode(key)).copy(b, 30 + i * 80); Buffer.from(enc.encode(scope)).copy(b, 62 + i * 80); });
    return b;
  };
  const walletCases = [
    ['profile-scoped key 0 -> wallet', mkProfile([[WALLET, C.PROFILE_PROGRAM]]), C.PROFILE_PROGRAM, (r) => r.wallet === WALLET && r.why === null],
    ['SAGE-scoped key 0 (session key) -> null + reason', mkProfile([[WALLET, SAGE_PROGRAM]]), C.PROFILE_PROGRAM, (r) => r.wallet === null && /scoped/.test(r.why)],
    ['key 1 profile-scoped does not count', mkProfile([[WALLET, SAGE_PROGRAM], [KNOWN_PROFILE, C.PROFILE_PROGRAM]]), C.PROFILE_PROGRAM, (r) => r.wallet === null],
    ['account owned by another program -> null', mkProfile([[WALLET, C.PROFILE_PROGRAM]]), SAGE_PROGRAM, (r) => r.wallet === null],
    ['zero keys -> null', mkProfile([]), C.PROFILE_PROGRAM, (r) => r.wallet === null],
    ['truncated key list -> null', mkProfile([[WALLET, C.PROFILE_PROGRAM]]).subarray(0, 60), C.PROFILE_PROGRAM, (r) => r.wallet === null],
  ];
  const runWallet = (fn) => walletCases.filter(([, buf, owner, pred]) => { let r; try { r = fn(buf, owner); } catch { return true; } return !pred(r); }).map(([n]) => n);
  const realWalletFails = runWallet(C.decodeProfileWallet);
  for (const [n] of walletCases) ok(!realWalletFails.includes(n), 'decodeProfileWallet: ' + n);
  const dec = kit.getAddressDecoder();
  mutantFails('scope ignored', runWallet((b) => (b.length >= 62 && b.readUInt16LE(28) ? { wallet: dec.decode(b.subarray(30, 62)), why: null } : { wallet: null, why: 'x' })));

  // ---- 3. order decode + price book (synthetic) ------------------------------------------------
  console.log('\n[3] marketplace order decode + best bid / ask');
  const ASSET = 'HYDR4EPHJcDPcaLYUcNCtrXUdt1PnaN4MvE655pevBYp';
  const mkOrder = (currency, side, priceRaw, rem) => {
    const b = Buffer.alloc(201);
    Buffer.from(enc.encode(currency)).copy(b, 40); Buffer.from(enc.encode(ASSET)).copy(b, 72);
    b[168] = side; b.writeBigUInt64LE(BigInt(priceRaw), 169); b.writeBigUInt64LE(100n, 177); b.writeBigUInt64LE(BigInt(rem), 185); b.writeBigInt64LE(1700000000n, 193);
    return b;
  };
  const raw = [mkOrder(C.ATLAS_MINT, 0, 42000, 5), mkOrder(C.ATLAS_MINT, 0, 41000, 5), mkOrder(C.ATLAS_MINT, 1, 46499, 5), mkOrder(C.ATLAS_MINT, 1, 50000, 5),
    mkOrder(C.ATLAS_MINT, 0, 99000, 0) /* filled: ignored */, mkOrder(C.USDC_MINT, 1, 1140000, 3), mkOrder(SAGE_PROGRAM, 1, 1, 1) /* other currency */];
  const nfts = [{ mint: ASSET, name: 'Hydrogen', symbol: 'HYG', attributes: { itemType: 'resource' } }];
  const bookOf = (decode) => C.buildPriceBook(raw.map(decode), nfts, 123);
  const priceCases = [
    ['ATLAS best bid = highest live buy (filled 99000 ignored)', (P) => P.items[0]?.atlas?.bestBid === 0.00042],
    ['ATLAS best ask = lowest sell', (P) => P.items[0]?.atlas?.bestAsk === 0.00046499],
    ['USDC kept separately at 1e6', (P) => P.items[0]?.usdc?.bestAsk === 1.14 && P.items[0]?.usdc?.bestBid === null],
    ['other currencies counted, not priced', (P) => P.counts.otherCurrency === 1],
    ['item named from the nfts list', (P) => P.items[0]?.name === 'Hydrogen' && P.items[0]?.itemType === 'resource'],
  ];
  const runPrice = (decode) => { let P; try { P = bookOf(decode); } catch (e) { return ['threw: ' + e.message]; } return priceCases.filter(([, pred]) => !pred(P)).map(([n]) => n); };
  const realPriceFails = runPrice(C.decodeOrder);
  for (const [n] of priceCases) ok(!realPriceFails.includes(n), 'price book: ' + n);
  // p10's first guess (a version byte: everything +1) - the layout bug the researcher corrected
  mutantFails('layout shifted by a version byte', runPrice((b) => ({ currency: dec.decode(b.subarray(41, 73)), asset: dec.decode(b.subarray(73, 105)), side: b[137], priceRaw: b.readBigUInt64LE(138), origQty: 0n, remQty: b.readBigUInt64LE(146), createdAt: 0 })));

  // ---- 4. hull / cargo matching ----------------------------------------------------------------
  console.log('\n[4] z.ink -> mainnet reference match');
  const idx = C.priceIndex({ items: [
    { name: 'Armstrong IMP', mint: 'a', itemType: 'ship', atlas: { bestBid: 1, bestAsk: 2 } },
    { name: 'Armstrong IMP Tip', mint: 'b', itemType: 'ship', atlas: { bestBid: 3, bestAsk: null } },
    { name: 'Pearce X4', mint: 'c', itemType: 'ship', atlas: { bestBid: 5, bestAsk: 6 } },
    { name: 'Hydrogen', mint: 'd', itemType: 'resource', atlas: { bestBid: 0.1, bestAsk: 0.2 } },
    { name: 'Unpriced', mint: 'e', itemType: 'ship', usdc: { bestBid: 1, bestAsk: 1 } },
  ] });
  const matchCases = [
    ['longest whole-word prefix wins', (m) => m('Armstrong IMP Tip Mining Min Config')?.name === 'Armstrong IMP Tip'],
    ['shorter hull still matches', (m) => m('Armstrong IMP Default Config')?.name === 'Armstrong IMP'],
    ['no partial-word match (X40 is not X4)', (m) => m('Pearce X40 Default Config') === null],
    ['USDC-only item cannot value in ATLAS', (m) => m('Unpriced Default Config') === null],
  ];
  const runMatch = (m) => matchCases.filter(([, pred]) => { try { return !pred(m); } catch { return true; } }).map(([n]) => n);
  const realMatchFails = runMatch((n) => C.matchHull(n, idx));
  for (const [n] of matchCases) ok(!realMatchFails.includes(n), 'matchHull: ' + n);
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  mutantFails('shortest prefix / raw startsWith', runMatch((n) => [...idx.ships].reverse().find((s) => norm(n).startsWith(s.n)) || null));
  ok(C.matchCargo('Hydrogen', idx)?.name === 'Hydrogen' && C.matchCargo('Hydrogen Ore', idx) === null, 'matchCargo: exact normalised name only');

  if (OFFLINE) return;

  // ---- 5. live decoders vs independent decoders -------------------------------------------------
  console.log('\n[5] live: PlayerName + Profile decode vs the official decoders');
  const pp = await import(pathToFileURL(path.join(KIT_DIR, 'node_modules', '@staratlas', 'dev-player-profile', 'dist', 'dist.es.js')).href);
  const [pda] = await kit.getProgramDerivedAddress({ programAddress: C.PROFILE_PROGRAM, seeds: [Buffer.from('player_name'), enc.encode(KNOWN_PROFILE)] });
  const acc = await rpc(ZINK, 'getAccountInfo', [pda, { encoding: 'base64' }]);
  const nameBuf = Buffer.from(acc.value.data[0], 'base64');
  const official = pp.getPlayerNameDecoder().decode(nameBuf);
  const mine = C.decodePlayerName(nameBuf);
  // the official decoder returns the name as UTF-8 bytes (a number array), not a string
  const offName = typeof official.name === 'string' ? official.name : new TextDecoder().decode(Uint8Array.from(official.name));
  console.log(`    PDA ${pda} official=${JSON.stringify(offName)} (bytes ${official.name.length}) profile=${official.profile}`);
  ok(typeof mine.raw === 'string' && offName.length > 0 && mine.raw === offName && mine.profile === official.profile, 'decodePlayerName matches @staratlas/dev-player-profile getPlayerNameDecoder');
  ok(C.sanitizeName(mine.raw).name === 'L3V3L-X', 'known profile 6D19UB... is named "L3V3L-X"');
  ok(utf8At(nameBuf, 41) !== offName && utf8At(nameBuf, 43) !== offName, 'negative: reading the name one byte early or late does NOT match (the check can see an offset bug)');
  let threw = false; try { C.decodePlayerName(Buffer.concat([Buffer.alloc(8), nameBuf.subarray(8)])); } catch { threw = true; }
  ok(threw, 'negative: a wrong discriminator is rejected');

  const { createSolanaRpc } = kit;
  const { createSageContext } = await import(pathToFileURL(path.join(KIT_DIR, 'node_modules', '@aephia', 'atlas-kit', 'dist', 'client', 'index.js')).href);
  const { getProfile } = await import(pathToFileURL(path.join(KIT_DIR, 'node_modules', '@aephia', 'atlas-kit', 'dist', 'identity', 'index.js')).href);
  const ctx = createSageContext({ cluster: 'zink-ptr', rpc: createSolanaRpc(ZINK) });
  const prof = await getProfile(ctx, KNOWN_PROFILE);
  const pacc = await rpc(ZINK, 'getAccountInfo', [KNOWN_PROFILE, { encoding: 'base64' }]);
  const w = C.decodeProfileWallet(Buffer.from(pacc.value.data[0], 'base64'), pacc.value.owner);
  console.log(`    kit keys[0] ${prof.keys[0].address} scope ${prof.keys[0].scope}; collector wallet ${w.wallet}`);
  ok(w.wallet === prof.keys[0].address && prof.keys[0].scope === C.PROFILE_PROGRAM, 'decodeProfileWallet matches atlas-kit getProfile().keys[0] for 6D19UB...');
  await ctx.dispose?.();

  console.log('\n[6] live: a real mainnet order (cached after the first fetch)');
  const cacheF = path.join(DATA, '.check-order.json');
  let ob64;
  try { ob64 = JSON.parse(fs.readFileSync(cacheF, 'utf8'))[KNOWN_ORDER]; } catch { /* none */ }
  if (!ob64) {
    const r = await rpc(MAINNET, 'getAccountInfo', [KNOWN_ORDER, { encoding: 'base64' }]);
    if (!r.value) throw new Error('known order account is gone on mainnet - pick another');
    ob64 = r.value.data[0];
    fs.mkdirSync(DATA, { recursive: true });
    fs.writeFileSync(cacheF, JSON.stringify({ [KNOWN_ORDER]: ob64, owner: r.value.owner, fetchedAt: Math.floor(Date.now() / 1000) }));
  }
  const ob = Buffer.from(ob64, 'base64');
  const o = C.decodeOrder(ob);
  console.log(`    ${KNOWN_ORDER}: currency ${o.currency} side ${o.side} price ${Number(o.priceRaw) / 1e8} ATLAS rem ${o.remQty}/${o.origQty} created ${new Date(o.createdAt * 1000).toISOString()}`);
  ok(o.currency === C.ATLAS_MINT, 'known order decodes to the ATLAS currency mint');
  ok((o.side === 0 || o.side === 1) && o.priceRaw > 0n && o.origQty >= o.remQty && o.createdAt > 1.6e9 && o.createdAt < Date.now() / 1000 + 86400, 'known order: side, price, quantities and createdAt are sane');
  ok(dec.decode(ob.subarray(41, 73)) !== C.ATLAS_MINT, 'negative: the version-byte layout (+1) does NOT yield ATLAS');

  // ---- 7. degrade path: the REAL collect() with failing enrichment -----------------------------
  console.log('\n[7] live degrade: name/wallet and price reads fail -> core pass still commits, last values kept');
  const real = await degradeRun(COLLECTOR, 'real');
  const realFails = degradeVerdict(real);
  for (const f of real.cases) ok(!realFails.includes(f[0]), 'degrade: ' + f[0]);
  for (const [label, from, to] of [
    ['identity failure aborts the pass', /try \{ ident = await readIdent\(rpc, ownerIds, pass\.abort\.signal\); \} catch \(e\) \{[^\n]*\}/, 'ident = await readIdent(rpc, ownerIds, pass.abort.signal);'],
    ['price failure aborts the pass', /try \{ pr = await readPrices\(pass, nowSec\); \} catch \(e\) \{[^\n]*\}/, 'pr = await readPrices(pass, nowSec);'],
  ]) {
    // the public z.ink endpoint rate-limits three back-to-back passes (a run on 2026-11-07 lost 96 character
    // reads on the 3rd); pause so the mutant runs stay comparable to the real one
    await new Promise((r) => setTimeout(r, 30_000));
    const src = fs.readFileSync(COLLECTOR, 'utf8');
    if (!from.test(src)) { ok(false, `mutant "${label}": target line not found in the collector`); continue; }
    const mf = path.join(KIT_DIR, `.mutant-${process.pid}.mjs`);
    fs.writeFileSync(mf, src.replace(from, to));
    try { mutantFails(label, degradeVerdict(await degradeRun(mf, label))); } finally { fs.unlinkSync(mf); }
  }
}

function utf8At(buf, at) { return new TextDecoder().decode(buf.subarray(at)); }

// Seeds a temp out dir with the served db/history/events/owners (so the pass diffs as usual), a known previous
// identity for one owner and a fake price cache, then runs collect() with both enrichment readers throwing.
async function degradeRun(file, label) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'c4-check-degrade-'));
  for (const f of ['db.json', 'history.json', 'events.json', 'owners.json']) if (fs.existsSync(path.join(DATA, f))) fs.copyFileSync(path.join(DATA, f), path.join(dir, f));
  let db = fs.existsSync(path.join(dir, 'db.json')) ? JSON.parse(fs.readFileSync(path.join(dir, 'db.json'), 'utf8')) : null;
  if (!db) throw new Error('Data/c4-live/db.json missing - run the collector once first');
  // ONLY the known owner has a prior identity: a real pass leaves every owner in state.ident, which made the
  // "no previous identity -> null" case below unreachable (lead, 2026-11-07 12:51 EST: it failed after the first real run)
  db.state.ident = {};
  db.state.ident[KNOWN_PROFILE] = { n: 'PREV-NAME', na: 111, w: 'CJZZvk419nvr7CAG5tF61JhrEwx251EWKjTiKfP49Zz5', wa: 111 };
  fs.writeFileSync(path.join(dir, 'db.json'), JSON.stringify(db));
  fs.writeFileSync(path.join(dir, 'prices.json'), JSON.stringify({ fetchedAt: 222, source: 'test cache', items: [
    { mint: 'm1', name: 'Pearce X4', symbol: 'PX4', itemType: 'ship', atlas: { bestBid: 10, bestAsk: 20, bids: 1, asks: 1, orders: 2 } }] }));
  const historyBefore = db.history.length;
  process.env.C4_OUT_DIR = dir;
  // a fresh module instance per run: OUT is read from the env at import time
  const C = await import(pathToFileURL(file).href + `?run=${encodeURIComponent(label)}-${Date.now()}`);
  const pass = { aborted: false, ctx: null, abort: new AbortController() };
  const boom = async () => { throw new Error('INJECTED read failure'); };
  let code, err = null;
  const t = Date.now();
  try { code = await C.collect(pass, { readIdentities: boom, refreshPrices: boom }); } catch (e) { err = e; }
  console.log(`    [${label}] collect() -> ${err ? 'REJECTED: ' + String(err.message).slice(0, 100) : 'exit ' + code} in ${Date.now() - t} ms (${dir})`);
  const read = (f) => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { return null; } };
  return { err, code, latest: read('latest.json'), db: read('db.json'), historyBefore, cases: DEGRADE_CASES };
}
const DEGRADE_CASES = [
  ['collect() resolves (the pass is not aborted)', (r) => !r.err && (r.code === 0 || r.code === 2)],
  ['latest.json + db.json written this pass', (r) => r.latest && r.db && r.latest.generatedAt === r.db.state.runAt && r.latest.generatedAt > Date.now() / 1000 - 900],
  ['core data present (positive control: owners and fleets)', (r) => r.latest.owners.length > 100 && r.latest.fleets.length > 500],
  ['partial is decided by the core reads only', (r) => { const q = r.latest.quality; const core = q.mineFailed > q.mineTotal * 0.05 || q.charFailed > q.charTotal * 0.05 || !!q.suspectDiscovery; return q.partial === core; }],
  ['history point added on a non-partial pass', (r) => r.latest.quality.partial || r.db.history.length === r.historyBefore + 1],
  ['quality flags + notes name both failures', (r) => r.latest.quality.namesFailed === true && r.latest.quality.walletsFailed === true && r.latest.quality.pricesFailed === true
    && r.latest.quality.notes.some((n) => /identity read failed/.test(n)) && r.latest.quality.notes.some((n) => /price refresh failed/.test(n))],
  ['owner keeps last known name + wallet with their old timestamps', (r) => { const o = r.latest.owners.find((x) => x.p === KNOWN_PROFILE); return o && o.name === 'PREV-NAME' && o.nameAt === 111 && o.wallet === 'CJZZvk419nvr7CAG5tF61JhrEwx251EWKjTiKfP49Zz5' && o.walletAt === 111; }],
  ['db.json carries the last known identity forward', (r) => r.db.state.ident?.[KNOWN_PROFILE]?.n === 'PREV-NAME' && r.db.state.ident[KNOWN_PROFILE].na === 111],
  ['an owner with no previous identity gets null, not a guess', (r) => r.latest.owners.some((o) => o.p !== KNOWN_PROFILE && o.name === null && o.nameAt === null)],
  ['cached prices still value holdings, labelled with their old time', (r) => r.latest.ref?.pricesAt === 222 && r.latest.ref.fetchedThisPass === false
    && r.latest.owners.some((o) => o.holdings?.refValue?.pricesAt === 222 && o.holdings.refValue.basis === 'mainnet reference')],
  ['holdings rolled up from fleets (cargo + hulls)', (r) => r.latest.owners.some((o) => o.holdings?.cargo?.length && Object.keys(o.holdings.hulls).length)],
];
function degradeVerdict(r) {
  return r.cases.filter(([, pred]) => { try { return !pred(r); } catch { return true; } }).map(([n]) => n);
}

main().then(() => {
  console.log(`\n${passes} passed, ${fails} failed`);
  process.exit(fails ? 1 : 0);
}).catch((e) => { console.log('ERROR ' + (e.stack || e.message)); process.exit(1); });
