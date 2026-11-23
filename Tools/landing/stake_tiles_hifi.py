# stake_tiles_hifi.py - the twelve claim-stake building tiles, high fidelity (2026-11-23). Same camera contract as
# stake_tiles.py (ortho scale 3.1, elevation 32 deg from -Y, target z 0.72, hex pad of circumradius 1.00), so the tiles
# drop into the same manifest; they are rendered at 1280 and packed at 640 wide (pack_stake_tiles.py reads the size).
# What changed against stake_tiles.py: modelled detail (lattice, pipes, tanks, vents, railings, ladders) and one
# procedural painted-metal material (grime, crevice dirt, bare-metal edge wear, panel seams) instead of flat colours.
#   "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b -P stake_tiles_hifi.py -- <out_dir> [samples] [res] [kind ...]
import sys, os, math
import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
OUT_DIR = os.path.abspath(argv[0])
SAMPLES = int(argv[1]) if len(argv) > 1 else 160
RES = int(argv[2]) if len(argv) > 2 else 1280
ONLY = argv[3:]
os.makedirs(OUT_DIR, exist_ok=True)
ELEV = 32.0
R90 = math.radians(90)
HEXROT = (0, 0, math.radians(30))

ACCENT = {
    'central_hub':     (0.20, 0.85, 1.00),
    'cultivation_hub': (0.30, 1.00, 0.62),
    'extraction_hub':  (1.00, 0.52, 0.15),
    'processing_hub':  (0.70, 0.42, 1.00),
    'storage_hub':     (1.00, 0.76, 0.25),
    'farm_hub':        (0.42, 1.00, 0.42),
    'power_plant':     (1.00, 0.90, 0.30),
    'crew_quarters':   (1.00, 0.86, 0.62),
    'extractor':       (1.00, 0.52, 0.15),
    'processor':       (0.70, 0.42, 1.00),
    'storage_module':  (1.00, 0.76, 0.25),
    'farm':            (0.42, 1.00, 0.42),
}


# ---------------------------------------------------------------------------------------- materials ----
def worn(name, color, metallic=0.0, rough=0.5, wear=1.0, panels=0.0, grime=0.55, hazard=False):
    """Painted metal: noise grime, crevice dirt (AO), bare-metal edge wear (bevel normal against face normal), panel seams."""
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; L = nt.links
    b = [n for n in N if n.type == 'BSDF_PRINCIPLED'][0]
    tc = N.new('ShaderNodeTexCoord')

    def put(sock, v):
        if isinstance(v, (int, float)):
            sock.default_value = v
        elif isinstance(v, tuple):
            sock.default_value = (*v, 1)
        else:
            L.new(v, sock)

    def mix(fac, a, bb):
        n = N.new('ShaderNodeMix'); n.data_type = 'RGBA'
        put(n.inputs[0], fac); put(n.inputs[6], a); put(n.inputs[7], bb)
        return n.outputs[2]

    def math_(op, a, bb=None, clamp=False):
        n = N.new('ShaderNodeMath'); n.operation = op; n.use_clamp = clamp
        put(n.inputs[0], a)
        if bb is not None:
            put(n.inputs[1], bb)
        return n.outputs[0]

    def noise(scale, detail=8.0, lo=0.35, hi=0.7):
        n = N.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = scale; n.inputs['Detail'].default_value = detail
        L.new(tc.outputs['Object'], n.inputs['Vector'])
        r = N.new('ShaderNodeValToRGB'); r.color_ramp.elements[0].position = lo; r.color_ramp.elements[1].position = hi
        L.new(n.outputs[0], r.inputs[0])
        return r.outputs[0]

    base = color
    if hazard:
        w = N.new('ShaderNodeTexWave'); w.inputs['Scale'].default_value = 7.0; w.bands_direction = 'DIAGONAL'
        L.new(tc.outputs['Object'], w.inputs['Vector'])
        r = N.new('ShaderNodeValToRGB'); r.color_ramp.interpolation = 'CONSTANT'; r.color_ramp.elements[1].position = 0.5
        L.new(w.outputs[0], r.inputs[0])
        base = mix(r.outputs[0], (0.02, 0.02, 0.022), (0.95, 0.62, 0.04))
    g = noise(5.0)
    col = mix(math_('MULTIPLY', g, grime), base, tuple(0.35 * c for c in color))
    ao = N.new('ShaderNodeAmbientOcclusion'); ao.inputs['Distance'].default_value = 0.22; ao.samples = 8
    col = mix(math_('POWER', ao.outputs['AO'], 1.6), (0.012, 0.011, 0.010), col)
    bev = N.new('ShaderNodeBevel'); bev.samples = 6; bev.inputs['Radius'].default_value = 0.022
    geo = N.new('ShaderNodeNewGeometry')
    dot = N.new('ShaderNodeVectorMath'); dot.operation = 'DOT_PRODUCT'
    L.new(bev.outputs[0], dot.inputs[0]); L.new(geo.outputs['Normal'], dot.inputs[1])
    edge = math_('MULTIPLY', math_('SUBTRACT', 1.0, dot.outputs['Value']), 9.0, clamp=True)
    wmask = math_('MULTIPLY', math_('MULTIPLY', edge, noise(32.0, 4.0, 0.38, 0.62)), wear, clamp=True)
    col = mix(wmask, col, (0.62, 0.63, 0.66))
    L.new(col, b.inputs['Base Color'])
    L.new(math_('MAXIMUM', wmask, metallic), b.inputs['Metallic'])
    L.new(math_('SUBTRACT', math_('ADD', rough, math_('MULTIPLY', g, 0.22)), math_('MULTIPLY', wmask, 0.25), clamp=True), b.inputs['Roughness'])
    nrm = bev.outputs[0]
    if panels:
        br = N.new('ShaderNodeTexBrick'); br.inputs['Scale'].default_value = panels
        br.inputs['Mortar Size'].default_value = 0.012; br.offset = 0.5
        L.new(tc.outputs['Object'], br.inputs['Vector'])
        bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.55; bp.inputs['Distance'].default_value = 0.012; bp.invert = True
        L.new(br.outputs['Fac'], bp.inputs['Height']); L.new(nrm, bp.inputs['Normal'])
        nrm = bp.outputs[0]
    L.new(nrm, b.inputs['Normal'])
    return m


