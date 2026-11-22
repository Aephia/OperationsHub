// c4-collector-check.js - checks the C4 Live collector's owner identity + wealth enrichment (Tools/c4-live/collector.mjs).
// Run from the repo root:  node Test/c4-collector-check.js            (offline units + live decoders + live degrade passes)
//                          node Test/c4-collector-check.js --offline  (units only, no network)
// Exit 0 = all pass, 1 = a check failed.
// [8] chain version + decode sanity and [9] the built browser bundle run offline (fake chain / fake fetch); [9] waits
// 15 s once for the epoch() timeout. C4_BUNDLE=<file> points [9] at another build.
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
const { syncBuiltinESMExports } = require('module');

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

  await epochChecks(C, kit);
  await bundleChecks();

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
  // chain version, live: not pinned (a chain update must not fail this suite), only its shape; 6qaAoz... / 59540350 on 2026-11-20
  const ep = await C.readChainEpoch(createSolanaRpc(ZINK));
  console.log(`    chain version: genesis ${ep.genesis} SAGE deploy slot ${ep.sage}`);
  ok(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(ep.genesis) && Number.isSafeInteger(ep.sage) && ep.sage > 0, 'live readChainEpoch: a genesis hash and a SAGE deploy slot (the program is upgradeable-loader shaped)');

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

// ---- 8. chain version ("epoch"): a chain update starts history again; decode sanity ------------------------
// Offline. collect() runs against a fake chain (deps.chain swaps the kit readers, deps.readEpoch the version read,
// identity and prices are stubbed) in temp dirs, two passes per scenario. The whole suite runs on the collector as
// written and then on one mutant per rule (a copy with that rule's line changed); every mutant must fail a case.
const GEN_A = '6qaAozzun2WV83PRDgqf79WXtbqfnezKB3demjxXV5EY';   // z.ink genesis, read 2026-11-20
const GEN_B = '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY';   // any other valid base58 hash
const E1 = { genesis: GEN_A, sage: 100 }, E1slot = { genesis: GEN_A, sage: 200 }, E1null = { genesis: GEN_A, sage: null }, E2 = { genesis: GEN_B, sage: 100 };
const NOTE_NEW = 'The game was updated on chain. History and events start again from this read.';
const EPOCH_FAIL = new Error('INJECTED epoch read failure');

function fakeWorld(o = {}) {
  const { prefix = 'A', fleets = 40, systems = 40, badSys = 0, badKind = 0, emptyNames = 0, bodiesFail = false, gates = null } = o;
  const sys = Array.from({ length: systems }, (_, i) => ({ address: `${prefix}S${i}`, name: i < emptyNames ? '' : `${prefix} system ${i}`, regionId: 1,
    coordinates: i < badSys ? { x: NaN, y: NaN } : { x: i, y: -i }, starbase: null, celestialBodyAddresses: [`${prefix}B${i}`], connections: [] }));
  // gates: { index: patch } assigns systemId / connections (or any raw field) to chosen fake systems
  if (gates) for (const [i, patch] of Object.entries(gates)) Object.assign(sys[i], patch);
  const fl = Array.from({ length: fleets }, (_, i) => ({ address: `${prefix}F${i}`, name: `${prefix} fleet ${i}`, ownerProfile: { address: `${prefix}P${i % 5}` },
    faction: 'mud', npcFactionId: 0, state: { kind: i < badKind ? 'zzzUnknown' : 'idle' }, location: { x: i, y: i }, hp: 100, sp: 50,
    stats: { combat: { hp: 100, sp: 50 }, cargo: {} }, shipCounts: { total: 1, small: 1 }, ships: [{ name: 'Pearce X4', quantity: 1, sizeClass: 'small' }],
    crewCount: 1, lastCombatUpdate: 1700000000 + i, lastUpdateAt: 1700000000, cargoHold: { items: [] } }));
  const bodies = sys.map((s, i) => ({ address: `${prefix}B${i}`, id: i, name: `${prefix} body ${i}`, kind: 'planet', system: { address: s.address }, details: { resources: [], claimedPlots: [] } }));
  return {
    createSageContext: () => ({ dispose: async () => {} }),
    discoverFleetAddresses: async () => fl.map((f) => f.address),
    getFleets: async () => fl,
    getStarSystems: async () => sys,
    getAllClaimStakes: async () => [],
    getFleetMiningState: async () => null,
    getCharacterForProfile: async () => ({ atlas: 1, xp: {}, counts: {} }),
    listClaimStakeDefinitions: async () => [],
    getAllCelestialBodies: async () => { if (bodiesFail) throw new Error('INJECTED bodies failure'); return bodies; },
    listCargoDefinitions: async () => [],
  };
}
const A40 = () => fakeWorld(), A20 = () => fakeWorld({ fleets: 20 });
const identStub = async (rpc, ownerIds) => ({ names: new Map(ownerIds.map((p) => [p, { name: 'N-' + p, trunc: false }])), wallets: new Map(), notes: [], calls: 0, ms: 0 });
const pricesStub = async () => ({ prices: null, fetched: false, notes: [], calls: 0, ms: 0 });
const dirFiles = (dir) => Object.fromEntries(fs.readdirSync(dir).sort().map((f) => [f, fs.readFileSync(path.join(dir, f), 'utf8')]));
const sameFiles = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let epochImport = 0;

