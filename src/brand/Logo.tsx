import React, {useId} from 'react';
import {LOGO_ART} from './logoArt.generated';
import {BRAND} from '../config/brand';
import {clamp01} from '../motion/tokens';

/**
 * OFFICIAL PATEL BAKERY LOGO — path data extracted from the brand-kit PDF
 * (brand/PATEL_BAKERY_LOGO_DESIGN_BRANDKIT.pdf, via scripts/extract-brand-kit.py).
 * The artwork itself is never altered; only its colour (brand colours) and the way it
 * is revealed are animated.
 */

const E = LOGO_ART.emblem;
const L = LOGO_ART.lockup;
const vb = (v: readonly number[]) => v.map((n) => n.toFixed(3)).join(' ');

export const EMBLEM_RATIO = E.viewBox[2] / E.viewBox[3];
export const LOCKUP_RATIO = L.viewBox[2] / L.viewBox[3];

/** Static-file versions of the logo (used as CSS masks for light sweeps). */
export const LOGO_FILES = {
  emblemWhite: 'patel-bakery/logo/emblem-white.svg',
  lockupWhite: 'patel-bakery/logo/logo-white.svg',
};

/** Emblem only (chef toque, ring, wheat). `draw` traces the outline, `fill` solidifies it. */
export const EmblemArt: React.FC<{
  width: number;
  color?: string;
  draw?: number;
  fill?: number;
  strokeWidth?: number;
}> = ({width, color = BRAND.colors.gold, draw = 1, fill = 1, strokeWidth = 0.45}) => (
  <svg viewBox={vb(E.viewBox)} width={width} height={width / EMBLEM_RATIO} style={{overflow: 'visible', display: 'block'}}>
    <path
      d={E.d}
      fillRule={E.fillRule}
      fill={color}
      fillOpacity={clamp01(fill)}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeOpacity={draw >= 1 && fill >= 1 ? 0 : 1}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - clamp01(draw)}
    />
  </svg>
);

/** Emblem as raw SVG content for use inside other SVGs (e.g. the pattern). */
export const EmblemPath: React.FC<{x: number; y: number; size: number; color: string}> = ({x, y, size, color}) => {
  const s = size / Math.max(E.viewBox[2], E.viewBox[3]);
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-E.viewBox[0] - E.viewBox[2] / 2} ${-E.viewBox[1] - E.viewBox[3] / 2})`}>
      <path d={E.d} fillRule={E.fillRule} fill={color} />
    </g>
  );
};

export type LockupProgress = {
  emblemDraw?: number;
  emblemFill?: number;
  /** PATEL rises out of a mask */
  wordmark?: number;
  /** rolling-pin banner unrolls from its centre */
  banner?: number;
  /** BAKERY & SWEETS */
  tagline?: number;
  /** SINCE 1949 */
  since?: number;
};

const ALL_DONE: Required<LockupProgress> = {emblemDraw: 1, emblemFill: 1, wordmark: 1, banner: 1, tagline: 1, since: 1};

/**
 * Full lock-up: emblem · PATEL · rolling-pin banner "BAKERY & SWEETS" · SINCE 1949.
 * Each part can be revealed independently with `progress`.
 */
export const LogoLockup: React.FC<{
  width: number;
  color?: string;
  emblemColor?: string;
  progress?: LockupProgress;
  style?: React.CSSProperties;
}> = ({width, color = BRAND.colors.cream, emblemColor, progress, style}) => {
  const id = useId().replace(/:/g, '');
  const p = {...ALL_DONE, ...progress};
  const P = L.parts;
  const wm = P.wordmark.box;
  const tg = P.tagline.box;
  const wmP = clamp01(p.wordmark);
  const tgP = clamp01(p.tagline);
  const ec = emblemColor ?? color;

  const partStyle = (x: number, y: number, w: number, h: number, t: string): React.CSSProperties => ({
    transformOrigin: `${x + w / 2}px ${y + h / 2}px`,
    transform: t,
  });

  return (
    <svg viewBox={vb(L.viewBox)} width={width} height={width / LOCKUP_RATIO} style={{overflow: 'visible', display: 'block', ...style}}>
      <defs>
        <clipPath id={`wm-${id}`}>
          <rect x={wm[0] - 2} y={wm[1] - 1} width={wm[2] + 4} height={wm[3] + 2} />
        </clipPath>
        <clipPath id={`tg-${id}`}>
          <rect x={tg[0] + (tg[2] / 2) * (1 - tgP)} y={tg[1] - 2} width={tg[2] * tgP} height={tg[3] + 4} />
        </clipPath>
      </defs>

      {/* Emblem: outline trace → fill */}
      <path
        d={P.emblem.d}
        fillRule={P.emblem.fillRule}
        fill={ec}
        fillOpacity={clamp01(p.emblemFill)}
        stroke={ec}
        strokeWidth={0.35}
        strokeOpacity={p.emblemDraw >= 1 && p.emblemFill >= 1 ? 0 : 1}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - clamp01(p.emblemDraw)}
      />

      {/* PATEL — rises out of a hard mask */}
      <g clipPath={`url(#wm-${id})`}>
        <path d={P.wordmark.d} fillRule={P.wordmark.fillRule} fill={color} style={{transform: `translateY(${(1 - wmP) * (wm[3] + 2)}px)`}} />
      </g>

      {/* Rolling-pin banner unrolls from the centre */}
      <path
        d={P.banner.d}
        fillRule={P.banner.fillRule}
        fill={color}
        opacity={clamp01(p.banner * 3)}
        style={partStyle(P.banner.box[0], P.banner.box[1], P.banner.box[2], P.banner.box[3], `scaleX(${Math.max(0.001, clamp01(p.banner))})`)}
      />

      {/* BAKERY & SWEETS — revealed from the centre outwards */}
      <g clipPath={`url(#tg-${id})`}>
        <path d={P.tagline.d} fillRule={P.tagline.fillRule} fill={color} />
      </g>

      {/* SINCE 1949 — part of the supplied logo artwork, shown as supplied */}
      <path
        d={P.since.d}
        fillRule={P.since.fillRule}
        fill={color}
        opacity={clamp01(p.since)}
        style={partStyle(P.since.box[0], P.since.box[1], P.since.box[2], P.since.box[3], `translateY(${(1 - clamp01(p.since)) * 2}px)`)}
      />
    </svg>
  );
};

/** Emblem centre and size inside the lock-up, as fractions of the lock-up box (for camera moves). */
export const EMBLEM_IN_LOCKUP = (() => {
  const b = L.parts.emblem.box;
  return {
    cx: (b[0] + b[2] / 2 - L.viewBox[0]) / L.viewBox[2],
    cy: (b[1] + b[3] / 2 - L.viewBox[1]) / L.viewBox[3],
    w: b[2] / L.viewBox[2],
  };
})();
