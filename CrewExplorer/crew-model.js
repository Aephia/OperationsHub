// crew-model.js - Crew Explorer pure computations (2026-11-10). No DOM, no network. Loaded by CrewExplorer/index.html
// (window.CrewModel) and by Test/crew-explorer-check.js (require). Every number the page shows is computed here from
// the cards the feed returned - no typed constants.
//
// A "card" here is the normalised form made by normalize(): the feed's text is kept as text and is escaped by the
// page at render time; the portrait address is rebuilt from the card number and never taken from the feed.
(function (root) {
    'use strict';

    const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Anomaly'];
    const FACTIONS = ['MUD', 'ONI', 'Ustur', 'Unaligned'];
    const APTITUDES = ['Command', 'Flight', 'Engineering', 'Medical', 'Science', 'Operator', 'Hospitality', 'Fitness'];
    // XP gain per rate, from the official "Crew Aptitude Perks" sheet: minor +25 %, major +50 %, anomaly +100 %.
    const GAINS = ['minor', 'major', 'anomalous'];
    const GAIN_XP = { minor: 0.25, major: 0.5, anomalous: 1 };
    const GAIN_LABEL = { minor: 'Minor', major: 'Major', anomalous: 'Anomaly' };
    // Perk unlocked at aptitude level 1 / 5 / 10 / 15 (same sheet; it calls itself development scope).
    const PERK_LEVELS = [1, 5, 10, 15];
    const PERKS = {
        Command: ['Social Cohesion', 'Resource Management', 'Leadership', 'Luck'],
        Flight: ['Navigation', 'Dexterity', 'Evasion', 'Stealth'],
        Engineering: ['Repair', 'Structural Integrity', 'Construction', 'Resource Efficiency'],
        Medical: ['Rest', 'Healing', 'Vitality', 'Pharmacology'],
        Science: ['Intelligence', 'Discovery', 'Data Analysis', 'Experimentation'],
        Operator: ['Proficiency', 'Precision', 'Reflex', 'Performance Tuning'],
        Hospitality: ['Charisma', 'Provisioning', 'Entertainment', 'Artisan'],
        Fitness: ['Agility', 'Recovery', 'Endurance', 'Strength']
    };
    const TRAITS = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    const TRAIT_LABEL = { openness: 'Openness', conscientiousness: 'Conscientiousness', extraversion: 'Extraversion', agreeableness: 'Agreeableness', neuroticism: 'Neuroticism' };
    // Dimensions a card can be grouped by. 'aptitude' is multi-valued: a card counts once under each aptitude it has.
    const DIMS = ['rarity', 'faction', 'species', 'university', 'sex', 'aptitude', 'aptCount'];
    const DIM_LABEL = { rarity: 'Rarity', faction: 'Faction', species: 'Species', university: 'University', sex: 'Body', aptitude: 'Aptitude', aptCount: 'Aptitudes per card' };

    const SAGE_PROGRAM = 'SAGE2HAwep459SNq61LHvjxPk4pLPEJLoMETef7f7EE';
    const SAGE_GAME = 'GAMEzqJehF8yAnKiTARUuhZMvLvkZVAsCVri5vSfemLr';
    const PORTRAIT_BASE = 'https://cdn.staratlas.com/crew/v1/';

    // ------------------------------------------------------------------ formatting
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    function shortAddr(p) { return p && p.length > 12 ? p.slice(0, 4) + '…' + p.slice(-4) : (p || ''); }
    function fmt(n, d) {
        if (n == null || !isFinite(n)) return '-';
        return n.toLocaleString('en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
    }
    function pct(x, d) { if (x == null || !isFinite(x)) return '-'; const v = x * 100; return v.toFixed(d != null ? d : (v > 0 && v < 10 ? 1 : 0)) + '%'; }
    function clock(ms) { const s = Math.max(0, Math.floor(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
    function portraitUrl(id) { return PORTRAIT_BASE + id + '_full.jpeg'; }

    // ------------------------------------------------------------------ addresses (base58, ed25519 curve test, PDA)
    const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const B58_MAP = (() => { const m = {}; for (let i = 0; i < B58.length; i++) m[B58[i]] = i; return m; })();
    function b58decode(s) {
        if (typeof s !== 'string' || !s.length || s.length > 64) return null;
        let n = 0n;
        for (const ch of s) { const v = B58_MAP[ch]; if (v === undefined) return null; n = n * 58n + BigInt(v); }
        const bytes = [];
        while (n > 0n) { bytes.push(Number(n & 255n)); n >>= 8n; }
        for (let i = 0; i < s.length && s[i] === '1'; i++) bytes.push(0);
        return Uint8Array.from(bytes.reverse());
    }
    function b58encode(bytes) {
        let n = 0n;
        for (const b of bytes) n = (n << 8n) | BigInt(b);
        let out = '';
        while (n > 0n) { out = B58[Number(n % 58n)] + out; n /= 58n; }
        for (let i = 0; i < bytes.length && bytes[i] === 0; i++) out = '1' + out;
        return out;
    }
    // a Solana address: base58 text that decodes to exactly 32 bytes
    function isAddress(s) { const b = b58decode(typeof s === 'string' ? s.trim() : s); return !!b && b.length === 32; }

    const P = (1n << 255n) - 19n;
    function modpow(b, e, m) { let r = 1n; b %= m; while (e > 0n) { if (e & 1n) r = r * b % m; b = b * b % m; e >>= 1n; } return r; }
    const ED_D = (P - 121665n * modpow(121666n, P - 2n, P) % P) % P;
    // true when 32 bytes are a point on the ed25519 curve (then they cannot be a program-derived address)
    function isOnCurve(bytes) {
        let y = 0n;
        for (let i = 31; i >= 0; i--) y = (y << 8n) | BigInt(bytes[i]);
        y &= (1n << 255n) - 1n;
        if (y >= P) return false;
        const y2 = y * y % P;
        const u = (y2 - 1n + P) % P, v = (ED_D * y2 + 1n) % P;
        const x2 = u * modpow(v, P - 2n, P) % P;
        if (x2 === 0n) return true;
        return modpow(x2, (P - 1n) / 2n, P) === 1n;
    }
    const enc = s => new TextEncoder().encode(s);
    function concat(parts) { const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0)); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; } return out; }
    async function sha256(bytes) { return new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', bytes)); }
    // Solana findProgramAddress: the first bump from 255 down whose hash is NOT on the curve
    async function findProgramAddress(seeds, programId) {
        const prog = b58decode(programId);
        if (!prog || prog.length !== 32) throw new Error('bad program id');
        for (let bump = 255; bump >= 0; bump--) {
            const h = await sha256(concat([...seeds, Uint8Array.of(bump), prog, enc('ProgramDerivedAddress')]));
            if (!isOnCurve(h)) return { address: b58encode(h), bump };
        }
        throw new Error('no address found');
    }
    // The mainnet SAGE account that holds a player profile's deposited crew (seeds checked against a real account
    // on 2026-11-10: "sage_player_profile" + profile + game).
    async function sagePlayerProfileAddress(profile) {
        const p = b58decode(String(profile).trim());
        if (!p || p.length !== 32) throw new Error('not a valid address');
        return (await findProgramAddress([enc('sage_player_profile'), p, b58decode(SAGE_GAME)], SAGE_PROGRAM)).address;
    }

    // ------------------------------------------------------------------ cards
    const num = v => (typeof v === 'number' && isFinite(v) ? v : null);
    const txt = (v, d) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, 120) : d);
    // only text is a rate: String() on an object from the feed can throw, and would turn ["major"] into a rate
    function normGain(g) { if (typeof g !== 'string') return ''; const s = g.toLowerCase(); return s === 'anomaly' ? 'anomalous' : s; }
    // a card number: a whole number in a sane range (the one rule, used by the feed walk too)
    function validId(id) { return typeof id === 'number' && Number.isInteger(id) && id >= 0 && id <= 1e9; }
    // Names from outside are looked up with these, never with OBJECT[name]: a plain-object lookup also answers
    // "constructor" and "__proto__", which the feed is free to send.
    const isGain = g => GAINS.includes(g);
    function perksOf(aptitude) { return APTITUDES.includes(aptitude) ? PERKS[aptitude] : []; }
    // feed row -> card, or null when the row has no usable card number
    function normalize(raw) {
        if (!raw || typeof raw !== 'object') return null;
        const id = raw.mintOffset;
        if (!validId(id)) return null;
        const apts = [];
        const a = raw.aptitudes && typeof raw.aptitudes === 'object' ? raw.aptitudes : {};
        for (const k of Object.keys(a)) {
            const g = normGain(a[k]);
            if (!isGain(g)) continue;
            apts.push({ k: txt(k, '?'), g });
        }
        apts.sort((x, y) => aptRank(x.k) - aptRank(y.k) || (x.k < y.k ? -1 : x.k > y.k ? 1 : 0));
        return {
            id,
            name: txt(raw.name, 'Crew #' + id),
            rarity: txt(raw.rarity, 'Unknown'),
            faction: txt(raw.faction, 'Unknown'),
            species: txt(raw.species, 'Unknown'),
            sex: txt(raw.sex, 'Unknown'),
            university: txt(raw.university, 'Unknown'),
            age: num(raw.age),
            openness: num(raw.openness), conscientiousness: num(raw.conscientiousness), extraversion: num(raw.extraversion),
            agreeableness: num(raw.agreeableness), neuroticism: num(raw.neuroticism),
            apts,
            das: isAddress(raw.dasID) ? raw.dasID : ''
        };
    }
    // A roster read back from the device is checked like outside data (any script on this site can write that store):
    // a card that is not exactly the shape normalize() makes is dropped, and so is anything else unexpected.
    function cleanCard(c) {
        if (!c || typeof c !== 'object' || !validId(c.id) || !Array.isArray(c.apts)) return null;
        const apts = [];
        for (const a of c.apts) if (a && typeof a.k === 'string' && a.k && isGain(a.g)) apts.push({ k: a.k.slice(0, 120), g: a.g });
        const out = { id: c.id, apts, das: isAddress(c.das) ? c.das : '' };
        for (const f of ['name', 'rarity', 'faction', 'species', 'sex', 'university']) out[f] = txt(c[f], f === 'name' ? 'Crew #' + c.id : 'Unknown');
        for (const f of ['age'].concat(TRAITS)) out[f] = num(c[f]);
        return out;
    }
    const SOURCE_REASONS = ['', 'time', 'cap', 'stopped', 'repeat', 'error'];
    // saved record -> the same record with only known, well-typed fields, or null when it holds no usable card
    function cleanRecord(r) {
        if (!r || typeof r !== 'object' || r.v !== 1 || !Array.isArray(r.cards)) return null;
        const cards = mergeCards([r.cards.map(cleanCard).filter(Boolean)]);
        if (!cards.length) return null;
        const str = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');
        const inputs = r.inputs && typeof r.inputs === 'object' ? r.inputs : {};
        const sources = (Array.isArray(r.sources) ? r.sources : []).slice(0, 8).filter(s => s && typeof s === 'object' && isAddress(s.key)).map(s => ({
            kind: s.kind === 'profile' ? 'profile' : 'wallet', key: s.key, owner: isAddress(s.owner) ? s.owner : '',
            count: validId(s.count) ? s.count : 0, pages: validId(s.pages) ? s.pages : 0, complete: s.complete === true,
            reason: SOURCE_REASONS.includes(s.reason) ? s.reason : 'error', error: str(s.error, 200)
        }));
        return {
            v: 1, savedAt: typeof r.savedAt === 'number' && isFinite(r.savedAt) ? r.savedAt : 0,
            inputs: { wallet: isAddress(inputs.wallet) ? inputs.wallet.trim() : '', profile: isAddress(inputs.profile) ? inputs.profile.trim() : '' },
            sources, notes: (Array.isArray(r.notes) ? r.notes : []).slice(0, 8).map(n => str(n, 300)).filter(Boolean), partial: r.partial === true || sources.some(s => !s.complete), cards
        };
    }
    // Keep the saved roster when the new one is only part of a load and the saved one is whole: a reload that fails
    // or is stopped half-way must not replace a complete roster with a fragment.
    function shouldSave(fresh, saved) { return !fresh.partial || !saved || saved.partial === true; }
    function aptRank(k) { const i = APTITUDES.indexOf(k); return i < 0 ? APTITUDES.length : i; }
    function rarityRank(r) { const i = RARITIES.indexOf(r); return i < 0 ? -1 : i; }
    // several lists of cards -> one, each card number once (the first list that has it wins)
    function mergeCards(lists) {
        const seen = new Map();
        for (const list of lists) for (const c of list) if (c && !seen.has(c.id)) seen.set(c.id, c);
        return [...seen.values()];
    }

    // ------------------------------------------------------------------ grouping
    function dimValues(card, dim) {
        if (dim === 'aptitude') return card.apts.map(a => a.k);
        if (dim === 'aptCount') return [String(card.apts.length)];
        return [card[dim]];
    }
    function dimOrder(dim) {
        if (dim === 'rarity') return RARITIES;
        if (dim === 'faction') return FACTIONS;
        if (dim === 'aptitude') return APTITUDES;
        return null;
    }
    // known values in their fixed order first, the rest by count (largest first), then by name
    function orderKeys(dim, counts) {
        const fixed = dimOrder(dim);
        const keys = [...counts.keys()];
        if (dim === 'aptCount') return keys.sort((a, b) => Number(a) - Number(b));
        return keys.sort((a, b) => {
            if (fixed) { const ia = fixed.indexOf(a), ib = fixed.indexOf(b); if (ia >= 0 || ib >= 0) return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); }
            return counts.get(b) - counts.get(a) || (a < b ? -1 : a > b ? 1 : 0);
        });
    }
    function countBy(cards, dim) {
        const m = new Map();
        for (const c of cards) for (const v of dimValues(c, dim)) m.set(v, (m.get(v) || 0) + 1);
        return orderKeys(dim, m).map(k => ({ key: k, n: m.get(k) }));
    }
    function crosstab(cards, rowDim, colDim) {
        const rc = new Map(), cc = new Map(), cell = new Map();
        for (const c of cards) {
            const rs = dimValues(c, rowDim), cs = dimValues(c, colDim);
            for (const r of rs) rc.set(r, (rc.get(r) || 0) + 1);
            for (const k of cs) cc.set(k, (cc.get(k) || 0) + 1);
            for (const r of rs) for (const k of cs) { const key = r + '\u0000' + k; cell.set(key, (cell.get(key) || 0) + 1); }
        }
        const rows = orderKeys(rowDim, rc), cols = orderKeys(colDim, cc);
        let max = 0;
        const cells = rows.map(r => cols.map(k => { const n = cell.get(r + '\u0000' + k) || 0; if (n > max) max = n; return n; }));
        return { rowDim, colDim, rows, cols, cells, rowTot: rows.map(r => rc.get(r)), colTot: cols.map(k => cc.get(k)), max, cards: cards.length };
    }
    // per aptitude: cards at each gain rate, cards with it at all, and the summed XP gain (0.25 / 0.5 / 1 a card)
    function aptitudeMatrix(cards) {
        const rows = APTITUDES.map(k => ({ key: k, minor: 0, major: 0, anomalous: 0, any: 0, xp: 0 }));
        const by = new Map(rows.map(r => [r.key, r]));
        for (const c of cards) for (const a of c.apts) {
            let r = by.get(a.k);
            if (!r) { r = { key: a.k, minor: 0, major: 0, anomalous: 0, any: 0, xp: 0 }; by.set(a.k, r); rows.push(r); }
            r[a.g]++; r.any++; r.xp += GAIN_XP[a.g];
        }
        return rows;
    }
    function median(sorted) { const n = sorted.length; return n ? (n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2) : null; }
    // distribution of one numeric field over [lo, hi] in `bins` equal bins (the top edge belongs to the last bin)
    function distribution(cards, field, lo, hi, bins) {
        const vals = [];
        for (const c of cards) { const v = c[field]; if (v != null) vals.push(v); }
        vals.sort((a, b) => a - b);
        const counts = new Array(bins).fill(0);
        let sum = 0;
        for (const v of vals) { sum += v; const i = Math.min(bins - 1, Math.max(0, Math.floor((v - lo) / (hi - lo) * bins))); counts[i]++; }
        return { field, n: vals.length, mean: vals.length ? sum / vals.length : null, median: median(vals), min: vals.length ? vals[0] : null, max: vals.length ? vals[vals.length - 1] : null, lo, hi, counts, peak: Math.max(0, ...counts) };
    }
    function traitStats(cards) { return TRAITS.map(t => distribution(cards, t, 0, 1, 10)); }
    // ages run 18 to 115 in real rosters but sit mostly under 60: bins of 10 years from 10, the last one open
    function ageStats(cards) { const d = distribution(cards, 'age', 10, 110, 10); d.labels = d.counts.map((_, i) => (i === 9 ? '100+' : (10 + i * 10) + 's')); return d; }
    // mean of each trait per value of a dimension
    function traitMeans(cards, dim) {
        const m = new Map();
        for (const c of cards) for (const v of dimValues(c, dim)) {
            let g = m.get(v);
            if (!g) { g = { key: v, n: 0, sum: TRAITS.map(() => 0), cnt: TRAITS.map(() => 0) }; m.set(v, g); }
            g.n++;
            TRAITS.forEach((t, i) => { if (c[t] != null) { g.sum[i] += c[t]; g.cnt[i]++; } });
        }
        const counts = new Map([...m].map(([k, g]) => [k, g.n]));
        return orderKeys(dim, counts).map(k => { const g = m.get(k); return { key: k, n: g.n, means: g.sum.map((s, i) => (g.cnt[i] ? s / g.cnt[i] : null)) }; });
    }

    // ------------------------------------------------------------------ filter, score, sort
    // `pick` is a hand-picked set of crew (one cell of the compare table): { label, ids: Set of card numbers } or null.
    function emptyFilter() { return { rarity: new Set(), faction: new Set(), species: new Set(), university: new Set(), sex: new Set(), aptitude: new Set(), aptCount: new Set(), minGain: '', q: '', pick: null }; }
    function filterActive(f) { return DIMS.some(d => f[d].size) || !!f.minGain || !!f.q.trim() || !!f.pick; }
    // The crew one cell of crosstab() counts: exactly the cards holding both values. Picking these by card number is
    // the only drill-down that always shows what the cell counted (an aptitude filter would mean something else when
    // aptitudes or an XP rate are already picked).
    function cellIds(cards, rowDim, rowVal, colDim, colVal) {
        const ids = new Set();
        for (const c of cards) if (dimValues(c, rowDim).includes(rowVal) && dimValues(c, colDim).includes(colVal)) ids.add(c.id);
        return ids;
    }
    function gainAtLeast(g, min) { return GAINS.indexOf(g) >= GAINS.indexOf(min); }
    // Within one dimension any picked value matches - except aptitude, where a card must have EVERY picked aptitude.
    // minGain applies to the picked aptitudes, or to any aptitude when none is picked.
    function applyFilter(cards, f) {
        const q = f.q.trim().toLowerCase().replace(/^#/, '');
        const want = [...f.aptitude];
        return cards.filter(c => {
            if (f.pick && !f.pick.ids.has(c.id)) return false;
            for (const d of ['rarity', 'faction', 'species', 'university', 'sex']) if (f[d].size && !f[d].has(c[d])) return false;
            if (f.aptCount.size && !f.aptCount.has(String(c.apts.length))) return false;
            for (const k of want) {
                const a = c.apts.find(x => x.k === k);
                if (!a) return false;
                if (f.minGain && !gainAtLeast(a.g, f.minGain)) return false;
            }
            if (!want.length && f.minGain && !c.apts.some(a => gainAtLeast(a.g, f.minGain))) return false;
            if (q && !(c.name.toLowerCase().includes(q) || String(c.id).startsWith(q))) return false;
            return true;
        });
    }
    // XP gain a card brings to the picked aptitudes (all of its aptitudes when none is picked): 0.25 / 0.5 / 1 each
    function score(card, aptitudes) {
        const pick = aptitudes && aptitudes.size ? aptitudes : null;
        let s = 0;
        for (const a of card.apts) if (!pick || pick.has(a.k)) s += GAIN_XP[a.g];
        return s;
    }
    const SORTS = ['score', 'rarity', 'name', 'age', 'id'].concat(TRAITS);
    const SORT_LABEL = Object.assign({ score: 'Best XP gain', rarity: 'Rarity', name: 'Name', age: 'Age (oldest)', id: 'Card number' }, Object.fromEntries(TRAITS.map(t => [t, TRAIT_LABEL[t] + ' (highest)'])));
    // Every order ends on the card number, so equal cards always come out in the same order.
    function sortCards(cards, key, aptitudes) {
        const byId = (a, b) => a.id - b.id;
        const rar = (a, b) => rarityRank(b.rarity) - rarityRank(a.rarity);
        const cmp = {
            score: (a, b) => score(b, aptitudes) - score(a, aptitudes) || rar(a, b) || byId(a, b),
            rarity: (a, b) => rar(a, b) || score(b, aptitudes) - score(a, aptitudes) || byId(a, b),
            name: (a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0) || byId(a, b),
            id: byId
        }[key] || ((a, b) => (b[key] == null ? -1 : b[key]) - (a[key] == null ? -1 : a[key]) || byId(a, b));
        return cards.slice().sort(cmp);
    }

    // ------------------------------------------------------------------ the roster in sentences
    function list(names) { return names.length <= 1 ? names.join('') : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]; }
    // Lines are chosen by rule: strongest / thinnest aptitude = most / fewest cards (ties are all named).
    function verdict(cards) {
        if (!cards.length) return [];
        const out = [];
        const mx = aptitudeMatrix(cards).filter(r => APTITUDES.includes(r.key));
        const hi = Math.max(...mx.map(r => r.any)), lo = Math.min(...mx.map(r => r.any));
        if (hi > 0) {
            const top = mx.filter(r => r.any === hi), low = mx.filter(r => r.any === lo);
            if (hi === lo) out.push('Every aptitude is on <b>' + fmt(hi) + '</b> crew.');
            else {
                out.push('Strongest aptitude: <b>' + esc(list(top.map(r => r.key))) + '</b>, on <b>' + fmt(hi) + '</b> crew (' + pct(hi / cards.length) + ')' + (top.length === 1 ? ', <b>' + fmt(top[0].major + top[0].anomalous) + '</b> of them at major or better.' : '.'));
                out.push('Thinnest: <b>' + esc(list(low.map(r => r.key))) + '</b>, on <b>' + fmt(lo) + '</b> crew' + (lo === 0 ? ' - nobody has it.' : '.'));
            }
        }
        const anom = cards.filter(c => c.apts.some(a => a.g === 'anomalous')).length;
        // "at least one major" is true of every card seen so far, so it says nothing; two or more is what varies
        const major2 = cards.filter(c => c.apts.filter(a => gainAtLeast(a.g, 'major')).length >= 2).length;
        out.push((anom ? '<b>' + fmt(anom) + '</b> crew have an anomaly-rate aptitude (+100% XP)' : 'No crew has an anomaly-rate aptitude (+100% XP)') + '; <b>' + fmt(major2) + '</b> (' + pct(major2 / cards.length) + ') have two or more aptitudes at major (+50%) or better.');
        const multi = cards.filter(c => c.apts.length >= 3).length;
        if (multi) out.push('<b>' + fmt(multi) + '</b> crew (' + pct(multi / cards.length) + ') carry three aptitudes.');
        return out;
    }

    const api = {
        RARITIES, FACTIONS, APTITUDES, GAINS, GAIN_XP, GAIN_LABEL, PERK_LEVELS, PERKS, TRAITS, TRAIT_LABEL, DIMS, DIM_LABEL, SORTS, SORT_LABEL,
        SAGE_PROGRAM, SAGE_GAME,
        esc, shortAddr, fmt, pct, clock, portraitUrl,
        b58decode, b58encode, isAddress, isOnCurve, findProgramAddress, sagePlayerProfileAddress,
        normalize, normGain, validId, perksOf, cleanCard, cleanRecord, shouldSave, mergeCards, aptRank, rarityRank,
        dimValues, countBy, crosstab, aptitudeMatrix, distribution, traitStats, ageStats, traitMeans,
        emptyFilter, filterActive, cellIds, applyFilter, gainAtLeast, score, sortCards, verdict
    };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.CrewModel = api;
})(typeof window !== 'undefined' ? window : globalThis);
