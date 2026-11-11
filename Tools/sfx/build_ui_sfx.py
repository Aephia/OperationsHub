"""Interface sounds for the explorers (SFX/ui/*.wav): generate takes with the ElevenLabs Sound Effects API, then
pick, trim, band-limit, level and measure them offline.

    python -I Tools/sfx/build_ui_sfx.py synth <scratch dir>            # take 0 of each sound, made here, no service
    python -I Tools/sfx/build_ui_sfx.py generate <scratch dir> [--only NAME] [--takes N]
    python -I Tools/sfx/build_ui_sfx.py build <scratch dir>            # writes SFX/ui/<name>.wav + SFX/ui/report.json
    python -I Tools/sfx/build_ui_sfx.py measure <wav> [<wav> ...]

The key is read from the environment (ELEVENLABS_API_KEY, or the Windows user environment) and is never written
anywhere. Raw takes stay in the scratch directory, never in the repo.

Nobody hears anything in this script: every choice is made from measurements and by a stated rule, and the result
still needs a human ear. Rules:
  * a take is judged on what would ship (band-limited and cut to length); it is DEAD when it is too quiet or its
    spectral centroid is outside 250-2600 Hz (above that a click reads as shrill; prompts
    asking for a treatment, like "soft" or "low", can come back as sub-bass or silence);
  * among live takes the one whose centroid is nearest the sound's target is used;
  * every sound is cut to a maximum length, so a click can never ring on;
  * every file is levelled to the same A-weighted loudness; how loud each plays is set in SFX/ui-sfx.js.
"""
import json, os, sys, time, urllib.request, urllib.error, wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "SFX" / "ui"
API = "https://api.elevenlabs.io/v1/sound-generation"
RATE = 44100
LEVEL = 0.09        # A-weighted RMS every shipped file is levelled to (heard loudness)
PEAK = 0.7          # and no sample may exceed this
HP, LP = 150.0, 3200.0   # band kept: no rumble below; full to 3.2 kHz, fading to nothing at 6.4 kHz (bright clicks grate)

# name -> prompt (CONTENT, never treatment), seconds asked for, target centroid Hz, maximum shipped seconds
SOUNDS = {
    "tap":   ("single short user interface click, clean futuristic touchscreen button tick, dry, no reverb, no music", 0.5, 1800, 0.12),
    "tab":   ("short two-tone user interface blip for switching between panels, futuristic holographic display, dry, no music", 0.5, 1600, 0.20),
    # takes 1-3 asked for an "airy swish" and all came back shrill (centroid 2.6-3.2 kHz after shaping): ask for the tone
    "open":  ("short rising tonal sweep of a holographic interface panel powering up, smooth synthesizer tone gliding upward, futuristic computer, no music", 0.6, 1400, 0.38),
    "close": ("short futuristic interface panel sliding shut, quick airy swish with a gentle falling tone, holographic display, no music", 0.6, 1100, 0.34),
    "done":  ("gentle two-note confirmation chime, futuristic spaceship computer, warm and pleasant, short, no music, no voice", 1.0, 1300, 0.85),
}


def key():
    k = os.environ.get("ELEVENLABS_API_KEY")
    if os.name == "nt":
        # the saved user value wins: a shell opened before the key was changed still carries the old one
        import winreg
        try:
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment") as r:
                k = winreg.QueryValueEx(r, "ELEVENLABS_API_KEY")[0] or k
        except OSError:
            pass
    if not k:
        sys.exit("ELEVENLABS_API_KEY is not set (user environment; never in the repo)")
    return k


