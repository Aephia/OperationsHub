# render_grounds.py - planet-surface grounds for the C4 Live claim stake view (Blender 5.2, -b).
# One 1920x1080 render per planet type. The camera and the three suns are the ones of Tools/landing/stake_tiles.py
# (orthographic, from -Y, elevation 32 deg), so the building tiles of Images/stake/ sit on these grounds with the
# same perspective and the same light. The middle of every ground is a flat clearing for the buildings.
#   "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b -P render_grounds.py -- <out_dir> [samples] [w] [type ...]
# Frame contract (pack_grounds.py writes it to the manifest): the world origin is the image centre, the frame is
# ORTHO_SCALE world units wide, ground depth is squashed by sin(32 deg).
import sys, os, math, random
import bpy
from mathutils import Vector, noise

argv = sys.argv[sys.argv.index('--') + 1:]
OUT_DIR = os.path.abspath(argv[0])
SAMPLES = int(argv[1]) if len(argv) > 1 else 96
WIDTH = int(argv[2]) if len(argv) > 2 else 1920
ONLY = argv[3:]
os.makedirs(OUT_DIR, exist_ok=True)

ELEV = 32.0
ORTHO_SCALE = 26.0
CLEAR_X, CLEAR_Y = 7.6, 7.0          # half-axes of the flat clearing (world units)
NX, NY = 520, 560                    # ground grid
SX, SY = 34.0, 38.0                  # ground size (covers the frame: 26 wide, 14.6 / sin(32) = 27.6 deep)


