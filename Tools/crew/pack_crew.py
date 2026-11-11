# pack_crew.py - pack the render_crew.py output into the repo (PIL: downsample, alpha check, WebP encode).
#   python -I pack_crew.py <render_dir>
# frames : frame-<tier>.png (960x1200 RGBA) -> Images/crew/frame-<tier>.webp  480x600, lossy with alpha, < 40 KB
# bay    : bay.png (1920x1080)              -> Images/crew/bay.webp          1920x1080, < 180 KB
# card   : card_crew.png (1920x1080)        -> Images/landing/card_crew.webp  960x540, < 120 KB
import os, sys
from PIL import Image

SRC = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CREW = os.path.join(ROOT, 'Images', 'crew')
LAND = os.path.join(ROOT, 'Images', 'landing')
os.makedirs(CREW, exist_ok=True)
TIERS = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'anomaly']
WIN = 0.06           # window inset per side (contract with the page)


def save(im, path, limit, **kw):
    """Encode, lowering quality until under `limit` bytes."""
    for q in (90, 84, 78, 72, 66, 60, 52, 44):
        im.save(path, 'WEBP', quality=q, method=6, **kw)
        if os.path.getsize(path) <= limit:
            print('%-24s q%d %6.1f KB' % (os.path.basename(path), q, os.path.getsize(path) / 1024))
            return
    sys.exit('cannot fit %s under %d bytes' % (path, limit))


for t in TIERS:
    im = Image.open(os.path.join(SRC, 'frame-%s.png' % t)).convert('RGBA').resize((480, 600), Image.LANCZOS)
    a = im.getchannel('A')
    x0, y0, x1, y1 = round(480 * WIN), round(600 * WIN), round(480 * (1 - WIN)), round(600 * (1 - WIN))
    # window must be fully transparent: force the interior alpha to 0 (render has none; this removes resampling fuzz)
    mx = a.crop((x0 + 1, y0 + 1, x1 - 1, y1 - 1)).getextrema()[1]
    if mx > 8:
        sys.exit('%s: opaque pixels inside the window (max alpha %d)' % (t, mx))
    im.paste((0, 0, 0, 0), (x0, y0, x1, y1))
    save(im, os.path.join(CREW, 'frame-%s.webp' % t), 40 * 1024 - 1, alpha_quality=90)

save(Image.open(os.path.join(SRC, 'bay.png')).convert('RGB'), os.path.join(CREW, 'bay.webp'), 180 * 1024 - 1)
save(Image.open(os.path.join(SRC, 'card_crew.png')).convert('RGB').resize((960, 540), Image.LANCZOS),
     os.path.join(LAND, 'card_crew.webp'), 120 * 1024 - 1)
