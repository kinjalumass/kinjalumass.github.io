/**
 * Content for the developer landing page (/developer).
 * Sourced from Kinjal's LinkedIn profile — edit freely, the page follows.
 */

export interface Stat {
  value: string;
  label: string;
}

export interface Track {
  tag: string;
  title: string;
  org: string;
  window: string;
  lines: string[];
  /** Optional image path relative to the site root */
  image?: string;
}

export interface TimelineRow {
  year: string;
  org: string;
  role: string;
}

export const HERO = {
  name: 'Kinjal Pandey',
  /** Cycled one at a time under the name */
  roles: ['AI Researcher', 'Tech Leader', 'Software Engineer', 'Innovation Advocate'],
  /**
   * Background-removed portrait. The code wall renders behind it, so the rain
   * falls around her rather than across her. `hero-original.jpg` is the
   * untouched source if you ever need to redo the cutout.
   */
  portrait: 'img/hero-cutout.webp',
  location: 'Amherst, MA',
  handle: 'kinjalpandey',
};

export const INTRO = {
  headline: 'Building systems that are secure, transparent, and worth trusting.',
  body:
    "Master's student in Computer Science at UMass Amherst, after graduating early from Virginia Tech with a B.S. in CS and a minor in Mathematics. " +
    'My work sits where machine learning meets privacy, security, and public interest — rigorous math on one side, real deployments and real people on the other.',
};

export const STATS: Stat[] = [
  { value: '2', label: 'Degrees, one early' },
  { value: '3', label: 'Ambassadorships' },
  { value: '1', label: 'Publication' },
  { value: '2K+', label: 'Residents supported' },
];

export const TRACKS: Track[] = [
  {
    tag: 'RESEARCH',
    title: 'Chain-of-Sanitized-Thoughts',
    org: 'Publication',
    window: 'Plugging PII leakage in CoT of large reasoning models',
    lines: [
      'Reasoning traces leak the private data the answer was careful to hide.',
      'Work on sanitizing chain-of-thought without breaking the reasoning itself.',
    ],
  },
  {
    tag: 'RESEARCH',
    title: 'Coding & Cryptography',
    org: 'Commonwealth Cyber Initiative, SW Virginia',
    window: '2023 — 2024',
    lines: [
      'Built anomaly-detection algorithms and secure data pipelines for sensitive information.',
      'Designed fault-tolerant encoding from coding theory; published and presented findings.',
    ],
    image: 'img/work-01.jpg',
  },
  {
    tag: 'APPLIED',
    title: 'Data Science for the Common Good',
    org: 'UMass Center for Data Science and AI',
    window: '2026 — present',
    lines: [
      'Selected for the 2026 cohort, partnered with the Boston Cyclists Union.',
      'Turning urban mobility and road-safety data into evidence for policy conversations.',
    ],
  },
  {
    tag: 'OPEN SOURCE',
    title: 'Open-Source Apprentice',
    org: 'UMass CICS',
    window: '2026 — present',
    lines: [
      'Competitive mentor-guided cohort contributing to established open-source projects.',
      'Source control, contribution workflows, technical communication, community.',
    ],
  },
  {
    tag: 'ADVOCACY',
    title: 'Google · Microsoft · IBM',
    org: 'DSC Lead · Learn Ambassador · Z Ambassador',
    window: '2023 — 2024',
    lines: [
      'Ran hackathons, bootcamps, and workshops on Google Cloud, Azure, AI, and IBM Z.',
      'Connected mainframe fundamentals to modern ML pipelines for hundreds of students.',
    ],
    image: 'img/work-02.jpg',
  },
  {
    tag: 'BUILD',
    title: 'ML Smart Calendar',
    org: 'VT Center for Enhancement of Engineering Diversity',
    window: '2023',
    lines: [
      'Co-led a machine-learning prototype recommending tasks and schedules to students.',
      'Covered in the press as an AI productivity tool built by a student, for students.',
    ],
  },
];

export const TIMELINE: TimelineRow[] = [
  { year: '2026', org: 'UMass CICS', role: 'Open-Source Apprentice' },
  { year: '2026', org: 'UMass CDSAI', role: 'Data Scientist' },
  { year: '2025', org: 'UMass Amherst', role: 'M.S. Computer Science' },
  { year: '2024', org: 'Microsoft', role: 'Learn Student Ambassador' },
  { year: '2024', org: 'CodSoft', role: 'AI Intern' },
  { year: '2023', org: 'IBM', role: 'Z Student Ambassador' },
  { year: '2023', org: 'Google DSC', role: 'Team Leader' },
  { year: '2023', org: 'Commonwealth Cyber Initiative', role: 'Cryptography Researcher' },
  { year: '2022', org: 'Virginia Tech', role: 'B.S. Computer Science, Math minor' },
];

export const STACK: string[] = [
  'Python',
  'Scikit-Learn',
  'Neural Networks',
  'NLP',
  'Computer Vision',
  'Cryptography',
  'Coding Theory',
  'Data Pipelines',
  'Azure',
  'Google Cloud',
  'IBM Z',
  'Git',
];

export const LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kinjalpandey' },
  { label: 'GitHub', href: 'https://github.com/kinjalumass' },
  { label: 'Medium', href: 'https://medium.com/@kinjalpandey18' },
  { label: 'Email', href: 'mailto:kinjalpandey18@gmail.com' },
];
