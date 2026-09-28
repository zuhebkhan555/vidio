import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {BRAND} from '../config/brand';
import {COPY} from '../config/film';
import {PatternField} from '../components/PatternField';
import {LightSweep} from '../components/LightSweep';
import {Hairline, Letters, labelType} from '../components/Type';
import {LOCKUP_RATIO, LOGO_FILES, LogoLockup} from '../brand/Logo';
import {useLayout} from '../hooks/useLayout';
import {tw} from '../motion/tokens';

const C = BRAND.colors;

/**
 * 0:55–1:00 — Everything simplifies to the brand brown. The pattern recedes, the official
 * lock-up resolves one last time, the promise is set beneath it, and the frame holds.
 * No animation after the lock-up.
 */
export const FinalBrandReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {px, width, height, isPortrait} = useLayout();

  const fadeIn = tw(frame, 0, 18);
  const sharp = tw(frame, 0, 40, 0, 1, 'glide');
  const patternOut = tw(frame, 0, 70, 0, 1, 'drift');
  const sweep = tw(frame, 96, 126, 0, 1, 'drift');

  const W = isPortrait ? width * 0.72 : Math.min(width * 0.5, height * 0.56 * LOCKUP_RATIO);

  return (
    <AbsoluteFill style={{opacity: fadeIn}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 70% at 50% 45%, ${C.brown} 0%, ${C.brown} 40%, ${C.brownDeep} 100%)`}} />
      <PatternField opacity={0.1 - patternOut * 0.06} tile={210} drift={[0.02 * (1 - patternOut), -0.01 * (1 - patternOut)]} />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div
          style={{
            position: 'relative',
            transform: `scale(${1.06 - sharp * 0.06})`,
            filter: `blur(${(1 - sharp) * px(10)}px) drop-shadow(0 ${px(14)}px ${px(30)}px rgba(0,0,0,0.4))`,
          }}
        >
          <LogoLockup
            width={W}
            color={C.cream}
            emblemColor={C.gold}
            progress={{
              emblemDraw: tw(frame, 2, 40, 0, 1, 'glide'),
              emblemFill: tw(frame, 18, 50, 0, 1, 'glide'),
              wordmark: tw(frame, 22, 46, 0, 1, 'reveal'),
              banner: tw(frame, 34, 60, 0, 1, 'glide'),
              tagline: tw(frame, 44, 66, 0, 1, 'glide'),
              since: tw(frame, 54, 74, 0, 1, 'glide'),
            }}
          />
          <LightSweep progress={sweep} maskSrc={staticFile(LOGO_FILES.lockupWhite)} blend="screen" intensity={0.85} />
        </div>

        <Hairline progress={tw(frame, 66, 96, 0, 1, 'reveal')} width={px(isPortrait ? 520 : 600)} color={C.gold} style={{marginTop: px(40), marginBottom: px(28)}} />

        <div style={{display: 'flex', gap: px(isPortrait ? 22 : 34), ...labelType(px(isPortrait ? 32 : 28), {color: C.goldPale, letterSpacing: '0.3em'})}}>
          {COPY.finalStatement.map((w, i) => (
            <Letters key={w} frame={frame} at={72 + i * 9} text={w.toUpperCase()} stagger={1} dur={20} rise={0.3} blur={6} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