// steps: [{ world, epoch (object or an Error to throw), before(dir) }] -> one result per pass
async function epochScenario(file, steps) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'c4-check-epoch-'));
  process.env.C4_OUT_DIR = dir;
  const M = await import(pathToFileURL(file).href + `?epoch=${++epochImport}`);  // OUT is read at import time
  const out = [];
  try {
    for (const st of steps) {
      if (st.before) st.before(dir);
      const before = dirFiles(dir);
      const readEpoch = st.epoch instanceof Error ? async () => { throw st.epoch; } : async () => ({ ...st.epoch });
      const pass = { aborted: false, ctx: null, abort: new AbortController() };
      let code, err = null;
      const orig = console.log; console.log = () => {};   // the collector logs every pass
      // st.crashAt: the rename onto that served file throws - a crash part-way through the writes. The collector's
      // named `node:fs` imports are live bindings, refreshed by syncBuiltinESMExports.
      const realRename = fs.renameSync;
      if (st.crashAt) { fs.renameSync = (a, b) => { if (path.basename(String(b)) === st.crashAt) throw new Error('INJECTED crash at ' + st.crashAt); return realRename(a, b); }; syncBuiltinESMExports(); }
      try { code = await M.collect(pass, { chain: st.world, readEpoch, readIdentities: identStub, refreshPrices: pricesStub }); } catch (e) { err = e; } finally {
        console.log = orig;
        if (st.crashAt) { fs.renameSync = realRename; syncBuiltinESMExports(); }
      }
      const after = dirFiles(dir);
      const j = (f) => { try { return JSON.parse(after[f]); } catch { return null; } };
      out.push({ code, err, before, after, latest: j('latest.json'), db: j('db.json'), bodies: j('bodies.json'), history: j('history.json'), events: j('events.json') });
    }
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  return out;
}
const notesOf = (r) => (r.latest && r.latest.quality && r.latest.quality.notes) || [];
const allB = (keys) => keys.length > 0 && keys.every((k) => k.startsWith('B'));
const stripEpoch = (dir) => { const f = path.join(dir, 'db.json'); const d = JSON.parse(fs.readFileSync(f, 'utf8')); delete d.state.epoch; fs.writeFileSync(f, JSON.stringify(d)); };

