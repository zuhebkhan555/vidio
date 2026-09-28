import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BRAND} from '../config/brand';
import {COPY} from '../config/film';
import {BrownStage} from '../components/Texture';
import {Particles} from '../components/Particles';
import {LightSweep} from '../components/LightSweep';
import {ProductStandIn, Steam} from '../components/ProductStandIn';
import {brandType, fitSize, labelType} from '../components/Type';
import {useLayout} from '../hooks/useLayout';
import {envelope, tw} from '../motion/tokens';

const C = BRAND.colors;
const BEAT = 75;

/**
 * 0:22–0:32 — INGREDIENTS → CRAFT → BAKING → FRESH as one continuous transformation:
 * drifting flour gathers into a ball of dough, the dough takes on oven heat and colour,
 * and the finished bake catches the light with steam rising. One object, four states.
 */
export const CraftSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const {px, width, isPortrait} = useLayout();

  const fadeIn = tw(frame, 0, 18);
  const gather = tw(frame, 30, 92, 0, 1, 'drift');
  const doughIn = tw(frame, 70, 110, 0, 1, 'glide');
  const bake = tw(frame, 150, 232, 0, 1, 'drift');
  const heat = envelope(frame, 140, 250, 30, 40);
  const fresh = tw(frame, 222, 260, 0, 1, 'glide');
  const sweep = tw(frame, 246, 290, 0, 1, 'drift');
  const knead = frame > 80 && frame < 170 ? Math.sin((frame - 80) / 9) * 0.025 * (1 - bake) : 0;

  const objSize = px(isPortrait ? 780 : 640);
  const drift = tw(frame, 0, 318, 0, 1, 'drift');

  return (
    <AbsoluteFill style={{opacity: fadeIn}}>
      <BrownStage glowY={55} />

      {/* Oven heat from below */}
      <AbsoluteFill style={{opacity: heat, background: `radial-gradient(ellipse 70% 50% at 50% 100%, ${C.gold}aa, ${C.brown}33 55%, transparent 80%)`}} />

      {/* Chapter words, oversized, behind the object */}
      {COPY.craftWords.map((w, i) => (
        <CraftWord key={w} word={w} index={i} frame={frame} width={width} />
      ))}

      {/* Flour */}
      <Particles seed="flour" count={140} color={C.cream} size={[1.5, 4.5]} rise={-0.9} sway={40} gather={gather} gatherRadius={isPortrait ? 300 : 260} opacity={1 - doughIn * 0.95} />
      <Particles seed="flour-near" count={16} color={C.cream} size={[8, 18]} rise={-1.6} sway={50} blur={6} opacity={0.35 * (1 - gather)} />

      {/* The object: dough → bake */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width: objSize,
            height: objSize,
            opacity: doughIn,
            transform: `translateY(${(1 - drift) * px(20)}px) scale(${(0.72 + doughIn * 0.28) * (1 + fresh * 0.06)}) scaleX(${1 + knead}) scaleY(${1 - knead})`,
            filter: `blur(${(1 - doughIn) * px(14)}px) drop-shadow(0 ${px(30)}px ${px(40)}px rgba(0,0,0,0.5))`,
            position: 'relative',
          }}
        >
          <HeatHaze strength={heat}>
            <ProductStandIn kind="dough" bake={bake} lightAngle={200 + fresh * 70 + drift * 20} />
          </HeatHaze>
          <div style={{position: 'absolute', inset: '18%', borderRadius: '50%', overflow: 'hidden'}}>
            <LightSweep progress={sweep} blend="overlay" intensity={0.8} />
          </div>
          <Steam width={objSize} height={objSize} opacity={fresh * 0.55} seed="craft" />
        </div>
      </AbsoluteFill>

      {/* Embers during baking */}
      <Particles seed="ember" count={40} color={C.goldLight} size={[1.5, 3.5]} rise={1.4} sway={16} opacity={heat * 0.9} glow />

      {/* Chapter counter */}
      <div style={{position: 'absolute', left: px(80), top: px(70), ...labelType(px(20), {color: C.goldLight, opacity: 0.8})}}>
        The craft &nbsp;·&nbsp; {String(Math.min(4, Math.floor(frame / BEAT) + 1)).padStart(2, '0')} / 04
      </div>
    </AbsoluteFill>
  );
};

const CraftWord: React.FC<{word: string; index: number; frame: number; width: number}> = ({word, index, frame, width}) => {
  const {px} = useLayout();
  const start = index * BEAT;
  const end = start + BEAT + (index === 3 ? 60 : 8);
  if (frame < start - 2 || frame > end + 2) return null;
  const inP = tw(frame, start, start + 26, 0, 1, 'reveal');
  const outP = index === 3 ? 0 : tw(frame, end - 16, end, 0, 1, 'exit');
  const fillP = tw(frame, start + 10, start + 50, 0, 1, 'drift');
  const size = fitSize(word, width * 0.88, px(280));
  const track = 0.3 - inP * 0.3 + outP * 0.2;
  const base = brandType(size, {letterSpacing: `${track}em`, whiteSpace: 'nowrap', lineHeight: 1});

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: inP * (1 - outP),
        filter: `blur(${(1 - inP) * 10 + outP * 16}px)`,
        transform: `scale(${1.08 - inP * 0.08 + outP * 0.06})`,
      }}
    >
      <div style={{position: 'relative'}}>
        <div style={{...base, color: 'transparent', WebkitTextStroke: `1.5px ${C.gold}88`}}>{word}</div>
        <div style={{...base, position: 'absolute', inset: 0, color: `${C.gold}40`, clipPath: `inset(0 ${(1 - fillP) * 100}% 0 0)`}}>{word}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Subtle oven heat shimmer via an animated displacement map. */
const HeatHaze: React.FC<{strength: number; children: React.ReactNode}> = ({strength, children}) => {
  const frame = useCurrentFrame();
  if (strength < 0.01) return <>{children}</>;
  const id = 'haze-' + Math.floor(frame);
  return (
    <div style={{width: '100%', height: '100%', filter: `url(#${id})`}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency={`0.008 ${0.03 + (frame % 40) * 0.0003}`} numOctaves="2" seed={frame % 60} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale={strength * 18} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {children}
    </div>
  );
};
