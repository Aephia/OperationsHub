// orrery.js - draws a star system from the SAGE map data as an SVG orrery, and a planet "portrait".
// Pure functions, no state. The data gives every planet an orbit (distance), an angle (degrees) and a
// scale (0.1-0.5); the star has a type (0-4) and a scale. Category = type % 8 (PlanetTypeUtils).
//
//   renderOrrerySVG(system, { size: 220, animate: false })  -> SVG markup
//   planetSphereHTML(planet, sizePx)                        -> <div class="sphere ..."> markup
//   STAR_STYLE[type], CATEGORY_STYLE[category]
(function () {
    'use strict';

    // Star colours by the data's star.type (0 White Dwarf, 1 Red Dwarf, 2 Solar, 3 Hot Blue, 4 Red Giant).
    // The names come from the data itself (system.star.name); these are only looks.
    const STAR_STYLE = {
        0: { core: '#ffffff', glow: '#cfe3ff', r: 0.70 },
        1: { core: '#ffd9c7', glow: '#ff6a3d', r: 0.80 },
        2: { core: '#fff6d6', glow: '#ffc24d', r: 1.00 },
        3: { core: '#eef7ff', glow: '#5ab8ff', r: 1.15 },
        4: { core: '#ffd6c2', glow: '#ff3d2e', r: 1.55 }
    };

    // Planet categories by (type % 8), colours chosen to read at 6-12 px.
    const CATEGORY_STYLE = {
        'Terrestrial Planet': { base: '#3fae79', lit: '#bff5d6', dark: '#0f3a2a', slug: 'terrestrial' },
        'Volcanic Planet':    { base: '#e2512b', lit: '#ffc39b', dark: '#3b0d04', slug: 'volcanic' },
        'Barren Planet':      { base: '#b7a58a', lit: '#f1e8d6', dark: '#3b3327', slug: 'barren' },
        'Asteroid Belt':      { base: '#9a9a9a', lit: '#e6e6e6', dark: '#2a2a2a', slug: 'belt' },
        'Gas Giant':          { base: '#d99a4e', lit: '#ffe3b0', dark: '#4a2e10', slug: 'gas' },
        'Ice Giant':          { base: '#7fd0ff', lit: '#e3f6ff', dark: '#15405c', slug: 'ice' },
        'Dark Planet':        { base: '#4b4f7a', lit: '#9ea3d9', dark: '#0c0d1f', slug: 'dark' },
        'Oceanic Planet':     { base: '#2f8cff', lit: '#bfe0ff', dark: '#0b2a5c', slug: 'oceanic' }
    };

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    let uid = 0;

    /**
     * Build an SVG orrery for a system.
     * @param {object} system  mapData entry (star, planets[] with orbit/angle/scale/type)
     * @param {object} opts    size (px, square), animate (bool), highlight (Set of planet indexes), labels (bool)
     */
    function renderOrrerySVG(system, opts) {
        const o = Object.assign({ size: 220, animate: false, highlight: null, labels: false }, opts || {});
        const S = o.size, C = S / 2, id = 'orr' + (++uid);
        const planets = (system.planets || []).map((p, i) => Object.assign({ _i: i }, p));
        const sorted = planets.slice().sort((a, b) => (a.orbit || 0) - (b.orbit || 0));
        const n = sorted.length;
        const star = system.star || { type: 2, scale: 1 };
        const ss = STAR_STYLE[star.type] || STAR_STYLE[2];
        const starR = Math.max(5, Math.min(S * 0.085, S * 0.045 * (star.scale || 1) * ss.r));
        const rMin = starR + S * 0.10, rMax = C - S * 0.08;
        // orbit values run 0.75-8.25 across the data set, evenly spaced within a system: map them linearly
        const O0 = 0.75, O1 = 8.25;
        const ring = (i, orbit) => rMin + (rMax - rMin) * Math.min(1, Math.max(0, ((orbit || O0) - O0) / (O1 - O0)));

        let defs = `<radialGradient id="${id}-star" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${ss.core}"/><stop offset="0.45" stop-color="${ss.glow}"/><stop offset="1" stop-color="${ss.glow}" stop-opacity="0"/></radialGradient>`;
        Object.keys(CATEGORY_STYLE).forEach(k => {
            const c = CATEGORY_STYLE[k];
            defs += `<radialGradient id="${id}-${c.slug}" cx="35%" cy="32%" r="70%"><stop offset="0" stop-color="${c.lit}"/><stop offset="0.45" stop-color="${c.base}"/><stop offset="1" stop-color="${c.dark}"/></radialGradient>`;
        });

        let rings = '', bodies = '', labels = '';
        const placed = [];   // label anchors already used, to nudge neighbours apart
        sorted.forEach((p, i) => {
            const r = ring(i, p.orbit);
            const cat = getPlanetCategory(p.type);
            const cs = CATEGORY_STYLE[cat] || CATEGORY_STYLE['Barren Planet'];
            const a = ((p.angle || 0) - 90) * Math.PI / 180;   // data angle 0 = up
            const x = C + r * Math.cos(a), y = C + r * Math.sin(a);
            const hi = o.highlight ? (o.highlight.has(p._i) ? ' hi' : ' dim') : '';
            const name = esc(p.name) + (p.code ? ' (' + esc(p.code) + ')' : '');
            const spin = o.animate ? ` style="animation-duration:${(18 + i * 9).toFixed(0)}s"` : '';
            rings += `<circle class="orb-ring" cx="${C}" cy="${C}" r="${r.toFixed(1)}"/>`;
            if (cat === 'Asteroid Belt') {
                // a belt is a scatter of rocks on the ring, not a sphere
                const dash = `${(2 + (p.scale || 0.2) * 6).toFixed(1)} ${(4 + ((p._i * 7) % 5)).toFixed(1)}`;
                bodies += `<g class="orb${hi}" data-planet="${p._i}"${spin}><circle class="belt" cx="${C}" cy="${C}" r="${r.toFixed(1)}" stroke="${cs.base}" stroke-dasharray="${dash}" stroke-width="${(1.5 + (p.scale || 0.2) * 4).toFixed(1)}"><title>${name} - Asteroid Belt</title></circle></g>`;
            } else {
                const pr = Math.max(2.5, S * 0.012 + (p.scale || 0.2) * S * 0.052);
                const gas = cat === 'Gas Giant' ? `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(pr * 1.9).toFixed(1)}" ry="${(pr * 0.55).toFixed(1)}" transform="rotate(-18 ${x.toFixed(1)} ${y.toFixed(1)})" fill="none" stroke="${cs.lit}" stroke-opacity="0.55" stroke-width="1"/>` : '';
                bodies += `<g class="orb${hi}" data-planet="${p._i}"${spin}>${gas}<circle class="body" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${pr.toFixed(1)}" fill="url(#${id}-${cs.slug})"><title>${name} - ${esc(cat)}</title></circle></g>`;
            }
            if (o.labels) {
                const lx = C + (r + 10) * Math.cos(a);
                let ly = C + (r + 10) * Math.sin(a) + 4;
                // two planets within a few degrees of each other on neighbouring rings share an anchor: push down
                for (let k = 0; k < 6; k++) {
                    if (!placed.some(q => Math.abs(q.x - lx) < 70 && Math.abs(q.y - ly) < 13)) break;
                    ly += 13;
                }
                placed.push({ x: lx, y: ly });
                labels += `<text class="orb-label${hi}" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${Math.cos(a) < -0.2 ? 'end' : Math.cos(a) > 0.2 ? 'start' : 'middle'}">${esc(p.name)}</text>`;
            }
        });

        const starG = `<circle class="star-glow" cx="${C}" cy="${C}" r="${(starR * 2.6).toFixed(1)}" fill="url(#${id}-star)" opacity="0.55"/><circle class="star-core" cx="${C}" cy="${C}" r="${starR.toFixed(1)}" fill="${ss.core}"><title>${esc(star.name || 'Star')}</title></circle>`;
        return `<svg class="orrery${o.animate ? ' live' : ''}" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}" role="img" aria-label="${esc(system.name)} system map"><defs>${defs}</defs>${rings}${starG}${bodies}${labels}</svg>`;
    }

    /** A CSS planet portrait (sphere with a lit side); category drives the palette, gas giants get bands. */
    function planetSphereHTML(planet, size) {
        const cat = getPlanetCategory(planet.type);
        const cs = CATEGORY_STYLE[cat] || CATEGORY_STYLE['Barren Planet'];
        const px = size || 140;
        const style = `--p-lit:${cs.lit};--p-base:${cs.base};--p-dark:${cs.dark};width:${px}px;height:${px}px`;
        return `<div class="sphere sphere-${cs.slug}" style="${style}" aria-hidden="true"><i class="sphere-tex"></i><i class="sphere-shade"></i></div>`;
    }

    window.Orrery = { renderOrrerySVG, planetSphereHTML, STAR_STYLE, CATEGORY_STYLE };
})();
