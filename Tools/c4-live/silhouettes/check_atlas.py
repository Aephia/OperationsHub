"""Check the C4 Live ship silhouette atlas. Exit 0 = pass, 1 = fail.

  python check_atlas.py <silhouettes_dir> <models_dir> <latest.json>
  python check_atlas.py --selftest <silhouettes_dir> <models_dir> <latest.json>

Checks:
  1. every <models_dir>/*.glb has an entry, every size class has a cell, indices unique and inside the grid
  2. every used cell has alpha, its alpha bbox has a longest side >= 85% of the cell (uniform framing),
     and a 1 px border ring that is fully transparent (no bleed into the neighbour); unused cells are empty
  3. nose up: models whose forward axis came from engines must have engineY > 0.5 (engines below centre);
     any model with a wake mesh (not used by the decision) must have wakeY > 0.5; generic hulls are authored
  4. every distinct fleets[].flag in latest.json is in configToSlug and resolves to a model cell or a
     size-class cell; a slug-mapped config's flagSize equals the model's own size class
  5. coverage in atlas.json equals the coverage recomputed from latest.json
--selftest runs the checker on two broken copies (one cell erased; one flag removed from configToSlug)
and passes only if BOTH are rejected and the untouched atlas passes.
"""
import sys, os, json, shutil, tempfile, collections
import numpy as np
from PIL import Image


