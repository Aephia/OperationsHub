// fit.js - one source for the teardown: turns a configuration's REAL component list (Data/ships-data.json,
// config.components) into what the viewer shows. No three.js and no DOM, so Test/ship-teardown-check.js can run it in node.
// Every count on screen comes from items.length here; nothing is invented per config.

export const DAMAGE_COLOR = {
  Kinetic: '#ffb347', Energy: '#4fd2ff', EMP: '#a58bff', Superchill: '#a9f0ff',
  Shockwave: '#ff7a3d', 'Gray Goo': '#9be36b', Heat: '#ff4b3a',
  Explosive: '#ffb347', Photon: '#4fd2ff', // missile names for the kinetic and energy families
};

// Which 3D group each component type belongs to. A type missing here is an error the check reports, never a silent drop.
export const GROUPS = {
  reactor: {label: 'Power core', color: '#ffd27a', cap: 1},
  warp: {label: 'Warp drive', color: '#b79bff', cap: 1},
  subwarp: {label: 'Subwarp engine', color: '#ffb070', cap: 1},
  thrusters: {label: 'Maneuvering thrusters', color: '#ffb070', cap: 2},
  shield: {label: 'Shield generator', color: '#6fd3ff', cap: 1},
  heatsink: {label: 'Heat sink', color: '#ff8a5c', cap: 1},
  scanner: {label: 'Scanner array', color: '#5ce6d6', cap: 1},
  tractor: {label: 'Tractor beam', color: '#7fe0ff', cap: 1},
  armour: {label: 'Hull reinforcement', color: '#f2b632', cap: 1},
  rig: {label: 'Utility rig', color: '#4dffa0', cap: 2},
  cargo: {label: 'Cargo module', color: '#d8c79a', cap: 12},
  fuel: {label: 'Fuel module', color: '#ff9f43', cap: 12},
  ammo: {label: 'Ammo module', color: '#ff6b6b', cap: 12},
  passenger: {label: 'Passenger module', color: '#7fb5ff', cap: 12},
  weapons: {label: 'Weapons', color: '#ffb347', cap: 16},
  missileBay: {label: 'Missile bay', color: '#ff7a3d', cap: 12},
  missiles: {label: 'Missiles', color: '#ff7a3d', cap: 12},
  bombBay: {label: 'Bomb bay', color: '#ff5a5a', cap: 4},
  dronePort: {label: 'Drone port', color: '#4dffa0', cap: 4},
  drones: {label: 'Drones', color: '#4dffa0', cap: 6},
  counter: {label: 'Countermeasures', color: '#c7d3dc', cap: 12},
};

const SHIP_COMPONENT = {
  'Power Core': 'reactor', 'Warp Drive': 'warp', 'Subwarp Engine': 'subwarp', 'Maneuvering Thrusters': 'thrusters',
  'Shield Generator': 'shield', 'Heat Sink': 'heatsink', 'Scanner Array': 'scanner', 'Tractor Beam': 'tractor',
  'Hull Reinforcement': 'armour', 'Missile Bay': 'missileBay', 'Bomb Bay': 'bombBay', 'Drone Port': 'dronePort',
  'Mining Rig': 'rig', 'Refuel Rig': 'rig', 'Repair Rig': 'rig', 'Rescue Rig': 'rig', 'Salvage Rig': 'rig',
};
const SHIP_MODULE = {'Cargo Module': 'cargo', 'Fuel Module': 'fuel', 'Ammo Module': 'ammo', 'Passenger Module': 'passenger'};
const CATEGORY = {
  'Ship Component': (t) => SHIP_COMPONENT[t],
  'Ship Module': (t) => SHIP_MODULE[t],
  'Ship Weapons': () => 'weapons',
  Countermeasures: () => 'counter',
  Missiles: () => 'missiles',
  Bombs: () => 'bombBay',
  Drones: () => 'drones',
};

export function groupOfType(category, type) {
  const map = CATEGORY[category];
  return (map && map(type)) || '';
}

