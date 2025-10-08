// Hub Explorer Tests
// Tests for habitat construction planning and crafting station optimization

const hubExplorerTests = new TestRunner('Hub Explorer Tests');

// =============================================================================
// DATA LOADING TESTS
// =============================================================================

hubExplorerTests.test('Should load craftingHabBuildings.json data', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    assert(response.ok, 'Failed to load craftingHabBuildings.json');

    const data = await response.json();
    assertExists(data, 'Data should exist');
    assertExists(data.habs, 'Habs array should exist');
    assertExists(data.craftingStations, 'Crafting stations array should exist');
    assertExists(data.cargoStorage, 'Cargo storage array should exist');
});

hubExplorerTests.test('Should have 5 habitat tiers', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    const data = await response.json();

    const habTiers = data.habs.filter(h => h.id.match(/^hab-t[1-5]$/));
    assertEquals(habTiers.length, 5, 'Should have exactly 5 habitat tiers');
});

hubExplorerTests.test('Should have habitat tier progression (T1-T5)', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    const data = await response.json();

    const habTiers = data.habs.filter(h => h.id.match(/^hab-t[1-5]$/));
    const slots = habTiers.map(h => h.slots);

    // Verify slots increase: 32, 243, 1024, 4096, 16384
    assertEquals(slots[0], 32, 'T1 should have 32 slots');
    assertEquals(slots[1], 243, 'T2 should have 243 slots');
    assertEquals(slots[2], 1024, 'T3 should have 1024 slots');
    assertEquals(slots[3], 4096, 'T4 should have 4096 slots');
    assertEquals(slots[4], 16384, 'T5 should have 16384 slots');
});

hubExplorerTests.test('Should have 4 landing pad sizes', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    const data = await response.json();

    const landingPads = data.habs.filter(h => h.id.includes('landing-pad'));
    assertEquals(landingPads.length, 4, 'Should have 4 landing pad sizes');
});

hubExplorerTests.test('Should have decorative items', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    const data = await response.json();

    const decorative = data.habs.filter(h =>
        h.id.includes('paint') || h.id.includes('pet-house')
    );
    assertGreaterThan(decorative.length, 0, 'Should have decorative items');
});

// =============================================================================
// CRAFTING STATION TESTS
// =============================================================================

hubExplorerTests.test('Should have 4 crafting station sizes', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    const data = await response.json();

    assertEquals(data.craftingStations.length, 4, 'Should have 4 crafting station sizes');
});

hubExplorerTests.test('Crafting stations should have increasing speed bonuses', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    const data = await response.json();

    const speedBonuses = data.craftingStations.map(s => s.speedBonus);

    // Verify speed bonuses increase: 1x, 1.25x, 1.5x, 2x
    assertEquals(speedBonuses[0], 1, 'XXS should have 1x speed');
    assertEquals(speedBonuses[1], 1.25, 'XS should have 1.25x speed');
    assertEquals(speedBonuses[2], 1.5, 'S should have 1.5x speed');
    assertEquals(speedBonuses[3], 2, 'M should have 2x speed');
});

hubExplorerTests.test('Crafting stations should have increasing job slots', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    const data = await response.json();

    const jobSlots = data.craftingStations.map(s => s.jobSlots);

    // Verify job slots increase: 1, 2, 3, 5
    assertEquals(jobSlots[0], 1, 'XXS should have 1 job slot');
    assertEquals(jobSlots[1], 2, 'XS should have 2 job slots');
    assertEquals(jobSlots[2], 3, 'S should have 3 job slots');
    assertEquals(jobSlots[3], 5, 'M should have 5 job slots');
});

hubExplorerTests.test('Crafting stations should have size property', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    const data = await response.json();

    const sizes = data.craftingStations.map(s => s.size);

    assert(sizes.includes('XXS'), 'Should have XXS size');
    assert(sizes.includes('XS'), 'Should have XS size');
    assert(sizes.includes('S'), 'Should have S size');
    assert(sizes.includes('M'), 'Should have M size');
});

// =============================================================================
// CARGO STORAGE TESTS
// =============================================================================

hubExplorerTests.test('Should have 5 cargo storage tiers', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    const data = await response.json();

    assertEquals(data.cargoStorage.length, 5, 'Should have 5 cargo storage tiers');
});

hubExplorerTests.test('Cargo storage should have increasing storage bonuses', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    const data = await response.json();

    const storageBonuses = data.cargoStorage.map(s => s.storageBonus);

    // Verify storage bonuses increase: 500, 1500, 3000, 6000, 12000
    assertEquals(storageBonuses[0], 500, 'T1 should have 500 storage');
    assertEquals(storageBonuses[1], 1500, 'T2 should have 1500 storage');
    assertEquals(storageBonuses[2], 3000, 'T3 should have 3000 storage');
    assertEquals(storageBonuses[3], 6000, 'T4 should have 6000 storage');
    assertEquals(storageBonuses[4], 12000, 'T5 should have 12000 storage');
});

hubExplorerTests.test('Cargo storage should have job slot bonuses', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    const data = await response.json();

    const jobSlotBonuses = data.cargoStorage.map(s => s.jobSlotBonus);

    // T1 has 0, others have increasing bonuses
    assertEquals(jobSlotBonuses[0], 0, 'T1 should have 0 job slot bonus');
    assertGreaterThan(jobSlotBonuses[4], jobSlotBonuses[0], 'T5 should have more job slots than T1');
});

