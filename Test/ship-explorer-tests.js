/**
 * Ship Explorer Test Suite
 * Comprehensive tests for Ship Explorer functionality
 */

class ShipExplorerTests {
    constructor() {
        this.suiteName = 'Ship Explorer Tests';
        this.tests = [];
        this.results = [];
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log(`\n🚀 Starting ${this.suiteName}...\n`);

        for (const { name, testFn } of this.tests) {
            try {
                await testFn();
                this.results.push({ name, status: 'PASS', error: null });
                console.log(`✅ ${name}`);
            } catch (error) {
                this.results.push({ name, status: 'FAIL', error: error.message });
                console.log(`❌ ${name}: ${error.message}`);
            }
        }

        this.printSummary();
        return this.results;
    }

    printSummary() {
        const passed = this.results.filter(r => r.status === 'PASS').length;
        const failed = this.results.filter(r => r.status === 'FAIL').length;

        console.log(`\n📊 ${this.suiteName} Summary:`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Total: ${this.tests.length}\n`);

        if (failed > 0) {
            console.log('💥 Failed Tests:');
            this.results.filter(r => r.status === 'FAIL').forEach(r => {
                console.log(`  • ${r.name}: ${r.error}`);
            });
        }
    }
}

// Helper assertions
function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected} but got ${actual}`);
    }
}

function assertExists(value, message) {
    if (value === null || value === undefined) {
        throw new Error(message || 'Value should exist');
    }
}

function assertGreaterThan(actual, expected, message) {
    if (actual <= expected) {
        throw new Error(message || `Expected ${actual} to be greater than ${expected}`);
    }
}

function assertArrayLength(array, expectedLength, message) {
    if (!Array.isArray(array) || array.length !== expectedLength) {
        throw new Error(message || `Expected array length ${expectedLength} but got ${array?.length}`);
    }
}

// Initialize test suite
const shipExplorerTests = new ShipExplorerTests();

// ===== DATA LOADING TESTS =====
shipExplorerTests.test('Should load ship data through DataLoader', async () => {
    const data = await DataLoader.loadExplorerData('ship');
    assertExists(data, 'Ship data should be loaded');
    assertExists(data.ships, 'Should have ships array');
    assert(Array.isArray(data.ships), 'Ships should be an array');
    assertGreaterThan(data.ships.length, 0, 'Should have at least one ship');
});

shipExplorerTests.test('Should load ship with configurations', async () => {
    const data = await DataLoader.loadExplorerData('ship');
    const ship = data.ships[0];
    assertExists(ship, 'Should have at least one ship');
    assertExists(ship.configurations, 'Ship should have configurations');
    assert(Array.isArray(ship.configurations), 'Configurations should be an array');
});

shipExplorerTests.test('Should load ship with components in configurations', async () => {
    const data = await DataLoader.loadExplorerData('ship');
    const ship = data.ships.find(s => s.configurations?.length > 0);
    assertExists(ship, 'Should find a ship with configurations');
    const config = ship.configurations[0];
    assertExists(config.components, 'Configuration should have components');
});

// ===== SHIP PROPERTIES TESTS =====
shipExplorerTests.test('Ship should have required properties', async () => {
    const data = await DataLoader.loadExplorerData('ship');
    const ship = data.ships[0];

    assertExists(ship.id, 'Ship should have id');
    assertExists(ship.name, 'Ship should have name');
    assertExists(ship.manufacturer, 'Ship should have manufacturer');
    assertExists(ship.sizeTier, 'Ship should have sizeTier');
});

shipExplorerTests.test('Ship should have stats object', async () => {
    const data = await DataLoader.loadExplorerData('ship');
    const ship = data.ships[0];

    assertExists(ship.stats, 'Ship should have stats');
    assert(typeof ship.stats === 'object', 'Stats should be an object');
});

shipExplorerTests.test('Ship stats should include capacities', async () => {
    const data = await DataLoader.loadExplorerData('ship');
    const shipWithStats = data.ships.find(s => s.stats?.capacities);

    if (shipWithStats) {
        assertExists(shipWithStats.stats.capacities, 'Should have capacities');
        assert(typeof shipWithStats.stats.capacities === 'object', 'Capacities should be an object');
    }
});

