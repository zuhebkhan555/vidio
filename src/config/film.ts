/**
 * FILM CONFIGURATION — change duration, frame rate, formats, timing and copy here.
 */

export const FILM = {
  /** Frames per second */
  fps: 30,
  /** Total runtime in seconds */
  durationInSeconds: 60,

  /**
   * Show small "PLACEHOLDER — drop file here" labels on image slots that have no
   * real photo yet. Set to false for a clean preview once all photos are supplied.
   */
  showPlaceholderLabels: true,

  /**
   * FOUNDING DATE — no separate date is shown by default.
   * The official logo artwork reads "SINCE 1949" and is shown exactly as supplied.
   * Earlier business info said 1952; that discrepancy is unresolved, so the film adds
   * no date of its own. Set a confirmed year here and flip `showFoundingYear` to use it.
   */
  foundingYear: '1952',
  showFoundingYear: false,
} as const;

export const FORMATS = {
  landscape: {id: 'PatelBakeryIntro60', width: 1920, height: 1080},
  vertical: {id: 'PatelBakeryIntro60-Vertical', width: 1080, height: 1920},
  square: {id: 'PatelBakeryIntro60-Square', width: 1080, height: 1080},
} as const;

/**
 * Scene timing in seconds. Scenes overlap slightly (`overlap`) so transitions
 * blend instead of cutting. Adjust freely — everything downstream is derived.
 */
export const TIMELINE = {
  opening: {start: 0, end: 5},
  logo: {start: 5, end: 12},
  heritage: {start: 12, end: 22},
  craft: {start: 22, end: 32},
  products: {start: 32, end: 47},
  family: {start: 47, end: 55},
  final: {start: 55, end: 60},
} as const;

export type SceneId = keyof typeof TIMELINE;

/** Blend time (seconds) where one scene hands over to the next. */
export const OVERLAP = 0.6;

export const COPY = {
  heritageLine: 'A tradition built across generations.',
  founderLabel: 'Founded by',
  continuedLabel: 'Carried forward by',
  todayLabel: 'And today',
  craftWords: ['Ingredients', 'Craft', 'Baking', 'Fresh'] as const,
  familyStatementA: 'Generations change.',
  familyStatementB: 'The tradition continues.',
  finalStatement: ['Tradition.', 'Taste.', 'Together.'] as const,
};

export const FAMILY = {
  founder: 'Abdul Jabbar Khan',
  second: 'Shabbir Ahmed Khan',
  current: ['Asim Khan', 'Safi Khan', 'Zuheb Khan'],
} as const;

/**
 * Product line-up. `slot` maps to public/patel-bakery/products/<slot>/ (any image or
 * video inside that folder) or public/patel-bakery/products/<slot>.jpg|png|webp|mp4.
 * `tone` tints the placeholder so each product reads differently before real photos exist.
 */
export const PRODUCTS = [
  {slot: 'khova-naan', name: 'Khova Naan', tone: '#C8935A'},
  {slot: 'coconut-naan', name: 'Coconut Naan', tone: '#D9B485'},
  {slot: 'warky', name: 'Warky', tone: '#B97D45'},
  {slot: 'biscuits', name: 'Biscuits', tone: '#C99A62'},
  {slot: 'buns', name: 'Buns', tone: '#B8804A'},
  {slot: 'rusks', name: 'Rusks', tone: '#A86F3C'},
  {slot: 'cakes', name: 'Cakes', tone: '#8E5A2E'},
] as const;

export const sec = (s: number) => Math.round(s * FILM.fps);
export const TOTAL_FRAMES = sec(FILM.durationInSeconds);
