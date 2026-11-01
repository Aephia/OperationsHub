// Checks ShipExplorer/teardown-src/fit.js against the real ship data: what the teardown draws must equal what the record fits.
//   node Test/ship-teardown-check.js
// Exit 1 on any FAIL. Counts are re-derived here from the raw record, not through fit.js.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const check = (name, ok, detail) => { if (ok) pass++; else fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail !== undefined ? ': ' + JSON.stringify(detail) : ''}`); };

(async () => {
  const src = fs.readFileSync(path.join(ROOT, 'ShipExplorer/teardown-src/fit.js'), 'utf8');
  const F = await import('data:text/javascript,' + encodeURIComponent(src));
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'Data/ships-data.json'), 'utf8'));
  const ships = Array.isArray(raw) ? raw : (raw.ships || Object.values(raw));
  const cfg0 = (s, n) => ships.find((x) => x.name === s).configurations.find((c) => c.name === n);
  const rawCount = (c) => Object.values(c.components || {}).reduce((a, cat) => a + Object.values(cat).reduce((b, t) => b + ((t.items || []).length), 0), 0);

  // the type -> group table, typed here independently of fit.js: a mapping mutant survives any count-only check
  const EXPECT = {'Power Core': 'reactor', 'Warp Drive': 'warp', 'Subwarp Engine': 'subwarp', 'Maneuvering Thrusters': 'thrusters', 'Shield Generator': 'shield', 'Heat Sink': 'heatsink', 'Scanner Array': 'scanner', 'Tractor Beam': 'tractor', 'Hull Reinforcement': 'armour', 'Missile Bay': 'missileBay', 'Bomb Bay': 'bombBay', 'Drone Port': 'dronePort', 'Mining Rig': 'rig', 'Refuel Rig': 'rig', 'Repair Rig': 'rig', 'Rescue Rig': 'rig', 'Salvage Rig': 'rig', 'Cargo Module': 'cargo', 'Fuel Module': 'fuel', 'Ammo Module': 'ammo', 'Passenger Module': 'passenger'};
  const CAT_EXPECT = {'Ship Weapons': 'weapons', Countermeasures: 'counter', Missiles: 'missiles', Drones: 'drones', Bombs: 'bombBay'};
  const mapBad = new Set();
  for (const s of ships) for (const c of s.configurations || []) for (const [cat, types] of Object.entries(c.components || {})) for (const t of Object.keys(types)) {
    const want = CAT_EXPECT[cat] || EXPECT[t];
    if (F.groupOfType(cat, t) !== want) mapBad.add(`${cat} / ${t} -> ${F.groupOfType(cat, t)}, expected ${want}`);
  }
  check('every type in the data maps to its expected 3D group', mapBad.size === 0, [...mapBad].slice(0, 6));

  let configs = 0, unknown = new Set(), totalBad = [], capBad = [], typeBad = [], sumBad = [], emptyCol = [];
  for (const s of ships) for (const c of s.configurations || []) {
    configs++;
    const fit = F.fitOf(c), groups = F.groupsOf(fit);
    fit.unknown.forEach((u) => unknown.add(u));
    if (fit.total !== rawCount(c)) totalBad.push(`${s.name}/${c.name}`);
    let sum = 0;
    for (const [k, g] of Object.entries(groups)) {
      sum += g.count;
      if (g.drawn !== Math.min(F.GROUPS[k].cap, g.count)) capBad.push(`${s.name}/${c.name}/${k}:${g.drawn}/${g.count}`);
      for (const t of g.types) if (t.drawn < 1 || t.drawn > t.count) typeBad.push(`${s.name}/${c.name}/${t.type}:${t.drawn}/${t.count}`);
      if (g.types.reduce((a, t) => a + t.drawn, 0) !== g.drawn) typeBad.push(`${s.name}/${c.name}/${k}: type slots do not sum`);
      if (g.colors.some((x) => !/^#[0-9a-f]{6}$/i.test(x))) emptyCol.push(`${s.name}/${c.name}/${k}`);
    }
    if (sum !== fit.total) sumBad.push(`${s.name}/${c.name}`);
  }
  check('sweep covers every configuration of every ship (61 x 48)', configs === 61 * 48, configs);
  check('every component type in the data maps to a 3D group', unknown.size === 0, [...unknown]);
  check('fit total equals the raw item count, all configs', totalBad.length === 0, totalBad.slice(0, 5));
  check('group counts add up to the total, all configs', sumBad.length === 0, sumBad.slice(0, 5));
  check('drawn items are exactly min(cap, real count), all configs', capBad.length === 0, capBad.slice(0, 5));
  check('each type draws at least one and never more than it has, all configs', typeBad.length === 0, typeBad.slice(0, 5));
  const uni = F.groupsOf(F.fitOf(cfg0('Fimbul ECOS Unibomba', 'Tier One')));
  check('Unibomba Tier One: 2 kinetic + 2 energy draw 2 + 2, not 3 + 1', uni.weapons.types.every((t) => t.drawn === t.count), uni.weapons.types.map((t) => [t.type, t.count, t.drawn]));
  check('every drawn item has a valid colour', emptyCol.length === 0, emptyCol.slice(0, 5));

  // scenario values read by hand from the record
  const cfg = (s, n) => ships.find((x) => x.name === s).configurations.find((c) => c.name === n);
  const g = F.groupsOf(F.fitOf(cfg('Calico Guardian', 'Kinetic Damage Max')));
  check('Guardian Kinetic Max: 8 kinetic weapons, 8 ammo, 3 missile bays, 7 flares', g.weapons.count === 8 && g.ammo.count === 8 && g.missileBay.count === 3 && g.counter.count === 7, [g.weapons.count, g.ammo.count, g.missileBay.count, g.counter.count]);
  check('Guardian Kinetic Max: weapons wear the kinetic colour', g.weapons.colors.every((c) => c === F.DAMAGE_COLOR.Kinetic), g.weapons.colors[0]);
  check('Guardian Default: empty fit', Object.keys(F.groupsOf(F.fitOf(cfg('Calico Guardian', 'Default')))).length === 0);
  check('no config (bare hull) gives an empty fit', F.fitOf(null).total === 0);
  const phi = F.groupsOf(F.fitOf(cfg('Rainbow Phi', 'Kinetic Damage Min')));
  check('Rainbow Phi: 51 weapons are reported as 51 while at most 16 are drawn', phi.weapons.count === 51 && phi.weapons.drawn === 16, [phi.weapons.count, phi.weapons.drawn]);
  const mix = F.groupsOf(F.fitOf(cfg('Calico Guardian', 'Tier Five')));
  const mixTypes = new Set(mix.weapons.colors);
  check('Tier Five mixed weapons show each type at least once', mixTypes.size === mix.weapons.types.length, [mixTypes.size, mix.weapons.types.length]);

  // diff + callouts, with the tie and empty branches
  const d = F.diffOf(F.groupsOf(F.fitOf(cfg('Calico Guardian', 'Tier Five'))), g);
  check('diff Tier Five -> Kinetic Max: ammo 2 to 8', d.some((x) => x.group === 'ammo' && x.from === 2 && x.to === 8), d.find((x) => x.group === 'ammo'));
  check('diff of a config against itself is empty', F.diffOf(g, g).length === 0);
  const co = F.calloutsOf(g, d, 5);
  check('callouts: 5 at most and all of them fitted', co.length === 5 && co.every((k) => g[k]), co);
  check('callouts lead with what changed most', co[0] === 'ammo' || co[0] === 'drones', co[0]);
  const LABELS = {reactor: 'Power core', warp: 'Warp drive', subwarp: 'Subwarp engine', thrusters: 'Maneuvering thrusters', shield: 'Shield generator', heatsink: 'Heat sink', scanner: 'Scanner array', tractor: 'Tractor beam', armour: 'Hull reinforcement', cargo: 'Cargo module', fuel: 'Fuel module', ammo: 'Ammo module', passenger: 'Passenger module', weapons: 'Weapons', missileBay: 'Missile bay', missiles: 'Missiles', bombBay: 'Bomb bay', dronePort: 'Drone port', drones: 'Drones', counter: 'Countermeasures', rig: 'Utility rig'};
  const labelBad = Object.keys(LABELS).filter((k) => !F.GROUPS[k] || F.GROUPS[k].label !== LABELS[k]);
  check('every group shows its own label', labelBad.length === 0 && Object.keys(F.GROUPS).length === Object.keys(LABELS).length, labelBad);
  check('callouts of an empty fit are empty', F.calloutsOf({}, [], 5).length === 0);
  const tie = F.calloutsOf({shield: {count: 1}, reactor: {count: 1}}, [], 5);
  check('callout tie falls back to the fixed group order', tie[0] === 'reactor', tie);

  // negative control: an unknown type must be reported, not dropped
  const bad = F.fitOf({components: {'Ship Component': {'Flux Capacitor': {items: [1]}}, Nonsense: {X: {items: [1]}}}});
  check('negative: unknown types are reported, not silently dropped', bad.unknown.length === 2 && bad.total === 0, bad.unknown);

  // bundle and wiring
  const bundle = path.join(ROOT, 'ShipExplorer/teardown/ship-teardown.js');
  check('bundle exists and is at least as new as its source', fs.existsSync(bundle) && ['main.js', 'fit.js', 'works.js', 'deck.js'].every((f) => fs.statSync(bundle).mtimeMs >= fs.statSync(path.join(ROOT, 'ShipExplorer/teardown-src', f)).mtimeMs));
  const bundleText = fs.existsSync(bundle) ? fs.readFileSync(bundle, 'utf8') : '';
  check('bundle really holds the viewer and three.js', bundleText.length > 100000 && ['ShipTeardown', 'webglcontextlost', 'Hull reinforcement'].every((m) => bundleText.includes(m)), bundleText.length);
  const manifestPath = path.join(ROOT, 'Images/ships/models/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const names = new Set(ships.map((s) => s.name));
  const missingFile = Object.values(manifest).filter((e) => !fs.existsSync(path.join(ROOT, 'Images/ships/models', e.file)));
  check('every manifest key is a ship record name', Object.keys(manifest).every((k) => names.has(k)), Object.keys(manifest).filter((k) => !names.has(k)));
  check('every manifest file exists', missingFile.length === 0, missingFile.map((e) => e.file));
  check('starbases have no model entry', !Object.keys(manifest).some((k) => /^Starbase/.test(k)));
  check('manifest is populated', Object.keys(manifest).length > 0, Object.keys(manifest).length);

  console.log(`\n${pass} PASS, ${fail} FAIL`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
