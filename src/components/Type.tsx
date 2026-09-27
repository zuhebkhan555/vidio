import React from 'react';
import {BRAND_FONT, BRAND_KERNING, STORY_FONT} from '../fonts';
import {CurveName, tw} from '../motion/tokens';

/**
 * Kinetic typography primitives. All driven by an explicit `frame` so they stay
 * deterministic and can be composed/offset freely inside scenes.
 */

type Base = {
  frame: number;
  /** frame the animation starts */
  at: number;
  style?: React.CSSProperties;
};

/** Line slides up out of a hard mask with a blur-to-sharp settle. */
export const MaskLine: React.FC<Base & {children: React.ReactNode; dur?: number; out?: number; outDur?: number; curve?: CurveName}> = ({
  frame, at, dur = 26, out, outDur = 16, curve = 'reveal', children, style,
}) => {
  const p = tw(frame, at, at + dur, 0, 1, curve);
  const o = out !== undefined ? tw(frame, out, out + outDur, 0, 1, 'exit') : 0;
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.06em', ...style}}>
      <div
        style={{
          transform: `translateY(${(1 - p) * 105 - o * 105}%)`,
          filter: `blur(${(1 - p) * 6}px)`,
          opacity: Math.min(0.2 + p, 1 - o),
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Per-letter stagger: letters rise + sharpen with a slight tracking collapse. */
export const Letters: React.FC<Base & {text: string; stagger?: number; dur?: number; rise?: number; blur?: number}> = ({
  frame, at, text, stagger = 2, dur = 22, rise = 0.5, blur = 10, style,
}) => (
  <span style={{display: 'inline-block', whiteSpace: 'pre', ...style}}>
    {text.split('').map((ch, i) => {
      const p = tw(frame, at + i * stagger, at + i * stagger + dur, 0, 1, 'glide');
      return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: p,
            transform: `translateY(${(1 - p) * rise}em)`,
            filter: `blur(${(1 - p) * blur}px)`,
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      );
    })}
  </span>
);

/** Words appear one by one with blur-to-sharp — for editorial story lines. */
export const Words: React.FC<Base & {text: string; stagger?: number; dur?: number}> = ({frame, at, text, stagger = 5, dur = 24, style}) => (
  <span style={style}>
    {text.split(' ').map((w, i) => {
      const p = tw(frame, at + i * stagger, at + i * stagger + dur, 0, 1, 'glide');
      return (
        <span
          key={i}
          style={{display: 'inline-block', opacity: p, filter: `blur(${(1 - p) * 8}px)`, transform: `translateY(${(1 - p) * 0.25}em)`, marginRight: '0.25em'}}
        >
          {w}
        </span>
      );
    })}
  </span>
);

/** Letter-spacing collapses from wide to target while fading in. */
export const Tracking: React.FC<Base & {text: string; from?: number; to?: number; dur?: number}> = ({
  frame, at, text, from = 0.8, to = 0.3, dur = 40, style,
}) => {
  const p = tw(frame, at, at + dur, 0, 1, 'glide');
  return (
    <span style={{display: 'inline-block', letterSpacing: `${from + (to - from) * p}em`, opacity: p, filter: `blur(${(1 - p) * 4}px)`, ...style}}>
      {text}
    </span>
  );
};

export const brandType = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: BRAND_FONT,
  fontSize: size,
  lineHeight: 0.95,
  letterSpacing: BRAND_KERNING,
  textTransform: 'uppercase',
  fontWeight: 500,
  ...extra,
});

export const storyType = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: STORY_FONT,
  fontSize: size,
  lineHeight: 1.1,
  fontStyle: 'italic',
  fontWeight: 400,
  ...extra,
});

export const labelType = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: BRAND_FONT,
  fontSize: size,
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  fontWeight: 400,
  ...extra,
});

/** Thin gold hairline that draws from its centre. */
export const Hairline: React.FC<{progress: number; width: number; color: string; thickness?: number; style?: React.CSSProperties}> = ({
  progress, width, color, thickness = 1.5, style,
}) => (
  <div style={{width, height: thickness, display: 'flex', justifyContent: 'center', ...style}}>
    <div style={{width: `${progress * 100}%`, height: '100%', background: `linear-gradient(90deg, transparent, ${color} 20%, ${color} 80%, transparent)`}} />
  </div>
);
