import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BRAND} from '../config/brand';
import {COPY, FAMILY, FILM} from '../config/film';
import {Grain, Paper} from '../components/Texture';
import {MediaSlot} from '../components/MediaSlot';
import {PatternField} from '../components/PatternField';
import {MaskLine, Words, brandType, fitSize, labelType, storyType} from '../components/Type';
import {useLayout} from '../hooks/useLayout';
import {tw} from '../motion/tokens';

const C = BRAND.colors;

/**
 * 0:12–0:22 — Heritage, told on aged paper.
 * Not a timeline: photographs are laid down one over another like prints on a table,
 * while each name hands over to the next along a single gold thread.
 */
export const HeritageSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const {px, isLandscape, isPortrait} = L;

  const push = 1 + tw(frame, 0, 318, 0, 0.06, 'drift');
  const darken = tw(frame, 280, 318, 0, 1, 'drift');

  // Beat timings (local frames)
  const B = {line: 6, lineOut: 84, founder: 92, founderOut: 166, second: 172, secondOut: 238, today: 244};

  const printW = px(isPortrait ? 560 : isLandscape ? 500 : 380);
  const printH = printW * 1.22;

  const prints = [
    {slot: 'heritage/founder', label: `Archive photo — ${FAMILY.founder}`, at: B.founder - 8, x: 0, y: 0, r: -3.5},
    {slot: 'heritage/second-generation', label: `Archive photo — ${FAMILY.second}`, at: B.second - 8, x: 0.22, y: 0.1, r: 4},
    {slot: 'family/today', label: `Photo — ${FAMILY.current.join(', ')}`, at: B.today - 8, x: -0.12, y: 0.2, r: -1.5},
  ];

  const colW = isPortrait ? L.width - px(150) : isLandscape ? L.width * 0.44 - px(140) : L.width * 0.52 - px(100);
  const longestLine = [FAMILY.founder, FAMILY.second].flatMap(splitName).reduce((a, b) => (b.length > a.length ? b : a), '');
  const textSize = fitSize(longestLine, colW, px(isPortrait ? 96 : 88));
  const threadP = tw(frame, B.founder, B.today + 40, 0, 1, 'drift');

  return (
    <AbsoluteFill style={{background: C.brownDeep}}>
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        <Paper />
        <PatternField opacity={0.06} color={C.brown} tile={230} drift={[0.04, 0.02]} />
      </AbsoluteFill>

      {/* Prints laid onto the paper */}
      <AbsoluteFill
        style={{
          left: isPortrait ? 0 : isLandscape ? '46%' : '50%',
          right: 0,
          width: 'auto',
          top: isPortrait ? '5%' : 0,
          bottom: 'auto',
          height: isPortrait ? '52%' : '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {prints.map((p, i) => {
          const inP = tw(frame, p.at, p.at + 34, 0, 1, 'glide');
          const later = prints.slice(i + 1).filter((q) => frame > q.at).length;
          const recede = tw(frame, prints[i + 1]?.at ?? 1e9, (prints[i + 1]?.at ?? 1e9) + 34, 0, 1, 'glide') + (later > 1 ? 0.6 : 0);
          return (
            <div
              key={p.slot}
              style={{
                position: 'absolute',
                width: printW,
                height: printH,
                opacity: inP,
                transform: `translate(${(p.x + (1 - inP) * 0.5) * printW}px, ${(p.y - (1 - inP) * 0.05) * printH * 0.5}px) rotate(${p.r + (1 - inP) * 8}deg) scale(${1 - recede * 0.08})`,
                filter: `blur(${(1 - inP) * px(10)}px) brightness(${1 - recede * 0.25})`,
                background: C.cream,
                padding: printW * 0.045,
                paddingBottom: printW * 0.13,
                boxShadow: `0 ${px(22)}px ${px(50)}px rgba(40,20,5,0.45), 0 ${px(3)}px ${px(6)}px rgba(40,20,5,0.3)`,
              }}
            >
              <div style={{position: 'relative', width: '100%', height: '100%'}}>
                <MediaSlot slot={p.slot} label={p.label} archival zoom={1.02 + inP * 0.05} labelScale={L.u * 1.1} />
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Opening line */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: px(80)}}>
        <MaskLine frame={frame} at={B.line} out={B.lineOut} dur={1} style={{textAlign: 'center'}}>
          <Words frame={frame} at={B.line} text={COPY.heritageLine} stagger={5} style={storyType(px(isPortrait ? 92 : 104), {color: C.brown})} />
        </MaskLine>
      </AbsoluteFill>

      {/* Names + gold thread */}
      <AbsoluteFill
        style={{
          left: isPortrait ? px(90) : isLandscape ? px(140) : px(100),
          right: isPortrait ? px(60) : isLandscape ? '56%' : '48%',
          top: isPortrait ? '60%' : 0,
          bottom: isPortrait ? '6%' : 0,
          width: 'auto',
          height: 'auto',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -px(46),
            top: '20%',
            width: 2,
            height: `${threadP * 60}%`,
            background: `linear-gradient(${C.gold}, ${C.brown})`,
            opacity: frame > B.founder ? 0.9 : 0,
          }}
        />
        <NameBeat frame={frame} at={B.founder} out={B.founderOut} label={COPY.founderLabel} lines={splitName(FAMILY.founder)} size={textSize} />
        <NameBeat frame={frame} at={B.second} out={B.secondOut} label={COPY.continuedLabel} lines={splitName(FAMILY.second)} size={textSize} />
        <NameBeat frame={frame} at={B.today} label={COPY.todayLabel} lines={[...FAMILY.current]} size={textSize * 0.82} stagger={7} />
        {FILM.showFoundingYear && (
          <div style={labelType(px(24), {color: C.brownSoft, position: 'absolute', bottom: '12%', opacity: tw(frame, B.founder + 30, B.founder + 60)})}>
            Est. {FILM.foundingYear}
          </div>
        )}
      </AbsoluteFill>

      <AbsoluteFill style={{background: C.brownNight, opacity: darken * 0.85}} />
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};

const splitName = (name: string) => {
  const parts = name.split(' ');
  if (parts.length <= 2) return [name];
  return [parts.slice(0, -1).join(' '), parts[parts.length - 1]];
};

const NameBeat: React.FC<{frame: number; at: number; out?: number; label: string; lines: string[]; size: number; stagger?: number}> = ({
  frame, at, out, label, lines, size, stagger = 6,
}) => {
  const {px} = useLayout();
  if (frame < at - 2 || (out !== undefined && frame > out + 24)) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0}}>
      <MaskLine frame={frame} at={at} out={out} dur={22}>
        <div style={labelType(px(24), {color: C.brownSoft, marginBottom: px(18)})}>{label}</div>
      </MaskLine>
      {lines.map((line, i) => (
        <MaskLine key={line} frame={frame} at={at + 6 + i * stagger} out={out !== undefined ? out + i * 3 : undefined} dur={30}>
          <div style={brandType(size, {color: i === lines.length - 1 && lines.length > 1 && lines.length < 3 ? C.gold : C.brown, whiteSpace: 'nowrap'})}>{line}</div>
        </MaskLine>
      ))}
    </div>
  );
};
