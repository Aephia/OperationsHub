/**
 * Conquest Manager - Handles C4 Regions conquest simulation
 * Based on Star Atlas C4 Regions rules
 */

class ConquestManager {
    constructor(systems, regions, warpLanes) {
        this.systems = systems;
        this.regions = regions;
        this.warpLanes = warpLanes;
        this.attackingFaction = null;
        this.conquestState = new Map(); // systemId -> faction
        this.regionStatus = new Map(); // regionId -> {status, faction, corePercent}

        // Initialize conquest state with current owners
        this.systems.forEach(sys => {
            this.conquestState.set(sys.id, sys.controllingFaction);
        });

        this.updateAllRegionStatus();
    }

    setAttackingFaction(faction) {
        this.attackingFaction = faction;
        console.log('[ConquestManager] Attacking faction set to:', faction);
    }

    /**
     * Conquer a system for the attacking faction
     */
    conquerSystem(system) {
        if (!this.attackingFaction) {
            console.warn('[ConquestManager] No attacking faction set');
            return {success: false, reason: 'No attacking faction selected'};
        }

        // Check if the system's region is SAFE and owned by a different faction
        const region = this.regions.find(r => r.id === system.regionId);
        if (region) {
            const regionStatus = this.regionStatus.get(region.id);

            if (regionStatus && regionStatus.status === 'SAFE' && regionStatus.faction !== this.attackingFaction) {
                console.warn(`[ConquestManager] Cannot attack ${system.name} - it's in a SAFE region owned by ${regionStatus.faction}`);
                return {success: false, reason: `Safe regions cannot be attacked! This region is protected by ${regionStatus.faction}.`};
            }
        }

        const currentFaction = this.conquestState.get(system.id) || system.controllingFaction;

        // If already owned by attacking faction, reset to initial controlling faction (toggle off)
        if (currentFaction === this.attackingFaction) {
            const resetFaction = system.initialControllingFaction || system.controllingFaction;
            this.conquestState.set(system.id, resetFaction);
            system.controllingFaction = resetFaction;
            console.log(`[ConquestManager] ${system.name} reset to ${resetFaction} (was ${this.attackingFaction})`);

            // Recalculate region status
            this.updateAllRegionStatus();

            return {success: true, oldFaction: this.attackingFaction, newFaction: resetFaction, toggled: true};
        }

        // Update system ownership to attacking faction
        this.conquestState.set(system.id, this.attackingFaction);
        system.controllingFaction = this.attackingFaction;

        console.log(`[ConquestManager] ${system.name} conquered by ${this.attackingFaction} (was ${currentFaction})`);

        // Recalculate region status
        this.updateAllRegionStatus();

        return {success: true, oldFaction: currentFaction, newFaction: this.attackingFaction, toggled: false};
    }

    /**
     * Reset a system to its initial controlling faction
     */
    resetSystem(system) {
        const resetFaction = system.initialControllingFaction || system.controllingFaction;
        this.conquestState.set(system.id, resetFaction);
        system.controllingFaction = resetFaction;
        this.updateAllRegionStatus();
    }

    /**
     * Reset all systems to initial controlling state
     */
    resetAll() {
        this.systems.forEach(sys => {
            // Reset to initial controlling faction (which may be "Neutral" even for UST/MUD/ONI territory)
            const resetFaction = sys.initialControllingFaction || sys.controllingFaction;
            this.conquestState.set(sys.id, resetFaction);
            sys.controllingFaction = resetFaction;
        });
        this.updateAllRegionStatus();
        console.log('[ConquestManager] All systems reset to initial controlling state');
    }

