# blender_export_hull.py - runs INSIDE Blender (blender -b -P this -- <in.fbx|gltf> <out.glb|-> <report.json>)
# Imports one hull, keeps only render meshes (drops LODs, locators, collision/proxy, empties), bakes every world
# transform into the vertices (each node is identity), strips materials/UVs/colours, centres the hull on the
# origin (hull = non-vfx meshes) and writes a geometry-only GLB (Y-up, positions + normals). If <out> is "-",
# only the report is written (inspect mode). Part names are kept exactly.
import bpy, sys, os, json
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
src, out, rep = argv[0], argv[1], argv[2]


def drop(n):
    n = n.lower()
    return ('lod' in n or n.startswith('ucx_') or n.startswith('loc_') or n.startswith('ubx_') or n.startswith('usp_')
            or 'collision' in n or 'proxy' in n)


def is_vfx(n):
    return n.lower().startswith('mesh_vfx')


bpy.ops.wm.read_homefile(use_empty=True)
ext = os.path.splitext(src)[1].lower()
if ext == '.fbx':
    bpy.ops.import_scene.fbx(filepath=src)
else:
    bpy.ops.import_scene.gltf(filepath=src)
bpy.context.view_layer.update()
dg = bpy.context.evaluated_depsgraph_get()

report = {'src': src, 'unit_scale': bpy.context.scene.unit_settings.scale_length, 'all': [], 'kept': []}
parts = []  # (name, verts[world], tris list, normals)
for o in list(bpy.data.objects):
    if o.type != 'MESH':
        report['all'].append([o.name, o.type, 'dropped-nonmesh'])
        continue
    if drop(o.name):
        report['all'].append([o.name, 'MESH', 'dropped'])
        continue
    report['all'].append([o.name, 'MESH', 'kept'])
    parts.append(o)

# bake: evaluated mesh into world space on a fresh object
col = bpy.data.collections.new('hullout')
bpy.context.scene.collection.children.link(col)
new_objs = []
for o in parts:
    oe = o.evaluated_get(dg)
    me = bpy.data.meshes.new_from_object(oe)
    me.transform(o.matrix_world)
    me.update()
    for uv in list(me.uv_layers):
        me.uv_layers.remove(uv)
    for ca in list(me.color_attributes):
        me.color_attributes.remove(ca)
    me.materials.clear()
    nm = o.name
    no = bpy.data.objects.new(nm + '__tmp', me)
    col.objects.link(no)
    new_objs.append((nm, no, me))

# remove originals so names are free, then rename
for o in list(bpy.data.objects):
    if o not in [x[1] for x in new_objs]:
        bpy.data.objects.remove(o, do_unlink=True)
for m in list(bpy.data.meshes):
    if m.users == 0:
        bpy.data.meshes.remove(m)
for nm, no, me in new_objs:
    no.name = nm
    me.name = nm

# hull centre from non-vfx meshes (fallback: all)
hull = [x for x in new_objs if not is_vfx(x[0])] or new_objs
pts = [v.co for _, _, me in hull for v in me.vertices]
mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
ctr = (mn + mx) / 2
for nm, no, me in new_objs:
    me.transform(__import__('mathutils').Matrix.Translation(-ctr))
    me.update()
    me.calc_loop_triangles()
    ws = [v.co for v in me.vertices]
    report['kept'].append({'name': nm, 'verts': len(me.vertices), 'tris': len(me.loop_triangles),
                           'vfx': is_vfx(nm)})
report['bbox_dims_blender_zup'] = [mx.x - mn.x, mx.y - mn.y, mx.z - mn.z]
report['centre_shift'] = [ctr.x, ctr.y, ctr.z]

if out != '-':
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=True, export_apply=False,
                              export_materials='NONE', export_texcoords=False, export_normals=True,
                              export_tangents=False, export_attributes=False, export_vertex_color='NONE',
                              export_animations=False, export_skins=False, export_cameras=False,
                              export_lights=False, export_image_format='NONE', use_selection=False)
    report['out'] = out
with open(rep, 'w', encoding='utf-8') as f:
    json.dump(report, f, indent=1)
print('HULL_DONE', rep)
