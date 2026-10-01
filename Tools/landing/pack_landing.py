# pack_landing.py - build the OperationsHub landing-page image set (webp) from the Star Atlas raw assets.
# Usage: python pack_landing.py [planet_png]   (planet crops are skipped when the render is not there yet)
import os, sys, json
from PIL import Image, ImageOps

RAW = r'C:\Users\khawa\Desktop\StarAtlasBattleArena\RawAssets'
OUT = r'C:\Users\khawa\Desktop\OperationsHub\Images\landing'
os.makedirs(OUT, exist_ok=True)
report = {}

def save(im, name, q=82, lossless=False):
    p = os.path.join(OUT, name)
    im.save(p, 'WEBP', quality=q, method=6, lossless=lossless)
    report[name] = [im.size, os.path.getsize(p) // 1024]

def trim_alpha(im, pad=8):
    bbox = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
    if not bbox:
        return im
    x0, y0, x1, y1 = bbox
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))

def hull(name, max_w):
    m = name.split('_')[0]
    im = Image.open(os.path.join(RAW, 'Renders', m, name + '_hero.png')).convert('RGBA')
    im = trim_alpha(im)
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    return im

# 1. hero layer hulls (transparent, large)
for name, w in [('Pearce_X4', 1100), ('Fimbul_Tankship', 1300), ('Ogrika_Thripid', 700), ('Calico_Guardian', 520)]:
    save(hull(name, w), f'hero_{name}.webp', q=88)

# 2. fleet strip thumbnails (transparent, 160 px tall boxes)
FLEET = ['Pearce_X4', 'Fimbul_Tankship', 'Ogrika_Thripid', 'Calico_Guardian', 'VZUS_Ambwe', 'Opal_Rayfam',
         'Busan_ThrillOfLife', 'Rainbow_Arc', 'Pearce_C11', 'Armstrong_Imp', 'Tufa_Feist', 'Fimbul_Mamba',
         'Calico_Maxhog', 'Ogrika_Sunpaa', 'Pearce_F4', 'VZUS_Ballad']
for name in FLEET:
    im = hull(name, 10000)
    h = 170
    im = im.resize((round(im.width * h / im.height), h), Image.LANCZOS) if im.height != h else im
    save(im, f'fleet_{name}.webp', q=80)

# 3. module card art: 960x540 crops
def card(src, name, box=None, size=(960, 540), q=80):
    im = Image.open(src).convert('RGB')
    if box:
        im = im.crop(box)
    im = ImageOps.fit(im, size, Image.LANCZOS, centering=(0.5, 0.45))
    save(im, name, q=q)

ART = os.path.join(RAW, 'Artwork')
card(os.path.join(ART, 'Land and Claim Stakes', 'STAKE3.jpg'), 'card_claimstake.webp')
# MUD Central Space Station: crop above the caption bar (bottom-left) and off the flat grey sky
card(os.path.join(ART, 'Land and Claim Stakes', 'CSSLM0.jpg'), 'card_hub.webp', box=(300, 0, 4096, 1750))
card(os.path.join(RAW, 'Official', 'OGKANR_g02.jpg'), 'card_recipe.webp')
card(os.path.join(ART, 'Posters and Collectibles', 'discovery-of-iris.jpg'), 'card_resources.webp', box=(0, 0, 2600, 2250))

# 4. planet crops from the Blender render (when present)
if len(sys.argv) > 1 and os.path.exists(sys.argv[1]):
    pl = Image.open(sys.argv[1]).convert('RGB')
    W, H = pl.size
    # hero backdrop: full frame at 1920 wide + a 960 mobile cut
    save(pl.resize((1920, round(H * 1920 / W)), Image.LANCZOS), 'hero_planet_1920.webp', q=78)
    save(pl.resize((960, round(H * 960 / W)), Image.LANCZOS), 'hero_planet_960.webp', q=76)
    # planet card: the lit limb, lower-right quadrant
    card(sys.argv[1], 'card_planet.webp', box=(int(W * 0.40), int(H * 0.35), W, H))

json.dump(report, open(os.path.join(OUT, '_manifest.json'), 'w'), indent=1)
for k, v in report.items():
    print(f'{k:36s} {v[0][0]}x{v[0][1]}  {v[1]} KB')
print('TOTAL KB', sum(v[1] for v in report.values()))
