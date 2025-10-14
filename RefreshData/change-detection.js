/**
 * Change Detection Module
 *
 * Detects structural changes in JSON data files
 * Tracks hashes and schema structures to identify breaking changes
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class ChangeDetector {
    constructor(cacheDir) {
        this.cacheDir = cacheDir;
        this.ensureCacheDir();
    }

    ensureCacheDir() {
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
        }
    }

    /**
     * Compute SHA-256 hash of data
     * @param {Object} data - Data to hash
     * @returns {string} - Hex hash string
     */
    computeHash(data) {
        const str = JSON.stringify(data, Object.keys(data).sort());
        return crypto.createHash('sha256').update(str).digest('hex');
    }

    /**
     * Extract structure from data (field names, types, arrays)
     * @param {*} obj - Object to analyze
     * @param {string} path - Current path
     * @param {number} depth - Current recursion depth
     * @returns {Object} - Structure map
     */
    extractStructure(obj, path = '', depth = 0) {
        const MAX_DEPTH = 10; // Prevent infinite recursion
        const structure = {};

        if (depth > MAX_DEPTH) return structure;

        if (Array.isArray(obj)) {
            structure[path] = {
                type: 'array',
                length: obj.length,
                itemType: obj.length > 0 ? typeof obj[0] : 'unknown'
            };

            // Analyze first array item for structure
            if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
                const itemStructure = this.extractStructure(obj[0], `${path}[0]`, depth + 1);
                Object.assign(structure, itemStructure);
            }
        } else if (typeof obj === 'object' && obj !== null) {
            structure[path] = {
                type: 'object',
                keys: Object.keys(obj)
            };

            for (const key of Object.keys(obj)) {
                const newPath = path ? `${path}.${key}` : key;
                const value = obj[key];

                if (typeof value === 'object' && value !== null) {
                    const childStructure = this.extractStructure(value, newPath, depth + 1);
                    Object.assign(structure, childStructure);
                } else {
                    structure[newPath] = {
                        type: typeof value,
                        required: value !== null && value !== undefined
                    };
                }
            }
        } else {
            structure[path] = {
                type: typeof obj
            };
        }

        return structure;
    }

    /**
     * Compare two structures to find differences
     * @param {Object} oldStructure - Previous structure
     * @param {Object} newStructure - Current structure
     * @returns {Object} - { breaking, additions, modifications }
     */
    compareStructures(oldStructure, newStructure) {
        const breaking = [];
        const additions = [];
        const modifications = [];

        if (!oldStructure) {
            return { breaking, additions, modifications, isNew: true };
        }

        // Check for removed or modified fields
        for (const path in oldStructure) {
            if (!(path in newStructure)) {
                breaking.push(`Removed field: ${path}`);
            } else {
                const oldType = oldStructure[path].type;
                const newType = newStructure[path].type;

                if (oldType !== newType) {
                    breaking.push(`Type changed: ${path} (${oldType} → ${newType})`);
                }

                // Check for removed object keys
                if (oldStructure[path].keys && newStructure[path].keys) {
                    const oldKeys = oldStructure[path].keys;
                    const newKeys = newStructure[path].keys;
                    const removedKeys = oldKeys.filter(k => !newKeys.includes(k));

                    if (removedKeys.length > 0) {
                        breaking.push(`Removed keys from ${path}: ${removedKeys.join(', ')}`);
                    }
                }
            }
        }

        // Check for new fields
        for (const path in newStructure) {
            if (!(path in oldStructure)) {
                additions.push(`Added field: ${path} (${newStructure[path].type})`);
            } else {
                // Check for added object keys
                if (oldStructure[path].keys && newStructure[path].keys) {
                    const oldKeys = oldStructure[path].keys;
                    const newKeys = newStructure[path].keys;
                    const addedKeys = newKeys.filter(k => !oldKeys.includes(k));

                    if (addedKeys.length > 0) {
                        modifications.push(`Added keys to ${path}: ${addedKeys.join(', ')}`);
                    }
                }
            }
        }

        return {
            breaking,
            additions,
            modifications,
            isNew: false
        };
    }

    /**
     * Detect changes in a file
     * @param {string} filePath - Path to source file
     * @param {Object} currentData - Current data
     * @returns {Object} - Change detection results
     */
    detectChanges(filePath, currentData) {
        const baseName = path.basename(filePath);
        const hashFile = path.join(this.cacheDir, `${baseName}.hash`);
        const structureFile = path.join(this.cacheDir, `${baseName}.structure.json`);

        // Compute current hash
        const currentHash = this.computeHash(currentData);

        // Check previous hash
        let previousHash = null;
        if (fs.existsSync(hashFile)) {
            previousHash = fs.readFileSync(hashFile, 'utf8').trim();
        }

        // If hash unchanged, no need to analyze structure
        if (currentHash === previousHash) {
            return {
                changed: false,
                breaking: false,
                diff: { breaking: [], additions: [], modifications: [] }
            };
        }

        // Analyze structure changes
        const currentStructure = this.extractStructure(currentData);
        let previousStructure = null;

        if (fs.existsSync(structureFile)) {
            try {
                previousStructure = JSON.parse(fs.readFileSync(structureFile, 'utf8'));
            } catch (error) {
                console.warn(`⚠️  Could not read previous structure for ${baseName}`);
            }
        }

        const diff = this.compareStructures(previousStructure, currentStructure);

        // Save new hash and structure
        fs.writeFileSync(hashFile, currentHash);
        fs.writeFileSync(structureFile, JSON.stringify(currentStructure, null, 2));

        return {
            changed: true,
            breaking: diff.breaking.length > 0,
            isNew: diff.isNew,
            diff
        };
    }

    /**
     * Clear cache for a specific file
     * @param {string} filePath - Path to source file
     */
    clearCache(filePath) {
        const baseName = path.basename(filePath);
        const hashFile = path.join(this.cacheDir, `${baseName}.hash`);
        const structureFile = path.join(this.cacheDir, `${baseName}.structure.json`);

        if (fs.existsSync(hashFile)) fs.unlinkSync(hashFile);
        if (fs.existsSync(structureFile)) fs.unlinkSync(structureFile);
    }

    /**
     * Clear all cached data
     */
    clearAllCache() {
        if (fs.existsSync(this.cacheDir)) {
            const files = fs.readdirSync(this.cacheDir);
            files.forEach(file => {
                fs.unlinkSync(path.join(this.cacheDir, file));
            });
        }
    }
}

module.exports = ChangeDetector;
