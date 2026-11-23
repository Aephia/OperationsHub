# pack_stake_tiles.py - pack the Blender tile renders (stake_tiles_hifi.py, or the first set from stake_tiles.py;
# square RGBA, any size) into Images/stake/<kind>.webp plus manifest.json. Every tile is cropped with the SAME fixed
# box so the hex plate lands at the same anchor in every file; the page scales a tile by (cell circumradius / unit)
# and places its anchor on the cell centre, so the output width can change without touching the pages.
#   python pack_stake_tiles.py <render_dir> [out_width=640]
import os, sys, json, math
from PIL import Image

SRC = sys.argv[1]
W = int(sys.argv[2]) if len(sys.argv) > 2 else 640
OUT = r'C:\Users\khawa\Desktop\OperationsHub\Images\stake'
KINDS = ['central_hub', 'crew_quarters', 'cultivation_hub', 'extraction_hub', 'extractor', 'farm', 'farm_hub',
         'power_plant', 'processing_hub', 'processor', 'storage_hub', 'storage_module']

# camera facts from the tile scripts, in the units of a 640 px render: ortho_scale 3.1 across the frame, target z 0.72 at
# the image centre, elevation 32 deg. A larger render is the same picture scaled by k = width / 640.
PX_PER_UNIT = 640 / 3.1
ELEV = math.radians(32.0)
CX = 320.0
CY_GROUND = 320.0 + PX_PER_UNIT * 0.72 * math.cos(ELEV)        # screen y of the world origin (ground hex centre)
CROP = (100, 30, 540, 560)                                      # x0, y0, x1, y1 - fits the tallest tile (central hub mast)
scale = W / (CROP[2] - CROP[0])

# every kind must be there and square before anything is written: a partial render must not replace part of the set
missing = [k for k in KINDS if not os.path.isfile(os.path.join(SRC, k + '.png'))]
if missing:
    raise SystemExit('missing renders, nothing written: ' + ', '.join(missing))
images = {}
for kind in KINDS:
    im = Image.open(os.path.join(SRC, kind + '.png')).convert('RGBA')
    if im.width != im.height or im.width < 640:
        raise SystemExit('%s is %dx%d, want a square render of 640 px or more; nothing written' % (kind, im.width, im.height))
    images[kind] = im

os.makedirs(OUT, exist_ok=True)
manifest = {'unit': round(PX_PER_UNIT * scale, 3), 'anchor': [round((CX - CROP[0]) * scale, 2), round((CY_GROUND - CROP[1]) * scale, 2)],
            'squash': round(math.sin(ELEV), 4), 'tiles': {}}
total = 0
for kind in KINDS:
    im = images[kind]; k = im.width / 640.0
    im = im.crop(tuple(int(round(v * k)) for v in CROP))
    im = im.resize((W, round(W * (CROP[3] - CROP[1]) / (CROP[2] - CROP[0]))), Image.LANCZOS)
    p = os.path.join(OUT, kind + '.webp')
    tmp = p + '.tmp'
    im.save(tmp, 'WEBP', quality=86, method=6)
    os.replace(tmp, p)
    manifest['tiles'][kind] = {'file': kind + '.webp', 'size': [im.width, im.height]}
    total += os.path.getsize(p)
tmp = os.path.join(OUT, 'manifest.json.tmp')
with open(tmp, 'w') as f:
    json.dump(manifest, f, indent=1)
os.replace(tmp, os.path.join(OUT, 'manifest.json'))
print('tiles', len(manifest['tiles']), 'width', W, 'unit', manifest['unit'], 'anchor', manifest['anchor'], 'total KB', total // 1024)
