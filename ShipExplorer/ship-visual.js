// ship-visual.js - Ship Explorer visual layer (2026-09-30): hull art, fleet gallery, selected-ship strip,
// ship modal with a 12-frame turntable, sidebar thumbnails and the fleet-overview analytics panel.
// Loaded after app.js; it extends ShipExplorer.prototype and app.js calls these hooks.
(function () {
    'use strict';

    const ART_BASE = '../Images/ships/';
    const SIZE_ORDER = ['XXS', 'XS', 'Small', 'Medium', 'Large', 'Capital', 'Commander', 'Class 8', 'Titan'];
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // ---- hull art manifest (Images/ships/manifest.json, keyed by the record's "Ship Name")
    const ShipArt = {
        manifest: null,
        ready: fetch(ART_BASE + 'manifest.json').then(r => (r.ok ? r.json() : {})).catch(() => ({})).then(m => { ShipArt.manifest = m || {}; return ShipArt.manifest; }),
        entry(ship) { return ShipArt.manifest ? ShipArt.manifest[ship && ship.name] || null : null; },
        hero(ship) { const e = ShipArt.entry(ship); return e ? ART_BASE + e.hero : null; },
        turn(ship) { const e = ShipArt.entry(ship); return e && e.turn && e.frames ? { url: ART_BASE + e.turn, frames: e.frames, size: e.frameSize } : null; },
        isStore(ship) { const e = ShipArt.entry(ship); return !!(e && e.source === 'store'); }
    };
    window.ShipArt = ShipArt;

    const P = ShipExplorer.prototype;

    // Fleet-wide maxima per size tier, per stat path, for the spec-sheet bars.
    P.tierMax = function (sizeTier, path) {
        if (!this._tierMax) this._tierMax = new Map();
        const key = sizeTier + '|' + path.join('.');
        if (!this._tierMax.has(key)) {
            let max = 0;
            this.ships.forEach(s => { if ((s.sizeTier || '') === sizeTier) { const v = this.getPath(s, path); if (typeof v === 'number' && v > max) max = v; } });
            this._tierMax.set(key, max);
        }
        return this._tierMax.get(key);
    };
    P.getPath = function (obj, path) { return path.reduce((o, k) => (o == null ? undefined : o[k]), obj); };

    P.artHTML = function (ship, cls) {
        const url = ShipArt.hero(ship);
        if (url) return `<img class="${cls}${ShipArt.isStore(ship) ? ' store-art' : ''}" src="${url}" alt="" loading="lazy" decoding="async"${ShipArt.isStore(ship) ? ' title="Official store image"' : ''}>`;
        const init = (ship.name || '?').split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
        return `<span class="${cls} no-art" title="No render for this hull yet">${esc(init)}</span>`;
    };

    // ---- gallery: the empty state of the comparison pane
    P.renderGallery = function (wrapper) {
        if (!this.galleryFilter) this.galleryFilter = { size: '', manufacturer: '', spec: '' };
        const g = this.galleryFilter;
        const ships = this.ships.map((ship, index) => ({ ship, index }))
            .filter(({ ship }) => this.matchesSearch(ship))
            .filter(({ ship }) => (!g.size || ship.sizeTier === g.size) && (!g.manufacturer || ship.manufacturer === g.manufacturer) && (!g.spec || ship.spec === g.spec))
            .sort((a, b) => SIZE_ORDER.indexOf(a.ship.sizeTier) - SIZE_ORDER.indexOf(b.ship.sizeTier) || (a.ship.manufacturer || '').localeCompare(b.ship.manufacturer || '') || (a.ship.name || '').localeCompare(b.ship.name || ''));
        const sizes = SIZE_ORDER.filter(s => this.ships.some(x => x.sizeTier === s));
        const mans = [...new Set(this.ships.map(s => s.manufacturer).filter(Boolean))].sort();
        const specs = [...new Set(this.ships.map(s => s.spec).filter(Boolean))].sort();
        const fmt = v => this.formatStatValue(v);

        wrapper.innerHTML = `
            <div class="gallery-head">
                <div class="chips">
                    <button type="button" class="chip${g.size ? '' : ' on'}" data-size="">All sizes</button>
                    ${sizes.map(s => `<button type="button" class="chip${g.size === s ? ' on' : ''}" data-size="${esc(s)}">${esc(s)}</button>`).join('')}
                </div>
                <div class="gallery-selects">
                    <select data-gf="manufacturer"><option value="">All manufacturers</option>${mans.map(m => `<option${g.manufacturer === m ? ' selected' : ''}>${esc(m)}</option>`).join('')}</select>
                    <select data-gf="spec"><option value="">All roles</option>${specs.map(m => `<option${g.spec === m ? ' selected' : ''}>${esc(m)}</option>`).join('')}</select>
                    <span class="gallery-count">${ships.length} of ${this.ships.length} hulls · click a card to add it to the comparison</span>
                </div>
            </div>
            <div class="gallery">
                ${ships.map(({ ship, index }) => `
                <article class="hull-card${this.selectedShips.has(index) ? ' sel' : ''}" data-index="${index}">
                    <div class="hull-art">${this.artHTML(ship, 'hull-img')}<span class="size-chip">${esc(ship.sizeTier || '')}</span></div>
                    <div class="hull-body">
                        <h4>${esc(ship.name)}</h4>
                        <small>${esc(ship.manufacturer || '')}${ship.spec ? ` · ${esc(ship.spec)}` : ''}${ship.class != null ? ` · class ${esc(ship.class)}` : ''}</small>
                        <div class="kstats">
                            <span><b>${fmt(this.getPath(ship, ['stats', 'capacities', 'cargoCapacity']))}</b>cargo</span>
                            <span><b>${fmt(this.getPath(ship, ['stats', 'combat', 'hitPoints']))}</b>hull HP</span>
                            <span><b>${fmt(this.getPath(ship, ['crew', 'required']))}</b>crew</span>
                            <span><b>${fmt(this.getPath(ship, ['stats', 'travel', 'warpSpeed']))}</b>warp</span>
                        </div>
                        <div class="hull-actions"><button type="button" class="hull-btn" data-add="${index}">${this.selectedShips.has(index) ? 'In comparison' : 'Compare'}</button><button type="button" class="hull-btn ghost" data-view="${index}">Ship view</button></div>
                    </div>
                </article>`).join('')}
                ${ships.length ? '' : '<div class="empty-state">No hull matches these filters.</div>'}
            </div>`;

        this.bindGalleryEvents(wrapper);
    };

    // one delegated handler on the comparison pane: gallery chips/cards, the selected strip, ship views
    P.bindGalleryEvents = function (wrapper) {
        if (!wrapper.dataset.galleryBound) {
            wrapper.dataset.galleryBound = '1';
            wrapper.addEventListener('click', (e) => {
                const chip = e.target.closest('[data-size]');
                if (chip) { this.galleryFilter.size = chip.dataset.size; this.renderGallery(wrapper); return; }
                const view = e.target.closest('[data-view]');
                if (view) { e.stopPropagation(); this.openShipModal(this.ships[+view.dataset.view]); return; }
                const add = e.target.closest('[data-add]');
                const card = e.target.closest('.hull-card');
                if (add || card) {
                    const idx = +(add ? add.dataset.add : card.dataset.index);
                    this.toggleShip(idx); this.renderCheckboxes();
                    return;
                }
                const rm = e.target.closest('[data-remove]');
                if (rm) { this.toggleShip(+rm.dataset.remove); this.renderCheckboxes(); return; }
                const sv = e.target.closest('[data-strip-view]');
                if (sv) { this.openShipModal(this.ships[+sv.dataset.stripView]); }
            });
            wrapper.addEventListener('change', (e) => {
                const sel = e.target.closest('[data-gf]');
                if (sel) { this.galleryFilter[sel.dataset.gf] = sel.value; this.renderGallery(wrapper); }
            });
        }
    };

    // ---- selected ships strip above the comparison table
    P.renderSelectedStrip = function (selected) {
        return `<div class="sel-strip">${selected.map(ship => {
            const index = this.ships.indexOf(ship);
            return `<div class="sel-card">${this.artHTML(ship, 'sel-img')}<div class="sel-body"><b>${esc(ship.name)}</b><small>${esc(ship.manufacturer || '')} · ${esc(ship.sizeTier || '')}</small><div><button type="button" class="hull-btn ghost" data-strip-view="${index}">Ship view</button><button type="button" class="hull-btn ghost" data-remove="${index}" title="Remove from comparison">Remove</button></div></div></div>`;
        }).join('')}<div class="sel-hint">Pick more ships in the list or the gallery; up to four configurations per ship compare against its base stats below.</div></div>`;
    };

    // ---- sidebar thumbnail
    P.thumbHTML = function (ship) {
        const url = ShipArt.hero(ship);
        return url ? `<img class="ship-thumb${ShipArt.isStore(ship) ? ' store-art' : ''}" src="${url}" alt="" loading="lazy" decoding="async">` : '<span class="ship-thumb no-art"></span>';
    };

    // ---- ship modal: turntable + spec sheet
    const GROUPS = [
        ['Capacities', [['Cargo', ['stats', 'capacities', 'cargoCapacity']], ['Fuel', ['stats', 'capacities', 'fuelCapacity']], ['Ammo', ['stats', 'capacities', 'ammoCapacity']]]],
        ['Travel', [['Subwarp speed', ['stats', 'travel', 'subwarpSpeed']], ['Warp speed', ['stats', 'travel', 'warpSpeed']], ['Max warp distance', ['stats', 'travel', 'maxWarpDistance']], ['Warp cooldown', ['stats', 'travel', 'warpCoolDown']], ['Warp fuel use', ['stats', 'travel', 'warpFuelConsumption']], ['Subwarp fuel use', ['stats', 'travel', 'subwarpFuelConsumption']]]],
        ['Combat', [['Hit points', ['stats', 'combat', 'hitPoints']], ['Shield points', ['stats', 'combat', 'shieldPoints']], ['Damage', ['stats', 'combat', 'damage']], ['Max AP', ['stats', 'combat', 'maxAp']], ['Hit chance', ['stats', 'combat', 'hitChance']], ['Stealth', ['stats', 'combat', 'stealthPower']]]],
        ['Mining and scanning', [['Asteroid mining rate', ['stats', 'mining', 'asteroidMiningRate']], ['Scan power', ['stats', 'scanning', 'scanPower']], ['SDU per scan', ['stats', 'scanning', 'sduPerScan']], ['Scan cooldown', ['stats', 'scanning', 'scanCoolDown']]]],
        ['Crew and economy', [['Required crew', ['crew', 'required']], ['Passengers', ['crew', 'passengers']], ['Loot rate', ['stats', 'economics', 'lootRate']], ['Respawn time', ['respawnTime']]]]
    ];

    // Spec sheet rows. With a configuration chosen, each row shows the base bar plus a green (gain) or red
    // (loss) segment to the configured value, computed by the same calculator as the comparison table.
    P.specGroupsHTML = function (ship, configName) {
        if (!this._keyByPath) {
            this._keyByPath = new Map();
            (this.statDefinitions || []).forEach(d => this._keyByPath.set(d.path.join('.'), d.key));
        }
        const fmt = v => this.formatStatValue(v);
        const loaded = !!this.componentDataLoaded;
        return GROUPS.map(([title, rows]) => `
            <div class="spec-group"><h4>${esc(title)}</h4>${rows.map(([label, path]) => {
                const base = this.getPath(ship, path);
                const key = this._keyByPath.get(path.join('.'));
                const mod = configName && key && loaded ? this.applyModifiers(ship, configName, key) : base;
                const changed = typeof base === 'number' && typeof mod === 'number' && Math.abs(mod - base) > 1e-9;
                const tierMax = this.tierMax(ship.sizeTier || '', path);
                const max = Math.max(tierMax, typeof mod === 'number' ? mod : 0, typeof base === 'number' ? base : 0) || 1;
                const pb = typeof base === 'number' ? Math.max(1, 100 * base / max) : 0;
                const pm = typeof mod === 'number' ? Math.max(1, 100 * mod / max) : 0;
                let bar, value, cls = '';
                if (changed && mod > base) {
                    cls = ' up';
                    bar = `<i class="base" style="width:${pb.toFixed(1)}%"></i><i class="delta up" style="left:${pb.toFixed(1)}%;width:${(pm - pb).toFixed(1)}%"></i>`;
                } else if (changed) {
                    cls = ' down';
                    bar = `<i class="base" style="width:${pm.toFixed(1)}%"></i><i class="delta down" style="left:${pm.toFixed(1)}%;width:${(pb - pm).toFixed(1)}%"></i>`;
                } else {
                    bar = `<i class="base" style="width:${pb.toFixed(1)}%"></i>`;
                }
                const pct = changed ? this.calculateChange(base, mod) : 0;
                value = changed ? `${fmt(mod)}<small>${pct > 0 ? '+' : ''}${pct.toFixed(1)}%</small>` : fmt(base);
                const tip = changed ? `${label}: base ${fmt(base)} -> ${fmt(mod)} with ${configName}` : `${label}: ${fmt(base)} (best ${ship.sizeTier || ''}: ${fmt(tierMax)})`;
                return `<div class="spec-row${cls}" title="${esc(tip)}"><span>${esc(label)}</span><i class="bar-track spec-bar">${bar}</i><b>${value}</b></div>`;
            }).join('')}</div>`).join('') + (configName && !loaded ? '<p class="muted">Component data is still loading; configured values appear once it has.</p>' : '');
    };

    P.openShipModal = function (ship) {
        if (!ship) return;
        this.closeShipModal();
        if (window.spaceSounds) window.spaceSounds.openPopup();
        const index = this.ships.indexOf(ship);
        const turn = ShipArt.turn(ship);
        const hero = ShipArt.hero(ship);
        const configs = (ship.configurations || []).map(c => c.name).filter(Boolean);
        const configSelect = configs.length ? `
            <label class="cfg-pick">Configuration
                <select data-cfg><option value="">Base stats</option>${configs.map(c => `<option>${esc(c)}</option>`).join('')}</select>
            </label>` : '';

        const overlay = document.createElement('div');
        overlay.className = 'ship-modal-overlay';
        overlay.innerHTML = `
            <div class="ship-modal" role="dialog" aria-label="${esc(ship.name)}">
                <button type="button" class="ship-modal-close" aria-label="Close">&times;</button>
                <div class="ship-modal-visual">
                    ${turn ? `<div class="turntable" data-frames="${turn.frames}" style="background-image:url('${turn.url}')" title="Drag to rotate"></div><div class="turn-hint">Drag to rotate · ${turn.frames} views</div>`
                           : hero ? `<img class="ship-modal-hero${ShipArt.isStore(ship) ? ' store-art' : ''}" src="${hero}" alt=""><div class="turn-hint">${ShipArt.isStore(ship) ? 'Official store image · no turntable for this hull' : ''}</div>` : `<div class="ship-modal-noart">No render for this hull yet</div>`}
                </div>
                <div class="ship-modal-info">
                    <h2>${esc(ship.name)}</h2>
                    <div class="badges"><span class="badge">${esc(ship.manufacturer || '')}</span><span class="badge cat">${esc(ship.sizeTier || '')}</span>${ship.spec ? `<span class="badge">${esc(ship.spec)}</span>` : ''}${ship.class != null ? `<span class="badge">Class ${esc(ship.class)}</span>` : ''}<span class="badge">${ship.configurationCount || (ship.configurations || []).length} configurations</span></div>
                    <div class="cfg-row">${configSelect}<p class="muted cfg-note">Bars compare each stat with the best ${esc(ship.sizeTier || 'ship')} in the data set. Pick a configuration: green is a gain over base, red a loss.</p></div>
                    <div class="spec-groups">${this.specGroupsHTML(ship, '')}</div>
                    <div class="ship-modal-actions"><button type="button" class="hull-btn" data-modal-add="${index}">${this.selectedShips.has(index) ? 'Remove from comparison' : 'Add to comparison'}</button></div>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        this.activeShipModal = overlay;

        const close = () => this.closeShipModal();
        overlay.querySelector('.ship-modal-close').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        overlay.querySelector('[data-modal-add]').addEventListener('click', (e) => {
            this.toggleShip(+e.currentTarget.dataset.modalAdd); this.renderCheckboxes();
            e.currentTarget.textContent = this.selectedShips.has(index) ? 'Remove from comparison' : 'Add to comparison';
        });
        this._modalEsc = (e) => { if (e.key === 'Escape') close(); };
        document.addEventListener('keydown', this._modalEsc);
        const cfg = overlay.querySelector('[data-cfg]');
        if (cfg) cfg.addEventListener('change', () => {
            overlay.querySelector('.spec-groups').innerHTML = this.specGroupsHTML(ship, cfg.value);
            if (window.spaceSounds) window.spaceSounds.select();
        });

        const tt = overlay.querySelector('.turntable');
        if (tt) {
            const F = +tt.dataset.frames || 12;
            let frame = 0, drag = null, timer = null;
            const show = () => { tt.style.backgroundPosition = `${-frame * tt.clientWidth}px 0`; tt.style.backgroundSize = `${F * 100}% 100%`; };
            const step = d => { frame = ((frame + d) % F + F) % F; show(); };
            tt.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, f: frame }; tt.setPointerCapture(e.pointerId); clearInterval(timer); timer = null; });
            tt.addEventListener('pointermove', (e) => { if (!drag) return; const d = Math.round((e.clientX - drag.x) / 28); frame = ((drag.f - d) % F + F) % F; show(); });
            tt.addEventListener('pointerup', () => { drag = null; });
            tt.addEventListener('pointercancel', () => { drag = null; });
            overlay.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
            // slow idle spin (one frame per 500 ms) until the first drag; never runs when reduced motion is on
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => step(1), 500);
            this._modalTimer = timer;
            overlay.addEventListener('pointerdown', () => { if (this._modalTimer) { clearInterval(this._modalTimer); this._modalTimer = null; } }, { once: true });
            requestAnimationFrame(show);
            window.addEventListener('resize', show);
            this._modalResize = show;
        }
    };

    P.closeShipModal = function () {
        if (!this.activeShipModal) return;
        if (window.spaceSounds) window.spaceSounds.closePopup();
        this.activeShipModal.remove(); this.activeShipModal = null;
        if (this._modalTimer) { clearInterval(this._modalTimer); this._modalTimer = null; }
        if (this._modalEsc) { document.removeEventListener('keydown', this._modalEsc); this._modalEsc = null; }
        if (this._modalResize) { window.removeEventListener('resize', this._modalResize); this._modalResize = null; }
    };

    // ---- fleet overview (analytics tab): cheap, base stats only
    P.renderFleetOverview = function () {
        const ships = this.ships.filter(s => s.manufacturer !== 'Custom');
        const bySize = SIZE_ORDER.map(s => ({ label: s, value: ships.filter(x => x.sizeTier === s).length })).filter(r => r.value);
        const specCount = new Map(); ships.forEach(s => specCount.set(s.spec || 'Unknown', (specCount.get(s.spec || 'Unknown') || 0) + 1));
        const bySpec = Array.from(specCount.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
        const bar = (title, note, rows) => {
            const max = Math.max(...rows.map(r => r.value), 1);
            return `<div class="chart"><h4>${esc(title)}</h4>${note ? `<p class="chart-note">${esc(note)}</p>` : ''}<div class="bars">${rows.map(r => `<div class="bar-row" title="${esc(r.label)}: ${esc(r.text || r.value)}"><span class="bar-label">${esc(r.label)}</span><span class="bar-track"><i style="width:${(100 * r.value / max).toFixed(1)}%"></i></span><span class="bar-value">${esc(r.text || r.value)}</span></div>`).join('')}</div></div>`;
        };
        const leaders = (title, path, n) => {
            const rows = ships.map(s => ({ s, v: this.getPath(s, path) })).filter(r => typeof r.v === 'number' && r.v > 0).sort((a, b) => b.v - a.v).slice(0, n || 8)
                .map(r => ({ label: `${r.s.name} (${r.s.sizeTier})`, value: r.v, text: this.formatStatValue(r.v) }));
            return bar(title, '', rows);
        };
        return `
            <div class="analytics-section">
                <h3>Fleet overview</h3>
                <p class="section-note">${ships.length} hulls from ${new Set(ships.map(s => s.manufacturer)).size} manufacturers (the six Custom starbases are left out). Base stats from the ship records; configurations are compared in the Explorer tab.</p>
                <div class="charts-row">
                    ${bar('Hulls by size', '', bySize)}
                    ${bar('Hulls by role', '', bySpec)}
                </div>
                <h4 class="leaders-title">Leaders by base stat</h4>
                <div class="charts-row">
                    ${leaders('Cargo capacity', ['stats', 'capacities', 'cargoCapacity'])}
                    ${leaders('Hit points', ['stats', 'combat', 'hitPoints'])}
                    ${leaders('Asteroid mining rate', ['stats', 'mining', 'asteroidMiningRate'])}
                    ${leaders('Scan power', ['stats', 'scanning', 'scanPower'])}
                    ${leaders('Subwarp speed', ['stats', 'travel', 'subwarpSpeed'])}
                    ${leaders('Max warp distance', ['stats', 'travel', 'maxWarpDistance'])}
                </div>
            </div>`;
    };

    // re-render the gallery/sidebar once the art manifest arrives (first paint may have no images)
    ShipArt.ready.then(() => {
        const app = window.shipExplorer;
        if (!app || !app.ships) return;
        app.renderCheckboxes();
        if (app.selectedShips.size === 0) app.renderComparison();
    });
})();
