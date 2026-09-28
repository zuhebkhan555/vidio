import {staticFile} from 'remotion';
import {AVAILABLE_ASSETS} from './assets.generated';

/**
 * ASSET SLOTS
 * A "slot" is a path under public/patel-bakery without extension, e.g. "products/khova-naan".
 * It resolves to either  public/patel-bakery/products/khova-naan.(jpg|png|webp|mp4…)
 *                    or  the first file inside public/patel-bakery/products/khova-naan/
 * If nothing is there, the resolver returns null and the film shows a marked placeholder.
 */
const BASE = 'patel-bakery/';
const IMAGE = /\.(png|jpe?g|webp|avif|gif|svg)$/i;
const VIDEO = /\.(mp4|webm|mov)$/i;
const FONT = /\.(woff2?|otf|ttf)$/i;

export type ResolvedAsset = {src: string; kind: 'image' | 'video'; path: string};

const stripExt = (p: string) => p.replace(/\.[^./]+$/, '');

const findAll = (slot: string, test: RegExp): string[] => {
  const key = BASE + slot;
  return AVAILABLE_ASSETS.filter(
    (p) => test.test(p) && (stripExt(p) === key || p.startsWith(key + '/')),
  );
};

export const resolveMedia = (slot: string): ResolvedAsset | null => {
  const match = findAll(slot, new RegExp(`${IMAGE.source}|${VIDEO.source}`, 'i'))[0];
  if (!match) return null;
  return {src: staticFile(match), kind: VIDEO.test(match) ? 'video' : 'image', path: match};
};

/** All media in a folder slot (e.g. several heritage photos). */
export const resolveMediaList = (slot: string): ResolvedAsset[] =>
  findAll(slot, new RegExp(`${IMAGE.source}|${VIDEO.source}`, 'i')).map((match) => ({
    src: staticFile(match),
    kind: VIDEO.test(match) ? 'video' : 'image',
    path: match,
  }));

const AUDIO = /\.(mp3|wav|m4a|aac|ogg)$/i;

/** Audio file by path without extension, e.g. "patel-bakery/audio/music" → any audio extension. */
export const resolveAudio = (stem: string): string | null => {
  const match = AVAILABLE_ASSETS.find((p) => AUDIO.test(p) && stripExt(p) === stem);
  return match ? staticFile(match) : null;
};

/** The supplied logo: public/patel-bakery/logo/logo.(svg|png|webp) or any image in logo/ */
export const LOGO = resolveMedia('logo/logo') ?? resolveMedia('logo');

/** Optional dedicated pattern tile from the brand kit: public/patel-bakery/pattern/… */
export const PATTERN_TILE = resolveMedia('pattern');

/** ARKHIP font file, if supplied. */
export const ARKHIP_FONT = (() => {
  const f = AVAILABLE_ASSETS.find((p) => p.startsWith(BASE + 'fonts/') && FONT.test(p));
  return f ? staticFile(f) : null;
})();

export const PLACEHOLDER_HINT = (slot: string) => `public/patel-bakery/${slot}/`;
