/**
 * Everything search engines and social platforms read about this site.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  CHANGE `ORIGIN` WHEN THE DOMAIN IS LIVE.                            │
 * │  It is the only place the domain appears. Canonical URLs, the        │
 * │  sitemap, the structured data and every social card are built from   │
 * │  it, and `tools/seo.py` reads it too.                                │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * Ranking for a personal name is mostly about three things: one page that is
 * unambiguously about the person, agreement between that page and the
 * profiles that already rank (LinkedIn, GitHub, the arXiv paper), and real
 * HTML for the crawler rather than an empty shell. The first two are content;
 * the third is why this site prerenders.
 */

export const ORIGIN = 'https://kinjalpandey.com';

/**
 * Where the Kinnovation section lives in the URL, and how it links back out.
 *
 * The same components serve two sites. On kinjalpandey.com the ventures sit
 * under /entrepreneur and the cross-links are ordinary in-app routes. On
 * kinnovationgroup.com the ventures are at the root and those cross-links
 * have to leave the site, so they become absolute URLs.
 *
 * `src/app/data/site.kinnovation.ts` is swapped in for that build — see the
 * `kinnovation` configuration in angular.json.
 */
export const VENTURE_BASE = '/entrepreneur';

/** null means "stay in the app and use the router". */
export const EXTERNAL = {
  home: null as string | null,
  developer: null as string | null,
};

export const PERSON = {
  name: 'Kinjal Pandey',
  /** Used in structured data; helps disambiguate from other people */
  jobTitle: 'Computer Science graduate student, founder, and model',
  worksFor: 'University of Massachusetts Amherst',
  alumniOf: ['University of Massachusetts Amherst', 'Virginia Tech'],
  location: 'Amherst, Massachusetts, United States',
  email: 'kinjalpandey18@gmail.com',
  image: 'img/model/carle/carle-01.jpg',
  /**
   * sameAs is the single strongest signal for a name query. Every profile
   * that already ranks for "Kinjal Pandey" should be listed, so the engines
   * merge them into one entity instead of competing results.
   */
  sameAs: [
    'https://www.linkedin.com/in/kinjalpandey',
    'https://github.com/kinjalumass',
    'https://medium.com/@kinjalpandey18',
    'https://arxiv.org/abs/2601.05076',
  ],
  knowsAbout: [
    'Machine learning',
    'Privacy-preserving AI',
    'Cryptography',
    'Data science',
    'Software engineering',
    'Entrepreneurship',
  ],
};

export interface PageMeta {
  /** Route path, without a leading slash. '' is the home page. */
  path: string;
  title: string;
  description: string;
  /** Social card image, relative to the site root */
  image?: string;
  /** Included in the sitemap; lower for deep pages */
  priority: number;
  /**
   * Absolute URL to credit instead of this one.
   *
   * The Kinnovation pages exist on both domains. Pointing the canonical at
   * kinnovationgroup.com tells search engines which copy to rank, so the two
   * sites reinforce each other rather than splitting the signal.
   */
  canonical?: string;
}

/**
 * One entry per route. The description is what shows under the link in a
 * search result — it is not a ranking factor, but it decides whether anyone
 * clicks. Each one is written to read as a sentence, under ~155 characters,
 * and to contain the name.
 */