    /**
     * Calculate region status based on C4 rules
     */
    calculateRegionStatus(region) {
        const allSystems = region.systems;
        const coreSystems = allSystems.filter(s => s.type === 'King' || s.type === 'Core');
        const kingSystem = allSystems.find(s => s.type === 'King');

        console.log(`[ConquestManager] Calculating status for ${region.id}:`, {
            totalSystems: allSystems.length,
            coreSystems: coreSystems.length,
            hasKing: !!kingSystem,
            kingName: kingSystem?.name
        });

        if (!kingSystem || coreSystems.length === 0) {
            console.log(`[ConquestManager] ${region.id}: No king or no core systems - NEUTRAL`);
            return {status: 'NEUTRAL', faction: null, corePercent: 0, allSystemsPercent: 0};
        }

        // Count ownership
        const ownershipCounts = {};
        coreSystems.forEach(sys => {
            const faction = this.conquestState.get(sys.id) || sys.controllingFaction;
            ownershipCounts[faction] = (ownershipCounts[faction] || 0) + 1;
            console.log(`[ConquestManager]   Core/King system ${sys.name} (${sys.type}) owned by ${faction}`);
        });

        const kingOwner = this.conquestState.get(kingSystem.id) || kingSystem.controllingFaction;

        // The King owner's core count already includes the King system in coreSystems
        // because coreSystems includes both King and Core type systems
        const kingOwnerCoreCount = ownershipCounts[kingOwner] || 0;
        const corePercent = (kingOwnerCoreCount / coreSystems.length) * 100;

        console.log(`[ConquestManager] ${region.id}: King owned by ${kingOwner}, Core control=${kingOwnerCoreCount}/${coreSystems.length} (${corePercent.toFixed(1)}%)`, ownershipCounts);

        // Count all systems ownership
        const allSystemsCounts = {};
        allSystems.forEach(sys => {
            const faction = this.conquestState.get(sys.id) || sys.controllingFaction;
            allSystemsCounts[faction] = (allSystemsCounts[faction] || 0) + 1;
        });

        const kingOwnerAllCount = allSystemsCounts[kingOwner] || 0;
        const allSystemsPercent = (kingOwnerAllCount / allSystems.length) * 100;

        console.log(`[ConquestManager] ${region.id}: Total systems controlled by ${kingOwner}=${kingOwnerAllCount}/${allSystems.length} (${allSystemsPercent.toFixed(1)}%)`, allSystemsCounts);

        // Apply C4 Rules:
        // 1. Must own King System + 60%+ Core Systems to claim ownership
        if (corePercent < 60) {
            console.log(`[ConquestManager] ${region.id}: Core control ${corePercent.toFixed(1)}% < 60% - NEUTRAL`);
            return {status: 'NEUTRAL', faction: null, corePercent, allSystemsPercent};
        }

        // 2. Region is owned by faction that owns King + 60%+ cores
        const owningFaction = kingOwner;
        console.log(`[ConquestManager] ${region.id}: Owned by ${owningFaction} (${corePercent.toFixed(1)}% core control)`);

        // 3. Check if all systems are owned
        const allSystemsOwned = allSystemsPercent === 100;

        if (!allSystemsOwned) {
            // Partially owned - always BORDER
            console.log(`[ConquestManager] ${region.id}: Partially owned (${allSystemsPercent.toFixed(1)}%) - BORDER`);
            return {status: 'BORDER', faction: owningFaction, corePercent, allSystemsPercent, partiallyOwned: true};
        }

        // 4. All systems owned - initially mark as BORDER
        // SAFE status will be determined in second pass (after all regions are calculated)
        console.log(`[ConquestManager] ${region.id}: All systems owned - BORDER (SAFE check in 2nd pass)`);

        return {
            status: 'BORDER',
            faction: owningFaction,
            corePercent,
            allSystemsPercent,
            partiallyOwned: false
        };
    }

    /**
     * Check if a region is Safe (all neighbors owned by same faction)
     */
    isRegionSafe(region, faction) {
        // Get all neighboring regions via warp lanes
        const neighborRegions = new Set();

        region.systems.forEach(sys => {
            // Find warp lanes connected to this system
            this.warpLanes.forEach(lane => {
                let otherSystemId = null;

                if (lane.fromSystemId === sys.id) {
                    otherSystemId = lane.toSystemId;
                } else if (lane.toSystemId === sys.id) {
                    otherSystemId = lane.fromSystemId;
                }

                if (otherSystemId) {
                    const otherSystem = this.systems.find(s => s.id === otherSystemId);
                    if (otherSystem && otherSystem.regionId !== region.id) {
                        neighborRegions.add(otherSystem.regionId);
                    }
                }
            });
        });

        // Check if all neighbor regions are owned by same faction
        for (const neighborRegionId of neighborRegions) {
            const neighborStatus = this.regionStatus.get(neighborRegionId);

            // A region is safe if ALL neighbors are owned by the same faction
            // (status can be BORDER or SAFE, just not NEUTRAL or different faction)
            if (!neighborStatus || neighborStatus.status === 'NEUTRAL' || neighborStatus.faction !== faction) {
                return false; // Not safe if any neighbor is NEUTRAL or owned by different faction
            }
        }

        return true; // Safe if all neighbors are owned by same faction (BORDER or SAFE)
    }

    /**
     * Update status for all regions
     * Two-pass algorithm to handle SAFE status correctly:
     * Pass 1: Calculate BORDER/NEUTRAL based on ownership
     * Pass 2: Upgrade BORDER to SAFE if all neighbors are owned by same faction
     */
    updateAllRegionStatus() {
        // Pass 1: Calculate initial status (BORDER or NEUTRAL)
        this.regions.forEach(region => {
            const status = this.calculateRegionStatus(region);
            this.regionStatus.set(region.id, status);
        });

        // Pass 2: Upgrade BORDER regions to SAFE if conditions are met
        console.log('[ConquestManager] Pass 2: Checking for SAFE regions...');
        this.regions.forEach(region => {
            const status = this.regionStatus.get(region.id);

            // Only consider BORDER regions for upgrade to SAFE
            if (status && status.status === 'BORDER' && !status.partiallyOwned) {
                const isSafe = this.isRegionSafe(region, status.faction);
                if (isSafe) {
                    // Upgrade to SAFE
                    console.log(`[ConquestManager] ${region.id}: Upgraded to SAFE`);
                    this.regionStatus.set(region.id, {
                        ...status,
                        status: 'SAFE'
                    });
                }
            }
        });
    }

