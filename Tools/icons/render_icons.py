# render_icons.py - Cycles icons for the resource FORMS used by Utils/ResourceIcons.js (one icon per form, not per
# resource: 3,526 resources collapse onto 19 shapes). Raw forms render once in natural colours; crafted forms render
# once per category with the glowing accent in that category's colour (resource-visual.css --processed/--component/
# --advanced). Same camera, lights and frame for every icon so they sit together in a row of pills.
#   blender -b -P render_icons.py -- <out_dir> <res> <samples> [form ...]
# Output: <out_dir>/<form>.png (raw) and <out_dir>/<form>_<category>.png (crafted).
import sys, os, math, random
import bpy, bmesh
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index('--') + 1:]
OUT = os.path.abspath(argv[0])
RES, SAMPLES = int(argv[1]), int(argv[2])
ONLY = set(argv[3:])
os.makedirs(OUT, exist_ok=True)

ACCENT = {'processed': (0.164, 0.623, 0.811), 'component': (0.184, 0.662, 0.521), 'advanced': (0.580, 0.462, 0.858)}
RAW = (0.866, 0.455, 0.161)


def srgb(c):
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)


# ---------------------------------------------------------------------------------------------- scene
def reset():
    for o in list(bpy.data.objects):
        if o.type not in ('CAMERA', 'LIGHT'):          # setup() builds the studio once; keep it
            bpy.data.objects.remove(o, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.metaballs):
        for b in list(coll):
            coll.remove(b)


