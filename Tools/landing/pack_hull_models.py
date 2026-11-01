#!/usr/bin/env python
# pack_hull_models.py - per-ship geometry-only GLBs for the Ship Explorer teardown viewer.
#   python -I pack_hull_models.py --table              print record -> source for every ship record
#   python -I pack_hull_models.py --build [--only "Calico Guardian"]   export via Blender, quantise if needed, write manifest
#   python -I pack_hull_models.py --check              acceptance script (+ negative controls)
# Sources: Battle Arena repo RawAssets/ShipsModels (READ-ONLY). Output: Images/ships/models/*.glb + manifest.json
# Matching is an explicit table (exact normalised names only); a hull not matched with confidence gets no entry.
import os, sys, re, json, struct, subprocess, shutil, tempfile, math, argparse

HUB = r'C:\Users\khawa\Desktop\OperationsHub'
SRC = r'C:\Users\khawa\Desktop\StarAtlasBattleArena\RawAssets\ShipsModels'
BLENDER = os.environ.get('PACK_BLENDER') or r'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe'
SCRATCH = r'C:\Users\khawa\AppData\Local\Temp\claude\team-2026-11-01\builder-hullmodels'
# PACK_OUT / PACK_TMP / PACK_BLENDER let tests run against a scratch copy with a faulty exporter
OUT = os.environ.get('PACK_OUT') or os.path.join(HUB, 'Images', 'ships', 'models')
DATA = os.path.join(HUB, 'Data', 'ships-data.json')
EXPORT = os.path.join(HUB, 'Tools', 'landing', 'blender_export_hull.py')
MANIFEST = os.path.join(OUT, 'manifest.json')
BUILD_TMP = os.environ.get('PACK_TMP') or os.path.join(SCRATCH, 'build')

