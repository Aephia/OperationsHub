"""Pack the Blender silhouette renders into the C4 Live ship atlas.

Run (system Python with Pillow + numpy, AFTER render_silhouettes.py):
  python pack_atlas.py <render_dir> <models_dir> <latest.json> <out_dir>

Writes to <out_dir>:
  atlas.webp     1024x1024, 8x8 cells of 128 px (lossless WebP, straight alpha)
  atlas@2x.webp  2048x2048, same layout, 256 px cells
  atlas.json     layout + slug/sizeClass indices + configToSlug for every flag in latest.json + coverage
  preview.png    every cell tinted and labelled, for a human eyeball

Cell look: white hull, Workbench studio light + cavity (panel lines), then an inner rim (darker toward the
silhouette edge) and a soft top-left emboss. Brightest pixels are 1.0 so a multiply tint keeps full colour.

Mapping rule (config name -> model slug): strip " Config", lowercase, split into words, take the longest
word prefix of >= 2 words that is a model slug (or an ALIASES key). The match is REJECTED when the model's
own size class (the flagSize of "<model name> Default Config" in latest.json) differs from the config's
flagSize: the bare prefix rule sent "Armstrong IMP Tap" (medium) to the capital "armstrong-imp".
"""
import sys, os, json, collections
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

RENDER, MODELS, LATEST, OUT = [os.path.abspath(a) for a in sys.argv[1:5]]
CELL, COLS, ROWS = 128, 8, 8
SIZES = ['xx-small', 'x-small', 'small', 'medium', 'large', 'capital', 'commander', 'titan']
# only where it is clearly the same hull family (lead's brief): the plain Mamba flies the Mamba EX hull
ALIASES = {'fimbul-mamba': 'fimbul-mamba-ex'}
FALLBACK_CLASS = 'medium'  # for a flagSize outside SIZES (none today)
PREFIX_SIZE = {'XXS': 'xx-small', 'XSM': 'x-small', 'XS': 'x-small', 'SML': 'small', 'MED': 'medium',
               'LRG': 'large', 'CAP': 'capital', 'CDR': 'commander', 'CMD': 'commander', 'TTN': 'titan'}

os.makedirs(OUT, exist_ok=True)
meta = json.load(open(os.path.join(RENDER, 'render_meta.json'), encoding='utf-8'))
manifest = json.load(open(os.path.join(MODELS, 'manifest.json'), encoding='utf-8'))
latest = json.load(open(LATEST, encoding='utf-8'))
fleets = latest['fleets']

slugs = sorted(f[:-4] for f in os.listdir(MODELS) if f.endswith('.glb'))
order = slugs + ['gen-' + s for s in SIZES]
assert len(order) <= COLS * ROWS, 'atlas too small'
missing = [n for n in order if not os.path.exists(os.path.join(RENDER, n + '.png'))]
assert not missing, f'no render for {missing}'

# ---------------- cell image processing ----------------
def blur(a, r):
    im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r)), dtype=np.float32) / 255


def process(path):
    im = np.asarray(Image.open(path).convert('RGBA'), dtype=np.float32) / 255
    rgb, a = im[..., :3], im[..., 3]
    n = a.shape[0]
    L = rgb.mean(axis=2)
    sel = a > 0.5
    p = np.percentile(L[sel], 97) if sel.any() else 1.0
    L = np.clip(L / max(p, 1e-3), 0, 1)
    s = n / 512.0
    rim = blur(a, 5 * s)                      # < 1 near the outline, inside the hull
    g = blur(a, 7 * s)
    d = max(1, int(round(5 * s)))
    sh = np.zeros_like(g)
    sh[d:-d, d:-d] = g[:-2 * d, :-2 * d] - g[2 * d:, 2 * d:]   # + on top-left-facing edges, - on bottom-right
    v = L * (1 - 0.5 * (1 - rim)) * (1 + 0.45 * sh)
    v = np.clip(v, 0.28, 1.0)
    v = np.where(a > 0, v, 0.6)               # transparent texels: a mid grey so bilinear fringes stay neutral
    out = np.dstack([v, v, v, a])
    return Image.fromarray((out * 255 + 0.5).astype(np.uint8), 'RGBA')


def resize(img, size):
    return img.convert('RGBa').resize((size, size), Image.LANCZOS).convert('RGBA')


cells = {n: process(os.path.join(RENDER, n + '.png')) for n in order}