def setup():
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences
        prefs.compute_device_type = 'OPTIX'; prefs.get_devices()
        for d in prefs.devices:
            d.use = (d.type == 'OPTIX')
        sc.cycles.device = 'GPU'
    except Exception as e:
        print('GPU unavailable, CPU fallback:', e, flush=True); sc.cycles.device = 'CPU'
    sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
    sc.cycles.transparent_max_bounces = 16; sc.cycles.transmission_bounces = 12
    sc.render.resolution_x = sc.render.resolution_y = RES; sc.render.resolution_percentage = 100
    sc.render.film_transparent = True
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    w = bpy.data.worlds.new('Studio'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs['Color'].default_value = (0.42, 0.48, 0.60, 1); bg.inputs['Strength'].default_value = 0.45
    # camera: orthographic three-quarter view from the front-right, looking slightly down
    cd = bpy.data.cameras.new('Cam'); cd.type = 'ORTHO'; cd.ortho_scale = 2.55
    cam = bpy.data.objects.new('Cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    az, el = math.radians(-38), math.radians(26)
    d = Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
    cam.location = d * 10; cam.rotation_euler = (-d).to_track_quat('-Z', 'Y').to_euler()
    for name, energy, travel, col in (('Key', 4.0, (0.55, 0.45, -0.70), (1.0, 0.97, 0.92)),
                                      ('Rim', 5.0, (-0.70, -0.55, -0.20), (0.75, 0.85, 1.0)),
                                      ('Fill', 0.8, (-0.4, 0.8, -0.3), (0.8, 0.85, 1.0))):
        ld = bpy.data.lights.new(name, 'SUN'); ld.energy = energy; ld.color = col; ld.angle = math.radians(8)
        ob = bpy.data.objects.new(name, ld); sc.collection.objects.link(ob)
        ob.rotation_euler = Vector(travel).normalized().to_track_quat('-Z', 'Y').to_euler()
    return sc


def render(path):
    sc = bpy.context.scene
    if os.path.exists(path):
        os.remove(path)
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print('RENDER_REPORT', os.path.basename(path), os.path.exists(path), os.path.getsize(path) if os.path.exists(path) else -1, flush=True)


# ---------------------------------------------------------------------------------------------- materials
def principled(name, color, metal=0.0, rough=0.5, emit=None, emit_strength=0.0, transmission=0.0, ior=1.45, alpha=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    out = [n for n in m.node_tree.nodes if n.type == 'OUTPUT_MATERIAL'][0]; out.target = 'ALL'
    b = [n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Metallic'].default_value = metal
    b.inputs['Roughness'].default_value = rough
    b.inputs['Transmission Weight'].default_value = transmission; b.inputs['IOR'].default_value = ior
    b.inputs['Alpha'].default_value = alpha
    if emit:
        b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = emit_strength
    return m


def glow(name, color, strength=6.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    N = m.node_tree.nodes; N.clear()
    out = N.new('ShaderNodeOutputMaterial'); out.target = 'ALL'
    # strengths were authored on a scale where 6 clipped every accent to white; x0.28 keeps the hue (processed blue
    # and component green must stay apart at 24 px)
    e = N.new('ShaderNodeEmission'); e.inputs['Color'].default_value = (*color, 1); e.inputs['Strength'].default_value = strength * 0.28
    m.node_tree.links.new(e.outputs[0], out.inputs['Surface'])
    return m


def gunmetal():
    return principled('Gunmetal', (0.11, 0.12, 0.14), metal=0.85, rough=0.38)


def steel():
    return principled('Steel', (0.42, 0.44, 0.47), metal=0.9, rough=0.32)


# ---------------------------------------------------------------------------------------------- mesh helpers
def obj(name, bm, mat, smooth=True, bevel=0.0, segs=3, loc=(0, 0, 0), rot=(0, 0, 0), scale=(1, 1, 1)):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = smooth
    ob = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(ob)
    ob.location = loc; ob.rotation_euler = rot; ob.scale = scale
    me.materials.append(mat)
    bpy.context.view_layer.update()          # matrix_world is stale until an update; forms place parts with it
    if bevel:
        bv = ob.modifiers.new('Bevel', 'BEVEL'); bv.width = bevel; bv.segments = segs; bv.limit_method = 'ANGLE'
        bv.harden_normals = True
    return ob


def cube(sx, sy, sz):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(sx, sy, sz), verts=bm.verts)
    return bm


def cyl(r1, r2, depth, segs=48):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs, radius1=r1, radius2=r2, depth=depth)
    return bm


def uvs(r, segs=48):
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=segs, v_segments=segs // 2, radius=r)
    return bm


def torus(R, r, segs=64, rsegs=16):
    bm = bmesh.new(); rings = []
    for i in range(segs):
        a = 2 * math.pi * i / segs; ring_ = []
        for j in range(rsegs):
            b = 2 * math.pi * j / rsegs
            ring_.append(bm.verts.new(((R + r * math.cos(b)) * math.cos(a), (R + r * math.cos(b)) * math.sin(a), r * math.sin(b))))
        rings.append(ring_)
    for i in range(segs):
        for j in range(rsegs):
            a, b = rings[i], rings[(i + 1) % segs]
            bm.faces.new((a[j], b[j], b[(j + 1) % rsegs], a[(j + 1) % rsegs]))
    return bm


def rock(size, seed, sub=3, lump=0.30):
    rnd = random.Random(seed)
    bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=1.0)
    s = Vector((rnd.uniform(-40, 40), rnd.uniform(-40, 40), rnd.uniform(-40, 40)))
    sx, sy, sz = rnd.uniform(0.85, 1.2), rnd.uniform(0.8, 1.1), rnd.uniform(0.7, 0.95)
    for v in bm.verts:
        d = v.co.normalized()
        k = 1 + lump * math.sin(d.x * 3.1 + s.x) * math.sin(d.y * 2.6 + s.y) * math.sin(d.z * 3.4 + s.z) \
            + 0.10 * math.sin(d.x * 8 + s.y) * math.cos(d.z * 7 + s.x)
        v.co = Vector((d.x * sx, d.y * sy, d.z * sz)) * k * size
    return bm


# ---------------------------------------------------------------------------------------------- raw forms
def f_ore(acc):
    body = principled('Rock', (0.10, 0.085, 0.075), rough=0.9)
    vein = principled('Vein', (0.75, 0.45, 0.20), metal=1.0, rough=0.25, emit=RAW, emit_strength=0.6)
    obj('Ore', rock(0.78, 3), body, smooth=False, rot=(0.3, 0.2, 0.5))
    rnd = random.Random(9)
    for i in range(9):   # metallic nuggets breaking the surface
        d = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 0.2), rnd.uniform(-0.2, 1))).normalized()
        obj(f'N{i}', rock(rnd.uniform(0.09, 0.17), 20 + i, sub=2), vein, smooth=False, loc=d * 0.66)