F = 'Fimbul/Fimbul/'
# record name -> source (relative to SRC) or (None, reason).  Explicit table, no fuzzy/substring matching. Hulls
# match by exact normalised name EXCEPT these deliberate aliases: Calico ATS Enforcer -> Enforcer, Fimbul Mamba EX ->
# Mamba (shared with Fimbul Mamba), Pearce X4 -> the Light variant (same geometry as Dark), Armstrong IMP -> Imp.
TABLE = {
    'Busan Pulse': (None, 'no Pulse model in ShipsModels'),
    'Fimbul Airbike': F + 'Classic/Airbike/XXS_FBL_Airbike_LowRes.fbx',
    'Fimbul ECOS Unibomba': F + 'ECOS/Unibomba/XXS_FBL_Unibomba_LowRes.fbx',
    'Ogrika Ruch': (None, 'no Ruch model (Niruch is a different hull)'),
    'Opal Jet': 'Opal/Opal/Jet/XXS_OPL_Jet_LowRes.fbx',
    'Pearce X4': 'Pearce/Pearce/X4/XSM_PRC_X4_Light_LowRes.fbx',
    'VZUS solos': 'VZUS/VZUS/Solos/XXS_VUS_Solos_LowRes.fbx',
    'Calico Maxhog': (None, 'NM_/SM_XS_Maxhog ambiguous; NM is a wheeled buggy, SM is ~0 MB; contact sheet disagrees with the hero'),
    'Calico Scud': 'Calico/Calico/Scud/XSM_CLC_Scud_LowRes.fbx',
    'Fimbul Lowbie': F + 'Classic/Lowbie/XSM_FBL_Lowbie_LowRes.fbx',
    'Ogrika Niruch': 'Ogrika/Ogrika/Niruch/XS_Niruch_LowRes.fbx',
    'Opal Jetjet': 'Opal/Opal/JetJet/XSM_OPL_JetJet_LowRes.fbx',
    'Pearce X5': 'Pearce/Pearce/X5/XSM_PRC_X5_LowRes.fbx',
    'Armstrong IMP Tip': 'Armstrong/Armstrong/IMP Tip/ARM_IMP_TIP_LowRes.fbx',
    'Busan Thrill of Life': 'Busan/Busan/ThrillOfLife/SML_BSN_ThrillOfLife_LowRes.fbx',
    'Calico Medtech': 'Calico/Calico/MedTech/SML_CLC_MedTech_LowRes.fbx',
    'Calico Shipit': (None, 'no Shipit model'),
    'Fimbul BYOS Earp': (None, 'only a HighRes source exists and it exports as scattered loose parts, not a hull'),
    'Ogrika Mik': 'Ogrika/Ogrika/Mik/SML_OKA_Mik_LowRes.fbx',
    'Opal Rayfam': 'Opal/Opal/Rayfam/SML_OPL_Rayfam_LowRes.fbx',
    'Pearce R6': (None, 'XSM_PRC_R6_LowRes.fbx exports the same geometry as X6; silhouette disagrees with the R6 hero'),
    'Pearce X6': 'Pearce/Pearce/X6/SML_PRC_X6_LowRes.fbx',
    'Rainbow Chi': 'Rainbow/Rainbow/Chi/SML_RBW_Chi_LowRes.fbx',
    'Tufa Feist': 'Tufa/Tufa/Feist/SML_TFA_Feist_LowRes.fbx',
    'VZUS ambwe': 'VZUS/VZUS/Ambwe/SML_VUS_Ambwe_LowRes.fbx',
    'Armstrong IMP Tap': (None, 'only ARM_IMP_TAP_Sage.fbx: an unfinished kitbash (~75 parts named Cube/Cylinder/NASA_Saturn...), no render to verify against'),
    'Calico ATS Enforcer': 'Calico/Calico/Enforcer/MED_CLC_Enforcer_LowRes.fbx',
    'Calico Compakt Hero': 'Calico/Calico/CompaktHero/MED_CLC_CompaktHero_LowRes.fbx',
    'Calico Evac': 'Calico/Calico/Evac/MED_CLC_Evac_LowRes.fbx',
    'Fimbul BYOS Packlite': F + 'BYOS/Packlite/MED_FBL_Packlite_LowRes.fbx',
    'Fimbul BYOS Ranger': (None, 'no Ranger model'),
    'Fimbul Mamba EX': F + 'Classic/Mamba/MED_FBL_Mamba_LowRes.fbx',
    'Fimbul Mamba': F + 'Classic/Mamba/MED_FBL_Mamba_LowRes.fbx',
    'Ogrika Tursic': 'Ogrika/Ogrika/Tursic/MED_OKA_Tursic_LowRes.fbx',
    'Pearce F4': 'Pearce/Pearce/F4/MED_PRC_F4_LowRes.fbx',
    'Rainbow Om': 'Rainbow/Rainbow/Om/MED_RBW_Om_LowRes.fbx',
    'VZUS opod': 'VZUS/VZUS/Opod/MED_VUS_Opod_LowRes.fbx',
    'Fimbul BYOS Butch': (None, 'no Butch model'),
    'Fimbul ECOS Greenader': F + 'ECOS/Greenader/LRG_FBL_Greenader_LowRes.fbx',
    'Ogrika Sunpaa': 'Ogrika/Ogrika/Sunpaa/LRG_OKA_Sunpaa_LowRes.fbx',
    'Ogrika Thripid': 'Ogrika/Ogrika/Thripid/LRG_OKA_Thripid_LowRes.fbx',
    'Opal Bitboat': 'Opal/Opal/Bitboat/LRG_OPL_Bitboat_LowRes.fbx',
    'Pearce R8': 'Pearce/Pearce/R8/LRG_PRC_R8_LowRes.fbx',
    'Rainbow Arc': 'Rainbow/Rainbow/Arc/LRG_ RBW_Arc_LowRes.fbx',
    'Armstrong IMP': 'Armstrong/Armstrong/Imp/CAP_ARM_Imp_LowRes.fbx',
    'Busan Maiden Heart': 'Busan/Busan/MaidenHeart/CAP_BSN_MaidenHeart_LowRes.fbx',
    'Calico Guardian': 'Calico/Calico/Guardian/CAP_CLC_Guardian_LowRes.fbx',
    'Fimbul ECOS Bombarella': (None, 'only a HighRes source exists and it exports as scattered loose parts, not a hull'),
    'Fimbul Sledbarge': (None, 'no Sledbarge model'),
    'Ogrika Jod Asteris': 'Ogrika/Ogrika/Jod Asteris/CAP_OKA_JodAsteris_LowRes.fbx',
    'Pearce C9': 'Pearce/Pearce/C9/CAP_PRC_C9_LowRes.fbx',
    'Pearce D9': 'Pearce/Pearce/D9/CAP_PRC_D9_LowRes.fbx',
    'VZUS ballad': 'VZUS/VZUS/Ballad/CAP_VUS_Ballad_LowRes.fbx',
    'Fimbul BYOS Tankship': F + 'BYOS/Tankship/CDR_FBL_Tankship_LowRes.fbx',
    'Fimbul ECOS Treearrow': F + 'ECOS/Treearrow/CMD_FBL_Treearrow_LowRes.fbx',
    'Pearce C11': 'Pearce/Pearce/C11/CAP_PRC_C11_LowRes.fbx',
    'Busan The Last Stand mk. VIII': (None, 'no Last Stand model'),
    'Fimbul BYOS Gallowspine': (None, 'no Gallowspine model'),
    'Fimbul ECOS Superphoenix': F + 'ECOS/Superphoenix/TTN_Superphoenix_LowRes.fbx',
    'Pearce T1': 'Pearce/Pearce/T1/TTN_T1_LowRes.fbx',
    'Rainbow Phi': (None, 'no Phi model'),
}
for _i in range(6):
    TABLE['Starbase - Tier %d' % _i] = (None, 'starbase: no hull model by design')


