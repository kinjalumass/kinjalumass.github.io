/**
 * Content for the developer landing page (/developer).
 * Sourced from Kinjal's LinkedIn profile, edit freely, the page follows.
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
  /** Optional outbound link, a repository, a paper */
  link?: { label: string; href: string };
}

export interface TimelineRow {
  year: string;
  org: string;
  role: string;
}

/** A card on the overview page that routes into one of the sub-sections. */
export interface SectionCard {
  /** Two-digit index rendered as a plate */
  index: string;
  path: string;
  /** Short mono label, matches the nav */
  label: string;
  /** Human-readable heading */
  title: string;
  blurb: string;
  /** A few concrete things found inside, shown as chips */
  peek: string[];
  /** Right-aligned count, e.g. "2 degrees" */
  meta: string;
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
  headline: 'Building systems at the intersection of AI, security, and real-world impact.',
  body:
    "I'm a Computer Science master's student at UMass Amherst, with a B.S. in Computer Science from Virginia Tech. " +
    'My work spans machine learning, privacy, security, and responsible AI, with a focus on turning technical ideas ' +
    'into systems that are useful, trustworthy, and built for real people. Beyond research and engineering, ' +
    "I'm also interested in entrepreneurship and building technology around problems worth solving.",
};

export const STATS: Stat[] = [
  { value: '2', label: 'Degrees, one early' },
  { value: '3', label: 'Ambassadorships' },
  { value: '1', label: 'Publication' },
  { value: '2K+', label: 'Residents supported' },
];

/**
 * The overview page is a directory: everything below the summary points into a
 * sub-section rather than duplicating it. Order matches the nav.
 */
export const SECTIONS: SectionCard[] = [
  {
    index: '01',
    path: '/developer/education',
    label: 'education',
    title: 'Education',
    blurb:
      'Graduate and undergraduate computer science education at UMass Amherst and Virginia Tech, with coursework, transcripts, and technical certifications.',
    peek: ['UMass Amherst · M.S.', 'Virginia Tech · B.S.', 'Coursework', 'Transcripts', 'Certifications'],
    meta: '2 degrees · 9 certifications',
  },
  {
    index: '02',
    path: '/developer/experience',
    label: 'experience',
    title: 'Experience',
    blurb:
      'Research, data science, consulting, software engineering, and technology leadership across academic, industry, and community-focused roles.',
    peek: ['UMass CDSAI', 'Steve Fisher Consulting', 'SkyIT', 'Microsoft', 'IBM', 'Google'],
    meta: '16 roles · 2022 to present',
  },
  {
    index: '03',
    path: '/developer/projects',
    label: 'projects',
    title: 'Projects',
    blurb:
      'Technical work across AI, data science, software engineering, and security, with source code and active repositories available directly through GitHub.',
    peek: ['Boston Cyclists Union', 'MediaTagger', 'Cryptography', 'Live from GitHub'],
    meta: 'Repos only',
  },
  {
    index: '04',
    path: '/developer/honors',
    label: 'honors',
    title: 'Honors & awards',
    blurb:
      'Research publications, academic honors, scholarships, and selective programs recognizing work across computing, research, leadership, and innovation.',
    peek: ['arXiv:2601.05076', "Dean's List with Distinction", 'Undergraduate Research Excellence', 'Scholarships'],
    meta: '8 honors · 4 selections',
  },
  {
    index: '05',
    path: '/developer/resume',
    label: 'resume',
    title: 'Résumé',
    blurb:
      'Role-focused versions highlighting experience in AI/ML, software engineering, and data science, available to preview or download.',
    peek: ['AI / ML', 'Software Engineering', 'Data Science', 'PDF download'],
    meta: '3 versions',
  },
  {
    index: '06',
    path: '/developer/contact',
    label: 'contact',
    title: 'Contact',
    blurb:
      'Ways to connect for professional opportunities, collaborations, research, and other inquiries, with current availability and preferred contact channels.',
    peek: ['Email', 'LinkedIn', 'GitHub', 'Availability'],
    meta: 'Open to roles',
  },
];