def f_crystal(acc):
    glass = principled('Crystal', (0.55, 0.85, 1.0), rough=0.05, transmission=1.0, ior=1.6, emit=(0.25, 0.65, 1.0), emit_strength=0.6)
    base = principled('Base', (0.09, 0.08, 0.08), rough=0.9)
    obj('Base', rock(0.55, 4, lump=0.2), base, smooth=False, loc=(0, 0, -0.62), scale=(1.1, 1.0, 0.45))
    for i, (x, y, tilt, ln, r) in enumerate(((0, 0, 0, 1.45, 0.24), (-0.30, 0.05, -0.42, 1.05, 0.18), (0.30, -0.08, 0.38, 1.0, 0.17),
                                             (0.08, 0.30, 0.25, 0.85, 0.15), (-0.12, -0.28, -0.2, 0.7, 0.13))):
        bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=6, radius1=r, radius2=r, depth=ln)
        top = [v for v in bm.verts if v.co.z > 0]
        tip = bm.verts.new((0, 0, ln / 2 + r * 1.3))
        for v in top:
            pass
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if all(v.co.z > 0 for v in f.verts)], context='FACES_ONLY')
        ring_ = sorted(top, key=lambda v: math.atan2(v.co.y, v.co.x))
        for k in range(len(ring_)):
            bm.faces.new((ring_[k], ring_[(k + 1) % len(ring_)], tip))
        bmesh.ops.translate(bm, vec=(0, 0, ln / 2), verts=bm.verts)
        obj(f'C{i}', bm, glass, smooth=False, loc=(x, y, -0.55), rot=(tilt * 0.6, tilt, 0))


def f_gas(acc):
    mb = bpy.data.metaballs.new('Gas'); mb.resolution = 0.04; mb.render_resolution = 0.03
    ob = bpy.data.objects.new('Gas', mb); bpy.context.scene.collection.objects.link(ob)
    for x, y, z, r in ((0, 0, 0, 0.62), (-0.48, 0.1, -0.12, 0.45), (0.5, -0.05, -0.1, 0.48), (0.18, 0.15, 0.38, 0.42),
                       (-0.25, -0.1, 0.32, 0.38), (0.0, -0.2, -0.38, 0.40)):
        e = mb.elements.new(); e.co = (x, y, z); e.radius = r
    m = principled('Gas', (0.10, 0.45, 0.50), rough=0.6, transmission=0.5, emit=(0.15, 0.70, 0.75), emit_strength=0.35, alpha=0.85)
    mb.materials.append(m)
    core = glow('GasCore', (0.40, 1.0, 0.90), 5.0)
    obj('Core', uvs(0.2), core, loc=(0, 0, 0))


def f_flora(acc):
    soil = principled('Soil', (0.07, 0.05, 0.04), rough=0.95)
    leaf = principled('Leaf', (0.10, 0.42, 0.14), rough=0.5, emit=(0.30, 1.0, 0.45), emit_strength=0.25)
    tipm = glow('Tip', (0.45, 1.0, 0.65), 5.0)
    obj('Soil', rock(0.55, 6, lump=0.15), soil, smooth=False, loc=(0, 0, -0.62), scale=(1.1, 1.0, 0.4))
    for i, (ang, tilt, ln) in enumerate(((0, 0.15, 1.25), (1.3, 0.55, 1.0), (2.5, 0.65, 0.9), (3.8, 0.5, 1.05), (5.1, 0.6, 0.85))):
        bm = uvs(1.0, 32)
        bmesh.ops.scale(bm, vec=(0.17, 0.05, ln / 2), verts=bm.verts)
        for v in bm.verts:                  # curl the blade outward
            v.co.x += 0.25 * (v.co.z / (ln / 2) + 1) ** 2 * 0.5
        bmesh.ops.translate(bm, vec=(0, 0, ln / 2), verts=bm.verts)
        o = obj(f'L{i}', bm, leaf, loc=(0, 0, -0.55), rot=(0, tilt, ang))
        tipv = o.matrix_world @ Vector((0.25 * 2 * 0.5 * 2, 0, ln))
        obj(f'T{i}', uvs(0.055, 16), tipm, loc=tipv)


