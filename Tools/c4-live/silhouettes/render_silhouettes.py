"""Render top-down, nose-up ship silhouettes for the C4 Live map atlas (Blender 5.2, headless).

Run:
  blender -b --factory-startup -P render_silhouettes.py -- <models_dir> <out_dir> [px] [only_slug ...]

For every <models_dir>/*.glb this writes <out_dir>/<slug>.png (px x px, white hull on transparent,
Workbench studio light + cavity so panel structure survives a multiply tint), and 8 hand-made generic
hulls gen-<sizeClass>.png. <out_dir>/render_meta.json records, per image, the forward-axis decision
and where the engines landed in the picture, so the checker can prove "nose up" from the model's own
data instead of from alpha mass.

Forward axis = the ShipExplorer teardown rule (ShipExplorer/teardown-src/main.js buildHull), in glTF
coordinates: engines (meshes named /flare|thruster/) offset >25% of the half-length along z or x mark
the stern; else manifest sternHint; else stern = -z, unless z is clearly not the long axis (then x).
"""
import bpy, bmesh, sys, os, json, math, re
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
MODELS = os.path.abspath(argv[0])
OUT = os.path.abspath(argv[1])
PX = int(argv[2]) if len(argv) > 2 else 512
ONLY = set(argv[3:])
os.makedirs(OUT, exist_ok=True)

IS_VFX = re.compile(r'vfx|flare', re.I)
IS_ENGINE = re.compile(r'flare|thruster', re.I)
FILL = 0.92  # longest projected side fills this fraction of the frame

manifest = json.load(open(os.path.join(MODELS, 'manifest.json'), encoding='utf-8'))
hint_by_file = {}
for v in manifest.values():
    hint_by_file.setdefault(v['file'], v.get('sternHint'))

sc = bpy.context.scene


def setup_render():
    sc.render.engine = 'BLENDER_WORKBENCH'
    sc.render.resolution_x = sc.render.resolution_y = PX
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = True
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'Standard'
    d = sc.display
    d.shading.light = 'STUDIO'
    d.shading.color_type = 'SINGLE'
    d.shading.single_color = (1.0, 1.0, 1.0)
    d.shading.show_cavity = True
    d.shading.cavity_type = 'BOTH'
    d.shading.cavity_ridge_factor = 1.0
    d.shading.cavity_valley_factor = 1.6
    d.shading.curvature_ridge_factor = 1.0
    d.shading.curvature_valley_factor = 1.4
    d.shading.show_object_outline = False
    d.shading.show_specular_highlight = False
    d.render_aa = '16'


def clear():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.cameras):
        for b in list(coll):
            if b.users == 0:
                coll.remove(b)


def world_pts(objs):
    pts = []
    for o in objs:
        mw = o.matrix_world
        pts.extend(mw @ v.co for v in o.data.vertices)
    return pts


def bbox(pts):
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return mn, mx


def render_frame(objs, name, meta):
    """objs already rotated nose->+Y. Frame them top-down and render."""
    bpy.context.view_layer.update()
    pts = world_pts(objs)
    mn, mx = bbox(pts)
    ctr = (mn + mx) / 2
    side = max(mx.x - mn.x, mx.y - mn.y)
    cam_d = bpy.data.cameras.new('cam')
    cam_d.type = 'ORTHO'
    cam_d.ortho_scale = side / FILL
    cam_d.clip_start = 0.01
    cam_d.clip_end = (mx.z - mn.z) + side * 4 + 10
    cam = bpy.data.objects.new('cam', cam_d)
    sc.collection.objects.link(cam)
    cam.location = Vector((ctr.x, ctr.y, mx.z + side + 1))
    cam.rotation_euler = (0, 0, 0)  # looks down -Z, image up = +Y, image right = +X
    sc.camera = cam
    bpy.context.view_layer.update()
    sc.render.filepath = os.path.join(OUT, name + '.png')
    bpy.ops.render.render(write_still=True)
    scale = cam_d.ortho_scale

    def to_px(p):  # world XY -> pixel (x right, y DOWN, origin top-left)
        u = (p.x - ctr.x) / scale + 0.5
        v = (p.y - ctr.y) / scale + 0.5
        return [round(u * PX, 2), round((1 - v) * PX, 2)]

    meta.update({'px': PX, 'orthoScale': round(scale, 4), 'lengthAlongNose': round(mx.y - mn.y, 3),
                 'width': round(mx.x - mn.x, 3), 'noseTipPx': to_px(Vector((ctr.x, mx.y, 0))),
                 'sternPx': to_px(Vector((ctr.x, mn.y, 0)))})
    return to_px


