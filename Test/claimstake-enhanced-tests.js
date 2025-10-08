// ClaimStake Enhanced Tests
// Tests for construction facility and analytics features

const claimStakeConstructionTests = new TestRunner('ClaimStake Construction Tests');
const claimStakeAnalyticsTests = new TestRunner('ClaimStake Analytics Tests');

// =============================================================================
// CONSTRUCTION FACILITY TESTS
// =============================================================================

claimStakeConstructionTests.test('Should load building data for construction', async () => {
    const response = await fetch('../JSON/buildings.json');
    assert(response.ok, 'Failed to load buildings.json');

    const data = await response.json();
    assertExists(data, 'Building data should exist');
    assert(Array.isArray(data), 'Building data should be an array');
    assertGreaterThan(data.length, 0, 'Should have buildings');
});

claimStakeConstructionTests.test('Should filter buildings by planet type compatibility', async () => {
    const response = await fetch('../JSON/buildings.json');
    const buildings = await response.json();

    const testPlanetType = 'rock';
    const compatibleBuildings = buildings.filter(building => {
        if (!building.compatiblePlanets) return true; // No restriction
        return building.compatiblePlanets.includes(testPlanetType);
    });

    assert(compatibleBuildings.length > 0, 'Should have compatible buildings for rock planets');
});

claimStakeConstructionTests.test('Should filter buildings by tier requirement', async () => {
    const response = await fetch('../JSON/buildings.json');
    const buildings = await response.json();

    const claimStakeTier = 3;
    const tierCompatibleBuildings = buildings.filter(building => {
        if (!building.minTier) return true;
        return building.minTier <= claimStakeTier;
    });

    assert(tierCompatibleBuildings.length > 0, 'Should have buildings available for tier 3');
});

claimStakeConstructionTests.test('Should calculate slot limits for each tier', () => {
    const tierSlotLimits = {
        1: 4,
        2: 32,
        3: 108,
        4: 256,
        5: 500
    };

    assertEquals(tierSlotLimits[1], 4, 'Tier 1 should have 4 slots');
    assertEquals(tierSlotLimits[2], 32, 'Tier 2 should have 32 slots');
    assertEquals(tierSlotLimits[3], 108, 'Tier 3 should have 108 slots');
    assertEquals(tierSlotLimits[4], 256, 'Tier 4 should have 256 slots');
    assertEquals(tierSlotLimits[5], 500, 'Tier 5 should have 500 slots');
});

claimStakeConstructionTests.test('Should calculate power requirements for each tier', () => {
    const tierPowerBase = {
        1: 100,
        2: 200,
        3: 300,
        4: 400,
        5: 500
    };

    assertEquals(tierPowerBase[1], 100, 'Tier 1 should have 100 base power');
    assertEquals(tierPowerBase[2], 200, 'Tier 2 should have 200 base power');
    assertEquals(tierPowerBase[3], 300, 'Tier 3 should have 300 base power');
    assertEquals(tierPowerBase[4], 400, 'Tier 4 should have 400 base power');
    assertEquals(tierPowerBase[5], 500, 'Tier 5 should have 500 base power');
});

claimStakeConstructionTests.test('Should validate slot usage does not exceed limit', () => {
    const facilityPlan = [
        { slots: 10 },
        { slots: 15 },
        { slots: 8 }
    ];

    const totalSlots = facilityPlan.reduce((sum, building) => sum + (building.slots || 0), 0);
    const slotLimit = 32; // Tier 2

    assertEquals(totalSlots, 33, 'Total slots should be 33');
    assert(totalSlots > slotLimit, 'Should detect slot limit exceeded');
});

claimStakeConstructionTests.test('Should validate power balance', () => {
    const buildings = [
        { powerOutput: 50, powerConsumption: 0 },
        { powerOutput: 0, powerConsumption: 30 },
        { powerOutput: 0, powerConsumption: 15 }
    ];

    const totalPowerOutput = buildings.reduce((sum, b) => sum + (b.powerOutput || 0), 0);
    const totalPowerConsumption = buildings.reduce((sum, b) => sum + (b.powerConsumption || 0), 0);
    const basePower = 200; // Tier 2

    const netPower = basePower + totalPowerOutput - totalPowerConsumption;

    assertEquals(totalPowerOutput, 50, 'Total power output should be 50');
    assertEquals(totalPowerConsumption, 45, 'Total power consumption should be 45');
    assertEquals(netPower, 205, 'Net power should be 205');
    assertGreaterThan(netPower, 0, 'Should have positive power balance');
});

