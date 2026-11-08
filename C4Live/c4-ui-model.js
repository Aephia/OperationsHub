// c4-ui-model.js - C4 Live pure computations (2026-11-06). No DOM. Loaded by C4Live/index.html (window.C4Model)
// and by Test/c4-live-check.js (require). Every number the panels show is computed here from the collector files
// (Data/c4-live/*.json, contract in Tools/c4-live/README.md) - no typed constants.
//
// Units: all mining rates are summed from fleets[].mine.out[].ups (richness applied), which is what kpis.galaxyUps,
// kpis.resUps and asteroids[].ups use. Since ~22:10 EDT 2026-11-06 owners[].ups, kpis.byFaction[].ups and mine.ups
// are that same unit too (the base rate moved to mine.baseUps); before that they held the base rate. Rates are still
// derived from out[] here, so a faction filter applies and older snapshots stay correct.
//
// Groups: a fleet belongs to 'npc' when npc != 0, else to its faction (mud | oni | ustur | unaligned).
(function (root) {
    'use strict';

    const GROUPS = ['mud', 'oni', 'ustur', 'npc'];
    const GROUP_LABEL = { mud: 'MUD', oni: 'ONI', ustur: 'Ustur', unaligned: 'Unaligned', npc: 'NPC' };
    const STATES = ['mining', 'warp', 'subwarp', 'idle', 'docked', 'destroyed', 'respawn', 'claimStakeTransfer'];
    const STATE_LABEL = { mining: 'Mining', warp: 'Warp', subwarp: 'Subwarp', idle: 'Idle', docked: 'Docked', destroyed: 'Destroyed', respawn: 'Respawn', claimStakeTransfer: 'Stake transfer' };
    const SIZES = ['xxSmall', 'xSmall', 'small', 'medium', 'large', 'capital', 'commander', 'titan'];
    const CAREERS = ['pilot', 'dataRunner', 'mining', 'building', 'crafting', 'combat'];
    const CAREER_LABEL = { pilot: 'Pilot', dataRunner: 'Data runner', mining: 'Mining', building: 'Building', crafting: 'Crafting', combat: 'Combat' };
    const DAY = 86400;

    // ------------------------------------------------------------------ formatting
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    function shortAddr(p) { return p && p.length > 12 ? p.slice(0, 4) + '…' + p.slice(-5) : (p || ''); }
    function fmt(n, d) {
        if (n == null || !isFinite(n)) return '-';
        const a = Math.abs(n);
        if (d == null) d = a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : a > 0 ? 3 : 0;
        if (a >= 1e9) return (n / 1e9).toFixed(2) + 'B';
        if (a >= 1e6) return (n / 1e6).toFixed(2) + 'M';
        if (a >= 1e4) return (n / 1e3).toFixed(1) + 'k';
        return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    }
    function pct(x, d) { if (x == null || !isFinite(x)) return '-'; const v = x * 100; return v.toFixed(d != null ? d : (v > 0 && v < 1 ? 1 : 0)) + '%'; }
    function ago(sec) {
        sec = Math.max(0, Math.round(sec));
        if (sec < 90) return sec + ' s';
        if (sec < 5400) return Math.round(sec / 60) + ' min';
        if (sec < 2 * DAY) return (sec / 3600).toFixed(sec < 36000 ? 1 : 0) + ' h';
        return Math.round(sec / DAY) + ' d';
    }
    function groupOf(f) { return f.npc ? 'npc' : (f.fa || 'unaligned'); }
    function eventGroup(e) { return e.npc ? 'npc' : (e.fa || 'unaligned'); }
    function matchGroup(g, filter) { return !filter || filter === 'all' || g === filter; }
    function sum(arr, fn) { let s = 0; for (const x of arr) s += fn(x); return s; }
    function fleetUps(f) { return f.mine && f.mine.out ? sum(f.mine.out, o => o.ups || 0) : 0; }

    // ------------------------------------------------------------------ data age / projection
    // age of the snapshot and the next expected run. 'late' past one interval (the run is due), 'stopped' past two:
    // the collector leaves latest.json untouched when it fails, so an old file is the only failure signal we get
    function dataAge(latest, nowSec) {
        const interval = (latest.intervalMin || 60) * 60;
        const age = Math.max(0, nowSec - latest.generatedAt);
        const state = age > interval * 2 ? 'stopped' : age > interval ? 'late' : 'ok';
        const stale = state === 'stopped';
        const next = state === 'ok' ? Math.max(0, interval - age) : null;
        return { age, next, stale, state, interval };
    }
    // units mined since the snapshot if every mining fleet keeps its current rate
    function projectMined(ups, generatedAt, nowSec) { return Math.max(0, ups * (nowSec - generatedAt)); }
    // the live counter: projects forward, and once the collector has stopped (age > 2 intervals) it HOLDS the value it
    // had reached at that moment, ups x 2 x interval, so it never jumps down at the boundary and never climbs for days
    function liveMined(ups, latest, nowSec) {
        const a = dataAge(latest, nowSec);
        if (a.stale) return { units: ups * 2 * a.interval, frozen: true };
        return { units: projectMined(ups, latest.generatedAt, nowSec), frozen: false };
    }
    // collector read-quality notes (latest.quality); empty when the pass was clean
    function qualityNotes(q) {
        const out = [];
        if (!q) return out;
        if (q.partial) {
            const parts = [];
            if (q.mineFailed) parts.push(`${q.mineFailed} of ${q.mineTotal} mining states failed`);
            if (q.charFailed) parts.push(`${q.charFailed} of ${q.charTotal} player profiles failed`);
            out.push(`Partial read: ${parts.length ? parts.join(', ') : 'some reads failed'}, so rates are low and no history point was added.`);
        }
        if (q.suspectDiscovery) out.push('Fleet discovery looked truncated on this pass: closed fleets were not counted as gone.');
        if (q.bodiesFailed) out.push('The planets and asteroids read failed on this run; bodies.json is from an earlier run.');
        if (q.stakeDefsFailed) out.push('The claim-stake definitions read failed on this run, so stake tiers are unknown.');
        return out;
    }

    // ------------------------------------------------------------------ concentration
    // share of total held by the top n; and the fewest items needed to reach half of the total
    function concentration(values, n) {
        const v = values.filter(x => x > 0).sort((a, b) => b - a);
        const total = sum(v, x => x);
        if (!total) return { total: 0, count: 0, topShare: 0, forHalf: 0 };
        const top = sum(v.slice(0, n), x => x);
        let acc = 0, k = 0;
        while (k < v.length && acc < total / 2) acc += v[k++];
        return { total, count: v.length, topShare: top / total, forHalf: k };
    }
    function concLabel(share) { return share >= 0.5 ? 'highly concentrated' : share >= 0.25 ? 'concentrated' : 'broad'; }

    // ------------------------------------------------------------------ owners
    // one record per owner profile, aggregated from the fleets (so a faction filter applies), merged with the
    // collector's owner record (atlas, council rank, XP, stakes) where one exists (NPC owner has none)
    function aggregateOwners(fleets, ownerRecs) {
        const recBy = new Map((ownerRecs || []).map(o => [o.p, o]));
        const by = new Map();
        for (const f of fleets) {
            let o = by.get(f.o);
            if (!o) {
                const r = recBy.get(f.o) || {};
                o = { p: f.o, fa: f.fa, npc: !!f.npc, group: groupOf(f), fleets: 0, ships: 0, mining: 0, ups: 0, res: {}, destroyed: 0, fleetList: [],
                      atlas: r.atlas != null ? r.atlas : null, rank: r.rank != null ? r.rank : null, xp: r.xp || null,
                      stakes: r.stakes || 0, stakesLive: r.stakesLive != null ? r.stakesLive : null, habs: r.habs || 0, lastCombat: 0, hasRecord: !!r.p,
                      // v5 identity + wealth (collector 2026-11-07): name is user-typed text, render it escaped only
                      name: r.name != null ? r.name : null, nameLen: r.nameLen != null ? r.nameLen : null, wallet: r.wallet || null,
                      refBid: refRange(r).atBid, refAsk: refRange(r).atAsk };
                by.set(f.o, o);
            }
            o.fleets++; o.ships += f.ships || 0; o.fleetList.push(f);
            if (f.s && f.s.kind === 'destroyed') o.destroyed++;
            if (f.lc > o.lastCombat) o.lastCombat = f.lc;
            const u = fleetUps(f);
            if (u > 0) {
                o.mining++; o.ups += u;
                for (const q of f.mine.out) o.res[q.r] = (o.res[q.r] || 0) + q.ups;
            }
        }
        const list = [...by.values()];
        for (const o of list) o.xpTotal = o.xp ? sum(CAREERS, c => (o.xp[c] && o.xp[c].xp) || 0) : 0;
        return list;
    }
    // highest XP per career among players: the scale for an owner's XP bars
    function careerMax(ownerRecs) {
        const m = {};
        for (const c of CAREERS) m[c] = Math.max(0, ...ownerRecs.map(o => (o.xp && o.xp[c] && o.xp[c].xp) || 0));
        return m;
    }

    // ------------------------------------------------------------------ geometry
    function nearestSystem(systems, x, y) {
        let best = null, bd = Infinity;
        for (const s of systems) { const d = (s.x - x) ** 2 + (s.y - y) ** 2; if (d < bd) { bd = d; best = s; } }
        return best;
    }

    // ------------------------------------------------------------------ combat
    // Event semantics (README, 2026-11-06): k:'combat' = the fleet TOOK PART (attacker and defender are stamped with the
    // same lastCombatUpdate second). dmg = its hp or shields fell since the previous run. vs = other fleets stamped in the
    // same second = LIKELY opponents (allies can share a stamp). 'gone' = the account closed between runs; with
    // afterCombat it is a probable kill, kept apart from confirmed 'destroyed'. Seed events have no vs / dmg.
    const COMBAT_KINDS = { combat: 1, destroyed: 1, gone: 1, starbaseCombat: 1, captured: 1 };   // newFleet is not combat

    // distinct fleets confirmed destroyed: a kill can carry BOTH a 'destroyed' event and a combat event with dead:true
    function destroyedFleets(events) {
        const s = new Set();
        for (const e of events) if (e.k === 'destroyed' || (e.k === 'combat' && e.dead)) s.add(e.f);
        return s;
    }
    // account closed right after combat and not already counted as destroyed
    function probableKills(events, destroyedSet) {
        const s = new Set();
        for (const e of events) if (e.k === 'gone' && e.afterCombat && !destroyedSet.has(e.f)) s.add(e.f);
        return s;
    }
    // engagements = combat participations grouped by stamp second, linked through vs. Seed events carry no vs, so
    // seed events sharing a second are grouped together (attacker and defender share it).
    function engagements(events) {
        const fights = events.filter(e => e.k === 'combat');
        const parent = fights.map((_, i) => i);
        const find = i => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
        const join = (a, b) => { a = find(a); b = find(b); if (a !== b) parent[a] = b; };
        const byT = new Map();
        fights.forEach((e, i) => { const l = byT.get(e.t) || []; l.push(i); byT.set(e.t, l); });
        for (const idx of byT.values()) {
            const byF = new Map(idx.map(i => [fights[i].f, i]));
            let noVs = -1;
            for (const i of idx) {
                const e = fights[i];
                if (Array.isArray(e.vs)) { for (const v of e.vs) if (byF.has(v.f)) join(i, byF.get(v.f)); }
                else if (noVs < 0) noVs = i; else join(i, noVs);
            }
        }
        return new Set(fights.map((_, i) => find(i))).size;
    }
    // likely pairings from vs: one per (second, fleet pair). Faction matrix + owner-vs-owner list.
    function vsPairs(events) {
        const matrix = {}; for (const a of GROUPS) { matrix[a] = {}; for (const b of GROUPS) matrix[a][b] = 0; }
        const seen = new Set(), owners = new Map();
        let linked = 0, unlinked = 0, selfPairs = 0;
        for (const e of events) {
            if (e.k !== 'combat') continue;
            if (!Array.isArray(e.vs) || !e.vs.length) { unlinked++; continue; }
            linked++;
            for (const v of e.vs) {
                const key = e.t + '|' + (e.f < v.f ? e.f + '|' + v.f : v.f + '|' + e.f);
                if (seen.has(key)) continue;
                seen.add(key);
                const ga = eventGroup(e), gb = eventGroup(v);
                if (matrix[ga] && matrix[gb]) { matrix[ga][gb]++; if (ga !== gb) matrix[gb][ga]++; }
                const A = { o: e.o || e.f, group: ga, n: e.n }, B = { o: v.o || v.f, group: gb, n: v.n };
                if (A.o === B.o) { selfPairs++; continue; }        // same owner both sides (always so for NPC vs NPC)
                const [x, y] = A.o <= B.o ? [A, B] : [B, A];
                const ok = x.o + '|' + y.o;
                const p = owners.get(ok) || { a: { o: x.o, group: x.group, names: new Set() }, b: { o: y.o, group: y.group, names: new Set() }, count: 0, last: 0, x: e.x, y: e.y, same: x.group === y.group };
                p.count++; p.a.names.add(x.n); p.b.names.add(y.n);
                if (e.t >= p.last) { p.last = e.t; p.x = e.x; p.y = e.y; }
                owners.set(ok, p);
            }
        }
        const pairings = [...owners.values()].map(p => ({ ...p, a: { ...p.a, names: [...p.a.names] }, b: { ...p.b, names: [...p.b.names] } }))
            .sort((p, q) => q.count - p.count || q.last - p.last);
        return { matrix, pairs: seen.size, linked, unlinked, pairings, selfPairs };
    }
    // Combat hot spots, the ONE rule shared with the map's callouts (lead contract, 2026-11-07): every fighting event in
    // the 24 h before the snapshot (combat, destroyed, starbaseCombat, captured, gone after combat; a kill once per fleet,
    // since one kill is recorded as both `destroyed` and `combat` dead:true) goes to the NEAREST system within 1.2 map
    // units; the spot is named after that system and counts all its events. Events with no system that close go to a
    // 0.5-unit cell named "Deep space x, y". v4: the SAME keys and the SAME order as the scene's combatSpots
    // (scene-src/model.js; Test/c4-live-check.js [13c] asserts equality): key = the system address, or 'deep:i,j' with
    // i, j = Math.round(x * 2), Math.round(y * 2); sorted by n desc, then last (latest event t) desc, then key asc.
    const HOT_R2 = 1.2 * 1.2;
    const isHotKind = e => e.k === 'combat' || e.k === 'destroyed' || e.k === 'starbaseCombat' || e.k === 'captured' || (e.k === 'gone' && e.afterCombat === true);
    function combatHotSpots(systems, events, ref, windowS) {
        windowS = windowS || DAY;
        const spots = new Map(), killed = new Set();
        const fin = v => typeof v === 'number' && isFinite(v);
        const sys = (systems || []).filter(s => fin(s.x) && fin(s.y));
        for (const e of events || []) {
            if (!isHotKind(e) || !fin(e.t) || !fin(e.x) || !fin(e.y) || e.t > ref || e.t <= ref - windowS) continue;
            if ((e.k === 'destroyed' || e.dead === true) && e.f) { if (killed.has(e.f)) continue; killed.add(e.f); }
            let best = null, bd = HOT_R2;
            // tie (equal squared distance): the system whose address sorts lower (lead rule, 2026-11-07)
            for (const s of sys) { const d = (s.x - e.x) ** 2 + (s.y - e.y) ** 2; if (d < bd || (d === bd && best && s.a < best.a)) { bd = d; best = s; } }
            const key = best ? best.a : 'deep:' + Math.round(e.x * 2) + ',' + Math.round(e.y * 2);
            let h = spots.get(key);
            if (!h) { h = { key, sys: best ? best.a : null, system: best, n: 0, last: 0, sx: 0, sy: 0 }; spots.set(key, h); }
            h.n++; h.last = Math.max(h.last, e.t); h.sx += e.x; h.sy += e.y;
        }
        return [...spots.values()].map(h => {
            const x = h.system ? h.system.x : h.sx / h.n, y = h.system ? h.system.y : h.sy / h.n;
            return { key: h.key, sys: h.sys, name: h.system ? h.system.n : deepSpaceName(sys, x, y), x, y, n: h.n, last: h.last };
        }).sort(hotOrder);
    }
    // v7 (lead pin, 2026-11-07): a deep-space spot is named after the system nearest the cell's mean point, at ANY
    // distance (tie: lower address) -> "Deep space near <NAME>"; no system at all -> "Deep space"
    function deepSpaceName(systems, x, y) {
        let best = null, bd = Infinity;
        for (const s of systems || []) {
            if (!s || !isFinite(s.x) || !isFinite(s.y)) continue;
            const d = (s.x - x) ** 2 + (s.y - y) ** 2;
            if (d < bd || (d === bd && best && s.a < best.a)) { bd = d; best = s; }
        }
        return best ? `Deep space near ${best.n || shortAddr(best.a)}` : 'Deep space';
    }
    // the ONE tie order for hot spots (lead rule, 2026-11-07): n desc, then last desc, then key asc (code-unit order)
    function hotOrder(a, b) { return b.n - a.n || b.last - a.last || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0); }
    // idx (optional) = ownerIndex(latest): shows the owner's name where one exists (v5)
    function sideLabel(s, idx) { return s.group === 'npc' ? 'NPC' : `${GROUP_LABEL[s.group] || s.group} ${ownerText(idx, s.o)}`; }

    function buildCombat(latest, events, filter) {
        const t0 = latest.generatedAt;
        const ev = events.filter(e => COMBAT_KINDS[e.k] && matchGroup(eventGroup(e), filter));
        const fleetFights = ev.filter(e => e.k === 'combat');
        const day = ev.filter(e => e.t > t0 - DAY);
        const part24 = day.filter(e => e.k === 'combat');
        const dead24 = destroyedFleets(day);
        const gone24 = probableKills(day, dead24);
        const sb24 = day.filter(e => e.k === 'starbaseCombat');
        const captured = ev.filter(e => e.k === 'captured');
        // 24 hourly buckets ending at the snapshot; index 23 is the most recent hour
        const hours = [];
        for (let i = 0; i < 24; i++) hours.push({ start: t0 - (24 - i) * 3600, fleet: 0, starbase: 0 });
        for (const e of day) {
            const i = Math.min(23, Math.floor((e.t - (t0 - DAY)) / 3600));
            if (i < 0) continue;
            if (e.k === 'combat') hours[i].fleet++;
            else if (e.k === 'starbaseCombat' || e.k === 'captured') hours[i].starbase++;
        }
        // most engaged owners over the whole event file (participations, chain timestamps)
        const ownerCount = new Map();
        for (const e of fleetFights) {
            if (!e.o) continue;
            const oc = ownerCount.get(e.o) || { o: e.o, group: eventGroup(e), count: 0, fleets: new Set(), last: 0 };
            oc.count++; oc.fleets.add(e.f); oc.last = Math.max(oc.last, e.t); ownerCount.set(e.o, oc);
        }
        const engagedOwners = [...ownerCount.values()].map(o => ({ ...o, fleets: o.fleets.size })).sort((a, b) => b.count - a.count || b.last - a.last);
        const destroyedNow = latest.fleets.filter(f => f.s && f.s.kind === 'destroyed' && matchGroup(groupOf(f), filter));
        const goneAll = ev.filter(e => e.k === 'gone').sort((a, b) => b.t - a.t);
        // starbases under fire
        const sbBy = new Map();
        for (const e of ev.filter(x => x.k === 'starbaseCombat' || x.k === 'captured')) {
            const s = sbBy.get(e.sys) || { sys: e.sys, n: e.n, fa: e.fa, count: 0, captures: 0, last: 0, x: e.x, y: e.y };
            if (e.k === 'captured') s.captures++; else s.count++;
            s.last = Math.max(s.last, e.t); sbBy.set(e.sys, s);
        }
        const starbases = [...sbBy.values()].sort((a, b) => b.last - a.last);
        const sb24count = new Map(); for (const e of sb24) sb24count.set(e.sys, (sb24count.get(e.sys) || 0) + 1);
        const pairs24 = vsPairs(day), pairsAll = vsPairs(ev);
        // hot spots in the last 24 h: the shared rule (combatHotSpots), so the panel and the map name the same places
        const hotSpots = combatHotSpots(latest.systems, ev, t0);
        const hot = hotSpots[0] || null;
        const hotSystem = hot && hot.sys ? (latest.systems || []).find(s => s.a === hot.sys) : null;
        const feed = ev.slice().sort((a, b) => b.t - a.t);
        const lastFight = fleetFights.reduce((m, e) => Math.max(m, e.t), 0);
        return {
            part24: part24.length, npcPart24: part24.filter(e => e.npc).length, eng24: engagements(day), destroyed24: dead24.size, gone24: gone24.size,
            sb24: sb24.length, sbHit24: sb24count.size, captured: captured.length, hours, engagedOwners, destroyedNow, goneAll, starbases,
            pairs24, pairsAll, hotSpots, hot, hotSystem, hotCount: hot ? hot.n : 0, feed, lastFight, total: ev.length
        };
    }

    // ------------------------------------------------------------------ mining
    function buildMining(latest, fleets, owners) {
        const miners = fleets.filter(f => fleetUps(f) > 0);
        const res = {};
        for (const f of miners) for (const q of f.mine.out) res[q.r] = (res[q.r] || 0) + q.ups;
        const ups = sum(Object.values(res), x => x);
        const resources = Object.entries(res).map(([r, u]) => ({ r, ups: u, share: ups ? u / ups : 0 })).sort((a, b) => b.ups - a.ups);
        // asteroids rebuilt from the (filtered) fleets that mine them; position/name from latest.asteroids
        const astMeta = new Map((latest.asteroids || []).map(a => [a.a, a]));
        const ast = new Map();
        for (const f of miners) {
            const id = f.s && f.s.asteroid; if (!id) continue;
            const m = astMeta.get(id) || {};
            const a = ast.get(id) || { a: id, sys: m.sys, sysName: m.sysName || shortAddr(id), x: m.x != null ? m.x : f.x, y: m.y != null ? m.y : f.y, fleets: 0, owners: new Map(), ups: 0, res: {} };
            const u = fleetUps(f);
            a.fleets++; a.ups += u; a.owners.set(f.o, (a.owners.get(f.o) || 0) + u);
            for (const q of f.mine.out) a.res[q.r] = (a.res[q.r] || 0) + q.ups;
            ast.set(id, a);
        }
        const asteroids = [...ast.values()].map(a => {
            const ownersSorted = [...a.owners.entries()].map(([p, u]) => ({ p, ups: u })).sort((x, y) => y.ups - x.ups);
            const topRes = Object.entries(a.res).sort((x, y) => y[1] - x[1])[0];
            return { ...a, owners: ownersSorted, ownerCount: ownersSorted.length, topRes: topRes ? topRes[0] : null, topResShare: topRes && a.ups ? topRes[1] / a.ups : 0 };
        }).sort((a, b) => b.ups - a.ups);
        const fleetsSorted = miners.map(f => ({ f, ups: fleetUps(f) })).sort((a, b) => b.ups - a.ups);
        const ownersSorted = owners.filter(o => o.ups > 0).sort((a, b) => b.ups - a.ups);
        const cFleets = concentration(fleetsSorted.map(x => x.ups), 10);
        const cOwners = concentration(ownersSorted.map(o => o.ups), 10);
        const ownerCount = ownersSorted.length;
        return { ups, resources, asteroids, fleets: fleetsSorted, owners: ownersSorted, miningFleets: miners.length, miningOwners: ownerCount, cFleets, cOwners };
    }

    // settled mining per run: minedDelta / minedDtSec x 3600. The asteroid counters only move when a fleet's mining
    // settles on chain, so this lags the live rate; a run without minedDtSec (written before the field existed) is
    // skipped rather than guessed from the gap between history points.
    function minedSeries(history) {
        const h = (history || []).slice().sort((a, b) => a.t - b.t);
        const out = [];
        let skipped = 0;
        for (const r of h) {
            const d = r.minedDelta || {}; const keys = Object.keys(d);
            if (!keys.length) continue;
            if (!(r.minedDtSec > 0)) { skipped++; continue; }
            const units = sum(keys, k => d[k] || 0);
            out.push({ t: r.t, units, dtSec: r.minedDtSec, perHour: units / r.minedDtSec * 3600, byRes: d });
        }
        return { runs: h.length, points: out, skipped };
    }

    // ------------------------------------------------------------------ fleets
    function buildFleets(fleets) {
        const byState = {}; for (const s of STATES) byState[s] = { player: 0, npc: 0 };
        const byGroup = {}; const size = {}; for (const s of SIZES) size[s] = 0;
        for (const f of fleets) {
            const k = (f.s && f.s.kind) || 'idle';
            if (!byState[k]) byState[k] = { player: 0, npc: 0 };
            byState[k][f.npc ? 'npc' : 'player']++;
            const g = groupOf(f); const b = byGroup[g] || (byGroup[g] = { fleets: 0, ships: 0, mining: 0 });
            b.fleets++; b.ships += f.ships || 0; if (fleetUps(f) > 0) b.mining++;
            for (const [k2, v] of Object.entries(f.size || {})) size[k2] = (size[k2] || 0) + v;
        }
        const n = fleets.length;
        const moving = (byState.warp.player + byState.warp.npc + byState.subwarp.player + byState.subwarp.npc);
        const mining = byState.mining.player + byState.mining.npc;
        const parked = byState.idle.player + byState.idle.npc + byState.docked.player + byState.docked.npc;
        return { n, byState, byGroup, size, moving, mining, parked, ships: sum(fleets, f => f.ships || 0) };
    }

    // ------------------------------------------------------------------ verdicts (rules over the computed values only)
    function miningVerdict(m) {
        if (!m.ups) return 'No fleet in this selection is mining right now.';
        const top = m.resources[0];
        return `<b>${esc(top.r)}</b> is <b>${pct(top.share)}</b> of the <b>${fmt(m.ups)} u/s</b> being mined. Output is <b>${concLabel(m.cOwners.topShare)}</b>: the top 10 owners make ${pct(m.cOwners.topShare)} of it, and half comes from just <b>${m.cFleets.forHalf}</b> of ${m.miningFleets} mining fleets.`;
    }
    function combatVerdict(c, nowChain, filter, idx) {
        if (!c.part24 && !c.sb24) {
            return c.lastFight ? `No fleet combat in the 24 h before the snapshot; the last recorded fight was <b>${ago(nowChain - c.lastFight)}</b> earlier.` : 'No combat recorded for this selection.';
        }
        const npc = c.part24 && (!filter || filter === 'all') ? `; ${pct(c.npcPart24 / c.part24)} of the fleets were NPC` : '';
        const kills = `At least <b>${c.destroyed24}</b> fleet${c.destroyed24 === 1 ? ' was' : 's were'} destroyed${c.gone24 ? ` and <b>${c.gone24}</b> more closed right after combat (probable kill${c.gone24 === 1 ? '' : 's'})` : ''}; <b>${c.sbHit24}</b> starbase${c.sbHit24 === 1 ? ' was' : 's were'} under fire.`;
        const top = c.pairs24.pairings.find(p => !p.same);
        const tail = top ? ` Most frequent likely pairing: <b>${esc(sideLabel(top.a, idx))}</b> vs <b>${esc(sideLabel(top.b, idx))}</b> (${top.count}).`
            : c.hot ? ` The hottest spot is ${c.hot.sys ? 'near ' : ''}<b>${esc(c.hot.name)}</b> (${c.hot.n} event${c.hot.n === 1 ? '' : 's'}).` : '';
        return `<b>${c.part24}</b> fleets took part in <b>${c.eng24}</b> engagement${c.eng24 === 1 ? '' : 's'} in the 24 h before the snapshot${npc}. ${kills}${tail}`;
    }
    function fleetsVerdict(fl) {
        if (!fl.n) return 'No fleets in this selection.';
        const head = `Of <b>${fmt(fl.n, 0)}</b> fleets, <b>${pct(fl.mining / fl.n)}</b> are mining, <b>${pct(fl.moving / fl.n)}</b> are moving and <b>${pct(fl.parked / fl.n)}</b> sit idle or docked.`;
        const groups = Object.entries(fl.byGroup).sort((a, b) => b[1].ships - a[1].ships);
        if (groups.length > 1) return `${head} <b>${esc(GROUP_LABEL[groups[0][0]] || groups[0][0])}</b> fields the most ships (${fmt(groups[0][1].ships)} of ${fmt(fl.ships)}).`;
        const sz = Object.entries(fl.size).sort((a, b) => b[1] - a[1])[0];
        return sz && fl.ships ? `${head} Most ships are <b>${esc(sz[0])}</b> hulls (${pct(sz[1] / fl.ships)}).` : head;
    }
    function ownersVerdict(players, m) {
        if (!players.length) return 'No player owners in this selection.';
        const single = players.filter(o => o.fleets === 1).length;
        const biggest = players.slice().sort((a, b) => b.ships - a.ships)[0];
        const idle = players.filter(o => o.mining === 0).length;
        return `<b>${players.length}</b> players; <b>${pct(single / players.length)}</b> run a single fleet and <b>${pct(idle / players.length)}</b> mine nothing. The largest owner, <b>${esc(displayName(biggest, biggest.p).text)}</b>, has ${biggest.fleets} fleets and ${fmt(biggest.ships)} ships.`;
    }
    function ownerVerdict(o, rankByUps) {
        if (o.npc) return `All NPC fleets share this one profile: <b>${o.fleets}</b> fleets and ${fmt(o.ships)} ships, ${o.mining ? `${o.mining} mining` : 'none mining'}.`;
        const lab = esc(GROUP_LABEL[o.fa] || o.fa);
        if (!o.ups) return `This ${lab} player runs <b>${o.fleets}</b> fleet${o.fleets === 1 ? '' : 's'} (${fmt(o.ships)} ships) and mines nothing right now.`;
        const topRes = Object.entries(o.res).sort((a, b) => b[1] - a[1])[0];
        return `This ${lab} player runs <b>${o.fleets}</b> fleet${o.fleets === 1 ? '' : 's'}; <b>${o.mining}</b> mine <b>${fmt(o.ups)} u/s</b>, mostly ${esc(topRes[0])}, <b>#${rankByUps}</b> of ${o.minerCount} mining owners.`;
    }
    function asteroidVerdict(a, idx) {
        if (!a) return 'Nobody in this selection mines this asteroid right now.';
        const top = a.owners[0];
        return `<b>${a.fleets}</b> fleets from <b>${a.ownerCount}</b> owner${a.ownerCount === 1 ? '' : 's'} mine <b>${fmt(a.ups)} u/s</b> here, mostly ${esc(a.topRes)} (${pct(a.topResShare)}); ${esc(ownerText(idx, top.p))} takes <b>${pct(top.ups / a.ups)}</b>.`;
    }

    // claim stake label: the definition name from the chain ("Claim Stake Tier 1"); without it, the raw definition id,
    // and say why when the collector reports that the definitions read failed
    function stakeLabel(k, quality) {
        if (k && k.defName) return String(k.defName);
        const d = k && k.def != null ? `def ${k.def}` : 'definition unknown';
        return quality && quality.stakeDefsFailed ? `${d}, tier unknown (read failed)` : d;
    }

    // ------------------------------------------------------------------ systems and bodies (bodies.json, loaded lazily)
    // Joins (README): fleets[].s.asteroid = body.a; stakes[].body = planet.a; stakes[].o = owner. The chain gives no
    // position for a body inside its system.
    const AT_SYSTEM = 0.05;      // map units: a combat event this close to a system's coordinates happened "at" it
    const PLANET_IMG = { oceanic: 'oceanic', barren: 'barren', 'gas-giant': 'gas', 'ice-giant': 'ice', volcanic: 'volcanic', terrestrial: 'terrestrial', dark: 'dark' };
    const SUB_LABEL = { oceanic: 'Oceanic', barren: 'Barren', 'gas-giant': 'Gas giant', 'ice-giant': 'Ice giant', volcanic: 'Volcanic', terrestrial: 'Terrestrial', dark: 'Dark' };

    function indexBodies(bodies) {
        const byA = new Map(), bySys = new Map();
        for (const b of bodies || []) { byA.set(b.a, b); const l = bySys.get(b.sys) || []; l.push(b); bySys.set(b.sys, l); }
        return { byA, bySys, n: byA.size };
    }
    // file in Images/planets for a body (3 variants per type, picked by the body id)
    function bodyImage(b, size) {
        const t = b.k === 'asteroid' ? 'belt' : (PLANET_IMG[b.sub] || 'barren');
        return `../Images/planets/${t}_${Math.abs(b.id | 0) % 3}_${size || 128}.webp`;
    }
    function bodyKind(b) { return b.k === 'asteroid' ? 'Asteroid' : (SUB_LABEL[b.sub] || 'Planet') + ' planet'; }
    // Which fleets are "in" a system. PORTED EXACTLY from the scene (C4Live/scene-src/model.js systemMembers +
    // restPoint + fleetPath, task #19, 2026-11-06), because the panel must count what the map draws:
    //   docked with s.system -> that system; mining -> its asteroid's system (unknown asteroid -> none);
    //   everything else at its resting point -> the NEAREST system within 0.6 map units (Euclidean). The resting point
    //   is x,y, or s.to for a warp/subwarp that had arrived by settledBy = generatedAt - 120 s; a transit still in
    //   flight belongs to no system. Same inputs as the scene: fleets with s and finite x,y; systems with finite x,y.
    // Test/c4-live-check.js asserts equality with the scene's own function for all systems.
    const MEMBER_R2 = 0.36;          // 0.6 ^ 2
    const SETTLE_S = 120;
    const isNum = v => typeof v === 'number' && Number.isFinite(v);
    const isPt = q => Array.isArray(q) && q.length >= 2 && isNum(q[0]) && isNum(q[1]);
    function restPoint(f, settledBy) {
        const s = f.s || {};
        if ((s.kind === 'warp' || s.kind === 'subwarp') && isPt(s.to) && isNum(s.departs) && isNum(s.arrives)) return s.arrives <= settledBy ? [s.to[0], s.to[1]] : null;
        return [isNum(f.x) ? f.x : 0, isNum(f.y) ? f.y : 0];
    }
    const memberCache = new WeakMap();   // latest -> { idx, map }
    function systemMembership(latest, idx) {
        const c = memberCache.get(latest);
        if (c && c.idx === idx) return c.map;
        const settledBy = (isNum(latest.generatedAt) ? latest.generatedAt : 0) - SETTLE_S;
        const systems = (latest.systems || []).filter(s => isNum(s.x) && isNum(s.y));
        const astSys = new Map(); for (const b of idx.byA.values()) if (b.k === 'asteroid' && b.a && b.sys) astSys.set(b.a, b.sys);
        const map = new Map();
        const add = (sys, f) => { let l = map.get(sys); if (!l) map.set(sys, l = []); l.push(f); };
        for (const f of latest.fleets || []) {
            if (!f || !f.s || !isNum(f.x) || !isNum(f.y)) continue;
            const best = memberSystem(f, systems, astSys, settledBy);
            if (best) add(best, f);
        }
        memberCache.set(latest, { idx, map });
        return map;
    }
    // the one membership rule for one fleet (systemMembership and dacInfluence share it); null = in flight / nowhere
    function memberSystem(f, systems, astSys, settledBy) {
        const k = f.s.kind;
        if (k === 'docked' && f.s.system) return f.s.system;
        if (k === 'mining') return astSys.get(f.s.asteroid) || null;
        const rp = restPoint(f, settledBy);
        if (!rp) return null;                    // in flight
        let best = null, bd = MEMBER_R2;
        for (const sy of systems) { const d = (sy.x - rp[0]) ** 2 + (sy.y - rp[1]) ** 2; if (d < bd) { bd = d; best = sy.a; } }
        return best;
    }
    function fleetsInSystem(latest, idx, sys) { return (systemMembership(latest, idx).get(sys.a) || []).slice(); }
    function outByRes(fleets) {
        const r = {};
        for (const f of fleets) if (f.mine && f.mine.out) for (const q of f.mine.out) r[q.r] = (r[q.r] || 0) + q.ups;
        return Object.entries(r).map(([k, u]) => ({ r: k, ups: u })).sort((a, b) => b.ups - a.ups);
    }
    // one body with everything the drawer needs
    function buildBody(latest, idx, a) {
        const b = idx.byA.get(a);
        if (!b) return null;
        const galaxyUps = sum(latest.fleets, fleetUps);
        const res = (b.res || []).slice().sort((x, y) => (y.rich || 0) - (x.rich || 0));
        const out = { b, a, name: b.n, kind: bodyKind(b), isAsteroid: b.k === 'asteroid', res, richMax: Math.max(0, ...res.map(r => r.rich || 0)) };
        if (b.k === 'asteroid') {
            const fleets = latest.fleets.filter(f => f.s && f.s.kind === 'mining' && f.s.asteroid === a).map(f => ({ f, ups: fleetUps(f) })).sort((x, y) => y.ups - x.ups);
            out.fleets = fleets;
            out.ups = sum(fleets, x => x.ups);
            out.owners = new Set(fleets.map(x => x.f.o)).size;
            out.live = outByRes(fleets.map(x => x.f));
            out.share = galaxyUps ? out.ups / galaxyUps : 0;
            out.mined = sum(res, r => r.mined || 0);
            out.activeMiners = sum(res, r => r.miners || 0);
        } else {
            const stakes = (latest.stakes || []).filter(s => s.body === a);
            out.stakes = stakes;
            out.stakeOwners = new Set(stakes.map(s => s.o)).size;
            out.buildings = sum(stakes, s => s.b || 0);
            out.crew = sum(stakes, s => s.crew || 0);
            out.claimed = b.claimed || 0;
        }
        out.verdict = bodyVerdict(out);
        return out;
    }
    // "zoom in to see ships" hint (task #27, re-derived #29 on the frozen scene f80f0e08 / model.js 9596fceb). The scene
    // draws hulls at world scale; a hull whose projected length is under HULL_PX.collapse = 2.5 px is neither drawn nor
    // pickable (FLEET_VS + main.js). Projected length = SHIP_BASE.galaxy x sizeScale x 2 x px-per-map-unit, and
    // sizeScale x 2 = HULL_LEN / 0.92 (the silhouette fills 0.92 of its quad). "Zoom in to see them" = the first MEDIUM
    // hulls appear: 0.75 / (0.00096 / 0.92) = 718.75 px per map unit. Test/c4-live-check.js re-derives this from model.js.
    // 2026-11-08 (continuous world, builder-c4-scene-v10): one world scale WORLD.K = 0.032 for systems AND ships, so every
    // hull length is the old one x 0.032, and HULL_PX = {collapse 0.75, full 1.5} (owner: no floor, fade below ~1.5 px).
    const SHIP_HULL_MEDIUM = 0.00096, SHIP_MIN_PX = 0.75;
    const SHIP_HINT_PX_PER_UNIT = SHIP_MIN_PX / (SHIP_HULL_MEDIUM / 0.92);
    // the scene's HULL_LEN by flagship class (model.js; asserted equal in Test/c4-live-check.js), so a probe fleet's
    // drawn size (scene.fleetPixelSize) converts to px per map unit at that fleet's own depth
    const SHIP_HULL_LEN = { 'xx-small': 0.000384, 'x-small': 0.000512, small: 0.000704, medium: 0.00096, large: 0.00128, capital: 0.001664, commander: 0.00192, titan: 0.00224 };
    function pxPerUnitFromHull(hullPx, flagSize) {
        const len = Object.prototype.hasOwnProperty.call(SHIP_HULL_LEN, flagSize) ? SHIP_HULL_LEN[flagSize] : SHIP_HULL_LEN.medium;
        return isFinite(hullPx) && hullPx > 0 ? hullPx / (len / 0.92) : null;
    }
    // show when a map filter is active and the camera is at overview scale; with no scale reading, show while filtered
    function shipHintVisible(filterActive, pxPerUnit) {
        if (!filterActive) return false;
        if (pxPerUnit == null || !isFinite(pxPerUnit)) return true;
        return pxPerUnit < SHIP_HINT_PX_PER_UNIT;
    }
    // hover tip lines for a body (plain text; the caller escapes): the same facts as the scene's bodyLabel -
    // top 3 resources with richness, then miners and u/s for an asteroid or claim stakes for a planet
    function bodyTip(o) {
        if (!o) return [];
        const top = o.res.slice(0, 3).map(r => `${r.r} x${r.rich}`).join(', ');
        const lines = [o.name, o.kind];
        if (top) lines.push(top);
        if (o.isAsteroid) lines.push(o.fleets.length ? `${o.fleets.length} fleet${o.fleets.length === 1 ? '' : 's'} mining, ${fmt(o.ups)} u/s (${o.activeMiners} active miner slot${o.activeMiners === 1 ? '' : 's'})` : 'nobody mining');
        else lines.push(`${o.stakes.length} claim stake${o.stakes.length === 1 ? '' : 's'}`);
        return lines;
    }
    function buildSystem(latest, events, idx, sysAddr) {
        const sys = (latest.systems || []).find(s => s.a === sysAddr);
        if (!sys) return null;
        const bodies = (idx.bySys.get(sysAddr) || []).map(b => buildBody(latest, idx, b.a))
            .sort((x, y) => (x.isAsteroid - y.isAsteroid) || (x.b.id - y.b.id));
        const fleets = fleetsInSystem(latest, idx, sys);
        const byState = {}; for (const f of fleets) { const k = f.s.kind; byState[k] = (byState[k] || 0) + 1; }
        const miners = fleets.filter(f => fleetUps(f) > 0);
        const ups = sum(miners, fleetUps);
        const galaxyUps = sum(latest.fleets, fleetUps);
        const stakes = (latest.stakes || []).filter(s => s.sys === sysAddr);
        const near = e => Math.abs(e.x - sys.x) < AT_SYSTEM && Math.abs(e.y - sys.y) < AT_SYSTEM;
        const combat = (events || []).filter(e => (e.k === 'starbaseCombat' || e.k === 'captured') ? e.sys === sysAddr : (COMBAT_KINDS[e.k] && near(e))).sort((a, b) => b.t - a.t);
        const out = {
            sys, bodies, planets: bodies.filter(x => !x.isAsteroid), asteroids: bodies.filter(x => x.isAsteroid), fleets, byState,
            players: fleets.filter(f => !f.npc).length, npc: fleets.filter(f => f.npc).length, miners: miners.length, ups,
            share: galaxyUps ? ups / galaxyUps : 0, live: outByRes(miners), stakes, stakePlanets: new Set(stakes.map(s => s.body)).size, combat
        };
        out.verdict = systemVerdict(out);
        return out;
    }
    function systemVerdict(s) {
        const name = esc(s.sys.n);
        const head = `<b>${name}</b> has <b>${s.planets.length}</b> planet${s.planets.length === 1 ? '' : 's'} and <b>${s.asteroids.length}</b> asteroid${s.asteroids.length === 1 ? '' : 's'}`;
        const mine = s.ups ? `<b>${s.miners}</b> fleet${s.miners === 1 ? '' : 's'} mine <b>${fmt(s.ups)} u/s</b> here (${pct(s.share)} of galaxy output), mostly ${esc(s.live[0].r)}` : 'nobody mines here right now';
        const stk = s.stakes.length ? `<b>${s.stakes.length}</b> claim stake${s.stakes.length === 1 ? '' : 's'} on ${s.stakePlanets} planet${s.stakePlanets === 1 ? '' : 's'}` : 'no claim stakes';
        return `${head}; ${mine}; ${stk}.`;
    }
    function bodyVerdict(o) {
        const top = o.res[0];
        const rich = top ? ` Richest: ${esc(top.r)} x${top.rich}.` : '';
        if (o.isAsteroid) {
            const settled = `${fmt(o.mined, 0)} units settled on chain so far`;
            if (!o.fleets.length) return `Nobody mines <b>${esc(o.name)}</b> right now; ${settled}.${rich}`;
            return `<b>${o.fleets.length}</b> fleet${o.fleets.length === 1 ? '' : 's'} from <b>${o.owners}</b> owner${o.owners === 1 ? '' : 's'} mine <b>${fmt(o.ups)} u/s</b> here, <b>${pct(o.share)}</b> of galaxy output; ${settled}.${rich}`;
        }
        if (!o.stakes.length) return `An unclaimed ${esc(o.kind.toLowerCase())} with <b>${o.res.length}</b> resources.${rich}`;
        return `A ${esc(o.kind.toLowerCase())} with <b>${o.res.length}</b> resources and <b>${o.stakes.length}</b> claim stake${o.stakes.length === 1 ? '' : 's'} from <b>${o.stakeOwners}</b> owner${o.stakeOwners === 1 ? '' : 's'} (${o.buildings} buildings, ${o.crew} crew).${rich}`;
    }

    // ------------------------------------------------------------------ everything for one filter
    function build(latest, events, history, ownersSeries, opts) {
        const filter = (opts && opts.faction) || 'all';
        const fleets = latest.fleets.filter(f => matchGroup(groupOf(f), filter));
        const owners = aggregateOwners(fleets, latest.owners);
        const idx = ownerIndex(latest);
        const players = owners.filter(o => !o.npc);
        const mining = buildMining(latest, fleets, owners);
        mining.owners.forEach((o, i) => { o.upsRank = i + 1; });
        for (const o of owners) o.minerCount = mining.miningOwners;
        const fl = buildFleets(fleets);
        const combat = buildCombat(latest, events || [], filter);
        const series = minedSeries(history);
        const stakes = (latest.stakes || []).filter(s => filter === 'all' || owners.some(o => o.p === s.o));
        const kpi = {
            players: players.length, fleets: fleets.length, playerFleets: fleets.filter(f => !f.npc).length, npcFleets: fleets.filter(f => f.npc).length,
            ships: fl.ships, miningFleets: mining.miningFleets, ups: mining.ups, combat24: combat.part24, eng24: combat.eng24, destroyed24: combat.destroyed24,
            destroyedNow: combat.destroyedNow.length, stakes: stakes.length
        };
        return {
            filter, fleets, owners, players, mining, fleetsView: fl, combat, series, stakes, kpi,
            careerMax: careerMax(latest.owners || []),
            ident: idx,
            verdicts: { mining: miningVerdict(mining), combat: combatVerdict(combat, latest.generatedAt, filter, idx), fleets: fleetsVerdict(fl), owners: ownersVerdict(players, mining) }
        };
    }

    // ------------------------------------------------------------------ owner identity + wealth (v5, 2026-11-07)
    // owners[].name is USER-TYPED chain text (Tools/c4-live/README.md "Owner identity and wealth"): not unique, anyone can
    // pick anyone's name. The collector strips control / zero-width / bidi characters; the page strips the same set again
    // (defence in depth: an older or hand-edited file must not flip the text direction of a row) and renders names as
    // TEXT only (esc / textContent). The profile address always stays reachable, since a name alone identifies nobody.
    const NAME_STRIP = /[\u0000-\u001f\u007f-\u009f؜​-‏‪-‮⁦-⁩﻿]/g;
    function cleanName(s) { return s == null ? '' : String(s).replace(NAME_STRIP, '').replace(/\s+/g, ' ').trim(); }
    function ownerIndex(latest) { const m = new Map(); for (const o of (latest && latest.owners) || []) if (o && o.p) m.set(o.p, o); return m; }
    // rec = a collector owner record (or an aggregateOwners row); p = the profile. A cut name (nameLen set) ends in an
    // ellipsis; no name -> the short profile address.
    function displayName(rec, p) {
        const prof = p || (rec && rec.p) || '';
        const nm = cleanName(rec && rec.name);
        if (!nm) return { text: shortAddr(prof), named: false, truncated: false, profile: prof };
        const truncated = rec.nameLen != null;
        return { text: truncated ? nm + '…' : nm, name: nm, named: true, truncated, profile: prof };
    }
    function ownerText(idx, p) { return displayName(idx && idx.get ? idx.get(p) : null, p).text; }
    // the wallet chip: first 4 characters of the AUTH WALLET (never the profile address); null when unknown
    function walletShort(w) { return typeof w === 'string' && w.length >= 4 ? w.slice(0, 4) : null; }
    // Find owner by name: case-insensitive; exact > prefix > substring, then more ships, then name, then profile
    function findOwners(recs, q) {
        const ql = cleanName(q).toLowerCase();
        if (!ql) return [];
        const out = [];
        for (const r of recs || []) {
            const nm = cleanName(r && r.name); if (!nm) continue;
            const n = nm.toLowerCase();
            const tier = n === ql ? 0 : n.startsWith(ql) ? 1 : n.includes(ql) ? 2 : -1;
            if (tier >= 0) out.push({ p: r.p, name: nm, tier, ships: r.ships || 0, fa: r.fa });
        }
        return out.sort((a, b) => a.tier - b.tier || b.ships - a.ships || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0) || (a.p < b.p ? -1 : 1));
    }
    // the mainnet reference value as a RANGE. atBid and atAsk each sum only the lines that have that side of the book, so
    // atAsk can be BELOW atBid (26 owners on 2026-11-07): lo/hi are the smaller/larger of the two, never one number.
    function refRange(rec) {
        const rv = rec && rec.holdings && rec.holdings.refValue;
        const ok = v => typeof v === 'number' && isFinite(v);
        if (!rv || (!ok(rv.atBid) && !ok(rv.atAsk))) return { atBid: null, atAsk: null, lo: null, hi: null };
        const vals = [rv.atBid, rv.atAsk].filter(ok);
        return { atBid: ok(rv.atBid) ? rv.atBid : null, atAsk: ok(rv.atAsk) ? rv.atAsk : null, lo: Math.min(...vals), hi: Math.max(...vals) };
    }
    const STALE_PRICES_S = 26 * 3600;
    function wealthView(rec, latest) {
        const h = rec && rec.holdings;
        if (!h) return null;
        const ref = (latest && latest.ref) || null, q = (latest && latest.quality) || {};
        const rv = h.refValue || null;
        const hulls = Object.entries(h.hulls || {}).filter(e => e[1] > 0).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
        const cargo = (h.cargo || []).filter(c => c && c.units > 0).slice().sort((a, b) => b.units - a.units);
        const rr = refRange(rec);
        const pricesAt = (rv && rv.pricesAt) || (ref && ref.pricesAt) || null;
        const range = rr.lo == null ? null : { ...rr, priced: rv.priced || 0, lines: (rv.priced || 0) + (rv.unpriced || 0), pricesAt };
        const stale = !!(ref && ref.stale) || !!(pricesAt && latest && latest.generatedAt && latest.generatedAt - pricesAt > STALE_PRICES_S);
        const notes = [];
        if (!range) notes.push(ref ? 'No mainnet reference value for this owner (nothing it holds has a priced mainnet match).' : 'No mainnet reference prices in this snapshot.');
        if (stale) notes.push('The reference prices are stale (older than 26 h); thin mainnet books may have moved since.');
        if (q.pricesFailed) notes.push('The last mainnet price read failed, so the cached prices are used.');
        const m = ref && ref.match;
        const caveat = 'z.ink items are valued at Solana mainnet Galactic Marketplace prices for the same-named item (they cannot be sold there); C4 resources mostly have no mainnet market'
            + (m && m.hulls && m.cargo ? ` (matched this pass: ${m.hulls.matched} of ${m.hulls.total} hull configs, ${m.cargo.matched} of ${m.cargo.total} cargo names).` : '.');
        return { atlas: h.atlas != null ? h.atlas : null, fleets: h.fleets || 0, ships: h.ships || 0, hulls, cargo, range, stale, notes, caveat, top: (rv && rv.top) || [] };
    }
    function rangeText(r) { return r ? `${fmt(r.lo, 0)} - ${fmt(r.hi, 0)} ATLAS` : '-'; }
    // v7: a hull config name -> {base, variant}. "X Default Config" -> X; "X <variant words> Min Config" -> X + the variant
    // ("Busan Pulse Mining Min Config" -> "Busan Pulse" + "Mining Min"); only known variant words are peeled off the end,
    // so a ship whose own name ends in such a word is never cut short by guesswork. Anything else: " Config" dropped.
    const HULL_VARIANT_WORDS = new Set(['Mining', 'Superchill', 'Damage', 'Cargo', 'Boost', 'Rescue', 'Repair', 'Fuel', 'Ammo', 'Speed', 'Scan', 'Combat', 'Shield', 'Hull', 'Max']);
    function hullLabel(c) {
        const s = String(c == null ? '' : c).trim();
        let m = s.match(/^(.*\S) Default Config$/);
        if (m) return { base: m[1], variant: '' };
        m = s.match(/^(.*\S) Min Config$/);
        if (m) {
            const w = m[1].split(/\s+/);
            let i = w.length;
            while (i > 1 && HULL_VARIANT_WORDS.has(w[i - 1])) i--;
            if (i < w.length) return { base: w.slice(0, i).join(' '), variant: w.slice(i).join(' ') + ' Min' };
            return { base: m[1], variant: 'Min' };
        }
        return { base: s.replace(/ Config$/, ''), variant: '' };
    }

    // owners.json series for one profile: [[t, fleets, mining, ups, atlas, rank], ...]
    function ownerSeries(ownersSeries, p) {
        const rows = (ownersSeries && ownersSeries[p]) || [];
        return { n: rows.length, t: rows.map(r => r[0]), fleets: rows.map(r => r[1]), mining: rows.map(r => r[2]), atlas: rows.map(r => r[4]), rank: rows.map(r => r[5]) };
    }

    // map area covered by the HTML overlays, for scene.setInsets (v2 full-screen layout, 2026-11-07). All rects are
    // page px {left, top, right, bottom}; map = the map element's rect (the viewport). dock / drawer / kpi may be null
    // (hidden). Desktop: the dock and an open drawer cover the right edge, the KPI bar the top. Mobile (sheet=true): the
    // dock is a bottom sheet and covers the bottom. Insets are clamped to [0, map size] and rounded to whole px.
    function coverInsets(map, o) {
        o = o || {};
        const W = Math.max(0, map.right - map.left), H = Math.max(0, map.bottom - map.top);
        const cl = (v, max) => Math.round(Math.max(0, Math.min(max, v || 0)));
        const ins = { left: 0, right: 0, top: 0, bottom: 0 };
        const covers = [o.dock, o.drawer].filter(r => r && r.right > r.left && r.bottom > r.top);
        for (const r of covers) {
            if (o.sheet) ins.bottom = Math.max(ins.bottom, map.bottom - r.top);
            else ins.right = Math.max(ins.right, map.right - r.left);
        }
        if (o.kpi && o.kpi.bottom > o.kpi.top) ins.top = Math.max(ins.top, o.kpi.bottom - map.top);
        // v3 (2026-11-07): `avoid` = the floating HUD boxes the map shows through (map controls, brand, age banner, ship
        // hint). They do not change the framing; the scene keeps its callouts out of them. Canvas-relative CSS px, clipped
        // to the map, whole px (outward), empty boxes dropped.
        const avoid = [];
        for (const r of o.avoid || []) {
            if (!r || !(r.right > r.left) || !(r.bottom > r.top)) continue;
            const a = { left: Math.max(0, Math.floor(r.left - map.left)), top: Math.max(0, Math.floor(r.top - map.top)), right: Math.min(W, Math.ceil(r.right - map.left)), bottom: Math.min(H, Math.ceil(r.bottom - map.top)) };
            if (a.right > a.left && a.bottom > a.top) avoid.push(a);
        }
        return { left: cl(ins.left, W), right: cl(ins.right, W), top: cl(ins.top, H), bottom: cl(ins.bottom, H), avoid };
    }
    const sameRects = (a, b) => (a || []).length === (b || []).length && (a || []).every((r, i) => ['left', 'right', 'top', 'bottom'].every(k => r[k] === b[i][k]));
    const sameInsets = (a, b) => !!a && !!b && ['left', 'right', 'top', 'bottom'].every(k => a[k] === b[k]) && sameRects(a.avoid, b.avoid);
    const STAT_TABS = ['mining', 'combat', 'fleets', 'owners'];

    // ------------------------------------------------------------------ DACs (2026-11-07): a HAND-KEPT list
    // DACs (guilds) exist only on Solana mainnet today (player-profile Role / ProfileRoleMembership), with no DAC names on
    // chain and no link from a mainnet member to a z.ink C4 player, so membership cannot be read from z.ink. Until it can,
    // C4Live/dacs.json lists them by hand: {version: 1, note, dacs: [{tag, name, faction: mud|oni|ustur|all, color: #rrggbb,
    // source, members: [z.ink profile address or auth wallet]}]}. Every string in the file is untrusted text (render it
    // escaped); a colour is used only when it is a plain #rrggbb, so it can never carry CSS.
    const DAC_FACTIONS = ['mud', 'oni', 'ustur', 'all'];
    const DAC_TAG = /^[A-Z0-9]{2,6}$/;
    const DAC_COLOR = /^#[0-9a-fA-F]{6}$/;
    const DAC_KEY = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;      // a base58 address
    const DAC_GREY = '#9aa3b5';
    // -> {ok, dacs, errors, note}. ok=false only when the file as a whole is unusable (the page then hides DACs); a bad
    // entry is dropped (or a bad colour / member skipped) with a line in errors, never a throw
    function parseDacs(j) {
        if (!j || typeof j !== 'object' || j.version !== 1 || !Array.isArray(j.dacs)) return { ok: false, dacs: [], errors: ['dacs.json needs {"version": 1, "dacs": [...]}'], note: '' };
        const errors = [], seen = new Set(), dacs = [];
        j.dacs.forEach((d, i) => {
            if (!d || typeof d !== 'object') { errors.push(`dacs[${i}] is not an object`); return; }
            const tag = typeof d.tag === 'string' ? d.tag.trim().toUpperCase() : '';
            if (!DAC_TAG.test(tag)) { errors.push(`dacs[${i}]: the tag must be 2-6 letters or digits`); return; }
            if (seen.has(tag)) { errors.push(`dacs[${i}]: duplicate tag ${tag}`); return; }
            const name = cleanName(d.name).slice(0, 48);
            if (!name) { errors.push(`${tag}: no name`); return; }
            if (!DAC_FACTIONS.includes(d.faction)) { errors.push(`${tag}: faction must be one of ${DAC_FACTIONS.join(', ')}`); return; }
            const color = typeof d.color === 'string' && DAC_COLOR.test(d.color) ? d.color.toLowerCase() : null;
            if (!color) errors.push(`${tag}: color must be #rrggbb, grey used instead`);
            if (d.members != null && !Array.isArray(d.members)) errors.push(`${tag}: members must be a list`);
            const members = [];
            for (const m of Array.isArray(d.members) ? d.members : []) {
                const k = typeof m === 'string' ? m.trim() : '';
                if (!DAC_KEY.test(k)) { errors.push(`${tag}: a member is not a base58 address`); continue; }
                if (!members.includes(k)) members.push(k);
            }
            seen.add(tag);
            dacs.push({ tag, name, faction: d.faction, color: color || DAC_GREY, source: cleanName(d.source).slice(0, 200), members });
        });
        return { ok: true, dacs, errors, note: cleanName(j.note).slice(0, 600) };
    }
    // members -> owner profiles. A member matches EXACTLY an owner's profile address or its auth wallet (one wallet can hold
    // several profiles: all of them match). A member no owner in the snapshot has is kept in `unmatched`.
    // -> {dacs: [{...dac, profiles, unmatched}], tagsOf: Map profile -> [tags]}
    function resolveDacs(latest, dacs) {
        const profiles = new Set(), byWallet = new Map();
        for (const o of (latest && latest.owners) || []) {
            if (!o || !o.p) continue;
            profiles.add(o.p);
            if (o.wallet) { if (!byWallet.has(o.wallet)) byWallet.set(o.wallet, []); byWallet.get(o.wallet).push(o.p); }
        }
        for (const f of (latest && latest.fleets) || []) if (f && f.o && !f.npc) profiles.add(f.o);
        const tagsOf = new Map();
        const list = (dacs || []).map(d => {
            const got = [], unmatched = [];
            for (const m of d.members || []) {
                const ps = profiles.has(m) ? [m] : (byWallet.get(m) || []);
                if (!ps.length) { unmatched.push(m); continue; }
                for (const p of ps) if (!got.includes(p)) got.push(p);
            }
            for (const p of got) { const t = tagsOf.get(p) || []; if (!t.includes(d.tag)) t.push(d.tag); tagsOf.set(p, t); }
            return { ...d, members: (d.members || []).slice(), profiles: got, unmatched };
        });
        return { dacs: list, tagsOf };
    }
    // per-system DAC presence, the rule the scene's DAC layer imports too. dacs = [{tag, members: [profile address]}].
    // A member fleet counts at the system it belongs to by the shared membership rule (docked -> its starbase, mining ->
    // its asteroid's system, else resting within 0.6 of a system; in flight -> nowhere); stakes count at their system.
    // -> {systems: [{a, n, x, y, byDac: {TAG: {fleets, ships, stakes, ups}}}], byDac: {TAG: [{a, n, x, y, fleets, ships, stakes, ups}]}}
    // both sorted by fleets, then stakes, then u/s, then address (stable)
    function dacInfluence(latest, dacs) {
        latest = latest || {};
        const systems = (latest.systems || []).filter(s => s && isNum(s.x) && isNum(s.y));
        const sysBy = new Map((latest.systems || []).filter(s => s && s.a).map(s => [s.a, s]));
        const astSys = new Map(); for (const a of latest.asteroids || []) if (a && a.a && a.sys) astSys.set(a.a, a.sys);
        const settledBy = (isNum(latest.generatedAt) ? latest.generatedAt : 0) - SETTLE_S;
        const tagsOf = new Map();
        for (const d of dacs || []) for (const p of (d && d.members) || []) { const t = tagsOf.get(p) || []; if (!t.includes(d.tag)) t.push(d.tag); tagsOf.set(p, t); }
        const bySys = new Map();
        const cell = (sys, tag) => { let s = bySys.get(sys); if (!s) bySys.set(sys, s = {}); return s[tag] || (s[tag] = { fleets: 0, ships: 0, stakes: 0, ups: 0 }); };
        for (const f of latest.fleets || []) {
            if (!f || f.npc || !f.s || !isNum(f.x) || !isNum(f.y)) continue;
            const tags = tagsOf.get(f.o); if (!tags) continue;
            const sy = memberSystem(f, systems, astSys, settledBy); if (!sy) continue;
            const u = fleetUps(f);
            for (const t of tags) { const c = cell(sy, t); c.fleets++; c.ships += f.ships || 0; c.ups += u; }
        }
        for (const k of latest.stakes || []) {
            const tags = k && k.sys ? tagsOf.get(k.o) : null; if (!tags) continue;
            for (const t of tags) cell(k.sys, t).stakes++;
        }
        const ord = (a, b) => b.fleets - a.fleets || b.stakes - a.stakes || b.ups - a.ups || (a.a < b.a ? -1 : a.a > b.a ? 1 : 0);
        const tot = byDac => Object.values(byDac).reduce((s, c) => ({ fleets: s.fleets + c.fleets, stakes: s.stakes + c.stakes, ups: s.ups + c.ups }), { fleets: 0, stakes: 0, ups: 0 });
        const out = [...bySys].map(([a, byDac]) => { const s = sysBy.get(a) || {}; return { a, n: s.n || null, x: s.x, y: s.y, byDac }; })
            .sort((p, q) => ord({ a: p.a, ...tot(p.byDac) }, { a: q.a, ...tot(q.byDac) }));
        const byDac = {};
        for (const d of dacs || []) byDac[d.tag] = out.filter(s => s.byDac[d.tag]).map(s => ({ a: s.a, n: s.n, x: s.x, y: s.y, ...s.byDac[d.tag] })).sort(ord);
        return { systems: out, byDac };
    }
    // per DAC: members' totals over ALL fleets (owners = M.build(...,'all').owners) and the systems they are in
    function dacSummary(latest, resolved, owners) {
        const ownBy = new Map((owners || []).map(o => [o.p, o]));
        const rec = ownerIndex(latest);
        const inf = dacInfluence(latest, resolved.map(d => ({ tag: d.tag, members: d.profiles })));
        return resolved.map(d => {
            const t = { members: d.profiles.length, fleets: 0, ships: 0, ups: 0, stakes: 0, lo: 0, hi: 0, priced: 0 };
            for (const p of d.profiles) {
                const o = ownBy.get(p); if (o) { t.fleets += o.fleets; t.ships += o.ships; t.ups += o.ups; }
                const r = refRange(rec.get(p)); if (r.lo != null) { t.lo += r.lo; t.hi += r.hi; t.priced++; }
            }
            t.stakes = ((latest && latest.stakes) || []).filter(k => k && d.profiles.includes(k.o)).length;
            return { ...d, totals: t, systems: inf.byDac[d.tag] || [] };
        });
    }
    // DAC CONQUEST lens (v7, lead-pinned rule, 2026-11-07; the scene's model.js implements the identical rule).
    // dacs = [{tag, members: [profile address]}] (resolved profiles, as dacInfluence); metrics = subset of CONQUEST_METRICS;
    // scope = a tag (only that DAC competes) or null (all DACs). Per system s and DAC d: v = mining (sum of member fleets'
    // ups), stakes (member stakes), fleets (member ships at rest), combat (member hot-combat events in the 24 h window by
    // the combatHotSpots rule, assigned to the nearest system within 1.2; events with no system that close are ignored).
    // T = the same metric over EVERY fleet / player in s (non-DAC and NPC included). share = v / T (0 when T = 0).
    // score = sum of shares over the selected metrics; winner = max score > 0; a tie within 1e-9 = contested (no winner).
    // strength = winner score / number of selected metrics with T > 0 (0..1). Systems listed = any selected T > 0, by address.
    // -> {systems: [{a, n, x, y, winner, contested, strength, scores: {TAG: score}}], byDac: {TAG: count}, contested}
    const CONQUEST_METRICS = ['mining', 'stakes', 'combat', 'fleets'];
    const CONQUEST_LABEL = { mining: 'Mining', stakes: 'Claim stakes', combat: 'Combat', fleets: 'Fleets' };
    function dacConquest(latest, events, dacs, metrics, scope) {
        latest = latest || {};
        const ms = CONQUEST_METRICS.filter(m => (metrics || []).includes(m));
        const comp = (dacs || []).filter(d => d && d.tag && (!scope || d.tag === scope));
        const tagsOf = new Map();
        for (const d of comp) for (const p of d.members || []) { const t = tagsOf.get(p) || []; if (!t.includes(d.tag)) t.push(d.tag); tagsOf.set(p, t); }
        const systems = (latest.systems || []).filter(s => s && isNum(s.x) && isNum(s.y));
        const sysBy = new Map((latest.systems || []).filter(s => s && s.a).map(s => [s.a, s]));
        const astSys = new Map(); for (const a of latest.asteroids || []) if (a && a.a && a.sys) astSys.set(a.a, a.sys);
        const settledBy = (isNum(latest.generatedAt) ? latest.generatedAt : 0) - SETTLE_S;
        const T = new Map(), V = new Map();      // sys -> {metric: total}; sys -> {tag: {metric: v}}
        const addT = (sys, m, v) => { let o = T.get(sys); if (!o) T.set(sys, o = { mining: 0, stakes: 0, combat: 0, fleets: 0 }); o[m] += v; };
        const addV = (sys, tags, m, v) => {
            if (!tags) return;
            let o = V.get(sys); if (!o) V.set(sys, o = {});
            for (const t of tags) { const c = o[t] || (o[t] = { mining: 0, stakes: 0, combat: 0, fleets: 0 }); c[m] += v; }
        };
        const want = m => ms.includes(m);
        if (want('mining') || want('fleets')) {
            for (const f of latest.fleets || []) {
                if (!f || !f.s || !isNum(f.x) || !isNum(f.y)) continue;
                const sy = memberSystem(f, systems, astSys, settledBy); if (!sy) continue;
                const tags = f.npc ? null : tagsOf.get(f.o);
                const u = fleetUps(f), sh = f.ships || 0;
                addT(sy, 'mining', u); addT(sy, 'fleets', sh);
                addV(sy, tags, 'mining', u); addV(sy, tags, 'fleets', sh);
            }
        }
        if (want('stakes')) {
            for (const k of latest.stakes || []) { if (!k || !k.sys) continue; addT(k.sys, 'stakes', 1); addV(k.sys, tagsOf.get(k.o), 'stakes', 1); }
        }
        if (want('combat')) {
            const ref = latest.generatedAt, fin = v => typeof v === 'number' && isFinite(v);
            const fleetOwner = new Map(); for (const f of latest.fleets || []) if (f && f.a) fleetOwner.set(f.a, f.o);
            const killed = new Set();
            for (const e of events || []) {
                if (!isHotKind(e) || !fin(e.t) || !fin(e.x) || !fin(e.y) || e.t > ref || e.t <= ref - DAY) continue;
                if ((e.k === 'destroyed' || e.dead === true) && e.f) { if (killed.has(e.f)) continue; killed.add(e.f); }
                let best = null, bd = HOT_R2;
                for (const s of systems) { const d = (s.x - e.x) ** 2 + (s.y - e.y) ** 2; if (d < bd || (d === bd && best && s.a < best.a)) { bd = d; best = s; } }
                if (!best) continue;
                addT(best.a, 'combat', 1);
                const o = typeof e.o === 'string' ? e.o : fleetOwner.get(e.f);
                if (e.npc !== true && o) addV(best.a, tagsOf.get(o), 'combat', 1);
            }
        }
        const out = [], byDac = {};
        let contested = 0;
        for (const d of comp) byDac[d.tag] = 0;
        for (const [a, tot] of T) {
            const live = ms.filter(m => tot[m] > 0);
            if (!live.length) continue;
            const scores = {};
            const vs = V.get(a) || {};
            for (const tag of Object.keys(vs)) { let sc = 0; for (const m of live) sc += vs[tag][m] / tot[m]; if (sc > 0) scores[tag] = sc; }
            let top = 0; for (const t in scores) top = Math.max(top, scores[t]);
            const lead = Object.keys(scores).filter(t => top - scores[t] <= 1e-9);
            const isC = top > 0 && lead.length > 1;
            const winner = top > 0 && lead.length === 1 ? lead[0] : null;
            if (winner) byDac[winner]++;
            if (isC) contested++;
            const s = sysBy.get(a) || {};
            out.push({ a, n: s.n || null, x: s.x, y: s.y, winner, contested: isC, strength: winner ? Math.min(1, top / live.length) : 0, scores });
        }
        out.sort((p, q) => (p.a < q.a ? -1 : p.a > q.a ? 1 : 0));
        return { systems: out, byDac, contested };
    }
    // EXAMPLE membership, for the "Show example" preview only: real C4 players placed in the listed DACs by a seeded hash
    // of their profile address (stable across reloads), about EXAMPLE_SHARE of them, faction DACs drawing only from that
    // faction. Returns NEW objects marked example:true; the input list is never touched.
    // Owner 2026-11-07 23:40 EST: "show DAC within one faction for now" - an all-faction DAC is previewed inside ONE faction:
    // in list order, each gets the faction holding the fewest example DACs so far (ties mud, oni, ustur), shown as its
    // faction (allFaction: true keeps what the hand-kept file says). Every example DAC's members share one faction.
    const EXAMPLE_SEED = 'c4-dac-example-v1', EXAMPLE_SHARE = 0.2, EXAMPLE_FACTIONS = ['mud', 'oni', 'ustur'];
    function hash32(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; }
    function exampleDacs(latest, dacs, seed) {
        seed = seed || EXAMPLE_SEED;
        const load = { mud: 0, oni: 0, ustur: 0 };
        for (const d of dacs || []) if (load[d.faction] !== undefined) load[d.faction]++;
        const out = (dacs || []).map(d => {
            if (load[d.faction] !== undefined) return { ...d, members: [], example: true };
            const f = EXAMPLE_FACTIONS.reduce((b, x) => (load[x] < load[b] ? x : b), EXAMPLE_FACTIONS[0]);
            load[f]++;
            return { ...d, faction: f, allFaction: true, members: [], example: true };
        });
        const players = ((latest && latest.owners) || []).filter(o => o && o.p && !o.npc).slice().sort((a, b) => (a.p < b.p ? -1 : a.p > b.p ? 1 : 0));
        for (const o of players) {
            if (hash32(seed + ':in:' + o.p) % 10000 >= EXAMPLE_SHARE * 10000) continue;
            const cand = out.filter(d => d.faction === o.fa);
            if (cand.length) cand[hash32(seed + ':dac:' + o.p) % cand.length].members.push(o.p);
        }
        return out;
    }

    const api = {
        DAC_FACTIONS, parseDacs, resolveDacs, dacInfluence, dacSummary, exampleDacs, EXAMPLE_SHARE, dacConquest, CONQUEST_METRICS, CONQUEST_LABEL, deepSpaceName,
        coverInsets, sameInsets, STAT_TABS, combatHotSpots, hotOrder, isHotKind,
        GROUPS, GROUP_LABEL, STATES, STATE_LABEL, SIZES, CAREERS, CAREER_LABEL,
        esc, shortAddr, fmt, pct, ago, groupOf, eventGroup, fleetUps, dataAge, projectMined, liveMined, qualityNotes, concentration, concLabel,
        aggregateOwners, careerMax, nearestSystem, destroyedFleets, probableKills, engagements, vsPairs, sideLabel, buildCombat, buildMining, minedSeries, buildFleets,
        miningVerdict, combatVerdict, fleetsVerdict, ownersVerdict, ownerVerdict, asteroidVerdict, build, ownerSeries,
        cleanName, ownerIndex, displayName, ownerText, walletShort, findOwners, refRange, wealthView, rangeText, hullLabel, STALE_PRICES_S,
        SHIP_HINT_PX_PER_UNIT, SHIP_HULL_LEN, pxPerUnitFromHull, shipHintVisible, bodyTip, stakeLabel, AT_SYSTEM, restPoint, systemMembership, indexBodies, bodyImage, bodyKind, fleetsInSystem, outByRes, buildBody, buildSystem, systemVerdict, bodyVerdict
    };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.C4Model = api;
})(typeof window !== 'undefined' ? window : globalThis);
