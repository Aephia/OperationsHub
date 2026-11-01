// CONFIGURATION BAY - teardown-style mockup of the ship configure view (owner 2026-10-31: "the selection screen shows
// the list and the selected ship with a CONFIGURE button, which opens a high-fidelity teardown view of animation and
// configuration"). Built with the teardown skill's kit and rules: one source (every bar, callout and glow reads the
// SAME Cfg* arrays the server applies - Data/configs/ship_configs.json), the part doing the work opens up, one accent.
//   node ~/.claude/skills/teardown/sims/build.mjs ./tools/configbay-proto
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import GLB from './guardian.glb';
import SHIP from './guardian.json';

// ---------------------------------------------------------------- data (one source)
const BUDGET = 145, DEMO_FLEET = 50; // demo: the rest of the fleet already holds 50 pts
const FAMILY_COL = {0: '#9fb7c6', 1: '#f2b632', 3: '#4dffa0'};
const DMG = [
  ['Kinetic', '#ffb347', 'Flare', 'Concussive Barrage'],
  ['Energy', '#4fd2ff', 'Energy Capacitor', 'Capacitor Overload'],
  ['EMP', '#a58bff', 'Faraday Shielding', 'Drive Scramble'],
  ['Superchill', '#a9f0ff', 'Warming Plates', 'Cryogenic Lag'],
  ['Shockwave', '#ff7a3d', 'Negative REM Plating', 'Countermeasure Stagger'],
  ['Gray Goo', '#9be36b', 'Healing Nanobots', 'Nanite Contamination'],
  ['Heat', '#ff4b3a', 'Fire Suppressor', 'Weapon Overheat'],
];
const GRADES = ['', 'MIN', 'MID', 'MAX'];
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'];
const cfgColor = (c) => (c.family === 2 ? DMG[Math.floor((c.idx - 6) / 3)][1] : FAMILY_COL[c.family]);
const costOf = (i) => Math.floor((SHIP.cost * SHIP.CfgCostPct[i] + 99) / 100); // == C++ ShipCostWithConfig
const fits = (i) => DEMO_FLEET + SHIP.cost + costOf(i) <= BUDGET;
const STATS = [
  ['HULL', 'CfgHull', 'armour'], ['SHIELD', 'CfgShield', 'shield'], ['SHIELD REGEN', 'CfgShieldRegen', 'shield'],
  ['SPEED', 'CfgSpeed', 'drive'], ['ACTION POINTS', 'CfgAP', 'reactor'], ['AP REGEN', 'CfgAPRegen', 'reactor'],
  ['WEAPON DAMAGE', 'CfgDamage', 'weapons'], ['AMMO', 'CfgAmmo', 'weapons'], ['REPAIR', 'CfgRepair', 'repair'],
];
const SUBS = {
  shield: {name: 'SHIELD GENERATOR', stats: ['CfgShield', 'CfgShieldRegen']},
  weapons: {name: 'WEAPONS BUS', stats: ['CfgDamage', 'CfgAmmo']},
  reactor: {name: 'REACTOR CORE', stats: ['CfgAP', 'CfgAPRegen']},
  drive: {name: 'MAIN DRIVE', stats: ['CfgSpeed']},
  armour: {name: 'ARMOUR LATTICE', stats: ['CfgHull']},
  repair: {name: 'REPAIR DRONES', stats: ['CfgRepair']},
};

// ---------------------------------------------------------------- easing (skill: taste, with numbers)
const bez = (x1, y1, x2, y2) => (t) => {
  let lo = 0, hi = 1, u = t;
  for (let i = 0; i < 24; i++) {
    u = (lo + hi) / 2;
    const x = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u * u * x2 + u ** 3;
    if (x < t) lo = u; else hi = u;
  }
  return 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u * u * y2 + u ** 3;
};
const EASE_IN = bez(0.16, 1, 0.3, 1), EASE_SS = bez(0.65, 0, 0.35, 1);
class Tween { // value that eases to a target; dur seconds
  constructor(v, dur = 0.8, ease = EASE_SS) { this.from = this.to = this.v = v; this.t = 1; this.dur = dur; this.ease = ease; }
  set(to, dur) { if (to === this.to) return; this.from = this.v; this.to = to; this.t = 0; if (dur) this.dur = dur; }
  step(dt) { this.t = Math.min(1, this.t + dt / this.dur); this.v = this.from + (this.to - this.from) * this.ease(this.t); return this.v; }
}

// ---------------------------------------------------------------- DOM
const app = document.getElementById('app');
app.innerHTML = `<canvas id="gl"></canvas><svg id="leaders"></svg><div id="ui"></div><div id="cursor"></div>`;
const canvas = document.getElementById('gl'), ui = document.getElementById('ui'), svg = document.getElementById('leaders');
const cursorEl = document.getElementById('cursor');

// ---------------------------------------------------------------- renderer / scene
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, powerPreference: 'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.localClippingEnabled = true;
const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;
const camera = new THREE.PerspectiveCamera(28, 16 / 9, 0.1, 400);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = 0.07; controls.enablePan = false;
controls.minDistance = 9; controls.maxDistance = 48; controls.target.set(0, 0, 0);

