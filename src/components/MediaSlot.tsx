import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo} from 'remotion';
import {BRAND} from '../config/brand';
import {FILM} from '../config/film';
import {resolveMedia} from '../assets';

const C = BRAND.colors;

type Props = {
  /** slot path under public/patel-bakery, e.g. "heritage/founder" */
  slot: string;
  /** what the photo should show — printed on the placeholder */
  label: string;
  /** Ken-Burns style scale applied to the media */
  zoom?: number;
  panX?: number;
  panY?: number;
  /** archival treatment (sepia, softer contrast) */
  archival?: boolean;
  tone?: string;
  labelScale?: number;
  /** rendered behind the label when there is no photo (e.g. a product stand-in) */
  standIn?: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * A replaceable photo / video slot. If a file exists in the slot folder it is used;
 * otherwise a clearly-labelled placeholder is rendered (never a fake photograph).
 */
export const MediaSlot: React.FC<Props> = ({
  slot,
  label,
  zoom = 1,
  panX = 0,
  panY = 0,
  archival = false,
  tone = C.gold,
  labelScale = 1,
  standIn,
  style,
}) => {
  const media = resolveMedia(slot);
  const transform = `scale(${zoom}) translate(${panX}%, ${panY}%)`;
  const filter = archival ? 'sepia(0.55) contrast(0.92) brightness(0.96)' : undefined;

  if (media) {
    const common: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', transform, filter};
    return (
      <AbsoluteFill style={{overflow: 'hidden', ...style}}>
        {media.kind === 'video' ? <OffthreadVideo src={media.src} muted style={common} /> : <Img src={media.src} style={common} />}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{overflow: 'hidden', ...style}}>
      <AbsoluteFill
        style={{
          transform,
          background: archival
            ? `radial-gradient(ellipse 70% 60% at 45% 40%, ${C.goldPale} 0%, ${C.goldLight} 45%, ${C.gold} 100%)`
            : `radial-gradient(ellipse 65% 60% at 55% 45%, ${tone} 0%, ${C.brownSoft} 55%, ${C.brownDeep} 100%)`,
        }}
      >
        {standIn}
      </AbsoluteFill>
      {FILM.showPlaceholderLabels && (
        <div
          style={{
            position: 'absolute',
            left: 14 * labelScale,
            bottom: 12 * labelScale,
            right: 14 * labelScale,
            fontFamily: 'monospace',
            fontSize: 13 * labelScale,
            lineHeight: 1.35,
            letterSpacing: '0.06em',
            color: archival ? C.brown : C.goldPale,
            opacity: 0.7,
            textTransform: 'uppercase',
          }}
        >
          <div style={{display: 'inline-block', border: `1px solid currentColor`, padding: `${3 * labelScale}px ${7 * labelScale}px`}}>
            Placeholder · {label}
          </div>
          <div style={{marginTop: 4 * labelScale, textTransform: 'none', opacity: 0.8}}>→ public/patel-bakery/{slot}/</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
