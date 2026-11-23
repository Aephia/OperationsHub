# render_emblems.py - the small 3D emblems in the section headers of the C4 Live Analytics tab (Blender 5.2, -b).
# One diorama per section on a round plinth, in the materials and camera of the claim-stake tiles: this script runs
# the helper part of Tools/landing/stake_tiles_hifi.py (materials, primitives, scene) and adds its own models.
#   "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b -P render_emblems.py -- <out_dir> [samples] [res] [name ...]
# then:  python pack_emblems.py <out_dir>      (writes Images/c4an/<name>.webp)
import sys, os, math
import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', '..', 'landing', 'stake_tiles_hifi.py')
code = open(SRC, encoding='utf-8').read()
cut = code.index('unknown = [x for x in ONLY')            # everything above the render loop: helpers, Kit, buildings, setup_scene
exec(compile(code[:cut], SRC, 'exec'))                    # OUT_DIR, SAMPLES, RES, ONLY come from the same argument order

ACC = {
    'mining':   (0.35, 0.65, 1.00),
    'council':  (0.66, 0.60, 1.00),
    'compare':  (0.29, 0.83, 0.77),
    'economy':  (0.35, 0.84, 0.55),
    'crafting': (1.00, 0.78, 0.34),
}


def plinth(k):
    cyl(0.98, 0.10, (0, 0, 0.05), k.dark, verts=64, bevel=0.02)
    cyl(0.90, 0.11, (0, 0, 0.055), k.soft, verts=64)
    cyl(0.86, 0.12, (0, 0, 0.06), k.deck, verts=64, bevel=0.01)


def ship(k, at, s=1.0, yaw=0.0, m=None):
    """A small mining ship: tapered hull, canopy, wings, two lit engines. `at` is its centre, the nose points along +X turned by yaw."""
    m = m or k.white
    ca, sa = math.cos(yaw), math.sin(yaw)

    def P(x, y, z):
        return (at[0] + s * (x * ca - y * sa), at[1] + s * (x * sa + y * ca), at[2] + s * z)
    cyl(0.11 * s, 0.50 * s, P(0, 0, 0), m, verts=6, r2=0.05 * s, rot=(0, R90, yaw), smooth=False, bevel=0.008)
    sphere(0.07 * s, P(0.05, 0, 0.07), k.glass, seg=16, scale=(1.6, 0.9, 0.7), rot=(0, 0, yaw))
    for sy in (-1, 1):
        box((0.20 * s, 0.22 * s, 0.025 * s), P(-0.08, sy * 0.17, -0.01), k.paint, rot=(0, 0, yaw + sy * 0.25), bevel=0.006)
        cyl(0.035 * s, 0.14 * s, P(-0.26, sy * 0.07, 0), k.steel, verts=12, rot=(0, R90, yaw))
        sphere(0.03 * s, P(-0.34, sy * 0.07, 0), k.hot, seg=10)


def gear(k, at, r, teeth, axis='y', m=None):
    m = m or k.steel
    rot = (R90, 0, 0) if axis == 'y' else (0, 0, 0)
    cyl(r, 0.06, at, m, verts=32, rot=rot, bevel=0.006)
    cyl(r * 0.35, 0.08, at, k.dark, verts=16, rot=rot)
    for i in range(teeth):
        a = 2 * math.pi * i / teeth
        if axis == 'y':
            box((0.07 * r / 0.2, 0.06, 0.05 * r / 0.2), (at[0] + r * 1.08 * math.cos(a), at[1], at[2] + r * 1.08 * math.sin(a)), m, rot=(0, -a, 0), bevel=0.004)
        else:
            box((0.07 * r / 0.2, 0.05 * r / 0.2, 0.06), (at[0] + r * 1.08 * math.cos(a), at[1] + r * 1.08 * math.sin(a), at[2]), m, rot=(0, 0, a), bevel=0.004)


