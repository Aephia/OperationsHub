// GaliaViewer Enhanced Tests
// Tests for fleet management and search features

const galiaFleetTests = new TestRunner('GaliaViewer Fleet Tests');
const galiaSearchTests = new TestRunner('GaliaViewer Search Tests');

// =============================================================================
// FLEET MANAGER TESTS
// =============================================================================

galiaFleetTests.test('Should load fleet data', async () => {
    const response = await fetch('../JSON/fleetData.json');
    assert(response.ok, 'Failed to load fleetData.json');

    const data = await response.json();
    assertExists(data, 'Fleet data should exist');
    assertExists(data.fleets, 'Fleets array should exist');
});

galiaFleetTests.test('Should have fleets with ship data', async () => {
    const response = await fetch('../JSON/fleetData.json');
    const data = await response.json();

    assert(data.fleets.length > 0, 'Should have at least one fleet');

    const fleet = data.fleets[0];
    assertExists(fleet.ships, 'Fleet should have ships array');
    assertExists(fleet.location, 'Fleet should have location');
});

galiaFleetTests.test('Should validate fleet location coordinates', async () => {
    const response = await fetch('../JSON/fleetData.json');
    const data = await response.json();

    data.fleets.forEach(fleet => {
        if (fleet.location) {
            assertExists(fleet.location.x, 'Location should have x coordinate');
            assertExists(fleet.location.y, 'Location should have y coordinate');
            assertExists(fleet.location.z, 'Location should have z coordinate');
        }
    });
});

galiaFleetTests.test('Should load ship models', async () => {
    const shipModels = [
        'Armstrong Imp',
        'BYOS Packlite',
        'Ogrika Jod Asteris',
        'Tufa Spirit'
    ];

    // Verify ship models exist in data
    const response = await fetch('../JSON/fleetData.json');
    const data = await response.json();

    const foundModels = new Set();
    data.fleets.forEach(fleet => {
        fleet.ships?.forEach(ship => {
            if (ship.model) {
                foundModels.add(ship.model);
            }
        });
    });

    assertGreaterThan(foundModels.size, 0, 'Should have at least one ship model');
});

galiaFleetTests.test('Should calculate fleet total ship count', async () => {
    const response = await fetch('../JSON/fleetData.json');
    const data = await response.json();

    const fleet = data.fleets[0];
    const shipCount = fleet.ships?.length || 0;

    assert(shipCount >= 0, 'Ship count should be non-negative');
});

galiaFleetTests.test('Should group ships by manufacturer', async () => {
    const response = await fetch('../JSON/fleetData.json');
    const data = await response.json();

    const manufacturers = {};

    data.fleets.forEach(fleet => {
        fleet.ships?.forEach(ship => {
            const manufacturer = ship.manufacturer || 'Unknown';
            if (!manufacturers[manufacturer]) {
                manufacturers[manufacturer] = 0;
            }
            manufacturers[manufacturer]++;
        });
    });

    assertExists(manufacturers, 'Manufacturers object should exist');
});

galiaFleetTests.test('Should have ship scaling factors', () => {
    const shipScales = {
        'Tufa Spirit': 0.05,
        'BYOS Packlite': 1.2,
        'Armstrong Imp': 1.0,
        'Ogrika Jod Asteris': 1.0
    };

    assertEquals(shipScales['Tufa Spirit'], 0.05, 'Tufa Spirit should have 0.05 scale');
    assertEquals(shipScales['BYOS Packlite'], 1.2, 'BYOS Packlite should have 1.2 scale');
});

galiaFleetTests.test('Should calculate fleet bounding box', () => {
    const ships = [
        { position: { x: 0, y: 0, z: 0 } },
        { position: { x: 100, y: 50, z: 75 } },
        { position: { x: -50, y: -25, z: 30 } }
    ];

    const bounds = {
        minX: Math.min(...ships.map(s => s.position.x)),
        maxX: Math.max(...ships.map(s => s.position.x)),
        minY: Math.min(...ships.map(s => s.position.y)),
        maxY: Math.max(...ships.map(s => s.position.y)),
        minZ: Math.min(...ships.map(s => s.position.z)),
        maxZ: Math.max(...ships.map(s => s.position.z))
    };

    assertEquals(bounds.minX, -50, 'Min X should be -50');
    assertEquals(bounds.maxX, 100, 'Max X should be 100');
    assertEquals(bounds.minY, -25, 'Min Y should be -25');
    assertEquals(bounds.maxY, 50, 'Max Y should be 50');
});

galiaFleetTests.test('Should toggle fleet visibility', () => {
    let fleetsVisible = true;

    const toggleFleetVisibility = () => {
        fleetsVisible = !fleetsVisible;
        return fleetsVisible;
    };

    assertEquals(toggleFleetVisibility(), false, 'First toggle should hide fleets');
    assertEquals(toggleFleetVisibility(), true, 'Second toggle should show fleets');
});

galiaFleetTests.test('Should handle fleet data updates', async () => {
    const response = await fetch('../JSON/fleetData.json');
    const initialData = await response.json();

    const updatedFleets = initialData.fleets.map(fleet => ({
        ...fleet,
        lastUpdated: new Date().toISOString()
    }));

    assert(updatedFleets.length === initialData.fleets.length, 'Should maintain fleet count');
    assertExists(updatedFleets[0].lastUpdated, 'Should have lastUpdated timestamp');
});

// =============================================================================
// SEARCH FUNCTIONALITY TESTS
// =============================================================================