def records():
    with open(DATA, encoding='utf-8') as f:
        return [s['name'] for s in json.load(f)['ships']]


def slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def source_of(name):
    v = TABLE[name]
    return v if isinstance(v, tuple) else (v, None)


def cmd_table():
    recs = records()
    bad = [r for r in recs if r not in TABLE] + [k for k in TABLE if k not in recs]
    if bad:
        print('TABLE MISMATCH vs records:', bad)
        return 2
    n = 0
    for r in recs:
        p, why = source_of(r)
        if p:
            ok = os.path.isfile(os.path.join(SRC, p))
            n += ok
            print('%-32s -> %s%s' % (r, p, '' if ok else '   !! FILE MISSING'))
        else:
            print('%-32s -> none, because %s' % (r, why))
    print('records', len(recs), 'with source', n)
    return 0


# ---------------------------------------------------------------- GLB parsing (independent of the exporter)
CT = {5120: ('b', 1), 5121: ('B', 1), 5122: ('h', 2), 5123: ('H', 2), 5125: ('I', 4), 5126: ('f', 4)}
NC = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}


def read_glb(path):
    with open(path, 'rb') as f:
        data = f.read()
    if len(data) < 20:
        raise ValueError('too short')
    magic, ver, length = struct.unpack_from('<4sII', data, 0)
    if magic != b'glTF' or ver != 2 or length != len(data):
        raise ValueError('bad glb header')
    cl, ct = struct.unpack_from('<I4s', data, 12)
    if ct != b'JSON':
        raise ValueError('first chunk not JSON')
    js = json.loads(data[20:20 + cl].decode('utf-8'))
    off = 20 + cl
    binb = b''
    if off < len(data):
        bl, bt = struct.unpack_from('<I4s', data, off)
        if bt == b'BIN\x00':
            binb = data[off + 8: off + 8 + bl]
    return js, binb


