// TEMPORARY, goes with compat.mjs: is the compat step still needed?
//   node Tools/c4-live/probe-compat.mjs
// Reads every fleet and claim stake of the game through the installed kit twice from ONE list answer: as the chain
// sends them, and through compatTransport(). Read-only, writes nothing.
//   "refused without the step" = 0  ->  the installed kit reads the game by itself: remove compat.mjs (its header
//                                       says how) and just use the kit.
//   "refused with the step"    > 0  ->  the game changed again; those accounts are left out by the collector.
import { createDefaultRpcTransport, createSolanaRpcFromTransport } from '@solana/kit';
import { createSageContext } from '@aephia/atlas-kit/client';
import { discoverFleetAddresses } from '@aephia/atlas-kit/fleets';
import { getAllClaimStakes } from '@aephia/atlas-kit/claim-stakes';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { skipTransport, discoverReadable } from './collector.mjs';
import { compatTransport, newCompat } from './compat.mjs';

const RPC_URL = process.env.C4_RPC_URL || 'https://testnet-rpc.z.ink';
const LIMIT = 5000; // accounts one run may leave out before it gives up

// baseline: false skips the run without the step (it repeats the read once per refused account: minutes).
export async function probeCompat({ baseline = true } = {}) {
  const base = createDefaultRpcTransport({ url: RPC_URL }), lists = new Map();
  // both runs judge the same accounts: a list read is sent once and answered from memory afterwards
  const held = (req) => {
    const pl = req?.payload;
    if (pl?.method !== 'getProgramAccounts') return base(req);
    const key = JSON.stringify(pl.params);
    if (!lists.has(key)) lists.set(key, Promise.resolve(base(req)));
    return lists.get(key).then((v) => ({ ...structuredClone(v), id: pl.id }));
  };
  const run = async (seen) => {
    const ctl = { skip: new Set(), hold: null };
    const ctx = createSageContext({ cluster: 'zink-ptr', rpc: createSolanaRpcFromTransport(skipTransport(seen ? compatTransport(held, seen) : held, ctl)) });
    try {
      const fleets = await discoverReadable(() => discoverFleetAddresses(ctx), ctl, LIMIT);
      const fleetsRefused = ctl.skip.size;
      const stakes = await discoverReadable(() => getAllClaimStakes(ctx), ctl, LIMIT);
      return { fleets: fleets.length, fleetsRefused, stakes: stakes.length, stakesRefused: ctl.skip.size - fleetsRefused };
    } finally { await ctx.dispose?.(); }
  };
  const seen = newCompat();
  const without = baseline ? await run(null) : null, withStep = await run(seen);
  return { without, with: withStep, translated: { fleets: seen.fleets.size, stakes: seen.stakes.size, lossy: seen.lossy.size } };
}

// A verdict needs a real galaxy behind it: an empty or tiny read refuses nothing and proves nothing.
export const MIN_FLEETS = 100, MIN_STAKES = 20;
if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const r = await probeCompat();
  const line = (label, x) => console.log(`${label}  fleets ${x.fleets} read, ${x.fleetsRefused} refused | claim stakes ${x.stakes} read, ${x.stakesRefused} refused`);
  line('without the step:', r.without);
  line('with the step:   ', r.with);
  console.log(`translated: ${r.translated.fleets} fleets, ${r.translated.stakes} claim stakes; flagged for a second look (see compat.mjs, "lossy"): ${r.translated.lossy}`);
  const needed = r.without.fleetsRefused + r.without.stakesRefused;
  if (r.with.fleets < MIN_FLEETS || r.with.stakes < MIN_STAKES) {
    console.log(`NO VERDICT: only ${r.with.fleets} fleets and ${r.with.stakes} claim stakes were read (at least ${MIN_FLEETS} and ${MIN_STAKES} are needed to judge). Keep compat.mjs and run this again.`);
    process.exit(2);
  }
  console.log(needed ? `STILL NEEDED: the installed kit refuses ${needed} accounts on its own.` : 'NOT NEEDED ANY MORE: the installed kit reads every account on its own. Remove compat.mjs (see its header).');
  if (r.with.fleetsRefused + r.with.stakesRefused) console.log('NOTE: some accounts are refused even with the step - the game has a form this step does not know.');
}
