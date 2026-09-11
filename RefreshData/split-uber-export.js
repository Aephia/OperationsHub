#!/usr/bin/env node

/**
 * Split a SAGE "uber-export" JSON into the per-dataset source files under JSON/
 * that refresh-data.js consumes.
 *
 *   node RefreshData/split-uber-export.js <uber-export.json> [--out <dir>]
 *
 * The mapping below was recovered from the 2026-05-23 import (commit ea4d5d6) by
 * regenerating that commit's JSON/ from its uber-export and diffing: every file
 * matches except ship-components-part1.json, whose rewardTree was hand-rebuilt in
 * a9b4cb0 because the May export's tree was incomplete (missed 899 of the 1,573
 * component ids the ship configurations reference). Exports since then ship a
 * complete tree (node count == allComponents, every referenced id present), so
 * the export's own tree is used as-is. Re-check that coverage after any import:
 *
 *   node RefreshData/split-uber-export.js <export> --check
 *
 * Only datasets the explorers consume are written. The export also carries
 * sections nothing here reads yet (missions, researchGateMap, cargoTypes, ...);
 * they are listed at the end of the run so a new consumer knows they exist.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const exportPath = args.find((a) => !a.startsWith('--'));
const outIdx = args.indexOf('--out');
const OUT_DIR = outIdx !== -1 ? path.resolve(args[outIdx + 1]) : path.join(ROOT_DIR, 'JSON');
const CHECK_ONLY = args.includes('--check');

if (!exportPath) {
    console.error('usage: node RefreshData/split-uber-export.js <uber-export.json> [--out <dir>] [--check]');
    process.exit(2);
}

const uber = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
const sc = uber.shipConfigurations;
const comps = sc.components;

function pick(obj, keys, label) {
    const out = {};
    for (const k of keys) {
        if (!(k in obj)) throw new Error(`${label}: export is missing "${k}"`);
        out[k] = obj[k];
    }
    return out;
}

// --- coverage check: every component id a ship configuration references must be in the tree
function treeIds(tree, acc = new Set()) {
    for (const n of tree) {
        acc.add(n.id);
        if (Array.isArray(n.children)) treeIds(n.children, acc);
    }
    return acc;
}
function referencedIds(shipStats) {
    const ids = new Set();
    for (const ship of Object.values(shipStats)) {
        for (const cfg of ship.configurations || []) {
            for (const slots of Object.values(cfg.components || {})) {
                for (const vals of Object.values(slots || {})) {
                    for (const v of Array.isArray(vals) ? vals : [vals]) {
                        if (v !== null && v !== '' && v !== undefined) ids.add(Number(v));
                    }
                }
            }
        }
    }
    return ids;
}
const ids = treeIds(comps.rewardTree);
const refs = referencedIds(uber.shipStats);
const missing = [...refs].filter((id) => !ids.has(id));
console.log(`rewardTree: ${comps.rewardTree.length} roots, ${ids.size} nodes; allComponents: ${comps.allComponents.length}`);
console.log(`ship configurations reference ${refs.size} component ids; missing from tree: ${missing.length}`);
if (missing.length) {
    console.error(`❌ incomplete component tree (first missing ids: ${missing.slice(0, 10).join(', ')}) - do not import`);
    if (!args.includes('--force')) process.exit(1);
    console.warn('--force given: writing anyway');
}
if (CHECK_ONLY) process.exit(0);

// --- the split
const files = {
    'planets.json': pick(uber.mapData, ['mapData', 'regionDefinitions', 'title'], 'mapData'),
    'recipes.json': pick(uber.recipes, ['recipes'], 'recipes'),
    'resources.json': pick(uber.resources, ['resources', 'categories'], 'resources'),
    'buildings.json': pick(uber.claimStakeBuildings, ['buildings', 'claimStakeDefinitions'], 'claimStakeBuildings'),
    'craftingHabBuildings.json': pick(uber.craftingHabs, ['habs', 'craftingStations', 'cargoStorage'], 'craftingHabs'),
    'ship-formulas.json': pick(sc, ['version', 'timestamp', 'componentAttributes', 'classScalingFormulas', 'tierScalingFormulas'], 'shipConfigurations')
};

// ship-components: manifest + allComponents split in two halves (part1 also carries the tree)
const half = Math.ceil(comps.allComponents.length / 2);
files['ship-components.json'] = {
    version: sc.version,
    timestamp: sc.timestamp,
    parts: ['ship-components-part1.json', 'ship-components-part2.json'],
    components: { nextId: comps.nextId }
};
files['ship-components-part1.json'] = { components: { allComponents: comps.allComponents.slice(0, half), rewardTree: comps.rewardTree } };
files['ship-components-part2.json'] = { components: { allComponents: comps.allComponents.slice(half) } };

fs.mkdirSync(path.join(OUT_DIR, 'Ships'), { recursive: true });
for (const [name, data] of Object.entries(files)) {
    fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(data, null, 2), 'utf8');
    const n = Object.values(data).find(Array.isArray);
    console.log(`wrote ${name}${n ? ` (${n.length} entries)` : ''}`);
}

// one file per ship, named by the export's ship key
const shipKeys = Object.keys(uber.shipStats);
for (const key of shipKeys) {
    fs.writeFileSync(path.join(OUT_DIR, 'Ships', `${key}.json`), JSON.stringify(uber.shipStats[key], null, 2), 'utf8');
}
console.log(`wrote Ships/ (${shipKeys.length} ships)`);
const orphans = fs.readdirSync(path.join(OUT_DIR, 'Ships')).filter((f) => f.endsWith('.json') && !shipKeys.includes(f.replace(/\.json$/, '')));
if (orphans.length) console.warn(`⚠️  Ships/ has ${orphans.length} file(s) not in this export (stale?): ${orphans.join(', ')}`);

const consumed = new Set(['meta', 'mapData', 'shipConfigurations', 'shipStats', 'recipes', 'resources', 'claimStakeBuildings', 'craftingHabs']);
const unused = Object.keys(uber).filter((k) => !consumed.has(k));
console.log(`export ${uber.meta && uber.meta.exportDate} - sections not consumed by any explorer: ${unused.join(', ')}`);
console.log('\nNext: npm run refresh');
