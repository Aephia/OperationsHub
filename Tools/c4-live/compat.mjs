// =====================================================================================================================
// TEMPORARY - REMOVE THIS FILE WHEN THE KIT READS THESE ACCOUNTS ITSELF.
//
// C4 Live reads the game through @aephia/atlas-kit and nothing else; that is the design and it stays the design.
// This file exists only because the game changed two account forms on 2026-11-25 before any kit or bindings release
// knew them (checked 2026-11-25: @staratlas/dev-sage latest 0.56.0, @aephia/atlas-kit up to 0.8.0-next.7 still built
// on it). It rewrites those two forms into the forms the kit knows, BEFORE the kit sees the bytes. It adds no reader
// and no decoder of its own to the page: everything shown still comes out of the kit.
//
// WHEN TO REMOVE: a kit release reads a fleet in the new mining state and a claim stake with the trailing block.
//   Test:  node Tools/c4-live/probe-compat.mjs   prints how many accounts the installed kit refuses WITHOUT this
//          step. When that is 0 with a new kit installed, it says "NOT NEEDED ANY MORE".
// HOW TO REMOVE (then we just use the kit):
//   1. update the kit in package.json (see README "The vendored kit" for the way back to a registry version)
//   2. delete this file, probe-compat.mjs and the lines marked COMPAT in collector.mjs
//   3. delete the [compat] sections of Test/c4-collector-check.js and Test/fixtures/c4-compat-accounts.json
//   4. node C4Live/collect-src/build.mjs, node Tools/c4-live/stamp.mjs, then the checks
//
// WHAT IT TRANSLATES (measured on z.ink 2026-11-25, every affected account fitted exactly):
//   Fleet, state variant 8 (unknown to the bindings; 196 of 1,129 fleets and rising). A new mining state. The state
//   is the LAST field of the account:
//       tag 8 | asteroid 32 | regionXpModifier 4 | minedStorageUnits 8 | exitFuelCeiling 8 | cargoCapacity 8 |
//       progressionGainPpb 4 | 16 bytes | count u32 | count x { cargoId u16, 16 bytes }
//   The 64 bytes after the tag are the fields of the known MineAsteroid state (variant 4), in the same order, so the
//   fleet is rewritten as variant 4 with the same asteroid, the same numbers and the same resource ids.
//   NOT carried over: the 16 bytes and the 16 bytes per resource. All of them were zero in every account read; their
//   meaning is not known. An account where they are not zero is still translated and counted in `lossy`.
//
//   Claim stake with 24 bytes after the known layout (139 of 270): "SAGEMXP", one version byte (1), a 16-byte number.
//   The bindings read such an account; the kit refuses it for the trailing bytes. The block is cut off.
//   NOT carried over: the number. It was zero on 98 of the 139 and otherwise looks like a fixed-point counter with 56
//   fractional bits (whole values such as 14, 16, 21, 23, 406) - by its label an experience counter of the stake.
//   That reading is a guess; the page shows no such value and the kit has no field for it, so nothing shown changes.
//   Counted in `lossy` only when the version byte is not 1 (the block itself changed).
//
// RULE: an account that does not fit EXACTLY is handed on untouched, and the kit refuses it as before (the collector
// then leaves it out: skipTransport / discoverReadable). A translated fleet must decode with the bindings as a
// MineAsteroid fleet ending at the last byte, or it is not translated.
// =====================================================================================================================
import { FLEET_DISCRIMINATOR, CLAIM_STAKE_INSTANCE_DISCRIMINATOR, getFleetDecoder, getClaimStakeInstanceDecoder } from '@staratlas/dev-sage';

export const NEW_MINING_STATE = 8;   // the fleet state variant the bindings do not know
export const OLD_MINING_STATE = 4;   // MineAsteroid
const STATE_HEAD = 64;               // asteroid .. progressionGainPpb, identical in both states
const STATE_EXTRA = 16;              // bytes between the head and the resource count in the new state
const RES_NEW = 18, RES_OLD = 2;     // one resource: { id u16, 16 bytes } -> id u16
const MAX_RESOURCES = 64;
export const STAKE_BLOCK = 24;       // "SAGEMXP" + version + 16 bytes
const STAKE_MARK = [0x53, 0x41, 0x47, 0x45, 0x4d, 0x58, 0x50]; // "SAGEMXP"

let fleetDec = null, stakeDec = null;
const startsWith = (d, mark, at = 0) => d.length >= at + mark.length && mark.every((b, i) => d[at + i] === b);
const allZero = (d, from, to) => { for (let i = from; i < to; i++) if (d[i] !== 0) return false; return true; };
const decodes = (dec, d) => { try { return dec.read(d, 0); } catch { return null; } };