// ===== CONFIGURATION TESTS =====
shipExplorerTests.test('Configuration should have name and components', async () => {
    const data = await DataLoader.loadExplorerData('ship');
    const ship = data.ships.find(s => s.configurations?.length > 0);
    const config = ship.configurations[0];

    assertExists(config.name, 'Configuration should have name');
    assertExists(config.components, 'Configuration should have components');
});

shipExplorerTests.test('Configuration components should be organized by category', async () => {
    const data = await DataLoader.loadExplorerData('ship');
    const ship = data.ships.find(s => s.configurations?.length > 0);
    const config = ship.configurations[0];

    assert(typeof config.components === 'object', 'Components should be an object');
    const categories = Object.keys(config.components);
    assertGreaterThan(categories.length, 0, 'Should have at least one component category');
});

shipExplorerTests.test('Component slots should contain arrays of items', async () => {
    const data = await DataLoader.loadExplorerData('ship');
    const ship = data.ships.find(s => s.configurations?.length > 0);
    const config = ship.configurations[0];

    const category = Object.values(config.components)[0];
    if (category && typeof category === 'object') {
        const slot = Object.values(category)[0];
        if (slot && slot.items) {
            assert(Array.isArray(slot.items), 'Slot items should be an array');
        }
    }
});

// ===== COMPONENT COUNTING TESTS =====
shipExplorerTests.test('Should count components in configuration', async () => {
    const data = await DataLoader.loadExplorerData('ship');
    const ship = data.ships.find(s => s.configurations?.length > 0);
    const config = ship.configurations[0];

    let totalComponents = 0;
    if (config.components) {
        Object.values(config.components).forEach(category => {
            if (category && typeof category === 'object') {
                Object.values(category).forEach(slot => {
                    if (slot && Array.isArray(slot.items)) {
                        totalComponents += slot.items.length;
                    }
                });
            }
        });
    }

    assertGreaterThan(totalComponents, 0, 'Configuration should have at least one component');
});

// ===== SHIP EXPLORER APP TESTS =====
shipExplorerTests.test('Should instantiate ShipExplorer class', () => {
    assertExists(window.ShipExplorer, 'ShipExplorer class should be available');
    assert(typeof window.ShipExplorer === 'function', 'ShipExplorer should be a class/constructor');
});

shipExplorerTests.test('ShipExplorer should have required methods', () => {
    const requiredMethods = [
        'loadShips',
        'loadComponentData',
        'updateStats',
        'renderComparison',
        'renderAnalytics'
    ];

    const proto = window.ShipExplorer.prototype;
    requiredMethods.forEach(method => {
        assertExists(proto[method], `ShipExplorer should have ${method} method`);
    });
});

// ===== CONFIG CALCULATOR TESTS =====
shipExplorerTests.test('ShipConfigCalculator should be available', () => {
    assertExists(window.ShipConfigCalculator, 'ShipConfigCalculator should be available');
});

shipExplorerTests.test('ShipConfigCalculator should have calculateModifiedStats', () => {
    const calculator = new window.ShipConfigCalculator();
    assertExists(calculator.calculateModifiedStats, 'Should have calculateModifiedStats method');
    assert(typeof calculator.calculateModifiedStats === 'function', 'calculateModifiedStats should be a function');
});

shipExplorerTests.test('ShipConfigCalculator should handle empty configuration', () => {
    const calculator = new window.ShipConfigCalculator();
    calculator.setData({
        componentsById: {},
        componentAttributes: {},
        classScalingFormulas: {},
        tierScalingFormulas: {},
        statPathMap: {},
        statKeys: []
    });

    const mockShip = { stats: { capacities: { cargoCapacity: 1000 } } };
    const mockConfig = { components: {} };

    const result = calculator.calculateModifiedStats(mockShip, mockConfig);
    assertExists(result, 'Should return a result');
    assertExists(result.values, 'Should have values object');
});

// ===== ANALYTICS TESTS =====
shipExplorerTests.test('Should have FleetAnalytics class', () => {
    assertExists(window.FleetAnalytics, 'FleetAnalytics class should be available');
});

shipExplorerTests.test('Should have ResourceEfficiencyAnalytics class', () => {
    assertExists(window.ResourceEfficiencyAnalytics, 'ResourceEfficiencyAnalytics class should be available');
});

