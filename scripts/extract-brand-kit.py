"""
Extracts the OFFICIAL Patel Bakery logo artwork (vector) from the brand-kit PDF.

    pip install pymupdf
    python3 scripts/extract-brand-kit.py [path/to/brandkit.pdf]

Default input: brand/PATEL_BAKERY_LOGO_DESIGN_BRANDKIT.pdf

Outputs (artwork is copied path-for-path from the PDF, only recoloured per brand colours):
  public/patel-bakery/logo/*.svg          ready-to-use logo files (emblem + full lock-up)
  src/brand/logoArt.generated.ts          path data for animating each part in the film
"""
import json
import os
import sys

import pymupdf as fitz

ROOT = os.path.join(os.path.dirname(__file__), '..')
PDF = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'brand', 'PATEL_BAKERY_LOGO_DESIGN_BRANDKIT.pdf')
LOGO_DIR = os.path.join(ROOT, 'public', 'patel-bakery', 'logo')
TS_OUT = os.path.join(ROOT, 'src', 'brand', 'logoArt.generated.ts')

GOLD = '#BA8954'
BROWN = '#522F14'
WHITE = '#FFFFFF'
CREAM = '#F4E9D8'

doc = fitz.open(PDF)
page = doc[0]
drawings = page.get_drawings()


def path_d(dr):
    """PyMuPDF drawing → SVG path data (absolute coords, PDF points)."""
    out = []
    last = None
    f = lambda p: f'{p.x:.3f} {p.y:.3f}'
    for it in dr['items']:
        op = it[0]
        if op == 'l':
            a, b = it[1], it[2]
            if last is None or abs(a.x - last.x) > 1e-3 or abs(a.y - last.y) > 1e-3:
                out.append('M' + f(a))
            out.append('L' + f(b))
            last = b
        elif op == 'c':
            a, c1, c2, b = it[1], it[2], it[3], it[4]
            if last is None or abs(a.x - last.x) > 1e-3 or abs(a.y - last.y) > 1e-3:
                out.append('M' + f(a))
            out.append(f'C{f(c1)} {f(c2)} {f(b)}')
            last = b
        elif op == 're':
            r = it[1]
            out.append(f'M{r.x0:.3f} {r.y0:.3f}H{r.x1:.3f}V{r.y1:.3f}H{r.x0:.3f}Z')
            last = None
        elif op == 'qu':
            q = it[1]
            out.append(f'M{f(q.ul)}L{f(q.ur)}L{f(q.lr)}L{f(q.ll)}Z')
            last = None
    if dr.get('closePath'):
        out.append('Z')
    return ''.join(out)


def find(pred):
    for dr in drawings:
        if pred(dr):
            return dr
    raise SystemExit('Expected artwork not found in PDF — has the brand kit layout changed?')


def near(dr, x0, y0, tol=3):
    r = dr['rect']
    return abs(r.x0 - x0) < tol and abs(r.y0 - y0) < tol and dr.get('fill') is not None


# ── Locate the artwork on the brand-kit page ───────────────────────────────
# Primary emblem (gold, top-left of the kit)
emblem = find(lambda d: near(d, 57.7, 58.0) and len(d['items']) > 100)
# Full lock-up (white, on the gold card): emblem, PATEL, rolling-pin banner, BAKERY & SWEETS, SINCE 1949
lock = {
    'emblem': find(lambda d: near(d, 55.6, 180.8)),
    'wordmark': find(lambda d: near(d, 35.4, 231.2)),
    'banner': find(lambda d: near(d, 44.4, 253.4)),
    'tagline': find(lambda d: near(d, 57.8, 255.7)),
    'since': find(lambda d: near(d, 67.8, 264.6)),
}


def bbox(drs, pad):
    x0 = min(d['rect'].x0 for d in drs) - pad
    y0 = min(d['rect'].y0 for d in drs) - pad
    x1 = max(d['rect'].x1 for d in drs) + pad
    y1 = max(d['rect'].y1 for d in drs) + pad
    return x0, y0, x1 - x0, y1 - y0


def fill_rule(dr):
    return 'evenodd' if dr.get('even_odd') else 'nonzero'


def svg(parts, color, pad=1.5, colors=None):
    x, y, w, h = bbox([p for _, p in parts], pad)
    body = '\n'.join(
        f'  <path id="{name}" fill="{(colors or {}).get(name, color)}" fill-rule="{fill_rule(dr)}" d="{path_d(dr)}"/>'
        for name, dr in parts
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x:.3f} {y:.3f} {w:.3f} {h:.3f}">\n'
        f'  <title>Patel Bakery &amp; Sweets</title>\n{body}\n</svg>\n'
    )


os.makedirs(LOGO_DIR, exist_ok=True)
lock_parts = list(lock.items())
files = {
    'emblem-gold.svg': svg([('emblem', emblem)], GOLD),
    'emblem-brown.svg': svg([('emblem', emblem)], BROWN),
    'emblem-white.svg': svg([('emblem', emblem)], WHITE),
    'logo-white.svg': svg(lock_parts, WHITE),
    'logo-cream.svg': svg(lock_parts, CREAM),
    'logo-gold.svg': svg(lock_parts, GOLD),
    'logo-brown.svg': svg(lock_parts, BROWN),
}
for name, content in files.items():
    with open(os.path.join(LOGO_DIR, name), 'w') as fh:
        fh.write(content)
    print('  ✓ public/patel-bakery/logo/' + name)

# ── Path data for the film (each part animatable on its own) ────────────────
ex, ey, ew, eh = bbox([emblem], 1.5)
lx, ly, lw, lh = bbox([d for _, d in lock_parts], 1.5)
data = {
    'emblem': {'viewBox': [ex, ey, ew, eh], 'd': path_d(emblem), 'fillRule': fill_rule(emblem)},
    'lockup': {
        'viewBox': [lx, ly, lw, lh],
        'parts': {
            name: {
                'd': path_d(dr),
                'fillRule': fill_rule(dr),
                'box': [dr['rect'].x0, dr['rect'].y0, dr['rect'].width, dr['rect'].height],
            }
            for name, dr in lock_parts
        },
    },
}
os.makedirs(os.path.dirname(TS_OUT), exist_ok=True)
with open(TS_OUT, 'w') as fh:
    fh.write('// AUTO-GENERATED by scripts/extract-brand-kit.py from the official brand-kit PDF.\n')
    fh.write('// Do not edit by hand — this is the Patel Bakery logo artwork, path for path.\n')
    fh.write('export const LOGO_ART = ' + json.dumps(data, indent=1) + ' as const;\n')
print('  ✓ src/brand/logoArt.generated.ts')