    /**
     * Get region status
     */
    getRegionStatus(regionId) {
        return this.regionStatus.get(regionId);
    }

    /**
     * Make a region SAFE by conquering all necessary systems and neighbors
     * This will set all systems in the region and all neighboring regions to the attacking faction
     */
    makeRegionSafe(region) {
        if (!this.attackingFaction) {
            console.warn('[ConquestManager] No attacking faction set');
            return {success: false, reason: 'No attacking faction selected'};
        }

        console.log(`[ConquestManager] Making region ${region.id} SAFE for ${this.attackingFaction}`);

        const systemsConquered = [];
        const regionsAffected = new Set();

        // Step 1: Conquer all systems in the target region
        region.systems.forEach(sys => {
            const currentFaction = this.conquestState.get(sys.id) || sys.controllingFaction;
            if (currentFaction !== this.attackingFaction) {
                this.conquestState.set(sys.id, this.attackingFaction);
                sys.controllingFaction = this.attackingFaction;
                systemsConquered.push(sys.name);
            }
        });

        regionsAffected.add(region.id);

        // Step 2: Find all neighboring regions
        const neighborRegions = new Set();

        region.systems.forEach(sys => {
            this.warpLanes.forEach(lane => {
                let otherSystemId = null;

                if (lane.fromSystemId === sys.id) {
                    otherSystemId = lane.toSystemId;
                } else if (lane.toSystemId === sys.id) {
                    otherSystemId = lane.fromSystemId;
                }

                if (otherSystemId) {
                    const otherSystem = this.systems.find(s => s.id === otherSystemId);
                    if (otherSystem && otherSystem.regionId !== region.id) {
                        neighborRegions.add(otherSystem.regionId);
                    }
                }
            });
        });

        // Step 3: Conquer all systems in all neighboring regions
        neighborRegions.forEach(neighborRegionId => {
            const neighborRegion = this.regions.find(r => r.id === neighborRegionId);
            if (neighborRegion) {
                neighborRegion.systems.forEach(sys => {
                    const currentFaction = this.conquestState.get(sys.id) || sys.controllingFaction;
                    if (currentFaction !== this.attackingFaction) {
                        this.conquestState.set(sys.id, this.attackingFaction);
                        sys.controllingFaction = this.attackingFaction;
                        systemsConquered.push(sys.name);
                    }
                });
                regionsAffected.add(neighborRegionId);
            }
        });

        // Step 4: Update all region statuses
        this.updateAllRegionStatus();

        // Verify the region is now SAFE
        const regionStatus = this.regionStatus.get(region.id);
        const isSafe = regionStatus && regionStatus.status === 'SAFE';

        console.log(`[ConquestManager] Region ${region.id} is now ${regionStatus?.status || 'UNKNOWN'}`);
        console.log(`[ConquestManager] Systems conquered: ${systemsConquered.length}`);
        console.log(`[ConquestManager] Regions affected: ${Array.from(regionsAffected).join(', ')}`);

        return {
            success: true,
            regionId: region.id,
            isSafe,
            systemsConquered,
            regionsAffected: Array.from(regionsAffected),
            status: regionStatus
        };
    }

    /**
     * Get statistics about conquered systems
     */
    getConquestStats() {
        const stats = {
            totalSystems: this.systems.length,
            byFaction: {},
            regions: {
                total: this.regions.length,
                byStatus: {NEUTRAL: 0, BORDER: 0, SAFE: 0},
                byFaction: {}
            }
        };

        // Count systems by faction
        this.systems.forEach(sys => {
            const faction = this.conquestState.get(sys.id) || sys.controllingFaction;
            stats.byFaction[faction] = (stats.byFaction[faction] || 0) + 1;
        });

        // Count regions by status and faction
        this.regionStatus.forEach((status, regionId) => {
            stats.regions.byStatus[status.status]++;

            if (status.faction) {
                if (!stats.regions.byFaction[status.faction]) {
                    stats.regions.byFaction[status.faction] = {BORDER: 0, SAFE: 0};
                }
                stats.regions.byFaction[status.faction][status.status]++;
            }
        });

        return stats;
    }
}

window.ConquestManager = ConquestManager;
