import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BRAND} from '../config/brand';
import {FILM} from '../config/film';
import {LOGO} from '../assets';
import {BrownStage} from '../components/Texture';
import {PatternField} from '../components/PatternField';
import {Particles} from '../components/Particles';
import {Emblem} from '../components/Emblem';
import {LightSweep} from '../components/LightSweep';
import {Hairline, Letters, Tracking, brandType, labelType} from '../components/Type';
import {useLayout} from '../hooks/useLayout';
import {tw} from '../motion/tokens';

const C = BRAND.colors;

/**
 * 0:05–0:12 — The point of light blooms into the emblem: rings are drawn, the chef mark
 * resolves from blur to sharp while the whole mark settles from a slight rotation.
 * A single light sweep crosses it, then it lifts to make room for the wordmark.
 */
export const PatelLogoReveal: React.FC<{hideWordmark?: boolean}> = ({hideWordmark = FILM.logoIncludesWordmark}) => {
  const frame = useCurrentFrame();
  const {px, isPortrait} = useLayout();

  const draw = tw(frame, 4, 80, 0, 1, 'drift');
  const sharp = tw(frame, 0, 70, 0, 1, 'glide');
  const fill = tw(frame, 50, 95, 0, 1, 'glide');
  const bloom = 1 - tw(frame, 0, 26, 0, 1, 'glide');
  const sweep = tw(frame, 84, 120, 0, 1, 'drift');
  const lift = hideWordmark ? 0 : tw(frame, 104, 142, 0, 1, 'glide');
  const push = tw(frame, 150, 240, 0, 1, 'drift');

  const size = px(isPortrait ? 560 : 460);
  const emblemScale = (1.14 - sharp * 0.14) * (1 - lift * 0.36);
  const emblemY = -lift * px(isPortrait ? 250 : 190);
  const wordSize = px(isPortrait ? 150 : 124);

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
            position: 'absolute',
            transform: `translateY(${emblemY}px) scale(${emblemScale}) rotate(${(1 - sharp) * -10}deg)`,
            filter: `blur(${(1 - sharp) * px(16)}px) drop-shadow(0 ${px(18)}px ${px(40)}px rgba(0,0,0,0.45))`,
          }}
        >
          <Emblem size={size} draw={draw} fill={fill} showLabel={lift < 0.5} />
          <div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden'}}>
            <LightSweep progress={sweep} maskSrc={LOGO?.src} blend={LOGO ? 'screen' : 'overlay'} intensity={0.9} />
          </div>
        </div>

        {!hideWordmark && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              transform: `translateY(${px(isPortrait ? 70 : 20)}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: C.cream,
            }}
          >
            <Letters frame={frame} at={118} text="PATEL" stagger={3} style={brandType(wordSize, {color: C.cream})} />
            <Letters frame={frame} at={128} text="BAKERY" stagger={3} style={brandType(wordSize, {color: C.gold, marginTop: px(4)})} />
            <div style={{display: 'flex', alignItems: 'center', gap: px(22), marginTop: px(26)}}>
              <Hairline progress={tw(frame, 146, 186, 0, 1, 'reveal')} width={px(110)} color={C.gold} />
              <Tracking frame={frame} at={148} text="& SWEETS" from={1.1} to={0.45} style={labelType(px(26), {color: C.goldLight})} />
              <Hairline progress={tw(frame, 146, 186, 0, 1, 'reveal')} width={px(110)} color={C.gold} />
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