// =============================================================================
// CONSTRUCTION COST TESTS
// =============================================================================

hubExplorerTests.test('All buildings should have construction costs', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    const data = await response.json();

    const allBuildings = [
        ...data.habs,
        ...data.craftingStations,
        ...data.cargoStorage
    ];

    for (const building of allBuildings) {
        assertExists(building.constructionCost, `${building.name} should have construction cost`);
        assert(Object.keys(building.constructionCost).length > 0, `${building.name} should have at least one material`);
    }
});

hubExplorerTests.test('All buildings should have construction time', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    const data = await response.json();

    const allBuildings = [
        ...data.habs,
        ...data.craftingStations,
        ...data.cargoStorage
    ];

    for (const building of allBuildings) {
        assertExists(building.constructionTime, `${building.name} should have construction time`);
        assertGreaterThan(building.constructionTime, 0, `${building.name} construction time should be positive`);
    }
});

hubExplorerTests.test('Higher tier buildings should require previous tier', async () => {
    const response = await fetch('../JSON/craftingHabBuildings.json');
    const data = await response.json();

    // Check hab tiers
    const habT2 = data.habs.find(h => h.id === 'hab-t2');
    assert(habT2.constructionCost['hab-t1'], 'Hab T2 should require Hab T1');

    const habT3 = data.habs.find(h => h.id === 'hab-t3');
    assert(habT3.constructionCost['hab-t2'], 'Hab T3 should require Hab T2');

    // Check crafting stations
    const craftingXS = data.craftingStations.find(s => s.size === 'XS');
    assert(craftingXS.constructionCost['hab-crafting-station-xxs'], 'Crafting XS should require XXS');

    // Check cargo storage
    const storageT2 = data.cargoStorage.find(s => s.tier === 2);
    assert(storageT2.constructionCost['hab-cargo-storage-t1'], 'Storage T2 should require T1');
});

// =============================================================================
// BUILDING PLANNER LOGIC TESTS
// =============================================================================

hubExplorerTests.test('Should calculate total slots correctly', () => {
    const buildings = [
        { slots: 32, quantity: 1 },
        { slots: 64, quantity: 2 }
    ];

    const totalSlots = buildings.reduce((sum, b) => sum + (b.slots * b.quantity), 0);
    assertEquals(totalSlots, 160, 'Total slots should be 32 + (64*2) = 160');
});

hubExplorerTests.test('Should calculate total storage correctly', () => {
    const buildings = [
        { storage: 1000, storageBonus: 500, quantity: 1 },
        { storage: 0, storageBonus: 1500, quantity: 2 }
    ];

    const totalStorage = buildings.reduce((sum, b) =>
        sum + ((b.storage || 0) + (b.storageBonus || 0)) * b.quantity, 0
    );
    assertEquals(totalStorage, 4500, 'Total storage should be 1500 + (1500*2) = 4500');
});

hubExplorerTests.test('Should calculate total construction time correctly', () => {
    const buildings = [
        { constructionTime: 1800, quantity: 1 },
        { constructionTime: 3600, quantity: 2 }
    ];

    const totalTime = buildings.reduce((sum, b) => sum + (b.constructionTime * b.quantity), 0);
    assertEquals(totalTime, 9000, 'Total time should be 1800 + (3600*2) = 9000');
});

hubExplorerTests.test('Should aggregate construction costs correctly', () => {
    const buildings = [
        {
            constructionCost: { 'material-a': 2, 'material-b': 1 },
            quantity: 2
        },
        {
            constructionCost: { 'material-a': 1, 'material-c': 3 },
            quantity: 1
        }
    ];

    const totalCosts = {};
    buildings.forEach(building => {
        Object.entries(building.constructionCost).forEach(([material, amount]) => {
            totalCosts[material] = (totalCosts[material] || 0) + (amount * building.quantity);
        });
    });

    assertEquals(totalCosts['material-a'], 5, 'Material A should be (2*2) + 1 = 5');
    assertEquals(totalCosts['material-b'], 2, 'Material B should be (1*2) = 2');
    assertEquals(totalCosts['material-c'], 3, 'Material C should be 3');
});

// =============================================================================
// TIME FORMATTING TESTS
// =============================================================================

hubExplorerTests.test('Should format time correctly for minutes only', () => {
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours === 0) return `${minutes}m`;
        return `${hours}h ${minutes}m`;
    };

    assertEquals(formatTime(300), '5m', '300 seconds should be 5m');
    assertEquals(formatTime(900), '15m', '900 seconds should be 15m');
});

hubExplorerTests.test('Should format time correctly for hours and minutes', () => {
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours === 0) return `${minutes}m`;
        return `${hours}h ${minutes}m`;
    };

    assertEquals(formatTime(3600), '1h 0m', '3600 seconds should be 1h 0m');
    assertEquals(formatTime(5400), '1h 30m', '5400 seconds should be 1h 30m');
    assertEquals(formatTime(7200), '2h 0m', '7200 seconds should be 2h 0m');
});

// =============================================================================
// RESOURCE NAME FORMATTING TESTS
// =============================================================================

hubExplorerTests.test('Should format resource names correctly', () => {
    const formatResourceName = (resource) => {
        return resource.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    assertEquals(formatResourceName('material-processor'), 'Material Processor');
    assertEquals(formatResourceName('safety-interlock'), 'Safety Interlock');
    assertEquals(formatResourceName('hab-t1'), 'Hab T1');
});

console.log('✅ Hub Explorer Tests loaded successfully');
