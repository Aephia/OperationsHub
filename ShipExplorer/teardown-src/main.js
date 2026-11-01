// Ship Explorer teardown (2026-11-01): the look of the approved Configuration Bay mockup
// (ShipExplorer/_prototypes/configbay-teardown), rebuilt for every hull with SAGE data. Toggling a configuration pulls the
// hull apart and flies in exactly the parts that configuration fits (fit.js reads them from the ship record).
// Built to ShipExplorer/teardown/ship-teardown.js by build.mjs; ship-visual.js loads it on the first ship view.
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {GROUPS, fitOf, groupsOf, diffOf, calloutsOf, accentOf} from './fit.js';
import {envelopes, buildWorks} from './works.js';
import {decksOf, roofedDeck, canopyOf, tooThin, layout} from './deck.js';

// ---------------------------------------------------------------- pose constants: every piece count lives here
const L = 9;                 // normalised hull length
const STATIONS = 7;          // hull cut into this many sections along its length...
const SIDES = 2;             // ...each split port / starboard...
const LAYERS = 2;            // ...and dorsal / ventral: 28 hull pieces
const GAP = {warp: 0, reactor: 1, modules: 2, counter: 3, shield: 4, bay: 5}; // which opening between sections holds what
const MAX_PARTS = 28;        // real named meshes that fly off whole; the rest stay in the sectioned hull
const PART_DIAG = 0.34;      // a mesh under this fraction of hull length counts as a real part
const CALLOUTS = 5;
const CO_TOP = new Set(['reactor', 'warp', 'shield', 'weapons', 'scanner', 'dronePort', 'drones', 'tractor']); // above the ship
const PLUME_MAX = 1.1;       // an engine plume may reach this far behind the hull; longer ones are compressed to fit
const SOLID_ZOOM = 1.6;     // the closed hull sits closer; the camera pulls back as it opens
const OPEN_ZOOM = 1.14;     // ...to here: camDist frames a box, and a hull never fills its box's corners
const GLASS_IS_HULL = 0.2;    // glass with this share of the triangles is the hull's skin, not a window (Jod Asteris)
const IS_VFX = /vfx|flare/i;  // effect meshes: never part of the hull's size or its pieces
const POD_ON_MOUNT = 0.72;   // a weapon pod seated on a real gun is smaller than one in the rack
const MOUNT_RING = 6;        // more weapons than guns: the extras ring the gun, this many to a ring, barrels parallel

// ---------------------------------------------------------------- easing (teardown skill numbers)
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
const clamp01 = (v) => Math.max(0, Math.min(1, v));
class Tween {
  constructor(v, dur = 0.8, ease = EASE_SS) { this.from = this.to = this.v = v; this.t = 1; this.dur = dur; this.ease = ease; }
  set(to, dur) { if (to === this.to) return; this.from = this.v; this.to = to; this.t = 0; if (dur) this.dur = dur; }
  step(dt) { this.t = Math.min(1, this.t + dt / this.dur); this.v = this.from + (this.to - this.from) * this.ease(this.t); return this.v; }
}

// ---------------------------------------------------------------- geometry helpers
// plain float position + normal, world transform baked: quantised GLBs come back as normalised Int16 otherwise
function bakeGeometry(mesh, inverseRoot) {
  const src = mesh.geometry, pos = src.getAttribute('position'), nor = src.getAttribute('normal');
  const g = new THREE.BufferGeometry();
  const p = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) { p[i * 3] = pos.getX(i); p[i * 3 + 1] = pos.getY(i); p[i * 3 + 2] = pos.getZ(i); }
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  if (nor) {
    const n = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) { n[i * 3] = nor.getX(i); n[i * 3 + 1] = nor.getY(i); n[i * 3 + 2] = nor.getZ(i); }
    g.setAttribute('normal', new THREE.BufferAttribute(n, 3));
  }
  if (src.index) g.setIndex(Array.from(src.index.array));
  g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverseRoot, mesh.matrixWorld));
  if (!nor) g.computeVertexNormals();
  return g.index ? g.toNonIndexed() : g;
}

function fresnelMat(planes, col = '#6fd3ff') {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    clipping: true, clippingPlanes: planes,
    uniforms: {uA: {value: 0}, uCol: {value: new THREE.Color(col)}},
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
        float f = pow(clamp(1.0 - abs(dot(normalize(vN), normalize(vV))), 0.0, 1.0), 2.4);
        gl_FragColor = vec4(uCol * (0.03 + f*0.6) * uA, 1.0);
      }`,
  });
}

// the inside of the hull skin: frames and stringers, drawn in the cap's shader so 28 pieces cost no geometry
const capDetail = (s) => {
  s.vertexShader = 'varying vec3 vSkin;\n' + s.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vSkin = position;');
  s.fragmentShader = 'varying vec3 vSkin;\n' + s.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
    float rib = smoothstep(0.86, 0.93, abs(fract(vSkin.x * 2.2) * 2.0 - 1.0));
    float str = smoothstep(0.9, 0.95, abs(fract((vSkin.y + vSkin.z) * 3.1) * 2.0 - 1.0));
    float bay = step(0.5, fract(floor(vSkin.x * 2.2) * 0.5 + floor((vSkin.y + vSkin.z) * 3.1) * 0.5));
    diffuseColor.rgb *= 0.82 + 0.3 * bay;
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.17, 0.3, 0.37), max(rib, str * 0.65));`);
};

function glowMat(col, k = 1.4) {
  return new THREE.MeshStandardMaterial({color: '#11181e', emissive: col, emissiveIntensity: k, metalness: 0.5, roughness: 0.4});
}

// ---------------------------------------------------------------- the viewer
class Teardown {
  constructor(host, opts) {
    this.host = host;
    this.opts = opts || {};
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.disposed = false;
    this.pieces = []; this.parts = []; this.items = {}; this.owned = [];
    this.view = 'solid'; this.configName = ''; this.groups = {}; this.callouts = []; this.hover = null;
    this.explode = new Tween(0, 1.5, EASE_IN); this.xray = new Tween(0, 0.7); this.pulse = new Tween(0, 0.5); this.planT = new Tween(0, 0.7);
    this.deckIdx = 0; this.planStats = {};
    this.accent = new THREE.Color('#9fb7c6'); this.accentTo = new THREE.Color('#9fb7c6');
    this.time = 0; this.slow = 0; this.slowFrames = 0; this.touched = false;
    host.classList.add('td');
    host.innerHTML = `<canvas class="td-gl"></canvas><svg class="td-leaders"></svg><div class="td-callouts"></div><div class="td-rooms"></div>`;
    this.ctrl = this.opts.controls || host; // the view and camera buttons live in the bay's footer
    this.ins = {l: 0, r: 0, t: 0, b: 0}; this.k = 1; this.info = {}; this.coPos = {};
    this.canvas = host.querySelector('.td-gl');
    this.svg = host.querySelector('.td-leaders');
    this.coEl = host.querySelector('.td-callouts');
    this.roomEl = host.querySelector('.td-rooms');
    this.onClick = (e) => {
      const b = e.target.closest('[data-view],[data-cam],[data-deck]');
      if (!b) return;
      if (b.dataset.deck) this.setDeck(+b.dataset.deck);
      else if (b.dataset.view) this.setView(b.dataset.view);
      else this.setCam(b.dataset.cam);
    };
    this.ctrl.addEventListener('click', this.onClick);
    this.onTouch = () => { this.touched = true; };
    this.canvas.addEventListener('pointerdown', this.onTouch);
    this.canvas.addEventListener('wheel', this.onTouch, {passive: true});
    this.onLost = () => this.fail(new Error('WebGL context lost'));
    this.canvas.addEventListener('webglcontextlost', this.onLost);
    this.ready = this.boot();
  }

  fail(err) {
    if (this.disposed) return;
    if (this.opts.onFail) this.opts.onFail(err);
    this.dispose();
  }

  async boot() {
    const renderer = this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true, powerPreference: 'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.localClippingEnabled = true;
    renderer.info.autoReset = false;
    const scene = this.scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    this.envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    pmrem.dispose();
    scene.environment = this.envRT.texture;
    scene.environmentIntensity = 0.55;
    this.camera = new THREE.PerspectiveCamera(28, 1, 0.1, 500);
    const controls = this.controls = new OrbitControls(this.camera, this.canvas);
    controls.enableDamping = true; controls.dampingFactor = 0.07; controls.enablePan = false;
    this.backdrop();
    const key = new THREE.DirectionalLight('#dfeaff', 2.6); key.position.set(-6, 9, 7);
    const rim = new THREE.DirectionalLight('#ffc78a', 2.2); rim.position.set(7, 3, -9);
    scene.add(key, rim, new THREE.HemisphereLight('#3a5a78', '#05080c', 0.6));
    // the composer's own target needs samples, or antialias on the renderer does nothing
    this.composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(800, 800, {type: THREE.HalfFloatType, samples: 4}));
    this.composer.addPass(new RenderPass(scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(800, 800), 0.32, 0.45, 0.85);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());

