/**
 * JSON Manager - Upload and Download JSON Files
 *
 * Allows users to:
 * - Upload custom JSON files to override defaults
 * - Download existing JSON files for backup/editing
 * - Reset to default files
 *
 * Uses localStorage to store custom JSON files
 */

(function() {
    'use strict';

    // List of JSON files that can be managed
    const JSON_FILES = [
        { name: 'recipes.json', path: 'JSON/recipes.json', size: '4.7 MB', description: '247 manufacturing recipes' },
        { name: 'buildings.json', path: 'JSON/buildings.json', size: '2.4 MB', description: '100+ building types' },
        { name: 'planets.json', path: 'JSON/planets.json', size: '14 MB', description: '3,901 planets' },
        { name: 'resources.json', path: 'JSON/resources.json', size: '864 KB', description: '93 resource types' },
        { name: 'craftingHabBuildings.json', path: 'JSON/craftingHabBuildings.json', size: '8.3 KB', description: 'Hub buildings' },
        { name: 'ship-formulas.json', path: 'JSON/ship-formulas.json', size: '5.6 MB', description: 'Ship formulas' },
        { name: 'ship-components.json', path: 'JSON/ship-components.json', size: 'Small', description: 'Ship components manifest' },
        { name: 'ship-components-part1.json', path: 'JSON/ship-components-part1.json', size: '7.3 MB', description: 'Ship components (part 1)' },
        { name: 'ship-components-part2.json', path: 'JSON/ship-components-part2.json', size: '~7 MB', description: 'Ship components (part 2)' },
        { name: 'resource_tier_analysis.json', path: 'JSON/resource_tier_analysis.json', size: '38 KB', description: 'Resource tier analysis' },
        { name: 'resource_type_tier_lookup.json', path: 'JSON/resource_type_tier_lookup.json', size: '2.4 KB', description: 'Resource tier lookup' }
    ];

    // LocalStorage prefix for custom JSON files
    const STORAGE_PREFIX = 'custom_json_';

    const JsonManager = {
        /**
         * Populate the file list in the modal
         */
        populateFileList() {
            const fileGrid = document.getElementById('fileGrid');
            if (!fileGrid) return;

            fileGrid.innerHTML = '';

            JSON_FILES.forEach(file => {
                const isCustom = this.hasCustomFile(file.name);

                const fileCard = document.createElement('div');
                fileCard.className = 'file-card' + (isCustom ? ' custom-file' : '');

                fileCard.innerHTML = `
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-description">${file.description}</div>
                        <div class="file-size">Size: ${file.size}</div>
                        ${isCustom ? '<div class="custom-badge">✨ Custom</div>' : ''}
                    </div>
                    <div class="file-actions">
                        <button class="download-btn" data-filename="${file.name}" data-path="${file.path}">
                            ⬇️ Download
                        </button>
                        ${isCustom ? `
                            <button class="reset-file-btn" data-filename="${file.name}">
                                🔄 Reset
                            </button>
                        ` : ''}
                    </div>
                `;

                fileGrid.appendChild(fileCard);
            });

            // Attach event listeners
            this.attachFileCardListeners();
        },

        /**
         * Attach event listeners to file cards
         */
        attachFileCardListeners() {
            // Download buttons
            document.querySelectorAll('.download-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const filename = e.target.getAttribute('data-filename');
                    const path = e.target.getAttribute('data-path');
                    this.downloadFile(filename, path);
                });
            });

            // Reset individual file buttons
            document.querySelectorAll('.reset-file-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const filename = e.target.getAttribute('data-filename');
                    this.resetFile(filename);
                });
            });

            // Upload file selection
            const selectFileBtn = document.getElementById('selectFileBtn');
            const fileInput = document.getElementById('jsonFileInput');

            if (selectFileBtn && fileInput) {
                selectFileBtn.addEventListener('click', () => {
                    fileInput.click();
                });

                fileInput.addEventListener('change', (e) => {
                    if (e.target.files.length > 0) {
                        const file = e.target.files[0];
                        this.uploadFile(file);
                    }
                });
            }

            // Reset all button
            const resetAllBtn = document.getElementById('resetAllBtn');
            if (resetAllBtn) {
                resetAllBtn.addEventListener('click', () => {
                    this.resetAllFiles();
                });
            }
        },

        /**
         * Download a file
         */
        async downloadFile(filename, path) {
            try {
                // Check if there's a custom version first
                const customData = this.getCustomFile(filename);

                let data;
                if (customData) {
                    // Download custom version
                    data = customData;
                } else {
                    // Download original file
                    const response = await fetch(path);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${filename}`);
                    }
                    data = await response.text();
                }

                // Create download
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                this.showStatus(`✅ Downloaded ${filename}`, 'success');
            } catch (error) {
                console.error('Download error:', error);
                this.showStatus(`❌ Failed to download ${filename}: ${error.message}`, 'error');
            }
        },

        /**
         * Upload a custom file
         */
        uploadFile(file) {
            const reader = new FileReader();
            const selectedFileNameSpan = document.getElementById('selectedFileName');

            reader.onload = (e) => {
                try {
                    // Validate JSON
                    const content = e.target.result;
                    JSON.parse(content); // This will throw if invalid

                    // Store in localStorage
                    const key = STORAGE_PREFIX + file.name;
                    localStorage.setItem(key, content);

                    if (selectedFileNameSpan) {
                        selectedFileNameSpan.textContent = `Selected: ${file.name}`;
                    }

                    this.showStatus(`✅ Uploaded ${file.name} successfully! Refresh the page for changes to take effect.`, 'success');

                    // Refresh file list to show custom badge
                    setTimeout(() => {
                        this.populateFileList();
                    }, 1000);

                } catch (error) {
                    console.error('Upload error:', error);
                    this.showStatus(`❌ Invalid JSON file: ${error.message}`, 'error');
                }
            };

            reader.onerror = () => {
                this.showStatus(`❌ Failed to read file`, 'error');
            };

            reader.readAsText(file);
        },

        /**
         * Reset a single file to default
         */
        resetFile(filename) {
            if (confirm(`Are you sure you want to reset ${filename} to default? This will remove your custom upload.`)) {
                const key = STORAGE_PREFIX + filename;
                localStorage.removeItem(key);

                this.showStatus(`✅ Reset ${filename} to default. Refresh the page for changes to take effect.`, 'success');
                this.populateFileList();
            }
        },

        /**
         * Reset all files to defaults
         */
        resetAllFiles() {
            if (confirm('Are you sure you want to reset ALL files to defaults? This will remove all custom uploads.')) {
                // Remove all custom JSON files from localStorage
                JSON_FILES.forEach(file => {
                    const key = STORAGE_PREFIX + file.name;
                    localStorage.removeItem(key);
                });

                this.showStatus('✅ All files reset to default. Refresh the page for changes to take effect.', 'success');
                this.populateFileList();
            }
        },

        /**
         * Check if a file has a custom version
         */
        hasCustomFile(filename) {
            const key = STORAGE_PREFIX + filename;
            return localStorage.getItem(key) !== null;
        },

        /**
         * Get custom file content
         */
        getCustomFile(filename) {
            const key = STORAGE_PREFIX + filename;
            return localStorage.getItem(key);
        },

        /**
         * Show status message
         */
        showStatus(message, type) {
            const statusDiv = document.getElementById('uploadStatus');
            if (statusDiv) {
                statusDiv.textContent = message;
                statusDiv.className = 'upload-status ' + type;

                // Clear after 5 seconds
                setTimeout(() => {
                    statusDiv.textContent = '';
                    statusDiv.className = 'upload-status';
                }, 5000);
            }
        },

        /**
         * Get file data (custom or default)
         * This is a helper method for DataLoader to use
         */
        async getFileData(filename, defaultPath) {
            // Check for custom file first
            const customData = this.getCustomFile(filename);
            if (customData) {
                console.log(`[JsonManager] Using custom ${filename}`);
                return JSON.parse(customData);
            }

            // Fall back to default file
            console.log(`[JsonManager] Using default ${filename}`);
            const response = await fetch(defaultPath);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}`);
            }
            return await response.json();
        }
    };

    // Expose to window
    window.JsonManager = JsonManager;
})();