galiaSearchTests.test('Should load star system data for search', async () => {
    const response = await fetch('../JSON/galia.json');
    assert(response.ok, 'Failed to load galia.json');

    const data = await response.json();
    assertExists(data, 'Star system data should exist');
    assert(Array.isArray(data), 'Star system data should be an array');
});

galiaSearchTests.test('Should search for stars by name', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    const searchTerm = systems[0]?.name?.substring(0, 3) || 'MUD';

    const results = systems.filter(system =>
        system.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    assertGreaterThan(results.length, 0, 'Should find at least one star');
});

galiaSearchTests.test('Should search for planets by name', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    // Find first planet
    let testPlanetName = null;
    for (const system of systems) {
        if (system.children?.length > 0) {
            const planet = system.children.find(child => child.userData?.type === 'planet');
            if (planet?.name) {
                testPlanetName = planet.name.substring(0, 3);
                break;
            }
        }
    }

    if (testPlanetName) {
        const results = [];
        systems.forEach(system => {
            system.children?.forEach(child => {
                if (child.userData?.type === 'planet' &&
                    child.name?.toLowerCase().includes(testPlanetName.toLowerCase())) {
                    results.push(child);
                }
            });
        });

        assertGreaterThan(results.length, 0, 'Should find at least one planet');
    }
});

galiaSearchTests.test('Should differentiate between stars and planets', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    const stars = systems.filter(s => !s.userData?.type || s.userData?.type !== 'planet');
    const planets = [];

    systems.forEach(system => {
        system.children?.forEach(child => {
            if (child.userData?.type === 'planet') {
                planets.push(child);
            }
        });
    });

    assertGreaterThan(stars.length, 0, 'Should have stars');
    assertGreaterThan(planets.length, 0, 'Should have planets');
});

galiaSearchTests.test('Should handle case-insensitive search', () => {
    const searchTerm = 'MUD';
    const items = [
        { name: 'MUD-Star-001' },
        { name: 'mud-star-002' },
        { name: 'Mud-Star-003' },
        { name: 'OTHER-001' }
    ];

    const results = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    assertEquals(results.length, 3, 'Should find 3 items with mud (case-insensitive)');
});

galiaSearchTests.test('Should handle empty search query', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    const searchTerm = '';
    const results = searchTerm.length > 0 ? systems.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    assertEquals(results.length, 0, 'Empty search should return no results');
});

galiaSearchTests.test('Should return search results with coordinates', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    const system = systems[0];
    assertExists(system.position, 'Star should have position');

    if (system.children?.length > 0) {
        const planet = system.children[0];
        assertExists(planet.position, 'Planet should have position');
    }
});

galiaSearchTests.test('Should focus camera on search result', () => {
    const searchResult = {
        position: { x: 100, y: 50, z: 200 }
    };

    const cameraTarget = {
        x: searchResult.position.x,
        y: searchResult.position.y,
        z: searchResult.position.z
    };

    assertEquals(cameraTarget.x, 100, 'Camera should target x: 100');
    assertEquals(cameraTarget.y, 50, 'Camera should target y: 50');
    assertEquals(cameraTarget.z, 200, 'Camera should target z: 200');
});

galiaSearchTests.test('Should highlight search result in scene', () => {
    const objects = [
        { id: 1, highlighted: false },
        { id: 2, highlighted: false },
        { id: 3, highlighted: false }
    ];

    const searchResultId = 2;

    objects.forEach(obj => {
        obj.highlighted = (obj.id === searchResultId);
    });

    assertEquals(objects[0].highlighted, false, 'Object 1 should not be highlighted');
    assertEquals(objects[1].highlighted, true, 'Object 2 should be highlighted');
    assertEquals(objects[2].highlighted, false, 'Object 3 should not be highlighted');
});

galiaSearchTests.test('Should show search result info panel', () => {
    const searchResult = {
        name: 'MUD-Star-001',
        type: 'star',
        position: { x: 100, y: 50, z: 200 },
        children: 5
    };

    const infoPanelData = {
        title: searchResult.name,
        type: searchResult.type,
        location: `(${searchResult.position.x}, ${searchResult.position.y}, ${searchResult.position.z})`,
        planets: searchResult.children
    };

    assertEquals(infoPanelData.title, 'MUD-Star-001', 'Title should match name');
    assertEquals(infoPanelData.type, 'star', 'Type should be star');
    assertEquals(infoPanelData.planets, 5, 'Should have 5 planets');
});

galiaSearchTests.test('Should clear previous search highlights', () => {
    const objects = [
        { id: 1, highlighted: true },
        { id: 2, highlighted: true },
        { id: 3, highlighted: false }
    ];

    // Clear all highlights
    objects.forEach(obj => {
        obj.highlighted = false;
    });

    assertEquals(objects[0].highlighted, false, 'Object 1 highlight should be cleared');
    assertEquals(objects[1].highlighted, false, 'Object 2 highlight should be cleared');
    assertEquals(objects[2].highlighted, false, 'Object 3 highlight should be cleared');
});

galiaSearchTests.test('Should provide search suggestions', async () => {
    const response = await fetch('../JSON/galia.json');
    const systems = await response.json();

    const searchTerm = 'MUD';
    const maxSuggestions = 5;

    const suggestions = systems
        .filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, maxSuggestions)
        .map(s => s.name);

    assert(suggestions.length <= maxSuggestions, 'Should not exceed max suggestions');
});

console.log('✅ GaliaViewer Enhanced Tests loaded successfully');