// A fleet in the new mining state -> { data, lossy } rewritten as MineAsteroid; null when it is not one.
export function translateFleet(d) {
  if (!startsWith(d, FLEET_DISCRIMINATOR)) return null;
  const dv = new DataView(d.buffer, d.byteOffset, d.byteLength);
  const fixed = 1 + STATE_HEAD + STATE_EXTRA + 4; // tag .. count
  for (let n = 0; n <= MAX_RESOURCES; n++) {
    const at = d.length - (fixed + RES_NEW * n); // where the state would start with n resources
    if (at < FLEET_DISCRIMINATOR.length) break;
    if (d[at] !== NEW_MINING_STATE || dv.getUint32(at + fixed - 4, true) !== n) continue;
    const out = new Uint8Array(at + 1 + STATE_HEAD + 4 + RES_OLD * n), ov = new DataView(out.buffer);
    out.set(d.subarray(0, at + 1 + STATE_HEAD));
    out[at] = OLD_MINING_STATE;
    ov.setUint32(at + 1 + STATE_HEAD, n, true);
    let lossy = !allZero(d, at + 1 + STATE_HEAD, at + fixed - 4);
    for (let i = 0; i < n; i++) {
      const p = at + fixed + RES_NEW * i;
      ov.setUint16(at + 1 + STATE_HEAD + 4 + RES_OLD * i, dv.getUint16(p, true), true);
      if (!allZero(d, p + 2, p + RES_NEW)) lossy = true;
    }
    // the proof that this really was the state, at this place: the bindings read the rewritten account to its last
    // byte as a mining fleet (a fleet they could already read cannot pass: its state would start somewhere else)
    fleetDec ??= getFleetDecoder();
    const back = decodes(fleetDec, out);
    if (!back || back[1] !== out.length || back[0].state?.__kind !== 'MineAsteroid') continue;
    return { data: out, lossy };
  }
  return null;
}
// A claim stake with the trailing block -> { data, lossy } without it; null when it has none.
export function translateStake(d) {
  const at = d.length - STAKE_BLOCK;
  if (!startsWith(d, CLAIM_STAKE_INSTANCE_DISCRIMINATOR) || !startsWith(d, STAKE_MARK, at)) return null;
  stakeDec ??= getClaimStakeInstanceDecoder();
  const read = decodes(stakeDec, d);
  if (!read || read[1] !== at) return null; // the known layout must end exactly where the block starts
  return { data: d.subarray(0, at), lossy: d[at + STAKE_MARK.length] !== 1 };
}

// What one pass translated: Sets of account addresses.
export const newCompat = () => ({ fleets: new Set(), stakes: new Set(), lossy: new Set() });

// The first 10 base64 characters of an account are fixed by its discriminator: every other account (the 3.5 MB game
// account, thousands of bodies) is handed on without being decoded.
const b64Head = (disc) => Buffer.from(disc).toString('base64').slice(0, 10);
const FLEET_HEAD = b64Head(FLEET_DISCRIMINATOR), STAKE_HEAD = b64Head(CLAIM_STAKE_INSTANCE_DISCRIMINATOR);

function translateAccount(acc, address, seen) {
  if (!acc || typeof acc !== 'object' || !Array.isArray(acc.data) || acc.data[1] !== 'base64' || typeof acc.data[0] !== 'string') return acc;
  const head = acc.data[0].slice(0, 10);
  if (head !== FLEET_HEAD && head !== STAKE_HEAD) return acc;
  let d; try { d = Buffer.from(acc.data[0], 'base64'); } catch { return acc; }
  const fleet = translateFleet(d), got = fleet || translateStake(d);
  if (!got) return acc;
  if (typeof address === 'string') { (fleet ? seen.fleets : seen.stakes).add(address); if (got.lossy) seen.lossy.add(address); }
  const out = { ...acc, data: [Buffer.from(got.data).toString('base64'), 'base64'] };
  // the size field follows the data (the transport hands whole numbers over as bigint)
  if (typeof acc.space === 'bigint') out.space = BigInt(got.data.length); else if (typeof acc.space === 'number') out.space = got.data.length;
  return out;
}
// Wraps an RPC transport: every whole account in a getProgramAccounts, getMultipleAccounts or getAccountInfo answer
// goes through the translation. A read of a slice of an account (dataSlice) and every other method pass untouched.
export function compatTransport(inner, seen = newCompat()) {
  return async (req) => {
    const v = await inner(req); // inner runs in the caller's tick (see shareTransport in collector.mjs)
    const pl = req?.payload, m = pl?.method, p = Array.isArray(pl?.params) ? pl.params : [];
    if (!v || typeof v !== 'object' || 'error' in v || !('result' in v) || (p[1] && typeof p[1] === 'object' && p[1].dataSlice)) return v;
    const r = v.result;
    if (m === 'getProgramAccounts') {
      const list = Array.isArray(r) ? r : r && Array.isArray(r.value) ? r.value : null;
      if (!list) return v;
      const fixed = list.map((a) => { const t = a && translateAccount(a.account, a.pubkey, seen); return a && t !== a.account ? { ...a, account: t } : a; });
      return { ...v, result: Array.isArray(r) ? fixed : { ...r, value: fixed } };
    }
    if (m === 'getMultipleAccounts' && r && Array.isArray(r.value)) {
      const keys = Array.isArray(p[0]) ? p[0] : [];
      return { ...v, result: { ...r, value: r.value.map((a, i) => translateAccount(a, keys[i], seen)) } };
    }
    if (m === 'getAccountInfo' && r && r.value) return { ...v, result: { ...r, value: translateAccount(r.value, p[0], seen) } };
    return v;
  };
}
