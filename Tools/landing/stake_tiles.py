# stake_tiles.py - isometric building tiles for the ClaimStake Explorer construction pad (Blender 5.2, -b).
# Twelve procedural low-poly structures on a hex plate, one PNG each with a transparent film, lit the same way so
# they sit together on the page. Camera: orthographic, straight-on from -Y, elevation 32 deg, so a pointy-top hex
# of circumradius r in world space projects to 1.732r wide by 2r*sin(32) = 1.06r tall - the page's hex grid uses
# the same squash (0.53).
#   "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b -P stake_tiles.py -- <out_dir> [samples] [kind ...]
import sys, os, math
import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
OUT_DIR = os.path.abspath(argv[0])
SAMPLES = int(argv[1]) if len(argv) > 1 else 96
ONLY = argv[2:]
os.makedirs(OUT_DIR, exist_ok=True)

ELEV = 32.0
RES = 640

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

# ------------------------------------------------------------------------------------------ helpers ----
def mat(name, color, metallic=0.0, rough=0.5, emit=None, strength=0.0, transmission=0.0, alpha=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = [n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Metallic'].default_value = metallic
    b.inputs['Roughness'].default_value = rough
    if transmission:
        b.inputs['Transmission Weight'].default_value = transmission
        b.inputs['IOR'].default_value = 1.35
    if alpha < 1:
        b.inputs['Alpha'].default_value = alpha
    if emit is not None:
        b.inputs['Emission Color'].default_value = (*emit, 1)
        b.inputs['Emission Strength'].default_value = strength
    return m


def finish(ob, m, smooth=True, bevel=0.0):
    ob.data.materials.append(m)
    if bevel:
        bv = ob.modifiers.new('Bevel', 'BEVEL'); bv.width = bevel; bv.segments = 3
    if smooth:
        bpy.context.view_layer.objects.active = ob
        try:
            bpy.ops.object.shade_smooth_by_angle(angle=math.radians(42))
        except Exception:
            bpy.ops.object.shade_smooth()
    return ob


def cyl(r, h, loc, m, verts=48, rot=(0, 0, 0), smooth=True, r2=None, bevel=0.0):
    if r2 is None:
        bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h, location=loc, rotation=rot)
    else:
        bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r2, depth=h, location=loc, rotation=rot)
    return finish(bpy.context.active_object, m, smooth, bevel)


def box(size, loc, m, rot=(0, 0, 0), bevel=0.02):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    ob = bpy.context.active_object; ob.scale = size
    bpy.ops.object.transform_apply(scale=True)
    return finish(ob, m, smooth=False, bevel=bevel)


def sphere(r, loc, m, seg=48):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=seg // 2, radius=r, location=loc)
    return finish(bpy.context.active_object, m)


def torus(R, r, loc, m, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=loc, rotation=rot, major_segments=64, minor_segments=20)
    return finish(bpy.context.active_object, m)


class Kit:
    """Materials shared by one tile, built around its accent colour."""
    def __init__(self, accent):
        self.accent = accent
        self.steel = mat('Steel', (0.42, 0.45, 0.50), metallic=0.9, rough=0.32)
        self.dark = mat('Dark', (0.030, 0.034, 0.045), metallic=0.4, rough=0.55)
        self.panel = mat('Panel', (0.12, 0.13, 0.16), metallic=0.2, rough=0.5)
        self.glow = mat('Glow', accent, rough=0.4, emit=accent, strength=3.6)
        self.glow_soft = mat('GlowSoft', accent, rough=0.4, emit=accent, strength=1.7)
        self.glass = mat('Glass', tuple(0.55 + 0.45 * c for c in accent), rough=0.08, transmission=0.85, alpha=0.6)
        self.trim = mat('Trim', tuple(0.35 * c for c in accent), metallic=0.6, rough=0.4)