def ship(path):
    slug = os.path.splitext(os.path.basename(path))[0]
    clear()
    bpy.ops.import_scene.gltf(filepath=path)
    bpy.context.view_layer.update()
    meshes = [o for o in bpy.data.objects if o.type == 'MESH' and o.data.vertices]
    solid = [o for o in meshes if not IS_VFX.search(o.name)] or meshes
    engines = [o for o in meshes if IS_ENGINE.search(o.name)]
    for o in meshes:
        o.hide_render = o not in solid
    # Blender coords after glTF import: glTF (x, y, z) -> Blender (x, -z, y)
    mn, mx = bbox(world_pts(solid))
    ctr, size = (mn + mx) / 2, mx - mn
    g_size = {'x': size.x, 'z': size.y}  # glTF z extent == Blender y extent
    axis, sign, source = 'z', -1, 'convention'
    eng_c = None
    if engines:
        cs = []
        for o in engines:
            a, b = bbox(world_pts([o]))
            cs.append((a + b) / 2)
        eng_c = sum(cs, Vector()) / len(cs)
        # glTF-space offsets: gx = Bx, gz = -By
        gx, gz = eng_c.x - ctr.x, -(eng_c.y - ctr.y)
        rx, rz = gx / (g_size['x'] / 2 or 1), gz / (g_size['z'] / 2 or 1)
        if max(abs(rx), abs(rz)) > 0.25:
            axis = 'z' if abs(rz) >= abs(rx) else 'x'
            sign = 1 if (rz if axis == 'z' else rx) > 0 else -1
            source = 'engines'
    hint = hint_by_file.get(os.path.basename(path))
    if source == 'convention' and hint and re.match(r'^[+-][xz]$', hint):
        axis, sign, source = hint[1], (1 if hint[0] == '+' else -1), 'hint'
    if source == 'convention' and g_size['z'] < g_size['x'] * 0.8:
        axis = 'x'
    # stern direction in Blender coords
    stern = Vector((sign, 0, 0)) if axis == 'x' else Vector((0, -sign, 0))
    nose = -stern
    theta = math.atan2(nose.x, nose.y)
    R = Matrix.Translation(Vector((0, 0, 0))) @ Matrix.Rotation(theta, 4, 'Z') @ Matrix.Translation(-ctr)
    for o in bpy.data.objects:
        if o.parent is None:
            o.matrix_world = R @ o.matrix_world
    meta = {'kind': 'model', 'slug': slug, 'axis': axis, 'sign': sign, 'source': source, 'hint': hint,
            'thetaDeg': round(math.degrees(theta), 1), 'engines': len(engines)}
    to_px = render_frame(solid, slug, meta)
    if eng_c is not None:
        meta['enginePx'] = to_px(R @ eng_c)
    # independent cues the orientation rule does NOT use, for the checker: wake ribbons trail the stern,
    # glass is usually the cockpit (weak: some hulls have side windows)
    for key, rx in (('wakePx', re.compile(r'wake', re.I)), ('glassPx', re.compile(r'glass', re.I))):
        objs = [o for o in meshes if rx.search(o.name)]
        if objs:
            a, b = bbox(world_pts(objs))
            meta[key] = to_px((a + b) / 2)
    return slug, meta


