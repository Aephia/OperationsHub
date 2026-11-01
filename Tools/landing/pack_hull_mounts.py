#!/usr/bin/env python
# pack_hull_mounts.py - where the guns really are on each hull, for the Ship Explorer teardown.
#   python -I pack_hull_mounts.py --build      fit the game's muzzle picks onto our GLBs, write `mounts` into manifest.json
#   python -I pack_hull_mounts.py --check      re-measure every stored mount against the mesh (+ negative controls)
# Source: the Battle Arena repo's RawAssets/Export/Muzzles (READ-ONLY): positions read by eye off ortho sheets and made
# exact by ray-cast (tools/muzzle-picks.json, VF-13), in UE mesh-local units; F4 from its gun objects, X5 from its own named nodes.
# Nothing assumes how UE units relate to our GLBs: every axis swap and flip is tried, and a transform is only accepted if
# the muzzles land ON the mesh. A hull that does not pass gets no mounts, and the viewer keeps its weapons rack.
import os, sys, json, argparse, math
import numpy as np
from pack_hull_models import OUT, MANIFEST, read_glb, accessor, atomic_json, HUB

MZ = r'C:\Users\khawa\Desktop\StarAtlasBattleArena\RawAssets\Export\Muzzles'
TOL = 0.016       # a muzzle may be this fraction of the hull's length off the skin (the centre of a barrel's end ring is not on it)
MARGIN = 1.6      # the wrong end of the ship must fit this many times worse, or the fit proves nothing
SEAT = 0.001      # a muzzle this close to the skin is exactly on it
KEEP = 0.5        # a muzzle our mesh lacks may be dropped, if at least this share of them stay
EXPECT_HULLS, EXPECT_MOUNTS = 36, 92  # pinned: --check must fail if a rebuild quietly loses mounts
# ship record -> name in muzzles_all.json. Explicit: no fuzzy matching. Mamba EX shares the Mamba mesh.
PICKS = {
    'Armstrong IMP': 'Armstrong_Imp', 'Busan Maiden Heart': 'Busan_MaidenHeart', 'Busan Thrill of Life': 'Busan_ThrillOfLife',
    'Calico ATS Enforcer': 'Calico_Enforcer', 'Calico Compakt Hero': 'Calico_CompaktHero', 'Calico Evac': 'Calico_Evac',
    'Calico Guardian': 'Calico_Guardian', 'Calico Medtech': 'Calico_MedTech', 'Calico Scud': 'Calico_Scud',
    'Fimbul Airbike': 'Fimbul_Airbike', 'Fimbul BYOS Packlite': 'Fimbul_Packlite', 'Fimbul BYOS Tankship': 'Fimbul_Tankship',
    'Fimbul ECOS Greenader': 'Fimbul_Greenader', 'Fimbul Mamba': 'Fimbul_Mamba', 'Fimbul Mamba EX': 'Fimbul_Mamba',
    'Ogrika Mik': 'Ogrika_Mik', 'Ogrika Sunpaa': 'Ogrika_Sunpaa', 'Ogrika Thripid': 'Ogrika_Thripid', 'Ogrika Tursic': 'Ogrika_Tursic',
    'Opal Bitboat': 'Opal_Bitboat', 'Opal Jet': 'Opal_Jet', 'Opal Jetjet': 'Opal_JetJet', 'Opal Rayfam': 'Opal_Rayfam',
    'Pearce C11': 'Pearce_C11', 'Pearce C9': 'Pearce_C9', 'Pearce D9': 'Pearce_D9', 'Pearce R8': 'Pearce_R8', 'Pearce X4': 'Pearce_X4',
    'Rainbow Arc': 'Rainbow_Arc', 'Rainbow Chi': 'Rainbow_Chi', 'Rainbow Om': 'Rainbow_Om', 'Tufa Feist': 'Tufa_Feist',
    'VZUS ambwe': 'VZUS_Ambwe', 'VZUS ballad': 'VZUS_Ballad', 'VZUS opod': 'VZUS_Opod', 'VZUS solos': 'VZUS_Solos',
}
GUNS = {'Pearce F4': 'MED_PRC_F4_LowRes.blend'}
# the GLB itself names these guns, so no fit is needed. The X5 is symmetric end for end: a fit from outside cannot prove which way round it is.
NAMED = {'Pearce X5': 'mesh_anim_gun'}


