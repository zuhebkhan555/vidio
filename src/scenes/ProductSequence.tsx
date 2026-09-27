import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../config/brand';
import {PRODUCTS} from '../config/film';
import {MediaSlot} from '../components/MediaSlot';
import {Particles} from '../components/Particles';
import {LightSweep} from '../components/LightSweep';
import {ProductKind, ProductStandIn, Steam} from '../components/ProductStandIn';
import {Hairline, Letters, brandType, labelType} from '../components/Type';
import {useLayout} from '../hooks/useLayout';
import {tw} from '../motion/tokens';

const C = BRAND.colors;
const BLEND = 14;

type Entry = 'bloom' | 'iris' | 'slide' | 'light';
/** Transition vocabulary cycles so no two consecutive cuts feel the same. */
const ENTRIES: Entry[] = ['bloom', 'iris', 'slide', 'bloom', 'light', 'iris', 'slide'];

/**
 * 0:32–0:47 — Seven products, each a short macro "hero shot":
 * the product settles in, its name is set in brand type, the camera creeps closer,
 * then the shot rushes toward the lens (speed-ramp) as the next product arrives through
 * an iris, a wipe, a light flash or the brand pattern.
 */
export const ProductSequence: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const usable = durationInFrames - 18; // scene overlap tail
  const step = usable / PRODUCTS.length;

  return (
    <AbsoluteFill style={{background: C.brownNight}}>
      {PRODUCTS.map((p, i) => {
        const from = Math.round(i * step);
        const dur = Math.round(step) + BLEND + (i === PRODUCTS.length - 1 ? 18 : 0);
        return (
          <Sequence key={p.slot} from={from} durationInFrames={dur} layout="none">
            <ProductShot index={i} step={Math.round(step)} entry={ENTRIES[i % ENTRIES.length]} last={i === PRODUCTS.length - 1} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/** Frame (local to the product scene) where the mid-sequence pattern wipe sits. */
export const productPatternWipeAt = (sceneFrames: number) => Math.round(((sceneFrames - 18) / PRODUCTS.length) * 3);

const ProductShot: React.FC<{index: number; step: number; entry: Entry; last: boolean}> = ({index, step, entry, last}) => {
  const frame = useCurrentFrame();
  const {px, isPortrait, isSquare, width, height} = useLayout();
  const p = PRODUCTS[index];

  const inP = tw(frame, 0, BLEND + 4, 0, 1, 'glide');
  const settle = tw(frame, 0, 30, 0, 1, 'glide');
  const creep = tw(frame, 0, step + BLEND, 0, 1, 'drift');
  const rush = last ? 0 : tw(frame, step - 2, step + BLEND, 0, 1, 'ramp');
  const sweep = tw(frame, 16, 50, 0, 1, 'drift');

  let clipPath: string | undefined;
  let opacity = 1;
  if (index > 0) {
    if (entry === 'iris') clipPath = `circle(${inP * 80}% at ${isPortrait ? '50% 38%' : '62% 50%'})`;
    else if (entry === 'slide') clipPath = `inset(0 0 0 ${(1 - inP) * 100}%)`;
    else opacity = inP;
  }
  const flash = entry === 'light' && index > 0 ? Math.max(0, 1 - Math.abs(frame - 6) / 8) : 0;

  const cx = isPortrait ? 50 : isSquare ? 64 : 63;
  const cy = isPortrait ? 36 : isSquare ? 40 : 50;
  const objSize = px(isPortrait ? 900 : isSquare ? 620 : 820);
  const round = ['khova-naan', 'coconut-naan', 'biscuits', 'cakes'].includes(p.slot);

  const standIn = (
    <div
      style={{
        position: 'absolute',
        left: `${cx}%`,
        top: `${cy}%`,
        width: objSize,
        height: objSize,
        transform: `translate(-50%, -50%) scale(${0.9 + settle * 0.1 + creep * 0.1})`,
        filter: `drop-shadow(0 ${px(30)}px ${px(40)}px rgba(0,0,0,0.55))`,
      }}
    >
      <ProductStandIn kind={p.slot as ProductKind} lightAngle={210 + creep * 50} rotate={round ? -6 + creep * 10 : 0} />
      <Steam width={objSize} height={objSize} opacity={0.35 * settle} seed={p.slot} />
    </div>
  );

  const nameSize = Math.min(px(isPortrait ? 150 : 170), (width * (isPortrait ? 0.86 : 0.5)) / (p.name.length * 0.48));

  return (
    <AbsoluteFill style={{clipPath, opacity}}>
      <AbsoluteFill style={{transform: `scale(${1 + rush * 0.35})`, filter: `blur(${rush * px(18)}px)`, opacity: 1 - rush * 0.4}}>
        <MediaSlot
          slot={`products/${p.slot}`}
          label={`Product photo — ${p.name}`}
          tone={p.tone}
          zoom={1.02 + creep * 0.1}
          panX={isPortrait ? 0 : -creep * 1.5}
          standIn={standIn}
          labelScale={px(1.2)}
          style={{left: isPortrait ? 0 : '0%'}}
        />
        {/* warm key light + readable side for the type */}
        <AbsoluteFill
          style={{
            background: isPortrait
              ? `linear-gradient(0deg, ${C.brownNight}f2 0%, ${C.brownNight}aa 30%, transparent 55%)`
              : `linear-gradient(90deg, ${C.brownNight}f0 0%, ${C.brownNight}99 32%, transparent 58%)`,
          }}
        />
        <Particles seed={`crumb${index}`} count={10} color={C.goldPale} size={[10, 22]} rise={0.9} sway={40} blur={8} opacity={0.25} />
        <LightSweep progress={sweep} blend="soft-light" intensity={0.7} />
      </AbsoluteFill>

      {/* Typography */}
      <AbsoluteFill
        style={{
          justifyContent: isPortrait || isSquare ? 'flex-end' : 'center',
          padding: isPortrait ? `0 ${px(70)}px ${px(180)}px` : isSquare ? `0 ${px(70)}px ${px(110)}px` : `0 0 0 ${px(130)}px`,
          transform: `translateX(${-creep * px(20)}px)`,
          opacity: 1 - rush,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: px(18), marginBottom: px(22)}}>
          <span style={labelType(px(22), {color: C.gold, letterSpacing: '0.2em', opacity: settle})}>{String(index + 1).padStart(2, '0')}</span>
          <Hairline progress={tw(frame, 6, 34, 0, 1, 'reveal')} width={px(120)} color={C.gold} />
          <span style={labelType(px(18), {color: C.goldLight, opacity: settle * 0.8})}>Patel Bakery</span>
        </div>
        <Letters frame={frame} at={4} text={p.name.toUpperCase()} stagger={2} dur={20} rise={0.45} style={brandType(nameSize, {color: C.cream, whiteSpace: 'nowrap'})} />
      </AbsoluteFill>

      {flash > 0 && <AbsoluteFill style={{background: C.goldPale, opacity: flash * 0.7, mixBlendMode: 'screen'}} />}
    </AbsoluteFill>
  );
};
