// Ground-truth probe: what does z.ink actually return? Dumps one sample of each read to probe-out/.
import { createSolanaRpc } from '@solana/kit';
import { createSageContext } from '@aephia/atlas-kit/client';
import { discoverFleetAddresses, getFleets } from '@aephia/atlas-kit/fleets';
import { getFleetMiningState } from '@aephia/atlas-kit/mining';
import { getFleetCombatStatus } from '@aephia/atlas-kit/combat';
import { getProfile, getCharacterForProfile } from '@aephia/atlas-kit/identity';
import { getAllClaimStakes } from '@aephia/atlas-kit/claim-stakes';
import { getStarSystems } from '@aephia/atlas-kit/world';
import { listCargoDefinitions } from '@aephia/atlas-kit/cargo';
import { mkdirSync, writeFileSync } from 'node:fs';
const rpc = createSolanaRpc(process.env.C4_RPC_URL || 'https://testnet-rpc.z.ink');
const ctx = createSageContext({ cluster: 'zink-ptr', rpc });
const j = (o) => JSON.stringify(o, (k, v) => typeof v === 'bigint' ? v.toString() + 'n' : v, 2);
mkdirSync('probe-out', { recursive: true });
const t = async (name, fn) => { const t0 = Date.now(); try { const r = await fn(); writeFileSync(`probe-out/${name}.json`, j(r)); console.log(name, 'ok', Date.now() - t0, 'ms', Array.isArray(r) ? r.length + ' rows' : ''); return r; } catch (e) { console.log(name, 'FAIL', e.code || '', e.message?.slice(0, 300)); } };
const addrs = await t('fleetAddrs', () => discoverFleetAddresses(ctx));
const fleets = await t('fleets', () => getFleets(ctx, addrs.slice(0, 2000)));
const states = {}; for (const f of fleets || []) { const k = f.state?.kind; states[k] = (states[k] || 0) + 1; }
console.log('states', states, 'owners', new Set((fleets||[]).map(f => f.ownerProfile?.address ?? JSON.stringify(f.ownerProfile))).size);
const miner = fleets?.find(f => f.state?.kind === 'mining') || fleets?.[0];
if (miner) {
  writeFileSync('probe-out/fleet-sample.json', j(miner.toJSON ? miner.toJSON() : miner));
  await t('mining', () => getFleetMiningState(ctx, miner.address));
  await t('combat', () => getFleetCombatStatus(ctx, miner.address));
  const pa = miner.ownerProfile.address;
  await t('profile', () => getProfile(ctx, pa));
  await t('character', () => getCharacterForProfile(ctx, pa));
}
await t('claimStakes', () => getAllClaimStakes(ctx));
await t('systems', () => getStarSystems(ctx));
await t('cargoDefs', () => listCargoDefinitions(ctx));
await ctx.dispose?.();
