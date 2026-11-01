// Bundles teardown-src/main.js (three.js included) into ShipExplorer/teardown/ship-teardown.js, and fit-entry.js into ship-fit.js.
//   node ShipExplorer/teardown-src/build.mjs
// esbuild and three come from the teardown skill's locked install (~/.claude/skills/teardown, npm ci), so this repo gains no
// node dependency. The output is committed: the site is static and has no build step.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEPS = path.join(os.homedir(), '.claude', 'skills', 'teardown', 'node_modules');
const require = createRequire(path.join(DEPS, 'x.js'));
const esbuild = require('esbuild');
const outfile = path.join(HERE, '..', 'teardown', 'ship-teardown.js');
fs.mkdirSync(path.dirname(outfile), {recursive: true});
const r = await esbuild.build({
  entryPoints: [path.join(HERE, 'main.js')],
  bundle: true, minify: true, format: 'iife', target: 'es2020', legalComments: 'none', metafile: true,
  nodePaths: [DEPS], outfile,
  banner: {js: '/* Ship Explorer teardown. Source: ShipExplorer/teardown-src. Includes three.js (MIT, (c) three.js authors). */'},
});
const bytes = fs.statSync(outfile).size;
const inputs = Object.keys(r.metafile.inputs).length;
if (bytes < 100000 || !inputs) { console.error('bundle looks empty', bytes, inputs); process.exit(1); }
const fitFile = path.join(HERE, '..', 'teardown', 'ship-fit.js');
await esbuild.build({entryPoints: [path.join(HERE, 'fit-entry.js')], bundle: true, minify: true, format: 'iife', target: 'es2020', legalComments: 'none', outfile: fitFile});
if (fs.statSync(fitFile).size < 1000) { console.error('fit bundle looks empty'); process.exit(1); }
console.log(`ship-teardown.js ${(bytes / 1024).toFixed(0)} KB from ${inputs} modules; ship-fit.js ${(fs.statSync(fitFile).size / 1024).toFixed(1)} KB`);
