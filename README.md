# Patel Bakery & Sweets — 60-Second Brand Film

A cinematic 60-second intro film for Patel Bakery, built as a real **Remotion** project
(React, rendered frame-by-frame to MP4). Story: **Tradition → Craft → Taste → Generations**.

```bash
npm install
npm run studio          # live preview + timeline scrubbing in the browser
npm run render          # 1920×1080  → out/patel-bakery-intro-16x9.mp4
npm run render:vertical # 1080×1920  → out/patel-bakery-intro-9x16.mp4  (Reels / Shorts)
npm run render:square   # 1080×1080  → out/patel-bakery-intro-1x1.mp4
npm run render:all      # all three
npm run stills          # review stills for every beat → out/stills/
```

## Replacing placeholders (most important step)

The Brand Kit PDF, real logo, ARKHIP font and photos were **not** available when this was
built, so the film uses clearly-labelled placeholders. Drop real files into
`public/patel-bakery/` and re-render. Nothing else needs to change. See
[`public/patel-bakery/README.md`](public/patel-bakery/README.md) for the folder map.

1. **Logo** → `public/patel-bakery/logo/logo.svg` (or a transparent PNG). It replaces the
   placeholder emblem everywhere: logo reveal, repeating pattern and final lock-up. If
   the file already contains the "PATEL BAKERY" wordmark, set `logoIncludesWordmark: true`
   in `src/config/film.ts`.
2. **ARKHIP font** → `public/patel-bakery/fonts/Arkhip.otf` (any .otf/.ttf/.woff2). Brand
   kerning (-70 → `-0.07em`) is applied automatically once it's present.
3. **Pattern** (optional) → `public/patel-bakery/pattern/` as a seamless tile.
4. **Photos** → `heritage/founder/`, `heritage/second-generation/`, `family/today/`,
   `products/<product>/`. Short video clips work too.
5. **Audio** (optional upgrade): the film ships with an original score and sound effects
   (see *Sound* below). To use professional or licensed audio, drop a file with the same
   name (any of .wav/.mp3/.m4a) into `public/patel-bakery/audio/` and it replaces the
   bundled one.
6. When everything is in, set `showPlaceholderLabels: false` in `src/config/film.ts`.

## ⚠ Founding-date discrepancy (unresolved on purpose)

The business information says **1952**, but the supplied logo artwork reads **"SINCE 1949"**.
The film **does not** show a standalone date and never alters the logo artwork. If the
family confirms a year, set `foundingYear` and `showFoundingYear: true` in
`src/config/film.ts` (one place).

## Structure

```
src/
  PatelBakeryIntro60.tsx     main composition: scenes, pattern transitions, grain, audio
  Root.tsx                   16:9, 9:16 and 1:1 compositions
  config/
    brand.ts                 #522F14 / #BA8954 + tints, fonts, kerning
    film.ts                  fps, duration, scene timeline, copy, names, products, date
    audio.ts                 sound design cue sheet
  scenes/
    OpeningAtmosphere.tsx    0:00 darkness, pattern catching light, point of light
    PatelLogoReveal.tsx      0:05 line-drawn emblem, blur-to-sharp, light sweep, wordmark
    HeritageSequence.tsx     0:12 aged paper, layered prints, names along a gold thread
    CraftSequence.tsx        0:22 flour → dough → baking → fresh as one object
    ProductSequence.tsx      0:32 seven hero shots, iris / wipe / flash / pattern cuts
    FamilyLegacySequence.tsx 0:47 generations rise and converge into a line of light
    FinalBrandReveal.tsx     0:55 logo, PATEL BAKERY, "Tradition. Taste. Together.", hold
    PatternTransition.tsx    the brand-pattern wipe (the film's motion signature)
  components/                Emblem, PatternField, MediaSlot, ProductStandIn, Particles,
                             LightSweep, Texture (grain/paper/vignette), Type (kinetic type)
  motion/tokens.ts           shared easing curves (Framer Motion cubicBezier) + tween helpers
  hooks/useLayout.ts         orientation-aware sizing so scenes re-compose per aspect ratio
scripts/scan-assets.mjs      detects files dropped into public/patel-bakery
```

### Timing, duration, frame rate, resolution
- Scene start/end times: `TIMELINE` in `src/config/film.ts` (the film is built from it).
- Duration / fps: `FILM.durationInSeconds`, `FILM.fps` (default 60 s at 30 fps).
- Formats: `FORMATS` in the same file.

### Framer Motion
Remotion owns the clock, so every frame renders deterministically. Framer Motion supplies
the easing maths: `src/motion/tokens.ts` builds the house curves with `cubicBezier`, and
the raw curves (`CURVES.glide`, etc.) can be used as `transition={{ease: CURVES.glide}}` in
any Framer Motion web component, e.g. on the Patel Bakery website, so web and film motion match.

### Sound
The soundtrack is **original**. Every sound is synthesised by `scripts/generate-audio.py`
from sine waves and noise: no samples and no copyrighted music. It has:
- a 60-second score at 96 BPM in D major, with a tanpura-style drone, santoor-like plucks,
  warm pads and soft frame-drum percussion, following the film's sections;
- cue-timed effects: a riser into the logo bloom, the logo shimmer, paper, flour, dough,
  the oven door, crust crackle, whooshes on the pattern wipes, packaging and the final
  impact, plus an oven room tone.

Cue timings and volumes are in `src/config/audio.ts`. Regenerate the sounds with
`pip install numpy scipy && python3 scripts/generate-audio.py`.

### Fonts
Until ARKHIP is supplied, brand type uses **Oswald**, with **Cormorant Garamond** for story
lines. Both are SIL OFL-licensed and bundled in `public/patel-bakery/fonts/fallback/`.

### Rendering notes
Remotion downloads its own headless Chrome on the first render. To use an existing browser:
`REMOTION_BROWSER=/path/to/chrome npm run render`.
