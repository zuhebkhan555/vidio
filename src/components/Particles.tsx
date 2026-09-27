import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {useLayout} from '../hooks/useLayout';

type Props = {
  seed: string;
  count: number;
  color: string;
  /** size range in design units */
  size: [number, number];
  /** vertical speed in design units per frame (+ = rising) */
  rise?: number;
  /** horizontal sway amplitude in design units */
  sway?: number;
  blur?: number;
  opacity?: number;
  /** 0..1 — optional attractor: particles pulled toward centre (for flour → dough) */
  gather?: number;
  gatherRadius?: number;
  glow?: boolean;
};

/**
 * Deterministic dust / flour / ember particles. Every value derives from `random(seed)`,
 * so each frame renders identically on every machine.
 */
export const Particles: React.FC<Props> = ({
  seed,
  count,
  color,
  size,
  rise = 0.4,
  sway = 20,
  blur = 0,
  opacity = 1,
  gather = 0,
  gatherRadius = 120,
  glow = false,
}) => {
  const frame = useCurrentFrame();
  const {width, height, px} = useLayout();

  const parts = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: random(`${seed}x${i}`),
        y: random(`${seed}y${i}`),
        s: size[0] + random(`${seed}s${i}`) * (size[1] - size[0]),
        sp: 0.5 + random(`${seed}v${i}`),
        ph: random(`${seed}p${i}`) * Math.PI * 2,
        tw: 0.4 + random(`${seed}t${i}`) * 0.6,
        ang: random(`${seed}a${i}`) * Math.PI * 2,
        rad: random(`${seed}r${i}`),
      })),
    [count, seed, size],
  );

  const cx = width / 2;
  const cy = height / 2;

  return (
    <AbsoluteFill style={{opacity, filter: blur ? `blur(${px(blur)}px)` : undefined, pointerEvents: 'none'}}>
      {parts.map((p, i) => {
        const travel = px(rise) * p.sp * frame;
        const H = height + px(80);
        let y = ((((p.y * H - travel) % H) + H) % H) - px(40);
        let x = p.x * width + Math.sin(frame / 40 + p.ph) * px(sway) * p.sp;
        if (gather > 0) {
          const tx = cx + Math.cos(p.ang + frame / 90) * px(gatherRadius) * Math.sqrt(p.rad);
          const ty = cy + Math.sin(p.ang + frame / 90) * px(gatherRadius) * 0.8 * Math.sqrt(p.rad);
          x = x + (tx - x) * gather;
          y = y + (ty - y) * gather;
        }
        const twinkle = 0.55 + 0.45 * Math.sin(frame / (12 + p.tw * 20) + p.ph);
        const d = px(p.s);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - d / 2,
              top: y - d / 2,
              width: d,
              height: d,
              borderRadius: '50%',
              background: color,
              opacity: twinkle * p.tw,
              boxShadow: glow ? `0 0 ${d * 3}px ${color}` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
