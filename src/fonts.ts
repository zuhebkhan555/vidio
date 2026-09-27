import {continueRender, delayRender, staticFile} from 'remotion';
import {BRAND} from './config/brand';
import {ARKHIP_FONT} from './assets';

const FALLBACK_DIR = 'patel-bakery/fonts/fallback/';

const faces: Array<{family: string; file: string; weight: string; style?: string}> = [
  {family: BRAND.fonts.brandFallback, file: 'oswald-latin-300-normal.woff2', weight: '300'},
  {family: BRAND.fonts.brandFallback, file: 'oswald-latin-400-normal.woff2', weight: '400'},
  {family: BRAND.fonts.brandFallback, file: 'oswald-latin-500-normal.woff2', weight: '500'},
  {family: BRAND.fonts.brandFallback, file: 'oswald-latin-600-normal.woff2', weight: '600'},
  {family: BRAND.fonts.story, file: 'cormorant-garamond-latin-400-normal.woff2', weight: '400'},
  {family: BRAND.fonts.story, file: 'cormorant-garamond-latin-500-normal.woff2', weight: '500'},
  {family: BRAND.fonts.story, file: 'cormorant-garamond-latin-400-italic.woff2', weight: '400', style: 'italic'},
  {family: BRAND.fonts.story, file: 'cormorant-garamond-latin-500-italic.woff2', weight: '500', style: 'italic'},
];

export const HAS_ARKHIP = Boolean(ARKHIP_FONT);

/** CSS font stack for brand typography (ARKHIP first when supplied). */
export const BRAND_FONT = HAS_ARKHIP
  ? `"${BRAND.fonts.brand}", "${BRAND.fonts.brandFallback}", sans-serif`
  : `"${BRAND.fonts.brandFallback}", sans-serif`;

export const STORY_FONT = `"${BRAND.fonts.story}", Georgia, serif`;

/** Brand-kit kerning (-70) when ARKHIP is present, tuned value for the fallback face. */
export const BRAND_KERNING = HAS_ARKHIP ? BRAND.kerning.arkhip : BRAND.kerning.fallback;

let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading brand fonts');
  const all = faces.map(
    (f) => new FontFace(f.family, `url(${staticFile(FALLBACK_DIR + f.file)}) format('woff2')`, {
      weight: f.weight,
      style: f.style ?? 'normal',
    }),
  );
  if (ARKHIP_FONT) all.push(new FontFace(BRAND.fonts.brand, `url(${ARKHIP_FONT})`));
  Promise.all(all.map((f) => f.load().then((ff) => document.fonts.add(ff))))
    .catch((e) => console.error('Font load failed', e))
    .finally(() => continueRender(handle));
};
