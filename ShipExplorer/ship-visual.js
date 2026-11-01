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

    // Stats where less is better: a decrease here is an improvement, and the readout colours it as one.
    const LOWER_IS_BETTER = new Set(['warpCoolDown', 'warpFuelConsumption', 'subwarpFuelConsumption', 'scanCoolDown', 'respawnTime', 'required']);
    const isBetter = (path, to, base) => (LOWER_IS_BETTER.has(path[path.length - 1]) ? to < base : to > base);

    // Systems readout: one row per stat, built once and then animated on every toggle: the number counts to its configured
    // value and the bar runs from where it was, on one fixed scale per row: the largest value this hull reaches in any of its
    // configurations, so a full bar means "this hull's most". The tick marks the base stat. Same calculator as the comparison table.
    P.readoutHTML = function (ship) {
        if (!this._keyByPath) {
            this._keyByPath = new Map();
            (this.statDefinitions || []).forEach(d => this._keyByPath.set(d.path.join('.'), d.key));
        }
        const fmt = v => this.formatStatValue(v);
        return GROUPS.map(([title, rows]) => `
            <div class="ro-group"><h4>${esc(title)}</h4>${rows.map(([label, path]) => {
                const base = this.getPath(ship, path);
                const max = typeof base === 'number' ? this.rowScale(ship, path) : 1;
                const at = typeof base === 'number' ? (100 * base / max).toFixed(1) : 0;
                return `<div class="srow" data-path="${esc(path.join('.'))}" title="${esc(label)}"><span class="sl">${esc(label)}</span><span class="sv"><b>${fmt(base)}</b><span class="sd"></span></span><span class="sb"><i class="fill" style="width:${at}%"></i><i class="mark" style="left:${at}%"></i></span></div>`;
            }).join('')}</div>`).join('');
    };

    P.rowScale = function (ship, path) {
        if (!this.componentDataLoaded) return Math.max(this.getPath(ship, path), 0) || 1;
        if (!this._rowScale) this._rowScale = new Map();
        const id = ship.id + '::' + path.join('.');
        if (!this._rowScale.has(id)) {
            let max = this.getPath(ship, path);
            (ship.configurations || []).forEach(c => { const v = this.statValue(ship, c.name, path); if (typeof v === 'number' && v > max) max = v; });
            this._rowScale.set(id, max > 0 ? max : 1);
        }
        return this._rowScale.get(id);
    };

    P.statValue = function (ship, configName, path) {
        if (!this._keyByPath) { this._keyByPath = new Map(); (this.statDefinitions || []).forEach(d => this._keyByPath.set(d.path.join('.'), d.key)); }
        const base = this.getPath(ship, path);
        const key = this._keyByPath.get(path.join('.'));
        return configName && key && this.componentDataLoaded ? this.applyModifiers(ship, configName, key) : base;
    };

    // eases every row from its current value to the configuration's; a new toggle starts from wherever the numbers are
    P.updateReadout = function (ship, configName, box) {
        const fmt = v => this.formatStatValue(v);
        const rows = [...box.querySelectorAll('.srow')].map(el => {
            const path = el.dataset.path.split('.'), base = this.getPath(ship, path), to = this.statValue(ship, configName, path);
            if (typeof base !== 'number' || typeof to !== 'number') return null;
            const max = this.rowScale(ship, path);
            return { el, path, base, to, max, from: el._v === undefined ? base : el._v, b: el.querySelector('.sv b'), d: el.querySelector('.sd'), fill: el.querySelector('.fill'), mark: el.querySelector('.mark') };
        }).filter(Boolean);
        const paint = (r, v) => {
            r.el._v = v;
            r.b.textContent = fmt(v);
            r.fill.style.width = Math.min(100, Math.max(0, 100 * v / r.max)).toFixed(2) + '%';
            r.mark.style.left = Math.min(100, Math.max(0, 100 * r.base / r.max)).toFixed(2) + '%';
        };
        rows.forEach(r => {
            const changed = Math.abs(r.to - r.base) > 1e-9, pct = changed ? this.calculateChange(r.base, r.to) : 0;
            const better = changed && isBetter(r.path, r.to, r.base);
            r.el.classList.toggle('up', better);
            r.el.classList.toggle('down', changed && !better);
            r.d.textContent = changed ? `${pct > 0 ? '+' : ''}${pct.toFixed(pct > -10 && pct < 10 ? 1 : 0)}%` : '';
            r.el.title = changed ? `${r.el.querySelector('.sl').textContent}: base ${fmt(r.base)} -> ${fmt(r.to)} with ${configName}` : `${r.el.querySelector('.sl').textContent}: ${fmt(r.base)} (this hull's most in any configuration: ${fmt(r.max)})`;
        });
        if (this._readoutRaf) cancelAnimationFrame(this._readoutRaf);
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { rows.forEach(r => paint(r, r.to)); return; }
        const t0 = performance.now(), DUR = 900;
        const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        const step = (now) => {
            const t = Math.min(1, (now - t0) / DUR), e = ease(t);
            rows.forEach(r => paint(r, t === 1 ? r.to : r.from + (r.to - r.from) * e));
            this._readoutRaf = t < 1 ? requestAnimationFrame(step) : null;
        };
        this._readoutRaf = requestAnimationFrame(step);
    };

    // Callout rows: what each fitted part group really does, from the same calculator: every stat with the configuration as
    // fitted against the configuration with that group removed, as a share of the base stat. The two largest effects show.
    P.calloutInfo = function (ship, configName) {
        const config = (ship.configurations || []).find(c => c.name === configName);
        const fit = window.ShipFit;
        if (!config || !fit || !this.componentDataLoaded || !this.configCalculator) return {};
        if (!this._calloutCache) this._calloutCache = new Map();
        const cacheKey = ship.id + '::' + configName;
        if (this._calloutCache.has(cacheKey)) return this._calloutCache.get(cacheKey);
        const rows = [];
        GROUPS.forEach(([, list]) => list.forEach(([label, path]) => { const key = this._keyByPath.get(path.join('.')); if (key) rows.push({ label, path, key }); }));
        const full = this.configCalculator.calculateModifiedStats(ship, config).values;
        const out = {};
        [...new Set(fit.fitOf(config).entries.map(e => e.group))].forEach(group => {
            const components = {};
            Object.keys(config.components).forEach(cat => {
                components[cat] = {};
                Object.keys(config.components[cat] || {}).forEach(type => { if (fit.groupOfType(cat, type) !== group) components[cat][type] = config.components[cat][type]; });
            });
            const without = this.configCalculator.calculateModifiedStats(ship, Object.assign({}, config, { components })).values;
            out[group] = rows.map(r => {
                const base = this.getPath(ship, r.path), a = full[r.key], b = without[r.key];
                if (typeof base !== 'number' || !base || typeof a !== 'number' || typeof b !== 'number') return null;
                return { r, share: (a - b) / Math.abs(base), better: isBetter(r.path, a, b) };
            }).filter(q => q && Math.abs(q.share) >= 0.005).sort((p, q) => Math.abs(q.share) - Math.abs(p.share)).slice(0, 2)
                .map(q => { const pct = 100 * q.share; return [q.r.label, `${pct > 0 ? '+' : ''}${pct.toFixed(Math.abs(pct) < 10 ? 1 : 0)}%`, q.better ? 'up' : 'down']; });
        });
        this._calloutCache.set(cacheKey, out);
        return out;
    };

    P.openShipModal = function (ship) {
        if (!ship) return;
        this.closeShipModal();
        if (window.spaceSounds) window.spaceSounds.openPopup();
        const index = this.ships.indexOf(ship);
        const turn = ShipArt.turn(ship);
        const hero = ShipArt.hero(ship);
        const configs = (ship.configurations || []).map(c => c.name).filter(Boolean);

        const overlay = document.createElement('div');
        overlay.className = 'ship-modal-overlay';
        overlay.innerHTML = `
            <div class="ship-modal bay" role="dialog" aria-label="${esc(ship.name)}">
                <div class="ship-modal-visual">
                    ${turn ? `<div class="turntable" data-frames="${turn.frames}" style="background-image:url('${turn.url}')" title="Drag to rotate"></div><div class="turn-hint">Drag to rotate · ${turn.frames} views</div>`
                           : hero ? `<img class="ship-modal-hero${ShipArt.isStore(ship) ? ' store-art' : ''}" src="${hero}" alt=""><div class="turn-hint">${ShipArt.isStore(ship) ? 'Official store image' : ''}</div>` : `<div class="ship-modal-noart">No render for this hull yet</div>`}
                </div>
                <div class="bay-ui">
                    <div class="bay-head">
                        <div class="bay-crumb"><button type="button" data-bay-close>&larr; Ships</button><span class="sep">/</span>Configuration bay</div>
                        <h2 class="bay-title">${esc(ship.name)}</h2>
                        <div class="bay-tags">${[...new Set([ship.sizeTier, ship.manufacturer, ship.spec, ship.class != null ? 'Class ' + ship.class : ''].filter(Boolean))].map(t => `<span>${esc(t)}</span>`).join('')}</div>
                        <div class="bay-count" data-fit-count></div>
                    </div>
                    ${configs.length ? `<aside class="bay-panel left"><h3>Loadout</h3>${this.configPickerHTML(ship)}</aside>` : ''}
                    <aside class="bay-panel right"><h3 title="Tick = this hull's base stat. A full bar = the most this hull reaches in any configuration.">Systems readout <small>tick = base</small></h3><div class="spec-groups" data-readout>${this.readoutHTML(ship)}</div>${this.componentDataLoaded ? '' : '<p class="muted" data-loading>Component data is still loading; configured values appear once it has.</p>'}</aside>
                    <div class="fit-list" data-fit hidden></div>
                    <footer class="bay-foot">
                        <div class="seg seg-3d"><button type="button" data-view="solid">Solid</button><button type="button" data-view="xray">X-ray</button><button type="button" data-view="teardown">Teardown</button><button type="button" data-view="plan">Deck plan</button></div>
                        <div class="seg seg-3d" data-decks hidden></div>
                        <div class="seg seg-3d"><button type="button" data-cam="q">3/4</button><button type="button" data-cam="side">Side</button><button type="button" data-cam="top">Top</button></div>
                        <div class="cfgname">${configs.length ? '<span class="dot" data-cfg-dot></span><span data-cfg-label>Default</span>' : ''}</div>
                        <div class="ship-modal-actions"><button type="button" class="hull-btn" data-modal-add="${index}">${this.selectedShips.has(index) ? 'Remove from comparison' : 'Add to comparison'}</button></div>
                    </footer>
                </div>
                <button type="button" class="ship-modal-close" aria-label="Close">&times;</button>
            </div>`;
        document.body.appendChild(overlay);
        this.activeShipModal = overlay;

        const close = () => this.closeShipModal();
        overlay.querySelector('.ship-modal-close').addEventListener('click', close);
        overlay.querySelector('[data-bay-close]').addEventListener('click', close);
        // the panels keep the prototype's 1600x900 design, scaled to the window with their edges on its edges, so any spare
        // width or height goes to the ship; on a narrow screen they stack instead
        const modal = overlay.querySelector('.bay'), ui = overlay.querySelector('.bay-ui');
        const layout = () => {
            const w = window.innerWidth, h = window.innerHeight, narrow = w <= 1100 || Math.min(w / 1600, h / 900) < 0.65;
            modal.classList.toggle('narrow', narrow);
            if (narrow) { ui.style.transform = ''; ui.style.width = ''; ui.style.height = ''; this._bay = { ins: { l: 0, r: 0, t: 0, b: 0 }, k: 0.8 }; modal.style.setProperty('--bayk', '1'); }
            else {
                const k = Math.min(w / 1600, h / 900);
                ui.style.width = `${w / k}px`; ui.style.height = `${h / k}px`;
                ui.style.transform = `scale(${k})`;
                modal.style.setProperty('--bayk', String(k));
                this._bay = { ins: { l: 356 * k, r: 356 * k, t: 92 * k, b: 174 * k }, k };
            }
            if (this._teardown) this._teardown.setInsets(this._bay.ins, this._bay.k);
        };
        layout();
        window.addEventListener('resize', layout);
        this._bayOpener = document.activeElement;
        this._bodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        modal.tabIndex = -1;
        modal.focus();
        modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            const items = [...modal.querySelectorAll('button:not([disabled])')].filter(b => b.getClientRects().length > 0);
            if (!items.length) return;
            const first = items[0], last = items[items.length - 1], at = document.activeElement;
            if (e.shiftKey && (at === first || at === modal)) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
        });
        this._bayLayout = layout;
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        overlay.querySelector('[data-modal-add]').addEventListener('click', (e) => {
            this.toggleShip(+e.currentTarget.dataset.modalAdd); this.renderCheckboxes();
            e.currentTarget.textContent = this.selectedShips.has(index) ? 'Remove from comparison' : 'Add to comparison';
        });
        this._modalEsc = (e) => { if (e.key === 'Escape') close(); };
        document.addEventListener('keydown', this._modalEsc);
        // One selection for the stat bars, the fitted list and the teardown. Default is the empty fit: its stats ARE the base
        // stats (all 61 Default configs have no components), so it stands for "no configuration" and closes the hull.
        let current = '';
        const picker = overlay.querySelector('[data-cfg-picker]');
        const fitBox = overlay.querySelector('[data-fit]');
        const applyConfig = (name) => {
            current = name === 'Default' ? '' : name;
            this.updateReadout(ship, current, overlay.querySelector('[data-readout]'));
            picker.querySelectorAll('[data-cfg-name]').forEach(b => {
                const on = b.dataset.cfgName === (current || 'Default');
                b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
            const config = (ship.configurations || []).find(c => c.name === current) || null;
            this.renderFitList(fitBox, config, overlay.querySelector('[data-fit-count]'), ship);
            const accent = window.ShipFit ? window.ShipFit.accentOf(current) : '#9fb7c6';
            modal.style.setProperty('--acc', accent);
            overlay.querySelector('[data-cfg-label]').textContent = current || 'Default';
            if (this._teardown) this._teardown.setConfig(current, config, this.calloutInfo(ship, current), this.planStats(ship, current, config));
        };
        if (picker) {
            picker.addEventListener('click', (e) => {
                const b = e.target.closest('[data-cfg-name]');
                if (!b) return;
                applyConfig(b.dataset.cfgName);
                if (window.spaceSounds) window.spaceSounds.select();
            });
            applyConfig('Default');
        }
        this._bayData = (failed) => {
            const note = overlay.querySelector('[data-loading]');
            if (note) { if (failed) note.textContent = 'Component data failed to load; base stats are shown.'; else note.remove(); }
            if (!failed && picker) { this._calloutCache = null; this._rowScale = null; applyConfig(current || 'Default'); }
        };
        if (fitBox) {
            const hover = (e) => { const c = e.target.closest('[data-fit-group]'); if (this._teardown) this._teardown.setHover(c ? c.dataset.fitGroup : null); };
            fitBox.addEventListener('pointerover', hover);
            fitBox.addEventListener('pointerleave', () => { if (this._teardown) this._teardown.setHover(null); });
        }

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

        // the 3D teardown replaces the art once it is really running; the turntable or still stays if it cannot
        ShipModels.mount(ship, overlay.querySelector('.ship-modal-visual'), {
            isStale: () => this.activeShipModal !== overlay,
            controls: overlay.querySelector('.bay-foot'),
            // registered the moment it exists, so closing during a load can release its GL context
            onCreate: (td) => { this._pendingTeardown = td; },
            onLost: () => {
                if (this.activeShipModal !== overlay) return;
                this._teardown = null; this._pendingTeardown = null;
                modal.classList.remove('has-3d');
                if (this._modalResize) this._modalResize();
            }
        }).then((td) => {
            if (!td) return;
            this._pendingTeardown = null;
            this._teardown = td;
            if (this._modalTimer) { clearInterval(this._modalTimer); this._modalTimer = null; }
            modal.classList.add('has-3d');
            td.setInsets(this._bay.ins, this._bay.k);
            const config = (ship.configurations || []).find(c => c.name === current) || null;
            td.setConfig(current, config, this.calloutInfo(ship, current), this.planStats(ship, current, config));
        });
    };

    // the numbers the deck plan sizes its rooms from: the same ones the readout shows, plus this hull's most of each, so a room
    // keeps one scale and one place across every configuration
    P.planStats = function (ship, name, config) {
        const n = (path) => Math.max(0, +this.statValue(ship, name, path) || 0), scale = (path) => Math.max(n(path), +this.rowScale(ship, path) || 0);
        const parts = (c, cat, type) => { const box = (c && c.components && c.components[cat]) || {}; return (type ? [box[type]] : Object.values(box)).reduce((a, t) => a + ((t && t.items) || []).length, 0); };
        const most = (cat, type) => (ship.configurations || []).reduce((a, c) => Math.max(a, parts(c, cat, type)), 0);
        const P_ = { cargo: ['stats', 'capacities', 'cargoCapacity'], fuel: ['stats', 'capacities', 'fuelCapacity'], ammo: ['stats', 'capacities', 'ammoCapacity'], crew: ['crew', 'required'], passengers: ['crew', 'passengers'] };
        const now = { missileBays: parts(config, 'Ship Component', 'Missile Bay'), drones: parts(config, 'Drones') }, max = { missileBays: most('Ship Component', 'Missile Bay'), drones: most('Drones') };
        Object.keys(P_).forEach(k => { now[k] = n(P_[k]); max[k] = scale(P_[k]); });
        now.max = max;
        return now;
    };

    const partsIn = c => Object.values((c && c.components) || {}).reduce((a, cat) => a + Object.values(cat || {}).reduce((b, t) => b + ((t && t.items) || []).length, 0), 0);

    // The Loadout panel. Rows come from the names in the ship record ("Kinetic Damage Max" -> row Kinetic, cell Max), so a new
    // family appears without a code change. The number on a cell is how many parts that configuration really fits.
    P.configPickerHTML = function (ship) {
        const list = (ship.configurations || []).filter(c => c.name);
        const fit = window.ShipFit;
        const colour = n => (fit ? fit.accentOf(n) : '#9fb7c6');
        const parts = partsIn;
        const cell = (c, label, cls) => `<button type="button" class="cfg-btn${cls ? ' ' + cls : ''}" data-cfg-name="${esc(c.name)}" aria-pressed="false" style="--c:${colour(c.name)}" title="${esc(c.name)}: ${parts(c)} parts"><span class="cn">${esc(label)}</span><span class="cp">${parts(c)}</span></button>`;
        const ROMAN = { One: 'I', Two: 'II', Three: 'III', Four: 'IV', Five: 'V' };
        const tiers = list.filter(c => /^Tier /.test(c.name)), def = list.find(c => c.name === 'Default');
        const rows = new Map(), other = [];
        list.forEach(c => {
            if (c.name === 'Default' || /^Tier /.test(c.name)) return;
            const m = c.name.match(/^(.*) (Min|Mid|Max)$/);
            if (!m) { other.push(c); return; }
            if (!rows.has(m[1])) rows.set(m[1], []);
            rows.get(m[1]).push([c, m[2]]);
        });
        const row = ([title, cells]) => `<div class="cfg-line"><span class="cfg-name" style="--c:${colour(cells[0][0].name)}"><i></i>${esc(title.replace(/ Damage$/, ''))}</span><div class="cfg-btns">${cells.map(([c, l]) => cell(c, l)).join('')}</div></div>`;
        const isDamage = ([t]) => /Damage$/.test(t);
        const all = [...rows];
        return `<div class="cfg-picker" data-cfg-picker role="group" aria-label="Loadout">
            <div class="gl">Standard</div><div class="cfg-btns wide">${def ? cell(def, 'Default', 'std') : ''}${tiers.map(c => cell(c, ROMAN[c.name.slice(5)] || c.name.slice(5), 'tier')).join('')}${other.map(c => cell(c, c.name)).join('')}</div>
            <div class="gl">Role kits</div>${all.filter(r => !isDamage(r)).map(row).join('')}
            <div class="gl">Damage kits</div>${all.filter(isDamage).map(row).join('')}
        </div>`;
    };

    // What this configuration really fits, from the same record the teardown reads. Hovering a row marks those parts.
    P.renderFitList = function (box, config, countBox, ship) {
        if (!box) return;
        const api = window.ShipFit;
        const comps = (config && config.components) || null;
        const clear = () => { box.hidden = true; box.innerHTML = ''; if (countBox) countBox.innerHTML = ''; };
        if (!comps) { clear(); return; }
        const rows = [];
        for (const cat of Object.keys(comps)) for (const type of Object.keys(comps[cat] || {})) {
            const n = ((comps[cat][type] || {}).items || []).length;
            if (n) rows.push({ cat, type, n });
        }
        if (!rows.length) { clear(); return; }
        const CAT = { 'Ship Component': 'Systems', 'Ship Module': 'Modules', 'Ship Weapons': 'Weapons', Countermeasures: 'Countermeasures', Missiles: 'Missiles', Bombs: 'Bombs', Drones: 'Drones' };
        const groupOf = r => (api ? api.groupOfType(r.cat, r.type) : '');
        const cats = [...new Set(rows.map(r => r.cat))];
        box.hidden = false;
        const total = rows.reduce((a, r) => a + r.n, 0);
        // the record's slot total changes per configuration, so it is no denominator: the scale is this hull's largest fit
        const largest = Math.max(total, ...((ship && ship.configurations) || []).map(partsIn));
        box.innerHTML = cats.map(c => `<div class="fit-cat"><span>${esc(CAT[c] || c)}</span>${rows.filter(r => r.cat === c).map(r => `<span class="fit-chip" data-fit-group="${esc(groupOf(r))}">${esc(r.type)}<b>&times;${r.n}</b></span>`).join('')}</div>`).join('');
        if (countBox) countBox.innerHTML = `<div class="blabel">Fitted parts</div><div class="bnum"><b>${total}</b></div><div class="bbar"><i style="width:${(100 * total / (largest || 1)).toFixed(1)}%"></i></div><div class="blabel small">Largest fit on this hull: ${largest}</div>`;
    };

    // ---- 3D hull models (Images/ships/models/manifest.json, keyed like the art manifest); viewer loaded on first use
    const MODEL_BASE = ART_BASE + 'models/';
    const ShipModels = {
        manifest: null,
        ready: null,
        load() {
            // a failed read is not cached: one blip must not switch 3D off until the page reloads
            if (!this.ready) this.ready = fetch(MODEL_BASE + 'manifest.json').then(r => { if (!r.ok) throw new Error('manifest ' + r.status); return r.json(); }).then(m => { this.manifest = m || {}; return this.manifest; }).catch(() => { this.ready = null; return {}; });
            return this.ready;
        },
        script() {
            if (window.ShipTeardown) return Promise.resolve(window.ShipTeardown);
            if (!this._script) this._script = new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'teardown/ship-teardown.js?v=20261101c';
                s.onload = () => (window.ShipTeardown ? resolve(window.ShipTeardown) : reject(new Error('teardown bundle loaded without its API')));
                s.onerror = () => { s.remove(); this._script = null; reject(new Error('teardown bundle failed to load')); };
                document.head.appendChild(s);
            });
            return this._script;
        },
        // resolves to a running viewer, or null with the existing art left in place. Never throws into the modal.
        async mount(ship, host, hooks) {
            if (!host) return null;
            let stage = null, td = null;
            const revert = () => {
                if (td) { try { td.dispose(); } catch (e) { /* the art stays either way */ } }
                if (stage) stage.remove();
                host.classList.remove('has-td', 'td-live');
            };
            try {
                const manifest = await this.load();
                const entry = manifest[ship.name];
                if (!entry) return null;
                const api = await this.script();
                if (hooks.isStale()) return null;
                stage = document.createElement('div');
                stage.className = 'td-stage loading';
                host.appendChild(stage);
                host.classList.add('has-td');
                td = api.mount(stage, {
                    url: MODEL_BASE + entry.file, sternHint: entry.sternHint, mounts: entry.mounts, shipClass: ship.class, formatStat: (x) => window.shipExplorer.formatStatValue(x), controls: hooks.controls,
                    onFail: (err) => {
                        console.warn('Ship teardown stopped for ' + ship.name + ':', err && err.message);
                        revert();
                        hooks.onLost();
                    }
                });
                hooks.onCreate(td);
                await td.ready;
                if (td.disposed) return null;
                if (hooks.isStale()) { revert(); return null; }
                stage.classList.remove('loading');
                host.classList.add('td-live');
                return td;
            } catch (err) {
                console.warn('Ship teardown unavailable for ' + ship.name + ':', err && err.message);
                revert();
                hooks.onLost();
                return null;
            }
        }
    };

    P.closeShipModal = function () {
        if (!this.activeShipModal) return;
        if (window.spaceSounds) window.spaceSounds.closePopup();
        if (this._teardown) { this._teardown.dispose(); this._teardown = null; }
        if (this._readoutRaf) { cancelAnimationFrame(this._readoutRaf); this._readoutRaf = null; }
        if (this._bayLayout) { window.removeEventListener('resize', this._bayLayout); this._bayLayout = null; }
        this._bayData = null;
        document.body.style.overflow = this._bodyOverflow || '';
        if (this._bayOpener && this._bayOpener.isConnected && this._bayOpener.focus) this._bayOpener.focus();
        this._bayOpener = null;
        if (this._pendingTeardown) { this._pendingTeardown.dispose(); this._pendingTeardown = null; }
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
