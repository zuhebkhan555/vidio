/**
 * SOUND DESIGN CUE SHEET
 *
 * `file` is a name without extension; any of .wav / .mp3 / .m4a / .aac / .ogg in
 * public/patel-bakery/audio/ matches. The bundled files are ORIGINAL, synthesised by
 * scripts/generate-audio.py (no samples, no copyrighted music). Replace any file with
 * professionally produced / licensed audio of the same name to upgrade it.
 * A cue whose file is missing is simply skipped, so the film always renders.
 *
 * `at` is in seconds on the master timeline. `duration` (seconds) limits the clip;
 * omit it to let the file play out. Fades are in seconds.
 */
export type AudioCue = {
  id: string;
  /** file name without extension */
  file: string;
  at: number;
  duration?: number;
  volume: number;
  fadeIn?: number;
  fadeOut?: number;
  loop?: boolean;
  note: string;
};

export const AUDIO_CUES: AudioCue[] = [
  {id: 'music', file: 'music', at: 0, duration: 60, volume: 0.49, fadeIn: 2, fadeOut: 3, note: 'Soft cinematic score, full length (60s)'},
  {id: 'room-tone', file: 'oven-ambience', at: 0, duration: 60, volume: 0.13, fadeIn: 3, fadeOut: 3, loop: true, note: 'Warm bakery / oven room tone bed'},

  {id: 'logo-rise', file: 'logo-riser', at: 2.65, volume: 0.35, note: 'Soft riser into the logo'},
  {id: 'logo-hit', file: 'logo-reveal', at: 5.0, volume: 0.45, note: 'Point of light blooms into the emblem'},

  {id: 'whoosh-0', file: 'whoosh', at: 11.4, volume: 0.21, note: 'Pattern wipe logo → heritage'},
  {id: 'paper-1', file: 'paper', at: 12.2, volume: 0.32, note: 'Paper / photograph texture as heritage begins'},
  {id: 'paper-2', file: 'paper', at: 17.4, volume: 0.24, note: 'Paper turn — second generation'},

  {id: 'flour', file: 'flour', at: 22.3, volume: 0.35, note: 'Flour dust / sift'},
  {id: 'dough', file: 'dough', at: 24.8, volume: 0.32, note: 'Dough knead'},
  {id: 'oven', file: 'oven-door', at: 27.2, volume: 0.35, note: 'Oven door + heat'},
  {id: 'crackle', file: 'crust-crackle', at: 29.6, volume: 0.28, note: 'Fresh crust crackle'},

  {id: 'whoosh-1', file: 'whoosh', at: 31.35, volume: 0.24, note: 'Pattern transition into products'},
  {id: 'whoosh-2', file: 'whoosh', at: 37.8, volume: 0.17, note: 'Mid-product pattern wipe'},
  {id: 'packaging', file: 'packaging', at: 42.4, volume: 0.24, note: 'Packaging / box texture'},
  {id: 'whoosh-3', file: 'whoosh', at: 46.6, volume: 0.21, note: 'Transition into family'},

  {id: 'final-impact', file: 'final-impact', at: 55.1, volume: 0.49, note: 'Final logo impact'},
];

export const AUDIO_DIR = 'patel-bakery/audio';