export const TRACKS: Track[] = [
  {
    tag: 'FLAGSHIP',
    title: 'Boston Cyclists Union: graph analysis',
    org: 'UMass Center for Data Science and AI',
    window: 'Data Science for the Common Good, 2026',
    lines: [
      'Graph analysis over Boston’s road and cycling network, in partnership with the Boston Cyclists Union.',
      'Turning urban mobility and road-safety data into evidence that holds up in a policy conversation.',
      'Built reproducibly, DVC pipeline, pytest suite, CI on every pull request.',
    ],
    link: {
      label: 'Five case studies',
      href: '/developer/projects/bcu',
    },
  },
  {
    tag: 'RESEARCH',
    title: 'Chain-of-Sanitized-Thoughts',
    org: 'Publication · arXiv:2601.05076',
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
    window: '2023 to 2024',
    lines: [
      'Built anomaly-detection algorithms and secure data pipelines for sensitive information.',
      'Designed fault-tolerant encoding from coding theory; published and presented findings.',
    ],
  },
  {
    tag: 'PRIVACY',
    title: 'MediaTagger: membership inference',
    org: 'COMPSCI 690F · Trustworthy and Responsible AI',
    window: '2025',
    lines: [
      'A synthetic image-and-caption dataset, a baseline classifier, and membership inference attacks run against it.',
      'The same question as the paper, approached from the attack side: what does a model leak about its own training data?',
    ],
    link: {
      label: 'View repository',
      href: 'https://github.com/kinjalumass/CS690FStartup',
    },
  },
  {
    tag: 'OPEN SOURCE',
    title: 'Open-Source Apprentice',
    org: 'UMass CICS',
    window: '2026 to present',
    lines: [
      'Competitive mentor-guided cohort contributing to established open-source projects.',
      'Source control, contribution workflows, technical communication, community.',
    ],
  },
  {
    tag: 'ADVOCACY',
    title: 'Google · Microsoft · IBM',
    org: 'DSC Lead · Learn Ambassador · Z Ambassador',
    window: '2023 to 2024',
    lines: [
      'Ran hackathons, bootcamps, and workshops on Google Cloud, Azure, AI, and IBM Z.',
      'Connected mainframe fundamentals to modern ML pipelines for hundreds of students.',
    ],
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
  { year: '2026', org: 'UMass CICS', role: 'Course Grader: Trustworthy & Responsible AI' },
  { year: '2026', org: 'UMass CICS', role: 'Open-Source Apprentice' },
  { year: '2026', org: 'UMass CDSAI', role: 'Data Scientist' },
  { year: '2025', org: 'Steve Fisher Consulting', role: 'Technology Consultant' },
  { year: '2025', org: 'Simple Coaching Inc.', role: 'Digital Solutions Consultant' },
  { year: '2025', org: 'UMass Amherst', role: 'M.S. Computer Science' },
  { year: '2024', org: 'SkyIT Services', role: 'Backend Developer Intern' },
  { year: '2024', org: 'Microsoft', role: 'Learn Student Ambassador' },
  { year: '2024', org: 'CodSoft', role: 'AI Intern' },
  { year: '2023', org: 'IBM', role: 'Z Student Ambassador' },
  { year: '2023', org: 'Google DSC', role: 'Team Leader' },
  { year: '2023', org: 'Commonwealth Cyber Initiative', role: 'Cryptography Researcher' },
  { year: '2022', org: 'Virginia Tech', role: 'B.S. Computer Science, Math minor' },
];

export const STACK: string[] = [
  'Python',
  'Django REST',
  'JavaScript',
  'Firebase',
  'REST APIs',
  'Scikit-Learn',
  'Neural Networks',
  'NLP',
  'Computer Vision',
  'Cryptography',
  'Coding Theory',
  'Data Pipelines',
  'AWS',
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