def accessor(js, binb, idx):
    a = js['accessors'][idx]
    bv = js['bufferViews'][a['bufferView']]
    fmt, sz = CT[a['componentType']]
    n = NC[a['type']]
    stride = bv.get('byteStride') or sz * n
    base = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
    out = []
    for i in range(a['count']):
        out.append(struct.unpack_from('<' + fmt * n, binb, base + i * stride))
    return out, a


def write_glb(path, js, binb):
    jb = json.dumps(js, separators=(',', ':')).encode('utf-8')
    jb += b' ' * ((4 - len(jb) % 4) % 4)
    binb = binb + b'\x00' * ((4 - len(binb) % 4) % 4)
    total = 12 + 8 + len(jb) + 8 + len(binb)
    with open(path, 'wb') as f:
        f.write(struct.pack('<4sII', b'glTF', 2, total))
        f.write(struct.pack('<I4s', len(jb), b'JSON') + jb)
        f.write(struct.pack('<I4s', len(binb), b'BIN\x00') + binb)


def glb_stats(path):
    """node names, tris, world bbox (assumes identity nodes; checked by --check) of POSITION data."""
    js, binb = read_glb(path)
    tris = 0
    mn = [1e30] * 3
    mx = [-1e30] * 3
    names = []
    per = {}
    for nd in js.get('nodes', []):
        if 'mesh' not in nd:
            continue
        names.append(nd.get('name'))
        t = 0
        for pr in js['meshes'][nd['mesh']]['primitives']:
            pos, a = accessor(js, binb, pr['attributes']['POSITION'])
            if a.get('normalized'):
                raise ValueError('normalized positions not supported in stats')
            pmn = a.get('min')
            pmx = a.get('max')
            for p in pos:
                for k in range(3):
                    mn[k] = min(mn[k], p[k])
                    mx[k] = max(mx[k], p[k])
            if 'indices' in pr:
                t += js['accessors'][pr['indices']]['count'] // 3
            else:
                t += a['count'] // 3
        tris += t
        per[nd.get('name')] = t
    return {'names': names, 'tris': tris, 'min': mn, 'max': mx, 'per': per}


def glb_bbox_and_tris(path):
    """like glb_stats but understands KHR_mesh_quantization: applies node TRS if present, dequantises."""
    js, binb = read_glb(path)
    tris = 0
    mn = [1e30] * 3
    mx = [-1e30] * 3
    # effective world scale/translation per node (TS only, rotation unsupported - exporter emits none)
    eff = {}

    def walk(i, ps, pt):
        n = js['nodes'][i]
        s = n.get('scale', [1, 1, 1])
        t = n.get('translation', [0, 0, 0])
        es = [ps[k] * s[k] for k in range(3)]
        et = [pt[k] + ps[k] * t[k] for k in range(3)]
        eff[i] = (es, et)
        for c in n.get('children', []):
            walk(c, es, et)

    for r in js['scenes'][js.get('scene', 0)]['nodes']:
        walk(r, [1, 1, 1], [0, 0, 0])
    for ni, nd in enumerate(js.get('nodes', [])):
        if 'mesh' not in nd:
            continue
        s, t = eff[ni]
        for pr in js['meshes'][nd['mesh']]['primitives']:
            pos, a = accessor(js, binb, pr['attributes']['POSITION'])
            norm = a.get('normalized')
            div = {5122: 32767.0, 5123: 65535.0, 5120: 127.0, 5121: 255.0}.get(a['componentType'], 1.0) if norm else 1.0
            for p in pos:
                for k in range(3):
                    v = p[k] / div * s[k] + t[k]
                    mn[k] = min(mn[k], v)
                    mx[k] = max(mx[k], v)
            if 'indices' in pr:
                tris += js['accessors'][pr['indices']]['count'] // 3
            else:
                tris += a['count'] // 3
    return tris, mn, mx


