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

let fails = 0, passes = 0, skips = 0;
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
  await craftingChecks(C);
  await fleetStatChecks();
  await shareChecks();
  await msrpChecks();

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
  const realFails = degradeVerdict(real, true);
  const realSkipped = degradeReport(real).skipped.map((x) => x.name);
  for (const f of real.cases) if (!realSkipped.includes(f[0])) ok(!realFails.includes(f[0]), 'degrade: ' + f[0]);
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
  const { prefix = 'A', fleets = 40, systems = 40, badSys = 0, badKind = 0, emptyNames = 0, bodiesFail = false, gates = null,
    stakes = [], bdefs = [], bdefsFail = false, cargo = [], cargoFail = false, calls = {} } = o;
  const count = (n) => { calls[n] = (calls[n] || 0) + 1; };
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
    getAllClaimStakes: async () => stakes,
    getFleetMiningState: async () => null,
    getCharacterForProfile: async () => ({ atlas: 1, xp: {}, counts: {} }),
    listClaimStakeDefinitions: async () => [],
    listClaimStakeBuildingDefinitions: async () => { count('buildingDefs'); if (bdefsFail) throw new Error('INJECTED building definitions failure'); return bdefs; },
    getAllCelestialBodies: async () => { if (bodiesFail) throw new Error('INJECTED bodies failure'); return bodies; },
    listCargoDefinitions: async () => { count('cargoDefs'); if (cargoFail) throw new Error('INJECTED cargo definitions failure'); return cargo; },
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
      const world = typeof st.world === 'function' ? st.world() : st.world;   // a function = a fresh world per run
      let code, err = null;
      const orig = console.log; console.log = () => {};   // the collector logs every pass
      // st.crashAt: the rename onto that served file throws - a crash part-way through the writes. The collector's
      // named `node:fs` imports are live bindings, refreshed by syncBuiltinESMExports.
      const realRename = fs.renameSync;
      if (st.crashAt) { fs.renameSync = (a, b) => { if (path.basename(String(b)) === st.crashAt) throw new Error('INJECTED crash at ' + st.crashAt); return realRename(a, b); }; syncBuiltinESMExports(); }
      try { code = await M.collect(pass, { chain: world, readEpoch, readIdentities: identStub, refreshPrices: pricesStub }); } catch (e) { err = e; } finally {
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

// claim stake fixtures: building definitions in the kit's shape (ids are numbers, rates carry { raw, value }), stakes
// with bigint fields like the real kit rows
const BD = (id, name, power, crewSlots, slots, extraction = [], net = []) => ({ id, name, power, crewSlots, slots, resourceExtraction: extraction.map(([cargoId, value]) => ({ cargoId, rate: { raw: 1n, value } })),
  netResourceProduction: net.map(([cargoId, value]) => ({ cargoId, rate: { raw: 1n, value } })) });
const STAKE_BDEFS = [
  BD(0, 'Oceanic Central Hub Tier 1', 100, 4, 0, [[5, 0.25]]), BD(1, 'Ore Breaker - Iron Ore Tier 1', -10, 0, 2, [[5, 0.5]]),
  BD(2, 'Fuel Processor Tier 1', -30, 1, 8, [], [[2, 1.5], [5, -2]]), BD(3, 'Herb Farm Tier 1', -5, 1, 3),
  BD(4, 'Gizmo Tier 1', 0, 0, 1, [[7, 0.1]]), BD(5, 'Gizmo Plain Tier 1', 0, 0, 1), BD(6, 'Unused Storage Hub Tier 1', 0, 0, 0),
  BD(7, undefined, 0, 0, 0),   // a definition with no name
];
// The stake's OWN stored net production (kit: resources.netProduction[], ratePerSecond is a plain number). Deliberately NOT
// what the definitions above would sum to: the old code (definitions x quantity) gives Fuel 3, Iron Ore 2, Ether 0.1.
const NETP = [
  { id: 2, name: 'Fuel', ratePerSecond: -0.5 },          // consumption -> use
  { id: 5, name: 'Iron Ore', ratePerSecond: 2 },         // production, named by the cargo read
  { id: 7, name: 'Ether', ratePerSecond: 0.1 },
  { id: 99, ratePerSecond: 0.3 },                         // not in the cargo read, no name -> cargo#99
  { id: 11, ratePerSecond: -0.02 },                       // consumption, unnamed -> cargo#11
  { id: 8, name: 'Dust', ratePerSecond: 0 },              // zero rate: in neither list
];
const STAKE_CARGO = [{ id: 2, name: 'Fuel' }, { id: 5, name: 'Iron Ore' }, { id: 7, name: 'Ether' }];
const mkStake = (address, buildings, extra = {}) => ({ address, body: { address: 'AB0' }, ownerProfile: { address: 'AP0' }, claimStakeDefinitionId: 0, neededCrew: 3,
  state: { kind: 'active' }, buildings, rentBalanceRaw: 1749590852n, lastRentAtUnixSeconds: 1795395752n, constructionRemainingSeconds: 7920n, constructionProgressAtUnixSeconds: 1795395000n,
  resources: { netProduction: NETP, capacity: { usedRaw: 357n, totalRaw: 1000n }, inventory: { items: [
    { id: 5, name: 'Biomass', quantityRaw: 300n }, { id: 2, name: 'Fuel', quantityRaw: 50n }, { id: 9, name: 'Fuel Cell', quantityRaw: 7n }, { id: 8, name: 'Dust', quantityRaw: 0n }] } }, ...extra });
const ST_FULL = mkStake('ST1', [0, 1, 2, 3, 4, 5].map((id, i) => ({ buildingId: id, quantity: [2, 3, 2, 1, 1, 1][i] })));
const ST_EMPTY = mkStake('ST2', [], { resources: undefined });
const ST_UNKNOWN = mkStake('ST3', [{ buildingId: 0, quantity: 1 }, { buildingId: 99, quantity: 2 }]);
const ST_NONAME = mkStake('ST4', [{ buildingId: 7, quantity: 1 }]);
const ST_NONET = mkStake('ST5', [{ buildingId: 0, quantity: 1 }], { resources: { capacity: { usedRaw: 1n, totalRaw: 10n }, inventory: { items: [] } } }); // resources, but no netProduction
const stakeRow = (r, a) => r.latest.stakes.find((k) => k.a === a);
const stakeCalls = {};
const stakeWorld = (o = {}) => fakeWorld({ stakes: [ST_FULL, ST_EMPTY, ST_UNKNOWN, ST_NONAME, ST_NONET], bdefs: STAKE_BDEFS, cargo: STAKE_CARGO, ...o });
const OUT_WANT = [{ r: 'Iron Ore', ps: 2 }, { r: 'cargo#99', ps: 0.3 }, { r: 'Ether', ps: 0.1 }];
const USE_WANT = [{ r: 'Fuel', ps: 0.5 }, { r: 'cargo#11', ps: 0.02 }];
const sameJson = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// buildingKind: [name, has extraction, kind]
const KIND_CASES = [
  ['Ice Giant Central Hub Tier 1', false, 'central_hub'], ['Terrestrial Cultivation Hub Tier 1', false, 'cultivation_hub'], ['Oceanic Extraction Hub Tier 1', true, 'extraction_hub'],
  ['Volcanic Processing Hub Tier 1', false, 'processing_hub'], ['Dark Storage Hub Tier 1', false, 'storage_hub'], ['Gas Giant Farm Hub Tier 1', false, 'farm_hub'],
  ['Ice Giant Power Plant Tier 1', false, 'power_plant'], ['Oceanic Crew Quarters Tier 1', false, 'crew_quarters'], ['Storage Module Tier 1', false, 'storage_module'],
  ['Fuel Processor Tier 1', false, 'processor'], ['Fuel Processor Tier 1', true, 'processor'], ['Ammunition Processor', true, 'processor'],
  ['Herb Farm Tier 1', false, 'farm'], ['Farm Processor Tier 2', false, 'processor'], ['Ore Breaker - Iron Ore Tier 1', true, 'extractor'],
  ['Gas Condenser - Hydrogen Tier 1', true, 'extractor'], ['Mystery Thing Tier 1', false, 'processor'], ['Mystery Thing Tier 1', true, 'extractor'],
  [undefined, false, 'processor'], ['Central Hub Farm Hub', false, 'central_hub'],
];

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
  // claim stake detail rows (spec A): buildings, power, crew slots, slots, inventory, storage, fuel, rent, construction, output
  ['stake detail fields', [{ epoch: E1, world: () => { stakeCalls.buildingDefs = 0; stakeCalls.cargoDefs = 0; return stakeWorld({ calls: stakeCalls }); } }], [
    ['stake detail (positive control): the three stakes are written, old fields intact', ([a]) => !a.err && a.latest.stakes.length === 5 && stakeRow(a, 'ST1').crew === 3 && stakeRow(a, 'ST1').b === 10 && stakeRow(a, 'ST1').st === 'active'],
    ['stake detail: bl = id, name, quantity, kind per building (q > 1 kept)', ([a]) => sameJson(stakeRow(a, 'ST1').bl, [
      { id: 0, n: 'Oceanic Central Hub Tier 1', q: 2, k: 'central_hub' }, { id: 1, n: 'Ore Breaker - Iron Ore Tier 1', q: 3, k: 'extractor' }, { id: 2, n: 'Fuel Processor Tier 1', q: 2, k: 'processor' },
      { id: 3, n: 'Herb Farm Tier 1', q: 1, k: 'farm' }, { id: 4, n: 'Gizmo Tier 1', q: 1, k: 'extractor' }, { id: 5, n: 'Gizmo Plain Tier 1', q: 1, k: 'processor' }])],
    ['stake detail: bl quantities sum to b', ([a]) => a.latest.stakes.every((k) => k.bl.reduce((s, b) => s + b.q, 0) === k.b)],
    ['stake detail: generated power = sum of positive power x q', ([a]) => stakeRow(a, 'ST1').pw.gen === 200],
    ['stake detail: used power = sum of |negative| x q (3 x 10 + 2 x 30 + 1 x 5)', ([a]) => stakeRow(a, 'ST1').pw.use === 95],
    ['stake detail: crew slots = sum crewSlots x q', ([a]) => stakeRow(a, 'ST1').cs === 11],
    ['stake detail: slots used = sum slots x q', ([a]) => stakeRow(a, 'ST1').su === 27],
    ['stake detail: out = the stake own positive net production (not the definitions x q), zero dropped, sorted desc, cargo named, cargo#id fallback', ([a]) => sameJson(stakeRow(a, 'ST1').out, OUT_WANT)],
    ['stake detail: use = the negative net entries as POSITIVE numbers, sorted desc, cargo#id fallback', ([a]) => sameJson(stakeRow(a, 'ST1').use, USE_WANT)],
    ['stake detail: no negative number and no zero in out or use on any stake', ([a]) => a.latest.stakes.every((k) => [...(k.out || []), ...(k.use || [])].every((o) => o.ps > 0))],
    ['stake detail: out / use do not depend on the definitions - present on a stake with a building missing from them', ([a]) => sameJson(stakeRow(a, 'ST3').out, OUT_WANT) && sameJson(stakeRow(a, 'ST3').use, USE_WANT)],
    ['stake detail: resources without netProduction -> out and use absent (not [])', ([a]) => { const k = stakeRow(a, 'ST5'); return k.out === undefined && k.use === undefined && k.cap.total === 10; }],
    ['stake detail: a definition with no name -> "building #id", never "undefined"', ([a]) => { const k = stakeRow(a, 'ST4'); return k.bl[0].n === 'building #7' && !JSON.stringify(a.latest.stakes).includes('"undefined"') && k.pw !== undefined; }],
    ['stake detail: inventory sorted by quantity desc, zero quantity dropped, bigint read', ([a]) => sameJson(stakeRow(a, 'ST1').inv, [{ r: 'Biomass', q: 300 }, { r: 'Fuel', q: 50 }, { r: 'Fuel Cell', q: 7 }])],
    ['stake detail: fuel is the item named exactly Fuel (not Fuel Cell)', ([a]) => stakeRow(a, 'ST1').fuel === 50],
    ['stake detail: cap = used / total', ([a]) => sameJson(stakeRow(a, 'ST1').cap, { used: 357, total: 1000 })],
    ['stake detail: rent in ATLAS (8 decimals) + last rent time', ([a]) => sameJson(stakeRow(a, 'ST1').rent, { bal: 17.49590852, at: 1795395752 })],
    ['stake detail: construction remaining + progress time', ([a]) => sameJson(stakeRow(a, 'ST1').con, { rem: 7920, at: 1795395000 })],
    ['stake detail: no definitions flag on a good read', ([a]) => a.latest.quality.buildingDefsFailed === undefined],
    ['stake detail: ONE building definitions read and ONE cargo read per pass', () => stakeCalls.buildingDefs === 1 && stakeCalls.cargoDefs === 1],
    ['stake detail: a stake with no buildings and no resources has bl [] and zero sums, no out / use / inv / fuel / cap', ([a]) => { const k = stakeRow(a, 'ST2'); return sameJson(k.bl, []) && sameJson(k.pw, { gen: 0, use: 0 }) && k.cs === 0 && k.su === 0 && k.out === undefined && k.use === undefined && k.inv === undefined && k.fuel === undefined && k.cap === undefined; }],
    ['stake detail: a building missing from the definitions -> "building #id", processor, and no sums for that stake', ([a]) => { const k = stakeRow(a, 'ST3'); return k.bl[1].n === 'building #99' && k.bl[1].k === 'processor' && k.bl[0].n === 'Oceanic Central Hub Tier 1' && k.pw === undefined && k.cs === undefined && k.su === undefined && sameJson(k.out, OUT_WANT); }],
  ]],
  ['stake cargo definitions read fails', [{ epoch: E1, world: () => { stakeCalls.cargoDefs = 0; return stakeWorld({ cargoFail: true, calls: stakeCalls }); } }], [
    ['cargo fail (positive control): the pass is written with exit 0, partial false, stakes intact', ([a]) => a.code === 0 && !a.err && a.latest && a.latest.quality.partial === false && a.latest.stakes.length === 5 && stakeRow(a, 'ST1').b === 10 && stakeRow(a, 'ST1').pw.gen === 200],
    ['cargo fail: bodiesFailed is true, buildingDefsFailed is not', ([a]) => a.latest.quality.bodiesFailed === true && a.latest.quality.buildingDefsFailed === undefined],
    ['cargo fail: exactly ONE cargo call (no retry)', () => stakeCalls.cargoDefs === 1],
    ['cargo fail: out / use still there, resources named from the production entry or cargo#id', ([a]) => sameJson(stakeRow(a, 'ST1').out.map((o) => o.r), ['Iron Ore', 'cargo#99', 'Ether']) && stakeRow(a, 'ST1').use.length === 2],
  ]],
  ['stake building definitions read fails', [{ epoch: E1, world: () => stakeWorld({ bdefsFail: true }) }], [
    ['defs fail: the pass is written, not aborted (positive control: the stakes are there with b and crew)', ([a]) => !a.err && a.latest && a.latest.stakes.length === 5 && stakeRow(a, 'ST1').b === 10],
    ['defs fail: quality.buildingDefsFailed is true', ([a]) => a.latest.quality.buildingDefsFailed === true],
    ['defs fail: bl is "building #id" / processor, quantities kept', ([a]) => sameJson(stakeRow(a, 'ST1').bl.map((b) => [b.id, b.n, b.q, b.k]), [[0, 'building #0', 2, 'processor'], [1, 'building #1', 3, 'processor'], [2, 'building #2', 2, 'processor'], [3, 'building #3', 1, 'processor'], [4, 'building #4', 1, 'processor'], [5, 'building #5', 1, 'processor']])],
    ['defs fail: pw, cs, su are absent on every stake, even the one with no buildings', ([a]) => a.latest.stakes.every((k) => k.pw === undefined && k.cs === undefined && k.su === undefined)],
    ['defs fail: out and use still arrive from the stake own production; absent only where the stake has none', ([a]) => sameJson(stakeRow(a, 'ST1').out, OUT_WANT) && sameJson(stakeRow(a, 'ST1').use, USE_WANT) && stakeRow(a, 'ST2').out === undefined && stakeRow(a, 'ST2').use === undefined],
    ['defs fail: the chain-only fields still arrive (inv, fuel, cap, rent, con)', ([a]) => { const k = stakeRow(a, 'ST1'); return k.fuel === 50 && k.cap.total === 1000 && k.rent.bal === 17.49590852 && k.con.rem === 7920 && k.inv.length === 3; }],
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
  ...KIND_CASES.map(([name, ex, want]) => [`buildingKind(${JSON.stringify(name)}, ${ex}) -> ${want}`, async (M) => M.buildingKind(name, ex) === want]),
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
  ['stake detail: generated power ignores the quantity', 'gen += bd.power * q;', 'gen += bd.power;'],
  ['stake detail: used power ignores the quantity', 'use += -bd.power * q;', 'use += -bd.power;'],
  ['stake detail: crew slots ignore the quantity', 'cs += bd.cs * q;', 'cs += bd.cs;'],
  ['stake detail: slots used ignore the quantity', 'su += bd.su * q;', 'su += bd.su;'],
  ['stake detail: use keeps the negative sign (never flipped)', 'ps: round(sign * num(e.ratePerSecond), 9) }))', 'ps: round(num(e.ratePerSecond), 9) }))'],
  ['stake detail: negatives left in out', [['ps: round(sign * num(e.ratePerSecond), 9) }))', 'ps: round(num(e.ratePerSecond), 9) }))'], ['.filter((o) => o.ps > 0)', '.filter((o) => o.ps !== 0)']]],
  ['stake detail: out summed from the definitions again', 'row.out = side(1);', "row.out = Object.entries(Object.fromEntries((k.buildings || []).map((b) => [num(b.buildingId), num(b.quantity)]))).map(([i, q]) => ({ r: 'Fuel', ps: q })).sort((p, q) => q.ps - p.ps);"],
  ['stake detail: out / use sorted ascending', '.sort((p, q) => q.ps - p.ps ||', '.sort((p, q) => p.ps - q.ps ||'],
  ['stake detail: out / use [] instead of absent without netProduction', 'const net = k.resources?.netProduction;', 'const net = k.resources?.netProduction || [];'],
  ['stake detail: zero rate kept', '.filter((o) => o.ps > 0)', '.filter((o) => o.ps >= 0)'],
  ['stake detail: out / use only when the definitions read', 'if (Array.isArray(net)) {', 'if (Array.isArray(net) && !quality.buildingDefsFailed && known) {'],
  ['stake detail: nameless definition becomes "undefined"', 'n: d.name == null ? `building #${id}` : String(d.name)', 'n: String(d.name)'],
  ['stake detail: fuel matches any name containing Fuel', "i.r === 'Fuel'", "i.r.includes('Fuel')"],
  ['stake detail: inventory sorted ascending', '.sort((p, q) => q.q - p.q ||', '.sort((p, q) => p.q - q.q ||'],
  ['stake detail: zero quantities kept in the inventory', '.filter((i) => i.q > 0)', '.filter(() => true)'],
  ['stake detail: rent left in raw units', 'num(k.rentBalanceRaw) / ATLAS_DECIMALS', 'num(k.rentBalanceRaw)'],
  ['stake detail: a building definitions failure aborts the pass', 'quality.buildingDefsFailed = true; // the page', 'throw e; // the page'],
  ['stake detail: the failure flag is never set', 'quality.buildingDefsFailed = true; // the page', '// the page'],
  ['stake detail: sums kept as zeros when the definitions failed', 'let known = !quality.buildingDefsFailed;', 'let known = true; if (!buildingDefs) buildingDefs = new Proxy({}, { get: () => ({ n: "x", k: "processor", power: 0, cs: 0, su: 0 }) });'],
  ['stake detail: sums computed although a building definition is missing', 'if (!bd) known = false;', ''],
  ['stake detail: two cargo reads per pass', 'try { cargoDefs = await K.listCargoDefinitions(ctx); }', 'try { await K.listCargoDefinitions(ctx); cargoDefs = await K.listCargoDefinitions(ctx); }'],
  ['stake detail: a cargo definitions failure aborts the pass', 'catch (e) { cargoDefsErr = e; }', 'catch (e) { throw e; }'],
  ['stake detail: kind: the processor rule removed', "if (/Processor(\\s+Tier\\s+\\w+)?\\s*$/.test(s)) return 'processor';", ''],
  ['stake detail: kind: the farm rule removed', "if (s.includes('Farm')) return 'farm';", ''],
  ['stake detail: kind: no extractor fallback', "return ex ? 'extractor' : 'processor';", "return 'processor';"],
  ['stake detail: kind: Crew Quarters not recognised', "['Crew Quarters', 'crew_quarters'], ", ''],
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
// ---- 10. crafting jobs per recipe: craftingDoc (pure) and readCrafting (stubbed chain) -----------------------------
async function craftingChecks(C) {
  console.log('\n[10] crafting jobs per recipe (offline)');
  const { craftingDoc, readCrafting, CRAFT_NAME_MAX } = C;
  ok(typeof craftingDoc === 'function' && typeof readCrafting === 'function', 'positive control: craftingDoc and readCrafting are exported');
  if (typeof craftingDoc !== 'function') return;
  const rows = [
    { name: 'Fuel', usageCountRaw: 12n, ingredients: [{ name: 'Hydrogen', quantityRaw: 3n }], outputs: [{ name: 'Fuel', quantityRaw: 1n }] },
    { name: 'Food', usageCountRaw: 30n, ingredients: [{ name: 'Biomass', quantityRaw: 2n }, { name: '', quantityRaw: 1n }, { name: 'Bad', quantityRaw: -1 }], outputs: [] },
    { name: 'Never', usageCountRaw: 0n, ingredients: [], outputs: [] },
    { name: 'Huge', usageCountRaw: 2n ** 60n, ingredients: [], outputs: [] },
    { name: 'x'.repeat(200) + '\u0007', usageCountRaw: '5', ingredients: [], outputs: [] },
    { usageCountRaw: 9n }, null, 'junk'];
  const d = craftingDoc(rows, 1795000000);
  ok(d.v === 1 && d.generatedAt === 1795000000 && d.read === 6, `the document carries the read time and the recipes read (${d.read} objects of 8 rows)`);
  ok(d.used === 3 && d.jobs === 47 && d.recipes.map((r) => r.u).join() === '30,12,5', `only recipes with jobs, most first, total 47 (${d.recipes.map((r) => r.u).join()})`);
  ok(JSON.stringify(d.recipes[1]) === JSON.stringify({ n: 'Fuel', u: 12, i: [['Hydrogen', 3]], o: [['Fuel', 1]] }), `a recipe row is { n, u, i, o } with plain numbers (${JSON.stringify(d.recipes[1])})`);
  ok(JSON.stringify(d.recipes[0].i) === JSON.stringify([['Biomass', 2]]), 'an ingredient without a name or with a negative quantity is dropped');
  ok(!d.recipes.some((r) => r.n === 'Huge'), 'a counter beyond the safe integer range is not written as a wrong number');
  ok(d.recipes[2].n.length === CRAFT_NAME_MAX && !/[\u0000-\u001f]/.test(d.recipes[2].n), 'a name is cut to the cap and control characters are removed');
  ok(JSON.parse(JSON.stringify(d)).jobs === 47 && !/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(JSON.stringify(craftingDoc(rows.slice(0, 3), 1))), 'the document is plain JSON (no bigint) and holds no address');
  let disposed = 0;
  const r = await readCrafting({ createSageContext: () => ({ dispose: async () => { disposed++; } }), rpc: {}, listRecipes: async () => rows.slice(0, 3), now: () => 7 });
  ok(r.generatedAt === 7 && r.jobs === 42 && disposed === 1, `readCrafting returns the document and releases the chain client (${r.jobs} jobs, disposed ${disposed})`);
  let err = null; disposed = 0;
  try { await readCrafting({ createSageContext: () => ({ dispose: async () => { disposed++; } }), rpc: {}, listRecipes: async () => [] }); } catch (e) { err = e; }
  ok(err && /no recipes/.test(err.message) && disposed === 1, 'an empty recipe list is an error, not "nobody crafts", and the client is still released');
  err = null; disposed = 0;
  try { await readCrafting({ createSageContext: () => ({ dispose: async () => { disposed++; } }), rpc: {}, listRecipes: async () => { throw new Error('rpc down'); } }); } catch (e) { err = e; }
  ok(err && err.message === 'rpc down' && disposed === 1, 'a failed read rejects and the client is still released');
  let C4 = null; try { C4 = loadBundle(async () => { throw new Error('no network in this check'); }); } catch (e) { /* reported below */ }
  ok(C4 && typeof C4.crafting === 'function', 'the built browser bundle has C4Collect.crafting');
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
  skipPathChecks();
}

// ---- fleet + ship-model stats (latest.statKeys / latest.shipDefs / fleet.st and extras) ----------------
// Two invented fleets in the chain's three value shapes (number, numeric string, { raw, value }); the cases run on
// the collector's exported helpers and on one offline collect() pass, then once per mutant (a copy of the collector
// with one guard changed) - every mutant must fail at least one case.
const statFleets = () => [
  { address: 'SF1', name: 'Stat fleet one', state: { kind: 'idle' }, location: { x: 1, y: 2 },
    stats: { cargo: { cargoCapacity: '2764', miningRate: { raw: '2404', value: 0.146728515625 } },
      combat: { hp: 400, sp: '283', hitChance: { raw: '64', value: 1 } },
      misc: { recoveryFeeAtlas: 5.5, recoveryFeeRaw: '550000000', junk: 'abc', empty: '', inf: 'Infinity' },
      movement: { warpSpeed: { raw: '2163', value: 0.0330047607421875 } } },
    ap: 41, fuel: { name: 'Fuel', amount: '4767' }, ammo: { name: 'Ammunition', amount: '13760' },
    cargoHold: { items: [{ name: 'Food', id: 1, amount: '1382' }, { name: 'Hydrogen', id: 3, amount: '0' }, { id: 7, amount: '9000' }, { name: 'Ore', id: 2, amount: '50' }] },
    stance: { ammoUsage: 'light' }, pendingHp: 0, rentedCrew: 0,
    ships: [{ name: 'Testship Alpha', sizeClass: 'small', quantity: 1, definitionSequenceId: 5, stats: { combat: { hp: 400 }, cargo: { cargoCapacity: '2764' }, movement: { maxWarpDistance: { raw: '1', value: 1.5 } } } },
      { name: '__proto__', sizeClass: 'xx-small', quantity: 1, definitionSequenceId: 1, stats: { combat: { hp: 7 } } }] },
  { address: 'SF2', name: 'Stat fleet two', state: { kind: 'idle' }, location: { x: 0, y: 0 },
    stats: { combat: { hp: 100 } }, ap: 12n, pendingHp: 25, rentedCrew: '3', cargoHold: { items: [] },
    ships: [{ name: 'Testship Alpha', sizeClass: 'small', quantity: 2, definitionSequenceId: 9, stats: { combat: { hp: 450 } } },
      { name: 'Testship Alpha', sizeClass: 'small', quantity: 1, definitionSequenceId: 2, stats: { combat: { hp: 1 } } },
      { name: 'constructor', sizeClass: 'medium', quantity: 1, definitionSequenceId: 1, stats: { combat: { hp: 3 } } }] },
];
const STAT_KEYS_WANT = ['cargo.cargoCapacity', 'cargo.miningRate', 'combat.hitChance', 'combat.hp', 'combat.sp', 'misc.recoveryFeeAtlas', 'movement.maxWarpDistance', 'movement.warpSpeed'];
const STAT_CASES = [
  ['statKeys = sorted union of fleet + ship stats; no *Raw, no junk / empty / infinite value', (r) => JSON.stringify(r.keys) === JSON.stringify(STAT_KEYS_WANT)],
  ['a key seen only on a ship is in statKeys', (r) => r.keys.includes('movement.maxWarpDistance')],
  ['{ raw, value } converts to value', (r) => r.at(r.rows[0], 'combat.hitChance') === 1 && r.at(r.rows[0], 'movement.warpSpeed') === 0.033005],
  ['numeric string and number convert', (r) => r.at(r.rows[0], 'combat.sp') === 283 && r.at(r.rows[0], 'cargo.cargoCapacity') === 2764 && r.at(r.rows[0], 'combat.hp') === 400],
  ['values rounded to 6 decimals', (r) => r.at(r.rows[0], 'cargo.miningRate') === 0.146729],
  ['a stat missing on the fleet = 0', (r) => r.at(r.rows[1], 'cargo.cargoCapacity') === 0 && r.at(r.rows[1], 'misc.recoveryFeeAtlas') === 0],
  ['every row has statKeys.length numbers', (r) => [...r.rows, ...Object.values(r.defs).map((d) => d.st)].every((a) => Array.isArray(a) && a.length === r.keys.length && a.every((v) => typeof v === 'number' && Number.isFinite(v)))],
  ['shipDefs: the higher definitionSequenceId wins, in either order', (r) => r.defs['Testship Alpha']?.seq === 9 && r.at(r.defs['Testship Alpha'].st, 'combat.hp') === 450 && r.defs['Testship Alpha'].sz === 'small'],
  ['shipDefs: "__proto__" / "constructor" are plain own keys, nothing polluted', (r) => Object.keys(r.defs).sort().join('|') === 'Testship Alpha|__proto__|constructor'
    && r.at(r.defs.__proto__.st, 'combat.hp') === 7 && r.at(r.defs.constructor.st, 'combat.hp') === 3 && ({}).sz === undefined && ({}).seq === undefined
    && Object.keys(JSON.parse(JSON.stringify(r.defs))).includes('__proto__')],
  ['types: ship models named like built-in properties are counted as plain names, and an unknown size class never outranks a real one',
    (r) => { const t = JSON.parse(JSON.stringify(r.odd.types)); return Object.keys(r.odd.types).sort().join() === '__proto__,constructor,toString' && r.odd.types.constructor === 2 && r.odd.types.__proto__ === 3 && r.odd.types.toString === 1 && Object.keys(t).length === 2 + (Object.prototype.hasOwnProperty.call(t, '__proto__') ? 1 : 0) && r.odd.flag === '__proto__' && r.odd.flagSize === 'small'; }],
  ['hold: largest first, zero quantity dropped, nameless item = cargo#<id>', (r) => JSON.stringify(r.slim[0].hold) === JSON.stringify([{ n: 'cargo#7', q: 9000 }, { n: 'Food', q: 1382 }, { n: 'Ore', q: 50 }]) && JSON.stringify(r.slim[1].hold) === '[]'],
  ['ap / fuel / ammo are numbers (bigint and missing included)', (r) => r.slim[0].ap === 41 && r.slim[0].fuel === 4767 && r.slim[0].ammo === 13760 && r.slim[1].ap === 12 && r.slim[1].fuel === 0 && r.slim[1].ammo === 0],
  ['stance only when present', (r) => r.slim[0].stance === 'light' && !('stance' in r.slim[1])],
  ['pend / rent only when > 0', (r) => !('pend' in r.slim[0]) && !('rent' in r.slim[0]) && r.slim[1].pend === 25 && r.slim[1].rent === 3],
  ['hpMax / spMax / mineRate / cargoCap equal their st entries', (r) => r.slim.every((f, i) => f.hpMax === r.at(r.rows[i], 'combat.hp') && f.spMax === r.at(r.rows[i], 'combat.sp')
    && f.mineRate === r.at(r.rows[i], 'cargo.miningRate') && f.cargoCap === r.at(r.rows[i], 'cargo.cargoCapacity'))],
  ['collect(): latest has statKeys + shipDefs and every fleet an aligned st', (r) => Array.isArray(r.latest?.statKeys) && r.latest.statKeys.includes('combat.hp')
    && r.latest.shipDefs?.['Testship Alpha']?.seq === 9 && r.latest.fleets.length === 40 && r.latest.fleets.every((f) => Array.isArray(f.st) && f.st.length === r.latest.statKeys.length)],
  ['collect(): fleet st / extras written (hpMax = st[combat.hp], hold, ap)', (r) => {
    const f = r.latest?.fleets?.find((x) => x.a === 'AF0'), i = r.latest?.statKeys?.indexOf('combat.hp');
    return !!f && f.st[i] === 400 && f.hpMax === 400 && f.ap === 41 && f.hold?.[0]?.n === 'cargo#7' && f.stance === 'light';
  }],
];
const STAT_MUTANTS = [
  ['*Raw keys kept', "!k.endsWith('Raw') && ", ''],
  ['ship stats not scanned for keys', 'for (const sh of f?.ships || []) take(sh?.stats);', ''],
  ['statKeys unsorted', 'return [...keys].sort();', 'return [...keys];'],
  ['{ raw, value } not unwrapped', "if (v !== null && typeof v === 'object') v = v.value;", ''],
  ['numeric strings not converted', "else if (typeof v === 'string') v = v.trim() === '' ? NaN : Number(v);", ''],
  ['an empty string counts as 0', "v.trim() === '' ? NaN : Number(v)", 'Number(v)'],
  ['infinite values accepted', 'Number.isFinite(v) ? v : null', '!Number.isNaN(v) ? v : null'],
  ['bigint not converted', "if (typeof v === 'bigint') v = Number(v);", 'if (0);'],
  ['missing stat is null, not 0', 'return v === null ? 0 : round(v, 6);', 'return v === null ? null : round(v, 6);'],
  ['no rounding', 'return v === null ? 0 : round(v, 6);', 'return v === null ? 0 : v;'],
  ['shipDefs: the last definition wins', 'if (cur && cur.seq >= seq) continue;', ''],
  ['fleet ship names kept in a plain object', 'const shipNames = Object.create(null);', 'const shipNames = {};'],
  ['size rank read through the prototype', "const r = Object.hasOwn(SIZE_RANK, sh.sizeClass) ? SIZE_RANK[sh.sizeClass] : -1,", "const r = SIZE_RANK[sh.sizeClass] ?? -1,"],
  ['shipDefs is a plain object', 'const defs = Object.create(null);', 'const defs = {};'],
  ['hold keeps zero quantities', 'if (q === null || q <= 0) continue;', 'if (q === null) continue;'],
  ['hold unsorted', 'return out.sort((a, b) => b.q - a.q);', 'return out;'],
  ['hold has no fallback name', '`cargo#${it?.id}`', 'null'],
  ['stance always written', "if (typeof f.stance?.ammoUsage === 'string' && f.stance.ammoUsage) x.stance = f.stance.ammoUsage;", 'x.stance = f.stance?.ammoUsage ?? null;'],
  ['pend always written', 'if (pend !== null && pend > 0) x.pend = pend;', 'x.pend = pend ?? 0;'],
  ['rent always written', 'if (rent !== null && rent > 0) x.rent = rent;', 'x.rent = rent ?? 0;'],
  ['extras not on the slim fleet', '...fleetExtras(f),', ''],
  ['collect() sets no fleet st', 'fleets.forEach((f, i) => { f.st = statRow(fleetsRaw[i].stats, statKeys); });', ''],
  ['latest lacks statKeys / shipDefs', 'ref, statKeys, shipDefs,', 'ref,'],
];
let statImport = 0;
async function fleetStatSuite(file) {
  const failed = [];
  const udir = fs.mkdtempSync(path.join(os.tmpdir(), 'c4-check-stat-u-'));
  process.env.C4_OUT_DIR = udir;
  let r;
  try {
    const M = await import(pathToFileURL(file).href + `?stat=${++statImport}`);
    const raw = statFleets();
    const keys = M.statUnion(raw);
    r = { keys, rows: raw.map((f) => M.statRow(f.stats, keys)), defs: M.shipDefsOf(raw, keys), slim: raw.map(M.slimFleet) };
    r.odd = M.slimFleet({ ...raw[0], ships: [{ name: 'constructor', quantity: 2, sizeClass: 'toString' }, { name: '__proto__', quantity: 3, sizeClass: 'small' }, { name: 'toString', quantity: 1, sizeClass: 'valueOf' }] });
    r.at = (row, k) => row[keys.indexOf(k)];
    // one offline collect() pass: the 40-fleet fake world, fleet F0 given stat fleet one's stats and extras
    const world = A40(), fl = await world.getFleets(), sf = statFleets();
    const { address, name, state, location, ...rich } = sf[0];
    Object.assign(fl[0], rich);
    fl[1].ships = sf[1].ships;
    const [pass] = await epochScenario(file, [{ world, epoch: E1 }]);
    r.latest = pass.latest;
  } catch (e) { fs.rmSync(udir, { recursive: true, force: true }); return ['threw: ' + e.message]; }
  fs.rmSync(udir, { recursive: true, force: true });
  for (const [n, pred] of STAT_CASES) { let good; try { good = pred(r); } catch { good = false; } if (!good) failed.push(n); }
  return failed;
}
// ---- one read per account per pass: shareTransport() -----------------------------------------------------------------
// A fake inner transport counts what really goes out. now is a settable clock.
const SHARE_CASES = [
  ['the same getAccountInfo asked twice goes out once, and both callers get the answer', (r) => r.twiceCalls === 1 && r.twice[0].result.value.data[0] === 'AAAA' && r.twice[1].result.value.data[0] === 'AAAA'],
  ['the second caller gets its own copy (changing it does not change the first) under its own request id', (r) => r.twice[0] !== r.twice[1] && r.twice[0].result !== r.twice[1].result && r.twice[1].id === 'b' && r.twice[0].id === 'a' && r.mutated === 'AAAA'],
  ['the request starts in the caller\'s own tick (an abort fired right after the call still reaches it)', (r) => r.syncCalls === 1],
  ['the order of the option keys does not make it a different read', (r) => r.orderCalls === 1],
  ['a different address or different options is its own read', (r) => r.diffCalls === 3],
  ['callers asking at the same moment share the one request in flight', (r) => r.concurrentCalls === 1 && r.concurrent.every((v) => v.result.value.data[0] === 'AAAA')],
  ['only getAccountInfo is shared: a list read asked twice goes out twice', (r) => r.listCalls === 2],
  ['an error answer is not kept: the next caller asks again', (r) => r.errorCalls === 2 && r.errorSecond.result.value.data[0] === 'AAAA'],
  ['a failed request is not kept: the next caller asks again', (r) => r.rejectFirst === 'boom' && r.rejectCalls === 2],
  ['an answer older than the limit is asked again; one just inside it is reused', (r) => r.ttlInside === 1 && r.ttlAfter === 2],
  ['a pass starts with an empty share (collect() clears it before its first read)', (r) => r.clearsFirst === true],
  ['the chain-version probe never shares: openRpc() is the plain transport', (r) => r.probePlain === true],
];
const SHARE_MUTANTS = [
  ['share: every method is shared', "if (!pl || pl.method !== 'getAccountInfo') return inner(req);", 'if (!pl) return inner(req);'],
  ['share: the request starts a tick late', 'p: new Promise((res) => res(inner(req))) };', 'p: Promise.resolve().then(() => inner(req)) };'],
  ['share: nothing is shared', 'if (hit && now() - hit.at < ttl) return', 'if (false) return'],
  ['share: the answer is handed out without a copy', 'return hit.p.then((v) => ({ ...structuredClone(v), id: pl.id }));', 'return hit.p.then((v) => v);'],
  ['share: the copy keeps the first caller\'s request id', '({ ...structuredClone(v), id: pl.id })', '(structuredClone(v))'],
  ['share: the options are left out of the key', 'const key = canon(pl.params);', 'const key = canon(pl.params[0]);'],
  ['share: option key order makes a new read', '? Object.fromEntries(Object.keys(x).sort().map((n) => [n, x[n]])) : x));', '? x : x));'],
  ['share: the age limit is ignored', 'if (hit && now() - hit.at < ttl) return', 'if (hit) return'],
  ['share: an error answer is kept', "if (!v || typeof v !== 'object' || 'error' in v || !('result' in v)) drop(); }, drop);", '}, drop);'],
  ['share: a failed request is kept', "|| !('result' in v)) drop(); }, drop);", "|| !('result' in v)) drop(); }, () => {});"],
  ['share: the chain-version probe shares too', 'export const openRpc = () => createSolanaRpcFromTransport(createDefaultRpcTransport({ url: RPC_URL }));', 'export const openRpc = () => sharedRpc();'],
  ['share: a pass keeps the last pass\'s answers', 'SHARED.clear(); // a pass shares account reads only with itself', ''],
];
let shareImport = 0;
async function shareSuite(file) {
  const failed = [];
  let r = {};
  try {
    const M = await import(pathToFileURL(file).href + '?share=' + (++shareImport));
    const src = fs.readFileSync(file, 'utf8');
    const ok1 = (id) => ({ jsonrpc: '2.0', id, result: { context: { slot: 5n }, value: { data: ['AAAA', 'base64'], lamports: 9n } } });
    const mk = (answer) => { const st = { calls: 0, t: 1000 }; const inner = async (req) => { st.calls++; return answer ? answer(st.calls, req) : ok1(req.payload.id); }; st.tx = M.shareTransport(inner, new Map(), () => st.t, 600); return st; };
    const q = (id, addr, opt, method = 'getAccountInfo') => ({ payload: { jsonrpc: '2.0', id, method, params: [addr, opt] } });
    let a = mk();
    { const s0 = mk(); const pending = s0.tx(q('a', 'ADDR', { encoding: 'base64' })); r.syncCalls = s0.calls; await pending; }
    r.twice = [await a.tx(q('a', 'ADDR', { encoding: 'base64', commitment: 'confirmed' })), await a.tx(q('b', 'ADDR', { encoding: 'base64', commitment: 'confirmed' }))];
    r.twiceCalls = a.calls; r.twice[1].result.value.data[0] = 'ZZZZ'; r.mutated = r.twice[0].result.value.data[0]; r.twice[1].result.value.data[0] = 'AAAA';
    a = mk(); await a.tx(q('a', 'ADDR', { encoding: 'base64', commitment: 'confirmed' })); await a.tx(q('b', 'ADDR', { commitment: 'confirmed', encoding: 'base64' })); r.orderCalls = a.calls;
    a = mk(); await a.tx(q('a', 'ADDR', { encoding: 'base64' })); await a.tx(q('b', 'OTHER', { encoding: 'base64' })); await a.tx(q('c', 'ADDR', { encoding: 'base64', dataSlice: { offset: 4, length: 8 } })); r.diffCalls = a.calls;
    a = mk(); r.concurrent = await Promise.all(['a', 'b', 'c'].map((id) => a.tx(q(id, 'ADDR', { encoding: 'base64' })))); r.concurrentCalls = a.calls;
    a = mk(); await a.tx(q('a', 'PROG', { encoding: 'base64' }, 'getProgramAccounts')); await a.tx(q('b', 'PROG', { encoding: 'base64' }, 'getProgramAccounts')); r.listCalls = a.calls;
    a = mk((n, req) => (n === 1 ? { jsonrpc: '2.0', id: req.payload.id, error: { code: -32005, message: 'rate limited' } } : ok1(req.payload.id)));
    await a.tx(q('a', 'ADDR', { encoding: 'base64' })); await new Promise((res) => setTimeout(res, 5)); r.errorSecond = await a.tx(q('b', 'ADDR', { encoding: 'base64' })); r.errorCalls = a.calls;
    a = mk((n, req) => { if (n === 1) throw new Error('boom'); return ok1(req.payload.id); });
    try { await a.tx(q('a', 'ADDR', { encoding: 'base64' })); } catch (e) { r.rejectFirst = e.message; }
    await new Promise((res) => setTimeout(res, 5)); await a.tx(q('b', 'ADDR', { encoding: 'base64' })); r.rejectCalls = a.calls;
    a = mk(); await a.tx(q('a', 'ADDR', { encoding: 'base64' })); a.t = 1599; await a.tx(q('b', 'ADDR', { encoding: 'base64' })); r.ttlInside = a.calls; a.t = 1600; await a.tx(q('c', 'ADDR', { encoding: 'base64' })); r.ttlAfter = a.calls;
    // collect() empties the share before it opens its RPC (read from the source: the pass itself needs the network)
    const body = src.slice(src.indexOf('export async function collect('));
    const iClear = body.indexOf('SHARED.clear()'), iRpc = body.indexOf('const rpc = sharedRpc();');
    // the chain-version probe's RPC is built without the share
    r.probePlain = /export const openRpc = \(\) => createSolanaRpcFromTransport\(createDefaultRpcTransport\(\{ url: RPC_URL \}\)\);/.test(src);
    r.clearsFirst = iClear >= 0 && iRpc > iClear && iRpc - iClear < 200;
  } catch (e) { return ['threw: ' + e.message]; }
  for (const [n, pred] of SHARE_CASES) { let good; try { good = pred(r); } catch { good = false; } if (!good) failed.push(n); }
  return failed;
}
async function shareChecks() {
  console.log('\n[share] one read per account per pass (shareTransport)');
  const realFailed = await shareSuite(COLLECTOR);
  for (const [n] of SHARE_CASES) ok(!realFailed.includes(n), 'share: ' + n);
  for (const n of realFailed) if (!SHARE_CASES.some(([c]) => c === n)) ok(false, 'share: ' + n);
  const src = fs.readFileSync(COLLECTOR, 'utf8');
  for (const [label, from, to] of SHARE_MUTANTS) {
    const at = src.indexOf(from);
    if (at < 0) { ok(false, `mutant "${label}": target text not found in the collector`); continue; }
    const mf = path.join(KIT_DIR, `.mutant-share-${process.pid}.mjs`);
    fs.writeFileSync(mf, src.slice(0, at) + to + src.slice(at + from.length));
    try { mutantFails(label, await shareSuite(mf)); } finally { fs.unlinkSync(mf); }
  }
}
// ---- origination prices: buildPriceBook().msrp and latest.ref.msrp ---------------------------------------------------
const MSRP_NFTS = [
  { mint: 'M1', name: 'Pearce X4', attributes: { itemType: 'ship' }, tradeSettings: { msrp: { value: 20, currencySymbol: 'USDC' } } },
  { mint: 'M2', name: 'Paid In Atlas', attributes: { itemType: 'ship' }, tradeSettings: { msrp: { value: 900, currencySymbol: 'ATLAS' } } },
  { mint: 'M3', name: 'Free Ship', attributes: { itemType: 'ship' }, tradeSettings: { msrp: { value: 0, currencySymbol: 'USDC' } } },
  { mint: 'M4', name: 'Text Price', attributes: { itemType: 'ship' }, tradeSettings: { msrp: { value: '20', currencySymbol: 'USDC' } } },
  { mint: 'M5', name: 'No Settings', attributes: { itemType: 'ship' } },
  { mint: 'M6', name: 'Hydrogen', attributes: { itemType: 'resource' }, tradeSettings: { msrp: { value: 3, currencySymbol: 'USDC' } } },
  { mint: 'M7', name: 'Claim Stake Tier 3', attributes: { itemType: 'structure' }, tradeSettings: { msrp: { value: 1024, currencySymbol: 'USDC' } } },
  { mint: 'M8', name: 'Claim Stake Tier 3 Bundle', attributes: { itemType: 'structure' }, tradeSettings: { msrp: { value: 5, currencySymbol: 'USDC' } } },
  { mint: 'M9', name: '__proto__', attributes: { itemType: 'ship' }, tradeSettings: { msrp: { value: 7, currencySymbol: 'USDC' } } },
  { mint: 'M10', name: 'Armstrong IMP', attributes: { itemType: 'ship' }, tradeSettings: { msrp: { value: 27500, currencySymbol: 'USDC' } } },
  null,
];
const MSRP_CASES = [
  ['a ship and a claim stake tier with a USDC list price are kept by name, with no order open for them', (r) => r.m['Pearce X4'] === 20 && r.m['Claim Stake Tier 3'] === 1024 && r.m['Armstrong IMP'] === 27500 && r.items === 0],
  ['a price in another currency is not kept', (r) => !('Paid In Atlas' in r.m)],
  ['a zero, text or missing price is not kept', (r) => !('Free Ship' in r.m) && !('Text Price' in r.m) && !('No Settings' in r.m)],
  ['only ships and claim stake tiers are kept (no resource, no other item that starts like a stake tier)', (r) => !('Hydrogen' in r.m) && !('Claim Stake Tier 3 Bundle' in r.m)],
  ['a ship named __proto__ is a plain entry and changes nothing else', (r) => Object.prototype.hasOwnProperty.call(r.m, '__proto__') && r.m['__proto__'] === 7 && ({}).x === undefined && Object.keys(r.m).length === 4],
  ['names come out sorted', (r) => Object.keys(r.m).filter((k) => k !== '__proto__').join('|') === 'Armstrong IMP|Claim Stake Tier 3|Pearce X4'],
  ['the snapshot takes origination prices, resource bids and asks in ATLAS and the ATLAS price from the price book', (r) => r.ref.msrp['Pearce X4'] === 20 && JSON.stringify(r.ref.px) === JSON.stringify({ Hydrogen: [0.5, 0.75], Biomass: [null, 2] }) && r.ref.atlasUsd === 0.0001 && r.ref.atlasUsdAt === 77],
  ['a resource with no order on either side, an item that is not a resource and a junk price are left out of ref.px', (r) => !('Empty' in r.ref.px) && !('Pearce X4' in r.ref.px) && !('Junk' in r.ref.px)],
  ['a price book without these fields adds nothing (an old book, null, text)', (r) => JSON.stringify(r.refOld) === '{}' && JSON.stringify(r.refNull) === '{}' && JSON.stringify(r.refBadRate) === '{}'],
  ['the pass spreads those fields into latest.ref', (r) => r.refSpread === true],
  ['the ATLAS price is taken only as a positive number, with its own time (now when the source gives none or one from the future)', (r) => JSON.stringify(r.rate) === JSON.stringify([{ usd: 0.00009, at: 500, source: 'coingecko' }, { usd: 0.00009, at: 1000, source: 'coingecko' }, { usd: 0.00009, at: 1000, source: 'coingecko' }, null, null, null, null, null])],
];
const MSRP_MUTANTS = [
  ['msrp: any currency kept', "v.currencySymbol !== 'USDC' || ", ''],
  ['msrp: zero prices kept', ' || !(v.value > 0)) continue;   // Number', ') continue;   // Number'],
  ['msrp: text prices kept', '!Number.isFinite(v.value) || ', ''],
  ['msrp: every item kept', "if (n.attributes?.itemType === 'ship' || /^Claim Stake Tier [1-9]$/.test(n.name)) msrp.set(n.name, v.value);", 'msrp.set(n.name, v.value);'],
  ['msrp: anything that starts like a stake tier kept', '/^Claim Stake Tier [1-9]$/.test(n.name)', '/^Claim Stake Tier [1-9]/.test(n.name)'],
  ['msrp: not in the price book', "    msrp: Object.fromEntries([...msrp].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))),\n", ''],
  ['msrp: names left in list order', '[...msrp].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))', '[...msrp]'],
  ['ref: origination prices not carried', "Object.keys(prices.msrp).length) out.msrp = prices.msrp;", 'Object.keys(prices.msrp).length) void 0;'],
  ['ref: every item priced as a resource', "if (!it || it.itemType !== 'resource' || typeof it.name", "if (!it || typeof it.name"],
  ['ref: a resource with no order kept', 'if (b !== null || a !== null) Object.defineProperty(px,', 'if (true) Object.defineProperty(px,'],
  ['ref: junk prices kept', "const side = (v) => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null);", 'const side = (v) => v;'],
  ['ref: the ATLAS price not carried', '{ out.atlasUsd = r.usd; out.atlasUsdAt = Number.isFinite(r.at) ? r.at : null; }', '{ }'],
  ['ref: not spread into the snapshot', '      ...refPrices(prices),\n', ''],
  ['rate: zero or negative taken', ' || !(e.usd > 0)) return null;   // Number', ') return null;   // Number'],
  ['rate: text taken', 'if (!e || !Number.isFinite(e.usd) || ', 'if (!e || '],
  ['rate: a time from the future kept', ' && e.last_updated_at <= nowSec + 3600 ? e.last_updated_at : nowSec;', ' ? e.last_updated_at : nowSec;'],
];
let msrpImport = 0;
async function msrpSuite(file) {
  let r = {};
  try {
    const M = await import(pathToFileURL(file).href + '?msrp=' + (++msrpImport));
    const P = M.buildPriceBook([], MSRP_NFTS, 5);
    r = { m: P.msrp || {}, items: P.items.length };
    const book = { msrp: { 'Pearce X4': 20 }, atlasUsd: { usd: 0.0001, at: 77, source: 'coingecko' }, items: [
      { name: 'Hydrogen', itemType: 'resource', atlas: { bestBid: 0.5, bestAsk: 0.75 } }, { name: 'Biomass', itemType: 'resource', atlas: { bestBid: null, bestAsk: 2 } },
      { name: 'Empty', itemType: 'resource', atlas: { bestBid: null, bestAsk: null } }, { name: 'Pearce X4', itemType: 'ship', atlas: { bestBid: 9, bestAsk: 10 } },
      { name: 'Junk', itemType: 'resource', atlas: { bestBid: 'x', bestAsk: -1 } }, { name: 'UsdcOnly', itemType: 'resource', usdc: { bestBid: 1, bestAsk: 2 } }, null] };
    r.ref = M.refPrices(book);
    r.refOld = M.refPrices({ items: [{ name: 'Pearce X4', itemType: 'ship', atlas: { bestBid: 9, bestAsk: 10 } }] });
    r.refNull = M.refPrices(null);
    r.refBadRate = M.refPrices({ items: [], msrp: {}, atlasUsd: { usd: 'x' } });
    r.rate = [M.atlasUsdOf({ 'star-atlas': { usd: 0.00009, last_updated_at: 500 } }, 1000), M.atlasUsdOf({ 'star-atlas': { usd: 0.00009 } }, 1000), M.atlasUsdOf({ 'star-atlas': { usd: 0.00009, last_updated_at: 99999999 } }, 1000),
      M.atlasUsdOf({ 'star-atlas': { usd: 0 } }, 1000), M.atlasUsdOf({ 'star-atlas': { usd: '0.1' } }, 1000), M.atlasUsdOf({}, 1000), M.atlasUsdOf(null, 1000), M.atlasUsdOf({ 'star-atlas': { usd: -1 } }, 1000)];
    // read from the source: the pass itself needs the network (a real pass on 2026-11-25 wrote px 56, msrp 65 and the rate into latest.ref)
    r.refSpread = /\n      \.\.\.refPrices\(prices\),\n/.test(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'));
  } catch (e) { return ['threw: ' + e.message]; }
  const failed = [];
  for (const [n, pred] of MSRP_CASES) { let good; try { good = pred(r); } catch { good = false; } if (!good) failed.push(n); }
  return failed;
}
async function msrpChecks() {
  console.log('\n[msrp] origination prices from the marketplace list');
  const realFailed = await msrpSuite(COLLECTOR);
  for (const [n] of MSRP_CASES) ok(!realFailed.includes(n), 'msrp: ' + n);
  for (const n of realFailed) if (!MSRP_CASES.some(([c]) => c === n)) ok(false, 'msrp: ' + n);
  const src = fs.readFileSync(COLLECTOR, 'utf8');
  for (const [label, from, to] of MSRP_MUTANTS) {
    const at = src.indexOf(from);
    if (at < 0 || src.indexOf(from, at + 1) >= 0) { ok(false, 'mutant "' + label + '": target text not found exactly once in the collector'); continue; }
    const mf = path.join(KIT_DIR, '.mutant-msrp-' + process.pid + '.mjs');
    fs.writeFileSync(mf, src.slice(0, at) + to + src.slice(at + from.length));
    try { mutantFails(label, await msrpSuite(mf)); } finally { fs.unlinkSync(mf); }
  }
}
async function fleetStatChecks() {
  console.log('\n[stats] fleet + ship-model stats (statKeys, shipDefs, st, hold, extras)');
  const realFailed = await fleetStatSuite(COLLECTOR);
  for (const [n] of STAT_CASES) ok(!realFailed.includes(n), 'stats: ' + n);
  for (const n of realFailed) if (!STAT_CASES.some(([c]) => c === n)) ok(false, 'stats: ' + n);
  const src = fs.readFileSync(COLLECTOR, 'utf8');
  for (const [label, from, to] of STAT_MUTANTS) {
    const at = src.indexOf(from);
    if (at < 0 || src.indexOf(from, at + 1) >= 0) { ok(false, `mutant "${label}": target text not found exactly once in the collector`); continue; }
    const mf = path.join(KIT_DIR, `.mutant-stat-${process.pid}.mjs`);
    fs.writeFileSync(mf, src.slice(0, at) + to + src.slice(at + from.length));
    try { mutantFails(label, await fleetStatSuite(mf)); } finally { fs.unlinkSync(mf); }
  }
}

// The live stake checks on fake results: a fresh / reset galaxy (0 or 3 stakes) must SKIP the population checks with a named
// reason and fail nothing; structural checks still bite on whatever rows exist; over capacity is no failure.
function skipPathChecks() {
  console.log('\n[10] live stake checks: population checks skip on a small galaxy, structural checks still run (offline, fake results)');
  const good = (i) => ({ a: `G${i}`, b: 1, bl: [{ id: 0, n: 'Hub', q: 1, k: 'extraction_hub' }], rent: { bal: 1, at: 1 }, pw: { gen: 1, use: 0 }, cs: 0, su: 0,
    out: [{ r: 'Fuel', ps: 2 }, { r: 'Iron Ore', ps: 1 }], use: [{ r: 'Fuel', ps: 0.5 }], inv: [{ r: 'Fuel', q: 5 }], fuel: 5, cap: { used: 2, total: 1 } }); // used > total: over capacity
  const res = (n, patch) => ({ latest: { quality: {}, stakes: Array.from({ length: n }, (_, i) => ({ ...good(i), ...(patch && i === 0 ? patch : {}) })) }, cases: STAKE_LIVE_CASES });
  const POP = STAKE_LIVE_CASES.filter(([n]) => /population/.test(n)).length;
  const want = (rep, f, s) => rep.failed.length === f && rep.skipped.length === s;
  ok(POP === 3, 'skip path: the live stake checks hold 3 population cases');
  for (const n of [0, 3]) {
    const rep = degradeReport(res(n));
    ok(want(rep, 0, POP), `skip path: a fake chain of ${n} stakes -> no failure, ${POP} SKIPPED (got ${rep.failed.length} failed, ${rep.skipped.length} skipped)`);
    ok(rep.skipped.every((s) => s.name && s.why.includes(`${n} live stake`)), `skip path: each skip names its check and the stake count (${n})`);
  }
  const full = degradeReport(res(12));
  ok(want(full, 0, 0), `skip path (positive control): 12 good stakes -> nothing skipped, nothing failed (got ${full.failed.length} failed, ${full.skipped.length} skipped)`);
  const noFuel = degradeReport({ latest: { quality: {}, stakes: Array.from({ length: 12 }, (_, i) => ({ ...good(i), fuel: 0, inv: [] })) }, cases: STAKE_LIVE_CASES });
  ok(want(noFuel, 0, 1) && /Fuel/.test(noFuel.skipped[0].name), 'skip path: 12 stakes and none holds Fuel -> only the Fuel population check is skipped');
  ok(degradeReport(res(3, { b: 5 })).failed.some((n) => /sum to b/.test(n)), 'skip path: structural check still fails on 3 stakes (bl does not sum to b)');
  ok(degradeReport(res(3, { out: [{ r: 'Fuel', ps: -1 }] })).failed.some((n) => /well-formed/.test(n)), 'skip path: structural check still fails on 3 stakes (a negative rate in out)');
  ok(degradeReport(res(3, { use: undefined })).failed.some((n) => /well-formed/.test(n)), 'skip path: out present but use absent is malformed');
  ok(degradeReport(res(0)).failed.length === 0 && degradeReport(res(3, { out: undefined, use: undefined })).failed.length === 0, 'skip path: absent out and use together is well-formed');
  // the printed line + the counter: degradeVerdict(.., true) prints one SKIPPED line per skip and counts it apart from pass / fail
  const lines = [], o = console.log, before = skips; console.log = (m) => lines.push(String(m));
  try { degradeVerdict(res(3), true); } finally { console.log = o; }
  ok(lines.filter((l) => /SKIPPED /.test(l)).length === POP && skips - before === POP && lines.some((l) => /live stakes 3;.*over capacity 3/.test(l)), 'skip path: one visible SKIPPED line per skip, counted in the skipped total, and the counts line reports over capacity');
  skips = before; // these are test skips, not live ones
  // negative: a harness whose skip branch returns a silent pass (no record, no line) is caught by the same assertions
  const silent = (r) => { const failed = [], skipped = []; for (const [n, pred] of r.cases) { let v; try { v = pred(r); } catch { v = false; } if (v === SKIP) continue; if (!v) failed.push(n); } return { failed, skipped }; };
  const mutRep = silent(res(3));
  ok(!want(mutRep, 0, POP) && mutRep.skipped.length === 0, 'mutant "a skip becomes a silent pass with no line" is caught (the 3-stake assertion fails on it)');
  // negative: a harness that FAILS a skip is caught by the no-failure assertion
  const hard = (r) => { const rep = degradeReport(r); return { failed: [...rep.failed, ...rep.skipped.map((s) => s.name)], skipped: [] }; };
  ok(!want(hard(res(3)), 0, POP), 'mutant "a skip is reported as a failure" is caught');
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
// ---- live stake checks: population (skippable) + structural (always) --------------------------------------------
// MIN_STAKES = 10: with fewer live stakes than this the population checks are SKIPPED (the old floor was "more than 10").
const MIN_STAKES = 10;
const SKIP = Symbol('skip');
const KS = 'central_hub cultivation_hub extraction_hub processing_hub storage_hub farm_hub power_plant crew_quarters storage_module farm extractor processor'.split(' ');
const rateList = (a) => Array.isArray(a) && a.every((o, n) => typeof o.r === 'string' && o.r.length > 0 && Number.isFinite(o.ps) && o.ps > 0 && (n === 0 || a[n - 1].ps >= o.ps));
// a case returns true / false, or SKIP (+ the reason in skipWhy) when the live galaxy cannot hold the thing it checks
const STAKE_LIVE_CASES = [
  ['stake detail (live, population): at least MIN_STAKES stakes were read', (r) => r.latest.stakes.length < MIN_STAKES ? SKIP : true],
  ['stake detail (live): every stake row carries bl and rent', (r) => r.latest.stakes.every((k) => Array.isArray(k.bl) && k.rent && Number.isFinite(k.rent.bal))],
  ['stake detail (live, population): at least one stake has buildings', (r) => r.latest.stakes.length < MIN_STAKES ? SKIP : r.latest.stakes.some((k) => k.b > 0)],
  ['stake detail (live): every stake with b > 0 has bl whose quantities sum to b', (r) => r.latest.stakes.filter((k) => k.b > 0).every((k) => k.bl.length > 0 && k.bl.reduce((s, b) => s + b.q, 0) === k.b)],
  ['stake detail (live): kinds are the 12 tile kinds, and buildings are named unless the definitions failed', (r) => {
    const bl = r.latest.stakes.flatMap((k) => k.bl); return bl.every((b) => KS.includes(b.k)) && (r.latest.quality.buildingDefsFailed || bl.every((b) => !/^building #/.test(b.n))); }],
  ['stake detail (live): rent is a finite number, storage is finite, power present unless the definitions failed', (r) => r.latest.stakes.every((k) => (!k.cap || (Number.isFinite(k.cap.used) && Number.isFinite(k.cap.total) && k.cap.used >= 0 && k.cap.total >= 0))
    && Number.isFinite(k.rent.bal) && k.rent.bal >= 0 && (r.latest.quality.buildingDefsFailed ? k.pw === undefined : (k.pw && k.pw.gen >= 0 && k.pw.use >= 0)))],
  ['stake detail (live): out and use are well-formed lists (positive rates, sorted desc), or absent', (r) => r.latest.stakes.every((k) => (k.out === undefined || rateList(k.out)) && (k.use === undefined || rateList(k.use)) && (k.out === undefined) === (k.use === undefined))],
  ['stake detail (live, population): at least one stake holds Fuel', (r) => r.latest.stakes.length < MIN_STAKES || !r.latest.stakes.some((k) => k.fuel > 0) ? SKIP : true],
  ['stake detail (live): fuel equals its inventory Fuel item', (r) => r.latest.stakes.every((k) => k.fuel === undefined || k.fuel === (k.inv.find((i) => i.r === 'Fuel')?.q || 0))],
  ['stake detail (live): inventory sorted by quantity desc', (r) => r.latest.stakes.every((k) => !k.inv || k.inv.every((i, n) => n === 0 || k.inv[n - 1].q >= i.q))],
];
// -> { failed: [names], skipped: [{ name, why }] }. over-capacity stakes are REPORTED, never a failure (the chain models
// over capacity explicitly: capacity.overCapacityRaw).
function degradeReport(r, cases = r.cases) {
  const failed = [], skipped = [];
  for (const [n, pred] of cases) {
    let v; try { v = pred(r); } catch { v = false; }
    if (v === SKIP) skipped.push({ name: n, why: `${(r.latest.stakes || []).length} live stake(s), fewer than ${MIN_STAKES} or none with the thing checked` });
    else if (!v) failed.push(n);
  }
  return { failed, skipped };
}
function degradeVerdict(r, print = false) {
  const { failed, skipped } = degradeReport(r);
  if (print) {
    const st = r.latest.stakes || [];
    console.log(`    live stakes ${st.length}; with buildings ${st.filter((k) => k.b > 0).length}; holding Fuel ${st.filter((k) => k.fuel > 0).length}; over capacity ${st.filter((k) => k.cap && k.cap.used > k.cap.total).length}; with out ${st.filter((k) => k.out && k.out.length).length}, with use ${st.filter((k) => k.use && k.use.length).length}`);
    for (const s of skipped) { skips++; console.log(`  SKIPPED ${s.name} (${s.why})`); }
  }
  return failed;
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
  // claim stake detail rows on the real chain (spec A). A chain flag (buildingDefsFailed) is honest degradation, not a failure here.
  // The live galaxy can be fresh or just reset (few or no stakes, no Fuel yet): the POPULATION checks are then SKIPPED with a
  // visible line (counted apart from pass / fail); the STRUCTURAL checks run on whatever rows exist (vacuously true on none).
  ...STAKE_LIVE_CASES,
  ['holdings rolled up from fleets (cargo + hulls)', (r) => r.latest.owners.some((o) => o.holdings?.cargo?.length && Object.keys(o.holdings.hulls).length)],
];

main().then(() => {
  console.log(`\n${passes} passed, ${fails} failed, ${skips} skipped`);
  process.exit(fails ? 1 : 0);
}).catch((e) => { console.log('ERROR ' + (e.stack || e.message)); process.exit(1); });
