# check_crew.py - executable contract check for the crew art (exits 1 on any failure).
#   python -I check_crew.py                      check the real files
#   python -I check_crew.py --as-frame <file>    negative control: treat <file> as if it were frame-common.webp (must FAIL)
import os, sys
from PIL import Image, ImageStat

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CREW, LAND = os.path.join(ROOT, 'Images', 'crew'), os.path.join(ROOT, 'Images', 'landing')
TIERS = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'anomaly']
fails = []


def ok(cond, msg):
    print(('PASS ' if cond else 'FAIL ') + msg)
    if not cond:
        fails.append(msg)


def check_frame(path, label):
    ok(os.path.exists(path), label + ' exists')
    if not os.path.exists(path):
        return
    im = Image.open(path)
    ok(im.size == (480, 600), '%s size %s == (480, 600)' % (label, im.size))
    ok(im.mode in ('RGBA', 'LA'), '%s has alpha (mode %s)' % (label, im.mode))
    if im.mode != 'RGBA':
        im = im.convert('RGBA')
    a = im.getchannel('A')
    ok(a.getpixel((240, 300)) == 0, '%s centre alpha %d == 0' % (label, a.getpixel((240, 300))))
    ok(a.getpixel((6, 300)) == 255, '%s bezel alpha at (6,300) %d == 255' % (label, a.getpixel((6, 300))))
    # whole window (6 %..94 %) fully transparent
    x0, y0, x1, y1 = 29, 36, 451, 564
    ok(a.crop((x0, y0, x1, y1)).getextrema()[1] == 0, label + ' window region has max alpha 0')
    ok(os.path.getsize(path) < 40 * 1024, '%s size %.1f KB < 40' % (label, os.path.getsize(path) / 1024))


if len(sys.argv) > 2 and sys.argv[1] == '--as-frame':
    check_frame(sys.argv[2], 'NEG-CONTROL ' + os.path.basename(sys.argv[2]))
else:
    for t in TIERS:
        check_frame(os.path.join(CREW, 'frame-%s.webp' % t), 'frame-' + t)
    p = os.path.join(CREW, 'bay.webp')
    ok(os.path.exists(p), 'bay exists')
    im = Image.open(p)
    ok(im.size == (1920, 1080), 'bay size %s' % (im.size,))
    ok(os.path.getsize(p) < 180 * 1024, 'bay %.1f KB < 180' % (os.path.getsize(p) / 1024))
    r, g, b = ImageStat.Stat(im.convert('RGB')).mean
    lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    ok(lum < 0.12, 'bay mean luminance %.4f < 0.12' % lum)
    p = os.path.join(LAND, 'card_crew.webp')
    ok(os.path.exists(p), 'card_crew exists')
    im = Image.open(p)
    ok(im.size == (960, 540), 'card_crew size %s' % (im.size,))
    ok(os.path.getsize(p) < 120 * 1024, 'card_crew %.1f KB < 120' % (os.path.getsize(p) / 1024))
print('RESULT', 'FAIL (%d)' % len(fails) if fails else 'ALL PASS')
sys.exit(1 if fails else 0)
