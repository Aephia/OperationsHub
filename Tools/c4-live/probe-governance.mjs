// Probe (read-only): which governance account types exist on the z.ink testnet, how many, and what one looks like.
// usage: node probe-governance.mjs [outDir]   -> writes <outDir>/governance-probe.json (default probe-out)
import { createSolanaRpc } from '@solana/kit';
import { createSageContext } from '@aephia/atlas-kit/client';
import * as sage from '@staratlas/dev-sage';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const idl = require('@staratlas/dev-sage/idl.json');
const RE = /govern|democra|vote|ballot|treasur|kingSystem/i;
const names = (idl.accounts || []).map((a) => a.name).filter((n) => RE.test(n));
const outDir = process.argv[2] || 'probe-out';
const rpc = createSolanaRpc('https://testnet-rpc.z.ink');
const ctx = createSageContext({ cluster: 'zink-ptr', rpc });
const program = ctx.programs?.sage ?? ctx.programAddresses?.sage ?? sage.SAGE_PROGRAM_ADDRESS;
console.log('program', program, '| ctx keys', Object.keys(ctx).join(','));

const j = (o) => JSON.parse(JSON.stringify(o, (k, v) => (typeof v === 'bigint' ? v.toString() : v instanceof Uint8Array ? '0x' + Buffer.from(v).toString('hex').slice(0, 64) : v)));
const pascal = (n) => n[0].toUpperCase() + n.slice(1);
const snake = (n) => n.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();
const b58 = (bytes) => { // minimal base58 for the memcmp filter
  const A = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'; let n = 0n; for (const b of bytes) n = n * 256n + BigInt(b);
  let s = ''; while (n > 0n) { s = A[Number(n % 58n)] + s; n /= 58n; } for (const b of bytes) { if (b === 0) s = '1' + s; else break; } return s;
};

const out = { takenAt: Math.floor(Date.now() / 1000), program: String(program), types: {} };
for (const n of names) {
  const disc = sage[snake(n) + '_DISCRIMINATOR'];
  const dec = sage['get' + pascal(n) + 'Decoder'];
  if (!disc || !dec) { out.types[n] = { error: 'no discriminator or decoder export' }; console.log(n.padEnd(34), 'NO EXPORT'); continue; }
  try {
    const res = await rpc.getProgramAccounts(program, { encoding: 'base64', filters: [{ memcmp: { offset: 0n, bytes: b58(disc), encoding: 'base58' } }] }).send();
    const rows = Array.isArray(res) ? res : res.value;
    const sizes = {}; for (const r of rows) { const len = Buffer.from(r.account.data[0], 'base64').length; sizes[len] = (sizes[len] || 0) + 1; }
    const samples = [];
    let decodeErr = null;
    for (const r of rows.slice(0, process.env.GOV_ALL ? 1000 : 3)) {
      try { samples.push({ address: r.pubkey, data: j(dec().decode(Buffer.from(r.account.data[0], 'base64'))) }); } catch (e) { decodeErr = String(e.message || e).slice(0, 200); }
    }
    out.types[n] = { count: rows.length, sizes, samples, decodeErr };
    console.log(n.padEnd(34), String(rows.length).padStart(6), decodeErr ? 'DECODE ERR ' + decodeErr : '');
  } catch (e) { out.types[n] = { error: String(e.message || e).slice(0, 300) }; console.log(n.padEnd(34), 'RPC ERR', String(e.message || e).slice(0, 120)); }
}
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'governance-probe.json'), JSON.stringify(out, null, 1));
console.log('wrote', path.join(outDir, 'governance-probe.json'));
await ctx.dispose?.();
