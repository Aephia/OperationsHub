# render_crew.py - Cycles art for the Crew Explorer, all procedural (no external assets, deterministic).
#   blender -b -P render_crew.py -- <out_dir> frames [tier ...]   -> frame-<tier>.png  (960x1200 RGBA, transparent film)
#   blender -b -P render_crew.py -- <out_dir> bay [samples]       -> bay.png            (1920x1080)
#   blender -b -P render_crew.py -- <out_dir> card [samples]      -> card_crew.png      (1920x1080, packed to 960x540)
# Frame contract (shared with the page): canvas 4:5 = 4.8 x 6.0 units, window = centre rect inset 6 % per side
# (hole 4.224 x 5.28). Nothing is built inside the window. Camera is orthographic, looking +Y.
import sys, os, math, random
import bpy, bmesh
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
OUT = os.path.abspath(argv[0])
MODE = argv[1]
EXTRA = argv[2:]
os.makedirs(OUT, exist_ok=True)

FW, FH = 4.8, 6.0
WW, WH = FW * 0.88, FH * 0.88          # window 4.224 x 5.28
TIERS = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'anomaly']
ACCENT = {'uncommon': '#5fd38a', 'rare': '#4f9dff', 'epic': '#b072ff', 'legendary': '#ffc94a', 'anomaly': '#5ff5d2'}
CYAN = '#4fd8ff'


def lin(hexs, k=1.0):
    h = hexs.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c]
    return (c[0] * k, c[1] * k, c[2] * k, 1.0)


# ------------------------------------------------------------------------------------------------ scene
def reset():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras, bpy.data.worlds):
        for b in list(coll):
            coll.remove(b)


def setup(resx, resy, samples, transparent):
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
    sc.cycles.samples = samples; sc.cycles.use_denoising = True
    sc.cycles.volume_bounces = 1
    sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = resx, resy, 100
    sc.render.film_transparent = transparent
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA' if transparent else 'RGB'
    return sc


def world(top, bottom, base, strength=1.0):
    """Vertical gradient world: bevel highlights pick it up; flat faces see the mid grey."""
    sc = bpy.context.scene
    w = bpy.data.worlds.new('W'); sc.world = w; w.use_nodes = True
    N, L = w.node_tree.nodes, w.node_tree.links
    N.clear()
    tc = N.new('ShaderNodeTexCoord'); sep = N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Generated'], sep.inputs[0])
    mr = N.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = -0.8; mr.inputs['From Max'].default_value = 0.8
    L.new(sep.outputs['Z'], mr.inputs['Value'])
    ramp = N.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].color = bottom; ramp.color_ramp.elements[1].color = top
    L.new(mr.outputs['Result'], ramp.inputs['Fac'])
    bg = N.new('ShaderNodeBackground'); bg.inputs['Strength'].default_value = strength
    L.new(ramp.outputs['Color'], bg.inputs['Color'])
    out = N.new('ShaderNodeOutputWorld'); L.new(bg.outputs[0], out.inputs[0])


def area(name, loc, target, size, energy, color=(1, 1, 1), shape='RECTANGLE'):
    ld = bpy.data.lights.new(name, 'AREA'); ld.shape = shape; ld.size = size; ld.energy = energy; ld.color = color[:3]
    ob = bpy.data.objects.new(name, ld); bpy.context.scene.collection.objects.link(ob)
    ob.location = loc
    ob.rotation_euler = (Vector(target) - Vector(loc)).normalized().to_track_quat('-Z', 'Y').to_euler()
    return ob