# ------------------------------------------------------------------------------------------ emblems ----
def mining(k):
    plinth(k)
    # an asteroid with lit ore seams, on a short cradle
    for (x, y, z, r, s) in ((0.0, 0.0, 0.50, 0.36, 0.85), (0.24, 0.08, 0.42, 0.24, 0.8), (-0.22, -0.06, 0.44, 0.22, 0.9), (0.05, -0.20, 0.36, 0.20, 0.8), (-0.06, 0.18, 0.62, 0.20, 0.8), (0.16, -0.10, 0.66, 0.16, 0.9)):
        sphere(r, (x, y, z), k.rock, seg=9, scale=(1, 1, s), rot=(r * 7, 0.3, r * 19))
    for (x, y, z) in ((0.10, -0.30, 0.50), (-0.20, -0.22, 0.58), (0.30, -0.12, 0.56), (0.0, -0.26, 0.72), (-0.30, -0.10, 0.36)):
        sphere(0.04, (x, y, z), k.hot, seg=8)
    for a in (40, 160, 280):
        ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
        strut((0.62 * ca, 0.62 * sa, 0.12), (0.26 * ca, 0.26 * sa, 0.34), 0.022, k.paint)
        cyl(0.05, 0.03, (0.62 * ca, 0.62 * sa, 0.135), k.steel, verts=12)
    # the ship above it, and its beam into the rock
    ship(k, (-0.30, 0.10, 1.34), s=1.25, yaw=math.radians(-20))
    strut((-0.22, 0.06, 1.24), (0.02, -0.06, 0.82), 0.022, k.hot, verts=12)
    sphere(0.08, (0.02, -0.06, 0.80), k.hot, seg=14)
    for (x, y, z) in ((0.34, -0.36, 0.20), (0.48, -0.22, 0.18), (0.40, -0.48, 0.17)):
        box((0.08, 0.08, 0.07), (x, y, z), k.hot if x < 0.4 else k.rock, rot=(0.3, 0.2, x * 9), bevel=0.01)
    lamp((0.02, -0.25, 0.9), k.accent, 10.0)


def council(k):
    plinth(k)
    for i, (r, h) in enumerate(((0.66, 0.12), (0.50, 0.12), (0.34, 0.12))):
        cyl(r, h, (0, 0, 0.18 + 0.12 * i), k.hull if i != 1 else k.white, verts=8, rot=(0, 0, math.radians(22.5)), smooth=False, bevel=0.012)
        cyl(r - 0.03, 0.012, (0, 0, 0.245 + 0.12 * i), k.dim, verts=8, rot=(0, 0, math.radians(22.5)), smooth=False)
    # a standard: mast, three rank chevrons, a lit crown
    cyl(0.035, 1.06, (0, 0, 1.01), k.steel, verts=16)
    for i in range(3):
        z = 0.78 + 0.24 * i
        for sx in (-1, 1):
            box((0.34, 0.07, 0.085), (sx * 0.13, -0.04, z + 0.07), k.paint if i < 2 else k.hot, rot=(0, sx * math.radians(32), 0), bevel=0.012)
    torus(0.13, 0.022, (0, 0, 1.56), k.steel, rot=(R90, 0, 0))
    sphere(0.085, (0, 0, 1.56), k.hot, seg=20)
    for a in (0, 72, 144, 216, 288):
        strut((0, 0, 1.56), (0.21 * math.cos(math.radians(a + 90)), 0, 1.56 + 0.21 * math.sin(math.radians(a + 90))), 0.012, k.steel, verts=6)
    # seats around the dais
    for (x, y) in ring(0.80, 7, 205)[:5]:
        box((0.10, 0.10, 0.14), (x, y, 0.19), k.paint, rot=(0, 0, math.atan2(y, x)), bevel=0.012)
        box((0.10, 0.02, 0.12), (x * 1.06, y * 1.06, 0.30), k.steel, rot=(0, 0, math.atan2(y, x) + R90), bevel=0.006)
    lamp((0, -0.5, 1.2), k.accent, 8.0)