def f_exotic(acc):
    core = glow('Exotic', (0.55, 0.25, 1.0), 9.0)
    shell = principled('Shell', (0.6, 0.4, 0.9), rough=0.05, transmission=1.0, ior=1.3)
    obj('Core', uvs(0.30), core)
    obj('Shell', uvs(0.48), shell)
    ringm = principled('Ring', (0.75, 0.6, 1.0), metal=1.0, rough=0.25, emit=(0.7, 0.45, 1.0), emit_strength=1.2)
    for i, rot in enumerate(((1.2, 0.3, 0), (0.4, 1.25, 0.6), (-0.6, 0.2, 1.4))):
        obj(f'R{i}', torus(0.82 - i * 0.06, 0.028), ringm, rot=rot)


# ---------------------------------------------------------------------------------------------- crafted forms
def f_ingot(acc):
    met = principled('Ingot', (0.62, 0.64, 0.68), metal=1.0, rough=0.22)
    def bar():
        bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
        for v in bm.verts:                  # trapezoid: narrower top
            v.co.x *= 1.25 if v.co.z < 0 else 1.0
            v.co.y *= 0.62 if v.co.z < 0 else 0.48
            v.co.z *= 0.34
        return bm
    obj('B0', bar(), met, smooth=False, bevel=0.03, loc=(-0.05, -0.28, -0.35))
    obj('B1', bar(), met, smooth=False, bevel=0.03, loc=(0.05, 0.38, -0.35))
    obj('B2', bar(), met, smooth=False, bevel=0.03, loc=(0.0, 0.05, 0.0), rot=(0, 0, 0.12))
    obj('Stamp', cube(0.42, 0.20, 0.02), glow('Acc', acc, 4.0), smooth=False, loc=(0.0, 0.05, 0.172), rot=(0, 0, 0.12))


def f_weapon(acc):
    g = gunmetal(); s = steel(); a = glow('Acc', acc, 6.0)
    obj('Breech', cube(0.62, 0.62, 0.62), g, smooth=False, bevel=0.06, loc=(-0.55, 0, -0.1))
    obj('Barrel', cyl(0.17, 0.15, 1.5), s, bevel=0.01, loc=(0.38, 0, -0.1), rot=(0, math.pi / 2, 0))
    for i in range(3):
        obj(f'Fin{i}', cyl(0.24, 0.24, 0.06), g, bevel=0.01, loc=(0.05 + i * 0.2, 0, -0.1), rot=(0, math.pi / 2, 0))
    obj('Muzzle', torus(0.17, 0.05), a, loc=(1.12, 0, -0.1), rot=(0, math.pi / 2, 0))
    obj('Strip', cube(0.66, 0.04, 0.08), a, smooth=False, loc=(-0.55, -0.32, 0.05))


def f_plating(acc):
    g = gunmetal(); a = glow('Acc', acc, 5.0)
    bm = cyl(1.0, 1.0, 0.16, 6)
    obj('Plate', bm, g, smooth=False, bevel=0.05, rot=(math.radians(62), 0, math.radians(8)))
    obj('Inner', cyl(0.62, 0.62, 0.18, 6), steel(), smooth=False, bevel=0.03, rot=(math.radians(62), 0, math.radians(8)))
    edge = torus(0.95, 0.025, 6, 8)
    obj('Edge', edge, a, smooth=False, rot=(math.radians(62), 0, math.radians(8)), loc=(0, -0.06, 0.03))


def f_engine(acc):
    g = gunmetal(); s = steel(); a = glow('Acc', acc, 9.0)
    rot = (0, math.radians(70), math.radians(-25))
    bm = cyl(0.62, 0.36, 1.1, 48)
    o = obj('Bell', bm, s, bevel=0.01, rot=rot)
    obj('Housing', cyl(0.42, 0.42, 0.55, 32), g, bevel=0.03, rot=rot, loc=o.matrix_world @ Vector((0, 0, 0.75)) - o.location + o.location)
    obj('Glow', cyl(0.55, 0.55, 0.02, 48), a, rot=rot, loc=o.matrix_world @ Vector((0, 0, -0.56)))
    for i in range(2):
        obj(f'Band{i}', torus(0.5 - i * 0.1, 0.03), g, rot=rot, loc=o.matrix_world @ Vector((0, 0, -0.2 + i * 0.35)))