const EPOCH_SCENARIOS = [
  ['same epoch', [{ world: A40(), epoch: E1 }, { world: A20(), epoch: E1 }], [
    ['same epoch: stored epoch kept, changed false, no update note', ([a, b]) => b.latest.epoch.changed === false && b.db.state.epoch.genesis === GEN_A && b.db.state.epoch.sage === 100 && b.db.state.epoch.since === a.db.state.epoch.since && !notesOf(b).includes(NOTE_NEW)],
    ['same epoch: 10 % vanish guard still fires (suspect, partial, 20 fleets carried)', ([, b]) => b.latest.quality.suspectDiscovery === true && b.latest.quality.partial === true && Object.keys(b.db.state.fleets).length === 40],
    ['same epoch (positive control): history and events carried over', ([a, b]) => a.db.events.length > 0 && b.db.history.length === 1 && b.db.events.length >= a.db.events.length && b.db.events.some((e) => e.f === 'AF0')],
  ]],
  ['old data without an epoch', [{ world: A40(), epoch: E1 }, { before: stripEpoch, world: A20(), epoch: E1 }], [
    ['no stored epoch (positive control): the saved db really had none', ([, b]) => JSON.parse(b.before['db.json']).state.epoch === undefined],
    ['no stored epoch: the epoch read is adopted, changed false', ([, b]) => b.db.state.epoch && b.db.state.epoch.genesis === GEN_A && b.db.state.epoch.sage === 100 && b.latest.epoch.changed === false],
    ['no stored epoch: no reset (vanish guard fires, history and events kept)', ([a, b]) => b.latest.quality.suspectDiscovery === true && b.db.history.length === 1 && b.db.events.length >= a.db.events.length],
  ]],
  ['changed genesis', [{ world: A40(), epoch: E1 }, { world: fakeWorld({ prefix: 'B', fleets: 30 }), epoch: E2 }], [
    ['new genesis: latest.epoch.changed true, new genesis stored with since = this pass', ([, b]) => b.latest.epoch.changed === true && b.latest.epoch.genesis === GEN_B && b.db.state.epoch.genesis === GEN_B && b.db.state.epoch.since === b.latest.generatedAt],
    ['new genesis: no gone events, no carried fleets', ([, b]) => !b.db.events.some((e) => e.k === 'gone') && allB(Object.keys(b.db.state.fleets)) && Object.keys(b.db.state.fleets).length === 30 && !b.latest.quality.suspectDiscovery],
    ['new genesis: history length 1, not partial, first-run (no newFleet events)', ([, b]) => b.db.history.length === 1 && b.history.length === 1 && b.latest.quality.partial === false && !b.db.events.some((e) => e.k === 'newFleet')],
    ['new genesis: old events, owner series and identity cache dropped', ([, b]) => b.db.events.length > 0 && b.db.events.every((e) => String(e.f || e.sys).startsWith('B')) && b.events.every((e) => String(e.f || e.sys).startsWith('B'))
      && allB(Object.keys(b.db.owners)) && allB(Object.keys(b.db.state.ident))],
    ['new genesis: the plain-words note is in quality.notes', ([, b]) => notesOf(b).includes(NOTE_NEW)],
  ]],
  ['changed SAGE deploy slot', [{ world: A40(), epoch: E1 }, { world: fakeWorld({ prefix: 'B', fleets: 30 }), epoch: E1slot }], [
    ['new SAGE slot: changed true, history 1, not partial, no gone, nothing carried', ([, b]) => b.latest.epoch.changed === true && b.db.state.epoch.sage === 200 && b.db.history.length === 1
      && b.latest.quality.partial === false && !b.db.events.some((e) => e.k === 'gone') && allB(Object.keys(b.db.state.fleets))],
  ]],
  ['slot unknown now', [{ world: A40(), epoch: E1 }, { world: A20(), epoch: E1null }], [
    ['slot unknown in the new read: same epoch (no reset), stored slot kept', ([, b]) => b.latest.epoch.changed === false && b.latest.quality.suspectDiscovery === true && b.db.state.epoch.sage === 100],
  ]],
  ['slot unknown before', [{ world: A40(), epoch: E1null }, { world: A20(), epoch: E1 }], [
    ['slot unknown in the stored epoch: same epoch (no reset), slot filled in', ([, b]) => b.latest.epoch.changed === false && b.latest.quality.suspectDiscovery === true && b.db.state.epoch.sage === 100],
  ]],
  ['epoch read fails', [{ world: A40(), epoch: E1 }, { world: A20(), epoch: EPOCH_FAIL }], [
    ['epoch read fails: pass written, no reset (vanish guard, history kept)', ([a, b]) => !b.err && b.latest.quality.suspectDiscovery === true && b.db.history.length === 1 && b.db.events.length >= a.db.events.length],
    ['epoch read fails: stored epoch kept unchanged, changed false', ([a, b]) => JSON.stringify(b.db.state.epoch) === JSON.stringify(a.db.state.epoch) && b.latest.epoch.changed === false],
    ['epoch read fails: a quality note says the check could not be made', ([, b]) => notesOf(b).some((n) => /Could not check whether the game was updated/.test(n))],
  ]],
  ['epoch read fails on a first run', [{ world: A40(), epoch: EPOCH_FAIL }], [
    ['epoch read fails, nothing stored: written with latest.epoch null and no state.epoch', ([a]) => !a.err && a.latest && a.latest.epoch === null && a.db.state.epoch === undefined],
  ]],
  ['new epoch, zero fleets', [{ world: A40(), epoch: E1 }, { world: fakeWorld({ prefix: 'B', fleets: 0 }), epoch: E2 }], [
    ['new epoch + zero fleets + systems read: written as an empty galaxy with a note', ([, b]) => !b.err && b.latest.fleets.length === 0 && b.latest.systems.length === 40 && b.latest.epoch.changed === true
      && notesOf(b).some((n) => /No fleets were read/.test(n)) && Object.keys(b.db.state.fleets).length === 0],
  ]],
  ['first run, zero fleets', [{ world: fakeWorld({ fleets: 0 }), epoch: E1 }], [
    ['first run + zero fleets + systems read: written', ([a]) => !a.err && a.latest && a.latest.fleets.length === 0],
  ]],
  ['same epoch, zero fleets', [{ world: A40(), epoch: E1 }, { world: fakeWorld({ fleets: 0 }), epoch: E1 }], [
    ['same epoch + zero fleets: still refused, every file byte-identical', ([, b]) => b.err && /zero fleets/.test(b.err.message) && sameFiles(b.before, b.after)],
  ]],
  ['empty galaxy, then empty again', [{ world: fakeWorld({ fleets: 0 }), epoch: E1 }, { world: fakeWorld({ fleets: 0 }), epoch: E1 }], [
    ['stored empty galaxy + zero fleets again, same version: written (not refused), with the "had none either" note', ([a, b]) => !a.err && a.latest.fleets.length === 0
      && !b.err && b.latest && b.latest.fleets.length === 0 && b.latest.systems.length === 40 && b.latest.epoch.changed === false && notesOf(b).some((n) => /had none either/.test(n))],
  ]],
  ['new-version empty galaxy, then empty again', [{ world: A40(), epoch: E1 }, { world: fakeWorld({ prefix: 'B', fleets: 0 }), epoch: E2 }, { world: fakeWorld({ prefix: 'B', fleets: 0 }), epoch: E2 }], [
    ['empty galaxy written on a new version, next zero-fleet pass on that version: written', ([, b, c]) => !b.err && !c.err && c.latest.fleets.length === 0 && c.latest.epoch.genesis === GEN_B && c.latest.epoch.changed === false],
  ]],
  ['empty galaxy, then fleets, then empty', [{ world: fakeWorld({ fleets: 0 }), epoch: E1 }, { world: A40(), epoch: E1 }, { world: fakeWorld({ fleets: 0 }), epoch: E1 }], [
    ['stored state has fleets again: a zero-fleet pass is refused, every file byte-identical', ([, b, c]) => !b.err && b.latest.fleets.length === 40 && c.err && /zero fleets/.test(c.err.message) && sameFiles(c.before, c.after)],
  ]],
  ['new epoch, crash right after db.json', [{ world: A40(), epoch: E1 }, { world: fakeWorld({ prefix: 'B', fleets: 30 }), epoch: E2, crashAt: 'history.json' }], [
    ['crash after the commit point (positive control): the crash happened and db.json already holds the new version', ([a, b]) => a.bodies && a.bodies.bodies.length === 40
      && b.err && /INJECTED crash at history\.json/.test(b.err.message) && b.db && b.db.state.epoch.genesis === GEN_B],
    ['crash after the commit point on a new version: bodies.json is the "could not be read" marker, never the old game\'s bodies', ([, b]) => b.bodies && b.bodies.bodies === null && b.bodies.failed === true],
  ]],
  ['new epoch, bodies read', [{ world: A40(), epoch: E1 }, { world: fakeWorld({ prefix: 'B', fleets: 30 }), epoch: E2 }], [
    ['new epoch + bodies read (control): bodies.json holds the new game\'s bodies', ([, b]) => b.bodies && Array.isArray(b.bodies.bodies) && b.bodies.bodies.length === 40 && allB(b.bodies.bodies.map((x) => x.a || x.address || x.n || ''))],
  ]],
  ['new epoch, zero fleets and zero systems', [{ world: A40(), epoch: E1 }, { world: fakeWorld({ prefix: 'B', fleets: 0, systems: 0 }), epoch: E2 }], [
    ['new epoch + zero fleets + zero systems: refused by the zero-fleet guard, every file byte-identical', ([, b]) => b.err && /zero fleets/.test(b.err.message) && sameFiles(b.before, b.after)],
  ]],
  ['garbage positions', [{ world: A40(), epoch: E1 }, { world: fakeWorld({ badSys: 40 }), epoch: E1 }], [
    ['decode sanity: systems without a position refused, nothing written', ([, b]) => b.err && /decode sanity/.test(b.err.message) && sameFiles(b.before, b.after)],
  ]],
  ['garbage names', [{ world: A40(), epoch: E1 }, { world: fakeWorld({ emptyNames: 40 }), epoch: E1 }], [
    ['decode sanity: systems without a name refused, nothing written', ([, b]) => b.err && /decode sanity/.test(b.err.message) && sameFiles(b.before, b.after)],
  ]],
  ['garbage fleet states', [{ world: A40(), epoch: E1 }, { world: fakeWorld({ badKind: 40 }), epoch: E1 }], [
    ['decode sanity: fleets in unknown states refused, nothing written', ([, b]) => b.err && /decode sanity/.test(b.err.message) && sameFiles(b.before, b.after)],
  ]],
  ['garbage on a new epoch', [{ world: A40(), epoch: E1 }, { world: fakeWorld({ prefix: 'B', badSys: 40 }), epoch: E2 }], [
    ['decode sanity on a new epoch: refused before the reset is written', ([, b]) => b.err && /decode sanity/.test(b.err.message) && sameFiles(b.before, b.after)],
  ]],
  ['just under the threshold', [{ world: fakeWorld({ badSys: 3 }), epoch: E1 }], [
    ['decode sanity: 37 of 40 systems (92.5 %) is refused', ([a]) => a.err && /decode sanity/.test(a.err.message) && !a.after['latest.json']],
  ]],
  ['inside the threshold', [{ world: fakeWorld({ badSys: 1, badKind: 1, emptyNames: 0 }), epoch: E1 }], [
    ['decode sanity (positive control): 39 of 40 systems and fleets (97.5 %) is accepted', ([a]) => !a.err && a.latest && a.latest.fleets.length === 40],
  ]],
  ['new epoch, bodies read fails', [{ world: A40(), epoch: E1 }, { world: fakeWorld({ prefix: 'B', bodiesFail: true }), epoch: E2 }], [
    ['new epoch + failed bodies read: old bodies.json replaced by { bodies: null, failed: true }', ([a, b]) => a.bodies && a.bodies.bodies.length === 40 && b.bodies && b.bodies.bodies === null && b.bodies.failed === true
      && b.bodies.generatedAt === b.latest.generatedAt && b.latest.quality.bodiesFailed === true],
  ]],
  ['same epoch, bodies read fails', [{ world: A40(), epoch: E1 }, { world: fakeWorld({ bodiesFail: true }), epoch: E1 }], [
    ['same epoch + failed bodies read (control): previous bodies.json kept', ([a, b]) => b.latest.quality.bodiesFailed === true && b.after['bodies.json'] === a.after['bodies.json'] && b.bodies.bodies.length === 40],
  ]],
  // gate links: id + to ride on every systems row; malformed connections are map decoration and never fail a pass
  ['gate links on the system rows', [{ epoch: E1, world: fakeWorld({ gates: {
      0: { systemId: 5, connections: [{ systemId: 7 }, { systemId: 3 }, { systemId: 7 }] },   // duplicate + unsorted
      1: { systemId: 9, connections: [{ systemId: 9 }, { systemId: 2.5 }, { systemId: 'x' }, { systemId: null }, { systemId: '' }, { systemId: [] }, { systemId: '3' }, {}, null, { systemId: 4 }] }, // self, junk
      2: { systemId: 'abc', connections: [{ systemId: 1 }] },                                  // id not an integer
      3: { systemId: 11, connections: 'oops' },                                                // connections not a list
      4: { systemId: 12, connections: null },
      5: { systemId: 13, connections: undefined } } }) }], [
    ['gate links (positive control): systems row 0 keeps its name, id 5 and links 2', ([a]) => !a.err && a.latest.systems[0].n === 'A system 0' && a.latest.systems[0].id === 5 && a.latest.systems[0].links === 2],
    ['gate links: connections [7, 3, 7] -> to [3, 7], links 2', ([a]) => JSON.stringify(a.latest.systems[0].to) === '[3,7]' && a.latest.systems[0].links === a.latest.systems[0].to.length],
    ['gate links: own id, fraction, text, null, empty and null entries are dropped -> to [4]', ([a]) => JSON.stringify(a.latest.systems[1].to) === '[4]' && a.latest.systems[1].links === 1],
    ['gate links: a systemId that is not an integer gives id null, its connections still count', ([a]) => a.latest.systems[2].id === null && JSON.stringify(a.latest.systems[2].to) === '[1]'],
    ['gate links: connections as text / null / missing give to [] and a normal pass', ([a]) => [3, 4, 5].every((i) => Array.isArray(a.latest.systems[i].to) && a.latest.systems[i].to.length === 0 && a.latest.systems[i].links === 0) && a.latest.quality.partial === false],
    ['gate links: a system with no connections (the fake default) has id null and to []', ([a]) => a.latest.systems[6].id === null && JSON.stringify(a.latest.systems[6].to) === '[]' && a.latest.systems[6].links === 0],
  ]],
];

