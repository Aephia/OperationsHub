# pack_grounds.py - pack the Blender ground renders (render_grounds.py, 1920x1080 RGB) into
# Images/stake/ground/<type>.webp plus manifest.json for the C4 Live claim stake view.
#   python pack_grounds.py <render_dir>
# Frame contract (the camera facts of render_grounds.py): the world origin is the image centre, the image is
# `scale` world units wide, a ground distance dy shows as dy * squash on screen, and the buildings stand on a pad
# that fills the ellipse `clear` (half-axes, world units).
import os, sys, json, math
from PIL import Image

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'Images', 'stake', 'ground')
OUT = os.path.normpath(OUT)
TYPES = ['terrestrial', 'oceanic', 'volcanic', 'barren', 'ice-giant', 'gas-giant', 'dark', 'asteroid']
W, H = 1600, 900

missing = [t for t in TYPES if not os.path.exists(os.path.join(SRC, t + '.png'))]
if missing:
    sys.exit('missing renders, nothing written: ' + ', '.join(missing))
os.makedirs(OUT, exist_ok=True)
manifest = {'w': W, 'h': H, 'scale': 26, 'squash': round(math.sin(math.radians(32.0)), 4), 'clear': [7.6, 7.0], 'grounds': {}}
total = 0
for t in TYPES:
    im = Image.open(os.path.join(SRC, t + '.png')).convert('RGB')
    if abs(im.width / im.height - W / H) > 0.01:
        sys.exit('%s is %dx%d, not 16:9 - nothing more written' % (t, im.width, im.height))
    im = im.resize((W, H), Image.LANCZOS)
    p = os.path.join(OUT, t + '.webp')
    im.save(p + '.tmp', 'WEBP', quality=82, method=6)
    os.replace(p + '.tmp', p)
    manifest['grounds'][t] = t + '.webp'
    total += os.path.getsize(p)
with open(os.path.join(OUT, 'manifest.json.tmp'), 'w') as f:
    json.dump(manifest, f, indent=1)
os.replace(os.path.join(OUT, 'manifest.json.tmp'), os.path.join(OUT, 'manifest.json'))
print('grounds', len(manifest['grounds']), 'total KB', total // 1024, '->', OUT)