def compare(k):
    plinth(k)
    cyl(0.26, 0.10, (0, 0, 0.17), k.hull, verts=32, bevel=0.012)
    cyl(0.045, 1.10, (0, 0, 0.75), k.steel, verts=16)
    sphere(0.085, (0, 0, 1.32), k.hot, seg=20)
    tilt = math.radians(-9)
    L = Vector((-0.66 * math.cos(tilt), 0, 1.30 - 0.66 * math.sin(tilt))); Rr = Vector((0.66 * math.cos(tilt), 0, 1.30 + 0.66 * math.sin(tilt)))
    strut(L, Rr, 0.028, k.paint)
    for end, load in ((L, 'ship'), (Rr, 'stake')):
        pz = end.z - 0.62
        cyl(0.27, 0.03, (end.x, 0, pz), k.steel, verts=32, bevel=0.006)
        torus(0.27, 0.014, (end.x, 0, pz + 0.02), k.soft)
        for a in (90, 210, 330):
            strut((end.x, 0, end.z), (end.x + 0.25 * math.cos(math.radians(a)), 0.25 * math.sin(math.radians(a)), pz + 0.02), 0.006, k.dark, verts=6)
        sphere(0.03, (end.x, 0, end.z), k.steel, seg=10)
        if load == 'ship':
            ship(k, (end.x, 0.0, pz + 0.13), s=0.85, yaw=math.radians(-25))
        else:
            cyl(0.17, 0.05, (end.x, 0, pz + 0.04), k.dark, verts=6, rot=HEXROT, smooth=False)
            cyl(0.08, 0.20, (end.x, 0, pz + 0.16), k.white, verts=20, bevel=0.006)
            sphere(0.08, (end.x, 0, pz + 0.26), k.glass, seg=16, scale=(1, 1, 0.7))
            sphere(0.035, (end.x, 0, pz + 0.27), k.hot, seg=10)
            box((0.07, 0.07, 0.07), (end.x + 0.11, -0.08, pz + 0.07), k.paint, bevel=0.008)
    lamp((0, -0.5, 1.0), k.accent, 7.0)


def economy(k):
    plinth(k)
    # a hopper on four legs pouring lit ore into an open crate; a drain grate beside it stands for the sinks
    tower(k, -0.18, 0.08, [0.12, 0.50, 0.86], [0.26, 0.23, 0.20], leg=0.018)
    cyl(0.34, 0.34, (-0.18, 0.08, 1.02), k.paint, verts=4, r2=0.10, rot=(math.radians(180), 0, math.radians(45)), smooth=False, bevel=0.012)
    box((0.50, 0.50, 0.03), (-0.18, 0.08, 1.20), k.steel, bevel=0.006)
    for (x, y, z) in ((-0.26, 0.02, 1.24), (-0.10, 0.12, 1.25), (-0.18, 0.16, 1.27), (-0.12, 0.0, 1.26)):
        box((0.10, 0.10, 0.09), (x, y, z), k.hot, rot=(0.4, 0.2, x * 11), bevel=0.012)
    cyl(0.07, 0.10, (-0.18, 0.08, 0.80), k.steel, verts=16)
    for i, z in enumerate((0.70, 0.56, 0.44)):
        box((0.07, 0.07, 0.07), (-0.18 + 0.01 * i, 0.08, z), k.hot, rot=(0.5 * i, 0.3, 0.7 * i), bevel=0.008)
    box((0.40, 0.40, 0.24), (-0.18, 0.08, 0.24), k.hull, bevel=0.016)
    box((0.34, 0.34, 0.02), (-0.18, 0.08, 0.36), k.dark, bevel=0.0)
    for (x, y) in ((-0.26, 0.02), (-0.10, 0.14), (-0.16, 0.02), (-0.24, 0.16)):
        box((0.08, 0.08, 0.07), (x, y, 0.385), k.hot, rot=(0.3, 0.1, x * 13), bevel=0.01)
    box((0.42, 0.42, 0.025), (-0.18, 0.08, 0.20), k.haz, bevel=0.0)
    # the drain: a round grate with a lit throat, fed by a pipe from the crate
    cyl(0.24, 0.04, (0.50, -0.30, 0.14), k.steel, verts=32, bevel=0.008)
    cyl(0.18, 0.012, (0.50, -0.30, 0.165), k.red, verts=32)
    for i in range(5):
        box((0.40, 0.022, 0.02), (0.50, -0.42 + 0.06 * i, 0.172), k.dark, bevel=0.0)
    pipe([(0.02, 0.02, 0.22), (0.20, -0.08, 0.26), (0.36, -0.20, 0.24), (0.44, -0.26, 0.17)], 0.026, k.steel)
    crate(k, 0.46, 0.34, 0.16, k.paint, rot=14)
    crate(k, 0.62, 0.20, 0.12, rot=-10)
    lamp((-0.18, -0.25, 0.75), k.accent, 9.0)
    lamp((0.50, -0.30, 0.35), (1.0, 0.2, 0.1), 2.5)


