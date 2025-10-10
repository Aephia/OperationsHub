/**
 * Attributes Panel Module
 * Handles the UI display of ship attributes and their effects
 */

class AttributesPanel {
    constructor(shipExplorer) {
        this.explorer = shipExplorer;
        this.attributeManager = new AttributeManager(shipExplorer);
        this.activePanel = null;
    }

    /**
     * Show attributes panel for a specific ship configuration
     */
    showAttributesPanel(ship, configName) {
        if (!ship || !configName) return;

        const attributes = this.attributeManager.getConfigurationAttributes(ship, configName);
        if (!attributes || attributes.length === 0) {
            this.showEmptyPanel(ship, configName);
            return;
        }

        this.renderPanel(ship, configName, attributes);
    }

    /**
     * Render the attributes panel
     */
    renderPanel(ship, configName, attributes) {
        if (this.activePanel) {
            this.hidePanel();
        }

        const overlay = document.createElement('div');
        overlay.className = 'attributes-overlay';

        const panel = document.createElement('div');
        panel.className = 'attributes-panel';

        const shipLabel = this.explorer.getShipDisplayName(ship);

        panel.innerHTML = `
            <div class="attributes-header">
                <h2>Configuration Attributes</h2>
                <button type="button" class="close-button">&times;</button>
            </div>
            <div class="attributes-body">
                <div class="attributes-summary">
                    <p><strong>Ship:</strong> ${this.escapeHtml(shipLabel)}</p>
                    <p><strong>Configuration:</strong> ${this.escapeHtml(configName)}</p>
                </div>
                <div class="attributes-list">
                    ${this.renderAttributesList(attributes)}
                </div>
            </div>
        `;

        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        this.activePanel = overlay;

        this.setupEventListeners(overlay, panel);
    }

