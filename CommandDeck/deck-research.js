// deck-research.js - Command Deck, Research tab (2026-10-04).
// The research tree drawn from the export: one band per track, x = prerequisite depth (the nodes whose research
// tags a node requires), every node always visible. What happens on it, in place:
//   - a GOAL from anywhere in the hub (a recipe, a stake building, a stake tier, a hab tier, a hull to fly, a node,
//     or the whole Empire tab) lights the prerequisite path and prices it: the level each track must reach and
//     the XP that takes, points, ATLAS, tokens
//   - a NODE shows what it gives (the export's sentence, every grant in words, the nodes it leads to - 2026-10-06),
//     what it needs, and what it is a gate of (recipes by type, stake buildings)
//   - a RECIPE goal also covers getting its raws (the player's choice: claim stakes, a mining fleet, or raws
//     already in hand): the extractor's gates and a tier-1 stake, and zone access when a raw is not found in the
//     player's own low-risk zone. A level the path needs on a track is written on that track's band, whether or
//     not the path has a node there
//   - MY RESEARCH: mark nodes as researched (kept in localStorage); the bill then counts only what is left and
//     "Next nodes" ranks what can be researched now by the recipes it gates
// Not in the data, and said on the page: how XP and track points are earned.
(function () {
    'use strict';

    const { esc, num, snd, recipeLabel, factionChips, ZONE_TEXT } = window.DeckUI;
    const KEY = 'commandDeck.research.v1';
    const COLW = 158, PW = 142, PH = 34, ROWH = 44, PADX = 14, PADY = 38;
    const TRACK_COLOR = { CouncilRank: '#e8e3d3', Pilot: '#2fa985', Mining: '#dd7429', Building: '#a8842a', Crafting: '#9476db', DataRunner: '#2a9fcf', Combat: '#d9517c' };
    const ABBR = { CouncilRank: 'Council', Pilot: 'Pilot', Mining: 'Mining', Building: 'Building', Crafting: 'Crafting', DataRunner: 'Data', Combat: 'Combat' };
    const KIND_LABEL = { recipe: 'Recipe', building: 'Stake building', stake: 'Claim stake', hab: 'Crafting hab', ship: 'Fly a hull', node: 'Research node', empire: 'Empire' };
    const trunc = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
    const SCALE_WORD = { 'Single Activation': 'one-time', Unlimited: 'repeatable, per level', 'Successive Range': 'ranked' };
    const STARBASE = /^Starbase - Tier \d+$/;                         // six pseudo-ships in the hull list: not hulls to fly
    const MAX_HITS = 14;
    const plural = (n, one, many) => `${num(n)} ${n === 1 ? one : (many || one + 's')}`;

    class ResearchTab {
        constructor(root, model, ctx) {
            this.root = root; this.m = model; this.ctx = ctx;           // ctx: { rc, se, ships }
            const saved = window.DeckStore.read(KEY, {}) || {};           // saved bytes are untrusted: shapes checked
            this.owned = new Set((Array.isArray(saved.owned) ? saved.owned : []).filter(id => model.byId.has(id)));
            if (model.start) this.owned.add(model.start.id);
            this.goal = null; this.sel = null; this.folds = {};
            if (saved.goal && typeof saved.goal === 'object' && saved.goal.kind !== 'empire') { try { this.goal = this.makeGoal(saved.goal.kind, saved.goal.id); } catch (e) { this.goal = null; } }
            this.renderShell(); this.bind(); this.update();
            // faction or the way raws are gathered changed: a recipe goal's path changes with them, and so does the
            // Empire goal (its zone access is seen from the player's faction) - rebuilt from the Empire tab, or cleared
            window.DeckStore.on(() => {
                if (this.goal && this.goal.kind === 'recipe') this.goal = this.makeGoal('recipe', this.goal.id);
                else if (this.goal && this.goal.kind === 'empire') { const et = this.ctx.app && this.ctx.app.empireTab, need = et && et.researchNeed(); this.goal = need && need.tags.length ? this.makeGoal('empire', null, need) : null; }
                this.update();
            });
        }
        save() { window.DeckStore.write(KEY, { owned: Array.from(this.owned), goal: this.goal && this.goal.kind !== 'empire' ? { kind: this.goal.kind, id: this.goal.id } : null }); }

        // ------------------------------------------------------------------ goals
        makeGoal(kind, id, extra) {
            const m = this.m, { rc, se, ships } = this.ctx;
            if (kind === 'recipe') {
                const r = rc.byId.get(id) || rc.recipes.find(x => x.outputName === id); if (!r) return null;
                const raw = m.chainOf(r).isRaw;                                       // a raw is gathered: no crafting gate
                const own = raw ? [] : m.recipeGate(r.outputId), craft = m.chainGate(r);
                const S = window.DeckStore.s, gather = m.gather(r, S.faction, S.gather, se);
                const all = new Set(craft); gather.tags.forEach(t => all.add(t));
                const sub = raw ? (S.gather === 'hand' ? 'a raw, already in hand' : 'a raw: gather it') : S.gather === 'hand' ? 'craft it, raws already in hand' : 'gather the raws and craft it';
                return { kind, id: r.outputId, label: recipeLabel(r), sub, raw, tags: Array.from(all), own, craft: Array.from(craft), gather, link: `../RecipeExplorer/index.html?recipe=${encodeURIComponent(r.outputId)}` };
            }
            if (kind === 'building') {
                const b = se.by.get(id); if (!b) return null;
                const own = m.buildingGate(b.id), tags = new Set(own.concat(m.stakeGate(b.tier)));
                // an extractor or processor runs only beside the hubs (and crew quarters, power plants) a stake lays out
                // for it: their gates too, the way the Empire tab counts a placed stake
                const raw = b.resourceExtractionRate ? Object.keys(b.resourceExtractionRate)[0] : null, proc = (b.addedTags || []).includes('processor');
                const site = (raw || proc) && se.planets.find(p => p.stakeable && se.usable(b, p, b.tier) && (!raw || p.deposits.has(raw)));
                const L = site ? se.layout(site, b.tier, raw ? { [raw]: 1 } : {}, proc ? [b.id] : []) : null;
                if (L) L.items.forEach(it => { if (it.role !== 'extractor' && it.role !== 'processor') m.buildingGate(it.b.id).forEach(t => tags.add(t)); });
                // no planet feeds it (a second-stage processor, a cultivation farm): the hubs its tags name instead
                const hubs = !L && (raw || proc) ? se.hubsFor(b) : [];
                hubs.forEach(h => m.buildingGate(h.id).forEach(t => tags.add(t)));
                return { kind, id: b.id, label: `${b.name} T${b.tier}`, sub: `place it on a tier ${b.tier} claim stake`, tags: Array.from(tags), own, ungated: !own.length, site: L ? 'layout' : hubs.length ? 'tags' : '' };
            }
            if (kind === 'stake') { const t = +id; if (!(t >= 1 && t <= 5)) return null; return { kind, id: t, label: `Claim Stake Tier ${t}`, sub: 'own a stake of this tier', tags: m.stakeGate(t) }; }
            if (kind === 'hab') { const tags = m.habGate(id); if (!tags.length) return null; return { kind, id, label: 'Crafting Hab Tier ' + String(id).replace(/\D/g, ''), sub: 'own a hab of this tier', tags }; }
            if (kind === 'ship') {
                const s = ships.find(x => x.name === id); if (!s || STARBASE.test(s.name)) return null;
                const node = m.shipSizeNode(s.sizeTier);
                return { kind, id: s.name, label: s.name, sub: `fly a ${s.sizeTier} hull`, tags: node ? node.tags : [], noNode: !node && s.sizeTier !== 'XXS', free: s.sizeTier === 'XXS' };
            }
            if (kind === 'node') { const n = m.byId.get(id) || m.byName.get(id); if (!n) return null; return { kind, id: n.id, label: n.name, sub: n.track.label + ' node', tags: n.tags, node: n }; }
            if (kind === 'empire') return { kind, id: 'empire', label: 'Your empire', sub: (extra && extra.sub) || 'stakes, buildings and hulls on the Empire tab', tags: (extra && extra.tags) || [] };
            return null;
        }
        setGoal(g) { this.goal = g; this.sel = g && g.node ? g.node.id : this.sel; this.save(); this.update(); if (g) this.scrollToPath(); }
        pathSet() { if (this.goal) { const s = this.m.closure(this.goal.tags); if (this.goal.node) s.add(this.goal.node); return s; } const n = this.sel && this.m.byId.get(this.sel); return n ? this.m.closureOfNode(n) : new Set(); }

        buildIndex() {
            if (this.index) return;
            const { rc, se, ships } = this.ctx, m = this.m, idx = [];
            rc.recipes.forEach(r => idx.push({ kind: 'recipe', id: r.outputId, label: recipeLabel(r), sub: r.typeLabel }));
            m.nodes.forEach(n => idx.push({ kind: 'node', id: n.id, label: n.name, sub: n.track.label }));
            ships.forEach(s => { if (!STARBASE.test(s.name)) idx.push({ kind: 'ship', id: s.name, label: s.name, sub: s.sizeTier }); });
            [1, 2, 3, 4, 5].forEach(t => idx.push({ kind: 'stake', id: t, label: `Claim Stake Tier ${t}`, sub: '' }));
            Object.keys(m.gate.craftingHabs).forEach(id => idx.push({ kind: 'hab', id, label: 'Crafting Hab Tier ' + id.replace(/\D/g, ''), sub: '' }));
            se.bl.forEach(b => { if (!b.comesWithStake) idx.push({ kind: 'building', id: b.id, label: `${b.name} T${b.tier}`, sub: '' }); });
            idx.forEach(x => { x.lc = x.label.toLowerCase(); });
            this.index = idx;
        }
        // up to MAX_HITS results; .total says how many matched. "t3" also finds "tier 3" (stakes, habs, nodes)
        search(q) {
            this.buildIndex();
            const words = q.toLowerCase().split(/\s+/).filter(Boolean); if (!words.length) return Object.assign([], { total: 0 });
            const match = w => { const t = /^t(\d+)$/.exec(w); return t ? (lc => lc.includes(w) || lc.includes('tier ' + t[1])) : (lc => lc.includes(w)); };
            const tests = words.map(match);
            const hits = this.index.filter(x => tests.every(f => f(x.lc)));
            const rank = x => (x.lc === q.toLowerCase() ? 0 : x.lc.startsWith(words[0]) ? 1 : 2);
            return Object.assign(hits.sort((a, b) => rank(a) - rank(b) || a.lc.length - b.lc.length || a.lc.localeCompare(b.lc)).slice(0, MAX_HITS), { total: hits.length });
        }

        // ------------------------------------------------------------------ ownership
        own(node) { this.m.closureOfNode(node).forEach(n => this.owned.add(n.id)); }
        marked() { return this.owned.size - (this.m.start && this.owned.has(this.m.start.id) ? 1 : 0); }   // the free Starting Node aside
        disown(node) {
            // un-research the node and everything researched that needs it
            this.m.nodes.forEach(n => { if (this.owned.has(n.id) && this.m.closureOfNode(n).has(node)) this.owned.delete(n.id); });
            if (this.m.start) this.owned.add(this.m.start.id);
        }

        // ------------------------------------------------------------------ shell
        renderShell() {
            const m = this.m;
            // 2026-10-27: verdict-first like the other tabs - no export-trivia tiles; the legend and the method live in
            // one fold under the tree, and the side panel answers in words
            this.root.innerHTML = `
                <section class="cd-bar">
                    <div class="cd-find">
                        <input type="search" class="sb-input" id="cdrFind" placeholder="Path to… a recipe, a stake building, a hull, a stake or hab tier, a node" autocomplete="off" spellcheck="false">
                        <div class="cd-results" id="cdrResults" hidden></div>
                    </div>
                    <span id="cdrFaction"></span>
                    <div class="chips" id="cdrJump">${m.tracks.map(t => `<button type="button" class="chip" data-jump="${t.key}" style="--c:${TRACK_COLOR[t.key]}"><i></i>${esc(t.label)}</button>`).join('')}</div>
                </section>
                <div class="cd-research">
                    <div class="cd-tree" id="cdrTree"><svg class="cd-svg" id="cdrSvg" xmlns="http://www.w3.org/2000/svg"></svg></div>
                    <aside class="cd-side" id="cdrSide"></aside>
                </div>
                <details class="cd-fold" data-fold="rtree"><summary><b>How to read the tree</b><span>what the outlines mean, and where the numbers come from</span></summary>
                    <div class="cd-legend"><span><i class="lg owned"></i>researched</span><span><i class="lg avail"></i>prerequisites done (level not checked)</span><span><i class="lg locked"></i>locked</span><span><i class="lg path"></i>on the path</span><span><i class="lg nodata"></i>no numbers in the export</span></div>
                    <p class="rx-note">Tree from the SAGE export of ${esc(m.exportDate || 'unknown date')}: ${m.nodes.length} nodes on ${m.tracks.length} tracks; ${num(m.gatedRecipes)} of ${num(m.recipeCount)} recipes and ${num(m.gatedBuildings)} stake buildings sit behind a research gate. A node sits one column right of the deepest node it requires; an arrow is a required research tag. ${m.dropped.length} nodes with no track and no numbers (${esc(m.dropped.slice(0, 3).join(', '))}…) are not drawn. Track XP per level comes from the export's level thresholds; <i>how XP and track points are earned is not in the data</i>. A track's level needs no node on that track: each track's first node asks for a level (1, or 2 on Data Running). Dashed nodes and arrows: named in the export, no numbers yet. ATLAS is the node cost in base units divided by 10<sup>8</sup>.</p>
                </details>`;
            this.tree = this.root.querySelector('#cdrTree'); this.svg = this.root.querySelector('#cdrSvg'); this.side = this.root.querySelector('#cdrSide');
            const L = m.layout;
            this.vbW = PADX * 2 + (L.maxDepth + 1) * COLW; this.vbH = PADY + L.rows * ROWH;
            this.svg.setAttribute('viewBox', `0 0 ${this.vbW} ${this.vbH}`);
        }
        pos(n) { return { x: PADX + n.depth * COLW + PW / 2, y: PADY + (n.y + 0.5) * ROWH }; }

        bind() {
            const root = this.root, find = root.querySelector('#cdrFind'), results = root.querySelector('#cdrResults');
            const showResults = () => {
                const hits = this.search(find.value.trim());
                results.hidden = !hits.length;
                results.innerHTML = hits.map(h => `<button type="button" data-goal-kind="${h.kind}" data-goal-id="${esc(h.id)}"><em>${KIND_LABEL[h.kind]}</em><b>${esc(h.label)}</b>${h.sub ? `<small>${esc(h.sub)}</small>` : ''}</button>`).join('')
                    + (hits.total > hits.length ? `<p class="rx-note">${hits.length} of ${num(hits.total)} shown - type more</p>` : '');
            };
            find.addEventListener('input', showResults);
            find.addEventListener('focus', showResults);
            find.addEventListener('keydown', e => { if (e.key === 'Escape') { results.hidden = true; find.blur(); } if (e.key === 'Enter') { const first = results.querySelector('button'); if (first) first.click(); } });
            document.addEventListener('click', e => { if (!e.target.closest('.cd-find')) results.hidden = true; });
            // a fold's open state survives the side panel's re-renders
            root.addEventListener('toggle', e => { if (e.target.matches && e.target.matches('details[data-fold]')) this.folds[e.target.dataset.fold] = e.target.open; }, true);
            root.addEventListener('click', e => {
                const g = e.target.closest('[data-goal-kind]');
                if (g) { const goal = this.makeGoal(g.dataset.goalKind, g.dataset.goalId); results.hidden = true; find.value = ''; if (goal) { snd('select'); this.setGoal(goal); } return; }
                const j = e.target.closest('[data-jump]'); if (j) { snd('click'); this.jump(j.dataset.jump); return; }
                const fc = e.target.closest('[data-faction]'); if (fc) { snd('select'); window.DeckStore.setFaction(fc.dataset.faction); return; }
                const ga = e.target.closest('[data-gather]'); if (ga) { snd('select'); window.DeckStore.setGather(ga.dataset.gather); return; }
                // the node card renders at the top of the side panel: a click from the side brings it into view; a tap on
                // the tree does too when the side sits below the tree (the one-column phone layout)
                const nd = e.target.closest('[data-node]');
                if (nd) {
                    snd('click'); this.sel = nd.dataset.node; this.update();
                    if (!nd.closest('svg')) { this.scrollToNode(this.m.byId.get(this.sel)); this.showCard(); }
                    else if (this.side.getBoundingClientRect().top >= this.tree.getBoundingClientRect().bottom - 1) this.showCard();
                    return;
                }
                const act = e.target.closest('[data-act]'); if (!act) return;
                const node = this.sel && this.m.byId.get(this.sel);
                if (act.dataset.act === 'own' && node) { this.own(node); snd('success'); }
                else if (act.dataset.act === 'disown' && node) { this.disown(node); snd('deselect'); }
                else if (act.dataset.act === 'own-path') { this.pathSet().forEach(n => this.owned.add(n.id)); snd('success'); }
                else if (act.dataset.act === 'goal-node' && node) { this.setGoal(this.makeGoal('node', node.id)); return; }
                else if (act.dataset.act === 'goal-clear') { this.goal = null; snd('deselect'); }
                else if (act.dataset.act === 'reset') { this.owned = new Set(this.m.start ? [this.m.start.id] : []); snd('deselect'); }
                else if (act.dataset.act === 'close-node') { this.sel = null; }
                this.save(); this.update();
            });
        }
        // the node card's top just below the sticky site header (75 px on desktop, ~290 px when the nav stacks on a
        // phone); left alone when it is already in view
        showCard() {
            const card = this.side.querySelector('.cd-node'); if (!card) return;
            const hd = document.querySelector('header'), top = hd ? Math.max(0, hd.getBoundingClientRect().bottom) : 0, r = card.getBoundingClientRect();
            if (r.top < top + 8 || r.top > window.innerHeight - 120) window.scrollBy({ top: r.top - top - 12, behavior: 'instant' });
        }
        scale() { return this.svg.clientWidth ? this.svg.clientWidth / this.vbW : 1; }
        jump(key) { const b = this.m.layout.bands.find(x => x.track.key === key); if (b) this.tree.scrollTo({ top: Math.max(0, (PADY + b.from * ROWH - 30) * this.scale()), behavior: 'auto' }); }
        // stays at the left edge (the band labels) unless the node is off to the right
        scrollToNode(n) { if (!n) return; const p = this.pos(n), s = this.scale(); this.tree.scrollTo({ top: Math.max(0, p.y * s - this.tree.clientHeight / 2), left: (p.x + 90) * s <= this.tree.clientWidth ? 0 : Math.max(0, p.x * s - this.tree.clientWidth / 2), behavior: 'auto' }); }
        scrollToPath() { const path = Array.from(this.pathSet()).filter(n => !this.owned.has(n.id)); const n = path.sort((a, b) => b.depth - a.depth)[0] || Array.from(this.pathSet())[0]; this.scrollToNode(n); }

        // ------------------------------------------------------------------ render
        update() {
            this.tags = this.m.ownedTags(this.owned);
            this.path = this.pathSet();
            this.pathBill = this.path.size ? this.m.bill(this.path, this.owned) : null;
            this.root.querySelector('#cdrFaction').innerHTML = factionChips();
            this.renderTree(); this.renderSide();
        }

        // recipes the marked research can start; the free Starting Node is not counted as marked and building kits
        // are left out of the startable recipes
        startable() {
            const kit = r => r.typeLabel === 'Building';
            if (this.kitless == null) this.kitless = this.ctx.rc.recipes.filter(r => !kit(r)).length;
            return { can: this.m.craftable(this.tags, kit), all: this.kitless };
        }
        fold(key, title, sub, body, open) {
            const o = this.folds[key] != null ? this.folds[key] : !!open;
            return `<details class="cd-fold" data-fold="${key}"${o ? ' open' : ''}><summary><b>${title}</b><span>${sub}</span></summary>${body}</details>`;
        }
        link(n) { return `<button type="button" class="rx-link" data-node="${n.id}">${esc(n.name)}</button>`; }
        // "A", "A and B", "A, B and C", then "… and N more"
        and(items, cap) {
            const c = cap || items.length, shown = items.slice(0, c), more = items.length - shown.length;
            if (more > 0) return shown.join(', ') + ` and ${num(more)} more`;
            return shown.length < 2 ? shown.join('') : shown.slice(0, -1).join(', ') + ' and ' + shown[shown.length - 1];
        }

        levelText(n) {
            if (!n.hasData) return 'no numbers';
            const parts = Object.entries(n.level).filter(([, v]) => v > 0).map(([k, v]) => `${ABBR[k] || k} ${v}`);
            return parts.length ? parts.join(' · ') : 'no level needed';
        }

        // a node's hover text: the export's sentence (editor notes dropped), else what it grants
        titleText(n) {
            const c = this.titles || (this.titles = new Map());
            if (!c.has(n.id)) { const b = this.m.benefit(n); c.set(n.id, b.text || b.grants.map(g => g.text).join('. ')); }
            return c.get(n.id);
        }

        renderTree() {
            const m = this.m, L = m.layout, path = this.path;
            const bands = L.bands.map((b, i) => {
                const y = PADY + b.from * ROWH - 4, h = b.rows * ROWH + 8;
                // a level the path needs on this track, written on the band even when the path has no node here
                const lvl = this.pathBill ? (this.pathBill.levels[b.track.key] || 0) : 0, xp = lvl ? this.pathBill.xp[b.track.key] : null;
                const need = lvl ? `<tspan class="need" dx="10">LEVEL ${lvl} NEEDED${xp != null ? ' · ' + num(xp) + ' XP' : ''}</tspan>` : '';
                return `<rect class="band${i % 2 ? ' alt' : ''}${lvl ? ' need' : ''}" x="0" y="${y}" width="${this.vbW}" height="${h}"></rect><!--label--><text class="band-label" x="${PADX}" y="${y - 9}" style="fill:${TRACK_COLOR[b.track.key]}">${esc(b.track.label.toUpperCase())} · ${b.count} NODES${need}</text>`;
            });
            // labels are drawn above the arrows so the trunk from the Starting Node does not cut through them
            const bandRects = bands.map(b => b.split('<!--label-->')[0]).join(''), bandLabels = bands.map(b => b.split('<!--label-->')[1]).join('');
            const edge = (p, n, extra) => {
                const a = this.pos(p), b = this.pos(n), x1 = a.x + PW / 2, x2 = b.x - PW / 2, dx = Math.max(12, (x2 - x1) / 2);
                const on = path.has(p) && path.has(n);
                return `<path class="ed${extra}${on ? ' on' : ''}" d="M${x1},${a.y.toFixed(1)} C${x1 + dx},${a.y.toFixed(1)} ${x2 - dx},${b.y.toFixed(1)} ${x2},${b.y.toFixed(1)}"></path>`;
            };
            const edges = [], top = [];
            m.nodes.forEach(n => {
                const ups = n.prereqs.length ? n.prereqs : (n.primary ? [n.primary] : []);
                ups.forEach(p => { const s = edge(p, n, n.hasData ? '' : ' soft'); (path.has(p) && path.has(n) ? top : edges).push(s); });
            });
            const nodes = m.nodes.map(n => {
                const p = this.pos(n), owned = this.owned.has(n.id), avail = !owned && m.available(n, this.tags);
                const cls = ['nd', owned ? 'owned' : avail ? 'avail' : 'locked', path.has(n) ? 'path' : '', this.sel === n.id ? 'sel' : '', n.hasData ? '' : 'nodata'].filter(Boolean).join(' ');
                return `<g class="${cls}" data-node="${n.id}" transform="translate(${p.x},${p.y.toFixed(1)})" style="--tc:${TRACK_COLOR[n.track.key]}"><title>${esc(n.name)} - ${esc(this.levelText(n))}${this.titleText(n) ? '\n' + esc(this.titleText(n)) : ''}</title><rect x="${-PW / 2}" y="${-PH / 2}" width="${PW}" height="${PH}" rx="7"></rect><text y="-2">${esc(trunc(n.name, 22))}</text><text class="sub" y="11">${owned ? '✓ ' : ''}${esc(this.levelText(n))}</text></g>`;
            }).join('');
            this.svg.innerHTML = `<g class="bands">${bandRects}</g><g class="edges">${edges.join('')}</g><g class="edges top">${top.join('')}</g><g class="labels">${bandLabels}</g><g class="nodes">${nodes}</g>`;
            this.svg.classList.toggle('has-path', path.size > 0);
        }

        tagNames(tags) { return tags.map(t => this.m.nodeOfTag.get(t)).filter(Boolean).map(n => n.name); }

        // the path in order; an open row (prerequisites done) says so, researched rows are dimmed
        stepsHTML(bill) {
            const m = this.m;
            return `<div class="cd-steps">${bill.rows.map(({ node: n, owned }) => {
                const go = !owned && m.available(n, this.tags);
                return `<button type="button" class="cd-step${owned ? ' done' : go ? ' go' : ''}${this.sel === n.id ? ' on' : ''}" data-node="${n.id}"><i class="dot" style="background:${TRACK_COLOR[n.track.key]}"></i><b>${esc(n.name)}</b><span>${owned ? 'researched' : (go ? 'open · ' : '') + esc(this.levelText(n))}</span></button>`;
            }).join('')}</div>`;
        }

        levelsHTML(bill) {
            const T = window.CommandDeck.ResearchModel.TRACK_BY_KEY;
            const lv = Object.entries(bill.levels).filter(([, v]) => v > 0).sort((a, b) => (bill.xp[b[0]] || 0) - (bill.xp[a[0]] || 0));
            const maxXp = Math.max(1, ...lv.map(([k]) => bill.xp[k] || 0));
            return `<div class="ch cd-levels">${lv.map(([k, v]) => `<div class="ch-row"><span class="ch-lbl">${esc((T.get(k) || { label: k }).label)} L${v}</span><div class="ch-bar"><b style="width:${(100 * (bill.xp[k] || 0) / maxXp).toFixed(1)}%;background:${TRACK_COLOR[k] || '#2a9fcf'}"><span class="ct">${esc((T.get(k) || { label: k }).label)} level ${v}: ${bill.xp[k] == null ? 'no threshold in the export' : num(bill.xp[k]) + ' XP'}</span></b></div><span class="ch-val">${bill.xp[k] == null ? '–' : num(bill.xp[k]) + ' XP'}</span></div>`).join('')}</div>${bill.levels.CouncilRank ? '<p class="rx-note">Council Rank levels cost 1 XP each in the export.</p>' : ''}`;
        }

        // a recipe's raws: where each comes from and what that adds to the research
        rawsHTML(g) {
            const m = this.m, S = window.DeckStore.s, rows = g.gather.rows;
            const line = r => {
                const how = r.route === 'stake' ? `T1 stake · ${this.tagNames(m.buildingGate(r.extractor.id)).map(esc).join(', ') || 'no extractor gate'}`
                    : r.route === 'fleet' ? `fleet${r.why ? ' · ' + esc(r.why) : ''}` : esc(r.why || 'no source');
                const zone = r.cls ? `${ZONE_TEXT[r.cls]}${r.zoneNode ? ' → ' + esc(r.zoneNode.name) : ''}` : '';
                const where = r.body ? `Best body: ${r.body.name} (${r.body.system}), richness ${num(r.body.richness)}${r.body.belt ? ', a belt' : ''}` : '';
                return `<div class="cd-raw-row ${r.cls || 'none'}" title="${esc(where)}"><b>${esc(r.res.name)}</b><em>${zone}</em><span>${how}</span></div>`;
            };
            const alts = new Map(); rows.forEach(r => { if (r.zoneNode && r.zoneAlts.length) alts.set(r.cls, r); });
            const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
            const altText = Array.from(alts.values()).map((r, i) => `${i ? ZONE_TEXT[r.cls] : cap(ZONE_TEXT[r.cls])} access is also granted by ${r.zoneAlts.map(n => `${esc(n.name)} (${esc(n.track.label)})`).join(', ')}`).join('; ');
            return `<div class="cd-raw-rows">${rows.map(line).join('')}</div>
                <p class="rx-note">${S.gather === 'stake' ? 'A tier-1 stake is the least research a stake needs. A tier-N stake also needs Mining Gear TN, Structural Complexity TN and the Claim Stakes tier N node. ' : ''}The export puts no research gate on what a ship may mine, so a fleet adds only zone access; the hull's size node is on the hull's own path.${altText ? ' ' + altText + '; the export does not say whether each of these nodes covers every activity, so the one on the activity\'s own track, or else the cheapest, is shown.' : ''}</p>`;
        }

        // ---- the goal, answered in words: what it costs, the longest grind, what to research now
        goalHTML() {
            const m = this.m, g = this.goal, S = window.DeckStore.s, T = window.CommandDeck.ResearchModel.TRACK_BY_KEY;
            const bill = m.bill(this.path, this.owned), track = k => esc((T.get(k) || { label: k }).label);
            const lv = Object.entries(bill.levels).filter(([, v]) => v > 0);
            const gathering = g.kind === 'recipe' && S.gather !== 'hand';
            const items = [];
            let h2;
            const pts = Object.values(bill.points).reduce((a, v) => a + v, 0);
            const blankGoal = g.node && !g.node.hasData;                     // a node the export names with no numbers
            if (!this.path.size) h2 = `<b>${esc(g.label)}</b> needs no research.`;
            else if (blankGoal) h2 = `<b>${esc(g.label)}</b>: the export names this node but gives it no numbers yet.`;
            else if (!bill.todo) h2 = `<b>${esc(g.label)}</b>: everything on the path is researched.`;
            else h2 = `<b>${esc(g.label)}</b>: ${plural(bill.todo, 'node')} to research, ${num(bill.atlas)} ATLAS${pts ? `, ${plural(pts, 'track point')}` : ''}.`;
            if (bill.todo && !blankGoal) {
                // the longest grind is the track level that takes the most XP; equal XP is a tie, never a winner. Level 1
                // costs 1 XP on every track and Council Rank 1 XP a level, so neither is a grind (review 2026-10-27: a
                // quarter of all goals crowned a 1 XP level-1 as "the longest grind")
                const grind = lv.filter(([k]) => k !== 'CouncilRank' && bill.xp[k] != null && bill.xp[k] > 1).sort((a, b) => bill.xp[b[0]] - bill.xp[a[0]]);
                if (grind.length) {
                    const top = bill.xp[grind[0][0]], tied = grind.filter(([k]) => bill.xp[k] === top), rest = lv.filter(x => !tied.includes(x));
                    const name = ([k, v]) => `${track(k)} to level ${v}`;
                    const also = rest.length ? `; the path also needs ${this.and(rest.map(([k, v]) => `${track(k)} ${v}`))}` : '';
                    items.push(tied.length > 1 ? `${this.and(tied.map(x => `<b>${name(x)}</b>`))} tie as the longest grind: ${num(top)} XP each${also}.` : `The longest grind is <b>${name(tied[0])}</b>: ${num(top)} XP${also}.`);
                } else if (lv.length) items.push(`Levels needed: ${this.and(lv.map(([k, v]) => `${track(k)} ${v}`))}${lv.every(([k, v]) => v === 1 || k === 'CouncilRank') ? '; none of them is a grind (a first level is 1 XP, a Council Rank level 1 XP)' : ' (no XP threshold in the export)'}.`);
                const open = bill.rows.filter(r => !r.owned && m.available(r.node, this.tags)).map(r => r.node);
                const blank = bill.rows.filter(r => !r.owned && !r.node.hasData).map(r => r.node);
                items.push(open.length ? `Research now: ${this.and(open.map(n => this.link(n)), 4)} <span class="cd-dim">(${num(open.length)} of ${num(bill.todo)} open; levels not checked)</span>.`
                    : `Nothing on the path is open yet: ${blank.length ? `${this.and(blank.map(n => this.link(n)), 3)} ${blank.length === 1 ? 'has' : 'have'} no numbers in the export` : 'a prerequisite has no numbers in the export'}.`);
                if (gathering) {
                    const cb = m.bill(m.closure(g.craft), this.owned), add = bill.todo - cb.todo, what = g.raw ? 'the raw' : 'the raws';
                    items.push(add ? `Gathering ${what} adds <b>${plural(add, 'node')}</b> (${num(bill.atlas - cb.atlas)} ATLAS)${g.raw ? '' : `; crafting alone is ${plural(cb.todo, 'node')}`}.` : `Gathering ${what} adds no research.`);
                }
                const tok = Object.entries(bill.tokens);
                if (tok.length) items.push(`Also spent as tokens: ${this.and(tok.map(([k, v]) => `${num(v)} ${esc(k)}`))}.`);
            }
            const modes = [['stake', 'Claim stakes'], ['fleet', 'A mining fleet'], ['hand', 'Already in hand']];
            const chips = g.kind === 'recipe' ? `<div class="cd-rs-gather"><span>Raws from</span><div class="chips">${modes.map(([k, l]) => `<button type="button" class="chip${S.gather === k ? ' on' : ''}" data-gather="${k}">${l}</button>`).join('')}</div>${S.gather === 'hand' ? '<small>the path is the crafting research only</small>' : ''}</div>` : '';
            let why = '';
            if (g.kind === 'recipe') {
                const own = this.tagNames(g.own), extra = this.tagNames(g.craft.filter(t => !g.own.includes(t)));
                why = `${g.raw ? 'A raw is gathered, not crafted: no crafting gate applies.' : own.length ? `The recipe's own gates: ${own.map(esc).join(', ')}.` : 'The recipe itself has no research gate.'}${extra.length ? ` Its chain adds: ${extra.map(esc).join(', ')}.` : ''}`;
            } else if (g.kind === 'building') why = `${g.ungated ? 'The gate map has no entry for this building; only the stake tier is gated.' : `Building gates: ${this.tagNames(g.own).map(esc).join(', ')}.`} The path includes owning a claim stake of its tier${g.site === 'layout' ? ' and the gates of the hubs, crew quarters and power plants a stake lays out to run it' : g.site === 'tags' ? ' and the gates of the hubs its placement tags name (no planet feeds its inputs, so no full stake layout)' : ''}.`;
            else if (g.kind === 'ship') why = `${g.free ? 'XXS hulls need no size node: the Starting Node grants them.' : g.noNode ? 'No size node in the export covers this hull class.' : 'Hull sizes are Pilot nodes that also need a Council Rank level.'} Building the hull is a recipe: search its name for that path.`;
            const rows = gathering ? g.gather.rows : [], stakes = rows.filter(r => r.route === 'stake').length, fleets = rows.filter(r => r.route === 'fleet').length, away = rows.filter(r => r.cls && r.cls !== 'own').length;
            const rawSub = `${plural(rows.length, 'raw')}${stakes ? `, ${num(stakes)} by stake` : ''}${fleets ? `, ${num(fleets)} by fleet` : ''}${away ? `, ${num(away)} outside your low-risk zone` : ''}`;
            const done = bill.rows.filter(r => r.owned && r.node !== m.start).length;          // the free Starting Node aside
            return `<section class="cd-verdict rs cd-goal">
                    <div class="cd-rs-ctx"><p class="cd-verdict-ctx">Path to · ${esc(KIND_LABEL[g.kind])}${g.sub ? ' · ' + esc(g.sub) : ''}</p>${g.link ? `<a href="${g.link}" target="_blank" rel="noopener">Recipe Explorer</a>` : ''}<button type="button" class="sb-btn ghost" data-act="goal-clear">Clear</button></div>
                    <h2>${h2}</h2>
                    ${items.length ? `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
                    ${chips}
                    ${this.path.size ? `<h4 class="cd-rs-h">The path, in order${done ? ` · ${num(done)} already researched` : ''}</h4>${this.stepsHTML(bill)}` : ''}
                    ${bill.todo && !blankGoal ? '<div class="rx-actions"><button type="button" class="sb-btn" data-act="own-path">Mark the whole path researched</button></div>' : ''}
                </section>
                ${bill.todo && lv.length ? this.fold('rlevels', 'Track levels and XP', `${plural(lv.length, 'track')}${pts ? `, ${num(pts)} track points` : ''}`, this.levelsHTML(bill)) : ''}
                ${gathering && rows.length ? this.fold('rraws', 'Where the raws come from', rawSub, this.rawsHTML(g)) : ''}
                ${why ? this.fold('rwhy', 'Why these nodes', 'the gates behind the path', `<p class="rx-note">${why}</p>`) : ''}`;
        }

        // ---- a node: whether you can research it now and what it costs, in one sentence; what it gives; what it gates
        nodeHTML(n) {
            const m = this.m, owned = this.owned.has(n.id), avail = m.available(n, this.tags), u = m.unlocks(n);
            const missing = n.reqTags.filter(t => !this.tags.has(t)).map(t => m.nodeOfTag.get(t)).filter(Boolean);
            const b = m.benefit(n), gatesAny = u.recipes || u.buildings || u.stakes.length || u.habs.length;
            const grants = b.grants.map(g => `<li>${esc(g.text)}${g.list && g.list.length ? `<small>${esc(g.list.join(', '))}</small>` : ''}</li>`).join('');
            const benefit = `<div class="rx-benefit">${b.text ? `<p>${esc(b.text)}</p>` : ''}${grants ? `<ul class="cd-grants">${grants}</ul>` : ''}${!b.text && !grants && !gatesAny ? `<p class="rx-note">The export gives this node no description and no effect of its own${n.tags.length ? '; it is a step on the way to what it leads to' : ''}.</p>` : ''}</div>`;
            const leads = b.leadsTo.length ? `<p class="rx-leads"><span>Leads to</span> ${b.leadsTo.map(c => this.link(c)).join(', ')}</p>` : '';
            const cost = [`${num(n.atlas / window.CommandDeck.ATLAS_DECIMALS)} ATLAS`]
                .concat(Object.entries(n.points).filter(([, v]) => v > 0).map(([k, v]) => `${num(v)} ${esc(ABBR[k] || k)} track point${v === 1 ? '' : 's'}`))
                .concat(Object.entries(n.tokens).map(([k, v]) => `${num(v)} ${esc(m.tokenNames[k] || 'cargo #' + k)}`));
            const lvl = Object.entries(n.level).filter(([, v]) => v > 0).map(([k, v]) => `${esc(ABBR[k] || k)} level ${v}`);
            const costText = `costs ${this.and(cost)}${lvl.length ? `; needs ${this.and(lvl)}` : ''}`;
            const state = !n.hasData ? '<p class="rx-note">The export names this node but gives it no cost, requirement or effect yet.</p>'
                : owned ? '<p class="cd-state ok"><b>Researched.</b></p>'
                : avail ? `<p class="cd-state go"><b>Open now:</b> it ${costText}.</p>`
                : `<p class="cd-state no"><b>Locked:</b> research ${missing.length ? this.and(missing.map(x => this.link(x))) : 'a prerequisite'} first. Then it ${costText}.</p>`;
            const gateWords = [u.recipes ? plural(u.recipes, 'recipe') : '', u.buildings ? plural(u.buildings, 'stake building') : '', u.stakes.length ? 'owning ' + u.stakes.map(s => esc(s.replace(/-/g, ' '))).join(', ') : '', u.habs.length ? 'owning ' + u.habs.map(s => esc(s.replace('hab-t', 'crafting hab tier '))).join(', ') : ''].filter(Boolean);
            const gates = gatesAny ? `<p class="cd-rs-gates">It is a gate of ${gateWords.join('; and of ')}.</p>` : (n.hasData && n.tags.length && (b.text || grants) ? '<p class="rx-note">No recipe or stake building names this node as a gate.</p>' : '');
            const maxT = Math.max(1, ...u.byType.map(x => x[1]));
            const byType = u.byType.length ? this.fold('rgateof', 'Recipes it gates, by type', `${plural(u.recipes, 'recipe')} in ${plural(u.byType.length, 'type')}`, `<div class="ch">${u.byType.map(([k, c]) => `<div class="ch-row"><span class="ch-lbl">${esc(k)}</span><div class="ch-bar"><b style="width:${(100 * c / maxT).toFixed(1)}%;background:${TRACK_COLOR[n.track.key]}"><span class="ct">${esc(k)}: ${plural(c, "recipe")}</span></b></div><span class="ch-val">${num(c)}</span></div>`).join('')}</div>`) : '';
            const actions = n.hasData ? `<div class="rx-actions">${owned ? (n === m.start ? '' : '<button type="button" class="sb-btn ghost" data-act="disown">Un-mark (and what needs it)</button>') : '<button type="button" class="sb-btn" data-act="own">Mark researched, with its prerequisites</button>'}${this.goal && this.goal.node === n ? '' : '<button type="button" class="sb-btn ghost" data-act="goal-node">Show its path</button>'}</div>` : '';
            return `<section class="rx-panel cd-node" style="--tc:${TRACK_COLOR[n.track.key]}">
                    <div class="cd-rs-ctx"><p class="cd-verdict-ctx">Node · ${esc(n.track.label)}${n.scalability ? ' · ' + esc(SCALE_WORD[n.scalability] || n.scalability.toLowerCase()) : ''}</p><button type="button" class="sb-btn ghost" data-act="close-node">Close</button></div>
                    <h2 class="cd-title">${esc(n.name)}</h2>
                    ${state}
                    ${benefit}
                    ${gates}
                    ${leads}
                    ${actions}
                </section>${byType}`;
        }

        // ---- what to research next, anywhere: led by a sentence with a tie rule; bars only for nodes that gate recipes
        nextHTML(compact) {
            const m = this.m;
            const next = m.nodes.filter(x => !this.owned.has(x.id) && m.available(x, this.tags)).map(x => ({ n: x, gated: m.unlocks(x).recipes, done: m.completes(x, this.tags) }))
                .sort((a, b) => b.done - a.done || b.gated - a.gated || a.n.depth - b.n.depth || a.n.order - b.n.order);
            const { can, all } = this.startable(), marked = this.marked();
            let lead;
            if (!next.length) lead = 'Nothing is open: every node with numbers is researched or still locked.';
            else if (next[0].done > 0) {
                const top = next[0].done, tied = next.filter(x => x.done === top);
                lead = tied.length > 1 ? `${this.and(tied.map(x => this.link(x.n)), 4)} tie: each starts ${plural(top, 'recipe')} the moment you research it.` : `${this.link(next[0].n)} starts the most recipes the moment you research it: ${num(top)}.`;
            } else {
                const topG = Math.max(...next.map(x => x.gated)), tied = next.filter(x => x.gated === topG);
                lead = topG > 0 ? `No open node starts a recipe on its own yet. ${tied.length > 1 ? `${this.and(tied.map(x => this.link(x.n)), 4)} are each a gate of ${plural(topG, 'recipe')}.` : `${this.link(tied[0].n)} is a gate of the most: ${plural(topG, 'recipe')}.`}`
                    : next.length === 1 ? `The one open node, ${this.link(next[0].n)}, is not a gate of a recipe yet.` : `None of the ${plural(next.length, 'open node')} is a gate of a recipe yet: they open the tracks.`;
            }
            const gated = next.filter(x => x.gated > 0), idle = next.filter(x => !x.gated);
            const maxG = Math.max(1, ...gated.map(x => x.gated));
            const bars = gated.length ? `<div class="ch">${gated.slice(0, 12).map(x => `<div class="ch-row cd-next-row"><button type="button" class="ch-lbl rx-link" data-node="${x.n.id}"><i class="dot" style="background:${TRACK_COLOR[x.n.track.key]}"></i>${esc(x.n.name)}</button><div class="ch-bar"><b style="width:${(100 * x.gated / maxG).toFixed(1)}%;background:${TRACK_COLOR[x.n.track.key]}"><span class="ct">${esc(x.n.name)}: gate of ${plural(x.gated, "recipe")}${x.done ? `, ${num(x.done)} of them startable the moment you research it` : ''} · ${esc(this.levelText(x.n))}</span></b></div><span class="ch-val">${num(x.gated)}${x.done ? `<em class="cd-done">+${num(x.done)}</em>` : ''}</span></div>`).join('')}</div>
                <p class="rx-note">${gated.length > 12 ? `12 of ${num(gated.length)} shown. ` : ''}Bars: recipes each node is a gate of; a green +N start the moment you research it. Most recipes need several gates at once, so a node can gate hundreds and complete none yet.</p>` : '';
            const also = idle.length ? `<p class="cd-also"><span>${gated.length ? 'Also open' : 'Open now'}</span>${idle.map(x => `<button type="button" class="rx-link" data-node="${x.n.id}"><i class="dot" style="background:${TRACK_COLOR[x.n.track.key]}"></i>${esc(x.n.name)}</button>`).join('')}</p>` : '';
            const head = `${plural(marked, 'node')} marked researched · ${num(can)} of ${num(all)} recipes startable`;
            const reset = marked ? '<button type="button" class="sb-btn ghost" data-act="reset">Reset</button>' : '';
            const body = `<p class="cd-rs-lead">${lead}</p>${bars}${also}`;
            if (compact) return this.fold('rnext', 'Research next, anywhere', head, body + (reset ? `<div class="rx-actions">${reset}</div>` : ''));
            return `<section class="rx-panel cd-next"><div class="rx-panel-head"><h3>Research next</h3><span>${head}</span>${reset}</div>${body}</section>`;
        }

        renderSide() {
            // the clicked node first (it is what the eye follows), then the goal, then what is open anywhere
            const n = this.sel && this.m.byId.get(this.sel), parts = [];
            if (n) parts.push(this.nodeHTML(n));
            if (this.goal) parts.push(this.goalHTML());
            if (!this.goal && !n) parts.push(`<section class="cd-verdict rs cd-intro"><p class="cd-verdict-ctx">Research</p><h2>What do you want to build, mine or fly?</h2><ul><li>Type it in the box above - a recipe, a stake building, a hull, a stake or hab tier - and the tree lights the nodes you need and prices them.</li><li>Click any node for what it costs, gives and gates.</li><li>Mark nodes researched and everything counts only what is left.</li></ul></section>`);
            parts.push(this.nextHTML(!!(this.goal || n)));
            this.side.innerHTML = parts.join('');
        }
    }

    window.DeckResearchTab = ResearchTab;
})();
