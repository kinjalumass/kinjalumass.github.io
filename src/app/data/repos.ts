/**
 * Projects, sourced from GitHub.
 *
 * The page fetches the live repo list at runtime, so anything you push shows
 * up without a code change. `NOTES` below lets you override the title and
 * write a proper blurb for the repos worth leading with — GitHub descriptions
 * are usually too terse for a portfolio.
 *
 * Anything in `HIDE` never appears. Anything not in `NOTES` still appears,
 * using its GitHub description.
 */

export const GITHUB_USER = 'kinjalumass';

export interface Repo {
  name: string;
  title: string;
  blurb: string;
  url: string;
  language: string | null;
  topics: string[];
  updated: string;
  stars: number;
  /** Featured repos sort first and render larger */
  featured?: boolean;
  rank: number;
}

interface Note {
  title?: string;
  blurb?: string;
  topics?: string[];
  featured?: boolean;
  /** Lower sorts first among featured repos. Default 50. */
  rank?: number;
}

/** Empty, abandoned, superseded, or not worth showing a recruiter. */
export const HIDE = new Set([
  'practical6',
  'binary-read-write',
  // superseded by the BCU-Graph-Analysis fork, which Kinjal keeps access to
  'bcurepo',
]);

/**
 * Forks are hidden by default — nobody wants a wall of someone else's code.
 * These are the exceptions: forks that hold Kinjal's own work.
 */
export const KEEP_FORKS = new Set(['BCU-Graph-Analysis']);

/**
 * Hand-written context for the repos that matter. Everything else falls back
 * to whatever GitHub says.
 */
export const NOTES: Record<string, Note> = {
  'BCU-Graph-Analysis': {
    title: 'Boston Cyclists Union: graph analysis',
    blurb:
      'Data science for safer and more equitable biking infrastructure in Boston, built with the Boston Cyclists Union through the 2026 Data Science for the Common Good program. Graph analysis over the city road and cycling network, turning urban mobility and road-safety data into evidence that holds up in a policy conversation. Engineered as a reproducible project rather than a notebook dump: a DVC pipeline, a pytest suite, GitHub Actions running tests on every pull request, and Sphinx documentation.',
    topics: ['Python', 'Graph analysis', 'DVC', 'pytest', 'CI', 'Civic data'],
    featured: true,
    rank: 0,
  },
  CS690FStartup: {
    title: 'MediaTagger: membership inference',
    blurb:
      'Built for COMPSCI 690F, Trustworthy and Responsible AI. A synthetic image-and-caption dataset of ten classes, a baseline classifier trained on it, and membership inference attacks run against that classifier to test what it leaks about its own training data. The same question as her published research, approached from the attack side.',
    topics: ['Python', 'Jupyter', 'Privacy', 'Membership inference', 'ML security'],
    featured: true,
    rank: 1,
  },
  CryptoProj1: {
    title: 'Cryptography: project 1',
    blurb:
      'Implementation work from MATH 4175, Cryptography at Virginia Tech: classical and symmetric-key ciphers built from the primitives rather than called from a library.',
    topics: ['Python', 'Cryptography'],
  },
  'Crypto-Proj2': {
    title: 'Cryptography: project 2',
    blurb:
      'The second cryptography project from MATH 4175, continuing into cryptanalysis and public-key constructions.',
    topics: ['Python', 'Cryptography'],
  },
  'kinjalumass.github.io': {
    title: 'This website',
    blurb:
      'Angular 22, built from scratch. Three sections with separate design languages, lazy-loaded per route, and an assistant grounded in a corpus generated from the same data that renders the pages, running on Cloudflare Workers AI.',
    topics: ['Angular', 'TypeScript', 'SCSS', 'Cloudflare Workers'],
    featured: true,
  },
  'Project-Report-3-602-Phenomena-Exploration': {
    title: 'Phenomena exploration: COMPSCI 602',
    blurb:
      'Research methods coursework for COMPSCI 602: exploring a phenomenon empirically and writing it up to the standard the field expects.',
    topics: ['Research methods', 'Data analysis'],
    featured: true,
  },
  CODSOFT: {
    title: 'Applied AI projects: CodSoft',
    blurb:
      'The project set built during the CodSoft AI internship, covering natural language processing, computer vision, and neural networks, each taking an algorithm from paper to working code.',
    topics: ['Python', 'NLP', 'Computer vision', 'Neural networks'],
    featured: true,
  },
  BombLab: {
    title: 'Bomb Lab',
    blurb:
      'The classic defusing exercise: reading x86 assembly and reverse-engineering each phase to work out the input it wants.',
    topics: ['C', 'Assembly', 'Reverse engineering'],
  },
  'understanding-assembly-code': {
    title: 'Reading assembly',
    blurb: 'Working through compiled output to understand what the compiler actually produces.',
    topics: ['Assembly', 'Systems'],
  },
  unscramble: {
    title: 'Unscramble',
    blurb: 'Recovering structure from jumbled regular and binary data.',
    topics: ['C', 'Binary data'],
  },
  'c-practice': {
    title: 'C practice',
    blurb: 'Small C programs written while learning systems programming.',
    topics: ['C'],
  },
  '3114-proj2': {
    title: 'Data structures: project 2',
    blurb: 'Coursework for CS 3114, Data Structures and Algorithms at Virginia Tech.',
    topics: ['Java', 'Data structures'],
  },
  Proj3: {
    title: 'Data structures: project 3',
    blurb: 'Coursework for CS 3114, Data Structures and Algorithms at Virginia Tech.',
    topics: ['Java', 'Data structures'],
  },
  website: {
    title: 'Website build',
    blurb: 'An earlier site build in TypeScript.',
    topics: ['TypeScript'],
  },
};

/**
 * Used when GitHub cannot be reached — rate limit, outage, offline. The page
 * should never render empty.
 */
export const FALLBACK: Repo[] = Object.entries(NOTES)
  .filter(([name]) => !HIDE.has(name))
  .map(([name, note]) => ({
    name,
    title: note.title ?? name,
    blurb: note.blurb ?? '',
    url: `https://github.com/${GITHUB_USER}/${name}`,
    language: null,
    topics: note.topics ?? [],
    updated: '',
    stars: 0,
    featured: note.featured,
    rank: note.rank ?? 50,
  }))
  .sort((a, b) => {
    const f = Number(b.featured ?? false) - Number(a.featured ?? false);
    return f !== 0 ? f : a.rank - b.rank;
  });
