// Probe: what does listClaimStakeDefinitions return (tier / name for stakes[].def)?
import { createSolanaRpc } from '@solana/kit';
import { createSageContext } from '@aephia/atlas-kit/client';
import { listClaimStakeDefinitions } from '@aephia/atlas-kit/claim-stakes';

const ctx = createSageContext({ cluster: 'zink-ptr', rpc: createSolanaRpc('https://testnet-rpc.z.ink') });
const defs = await listClaimStakeDefinitions(ctx);
console.log('defs', defs.length);
const j = (o) => JSON.stringify(o, (k, v) => (typeof v === 'bigint' ? v.toString() : v));
for (const d of defs.slice(0, 3)) console.log(Object.keys(d).join(','), '\n ', j(d).slice(0, 500));
await ctx.dispose?.();