claimStakeConstructionTests.test('Should calculate total construction cost', () => {
    const buildings = [
        {
            constructionCost: { steel: 10, copper: 5 },
            quantity: 2
        },
        {
            constructionCost: { steel: 5, silicon: 3 },
            quantity: 1
        }
    ];

    const totalCost = {};
    buildings.forEach(building => {
        Object.entries(building.constructionCost || {}).forEach(([resource, amount]) => {
            totalCost[resource] = (totalCost[resource] || 0) + (amount * (building.quantity || 1));
        });
    });

    assertEquals(totalCost.steel, 25, 'Steel should be (10*2) + 5 = 25');
    assertEquals(totalCost.copper, 10, 'Copper should be 5*2 = 10');
    assertEquals(totalCost.silicon, 3, 'Silicon should be 3');
});

claimStakeConstructionTests.test('Should calculate crew requirements', () => {
    const buildings = [
        { crewRequired: 5, quantity: 2 },
        { crewRequired: 10, quantity: 1 },
        { crewRequired: 0, quantity: 3 }
    ];

    const totalCrew = buildings.reduce((sum, b) =>
        sum + ((b.crewRequired || 0) * (b.quantity || 1)), 0
    );

    assertEquals(totalCrew, 20, 'Total crew should be (5*2) + 10 = 20');
});

claimStakeConstructionTests.test('Should auto-add Central Hub for each claim stake', () => {
    const claimStakes = [
        { tier: 1, name: 'Stake 1' },
        { tier: 2, name: 'Stake 2' }
    ];

    const centralHubs = claimStakes.map(stake => ({
        name: 'Central Hub',
        tier: stake.tier,
        claimStake: stake.name
    }));

    assertEquals(centralHubs.length, 2, 'Should have 2 central hubs');
    assertEquals(centralHubs[0].tier, 1, 'First hub should be tier 1');
    assertEquals(centralHubs[1].tier, 2, 'Second hub should be tier 2');
});

// =============================================================================
// ANALYTICS TESTS
// =============================================================================

claimStakeAnalyticsTests.test('Should calculate storage capacity correctly', () => {
    const buildings = [
        { storageCapacity: 1000 },
        { storageCapacity: 2000 },
        { storageCapacity: 500 }
    ];

    const totalStorage = buildings.reduce((sum, b) => sum + (b.storageCapacity || 0), 0);
    assertEquals(totalStorage, 3500, 'Total storage should be 3500');
});

claimStakeAnalyticsTests.test('Should identify enabled features', () => {
    const buildings = [
        { enables: ['processing-hub', 'storage-hub'] },
        { enables: ['extraction-hub'] },
        { enables: ['processing-hub'] } // Duplicate
    ];

    const enabledFeatures = new Set();
    buildings.forEach(building => {
        (building.enables || []).forEach(feature => enabledFeatures.add(feature));
    });

    assertEquals(enabledFeatures.size, 3, 'Should have 3 unique features');
    assert(enabledFeatures.has('processing-hub'), 'Should have processing hub');
    assert(enabledFeatures.has('storage-hub'), 'Should have storage hub');
    assert(enabledFeatures.has('extraction-hub'), 'Should have extraction hub');
});

claimStakeAnalyticsTests.test('Should calculate resource production rates', () => {
    const buildings = [
        { produces: { iron: 10 }, quantity: 2 },
        { produces: { iron: 5, copper: 8 }, quantity: 1 }
    ];

    const totalProduction = {};
    buildings.forEach(building => {
        Object.entries(building.produces || {}).forEach(([resource, rate]) => {
            totalProduction[resource] = (totalProduction[resource] || 0) + (rate * (building.quantity || 1));
        });
    });

    assertEquals(totalProduction.iron, 25, 'Iron production should be (10*2) + 5 = 25');
    assertEquals(totalProduction.copper, 8, 'Copper production should be 8');
});

