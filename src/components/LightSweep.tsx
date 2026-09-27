import React from 'react';
import {AbsoluteFill} from 'remotion';

/**
 * A soft diagonal band of warm light travelling across its parent.
 * progress 0 → 1 moves the band from off-left to off-right.
 * Pass `maskSrc` (an image with alpha, e.g. the logo) to confine the light to that shape.
 */
export const LightSweep: React.FC<{
  progress: number;
  angle?: number;
  width?: number;
  intensity?: number;
  color?: string;
  maskSrc?: string;
  blend?: React.CSSProperties['mixBlendMode'];
}> = ({progress, angle = 105, width = 18, intensity = 0.65, color = '255,240,215', maskSrc, blend = 'screen'}) => {
  if (progress <= 0 || progress >= 1) return null;
  const pos = -30 + progress * 160;
  const mask = maskSrc
    ? {
        WebkitMaskImage: `url(${maskSrc})`,
        maskImage: `url(${maskSrc})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }
    : {};
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: blend,
        background: `linear-gradient(${angle}deg, transparent ${pos - width}%, rgba(${color},${intensity * 0.35}) ${pos - width / 3}%, rgba(${color},${intensity}) ${pos}%, rgba(${color},${intensity * 0.35}) ${pos + width / 3}%, transparent ${pos + width}%)`,
        ...mask,
      }}
    />
  );
};
