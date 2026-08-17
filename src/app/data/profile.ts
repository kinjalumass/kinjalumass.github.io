/**
 * Long-form profile content for the /developer subpages.
 * Everything here comes from Kinjal's LinkedIn profile.
 */
import { Asset, cert, photo } from './assets';

/* ===========================================================
   Education
   =========================================================== */

/* ---------------------------------------------------------------
   Coursework
   ---------------------------------------------------------------
   Course titles follow the official catalogs. Each course links out to
   the catalog page that describes it.

   Virginia Tech publishes per-subject catalog pages, so a CS course links
   to the CS listing, a MATH course to the MATH listing, and so on.
   UMass has no stable public per-course page — SPIRE needs a login — so
   graduate courses link to the CICS course listing, which carries the
   current descriptions.
   --------------------------------------------------------------- */

const VT = (subject: string) =>
  `https://catalog.vt.edu/undergraduate/course-descriptions/${subject}/`;

const UMASS_COURSES = 'https://www.cics.umass.edu/academics/courses';

export interface Course {
  code: string;
  title: string;
  url: string;
}

export interface CourseGroup {
  label: string;
  courses: Course[];
}

/** Virginia Tech, by subject */
const vt = (subject: string) => (code: string, title: string): Course => ({
  code,
  title,
  url: VT(subject),
});

const cs = vt('cs');
const math = vt('math');
const stat = vt('stat');
const engl = vt('engl');
const comm = vt('comm');
const sts = vt('sts');

/** UMass graduate CS */
const umass = (code: string, title: string): Course => ({
  code,
  title,
  url: UMASS_COURSES,
});

export interface Degree {
  school: string;
  credential: string;
  detail: string;
  window: string;
  place: string;
  /** Path to the institution mark, relative to the site root */
  logo: string;
  notes: string[];
  courses: CourseGroup[];
  /** Transcript is marked `shareable: false` so the viewer offers no direct link */
  transcript?: Asset;
  certificates?: Asset[];
}