def build(cell):
    atlas = Image.new('RGBA', (cell * COLS, cell * ROWS), (153, 153, 153, 0))
    for i, n in enumerate(order):
        atlas.paste(resize(cells[n], cell), ((i % COLS) * cell, (i // COLS) * cell))
    return atlas


atlas = build(CELL)
atlas.save(os.path.join(OUT, 'atlas.webp'), lossless=True, quality=100, method=6, exact=True)
build(CELL * 2).save(os.path.join(OUT, 'atlas@2x.webp'), lossless=True, quality=100, method=6, exact=True)

# ---------------- mapping ----------------
flag_size = {}
for f in fleets:
    flag_size.setdefault(f['flag'], f.get('flagSize'))
model_size = {}
for name, v in manifest.items():
    slug = v['file'][:-4]
    if slug in model_size:
        continue
    sz = flag_size.get(name + ' Default Config')
    if not sz:
        pre = os.path.basename(v['source']).split('_')[0]
        sz = PREFIX_SIZE.get(pre)
    model_size[slug] = sz
for alias, target in ALIASES.items():
    assert target in slugs, alias


def to_slug(config):
    words = config.replace(' Config', '').lower().split()
    for n in range(len(words), 1, -1):
        cand = '-'.join(words[:n])
        hit = cand if cand in slugs else ALIASES.get(cand)
        if hit:
            want = flag_size.get(config)
            if want and model_size.get(hit) and model_size[hit] != want:
                return None, f'{cand} is {model_size[hit]}, config flies as {want}'
            return hit, None
    return None, None


config_to_slug, rejected = {}, {}
for c in sorted(flag_size):
    s, why = to_slug(c)
    config_to_slug[c] = s
    if why:
        rejected[c] = why
matched = sum(1 for f in fleets if config_to_slug.get(f['flag']))
idx = {n: i for i, n in enumerate(order)}
doc = {
    'v': 1,
    'image': 'atlas.webp', 'image2x': 'atlas@2x.webp',
    'cell': CELL, 'cols': COLS, 'rows': ROWS, 'width': CELL * COLS, 'height': CELL * ROWS,
    'layout': 'cell i is at pixel x=(i % cols)*cell, y=floor(i / cols)*cell, origin TOP-LEFT of the image; '
              'nose points UP (-y in image, +v in three.js with flipY=true); hull is white, straight alpha',
    'frame': 'longest side of the top-down silhouette = 0.92 of the cell, centred; size is NOT encoded '
             '(every ship fills its cell) - scale by flagSize in the shader',
    'entries': {s: idx[s] for s in slugs},
    'sizeClass': {s: idx['gen-' + s] for s in SIZES},
    'fallbackClass': FALLBACK_CLASS,
    'aliases': ALIASES,
    'modelSize': model_size,
    'resolve': 'slug = configToSlug[fleet.flag]; index = slug ? entries[slug] : sizeClass[fleet.flagSize] '
               '?? sizeClass[fallbackClass]',
    'configToSlug': config_to_slug,
    'rejectedBySize': rejected,
    'coverage': {'fleets': len(fleets), 'matched': matched, 'pct': round(100 * matched / len(fleets), 1),
                 'source': os.path.basename(LATEST), 'generatedAt': latest.get('generatedAt')},
    # forward-axis decision per model, plus where the stern/nose cues landed in the cell (y: 0 = top, 1 = bottom;
    # may fall outside 0..1 when a plume runs past the hull). engineY drove the decision when source == engines;
    # wakeY / glassY were NOT used by the decision and are independent evidence for the checker.
    'orientation': {n: dict({k: meta[n].get(k) for k in ('source', 'axis', 'sign', 'thetaDeg')},
                            **{k[:-2] + 'Y': round(meta[n][k][1] / meta[n]['px'], 3)
                               for k in ('enginePx', 'wakePx', 'glassPx') if k in meta[n]}) for n in slugs},
}
json.dump(doc, open(os.path.join(OUT, 'atlas.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)

# ---------------- preview ----------------
TINTS = [(255, 120, 90), (90, 170, 255), (255, 205, 80), (140, 230, 140), (210, 140, 255), (120, 220, 230)]
PC, LAB = 160, 30
prev = Image.new('RGBA', (PC * COLS, (PC + LAB) * ROWS), (14, 20, 32, 255))
dr = ImageDraw.Draw(prev)
try:
    font = ImageFont.truetype('arial.ttf', 12)
except OSError:
    font = ImageFont.load_default()
for i, n in enumerate(order):
    c = resize(cells[n], PC)
    arr = np.asarray(c, dtype=np.float32)
    t = np.array(TINTS[i % len(TINTS)], dtype=np.float32) / 255
    arr[..., :3] *= t
    tinted = Image.fromarray(arr.astype(np.uint8), 'RGBA')
    x, y = (i % COLS) * PC, (i // COLS) * (PC + LAB)
    prev.alpha_composite(tinted, (x, y))
    m = meta[n]
    sub = m.get('source', '') if m['kind'] == 'model' else 'generic'
    dr.text((x + 4, y + PC + 1), f'{i} {n}', fill=(235, 235, 235, 255), font=font)
    dr.text((x + 4, y + PC + 15), f'{sub} {model_size.get(n, "")}', fill=(150, 160, 180, 255), font=font)
prev.save(os.path.join(OUT, 'preview.png'))
print(json.dumps({'cells': len(order), 'coverage': doc['coverage'], 'rejectedBySize': rejected}))