# ---------------------------------------------------------------- quantisation post-step (own code, no deps)
def quantise(src, dst):
    """positions -> int16 (non-normalised, in units of `step` via ONE uniform scale on a wrapper root node;
    mesh nodes stay identity), normals -> int8 normalised. Indices kept. KHR_mesh_quantization declared."""
    js, binb = read_glb(src)
    # global bbox of positions
    allp = []
    for nd in js['nodes']:
        if 'mesh' in nd:
            for pr in js['meshes'][nd['mesh']]['primitives']:
                pos, a = accessor(js, binb, pr['attributes']['POSITION'])
                allp.extend(pos)
    ext = max(max(abs(p[k]) for p in allp) for k in range(3))
    step = ext / 32000.0  # int16 units; hull is centred so range is symmetric
    newbin = bytearray()
    views, accs = [], []

    def add(raw, target, count, ctype, typ, extra=None):
        while len(newbin) % 4:
            newbin.append(0)
        views.append({'buffer': 0, 'byteOffset': len(newbin), 'byteLength': len(raw), 'target': target})
        newbin.extend(raw)
        a = {'bufferView': len(views) - 1, 'componentType': ctype, 'count': count, 'type': typ}
        if extra:
            a.update(extra)
        accs.append(a)
        return len(accs) - 1

    for m in js['meshes']:
        for pr in m['primitives']:
            pos, a = accessor(js, binb, pr['attributes']['POSITION'])
            q = [tuple(int(round(c / step)) for c in p) for p in pos]
            raw = b''.join(struct.pack('<hhh', *p) + b'\x00\x00' for p in q)  # pad to 8 bytes (4-byte aligned vec3 h)
            # glTF requires stride multiple of 4 for vertex attributes: 8 bytes stride
            while len(newbin) % 4:
                newbin.append(0)
            views.append({'buffer': 0, 'byteOffset': len(newbin), 'byteLength': len(raw), 'byteStride': 8, 'target': 34962})
            newbin.extend(raw)
            qmn = [min(p[k] for p in q) for k in range(3)]
            qmx = [max(p[k] for p in q) for k in range(3)]
            accs.append({'bufferView': len(views) - 1, 'componentType': 5122, 'count': len(q), 'type': 'VEC3',
                         'min': qmn, 'max': qmx})
            pa = len(accs) - 1
            attrs = {'POSITION': pa}
            if 'NORMAL' in pr['attributes']:
                nr, _ = accessor(js, binb, pr['attributes']['NORMAL'])
                rawn = b''
                for v in nr:
                    l = math.sqrt(sum(c * c for c in v)) or 1.0
                    rawn += struct.pack('<bbb', *[max(-127, min(127, int(round(c / l * 127)))) for c in v]) + b'\x00'
                while len(newbin) % 4:
                    newbin.append(0)
                views.append({'buffer': 0, 'byteOffset': len(newbin), 'byteLength': len(rawn), 'byteStride': 4, 'target': 34962})
                newbin.extend(rawn)
                accs.append({'bufferView': len(views) - 1, 'componentType': 5120, 'normalized': True,
                             'count': len(nr), 'type': 'VEC3'})
                attrs['NORMAL'] = len(accs) - 1
            idx, _ = accessor(js, binb, pr['indices'])
            ctype = 5123 if len(q) < 65536 else 5125
            fmt = '<H' if ctype == 5123 else '<I'
            rawi = b''.join(struct.pack(fmt, i[0]) for i in idx)
            while len(newbin) % 4:
                newbin.append(0)
            views.append({'buffer': 0, 'byteOffset': len(newbin), 'byteLength': len(rawi), 'target': 34963})
            newbin.extend(rawi)
            accs.append({'bufferView': len(views) - 1, 'componentType': ctype, 'count': len(idx), 'type': 'SCALAR'})
            pr['attributes'] = attrs
            pr['indices'] = len(accs) - 1
    js['bufferViews'] = views
    js['accessors'] = accs
    js['buffers'] = [{'byteLength': len(newbin)}]
    js['extensionsUsed'] = sorted(set(js.get('extensionsUsed', []) + ['KHR_mesh_quantization']))
    js['extensionsRequired'] = sorted(set(js.get('extensionsRequired', []) + ['KHR_mesh_quantization']))
    # wrapper root node carrying the uniform scale; mesh nodes remain identity beneath it
    root_children = js['scenes'][js.get('scene', 0)]['nodes']
    js['nodes'].append({'name': 'quantScale', 'scale': [step, step, step], 'children': list(root_children)})
    js['scenes'][js.get('scene', 0)]['nodes'] = [len(js['nodes']) - 1]
    write_glb(dst, js, bytes(newbin))
    return step


