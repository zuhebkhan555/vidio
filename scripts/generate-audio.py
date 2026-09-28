"""
Generates ORIGINAL music + sound design for the Patel Bakery film (no samples, no
copyrighted material — every sound is synthesised here from sine waves and noise).

    pip install numpy scipy
    python3 scripts/generate-audio.py

Writes WAV files into public/patel-bakery/audio/ using the names in src/config/audio.ts.
Replace any of them with professionally produced / licensed audio at any time.

Score: 96 BPM (one bar = 2.5 s), D major with a tanpura-style drone and santoor-like
plucks for an Indian-heritage warmth. Sections follow src/config/film.ts TIMELINE.
"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'patel-bakery', 'audio')
rng = np.random.default_rng(1949)

BPM = 96
BEAT = 60 / BPM
BAR = BEAT * 4


# ─── helpers ─────────────────────────────────────────────────────────────────
def t_arr(dur):
    return np.arange(int(dur * SR)) / SR


def note(n):
    """MIDI note → Hz"""
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, 'low', fs=SR, output='sos'), x, axis=0)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, 'high', fs=SR, output='sos'), x, axis=0)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x, axis=0)


def env_adsr(n, a, d, s, r, total):
    """sample-count ADSR (seconds for a/d/r, s = sustain level)"""
    t = np.arange(n) / SR
    e = np.ones(n) * s
    e = np.where(t < a, t / max(a, 1e-4), e)
    dd = (t >= a) & (t < a + d)
    e[dd] = 1 - (1 - s) * (t[dd] - a) / max(d, 1e-4)
    rel = t > total - r
    e[rel] *= np.clip((total - t[rel]) / max(r, 1e-4), 0, 1)
    return e


def place(buf, sig, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def stereo(mono, pan=0.0, width=0.0):
    l = mono * np.sqrt((1 - pan) / 2) * 1.414
    r = mono * np.sqrt((1 + pan) / 2) * 1.414
    if width:
        d = int(width * SR)
        r = np.concatenate([np.zeros(d), r[:-d]]) if d else r
    return np.stack([l, r], axis=1)


def reverb(x, seconds=2.8, mix=0.3, tone=5000):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    decay = np.exp(-t * 6.9 / seconds)
    ir = np.stack([rng.standard_normal(n) * decay, rng.standard_normal(n) * decay], axis=1)
    ir = lp(ir, tone)
    ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))[:, None]
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    if x.ndim == 1:
        x = stereo(x)
    wet = np.stack([fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], axis=1)
    return x * (1 - mix) + wet * mix * 1.6


def normalize(x, peak=0.89):
    m = np.max(np.abs(x))
    return x if m == 0 else x * (peak / m)


def fade(x, fin=0.01, fout=0.05):
    n = len(x)
    a, b = int(fin * SR), int(fout * SR)
    e = np.ones(n)
    if a:
        e[:a] = np.linspace(0, 1, a)
    if b:
        e[-b:] = np.minimum(e[-b:], np.linspace(1, 0, b))
    return x * (e[:, None] if x.ndim == 2 else e)


def write(name, x):
    x = normalize(fade(x))
    if x.ndim == 1:
        x = stereo(x)
    os.makedirs(OUT, exist_ok=True)
    wavfile.write(os.path.join(OUT, name + '.wav'), SR, (x * 32767).astype(np.int16))
    print(f'  ✓ {name}.wav  ({len(x) / SR:.1f}s)')


# ─── instruments ─────────────────────────────────────────────────────────────
def santoor(freq, dur=2.2, vel=1.0):
    """Hammered-string pluck: slightly inharmonic partials, fast attack, doubled strings."""
    t = t_arr(dur)
    y = np.zeros_like(t)
    for k, amp in enumerate([1, 0.5, 0.32, 0.2, 0.12, 0.07], start=1):
        f = freq * k * (1 + 0.0007 * k * k)
        dec = 2.2 + k * 1.4
        for det in (-0.9, 0.9):  # doubled strings → gentle chorus
            y += amp * np.sin(2 * np.pi * (f + det * k * 0.25) * t) * np.exp(-t * dec)
    click = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 180) * 0.08
    a = np.minimum(1, t / 0.003)
    return (y * 0.25 + click) * a * vel


def pad(freqs, dur, bright=0.5):
    """Warm string/choir pad: detuned harmonic stacks, slow swell."""
    t = t_arr(dur)
    y = np.zeros_like(t)
    for f in freqs:
        for det in (-0.12, 0, 0.13):
            ff = f * 2 ** (det / 12)
            for k, amp in enumerate([1, 0.45 * bright + 0.1, 0.25 * bright, 0.12 * bright], start=1):
                y += amp * np.sin(2 * np.pi * ff * k * t + rng.random() * 6.28)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 0.2 * t)
    e = env_adsr(len(t), min(1.2, dur * 0.4), 0.5, 0.85, min(1.4, dur * 0.4), dur)
    return lp(y * vib * e, 1800 + 2600 * bright) / (len(freqs) * 4)


def drone(dur, root=50):
    """Tanpura-style drone: Sa–Pa with a slowly shimmering harmonic sweep (jawari)."""
    t = t_arr(dur)
    y = np.zeros_like(t)
    for base, amp in ((note(root - 12), 1.0), (note(root - 5), 0.6), (note(root), 0.5)):
        for k in range(1, 12):
            shimmer = 0.5 + 0.5 * np.sin(2 * np.pi * (0.11 + 0.017 * k) * t + k)
            y += amp * (1 / k) * shimmer * np.sin(2 * np.pi * base * k * t)
    return lp(y, 2400) * 0.12


def thump(freq=90, dur=0.5, vel=1.0):
    """Soft frame-drum / tabla bayan style low hit."""
    t = t_arr(dur)
    f = freq * (1 + 0.6 * np.exp(-t * 30))
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 9)
    skin = lp(rng.standard_normal(len(t)), 1200) * np.exp(-t * 40) * 0.3
    return (body + skin) * vel


def tick(dur=0.12, vel=0.3):
    t = t_arr(dur)
    return bp(rng.standard_normal(len(t)), 3000, 9000) * np.exp(-t * 60) * vel


def bell(freq, dur=4.0, vel=1.0):
    t = t_arr(dur)
    y = np.zeros_like(t)
    for ratio, amp, dec in ((1, 1, 1.2), (2.01, 0.45, 1.8), (2.76, 0.3, 2.6), (4.07, 0.18, 3.5), (5.4, 0.1, 5)):
        y += amp * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t * dec)
    return y * np.minimum(1, t / 0.004) * vel * 0.3


# ─── the score ───────────────────────────────────────────────────────────────
D = 62  # D4
# Chords (MIDI) — D, Bm, G, A, plus Gmaj7 / Em colour for the heritage section
CH = {
    'D': [50, 57, 62, 66],
    'Bm': [47, 54, 59, 62],
    'G': [43, 55, 59, 62],
    'A': [45, 57, 61, 64],
    'Em': [40, 55, 59, 64],
    'Gmaj7': [43, 54, 59, 62],
    'Dsus': [50, 57, 62, 64],
}
SCALE = [62, 64, 66, 69, 71, 74, 76, 78, 81]  # D major pentatonic-ish


def score():
    total = 62.0
    L = int(total * SR)
    pads = np.zeros(L)
    plucks = np.zeros((L, 2))
    perc = np.zeros((L, 2))
    fx = np.zeros(L)

    # Drone: whole film, swelling in from darkness
    dr = drone(total)
    dr *= np.clip(t_arr(total) / 4.0, 0, 1) ** 1.5
    dr *= np.where(t_arr(total) > 58.5, np.clip((61.5 - t_arr(total)) / 3, 0, 1), 1)

    # Chord plan: (start_s, dur_s, chord, brightness)
    plan = [
        (0.0, 5.0, 'Dsus', 0.15),
        (5.0, 2.5, 'D', 0.3), (7.5, 2.5, 'Bm', 0.35), (10.0, 2.0, 'G', 0.35),
        (12.0, 2.5, 'Gmaj7', 0.35), (14.5, 2.5, 'D', 0.35), (17.0, 2.5, 'Em', 0.35), (19.5, 2.5, 'A', 0.4),
        (22.0, 2.5, 'Bm', 0.4), (24.5, 2.5, 'G', 0.45), (27.0, 2.5, 'D', 0.5), (29.5, 2.5, 'A', 0.55),
        (32.0, 2.5, 'D', 0.6), (34.5, 2.5, 'Bm', 0.6), (37.0, 2.5, 'G', 0.6), (39.5, 2.5, 'A', 0.6),
        (42.0, 2.5, 'D', 0.65), (44.5, 2.5, 'A', 0.6),
        (47.0, 2.7, 'Bm', 0.35), (49.7, 2.7, 'G', 0.4), (52.4, 2.7, 'A', 0.55),
        (55.1, 7.0, 'D', 0.5),
    ]
    for start, dur, ch, br in plan:
        place(pads, pad([note(n) for n in CH[ch]], dur + 1.2, br), start)

    # Opening twinkles (sparse, high)
    for at, n in ((1.4, 81), (2.9, 78), (3.9, 74)):
        p = santoor(note(n), 3.0, 0.35)
        place(plucks, stereo(p, pan=rng.uniform(-0.6, 0.6)), at)

    # Logo motif: a rising 4-note figure landing on the reveal
    for i, n in enumerate([69, 71, 74, 78]):
        place(plucks, stereo(santoor(note(n), 3.0, 0.8), pan=-0.3 + i * 0.2), 5.3 + i * BEAT / 2)
    place(plucks, stereo(santoor(note(86), 4.0, 0.5), 0.2), 6.4)

    # Heritage: gentle arpeggios, quarter notes
    def arp(start, end, step, chords_at, vel=0.55, octave=12, pattern=(0, 1, 2, 3, 2, 1)):
        t = start
        i = 0
        while t < end - 0.05:
            ch = chords_at(t)
            n = CH[ch][1:][pattern[i % len(pattern)] % 3] + octave
            p = santoor(note(n), 2.0, vel * (0.85 + 0.15 * rng.random()))
            place(plucks, stereo(p, pan=np.sin(i * 0.9) * 0.45), t)
            t += step
            i += 1

    def chord_at(t):
        cur = plan[0][2]
        for s, _, c, _ in plan:
            if t >= s:
                cur = c
        return cur

    arp(12.0, 21.8, BEAT, chord_at, 0.5)
    # Craft: eighth notes, a soft heartbeat pulse
    arp(22.0, 31.8, BEAT / 2, chord_at, 0.45)
    for b in np.arange(22.0, 32.0, BEAT):
        place(perc, stereo(thump(70, 0.5, 0.55)), b)
    # Products: sixteenth shimmer + drum groove (dha … ta … dha dha ta)
    arp(32.0, 46.8, BEAT / 4, chord_at, 0.33, octave=24, pattern=(0, 1, 2, 1, 0, 2, 1, 2))
    groove = [(0, 95, 0.8), (1.5, 120, 0.4), (2, 95, 0.6), (2.75, 95, 0.45), (3, 140, 0.4)]
    for bar in np.arange(32.0, 47.0, BAR):
        for beat, f, v in groove:
            place(perc, stereo(thump(f, 0.45, v), pan=(f - 110) / 150), bar + beat * BEAT)
        for s in range(8):
            place(perc, stereo(tick(0.1, 0.12 + 0.08 * (s % 2 == 0)), pan=0.4), bar + s * BEAT / 2)
    # Family: strip back — slow, emotional melody
    melody = [(47.2, 74, 1.4), (48.6, 73, 0.8), (49.4, 71, 1.8), (51.3, 69, 1.2), (52.5, 71, 0.7), (53.2, 73, 0.6), (53.8, 76, 1.4)]
    for at, n, d in melody:
        place(plucks, stereo(santoor(note(n), 3.5, 0.75), 0.05), at)
        place(plucks, stereo(santoor(note(n - 12), 3.0, 0.3), -0.1), at + 0.02)
    # Final: resolve on D with a spread chord and bells
    for i, n in enumerate([62, 66, 69, 74, 78]):
        place(plucks, stereo(santoor(note(n), 5.0, 0.7), pan=-0.4 + i * 0.2), 55.1 + i * 0.07)
    place(fx, bell(note(86), 5.0, 0.8), 55.1)

    mix = stereo(pads * 1.0, 0, 0.011) + stereo(dr * 1.0, 0, 0.007) + plucks * 0.55 + perc * 0.5 + stereo(fx)
    mix = reverb(mix, 3.2, 0.32)
    # gentle master glue
    mix = np.tanh(mix * 1.4) / 1.4
    return mix[: int(60.0 * SR)]


# ─── sound effects ───────────────────────────────────────────────────────────
def noise(dur):
    return rng.standard_normal(int(dur * SR))


def sweep_bp(x, f0, f1, q=0.3, steps=60):
    """Band-pass with a moving centre frequency (piecewise)."""
    out = np.zeros_like(x)
    seg = len(x) // steps + 1
    for i in range(steps):
        a, b = i * seg, min(len(x), (i + 1) * seg + 2048)
        fc = f0 * (f1 / f0) ** (i / (steps - 1))
        lo, hi = max(40, fc * (1 - q)), min(SR / 2 - 100, fc * (1 + q))
        y = bp(x[a:b], lo, hi)
        w = np.ones(b - a)
        out[a:b] += y * w
    return out


def sfx_riser():
    d = 2.4
    t = t_arr(d)
    n = sweep_bp(noise(d), 300, 6000, 0.35) * (t / d) ** 2
    tone = np.sin(2 * np.pi * np.cumsum(110 * 2 ** (2 * t / d)) / SR) * (t / d) ** 3 * 0.2
    return reverb(stereo(n * 0.6 + tone, 0, 0.004), 2.0, 0.35)


def sfx_logo():
    d = 4.0
    t = t_arr(d)
    boom = np.sin(2 * np.pi * np.cumsum(55 * (1 + 0.5 * np.exp(-t * 8))) / SR) * np.exp(-t * 2.2)
    shimmer = sum(bell(note(n), d, 0.6) for n in (74, 81, 86))
    air = hp(noise(d), 6000) * np.exp(-t * 3) * 0.05
    return reverb(stereo(boom * 0.8 + shimmer + air, 0, 0.006), 3.5, 0.45)


def sfx_paper():
    d = 1.3
    x = np.zeros(int(d * SR))
    for _ in range(26):
        at = rng.uniform(0, d - 0.1)
        ln = rng.uniform(0.01, 0.06)
        b = hp(noise(ln), rng.uniform(1500, 4000)) * np.exp(-t_arr(ln) * rng.uniform(40, 120))
        place(x, b * rng.uniform(0.3, 1), at)
    return reverb(x * np.hanning(len(x)) ** 0.3, 0.8, 0.15)


def sfx_flour():
    d = 1.8
    t = t_arr(d)
    x = bp(noise(d), 800, 7000) * np.sin(np.pi * t / d) ** 2 * (0.6 + 0.4 * np.sin(2 * np.pi * 3 * t))
    return reverb(stereo(x * 0.4, 0, 0.01), 1.0, 0.25)


def sfx_dough():
    x = np.zeros(int(1.6 * SR))
    for i, at in enumerate((0.0, 0.45, 0.95)):
        tt = t_arr(0.35)
        hit = lp(noise(0.35), 500) * np.exp(-tt * 18) + np.sin(2 * np.pi * 75 * tt) * np.exp(-tt * 14) * 0.6
        place(x, hit * (1 - i * 0.15), at)
    return reverb(x, 0.6, 0.12)


def sfx_oven():
    d = 2.6
    t = t_arr(d)
    clunk = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * dec) for f, dec in ((180, 12), (433, 18), (711, 25), (1290, 30))) * 0.3
    swoosh = lp(noise(d), 700) * np.clip((t - 0.1) / 0.6, 0, 1) * np.exp(-np.clip(t - 0.8, 0, None) * 1.5) * 0.7
    hum = np.sin(2 * np.pi * 50 * t) * 0.08 * np.clip(t / 0.5, 0, 1)
    return reverb(stereo(clunk + swoosh + hum, 0, 0.005), 1.5, 0.25)


def sfx_crackle():
    d = 2.2
    x = np.zeros(int(d * SR))
    for _ in range(140):
        at = rng.uniform(0, d - 0.01)
        ln = rng.uniform(0.001, 0.006)
        place(x, hp(noise(ln), 2500) * rng.uniform(0.2, 1) ** 2, at)
    x *= np.sin(np.pi * t_arr(d) / d) ** 0.5
    return reverb(x, 0.5, 0.1)


def sfx_whoosh():
    d = 1.3
    t = t_arr(d)
    shape = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 3
    x = sweep_bp(noise(d), 250, 3500, 0.5) * shape
    pan = np.linspace(-0.8, 0.8, len(x))
    st = np.stack([x * np.sqrt((1 - pan) / 2), x * np.sqrt((1 + pan) / 2)], axis=1) * 1.4
    return reverb(st, 1.2, 0.25)


def sfx_packaging():
    d = 1.2
    x = np.zeros(int(d * SR))
    for _ in range(10):
        at = rng.uniform(0, 0.8)
        ln = rng.uniform(0.03, 0.12)
        place(x, bp(noise(ln), 300, 2500) * np.exp(-t_arr(ln) * 30), at)
    tt = t_arr(0.3)
    place(x, lp(noise(0.3), 300) * np.exp(-tt * 20) * 1.5, 0.85)
    return reverb(x, 0.5, 0.15)


def sfx_impact():
    d = 5.5
    t = t_arr(d)
    boom = np.sin(2 * np.pi * np.cumsum(42 * (1 + 0.8 * np.exp(-t * 10))) / SR) * np.exp(-t * 1.1)
    body = lp(noise(d), 180) * np.exp(-t * 4) * 0.8
    shimmer = hp(noise(d), 7000) * np.exp(-t * 1.6) * 0.04
    chord = sum(bell(note(n), d, 0.5) for n in (62, 69, 74, 78))
    return reverb(stereo(boom + body + shimmer + chord, 0, 0.007), 4.0, 0.4)


def sfx_room():
    d = 20.0  # looped by the film
    t = t_arr(d)
    brown = np.cumsum(noise(d))
    brown = hp(brown - np.mean(brown), 30)
    brown = lp(brown, 400)
    brown /= np.max(np.abs(brown))
    flame = bp(noise(d), 200, 1200) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.3 * t)) * 0.15
    x = brown * 0.8 + flame
    # seamless loop: crossfade tail into head
    xf = int(1.0 * SR)
    x[:xf] = x[:xf] * np.linspace(0, 1, xf) + x[-xf:] * np.linspace(1, 0, xf)
    return stereo(x[:-xf], 0, 0.013)


if __name__ == '__main__':
    print('Generating original Patel Bakery soundtrack…')
    write('music', score())
    write('oven-ambience', sfx_room())
    write('logo-riser', sfx_riser())
    write('logo-reveal', sfx_logo())
    write('paper', sfx_paper())
    write('flour', sfx_flour())
    write('dough', sfx_dough())
    write('oven-door', sfx_oven())
    write('crust-crackle', sfx_crackle())
    write('whoosh', sfx_whoosh())
    write('packaging', sfx_packaging())
    write('final-impact', sfx_impact())
    print('Done →', os.path.abspath(OUT))