export const PAGES: PageMeta[] = [
  {
    path: '',
    title: 'Kinjal Pandey | Portfolio: Computer Science, AI, Ventures, Modeling',
    description:
      'Official portfolio and personal website of Kinjal Pandey, a computer science master’s student at UMass Amherst and a Virginia Tech graduate. AI and machine learning research, six ventures, and a modeling portfolio.',
    image: 'img/model/carle/carle-01.jpg',
    priority: 1.0,
  },
  {
    path: 'developer',
    title: 'Kinjal Pandey | AI Researcher, Data Scientist, Software Engineer',
    description:
      'The computer science work of Kinjal Pandey at UMass Amherst: machine learning, privacy, security and responsible AI, published research on sanitizing chain-of-thought, and civic data science for the Boston Cyclists Union.',
    image: 'img/bcu/cohort-stairs.jpg',
    priority: 0.9,
  },
  {
    path: 'developer/education',
    title: 'Kinjal Pandey | Education: UMass Amherst MSCS, Virginia Tech BS',
    description:
      'Kinjal Pandey studies MS Computer Science at the Manning College of Information and Computer Sciences, UMass Amherst, after a B.S. in Computer Science with a Mathematics minor from Virginia Tech, finished a year early.',
    priority: 0.6,
  },
  {
    path: 'developer/experience',
    title: 'Kinjal Pandey | Experience: Research, Data Science, Consulting',
    description:
      'Sixteen roles across research, applied data science, consulting and technology leadership: the UMass Center for Data Science and AI, the Commonwealth Cyber Initiative, and student ambassadorships with Google, Microsoft and IBM.',
    priority: 0.7,
  },
  {
    path: 'developer/projects',
    title: 'Kinjal Pandey | Projects: AI, Data Science, Security, Open Source',
    description:
      'Technical projects by Kinjal Pandey across AI, data science, software engineering and security, including the Chain-of-Sanitized-Thoughts paper (arXiv:2601.05076) and repositories pulled live from GitHub.',
    priority: 0.7,
  },
  {
    path: 'developer/projects/bcu',
    title: 'Kinjal Pandey | Bicycle Accessibility and Equity in Greater Boston',
    description:
      'Graph analysis across 96,232 nodes and 929,540 residents for the Boston Cyclists Union. Five case studies, each linked to its merged pull request.',
    image: 'img/bcu/cohort-stairs.jpg',
    priority: 0.8,
  },
  {
    path: 'developer/honors',
    title: 'Kinjal Pandey | Honors, Awards, Scholarships and Recognition',
    description:
      'Research publications, academic honors, scholarships and selective programs recognizing Kinjal Pandey at UMass Amherst and Virginia Tech, including three funded startup pitch wins.',
    image: 'img/honors/scholarship-backdrop.jpg',
    priority: 0.6,
  },
  {
    path: 'developer/resume',
    title: 'Kinjal Pandey | Résumé: AI/ML, Software Engineering, Data Science',
    description:
      'Download the résumé of Kinjal Pandey, computer science master’s student at UMass Amherst, in role-focused versions for AI and machine learning, software engineering, and data science.',
    priority: 0.6,
  },
  {
    path: 'developer/contact',
    title: 'Kinjal Pandey | Contact',
    description:
      'Contact Kinjal Pandey in Amherst, Massachusetts about technology and AI roles anywhere in the United States, research collaborations, ventures, and modeling work.',
    priority: 0.5,
  },
  {
    path: 'entrepreneur',
    title: 'Kinnovation: Ventures by Kinjal Pandey',
    description:
      'Six ventures from Kinjal Pandey. Three of them have won money: Karnah, CalendAI and Trendify AI have taken $1,550 between them at pitch competitions at UMass Amherst and Virginia Tech.',
    image: 'img/pitches/pitch-umass-stage.jpg',
    priority: 0.9,
    canonical: 'https://kinnovationgroup.com/',
  },
  {
    path: 'model',
    title: 'Kinjal Pandey | Modeling Portfolio: Editorial, Runway, Beauty',
    description:
      'The modeling portfolio of Kinjal Pandey, a fashion and editorial model based in Amherst, Massachusetts and available across New England, Boston and New York. Shoots at the Eric Carle Museum and the New England Peace Pagoda, plus digitals and beauty work.',
    image: 'img/model/carle/carle-01.jpg',
    priority: 0.9,
  },
];

/** Venture sub-pages share a shape, so they are generated. */
export const VENTURE_PAGES: PageMeta[] = [
  ['measmi', 'MeAsmi', 'Finding what actually worked for children whose symptoms match yours, not whose diagnosis does.'],
  ['karnah', 'Karnah', 'In-kind giving you can trace from your door to the person who needed it. Second place and $750 at UMass UPitch 2026.'],
  ['calendai', 'CalendAI', 'A calendar that reschedules itself when the day breaks. $500 from the Apex Center for Entrepreneurs at Virginia Tech.'],
  ['nutri-navigator', 'NutriNavigator', 'What to eat, when and where, worked out from your body, your calendar and what is within walking distance.'],
  ['witness-platform', 'Witness', 'A record of what people saw, kept sealed until the person it happened to asks for it.'],
  ['trendify', 'Trendify AI', 'Matches live trend data to the footage already in your camera roll. Minute Pitch winner, $300, UMass Amherst.'],
].map(([slug, name, blurb]) => ({
  path: `entrepreneur/${slug}`,
  title: `${name}: a venture by Kinjal Pandey`,
  description: `${blurb} One of six ventures built by Kinjal Pandey under Kinnovation.`,
  priority: 0.6,
  canonical: `https://kinnovationgroup.com/${slug}`,
}));

export const ALL_PAGES: PageMeta[] = [...PAGES, ...VENTURE_PAGES];

/** Absolute URL for a route path. */
export function urlFor(path: string): string {
  return path ? `${ORIGIN}/${path}` : `${ORIGIN}/`;
}

export function metaFor(path: string): PageMeta {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return ALL_PAGES.find((p) => p.path === clean) ?? ALL_PAGES[0];
}
