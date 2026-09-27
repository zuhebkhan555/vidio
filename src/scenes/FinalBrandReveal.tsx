import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BRAND} from '../config/brand';
import {COPY, FILM} from '../config/film';
import {LOGO} from '../assets';
import {PatternField} from '../components/PatternField';
import {Emblem} from '../components/Emblem';
import {LightSweep} from '../components/LightSweep';
import {Hairline, Letters, brandType, labelType} from '../components/Type';
import {useLayout} from '../hooks/useLayout';
import {tw} from '../motion/tokens';

const C = BRAND.colors;

/**
 * 0:55–1:00 — Everything simplifies to the brand brown. The pattern recedes, the logo
 * resolves one last time, the name and the promise are set, and the frame holds. No
 * animation after the lock-up.
 */
export const FinalBrandReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {px, isPortrait} = useLayout();

  const fadeIn = tw(frame, 0, 18);
  const draw = tw(frame, 4, 48, 0, 1, 'glide');
  const sharp = tw(frame, 0, 40, 0, 1, 'glide');
  const patternOut = tw(frame, 0, 70, 0, 1, 'drift');
  const sweep = tw(frame, 84, 118, 0, 1, 'drift');

  const emblem = px(isPortrait ? 440 : 330);
  const word = px(isPortrait ? 128 : 112);
  const statement = COPY.finalStatement;

  return (
    <AbsoluteFill style={{opacity: fadeIn}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 70% at 50% 45%, ${C.brown} 0%, ${C.brown} 40%, ${C.brownDeep} 100%)`}} />
      <PatternField opacity={0.1 - patternOut * 0.06} tile={210} drift={[0.02 * (1 - patternOut), -0.01 * (1 - patternOut)]} />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div
          style={{
            position: 'relative',
            transform: `scale(${1.08 - sharp * 0.08})`,
            filter: `blur(${(1 - sharp) * px(12)}px) drop-shadow(0 ${px(14)}px ${px(30)}px rgba(0,0,0,0.4))`,
          }}
        >
          <Emblem size={emblem} draw={draw} fill={draw} showLabel={false} />
          <div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden'}}>
            <LightSweep progress={sweep} maskSrc={LOGO?.src} blend={LOGO ? 'screen' : 'overlay'} intensity={0.85} />
          </div>
        </div>

        {!FILM.logoIncludesWordmark && (
          <div style={{marginTop: px(isPortrait ? 60 : 44), display: 'flex', flexDirection: isPortrait ? 'column' : 'row', alignItems: 'center', gap: isPortrait ? px(4) : '0.28em', ...brandType(word)}}>
            <Letters frame={frame} at={26} text="PATEL" stagger={2} dur={22} style={{color: C.cream}} />
            <Letters frame={frame} at={34} text="BAKERY" stagger={2} dur={22} style={{color: C.gold}} />
          </div>
        )}

        <Hairline progress={tw(frame, 50, 84, 0, 1, 'reveal')} width={px(isPortrait ? 520 : 640)} color={C.gold} style={{marginTop: px(34), marginBottom: px(30)}} />

        <div style={{display: 'flex', gap: px(isPortrait ? 22 : 34), ...labelType(px(isPortrait ? 34 : 30), {color: C.goldPale, letterSpacing: '0.32em'})}}>
          {statement.map((w, i) => (
            <Letters key={w} frame={frame} at={58 + i * 9} text={w.toUpperCase()} stagger={1} dur={20} rise={0.3} blur={6} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
