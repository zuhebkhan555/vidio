import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../config/brand';
import {PatternField} from '../components/PatternField';
import {EASE} from '../motion/tokens';

const C = BRAND.colors;

/**
 * THE PATEL BAKERY MOTION SIGNATURE
 * A brand-brown panel carrying the gold logo pattern sweeps over the frame, the pattern
 * shifts as it passes, and the panel uncovers the next shot.
 * Use inside a <Sequence>; it spans the Sequence's full duration (cover → uncover).
 */
export const PatternTransition: React.FC<{variant?: 'diagonal' | 'iris'; direction?: 1 | -1}> = ({
  variant = 'diagonal',
  direction = 1,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = frame / (durationInFrames - 1);
  const lead = EASE.ramp(Math.min(1, t / 0.55));
  const trail = EASE.ramp(Math.max(0, (t - 0.45) / 0.55));

  let clipPath: string;
  let edge: React.ReactNode = null;
  if (variant === 'iris') {
    const outer = lead * 110;
    const inner = trail * 110;
    clipPath = `circle(${outer}% at 50% 50%)`;
    return (
      <AbsoluteFill style={{clipPath, pointerEvents: 'none'}}>
        <AbsoluteFill
          style={{
            WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent ${inner * 0.72}%, #000 ${inner * 0.72 + 0.5}%)`,
            maskImage: `radial-gradient(circle at 50% 50%, transparent ${inner * 0.72}%, #000 ${inner * 0.72 + 0.5}%)`,
          }}
        >
          <Panel t={t} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  const skew = 22;
  const L = -skew + lead * (100 + 2 * skew);
  const T = -skew + trail * (100 + 2 * skew);
  const pts = [
    [T, 0],
    [L, 0],
    [L - skew, 100],
    [T - skew, 100],
  ].map(([x, y]) => [direction === 1 ? x : 100 - x, y]);
  clipPath = `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(',')})`;
  edge = (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', inset: 0}}>
      {[L, T].map((x, i) => {
        const a = direction === 1 ? x : 100 - x;
        const b = direction === 1 ? x - skew : 100 - (x - skew);
        return <line key={i} x1={a} y1={0} x2={b} y2={100} stroke={C.gold} strokeWidth={0.18} vectorEffect="non-scaling-stroke" opacity={0.9} />;
      })}
    </svg>
  );

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{clipPath}}>
        <Panel t={t} />
      </AbsoluteFill>
      {edge}
    </AbsoluteFill>
  );
};

const Panel: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, ${C.brown}, ${C.brownDeep})`}}>
    <PatternField opacity={0.55} tile={150} scale={1.15 - t * 0.12} rotate={-6 + t * 6} drift={[0.6, 0.2]} />
  </AbsoluteFill>
);