# ---------------------------------------------------------------- build
def stern_hint(path, names):
    """+x|-x|+z|-z from engine/thruster-named meshes (glTF Y-up); None if not derivable."""
    js, binb = read_glb(path)
    cx = cz = 0.0
    n = 0
    allp = []
    for nd in js['nodes']:
        if 'mesh' not in nd:
            continue
        nm = (nd.get('name') or '').lower()
        pos, a = accessor(js, binb, js['meshes'][nd['mesh']]['primitives'][0]['attributes']['POSITION'])
        if any(k in nm for k in ('engine', 'thruster', 'exhaust', 'nozzle')) and 'vfx_engine_flares' not in nm:
            for p in pos:
                cx += p[0]
                cz += p[2]
                n += 1
        else:
            allp.extend(pos)
    if not n:
        return None
    cx /= n
    cz /= n
    ex = max(p[0] for p in allp) - min(p[0] for p in allp)
    ez = max(p[2] for p in allp) - min(p[2] for p in allp)
    # dominant axis of the offset, relative to its extent; require a clear offset
    rx, rz = cx / (ex / 2 or 1), cz / (ez / 2 or 1)
    if max(abs(rx), abs(rz)) < 0.3:
        return None
    return ('+x' if rx > 0 else '-x') if abs(rx) >= abs(rz) else ('+z' if rz > 0 else '-z')


def run_blender(src, out, rep):
    cmd = [BLENDER, '-b', '-P', EXPORT, '--', src, out, rep]
    r = subprocess.run(cmd, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=240)
    return r.returncode, r.stdout.decode('utf-8', 'replace')


def atomic_json(path, obj):
    if not obj:
        raise SystemExit('refusing to write an empty manifest')
    tmp = path + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(obj, f, indent=1)
    os.replace(tmp, path)