# ------------------------------------------------------------------------------------------------ materials
def metal(name, color, rough=0.38, metallic=1.0, brushed=0.15):
    m = bpy.data.materials.new(name); m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    N.clear()
    out = N.new('ShaderNodeOutputMaterial'); out.target = 'ALL'
    p = N.new('ShaderNodeBsdfPrincipled')
    p.inputs['Base Color'].default_value = color; p.inputs['Metallic'].default_value = metallic
    p.inputs['Roughness'].default_value = rough
    L.new(p.outputs[0], out.inputs[0])
    if brushed:
        tc = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping')
        mp.inputs['Scale'].default_value = (60, 60, 4)         # stretched along Z = brushed grain
        L.new(tc.outputs['Object'], mp.inputs['Vector'])
        nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 1.0; nz.inputs['Detail'].default_value = 6
        L.new(mp.outputs[0], nz.inputs['Vector'])
        bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = brushed; bp.inputs['Distance'].default_value = 0.02
        L.new(nz.outputs['Fac'], bp.inputs['Height']); L.new(bp.outputs[0], p.inputs['Normal'])
        rr = N.new('ShaderNodeMapRange'); rr.inputs['To Min'].default_value = rough * 0.75; rr.inputs['To Max'].default_value = rough * 1.25
        L.new(nz.outputs['Fac'], rr.inputs['Value']); L.new(rr.outputs['Result'], p.inputs['Roughness'])
    return m


def emit(name, color, strength):
    m = bpy.data.materials.new(name); m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    N.clear()
    out = N.new('ShaderNodeOutputMaterial'); out.target = 'ALL'
    e = N.new('ShaderNodeEmission'); e.inputs['Color'].default_value = color; e.inputs['Strength'].default_value = strength
    L.new(e.outputs[0], out.inputs[0])
    return m


# ------------------------------------------------------------------------------------------------ geometry
def link(ob, parent=None):
    bpy.context.scene.collection.objects.link(ob)
    if parent is not None:
        ob.parent = parent
    return ob


def box(name, size, loc, mat, parent=None, bevel=0.0):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= size[0]; v.co.y *= size[1]; v.co.z *= size[2]
    bm.to_mesh(me); bm.free()
    ob = link(bpy.data.objects.new(name, me), parent); ob.location = loc
    ob.data.materials.append(mat)
    if bevel:
        bv = ob.modifiers.new('bv', 'BEVEL'); bv.width = bevel; bv.segments = 2; bv.limit_method = 'ANGLE'
    return ob


def ring(name, outer, inner, y0, depth, mat, parent=None, bevel=0.0):
    """Rectangular ring in the XZ plane, front face at y = y0 (towards the camera, -Y), `depth` thick."""
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()

    def loop(w, h, y):
        return [bm.verts.new(Vector((sx * w / 2, y, sz * h / 2))) for sx, sz in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
    of, inf, ob_, ib = loop(*outer, y0), loop(*inner, y0), loop(*outer, y0 + depth), loop(*inner, y0 + depth)
    fs = []
    for i in range(4):
        j = (i + 1) % 4
        fs += [bm.faces.new((of[i], of[j], inf[j], inf[i])), bm.faces.new((ob_[i], ob_[j], ib[j], ib[i])),
               bm.faces.new((of[i], of[j], ob_[j], ob_[i])), bm.faces.new((inf[i], inf[j], ib[j], ib[i]))]
    bmesh.ops.recalc_face_normals(bm, faces=fs)
    bm.to_mesh(me); bm.free()
    ob = link(bpy.data.objects.new(name, me), parent)
    ob.data.materials.append(mat)
    if bevel:
        bv = ob.modifiers.new('bv', 'BEVEL'); bv.width = bevel; bv.segments = 2; bv.limit_method = 'ANGLE'
    return ob


def sphere(name, r, loc, mat, parent=None, scale=(1, 1, 1), seg=24):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=seg // 2, radius=r); bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = link(bpy.data.objects.new(name, me), parent); ob.location = loc; ob.scale = scale
    ob.data.materials.append(mat)
    return ob


def cyl(name, r, h, loc, mat, parent=None, rot=(math.pi / 2, 0, 0), seg=16):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r, depth=h); bm.to_mesh(me); bm.free()
    ob = link(bpy.data.objects.new(name, me), parent); ob.location = loc; ob.rotation_euler = rot
    ob.data.materials.append(mat)
    return ob


