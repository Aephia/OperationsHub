/**
 * Component Attributes Data
 * Defines how each component type modifies ship stats
 * Based on Star Atlas component system
 */

const ComponentAttributes = {
    // Ship Components (Core systems)
    "Ship Component": {
        "Cargo": {
            "capacities.cargoCapacity": {
                type: "multiplicative",
                baseValue: 1.2,  // +20% base bonus
                multiplicativeValue: 1.2
            }
        },
        "Engine": {
            "travel.subwarpSpeed": {
                type: "multiplicative",
                baseValue: 1.3,
                multiplicativeValue: 1.3
            },
            "travel.warpSpeed": {
                type: "multiplicative",
                baseValue: 1.25,
                multiplicativeValue: 1.25
            },
            "capacities.fuelCapacity": {
                type: "multiplicative",
                baseValue: 2.0,
                multiplicativeValue: 2.0
            }
        },
        "Shields": {
            "combat.shieldPoints": {
                type: "multiplicative",
                baseValue: 1.5,
                multiplicativeValue: 1.5
            },
            "combat.shieldRechargeRate": {
                type: "multiplicative",
                baseValue: 1.3,
                multiplicativeValue: 1.3
            }
        },
        "Armor": {
            "combat.hitPoints": {
                type: "multiplicative",
                baseValue: 1.4,
                multiplicativeValue: 1.4
            }
        },
        "Reactor": {
            "combat.shieldRechargeRate": {
                type: "multiplicative",
                baseValue: 1.2,
                multiplicativeValue: 1.2
            },
            "capacities.fuelCapacity": {
                type: "multiplicative",
                baseValue: 1.5,
                multiplicativeValue: 1.5
            }
        },
        "Scanner": {
            "scanning.scanPower": {
                type: "multiplicative",
                baseValue: 1.4,
                multiplicativeValue: 1.4
            },
            "scanning.scanCoolDown": {
                type: "multiplicative",
                baseValue: 0.8,  // Reduces cooldown
                multiplicativeValue: 0.8
            }
        }
    },

    // Ship Modules (Additional systems)
    "Ship Module": {
        "Cargo Extension": {
            "capacities.cargoCapacity": {
                type: "additive",
                baseValue: 100,
                additiveValue: 100
            }
        },
        "Fuel Tank": {
            "capacities.fuelCapacity": {
                type: "additive",
                baseValue: 200,
                additiveValue: 200
            }
        },
        "Ammo Storage": {
            "capacities.ammoCapacity": {
                type: "additive",
                baseValue: 50,
                additiveValue: 50
            }
        }
    },

    // Ship Weapons
    "Ship Weapons": {
        "Kinetic": {
            "combat.damage": {
                type: "additive",
                baseValue: 25,
                additiveValue: 25
            },
            "combat.damageRange": {
                type: "multiplicative",
                baseValue: 1.1,
                multiplicativeValue: 1.1
            }
        },
        "Energy": {
            "combat.damage": {
                type: "additive",
                baseValue: 30,
                additiveValue: 30
            },
            "combat.hitChance": {
                type: "additive",
                baseValue: 5,
                additiveValue: 5
            }
        },
        "EMP": {
            "combat.damage": {
                type: "additive",
                baseValue: 20,
                additiveValue: 20
            }
        },
        "Missile": {
            "combat.missilePower": {
                type: "additive",
                baseValue: 40,
                additiveValue: 40
            }
        }
    },

    // Countermeasures
    "Countermeasures": {
        "Decoy": {
            "combat.hitChance": {
                type: "additive",
                baseValue: -10,  // Negative = reduces enemy hit chance
                additiveValue: -10
            }
        },
        "Flare": {
            "combat.hitChance": {
                type: "additive",
                baseValue: -8,
                additiveValue: -8
            }
        }
    },

    // Drones
    "Drones": {
        "Combat Drone": {
            "combat.damage": {
                type: "additive",
                baseValue: 15,
                additiveValue: 15
            }
        },
        "Repair Drone": {
            "repair.repairRate": {
                type: "additive",
                baseValue: 10,
                additiveValue: 10
            }
        },
        "Scanner Drone": {
            "scanning.scanPower": {
                type: "multiplicative",
                baseValue: 1.2,
                multiplicativeValue: 1.2
            }
        }
    }
};

/**
 * Sample ship configurations
 * These represent different component loadouts
 */
const SampleConfigurations = {
    "Tier One": {
        name: "Tier One",
        tier: "T1",
        components: {
            "Ship Component": {
                "Cargo": "cargo-m-t1",
                "Engine": "engine-m-t1"
            }
        }
    },
    "Tier Two": {
        name: "Tier Two",
        tier: "T2",
        components: {
            "Ship Component": {
                "Cargo": "cargo-m-t2",
                "Engine": "engine-m-t2",
                "Shields": "shields-m-t2"
            }
        }
    },
    "Tier Three": {
        name: "Tier Three",
        tier: "T3",
        components: {
            "Ship Component": {
                "Cargo": "cargo-m-t3",
                "Engine": "engine-m-t3",
                "Shields": "shields-m-t3",
                "Armor": "armor-m-t3"
            }
        }
    },
    "Combat Build": {
        name: "Combat Build",
        tier: "T2",
        components: {
            "Ship Component": {
                "Engine": "engine-m-t2",
                "Shields": "shields-m-t2",
                "Armor": "armor-m-t2"
            },
            "Ship Weapons": {
                "Kinetic": ["kinetic-m-t2", "kinetic-m-t2"],
                "Energy": "energy-m-t2"
            }
        }
    },
    "Cargo Hauler": {
        name: "Cargo Hauler",
        tier: "T2",
        components: {
            "Ship Component": {
                "Cargo": "cargo-m-t2",
                "Engine": "engine-m-t2"
            },
            "Ship Module": {
                "Cargo Extension": ["cargo-ext-m-t2", "cargo-ext-m-t2"]
            }
        }
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ComponentAttributes = ComponentAttributes;
    window.SampleConfigurations = SampleConfigurations;
}
