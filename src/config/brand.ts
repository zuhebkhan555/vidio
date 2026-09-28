/**
 * PATEL BAKERY — BRAND SYSTEM
 * Source: Patel Bakery Logo Design Brand Kit (font ARKHIP, kerning -70, #BA8954 / #522F14).
 * Every colour in the film is derived from these two brand colours plus a cream for contrast.
 */
export const BRAND = {
  name: 'Patel Bakery',
  fullName: 'Patel Bakery & Sweets',

  colors: {
    /** Deep brown — primary brand colour */
    brown: '#522F14',
    /** Warm gold / caramel — primary brand colour */
    gold: '#BA8954',
    /** Cream / off-white used only for contrast */
    cream: '#F4E9D8',
    // Tints & shades of the two brand colours (no unrelated hues)
    brownDeep: '#2A170A',
    brownNight: '#1A0E06',
    brownSoft: '#6B4020',
    goldLight: '#D9B485',
    goldPale: '#E8CFA8',
  },

  fonts: {
    /**
     * ARKHIP is the brand typeface (the logo wordmark itself is used as official outlines).
     * Montserrat — the face used in the brand-kit document — stands in until the ARKHIP
     * font file is supplied. Drop the font file into
     * public/patel-bakery/fonts/ (e.g. Arkhip.otf / Arkhip.ttf / Arkhip.woff2)
     * and it is picked up automatically.
     */
    brand: 'Arkhip',
    brandFallback: 'PB Montserrat',
    /** Editorial serif used for story lines (supporting face, not part of the logo) */
    story: 'PB Cormorant',
  },

  /**
   * Brand kit kerning: -70 (Illustrator units = 1/1000 em) → -0.07em.
   * Applied when ARKHIP is loaded; Montserrat gets a lighter value to stay legible.
   */
  kerning: {
    arkhip: '-0.07em',
    fallback: '-0.02em',
  },
} as const;

export type BrandColor = keyof typeof BRAND.colors;
