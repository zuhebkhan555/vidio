import React, {useId} from 'react';
import {random, useCurrentFrame} from 'remotion';
import {BRAND} from '../config/brand';

const C = BRAND.colors;

export type ProductKind = 'khova-naan' | 'coconut-naan' | 'warky' | 'biscuits' | 'buns' | 'rusks' | 'cakes' | 'dough';

/**
 * Procedural, clearly-placeholder "stand-in" for a product until real photography is supplied.
 * Surfaces use SVG turbulence + diffuse lighting to read as baked crust, lit by warm key light.
 * `bake` (0..1) shifts from raw dough to golden-brown; `lightAngle` animates the key light.
 */
export const ProductStandIn: React.FC<{
  kind: ProductKind;
  bake?: number;
  lightAngle?: number;
  rotate?: number;
  size?: number | string;
}> = ({kind, bake = 1, lightAngle = 235, rotate = 0, size = '100%'}) => {
  const id = useId().replace(/:/g, '');
  const top = mixHex('#F1E2C8', '#E2B476', bake);
  const mid = mixHex('#E8D4B2', '#C3843F', bake);
  const edge = mixHex('#D9C09A', '#7A4520', bake);
  const g = `url(#body-${id})`;
  const f = `url(#crust-${id})`;

  const shapes: Record<ProductKind, React.ReactNode> = {
    dough: <path d={blob(500, 520, 250, 215, 'dough', 0.05)} fill={g} filter={f} />,
    'khova-naan': (
      <>
        <path d={blob(500, 520, 360, 250, 'kn', 0.04)} fill={g} filter={f} />
        <Spots seed="kn" n={26} cx={500} cy={520} rx={300} ry={200} color={C.brown} r={[5, 14]} opacity={0.45} />
      </>
    ),
    'coconut-naan': (
      <>
        <path d={blob(500, 520, 350, 245, 'cn', 0.04)} fill={g} filter={f} />
        <Spots seed="cn" n={70} cx={500} cy={520} rx={300} ry={200} color={C.cream} r={[2, 6]} opacity={0.85} />
      </>
    ),
    warky: (
      <>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={250 + i * 8} y={560 - i * 42} width={500 - i * 16} height={70} rx={34} fill={g} filter={f} opacity={1 - i * 0.04} />
        ))}
      </>
    ),
    biscuits: (
      <>
        {[
          [360, 600, 150],
          [640, 600, 150],
          [500, 470, 160],
          [380, 360, 130],
          [630, 360, 130],
        ].map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={g} filter={f} />
            <circle cx={x} cy={y} r={r * 0.82} fill="none" stroke={edge} strokeOpacity={0.35} strokeWidth={4} strokeDasharray="2 14" />
          </g>
        ))}
      </>
    ),
    buns: (
      <>
        {[
          [330, 580, 170],
          [670, 580, 170],
          [500, 470, 190],
        ].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.82} fill={g} filter={f} />
        ))}
      </>
    ),
    rusks: (
      <>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={230 + i * 95} y={330 + (i % 2) * 20} width={130} height={360} rx={22} fill={g} filter={f} transform={`rotate(${-14 + i * 7} ${295 + i * 95} 510)`} />
        ))}
      </>
    ),
    cakes: (
      <>
        <ellipse cx={500} cy={680} rx={330} ry={95} fill={edge} filter={f} />
        <rect x={170} y={440} width={660} height={240} fill={g} filter={f} />
        <rect x={170} y={540} width={660} height={16} fill={C.cream} opacity={0.75} />
        <rect x={170} y={605} width={660} height={12} fill={C.cream} opacity={0.6} />
        <ellipse cx={500} cy={440} rx={330} ry={95} fill={top} filter={f} />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 1000 1000" width={size} height={size} style={{overflow: 'visible', transform: `rotate(${rotate}deg)`}}>
      <defs>
        <radialGradient id={`body-${id}`} cx="45%" cy="38%" r="70%">
          <stop offset="0%" stopColor={top} />
          <stop offset="55%" stopColor={mid} />
          <stop offset="100%" stopColor={edge} />
        </radialGradient>
        <filter id={`crust-${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="4" seed={7} result="n" />
          <feDiffuseLighting in="n" surfaceScale={2 + bake * 4} lightingColor="#FFF1DC" result="lit">
            <feDistantLight azimuth={lightAngle} elevation={48} />
          </feDiffuseLighting>
          <feComposite in="lit" in2="SourceGraphic" operator="arithmetic" k1={1.05} k2={0.12} k3={0} k4={0} result="shaded" />
          <feComposite in="shaded" in2="SourceAlpha" operator="in" />
        </filter>
        <radialGradient id={`shadow-${id}`}>
          <stop offset="0%" stopColor="#000" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={500} cy={760} rx={420} ry={90} fill={`url(#shadow-${id})`} />
      {shapes[kind]}
    </svg>
  );
};

const Spots: React.FC<{seed: string; n: number; cx: number; cy: number; rx: number; ry: number; color: string; r: [number, number]; opacity: number}> = ({
  seed, n, cx, cy, rx, ry, color, r, opacity,
}) => (
  <g opacity={opacity}>
    {new Array(n).fill(0).map((_, i) => {
      const a = random(`${seed}a${i}`) * Math.PI * 2;
      const d = Math.sqrt(random(`${seed}d${i}`));
      const rr = r[0] + random(`${seed}r${i}`) * (r[1] - r[0]);
      return <ellipse key={i} cx={cx + Math.cos(a) * rx * d} cy={cy + Math.sin(a) * ry * d} rx={rr} ry={rr * 0.7} fill={color} />;
    })}
  </g>
);

/** Slightly irregular organic outline — hand-made, not a perfect vector ellipse. */
const blob = (cx: number, cy: number, rx: number, ry: number, seed: string, wobble: number) => {
  const pts = 28;
  const coords = new Array(pts).fill(0).map((_, i) => {
    const a = (i / pts) * Math.PI * 2;
    const k = 1 + (random(`${seed}w${i}`) - 0.5) * 2 * wobble;
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  });
  const mid = (p: number[], q: number[]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let d = `M ${mid(coords[pts - 1], coords[0]).join(' ')}`;
  coords.forEach((p, i) => {
    const m = mid(p, coords[(i + 1) % pts]);
    d += ` Q ${p[0]} ${p[1]} ${m[0]} ${m[1]}`;
  });
  return d + ' Z';
};

export const mixHex = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`;
};

/** Soft rising steam wisps (blurred strokes). */
export const Steam: React.FC<{opacity?: number; width: number; height: number; seed?: string}> = ({opacity = 0.5, width, height, seed = 'st'}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0, filter: `blur(${width * 0.012}px)`, opacity}}>
      {[0, 1, 2, 3, 4].map((i) => {
        const x0 = width * (0.3 + 0.1 * i + (random(`${seed}${i}`) - 0.5) * 0.05);
        const t = (frame / 70 + random(`${seed}t${i}`)) % 1;
        const y0 = height * (0.75 - t * 0.55);
        const amp = width * 0.04;
        const d = `M ${x0} ${y0 + height * 0.25} C ${x0 - amp} ${y0 + height * 0.15}, ${x0 + amp} ${y0 + height * 0.08}, ${x0} ${y0}`;
        return (
          <path key={i} d={d} stroke="#FFF4E2" strokeWidth={width * 0.018} strokeLinecap="round" fill="none" opacity={Math.sin(t * Math.PI) * 0.8} />
        );
      })}
    </svg>
  );
};
