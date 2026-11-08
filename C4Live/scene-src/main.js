// C4 Live galaxy scene. Bundled by build.mjs into C4Live/c4-scene.js (classic script, sets window.C4Scene).
// API (fixed by the lead, consumed by C4Live/app.js):
//   const scene = C4Scene.mount(el, {reducedMotion?, clock?})   clock() -> unix seconds (default: real clock)
//   scene.setData(latest, events) / setFilter({faction, states, owner}) / focusOwner(profile|null) / focusPoint(x, y, zoom?)
//   scene.pulseEvent(event) / on('pick'|'hover'|'systemView', cb) -> unsubscribe / setLayer(name, on) / dispose()
//   LAYERS: systems, fleets, mining, routes, combat, territory, labels
//   ONE CONTINUOUS WORLD (v10, owner 2026-11-08: "It still feels like a transition, I want the star system on the same map,
//   all the way zoomable"): every system is ALWAYS drawn at its map position with its star, orbits, bodies, starbase,
//   stakes and ships (system.js); there is no system view, no enter / exit, no reveal threshold. Zoom is one continuous
//   camera move from the whole galaxy to a single hull, and what is drawn follows on-screen size only.
//   'systemView' event (meaning since v10): {sys, name} when ONE system dominates the view (its extent's diameter is >=
//     DOM_IN of the uncovered map's smaller side and the uncovered map's centre lies inside its extent), null when none
//     does. Hysteresis (DOM_OUT) - it fires once per change of the dominant system and never flaps. It only tells the
//     panels which system the user is looking at; nothing in the scene changes with it.
//   focusSystem(addr|null) -> bool: a smooth fly to a framing of that system (fits its outer orbit + starbase in the
//     uncovered map, re-framed on setInsets / resize / a setData that changes the fit, until the user moves the camera);
//     null flies back out. bodyScreen(addr) -> {x, y, clientX, clientY, visible} | null for ANY body.
//   fleets: fleetScreen(id) -> {x, y, clientX, clientY, visible, covered, inSystem?, shown?}, fleetPixelSize(id) -> px
//     (the projected hull quad length; under HULL_PX.collapse it is neither drawn nor pickable), fleetCell(id)
//   task #53: setDacs({dacs: [{tag, color, members}], example, focus}) -> true; setStatLayer('dacs') draws per-DAC influence
//     halos + columns in the dominant DAC's colour + "TAG · N fleets · M stakes" callouts (+ an EXAMPLE watermark when
//     example); focusDac(tag) -> bool frames the DAC's systems in the uncovered map and clear of the avoid rects (#55);
//     getStats().dacs (+ .lens since #55)
//   task #55: setDacs({..., lens: {on, metrics: ['mining'|'stakes'|'fleets'|'combat'], scope: tag|null}}): lens on paints
//     the DAC CONQUEST map (M.dacConquest): faction tints go neutral, each won system's space takes the winner's colour
//     (alpha ~ strength), contested systems a neutral hatch; the 'dacs' layer then stands one column per won system with
//     one "TAG · conquers N systems" callout per DAC. lens off / missing -> unchanged.
//   task #32: setStatLayer('mining'|'combat'|'fleets'|'owners'|null) -> bool (in-map columns + callouts; callout click =
//     'pick' {type:'system', id, source:'callout'} since #38); setInsets({left, right, top, bottom, avoid?}) -> effective
//     insets + avoid. Insets = CSS px covered by docked UI (they move the framing); avoid = [{left, top, right, bottom}]
//     canvas-relative boxes of floating HUD (no framing change; callouts never overlap them; covered() true inside, #38)
//   extras: scene.screenOf(x, y, h = 0) -> {clientX, clientY, visible, covered}, scene.getStats(), scene.tune({...}), scene.ok
//   test probes (#38, not panel contract): pickAt(clientX, clientY), statColumnScreen(i), labelLayout()
//   Galaxy-level markers (stat columns + callouts, DAC halos, combat heat rings, pulses, tracers) fade out by CAMERA
//   DISTANCE (MARK_NEAR..MARK_FAR, getStats().galaxyFade) - never by a mode. Labels (system names, then bodies and
//   starbases by their on-screen size) are de-collided by priority, keep out of insets + avoid rects, fade on hide.
//   Picking works at every scale by what is under the cursor: fleet (a drawn hull), body, starbase, star / system glyph.
//   Callouts (#44): ranked hierarchy; a callout whose anchor is under the HUD / dock or just off the canvas is placed
//   farther out; hidden only when no spot exists. Task #50: a deep-space callout click emits 'pick' {type:'point', x, y,
//   source:'callout'} AND flies there itself (focusPoint, zoom 3). Territory: constant-px edge, influence falloff inside.
//   Routes: constant px width, faction-tinted. Columns: glow core, base disc, ~400 ms rise on a layer change.
import * as THREE from 'three';
import {MapControls} from 'three/examples/jsm/controls/MapControls.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import * as M from './model.js';
import {createWorld, REL_GLSL, STAR_PX, BODY_PX, SB_PX, RING_PX} from './system.js';

const LAYERS = ['systems', 'fleets', 'mining', 'routes', 'combat', 'territory', 'labels'];
const HOME = {x: 0.5, y: 0.5, dist: 128, polar: 0.72};
const PULSE_KIND = {combat: 0, destroyed: 1, starbaseCombat: 2, captured: 3, newFleet: 4, gone: 5};
const PULSE_R = [3, 6, 4.5, 9, 2.6, 1.6];
const PULSE_COLOR = [[1, 0.55, 0.2], [1, 0.3, 0.15], [1, 0.78, 0.32], null, null, [0.55, 0.66, 0.85]];
const PULSE_POOL = 64, TRACER_POOL = 48, TRACER_MAX_VS = 3;
const FOV = 42;
// v10 camera: the closest zoom puts a MEDIUM hull at MIN_HULL_PX on screen (minDistance follows the canvas height); the
// near plane follows the distance (NEAR_K x camera distance), so nothing clips or z-fights at any scale
const MIN_HULL_PX = 40, NEAR_K = 0.01, FAR = 2500;
// galaxy-level markers fade out by camera distance between MARK_NEAR and MARK_FAR (map units); no idle auto-orbit
// closer than AUTO_MIN_DIST; the system glyph stops growing on screen below GLYPH_D0 (it then hands over to the star)
const MARK_NEAR = 2.5, MARK_FAR = 10, AUTO_MIN_DIST = 20, GLYPH_D0 = 20;
// dominant system (the 'systemView' event): enter at DOM_IN, stay down to DOM_OUT (extent diameter / uncovered map's
// smaller side)
const DOM_IN = 0.35, DOM_OUT = 0.22;

// ---------------------------------------------------------------- GLSL
// One fleet instancing for EVERY fleet (v10): a fleet outside any system draws by the galaxy rule (mode 0: in flight
// from -> to, else its anchor); a fleet at a system (docked, mining, claim-stake transfer, idle) is placed in that system
// (modes 1-3, model.js placeMember is the CPU mirror of place()). Rendered camera-relative (REL_GLSL).
const GL_FLEET_COMMON = REL_GLSL + /* glsl */`
uniform float uNow; uniform float uAnim; uniform float uZoom;
attribute vec4 iA; attribute vec2 iT; attribute vec3 iC; attribute vec4 iM;
attribute vec2 iX; // (ship silhouette atlas cell or -1, size-class scale)
attribute vec4 iO; // member placement: (orbit r, a0, w, mode); mode 0 = outside any system (iA = from, to)
int kindOf() { return int(iM.y + 0.5); }
int modeOf() { return int(iO.w + 0.5); }
bool transit(int k) { return k == 3 || k == 4; }
float fleetProg() {
  int k = kindOf();
  if (!transit(k) || modeOf() != 0) return 1.0;
  float span = iT.y - iT.x;
  if (span <= 0.0) return uNow >= iT.x ? 1.0 : 0.0;
  return clamp((uNow - iT.x) / span, 0.0, 1.0);
}
vec2 fleetPos(float prog) {
  int k = kindOf();
  if (transit(k)) return mix(iA.xy, iA.zw, prog);
  return iA.xy;
}
vec2 cstAt(float t, vec2 b) {
  float ph = 0.5 - 0.5 * cos(t * 6.2831853), side = sin(t * 6.2831853) * 0.18;
  vec2 d = b - iA.zw;
  return iA.zw + d * ph + vec2(-d.y, d.x) * side;
}
// c = a float32-exact map point, loc = world-unit offset from it, hd = heading (0 = none). The SAME maths as placeMember.
void place(out vec2 c, out vec2 loc, out vec2 hd) {
  int mode = modeOf();
  if (mode == 0) { c = fleetPos(fleetProg()); loc = vec2(0.0); hd = iA.zw - iA.xy; return; }
  c = iA.xy;
  if (mode == 1) { loc = iA.zw; hd = iO.xy - iA.zw; return; }
  float a = iO.y + iO.z * uAnim; vec2 b = iO.x * vec2(cos(a), sin(a));
  if (mode == 2) {
    float ang = atan(-b.y, -b.x) + iA.w, amp = iA.z * 0.045;
    loc = b + iA.z * vec2(cos(ang), sin(ang)) + amp * vec2(sin(uAnim * 0.6 + iM.w * 13.0), sin(uAnim * 0.47 + iM.w * 7.0));
    hd = b - loc; return;
  }
  float t = fract(uAnim * 0.04 + iM.w);
  loc = cstAt(t, b); hd = cstAt(t + 0.002, b) - loc;
}
`;

const FLEET_VS = GL_FLEET_COMMON + /* glsl */`
uniform float uSil; uniform float uHasAtlas; uniform float uShipBase;
varying vec2 vP; varying vec3 vCol; varying float vKind; varying float vVis; varying float vSeed; varying float vSil; varying float vCell; varying float vFade;
void main() {
  if (iM.z < 0.001) COLLAPSE
  int k = kindOf(), mode = modeOf();
  vec2 c, loc, hd; place(c, loc, hd);
  bool flying = mode == 0 && transit(k) && fleetProg() < 1.0 && dot(hd, hd) > 1e-16;
  // silhouette LOD (task #22): wrecks keep the X; no atlas or no cell = the glyph
  float sil = (uHasAtlas > 0.5 && iX.x >= 0.0 && k != 5) ? uSil : 0.0;
  // heading: transit along from->to; otherwise, once silhouettes show, the placement's heading when set (nose to the
  // rock / toward the station / along a stake loop) or a seeded angle (idle)
  float sa = iM.w * 6.2831853;
  vec2 dir = flying ? normalize(hd) : (sil > 0.5 ? (dot(hd, hd) > 1e-16 ? normalize(hd) : vec2(cos(sa), sin(sa))) : vec2(0.0, 1.0));
  vec2 side = vec2(dir.y, -dir.x);
  float focus = iM.z > 1.5 ? 1.15 : 1.0;
  // World-proportional hulls (task #22b / #23, owner rule c4-ships-world-scale): a fixed world half-size by flagship
  // class, NO zoom compensation and NO px floor. The glyph fallback (no atlas) is drawn 1.8x (it fills less of the quad).
  float size = uShipBase * iX.y * focus * mix(1.8, 1.0, sil);
  vec3 v = viewOf(relOf(c, loc));
  float px = size * 2.0 * ppuOf(v); // projected hull quad length, px
  if (px < ${M.HULL_PX.collapse.toFixed(2)}) COLLAPSE
  vFade = smoothstep(${M.HULL_PX.collapse.toFixed(2)}, ${M.HULL_PX.full.toFixed(2)}, px); // fades out below HULL_PX.full instead of a floor
  vec2 w = (side * position.x + dir * position.y) * size * 2.0;
  vP = position.xy * 2.0; vCol = iC; vVis = iM.z; vSeed = iM.w; vSil = sil; vCell = iX.x;
  vKind = mode == 2 || mode == 3 ? 4.0 : (mode == 0 && transit(k) && !flying) ? 0.0 : float(k);
  gl_Position = clipOf(viewOf(relOf(c, loc + w)));
}`;

// Owner 2026-11-08 (refines c4-ships-world-scale): at true scale a hull needs about 47 wheel notches to appear, so every
// fleet is also a small faction dot of fixed screen size, handing over to its real hull as the hull grows. Same placement
// code as FLEET_VS, so a dot is always exactly where its hull is. Dots are not pickable: the overview picks systems.
const DOT_PX = 3.2, DOT_GONE_PX = [1.5, 4.0];
const DOT_VS = GL_FLEET_COMMON + /* glsl */`
uniform float uSil; uniform float uHasAtlas; uniform float uShipBase;
varying vec2 vP; varying vec3 vCol; varying float vA;
void main() {
  if (iM.z < 0.001) COLLAPSE
  int k = kindOf();
  vec2 c, loc, hd; place(c, loc, hd);
  float sil = (uHasAtlas > 0.5 && iX.x >= 0.0 && k != 5) ? uSil : 0.0;
  float size = uShipBase * iX.y * (iM.z > 1.5 ? 1.15 : 1.0) * mix(1.8, 1.0, sil);
  float ppu = ppuOf(viewOf(relOf(c, loc)));
  vA = min(iM.z, 1.0) * (1.0 - smoothstep(${DOT_GONE_PX[0].toFixed(2)}, ${DOT_GONE_PX[1].toFixed(2)}, size * 2.0 * ppu));
  if (vA < 0.004) COLLAPSE
  vP = position.xy * 2.0; vCol = iC;
  gl_Position = clipOf(viewOf(relOf(c, loc + position.xy * ${DOT_PX.toFixed(2)} / ppu)));
}`;
const DOT_FS = /* glsl */`
varying vec2 vP; varying vec3 vCol; varying float vA;
void main() {
  float a = smoothstep(1.0, 0.7, length(vP)) * vA;
  gl_FragColor = vec4(vCol * 0.8 * a, a);   // under 1.0 so the bloom pass keeps the faction hue on such a small mark
}`;

const FLEET_FS = /* glsl */`
uniform float uAnim; uniform sampler2D uAtlas; uniform float uCols; uniform float uRows;
varying vec2 vP; varying vec3 vCol; varying float vKind; varying float vVis; varying float vSeed; varying float vSil; varying float vCell; varying float vFade;
void main() {
  vec2 p = vP; float r = length(p); int k = int(vKind + 0.5);
  float d; float gain = 1.0; vec3 col = vCol; float hot = 0.0;
  if (k == 3 || k == 4) {
    vec2 q = vec2(abs(p.x), p.y);
    d = max((p.y - (0.6 - 2.5 * q.x)) / 2.69, ((-0.2 - 0.595 * q.x) - p.y) / 1.16);
    hot = 0.45; gain = 1.25;
  } else if (k == 1) { d = r - 0.22; gain = 0.32; }
  else if (k == 2) { d = r - 0.28; hot = 0.2; }
  else if (k == 5) {
    d = max(min(abs(p.x - p.y), abs(p.x + p.y)) * 0.7071 - 0.06, r - 0.42);
    col = mix(col, vec3(0.75, 0.22, 0.16), 0.65); gain = 0.5;
  } else if (k == 6) { d = abs(r - 0.33) - 0.05; gain = 0.55 + 0.45 * step(0.5, fract(uAnim * 0.8 + vSeed)); }
  else { d = (abs(p.x) + abs(p.y) - 0.34) * 0.7071; gain = 0.7; }
  float fill = smoothstep(0.035, -0.035, d);
  float halo = exp(-max(d, 0.0) * 11.0) * 0.16;
  vec3 c = col * (fill * 1.05 + halo) * gain + vec3(1.0) * fill * hot;
  if (k == 2) {
    float t = fract(uAnim * 0.45 + vSeed);
    c += col * smoothstep(0.06, 0.0, abs(r - (0.3 + t * 0.62))) * (1.0 - t) * 0.9;
  }
  float alpha = fill * 0.92;
  if (vSil > 0.001) {
    // the flagship's top-down render: cell vCell of the atlas, nose = +y of this quad = the heading; white hull with
    // baked shading, tinted by faction (multiply, a little white kept so the rim light survives)
    vec2 uv = clamp(p * 0.5 + 0.5, 0.0, 1.0);
    // round first: an interpolated 48.0 can arrive as 47.9999 (speckled hulls on cell multiples of 8 - seen on gen-small)
    float cell = floor(vCell + 0.5);
    float cx = mod(cell, uCols), cy = floor(cell / uCols);
    vec4 t = texture2D(uAtlas, vec2((cx + uv.x) / uCols, 1.0 - (cy + 1.0 - uv.y) / uRows));
    vec3 sc = t.rgb * mix(vCol, vec3(1.0), 0.22) * 1.3 * t.a;
    c = mix(c, sc, vSil); alpha = mix(alpha, t.a * 0.95, vSil);
    fill = mix(fill, t.a, vSil);
  }
  if (vVis > 1.5) {
    float ring = smoothstep(0.03, 0.0, abs(r - 0.62)) * (0.55 + 0.45 * sin(uAnim * 4.0));
    c += vec3(0.85, 1.0, 1.0) * ring * 0.55 + col * fill * 0.3;
  }
  float v = min(vVis, 1.0) * smoothstep(1.0, 0.82, r);
  // premultiplied 'over': the body (alpha = fill) occludes what is under it, the halo and rings (alpha 0) add light.
  gl_FragColor = vec4(c * v, alpha * v) * vFade;
}`;

// Transit trails (task #51): world-scale like the hulls - length and width in HULL LENGTHS of the fleet's size class
// (M.TRAIL). A trail draws only where its hull draws (the same px formula and HULL_PX band). Filtered-out fleets (VIS_DIM)
// draw no trail. Only fleets outside any system (mode 0) travel.
const TRAIL_VS = GL_FLEET_COMMON + /* glsl */`
uniform float uSil; uniform float uHasAtlas; uniform float uShipBase;
varying float vU; varying float vX; varying vec3 vCol; varying float vA; varying float vWarp;
void main() {
  int k = kindOf();
  float fade = 1.0 - smoothstep(0.0, ${M.TRAIL.fadeS.toFixed(1)}, uNow - iT.y);
  if (modeOf() != 0 || !transit(k) || iM.z < 0.5 || fade <= 0.0 || uNow < iT.x) COLLAPSE
  float prog = fleetProg();
  vec2 p = fleetPos(prog); vec2 d = iA.zw - iA.xy; float L = length(d);
  if (L < 1e-6) COLLAPSE
  float sil = (uHasAtlas > 0.5 && iX.x >= 0.0) ? uSil : 0.0;
  float size = uShipBase * iX.y * (iM.z > 1.5 ? 1.15 : 1.0) * mix(1.8, 1.0, sil);
  vec3 vc = viewOf(relOf(p, vec2(0.0)));
  float ppu = ppuOf(vc), px = size * 2.0 * ppu;
  if (px < ${M.HULL_PX.collapse.toFixed(2)}) COLLAPSE
  float hl = uShipBase * iX.y * 1.84; // HULL_LEN of the class (sizeScale = HULL_LEN / 2 / 0.92)
  vec2 dir = d / L;
  float tl = min(L * prog, min(${M.TRAIL.max.toFixed(5)}, hl * (k == 3 ? ${M.TRAIL.warp.toFixed(1)} : ${M.TRAIL.subwarp.toFixed(1)}))) * fade; // retracts as it fades after arrival
  if (tl < 1e-7) COLLAPSE
  vec2 side = vec2(dir.y, -dir.x);
  float u = position.y + 0.5;
  // width in world units off the hull; floored at 1 CSS px (thinner would shimmer) with the alpha scaled down to match
  float wdt = hl * (k == 3 ? ${M.TRAIL.wWarp.toFixed(2)} : ${M.TRAIL.wSubwarp.toFixed(2)});
  float wd = max(wdt, 1.0 / ppu);
  vU = u; vX = position.x * 2.0; vCol = iC; vWarp = k == 3 ? 1.0 : 0.0;
  vA = fade * min(iM.z, 1.0) * (wdt / wd) * smoothstep(${M.HULL_PX.collapse.toFixed(2)}, ${M.HULL_PX.full.toFixed(2)}, px);
  gl_Position = clipOf(viewOf(relOf(p, mix(-dir * tl, vec2(0.0), u) + side * position.x * wd)));
}`;
const TRAIL_FS = /* glsl */`
uniform float uAnim;
varying float vU; varying float vX; varying vec3 vCol; varying float vA; varying float vWarp;
void main() {
  float a = pow(clamp(vU, 0.0, 1.0), 1.7) * (1.0 - vX * vX);
  vec3 col = mix(vCol, vec3(0.65, 0.95, 1.0), vWarp * 0.6);
  float shimmer = 0.82 + 0.18 * sin(vU * 46.0 - uAnim * 18.0);
  gl_FragColor = vec4(col * a * vA * shimmer * 1.3, 1.0);
}`;

// Routes (task #50): a CONSTANT on-screen width (ROUTE_PX CSS px quad: a ~1.3 px core + a faint halo) at every zoom.
// Tinted by the fleet's faction with a touch of cool neutral, low alpha; a soft travelling flow.
const ROUTE_PX = 4.0;
const ROUTE_VS = GL_FLEET_COMMON + /* glsl */`
varying float vU; varying float vX; varying vec3 vCol; varying float vLen; varying float vA;
void main() {
  int k = kindOf();
  if (modeOf() != 0 || !transit(k) || iM.z < 0.001) COLLAPSE
  float prog = fleetProg();
  if (prog >= 1.0) COLLAPSE
  vec2 p = fleetPos(prog); vec2 d = iA.zw - p; float L = length(d);
  if (L < 1e-5) COLLAPSE
  vec2 dir = d / L; vec2 side = vec2(dir.y, -dir.x);
  float u = position.y + 0.5;
  vec2 c = mix(p, iA.zw, u);
  // world units per CSS px at this point's depth: the quad is ROUTE_PX px wide wherever it is
  float upx = 1.0 / ppuOf(viewOf(relOf(c, vec2(0.0))));
  vU = u; vX = position.x * 2.0; vCol = iC; vLen = L; vA = min(iM.z, 1.0);
  gl_Position = clipOf(viewOf(relOf(c, side * position.x * ${ROUTE_PX.toFixed(1)} * upx)));
}`;
const ROUTE_FS = /* glsl */`
uniform float uAnim;
varying float vU; varying float vX; varying vec3 vCol; varying float vLen; varying float vA;
void main() {
  float xp = vX * ${(ROUTE_PX / 2).toFixed(1)};                 // CSS px from the centre line
  float prof = exp(-xp * xp * 2.0) + exp(-xp * xp * 0.6) * 0.12;  // crisp ~1.2 px core + faint halo
  float f = fract(vU * vLen / 1.6 - uAnim * 0.35);
  float flow = 0.55 + 0.45 * smoothstep(0.0, 0.45, f) * smoothstep(1.0, 0.55, f); // soft travelling pulses, no hard dashes
  float a = prof * flow * (0.3 + 0.45 * vU) * vA;
  gl_FragColor = vec4(mix(vCol, vec3(0.55, 0.7, 0.85), 0.15) * a * 0.42, 1.0);
}`;

