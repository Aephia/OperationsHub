# pack_emblems.py - pack the emblem renders (render_emblems.py) into Images/c4an/<name>.webp, square, 256 px, and
# make the claim-stakes emblem from the shipped central hub tile. Refuses to write unless every render is there.
#   python pack_emblems.py <render_dir> [size=256]
import os, sys
from PIL import Image

SRC = sys.argv[1]
SIZE = int(sys.argv[2]) if len(sys.argv) > 2 else 256
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))
OUT = os.path.join(ROOT, 'Images', 'c4an')
NAMES = ['mining', 'council', 'compare', 'economy', 'crafting']
CROP = (100, 30, 540, 560)            # the tile crop, in the units of a 640 px render

missing = [n for n in NAMES if not os.path.isfile(os.path.join(SRC, n + '.png'))]
hub = os.path.join(ROOT, 'Images', 'stake', 'central_hub.webp')
if missing or not os.path.isfile(hub):
    raise SystemExit('missing, nothing written: ' + ', '.join(missing + ([] if os.path.isfile(hub) else ['Images/stake/central_hub.webp'])))


def square(im):
    side = max(im.size)
    sq = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    sq.alpha_composite(im, ((side - im.width) // 2, side - im.height))      # bottom-aligned: the plinth sits on the same line in every emblem
    return sq.resize((SIZE, SIZE), Image.LANCZOS)


os.makedirs(OUT, exist_ok=True)
total = 0
jobs = [(n, Image.open(os.path.join(SRC, n + '.png')).convert('RGBA')) for n in NAMES]
jobs = [(n, im.crop(tuple(int(round(v * im.width / 640.0)) for v in CROP))) for n, im in jobs]
jobs.append(('stakes', Image.open(hub).convert('RGBA')))
for name, im in jobs:
    p = os.path.join(OUT, name + '.webp')
    square(im).save(p + '.tmp', 'WEBP', quality=88, method=6)
    os.replace(p + '.tmp', p)
    total += os.path.getsize(p)
print('emblems', len(jobs), 'size', SIZE, 'total KB', total // 1024)
