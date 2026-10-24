# pack_planets.py - pack the render_planets.py output (512 px RGBA PNGs) into Images/planets/:
#   <slug>_<v>_384.webp  portrait (planet modal 180 px, stake builder 84 px, rows 64 px at 2x)
#   <slug>_<v>_128.webp  orrery body (bodies are <= ~16 px radius on the 420 px modal orrery)
#   star_<t>_384.webp    star disc + halo; the disc is 1/2.6 of the half-size (orrery.js draws the glow at 2.6 x core)
# Frame facts the page relies on (orrery.js FRAME): a planet's radius is 0.680 of the sprite's half-size.
#   python pack_planets.py <render_dir>
import os, sys, json, math
from PIL import Image, ImageDraw, ImageFilter

SRC = sys.argv[1]
OUT = r'C:\Users\khawa\Desktop\OperationsHub\Images\planets'
os.makedirs(OUT, exist_ok=True)

# orrery.js STAR_STYLE glow colours, star.type 0-4
GLOW = {0: '#cfe3ff', 1: '#ff6a3d', 2: '#ffc24d', 3: '#5ab8ff', 4: '#ff3d2e'}
HALO = 2.6


def hexrgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def star_sprite(disc_png, glow_hex, size=384):
    disc = Image.open(disc_png).convert('RGBA')
    d = round(size / HALO)
    disc = disc.resize((d, d), Image.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    # halo: radial falloff from the limb out to the sprite edge, in the type's glow colour
    r, g, b = hexrgb(glow_hex)
    halo = Image.new('L', (size, size), 0)
    px = halo.load(); c = (size - 1) / 2; r0 = d / 2
    for y in range(size):
        for x in range(size):
            dist = math.hypot(x - c, y - c)
            t = (dist - r0 * 0.85) / (size / 2 - r0 * 0.85)
            px[x, y] = 0 if t >= 1 else int(255 * (1 if t <= 0 else (1 - t) ** 2.4) * 0.75)
    col = Image.new('RGBA', (size, size), (r, g, b, 0)); col.putalpha(halo)
    canvas.alpha_composite(col)
    canvas.alpha_composite(disc, ((size - d) // 2, (size - d) // 2))
    return canvas


files, total = [], 0
for f in sorted(os.listdir(SRC)):
    if not f.endswith('.png'):
        continue
    name = f[:-4]
    if name.startswith('star_'):
        t = int(name.split('_')[1])
        im = star_sprite(os.path.join(SRC, f), GLOW[t])
        outs = [(f'{name}_384.webp', im)]
    else:
        im = Image.open(os.path.join(SRC, f)).convert('RGBA')
        outs = [(f'{name}_384.webp', im.resize((384, 384), Image.LANCZOS)), (f'{name}_128.webp', im.resize((128, 128), Image.LANCZOS))]
    for fn, img in outs:
        p = os.path.join(OUT, fn)
        img.save(p, 'WEBP', quality=84, method=6)
        files.append(fn); total += os.path.getsize(p)

manifest = {'planetRadiusFrac': round(1 / 1.47, 4), 'starDiscFrac': round(1 / HALO, 4), 'variants': 3, 'files': files}
json.dump(manifest, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
print('files', len(files), 'total KB', total // 1024)