// Mining beams (v10: every system's miners, at most MINER.beamCap per system - placement iT.y = 1): rock surface ->
// ship nose, world-scale (width 0.12 hull lengths), drawn only where the hull is (the HULL_PX band)
const BEAM_VS = GL_FLEET_COMMON + /* glsl */`
uniform float uShipBase;
varying float vU; varying float vX; varying vec3 vCol; varying float vLen; varying float vSeed; varying float vA;
void main() {
  if (modeOf() != 2 || iT.y < 0.5 || iM.z < 0.001) COLLAPSE
  vec2 c, loc, hd; place(c, loc, hd);
  float a = iO.y + iO.z * uAnim; vec2 b = iO.x * vec2(cos(a), sin(a));
  vec2 d = b - loc; float L = length(d);
  if (L < 1e-9) COLLAPSE
  vec2 dir = d / L, side = vec2(dir.y, -dir.x);
  float hz = uShipBase * iX.y;
  float px = hz * 2.0 * ppuOf(viewOf(relOf(c, loc)));
  if (px < ${M.HULL_PX.collapse.toFixed(2)}) COLLAPSE
  vec2 e0 = b - dir * iT.x * 0.92, e1 = loc + dir * hz * 0.9; // rock surface (u 0) -> ship nose (u 1)
  float u = position.y + 0.5;
  vU = u; vX = position.x * 2.0; vCol = iC; vLen = length(e1 - e0) / (hz * 2.0) * 0.3; vSeed = iM.w;
  vA = min(iM.z, 1.0) * smoothstep(${M.HULL_PX.collapse.toFixed(2)}, ${M.HULL_PX.full.toFixed(2)}, px);
  gl_Position = clipOf(viewOf(relOf(c, mix(e0, e1, u) + side * position.x * hz * 0.24)));
}`;
const BEAM_FS = /* glsl */`
uniform float uAnim; uniform float uBeamGain;
varying float vU; varying float vX; varying vec3 vCol; varying float vLen; varying float vSeed; varying float vA;
void main() {
  float f = fract(vU * vLen * 1.6 - uAnim * 1.4 + vSeed * 7.0);
  float bead = smoothstep(0.22, 0.0, abs(f - 0.5));
  float a = (0.22 + bead * 0.95) * (1.0 - vX * vX) * smoothstep(0.0, 0.2, vU) * vA;
  gl_FragColor = vec4(mix(vec3(1.0, 0.84, 0.42), vCol, 0.35) * a * 0.42 * uBeamGain, 1.0);
}`;

// The system glyph = the star seen from afar (v10). Its quad keeps today's world size (systemSize x uSysZoom) while the
// camera is far, stops growing on screen below GLYPH_D0 (uGlyphK = min(1, dist / GLYPH_D0)), and hands over to the star
// itself (system.js) across STAR_PX of the star's own disc radius in px - the same band the star sprite fades in by, so
// the two cross-fade continuously. iM = (vis, seed, column flag, star disc radius world).
const SYS_VS = REL_GLSL + /* glsl */`
uniform float uSysZoom; uniform float uGlyphK;
attribute vec4 iS; attribute vec3 iC; attribute vec4 iM;
varying vec2 vP; varying vec3 vCol; varying float vLvl; varying float vVis; varying float vSeed; varying float vCo;
void main() {
  vec3 v = viewOf(relOf(iS.xy, vec2(0.0)));
  float ppu = ppuOf(v);
  float vis = iM.x * (1.0 - lodS(${STAR_PX[0].toFixed(2)}, ${STAR_PX[1].toFixed(2)}, iM.w * ppu));
  if (vis < 0.001) COLLAPSE
  float s = iS.z * uSysZoom * uGlyphK;
  vP = position.xy * 2.0; vCol = iC; vLvl = iS.w; vVis = vis; vSeed = iM.y; vCo = iM.z;
  gl_Position = clipOf(v + vec3(position.xy * s * 2.0, 0.0));
}`;
const SYS_FS = /* glsl */`
uniform float uAnim; uniform float uDim; uniform float uSysCover;
varying vec2 vP; varying vec3 vCol; varying float vLvl; varying float vVis; varying float vSeed; varying float vCo;
void main() {
  // task #55 (owner 2026-11-07: "I feel we dont need them"): NO starbase rings. The level reads only as a slight size +
  // brightness step of the star core and glow: the quad is systemSize(lvl) = 1.1 + 0.42 lvl wide, so r is rescaled to a
  // visible star of 1.1 x (1 + 0.08 lvl) - lvl 5 draws 1.4x a lvl 0 star - and the core brightens 5 % per level.
  float lv = clamp(vLvl, 0.0, 6.0);
  float r = length(vP) * (1.1 + lv * 0.42) / (1.1 * (1.0 + 0.08 * lv)); float r2 = r * r;
  float twinkle = 0.86 + 0.14 * sin(uAnim * 1.7 + vSeed * 40.0);
  float core = exp(-r2 * 160.0) * 1.15 * (1.0 + 0.05 * lv);
  // the house-coloured glow (0.42, task #58: USTUR drifted to 73 % at 0.3)
  float glow = exp(-r2 * 22.0) * 0.42 * (1.0 + 0.06 * lv) + exp(-r * 7.0) * 0.03;
  vec3 c = mix(vec3(1.0), vCol, smoothstep(0.0, 0.035, r)) * core + vCol * glow;
  float k = min(vVis, 1.0) * uDim * smoothstep(1.0, 0.86, r);
  c *= twinkle * k;
  // premultiplied: the halo partly covers the blue-violet nebula under it (bloom hue check, task #18)
  gl_FragColor = vec4(c, clamp(exp(-r2 * 18.0) * uSysCover, 0.0, 1.0) * k);
}`;

// (task #55, owner 2026-11-07 16:28 EST "the bars show miners any way, we can remove the rings": the galaxy MINING
// INDICATOR rings - dashed arcs, glow band, ping, neighbour cap - are gone; the mining stat columns show mining.)

// In-map STAT columns (task #32, setStatLayer): holographic light columns rising from the plane, one per entry of
// model.js statColumns. A cylindrical billboard (vertical axis = world up, facing the camera around it). Height = iS.z x
// uStatH, width iS.w x uStatW. Scanlines drift upward, a bright cap marks the value, an edge rim sells the "glass".
// Task #38 (owner 2026-11-07 "thinner and come up from exactly the system"): the base sits on the system glyph's plane
// (the map plane, y 0 since v10) and the width is ~0.35 of v2's (STAT_W 0.3 vs 0.85). They are galaxy markers: faded by
// camera distance (uFade = galaxyFade).
const STAT_BASE_Y = 0, STAT_W = 0.3, STAT_GLOW = 2.2, STAT_MIN_PX = 8, STAT_GROW_MS = 400;
const TERR_STAT_DIM = 0.5, CALLOUT_POINT_ZOOM = 3; // territory strength while a stat layer stands; deep-space callout fly zoom (camera 128 / 3)
const STATCOL_VS = /* glsl */`
uniform float uStatH; uniform float uStatW; uniform float uGrow; uniform float uMinH;
attribute vec4 iS; attribute vec3 iC; attribute vec4 iM;
varying vec2 vQ; varying vec3 vCol; varying float vVis; varying float vSeed; varying float vH; varying float vHot;
void main() {
  if (iM.x < 0.001 || iS.z <= 0.0 || uGrow <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec3 r = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 right = normalize(vec3(r.x, 0.0, r.z) + vec3(1e-5, 0.0, 0.0));
  // task #50: a minimum on-screen height (uMinH = STAT_MIN_PX in world units at this zoom) and a ~400 ms rise on a
  // layer change (uGrow 0 -> 1). The SAME formula is in statTopH() (callouts, statColumnScreen).
  float h = max(iS.z * uStatH, uMinH) * uGrow, wd = iS.w * uStatW;
  vec3 base = vec3(iS.x, ${STAT_BASE_Y.toFixed(2)}, -iS.y); // the system glyph's own plane: the column rises from its centre
  // the quad is STAT_GLOW x the body width: the body stays thin (owner), the extra is a soft glow either side
  vec3 w = base + right * position.x * wd * ${STAT_GLOW.toFixed(1)} + vec3(0.0, 1.0, 0.0) * (position.y + 0.5) * h;
  vQ = vec2(position.x * 2.0 * ${STAT_GLOW.toFixed(1)}, position.y + 0.5); vCol = iC; vVis = iM.x; vSeed = iM.y; vH = h; vHot = iM.w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`;
// x = 1 at the body's edge. v4 had a 13 Hz flicker on hot columns and hard 2-step scan bands: at 3-4 px wide they
// read as glitchy needles (task #50). Now: a glow core, a soft halo, a slow rising sheen, no flicker.
const STATCOL_FS = /* glsl */`
uniform float uAnim;
varying vec2 vQ; varying vec3 vCol; varying float vVis; varying float vSeed; varying float vH; varying float vHot;
void main() {
  float x = abs(vQ.x), y = vQ.y;
  float core = exp(-x * x * 3.0) * 0.55 + exp(-x * x * 40.0) * 0.45;   // body + bright filament (v4 energy: bloom must not light the rings)
  float halo = exp(-x * x * 0.6) * 0.12;                                 // soft glow outside the body
  float sweep = exp(-pow((fract(uAnim * 0.12 + vSeed) - y) * 6.0, 2.0)) * 0.35;
  float cap = smoothstep(0.04, 0.0, abs(y - 0.985)) * 1.4;
  float fade = mix(1.0, 0.45, y) * smoothstep(1.0, 0.97, y);
  vec3 c = vCol * ((core + halo) * (fade + sweep) + cap * core * 0.6) + vec3(1.0) * cap * exp(-x * x * 8.0) * 0.2;
  c *= min(vVis, 1.0) * smoothstep(${STAT_GLOW.toFixed(1)}, ${(STAT_GLOW * 0.7).toFixed(2)}, x) * (vHot > 0.5 ? 1.1 : 1.0);
  gl_FragColor = vec4(c, 1.0);
}`;
// base disc (task #50): a small flat dot of the column's body width on the glyph plane, so a column stands on something
const STATDISC_VS = /* glsl */`
uniform float uStatW; uniform float uGrow; uniform float uViewH;
attribute vec4 iS; attribute vec3 iC; attribute vec4 iM;
varying vec2 vQ; varying vec3 vCol; varying float vVis;
void main() {
  if (iM.x < 0.001 || iS.z <= 0.0 || uGrow <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  // quad 1.6 x the body width; the dot ~1.2 x the body width (r 0.73 in vQ = 0.365 wd), so it shows below the column at any
  // zoom. v11: a galaxy MARKER (not a world object), so the dot keeps >= 3 px radius - a far column's dot (~1 px) hid
  // under its own column foot (#50 base disc: 4 of 12 columns had no light below the base point)
  vec4 vc = viewMatrix * vec4(iS.x, ${STAT_BASE_Y.toFixed(2)} - 0.001, -iS.y, 1.0);
  float ppu = projectionMatrix[1][1] * 0.5 * uViewH / max(-vc.z, 1e-6);
  float wd = max(iS.w * uStatW * 1.6, 3.0 / (0.365 * ppu));
  vec3 w = vec3(iS.x + position.x * wd, ${STAT_BASE_Y.toFixed(2)} - 0.001, -(iS.y + position.y * wd));
  vQ = position.xy * 2.0; vCol = iC; vVis = iM.x * min(1.0, uGrow * 2.0);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`;
const STATDISC_FS = /* glsl */`
varying vec2 vQ; varying vec3 vCol; varying float vVis;
void main() {
  float r = length(vQ);
  float d = smoothstep(0.8, 0.66, r) * 0.45;  // a solid dot ~1.2 x the body width, no halo (it must not light the starbase rings - #44)
  gl_FragColor = vec4(vCol * d * min(vVis, 1.0), 1.0);
}`;
// (task #38, owner 2026-11-07: no footprint ring or ticks under a column - "to reduce clutter"; STATBASE removed)

// DAC influence halos (task #53, setStatLayer('dacs') + setDacs): one flat soft glow per (system, DAC) on the plane just
// under the system glyphs, centred on the system itself. Radius DAC_R0 + DAC_R1 x sqrt(weight / max weight) world units,
// strength = that DAC's share of the system's DAC presence (shared systems blend additively), dimmed for a non-focused
// DAC. A soft core and a faint static rim; no rotation, no animation.
// The radius grows with the camera distance (uHaloK = clamp(dist / 40, 1, 3.2)): at home a member system's glow is a
// region (12-28 px radius) and neighbouring member systems merge into a DAC's area; up close it stays ~0.4-1 unit.
const DAC_R0 = 0.42, DAC_R1 = 0.55, DAC_DIM = 0.12, DAC_GAIN = 0.32, DAC_TERR_DIM = 0.28;
const DAC_POLAR = 0.62, DAC_FIT_PX = 40, DAC_MIN_DIST = 16, DAC_AVOID_PX = 12; // focusDac: camera tilt, margin inside the uncovered map, closest framing
const DACHALO_VS = /* glsl */`
uniform float uHaloK;
attribute vec4 iS; attribute vec3 iC; attribute vec4 iM;
varying vec2 vQ; varying vec3 vCol; varying float vA;
void main() {
  if (iM.x < 0.001) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float r = iS.z * uHaloK;
  vec3 w = vec3(iS.x + position.x * r * 2.0, 0.0, -(iS.y + position.y * r * 2.0));
  vQ = position.xy * 2.0; vCol = iC; vA = iM.x;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`;
const DACHALO_FS = /* glsl */`
varying vec2 vQ; varying vec3 vCol; varying float vA;
void main() {
  float q = length(vQ);
  float core = exp(-q * q * 3.2) * 0.8 + 0.2 * smoothstep(1.0, 0.55, q);
  float rim = exp(-pow((q - 0.86) * 16.0, 2.0)) * 0.35;
  gl_FragColor = vec4(vCol * (core + rim) * smoothstep(1.0, 0.92, q) * vA * ${DAC_GAIN.toFixed(2)}, 1.0);
}`;
// DAC CONQUEST lens (task #55, setDacs({lens: {on, metrics, scope}})): faction colours go neutral, the faction territory
// is off, and each DAC's conquered space is painted in its colour. Task #58 (owner 2026-11-07 18:15 EST "soft territory,
// not discs"): drawn exactly like the faction territory (TERR_FS) from the conquestTexture field - the border is the
// m = 0.16 iso-line measured in SCREEN px (a ~1.5 px crisp line at every zoom), the fill is densest just inside it and
// thins toward the core, with the faint hex lattice; where two DACs meet a constant-px seam (m = second); the fill level
// follows the field-weighted strength. Contested space: no border, no fill - a faint neutral diagonal hatch whose
// strength fades with the field (a soft patch, never a disc). Off -> the plane is hidden, so lens off draws today's pixels.
const CONQ_NEUTRAL = '#8a94a6';
const CONQ_FS = /* glsl */`
uniform sampler2D uConq; uniform sampler2D uConqX; uniform float uConqFill; uniform float uConqDim;
varying vec2 vUv; varying vec2 vW;
void main() {
  vec4 q = texture2D(uConq, vUv);
  vec3 xq = texture2D(uConqX, vUv).rgb;
  float m = q.a, x = xq.r, mid = xq.g, str = xq.b;
  vec3 col = pow(max(q.rgb, vec3(0.0)), vec3(2.2));
  col *= clamp(0.42 / max(dot(col, vec3(0.2126, 0.7152, 0.0722)), 1e-3), 0.45, 1.8); // equal brightness per DAC colour (like TERR_GAIN)
  float own = 1.0 - x;                                          // 1 = a DAC's space, 0 = contested
  float fwm = max(fwidth(m), 1e-5);
  float dpx = (m - 0.16) / fwm;                                 // signed screen px from the border, > 0 inside
  float inside = smoothstep(-0.8, 0.8, dpx);
  float rim = (exp(-dpx * dpx * 0.7) * 0.4 + exp(-abs(dpx) * 0.4) * 0.04) * own;
  vec2 hp = vW / 1.4;
  vec2 hs = vec2(1.0, 1.7320508), ha = mod(hp, hs) - hs * 0.5, hb = mod(hp - hs * 0.5, hs) - hs * 0.5;
  vec2 hg = abs(dot(ha, ha) < dot(hb, hb) ? ha : hb);
  float he = 0.5 - max(dot(hg, vec2(0.5, 0.8660254)), hg.x);
  float hfw = fwidth(hp.x);
  float hex = (1.0 - smoothstep(0.0, hfw * 1.5, he)) * smoothstep(0.09, 0.04, hfw);
  float infl = inside * (0.55 + 0.45 * (1.0 - smoothstep(0.16, 0.6, m)));
  float fill = infl * uConqFill * (0.5 + 0.5 * str) * (1.0 + hex * 0.7) * own;
  float dfm = (m - mid) / max(fwidth(m - mid), 1e-5);           // the seam between two channels, constant px
  float front = exp(-dfm * dfm * 0.7) * smoothstep(0.08, 0.3, mid) * inside;
  // contested: a faint neutral hatch, no edge - its weight follows the field smoothly (soft patch)
  float hh = (vW.x + vW.y) / 1.8;
  float hhw = fwidth(hh);
  float hatch = (1.0 - smoothstep(hhw * 0.6, hhw * 1.6, abs(fract(hh + 0.5) - 0.5))) * smoothstep(0.35, 0.15, hhw); // thin constant-px lines
  float soft = smoothstep(0.06, 0.5, m) * x;
  vec3 neutral = vec3(0.26, 0.29, 0.37);
  vec3 c = col * (fill + rim) + mix(col, neutral, x) * front * 0.45 + neutral * hatch * 0.22 * soft;
  gl_FragColor = vec4(c, inside * smoothstep(0.16, 0.5, m) * own * uConqDim * (0.55 + 0.45 * str));
}`;

const FLAT = /* glsl */`#define COLLAPSE { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
`;
const HOT_VS = FLAT + /* glsl */`
uniform float uZoom;
attribute vec4 iS; attribute vec4 iM;
varying vec2 vP; varying vec4 vM; varying float vHeat;
void main() {
  if (iM.w < 0.001) COLLAPSE
  vec2 w = iS.xy + position.xy * iS.z * 2.0 * clamp(uZoom, 0.6, 1.3);
  vP = position.xy * 2.0; vM = iM; vHeat = iS.w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w.x, 0.0, -w.y, 1.0);
}`;
const HOT_FS = /* glsl */`
uniform float uAnim;
varying vec2 vP; varying vec4 vM; varying float vHeat;
void main() {
  float r = length(vP); float ang = atan(vP.y, vP.x + 1e-5);
  float throb = 0.72 + 0.28 * sin(uAnim * 3.0 + vM.y * 20.0);
  float h = clamp(vHeat, 0.15, 1.6);
  vec3 hotc = mix(vec3(1.0, 0.36, 0.1), vec3(1.0, 0.12, 0.08), vM.x);
  vec3 c = mix(hotc, vec3(1.0, 0.9, 0.6), exp(-r * r * 60.0)) * (exp(-r * r * 12.0) * 0.3 * h * throb + exp(-r * r * 90.0) * 0.4);
  float seg = step(0.55, fract(ang * 0.6366 + uAnim * 0.06));
  c += hotc * smoothstep(0.015, 0.0, abs(r - 0.6)) * seg * (0.15 + 0.4 * vM.z);
  c *= min(vM.w, 1.0) * smoothstep(1.0, 0.88, r);
  gl_FragColor = vec4(c, 1.0);
}`;

const PULSE_VS = FLAT + /* glsl */`
uniform float uTime;
attribute vec4 iS; attribute vec3 iC; attribute float iK;
varying vec2 vP; varying vec3 vCol; varying float vT; varying float vK;
void main() {
  float dur = iK > 0.5 && iK < 1.5 ? 3.2 : iK > 4.5 ? 1.8 : 2.4;
  float age = uTime - iS.w;
  if (age < 0.0 || age > dur) COLLAPSE
  vec2 w = iS.xy + position.xy * iS.z * 2.3;
  vP = position.xy * 2.3; vCol = iC; vT = age / dur; vK = iK;
  gl_Position = projectionMatrix * viewMatrix * vec4(w.x, 0.0, -w.y, 1.0);
}`;
const PULSE_FS = /* glsl */`
uniform float uReduced;
varying vec2 vP; varying vec3 vCol; varying float vT; varying float vK;
void main() {
  float r = length(vP); float t = vT; float e = 1.0 - pow(clamp(1.0 - t, 0.0, 1.0), 3.0);
  float rr = uReduced > 0.5 ? 0.6 : (vK > 3.5 ? 1.0 - e : e);
  float w = 0.04 + 0.06 * t;
  float ring = smoothstep(w, 0.0, abs(r - rr)) * (1.0 - t);
  float ring2 = 0.0;
  if (vK > 0.5 && vK < 3.5) {
    float t2 = clamp((t - 0.16) / 0.84, 0.0, 1.0);
    float rr2 = uReduced > 0.5 ? 0.35 : (1.0 - pow(1.0 - t2, 3.0)) * 0.72;
    ring2 = smoothstep(0.035, 0.0, abs(r - rr2)) * (1.0 - t2) * step(0.001, t2) * 0.7;
  }
  float flash = exp(-r * r * 26.0) * exp(-t * 7.0) * 2.6;
  float sparks = 0.0;
  if (vK > 0.5 && vK < 1.5) {
    float ang = atan(vP.y, vP.x + 1e-5);
    sparks = pow(max(0.0, sin(ang * 13.0 + 1.7)), 24.0) * smoothstep(rr + 0.02, rr - 0.25, r) * step(0.05, r) * (1.0 - t) * 1.3;
  }
  vec3 c = vCol * (ring * 1.6 + ring2 + sparks) + mix(vCol, vec3(1.0), 0.6) * flash;
  if (vK > 4.5) {
    // gone (an NPC closed on death): no shockwave - a cool, flickering glow that fades and shrinks to nothing
    float flick = uReduced > 0.5 ? 1.0 : 0.65 + 0.35 * step(0.5, fract(t * 11.0));
    float rad = mix(0.55, 0.08, uReduced > 0.5 ? 0.5 : e);
    c = vCol * (exp(-r * r / (rad * rad) * 2.0) * 1.1 * flick + smoothstep(0.03, 0.0, abs(r - rad)) * 0.5) * (1.0 - t);
  }
  gl_FragColor = vec4(c * smoothstep(1.15, 1.0, r), 1.0);
}`;

