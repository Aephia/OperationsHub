// Bundles C4Live/scene-src/main.js (three.js included) into C4Live/c4-scene.js, a classic script that sets window.C4Scene.
//   node C4Live/scene-src/build.mjs
// esbuild and three (0.186.1) come from the teardown skill's locked install (~/.claude/skills/teardown, npm ci), so this
// repo gains no node dependency. The output is committed: the site is static and has no build step.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEPS = path.join(os.homedir(), '.claude', 'skills', 'teardown', 'node_modules');
const require = createRequire(path.join(DEPS, 'x.js'));
const esbuild = require('esbuild');
const threeVersion = JSON.parse(fs.readFileSync(path.join(DEPS, 'three', 'package.json'), 'utf8')).version;
const outfile = path.join(HERE, '..', 'c4-scene.js');
const r = await esbuild.build({
  entryPoints: [path.join(HERE, 'main.js')],
  bundle: true, minify: true, format: 'iife', target: 'es2020', legalComments: 'none', metafile: true,
  nodePaths: [DEPS], outfile,
  banner: {js: `/* C4 Live galaxy scene. Source: C4Live/scene-src (node C4Live/scene-src/build.mjs). Includes three.js ${threeVersion} (MIT License, Copyright 2010-2026 three.js authors, https://github.com/mrdoob/three.js). */`},
});
const bytes = fs.statSync(outfile).size;
const inputs = Object.keys(r.metafile.inputs).length;
if (bytes < 100000 || !inputs) { console.error('bundle looks empty', bytes, inputs); process.exit(1); }
const src = fs.readFileSync(outfile, 'utf8');
if (!src.includes('window.C4Scene') && !/C4Scene=/.test(src)) { console.error('bundle does not set window.C4Scene'); process.exit(1); }
console.log(`c4-scene.js ${(bytes / 1024).toFixed(0)} KB (${bytes} bytes) from ${inputs} modules, three ${threeVersion}`);