def f_core(acc):
    g = gunmetal(); a = glow('Acc', acc, 7.0)
    obj('Orb', uvs(0.36), a)
    glass = principled('Glass', (0.8, 0.9, 1.0), rough=0.02, transmission=1.0, ior=1.45)
    obj('Glass', uvs(0.48), glass)
    for i, rot in enumerate(((math.pi / 2, 0, 0), (math.pi / 2, 0, math.pi / 2), (0, 0, 0))):
        obj(f'Cage{i}', torus(0.62, 0.06, 64, 12), g, rot=rot)
    obj('CapT', cyl(0.24, 0.30, 0.18), g, bevel=0.02, loc=(0, 0, 0.72))
    obj('CapB', cyl(0.30, 0.24, 0.18), g, bevel=0.02, loc=(0, 0, -0.72))


def f_chip(acc):
    g = gunmetal(); s = principled('Pin', (0.85, 0.70, 0.35), metal=1.0, rough=0.25); a = glow('Acc', acc, 5.0)
    obj('Board', cube(1.4, 1.4, 0.14), principled('PCB', (0.03, 0.05, 0.06), rough=0.6), smooth=False, bevel=0.02, loc=(0, 0, -0.3))
    obj('Die', cube(0.82, 0.82, 0.16), g, smooth=False, bevel=0.03, loc=(0, 0, -0.15))
    obj('Glow', cube(0.42, 0.42, 0.02), a, smooth=False, loc=(0, 0, -0.06))
    for k in range(6):
        t = -0.55 + k * 0.22
        for x, y, sx, sy in ((t, -0.78, 0.07, 0.22), (t, 0.78, 0.07, 0.22), (-0.78, t, 0.22, 0.07), (0.78, t, 0.22, 0.07)):
            obj('Pin', cube(sx, sy, 0.04), s, smooth=False, loc=(x, y, -0.3))
    for i, (x0, y0, x1, y1) in enumerate(((-0.41, -0.2, -0.65, -0.2), (0.41, 0.2, 0.65, 0.2), (0.2, -0.41, 0.2, -0.65), (-0.2, 0.41, -0.2, 0.65))):
        obj(f'Tr{i}', cube(abs(x1 - x0) or 0.03, abs(y1 - y0) or 0.03, 0.01), a, smooth=False, loc=((x0 + x1) / 2, (y0 + y1) / 2, -0.225))


def f_sensor(acc):
    g = gunmetal(); s = steel(); a = glow('Acc', acc, 8.0)
    bm = uvs(0.85, 48)
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z > -0.25], context='VERTS')
    for v in bm.verts:
        v.co.z += 0.25
    rot = (math.radians(-55), 0, math.radians(30))
    dish = obj('Dish', bm, s, rot=rot, loc=(0, 0, 0.15))
    sol = dish.modifiers.new('Solid', 'SOLIDIFY'); sol.thickness = 0.04
    obj('Mast', cyl(0.04, 0.04, 0.8), g, rot=rot, loc=dish.matrix_world @ Vector((0, 0, 0.0)))
    obj('Tip', uvs(0.1, 24), a, loc=dish.matrix_world @ Vector((0, 0, 0.42)))
    obj('Stand', cyl(0.12, 0.2, 0.7), g, bevel=0.02, loc=(0, 0, -0.55))
    obj('Foot', cyl(0.42, 0.45, 0.12), g, bevel=0.02, loc=(0, 0, -0.9))


def f_coil(acc):
    g = gunmetal(); cu = principled('Copper', (0.80, 0.42, 0.22), metal=1.0, rough=0.3); a = glow('Acc', acc, 6.0)
    rot = (0, math.radians(72), math.radians(-20))
    o = obj('Spool', cyl(0.30, 0.30, 1.5), g, bevel=0.02, rot=rot)
    for i in range(9):
        obj(f'W{i}', torus(0.40, 0.075, 48, 12), cu, rot=rot, loc=o.matrix_world @ Vector((0, 0, -0.56 + i * 0.14)))
    for z in (-0.78, 0.78):
        obj('End', cyl(0.55, 0.55, 0.08), g, bevel=0.015, rot=rot, loc=o.matrix_world @ Vector((0, 0, z)))
        obj('EndGlow', torus(0.55, 0.025), a, rot=rot, loc=o.matrix_world @ Vector((0, 0, z * 1.06)))


