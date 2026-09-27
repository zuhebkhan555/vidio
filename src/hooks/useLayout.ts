import {useVideoConfig} from 'remotion';

export type Orientation = 'landscape' | 'portrait' | 'square';

/**
 * Responsive layout helper so every scene re-composes (not crops) for 16:9, 9:16 and 1:1.
 * `u` is one design unit = 1/1080 of the short edge, so sizes stay proportional.
 */
export const useLayout = () => {
  const {width, height} = useVideoConfig();
  const ratio = width / height;
  const orientation: Orientation = ratio > 1.2 ? 'landscape' : ratio < 0.83 ? 'portrait' : 'square';
  const short = Math.min(width, height);
  const u = short / 1080;
  return {
    width,
    height,
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    isSquare: orientation === 'square',
    u,
    /** pixel size from design units */
    px: (n: number) => n * u,
  };
};