// Combat tracers: bolts fly both ways between the two fleets of a combat pair, coloured by each side's faction.
const TRACER_VS = /* glsl */`
uniform float uTime; uniform float uZoom;
attribute vec4 iE; attribute vec3 iC; attribute vec3 iC2; attribute vec2 iS;
varying float vU; varying float vX; varying vec3 vA; varying vec3 vB; varying float vT; varying float vSeed; varying float vLen;
void main() {
  float age = uTime - iS.x;
  if (age < 0.0 || age > 1.8) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec2 a = iE.xy; vec2 b = iE.zw; vec2 d = b - a; float L = length(d);
  if (L < 1e-4) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec2 dir = d / L; vec2 side = vec2(dir.y, -dir.x);
  float u = position.y + 0.5;
  vec2 w = mix(a - dir * 0.15, b + dir * 0.15, u) + side * position.x * 0.22 * clamp(uZoom, 0.6, 1.4);
  vU = u; vX = position.x * 2.0; vA = iC; vB = iC2; vT = age / 1.8; vSeed = iS.y; vLen = L + 0.3;
  gl_Position = projectionMatrix * viewMatrix * vec4(w.x, 0.0, -w.y, 1.0);
}`;
const TRACER_FS = /* glsl */`
uniform float uReduced;
varying float vU; varying float vX; varying vec3 vA; varying vec3 vB; varying float vT; varying float vSeed; varying float vLen;
void main() {
  float core = 1.0 - vX * vX;
  float fade = 1.0 - vT;
  float bl = 0.35 / vLen; // bolt length in u
  float c1 = 0.0, c2 = 0.0;
  if (uReduced < 0.5) {
    for (int i = 0; i < 3; i++) {
      float ph = fract(vT * 2.6 + float(i) / 3.0 + vSeed);
      c1 += smoothstep(bl, 0.0, abs(vU - ph)) * step(vU, ph);
      float ph2 = 1.0 - fract(vT * 2.3 + float(i) / 3.0 + vSeed * 1.7);
      c2 += smoothstep(bl, 0.0, abs(vU - ph2)) * step(ph2, vU);
    }
  }
  vec3 beam = mix(vA, vB, vU) * 0.12 * (uReduced > 0.5 ? 2.5 : 1.0);
  vec3 c = (mix(vA, vec3(1.0), 0.35) * c1 + mix(vB, vec3(1.0), 0.35) * c2) * 1.4 + beam;
  gl_FragColor = vec4(c * core * fade, 1.0);
}`;

const TERR_VS = /* glsl */`
varying vec2 vUv; varying vec2 vW;
void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = vec2(w.x, -w.z); gl_Position = projectionMatrix * viewMatrix * w; }`;
const TERR_FS = /* glsl */`
uniform sampler2D uTex; uniform float uTerr; uniform float uTerrStat; uniform float uTerrLens; uniform float uTerrDim; uniform float uTerrFill; uniform float uAnim; uniform vec3 uFa0; uniform vec3 uFa1; uniform vec3 uFa2; uniform vec3 uFaW;
varying vec2 vUv; varying vec2 vW;
void main() {
  // Territory geometry (fill, rim, contested front, coverage) comes from the RAW weights; the faction filter is applied
  // afterwards as a strength. Scaling the weights themselves by uFaW (the pre-#14 code) pushed a filtered faction's
  // interior to m ~ 0.15, which sits inside the rim band (m ~ 0.16), so the whole region lit up as a bright blob.
  vec3 w = texture2D(uTex, vUv).rgb;
  float m = max(w.r, max(w.g, w.b));
  float mid = w.r + w.g + w.b - m - min(w.r, min(w.g, w.b));
  vec3 col = (uFa0 * w.r * w.r + uFa1 * w.g * w.g + uFa2 * w.b * w.b) / max(dot(w, w), 1e-4);
  vec3 vis = clamp((uFaW - 0.15) / 0.85, 0.0, 1.0);       // 1 = shown, 0 = filtered out (uFaW is 1 or 0.15)
  float share = dot(w, vis) / max(w.r + w.g + w.b, 1e-4); // how much of this pixel's territory is shown
  float k = mix(0.15, 1.0, share);                          // filtered factions keep a faint outline for context
  // Task #50 "influence, not a blob": the border (the m = 0.16 iso-line) is measured in SCREEN px (m / fwidth(m)), so the
  // edge is a ~1.5 px crisp line with a gentle glow at EVERY zoom (v4's band in m-space grew into a thick glowing worm at
  // mid zoom). Inside, the fill is densest along the border and thins toward the core (a soft falloff in world units, like
  // the field), with a faint hex lattice that fades out before it would alias; the fill alpha is lower overall.
  float fwm = max(fwidth(m), 1e-5);
  float dpx = (m - 0.16) / fwm;                                 // signed screen px from the border, > 0 inside
  float inside = smoothstep(-0.8, 0.8, dpx);
  float rim = (exp(-dpx * dpx * 0.7) * 0.22 + exp(-abs(dpx) * 0.4) * 0.03) * k;
  vec2 hp = vW / 1.4;
  vec2 hs = vec2(1.0, 1.7320508), ha = mod(hp, hs) - hs * 0.5, hb = mod(hp - hs * 0.5, hs) - hs * 0.5;
  vec2 hg = abs(dot(ha, ha) < dot(hb, hb) ? ha : hb);
  float he = 0.5 - max(dot(hg, vec2(0.5, 0.8660254)), hg.x);    // distance to the cell edge (cell units)
  float hfw = fwidth(hp.x);
  float hex = (1.0 - smoothstep(0.0, hfw * 1.5, he)) * smoothstep(0.09, 0.04, hfw);
  float infl = inside * (0.55 + 0.45 * (1.0 - smoothstep(0.16, 0.55, m)));
  float fill = infl * uTerrFill * share * (1.0 + hex * 0.6);
  float dfm = (m - mid) / max(fwidth(m - mid), 1e-5);           // contested front, also a constant-px seam
  float front = exp(-dfm * dfm * 0.7) * smoothstep(0.08, 0.3, mid) * k;
  float ang = atan(vW.y, vW.x + 1e-5);
  float da = mod(uAnim * 0.22 - ang, 6.2831853);
  float sweep = exp(-da * 2.2);
  vec3 c = col * (fill + rim + front * 0.3) * (1.0 + sweep * 0.6) * uTerr * uTerrStat * uTerrLens; // dimmer while a stat layer leads
  float rr = length(vW);
  float gfade = 1.0 - smoothstep(52.0, 78.0, rr);
  vec2 g = abs(fract(vW / 10.0 + 0.5) - 0.5) * 10.0;
  vec2 fw = fwidth(vW);
  float line = 1.0 - smoothstep(0.0, max(fw.x, fw.y) * 1.2, min(g.x, g.y));
  float rd = abs(fract(rr / 20.0 + 0.5) - 0.5) * 20.0;
  float ring = 1.0 - smoothstep(0.0, length(fw) * 1.4, rd);
  float sweepLine = smoothstep(0.02, 0.0, da) * 0.6 + sweep * 0.05;
  // the cyan grid steps back inside a shown territory (task #50: with the lower fill it pulled gold toward green)
  c += vec3(0.16, 0.6, 0.75) * (line * 0.045 + ring * 0.07 + sweepLine * 0.35) * gfade * (1.0 - 0.8 * inside * share * uTerr * uTerrLens);
  // Premultiplied 'over' (blend ONE, ONE_MINUS_SRC_ALPHA): alpha = territory coverage dims the blue-violet nebula under
  // a faction's space, so the faint fill composites to the house hue instead of being pulled toward magenta / blue
  // (E2E pixel check, task #13). Rim, front, grid and sweep keep adding light on top; outside territory alpha is 0,
  // which is plain additive as before.
  // Weighted by the faction filter (reviewer P3, task #14): a filtered-out faction must not dim the backdrop either,
  // so coverage is the raw coverage times the shown share.
  float cover = inside * smoothstep(0.16, 0.5, m) * share * uTerrDim * uTerr * uTerrStat * uTerrLens;
  gl_FragColor = vec4(c, cover);
}`;

