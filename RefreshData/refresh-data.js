#!/usr/bin/env node

/**
 * Enhanced Data Refresh Script v2.0
 *
 * Converts source JSON assets into JavaScript/JSON data files
 * consumed by the Explorer applications.
 *
 * NEW FEATURES:
 * - JSON Schema validation with Ajv
 * - Change detection and breaking change alerts
 * - Multi-part file processing (ship-components)
 * - Comprehensive validation reports
 * - Processes ALL 11 JSON files (was 5, now 11)
 */

const fs = require('fs');
const path = require('path');
const SchemaValidator = require('./validation');
const ChangeDetector = require('./change-detection');
const ReportGenerator = require('./reporting');

const ROOT_DIR = path.resolve(__dirname, '..');
const JSON_DIR = path.join(ROOT_DIR, 'JSON');
const DATA_DIR = path.join(ROOT_DIR, 'Data');
const SCHEMAS_DIR = path.join(__dirname, 'schemas');
const CACHE_DIR = path.join(__dirname, '.cache');

const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'CAPITAL', 'TITAN', 'SUPERCAPITAL'];

// Initialize modules
const validator = new SchemaValidator(SCHEMAS_DIR);
const changeDetector = new ChangeDetector(CACHE_DIR);
const reporter = new ReportGenerator(DATA_DIR);

// ENHANCED DATA_TASKS - Now includes ALL 11 JSON files
const DATA_TASKS = [
    // Existing tasks with schema validation
    {
        type: 'json',
        source: 'recipes.json',
        outputJs: 'recipes-data.js',
        globalVar: 'rawRecipeData',
        schema: 'recipes.schema.json'
    },
    {
        type: 'json',
        source: 'buildings.json',
        outputJs: 'buildings-data.js',
        globalVar: 'rawBuildingData',
        schema: 'buildings.schema.json'
    },
    {
        type: 'json',
        source: 'planets.json',
        outputJs: 'planet-data.js',
        globalVar: 'planetData',
        schema: 'planets.schema.json'
    },
    {
        type: 'json',
        source: 'resources.json',
        outputJs: 'resources-data.js',
        globalVar: 'resourcesData',
        schema: 'resources.schema.json'
    },
    {
        type: 'ships',
        source: 'Ships',
        outputJs: 'ships-data.js',
        outputJson: 'ships-data.json',
        globalVar: 'rawShipData',
        schema: 'ships.schema.json'
    },

    // NEW: Previously unprocessed files
    {
        type: 'json',
        source: 'craftingHabBuildings.json',
        outputJs: 'crafting-hab-data.js',
        globalVar: 'craftingHabData',
        schema: 'craftingHabBuildings.schema.json'
    },
    {
        type: 'json',
        source: 'ship-formulas.json',
        outputJs: 'ship-formulas-data.js',
        globalVar: 'shipFormulasData',
        schema: 'shipFormulas.schema.json'
    },
    {
        type: 'ship-components',
        source: 'ship-components.json',
        parts: ['ship-components-part1.json', 'ship-components-part2.json'],
        outputJs: 'ship-components-data.js',
        outputJson: null, // Not used by any app - ShipExplorer fetches raw JSON directly
        globalVar: 'shipComponentsData',
        schema: 'shipComponents.schema.json'
    },
    {
        type: 'json',
        source: 'resource_tier_analysis.json',
        outputJs: 'resource-tier-data.js',
        globalVar: 'resourceTierData',
        schema: 'resourceTierAnalysis.schema.json'
    },
    {
        type: 'json',
        source: 'resource_type_tier_lookup.json',
        outputJs: 'resource-type-tier-data.js',
        globalVar: 'resourceTypeTierData',
        schema: null // Simple lookup, no complex schema needed
    }
];

// ============================================================================
// UTILITY FUNCTIONS (from original)
// ============================================================================

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

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
}

// ============================================================================
// ENHANCED PROCESSORS WITH VALIDATION & CHANGE DETECTION
// ============================================================================

/**
 * Convert JSON to JS with validation and change detection
 */