// readChainEpoch against a fake RPC. full = the programdata account's bytes; dataSlice is honoured like a real node.
function fakeRpc(o = {}) {
  const { genesis = GEN_A, genesisFail = false, progOwner = 'BPFLoaderUpgradeab1e11111111111111111111111', progBytes, pdOwner = 'BPFLoaderUpgradeab1e11111111111111111111111', pdFail = false, slot = 59540350n } = o;
  const prog = progBytes || (() => { const b = Buffer.alloc(36); b.writeUInt32LE(2, 0); Buffer.alloc(32, 7).copy(b, 4); return b; })();
  const pd = Buffer.alloc(45); pd.writeUInt32LE(3, 0); pd.writeBigUInt64LE(slot, 4); pd[12] = 1;
  const calls = [];
  const send = (fn) => ({ send: async (opt) => { if (opt && opt.abortSignal && opt.abortSignal.aborted) throw new Error('aborted'); return fn(); } });
  return {
    calls,
    getGenesisHash: () => { calls.push('genesis'); return send(() => { if (genesisFail) throw new Error('INJECTED genesis failure'); return genesis; }); },
    getAccountInfo: (addr, cfg) => { calls.push('account'); return send(() => {
      if (addr === 'C4SAgeKLgb3pTLWhVr6NRwWyYFuTR7ZeSXFrzoLwfMzF') return { value: { owner: progOwner, data: [prog.toString('base64'), 'base64'] } };
      if (pdFail) throw new Error('INJECTED programdata failure');
      const s = cfg && cfg.dataSlice ? pd.subarray(cfg.dataSlice.offset, cfg.dataSlice.offset + cfg.dataSlice.length) : pd;
      return { value: { owner: pdOwner, data: [Buffer.from(s).toString('base64'), 'base64'] } };
    }); },
  };
}
const READ_CASES = [
  ['readChainEpoch: real layout -> genesis + deploy slot, 3 calls', async (M) => { const r = fakeRpc(); const e = await M.readChainEpoch(r); return e.genesis === GEN_A && e.sage === 59540350 && r.calls.length === 3; }],
  ['readChainEpoch: program not owned by the upgradeable loader -> sage null', async (M) => (await M.readChainEpoch(fakeRpc({ progOwner: 'BPFLoader2111111111111111111111111111111111' }))).sage === null],
  ['readChainEpoch: program account with another tag -> sage null', async (M) => { const b = Buffer.alloc(36); b.writeUInt32LE(3, 0); return (await M.readChainEpoch(fakeRpc({ progBytes: b }))).sage === null; }],
  ['readChainEpoch: programdata read fails -> sage null, genesis kept', async (M) => { const e = await M.readChainEpoch(fakeRpc({ pdFail: true })); return e.sage === null && e.genesis === GEN_A; }],
  ['readChainEpoch: genesis read fails -> rejects', async (M) => { try { await M.readChainEpoch(fakeRpc({ genesisFail: true })); return false; } catch { return true; } }],
  ['readChainEpoch: genesis not a hash -> rejects', async (M) => { try { await M.readChainEpoch(fakeRpc({ genesis: '' })); return false; } catch { return true; } }],
  ['readChainEpoch: an aborted signal rejects', async (M) => { const ac = new AbortController(); ac.abort(); try { await M.readChainEpoch(fakeRpc(), ac.signal); return false; } catch { return true; } }],
];
const SAME_CASES = [
  [E1, E1, true], [E1, E1slot, false], [E1, E2, false], [E1, E1null, true], [E1null, E1, true], [{ genesis: GEN_A }, E1, true],
  [null, E1, false], [E1, undefined, false], [{ genesis: '' }, { genesis: '' }, false], [{ genesis: GEN_A, sage: 0 }, { genesis: GEN_A, sage: 5 }, false],
];

