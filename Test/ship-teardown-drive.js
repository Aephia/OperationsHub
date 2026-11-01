// Real browser drive of the Ship Explorer teardown. Needs the teardown skill's playwright (~/.claude/skills/teardown, npm ci).
//   node Test/ship-teardown-drive.js            exit 1 on any FAIL
// OLD_DIR=<dir> serves ship-visual.js and ship-teardown.js from <dir>, to prove a section fails with its fix removed.
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {createRequire} = require('module');

const ROOT = path.join(__dirname, '..');
const req = createRequire(path.join(os.homedir(), '.claude/skills/teardown/node_modules/x.js'));
const {chromium} = req('playwright');
const OLD = process.env.OLD_DIR;
const MIME = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.glb': 'model/gltf-binary', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg'};

let pass = 0, fail = 0;
const check = (name, ok, detail) => { if (ok) pass++; else fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail !== undefined ? ': ' + JSON.stringify(detail) : ''}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const faults = {delayGlb: 0, hangGlb: false, noFit: false, delayFormulas: 0};
const server = http.createServer((q, r) => {
  const rel = decodeURIComponent(q.url.split('?')[0]);
  let p = path.join(ROOT, rel);
  if (OLD && /ship-visual\.js$|ship-teardown\.js$/.test(rel)) p = path.join(OLD, path.basename(rel));
  const send = () => fs.readFile(p, (e, b) => {
    if (e) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, {'content-type': MIME[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store'});
    r.end(b);
  });
  if (rel.endsWith('.glb') && faults.hangGlb) return; // never answers
  if (rel.endsWith('ship-fit.js') && faults.noFit) { r.writeHead(404); r.end(); return; }
  if (rel.endsWith('ship-formulas.json') && faults.delayFormulas) { setTimeout(send, faults.delayFormulas); return; }
  if (rel.endsWith('.glb') && faults.delayGlb) { setTimeout(send, faults.delayGlb); return; }
  send();
});

(async () => {
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const port = server.address().port;
  const browser = await chromium.launch({headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist']});
  const page = await browser.newPage({viewport: {width: 1600, height: 900}});
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  // every WebGL context the page ever makes, so "released" is read from the contexts themselves
  await page.addInitScript(() => {
    window.__ctx = [];
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...a) {
      const c = orig.call(this, type, ...a);
      if (c && /webgl/.test(type) && !window.__ctx.includes(c)) window.__ctx.push(c);
      return c;
    };
    window.__liveCtx = () => window.__ctx.filter((c) => !c.isContextLost()).length;
  });
  await page.goto(`http://127.0.0.1:${port}/ShipExplorer/index.html`);
  await page.waitForFunction(() => window.shipExplorer && window.shipExplorer.ships && window.shipExplorer.ships.length && window.shipExplorer.componentDataLoaded, null, {timeout: 60000});
  const open = (n) => page.evaluate((name) => { const a = window.shipExplorer; a.openShipModal(a.ships.find((s) => s.name === name)); }, n);
  const close = () => page.evaluate(() => window.shipExplorer.closeShipModal());
  const live = () => page.waitForFunction(() => document.querySelector('.ship-modal-visual.td-live'), null, {timeout: 30000});
  const dbg = () => page.evaluate(() => window.shipExplorer._teardown && window.shipExplorer._teardown.debug());
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'Images/ships/models/manifest.json'), 'utf8'));
  const ships = JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/ships-data.json'), 'utf8'));

  // A. the toggle, with real clicks
  await open('Calico Guardian'); await live();
  const raw = (Array.isArray(ships) ? ships : ships.ships || Object.values(ships)).find((s) => s.name === 'Calico Guardian').configurations.find((c) => c.name === 'Kinetic Damage Max');
  await page.click('[data-cfg-name="Kinetic Damage Max"]');
  await sleep(2600);
  let d = await dbg();
  const geo = await page.evaluate(() => {
    const q = document.querySelector('.td-stage').getBoundingClientRect(), t = window.shipExplorer._teardown;
    const hit = (x, y) => { const e = document.elementFromPoint(x, y); return e ? e.className : ''; };
    return {w: q.width, h: q.height, canvas: [t.canvas.width, t.canvas.height], centre: hit(800, 400), cards: document.querySelectorAll('.td-co').length,
      cardBoxes: [...document.querySelectorAll('.td-co')].map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.right, r.top, r.bottom]; }),
      panels: ['.bay-panel.left', '.bay-panel.right'].map((s) => { const r = document.querySelector(s).getBoundingClientRect(); return [r.left, r.right]; })};
  });
  check('A the 3D stage fills the window', geo.w === 1600 && geo.h === 900 && geo.canvas[0] >= 1600 && geo.canvas[1] >= 900, [geo.w, geo.h, geo.canvas]);
  check('A the ship area between the panels is the canvas, not a panel', /td-gl/.test(geo.centre), geo.centre);
  check('A callout cards show and stay between the panels', geo.cards > 0 && geo.cardBoxes.every((b) => b[0] >= geo.panels[0][1] - 1 && b[1] <= geo.panels[1][0] + 1), geo.cardBoxes.slice(0, 2));
  const shot = await page.screenshot({clip: {x: 400, y: 130, width: 800, height: 450}});
  const fg = await page.evaluate(async (b64) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data; let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] > 120) n++;
    return n / (d.length / 4);
  }, shot.toString('base64'));
  check('A the ship is really drawn: bright pixels between the panels', fg > 0.02, +fg.toFixed(4));
  const truth = await page.evaluate(() => {
    const a = window.shipExplorer, ship = a.ships.find((s) => s.name === 'Calico Guardian');
    const bad = [];
    document.querySelectorAll('.srow').forEach((row) => {
      const path = row.dataset.path.split('.'), want = a.formatStatValue(a.statValue(ship, 'Kinetic Damage Max', path)), got = row.querySelector('.sv b').textContent;
      if (want !== got) bad.push([row.dataset.path, want, got]);
    });
    const row = (p) => document.querySelector(`.srow[data-path="${p}"]`);
    const t = a._teardown, o = new (t.camera.position.constructor)(0, 0, 0).project(t.camera);
    const cx = (o.x * 0.5 + 0.5) * t.w, cy = (-o.y * 0.5 + 0.5) * t.h;
    return {bad, rows: document.querySelectorAll('.srow').length, cool: row('stats.travel.warpCoolDown').className, ammo: row('stats.capacities.ammoCapacity').className,
      tips: document.querySelectorAll('.td-leaders circle[r="3"]').length, cards: document.querySelectorAll('.td-co').length,
      guns: document.querySelector('.td-co[data-group="weapons"]') ? t.items.weapons.slice(0, t.mounts.length).filter((q) => q.on).length : 0,
      missed: [...document.querySelectorAll('.td-co')].filter((c) => {
        const it = t.items[c.dataset.group].find((q) => q.on), p = it.obj.position.clone().project(t.camera), x = (p.x * 0.5 + 0.5) * t.w, y = (-p.y * 0.5 + 0.5) * t.h;
        return ![...document.querySelectorAll('.td-leaders circle[r="3"]')].some((m) => Math.hypot(m.cx.baseVal.value - x, m.cy.baseVal.value - y) < 8);
      }).map((c) => c.dataset.group),
      overlaps: (() => { const rs = [...document.querySelectorAll('.td-co')].map((e) => e.getBoundingClientRect()); let n = 0; rs.forEach((a, i) => rs.slice(i + 1).forEach((b) => { if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) n++; })); return n; })(),
      count: document.querySelector('.bay-count').textContent,
      centre: [cx, cy, t.ins.l + (t.w - t.ins.l - t.ins.r) / 2, t.ins.t + (t.h - t.ins.t - t.ins.b) / 2]};
  });
  check('A every readout row lands on the exact configured value', truth.rows > 20 && truth.bad.length === 0, {rows: truth.rows, bad: truth.bad.slice(0, 3)});
  check('A a lower warp cooldown reads as better, more ammo too', /\bup\b/.test(truth.cool) && /\bup\b/.test(truth.ammo), [truth.cool, truth.ammo]);
  check('A every card has a leader landing on its part; the weapons card one per real gun', truth.guns > 0 && truth.tips === truth.cards - 1 + truth.guns && truth.missed.length === 0, [truth.tips, truth.cards, truth.guns, truth.missed]);
  check('A callout cards do not overlap', truth.overlaps === 0, truth.overlaps);
  check('A the fitted count is the real one and names its scale', /39/.test(truth.count) && /Largest fit on this hull: 44/.test(truth.count), truth.count);
  // Tab stays inside the bay and reaches the Close button
  const tab = await page.evaluate(() => [...document.querySelectorAll('.bay button')].filter((b) => b.getClientRects().length > 0).map((b) => b.className).pop());
  await page.focus('.ship-modal-close');
  await page.keyboard.press('Tab');
  const wrapped = await page.evaluate(() => !!document.activeElement.closest('.bay'));
  check('A Tab wraps inside the bay, Close is in the loop', /ship-modal-close/.test(tab) && wrapped, [tab, wrapped]);
  check('A the page behind cannot scroll while the bay is open', (await page.evaluate(() => document.body.style.overflow)) === 'hidden');
  check('A the hull is centred in the free region', Math.abs(truth.centre[0] - truth.centre[2]) < 2 && Math.abs(truth.centre[1] - truth.centre[3]) < 2, truth.centre);
  // the callout must credit the part that does it: recomputed here by stripping groups through the calculator directly
  const credit = await page.evaluate(() => {
    const a = window.shipExplorer, ship = a.ships.find((s) => s.name === 'Calico Guardian'), cfg = ship.configurations.find((c) => c.name === 'Kinetic Damage Max');
    const strip = (cat, type) => { const c = JSON.parse(JSON.stringify(cfg)); if (type) delete c.components[cat][type]; else c.components[cat] = {}; return a.configCalculator.calculateModifiedStats(ship, c).values.damage; };
    const full = a.configCalculator.calculateModifiedStats(ship, cfg).values.damage;
    const info = a.calloutInfo(ship, 'Kinetic Damage Max');
    return {fullEqualsNoWeapons: strip('Ship Weapons') === full, bayChanges: strip('Ship Component', 'Missile Bay') !== full, weaponsDamage: (info.weapons || []).some((r) => r[0] === 'Damage'), bayDamage: (info.missileBay || []).some((r) => r[0] === 'Damage')};
  });
  check('A callouts credit damage to what really moves it', credit.fullEqualsNoWeapons === !credit.weaponsDamage && credit.bayChanges === credit.bayDamage, credit);
  // a toggle high -> low must animate inside the bar: sampled every frame
  const sweep = await page.evaluate(() => new Promise((done) => {
    document.querySelector('[data-cfg-name="Default"]').click();
    const box = document.querySelector('[data-readout]'), ammo = document.querySelector('.srow[data-path="stats.capacities.ammoCapacity"] .sv b');
    let maxFill = 0, over = 0, values = new Set(), n = 0;
    const tick = () => {
      document.querySelectorAll('.srow .fill').forEach((f) => { maxFill = Math.max(maxFill, parseFloat(f.style.width) || 0); });
      over = Math.max(over, box.scrollWidth - box.clientWidth);
      values.add(ammo.textContent);
      if (++n < 70) requestAnimationFrame(tick); else done({maxFill, over, distinct: values.size, n});
    };
    requestAnimationFrame(tick);
  }));
  check('A readout bars stay inside the row on every frame', sweep.maxFill <= 100 && sweep.over <= 0, sweep);
  check('A the readout really animates: intermediate values appear', sweep.distinct > 8, sweep.distinct);
  await page.click('[data-cfg-name="Kinetic Damage Max"]');
  await sleep(2600);
  check('A click a config: hull opens', d.explode === 1 && d.view === 'teardown' && d.moved > 1, [d.explode, d.view, d.moved]);
  check('A weapons drawn = the record (8 kinetic)', d.drawn.weapons === raw.components['Ship Weapons'].Kinetic.items.length, d.drawn.weapons);
  check('A a chip names the real count', (await page.textContent('.fit-list')).includes('Ammo Module'), undefined);
  const chipGroup = await page.getAttribute('.fit-chip', 'data-fit-group');
  check('A chips carry their 3D group', !!chipGroup, chipGroup);
  await page.click('[data-cfg-name="Default"]');
  await sleep(1600);
  d = await dbg();
  check('A click Default: hull closes, no parts', d.explode === 0 && d.view === 'solid' && Object.values(d.drawn).every((n) => n === 0), [d.explode, d.view]);
  await close();

  // K. the weapons sit on the real guns, and the machinery appears with the teardown
  await open('Calico Guardian'); await live(); await sleep(300);
  const closedWorks = await page.evaluate(() => { const t = window.shipExplorer._teardown; return {works: t.works.filter((w) => w.group.visible).length, hoses: t.hoses.visible, feeds: t.feeds.visible}; });
  check('K closed hull: no machinery, no hoses, no feed lines', closedWorks.works === 0 && !closedWorks.hoses && !closedWorks.feeds, closedWorks);
  await page.click('[data-cfg-name="Kinetic Damage Max"]');
  await sleep(2800);
  const seat = await page.evaluate(() => {
    const t = window.shipExplorer._teardown, V = t.camera.position.constructor, ex = t.explode.v, out = [];
    const tips = [...document.querySelectorAll('.td-leaders circle[r="3"]')].map((c) => [c.cx.baseVal.value, c.cy.baseVal.value]);
    const pods = t.items.weapons.filter((q) => q.on);
    t.mounts.forEach((m, i) => {
      const pod = t.items.weapons[i], home = t.mountHome(m, ex, new V()), piece = t.pieces.find((p) => p.i === m.si && p.s === m.s && p.l === m.l);
      const moved = home.clone().sub(m.p), p = pod.obj.position.clone().project(t.camera), x = (p.x * 0.5 + 0.5) * t.w, y = (-p.y * 0.5 + 0.5) * t.h;
      out.push({off: pod.obj.position.distanceTo(home) - t.R * 0.2, ride: m.part ? 0 : moved.distanceTo(piece.group.position), part: !!m.part, tip: tips.some((q) => Math.hypot(q[0] - x, q[1] - y) < 8)});
    });
    const feedLen = (() => { const m4 = new (t.camera.matrix.constructor)(); t.feeds.getMatrixAt(0, m4); return new V().setFromMatrixColumn(m4, 1).length(); })();
    const far = pods.slice(t.mounts.length).map((q, i) => q.obj.position.distanceTo(t.mountHome(t.mounts[(i + t.mounts.length) % t.mounts.length], ex, new V())) / t.R);
    let hoseMax = 0; const mx = new (t.camera.matrix.constructor)();
    for (let i = 0; i < t.hoses.count; i++) { t.hoses.getMatrixAt(i, mx); hoseMax = Math.max(hoseMax, new V().setFromMatrixColumn(mx, 1).length()); }
    return {out, far, feedLen, pods: pods.length, works: t.works.filter((w) => w.group.visible).length, hoses: t.hoses.visible, hoseMax, feeds: t.feeds.visible, leds: t.works.filter((w) => w.group.children.length === 2).length};
  });
  check('K each gun carries a pod, riding its own hull piece', seat.out.length === 5 && seat.out.every((q) => Math.abs(q.off) < 1e-3 && q.ride < 1e-3), seat.out);
  check('K the weapons card reaches every gun', seat.out.every((q) => q.tip), seat.out.map((q) => q.tip));
  check('K more weapons than guns: the extras stay beside a gun', seat.pods === 8 && seat.far.length === 3 && seat.far.every((q) => q < 1.6), seat.far);
  check('K open hull: machinery, stretched hoses, feed lines, lights', seat.works === 7 && seat.hoses && seat.hoseMax > 0.02 && seat.feeds && seat.feedLen > 0.005 && seat.leds === 7, seat);
  await close();
  // a hull with no proven gun data keeps the rack, and the leader counts stay one per card
  await open('Pearce T1'); await live(); await sleep(300);
  await page.click('[data-cfg-name="Kinetic Damage Max"]');
  await sleep(2800);
  const rack = await page.evaluate(() => { const t = window.shipExplorer._teardown, it = t.items.weapons.find((q) => q.on); return {mounts: t.mounts.length, above: it.obj.position.y - (t.yC + t.H / 2), tips: document.querySelectorAll('.td-leaders circle[r="3"]').length, cards: document.querySelectorAll('.td-co').length}; });
  check('K no gun data: weapons stay in the rack above the ship', rack.mounts === 0 && rack.above > 0 && rack.tips === rack.cards, rack);
  await close();
  // everything fits without scrolling at the windows people have, and the panels sit on the window's edges
  const fits = [];
  for (const [w, h] of [[1920, 1080], [1920, 940], [1536, 730], [1366, 650], [1280, 600], [2560, 1300]]) {
    await page.setViewportSize({width: w, height: h});
    for (const hull of ['Rainbow Phi', 'Calico Guardian']) { await open(hull);
    await page.click('[data-cfg-name="Kinetic Damage Max"]');
    fits.push(await page.evaluate(([w, h]) => {
      const over = (s) => { const e = document.querySelector(s); return e.scrollHeight - e.clientHeight; }, bay = document.querySelector('.bay'), k = +bay.style.getPropertyValue('--bayk');
      const right = document.querySelector('.bay-panel.right').getBoundingClientRect(), foot = document.querySelector('.bay-foot').getBoundingClientRect();
      return {w, h, narrow: bay.classList.contains('narrow'), picker: over('[data-cfg-picker]'), readout: over('[data-readout]'), fit: over('.fit-list'), edge: Math.abs(w - right.right - 30 * k), floor: Math.abs(h - foot.bottom - 12 * k)};
    }, [w, h]));
    await close(); }
  }
  check('K nothing scrolls from 1280x600 to 2560x1300, panels on the window edges', fits.every((q) => !q.narrow && q.picker <= 0 && q.readout <= 0 && q.fit <= 0 && q.edge < 1 && q.floor < 1), fits.filter((q) => q.narrow || q.picker > 0 || q.readout > 0 || q.fit > 0 || q.edge >= 1 || q.floor >= 1));
  await page.setViewportSize({width: 1000, height: 700});
  await open('Calico Guardian');
  check('K a small window still stacks', await page.evaluate(() => document.querySelector('.bay').classList.contains('narrow')));
  await close();
  await page.setViewportSize({width: 1600, height: 900});

  // L. the deck plan: illustrative rooms inside real slices of the hull, sized by the loadout
  await open('Calico Guardian'); await live(); await sleep(300);
  await page.click('[data-view="plan"]');
  await sleep(1200);
  const areaOf = (plan, type) => plan.reduce((a, q) => a + q.rooms.filter((r) => r.type === type).reduce((b, r) => b + r.area, 0), 0);
  let pl = await dbg();
  const planUi = await page.evaluate(() => { const t = window.shipExplorer._teardown; return {decks: document.querySelectorAll('[data-deck]').length, note: document.querySelector('.td-plan-note').textContent, labels: [...document.querySelectorAll('.td-room')].filter((e) => e.style.visibility !== 'hidden').length, works: t.works.filter((w) => w.group.visible).length, group: t.deckGroup.visible}; });
  check('L Deck plan on a capital ship: three decks, stays closed, says it is illustrative', pl.view === 'plan' && pl.explode === 0 && planUi.decks === 3 && /Illustrative/.test(planUi.note) && planUi.labels > 0 && planUi.group && planUi.works === 0, planUi);
  const lowest = pl.plan[0].rooms, stern = lowest.find((r) => r.type === 'engineering');
  check('L engineering is on the lowest deck, at the stern', !!stern && lowest.every((r) => r.x >= stern.x), lowest.map((r) => r.type));
  const glass = (await dbg()).canopy;
  const bridge = pl.plan.flatMap((q) => q.rooms).filter((r) => r.type === 'bridge');
  const bridgeDeck = pl.plan.find((q) => q.rooms.some((r) => r.type === 'bridge')), floorEnd = bridgeDeck ? Math.max(...bridgeDeck.rooms.map((r) => r.x1)) : 0;
  check('L one bridge, as near the canopy\'s main cluster as the floor reaches: the Guardian\'s is at the bow', bridge.length === 1 && glass && glass.x > 2 && glass.share >= 0.3 && bridge[0].x1 >= Math.min(glass.x, floorEnd) - 0.3 && bridge[0].x0 <= glass.x + 0.3, [bridge[0] && [bridge[0].x0, bridge[0].x1], glass, floorEnd]);
  const before = pl.plan;
  await page.click('[data-cfg-name="Default"]');
  await sleep(300);
  const basePlan = (await dbg());
  await page.click('[data-cfg-name="Kinetic Damage Max"]');
  await sleep(300);
  pl = await dbg();
  const value = (plan, type) => (plan.flatMap((q) => q.rooms).find((r) => r.type === type && r.value != null) || {}).value;
  check('L toggling a loadout stays in the plan, and rooms follow the numbers', basePlan.view === 'plan' && pl.view === 'plan' && pl.explode === 0 && areaOf(pl.plan, 'ammo') > areaOf(basePlan.plan, 'ammo') && value(pl.plan, 'ammo') > value(basePlan.plan, 'ammo'), {ammo: [areaOf(basePlan.plan, 'ammo'), areaOf(pl.plan, 'ammo')], value: [value(basePlan.plan, 'ammo'), value(pl.plan, 'ammo')]});
  const named = await page.evaluate(async () => {
    const t = window.shipExplorer._teardown, a = window.shipExplorer, ship = a.ships.find((s) => s.name === 'Calico Guardian'), want = a.formatStatValue(a.statValue(ship, 'Kinetic Damage Max', ['stats', 'capacities', 'ammoCapacity']));
    let shown = null, missing = 0;
    for (let i = 0; i < t.plan.length; i++) { t.setDeck(i); const leg = [...document.querySelectorAll('.td-leg')]; const q = leg.find((e) => e.dataset.room === 'ammo' && e.querySelector('b')); if (q) shown = q.querySelector('b').textContent; missing += t.plan[i].rooms.length - leg.length; }
    return {want, shown, missing};
  });
  check('L a room\'s number reads exactly as the readout, every room named in the legend', named.shown === named.want && named.missing === 0, named);
  const leak = await page.evaluate(async () => { const t = window.shipExplorer._teardown, a = t.renderer.info.memory.geometries; for (let i = 0; i < 6; i++) { t.buildPlan(); await new Promise((ok) => requestAnimationFrame(ok)); } return [a, t.renderer.info.memory.geometries]; });
  check('L rebuilding rooms does not leak geometry', leak[1] <= leak[0], leak);
  await page.click('[data-deck="0"]');
  await sleep(200);
  check('L a deck button picks that deck', await page.evaluate(() => window.shipExplorer._teardown.deckIdx === 0 && document.querySelector('[data-deck="0"]').classList.contains('on')));
  await page.click('[data-view="teardown"]');
  await sleep(1900);
  pl = await page.evaluate(() => { const t = window.shipExplorer._teardown; return {group: t.deckGroup.visible, decks: document.querySelector('[data-decks]').hidden, rooms: document.querySelector('.td-rooms').classList.contains('show'), works: t.works.filter((w) => w.group.visible).length, ex: t.explode.v}; });
  check('L leaving the plan: rooms gone, teardown back', !pl.group && pl.decks && !pl.rooms && pl.works === 7 && pl.ex === 1, pl);
  await close();

  // B. closing while the model is still loading releases the GL context, immediately
  await page.evaluate(() => { window.__ctx.length = 0; });
  faults.delayGlb = 5000;
  await open('Pearce X4');
  await page.waitForFunction(() => document.querySelector('.td-stage'), null, {timeout: 15000});
  const during = await page.evaluate(() => window.__liveCtx());
  await close();
  await sleep(150);
  const after = await page.evaluate(() => window.__liveCtx());
  check('B close during a slow load releases the context at once', during >= 1 && after === 0, {during, after});
  faults.delayGlb = 0;

  // C. a GLB that never answers, opened repeatedly, leaves nothing alive
  await page.evaluate(() => { window.__ctx.length = 0; });
  faults.hangGlb = true;
  for (let i = 0; i < 6; i++) { await open('Pearce F4'); await page.waitForFunction(() => document.querySelector('.td-stage'), null, {timeout: 15000}); await close(); }
  await sleep(150);
  const hung = await page.evaluate(() => window.__liveCtx());
  check('C hung model x6: no live contexts', hung === 0, hung);
  faults.hangGlb = false;

  // D. context lost at runtime: the art comes back, the buttons keep working
  await open('Calico Guardian'); await live(); await sleep(300);
  await page.evaluate(() => { const g = document.querySelector('.td-gl').getContext('webgl2'); g.getExtension('WEBGL_lose_context').loseContext(); });
  await sleep(400);
  const lost = await page.evaluate(() => {
    const v = document.querySelector('.ship-modal-visual'), art = v.querySelector('.turntable,.ship-modal-hero,.ship-modal-noart');
    return {live: v.classList.contains('td-live'), stage: !!v.querySelector('.td-stage'), art: !!art && getComputedStyle(art).display !== 'none' && art.clientWidth > 0, td: !!window.shipExplorer._teardown};
  });
  check('D context lost: stage gone, art visible, viewer released', !lost.live && !lost.stage && lost.art && !lost.td, lost);
  await page.click('[data-cfg-name="Tier One"]');
  check('D buttons still drive the fit list after the loss', await page.$eval('.fit-list', (e) => !e.hidden && e.textContent.includes('Power Core')));
  await close();

  // E. a hull with no model keeps its art and works
  await open('Rainbow Phi'); await sleep(800);
  const noModel = await page.evaluate(() => ({stage: !!document.querySelector('.td-stage'), art: !!document.querySelector('.ship-modal-visual img, .ship-modal-visual .turntable, .ship-modal-noart')}));
  check('E no-model hull: no stage, art present', !noModel.stage && noModel.art, noModel);
  check('E the art hint says nothing about 3D', !/3D/.test(await page.textContent('.ship-modal-visual')));
  await page.click('[data-cfg-name="Kinetic Damage Min"]');
  check('E no-model hull: buttons drive the fit list', (await page.textContent('.fit-list')).includes('51'));
  await close();

  // G. a starbase has nothing to configure and raises nothing
  await open('Starbase - Tier 0'); await sleep(500);
  const base = await page.evaluate(() => ({picker: !!document.querySelector('[data-cfg-picker]'), label: document.querySelector('.cfgname').textContent.trim(), rows: document.querySelectorAll('.srow').length}));
  check('G starbase: no picker, no config name, readout present', !base.picker && base.label === '' && base.rows > 20, base);
  await close();

  // H. a phone: the panels stack and scroll, nothing scaled, Close clickable
  await page.setViewportSize({width: 390, height: 844});
  await open('Calico Guardian'); await live(); await sleep(400);
  const phone = await page.evaluate(() => {
    const bay = document.querySelector('.bay'), ui = document.querySelector('.bay-ui'), st = document.querySelector('.td-stage').getBoundingClientRect(), c = document.querySelector('.ship-modal-close').getBoundingClientRect();
    return {narrow: bay.classList.contains('narrow'), transform: ui.style.transform, stageH: st.height, stageW: st.width, scrolls: bay.scrollHeight > bay.clientHeight, overflowX: bay.scrollWidth - bay.clientWidth, closeHit: document.elementFromPoint(c.x + c.width / 2, c.y + c.height / 2).className};
  });
  const blocked = await page.evaluate(() => [...document.querySelectorAll('.bay [data-cfg-name]')].filter((b) => { b.scrollIntoView({block: 'center'}); const r = b.getBoundingClientRect(), e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return !(e && b.contains(e)); }).map((b) => b.dataset.cfgName));
  check('H phone: every loadout cell is tappable, Close covers none', blocked.length === 0, blocked.slice(0, 4));
  await page.evaluate(() => { document.querySelector('.bay').scrollTop = 0; });
  check('H phone: a vertical swipe on the stage can scroll', (await page.evaluate(() => getComputedStyle(document.querySelector('.td-gl')).touchAction)) === 'pan-y');
  check('H phone: stacked, stage sized, scrolls, no sideways overflow, Close on top', phone.narrow && !phone.transform && phone.stageH > 300 && phone.stageW === 390 && phone.scrolls && phone.overflowX <= 0 && /ship-modal-close/.test(phone.closeHit), phone);
  await close();
  await page.setViewportSize({width: 1600, height: 900});

  // F. every hull: 28 pieces, stern on -X
  let bad = [], viaEngine = 0, noEvidence = 0, totalMounts = 0, hullsWithMounts = 0, planRooms = 0, planRoofed = 0, planSpine = 0, noPlans = [];
  for (const name of Object.keys(manifest)) {
    await open(name);
    try { await live(); } catch (e) { bad.push(name + ': not live'); await close(); continue; }
    d = await dbg();
    if (d.pieces !== 28) bad.push(`${name}: ${d.pieces} pieces`);
    // hulls with no engine evidence are the ones the fallback decides: the length must end up along X
    if (d.orient.source !== 'engines') { noEvidence++; if (d.spanX < d.spanZ * 0.75) bad.push(`${name}: ${d.orient.source} left it broadside, X ${d.spanX.toFixed(2)} Z ${d.spanZ.toFixed(2)}`); }
    if (d.engineX !== null && d.orient.source === 'engines') { viaEngine++; if (d.engineX >= 0) bad.push(`${name}: engines at x=${d.engineX.toFixed(2)} (${d.orient.axis})`); }
    const wantMounts = (manifest[name].mounts || []).length;
    if (d.mounts !== wantMounts) bad.push(`${name}: ${d.mounts} mounts, manifest ${wantMounts}`);
    if (wantMounts) { totalMounts += wantMounts; hullsWithMounts++; if (d.mountGap > 0.035) bad.push(`${name}: a gun ${d.mountGap.toFixed(3)} of the hull off its mesh`); if (d.mountX < -1) bad.push(`${name}: guns average ${d.mountX.toFixed(2)} toward the stern: fitted backwards?`); }
    if (d.worksTris < 5000 || d.worksTris > 80000) bad.push(`${name}: machinery ${d.worksTris} tris`);
    if (d.hoseLinks < 2 || d.hoseLinks > 12) bad.push(`${name}: ${d.hoseLinks} hoses, want a few here and there`);
    // the plan on every hull, by rays that know nothing of how deck.js decided: hull above and below each room
    const ship = (Array.isArray(ships) ? ships : ships.ships).find((s) => s.name === name);
    const rp = await page.evaluate(async () => {
      const t = window.shipExplorer._teardown;
      t.setView('plan', true);
      await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
      const V = t.camera.position.constructor, Ray = t.scene.constructor;
      const out = {decks: t.plan.length, spine: t.plan.some((q) => q.spine), rooms: 0, roofed: 0, bad: [], labels: [...document.querySelectorAll('.td-room')].filter((e) => e.style.visibility !== 'hidden').length};
      t.plan.forEach((q) => {
        const seen = new Map();
        q.rooms.forEach((r) => {
          r.a.forEach((v, i) => { if (!(v <= r.b[i] + 1e-6) || !Number.isFinite(v)) out.bad.push(r.type + ' wall'); });
          const key = r.row === undefined ? 'full' : r.row;
          (seen.get(key) || seen.set(key, []).get(key)).push([r.c0, r.c1]);
          // five points across the floor, in the room's middle and towards its corners; simplified decks are held to the same bar
          [[0.5, 0.5], [0.2, 0.25], [0.2, 0.75], [0.8, 0.25], [0.8, 0.75]].forEach(([fx, fz]) => { const i = Math.round(fx * (r.xs.length - 1)); out.rooms++; if (t.roofedAt(r.xs[i], q.y, r.a[i] + (r.b[i] - r.a[i]) * fz)) out.roofed++; });
        });
        seen.forEach((list) => { list.sort((p, o) => p[0] - o[0]); list.forEach((p, i) => { if (i && p[0] <= list[i - 1][1]) out.bad.push('overlap'); }); });
      });
      out.total = t.plan.reduce((a, q) => a + q.rooms.length, 0);
      out.noPlan = !t.plan.length && /No deck plan/.test(document.querySelector('.td-plan-note').textContent);
      out.blindRay = t.roofedAt(t.bounds.max.x + 5, t.yC, 0); // a point off the hull must not count as inside
      t.setView('solid', true);
      return out;
    });
    planRooms += rp.rooms; planRoofed += rp.roofed; if (rp.spine) planSpine++;
    const maxDecks = ship.class >= 6 ? 3 : ship.class >= 3 ? 2 : 1;
    if (rp.decks > maxDecks) bad.push(`${name}: ${rp.decks} decks at class ${ship.class}`);
    if (!rp.noPlan && rp.total < 2) bad.push(`${name}: plan has ${rp.total} rooms`);
    if (rp.noPlan) noPlans.push(name);
    if (rp.bad.length) bad.push(`${name}: plan ${rp.bad.slice(0, 3)}`);
    if (rp.blindRay) bad.push(`${name}: the room ray check is blind`);
    for (const cam of ['q', 'side', 'top']) {
      const x = await page.evaluate(async (c) => { const t = window.shipExplorer._teardown; t.setView('teardown', true); t.setCam(c, true); await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))); const e = t.screenExtent(); return Math.max(e.free[0] - e.x0, e.x1 - e.free[1], e.free[2] - e.y0, e.y1 - e.free[3]); }, cam);
      if (x > 0) bad.push(`${name}/${cam}: opened hull ${x.toFixed(0)} px under a panel`);
    }
    await close();
  }
  check(`F all ${Object.keys(manifest).length} hulls: 28 pieces, engines aft, guns on the mesh, machinery, stays between the panels`, bad.length === 0 && viaEngine > 0 && noEvidence > 0 && hullsWithMounts === 36 && totalMounts === 92, {viaEngine, noEvidence, hullsWithMounts, totalMounts, bad: bad.slice(0, 8)});
  check('F deck plan: rooms are inside the hull, by independent rays', planRooms > 1000 && planRoofed / planRooms >= 0.93 && noPlans.length <= 8, {points: planRooms, inside: planRoofed, share: +(planRoofed / planRooms).toFixed(3), planSpine, noPlans});
  check('no uncaught page errors', errors.length === 0, errors.slice(0, 5));

  // room size against the numbers, across every configuration of several hulls, as pairs
  await page.setViewportSize({width: 1600, height: 900});
  const sizes = {pairs: 0, inverted: 0, same: 0, sameInv: 0, ex: []};
  for (const name of ['Calico Guardian', 'Calico Scud', 'Pearce C11', 'Opal Bitboat', 'Fimbul ECOS Greenader']) {
    await open(name); await live();
    const rows = await page.evaluate((hull) => {
      const a = window.shipExplorer, t = a._teardown, ship = a.ships.find((s) => s.name === hull), out = [];
      t.setView('plan', true);
      for (const c of ship.configurations) {
        const name = c.name === 'Default' ? '' : c.name;
        t.setConfig(name, c, {}, a.planStats(ship, name, c));
        const by = {};
        t.plan.forEach((q) => q.rooms.forEach((r) => { if (['cargo', 'fuel', 'ammo'].includes(r.type)) { by[r.type] = by[r.type] || {a: 0, v: null}; by[r.type].a += r.area; if (r.value != null) by[r.type].v = r.value; } }));
        out.push(by);
      }
      t.setView('solid', true);
      return out;
    }, name);
    for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) for (const k of ['cargo', 'fuel', 'ammo']) {
      const p = rows[i][k], q = rows[j][k];
      if (!p || !q || p.v == null || q.v == null || p.v === q.v) continue;
      sizes.same++;
      if ((p.v - q.v) * (p.a - q.a) < 0 && Math.abs(p.a - q.a) / Math.max(p.a, q.a) > 0.08) { sizes.sameInv++; if (sizes.ex.length < 4) sizes.ex.push([name, k, p.v, q.v, +p.a.toFixed(2), +q.a.toFixed(2)]); }
    }
    await close();
  }
  check('L one room grows with its own stat across every loadout (8% slack for coarse columns)', sizes.same > 1000 && sizes.sameInv / sizes.same < 0.02, sizes);

  // I. ship-fit.js missing: the bay still works and still counts parts from the record
  faults.noFit = true;
  const noFit = await browser.newPage({viewport: {width: 1600, height: 900}});
  const nfErrors = []; noFit.on('pageerror', (e) => nfErrors.push(e.message));
  await noFit.goto(`http://127.0.0.1:${port}/ShipExplorer/index.html`);
  await noFit.waitForFunction(() => window.shipExplorer && window.shipExplorer.ships && window.shipExplorer.ships.length && window.shipExplorer.componentDataLoaded, null, {timeout: 60000});
  await noFit.evaluate(() => { const a = window.shipExplorer; a.openShipModal(a.ships.find((s) => s.name === 'Calico Guardian')); });
  await noFit.click('[data-cfg-name="Kinetic Damage Max"]');
  const cell = await noFit.textContent('[data-cfg-name="Kinetic Damage Max"] .cp');
  check('I no ship-fit.js: cells count from the record, no page errors', cell === '39' && nfErrors.length === 0, [cell, nfErrors.slice(0, 2)]);
  await noFit.close();
  faults.noFit = false;

  // J. a config picked before component data arrives gets real values when it does
  faults.delayFormulas = 3500;
  const slow = await browser.newPage({viewport: {width: 1600, height: 900}});
  await slow.goto(`http://127.0.0.1:${port}/ShipExplorer/index.html`);
  await slow.waitForFunction(() => window.shipExplorer && window.shipExplorer.ships && window.shipExplorer.ships.length, null, {timeout: 60000});
  const early = await slow.evaluate(() => { const a = window.shipExplorer; if (a.componentDataLoaded) return false; a.openShipModal(a.ships.find((s) => s.name === 'Rainbow Phi')); document.querySelector('[data-cfg-name="Kinetic Damage Max"]').click(); return true; });
  await slow.waitForFunction(() => window.shipExplorer.componentDataLoaded, null, {timeout: 30000});
  await sleep(1400);
  const late = await slow.evaluate(() => ({changed: document.querySelectorAll('.srow.up, .srow.down').length, note: !!document.querySelector('[data-loading]')}));
  check('J picked before data loaded: values arrive, note clears', early && late.changed > 5 && !late.note, {early, late});
  await slow.close();
  faults.delayFormulas = 0;

  console.log(`\n${pass} PASS, ${fail} FAIL`);
  await browser.close();
  server.close();
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
