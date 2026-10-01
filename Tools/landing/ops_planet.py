# ops_planet.py - one Cycles still for the OperationsHub landing hero: a cool ice/ocean world with a
# cyan atmosphere rim over a star field, camera level, planet below-right so the headline sits top-left.
#   blender -b -P ops_planet.py -- <out_png> <res_x> <res_y> <samples>
import sys, math, os
import bpy
from mathutils import Vector

sys.path.insert(0, r'C:\Users\khawa\Desktop\StarAtlasBattleArenaWebsite\tools\blender')
import scene_common as C

argv = sys.argv[sys.argv.index('--') + 1:]
OUT = os.path.abspath(argv[0])
RX, RY, SAMPLES = int(argv[1]), int(argv[2]), int(argv[3])

bpy.ops.wm.read_homefile(use_empty=True)
sc = bpy.context.scene

# ---- world: stars + a cool nebula (camera rays only) ---------------------------------------------
w = bpy.data.worlds.new('Void'); sc.world = w; w.use_nodes = True
nt = w.node_tree; N = nt.nodes; L = nt.links; N.clear()
out = N.new('ShaderNodeOutputWorld'); bg = N.new('ShaderNodeBackground')
tc = N.new('ShaderNodeTexCoord'); lp = N.new('ShaderNodeLightPath')

def star_layer(scale, radius, keep, gain):
    vor = N.new('ShaderNodeTexVoronoi'); vor.voronoi_dimensions = '3D'; vor.inputs['Scale'].default_value = scale
    L.new(tc.outputs['Generated'], vor.inputs['Vector'])
    rng = N.new('ShaderNodeMapRange'); rng.inputs['From Min'].default_value = 0.0
    rng.inputs['From Max'].default_value = radius; rng.inputs['To Min'].default_value = 1.0
    rng.inputs['To Max'].default_value = 0.0; rng.clamp = True
    L.new(vor.outputs['Distance'], rng.inputs['Value'])
    sep = N.new('ShaderNodeSeparateColor'); L.new(vor.outputs['Color'], sep.inputs['Color'])
    thin = N.new('ShaderNodeMath'); thin.operation = 'GREATER_THAN'; thin.inputs[1].default_value = keep
    L.new(sep.outputs['Red'], thin.inputs[0])
    m1 = N.new('ShaderNodeMath'); m1.operation = 'MULTIPLY'
    L.new(rng.outputs['Result'], m1.inputs[0]); L.new(thin.outputs['Value'], m1.inputs[1])
    br = N.new('ShaderNodeMath'); br.operation = 'MULTIPLY'; br.inputs[1].default_value = gain
    L.new(sep.outputs['Green'], br.inputs[0])
    m2 = N.new('ShaderNodeMath'); m2.operation = 'MULTIPLY'
    L.new(m1.outputs['Value'], m2.inputs[0]); L.new(br.outputs['Value'], m2.inputs[1])
    return m2

s1 = star_layer(380, 0.15, 0.955, 10.0)
s2 = star_layer(900, 0.20, 0.93, 1.6)
stars = N.new('ShaderNodeMath'); stars.operation = 'ADD'
L.new(s1.outputs['Value'], stars.inputs[0]); L.new(s2.outputs['Value'], stars.inputs[1])
tint = N.new('ShaderNodeMix'); tint.data_type = 'RGBA'
tint.inputs['A'].default_value = (0, 0, 0, 1); tint.inputs['B'].default_value = (0.90, 0.94, 1.0, 1)
L.new(stars.outputs['Value'], tint.inputs['Factor'])

noise = N.new('ShaderNodeTexNoise'); noise.inputs['Scale'].default_value = 1.6
noise.inputs['Detail'].default_value = 12.0; noise.inputs['Roughness'].default_value = 0.62
L.new(tc.outputs['Generated'], noise.inputs['Vector'])
ramp = N.new('ShaderNodeValToRGB'); cr = ramp.color_ramp
cr.elements[0].position = 0.44; cr.elements[0].color = (0, 0, 0, 1)
cr.elements[1].position = 0.82; cr.elements[1].color = (0.030, 0.018, 0.075, 1)   # violet
mid = cr.elements.new(0.62); mid.color = (0.008, 0.030, 0.045, 1)                 # teal
L.new(noise.outputs['Fac'], ramp.inputs['Fac'])
add = N.new('ShaderNodeMix'); add.data_type = 'RGBA'; add.blend_type = 'ADD'; add.inputs['Factor'].default_value = 1.0
L.new(ramp.outputs['Color'], add.inputs['A']); L.new(tint.outputs['Result'], add.inputs['B'])
amb = N.new('ShaderNodeMix'); amb.data_type = 'RGBA'
amb.inputs['A'].default_value = (0.010, 0.014, 0.020, 1)
L.new(add.outputs['Result'], amb.inputs['B'])
L.new(lp.outputs['Is Camera Ray'], amb.inputs['Factor'])
L.new(amb.outputs['Result'], bg.inputs['Color']); bg.inputs['Strength'].default_value = 1.0
L.new(bg.outputs['Background'], out.inputs['Surface'])