// -> names of the failed cases (empty = all pass)
async function epochSuite(file) {
  const failed = [];
  const udir = fs.mkdtempSync(path.join(os.tmpdir(), 'c4-check-epoch-u-'));
  process.env.C4_OUT_DIR = udir;
  const M = await import(pathToFileURL(file).href + `?epochu=${++epochImport}`);
  fs.rmSync(udir, { recursive: true, force: true }); // the unit cases below write nothing
  for (const [a, b, want] of SAME_CASES) { let r; try { r = M.sameEpoch(a, b); } catch { r = 'threw'; } if (r !== want) failed.push(`sameEpoch(${JSON.stringify(a)}, ${JSON.stringify(b)}) should be ${want}`); }
  for (const [n, fn] of READ_CASES) { let r = false; try { r = await fn(M); } catch { r = false; } if (!r) failed.push(n); }
  for (const [, steps, checks] of EPOCH_SCENARIOS) {
    const res = await epochScenario(file, steps);
    for (const [n, pred] of checks) { let r = false; try { r = !!pred(res); } catch { r = false; } if (!r) failed.push(n); }
  }
  return failed;
}
const EPOCH_MUTANTS = [
  ['a new epoch does not reset the cursor', 'db = freshDb();', ''],
  ['the changed flag is never set', 'epochChanged = true;', ''],
  ['sameEpoch ignores the SAGE slot', 'return !known(a.sage) || !known(b.sage) || a.sage === b.sage;', 'return true;'],
  ['an unknown slot counts as a different epoch', 'return !known(a.sage) || !known(b.sage) || a.sage === b.sage;', 'return a.sage === b.sage;'],
  ['old data without an epoch is reset', "typeof db.state.epoch.genesis === 'string' ? db.state.epoch : null;", "typeof db.state.epoch.genesis === 'string' ? db.state.epoch : { genesis: '' };"],
  ['an epoch read failure aborts the pass', 'try { epochRead = await readEpoch(rpc, pass.abort.signal); } catch (e) {', 'epochRead = await readEpoch(rpc, pass.abort.signal); if (0) {'],
  ['zero fleets always refused', 'if (!(nothingToProtect && systemsRaw.length)) throw', 'if (true) throw'],
  ['zero fleets never refused', 'if (!(nothingToProtect && systemsRaw.length)) throw', 'if (false) throw'],
  ['zero fleets allowed without systems', 'nothingToProtect && systemsRaw.length', 'nothingToProtect'],
  ['a stored empty galaxy still refuses the next zero-fleet pass (C2 removed)', ' || !Object.keys(db.state.fleets || {}).length;', ';'],
  ['zero fleets allowed although the stored state has fleets', ' || !Object.keys(db.state.fleets || {}).length;', ' || true;'],
  ['the empty-again note is the first-read note', 'firstOfVersion ? NOTE_EMPTY_GALAXY : NOTE_EMPTY_AGAIN', 'NOTE_EMPTY_GALAXY'],
  ['no decode sanity guard', 'if (sanity.problem) throw', 'if (false) throw'],
  ['sanity ignores fleet states', 'else if (fleetsRaw.length && fleetOk', 'else if (false && fleetOk'],
  ['sanity threshold 90 %', 'export const SANE_SHARE = 0.95;', 'export const SANE_SHARE = 0.9;'],
  ['a new epoch keeps the old bodies.json', "if (epochChanged) writeJson('bodies.json', { generatedAt: nowSec, bodies: null, failed: true });", ''],
  // C1 negative control: the round-1 order (marker written AFTER the db.json commit point)
  ['the marker is written after db.json (round-1 order)', [["if (epochChanged) writeJson('bodies.json', { generatedAt: nowSec, bodies: null, failed: true });", ''],
    ["if (bodies && (bodies.length || epochChanged)) writeJson('bodies.json', { generatedAt: nowSec, bodies });",
      "if (bodies && bodies.length) writeJson('bodies.json', { generatedAt: nowSec, bodies }); else if (epochChanged) writeJson('bodies.json', bodies ? { generatedAt: nowSec, bodies } : { generatedAt: nowSec, bodies: null, failed: true });"]]],
  ['new bodies not written on a new epoch (marker left)', 'if (bodies && (bodies.length || epochChanged)) writeJson', 'if (false) writeJson'],
  ['deploy slot read at offset 0', 'dataSlice: { offset: 4, length: 8 }', 'dataSlice: { offset: 0, length: 8 }'],
  ['program owner not checked', 'p && p.owner === UPGRADEABLE_LOADER ?', 'p ?'],
  ['gate links: the to list is never written', '        id: sysId, to,', '        id: sysId, to: [],'],
  ['gate links: the list is not sorted', 'toSet].sort((p, q) => p - q)', 'toSet]'],
  ['gate links: duplicates kept', 'const toSet = new Set();', 'const toSet = { add(t) { (this.l ||= []).push(t); }, [Symbol.iterator]() { return (this.l || [])[Symbol.iterator](); } };'],
  ['gate links: the own id is not dropped', ' && t !== sysId) toSet.add(t)', ') toSet.add(t)'],
  ['gate links: links no longer equals to.length', 'links: to.length,', 'links: (s.connections || []).length,'],
  ['gate links: malformed connections fail the pass', 'if (Array.isArray(s.connections)) {', 'if (s.connections.map) {'],
  ['genesis failure swallowed','const genesis = await rpc.getGenesisHash().send(opt);', "const genesis = await rpc.getGenesisHash().send(opt).catch(() => '1'.repeat(40));"],
];

