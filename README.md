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

## Official brand assets (in use)

The film uses the **official Patel Bakery logo** from the brand kit
(`brand/PATEL_BAKERY_LOGO_DESIGN_BRANDKIT.pdf`). The logo vectors are extracted
path-for-path by `scripts/extract-brand-kit.py` (`npm run brand`) into:

- `public/patel-bakery/logo/*.svg`: ready-to-use logo files (full lock-up and emblem,
  in white, cream, gold and brown)
- `src/brand/logoArt.generated.ts`: the same paths, so the film can animate each part
  (emblem trace, PATEL, rolling-pin banner, BAKERY & SWEETS, SINCE 1949)

The repeating logo pattern is built from the official emblem, as shown in the kit.

## Still to supply

Drop real files into `public/patel-bakery/` and re-render. Nothing else needs to change.
See [`public/patel-bakery/README.md`](public/patel-bakery/README.md) for the folder map.

1. **ARKHIP font** → `public/patel-bakery/fonts/Arkhip.otf` (any .otf/.ttf/.woff2). It's
   not included in the brand kit; until it arrives, supporting text uses **Montserrat**,
   the face used in the kit document. The logo wordmark is always the official outline.
2. **Photos** → `heritage/founder/`, `heritage/second-generation/`, `family/today/`,
   `products/<product>/`. Short video clips work too.
3. **Audio** (optional upgrade): the film ships with an original score and sound effects
   (see *Sound* below). To use professional or licensed audio, drop a file with the same
   name (any of .wav/.mp3/.m4a) into `public/patel-bakery/audio/` and it replaces the
   bundled one.
4. When everything is in, set `showPlaceholderLabels: false` in `src/config/film.ts`.

## ⚠ Founding date

The official logo reads **"SINCE 1949"** and is shown exactly as supplied. Earlier business
information said **1952**. That's unresolved, so the film adds no separate date of its
own. If a different year is confirmed, set `foundingYear` / `showFoundingYear` in
`src/config/film.ts`.

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
    PatelLogoReveal.tsx      0:05 official emblem traced → full lock-up assembles
    HeritageSequence.tsx     0:12 aged paper, layered prints, names along a gold thread
    CraftSequence.tsx        0:22 flour → dough → baking → fresh as one object
    ProductSequence.tsx      0:32 seven hero shots, iris / wipe / flash / pattern cuts
    FamilyLegacySequence.tsx 0:47 generations rise and converge into a line of light
    FinalBrandReveal.tsx     0:55 logo, PATEL BAKERY, "Tradition. Taste. Together.", hold
    PatternTransition.tsx    the brand-pattern wipe (the film's motion signature)
  brand/Logo.tsx             official logo (emblem + lock-up), each part animatable
  components/                PatternField, MediaSlot, ProductStandIn, Particles,
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
Until ARKHIP is supplied, supporting type uses **Montserrat**, with **Cormorant Garamond**
for story lines. Both are SIL OFL-licensed and bundled in `public/patel-bakery/fonts/fallback/`.

### Rendering notes
Remotion downloads its own headless Chrome on the first render. To use an existing browser:
`REMOTION_BROWSER=/path/to/chrome npm run render`.