def call(prompt, seconds):
    body = json.dumps({"text": prompt, "duration_seconds": seconds, "prompt_influence": 0.6}).encode()
    req = urllib.request.Request(API + "?output_format=pcm_44100", data=body, method="POST", headers={"xi-api-key": key(), "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def write_wav(path, samples, channels=1):
    """samples: float array in -1..1 (mono), or raw int16 bytes when `samples` is bytes."""
    data = samples if isinstance(samples, (bytes, bytearray)) else (np.clip(samples, -1, 1) * 32767).astype("<i2").tobytes()
    tmp = Path(str(path) + ".tmp")
    with wave.open(str(tmp), "wb") as w:
        w.setnchannels(channels); w.setsampwidth(2); w.setframerate(RATE); w.writeframes(data)
    os.replace(tmp, path)


def read_mono(path):
    with wave.open(str(path), "rb") as w:
        ch, rate, n = w.getnchannels(), w.getframerate(), w.getnframes()
        if w.getsampwidth() != 2 or rate != RATE:
            sys.exit("%s: expected 16-bit %d Hz" % (path, RATE))
        x = np.frombuffer(w.readframes(n), dtype="<i2").astype(np.float64) / 32768.0
    return x.reshape(-1, ch).mean(axis=1) if ch > 1 else x


def a_weight(freq):
    f2 = np.maximum(freq, 1e-9) ** 2
    ra = (12194.0 ** 2 * f2 ** 2) / ((f2 + 20.6 ** 2) * np.sqrt((f2 + 107.7 ** 2) * (f2 + 737.9 ** 2)) * (f2 + 12194.0 ** 2))
    return ra / 0.7943282347   # 1.0 at 1 kHz


def stats(x):
    """peak, RMS, A-weighted RMS, spectral centroid (Hz), share of energy under 150 Hz, seconds."""
    if not len(x) or not np.any(x):
        return {"peak": 0.0, "rms": 0.0, "a_rms": 0.0, "centroid": 0.0, "sub150": 0.0, "seconds": round(len(x) / RATE, 3)}
    spec = np.fft.rfft(x)
    freq = np.fft.rfftfreq(len(x), 1.0 / RATE)
    power = np.abs(spec) ** 2
    xa = np.fft.irfft(spec * a_weight(freq), len(x))
    return {"peak": round(float(np.max(np.abs(x))), 4), "rms": round(float(np.sqrt(np.mean(x ** 2))), 4), "a_rms": round(float(np.sqrt(np.mean(xa ** 2))), 4),
            "centroid": round(float(np.sum(freq * power) / np.sum(power)), 1), "sub150": round(float(np.sum(power[freq < 150]) / np.sum(power)), 4), "seconds": round(len(x) / RATE, 3)}


def band(x):
    spec = np.fft.rfft(x)
    freq = np.fft.rfftfreq(len(x), 1.0 / RATE)
    # gentle slopes (one octave) so the edges do not ring
    gain = np.clip((freq - HP / 2) / (HP / 2), 0, 1) * np.clip((2 * LP - freq) / LP, 0, 1)
    return np.fft.irfft(spec * gain, len(x))


def sounding(x):
    """the part from the first to the last sample within 40 dB of the take's own peak"""
    p = np.max(np.abs(x)) if len(x) else 0
    if p <= 0:
        return x[:0]
    idx = np.nonzero(np.abs(x) > p * 0.01)[0]
    return x[max(0, idx[0] - int(0.002 * RATE)): idx[-1] + 1]


def shape(x, max_seconds):
    x = sounding(band(x))[: int(max_seconds * RATE)]
    if not len(x):
        return x
    fin, fout = int(0.002 * RATE), min(len(x) // 2, int(max(0.03, 0.35 * max_seconds) * RATE))
    x = x.copy()
    x[:fin] *= np.linspace(0, 1, fin)
    x[-fout:] *= np.linspace(1, 0, fout) ** 2
    # level by how loud it is heard (A-weighted), not by its peak: a sustained tone at the same peak is far louder
    a = stats(x)["a_rms"]
    if a <= 0:
        return x
    x = x * (LEVEL / a)
    p = np.max(np.abs(x))
    return x * (PEAK / p) if p > PEAK else x


def cmd_generate(scratch, only, takes):
    d = Path(scratch) / "takes"
    d.mkdir(parents=True, exist_ok=True)
    for name, (prompt, seconds, _, _) in SOUNDS.items():
        if only and name != only:
            continue
        for i in range(1, takes + 1):
            p = d / ("%s_%d.wav" % (name, i))
            if p.exists():
                print("have ", p.name); continue
            try:
                pcm = call(prompt, seconds)
            except urllib.error.HTTPError as e:
                sys.exit("ElevenLabs HTTP %d for %s: %s" % (e.code, name, e.read()[:200].decode("utf-8", "replace")))
            write_wav(p, pcm, channels=2)   # the pcm_44100 stream is interleaved stereo
            print("wrote", p.name, stats(read_mono(p)))
            time.sleep(0.5)


def cmd_synth(scratch):
    """Take 0 of every sound, synthesised here (no service, same every run): damped tones and shaped noise.
    They go through the same build step as generated takes."""
    d = Path(scratch) / "takes"
    d.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(20261110)
    t = lambda sec: np.arange(int(sec * RATE)) / RATE
    tone = lambda f, tt, decay: np.sin(2 * np.pi * f * tt) * np.exp(-tt / decay)
    def glide(f0, f1, sec):
        tt = t(sec)
        return np.sin(2 * np.pi * np.cumsum(f0 * (f1 / f0) ** (tt / sec)) / RATE), tt
    def at(x, sec, total):
        out = np.zeros(int(total * RATE)); i = int(sec * RATE); out[i:i + len(x)] += x[: len(out) - i]; return out
    def air(sec, f0, f1):   # noise swept through a moving band: an airy swish
        n = rng.standard_normal(int(sec * RATE)); tt = t(sec); out = np.zeros_like(n); hop = 256
        for i in range(0, len(n) - hop, hop // 2):
            seg = n[i:i + hop] * np.hanning(hop); fc = f0 * (f1 / f0) ** (tt[i] / sec)
            spec = np.fft.rfft(seg); fr = np.fft.rfftfreq(hop, 1.0 / RATE)
            out[i:i + hop] += np.fft.irfft(spec * np.exp(-0.5 * ((fr - fc) / (0.35 * fc)) ** 2), hop)
        return out * np.sin(np.pi * tt / sec) ** 1.5

    tt = t(0.09)
    tap = tone(1900, tt, 0.012) + 0.35 * tone(3800, tt, 0.005) + 0.5 * rng.standard_normal(len(tt)) * np.exp(-tt / 0.0015)
    a = tone(1320, t(0.07), 0.022); b = tone(1760, t(0.11), 0.03)
    tab = at(a, 0, 0.2) + 0.9 * at(b, 0.055, 0.2)
    g, gt = glide(520, 1150, 0.3)
    opn = 0.55 * g * np.sin(np.pi * gt / 0.3) ** 2 + 0.9 * air(0.3, 900, 3200)
    g, gt = glide(1050, 430, 0.27)
    cls = 0.55 * g * np.sin(np.pi * gt / 0.27) ** 2 + 0.9 * air(0.27, 3000, 800)
    bell = lambda f, sec: (tone(f, t(sec), 0.16) + 0.3 * tone(2 * f, t(sec), 0.07) + 0.12 * tone(3.01 * f, t(sec), 0.04)) * np.minimum(1, t(sec) / 0.004)
    done = at(bell(659.26, 0.6), 0, 0.85) + 0.9 * at(bell(987.77, 0.7), 0.13, 0.85)
    for name, x in [("tap", tap), ("tab", tab), ("open", opn), ("close", cls), ("done", done)]:
        x = x / np.max(np.abs(x)) * 0.8
        write_wav(d / (name + "_0.wav"), x)
        print("wrote", name + "_0.wav", stats(x))


def cmd_build(scratch):
    d = Path(scratch) / "takes"
    OUT.mkdir(parents=True, exist_ok=True)
    report = {}
    for name, (_, _, target, max_seconds) in SOUNDS.items():
        rows = []
        for p in sorted(d.glob(name + "_*.wav")):
            raw = read_mono(p)
            # judged on what would SHIP (band-limited, cut to the maximum length), not on the whole take
            quiet = stats(sounding(band(raw)))["a_rms"] < 0.004
            s = stats(shape(raw, max_seconds))
            dead = quiet or not (250 <= s["centroid"] <= 2600) or s["seconds"] < 0.03

            rows.append({"take": p.name, "dead": bool(dead), "distance": abs(s["centroid"] - target), **s})
        # a generated take is preferred; the synthesised one (take 0) is used only when no generated take is live
        live = sorted([r for r in rows if not r["dead"]], key=lambda r: (r["take"].endswith("_0.wav"), r["distance"], r["take"]))
        if not live:
            sys.exit("%s: no live take among %d - generate more (see the table: %s)" % (name, len(rows), json.dumps(rows)))
        pick = live[0]
        y = shape(read_mono(d / pick["take"]), max_seconds)
        write_wav(OUT / (name + ".wav"), y)
        final = stats(read_mono(OUT / (name + ".wav")))
        report[name] = {"picked": pick["take"], "rule": "live take with centroid nearest %d Hz" % target, "takes": rows, "shipped": final, "max_seconds": max_seconds}
        print("%-6s %-12s %s" % (name, pick["take"], final))
    tmp = OUT / "report.json.tmp"
    tmp.write_text(json.dumps(report, indent=1), encoding="utf-8")
    os.replace(tmp, OUT / "report.json")


def main():
    a = sys.argv[1:]
    if len(a) >= 2 and a[0] == "generate":
        only = a[a.index("--only") + 1] if "--only" in a else None
        takes = int(a[a.index("--takes") + 1]) if "--takes" in a else 3
        cmd_generate(a[1], only, takes)
    elif len(a) == 2 and a[0] == "synth":
        cmd_synth(a[1])
    elif len(a) == 2 and a[0] == "build":
        cmd_build(a[1])
    elif len(a) >= 2 and a[0] == "measure":
        for p in a[1:]:
            print(Path(p).name, stats(read_mono(p)))
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