// ---- 9. the built browser bundle (C4Live/c4-collect.js): C4Collect.epoch / sameEpoch, offline -------------------
// Loads the bundle with a stand-in window and a fake fetch that answers the three JSON-RPC calls, so the bundled Buffer
// stand-in and RPC wiring are exercised. C4_BUNDLE=<file> checks another build (e.g. the pre-change one).
const BUNDLE = path.resolve(ROOT, process.env.C4_BUNDLE || 'C4Live/c4-collect.js');
function loadBundle(fetchImpl) {
  const window = {};
  new Function('window', 'fetch', fs.readFileSync(BUNDLE, 'utf8'))(window, fetchImpl);
  return window.C4Collect;
}
function rpcFetch(log, slot = 59540350n) {
  const prog = Buffer.alloc(36); prog.writeUInt32LE(2, 0); Buffer.alloc(32, 9).copy(prog, 4);
  const pd = Buffer.alloc(45); pd.writeUInt32LE(3, 0); pd.writeBigUInt64LE(slot, 4);
  const acct = (owner, buf) => ({ context: { slot: 1 }, value: { owner, data: [buf.toString('base64'), 'base64'], executable: false, lamports: 1, rentEpoch: 0, space: buf.length } });
  return async (url, init) => {
    const req = JSON.parse(init.body);
    log.push(`${new URL(url).host} ${req.method}`);
    let result;
    if (req.method === 'getGenesisHash') result = GEN_A;
    else if (req.method === 'getAccountInfo' && req.params[0] === 'C4SAgeKLgb3pTLWhVr6NRwWyYFuTR7ZeSXFrzoLwfMzF') result = acct('BPFLoaderUpgradeab1e11111111111111111111111', prog);
    else if (req.method === 'getAccountInfo') { const s = req.params[1].dataSlice; result = acct('BPFLoaderUpgradeab1e11111111111111111111111', pd.subarray(s.offset, s.offset + s.length)); }
    else throw new Error('unexpected method ' + req.method);
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: req.id, result }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
}
async function bundleChecks() {
  console.log(`\n[9] browser bundle ${path.relative(ROOT, BUNDLE)}: C4Collect.epoch / sameEpoch (offline, fake fetch)`);
  let C4;
  try { C4 = loadBundle(rpcFetch([])); } catch (e) { ok(false, 'bundle loads: ' + e.message); return; }
  ok(C4 && typeof C4.run === 'function', 'positive control: C4Collect.run is there');
  ok(C4 && typeof C4.epoch === 'function' && typeof C4.sameEpoch === 'function', 'C4Collect.epoch and C4Collect.sameEpoch are there');
  if (!C4 || typeof C4.epoch !== 'function') return;
  const log = [];
  const e = await loadBundle(rpcFetch(log)).epoch().catch((err) => ({ err }));
  ok(e.genesis === GEN_A && e.sage === 59540350 && Object.keys(e).sort().join() === 'genesis,sage', `epoch() -> { genesis, sage } through the bundled Buffer stand-in (${JSON.stringify(e)})`);
  ok(log.length === 3 && log.every((l) => l.startsWith('testnet-rpc.z.ink ')), `epoch(): at most 3 calls, z.ink only (${log.join(', ')})`);
  ok(C4.sameEpoch(e, { ...e }) === true && C4.sameEpoch(e, { genesis: GEN_B, sage: e.sage }) === false && C4.sameEpoch(e, { genesis: GEN_A, sage: null }) === true, 'C4Collect.sameEpoch is the collector rule');
  const down = await loadBundle(async () => { throw new TypeError('Failed to fetch'); }).epoch().then(() => 'resolved', () => 'rejected');
  ok(down === 'rejected', 'epoch(): rejects when z.ink cannot be reached');
  const t = Date.now();
  const hung = await loadBundle(() => new Promise(() => {})).epoch().then(() => 'resolved', (err) => String(err.message));
  const s = (Date.now() - t) / 1000;
  ok(/timed out/.test(hung) && s > 14 && s < 20, `epoch(): a hung request rejects after 15 s (${s.toFixed(1)} s: ${hung})`);
}

