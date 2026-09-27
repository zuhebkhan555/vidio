/**
 * SOUND DESIGN CUE SHEET
 *
 * Drop royalty-free / licensed audio files into public/patel-bakery/audio/ using the
 * file names below. Any cue whose file is missing is simply skipped, so the film
 * always renders. No copyrighted music is bundled.
 *
 * `at` is in seconds on the master timeline. `duration` (seconds) limits the clip;
 * omit it to let the file play out. Fades are in seconds.
 */
export type AudioCue = {
  id: string;
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
  {id: 'music', file: 'music.mp3', at: 0, duration: 60, volume: 0.7, fadeIn: 2, fadeOut: 3, note: 'Soft cinematic score, full length (60s)'},
  {id: 'room-tone', file: 'oven-ambience.mp3', at: 0, duration: 60, volume: 0.18, fadeIn: 3, fadeOut: 3, loop: true, note: 'Warm bakery / oven room tone bed'},

  {id: 'logo-rise', file: 'logo-riser.mp3', at: 4.2, volume: 0.5, note: 'Soft riser into the logo'},
  {id: 'logo-hit', file: 'logo-reveal.mp3', at: 6.4, volume: 0.65, note: 'Logo reveal accent (light sweep)'},

  {id: 'paper-1', file: 'paper.mp3', at: 12.2, volume: 0.45, note: 'Paper / photograph texture as heritage begins'},
  {id: 'paper-2', file: 'paper.mp3', at: 16.4, volume: 0.35, note: 'Paper turn — second generation'},

  {id: 'flour', file: 'flour.mp3', at: 22.3, volume: 0.5, note: 'Flour dust / sift'},
  {id: 'dough', file: 'dough.mp3', at: 24.8, volume: 0.45, note: 'Dough knead'},
  {id: 'oven', file: 'oven-door.mp3', at: 27.2, volume: 0.5, note: 'Oven door + heat'},
  {id: 'crackle', file: 'crust-crackle.mp3', at: 29.6, volume: 0.4, note: 'Fresh crust crackle'},

  {id: 'whoosh-1', file: 'whoosh.mp3', at: 31.7, volume: 0.35, note: 'Pattern transition into products'},
  {id: 'whoosh-2', file: 'whoosh.mp3', at: 38.1, volume: 0.25, note: 'Mid-product pattern wipe'},
  {id: 'packaging', file: 'packaging.mp3', at: 42.4, volume: 0.35, note: 'Packaging / box texture'},
  {id: 'whoosh-3', file: 'whoosh.mp3', at: 46.6, volume: 0.3, note: 'Transition into family'},

  {id: 'final-impact', file: 'final-impact.mp3', at: 56.2, volume: 0.7, note: 'Final logo impact'},
];

export const AUDIO_DIR = 'patel-bakery/audio';