export const DEGREES: Degree[] = [
  {
    school: 'University of Massachusetts Amherst',
    credential: 'M.S. Computer Science',
    detail: 'Manning College of Information and Computer Sciences',
    window: 'Aug 2025 — present',
    place: 'Amherst, MA',
    logo: 'img/logos/umass.png',
    notes: [
      'Concentration in field experience — coursework paired with applied placements.',
      'Focus on secure, transparent, and socially responsible computing systems.',
      'Selected for the CICS Open-Source Apprenticeship and the Center for Data Science and AI.',
    ],
    courses: [
      {
        label: 'Artificial intelligence',
        courses: [
          umass('COMPSCI 683', 'Artificial Intelligence'),
          umass('COMPSCI 670', 'Computer Vision'),
          umass('COMPSCI 690S', 'AI Alignment'),
          umass('COMPSCI 690F', 'Trustworthy and Responsible AI'),
          umass('COMPSCI 692G', 'Simulation and Causal Modeling'),
        ],
      },
      {
        label: 'Security & cryptography',
        courses: [
          umass('COMPSCI 666', 'Theory and Practice of Cryptography'),
          umass('COMPSCI 560', 'Introduction to Computer and Network Security'),
          umass('COMPSCI 561', 'System Defense and Test'),
        ],
      },
      {
        label: 'Data & method',
        courses: [
          umass('COMPSCI 571', 'Data Visualization and Exploration'),
          umass('COMPSCI 602', 'Research Methods in Empirical Computer Science'),
        ],
      },
    ],
    transcript: {
      kind: 'pdf',
      src: 'docs/transcripts/umass-transcript.pdf',
      title: 'UMass Amherst — Transcript',
      caption: 'Viewable here only. Redacted copy.',
      shareable: false,
    },
  },
  {
    school: 'Virginia Tech',
    credential: 'B.S. Computer Science',
    detail: 'Minor in Mathematics',
    window: 'Graduated Jun 2022 — early',
    place: 'Blacksburg, VA',
    logo: 'img/logos/virginia-tech.png',
    notes: [
      'Completed the degree ahead of schedule with a mathematics minor attached.',
      'Undergraduate Research Excellence Program member.',
      'Completed the Undergraduate Career Bridge Experience, an experiential-learning framework linking coursework to applied work.',
    ],
    courses: [
      {
        label: 'Computer science',
        courses: [
          cs('CS 2104', 'Introduction to Problem Solving in Computer Science'),
          cs('CS 2505', 'Introduction to Computer Organization I'),
          cs('CS 2506', 'Introduction to Computer Organization II'),
          cs('CS 3114', 'Data Structures and Algorithms'),
          cs('CS 3214', 'Computer Systems'),
          cs('CS 3304', 'Comparative Languages'),
          cs('CS 3604', 'Professionalism in Computing'),
          cs('CS 3724', 'Introduction to Human-Computer Interaction'),
          cs('CS 4104', 'Data and Algorithm Analysis'),
          cs('CS 4604', 'Introduction to Data Base Management Systems'),
          cs('CS 4644', 'Creative Computing Studio'),
          cs('CS 4804', 'Introduction to Artificial Intelligence'),
          cs('CS 3900', 'Bridge Experience'),
        ],
      },
      {
        label: 'Mathematics & statistics',
        courses: [
          math('MATH 1225', 'Calculus of a Single Variable I'),
          math('MATH 1226', 'Calculus of a Single Variable II'),
          math('MATH 3134', 'Applied Combinatorics and Graph Theory'),
          math('MATH 4175', 'Cryptography'),
          stat('STAT 4604', 'Statistical Methods for Engineers'),
        ],
      },
      {
        label: 'Communication & society',
        courses: [
          engl('ENGL 3764', 'Technical Writing'),
          comm('COMM 2004', 'Public Speaking'),
          sts('STS 1504', 'Introduction to Science, Technology, and Society'),
        ],
      },
    ],
    transcript: {
      kind: 'pdf',
      src: 'docs/transcripts/vt-transcript.pdf',
      title: 'Virginia Tech — Transcript',
      caption: 'Viewable here only. Redacted copy.',
      shareable: false,
    },
    certificates: [
      cert('vt-diploma', 'B.S. Diploma', 'Bachelor of Science in Computer Science, Virginia Tech.'),
      cert('vt-deans-list', "Dean's List with Distinction"),
      cert('research-excellence', 'Undergraduate Research Excellence'),
      cert('vt-career-bridge', 'Career Bridge Experience'),
    ],
  },
];

export const FOCUS_AREAS: string[] = [
  'Machine learning',
  'Cryptography & coding theory',
  'Natural language processing',
  'Computer vision',
  'Data science',
  'AI policy & ethics',
  'Secure systems',
  'Mathematics',
];

export interface Certification {
  name: string;
  issuer: string;
}

export const CERTIFICATIONS: Certification[] = [
  { name: 'Train and evaluate regression models', issuer: 'Microsoft Learn' },
  { name: 'Fundamental AI Concepts', issuer: 'Microsoft Learn' },
  { name: 'Introduction to natural language processing concepts', issuer: 'Microsoft Learn' },
  { name: 'Explore and analyze data with Python', issuer: 'Microsoft Learn' },
  { name: 'Concepts — IBM Z Xplore', issuer: 'IBM' },
];

/* ===========================================================
   Experience
   =========================================================== */

export interface Role {
  org: string;
  title: string;
  window: string;
  place: string;
  /** Grouping used for the filter rail */
  kind: 'Research' | 'Applied' | 'Advocacy' | 'Leadership' | 'Industry';
  bullets: string[];
  /** Certificates and photos shown under the role */
  assets?: Asset[];
}