def plain(name, color, rough=0.4, emit=None, strength=0.0, transmission=0.0, alpha=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = [n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = rough
    if transmission:
        b.inputs['Transmission Weight'].default_value = transmission; b.inputs['IOR'].default_value = 1.35
    if alpha < 1:
        b.inputs['Alpha'].default_value = alpha
    if emit is not None:
        b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
    return m


class Kit:
    """Materials of one tile, built around its accent colour."""
    def __init__(self, a):
        self.accent = a
        grey = (0.30, 0.31, 0.33)
        self.steel = worn('Steel', (0.36, 0.39, 0.43), metallic=0.85, rough=0.34, wear=0.6)
        self.dark = worn('Dark', (0.035, 0.038, 0.048), metallic=0.3, rough=0.55)
        self.deck = worn('Deck', (0.10, 0.11, 0.135), metallic=0.25, rough=0.5, panels=5.0)
        self.paint = worn('Paint', tuple(0.62 * (0.75 * c + 0.25 * g) * (0.45 + 0.55 * c) for c, g in zip(a, grey)), metallic=0.1, rough=0.42, panels=9.0)
        self.hull = worn('Hull', (0.20, 0.215, 0.24), metallic=0.3, rough=0.45, panels=8.0)
        self.white = worn('White', (0.55, 0.56, 0.58), metallic=0.1, rough=0.45, panels=8.0)
        self.haz = worn('Hazard', (0.9, 0.6, 0.05), rough=0.5, hazard=True, grime=0.8)
        self.hot = plain('Glow', a, emit=a, strength=4.2)
        self.soft = plain('GlowSoft', a, emit=a, strength=1.8)
        self.dim = plain('GlowDim', a, emit=a, strength=0.7)
        self.screen = plain('Screen', (0.25, 0.85, 1.0), emit=(0.25, 0.85, 1.0), strength=2.2)
        self.red = plain('Beacon', (1.0, 0.12, 0.08), emit=(1.0, 0.12, 0.08), strength=5.0)
        self.warm = plain('Window', (1.0, 0.80, 0.50), emit=(1.0, 0.80, 0.50), strength=2.6)
        self.glass = plain('Glass', tuple(0.55 + 0.45 * c for c in a), rough=0.06, transmission=0.85, alpha=0.5)
        self.rock = worn('Rock', (0.075, 0.062, 0.055), metallic=0.0, rough=0.85, wear=0.0, grime=0.9)
        self.leaf = plain('Leaf', (0.05, 0.32, 0.08), rough=0.6, emit=(0.15, 0.9, 0.25), strength=0.35)


# ------------------------------------------------------------------------------------------ helpers ----
def fin(ob, m, smooth=True, bevel=0.0):
    ob.data.materials.append(m)
    if bevel:
        bv = ob.modifiers.new('Bevel', 'BEVEL'); bv.width = bevel; bv.segments = 3
    if smooth:
        bpy.context.view_layer.objects.active = ob
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(42))
    return ob


def cyl(r, h, loc, m, verts=48, rot=(0, 0, 0), smooth=True, r2=None, bevel=0.0):
    if r2 is None:
        bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h, location=loc, rotation=rot)
    else:
        bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r2, depth=h, location=loc, rotation=rot)
    return fin(bpy.context.active_object, m, smooth, bevel)


def box(size, loc, m, rot=(0, 0, 0), bevel=0.012):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    ob = bpy.context.active_object; ob.scale = size
    bpy.ops.object.transform_apply(scale=True)
    return fin(ob, m, smooth=False, bevel=bevel)