# ------------------------------------------------------------------------------------------------ the frame
def make_frame(tier, parent=None, tag=''):
    """Modelled bezel around the transparent window. Front is -Y. Everything lies outside |x|<WW/2, |z|<WH/2."""
    hw, hh = WW / 2, WH / 2
    acc = ACCENT.get(tier)
    gun = metal('gun' + tag, lin('#1b1e24'), 0.40)
    plate = metal('plate' + tag, lin('#262a32'), 0.34)
    if tier == 'legendary':
        rail_m = metal('gold' + tag, lin('#d9a53a'), 0.30, brushed=0.08)
    elif acc:
        base = [v * 0.85 + c * 0.15 for v, c in zip(lin('#2a2e36')[:3], lin(acc)[:3])]
        rail_m = metal('rail' + tag, (*base, 1), 0.30, brushed=0.1)
    else:
        rail_m = metal('rail' + tag, lin('#343942'), 0.32, brushed=0.1)
    # base slab, outer lip ring, inner lip ring (the lip touches the window edge but never enters it)
    ring('base' + tag, (FW, FH), (WW, WH), -0.10, 0.20, gun, parent, 0.02)
    ring('rail' + tag, (FW, FH), (FW - 0.20, FH - 0.20), -0.19, 0.09, rail_m, parent, 0.02)
    ring('lip' + tag, (WW + 0.10, WH + 0.10), (WW, WH), -0.16, 0.06, plate, parent, 0.012)
    # corner brackets and mid-edge plates (within the bezel band only)
    cx, cz = (FW / 2 + hw) / 2, (FH / 2 + hh) / 2           # centre of the bezel corner square
    for sx in (-1, 1):
        for sz in (-1, 1):
            box('cplate', (0.22, 0.05, 0.28), (sx * cx, -0.13, sz * (hh + 0.20)), plate, parent, 0.012).location.x = sx * (hw + 0.17)
    for sz in (-1, 1):
        box('tplate', (1.4, 0.04, 0.10), (0, -0.12, sz * (hh + 0.20)), plate, parent, 0.01)
    for sx in (-1, 1):
        box('splate', (0.08, 0.04, 1.8), (sx * (hw + 0.13), -0.12, 0), plate, parent, 0.01)
    # rivets
    rv = metal('rivet' + tag, lin('#4a505b'), 0.3, brushed=0)
    for sx in (-1, 1):
        for sz in (-1, 1):
            cyl('rv', 0.026, 0.03, (sx * (hw + 0.17), -0.165, sz * (hh + 0.12)), rv, parent)
            cyl('rv', 0.026, 0.03, (sx * (hw + 0.17), -0.165, sz * (hh + 0.28)), rv, parent)
    # accent seam between the outer rail and the inner lip
    if acc:
        strength = 1.6
        em = emit('acc' + tag, lin(acc), strength)
        ring('seam' + tag, (WW + 0.30, WH + 0.30), (WW + 0.25, WH + 0.25), -0.12, 0.03, em, parent)
        if tier == 'anomaly':
            em2 = emit('acc2' + tag, lin(acc), 4.0)
            ring('seam2' + tag, (WW + 0.30, WH + 0.30), (WW + 0.22, WH + 0.22), -0.12, 0.035, em2, parent)
            ring('seam3' + tag, (WW + 0.115, WH + 0.115), (WW + 0.10, WH + 0.10), -0.17, 0.02, em2, parent)
            for sz in (-1, 1):
                box('node', (0.55, 0.03, 0.045), (0, -0.14, sz * (hh + 0.20)), em2, parent)
            for sx in (-1, 1):
                box('node', (0.045, 0.03, 0.9), (sx * (hw + 0.13), -0.14, 0), em2, parent)
    # ornament level
    if tier in ('epic', 'legendary', 'anomaly'):
        gem = emit('gem' + tag, lin(acc), 2.2)
        for sx in (-1, 1):
            for sz in (-1, 1):
                sphere('stud', 0.055 if tier != 'legendary' else 0.065, (sx * (hw + 0.17), -0.20, sz * (hh + 0.20)), gem, parent)
    if tier == 'legendary':
        gold = rail_m
        gem = emit('gemL' + tag, lin('#ffc94a'), 2.0)
        for sx in (-1, 1):
            for sz in (-1, 1):
                x, z = sx * (hw + 0.17), sz * (hh + 0.20)
                # diamond crest on the bracket plus spikes along the bezel edges
                d = box('crest', (0.15, 0.06, 0.15), (x, -0.22, z), gold, parent, 0.01); d.rotation_euler = (0, math.pi / 4, 0)
                box('spk', (0.20, 0.04, 0.045), (sx * (hw + 0.17), -0.20, sz * (hh + 0.20 + 0.0)), gold, parent, 0.008)
                for k in (-1, 1):
                    box('spk', (0.045, 0.04, 0.16), (x + k * 0.0, -0.20, z + sz * 0.0), gold, parent, 0.008)
        for sz in (-1, 1):
            d = box('crest', (0.20, 0.07, 0.20), (0, -0.21, sz * (hh + 0.20)), gold, parent, 0.01); d.rotation_euler = (0, math.pi / 4, 0)
            sphere('gem', 0.04, (0, -0.26, sz * (hh + 0.20)), gem, parent)
        for sx in (-1, 1):
            d = box('crest', (0.15, 0.07, 0.15), (sx * (hw + 0.13), -0.21, 0), gold, parent, 0.01); d.rotation_euler = (0, math.pi / 4, 0)
            sphere('gem', 0.035, (sx * (hw + 0.13), -0.26, 0), gem, parent)