// backdrop: deep hangar gradient + faint vertical ribs, drawn on a big inverted sphere
{
  const g = new THREE.SphereGeometry(180, 48, 24);
  const m = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: {},
    vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
    fragmentShader: `varying vec3 vP;
      void main(){
        float h = clamp(vP.y*0.5+0.5, 0.0, 1.0);
        vec3 c = mix(vec3(0.012,0.018,0.026), vec3(0.035,0.055,0.075), pow(h, 1.6));
        float a = atan(vP.z, vP.x);
        float rib = pow(abs(sin(a*18.0)), 60.0) * smoothstep(0.2, 0.7, h) * 0.035;
        float horizon = exp(-pow((h-0.5)*9.0, 2.0)) * 0.05;
        c += vec3(0.25,0.55,0.75)*(rib + horizon);
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  scene.add(new THREE.Mesh(g, m));
}

// holographic deck: concentric rings + radial ticks under the ship
const deckMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: {uTime: {value: 0}, uCol: {value: new THREE.Color('#4fb8e0')}},
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv*2.0-1.0; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
  fragmentShader: `varying vec2 vUv; uniform float uTime; uniform vec3 uCol;
    void main(){
      float r = length(vUv); if (r > 1.0) discard;
      float a = atan(vUv.y, vUv.x);
      float rings = pow(abs(sin(r*42.0)), 90.0)*0.35;
      float edge = smoothstep(0.985, 0.99, r) * (1.0 - smoothstep(0.995, 1.0, r));
      float mid = smoothstep(0.62, 0.625, r) * (1.0 - smoothstep(0.63, 0.635, r));
      float ticks = step(0.93, r) * step(r, 0.975) * pow(abs(sin(a*60.0)), 40.0);
      float sweep = pow(max(0.0, cos(a - uTime*0.35)), 30.0) * smoothstep(1.0, 0.3, r) * 0.25;
      float fade = 1.0 - smoothstep(0.55, 1.0, r)*0.6;
      float v = (rings + ticks*0.8 + edge + mid*0.7) * fade + sweep;
      gl_FragColor = vec4(uCol * v * 0.28, 1.0);
    }`,
});
const deck = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), deckMat);
deck.rotation.x = -Math.PI / 2; deck.position.y = -2.6;
scene.add(deck);

// light: cool key from above-left, warm rim from behind, low fill
const key = new THREE.DirectionalLight('#dfeaff', 2.6); key.position.set(-6, 9, 7); scene.add(key);
const rim = new THREE.DirectionalLight('#ffc78a', 2.2); rim.position.set(7, 3, -9); scene.add(rim);
const fill = new THREE.HemisphereLight('#3a5a78', '#05080c', 0.6); scene.add(fill);

// post
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1600, 900), 0.55, 0.5, 0.82);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ---------------------------------------------------------------- state
const S = {
  sel: 0, view: 'teardown',
  explode: new Tween(0, 1.6, EASE_IN), xray: new Tween(0, 0.7), probes: new Tween(0, 1.4),
  accent: new THREE.Color(FAMILY_COL[0]), accentTo: new THREE.Color(FAMILY_COL[0]),
  stat: Object.fromEntries(STATS.map(([, k]) => [k, new Tween(1, 0.8)])),
  sub: Object.fromEntries(Object.keys(SUBS).map((k) => [k, new Tween(0, 0.7)])),
  modules: new Tween(0, 0.9, EASE_IN), // fit animation 0..1 restarted on every pick
  time: 0, idle: 0, tour: false,
};

// ---------------------------------------------------------------- the ship, sliced for the teardown
const SLICE_B = [0.27, 0.5, 0.73]; // section boundaries, fraction of length from the stern
const L = 9; // normalised hull length
let H = 2, W = 3; // filled from bounds
const slices = []; // {root, mixer, action, mats:[{solid,xray,cap,planes}], lo, hi}
const subsys = {}; // name -> {group, anchor(Vector3 fn), mats:[]}
let clipDur = 1;

function fresnelMat(planes) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    clipping: true, clippingPlanes: planes,
    uniforms: {uA: {value: 0}, uCol: {value: new THREE.Color('#6fd3ff')}},
    vertexShader: `#include <clipping_planes_pars_vertex>
      varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mvPosition = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix*mvPosition;
        #include <clipping_planes_vertex>
      }`,
    fragmentShader: `#include <clipping_planes_pars_fragment>
      varying vec3 vN; varying vec3 vV; uniform float uA; uniform vec3 uCol;
      void main(){
        #include <clipping_planes_fragment>
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
        gl_FragColor = vec4(uCol * (0.03 + f*0.6) * uA, 1.0);
      }`,
  });
}

function buildShip(gltf) {
  const src = gltf.scene;
  const pivot = new THREE.Group();
  pivot.add(src);
  pivot.updateMatrixWorld(true);
  // long axis -> X, stern (engine flares) -> -X
  const box = new THREE.Box3().setFromObject(src);
  const size = box.getSize(new THREE.Vector3()), ctr = box.getCenter(new THREE.Vector3());
  const longAxis = size.x >= size.z ? 'x' : 'z';
  src.position.sub(ctr);
  if (longAxis === 'z') pivot.rotation.y = Math.PI / 2;
  pivot.updateMatrixWorld(true);
  const flares = src.getObjectByName('mesh_vfx_engine_flares');
  const fp = new THREE.Box3().setFromObject(flares || src).getCenter(new THREE.Vector3());
  if (fp.x > 0) pivot.rotation.y += Math.PI;
  const s = L / Math.max(size.x, size.z);
  pivot.scale.setScalar(s);
  pivot.updateMatrixWorld(true);
  const b2 = new THREE.Box3().setFromObject(src);
  H = b2.max.y - b2.min.y; W = b2.max.z - b2.min.z;
  const xs = [b2.min.x, ...SLICE_B.map((f) => b2.min.x + f * (b2.max.x - b2.min.x)), b2.max.x];
  const clip = gltf.animations.find((a) => /probe/.test(a.name));
  clipDur = clip ? clip.duration : 1;

  for (let i = 0; i < 4; i++) {
    const root = pivot.clone(true);
    const lo = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0), hi = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
    const planes = [];
    if (i > 0) planes.push(lo);
    if (i < 3) planes.push(hi);
    const mats = [];
    const meshes = [];
    root.traverse((o) => { if (o.isMesh) meshes.push(o); }); // collect first: adding cap/x-ray children mid-traverse recurses
    meshes.forEach((o) => {
      const n = o.name;
      if (/glass/.test(n)) {
        o.material = new THREE.MeshStandardMaterial({color: '#0b1a22', emissive: '#3fc6ff', emissiveIntensity: 0.55, metalness: 0.2, roughness: 0.15, clippingPlanes: planes, transparent: true});
        mats.push({glass: o.material});
      } else if (/flare/.test(n)) {
        o.material = new THREE.MeshBasicMaterial({color: '#ffd9a0', clippingPlanes: planes, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false});
        mats.push({flare: o.material});
      } else {
        const solid = new THREE.MeshStandardMaterial({color: '#4a5258', metalness: 0.72, roughness: 0.5, envMapIntensity: 0.38, clippingPlanes: planes, clipShadows: true, transparent: true});
        const cap = new THREE.MeshBasicMaterial({color: '#0f2430', side: THREE.BackSide, clippingPlanes: planes, transparent: true});
        const xr = fresnelMat(planes);
        o.material = solid;
        const capMesh = new THREE.Mesh(o.geometry, cap); capMesh.renderOrder = -1;
        const xrMesh = new THREE.Mesh(o.geometry, xr); xrMesh.renderOrder = 2;
        // blueprint edges: hard creases only, drawn in X-RAY (and faintly in the teardown)
        const edge = new THREE.LineBasicMaterial({color: '#7fd8ff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, clippingPlanes: planes});
        const lines = new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, 32), edge); lines.renderOrder = 3;
        o.add(capMesh, xrMesh, lines);
        mats.push({solid, cap, xr, edge});
      }
    });
    const mixer = new THREE.AnimationMixer(root);
    let action = null;
    if (clip) { action = mixer.clipAction(clip); action.play(); action.paused = true; }
    scene.add(root);
    slices.push({root, mixer, action, mats, lo, hi, x0: xs[i], x1: xs[i + 1]});
  }
  buildSubsystems(xs, b2);
  // armour plates sit ON the hull: ray each slot's flank once, keep the hit point + surface normal
  const rc = new THREE.Raycaster(), hull = [];
  slices[0].root.updateMatrixWorld(true);
  slices[0].root.traverse((o) => { if (o.isMesh && /^mesh_/.test(o.name) && !/glass|flare/.test(o.name)) hull.push(o); });
  const a = subsys.armour, yC = (b2.min.y + b2.max.y) / 2;
  a.hits = a.parts.plates.map((_, k) => {
    const side = k % 2 ? 1 : -1, slot = Math.floor(k / 2);
    const x = b2.min.x + (0.2 + slot * 0.15) * (b2.max.x - b2.min.x);
    rc.set(new THREE.Vector3(x, yC + H * 0.12, side * W * 3), new THREE.Vector3(0, 0, -side));
    const h = rc.intersectObjects(hull, false)[0];
    if (!h) return {p: new THREE.Vector3(x, yC, side * W * 0.5), n: new THREE.Vector3(0, 0, side)};
    const n = h.face.normal.clone().transformDirection(h.object.matrixWorld);
    if (n.z * side < 0) n.negate();
    return {p: h.point.clone(), n};
  });
}

// ---------------------------------------------------------------- internal subsystems revealed in the gaps
function glowMat(col, k = 1.6) {
  return new THREE.MeshStandardMaterial({color: '#11181e', emissive: col, emissiveIntensity: k, metalness: 0.6, roughness: 0.35});
}
const darkMetal = new THREE.MeshStandardMaterial({color: '#2a3036', metalness: 0.85, roughness: 0.4});

function buildSubsystems(xs, b) {
  const r = Math.min(H, W) * 0.36;
  const yC = (b.min.y + b.max.y) / 2;
  // shield generator: core sphere + two gimbal rings
  {
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(r * 0.55, 3), glowMat('#6fd3ff', 1.2));
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.05, 12, 72), glowMat('#6fd3ff', 2));
    const ringB = ringA.clone(); ringB.material = ringA.material;
    const frame = new THREE.Mesh(new THREE.TorusGeometry(r * 1.18, r * 0.09, 8, 6), darkMetal);
    frame.rotation.y = Math.PI / 2;
    g.add(core, ringA, ringB, frame);
    subsys.shield = {group: g, bx: xs[3], j: 2, y: yC, parts: {core, ringA, ringB}, mats: [core.material, ringA.material], base: '#6fd3ff'};
  }
  // weapons bus: hex prism spine + pods (count = grade)
  {
    const g = new THREE.Group();
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.42, r * 0.42, r * 1.7, 6), darkMetal);
    spine.rotation.z = Math.PI / 2;
    const band = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.45, r * 0.45, r * 0.18, 6), glowMat('#ffb347', 1.4));
    band.rotation.z = Math.PI / 2;
    g.add(spine, band);
    const pods = [];
    for (let k = 0; k < 3; k++) {
      const p = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(r * 0.16, r * 0.7, 6, 12), darkMetal);
      body.rotation.z = Math.PI / 2;
      const tip = new THREE.Mesh(new THREE.SphereGeometry(r * 0.12, 16, 8), glowMat('#ffb347', 2.2));
      tip.position.x = r * 0.5;
      p.add(body, tip);
      g.add(p);
      pods.push({p, tip});
    }
    subsys.weapons = {group: g, bx: xs[2], j: 1, y: yC, parts: {band, pods}, mats: [band.material, ...pods.map((q) => q.tip.material)], base: '#ffb347', r};
  }
  // reactor: vertical core + stacked rings
  {
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.22, r * 0.22, r * 1.9, 24), glowMat('#ffd27a', 2.4));
    const rings = [];
    for (let k = 0; k < 4; k++) {
      const t = new THREE.Mesh(new THREE.TorusGeometry(r * 0.48, r * 0.07, 10, 48), darkMetal);
      t.rotation.x = Math.PI / 2; t.position.y = (k - 1.5) * r * 0.45;
      g.add(t); rings.push(t);
    }
    const cage = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.62, r * 0.62, r * 2.0, 8, 1, true), new THREE.MeshStandardMaterial({color: '#1a2026', metalness: 0.9, roughness: 0.5, wireframe: true}));
    g.add(core, cage);
    subsys.reactor = {group: g, bx: xs[1], j: 0, y: yC, parts: {core, rings}, mats: [core.material], base: '#ffd27a'};
  }
  // main drive: booster rings behind the stern (count = speed grade)
  {
    const g = new THREE.Group();
    const rings = [];
    for (let k = 0; k < 3; k++) {
      const t = new THREE.Mesh(new THREE.TorusGeometry(r * 0.8, r * 0.06, 10, 64), glowMat('#ffb070', 1.8));
      t.rotation.y = Math.PI / 2;
      g.add(t); rings.push(t);
    }
    subsys.drive = {group: g, bx: xs[0], j: -1, y: yC, parts: {rings}, mats: rings.map((q) => q.material), base: '#ffb070'};
  }
  // armour lattice: plates that lift off the flanks (count = tier)
  {
    const g = new THREE.Group();
    const plates = [];
    for (let k = 0; k < 10; k++) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(L * 0.12, H * 0.2, 0.035), new THREE.MeshStandardMaterial({color: '#3d454c', metalness: 0.85, roughness: 0.42, emissive: '#f2b632', emissiveIntensity: 0}));
      const edge = new THREE.Mesh(new THREE.BoxGeometry(L * 0.12, 0.018, 0.045), glowMat('#f2b632', 2));
      edge.position.y = H * 0.1;
      p.add(edge);
      g.add(p); plates.push(p);
    }
    subsys.armour = {group: g, bx: 0, j: 99, y: yC, parts: {plates}, mats: plates.map((p) => p.children[0].material), base: '#f2b632', b};
  }
  // repair drones: orbiting pair/trio
  {
    const g = new THREE.Group();
    const drones = [];
    for (let k = 0; k < 3; k++) {
      const d = new THREE.Group();
      const body = new THREE.Mesh(new THREE.OctahedronGeometry(r * 0.22, 0), darkMetal);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(r * 0.09, 12, 8), glowMat('#4dffa0', 2.4));
      eye.position.z = r * 0.16;
      const halo = new THREE.Mesh(new THREE.TorusGeometry(r * 0.3, r * 0.025, 8, 32), glowMat('#4dffa0', 1.6));
      d.add(body, eye, halo); g.add(d); drones.push(d);
    }
    subsys.repair = {group: g, bx: 0, j: 98, y: yC, parts: {drones}, mats: [], base: '#4dffa0'};
  }
  for (const k in subsys) scene.add(subsys[k].group);
}

// ---------------------------------------------------------------- UI
ui.innerHTML = `
<header class="hdr2">
  <div class="crumb"><span class="back" data-act="cancel">&#x2190; FLEET</span><span class="sep">/</span>CONFIGURATION BAY</div>
  <div class="title">${SHIP.name.toUpperCase()}</div>
  <div class="tags"><span>${SHIP.tier.toUpperCase()}</span><span>HULL ${SHIP.cost} PTS</span><span class="dim">DEMO FLEET ${DEMO_FLEET} PTS</span></div>
  <div class="budget"><div class="blabel">FLEET POINTS</div><div class="bnum"><b id="bUsed">0</b> / ${BUDGET}</div><div class="bbar"><i id="bFleet"></i><i id="bHull"></i><i id="bCfg"></i></div></div>