def plate(k):
    """Hex pad: dark plate, steel rim, a glowing groove just inside the rim, studs at the corners."""
    cyl(1.00, 0.12, (0, 0, 0.06), k.dark, verts=6, rot=(0, 0, math.radians(30)), smooth=False, bevel=0.015)
    cyl(0.90, 0.13, (0, 0, 0.065), k.panel, verts=6, rot=(0, 0, math.radians(30)), smooth=False, bevel=0.01)
    cyl(0.86, 0.14, (0, 0, 0.07), k.glow_soft, verts=6, rot=(0, 0, math.radians(30)), smooth=False)
    cyl(0.80, 0.15, (0, 0, 0.075), k.panel, verts=6, rot=(0, 0, math.radians(30)), smooth=False, bevel=0.01)
    for i in range(6):
        a = math.radians(30 + 60 * i)
        cyl(0.045, 0.05, (0.93 * math.cos(a), 0.93 * math.sin(a), 0.14), k.steel, verts=16)


# -------------------------------------------------------------------------------------- buildings ----
def central_hub(k):
    plate(k)
    cyl(0.58, 0.22, (0, 0, 0.26), k.panel, bevel=0.02)
    cyl(0.62, 0.05, (0, 0, 0.40), k.trim)
    cyl(0.30, 1.05, (0, 0, 0.92), k.steel)
    for i in range(3):
        a = math.radians(90 + 120 * i)
        box((0.10, 0.34, 0.70), (0.36 * math.cos(a), 0.36 * math.sin(a), 0.70), k.panel, rot=(0, 0, a))
    torus(0.42, 0.045, (0, 0, 0.98), k.glow)
    cyl(0.40, 0.07, (0, 0, 1.48), k.trim)
    cyl(0.33, 0.04, (0, 0, 1.53), k.glow)
    cyl(0.025, 0.55, (0, 0, 1.82), k.steel, verts=12)
    sphere(0.05, (0, 0, 2.10), k.glow, seg=16)


def cultivation_hub(k):
    plate(k)
    cyl(0.58, 0.22, (0, 0, 0.26), k.panel, bevel=0.02)
    cyl(0.62, 0.05, (0, 0, 0.40), k.trim)
    cyl(0.26, 0.75, (0, 0, 0.78), k.steel)
    torus(0.36, 0.04, (0, 0, 0.70), k.glow)
    cyl(0.50, 0.06, (0, 0, 1.18), k.trim)
    sphere(0.46, (0, 0, 1.22), k.glass)
    sphere(0.26, (0, 0, 1.22), k.glow_soft, seg=32)
    for i in range(4):
        a = math.radians(45 + 90 * i)
        cyl(0.03, 0.9, (0.44 * math.cos(a), 0.44 * math.sin(a), 1.2), k.steel, verts=12)


def extraction_hub(k):
    plate(k)
    sphere(0.50, (0.12, 0.08, 0.16), k.panel)
    torus(0.50, 0.035, (0.12, 0.08, 0.17), k.trim)
    cyl(0.20, 0.10, (0.12, 0.08, 0.68), k.trim)
    cyl(0.07, 1.10, (-0.52, -0.30, 0.70), k.steel, verts=16)
    box((1.10, 0.09, 0.09), (-0.05, -0.30, 1.22), k.steel, rot=(0, 0, 0))
    box((0.09, 0.09, 0.42), (0.46, -0.30, 1.02), k.steel)
    sphere(0.07, (0.46, -0.30, 0.80), k.glow, seg=16)
    for i in range(3):
        box((0.12, 0.26, 0.05), (0.12 + 0.25 * math.cos(math.radians(120 * i)), 0.08 + 0.25 * math.sin(math.radians(120 * i)), 0.66), k.glow_soft, rot=(0, 0, math.radians(120 * i)))


def processing_hub(k):
    plate(k)
    box((1.00, 0.72, 0.50), (0, 0.02, 0.40), k.panel)
    box((0.96, 0.10, 0.06), (0, -0.37, 0.40), k.glow_soft, bevel=0.0)
    cyl(0.10, 0.70, (-0.28, 0.12, 0.95), k.steel, verts=24)
    cyl(0.10, 0.80, (0.0, 0.12, 1.0), k.steel, verts=24)
    cyl(0.10, 0.60, (0.28, 0.12, 0.9), k.steel, verts=24)
    for x, z in ((-0.28, 1.30), (0.0, 1.40), (0.28, 1.20)):
        cyl(0.07, 0.03, (x, 0.12, z + 0.01), k.glow, verts=24)
    cyl(0.06, 1.0, (0.0, -0.20, 0.72), k.trim, rot=(0, math.radians(90), 0), verts=16)
    torus(0.16, 0.04, (0.42, -0.2, 0.72), k.glow, rot=(0, math.radians(90), 0))


