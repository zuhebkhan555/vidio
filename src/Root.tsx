import React from 'react';
import {Composition, Folder} from 'remotion';
import {FILM, FORMATS, TOTAL_FRAMES} from './config/film';
import {PatelBakeryIntro60} from './PatelBakeryIntro60';

/**
 * Three deliverables from one film. Scenes read the frame size via useLayout() and
 * re-compose for each aspect ratio — nothing is cropped from the 16:9 master.
 */
export const RemotionRoot: React.FC = () => (
  <Folder name="Patel-Bakery">
    {Object.values(FORMATS).map((f) => (
      <Composition
        key={f.id}
        id={f.id}
        component={PatelBakeryIntro60}
        durationInFrames={TOTAL_FRAMES}
        fps={FILM.fps}
        width={f.width}
        height={f.height}
      />
    ))}
  </Folder>
);