def load_mesh(path):
    """triangles (n,3,3) of the solid hull in GLB scene space; same filter as the game's fit (no vfx, no glass)."""
    js, binb = read_glb(path)
    world = {}

    def walk(i, ps, pt):
        n = js['nodes'][i]
        s = n.get('scale', [1, 1, 1])
        t = n.get('translation', [0, 0, 0])
        es = [ps[k] * s[k] for k in range(3)]
        world[i] = (es, [pt[k] + ps[k] * t[k] for k in range(3)])
        for c in n.get('children', []):
            walk(c, es, world[i][1])

    for r in js['scenes'][js.get('scene', 0)]['nodes']:
        walk(r, [1, 1, 1], [0, 0, 0])
    out = []
    for i, nd in enumerate(js['nodes']):
        name = (nd.get('name') or '').lower()
        if 'mesh' not in nd or 'vfx' in name or 'flare' in name or 'glass' in name:
            continue
        s, t = world[i]
        for pr in js['meshes'][nd['mesh']]['primitives']:
            pos, a = accessor(js, binb, pr['attributes']['POSITION'])
            p = np.array(pos, dtype=np.float64) * np.array(s) + np.array(t)
            idx = np.array(accessor(js, binb, pr['indices'])[0]).reshape(-1) if 'indices' in pr else np.arange(len(p))
            out.append(p[idx.reshape(-1, 3)])
    return np.concatenate(out) if out else np.zeros((0, 3, 3))


def named_mounts(path, needle):
    """the middle of each mesh node whose name holds `needle`, in GLB scene space."""
    js, binb = read_glb(path)
    root = next((n for n in js['nodes'] if n.get('name') == 'quantScale'), None)
    k = root['scale'][0] if root else 1.0
    out = []
    for nd in js['nodes']:
        if 'mesh' in nd and needle in (nd.get('name') or ''):
            p = np.array(accessor(js, binb, js['meshes'][nd['mesh']]['primitives'][0]['attributes']['POSITION'])[0], dtype=np.float64) * k
            out.append((p.min(axis=0) + p.max(axis=0)) / 2)
    return out


def surface_distance(points, tris):
    """exact point-to-triangle distance, smallest over the mesh, per point (Ericson, Real-Time Collision Detection 5.1.5)."""
    a, b, c = tris[:, 0], tris[:, 1], tris[:, 2]
    ab, ac = b - a, c - a
    res = []
    dot = lambda u, v: np.einsum('ij,ij->i', u, v)
    for p in points:
        ap = p - a
        d1, d2 = dot(ab, ap), dot(ac, ap)
        bp = p - b
        d3, d4 = dot(ab, bp), dot(ac, bp)
        cp = p - c
        d5, d6 = dot(ab, cp), dot(ac, cp)
        vc, vb, va = d1 * d4 - d3 * d2, d5 * d2 - d1 * d6, d3 * d6 - d5 * d4
        with np.errstate(divide='ignore', invalid='ignore'):
            denom = va + vb + vc
            v = np.where(denom != 0, vb / denom, 0.0)
            w = np.where(denom != 0, vc / denom, 0.0)
            q = a + ab * v[:, None] + ac * w[:, None]  # inside the face
            t = np.where(d4 - d3 + d5 - d6 != 0, (d4 - d3) / (d4 - d3 + d5 - d6), 0.0)
            m = va <= 0
            q = np.where((m & (d4 - d3 >= 0) & (d5 - d6 >= 0))[:, None], b + (c - b) * t[:, None], q)
            t = np.where(d2 - d6 != 0, d2 / (d2 - d6), 0.0)
            m = (vb <= 0) & (d2 >= 0) & (d6 <= 0)
            q = np.where(m[:, None], a + ac * t[:, None], q)
            t = np.where(d1 - d3 != 0, d1 / (d1 - d3), 0.0)
            m = (vc <= 0) & (d1 >= 0) & (d3 <= 0)
            q = np.where(m[:, None], a + ab * t[:, None], q)
        q = np.where(((d6 >= 0) & (d5 <= d6))[:, None], c, q)
        q = np.where(((d3 >= 0) & (d4 <= d3))[:, None], b, q)
        q = np.where(((d1 <= 0) & (d2 <= 0))[:, None], a, q)
        res.append(float(np.sqrt(((q - p) ** 2).sum(axis=1)).min()))
    return np.array(res)


