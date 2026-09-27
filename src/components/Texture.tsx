import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {BRAND} from '../config/brand';

const svgUri = (svg: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

const GRAIN_TILE = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'>
    <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
    <feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 1.4 -0.2'/></filter>
    <rect width='100%' height='100%' filter='url(#n)'/></svg>`,
);

const PAPER_TILE = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>
    <filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.012 0.02' numOctaves='5' seed='7' stitchTiles='stitch'/>
    <feColorMatrix values='0 0 0 0 0.32  0 0 0 0 0.18  0 0 0 0 0.08  0 0 0 0.9 -0.25'/></filter>
    <rect width='100%' height='100%' filter='url(#p)'/></svg>`,
);

const FIBRE_TILE = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
    <filter id='f'><feTurbulence type='turbulence' baseFrequency='0.5 0.02' numOctaves='2' seed='3' stitchTiles='stitch'/>
    <feColorMatrix values='0 0 0 0 0.3  0 0 0 0 0.18  0 0 0 0 0.08  0 0 0 0.7 -0.35'/></filter>
    <rect width='100%' height='100%' filter='url(#f)'/></svg>`,
);

/** Animated film grain. Re-seeded every 2 frames by shifting the tile. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.09}) => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 2);
  const x = Math.floor(random(`gx${step}`) * 280);
  const y = Math.floor(random(`gy${step}`) * 280);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: GRAIN_TILE,
        backgroundPosition: `${x}px ${y}px`,
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    />
  );
};

/** Aged paper surface: warm base + mottling + fibres + burnt edges. */
export const Paper: React.FC<{opacity?: number; base?: string}> = ({
  opacity = 1,
  base = BRAND.colors.goldPale,
}) => (
  <AbsoluteFill style={{opacity}}>
    <AbsoluteFill style={{background: base}} />
    <AbsoluteFill style={{backgroundImage: PAPER_TILE, mixBlendMode: 'multiply', opacity: 0.55}} />
    <AbsoluteFill style={{backgroundImage: FIBRE_TILE, mixBlendMode: 'multiply', opacity: 0.35}} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 75% 70% at 50% 48%, transparent 45%, ${BRAND.colors.brownSoft}88 85%, ${BRAND.colors.brown}ee 110%)`,
        mixBlendMode: 'multiply',
      }}
    />
  </AbsoluteFill>
);

export const Vignette: React.FC<{strength?: number; color?: string}> = ({
  strength = 0.75,
  color = BRAND.colors.brownNight,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 80% 75% at 50% 50%, transparent 40%, ${color} 130%)`,
      opacity: strength,
    }}
  />
);

/** Deep brand-brown stage with a soft warm pool of light. */
export const BrownStage: React.FC<{glow?: number; glowY?: number; glowX?: number}> = ({
  glow = 1,
  glowX = 50,
  glowY = 50,
}) => (
  <AbsoluteFill style={{background: BRAND.colors.brownNight}}>
    <AbsoluteFill
      style={{
        opacity: glow,
        background: `radial-gradient(ellipse 70% 65% at ${glowX}% ${glowY}%, ${BRAND.colors.brown} 0%, ${BRAND.colors.brownDeep} 55%, ${BRAND.colors.brownNight} 100%)`,
      }}
    />
  </AbsoluteFill>
);
