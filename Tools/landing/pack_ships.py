# pack_ships.py - hull art for the Ship Explorer: a trimmed hero WebP per hull and a 12-frame turntable strip,
# plus Images/ships/manifest.json mapping each JSON/Ships record ("Ship Name") to its files.
# Sources: 1) the Battle Arena repo's Cycles renders (RawAssets/Renders/<Manufacturer>/<Hull>_hero.png, _turn_NN.png);
#          2) for hulls with no render, the official store image from the Star Atlas galaxy catalogue
#             (https://galaxy.staratlas.com/nfts, the same images play.staratlas.com/market shows) - still only, no turntable.
import os, re, json, glob, io, urllib.request
from PIL import Image

RAW = r'C:\Users\khawa\Desktop\StarAtlasBattleArena\RawAssets\Renders'
HUB = r'C:\Users\khawa\Desktop\OperationsHub'
OUT = os.path.join(HUB, 'Images', 'ships')
GALAXY = 'https://galaxy.staratlas.com/nfts'
os.makedirs(OUT, exist_ok=True)

# hull renders on disk
hulls = {}
for m in os.listdir(RAW):
    d = os.path.join(RAW, m)
    if os.path.isdir(d):
        for f in os.listdir(d):
            if f.endswith('_hero.png'):
                hulls[f[:-9]] = d

def norm(s):
    return re.sub(r'[^a-z0-9]', '', s.lower())

# exact normalised match on the hull part of the name; a few renders are named differently from the data
ALIAS = {'ogrikaruch': None, 'armstrongimptip': 'Armstrong_IMPTip', 'armstrongimptap': None, 'armstrongimp': 'Armstrong_Imp',
         'calicoatsenforcer': 'Calico_Enforcer', 'fimbulmambaex': 'Fimbul_Mamba'}
by_key = {norm(h): h for h in hulls}

def trim(im, pad=6):
    bbox = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
    if not bbox:
        return im
    x0, y0, x1, y1 = bbox
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))

# galaxy catalogue: normalised name -> (name, best image url, symbol); full image first, thumbnail as fallback
galaxy = {}
try:
    with urllib.request.urlopen(GALAXY, timeout=60) as r:
        for x in json.load(r):
            if (x.get('attributes') or {}).get('itemType') != 'ship':
                continue
            url = x.get('image') or (x.get('media') or {}).get('thumbnailUrl')
            if url:
                galaxy[norm(x.get('name', ''))] = (x.get('name'), url, x.get('symbol'))
    print('galaxy catalogue:', len(galaxy), 'ships')
except Exception as e:
    print('galaxy catalogue unavailable:', e)

manifest = {}
made = set()
for f in sorted(glob.glob(os.path.join(HUB, 'JSON', 'Ships', '*.json'))):
    ship = json.load(open(f, encoding='utf-8'))['ship']
    name = ship['Ship Name']
    key = norm(name.replace('BYOS', '').replace('ECOS', ''))
    hull = ALIAS[key] if key in ALIAS else by_key.get(key)
    if hull:
        hero_out = f'{hull}_hero.webp'; turn_out = f'{hull}_turn.webp'
        if hull not in made:
            made.add(hull)
            d = hulls[hull]
            im = trim(Image.open(os.path.join(d, hull + '_hero.png')).convert('RGBA'))
            if im.width > 640:
                im = im.resize((640, round(im.height * 640 / im.width)), Image.LANCZOS)
            im.save(os.path.join(OUT, hero_out), 'WEBP', quality=84, method=6)
            frames = sorted(glob.glob(os.path.join(d, hull + '_turn_*.png')))
            F, S = len(frames), 320
            strip = Image.new('RGBA', (S * F, S), (0, 0, 0, 0))
            for i, fr in enumerate(frames):
                fi = Image.open(fr).convert('RGBA')
                fi.thumbnail((S, S), Image.LANCZOS)
                strip.alpha_composite(fi, (i * S + (S - fi.width) // 2, (S - fi.height) // 2))
            strip.save(os.path.join(OUT, turn_out), 'WEBP', quality=72, method=6)
        manifest[name] = {'hull': hull, 'hero': hero_out, 'turn': turn_out, 'frames': 12, 'frameSize': 320, 'source': 'render'}
        continue

    # no render: official store image from the galaxy catalogue
    g = galaxy.get(norm(name))
    if not g:
        manifest[name] = None
        continue
    gname, url, symbol = g
    slug = re.sub(r'[^A-Za-z0-9]+', '_', name).strip('_')
    hero_out = f'{slug}_store.webp'
    path = os.path.join(OUT, hero_out)
    if not os.path.exists(path):
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                im = Image.open(io.BytesIO(r.read())).convert('RGB')
            if im.width > 960:
                im = im.resize((960, round(im.height * 960 / im.width)), Image.LANCZOS)
            im.save(path, 'WEBP', quality=80, method=6)
        except Exception as e:
            print('download failed', name, url, e)
            manifest[name] = None
            continue
    manifest[name] = {'hull': None, 'hero': hero_out, 'turn': None, 'frames': 0, 'frameSize': 0, 'source': 'store', 'symbol': symbol}

json.dump(manifest, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
total = sum(os.path.getsize(os.path.join(OUT, x)) for x in os.listdir(OUT))
print('ships', len(manifest), 'renders', sum(1 for v in manifest.values() if v and v['source'] == 'render'),
      'store images', sum(1 for v in manifest.values() if v and v['source'] == 'store'), 'total MB', round(total / 1e6, 1))
print('no art:', [k for k, v in manifest.items() if not v])