def storage_hub(k):
    plate(k)
    for i, (x, y) in enumerate(((-0.40, 0.18), (0.22, 0.30), (0.10, -0.32))):
        cyl(0.30, 0.78, (x, y, 0.51), k.panel if i != 1 else k.steel, bevel=0.02)
        torus(0.305, 0.025, (x, y, 0.45), k.glow)
        cyl(0.27, 0.04, (x, y, 0.92), k.trim)
    box((0.9, 0.06, 0.06), (-0.1, 0.0, 0.55), k.steel)


def farm_hub(k):
    plate(k)
    cyl(0.62, 0.10, (0, 0, 0.17), k.trim)
    sphere(0.58, (0, 0, 0.22), k.glass)
    sphere(0.32, (0, 0, 0.30), k.glow_soft, seg=32)
    for i in range(6):
        a = math.radians(60 * i)
        cyl(0.025, 1.1, (0.56 * math.cos(a), 0.56 * math.sin(a), 0.5), k.steel, verts=12, rot=(0, 0, 0))
    torus(0.58, 0.03, (0, 0, 0.60), k.steel)


def power_plant(k):
    plate(k)
    cyl(0.50, 0.14, (0, 0, 0.19), k.panel)
    torus(0.50, 0.11, (0, 0, 0.62), k.steel)
    sphere(0.30, (0, 0, 0.62), k.glow)
    for i in range(4):
        a = math.radians(45 + 90 * i)
        box((0.10, 0.10, 0.62), (0.52 * math.cos(a), 0.52 * math.sin(a), 0.42), k.steel)
    cyl(0.06, 0.9, (0, 0, 1.0), k.trim, verts=16)
    for i in range(6):
        box((0.44, 0.02, 0.26), (0, 0, 1.0 + 0.0 * i), k.steel, rot=(0, 0, math.radians(30 * i)), bevel=0.0)


def crew_quarters(k):
    plate(k)
    box((0.92, 0.52, 0.30), (0.00, 0.10, 0.27), k.panel)
    box((0.80, 0.46, 0.30), (-0.08, 0.14, 0.57), k.panel)
    box((0.62, 0.40, 0.30), (0.06, 0.18, 0.87), k.panel)
    for z, w, x in ((0.27, 0.92, 0.0), (0.57, 0.80, -0.08), (0.87, 0.62, 0.06)):
        for i in range(int(w / 0.14)):
            box((0.07, 0.03, 0.10), (x - w / 2 + 0.08 + i * 0.14, 0.10 + (z - 0.27) / 0.3 * 0.04 - 0.27 + 0.0, z), k.glow_soft, bevel=0.0)
    cyl(0.03, 0.5, (0.3, 0.2, 1.25), k.steel, verts=12)
    sphere(0.04, (0.3, 0.2, 1.5), k.glow, seg=12)


def extractor(k):
    plate(k)
    cyl(0.40, 0.10, (0, 0, 0.17), k.panel)
    for i in range(3):
        a = math.radians(90 + 120 * i)
        cyl(0.045, 1.35, (0.33 * math.cos(a), 0.33 * math.sin(a), 0.78), k.steel, verts=12, rot=(math.radians(-18) * math.sin(a), math.radians(18) * math.cos(a), 0))
    box((0.46, 0.46, 0.22), (0, 0, 1.30), k.panel)
    cyl(0.13, 0.9, (0, 0, 0.75), k.trim, verts=24)
    cyl(0.0, 0.45, (0, 0, 0.27), k.glow, verts=24, r2=0.13)
    torus(0.20, 0.03, (0, 0, 1.12), k.glow)
    box((0.30, 0.22, 0.26), (0.46, -0.22, 0.32), k.steel)
    cyl(0.03, 0.35, (0, 0, 1.58), k.steel, verts=12)