    this.abort = new AbortController();
    let gltf;
    try {
      const res = await fetch(this.opts.url, {signal: this.abort.signal});
      if (!res.ok) throw new Error(`model ${res.status}`);
      gltf = await new GLTFLoader().parseAsync(await res.arrayBuffer(), '');
    } catch (err) {
      if (this.disposed) return undefined; // cancelled by closing, not a failure: nothing to report
      throw err;
    }
    if (this.disposed) { gltf.scene.traverse((o) => { if (o.isMesh) o.geometry.dispose(); }); return undefined; }
    this.buildHull(gltf.scene);
    gltf.scene.traverse((o) => { if (o.isMesh) o.geometry.dispose(); });
    this.buildItems();
    this.resize();
    this.setView('solid', true);
    this.setCam('q', true);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.host);
    let last = performance.now();
    const loop = (now) => {
      if (this.disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      try { this.frame(dt); } catch (err) { this.fail(err); return; }
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
    return this;
  }

  backdrop() {
    const m = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} ',
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
    this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(220, 48, 24), m));
    this.deckMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: {uTime: {value: 0}, uCol: {value: new THREE.Color('#4fb8e0')}},
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv*2.0-1.0; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} ',
      fragmentShader: `varying vec2 vUv; uniform float uTime; uniform vec3 uCol;
        void main(){
          float r = length(vUv); if (r > 1.0) discard;
          float a = atan(vUv.y, vUv.x);
          float rings = pow(abs(sin(r*42.0)), 90.0)*0.35;
          float edge = smoothstep(0.985, 0.99, r) * (1.0 - smoothstep(0.995, 1.0, r));
          float mid = smoothstep(0.62, 0.625, r) * (1.0 - smoothstep(0.63, 0.635, r));
          float ticks = step(0.93, r) * step(r, 0.975) * pow(abs(sin(a*60.0)), 40.0);
          float sweep = pow(max(0.0, cos(a - uTime*0.35)), 30.0) * (1.0 - smoothstep(0.3, 1.0, r)) * 0.25;
          float fade = 1.0 - smoothstep(0.55, 1.0, r)*0.6;
          float v = (rings + ticks*0.8 + edge + mid*0.7) * fade + sweep;
          gl_FragColor = vec4(uCol * v * 0.16, 1.0);
        }`,
    });
    this.deck = new THREE.Mesh(new THREE.PlaneGeometry(21, 21), this.deckMat);
    this.deck.rotation.x = -Math.PI / 2;
    this.scene.add(this.deck);
  }

  // long axis -> X, stern -> -X, length normalised to L, centred; then split the meshes into hull, real parts, glass, flares
  buildHull(src) {
    const pivot = new THREE.Group();
    pivot.add(src);
    pivot.updateMatrixWorld(true);
    const solidBox = () => {
      const bx = new THREE.Box3();
      src.traverse((o) => { if (o.isMesh && !IS_VFX.test(o.name)) bx.expandByObject(o); });
      return bx.isEmpty() ? new THREE.Box3().setFromObject(src) : bx;
    };
    const box = solidBox(), size = box.getSize(new THREE.Vector3()), ctr = box.getCenter(new THREE.Vector3());
    src.position.sub(ctr);
    pivot.updateMatrixWorld(true);
    const engines = []; src.traverse((o) => { if (o.isMesh && /flare|thruster/i.test(o.name)) engines.push(o); });
    let axis = 'z', sign = -1, source = 'convention';
    if (engines.length) {
      const c = engines.reduce((a, f) => a.add(new THREE.Box3().setFromObject(f).getCenter(new THREE.Vector3())), new THREE.Vector3()).divideScalar(engines.length);
      const rx = c.x / (size.x / 2 || 1), rz = c.z / (size.z / 2 || 1);
      if (Math.max(Math.abs(rx), Math.abs(rz)) > 0.25) {
        axis = Math.abs(rz) >= Math.abs(rx) ? 'z' : 'x';
        sign = (axis === 'z' ? rz : rx) > 0 ? 1 : -1;
        source = 'engines';
      }
    }
    const hint = this.opts.sternHint;
    if (source === 'convention' && /^[+-][xz]$/.test(hint || '')) { axis = hint[1]; sign = hint[0] === '+' ? 1 : -1; source = 'hint'; }
    // no engines and no hint: the -z convention only holds if z is plausibly the length, else the long axis is the hull
    if (source === 'convention' && size.z < size.x * 0.8) axis = 'x';
    // rotating +90 about Y sends +z to +x, so the stern lands on -X in all four cases
    pivot.rotation.y = axis === 'z' ? (sign < 0 ? Math.PI / 2 : -Math.PI / 2) : (sign < 0 ? 0 : Math.PI);
    this.orient = {axis, sign, source};
    pivot.scale.setScalar(L / Math.max(size.x, size.z));
    pivot.updateMatrixWorld(true);

    const identity = new THREE.Matrix4();
    const hull = [], partCand = [], glass = [], flare = [], engineXs = this.engineXs = [];
    src.traverse((o) => {
      if (!o.isMesh || !o.geometry.getAttribute('position')) return;
      const g = bakeGeometry(o, identity);
      g.computeBoundingBox();
      if (/flare|thruster/i.test(o.name)) engineXs.push(g.boundingBox.getCenter(new THREE.Vector3()).x);
      const diag = g.boundingBox.getSize(new THREE.Vector3()).length();
      if (/flare|vfx_lights?/i.test(o.name)) flare.push(g);
      else if (IS_VFX.test(o.name)) g.dispose(); // plumes and smoke: they would float in space once the hull opens
      else if (/glass/i.test(o.name)) glass.push(g);
      else if (diag < L * PART_DIAG) partCand.push({g, diag, name: o.name});
      else hull.push(g);
    });
    const triCount = (g) => g.getAttribute('position').count / 3;
    const solidTris = hull.reduce((a, g) => a + triCount(g), 0) + partCand.reduce((a, p) => a + triCount(p.g), 0);
    if (glass.reduce((a, g) => a + triCount(g), 0) >= solidTris * GLASS_IS_HULL) hull.push(...glass.splice(0));
    partCand.sort((a, b) => b.diag - a.diag);
    // a hull made only of small meshes still needs a body to section: the largest stay as hull
    const keepAsHull = hull.length ? 0 : Math.max(1, Math.ceil(partCand.length * 0.5));
    const toHull = partCand.splice(0, keepAsHull);
    hull.push(...toHull.map((p) => p.g));
    partCand.splice(MAX_PARTS).forEach((p) => hull.push(p.g));

    const body = mergeGeometries(hull.map((g) => { g.deleteAttribute('uv'); return g; }), false);
    hull.forEach((g) => g.dispose());
    body.computeBoundingBox();
    const b = this.bounds = body.boundingBox.clone();
    partCand.forEach((p) => b.union(p.g.boundingBox));
    const glassGeo = glass.length ? mergeGeometries(glass, false) : null;
    glass.forEach((g) => g.dispose());
    if (glassGeo) { glassGeo.computeBoundingBox(); b.union(glassGeo.boundingBox); this.owned.push(glassGeo); }
    const sphere = b.getBoundingSphere(new THREE.Sphere());
    this.H = b.max.y - b.min.y; this.W = b.max.z - b.min.z; this.yC = (b.min.y + b.max.y) / 2;
    this.R = Math.max(0.42, Math.min(0.85, Math.min(this.H, this.W) * 0.36));
    this.gapX = Math.max(L * 0.075, this.R * 1.75);
    this.gapZ = Math.max(this.W * 0.14, 0.26); // wide enough to look into: the machinery is what the teardown is for
    this.gapY = Math.max(this.H * 0.2, 0.26);
    this.deck.position.y = b.min.y - this.H * 0.9 - 0.5;

    // stations: half even spacing, half vertex quantile, so a thin tail does not get three empty slices
    const posAttr = body.getAttribute('position');
    const xs = new Float32Array(posAttr.count); for (let i = 0; i < posAttr.count; i++) xs[i] = posAttr.getX(i);
    xs.sort();
    const stations = [b.min.x];
    for (let i = 1; i < STATIONS; i++) {
      const even = b.min.x + (i / STATIONS) * (b.max.x - b.min.x), q = xs[Math.floor((i / STATIONS) * (xs.length - 1))];
      stations.push((even + q) / 2);
    }
    stations.push(b.max.x);
    this.stations = stations;
    // the seam between port and starboard: hull centre line
    const zSplit = this.zSplit = (body.boundingBox.min.z + body.boundingBox.max.z) / 2;
    this.ySplit = (body.boundingBox.min.y + body.boundingBox.max.y) / 2;

    const edgeGeo = new THREE.EdgesGeometry(body, 32);
    this.owned.push(body, edgeGeo);
    const pieceIndex = (geo, stride) => {
      const pos = geo.getAttribute('position'), lists = Array.from({length: STATIONS * SIDES * LAYERS}, () => []);
      for (let v = 0; v + stride <= pos.count; v += stride) {
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, z0 = Infinity, z1 = -Infinity;
        for (let k = 0; k < stride; k++) {
          const x = pos.getX(v + k), y = pos.getY(v + k), z = pos.getZ(v + k);
          x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); z0 = Math.min(z0, z); z1 = Math.max(z1, z);
        }
        for (let i = 0; i < STATIONS; i++) {
          if (i > 0 && x1 < stations[i]) continue;
          if (i < STATIONS - 1 && x0 > stations[i + 1]) continue;
          for (let s = 0; s < SIDES; s++) {
            if (s ? z1 < zSplit : z0 > zSplit) continue;
            for (let l = 0; l < LAYERS; l++) {
              if (l ? y1 < this.ySplit : y0 > this.ySplit) continue;
              const list = lists[(i * SIDES + s) * LAYERS + l];
              for (let k = 0; k < stride; k++) list.push(v + k);
            }
          }
        }
      }
      return lists;
    };
    const triLists = pieceIndex(body, 3), lineLists = pieceIndex(edgeGeo, 2), glassLists = glassGeo ? pieceIndex(glassGeo, 3) : null;
    const subset = (geo, list) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', geo.getAttribute('position'));
      if (geo.getAttribute('normal')) g.setAttribute('normal', geo.getAttribute('normal'));
      g.setIndex(list);
      g.boundingSphere = sphere.clone();
      return g;
    };
    for (let i = 0; i < STATIONS; i++) for (let s = 0; s < SIDES; s++) for (let l = 0; l < LAYERS; l++) {
      const planes = [];
      const lo = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0), hi = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
      const zp = new THREE.Plane(new THREE.Vector3(0, 0, s ? 1 : -1), 0);
      if (i > 0) planes.push(lo);
      if (i < STATIONS - 1) planes.push(hi);
      const yp = new THREE.Plane(new THREE.Vector3(0, l ? 1 : -1, 0), 0);
      planes.push(zp, yp);
      const solid = new THREE.MeshStandardMaterial({color: '#4a5258', metalness: 0.72, roughness: 0.5, envMapIntensity: 0.38, clippingPlanes: planes, transparent: true});
      const cap = new THREE.MeshBasicMaterial({color: '#0f2430', side: THREE.BackSide, clippingPlanes: planes, transparent: true});
      cap.onBeforeCompile = capDetail;
      const xr = fresnelMat(planes);
      const edge = new THREE.LineBasicMaterial({color: '#7fd8ff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, clippingPlanes: planes});
      const group = new THREE.Group();
      const cell = (i * SIDES + s) * LAYERS + l, triGeo = subset(body, triLists[cell]), lineGeo = subset(edgeGeo, lineLists[cell]);
      this.owned.push(triGeo, lineGeo);
      const mSolid = new THREE.Mesh(triGeo, solid), mCap = new THREE.Mesh(triGeo, cap), mXr = new THREE.Mesh(triGeo, xr), mEdge = new THREE.LineSegments(lineGeo, edge);
      mCap.renderOrder = -1; mXr.renderOrder = 2; mEdge.renderOrder = 3;
      group.add(mCap, mSolid, mXr, mEdge);
      let glassMat = null;
      if (glassLists && glassLists[cell].length) {
        glassMat = new THREE.MeshStandardMaterial({color: '#0b1a22', emissive: '#3fc6ff', emissiveIntensity: 0.4, metalness: 0.2, roughness: 0.15, clippingPlanes: planes, transparent: true});
        const gg = subset(glassGeo, glassLists[cell]);
        this.owned.push(gg);
        group.add(new THREE.Mesh(gg, glassMat));
      }
      this.scene.add(group);
      this.pieces.push({group, i, s, l, lo, hi, zp, yp, glassMat, solid, cap, xr, edge, mCap, mXr, mEdge, x0: stations[i], x1: stations[i + 1]});
    }
    // real parts fly off whole, on their own delay and direction
    const hc = b.getCenter(new THREE.Vector3());
    const pSolid = new THREE.MeshStandardMaterial({color: '#59626a', metalness: 0.72, roughness: 0.48, envMapIntensity: 0.4, transparent: true});
    const pXr = fresnelMat([]);
    this.partMats = {solid: pSolid, xr: pXr};
    partCand.forEach((p, n) => {
      const c = p.g.boundingBox.getCenter(new THREE.Vector3());
      const si = this.stationOf(c.x);
      const dir = new THREE.Vector3(0, c.y - hc.y, c.z - hc.z);
      if (dir.lengthSq() < 1e-4) dir.set(0, n % 2 ? 1 : -1, 0);
      dir.normalize();
      const group = new THREE.Group();
      const m = new THREE.Mesh(p.g, pSolid), x = new THREE.Mesh(p.g, pXr);
      x.renderOrder = 2;
      group.add(m, x);
      this.scene.add(group);
      this.owned.push(p.g);
      this.parts.push({group, box: p.g.boundingBox.clone().expandByScalar(0.03), si, side: c.z >= zSplit ? 1 : 0, dir, x, delay: 0.1 + 0.28 * ((n * 7) % 11) / 11, reach: 0.55 + 0.45 * ((n * 5) % 7) / 7});
    });
    this.partCount = this.parts.length;
    const bodyTris = body.getAttribute('position').count / 3, footprint = Math.max(1, (b.max.x - b.min.x) * this.W);
    this.xrGain = Math.max(0.16, Math.min(1, 12000 / bodyTris, 300 / (bodyTris / footprint)));
    // engine flares ride with the section they sit in, one per mesh; one that straddles a seam stays on the centre line
    const flareMat = new THREE.MeshBasicMaterial({color: '#a88a68', transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false});
    this.riders = flare.map((g) => {
      g.computeBoundingBox();
      const over = b.min.x - g.boundingBox.min.x;
      if (over > PLUME_MAX) {
        const pos = g.getAttribute('position'), k = PLUME_MAX / over;
        for (let v = 0; v < pos.count; v++) { const x = pos.getX(v); if (x < b.min.x) pos.setX(v, b.min.x + (x - b.min.x) * k); }
        g.computeBoundingBox();
      }
      const bb = g.boundingBox, c = bb.getCenter(new THREE.Vector3());
      const group = new THREE.Group();
      group.add(new THREE.Mesh(g, flareMat));
      this.scene.add(group);
      this.owned.push(g);
      const across = (lo, hi, at) => lo < at && hi > at;
      return {group, si: this.stationOf(c.x), s: across(bb.min.z, bb.max.z, zSplit) ? -1 : (c.z >= zSplit ? 1 : 0), l: across(bb.min.y, bb.max.y, this.ySplit) ? -1 : (c.y >= this.ySplit ? 1 : 0)};
    });
    // the real guns: the manifest's points are in the GLB's own space, so the transform that placed the hull places them too.
    // A mount on a loose part rides that part; any other rides the hull piece it sits on, by the same rules as the piece.
    const yMid = this.yC;
    this.mounts = (this.opts.mounts || []).map((q) => {
      const p = new THREE.Vector3(q[0], q[1], q[2]).applyMatrix4(src.matrixWorld);
      const part = this.parts.find((c) => c.box.containsPoint(p)) || null;
      const out = new THREE.Vector3(0, p.y - yMid, p.z);
      if (out.lengthSq() < 1e-4) out.set(0, 1, 0);
      return {p, part, si: this.stationOf(p.x), s: p.z >= zSplit ? 1 : 0, l: p.y >= this.ySplit ? 1 : 0, out: out.normalize()};
    });
    this.body = body;
    this.canopy = glassGeo ? canopyOf(glassGeo.getAttribute('position'), b) : null;
    this.buildWorks(body, bodyTris);
    // the extent every camera frames, and the drones stay inside
    this.frameH = {x: (b.max.x - b.min.x + this.gapX * (STATIONS - 1)) / 2 + Math.max(this.R * 2.3, PLUME_MAX), y: this.H / 2 + this.gapY + this.R * 1.5, z: this.W / 2 + this.gapZ + this.R};
    // ray once for the hull's flanks: armour plates sit on the surface
    this.bodyMesh = new THREE.Mesh(body, new THREE.MeshBasicMaterial({side: THREE.DoubleSide}));
    this.bodyMesh.updateMatrixWorld(true);
  }

  // pipes, ribs and contraptions (works.js): built from this hull's sections, seeded by it, so a ship always looks the same
  buildWorks(body, seed) {
    const envs = this.envs = envelopes(body.getAttribute('position'), this.stations);
    const built = buildWorks(envs, Math.round(seed));
    const mat = new THREE.MeshStandardMaterial({vertexColors: true, metalness: 0.62, roughness: 0.52, envMapIntensity: 0.7});
    this.works = built.stations.map((st, i) => {
      const group = new THREE.Group();
      group.visible = false;
      const led = new THREE.MeshBasicMaterial({vertexColors: true, toneMapped: false});
      if (st.geo.solid) { group.add(new THREE.Mesh(st.geo.solid, mat)); this.owned.push(st.geo.solid); }
      if (st.geo.led) { group.add(new THREE.Mesh(st.geo.led, led)); this.owned.push(st.geo.led); }
      this.scene.add(group);
      return {group, led, ...st, i};
    });
    this.worksMat = mat;
    // hoses: a few lines cross a few gaps, each a chain of stretched cylinders, one instanced draw
    this.links = built.links; this.hoseSeg = built.hoseSeg;
    const unit = new THREE.CylinderGeometry(1, 1, 1, 6, 1, true);
    this.owned.push(unit);
    const hoseCount = Math.max(1, built.links.length * built.hoseSeg);
    const hoseMat = new THREE.MeshStandardMaterial({metalness: 0.45, roughness: 0.6, envMapIntensity: 0.6});
    const hoses = this.hoses = new THREE.InstancedMesh(unit, hoseMat, hoseCount);
    hoses.frustumCulled = false;
    const col = new THREE.Color();
    let n = 0;
    for (const l of built.links) for (let q = 0; q < built.hoseSeg; q++) hoses.setColorAt(n++, col.set(l.run.col));
    hoses.visible = false;
    this.scene.add(hoses);
    // a feed line from each seated gun into the core of its section
    const feeds = this.feeds = new THREE.InstancedMesh(unit, new THREE.MeshStandardMaterial({metalness: 0.5, roughness: 0.5}), Math.max(1, this.mounts.length * 5));
    feeds.frustumCulled = false; feeds.visible = false;
    this.scene.add(feeds);
    this._seg = {a: new THREE.Vector3(), b: new THREE.Vector3(), d: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3(), m: new THREE.Matrix4(), up: new THREE.Vector3(0, 1, 0)};
    this.worksEx = -1;
  }
  // one stretched cylinder between a and b; none at all when they meet
  segment(mesh, idx, a, b, r) {
    const S = this._seg, len = S.d.subVectors(b, a).length();
    if (len < 0.004) S.m.makeScale(0, 0, 0);
    else {
      S.q.setFromUnitVectors(S.up, S.d.divideScalar(len));
      S.m.compose(S.a.addVectors(a, b).multiplyScalar(0.5), S.q, S.s.set(r, len, r));
    }
    mesh.setMatrixAt(idx, S.m);
  }
  // how far a section has opened at explode ex: outer sections lead. One function for its pieces, its works and its guns
  pieceE(i, ex) {
    if (ex > 1) return ex;
    const dist = Math.abs(i - (STATIONS - 1) / 2) / ((STATIONS - 1) / 2);
    return EASE_SS(clamp01(ex * 1.25 - (1 - dist) * 0.25));
  }
  mountHome(m, ex, out) {
    if (m.part) return out.copy(m.p).add(m.part.group.position);
    const e = this.pieceE(m.si, ex);
    return out.set(m.p.x + this.stationDX(m.si, e), m.p.y + this.stationDY(m.si, e) + this.layerDY(m.l, e), m.p.z + this.sideDZ(m.s, e));
  }
  worksPose(ex, show) {
    const f = EASE_SS(clamp01((show - 0.02) / 0.3));
    const on = f > 0.001;
    this.hoses.visible = on && ex > 0.01;
    for (const w of this.works) {
      w.group.visible = on;
      if (!on) continue;
      const e = this.pieceE(w.i, ex);
      w.group.position.set(w.mx + this.stationDX(w.i, e), w.cy + this.stationDY(w.i, e), w.cz);
      w.group.scale.setScalar(Math.max(0.001, f));
    }
    if (!this.hoses.visible || Math.abs(ex - this.worksEx) < 1e-4) return;
    this.worksEx = ex;
    const A = this._a || (this._a = new THREE.Vector3()), B = this._b || (this._b = new THREE.Vector3()), P = this._p || (this._p = new THREE.Vector3()), Q = this._q || (this._q = new THREE.Vector3());
    const clear = this.R * 1.36, seg = this.hoseSeg; // a hose bows out past whatever is parked in the gap
    let n = 0;
    {
      for (const {g, run: r} of this.links) {
        const w0 = this.works[g], w1 = this.works[g + 1], e0 = this.envs[g], e1 = this.envs[g + 1];
        const s = Math.sin(r.a), c = Math.cos(r.a);
        A.set(w0.group.position.x + w0.x1 * f, w0.group.position.y + s * e0.hy * r.d * f, w0.group.position.z + c * e0.hz * r.d * f);
        B.set(w1.group.position.x + w1.x0 * f, w1.group.position.y + s * e1.hy * r.d * f, w1.group.position.z + c * e1.hz * r.d * f);
        const rise = Math.max(0.05, clear - Math.hypot(s * e0.hy * r.d, c * e0.hz * r.d));
        const k = clamp01(B.x - A.x) * rise;
        P.copy(A);
        for (let q = 1; q <= seg; q++) {
          const t = q / seg, b = Math.sin(t * Math.PI) * k;
          Q.lerpVectors(A, B, t); Q.y += s * b; Q.z += c * b;
          this.segment(this.hoses, n++, P, Q, r.r * 0.85);
          P.copy(Q);
        }
      }
    }
    this.hoses.instanceMatrix.needsUpdate = true;
  }
  feedsPose(ex) {
    const list = this.items.weapons, M = this.mounts.length, seg = 5;
    let any = false;
    if (!M) return;
    const A = this._fa || (this._fa = new THREE.Vector3()), B = this._fb || (this._fb = new THREE.Vector3()), P = this._fp || (this._fp = new THREE.Vector3()), Q = this._fq || (this._fq = new THREE.Vector3());
    const col = this._fc || (this._fc = new THREE.Color());
    for (let i = 0; i < M; i++) {
      const it = list[i], m = this.mounts[i], w = this.works[m.si], on = it && it.on && it.f.v > 0.5 && w.group.visible;
      for (let q = 0; q < seg; q++) {
        if (!on) { this.feeds.setMatrixAt(i * seg + q, this._seg.m.makeScale(0, 0, 0)); continue; }
        any = true;
        this.mountHome(m, ex, A);
        B.copy(w.group.position);
        P.lerpVectors(A, B, q / seg); Q.lerpVectors(A, B, (q + 1) / seg);
        const sagP = Math.sin((q / seg) * Math.PI) * 0.12, sagQ = Math.sin(((q + 1) / seg) * Math.PI) * 0.12;
        P.y -= sagP; Q.y -= sagQ;
        this.segment(this.feeds, i * seg + q, P, Q, this.R * 0.028);
      }
      if (it) { col.copy(it.col); for (let q = 0; q < seg; q++) this.feeds.setColorAt(i * seg + q, col); }
    }
    this.feeds.visible = any;
    this.feeds.instanceMatrix.needsUpdate = true;
    if (this.feeds.instanceColor) this.feeds.instanceColor.needsUpdate = true;
  }

  stationOf(x) {
    const st = this.stations;
    for (let i = 0; i < STATIONS; i++) if (x < st[i + 1]) return i;
    return STATIONS - 1;
  }
  // how far a station and a side moved at explode e: one function for every piece, item and leader
  stationDX(i, e) { return (i - (STATIONS - 1) / 2) * this.gapX * e; }
  sideDZ(s, e) { return (s ? 1 : -1) * this.gapZ * e; }
  stationDY(i, e) { return (i % 2 ? 1 : -1) * this.H * 0.05 * e; }
  layerDY(l, e) { return (l ? 1 : -1) * this.gapY * e; }
  gapCentre(j, e) { // centre of the gap between stations j and j+1 (j 0..STATIONS-2)
    return (this.stations[j + 1] + this.stationDX(j, e) + this.stations[j + 1] + this.stationDX(j + 1, e)) / 2;
  }

  // ---- fitted parts: built once with each group's cap, shown by count, every item its own tween
  buildItems() {
    const r = this.R;
    const dark = this.dark = new THREE.MeshStandardMaterial({color: '#2a3036', metalness: 0.85, roughness: 0.42});
    const G = (geo) => { this.owned.push(geo); return geo; };
    const mk = (geo, mat) => new THREE.Mesh(geo, mat);
    const turn = (m, x, y, z) => { m.rotation.set(x, y, z); return m; };
    const glowGeo = {
      torusS: G(new THREE.TorusGeometry(r, r * 0.05, 12, 72)), ico: G(new THREE.IcosahedronGeometry(r * 0.55, 3)),
      frame: G(new THREE.TorusGeometry(r * 1.18, r * 0.09, 8, 6)), coreCyl: G(new THREE.CylinderGeometry(r * 0.22, r * 0.22, r * 1.9, 24)),
      ringR: G(new THREE.TorusGeometry(r * 0.48, r * 0.07, 10, 48)), cage: G(new THREE.CylinderGeometry(r * 0.62, r * 0.62, r * 2, 8, 1, true)),
      ring: G(new THREE.TorusGeometry(r * 0.8, r * 0.06, 10, 64)), coil: G(new THREE.TorusKnotGeometry(r * 0.46, r * 0.09, 120, 12, 2, 5)),
      nozzle: G(new THREE.ConeGeometry(r * 0.2, r * 0.55, 16, 1, true)), fin: G(new THREE.BoxGeometry(r * 1.1, r * 0.75, r * 0.035)),
      dish: G(new THREE.SphereGeometry(r * 0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.42)), stalk: G(new THREE.CylinderGeometry(r * 0.05, r * 0.05, r * 0.7, 8)),
      emitter: G(new THREE.ConeGeometry(r * 0.3, r * 0.55, 20, 3, true)), plate: G(new THREE.BoxGeometry(L * 0.13, Math.max(0.2, this.H * 0.22), 0.04)),
      rig: G(new THREE.BoxGeometry(r * 0.75, r * 0.3, r * 0.3)), rigArm: G(new THREE.CylinderGeometry(r * 0.05, r * 0.08, r * 0.8, 8)),
      crate: G(new THREE.BoxGeometry(r * 0.42, r * 0.34, r * 0.5)), band: G(new THREE.BoxGeometry(r * 0.44, r * 0.05, r * 0.52)),
      pod: G(new THREE.CapsuleGeometry(r * 0.2, r * 0.8, 6, 12)), tip: G(new THREE.SphereGeometry(r * 0.15, 14, 8)),
      tube: G(new THREE.CylinderGeometry(r * 0.2, r * 0.2, r * 0.8, 12)), mslBody: G(new THREE.CapsuleGeometry(r * 0.09, r * 0.55, 4, 10)),
      bomb: G(new THREE.SphereGeometry(r * 0.2, 16, 12)), port: G(new THREE.CylinderGeometry(r * 0.26, r * 0.26, r * 0.12, 6)),
      drone: G(new THREE.OctahedronGeometry(r * 0.2, 0)), halo: G(new THREE.TorusGeometry(r * 0.27, r * 0.022, 8, 32)), chaff: G(new THREE.BoxGeometry(r * 0.32, r * 0.05, r * 0.32)),
    };
    const glow = (col, k) => { const m = glowMat(col, k); (this.glowMats = this.glowMats || []).push(m); return m; };
    // each builder returns one Group; `lit` is the material the item's real colour goes on
    const build = {
      reactor: () => { const a = new THREE.Group(), lit = glow('#ffd27a', 2.2), core = mk(glowGeo.coreCyl, lit); a.add(core); const rings = []; for (let k = 0; k < 4; k++) { const t = mk(glowGeo.ringR, dark); t.rotation.x = Math.PI / 2; t.position.y = (k - 1.5) * r * 0.45; a.add(t); rings.push(t); } a.add(mk(glowGeo.cage, new THREE.MeshStandardMaterial({color: '#1a2026', metalness: 0.9, roughness: 0.5, wireframe: true}))); return {obj: a, lit, spin: (t) => rings.forEach((q, i) => { q.rotation.z = t * (i % 2 ? -1 : 1); })}; },
      warp: () => { const a = new THREE.Group(), lit = glow('#b79bff', 1.8), c = mk(glowGeo.coil, lit); c.rotation.y = Math.PI / 2; a.add(c); a.add(turn(mk(glowGeo.frame, dark), 0, Math.PI / 2, 0)); return {obj: a, lit, spin: (t) => { c.rotation.x = t * 1.1; }}; },
      subwarp: () => { const a = new THREE.Group(), lit = glow('#ffb070', 1.8); const rs = [0, 1, 2].map((k) => { const q = mk(glowGeo.ring, lit); q.rotation.y = Math.PI / 2; q.position.x = -k * r * 0.5; a.add(q); return q; }); return {obj: a, lit, spin: (t) => rs.forEach((q, k) => q.scale.setScalar(1 + 0.05 * Math.sin(t * 5 + k)))}; },
      thrusters: () => { const a = new THREE.Group(), lit = glow('#ffb070', 1.6), n = mk(glowGeo.nozzle, lit); n.rotation.z = Math.PI / 2; a.add(n); return {obj: a, lit}; },
      shield: () => { const a = new THREE.Group(), lit = glow('#6fd3ff', 1.8), core = mk(glowGeo.ico, lit), ra = mk(glowGeo.torusS, lit), rb = mk(glowGeo.torusS, lit); a.add(core, ra, rb, turn(mk(glowGeo.frame, dark), 0, Math.PI / 2, 0)); return {obj: a, lit, spin: (t) => { ra.rotation.set(t * 1.1, Math.PI / 2, 0); rb.rotation.set(Math.PI / 2, t * 0.9, t * 0.5); core.rotation.y = t * 0.3; }}; },
      heatsink: () => { const a = new THREE.Group(), lit = glow('#ff8a5c', 1); for (let k = 0; k < 9; k++) { const f = mk(glowGeo.fin, dark); f.position.z = (k - 4) * r * 0.13; a.add(f); } const edge = mk(glowGeo.band, lit); edge.scale.set(2.5, 0.5, 2.25); edge.position.y = r * 0.385; a.add(edge); return {obj: a, lit}; },
      scanner: () => { const a = new THREE.Group(), lit = glow('#5ce6d6', 1.6), d = mk(glowGeo.dish, lit); d.rotation.z = -Math.PI / 2; a.add(d, turn(mk(glowGeo.stalk, dark), 0, 0, Math.PI / 2)); return {obj: a, lit, spin: (t) => { a.rotation.x = t * 0.6; }}; },
      tractor: () => { const a = new THREE.Group(), lit = glow('#7fe0ff', 1.8), e = mk(glowGeo.emitter, lit); e.rotation.z = -Math.PI / 2; a.add(e); return {obj: a, lit}; },
      armour: () => { const a = new THREE.Group(), lit = glow('#f2b632', 1.2), steel = new THREE.MeshStandardMaterial({color: '#59626a', metalness: 0.72, roughness: 0.48}); for (let k = 0; k < 3; k++) { const p = mk(glowGeo.plate, steel); p.scale.set(0.31, 1, 1); p.position.x = (k - 1) * L * 0.043; a.add(p); } const eg = mk(glowGeo.band, lit); eg.scale.set(L * 0.3 / r, 0.3, 0.06); eg.position.y = Math.max(0.1, this.H * 0.11) + 0.01; a.add(eg); return {obj: a, lit}; },
      rig: () => { const a = new THREE.Group(), lit = glow('#4dffa0', 1.6); a.add(mk(glowGeo.rig, dark)); const arm = mk(glowGeo.rigArm, lit); arm.rotation.z = Math.PI / 2; arm.position.x = r * 0.6; a.add(arm); return {obj: a, lit}; },
      crate: () => { const a = new THREE.Group(), lit = glow('#d8c79a', 1.2); a.add(mk(glowGeo.crate, dark), mk(glowGeo.band, lit)); return {obj: a, lit}; },
      weapons: () => { const a = new THREE.Group(), lit = glow('#ffb347', 2); const body = mk(glowGeo.pod, dark); body.rotation.z = Math.PI / 2; const tip = mk(glowGeo.tip, lit); tip.position.x = r * 0.62; a.add(body, tip); return {obj: a, lit}; },
      missileBay: () => { const a = new THREE.Group(), lit = glow('#ff7a3d', 1.4), tb = mk(glowGeo.tube, dark); tb.rotation.z = Math.PI / 2; const end = mk(glowGeo.tip, lit); end.position.x = r * 0.32; end.scale.setScalar(0.8); a.add(tb, end); return {obj: a, lit}; },
      missiles: () => { const a = new THREE.Group(), lit = glow('#ff7a3d', 1.6), b = mk(glowGeo.mslBody, lit); b.rotation.z = Math.PI / 2; a.add(b); return {obj: a, lit}; },
      bombBay: () => { const a = new THREE.Group(), lit = glow('#ff5a5a', 1.5); a.add(mk(glowGeo.bomb, lit)); return {obj: a, lit}; },
      dronePort: () => { const a = new THREE.Group(), lit = glow('#4dffa0', 1.4); a.add(mk(glowGeo.port, lit)); return {obj: a, lit}; },
      drones: () => { const a = new THREE.Group(), lit = glow('#4dffa0', 2); a.add(mk(glowGeo.drone, lit), mk(glowGeo.halo, lit)); return {obj: a, lit}; },
      counter: () => { const a = new THREE.Group(), lit = glow('#c7d3dc', 1.3); a.add(mk(glowGeo.chaff, lit)); return {obj: a, lit}; },
    };
    const builderOf = {cargo: 'crate', fuel: 'crate', ammo: 'crate', passenger: 'crate'};
    for (const k of Object.keys(GROUPS)) {
      const list = [];
      for (let n = 0; n < GROUPS[k].cap; n++) {
        const it = build[builderOf[k] || k]();
        it.f = new Tween(0, 0.9, EASE_IN); it.on = false; it.col = new THREE.Color(GROUPS[k].color); it.n = n;
        it.lit.emissive.copy(it.col);
        it.obj.visible = false;
        this.scene.add(it.obj);
        list.push(it);
      }
      this.items[k] = list;
    }
    // armour slots on the flanks, raycast once onto the real surface
    const rc = new THREE.Raycaster(), b = this.bounds;
    this.armourHits = [0, 1].map((side) => {
      const x = b.min.x + (0.25 + side * 0.45) * (b.max.x - b.min.x);
      return [1, -1].map((sgn) => {
        rc.set(new THREE.Vector3(x, this.yC + this.H * 0.1, sgn * this.W * 3), new THREE.Vector3(0, 0, -sgn));
        const h = rc.intersectObject(this.bodyMesh, false)[0];
        if (!h) return {p: new THREE.Vector3(x, this.yC, sgn * this.W * 0.5), n: new THREE.Vector3(0, 0, sgn)};
        const n = h.face.normal.clone().transformDirection(h.object.matrixWorld);
        if (n.z * sgn < 0) n.negate();
        return {p: h.point.clone(), n};
      });
    }).flat();
  }

  // the home of item n of group k at explode e: a pure function, so a leader always lands on the part it names
  homeOf(k, n, e, t) {
    const r = this.R, yC = this.yC, b = this.bounds, v = new THREE.Vector3();
    const gx = (j) => this.gapCentre(j, e);
    const stern = b.min.x + this.stationDX(0, e), bow = b.max.x + this.stationDX(STATIONS - 1, e);
    const up = this.H / 2 + this.gapY * e + r * 0.9, grid = (cols, step, nn) => [(nn % cols - (cols - 1) / 2) * step, Math.floor(nn / cols)];
    switch (k) {
      case 'subwarp': return v.set(stern - r * 0.9, yC, 0);
      case 'thrusters': return v.set(stern - r * 0.3, yC + (n ? -1 : 1) * (this.H * 0.5 + r * 0.35), 0);
      case 'warp': return v.set(gx(GAP.warp), yC, 0);
      case 'reactor': return v.set(gx(GAP.reactor), yC, 0);
      case 'heatsink': return v.set(gx(GAP.reactor), yC - r * 1.45, 0);
      case 'shield': return v.set(gx(GAP.shield), yC, 0);
      case 'scanner': return v.set(bow + r * 0.95, yC + r * 0.4, 0);
      case 'tractor': return v.set(bow + r * 0.95, yC - r * 0.5, 0);
      case 'rig': return v.set(bow + r * 0.8, yC - r * (1.3 + n * 0.5), (n ? 1 : -1) * r * 0.2);
      case 'cargo': case 'fuel': case 'ammo': case 'passenger': {
        const lane = {cargo: 0, fuel: 1, ammo: 2, passenger: 3}[k];
        const row = Math.floor(n / 2);
        return v.set(gx(GAP.modules) + (lane - 1.5) * r * 0.5, yC + (row - 2.5) * r * 0.4, (n % 2 ? 0.5 : -0.5) * r * 0.58);
      }
      case 'weapons': if (this.mounts.length) {
        const M = this.mounts.length, mt = this.mounts[n % M], extra = Math.floor(n / M);
        this.mountHome(mt, e, v);
        v.x += r * 0.2;
        if (extra) { // more weapons than guns: a battery round the gun, each one still on the ship
          const at = extra - 1, ring = Math.floor(at / MOUNT_RING), a = ((at % MOUNT_RING) / MOUNT_RING) * Math.PI * 2 + ring * 0.5, rad = r * (0.32 + ring * 0.3);
          v.y += Math.sin(a) * rad; v.z += Math.cos(a) * rad;
        }
        return v;
      } else { const [dx, row] = grid(8, this.gapX * 0.62, n); return v.set(dx, yC + up + row * r * 0.42, (n % 2 ? 1 : -1) * r * 0.55); }
      case 'missileBay': { const [dx, row] = grid(6, this.gapX * 0.55, n); return v.set(dx, yC - up - row * r * 0.4, (n % 2 ? 1 : -1) * r * 0.5); }
      case 'missiles': { const [dx, row] = grid(6, this.gapX * 0.55, n); return v.set(dx + this.gapX * 0.18, yC - up - r * 0.34 - row * r * 0.4, (n % 2 ? 1 : -1) * r * 0.5); }
      case 'bombBay': return v.set(gx(GAP.bay) + (n - 1.5) * r * 0.45, yC - r * 1.2, 0);
      case 'dronePort': return v.set(gx(GAP.bay) + (n - 1.5) * r * 0.55, yC + r * 1.1, 0);
      case 'drones': { const a = t * 0.5 + (n / 6) * Math.PI * 2; return v.set(Math.cos(a) * this.frameH.x * 0.9, yC + this.frameH.y * 0.82 + Math.sin(t * 2 + n) * 0.1, Math.sin(a) * this.frameH.z * 0.9); }
      case 'counter': { const [dx, row] = grid(4, r * 0.42, n); return v.set(gx(GAP.counter) + dx, yC + row * r * 0.14 - r * 0.2, 0); }
      default: return v.set(0, yC, 0);
    }
  }

  // ---------------------------------------------------------------- public: what the modal calls
  setConfig(name, config, info, plan) {
    this.info = info || {};
    if (plan) this.planStats = plan;
    const next = groupsOf(fitOf(config));
    const diff = diffOf(this.groups, next);
    this.groups = next;
    this.configName = name || '';
    this.diff = diff;
    this.accentTo.set(accentOf(name));
    const instant = this.reduced;
    for (const k of Object.keys(GROUPS)) {
      const g = next[k], drawn = g ? g.drawn : 0, list = this.items[k];
      let order = 0;
      list.forEach((it, n) => {
        const on = n < drawn;
        if (on) { it.col.set(g.colors[n]); it.lit.emissive.copy(it.col); }
        if (on !== it.on) {
          it.on = on;
          it.delay = on ? order++ * 0.05 : 0;
          it.f.set(on ? 1 : 0, on ? 0.9 : 0.45);
          if (instant) { it.f.v = it.f.to; it.f.t = 1; }
        }
      });
    }
    this.callouts = calloutsOf(next, diff, CALLOUTS);
    this.renderCallouts();
    const bare = !Object.keys(next).length;
    // the toggle IS the animation: any fitted config opens the hull, the bare hull closes it, and an already open hull
    // breathes wider for a moment so a config-to-config change still reads as the ship opening up
    if (this.view === 'plan') this.buildPlan();
    if (this.view === 'plan') return; // the deck plan stays open: its rooms just resized
    if (bare) { if (this.view === 'teardown') this.setView('solid'); }
    else if (this.view === 'solid') this.setView('teardown');
    else if (this.view === 'teardown' && !instant) { this.pulse.v = 1; this.pulse.from = 1; this.pulse.to = 0; this.pulse.t = 0; this.pulse.dur = 1.3; }
  }

  setHover(group) { this.hover = group || null; this.renderCallouts(); }

  // the panels around the ship cover these margins (px): the ship centres in what is left, and fits it
  setInsets(ins, k) {
    this.ins = ins; this.k = k;
    this.host.style.setProperty('--k', String(k));
    this.host.style.setProperty('--planb', `${Math.round(ins.b + 6)}px`);
    this.host.style.setProperty('--planl', `${Math.round(ins.l)}px`);
    this.canvas.style.touchAction = ins.l === 0 && ins.r === 0 ? 'pan-y' : 'none';
    if (this.renderer) this.resize();
  }

  setView(v, instant) {
    const was = this.view;
    this.view = v;
    this.explode.set(v === 'teardown' ? 1 : 0, v === 'teardown' ? 1.5 : 0.9);
    this.xray.set(v === 'xray' || v === 'plan' ? 1 : 0);
    this.planT.set(v === 'plan' ? 1 : 0);
    if (instant || this.reduced) { for (const q of [this.explode, this.xray, this.planT]) { q.v = q.to; q.t = 1; } }
    if (v === 'plan') { if (was !== 'plan') this.camBack = this.camKey; this.buildPlan(); this.setCam('plan', instant); } else if (was === 'plan') { this.setCam(this.camBack || 'q', instant); this.renderDeckButtons(); }
    this.ctrl.querySelectorAll('[data-view]').forEach((b) => b.classList.toggle('on', b.dataset.view === v));
  }

  // cameras framed from the exploded size, so nothing leaves the viewport on any hull and any aspect
  camDist(dir) {
    const {x: hx, y: hy, z: hz} = this.frameH;
    const f = dir.clone().normalize(), right = new THREE.Vector3(0, 1, 0).cross(f).normalize(), up = f.clone().cross(right);
    const ext = (a) => Math.abs(a.x) * hx + Math.abs(a.y) * hy + Math.abs(a.z) * hz;
    const W = this.w || 1, Hh = this.h || 1, fw = Math.max(1, W - this.ins.l - this.ins.r), fh = Math.max(1, Hh - this.ins.t - this.ins.b);
    const vt = Math.tan((this.camera.fov * Math.PI) / 360) * (fh / Hh), ht = Math.tan((this.camera.fov * Math.PI) / 360) * (W / Hh) * (fw / W);
    return Math.max(ext(right) / ht, ext(up) / vt) + ext(f) * 0.5;
  }
  setCam(k, instant) {
    this.camKey = k;
    const dirs = {q: [0.42, 0.36, 0.83], side: [0, 0.03, 1], top: [0.001, 1, 0.06], plan: [0.1, 1, 0.5]};
    const d = this.camDist(new THREE.Vector3(...dirs[k]));
    const to = new THREE.Vector3(...dirs[k]).normalize().multiplyScalar(d);
    this.controls.minDistance = d * 0.3; this.controls.maxDistance = d * 1.8;
    this.camFrom = this.camera.position.clone(); this.camTo = to; this.camT = 0;
    if (instant || this.reduced) { this.camera.position.copy(to); this.camT = 1; }
    this.ctrl.querySelectorAll('[data-cam]').forEach((b) => b.classList.toggle('on', b.dataset.cam === k));
  }

  // ---- the deck plan (deck.js): illustrative rooms inside real slices of this hull
  buildPlan() {
    if (!this.deckSlabs) {
      const geos = [this.body, ...this.parts.map((q) => q.group.children[0].geometry)];
      const count = geos.reduce((a, g) => a + g.getAttribute('position').count, 0), tris = new Float32Array(count * 3);
      let o = 0;
      for (const g of geos) { const a = g.getAttribute('position'); for (let i = 0; i < a.count; i++) { tris[o++] = a.getX(i); tris[o++] = a.getY(i); tris[o++] = a.getZ(i); } }
      const cls = this.opts.shipClass || 3;
      let decks = decksOf(tris, this.bounds, cls);
      if (tooThin(decks)) { const r = roofedDeck(tris, this.bounds); decks = r ? [r] : []; }
      this.deckSlabs = decks; this.deckIdx = decks.length ? decks.reduce((a, d, i) => (d.slab.area > decks[a].slab.area ? i : a), 0) : 0;
    }
    this.plan = layout(this.deckSlabs, {b: this.bounds, cls: this.opts.shipClass || 3, stats: this.planStats, glass: this.canopy, mounts: this.mounts.map((q) => q.p)});
    if (this.deckGroup) { this.scene.remove(this.deckGroup); this.deckGroup.traverse((q) => { if (q.geometry) q.geometry.dispose(); if (q.material) q.material.dispose(); }); }
    const root = this.deckGroup = new THREE.Group();
    const lift = 0.004;
    this.deckMeshes = this.plan.map((d) => {
      const floorP = [], floorC = [], wallP = [], wallC = [], lineP = [], lineC = [], c = new THREE.Color();
      const quad = (P, C, a, b2, d2, e) => { P.push(...a, ...b2, ...d2, ...a, ...d2, ...e); for (let i = 0; i < 6; i++) C.push(c.r, c.g, c.b); };
      const seg = (a, e) => { lineP.push(...a, ...e); lineC.push(c.r, c.g, c.b, c.r, c.g, c.b); };
      const y = d.y + lift, top = d.y + Math.min(d.head * 0.45, 0.13);
      const strip = (xs, a, e, dim) => {
        for (let i = 0; i + 1 < xs.length; i++) {
          const k = dim; c.multiplyScalar(k);
          quad(floorP, floorC, [xs[i], y, a[i]], [xs[i], y, e[i]], [xs[i + 1], y, e[i + 1]], [xs[i + 1], y, a[i + 1]]);
          c.multiplyScalar(1 / k);
        }
      };
      for (const r of d.rooms) {
        c.set(r.color);
        strip(r.xs, r.a, r.b, 0.55);
        const n = r.xs.length - 1, door = Math.floor(n / 2); // a gap in the wall on the corridor side is the door
        for (let i = 0; i < n; i++) {
          const walls = [[r.a, r.row === 1 && Math.abs(i - door) <= 0], [r.b, r.row === 0 && Math.abs(i - door) <= 0]];
          for (const [z, gap] of walls) {
            if (gap) continue;
            const p = [r.xs[i], y, z[i]], q = [r.xs[i + 1], y, z[i + 1]], pt = [r.xs[i], top, z[i]], qt = [r.xs[i + 1], top, z[i + 1]];
            quad(wallP, wallC, p, q, qt, pt); seg(pt, qt);
          }
        }
        for (const i of [0, n]) { const p = [r.xs[i], y, r.a[i]], q = [r.xs[i], y, r.b[i]], pt = [r.xs[i], top, r.a[i]], qt = [r.xs[i], top, r.b[i]]; quad(wallP, wallC, p, q, qt, pt); seg(pt, qt); }
      }
      for (const cr of d.corridors) { c.set('#2b3a44'); strip(cr.xs, cr.a, cr.b, 1); }
      const mk = (P, C) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P), 3)); g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(C), 3)); return g; };
      const opts = {vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide};
      const floor = new THREE.Mesh(mk(floorP, floorC), new THREE.MeshBasicMaterial({...opts, blending: THREE.AdditiveBlending}));
      const wall = new THREE.Mesh(mk(wallP, wallC), new THREE.MeshBasicMaterial({...opts, blending: THREE.AdditiveBlending}));
      const line = new THREE.LineSegments(mk(lineP, lineC), new THREE.LineBasicMaterial({vertexColors: true, transparent: true, depthWrite: false}));
      floor.renderOrder = wall.renderOrder = line.renderOrder = 4;
      root.add(floor, wall, line);
      return {floor, wall, line};
    });
    root.visible = false;
    this.scene.add(root);
    this.setDeck(Math.max(0, Math.min(this.deckIdx, this.plan.length - 1)));
  }
  setDeck(i) {
    this.deckIdx = i;
    this.renderDeckButtons();
    const d = this.plan[i], fmt = this.opts.formatStat || String, esc = (v) => String(v).replace(/[&<>"]/g, (q) => `&#${q.charCodeAt(0)};`);
    this.roomLabels = (d ? d.rooms : []).slice().sort((p, q) => q.area - p.area).map((r) => {
      const n = Math.floor(r.xs.length / 2);
      return {r, x: r.xs[n], y: d.y, z: (r.a[n] + r.b[n]) / 2};
    });
    this.gunLabels = d ? d.guns.map((g) => ({x: g.x, y: g.y, z: g.z})) : [];
    // every room on this deck is named in the legend, whether or not its label on the plan had space
    const legend = (d ? d.rooms : []).slice().sort((p, q) => p.c0 - q.c0).filter((r) => r.type !== 'fore' || r.area > 0).map((r) => `<span class="td-leg" style="--c:${r.color}" data-room="${r.type}"><i></i>${esc(r.label)}${r.value != null ? ` <b>${esc(fmt(r.value))}</b>` : ''}</span>`).join('');
    const note = !d ? 'No deck plan for this hull: its shape has no run of floor to lay rooms on' : `Illustrative layout${d.spine ? ', simplified for this hull' : ''}: rooms are not from the game, sizes roughly follow this loadout`;
    this.roomEl.innerHTML = this.roomLabels.map((l) => `<div class="td-room" style="--c:${l.r.color}"><b>${esc(l.r.label)}</b>${l.r.value != null ? `<span>${esc(fmt(l.r.value))}</span>` : ''}</div>`).join('') + this.gunLabels.map(() => '<div class="td-gun"></div>').join('') + `<div class="td-plan-foot"><div class="td-plan-legend">${legend}</div><div class="td-plan-note">${note}</div></div>`;
    this.roomEls = [...this.roomEl.querySelectorAll('.td-room')].map((e) => ({e, w: e.offsetWidth, h: e.offsetHeight}));
    this.gunEls = [...this.roomEl.querySelectorAll('.td-gun')];
  }
  renderDeckButtons() {
    const box = this.ctrl.querySelector ? this.ctrl.querySelector('[data-decks]') : null;
    if (!box) return;
    const n = this.view === 'plan' && this.plan ? this.plan.length : 0;
    box.hidden = n < 2;
    if (box.children.length !== (n < 2 ? 0 : n)) box.innerHTML = n < 2 ? '' : this.plan.map((_, i) => `<button type="button" data-deck="${i}">Deck ${n - i}</button>`).join('');
    [...box.children].forEach((q, i) => q.classList.toggle('on', i === this.deckIdx));
  }
  drawRooms(on) {
    this.roomEl.classList.toggle('show', on);
    if (!on || !this.roomEls) return;
    const tmp = this._tmp2 || (this._tmp2 = new THREE.Vector3()), {l: L0, r: R0, t: T0, b: B0} = this.ins, placed = [];
    this.roomLabels.forEach((q, i) => {
      const it = this.roomEls[i];
      tmp.set(q.x, q.y, q.z).project(this.camera);
      const x = (tmp.x * 0.5 + 0.5) * this.w - it.w / 2, y = (-tmp.y * 0.5 + 0.5) * this.h - it.h / 2;
      const clash = placed.some((p) => x < p[2] && x + it.w > p[0] && y < p[3] && y + it.h > p[1]);
      const out = x < L0 || x + it.w > this.w - R0 || y < T0 || y + it.h > this.h - B0;
      it.e.style.visibility = clash || out ? 'hidden' : 'visible';
      if (clash || out) { it.shown = false; return; }
      it.shown = true;
      placed.push([x, y, x + it.w, y + it.h]);
      it.e.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
    this.gunLabels.forEach((g, i) => {
      tmp.set(g.x, g.y, g.z).project(this.camera);
      this.gunEls[i].style.transform = `translate(${((tmp.x * 0.5 + 0.5) * this.w).toFixed(1)}px, ${((-tmp.y * 0.5 + 0.5) * this.h).toFixed(1)}px)`;
    });
  }

  renderCallouts() {
    const shown = this.hover && this.groups[this.hover] && !this.callouts.includes(this.hover) ? [this.hover, ...this.callouts.slice(0, CALLOUTS - 1)] : this.callouts;
    this.shownCallouts = shown;
    this.coEl.innerHTML = shown.map((k) => {
      const g = this.groups[k], rows = this.info[k] || [];
      const d = (this.diff || []).find((q) => q.group === k);
      const delta = d && d.from ? ` <em>${d.to > d.from ? '+' : ''}${d.to - d.from}</em>` : '';
      return `<div class="td-co${k === this.hover ? ' hot' : ''}${rows.some((r) => r[2]) ? ' lit' : ''}" data-group="${k}" style="--c:${g.colors[0]}"><div class="ct"><span>${GROUPS[k].label}</span><b>&times;${g.count}</b>${delta}</div>${rows.map((r) => `<div class="cr"><span>${r[0]}</span><b class="${r[2] || ''}">${r[1]}</b></div>`).join('')}</div>`;
    }).join('');
  }

  resize() {
    const w = Math.max(1, this.host.clientWidth), h = Math.max(1, this.host.clientHeight);
    this.renderer.setSize(w, h, false);
    this.composer.setPixelRatio(this.renderer.getPixelRatio());
    this.composer.setSize(w, h);
    this.camera.aspect = w / h;
    this.w = w; this.h = h;
    this.camera.setViewOffset(w, h, (this.ins.r - this.ins.l) / 2, (this.ins.b - this.ins.t) / 2, w, h);
    this.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    if (this.camKey && !this.touched) { const d = this.camDist(this.camera.position.lengthSq() ? this.camera.position : new THREE.Vector3(0, 0, 1)); this.camera.position.setLength(d); if (this.camTo) this.camTo.setLength(d); this.controls.minDistance = d * 0.3; this.controls.maxDistance = d * 1.8; }
    this.w = w; this.h = h;
    if (this.roomEls) this.roomEls.forEach((q) => { q.w = q.e.offsetWidth; q.h = q.e.offsetHeight; });
  }

  // ---------------------------------------------------------------- one frame
  frame(dt) {
    this.time += dt;
    const t = this.time, reduced = this.reduced;
    const ex0 = this.explode.step(dt), xr = this.xray.step(dt), pulse = this.pulse.step(dt), planV = this.planT.step(dt);
    const ghost = 1 - 0.62 * planV; // the deck plan needs the hull as faint glass
    const ex = ex0 * (1 + 0.16 * pulse);
    this.accent.lerp(this.accentTo, 1 - Math.exp(-dt * 6));
    const blue = this._blue || (this._blue = new THREE.Color('#6fd3ff')), xc = this._xc || (this._xc = new THREE.Color());
    xc.copy(this.accent).lerp(blue, 0.6);
    const zSplit = this.zSplit;
    // hull pieces: outer stations lead, the rest follow
    for (const p of this.pieces) {
      const e = this.pieceE(p.i, ex);
      const dx = this.stationDX(p.i, e), dz = this.sideDZ(p.s, e), dy = this.stationDY(p.i, e) + this.layerDY(p.l, e);
      p.group.position.set(dx, dy, dz);
      p.lo.constant = -(p.x0 + dx); p.hi.constant = p.x1 + dx;
      p.zp.constant = p.s ? -(zSplit + dz) : zSplit + dz;
      p.yp.constant = p.l ? -(this.ySplit + dy) : this.ySplit + dy;
      p.solid.opacity = 1 - 0.93 * xr; p.solid.depthWrite = xr < 0.5;
      p.cap.opacity = (1 - xr) * clamp01(ex * 3);
      p.mCap.visible = p.cap.opacity > 0.01;
      const a = (xr + ex * 0.15) * this.xrGain * ghost;
      p.xr.uniforms.uA.value = a; p.xr.uniforms.uCol.value.copy(xc); p.mXr.visible = a > 0.005;
      p.edge.opacity = (xr * 0.3 + ex * 0.06) * this.xrGain * ghost; p.edge.color.copy(xc); p.mEdge.visible = p.edge.opacity > 0.005;
      if (p.glassMat) p.glassMat.opacity = 1 - 0.6 * xr;
    }
    // real parts: each lifts off on its own delay, along its own line out of the hull
    const pm = this.partMats;
    if (pm) {
      pm.solid.opacity = 1 - 0.93 * xr; pm.solid.depthWrite = xr < 0.5;
      const a = (xr + ex * 0.15) * this.xrGain * ghost; pm.xr.uniforms.uA.value = a; pm.xr.uniforms.uCol.value.copy(xc);
      for (const q of this.parts) {
        const f = ex <= 1 ? EASE_IN(clamp01(ex * 1.4 - q.delay)) : ex;
        const lift = f * q.reach * (this.W * 0.16 + this.R * 0.55);
        q.group.position.set(this.stationDX(q.si, f), this.stationDY(q.si, f) + q.dir.y * lift, this.sideDZ(q.side, f) + q.dir.z * lift);
        q.x.visible = a > 0.005;
      }
    }
    for (const q of this.riders) {
      q.group.position.set(this.stationDX(q.si, ex), this.stationDY(q.si, ex) + (q.l < 0 ? 0 : this.layerDY(q.l, ex)), q.s < 0 ? 0 : this.sideDZ(q.s, ex));
    }
    // fitted items
    const show = Math.max(ex0, xr) * (1 - planV);
    this.worksPose(ex, show);
    if (this.deckGroup) {
      this.deckGroup.visible = planV > 0.01;
      this.deckMeshes.forEach((q, i) => {
        const k = planV * (i === this.deckIdx ? 1 : 0.1);
        q.floor.material.opacity = 0.55 * k; q.wall.material.opacity = 0.4 * k; q.line.material.opacity = 0.9 * k;
      });
    }
    if (!reduced) for (const w of this.works) w.led.color.setScalar(1.15 + 0.5 * Math.sin(t * 1.7 + w.i * 1.3));
    const a2 = new THREE.Vector3();
    for (const k of Object.keys(this.items)) {
      const dim = this.hover && this.hover !== k && this.groups[this.hover] ? 0.3 : 1;
      for (const it of this.items[k]) {
        if (it.delay > 0 && it.on) { it.delay -= dt; }
        else it.f.step(dt);
        const f = it.f.v * show;
        it.obj.visible = f > 0.002;
        if (!it.obj.visible) continue;
        const home = k === 'armour' ? this.armourHome(it.n, ex, a2) : this.homeOf(k, it.n, ex, reduced ? 0 : t);
        // items arrive on an arc from above and outside the hull
        const away = (1 - f);
        it.obj.position.copy(home);
        it.obj.position.y += away * (this.H + this.R * 3);
        it.obj.position.z += away * (it.n % 2 ? 1 : -1) * (this.W + this.R * 2);
        if (k !== 'armour') it.obj.scale.setScalar(Math.max(0.001, f) * (k === 'weapons' && this.mounts.length ? POD_ON_MOUNT : 1));
        it.lit.emissiveIntensity = (0.3 + 0.75 * f) * dim;
        if (it.spin && !reduced) it.spin(t);
      }
    }
    this.feedsPose(ex);
    this.deckMat.uniforms.uTime.value = reduced ? 0 : t;
    this.deckMat.uniforms.uCol.value.copy(this.accent).lerp(this._deck || (this._deck = new THREE.Color('#4fb8e0')), 0.55);
    // camera: a move in progress, otherwise a slow drift until the first touch
    if (this.camT < 1) { this.camT = Math.min(1, this.camT + dt / 1.2); this.camera.position.lerpVectors(this.camFrom, this.camTo, EASE_SS(this.camT)); }
    else if (!this.touched && !reduced && this.camKey === 'q') { const a = dt * 0.06, p = this.camera.position, x = p.x * Math.cos(a) - p.z * Math.sin(a); p.z = p.x * Math.sin(a) + p.z * Math.cos(a); p.x = x; }
    const open = this.ins.l === 0 && this.ins.r === 0 ? 1 : OPEN_ZOOM; // stacked: the stage edge is the frame, no margin to spend
    const zoom = SOLID_ZOOM - (SOLID_ZOOM - open) * clamp01(Math.max(ex0, xr * (1 - planV)));
    if (Math.abs(zoom - this.camera.zoom) > 1e-4) { this.camera.zoom = zoom; this.camera.updateProjectionMatrix(); }
    this.controls.update();
    this.renderer.info.reset();
    this.composer.render();
    this.drawLeaders();
    this.drawRooms(planV > 0.7);
    // slow machine: drop the expensive tier once and stay there
    this.slow += dt; this.slowFrames++;
    if (this.slow >= 2) {
      if (this.slow / this.slowFrames > 1 / 28 && this.bloom.enabled) { this.bloom.enabled = false; this.renderer.setPixelRatio(1); this.resize(); }
      this.slow = 0; this.slowFrames = 0;
    }
  }

  armourHome(n, ex, out) {
    const h = this.armourHits[n % this.armourHits.length], si = this.stationOf(h.p.x), side = h.n.z >= 0 ? 1 : 0;
    return out.copy(h.p).addScaledVector(h.n, 0.05 + 0.5 * ex).add(new THREE.Vector3(this.stationDX(si, ex), this.stationDY(si, ex), this.sideDZ(side, ex)));
  }

  // cards sit above and below the ship beside their part, are pushed apart so they never overlap, and a leader runs to
  // the first real item of the group. Cards that cannot fit between the panels are not drawn; the Fitted list has them all.
  drawLeaders() {
    const list = this.shownCallouts || [];
    const show = this.view === 'plan' ? 0 : Math.max(this.explode.v, this.xray.v);
    this.coEl.classList.toggle('show', show > 0.6);
    if (show <= 0.6 || !list.length) { if (this.svgOn) { this.svg.innerHTML = ''; this.svgOn = false; } return; }
    this.svgOn = true;
    const tmp = this._tmp || (this._tmp = new THREE.Vector3()), {l, r, t, b} = this.ins;
    const X0 = l + 8, X1 = this.w - r - 8, Y0 = t + 6, Y1 = this.h - b - 6;
    const cards = [];
    for (const k of list) {
      const el = this.coEl.querySelector(`.td-co[data-group="${k}"]`), it = (this.items[k] || []).find((q) => q.on);
      if (!el || !it) continue;
      // the weapons card reaches every real gun that is fitted; every other card its first part
      const targets = k === 'weapons' && this.mounts.length ? this.items.weapons.slice(0, this.mounts.length).filter((q) => q.on) : [it];
      const pts = targets.map((q) => { tmp.copy(q.obj.position).project(this.camera); return [(tmp.x * 0.5 + 0.5) * this.w, (-tmp.y * 0.5 + 0.5) * this.h]; });
      cards.push({k, el, cw: el.offsetWidth, ch: el.offsetHeight, top: CO_TOP.has(k), pts, px: pts.reduce((a, q) => a + q[0], 0) / pts.length, py: pts.reduce((a, q) => a + q[1], 0) / pts.length, col: this.groups[k].colors[0]});
    }
    let paths = '';
    for (const top of [true, false]) {
      const row = cards.filter((c) => c.top === top).sort((a, c) => a.px - c.px);
      const gap = 8 * this.k;
      let used = 0;
      const kept = row.filter((c) => { used += c.cw + gap; const fits = used - gap <= X1 - X0; c.el.style.visibility = fits ? 'visible' : 'hidden'; return fits; });
      let x = X0;
      kept.forEach((c) => { c.x = Math.max(x, Math.min(X1 - c.cw, c.px - c.cw / 2)); x = c.x + c.cw + gap; });
      if (kept.length && kept[kept.length - 1].x + kept[kept.length - 1].cw > X1) {
        let lim = X1;
        for (let i = kept.length - 1; i >= 0; i--) { kept[i].x = Math.min(kept[i].x, lim - kept[i].cw); lim = kept[i].x - gap; }
      }
      for (const c of kept) {
        const y = top ? Y0 : Y1 - c.ch;
        const P = this.coPos[c.k] || (this.coPos[c.k] = {x: c.x, y});
        P.x += (c.x - P.x) * 0.18; P.y += (y - P.y) * 0.18;
        c.el.style.left = `${P.x.toFixed(1)}px`; c.el.style.top = `${P.y.toFixed(1)}px`;
        const lx = P.x + c.cw / 2, ly = P.y + (top ? c.ch : 0), ky = ly + (c.py - ly) * 0.55;
        for (const [tx, ty] of c.pts) paths += `<path d="M${lx.toFixed(1)},${ly.toFixed(1)} L${lx.toFixed(1)},${ky.toFixed(1)} L${tx.toFixed(1)},${ty.toFixed(1)}" stroke="${c.col}" stroke-width="1.1" fill="none" opacity="0.85"/><circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="3" fill="${c.col}"/><circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="7" fill="none" stroke="${c.col}" stroke-width="0.8" opacity="0.6"/>`;
      }
    }
    this.svg.innerHTML = paths;
  }

  // is there hull above and below this point? For tests: rays that know nothing of how deck.js chose its floor
  roofedAt(x, y, z) {
    const rc = this._rc || (this._rc = new THREE.Raycaster()), o = new THREE.Vector3(x, y, z), meshes = [this.bodyMesh, ...this.parts.map((q) => q.group.children[0])];
    const hit = (dy) => { rc.set(o, new THREE.Vector3(0, dy, 0)); return meshes.some((q) => { const was = q.material.side; q.material.side = THREE.DoubleSide; const h = rc.intersectObject(q, false).length > 0; q.material.side = was; return h; }); };
    return hit(1) && hit(-1);
  }

  // where the opened hull really lands on screen, from its vertices: tests read this against the panels
  screenExtent() {
    const pos = this.body.getAttribute('position'), v = new THREE.Vector3(), step = Math.max(1, Math.floor(pos.count / 4000));
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    const e = this.explode.v;
    this.camera.updateMatrixWorld();
    for (let i = 0; i < pos.count; i += step) {
      v.fromBufferAttribute(pos, i);
      const si = this.stationOf(v.x), pe = this.pieceE(si, e);
      v.x += this.stationDX(si, pe); v.y += this.stationDY(si, pe) + this.layerDY(v.y >= this.ySplit ? 1 : 0, pe); v.z += this.sideDZ(v.z >= this.zSplit ? 1 : 0, pe);
      v.project(this.camera);
      const px = (v.x * 0.5 + 0.5) * this.w, py = (-v.y * 0.5 + 0.5) * this.h;
      x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py);
    }
    return {x0, x1, y0, y1, free: [this.ins.l, this.w - this.ins.r, this.ins.t, this.h - this.ins.b]};
  }

  // state for tests and for nothing else
  debug() {
    const on = {};
    for (const k of Object.keys(this.items)) on[k] = this.items[k].filter((q) => q.on).length;
    const eng = this.engineXs;
    // how far each real gun is from the hull's own geometry, at rest, in this viewer's space
    const pos = this.body.getAttribute('position'), geos = [pos, ...this.parts.map((q) => q.group.children[0].geometry.getAttribute('position'))];
    const mountGap = this.mounts.map((m) => { let best = Infinity; for (const a of geos) for (let i = 0; i < a.count; i += 1) { const dx = a.getX(i) - m.p.x, dy = a.getY(i) - m.p.y, dz = a.getZ(i) - m.p.z, q = dx * dx + dy * dy + dz * dz; if (q < best) best = q; } return Math.sqrt(best) / L; });
    return {spanX: this.bounds.max.x - this.bounds.min.x, spanZ: this.W, orient: this.orient, engineX: eng.length ? eng.reduce((a, v) => a + v, 0) / eng.length : null, pieces: this.pieces.length, parts: this.partCount, stations: this.stations, explode: this.explode.v, view: this.view, config: this.configName, drawn: on, canopy: this.canopy, hoseLinks: this.links.length, plan: this.plan ? this.plan.map((d) => ({y: d.y, spine: d.spine, corridor: d.corridors.length > 0, guns: d.guns.length, rooms: d.rooms.map((r) => ({type: r.type, area: r.area, value: r.value, c0: r.c0, c1: r.c1, x: r.xs[Math.floor(r.xs.length / 2)], x0: r.xs[0], x1: r.xs[r.xs.length - 1], w: Math.min(...r.b.map((v, i) => v - r.a[i]))}))})) : null, mounts: this.mounts.length, mountX: this.mounts.length ? this.mounts.reduce((a, q) => a + q.p.x, 0) / this.mounts.length : null, mountGap: mountGap.length ? Math.max(...mountGap) : null, worksTris: this.works.reduce((a, w) => a + w.group.children.reduce((b, c) => b + c.geometry.getAttribute('position').count / 3, 0), 0),
      moved: this.pieces.reduce((a, p) => Math.max(a, p.group.position.length()), 0), calls: this.renderer.info.render.calls, tris: this.renderer.info.render.triangles};
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    if (this.abort) this.abort.abort();
    cancelAnimationFrame(this.raf);
    if (this.ro) this.ro.disconnect();
    this.ctrl.removeEventListener('click', this.onClick);
    const decks = this.ctrl.querySelector ? this.ctrl.querySelector('[data-decks]') : null;
    if (decks) { decks.hidden = true; decks.innerHTML = ''; }
    this.canvas.removeEventListener('webglcontextlost', this.onLost);
    this.canvas.removeEventListener('pointerdown', this.onTouch);
    this.canvas.removeEventListener('wheel', this.onTouch);
    if (this.controls) this.controls.dispose();
    if (this.scene) this.scene.traverse((o) => {
      if (o.isInstancedMesh) o.dispose();
      if (o.geometry) o.geometry.dispose();
      const m = o.material;
      if (m) (Array.isArray(m) ? m : [m]).forEach((q) => q.dispose());
    });
    this.owned.forEach((g) => g.dispose());
    if (this.bodyMesh) this.bodyMesh.material.dispose();
    if (this.envRT) this.envRT.dispose();
    if (this.composer) this.composer.dispose();
    if (this.renderer) { this.renderer.dispose(); this.renderer.forceContextLoss(); }
    this.host.innerHTML = '';
    this.host.classList.remove('td');
  }
}

window.ShipTeardown = {
  mount: (host, opts) => new Teardown(host, opts),
  fitOf, groupsOf, GROUPS,
};
