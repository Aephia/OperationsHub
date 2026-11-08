// Probe (builder-c4-collector, 2026-11-07): what do owner names, wallets and fleet cargo cost on top of the
// core pass? Counts RPC calls by method through a counting transport. Read-only; writes nothing.
//   node probe-holdings.mjs
import { createSolanaRpcFromTransport, createDefaultRpcTransport } from '@solana/kit';
import { createSageContext } from '@aephia/atlas-kit/client';
import { discoverFleetAddresses, getFleets } from '@aephia/atlas-kit/fleets';
import { getFleetCargoInventory, listCargoDefinitions } from '@aephia/atlas-kit/cargo';
import { getProfile } from '@aephia/atlas-kit/identity';

const URL_ = process.env.C4_RPC_URL || 'https://testnet-rpc.z.ink';
const calls = {};
const inner = createDefaultRpcTransport({ url: URL_ });
const transport = async (cfg) => { const m = cfg.payload?.method || '?'; calls[m] = (calls[m] || 0) + 1; return inner(cfg); };
const rpc = createSolanaRpcFromTransport(transport);
const ctx = createSageContext({ cluster: 'zink-ptr', rpc });
const snap = () => JSON.stringify(calls);
const big = (k, v) => (typeof v === 'bigint' ? String(v) : v);

let t = Date.now();
const addrs = await discoverFleetAddresses(ctx);
const fleets = await getFleets(ctx, addrs);
console.log('core fleets', fleets.length, 'ms', Date.now() - t, 'calls', snap());
console.log('fleet keys', Object.keys(fleets[0]).join(','));
console.log('ships[0]', JSON.stringify(fleets[0].ships?.[0], big).slice(0, 300));
console.log('cargoHold on snapshot', JSON.stringify(fleets[0].cargoHold, big)?.slice(0, 300));

t = Date.now();
const before = { ...calls };
const inv = [];
let failed = 0;
for (const a of addrs) { try { inv.push(await getFleetCargoInventory(ctx, a)); } catch (e) { failed++; if (failed < 3) console.log('inv fail', e.message.slice(0, 160)); } }
const delta = Object.fromEntries(Object.entries(calls).map(([k, v]) => [k, v - (before[k] || 0)]).filter(([, v]) => v));
console.log('cargo inventories', inv.length, 'failed', failed, 'ms', Date.now() - t, 'extra calls', JSON.stringify(delta));
const withItems = inv.find((i) => i.cargoHold.items.length);
console.log('example inv', JSON.stringify(withItems?.toJSON(), big)?.slice(0, 900));
const names = {};
for (const i of inv) for (const it of [...i.cargoHold.items, i.fuel, i.ammo]) if (it) names[it.name] = (names[it.name] || 0) + Number(it.quantityRaw);
console.log('cargo names', JSON.stringify(names).slice(0, 1500));
const defs = await listCargoDefinitions(ctx);
console.log('cargo defs', defs.length, defs.slice(0, 40).map((d) => d.name).join(' | '));

const prof = await getProfile(ctx, fleets.find((f) => !f.npcFactionId).ownerProfile.address);
console.log('profile', JSON.stringify(prof.toJSON?.() ?? prof, big).slice(0, 800));
const shipNames = new Set(); for (const f of fleets) for (const s of f.ships || []) shipNames.add(s.name);
console.log('ship names', shipNames.size, [...shipNames].slice(0, 60).join(' | '));
await ctx.dispose?.();
