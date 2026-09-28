import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {BRAND} from '../config/brand';
import {BrownStage} from '../components/Texture';
import {PatternField} from '../components/PatternField';
import {Particles} from '../components/Particles';
import {LightSweep} from '../components/LightSweep';
import {EMBLEM_IN_LOCKUP, LOCKUP_RATIO, LOGO_FILES, LogoLockup} from '../brand/Logo';
import {useLayout} from '../hooks/useLayout';
import {tw} from '../motion/tokens';

const C = BRAND.colors;

/**
 * 0:05–0:12 — The point of light blooms into the official emblem: its outline is traced,
 * then it fills and sharpens while settling from a slight rotation. A light sweep crosses
 * it, the camera pulls back and the lock-up completes: PATEL rises, the rolling-pin
 * banner unrolls, BAKERY & SWEETS and SINCE 1949 settle beneath.
 */
export const PatelLogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {px, width, height, isPortrait, isSquare} = useLayout();

  const draw = tw(frame, 4, 74, 0, 1, 'drift');
  const fill = tw(frame, 46, 92, 0, 1, 'glide');
  const sharp = tw(frame, 0, 70, 0, 1, 'glide');
  const bloom = 1 - tw(frame, 0, 26, 0, 1, 'glide');
  const sweep = tw(frame, 76, 110, 0, 1, 'drift');
  const pull = tw(frame, 98, 146, 0, 1, 'glide');
  const push = tw(frame, 150, 240, 0, 1, 'drift');

  // Final lock-up size, per aspect ratio
  const Wf = isPortrait ? width * 0.78 : Math.min(width * 0.6, height * (isSquare ? 0.66 : 0.68) * LOCKUP_RATIO);
  const Hf = Wf / LOCKUP_RATIO;
  // Start framed on the emblem alone, large and centred
  const k0 = px(isPortrait ? 620 : 520) / (EMBLEM_IN_LOCKUP.w * Wf);
  const ecx = EMBLEM_IN_LOCKUP.cx * Wf;
  const ecy = EMBLEM_IN_LOCKUP.cy * Hf;
  const scale = (k0 + (1 - k0) * pull) * (1.1 - sharp * 0.1);
  const dx = (Wf / 2 - ecx) * (1 - pull);
  const dy = (Hf / 2 - ecy) * (1 - pull);

  return (
    <AbsoluteFill>
      <BrownStage />
      <PatternField opacity={0.13 - sharp * 0.07} tile={210} scale={1.04 + push * 0.02} drift={[0.05, -0.03]} />
      <Particles seed="lg" count={50} color={C.goldLight} size={[1.2, 3]} rise={0.25} sway={14} opacity={0.6} />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + push * 0.05})`}}>
        {/* bloom handed over from the opening's point of light */}
        <div
          style={{
            position: 'absolute',
            width: px(40),
            height: px(40),
            borderRadius: '50%',
            background: C.goldPale,
            opacity: bloom,
            boxShadow: `0 0 ${px(140)}px ${px(60)}px ${C.gold}99`,
            transform: `scale(${1 + (1 - bloom) * 4})`,
          }}
        />

        <div
          style={{
            position: 'relative',
            width: Wf,
            height: Hf,
            transformOrigin: `${ecx}px ${ecy}px`,
            transform: `translate(${dx}px, ${dy}px) scale(${scale}) rotate(${(1 - sharp) * -8}deg)`,
            filter: `blur(${(1 - sharp) * px(14)}px) drop-shadow(0 ${px(16)}px ${px(36)}px rgba(0,0,0,0.45))`,
          }}
        >
          <LogoLockup
            width={Wf}
            color={C.cream}
            emblemColor={C.gold}
            progress={{
              emblemDraw: draw,
              emblemFill: fill,
              wordmark: tw(frame, 112, 142, 0, 1, 'reveal'),
              banner: tw(frame, 128, 162, 0, 1, 'glide'),
              tagline: tw(frame, 140, 172, 0, 1, 'glide'),
              since: tw(frame, 156, 184, 0, 1, 'glide'),
            }}
          />
          <LightSweep progress={sweep} maskSrc={staticFile(LOGO_FILES.lockupWhite)} blend="screen" intensity={0.9} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
