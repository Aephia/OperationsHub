/* C4 Live inventory: window.C4Inventory. A full-screen view of everything ONE owner holds in the latest read:
   the hangar (ships by hull, with every configuration), the cargo (fleet holds, fuel and ammunition tanks, and what is
   stored on claim stakes, by category), the crew, and the claim stakes with their buildings.
   Data: latest.fleets[] (types, hold, fuel, ammo, crew, rent), latest.stakes[] (bl, inv, crew, pw, ...), latest.owners[]
   (ATLAS) and latest.shipDefs (hull size). Nothing here is estimated: every number is a sum of rows of the read.
   The category of an item (raw / processed / component / advanced) is NOT in the read: the page hands it in
   (opts.catOf, from the hub catalog). Without it every item sits in one group and no category is claimed.
   build() and html() are pure (no DOM, no clock, no fetch) and every string that came from the chain is escaped.
   Plain script; it uses C4FleetView for ship art and hull names. In Node it module.exports the same object. */
(function (root) {
    'use strict';

    var FVX = root.C4FleetView || (typeof require === 'function' && typeof module !== 'undefined' ? require('./c4-fleet-view.js') : null);

    var FACS = { mud: 1, oni: 1, ustur: 1 };
    var CAT_ORDER = ['raw', 'processed', 'component', 'advanced', 'item'];
    var CAT_LABEL = { raw: 'Raw materials', processed: 'Processed', component: 'Components', advanced: 'Advanced', item: 'Items', all: 'All' };
    var CAT_ONE = { raw: 'Raw material', processed: 'Processed', component: 'Component', advanced: 'Advanced', item: 'Item' };
    var KIND_LABEL = { central_hub: 'Central hub', crew_quarters: 'Crew quarters', processor: 'Processor', extractor: 'Extractor', processing_hub: 'Processing hub',
        extraction_hub: 'Extraction hub', storage_hub: 'Storage hub', power_plant: 'Power plant', storage_module: 'Storage module', farm: 'Farm', farm_hub: 'Farm hub', cultivation_hub: 'Cultivation hub' };
    var SIZE_LABEL = { 'xx-small': 'XX-Small', 'x-small': 'X-Small', small: 'Small', medium: 'Medium', large: 'Large', capital: 'Capital', commander: 'Commander', titan: 'Titan' };
    var STAKE_LIMIT = 24;

    function fin(v) { return typeof v === 'number' && isFinite(v); }
    function arr(v) { return Array.isArray(v) ? v : []; }
    function obj(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : null; }
    function str(v) { return typeof v === 'string' ? v : ''; }
    function own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
    function pos(v) { return fin(v) && v > 0 ? v : 0; }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function shortAddr(a) { a = str(a); return a.length > 9 ? a.slice(0, 4) + '...' + a.slice(-4) : a; }
    function fmtN(v, dec) { return FVX ? FVX.fmtN(v, dec) : (fin(v) ? String(Math.round(v)) : '-'); }
    // a slot has room for five characters: 186,436 -> 186K, 1,234,567 -> 1.23M; the exact number is in the tooltip
    function compact(v) {
        if (!fin(v)) return '-';
        if (v < 10000) return fmtN(Math.round(v));
        // cut, never rounded up: 999,999 reads 999K, not 1000K
        var u = v >= 1e9 ? [1e9, 'B'] : v >= 1e6 ? [1e6, 'M'] : [1e3, 'K'], x = v / u[0], k = x >= 100 ? 1 : x >= 10 ? 10 : 100;
        return String(Math.floor(x * k) / k) + u[1];
    }
    function plural(n, w) { return fmtN(n) + ' ' + w + (n === 1 ? '' : 's'); }
    function cmp(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
    function kindKey(k) { k = str(k); return /^[a-z][a-z0-9_]*$/.test(k) ? k : ''; }
    function kindLabel(k) { return own(KIND_LABEL, k) ? KIND_LABEL[k] : (k ? k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' ') : 'Building'); }
    function catKey(c) { return c === 'raw' || c === 'processed' || c === 'component' || c === 'advanced' ? c : 'item'; }

    // ---------------------------------------------------------------- model
    // opts: { art: C4FleetView.artIndex(manifest) or null, catOf: name -> 'raw' | 'processed' | 'component' | 'advanced' | null, or absent }
    function build(latest, p, opts) {
        opts = opts || {};
        var art = opts.art || null, catOf = typeof opts.catOf === 'function' ? opts.catOf : null;
        var defs = obj(latest && latest.shipDefs);
        var fleets = arr(latest && latest.fleets).filter(function (f) { return obj(f) && f.o === p; });
        var stakes = arr(latest && latest.stakes).filter(function (s) { return obj(s) && s.o === p; });
        var rec = arr(latest && latest.owners).filter(function (o) { return obj(o) && o.p === p; })[0] || null;

        // hangar: one card per hull, its configurations under it
        var byHull = Object.create(null), ships = 0, configs = 0, fa = 'unaligned', npc = fleets.length > 0;
        fleets.forEach(function (f) {
            if (FACS[f.fa]) fa = f.fa;
            if (!f.npc) npc = false;
            var t = obj(f.types) || {};
            Object.keys(t).forEach(function (cfg) {
                var q = pos(t[cfg]); if (!q) return;
                var hn = FVX ? FVX.hullName(cfg, art) : { base: cfg, variant: '' };
                var h = byHull[hn.base] || (byHull[hn.base] = { base: hn.base, qty: 0, art: FVX ? FVX.shipArt(art, cfg) : null, size: '', cfg: Object.create(null) });
                h.qty += q; ships += q;
                if (!h.size && own(defs, cfg) && obj(defs[cfg])) h.size = str(defs[cfg].sz);
                var c = h.cfg[cfg] || (h.cfg[cfg] = { config: cfg, variant: hn.variant, qty: 0 });
                c.qty += q;
            });
        });
        var hulls = Object.keys(byHull).map(function (k) {
            var h = byHull[k];
            var list = Object.keys(h.cfg).map(function (c) { return h.cfg[c]; }).sort(function (a, b) { return b.qty - a.qty || cmp(a.config, b.config); });
            configs += list.length;
            return { base: h.base, qty: h.qty, art: h.art, size: h.size, configs: list };
        }).sort(function (a, b) { return b.qty - a.qty || cmp(a.base, b.base); });

        // cargo: holds + the fuel and ammunition tanks of every fleet + what sits in claim stake storage
        var byItem = Object.create(null);
        function add(name, field, q) {
            name = str(name); q = pos(q); if (!name || !q) return;
            var it = byItem[name] || (byItem[name] = { name: name, hold: 0, tank: 0, stake: 0, total: 0 });
            it[field] += q; it.total += q;
        }
        fleets.forEach(function (f) {
            arr(f.hold).forEach(function (h) { if (obj(h)) add(h.n, 'hold', h.q); });
            add('Fuel', 'tank', f.fuel); add('Ammunition', 'tank', f.ammo);
        });
        stakes.forEach(function (s) { arr(s.inv).forEach(function (h) { if (obj(h)) add(h.r, 'stake', h.q); }); });
        var items = Object.keys(byItem).map(function (k) {
            var it = byItem[k];
            it.cat = catOf ? catKey(catOf(it.name)) : '';
            return it;
        }).sort(function (a, b) { return b.total - a.total || cmp(a.name, b.name); });
        var catCount = Object.create(null), units = 0;
        items.forEach(function (it) { units += it.total; if (it.cat) catCount[it.cat] = (catCount[it.cat] || 0) + 1; });
        var cats = catOf ? CAT_ORDER.filter(function (c) { return catCount[c]; }).map(function (c) { return { id: c, label: CAT_LABEL[c], n: catCount[c] }; }) : [];

        // crew
        var crew = { fleets: 0, rented: 0, stakes: 0, total: 0 };
        fleets.forEach(function (f) { crew.fleets += pos(f.crew); crew.rented += pos(f.rent); });
        stakes.forEach(function (s) { crew.stakes += pos(s.crew); });
        crew.total = crew.fleets + crew.stakes;

        // claim stakes and their buildings
        var byKind = Object.create(null), buildings = 0;
        var st = stakes.map(function (s) {
            var bl = arr(s.bl).filter(function (b) { return obj(b) && pos(b.q); }).map(function (b) { return { n: str(b.n) || 'Building', q: b.q, k: kindKey(b.k) }; })
                .sort(function (a, b) { return b.q - a.q || cmp(a.n, b.n); });
            var n = 0; bl.forEach(function (b) { n += b.q; var kk = b.k || 'other'; byKind[kk] = (byKind[kk] || 0) + b.q; });
            // the building list can be missing in an older copy of the data: the count the chain states still shows
            var count = bl.length ? n : pos(s.b);
            buildings += count;
            return {
                a: str(s.a), label: str(s.defName) || (fin(s.def) ? 'Definition ' + s.def : 'Claim stake'), tier: fin(s.tier) ? s.tier : null,
                sysName: str(s.sysName), state: /^[A-Za-z][A-Za-z0-9]*$/.test(str(s.st)) ? s.st : 'unknown', crew: pos(s.crew), buildings: count, listed: bl.length > 0, bl: bl,
                power: obj(s.pw) && fin(s.pw.gen) && fin(s.pw.use) ? { gen: s.pw.gen, use: s.pw.use } : null,
                fuel: fin(s.fuel) ? s.fuel : null,
                store: obj(s.cap) && fin(s.cap.used) && fin(s.cap.total) && s.cap.total > 0 ? { used: s.cap.used, total: s.cap.total } : null,
                out: arr(s.out).filter(function (o) { return obj(o) && str(o.r) && pos(o.ps); }).map(function (o) { return { r: o.r, ps: o.ps }; }),
                inv: arr(s.inv).filter(function (o) { return obj(o) && str(o.r) && pos(o.q); }).map(function (o) { return { r: o.r, q: o.q }; }).sort(function (a, b) { return b.q - a.q || cmp(a.r, b.r); })
            };
        }).sort(function (a, b) { return b.buildings - a.buildings || cmp(a.sysName, b.sysName) || cmp(a.a, b.a); });
        var kinds = Object.keys(byKind).map(function (k) { return { k: k === 'other' ? '' : k, label: k === 'other' ? 'Other' : kindLabel(k), q: byKind[k] }; })
            .sort(function (a, b) { return b.q - a.q || cmp(a.label, b.label); });

        return {
            p: p, fa: fa, npc: npc, atlas: rec && fin(rec.atlas) ? rec.atlas : null,
            hulls: hulls, items: items, cats: cats, hasCats: !!catOf, crew: crew, stakes: st, kinds: kinds,
            totals: { fleets: fleets.length, ships: ships, hulls: hulls.length, configs: configs, lines: items.length, units: units, crew: crew.total, stakes: st.length, buildings: buildings },
            empty: !fleets.length && !st.length
        };
    }

    // ---------------------------------------------------------------- html
    function tile(label, v, sub) { return '<div class="inv-tot"><span>' + label + '</span><b data-count="' + esc(v) + '">' + esc(fmtN(v)) + '</b>' + (sub ? '<em>' + sub + '</em>' : '') + '</div>'; }
    function shipPic(h, base) {
        if (!h.art) return '<span class="inv-noart" aria-hidden="true">' + esc((str(h.base).match(/\b[A-Za-z0-9]/g) || []).slice(0, 3).join('').toUpperCase()) + '</span>';
        return '<img class="inv-ship-img' + (h.art.store ? ' inv-store' : '') + '" src="' + esc(base + h.art.hero) + '" alt="" decoding="async" loading="lazy" draggable="false">';
    }
    function itemTip(it) {
        var parts = [];
        if (it.hold) parts.push(fmtN(it.hold) + ' in fleet holds');
        if (it.tank) parts.push(fmtN(it.tank) + ' in fleet tanks');
        if (it.stake) parts.push(fmtN(it.stake) + ' on claim stakes');
        return it.name + ': ' + fmtN(it.total) + ' units (' + parts.join(', ') + ')';
    }
    function head(title, sub, extra) { return '<div class="inv-sh"><h3>' + title + '</h3>' + (sub ? '<em>' + sub + '</em>' : '') + (extra || '') + '</div>'; }

    /* o: { ownerName, mine, artBase, stakeArtBase, iconOf(name, cat) -> url or '', cat (the cargo filter), stakeLimit, canFleets, canStake } */
    function html(m, o) {
        o = o || {};
        var who = m.npc ? 'NPC' : (str(o.ownerName) || shortAddr(m.p)), t = m.totals, base = str(o.artBase), sbase = str(o.stakeArtBase);
        var iconOf = typeof o.iconOf === 'function' ? o.iconOf : null;
        var cat = m.hasCats && m.cats.some(function (c) { return c.id === o.cat; }) ? o.cat : 'all';

        var tots = tile('Ships', t.ships, plural(t.fleets, 'fleet')) + tile('Hulls', t.hulls, plural(t.configs, 'configuration')) + tile('Cargo lines', t.lines, esc(compact(t.units)) + ' units') +
            tile('Crew', t.crew, m.crew.rented ? esc(fmtN(m.crew.rented)) + ' rented' : '') + tile('Claim stakes', t.stakes) + tile('Buildings', t.buildings) +
            (m.atlas != null ? '<div class="inv-tot atlas"><span>ATLAS in game</span><b data-count="' + esc(Math.round(m.atlas)) + '">' + esc(fmtN(Math.round(m.atlas))) + '</b></div>' : '');

        // hangar
        var ships = m.hulls.map(function (h, i) {
            var cf = h.configs.map(function (c) { return '<li title="' + esc(c.config) + '"><b>' + esc(fmtN(c.qty)) + 'x</b> ' + esc(c.variant || 'Default') + '</li>'; }).join('');
            return '<article class="inv-ship" style="--i:' + Math.min(i, 24) + '"><span class="inv-ship-art">' + shipPic(h, base) + '<i class="inv-sheen" aria-hidden="true"></i></span>' +
                '<span class="inv-q">x' + esc(fmtN(h.qty)) + '</span>' +
                '<div class="inv-ship-t"><b>' + esc(h.base) + '</b>' + (h.size ? '<small>' + esc(own(SIZE_LABEL, h.size) ? SIZE_LABEL[h.size] : h.size) + '</small>' : '') + '</div>' +
                '<ul class="inv-cfg" aria-label="Configurations">' + cf + '</ul></article>';
        }).join('');
        var hangar = '<section class="inv-sec" data-inv-sec="hangar">' + head('Hangar', plural(t.ships, 'ship') + ', ' + plural(t.hulls, 'hull') + ', ' + plural(t.configs, 'configuration'),
            o.canFleets && t.fleets ? '<button type="button" class="inv-btn" data-inv-fleets>Fleet view</button>' : '') +
            (ships ? '<div class="inv-ships">' + ships + '</div>' : '<p class="inv-none">No ship in a fleet in this read.</p>') + '</section>';

        // cargo
        var list = cat === 'all' ? m.items : m.items.filter(function (it) { return it.cat === cat; });
        var chips = m.cats.length > 1 ? '<div class="inv-chips" role="group" aria-label="Show cargo by category"><button type="button" class="inv-chip' + (cat === 'all' ? ' on' : '') + '" data-inv-cat="all" aria-pressed="' + (cat === 'all') + '">All <em>' + m.items.length + '</em></button>' +
            m.cats.map(function (c) { return '<button type="button" class="inv-chip c-' + c.id + (cat === c.id ? ' on' : '') + '" data-inv-cat="' + c.id + '" aria-pressed="' + (cat === c.id) + '">' + esc(c.label) + ' <em>' + c.n + '</em></button>'; }).join('') + '</div>' : '';
        var slots = list.map(function (it, i) {
            var u = iconOf ? str(iconOf(it.name, it.cat)) : '';
            return '<div class="inv-slot' + (it.cat ? ' c-' + it.cat : '') + '" style="--i:' + Math.min(i, 40) + '" title="' + esc(itemTip(it)) + '">' +
                (u ? '<img class="inv-ico" src="' + esc(u) + '" alt="" decoding="async" loading="lazy" draggable="false">' : '<span class="inv-ico inv-ico-none" aria-hidden="true"></span>') +
                '<b class="inv-slot-q">' + esc(compact(it.total)) + '</b>' + (it.stake ? '<i class="inv-slot-s" aria-hidden="true"></i>' : '') +
                '<span class="inv-slot-n">' + esc(it.name) + '</span>' + (it.cat ? '<small>' + esc(CAT_ONE[it.cat]) + '</small>' : '') + '</div>';
        }).join('');
        var cargoNote = 'Units in fleet holds, in fuel and ammunition tanks, and stored on claim stakes (marked with a dot)' + (m.hasCats ? '.' : '; categories load with the hub catalog.');
        var cargo = '<section class="inv-sec" data-inv-sec="cargo">' + head('Cargo', plural(t.lines, 'line') + ', ' + esc(fmtN(Math.round(t.units))) + ' units') + chips +
            (slots ? '<div class="inv-slots">' + slots + '</div><p class="inv-cap">' + cargoNote + '</p>' : '<p class="inv-none">No cargo in this read.</p>') + '</section>';

        // crew
        var cw = m.crew, cmax = Math.max(cw.fleets, cw.stakes, 1);
        var crewRow = function (lab, v, cls) { return '<div class="inv-crew-r ' + cls + '"><span>' + lab + '</span><i><i style="width:' + (v / cmax * 100).toFixed(1) + '%"></i></i><b>' + esc(fmtN(v)) + '</b></div>'; };
        var crew = '<section class="inv-sec" data-inv-sec="crew">' + head('Crew', plural(cw.total, 'crew member')) +
            (cw.total ? '<div class="inv-crew">' + crewRow('On fleets', cw.fleets, 'a') + crewRow('On claim stakes', cw.stakes, 'b') + '</div>' +
                (cw.rented ? '<p class="inv-cap">' + esc(fmtN(cw.rented)) + ' of the fleet crew are rented.</p>' : '') : '<p class="inv-none">No crew on a fleet or a claim stake in this read.</p>') + '</section>';

        // claim stakes
        var limit = fin(o.stakeLimit) ? o.stakeLimit : STAKE_LIMIT;
        var bpic = function (k) { return k && sbase ? '<img class="inv-bld-img" src="' + esc(sbase + k + '.webp') + '" alt="" decoding="async" loading="lazy" draggable="false">' : '<span class="inv-bld-img inv-ico-none" aria-hidden="true"></span>'; };
        var kinds = m.kinds.length ? '<div class="inv-kinds">' + m.kinds.map(function (k) { return '<div class="inv-kind">' + bpic(k.k) + '<b>x' + esc(fmtN(k.q)) + '</b><span>' + esc(k.label) + '</span></div>'; }).join('') + '</div>' : '';
        var cards = m.stakes.slice(0, limit).map(function (s, i) {
            var facts = [s.crew ? fmtN(s.crew) + ' crew' : '', s.power ? 'power ' + fmtN(s.power.use) + ' / ' + fmtN(s.power.gen) : '', s.fuel != null ? 'fuel ' + fmtN(s.fuel) : '',
                s.store ? 'storage ' + (s.store.used / s.store.total * 100).toFixed(0) + '%' : ''].filter(Boolean);
            var bl = s.bl.map(function (b) { return '<li title="' + esc(b.n) + '">' + bpic(b.k) + '<b>x' + esc(fmtN(b.q)) + '</b><span>' + esc(b.n) + '</span></li>'; }).join('');
            var inv = s.inv.slice(0, 6).map(function (x) { return '<span><b>' + esc(compact(x.q)) + '</b> ' + esc(x.r) + '</span>'; }).join('') + (s.inv.length > 6 ? '<span class="more">+ ' + (s.inv.length - 6) + ' more</span>' : '');
            var outs = s.out.slice(0, 4).map(function (x) { return esc(x.r); }).join(', ') + (s.out.length > 4 ? ' + ' + (s.out.length - 4) + ' more' : '');
            return '<article class="inv-stake" style="--i:' + Math.min(i, 24) + '"><div class="inv-stake-h"><div><b>' + esc(s.label) + '</b><span>' + esc(s.sysName || 'system not read') + '</span></div>' +
                '<span class="c4-st">' + esc(s.state) + '</span></div>' +
                '<p class="inv-stake-f">' + esc(plural(s.buildings, 'building')) + (facts.length ? ' &middot; ' + facts.map(esc).join(' &middot; ') : '') + '</p>' +
                (bl ? '<ul class="inv-blds">' + bl + '</ul>' : '<p class="inv-none">' + (s.buildings ? 'The building list has not been read in this copy of the data.' : 'No building yet.') + '</p>') +
                (outs ? '<p class="inv-stake-o"><em>Produces</em> ' + outs + '</p>' : '') +
                (inv ? '<p class="inv-stake-i"><em>Stored</em> ' + inv + '</p>' : '') +
                (o.canStake && s.a ? '<button type="button" class="inv-btn" data-inv-stake="' + esc(s.a) + '" aria-label="' + esc('Open the claim stake in ' + (s.sysName || 'its system')) + '">Open stake</button>' : '') + '</article>';
        }).join('');
        var more = m.stakes.length > limit ? '<button type="button" class="inv-more" data-inv-more>Show ' + Math.min(STAKE_LIMIT, m.stakes.length - limit) + ' more of ' + (m.stakes.length - limit) + '</button>' : '';
        var stakes = '<section class="inv-sec" data-inv-sec="stakes">' + head('Claim stakes', plural(t.stakes, 'claim stake') + ', ' + plural(t.buildings, 'building')) +
            (cards ? kinds + '<div class="inv-stakes">' + cards + '</div>' + more : '<p class="inv-none">No claim stake in this read.</p>') + '</section>';

        return '<div class="inv-page' + (o.mine ? ' inv-mine' : '') + '" data-fa="' + esc(m.fa) + '">' +
            '<div class="inv-head"><div class="inv-head-t"><div class="inv-kind">' + (o.mine ? 'My inventory' : 'Inventory') + '</div><h2 class="inv-h' + (o.mine ? ' c4-me' : '') + '" id="c4InvTitle">' + esc(who) + (o.mine ? '<i class="c4-me-tag">You</i>' : '') + '</h2></div>' +
            '<button type="button" class="inv-x" data-inv-close aria-label="Close the inventory">&times;</button></div>' +
            '<div class="inv-tots">' + tots + '</div>' +
            (m.empty ? '<p class="inv-none big">This profile holds no fleet and no claim stake in the latest read.</p>' : hangar + cargo + crew + stakes) + '</div>';
    }

    // ================================================================ DOM (browser only)
    var V = null;   // { el, ctx, p, cat, limit, open, from, art, artP, tok, hide }
    function reduced() { return !!(V && V.ctx && V.ctx.reducedMotion); }
    function isOpen() { return !!(V && V.open); }
    function cssEsc(s) { return typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(s) : String(s).replace(/[^A-Za-z0-9_-]/g, '\\$&'); }
    function loadArt() {
        if (V.artP || !FVX) return;
        var base = V.ctx.artBase || '';
        V.artP = fetch(base + 'manifest.json', { cache: 'force-cache' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
            .then(function (m) { if (!V) return; if (!m) { V.artP = null; return; } V.art = FVX.artIndex(m); if (isOpen()) draw(false); });
    }
    function draw(animate) {
        var el = V.el, c = V.ctx, top = el.scrollTop;
        var m = build(c.latest, V.p, { art: V.art, catOf: c.catOf || null });
        el.innerHTML = html(m, { ownerName: c.ownerName ? c.ownerName(V.p) : '', mine: !!(c.isMine && c.isMine(V.p)), artBase: c.artBase, stakeArtBase: c.stakeArtBase, iconOf: c.iconOf,
            cat: V.cat, stakeLimit: V.limit, canFleets: typeof c.openFleets === 'function', canStake: typeof c.openStake === 'function' });
        el.classList.toggle('inv-still', !animate || reduced());
        el.setAttribute('aria-labelledby', 'c4InvTitle');
        [].forEach.call(el.querySelectorAll('img'), function (im) { im.addEventListener('error', function () { im.classList.add('inv-broken'); }); });
        if (!animate) el.scrollTop = top;
    }
    function focusFirst(sel) { var n = V.el.querySelector(sel) || V.el; if (n && n.focus) n.focus({ preventScroll: true }); }
    function open(el, ctx, p) {
        if (!el || !ctx || !ctx.latest) return false;
        var was = V;
        V = { el: el, ctx: ctx, p: p, cat: 'all', limit: STAKE_LIMIT, open: true, tok: (was ? was.tok : 0) + 1, from: was && was.open ? was.from : document.activeElement,
            art: was ? was.art : null, artP: was ? was.artP : null, hide: null };
        if (was) clearTimeout(was.hide);
        draw(true);
        el.hidden = false; el.setAttribute('aria-hidden', 'false');
        void el.offsetWidth;
        el.classList.add('open'); el.scrollTop = 0;
        focusFirst('.inv-x');
        loadArt();
        return true;
    }
    function refresh(ctx) { if (!isOpen()) return; V.ctx = ctx; if (!ctx.latest) { close(); return; } draw(false); }
    function close(keepFocus) {
        if (!isOpen()) return;
        var v = V, el = v.el;
        v.open = false; v.tok++;
        el.classList.remove('open'); el.setAttribute('aria-hidden', 'true');
        v.hide = setTimeout(function () { if (V === v && !v.open) { el.hidden = true; el.innerHTML = ''; } }, reduced() ? 0 : 380);
        if (keepFocus) return;
        var back = v.from && v.from.isConnected ? v.from : document.querySelector('[data-inv="' + cssEsc(v.p) + '"]');
        if (back && back.focus) back.focus({ preventScroll: true });
    }
    // returns true when the click belonged to the inventory
    function onClick(e) {
        if (!isOpen()) return false;
        var t = e.target; if (!t || !t.closest || !V.el.contains(t)) return false;
        var b, c = V.ctx, p = V.p;
        if (t.closest('[data-inv-close]')) { close(); return true; }
        if ((b = t.closest('[data-inv-cat]'))) { V.cat = b.getAttribute('data-inv-cat'); draw(false); focusFirst('[data-inv-cat="' + cssEsc(V.cat) + '"]'); return true; }
        if (t.closest('[data-inv-more]')) { V.limit += STAKE_LIMIT; draw(false); return true; }
        if (t.closest('[data-inv-fleets]')) { close(true); if (typeof c.openFleets === 'function') c.openFleets(p); return true; }
        if ((b = t.closest('[data-inv-stake]'))) { var a = b.getAttribute('data-inv-stake'); close(true); if (typeof c.openStake === 'function') c.openStake(a); return true; }
        return true;   // any other click inside the view stays inside it
    }
    // returns true when the key was handled; while the view is open it is modal (Tab stays inside, page shortcuts are off)
    function onKey(e) {
        if (!isOpen()) return false;
        if (e.key === 'Escape') { close(); return true; }
        if (e.key === 'Tab') {
            var el = V.el, fs = [].slice.call(el.querySelectorAll('button, [href], [tabindex]')).filter(function (n) { return !n.disabled && n.tabIndex >= 0 && n.offsetParent !== null; });
            if (!fs.length) { e.preventDefault(); el.focus({ preventScroll: true }); return true; }
            var a = document.activeElement, first = fs[0], last = fs[fs.length - 1];
            if (e.shiftKey) { if (a === first || !el.contains(a) || a === el) { e.preventDefault(); last.focus({ preventScroll: true }); } }
            else if (a === last || !el.contains(a)) { e.preventDefault(); first.focus({ preventScroll: true }); }
        }
        return true;
    }

    var api = { version: '1', STAKE_LIMIT: STAKE_LIMIT, CAT_ORDER: CAT_ORDER, compact: compact, build: build, html: html, open: open, close: close, refresh: refresh, isOpen: isOpen, onClick: onClick, onKey: onKey };
    if (typeof window === 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.C4Inventory = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
