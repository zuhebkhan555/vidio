import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {BRAND} from './config/brand';
import {FILM, OVERLAP, SceneId, TIMELINE, sec} from './config/film';
import {loadFonts} from './fonts';
import {Grain, Vignette} from './components/Texture';
import {AudioLayer} from './components/AudioLayer';
import {OpeningAtmosphere} from './scenes/OpeningAtmosphere';
import {PatelLogoReveal} from './scenes/PatelLogoReveal';
import {HeritageSequence} from './scenes/HeritageSequence';
import {CraftSequence} from './scenes/CraftSequence';
import {ProductSequence, productPatternWipeAt} from './scenes/ProductSequence';
import {FamilyLegacySequence} from './scenes/FamilyLegacySequence';
import {FinalBrandReveal} from './scenes/FinalBrandReveal';
import {PatternTransition} from './scenes/PatternTransition';

loadFonts();

const SCENES: Record<SceneId, React.FC> = {
  opening: OpeningAtmosphere,
  logo: PatelLogoReveal,
  heritage: HeritageSequence,
  craft: CraftSequence,
  products: ProductSequence,
  family: FamilyLegacySequence,
  final: FinalBrandReveal,
};

const LABELS: Record<SceneId, string> = {
  opening: '01 · Opening atmosphere',
  logo: '02 · PatelLogoReveal',
  heritage: '03 · HeritageSequence',
  craft: '04 · CraftSequence',
  products: '05 · ProductSequence',
  family: '06 · FamilyLegacySequence',
  final: '07 · FinalBrandReveal',
};

/** Where the brand-pattern signature transition is used (strategically, not constantly). */
const PATTERN_CUTS: Array<{at: number; dur: number; variant: 'diagonal' | 'iris'; direction?: 1 | -1; name: string}> = [
  {at: TIMELINE.heritage.start, dur: 1.1, variant: 'diagonal', name: 'Pattern · logo → heritage'},
  {at: TIMELINE.products.start, dur: 1.2, variant: 'iris', name: 'Pattern · bake → products'},
  {
    at: TIMELINE.products.start + productPatternWipeAt(sec(TIMELINE.products.end - TIMELINE.products.start + OVERLAP)) / FILM.fps,
    dur: 0.9,
    variant: 'diagonal',
    direction: -1,
    name: 'Pattern · mid-products',
  },
];

/**
 * PATEL BAKERY — 60-second brand film.
 * Tradition → Craft → Taste → Generations.
 * Each scene runs slightly past its end (OVERLAP) so the next one can dissolve over it.
 */
export const PatelBakeryIntro60: React.FC = () => {
  const ids = Object.keys(TIMELINE) as SceneId[];
  return (
    <AbsoluteFill style={{background: BRAND.colors.brownNight}}>
      {ids.map((id, i) => {
        const {start, end} = TIMELINE[id];
        const last = i === ids.length - 1;
        const Scene = SCENES[id];
        return (
          <Sequence key={id} name={LABELS[id]} from={sec(start)} durationInFrames={sec(end - start + (last ? 0 : OVERLAP))}>
            <Scene />
          </Sequence>
        );
      })}

      {PATTERN_CUTS.map((c) => (
        <Sequence key={c.name} name={c.name} from={sec(c.at - c.dur / 2)} durationInFrames={sec(c.dur)}>
          <PatternTransition variant={c.variant} direction={c.direction} />
        </Sequence>
      ))}

      <Vignette strength={0.55} />
      <Grain opacity={0.08} />
      <AudioLayer />
    </AbsoluteFill>
  );
};
