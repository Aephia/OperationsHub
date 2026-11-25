/* C4 Live fleet view: window.C4FleetView. A full-screen view of ONE owner's fleets (a card per fleet) and, one step
   further in, a hero screen for a single fleet: the flagship on a turntable, gauges, every stat the chain states for the
   fleet, and the same stat sheet for each ship model in it.
   Data: latest.fleets[] (always), plus the additive fields latest.statKeys, latest.shipDefs and fleets[].st / ap / fuel /
   ammo / hold / stance / pend / rent. A copy of the data read before those existed still draws the cards and the gauges
   it can; the stat sheets say "refresh to read".
   build*() and html*() are pure (no DOM, no clock, no fetch) and every string that came from the chain is escaped.
   Plain script, no dependencies. In Node it module.exports the same object. */
(function (root) {
    'use strict';

    // lookup tables keyed by chain text have no prototype: a state called "constructor" finds nothing
    function tbl(o) { var t = Object.create(null); Object.keys(o).forEach(function (k) { t[k] = o[k]; }); return t; }
    var STATE_LABEL = tbl({ mining: 'Mining', idle: 'Idle', docked: 'Docked', warp: 'Warping', subwarp: 'Subwarp', destroyed: 'Destroyed', respawn: 'Respawning', claimStakeTransfer: 'Stake transfer' });
    var SIZE_LABEL = tbl({ 'xx-small': 'XX-Small', 'x-small': 'X-Small', small: 'Small', medium: 'Medium', large: 'Large', capital: 'Capital', commander: 'Commander', titan: 'Titan' });
    var SECTION_ORDER = ['combat', 'damage', 'counter', 'repair', 'movement', 'cargo', 'scan', 'crew', 'other'];
    var SECTION_TITLE = { combat: 'Combat', damage: 'Damage', counter: 'Countermeasures', repair: 'Repair', movement: 'Movement', cargo: 'Cargo and mining', scan: 'Scanning', crew: 'Crew and recovery', other: 'Other' };
    var SECTION_EMPTY = { damage: 'No damage stat above zero.', counter: 'No countermeasure fitted.' };
    var HIDE_ZERO = { damage: 1, counter: 1 };
    var LABELS = { hp: 'Hull points', sp: 'Shield points', ap: 'Action points', apRegenRate: 'Action point regeneration', lpValue: 'LP value', xpValue: 'XP value',
        recoveryFeeAtlas: 'Recovery fee (ATLAS)', subwarpXpRate: 'Subwarp XP rate', warpXpRate: 'Warp XP rate' };
    var DMG = tbl({ Graygoo: 'Gray goo', Emp: 'EMP' });
    var FACS = tbl({ mud: 1, oni: 1, ustur: 1 });
    var CARD_LIMIT = 60;
    var FILE_RE = /^[A-Za-z0-9][A-Za-z0-9._@-]*\.webp$/;

    // ---------------------------------------------------------------- small pure helpers
    function fin(v) { return typeof v === 'number' && isFinite(v); }
    function arr(v) { return Array.isArray(v) ? v : []; }
    function obj(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : null; }
    function str(v) { return typeof v === 'string' ? v : ''; }
    function own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function shortAddr(a) { a = str(a); return a.length > 9 ? a.slice(0, 4) + '...' + a.slice(-4) : a; }
    function plural(n, w) { return fmtN(n) + ' ' + w + (n === 1 ? '' : 's'); }
    function group3(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
    // whole numbers with thousands separators; fractions keep what they need to stay readable (0.001709, 4.41, 1,234.5)
    function fmtN(v, dec) {
        if (!fin(v)) return '-';
        var a = Math.abs(v), s;
        if (dec != null) s = v.toFixed(dec);
        else if (a === Math.round(a)) s = String(Math.round(v));
        else if (a >= 100) s = v.toFixed(1);
        else if (a >= 1) s = v.toFixed(2);
        else s = String(Number(v.toPrecision(3)));
        if (s.indexOf('e') >= 0) return s;
        var p = s.split('.');
        if (p[1] != null && dec == null) { p[1] = p[1].replace(/0+$/, ''); }
        return group3(p[0]) + (p[1] ? '.' + p[1] : '');
    }
    function decimalsOf(text) { var m = /\.(\d+)$/.exec(text); return m ? m[1].length : 0; }
    function pct(v, max) { return fin(v) && fin(max) && max > 0 ? Math.max(0, Math.min(100, v / max * 100)) : null; }
    function words(k) { return k.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase(); }
    function capFirst(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
    function norm(s) { return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }

    // "Busan Pulse Default Config" -> base "Busan Pulse"; "Fimbul Mamba EX Energy Damage Max Config" -> base + variant
    function hullName(config, artIdx) {
        var s = str(config).trim().replace(/ Config$/, '');
        var a = shipArt(artIdx, config);
        if (a && a.name && norm(s).indexOf(norm(a.name)) === 0) {
            var rest = s.slice(a.name.length).trim();
            if (norm(s.slice(0, a.name.length)) === norm(a.name)) return { base: s.slice(0, a.name.length), variant: rest === 'Default' ? '' : rest };
        }
        var m = /^(.*\S) Default$/.exec(s);
        return m ? { base: m[1], variant: '' } : { base: s, variant: '' };
    }

    // ---------------------------------------------------------------- ship art (Images/ships/manifest.json)
    // index = the manifest's hulls, longest name first; a config matches the longest hull name that is a whole-word prefix
    function artIndex(manifest) {
        var out = [], m = obj(manifest);
        if (!m) return out;
        Object.keys(m).forEach(function (name) {
            var e = obj(m[name]);
            if (!e || !FILE_RE.test(str(e.hero))) return;
            var turn = FILE_RE.test(str(e.turn)) && fin(e.frames) && e.frames > 1 && e.frames <= 64 && e.frames === Math.floor(e.frames) ? { file: e.turn, frames: e.frames } : null;
            out.push({ name: name, n: norm(name), hero: e.hero, turn: turn, store: e.source === 'store' });
        });
        out.sort(function (a, b) { return b.n.length - a.n.length || (a.n < b.n ? -1 : 1); });
        return out;
    }
    function shipArt(idx, config) {
        var n = norm(config), list = arr(idx);
        if (!n) return null;
        for (var i = 0; i < list.length; i++) if (n === list[i].n || n.indexOf(list[i].n + ' ') === 0) return list[i];
        return null;
    }

    // ---------------------------------------------------------------- stats
    // keys = latest.statKeys ("group.key"), row = numbers aligned to it. null when either is missing or they disagree in length.
    function statDict(keys, row) {
        if (!Array.isArray(keys) || !Array.isArray(row) || !keys.length || keys.length !== row.length) return null;
        var d = Object.create(null);
        for (var i = 0; i < keys.length; i++) if (typeof keys[i] === 'string' && fin(row[i])) d[keys[i]] = row[i];
        return d;
    }
    function sectionOf(key) {
        var p = String(key).split('.'), g = p[0], k = p[1] || '';
        if (g === 'combat') { if (/^damage|^missileDamage/.test(k)) return 'damage'; if (/^counter/.test(k)) return 'counter'; if (/^repair/.test(k)) return 'repair'; return 'combat'; }
        if (g === 'movement') return 'movement';
        if (g === 'cargo') return 'cargo';
        if (g === 'misc') return /^scan/.test(k) ? 'scan' : 'crew';
        return 'other';
    }
    function label(key) {
        var k = String(key).split('.').pop(), m;
        if (own(LABELS, k)) return LABELS[k];
        if ((m = /^damage([A-Z][A-Za-z]*?)(Variance)?$/.exec(k))) return (DMG[m[1]] || m[1]) + ' damage' + (m[2] ? ' variance' : '');
        if ((m = /^counter([A-Z]\w*)$/.exec(k))) return capFirst(words(m[1]));
        return capFirst(words(k.replace(/Seconds$/, '')));
    }
    function unitOf(key) { return /Seconds$/.test(String(key)) ? ' s' : ''; }
    // sections = [{ id, title, rows: [{ key, label, v, text, bar }], empty }] in a fixed order; bars only in Damage
    function statSections(dict) {
        if (!dict) return [];
        var by = Object.create(null);
        Object.keys(dict).sort().forEach(function (key) {
            var id = sectionOf(key), v = dict[key];
            if (HIDE_ZERO[id] && !v) { by[id] = by[id] || []; return; }
            (by[id] = by[id] || []).push({ key: key, label: label(key), v: v, text: fmtN(v) + unitOf(key) });
        });
        return SECTION_ORDER.filter(function (id) { return by[id]; }).map(function (id) {
            var rows = by[id];
            if (id === 'damage') {
                var mx = 0; rows.forEach(function (r) { if (!/Variance$/.test(r.key) && r.v > mx) mx = r.v; });
                rows.forEach(function (r) { if (!/Variance$/.test(r.key) && mx > 0) r.bar = r.v / mx * 100; });
                rows.sort(function (a, b) { return (b.bar != null) - (a.bar != null) || b.v - a.v || (a.key < b.key ? -1 : 1); });
            }
            return { id: id, title: SECTION_TITLE[id], rows: rows, empty: rows.length ? '' : (SECTION_EMPTY[id] || '') };
        });
    }

    // ---------------------------------------------------------------- model
    function lookups(latest) {
        var sys = Object.create(null), ast = Object.create(null);
        arr(latest && latest.systems).forEach(function (s) { if (s && typeof s.a === 'string') sys[s.a] = str(s.n); });
        arr(latest && latest.asteroids).forEach(function (a) { if (a && typeof a.a === 'string') ast[a.a] = str(a.sysName); });
        return { sys: sys, ast: ast };
    }
    function xy(p) { return Array.isArray(p) && fin(p[0]) && fin(p[1]) ? fmtN(p[0], 1) + ', ' + fmtN(p[1], 1) : ''; }
    function whereText(f, L) {
        var s = obj(f.s) || {}, here = fin(f.x) && fin(f.y) ? fmtN(f.x, 1) + ', ' + fmtN(f.y, 1) : '';
        if (s.kind === 'docked') return 'Docked at ' + (L.sys[s.system] || 'a starbase' + (here ? ' at ' + here : ''));
        if (s.kind === 'mining') { var r = arr(s.resources).filter(function (x) { return typeof x === 'string'; }); return 'Mining ' + (r.length ? r.join(', ') : 'an asteroid') + (L.ast[s.asteroid] ? ' in ' + L.ast[s.asteroid] : (here ? ' at ' + here : '')); }
        if (s.kind === 'warp' || s.kind === 'subwarp') return (s.kind === 'warp' ? 'In warp' : 'Under subwarp') + (xy(s.to) ? ' to ' + xy(s.to) : '') + (xy(s.from) ? ', from ' + xy(s.from) : '');
        if (s.kind === 'destroyed') return 'Destroyed' + (here ? ' at ' + here : '');
        var k = /^[A-Za-z][A-Za-z0-9]*$/.test(str(s.kind)) ? s.kind : 'unknown';
        return (STATE_LABEL[k] || capFirst(words(k))) + (here ? ' at ' + here : '');
    }
    function gauge(id, lab, v, max) { return { id: id, label: lab, v: fin(v) ? v : null, max: fin(max) && max > 0 ? max : null, p: pct(v, max) }; }

    function buildFleet(latest, f, L, artIdx) {
        L = L || lookups(latest);
        var d = statDict(latest && latest.statKeys, f.st);
        var defs = obj(latest && latest.shipDefs), keys = latest && latest.statKeys;
        var comp = Object.keys(obj(f.types) || {}).map(function (cfg) {
            var q = f.types[cfg], def = own(defs, cfg) ? obj(defs[cfg]) : null, hn = hullName(cfg, artIdx);
            return { config: cfg, base: hn.base, variant: hn.variant, qty: fin(q) ? q : 0, size: def ? str(def.sz) : '', art: shipArt(artIdx, cfg), stats: def ? statDict(keys, def.st) : null };
        }).sort(function (a, b) { return b.qty - a.qty || (a.config < b.config ? -1 : a.config > b.config ? 1 : 0); });
        var kind = str(obj(f.s) && f.s.kind); if (!/^[A-Za-z][A-Za-z0-9]*$/.test(kind)) kind = 'unknown';   // it is also a class name
        var gauges = [gauge('hull', 'Hull', f.hp, f.hpMax), gauge('shield', 'Shield', f.sp, f.spMax)];
        if (d && fin(f.ap)) gauges.push(gauge('ap', 'Action points', f.ap, d['combat.ap']));
        gauges.push(gauge('cargo', 'Cargo', f.cargo, f.cargoCap));
        if (d && fin(f.fuel)) gauges.push(gauge('fuel', 'Fuel', f.fuel, d['cargo.fuelCapacity']));
        if (d && fin(f.ammo)) gauges.push(gauge('ammo', 'Ammunition', f.ammo, d['cargo.ammoCapacity']));
        var hold = arr(f.hold).filter(function (h) { return obj(h) && fin(h.q) && h.q > 0; }).map(function (h) { return { n: str(h.n) || 'cargo', q: h.q }; });
        var flag = str(f.flag) || (comp[0] ? comp[0].config : '');
        return {
            a: str(f.a), name: str(f.n) || shortAddr(f.a), owner: str(f.o), fa: FACS[f.fa] ? f.fa : 'unaligned', npc: !!f.npc,
            kind: kind, stateLabel: STATE_LABEL[kind] || capFirst(words(kind)), where: whereText(f, L),
            x: fin(f.x) ? f.x : null, y: fin(f.y) ? f.y : null,
            ships: fin(f.ships) ? f.ships : 0, crew: fin(f.crew) ? f.crew : 0, mineRate: fin(f.mineRate) ? f.mineRate : 0,
            ups: obj(f.mine) && fin(f.mine.ups) ? f.mine.ups : 0,
            flag: flag, flagName: hullName(flag, artIdx), flagSize: str(f.flagSize), art: shipArt(artIdx, flag),
            comp: comp, gauges: gauges, hold: hold, stance: str(f.stance), pend: fin(f.pend) ? f.pend : 0, rent: fin(f.rent) ? f.rent : 0,
            lastCombat: fin(f.lc) ? f.lc : 0,
            hasStats: !!d, sections: statSections(d)
        };
    }

    // one owner's fleets, largest first, with totals. state = optional state kind to keep ('' or 'all' = every state)
    function buildOwner(latest, p, artIdx) {
        var L = lookups(latest);
        var fleets = arr(latest && latest.fleets).filter(function (f) { return obj(f) && f.o === p; }).map(function (f) { return buildFleet(latest, f, L, artIdx); });
        fleets.sort(function (a, b) { return b.ships - a.ships || (b.gauges[0].max || 0) - (a.gauges[0].max || 0) || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0) || (a.a < b.a ? -1 : 1); });
        var t = { fleets: fleets.length, ships: 0, crew: 0, hull: 0, shield: 0, cargoCap: 0, ups: 0 }, states = Object.create(null), fa = 'unaligned';
        fleets.forEach(function (f) {
            t.ships += f.ships; t.crew += f.crew; t.hull += f.gauges[0].max || 0; t.shield += f.gauges[1].max || 0; t.ups += f.ups;
            var c = f.gauges.filter(function (g) { return g.id === 'cargo'; })[0]; t.cargoCap += (c && c.max) || 0;
            states[f.kind] = (states[f.kind] || 0) + 1;
            if (f.fa !== 'unaligned') fa = f.fa;
        });
        var stateList = Object.keys(states).map(function (k) { return { kind: k, label: STATE_LABEL[k] || capFirst(words(k)), n: states[k] }; })
            .sort(function (a, b) { return b.n - a.n || (a.kind < b.kind ? -1 : 1); });
        return { p: p, fa: fa, npc: fleets.length > 0 && fleets.every(function (f) { return f.npc; }), fleets: fleets, totals: t, states: stateList,
            hasStats: fleets.some(function (f) { return f.hasStats; }) };
    }

    // ---------------------------------------------------------------- html
    function artHtml(art, base, cls, name) {
        if (!art) return '<span class="' + cls + ' fv-noart" aria-hidden="true">' + esc((str(name).match(/\b[A-Za-z0-9]/g) || []).slice(0, 3).join('').toUpperCase()) + '</span>';
        return '<img class="' + cls + (art.store ? ' fv-store' : '') + '" src="' + esc(base + art.hero) + '" alt="" decoding="async" loading="lazy" draggable="false">';
    }
    function meter(g) {
        if (g.p == null) return '';
        return '<span class="fv-meter m-' + g.id + '"><span class="fv-meter-l"><em>' + esc(g.label) + '</em><b>' + esc(fmtN(g.v)) + ' / ' + esc(fmtN(g.max)) + '</b></span><span class="fv-meter-t"><i style="width:' + g.p.toFixed(1) + '%"></i></span></span>';
    }
    function count(v, text) { return '<b data-count="' + esc(v) + '">' + esc(text == null ? fmtN(v) : text) + '</b>'; }

    function htmlOwner(model, o) {
        o = o || {};
        var base = str(o.artBase), who = model.npc ? 'NPC' : (str(o.ownerName) || shortAddr(model.p)), t = model.totals;
        var state = o.state && o.state !== 'all' ? o.state : '', limit = fin(o.limit) ? o.limit : CARD_LIMIT;
        var list = state ? model.fleets.filter(function (f) { return f.kind === state; }) : model.fleets;
        var chips = model.states.length > 1 ? '<div class="fv-chips" role="group" aria-label="Show fleets by state"><button type="button" class="fv-chip' + (state ? '' : ' on') + '" data-fv-state="all" aria-pressed="' + (state ? 'false' : 'true') + '">All <em>' + model.fleets.length + '</em></button>' +
            model.states.map(function (s) { return '<button type="button" class="fv-chip' + (state === s.kind ? ' on' : '') + '" data-fv-state="' + esc(s.kind) + '" aria-pressed="' + (state === s.kind ? 'true' : 'false') + '">' + esc(s.label) + ' <em>' + s.n + '</em></button>'; }).join('') + '</div>' : '';
        var totals = [['Fleets', t.fleets], ['Ships', t.ships], ['Crew', t.crew], ['Hull', t.hull], ['Shield', t.shield], ['Cargo capacity', t.cargoCap]].concat(t.ups ? [['Mining u/s', t.ups]] : [])
            .map(function (x) { return '<div class="fv-tot"><span>' + x[0] + '</span>' + count(x[1]) + '</div>'; }).join('');
        var cards = list.slice(0, limit).map(function (f, i) {
            var sub = plural(f.ships, 'ship') + (f.crew ? ' &middot; ' + esc(fmtN(f.crew)) + ' crew' : '');
            var mix = f.comp.slice(0, 3).map(function (c) { return '<span class="fv-mix"><b>' + esc(fmtN(c.qty)) + 'x</b> ' + esc(c.base) + (c.variant ? ' <em>' + esc(c.variant) + '</em>' : '') + '</span>'; }).join('') + (f.comp.length > 3 ? '<span class="fv-mix more">+ ' + (f.comp.length - 3) + ' more</span>' : '');
            return '<button type="button" class="fv-card s-' + esc(f.kind) + '" data-fv-fleet="' + esc(f.a) + '" style="--i:' + Math.min(i, 24) + '" aria-label="' + esc('Open fleet ' + f.name + ', ' + plural(f.ships, 'ship') + ', ' + f.stateLabel) + '">' +
                '<span class="fv-card-art">' + artHtml(f.art, base, 'fv-card-img', f.flagName.base) + '<i class="fv-sheen" aria-hidden="true"></i></span>' +
                '<span class="fv-card-top"><b class="fv-card-n">' + esc(f.name) + '</b><span class="c4-st st-' + esc(f.kind) + '">' + esc(f.stateLabel) + '</span></span>' +
                '<span class="fv-card-sub">' + sub + '</span><span class="fv-mixes">' + mix + '</span>' +
                f.gauges.filter(function (g) { return g.id === 'hull' || g.id === 'shield' || g.id === 'cargo'; }).map(meter).join('') +
                '<span class="fv-card-foot"><span>' + esc(f.where) + '</span>' + (f.ups ? '<b>' + esc(fmtN(f.ups, 1)) + ' u/s</b>' : '') + '</span></button>';
        }).join('');
        var more = list.length > limit ? '<button type="button" class="fv-more" data-fv-more>Show ' + Math.min(CARD_LIMIT, list.length - limit) + ' more of ' + (list.length - limit) + '</button>' : '';
        var none = list.length ? '' : '<p class="fv-note">' + (model.fleets.length ? 'No fleet of this owner is in that state.' : 'This profile owns no fleet in the latest read.') + '</p>';
        var stale = model.fleets.length && !model.hasStats ? '<p class="fv-note warn">Ship stats have not been read in this copy of the data. Refresh to read them.</p>' : '';
        return '<div class="fv-page fv-owner" data-fa="' + esc(model.fa) + '">' +
            '<div class="fv-head"><div class="fv-head-t"><div class="fv-kind">Fleet view</div><h2 class="fv-h" id="c4FvTitle">' + esc(who) + '</h2></div>' +
            '<button type="button" class="fv-x" data-fv-close aria-label="Close the fleet view">&times;</button></div>' +
            '<div class="fv-tots">' + totals + '</div>' + chips + stale + none +
            '<div class="fv-grid">' + cards + '</div>' + more + '</div>';
    }

    function ring(g, i) {
        var has = g.p != null, off = has ? (100 - g.p).toFixed(2) : '100';
        return '<div class="fv-ring r-' + g.id + (has ? '' : ' off') + '" style="--i:' + i + '"><svg viewBox="0 0 44 44" aria-hidden="true"><circle class="t" cx="22" cy="22" r="18" pathLength="100"/><circle class="v" cx="22" cy="22" r="18" pathLength="100" stroke-dasharray="100" stroke-dashoffset="' + off + '"/></svg>' +
            '<div class="fv-ring-c">' + (has ? '<b data-count="' + g.p.toFixed(0) + '" data-suffix="%">' + g.p.toFixed(0) + '%</b>' : '<b>-</b>') + '</div>' +
            '<span class="fv-ring-l">' + esc(g.label) + '</span><span class="fv-ring-n">' + (g.v != null ? esc(fmtN(g.v)) : '-') + (g.max != null ? ' / ' + esc(fmtN(g.max)) : '') + '</span></div>';
    }
    function sectionsHtml(sections) {
        return sections.map(function (s, i) {
            var rows = s.rows.map(function (r) {
                return '<div class="fv-row"><span>' + esc(r.label) + '</span><b>' + esc(r.text) + '</b>' + (r.bar != null ? '<i class="fv-row-bar"><i style="width:' + r.bar.toFixed(1) + '%"></i></i>' : '') + '</div>';
            }).join('');
            return '<section class="fv-sec sec-' + s.id + '" style="--i:' + i + '"><h4>' + esc(s.title) + '</h4>' + (rows || '<p class="fv-none">' + esc(s.empty) + '</p>') + '</section>';
        }).join('');
    }
    function htmlFleet(f, o) {
        o = o || {};
        var base = str(o.artBase), who = f.npc ? 'NPC' : (str(o.ownerName) || shortAddr(f.owner));
        var idx = fin(o.index) ? o.index : 0, of = fin(o.count) ? o.count : 1;
        var a = f.art, stage;
        if (a && a.turn) stage = '<div class="fv-turn" data-fv-turn data-frames="' + a.turn.frames + '" style="background-image:url(\'' + esc(base + a.turn.file) + '\');background-size:' + a.turn.frames * 100 + '% 100%" role="img" aria-label="' + esc(f.flagName.base) + ', drag to rotate"></div>';
        else stage = artHtml(a, base, 'fv-hero-img', f.flagName.base);
        var facts = [plural(f.ships, 'ship'), f.crew ? fmtN(f.crew) + ' crew' : '', f.flagSize ? 'flagship class ' + (SIZE_LABEL[f.flagSize] || f.flagSize) : '', f.stance ? 'ammunition use ' + f.stance : '',
            f.rent ? fmtN(f.rent) + ' rented crew' : '', f.pend ? fmtN(f.pend) + ' hull pending' : '', f.ups ? fmtN(f.ups, 1) + ' u/s mined' : ''].filter(Boolean);
        var comp = f.comp.map(function (c, i) {
            var sheet = c.stats ? '<details class="fv-ship-d"><summary>Stats of one ship</summary><div class="fv-secs small">' + sectionsHtml(statSections(c.stats)) + '</div></details>'
                : '<p class="fv-none">' + (f.hasStats ? 'No stat sheet was read for this model.' : 'Stats not read in this copy of the data.') + '</p>';
            return '<article class="fv-ship" style="--i:' + i + '"><div class="fv-ship-top">' + artHtml(c.art, base, 'fv-ship-img', c.base) +
                '<div class="fv-ship-t"><b title="' + esc(c.config) + '">' + esc(c.base) + '</b>' + (c.variant ? '<em>' + esc(c.variant) + '</em>' : '') + '<small>' + esc(SIZE_LABEL[c.size] || c.size || '') + '</small></div>' +
                '<span class="fv-ship-q">x' + esc(fmtN(c.qty)) + '</span></div>' + sheet + '</article>';
        }).join('');
        var hold = f.hold.length ? '<section class="fv-sec sec-hold"><h4>Cargo hold</h4>' + f.hold.map(function (h) { return '<div class="fv-row"><span>' + esc(h.n) + '</span><b>' + esc(fmtN(h.q)) + '</b></div>'; }).join('') + '</section>' : '';
        var stats = f.hasStats ? '<div class="fv-secs">' + sectionsHtml(f.sections) + hold + '</div>'
            : '<p class="fv-note warn">Ship stats have not been read in this copy of the data. Refresh to read them.</p>';
        var canFly = f.x != null && f.y != null && o.canFly !== false;
        return '<div class="fv-page fv-hero" data-fa="' + esc(f.fa) + '" data-fv-a="' + esc(f.a) + '">' +
            '<div class="fv-head"><button type="button" class="fv-back" data-fv-back><i aria-hidden="true"></i>All fleets</button>' +
            (of > 1 ? '<div class="fv-nav"><button type="button" data-fv-nav="-1" aria-label="Previous fleet">&lsaquo;</button><span>' + (idx + 1) + ' / ' + of + '</span><button type="button" data-fv-nav="1" aria-label="Next fleet">&rsaquo;</button></div>' : '') +
            '<button type="button" class="fv-x" data-fv-close aria-label="Close the fleet view">&times;</button></div>' +
            '<div class="fv-stage s-' + esc(f.kind) + '"><i class="fv-floor" aria-hidden="true"></i><i class="fv-halo" aria-hidden="true"></i><i class="fv-orbit" aria-hidden="true"></i>' +
            '<div class="fv-stage-art">' + stage + '</div><i class="fv-scan" aria-hidden="true"></i>' +
            '<div class="fv-title"><div class="fv-kind">Fleet of ' + esc(who) + '</div><h2 class="fv-h" id="c4FvTitle">' + esc(f.name) + '</h2>' +
            '<div class="fv-title-r"><span class="c4-st st-' + esc(f.kind) + '">' + esc(f.stateLabel) + '</span><span class="fv-flag">' + esc(f.flagName.base) + (f.flagName.variant ? ' <em>' + esc(f.flagName.variant) + '</em>' : '') + '</span></div>' +
            '<p class="fv-where">' + esc(f.where) + '</p><p class="fv-facts">' + facts.map(esc).join(' &middot; ') + '</p>' +
            '<button type="button" class="fv-fly" data-fv-fly' + (canFly ? '' : ' disabled title="3D map not loaded"') + '>Fly to fleet</button>' +
            (a && a.turn ? '<span class="fv-hint">Drag the ship to rotate it</span>' : '') + '</div></div>' +
            '<div class="fv-rings">' + f.gauges.map(ring).join('') + '</div>' +
            '<div class="fv-body"><div class="fv-col"><h3 class="fv-h3">Ships in this fleet</h3><div class="fv-ships">' + (comp || '<p class="fv-none">No ship listed.</p>') + '</div></div>' +
            '<div class="fv-col wide"><h3 class="fv-h3">Fleet stats <em>totals for the whole fleet, as the chain states them</em></h3>' + stats + (f.hasStats ? '' : hold) + '</div></div></div>';
    }

    // ================================================================ DOM (browser only)
    var V = null;   // { el, ctx, p, fleet, state, limit, from, art, artP, timer }
    function reduced() { return !!(V && V.ctx && V.ctx.reducedMotion); }
    function loadArt() {
        if (V.artP) return V.artP;
        var base = V.ctx.artBase || '';
        V.artP = fetch(base + 'manifest.json', { cache: 'force-cache' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
            .then(function (m) {
                if (!V) return;
                if (!m) { V.artP = null; return; }   // not loaded: the next open tries again
                V.art = artIndex(m);
                if (isOpen()) draw(Date.now() - V.at < 1200);   // still inside the entrance: play it with the pictures in
            });
        return V.artP;
    }
    function model() { return buildOwner(V.ctx.latest, V.p, V.art); }
    function shown(m) { return V.state && V.state !== 'all' ? m.fleets.filter(function (f) { return f.kind === V.state; }) : m.fleets; }
    function draw(animate) {
        var el = V.el, m = model(), name = V.ctx.ownerName ? V.ctx.ownerName(V.p) : '';
        stopTurn();
        var top = el.scrollTop, html, keep = focusKey();
        // a redraw of the same fleet keeps its opened stat sheets open
        var hero0 = el.querySelector('.fv-hero'), opened = hero0 && hero0.getAttribute('data-fv-a') === V.fleet ? [].map.call(el.querySelectorAll('details.fv-ship-d'), function (d) { return d.open; }) : null;
        if (V.state && V.state !== 'all' && !m.states.some(function (s) { return s.kind === V.state; })) V.state = 'all';
        var f = V.fleet ? m.fleets.filter(function (x) { return x.a === V.fleet; })[0] : null;
        if (V.fleet && !f) V.fleet = null;   // the fleet is gone from this read: back to the list
        if (f) { var list = shown(m).some(function (x) { return x.a === f.a; }) ? shown(m) : m.fleets; html = htmlFleet(f, { artBase: V.ctx.artBase, ownerName: name, index: list.indexOf(f), count: list.length, canFly: V.ctx.canFly !== false }); }
        else html = htmlOwner(m, { artBase: V.ctx.artBase, ownerName: name, state: V.state, limit: V.limit });
        el.innerHTML = html;
        if (opened && V.fleet) [].forEach.call(el.querySelectorAll('details.fv-ship-d'), function (d, i) { if (opened[i]) d.open = true; });
        el.classList.toggle('fv-still', !animate || reduced());
        el.setAttribute('aria-labelledby', 'c4FvTitle');
        el.querySelectorAll('img').forEach(function (im) { im.addEventListener('error', function () { im.classList.add('fv-broken'); }); });
        if (animate && !reduced()) countUp(el); else el.scrollTop = top;
        if (keep) { var again = el.querySelector(keep); if (again && again.focus) again.focus({ preventScroll: true }); }
        startTurn();
    }
    // numbers run up from zero to the text already on the page; the last frame restores that exact text
    function countUp(el) {
        var items = [].slice.call(el.querySelectorAll('[data-count]')).map(function (b) {
            var to = Number(b.getAttribute('data-count')), text = b.textContent, suf = b.getAttribute('data-suffix') || '';
            return fin(to) && to !== 0 ? { b: b, to: to, text: text, suf: suf, dec: decimalsOf(text.replace(suf, '')) } : null;
        }).filter(Boolean);
        if (!items.length || typeof requestAnimationFrame !== 'function') return;
        var t0 = null, D = 900, tok = V.tok;
        function step(t) {
            if (!V || V.tok !== tok) return;
            if (t0 == null) t0 = t;
            var k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
            items.forEach(function (it) { if (it.b.isConnected) it.b.textContent = k >= 1 ? it.text : fmtN(it.to * e, it.dec) + it.suf; });
            if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    // turntable: the strip holds N frames side by side; a slow idle spin, and a drag turns it by hand
    function setFrame(tt, i) { var F = +tt.getAttribute('data-frames') || 12; i = ((i % F) + F) % F; tt._f = i; tt.style.backgroundPosition = (F > 1 ? i / (F - 1) * 100 : 0) + '% 0'; }
    function stopTurn() { if (V && V.timer) { clearInterval(V.timer); V.timer = null; } }
    function startTurn() {
        var tt = V.el.querySelector('[data-fv-turn]'); if (!tt) return;
        setFrame(tt, 0);
        if (!reduced()) V.timer = setInterval(function () { if (!tt._drag && tt.isConnected) setFrame(tt, tt._f + 1); }, 420);
        tt.addEventListener('pointerdown', function (e) { tt._drag = { x: e.clientX, f: tt._f }; try { tt.setPointerCapture(e.pointerId); } catch (x) { /* older browsers */ } });
        tt.addEventListener('pointermove', function (e) { if (!tt._drag) return; var w = tt.clientWidth || 320, F = +tt.getAttribute('data-frames') || 12; setFrame(tt, tt._drag.f - Math.round((e.clientX - tt._drag.x) / (w / F / 1.6))); });
        var end = function () { tt._drag = null; };
        tt.addEventListener('pointerup', end); tt.addEventListener('pointercancel', end);
    }
    // list <-> hero: the ship picture flies from its card to the stage and back (measure, redraw, animate a copy across
    // the difference). Going back keeps the list where it was scrolled and does not replay the card entrances.
    function swap(change, addr, focusSel) {
        var el = V.el, toHero = !V.fleet;
        var pic = function () { return V.fleet ? el.querySelector('.fv-stage-art > *') : (addr ? el.querySelector('.fv-card[data-fv-fleet="' + cssEsc(addr) + '"] .fv-card-img') : null); };
        var p0 = pic(), from = p0 && p0.getBoundingClientRect ? p0.getBoundingClientRect() : null;
        if (toHero) V.gridTop = el.scrollTop;
        change(); draw(toHero);
        el.scrollTop = toHero ? 0 : (V.gridTop || 0);
        focusFirst(focusSel);
        var p1 = pic();
        if (reduced() || !from || !from.width || !from.height || !p1 || typeof p1.animate !== 'function') return;
        var to = p1.getBoundingClientRect(); if (!to.width || !to.height) return;
        var g = p1.cloneNode(false), sc = Math.min(from.width / to.width, from.height / to.height);
        var dx = from.left + from.width / 2 - (to.left + to.width / 2), dy = from.top + from.height / 2 - (to.top + to.height / 2);
        g.removeAttribute('data-fv-turn'); g.removeAttribute('role'); g.setAttribute('aria-hidden', 'true'); g.className = p1.className + ' fv-ghost';
        g.style.left = to.left + 'px'; g.style.top = to.top + 'px'; g.style.width = to.width + 'px'; g.style.height = to.height + 'px';
        p1.classList.add('fv-flip'); p1.style.visibility = 'hidden';
        document.body.appendChild(g);
        var done = function () { g.remove(); p1.style.visibility = ''; };
        var an = g.animate([{ transform: 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + sc.toFixed(4) + ')' }, { transform: 'none' }], { duration: 620, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
        an.onfinish = done; an.oncancel = done;
    }
    function cssEsc(s) { return typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(s) : String(s).replace(/[^A-Za-z0-9_-]/g, '\\$&'); }
    // a selector that finds the focused control again after the view is drawn anew (null when focus is elsewhere)
    function focusKey() {
        var a = typeof document !== 'undefined' ? document.activeElement : null;
        if (!a || !V || !V.el.contains(a) || a === V.el || !a.attributes) return null;
        for (var i = 0; i < a.attributes.length; i++) { var at = a.attributes[i]; if (/^data-fv-/.test(at.name)) return '[' + at.name + (at.value ? '="' + cssEsc(at.value) + '"' : '') + ']'; }
        if (a.tagName === 'SUMMARY') { var n = [].indexOf.call(V.el.querySelectorAll('.fv-ship'), a.closest('.fv-ship')); if (n >= 0) return '.fv-ship:nth-child(' + (n + 1) + ') summary'; }
        return null;
    }
    function focusFirst(sel) { var n = V.el.querySelector(sel) || V.el; if (n && n.focus) n.focus({ preventScroll: true }); }

    function isOpen() { return !!(V && V.open); }
    function open(el, ctx, p, fleetAddr) {
        if (!el || !ctx || !ctx.latest) return false;
        var was = V;
        V = { el: el, ctx: ctx, p: p, fleet: fleetAddr || null, state: 'all', limit: CARD_LIMIT, open: true, at: Date.now(), tok: (was ? was.tok : 0) + 1,
            from: was && was.open ? was.from : document.activeElement, art: was ? was.art : null, artP: was ? was.artP : null, timer: null, hide: null };
        if (was) { clearTimeout(was.hide); if (was.timer) clearInterval(was.timer); }
        draw(true);
        el.hidden = false; el.setAttribute('aria-hidden', 'false');
        void el.offsetWidth;
        el.classList.add('open'); el.scrollTop = 0;
        focusFirst('.fv-x');
        loadArt();
        return true;
    }
    function refresh(ctx) { if (!isOpen()) return; V.ctx = ctx; if (!ctx.latest) { close(); return; } V.tok++; draw(false); }
    function close() {
        if (!isOpen()) return;
        var v = V, el = v.el;
        v.open = false; v.tok++; stopTurn();
        [].slice.call(document.querySelectorAll('.fv-ghost')).forEach(function (g) { g.remove(); });   // a picture still in flight
        el.classList.remove('open'); el.setAttribute('aria-hidden', 'true');
        v.hide = setTimeout(function () { if (V === v && !v.open) { el.hidden = true; el.innerHTML = ''; } }, reduced() ? 0 : 380);
        var back = v.from && v.from.isConnected ? v.from : document.querySelector('[data-fleet-view="' + cssEsc(v.p) + '"]');
        if (back && back.focus) back.focus({ preventScroll: true });
    }
    function go(addr) { V.tok++; var prev = V.fleet; swap(function () { V.fleet = addr; }, addr || prev, addr ? '.fv-back' : (prev ? '.fv-card[data-fv-fleet="' + cssEsc(prev) + '"]' : '.fv-x')); }
    function step(dir) {
        var m = model(), list = shown(m); if (!list.some(function (f) { return f.a === V.fleet; })) list = m.fleets;
        var i = list.map(function (f) { return f.a; }).indexOf(V.fleet); if (i < 0 || list.length < 2) return;
        V.tok++; V.fleet = list[(i + dir + list.length) % list.length].a; draw(true); V.el.scrollTop = 0;
        focusFirst('[data-fv-nav="' + dir + '"]');
    }
    // returns true when the click belonged to the fleet view
    function onClick(e) {
        if (!isOpen()) return false;
        var t = e.target; if (!t || !t.closest || !V.el.contains(t)) return false;
        var b;
        if (t.closest('[data-fv-close]')) { close(); return true; }
        if (t.closest('[data-fv-back]')) { go(null); return true; }
        if ((b = t.closest('[data-fv-nav]'))) { step(+b.getAttribute('data-fv-nav') < 0 ? -1 : 1); return true; }
        if ((b = t.closest('[data-fv-fleet]'))) { go(b.getAttribute('data-fv-fleet')); return true; }
        if ((b = t.closest('[data-fv-state]'))) { V.state = b.getAttribute('data-fv-state'); V.limit = CARD_LIMIT; V.tok++; draw(true); focusFirst('[data-fv-state="' + cssEsc(V.state) + '"]'); return true; }
        if (t.closest('[data-fv-more]')) { V.limit += CARD_LIMIT; V.tok++; draw(false); return true; }
        if (t.closest('[data-fv-fly]')) {
            var f = model().fleets.filter(function (x) { return x.a === V.fleet; })[0], fly = V.ctx.flyTo;
            close(); if (f && f.x != null && typeof fly === 'function') fly(f.x, f.y, f);
            return true;
        }
        return true;   // any other click inside the view stays inside it
    }
    // returns true when the key was handled; while the view is open it is modal (Tab stays inside, page shortcuts are off)
    function onKey(e) {
        if (!isOpen()) return false;
        if (e.key === 'Escape') { if (V.fleet) go(null); else close(); return true; }
        if (V.fleet && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.altKey && !e.ctrlKey && !e.metaKey) {
            var tt = e.target && e.target.closest ? e.target.closest('summary, input, select, textarea') : null;
            if (!tt) { e.preventDefault(); step(e.key === 'ArrowLeft' ? -1 : 1); }
            return true;
        }
        if (e.key === 'Tab') {
            var el = V.el, fs = [].slice.call(el.querySelectorAll('button, [href], summary, [tabindex]')).filter(function (n) { return !n.disabled && n.tabIndex >= 0 && n.offsetParent !== null; });
            if (!fs.length) { e.preventDefault(); el.focus({ preventScroll: true }); return true; }
            var a = document.activeElement, first = fs[0], last = fs[fs.length - 1];
            if (e.shiftKey) { if (a === first || !el.contains(a) || a === el) { e.preventDefault(); last.focus({ preventScroll: true }); } }
            else if (a === last || !el.contains(a)) { e.preventDefault(); first.focus({ preventScroll: true }); }
        }
        return true;
    }

    var api = { version: '1', CARD_LIMIT: CARD_LIMIT, fmtN: fmtN, label: label, unitOf: unitOf, sectionOf: sectionOf, statDict: statDict, statSections: statSections,
        artIndex: artIndex, shipArt: shipArt, hullName: hullName, whereText: whereText, lookups: lookups, buildFleet: buildFleet, buildOwner: buildOwner,
        htmlOwner: htmlOwner, htmlFleet: htmlFleet, open: open, close: close, refresh: refresh, isOpen: isOpen, onClick: onClick, onKey: onKey };
    if (typeof window === 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.C4FleetView = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
