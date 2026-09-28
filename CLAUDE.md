# Patel Bakery & Sweets: project rules

## Standing instructions from the owner (apply to every task)

1. **Always save work to GitHub when a task is finished.** Commit with a clear message
   and push the working branch at the end of every request. Never leave finished work
   only in the container.
2. **Always use the official Patel Bakery logo** from the brand kit in anything made for
   Patel Bakery (videos, websites, POS, shop, print, social). Never redraw, trace,
   substitute or "improve" it, and never use a placeholder logo.
3. After finishing, share a sample (a rendered video, screenshot or preview) with the owner.

## Brand source of truth

- Brand kit PDF: `brand/PATEL_BAKERY_LOGO_DESIGN_BRANDKIT.pdf` (designed by Dawood Omer)
- Official logo files (vector, extracted path-for-path from the PDF):
  `public/patel-bakery/logo/`
  - `logo-white.svg`, `logo-cream.svg`, `logo-gold.svg`, `logo-brown.svg`: full lock-up
    (emblem, PATEL, rolling-pin banner "BAKERY & SWEETS", SINCE 1949)
  - `emblem-gold.svg`, `emblem-brown.svg`, `emblem-white.svg`: emblem only
  - Regenerate: `pip install pymupdf && python3 scripts/extract-brand-kit.py`
- Colours: brown `#522F14`, gold `#BA8954` (cream `#F4E9D8` only for contrast)
- Typeface: ARKHIP (lowercase), kerning -70. The font file isn't in the kit;
  Montserrat (used in the kit document) is the stand-in until ARKHIP is supplied.
- Logo pattern: the emblem repeated on a regular grid, in gold on brown.
- Use the white or cream lock-up on brown and gold backgrounds, and the brown lock-up
  on light backgrounds. Keep the artwork's proportions, and don't add effects to it.
- Date: the logo reads "SINCE 1949". Earlier business info said 1952, and this is
  unresolved. Don't add a separate founding date anywhere; the logo's own artwork
  stays as supplied.

## This repo (Remotion brand film)

- `npm run studio`: preview. `npm run render:all`: 16:9, 9:16 and 1:1 MP4s into `out/`
- Official logo in the film: `src/brand/Logo.tsx`, using `src/brand/logoArt.generated.ts`
- Config: `src/config/film.ts` (timing, copy, products), `src/config/brand.ts`,
  `src/config/audio.ts`
- Before pushing: `npm run typecheck`