def crafting(k):
    plinth(k)
    # a workbench with a part being assembled under a robot arm, gears on the back frame
    box((0.96, 0.52, 0.06), (0, 0.02, 0.44), k.steel, bevel=0.01)
    for sx in (-1, 1):
        for sy in (-1, 1):
            box((0.06, 0.06, 0.30), (sx * 0.42, 0.02 + sy * 0.20, 0.27), k.hull, bevel=0.008)
    box((0.90, 0.46, 0.03), (0, 0.02, 0.18), k.dark, bevel=0.006)
    box((0.98, 0.02, 0.05), (0, -0.25, 0.44), k.haz, bevel=0.0)
    box((0.22, 0.16, 0.10), (-0.05, -0.04, 0.52), k.hull, bevel=0.012)
    box((0.14, 0.10, 0.07), (-0.05, -0.04, 0.60), k.hot, bevel=0.012)
    for x in (-0.36, -0.26):
        cyl(0.035, 0.09, (x, -0.12, 0.515), k.paint, verts=12)
    box((0.12, 0.10, 0.04), (0.34, -0.12, 0.49), k.soft, bevel=0.006)
    # the arm
    cyl(0.10, 0.08, (0.34, 0.14, 0.51), k.hull, verts=24, bevel=0.008)
    j0, j1, j2 = Vector((0.34, 0.14, 0.58)), Vector((0.30, 0.12, 1.02)), Vector((-0.02, -0.02, 0.92))
    strut(j0, j1, 0.035, k.paint); strut(j1, j2, 0.028, k.paint)
    for j in (j0, j1, j2):
        sphere(0.05, j, k.steel, seg=14)
    strut(j2, (-0.04, -0.04, 0.74), 0.016, k.steel)
    for sx in (-1, 1):
        strut((-0.04, -0.04, 0.74), (-0.04 + sx * 0.06, -0.04, 0.66), 0.010, k.steel, verts=6)
    sphere(0.025, (-0.04, -0.04, 0.70), k.hot, seg=8)
    # back frame with two meshing gears and a lit panel
    for x in (-0.46, 0.46):
        strut((x, 0.28, 0.47), (x, 0.28, 1.20), 0.020, k.hull)
    strut((-0.46, 0.28, 1.20), (0.46, 0.28, 1.20), 0.020, k.hull)
    gear(k, (-0.20, 0.27, 0.92), 0.17, 10)
    gear(k, (0.10, 0.27, 0.78), 0.11, 7, m=k.paint)
    box((0.20, 0.02, 0.12), (0.30, 0.27, 1.06), k.screen, bevel=0.0)
    crate(k, -0.62, -0.38, 0.13, k.paint, rot=-12)
    lamp((-0.05, -0.30, 0.75), k.accent, 8.0)
    lamp((0, 0.0, 1.1), k.accent, 2.0, 0.2)


EMBLEMS = {'mining': mining, 'council': council, 'compare': compare, 'economy': economy, 'crafting': crafting}
bad = [x for x in ONLY if x not in EMBLEMS]
if bad:
    raise SystemExit('unknown emblem: ' + ', '.join(bad))
for name, build in EMBLEMS.items():
    if ONLY and name not in ONLY:
        continue
    sc = setup_scene()
    build(Kit(ACC[name]))
    out = os.path.join(OUT_DIR, name + '.png')
    if os.path.exists(out):
        os.remove(out)
    sc.render.filepath = out
    bpy.ops.render.render(write_still=True)
    print('EMBLEM_REPORT', name, os.path.exists(out), os.path.getsize(out) if os.path.exists(out) else -1, flush=True)
