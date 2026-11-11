// app.js - Crew Explorer page (2026-11-10). DOM only: every number comes from crew-model.js, every network read from
// crew-fetch.js, the saved roster from crew-store.js. All feed text goes through M.esc before it reaches innerHTML.
(function () {
    'use strict';
    const M = window.CrewModel, F = window.CrewFetch, S = window.CrewStore;
    const $ = id => document.getElementById(id);
    const PER_PAGE = 36;
    const CHIP_DIMS = ['rarity', 'faction', 'species', 'aptitude'];
    const BAR_DIMS = ['rarity', 'faction', 'species', 'university', 'sex', 'aptCount'];
    const GROUP_DIMS = ['species', 'faction', 'rarity', 'aptitude', 'university', 'sex'];

    const st = {
        all: [], view: [], sources: [], notes: [], partial: false, savedAt: 0, inputs: { wallet: '', profile: '' },
        f: M.emptyFilter(), tab: 'overview', sort: 'score', page: 0, pivot: { row: 'rarity', col: 'species' }, group: 'species',
        ctrl: null, timer: 0, drawerId: null, lastFocus: null, zoomFrom: null, saved: null, kept: false
    };

    // ------------------------------------------------------------------ small helpers
    const e = M.esc;
    const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const rarityCls = r => (M.RARITIES.includes(r) ? 'r-' + slug(r) : 'r-unknown');
    const factionCls = f => (M.FACTIONS.includes(f) ? 'f-' + slug(f) : 'f-unknown');
    const xpText = s => '+' + Math.round(s * 100) + '% XP';
    const plural = (n, one, many) => M.fmt(n) + ' ' + (n === 1 ? one : (many || one + 's'));
    function ago(ms) {
        const s = Math.max(0, Math.round(ms / 1000));
        if (s < 90) return 'just now';
        if (s < 5400) return Math.round(s / 60) + ' min ago';
        if (s < 172800) return Math.round(s / 3600) + ' h ago';
        return Math.round(s / 86400) + ' days ago';
    }
    function showMsg(text) { const m = $('crMsg'); m.textContent = text || ''; m.hidden = !text; }

    // ------------------------------------------------------------------ loading
    async function startLoad(input) {
        if (st.ctrl) return;
        showMsg('');
        st.ctrl = new AbortController();
        const t0 = Date.now();
        const paint = p => {
            if (p) { $('crLoadStep').textContent = p.label + ' (' + p.step + ' of ' + p.steps + ')' + (p.pages ? ', page ' + p.pages : ''); $('crLoadN').textContent = M.fmt(p.cards); }
            const el = Date.now() - t0;
            $('crLoadT').textContent = M.clock(Math.min(el, F.LIMIT_MS));
            $('crLoadBar').style.width = Math.min(100, el / F.LIMIT_MS * 100).toFixed(1) + '%';
        };
        $('crLoadStep').textContent = 'Finding the crew accounts'; $('crLoadN').textContent = '0'; paint();
        $('crLoad').hidden = false; $('crGo').disabled = true;
        st.timer = setInterval(paint, 500);
        let res = null, err = '';
        try { res = await F.load(input, { signal: st.ctrl.signal }, paint); }
        catch (x) { err = String(x && x.message || x); }
        clearInterval(st.timer); st.timer = 0; st.ctrl = null;
        $('crLoad').hidden = true; $('crGo').disabled = false;
        if (err) { showMsg('Could not load: ' + err + '.'); return; }
        // nothing came back: say what happened and keep whatever roster is already on screen (and saved)
        if (!res.cards.length) { showMsg(F.describeEmpty(res)); return; }
        const rec = { v: 1, savedAt: Date.now(), inputs: { wallet: (input.wallet || '').trim(), profile: (input.profile || '').trim() }, sources: res.sources, notes: res.notes, partial: res.partial, cards: res.cards };
        // part of a load never replaces a complete saved roster: it is shown, and the saved one stays
        if (!M.shouldSave(rec, st.saved)) {
            adopt(rec, false, 'This load is incomplete, so it is shown but not saved. The complete roster saved earlier (' + plural(st.saved.count, 'crew', 'crew') + ') is kept and comes back when the page is reopened.');
            return;
        }
        adopt(rec, true);
        if (window.UiSfx) window.UiSfx.play(res.partial ? 'tap' : 'done');   // a whole roster arrived: one soft chime
        try { await S.put(rec); st.saved = { partial: rec.partial, count: rec.cards.length }; }
        catch (x) { st.kept = false; st.notes = st.notes.concat('This roster could not be saved on this device, so it will need loading again next time.'); renderSources(); }
    }

    // kept = this roster is (about to be) the one saved on the device
    function adopt(rec, kept, note) {
        st.all = rec.cards; st.sources = rec.sources; st.notes = (rec.notes || []).concat(note ? [note] : []); st.partial = !!rec.partial; st.savedAt = rec.savedAt || 0; st.kept = kept;
        st.inputs = { wallet: String(rec.inputs.wallet || ''), profile: String(rec.inputs.profile || '') };
        st.f = M.emptyFilter(); st.page = 0; $('crQ').value = '';
        $('crWallet').value = st.inputs.wallet; $('crProfile').value = st.inputs.profile;
        $('crMain').hidden = false; $('crNote').hidden = true;
        renderKpis(); renderSources(); refresh();
    }
    async function forget() {
        try { await S.clear(); st.saved = null; } catch (x) { showMsg('The saved roster could not be deleted from this device.'); return; }
        st.all = []; st.view = []; st.sources = []; st.notes = []; showMsg('');
        $('crMain').hidden = true; $('crKpis').hidden = true; $('crKpis').innerHTML = ''; $('crSources').innerHTML = ''; $('crSources').hidden = true; $('crNote').hidden = false;
        $('crWallet').value = ''; $('crProfile').value = ''; closeDrawer();
    }

    // ------------------------------------------------------------------ top: KPIs and sources
    function renderKpis() {
        const by = new Map(M.countBy(st.all, 'rarity').map(r => [r.key, r.n]));
        $('crKpis').innerHTML = '<div class="cr-kpi hot"><span>Crew</span><b>' + M.fmt(st.all.length) + '</b></div>' +
            M.RARITIES.map(r => '<div class="cr-kpi ' + rarityCls(r) + '"><span>' + e(r) + '</span><b>' + M.fmt(by.get(r) || 0) + '</b></div>').join('');
        $('crKpis').hidden = false;
    }
    function renderSources() {
        const rows = st.sources.map(s => {
            const what = s.kind === 'wallet' ? 'Wallet' : 'SAGE profile';
            const state = s.error ? '<em class="bad">' + e(s.error) + '</em>' : (s.complete ? '' : '<em class="warn">' + e(F.reasonText(s.reason)) + '</em>');
            return '<li><span>' + what + '</span><code title="' + e(s.key) + '">' + e(M.shortAddr(s.key)) + '</code><b>' + plural(s.count || 0, 'crew', 'crew') + '</b>' + state + '</li>';
        }).join('');
        const notes = st.notes.map(n => '<p class="cr-src-note">' + e(n) + '</p>').join('');
        $('crSources').innerHTML = '<ul>' + rows + '</ul>' + notes +
            '<p class="cr-src-foot">' + (st.partial ? '<em class="warn">Partial roster.</em> ' : '') + (st.savedAt ? 'Loaded ' + e(ago(Date.now() - st.savedAt)) : 'Loaded earlier') + (st.kept ? ', kept on this device. ' : ', not saved. ') +
            '<button type="button" class="cr-link" data-act="reload">Reload</button><button type="button" class="cr-link" data-act="forget">Forget this roster</button></p>';
        $('crSources').hidden = false;
    }

    // ------------------------------------------------------------------ filters
    function toggle(dim, v) { if (!M.DIMS.includes(dim)) return; const s = st.f[dim]; if (s.has(v)) s.delete(v); else s.add(v); st.page = 0; refresh(); }
    function renderChips() {
        const groups = CHIP_DIMS.map(dim => {
            const chips = M.countBy(st.all, dim).map(r => '<button type="button" class="cr-chip' + (st.f[dim].has(r.key) ? ' on' : '') + (dim === 'rarity' ? ' ' + rarityCls(r.key) : dim === 'faction' ? ' ' + factionCls(r.key) : '') +
                '" data-f="' + dim + '" data-v="' + e(r.key) + '" aria-pressed="' + st.f[dim].has(r.key) + '">' + e(r.key) + '<i>' + M.fmt(r.n) + '</i></button>').join('');
            return '<div class="cr-chipgroup"><h4>' + e(M.DIM_LABEL[dim]) + (dim === 'aptitude' ? ' <small>has all picked</small>' : '') + '</h4><div class="cr-chips">' + chips + '</div></div>';
        });
        const gains = [['', 'Any rate'], ['major', 'Major or better'], ['anomalous', 'Anomaly only']].map(g =>
            '<button type="button" class="cr-chip' + (st.f.minGain === g[0] ? ' on' : '') + '" data-gain="' + g[0] + '" aria-pressed="' + (st.f.minGain === g[0]) + '">' + g[1] + '</button>').join('');
        groups.push('<div class="cr-chipgroup"><h4>XP rate</h4><div class="cr-chips">' + gains + '</div></div>');
        const extra = ['university', 'sex', 'aptCount'].flatMap(dim => [...st.f[dim]].map(v =>
            '<button type="button" class="cr-chip on" data-f="' + dim + '" data-v="' + e(v) + '">' + e(M.DIM_LABEL[dim]) + ': ' + e(v) + ' ×</button>'));
        if (st.f.pick) extra.push('<button type="button" class="cr-chip on" data-act="unpick" title="Picked from the compare table">' + e(st.f.pick.label) + ' <i>' + M.fmt(st.f.pick.ids.size) + '</i> ×</button>');
        if (extra.length) groups.push('<div class="cr-chipgroup"><h4>Also</h4><div class="cr-chips">' + extra.join('') + '</div></div>');
        $('crChips').innerHTML = groups.join('');
        $('crCount').innerHTML = '<b>' + M.fmt(st.view.length) + '</b> of ' + M.fmt(st.all.length) + ' crew';
        $('crClear').hidden = !M.filterActive(st.f);
    }

    // ------------------------------------------------------------------ shared pieces
    function barPanel(dim) {
        const rows = M.countBy(st.view, dim), max = Math.max(1, ...rows.map(r => r.n));
        const cls = k => (dim === 'rarity' ? rarityCls(k) : dim === 'faction' ? factionCls(k) : '');
        return '<div class="cr-panel"><h3>' + e(M.DIM_LABEL[dim]) + '</h3><div class="cr-bars">' + (rows.map(r =>
            '<button type="button" class="cr-bar ' + cls(r.key) + (st.f[dim].has(r.key) ? ' on' : '') + '" data-f="' + dim + '" data-v="' + e(r.key) + '" title="Filter to ' + e(r.key) + '">' +
            '<span class="cr-bar-l">' + e(r.key) + '</span><span class="cr-bar-t"><i style="width:' + (r.n / max * 100).toFixed(1) + '%"></i></span><b>' + M.fmt(r.n) + '</b><small>' + M.pct(r.n / st.view.length) + '</small></button>').join('') || '<p class="cr-none">No crew match.</p>') + '</div></div>';
    }
    function histogram(d, title, labels) {
        const cols = d.counts.map((n, i) => '<div class="cr-hcol" title="' + e(labels[i]) + ': ' + M.fmt(n) + ' crew"><i style="height:' + (d.peak ? (n / d.peak * 100).toFixed(1) : 0) + '%"></i><span>' + e(labels[i]) + '</span></div>').join('');
        const dp = d.field === 'age' ? 1 : 2;
        return '<div class="cr-panel"><h3>' + e(title) + '</h3><div class="cr-hist">' + cols + '</div>' +
            '<p class="cr-stat">' + (d.n ? 'mean <b>' + M.fmt(d.mean, dp) + '</b> · median <b>' + M.fmt(d.median, dp) + '</b> · range ' + M.fmt(d.min, dp) + ' to ' + M.fmt(d.max, dp) : 'no values') + '</p></div>';
    }
    function aptPills(c, pick) {
        return c.apts.map(a => '<em class="cr-apt g-' + a.g + (pick && pick.has(a.k) ? ' pick' : '') + '" title="' + e(a.k) + ', ' + M.GAIN_LABEL[a.g].toLowerCase() + ' (' + xpText(M.GAIN_XP[a.g]) + ')">' + e(a.k.slice(0, 3)) + '</em>').join('');
    }
    function cardHtml(c, withScore) {
        return '<button type="button" class="cr-card ' + rarityCls(c.rarity) + '" data-id="' + c.id + '">' +
            '<span class="cr-pic"><img class="cr-img" loading="lazy" decoding="async" referrerpolicy="no-referrer" src="' + e(M.portraitUrl(c.id)) + '" alt=""><i class="cr-frame"></i></span>' +
            '<span class="cr-nm">' + e(c.name) + '</span>' +
            '<span class="cr-meta"><i class="cr-dot ' + factionCls(c.faction) + '" title="Faction: ' + e(c.faction) + '"></i>' + e(c.rarity) + ' · ' + e(c.species) + '</span>' +
            '<span class="cr-apts">' + aptPills(c, st.f.aptitude) + (withScore ? '<b class="cr-score">' + xpText(M.score(c, st.f.aptitude)) + '</b>' : '') + '</span></button>';
    }
    const options = (list, labels, cur) => list.map(v => '<option value="' + e(v) + '"' + (v === cur ? ' selected' : '') + '>' + e(labels[v]) + '</option>').join('');

    // ------------------------------------------------------------------ Overview
    function renderOverview() {
        const v = st.view;
        const lines = M.verdict(v).map(l => '<li>' + l + '</li>').join('');
        const ct = M.crosstab(v, st.pivot.row, st.pivot.col);
        const head = '<tr><th></th>' + ct.cols.map(c => '<th>' + e(c) + '</th>').join('') + '<th class="tot">All</th></tr>';
        const body = ct.rows.map((r, i) => '<tr><th>' + e(r) + '</th>' + ct.cells[i].map((n, j) =>
            '<td>' + (n ? '<button type="button" class="cr-cell" style="--h:' + (n / ct.max).toFixed(3) + '" data-pr="' + e(r) + '" data-pc="' + e(ct.cols[j]) + '" title="' + e(r) + ' and ' + e(ct.cols[j]) + ': show these crew">' + M.fmt(n) + '</button>' : '<span class="cr-zero">0</span>') + '</td>').join('') +
            '<td class="tot">' + M.fmt(ct.rowTot[i]) + '</td></tr>').join('');
        const foot = '<tr class="tot"><th>All</th>' + ct.colTot.map(n => '<td>' + M.fmt(n) + '</td>').join('') + '<td>' + M.fmt(v.length) + '</td></tr>';
        const age = M.ageStats(v);
        $('sec-overview').innerHTML =
            (lines ? '<div class="cr-panel cr-verdict"><ul>' + lines + '</ul></div>' : '') +
            '<div class="cr-grid">' + BAR_DIMS.map(barPanel).join('') + histogram(age, 'Age', age.labels) + '</div>' +
            '<div class="cr-panel cr-pivot"><h3>Compare <select id="crPivRow" aria-label="Rows">' + options(M.DIMS, M.DIM_LABEL, st.pivot.row) + '</select> against <select id="crPivCol" aria-label="Columns">' + options(M.DIMS, M.DIM_LABEL, st.pivot.col) + '</select></h3>' +
            (v.length ? '<div class="cr-scroll"><table class="cr-table cr-heat"><thead>' + head + '</thead><tbody>' + body + foot + '</tbody></table></div><p class="cr-stat">Crew in each pair. Click a number to see those crew.' + (st.pivot.row === 'aptitude' || st.pivot.col === 'aptitude' ? ' A crew member with several aptitudes is counted under each, so aptitude totals add up to more than the crew.' : '') + '</p>' : '<p class="cr-none">No crew match.</p>') + '</div>';
    }

    // ------------------------------------------------------------------ Aptitudes
    function renderAptitudes() {
        const v = st.view, mx = M.aptitudeMatrix(v), pick = st.f.aptitude;
        const maxAny = Math.max(1, ...mx.map(r => r.any));
        const rows = mx.map(r => {
            const perks = M.perksOf(r.key).map((p, i) => '<span class="cr-perk"><i>' + M.PERK_LEVELS[i] + '</i>' + e(p) + '</span>').join('');
            return '<tr class="' + (pick.has(r.key) ? 'on' : '') + '"><th><button type="button" class="cr-aptname" data-f="aptitude" data-v="' + e(r.key) + '" aria-pressed="' + pick.has(r.key) + '">' + e(r.key) + '</button></th>' +
                '<td class="g-minor">' + M.fmt(r.minor) + '</td><td class="g-major">' + M.fmt(r.major) + '</td><td class="g-anomalous">' + M.fmt(r.anomalous) + '</td>' +
                '<td class="tot"><span class="cr-inbar"><i style="width:' + (r.any / maxAny * 100).toFixed(1) + '%"></i></span>' + M.fmt(r.any) + '</td><td class="cr-perks">' + perks + '</td></tr>';
        }).join('');
        const best = M.sortCards(v.filter(c => M.score(c, pick) > 0), 'score', pick).slice(0, 12);
        const forWhat = pick.size ? [...pick].join(' + ') : 'any aptitude';
        $('sec-aptitudes').innerHTML =
            '<div class="cr-panel"><h3>Aptitudes across ' + plural(v.length, 'crew', 'crew') + '</h3>' +
            '<div class="cr-scroll"><table class="cr-table cr-apt-table"><thead><tr><th>Aptitude</th><th>Minor <small>+25% XP</small></th><th>Major <small>+50%</small></th><th>Anomaly <small>+100%</small></th><th class="tot">Crew</th><th>Perks unlocked at level</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
            '<p class="cr-stat">Any crew can level any aptitude; a rolled aptitude only earns its XP faster. Click an aptitude to pick it - picking several keeps crew that have all of them.</p></div>' +
            '<div class="cr-panel"><h3>Best crew for ' + e(forWhat) + ' <button type="button" class="cr-link" data-act="roster-score">see all in the roster</button></h3>' +
            '<p class="cr-stat">Ranked by XP gain on the picked aptitudes (+25% minor, +50% major, +100% anomaly, added up), then rarity, then card number.</p>' +
            (best.length ? '<div class="cr-cards">' + best.map(c => cardHtml(c, true)).join('') + '</div>' : '<p class="cr-none">No crew match.</p>') + '</div>';
    }

    // ------------------------------------------------------------------ Personality
    function renderPersonality() {
        const v = st.view;
        const bins = ['0', '.1', '.2', '.3', '.4', '.5', '.6', '.7', '.8', '.9'];
        const hist = M.traitStats(v).map(d => histogram(d, M.TRAIT_LABEL[d.field], bins)).join('');
        const means = M.traitMeans(v, st.group);
        const body = means.map(g => '<tr><th>' + e(g.key) + '</th><td class="tot">' + M.fmt(g.n) + '</td>' + g.means.map(m =>
            '<td>' + (m == null ? '-' : '<span class="cr-cell flat" style="--h:' + m.toFixed(3) + '">' + m.toFixed(2) + '</span>') + '</td>').join('') + '</tr>').join('');
        $('sec-personality').innerHTML = '<div class="cr-grid">' + hist + '</div>' +
            '<div class="cr-panel"><h3>Average personality by <select id="crGroup" aria-label="Group by">' + options(GROUP_DIMS, M.DIM_LABEL, st.group) + '</select></h3>' +
            (v.length ? '<div class="cr-scroll"><table class="cr-table cr-heat"><thead><tr><th></th><th class="tot">Crew</th>' + M.TRAITS.map(t => '<th>' + M.TRAIT_LABEL[t] + '</th>').join('') + '</tr></thead><tbody>' + body + '</tbody></table></div>' : '<p class="cr-none">No crew match.</p>') +
            '<p class="cr-stat">Each trait runs from 0 to 1. The feed gives the values; what they do in game has not been published.</p></div>';
    }

    // ------------------------------------------------------------------ Roster
    function renderRoster() {
        const sorted = M.sortCards(st.view, st.sort, st.f.aptitude);
        const pages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
        st.page = Math.min(st.page, pages - 1);
        const slice = sorted.slice(st.page * PER_PAGE, (st.page + 1) * PER_PAGE);
        const pager = '<div class="cr-pager"><button type="button" data-page="-1"' + (st.page ? '' : ' disabled') + ' aria-label="Previous page">‹</button><span>Page <b>' + (st.page + 1) + '</b> of ' + M.fmt(pages) + '</span><button type="button" data-page="1"' + (st.page < pages - 1 ? '' : ' disabled') + ' aria-label="Next page">›</button></div>';
        $('sec-roster').innerHTML = '<div class="cr-panel"><div class="cr-rtools"><label>Sort <select id="crSort">' + options(M.SORTS, M.SORT_LABEL, st.sort) + '</select></label>' + pager + '</div>' +
            (slice.length ? '<div class="cr-cards">' + slice.map(c => cardHtml(c, st.sort === 'score')).join('') + '</div>' : '<p class="cr-none">No crew match these filters.</p>') +
            (pages > 1 ? '<div class="cr-rtools end">' + pager + '</div>' : '') + '</div>';
    }

    // ------------------------------------------------------------------ drawer (one crew member)
    function openDrawer(id) {
        const c = st.all.find(x => x.id === id);
        if (!c) return;
        st.lastFocus = document.activeElement; st.drawerId = id;
        const row = (k, v) => '<div><dt>' + k + '</dt><dd>' + v + '</dd></div>';
        const traits = M.TRAITS.map(t => '<div class="cr-trait"><span>' + M.TRAIT_LABEL[t] + '</span><span class="cr-bar-t"><i style="width:' + ((c[t] || 0) * 100).toFixed(0) + '%"></i></span><b>' + (c[t] == null ? '-' : c[t].toFixed(2)) + '</b></div>').join('');
        const apts = c.apts.map(a => '<div class="cr-dapt"><h4><em class="cr-apt g-' + a.g + '">' + e(a.k) + '</em> ' + M.GAIN_LABEL[a.g] + ' <small>' + xpText(M.GAIN_XP[a.g]) + '</small></h4><div class="cr-perks">' +
            M.perksOf(a.k).map((p, i) => '<span class="cr-perk"><i>' + M.PERK_LEVELS[i] + '</i>' + e(p) + '</span>').join('') + '</div></div>').join('') || '<p class="cr-none">No rolled aptitude.</p>';
        $('crDrawer').innerHTML = '<button type="button" class="cr-x" data-act="close" aria-label="Close">×</button>' +
            '<div class="cr-dhead ' + rarityCls(c.rarity) + '"><button type="button" class="cr-pic cr-zoomable" data-zoom="' + c.id + '" title="Click to enlarge" aria-label="Show the full portrait"><img class="cr-img" decoding="async" referrerpolicy="no-referrer" src="' + e(M.portraitUrl(c.id)) + '" alt=""><i class="cr-frame"></i></button>' +
            '<div><h2>' + e(c.name) + '</h2><p class="cr-dsub">Crew #' + M.fmt(c.id) + '</p><p class="cr-drar">' + e(c.rarity) + '</p></div></div>' +
            '<dl class="cr-facts">' + row('Faction', '<i class="cr-dot ' + factionCls(c.faction) + '"></i>' + e(c.faction)) + row('Species', e(c.species)) + row('Body', e(c.sex)) + row('University', e(c.university)) + row('Age', c.age == null ? '-' : M.fmt(c.age, 1)) + '</dl>' +
            '<h3>Aptitudes</h3>' + apts + '<h3>Personality</h3>' + traits +
            (c.das ? '<h3>On chain</h3><p class="cr-das"><code>' + e(c.das) + '</code></p>' : '');
        $('crDrawer').classList.add('open'); $('crDrawer').setAttribute('aria-hidden', 'false'); $('crScrim').hidden = false;
        $('crDrawer').focus();
    }
    // the full-size portrait over everything; any click or Escape closes it and focus returns to the small one
    function openZoom(id, from) {
        const c = st.all.find(x => x.id === id);
        if (!c || (from && from.classList.contains('noimg'))) return;
        st.zoomFrom = from || null;
        $('crZoom').innerHTML = '<figure class="' + rarityCls(c.rarity) + '"><img referrerpolicy="no-referrer" src="' + e(M.portraitUrl(c.id)) + '" alt="' + e(c.name) + '">' +
            '<figcaption><b>' + e(c.name) + '</b> Crew #' + M.fmt(c.id) + ' · ' + e(c.rarity) + '</figcaption></figure><button type="button" class="cr-x" aria-label="Close">×</button>';
        $('crZoom').hidden = false;
        $('crZoom').querySelector('button').focus();
    }
    function closeZoom() {
        if ($('crZoom').hidden) return false;
        $('crZoom').hidden = true; $('crZoom').innerHTML = '';
        if (st.zoomFrom && document.contains(st.zoomFrom)) st.zoomFrom.focus();
        st.zoomFrom = null;
        return true;
    }
    function closeDrawer() {
        closeZoom();
        if (st.drawerId == null) return;
        st.drawerId = null;
        $('crDrawer').classList.remove('open'); $('crDrawer').setAttribute('aria-hidden', 'true'); $('crScrim').hidden = true;
        if (st.lastFocus && document.contains(st.lastFocus)) st.lastFocus.focus();
    }

    // ------------------------------------------------------------------ render loop
    const RENDER = { overview: renderOverview, aptitudes: renderAptitudes, personality: renderPersonality, roster: renderRoster };
    function refresh() { st.view = M.applyFilter(st.all, st.f); renderChips(); RENDER[st.tab](); }
    function setTab(tab) {
        st.tab = tab;
        document.querySelectorAll('.cr-tab').forEach(b => { const on = b.dataset.tab === tab; b.classList.toggle('active', on); b.setAttribute('aria-selected', on); });
        document.querySelectorAll('.cr-sec').forEach(s => s.classList.toggle('active', s.id === 'sec-' + tab));
        RENDER[tab]();
    }

    // ------------------------------------------------------------------ events
    function onClick(ev) {
        const t = ev.target.closest('button, a');
        if (!t) return;
        if (t.dataset.f) return toggle(t.dataset.f, t.dataset.v);
        if (t.dataset.gain !== undefined) { st.f.minGain = t.dataset.gain; st.page = 0; return refresh(); }
        if (t.dataset.tab) return setTab(t.dataset.tab);
        if (t.dataset.zoom) return openZoom(Number(t.dataset.zoom), t);
        if (t.dataset.id) return openDrawer(Number(t.dataset.id));
        if (t.dataset.page) { st.page += Number(t.dataset.page); renderRoster(); $('sec-roster').scrollIntoView({ block: 'start' }); return; }
        if (t.dataset.pr !== undefined) {
            // a pivot cell: pick exactly the crew that cell counted, by card number, on top of the filters in force
            const r = t.dataset.pr, c = t.dataset.pc;
            st.f.pick = { label: r === c && st.pivot.row === st.pivot.col ? r : r + ' + ' + c, ids: M.cellIds(st.view, st.pivot.row, r, st.pivot.col, c) };
            st.page = 0; st.view = M.applyFilter(st.all, st.f); renderChips(); return setTab('roster');
        }
        const act = t.dataset.act;
        if (act === 'unpick') { st.f.pick = null; st.page = 0; return refresh(); }
        if (act === 'close') return closeDrawer();
        if (act === 'reload') return startLoad(st.inputs);
        if (act === 'forget') return forget();
        if (act === 'roster-score') { st.sort = 'score'; st.page = 0; return setTab('roster'); }
    }
    function onChange(ev) {
        const t = ev.target;
        if (t.id === 'crPivRow') { st.pivot.row = t.value; renderOverview(); }
        else if (t.id === 'crPivCol') { st.pivot.col = t.value; renderOverview(); }
        else if (t.id === 'crGroup') { st.group = t.value; renderPersonality(); }
        else if (t.id === 'crSort') { st.sort = t.value; st.page = 0; renderRoster(); }
    }

    async function init() {
        $('crFilters').innerHTML = '<div id="crChips" class="cr-chiprow"></div><div class="cr-frow"><label class="cr-find"><span>Find</span><input id="crQ" type="search" placeholder="name or card number" autocomplete="off" spellcheck="false" maxlength="60"></label><span class="cr-count" id="crCount"></span><button type="button" class="cr-link" id="crClear" hidden>Clear filters</button></div>';
        document.addEventListener('click', onClick);
        document.addEventListener('change', onChange);
        // a portrait that fails to load leaves the framed placeholder instead of a broken image
        document.addEventListener('error', ev => { const t = ev.target; if (t && t.classList && t.classList.contains('cr-img')) t.closest('.cr-pic').classList.add('noimg'); }, true);
        document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && !closeZoom()) closeDrawer(); });
        $('crZoom').addEventListener('click', ev => { ev.stopPropagation(); closeZoom(); });
        $('crScrim').addEventListener('click', closeDrawer);
        $('crForm').addEventListener('submit', ev => { ev.preventDefault(); startLoad({ wallet: $('crWallet').value, profile: $('crProfile').value }); });
        $('crStop').addEventListener('click', () => { if (st.ctrl) st.ctrl.abort(); });
        let qTimer = 0;
        $('crQ').addEventListener('input', () => { clearTimeout(qTimer); qTimer = setTimeout(() => { st.f.q = $('crQ').value; st.page = 0; refresh(); }, 150); });
        $('crClear').addEventListener('click', () => { st.f = M.emptyFilter(); $('crQ').value = ''; st.page = 0; refresh(); });
        try { const rec = M.cleanRecord(await S.get()); if (rec) { adopt(rec, true); st.saved = { partial: rec.partial, count: rec.cards.length }; } } catch (x) { /* no saved roster: start empty */ }
    }
    init();
})();