claimStakeAnalyticsTests.test('Should calculate resource consumption rates', () => {
    const buildings = [
        { consumes: { power: 50 }, quantity: 2 },
        { consumes: { power: 30, water: 10 }, quantity: 1 }
    ];

    const totalConsumption = {};
    buildings.forEach(building => {
        Object.entries(building.consumes || {}).forEach(([resource, rate]) => {
            totalConsumption[resource] = (totalConsumption[resource] || 0) + (rate * (building.quantity || 1));
        });
    });

    assertEquals(totalConsumption.power, 130, 'Power consumption should be (50*2) + 30 = 130');
    assertEquals(totalConsumption.water, 10, 'Water consumption should be 10');
});

claimStakeAnalyticsTests.test('Should group buildings by category', async () => {
    const response = await fetch('../JSON/buildings.json');
    const buildings = await response.json();

    const categories = {};
    buildings.forEach(building => {
        const category = building.category || 'Other';
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(building);
    });

    assertExists(categories, 'Categories should exist');
    assert(Object.keys(categories).length > 0, 'Should have at least one category');
});

claimStakeAnalyticsTests.test('Should calculate facility efficiency score', () => {
    const facilityStats = {
        slotsUsed: 80,
        slotLimit: 100,
        powerBalance: 50,
        storageCapacity: 5000,
        productionRate: 100,
        consumptionRate: 80
    };

    const slotEfficiency = (facilityStats.slotsUsed / facilityStats.slotLimit) * 100;
    const powerEfficiency = facilityStats.powerBalance > 0 ? 100 : 0;
    const productionEfficiency = facilityStats.productionRate > facilityStats.consumptionRate ? 100 : 50;

    const overallEfficiency = (slotEfficiency + powerEfficiency + productionEfficiency) / 3;

    assertEquals(slotEfficiency, 80, 'Slot efficiency should be 80%');
    assertEquals(powerEfficiency, 100, 'Power efficiency should be 100%');
    assertEquals(productionEfficiency, 100, 'Production efficiency should be 100%');
    assertGreaterThan(overallEfficiency, 90, 'Overall efficiency should be > 90%');
});

claimStakeAnalyticsTests.test('Should identify resource bottlenecks', () => {
    const production = { iron: 100, copper: 50 };
    const consumption = { iron: 80, copper: 60 };

    const bottlenecks = [];
    Object.keys(consumption).forEach(resource => {
        const prod = production[resource] || 0;
        const cons = consumption[resource];
        if (cons > prod) {
            bottlenecks.push({ resource, deficit: cons - prod });
        }
    });

    assertEquals(bottlenecks.length, 1, 'Should have 1 bottleneck');
    assertEquals(bottlenecks[0].resource, 'copper', 'Copper should be bottleneck');
    assertEquals(bottlenecks[0].deficit, 10, 'Copper deficit should be 10');
});

claimStakeAnalyticsTests.test('Should calculate ROI based on production value', () => {
    const constructionCost = 10000; // Total cost in credits
    const dailyProduction = 500; // Daily production value

    const daysToROI = constructionCost / dailyProduction;

    assertEquals(daysToROI, 20, 'ROI should be 20 days');
    assertGreaterThan(dailyProduction, 0, 'Daily production should be positive');
});

claimStakeAnalyticsTests.test('Should compare multiple facility configurations', () => {
    const configs = [
        { name: 'Config A', cost: 5000, production: 200, slots: 50 },
        { name: 'Config B', cost: 8000, production: 350, slots: 80 },
        { name: 'Config C', cost: 6000, production: 250, slots: 60 }
    ];

    const efficiencyScores = configs.map(config => ({
        name: config.name,
        costEfficiency: config.production / config.cost,
        slotEfficiency: config.production / config.slots
    }));

    assert(efficiencyScores.length === 3, 'Should have 3 efficiency scores');
    assertGreaterThan(efficiencyScores[1].costEfficiency, efficiencyScores[0].costEfficiency,
        'Config B should be more cost efficient than Config A');
});

console.log('✅ ClaimStake Enhanced Tests loaded successfully');
