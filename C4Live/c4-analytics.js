/* C4 Live analytics charts: window.C4Analytics = { version, build(latest, bodies), render(el, model, opts), sections }.
   build() is pure (no DOM, no clock, no fetch) and safe on missing or old fields: every figure is derived from the chain
   rows in latest.json / bodies.json and nothing else. render() fills el with inline SVG built as an HTML string whose
   styling comes only from classes in c4-analytics.css and SVG presentation attributes (no style attribute, no <script>);
   every string that came from the chain is escaped. Quartiles are linear interpolation between order statistics.
   Plain script, no dependencies. In Node it also module.exports the same object. */
(function (root) {
    'use strict';

    var SECTIONS = ['mining', 'council', 'stakes', 'compare', 'economy', 'config'];
    var SIZE_ORDER = ['xx-small', 'x-small', 'small', 'medium', 'large', 'capital', 'commander', 'titan'];
    var FACS = ['mud', 'oni', 'ustur', 'unaligned'];
    var FAC_NAME = { mud: 'MUD', oni: 'ONI', ustur: 'Ustur', unaligned: 'Unaligned' };
    var KIND_ORDER = ['central_hub', 'cultivation_hub', 'extraction_hub', 'processing_hub', 'storage_hub', 'farm_hub',
        'power_plant', 'crew_quarters', 'storage_module', 'farm', 'extractor', 'processor'];
    var HOUR = 3600;
    var FRESH = 'needs a fresh read';

    // ---------------------------------------------------------------- numbers
    function fin(v) { return typeof v === 'number' && isFinite(v); }
    function arr(v) { return Array.isArray(v) ? v : []; }
    function obj(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : null; }
    function str(v) { return typeof v === 'string' ? v : ''; }
    function fac(f) { return FACS.indexOf(f) >= 0 ? f : 'unaligned'; }
    function quantile(sorted, q) {
        if (!sorted.length) return null;
        var p = (sorted.length - 1) * q, lo = Math.floor(p), hi = Math.ceil(p);
        return sorted[lo] + (sorted[hi] - sorted[lo]) * (p - lo);
    }
    function stats(vals) {
        var s = vals.filter(fin).sort(function (a, b) { return a - b; });
        if (!s.length) return null;
        return { n: s.length, min: s[0], q1: quantile(s, 0.25), med: quantile(s, 0.5), q3: quantile(s, 0.75), max: s[s.length - 1] };
    }
    function median(vals) { var s = stats(vals); return s ? s.med : null; }
    function sum(vals) { var t = 0; for (var i = 0; i < vals.length; i++) t += vals[i]; return t; }
    function sumN(rows) { var t = 0; rows.forEach(function (e) { t += e.n; }); return t; }
    function sumArr(a) { var t = 0; a.forEach(function (v) { t += v; }); return t; }
    function dict() { return Object.create(null); }   // a map keyed by chain strings: a name like __proto__ or constructor is a plain key
    function bump(map, key, by) { map[key] = (map[key] || 0) + by; }
    function sizeRank(s) { var i = SIZE_ORDER.indexOf(s); return i < 0 ? 100 : i; }
    // a ship config name as shown: without the trailing " Default Config" (the full name stays in the hover text and the card)
    function shortModel(n) { return String(n).replace(/\s+Default Config$/, ''); }
    // the ships of a fleet as [{name, n}], largest first (ties by name); types = {shipConfigName: count}
    function compOf(types) {
        var t = obj(types), out = [];
        if (!t) return out;
        Object.keys(t).forEach(function (k) { if (fin(t[k]) && t[k] > 0) out.push({ name: k, n: t[k] }); });
        return out.sort(function (a, b) { return b.n - a.n || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0); });
    }
    // buildings of one kind on a stake, by the same floor rule as the building counts; null when the stake lists no buildings
    function kindCount(s, kind) {
        if (!Array.isArray(s.bl)) return null;
        var t = 0;
        s.bl.forEach(function (b) { if (obj(b) && b.k === kind && fin(b.q) && b.q > 0) t += Math.floor(b.q); });
        return t;
    }

    // ---------------------------------------------------------------- build
    function build(latest, bodies, config) {
        var L = obj(latest) || {};
        var fleets = arr(L.fleets).filter(obj), owners = arr(L.owners).filter(obj), stakes = arr(L.stakes).filter(obj);
        var bodyList = bodies && Array.isArray(bodies.bodies) ? bodies.bodies.filter(obj) : null;
        var ownerFac = dict();
        var ownerName = dict();
        owners.forEach(function (o) { if (str(o.p)) { ownerFac[o.p] = fac(o.fa); if (str(o.name)) ownerName[o.p] = o.name; } });
        var model = {
            version: '1',
            counts: { fleets: fleets.length, owners: owners.length, stakes: stakes.length },
            mining: buildMining(fleets, ownerName),
            council: buildCouncil(owners),
            stakes: buildStakes(stakes, bodyList, ownerName),
            compare: null,
            economy: null,
            config: buildConfig(config)
        };
        model.compare = buildCompare(fleets, owners, stakes, ownerFac, model.mining.rows, model.stakes, ownerName);
        model.economy = buildEconomy(arr(L.systems).filter(obj), model.mining.rows, stakes, ownerName);
        return model;
    }

    function buildMining(fleets, ownerName) {
        var rows = [], miningFleets = 0;
        fleets.forEach(function (f) {
            if (!(obj(f.s) && f.s.kind === 'mining')) return;
            miningFleets++;
            var m = obj(f.mine);
            if (!m || !fin(m.ups) || !(m.ups > 0) || !fin(f.ships) || !(f.ships > 0)) return;
            var crew = fin(f.crew) && f.crew > 0 ? f.crew : 0;
            var comp = compOf(f.types), outs = arr(m.out).filter(function (x) { return obj(x) && str(x.r) && fin(x.ups) && x.ups >= 0; });
            rows.push({
                // detail the dot cards show, kept on the row so no card looks a fleet up again from a rounded label
                a: str(f.a), o: str(f.o), owner: str(f.o) && ownerName[f.o] ? ownerName[f.o] : '', comp: comp, pure: comp.length === 1 ? comp[0].name : null,
                mines: outs.slice().sort(function (a, b) { return b.ups - a.ups || (a.r < b.r ? -1 : 1); }).map(function (x) { return x.r; }),
                n: str(f.n), fa: fac(f.fa), ships: f.ships, crew: crew, size: str(f.flagSize) || 'unknown',
                ups: m.ups, base: fin(m.baseUps) && m.baseUps > 0 ? m.baseUps : 0,
                yps: m.ups / f.ships, ypc: crew > 0 ? m.ups / crew : null,
                out: arr(m.out).filter(function (x) { return obj(x) && str(x.r) && fin(x.ups) && x.ups >= 0; })
            });
        });
        // by flagship size
        var sizes = dict();
        rows.forEach(function (r) { (sizes[r.size] = sizes[r.size] || []).push(r); });
        var bySize = Object.keys(sizes).sort(function (a, b) { return sizeRank(a) - sizeRank(b) || (a < b ? -1 : 1); }).map(function (k) {
            var list = sizes[k], st = stats(list.map(function (r) { return r.yps; }));
            var cs = stats(list.filter(function (r) { return r.ypc != null; }).map(function (r) { return r.ypc; }));
            return { size: k, n: st.n, min: st.min, q1: st.q1, med: st.med, q3: st.q3, max: st.max, crew: cs };
        });
        var scatter = rows.map(function (r, i) { return { n: r.n, fa: r.fa, ships: r.ships, yps: r.yps, k: 'f' + i }; });
        rows.forEach(function (r, i) { r.k = 'f' + i; });
        var rich = rows.filter(function (r) { return r.base > 0; });
        var ratios = rich.map(function (r) { return r.ups / r.base; });
        var richness = {
            points: rich.map(function (r) { return { n: r.n, fa: r.fa, base: r.base, ups: r.ups, k: r.k }; }),
            excluded: rows.length - rich.length, medianRatio: median(ratios)
        };
        var res = dict();
        rows.forEach(function (r) {
            var seen = dict();
            r.out.forEach(function (o) {
                var e = res[o.r] = res[o.r] || { r: o.r, ups: 0, ships: 0, fleets: 0 };
                e.ups += o.ups;
                if (!seen[o.r]) { seen[o.r] = 1; e.ships += r.ships; e.fleets++; }
            });
        });
        var topRes = Object.keys(res).map(function (k) { var e = res[k]; return { r: e.r, ups: e.ups, ships: e.ships, fleets: e.fleets, yps: e.ships > 0 ? e.ups / e.ships : 0 }; })
            .filter(function (e) { return e.ships > 0; })
            .sort(function (a, b) { return b.yps - a.yps || (a.r < b.r ? -1 : 1); });
        return {
            fleetsRead: fleets.length, miningFleets: miningFleets, n: rows.length, rows: rows,
            bySize: bySize, scatter: scatter, richness: richness, topRes: topRes.slice(0, 10), resTotal: topRes.length
        };
    }

    function buildCouncil(owners) {
        var groups = dict(), unranked = 0;
        owners.forEach(function (o) {
            if (!fin(o.rank)) { unranked++; return; }
            (groups[o.rank] = groups[o.rank] || []).push(o);
        });
        function vals(list, fn) { return list.map(fn).filter(fin); }
        var ranks = Object.keys(groups).map(Number).sort(function (a, b) { return a - b; }).map(function (k) {
            var g = groups[k];
            var lv = vals(g, function (o) { var x = obj(o.xp), m = x && obj(x.mining); return m ? m.lvl : NaN; });
            return {
                rank: k, n: g.length,
                fleets: median(vals(g, function (o) { return o.fleets; })),
                ships: median(vals(g, function (o) { return o.ships; })),
                stakes: median(vals(g, function (o) { return o.stakes; })),
                ups: median(vals(g, function (o) { return o.ups; })),
                atlas: median(vals(g, function (o) { return o.atlas; })),
                lvl: median(lv), lvls: lv.slice().sort(function (a, b) { return a - b; })
            };
        });
        return { owners: owners.length, ranked: owners.length - unranked, unranked: unranked, ranks: ranks };
    }

    // Emission and starbases (2026-11-23): what enters the economy at the rate of this read, who produces it, and the level
    // every starbase stands at. A rate is units per SECOND in the read; a "day" here is that rate times 86,400, not a measured day.
    var DAY = 86400, ECO_TOP = 12, ECO_HEAD = 5;
    function buildEconomy(systems, mrows, stakes, ownerName) {
        var res = dict(), who = dict(), ships = 0, st = 0;
        function add(r, o, ups, side) {
            var e = res[r] = res[r] || { r: r, ships: 0, stakes: 0 };
            e[side] += ups;
            if (o) bump(who, o, ups);
        }
        mrows.forEach(function (m) { m.out.forEach(function (x) { add(x.r, m.o, x.ups, 'ships'); ships += x.ups; }); });
        var stakesOut = 0;
        stakes.forEach(function (s) {
            var any = false;
            arr(s.out).forEach(function (x) { if (obj(x) && str(x.r) && fin(x.ps) && x.ps > 0) { add(x.r, str(s.o), x.ps, 'stakes'); st += x.ps; any = true; } });
            if (any) stakesOut++;
        });
        var list = Object.keys(res).map(function (k) { var e = res[k]; return { r: e.r, ships: e.ships * DAY, stakes: e.stakes * DAY, day: (e.ships + e.stakes) * DAY }; })
            .filter(function (e) { return e.day > 0; })
            .sort(function (a, b) { return b.day - a.day || (a.r < b.r ? -1 : 1); });
        var prod = Object.keys(who).map(function (p) { return { o: p, owner: ownerName[p] || '', day: who[p] * DAY }; })
            .filter(function (e) { return e.day > 0; })
            .sort(function (a, b) { return b.day - a.day || (a.o < b.o ? -1 : 1); });
        var total = (ships + st) * DAY, head = sum(prod.slice(0, ECO_HEAD).map(function (e) { return e.day; }));
        var named = sum(prod.map(function (e) { return e.day; }));
        // sinks the read can see: what claim stakes consume each second, and the ATLAS sitting in their rent balances
        var use = dict(), stakesUse = 0, rentBal = 0, rentN = 0, emitDay = dict();
        list.forEach(function (e) { emitDay[e.r] = e.day; });
        stakes.forEach(function (s) {
            var any = false, r = obj(s.rent);
            arr(s.use).forEach(function (x) { if (obj(x) && str(x.r) && fin(x.ps) && x.ps > 0) { bump(use, x.r, x.ps); any = true; } });
            if (any) stakesUse++;
            if (r && fin(r.bal) && r.bal >= 0) { rentBal += r.bal; rentN++; }
        });
        var sinks = Object.keys(use).map(function (k) { return { r: k, day: use[k] * DAY, emit: emitDay[k] || 0 }; })
            .sort(function (a, b) { return b.day - a.day || (a.r < b.r ? -1 : 1); });
        // starbases: one row per level, split by the faction that holds the system
        var lv = dict(), sbN = 0;
        systems.forEach(function (s) {
            if (!fin(s.lvl) || s.lvl < 0 || Math.floor(s.lvl) !== s.lvl) return;
            var e = lv[s.lvl] = lv[s.lvl] || { lvl: s.lvl, n: 0, by: { mud: 0, oni: 0, ustur: 0, unaligned: 0 } };
            e.n++; e.by[fac(s.f)]++; sbN++;
        });
        return {
            res: list.slice(0, ECO_TOP), resTotal: list.length, day: total, shipsDay: ships * DAY, stakesDay: st * DAY,
            fleets: mrows.length, stakesOut: stakesOut,
            sinks: sinks, sinkDay: sum(sinks.map(function (e) { return e.day; })), stakesUse: stakesUse, rentBal: rentBal, rentN: rentN, stakesRead: stakes.length,
            producers: prod.length, median: median(prod.map(function (e) { return e.day; })), mean: prod.length ? named / prod.length : null,
            head: prod.slice(0, ECO_HEAD), headDay: head, restDay: named - head, namedDay: named,
            levels: Object.keys(lv).map(Number).sort(function (a, b) { return a - b; }).map(function (k) { return lv[k]; }), systems: sbN, systemsRead: systems.length
        };
    }

    // Game rules (2026-11-23): the summary of the chain's config tables (C4Live/config-summary.json, built by
    // Tools/c4-live/config-summary.mjs). Everything is checked here: a missing or malformed file gives null and the section says so.
    function buildConfig(c) {
        c = obj(c);
        var r = c && obj(c.recipes), sh = c && obj(c.ships), tl = c && obj(c.tolls), rs = c && obj(c.research);
        if (!r || !sh || !tl || !rs || !fin(r.n)) return null;
        function rows(a, keys) {
            return arr(a).filter(function (x) { return obj(x) && keys.every(function (k) { return k.charAt(0) === '$' ? str(x[k.slice(1)]) !== '' : fin(x[k]); }); });
        }
        var up = rows(r.upgrade, ['$r', 'lp', 'raw']).filter(function (u) { return u.raw > 0; });
        return {
            takenAt: fin(c.takenAt) ? c.takenAt : null, sage: fin(c.sage) ? c.sage : null,
            recipes: {
                n: r.n, outputs: fin(r.outputs) ? r.outputs : null, multi: fin(r.multi) ? r.multi : null, gated: fin(r.gated) ? r.gated : null,
                withFee: fin(r.withFee) ? r.withFee : null, feeAtlas: fin(r.feeAtlas) ? r.feeAtlas : null,
                byLevel: rows(r.byLevel, ['lvl', 'n']), rawN: fin(r.rawN) ? r.rawN : null, rawUse: rows(r.rawUse, ['$r', 'n']),
                dear: rows(r.dear, ['$r', 'min']), dearN: fin(r.dearN) ? r.dearN : null, rawEqMedian: fin(r.rawEqMedian) ? r.rawEqMedian : null,
                upgrade: up.map(function (u) { return { r: u.r, lp: u.lp, raw: u.raw, per: u.lp / u.raw }; })
            },
            ships: { configs: fin(sh.configs) ? sh.configs : null, hulls: fin(sh.hulls) ? sh.hulls : null, bySize: rows(sh.bySize, ['$size', 'n']) },
            tolls: { allied: fin(tl.allied) ? tl.allied / 100 : null, neutral: fin(tl.neutral) ? tl.neutral / 100 : null, crossFaction: tl.crossFaction === true, research: rows(tl.research, ['$r', 'mod', 'atlas']) },
            research: { n: fin(rs.n) ? rs.n : null, paid: fin(rs.paid) ? rs.paid : null, atlas: fin(rs.atlas) ? rs.atlas : null, byCost: rows(rs.byCost, ['atlas', 'n']) },
            stakes: rows(c.stakes, ['$r', 'slots'])
        };
    }

    function buildStakes(stakes, bodyList, ownerName) {
        var m = { n: stakes.length, state: 'none', has: { bl: false, pw: false, out: false, cap: false, use: false }, bodies: !!bodyList };
        if (!stakes.length) return m;
        var subOf = dict();
        if (bodyList) bodyList.forEach(function (b) { if (str(b.a)) subOf[b.a] = str(b.sub); });
        var type = dict(), tier = dict(), state = dict(), bpsDist = dict(), kinds = dict(), prod = dict(), perOwner = dict(), power = [], fills = [];
        var bpsN = 0, bpsFromBl = 0, prodStakes = 0, prodTotal = 0;
        // the stakes behind each bar of the two Buildings charts: per building count and per kind, each entry one stake with its count
        var distList = dict(), kindList = dict();
        var entry = function (s, v) { return { id: str(s.a), name: str(s.sysName), tier: fin(s.tier) ? s.tier : null, o: str(s.o), owner: ownerName && str(s.o) && ownerName[s.o] ? ownerName[s.o] : '', v: v }; };
        var byCount = function (a, b) { return b.v - a.v || (a.owner < b.owner ? -1 : a.owner > b.owner ? 1 : 0) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0); };
        var fuelB = [0, 0, 0, 0, 0, 0], fuelN = 0, burnTotal = 0, burnStakes = 0;
        stakes.forEach(function (s) {
            bump(type, (bodyList && subOf[s.body]) || 'unknown', 1);
            bump(tier, fin(s.tier) ? String(s.tier) : 'unknown', 1);
            bump(state, str(s.st) || 'unknown', 1);
            if (str(s.o)) bump(perOwner, s.o, 1);
            var cnt = null;
            if (Array.isArray(s.bl)) {
                m.has.bl = true; bpsFromBl++;
                cnt = 0;
                var kq = dict();
                s.bl.forEach(function (b) {
                    if (!obj(b)) return;
                    var q = fin(b.q) && b.q > 0 ? Math.floor(b.q) : 0;   // one rule with the stake view: floor of a positive number, else not counted
                    if (!(q > 0)) return;
                    cnt += q; bump(kinds, str(b.k) || 'unknown', q); bump(kq, str(b.k) || 'unknown', q);
                });
                Object.keys(kq).forEach(function (k) { (kindList[k] = kindList[k] || []).push(entry(s, kq[k])); });
            } else if (fin(s.b) && s.b >= 0) cnt = s.b;
            if (cnt != null) { bump(bpsDist, cnt, 1); bpsN++; (distList[cnt] = distList[cnt] || []).push(entry(s, cnt)); }
            var pw = obj(s.pw);
            if (pw && fin(pw.gen) && fin(pw.use)) {
                m.has.pw = true;
                power.push({ sysName: str(s.sysName), a: str(s.a), gen: pw.gen, use: pw.use, net: pw.gen - pw.use });
            }
            var cap = obj(s.cap);
            if (cap && fin(cap.used) && fin(cap.total)) {
                m.has.cap = true;
                if (cap.total > 0) fills.push(cap.used / cap.total);
            }
            if (Array.isArray(s.out)) {
                m.has.out = true; prodStakes++;
                s.out.forEach(function (o) { if (obj(o) && str(o.r) && fin(o.ps) && o.ps >= 0) { bump(prod, o.r, o.ps * HOUR); prodTotal += o.ps * HOUR; } });
            }
            if (Array.isArray(s.use)) {
                m.has.use = true;
                var burn = 0;
                s.use.forEach(function (u) { if (obj(u) && u.r === 'Fuel' && fin(u.ps) && u.ps > 0) burn += u.ps * HOUR; });
                if (burn > 0) { burnTotal += burn; burnStakes++; }
                if (fin(s.fuel) && s.fuel >= 0) {
                    fuelN++;
                    if (!(burn > 0)) fuelB[5]++;                  // fuel held but nothing burns it: never "empty"
                    else { var h = s.fuel / burn; fuelB[h === 0 ? 0 : h < 6 ? 1 : h < 24 ? 2 : h < 72 ? 3 : 4]++; }
                }
            }
        });
        m.fuel = { n: fuelN, buckets: fuelB, burnPh: burnTotal, burnStakes: burnStakes };
        var anyNew = m.has.bl || m.has.pw || m.has.out || m.has.cap || m.has.use;
        m.state = anyNew ? 'full' : 'old';
        function rowsOf(map, numeric) {
            return Object.keys(map).map(function (k) { return { k: k, n: map[k] }; }).sort(function (a, b) {
                if (numeric) return Number(a.k) - Number(b.k);
                return b.n - a.n || (a.k < b.k ? -1 : 1);
            });
        }
        m.byType = rowsOf(type); m.byTier = rowsOf(tier, true); m.byState = rowsOf(state);
        m.bldSource = bpsFromBl ? 'bl' : 'b';
        m.bldDist = rowsOf(bpsDist, true); m.bldN = bpsN;
        m.kinds = KIND_ORDER.filter(function (k) { return kinds[k]; }).map(function (k) { return { k: k, n: kinds[k] }; })
            .concat(Object.keys(kinds).filter(function (k) { return KIND_ORDER.indexOf(k) < 0; }).sort().map(function (k) { return { k: k, n: kinds[k] }; }));
        m.bldDist.forEach(function (e) { e.list = (distList[e.k] || []).sort(byCount); });
        m.kinds.forEach(function (e) { e.list = (kindList[e.k] || []).sort(byCount); });
        m.power = power.sort(function (a, b) { return Math.abs(b.net) - Math.abs(a.net) || (a.a < b.a ? -1 : 1); });
        m.powerSurplus = power.filter(function (p) { return p.net > 0; }).length;
        m.powerDeficit = power.filter(function (p) { return p.net < 0; }).length;
        var edges = [0, 0, 0, 0, 0];
        fills.forEach(function (f) { edges[Math.max(0, Math.min(4, Math.floor(f * 5)))]++; });
        m.fill = { n: fills.length, buckets: edges, med: median(fills) };
        m.prod = rowsOf(prod).map(function (e) { return { r: e.k, uph: e.n }; }).sort(function (a, b) { return b.uph - a.uph || (a.r < b.r ? -1 : 1); });
        m.prodStakes = prodStakes; m.prodTotal = prodTotal;
        var ownerDist = dict(); Object.keys(perOwner).forEach(function (o) { bump(ownerDist, perOwner[o], 1); });
        m.ownerDist = rowsOf(ownerDist, true); m.stakeOwners = Object.keys(perOwner).length;
        // the total each count chart takes its shares of (the sum of that chart's own rows, so a full row set adds to 100)
        m.tot = { type: sumN(m.byType), tier: sumN(m.byTier), state: sumN(m.byState), bld: sumN(m.bldDist), kinds: sumN(m.kinds), fill: sumArr(m.fill.buckets), fuel: sumArr(m.fuel.buckets), prod: prodTotal, owners: sumN(m.ownerDist) };
        return m;
    }

    function buildCompare(fleets, owners, stakes, ownerFac, mrows, sm, ownerName) {
        var c = { stakesPresent: stakes.length > 0, hasOut: !!(sm.has && sm.has.out) };
        // per resource: units per hour, ships vs stakes
        var ships = dict(), st = dict();
        mrows.forEach(function (r) { r.out.forEach(function (o) { bump(ships, o.r, o.ups * HOUR); }); });
        // like with like: a stake output counts only if some mining fleet in this same read also lists it (a data-derived "mined raw");
        // crafted goods such as Fuel or Ammunition that stakes also output would otherwise be set against ships that cannot mine them
        var mined = dict(), otherOut = dict();
        mrows.forEach(function (r) { r.out.forEach(function (o) { mined[o.r] = 1; }); });
        function minedOut(s) { return arr(s.out).filter(function (o) { return obj(o) && str(o.r) && fin(o.ps) && o.ps >= 0 && (mined[o.r] === 1 || (otherOut[o.r] = 1, false)); }); }
        stakes.forEach(function (s) { minedOut(s).forEach(function (o) { bump(st, o.r, o.ps * HOUR); }); });
        c.minedN = Object.keys(mined).length;
        var names = dict(); Object.keys(ships).forEach(function (k) { names[k] = 1; }); Object.keys(st).forEach(function (k) { names[k] = 1; });
        var res = Object.keys(names).map(function (k) { return { r: k, ships: ships[k] || 0, stakes: st[k] || 0 }; })
            .sort(function (a, b) { return (b.ships + b.stakes) - (a.ships + a.stakes) || (a.r < b.r ? -1 : 1); });
        c.resTotal = res.length; c.res = res.slice(0, 8); c.otherOut = Object.keys(otherOut).sort();
        // output per crew
        var fu = 0, fc = 0, fn = 0;
        mrows.forEach(function (r) { if (r.crew > 0) { fu += r.ups * HOUR; fc += r.crew; fn++; } });
        var su = 0, sc = 0, sn = 0;
        stakes.forEach(function (s) {
            if (!Array.isArray(s.out) || !(fin(s.crew) && s.crew > 0)) return;
            var t = 0; minedOut(s).forEach(function (o) { t += o.ps; });
            su += t * HOUR; sc += s.crew; sn++;
        });
        c.crew = { fleets: { n: fn, crew: fc, uph: fu, perCrew: fc > 0 ? fu / fc : null }, stakes: { n: sn, crew: sc, uph: su, perCrew: sc > 0 ? su / sc : null } };
        // per faction share of raw output
        var fa = {}; FACS.forEach(function (f) { fa[f] = { fa: f, ships: 0, stakes: 0 }; });
        mrows.forEach(function (r) { fa[r.fa].ships += r.ups * HOUR; });
        stakes.forEach(function (s) {
            var f = fac(ownerFac[s.o]);
            minedOut(s).forEach(function (o) { fa[f].stakes += o.ps * HOUR; });
        });
        c.factions = FACS.map(function (f) { var e = fa[f], t = e.ships + e.stakes; return { fa: f, ships: e.ships, stakes: e.stakes, total: t, shipShare: t > 0 ? e.ships / t : null }; })
            .filter(function (e) { return e.total > 0; });
        // owners: ships only / stakes only / both / neither
        var uni = dict(), hasShips = dict(), hasStakes = dict();
        owners.forEach(function (o) { if (str(o.p)) uni[o.p] = 1; });
        fleets.forEach(function (f) {
            if (f.npc || !str(f.o)) return;
            uni[f.o] = 1;
            if (obj(f.s) && f.s.kind === 'mining' && obj(f.mine) && fin(f.mine.ups) && f.mine.ups > 0) hasShips[f.o] = 1;
        });
        stakes.forEach(function (s) { if (str(s.o)) { uni[s.o] = 1; hasStakes[s.o] = 1; } });
        var mix = { shipsOnly: 0, stakesOnly: 0, both: 0, neither: 0, total: 0 };
        Object.keys(uni).forEach(function (p) {
            mix.total++;
            if (hasShips[p] && hasStakes[p]) mix.both++; else if (hasShips[p]) mix.shipsOnly++; else if (hasStakes[p]) mix.stakesOnly++; else mix.neither++;
        });
        c.mix = mix;
        c.miningRows = mrows.length;
        c.rate = buildRate(mrows, stakes, minedOut, ownerName, sm);
        return c;
    }

    // ship models and claim stake tiers on one axis, units per second. A ship row = the median yield PER SHIP over the mining fleets made
    // only of that model; a tier row = the median stored production per stake (resources ships also mine) over stakes with any of it;
    // under a tier, rows by the number of extractors installed (needs the building list)
    function buildRate(mrows, stakes, minedOut, ownerName, sm) {
        var R = { rows: [], mixed: 0, pureFleets: 0, noOut: !(sm.has && sm.has.out), noStakes: !stakes.length, noBl: !(sm.has && sm.has.bl), stakesCounted: 0, noExtractor: 0 };
        var byModel = dict();
        mrows.forEach(function (r) { if (r.pure) { (byModel[r.pure] = byModel[r.pure] || []).push(r); R.pureFleets++; } else R.mixed++; });
        var items = Object.keys(byModel).map(function (k) {
            var l = byModel[k];
            return { kind: 'model', model: k, label: shortModel(k), v: median(l.map(function (r) { return r.yps; })), n: l.length,
                list: l.map(function (r) { return { id: r.a, kind: 'fleet', name: r.n, owner: r.owner, o: r.o, v: r.yps }; }) };
        });
        var tiers = dict();
        stakes.forEach(function (s) {
            if (!Array.isArray(s.out) || !fin(s.tier)) return;
            var t = 0; minedOut(s).forEach(function (o) { t += o.ps; });
            if (!(t > 0)) return;
            R.stakesCounted++;
            var e = { id: str(s.a), kind: 'stake', name: str(s.sysName), tier: s.tier, owner: str(s.o) && ownerName[s.o] ? ownerName[s.o] : '', o: str(s.o), v: t, ext: kindCount(s, 'extractor') };
            (tiers[s.tier] = tiers[s.tier] || []).push(e);
        });
        Object.keys(tiers).forEach(function (k) {
            var l = tiers[k], it = { kind: 'tier', tier: Number(k), label: 'tier ' + k, v: median(l.map(function (e) { return e.v; })), n: l.length, list: l, ext: [] };
            // one row per exact number of extractors found on this tier's stakes (0, 1, 2, 3, 4, ...), fewest first
            var byN = dict();
            l.forEach(function (e) { if (e.ext == null) return; var key = e.ext; (byN[key] = byN[key] || []).push(e); });
            Object.keys(byN).map(Number).sort(function (a, b) { return a - b; }).forEach(function (n) {
                var sub = byN[n];
                it.ext.push({ kind: 'ext', ext: n, label: n === 0 ? 'no extractor' : n === 1 ? '1 extractor' : n + ' extractors', v: median(sub.map(function (e) { return e.v; })), n: sub.length, list: sub });
            });
            items.push(it);
        });
        items.sort(function (a, b) { return b.v - a.v || (a.label < b.label ? -1 : a.label > b.label ? 1 : 0); });
        items.forEach(function (it) { R.rows.push(it); (it.ext || []).forEach(function (x) { R.rows.push(x); }); });
        R.rows.forEach(function (r, i) { r.k = 'r' + i; });
        Object.keys(tiers).forEach(function (k) { tiers[k].forEach(function (e) { if (e.ext === 0) R.noExtractor++; }); });
        return R;
    }

    // ---------------------------------------------------------------- formatting
    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function fnum(v) {
        if (!fin(v)) return '-';
        var a = Math.abs(v);
        if (a === 0) return '0';
        if (a < 1000 && Math.floor(v) === v) return String(v);
        if (a >= 1000) return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (a >= 100) return v.toFixed(0);
        if (a >= 10) return v.toFixed(1);
        if (a >= 1) return v.toFixed(2);
        return Number(v.toPrecision(2)).toString();
    }
    function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
    function pretty(k) { return String(k).replace(/_/g, ' ').replace(/-/g, ' '); }

    // ---------------------------------------------------------------- axes
    function linAxis(max, integer) {
        if (!(max > 0)) max = 1;
        var raw = max / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
        var step = (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
        if (integer) step = Math.max(1, Math.ceil(step));
        var top = Math.ceil(max / step - 1e-9) * step, ticks = [];
        for (var v = 0; v <= top + step * 1e-6; v += step) ticks.push(Number(v.toPrecision(12)));
        return { lo: 0, hi: top, ticks: ticks, log: false };
    }
    function logAxis(min, max) {
        var lo = Math.floor(Math.log10(min) + 1e-9), hi = Math.ceil(Math.log10(max) - 1e-9);
        if (hi <= lo) hi = lo + 1;
        var ticks = []; for (var k = lo; k <= hi; k++) ticks.push(Math.pow(10, k));
        return { lo: Math.pow(10, lo), hi: Math.pow(10, hi), ticks: ticks, log: true };
    }
    function axisPos(ax, v, len) {
        var t = ax.log ? (Math.log10(v) - Math.log10(ax.lo)) / (Math.log10(ax.hi) - Math.log10(ax.lo)) : (v - ax.lo) / (ax.hi - ax.lo);
        return Math.max(0, Math.min(1, t)) * len;
    }
    function r1(v) { return Math.round(v * 10) / 10; }
    // a share (0-100) as text: one decimal under 10 %, none from 10 % up
    function pctTxt(p) { return (p < 10 ? (Math.round(p * 10) / 10).toFixed(1) : String(Math.round(p))) + '%'; }
    // per-card display mode, kept for the page's lifetime (module level, so a re-render on reload or resize keeps it)
    var SHARE_CARDS = ['council-rank', 'stakes-where', 'stakes-bld', 'stakes-storage', 'stakes-out', 'stakes-fuel', 'compare-res', 'compare-mix'];
    var modes = {};
    function isPct(id) { return modes[id] === 'pct'; }
    function setMode(m) { if (m !== 'pct' && m !== 'num') return; SHARE_CARDS.forEach(function (id) { modes[id] = m; }); }
    function getMode() {
        var p = SHARE_CARDS.filter(isPct).length;
        return p === SHARE_CARDS.length ? 'pct' : p === 0 ? 'num' : 'mixed';
    }

    // ---------------------------------------------------------------- SVG pieces (all return strings)
    function ctxEsc(ctx) { return ctx.esc; }
    function svg(ctx, W, H, label, body) {
        return '<svg class="c4an-svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' + ctx.esc(label) + '">' + body + '</svg>';
    }
    function tx(x, y, s, cls, anchor, ctx) {
        return '<text class="c4an-tx ' + cls + '" x="' + r1(x) + '" y="' + r1(y) + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + ctx.esc(s) + '</text>';
    }
    function clip(s, maxPx) {
        var n = Math.max(3, Math.floor(maxPx / 7.2));
        return s.length > n ? s.slice(0, n - 1) + '…' : s;
    }
    // bar with a rounded far end and a square base; dir +1 grows right, -1 grows left
    function hbar(x0, y, len, h, dir, cls, title, ctx) {
        len = Math.max(0, len);
        var d, r = Math.min(4, h / 2, len);
        if (len < 0.5) return '';
        if (dir > 0) d = 'M' + r1(x0) + ' ' + r1(y) + 'h' + r1(len - r) + 'a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + r + 'v' + r1(h - 2 * r) + 'a' + r + ' ' + r + ' 0 0 1 -' + r + ' ' + r + 'h-' + r1(len - r) + 'z';
        else d = 'M' + r1(x0) + ' ' + r1(y) + 'h-' + r1(len - r) + 'a' + r + ' ' + r + ' 0 0 0 -' + r + ' ' + r + 'v' + r1(h - 2 * r) + 'a' + r + ' ' + r + ' 0 0 0 ' + r + ' ' + r + 'h' + r1(len - r) + 'z';
        return '<path class="' + cls + '" d="' + d + '">' + (title ? '<title>' + ctx.esc(title) + '</title>' : '') + '</path>';
    }
    function maxLabelPx(rows, W, frac) {
        var m = 0; rows.forEach(function (r) { m = Math.max(m, String(r.label).length); });
        return Math.min(Math.max(m * 7.6 + 16, 56), W * frac);
    }

    // ranked / ordered horizontal bars, one series. rows: [{label, v, cls?, tip?, tag?}]
    function barList(ctx, rows, o) {
        o = o || {};
        var W = ctx.W, fmt = o.fmt || fnum, cls = o.cls || 'f-s1';
        // o.pct = the total the bars are a share of (percent mode); the bar then measures the share and the label prints it
        var pt = o.pct > 0 ? o.pct : 0;
        var shr = function (r) { return pt ? r.v / pt * 100 : r.v; };
        var vtx = function (r) { return pt ? pctTxt(shr(r)) : fmt(r.v); };
        var labW = maxLabelPx(rows, W, 0.45), valW = 6;
        rows.forEach(function (r) { valW = Math.max(valW, (vtx(r) + (r.tag ? ' ' + r.tag : '')).length * 6.2 + 8); });
        var plotW = Math.max(40, W - labW - valW), max = 0;
        rows.forEach(function (r) { max = Math.max(max, shr(r)); });
        var rowH = 22, H = rows.length * rowH + 4, b = '';
        rows.forEach(function (r, i) {
            var y = 2 + i * rowH, len = max > 0 ? shr(r) / max * plotW : 0;
            var tip = r.tip || (r.label + ': ' + fmt(r.v));
            b += tx(labW - 8, y + 14, clip(r.label, labW - 8), 'an-lab', 'end', ctx);
            b += hbar(labW, y + 3, Math.max(len, r.v > 0 ? 2 : 0), 14, 1, r.cls || cls, pt ? tip + ' (' + pctTxt(shr(r)) + ' of the total ' + fnum(pt) + ')' : tip, ctx);
            b += tx(labW + Math.max(len, 0) + 6, y + 14, vtx(r) + (r.tag ? ' ' + r.tag : ''), 'an-val', 'start', ctx);
            // a row with a key is one hit area that opens its detail card (the stakes behind the bar)
            if (r.k) b += '<rect class="an-hit" data-an-k="' + r.k + '" tabindex="0" role="button" aria-label="' + ctx.esc(tip + '. Open the list of stakes') + '" x="0" y="' + y + '" width="' + W + '" height="' + rowH + '"><title>' + ctx.esc(tip + '. Click for the stakes') + '</title></rect>';
        });
        return svg(ctx, W, H, o.label || 'Bar chart', '<line class="an-axis" x1="' + labW + '" y1="0" x2="' + labW + '" y2="' + H + '"/>' + b);
    }

    // diverging bars around zero. rows: [{label, v, tip}]
    function divBars(ctx, rows, o) {
        var W = ctx.W, labW = maxLabelPx(rows, W, 0.32), side = 44;
        var plotW = Math.max(60, W - labW - side * 2), max = 0;
        rows.forEach(function (r) { max = Math.max(max, Math.abs(r.v)); });
        var cx = labW + side + plotW / 2, half = plotW / 2, rowH = 22, H = rows.length * rowH + 4, b = '';
        rows.forEach(function (r, i) {
            var y = 2 + i * rowH, len = max > 0 ? Math.abs(r.v) / max * half : 0, pos = r.v >= 0;
            b += tx(labW - 6, y + 14, clip(r.label, labW - 8), 'an-lab', 'end', ctx);
            b += hbar(cx, y + 3, Math.max(len, r.v !== 0 ? 2 : 0), 14, pos ? 1 : -1, pos ? 'f-pos' : 'f-neg', r.tip, ctx);
            var sign = r.v > 0 ? '+' : '';
            b += pos ? tx(cx + len + 5, y + 14, sign + fnum(r.v), 'an-val', 'start', ctx) : tx(cx - len - 5, y + 14, fnum(r.v), 'an-val', 'end', ctx);
        });
        return svg(ctx, W, H, o.label || 'Surplus and deficit', '<line class="an-axis" x1="' + r1(cx) + '" y1="0" x2="' + r1(cx) + '" y2="' + H + '"/>' + b);
    }

    // median + middle half + whisker per row. rows: [{label, n, min, q1, med, q3, max}], log axis
    function rangeRows(ctx, rows, o) {
        var W = ctx.W, labW = Math.min(Math.max(maxLabelPx(rows, W, 0.3), 56), 90), nW = 46;
        var plotW = Math.max(80, W - labW - nW - 8), lo = Infinity, hi = 0;
        rows.forEach(function (r) { lo = Math.min(lo, r.min); hi = Math.max(hi, r.max); });
        var ax = logAxis(lo, hi), rowH = 26, top = 4, H = top + rows.length * rowH + 22, b = '';
        ax.ticks.forEach(function (t) {
            var x = labW + axisPos(ax, t, plotW);
            b += '<line class="an-grid" x1="' + r1(x) + '" y1="' + top + '" x2="' + r1(x) + '" y2="' + (H - 18) + '"/>' + tx(x, H - 4, fnum(t), 'an-tick', 'middle', ctx);
        });
        rows.forEach(function (r, i) {
            var y = top + i * rowH, my = y + rowH / 2;
            var x1 = labW + axisPos(ax, r.min, plotW), x2 = labW + axisPos(ax, r.max, plotW);
            var q1 = labW + axisPos(ax, r.q1, plotW), q3 = labW + axisPos(ax, r.q3, plotW), md = labW + axisPos(ax, r.med, plotW);
            b += tx(labW - 8, my + 4, clip(r.label, labW - 8), 'an-lab', 'end', ctx);
            b += '<line class="an-whisk ' + (o.cls || 'f-s1') + '" x1="' + r1(x1) + '" y1="' + r1(my) + '" x2="' + r1(x2) + '" y2="' + r1(my) + '"/>';
            b += '<rect class="an-iqr ' + (o.cls || 'f-s1') + '" x="' + r1(q1) + '" y="' + r1(my - 6) + '" width="' + r1(Math.max(2, q3 - q1)) + '" height="12" rx="3"><title>' +
                ctx.esc(r.label + ': median ' + fnum(r.med) + ', middle half ' + fnum(r.q1) + ' to ' + fnum(r.q3) + ', range ' + fnum(r.min) + ' to ' + fnum(r.max) + ', n=' + r.n) + '</title></rect>';
            b += '<circle class="an-med" cx="' + r1(md) + '" cy="' + r1(my) + '" r="4"/>';
            b += tx(W - 2, my + 4, 'n=' + r.n, 'an-sub', 'end', ctx);
        });
        return svg(ctx, W, H, o.label || 'Range chart', b);
    }

    // scatter. pts: [{x, y, fa?, tip}]. o: {xAxis, yAxis, diag, xTitle, yTitle}
    function scatter(ctx, pts, o) {
        var W = ctx.W, H = Math.round(Math.max(190, Math.min(280, W * 0.68)));
        var L = 46, R = 10, T = 8, B = 34, pw = W - L - R, ph = H - T - B, b = '';
        var xa = o.xAxis, ya = o.yAxis;
        xa.ticks.forEach(function (t) {
            var x = L + axisPos(xa, t, pw);
            b += '<line class="an-grid" x1="' + r1(x) + '" y1="' + T + '" x2="' + r1(x) + '" y2="' + (T + ph) + '"/>' + tx(x, T + ph + 13, fnum(t), 'an-tick', 'middle', ctx);
        });
        ya.ticks.forEach(function (t) {
            var y = T + ph - axisPos(ya, t, ph);
            b += '<line class="an-grid" x1="' + L + '" y1="' + r1(y) + '" x2="' + (L + pw) + '" y2="' + r1(y) + '"/>' + tx(L - 5, y + 4, fnum(t), 'an-tick', 'end', ctx);
        });
        b += '<line class="an-axis" x1="' + L + '" y1="' + (T + ph) + '" x2="' + (L + pw) + '" y2="' + (T + ph) + '"/>';
        if (o.diag) {
            var d0 = Math.max(xa.lo, ya.lo), d1 = Math.min(xa.hi, ya.hi);
            b += '<line class="an-diag" x1="' + r1(L + axisPos(xa, d0, pw)) + '" y1="' + r1(T + ph - axisPos(ya, d0, ph)) + '" x2="' + r1(L + axisPos(xa, d1, pw)) + '" y2="' + r1(T + ph - axisPos(ya, d1, ph)) + '"/>';
        }
        pts.forEach(function (p) {
            b += '<circle class="an-dot f-' + p.fa + '"' + (p.k ? ' data-an-k="' + p.k + '" tabindex="0" role="button" aria-label="' + ctx.esc(p.tip) + '"' : '') + ' cx="' + r1(L + axisPos(xa, p.x, pw) + (p.dx || 0)) + '" cy="' + r1(T + ph - axisPos(ya, p.y, ph)) + '" r="4"><title>' + ctx.esc(p.tip) + '</title></circle>';
        });
        b += tx(L + pw / 2, H - 3, o.xTitle, 'an-axt', 'middle', ctx);
        return svg(ctx, W, H, o.label || 'Scatter chart', b + '<text class="c4an-tx an-axt" text-anchor="middle" transform="rotate(-90 11 ' + r1(T + ph / 2) + ')" x="11" y="' + r1(T + ph / 2) + '">' + ctx.esc(o.yTitle) + '</text>');
    }

    // count heatmap: rows = groups, columns = integer values. groups: [{label, vals[]}]
    function heat(ctx, groups, o) {
        var W = ctx.W, labW = Math.min(Math.max(maxLabelPx(groups, W, 0.3), 56), 96), max = 0, top = 0;
        groups.forEach(function (g) { g.vals.forEach(function (v) { top = Math.max(top, v); }); });
        var cols = top + 1, plotW = W - labW - 6, cw = plotW / cols, rowH = 26, cellMax = 0, b = '';
        groups.forEach(function (g) {
            g.cnt = []; for (var i = 0; i < cols; i++) g.cnt.push(0);
            g.vals.forEach(function (v) { g.cnt[Math.max(0, Math.min(cols - 1, Math.round(v)))]++; });
            g.cnt.forEach(function (n) { cellMax = Math.max(cellMax, n); });
        });
        var H = 4 + groups.length * rowH + 20;
        groups.forEach(function (g, i) {
            var y = 4 + i * rowH;
            b += tx(labW - 8, y + 16, clip(g.label, labW - 8), 'an-lab', 'end', ctx);
            g.cnt.forEach(function (n, c) {
                var x = labW + c * cw, op = n > 0 ? 0.25 + 0.75 * (n / cellMax) : 0.07;
                b += '<rect class="' + (o.cls || 'f-s7') + '" fill-opacity="' + r1(op * 100) / 100 + '" x="' + r1(x + 1) + '" y="' + (y + 1) + '" width="' + r1(Math.max(1, cw - 2)) + '" height="' + (rowH - 4) + '" rx="3"><title>' +
                    ctx.esc(g.label + ', level ' + c + ': ' + plural(n, 'player')) + '</title></rect>';
                if (n > 0 && cw >= 15) b += tx(x + cw / 2, y + 16, String(n), 'an-cell', 'middle', ctx);
            });
        });
        var step = cols > 16 ? 5 : 1;
        for (var c = 0; c < cols; c += step) b += tx(labW + c * cw + cw / 2, H - 5, String(c), 'an-tick', 'middle', ctx);
        return svg(ctx, W, H, o.label || 'Heat map', b);
    }

    // 100% stacked bars with a 2px gap. rows: [{label, a, b, tip}]
    function stack100(ctx, rows, o) {
        var W = ctx.W, labW = Math.min(Math.max(maxLabelPx(rows, W, 0.3), 56), 90), plotW = W - labW - 8, rowH = 28, H = rows.length * rowH + 4, b = '';
        rows.forEach(function (r, i) {
            var y = 4 + i * rowH, t = r.a + r.b, wa = t > 0 ? r.a / t * plotW : 0, wb = plotW - wa;
            b += tx(labW - 8, y + 15, clip(r.label, labW - 8), 'an-lab', 'end', ctx);
            if (wa > 0) b += '<rect class="f-s1" x="' + labW + '" y="' + y + '" width="' + r1(Math.max(0, wa - (wb > 0 ? 1 : 0))) + '" height="20" rx="3"><title>' + ctx.esc(r.tip) + '</title></rect>';
            if (wb > 0) b += '<rect class="f-s2" x="' + r1(labW + wa + (wa > 0 ? 1 : 0)) + '" y="' + y + '" width="' + r1(Math.max(0, wb - (wa > 0 ? 1 : 0))) + '" height="20" rx="3"><title>' + ctx.esc(r.tip) + '</title></rect>';
            if (wa >= 34) b += tx(labW + wa / 2, y + 15, Math.round(r.a / t * 100) + '%', 'an-cell an-onbar', 'middle', ctx);
            if (wb >= 34) b += tx(labW + wa + wb / 2, y + 15, Math.round(r.b / t * 100) + '%', 'an-cell an-onbar', 'middle', ctx);
        });
        return svg(ctx, W, H, o.label || 'Share chart', b);
    }

    // two bars per row. rows: [{label, a, b}], a = ships (f-s1), b = stakes (f-s2)
    function pairBars(ctx, rows, o) {
        // o.pct: each bar is its share of that row's own combined total (a + b), so the two bars of a row add to 100
        var W = ctx.W, labW = maxLabelPx(rows, W, 0.36), valW = o.valW || 52, per = o.per || 'per hour', plotW = Math.max(50, W - labW - valW), max = 0;
        var sa = function (r) { return o.pct ? (r.a + r.b > 0 ? r.a / (r.a + r.b) * 100 : 0) : r.a; };
        var sb = function (r) { return o.pct ? (r.a + r.b > 0 ? r.b / (r.a + r.b) * 100 : 0) : r.b; };
        rows.forEach(function (r) { max = Math.max(max, sa(r), sb(r)); });
        if (o.pct) max = 100;
        var rowH = 32, H = rows.length * rowH + 4, b = '';
        rows.forEach(function (r, i) {
            var y = 3 + i * rowH, la = max > 0 ? sa(r) / max * plotW : 0, lb = max > 0 ? sb(r) / max * plotW : 0;
            var ta = o.pct ? pctTxt(sa(r)) : fnum(r.a), tb = o.pct ? pctTxt(sb(r)) : fnum(r.b);
            var sfx = o.pct ? ' (' + pctTxt(sa(r)) + ' of the combined ' + fnum(r.a + r.b) + ')' : '', sfy = o.pct ? ' (' + pctTxt(sb(r)) + ' of the combined ' + fnum(r.a + r.b) + ')' : '';
            b += tx(labW - 8, y + 18, clip(r.label, labW - 8), 'an-lab', 'end', ctx);
            b += hbar(labW, y + 2, la, 11, 1, 'f-s1', r.label + ' ships: ' + fnum(r.a) + ' ' + per + sfx, ctx) + tx(labW + la + 5, y + 11, ta, 'an-val', 'start', ctx);
            b += hbar(labW, y + 15, lb, 11, 1, 'f-s2', r.label + ' stakes: ' + fnum(r.b) + ' ' + per + sfy, ctx) + tx(labW + lb + 5, y + 24, tb, 'an-val', 'start', ctx);
        });
        return svg(ctx, W, H, o.label || 'Paired bars', '<line class="an-axis" x1="' + labW + '" y1="0" x2="' + labW + '" y2="' + H + '"/>' + b);
    }

    // ship models and stake tiers on one linear axis from zero. rows: model.compare.rate.rows. Every row is one hit area keyed to its card.
    function rateBars(ctx, rows) {
        var W = ctx.W, IND = 14, rowH = 22, H = rows.length * rowH + 4, b = '';
        var labW = maxLabelPx(rows.map(function (r) { return { label: r.label + (r.kind === 'ext' ? '    ' : '') }; }), W, 0.5), valW = 6, max = 0;
        var vt = function (r) { return fnum(r.v) + ' n=' + r.n; };
        rows.forEach(function (r) { valW = Math.max(valW, vt(r).length * 6.2 + 8); max = Math.max(max, r.v); });
        var plotW = Math.max(40, W - labW - valW);
        rows.forEach(function (r, i) {
            var y = 2 + i * rowH, len = max > 0 ? r.v / max * plotW : 0, ind = r.kind === 'ext' ? IND : 0;
            var tip = (r.kind === 'model' ? r.model : r.label) + ': median ' + fnum(r.v) + ' per second per ' + (r.kind === 'model' ? 'ship' : 'stake') + ', ' + plural(r.n, r.kind === 'model' ? 'fleet' : 'stake');
            b += tx(2 + ind, y + 14, clip(r.label, labW - 8 - ind), 'an-lab', 'start', ctx);
            b += hbar(labW, y + 3, Math.max(len, r.v > 0 ? 2 : 0), 14, 1, r.kind === 'model' ? 'f-s1' : 'f-s2', '', ctx);
            b += tx(labW + Math.max(len, 0) + 6, y + 14, vt(r), 'an-val', 'start', ctx);
            b += '<rect class="an-hit" data-an-k="' + r.k + '" tabindex="0" role="button" aria-label="' + ctx.esc(tip) + '" x="0" y="' + y + '" width="' + W + '" height="' + rowH + '"><title>' + ctx.esc(tip) + '</title></rect>';
        });
        return svg(ctx, W, H, 'Median units per second: ship models and claim stake tiers', '<line class="an-axis" x1="' + labW + '" y1="0" x2="' + labW + '" y2="' + H + '"/>' + b);
    }

    // ---------------------------------------------------------------- detail cards (pure: model + key -> html or null)
    function shortAddr(a) { a = String(a); return a.length > 12 ? a.slice(0, 4) + '...' + a.slice(-4) : a; }
    function pickBtn(o, kind, id, text) {
        if (!o.canPick || !id) return o.esc(text);
        return '<button type="button" class="c4an-pk" data-an-pick="' + kind + '" data-an-id="' + o.esc(id) + '">' + o.esc(text) + '</button>';
    }
    function chip(f) { return '<span class="c4an-chip"><i class="c4an-sw f-' + f + '"></i>' + FAC_NAME[f] + '</span>'; }
    var LIST_MAX = 8, MINES_MAX = 6, BLD_MAX = 5;
    // the stakes behind one bar of the Buildings card: 'b' = a building count ("7 buildings"), 'k' = a building kind. Top five by count;
    // each line is the owner (a button that opens that claim stake's view), where the stake is, and its count
    function bldCardHtml(model, which, idx, o) {
        var E = o.esc, S = obj(model.stakes), row = S ? arr(which === 'b' ? S.bldDist : S.kinds)[idx] : null;
        if (!row || !Array.isArray(row.list) || !row.list.length) return null;
        var list = row.list, isKind = which === 'k', label = isKind ? pretty(row.k) : plural(Number(row.k), 'building');
        // two stakes of one owner in one system read the same: those lines also carry the stake's short address
        var seen = dict(), sameKey = function (e) { return e.o + '|' + e.name + '|' + e.tier; };
        list.slice(0, BLD_MAX).forEach(function (e) { bump(seen, sameKey(e), 1); });
        var li = list.slice(0, BLD_MAX).map(function (e) {
            var who = e.owner || (e.o ? shortAddr(e.o) : 'owner not read'), where = (e.name || 'stake ' + shortAddr(e.id)) + (e.tier != null ? ' tier ' + e.tier : '') + (e.name && seen[sameKey(e)] > 1 ? ' ' + shortAddr(e.id) : '');
            return '<li>' + pickBtn(o, 'stake', e.id, who) + ' <span class="c4an-cdw">' + E(where) + '</span> <span class="c4an-cdv">x ' + fnum(e.v) + '</span></li>';
        }).join('');
        var head = isKind ? plural(row.n, 'building') + ' of this kind on ' + plural(list.length, 'stake') + '.' : plural(list.length, 'stake') + ' with ' + label + ' each.';
        var shown = list.length > BLD_MAX ? ' Showing ' + BLD_MAX + ' of ' + list.length + (isKind ? ', most of this kind first.' : '.') : (isKind && list.length > 1 ? ' Most of this kind first.' : '');
        return '<div class="c4an-cdh"><b>' + E(label) + '</b></div><p class="c4an-cdn">' + head + shown + (o.canPick ? ' Pick an owner to open that claim stake.' : '') + '</p><ul class="c4an-cdu">' + li + '</ul>' +
            (list.length > BLD_MAX ? '<p class="c4an-cdn">+' + (list.length - BLD_MAX) + ' more</p>' : '');
    }
    function cardHtml(model, key, o) {
        o = o || {}; if (typeof o.esc !== 'function') o.esc = esc;
        var E = o.esc, m = /^([frbk])(\d+)$/.exec(String(key));
        if (!m || !model || !obj(model.mining)) return null;
        var idx = Number(m[2]);
        if (m[1] === 'b' || m[1] === 'k') return bldCardHtml(model, m[1], idx, o);
        if (m[1] === 'f') {
            var r = arr(model.mining.rows)[idx];
            if (!r) return null;
            var mines = r.mines.slice(0, MINES_MAX).map(E).join(', ') + (r.mines.length > MINES_MAX ? ' and ' + (r.mines.length - MINES_MAX) + ' more' : '');
            return '<div class="c4an-cdh">' + pickBtn(o, 'fleet', r.a, r.n || 'fleet') + ' ' + chip(r.fa) + '</div><dl class="c4an-cdl">' +
                '<dt>Owner</dt><dd>' + (r.o ? pickBtn(o, 'owner', r.o, r.owner || shortAddr(r.o)) : 'not read') + '</dd>' +
                '<dt>Ships</dt><dd>' + r.ships + '</dd><dt>Crew</dt><dd>' + (r.crew > 0 ? r.crew : 'not read') + '</dd>' +
                '<dt>Mines</dt><dd>' + (mines || 'nothing listed') + '</dd>' +
                '<dt>Yield</dt><dd>' + fnum(r.ups) + ' per second (' + fnum(r.yps) + ' per ship); base ' + (r.base > 0 ? fnum(r.base) : 'not read') + '</dd></dl>' +
                '<div class="c4an-cdc">Ships in the fleet</div>' +
                (r.comp.length ? '<ul class="c4an-cdu">' + r.comp.map(function (c) { return '<li title="' + E(c.name) + '">' + E(shortModel(c.name)) + ' x ' + c.n + '</li>'; }).join('') + '</ul>' : '<p class="c4an-cdn">Composition not read in this fleet row.</p>');
        }
        var row = model.compare && model.compare.rate ? arr(model.compare.rate.rows)[idx] : null;
        if (!row) return null;
        var isShip = row.kind === 'model', list = row.list.slice().sort(function (a, b) { return b.v - a.v || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0); });
        var li = list.slice(0, LIST_MAX).map(function (e) {
            var who = e.owner || (e.o ? shortAddr(e.o) : '');
            return '<li>' + pickBtn(o, e.kind, e.id, e.name || shortAddr(e.id)) + (e.kind === 'stake' ? ' tier ' + e.tier : '') + (who ? ' <span class="c4an-cdw">' + E(who) + '</span>' : '') + ' <span class="c4an-cdv">' + fnum(e.v) + '</span></li>';
        }).join('');
        return '<div class="c4an-cdh"><b' + (isShip ? ' title="' + E(row.model) + '"' : '') + '>' + E(row.label) + '</b></div>' +
            '<p class="c4an-cdn">Median ' + fnum(row.v) + ' units per second per ' + (isShip ? 'ship over ' + plural(row.n, 'fleet') + ' of this model only' : 'stake over ' + plural(row.n, 'stake') + ' with production') + '. ' +
            (list.length > LIST_MAX ? 'Showing ' + LIST_MAX + ' of ' + list.length + ', highest first.' : (isShip ? 'Fleets' : 'Stakes') + ' counted, highest first.') + '</p><ul class="c4an-cdu">' + li + '</ul>' +
            (list.length > LIST_MAX ? '<p class="c4an-cdn">+' + (list.length - LIST_MAX) + ' more</p>' : '');
    }

    // ---------------------------------------------------------------- HTML pieces
    function legend(items) {
        return '<ul class="c4an-leg">' + items.map(function (i) { return '<li><i class="c4an-sw ' + i[0] + '"></i>' + i[1] + '</li>'; }).join('') + '</ul>';
    }
    function facLegend(list) {
        return legend(FACS.filter(function (f) { return !list || list.indexOf(f) >= 0; }).map(function (f) { return ['f-' + f, FAC_NAME[f]]; }));
    }
    function chart(title, inner, cap) {
        return '<div class="c4an-chart">' + (title ? '<h5 class="c4an-ch">' + title + '</h5>' : '') + inner + '<p class="c4an-cap">' + cap + '</p></div>';
    }
    function note(text) { return '<p class="c4an-empty">' + text + '</p>'; }
    // card(title, inner, id): with an id the header carries the "#" / "%" pair for that card (id must be in SHARE_CARDS)
    function card(title, inner, id) {
        if (!id) return '<figure class="c4an-card"><figcaption class="c4an-ct">' + title + '</figcaption>' + inner + '</figure>';
        return '<figure class="c4an-card"><figcaption class="c4an-ct c4an-cth"><span class="c4an-ctt">' + title + '</span>' +
            toggle(isPct(id) ? 'pct' : 'num', 'data-an-card="' + id + '"', title) + '</figcaption>' + inner + '</figure>';
    }
    // a real two-button group; aria-pressed says which one is on. attrs = the data attribute naming what a press changes
    function toggle(cur, attrs, what) {
        var one = function (m, sym, name) {
            return '<button type="button" class="c4an-tgb" ' + attrs + ' data-an-mode="' + m + '" aria-pressed="' + (cur === m ? 'true' : 'false') + '" aria-label="' + name + ' (' + what + ')" title="' + name + '">' + sym + '</button>';
        };
        return '<span class="c4an-tg" role="group" aria-label="Show ' + what + ' as">' + one('num', '#', 'Show counts') + one('pct', '%', 'Show percent of the total') + '</span>';
    }
    // a count chart that can be a share chart. rows as for barList; o = barList options; pctOn = this card is in percent mode;
    // total = what 100 % is; unit = words for the caption ("94 claim stakes"); top = a top-N list (caption then gives the coverage)
    function shareChart(ctx, pctOn, title, rows, o, cap, total, unit, top) {
        if (!pctOn) return chart(title, barList(ctx, rows, o), cap);
        if (!(total > 0)) return chart(title, note('Nothing to take a share of in this read: the total is zero.'), cap);
        var o2 = {}; Object.keys(o).forEach(function (k) { o2[k] = o[k]; }); o2.pct = total;
        var shown = 0; rows.forEach(function (r) { shown += r.v; });
        return chart(title, barList(ctx, rows, o2), cap + ' Shown as % of ' + unit + (top ? '; the ' + rows.length + ' rows shown cover ' + pctTxt(shown / total * 100) + ' of it' : '') + '.');
    }
    function section(id, title, intro, cards) {
        return '<section class="c4an-sec" id="c4an-' + id + '"><h3 class="c4an-h">' + title + '</h3>' +
            (intro ? '<p class="c4an-intro">' + intro + '</p>' : '') + '<div class="c4an-grid">' + cards.join('') + '</div></section>';
    }

    // ---------------------------------------------------------------- sections
    function secMining(ctx, M) {
        var m = M.mining, E = ctx.esc;
        var base = plural(m.n, 'mining fleet') + ' with a yield, ' + plural(m.fleetsRead, 'fleet') + ' read';
        if (!m.n) return section('mining', 'Mining rate per ship', 'Units per second a fleet mines, divided by its ships.',
            [card('Mining yield', note('No mining fleet has a measured yield in this read (' + plural(m.fleetsRead, 'fleet') + ' read).'))]);
        var c1 = chart('Units per second per ship',
            rangeRows(ctx, m.bySize.map(function (s) { return { label: s.size, n: s.n, min: s.min, q1: s.q1, med: s.med, q3: s.q3, max: s.max }; }), { label: 'Yield per ship by flagship size' }),
            'Dot = median, bar = middle half, line = full range, log scale. One row per flagship size; ' + base + '.');
        var crewRows = m.bySize.filter(function (s) { return s.crew; }).map(function (s) { return { label: s.size, n: s.crew.n, min: s.crew.min, q1: s.crew.q1, med: s.crew.med, q3: s.crew.q3, max: s.crew.max }; });
        var c1b = crewRows.length ? chart('Units per second per crew member',
            rangeRows(ctx, crewRows, { cls: 'f-s3', label: 'Yield per crew by flagship size' }),
            'Same reading per crew member; ' + plural(sum(crewRows.map(function (r) { return r.n; })), 'mining fleet') + ' with crew counted, ' + plural(m.fleetsRead, 'fleet') + ' read.')
            : chart('Units per second per crew member', note('No mining fleet reports crew.'), plural(m.fleetsRead, 'fleet') + ' read.');
        // scatter: ships vs yield per ship
        var maxShips = 0; m.scatter.forEach(function (p) { maxShips = Math.max(maxShips, p.ships); });
        var lo = Infinity, hi = 0; m.scatter.forEach(function (p) { lo = Math.min(lo, p.yps); hi = Math.max(hi, p.yps); });
        var pts = m.scatter.map(function (p, i) {
            return { x: p.ships, y: p.yps, fa: p.fa, k: p.k, dx: ((i * 7) % 5 - 2) * 1.6, tip: (p.n || 'fleet') + ': ' + plural(p.ships, 'ship') + ', ' + fnum(p.yps) + ' per ship per second' };
        });
        var present = FACS.filter(function (f) { return m.scatter.some(function (p) { return p.fa === f; }); });
        var c2 = chart('', facLegend(present) + scatter(ctx, pts, { xAxis: linAxis(maxShips + 0.5, true), yAxis: logAxis(lo, hi), xTitle: 'ships in the fleet', yTitle: 'units per second per ship', label: 'Fleet size against yield per ship' }),
            'One dot per mining fleet, coloured by faction, nudged sideways where they overlap; ' + base + '.');
        // richness
        var rc = m.richness, c3;
        if (rc.points.length) {
            var bl = Infinity, bh = 0;
            rc.points.forEach(function (p) { bl = Math.min(bl, p.base, p.ups); bh = Math.max(bh, p.base, p.ups); });
            var ax = logAxis(bl, bh);
            c3 = chart('', facLegend(FACS.filter(function (f) { return rc.points.some(function (p) { return p.fa === f; }); })) + scatter(ctx, rc.points.map(function (p) { return { x: p.base, y: p.ups, fa: p.fa, k: p.k, tip: (p.n || 'fleet') + ': base ' + fnum(p.base) + ', actual ' + fnum(p.ups) + ' per second' }; }),
                { xAxis: ax, yAxis: ax, diag: true, xTitle: 'base stat (units per second)', yTitle: 'actual yield (units per second)', label: 'Base mining stat against actual yield' }),
                'Dot = one mining fleet, both log scales; the diagonal is actual equal to base; median actual over base ' + fnum(rc.medianRatio) + '; ' + plural(rc.points.length, 'fleet') + ' with a base stat (' + rc.excluded + ' without), ' + plural(m.fleetsRead, 'fleet') + ' read.');
        } else c3 = chart('', note('No mining fleet reports a base stat.'), plural(m.fleetsRead, 'fleet') + ' read.');
        var c4 = chart('', barList(ctx, m.topRes.map(function (e) { return { label: e.r, v: e.yps, tip: e.r + ': ' + fnum(e.yps) + ' per ship per second, ' + plural(e.fleets, 'fleet') + ', ' + plural(e.ships, 'ship'), tag: 'n=' + e.fleets }; }), { label: 'Top resources by yield per ship' }),
            'Units per second per ship in the fleets mining each resource (n = fleets); top ' + m.topRes.length + ' of ' + plural(m.resTotal, 'resource') + ' by that figure; ' + base + '.');
        return section('mining', 'Mining rate per ship', 'Units per second a fleet mines, divided by its ships.', [
            card('Yield by flagship size', c1 + c1b), card('Fleet size against yield', c2), card('Base stat against actual yield', c3), card('Top resources', c4)]);
    }

    function secCouncil(ctx, M) {
        var c = M.council;
        var intro = 'Players grouped by council rank (the rank value the chain stores for each player).';
        if (!c.ranks.length) return section('council', 'Council rank', intro, [card('Council rank', note('No player reports a council rank in this read (' + plural(M.counts.owners, 'player') + ' read).'))]);
        var base = plural(c.ranked, 'ranked player') + ' of ' + plural(c.owners, 'player') + ' read';
        var c1 = shareChart(ctx, isPct('council-rank'), '', c.ranks.map(function (r) { return { label: 'rank ' + r.rank, v: r.n, tip: 'rank ' + r.rank + ': ' + plural(r.n, 'player') }; }), { cls: 'f-s7', fmt: function (v) { return String(v); }, label: 'Players per council rank' },
            'Players at each council rank; ' + base + '.', c.ranked, plural(c.ranked, 'ranked player'));
        var metrics = [['fleets', 'Fleets'], ['ships', 'Ships'], ['stakes', 'Claim stakes'], ['ups', 'Mining units per second'], ['atlas', 'ATLAS held']];
        var small = metrics.map(function (mm) {
            var rows = c.ranks.filter(function (r) { return r[mm[0]] != null; }).map(function (r) { return { label: 'rank ' + r.rank, v: r[mm[0]], tag: 'n=' + r.n, tip: 'rank ' + r.rank + ' median ' + mm[1] + ': ' + fnum(r[mm[0]]) }; });
            return '<h5 class="c4an-ch">' + mm[1] + '</h5>' + (rows.length ? barList(ctx, rows, { cls: 'f-s7', label: 'Median ' + mm[1] + ' per rank' }) : note('No value in this read.'));
        }).join('');
        var c2 = chart('Median per player', small, 'Each bar is the median across the players at that rank; a player with none counts as 0 (n = players); ' + base + '.');
        var lv = c.ranks.filter(function (r) { return r.lvls.length; });
        var c3 = lv.length ? chart('', heat(ctx, lv.map(function (r) { return { label: 'rank ' + r.rank, vals: r.lvls }; }), { cls: 'f-s7', label: 'Mining level by council rank' }),
            'Players per mining level (columns) at each rank (rows); darker = more players; ' + plural(sum(lv.map(function (r) { return r.lvls.length; })), 'player') + ' with a mining level, ' + plural(c.owners, 'player') + ' read.')
            : chart('', note('No player reports a mining level.'), plural(c.owners, 'player') + ' read.');
        return section('council', 'Council rank', intro, [card('Players per rank', c1, 'council-rank'), card('What each rank holds', c2), card('Mining level by rank', c3)]);
    }

    function secStakes(ctx, M) {
        var s = M.stakes, E = ctx.esc;
        var intro = 'Claim stakes read from the chain.';
        if (s.state === 'none') return section('stakes', 'Claim stakes', intro, [card('Claim stakes', note('No claim stakes in this read.'))]);
        var base = plural(s.n, 'claim stake') + ' read';
        var cnt = function (v) { return String(v); };
        var cards = [];
        // placement
        var T = s.tot, stk = function (n) { return plural(n, 'claim stake'); };
        var P1 = isPct('stakes-where');
        var place = shareChart(ctx, P1, 'Planet type', s.byType.map(function (e) { return { label: pretty(e.k), v: e.n }; }), { cls: 'f-s2', fmt: cnt, label: 'Stakes by planet type' },
            s.bodies ? 'Stakes on each planet type (the planet the stake sits on); ' + base + '.' : 'Planet types need the bodies file; ' + base + '.', T.type, stk(T.type)) +
            shareChart(ctx, P1, 'Tier', s.byTier.map(function (e) { return { label: 'tier ' + e.k, v: e.n }; }), { cls: 'f-s2', fmt: cnt, label: 'Stakes by tier' }, 'Stakes per tier; ' + base + '.', T.tier, stk(T.tier)) +
            shareChart(ctx, P1, 'State', s.byState.map(function (e) { return { label: pretty(e.k), v: e.n }; }), { cls: 'f-s2', fmt: cnt, label: 'Stakes by state' }, 'Stakes per state; ' + base + '.', T.state, stk(T.state));
        cards.push(card('Where stakes are', place, 'stakes-where'));
        // buildings
        var bs = s.bldSource === 'bl' ? 'buildings counted from the building list (quantity included)' : 'the building count each stake reports (' + FRESH + ' for kinds)';
        var P2 = isPct('stakes-bld');
        var bld = s.bldN ? shareChart(ctx, P2, 'Buildings per stake', s.bldDist.map(function (e, i) { return { label: plural(Number(e.k), 'building'), v: e.n, k: 'b' + i }; }), { cls: 'f-s2', fmt: cnt, label: 'Stakes by number of buildings' },
            'Stakes with each building count (pick a row for the stakes behind it); ' + plural(s.bldN, 'stake') + ' with a count, ' + base + '; ' + bs + '.', T.bld, plural(T.bld, 'claim stake') + ' with a building count') : chart('Buildings per stake', note('No stake reports its buildings.'), base + '.');
        var kinds = s.has.bl ? shareChart(ctx, P2, 'Building kinds installed', s.kinds.map(function (e, i) { return { label: pretty(e.k), v: e.n, k: 'k' + i }; }), { cls: 'f-s2', fmt: cnt, label: 'Buildings by kind' },
            'Buildings of each kind across all stakes (quantity counted; pick a row for the five stakes with the most); ' + plural(s.kinds.reduce(function (t, e) { return t + e.n; }, 0), 'building') + ' on ' + base + '.', T.kinds, plural(T.kinds, 'building'))
            : chart('Building kinds installed', note('Kinds ' + FRESH + '.'), base + '.');
        cards.push(card('Buildings', bld + kinds, s.bldN || s.has.bl ? 'stakes-bld' : null));
        // power and storage
        var pw;
        if (s.has.pw) {
            var shown = s.power.slice(0, 10);
            pw = chart('Power generated minus used', divBars(ctx, shown.map(function (p) { return { label: (p.sysName || 'stake') + ' ' + p.a.slice(0, 4), v: p.net, tip: (p.sysName || 'stake') + ': generates ' + fnum(p.gen) + ', uses ' + fnum(p.use) }; }), { label: 'Power surplus and deficit per stake' }),
                'Surplus (right) or deficit (left) in power units, the ' + shown.length + ' stakes furthest from zero; ' + plural(s.powerSurplus, 'stake') + ' in surplus, ' + plural(s.powerDeficit, 'stake') + ' in deficit, ' + plural(s.power.length, 'stake') + ' with power read.');
            pw = legend([['f-pos', 'Surplus'], ['f-neg', 'Deficit']]) + pw;
        } else pw = chart('Power generated minus used', note('Power ' + FRESH + '.'), base + '.');
        var okFill = s.has.cap && s.fill.n;
        var fl = okFill ? shareChart(ctx, isPct('stakes-storage'), 'Storage fill', ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'].map(function (l, i) { return { label: l, v: s.fill.buckets[i] }; }), { cls: 'f-s2', fmt: cnt, label: 'Stakes by storage fill' },
            'Stakes by share of storage used; median fill ' + Math.round(s.fill.med * 100) + '%; ' + plural(s.fill.n, 'stake') + ' with storage, ' + base + '.', T.fill, plural(T.fill, 'claim stake') + ' with storage')
            : chart('Storage fill', note('Storage ' + FRESH + '.'), base + '.');
        cards.push(card('Power and storage', pw + fl, okFill ? 'stakes-storage' : null));
        // output and owners
        var pr = s.has.out ? (s.prod.length ? shareChart(ctx, isPct('stakes-out'), 'Production per hour', s.prod.slice(0, 10).map(function (e) { return { label: e.r, v: e.uph }; }), { cls: 'f-s2', label: 'Stake production by resource' },
            'Units per hour all stakes produce, the production rate the chain stores for each stake, top ' + Math.min(10, s.prod.length) + ' of ' + plural(s.prod.length, 'resource') + '; ' + plural(s.prodStakes, 'stake') + ' with production read, ' + base + '.',
            T.prod, fnum(T.prod) + ' units per hour from all ' + plural(s.prod.length, 'resource'), true)
            : chart('Production per hour', note('No stake produces anything in this read.'), plural(s.prodStakes, 'stake') + ' with production read.'))
            : chart('Production per hour', note('Production ' + FRESH + '.'), base + '.');
        var od = shareChart(ctx, isPct('stakes-out'), 'Stakes per owner', s.ownerDist.map(function (e) { return { label: plural(Number(e.k), 'stake'), v: e.n }; }), { cls: 'f-s2', fmt: cnt, label: 'Owners by number of stakes' },
            'Owners holding each number of stakes; ' + plural(s.stakeOwners, 'owner') + ' hold ' + base + '.', T.owners, plural(T.owners, 'owner'));
        var fu;
        if (!s.has.use) fu = chart('Fuel left', note('Fuel burn ' + FRESH + '.'), base + '.');
        else if (!s.fuel.n) fu = chart('Fuel left', note('No stake reports its fuel in this read.'), base + '.');
        else fu = shareChart(ctx, isPct('stakes-fuel'), 'Fuel left', ['empty', 'under 6 h', '6-24 h', '1-3 days', 'over 3 days', 'no fuel burn'].map(function (l, i) { return { label: l, v: s.fuel.buckets[i] }; }), { cls: 'f-s2', fmt: cnt, label: 'Stakes by hours of fuel left' },
            'Stakes by hours of fuel left (fuel held divided by the fuel the stake burns per hour); ' + plural(s.fuel.n, 'stake') + ' with fuel read, ' + base + '. All stakes together burn ' + fnum(s.fuel.burnPh) + ' fuel per hour (' + plural(s.fuel.burnStakes, 'stake') + ' burning fuel).',
            T.fuel, plural(T.fuel, 'claim stake') + ' with fuel read');
        cards.push(card('Fuel', fu, s.has.use && s.fuel.n ? 'stakes-fuel' : null));
        cards.push(card('Output and owners', pr + od, 'stakes-out'));
        return section('stakes', 'Claim stakes', intro, cards);
    }

    function secCompare(ctx, M) {
        var c = M.compare, s = M.stakes, m = M.mining;
        var intro = 'Mining fleets and claim stakes side by side, from the same read.';
        var legShip = legend([['f-s1', 'Mining ships'], ['f-s2', 'Claim stakes']]);
        var noOut = !s.has || !s.has.out;
        var why = s.state === 'none' ? 'No claim stakes in this read.' : 'Stake output ' + FRESH + '.';
        var base = plural(m.n, 'mining fleet') + ' and ' + plural(s.n, 'claim stake');
        var cards = [];
        // what the stake side leaves out (see buildCompare): said under every chart that compares ships with stakes
        var oth = c.otherOut || [], exName = oth.indexOf('Fuel') >= 0 ? 'Fuel' : oth[0];
        var like = ' Stake output is counted only for resources that ships also mine' + (oth.length ? '; ' + plural(oth.length, 'other stake output') + ', such as ' + esc(exName) + ', ' + (oth.length === 1 ? 'is' : 'are') + ' left out.' : '.');
        // ship models against stake tiers, units per second
        var R = c.rate, rc;
        if (!R.rows.length) rc = chart('', note('No mining fleet made of one ship model and no claim stake with production in this read.'), base + ' read.');
        else {
            var tail = R.noStakes ? ' No claim stakes in this read, so only ship rows are drawn.' : R.noOut ? ' Stake output ' + FRESH + ', so no stake rows are drawn.' : '';
            var extNote = !R.noStakes && !R.noOut && R.noBl ? ' The extractor rows need the building list (' + FRESH + ').' : '';
            rc = chart('', legend([['f-s1', 'Ship models, per ship'], ['f-s2', 'Claim stake tiers, per stake']]) + rateBars(ctx, R.rows),
                'Ship row: median units per second per ship over the mining fleets made only of that model (n = fleets); ' + plural(R.mixed, 'mining fleet') + ' with more than one model or no composition read ' + (R.mixed === 1 ? 'is' : 'are') + ' counted, not drawn. ' +
                'Stake row: median units per second per stake over the stakes with any production (n = stakes), the production rate the chain stores for each stake; indented rows split a tier by the extractors installed. One linear axis from zero.' +
                like + tail + extNote + ' ' + base + ' read.');
        }
        cards.push(card('Ship models against stake tiers', rc));
        // per resource
        var PR = isPct('compare-res');
        cards.push(card('Units per hour by resource', noOut ? chart('', note(why), base + ' read.') :
            chart('', legShip + pairBars(ctx, c.res.map(function (r) { return { label: r.r, a: r.ships, b: r.stakes }; }), { label: 'Units per hour by resource, ships and stakes', pct: PR }),
                'Units per hour produced by mining fleets and by stakes (stake output is the production rate the chain stores for each stake), top ' + c.res.length + ' of ' + plural(c.resTotal, 'resource') + '; ' + base + ' read.' + like +
                (PR ? ' Shown as % of each resource\'s own combined total: the two bars of a row add to 100%.' : '')), noOut ? null : 'compare-res'));
        // per crew
        var pc = [];
        if (!noOut && (c.crew.fleets.perCrew != null || c.crew.stakes.perCrew != null)) {
            if (c.crew.fleets.perCrew != null) pc.push({ label: 'mining fleets', v: c.crew.fleets.perCrew, cls: 'f-s1', tip: plural(c.crew.fleets.n, 'fleet') + ', ' + plural(c.crew.fleets.crew, 'crew member') });
            if (c.crew.stakes.perCrew != null) pc.push({ label: 'claim stakes', v: c.crew.stakes.perCrew, cls: 'f-s2', tip: plural(c.crew.stakes.n, 'stake') + ', ' + plural(c.crew.stakes.crew, 'crew member') });
        }
        cards.push(card('Output per crew member', noOut ? chart('', note(why), base + ' read.') : (pc.length ?
            chart('', barList(ctx, pc, { label: 'Units per hour per crew member' }),
                'Units per hour divided by crew, over every fleet (' + plural(c.crew.fleets.n, 'fleet') + ') and stake (' + plural(c.crew.stakes.n, 'stake') + ') that reports crew; ' + base + ' read.' + like) :
            chart('', note('No fleet or stake reports crew.'), base + ' read.'))));
        // faction share
        cards.push(card('Share of raw output by faction', noOut ? chart('', note(why), base + ' read.') : (c.factions.length ?
            chart('', legShip + stack100(ctx, c.factions.map(function (f) { return { label: FAC_NAME[f.fa], a: f.ships, b: f.stakes, tip: FAC_NAME[f.fa] + ': ships ' + fnum(f.ships) + ', stakes ' + fnum(f.stakes) + ' units per hour' }; }), { label: 'Share of raw output from ships and stakes by faction' }),
                'Share of each faction\'s units per hour that comes from mining fleets and from stakes (a stake takes its owner\'s faction); ' + base + ' read.' + like) :
            chart('', note('No output in this read.'), base + ' read.'))));
        // owner mix
        var mx = c.mix;
        cards.push(card('Owners by what they run', mx.total ? shareChart(ctx, isPct('compare-mix'), '', [
            { label: 'ships only', v: mx.shipsOnly, cls: 'f-s1' }, { label: 'stakes only', v: mx.stakesOnly, cls: 'f-s2' },
            { label: 'both', v: mx.both, cls: 'f-s3' }, { label: 'neither', v: mx.neither, cls: 'f-npc' }], { fmt: function (v) { return String(v); }, label: 'Owners by ships and stakes' },
            'Players that run mining ships, claim stakes, both or neither; ' + plural(mx.total, 'player') + ' read.', mx.total, plural(mx.total, 'player')) : chart('', note('No players in this read.'), '0 players read.'), mx.total ? 'compare-mix' : null));
        return section('compare', 'Ships against claim stakes', intro, cards);
    }

    function secConfig(ctx, M) {
        var c = M.config, title = 'Game rules on chain';
        if (!c) return section('config', title, 'Recipes, ship configurations, tolls and research costs as the chain holds them.',
            [card('Game rules', note('The game rule tables did not load (config-summary.json), so this section has nothing to draw.'))]);
        var when = c.takenAt ? new Date(c.takenAt * 1000).toISOString().slice(0, 10) : 'an unknown date';
        var intro = 'Recipes, ship configurations, tolls and research costs as the chain holds them. Read on ' + when + (c.sage ? ', game version ' + c.sage : '') + '; these change only when the game is redeployed.';
        var r = c.recipes, cards = [], int = function (v) { return fnum(v); };
        var rawDef = ' Raw units = the mined inputs it takes to make one, counted through every recipe below it; where an item has more than one recipe the cheapest is used.';
        // recipes by starbase level
        cards.push(card('Recipes', r.byLevel.length ? chart('By the starbase level a recipe needs', barList(ctx, r.byLevel.map(function (l) { return { label: 'level ' + l.lvl, v: l.n, tag: pctTxt(l.n / r.n * 100), tip: 'level ' + l.lvl + ': ' + plural(l.n, 'recipe') }; }), { cls: 'f-s7', fmt: int, label: 'Recipes per starbase level needed' }),
            plural(r.n, 'recipe') + (r.outputs != null ? ' making ' + plural(r.outputs, 'item') : '') + (r.multi != null ? '; ' + plural(r.multi, 'item') + ' can be made more than one way' : '') + (r.gated != null ? '; ' + fnum(r.gated) + ' need research first' : '') +
            (r.withFee != null && r.feeAtlas != null ? '; ' + fnum(r.withFee) + ' charge a fee of ' + r.feeAtlas + ' ATLAS a run' : '') + '.') : chart('', note('No recipe levels in the file.'), plural(r.n, 'recipe') + '.')));
        // raw inputs
        cards.push(card('Raw inputs recipes ask for', r.rawUse.length ? chart('', barList(ctx, r.rawUse.map(function (x) { return { label: x.r, v: x.n, tip: x.r + ': an ingredient of ' + plural(x.n, 'recipe') }; }), { cls: 'f-s3', fmt: int, label: 'Recipes that take each raw input' }),
            'Recipes that list the input directly as an ingredient; top ' + r.rawUse.length + (r.rawN != null ? ' of the ' + r.rawN + ' inputs that no recipe makes' : '') + '. It counts recipes, not quantity.') : chart('', note('No raw inputs in the file.'), '')));
        // dearest items
        cards.push(card('Costliest items to make', r.dear.length ? chart('Raw units for one', barList(ctx, r.dear.map(function (x) { return { label: x.r, v: x.min, tip: x.r + ': ' + fnum(x.min) + ' raw units for one' }; }), { cls: 'f-s2', fmt: int, label: 'Raw units to make one of the costliest items' }),
            'Top ' + r.dear.length + (r.dearN != null ? ' of ' + fnum(r.dearN) + ' craftable items' : '') + (r.rawEqMedian != null ? '; the median item takes ' + fnum(r.rawEqMedian) : '') + '.' + rawDef) : chart('', note('No item costs in the file.'), '')));
        // starbase upgrade materials
        if (r.upgrade.length) {
            var u1 = chart('Raw units for one', barList(ctx, r.upgrade.map(function (x) { return { label: x.r, v: x.raw, tag: '(' + x.lp + ' LP)', tip: x.r + ': ' + fnum(x.raw) + ' raw units, ' + x.lp + ' loyalty points a unit' }; }), { cls: 'f-s1', fmt: int, label: 'Raw units for one unit of each starbase upgrade material' }),
                'The ' + r.upgrade.length + ' materials the chain\'s reward table pays loyalty points (LP) for in starbase upgrades, with the LP for one unit.' + rawDef + ' How many of each an upgrade takes is not in these tables.');
            var per = r.upgrade.slice().sort(function (a, b) { return b.per - a.per || (a.r < b.r ? -1 : 1); });
            var u2 = chart('Loyalty points per raw unit', barList(ctx, per.map(function (x) { return { label: x.r, v: x.per, tip: x.r + ': ' + fnum(x.per) + ' LP for each raw unit that goes into it' }; }), { cls: 'f-s1', label: 'Loyalty points per raw unit by upgrade material' }),
                'The LP for one unit divided by the raw units it takes: which material turns mined input into the most loyalty points.');
            cards.push(card('Starbase upgrade materials', u1 + u2));
        }
        // ships
        var bs = c.ships.bySize;
        if (bs.length) {
            var mets = [['cargo', 'Cargo hold (units)'], ['mining', 'Mining rate (units per second)'], ['crew', 'Crew needed'], ['recovery', 'Recovery fee (ATLAS)'], ['fit', 'Fit-out cost (raw units)']];
            var small = mets.map(function (mm) {
                var rw = bs.filter(function (b) { return fin(b[mm[0]]); }).map(function (b) { return { label: b.size, v: b[mm[0]], tag: 'n=' + (mm[0] === 'fit' ? b.fitN : b.n), tip: b.size + ' median ' + mm[1] + ': ' + fnum(b[mm[0]]) }; });
                return '<h5 class="c4an-ch">' + mm[1] + '</h5>' + (rw.length ? barList(ctx, rw, { cls: 'f-s1', label: 'Median ' + mm[1] + ' by ship size' }) : note('Not in the file.'));
            }).join('');
            cards.push(card('Ship configurations by size', chart('Median per hull', small,
                'Each bar is the median over the hulls of that size in their default configuration (n = hulls)' + (c.ships.hulls != null ? '; ' + plural(c.ships.hulls, 'hull') : '') + (c.ships.configs != null ? ', ' + fnum(c.ships.configs) + ' configurations' : '') +
                '. Fit-out cost is the median, over the other configurations of that size (n = configurations), of the raw units in the components each one lists.' + rawDef)));
        }
        // tolls, research, stake slots
        var t = c.tolls, tr = [];
        if (t.allied != null) tr.push({ label: 'allied territory', v: t.allied, cls: 'f-s3', tip: 'Toll in allied territory: ' + t.allied + '% of the lane fee' });
        if (t.neutral != null) tr.push({ label: 'neutral territory', v: t.neutral, cls: 'f-s2', tip: 'Toll in neutral territory: ' + t.neutral + '% of the lane fee' });
        var pctf = function (v) { return fnum(v) + '%'; };
        var lane = t.research.filter(function (x) { return x.atlas > 0; }).map(function (x) { return ctx.esc(x.r) + ' (' + fnum(x.mod * 100) + '%, ' + fnum(x.atlas) + ' ATLAS)'; });
        var c6 = tr.length ? chart('Warp lane toll rates', barList(ctx, tr, { fmt: pctf, label: 'Warp lane toll rate by territory' }),
            'The toll rates the faction relations table stores, as a percent' + (lane.length ? '; research that changes the lane fee: ' + lane.join(', ') : '') + '. Cross-faction economics is switched ' + (t.crossFaction ? 'on' : 'off') + '. The base lane fee itself is not in these tables.')
            : chart('Warp lane toll rates', note('No toll rates in the file.'), '');
        var rs = c.research, c7 = rs.atlas != null ? chart('Research', barList(ctx, [{ label: 'every node', v: rs.atlas, cls: 'f-s7', tip: fnum(rs.atlas) + ' ATLAS buys every research node once' }], { fmt: int, label: 'ATLAS to buy every research node' }),
            'ATLAS to buy every research node once' + (rs.paid != null && rs.n != null ? ': ' + fnum(rs.paid) + ' of ' + plural(rs.n, 'node') + ' cost ATLAS' : '') + (rs.byCost.length === 1 ? ', each ' + fnum(rs.byCost[0].atlas) : '') + '. Per player, so this sink grows with the player count.') : '';
        cards.push(card('Tolls and research', c6 + c7));
        if (c.stakes.length) cards.push(card('Claim stake sizes', chart('Building slots', barList(ctx, c.stakes.map(function (s) { return { label: s.r, v: s.slots, tip: s.r + ': ' + plural(s.slots, 'slot') }; }), { cls: 'f-s2', fmt: int, label: 'Building slots per claim stake definition' }),
            'Slots each claim stake definition allows' + (c.stakes.every(function (s) { return fin(s.place) && s.place === c.stakes[0].place && fin(s.rent) && s.rent === c.stakes[0].rent; }) && fin(c.stakes[0].place) ? '; every one has a placement fee multiplier of ' + c.stakes[0].place + ' and a rent multiplier of ' + c.stakes[0].rent : '') + '.')));
        return section('config', title, intro, cards);
    }

    var UNSEEN = [
        ['Fuel, food and ammunition burned by fleets.', 'A fleet account stores what is in the hold, not a burn rate.'],
        ['Crafting inputs and recipe fees.', 'Only visible in the crafting transactions.'],
        ['Starbase upgrade contributions.', 'The level is read (below); what was paid in to reach it is not.'],
        ['Research costs.', 'Paid when a node is bought.'],
        ['Warp lane tolls.', 'Paid per jump.'],
        ['Rent and placement fees as a rate.', 'Only the balance left is stored.'],
        ['Ships, cargo and crew lost in combat.', 'Destroyed fleets are counted on the Combat tab, not valued.']
    ];
    function secEconomy(ctx, M) {
        var e = M.economy;
        var intro = 'What enters the economy at the rate of this read, who produces it, what the read shows leaving it, and the level every starbase stands at.';
        var rate = ' A day is the rate in this read times 86,400 seconds, not a measured day.';
        var base = plural(e.fleets, 'mining fleet') + ' with a yield and ' + plural(e.stakesOut, 'claim stake') + ' with output';
        var cards = [];
        if (!(e.day > 0)) cards.push(card('Emission by resource', note('Nothing is being produced in this read (' + base + ').')));
        else {
            var c1 = chart('', legend([['f-s1', 'Mining ships'], ['f-s2', 'Claim stakes']]) +
                pairBars(ctx, e.res.map(function (r) { return { label: r.r, a: r.ships, b: r.stakes }; }), { label: 'Units per day by resource, ships and stakes', per: 'a day', valW: 78 }),
                'Units per day at the current rate, top ' + e.res.length + ' of ' + plural(e.resTotal, 'resource') + '. All of them together: ' + fnum(e.day) + ' a day (' + fnum(e.shipsDay) + ' from ships, ' + fnum(e.stakesDay) + ' from stakes), ' +
                fnum(e.day * 30) + ' over 30 days at this rate. Stake output is every resource a stake produces, crafted goods such as Fuel included; ' + base + '.' + rate);
            cards.push(card('Emission by resource', c1));
            var rows = [];
            if (e.median != null) rows.push({ label: 'median producer', v: e.median, cls: 'f-s3', tip: 'Half of the ' + plural(e.producers, 'producer') + ' make more than ' + fnum(e.median) + ' a day' });
            if (e.mean != null) rows.push({ label: 'average producer', v: e.mean, cls: 'f-s3', tip: 'Total divided by ' + plural(e.producers, 'producer') + ': ' + fnum(e.mean) + ' a day' });
            var c2 = rows.length ? chart('Units per day per producer', barList(ctx, rows, { label: 'Units per day per producing player' }),
                'A producer is a player with a mining fleet that has a yield or a claim stake with output; ' + plural(e.producers, 'producer') + '.' + rate) : chart('', note('No producing player in this read.'), base + '.');
            var hd = e.head.map(function (p, i) { return { label: p.owner || shortAddr(p.o), v: p.day, cls: 'f-s7', tip: (p.owner || shortAddr(p.o)) + ': ' + fnum(p.day) + ' a day' }; });
            if (e.restDay > 0) hd.push({ label: 'everyone else', v: e.restDay, cls: 'f-npc', tip: plural(e.producers - e.head.length, 'other producer') + ': ' + fnum(e.restDay) + ' a day' });
            var c2b = hd.length ? chart('Who produces it', barList(ctx, hd, { label: 'Share of emission by producer', pct: e.namedDay }),
                'Share of the daily emission from the ' + e.head.length + ' largest producers and from all the others together; the largest ' + e.head.length + ' make ' + pctTxt(e.headDay / e.namedDay * 100) + '.') : '';
            cards.push(card('Emission per player', c2 + c2b));
        }
        var sk = e.sinks.length ? chart('Consumed by claim stakes', barList(ctx, e.sinks.map(function (x) {
            var sh = x.emit > 0 ? pctTxt(x.day / x.emit * 100) + ' of emission' : 'not emitted';
            return { label: x.r, v: x.day, cls: 'f-s2', tag: '(' + sh + ')', tip: x.r + ': ' + fnum(x.day) + ' consumed a day, ' + (x.emit > 0 ? fnum(x.emit) + ' emitted a day' : 'none emitted in this read') };
        }), { label: 'Units per day consumed by claim stakes' }),
            'Units per day the buildings on claim stakes consume, the rate the chain stores for each stake, with that as a share of the same resource\'s emission above; ' + plural(e.stakesUse, 'claim stake') + ' consuming, ' + plural(e.stakesRead, 'claim stake') + ' read.' + rate)
            : chart('Consumed by claim stakes', note('No claim stake reports consumption in this read.'), plural(e.stakesRead, 'claim stake') + ' read.');
        var rn = chart('ATLAS in rent balances', e.rentN ? barList(ctx, [{ label: 'prepaid rent', v: e.rentBal, cls: 'f-s7', tip: fnum(e.rentBal) + ' ATLAS across ' + plural(e.rentN, 'claim stake') }], { label: 'ATLAS held in claim stake rent balances' }) : note('No claim stake reports a rent balance in this read.'),
            'ATLAS already paid into rent balances and not yet spent; a balance, not a rate. ' + plural(e.rentN, 'claim stake') + ' with a balance.');
        cards.push(card('Sinks in this read', sk + rn));
        cards.push(card('Sinks this read cannot see', chart('', '<ul class="c4an-ul">' + UNSEEN.map(function (u) { return '<li><b>' + u[0] + '</b> ' + u[1] + '</li>'; }).join('') + '</ul>',
            'These remove resources or ATLAS from the economy, but the page reads current state, not the transactions that spend. They are listed so that nobody reads the card beside this one as the whole of the sinks.')));
        if (!e.levels.length) cards.push(card('Starbase levels', note('No system reports a starbase level in this read (' + plural(e.systemsRead, 'system') + ' read).')));
        else {
            var c3 = chart('', barList(ctx, e.levels.map(function (l) {
                return { label: 'level ' + l.lvl, v: l.n, tag: pctTxt(l.n / e.systems * 100), tip: 'level ' + l.lvl + ': ' + plural(l.n, 'system') + ' (' + FACS.map(function (f) { return FAC_NAME[f] + ' ' + l.by[f]; }).join(', ') + ')' };
            }), { cls: 'f-s1', fmt: function (v) { return String(v); }, label: 'Systems per starbase level' }),
                'Systems at each starbase level, with the share of all ' + plural(e.systems, 'system') + ' with a level; ' + plural(e.systemsRead, 'system') + ' read.');
            var per = FACS.filter(function (f) { return e.levels.some(function (l) { return l.by[f] > 0; }); }).map(function (f) {
                return '<h5 class="c4an-ch">' + FAC_NAME[f] + '</h5>' + barList(ctx, e.levels.map(function (l) { return { label: 'level ' + l.lvl, v: l.by[f], tip: FAC_NAME[f] + ' level ' + l.lvl + ': ' + plural(l.by[f], 'system') }; }),
                    { cls: 'f-' + f, fmt: function (v) { return String(v); }, label: FAC_NAME[f] + ' systems per starbase level' });
            }).join('');
            cards.push(card('Starbase levels', c3));
            cards.push(card('Starbase levels by faction', chart('', per, 'The same count split by the faction that holds each system.')));
        }
        return section('economy', 'Emission, sinks and starbases', intro, cards);
    }

    // ---------------------------------------------------------------- render
    function render(el, model, opts) {
        opts = opts || {};
        var width = fin(opts.width) && opts.width > 0 ? opts.width : 360;
        var wide = width >= 640, cols = width >= 2700 ? 5 : width >= 1900 ? 4 : width >= 1100 ? 3 : wide ? 2 : 1;
        var colW = (width - 12 * (cols - 1)) / cols;
        var ctx = { W: Math.max(240, Math.floor(colW - 28)), esc: typeof opts.esc === 'function' ? opts.esc : esc };
        var html;
        if (!model || typeof model !== 'object' || !model.mining) {
            html = '<p class="c4an-empty">No data to chart yet.</p>';
        } else {
            html = '<div class="c4an-bar"><span class="c4an-bl">All charts</span>' + toggle(getMode(), 'data-an-all="1"', 'all charts') + '</div>' +
                secMining(ctx, model) + secCouncil(ctx, model) + secStakes(ctx, model) + secCompare(ctx, model) + secEconomy(ctx, model) + secConfig(ctx, model);
        }
        if (openEl === el) openEl = null;   // the redraw replaces the card host: nothing is open any more
        if (html.indexOf('c4an-bar') >= 0) html += '<div class="c4an-pop" role="dialog" aria-label="Details" hidden></div>';
        el.className = 'c4an ' + (wide ? 'c4an-wide' : 'c4an-narrow') + (cols >= 3 ? ' c4an-x3' : '') + (cols >= 4 ? ' c4an-x' + cols : '') + (opts.reducedMotion ? '' : ' c4an-anim');
        el.innerHTML = html;
        el._c4an = { model: model, opts: opts, pinned: false, opener: null, key: null };
        // ONE delegated click listener per element, attached the first time it is drawn into (the flag on the element is the guard)
        if (!el._c4anBound && typeof el.addEventListener === 'function') {
            el._c4anBound = true;
            el.addEventListener('click', function (ev) { onClick(el, ev); });
            el.addEventListener('mouseover', function (ev) { var mk = markOf(ev); if (mk && !pinnedOn(el)) showPop(el, mk, false); });
            el.addEventListener('mouseout', function (ev) {
                var mk = markOf(ev), to = ev && ev.relatedTarget;
                if (mk && !pinnedOn(el) && !(to && typeof mk.contains === 'function' && mk.contains(to))) closePop(false);
            });
            el.addEventListener('focusin', function (ev) { var mk = markOf(ev); if (mk && !muted && !pinnedOn(el)) showPop(el, mk, false); });
            el.addEventListener('focusout', function (ev) {
                var mk = markOf(ev), pop = ev && ev.target && typeof ev.target.closest === 'function' ? ev.target.closest('.c4an-pop') : null, to = ev && ev.relatedTarget;
                if (mk && !pinnedOn(el)) closePop(false);
                else if (pop && to && !(typeof pop.contains === 'function' && pop.contains(to)) && !(to.closest && to.closest('[data-an-k]'))) closePop(false);   // Tab left the card
            });
            el.addEventListener('keydown', function (ev) {
                var mk = markOf(ev);
                if (!mk || !ev || (ev.key !== 'Enter' && ev.key !== ' ')) return;
                if (typeof ev.preventDefault === 'function') ev.preventDefault();
                togglePin(el, mk, true);
            });
        }
        var doc = root.document;
        if (!docBound && doc && typeof doc.addEventListener === 'function') {
            docBound = true;
            doc.addEventListener('keydown', function (ev) {
                if (openEl && ev && ev.key === 'Escape') { closePop(true); if (typeof ev.stopPropagation === 'function') ev.stopPropagation(); }   // the page's own Escape (drawer, stake view) stays shut this time
            }, true);
            doc.addEventListener('click', function (ev) { outsideClick(ev); });
        }
    }

    // ---------------------------------------------------------------- the detail card: one per page at a time
    var openEl = null, docBound = false, muted = false;
    function markOf(ev) { var t = ev && ev.target; return t && typeof t.closest === 'function' ? t.closest('[data-an-k]') : null; }
    function pinnedOn(el) { return openEl === el && !!(el._c4an && el._c4an.pinned); }
    function closePop(restoreFocus) {
        var el = openEl; if (!el) return;
        openEl = null;
        var st = el._c4an, pop = typeof el.querySelector === 'function' ? el.querySelector('.c4an-pop') : null;
        if (pop) { pop.hidden = true; pop.innerHTML = ''; pop.className = 'c4an-pop'; }
        var op = st && st.opener;
        if (st) { st.opener = null; st.pinned = false; st.key = null; }
        if (restoreFocus && op && typeof op.focus === 'function') { muted = true; try { op.focus(); } finally { muted = false; } }   // the dot takes focus back without its card opening again
    }
    // the card sits under the mark (above it when there is no room), inside the scrolling pane; the placement is written through the
    // CSSOM, never as a style attribute in the markup
    function paneOf(el) {
        for (var p = el.parentElement; p; p = p.parentElement) {
            var cs = typeof getComputedStyle === 'function' ? getComputedStyle(p) : null;
            if (cs && /(auto|scroll)/.test(cs.overflowY)) return p;
        }
        return el;
    }
    function place(el, pop, mark) {
        if (typeof mark.getBoundingClientRect !== 'function' || !pop.style) return;
        var er = el.getBoundingClientRect(), mr = mark.getBoundingClientRect(), pr = paneOf(el).getBoundingClientRect();
        pop.style.left = '0px'; pop.style.top = '0px';
        var pw = pop.offsetWidth, ph = pop.offsetHeight;
        var left = Math.min(pr.right, er.right) - pw, right = Math.max(pr.left, er.left);
        var x = Math.max(right, Math.min(mr.left + mr.width / 2 - pw / 2, left));
        var y = mr.bottom + 6;
        if (y + ph > pr.bottom) { var up = mr.top - 6 - ph; y = up >= pr.top ? up : Math.max(pr.top, pr.bottom - ph); }
        pop.style.left = Math.round(x - er.left) + 'px'; pop.style.top = Math.round(y - er.top) + 'px';
    }
    function showPop(el, mark, pinned) {
        var st = el._c4an, pop = typeof el.querySelector === 'function' ? el.querySelector('.c4an-pop') : null;
        if (!st || !pop || !st.model) return false;
        var key = mark.getAttribute('data-an-k');
        var html = cardHtml(st.model, key, { esc: typeof st.opts.esc === 'function' ? st.opts.esc : esc, canPick: typeof st.opts.onPick === 'function' });
        if (!html) return false;
        if (openEl && openEl !== el) closePop(false);
        pop.innerHTML = html; pop.hidden = false; pop.className = 'c4an-pop' + (pinned ? ' c4an-pop-pin' : '');
        openEl = el; st.pinned = !!pinned; st.opener = mark; st.key = key;
        place(el, pop, mark);
        return true;
    }
    function togglePin(el, mark, kbd) {
        var st = el._c4an;
        if (st && pinnedOn(el) && st.opener === mark) { closePop(false); return; }   // a second press on the same mark closes it
        if (!showPop(el, mark, true)) return;
        if (kbd) {
            var pop = el.querySelector('.c4an-pop'), first = pop && pop.querySelector('.c4an-pk');
            if (first && typeof first.focus === 'function') first.focus();
        }
    }
    function doPick(el, btn) {
        var st = el._c4an, kind = btn.getAttribute('data-an-pick'), id = btn.getAttribute('data-an-id');
        if (!st || !id || (kind !== 'owner' && kind !== 'fleet' && kind !== 'stake')) return;
        var cb = st.opts && st.opts.onPick;
        closePop(false);
        if (typeof cb === 'function') cb({ kind: kind, id: id });
    }
    function outsideClick(ev) {
        var t = ev && ev.target;
        if (!openEl || !t) return;
        if (typeof openEl.contains === 'function' && openEl.contains(t)) return;   // clicks inside the mount are the mount's own listener
        closePop(false);
    }

    function onClick(el, ev) {
        var t = ev && ev.target;
        if (!t || typeof t.closest !== 'function') return;
        var b = t.closest('[data-an-mode]');
        if (!b) {
            var pk = t.closest('[data-an-pick]');
            if (pk) { doPick(el, pk); return; }
            var mk = t.closest('[data-an-k]');
            if (mk) { togglePin(el, mk, false); return; }
            if (!t.closest('.c4an-pop')) closePop(false);
            return;
        }
        closePop(false);
        var m = b.getAttribute('data-an-mode'), id = b.getAttribute('data-an-card');
        if (m !== 'pct' && m !== 'num') return;
        if (id) { if (SHARE_CARDS.indexOf(id) < 0) return; modes[id] = m; }
        else if (b.getAttribute('data-an-all') != null) setMode(m);
        else return;
        var st = el._c4an;
        if (st) { var o2 = {}; Object.keys(st.opts || {}).forEach(function (k) { o2[k] = st.opts[k]; }); o2.reducedMotion = true; render(el, st.model, o2); }   // no entry fade on a click redraw
        // the buttons were redrawn: give focus back to the same one
        if (typeof el.querySelector === 'function') {
            var sel = '[data-an-mode="' + m + '"]' + (id ? '[data-an-card="' + id + '"]' : '[data-an-all]');
            var nb = el.querySelector(sel);
            if (nb && typeof nb.focus === 'function') nb.focus();
        }
    }

    var api = { version: '1', build: build, render: render, sections: SECTIONS.slice(), setMode: setMode, getMode: getMode, shareCards: SHARE_CARDS.slice(), card: cardHtml, shortModel: shortModel, close: function () { closePop(false); } };
    if (typeof window === 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.C4Analytics = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