shipExplorerTests.test('CrossExplorerAnalytics should have ship-related methods', async () => {
    const analytics = new CrossExplorerAnalytics();
    assertExists(analytics.analyzeFleetResourceFootprint, 'Should have analyzeFleetResourceFootprint');
    assertExists(analytics.analyzeShipResourceEfficiency, 'Should have analyzeShipResourceEfficiency');
});

shipExplorerTests.test('Should analyze fleet resource footprint per configuration', async () => {
    const analytics = new CrossExplorerAnalytics();
    const result = await analytics.analyzeFleetResourceFootprint();

    assertExists(result, 'Should return analysis result');
    assertExists(result.shipConstructionCosts, 'Should have shipConstructionCosts');
    assert(Array.isArray(result.shipConstructionCosts), 'shipConstructionCosts should be an array');

    if (result.shipConstructionCosts.length > 0) {
        const entry = result.shipConstructionCosts[0];
        assertExists(entry.configName, 'Entry should have configName');
        assertExists(entry.componentCount, 'Entry should have componentCount');
    }
});

shipExplorerTests.test('Should analyze ship resource efficiency per configuration', async () => {
    const analytics = new CrossExplorerAnalytics();
    const result = await analytics.analyzeShipResourceEfficiency();

    assertExists(result, 'Should return analysis result');
    assertExists(result.bestCargoHaulers, 'Should have bestCargoHaulers');
    assertExists(result.bestCombatShips, 'Should have bestCombatShips');
    assertExists(result.bestSpeedShips, 'Should have bestSpeedShips');
    assertExists(result.mostFuelEfficient, 'Should have mostFuelEfficient');
});

shipExplorerTests.test('Efficiency analytics should use per-configuration data', async () => {
    const analytics = new CrossExplorerAnalytics();
    const result = await analytics.analyzeShipResourceEfficiency();

    if (result.bestCargoHaulers.length > 0) {
        const entry = result.bestCargoHaulers[0];
        assertExists(entry.configName, 'Cargo hauler entry should have configName');
        assertExists(entry.cargoCapacity, 'Cargo hauler entry should have cargoCapacity');
        assertExists(entry.cargoEfficiency, 'Cargo hauler entry should have cargoEfficiency');
    }
});

// ===== MODIFIED STATS TESTS =====
shipExplorerTests.test('Should calculate modified stats with calculator', async () => {
    // Wait for ship explorer to initialize if it exists
    if (window.shipExplorer && window.shipExplorer.componentDataLoaded) {
        const data = await DataLoader.loadExplorerData('ship');
        const ship = data.ships[0];
        const config = ship.configurations?.[0];

        if (config && window.shipExplorer.configCalculator) {
            const result = window.shipExplorer.configCalculator.calculateModifiedStats(ship, config);
            assertExists(result, 'Should return calculation result');
            assertExists(result.values, 'Should have values object');
        }
    }
});

shipExplorerTests.test('Modified stats should use underscore notation', async () => {
    const analytics = new CrossExplorerAnalytics();

    // Check that the calculator returns stats with underscore notation
    if (window.shipExplorer?.configCalculator) {
        const data = await DataLoader.loadExplorerData('ship');
        const ship = data.ships[0];
        const config = ship.configurations?.[0];

        if (config) {
            const result = window.shipExplorer.configCalculator.calculateModifiedStats(ship, config);
            const values = result.values;

            // Check for underscore notation (cargo_capacity vs cargoCapacity)
            const keys = Object.keys(values);
            const hasUnderscores = keys.some(key => key.includes('_'));
            assert(hasUnderscores, 'Modified stats should use underscore notation (e.g., cargo_capacity)');
        }
    }
});

// ===== COMPONENT DETAILS TESTS =====
shipExplorerTests.test('Fleet analytics should show component details in breakdown', async () => {
    const analytics = new window.FleetAnalytics();
    assertExists(analytics, 'FleetAnalytics should instantiate');
    assertExists(analytics.showShipResourceDetails, 'Should have showShipResourceDetails method');
});

shipExplorerTests.test('Component breakdown should include recipe buttons', async () => {
    const analytics = new window.FleetAnalytics();
    assertExists(analytics.openRecipeForComponent, 'Should have openRecipeForComponent method');
});

// Make available globally
window.shipExplorerTests = shipExplorerTests;

console.log('✅ Ship Explorer test suite loaded (22 tests)');