async function epochChecks(C, kit) {
  console.log('\n[8] chain version: a chain update starts history again; decode sanity (offline, fake chain)');
  for (const k of ['readChainEpoch', 'sameEpoch', 'decodeSanity', 'openRpc']) ok(typeof C[k] === 'function', `collector exports ${k}()`);
  // the address constant must be the one the kit reads with
  const sageMod = await import(pathToFileURL(require('module').createRequire(path.join(KIT_DIR, 'package.json')).resolve('@staratlas/dev-sage')).href);
  ok(C.SAGE_PROGRAM === sageMod.SAGE_PROGRAM_ADDRESS, `SAGE_PROGRAM equals @staratlas/dev-sage SAGE_PROGRAM_ADDRESS (${sageMod.SAGE_PROGRAM_ADDRESS})`);
  const realFailed = await epochSuite(COLLECTOR);
  const names = [...SAME_CASES.map(([a, b, w]) => `sameEpoch(${JSON.stringify(a)}, ${JSON.stringify(b)}) should be ${w}`), ...READ_CASES.map(([n]) => n), ...EPOCH_SCENARIOS.flatMap(([, , c]) => c.map(([n]) => n))];
  for (const n of names) ok(!realFailed.includes(n), n);
  for (const n of realFailed) if (!names.includes(n)) ok(false, n);
  const src = fs.readFileSync(COLLECTOR, 'utf8');
  for (const [label, from, to] of EPOCH_MUTANTS) {
    // one [from, to] pair, or a list of pairs applied in turn; each target must occur exactly once
    const pairs = Array.isArray(from) ? from : [[from, to]];
    let msrc = src, missing = false;
    for (const [f, t] of pairs) {
      const at = msrc.indexOf(f);
      if (at < 0 || msrc.indexOf(f, at + 1) >= 0) { missing = true; break; }
      msrc = msrc.slice(0, at) + t + msrc.slice(at + f.length);
    }
    if (missing) { ok(false, `mutant "${label}": target text not found exactly once in the collector`); continue; }
    const mf = path.join(KIT_DIR, `.mutant-epoch-${process.pid}.mjs`);
    fs.writeFileSync(mf, msrc);
    try { mutantFails(label, await epochSuite(mf)); } finally { fs.unlinkSync(mf); }
  }
}

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
  ['core data present (positive control: owners and fleets)', (r) => r.latest.owners.length > 20 && r.latest.fleets.length > 100],
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
