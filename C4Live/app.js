// app.js - C4 Live page (2026-11-06). Loads Data/c4-live/*.json (written hourly by Tools/c4-live), mounts the 3D map
// (C4Live/c4-scene.js, window.C4Scene - optional: without it the panels still work) and renders the HUD, four tabbed
// sections (Mining, Combat, Fleets, Owners) and the drawer (owner / asteroid / starbase). All numbers come from
// C4Model (c4-ui-model.js). Chain strings (fleet names, system names) are untrusted: everything goes through esc().
// Links IN: ?tab=mining|combat|fleets|owners  ?owner=<profile>  ?system=<address>  ?body=<address>
// v2 layout (2026-11-07): the map fills the viewport; the tabs, the system view and the drawer live in a right-side
// glass dock (a bottom sheet under 700 px). Scene contract: setStatLayer(tab) on every tab change and at mount;
// setInsets({left,right,top,bottom}) = map px covered by the dock / drawer / KPI bar, on every geometry change.
// v3 (2026-11-07): setInsets also carries `avoid` (the floating HUD boxes, canvas px) so callouts stay out from under
// them; a callout pick ({type:'system', source:'callout'}) enters the system view; a deep link applied before the scene
// bundle arrived is replayed at mount; combat hot spots follow the shared nearest-system-within-1.2 rule.
// DACs (2026-11-07): C4Live/dacs.json is a HAND-KEPT list (DACs are mainnet-only today; see c4-ui-model.js). A missing or
// invalid file hides the DACs tab with a console note, never an error. "Show example" assigns real players to the DACs
// for display only: it lives in S.dac.example (never saved), shows a persistent EXAMPLE banner, and only the DACs tab,
// the owner drawer's labelled example row and scene.setDacs({example: true}) ever see it. Scene contract (typeof-guarded):
// setDacs({dacs: [{tag, color, members: [profile]}], example, focus, lens: {on, metrics, scope}}) on load / toggle / focus /
// lens change (v7: lens.on = colour the map by DAC conquest, M.dacConquest's rule); setStatLayer('dacs')
// while the DACs tab is active; focusDac(tag) when the scene has it (else the page flies to the members' centroid).
(function () {
    'use strict';
    const M = window.C4Model;
    const DATA = '../Data/c4-live/';
    const RELOAD_MS = 5 * 60 * 1000;
    const RM = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
    const LAYERS = [['systems', 'Systems'], ['fleets', 'Fleets'], ['mining', 'Mining'], ['routes', 'Routes'], ['combat', 'Combat'], ['territory', 'Territory'], ['labels', 'Labels']];
    const FILTERS = [['all', 'All'], ['mud', 'MUD'], ['oni', 'ONI'], ['ustur', 'Ustur'], ['npc', 'NPC']];
    const RES_ROWS = 12;

    const S = {
        latest: null, events: [], history: [], ownersSeries: {}, D: null, all: null,
        filter: 'all', states: null, ownerFocus: null, tab: 'mining', scene: null, sceneState: 'loading',
        layers: Object.fromEntries(LAYERS.map(l => [l[0], true])),
        fleetQ: '', fleetSort: ['ups', -1], fleetLimit: 30, ownerSort: ['ups', -1], ownerLimit: 50,
        seenEvents: null, drawer: null, rendered: {},
        bodies: null, bodyIdx: null, bodiesP: null, bodiesErr: false, bodiesStale: false, sysView: null,
        view: 'tab',                                             // what the dock shows: 'tab' (S.tab) or 'system'
        dock: { collapsed: false, w: 440, anim: false }, insets: null,
        // DACs: state 'loading' | 'ok' | 'off'; list = the parsed hand-kept file (NEVER written after load); example = the
        // preview toggle (memory only); cache = the derived views for the current snapshot + toggle
        // lens (v7): the conquest lens - on = map coloured by DAC instead of faction; metrics = the selected power metrics
        // (at least one); scope = one DAC tag or null (all DACs). Memory only, like the example toggle.
        dac: { state: 'loading', list: [], errors: [], note: '', why: '', example: false, focus: null, cache: null, lens: { on: false, metrics: ['mining'], scope: null } }
    };
    const DOCK_MIN = 360, DOCK_MAX = 720, RAIL = 58, EDGE = 12;   // px; EDGE = the dock's margin to the viewport edge
    const SHEET_MQ = window.matchMedia ? window.matchMedia('(max-width: 699px)') : { matches: false };
    const $ = (sel, el) => (el || document).querySelector(sel);
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const now = () => Date.now() / 1000;
    const fa = g => `<span class="c4-fa fc-${esc(g)}"><i></i>${esc(M.GROUP_LABEL[g] || g)}</span>`;
    const st = k => `<span class="c4-st st-${esc(k)}">${esc(M.STATE_LABEL[k] || k)}</span>`;
    // v5 (2026-11-07): an owner shows its on-chain NAME (user-typed text: esc only, never raw HTML), falling back to the
    // short profile address; the tooltip always carries the full profile address (names are not unique), and a name
    // the collector cut at 32 characters ends in an ellipsis
    const ownerLabel = p => { const d = M.displayName(S.ident && S.ident.get(p), p);
        return `<span class="c4-on${d.named ? '' : ' unnamed'}" title="${esc((d.truncated ? 'Name cut at 32 characters. ' : '') + 'Profile ' + (p || ''))}">${esc(d.text)}</span>`; };
    const ownerPlain = p => M.ownerText(S.ident, p);
    const nameLc = p => M.cleanName(((S.ident && S.ident.get(p)) || {}).name).toLowerCase();
    // relative time from the WALL CLOCK (not the snapshot); refreshAgo() keeps every [data-ago] current
    const agoSpan = t => `<span data-ago="${+t}">${M.ago(now() - t)} ago</span>`;
    const refreshAgo = () => document.querySelectorAll('[data-ago]').forEach(el => { el.textContent = M.ago(now() - +el.dataset.ago) + ' ago'; });
    const ownerName = (p, npc) => npc ? 'NPC (shared profile)' : ownerLabel(p);
    const sideHtml = sd => sd.group === 'npc' ? `${fa('npc')}` : `${fa(sd.group)} <span class="addr">${ownerLabel(sd.o)}</span>`;

    // ================================================================== loading
    async function getJson(name) {
        const r = await fetch(DATA + name + '?t=' + Date.now(), { cache: 'no-store' });
        if (!r.ok) throw new Error(name + ' ' + r.status);
        return r.json();
    }
    async function load(initial) {
        let latest;
        try { latest = await getJson('latest.json'); }
        catch (e) { if (initial || !S.latest) showEmpty(); return; }
        if (!latest || !Array.isArray(latest.fleets) || !latest.generatedAt) { if (initial || !S.latest) showEmpty(); return; }
        if (!initial && S.latest && latest.generatedAt === S.latest.generatedAt) return;   // no new run yet
        const failed = [];
        const side = (name, dflt) => getJson(name).catch(() => { failed.push(name); return dflt; });
        const [events, history, ownersSeries] = await Promise.all([side('events.json', []), side('history.json', []), side('owners.json', {})]);
        S.loadErr = failed;
        $('#c4Empty').hidden = true;
        S.latest = latest; S.events = Array.isArray(events) ? events : []; S.history = Array.isArray(history) ? history : []; S.ownersSeries = ownersSeries || {};
        rebuild(!initial);
        if (!initial && S.bodies) { S.bodiesP = null; await loadBodies(false); }   // load() pushes the single setData below
        if (S.scene) { try { S.scene.setData(S.latest, S.events, S.bodies || undefined); } catch (e) { console.warn('C4 Live: scene.setData failed', e); } }
        pushDacs();
        if (S.sysView) renderSystemPanel();
        if (initial) { await S.dacP; applyParams(); }
    }
    function showEmpty() {
        const el = $('#c4Empty'); el.hidden = false;
        const file = location.protocol === 'file:';
        el.innerHTML = `<div><h2>No C4 Live data yet</h2>
            <p>${file ? 'This page reads JSON files, so it has to be served over HTTP. From the repo root run <code>python -m http.server 8000</code> and open <a href="http://localhost:8000/C4Live/index.html">localhost:8000/C4Live/index.html</a>.'
                : 'The collector has not written <b>Data/c4-live/latest.json</b> yet. From the repo root run:'}</p>
            ${file ? '' : '<code>cd Tools/c4-live &amp;&amp; npm run collect</code><p>One pass takes about 15 seconds; this page checks again every 5 minutes, or reload when it finishes.</p>'}</div>`;
    }

    function rebuild(isReload) {
        const prevSeen = S.seenEvents;
        S.D = M.build(S.latest, S.events, S.history, S.ownersSeries, { faction: S.filter });
        S.all = S.filter === 'all' ? S.D : M.build(S.latest, S.events, S.history, S.ownersSeries, { faction: 'all' });
        S.ident = S.all.ident;
        S.seenEvents = new Set(S.events.map(evKey));
        S.fresh = isReload && prevSeen ? new Set(S.events.map(evKey).filter(k => !prevSeen.has(k))) : new Set();
        renderKpis(); renderControls(); renderAge();
        S.rendered = {};
        renderTab(S.tab, !isReload);
        if (S.drawer) reopenDrawer();
    }
    const evKey = e => e.t + ':' + e.k + ':' + (e.f || e.sys);

    // ================================================================== motion helpers
    function countUp(el, to, f, dur) {
        if (!el) return;
        const from = el._v != null ? el._v : 0; el._v = to;
        if (RM.matches || from === to) { el.textContent = f(to); return; }
        const t0 = performance.now(); dur = dur || 900;
        const step = t => { const k = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - k, 4); el.textContent = f(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
    }
    function animateIn(el) { if (RM.matches) return; el.classList.remove('c4-anim'); void el.offsetWidth; el.classList.add('c4-anim'); }

    // live projection, every frame: KPI counter + the per-resource counters of the Mining tab
    // map scale in px per map unit AT THE VIEW CENTRE, from the scene's public screenOf (no camera access needed):
    // probe the visible system nearest the centre of the map and measure one map unit there (perspective makes a
    // far-away probe read small). null if the scene or a visible probe is unavailable.
    function mapPxPerUnit() {
        if (!S.scene || typeof S.scene.screenOf !== 'function' || !S.latest) return null;
        try {
            const r = $('#c4Map').getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            // preferred: the scene's own drawn size of the visible fleet nearest the centre (same formula, hull height and
            // depth as FLEET_VS), converted to px per map unit by its class length
            if (typeof S.scene.fleetPixelSize === 'function') {
                // prefer a MEDIUM-class probe (the class the threshold is defined on: no class conversion, so the reading
                // is the scene's own number); any class only when no medium fleet is on screen
                let bf = null, bfd = Infinity, bm = null, bmd = Infinity;
                for (const f of S.latest.fleets) {
                    const st = f.s && f.s.kind; if (st === 'warp' || st === 'subwarp') continue;
                    const p = S.scene.screenOf(f.x, f.y);
                    if (!p || !p.visible) continue;
                    const d = (p.clientX - cx) ** 2 + (p.clientY - cy) ** 2;
                    if (d < bfd) { bfd = d; bf = f; }
                    if (f.flagSize === 'medium' && d < bmd) { bmd = d; bm = f; }
                }
                if (bm) bf = bm;
                const hp = bf ? S.scene.fleetPixelSize(bf.a) : null;
                const v = hp != null ? M.pxPerUnitFromHull(hp, bf.flagSize) : null;
                if (v != null) return v;
            }
            let best = null, bd = Infinity;
            for (const s of S.latest.systems || []) {
                const p = S.scene.screenOf(s.x, s.y);
                if (!p || !p.visible) continue;
                const d = (p.clientX - cx) ** 2 + (p.clientY - cy) ** 2;
                if (d < bd) { bd = d; best = { s, p }; }
            }
            if (!best) return null;
            const q = S.scene.screenOf(best.s.x + 1, best.s.y);
            return q && isFinite(q.clientX) ? Math.hypot(q.clientX - best.p.clientX, q.clientY - best.p.clientY) : null;
        } catch (e) { return null; }
    }
    // KPI counter text: three significant digits past a million ("103M", "1.04B"), so the value fits a narrow KPI column
    const kpiNum = n => n >= 1e9 ? (n / 1e9).toPrecision(3) + 'B' : n >= 1e6 ? (n / 1e6).toPrecision(3) + 'M' : M.fmt(n, 0);
    let hintT = 0;
    function updateShipHint(t) {
        if (t - hintT < 250) return;
        hintT = t;
        const el = $('#c4ShipHint'); if (!el) return;
        const filtered = !!(S.states || S.ownerFocus || (S.filter && S.filter !== 'all'));
        const show = M.shipHintVisible(filtered, filtered ? mapPxPerUnit() : null);
        if (show !== el.classList.contains('show')) { el.classList.toggle('show', show); queueInsets(); }
    }
    function tick(t) {
        updateShipHint(t || performance.now());
        if (S.D && S.latest) {
            const t = now();
            const live = M.liveMined(S.D.mining.ups, S.latest, t);
            const k = $('#kpiMined'); if (k) k.textContent = kpiNum(live.units);
            const ks = $('#kpiMinedS'); if (ks) ks.textContent = live.frozen ? 'collector stopped' : `current rate, ${M.fmt(S.D.mining.ups)} u/s`;
            document.querySelectorAll('[data-live-ups]').forEach(el => { el.textContent = M.fmt(M.liveMined(+el.dataset.liveUps, S.latest, t).units, 0); });
        }
        requestAnimationFrame(tick);
    }
    function renderAge() {
        if (!S.latest) return;
        const a = M.dataAge(S.latest, now());
        const el = $('#c4Age');
        const when = new Date(S.latest.generatedAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const tail = a.state === 'stopped' ? ` - <b>the collector looks stopped</b> (no run for over two intervals). Run <b>npm run collect</b> in Tools/c4-live; the projected counters are frozen.`
            : a.state === 'late' ? ' - the next run is overdue.' : `, next run in about <b>${M.ago(a.next)}</b>. Counters project the current mining rates forward.`;
        const notes = M.qualityNotes(S.latest.quality).concat((S.loadErr || []).map(f => `${f} could not be loaded, so the panels that use it are empty.`));
        // .lg = the full sentence (desktop); .sm = a one-line chip for phones, where the banner must not eat the map
        // (v3: the stopped banner took 70 of 354 map px at 390x844). The chip folds the quality notes into a count.
        const short = a.state === 'stopped' ? `<b>Collector stopped</b> · snapshot ${M.ago(a.age)} ago` : a.state === 'late' ? `Run overdue · snapshot <b>${M.ago(a.age)}</b> ago` : `Snapshot <b>${M.ago(a.age)}</b> ago · next in ${M.ago(a.next)}`;
        const nNote = notes.length ? ` · ${notes.length} note${notes.length === 1 ? '' : 's'}` : '';
        // v7: stopped = a compact amber chip (one line on desktop too); the full instruction is its tooltip and opens on click
        const stopTip = 'The collector looks stopped: no run for over two intervals. Run "npm run collect" in Tools/c4-live; the projected counters are frozen.';
        const lg = a.state === 'stopped'
            ? `<button type="button" class="c4-stopchip" data-age-detail aria-expanded="${S.ageOpen ? 'true' : 'false'}" title="${esc(stopTip)}"><i aria-hidden="true"></i>Collector stopped</button> snapshot <b>${M.ago(a.age)} ago</b> (${esc(when)})${S.ageOpen ? `<span class="c4-stopdetail">${tail}</span>` : ''}`
            : `Snapshot <b>${M.ago(a.age)} ago</b> (${esc(when)})${tail}`;
        el.innerHTML = `<div class="c4-glass c4-age${a.state !== 'ok' ? ' stale' : ''}${a.state === 'stopped' ? ' stopped' : ''}${a.state === 'stopped' && S.ageOpen ? ' open' : ''}" id="c4AgeBox"${notes.length ? ` title="${esc(notes.join('\n'))}"` : a.state === 'stopped' ? ` title="${esc(stopTip)}"` : ''}><span class="lg">${lg}</span><span class="sm">${short}${nNote}</span></div>`
            + notes.map(n => `<div class="c4-glass c4-age c4-qual">${esc(n)}</div>`).join('');
        $('.c4-live-dot').classList.toggle('stale', a.state !== 'ok');
        queueInsets();
    }

    // ================================================================== HUD
    function renderKpis() {
        const k = S.D.kpi, el = $('#c4Kpis');
        if (!el.firstChild) {
            el.innerHTML = `<div class="c4-glass c4-kpis">
                <div class="c4-kpi"><span>Players</span><b id="kpiPlayers">0</b><small id="kpiPlayersS"></small></div>
                <div class="c4-kpi"><span>Fleets</span><b id="kpiFleets">0</b><small id="kpiFleetsS"></small></div>
                <div class="c4-kpi"><span>Ships</span><b id="kpiShips">0</b><small>in those fleets</small></div>
                <div class="c4-kpi"><span>Mining fleets</span><b id="kpiMining">0</b><small id="kpiMiningS"></small></div>
                <div class="c4-kpi hot"><span>Mined (projected)</span><b id="kpiMined">0</b><small id="kpiMinedS"></small></div>
                <div class="c4-kpi"><span>In combat 24 h</span><b id="kpiCombat">0</b><small id="kpiCombatS">fleets</small></div>
                <div class="c4-kpi"><span>Destroyed now</span><b id="kpiDead">0</b><small>fleets in that state</small></div>
                <div class="c4-kpi"><span>Claim stakes</span><b id="kpiStakes">0</b><small>on chain</small></div></div>`;
        }
        const i = n => M.fmt(n, 0);
        countUp($('#kpiPlayers'), k.players, i); $('#kpiPlayersS').textContent = 'owners with fleets';
        countUp($('#kpiFleets'), k.fleets, i); $('#kpiFleetsS').textContent = `${M.fmt(k.playerFleets, 0)} player / ${M.fmt(k.npcFleets, 0)} NPC`;
        countUp($('#kpiShips'), k.ships, i);
        countUp($('#kpiMining'), k.miningFleets, i); $('#kpiMiningS').textContent = k.fleets ? M.pct(k.miningFleets / k.fleets) + ' of fleets' : '';
        countUp($('#kpiCombat'), k.combat24, i); $('#kpiCombatS').textContent = `fleets, ${M.fmt(k.eng24, 0)} engagements`;
        countUp($('#kpiDead'), k.destroyedNow, i);
        countUp($('#kpiStakes'), k.stakes, i);
        // where the bar is narrow the sub-line is hidden (CSS); its text stays readable as the tooltip
        el.querySelectorAll('.c4-kpi').forEach(x => { const s = x.querySelector('small'); x.title = x.querySelector('span').textContent + (s && s.textContent ? ': ' + s.textContent : ''); });
    }
    function renderControls() {
        const el = $('#c4Controls');
        // v7: when DACs are loaded the Faction box also carries the conquest lens switch (Colour by Faction | DAC)
        const L0 = S.dac.lens, dacOk = S.dac.state === 'ok';
        const lensRow = dacOk ? `<div class="c4-chips c4-hud-lens" role="group" aria-label="Colour the map by"><span class="lab">Colour</span><button type="button" class="c4-chip${L0.on ? '' : ' on'}" data-dac-colour="faction" aria-pressed="${L0.on ? 'false' : 'true'}">Faction</button><button type="button" class="c4-chip${L0.on ? ' on' : ''}" data-dac-colour="dac" aria-pressed="${L0.on ? 'true' : 'false'}">DAC</button></div>`
            + (L0.on ? `<p class="c4-hud-lensnote">Map coloured by DAC conquest: ${esc(L0.metrics.map(m => M.CONQUEST_LABEL[m]).join(' + '))}${L0.scope ? `, ${esc(L0.scope)} only` : ''}${S.dac.example ? ' <b class="c4-exmark">EXAMPLE</b>' : ''}</p>` : '') : '';
        el.innerHTML = `<div class="c4-glass c4-box"><h4>Faction</h4><div class="c4-chips">${FILTERS.map(([v, l]) =>
            `<button class="c4-chip${S.filter === v ? ' on' : ''}" data-filter="${v}">${v !== 'all' ? `<span class="dot fc-${v}" style="background:var(--fc)"></span>` : ''}${l}</button>`).join('')}</div>${lensRow}</div>
            <div class="c4-glass c4-box"${S.sceneState !== 'ready' ? ' hidden' : ''}><h4>Layers</h4>${LAYERS.map(([v, l]) =>
            `<label class="c4-layer"><input type="checkbox" data-layer="${v}"${S.layers[v] ? ' checked' : ''}>${l}</label>`).join('')}</div>
            ${S.states || S.ownerFocus ? `<div class="c4-glass c4-box"><h4>Map focus</h4><div class="c4-chips">${S.states ? `<button class="c4-chip on" data-clear="states">${esc(M.STATE_LABEL[S.states[0]])} only &times;</button>` : ''}${S.ownerFocus ? `<button class="c4-chip on" data-clear="owner">${ownerLabel(S.ownerFocus)} &times;</button>` : ''}</div></div>` : ''}`;
        queueInsets();
    }
    function pushFilter() {
        if (!S.scene) return;
        try { S.scene.setFilter({ faction: S.filter === 'all' ? null : S.filter, states: S.states, owner: S.ownerFocus }); } catch (e) { console.warn('C4 Live: setFilter failed', e); }
    }
    function sceneCall(fn) { if (S.scene) { try { fn(S.scene); } catch (e) { console.warn('C4 Live: scene call failed', e); } } }
    // the map is always on screen (v2). A focus asked for before the scene bundle arrived (deep link, slow network) is
    // kept and replayed by mountScene (v3 race fix)
    function focusXY(x, y, zoom) { if (S.scene) sceneCall(s => s.focusPoint(x, y, zoom)); else S.pendingPoint = [x, y, zoom]; }

    // ================================================================== dock (v2): tabs + system view, collapse, resize, insets
    // the scene draws the active tab's stats on the map; guarded because the scene may predate the contract
    function pushStatLayer() {
        if (S.scene && typeof S.scene.setStatLayer === 'function') { try { S.scene.setStatLayer(M.STAT_TABS.includes(S.tab) ? S.tab : S.tab === 'dacs' ? 'dacs' : null); } catch (e) { console.warn('C4 Live: setStatLayer failed', e); } }
    }
    function setTab(tab) {
        S.tab = tab;
        pushStatLayer();
        showView('tab');
        renderTab(tab, true);
    }
    // swap the dock content: the outgoing section fades out, the incoming one fades/rises in (CSS), cards stagger
    let viewTok = 0;
    function showView(view) {
        S.view = view === 'system' && S.sysView ? 'system' : 'tab';
        const dock = $('#c4Dock');
        dock.dataset.acc = S.view === 'system' ? 'system' : S.tab;
        document.querySelectorAll('.c4-tab').forEach(b => {
            const on = S.view === 'system' ? b.dataset.view === 'system' : b.dataset.tab === S.tab;
            b.classList.toggle('active', on); b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        fitTabs();
        const next = S.view === 'system' ? $('#c4SysPanel') : $('#sec-' + S.tab);
        const prev = [...document.querySelectorAll('.c4-sec.active')].filter(s => s !== next);
        const tok = ++viewTok;
        const swap = () => {
            if (tok !== viewTok) return;
            document.querySelectorAll('.c4-sec').forEach(s => { s.classList.remove('leaving'); s.classList.toggle('active', s === next); });
            $('#c4Main').scrollTop = 0;
        };
        if (!prev.length || RM.matches) { swap(); return; }
        prev.forEach(s => s.classList.add('leaving'));
        setTimeout(swap, 140);
    }
    // v4: the tab row never scrolls (a scrolled-off System tab was a 6 px sliver under the dock head). It sheds labels
    // until every tab fits: level 0 = all labelled; 1 = the inactive data tabs show icons only (the active tab and the
    // System tab keep their names); 2 = only the active tab is labelled; 3 = icons only. Every tab keeps its title
    // tooltip, which is also its accessible name when the label is hidden. Runs on any width or label change.
    function fitTabs() {
        const nav = $('#c4Tabs');
        if (!nav) return;
        for (let lv = 0; lv <= 3; lv++) { nav.dataset.fit = String(lv); if (nav.scrollWidth <= nav.clientWidth + 1) return; }
    }
    function setDockCollapsed(c) {
        if (S.dock.collapsed === c) return;
        S.dock.collapsed = c;
        const dock = $('#c4Dock'), btn = $('#c4DockToggle');
        dock.classList.toggle('collapsed', c);
        btn.setAttribute('aria-expanded', c ? 'false' : 'true');
        btn.title = c ? 'Show the panel (D)' : 'Hide the panel (D)';
        try { localStorage.setItem('c4.dock.collapsed', c ? '1' : '0'); } catch (e) { /* private mode */ }
        // the size transition runs ~0.5 s: tell the scene the TARGET geometry now (it can reframe in step), then the
        // measured one when the transition ends; resize-observer readings in between are ignored
        S.dock.anim = !RM.matches;
        pushInsets(true, targetDockRect());
        clearTimeout(S.dock.animT);
        if (!S.dock.anim) pushInsets(true);
        else S.dock.animT = setTimeout(() => { if (S.dock.anim) { S.dock.anim = false; pushInsets(false); } }, 900);   // transitionend can be skipped
    }
    function setDockWidth(w, persist) {
        const max = Math.max(DOCK_MIN, Math.min(DOCK_MAX, Math.round(window.innerWidth * 0.6)));
        S.dock.w = Math.round(Math.max(DOCK_MIN, Math.min(max, w)));
        document.documentElement.style.setProperty('--dock-w', S.dock.w + 'px');
        if (persist) { try { localStorage.setItem('c4.dock.w', String(S.dock.w)); } catch (e) { /* private mode */ } }
    }
    // the layout box of an element without its running transform (a spring slide is mid-flight when we measure)
    function layoutRect(el) {
        const r = el.getBoundingClientRect();
        const tf = getComputedStyle(el).transform;
        if (!tf || tf === 'none') return r;
        try { const m = new DOMMatrixReadOnly(tf); return { left: r.left - m.e, right: r.right - m.e, top: r.top - m.f, bottom: r.bottom - m.f }; } catch (e) { return r; }
    }
    // where the dock WILL be once the collapse/expand transition settles
    function targetDockRect() {
        const W = window.innerWidth, H = window.innerHeight;
        if (SHEET_MQ.matches) { const h = S.dock.collapsed ? RAIL : Math.round(H * 0.58); return { left: 0, right: W, top: H - h, bottom: H }; }
        const w = S.dock.collapsed ? RAIL : S.dock.w;
        return { left: W - EDGE - w, right: W - EDGE, top: EDGE, bottom: H - EDGE };
    }
    // the floating HUD boxes the map shows through (v3 `avoid`): map controls, brand, age / collector banner and quality
    // notes, the ship hint while shown. Hidden boxes (display:none) have no client rects and drop out.
    function hudRects() {
        const els = [...document.querySelectorAll('#c4Controls > .c4-glass, .c4-brand, #c4Age > .c4-age, #c4DacEx')];
        const hint = $('#c4ShipHint'); if (hint && hint.classList.contains('show')) els.push(hint);
        // layoutRect: the box where it settles, without a running transform (the hint rises 4 px as it fades in)
        return els.filter(el => el.getClientRects().length).map(layoutRect);
    }
    function currentInsets(dockRect) {
        const map = $('#c4Map').getBoundingClientRect();
        const kpi = $('#c4Kpis'), drawer = $('#c4Drawer');
        return M.coverInsets(map, {
            sheet: SHEET_MQ.matches,
            dock: dockRect || layoutRect($('#c4Dock')),
            drawer: S.drawer && drawer.classList.contains('open') ? layoutRect(drawer) : null,
            kpi: kpi.offsetParent ? kpi.getBoundingClientRect() : null,
            avoid: hudRects()
        });
    }
    // send the covered map area to the scene when it changed (force = send even if equal, e.g. right after mount)
    function pushInsets(force, dockRect) {
        let ins = currentInsets(dockRect);
        const css = document.documentElement.style, prev = [css.getPropertyValue('--ins-r'), css.getPropertyValue('--ins-b'), css.getPropertyValue('--kpi-b')].join();
        css.setProperty('--ins-r', ins.right + 'px');
        css.setProperty('--ins-b', ins.bottom + 'px');
        css.setProperty('--kpi-b', ins.top + 'px');
        // the HUD boxes are placed BY these variables (map controls under the KPI bar, banner above the sheet): when they
        // moved, measure again so the `avoid` rects describe where the boxes are now, not where they were
        if ([ins.right + 'px', ins.bottom + 'px', ins.top + 'px'].join() !== prev) ins = currentInsets(dockRect);
        if (!force && M.sameInsets(ins, S.insets)) return;
        S.insets = ins;
        if (S.scene && typeof S.scene.setInsets === 'function') { try { S.scene.setInsets(ins); } catch (e) { console.warn('C4 Live: setInsets failed', e); } }
    }
    let insRaf = 0;
    function queueInsets() { if (S.dock.anim || insRaf) return; insRaf = requestAnimationFrame(() => { insRaf = 0; pushInsets(false); }); }
    function wireDock() {
        let w = 440, c = false;
        try { w = +localStorage.getItem('c4.dock.w') || 440; c = localStorage.getItem('c4.dock.collapsed') === '1'; } catch (e) { /* private mode */ }
        setDockWidth(w, false);
        if (c) { S.dock.collapsed = true; $('#c4Dock').classList.add('collapsed'); $('#c4DockToggle').setAttribute('aria-expanded', 'false'); $('#c4DockToggle').title = 'Show the panel (D)'; }
        const dock = $('#c4Dock');
        dock.addEventListener('transitionend', e => { if (e.target === dock && /width|height|transform/.test(e.propertyName)) { S.dock.anim = false; pushInsets(false); } });
        $('#c4Drawer').addEventListener('transitionend', e => { if (e.target.id === 'c4Drawer' && e.propertyName === 'transform') pushInsets(false); });
        // the HUD boxes too: their size feeds the scene's `avoid` rects (renderControls / renderAge / the ship hint also
        // queue an update, since a child of a full-width container can change size without the container doing so)
        if (window.ResizeObserver) { const ro = new ResizeObserver(queueInsets); [$('#c4Map'), dock, $('#c4Kpis'), $('#c4Controls'), $('.c4-brand'), $('#c4Age'), $('#c4ShipHint')].forEach(el => el && ro.observe(el)); }
        // tab fit: the dock box (its size never depends on the labels, so shedding one cannot loop the observer), then
        // once more when the web fonts land (Orbitron is wider than the fallback)
        if (window.ResizeObserver) new ResizeObserver(fitTabs).observe(dock);
        window.addEventListener('resize', fitTabs);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTabs, () => {});
        fitTabs();
        window.addEventListener('resize', () => { setDockWidth(S.dock.w, false); queueInsets(); });
        if (SHEET_MQ.addEventListener) SHEET_MQ.addEventListener('change', () => pushInsets(false));
        // drag the dock's left edge to resize (desktop only)
        const grip = $('#c4DockGrip');
        grip.addEventListener('pointerdown', e => {
            if (S.dock.collapsed || SHEET_MQ.matches) return;
            e.preventDefault(); grip.setPointerCapture(e.pointerId); dock.classList.add('resizing');
            const move = ev => { setDockWidth(window.innerWidth - EDGE - ev.clientX, false); queueInsets(); };
            const up = () => { grip.removeEventListener('pointermove', move); grip.removeEventListener('pointerup', up); grip.removeEventListener('pointercancel', up); dock.classList.remove('resizing'); setDockWidth(S.dock.w, true); pushInsets(false); };
            grip.addEventListener('pointermove', move); grip.addEventListener('pointerup', up); grip.addEventListener('pointercancel', up);
        });
    }
    function renderTab(tab, animate) {
        if (!S.D) return;
        const el = $('#sec-' + tab);
        if (!S.rendered[tab]) { ({ mining: renderMining, combat: renderCombat, fleets: renderFleets, owners: renderOwners, dacs: renderDacs })[tab](el); S.rendered[tab] = true; }
        if (animate) animateIn(el);
    }
    const card = (cls, i, title, sub, body) => `<div class="c4-card ${cls}" style="--i:${i}"><h3>${title}</h3>${sub ? `<p class="sub">${sub}</p>` : ''}${body}</div>`;
    const note = html => `<div class="c4-note">${html}</div>`;
    function bars(rows, opt) {
        opt = opt || {};
        const max = opt.max || Math.max(...rows.map(r => r.v), 0) || 1;
        return `<div class="c4-bars">${rows.map((r, i) => `<div class="c4-bar${r.click ? ' click' : ''}${r.on ? ' on' : ''}" style="--i:${i}"${r.click ? ` ${r.click}` : ''}${r.tip ? ` data-tip="${esc(r.tip)}"` : ''}>
            <span class="lab" title="${esc(r.labText || '')}">${r.lab}</span>
            <span class="trk">${(r.parts || [{ v: r.v, c: r.c }]).map(p => `<i style="--w:${Math.max(p.v > 0 ? 0.6 : 0, 100 * p.v / max)}%;${p.c ? `--c:${p.c}` : ''}"></i>`).join('')}</span>
            <span class="val">${r.val}</span>${r.extra || ''}</div>`).join('')}</div>`;
    }

    // ================================================================== Mining
    function renderMining(el) {
        const m = S.D.mining;
        if (!m.ups) { el.innerHTML = `<p class="c4-verdict">${S.D.verdicts.mining}</p>`; return; }
        const top = m.resources.slice(0, RES_ROWS);
        const rest = m.resources.slice(RES_ROWS);
        const rows = top.map(r => ({ lab: esc(r.r), labText: r.r, v: r.ups, val: `${M.fmt(r.ups)}<em>${M.pct(r.share)}</em>`, extra: `<span class="live" data-live-ups="${r.ups}">0</span>` }));
        if (rest.length) { const u = rest.reduce((s, r) => s + r.ups, 0); rows.push({ lab: `${rest.length} other resources`, labText: rest.map(r => r.r).join(', '), v: u, c: 'var(--text-dim)', val: `${M.fmt(u)}<em>${M.pct(u / m.ups)}</em>`, extra: `<span class="live" data-live-ups="${u}">0</span>` }); }
        const res = `<div class="c4-res"><div class="c4-res-head"><span>Resource</span><span></span><span>u/s, share</span><span>Projected</span></div>${bars(rows)}</div>`;

        // v3: the main resource sits under the asteroid's system (two-line cell) so the table fits the dock column
        const astRows = m.asteroids.slice(0, 12).map(a => `<tr data-ast="${esc(a.a)}"><td class="l c2"><b>${esc(a.sysName)}</b><small>${esc(a.topRes)} ${M.pct(a.topResShare)}</small></td><td class="n">${a.fleets}</td><td class="n">${a.ownerCount}</td><td class="n">${M.fmt(a.ups)}</td></tr>`).join('');
        const ast = `<div class="c4-tw"><table class="c4-table c4-fit"><thead><tr><th title="asteroid's system / its main resource">Asteroid / resource</th><th>Fleets</th><th>Owners</th><th>u/s</th></tr></thead><tbody>${astRows}</tbody></table></div>`;

        const ownRows = m.owners.filter(o => !o.npc).slice(0, 10).map(o => ({ lab: `${fa(o.group)} <span class="addr">${ownerLabel(o.p)}</span>`, labText: ownerPlain(o.p) + ' - ' + o.p, v: o.ups, val: `${M.fmt(o.ups)}<em>${M.pct(o.ups / m.ups)}</em>`, click: `data-owner="${esc(o.p)}"` }));
        const fltRows = m.fleets.slice(0, 10).map(x => ({ lab: esc(x.f.n || M.shortAddr(x.f.a)), labText: `${x.f.n} - owner ${ownerPlain(x.f.o)} (${x.f.o})`, v: x.ups, val: `${M.fmt(x.ups)}<em>${M.pct(x.ups / m.ups)}</em>`, click: `data-owner="${esc(x.f.o)}" data-fx="${x.f.x}" data-fy="${x.f.y}"` }));

        el.innerHTML = `<p class="c4-verdict">${S.D.verdicts.mining}</p><div class="c4-grid">
            ${card('w8', 0, 'Live output by resource', `${m.resources.length} resources from ${m.miningFleets} fleets; the right column ticks at the current rate.`, res)}
            ${card('w4', 1, 'How concentrated', `Cumulative share of output by owners, largest first. Hover to read any point.`, lorenz(m))}
            ${card('w6', 2, 'Top asteroids', `${m.asteroids.length} asteroids are being mined. Click one for who mines it.`, ast)}
            ${card('w6', 3, 'Mined, settled on chain', 'Asteroid counters diffed over each run, scaled to an approximate hourly rate. Counters move only when a fleet\'s mining settles, so this lags the live rate.', minedChart())}
            ${card('w6', 4, 'Top mining owners', `${m.miningOwners} owners mine. Click for the owner.`, bars(ownRows))}
            ${card('w6', 5, 'Top mining fleets', 'Click to fly there and open the owner.', bars(fltRows))}
        </div>`;
    }
    // cumulative share curve (owners ranked by output); hover crosshair
    function lorenz(m) {
        const v = m.owners.map(o => o.ups); const n = v.length; if (!n) return note('No miners.');
        const W = 320, H = 200, L = 34, B = 22, T = 8, R = 8;
        let acc = 0; const pts = [[0, 0]]; v.forEach((u, i) => { acc += u; pts.push([i + 1, acc / m.ups]); });
        const X = i => L + (W - L - R) * i / n, Y = s => T + (H - T - B) * (1 - s);
        const d = pts.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1)).join(' ');
        const len = Math.round(pts.reduce((s, p, i) => i ? s + Math.hypot(X(p[0]) - X(pts[i - 1][0]), Y(p[1]) - Y(pts[i - 1][1])) : 0, 0));
        const k10 = Math.min(10, n);
        const grid = [0, 0.25, 0.5, 0.75, 1].map(s => `<line class="gl" x1="${L}" x2="${W - R}" y1="${Y(s)}" y2="${Y(s)}"/><text x="${L - 5}" y="${Y(s) + 4}" text-anchor="end">${s * 100}%</text>`).join('');
        return `<svg class="c4-svg" viewBox="0 0 ${W} ${H}" data-lorenz='${JSON.stringify(pts.map(p => +p[1].toFixed(4)))}' data-x0="${L}" data-x1="${W - R}" data-n="${n}">
            <defs><linearGradient id="c4gradA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fd8ff" stop-opacity="0.28"/><stop offset="1" stop-color="#4fd8ff" stop-opacity="0"/></linearGradient></defs>
            ${grid}<line class="ax" x1="${L}" x2="${W - R}" y1="${Y(0)}" y2="${Y(0)}"/>
            <path class="ar" d="${d} L${X(n)} ${Y(0)} L${X(0)} ${Y(0)} Z"/><path class="ln" d="${d}" style="--len:${len}"/>
            <circle class="mk" cx="${X(k10)}" cy="${Y(pts[k10][1])}" r="4"/><text x="${X(k10) + 7}" y="${Y(pts[k10][1]) + 12}" style="fill:#fff">top ${k10}</text>
            <text x="${L}" y="${H - 5}">1</text><text x="${W - R}" y="${H - 5}" text-anchor="end">${n} owners</text>
            <line class="xh" y1="${T}" y2="${Y(0)}" x1="-10" x2="-10"/><rect class="hit" x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}"/></svg>`;
    }
    function minedChart() {
        const s = S.D.series;
        if (!s.points.length) return note(`Settled mining starts after the next run: it needs two snapshots to diff, and there ${s.runs === 1 ? 'is <b>1</b>' : `are <b>${s.runs}</b>`} so far.`);
        const W = 420, H = 170, L = 40, B = 22, T = 10, R = 4;   // sized for the dock column (v2)
        const max = Math.max(...s.points.map(p => p.perHour)) || 1;
        const bw = Math.min(40, (W - L - R) / s.points.length - 4);
        const cols = s.points.map((p, i) => {
            const x = L + (W - L - R) * (i + 0.5) / s.points.length - bw / 2, h = (H - T - B) * p.perHour / max;
            const tip = `${new Date(p.t * 1000).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}\nabout ${M.fmt(p.perHour, 0)} units/h\n${M.fmt(p.units, 0)} settled over ${M.ago(p.dtSec)}`;
            return `<g class="col" data-tip="${esc(tip)}"><rect class="colr" style="--i:${i}" x="${x.toFixed(1)}" y="${(H - B - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0, h).toFixed(1)}" rx="3" fill="var(--cyan)"/><rect class="hit" x="${x - 2}" y="${T}" width="${bw + 4}" height="${H - T - B}"/></g>`;
        }).join('');
        const grid = [0, 0.5, 1].map(f => `<line class="gl" x1="${L}" x2="${W - R}" y1="${T + (H - T - B) * (1 - f)}" y2="${T + (H - T - B) * (1 - f)}"/><text x="${L - 5}" y="${T + (H - T - B) * (1 - f) + 4}" text-anchor="end">${M.fmt(max * f, 0)}</text>`).join('');
        const one = s.points.length === 1 ? '<p class="sub" style="margin-top:0.4rem">One interval so far; a trend needs more runs.</p>' : '';
        return `<svg class="c4-svg" viewBox="0 0 ${W} ${H}">${grid}<line class="ax" x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}"/>${cols}<text x="${L}" y="${H - 5}">approx. units per hour, per run</text></svg>${one}`;
    }

    // ================================================================== Combat
    function renderCombat(el) {
        const c = S.D.combat, t0 = S.latest.generatedAt;
        // hourly timeline: stacked fleet / starbase
        const W = 440, H = 170, L = 26, B = 22, T = 8, R = 4;   // sized for the dock column (v2)
        const max = Math.max(1, ...c.hours.map(h => h.fleet + h.starbase));
        const bw = (W - L - R) / 24 - 3;
        const cols = c.hours.map((h, i) => {
            const x = L + i * (W - L - R) / 24 + 1.5, sc = (H - T - B) / max;
            const hf = h.fleet * sc, hs = h.starbase * sc, gap = hf && hs ? 2 : 0;
            const hm = s => new Date(s * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const tip = `${hm(h.start)} - ${hm(h.start + 3600)}\n${h.fleet} fleet${h.fleet === 1 ? '' : 's'} in combat\n${h.starbase} starbase event${h.starbase === 1 ? '' : 's'}`;
            return `<g class="col" data-tip="${esc(tip)}">${hf ? `<rect class="colr" style="--i:${i}" x="${x.toFixed(1)}" y="${(H - B - hf).toFixed(1)}" width="${bw.toFixed(1)}" height="${hf.toFixed(1)}" rx="2" fill="var(--s-fleet)"/>` : ''}${hs ? `<rect class="colr" style="--i:${i}" x="${x.toFixed(1)}" y="${(H - B - hf - gap - hs).toFixed(1)}" width="${bw.toFixed(1)}" height="${hs.toFixed(1)}" rx="2" fill="var(--s-sb)"/>` : ''}<rect class="hit" x="${x.toFixed(1)}" y="${T}" width="${(bw + 3).toFixed(1)}" height="${H - T - B}"/></g>`;
        }).join('');
        const ticks = [0, 6, 12, 18, 23].map(i => `<text x="${L + i * (W - L - R) / 24 + bw / 2}" y="${H - 6}" text-anchor="middle">${i === 23 ? 'last h' : '-' + (24 - i) + ' h'}</text>`).join('');
        const grid = [0, 0.5, 1].map(f => `<line class="gl" x1="${L}" x2="${W - R}" y1="${T + (H - T - B) * (1 - f)}" y2="${T + (H - T - B) * (1 - f)}"/><text x="${L - 5}" y="${T + (H - T - B) * (1 - f) + 4}" text-anchor="end">${Math.round(max * f)}</text>`).join('');
        const timeline = `<div class="c4-legend"><span><i style="background:var(--s-fleet)"></i>Fleets in combat</span><span><i style="background:var(--s-sb)"></i>Starbase combat / capture</span></div>
            <svg class="c4-svg" viewBox="0 0 ${W} ${H}">${grid}<line class="ax" x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}"/>${cols}${ticks}</svg>`;

        const feed = `<ul class="c4-feed" id="c4Feed">${c.feed.slice(0, 80).map((e, i) => feedItem(e, i, t0)).join('')}</ul>`;
        const players = c.engagedOwners.filter(o => o.group !== 'npc');
        const npcFights = c.engagedOwners.filter(o => o.group === 'npc').reduce((s, o) => s + o.count, 0);
        const eventsMissing = (S.loadErr || []).includes('events.json');
        const engaged = players.length ? bars(players.slice(0, 8).map(o => ({ lab: `${fa(o.group)} <span class="addr">${ownerLabel(o.o)}</span>`, labText: ownerPlain(o.o) + ' - ' + o.o, v: o.count, c: 'var(--s-fleet)', val: `${o.count}<em>${o.fleets} fleet${o.fleets === 1 ? '' : 's'}</em>`, click: `data-owner="${esc(o.o)}"` })))
            + (npcFights ? `<p class="sub" style="margin:0.6rem 0 0">NPC fleets (all on one shared profile) add <b>${npcFights}</b> participations.</p>` : '') : note('No player fleet in combat on record.');
        const deadLi = f => `<li data-owner="${esc(f.o)}" data-fx="${f.x}" data-fy="${f.y}"><span class="l">${fa(M.groupOf(f))} ${esc(f.n || M.shortAddr(f.a))} <em style="color:var(--text-muted);font-style:normal">${ownerName(f.o, f.npc)}</em></span><span class="n">${f.ships} ship${f.ships === 1 ? '' : 's'}</span></li>`;
        const goneLi = e => `<li data-owner="${esc(e.o)}" data-fx="${e.x}" data-fy="${e.y}"><span class="l">${fa(M.eventGroup(e))} ${esc(e.n || M.shortAddr(e.f))} <span class="c4-st ${e.afterCombat ? 'st-destroyed' : ''}">${e.afterCombat ? 'probable kill' : 'closed'}</span></span><span class="n">${agoSpan(e.t)}</span></li>`;
        const dead = (c.destroyedNow.length ? `<ul class="c4-list">${c.destroyedNow.slice(0, 14).map(deadLi).join('')}</ul>` : note('No fleet is in the destroyed state.'))
            + (c.goneAll.length ? `<div class="c4-dsec" style="margin-top:0.8rem"><span>Accounts closed between runs</span></div><ul class="c4-list">${c.goneAll.slice(0, 10).map(goneLi).join('')}</ul>` : '');
        const selfNote = c.pairsAll.selfPairs ? `<p class="sub" style="margin:0.5rem 0 0">${c.pairsAll.selfPairs} pairing${c.pairsAll.selfPairs === 1 ? '' : 's'} between fleets of the same owner (for NPCs: the one shared NPC profile) are left out of this list; the matrix diagonal still counts them.</p>` : '';
        const pairs = (c.pairsAll.pairings.length ? `<ul class="c4-list">${c.pairsAll.pairings.slice(0, 10).map(p => `<li data-fx="${p.x}" data-fy="${p.y}" data-tip="${esc(`${M.sideLabel(p.a, S.ident)}: ${p.a.names.join(', ')}\n${M.sideLabel(p.b, S.ident)}: ${p.b.names.join(', ')}`)}"><span class="l">${sideHtml(p.a)} <em style="color:var(--text-muted);font-style:normal">vs</em> ${sideHtml(p.b)}${p.same ? ' <span class="c4-st">same faction</span>' : ''}</span><span class="n">${p.count}</span></li>`).join('')}</ul>`
            : note('No combat event carries a likely opponent yet; seed events from the first run never do.')) + selfNote;
        const sbs = c.starbases.length ? `<ul class="c4-list">${c.starbases.slice(0, 12).map(s => `<li data-sys="${esc(s.sys)}" data-fx="${s.x}" data-fy="${s.y}"><span class="l">${fa(s.fa)} ${esc(s.n)}${s.captures ? ` <span class="c4-st st-destroyed">captured</span>` : ''}</span><span class="n">${agoSpan(s.last)}</span></li>`).join('')}</ul>
            <p class="sub" style="margin:0.5rem 0 0">${c.starbases.length} starbases have a combat record; ${c.captured} capture${c.captured === 1 ? '' : 's'} seen.</p>` : note('No starbase combat recorded.');
        // hot spots: the same rule as the map's combat callouts (M.combatHotSpots), so both name the same places
        const hs = c.hotSpots.slice(0, 8);
        const hotCard = hs.length ? bars(hs.map(h => ({ lab: esc(h.name), labText: h.name, v: h.n, c: 'var(--s-fleet)', val: `${h.n}<em>${agoSpan(h.last)}</em>`,
            click: h.sys ? `data-enter-system="${esc(h.sys)}"` : `data-fx="${h.x}" data-fy="${h.y}"`, tip: `${h.name}\n${h.n} combat event${h.n === 1 ? '' : 's'} in 24 h\n${h.sys ? 'click to enter the system' : 'no system within 1.2 units; click to fly there'}` })))
            + (c.hotSpots.length > hs.length ? `<p class="sub" style="margin:0.5rem 0 0">${c.hotSpots.length - hs.length} more places had combat.</p>` : '')
            : note('No combat in the 24 h before the snapshot.');
        el.innerHTML = `<p class="c4-verdict">${S.D.verdicts.combat}</p><div class="c4-grid">
            ${card('w8', 0, 'Combat by hour', 'The 24 hours before the snapshot, chain timestamps. Hover a column.', timeline)}
            ${card('w4', 0, 'Hot spots, 24 h', 'Each event counts at the nearest system within 1.2 map units (else a deep-space cell), as on the map. Click to go there.', hotCard)}
            ${card('w4', 1, 'Faction vs faction (likely)', 'Fleets stamped with the same combat second. The chain keeps no attacker record, and allies can share a stamp.', matrix(c.pairsAll))}
            ${card('w6', 2, 'Live feed', `Newest first, ${M.fmt(c.total, 0)} combat events on file. Click one to fly there. <span class="c4-seed">first seen</span> = found on a fleet's first sighting, so no before-values.`, eventsMissing ? note('events.json could not be loaded.') : feed)}
            ${card('w6', 3, 'Likely pairings', 'Owner against owner, from fleets stamped in the same combat second. Hover for fleet names.', pairs)}
            ${card('w6', 4, 'Most engaged players', 'Combat participations per owner across the event file.', engaged)}
            ${card('w6', 5, 'Destroyed fleets', `At least ${c.destroyedNow.length} fleets are in the destroyed state now. Closed accounts are listed apart: closing right after combat is a probable kill, not a confirmed one.`, dead)}
            ${card('w12', 6, 'Starbases under fire', 'Most recent first. Click for the starbase.', sbs)}
        </div>`;
    }
    function feedItem(e, i, t0) {
        const g = M.eventGroup(e);
        const vs = Array.isArray(e.vs) && e.vs.length ? ` vs ${e.vs.slice(0, 2).map(v => v.n || M.shortAddr(v.f)).join(', ')}${e.vs.length > 2 ? ` +${e.vs.length - 2}` : ''} (likely)` : '';
        const what = e.k === 'combat' ? (e.dead ? 'in combat, left at 0 hp' : e.dmg ? 'in combat, took damage' : 'took part in combat') + vs
            : e.k === 'destroyed' ? 'destroyed' : e.k === 'gone' ? (e.afterCombat ? 'account closed after combat (probable kill)' : 'account closed')
            : e.k === 'starbaseCombat' ? 'starbase under fire' : e.k === 'captured' ? 'starbase captured' : e.k === 'newFleet' ? 'new fleet' : e.k;
        const hp = e.hp1 != null && e.hpMax ? Math.max(0, Math.min(1, e.hp1 / e.hpMax)) : null;
        const hpb = hp != null ? `<span class="hpb${hp < 0.35 ? ' low' : ''}" title="hull ${M.fmt(e.hp1, 0)} / ${M.fmt(e.hpMax, 0)}"><b style="--w:${(hp * 100).toFixed(0)}%"></b></span>` : '';
        const who = e.o ? ownerName(e.o, e.npc) : '';
        const fresh = S.fresh && S.fresh.has(evKey(e));
        return `<li class="k-${esc(e.k)}${fresh ? ' fresh' : ''}" style="--i:${Math.min(i, 16)}" data-ev="${i}" data-fx="${e.x}" data-fy="${e.y}" ${e.o ? `data-owner="${esc(e.o)}"` : ''} ${e.sys ? `data-sys="${esc(e.sys)}"` : ''}>
            <i></i><span><span class="f1">${esc(e.n || '')} ${hpb}${e.seed ? '<span class="c4-seed">first seen</span>' : ''}</span><span class="f2">${fa(g)} ${esc(what)}${who ? ' - ' + who : ''}</span></span>
            <span class="tm">${agoSpan(e.t)}</span></li>`;
    }
    function matrix(p) {
        const G = M.GROUPS;
        const max = Math.max(1, ...G.flatMap(a => G.map(b => p.matrix[a][b])));
        const cells = G.map(a => `<div class="h">${esc(M.GROUP_LABEL[a])}</div>` + G.map(b => { const v = p.matrix[a][b]; return `<div class="c${v ? '' : ' z'}" style="--a:${v ? (0.18 + 0.7 * v / max).toFixed(2) : 0.03}" data-tip="${esc(`${M.GROUP_LABEL[a]} with ${M.GROUP_LABEL[b]}${a === b ? ' (may be allies)' : ''}\n${v} likely pairing${v === 1 ? '' : 's'}`)}">${v || '·'}</div>`; }).join('')).join('');
        return `<div class="c4-mx" style="grid-template-columns: 4.2rem repeat(${G.length}, 1fr)"><div class="h"></div>${G.map(g => `<div class="h">${esc(M.GROUP_LABEL[g])}</div>`).join('')}${cells}</div>
            <p class="sub" style="margin:0.6rem 0 0"><b>${p.linked}</b> of ${p.linked + p.unlinked} combat participations carry a likely opponent; seed events from the first run never do.</p>`;
    }

    // ================================================================== Fleets
    function renderFleets(el) {
        const fl = S.D.fleetsView;
        const stRows = M.STATES.filter(k => fl.byState[k] && (fl.byState[k].player + fl.byState[k].npc)).map(k => {
            const b = fl.byState[k], n = b.player + b.npc;
            return { lab: st(k), labText: k, v: n, parts: [{ v: b.player, c: 'var(--s-fleet)' }, { v: b.npc, c: 'var(--npc)' }], val: `${M.fmt(n, 0)}<em>${M.pct(n / fl.n)}</em>`, click: `data-state="${k}"`, on: S.states && S.states[0] === k, tip: `${M.STATE_LABEL[k]}\n${b.player} player, ${b.npc} NPC fleets` };
        });
        const gRows = Object.entries(fl.byGroup).sort((a, b) => b[1].ships - a[1].ships).map(([g, b]) => ({ lab: fa(g), labText: g, v: b.ships, c: 'var(--fc)', val: `${M.fmt(b.ships, 0)}<em>${M.fmt(b.fleets, 0)} fleets</em>`, click: `data-filter="${g}"`, tip: `${M.GROUP_LABEL[g] || g}\n${b.fleets} fleets, ${b.ships} ships, ${b.mining} mining` }));
        const sRows = M.SIZES.filter(s => fl.size[s]).map(s => ({ lab: esc(s), v: fl.size[s], val: `${M.fmt(fl.size[s], 0)}<em>${M.pct(fl.size[s] / fl.ships)}</em>` }));
        el.innerHTML = `<p class="c4-verdict">${S.D.verdicts.fleets}</p><div class="c4-grid">
            ${card('w4', 0, 'What fleets are doing', 'Click a state to show only those fleets on the map.', `<div class="c4-legend"><span><i style="background:var(--s-fleet)"></i>Player</span><span><i style="background:var(--npc)"></i>NPC</span></div>${bars(stRows)}`)}
            ${card('w4', 1, 'Ships by faction', 'Click a faction to filter the whole page.', `<div class="gfac">${bars(gRows)}</div>`)}
            ${card('w4', 2, 'Ship size classes', `${M.fmt(fl.ships, 0)} ships by hull class.`, bars(sRows))}
            ${card('w12', 3, 'Fleet table', '', `<div class="c4-tools"><input class="c4-search" id="c4FleetQ" type="search" placeholder="Search fleet name, owner name or address" value="${esc(S.fleetQ)}" spellcheck="false"><span class="cnt" id="c4FleetCnt"></span></div><div id="c4FleetTable"></div>`)}
        </div>`;
        // faction bars use the faction colour
        el.querySelectorAll('.gfac .c4-bar').forEach((b, i) => { const g = gRows[i] && gRows[i].labText; if (g) b.classList.add('fc-' + g); });
        renderFleetTable();
    }
    function renderFleetTable() {
        const box = $('#c4FleetTable'); if (!box) return;
        const q = S.fleetQ.trim().toLowerCase();
        let list = S.D.fleets;
        if (q) list = list.filter(f => (f.n || '').toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || (f.o || '').toLowerCase().includes(q) || (!f.npc && nameLc(f.o).includes(q)));
        const [key, dir] = S.fleetSort;
        const val = { name: f => (f.n || '').toLowerCase(), ships: f => f.ships || 0, ups: f => M.fleetUps(f), hp: f => f.hpMax ? f.hp / f.hpMax : 0, lc: f => f.lc || 0, state: f => f.s.kind };
        list = list.slice().sort((a, b) => { const x = val[key](a), y = val[key](b); return (x < y ? -1 : x > y ? 1 : 0) * dir; });
        $('#c4FleetCnt').textContent = `${list.length} of ${S.D.fleets.length} fleets`;
        const t0 = S.latest.generatedAt;
        // v3: sized for the dock column. Owner sits under the fleet name and the state under the faction (two-line cells),
        // so the table fits 360-720 px without a horizontal scroll; the long fleet name ellipsises with a tooltip.
        const th = (k, l, cls, tip) => `<th data-sort="${k}" class="${cls || ''}${key === k ? ' sorted' : ''}"${tip ? ` title="${tip}"` : ''}>${l}${key === k ? (dir < 0 ? ' ▾' : ' ▴') : ''}</th>`;
        box.innerHTML = `<div class="c4-tw"><table class="c4-table c4-fit" data-table="fleets"><thead><tr>${th('name', 'Fleet / owner', 'l')}${th('state', 'Faction / state', 'l')}${th('ships', 'Ships')}${th('hp', 'Hull', 'opt2', 'hull points left')}${th('ups', 'u/s', '', 'mining units per second')}${th('lc', 'Fought', 'opt2', 'last combat')}</tr></thead><tbody>
            ${list.slice(0, S.fleetLimit).map(f => `<tr data-owner="${esc(f.o)}" data-fx="${f.x}" data-fy="${f.y}"><td class="l c2"><b class="nm" title="${esc(f.n || f.a)}">${esc(f.n || M.shortAddr(f.a))}</b><small class="addr">${ownerName(f.o, f.npc)}</small></td><td class="l c2">${fa(M.groupOf(f))}<small>${st(f.s.kind)}</small></td><td class="n">${f.ships}</td><td class="n opt2">${f.hpMax ? M.pct(f.hp / f.hpMax) : '-'}</td><td class="n">${M.fleetUps(f) ? M.fmt(M.fleetUps(f)) : '-'}</td><td class="tm opt2">${f.lc ? agoSpan(f.lc) : 'never'}</td></tr>`).join('')}
            </tbody></table></div>${list.length > S.fleetLimit ? `<button class="c4-more" data-more="fleets">Show ${Math.min(100, list.length - S.fleetLimit)} more</button>` : ''}`;
    }

    // ================================================================== Owners
    function renderOwners(el) {
        el.innerHTML = `<p class="c4-verdict">${S.D.verdicts.owners}</p><div class="c4-grid">
            ${card('w12', 0, 'Owner leaderboard', 'Players only (NPC fleets share one owner, shown in the Combat and Fleets tabs). Click a column to sort, a row for the owner. Names are the players\' own on-chain names and are not unique, so every tooltip carries the profile address. Wealth is a mainnet reference value (best bids), not a z.ink price.', `<div class="c4-tools"><input class="c4-search" id="c4OwnerQ" type="search" placeholder="Filter by name or profile address" spellcheck="false"><span class="cnt" id="c4OwnerCnt"></span></div><div id="c4OwnerTable"></div>`)}
        </div>`;
        renderOwnerTable();
    }
    function renderOwnerTable() {
        const box = $('#c4OwnerTable'); if (!box) return;
        const q = ($('#c4OwnerQ') || {}).value ? $('#c4OwnerQ').value.trim().toLowerCase() : '';
        let list = S.D.players;
        if (q) list = list.filter(o => o.p.toLowerCase().includes(q) || M.cleanName(o.name).toLowerCase().includes(q));
        const [key, dir] = S.ownerSort;
        const val = { fleets: o => o.fleets, ships: o => o.ships, ups: o => o.ups, atlas: o => o.atlas || 0, rank: o => o.rank != null ? o.rank : -1, xp: o => o.xpTotal, stakes: o => o.stakes, wealth: o => o.refBid != null ? o.refBid : -1 };
        list = list.slice().sort((a, b) => (val[key](a) - val[key](b)) * dir || b.ships - a.ships);
        $('#c4OwnerCnt').textContent = `${list.length} of ${S.D.players.length} players`;
        // v3: sized for the dock column (the v2 table ran 690 px wide in a 383 px dock and was cut at its edge): the
        // faction sits under the address, headers are short with the full name as a tooltip, and the list position and
        // council rank columns show only when the dock is wide enough (container query on the dock body)
        const th = (k, l, tip, cls) => `<th data-sort="${k}" class="${cls || ''}${key === k ? ' sorted' : ''}" title="${tip}">${l}${key === k ? (dir < 0 ? ' ▾' : ' ▴') : ''}</th>`;
        box.innerHTML = `<div class="c4-tw"><table class="c4-table c4-fit" data-table="owners"><thead><tr><th class="l opt">#</th><th class="l">Owner</th>${th('fleets', 'Fleets', 'fleets')}${th('ships', 'Ships', 'ships')}${th('ups', 'u/s', 'mining units per second')}${th('atlas', 'ATLAS', 'ATLAS balance', 'opt2')}${th('rank', 'Rank', 'council rank', 'opt')}${th('xp', 'XP', 'total XP, all careers', 'opt')}${th('wealth', 'Wealth', 'mainnet REFERENCE value of the hulls and cargo at best bids, in ATLAS (z.ink items priced like the same-named Solana mainnet item)')}${th('stakes', 'Stakes', 'claim stakes', 'opt')}</tr></thead><tbody>
            ${list.slice(0, S.ownerLimit).map((o, i) => `<tr data-owner="${esc(o.p)}"><td class="l opt">${i + 1}</td><td class="l c2"><b class="addr">${ownerLabel(o.p)}</b><small>${fa(o.group)}${walletChip(o.wallet, true)}</small></td><td class="n">${o.fleets}</td><td class="n">${o.ships}</td><td class="n">${o.ups ? M.fmt(o.ups) : '-'}</td><td class="n opt2">${o.atlas != null ? M.fmt(o.atlas, 0) : '-'}</td><td class="n opt">${o.rank != null ? o.rank : '-'}</td><td class="n opt">${M.fmt(o.xpTotal, 0)}</td><td class="n wl"${o.refBid != null ? ` title="${esc(`Mainnet reference: ${M.rangeText({ lo: Math.min(o.refBid, o.refAsk != null ? o.refAsk : o.refBid), hi: Math.max(o.refBid, o.refAsk != null ? o.refAsk : o.refBid) })} (bids ${M.fmt(o.refBid, 0)}, asks ${o.refAsk != null ? M.fmt(o.refAsk, 0) : '-'})`)}"` : ''}>${o.refBid != null ? M.fmt(o.refBid, 0) : '-'}</td><td class="n opt">${o.stakes || '-'}</td></tr>`).join('')}
            </tbody></table></div>${list.length > S.ownerLimit ? `<button class="c4-more" data-more="owners">Show ${Math.min(100, list.length - S.ownerLimit)} more</button>` : ''}`;
    }

    // ================================================================== DACs (2026-11-07, hand-kept list + example preview)
    async function loadDacs() {
        let j = null, why = '';
        try {
            const r = await fetch('dacs.json?t=' + Date.now(), { cache: 'no-store' });
            if (!r.ok) why = 'dacs.json ' + r.status; else j = await r.json();
        } catch (e) { why = 'dacs.json could not be read (' + (e && e.message) + ')'; }
        const p = j ? M.parseDacs(j) : null;
        if (!p || !p.ok) {
            S.dac.state = 'off'; S.dac.list = []; S.dac.why = why || (p && p.errors[0]) || 'invalid';
            console.info('C4 Live: DACs hidden - ' + S.dac.why);
        } else {
            S.dac.state = 'ok'; S.dac.list = p.dacs; S.dac.errors = p.errors; S.dac.note = p.note;
            if (p.errors.length) console.info('C4 Live: dacs.json - ' + p.errors.join('; '));
        }
        S.dac.cache = null;
        applyDacState();
    }
    function applyDacState() {
        const on = S.dac.state === 'ok';
        const tb = $('.c4-tab[data-tab="dacs"]'); if (tb) tb.hidden = !on;
        if (!on && S.tab === 'dacs') setTab('mining');
        if (!on) { S.dac.lens.on = false; S.dac.lens.scope = null; }
        S.rendered.dacs = false;
        if (on && S.tab === 'dacs' && S.view === 'tab') renderTab('dacs', false);
        renderDacBanner(); pushDacs(); fitTabs(); renderControls();
    }
    // the derived views: real = the file as matched to this snapshot; shown = what the DACs tab draws (real, or the
    // example when the preview is on). Rebuilt when the snapshot, the toggle or the list changes.
    function dacData() {
        if (S.dac.state !== 'ok' || !S.latest || !S.all) return null;
        const c = S.dac.cache;
        if (!c || c.latest !== S.latest || c.events !== S.events || c.all !== S.all || c.ex !== S.dac.example || c.list !== S.dac.list) {
            const real = M.resolveDacs(S.latest, S.dac.list);
            const shown = S.dac.example ? M.resolveDacs(S.latest, M.exampleDacs(S.latest, S.dac.list)) : real;
            S.dac.cache = { latest: S.latest, events: S.events, all: S.all, ex: S.dac.example, list: S.dac.list, real, shown, rows: M.dacSummary(S.latest, shown.dacs, S.all.owners) };
        }
        return S.dac.cache;
    }
    function pushDacs() {
        if (!S.scene || typeof S.scene.setDacs !== 'function') return;
        const d = dacData();
        const L0 = S.dac.lens;
        try { S.scene.setDacs({ dacs: d ? d.shown.dacs.map(x => ({ tag: x.tag, color: x.color, members: x.profiles.slice() })) : [], example: !!(d && S.dac.example), focus: S.dac.focus,
            lens: { on: !!(d && L0.on), metrics: L0.metrics.slice(), scope: L0.scope } }); }
        catch (e) { console.warn('C4 Live: setDacs failed', e); }
    }
    // the conquest result for the current lens (M.dacConquest, the rule the scene paints), cached per snapshot + lens
    function dacConquestNow() {
        const d = dacData(); if (!d) return null;
        const L0 = S.dac.lens, key = L0.metrics.join(',') + '|' + (L0.scope || '');
        if (!d.conq || d.conqKey !== key) { d.conq = M.dacConquest(S.latest, S.events, d.shown.dacs.map(x => ({ tag: x.tag, members: x.profiles })), L0.metrics, L0.scope); d.conqKey = key; }
        return d.conq;
    }
    function lensChanged() {
        S.rendered.dacs = false;
        if (S.tab === 'dacs' && S.view === 'tab') renderTab('dacs', false);
        renderControls(); pushDacs();
    }
    function setLensOn(on) { S.dac.lens.on = !!on && S.dac.state === 'ok'; lensChanged(); }
    function toggleLensMetric(m) {
        if (!M.CONQUEST_METRICS.includes(m)) return;
        const cur = S.dac.lens.metrics, has = cur.includes(m);
        if (has && cur.length === 1) return;              // at least one stays on
        S.dac.lens.metrics = M.CONQUEST_METRICS.filter(x => x === m ? !has : cur.includes(x));
        lensChanged();
    }
    function setLensScope(tag) {
        const d = dacData();
        S.dac.lens.scope = tag && d && d.shown.dacs.some(x => x.tag === tag) ? tag : null;
        lensChanged();
    }
    // the lens controls (top of the DACs tab): Colour by Faction | DAC, Power chips, scope select, legend
    function lensBlock(d, n) {
        const L0 = S.dac.lens, ex = S.dac.example;
        const colour = `<div class="c4-chips" role="group" aria-label="Colour the map by"><button type="button" class="c4-chip${L0.on ? '' : ' on'}" data-dac-colour="faction" aria-pressed="${L0.on ? 'false' : 'true'}">Faction</button><button type="button" class="c4-chip${L0.on ? ' on' : ''}" data-dac-colour="dac" aria-pressed="${L0.on ? 'true' : 'false'}">DAC</button></div>`;
        const power = `<div class="c4-chips" role="group" aria-label="Power metrics">${M.CONQUEST_METRICS.map(m => { const on = L0.metrics.includes(m); return `<button type="button" class="c4-chip${on ? ' on' : ''}" data-dac-metric="${m}" aria-pressed="${on ? 'true' : 'false'}"${on && L0.metrics.length === 1 ? ' title="At least one power metric stays on"' : ''}>${M.CONQUEST_LABEL[m]}</button>`; }).join('')}</div>`;
        const scope = `<select class="c4-dac-scope" data-dac-scope aria-label="Which DACs compete"><option value="">All DACs</option>${d.shown.dacs.map(x => `<option value="${esc(x.tag)}"${L0.scope === x.tag ? ' selected' : ''}>${esc(x.tag)} - ${esc(x.name)}</option>`).join('')}</select>`;
        let legend = '';
        if (L0.on) {
            const c = dacConquestNow(), any = d.shown.dacs.some(x => x.profiles.length);
            if (!any) legend = `<p class="c4-dac-legend none">No members yet: nothing conquered. The map stays neutral until DAC members are listed.</p>`;
            else {
                const rows = d.shown.dacs.filter(x => !L0.scope || x.tag === L0.scope).map(x => ({ x, k: c.byDac[x.tag] || 0 })).sort((a, b) => b.k - a.k || (a.x.tag < b.x.tag ? -1 : 1));
                legend = `<ul class="c4-dac-legend">${rows.map(({ x, k }) => `<li class="${k ? '' : 'zero'}" data-dac-legend="${esc(x.tag)}"><i style="--dac:${esc(x.color)}"></i><span class="t">${esc(x.tag)}</span>${n(k)}<small>system${k === 1 ? '' : 's'}</small></li>`).join('')}${L0.scope ? '' : `<li class="ct" data-dac-legend="contested"><i></i><span class="t">Contested</span>${n(c.contested)}<small>tied</small></li>`}</ul>`;
            }
        }
        const how = `A DAC <b>conquers</b> a system when its share of the selected power there (members' share of the system's ${L0.metrics.map(m => M.CONQUEST_LABEL[m].toLowerCase()).join(' + ')}) is the largest; equal shares are contested.`;
        return `<div class="c4-dac-lens${L0.on ? ' on' : ''}${ex ? ' is-example' : ''}">
            <div class="c4-lrow"><span class="lab">Colour by</span>${colour}</div>
            <div class="c4-lrow"><span class="lab">Power</span>${power}</div>
            <div class="c4-lrow"><span class="lab">DACs</span>${scope}</div>
            ${legend}${L0.on ? `<p class="sub">${how}</p>` : ''}</div>`;
    }
    function renderDacBanner() { const b = $('#c4DacEx'); if (b) { b.hidden = !(S.dac.state === 'ok' && S.dac.example); queueInsets(); } }
    function setDacExample(on) {
        S.dac.example = !!on; S.dac.focus = null;
        // leaving the example with no real members: switch the conquest lens off too, or the map stays all grey with nothing
        // conquered (verifier-c4-lens 2026-11-07 20:48 EST: Hide example left the lens on over a memberless list)
        if (!on && !S.dac.list.some(x => x.members && x.members.length)) { S.dac.lens.on = false; S.dac.lens.scope = null; }
        S.rendered.dacs = false;
        if (S.tab === 'dacs' && S.view === 'tab') renderTab('dacs', false);
        renderDacBanner(); pushDacs(); renderControls();
        if (S.drawer && S.drawer.kind === 'owner') reopenDrawer();
    }
    function focusDac(tag) {
        S.dac.focus = S.dac.focus === tag ? null : tag;
        pushDacs();
        if (S.dac.focus) {
            if (S.scene && typeof S.scene.focusDac === 'function') sceneCall(s => s.focusDac(tag));
            else {
                // no scene support yet: fly to the centroid of the members' fleets that are not in transit
                const d = dacData(), row = d && d.rows.find(x => x.tag === tag);
                const mem = new Set(row ? row.profiles : []);
                const fl = S.latest.fleets.filter(f => mem.has(f.o) && f.s && f.s.kind !== 'warp' && f.s.kind !== 'subwarp' && isFinite(f.x) && isFinite(f.y));
                if (fl.length) focusXY(fl.reduce((s, f) => s + f.x, 0) / fl.length, fl.reduce((s, f) => s + f.y, 0) / fl.length);
            }
        }
        document.querySelectorAll('#sec-dacs .c4-dac').forEach(el => el.classList.toggle('on', el.dataset.dac === S.dac.focus));
    }
    const dacChip = x => x ? `<span class="c4-dacchip" style="--dac:${esc(x.color)}" title="${esc(x.name)}">${esc(x.tag)}</span>` : '';
    const dacFaction = f => f === 'all' ? '<span class="c4-fa fc-all"><i></i>All factions</span>' : fa(f);
    function renderDacs(el) {
        const d = dacData();
        if (!d) { el.innerHTML = `<p class="c4-verdict">DACs are not available.</p>`; return; }
        const ex = S.dac.example;
        // every DAC number in example mode carries the .ex mark (CSS shows it dashed with an EX tag) and says so
        const n = txt => `<b class="c4-dacn${ex ? ' ex' : ''}"${ex ? ' title="Example number - not real DAC membership"' : ''}>${txt}</b>`;
        const list = d.rows, N = list.length, matched = d.shown.tagsOf.size, withMembers = list.filter(x => x.profiles.length).length;
        const listed = d.real.dacs.reduce((s, x) => s + x.members.length, 0);
        const verdict = ex ? `Example: ${n(M.fmt(matched, 0))} C4 players placed in ${n(withMembers)} of ${N} DACs to show how this view will look.`
            : matched ? `${n(M.fmt(matched, 0))} C4 players are on the hand-kept list, across ${n(withMembers)} of ${N} DACs.`
            : `${n(N)} DACs on the hand-kept list; no members are listed yet.`;
        const banner = ex ? `<div class="c4-dac-banner" role="status"><b>EXAMPLE</b> - not real DAC membership. Real players are placed at random (seeded, stable) to preview this view; nothing here is saved or used anywhere else.</div>` : '';
        const tools = `<div class="c4-dac-tools"><button type="button" class="c4-act c4-dac-ex${ex ? ' on' : ''}" data-dac-example aria-pressed="${ex ? 'true' : 'false'}">${ex ? 'Hide example' : 'Show example'}</button><span class="sub">${ex ? 'Preview only.' : 'Preview with real players, clearly marked.'}</span></div>`;
        const howTo = `<b>How to add members:</b> edit <code>C4Live/dacs.json</code> and put a player's z.ink <b>profile address</b> or <b>wallet</b> in that DAC's <code>members</code> list (exact match). DACs exist only on Solana mainnet today, with no link from a mainnet member to a z.ink player, so this list is kept by hand; it switches to chain data when DACs reach z.ink.`;
        const empty = !ex && !matched ? note(howTo + (listed ? `<br>${listed} listed member${listed === 1 ? '' : 's'} match no owner in this snapshot.` : '')) : '';
        const own = new Map(S.all.owners.map(o => [o.p, o]));
        const rows = list.map((x, i) => {
            const t = x.totals;
            const stats = x.profiles.length ? `<div class="c4-dstats">${stat('Fleets', n(M.fmt(t.fleets, 0)))}${stat('Ships', n(M.fmt(t.ships, 0)))}${stat('Mining u/s', n(t.ups ? M.fmt(t.ups) : '0'))}${stat('Claim stakes', n(M.fmt(t.stakes, 0)))}${stat('Wealth (ref.)', t.priced ? n(esc(M.rangeText({ lo: t.lo, hi: t.hi }))) : '-')}</div>` : '';
            const sys = x.systems.length ? `<div class="c4-dac-sys"><span class="lab">Present in</span>${x.systems.slice(0, 8).map(s => `<button type="button" class="c4-chip" data-enter-system="${esc(s.a)}" title="${esc(`${s.n || s.a}: ${s.fleets} fleet${s.fleets === 1 ? '' : 's'}, ${s.stakes} stake${s.stakes === 1 ? '' : 's'}, ${M.fmt(s.ups)} u/s${ex ? ' (EXAMPLE)' : ''}`)}">${esc(s.n || M.shortAddr(s.a))} ${n(s.fleets)}</button>`).join('')}${x.systems.length > 8 ? `<small>+ ${x.systems.length - 8} more</small>` : ''}</div>` : '';
            const mem =x.profiles.length ? `<details class="c4-why"><summary>Members (${n(x.profiles.length)})</summary><ul class="c4-list">${x.profiles.slice().sort((a, b) => ((own.get(b) || {}).ships || 0) - ((own.get(a) || {}).ships || 0)).map(p => { const o = own.get(p); return `<li data-owner="${esc(p)}"><span class="l addr">${ownerLabel(p)}</span><span class="n">${o ? `${n(o.fleets)} fleet${o.fleets === 1 ? '' : 's'} / ${n(M.fmt(o.ships, 0))} ships` : 'no fleets'}</span></li>`; }).join('')}</ul></details>` : '';
            const um = !ex && x.unmatched.length ? `<p class="sub c4-warn">${x.unmatched.length} listed member${x.unmatched.length === 1 ? '' : 's'} not in this snapshot: ${x.unmatched.slice(0, 3).map(m => `<code>${esc(M.shortAddr(m))}</code>`).join(', ')}</p>` : '';
            return `<div class="c4-dac${S.dac.focus === x.tag ? ' on' : ''}" style="--dac:${esc(x.color)};--i:${i}" data-dac="${esc(x.tag)}">
                <button type="button" class="c4-dac-head" data-dac-focus="${esc(x.tag)}" title="Show ${esc(x.name)} on the map">${dacChip(x)}<span class="nm">${esc(x.name)}</span>${dacFaction(x.faction)}<span class="cnt">${n(x.profiles.length)} member${x.profiles.length === 1 ? '' : 's'}</span></button>
                ${stats}${sys}${mem}${um}<p class="sub c4-dac-src">Source: ${esc(x.source || 'not given')}</p></div>`;
        }).join('');
        el.innerHTML = `${banner}${lensBlock(d, n)}<p class="c4-verdict">${verdict}</p>${tools}${empty}<div class="c4-dacs${ex ? ' is-example' : ''}">${rows}</div>
            <p class="sub">Tags of the web-sourced DACs are short codes picked here; web entries come from an older guild list and are unverified. Click a DAC to show its members on the map, a member for the owner.</p>`;
    }
    // owner drawer: the REAL DAC chips (the hand-kept file); while the preview is on, a separate row clearly labelled EXAMPLE
    function dacRow(p) {
        const d = dacData(); if (!d) return '';
        const byTag = (set, t) => set.dacs.find(x => x.tag === t);
        const real = d.real.tagsOf.get(p) || [];
        let html = `<div class="c4-idrow c4-dacrow"><span class="lab">DAC</span>${real.length ? real.map(t => dacChip(byTag(d.real, t))).join('') : '<em>none on the hand-kept list</em>'}</div>`;
        if (S.dac.example) { const exT = d.shown.tagsOf.get(p) || []; html += `<div class="c4-idrow c4-dacrow ex"><span class="lab">Example</span>${exT.length ? exT.map(t => dacChip(byTag(d.shown, t))).join('') : '<em>none</em>'}<em class="c4-exmark">EXAMPLE - not real</em></div>`; }
        return html;
    }

    // ================================================================== drawer
    function openDrawer(kind, id, html) {
        S.drawer = { kind, id };
        const d = $('#c4Drawer');
        d.innerHTML = `<button class="x" data-close aria-label="Close">&times;</button>${html}`;
        d.classList.add('open'); d.setAttribute('aria-hidden', 'false'); d.scrollTop = 0;
        // v2: the drawer slides over the dock and leaves the map centre clear, so no scrim on desktop; phones keep it
        if (SHEET_MQ.matches) { const sc = $('#c4Scrim'); sc.hidden = false; requestAnimationFrame(() => sc.classList.add('show')); }
        pushInsets(false);
        d.focus({ preventScroll: true });
        if (!RM.matches) d.querySelectorAll('.c4-anim-in').forEach((x, i) => x.style.setProperty('--i', i));
        d.classList.remove('c4-anim'); void d.offsetWidth; d.classList.add('c4-anim');
    }
    function closeDrawer() {
        S.drawer = null;
        const d = $('#c4Drawer'); d.classList.remove('open'); d.setAttribute('aria-hidden', 'true');
        const sc = $('#c4Scrim'); sc.classList.remove('show'); setTimeout(() => { if (!S.drawer) sc.hidden = true; }, 300);
        pushInsets(false);
    }
    function reopenDrawer() { const d = S.drawer; if (d.kind === 'owner') openOwner(d.id); else if (d.kind === 'asteroid') openAsteroid(d.id); else if (d.kind === 'system') openSystem(d.id); else if (d.kind === 'body') openBody(d.id); }
    const stat = (l, v) => `<div><span>${l}</span><b>${v}</b></div>`;

    // ================================================================== v5 identity, wallet, wealth (2026-11-07)
    // wallet chip: the first 4 characters of the AUTH WALLET (owners[].wallet, never the profile address) + copy of the
    // FULL wallet. A real <button>, so Enter / Space copy it from the keyboard.
    function walletChip(w, inRow) {
        const s = M.walletShort(w); if (!s) return '';
        return `<button type="button" class="c4-wal${inRow ? ' row' : ''}" data-copy="${esc(w)}" data-copy-what="Wallet" title="Copy the full wallet address" aria-label="Copy wallet ${esc(s)}, full address"><code>${esc(s)}</code><span>Copy</span></button>`;
    }
    function identRows(p, rec, npc) {
        const d = M.displayName(rec, p);
        const wal = npc ? '' : `<div class="c4-idrow"><span class="lab">Wallet</span>${walletChip(rec && rec.wallet) || `<em>${rec && rec.walletWhy ? 'not known: ' + esc(rec.walletWhy) : 'not known'}</em>`}</div>`;
        return `<div class="c4-ident">
            <div class="c4-idrow"><span class="lab">Profile</span><code class="c4-prof" title="${esc(p)}">${esc(M.shortAddr(p))}</code><button type="button" class="c4-copy" data-copy="${esc(p)}" data-copy-what="Profile address" aria-label="Copy the full profile address">Copy</button></div>
            ${wal}
            ${d.truncated ? `<div class="c4-idrow"><span class="lab">Name</span><em>cut at 32 of ${esc(rec.nameLen)} characters</em></div>` : ''}
            ${d.named && !npc ? '<p class="sub">Players pick their own names and names are not unique: the profile address is what identifies this owner.</p>' : ''}</div>`;
    }
    // ship silhouettes (Images/ships/silhouettes/atlas.json, optional): white top-down hulls in one sprite sheet
    let SIL = null;
    function loadSilhouettes() {
        fetch('../Images/ships/silhouettes/atlas.json', { cache: 'force-cache' }).then(r => r.ok ? r.json() : null).then(a => { if (a && a.entries && a.configToSlug) SIL = a; }).catch(() => {});
    }
    function silIcon(config) {
        if (!SIL) return '';
        let slug = SIL.configToSlug[config]; if (slug && SIL.aliases && SIL.aliases[slug]) slug = SIL.aliases[slug];
        const i = slug != null ? SIL.entries[slug] : null; if (i == null) return '<i class="c4-sil none"></i>';
        const px = 22, cols = SIL.cols || 8;
        return `<i class="c4-sil" style="background-size:${cols * px}px auto;background-position:-${(i % cols) * px}px -${Math.floor(i / cols) * px}px"></i>`;
    }
    // v7: short hull name + a small muted variant tag ("Busan Pulse" + "Mining Min"); the full config name is the row tooltip
    const hullCell = c => { const h = M.hullLabel(c); return `<span class="c4-hn">${esc(h.base)}</span>${h.variant ? `<em class="c4-hv">${esc(h.variant)}</em>` : ''}`; };
    function wealthSection(rec) {
        const w = M.wealthView(rec, S.latest);
        if (!w) return `<div class="c4-dsec"><span>Wealth</span></div>${note('No holdings record for this owner in this snapshot.')}`;
        const r = w.range;
        const when = r && r.pricesAt ? new Date(r.pricesAt * 1000).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
        const refLine = r ? `<div class="c4-worth" id="c4Worth"><b data-lo="${r.lo}" data-hi="${r.hi}">${esc(M.rangeText(r))}</b>
                <small>(mainnet reference, priced ${r.priced} of ${r.lines} line${r.lines === 1 ? '' : 's'}, prices from ${esc(when)}, ${agoSpan(r.pricesAt)})</small>
                <small class="c4-bidask">at best bids ${M.fmt(r.atBid, 0)} / at best asks ${M.fmt(r.atAsk, 0)}. Each sum covers only the lines that have that side of the book, so either can be the larger.</small></div>` : '';
        const notes = w.notes.map(n => `<p class="sub c4-warn">${esc(n)}</p>`).join('');
        const hulls = w.hulls.length ? `<ul class="c4-list c4-hulls">${w.hulls.slice(0, 8).map(([c, n]) => `<li title="${esc(c)}"><span class="l">${silIcon(c)}${hullCell(c)}</span><span class="n">x${n}</span></li>`).join('')}</ul>${w.hulls.length > 8 ? `<p class="sub">+ ${w.hulls.length - 8} more hull type${w.hulls.length - 8 === 1 ? '' : 's'}</p>` : ''}` : note('No ships in fleets.');
        const cargo = w.cargo.length ? `<ul class="c4-list">${w.cargo.slice(0, 6).map(c => `<li><span class="l">${esc(c.name)}</span><span class="n">${M.fmt(c.units, 0)} u</span></li>`).join('')}</ul>${w.cargo.length > 6 ? `<p class="sub">+ ${w.cargo.length - 6} more cargo line${w.cargo.length - 6 === 1 ? '' : 's'}</p>` : ''}` : note('No cargo in fleet holds.');
        const top = w.top.length ? `<details class="c4-why"><summary>Largest priced lines</summary><ul class="c4-list">${w.top.slice(0, 8).map(t => `<li title="${esc(t.name)} = mainnet ${esc(t.ref)}"><span class="l">${esc(t.ref)} <em>x${M.fmt(t.qty, 0)}</em></span><span class="n">bid ${t.bid != null ? M.fmt(t.bid, 0) : '-'} / ask ${t.ask != null ? M.fmt(t.ask, 0) : '-'}</span></li>`).join('')}</ul></details>` : '';
        return `<div class="c4-dsec"><span>Wealth</span><em class="c4-dsec-note">fleet holdings on z.ink</em></div>
            <div class="c4-anim-in c4-wealth" id="c4Wealth">
                <div class="c4-wline">${w.atlas != null ? `<b>${M.fmt(w.atlas, 0)}</b> ATLAS in game` : 'ATLAS unknown'} &middot; <b>${w.fleets}</b> fleet${w.fleets === 1 ? '' : 's'} &middot; <b>${M.fmt(w.ships, 0)}</b> ship${w.ships === 1 ? '' : 's'}</div>
                ${refLine}${notes}
                <p class="sub">${esc(w.caveat)}</p>
                <div class="c4-wcols"><div><h5>Hull mix</h5>${hulls}</div><div><h5>Cargo (raw units)</h5>${cargo}</div></div>
                ${top}
            </div>`;
    }
    // copy: Clipboard API first, then the old select + execCommand path (http pages, older browsers); a short toast says
    // what was copied. Focus goes back to the button so keyboard users stay where they were.
    async function copyText(text, btn) {
        try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; } } catch (e) { /* fall through */ }
        let ok = false;
        try {
            const ta = document.createElement('textarea');
            ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
            document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
            ok = !!document.execCommand('copy'); ta.remove();
        } catch (e) { ok = false; }
        if (btn) btn.focus({ preventScroll: true });
        return ok;
    }
    function toast(msg, ok) {
        let t = $('#c4Toast');
        if (!t) { t = document.createElement('div'); t.id = 'c4Toast'; t.className = 'c4-toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
        t.textContent = msg; t.classList.toggle('bad', !ok);
        t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
        clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 1800);
    }

    function openOwner(p) {
        // the drawer always shows the whole owner, whatever the faction filter
        const o = S.all.owners.find(x => x.p === p);
        if (!o) { const r0 = (S.ident && S.ident.get(p)) || null; openDrawer('owner', p, `<div class="kind">Owner</div><h2><span class="c4-dname">${ownerLabel(p)}</span></h2>${identRows(p, r0, false)}${dacRow(p)}<p class="c4-verdict">This profile owns no fleet in the latest snapshot.</p>${r0 ? wealthSection(r0) : ''}`); return; }
        const t0 = S.latest.generatedAt;
        const minerRank = S.all.mining.owners.findIndex(x => x.p === p) + 1;
        o.minerCount = S.all.mining.miningOwners;
        const verdict = M.ownerVerdict(o, minerRank);
        const fl = o.fleetList.slice().sort((a, b) => M.fleetUps(b) - M.fleetUps(a) || b.ships - a.ships);
        const fleets = `<ul class="c4-list">${fl.map(f => `<li data-fx="${f.x}" data-fy="${f.y}" data-zoom="3"><span class="l">${esc(f.n || M.shortAddr(f.a))} ${st(f.s.kind)}</span><span class="n">${f.ships} ship${f.ships === 1 ? '' : 's'}${M.fleetUps(f) ? ' / ' + M.fmt(M.fleetUps(f)) + ' u/s' : ''}</span></li>`).join('')}</ul>`;
        const res = Object.entries(o.res).sort((a, b) => b[1] - a[1]);
        const mining = res.length ? bars(res.slice(0, 10).map(([r, u]) => ({ lab: esc(r), v: u, val: `${M.fmt(u)}<em>${M.pct(u / o.ups)}</em>` }))) : note('No fleet of this owner is mining.');
        const xp = o.xp ? `<div class="c4-xp">${bars(M.CAREERS.map(c => { const x = o.xp[c] || { xp: 0, lvl: 0 }; const mx = S.D.careerMax[c] || 1; return { lab: esc(M.CAREER_LABEL[c]), v: x.xp / mx * 100, val: `Lv ${x.lvl}<em>${M.fmt(x.xp, 0)}</em>`, tip: `${M.CAREER_LABEL[c]}\n${M.fmt(x.xp, 0)} XP, level ${x.lvl}\nbar = share of the top player's ${M.fmt(mx, 0)}` }; }), { max: 100 })}</div><p class="sub" style="margin:0.3rem 0 0">Bars are scaled to the highest player in each career.</p>` : note('No profile record (NPC).');
        const evs = S.events.filter(e => e.o === p).sort((a, b) => b.t - a.t);
        const combat = evs.length ? `<ul class="c4-feed">${evs.slice(0, 20).map((e, i) => feedItem(e, i, t0)).join('')}</ul>` : note('No combat on record for this owner.');
        const ser = M.ownerSeries(S.ownersSeries, p);
        const sparks = ser.n < 2 ? note(`Trend starts after the next hourly run (${ser.n} point${ser.n === 1 ? '' : 's'} so far).`)
            : [['Fleets', ser.fleets, 0], ['Mining fleets', ser.mining, 0], ['ATLAS', ser.atlas, 0]].map(([l, v, d]) => `<div class="c4-spark"><span>${l}</span>${spark(v)}<b>${M.fmt(v[v.length - 1], d)}</b></div>`).join('');
        const stakes = o.stakesLive != null && o.stakesLive !== o.stakes ? `${o.stakes} (${o.stakesLive} live)` : (o.stakes || 0);
        const myStakes = (S.latest.stakes || []).filter(k => k.o === p);
        const stakeList = myStakes.length ? `<div class="c4-dsec"><span>Claim stakes</span></div><ul class="c4-list c4-anim-in" id="c4OwnerStakes">${myStakes.map(k => `<li ${k.body ? `data-body="${esc(k.body)}"` : ''}><span class="l"><span class="c4-st" title="claim stake definition">${esc(M.stakeLabel(k, S.latest.quality))}</span> ${esc(k.sysName || '')} <span class="c4-st">${esc(k.st)}</span></span><span class="n">${esc(k.b)} bldg / ${esc(k.crew)} crew</span></li>`).join('')}</ul>` : '';
        const rec = (S.ident && S.ident.get(p)) || null;
        openDrawer('owner', p, `<div class="kind">${o.npc ? 'NPC (all NPC fleets share one profile)' : 'Player'}</div>
            <h2><span class="c4-dname">${o.npc ? 'NPC' : ownerLabel(p)}</span>${fa(o.group)}</h2>
            ${identRows(p, rec, o.npc)}${o.npc ? '' : dacRow(p)}
            <p class="c4-verdict">${verdict}</p>
            <div class="c4-dstats c4-anim-in">${stat('Fleets', o.fleets)}${stat('Ships', M.fmt(o.ships, 0))}${stat('Mining u/s', o.ups ? M.fmt(o.ups) : '0')}${stat('ATLAS', o.atlas != null ? M.fmt(o.atlas, 0) : '-')}${stat('Council rank', o.rank != null ? o.rank : '-')}${stat('Claim stakes', stakes)}</div>
            ${o.npc ? '' : wealthSection(rec)}
            <div class="c4-dsec"><span>Fleets</span><button class="c4-act" data-focus-owner="${esc(p)}"${S.scene ? '' : ' disabled title="3D map not loaded"'}>Fly to fleets</button></div><div class="c4-anim-in">${fleets}</div>
            ${stakeList}
            <div class="c4-dsec"><span>Mining by resource</span></div><div class="c4-anim-in">${mining}</div>
            <div class="c4-dsec"><span>Careers (XP)</span></div><div class="c4-anim-in">${xp}</div>
            <div class="c4-dsec"><span>Combat history</span></div><div class="c4-anim-in">${combat}</div>
            <div class="c4-dsec"><span>Trend (hourly)</span></div><div class="c4-anim-in">${sparks}</div>`);
    }
    function spark(v) {
        const W = 200, H = 26, mn = Math.min(...v), mx = Math.max(...v), r = mx - mn || 1;
        const d = v.map((y, i) => (i ? 'L' : 'M') + (W * i / (v.length - 1)).toFixed(1) + ' ' + (H - 3 - (H - 6) * (y - mn) / r).toFixed(1)).join(' ');
        return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="var(--cyan)" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
    }
    function openAsteroid(id) {
        const a = S.all.mining.asteroids.find(x => x.a === id);
        const meta = (S.latest.asteroids || []).find(x => x.a === id);
        const name = (a && a.sysName) || (meta && meta.sysName) || M.shortAddr(id);
        if (a) focusXY(a.x, a.y);
        const res = a ? bars(Object.entries(a.res).sort((x, y) => y[1] - x[1]).slice(0, 10).map(([r, u]) => ({ lab: esc(r), v: u, val: `${M.fmt(u)}<em>${M.pct(u / a.ups)}</em>` }))) : '';
        const rich = meta ? Object.entries(meta.res || {}).filter(([, v]) => v.rich && v.rich !== 1).map(([r, v]) => `${esc(r)} x${v.rich}`).join(', ') : '';
        const owners = a ? `<ul class="c4-list">${a.owners.slice(0, 20).map(o => `<li data-owner="${esc(o.p)}"><span class="l addr">${ownerLabel(o.p)}</span><span class="n">${M.fmt(o.ups)} u/s / ${M.pct(o.ups / a.ups)}</span></li>`).join('')}</ul>` : '';
        openDrawer('asteroid', id, `<div class="kind">Asteroid</div><h2>${esc(name)}</h2><div class="full">${esc(id)}</div>
            <p class="c4-verdict">${M.asteroidVerdict(a, S.ident)}</p>
            ${a ? `<div class="c4-dsec"><span>Output by resource</span></div><div class="c4-anim-in">${res}</div>${rich ? `<p class="sub">Richness: ${rich}</p>` : ''}
            <div class="c4-dsec"><span>Who mines it</span></div><div class="c4-anim-in">${owners}</div>` : ''}`);
    }
    function openSystem(id) {
        const s = (S.latest.systems || []).find(x => x.a === id);
        if (!s) return;
        focusXY(s.x, s.y);
        const t0 = S.latest.generatedAt;
        const docked = S.latest.fleets.filter(f => f.s && f.s.kind === 'docked' && f.s.system === id);
        const asts = S.all.mining.asteroids.filter(a => a.sys === id);
        const stakes = (S.latest.stakes || []).filter(x => x.sys === id);
        const evs = S.events.filter(e => e.sys === id).sort((a, b) => b.t - a.t);
        const verdict = s.f ? `A level <b>${s.lvl}</b> ${esc(M.GROUP_LABEL[s.f] || s.f)} starbase with <b>${docked.length}</b> fleets docked${asts.length ? ` and <b>${M.fmt(asts.reduce((x, a) => x + a.ups, 0))} u/s</b> mined on its asteroids` : ''}; ${s.lc ? `last under fire <b>${agoSpan(s.lc)}</b>` : 'never under fire'}.`
            : `No starbase here; ${docked.length} fleets docked.`;
        openDrawer('system', id, `<div class="kind">${s.f ? 'Starbase' : 'System'}</div><h2>${esc(s.n)} ${s.f ? fa(s.f) : ''}</h2><div class="full">${esc(id)}</div>
            <div class="c4-dsec"><span>Planets, asteroids, stakes</span><button class="c4-act" data-enter-system="${esc(id)}">Enter system</button></div>
            <p class="c4-verdict">${verdict}</p>
            <div class="c4-dstats c4-anim-in">${stat('Level', s.lvl != null ? s.lvl : '-')}${stat('Hull', M.fmt(s.hp, 0))}${stat('Shield', M.fmt(s.sp, 0))}${stat('Docked fleets', docked.length)}${stat('Claim stakes', stakes.length)}${stat('Links', s.links != null ? s.links : '-')}</div>
            ${asts.length ? `<div class="c4-dsec"><span>Asteroids mined here</span></div><ul class="c4-list c4-anim-in">${asts.map(a => `<li data-ast="${esc(a.a)}"><span class="l">${esc(a.topRes)} and ${Object.keys(a.res).length - 1} more</span><span class="n">${M.fmt(a.ups)} u/s</span></li>`).join('')}</ul>` : ''}
            <div class="c4-dsec"><span>Starbase combat</span></div><div class="c4-anim-in">${evs.length ? `<ul class="c4-feed">${evs.slice(0, 15).map((e, i) => feedItem(e, i, t0)).join('')}</ul>` : note('No starbase combat recorded here.')}</div>
            ${docked.length ? `<div class="c4-dsec"><span>Docked fleets</span></div><ul class="c4-list c4-anim-in">${docked.slice(0, 25).map(f => `<li data-owner="${esc(f.o)}"><span class="l">${fa(M.groupOf(f))} ${esc(f.n || M.shortAddr(f.a))}</span><span class="n">${f.ships} ships</span></li>`).join('')}</ul>` : ''}`);
    }

    // ================================================================== bodies, system panel, body drawer
    // bodies.json is 2 MB: fetched on the first system or body open, never on page load
    // push = also hand the bodies to the scene (false when load() is about to call setData itself)
    function loadBodies(push) {
        if (!S.bodiesP) {
            S.bodiesP = getJson('bodies.json').then(j => {
                const list = j && Array.isArray(j.bodies) ? j.bodies : null;
                if (!list) throw new Error('bodies.json has no bodies[]');
                S.bodies = list; S.bodyIdx = M.indexBodies(list); S.bodiesErr = false; S.bodiesStale = false;
                if (push !== false) sceneCall(sc => sc.setData(S.latest, S.events, S.bodies));
                return S.bodyIdx;
            }).catch(e => {
                console.warn('C4 Live: bodies.json', e);
                // a failed RE-load keeps the bodies we already have and says so; a failed first load has nothing to show
                if (S.bodyIdx) S.bodiesStale = true; else S.bodiesErr = true;
                S.bodiesP = S.bodyIdx ? Promise.resolve(S.bodyIdx) : null;
                return S.bodyIdx;
            });
        }
        return S.bodiesP;
    }
    const STALE_BODIES = 'Planets from the previous run; the latest bodies.json could not be loaded.';
    async function openSystemPanel(a, fromScene) {
        if (!S.latest) return;
        const sys = (S.latest.systems || []).find(x => x.a === a);
        if (!sys) return;
        S.sysView = a;
        const el = $('#c4SysPanel');
        el.hidden = false; el.classList.add('open');
        // the system is a fifth, contextual view of the dock (v2): its tab appears, the dock opens on it
        const tb = $('.c4-tab-sys'); tb.hidden = false; $('#c4SysTabName').textContent = sys.n || 'System'; tb.title = `System: ${sys.n || ''}`; fitTabs();
        // owner 2026-11-08 ("I am still seeing a transition"): a wheel zoom into a system (fromScene) must NOT slide the dock
        // open or swap its view - the dock's width change shifted the whole map (setInsets -> setViewOffset) and the panel
        // cross-faded, so the seamless scene still read as a new pane. The System tab appears (pulsed) and fills in the
        // background; only an explicit open (callout, list, deep link, Enter system) brings the dock to it.
        if (!fromScene) { setDockCollapsed(false); if (S.view !== 'system') showView('system'); }
        else if (S.view !== 'system') { tb.classList.remove('pulse'); void tb.offsetWidth; tb.classList.add('pulse'); }
        if (!fromScene) sceneCall(sc => sc.focusSystem(a));
        if (!S.bodyIdx) { el.innerHTML = `<div class="c4-sp-head"><button class="c4-act" data-galaxy>Back to galaxy</button><div class="kind">System</div><h2>${esc(sys.n)}</h2></div>${note('Loading planets and asteroids...')}`; await loadBodies(); }
        if (S.sysView === a) renderSystemPanel();
    }
    function closeSystemPanel(fromScene) {
        if (!S.sysView) return;
        // 2026-11-08 continuous world: the scene's null = no system dominates the view any more (a zoom-out or a pan). The
        // page stays still - the System tab keeps the last system until another one dominates or the user picks "Back to
        // galaxy" (builder-c4-scene-v10: the old showView('tab') swapped the dock content mid-zoom).
        if (fromScene) return;
        S.sysView = null;
        const el = $('#c4SysPanel'); el.classList.remove('open'); el.hidden = true;
        $('.c4-tab-sys').hidden = true;
        showView('tab');
        if (!fromScene) sceneCall(sc => sc.focusSystem(null));
    }
    function bodyRow(o) {
        const top = o.res.slice(0, 3).map(r => `${esc(r.r)} <em>x${esc(r.rich)}</em>`).join(', ');
        const work = o.isAsteroid ? (o.fleets.length ? `${o.fleets.length} fleet${o.fleets.length === 1 ? '' : 's'} / ${M.fmt(o.ups)} u/s` : 'no miners')
            : (o.stakes.length ? `${o.stakes.length} stake${o.stakes.length === 1 ? '' : 's'}` : 'unclaimed');
        return `<li class="c4-body" data-body="${esc(o.a)}"><img src="${M.bodyImage(o.b, 128)}" alt="" loading="lazy">
            <span class="bt"><b>${esc(o.name)}</b><small>${esc(o.kind)} - ${o.res.length} resources</small><small class="top">${top}</small></span><span class="n">${work}</span></li>`;
    }
    function renderSystemPanel() {
        const el = $('#c4SysPanel');
        if (!S.sysView) return;
        const sys = (S.latest.systems || []).find(x => x.a === S.sysView);
        if (!sys) { closeSystemPanel(false); return; }
        if (!S.bodyIdx) {
            el.innerHTML = `<div class="c4-sp-head"><button class="c4-act" data-galaxy>Back to galaxy</button><h2>${esc(sys.n)}</h2></div>${note(S.bodiesErr ? 'bodies.json could not be loaded, so planets and asteroids are not shown.' : 'Loading planets and asteroids...')}`;
            return;
        }
        const v = M.buildSystem(S.latest, S.events, S.bodyIdx, S.sysView);
        const t0 = S.latest.generatedAt;
        const states = Object.entries(v.byState).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<span class="c4-sp-st">${st(k)} ${n}</span>`).join(' ');
        const live = v.live.length ? bars(v.live.slice(0, 6).map(r => ({ lab: esc(r.r), v: r.ups, val: `${M.fmt(r.ups)}<em>${M.pct(r.ups / v.ups)}</em>` }))) : '';
        const combat = v.combat.length ? `<ul class="c4-feed">${v.combat.slice(0, 8).map((e, i) => feedItem(e, i, t0)).join('')}</ul>` : note('No combat on record here.');
        el.innerHTML = `<div class="c4-sp-head"><button class="c4-act" data-galaxy>Back to galaxy</button>
                <div class="kind">${sys.f ? `${esc(M.GROUP_LABEL[sys.f] || sys.f)} starbase, level ${esc(sys.lvl)}` : 'No starbase'}</div><h2>${esc(sys.n)}</h2></div>
            ${S.bodiesStale ? note(STALE_BODIES) : ''}<p class="c4-verdict">${v.verdict}</p>
            <div class="c4-dstats">${stat('Fleets here', `${v.fleets.length}`)}${stat('Mining u/s', v.ups ? M.fmt(v.ups) : '0')}${stat('Claim stakes', v.stakes.length)}</div>
            <div class="c4-dsec"><span>Planets</span></div><ul class="c4-list c4-bodies">${v.planets.map(bodyRow).join('') || '<li>none</li>'}</ul>
            <div class="c4-dsec"><span>Asteroids</span></div><ul class="c4-list c4-bodies">${v.asteroids.map(bodyRow).join('') || '<li>none</li>'}</ul>
            <div class="c4-dsec"><span>Fleets by state</span></div><div class="c4-sp-states">${states || 'none'}</div>
            <p class="sub">${v.players} player and ${v.npc} NPC fleets: docked, mining here, parked within the system, or arrived from warp; fleets still in transit are not counted.</p>
            ${live ? `<div class="c4-dsec"><span>Live output (current rate)</span></div>${live}` : ''}
            <div class="c4-dsec"><span>Recent combat here</span></div>${combat}`;
    }
    async function openBody(a) {
        if (!S.latest) return;
        if (!S.bodyIdx) {
            openDrawer('body', a, `<div class="kind">Body</div>${note('Loading planets and asteroids...')}`);
            await loadBodies();
            if (!S.drawer || S.drawer.kind !== 'body' || S.drawer.id !== a) return;   // the user moved on meanwhile
        }
        if (!S.bodyIdx) { openDrawer('body', a, `<div class="kind">Body</div>${note('bodies.json could not be loaded.')}`); return; }
        const o = M.buildBody(S.latest, S.bodyIdx, a);
        if (!o) { openDrawer('body', a, `<div class="kind">Body</div><h2>${ownerLabel(a)}</h2>${note('This body is not in bodies.json.')}`); return; }
        const sys = (S.latest.systems || []).find(x => x.a === o.b.sys);
        const resBars = bars(o.res.map(r => ({ lab: esc(r.r), v: r.rich || 0, val: `x${esc(r.rich)}${o.isAsteroid && r.miners ? `<em>${r.miners} miner${r.miners === 1 ? '' : 's'}</em>` : ''}`,
            tip: `${r.r}\nrichness x${r.rich}${r.mined != null ? `\n${M.fmt(r.mined, 0)} units settled on chain` : ''}${r.miners ? `\n${r.miners} active miner${r.miners === 1 ? '' : 's'}` : ''}` })), { max: o.richMax || 1 });
        let body = '';
        if (o.isAsteroid) {
            const fl = o.fleets.length ? `<ul class="c4-list">${o.fleets.map(x => `<li data-owner="${esc(x.f.o)}"><span class="l">${fa(M.groupOf(x.f))} ${esc(x.f.n || M.shortAddr(x.f.a))} <em style="color:var(--text-muted);font-style:normal">${ownerName(x.f.o, x.f.npc)}</em></span><span class="n">${M.fmt(x.ups)} u/s</span></li>`).join('')}</ul>` : note('No fleet is mining here right now.');
            const live = o.live.length ? bars(o.live.map(r => ({ lab: esc(r.r), v: r.ups, val: `${M.fmt(r.ups)}<em>${M.pct(r.ups / o.ups)}</em>` }))) : '';
            body = `<div class="c4-dstats c4-anim-in">${stat('Mining u/s', o.ups ? M.fmt(o.ups) : '0')}${stat('Galaxy share', M.pct(o.share))}${stat('Settled on chain', M.fmt(o.mined, 0))}</div>
                <div class="c4-dsec"><span>Fleets mining now</span></div><div class="c4-anim-in">${fl}</div>
                ${live ? `<div class="c4-dsec"><span>Live output by resource</span></div><div class="c4-anim-in">${live}</div>` : ''}
                <div class="c4-dsec"><span>Resources and richness</span></div><div class="c4-anim-in">${resBars}</div>
                <p class="sub">Settled = the asteroid's cumulative counter, which moves when a fleet's mining settles on chain; ${o.activeMiners} active miner slot${o.activeMiners === 1 ? '' : 's'} across its resources.</p>`;
        } else {
            const stakes = o.stakes.length ? `<ul class="c4-list">${o.stakes.map(k => `<li data-owner="${esc(k.o)}"><span class="l"><span class="addr">${ownerLabel(k.o)}</span> <span class="c4-st">${esc(k.st)}</span><span class="c4-st" title="claim stake definition">${esc(M.stakeLabel(k, S.latest.quality))}</span></span><span class="n">${esc(k.b)} bldg / ${esc(k.crew)} crew</span></li>`).join('')}</ul>` : note('No claim stake on this planet.');
            body = `<div class="c4-dstats c4-anim-in">${stat('Claim stakes', o.stakes.length)}${stat('Owners', o.stakeOwners)}${stat('Claimed plots', o.claimed)}</div>
                <div class="c4-dsec"><span>Claim stakes</span></div><div class="c4-anim-in">${stakes}</div>
                <div class="c4-dsec"><span>Resources and richness</span></div><div class="c4-anim-in">${resBars}</div>`;
        }
        openDrawer('body', a, `<div class="c4-bimg"><img src="${M.bodyImage(o.b, 384)}" alt=""></div><div class="kind">${esc(o.kind)}${sys ? ` in <a href="#" data-enter-system="${esc(sys.a)}">${esc(sys.n)}</a>` : ''}</div>
            <h2>${esc(o.name)}<button class="c4-copy" data-copy="${esc(a)}">Copy</button></h2><div class="full">${esc(a)}</div>
            ${S.bodiesStale ? note(STALE_BODIES) : ''}<p class="c4-verdict">${o.verdict}</p>${body}`);
    }

    // ================================================================== find
    // several owners match a name: list them all (ranked), each a button that opens the owner; names are user text
    function findList(q, rows) {
        const box = document.createElement('div'); box.id = 'c4FindMsg'; box.className = 'c4-find-msg c4-find-list';
        const head = document.createElement('span');
        const exact = rows.filter(r => r.tier === 0).length;
        head.textContent = `${rows.length} owner${rows.length === 1 ? '' : 's'} match "${q}"${exact > 1 ? ` (${exact} share that exact name - check the profile address)` : ''}:`;
        box.appendChild(head);
        const ul = document.createElement('ul');
        for (const r of rows.slice(0, 12)) {
            const li = document.createElement('li');
            const b = document.createElement('button'); b.type = 'button'; b.dataset.owner = r.p; b.title = 'Profile ' + r.p;
            const nm = document.createElement('b'); nm.textContent = r.name;
            const ad = document.createElement('code'); ad.textContent = M.shortAddr(r.p);
            const sh = document.createElement('small'); sh.textContent = `${r.ships} ship${r.ships === 1 ? '' : 's'}`;
            b.append(nm, ad, sh); li.appendChild(b); ul.appendChild(li);
        }
        box.appendChild(ul);
        if (rows.length > 12) { const more = document.createElement('small'); more.textContent = `+ ${rows.length - 12} more - type more of the name`; box.appendChild(more); }
        $('.c4-find').appendChild(box);
    }
    function find(q) {
        q = q.trim(); const msg = $('#c4FindMsg'); if (msg) msg.remove();
        if (!q || !S.latest) return;
        const ql = q.toLowerCase();
        // v5 order: exact profile address, then names (exact > prefix > substring, case-insensitive; names are NOT
        // unique, so two exact matches list both), then a profile address prefix, then fleet names
        const exactAddr = S.all.owners.find(o => o.p === q) || (S.latest.owners || []).find(o => o.p === q);
        if (exactAddr) { openOwner(exactAddr.p); return; }
        const byName = M.findOwners(S.latest.owners || [], q);
        const best = byName.length ? byName.filter(x => x.tier === byName[0].tier) : [];
        const addrPre = ql.length >= 4 ? S.all.owners.find(o => o.p.toLowerCase().startsWith(ql)) : null;
        if (best.length === 1 && (best[0].tier === 0 || byName.length === 1)) { openOwner(best[0].p); return; }
        if (!byName.length && addrPre) { openOwner(addrPre.p); return; }
        if (byName.length) { findList(q, byName); return; }
        const fleets = S.latest.fleets.filter(f => f.a === q || (f.n || '').toLowerCase() === ql);
        const partial = fleets.length ? fleets : S.latest.fleets.filter(f => (f.n || '').toLowerCase().includes(ql));
        const owners = [...new Set(partial.map(f => f.o))];
        if (owners.length === 1) { openOwner(owners[0]); return; }
        const m = document.createElement('span'); m.id = 'c4FindMsg'; m.className = 'c4-find-msg';
        m.textContent = owners.length ? `${partial.length} fleets match (${owners.length} owners) - showing them in the fleet table` : 'No owner or fleet matches';
        $('.c4-find').appendChild(m);
        if (owners.length) { S.fleetQ = q; setTab('fleets'); S.rendered.fleets = false; renderTab('fleets', false); }
    }

    // ================================================================== scene
    function loadScene() {
        const s = document.createElement('script');
        s.src = 'c4-scene.js?v=' + Date.now().toString(36).slice(0, -4);
        s.onload = () => mountScene();
        s.onerror = () => noMap('The 3D map is not built yet (<b>C4Live/c4-scene.js</b> is missing). Everything below still works.');
        document.body.appendChild(s);
    }
    function noMap(html) { S.sceneState = 'none'; const n = $('#c4NoMap'); n.innerHTML = `<div>${html}</div>`; n.hidden = false; if (S.D) renderControls(); }
    function mountScene() {
        if (!window.C4Scene || typeof window.C4Scene.mount !== 'function') { noMap('The 3D map script loaded but did not register <b>C4Scene</b>.'); return; }
        try { S.scene = window.C4Scene.mount($('#c4Map'), { reducedMotion: RM.matches }); }
        catch (e) { console.warn('C4 Live: scene mount failed', e); noMap('The 3D map could not start in this browser (WebGL?). Everything below still works.'); return; }
        S.sceneState = 'ready';
        S.scene.on('pick', onPick);
        S.scene.on('hover', onHover);
        if (S.latest) { sceneCall(s => s.setData(S.latest, S.events, S.bodies || undefined)); }
        if (typeof S.scene.on === 'function') { try { S.scene.on('systemView', v => { if (v && v.sys) openSystemPanel(v.sys, true); else closeSystemPanel(true); }); } catch (e) { console.warn('C4 Live: systemView hook failed', e); } }
        for (const [k, on] of Object.entries(S.layers)) if (!on) sceneCall(s => s.setLayer(k, false));
        pushFilter();
        pushStatLayer();      // the active tab's stats on the map from the first frame
        pushDacs();
        pushInsets(true);     // and the area the dock / KPI bar cover, so the scene frames the open part
        if (S.D) renderControls();
        if (S.drawer && S.drawer.kind === 'owner') reopenDrawer();
        replaySceneState();
    }
    // v3 race fix: a deep link applied while c4-scene.js was still loading (data first, bundle 1.5 s later) set the page
    // state but its scene calls went nowhere. Replay it now, after setData: the system view wins, else an owner focus,
    // else the last point a drawer flew to (?body / ?owner open drawers; openAsteroid / openSystem focus a point).
    function replaySceneState() {
        const pt = S.pendingPoint; S.pendingPoint = null;
        if (S.sysView) sceneCall(s => s.focusSystem(S.sysView));
        else if (S.ownerFocus) sceneCall(s => s.focusOwner(S.ownerFocus));
        else if (pt) sceneCall(s => s.focusPoint(pt[0], pt[1], pt[2]));
    }
    function onPick(p) {
        if (!p) return;
        // a stat callout names a system: enter its SYSTEM VIEW (dock System tab + scene.focusSystem), not the starbase
        // drawer (v3 contract). Plain map system clicks keep the drawer.
        if (p.type === 'system' && p.source === 'callout' && p.id) { if (S.drawer) closeDrawer(); openSystemPanel(p.id, false); return; }
        if (p.type === 'fleet') { const f = S.latest.fleets.find(x => x.a === p.id); const o = p.ownerProfile || (f && f.o); if (o) openOwner(o); }
        else if (p.type === 'asteroid') openAsteroid(p.id);
        else if (p.type === 'system') openSystem(p.id);
        else if (p.type === 'body') openBody(p.id);
    }
    function onHover(h) {
        const tip = $('#c4Tip');
        if (!h || !S.latest) { tip.hidden = true; return; }
        let body = '';
        if (h.type === 'fleet') {
            const f = S.latest.fleets.find(x => x.a === h.id);
            if (f) body = `<b>${esc(f.n || M.shortAddr(f.a))}</b>${fa(M.groupOf(f))} ${st(f.s.kind)}<br>${f.ships} ship${f.ships === 1 ? '' : 's'}${M.fleetUps(f) ? `, ${M.fmt(M.fleetUps(f))} u/s` : ''}<br><em>owner ${ownerName(f.o, f.npc)} - click for owner</em>`;
        } else if (h.type === 'asteroid') {
            const a = S.all.mining.asteroids.find(x => x.a === h.id);
            body = a ? `<b>${esc(a.sysName)} asteroid</b>${a.fleets} fleets, ${a.ownerCount} owners<br>${M.fmt(a.ups)} u/s, mostly ${esc(a.topRes)}<br><em>click for who mines it</em>` : '';
        } else if (h.type === 'system') {
            const s = (S.latest.systems || []).find(x => x.a === h.id);
            if (s) body = `<b>${esc(s.n)}</b>${s.f ? `${fa(s.f)} starbase, level ${s.lvl}` : 'no starbase'}<br><em>click for the starbase</em>`;
        }
        else if (h.type === 'body') {
            const o = S.bodyIdx && S.latest ? M.buildBody(S.latest, S.bodyIdx, h.id) : null;
            const lines = o ? M.bodyTip(o) : (h.label ? String(h.label).split(' - ') : []);
            if (lines.length) body = `<b>${esc(lines[0])}</b>${lines.slice(1).map(esc).join('<br>')}<br><em>click for the full sheet</em>`;
        }
        if (!body) body = `<b>${esc(h.label || '')}</b>`;
        tip.innerHTML = body; tip.hidden = false;
        const w = tip.offsetWidth, hh = tip.offsetHeight;
        tip.style.left = Math.min(window.innerWidth - w - 8, h.clientX + 14) + 'px';
        tip.style.top = Math.min(window.innerHeight - hh - 8, h.clientY + 14) + 'px';
    }

    // ================================================================== events
    function setFilter(f) {
        if (S.filter === f) f = 'all';
        S.filter = f; pushFilter(); rebuild(false);
    }
    function wire() {
        document.addEventListener('click', e => {
            const t = e.target;
            const cp = t.closest('[data-copy]');
            if (cp) {
                const text = cp.dataset.copy, what = cp.dataset.copyWhat || 'Address';
                copyText(text, cp).then(ok => {
                    cp.classList.toggle('ok', ok); setTimeout(() => cp.classList.remove('ok'), 1400);
                    toast(ok ? `Copied ${what.toLowerCase()} ${text.slice(0, 4)}…${text.slice(-4)}` : `The browser blocked the copy. ${what}: ${text}`, ok);
                });
                return;
            }
            if (t.closest('[data-close]') || t.id === 'c4Scrim') { closeDrawer(); return; }
            if (t.closest('#c4DockToggle')) { setDockCollapsed(!S.dock.collapsed); return; }
            if (t.closest('[data-dac-example]')) { setDacExample(!S.dac.example); return; }
            if (t.closest('[data-age-detail]')) { S.ageOpen = !S.ageOpen; renderAge(); return; }
            const dcol = t.closest('[data-dac-colour]'); if (dcol) { setLensOn(dcol.dataset.dacColour === 'dac'); return; }
            const dmet = t.closest('[data-dac-metric]'); if (dmet) { toggleLensMetric(dmet.dataset.dacMetric); return; }
            const df = t.closest('[data-dac-focus]'); if (df) { focusDac(df.dataset.dacFocus); return; }
            const tab = t.closest('.c4-tab');
            if (tab) { setDockCollapsed(false); if (tab.dataset.view === 'system') showView('system'); else setTab(tab.dataset.tab); return; }
            const fil = t.closest('[data-filter]'); if (fil) { setFilter(fil.dataset.filter); return; }
            const clr = t.closest('[data-clear]'); if (clr) { if (clr.dataset.clear === 'states') S.states = null; else { S.ownerFocus = null; } pushFilter(); renderControls(); S.rendered.fleets = false; if (S.tab === 'fleets') renderTab('fleets', false); return; }
            const stt = t.closest('[data-state]'); if (stt) { const k = stt.dataset.state; S.states = S.states && S.states[0] === k ? null : [k]; pushFilter(); renderControls(); S.rendered.fleets = false; renderTab('fleets', false); return; }
            const fo = t.closest('[data-focus-owner]'); if (fo) { S.ownerFocus = fo.dataset.focusOwner; pushFilter(); sceneCall(s => s.focusOwner(S.ownerFocus)); renderControls(); closeDrawer(); return; }
            const more = t.closest('[data-more]'); if (more) { if (more.dataset.more === 'fleets') { S.fleetLimit += 100; renderFleetTable(); } else { S.ownerLimit += 100; renderOwnerTable(); } return; }
            const srt = t.closest('th[data-sort]');
            if (srt) { const tbl = srt.closest('table').dataset.table; const k = srt.dataset.sort; const cur = tbl === 'fleets' ? S.fleetSort : S.ownerSort; const next = [k, cur[0] === k ? -cur[1] : (k === 'name' || k === 'state' ? 1 : -1)]; if (tbl === 'fleets') { S.fleetSort = next; renderFleetTable(); } else { S.ownerSort = next; renderOwnerTable(); } return; }
            const ev = t.closest('.c4-feed li');
            if (ev && t.closest('#sec-combat')) { const e2 = S.D.combat.feed[+ev.dataset.ev]; if (e2) { focusXY(e2.x, e2.y); sceneCall(s => s.pulseEvent(e2)); } return; }
            const es = t.closest('[data-enter-system]'); if (es) { e.preventDefault(); closeDrawer(); openSystemPanel(es.dataset.enterSystem, false); return; }
            if (t.closest('[data-galaxy]')) { closeSystemPanel(false); return; }
            const bd = t.closest('[data-body]'); if (bd) { openBody(bd.dataset.body); return; }
            const ast = t.closest('[data-ast]'); if (ast) { openAsteroid(ast.dataset.ast); return; }
            const sys = t.closest('[data-sys]'); if (sys && !t.closest('.c4-feed')) { openSystem(sys.dataset.sys); return; }
            const fx = t.closest('[data-fx]');
            if (fx) { focusXY(+fx.dataset.fx, +fx.dataset.fy, fx.dataset.zoom ? +fx.dataset.zoom : 3); }
            const ow = t.closest('[data-owner]'); if (ow && !t.closest('.c4-drawer .c4-feed')) { openOwner(ow.dataset.owner); return; }
        });
        document.addEventListener('change', e => {
            const l = e.target.closest('[data-layer]');
            if (l) { S.layers[l.dataset.layer] = l.checked; sceneCall(s => s.setLayer(l.dataset.layer, l.checked)); }
            const sc = e.target.closest('[data-dac-scope]'); if (sc) setLensScope(sc.value || null);
        });
        let qT;
        document.addEventListener('input', e => {
            if (e.target.id === 'c4FleetQ') { clearTimeout(qT); qT = setTimeout(() => { S.fleetQ = e.target.value; S.fleetLimit = 30; renderFleetTable(); }, 150); }
            if (e.target.id === 'c4OwnerQ') { clearTimeout(qT); qT = setTimeout(() => { S.ownerLimit = 50; renderOwnerTable(); }, 150); }
        });
        $('#c4Find').addEventListener('keydown', e => { if (e.key === 'Enter') find(e.target.value); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && S.drawer) { closeDrawer(); return; }
            // D toggles the dock, unless the user is typing. Only TEXT entry blocks it: a focused layer checkbox, radio or
            // button does not (v3: D was dead after clicking a layer checkbox)
            const tg = e.target, NOTEXT = /^(checkbox|radio|button|submit|reset|range|color|file|image)$/i;
            const typing = tg && (tg.isContentEditable || tg.tagName === 'TEXTAREA' || tg.tagName === 'SELECT' || (tg.tagName === 'INPUT' && !NOTEXT.test(tg.type || 'text')));
            if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'd' || e.key === 'D')) { e.preventDefault(); setDockCollapsed(!S.dock.collapsed); }
        });
        // chart hover tooltips (SVG columns, bars with data-tip, matrix cells) and the cumulative-share crosshair
        const ct = $('#c4ChartTip');
        document.addEventListener('mousemove', e => {
            const t = e.target;
            const lz = t.closest && t.closest('svg[data-lorenz]');
            if (lz && t.classList.contains('hit')) {
                const pts = JSON.parse(lz.dataset.lorenz), n = +lz.dataset.n, x0 = +lz.dataset.x0, x1 = +lz.dataset.x1;
                const r = lz.getBoundingClientRect(), vb = lz.viewBox.baseVal;
                const vx = (e.clientX - r.left) * vb.width / r.width;
                const i = Math.max(1, Math.min(n, Math.round((vx - x0) / (x1 - x0) * n)));
                const xh = lz.querySelector('.xh'); const px = x0 + (x1 - x0) * i / n; xh.setAttribute('x1', px); xh.setAttribute('x2', px);
                showTip(ct, `Top ${i} owner${i === 1 ? '' : 's'}\n${M.pct(pts[i], 1)} of output`, e); return;
            }
            const tipEl = t.closest && t.closest('[data-tip]');
            if (tipEl) { showTip(ct, tipEl.dataset.tip, e); return; }
            ct.hidden = true;
            document.querySelectorAll('svg[data-lorenz] .xh').forEach(x => { x.setAttribute('x1', -10); x.setAttribute('x2', -10); });
        });
        document.addEventListener('visibilitychange', () => { if (!document.hidden) { renderAge(); load(false); } });
    }
    // plain text only: line 1 bold, the rest as lines. textContent, so a fleet name in a tip can never become markup
    function showTip(ct, text, e) {
        ct.textContent = '';
        String(text).split('\n').forEach((line, i) => { if (i) ct.appendChild(document.createElement('br')); const n = document.createElement(i ? 'span' : 'b'); n.textContent = line; ct.appendChild(n); });
        ct.hidden = false;
        const w = ct.offsetWidth, h = ct.offsetHeight;
        ct.style.left = Math.min(window.innerWidth - w - 8, e.clientX + 14) + 'px';
        ct.style.top = (e.clientY + 14 + h > window.innerHeight ? e.clientY - h - 10 : e.clientY + 14) + 'px';
    }
    function applyParams() {
        const p = new URLSearchParams(location.search);
        const tab = p.get('tab'); if (['mining', 'combat', 'fleets', 'owners'].includes(tab) || (tab === 'dacs' && S.dac.state === 'ok')) setTab(tab);
        const o = p.get('owner'); if (o) openOwner(o);
        const sy = p.get('system'); if (sy) openSystemPanel(sy, false);
        const bo = p.get('body'); if (bo) openBody(bo);
    }

    // ================================================================== boot
    wire();
    wireDock();
    pushInsets(true);
    S.dacP = loadDacs();      // never rejects; load(true) waits for it before applying ?tab=dacs
    load(true).then(() => {
        requestAnimationFrame(tick);
        // the scene's system view needs bodies: preload on idle (2 s fallback) instead of waiting for a drawer.
        // loadBodies() is memoised, so a drawer opened meanwhile shares the same single fetch.
        if (S.latest) {
            const idle = window.requestIdleCallback ? fn => window.requestIdleCallback(fn, { timeout: 2000 }) : fn => setTimeout(fn, 2000);
            idle(() => { loadBodies().then(() => { if (S.sysView) renderSystemPanel(); }); });
        }
    });
    loadScene();
    loadSilhouettes();
    setInterval(() => load(false), RELOAD_MS);
    setInterval(() => { renderAge(); refreshAgo(); }, 15000);
})();
