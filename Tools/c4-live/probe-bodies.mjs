// Probe: what does z.ink return for celestial bodies (planets/asteroids)? Dumps samples to probe-out/.
import { createSolanaRpc } from '@solana/kit';
import { createSageContext } from '@aephia/atlas-kit/client';
import { getAllCelestialBodies, getPlanetResources, getPlanetClaimStakePlots } from '@aephia/atlas-kit/world';
import { mkdirSync, writeFileSync } from 'node:fs';

const ctx = createSageContext({ cluster: 'zink-ptr', rpc: createSolanaRpc(process.env.C4_RPC_URL || 'https://testnet-rpc.z.ink') });
const j = (o) => JSON.stringify(o, (k, v) => (typeof v === 'bigint' ? v.toString() : v), 2);
mkdirSync('probe-out', { recursive: true });
const t0 = Date.now();
const bodies = await getAllCelestialBodies(ctx);
console.log('bodies', bodies.length, Date.now() - t0, 'ms');
const kinds = {};
for (const b of bodies) kinds[b.kind] = (kinds[b.kind] || 0) + 1;
console.log('kinds', kinds);
const planet = bodies.find((b) => b.kind === 'planet');
const ast = bodies.find((b) => b.kind !== 'planet');
writeFileSync('probe-out/body-planet.json', j(planet?.toJSON ? planet.toJSON() : planet));
writeFileSync('probe-out/body-asteroid.json', j(ast?.toJSON ? ast.toJSON() : ast));
console.log('planet keys', Object.keys(planet || {}).join(','));
console.log('asteroid keys', Object.keys(ast || {}).join(','));
try { const r = await getPlanetResources(ctx, planet); writeFileSync('probe-out/planet-resources.json', j(r)); console.log('planetResources ok', r.resources?.length); } catch (e) { console.log('planetResources FAIL', e.code, String(e.message).slice(0, 200)); }
try { const p = await getPlanetClaimStakePlots(ctx, planet); writeFileSync('probe-out/planet-plots.json', j(p)); console.log('plots ok'); } catch (e) { console.log('plots FAIL', e.code, String(e.message).slice(0, 200)); }
writeFileSync('probe-out/bodies-all.json', j(bodies.map((b) => (b.toJSON ? b.toJSON() : b))));
await ctx.dispose?.();
