import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BRAND} from '../config/brand';
import {sec} from '../config/film';
import {BrownStage} from '../components/Texture';
import {PatternField} from '../components/PatternField';
import {Particles} from '../components/Particles';
import {useLayout} from '../hooks/useLayout';
import {tw} from '../motion/tokens';

const C = BRAND.colors;

/**
 * 0:00–0:05 — Darkness. The logo pattern is almost invisible until a slow band of warm
 * light passes across it. Dust hangs in the air. A single point of light gathers at
 * the centre: that point becomes the emblem in the next scene.
 */
export const OpeningAtmosphere: React.FC = () => {
  const frame = useCurrentFrame();
  const {px} = useLayout();

  const exposure = tw(frame, 0, sec(3), 0, 1, 'drift');
  const light = tw(frame, sec(0.4), sec(4.6), 0, 1, 'drift');
  const push = 1.14 - tw(frame, 0, sec(5.6), 0, 0.1, 'drift');
  const coreIn = tw(frame, sec(3.2), sec(5), 0, 1, 'glide');
  const lineW = tw(frame, sec(3.6), sec(5.2), 0, 1, 'reveal');

  return (
    <AbsoluteFill>
      <BrownStage glow={0.25 + exposure * 0.75} />

      {/* Oven glow breathing up from below */}
      <AbsoluteFill
        style={{
          opacity: exposure * (0.35 + 0.1 * Math.sin(frame / 22)),
          background: `radial-gradient(ellipse 60% 40% at 50% 115%, ${C.gold}66, transparent 70%)`,
        }}
      />

      {/* Pattern — far layer (parallax slow) and near layer (faster, larger, blurred) */}
      <PatternField opacity={0.06 + exposure * 0.22} tile={210} scale={push} drift={[0.05, -0.03]} lightPass={light} lightWidth={18} />
      <PatternField
        opacity={0.1 * exposure}
        tile={420}
        scale={push * 1.08}
        rotate={-4}
        drift={[0.18, -0.08]}
        lightPass={light * 0.9}
        style={{filter: `blur(${px(5)}px)`}}
      />

      <Particles seed="op-far" count={70} color={C.goldLight} size={[1.2, 3]} rise={0.25} sway={14} opacity={0.35 + exposure * 0.4} />
      <Particles seed="op-near" count={14} color={C.goldPale} size={[6, 14]} rise={0.6} sway={30} blur={5} opacity={0.25 * exposure} />

      {/* The gathering point of light + horizon hairline (anticipation) */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            position: 'absolute',
            width: px(900) * lineW,
            height: 1.5,
            background: `linear-gradient(90deg, transparent, ${C.goldLight}, transparent)`,
            opacity: coreIn * 0.8,
          }}
        />
        <div
          style={{
            width: px(14 + coreIn * 18),
            height: px(14 + coreIn * 18),
            borderRadius: '50%',
            background: C.goldPale,
            opacity: coreIn,
            boxShadow: `0 0 ${px(40 + coreIn * 90)}px ${px(10 + coreIn * 30)}px ${C.gold}aa`,
            filter: `blur(${px(2)}px)`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