export const ROLES: Role[] = [
  {
    org: 'Manning College of Information and Computer Sciences, UMass Amherst',
    title: 'Open-Source Apprentice',
    window: 'Jun 2026 — present',
    place: 'Amherst, MA',
    kind: 'Applied',
    bullets: [
      'Selected for the competitive Summer 2026 cohort of the CICS Open-Source Apprenticeship Program, which pairs students with experienced open-source contributors and industry mentors.',
      'Contributing to established open-source projects in a structured, mentor-guided apprenticeship.',
      'Emphasis on source control, contribution workflows, technical communication, and engagement with maintainer communities.',
    ],
  },
  {
    org: 'UMass Amherst Center for Data Science and Artificial Intelligence',
    title: 'Data Scientist',
    window: 'May 2026 — present',
    place: 'Amherst, MA',
    kind: 'Applied',
    bullets: [
      'Selected for the 2026 Data Science for the Common Good program, training data scientists on real public-interest problems.',
      'Working with the Boston Cyclists Union on safer, more accessible, and more equitable biking infrastructure.',
      'Contributing analysis across urban mobility, transportation safety, and community advocacy.',
      'Translating complex datasets into insights that support policy conversations and evidence-based decisions.',
    ],
  },
  {
    org: 'Franklin County Community Development Corporation',
    title: 'Entrepreneurs Accelerator Program Participant',
    window: 'Mar 2026 — May 2026',
    place: 'Greenfield, MA',
    kind: 'Leadership',
    bullets: [
      'Selected for the Spring 2026 Entrepreneurs Accelerator, supporting emerging founders and early-stage ventures.',
      'Developed and refined startup strategy through structured workshops and mentorship.',
      'Strengthened venture planning across positioning, growth strategy, and execution readiness.',
    ],
  },
  {
    org: 'Microsoft',
    title: 'Microsoft Learn Student Ambassador',
    window: 'Jan 2024 — Dec 2024',
    place: 'Blacksburg, VA',
    kind: 'Advocacy',
    bullets: [
      'Organized peer workshops and training on Azure cloud, AI fundamentals, and portfolio building, helping dozens of students bridge classroom learning and applied skills.',
      'Created reusable starter projects and hands-on resources so students could keep exploring Microsoft technologies independently.',
      'Built a community of aspiring developers on campus by mentoring peers and amplifying their work.',
    ],
    assets: [
      cert('microsoft-learn-ambassador', 'Ambassador Certificate'),
      photo('workshop', 'Azure workshop', 'Running a peer session on Azure and AI fundamentals.'),
    ],
  },
  {
    org: 'Virginia Tech',
    title: 'Student Leader',
    window: 'Aug 2024 — Dec 2024',
    place: 'Blacksburg, VA',
    kind: 'Leadership',
    bullets: [
      'Supported a community of 2,000+ residents with daily focus on roughly 150, triaging high-tension issues with Title IX and mental-health training.',
      'Launched inclusive programs and workshops that improved participation and reduced conduct escalations.',
      'Standardized communications and documentation for policy updates, improving handoff across shifts.',
    ],
  },
  {
    org: 'CodSoft',
    title: 'AI Intern',
    window: 'Jan 2024 — Feb 2024',
    place: 'Remote',
    kind: 'Industry',
    bullets: [
      'Explored core AI domains — NLP, computer vision, and neural networks — by building small projects applying algorithms to real use cases.',
      'Moved from theory to practice on each project, strengthening applied implementation skills.',
      'Collaborated in a remote team while documenting progress publicly on GitHub.',
    ],
    assets: [cert('codsoft-internship', 'Internship Certificate')],
  },
  {
    org: 'IBM',
    title: 'Z Student Ambassador',
    window: 'Nov 2023 — Jun 2024',
    place: 'Blacksburg, VA',
    kind: 'Advocacy',
    bullets: [
      'Promoted IBM Z mainframe technologies through workshops on security, data pipelines, and batch processing.',
      'Connected mainframe principles to modern AI/ML workflows, showing how legacy systems underpin scalable data handling.',
      'Engaged students, faculty, and IBM professionals to build a knowledge-sharing community.',
    ],
    assets: [cert('ibm-z-ambassador', 'Z Ambassador Certificate')],
  },
  {
    org: 'Google Developer Student Club, Virginia Tech',
    title: 'Team Leader',
    window: 'Oct 2023 — Jun 2024',
    place: 'Blacksburg, VA',
    kind: 'Advocacy',
    bullets: [
      'Directed hackathons, coding bootcamps, and workshops on Google Cloud and APIs for a diverse student body.',
      'Mentored peers through real-world software and machine learning projects.',
      'Built partnerships with faculty and industry professionals to keep programming aligned with real-world needs.',
    ],
    assets: [
      cert('google-dsc-lead', 'Team Leader Certificate'),
      photo('hackathon', 'Hackathon', 'Directing a student hackathon on Google Cloud and APIs.'),
    ],
  },
  {
    org: 'Virginia Tech',
    title: 'Peer Mentor',
    window: 'Jul 2023 — Aug 2024',
    place: 'Blacksburg, VA',
    kind: 'Leadership',
    bullets: [
      'Mentored first-year cohorts on academics, campus resources, and life logistics.',
      'Coordinated events that improved retention and engagement.',
      'Built lightweight tracking for mentee goals and streamlined referrals to campus services.',
    ],
  },
  {
    org: 'Commonwealth Cyber Initiative, Southwest Virginia',
    title: 'Coding & Cryptography Researcher',
    window: 'Oct 2023 — Jan 2024',
    place: 'Blacksburg, VA',
    kind: 'Research',
    bullets: [
      'Developed anomaly-detection algorithms and coded secure data pipelines for handling sensitive information.',
      'Investigated coding theory and cryptographic concepts to design fault-tolerant data encoding approaches.',
      'Collaborated with faculty and peers to publish reports and present findings at academic forums.',
    ],
    assets: [
      cert('cci-research', 'Research Certificate'),
      photo('research', 'Research work', 'Cryptography and anomaly-detection research at CCI.'),
    ],
  },
  {
    org: 'VT Center for the Enhancement of Engineering Diversity',
    title: 'Upper Class Leader, Design Challenge Team',
    window: 'Aug 2023 — Oct 2023',
    place: 'Blacksburg, VA',
    kind: 'Leadership',
    bullets: [
      'Co-led a machine-learning smart calendar prototype that recommended tasks and schedules to students.',
      'Facilitated freshman design challenges teaching problem-solving, teamwork, and engineering fundamentals.',
      'Managed the community’s web and social presence, increasing visibility and event participation.',
    ],
  },
  {
    org: 'VT Center for the Enhancement of Engineering Diversity',
    title: 'Member',
    window: 'Aug 2022 — Jul 2023',
    place: 'Blacksburg, VA',
    kind: 'Leadership',
    bullets: [
      'Planned and supported student innovation events, preparing resources and troubleshooting logistics.',
      'Contributed outreach and onboarding content explaining the studio’s mission.',
      'Assisted with event execution and peer learning activities.',
    ],
  },
];