def f_frame(acc):
    s = steel(); a = glow('Acc', acc, 6.0)
    bm = cube(1.25, 1.25, 1.25)
    o = obj('Truss', bm, s, smooth=False, rot=(0, 0, math.radians(8)))
    wf = o.modifiers.new('Wire', 'WIREFRAME'); wf.thickness = 0.11; wf.use_even_offset = True
    bm2 = cube(1.25, 1.25, 1.25)
    for v in list(bm2.verts):
        pass
    for x in (-0.625, 0.625):
        for y in (-0.625, 0.625):
            for z in (-0.625, 0.625):
                obj('Node', cube(0.2, 0.2, 0.2), a, smooth=False, loc=Matrix.Rotation(math.radians(8), 4, 'Z') @ Vector((x, y, z)))
    bm2.free()
    # one diagonal brace per visible face
    for p, r in (((0, -0.625, 0), (0, math.radians(45), 0)), ((0.625, 0, 0), (math.radians(45), 0, 0))):
        obj('Brace', cube(0.07, 0.07, 1.7), s, smooth=False, loc=Matrix.Rotation(math.radians(8), 4, 'Z') @ Vector(p), rot=(r[0], r[1], math.radians(8)))


def f_canister(acc):
    g = gunmetal(); s = steel(); a = glow('Acc', acc, 6.0)
    rot = (math.radians(8), math.radians(-14), 0)
    o = obj('Body', cyl(0.48, 0.48, 1.35), s, bevel=0.12, segs=4, rot=rot)
    obj('Cap', cyl(0.24, 0.24, 0.22), g, bevel=0.03, rot=rot, loc=o.matrix_world @ Vector((0, 0, 0.78)))
    obj('Valve', cyl(0.30, 0.30, 0.05), g, bevel=0.01, rot=rot, loc=o.matrix_world @ Vector((0, 0, 0.90)))
    for z in (-0.38, 0.38):
        obj('Band', cyl(0.505, 0.505, 0.12), g, rot=rot, loc=o.matrix_world @ Vector((0, 0, z)))
    obj('Window', cyl(0.50, 0.50, 0.42, 48), principled('Win', acc, rough=0.1, emit=acc, emit_strength=1.1), rot=rot)


def f_vial(acc):
    g = gunmetal(); a = glow('Acc', acc, 5.0)
    glass = principled('Glass', (0.9, 0.95, 1.0), rough=0.02, transmission=1.0, ior=1.45)
    rot = (math.radians(10), math.radians(-18), 0)
    o = obj('Glass', cyl(0.36, 0.36, 1.4), glass, bevel=0.1, segs=4, rot=rot)
    obj('Liquid', cyl(0.31, 0.31, 0.95), a, bevel=0.06, rot=rot, loc=o.matrix_world @ Vector((0, 0, -0.18)))
    obj('Cap', cyl(0.40, 0.40, 0.28), g, bevel=0.04, rot=rot, loc=o.matrix_world @ Vector((0, 0, 0.82)))
    obj('Ring', torus(0.39, 0.03), steel(), rot=rot, loc=o.matrix_world @ Vector((0, 0, 0.62)))


def f_crate(acc):
    g = gunmetal(); s = steel(); a = glow('Acc', acc, 5.0)
    obj('Box', cube(1.5, 1.05, 0.95), g, smooth=False, bevel=0.05, loc=(0, 0, -0.1))
    for x in (-0.6, 0.6):
        obj('Rib', cube(0.12, 1.12, 1.02), s, smooth=False, bevel=0.02, loc=(x, 0, -0.1))
    obj('Lid', cube(1.56, 1.1, 0.08), s, smooth=False, bevel=0.02, loc=(0, 0, 0.4))
    obj('Stripe', cube(0.9, 0.02, 0.1), a, smooth=False, loc=(0, -0.53, 0.05))
    obj('Stripe2', cube(0.02, 0.6, 0.1), a, smooth=False, loc=(0.76, 0, 0.05))


