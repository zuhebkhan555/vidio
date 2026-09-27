import React, {useId} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BRAND} from '../config/brand';
import {LOGO, PATTERN_TILE} from '../assets';
import {useLayout} from '../hooks/useLayout';
import {PlaceholderMark} from './Emblem';

type Props = {
  opacity?: number;
  color?: string;
  /** tile size in design units */
  tile?: number;
  /** drift speed in design units / frame */
  drift?: [number, number];
  rotate?: number;
  scale?: number;
  /**
   * Optional light pass: 0..1 moves a soft band that makes the pattern glow as it passes,
   * so the pattern appears to catch light rather than just fade in.
   */
  lightPass?: number;
  lightWidth?: number;
  /** Radial reveal from the centre, 0 (hidden) → 1 (full). */
  reveal?: number;
  style?: React.CSSProperties;
};

/**
 * The Patel Bakery repeating logo pattern — the film's recurring motion signature.
 * Source priority: dedicated brand-kit pattern tile → supplied logo tiled → placeholder mark.
 */
export const PatternField: React.FC<Props> = ({
  opacity = 0.12,
  color = BRAND.colors.gold,
  tile = 190,
  drift = [0.12, -0.06],
  rotate = 0,
  scale = 1,
  lightPass,
  lightWidth = 26,
  reveal,
  style,
}) => {
  const frame = useCurrentFrame();
  const {px} = useLayout();
  const id = useId().replace(/:/g, '');
  const T = px(tile);
  const ox = (frame * px(drift[0])) % T;
  const oy = (frame * px(drift[1])) % T;

  const masks: string[] = [];
  if (lightPass !== undefined) {
    const p = -30 + lightPass * 160;
    masks.push(
      `linear-gradient(100deg, rgba(0,0,0,0.25) ${p - lightWidth}%, #000 ${p}%, rgba(0,0,0,0.25) ${p + lightWidth}%)`,
    );
  }
  if (reveal !== undefined) {
    const r = reveal * 120;
    masks.push(`radial-gradient(circle at 50% 50%, #000 ${r - 15}%, transparent ${r}%)`);
  }
  const maskImage = masks.length ? masks.join(', ') : undefined;

  const mark = (x: number, y: number, s: number) => {
    if (LOGO) return <image href={LOGO.src} x={x - s / 2} y={y - s / 2} width={s} height={s} opacity={1} />;
    return (
      <g transform={`translate(${x - s / 2} ${y - s / 2}) scale(${s / 400})`}>
        <PlaceholderMark color={color} />
      </g>
    );
  };

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        WebkitMaskImage: maskImage,
        maskImage,
        WebkitMaskComposite: masks.length > 1 ? 'source-in' : undefined,
        maskComposite: masks.length > 1 ? 'intersect' : undefined,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <pattern
            id={`pbp-${id}`}
            width={T}
            height={T}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${ox} ${oy})`}
          >
            {PATTERN_TILE ? (
              <image href={PATTERN_TILE.src} x={0} y={0} width={T} height={T} preserveAspectRatio="xMidYMid slice" />
            ) : (
              <>
                {mark(T * 0.25, T * 0.25, T * 0.34)}
                {mark(T * 0.75, T * 0.75, T * 0.34)}
                <circle cx={T * 0.75} cy={T * 0.25} r={T * 0.012} fill={color} />
                <circle cx={T * 0.25} cy={T * 0.75} r={T * 0.012} fill={color} />
              </>
            )}
          </pattern>
        </defs>
        <rect x={-2 * T} y={-2 * T} width="160%" height="160%" fill={`url(#pbp-${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