def render(path):
    sc = bpy.context.scene
    if os.path.exists(path):
        os.remove(path)
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print('RENDER_REPORT', os.path.basename(path), os.path.exists(path), os.path.getsize(path) if os.path.exists(path) else -1, flush=True)


def ortho_cam(sc):
    cd = bpy.data.cameras.new('Cam'); cd.type = 'ORTHO'; cd.ortho_scale = FH; cd.clip_end = 100
    cam = bpy.data.objects.new('Cam', cd); link(cam); sc.camera = cam
    cam.location = (0, -10, 0); cam.rotation_euler = (math.pi / 2, 0, 0)       # looks +Y, up = +Z


def render_frames(tiers):
    for t in tiers:
        reset()
        sc = setup(960, 1200, 128, True)
        world(lin('#c8d8ff', 1.0), lin('#05060a'), None, 0.9)
        ortho_cam(sc)
        make_frame(t)
        area('key', (-4.5, -6, 5), (0, 0, 0), 5.0, 900, (1.0, 0.96, 0.9))
        area('rim', (4.5, -5, -4), (0, 0, 0), 4.0, 350, (0.7, 0.85, 1.0))
        area('top', (0, -4, 6.5), (0, 0, 0), 6.0, 250, (1, 1, 1))
        render(os.path.join(OUT, 'frame-%s.png' % t))


# ------------------------------------------------------------------------------------------------ the bay
RX, RZ, RY = 6.0, 4.5, 18.0          # half width, height, depth of the room


def wallmap(side):
    """(u along wall, d out of wall, z) -> world, plus the size permutation, for the left / right / back walls."""
    if side == 'back':
        return (lambda u, d, z: (u, RY - d, z)), (lambda w, dp, h: (w, dp, h))
    if side == 'left':
        return (lambda u, d, z: (-RX + d, u, z)), (lambda w, dp, h: (dp, w, h))
    return (lambda u, d, z: (RX - d, u, z)), (lambda w, dp, h: (dp, w, h))


def locker_row(side, u0, count, pitch, mats, rows=2, seed=1):
    rnd = random.Random(seed)
    wf, sz = wallmap(side)
    body, door, led_c, led_a, vent = mats
    for i in range(count):
        u = u0 + i * pitch
        for r in range(rows):
            z0 = 0.15 + r * 2.0
            box('lk', sz(pitch * 0.94, 0.55, 1.9), wf(u, 0.275, z0 + 0.95), body, None, 0.01)
            box('dr', sz(pitch * 0.86, 0.04, 1.82), wf(u, 0.57, z0 + 0.95), door, None, 0.008)
            for k in range(4):
                box('vt', sz(pitch * 0.5, 0.02, 0.025), wf(u, 0.595, z0 + 1.45 + k * 0.07), vent)
            box('led', sz(0.05, 0.02, 0.05), wf(u + pitch * 0.30, 0.595, z0 + 1.72), led_c if rnd.random() < 0.8 else led_a)
            box('hd', sz(0.04, 0.05, 0.18), wf(u - pitch * 0.30, 0.61, z0 + 0.9), vent)


