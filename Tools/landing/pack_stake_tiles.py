# pack_stake_tiles.py - pack the Blender tile renders (stake_tiles.py, 640x640 RGBA) into Images/stake/<kind>.webp
# plus manifest.json. Every tile is cropped with the SAME fixed box so the hex plate lands at the same anchor in
# every file; the page scales a tile by (cell circumradius / unit) and places its anchor on the cell centre.
#   python pack_stake_tiles.py <render_dir>
import os, sys, json, math
from PIL import Image

SRC = sys.argv[1]
OUT = r'C:\Users\khawa\Desktop\OperationsHub\Images\stake'
os.makedirs(OUT, exist_ok=True)

# camera facts from stake_tiles.py: ortho_scale 3.1 over 640 px, target z 0.72 at the image centre, elevation 32 deg
PX_PER_UNIT = 640 / 3.1
ELEV = math.radians(32.0)
CX = 320.0
CY_GROUND = 320.0 + PX_PER_UNIT * 0.72 * math.cos(ELEV)        # screen y of the world origin (ground hex centre)
CROP = (100, 30, 540, 560)                                      # x0, y0, x1, y1 - fits the tallest tile (central hub antenna)
W = 320
scale = W / (CROP[2] - CROP[0])

manifest = {'unit': round(PX_PER_UNIT * scale, 3), 'anchor': [round((CX - CROP[0]) * scale, 2), round((CY_GROUND - CROP[1]) * scale, 2)],
            'squash': round(math.sin(ELEV), 4), 'tiles': {}}
total = 0
for f in sorted(os.listdir(SRC)):
    if not f.endswith('.png'):
        continue
    kind = f[:-4]
    im = Image.open(os.path.join(SRC, f)).convert('RGBA').crop(CROP)
    im = im.resize((W, round(im.height * scale)), Image.LANCZOS)
    p = os.path.join(OUT, kind + '.webp')
    im.save(p, 'WEBP', quality=86, method=6)
    manifest['tiles'][kind] = {'file': kind + '.webp', 'size': [im.width, im.height]}
    total += os.path.getsize(p)
json.dump(manifest, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
print('tiles', len(manifest['tiles']), 'unit', manifest['unit'], 'anchor', manifest['anchor'], 'total KB', total // 1024)