def processor(k):
    plate(k)
    cyl(0.30, 0.90, (-0.22, 0.10, 0.57), k.steel, bevel=0.02)
    cyl(0.32, 0.05, (-0.22, 0.10, 1.03), k.trim)
    torus(0.31, 0.03, (-0.22, 0.10, 0.75), k.glow)
    torus(0.31, 0.03, (-0.22, 0.10, 0.45), k.glow)
    box((0.46, 0.50, 0.42), (0.38, -0.08, 0.33), k.panel)
    box((0.40, 0.08, 0.05), (0.38, -0.34, 0.40), k.glow_soft, bevel=0.0)
    cyl(0.05, 0.55, (0.10, 0.10, 0.9), k.trim, rot=(0, math.radians(90), 0), verts=16)
    cyl(0.08, 0.40, (0.42, 0.14, 0.74), k.steel, verts=16)
    cyl(0.06, 0.03, (0.42, 0.14, 0.95), k.glow, verts=16)


def storage_module(k):
    plate(k)
    for (x, y, z) in ((-0.25, 0.22, 0.32), (0.25, 0.22, 0.32), (-0.25, -0.26, 0.32), (0.25, -0.26, 0.32), (0.0, -0.02, 0.76)):
        box((0.44, 0.44, 0.40), (x, y, z), k.panel, bevel=0.03)
        box((0.46, 0.46, 0.04), (x, y, z), k.trim, bevel=0.0)
        box((0.16, 0.47, 0.02), (x, y, z + 0.22), k.glow_soft, bevel=0.0)


def farm(k):
    plate(k)
    for y in (-0.42, 0.0, 0.42):
        cyl(0.19, 1.10, (0, y, 0.16), k.glass, rot=(0, math.radians(90), 0), verts=32)
        box((1.04, 0.26, 0.05), (0, y, 0.17), k.glow_soft, bevel=0.0)
        box((1.12, 0.40, 0.04), (0, y, 0.14), k.trim, bevel=0.0)
    box((0.06, 1.30, 0.08), (-0.58, 0, 0.18), k.steel)
    box((0.06, 1.30, 0.08), (0.58, 0, 0.18), k.steel)


KINDS = {
    'central_hub': central_hub, 'cultivation_hub': cultivation_hub, 'extraction_hub': extraction_hub,
    'processing_hub': processing_hub, 'storage_hub': storage_hub, 'farm_hub': farm_hub, 'power_plant': power_plant,
    'crew_quarters': crew_quarters, 'extractor': extractor, 'processor': processor, 'storage_module': storage_module,
    'farm': farm,
}


# --------------------------------------------------------------------------------------- scene ----
def sun_dir(name, energy, travel, color, angle=4.0):
    ld = bpy.data.lights.new(name, 'SUN'); ld.energy = energy; ld.color = color; ld.angle = math.radians(angle)
    ob = bpy.data.objects.new(name, ld); bpy.context.scene.collection.objects.link(ob)
    ob.rotation_euler = Vector(travel).normalized().to_track_quat('-Z', 'Y').to_euler()
    return ob


def setup_scene():
    bpy.ops.wm.read_homefile(use_empty=True)
    sc = bpy.context.scene
    w = bpy.data.worlds.new('W'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs['Color'].default_value = (0.50, 0.52, 0.58, 1); bg.inputs['Strength'].default_value = 0.22
    cam_d = bpy.data.cameras.new('Cam'); cam_d.type = 'ORTHO'; cam_d.ortho_scale = 3.1; cam_d.clip_end = 100
    cam = bpy.data.objects.new('Cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
    el = math.radians(ELEV)
    cam.location = Vector((0, -10 * math.cos(el), 10 * math.sin(el))) + Vector((0, 0, 0.72))
    d = Vector((0, 0, 0.72)) - cam.location
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    sun_dir('Key', 3.2, (0.55, 0.45, -0.70), (1.0, 0.96, 0.90), angle=6.0)
    sun_dir('Rim', 2.4, (-0.35, -0.75, -0.45), (0.65, 0.80, 1.0), angle=3.0)
    sun_dir('Fill', 0.6, (-0.6, 0.3, -0.5), (0.8, 0.85, 1.0), angle=20.0)
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


for kind, build in KINDS.items():
    if ONLY and kind not in ONLY:
        continue
    sc = setup_scene()
    build(Kit(ACCENT[kind]))
    out = os.path.join(OUT_DIR, kind + '.png')
    sc.render.filepath = out
    bpy.ops.render.render(write_still=True)
    print('TILE_REPORT', kind, os.path.exists(out), os.path.getsize(out) if os.path.exists(out) else -1, flush=True)