def fit(muzzles, emn, emx, tris):
    """every axis assignment and flip: UE (x, y, z) -> GLB (.., z up becomes y up, ..). Returns candidates, best first."""
    muz = np.array(muzzles, dtype=np.float64)
    gmn, gmx = tris.reshape(-1, 3).min(axis=0), tris.reshape(-1, 3).max(axis=0)
    gc, gx = (gmn + gmx) / 2, gmx - gmn
    ec, ex = (np.array(emn) + np.array(emx)) / 2, np.array(emx) - np.array(emn)
    length = float(gx.max())
    out = []
    for swap in (False, True):
        ax, az = (1, 0) if swap else (0, 1)  # which UE axis feeds GLB x and GLB z
        # uniform scale, so a wrong axis assignment is not stretched into fitting
        ratios = [gx[0] / ex[ax], gx[1] / ex[2], gx[2] / ex[az]]
        s = float(np.median(ratios))
        spread = (max(ratios) - min(ratios)) / s
        for sx in (1, -1):
            for sz in (1, -1):
                g = np.stack([sx * s * (muz[:, ax] - ec[ax]) + gc[0], s * (muz[:, 2] - ec[2]) + gc[1], sz * s * (muz[:, az] - ec[az]) + gc[2]], axis=1)
                d = surface_distance(g, tris) / length
                out.append({'swap': swap, 'sx': sx, 'sz': sz, 'pts': g, 'd': d, 'mean': float(d.mean()), 'worst': float(d.max()), 'spread': spread})
    # Exact seats first: the mesh can lack a gun the source has (the Mamba's side rifles), and then the mean prefers the
    # wrong end of the ship, near everything and exactly on nothing.
    for c in out:
        c['seats'] = int((c['d'] < SEAT).sum())
    return sorted(out, key=lambda c: (-c['seats'], c['mean']))


def judge(cands):
    """accepted only if on the skin AND the same fit with the ship turned end for end is clearly worse."""
    best = cands[0]
    keep = best['d'] <= TOL
    best['keep'] = keep
    if keep.mean() < KEEP or (best['worst'] > TOL and not best['seats']):
        return best, None, 'off the skin: worst %.2f%% of length' % (best['worst'] * 100)
    turned = [c for c in cands if c['swap'] == best['swap'] and (c['sz'] != best['sz'] if not best['swap'] else c['sx'] != best['sx'])]
    wrong_end = min(c['mean'] for c in turned)
    ratio = wrong_end / max(best['mean'], 1e-4)
    if ratio < MARGIN and best['seats'] <= max(c['seats'] for c in turned):
        return best, ratio, 'ambiguous: the ship turned end for end fits as well (%.2fx)' % ratio
    return best, ratio, ''


def sources():
    al = json.load(open(os.path.join(MZ, 'muzzles_all.json')))
    eng = json.load(open(os.path.join(MZ, 'engine.json')))
    guns = json.load(open(os.path.join(MZ, 'muzzles.json')))
    out = {}
    for rec, k in PICKS.items():
        if k in al and al[k].get('muzzles') and k in eng:
            out[rec] = (al[k]['muzzles'], eng[k]['min'], eng[k]['max'], 'picked')
    for rec, k in GUNS.items():
        if k in guns:
            out[rec] = ([g['muzzle'] for g in guns[k]['guns']], guns[k]['hull_min'], guns[k]['hull_max'], 'gun objects')
    return out