function convertJsonToJs(jsonPath, jsPath, globalVarName, schemaFile) {
    try {
        const jsonData = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(jsonData);

        // Validate against schema
        let validationWarning = null;
        if (schemaFile) {
            const validation = validator.validate(data, schemaFile);
            if (!validation.valid) {
                console.error(`❌ Schema validation failed: ${path.basename(jsonPath)}`);
                console.error(validator.formatErrors(validation.errors));
                return {
                    success: false,
                    error: 'Schema validation failed',
                    file: path.basename(jsonPath)
                };
            }
            if (validation.warning) {
                validationWarning = validation.warning;
                console.warn(`⚠️  ${validationWarning}`);
            } else {
                console.log(`✅ Schema valid: ${path.basename(jsonPath)}`);
            }
        }

        // Detect changes
        const changeInfo = changeDetector.detectChanges(jsonPath, data);
        if (changeInfo.changed) {
            if (changeInfo.isNew) {
                console.log(`✨ New file: ${path.basename(jsonPath)}`);
            } else if (changeInfo.breaking) {
                console.warn(`⚠️  Breaking changes in ${path.basename(jsonPath)}`);
                changeInfo.diff.breaking.forEach(change => {
                    console.warn(`   - ${change}`);
                });
            } else {
                console.log(`📝 Changes detected in ${path.basename(jsonPath)}`);
            }
        }

        // Generate output
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

        return {
            success: true,
            file: path.basename(jsonPath),
            outputFiles: [path.basename(jsPath)],
            changeInfo,
            validationWarning
        };
    } catch (error) {
        console.error(`Error processing ${jsonPath}: ${error.message}`);
        return {
            success: false,
            error: error.message,
            file: path.basename(jsonPath)
        };
    }
}

/**
 * NEW: Process multi-part ship components files
 */
function processShipComponents(manifestPath, parts, dataDir, globalVarName, outputJs, outputJson, schemaFile) {
    try {
        console.log(`\n📦 Processing multi-part ship components...`);

        // Read manifest
        const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

        // Validate manifest
        if (schemaFile) {
            const validation = validator.validate(manifestData, schemaFile);
            if (!validation.valid && !validation.warning) {
                console.error(`❌ Manifest validation failed`);
                console.error(validator.formatErrors(validation.errors));
            }
        }

        // Load all parts
        const allComponents = [];
        for (const partFile of parts) {
            const partPath = path.join(path.dirname(manifestPath), partFile);
            console.log(`   Loading ${partFile}...`);

            const partData = JSON.parse(fs.readFileSync(partPath, 'utf8'));

            // Validate part
            if (schemaFile) {
                const validation = validator.validate(partData, schemaFile);
                if (!validation.valid && !validation.warning) {
                    console.warn(`⚠️  Part validation warning: ${partFile}`);
                }
            }

            if (partData.components && partData.components.allComponents) {
                allComponents.push(...partData.components.allComponents);
            }
        }

        // Merge data
        const merged = {
            version: manifestData.version,
            timestamp: manifestData.timestamp,
            lastProcessed: new Date().toISOString(),
            componentCount: allComponents.length,
            nextId: manifestData.components.nextId,
            components: allComponents
        };

        console.log(`   Merged ${allComponents.length} components from ${parts.length} parts`);

        // Detect changes
        const changeInfo = changeDetector.detectChanges(manifestPath, merged);

        // Write outputs
        const outputs = [];

        if (outputJson) {
            const jsonPath = path.join(dataDir, outputJson);
            fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2), 'utf8');
            outputs.push(path.basename(jsonPath));
        }

        if (outputJs) {
            const jsPath = path.join(dataDir, outputJs);
            const jsContent = `// Auto-generated from ${path.relative(ROOT_DIR, path.dirname(manifestPath)).replace(/\\\\/g, '/')}
// Parts: ${parts.join(', ')}
// Last updated: ${new Date().toISOString()}
// This file is automatically generated by refresh-data.js

const ${globalVarName} = ${JSON.stringify(merged, null, 2)};

if (typeof window !== 'undefined') {
    window.${globalVarName} = ${globalVarName};
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ${globalVarName};
}
`;
            fs.writeFileSync(jsPath, jsContent, 'utf8');
            outputs.push(path.basename(jsPath));
        }

        const jsStats = outputJs ? fs.statSync(path.join(dataDir, outputJs)) : null;
        const jsonStats = outputJson ? fs.statSync(path.join(dataDir, outputJson)) : null;
        const sizeReport = [
            jsStats ? `JS ${(jsStats.size / 1024).toFixed(1)} KB` : null,
            jsonStats ? `JSON ${(jsonStats.size / 1024).toFixed(1)} KB` : null
        ].filter(Boolean).join(', ');

        console.log(`✅ Processed ship components -> ${outputs.join(', ')} (${sizeReport})`);

        return {
            success: true,
            file: path.basename(manifestPath),
            outputFiles: outputs,
            changeInfo
        };
    } catch (error) {
        console.error(`Error processing ship components: ${error.message}`);
        return {
            success: false,
            error: error.message,
            file: path.basename(manifestPath)
        };
    }
}

/**
 * Process ship directory (existing function, enhanced with validation)
 */
