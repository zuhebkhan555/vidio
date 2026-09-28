import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BRAND} from '../config/brand';
import {COPY, FAMILY} from '../config/film';
import {BrownStage} from '../components/Texture';
import {PatternField} from '../components/PatternField';
import {Particles} from '../components/Particles';
import {Hairline, Letters, Tracking, brandType, fitSize, labelType} from '../components/Type';
import {useLayout} from '../hooks/useLayout';
import {tw} from '../motion/tokens';

const C = BRAND.colors;

/**
 * 0:47–0:55 — The emotional core. The pace slows.
 * Each generation rises into place above the next, then all three draw together into a
 * single line of light — and from that line: "Generations change. The tradition continues."
 */
export const FamilyLegacySequence: React.FC = () => {
  const frame = useCurrentFrame();
  const {px, width, isPortrait} = useLayout();

  const fadeIn = tw(frame, 0, 18);
  const appear = [4, 46, 90];
  const ci = tw(frame, 44, 70, 0, 1, 'glide') + tw(frame, 88, 114, 0, 1, 'glide');
  const conv = tw(frame, 132, 160, 0, 1, 'ramp');
  const line = tw(frame, 146, 176, 0, 1, 'reveal');
  const A = 158;
  const Bt = 194;
  const aDim = tw(frame, Bt - 4, Bt + 20, 0, 1, 'glide');
  const G = px(isPortrait ? 190 : 150);

  const gens = [
    {numeral: 'I', lines: [FAMILY.founder]},
    {numeral: 'II', lines: [FAMILY.second]},
    {numeral: 'III', lines: isPortrait ? [...FAMILY.current] : [FAMILY.current.join('  ·  ')]},
  ];

  return (
    <AbsoluteFill style={{opacity: fadeIn}}>
      <BrownStage />
      <PatternField opacity={0.06 + conv * 0.05} tile={200} drift={[0.03, -0.02]} lightPass={tw(frame, 120, 250, 0, 1, 'drift')} />
      <Particles seed="fam" count={45} color={C.goldLight} size={[1.2, 3]} rise={0.18} sway={10} opacity={0.6} />

      {/* Generations */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        {gens.map((g, i) => {
          if (frame < appear[i] - 1) return null;
          const rel = i - ci; // 0 = current, negative = earlier generations above
          const past = Math.max(0, -rel);
          const y = rel * G * (1 - conv);
          const scale = (1 - Math.min(1, past) * 0.32 - Math.max(0, past - 1) * 0.1) * (1 - conv * 0.6);
          const op = (1 - Math.min(1, past) * 0.45 - Math.max(0, past - 1) * 0.2) * (1 - conv);
          const longest = g.lines.reduce((a, b) => (b.length > a.length ? b : a), '');
          const size = fitSize(longest, width * 0.86, px(i === 2 ? 84 : 100));
          return (
            <div
              key={g.numeral}
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: `translateY(${y}px) scale(${scale})`,
                opacity: op,
                filter: `blur(${conv * px(10)}px)`,
              }}
            >
              <Tracking frame={frame} at={appear[i]} text={g.numeral} from={1.2} to={0.5} dur={30} style={labelType(px(26), {color: C.gold, marginBottom: px(16)})} />
              {g.lines.map((l, j) => (
                <Letters key={l} frame={frame} at={appear[i] + 4 + j * 6} text={l.toUpperCase()} stagger={2} dur={24} style={brandType(size, {color: C.cream, whiteSpace: 'nowrap'})} />
              ))}
            </div>
          );
        })}

        {/* All generations drawn together into one line of light */}
        <Hairline progress={line} width={px(isPortrait ? 760 : 1100)} color={C.goldLight} thickness={2} style={{position: 'absolute', filter: `drop-shadow(0 0 ${px(8)}px ${C.gold})`}} />

        {/* Statements */}
        <div
          style={{
            position: 'absolute',
            bottom: '50%',
            marginBottom: px(40),
            transform: `translateY(${-aDim * px(10)}px)`,
            opacity: 1 - aDim * 0.5,
            textAlign: 'center',
          }}
        >
          <Letters frame={frame} at={A} text={COPY.familyStatementA.toUpperCase()} stagger={2} dur={26} style={brandType(fitSize(COPY.familyStatementA, width * 0.86, px(80)), {color: C.cream, whiteSpace: 'nowrap'})} />
        </div>
        <div style={{position: 'absolute', top: '50%', marginTop: px(40), textAlign: 'center', maxWidth: '92%'}}>
          <Letters
            frame={frame}
            at={Bt}
            text={COPY.familyStatementB.toUpperCase()}
            stagger={2}
            dur={28}
            style={brandType(fitSize(COPY.familyStatementB, width * 0.9, px(96)), {color: C.gold, whiteSpace: 'nowrap'})}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