# ---------- generic hulls, one per size class (hand-made, nose = +Y) ----------
def prism(bm, poly, z0, z1, inset=0.0):
    """Extrude a 2D polygon (CCW, list of (x,y)) from z0 to z1; optional bevel-ish inset on the top cap."""
    bot = [bm.verts.new((x, y, z0)) for x, y in poly]
    topz = z1 - (min(0.04, (z1 - z0) * 0.4) if inset else 0)
    top = [bm.verts.new((x, y, topz)) for x, y in poly]
    n = len(poly)
    bm.faces.new(list(reversed(bot)))
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((bot[i], bot[j], top[j], top[i]))
    if inset:
        cx = sum(p[0] for p in poly) / n
        cy = sum(p[1] for p in poly) / n
        cap = [bm.verts.new((cx + (x - cx) * (1 - inset), cy + (y - cy) * (1 - inset), z1)) for x, y in poly]
        for i in range(n):
            j = (i + 1) % n
            bm.faces.new((top[i], top[j], cap[j], cap[i]))
        bm.faces.new(cap)
    else:
        bm.faces.new(top)


def _close(half):
    """half = points on the +x side from nose to stern; returns the mirrored full polygon, CCW."""
    # CCW: start at nose, go down the LEFT side (-x), back up the right side (+x)
    left = [(-x, y) for x, y in half]
    right = [(x, y) for x, y in reversed(half) if x != 0]
    poly = left + right
    # ensure CCW (positive area)
    a = sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly)))
    return poly if a > 0 else poly[::-1]


def rect(cx, cy, w, h):
    return [(cx - w / 2, cy - h / 2), (cx + w / 2, cy - h / 2), (cx + w / 2, cy + h / 2), (cx - w / 2, cy + h / 2)]