</header>
<aside class="left panel">
  <h3>LOADOUT</h3>
  <div class="grp"><div class="gl">STANDARD</div><div class="cells" id="gStd"></div></div>
  <div class="grp"><div class="gl">TIER</div><div class="cells tier" id="gTier"></div></div>
  <div class="grp"><div class="gl">DAMAGE KITS <span class="dim">· type sets torpedo colour + counter</span></div><div id="gDmg"></div></div>
  <div class="grp"><div class="gl">REPAIR</div><div class="cells" id="gRep"></div></div>
</aside>
<aside class="right panel">
  <h3>SYSTEMS READOUT</h3>
  <div id="stats"></div>
  <div class="counter" id="counter"></div>
  <div class="cost"><div class="cl">CONFIG COST</div><div class="cv" id="cost">+0 PTS</div><div class="cd dim" id="costPct">0 % of hull</div></div>
</aside>
<div class="callouts" id="callouts"></div>
<footer class="foot">
  <div class="seg" id="views">
    <button data-view="solid">SOLID</button><button data-view="xray">X-RAY</button><button data-view="teardown">TEARDOWN</button>
  </div>
  <div class="seg" id="cams"><button data-cam="q">3/4</button><button data-cam="side">SIDE</button><button data-cam="top">TOP</button></div>
  <div class="cfgname"><span class="dot" id="cfgDot"></span><span id="cfgName">DEFAULT</span></div>
  <div class="actions"><button class="ghost" data-act="cancel">CANCEL</button><button class="install" data-act="install">INSTALL</button></div>