// colour for one entry: a damage type wears its own colour, everything else its group's
function colorOf(group, type) {
  const key = type.replace(/^Combat /, '');
  if ((group === 'weapons' || group === 'missiles' || group === 'drones') && DAMAGE_COLOR[key]) return DAMAGE_COLOR[key];
  return GROUPS[group].color;
}

// config -> {entries:[{group,type,count,color}], total, unknown:[...]}, in a stable order. `config` null = bare hull.
export function fitOf(config) {
  const entries = [], unknown = [];
  let total = 0;
  const comps = (config && config.components) || {};
  for (const cat of Object.keys(comps)) {
    const map = CATEGORY[cat];
    for (const type of Object.keys(comps[cat] || {})) {
      const n = ((comps[cat][type] || {}).items || []).length;
      if (!n) continue;
      const group = map ? map(type) : null;
      if (!group) { unknown.push(cat + ' / ' + type); continue; }
      entries.push({group, type, category: cat, count: n, color: colorOf(group, type)});
      total += n;
    }
  }
  return {entries, total, unknown};
}

// Per group: the ordered items to draw (colour per item) and the real count. `drawn` never exceeds the group's cap, and
// `count` stays the true number, so a 51-weapon Rainbow Phi shows ×51 even though 16 pods are on screen.
export function groupsOf(fit) {
  const out = {};
  for (const e of fit.entries) {
    const g = out[e.group] || (out[e.group] = {count: 0, colors: [], types: []});
    g.count += e.count;
    g.types.push({type: e.type, count: e.count, color: e.color});
  }
  for (const k of Object.keys(out)) {
    const g = out[k], cap = GROUPS[k].cap;
    // every type gets a slot, then the next slot goes to the type most under-represented; a type never draws more than it has
    const want = Math.min(cap, g.count);
    const slots = g.types.map((t) => ({t, n: 0}));
    let used = 0;
    for (const q of slots) { if (used >= want) break; q.n = 1; used++; }
    while (used < want) {
      let best = null;
      for (const q of slots) if (q.n < q.t.count && (!best || q.t.count / q.n > best.t.count / best.n)) best = q;
      if (!best) break;
      best.n++; used++;
    }
    slots.forEach((q) => { q.t.drawn = q.n; });
    g.colors = slots.flatMap((q) => Array(q.n).fill(q.t.color));
    g.drawn = g.colors.length;
  }
  return out;
}

// What a toggle changed, for the callouts: real count per group before and after.
export function diffOf(prevGroups, nextGroups) {
  const out = [];
  for (const k of new Set([...Object.keys(prevGroups), ...Object.keys(nextGroups)])) {
    const a = prevGroups[k] ? prevGroups[k].count : 0, b = nextGroups[k] ? nextGroups[k].count : 0;
    if (a !== b) out.push({group: k, from: a, to: b});
  }
  return out;
}

// Up to n callouts: changed groups first (largest change first), then the largest fitted groups; ties by group order.
export function calloutsOf(groups, diff, n) {
  const order = Object.keys(GROUPS);
  const changed = new Map(diff.map((d) => [d.group, Math.abs(d.to - d.from)]));
  return Object.keys(groups)
    .sort((a, b) => (changed.get(b) || 0) - (changed.get(a) || 0) || groups[b].count - groups[a].count || order.indexOf(a) - order.indexOf(b))
    .slice(0, n);
}

// One accent per configuration family, from its name.
export function accentOf(name) {
  const n = name || '';
  for (const k of Object.keys(DAMAGE_COLOR)) if (n.startsWith(k + ' ')) return DAMAGE_COLOR[k];
  if (/^Tier/.test(n)) return '#f2b632';
  if (/^(Repair|Rescue)/.test(n)) return '#4dffa0';
  if (/^(Scanning|Salvage)/.test(n)) return '#5ce6d6';
  if (/^(Fast Freight|Cargo)/.test(n)) return '#d8c79a';
  if (/^Mining/.test(n)) return '#ffcf6b';
  return '#9fb7c6';
}