def cmd_build(only):
    os.makedirs(OUT, exist_ok=True)
    tmpd = BUILD_TMP
    os.makedirs(tmpd, exist_ok=True)
    manifest = {}
    # always start from the existing manifest: a hull that fails to build keeps its old entry AND its old GLB.
    if os.path.isfile(MANIFEST):
        manifest = json.load(open(MANIFEST, encoding='utf-8'))
    failed = []
    recs = records()
    cache = {}  # source -> (file, tris, bytes, hint) so shared sources (Mamba) are exported once
    for name in records():
        if only and name != only:
            continue
        p, why = source_of(name)
        if not p:
            print('SKIP', name, '-', why)
            manifest.pop(name, None)  # deliberately unmapped: the only way an entry is removed
            continue
        if p in cache:
            fn, tris, size, hint = cache[p]
            ent = {'file': fn, 'tris': tris, 'bytes': size, 'source': 'RawAssets/ShipsModels/' + p}
            if hint:
                ent['sternHint'] = hint
            manifest[name] = ent
            print('SHARED', name, '->', fn)
            continue
        fn = slug(name) + '.glb'
        raw = os.path.join(tmpd, fn)
        rep = os.path.join(tmpd, slug(name) + '.json')
        try:
            rc, log = run_blender(os.path.join(SRC, p), raw, rep)
        except subprocess.TimeoutExpired:
            print('FAIL (timeout)', name)
            failed.append(name)
            continue
        if rc != 0 or not os.path.isfile(raw):
            print('FAIL', name, rc, log[-400:])
            failed.append(name)
            continue
        st = glb_stats(raw)
        hint = stern_hint(raw, st['names']) if 'mesh_vfx_engine_flares' not in st['names'] else None
        hint = {'Armstrong IMP Tip': '-x'}.get(name, hint)  # no engine meshes, square footprint: axis from its mirror test, sign checked by eye
        final = os.path.join(OUT, fn)
        size = os.path.getsize(raw)
        quant = False
        if size > 400 * 1024:
            q = os.path.join(tmpd, 'q_' + fn)
            quantise(raw, q)
            t0, mn0, mx0 = glb_bbox_and_tris(raw)
            t1, mn1, mx1 = glb_bbox_and_tris(q)
            d0 = [mx0[k] - mn0[k] for k in range(3)]
            d1 = [mx1[k] - mn1[k] for k in range(3)]
            err = max(abs(d1[k] - d0[k]) / d0[k] for k in range(3) if d0[k] > 0)
            if t0 != t1 or err > 0.005:
                print('QUANT PROOF FAILED', name, t0, t1, err)
                failed.append(name)
                continue
            shutil.copyfile(q, final)
            quant = True
            print('  quant tris %d==%d bbox err %.5f%%' % (t0, t1, err * 100))
        else:
            shutil.copyfile(raw, final)
        size = os.path.getsize(final)
        tris = st['tris']
        ent = {'file': fn, 'tris': tris, 'bytes': size, 'source': 'RawAssets/ShipsModels/' + p}
        if hint:
            ent['sternHint'] = hint
        manifest[name] = ent
        cache[p] = (fn, tris, size, hint)
        print('OK %-30s tris %6d bytes %8d quant=%s hint=%s' % (name, tris, size, quant, hint))
    for k in [k for k in manifest if k not in recs]:  # key no longer a ship record
        del manifest[k]
    atomic_json(MANIFEST, manifest)
    if not only:  # drop GLBs no manifest entry points at (a failed hull's old entry still points at its old GLB)
        keep = {e['file'] for e in manifest.values()}
        for fn in os.listdir(OUT):
            if fn.endswith('.glb') and fn not in keep:
                os.remove(os.path.join(OUT, fn))
                print('removed orphan', fn)
    print('manifest entries', len(manifest))
    # a rebuilt entry has no gun mounts until they are refitted to its new mesh
    if subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pack_hull_mounts.py'), '--build'], stdin=subprocess.DEVNULL).returncode:
        print('GUN MOUNTS FAILED: pack_hull_mounts.py --build')
        return 1
    if failed:
        print('BUILD FAILED for %d hull(s): %s' % (len(failed), failed))
        return 1
    return 0


# ---------------------------------------------------------------- acceptance
def check_glb(path, key, ent, recs, expect_names=None):
    errs = []
    if key not in recs:
        errs.append('key is not a record name')
    if not os.path.isfile(path):
        return errs + ['file missing']
    if ent and os.path.getsize(path) != ent.get('bytes'):
        errs.append('bytes mismatch')
    try:
        js, binb = read_glb(path)
    except Exception as e:
        return errs + ['bad glb: %s' % e]
    for k in ('images', 'textures', 'samplers', 'animations', 'skins'):
        if js.get(k):
            errs.append('has ' + k)
    tris = 0
    for m in js.get('meshes', []):
        for pr in m['primitives']:
            for a in pr['attributes']:
                if a.startswith('TEXCOORD') or a.startswith('TANGENT') or a.startswith('JOINTS') or a.startswith('WEIGHTS') or a.startswith('COLOR'):
                    errs.append('attribute ' + a)
            if 'POSITION' not in pr['attributes']:
                errs.append('no POSITION')
            if 'indices' in pr:
                tris += js['accessors'][pr['indices']]['count'] // 3
            else:
                tris += js['accessors'][pr['attributes']['POSITION']]['count'] // 3
    if tris <= 500:
        errs.append('tris %d <= 500' % tris)
    if ent and ent.get('tris') != tris:
        errs.append('manifest tris %s != %d' % (ent.get('tris'), tris))
    mesh_nodes = [n for n in js.get('nodes', []) if 'mesh' in n]
    for n in mesh_nodes:
        if any(k in n for k in ('translation', 'rotation', 'scale', 'matrix')):
            errs.append('mesh node %s not identity' % n.get('name'))
    names = [n.get('name') for n in mesh_nodes]
    if len(set(names)) != len(names):
        errs.append('duplicate node names')
    if any(nm is None for nm in names):
        errs.append('node without a name')
    if expect_names is not None and sorted(names) != sorted(expect_names):
        errs.append('node names differ from source report')
    if js.get('asset', {}).get('version') != '2.0':
        errs.append('asset version')
    return errs


