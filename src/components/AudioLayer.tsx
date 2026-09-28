import React from 'react';
import {Audio, Sequence, interpolate, useVideoConfig} from 'remotion';
import {AUDIO_CUES, AUDIO_DIR} from '../config/audio';
import {resolveAudio} from '../assets';

/**
 * Plays every cue in config/audio.ts whose file exists in public/patel-bakery/audio/.
 * Missing files are skipped silently, so the film renders with or without sound.
 */
export const AudioLayer: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <>
      {AUDIO_CUES.map((c) => {
        const src = resolveAudio(`${AUDIO_DIR}/${c.file}`);
        if (!src) return null;
        const from = Math.round(c.at * fps);
        const len = Math.min(durationInFrames - from, c.duration ? Math.round(c.duration * fps) : durationInFrames - from);
        const fi = Math.max(1, Math.round((c.fadeIn ?? 0) * fps));
        const fo = Math.max(1, Math.round((c.fadeOut ?? 0) * fps));
        return (
          <Sequence key={c.id} from={from} durationInFrames={len} name={`♪ ${c.id}`}>
            <Audio
              src={src}
              loop={c.loop}
              volume={(f) =>
                c.volume *
                interpolate(f, [0, fi, Math.max(fi + 1, len - fo), len], [c.fadeIn ? 0 : 1, 1, 1, c.fadeOut ? 0 : 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })
              }
            />
          </Sequence>
        );
      })}
    </>
  );
};