def smooth(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def lerp(a, b, t):
    return a + (b - a) * t


def mix(c1, c2, t):
    return tuple(lerp(a, b, t) for a, b in zip(c1, c2))


def ramp(stops, t):
    t = max(0.0, min(1.0, t))
    for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
        if t <= t1:
            return mix(c0, c1, (t - t0) / max(1e-6, t1 - t0))
    return stops[-1][1]


def fbm(x, y, z, octaves=6):
    return noise.fractal(Vector((x, y, z)), 1.0, 2.0, octaves)


def ridged(x, y, z, octaves=5):
    s, a, f = 0.0, 0.5, 1.0
    for _ in range(octaves):
        s += a * (1.0 - abs(noise.noise(Vector((x * f, y * f, z)))) * 2.0)
        a *= 0.5; f *= 2.0
    return s


def crack(x, y, z, scale):
    d = noise.voronoi(Vector((x * scale, y * scale, z)))[0]
    return d[1] - d[0]               # 0 on a cell edge


def craters(seed, n, rmin, rmax):
    rnd = random.Random(seed)
    out = []
    for _ in range(n * 6):
        if len(out) >= n:
            break
        x, y, r = rnd.uniform(-SX / 2, SX / 2), rnd.uniform(-SY / 2, SY / 2), rnd.uniform(rmin, rmax)
        if (x / (CLEAR_X + r + 1)) ** 2 + (y / (CLEAR_Y + r + 1)) ** 2 < 1:
            continue
        out.append((x, y, r))
    return out


def crater_h(cr, x, y):
    h = 0.0
    for cx, cy, r in cr:
        d = math.hypot(x - cx, y - cy) / r
        if d < 1.35:
            h += r * (-0.38 * (1 - min(1.0, d) ** 2) + 0.16 * math.exp(-((d - 1.0) / 0.16) ** 2))
    return h


# ------------------------------------------------------------------------------------------ types ----
# Each type returns (height, colour rgb, emission rgb, roughness-ish gloss 0..1) for a ground point.
# `c` = 0 inside the clearing, 1 outside (smooth).
def t_terrestrial(x, y, c, S):
    n = fbm(x * 0.11, y * 0.11, 3.1)
    rv = abs(fbm(x * 0.045 + 3.0, y * 0.045, 6.6, 4))
    river = (1 - smooth(0.0, 0.07, rv)) * c
    h = lerp(0.0, 0.35 + 2.3 * n + 1.3 * max(0.0, ridged(x * 0.08, y * 0.08, 9.0) - 0.35), c) - 1.5 * river
    d = fbm(x * 0.6, y * 0.6, 7.7, 4)
    col = ramp([(0.0, (0.10, 0.085, 0.05)), (0.22, (0.025, 0.075, 0.02)), (0.45, (0.05, 0.13, 0.03)), (0.62, (0.13, 0.15, 0.05)),
                (0.8, (0.17, 0.12, 0.075)), (1.0, (0.36, 0.34, 0.31))], 0.36 + h * 0.20 + d * 0.12)
    return h, col, (0, 0, 0), 0.0


def t_oceanic(x, y, c, S):
    n = fbm(x * 0.10, y * 0.10, 5.3)
    isl = 0.34 + 0.05 * fbm(x * 0.5, y * 0.5, 2.0, 3)
    h = lerp(isl, -0.62 + 2.1 * n + 0.6 * max(0.0, ridged(x * 0.2, y * 0.2, 4.0, 4) - 0.6), c)
    col = ramp([(0.0, (0.0, 0.01, 0.03)), (0.25, (0.0, 0.06, 0.09)), (0.40, (0.10, 0.30, 0.26)), (0.46, (0.42, 0.38, 0.26)),
                (0.58, (0.07, 0.15, 0.05)), (1.0, (0.16, 0.18, 0.11))], 0.42 + h * 0.5 + 0.06 * fbm(x * 0.7, y * 0.7, 1.0, 3))
    return h, col, (0, 0, 0), 0.0


def t_volcanic(x, y, c, S):
    r = ridged(x * 0.09, y * 0.09, 4.2)
    h = lerp(0.0, 0.2 + 2.1 * r + 0.7 * fbm(x * 0.3, y * 0.3, 1.5, 4), c)
    ck = crack(x + 2.5 * fbm(x * 0.1, y * 0.1, 8.0, 3), y, 2.0, 0.22)
    lava = (1 - smooth(0.0, 0.075, ck)) * c
    pool = (1 - smooth(-0.55, -0.15, h)) * c
    g = max(lava, pool)
    col = mix(ramp([(0.0, (0.035, 0.028, 0.028)), (0.6, (0.075, 0.06, 0.055)), (1.0, (0.16, 0.12, 0.10))],
                   0.4 + h * 0.3 + 0.15 * fbm(x * 0.8, y * 0.8, 3.0, 3)), (0.02, 0.005, 0.0), g)
    em = tuple(v * g for v in (1.0, 0.16 + 0.20 * g * g, 0.01))
    if g > 0.3:
        h = lerp(h, min(h, -0.12), g)
    return h, col, em, 0.0


def t_barren(x, y, c, S):
    w = x * 0.55 + 2.4 * fbm(x * 0.07, y * 0.07, 6.0, 3)
    dune = 0.5 + 0.5 * math.sin(w + 0.22 * y)
    h = lerp(0.0, 0.15 + 0.85 * dune + 1.5 * fbm(x * 0.06, y * 0.06, 2.2, 4) + crater_h(S['cr'], x, y), c)
    col = ramp([(0.0, (0.10, 0.055, 0.03)), (0.5, (0.22, 0.13, 0.065)), (1.0, (0.36, 0.25, 0.14))],
               0.45 + h * 0.3 + 0.12 * fbm(x * 0.9, y * 0.9, 4.0, 3))
    return h, col, (0, 0, 0), 0.0


def t_ice(x, y, c, S):
    n = fbm(x * 0.09, y * 0.09, 1.9)
    h = lerp(0.0, 0.12 + 1.5 * n + 1.3 * max(0.0, ridged(x * 0.16, y * 0.16, 3.3) - 0.40), c)
    ck = crack(x + 1.5 * fbm(x * 0.2, y * 0.2, 5.0, 3), y, 5.0, 0.30)
    fis = (1 - smooth(0.0, 0.07, ck)) * c
    col = mix(ramp([(0.0, (0.07, 0.20, 0.32)), (0.5, (0.26, 0.42, 0.52)), (1.0, (0.55, 0.66, 0.72))],
                   0.5 + h * 0.4 + 0.10 * fbm(x * 0.8, y * 0.8, 6.0, 3)), (0.01, 0.08, 0.16), fis * 0.9)
    em = tuple(v * fis for v in (0.05, 0.45, 0.9))
    return h - 0.10 * fis, col, em, 0.55


def t_gas(x, y, c, S):
    wx = x + 3.0 * fbm(x * 0.05, y * 0.05, 2.0, 3)
    wy = y + 3.0 * fbm(x * 0.05, y * 0.05, 7.0, 3)
    n = fbm(wx * 0.12, wy * 0.07, 4.4, 5)
    h = -2.2 + 2.6 * n + 0.9 * fbm(wx * 0.4, wy * 0.4, 1.2, 4)
    band = 0.5 + 0.5 * math.sin(wy * 0.42 + 2.2 * n)
    col = ramp([(0.0, (0.10, 0.035, 0.02)), (0.35, (0.30, 0.13, 0.05)), (0.7, (0.50, 0.30, 0.13)), (1.0, (0.62, 0.50, 0.32))],
               0.25 * band + 0.45 + 0.35 * n)
    return h, col, (0, 0, 0), 0.0


def t_dark(x, y, c, S):
    r = ridged(x * 0.10, y * 0.10, 5.5)
    h = lerp(0.0, 0.15 + 1.2 * r + 0.5 * fbm(x * 0.25, y * 0.25, 3.0, 4) + 0.6 * crater_h(S['cr'], x, y), c)
    ck = crack(x + 2.0 * fbm(x * 0.12, y * 0.12, 1.0, 3), y, 8.0, 0.20)
    vein = (1 - smooth(0.0, 0.045, ck)) * c
    col = ramp([(0.0, (0.012, 0.012, 0.02)), (0.6, (0.035, 0.032, 0.05)), (1.0, (0.08, 0.07, 0.11))],
               0.4 + h * 0.3 + 0.2 * fbm(x * 0.8, y * 0.8, 2.0, 3))
    em = tuple(v * vein for v in (0.30, 0.05, 0.95))
    return h, col, em, 0.15


def t_belt(x, y, c, S):
    h = lerp(0.0, 0.1 + 0.8 * fbm(x * 0.10, y * 0.10, 8.8, 5) + 0.35 * ridged(x * 0.3, y * 0.3, 2.0, 4)
             + 1.25 * crater_h(S['cr'], x, y), c)
    col = ramp([(0.0, (0.035, 0.032, 0.03)), (0.5, (0.09, 0.082, 0.075)), (1.0, (0.19, 0.17, 0.155))],
               0.45 + h * 0.3 + 0.18 * fbm(x * 1.1, y * 1.1, 5.0, 3))
    return h, col, (0, 0, 0), 0.0


TYPES = {
    'terrestrial': dict(accent=(0.2, 0.85, 1.0), fn=t_terrestrial, water=(-0.42, (0.02, 0.10, 0.16)), bump=0.35, rough=0.92, world=(0.42, 0.52, 0.66, 0.14)),
    'oceanic':     dict(accent=(0.2, 0.9, 0.95), lift=0.36, fn=t_oceanic, water=(0.0, (0.0, 0.07, 0.11)), bump=0.35, rough=0.88, world=(0.36, 0.58, 0.70, 0.15)),
    'volcanic':    dict(accent=(1.0, 0.42, 0.08), fn=t_volcanic, bump=0.55, rough=0.80, world=(0.60, 0.30, 0.18, 0.07), em=1.5),
    'barren':      dict(accent=(1.0, 0.7, 0.22), fn=t_barren, bump=0.30, rough=0.95, world=(0.66, 0.56, 0.44, 0.12), craters=(11, 16, 0.7, 2.6)),
    'ice-giant':   dict(accent=(0.45, 0.85, 1.0), fn=t_ice, bump=0.40, rough=0.34, world=(0.46, 0.66, 0.86, 0.16), em=0.7),
    'gas-giant':   dict(accent=(1.0, 0.45, 0.08), fn=t_gas, bump=0.0, rough=1.0, world=(0.80, 0.60, 0.40, 0.16), platform=True),
    'dark':        dict(accent=(0.62, 0.3, 1.0), fn=t_dark, bump=0.50, rough=0.62, world=(0.20, 0.16, 0.34, 0.05), craters=(23, 10, 0.6, 2.0), em=1.3,
                        key=2.2),
    'asteroid':    dict(accent=(0.6, 0.8, 1.0), fn=t_belt, bump=0.55, rough=0.94, world=(0.10, 0.10, 0.12, 0.05), craters=(37, 26, 0.5, 3.2), key=3.9),
}


# ------------------------------------------------------------------------------------------ scene ----
def new_scene():
    bpy.ops.wm.read_homefile(use_empty=True)
    sc = bpy.context.scene
    return sc


def sun_dir(name, energy, travel, color, angle):
    d = bpy.data.lights.new(name, 'SUN'); d.energy = energy; d.color = color; d.angle = math.radians(angle)
    ob = bpy.data.objects.new(name, d); bpy.context.scene.collection.objects.link(ob)
    ob.rotation_euler = Vector(travel).normalized().to_track_quat('-Z', 'Y').to_euler()
    return ob


def principled(name):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = [n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    return m, b


def ground_material(T):
    m, b = principled('Ground')
    nt = m.node_tree
    col = nt.nodes.new('ShaderNodeAttribute'); col.attribute_name = 'Col'
    em = nt.nodes.new('ShaderNodeAttribute'); em.attribute_name = 'Em'
    nt.links.new(col.outputs['Color'], b.inputs['Base Color'])
    nt.links.new(em.outputs['Color'], b.inputs['Emission Color'])
    b.inputs['Emission Strength'].default_value = T.get('em', 0.0)
    b.inputs['Roughness'].default_value = T['rough']
    if T['bump'] > 0:
        nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 5.5; nz.inputs['Detail'].default_value = 9.0
        bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = T['bump']; bp.inputs['Distance'].default_value = 0.14
        nt.links.new(nz.outputs[0], bp.inputs['Height'])
        nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m


def build_ground(T, seed):
    S = {}
    if 'craters' in T:
        s, n, r0, r1 = T['craters']; S['cr'] = craters(s, n, r0, r1)
    fn = T['fn']
    verts, cols, ems = [], [], []
    for j in range(NY + 1):
        y = -SY / 2 + SY * j / NY
        for i in range(NX + 1):
            x = -SX / 2 + SX * i / NX
            d = math.hypot(x / CLEAR_X, y / CLEAR_Y)
            c = smooth(0.98, 1.9, d)
            h, col, em, _g = fn(x, y, c, S)
            verts.append((x, y, h)); cols.append(col); ems.append(em)
    faces = []
    for j in range(NY):
        for i in range(NX):
            a = j * (NX + 1) + i
            faces.append((a, a + 1, a + NX + 2, a + NX + 1))
    me = bpy.data.meshes.new('Ground'); me.from_pydata(verts, [], faces); me.update()
    for name, data in (('Col', cols), ('Em', ems)):
        at = me.color_attributes.new(name, 'FLOAT_COLOR', 'POINT')
        flat = [0.0] * (4 * len(data))
        for k, c3 in enumerate(data):
            flat[4 * k:4 * k + 4] = (c3[0], c3[1], c3[2], 1.0)
        at.data.foreach_set('color', flat)
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new('Ground', me); bpy.context.scene.collection.objects.link(ob)
    me.materials.append(ground_material(T))
    return ob


def build_water(level, color):
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, level))
    ob = bpy.context.active_object; ob.scale = (SX, SY, 1)
    m, b = principled('Water')
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = 0.09
    b.inputs['Metallic'].default_value = 0.0; b.inputs['Alpha'].default_value = 0.62
    nt = m.node_tree
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 18.0; nz.inputs['Detail'].default_value = 4.0
    bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.18; bp.inputs['Distance'].default_value = 0.05
    nt.links.new(nz.outputs[0], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    ob.data.materials.append(m)


def build_platform(accent, floating, lift=0.0):
    """The stake stands on a built pad: flush with the ground, or (gas giants have no ground) a deck floating
    over the cloud tops."""
    def mat(name, color, metallic, rough, emit=None, strength=0.0):
        m, b = principled(name)
        b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Metallic'].default_value = metallic
        b.inputs['Roughness'].default_value = rough
        if emit:
            b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
        return m
    dark = mat('Deck', (0.022, 0.025, 0.032), 0.15, 0.62)
    steel = mat('Steel', (0.36, 0.39, 0.44), 0.9, 0.34)
    glow = mat('Glow', accent, 0.0, 0.4, accent, 0.8)
    line = mat('Line', (0.07, 0.078, 0.095), 0.3, 0.5)

    def cyl(r, h, z, m, verts=96, loc=(0, 0)):
        bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h, location=(loc[0], loc[1], z))
        ob = bpy.context.active_object; ob.scale = (1.0, CLEAR_Y / CLEAR_X, 1.0) if loc == (0, 0) else (1, 1, 1)
        ob.data.materials.append(m)
        for p in ob.data.polygons:
            p.use_smooth = len(p.vertices) == 4
        return ob
    R = CLEAR_X + (1.3 if floating else 0.9)
    top = 0.0 if floating else 0.10 + lift
    cyl(R, 0.50, -0.25 + top, dark)
    cyl(R + 0.10, 0.10, -0.10 + top, steel)
    cyl(R - 0.22, 0.52, -0.25 + top, glow)
    cyl(R - 0.34, 0.54, -0.25 + top, dark)
    for k, rr in enumerate((R * 0.74, R * 0.48, R * 0.22)):
        cyl(rr, 0.545 + 0.002 * k, -0.25 + top, line)
        cyl(rr - 0.07, 0.547 + 0.002 * k, -0.25 + top, dark)
    if floating:
        cyl(R * 0.55, 2.6, -1.8, steel, verts=48)
    for i in range(8):
        a = math.radians(22.5 + 45 * i)
        x, y = (R + 0.5) * math.cos(a), (R + 0.5) * (CLEAR_Y / CLEAR_X) * math.sin(a)
        cyl(0.42 if floating else 0.20, 0.9, -0.55 + top + (0 if floating else 0.2), steel, verts=24, loc=(x, y))
        cyl(0.30 if floating else 0.13, 0.06, -0.08 + top + (0 if floating else 0.2), glow, verts=24, loc=(x, y))