def cmd_build():
    man = json.load(open(MANIFEST, encoding='utf-8'))
    src = sources()
    placed, rejected, cache = 0, [], {}
    for rec, ent in sorted(man.items()):
        ent.pop('mounts', None)
        if rec in NAMED:
            tris = cache.setdefault(ent['file'], load_mesh(os.path.join(OUT, ent['file'])))
            pts = np.array(named_mounts(os.path.join(OUT, ent['file']), NAMED[rec]))
            d = surface_distance(pts, tris) / float((tris.reshape(-1, 3).max(axis=0) - tris.reshape(-1, 3).min(axis=0)).max())
            print('%-30s named guns   n=%-2d worst %.3f%%%s' % (rec, len(pts), d.max() * 100, ' REJECTED' if d.max() > TOL or not len(pts) else ''))
            if d.max() > TOL or not len(pts):
                rejected.append(rec)
                continue
            ent['mounts'] = [[round(float(v), 5) for v in q] for q in pts]
            placed += 1
            continue
        if rec not in src:
            print('%-30s no muzzle data' % rec)
            continue
        muz, emn, emx, kind = src[rec]
        tris = cache.get(ent['file'])
        if tris is None:
            tris = cache[ent['file']] = load_mesh(os.path.join(OUT, ent['file']))
        best, ratio, why = judge(fit(muz, emn, emx, tris))
        tag = '%-30s %-12s n=%-2d kept=%-2d seats=%-2d swap=%-5s sx=%2d sz=%2d mean %.3f%% worst %.3f%% end-for-end %s scale-spread %.3f' % (
            rec, kind, len(muz), int(best['keep'].sum()), best['seats'], best['swap'], best['sx'], best['sz'], best['mean'] * 100, best['worst'] * 100,
            'n/a' if ratio is None else '%.1fx' % ratio, best['spread'])
        if why:
            rejected.append(rec)
            print(tag, 'REJECTED', why)
            continue
        ent['mounts'] = [[round(float(v), 5) for v in p] for p in best['pts'][best['keep']]]
        placed += 1
        print(tag)
    if not placed:
        raise SystemExit('no hull passed: manifest left alone')
    atomic_json(MANIFEST, man)
    print('placed %d of %d hulls; rejected %s' % (placed, len(man), rejected))
    return 0


def cmd_check():
    man = json.load(open(MANIFEST, encoding='utf-8'))
    fails, n, total = [], 0, 0
    cache = {}
    for rec, ent in sorted(man.items()):
        if 'mounts' not in ent:
            continue
        tris = cache.get(ent['file'])
        if tris is None:
            tris = cache[ent['file']] = load_mesh(os.path.join(OUT, ent['file']))
        pts = np.array(ent['mounts'], dtype=np.float64)
        d = surface_distance(pts, tris) / float((tris.reshape(-1, 3).max(axis=0) - tris.reshape(-1, 3).min(axis=0)).max())
        n += 1
        total += len(pts)
        if d.max() > TOL:
            fails.append((rec, float(d.max())))
    print('checked %d hulls, %d mounts, failures %s' % (n, total, fails))
    if n != EXPECT_HULLS or total != EXPECT_MOUNTS:
        fails.append(('pinned count', '%d hulls %d mounts, expected %d and %d' % (n, total, EXPECT_HULLS, EXPECT_MOUNTS)))
        print('FAIL pinned count:', fails[-1][1])
    # positive control: a known mesh vertex is at distance 0. Negative: the Guardian's mounts pushed half a hull off must fail.
    g = man['Calico Guardian']
    tris = cache[g['file']]
    L = float((tris.reshape(-1, 3).max(axis=0) - tris.reshape(-1, 3).min(axis=0)).max())
    pos = surface_distance(tris[0:1, 0], tris)[0]
    print('POSITIVE CONTROL a mesh vertex: distance %.6f %s' % (pos, 'PASS' if pos < 1e-6 else 'FAIL'))
    far = surface_distance(np.array(g['mounts']) + np.array([0, L * 0.5, 0]), tris) / L
    neg = far.max() > TOL
    print('NEGATIVE CONTROL mounts moved off the hull: worst %.1f%% %s' % (far.max() * 100, 'FAILED AS REQUIRED' if neg else 'DID NOT FAIL (BAD)'))
    ok = not fails and n > 0 and pos < 1e-6 and neg
    print('CHECK', 'PASS' if ok else 'FAIL')
    return 0 if ok else 1


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--build', action='store_true')
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    sys.exit(cmd_build() if a.build else cmd_check() if a.check else ap.print_help() or 2)