def bunk_row(u0, count, pitch, mats):
    body, door, led_c, led_a, vent = mats
    blanket = metal('blanket', lin('#1a2330'), 0.8, 0.0, 0)
    for i in range(count):
        u = u0 + i * pitch
        for r in range(2):
            z = 0.55 + r * 1.55
            box('mat', (2.1, 0.95, 0.14), (-RX + 1.1, u, z + 0.07), body, None, 0.02)
            box('bl', (2.0, 0.9, 0.12), (-RX + 1.15, u, z + 0.2), blanket, None, 0.03)
            box('pil', (0.5, 0.7, 0.14), (-RX + 0.45, u, z + 0.32), door, None, 0.04)
        for dy in (-0.52, 0.52):
            for dx in (0.12, 2.1):
                box('post', (0.07, 0.07, 3.0), (-RX + dx, u + dy, 1.5), vent)
        box('strip', (0.03, 0.8, 0.03), (-RX + 2.14, u, 0.45), led_c)
        box('strip', (0.03, 0.8, 0.03), (-RX + 2.14, u, 2.0), led_c)


def build_room(accent_k=1.0, bunks=True):
    cy = lin(CYAN)
    floor = metal('floor', lin('#0b0e14'), 0.22, 0.6, 0.05)
    wallm = metal('wall', lin('#10141b'), 0.5, 0.7, 0.05)
    body = metal('lkbody', lin('#1a1f28'), 0.42, 0.9, 0.1)
    door = metal('lkdoor', lin('#222833'), 0.36, 0.9, 0.1)
    vent = metal('vent', lin('#07090c'), 0.6, 0.5, 0)
    led_c = emit('ledc', lin(CYAN), 3.0 * accent_k)
    led_a = emit('leda', lin('#ff6040'), 2.5 * accent_k)
    grid = emit('grid', lin(CYAN), 0.5 * accent_k)
    strip = emit('strip', lin('#7fe3ff'), 5.0 * accent_k)
    box('floor', (2 * RX, RY + 2, 0.1), (0, RY / 2, -0.05), floor)
    box('ceil', (2 * RX, RY + 2, 0.1), (0, RY / 2, RZ + 0.05), wallm)
    box('wallL', (0.1, RY + 2, RZ), (-RX - 0.05, RY / 2, RZ / 2), wallm)
    box('wallR', (0.1, RY + 2, RZ), (RX + 0.05, RY / 2, RZ / 2), wallm)
    box('wallB', (2 * RX, 0.1, RZ), (0, RY + 0.05, RZ / 2), wallm)
    box('wallF', (2 * RX, 0.1, RZ), (0, -3.05, RZ / 2), wallm)
    # floor grid, 1 m pitch
    for i in range(int(2 * RX) + 1):
        box('g', (0.015, RY, 0.012), (-RX + i, RY / 2, 0.006), grid)
    for j in range(int(RY) + 1):
        box('g', (2 * RX, 0.015, 0.012), (0, j, 0.006), grid)
    # ceiling light strips and cross ribs
    for x in (-3.2, 0.0, 3.2):
        box('cs', (0.18, RY - 1, 0.04), (x, RY / 2, RZ - 0.02), strip)
    for y in range(2, int(RY), 4):
        box('rib', (2 * RX, 0.25, 0.3), (0, y, RZ - 0.15), wallm, None, 0.01)
    mats = (body, door, led_c, led_a, vent)
    locker_row('back', -RX + 0.5, 12, 1.0, mats, 2, 11)
    locker_row('right', 1.0, 17, 1.0, mats, 2, 12)
    if bunks:
        bunk_row(1.2, 8, 2.0, mats)
    else:
        locker_row('left', 1.0, 17, 1.0, mats, 2, 13)
    # cyan rim strips along the wall feet
    box('foot', (0.05, RY, 0.05), (-RX + 0.1, RY / 2, 0.1), led_c)
    box('foot', (0.05, RY, 0.05), (RX - 0.1, RY / 2, 0.1), led_c)
    # a volume for the volumetric light
    vol = bpy.data.materials.new('vol'); vol.use_nodes = True
    N, L = vol.node_tree.nodes, vol.node_tree.links; N.clear()
    out = N.new('ShaderNodeOutputMaterial'); out.target = 'ALL'
    pv = N.new('ShaderNodeVolumePrincipled'); pv.inputs['Color'].default_value = (0.6, 0.85, 1, 1)
    pv.inputs['Density'].default_value = 0.010; pv.inputs['Anisotropy'].default_value = 0.35
    L.new(pv.outputs[0], out.inputs['Volume'])
    box('vol', (2 * RX - 0.2, RY - 0.1, RZ - 0.2), (0, RY / 2, RZ / 2), vol)
    # lights: cyan key from the ceiling strips plus a back-wall wash
    for x in (-3.2, 3.2):
        area('cl%d' % x, (x, 6, RZ - 0.2), (x, 6, 0), 1.2, 900, (0.31, 0.85, 1.0))
        area('cm%d' % x, (x, 13, RZ - 0.2), (x, 13, 0), 1.2, 900, (0.31, 0.85, 1.0))
    area('wash', (0, RY - 1.2, 3.8), (0, RY, 1.0), 6.0, 800, (0.3, 0.8, 1.0))