def sphere(r, loc, m, seg=32, scale=(1, 1, 1), rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=seg // 2, radius=r, location=loc, rotation=rot)
    ob = bpy.context.active_object; ob.scale = scale
    return fin(ob, m)


def torus(R, r, loc, m, rot=(0, 0, 0), scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=loc, rotation=rot, major_segments=64, minor_segments=14)
    ob = bpy.context.active_object; ob.scale = scale
    return fin(ob, m)


def strut(p1, p2, r, m, verts=10):
    p1 = Vector(p1); p2 = Vector(p2); d = p2 - p1
    return cyl(r, d.length, (p1 + p2) / 2, m, verts=verts, rot=d.to_track_quat('Z', 'Y').to_euler())


def pipe(pts, r, m):
    cu = bpy.data.curves.new('Pipe', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 5; cu.use_fill_caps = True
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(pts) - 1)
    for bp, p in zip(sp.bezier_points, pts):
        bp.co = p; bp.handle_left_type = bp.handle_right_type = 'AUTO'
    ob = bpy.data.objects.new('Pipe', cu); bpy.context.scene.collection.objects.link(ob)
    ob.data.materials.append(m)
    return ob


def lamp(loc, color, energy, size=0.06):
    ld = bpy.data.lights.new('P', 'POINT'); ld.energy = energy; ld.color = color; ld.shadow_soft_size = size
    ob = bpy.data.objects.new('P', ld); ob.location = loc; bpy.context.scene.collection.objects.link(ob)


def ring(R, n, a0=0.0):
    return [(R * math.cos(math.radians(a0 + 360.0 * i / n)), R * math.sin(math.radians(a0 + 360.0 * i / n))) for i in range(n)]


CORNERS = [Vector((math.cos(math.radians(30 + 60 * i)), math.sin(math.radians(30 + 60 * i)), 0)) for i in range(6)]


def pad(k, rails=(0, 1)):
    """Hex pad, same footprint as the first tile set: panelled deck, lit groove, corner bollards with lamps, back railing."""
    cyl(1.00, 0.12, (0, 0, 0.06), k.dark, verts=6, rot=HEXROT, smooth=False, bevel=0.02)
    cyl(0.90, 0.13, (0, 0, 0.065), k.deck, verts=6, rot=HEXROT, smooth=False, bevel=0.01)
    cyl(0.86, 0.14, (0, 0, 0.07), k.soft, verts=6, rot=HEXROT, smooth=False)
    cyl(0.80, 0.15, (0, 0, 0.075), k.deck, verts=6, rot=HEXROT, smooth=False, bevel=0.008)
    for c in CORNERS:
        p = c * 0.93
        cyl(0.045, 0.07, (p.x, p.y, 0.155), k.steel, verts=16, bevel=0.006)
        cyl(0.028, 0.02, (p.x, p.y, 0.20), k.hot, verts=16)
    for i in rails:
        a, b = CORNERS[i] * 0.74, CORNERS[(i + 1) % 6] * 0.74
        for t in (0.0, 0.5, 1.0):
            p = a.lerp(b, t); strut((p.x, p.y, 0.15), (p.x, p.y, 0.34), 0.012, k.steel, verts=8)
        for z in (0.25, 0.34):
            strut((a.x, a.y, z), (b.x, b.y, z), 0.010, k.steel, verts=8)


def vents(k, x, y, z0, w, n, step=0.03):
    """Slatted vent on a face looking at the camera (-Y)."""
    for i in range(n):
        box((w, 0.012, 0.016), (x, y, z0 + step * i), k.dark, bevel=0.0)


def cabinet(k, x, y, z=0.15):
    box((0.17, 0.11, 0.28), (x, y, z + 0.14), k.hull, bevel=0.012)
    box((0.11, 0.006, 0.07), (x, y - 0.057, z + 0.20), k.screen, bevel=0.0)
    for i in range(3):
        box((0.018, 0.006, 0.018), (x - 0.035 + 0.035 * i, y - 0.057, z + 0.115), k.soft, bevel=0.0)


def crate(k, x, y, s=0.14, m=None, rot=0.0, z=0.15, band=True):
    box((s, s, s * 0.85), (x, y, z + s * 0.425), m or k.hull, rot=(0, 0, math.radians(rot)), bevel=0.012)
    if band:
        box((s * 1.04, s * 1.04, 0.016), (x, y, z + s * 0.425), k.haz, rot=(0, 0, math.radians(rot)), bevel=0.0)


def tank(k, x, y, z, r, length, m=None, along='y'):
    """Horizontal banded tank on two saddles."""
    m = m or k.paint
    rot = (R90, 0, 0) if along == 'y' else (0, R90, 0)
    cyl(r, length, (x, y, z), m, verts=40, rot=rot)
    for s in (-1, 1):
        o = s * length / 2
        p = (x, y + o, z) if along == 'y' else (x + o, y, z)
        sphere(r, p, m, scale=(1, 0.45, 1) if along == 'y' else (0.45, 1, 1))
        q = (x, y + o * 0.6, z) if along == 'y' else (x + o * 0.6, y, z)
        torus(r * 1.02, 0.010, q, k.steel, rot=rot)
        sz = (r * 1.7, 0.05, r * 0.8) if along == 'y' else (0.05, r * 1.7, r * 0.8)
        box(sz, (q[0], q[1], z - r * 0.95), k.dark, bevel=0.006)


def silo(k, x, y, r, h, m, z=0.15, strip=True):
    """Vertical tank: shell, domed cap, bands, a lit level strip on the camera side."""
    cyl(r, h, (x, y, z + h / 2), m, verts=40, bevel=0.008)
    sphere(r, (x, y, z + h), m, scale=(1, 1, 0.35))
    for t in (0.12, 0.5, 0.88):
        torus(r * 1.01, 0.012, (x, y, z + h * t), k.steel)
    cyl(r * 0.22, 0.05, (x, y, z + h + r * 0.36), k.steel, verts=16)
    if strip:
        box((0.03, 0.012, h * 0.6), (x, y - r - 0.004, z + h * 0.5), k.soft, bevel=0.0)


def tower(k, cx, cy, lv, half, leg=0.026, m=None, brace=None):
    """Four-legged lattice: legs, ring beams and X bracing between the given levels."""
    m = m or k.paint; brace = brace or k.steel
    sg = ((1, 1), (-1, 1), (-1, -1), (1, -1))
    P = [[Vector((cx + sx * h, cy + sy * h, z)) for sx, sy in sg] for z, h in zip(lv, half)]
    for j in range(4):
        strut(P[0][j], P[-1][j], leg, m)
        cyl(leg * 1.9, 0.03, (P[0][j].x, P[0][j].y, lv[0] + 0.005), k.steel, verts=16, bevel=0.005)
    for l in range(len(lv)):
        for j in range(4):
            strut(P[l][j], P[l][(j + 1) % 4], leg * 0.55, m, verts=8)
            if l < len(lv) - 1:
                strut(P[l][j], P[l + 1][(j + 1) % 4], leg * 0.4, brace, verts=8)
                strut(P[l][(j + 1) % 4], P[l + 1][j], leg * 0.4, brace, verts=8)
    return P


def ladder(k, x, y0, z0, y1, z1, n=14, w=0.045):
    for sx in (-w, w):
        strut((x + sx, y0, z0), (x + sx, y1, z1), 0.007, k.steel, verts=8)
    for i in range(1, n):
        t = i / float(n)
        strut((x - w, y0 + (y1 - y0) * t, z0 + (z1 - z0) * t), (x + w, y0 + (y1 - y0) * t, z0 + (z1 - z0) * t), 0.005, k.steel, verts=6)


def mast(k, x, y, z, h, beacon=None):
    cyl(0.012, h, (x, y, z + h / 2), k.steel, verts=8)
    sphere(0.022, (x, y, z + h + 0.01), beacon or k.red, seg=12)


def walkway(k, R, z, n=10, h=0.12):
    """Ring walkway with posts and a hand rail."""
    torus(R, 0.022, (0, 0, z), k.steel)
    for (x, y) in ring(R, n):
        strut((x, y, z), (x, y, z + h), 0.008, k.steel, verts=6)
    torus(R, 0.008, (0, 0, z + h), k.steel)


def hoop(k, x, y, z, r, a_deg, zs=1.0, m=None, t=0.012):
    """One meridian hoop, squashed in z after rotation (dome ribs)."""
    bpy.ops.mesh.primitive_torus_add(major_radius=r, minor_radius=t, location=(0, 0, 0), rotation=(R90, 0, math.radians(a_deg)), major_segments=64, minor_segments=10)
    ob = bpy.context.active_object
    bpy.ops.object.transform_apply(rotation=True)
    ob.scale = (1, 1, zs); ob.location = (x, y, z)
    return fin(ob, m or k.steel)


# ----------------------------------------------------------------------------------------- buildings ----
def central_hub(k):
    pad(k)
    cyl(0.60, 0.20, (0, 0, 0.25), k.hull, verts=8, rot=(0, 0, math.radians(22.5)), smooth=False, bevel=0.02)
    cyl(0.62, 0.02, (0, 0, 0.36), k.haz, verts=8, rot=(0, 0, math.radians(22.5)), smooth=False)
    cyl(0.50, 0.06, (0, 0, 0.39), k.steel, verts=48, bevel=0.01)
    cyl(0.33, 0.78, (0, 0, 0.80), k.white, verts=48, bevel=0.01)
    for z in (0.62, 0.86):
        torus(0.335, 0.016, (0, 0, z), k.soft)
    for (x, y) in ring(0.345, 16, 11.25):
        box((0.035, 0.035, 0.09), (x, y, 0.74), k.warm, rot=(0, 0, math.atan2(y, x)), bevel=0.0)
    for i in range(3):
        a = math.radians(90 + 120 * i)
        box((0.09, 0.30, 0.66), (0.40 * math.cos(a), 0.40 * math.sin(a), 0.72), k.paint, rot=(0, 0, a), bevel=0.02)
        box((0.10, 0.10, 0.10), (0.50 * math.cos(a), 0.50 * math.sin(a), 0.45), k.dark, rot=(0, 0, a))
    walkway(k, 0.47, 1.06, n=12)
    cyl(0.44, 0.07, (0, 0, 1.22), k.hull, verts=48, bevel=0.012)
    cyl(0.40, 0.03, (0, 0, 1.27), k.hot, verts=48)
    cyl(0.36, 0.16, (0, 0, 1.36), k.dark, verts=48, bevel=0.01)
    for (x, y) in ring(0.365, 12):
        box((0.05, 0.02, 0.07), (x, y, 1.37), k.screen, rot=(0, 0, math.atan2(y, x) + R90), bevel=0.0)
    sphere(0.30, (0, 0, 1.44), k.glass, scale=(1, 1, 0.62))
    sphere(0.14, (0, 0, 1.47), k.soft, seg=24)
    for a in (0, 60, 120):
        hoop(k, 0, 0, 1.44, 0.305, a, zs=0.62)
    # dish, mast, door, services
    cyl(0.02, 0.22, (0.30, 0.16, 1.60), k.steel, verts=10)
    cyl(0.17, 0.05, (0.33, 0.13, 1.74), k.white, verts=32, r2=0.03, rot=(math.radians(-50), 0, math.radians(35)))
    mast(k, 0.0, 0.0, 1.62, 0.44, beacon=k.hot)
    cyl(0.008, 0.26, (-0.10, 0.06, 1.72), k.steel, verts=6)
    box((0.16, 0.03, 0.22), (0, -0.585, 0.29), k.dark, bevel=0.006)
    box((0.11, 0.01, 0.17), (0, -0.603, 0.28), k.soft, bevel=0.0)
    for sx in (-1, 1):
        pipe([(sx * 0.30, -0.14, 0.44), (sx * 0.36, -0.20, 0.60), (sx * 0.30, -0.16, 0.95), (sx * 0.24, -0.24, 1.18)], 0.016, k.steel)
    cabinet(k, -0.62, -0.30)
    crate(k, 0.60, -0.36, 0.13, k.paint, rot=12)
    lamp((0, -0.75, 0.55), k.accent, 5.0)
    lamp((0, 0, 1.75), k.accent, 4.0)


def cultivation_hub(k):
    pad(k)
    cyl(0.60, 0.16, (0, 0, 0.23), k.hull, verts=48, bevel=0.015)
    torus(0.60, 0.022, (0, 0, 0.31), k.steel)
    cyl(0.50, 0.02, (0, 0, 0.32), k.dim, verts=48)
    cyl(0.44, 0.05, (0, 0, 0.34), k.rock, verts=32)
    # the garden under glass: a trunk, canopy clumps, low beds
    cyl(0.035, 0.42, (0, 0, 0.56), k.rock, verts=10)
    for (x, y, z, r) in ((0, 0, 0.84, 0.16), (0.11, 0.05, 0.76, 0.11), (-0.10, 0.06, 0.78, 0.12), (0.02, -0.11, 0.74, 0.10), (-0.04, 0.10, 0.90, 0.09)):
        sphere(r, (x, y, z), k.leaf, seg=14, scale=(1, 1, 0.8))
    for (x, y) in ring(0.30, 7, 10):
        sphere(0.07, (x, y, 0.40), k.leaf, seg=10, scale=(1, 1, 0.7))
    sphere(0.05, (0.0, 0.0, 1.02), k.soft, seg=12)
    sphere(0.54, (0, 0, 0.36), k.glass, scale=(1, 1, 1.25))
    for a in (0, 45, 90, 135):
        hoop(k, 0, 0, 0.36, 0.545, a, zs=1.25, t=0.011)
    for z, r in ((0.62, 0.527), (0.86, 0.455)):
        torus(r, 0.010, (0, 0, z), k.steel)
    cyl(0.07, 0.05, (0, 0, 1.05), k.steel, verts=16)
    mast(k, 0, 0, 1.07, 0.22, beacon=k.hot)
    # airlock, nutrient tanks, feed lines
    box((0.22, 0.20, 0.24), (0, -0.62, 0.27), k.white, bevel=0.02)
    box((0.12, 0.01, 0.16), (0, -0.722, 0.26), k.soft, bevel=0.0)
    box((0.24, 0.22, 0.02), (0, -0.62, 0.40), k.haz, bevel=0.0)
    for sx in (-1, 1):
        silo(k, sx * 0.66, 0.16, 0.10, 0.40, k.paint)
        pipe([(sx * 0.66, 0.16, 0.60), (sx * 0.62, 0.10, 0.70), (sx * 0.50, 0.04, 0.62), (sx * 0.46, 0.0, 0.36)], 0.014, k.steel)
    cabinet(k, 0.52, -0.46)
    crate(k, -0.52, -0.46, 0.12, k.paint, rot=-15)
    lamp((0, 0, 0.62), (0.4, 1.0, 0.5), 6.0, 0.2)


def extraction_hub(k):
    pad(k)
    # ore pit and spoil heap
    cyl(0.44, 0.012, (0.10, 0.06, 0.156), k.haz, verts=64)
    cyl(0.38, 0.05, (0.10, 0.06, 0.175), k.hull, verts=48, bevel=0.01)
    cyl(0.30, 0.02, (0.10, 0.06, 0.20), k.dim, verts=48)
    for (x, y, z, r, s) in ((0.10, 0.10, 0.24, 0.20, 0.55), (0.22, 0.02, 0.22, 0.14, 0.6), (-0.02, 0.0, 0.22, 0.13, 0.6), (0.14, -0.08, 0.21, 0.10, 0.7), (0.04, 0.16, 0.30, 0.11, 0.7)):
        sphere(r, (x, y, z), k.rock, seg=10, scale=(1, 1, s), rot=(0.3 * r * 9, 0.2, r * 20))
    for (x, y, z) in ((0.16, -0.02, 0.31), (0.02, 0.08, 0.34), (0.10, 0.20, 0.36)):
        sphere(0.03, (x, y, z), k.hot, seg=8)
    # gantry crane across the pit
    for x in (-0.55, 0.66):
        tower(k, x, 0.10, [0.16, 0.55, 0.95, 1.30], [0.10, 0.09, 0.08, 0.07], leg=0.020)
    box((1.46, 0.10, 0.10), (0.055, 0.10, 1.36), k.paint, bevel=0.012)
    box((1.46, 0.11, 0.02), (0.055, 0.10, 1.30), k.haz, bevel=0.0)
    for x in (-0.3, 0.05, 0.4):
        strut((x - 0.17, 0.10, 1.41), (x, 0.10, 1.52), 0.010, k.steel, verts=8); strut((x + 0.17, 0.10, 1.41), (x, 0.10, 1.52), 0.010, k.steel, verts=8)
    strut((-0.62, 0.10, 1.52), (0.73, 0.10, 1.52), 0.012, k.steel, verts=8)
    box((0.20, 0.16, 0.10), (0.12, 0.10, 1.27), k.hull, bevel=0.012)
    for sx in (-0.03, 0.03):
        strut((0.12 + sx, 0.10, 1.22), (0.12 + sx, 0.10, 0.74), 0.005, k.dark, verts=6)
    box((0.10, 0.10, 0.07), (0.12, 0.10, 0.71), k.steel, bevel=0.01)
    for a in (0, 120, 240):
        strut((0.12, 0.10, 0.69), (0.12 + 0.09 * math.cos(math.radians(a)), 0.10 + 0.09 * math.sin(math.radians(a)), 0.56), 0.012, k.steel, verts=8)
    sphere(0.035, (0.12, 0.10, 0.63), k.hot, seg=12)
    mast(k, 0.66, 0.10, 1.52, 0.26)
    # hopper and conveyor (front left), cabin (front right)
    box((0.26, 0.22, 0.05), (-0.46, -0.38, 0.18), k.dark, bevel=0.006)
    cyl(0.15, 0.22, (-0.46, -0.38, 0.46), k.paint, verts=4, r2=0.07, rot=(math.radians(180), 0, math.radians(45)), smooth=False, bevel=0.01)
    for sx, sy in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
        strut((-0.46 + sx * 0.10, -0.38 + sy * 0.09, 0.20), (-0.46 + sx * 0.10, -0.38 + sy * 0.09, 0.50), 0.010, k.steel, verts=8)
    box((0.50, 0.10, 0.03), (-0.20, -0.28, 0.42), k.dark, rot=(0, math.radians(-22), math.radians(24)), bevel=0.004)
    for t in (0.0, 0.33, 0.66, 1.0):
        strut((-0.42 + 0.44 * t, -0.38 + 0.20 * t, 0.16), (-0.42 + 0.44 * t, -0.38 + 0.20 * t, 0.32 + 0.18 * t), 0.008, k.steel, verts=6)
    box((0.26, 0.22, 0.26), (0.56, -0.36, 0.28), k.white, bevel=0.02)
    box((0.18, 0.01, 0.09), (0.56, -0.472, 0.32), k.warm, bevel=0.0)
    box((0.28, 0.24, 0.02), (0.56, -0.36, 0.42), k.haz, bevel=0.0)
    vents(k, 0.56, -0.472, 0.19, 0.16, 3)
    crate(k, 0.20, -0.56, 0.12, rot=10)
    lamp((0.10, -0.1, 0.55), k.accent, 7.0)


def processing_hub(k):
    pad(k)
    box((1.02, 0.60, 0.05), (0, 0.06, 0.175), k.dark, bevel=0.006)
    box((0.62, 0.50, 0.44), (0.20, 0.08, 0.42), k.hull, bevel=0.02)
    box((0.64, 0.52, 0.02), (0.20, 0.08, 0.60), k.haz, bevel=0.0)
    vents(k, 0.20, -0.172, 0.26, 0.36, 5)
    box((0.50, 0.008, 0.03), (0.20, -0.172, 0.50), k.soft, bevel=0.0)
    box((0.10, 0.012, 0.16), (0.44, -0.174, 0.30), k.dark, bevel=0.0)
    # three distillation columns with ring platforms, ladders and lit caps
    for x, h in ((-0.48, 1.25), (-0.26, 1.50), (-0.04, 1.05)):
        cyl(0.085, h, (x, 0.26, 0.15 + h / 2), k.white if h > 1.4 else k.paint, verts=32, bevel=0.006)
        for t in (0.35, 0.62, 0.86):
            torus(0.105, 0.012, (x, 0.26, 0.15 + h * t), k.steel)
        sphere(0.085, (x, 0.26, 0.15 + h), k.steel, scale=(1, 1, 0.5))
        cyl(0.03, 0.06, (x, 0.26, 0.15 + h + 0.06), k.dark, verts=12)
        cyl(0.022, 0.02, (x, 0.26, 0.15 + h + 0.10), k.hot, verts=12)
        ladder(k, x, 0.17, 0.16, 0.17, 0.15 + h * 0.86, n=int(h * 12), w=0.025)
    pipe([(-0.48, 0.26, 1.10), (-0.42, 0.30, 1.22), (-0.32, 0.30, 1.22), (-0.26, 0.26, 1.10)], 0.016, k.steel)
    pipe([(-0.26, 0.26, 0.90), (-0.18, 0.32, 1.00), (-0.10, 0.30, 0.96), (-0.04, 0.26, 0.86)], 0.016, k.steel)
    # reactor drum on the roof, pipe rack to the columns
    tank(k, 0.22, 0.10, 0.76, 0.12, 0.40, m=k.paint, along='x')
    torus(0.125, 0.014, (0.22, 0.10, 0.76), k.hot, rot=(0, R90, 0))
    for y in (-0.04, 0.02, 0.08):
        pipe([(-0.04, 0.26 + y * 0.2, 0.50 + y), (0.0, 0.10 + y, 0.70 + y), (0.06, 0.02 + y, 0.74 + y), (0.10, 0.0 + y, 0.66)], 0.012, k.steel)
    # flare stack with a lattice collar
    cyl(0.03, 1.30, (0.60, 0.30, 0.80), k.steel, verts=16)
    tower(k, 0.60, 0.30, [0.16, 0.55, 0.95], [0.09, 0.07, 0.05], leg=0.012)
    cyl(0.045, 0.06, (0.60, 0.30, 1.47), k.dark, verts=16)
    sphere(0.05, (0.60, 0.30, 1.55), k.hot, seg=12, scale=(1, 1, 1.5))
    lamp((0.60, 0.30, 1.62), k.accent, 5.0)
    cabinet(k, -0.56, -0.38)
    crate(k, -0.28, -0.52, 0.13, k.paint, rot=-8)
    crate(k, -0.10, -0.58, 0.10, rot=20)
    lamp((0.0, -0.45, 0.5), k.accent, 3.0)


def storage_hub(k):
    pad(k)
    spots = ((-0.40, 0.22, 0.27, 0.86, k.paint), (0.22, 0.32, 0.27, 1.00, k.white), (0.08, -0.26, 0.25, 0.72, k.paint))
    for (x, y, r, h, m) in spots:
        cyl(r + 0.03, 0.04, (x, y, 0.17), k.dark, verts=40, bevel=0.006)
        silo(k, x, y, r, h, m, z=0.19)
        for i in range(8):
            a = math.radians(45 * i + 22)
            strut((x + r * math.cos(a), y + r * math.sin(a), 0.19), (x + r * math.cos(a), y + r * math.sin(a), 0.19 + h), 0.008, k.steel, verts=6)
    # catwalk between the two rear silos, with a railing, and a ladder up the tallest
    a, b = Vector((-0.40, 0.22, 1.02)), Vector((0.22, 0.32, 1.02))
    strut(a, b, 0.022, k.steel)
    box(((b - a).length, 0.10, 0.015), (a + b) / 2 + Vector((0, 0, 0.02)), k.dark, rot=(0, 0, math.atan2(b.y - a.y, b.x - a.x)), bevel=0.0)
    for t in (0.2, 0.5, 0.8):
        p = a.lerp(b, t); strut((p.x, p.y - 0.05, 1.03), (p.x, p.y - 0.05, 1.15), 0.007, k.steel, verts=6)
    strut((a.x + 0.1, a.y - 0.04, 1.15), (b.x - 0.1, b.y - 0.06, 1.15), 0.007, k.steel, verts=6)
    ladder(k, 0.22, 0.045, 0.20, 0.045, 1.16, n=14, w=0.03)
    # manifold at the base and stacked containers in front
    pipe([(-0.40, -0.05, 0.26), (-0.30, -0.14, 0.24), (-0.18, -0.20, 0.24)], 0.026, k.steel)
    pipe([(0.33, -0.26, 0.26), (0.46, -0.16, 0.26), (0.48, 0.02, 0.30), (0.42, 0.14, 0.34)], 0.026, k.steel)
    for (x, y, z) in ((-0.20, -0.20, 0.24), (0.46, -0.16, 0.26)):
        cyl(0.04, 0.03, (x, y, z + 0.04), k.hot, verts=12)
    for (x, y, z, m, r) in ((-0.48, -0.40, 0.15, k.hull, 8), (-0.30, -0.50, 0.15, k.paint, -6), (-0.42, -0.44, 0.275, k.paint, 14)):
        crate(k, x, y, 0.15, m, rot=r, z=z)
    cabinet(k, 0.56, -0.40)
    mast(k, 0.22, 0.32, 1.33, 0.26)
    lamp((0.05, -0.55, 0.5), k.accent, 4.0)


def farm_hub(k):
    pad(k)
    cyl(0.66, 0.10, (0, 0, 0.20), k.hull, verts=48, bevel=0.012)
    cyl(0.60, 0.02, (0, 0, 0.26), k.rock, verts=48)
    # crop rings under a low glasshouse dome, an irrigation mast with arms and drip lights
    for r, n in ((0.48, 20), (0.34, 14), (0.20, 8)):
        for (x, y) in ring(r, n):
            sphere(0.045, (x, y, 0.29), k.leaf, seg=8, scale=(1, 1, 0.9))
        torus(r - 0.07, 0.008, (0, 0, 0.275), k.dim)
    cyl(0.03, 0.44, (0, 0, 0.48), k.steel, verts=12)
    for a in (20, 110, 200, 290):
        ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
        strut((0, 0, 0.66), (0.46 * ca, 0.46 * sa, 0.60), 0.008, k.steel, verts=6)
        for t in (0.45, 0.75, 1.0):
            sphere(0.016, (0.46 * ca * t, 0.46 * sa * t, 0.655 - 0.06 * t), k.hot, seg=8)
    sphere(0.60, (0, 0, 0.25), k.glass, scale=(1, 1, 0.78))
    for a in (0, 30, 60, 90, 120, 150):
        hoop(k, 0, 0, 0.25, 0.605, a, zs=0.78, t=0.010)
    torus(0.52, 0.010, (0, 0, 0.49), k.steel)
    cyl(0.08, 0.05, (0, 0, 0.73), k.steel, verts=16)
    sphere(0.035, (0, 0, 0.78), k.hot, seg=12)
    # perimeter grow-light posts joined by a ring, entry, water tank and pump
    for (x, y) in ring(0.72, 6, 0):
        strut((x, y, 0.15), (x, y, 0.80), 0.014, k.steel, verts=8)
        box((0.08, 0.03, 0.02), (x * 0.94, y * 0.94, 0.80), k.soft, rot=(0, 0, math.atan2(y, x) + R90), bevel=0.0)
    torus(0.72, 0.010, (0, 0, 0.78), k.steel)
    box((0.20, 0.16, 0.20), (0, -0.70, 0.25), k.white, bevel=0.02)
    box((0.11, 0.01, 0.14), (0, -0.782, 0.24), k.soft, bevel=0.0)
    silo(k, -0.60, 0.42, 0.09, 0.34, k.paint)
    pipe([(-0.60, 0.42, 0.52), (-0.56, 0.36, 0.60), (-0.46, 0.30, 0.50), (-0.42, 0.26, 0.28)], 0.013, k.steel)
    cabinet(k, 0.50, -0.52)
    lamp((0, 0, 0.55), (0.5, 1.0, 0.5), 7.0, 0.25)


def power_plant(k):
    pad(k)
    cyl(0.56, 0.12, (0, 0, 0.21), k.hull, verts=48, bevel=0.012)
    cyl(0.58, 0.012, (0, 0, 0.276), k.haz, verts=48)
    # containment ring around a lit core, clamped by four pylons with insulator stacks
    cyl(0.20, 0.30, (0, 0, 0.42), k.dark, verts=32, bevel=0.01)
    sphere(0.27, (0, 0, 0.70), k.hot)
    torus(0.46, 0.105, (0, 0, 0.70), k.steel)
    for a in range(0, 360, 30):
        torus(0.108, 0.010, (0.46 * math.cos(math.radians(a)), 0.46 * math.sin(math.radians(a)), 0.70), k.dark, rot=(R90, 0, math.radians(a)))
    for a in (45, 135, 225, 315):
        ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
        box((0.11, 0.11, 0.80), (0.60 * ca, 0.60 * sa, 0.55), k.paint, rot=(0, 0, math.radians(a)), bevel=0.014)
        box((0.20, 0.07, 0.07), (0.50 * ca, 0.50 * sa, 0.70), k.steel, rot=(0, 0, math.radians(a)), bevel=0.01)
        for i in range(4):
            torus(0.045, 0.014, (0.60 * ca, 0.60 * sa, 0.98 + 0.035 * i), k.white)
        cyl(0.012, 0.16, (0.60 * ca, 0.60 * sa, 1.17), k.steel, verts=8)
        sphere(0.02, (0.60 * ca, 0.60 * sa, 1.26), k.hot, seg=10)
        pipe([(0.60 * ca, 0.60 * sa, 1.22), (0.40 * ca, 0.40 * sa, 1.16), (0.16 * ca, 0.16 * sa, 1.24), (0.06 * ca, 0.06 * sa, 1.36)], 0.008, k.dark)
    # heat exchanger stack with a coil, fins and a cap
    cyl(0.07, 0.62, (0, 0, 1.22), k.steel, verts=24)
    n, turns = 56, 7.0
    pipe([(0.10 * math.cos(2 * math.pi * turns * i / n), 0.10 * math.sin(2 * math.pi * turns * i / n), 0.98 + 0.40 * i / n) for i in range(n + 1)], 0.012, k.paint)
    for i in range(8):
        box((0.36, 0.012, 0.16), (0, 0, 1.46), k.steel, rot=(0, 0, math.radians(22.5 * i)), bevel=0.0)
    cyl(0.10, 0.04, (0, 0, 1.56), k.dark, verts=24)
    cyl(0.06, 0.02, (0, 0, 1.59), k.hot, verts=24)
    # transformers and switchgear in front
    for x in (-0.20, 0.20):
        box((0.22, 0.16, 0.22), (x, -0.66, 0.26), k.hull, bevel=0.015)
        vents(k, x, -0.742, 0.20, 0.14, 4, step=0.028)
        for sx in (-0.06, 0.06):
            for i in range(3):
                torus(0.022, 0.009, (x + sx, -0.66, 0.39 + 0.022 * i), k.white)
            sphere(0.014, (x + sx, -0.66, 0.46), k.hot, seg=8)
    cabinet(k, 0.60, -0.36)
    lamp((0, -0.55, 0.70), k.accent, 9.0)
    lamp((0, 0, 1.70), k.accent, 3.0)


def crew_quarters(k):
    pad(k)
    tiers = ((0.96, 0.52, 0.00, 0.10, 0.15), (0.80, 0.46, -0.07, 0.14, 0.45), (0.58, 0.40, 0.08, 0.18, 0.75))
    for i, (w, d, x, y, z) in enumerate(tiers):
        box((w, d, 0.28), (x, y, z + 0.14), k.white if i != 1 else k.hull, bevel=0.022)
        box((w + 0.03, d + 0.03, 0.025), (x, y, z + 0.29), k.dark, bevel=0.004)
        n = int(w / 0.13)
        for j in range(n):
            wx = x - w / 2 + 0.09 + j * (w - 0.18) / max(1, n - 1)
            lit = (i * 3 + j) % 4 != 0
            box((0.06, 0.012, 0.09), (wx, y - d / 2 - 0.003, z + 0.16), k.warm if lit else k.dark, bevel=0.0)
            box((0.075, 0.02, 0.012), (wx, y - d / 2 - 0.008, z + 0.105), k.steel, bevel=0.0)
        box((w, 0.012, 0.02), (x, y - d / 2 - 0.004, z + 0.04), k.paint, bevel=0.0)
    # door and awning, balcony rails on the set-backs, external stair
    box((0.10, 0.012, 0.18), (0.36, -0.166, 0.24), k.soft, bevel=0.0)
    box((0.16, 0.08, 0.015), (0.36, -0.20, 0.35), k.paint, bevel=0.0)
    for (x0, x1, y, z) in ((-0.47, 0.33, -0.15, 0.465), (-0.21, 0.37, -0.085, 0.765)):
        for t in (0.0, 0.25, 0.5, 0.75, 1.0):
            x = x0 + (x1 - x0) * t; strut((x, y, z), (x, y, z + 0.10), 0.006, k.steel, verts=6)
        strut((x0, y, z + 0.10), (x1, y, z + 0.10), 0.006, k.steel, verts=6)
    for i in range(7):
        box((0.10, 0.05, 0.02), (-0.56, 0.02 + 0.05 * i, 0.19 + 0.043 * i), k.steel, bevel=0.0)
    strut((-0.61, 0.0, 0.26), (-0.61, 0.34, 0.55), 0.006, k.steel, verts=6)
    # roof: water tank, cooling units, dish, mast
    tank(k, 0.14, 0.24, 1.14, 0.07, 0.22, m=k.paint, along='x')
    for x in (-0.10, 0.02):
        box((0.09, 0.09, 0.07), (x, 0.12, 1.10), k.hull, bevel=0.01)
        cyl(0.03, 0.012, (x, 0.12, 1.14), k.dark, verts=12)
    cyl(0.09, 0.03, (0.30, 0.10, 1.16), k.white, verts=24, r2=0.02, rot=(math.radians(-45), 0, math.radians(-30)))
    mast(k, -0.14, 0.26, 1.065, 0.40)
    box((0.10, 0.10, 0.08), (-0.36, 0.20, 0.80), k.hull, bevel=0.01)
    # yard: planter, bench crates, lamp post
    box((0.30, 0.10, 0.05), (-0.30, -0.42, 0.175), k.dark, bevel=0.008)
    for x in (-0.40, -0.30, -0.20):
        sphere(0.045, (x, -0.42, 0.23), k.leaf, seg=8)
    crate(k, 0.10, -0.50, 0.11, k.paint, rot=8)
    strut((0.62, -0.30, 0.15), (0.62, -0.30, 0.62), 0.010, k.steel, verts=8)
    sphere(0.03, (0.62, -0.30, 0.64), k.warm, seg=10)
    lamp((0.36, -0.45, 0.4), (1.0, 0.8, 0.5), 3.0)
    lamp((0.62, -0.34, 0.62), (1.0, 0.8, 0.5), 2.0)


def extractor(k):
    pad(k)
    # bore: hazard ring, collar, lit shaft mouth
    cyl(0.40, 0.012, (0, 0, 0.156), k.haz, verts=64)
    cyl(0.30, 0.07, (0, 0, 0.185), k.hull, verts=48, bevel=0.012)
    torus(0.30, 0.022, (0, 0, 0.225), k.steel)
    cyl(0.19, 0.02, (0, 0, 0.225), k.hot, verts=48)
    for (x, y) in ring(0.255, 12):
        cyl(0.014, 0.02, (x, y, 0.228), k.steel, verts=8)
    # derrick with a ladder up the front face
    lv = [0.16, 0.50, 0.82, 1.12, 1.40]; half = [0.34, 0.285, 0.235, 0.19, 0.15]
    tower(k, 0, 0, lv, half)
    ladder(k, 0, -half[0] - 0.01, lv[0], -half[4] - 0.01, lv[4], n=16)
    # drill string: shaft, auger flight, travelling block
    cyl(0.034, 1.30, (0, 0, 0.82), k.steel, verts=24)
    turns, n = 5.0, 60
    pipe([(0.085 * math.cos(2 * math.pi * turns * i / n), 0.085 * math.sin(2 * math.pi * turns * i / n), 0.26 + 0.52 * i / n) for i in range(n + 1)], 0.016, k.steel)
    box((0.22, 0.22, 0.12), (0, 0, 0.96), k.hull, bevel=0.015)
    torus(0.075, 0.016, (0, 0, 0.89), k.hot)
    for sx in (-1, 1):
        strut((sx * 0.085, 0, 1.02), (sx * 0.10, 0, 1.40), 0.007, k.dark, verts=6)
    # crown: drive head, motor, vents, beacon, mast
    box((0.40, 0.40, 0.05), (0, 0, 1.425), k.steel, bevel=0.008)
    box((0.34, 0.32, 0.20), (0, 0, 1.55), k.paint, bevel=0.018)
    box((0.36, 0.34, 0.025), (0, 0, 1.50), k.haz, bevel=0.0)
    vents(k, 0, -0.166, 1.535, 0.22, 5, step=0.026)
    cyl(0.07, 0.30, (0.0, 0.03, 1.69), k.steel, verts=24, rot=(0, R90, 0), bevel=0.008)
    for x in (-0.11, 0.0, 0.11):
        torus(0.072, 0.008, (x, 0.03, 1.69), k.dark, rot=(0, R90, 0))
    mast(k, 0.12, 0.12, 1.65, 0.42)
    cyl(0.03, 0.03, (-0.12, -0.10, 1.665), k.dark, verts=12)
    sphere(0.028, (-0.12, -0.10, 1.69), k.hot, seg=12)
    # pump skid, slurry tank, control cabinet, crates
    box((0.40, 0.32, 0.05), (0.52, -0.22, 0.18), k.dark, bevel=0.006)
    box((0.32, 0.26, 0.24), (0.52, -0.22, 0.325), k.hull, bevel=0.02)
    vents(k, 0.52, -0.354, 0.25, 0.20, 6)
    box((0.10, 0.008, 0.03), (0.52, -0.352, 0.425), k.soft, bevel=0.0)
    cyl(0.03, 0.22, (0.62, -0.14, 0.55), k.steel, verts=16)
    cyl(0.038, 0.03, (0.62, -0.14, 0.665), k.dark, verts=16)
    pipe([(0.40, -0.10, 0.36), (0.36, -0.02, 0.44), (0.28, 0.0, 0.40), (0.24, 0.0, 0.24)], 0.028, k.steel)
    tank(k, -0.52, 0.22, 0.36, 0.15, 0.46)
    cyl(0.03, 0.05, (-0.52, 0.22, 0.525), k.steel, verts=16)
    pipe([(-0.52, 0.22, 0.54), (-0.50, 0.20, 0.62), (-0.38, 0.14, 0.60), (-0.30, 0.08, 0.40), (-0.24, 0.04, 0.24)], 0.020, k.steel)
    cabinet(k, -0.50, -0.36)
    crate(k, -0.24, -0.50, 0.14)
    crate(k, -0.07, -0.56, 0.11, k.paint, rot=18, band=False)
    lamp((0, 0, 0.36), k.accent, 9.0)
    lamp((0, -0.2, 0.9), k.accent, 3.0)


def processor(k):
    pad(k)
    box((0.96, 0.62, 0.05), (0.02, 0.04, 0.175), k.dark, bevel=0.006)
    # furnace vessel with lit bands, a feed hopper and chute on top
    cyl(0.28, 0.80, (-0.24, 0.12, 0.60), k.paint, verts=48, bevel=0.01)
    sphere(0.28, (-0.24, 0.12, 1.00), k.paint, scale=(1, 1, 0.4))
    for z in (0.36, 0.62, 0.88):
        torus(0.285, 0.016, (-0.24, 0.12, z), k.steel)
    for z in (0.49, 0.75):
        torus(0.283, 0.012, (-0.24, 0.12, z), k.hot)
    box((0.14, 0.02, 0.18), (-0.24, -0.165, 0.42), k.dark, bevel=0.006)
    box((0.09, 0.01, 0.10), (-0.24, -0.178, 0.42), k.hot, bevel=0.0)
    cyl(0.20, 0.20, (-0.24, 0.12, 1.26), k.hull, verts=4, r2=0.06, rot=(math.radians(180), 0, math.radians(45)), smooth=False, bevel=0.01)
    cyl(0.06, 0.10, (-0.24, 0.12, 1.12), k.steel, verts=16)
    for sx, sy in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
        strut((-0.24 + sx * 0.13, 0.12 + sy * 0.13, 1.05), (-0.24 + sx * 0.14, 0.12 + sy * 0.14, 1.34), 0.008, k.steel, verts=6)
    ladder(k, -0.52, 0.12, 0.20, 0.12, 1.02, n=12, w=0.025)
    # control block, exhaust stack, pipe loop, outfeed
    box((0.40, 0.44, 0.40), (0.36, 0.00, 0.40), k.hull, bevel=0.02)
    box((0.42, 0.46, 0.02), (0.36, 0.00, 0.56), k.haz, bevel=0.0)
    vents(k, 0.36, -0.222, 0.26, 0.26, 5)
    box((0.30, 0.008, 0.03), (0.36, -0.222, 0.48), k.soft, bevel=0.0)
    cyl(0.045, 0.70, (0.46, 0.14, 0.95), k.steel, verts=20)
    for z in (0.80, 1.05):
        torus(0.05, 0.009, (0.46, 0.14, z), k.dark)
    cyl(0.055, 0.05, (0.46, 0.14, 1.31), k.dark, verts=20)
    cyl(0.035, 0.02, (0.46, 0.14, 1.34), k.hot, verts=20)
    pipe([(0.04, 0.12, 0.80), (0.14, 0.10, 0.92), (0.28, 0.06, 0.84), (0.30, 0.04, 0.62)], 0.030, k.steel)
    pipe([(-0.02, 0.0, 0.40), (0.06, -0.10, 0.36), (0.14, -0.10, 0.36)], 0.024, k.steel)
    torus(0.036, 0.009, (0.14, 0.10, 0.92), k.paint, rot=(0, R90, 0))
    box((0.34, 0.12, 0.03), (0.34, -0.44, 0.24), k.dark, bevel=0.004)
    for x in (0.22, 0.34, 0.46):
        box((0.07, 0.07, 0.05), (x, -0.44, 0.28), k.soft if x == 0.34 else k.steel, bevel=0.008)
    cabinet(k, -0.58, -0.36)
    crate(k, -0.02, -0.56, 0.12, k.paint, rot=-12)
    lamp((-0.24, -0.40, 0.45), k.accent, 6.0)


def storage_module(k):
    pad(k)
    box((0.98, 1.02, 0.03), (0, -0.02, 0.165), k.dark, bevel=0.004)
    spots = ((-0.25, 0.22, 0.18, k.hull), (0.25, 0.22, 0.18, k.paint), (-0.25, -0.26, 0.18, k.paint), (0.25, -0.26, 0.18, k.white), (0.0, -0.02, 0.60, k.hull), (-0.25, 0.22, 0.60, k.paint))
    for (x, y, z, m) in spots:
        box((0.44, 0.44, 0.40), (x, y, z + 0.20), m, bevel=0.022)
        for s in (-1, 1):
            box((0.46, 0.46, 0.025), (x, y, z + 0.20 + s * 0.17), k.steel, bevel=0.0)
        for j in range(5):
            box((0.012, 0.012, 0.30), (x - 0.16 + 0.08 * j, y - 0.222, z + 0.20), k.dark, bevel=0.0)
        box((0.16, 0.012, 0.03), (x, y - 0.224, z + 0.34), k.soft, bevel=0.0)
        box((0.05, 0.014, 0.05), (x + 0.15, y - 0.224, z + 0.08), k.haz, bevel=0.0)
    # lifting frame over the stack, hoist, tie-downs
    for (x, y) in ((-0.52, 0.48), (0.52, 0.48), (-0.52, -0.52), (0.52, -0.52)):
        strut((x, y, 0.15), (x, y, 1.24), 0.020, k.paint)
        cyl(0.04, 0.03, (x, y, 0.165), k.steel, verts=12)
    for y in (0.48, -0.52):
        strut((-0.52, y, 1.24), (0.52, y, 1.24), 0.018, k.paint)
        strut((-0.52, y, 0.80), (-0.30, y, 1.24), 0.008, k.steel, verts=6); strut((0.52, y, 0.80), (0.30, y, 1.24), 0.008, k.steel, verts=6)
    for x in (-0.52, 0.52):
        strut((x, 0.48, 1.24), (x, -0.52, 1.24), 0.018, k.paint)
    box((0.10, 1.00, 0.06), (0.0, -0.02, 1.26), k.steel, bevel=0.008)
    box((0.16, 0.14, 0.09), (0.0, -0.02, 1.20), k.hull, bevel=0.012)
    strut((0, -0.02, 1.16), (0, -0.02, 1.04), 0.006, k.dark, verts=6)
    box((0.07, 0.07, 0.04), (0, -0.02, 1.03), k.hot, bevel=0.008)
    for (x, y) in ((0.42, -0.60), (0.52, -0.56), (0.47, -0.66)):
        cyl(0.045, 0.13, (x, y, 0.215), k.paint, verts=16, bevel=0.006)
        torus(0.046, 0.006, (x, y, 0.23), k.steel)
    cabinet(k, -0.62, -0.50)
    lamp((0, -0.65, 0.6), k.accent, 5.0)
    lamp((0, -0.02, 1.0), k.accent, 1.5)


def farm(k):
    pad(k)
    # three hydroponic tunnels: bed, lit crop rows, glass vault, hoops, end frames
    for y in (-0.42, 0.0, 0.42):
        box((1.14, 0.36, 0.06), (0, y, 0.18), k.hull, bevel=0.01)
        box((1.04, 0.26, 0.02), (0, y, 0.215), k.dim, bevel=0.0)
        for i in range(11):
            for sy in (-0.07, 0.07):
                sphere(0.034, (-0.48 + 0.096 * i, y + sy, 0.245), k.leaf, seg=8, scale=(1, 1, 1.1))
        cyl(0.17, 1.08, (0, y, 0.21), k.glass, rot=(0, R90, 0), verts=32)
        for x in (-0.54, -0.27, 0.0, 0.27, 0.54):
            torus(0.175, 0.010, (x, y, 0.21), k.steel, rot=(0, R90, 0))
        strut((-0.54, y, 0.385), (0.54, y, 0.385), 0.008, k.steel, verts=6)
        for i in range(5):
            sphere(0.012, (-0.40 + 0.20 * i, y, 0.37), k.hot, seg=8)
    # irrigation manifold along the right side with valves, a water tank and pump, grow-light posts
    pipe([(0.64, -0.50, 0.24), (0.66, 0.0, 0.26), (0.64, 0.50, 0.24)], 0.022, k.steel)
    for y in (-0.42, 0.0, 0.42):
        strut((0.57, y, 0.24), (0.66, y, 0.25), 0.014, k.steel, verts=8)
        cyl(0.03, 0.03, (0.66, y, 0.29), k.paint, verts=12)
    silo(k, -0.70, 0.30, 0.085, 0.40, k.paint)
    pipe([(-0.70, 0.30, 0.58), (-0.68, 0.24, 0.66), (-0.62, 0.14, 0.52), (-0.60, 0.04, 0.30)], 0.013, k.steel)
    for (x, y) in ((-0.62, -0.60), (0.62, -0.62), (0.0, 0.70)):
        strut((x, y, 0.15), (x, y, 0.62), 0.010, k.steel, verts=8)
        box((0.12, 0.04, 0.02), (x, y, 0.63), k.soft, bevel=0.0)
    cabinet(k, -0.70, -0.14)
    crate(k, 0.30, -0.70, 0.10, k.paint, rot=10)
    lamp((0, -0.8, 0.5), (0.5, 1.0, 0.5), 4.0)
    lamp((0, 0, 0.7), (0.5, 1.0, 0.5), 5.0, 0.3)


KINDS = {
    'central_hub': central_hub, 'cultivation_hub': cultivation_hub, 'extraction_hub': extraction_hub,
    'processing_hub': processing_hub, 'storage_hub': storage_hub, 'farm_hub': farm_hub, 'power_plant': power_plant,
    'crew_quarters': crew_quarters, 'extractor': extractor, 'processor': processor, 'storage_module': storage_module,
    'farm': farm,
}


# --------------------------------------------------------------------------------------------- scene ----
def sun(name, energy, travel, color, angle):
    ld = bpy.data.lights.new(name, 'SUN'); ld.energy = energy; ld.color = color; ld.angle = math.radians(angle)
    ob = bpy.data.objects.new(name, ld); bpy.context.scene.collection.objects.link(ob)
    ob.rotation_euler = Vector(travel).normalized().to_track_quat('-Z', 'Y').to_euler()


def setup_scene():
    bpy.ops.wm.read_homefile(use_empty=True)
    sc = bpy.context.scene
    w = bpy.data.worlds.new('W'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs['Color'].default_value = (0.50, 0.52, 0.58, 1); bg.inputs['Strength'].default_value = 0.22
    cd = bpy.data.cameras.new('Cam'); cd.type = 'ORTHO'; cd.ortho_scale = 3.1; cd.clip_end = 100
    cam = bpy.data.objects.new('Cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    el = math.radians(ELEV)
    cam.location = Vector((0, -10 * math.cos(el), 10 * math.sin(el))) + Vector((0, 0, 0.72))
    cam.rotation_euler = (Vector((0, 0, 0.72)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
    sun('Key', 3.2, (0.55, 0.45, -0.70), (1.0, 0.96, 0.90), 6.0)
    sun('Rim', 2.4, (-0.35, -0.75, -0.45), (0.65, 0.80, 1.0), 3.0)
    sun('Fill', 0.6, (-0.6, 0.3, -0.5), (0.8, 0.85, 1.0), 20.0)
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
    sc.render.resolution_x = RES; sc.render.resolution_y = RES; sc.render.resolution_percentage = 100
    sc.render.film_transparent = True
    sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'; sc.view_settings.exposure = 0.3
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    return sc


unknown = [x for x in ONLY if x not in KINDS]
if unknown:
    raise SystemExit('unknown kind: ' + ', '.join(unknown))
for kind, build in KINDS.items():
    if ONLY and kind not in ONLY:
        continue
    sc = setup_scene()
    build(Kit(ACCENT[kind]))
    out = os.path.join(OUT_DIR, kind + '.png')
    if os.path.exists(out):
        os.remove(out)                      # a stale file must never read as this run's render
    sc.render.filepath = out
    bpy.ops.render.render(write_still=True)
    print('TILE_REPORT', kind, os.path.exists(out), os.path.getsize(out) if os.path.exists(out) else -1, flush=True)
