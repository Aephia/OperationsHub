# pack_icons.py - pack the render_icons.py output (256 px RGBA PNGs) into Images/icons/<form>[_<category>].webp at
# 128 px (graph pills draw them at ~26 px, the resource sheet header at 64 px; 128 covers both at 2x).
#   python pack_icons.py <render_dir>
import os, sys, json
from PIL import Image

SRC = sys.argv[1]
OUT = r'C:\Users\khawa\Desktop\OperationsHub\Images\icons'
os.makedirs(OUT, exist_ok=True)
files, total = [], 0
for f in sorted(os.listdir(SRC)):
    if not f.endswith('.png'):
        continue
    im = Image.open(os.path.join(SRC, f)).convert('RGBA').resize((128, 128), Image.LANCZOS)
    fn = f[:-4] + '.webp'
    p = os.path.join(OUT, fn)
    im.save(p, 'WEBP', quality=86, method=6)
    files.append(fn); total += os.path.getsize(p)
if not files:
    sys.exit('no renders in ' + SRC)
json.dump({'size': 128, 'files': files}, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
print('icons', len(files), 'total KB', total // 1024)