export const ROLE_KINDS = ['All', 'Research', 'Applied', 'Advocacy', 'Leadership', 'Industry'] as const;
export type RoleKind = (typeof ROLE_KINDS)[number];

/* ===========================================================
   Projects
   =========================================================== */

export interface Project {
  index: string;
  name: string;
  kind: string;
  context: string;
  window: string;
  summary: string;
  bullets: string[];
  stack: string[];
  image?: string;
  /** Certificates and photos shown under the project */
  assets?: Asset[];
}

export const PROJECTS: Project[] = [
  {
    index: '01',
    name: 'Chain-of-Sanitized-Thoughts',
    kind: 'Research · Publication',
    context: 'Plugging PII leakage in CoT of large reasoning models',
    window: 'Published',
    summary:
      'A reasoning model can return a careful final answer while its chain-of-thought quietly exposes the personal data it reasoned over. The trace itself becomes the leak.',
    bullets: [
      'Studies where personally identifiable information escapes through intermediate reasoning rather than the final output.',
      'Explores sanitizing the chain-of-thought without degrading the reasoning that makes it useful.',
      'Treats privacy and capability as things to hold together rather than trade against each other.',
    ],
    stack: ['LLMs', 'Chain-of-thought', 'Privacy', 'NLP'],
  },
  {
    index: '02',
    name: 'Boston Cyclists Union analysis',
    kind: 'Applied data science',
    context: 'UMass Center for Data Science and AI — Data Science for the Common Good',
    window: '2026',
    summary:
      'Data work supporting safer, more accessible, and more equitable biking infrastructure across Boston.',
    bullets: [
      'Analysis across urban mobility and transportation-safety datasets.',
      'Framing findings for community advocacy and stakeholder communication.',
      'Turning complex data into evidence that holds up in policy conversations.',
    ],
    stack: ['Python', 'Geospatial data', 'Statistics', 'Civic tech'],
    image: 'img/work-01.jpg',
  },
  {
    index: '03',
    name: 'Anomaly detection & secure pipelines',
    kind: 'Research',
    context: 'Commonwealth Cyber Initiative, Southwest Virginia',
    window: '2023 — 2024',
    summary:
      'Applied research at the seam between cryptography and machine learning, on data that cannot afford to leak.',
    bullets: [
      'Built anomaly-detection algorithms and secure data pipelines for sensitive information.',
      'Designed fault-tolerant encoding approaches drawn from coding theory.',
      'Published reports and presented findings at academic forums.',
    ],
    stack: ['Cryptography', 'Coding theory', 'Anomaly detection', 'Python'],
    assets: [
      cert('cci-research', 'Research Certificate'),
      photo('research', 'Research work'),
    ],
  },
  {
    index: '04',
    name: 'ML Smart Calendar',
    kind: 'Prototype',
    context: 'VT Center for the Enhancement of Engineering Diversity',
    window: '2023',
    summary:
      'A machine-learning prototype that recommended tasks and schedules to students — covered in the press as an AI productivity tool built by a student, for students.',
    bullets: [
      'Co-led the prototype from concept through working demonstration.',
      'Applied recommendation approaches to the specific shape of student schedules.',
      'Showed how AI could address an everyday productivity problem rather than an abstract one.',
    ],
    stack: ['Machine learning', 'Recommendation', 'Python'],
    image: 'img/work-02.jpg',
    assets: [photo('presenting', 'Demo day', 'Presenting the smart calendar prototype.')],
  },
  {
    index: '05',
    name: 'Applied AI project set',
    kind: 'Internship',
    context: 'CodSoft',
    window: '2024',
    summary:
      'A series of small, complete projects across the core AI domains, each taking an algorithm from paper to working code.',
    bullets: [
      'Natural language processing, computer vision, and neural network implementations.',
      'Each project applied to a real use case rather than a toy dataset.',
      'Documented publicly on GitHub as an open portfolio of the work.',
    ],
    stack: ['NLP', 'Computer vision', 'Neural networks', 'Scikit-Learn'],
  },
  {
    index: '06',
    name: 'Open-source contributions',
    kind: 'Engineering',
    context: 'UMass CICS Open-Source Apprenticeship',
    window: '2026 — present',
    summary:
      'Mentor-guided contribution to established open-source projects, with the engineering practice around it treated as part of the work.',
    bullets: [
      'Contributions to real projects with real maintainers and real review.',
      'Source control discipline, contribution workflows, and technical communication.',
      'Sustained engagement with open-source communities rather than drive-by patches.',
    ],
    stack: ['Git', 'Code review', 'Open source'],
  },
  {
    index: '07',
    name: 'Workshop & starter-kit library',
    kind: 'Teaching',
    context: 'Microsoft Learn · IBM Z · Google DSC',
    window: '2023 — 2024',
    summary:
      'Reusable teaching material built so the workshops would outlive the sessions that introduced them.',
    bullets: [
      'Starter projects and hands-on resources for Azure, AI fundamentals, and portfolio building.',
      'Workshop material on IBM Z security, data pipelines, and batch processing.',
      'Hackathon and bootcamp curricula covering Google Cloud and APIs.',
    ],
    stack: ['Azure', 'Google Cloud', 'IBM Z', 'Curriculum'],
    assets: [
      photo('workshop', 'Workshop session'),
      photo('hackathon', 'Hackathon'),
      cert('microsoft-learn-ambassador', 'Microsoft Certificate'),
      cert('ibm-z-ambassador', 'IBM Z Certificate'),
      cert('google-dsc-lead', 'Google DSC Certificate'),
    ],
  },
];