def setup(sc, T):
    w = bpy.data.worlds.new('W'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (*T['world'][:3], 1); bg.inputs['Strength'].default_value = T['world'][3]
    cam_d = bpy.data.cameras.new('Cam'); cam_d.type = 'ORTHO'; cam_d.ortho_scale = ORTHO_SCALE; cam_d.clip_end = 400
    cam = bpy.data.objects.new('Cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
    el = math.radians(ELEV)
    cam.location = Vector((0, -120 * math.cos(el), 120 * math.sin(el)))
    cam.rotation_euler = (Vector((0, 0, 0)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
    sun_dir('Key', T.get('key', 3.2) * 1.15, (0.62, 0.50, -0.46), (1.0, 0.95, 0.88), 4.0)
    sun_dir('Rim', 1.1 * T.get('key', 3.2) / 3.2, (-0.35, -0.75, -0.45), (0.65, 0.80, 1.0), 3.0)
    sun_dir('Fill', 0.25, (-0.6, 0.3, -0.5), (0.8, 0.85, 1.0), 20.0)
    sc.render.engine = 'CYCLES'
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences
        prefs.compute_device_type = 'OPTIX'; prefs.get_devices()
        for dv in prefs.devices:
            dv.use = (dv.type == 'OPTIX')
        sc.cycles.device = 'GPU'
    except Exception as e:
        print('GPU unavailable, CPU fallback:', e, flush=True); sc.cycles.device = 'CPU'
    sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
    sc.render.resolution_x = WIDTH; sc.render.resolution_y = WIDTH * 9 // 16; sc.render.resolution_percentage = 100
    sc.render.film_transparent = False
    sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'; sc.view_settings.exposure = -0.1
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGB'


for slug, T in TYPES.items():
    if ONLY and slug not in ONLY:
        continue
    sc = new_scene()
    setup(sc, T)
    build_ground(T, slug)
    if 'water' in T:
        build_water(*T['water'])
    build_platform(T['accent'], bool(T.get('platform')), T.get('lift', 0.0))
    bpy.context.view_layer.update()
    out = os.path.join(OUT_DIR, slug + '.png')
    if os.path.exists(out):
        os.remove(out)
    sc.render.filepath = out
    bpy.ops.render.render(write_still=True)
    print('GROUND_REPORT', slug, os.path.exists(out), os.path.getsize(out) if os.path.exists(out) else -1, flush=True)