</footer>
<div class="toast" id="toast"></div>`;

function cell(c, label) {
  const ok = fits(c.idx);
  const col = cfgColor(c);
  return `<button class="cell${ok ? '' : ' nofit'}" data-cfg="${c.idx}" style="--c:${col}"><span class="cn">${label}</span><span class="cp">${c.idx ? '+' + costOf(c.idx) : '0'}</span>${ok ? '' : '<span class="nf">NO FIT</span>'}</button>`;
}
const C = SHIP.configs;
document.getElementById('gStd').innerHTML = cell(C[0], 'DEFAULT');
document.getElementById('gTier').innerHTML = [1, 2, 3, 4, 5].map((i) => cell(C[i], ROMAN[i])).join('');
document.getElementById('gDmg').innerHTML = DMG.map((d, t) =>
  `<div class="drow"><span class="dn" style="--c:${d[1]}"><i></i>${d[0].toUpperCase()}</span><div class="cells">${[1, 2, 3].map((g) => cell(C[6 + t * 3 + g - 1], GRADES[g])).join('')}</div></div>`).join('');
document.getElementById('gRep').innerHTML = [27, 28, 29].map((i, g) => cell(C[i], GRADES[g + 1])).join('');
document.getElementById('stats').innerHTML = STATS.map(([n, k]) =>
  `<div class="srow" data-k="${k}"><div class="sl">${n}</div><div class="sv"><b>&times;1.00</b><span class="sd"></span></div><div class="sb"><i class="ghost"></i><i class="fill"></i><i class="mark"></i></div></div>`).join('');
const subKeys = Object.keys(SUBS);
document.getElementById('callouts').innerHTML = subKeys.map((k) =>
  `<div class="co" data-sub="${k}"><div class="ct">${SUBS[k].name}</div><div class="cv2"></div></div>`).join('');

function select(i, fromTour) {
  if (!fits(i) && !fromTour) { toast(`NO FIT - needs ${costOf(i)} pts, ${BUDGET - DEMO_FLEET - SHIP.cost} left`); return; }
  S.sel = i;
  const c = C[i];
  S.accentTo.set(cfgColor(c));
  for (const [, k] of STATS) S.stat[k].set(SHIP[k][i], 0.9);
  for (const sk of subKeys) {
    const m = Math.max(...SUBS[sk].stats.map((k) => SHIP[k][i]));
    S.sub[sk].set(Math.min(1, (m - 1) / 0.5));
  }
  S.modules.v = 0; S.modules.set(1, 1.1); S.modules.from = 0; S.modules.t = 0;
  ui.querySelectorAll('.cell').forEach((e) => e.classList.toggle('on', +e.dataset.cfg === i));
  document.getElementById('cfgName').textContent = c.name.toUpperCase();
  document.getElementById('cfgDot').style.background = cfgColor(c);
  const cost = i ? costOf(i) : 0;
  document.getElementById('cost').textContent = `+${cost} PTS`;
  document.getElementById('costPct').textContent = `${SHIP.CfgCostPct[i]} % of hull cost`;
  const used = DEMO_FLEET + SHIP.cost + cost;
  document.getElementById('bUsed').textContent = used;
  const pc = (v) => (100 * v / BUDGET).toFixed(2) + '%';
  document.getElementById('bFleet').style.width = pc(DEMO_FLEET);
  document.getElementById('bHull').style.width = pc(SHIP.cost);
  document.getElementById('bCfg').style.width = pc(cost);
  const ce = document.getElementById('counter');
  if (c.family === 2 || c.family === 3) {
    const d = c.family === 2 ? DMG[Math.floor((i - 6) / 3)] : ['Repair', '#4dffa0', 'Healing Nanobots', 'Nanite Contamination'];
    ce.innerHTML = `<div class="cl">COUNTERMEASURE</div><div class="cm" style="--c:${d[1]}">${d[2].toUpperCase()}</div><div class="dim">${d[3]} lasts <b>&times;${c.counterMult}</b> on this ship</div>`;
    ce.classList.add('show');
  } else ce.classList.remove('show');
  if (S.view === 'solid' && i) setView('teardown');
}
function setView(v) {
  S.view = v;
  S.explode.set(v === 'teardown' ? 1 : 0, v === 'teardown' ? 1.6 : 0.9);
  S.xray.set(v === 'xray' ? 1 : v === 'teardown' ? 0 : 0);
  S.probes.set(v === 'solid' ? 0 : 1);
  ui.querySelectorAll('#views button').forEach((b) => b.classList.toggle('on', b.dataset.view === v));
}
const CAMS = {q: [14.5, 8, 24.5], side: [0, 1.0, 33], top: [0.01, 29, 2]};
let camFrom = null, camTo = null, camT = 1;
function setCam(k) {
  camFrom = camera.position.clone(); camTo = new THREE.Vector3(...CAMS[k]); camT = 0;
  ui.querySelectorAll('#cams button').forEach((b) => b.classList.toggle('on', b.dataset.cam === k));
}
let toastT = 0;
function toast(s) { const e = document.getElementById('toast'); e.textContent = s; e.classList.add('show'); toastT = 2.2; }

ui.addEventListener('click', (e) => {
  const b = e.target.closest('[data-cfg],[data-view],[data-cam],[data-act]');
  if (!b) return;
  if (b.dataset.cfg) select(+b.dataset.cfg);
  else if (b.dataset.view) setView(b.dataset.view);
  else if (b.dataset.cam) setCam(b.dataset.cam);
  else if (b.dataset.act === 'install') toast(`INSTALLED ${C[S.sel].name.toUpperCase()} - returning to fleet`);
  else toast('CANCEL - back to fleet, no change');
});
const wake = () => { S.idle = 0; if (S.tour) { S.tour = false; cursorEl.classList.remove('show'); } };
['pointerdown', 'wheel', 'keydown'].forEach((ev) => addEventListener(ev, wake, {passive: true}));

// ---------------------------------------------------------------- auto tour (skill: idle hands it back)
const TOUR = [['view', 'teardown'], ['cfg', 3], ['cfg', 8], ['cam', 'side'], ['cfg', 11], ['view', 'xray'], ['cfg', 29], ['cam', 'q'], ['view', 'teardown'], ['cfg', 26], ['cfg', 0]];
let tourI = 0, tourT = 0;
function tourStep(dt) {
  tourT -= dt;
  if (tourT > 0) return;
  tourT = 3.6;
  const [kind, val] = TOUR[tourI++ % TOUR.length];
  const sel = kind === 'cfg' ? `[data-cfg="${val}"]` : kind === 'view' ? `[data-view="${val}"]` : `[data-cam="${val}"]`;
  const el = ui.querySelector(sel);
  if (el) {
    const r = el.getBoundingClientRect();
    cursorEl.style.transform = `translate(${r.left + r.width / 2}px, ${r.top + r.height / 2}px)`;
    cursorEl.classList.add('show', 'tap'); setTimeout(() => cursorEl.classList.remove('tap'), 260);
  }
  if (kind === 'cfg') select(val, true); else if (kind === 'view') setView(val); else setCam(val);
}

// ---------------------------------------------------------------- frame
const tmp = new THREE.Vector3();
function layoutUI() {
  const w = innerWidth, h = innerHeight, k = Math.min(w / 1600, h / 900);
  ui.style.transform = `translate(${(w - 1600 * k) / 2}px, ${(h - 900 * k) / 2}px) scale(${k})`;
  renderer.setSize(w, h, false); composer.setSize(w, h);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  return k;
}
let uiK = layoutUI();
addEventListener('resize', () => { uiK = layoutUI(); });

function frame(dt) {
  S.time += dt;
  S.idle += dt;
  if (!S.tour && S.idle > 14) { S.tour = true; tourT = 0; }
  if (S.tour) tourStep(dt);
  if (toastT > 0 && (toastT -= dt) <= 0) document.getElementById('toast').classList.remove('show');
  const ex = S.explode.step(dt), xr = S.xray.step(dt), pr = S.probes.step(dt), fit = S.modules.step(dt);
  for (const k in S.stat) S.stat[k].step(dt);
  S.accent.lerp(S.accentTo, 1 - Math.exp(-dt * 6));
  const gap = L * 0.13 * ex;
  // slices
  for (let i = 0; i < slices.length; i++) {
    const s = slices[i], d = (i - 1.5) * gap;
    s.root.position.x = d;
    s.lo.constant = -(s.x0 + d); s.hi.constant = s.x1 + d;
    if (s.action) { s.action.time = (1 - pr) * clipDur * 0.999; s.mixer.update(0); }
    for (const m of s.mats) {
      if (m.solid) {
        m.solid.opacity = 1 - 0.93 * xr; m.solid.depthWrite = xr < 0.5;
        m.cap.opacity = (1 - xr) * Math.min(1, ex * 3);
        m.xr.uniforms.uA.value = xr + ex * 0.15; m.xr.uniforms.uCol.value.copy(S.accent).lerp(new THREE.Color('#6fd3ff'), 0.6);
        m.edge.opacity = xr * 0.3 + ex * 0.06; m.edge.color.copy(m.xr.uniforms.uCol.value);
      }
      if (m.glass) m.glass.opacity = 1 - 0.6 * xr;
    }
  }
  // subsystems: sit in the gaps; scale in with explode or x-ray, glow by how much the config feeds them
  const show = Math.max(ex, xr);
  for (const k in subsys) {
    const sb = subsys[k], lit = S.sub[k].step(dt);
    const col = new THREE.Color(sb.base).lerp(S.accent, lit > 0.01 ? 0.85 : 0);
    for (const m of sb.mats) { m.emissive.copy(col); m.emissiveIntensity = (0.5 + 2.2 * lit) * show; }
    const g = sb.group;
    if (sb.j >= 0 && sb.j < 3) {
      g.position.set(sb.bx + (sb.j - 1) * gap, sb.y, 0);
      g.scale.setScalar(Math.max(0.001, EASE_IN(Math.min(1, show)) * (0.85 + 0.15 * lit)));
    }
  }
  const t = S.time, cur = S.sel, c = C[cur];
  // shield: gimbal spin, faster when fed
  {
    const p = subsys.shield.parts, sp = 0.4 + 2 * S.sub.shield.v;
    p.ringA.rotation.set(t * sp, Math.PI / 2, 0); p.ringB.rotation.set(Math.PI / 2, t * sp * 0.8, t * sp * 0.5);
    p.core.rotation.y = t * 0.3;
  }
  // weapons: pods dock on eased arcs, count = damage grade (or tier step)
  {
    const w = subsys.weapons, p = w.parts, r = w.r;
    const n = c.family === 2 ? c.grade : c.family === 1 ? Math.min(3, Math.ceil(c.grade / 2)) : 0;
    p.pods.forEach((q, k) => {
      const on = k < n;
      const a = (k / 3) * Math.PI * 2 + t * 0.25;
      const dock = new THREE.Vector3(0, Math.cos(a) * r * 0.75, Math.sin(a) * r * 0.75);
      const away = dock.clone().multiplyScalar(4).add(new THREE.Vector3(0, r * 2, 0));
      const f = on ? EASE_IN(Math.min(1, Math.max(0, fit * 1.4 - k * 0.15))) : 0;
      q.p.position.lerpVectors(away, dock, f);
      q.p.scale.setScalar(Math.max(0.001, f));
    });
  }
  // reactor rings counter-rotate
  subsys.reactor.parts.rings.forEach((q, k) => { q.rotation.z = t * (k % 2 ? -1 : 1) * (0.5 + 1.5 * S.sub.reactor.v); });
  subsys.reactor.parts.core.scale.set(1, 1 + 0.04 * Math.sin(t * 6), 1);
  // drive rings behind the stern, count from speed multiplier
  {
    const d = subsys.drive, nOn = Math.round(S.sub.drive.to * 3 + (S.sub.drive.to > 0 ? 0.5 : 0));
    d.group.position.set(slices[0].x0 - 1.5 * gap - 0.2, d.y, 0);
    d.parts.rings.forEach((q, k) => {
      const f = k < nOn ? EASE_IN(Math.min(1, Math.max(0, fit * 1.5 - k * 0.2))) : 0;
      q.position.x = -0.35 - k * 0.45 - (1 - f) * 2;
      q.scale.setScalar(Math.max(0.001, f * (1 + 0.05 * Math.sin(t * 5 + k))));
    });
  }
  // armour plates lift off the flanks: count = 2 x tier for Tier configs, hull mult for others
  {
    const a = subsys.armour, b = a.b, hm = SHIP.CfgHull[cur];
    const n = c.family === 1 ? c.grade * 2 : hm > 1.001 ? 2 : 0;
    a.parts.plates.forEach((p, k) => {
      const side = k % 2 ? 1 : -1, slot = Math.floor(k / 2);
      const x = b.min.x + (0.2 + slot * 0.15) * (b.max.x - b.min.x);
      const si = Math.min(3, Math.max(0, SLICE_B.findIndex((f) => x < b.min.x + f * (b.max.x - b.min.x)) === -1 ? 3 : SLICE_B.findIndex((f) => x < b.min.x + f * (b.max.x - b.min.x))));
      const d = (si - 1.5) * gap;
      const f = k < n ? EASE_IN(Math.min(1, Math.max(0, fit * 1.6 - k * 0.06))) : 0;
      const lift = 0.06 + 0.45 * ex, hit = a.hits[k];
      p.position.copy(hit.p).addScaledVector(hit.n, lift + (1 - f) * 3); p.position.x += d;
      p.lookAt(p.position.x + hit.n.x, p.position.y + hit.n.y, p.position.z + hit.n.z);
      p.scale.setScalar(Math.max(0.001, f));
      p.material.emissiveIntensity = 0.15 * f;
    });
  }
  // repair drones orbit when the repair family is fitted
  {
    const rp = subsys.repair, n = c.family === 3 ? c.grade : 0;
    rp.parts.drones.forEach((dd, k) => {
      const f = k < n ? EASE_IN(Math.min(1, Math.max(0, fit * 1.4 - k * 0.15))) : 0;
      const a = t * 0.6 + (k / 3) * Math.PI * 2;
      dd.position.set(Math.cos(a) * L * 0.42, rp.y + H * 0.9 + Math.sin(t * 2 + k) * 0.2, Math.sin(a) * W * 1.1);
      dd.lookAt(0, rp.y, 0);
      dd.scale.setScalar(Math.max(0.001, f));
    });
  }
  deckMat.uniforms.uTime.value = t;
  deckMat.uniforms.uCol.value.copy(S.accent).lerp(new THREE.Color('#4fb8e0'), 0.55);
  // camera
  if (camT < 1 && camTo) { camT = Math.min(1, camT + dt / 1.2); camera.position.lerpVectors(camFrom, camTo, EASE_SS(camT)); }
  else if (S.tour) { const a = dt * 0.05; const p = camera.position; const x = p.x * Math.cos(a) - p.z * Math.sin(a); p.z = p.x * Math.sin(a) + p.z * Math.cos(a); p.x = x; }
  controls.update();
  composer.render();
  drawUI();
}

function anchorOf(k) {
  const sb = subsys[k];
  if (!sb) return null;
  if (k === 'armour') { const p = sb.parts.plates[1]; return p.scale.x > 0.1 ? p.getWorldPosition(tmp).clone() : new THREE.Vector3(0, sb.y + H * 0.3, W * 0.5); }
  if (k === 'repair') { const d = sb.parts.drones[0]; return d.scale.x > 0.1 ? d.getWorldPosition(tmp).clone() : null; }
  if (k === 'drive') return new THREE.Vector3(slices[0].x0 - 1.5 * L * 0.13 * S.explode.v - 0.4, sb.y, 0);
  return sb.group.getWorldPosition(tmp).clone();
}
// callouts sit beside their part: above it for the top row (cores), below for the rest; then pushed apart horizontally
const CO_W = 168, CO_H = 58, CO_ROW = {shield: 'top', weapons: 'top', reactor: 'top', drive: 'bot', armour: 'bot', repair: 'bot'};
const coPos = {};
function drawUI() {
  const w = innerWidth, h = innerHeight;
  const ox = (w - 1600 * uiK) / 2, oy = (h - 900 * uiK) / 2;
  const show = Math.max(S.explode.v, S.xray.v);
  let paths = '';
  // pass 1: anchors in UI space, desired slots
  const want = [];
  for (const k of subKeys) {
    const a = anchorOf(k);
    if (!a) continue;
    a.project(camera);
    const ux = ((a.x * 0.5 + 0.5) * w - ox) / uiK, uy = ((-a.y * 0.5 + 0.5) * h - oy) / uiK;
    const top = CO_ROW[k] === 'top';
    want.push({k, ux, uy, x: ux - CO_W / 2, y: top ? Math.max(118, Math.min(uy - 150, 300)) : Math.min(820, Math.max(uy + 90, 640)), top});
  }
  for (const row of [true, false]) {
    const r = want.filter((q) => q.top === row).sort((a, b) => a.x - b.x);
    const X0 = 400, X1 = 1200 - CO_W, G = CO_W + 14;
    r.forEach((q) => { q.x = Math.max(X0, Math.min(X1, q.x)); });
    for (let i = 1; i < r.length; i++) r[i].x = Math.max(r[i].x, r[i - 1].x + G); // sweep right
    if (r.length && r[r.length - 1].x > X1) { r[r.length - 1].x = X1; for (let i = r.length - 2; i >= 0; i--) r[i].x = Math.min(r[i].x, r[i + 1].x - G); }
  }
  for (const q of want) {
    const p = coPos[q.k] || (coPos[q.k] = {x: q.x, y: q.y});
    p.x += (q.x - p.x) * 0.18; p.y += (q.y - p.y) * 0.18; p.ux = q.ux; p.uy = q.uy; p.top = q.top;
  }
  for (const k of subKeys) {
    const el = ui.querySelector(`.co[data-sub="${k}"]`);
    const a = anchorOf(k);
    const lit = S.sub[k].v;
    const vis = a && (show > 0.6 || (k === 'armour' && lit > 0.05)) && !(k === 'repair' && C[S.sel].family !== 3);
    el.classList.toggle('show', !!vis);
    el.classList.toggle('lit', lit > 0.05);
    if (!vis) continue;
    const m = Math.max(...SUBS[k].stats.map((s) => S.stat[s].v));
    el.querySelector('.cv2').innerHTML = SUBS[k].stats.map((s) => {
      const v = S.stat[s].v; const nm = STATS.find((q) => q[1] === s)[0];
      return `<div><span>${nm}</span><b>${v > 1.0005 ? '+' + Math.round((v - 1) * 100) + '%' : '—'}</b></div>`;
    }).join('');
    const P = coPos[k];
    if (!P) continue;
    el.style.left = P.x + 'px'; el.style.top = P.y + 'px';
    const px = ox + P.ux * uiK, py = oy + P.uy * uiK;
    const lx = ox + (P.x + CO_W / 2) * uiK, ly = oy + (P.y + (P.top ? CO_H : 0)) * uiK;
    const col = lit > 0.05 ? '#' + S.accent.getHexString() : 'rgba(170,200,215,0.45)';
    const ky = ly + (py - ly) * 0.55;
    paths += `<path d="M${lx},${ly} L${lx},${ky} L${px},${py}" stroke="${col}" stroke-width="1.1" fill="none" opacity="0.9"/><circle cx="${px}" cy="${py}" r="3" fill="${col}"/><circle cx="${px}" cy="${py}" r="7" fill="none" stroke="${col}" stroke-width="0.8" opacity="0.6"/>`;
  }
  svg.innerHTML = paths;
  // stats
  for (const [, k] of STATS) {
    const row = ui.querySelector(`.srow[data-k="${k}"]`), v = S.stat[k].v;
    row.querySelector('b').textContent = '×' + v.toFixed(2);
    const d = row.querySelector('.sd');
    d.textContent = v > 1.0005 ? '+' + ((v - 1) * 100).toFixed(0) + '%' : '';
    row.querySelector('.fill').style.width = (100 * (v - 1) / 0.75).toFixed(1) + '%';
    row.classList.toggle('up', v > 1.0005);
  }
  ui.style.setProperty('--acc', '#' + S.accent.getHexString());
}

// ---------------------------------------------------------------- boot
const loader = new GLTFLoader();
const bytes = Uint8Array.from(atob(GLB), (ch) => ch.charCodeAt(0));
loader.parse(bytes.buffer, '', (gltf) => {
  buildShip(gltf);
  camera.position.set(...CAMS.q); setCam('q'); camT = 1;
  select(0); setView('teardown');
  ui.querySelectorAll('#views button').forEach((b) => b.classList.toggle('on', b.dataset.view === 'teardown'));
  window.__bay = {select, setView, setCam, S, ready: true};
  let last = performance.now();
  const loop = (now) => { const dt = Math.min(0.05, (now - last) / 1000); last = now; frame(dt); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
}, (err) => { console.error(err); ui.innerHTML = `<div class="err">model failed: ${err}</div>`; });
