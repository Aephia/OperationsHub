// Packs a glTF with ONE embedded data-URI buffer into a binary .glb (the teardown build inlines .glb as base64).
//   node tools/configbay-proto/gltf2glb.mjs <in.gltf> <out.glb>
import fs from 'node:fs';

const [, , src, dst] = process.argv;
if (!src || !dst) { console.error('usage: gltf2glb <in.gltf> <out.glb>'); process.exit(2); }
const g = JSON.parse(fs.readFileSync(src, 'utf8'));
if (!g.buffers || g.buffers.length !== 1) { console.error('expected exactly one buffer'); process.exit(1); }
const uri = g.buffers[0].uri || '';
const m = uri.match(/^data:[^;]+;base64,(.*)$/);
if (!m) { console.error('buffer is not an embedded data URI'); process.exit(1); }
const bin = Buffer.from(m[1], 'base64');
if (bin.length !== g.buffers[0].byteLength) { console.error(`buffer size ${bin.length} != byteLength ${g.buffers[0].byteLength}`); process.exit(1); }
g.buffers[0] = {byteLength: bin.length};
const pad = (b, fill) => (b.length % 4 ? Buffer.concat([b, Buffer.alloc(4 - (b.length % 4), fill)]) : b);
const json = pad(Buffer.from(JSON.stringify(g)), 0x20);
const body = pad(bin, 0);
const total = 12 + 8 + json.length + 8 + body.length;
const head = Buffer.alloc(12);
head.writeUInt32LE(0x46546c67, 0); head.writeUInt32LE(2, 4); head.writeUInt32LE(total, 8);
const jh = Buffer.alloc(8); jh.writeUInt32LE(json.length, 0); jh.writeUInt32LE(0x4e4f534a, 4);
const bh = Buffer.alloc(8); bh.writeUInt32LE(body.length, 0); bh.writeUInt32LE(0x004e4942, 4);
const tmp = dst + '.tmp';
fs.writeFileSync(tmp, Buffer.concat([head, jh, json, bh, body]));
fs.renameSync(tmp, dst);
console.log(`${dst} ${total} bytes (json ${json.length}, bin ${body.length})`);
