# render_planets.py - Cycles sprites for the Planet Explorer: 8 planet categories x 3 variants and the 5 star types,
# all procedural (no textures). Every sprite shares ONE frame so the page can scale them by one rule:
#   planet radius 1.0 in an orthographic frame of half-width HALF (1.47) -> radius = 0.68 of the half-size.
#   stars render as a bare disc filling the frame (radius 0.98); pack_planets.py adds the halo.
# Lit from the upper-left-front (the old CSS sphere highlight sat at 34% / 30%), transparent film.
#   blender -b -P render_planets.py -- <out_dir> <res> <samples> [name ...]
# Output: <out_dir>/<slug>_<v>.png (planets), star_<type>.png. Existing files are re-rendered (no skip).
import sys, os, math, random
import bpy, bmesh
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
OUT = os.path.abspath(argv[0])
RES, SAMPLES = int(argv[1]), int(argv[2])
ONLY = set(argv[3:])
HALF = 1.47
os.makedirs(OUT, exist_ok=True)

SUN_TRAVEL = Vector((0.80, 0.22, -0.56)).normalized()    # from upper-left-front (-x, -y, +z) toward lower-right-back


# ---------------------------------------------------------------------------------------------- scene
def reset():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras):
        for b in list(coll):
            coll.remove(b)


