// Bundles the browser collector into C4Live/c4-collect.js and refreshes C4Live/prices.json. Run before a release:
//   node C4Live/collect-src/build.mjs
// esbuild comes from the teardown skill's locked install, as for scene-src/build.mjs. The chain libraries come from
// Tools/c4-live (npm ci --ignore-scripts). The output is committed: the site is static and has no build step.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.join(HERE, '..');
const DEPS = path.join(os.homedir(), '.claude', 'skills', 'teardown', 'node_modules');
const esbuild = createRequire(path.join(DEPS, 'x.js'))('esbuild');
const shim = name => path.join(HERE, name);
const outfile = path.join(SITE, 'c4-collect.js');

await esbuild.build({
  entryPoints: [path.join(HERE, 'main.js')],
  bundle: true, minify: true, format: 'iife', target: 'es2022', platform: 'browser', legalComments: 'none', outfile,
  alias: {'node:fs': shim('fs-shim.js'), 'node:path': shim('path-shim.js'), 'node:url': shim('path-shim.js')},
  inject: [shim('buffer-shim.js')],
  define: {
    'process.env.C4_OUT_DIR': '"/c4"',
    'process.env.NODE_ENV': '"production"',
    'process.env': '{}',
    'process.argv': '[]',
    'process.pid': '1',
    'import.meta.url': '"file:///c4/collector.mjs"',
  },
  banner: {js: '/* C4 Live browser collector. Source: C4Live/collect-src and Tools/c4-live/collector.mjs. Includes @aephia/atlas-kit and @solana/kit (Apache-2.0 / MIT, see Tools/c4-live/package-lock.json). */'},
});
const bytes = fs.statSync(outfile).size;
if (bytes < 50000 || !fs.readFileSync(outfile, 'utf8').includes('C4Collect')) { console.error('bundle looks wrong', bytes); process.exit(1); }
console.log(`c4-collect.js ${(bytes / 1024).toFixed(0)} KB`);

// The site's reference prices: only ever replaced by a valid, non-empty book.
const from = path.join(SITE, '..', 'Data', 'c4-live', 'prices.json');
const to = path.join(SITE, 'prices.json');
let book = null;
try { book = JSON.parse(fs.readFileSync(from, 'utf8')); } catch { /* no local prices */ }
if (book && Array.isArray(book.items) && book.items.length && book.fetchedAt) {
  fs.writeFileSync(`${to}.tmp`, JSON.stringify(book));
  fs.renameSync(`${to}.tmp`, to);
  console.log(`prices.json ${book.items.length} items from ${new Date(book.fetchedAt * 1000).toISOString()}`);
} else {
  console.log(fs.existsSync(to) ? 'prices.json kept: no valid local price book' : 'WARNING: no prices.json, the wealth view will be empty');
}