/* ===========================================================
   Honors & awards
   =========================================================== */

export interface Honor {
  title: string;
  issuer: string;
  window: string;
  note: string;
  weight?: 'major';
  assets?: Asset[];
}

export const HONORS: Honor[] = [
  {
    title: 'Chain-of-Sanitized-Thoughts',
    issuer: 'Publication',
    window: '—',
    note: 'Plugging PII leakage in CoT of large reasoning models.',
    weight: 'major',
  },
  {
    title: "Dean's List with Distinction",
    issuer: 'Virginia Tech',
    window: '—',
    note: 'Academic distinction across qualifying terms.',
    weight: 'major',
    assets: [cert('vt-deans-list', "Dean's List Certificate")],
  },
  {
    title: 'Undergraduate Research Excellence Program',
    issuer: 'Virginia Tech',
    window: '—',
    note: 'Member, recognising sustained undergraduate research contribution.',
    assets: [cert('research-excellence', 'Program Certificate')],
  },
  {
    title: "Buzz's Bunch Scholarship Award",
    issuer: 'Scholarship',
    window: '2024 — 25',
    note: 'Award winner.',
    assets: [cert('buzz-bunch-scholarship', 'Scholarship Letter')],
  },
  {
    title: 'Student Affairs Scholarship',
    issuer: 'Virginia Tech',
    window: '2024',
    note: 'Scholarship winner.',
    assets: [cert('student-affairs-scholarship', 'Scholarship Letter')],
  },
  {
    title: 'Virginia Pell Initiative Grant',
    issuer: 'Commonwealth of Virginia',
    window: '—',
    note: 'Grant recipient.',
    assets: [cert('pell-initiative-grant', 'Grant Letter')],
  },
];