def setup_scene():
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
    sc.cycles.transparent_max_bounces = 16
    sc.render.resolution_x = sc.render.resolution_y = RES; sc.render.resolution_percentage = 100
    sc.render.film_transparent = True
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    w = bpy.data.worlds.new('Void'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs['Color'].default_value = (0.55, 0.62, 0.80, 1)
    bg.inputs['Strength'].default_value = 0.035                       # a whisper of fill so the night side is not void
    return sc


def camera_and_sun(sc, half, sun=True, sun_energy=4.2):
    cd = bpy.data.cameras.new('Cam'); cd.type = 'ORTHO'; cd.ortho_scale = half * 2; cd.clip_end = 100
    cam = bpy.data.objects.new('Cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    cam.location = (0, -10, 0); cam.rotation_euler = Vector((0, 1, 0)).to_track_quat('-Z', 'Y').to_euler()
    if sun:
        ld = bpy.data.lights.new('Sun', 'SUN'); ld.energy = sun_energy; ld.angle = math.radians(1.5)
        ld.color = (1.0, 0.97, 0.92)
        ob = bpy.data.objects.new('Sun', ld); sc.collection.objects.link(ob)
        ob.rotation_euler = SUN_TRAVEL.to_track_quat('-Z', 'Y').to_euler()


def sphere(name, radius, segs=192):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=segs, v_segments=segs // 2, radius=radius); bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(ob)
    return ob


def render(path):
    sc = bpy.context.scene
    if os.path.exists(path):
        os.remove(path)
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print('RENDER_REPORT', os.path.basename(path), os.path.exists(path), os.path.getsize(path) if os.path.exists(path) else -1, flush=True)


# ---------------------------------------------------------------------------------------------- node helpers
class G:
    """Tiny node-graph builder over one material."""
    def __init__(self, name):
        self.m = bpy.data.materials.new(name); self.m.use_nodes = True
        self.N = self.m.node_tree.nodes; self.L = self.m.node_tree.links
        self.N.clear()
        self.out = self.N.new('ShaderNodeOutputMaterial'); self.out.target = 'ALL'
        tc = self.N.new('ShaderNodeTexCoord'); self.obj = tc.outputs['Object']

    def link(self, a, b):
        self.L.new(a, b)

    def node(self, kind, **inputs):
        n = self.N.new(kind)
        for k, v in inputs.items():
            if hasattr(v, 'is_linked'):          # a socket
                self.link(v, n.inputs[k])
            else:
                n.inputs[k].default_value = v
        return n

    def noise(self, scale, detail=8, rough=0.55, dist=0.0, w=0.0, vec=None):
        n = self.node('ShaderNodeTexNoise'); n.noise_dimensions = '4D'
        n.inputs['Scale'].default_value = scale; n.inputs['Detail'].default_value = detail
        n.inputs['Roughness'].default_value = rough; n.inputs['Distortion'].default_value = dist
        n.inputs['W'].default_value = w
        self.link(vec if vec is not None else self.obj, n.inputs['Vector'])
        return n.outputs['Fac']

    def ramp(self, fac, stops):
        r = self.N.new('ShaderNodeValToRGB'); cr = r.color_ramp
        cr.elements[0].position, cr.elements[0].color = stops[0][0], (*stops[0][1], 1)
        cr.elements[1].position, cr.elements[1].color = stops[-1][0], (*stops[-1][1], 1)
        for p, c in stops[1:-1]:
            e = cr.elements.new(p); e.color = (*c, 1)
        self.link(fac, r.inputs['Fac'])
        return r.outputs['Color']

    def math(self, op, a, b=None, clamp=False):
        n = self.N.new('ShaderNodeMath'); n.operation = op; n.use_clamp = clamp
        for i, v in enumerate((a, b)):
            if v is None:
                continue
            if hasattr(v, 'is_linked'):
                self.link(v, n.inputs[i])
            else:
                n.inputs[i].default_value = v
        return n.outputs['Value']

    def maprange(self, v, a, b, c=0.0, d=1.0):
        n = self.node('ShaderNodeMapRange', **{'From Min': a, 'From Max': b, 'To Min': c, 'To Max': d}); n.clamp = True
        self.link(v, n.inputs['Value'])
        return n.outputs['Result']

    def mix(self, fac, a, b):
        n = self.N.new('ShaderNodeMix'); n.data_type = 'RGBA'
        for k, v in (('Factor', fac), ('A', a), ('B', b)):
            if hasattr(v, 'is_linked'):
                self.link(v, n.inputs[k])
            else:
                n.inputs[k].default_value = v if k == 'Factor' else (*v, 1)
        return n.outputs['Result']

    def polar(self):
        """abs(z) of the object coordinate (0 at the equator, 1 at the poles)."""
        sep = self.N.new('ShaderNodeSeparateXYZ'); self.link(self.obj, sep.inputs['Vector'])
        return self.math('ABSOLUTE', sep.outputs['Z'])

    def warped(self, scale, amount, w):
        """object coords displaced by a low-frequency vector noise (breaks up straight bands)."""
        n = self.node('ShaderNodeTexNoise'); n.noise_dimensions = '4D'
        n.inputs['Scale'].default_value = scale; n.inputs['Detail'].default_value = 4; n.inputs['W'].default_value = w
        self.link(self.obj, n.inputs['Vector'])
        sub = self.node('ShaderNodeVectorMath'); sub.operation = 'SUBTRACT'
        self.link(n.outputs['Color'], sub.inputs[0]); sub.inputs[1].default_value = (0.5, 0.5, 0.5)
        sc = self.node('ShaderNodeVectorMath'); sc.operation = 'SCALE'; sc.inputs['Scale'].default_value = amount
        self.link(sub.outputs['Vector'], sc.inputs[0])
        add = self.node('ShaderNodeVectorMath'); add.operation = 'ADD'
        self.link(self.obj, add.inputs[0]); self.link(sc.outputs['Vector'], add.inputs[1])
        return add.outputs['Vector']

    def principled(self, color, rough=0.8, normal=None, emit=None, emit_strength=None):
        b = self.N.new('ShaderNodeBsdfPrincipled')
        self.link(color, b.inputs['Base Color']) if hasattr(color, 'is_linked') else None
        b.inputs['Roughness'].default_value = rough
        if normal is not None:
            self.link(normal, b.inputs['Normal'])
        if emit is not None:
            self.link(emit, b.inputs['Emission Color']) if hasattr(emit, 'is_linked') else None
            if hasattr(emit_strength, 'is_linked'):
                self.link(emit_strength, b.inputs['Emission Strength'])
            else:
                b.inputs['Emission Strength'].default_value = emit_strength or 0.0
        return b

    def bump(self, height, strength=0.4, dist=0.02):
        n = self.node('ShaderNodeBump', Strength=strength, Distance=dist); self.link(height, n.inputs['Height'])
        return n.outputs['Normal']

    def surface(self, shader):
        self.link(shader.outputs[0], self.out.inputs['Surface'])
        return self.m


def atmosphere(parent, color, strength, blend=0.12, power=5.0, radius=1.035):
    a = sphere('Atmo', radius, 128); a.parent = parent
    g = G('AtmoMat')
    lw = g.node('ShaderNodeLayerWeight', Blend=blend)
    fac = g.math('POWER', lw.outputs['Facing'], power)
    geo = g.N.new('ShaderNodeNewGeometry')
    dot = g.node('ShaderNodeVectorMath'); dot.operation = 'DOT_PRODUCT'
    g.link(geo.outputs['Normal'], dot.inputs[0]); dot.inputs[1].default_value = tuple(-SUN_TRAVEL)
    lit = g.maprange(dot.outputs['Value'], -0.45, 0.55, 0.06, 1.0)
    f = g.math('MULTIPLY', fac, lit, clamp=True)
    em = g.node('ShaderNodeEmission', Strength=strength); em.inputs['Color'].default_value = (*color, 1)
    tr = g.N.new('ShaderNodeBsdfTransparent')
    mx = g.N.new('ShaderNodeMixShader')
    g.link(f, mx.inputs['Fac']); g.link(tr.outputs[0], mx.inputs[1]); g.link(em.outputs[0], mx.inputs[2])
    a.data.materials.append(g.surface(mx)); a.visible_shadow = False
    return a


def clouds(parent, w, cover, scale=2.2, radius=1.012):
    c = sphere('Clouds', radius, 160); c.parent = parent
    g = G('CloudMat')
    v = g.warped(1.4, 0.55, w + 3.1)
    n = g.noise(scale, 10, 0.6, 0.0, w + 7.0, vec=v)
    mask = g.maprange(n, cover, cover + 0.16)
    b = g.N.new('ShaderNodeBsdfPrincipled'); b.inputs['Base Color'].default_value = (0.92, 0.94, 0.97, 1)
    b.inputs['Roughness'].default_value = 1.0
    tr = g.N.new('ShaderNodeBsdfTransparent')
    mx = g.N.new('ShaderNodeMixShader')
    g.link(mask, mx.inputs['Fac']); g.link(tr.outputs[0], mx.inputs[1]); g.link(b.outputs[0], mx.inputs[2])
    c.data.materials.append(g.surface(mx))
    return c


def ring(parent, inner, outer, w, tint, opacity=0.85):
    me = bpy.data.meshes.new('Ring'); bm = bmesh.new()
    segs = 256
    vin = [bm.verts.new((inner * math.cos(2 * math.pi * i / segs), inner * math.sin(2 * math.pi * i / segs), 0)) for i in range(segs)]
    vout = [bm.verts.new((outer * math.cos(2 * math.pi * i / segs), outer * math.sin(2 * math.pi * i / segs), 0)) for i in range(segs)]
    for i in range(segs):
        j = (i + 1) % segs
        bm.faces.new((vin[i], vout[i], vout[j], vin[j]))
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new('Ring', me); bpy.context.scene.collection.objects.link(ob); ob.parent = parent
    g = G('RingMat')
    # radial bands: length of the object coord -> a 1D noise lookup
    ln = g.node('ShaderNodeVectorMath'); ln.operation = 'LENGTH'; g.link(g.obj, ln.inputs[0])
    comb = g.node('ShaderNodeCombineXYZ'); g.link(ln.outputs['Value'], comb.inputs['X'])
    comb.inputs['Y'].default_value = w; comb.inputs['Z'].default_value = 0.0
    bands = g.noise(14.0, 6, 0.7, 0.0, w, vec=comb.outputs['Vector'])
    edge = g.math('MULTIPLY', g.maprange(ln.outputs['Value'], inner, inner + 0.05), g.maprange(ln.outputs['Value'], outer, outer - 0.06))
    alpha = g.math('MULTIPLY', g.math('MULTIPLY', g.maprange(bands, 0.30, 0.70, 0.15, 1.0), edge), opacity, clamp=True)
    col = g.ramp(bands, [(0.3, tuple(c * 0.55 for c in tint)), (0.7, tint)])
    b = g.principled(col, 0.9)
    tr = g.N.new('ShaderNodeBsdfTransparent')
    mx = g.N.new('ShaderNodeMixShader')
    g.link(alpha, mx.inputs['Fac']); g.link(tr.outputs[0], mx.inputs[1]); g.link(b.outputs[0], mx.inputs[2])
    ob.data.materials.append(g.surface(mx))
    return ob


# ---------------------------------------------------------------------------------------------- planet materials
def mat_terrestrial(g, w, v):
    pal = [((0.010, 0.040, 0.110), (0.020, 0.120, 0.190), (0.090, 0.230, 0.080), (0.250, 0.210, 0.110)),
           ((0.008, 0.030, 0.090), (0.030, 0.140, 0.170), (0.140, 0.260, 0.060), (0.330, 0.240, 0.140)),
           ((0.012, 0.035, 0.100), (0.025, 0.110, 0.170), (0.060, 0.180, 0.070), (0.380, 0.330, 0.240))][v]
    vec = g.warped(1.2, 0.7, w)
    n = g.noise(1.4, 12, 0.58, 0.0, w, vec=vec)
    col = g.ramp(n, [(0.44, pal[0]), (0.50, pal[1]), (0.52, pal[2]), (0.66, pal[3]), (0.76, (0.55, 0.52, 0.45))])
    ice = g.maprange(g.math('ADD', g.polar(), g.math('MULTIPLY', g.noise(5, 4, 0.5, 0, w + 2), 0.18)), 0.80, 0.86)
    col = g.mix(ice, col, (0.85, 0.88, 0.92))
    return g.principled(col, 0.75, normal=g.bump(n, 0.25))


def mat_oceanic(g, w, v):
    deep = [(0.004, 0.025, 0.110), (0.003, 0.040, 0.120), (0.010, 0.020, 0.090)][v]
    vec = g.warped(1.0, 0.6, w)
    n = g.noise(1.8, 12, 0.6, 0.0, w, vec=vec)
    col = g.ramp(n, [(0.50, deep), (0.64, (0.015, 0.110, 0.230)), (0.665, (0.10, 0.30, 0.22)), (0.72, (0.20, 0.30, 0.14))])
    ice = g.maprange(g.polar(), 0.86, 0.90)
    col = g.mix(ice, col, (0.82, 0.88, 0.95))
    b = g.principled(col, 0.5)
    return b


def mat_volcanic(g, w, v):
    vec = g.warped(1.6, 0.5, w)
    n = g.noise(2.2, 10, 0.62, 0.0, w, vec=vec)
    rock = g.ramp(n, [(0.30, (0.020, 0.014, 0.012)), (0.55, (0.075, 0.040, 0.030)), (0.80, (0.13, 0.09, 0.07))])
    vor = g.node('ShaderNodeTexVoronoi'); vor.feature = 'DISTANCE_TO_EDGE'; vor.voronoi_dimensions = '4D'
    vor.inputs['Scale'].default_value = [3.2, 4.0, 2.6][v]; vor.inputs['W'].default_value = w
    g.link(vec, vor.inputs['Vector'])
    cracks = g.maprange(vor.outputs['Distance'], 0.03, 0.0)
    hot = g.maprange(g.noise(1.3, 3, 0.5, 0, w + 5), 0.50, 0.60)          # only some regions are active
    lava = g.math('MULTIPLY', cracks, hot)
    pools = g.maprange(n, 0.30, 0.22)                                      # low basins glow too
    lava = g.math('MAXIMUM', lava, g.math('MULTIPLY', pools, hot))
    emit = g.ramp(lava, [(0.0, (0.6, 0.06, 0.0)), (0.6, (1.0, 0.32, 0.02)), (1.0, (1.0, 0.75, 0.25))])
    return g.principled(rock, 0.9, normal=g.bump(n, 0.5), emit=emit, emit_strength=g.math('MULTIPLY', lava, 6.0))


def mat_barren(g, w, v):
    pal = [((0.16, 0.13, 0.10), (0.42, 0.36, 0.28)), ((0.12, 0.12, 0.12), (0.40, 0.39, 0.37)), ((0.20, 0.12, 0.08), (0.48, 0.33, 0.22))][v]
    n = g.noise(2.6, 10, 0.6, 0.0, w)
    vor = g.node('ShaderNodeTexVoronoi'); vor.voronoi_dimensions = '4D'
    vor.inputs['Scale'].default_value = 3.4; vor.inputs['W'].default_value = w; vor.inputs['Randomness'].default_value = 1.0
    g.link(g.obj, vor.inputs['Vector'])
    # crater profile: bowl inside, raised rim, flat outside (F1 distance in cells)
    d = vor.outputs['Distance']
    bowl = g.maprange(d, 0.0, 0.30, -1.0, 0.0)
    rim = g.math('MULTIPLY', g.maprange(d, 0.24, 0.30), g.maprange(d, 0.38, 0.30))
    vor2 = g.node('ShaderNodeTexVoronoi'); vor2.voronoi_dimensions = '4D'
    vor2.inputs['Scale'].default_value = 9.0; vor2.inputs['W'].default_value = w + 1
    g.link(g.obj, vor2.inputs['Vector'])
    small = g.maprange(vor2.outputs['Distance'], 0.0, 0.25, -0.6, 0.0)
    h = g.math('ADD', g.math('ADD', g.math('ADD', bowl, rim), g.math('MULTIPLY', small, 0.6)), g.math('MULTIPLY', n, 0.8))
    col = g.ramp(n, [(0.35, pal[0]), (0.70, pal[1])])
    col = g.mix(g.maprange(rim, 0.0, 1.0, 0.0, 0.35), col, tuple(min(1, c * 1.5) for c in pal[1]))
    return g.principled(col, 0.95, normal=g.bump(h, 0.55, 0.03))


def banded(g, w, stops, scale, distortion, warp):
    vec = g.warped(1.1, warp, w)
    wave = g.node('ShaderNodeTexWave'); wave.wave_type = 'BANDS'; wave.bands_direction = 'Z'
    wave.inputs['Scale'].default_value = scale; wave.inputs['Distortion'].default_value = distortion
    wave.inputs['Detail'].default_value = 6; wave.inputs['Detail Scale'].default_value = 1.4
    g.link(vec, wave.inputs['Vector'])
    fine = g.noise(6.0, 8, 0.6, 0.0, w + 4, vec=vec)
    f = g.math('ADD', g.math('MULTIPLY', wave.outputs['Fac'], 0.75), g.math('MULTIPLY', fine, 0.25))
    return g.ramp(f, stops)


def mat_gas(g, w, v):
    stops = [[(0.15, (0.22, 0.10, 0.04)), (0.40, (0.62, 0.36, 0.16)), (0.60, (0.85, 0.70, 0.48)), (0.85, (0.55, 0.28, 0.10))],
             [(0.15, (0.30, 0.20, 0.12)), (0.45, (0.78, 0.62, 0.42)), (0.65, (0.92, 0.85, 0.70)), (0.90, (0.45, 0.30, 0.20))],
             [(0.15, (0.35, 0.10, 0.05)), (0.45, (0.80, 0.42, 0.18)), (0.62, (0.95, 0.78, 0.55)), (0.88, (0.62, 0.20, 0.08))]][v]
    return g.principled(banded(g, w, stops, 1.6, 6.0, 0.35), 0.6)


def mat_ice(g, w, v):
    stops = [[(0.2, (0.18, 0.42, 0.55)), (0.55, (0.45, 0.72, 0.82)), (0.85, (0.70, 0.88, 0.92))],
             [(0.2, (0.10, 0.25, 0.55)), (0.55, (0.30, 0.55, 0.82)), (0.85, (0.60, 0.78, 0.95))],
             [(0.2, (0.22, 0.48, 0.52)), (0.55, (0.52, 0.80, 0.80)), (0.85, (0.82, 0.93, 0.95))]][v]
    return g.principled(banded(g, w, stops, 1.1, 3.0, 0.15), 0.45)


def mat_dark(g, w, v):
    vein_col = [(0.42, 0.36, 1.0), (0.70, 0.30, 1.0), (0.25, 0.55, 1.0)][v]
    vec = g.warped(1.5, 0.6, w)
    n = g.noise(2.0, 10, 0.6, 0.0, w, vec=vec)
    col = g.ramp(n, [(0.3, (0.008, 0.008, 0.016)), (0.7, (0.045, 0.040, 0.070))])
    vor = g.node('ShaderNodeTexVoronoi'); vor.feature = 'DISTANCE_TO_EDGE'; vor.voronoi_dimensions = '4D'
    vor.inputs['Scale'].default_value = 3.0; vor.inputs['W'].default_value = w
    g.link(vec, vor.inputs['Vector'])
    vein = g.math('MULTIPLY', g.maprange(vor.outputs['Distance'], 0.03, 0.0), g.maprange(g.noise(1.6, 3, 0.5, 0, w + 9), 0.53, 0.62))
    emit = g.node('ShaderNodeRGB'); emit.outputs[0].default_value = (*vein_col, 1)
    return g.principled(col, 0.6, normal=g.bump(n, 0.3), emit=emit.outputs[0], emit_strength=g.math('MULTIPLY', vein, 2.2))


SPEC = {
    'terrestrial': dict(mat=mat_terrestrial, atmo=((0.35, 0.62, 1.0), 6.0), clouds=0.56),
    'oceanic':     dict(mat=mat_oceanic, atmo=((0.30, 0.72, 1.0), 8.0), clouds=0.50),
    'volcanic':    dict(mat=mat_volcanic, atmo=((1.0, 0.32, 0.08), 3.0)),
    'barren':      dict(mat=mat_barren),
    'gas':         dict(mat=mat_gas, atmo=((1.0, 0.78, 0.50), 2.2), ring=((0.86, 0.74, 0.56),)),
    'ice':         dict(mat=mat_ice, atmo=((0.45, 0.85, 1.0), 7.0)),
    'dark':        dict(mat=mat_dark, atmo=((0.50, 0.40, 1.0), 4.0)),
}


def build_planet(slug, v):
    sc = bpy.context.scene
    reset(); camera_and_sun(sc, HALF)
    rnd = random.Random(f'{slug}{v}')
    w = rnd.uniform(0, 100)
    root = bpy.data.objects.new('Root', None); sc.collection.objects.link(root)
    root.rotation_euler = (math.radians(rnd.uniform(14, 20)), math.radians(-16 + rnd.uniform(-4, 4)), 0.0)
    spec = SPEC[slug]
    p = sphere('Planet', 1.0); p.parent = root
    g = G(slug); p.data.materials.append(g.surface(spec['mat'](g, w, v)))
    if 'clouds' in spec:
        clouds(root, w, spec['clouds'] + rnd.uniform(-0.03, 0.03))
    if 'atmo' in spec:
        atmosphere(root, *spec['atmo'])
    if ('ring' in spec or (slug == 'ice' and v == 2)) and not os.environ.get('NORING'):
        tint = spec['ring'][0] if 'ring' in spec else (0.70, 0.85, 0.92)
        ring(root, 1.22, 1.44, w, tint, 0.85 if 'ring' in spec else 0.45)
    # the ring sits in the root's XY plane; the root's X tilt makes it a thin ellipse to the camera.
    # spin the planet (not the ring) about its own axis so the variant shows a different face
    p.rotation_euler = (0, 0, math.radians(rnd.uniform(0, 360)))
    render(os.path.join(OUT, f'{slug}_{v}.png'))


def build_belt(v):
    """Asteroid belt portrait: a tilted band of displaced rocks crossing the frame."""
    sc = bpy.context.scene
    reset(); camera_and_sun(sc, HALF, sun_energy=4.8)
    rnd = random.Random(f'belt{v}')
    g = G('Rock')
    n = g.noise(4.0, 8, 0.6, 0.0, v * 13.0)
    col = g.ramp(n, [(0.3, (0.07, 0.06, 0.05)), (0.7, (0.30, 0.27, 0.23))])
    rock_mat = g.surface(g.principled(col, 0.95, normal=g.bump(n, 0.6)))
    tex = bpy.data.textures.new('RockNoise', 'VORONOI'); tex.noise_scale = 0.5
    tilt = math.radians(-18)
    count = 46
    for i in range(count):
        t = rnd.uniform(-1, 1)
        x = t * 1.35; y = rnd.uniform(-0.6, 0.6); z = rnd.gauss(0, 0.17)
        # rotate the band in the image plane (x/z)
        xr, zr = x * math.cos(tilt) - z * math.sin(tilt), x * math.sin(tilt) + z * math.cos(tilt)
        size = rnd.uniform(0.045, 0.16) * (1.5 if i < 4 else 1.0)
        me = bpy.data.meshes.new(f'R{i}'); bm = bmesh.new()
        bmesh.ops.create_icosphere(bm, subdivisions=3, radius=1.0)
        sx, sy, sz = rnd.uniform(0.7, 1.3), rnd.uniform(0.6, 1.1), rnd.uniform(0.5, 0.9)
        seed = Vector((rnd.uniform(-50, 50), rnd.uniform(-50, 50), rnd.uniform(-50, 50)))
        for vt in bm.verts:
            d = vt.co.normalized()
            k = 1.0 + 0.28 * (math.sin(d.x * 3.1 + seed.x) * math.sin(d.y * 2.7 + seed.y) * math.sin(d.z * 3.3 + seed.z)) \
                + 0.12 * math.sin(d.x * 7 + seed.y) * math.cos(d.z * 6 + seed.x)
            vt.co = Vector((d.x * sx * k, d.y * sy * k, d.z * sz * k)) * size
        bm.to_mesh(me); bm.free()
        for pl in me.polygons:
            pl.use_smooth = False
        ob = bpy.data.objects.new(f'R{i}', me); sc.collection.objects.link(ob)
        ob.location = (xr, y, zr); ob.rotation_euler = (rnd.uniform(0, 6.3), rnd.uniform(0, 6.3), rnd.uniform(0, 6.3))
        me.materials.append(rock_mat)
    render(os.path.join(OUT, f'belt_{v}.png'))


# star.type 0 White Dwarf, 1 Red Dwarf, 2 Solar, 3 Hot Blue, 4 Red Giant (orrery.js STAR_STYLE)
STARS = {0: ((1.0, 1.0, 1.0), (0.75, 0.85, 1.0), 9.0), 1: ((1.0, 0.75, 0.55), (1.0, 0.25, 0.08), 3.0),
         2: ((1.0, 0.96, 0.82), (1.0, 0.62, 0.20), 5.0), 3: ((0.92, 0.97, 1.0), (0.30, 0.62, 1.0), 4.0),
         4: ((1.0, 0.70, 0.52), (0.95, 0.18, 0.06), 2.2)}


def build_star(t):
    sc = bpy.context.scene
    reset(); camera_and_sun(sc, 1.0, sun=False)
    core, limb, gran = STARS[t]
    s = sphere('Star', 0.98)
    g = G('StarMat')
    cells = g.node('ShaderNodeTexVoronoi'); cells.voronoi_dimensions = '4D'
    cells.inputs['Scale'].default_value = 26.0 * gran / 4; cells.inputs['W'].default_value = t * 3.0
    g.link(g.obj, cells.inputs['Vector'])
    spots = g.noise(2.2, 6, 0.55, 0.0, t * 7.0)
    lw = g.node('ShaderNodeLayerWeight', Blend=0.35)
    centre = g.math('SUBTRACT', 1.0, lw.outputs['Facing'])                 # 1 at the disc centre, 0 at the limb
    f = g.math('ADD', g.math('MULTIPLY', centre, 0.75), g.math('MULTIPLY', g.maprange(cells.outputs['Distance'], 0.0, 0.6, 0.07, 0.0), 1.0))
    f = g.math('SUBTRACT', f, g.math('MULTIPLY', g.maprange(spots, 0.66, 0.74), 0.18))
    col = g.ramp(f, [(0.05, tuple(c * 0.55 for c in limb)), (0.35, limb), (0.75, core), (1.0, (1.0, 1.0, 1.0))])
    em = g.node('ShaderNodeEmission', Strength=1.0); g.link(col, em.inputs['Color'])
    s.data.materials.append(g.surface(em))
    render(os.path.join(OUT, f'star_{t}.png'))


# ---------------------------------------------------------------------------------------------- run
sc = setup_scene()
jobs = [(f'{slug}_{v}', (lambda s=slug, v=v: build_planet(s, v))) for slug in SPEC for v in range(3)]
jobs += [(f'belt_{v}', (lambda v=v: build_belt(v))) for v in range(3)]
jobs += [(f'star_{t}', (lambda t=t: build_star(t))) for t in STARS]
for name, fn in jobs:
    if ONLY and name not in ONLY and name.split('_')[0] not in ONLY:
        continue
    fn()
print('ALL_DONE', flush=True)