def f_tool(acc):
    g = gunmetal(); s = steel(); a = glow('Acc', acc, 6.0)
    rot = (math.radians(62), 0, math.radians(12))
    bm = cyl(0.62, 0.62, 0.26, 64)
    gear = obj('Gear', bm, s, smooth=False, bevel=0.015, rot=rot)
    for i in range(12):
        ang = 2 * math.pi * i / 12
        p = gear.matrix_world @ Vector((0.72 * math.cos(ang), 0.72 * math.sin(ang), 0))
        obj(f'T{i}', cube(0.22, 0.2, 0.26), s, smooth=False, bevel=0.015, loc=p,
            rot=(Matrix.Rotation(rot[2], 4, 'Z') @ Matrix.Rotation(rot[0], 4, 'X') @ Matrix.Rotation(ang, 4, 'Z')).to_euler())
    obj('Hub', cyl(0.24, 0.24, 0.34), g, bevel=0.02, rot=rot)
    obj('HubGlow', torus(0.36, 0.03), a, rot=rot, loc=gear.matrix_world @ Vector((0, 0, 0.14)))


def f_drone(acc):
    g = gunmetal(); s = steel(); a = glow('Acc', acc, 8.0)
    obj('Body', uvs(0.38), g, scale=(1.2, 1.2, 0.6))
    obj('Eye', uvs(0.1, 24), a, loc=(0.0, -0.40, -0.04))
    for i in range(4):
        ang = math.pi / 4 + i * math.pi / 2
        d = Vector((math.cos(ang), math.sin(ang), 0))
        obj(f'Arm{i}', cube(0.75, 0.08, 0.06), s, smooth=False, loc=d * 0.55, rot=(0, 0, ang))
        obj(f'Rotor{i}', cyl(0.34, 0.34, 0.03), principled('Blade', (0.2, 0.22, 0.25), metal=0.5, rough=0.4, alpha=0.75), loc=d * 0.95 + Vector((0, 0, 0.08)))
        obj(f'RG{i}', torus(0.36, 0.022), a, loc=d * 0.95 + Vector((0, 0, 0.08)))


RAW_FORMS = {'ore': f_ore, 'crystal': f_crystal, 'gas': f_gas, 'flora': f_flora, 'exotic': f_exotic}
CRAFTED_FORMS = {'ingot': f_ingot, 'weapon': f_weapon, 'plating': f_plating, 'engine': f_engine, 'core': f_core, 'chip': f_chip,
                 'sensor': f_sensor, 'coil': f_coil, 'frame': f_frame, 'canister': f_canister, 'vial': f_vial, 'crate': f_crate,
                 'tool': f_tool, 'drone': f_drone}

def fit(fill=0.84):
    """Scale and centre everything so its silhouette fills `fill` of the frame (forms are authored by eye, not to size)."""
    sc = bpy.context.scene; cam = sc.camera
    bpy.context.view_layer.update()
    right = cam.matrix_world.to_3x3() @ Vector((1, 0, 0)); up = cam.matrix_world.to_3x3() @ Vector((0, 1, 0))
    dg = bpy.context.evaluated_depsgraph_get(); xs, ys = [], []
    parts = [o for o in sc.objects if o.type in ('MESH', 'META')]
    for o in parts:
        ev = o.evaluated_get(dg); me = ev.to_mesh()
        if me is None:
            continue
        for v in me.vertices:
            w = ev.matrix_world @ v.co; xs.append(w.dot(right)); ys.append(w.dot(up))
        ev.to_mesh_clear()
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    half = max(max(xs) - min(xs), max(ys) - min(ys)) / 2
    k = fill * cam.data.ortho_scale / 2 / half
    root = bpy.data.objects.new('FitRoot', None); sc.collection.objects.link(root)
    for o in parts:
        if o.parent is None:
            o.parent = root
    root.scale = (k, k, k); root.location = -(right * cx + up * cy) * k
    print('FIT', round(k, 3), flush=True)


setup()
for form, fn in RAW_FORMS.items():
    if ONLY and form not in ONLY:
        continue
    reset(); fn(srgb(RAW)); fit(); render(os.path.join(OUT, f'{form}.png'))
for form, fn in CRAFTED_FORMS.items():
    if ONLY and form not in ONLY:
        continue
    for cat, col in ACCENT.items():
        reset(); fn(srgb(col)); fit(); render(os.path.join(OUT, f'{form}_{cat}.png'))
print('ALL_DONE', flush=True)