def cmd_check():
    recs = records()
    man = json.load(open(MANIFEST, encoding='utf-8'))
    fails = 0
    sizes = []
    for key, ent in sorted(man.items()):
        reps = os.path.join(BUILD_TMP, slug(key) + '.json')
        exp = None
        if os.path.isfile(reps):
            exp = [k['name'] for k in json.load(open(reps, encoding='utf-8'))['kept']]
        errs = check_glb(os.path.join(OUT, ent['file']), key, ent, recs, exp)
        sizes.append(ent['bytes'])
        if errs:
            fails += 1
            print('FAIL', key, errs)
    print('checked', len(man), 'entries, failures', fails)
    if sizes:
        s = sorted(sizes)
        print('total MB %.2f median KB %.0f largest KB %.0f' % (sum(s) / 1e6, s[len(s) // 2] / 1e3, s[-1] / 1e3))
    # positive control: Guardian must be in the manifest and pass
    pos = 'Calico Guardian'
    pe = check_glb(os.path.join(OUT, man[pos]['file']), pos, man[pos], recs) if pos in man else ['absent']
    print('POSITIVE CONTROL Guardian:', 'PASS' if not pe else 'FAIL %s' % pe)
    # negative 1: texture injected
    guard = os.path.join(OUT, man[pos]['file'])
    js, binb = read_glb(guard)
    js['images'] = [{'uri': 'x.png'}]
    js['textures'] = [{'source': 0}]
    neg = os.path.join(SCRATCH, 'neg_texture.glb')
    write_glb(neg, js, binb)
    ne = check_glb(neg, pos, None, recs)
    print('NEGATIVE CONTROL texture injected:', 'FAILED AS REQUIRED %s' % ne if ne else 'DID NOT FAIL (BAD)')
    # negative 2: bad manifest key
    ne2 = check_glb(guard, 'Not A Ship', man[pos], recs)
    print('NEGATIVE CONTROL bad key:', 'FAILED AS REQUIRED %s' % ne2 if ne2 else 'DID NOT FAIL (BAD)')
    # negative 3: TEXCOORD injected
    js, binb = read_glb(guard)
    js['meshes'][0]['primitives'][0]['attributes']['TEXCOORD_0'] = 0
    neg3 = os.path.join(SCRATCH, 'neg_uv.glb')
    write_glb(neg3, js, binb)
    ne3 = check_glb(neg3, pos, None, recs)
    print('NEGATIVE CONTROL TEXCOORD injected:', 'FAILED AS REQUIRED %s' % ne3 if ne3 else 'DID NOT FAIL (BAD)')
    ok = (fails == 0 and not pe and ne and ne2 and ne3)
    print('CHECK', 'PASS' if ok else 'FAIL')
    return 0 if ok else 1


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--table', action='store_true')
    ap.add_argument('--build', action='store_true')
    ap.add_argument('--only')
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    if a.table:
        sys.exit(cmd_table())
    if a.build:
        sys.exit(cmd_build(a.only))
    elif a.check:
        sys.exit(cmd_check())
    else:
        ap.print_help()
