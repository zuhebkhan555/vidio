import React from 'react';
import {Img} from 'remotion';
import {BRAND} from '../config/brand';
import {FILM} from '../config/film';
import {LOGO} from '../assets';
import {BRAND_FONT} from '../fonts';
import {clamp01} from '../motion/tokens';

const C = BRAND.colors;

/** Chef toque outline used by the placeholder emblem and the placeholder pattern mark. */
export const TOQUE_PATH =
  'M162 236 C138 232 124 206 136 186 C146 168 166 164 180 172 C184 146 216 146 222 170 C236 160 262 168 266 190 C276 212 262 232 240 236 Z';
export const TOQUE_BAND = 'M164 240 L238 240 L234 270 L168 270 Z';

type Props = {
  size: number;
  /** 0..1 line-drawing progress (rings → toque → type) */
  draw?: number;
  /** 0..1 how much the emblem is filled in after the line drawing */
  fill?: number;
  color?: string;
  showLabel?: boolean;
};

/**
 * The Patel Bakery emblem slot.
 * • If a logo file exists in public/patel-bakery/logo/, that exact artwork is shown untouched
 *   (revealed with an iris mask driven by `draw`).
 * • Otherwise a clearly-marked PLACEHOLDER emblem is drawn. It is NOT the real logo.
 */
export const Emblem: React.FC<Props> = ({size, draw = 1, fill = 1, color = C.gold, showLabel = true}) => {
  if (LOGO) {
    const r = clamp01(draw) * 75;
    return (
      <div style={{width: size, height: size, position: 'relative'}}>
        <Img
          src={LOGO.src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            clipPath: `circle(${r}% at 50% 50%)`,
            opacity: 0.35 + 0.65 * clamp01(fill + draw * 0.6),
          }}
        />
      </div>
    );
  }
  return <PlaceholderEmblem size={size} draw={draw} fill={fill} color={color} showLabel={showLabel} />;
};

const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

const PlaceholderEmblem: React.FC<Required<Props>> = ({size, draw, fill, color, showLabel}) => {
  const ring1 = seg(draw, 0, 0.45);
  const ring2 = seg(draw, 0.12, 0.55);
  const ring3 = seg(draw, 0.25, 0.65);
  const hat = seg(draw, 0.4, 0.85);
  const type = seg(draw, 0.6, 1);
  const dash = (p: number) => ({strokeDasharray: 1, strokeDashoffset: 1 - p});

  return (
    <div style={{width: size, height: size, position: 'relative'}}>
      <svg viewBox="0 0 400 400" width={size} height={size} style={{overflow: 'visible'}}>
        <defs>
          <path id="pb-arc-top" d="M 72 200 A 128 128 0 0 1 328 200" />
          <path id="pb-arc-bot" d="M 86 200 A 114 114 0 0 0 314 200" />
          <radialGradient id="pb-fill" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor={C.brownSoft} />
            <stop offset="100%" stopColor={C.brown} />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="186" fill="url(#pb-fill)" opacity={fill * 0.9} />
        <circle cx="200" cy="200" r="190" fill="none" stroke={color} strokeWidth="3.5" pathLength={1} style={dash(ring1)} transform="rotate(-90 200 200)" />
        <circle cx="200" cy="200" r="178" fill="none" stroke={color} strokeWidth="1.2" pathLength={1} style={dash(ring2)} transform="rotate(90 200 200)" />
        <circle cx="200" cy="200" r="102" fill="none" stroke={color} strokeWidth="1.6" pathLength={1} style={dash(ring3)} transform="rotate(-90 200 200)" />
        <path d={TOQUE_PATH} fill={color} fillOpacity={fill * hat * 0.18} stroke={color} strokeWidth="3" strokeLinejoin="round" pathLength={1} style={dash(hat)} />
        <path d={TOQUE_BAND} fill={color} fillOpacity={fill * hat * 0.5} stroke={color} strokeWidth="3" strokeLinejoin="round" pathLength={1} style={dash(hat)} />
        {[0, 1].map((side) => (
          <circle key={side} cx={side ? 334 : 66} cy={200} r={4} fill={color} opacity={type} />
        ))}
        <g opacity={type} fill={color} style={{fontFamily: BRAND_FONT, fontWeight: 500}}>
          <text fontSize="30" letterSpacing="7" textAnchor="middle">
            <textPath href="#pb-arc-top" startOffset="50%">PATEL BAKERY</textPath>
          </text>
          <text fontSize="20" letterSpacing="8" textAnchor="middle" dominantBaseline="hanging">
            <textPath href="#pb-arc-bot" startOffset="50%">&amp; SWEETS</textPath>
          </text>
        </g>
      </svg>
      {showLabel && FILM.showPlaceholderLabels && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '100%',
            transform: 'translate(-50%, 8px)',
            whiteSpace: 'nowrap',
            fontFamily: 'monospace',
            fontSize: Math.max(10, size * 0.032),
            letterSpacing: '0.08em',
            color: C.goldLight,
            opacity: 0.55 * type,
          }}
        >
          LOGO PLACEHOLDER · add brand-kit logo to public/patel-bakery/logo/
        </div>
      )}
    </div>
  );
};

/** Tiny mark used inside the placeholder repeating pattern. */
export const PlaceholderMark: React.FC<{color: string}> = ({color}) => (
  <g>
    <circle cx="200" cy="200" r="150" fill="none" stroke={color} strokeWidth="10" />
    <circle cx="200" cy="200" r="128" fill="none" stroke={color} strokeWidth="4" />
    <path d={TOQUE_PATH} fill="none" stroke={color} strokeWidth="10" strokeLinejoin="round" />
    <path d={TOQUE_BAND} fill={color} />
  </g>
);
