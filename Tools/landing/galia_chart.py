# galia_chart.py - draw the Galia star chart (945 systems + warp links) from OperationsHub JSON/planets.json
# as a glowing faction-coloured map for the Region Map Explorer card.
import json, os, math
from PIL import Image, ImageDraw, ImageFilter

SRC = r'C:\Users\khawa\Desktop\OperationsHub\JSON\planets.json'
OUT = r'C:\Users\khawa\Desktop\OperationsHub\Images\landing\card_regionmap.webp'
W, H = 1920, 1080
FACTION = {'MUD': (255, 96, 64), 'ONI': (62, 200, 255), 'USTUR': (185, 140, 255), 'Ustur': (185, 140, 255)}

d = json.load(open(SRC, encoding='utf-8'))
systems = d['mapData']
by_name = {s['key']: s for s in systems}
print('factions', sorted({str(s.get('closestFaction')) for s in systems}))
xs = [s['coordinates'][0] for s in systems]; ys = [s['coordinates'][1] for s in systems]
x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
pad = 0.06
sx = (W * (1 - 2 * pad)) / (x1 - x0); sy = (H * (1 - 2 * pad)) / (y1 - y0)
s = min(sx, sy)
ox = (W - (x1 - x0) * s) / 2; oy = (H - (y1 - y0) * s) / 2

def P(c):
    return (ox + (c[0] - x0) * s, H - (oy + (c[1] - y0) * s))   # y up

base = Image.new('RGB', (W, H), (4, 6, 16))
bd = ImageDraw.Draw(base)
for gx in range(0, W, 96):
    bd.line([(gx, 0), (gx, H)], fill=(9, 14, 28), width=1)
for gy in range(0, H, 96):
    bd.line([(0, gy), (W, gy)], fill=(9, 14, 28), width=1)
# links: faint cyan lines on a glow layer
links = Image.new('RGB', (W, H), (0, 0, 0)); ld = ImageDraw.Draw(links)
seen = set()
for sys_ in systems:
    a = P(sys_['coordinates'])
    for ln in sys_.get('links', []):
        t = by_name.get(ln)
        if not t:
            continue
        key = tuple(sorted((sys_['key'], ln)))
        if key in seen:
            continue
        seen.add(key)
        ld.line([a, P(t['coordinates'])], fill=(20, 70, 90), width=2)
links = links.filter(ImageFilter.GaussianBlur(1.2))
base = Image.blend(base, Image.eval(links, lambda v: v), 1.0) if False else base
base = Image.fromarray(__import__('numpy').clip(__import__('numpy').asarray(base, dtype='int32') + __import__('numpy').asarray(links, dtype='int32'), 0, 255).astype('uint8'))

# stars: glow layer + core layer
glow = Image.new('RGB', (W, H), (0, 0, 0)); gd = ImageDraw.Draw(glow)
core = Image.new('RGB', (W, H), (0, 0, 0)); cd = ImageDraw.Draw(core)
for sys_ in systems:
    x, y = P(sys_['coordinates'])
    f = str(sys_.get('closestFaction', '')).upper()
    col = (255, 96, 64) if 'MUD' in f else (62, 200, 255) if 'ONI' in f else (185, 140, 255) if 'UST' in f else (200, 210, 230)
    sc = sys_.get('star', {}).get('scale', 1.0) or 1.0
    strat = sys_.get('strategicScore', 1) or 1
    r = 2.2 + 1.6 * sc + 0.6 * min(strat, 4)
    gd.ellipse([x - r * 3, y - r * 3, x + r * 3, y + r * 3], fill=tuple(int(c * 0.55) for c in col))
    cd.ellipse([x - r, y - r, x + r, y + r], fill=col)
    cd.ellipse([x - r * 0.45, y - r * 0.45, x + r * 0.45, y + r * 0.45], fill=(255, 255, 255))
glow = glow.filter(ImageFilter.GaussianBlur(9))
import numpy as np
arr = np.asarray(base, dtype='int32') + np.asarray(glow, dtype='int32') + np.asarray(core, dtype='int32')
im = Image.fromarray(np.clip(arr, 0, 255).astype('uint8'))

os.makedirs(os.path.dirname(OUT), exist_ok=True)
im.save(OUT.replace('.webp', '_full.png'))
card = im.resize((960, 540), Image.LANCZOS)
card.save(OUT, 'WEBP', quality=82, method=6)
print('systems', len(systems), 'links', len(seen), 'bounds', (round(x0), round(x1), round(y0), round(y1)), '->', OUT, os.path.getsize(OUT) // 1024, 'KB')
