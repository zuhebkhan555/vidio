# Patel Bakery — drop-in assets

Put real files here and they appear in the film automatically (the `npm run assets`
scan runs before every `studio` / `render`). Any image (`.jpg .png .webp .svg`) or video
(`.mp4 .webm .mov`) works. Use either `folder/anything.jpg` or `folder.jpg`.

| Folder | What goes in it | Used in |
|---|---|---|
| `logo/` | The **supplied brand-kit logo**, ideally `logo.svg` or a transparent `logo.png`. Shown exactly as supplied, never modified. | Logo reveal, pattern, final lock-up |
| `pattern/` | (Optional) the brand-kit repeating pattern as one seamless tile. If empty, the logo is tiled. | Opening, transitions, backgrounds |
| `fonts/` | The **ARKHIP** font file (`.otf` / `.ttf` / `.woff2`). `fonts/fallback/` holds the stand-in font; leave it. | All brand typography |
| `heritage/founder/` | Genuine photo of / related to Abdul Jabbar Khan | Heritage (0:12) |
| `heritage/second-generation/` | Genuine photo of / related to Shabbir Ahmed Khan | Heritage |
| `family/today/` | Photo of Asim Khan, Safi Khan and Zuheb Khan | Heritage |
| `products/<name>/` | One hero photo or short video clip per product: `khova-naan`, `coconut-naan`, `warky`, `biscuits`, `buns`, `rusks`, `cakes` | Products (0:32–0:47) |
| `bakery/` | Reserved for bakery interior / oven footage | — |
| `audio/` | Sound files named as in `src/config/audio.ts` (e.g. `music.mp3`, `logo-reveal.mp3`, `whoosh.mp3`) | Sound design |

Only use genuine photographs for heritage slots. Until a slot is filled, the film shows a
clearly-labelled placeholder (turn labels off with `showPlaceholderLabels` in `src/config/film.ts`).

Best results: product photos landscape, ≥ 2400 px wide, product on the right third, warm
light, dark background. For the vertical cut, keep the product near the upper centre.
