"""Debug helper: list the meshes of one or more GLBs with their glTF-space bbox centres and extents.

Run: blender -b --factory-startup -P inspect_glb.py -- <glb> [<glb> ...]
Prints one INSPECT line per mesh: name, vertex count, centre (glTF x, y, z), size (glTF x, y, z).
"""
import bpy, sys, os
from mathutils import Vector

for path in sys.argv[sys.argv.index('--') + 1:]:
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(path))
    bpy.context.view_layer.update()
    print('FILE', os.path.basename(path))
    for o in bpy.data.objects:
        if o.type != 'MESH' or not o.data.vertices:
            continue
        pts = [o.matrix_world @ v.co for v in o.data.vertices]
        mn = Vector(map(min, zip(*pts)))
        mx = Vector(map(max, zip(*pts)))
        c, s = (mn + mx) / 2, mx - mn
        # Blender (x, y, z) -> glTF (x, z, -y)
        print('INSPECT %-40s v=%6d c=(%.2f, %.2f, %.2f) s=(%.2f, %.2f, %.2f)' % (
            o.name[:40], len(o.data.vertices), c.x, c.z, -c.y, s.x, s.z, s.y))