# ---- camera: level, looking +Y --------------------------------------------------------------------
cam_d = bpy.data.cameras.new('Cam'); cam_d.lens = 32; cam_d.clip_end = 100000
cam = bpy.data.objects.new('Cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
base = Vector((0, 0, 0)); target = Vector((0, 1, 0))
cam.location = base; C.look_at(cam, target)
fwd = (target - base).normalized(); right = fwd.cross(Vector((0, 0, 1))).normalized(); up = right.cross(fwd).normalized()

# ---- planet: placed by view angle (below-right), lit from upper-left-behind for a bright limb -------
SUN_TRAVEL = Vector((0.25, -0.85, -0.45)).normalized()

def sphere(name, radius, loc):
    import bmesh
    me = bpy.data.meshes.new(name + 'Mesh')
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=256, v_segments=128, radius=radius); bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me); sc.collection.objects.link(ob); ob.location = loc
    return ob

D = 9000.0
down, rightdeg, angr = 33.0, 17.0, 28.0
d = (fwd * math.cos(math.radians(down)) - up * math.sin(math.radians(down)) + right * math.tan(math.radians(rightdeg))).normalized()
R = D * math.sin(math.radians(angr))
planet = sphere('Planet', R, base + d * D)

mat = bpy.data.materials.new('PlanetMat'); mat.use_nodes = True
nt = mat.node_tree; N = nt.nodes; L = nt.links
bsdf = [n for n in N if n.type == 'BSDF_PRINCIPLED'][0]
tc = N.new('ShaderNodeTexCoord')
mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1.0, 1.0, 1.6)
L.new(tc.outputs['Object'], mp.inputs['Vector'])
n1 = N.new('ShaderNodeTexNoise'); n1.inputs['Scale'].default_value = 0.0011; n1.inputs['Detail'].default_value = 12
n1.inputs['Roughness'].default_value = 0.58; n1.inputs['Distortion'].default_value = 0.9
L.new(mp.outputs['Vector'], n1.inputs['Vector'])
ramp = N.new('ShaderNodeValToRGB'); cr = ramp.color_ramp
cr.elements[0].position = 0.36; cr.elements[0].color = (0.004, 0.020, 0.045, 1)   # deep ocean
cr.elements[1].position = 0.74; cr.elements[1].color = (0.62, 0.70, 0.72, 1)      # ice / cloud
m1 = cr.elements.new(0.50); m1.color = (0.020, 0.16, 0.22, 1)                      # shallows teal
m2 = cr.elements.new(0.60); m2.color = (0.10, 0.11, 0.09, 1)                       # land
L.new(n1.outputs['Fac'], ramp.inputs['Fac'])
L.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])
bsdf.inputs['Roughness'].default_value = 0.75
planet.data.materials.append(mat)

atmo = sphere('Atmosphere', R * 1.014, planet.location)
am = bpy.data.materials.new('AtmoMat'); am.use_nodes = True
nt = am.node_tree; N = nt.nodes; L = nt.links; N.clear()
out = N.new('ShaderNodeOutputMaterial')
lw = N.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.10
pw = N.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 6.0
L.new(lw.outputs['Facing'], pw.inputs[0])
geo = N.new('ShaderNodeNewGeometry')
dot = N.new('ShaderNodeVectorMath'); dot.operation = 'DOT_PRODUCT'
dot.inputs[1].default_value = tuple(-SUN_TRAVEL)
L.new(geo.outputs['Normal'], dot.inputs[0])
lit = N.new('ShaderNodeMapRange'); lit.inputs['From Min'].default_value = -0.35; lit.inputs['From Max'].default_value = 0.6
lit.clamp = True
L.new(dot.outputs['Value'], lit.inputs['Value'])
fac = N.new('ShaderNodeMath'); fac.operation = 'MULTIPLY'
L.new(pw.outputs['Value'], fac.inputs[0]); L.new(lit.outputs['Result'], fac.inputs[1])
em = N.new('ShaderNodeEmission'); em.inputs['Color'].default_value = (0.30, 0.85, 1.0, 1); em.inputs['Strength'].default_value = 11.0
tr = N.new('ShaderNodeBsdfTransparent')
mix = N.new('ShaderNodeMixShader')
L.new(fac.outputs['Value'], mix.inputs['Fac']); L.new(tr.outputs['BSDF'], mix.inputs[1]); L.new(em.outputs['Emission'], mix.inputs[2])
L.new(mix.outputs['Shader'], out.inputs['Surface'])
atmo.data.materials.append(am); atmo.visible_shadow = False

C.sun_dir('Sun', 7.0, tuple(SUN_TRAVEL), (0.85, 0.93, 1.0), angle=1.0)
print('PLANET centre', [round(v) for v in planet.location], 'R', round(R), flush=True)

# ---- render ---------------------------------------------------------------------------------------
sc.render.engine = 'CYCLES'
try:
    C.use_gpu(sc)
except Exception as e:
    print('GPU unavailable, CPU fallback:', e, flush=True); C.use_cpu(sc)
sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
sc.render.resolution_x = RX; sc.render.resolution_y = RY; sc.render.resolution_percentage = 100
sc.render.film_transparent = False
sc.view_settings.view_transform = 'Standard'; sc.view_settings.exposure = 0.25
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGB'
os.makedirs(os.path.dirname(OUT), exist_ok=True)
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print('RENDER_REPORT', OUT, os.path.exists(OUT), os.path.getsize(OUT) if os.path.exists(OUT) else -1, flush=True)