    /**
     * Render the list of attributes
     */
    renderAttributesList(attributes) {
        if (attributes.length === 0) {
            return '<p class="empty-message">No attributes found for this configuration.</p>';
        }

        let html = '<table class="attributes-table"><thead><tr>';
        html += '<th>Attribute</th>';
        html += '<th>Type</th>';
        html += '<th>Additive</th>';
        html += '<th>Multiplier</th>';
        html += '<th>Components</th>';
        html += '</tr></thead><tbody>';

        attributes.forEach(attr => {
            const multiplierDisplay = ((attr.totalMultiplier - 1) * 100).toFixed(1) + '%';
            const additiveDisplay = attr.totalAdditive.toFixed(2);

            html += '<tr>';
            html += `<td class="attr-name" title="${this.escapeHtml(this.attributeManager.getAttributeDescription(attr.name))}">${this.escapeHtml(attr.name)}</td>`;
            html += `<td class="attr-type">${this.escapeHtml(attr.type)}</td>`;
            html += `<td class="attr-additive">${additiveDisplay}</td>`;
            html += `<td class="attr-multiplier">${multiplierDisplay}</td>`;
            html += `<td class="attr-components">
                <button type="button" class="view-components-btn" data-attr="${this.escapeHtml(attr.name)}">
                    View (${attr.components.length})
                </button>
            </td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    }

    /**
     * Show component breakdown for an attribute
     */
    showComponentBreakdown(attributeName, attributes) {
        const attr = attributes.find(a => a.name === attributeName);
        if (!attr) return;

        const breakdownHtml = `
            <div class="component-breakdown">
                <h3>${this.escapeHtml(attributeName)} - Component Breakdown</h3>
                <table class="breakdown-table">
                    <thead>
                        <tr>
                            <th>Component</th>
                            <th>Additive</th>
                            <th>Multiplier</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${attr.components.map(comp => `
                            <tr>
                                <td>${this.escapeHtml(comp.name)}</td>
                                <td>${comp.additive.toFixed(2)}</td>
                                <td>${(comp.multiplier * 100).toFixed(1)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td><strong>Total</strong></td>
                            <td><strong>${attr.totalAdditive.toFixed(2)}</strong></td>
                            <td><strong>${((attr.totalMultiplier - 1) * 100).toFixed(1)}%</strong></td>
                        </tr>
                    </tfoot>
                </table>
                <button type="button" class="back-to-attributes">Back to Attributes</button>
            </div>
        `;

        const panel = this.activePanel.querySelector('.attributes-panel');
        const body = panel.querySelector('.attributes-body');
        body.innerHTML = breakdownHtml;

        // Setup back button
        body.querySelector('.back-to-attributes').addEventListener('click', () => {
            body.innerHTML = `
                <div class="attributes-summary">
                    <p><strong>Ship:</strong> ${body.dataset.shipLabel}</p>
                    <p><strong>Configuration:</strong> ${body.dataset.configName}</p>
                </div>
                <div class="attributes-list">
                    ${this.renderAttributesList(attributes)}
                </div>
            `;
            this.setupAttributeListeners(attributes);
        });
    }

    /**
     * Setup event listeners for the panel
     */
    setupEventListeners(overlay, panel) {
        const close = () => this.hidePanel();

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                close();
            }
        });

        const closeBtn = panel.querySelector('.close-button');
        if (closeBtn) {
            closeBtn.addEventListener('click', close);
        }

        panel.addEventListener('click', event => event.stopPropagation());

        // Setup component view buttons
        this.setupAttributeListeners();
    }

    /**
     * Setup listeners for attribute list interactions
     */
    setupAttributeListeners(attributes = null) {
        if (!this.activePanel) return;

        this.activePanel.querySelectorAll('.view-components-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const attrName = e.target.dataset.attr;
                const attrs = attributes || this.getCurrentAttributes();
                this.showComponentBreakdown(attrName, attrs);
            });
        });
    }

    /**
     * Get current attributes from cache
     */
    getCurrentAttributes() {
        // This would need to be stored when showing the panel
        // For now, return empty array
        return [];
    }

    /**
     * Show empty panel message
     */
    showEmptyPanel(ship, configName) {
        if (this.activePanel) {
            this.hidePanel();
        }

        const overlay = document.createElement('div');
        overlay.className = 'attributes-overlay';

        const panel = document.createElement('div');
        panel.className = 'attributes-panel';

        const shipLabel = this.explorer.getShipDisplayName(ship);

        panel.innerHTML = `
            <div class="attributes-header">
                <h2>Configuration Attributes</h2>
                <button type="button" class="close-button">&times;</button>
            </div>
            <div class="attributes-body">
                <div class="attributes-summary">
                    <p><strong>Ship:</strong> ${this.escapeHtml(shipLabel)}</p>
                    <p><strong>Configuration:</strong> ${this.escapeHtml(configName)}</p>
                </div>
                <div style="padding: 20px; background: rgba(79, 172, 254, 0.1); border-radius: 8px; margin-top: 20px;">
                    <h3 style="margin-bottom: 10px;">💡 How to View Stat Details</h3>
                    <p style="line-height: 1.6; margin-bottom: 10px;">
                        To see detailed component contributions and attribute effects for each stat:
                    </p>
                    <ol style="line-height: 1.8; margin-left: 20px;">
                        <li>Look at the comparison table below</li>
                        <li>Find a stat row you're interested in (Cargo Capacity, Warp Speed, etc.)</li>
                        <li><strong>Click on any modified stat value</strong> (the colored cells with percentage changes)</li>
                        <li>A detailed breakdown will show all component contributions, multipliers, and additive effects</li>
                    </ol>
                    <p style="margin-top: 15px; color: rgba(255, 255, 255, 0.7);">
                        <em>Stat cells that show percentage changes are clickable!</em>
                    </p>
                </div>
            </div>
        `;

        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        this.activePanel = overlay;

        this.setupEventListeners(overlay, panel);
    }

    /**
     * Hide the attributes panel
     */
    hidePanel() {
        if (this.activePanel && this.activePanel.parentNode) {
            this.activePanel.parentNode.removeChild(this.activePanel);
        }
        this.activePanel = null;
    }

    /**
     * Escape HTML for safe rendering
     */
    escapeHtml(text) {
        if (text === null || text === undefined) return '';
        return text.toString().replace(/[&<>"']/g, (char) => {
            switch (char) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case '\'': return '&#39;';
                default: return char;
            }
        });
    }

    /**
     * Add attributes button to comparison table
     */
    addAttributesButton(ship, configName, cellElement) {
        if (!configName) return;

        const button = document.createElement('button');
        button.className = 'show-attributes-btn';
        button.textContent = 'View Attributes';
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showAttributesPanel(ship, configName);
        });

        cellElement.appendChild(button);
    }
}