function processShipDirectory(shipDir, dataDir, globalVarName, outputJs, outputJson, schemaFile) {
    try {
        if (!fs.existsSync(shipDir)) {
            console.warn(`Ship directory not found: ${shipDir}`);
            return {
                success: false,
                error: 'Directory not found',
                file: path.basename(shipDir)
            };
        }

        const files = fs.readdirSync(shipDir)
            .filter((file) => file.endsWith('.json'))
            .sort((a, b) => a.localeCompare(b));

        if (files.length === 0) {
            console.warn(`No ship JSON files found in ${shipDir}`);
            return {
                success: false,
                error: 'No JSON files found',
                file: path.basename(shipDir)
            };
        }

        const metadataTracker = createShipMetadataTracker();
        const ships = files.map((file) =>
            transformShipFile(path.join(shipDir, file), metadataTracker)
        );

        // Validate individual ships (sample check)
        if (schemaFile && ships.length > 0) {
            const sampleShip = JSON.parse(fs.readFileSync(path.join(shipDir, files[0]), 'utf8'));
            const validation = validator.validate(sampleShip, schemaFile);
            if (!validation.valid && !validation.warning) {
                console.warn(`⚠️  Ship schema validation: ${validation.warning || 'Some validation issues'}`);
            }
        }

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

        // Detect changes
        const changeInfo = changeDetector.detectChanges(path.join(shipDir, 'aggregated-cache'), aggregated);

        const outputs = [];

        if (outputJson) {
            const jsonPath = path.join(dataDir, outputJson);
            fs.writeFileSync(jsonPath, JSON.stringify(aggregated, null, 2), 'utf8');
            outputs.push(path.basename(jsonPath));
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
            outputs.push(path.basename(jsPath));
        }

        const jsStats = outputJs ? fs.statSync(path.join(dataDir, outputJs)) : null;
        const jsonStats = outputJson ? fs.statSync(path.join(dataDir, outputJson)) : null;
        const sizeReport = [
            jsStats ? `JS ${(jsStats.size / 1024).toFixed(1)} KB` : null,
            jsonStats ? `JSON ${(jsonStats.size / 1024).toFixed(1)} KB` : null
        ].filter(Boolean).join(', ');

        console.log(`Processed ${files.length} ship files -> ${outputs.join(', ')} (${sizeReport})`);

        return {
            success: true,
            file: path.basename(shipDir),
            outputFiles: outputs,
            changeInfo
        };
    } catch (error) {
        console.error(`Error processing ship directory ${shipDir}: ${error.message}`);
        return {
            success: false,
            error: error.message,
            file: path.basename(shipDir)
        };
    }
}

/**
 * Enhanced task processor with routing to appropriate handlers
 */
function processTask(task) {
    console.log(`\n📋 Processing: ${task.source}`);

    if (task.type === 'json') {
        const jsonPath = path.join(JSON_DIR, task.source);

        if (!fs.existsSync(jsonPath)) {
            console.warn(`JSON file not found: ${jsonPath}`);
            return {
                success: false,
                error: 'File not found',
                file: task.source
            };
        }

        return convertJsonToJs(jsonPath, path.join(DATA_DIR, task.outputJs), task.globalVar, task.schema);
    }

    if (task.type === 'ships') {
        const shipDir = path.join(JSON_DIR, task.source);
        return processShipDirectory(shipDir, DATA_DIR, task.globalVar, task.outputJs, task.outputJson, task.schema);
    }

    if (task.type === 'ship-components') {
        const manifestPath = path.join(JSON_DIR, task.source);
        return processShipComponents(manifestPath, task.parts, DATA_DIR, task.globalVar, task.outputJs, task.outputJson, task.schema);
    }

    console.warn(`Unknown task type: ${task.type}`);
    return {
        success: false,
        error: `Unknown task type: ${task.type}`,
        file: task.source
    };
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
    console.log('===========================================');
    console.log('   Enhanced Data Refresh Process v2.0');
    console.log('===========================================\n');

    ensureDir(DATA_DIR);
    ensureDir(CACHE_DIR);

    if (!fs.existsSync(JSON_DIR)) {
        console.error(`JSON directory not found: ${JSON_DIR}`);
        process.exit(1);
    }

    const results = DATA_TASKS.map(processTask);

    // Generate comprehensive report
    const report = reporter.generateAndReport(results);

    // Exit with error if any failures or breaking changes
    if (report.summary.failed > 0) {
        console.error('\n❌ Refresh completed with FAILURES.');
        console.error(`See ${DATA_DIR}/REFRESH-REPORT.json for details.`);
        process.exit(1);
    }

    if (report.summary.withBreakingChanges > 0) {
        console.error('\n⚠️  Refresh completed with BREAKING CHANGES.');
        console.error('Review changes carefully before deploying to apps.');
        console.error(`See ${DATA_DIR}/REFRESH-REPORT.json for details.`);
        process.exit(1);
    }

    console.log('\n✅ All data files refreshed successfully.');
    console.log('Include the generated files from the Data/ directory in your applications.');
}

if (require.main === module) {
    main();
}

module.exports = {
    convertJsonToJs,
    processShipDirectory,
    processShipComponents,
    main
};
