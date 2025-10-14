#!/usr/bin/env node

/**
 * Data Refresh Script
 *
 * Converts source JSON assets into JavaScript/JSON data files
 * consumed by the Explorer applications.
 *
 * Processes:
 * - JSON/recipes.json        -> Data/recipes-data.js
 * - JSON/buildings.json      -> Data/buildings-data.js
 * - JSON/planets.json        -> Data/planet-data.js
 * - JSON/resources.json      -> Data/resources-data.js
 * - JSON/Ships/*.json        -> Data/ships-data.{js,json}
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const JSON_DIR = path.join(ROOT_DIR, 'JSON');
const DATA_DIR = path.join(ROOT_DIR, 'Data');

const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'CAPITAL', 'TITAN', 'SUPERCAPITAL'];

const DATA_TASKS = [
    { type: 'json', source: 'recipes.json', outputJs: 'recipes-data.js', globalVar: 'rawRecipeData' },
    { type: 'json', source: 'buildings.json', outputJs: 'buildings-data.js', globalVar: 'rawBuildingData' },
    { type: 'json', source: 'planets.json', outputJs: 'planet-data.js', globalVar: 'planetData' },
    { type: 'json', source: 'resources.json', outputJs: 'resources-data.js', globalVar: 'resourcesData' },
    { type: 'ships', source: 'Ships', outputJs: 'ships-data.js', outputJson: 'ships-data.json', globalVar: 'rawShipData' }
];

function toCamelCase(input) {
    if (!input) return input;
    return input
        .replace(/\r/g, '')
        .split(/[_\s]+/)
        .filter(Boolean)
        .map((segment, index) => {
            if (index === 0) {
                return segment.charAt(0).toLowerCase() + segment.slice(1);
            }
            return segment.charAt(0).toUpperCase() + segment.slice(1);
        })
        .join('');
}

function mapStats(source, keys) {
    const result = {};
    keys.forEach((key) => {
        const cleanKey = key.replace(/\r/g, '');
        const value = source[cleanKey];
        if (value !== undefined && value !== null && value !== '') {
            result[toCamelCase(cleanKey)] = value;
        }
    });
    return result;
}

function buildDamageTypes(source) {
    const result = {};
    Object.keys(source).forEach((key) => {
        const cleanKey = key.replace(/\r/g, '');
        if (
            cleanKey.startsWith('damage_') &&
            cleanKey !== 'damage_range' &&
            cleanKey !== 'damage_bomb'
        ) {
            const value = source[key];
            if (value !== undefined && value !== null && value !== '') {
                const statKey = cleanKey.replace('damage_', '');
                result[toCamelCase(statKey)] = value;
            }
        }
    });
    return result;
}

function buildCounters(source) {
    const result = {};
    Object.keys(source).forEach((key) => {
        const cleanKey = key.replace(/\r/g, '');
        if (cleanKey.startsWith('counter_')) {
            const value = source[key];
            if (value !== undefined && value !== null && value !== '') {
                const statKey = cleanKey.replace('counter_', '');
                result[toCamelCase(statKey)] = value;
            }
        }
    });
    return result;
}

function createShipMetadataTracker() {
    return {
        manufacturers: new Set(),
        specs: new Set(),
        classes: new Set(),
        sizeTiers: new Set(),
        componentCategories: new Set(),
        componentSlots: new Set(),
        configNames: new Set(),
        weaponTypes: new Set(),
        moduleTypes: new Set()
    };
}

function transformConfiguration(config, metadata) {
    const summary = {
        totalSlots: 0,
        totalFilled: 0,
        byCategory: {}
    };

    const normalizedComponents = {};

    if (!config || typeof config !== 'object') {
        return {
            name: 'Unnamed',
            locked: false,
            components: normalizedComponents,
            summary
        };
    }

    if (config.name) {
        metadata.configNames.add(config.name);
    }

    const components = config.components || {};

    Object.entries(components).forEach(([category, slots]) => {
        metadata.componentCategories.add(category);

        const categorySlots = {};
        let categorySlotCount = 0;
        let categoryFilledCount = 0;

        if (slots && typeof slots === 'object') {
            Object.entries(slots).forEach(([slotName, values]) => {
                const arrayValues = Array.isArray(values)
                    ? values
                    : values === undefined || values === null
                        ? []
                        : [values];

                const totalSlots = arrayValues.length;
                const items = arrayValues.filter((value) => value !== null && value !== '' && value !== undefined);

                categorySlots[slotName] = {
                    items,
                    totalSlots
                };

                categorySlotCount += totalSlots;
                categoryFilledCount += items.length;
                summary.totalSlots += totalSlots;
                summary.totalFilled += items.length;

                if (slotName) {
                    metadata.componentSlots.add(`${category}::${slotName}`);
                }
                if (category === 'Ship Weapons' && slotName) {
                    metadata.weaponTypes.add(slotName);
                }
                if (category === 'Ship Module' && slotName) {
                    metadata.moduleTypes.add(slotName);
                }
            });
        }

        normalizedComponents[category] = categorySlots;
        summary.byCategory[category] = {
            slots: categorySlotCount,
            filled: categoryFilledCount
        };
    });

    return {
        name: config.name || 'Unnamed',
        locked: Boolean(config.locked),
        components: normalizedComponents,
        summary
    };
}

function transformShipFile(filePath, metadata) {
    const rawContent = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(rawContent);
    const shipStats = parsed.ship || {};

    const fileName = path.basename(filePath);
    const baseName = path.basename(filePath, '.json');
    const nameParts = baseName.split('_');
    const sizeTier = nameParts.length > 1 ? nameParts[1] : null;

    const name = shipStats['Ship Name'] || shipStats.name || parsed.shipIdentifier || baseName;
    const manufacturer = shipStats.Manufacturer || null;
    const spec = shipStats.Spec || null;
    const classTier = typeof shipStats.Class === 'number'
        ? shipStats.Class
        : Number(shipStats.Class) || null;
    const shipSize = shipStats.ship_size ?? null;

    if (manufacturer) metadata.manufacturers.add(manufacturer);
    if (spec) metadata.specs.add(spec);
    if (classTier !== null && !Number.isNaN(classTier)) metadata.classes.add(classTier);
    if (sizeTier) metadata.sizeTiers.add(sizeTier);

    const configurations = Array.isArray(parsed.configurations)
        ? parsed.configurations.map((cfg) => transformConfiguration(cfg, metadata))
        : [];

    return {
        id: parsed.shipIdentifier || baseName,
        sourceFile: fileName,
        version: parsed.version || null,
        timestamp: parsed.timestamp || null,
        name,
        manufacturer,
        spec,
        class: classTier,
        sizeTier,
        shipSize,
        crew: {
            required: shipStats.required_crew ?? null,
            passengers: shipStats.passenger_capacity ?? null
        },
        respawnTime: shipStats.respawnTime ?? null,
        stats: {
            capacities: mapStats(shipStats, ['cargo_capacity', 'fuel_capacity', 'ammo_capacity']),
            mining: mapStats(shipStats, ['asteroid_mining_rate', 'asteroid_mining_food_rate', 'asteroid_mining_ammo_rate']),
            travel: mapStats(shipStats, [
                'subwarp_speed',
                'warp_speed',
                'max_warp_distance',
                'warp_cool_down',
                'warp_fuel_consumption',
                'subwarp_fuel_consumption',
                'planet_exit_fuel',
                'warp_lane_speed',
                'warp_lane_fee',
                'warp_spool_time',
                'loading_rate'
            ]),
            scanning: mapStats(shipStats, ['scan_power', 'scan_cool_down', 'sduPerScan', 'scan_cost']),
            combat: {
                ...mapStats(shipStats, [
                    'damage',
                    'damage_range',
                    'max_ap',
                    'ap_recharge_time',
                    'hit_points',
                    'shield_points',
                    'shield_recharge_rate',
                    'shield_break_delay',
                    'stealth_power',
                    'missile_power',
                    'missile_capacity',
                    'hit_chance',
                    'hit_points_range',
                    'shield_points_range',
                    'stealth_power_range',
                    'missile_power_range',
                    'crit_chance',
                    'crit_multiplier',
                    'aim_ability',
                    'damage_bomb'
                ])
            },
            damageTypes: buildDamageTypes(shipStats),
            defense: {
                counters: buildCounters(shipStats)
            },
            repair: mapStats(shipStats, ['repair_cost', 'repair_rate', 'repair_ability', 'repair_efficiency', 'repair_cooldown']),
            economics: {
                ...mapStats(shipStats, ['loot_rate', 'ship_size_value']),
                lpValue: shipStats['lp_value\r'] ?? shipStats.lp_value ?? null
            }
        },
        configurations,
        configurationCount: configurations.length,
        activeConfigIndex: parsed.activeConfigIndex ?? 0
    };
}

function convertJsonToJs(jsonPath, jsPath, globalVarName) {
    try {
        const jsonData = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(jsonData);

        const jsContent = `// Auto-generated from ${path.relative(ROOT_DIR, jsonPath).replace(/\\\\/g, '/')}
// Last updated: ${new Date().toISOString()}
// This file is automatically generated by refresh-data.js

const ${globalVarName} = ${JSON.stringify(data, null, 2)};

if (typeof window !== 'undefined') {
    window.${globalVarName} = ${globalVarName};
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ${globalVarName};
}
`;

        fs.writeFileSync(jsPath, jsContent, 'utf8');

        const stats = fs.statSync(jsonPath);
        const fileSizeKB = (stats.size / 1024).toFixed(1);

        console.log(`Processed ${path.basename(jsonPath)} -> ${path.basename(jsPath)} (${fileSizeKB} KB source)`);
        return true;
    } catch (error) {
        console.error(`Error processing ${jsonPath}: ${error.message}`);
        return false;
    }
}

function sortSizeTiers(tiers) {
    return Array.from(tiers).sort((a, b) => {
        const indexA = SIZE_ORDER.indexOf(a);
        const indexB = SIZE_ORDER.indexOf(b);
        if (indexA === -1 && indexB === -1) {
            return a.localeCompare(b);
        }
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
}

function processShipDirectory(shipDir, dataDir, globalVarName, outputJs, outputJson) {
    try {
        if (!fs.existsSync(shipDir)) {
            console.warn(`Ship directory not found: ${shipDir}`);
            return false;
        }

        const files = fs.readdirSync(shipDir)
            .filter((file) => file.endsWith('.json'))
            .sort((a, b) => a.localeCompare(b));

        if (files.length === 0) {
            console.warn(`No ship JSON files found in ${shipDir}`);
            return false;
        }

        const metadataTracker = createShipMetadataTracker();
        const ships = files.map((file) =>
            transformShipFile(path.join(shipDir, file), metadataTracker)
        );

        const metadata = {
            manufacturers: Array.from(metadataTracker.manufacturers).sort((a, b) => a.localeCompare(b)),
            specs: Array.from(metadataTracker.specs).sort((a, b) => a.localeCompare(b)),
            classes: Array.from(metadataTracker.classes).sort((a, b) => a - b),
            sizeTiers: sortSizeTiers(metadataTracker.sizeTiers),
            componentCategories: Array.from(metadataTracker.componentCategories).sort((a, b) => a.localeCompare(b)),
            componentSlots: Array.from(metadataTracker.componentSlots)
                .map((entry) => {
                    const [category, slot] = entry.split('::');
                    return { category, slot };
                })
                .sort((a, b) => {
                    if (a.category === b.category) {
                        return a.slot.localeCompare(b.slot);
                    }
                    return a.category.localeCompare(b.category);
                }),
            configurationNames: Array.from(metadataTracker.configNames).sort((a, b) => a.localeCompare(b)),
            weaponTypes: Array.from(metadataTracker.weaponTypes).sort((a, b) => a.localeCompare(b)),
            moduleTypes: Array.from(metadataTracker.moduleTypes).sort((a, b) => a.localeCompare(b))
        };

        const aggregated = {
            lastUpdated: new Date().toISOString(),
            shipCount: ships.length,
            ships,
            metadata
        };

        if (outputJson) {
            const jsonPath = path.join(dataDir, outputJson);
            fs.writeFileSync(jsonPath, JSON.stringify(aggregated, null, 2), 'utf8');
        }

        if (outputJs) {
            const jsPath = path.join(dataDir, outputJs);
            const jsContent = `// Auto-generated from ${path.relative(ROOT_DIR, shipDir).replace(/\\\\/g, '/')}
// Last updated: ${new Date().toISOString()}
// This file is automatically generated by refresh-data.js

const ${globalVarName} = ${JSON.stringify(aggregated, null, 2)};

if (typeof window !== 'undefined') {
    window.${globalVarName} = ${globalVarName};
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ${globalVarName};
}
`;
            fs.writeFileSync(jsPath, jsContent, 'utf8');
        }

        const jsStats = outputJs ? fs.statSync(path.join(dataDir, outputJs)) : null;
        const jsonStats = outputJson ? fs.statSync(path.join(dataDir, outputJson)) : null;
        const sizeReport = [
            jsStats ? `JS ${(jsStats.size / 1024).toFixed(1)} KB` : null,
            jsonStats ? `JSON ${(jsonStats.size / 1024).toFixed(1)} KB` : null
        ].filter(Boolean).join(', ');

        console.log(`Processed ${files.length} ship files -> ${outputJs || ''} ${sizeReport ? `(${sizeReport})` : ''}`.trim());
        return true;
    } catch (error) {
        console.error(`Error processing ship directory ${shipDir}: ${error.message}`);
        return false;
    }
}

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
}

function processTask(task) {
    if (task.type === 'json') {
        const jsonPath = path.join(JSON_DIR, task.source);
        const jsPath = path.join(DATA_DIR, task.outputJs);

        if (!fs.existsSync(jsonPath)) {
            console.warn(`JSON file not found: ${jsonPath}`);
            return false;
        }

        return convertJsonToJs(jsonPath, jsPath, task.globalVar);
    }

    if (task.type === 'ships') {
        const shipDir = path.join(JSON_DIR, task.source);
        return processShipDirectory(shipDir, DATA_DIR, task.globalVar, task.outputJs, task.outputJson);
    }

    console.warn(`Unknown task type: ${task.type}`);
    return false;
}

function main() {
    console.log('=== Starting Data Refresh Process ===\n');

    ensureDir(DATA_DIR);

    if (!fs.existsSync(JSON_DIR)) {
        console.error(`JSON directory not found: ${JSON_DIR}`);
        process.exit(1);
    }

    let successCount = 0;

    DATA_TASKS.forEach((task) => {
        const result = processTask(task);
        if (result) {
            successCount += 1;
        }
    });

    console.log('\n=== Refresh Summary ===');
    console.log(`Successful: ${successCount}/${DATA_TASKS.length}`);
    console.log(`Data directory: ${DATA_DIR}`);

    if (successCount === DATA_TASKS.length) {
        console.log('\nAll data files refreshed successfully.');
        console.log('Include the generated files from the Data/ directory in your applications.');
    } else {
        console.log(`\n${DATA_TASKS.length - successCount} task(s) failed.`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    convertJsonToJs,
    processShipDirectory,
    main
};