def persp_cam(sc, loc, target, lens):
    cd = bpy.data.cameras.new('Cam'); cd.lens = lens; cd.clip_end = 200
    cam = bpy.data.objects.new('Cam', cd); link(cam); sc.camera = cam
    cam.location = loc
    cam.rotation_euler = (Vector(target) - Vector(loc)).normalized().to_track_quat('-Z', 'Y').to_euler()


def render_bay(samples):
    reset()
    sc = setup(1920, 1080, samples, False)
    sc.view_settings.exposure = -2.8       # keeps mean luminance < 0.12 so white text reads
    world(lin('#040608'), lin('#010203'), None, 1.0)
    build_room()
    persp_cam(sc, (0.0, 0.6, 1.65), (0.0, 12, 1.5), 22)
    render(os.path.join(OUT, 'bay.png'))


def render_card(samples):
    reset()
    sc = setup(1920, 1080, samples, False)
    world(lin('#040608'), lin('#010203'), None, 1.0)
    build_room(0.8, bunks=False)
    cols = ['common', 'uncommon', 'rare', 'epic', 'legendary']
    sc.view_settings.exposure = -1.5
    sil = emit('sil', lin(CYAN), 0.35)
    back = metal('back', lin('#05080d'), 0.15, 0.8, 0)
    y = RY - 0.9
    for i, t in enumerate(cols):
        s = 0.40 if i != 2 else 0.46
        x = (i - 2) * 2.35
        zc = 2.15
        emp = bpy.data.objects.new('card%d' % i, None); link(emp)
        emp.location = (x, y, zc); emp.scale = (s, s, s)
        make_frame(t, emp, tag=str(i))
        # empty card: dark backing pane and a dim bust silhouette in the window
        box('pane', (WW + 0.1, 0.05, WH + 0.1), (0, 0.22, 0), back, emp)
        sphere('head', 0.55, (0, 0.18, 0.45), sil, emp, (1, 0.03, 1.2))        # kept inside the window
        sphere('body', 1.0, (0, 0.18, -1.85), sil, emp, (1.7, 0.03, 0.72))
    for i in range(5):
        x = (i - 2) * 2.35
        area('ck%d' % i, (x - 0.8, y - 3.0, 4.0), (x, y, 2.1), 1.6, 500, (0.55, 0.88, 1.0))
    persp_cam(sc, (0.0, 6.5, 1.9), (0.0, y, 2.0), 28)
    render(os.path.join(OUT, 'card_crew.png'))


random.seed(7)
if MODE == 'frames':
    render_frames(EXTRA or TIERS)
elif MODE == 'bay':
    render_bay(int(EXTRA[0]) if EXTRA else 160)
elif MODE == 'card':
    render_card(int(EXTRA[0]) if EXTRA else 160)
else:
    raise SystemExit('mode must be frames | bay | card')
