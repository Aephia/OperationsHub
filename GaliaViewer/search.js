// Search Manager for GaliaViewer - Handle star/planet search functionality
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { GlobalState } from './state.js';

export class SearchManager {
    constructor() {
        this.setupSearch();
    }

    // Setup search functionality
    setupSearch() {
        const searchBox = document.getElementById('searchBox');
        const searchResults = document.getElementById('searchResults');

        if (!searchBox || !searchResults) {
            console.warn('Search elements not found');
            return;
        }

        // Handle search input
        searchBox.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchBox.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });

        // Keep search results open when clicking inside search box
        searchBox.addEventListener('click', (e) => {
            e.stopPropagation();
            if (searchBox.value.trim()) {
                this.handleSearch(searchBox.value);
            }
        });

        console.log('✅ Search event listeners setup complete');
    }

    // Handle search query
    handleSearch(query) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        const trimmedQuery = query.trim().toLowerCase();

        if (!trimmedQuery) {
            searchResults.style.display = 'none';
            return;
        }

        // Search through all systems and planets
        const results = [];
        const systems = window.planetData?.mapData || [];

        systems.forEach((system, systemIndex) => {
            // Check if system name matches
            const systemName = (system.name || system.key || '').toLowerCase();
            if (systemName.includes(trimmedQuery)) {
                results.push({
                    type: 'star',
                    name: system.name || system.key,
                    system: system,
                    systemIndex: systemIndex,
                    matchScore: systemName.startsWith(trimmedQuery) ? 2 : 1
                });
            }

            // Check planets in this system
            if (system.planets && Array.isArray(system.planets)) {
                system.planets.forEach((planet, planetIndex) => {
                    const planetName = (planet.name || '').toLowerCase();
                    if (planetName.includes(trimmedQuery)) {
                        results.push({
                            type: 'planet',
                            name: planet.name,
                            planet: planet,
                            system: system,
                            systemIndex: systemIndex,
                            planetIndex: planetIndex,
                            matchScore: planetName.startsWith(trimmedQuery) ? 2 : 1
                        });
                    }
                });
            }
        });

        // Sort results: exact matches first, then partial matches, then alphabetically
        results.sort((a, b) => {
            if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;
            return a.name.localeCompare(b.name);
        });

        // Display results
        this.displaySearchResults(results, trimmedQuery);
    }

    // Display search results
    displaySearchResults(results, query) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div style="padding: 15px; text-align: center; color: #ccc; font-size: 12px;">
                    No results found for "${query}"
                </div>
            `;
            searchResults.style.display = 'block';
            return;
        }

        // Limit to 20 results for performance
        const displayResults = results.slice(0, 20);

        searchResults.innerHTML = displayResults.map((result, index) => {
            const icon = result.type === 'star' ? '⭐' : '🪐';
            const typeLabel = result.type === 'star' ? 'Star System' : 'Planet';
            const systemInfo = result.type === 'planet' ? ` (${result.system.name || result.system.key})` : '';

            return `
                <div class="search-result-item" data-index="${index}"
                     style="padding: 10px 15px; cursor: pointer; border-bottom: 1px solid rgba(255, 255, 255, 0.1); transition: background 0.2s;"
                     onmouseover="this.style.background='rgba(76, 175, 80, 0.2)'"
                     onmouseout="this.style.background='transparent'">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 16px;">${icon}</span>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; color: #fff; font-size: 13px;">${result.name}</div>
                            <div style="font-size: 11px; color: #aaa; margin-top: 2px;">${typeLabel}${systemInfo}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (results.length > 20) {
            searchResults.innerHTML += `
                <div style="padding: 10px; text-align: center; color: #888; font-size: 11px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                    Showing 20 of ${results.length} results
                </div>
            `;
        }

        searchResults.style.display = 'block';

        // Add click handlers to results
        const resultItems = searchResults.querySelectorAll('.search-result-item');
        resultItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.selectSearchResult(displayResults[index]);
            });
        });
    }

    // Select a search result and center camera on it
    selectSearchResult(result) {
        const searchBox = document.getElementById('searchBox');
        const searchResults = document.getElementById('searchResults');

        // Hide search results
        if (searchResults) searchResults.style.display = 'none';
        if (searchBox) searchBox.value = '';

        console.log('Selected:', result.type, result.name, 'Index:', result.systemIndex);

        // Center on the selected object
        if (result.type === 'star') {
            this.centerOnStar(result.system, result.systemIndex);
        } else if (result.type === 'planet') {
            this.centerOnPlanet(result.planet, result.system, result.systemIndex, result.planetIndex);
        }
    }

    // Center camera on a star system
    centerOnStar(system, systemIndex) {
        if (!window.galiaViewer || !window.galiaViewer.sceneManager) {
            console.error('❌ GaliaViewer not initialized');
            return;
        }

        const sceneManager = window.galiaViewer.sceneManager;
        const systemContainers = sceneManager.systemContainers;

        if (!systemContainers || !Array.isArray(systemContainers)) {
            console.error('❌ System containers not available');
            return;
        }

        if (systemIndex < 0 || systemIndex >= systemContainers.length) {
            console.error('❌ Invalid system index:', systemIndex, 'Total systems:', systemContainers.length);
            return;
        }

        const container = systemContainers[systemIndex];
        if (!container || !container.position) {
            console.error('❌ Invalid container at index:', systemIndex);
            return;
        }

        const position = container.position.clone();

        console.log('✅ Centering on star:', system.name, 'at position:', position);

        // Animate camera to position
        sceneManager.animateCameraToPosition(
            position.x,
            position.y,
            position.z + 50,
            position.x,
            position.y,
            position.z
        );

        // Show system info
        if (window.galiaViewer.uiManager) {
            window.galiaViewer.uiManager.showClickStatus('star', { system: system });
        }

        // Show connections for this system
        if (window.galiaViewer.eventHandlers) {
            GlobalState.lastClickedSystem = container;
            GlobalState.lastClickedSystemData = system;
            window.galiaViewer.eventHandlers.restoreAllSystems();
            window.galiaViewer.connectionManager.showSystemConnections(container, system);
        }
    }

    // Center camera on a planet
    centerOnPlanet(planet, system, systemIndex, planetIndex) {
        if (!window.galiaViewer || !window.galiaViewer.sceneManager) {
            console.error('❌ GaliaViewer not initialized');
            return;
        }

        const sceneManager = window.galiaViewer.sceneManager;
        const systemContainers = sceneManager.systemContainers;

        if (!systemContainers || !Array.isArray(systemContainers)) {
            console.error('❌ System containers not available');
            return;
        }

        if (systemIndex < 0 || systemIndex >= systemContainers.length) {
            console.error('❌ Invalid system index:', systemIndex, 'Total systems:', systemContainers.length);
            return;
        }

        const container = systemContainers[systemIndex];
        if (!container || !container.children) {
            console.error('❌ Invalid container or children at index:', systemIndex);
            return;
        }

        // Find planet mesh
        const planets = container.children.filter(child =>
            child.userData && child.userData.type === 'planet'
        );

        if (planetIndex < 0 || planetIndex >= planets.length) {
            console.error('❌ Invalid planet index:', planetIndex, 'Total planets:', planets.length);
            return;
        }

        const planetMesh = planets[planetIndex];
        const worldPosition = new THREE.Vector3();
        planetMesh.getWorldPosition(worldPosition);

        console.log('✅ Centering on planet:', planet.name, 'at position:', worldPosition);

        // Animate camera to planet position
        sceneManager.animateCameraToPosition(
            worldPosition.x,
            worldPosition.y,
            worldPosition.z + 20,
            worldPosition.x,
            worldPosition.y,
            worldPosition.z
        );

        // Show planet info
        if (window.galiaViewer.uiManager) {
            window.galiaViewer.uiManager.showClickStatus('planet', { planet: planet, parentSystem: system });
        }

        // Show parent system connections
        if (window.galiaViewer.eventHandlers) {
            GlobalState.lastClickedSystem = container;
            GlobalState.lastClickedSystemData = system;
            window.galiaViewer.eventHandlers.restoreAllSystems();
            window.galiaViewer.connectionManager.showSystemConnections(container, system);
        }
    }
}