def check(sil, models, latest_path, log=print):
    errs = []
    doc = json.load(open(os.path.join(sil, 'atlas.json'), encoding='utf-8'))
    latest = json.load(open(latest_path, encoding='utf-8'))
    cell, cols, rows = doc['cell'], doc['cols'], doc['rows']
    img = np.asarray(Image.open(os.path.join(sil, doc['image'])).convert('RGBA'))
    if img.shape[:2] != (rows * cell, cols * cell):
        errs.append(f'image is {img.shape[:2]}, expected {(rows * cell, cols * cell)}')
    # 1
    slugs = sorted(f[:-4] for f in os.listdir(models) if f.endswith('.glb'))
    for s in slugs:
        if s not in doc['entries']:
            errs.append(f'model {s} has no cell')
    sizes = ['xx-small', 'x-small', 'small', 'medium', 'large', 'capital', 'commander', 'titan']
    for s in sizes:
        if s not in doc['sizeClass']:
            errs.append(f'size class {s} has no cell')
    used = list(doc['entries'].values()) + list(doc['sizeClass'].values())
    if len(set(used)) != len(used):
        errs.append('duplicate cell index')
    if any(i < 0 or i >= cols * rows for i in used):
        errs.append('cell index outside grid')
    # 2
    names = {i: n for n, i in doc['entries'].items()}
    names.update({i: 'gen-' + n for n, i in doc['sizeClass'].items()})
    fills = []
    for i in range(cols * rows):
        x, y = (i % cols) * cell, (i // cols) * cell
        a = img[y:y + cell, x:x + cell, 3]
        if i not in names:
            if a.any():
                errs.append(f'unused cell {i} is not empty')
            continue
        n = names[i]
        ys, xs = np.nonzero(a > 16)
        if len(xs) == 0:
            errs.append(f'cell {i} ({n}) is empty')
            continue
        side = max(xs.max() - xs.min() + 1, ys.max() - ys.min() + 1) / cell
        area = (xs.max() - xs.min() + 1) * (ys.max() - ys.min() + 1) / cell ** 2
        fills.append((side, area, n))
        if side < 0.85:
            errs.append(f'cell {i} ({n}) bbox longest side {side:.2f} < 0.85')
        ring = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
        if ring.any():
            errs.append(f'cell {i} ({n}) touches its border')
    # 3
    by_cue = collections.Counter()
    for s in slugs:
        o = doc['orientation'].get(s)
        if not o:
            errs.append(f'{s}: no orientation record')
            continue
        if o['source'] == 'engines':
            by_cue['engines'] += 1
            if not o.get('engineY', 0) > 0.5:
                errs.append(f'{s}: engines-driven but engineY={o.get("engineY")} is not below centre')
        if 'wakeY' in o:
            by_cue['wake'] += 1
            if not o['wakeY'] > 0.5:
                errs.append(f'{s}: wake trails ABOVE centre (wakeY={o["wakeY"]}) - nose is down')
    no_cue = [s for s in slugs if doc['orientation'].get(s, {}).get('source') != 'engines'
              and 'wakeY' not in doc['orientation'].get(s, {})]
    # 4
    fleets = latest['fleets']
    flag_size = {}
    for f in fleets:
        flag_size.setdefault(f['flag'], f.get('flagSize'))
    c2s = doc['configToSlug']
    for flag, fs in flag_size.items():
        if flag not in c2s:
            errs.append(f'flag not covered: {flag!r}')
            continue
        s = c2s[flag]
        if s is not None:
            if s not in doc['entries']:
                errs.append(f'{flag!r} -> {s} which has no cell')
            elif doc['modelSize'].get(s) and doc['modelSize'][s] != fs:
                errs.append(f'{flag!r} flies as {fs} but maps to {s} ({doc["modelSize"][s]})')
        elif fs not in doc['sizeClass'] and doc.get('fallbackClass') not in doc['sizeClass']:
            errs.append(f'{flag!r} has no model and size {fs!r} has no cell')
    # 5
    matched = sum(1 for f in fleets if c2s.get(f['flag']))
    cov = doc['coverage']
    if (cov['fleets'], cov['matched']) != (len(fleets), matched):
        errs.append(f'coverage says {cov["matched"]}/{cov["fleets"]}, recomputed {matched}/{len(fleets)}')
    log(f'cells used {len(used)}/{cols * rows}; models {len(slugs)}; size classes {len(doc["sizeClass"])}')
    if fills:
        log(f'bbox longest side min {min(fills)[0]:.2f} ({min(fills)[2]}); area min '
            f'{min(f[1] for f in fills):.2f} ({min(fills, key=lambda f: f[1])[2]})')
    log(f'nose-up cues: engines-driven {by_cue["engines"]}, wake-confirmed {by_cue["wake"]}; '
        f'no cue (eyeball only): {no_cue}')
    log(f'flags {len(flag_size)} all covered: {all(f in c2s for f in flag_size)}; coverage '
        f'{matched}/{len(fleets)} = {100 * matched / len(fleets):.1f}% of fleets show their own hull')
    for e in errs:
        log('FAIL ' + e)
    return errs


def selftest(sil, models, latest_path):
    ok = not check(sil, models, latest_path)
    print('control (untouched atlas):', 'PASS' if ok else 'FAIL')
    doc = json.load(open(os.path.join(sil, 'atlas.json'), encoding='utf-8'))
    results = []
    for case in ('erase-cell', 'drop-flag', 'nose-down'):
        tmp = tempfile.mkdtemp(prefix='atlas-neg-')
        for f in ('atlas.json', doc['image']):
            shutil.copy(os.path.join(sil, f), tmp)
        if case == 'erase-cell':
            i = doc['entries']['pearce-x4']
            im = Image.open(os.path.join(tmp, doc['image'])).convert('RGBA')
            c = doc['cell']
            im.paste((0, 0, 0, 0), ((i % doc['cols']) * c, (i // doc['cols']) * c, (i % doc['cols'] + 1) * c,
                                    (i // doc['cols'] + 1) * c))
            im.save(os.path.join(tmp, doc['image']), lossless=True)
        elif case == 'drop-flag':
            d2 = dict(doc)
            d2['configToSlug'] = {k: v for k, v in doc['configToSlug'].items() if k != 'Busan Pulse Default Config'}
            json.dump(d2, open(os.path.join(tmp, 'atlas.json'), 'w', encoding='utf-8'))
        else:  # a hull rendered 180 degrees round: its engines and wake land in the top half
            d2 = json.loads(json.dumps(doc))
            o = d2['orientation']['busan-thrill-of-life']
            o['engineY'], o['wakeY'] = 1 - o['engineY'], 1 - o['wakeY']
            json.dump(d2, open(os.path.join(tmp, 'atlas.json'), 'w', encoding='utf-8'))
        errs = check(tmp, models, latest_path, log=lambda *_: None)
        print(f'negative {case}: {"rejected" if errs else "NOT rejected"} -> {errs[:2]}')
        results.append(bool(errs))
        shutil.rmtree(tmp)
    return ok and all(results)


if __name__ == '__main__':
    args = sys.argv[1:]
    if args and args[0] == '--selftest':
        sys.exit(0 if selftest(*[os.path.abspath(a) for a in args[1:4]]) else 1)
    errs = check(*[os.path.abspath(a) for a in args[:3]])
    print('PASS' if not errs else f'FAIL ({len(errs)})')
    sys.exit(1 if errs else 0)
