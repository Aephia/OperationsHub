#!/usr/bin/env node
/**
 * Rebuild the legacy SAGE system / region codes that the 2026-09-11 uber-export dropped.
 *
 * Up to the May 2026 export every star system was named by a code such as
 * `004-MUD-KING-01` (region number, faction, role, index) and every planet
 * `<system code>-P<n>`. The 2026-09-11 export replaced all of these with lore
 * names ("Verzan", "Romaria"). System keys and region ids are stable across the
 * two exports, so the codes can be recovered from the last code-named snapshot
 * and re-attached at load time (Planet Explorer shows both).
 *
 * Usage:
 *   node RefreshData/legacy-system-codes.js [<code-named planets.json>]
 *
 * With no argument the snapshot is read from git (the commit before the
 * 2026-09-11 import). Writes JSON/system-codes.json and Data/system-codes-data.js.
 * The output is a frozen reference: re-run only if the code-named source changes.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const SNAPSHOT_COMMIT = '27137dd^'; // parent of "Data refresh: import SAGE uber-export 2026-09-11"
const CODE_RE = /^([A-Z0-9]{3})-(MUD|ONI|UST)-([A-Z]+)-(\d+)$/;

function loadSnapshot(arg) {
    if (arg) return JSON.parse(fs.readFileSync(arg, 'utf8'));
    const raw = execFileSync('git', ['show', `${SNAPSHOT_COMMIT}:JSON/planets.json`], {
        cwd: ROOT_DIR, maxBuffer: 256 * 1024 * 1024
    });
    return JSON.parse(raw.toString('utf8'));
}

const snapshot = loadSnapshot(process.argv[2]);
const current = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'JSON', 'planets.json'), 'utf8'));

const systems = {};
let unmatched = 0;
for (const system of snapshot.mapData) {
    if (!CODE_RE.test(system.name)) { unmatched++; continue; }
    systems[system.key] = system.name;
}
const regions = {};
for (const region of snapshot.regionDefinitions || []) {
    regions[region.id] = region.name; // e.g. R-MUD-004
}

// Coverage against the CURRENT data: every current system/region must have a code.
const currentKeys = current.mapData.map(s => s.key);
const missingSystems = currentKeys.filter(k => !systems[k]);
const missingRegions = (current.regionDefinitions || []).map(r => r.id).filter(id => !regions[id]);
if (unmatched) console.warn(`warning: ${unmatched} snapshot systems did not match the code pattern`);
if (missingSystems.length || missingRegions.length) {
    console.error(`ERROR: ${missingSystems.length} current systems and ${missingRegions.length} regions have no legacy code - refusing to write`);
    process.exit(1);
}

const out = {
    title: 'Legacy SAGE system and region codes (pre 2026-09-11 export)',
    source: process.argv[2] || `git ${SNAPSHOT_COMMIT}:JSON/planets.json`,
    generated: new Date().toISOString(),
    note: 'Planet codes are <system code>-P<n> where n is the 1-based planet index; planet order is identical in both exports.',
    systems,
    regions
};

const jsonPath = path.join(ROOT_DIR, 'JSON', 'system-codes.json');
const jsPath = path.join(ROOT_DIR, 'Data', 'system-codes-data.js');
fs.writeFileSync(jsonPath, JSON.stringify(out, null, 2), 'utf8');
fs.writeFileSync(jsPath,
    `// Auto-generated from JSON/system-codes.json by RefreshData/legacy-system-codes.js\n` +
    `// Last updated: ${out.generated}\n\n` +
    `const systemCodesData = ${JSON.stringify(out, null, 2)};\n\n` +
    `if (typeof window !== 'undefined') window.systemCodesData = systemCodesData;\n` +
    `if (typeof module !== 'undefined' && module.exports) module.exports = systemCodesData;\n`,
    'utf8');
console.log(`wrote ${path.relative(ROOT_DIR, jsonPath)} (${Object.keys(systems).length} systems, ${Object.keys(regions).length} regions)`);
console.log(`wrote ${path.relative(ROOT_DIR, jsPath)}`);
