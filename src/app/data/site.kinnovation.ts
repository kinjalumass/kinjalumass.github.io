/**
 * Site configuration for the standalone kinnovationgroup.com build.
 *
 * Swapped in for `site.ts` by the `kinnovation` configuration in angular.json.
 * Same components, same content — different domain, different root path, and
 * cross-links that leave for kinjalpandey.com.
 */

export const ORIGIN = 'https://kinnovationgroup.com';

/** The ventures are the whole site here, so they sit at the root. */
export const VENTURE_BASE = '';

export const EXTERNAL = {
  home: 'https://kinjalpandey.com/' as string | null,
  developer: 'https://kinjalpandey.com/developer' as string | null,
};

export const PERSON = {
  name: 'Kinjal Pandey',
  jobTitle: 'Founder, Kinnovation',
  worksFor: 'Kinnovation',
  alumniOf: ['University of Massachusetts Amherst', 'Virginia Tech'],
  location: 'Amherst, Massachusetts, United States',
  email: 'kinjalpandey18@gmail.com',
  image: 'img/pitches/pitch-umass-stage.jpg',
  sameAs: [
    'https://kinjalpandey.com/',
    'https://www.linkedin.com/in/kinjalpandey',
    'https://github.com/kinjalumass',
  ],
  knowsAbout: ['Entrepreneurship', 'Product strategy', 'Machine learning'],
};

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  image?: string;
  priority: number;
  /**
   * Kept for shape-compatibility with site.ts, which uses it to hand the
   * entrepreneur pages over to this domain. Nothing here sets it: this *is*
   * the canonical copy of those pages.
   */
  canonical?: string;
}

export const PAGES: PageMeta[] = [
  {
    path: '',
    title: 'Kinnovation: a venture studio by Kinjal Pandey',
    description:
      'Six ventures, three of them funded. Kinnovation builds where the evidence needed to fix a broken system already exists but sits in a thousand disconnected places.',
    image: 'img/pitches/pitch-umass-stage.jpg',
    priority: 1.0,
  },
];

export const VENTURE_PAGES: PageMeta[] = [
  ['measmi', 'MeAsmi', 'Finding what actually worked for children whose symptoms match yours, not whose diagnosis does.'],
  ['karnah', 'Karnah', 'In-kind giving you can trace from your door to the person who needed it. Second place and $750 at UMass UPitch 2026.'],
  ['calendai', 'CalendAI', 'A calendar that reschedules itself when the day breaks. $500 from the Apex Center for Entrepreneurs at Virginia Tech.'],
  ['nutri-navigator', 'NutriNavigator', 'What to eat, when and where, worked out from your body, your calendar and what is within walking distance.'],
  ['witness-platform', 'Witness', 'A record of what people saw, kept sealed until the person it happened to asks for it.'],
  ['trendify', 'Trendify AI', 'Matches live trend data to the footage already in your camera roll. Minute Pitch winner, $300, UMass Amherst.'],
].map(([slug, name, blurb]) => ({
  path: slug,
  title: `${name}: a venture by Kinjal Pandey`,
  description: `${blurb} One of six ventures in the Kinnovation portfolio.`,
  priority: 0.7,
}));

export const ALL_PAGES: PageMeta[] = [...PAGES, ...VENTURE_PAGES];

export function urlFor(path: string): string {
  return path ? `${ORIGIN}/${path}` : `${ORIGIN}/`;
}

export function metaFor(path: string): PageMeta {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return ALL_PAGES.find((p) => p.path === clean) ?? ALL_PAGES[0];
}