GENERIC = {
    # each entry: list of (polygon, z0, z1, inset); y runs -1 (stern) .. +1 (nose)
    'xx-small': [  # fighter dart
        (_close([(0, 1.0), (0.12, 0.35), (0.16, -0.2), (0.42, -0.75), (0.40, -0.92), (0.14, -0.78), (0.10, -1.0)]), 0, 0.10, 0.35),
        (_close([(0, 0.55), (0.06, 0.25), (0.06, -0.1)]), 0.10, 0.17, 0.3),
    ],
    'x-small': [  # swept-wing interceptor
        (_close([(0, 1.0), (0.14, 0.45), (0.18, 0.05), (0.62, -0.55), (0.62, -0.72), (0.2, -0.6), (0.16, -1.0)]), 0, 0.10, 0.3),
        (rect(0, -0.15, 0.16, 0.9), 0.10, 0.18, 0.3),
    ],
    'small': [  # delta with twin tails
        (_close([(0, 1.0), (0.22, 0.25), (0.70, -0.55), (0.70, -0.75), (0.22, -0.68), (0.18, -1.0)]), 0, 0.10, 0.3),
        (rect(0.32, -0.62, 0.08, 0.5), 0.10, 0.20, 0.3), (rect(-0.32, -0.62, 0.08, 0.5), 0.10, 0.20, 0.3),
        (rect(0, -0.05, 0.22, 1.1), 0.10, 0.19, 0.35),
    ],
    'medium': [  # body with side pods
        (_close([(0, 1.0), (0.18, 0.75), (0.24, -0.2), (0.22, -1.0)]), 0, 0.16, 0.3),
        (rect(0.48, -0.25, 0.22, 1.1), 0, 0.14, 0.3), (rect(-0.48, -0.25, 0.22, 1.1), 0, 0.14, 0.3),
        (rect(0.32, -0.15, 0.24, 0.16), 0, 0.08, 0), (rect(-0.32, -0.15, 0.24, 0.16), 0, 0.08, 0),
        (rect(0, 0.35, 0.16, 0.4), 0.16, 0.22, 0.3),
    ],
    'large': [  # long freighter hull with stub wings and engine block
        (_close([(0, 1.0), (0.14, 0.86), (0.2, 0.5), (0.2, -0.75), (0.26, -1.0)]), 0, 0.18, 0.25),
        (_close([(0.2, 0.1), (0.58, -0.3), (0.58, -0.48), (0.2, -0.4)]), 0, 0.08, 0),
        (_close([(-0.58, -0.3), (-0.2, 0.1), (-0.2, -0.4), (-0.58, -0.48)]), 0, 0.08, 0),
        (rect(0, 0.2, 0.22, 0.4), 0.18, 0.24, 0.3), (rect(0, -0.4, 0.3, 0.3), 0.18, 0.24, 0.3),
        (rect(0, -0.88, 0.44, 0.22), 0, 0.2, 0.25),
    ],
    'capital': [  # blocky battleship: wedge prow, broad aft section, stepped superstructure
        (_close([(0, 1.0), (0.2, 0.78), (0.26, 0.25), (0.48, -0.05), (0.48, -0.88), (0.3, -1.0)]), 0, 0.18, 0.18),
        (rect(0, 0.05, 0.26, 1.2), 0.18, 0.26, 0.25),
        (rect(0.3, -0.5, 0.14, 0.6), 0.18, 0.24, 0.3), (rect(-0.3, -0.5, 0.14, 0.6), 0.18, 0.24, 0.3),
        (rect(0, -0.3, 0.16, 0.3), 0.26, 0.34, 0.3),
    ],
    'commander': [  # broad flanks, central spine, bridge tower
        (_close([(0, 1.0), (0.3, 0.7), (0.34, 0.2), (0.8, -0.3), (0.8, -0.7), (0.4, -0.75), (0.36, -1.0)]), 0, 0.14, 0.15),
        (rect(0, -0.05, 0.3, 1.6), 0.14, 0.24, 0.25),
        (rect(0.55, -0.5, 0.16, 0.36), 0.14, 0.2, 0.3), (rect(-0.55, -0.5, 0.16, 0.36), 0.14, 0.2, 0.3),
        (rect(0, -0.45, 0.16, 0.24), 0.24, 0.34, 0.3),
    ],
    'titan': [  # massive segmented wedge
        (_close([(0, 1.0), (0.35, 0.72), (0.55, 0.1), (0.9, -0.55), (0.9, -0.8), (0.45, -0.85), (0.42, -1.0)]), 0, 0.16, 0.1),
        (_close([(0, 0.8), (0.22, 0.55), (0.36, -0.1), (0.36, -0.82)]), 0.16, 0.26, 0.15),
        (rect(0, 0.0, 0.14, 1.3), 0.26, 0.32, 0.3),
        (rect(0.62, -0.62, 0.22, 0.3), 0.16, 0.24, 0.3), (rect(-0.62, -0.62, 0.22, 0.3), 0.16, 0.24, 0.3),
        (rect(0, -0.6, 0.3, 0.24), 0.32, 0.4, 0.3),
    ],
}


def generic(cls, parts):
    clear()
    objs = []
    for i, (poly, z0, z1, inset) in enumerate(parts):
        bm = bmesh.new()
        prism(bm, poly, z0, z1, inset)
        me = bpy.data.meshes.new(f'{cls}_{i}')
        bm.to_mesh(me)
        bm.free()
        o = bpy.data.objects.new(me.name, me)
        sc.collection.objects.link(o)
        objs.append(o)
    name = 'gen-' + cls
    meta = {'kind': 'generic', 'sizeClass': cls, 'axis': 'authored', 'source': 'authored +Y nose'}
    render_frame(objs, name, meta)
    meta['enginePx'] = meta['sternPx']
    return name, meta


setup_render()
meta_path = os.path.join(OUT, 'render_meta.json')
all_meta = json.load(open(meta_path)) if os.path.exists(meta_path) else {}
for f in sorted(os.listdir(MODELS)):
    if not f.endswith('.glb'):
        continue
    slug = f[:-4]
    if ONLY and slug not in ONLY:
        continue
    s, m = ship(os.path.join(MODELS, f))
    all_meta[s] = m
    print('SIL', json.dumps(m))
for cls, parts in GENERIC.items():
    if ONLY and ('gen-' + cls) not in ONLY:
        continue
    s, m = generic(cls, parts)
    all_meta[s] = m
    print('SIL', json.dumps(m))
json.dump(all_meta, open(meta_path, 'w'), indent=1)
print('DONE', len(all_meta))
