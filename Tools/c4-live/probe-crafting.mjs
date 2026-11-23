// probe-crafting.mjs - read-only: does the chain say which recipes are being crafted? Each recipe account carries a
// usage counter (config-snapshot.mjs drops it because it is state, not config). This prints the recipes with the
// highest counter and the raw material those crafts consumed (counter x ingredient quantity). One RPC list read.
//   node Tools/c4-live/probe-crafting.mjs [topN]
import { openRpc } from './collector.mjs';
import { createSageContext } from '@aephia/atlas-kit/client';
import * as crafting from '@aephia/atlas-kit/crafting';

const top = Number(process.argv[2]) || 15;
const ctx = createSageContext({ cluster: 'zink-ptr', rpc: openRpc() });
const rows = await crafting.listRecipes(ctx);
const list = (Array.isArray(rows) ? rows : [rows]).map(r => (r && typeof r.toJSON === 'function' ? r.toJSON() : r));
const n = v => Number(typeof v === 'bigint' ? v : v ?? 0);
const used = list.map(r => ({ name: r.name, uses: n(r.usageCountRaw ?? r.usageCount), ing: r.ingredients || [], out: r.outputs || [] })).filter(r => r.uses > 0).sort((a, b) => b.uses - a.uses);
console.log('recipes read', list.length, '| with a usage count above zero', used.length, '| total runs', used.reduce((t, r) => t + r.uses, 0));
console.log('sample keys', Object.keys(list[0] || {}).join(','));
for (const r of used.slice(0, top)) console.log(String(r.uses).padStart(9), r.name, '<-', r.ing.map(i => n(i.quantityRaw ?? i.quantity) + ' ' + i.name).join(', '));
const burned = new Map();
for (const r of used) for (const i of r.ing) burned.set(i.name, (burned.get(i.name) || 0) + r.uses * n(i.quantityRaw ?? i.quantity));
console.log('--- consumed by those runs (counter x ingredient quantity; ignores efficiency modifiers)');
for (const [k, v] of [...burned].sort((a, b) => b[1] - a[1]).slice(0, top)) console.log(String(v).padStart(12), k);