const NEB_VS = /* glsl */`
varying vec2 vW;
void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const NEB_FS = /* glsl */`
uniform float uAnim; varying vec2 vW;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(17.1, 9.2); a *= 0.5; } return v; }
void main() {
  vec2 p = vW * 0.011;
  float n = fbm(p + vec2(uAnim * 0.004, 0.0));
  float n2 = fbm(p * 1.7 - vec2(0.0, uAnim * 0.003) + n * 1.6);
  vec3 c = vec3(0.006, 0.014, 0.024)
    + vec3(0.03, 0.14, 0.19) * smoothstep(0.42, 0.9, n2) * 0.3
    + vec3(0.16, 0.04, 0.24) * smoothstep(0.5, 0.95, n) * 0.2
    + vec3(0.2, 0.08, 0.03) * smoothstep(0.62, 0.95, n2 * n * 1.6) * 0.12;
  c *= 1.0 - smoothstep(140.0, 560.0, length(vW)) * 0.8;
  gl_FragColor = vec4(c, 1.0);
}`;

// map footprint for the starfield (task #56 add-on): the map centre (= CX, CY) and the hide / fade-out radii, map units
const MAP_C = 0.5, MAP_R0 = 62, MAP_R1 = 72;
const STAR_VS = /* glsl */`
uniform float uAnim; uniform float uPR;
attribute float aSize; attribute vec3 aCol; attribute float aSeed;
varying vec3 vCol;
void main() {
  // task #56 add-on: a star whose line of sight (camera -> star) crosses the map plane y = 0 inside the map footprint is
  // BEHIND the map - hidden (owner: under-map stars read as fleets). Footprint: radius MAP_R0 around the map centre,
  // faded out to MAP_R1 (systems reach 58.6). Map y = -world z.
  vec4 wp = modelMatrix * vec4(position, 1.0);
  float behind = 1.0;
  if (cameraPosition.y > 0.0 && wp.y < 0.0) {
    vec3 hit = mix(cameraPosition, wp.xyz, cameraPosition.y / (cameraPosition.y - wp.y));
    behind = smoothstep(${MAP_R0.toFixed(1)}, ${MAP_R1.toFixed(1)}, distance(vec2(hit.x, -hit.z), vec2(${MAP_C.toFixed(2)}, ${MAP_C.toFixed(2)})));
  }
  if (behind < 0.001) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float tw = 0.75 + 0.25 * sin(uAnim * (0.6 + aSeed * 2.0) + aSeed * 50.0);
  vCol = aCol * tw * behind;
  gl_PointSize = clamp(aSize * uPR * 260.0 / -mv.z, 1.0, 6.0 * uPR);
  gl_Position = projectionMatrix * mv;
}`;
const STAR_FS = /* glsl */`
varying vec3 vCol;
void main() { vec2 q = gl_PointCoord * 2.0 - 1.0; float r2 = dot(q, q); gl_FragColor = vec4(vCol * exp(-r2 * 4.0), 1.0); }`;

// ---------------------------------------------------------------- helpers
function quadGeometry() {
  const p = new THREE.PlaneGeometry(1, 1);
  const g = new THREE.InstancedBufferGeometry();
  g.index = p.index; g.setAttribute('position', p.getAttribute('position')); g.setAttribute('uv', p.getAttribute('uv'));
  g.instanceCount = 0;
  return g;
}
// Ensure instance attributes exist with room for n; returns the attributes. Capacity grows in powers of two, so the
// hourly reload reuses buffers.
function instanceAttrs(geo, spec, n) {
  const first = geo.getAttribute(spec[0][0]);
  if (!first || first.count < n) {
    const cap = Math.max(64, 2 ** Math.ceil(Math.log2(Math.max(1, n))));
    if (first) geo.dispose();
    for (const [name, size] of spec) {
      const a = new THREE.InstancedBufferAttribute(new Float32Array(cap * size), size);
      a.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute(name, a);
    }
  }
  geo.instanceCount = n;
  const out = {};
  for (const [name] of spec) out[name] = geo.getAttribute(name);
  return out;
}
// Shader material. `fade` (a shared uniform) multiplies the whole output (v10: the galaxy-marker distance fade, uGal):
// the fragment main is wrapped, so every shader fades the same way. mode 'premult' = ONE, ONE_MINUS_SRC_ALPHA (alpha
// occludes, alpha 0 adds light); 'add' = additive.
function shaderMat(vs, fs, uniforms, fade, mode = 'add') {
  if (fade) uniforms.uFade = fade;
  const m = new THREE.ShaderMaterial({
    vertexShader: vs, uniforms, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    fragmentShader: fade ? fs.replace('void main()', 'void main0()') + `\nuniform float uFade;\nvoid main() { main0(); gl_FragColor *= uFade; }` : fs,
  });
  if (mode === 'premult') Object.assign(m, {blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor, blendEquation: THREE.AddEquation});
  return m;
}
const additive = (vs, fs, uniforms, fade) => shaderMat(vs, fs, uniforms, fade, 'add');
// where Images/planets/ lives, resolved from this script's own URL (C4Live/c4-scene.js -> ../Images/planets/)
const SCRIPT_URL = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) || '';
function mesh(geo, mat, order) { const m = new THREE.Mesh(geo, mat); m.frustumCulled = false; m.renderOrder = order; return m; }
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const rgb = (fa) => M.FACTION_COLOR[M.factionKey(fa)];

function rng(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }

// ---------------------------------------------------------------- territory
const TEX = 256, SPAN = 140, CX = 0.5, CY = 0.5;
function territoryTexture(systems, data) {
  const W = [new Float32Array(TEX * TEX), new Float32Array(TEX * TEX), new Float32Array(TEX * TEX)];
  const px = TEX / SPAN, sigma = 3.3 * px, R = Math.ceil(sigma * 3), inv = 1 / (2 * sigma * sigma);
  for (const s of systems) {
    const fi = s.f === 'mud' ? 0 : s.f === 'oni' ? 1 : s.f === 'ustur' ? 2 : -1;
    if (fi < 0) continue;
    const gx = (s.x - (CX - SPAN / 2)) * px, gy = (s.y - (CY - SPAN / 2)) * px, wt = 0.6 + (s.lvl || 0) * 0.4;
    const arr = W[fi];
    for (let j = Math.max(0, Math.floor(gy - R)); j <= Math.min(TEX - 1, Math.ceil(gy + R)); j++) {
      const dy = j + 0.5 - gy;
      for (let i = Math.max(0, Math.floor(gx - R)); i <= Math.min(TEX - 1, Math.ceil(gx + R)); i++) {
        const dx = i + 0.5 - gx;
        arr[j * TEX + i] += wt * Math.exp(-(dx * dx + dy * dy) * inv);
      }
    }
  }
  for (let k = 0; k < TEX * TEX; k++) {
    for (let c = 0; c < 3; c++) data[k * 4 + c] = Math.round(255 * (1 - Math.exp(-W[c][k] * 0.9)));
    data[k * 4 + 3] = 255;
  }
}

// conquest field (task #55, repainted as soft territory in task #58 - owner 2026-11-07 18:15 EST "make the conquest look
// like soft territory, not discs"). rows = M.dacConquest systems with a winner or contested; hexOf(tag) -> '#rrggbb'.
// The SAME technique as the faction territory: one influence channel per winning DAC (plus one neutral channel for the
// contested systems), each a sum of wide gaussians (CONQ_SIGMA units) x weight (strength, at least CONQ_FLOOR) and a
// small core bump (so a won system keeps its own space next to a bigger neighbour). Systems won by one DAC therefore
// merge into ONE region, and the region's edge is an iso-line of a smooth field, bent by a low-frequency warp (so an
// isolated win reads as a patch of territory, not a compass disc). Per texel: the strongest channel paints.
//   uConq  rgb = the strongest channel's colour (sRGB), a = m = 1 - exp(-K top)        (coverage, the border at m = 0.16)
//   uConqX r = 1 where the strongest channel is the contested one, g = 1 - exp(-K second) (the seam between two DACs),
//          b = the field-weighted strength there (fill alpha follows it)
// Built on setDacs / lens change / setData only (never per frame).
const CONQ_TEX = 512, CONQ_SIGMA = 3.0, CONQ_CORE = 1.2, CONQ_CORE_W = 2.5, CONQ_FLOOR = 0.5, CONQ_CONTEST_W = 0.7, CONQ_K = 0.9;
const CONQ_FILL = 0.09, CONQ_DIM = 0.25, CONQ_WARP = 1.7, CONQ_WARP_L = 7.0; // fill level and backdrop cover (uConqFill / uConqDim; tune conqFill / conqDim); warp amplitude + wavelength of the edge bend, world units
let conqWarp = null; // [wx, wy] per texel (texel units), made once
function conquestWarp(T, px) {
  if (conqWarp) return conqWarp;
  const h = (i, j, s) => { const v = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453; return v - Math.floor(v); };
  const noise = (x, y, s) => { const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    return (h(i, j, s) * (1 - ux) + h(i + 1, j, s) * ux) * (1 - uy) + (h(i, j + 1, s) * (1 - ux) + h(i + 1, j + 1, s) * ux) * uy; };
  const wx = new Float32Array(T * T), wy = new Float32Array(T * T), f = 1 / (CONQ_WARP_L * px), amp = CONQ_WARP * px;
  for (let j = 0; j < T; j++) for (let i = 0; i < T; i++) {
    const x = i * f, y = j * f;
    wx[j * T + i] = amp * (2 * (0.65 * noise(x, y, 1) + 0.35 * noise(x * 2.1, y * 2.1, 3)) - 1);
    wy[j * T + i] = amp * (2 * (0.65 * noise(x, y, 2) + 0.35 * noise(x * 2.1, y * 2.1, 4)) - 1);
  }
  return (conqWarp = [wx, wy]);
}
function conquestTexture(rows, hexOf, data, dataX) {
  const T = CONQ_TEX, N = T * T, px = T / SPAN;
  const [wx, wy] = conquestWarp(T, px);
  const tags = [...new Set(rows.filter((s) => s.winner).map((s) => s.winner))];
  const chOf = new Map(tags.map((t, i) => [t, i])), NC = tags.length + 1, CONT = tags.length; // the last channel = contested
  const F = Array.from({length: NC}, () => new Float32Array(N)), G = new Float32Array(N), GS = new Float32Array(N);
  const cols = tags.map((t) => hexOf(t)).concat(CONQ_NEUTRAL).map((hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
  const sg = CONQ_SIGMA * px, sc = CONQ_CORE * px, R = Math.ceil(sg * 3 + CONQ_WARP * px), inv = 1 / (2 * sg * sg), invc = 1 / (2 * sc * sc);
  for (const s of rows) {
    const str = s.winner ? Math.min(1, Math.max(0, s.strength || 0)) : 0;
    const w = s.winner ? CONQ_FLOOR + (1 - CONQ_FLOOR) * str : CONQ_CONTEST_W;
    const arr = F[s.winner ? chOf.get(s.winner) : CONT];
    const gx = (s.x - (CX - SPAN / 2)) * px, gy = (s.y - (CY - SPAN / 2)) * px;
    for (let j = Math.max(0, Math.floor(gy - R)); j <= Math.min(T - 1, Math.ceil(gy + R)); j++) {
      for (let i = Math.max(0, Math.floor(gx - R)); i <= Math.min(T - 1, Math.ceil(gx + R)); i++) {
        const k = j * T + i, ux = i + 0.5 - gx, uy = j + 0.5 - gy, dx = ux + wx[k], dy = uy + wy[k], q = dx * dx + dy * dy;
        const g = Math.exp(-q * inv);
        arr[k] += w * (g + CONQ_CORE_W * Math.exp(-(ux * ux + uy * uy) * invc)); // the core bump is NOT warped: a won system always sits in its own colour
        if (s.winner) { G[k] += g; GS[k] += g * (0.3 + 0.7 * str); } // fill strength (contested adds none)
      }
    }
  }
  for (let k = 0; k < N; k++) {
    let a = -1, va = 0, vb = 0;
    for (let c = 0; c < NC; c++) { const v = F[c][k]; if (v > va) { vb = va; va = v; a = c; } else if (v > vb) vb = v; }
    const o = k * 4;
    if (a < 0 || va < 1e-4) { data[o] = data[o + 1] = data[o + 2] = data[o + 3] = 0; dataX[o] = dataX[o + 1] = dataX[o + 2] = 0; dataX[o + 3] = 255; continue; }
    const ca = cols[a];
    data[o] = ca[0]; data[o + 1] = ca[1]; data[o + 2] = ca[2];
    data[o + 3] = Math.round(255 * (1 - Math.exp(-va * CONQ_K)));
    dataX[o] = a === CONT ? 255 : 0;
    dataX[o + 1] = Math.round(255 * (1 - Math.exp(-vb * CONQ_K)));
    dataX[o + 2] = Math.round(255 * (G[k] > 1e-6 ? GS[k] / G[k] : 0));
    dataX[o + 3] = 255;
  }
}

// ---------------------------------------------------------------- mount
function stub(container, reason) {
  const msg = document.createElement('div');
  msg.textContent = 'Galaxy map unavailable: ' + reason;
  msg.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#7fa;font:13px system-ui;opacity:.7';
  container.appendChild(msg);
  const noop = () => {};
  return {ok: false, reason, setData: () => false, setFilter: noop, focusOwner: () => 0, focusPoint: noop, pulseEvent: noop,
    focusSystem: () => false, bodyScreen: () => null, setStatLayer: () => false, setInsets: () => ({left: 0, right: 0, top: 0, bottom: 0}),
    fleetScreen: () => null, fleetPixelSize: () => null, fleetCell: () => null,
    on: () => noop, setLayer: () => false, screenOf: () => null, getStats: () => ({ok: false, reason}), dispose: () => msg.remove()};
}

function mount(container, opts = {}) {
  if (!container || !container.appendChild) throw new TypeError('C4Scene.mount needs a container element');
  const reduced = opts.reducedMotion != null ? !!opts.reducedMotion
    : !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const clock = typeof opts.clock === 'function' ? opts.clock : () => Date.now() / 1000;

  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({antialias: false, powerPreference: 'high-performance', alpha: false});
  } catch (e) {
    return stub(container, 'WebGL is not available (' + (e && e.message ? e.message : e) + ')');
  }
  let pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(pixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x000000, 1);
  renderer.info.autoReset = false;
  const canvas = renderer.domElement;
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;outline:none';
  container.appendChild(canvas);
  const labelLayer = document.createElement('div');
  labelLayer.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;contain:strict';
  container.appendChild(labelLayer);
  // stat callouts (task #32): own overlay; pointer-events none except the callouts themselves (they pick their system)
  const statLayer = document.createElement('div');
  statLayer.className = 'c4-stat-layer';
  statLayer.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;contain:strict;display:none';
  container.appendChild(statLayer);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, FAR);
  const controls = new MapControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.08; controls.screenSpacePanning = false;
  controls.minDistance = 0.03; controls.maxDistance = 240; controls.maxPolarAngle = 1.15; controls.zoomSpeed = 1.2; // minDistance: resize() (MIN_HULL_PX); v11: the two after it had slipped into this comment in v10
  controls.autoRotateSpeed = 0.12;
  // the WHEEL is ours (task #30): three's zoomToCursor (with damping + a plane-placed target) let the ground point drift off
  // the cursor - an off-centre system slid ~800 px down the screen and a neighbour's view opened. wheelDolly() below scales
  // camera AND target about the ground point under the pointer (a homothety), so that point stays exactly under the cursor.
  controls.zoomToCursor = false;

  const U = {
    uNow: {value: 0}, uAnim: {value: 0}, uTime: {value: 0}, uZoom: {value: 1}, uSysZoom: {value: 1}, uDim: {value: 1},
    uReduced: {value: reduced ? 1 : 0}, uPR: {value: pixelRatio},
    uGal: {value: 1}, uGlyphK: {value: 1}, // galaxy-marker distance fade (MARK_NEAR..MARK_FAR) / glyph growth stop (GLYPH_D0)
    // ship silhouettes (task #22): atlas texture, grid, and the galaxy LOD (0 = glyph, 1 = silhouette)
    uSil: {value: 1}, uViewH: {value: 1}, uHasAtlas: {value: 0}, uAtlas: {value: null}, uCols: {value: 8}, uRows: {value: 8},
  };

  // backdrop: nebula plane, deep starfield below the galaxy plane (parallax when orbiting), near dust
  const nebula = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600).rotateX(-Math.PI / 2),
    new THREE.ShaderMaterial({vertexShader: NEB_VS, fragmentShader: NEB_FS, uniforms: {uAnim: U.uAnim}, depthWrite: false, depthTest: false}));
  nebula.position.y = -70; nebula.renderOrder = -10; nebula.frustumCulled = false;
  scene.add(nebula);
  const starGeo = new THREE.BufferGeometry();
  {
    // task #56 add-on (owner 2026-11-07: "when the stars in the background are behind the map they should not show"): the
    // 1,800 "dust" points that sat just under the map (y -1.5..-7.5, ship-like sizes, twinkling) are gone; the deep
    // stars keep their positions (same rng stream - the dust was drawn last) and STAR_VS hides any whose line of sight
    // crosses the map footprint
    const r = rng(7), N = 4200, pos = new Float32Array(N * 3), size = new Float32Array(N), col = new Float32Array(N * 3), seed = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const rad = 40 + r() * 460, a = r() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * rad; pos[i * 3 + 2] = Math.sin(a) * rad;
      pos[i * 3 + 1] = -12 - r() * 50;
      size[i] = 0.6 + r() ** 3 * 2.4;
      const t = r(), b = 0.35 + r() * 0.65;
      col[i * 3] = b * (t < 0.2 ? 1 : 0.75 + t * 0.2); col[i * 3 + 1] = b * 0.88; col[i * 3 + 2] = b * (t > 0.7 ? 1 : 0.85);
      seed[i] = r();
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    starGeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    starGeo.setAttribute('aCol', new THREE.BufferAttribute(col, 3));
    starGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  }
  const stars = new THREE.Points(starGeo, additive(STAR_VS, STAR_FS, {uAnim: U.uAnim, uPR: U.uPR}));
  stars.renderOrder = -9; stars.frustumCulled = false;
  scene.add(stars);

  // territory + tactical grid
  const terrData = new Uint8Array(TEX * TEX * 4);
  const terrTex = new THREE.DataTexture(terrData, TEX, TEX, THREE.RGBAFormat);
  terrTex.magFilter = THREE.LinearFilter; terrTex.minFilter = THREE.LinearFilter; terrTex.needsUpdate = true;
  const terrU = {uTex: {value: terrTex}, uTerr: {value: 1}, uTerrStat: {value: 1}, uTerrLens: {value: 1}, uTerrDim: {value: 0.88}, uTerrFill: {value: 0.034}, uAnim: U.uAnim, uFaW: {value: new THREE.Vector3(1, 1, 1)},
    uFa0: {value: new THREE.Vector3()}, uFa1: {value: new THREE.Vector3()}, uFa2: {value: new THREE.Vector3()}};
  // territory colour = house colour x a per-faction gain, so the three fills read equally bright (gold, the lightest
  // colour, read as an opaque slab at gain 1 - task #18). Glyphs, labels and borders keep the plain house colour.
  // neutral (task #55, the DAC conquest lens): all three houses draw the neutral grey-blue at low strength
  const setTerrGain = (g, neutral = false) => {
    const col = (fa) => (neutral ? M.hexToLinear(CONQ_NEUTRAL).map((v) => v * 0.5) : M.FACTION_COLOR[fa]);
    terrU.uFa0.value.set(...col('mud').map((v) => v * (neutral ? 1 : g[0])));
    terrU.uFa1.value.set(...col('oni').map((v) => v * (neutral ? 1 : g[1])));
    terrU.uFa2.value.set(...col('ustur').map((v) => v * (neutral ? 1 : g[2])));
  };
  let terrGain = M.TERR_GAIN.slice();
  setTerrGain(terrGain);
  const terrain = new THREE.Mesh(new THREE.PlaneGeometry(SPAN, SPAN).rotateX(-Math.PI / 2), Object.assign(shaderMat(TERR_VS, TERR_FS, terrU, null, 'add'),
    {blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor, blendEquation: THREE.AddEquation}));
  terrain.position.set(CX, 0, -CY); terrain.renderOrder = 0; terrain.frustumCulled = false;
  scene.add(terrain);
  if (reduced) terrU.uAnim = {value: 0};
  // DAC conquest plane (task #55): the same plane and uv mapping as the territory, hidden unless the lens is on
  const conqData = new Uint8Array(CONQ_TEX * CONQ_TEX * 4), conqDataX = new Uint8Array(CONQ_TEX * CONQ_TEX * 4);
  const conqTex = new THREE.DataTexture(conqData, CONQ_TEX, CONQ_TEX, THREE.RGBAFormat), conqTexX = new THREE.DataTexture(conqDataX, CONQ_TEX, CONQ_TEX, THREE.RGBAFormat);
  for (const t of [conqTex, conqTexX]) { t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; }
  const conquest = new THREE.Mesh(terrain.geometry, shaderMat(TERR_VS, CONQ_FS, {uConq: {value: conqTex}, uConqX: {value: conqTexX}, uConqFill: {value: CONQ_FILL}, uConqDim: {value: CONQ_DIM}}, null, 'premult'));
  conquest.position.set(CX, 0.01, -CY); conquest.renderOrder = 0.5;conquest.frustumCulled = false; conquest.visible = false;
  scene.add(conquest);

  // instanced layers
  const fleetGeo = quadGeometry(), sysGeo = quadGeometry(), hotGeo = quadGeometry(), pulseGeo = quadGeometry();
  const FLEET_SPEC = [['iA', 4], ['iT', 2], ['iC', 3], ['iM', 4], ['iX', 2], ['iO', 4]];
  // one fleet instancing for every fleet (v10): fleets, trails, routes and mining beams are four draws of it
  const fU = {uNow: U.uNow, uAnim: U.uAnim, uZoom: U.uZoom, uBeamGain: {value: 2.6},
    uSil: U.uSil, uHasAtlas: U.uHasAtlas, uAtlas: U.uAtlas, uCols: U.uCols, uRows: U.uRows, uShipBase: {value: M.SHIP_BASE.galaxy}, uViewH: U.uViewH};
  const routes = mesh(fleetGeo, additive(ROUTE_VS, ROUTE_FS, fU, null), 2);
  const hots = mesh(hotGeo, additive(HOT_VS, HOT_FS, {uZoom: U.uZoom, uAnim: U.uAnim}, U.uGal), 2);
  const trails = mesh(fleetGeo, additive(TRAIL_VS, TRAIL_FS, fU, null), 3);
  const sysCover = {value: 2.5}; // measured: MUD glyph hue -17 -> -9 deg, 82% within 20 (1.6); task #58 round (no rings since #55): glow 0.3 -> 0.42 + cover 1.6 -> 2.5 = USTUR 73 -> 83 %, MUD 93 -> 99 % within 20
  const systemsMesh = mesh(sysGeo, shaderMat(SYS_VS, SYS_FS, {uSysZoom: U.uSysZoom, uGlyphK: U.uGlyphK, uViewH: U.uViewH, uAnim: U.uAnim, uDim: U.uDim, uSysCover: sysCover}, null, 'premult'), 4);
  const beams = mesh(fleetGeo, additive(BEAM_VS, BEAM_FS, fU, null), 4.8);
  const fleetsMesh = mesh(fleetGeo, shaderMat(FLEET_VS, FLEET_FS, fU, null, 'premult'), 5);
  const fleetDots = mesh(fleetGeo, shaderMat(DOT_VS, DOT_FS, fU, null, 'premult'), 4.6);
  const pulses = mesh(pulseGeo, additive(PULSE_VS, PULSE_FS, {uTime: U.uTime, uReduced: U.uReduced}, U.uGal), 6);
  const tracerGeo = quadGeometry();
  const tracers = mesh(tracerGeo, additive(TRACER_VS, TRACER_FS, {uTime: U.uTime, uZoom: U.uZoom, uReduced: U.uReduced}, U.uGal), 6);
  // in-map stat columns (setStatLayer): one shared instanced geometry, drawn twice (column + base disc, task #50)
  const statGeo = quadGeometry();
  const statU = {uAnim: U.uAnim, uStatH: {value: 1}, uStatW: {value: 1}, uGrow: {value: 1}, uMinH: {value: 0}};
  const statCols = mesh(statGeo, additive(STATCOL_VS, STATCOL_FS, statU, U.uGal), 7);
  const statDisc = mesh(statGeo, additive(STATDISC_VS, STATDISC_FS, {uStatW: statU.uStatW, uGrow: statU.uGrow, uViewH: U.uViewH}, U.uGal), 7);
  statCols.visible = statDisc.visible = false;
  const dacGeo = quadGeometry();
  const dacU = {uHaloK: {value: 1}};
  const dacHalos = mesh(dacGeo, additive(DACHALO_VS, DACHALO_FS, dacU, U.uGal), 1); // over the territory, under routes / systems
  dacHalos.visible = false;
  scene.add(dacHalos);
  scene.add(routes, hots, trails, systemsMesh, beams, fleetDots, fleetsMesh, pulses, tracers, statDisc, statCols);
  const tracerA = instanceAttrs(tracerGeo, [['iE', 4], ['iC', 3], ['iC2', 3], ['iS', 2]], TRACER_POOL);
  for (let i = 0; i < TRACER_POOL; i++) tracerA.iS.array[i * 2] = -1e9;
  let tracerNext = 0;
  const pulseA = instanceAttrs(pulseGeo, [['iS', 4], ['iC', 3], ['iK', 1]], PULSE_POOL);
  pulseA.iS.array.fill(-1e9);
  for (let i = 0; i < PULSE_POOL; i++) pulseA.iS.array[i * 4 + 3] = -1e9;
  let pulseNext = 0;

  // the combat heat / pulse rings (hots) are NOT in layerObjs since task #57: syncHots shows them only while the Combat
  // stat layer leads (and the 'combat' layer switch is on). Mining beams follow fleets AND mining (syncBeams).
  const layerObjs = {systems: [systemsMesh], fleets: [fleetsMesh, fleetDots, trails], mining: [], routes: [routes], combat: []};
  const layers = Object.fromEntries(LAYERS.map((l) => [l, true]));
  const syncBeams = () => { beams.visible = layers.fleets && layers.mining; };

  // ------------------------------------------------------------ the world's systems (v10, system.js)
  const assetBase = opts.assetBase || new URL('../Images/planets/', SCRIPT_URL || location.href).href;
  const world = createWorld({scene, camera, U, quadGeometry, instanceAttrs, shaderMat, assetBase});
  // dominant system (the 'systemView' event) + focusSystem framing: framed = the system focusSystem framed the camera on,
  // until the user moves the camera (reframe on setInsets / resize / a setData that changes the fit)
  const dom = {addr: null, framed: null, frameD: 0, frac: 0};
  // test-only knobs (tune({nearK, domIn, domOut})): the near-plane factor and the dominance thresholds, so a test can
  // prove its probe fails with clipping / without hysteresis. Defaults = the shipped constants.
  const tun = {nearK: NEAR_K, domIn: DOM_IN, domOut: DOM_OUT, dcOut: 1.25}; // dcOut: the stay-inside bound (enter needs dc <= 1)

  // post
  const rt = new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType, samples: 4});
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.4, 0.2, 0.85);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ------------------------------------------------------------ state
  let D = null;            // {latest, tBase, fleets[], paths[], seeds[], anchors[], systems[], asteroids[], byOwner}
  // in-map stat layer (setStatLayer): name in M.STAT_LAYERS or null; cols = M.statColumns rows; callouts = top rows' DOM
  const statState = {name: null, cols: [], callouts: [], dirty: false, vmax: 0, growAt: 0};
  // task #57 (owner 2026-11-07 17:35 EST "the combat rings should also just show when combat button is selected"): the
  // galaxy heat / pulse rings at systems draw only while setStatLayer('combat') leads; mining, fleets, owners, dacs, null
  // hide them
  const syncHots = () => { hots.visible = layers.combat && statState.name === 'combat'; };
  syncHots();
  // DACs (task #53): the list from setDacs (sanitised: tag string, colour '#rrggbb' or grey, member strings), the example
  // flag (an EXAMPLE watermark while the 'dacs' layer stands) and the focused tag; halos = the drawn (system, DAC) rows
  const dacState = {dacs: [], example: false, focus: null, halos: [], mark: null, markBox: null,
    // conquest lens (task #55): on, metrics (M.CONQUEST_METRICS subset), scope (a listed tag | null); conq = the last
    // M.dacConquest result drawn (null while off)
    lens: {on: false, metrics: [], scope: null}, conq: null, lensKey: ''};
  const NEUTRAL = M.hexToLinear(CONQ_NEUTRAL);
  // the faction tint, or the neutral grey-blue while the conquest lens is on (fleets, systems, mining rings, pulses)
  const tint = (fa) => (dacState.lens.on ? NEUTRAL : rgb(fa));
  const tintHex = (fa) => (dacState.lens.on ? CONQ_NEUTRAL : M.FACTION_HEX[M.factionKey(fa)]);
  // the column top's world height: the SAME formula as STATCOL_VS (min on-screen height, then the rise)
  const statTopH = (c) => Math.max(c.h * statU.uStatH.value, statU.uMinH.value) * statU.uGrow.value;
  const pxPerUnitAt = (dist) => H / (2 * Math.tan(FOV * Math.PI / 360) * Math.max(1e-3, dist));
  // CSS px of the map covered by docked UI (setInsets); the camera's view offset keeps the visual centre in the rest
  const insets = {left: 0, right: 0, top: 0, bottom: 0}, insetsReq = {left: 0, right: 0, top: 0, bottom: 0};
  let introDone = false;   // per mount, survives setData
  let filter = {faction: null, states: null, owner: null};
  const handlers = {pick: new Set(), hover: new Set(), systemView: new Set()};
  let bodiesAll = []; // bodies.json `bodies`, kept across setData calls that omit it
  let shipAtlas = null; // Images/ships/silhouettes/atlas.json once its image has loaded; null = glyphs only
  const shipBase = opts.shipAtlasBase || new URL('../Images/ships/silhouettes/', SCRIPT_URL || location.href).href;
  fetch(shipBase + 'atlas.json').then((r) => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)))).then((atlas) => {
    const file = (window.devicePixelRatio || 1) > 1.25 && atlas.image2x ? atlas.image2x : atlas.image;
    new THREE.TextureLoader().load(shipBase + file, (t) => {
      if (disposed) { t.dispose(); return; }
      t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
      shipAtlas = atlas; U.uAtlas.value = t; U.uHasAtlas.value = 1; U.uCols.value = atlas.cols || 8; U.uRows.value = atlas.rows || 8;
      if (D) writeFleets();
    }, undefined, () => console.warn('C4Scene: ship atlas image failed to load; keeping the glyphs'));
  }).catch((e) => console.warn('C4Scene: ship atlas unavailable; keeping the glyphs', e && e.message));
  const emit = (name, v) => { for (const h of handlers[name]) { try { h(v); } catch (e) { console.error('C4Scene ' + name + ' handler', e); } } };
  let W = 1, H = 1, rect = {left: 0, top: 0};
  let lastInteract = performance.now();
  const fitCache = new Map(); // system address -> focusSystem framing distance (fitDist, task #36)
  const fly = {on: false, t: 0, dur: 1, fx: 0, fz: 0, tx: 0, tz: 0, fr: 1, tr: 1, fp: 0, tp: 0, th: 0};
  const sph = new THREE.Spherical(), v3 = new THREE.Vector3(), pos2 = [0, 0];
  const lastCam = new Float32Array(16);
  let labelEls = [];

  function resize() {
    const r = container.getBoundingClientRect(), wh = W + 'x' + H;
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    renderer.setSize(W, H, false); composer.setPixelRatio(pixelRatio); composer.setSize(W, H);
    camera.aspect = W / H; U.uViewH.value = H;
    // v10: the closest zoom shows a MEDIUM hull MIN_HULL_PX long (its visible length = HULL_LEN) at the orbit target
    controls.minDistance = M.HULL_LEN.medium * 0.5 * H / Math.tan(FOV * Math.PI / 360) / MIN_HULL_PX;
    applyViewOffset(); // also updates the projection matrix
    rect = canvas.getBoundingClientRect(); lastCam[0] = NaN;
    if (W + 'x' + H !== wh) { fitCache.clear(); reframe(); }
  }
  // Insets (task #32): shift the projection centre into the uncovered part of the canvas. setViewOffset with the full size
  // as the window only TRANSLATES the frustum (no scale), so every project / unproject / raycast (screenOf, fleetScreen,
  // bodyScreen, picking, the wheel anchor) stays the true on-screen pixel, and the hull px formula (projection[1][1]) holds.
  function applyViewOffset() {
    // effective insets = requested, except a pair that would leave under 40 px of map is ignored (a tiny or hidden container)
    Object.assign(insets, insetsReq);
    if (insets.left + insets.right > W - 40) insets.left = insets.right = 0;
    if (insets.top + insets.bottom > H - 40) insets.top = insets.bottom = 0;
    const ox = (insets.right - insets.left) / 2, oy = (insets.bottom - insets.top) / 2;
    if (ox || oy) camera.setViewOffset(W, H, ox, oy, W, H); else { camera.clearViewOffset(); camera.updateProjectionMatrix(); }
  }
  // avoid rects (task #38, setInsets({avoid})): canvas-relative CSS px boxes of floating HUD (faction / layers card, brand,
  // age banner, ship hint). They do not move the framing; callouts never overlap them and covered() is true inside them.
  const avoid = [];
  const inAvoid = (sx, sy) => avoid.some((a) => sx >= a.left && sx <= a.right && sy >= a.top && sy <= a.bottom);
  const covered = (sx, sy) => sx < insets.left || sx > W - insets.right || sy < insets.top || sy > H - insets.bottom || inAvoid(sx, sy);
  // a box [x0, y0, x1, y1] lies in the open map: inside the insets (2 px margin) and clear of every avoid rect
  const boxOpen = (x0, y0, x1, y1) => x0 >= insets.left + 2 && y0 >= insets.top + 2 && x1 <= W - insets.right - 2 && y1 <= H - insets.bottom - 2
    && !avoid.some((a) => x0 < a.right && x1 > a.left && y0 < a.bottom && y1 > a.top);
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // camera
  function placeCamera(tx, ty, dist, polar, theta) {
    controls.target.set(tx, 0, -ty);
    sph.set(dist, polar, theta);
    camera.position.setFromSpherical(sph).add(controls.target);
    camera.lookAt(controls.target);
  }
  function flyTo(x, y, dist, polar, dur = 1.6) {
    dom.framed = null; // focusSystem / reframe set it again after this call
    lastInteract = performance.now(); // a programmatic fly (panel click) counts as interaction: no auto-orbit straight after
    v3.copy(camera.position).sub(controls.target); sph.setFromVector3(v3);
    Object.assign(fly, {on: true, t: 0, dur, fx: controls.target.x, fz: controls.target.z, tx: x, tz: -y, fr: sph.radius,
      tr: Math.min(controls.maxDistance, Math.max(controls.minDistance, dist)), fp: sph.phi, tp: polar, th: sph.theta});
    if (reduced || dur <= 0) { fly.t = fly.dur = 1; stepFly(0); }
  }
  function stepFly(dt) {
    fly.t = Math.min(fly.dur, fly.t + dt);
    const k = ease(fly.t / fly.dur);
    // v10: the radius moves in log space and the target follows it so the destination's SCREEN offset shrinks evenly
    // (a linear target with a log zoom left a 2,000x zoom-in sliding across the screen at the end): zooming in, the target
    // offset scales with the radius; zooming out, the travelled part does
    const r = Math.exp(Math.log(fly.fr) + (Math.log(fly.tr) - Math.log(fly.fr)) * k);
    const kp = fly.tr < fly.fr ? 1 - (1 - k) * r / fly.fr : k * r / fly.tr;
    controls.target.set(fly.fx + (fly.tx - fly.fx) * kp, 0, fly.fz + (fly.tz - fly.fz) * kp);
    sph.set(r, fly.fp + (fly.tp - fly.fp) * k, fly.th);
    camera.position.setFromSpherical(sph).add(controls.target);
    camera.lookAt(controls.target);
    if (fly.t >= fly.dur) fly.on = false;
  }
  // cursor-anchored wheel dolly (task #30). Each event adds log-scale to `zoomPend`; the frame loop eases it in (damped) and
  // every partial step scales camera + target about G, the y = 0 map point under the wheel pointer. A homothety about G keeps
  // the view direction, so G's screen position is invariant: the system under the cursor stays under it and is the one entered.
  const ZOOM_STEP = 0.9; // per 100 px of wheel delta (a mouse notch)
  const zoomAt = {x: 0, y: 0}, zoomG = new THREE.Vector3(), zoomV = new THREE.Vector3(), zoomF = new THREE.Vector3();
  const zoomPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // v10: the whole world lies on the plane y = 0
  const lastPointer = {x: 0, y: 0, on: false}, ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let zoomPend = 0;
  const onWheel = (e) => {
    if (!controls.enabled) return;
    e.preventDefault(); e.stopPropagation(); // capture phase on the container: three's own wheel handler never sees it
    const px = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? H : 1);
    zoomPend += Math.log(ZOOM_STEP) * (-px / 100); // wheel up (deltaY < 0) = zoom in = negative log-scale
    zoomPend = Math.max(-6, Math.min(6, zoomPend));
    zoomAt.x = e.clientX; zoomAt.y = e.clientY;
    if (e.target === canvas) { lastPointer.x = e.clientX; lastPointer.y = e.clientY; lastPointer.on = true; }
    dom.framed = null;
    fly.on = false; lastInteract = performance.now();
    // kill the controls' damped rotate/pan momentum (an idle auto-orbit or a drag keeps swinging the camera about the
    // target for ~1 s after it stops, which carries the anchor off the cursor). three r186 internals, guarded.
    if (controls._sphericalDelta && typeof controls._sphericalDelta.set === 'function') controls._sphericalDelta.set(0, 0, 0);
    if (controls._panOffset && typeof controls._panOffset.set === 'function') controls._panOffset.set(0, 0, 0);
    controls.autoRotate = false;
  };
  container.addEventListener('wheel', onWheel, {capture: true, passive: false});
  function stepWheel(dt) {
    if (Math.abs(zoomPend) < 1e-4) { zoomPend = 0; return; }
    const ls = reduced ? zoomPend : zoomPend * (1 - Math.exp(-dt * 14));
    const d = camera.position.distanceTo(controls.target), want = d * Math.exp(ls);
    const nd = Math.min(controls.maxDistance, Math.max(controls.minDistance, want)), s = nd / d;
    zoomPend = nd === want ? zoomPend - ls : 0; // hit a distance limit: drop the rest
    if (s === 1) return;
    ndc.set((zoomAt.x - rect.left) / W * 2 - 1, -((zoomAt.y - rect.top) / H) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.ray.intersectPlane(zoomPlane, zoomG);
    // no ground under the pointer (above the horizon) or absurdly far: dolly about the orbit target like a centre zoom
    if (!hit || zoomG.distanceTo(camera.position) > d * 8) zoomG.copy(controls.target);
    camera.getWorldDirection(zoomF);
    zoomV.copy(camera.position).sub(zoomG).multiplyScalar(s); camera.position.copy(zoomG).add(zoomV);
    // same orientation, so G keeps its screen spot; the orbit target is re-found on the unchanged forward ray at y = 0
    if (zoomF.y < -1e-3) controls.target.copy(camera.position).addScaledVector(zoomF, -camera.position.y / zoomF.y);
    else { zoomV.copy(controls.target).sub(zoomG).multiplyScalar(s); controls.target.copy(zoomG).add(zoomV); }
    lastInteract = performance.now();
  }
  controls.addEventListener('start', () => { fly.on = false; lastInteract = performance.now(); dom.framed = null; });
  controls.addEventListener('end', () => { lastInteract = performance.now(); });
  placeCamera(HOME.x, HOME.y, reduced ? HOME.dist : 300, reduced ? HOME.polar : 0.25, reduced ? 0 : -0.6);

  // ------------------------------------------------------------ data
  function writeFleets() {
    const fl = D.fleets, n = fl.length, A = instanceAttrs(fleetGeo, FLEET_SPEC, n);
    const a = A.iA.array, t = A.iT.array, c = A.iC.array, m = A.iM.array, x = A.iX.array, o = A.iO.array;
    for (let i = 0; i < n; i++) {
      const f = fl[i], p = D.paths[i], col = tint(f.fa), anc = D.anchors[i], pl = D.place[i];
      if (pl) { a.set(pl.A, i * 4); o.set(pl.O, i * 4); t[i * 2] = pl.T[0]; t[i * 2 + 1] = pl.T[1]; } // placed in its system (v10)
      else {
        o[i * 4] = o[i * 4 + 1] = o[i * 4 + 2] = o[i * 4 + 3] = 0;
        if (p.moving && (D.kinds[i] === 3 || D.kinds[i] === 4)) { a[i * 4] = p.from[0]; a[i * 4 + 1] = p.from[1]; a[i * 4 + 2] = p.to[0]; a[i * 4 + 3] = p.to[1]; t[i * 2] = p.dep - D.tBase; t[i * 2 + 1] = p.arr - D.tBase; }
        else { a[i * 4] = anc[0]; a[i * 4 + 1] = anc[1]; a[i * 4 + 2] = D.targets[i][0]; a[i * 4 + 3] = D.targets[i][1]; t[i * 2] = 0; t[i * 2 + 1] = 0; }
      }
      c[i * 3] = col[0]; c[i * 3 + 1] = col[1]; c[i * 3 + 2] = col[2];
      m[i * 4] = M.fleetSize(f.ships); m[i * 4 + 1] = D.kinds[i]; m[i * 4 + 2] = shownVis(i); m[i * 4 + 3] = D.seeds[i];
      x[i * 2] = M.atlasCell(shipAtlas, f.flag, f.flagSize); x[i * 2 + 1] = M.sizeScale(f.flagSize);
    }
    for (const k in A) A[k].needsUpdate = true;
  }
  // the drawn visibility: the filter's (D.vis) unless the Mining switch hides this miner (task #26 rule, every system now)
  const shownVis = (i) => (!layers.mining && D.fleets[i].s.kind === 'mining' ? 0 : D.vis[i]);
  function writeVis() {
    if (!D) return;
    const fm = fleetGeo.getAttribute('iM'), sm = sysGeo.getAttribute('iM'), hm = hotGeo.getAttribute('iM');
    for (let i = 0; i < D.fleets.length; i++) { D.vis[i] = M.fleetVis(D.fleets[i], filter); fm.array[i * 4 + 2] = shownVis(i); }
    fm.needsUpdate = true;
    for (let i = 0; i < D.systems.length; i++) {
      sm.array[i * 4] = M.systemDimmed(D.systems[i].f, filter.faction) ? 0.22 : 1;
    }
    sm.needsUpdate = true;
    for (let i = 0; i < D.hot.length; i++) hm.array[i * 4 + 3] = M.hotMatch(D.hot[i], filter.faction) ? 1 : 0.15;
    hm.needsUpdate = true;
    writeMineVis();
    if (statState.name === 'owners' || statState.name === 'combat') statState.dirty = true; // owners: the focused owner; combat: the faction filter
    U.uDim.value = filter.owner ? 0.4 : 1;
    const fw = terrU.uFaW.value;
    fw.set(...['mud', 'oni', 'ustur'].map((fa) => (M.systemDimmed(fa, filter.faction) ? 0.15 : 1)));
    lastCam[0] = NaN; // labels restyle
  }

  // (the galaxy mining indicator rings and their visibility / neighbour cap are gone since task #55)
  function writeMineVis() {
    if (!D) return;
    const cs = statState.name && statState.colSys;
    // iM.z = 1 where a column stands (task #44; SYS_FS no longer reads it since #55 removed the starbase rings)
    const sm = sysGeo.getAttribute('iM');
    if (sm && D.systems) { for (let i = 0; i < D.systems.length; i++) sm.array[i * 4 + 2] = cs && cs.has(D.systems[i].a) ? 1 : 0; sm.needsUpdate = true; }
  }
  // DAC conquest lens (task #55): recount M.dacConquest, repaint the conquest field, and switch every faction tint
  // (fleets, system glyphs + labels, mining rings, territory) to neutral or back. Called by setDacs and setData.
  function applyLens() {
    const on = dacState.lens.on;
    setTerrGain(terrGain, on);
    terrU.uTerrLens.value = on ? 0 : 1; // task #58: the faction territory is off under the lens (unconquered space empty)
    dacState.conq = on && D ? M.dacConquest(D.latest, D.events, dacState.dacs, dacState.lens.metrics, dacState.lens.scope) : null;
    if (dacState.conq) {
      const hx = new Map(dacState.dacs.map((d) => [d.tag, d.color]));
      conquestTexture(dacState.conq.systems.filter((s) => s.winner || s.contested), (t) => hx.get(t) || CONQ_NEUTRAL, conqData, conqDataX);
      conqTex.needsUpdate = conqTexX.needsUpdate = true;
    }
    conquest.visible = !!dacState.conq;
    if (D) {
      const fc = fleetGeo.getAttribute('iC'), sc = sysGeo.getAttribute('iC');
      if (fc) { D.fleets.forEach((f, i) => fc.array.set(tint(f.fa), i * 3)); fc.needsUpdate = true; }
      if (sc) { D.systems.forEach((s, i) => sc.array.set(tint(s.f), i * 3)); sc.needsUpdate = true; }
      buildLabels(); lastCam[0] = NaN;
    }
    if (statState.name === 'dacs') statState.dirty = true;
  }

  function setData(latest, events, bodies) {
    if (!latest || !Array.isArray(latest.fleets) || !Array.isArray(latest.systems)) {
      console.error('C4Scene.setData: latest.json shape not recognised (need fleets[] and systems[])');
      return false;
    }
    const tBase = Number.isFinite(latest.generatedAt) ? latest.generatedAt : Math.floor(clock());
    const astByAddr = new Map((latest.asteroids || []).map((x) => [x.a, x]));
    const sysByAddr = new Map(latest.systems.map((s) => [s.a, s]));
    const fleets = latest.fleets.filter((f) => f && f.s && Number.isFinite(f.x) && Number.isFinite(f.y));
    const n = fleets.length;
    D = {latest, events: Array.isArray(events) ? events : [], tBase, fleets, systems: latest.systems.filter((s) => Number.isFinite(s.x) && Number.isFinite(s.y)),
      asteroids: (latest.asteroids || []).filter((x) => Number.isFinite(x.x) && Number.isFinite(x.y)),
      paths: new Array(n), anchors: new Array(n), targets: new Array(n), seeds: new Float32Array(n), kinds: new Float32Array(n), vis: new Float32Array(n), hot: [], index: new Map(fleets.map((f, i) => [f.a, i]))};
    for (let i = 0; i < n; i++) {
      const f = fleets[i], s = f.s, seed = M.seedOf(f.a), k = s.kind;
      D.paths[i] = M.fleetPath(f); D.seeds[i] = seed; D.kinds[i] = M.kindCode(k);
      let anc = [f.x, f.y], tgt = anc;
      if (k === 'mining') { const ast = astByAddr.get(s.asteroid); if (ast) anc = [ast.x, ast.y]; tgt = anc; }
      else if (k === 'docked') { const sys = sysByAddr.get(s.system); if (sys) anc = [sys.x, sys.y]; tgt = anc; }
      D.anchors[i] = anc; D.targets[i] = tgt;
      if (M.isTransit(k) && !D.paths[i].moving) D.kinds[i] = 0; // transit without usable path data: draw as idle at x,y
    }
    // transits that had arrived 2+ minutes before the snapshot are at rest at `to`: draw them static there (their trail
    // has faded anyway)
    const settledBy = tBase - 120, off = [0, 0];
    for (let i = 0; i < n; i++) {
      const p = D.paths[i];
      if (p.moving && p.arr <= settledBy) { D.kinds[i] = 0; D.anchors[i] = D.targets[i] = [p.to[0], p.to[1]]; }
    }
    for (let i = 0; i < n; i++) D.vis[i] = M.fleetVis(fleets[i], filter);
    // the world's systems (v10): bodies (optional 3rd argument; an omitted one keeps the previous set), members, stakes.
    // Every fleet AT a system (docked, mining, claim-stake transfer, idle within 0.6 - the systemMembers rule) is placed in
    // that system's layout (D.place); the rest keep the galaxy rule
    if (Array.isArray(bodies)) bodiesAll = bodies.filter((b) => b && b.a && b.sys);
    D.bodiesBySys = new Map(); fitCache.clear();
    for (const b of bodiesAll) { let l = D.bodiesBySys.get(b.sys); if (!l) D.bodiesBySys.set(b.sys, l = []); l.push(b); }
    D.members = M.systemMembers(fleets, D.systems, bodiesAll, settledBy);
    D.sysByAddr = new Map(D.systems.map((s) => [s.a, s]));
    D.ownerFa = new Map((latest.owners || []).map((o) => [o.p, o.fa]));
    D.stakes = (latest.stakes || []).filter((s) => s && s.body);
    D.place = world.build(D).place;
    // fleets that share one point OUTSIDE any system: a sunflower disc (model.js stackOffset) so each stays readable
    for (const list of M.stacks(fleets, settledBy).values()) {
      const free = list.filter((idx) => !D.place[idx]);
      if (free.length < 2) continue;
      free.forEach((idx, j) => {
        M.stackOffset(j, off);
        const a = D.anchors[idx];
        D.anchors[idx] = D.targets[idx] = [a[0] + off[0], a[1] + off[1]];
      });
    }
    writeFleets();

    const S = D.systems, sA = instanceAttrs(sysGeo, [['iS', 4], ['iC', 3], ['iM', 4]], S.length), WI = world.world.infos;
    for (let i = 0; i < S.length; i++) {
      const s = S[i], col = tint(s.f);
      sA.iS.array.set([s.x, s.y, M.systemSize(s.lvl), s.lvl || 0], i * 4);
      sA.iC.array.set(col, i * 3);
      sA.iM.array.set([1, M.seedOf(s.a), 0, WI[i].starR], i * 4); // w: the star's disc radius (the glyph -> star hand-over)
    }
    for (const k in sA) sA[k].needsUpdate = true;

    D.hot = M.hotSpots(Array.isArray(events) ? events : [], tBase);
    const hA = instanceAttrs(hotGeo, [['iS', 4], ['iM', 4]], D.hot.length);
    for (let i = 0; i < D.hot.length; i++) {
      const h = D.hot[i], recency = Math.exp(-(tBase - h.last) / 7200);
      hA.iS.array.set([h.x, h.y, 0.8 + Math.log2(1 + h.n) * 0.5, Math.min(1.6, 0.35 + h.heat * 0.35)], i * 4);
      hA.iM.array.set([h.destroyed ? Math.min(1, h.destroyed / h.n + 0.4) : 0, M.seedOf(h.x + ',' + h.y), recency, 1], i * 4);
    }
    for (const k in hA) hA[k].needsUpdate = true;

    territoryTexture(D.systems, terrData); terrTex.needsUpdate = true;
    buildLabels();
    writeVis();
    if (dacState.lens.on) applyLens(); // the conquest recount follows the new data (task #55)
    statState.dirty = !!statState.name; // stat columns follow the new data
    dom.addr = dom.addr && D.sysByAddr.has(dom.addr) ? dom.addr : (dom.addr && emit('systemView', null), null); // a vanished dominant system
    // task #44 P2: the real page calls setData WITHOUT bodies, focusSystem (framed on a bodiless extent), THEN setData with
    // bodies. A camera still on its untouched focusSystem framing re-frames when the new data changes its fit distance.
    // (1 % tolerance: fitDist reads the current camera azimuth, so an hourly setData with the same bodies does not re-fly)
    if (dom.framed) { const fs = D.sysByAddr.get(dom.framed); if (fs && !(Math.abs(fitDist(fs) - dom.frameD) <= 0.01 * dom.frameD)) reframe(); }
    lastCam[0] = NaN;
    // intro fly-in once per mount: the flag lives in the closure, not in D (D is rebuilt on every hourly setData, and a
    // flag there flew the camera home under a zoomed-in user each hour - reviewer P2, 2026-11-06)
    if (!introDone) { introDone = true; if (!reduced && !fly.on) flyTo(HOME.x, HOME.y, HOME.dist, HOME.polar, 2.6); }
    return true;
  }

  // ------------------------------------------------------------ focusSystem framing + the dominant system (v10)
  // FRAMING (task #36, kept): the camera distance at which the WHOLE system - its outer orbit and starbase (world extent,
  // system.js) plus SV_FIT_PX for the body labels - fits inside the uncovered part of the canvas (insets) at SV_POLAR. A
  // circle is the same from every azimuth. Cached per system; cleared on resize / setInsets / setData.
  const SV_POLAR = 0.8, SV_FIT_PX = 26;
  const fitCam = new THREE.PerspectiveCamera(FOV, 1, 0.5, 2500), fitT = new THREE.Vector3(), fitS = new THREE.Spherical();
  const extentOf = (addr) => { const w = world.world, i = w && w.byAddr.get(addr); return i ? i.ext : M.systemExtent(0) * M.WORLD.K; };
  function fitDist(s) {
    let d = fitCache.get(s.a);
    if (d !== undefined) return d;
    const R = extentOf(s.a), th = (() => { v3.copy(camera.position).sub(controls.target); return sph.setFromVector3(v3).theta; })();
    fitCam.copy(camera); fitCam.near = Math.max(1e-5, controls.minDistance * NEAR_K); fitCam.updateProjectionMatrix();
    fitT.set(s.x, 0, -s.y);
    const x0 = insets.left + SV_FIT_PX, x1 = W - insets.right - SV_FIT_PX, y0 = insets.top + SV_FIT_PX, y1 = H - insets.bottom - SV_FIT_PX;
    const fits = (dd) => {
      fitS.set(dd, SV_POLAR, th); fitCam.position.setFromSpherical(fitS).add(fitT); fitCam.lookAt(fitT); fitCam.updateMatrixWorld();
      for (let k = 0; k < 48; k++) {
        const a = k / 48 * Math.PI * 2;
        v3.set(s.x + Math.cos(a) * R, 0, -(s.y + Math.sin(a) * R)).project(fitCam);
        const sx = (v3.x + 1) / 2 * W, sy = (1 - v3.y) / 2 * H;
        if (v3.z >= 1 || sx < x0 || sx > x1 || sy < y0 || sy > y1) return false;
      }
      return true;
    };
    let lo = controls.minDistance, hi = controls.maxDistance;
    if (x1 - x0 < 40 || y1 - y0 < 40 || !fits(hi)) d = hi;
    else if (fits(lo)) d = lo;
    else { for (let i = 0; i < 40; i++) { const mid = Math.sqrt(lo * hi); if (fits(mid)) hi = mid; else lo = mid; } d = hi; }
    fitCache.set(s.a, d);
    return d;
  }
  // after the uncovered area changes (setInsets / resize - e.g. the dock opening right after a deep link), a camera still
  // framed by focusSystem is re-framed so the system fits again; any user camera input ends the framing
  function reframe() {
    const a = dom.framed;
    if (!a || !D) return;
    const s = D.sysByAddr.get(a); if (!s) return;
    flyTo(s.x, s.y, fitDist(s), SV_POLAR, reduced ? 0 : 0.6);
    dom.framed = a; dom.frameD = fitDist(s);
  }
  // DOMINANT SYSTEM -> the 'systemView' event. Uses the LOD pass's screen data (world.lod): frac = the system extent's
  // diameter / the uncovered map's smaller side; dc = the uncovered map's centre's distance from the star, in extent radii.
  // Enter at frac >= DOM_IN with the map centre inside the system (dc <= 1; the smallest dc wins); the current one stays
  // while frac >= DOM_OUT and dc <= 1.25 - so zoomed deep into a system (its star off screen, the camera on its starbase)
  // it still dominates. A switch happens only when the current one no longer qualifies, so the event never flaps.
  function stepDominant() {
    const w = world.world; if (!w || !D) return;
    const x0 = insets.left, x1 = W - insets.right, y0 = insets.top, y1 = H - insets.bottom, side = Math.max(40, Math.min(x1 - x0, y1 - y0));
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    const frac = (info) => (info.on ? 2 * info.extPx / side : 0), dcOf = (info) => Math.hypot(info.sx - mx, info.sy - my) / Math.max(1e-6, info.extPx);
    // v11: close in on a tilted camera a system's CENTRE can fall behind the camera (lod: on = false, no screen position)
    // while the view is deep inside it. Such a system is judged in the WORLD: the orbit target within lim x its extent and
    // the camera no farther than the framing where frac would equal th (frac = ext H / (tan(FOV/2) dist side))
    const t = controls.target, camD = camera.position.distanceTo(t), kf = H / (Math.tan(FOV * Math.PI / 360) * side);
    const inWorld = (info, lim, th) => Math.hypot(t.x - info.s.x, -t.z - info.s.y) <= lim * info.ext && camD * th <= info.ext * kf;
    let keep = null;
    if (dom.addr) {
      const info = w.byAddr.get(dom.addr);
      if (info && (info.on ? frac(info) >= tun.domOut && dcOf(info) <= tun.dcOut : inWorld(info, tun.dcOut, tun.domOut))) keep = info;
    }
    if (!keep) {
      let bd = Infinity;
      for (const info of w.infos) {
        if (info.on) {
          if (frac(info) < tun.domIn) continue;
          const d = dcOf(info);
          if (d <= 1 && d < bd) { bd = d; keep = info; }
        } else if (inWorld(info, 1, tun.domIn)) { const d = Math.hypot(t.x - info.s.x, -t.z - info.s.y) / info.ext; if (d < bd) { bd = d; keep = info; } }
      }
    }
    dom.frac = keep ? frac(keep) : 0;
    const a = keep ? keep.s.a : null;
    if (a !== dom.addr) {
      dom.addr = a;
      emit('systemView', keep ? {sys: keep.s.a, name: keep.s.n} : null);
    }
  }
  // the picking context changed under a still pointer: drop the hover so a stale tooltip does not linger
  function dropHover() {
    if (hoverKey) { hoverKey = ''; canvas.style.cursor = ''; emit('hover', null); }
    world.setHover(null, null);
  }
  // ------------------------------------------------------------ label de-collision (task #50)
  // Greedy by priority: each label tries its spots in order (its default first, then the spot it held last time, so a
  // label does not hop while it has room, then the rest). A spot must lie in the open map (boxOpen: insets + avoid rects,
  // the same test the callouts use) and clear every label placed before it. A label with no spot fades out (CSS opacity
  // transition) - so a higher-priority label is never the one hidden by a lower one. Galaxy labels re-lay out on a
  // throttle (LBL_EVERY ms) while the camera moves and once when it settles; system-view labels (bodies orbit) on the
  // same throttle. Between two layouts a label keeps its spot and only moves with its anchor.
  const LBL_EVERY = 140, LBL_GAP = 1, LBL_FADE = 'opacity .22s ease-out';
  const lblPlaced = [];
  const lblHit = (x0, y0, x1, y1) => { for (const b of lblPlaced) if (x0 < b[2] + LBL_GAP && x1 > b[0] - LBL_GAP && y0 < b[3] + LBL_GAP && y1 > b[1] - LBL_GAP) return true; return false; };
  // items: [{prio, ord, w, h, spots: [[x0, y0], ...], cand}] -> it.cand = the chosen spot index or -1; it.hide =
  // '' | 'collide' (an open spot existed but every one was taken by a label of >= priority) | 'covered' (no open spot)
  function layoutLabels(items, seed) {
    items.sort((a, b) => b.prio - a.prio || a.ord - b.ord);
    lblPlaced.length = 0;
    if (seed) for (const b of seed) lblPlaced.push(b); // boxes already taken (task #56: the open orrery's labels)
    for (const it of items) {
      const n = it.spots.length, prev = it.cand;
      let got = -1, open = false;
      for (let t = -1; t < n && got < 0; t++) {
        const s = t < 0 ? 0 : t === 0 ? prev : t; // 0 (default), then the previous spot, then 1..n-1
        if (s == null || s < 0 || s >= n || (t > 0 && s === prev) || (t === 0 && s === 0)) continue;
        const x0 = it.spots[s][0], y0 = it.spots[s][1], x1 = x0 + it.w, y1 = y0 + it.h;
        if (!boxOpen(x0, y0, x1, y1)) continue;
        open = true;
        if (!lblHit(x0, y0, x1, y1)) got = s;
      }
      it.cand = got; it.hide = got >= 0 ? '' : open ? 'collide' : 'covered';
      if (got >= 0) lblPlaced.push([it.spots[got][0], it.spots[got][1], it.spots[got][0] + it.w, it.spots[got][1] + it.h]);
    }
  }
  // spots around an anchor (ax, ay) whose glyph / body has an on-screen radius r: above (default), below, right, left
  function aroundSpots(ax, ay, dx, dy, r, w, h, out) {
    // in place (no per-frame allocation): out = four [x0, y0] pairs
    const s = out.length === 4 ? out : (out.length = 0, out.push([0, 0], [0, 0], [0, 0], [0, 0]), out);
    s[0][0] = ax + dx - w / 2; s[0][1] = ay + dy - r - h;
    s[1][0] = ax + dx - w / 2; s[1][1] = ay + r + 5;
    s[2][0] = ax + r + 8; s[2][1] = ay - h / 2;
    s[3][0] = ax - r - 8 - w; s[3][1] = ay - h / 2;
    return out;
  }

  // ------------------------------------------------------------ labels (DOM)
  // System names: one per system (built on setData). Body and starbase labels: created lazily the first time their object
  // is big enough on screen (LBL_BODY_PX / LBL_SB_PX), hidden (faded) after. ONE de-collision layout for all of them, by
  // priority: hovered > the name of a system that fills the view (extent >= LBL_NEAR_PX) > its starbase > its bodies
  // (larger first, staked +5) > other system names (shown faction > dimmed, starbase level) > bodies of smaller systems.
  // Labels appear and go by screen size only (v10: no view mode).
  const LBL_BODY_PX = 5, LBL_SB_PX = 3, LBL_NEAR_PX = 110;
  const objLbl = new Map(); // key -> {el, key, kind, bi | si, prio, w, h, spots, cand, hide, on, seen, opW}
  let objLblActive = 0, lblPass = 0;
  function mkLabelEl(text, cls, size, color, extra) {
    const el = document.createElement('div');
    el.textContent = text; el.className = cls;
    el.style.cssText = `position:absolute;left:0;top:0;display:none;white-space:nowrap;font:600 ${size}px/1.2 "Segoe UI",system-ui,sans-serif;letter-spacing:.08em;`
      + `text-transform:uppercase;color:${color};text-shadow:0 0 6px #000,0 0 2px #000;will-change:transform;opacity:0;transition:${LBL_FADE};${extra || ''}`;
    labelLayer.appendChild(el);
    return el;
  }
  function buildLabels() {
    labelLayer.textContent = ''; objLbl.clear(); objLblActive = 0;
    const frag = document.createDocumentFragment();
    labelEls = D.systems.map((s, ord) => {
      const el = document.createElement('div');
      el.textContent = s.n || '';
      el.className = 'c4-sys-label';
      const hex = tintHex(s.f);
      el.style.cssText = 'position:absolute;left:0;top:0;display:none;white-space:nowrap;font:600 10px/1 "Segoe UI",system-ui,sans-serif;'
        + 'letter-spacing:.09em;text-transform:uppercase;color:#d8f4ff;text-shadow:0 0 6px ' + hex + ',0 0 2px #000;will-change:transform;'
        + 'border-left:2px solid ' + hex + ';padding-left:4px;opacity:0;transition:' + LBL_FADE;
      if ((s.lvl || 0) >= 5) { el.style.fontSize = '12px'; el.style.color = '#ffffff'; }
      frag.appendChild(el);
      return {el, s, si: ord, ord, shown: false, vis: false, w: 0, h: 0, spots: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], cand: undefined, hide: ''};
    });
    labelLayer.appendChild(frag);
    lastCam[0] = NaN;
  }
  // the text of a body's label (miners / stakes from the world's placement)
  function bodyText(bi) {
    const w = world.world, b = w.bodyAt[bi], info = w.infos[b.si], L = b.L;
    const t = L.b.k === 'asteroid' ? 'asteroid' : (L.b.sub || 'planet').replace('-', ' ');
    const miners = b.work ? b.work.n : 0, st = info.stakeN.get(bi) || 0;
    return `${L.b.n} - ${t}${miners ? ' - ' + miners + ' mining' : ''}${st ? ' - ' + st + ' stake' + (st > 1 ? 's' : '') : ''}`;
  }
  function objLabel(key, make) {
    let L = objLbl.get(key);
    if (!L) { L = make(); L.key = key; L.spots = []; L.cand = undefined; L.hide = ''; L.on = false; L.w = 0; L.h = 0; L.ord = 100000 + objLbl.size; objLbl.set(key, L); }
    return L;
  }
  let lblAt = 0, lblPending = false;
  const galLblItems = [], bp = [0, 0];
  function updateLabels(dist, relayout) {
    labelLayer.style.display = layers.labels ? '' : 'none';
    if (!layers.labels || !D) return;
    const w = world.world;
    if (relayout) galLblItems.length = 0;
    lblPass++;
    for (const L of labelEls) {
      const lvl = L.s.lvl || 0, info = w && w.infos[L.si];
      const range = lvl >= 5 ? 400 : lvl >= 2 ? 110 : lvl >= 1 ? 58 : 30;
      let show = layers.systems && dist < range && info && info.ppu > 0;
      if (show) {
        const sx = info.sx, sy = info.sy;
        show = info.on && sx > -0.025 * W && sx < 1.025 * W && sy > -0.025 * H && sy < 1.025 * H;
        if (show) {
          if (!L.shown) { L.el.style.display = 'block'; L.shown = true; }
          if (!L.w) { L.w = L.el.offsetWidth; L.h = L.el.offsetHeight; }
          // offsets grow with the star's own disc on screen, so a close star never sits under its name
          const r = Math.max(0, info.starR * info.ppu * 1.1), w = L.w, h = L.h, sp = L.spots;
          sp[0][0] = sx + 9 + r; sp[0][1] = sy - 5; sp[1][0] = sx - 9 - r - w; sp[1][1] = sy - 5;
          sp[2][0] = sx + 5; sp[2][1] = sy - 8 - r - h; sp[3][0] = sx + 5; sp[3][1] = sy + 6 + r;
          sp[4][0] = sx - 5 - w; sp[4][1] = sy - 8 - r - h; sp[5][0] = sx - 5 - w; sp[5][1] = sy + 6 + r;
          const dimmed = M.systemDimmed(L.s.f, filter.faction);
          L.op = (dimmed ? 0.25 : 0.88) * Math.min(1, (range - dist) / (range * 0.25));
          L.prio = (hoverKey === 'system:' + L.s.a ? 1000 : 0) + (info.extPx >= LBL_NEAR_PX ? 400 : 0) + (dimmed ? 0 : 100) + lvl * 10;
          if (relayout) galLblItems.push(L);
        }
      }
      if (!show && L.shown) { L.el.style.display = 'none'; L.shown = false; L.vis = false; L.cand = undefined; L.el.style.opacity = L.opW = '0'; }
    }
    // bodies and starbases, by their own size on screen
    objLblActive = 0;
    if (w) for (const info of w.infos) {
      if (!info.on || info.extPx < 24) continue;
      const near = info.extPx >= LBL_NEAR_PX ? 200 : 0;
      if (layers.systems && info.sbHalf * info.ppu >= LBL_SB_PX) {
        const L = objLabel('sb:' + info.s.a, () => ({kind: 'sb', si: info.si, el: mkLabelEl(`starbase lvl ${info.s.lvl || 0} - ${info.members ? info.members.docked.length : 0} docked`, 'c4-body-label', 10, M.FACTION_HEX[M.factionKey(info.s.f)])}));
        v3.set(info.s.x + info.sb[0], 0, -(info.s.y + info.sb[1])).project(camera);
        L.ax = (v3.x + 1) / 2 * W; L.ay = (1 - v3.y) / 2 * H; L.r = info.sbHalf * info.ppu; L.prio = 90 + near; L.seen = lblPass;
      }
      for (let bi = info.b0; bi < info.b0 + info.nb; bi++) {
        const b = w.bodyAt[bi], rpx = b.R * info.ppu;
        if (rpx < LBL_BODY_PX) continue;
        const L = objLabel('body:' + b.L.b.a, () => ({kind: 'body', bi, el: mkLabelEl(bodyText(bi), 'c4-body-label', 10, '#cfe8f2')}));
        world.bodyPos(bi, U.uAnim.value, bp);
        v3.set(bp[0], 0, -bp[1]).project(camera);
        if (v3.z >= 1) continue;
        L.ax = (v3.x + 1) / 2 * W; L.ay = (1 - v3.y) / 2 * H; L.r = rpx; L.seen = lblPass;
        L.prio = (b.L.b.k === 'asteroid' ? 30 : 50) + Math.min(9, Math.round((b.L.size || 0) * 20)) + ((info.stakeN.get(bi) || 0) ? 5 : 0) + near;
      }
    }
    for (const L of objLbl.values()) {
      if (L.seen !== lblPass) { if (L.on) { L.on = false; L.el.style.display = 'none'; L.cand = undefined; L.opW = '0'; L.el.style.opacity = '0'; } continue; }
      if (!L.on) { L.el.style.display = 'block'; L.on = true; }
      if (!L.w) { L.w = L.el.offsetWidth; L.h = L.el.offsetHeight; if (!L.w) continue; }
      aroundSpots(L.ax, L.ay, L.kind === 'sb' ? 14 : 0, L.kind === 'sb' ? -4 : -6, L.r, L.w, L.h, L.spots);
      objLblActive++;
      if (hoverKey && L.key === hoverKey) L.prio += 1000;
      if (relayout) galLblItems.push(L);
    }
    if (relayout) {
      lblAt = performance.now();
      layoutLabels(galLblItems);
    }
    for (const L of labelEls) {
      if (!L.shown) continue;
      L.vis = L.cand != null && L.cand >= 0;
      const sp = L.spots[L.vis ? L.cand : 0];
      L.el.style.transform = `translate(${sp[0].toFixed(1)}px,${sp[1].toFixed(1)}px)`;
      L.x0 = sp[0]; L.y0 = sp[1]; // the label box's top-left (callouts avoid covering it - task #44)
      const op = L.vis ? L.op.toFixed(2) : '0';
      if (L.opW !== op) { L.el.style.opacity = op; L.opW = op; } // DOM writes only on change (frame budget)
      if (L.prioW !== L.prio) { L.prioW = L.prio; L.el.dataset.prio = String(L.prio); }
      if (L.hideW !== (L.hide || '')) { L.hideW = L.hide || ''; L.el.dataset.hide = L.hideW; }
    }
    for (const L of objLbl.values()) {
      if (!L.on || !L.w) continue;
      const vis = L.cand != null && L.cand >= 0, sp = L.spots[vis ? L.cand : 0];
      L.el.style.transform = `translate(${sp[0].toFixed(1)}px,${sp[1].toFixed(1)}px)`;
      const op = vis ? '1' : '0';
      if (L.opW !== op) { L.el.style.opacity = op; L.opW = op; }
      if (L.prioW !== L.prio) { L.prioW = L.prio; L.el.dataset.prio = String(L.prio); }
      if (L.hideW !== (L.hide || '')) { L.hideW = L.hide || ''; L.el.dataset.hide = L.hideW; }
    }
  }

  // ------------------------------------------------------------ in-map stats (task #32, setStatLayer)
  const STAT_HOT = [1.0, 0.32, 0.08], STAT_CALLOUTS = 6;
  // a DAC column carries its own (sanitised) hex; the rest are coloured by faction / heat
  const statColour = (c) => (c.hex ? M.hexToLinear(c.hex) : c.fa === 'hot' ? STAT_HOT : M.FACTION_COLOR[M.factionKey(c.fa)]);
  const statHex = (c) => (c.hex ? c.hex : c.fa === 'hot' ? '#ff7a3c' : M.FACTION_HEX[M.factionKey(c.fa)]);
  // DAC halos (task #53): written for the 'dacs' layer, hidden otherwise
  function writeDacHalos(halos) {
    dacState.halos = halos;
    const A = instanceAttrs(dacGeo, [['iS', 4], ['iC', 3], ['iM', 4]], halos.length);
    halos.forEach((h, i) => {
      A.iS.array.set([h.x, h.y, DAC_R0 + DAC_R1 * Math.sqrt(h.wmax ? h.w / h.wmax : 0), 0], i * 4);
      A.iC.array.set(M.hexToLinear(h.hex), i * 3);
      A.iM.array.set([h.share * (h.dim ? DAC_DIM : 1), 0, 0, 0], i * 4);
    });
    for (const k in A) A[k].needsUpdate = true;
    dacHalos.visible = halos.length > 0;
  }
  function buildStats() {
    statState.dirty = false;
    statLayer.textContent = ''; statState.callouts = []; dacState.mark = null; dacState.markBox = null; dacState.mw = 0;
    const name = statState.name;
    let cols;
    if (name === 'dacs' && dacState.conq) {
      // the conquest lens leads (task #55): columns / callouts at the won systems, no influence halos (the conquest
      // field IS the territory)
      cols = M.conquestColumns(dacState.conq, dacState.dacs); writeDacHalos([]);
    } else if (name === 'dacs') {
      const L = D ? M.dacLayer(D.latest, dacState.dacs, dacState.focus) : {cols: [], halos: []};
      cols = L.cols; writeDacHalos(L.halos);
    } else {
      cols = name && D ? M.statColumns(name, D.latest, D.events, {owner: filter.owner, faction: filter.faction}) : [];
      if (dacHalos.visible || dacState.halos.length) writeDacHalos([]);
    }
    statState.cols = cols;
    statState.vmax = cols.reduce((v, c) => Math.max(v, c.v), 0);
    const A = instanceAttrs(statGeo, [['iS', 4], ['iC', 3], ['iM', 4]], cols.length);
    cols.forEach((c, i) => {
      const h = M.statHeight(c.v, statState.vmax), share = statState.vmax ? c.v / statState.vmax : 0;
      A.iS.array.set([c.x, c.y, h, 0.75 + 0.5 * Math.sqrt(share)], i * 4);
      A.iC.array.set(statColour(c), i * 3);
      A.iM.array.set([1, M.seedOf(c.key), share, c.fa === 'hot' ? 1 : 0], i * 4);
      c.h = h;
    });
    for (const k in A) A[k].needsUpdate = true;
    statCols.visible = statDisc.visible = cols.length > 0;
    // the stats lead: territory steps back while columns stand (further for DACs: their colours ARE the territory there)
    terrU.uTerrStat.value = cols.length ? (name === 'dacs' ? DAC_TERR_DIM : TERR_STAT_DIM) : 1;
    statState.colSys = new Set(cols.map((c) => c.sys).filter(Boolean));
    writeMineVis(); // no turning mining ring where a column stands (task #38)
    // callouts for the top rows: HTML (textContent only - names are chain data), clickable when they name a system
    const frag = document.createDocumentFragment();
    // HIERARCHY (task #44): rank 1 is the largest and brightest (name / value size, accent bar, glow, leader weight), rank
    // 6 the smallest and dimmest; house style = the panels' glass, Orbitron names, Rajdhani values, the tab's accent
    cols.filter((c) => c.callout !== false).slice(0, STAT_CALLOUTS).forEach((c, rank) => { // callout:false - a conquest column that is not its DAC's lead (#55)
      const hex = statHex(c), t = rank / (STAT_CALLOUTS - 1), lw = rank === 0 ? 2 : rank < 3 ? 1.5 : 1, dotR = Math.round(4 - 1.2 * t);
      const line = document.createElement('div'), dot = document.createElement('div'), el = document.createElement('div');
      line.style.cssText = `position:absolute;left:0;top:${-lw / 2}px;height:${lw}px;transform-origin:0 50%;background:linear-gradient(90deg,${hex},${hex}66);`
        + `box-shadow:0 0 ${Math.round(9 - 6 * t)}px ${hex};opacity:${(1 - 0.3 * t).toFixed(2)};will-change:transform`;
      dot.style.cssText = `position:absolute;left:${-dotR}px;top:${-dotR}px;width:${dotR * 2}px;height:${dotR * 2}px;border-radius:50%;background:${hex};box-shadow:0 0 ${Math.round(12 - 6 * t)}px ${hex},0 0 2px #fff;will-change:transform`;
      el.className = 'c4-stat-callout';
      el.dataset.rank = String(rank + 1);
      el.style.cssText = `position:absolute;left:0;top:0;white-space:nowrap;padding:${rank === 0 ? '6px 12px 7px 11px' : '4px 9px 5px 8px'};border-left:${Math.round(4 - 2 * t)}px solid ${hex};`
        + `border-radius:0 6px 6px 0;border-top:1px solid ${hex}${rank === 0 ? '55' : '2a'};border-right:1px solid ${hex}${rank === 0 ? '33' : '1a'};border-bottom:1px solid rgba(0,0,0,.4);`
        + `background:linear-gradient(90deg,rgba(6,10,22,${rank === 0 ? '.92' : '.86'}),rgba(6,10,22,.62));backdrop-filter:blur(6px) saturate(140%);-webkit-backdrop-filter:blur(6px) saturate(140%);`
        + `color:#e8f8ff;text-shadow:0 0 6px #000;box-shadow:0 0 ${Math.round(24 - 16 * t)}px ${hex}${rank === 0 ? '66' : rank < 3 ? '40' : '24'},0 4px 14px rgba(0,0,0,.45);`
        // every callout takes the pointer and is clickable: a system one opens its system, a deep-space one (task #50)
        // emits pick {type:'point', x, y, source:'callout'} and flies there itself
        + `opacity:${(1 - 0.2 * t).toFixed(2)};will-change:transform;pointer-events:auto;cursor:pointer`;
      const nm = document.createElement('div'); nm.textContent = c.name.toUpperCase();
      nm.style.cssText = `font:${rank === 0 ? 700 : 600} ${(12.5 - 2.5 * t).toFixed(1)}px/1.25 Orbitron,"Segoe UI",system-ui,sans-serif;letter-spacing:.08em;color:#fff`;
      const vl = document.createElement('div'); vl.textContent = c.line;
      vl.style.cssText = `font:${rank < 3 ? 700 : 600} ${(17 - 5 * t).toFixed(1)}px/1.2 Rajdhani,"Segoe UI",system-ui,sans-serif;color:${hex};letter-spacing:.03em;`
        + (rank === 0 ? `text-shadow:0 0 10px ${hex}88,0 0 4px #000` : '');
      el.append(nm, vl);
      if (c.sys) {
        el.dataset.sys = c.sys;
        el.addEventListener('pointerdown', (e) => e.stopPropagation());
        el.addEventListener('click', (e) => { e.stopPropagation(); emit('pick', {type: 'system', id: c.sys, source: 'callout'}); });
      } else if (Number.isFinite(c.x) && Number.isFinite(c.y)) {
        el.dataset.point = c.x + ',' + c.y;
        el.addEventListener('pointerdown', (e) => e.stopPropagation());
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          emit('pick', {type: 'point', x: c.x, y: c.y, source: 'callout'});
          api.focusPoint(c.x, c.y, CALLOUT_POINT_ZOOM); // works before the panels route the new pick type (same target if they do)
        });
      }
      frag.append(line, dot, el);
      statState.callouts.push({c, el, line, dot, w: 0, h: 0, rank});
    });
    // EXAMPLE watermark (task #53): the DAC layer is showing the preview membership, not real DACs
    if (name === 'dacs' && dacState.example && cols.length) {
      const mk = document.createElement('div');
      mk.className = 'c4-dac-example-mark';
      mk.textContent = 'EXAMPLE';
      mk.style.cssText = 'position:absolute;left:0;top:0;white-space:nowrap;pointer-events:none;font:700 22px/1 Orbitron,"Segoe UI",system-ui,sans-serif;'
        + 'letter-spacing:.42em;color:rgba(232,248,255,.16);text-shadow:0 0 12px rgba(0,0,0,.6);will-change:transform';
      frag.append(mk);
      dacState.mark = mk;
    }
    statLayer.appendChild(frag);
    // web fonts (Orbitron / Rajdhani) can land after the first measure: re-measure the boxes once they are ready
    if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(() => { for (const o of statState.callouts) o.w = 0; dacState.mw = 0; lastCam[0] = NaN; });
    lastCam[0] = NaN;
  }
  const placed = [];
  const CALLOUT_RINGS = [60, 90, 125, 165, 210, 260, 320, 390], CALLOUT_OFF = 120;
  const CALLOUT_DIRS = [-40, -140, 40, 140, -90, 90, 0, 180, -65, -115, 65, 115, -15, -165, 15, 165].map((d) => d * Math.PI / 180);
  function updateStats(dist) {
    if (statState.dirty) buildStats();
    const k = Math.min(1.3, Math.max(0.3, dist / 90));
    statU.uStatH.value = k; statU.uStatW.value = STAT_W * Math.min(1.6, Math.max(0.35, dist / 100));
    dacU.uHaloK.value = Math.min(3.2, Math.max(1, dist / 40));
    // no column shorter than STAT_MIN_PX on screen (task #50): px per unit at the target, times the foreshortening of a
    // vertical segment seen from this camera (sqrt(1 - viewDir.y^2))
    v3.subVectors(controls.target, camera.position).normalize();
    statU.uMinH.value = STAT_MIN_PX / (pxPerUnitAt(dist) * Math.max(0.2, Math.sqrt(1 - v3.y * v3.y)));
    const show = !!statState.callouts.length && U.uGal.value > 0.05;
    statLayer.style.display = show ? '' : 'none';
    if (!show) return;
    statLayer.style.opacity = U.uGal.value < 0.999 ? U.uGal.value.toFixed(2) : '';
    placed.length = 0;
    // visible system label boxes (task #44: a callout must not cover them - "MANUMIS WINDOW" read "ANUMIS / NDOW")
    const labs = [];
    if (labelLayer.style.display !== 'none') for (const L of labelEls) {
      if (!L.vis || L.x0 === undefined) continue; // only labels the de-collision shows (task #50)
      if (!L.w) { L.w = L.el.offsetWidth; L.h = L.el.offsetHeight; }
      if (L.w) labs.push([L.x0, L.y0, L.x0 + L.w, L.y0 + L.h, L.w * L.h]);
    }
    // the largest share of any visible label that the box covers (0..1)
    const labCover = (x0, y0, x1, y1) => {
      let m = 0;
      for (const l of labs) {
        const ox = Math.min(x1, l[2]) - Math.max(x0, l[0]), oy = Math.min(y1, l[3]) - Math.max(y0, l[1]);
        if (ox > 0 && oy > 0) m = Math.max(m, ox * oy / l[4]);
      }
      return m;
    };
    for (const o of statState.callouts) {
      v3.set(o.c.x, STAT_BASE_Y + statTopH(o.c), -o.c.y).project(camera);
      const px0 = (v3.x + 1) / 2 * W, py0 = (1 - v3.y) / 2 * H;
      // a column top just past the canvas edge (<= CALLOUT_OFF px, e.g. Evernat at 1280x720 home) is anchored at the edge
      const onCanvas = v3.z < 1 && px0 >= -CALLOUT_OFF && px0 <= W + CALLOUT_OFF && py0 >= -CALLOUT_OFF && py0 <= H + CALLOUT_OFF;
      o.vis = false; o.under = false;
      // the open system's column is hidden under its orrery (uHideAt): its callout goes too (task #56)
      if (!onCanvas) { o.el.style.display = o.line.style.display = o.dot.style.display = 'none'; continue; }
      const ax = Math.min(W, Math.max(0, px0)), ay = Math.min(H, Math.max(0, py0));
      o.el.style.display = '';
      if (!o.w) { o.w = o.el.offsetWidth; o.h = o.el.offsetHeight; }
      const w = o.w, h = o.h, under = ax !== px0 || ay !== py0 || covered(ax, ay);
      // spot search (task #38, extended #44): the eight near spots first (up-right, up-left, down-right, down-left, then
      // further out), then rings of 16 directions out to 390 px. A spot must lie in the open map (insets AND avoid rects)
      // and clear of every callout already placed (higher rank first). Pass 1 also wants every visible system label
      // covered by <= 3 %; pass 2 takes the spot covering the least label. An anchor under the HUD / dock still gets a
      // label in the open map (a longer leader, the marker at the HUD edge). Hidden only when no spot exists at all.
      const cand = [[ax + 22, ay - 30 - h], [ax - 22 - w, ay - 30 - h], [ax + 22, ay + 16], [ax - 22 - w, ay + 16],
        [ax + 34, ay - 64 - h], [ax - 34 - w, ay - 64 - h], [ax + 34, ay + 50], [ax - 34 - w, ay + 50]];
      for (const R of CALLOUT_RINGS) for (const dg of CALLOUT_DIRS) {
        const c = Math.cos(dg), px = ax + R * c, py = ay + R * Math.sin(dg);
        cand.push([c >= 0 ? px : px - w, py - h / 2]);
      }
      let pick = null, best = null, bestCov = Infinity;
      for (const [x0, y0] of cand) {
        if (!boxOpen(x0, y0, x0 + w, y0 + h)) continue;
        if (placed.some((r) => x0 < r[2] && x0 + w > r[0] && y0 < r[3] && y0 + h > r[1])) continue;
        const cov = labCover(x0, y0, x0 + w, y0 + h);
        if (cov <= 0.03) { pick = [x0, y0]; break; }
        if (cov < bestCov) { bestCov = cov; best = [x0, y0]; }
      }
      pick = pick || best;
      if (!pick) { o.el.style.display = o.line.style.display = o.dot.style.display = 'none'; continue; }
      o.line.style.display = o.dot.style.display = '';
      o.vis = true; o.under = under;
      const [x0, y0] = pick;
      placed.push([x0 - 4, y0 - 4, x0 + w + 4, y0 + h + 4]);
      o.el.style.transform = `translate(${x0.toFixed(1)}px,${y0.toFixed(1)}px)`;
      // leader: anchor -> the label's nearest vertical edge, at its middle. An anchor under the HUD / dock: the marker and
      // the leader start where that segment leaves the covered area (first open point, 2 px steps)
      const ex = x0 + w / 2 >= ax ? x0 : x0 + w, ey = y0 + h / 2;
      let sx = ax, sy = ay;
      if (under) {
        const L0 = Math.hypot(ex - ax, ey - ay), n = Math.max(1, Math.ceil(L0 / 2));
        for (let i = 1; i <= n; i++) { sx = ax + (ex - ax) * i / n; sy = ay + (ey - ay) * i / n; if (!covered(sx, sy)) break; }
      }
      o.mx = sx; o.my = sy;
      o.dot.style.transform = `translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px)`;
      const len = Math.hypot(ex - sx, ey - sy), ang = Math.atan2(ey - sy, ex - sx);
      o.line.style.width = len.toFixed(1) + 'px';
      o.line.style.transform = `translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px) rotate(${ang.toFixed(4)}rad)`;
    }
    // EXAMPLE watermark: a corner of the open map (bottom-left first), inside the insets, clear of the avoid rects and of
    // every placed callout; hidden when no corner is free
    const mk = dacState.mark;
    if (mk) {
      if (!dacState.mw) { mk.style.display = ''; dacState.mw = mk.offsetWidth; dacState.mh = mk.offsetHeight; }
      const w = dacState.mw, h = dacState.mh, m = 18, l = insets.left + m, r = W - insets.right - m - w, t = insets.top + m, b = H - insets.bottom - m - h;
      const spot = [[l, b], [r, b], [l, t], [r, t], [(l + r) / 2, b], [(l + r) / 2, t]]
        .find(([x0, y0]) => boxOpen(x0, y0, x0 + w, y0 + h) && !placed.some((q) => x0 < q[2] && x0 + w > q[0] && y0 < q[3] && y0 + h > q[1]));
      dacState.markBox = spot ? {left: spot[0], top: spot[1], right: spot[0] + w, bottom: spot[1] + h} : null;
      mk.style.display = spot ? '' : 'none';
      if (spot) mk.style.transform = `translate(${spot[0].toFixed(1)}px,${spot[1].toFixed(1)}px)`;
    }
  }

  // ------------------------------------------------------------ picking (screen space, same math as the shaders)
  // where fleet i is drawn now (map coords): a placed fleet by model.js placeMember (= GLSL place()), else the galaxy rule
  const plOut = [0, 0, 0, 0];
  function fleetNow(i, out) {
    const pl = D.place && D.place[i];
    if (pl) { M.placeMember(pl.A, pl.O, D.seeds[i], U.uAnim.value, plOut); out[0] = pl.A[0] + plOut[0]; out[1] = pl.A[1] + plOut[1]; return out; }
    const p = D.paths[i], k = D.kinds[i];
    if (p.moving && (k === 3 || k === 4)) return M.fleetPos(p, clock(), out);
    const a = D.anchors[i];
    out[0] = a[0]; out[1] = a[1]; return out;
  }
  // projected hull quad length in px, the SAME formula as FLEET_VS (this hull's own view depth)
  const vW = new THREE.Vector3();
  const hullPxAt = (x, y, half) => { vW.set(x, 0, -y).applyMatrix4(camera.matrixWorldInverse); return half * 2 * camera.projectionMatrix.elements[5] * 0.5 * H / Math.max(1e-9, -vW.z); };
  function toScreen(x, y, h) {
    v3.set(x, h, -y).project(camera);
    return v3.z < 1 ? [(v3.x + 1) / 2 * W, (1 - v3.y) / 2 * H] : null;
  }
  const BODY_PICK_PX = (BODY_PX[0] + BODY_PX[1]) / 2, SB_PICK_PX = (SB_PX[0] + SB_PX[1]) / 2;
  // What is under the cursor, at every scale (v10): a drawn hull within 4 px of its centre wins; then a body (inside its
  // drawn disc) or a starbase; otherwise the nearest of a hull (bias 3 px), a mined asteroid's galaxy marker (bias 1, only
  // while its body is not drawn) and a star / system glyph (radius max(10 px, the star's disc)).
  function pickAt(cx, cy) {
    if (!D) return null;
    const mx = cx - rect.left, my = cy - rect.top, w = world.world, anim = U.uAnim.value;
    let fleet = -1, fd = Infinity;
    if (layers.fleets) {
      for (let i = 0; i < D.fleets.length; i++) {
        if (D.vis[i] < 0.5 || shownVis(i) < 0.5) continue;
        fleetNow(i, pos2);
        const hullPx = hullPxAt(pos2[0], pos2[1], M.SHIP_BASE.galaxy * M.sizeScale(D.fleets[i].flagSize) * M.focusScale(D.vis[i]));
        if (hullPx < M.HULL_PX.collapse) continue; // not drawn (this hull's own depth, focus factor incl.) = not pickable
        const s = toScreen(pos2[0], pos2[1], 0); if (!s) continue;
        const d = Math.hypot(s[0] - mx, s[1] - my);
        if (d <= Math.max(6, hullPx * 0.6) && d < fd) { fd = d; fleet = i; }
      }
    }
    let hit = null, hd = Infinity, sys = null, sysD = Infinity;
    if (w && layers.systems) for (const info of w.infos) {
      if (!info.on || info.ppu <= 0) continue;
      const dc = Math.hypot(info.sx - mx, info.sy - my);
      if (dc > info.extPx + 16 && dc > 12) continue;
      for (let bi = info.b0; bi < info.b0 + info.nb; bi++) {
        const b = w.bodyAt[bi], rpx = b.R * info.ppu;
        if (rpx < BODY_PICK_PX) continue;
        world.bodyPos(bi, anim, bp);
        const s = toScreen(bp[0], bp[1], 0); if (!s) continue;
        const d = Math.hypot(s[0] - mx, s[1] - my);
        if (d <= Math.max(6, rpx * (b.kind === 1 ? 1.2 : 1.05)) && d < hd) { hd = d; hit = {type: 'body', bi}; }
      }
      const spx = info.sbHalf * info.ppu;
      if (spx >= SB_PICK_PX) {
        const s = toScreen(info.s.x + info.sb[0], info.s.y + info.sb[1], 0);
        const d = s ? Math.hypot(s[0] - mx, s[1] - my) : Infinity;
        if (d <= Math.max(8, spx * 1.1) && d < hd) { hd = d; hit = {type: 'sb', info}; }
      }
      const starPx = info.starR * info.ppu;
      if (dc <= Math.max(10, starPx * 1.1) && dc < sysD) { sysD = dc; sys = info; }
    }
    const fleetPick = () => {
      const f = D.fleets[fleet], hull = shipAtlas ? M.hullLabel(shipAtlas, f.flag, f.flagSize) : ''; // hull model or "generic <class> hull"
      return {type: 'fleet', id: f.a, ownerProfile: f.o, label: M.fleetLabel(f) + (hull ? ' - ' + hull : '')};
    };
    if (hit) {
      if (fleet >= 0 && fd <= 4) return fleetPick();
      if (hit.type === 'body') {
        const b = w.bodyAt[hit.bi], info = w.infos[b.si];
        return {type: 'body', id: b.L.b.a, sys: b.L.b.sys, j: hit.bi, label: M.bodyLabel(b.L.b, b.work ? b.work.n : 0, info.stakeN.get(hit.bi) || 0)};
      }
      const s = hit.info.s;
      return {type: 'system', id: s.a, sb: hit.info.si, label: `${s.n} starbase - ${M.factionKey(s.f)} lvl ${s.lvl || 0} - ${hit.info.members ? hit.info.members.docked.length : 0} fleets docked`};
    }
    let best = null, bestD = Infinity;
    if (fleet >= 0 && fd - 3 < bestD) { bestD = fd - 3; best = 'fleet'; }
    let ast = -1;
    if (layers.mining) for (let i = 0; i < D.asteroids.length; i++) {
      const a = D.asteroids[i], bi = w ? w.bodyIdx.get(a.a) : undefined;
      if (bi != null && w.bodyAt[bi].R * w.infos[w.bodyAt[bi].si].ppu >= BODY_PICK_PX) continue; // its body is drawn: picked as the body
      const s = toScreen(a.x, a.y, 0); if (!s) continue;
      // v11: a marker inside the system glyph under the cursor is not pickable - at galaxy scale the system wins
      if (sys && Math.hypot(s[0] - sys.sx, s[1] - sys.sy) <= Math.max(10, sys.starR * sys.ppu * 1.1)) continue;
      const d = Math.hypot(s[0] - mx, s[1] - my);
      if (d <= 12 && d - 1 < bestD) { bestD = d - 1; best = 'asteroid'; ast = i; }
    }
    if (sys && sysD < bestD) { bestD = sysD; best = 'system'; }
    if (best === 'fleet') return fleetPick();
    if (best === 'asteroid') { const a = D.asteroids[ast]; return {type: 'asteroid', id: a.a, label: M.asteroidLabel(a)}; }
    if (best === 'system') {
      const s = sys.s, starDrawn = sys.starR * sys.ppu >= STAR_PX[0];
      return {type: 'system', id: s.a, label: starDrawn ? `${s.n} - star - ${sys.nb} bodies (orbit layout stylised: the chain has no in-system positions)` : M.systemLabel(s)};
    }
    return null;
  }
  let hoverPending = null, hoverKey = '', downAt = null;
  // a pointer moving over the map is a user reading it: hold off the idle auto-orbit (task #30 - 12 s after a deep link
  // the camera began orbiting under a hover sweep and carried the bodies out from under the pointer)
  // touch pinch (task #38 P3-5): with two touches down the entry gate sits on their MIDPOINT, the same rule as the wheel
  const touches = new Map();
  const trackTouch = (e, up) => {
    if (e.pointerType !== 'touch') return;
    if (up) { touches.delete(e.pointerId); return; }
    touches.set(e.pointerId, [e.clientX, e.clientY]);
    if (touches.size >= 2) {
      const [a, b] = touches.values();
      lastPointer.x = (a[0] + b[0]) / 2; lastPointer.y = (a[1] + b[1]) / 2; lastPointer.on = true;
    }
  };
  const onMove = (e) => { hoverPending = {x: e.clientX, y: e.clientY}; lastPointer.x = e.clientX; lastPointer.y = e.clientY; lastPointer.on = true; lastInteract = performance.now(); trackTouch(e); };
  const onCancel = (e) => trackTouch(e, true);
  const onLeave = () => { hoverPending = null; lastPointer.on = false; if (hoverKey) { hoverKey = ''; canvas.style.cursor = ''; emit('hover', null); } };
  const onDown = (e) => { downAt = {x: e.clientX, y: e.clientY, b: e.button}; lastInteract = performance.now(); trackTouch(e); };
  const onUp = (e) => {
    trackTouch(e, true);
    if (!downAt || downAt.b !== 0 || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 5) { downAt = null; return; }
    downAt = null;
    const p = pickAt(e.clientX, e.clientY);
    if (p) emit('pick', p.type === 'fleet' ? {type: p.type, id: p.id, ownerProfile: p.ownerProfile}
      : p.type === 'body' ? {type: 'body', id: p.id, sys: p.sys} : {type: p.type, id: p.id});
  };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);
  function serviceHover() {
    if (!hoverPending) return;
    const {x, y} = hoverPending; hoverPending = null;
    const p = pickAt(x, y);
    const key = p ? p.type + ':' + p.id : '';
    canvas.style.cursor = p ? 'pointer' : '';
    world.setHover(p && p.type === 'body' ? p.j : null, p && p.sb != null ? p.sb : null);
    if (p) emit('hover', {type: p.type, id: p.id, label: p.label, ownerProfile: p.ownerProfile, sys: p.sys, clientX: x, clientY: y});
    else if (hoverKey) emit('hover', null);
    hoverKey = key;
  }

  // ------------------------------------------------------------ loop
  let raf = 0, lastTs = 0, running = false, disposed = false, galSeen = 1;
  const stats = {fps: 0, frameMs: 0, frames: 0, acc: 0, n: 0, slow: 0, cpuAcc: 0, cpuMs: 0};
  const lodS = (a, b, x) => smooth(Math.log2(a), Math.log2(b), Math.log2(Math.max(x, 1e-6))); // = GLSL lodS (system.js, v11)
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  function frame(ts) {
    raf = requestAnimationFrame(frame);
    const c0 = performance.now();
    const dt = lastTs ? Math.min(0.1, Math.max(0, (ts - lastTs) / 1000)) : 0;
    lastTs = ts;
    U.uTime.value += dt;
    if (!reduced) U.uAnim.value += dt;
    U.uNow.value = D ? clock() - D.tBase : 0;
    if (fly.on) { stepFly(dt); lastInteract = performance.now(); } // idle timer restarts when a fly ENDS (reviewer P3)
    else {
      stepWheel(dt);
      // the idle auto-orbit only at galaxy scale (v10: never once zoomed in past AUTO_MIN_DIST - owner: the camera
      // swinging round a system read as "looking at a surrounding")
      controls.autoRotate = !reduced && camera.position.distanceTo(controls.target) > AUTO_MIN_DIST && performance.now() - lastInteract > 12000;
      controls.update(dt);
    }
    const t = controls.target;
    if (Math.abs(t.x) > 70 || Math.abs(t.z) > 70) { t.x = Math.max(-70, Math.min(70, t.x)); t.z = Math.max(-70, Math.min(70, t.z)); }
    camera.updateMatrixWorld();
    const dist = camera.position.distanceTo(t);
    // near plane follows the distance (v10): no clipping at the closest zoom, depth precision kept at every scale
    const nearW = Math.max(1e-6, dist * tun.nearK);
    if (Math.abs(camera.near - nearW) > nearW * 0.02) { camera.near = nearW; applyViewOffset(); }
    U.uZoom.value = Math.min(1.5, Math.max(0.5, dist / 110));
    U.uSysZoom.value = Math.min(2.0, Math.max(0.6, dist / 85));
    U.uGlyphK.value = Math.min(1, dist / GLYPH_D0);
    U.uGal.value = lodS(MARK_NEAR, MARK_FAR, dist); // galaxy-level markers fade by LOG camera distance (v11), never by a mode
    const e = camera.matrixWorld.elements;
    let moved = false;
    for (let i = 0; i < 16; i++) if (lastCam[i] !== e[i]) { moved = true; lastCam[i] = e[i]; }
    if (moved && D) { world.lod(W, H); stepDominant(); }
    world.flushArt(performance.now());
    // labels: positions every moved frame (and every frame while body labels show - bodies orbit); the de-collision
    // layout on a throttle while moving and once when settled (#50)
    if ((moved || objLblActive) && D) { const due = performance.now() - lblAt >= LBL_EVERY; updateLabels(dist, due); lblPending = !due; }
    else if (lblPending && D) { updateLabels(dist, true); lblPending = false; }
    // column rise after a layer change (task #50): ease-out over STAT_GROW_MS; callouts ride the column tops meanwhile
    let growing = false;
    if (statState.growAt) {
      const g = Math.min(1, (performance.now() - statState.growAt) / STAT_GROW_MS);
      statU.uGrow.value = 1 - (1 - g) ** 3; growing = true;
      if (g >= 1) statState.growAt = 0;
    } else statU.uGrow.value = 1;
    if (statState.name && D && (moved || growing || statState.dirty || U.uGal.value !== galSeen || statLayer.style.display === 'none' && U.uGal.value > 0.05)) updateStats(dist);
    else if (!statState.name && statLayer.style.display !== 'none') statLayer.style.display = 'none';
    galSeen = U.uGal.value;
    serviceHover();
    renderer.info.reset();
    composer.render(dt);
    stats.frames++; stats.acc += dt; stats.n++; stats.cpuAcc += performance.now() - c0;
    if (stats.acc >= 1) {
      stats.fps = stats.n / stats.acc; stats.frameMs = 1000 * stats.acc / stats.n; stats.cpuMs = stats.cpuAcc / stats.n;
      stats.acc = 0; stats.n = 0; stats.cpuAcc = 0;
      // adaptive quality: three slow seconds in a row at > 1x pixel ratio -> drop to 1x
      stats.slow = stats.fps < 45 ? stats.slow + 1 : 0;
      if (stats.slow >= 3 && pixelRatio > 1) { pixelRatio = 1; renderer.setPixelRatio(1); U.uPR.value = 1; resize(); stats.slow = 0; }
    }
  }
  function start() { if (running || disposed) return; running = true; lastTs = 0; raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);
  const onLost = (e) => { e.preventDefault(); stop(); };
  const onRestored = () => { if (!document.hidden) start(); };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);
  resize();
  if (!document.hidden) start();

  // getStats().systemView (v10 meaning): the dominant system - sys, name, sb (station map position), bodies / planets /
  // asteroids, fleets placed there and their roles, stakes, beams (miners with a beam), worked rocks (miners, u/s, faction,
  // fade = how far those miners' hulls are drawn 0..1 by their px size), scale (layout -> world), footprint (world extent
  // radius), extPx, frac (extent diameter / uncovered side), fade (its outer orbit ring's alpha by px, 1 = fully drawn),
  // shipHalfMax / bodyRMin (world units: the largest member hull half-size, the smallest body radius)
  function sysStats(addr) {
    const w = world.world, info = w && w.byAddr.get(addr);
    if (!info) return null;
    const m = info.members || {docked: [], mining: [], cst: [], idle: []}, list = [...m.docked, ...m.mining, ...m.cst, ...m.idle];
    const bodies = w.bodyAt.slice(info.b0, info.b0 + info.nb), outer = info.layout.length ? info.layout[info.layout.length - 1].r * info.k : 0;
    const hullFade = (flag) => { const px = M.sizeScale(flag) * 2 * info.ppu; return Math.min(1, Math.max(0, (px - M.HULL_PX.collapse) / (M.HULL_PX.full - M.HULL_PX.collapse))); };
    const r3 = (v) => Math.round(v * 1000) / 1000;
    return {sys: addr, name: info.s.n, sb: [info.s.x + info.sb[0], info.s.y + info.sb[1]], bodies: info.nb, planets: bodies.filter((b) => b.kind === 0).length,
      asteroids: bodies.filter((b) => b.kind === 1).length, fleets: list.length,
      roles: {docked: m.docked.length, mining: m.mining.length, cst: m.cst.length, idle: m.idle.length},
      stakes: [...info.stakeN.values()].reduce((a, n) => a + n, 0), beams: list.filter((i) => D.place[i] && D.place[i].T[1] > 0.5).length,
      shipHalfMax: list.reduce((a, i) => Math.max(a, M.sizeScale(D.fleets[i].flagSize)), 0), bodyRMin: bodies.length ? Math.min(...bodies.map((b) => b.R)) : 0,
      worked: bodies.filter((b) => b.work).map((b) => ({id: b.L.b.a, name: b.L.b.n, miners: b.work.n, ups: Math.round(b.work.ups * 10) / 10, fa: b.work.fa, fade: r3(hullFade('medium')), ring: layers.mining})),
      scale: info.k, footprint: r3(info.ext), extPx: Math.round(info.extPx), frac: r3(dom.frac),
      fade: r3(outer ? lodS(RING_PX[0], RING_PX[1], outer * info.ppu) : Math.min(1, info.extPx / 20)), ...world.texStats()};
  }

  // ------------------------------------------------------------ API
  const api = {
    ok: true,
    setData,
    setFilter(f = {}) {
      if ('faction' in f) filter.faction = M.FILTER_FACTIONS.includes(f.faction) ? f.faction : null;
      if ('states' in f) filter.states = Array.isArray(f.states) && f.states.length ? f.states.slice() : null;
      if ('owner' in f) filter.owner = f.owner || null;
      writeVis();
    },
    focusOwner(profile) {
      filter.owner = profile || null;
      writeVis();
      if (!profile || !D) { flyTo(HOME.x, HOME.y, HOME.dist, HOME.polar); return 0; }
      const pts = [];
      for (let i = 0; i < D.fleets.length; i++) if (D.fleets[i].o === profile) pts.push(fleetNow(i, [0, 0]));
      const fr = M.frame(pts);
      if (fr) flyTo(fr.x, fr.y, Math.max(16, (fr.span * 1.35 + 4) / (2 * Math.tan(FOV * Math.PI / 360))), 0.62);
      return pts.length;
    },
    focusPoint(x, y, zoom = 3) {
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      flyTo(x, y, HOME.dist / Math.max(0.5, zoom || 3), 0.62);
    },
    // a smooth fly to a framing of that system ON THE SAME MAP (v10: nothing opens; the system is always there), or with
    // null a fly back out to galaxy scale (42) over the dominant system / the current target
    focusSystem(addr) {
      if (addr == null) {
        const s = dom.addr && D && D.sysByAddr.get(dom.addr);
        if (s) flyTo(s.x, s.y, 42, HOME.polar, reduced ? 0 : 1.4);
        else flyTo(controls.target.x, -controls.target.z, Math.max(42, camera.position.distanceTo(controls.target)), HOME.polar, reduced ? 0 : 1.4);
        return true;
      }
      const s = D && D.sysByAddr.get(addr);
      if (!s) return false;
      flyTo(s.x, s.y, fitDist(s), SV_POLAR, reduced ? 0 : 1.8); // the whole system fits the uncovered map (task #36)
      dom.framed = addr; dom.frameD = fitDist(s);
      return true;
    },
    // screen position of ANY body now ({clientX, clientY, visible, x, y}), null for an unknown body / behind the camera
    bodyScreen(addr) {
      const w = world.world, bi = w && w.bodyIdx.get(addr);
      if (bi == null) return null;
      const p = world.bodyPos(bi, U.uAnim.value, [0, 0]);
      camera.updateMatrixWorld();
      v3.set(p[0], 0, -p[1]).project(camera);
      if (v3.z >= 1) return null;
      const sx = (v3.x + 1) / 2 * W, sy = (1 - v3.y) / 2 * H;
      return {x: p[0], y: p[1], clientX: sx + rect.left, clientY: sy + rect.top, visible: sx >= 0 && sx <= W && sy >= 0 && sy <= H};
    },
    pulseEvent(ev) {
      if (!ev || !Number.isFinite(ev.x) || !Number.isFinite(ev.y)) return false;
      const k = PULSE_KIND[ev.k] ?? 0, i = pulseNext; pulseNext = (pulseNext + 1) % PULSE_POOL;
      const col = PULSE_COLOR[k] || tint(ev.fa);
      pulseA.iS.array.set([ev.x, ev.y, PULSE_R[k], U.uTime.value], i * 4);
      pulseA.iC.array.set(col, i * 3);
      pulseA.iK.array[i] = k;
      pulseA.iS.needsUpdate = pulseA.iC.needsUpdate = pulseA.iK.needsUpdate = true;
      if (ev.k === 'combat' && Array.isArray(ev.vs)) {
        const ca = tint(ev.fa);
        for (let j = 0; j < Math.min(ev.vs.length, TRACER_MAX_VS); j++) {
          const o = ev.vs[j]; if (!o) continue;
          const idx = D && D.index.get(o.f);
          const ends = M.tracerEnds(ev, j, idx != null ? fleetNow(idx, [0, 0]) : null);
          if (!ends) continue; // opponent not in the current data: skip
          const t = tracerNext; tracerNext = (tracerNext + 1) % TRACER_POOL;
          tracerA.iE.array.set(ends, t * 4);
          tracerA.iC.array.set(tint(o.fa), t * 3); // end A = opponent
          tracerA.iC2.array.set(ca, t * 3);       // end B = the event's fleet
          tracerA.iS.array[t * 2] = U.uTime.value; tracerA.iS.array[t * 2 + 1] = M.seedOf(String(o.f));
          tracerA.iE.needsUpdate = tracerA.iC.needsUpdate = tracerA.iC2.needsUpdate = tracerA.iS.needsUpdate = true;
        }
      }
      return true;
    },
    on(name, cb) {
      if (!handlers[name] || typeof cb !== 'function') return () => {};
      handlers[name].add(cb);
      return () => handlers[name].delete(cb);
    },
    setLayer(name, on) {
      if (!LAYERS.includes(name)) { console.warn('C4Scene.setLayer: unknown layer', name); return false; }
      layers[name] = !!on;
      for (const o of layerObjs[name] || []) o.visible = !!on;
      if (name === 'territory') terrU.uTerr.value = on ? 1 : 0;
      if (name === 'systems') world.setVisible(on); // v10: a system's star, orbits, bodies, station and stakes belong to the Systems layer
      if (name === 'combat') syncHots(); // task #57
      if (name === 'fleets' || name === 'mining') { world.setLayers(layers.fleets, layers.mining); syncBeams(); if (name === 'mining' && D) writeVis(); } // miners follow Mining in every system
      lastCam[0] = NaN;
      return true;
    },
    // h: world height (default 0: since v10 the whole world - glyphs, bodies, fleets - lies on the plane y = 0)
    screenOf(x, y, h = 0) {
      camera.updateMatrixWorld();
      const s = toScreen(x, y, Number.isFinite(h) ? h : 0);
      return s ? {clientX: s[0] + rect.left, clientY: s[1] + rect.top, visible: s[0] >= 0 && s[0] <= W && s[1] >= 0 && s[1] <= H, covered: covered(s[0], s[1])} : null;
    },
    // test hook (task #56 add-on): show / hide the background starfield, so a test can diff exactly its pixels
    _starfield(on) { stars.visible = !!on; return true; },
    // test hook (v11): show / hide the whole parallax backdrop (nebula plane + starfield) - it sits far below the map and
    // does not move with it, so a motion-compensated frame diff (test v10 (a)) leaves it out
    _backdrop(on) { stars.visible = nebula.visible = !!on; return true; },
    // test hook (v10): show / hide the world's system layers (orbits, bodies + stars, stations, stakes) - pixel diffs
    _world(on) { world.setVisible(on); return true; },
    // test probe (v10): a body's disc radius in px right now (the BODY_VS formula at its own depth); null = unknown
    bodyPixelSize(addr) {
      const w = world.world, bi = w && w.bodyIdx.get(addr);
      if (bi == null) return null;
      camera.updateMatrixWorld();
      const p = world.bodyPos(bi, U.uAnim.value, [0, 0]);
      return hullPxAt(p[0], p[1], w.bodyAt[bi].R) / 2;
    },
    // test probe (v11): px per map unit at a map point (x, y) on the plane, at that point's own view depth (the GLSL ppuOf)
    ppuAt(x, y) { camera.updateMatrixWorld(); return hullPxAt(x, y, 0.5); },
    // test probe (v10): the drawn opacity of each layer for the system nearest the uncovered map's centre (the SAME
    // smoothstep bands as the shaders) - glyph, star, outer orbit ring, the most-drawn body, station; markers = galaxyFade
    lodProbe() {
      const w = world.world; if (!w) return null;
      const mx = (insets.left + W - insets.right) / 2, my = (insets.top + H - insets.bottom) / 2;
      let best = null, bd = Infinity;
      for (const info of w.infos) { if (!info.on) continue; const d = Math.hypot(info.sx - mx, info.sy - my); if (d < bd) { bd = d; best = info; } }
      if (!best) return null;
      const i = best, starPx = i.starR * i.ppu, outer = i.layout.length ? i.layout[i.layout.length - 1].r * i.k * i.ppu : 0;
      let bodies = 0; for (let b = i.b0; b < i.b0 + i.nb; b++) bodies = Math.max(bodies, lodS(BODY_PX[0], BODY_PX[1], w.bodyAt[b].R * i.ppu));
      const r3 = (v) => Math.round(v * 1000) / 1000;
      return {sys: i.s.n, starPx: r3(starPx), extPx: r3(i.extPx), glyph: r3(1 - lodS(STAR_PX[0], STAR_PX[1], starPx)), star: r3(lodS(STAR_PX[0], STAR_PX[1], starPx)),
        rings: r3(lodS(RING_PX[0], RING_PX[1], outer)), bodies: r3(bodies), station: r3(lodS(SB_PX[0], SB_PX[1], i.sbHalf * i.ppu)), markers: r3(U.uGal.value)};
    },
    // In-map stats (task #32): 'mining' | 'combat' | 'fleets' | 'owners' | null (off). Returns true when accepted.
    setStatLayer(name) {
      const n = name == null || name === '' ? null : String(name);
      if (n !== null && !M.STAT_LAYERS.includes(n)) { console.warn('C4Scene.setStatLayer: unknown stat layer', name); return false; }
      // a layer CHANGE (not a re-send of the same one) restarts the ~400 ms rise of the columns (task #50)
      if (n && n !== statState.name) statState.growAt = reduced ? 0 : performance.now();
      if (n !== statState.name || n) { statState.name = n; statState.dirty = true; }
      syncHots(); // task #57: the combat rings follow the Combat tab
      if (!n) buildStats();
      return true;
    },
    // DACs (task #53): {dacs: [{tag, color '#rrggbb', members: [profile]}], example, focus: tag|null}. Sanitised here: a
    // bad colour becomes grey, a non-string member is dropped, a focus not in the list is null. Drawn by the 'dacs' layer.
    setDacs(o = {}) {
      const seen = new Set();
      dacState.dacs = (Array.isArray(o && o.dacs) ? o.dacs : []).filter((d) => d && typeof d.tag === 'string' && d.tag && !seen.has(d.tag) && seen.add(d.tag))
        .map((d) => ({tag: d.tag.slice(0, 24), color: M.dacHex(d.color), members: (Array.isArray(d.members) ? d.members : []).filter((m) => typeof m === 'string' && m)}));
      dacState.example = !!(o && o.example);
      dacState.focus = o && typeof o.focus === 'string' && dacState.dacs.some((d) => d.tag === o.focus) ? o.focus : null;
      // conquest lens (task #55): {on, metrics: subset of M.CONQUEST_METRICS, scope: a listed tag | null}; off / missing ->
      // today's drawing exactly (nothing is touched unless the lens is or was on)
      const ln = o && o.lens && typeof o.lens === 'object' ? o.lens : {};
      const wasOn = dacState.lens.on;
      dacState.lens = {on: ln.on === true, metrics: M.CONQUEST_METRICS.filter((m) => Array.isArray(ln.metrics) && ln.metrics.includes(m)),
        scope: typeof ln.scope === 'string' && dacState.dacs.some((d) => d.tag === ln.scope) ? ln.scope : null};
      if (dacState.lens.on || wasOn) applyLens();
      if (statState.name === 'dacs') statState.dirty = true;
      return true;
    },
    // fly to frame every system the DAC is present in (fleets or stakes, the dacInfluence rule) inside the uncovered map.
    // true when handled; false for an unknown tag or a DAC with no presence (the page then flies to its own centroid)
    focusDac(tag) {
      if (!D || typeof tag !== 'string') return false;
      const d = dacState.dacs.find((x) => x.tag === tag);
      if (!d) return false;
      const rows = (M.dacInfluence(D.latest, [d]).byDac[tag] || []).filter((s) => Number.isFinite(s.x) && Number.isFinite(s.y));
      if (!rows.length) return false;
      const fr = M.frame(rows.map((s) => [s.x, s.y]));
      const th = (() => { v3.copy(camera.position).sub(controls.target); return sph.setFromVector3(v3).theta; })();
      fitCam.copy(camera); fitCam.updateProjectionMatrix();
      fitT.set(fr.x, 0, -fr.y);
      const m = DAC_FIT_PX, x0 = insets.left + m, x1 = W - insets.right - m, y0 = insets.top + m, y1 = H - insets.bottom - m;
      const fits = (dd) => {
        fitS.set(dd, DAC_POLAR, th); fitCam.position.setFromSpherical(fitS).add(fitT); fitCam.lookAt(fitT); fitCam.updateMatrixWorld();
        for (const s of rows) {
          v3.set(s.x, STAT_BASE_Y, -s.y).project(fitCam);
          const sx = (v3.x + 1) / 2 * W, sy = (1 - v3.y) / 2 * H;
          if (v3.z >= 1 || sx < x0 || sx > x1 || sy < y0 || sy > y1) return false;
          // clear of the floating HUD too (task #55, verifier finding B): DAC_AVOID_PX around every avoid rect
          if (avoid.some((a) => sx > a.left - DAC_AVOID_PX && sx < a.right + DAC_AVOID_PX && sy > a.top - DAC_AVOID_PX && sy < a.bottom + DAC_AVOID_PX)) return false;
        }
        return true;
      };
      // never closer than DAC_MIN_DIST (> SV_OUT: framing a DAC must not open a system view, even for one system)
      let lo = DAC_MIN_DIST, hi = controls.maxDistance, dist;
      if (fits(lo)) dist = lo;
      else if (!fits(hi)) dist = hi;
      else { for (let i = 0; i < 22; i++) { const mid = (lo + hi) / 2; if (fits(mid)) hi = mid; else lo = mid; } dist = hi; }
      flyTo(fr.x, fr.y, dist, DAC_POLAR);
      return true;
    },
    // CSS px of the map covered by docked UI. The scene's visual centre, focus framing, screenOf / fleetScreen /
    // bodyScreen and picking all account for it (camera view offset). Missing / bad values count as 0.
    setInsets(o = {}) {
      const v = (x) => (Number.isFinite(x) && x > 0 ? x : 0);
      const before = [insets.left, insets.right, insets.top, insets.bottom].join();
      Object.assign(insetsReq, {left: v(o.left), right: v(o.right), top: v(o.top), bottom: v(o.bottom)});
      avoid.length = 0;
      if (Array.isArray(o.avoid)) {
        for (const a of o.avoid) {
          if (!a || ![a.left, a.top, a.right, a.bottom].every(Number.isFinite) || a.right <= a.left || a.bottom <= a.top) continue;
          avoid.push({left: a.left, top: a.top, right: a.right, bottom: a.bottom});
        }
      }
      applyViewOffset(); camera.updateMatrixWorld(); lastCam[0] = NaN;
      if ([insets.left, insets.right, insets.top, insets.bottom].join() !== before) { fitCache.clear(); reframe(); } // avoid rects never move the framing
      return {...insets, avoid: avoid.map((a) => ({...a}))};
    },
    fleetScreen(id) {
      if (!D) return null;
      const i = D.fleets.findIndex((f) => f.a === id);
      if (i < 0) return null;
      // inSystem: placed in its system's layout (docked, mining, stake transfer, idle at a system); shown: how much of the
      // hull is drawn now (the HULL_PX fade 0..1 of its projected size)
      camera.updateMatrixWorld();
      fleetNow(i, pos2);
      const f = D.fleets[i], px = hullPxAt(pos2[0], pos2[1], M.sizeScale(f.flagSize) * M.focusScale(D.vis[i]));
      const shown = shownVis(i) < 0.001 ? 0 : Math.min(1, Math.max(0, (px - M.HULL_PX.collapse) / (M.HULL_PX.full - M.HULL_PX.collapse)));
      return {x: pos2[0], y: pos2[1], inSystem: !!(D.place && D.place[i]), shown, ...api.screenOf(pos2[0], pos2[1])};
    },
    // test / debug probes (task #38), not part of the panel contract:
    // statColumnScreen(i): column i of the stat layer - its base and top on screen, from the same world points as STATCOL_VS
    statColumnScreen(i) {
      const c = statState.cols[i]; if (!c) return null;
      camera.updateMatrixWorld();
      const b = toScreen(c.x, c.y, STAT_BASE_Y), t = toScreen(c.x, c.y, STAT_BASE_Y + statTopH(c));
      return b && t ? {key: c.key, sys: c.sys, x: c.x, y: c.y, base: {clientX: b[0] + rect.left, clientY: b[1] + rect.top}, top: {clientX: t[0] + rect.left, clientY: t[1] + rect.top},
        widthWorld: (0.75 + 0.5 * Math.sqrt(statState.vmax ? c.v / statState.vmax : 0)) * statU.uStatW.value} : null;
    },
    // labelLayout() (task #50): the de-collision state of every on-screen label - galaxy and system view. def = the
    // label's default box, box = where it stands now ([x0, y0, x1, y1] client px); vis false = faded out (hide says why)
    labelLayout() {
      const bx = (sp, w, h) => [+(sp[0] + rect.left).toFixed(1), +(sp[1] + rect.top).toFixed(1), +(sp[0] + w + rect.left).toFixed(1), +(sp[1] + h + rect.top).toFixed(1)];
      const out = (L, n, prio, vis) => ({n, prio, vis, hide: L.hide || '', def: bx(L.spots[0], L.w, L.h), box: bx(L.spots[vis ? L.cand : 0], L.w, L.h)});
      return {
        galaxy: labelEls.filter((L) => L.shown && L.w).map((L) => out(L, L.s.n, L.prio, !!L.vis)),
        // bodies + starbases (v10: one layout with the system names; listed apart for the tests' convenience)
        system: [...objLbl.values()].filter((L) => L.on && L.w).map((L) => out(L, L.el.textContent, L.prio, L.cand != null && L.cand >= 0)),
      };
    },
    // pickAt(clientX, clientY): what a hover at that client point reports right now (the same pickAt serviceHover runs)
    pickAt(cx, cy) {
      camera.updateMatrixWorld();
      const p = pickAt(cx, cy);
      return p ? {type: p.type, id: p.id, sys: p.sys} : null;
    },
    // look tuning (bloom + exposure); not part of the panel contract
    tune(o = {}) {
      if (Number.isFinite(o.strength)) bloom.strength = o.strength;
      if (Number.isFinite(o.radius)) bloom.radius = o.radius;
      if (Number.isFinite(o.threshold)) bloom.threshold = o.threshold;
      if (Number.isFinite(o.exposure)) renderer.toneMappingExposure = o.exposure;
      if (Number.isFinite(o.terrDim)) terrU.uTerrDim.value = o.terrDim;
      if (Number.isFinite(o.terrFill)) terrU.uTerrFill.value = o.terrFill;
      if (Number.isFinite(o.conqFill)) conquest.material.uniforms.uConqFill.value = o.conqFill; // task #58
      if (Number.isFinite(o.conqDim)) conquest.material.uniforms.uConqDim.value = o.conqDim;
      if (Array.isArray(o.terrGain) && o.terrGain.length === 3) { terrGain = o.terrGain.slice(); setTerrGain(terrGain, dacState.lens.on); }
      if (Number.isFinite(o.sysCover)) sysCover.value = o.sysCover;
      if (Number.isFinite(o.nearK) && o.nearK > 0) { tun.nearK = o.nearK; camera.near = 0; } // v10 test knobs (camera.near 0 = re-apply next frame)
      if (Number.isFinite(o.domIn)) tun.domIn = o.domIn;
      if (Number.isFinite(o.domOut)) tun.domOut = o.domOut;
      if (Number.isFinite(o.dcOut)) tun.dcOut = o.dcOut;
      return {terrDim: terrU.uTerrDim.value,strength: bloom.strength, radius: bloom.radius, threshold: bloom.threshold, exposure: renderer.toneMappingExposure};
    },
    // the silhouette atlas cell a fleet is drawn with (-1 = glyph); same rule as the shader input
    // projected hull length in px right now (the FLEET_VS formula: own view depth, class size, focus factor); a hull
    // under M.HULL_PX.collapse is neither drawn nor pickable. null = unknown fleet
    fleetPixelSize(id) {
      if (!D) return null;
      const i = D.fleets.findIndex((f) => f.a === id);
      if (i < 0) return null;
      const f = D.fleets[i], half = M.sizeScale(f.flagSize) * M.focusScale(D.vis[i]);
      camera.updateMatrixWorld();
      fleetNow(i, pos2);
      return hullPxAt(pos2[0], pos2[1], half);
    },
    fleetCell(id) {
      const f = D && D.fleets.find((x) => x.a === id);
      return f ? M.atlasCell(shipAtlas, f.flag, f.flagSize) : null;
    },
    getStats() {
      return {ok: true, fps: Math.round(stats.fps * 10) / 10, frameMs: Math.round(stats.frameMs * 100) / 100, frames: stats.frames,
        pixelRatio, drawCalls: renderer.info.render.calls, fleets: D ? D.fleets.length : 0, systems: D ? D.systems.length : 0,
        hotSpots: D ? D.hot.length : 0, reducedMotion: reduced, bodies: bodiesAll.length,
        // systemView (v10): the DOMINANT system (null when none) - see sysStats; galaxyFade = the galaxy-marker distance
        // fade (stat columns, callouts, DAC halos, heat rings, pulses, tracers): 1 at camera distance >= MARK_FAR
        systemView: dom.addr ? sysStats(dom.addr) : null, galaxyFade: Math.round(U.uGal.value * 1000) / 1000,
        camera: (() => { v3.copy(camera.position).sub(controls.target); const q = new THREE.Spherical().setFromVector3(v3); return {dist: q.radius, polar: q.phi, azimuth: q.theta, tx: controls.target.x, ty: -controls.target.z, min: controls.minDistance, near: camera.near}; })(),
        textures: world.texStats(),
        ships: {atlas: !!shipAtlas, sil: Math.round(U.uSil.value * 1000) / 1000},
        activeFx: (() => {
          // start times sit in Float32Arrays, so a pulse fired this instant can read as age -1e-8: allow 1 ms slack
          const now = U.uTime.value; let p = 0, t = 0;
          for (let i = 0; i < PULSE_POOL; i++) { const age = now - pulseA.iS.array[i * 4 + 3], k = pulseA.iK.array[i]; if (age >= -1e-3 && age <= (k === 1 ? 3.2 : k === 5 ? 1.8 : 2.4)) p++; }
          for (let i = 0; i < TRACER_POOL; i++) { const age = now - tracerA.iS.array[i * 2]; if (age >= -1e-3 && age <= 1.8) t++; }
          return {pulses: p, tracers: t};
        })(), running, layers: {...layers}, filter: {...filter}, flying: fly.on, autoRotating: controls.autoRotate,
        cpuMs: Math.round(stats.cpuMs * 100) / 100, // mean JS time inside one frame callback (incl. render submit), last second
        statLayer: {name: statState.name, columns: statState.cols.length, callouts: statState.callouts.map((o) => ({sys: o.c.sys, name: o.c.name, line: o.c.line, v: o.c.v,
          shown: o.el.style.display !== 'none' && statLayer.style.display !== 'none', rank: o.rank + 1, under: !!o.under, // under: anchor below HUD / dock (#44)
          marker: o.vis ? [+(o.mx + rect.left).toFixed(1), +(o.my + rect.top).toFixed(1)] : null}))},
        // task #53: the DAC layer's state - per column its system, tag (dominant or focused) and colour; halo rows; watermark
        dacs: {n: dacState.dacs.length, example: dacState.example, focus: dacState.focus, halos: dacState.halos.length, drawn: dacHalos.visible,
          lens: {...dacState.lens, metrics: dacState.lens.metrics.slice(), drawn: conquest.visible, byDac: dacState.conq ? {...dacState.conq.byDac} : {},
            contested: dacState.conq ? dacState.conq.contested : 0, systems: dacState.conq ? dacState.conq.systems.map((s) => ({a: s.a, winner: s.winner, contested: s.contested, strength: s.strength})) : []},
          cols: statState.name === 'dacs' ? statState.cols.map((c) => ({sys: c.sys, tag: c.tag, hex: c.hex, v: c.v})) : [],
          mark: dacState.mark && dacState.markBox && dacState.mark.style.display !== 'none' && statLayer.style.display !== 'none'
            ? {left: dacState.markBox.left + rect.left, top: dacState.markBox.top + rect.top, right: dacState.markBox.right + rect.left, bottom: dacState.markBox.bottom + rect.top} : null},
        insets: {...insets, avoid: avoid.map((a) => ({...a}))}};
    },
    dispose() {
      if (disposed) return;
      disposed = true; stop();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      container.removeEventListener('wheel', onWheel, {capture: true});
      canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onCancel);
      canvas.removeEventListener('webglcontextlost', onLost); canvas.removeEventListener('webglcontextrestored', onRestored);
      controls.dispose();
      world.dispose();
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
      terrTex.dispose(); composer.dispose(); rt.dispose(); renderer.dispose();
      canvas.remove(); labelLayer.remove(); statLayer.remove();
      handlers.pick.clear(); handlers.hover.clear(); D = null;
    },
  };
  return api;
}

window.C4Scene = {mount, version: '1.0.0', layers: LAYERS.slice()};
