// Planet Type Utilities
// Shared utility for planet type name mappings across all apps

/**
 * Get the descriptive name for a planet type number
 * @param {number} type - The numeric planet type (0-23)
 * @returns {string} The descriptive planet type name with faction prefix
 */
function getPlanetTypeName(type) {
    const planetTypes = {
        0: 'ONI Terrestrial Planet',
        1: 'ONI Volcanic Planet',
        2: 'ONI Barren Planet',
        3: 'ONI Asteriod Belt',
        4: 'ONI Gas Giant',
        5: 'ONI Ice Giant',
        6: 'ONI Dark Planet',
        7: 'ONI Oceanic Planet',
        8: 'MUD Terrestrial Planet',
        9: 'MUD Volcanic Planet',
        10: 'MUD Barren Planet',
        11: 'MUD Asteriod Belt',
        12: 'MUD Gas Giant',
        13: 'MUD Ice Giant',
        14: 'MUD Dark Planet',
        15: 'MUD Oceanic Planet',
        16: 'UST Terrestrial Planet',
        17: 'UST Volcanic Planet',
        18: 'UST Barren Planet',
        19: 'UST Asteriod Belt',
        20: 'UST Gas Giant',
        21: 'UST Ice Giant',
        22: 'UST Dark Planet',
        23: 'UST Oceanic Planet'
    };
    return planetTypes[type] || `Type ${type}`;
}

/**
 * Get all planet type mappings
 * @returns {Object} Object mapping type numbers to descriptive names
 */
function getAllPlanetTypes() {
    return {
        0: 'ONI Terrestrial Planet',
        1: 'ONI Volcanic Planet',
        2: 'ONI Barren Planet',
        3: 'ONI Asteriod Belt',
        4: 'ONI Gas Giant',
        5: 'ONI Ice Giant',
        6: 'ONI Dark Planet',
        7: 'ONI Oceanic Planet',
        8: 'MUD Terrestrial Planet',
        9: 'MUD Volcanic Planet',
        10: 'MUD Barren Planet',
        11: 'MUD Asteriod Belt',
        12: 'MUD Gas Giant',
        13: 'MUD Ice Giant',
        14: 'MUD Dark Planet',
        15: 'MUD Oceanic Planet',
        16: 'UST Terrestrial Planet',
        17: 'UST Volcanic Planet',
        18: 'UST Barren Planet',
        19: 'UST Asteriod Belt',
        20: 'UST Gas Giant',
        21: 'UST Ice Giant',
        22: 'UST Dark Planet',
        23: 'UST Oceanic Planet'
    };
}

// Planet categories, indexed by (type % 8). Faction is encoded by the type
// range: 0-7 ONI, 8-15 MUD, 16-23 UST.
const PLANET_CATEGORIES = [
    'Terrestrial Planet',
    'Volcanic Planet',
    'Barren Planet',
    'Asteroid Belt',
    'Gas Giant',
    'Ice Giant',
    'Dark Planet',
    'Oceanic Planet'
];

const PLANET_FACTIONS = ['ONI', 'MUD', 'UST'];

/**
 * Get the faction-agnostic category for a planet type (e.g. "Gas Giant").
 * @param {number} type - The numeric planet type (0-23)
 * @returns {string} The category name
 */
function getPlanetCategory(type) {
    return PLANET_CATEGORIES[type % 8] || `Type ${type}`;
}

/**
 * Get the faction encoded in a planet type.
 * @param {number} type - The numeric planet type (0-23)
 * @returns {string} ONI, MUD, or UST
 */
function getPlanetFaction(type) {
    return PLANET_FACTIONS[Math.floor(type / 8)] || 'Unknown';
}

/**
 * Get the ordered list of planet categories.
 * @returns {string[]}
 */
function getPlanetCategories() {
    return [...PLANET_CATEGORIES];
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getPlanetTypeName,
        getAllPlanetTypes,
        getPlanetCategory,
        getPlanetFaction,
        getPlanetCategories,
        PLANET_CATEGORIES,
        PLANET_FACTIONS
    };
}
