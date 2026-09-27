// Renders review stills (one per story beat) for each format into out/stills/.
//   node scripts/render-stills.mjs [compositionId] [seconds...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

const [, , compArg, ...secArgs] = process.argv;
const comps = compArg ? [compArg] : ['PatelBakeryIntro60', 'PatelBakeryIntro60-Vertical', 'PatelBakeryIntro60-Square'];
const seconds = secArgs.length ? secArgs.map(Number) : [1.5, 4.6, 7.5, 11, 14, 17.5, 21, 24, 28, 31, 34, 39, 45, 49.5, 53.5, 59.5];
const browserExecutable = process.env.REMOTION_BROWSER || null;

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
mkdirSync('out/stills', {recursive: true});
for (const id of comps) {
  const composition = await selectComposition({serveUrl, id, browserExecutable});
  for (const s of seconds) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
    const output = `out/stills/${id}-${String(s).replace('.', '_')}s.jpg`;
    await renderStill({composition, serveUrl, frame, output, imageFormat: 'jpeg', jpegQuality: 85, browserExecutable, scale: 0.5});
    console.log('✓', output);
  }
}
