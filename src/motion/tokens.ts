/**
 * MOTION LANGUAGE
 *
 * Easing curves are built with Framer Motion's pure `cubicBezier` so the exact same
 * curves can drive Framer Motion previews/web usage (`transition={{ease: CURVES.glide}}`)
 * and Remotion's deterministic, frame-based rendering below.
 * Remotion owns the clock (useCurrentFrame); Framer Motion supplies the curve maths.
 */
import {cubicBezier} from 'framer-motion';
import {interpolate} from 'remotion';

/** Raw bezier definitions — reuse these in Framer Motion `transition.ease`. */
export const CURVES = {
  /** Slow, confident settle — the house curve. */
  glide: [0.22, 1, 0.36, 1],
  /** Gentle in-out for camera drifts. */
  drift: [0.45, 0, 0.55, 1],
  /** Soft acceleration for exits. */
  exit: [0.55, 0, 0.75, 0.2],
  /** Reveal — quick start, very long tail (mask / light). */
  reveal: [0.16, 1, 0.3, 1],
  /** Speed-ramp: fast through the middle, slow at both ends. */
  ramp: [0.83, 0, 0.17, 1],
} as const satisfies Record<string, [number, number, number, number]>;

export type CurveName = keyof typeof CURVES;

export const EASE: Record<CurveName, (t: number) => number> = Object.fromEntries(
  Object.entries(CURVES).map(([k, v]) => [k, cubicBezier(v[0], v[1], v[2], v[3])]),
) as Record<CurveName, (t: number) => number>;

/**
 * Deterministic tween: frame → value, clamped, eased with a house curve.
 *   tw(frame, 10, 40, 0, 1, 'glide')
 */
export const tw = (
  frame: number,
  start: number,
  end: number,
  from = 0,
  to = 1,
  curve: CurveName = 'glide',
) =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE[curve],
  });

/** 0→1→0 envelope: fade in over `inDur`, hold, fade out over `outDur`, ending at `end`. */
export const envelope = (
  frame: number,
  start: number,
  end: number,
  inDur: number,
  outDur: number,
  curve: CurveName = 'glide',
) => Math.min(tw(frame, start, start + inDur, 0, 1, curve), tw(frame, end - outDur, end, 1, 0, 'exit'));

/** Blur-to-sharp helper: returns a CSS filter string. */
export const blurTo = (progress: number, maxPx: number) =>
  `blur(${((1 - progress) * maxPx).toFixed(2)}px)`;

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