export interface Selection {
  title: string;
  issuer: string;
  window: string;
  note: string;
}

export const SELECTIONS: Selection[] = [
  {
    title: 'Open-Source Apprenticeship Program',
    issuer: 'UMass CICS',
    window: 'Summer 2026',
    note: 'Competitive mentor-guided cohort pairing students with experienced open-source contributors.',
  },
  {
    title: 'Data Science for the Common Good',
    issuer: 'UMass Center for Data Science and AI',
    window: '2026',
    note: 'Selected cohort applying data science to public-interest problems.',
  },
  {
    title: 'Entrepreneurs Accelerator Program',
    issuer: 'Franklin County CDC',
    window: 'Spring 2026',
    note: 'Selected for the accelerator supporting early-stage ventures.',
  },
];

/* ===========================================================
   Contact
   =========================================================== */

export interface Channel {
  key: string;
  label: string;
  value: string;
  href: string;
  note: string;
}

export const CHANNELS: Channel[] = [
  {
    key: 'mail',
    label: 'Email',
    value: 'kinjalpandey18@gmail.com',
    href: 'mailto:kinjalpandey18@gmail.com',
    note: 'Best for anything substantive — roles, research, collaboration.',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    value: 'in/kinjalpandey',
    href: 'https://www.linkedin.com/in/kinjalpandey',
    note: 'Full professional history and the fastest way to connect.',
  },
  {
    key: 'github',
    label: 'GitHub',
    value: 'kinjalumass',
    href: 'https://github.com/kinjalumass',
    note: 'Code, open-source contributions, and project repositories.',
  },
  {
    key: 'medium',
    label: 'Medium',
    value: '@kinjalpandey18',
    href: 'https://medium.com/@kinjalpandey18',
    note: 'Writing on AI, ethics, and the work in progress.',
  },
];

export const AVAILABILITY = {
  location: 'Amherst, Massachusetts',
  status: 'Open to research collaborations, internships, and full-time roles',
  timezone: 'ET (UTC−5 / −4)',
};
