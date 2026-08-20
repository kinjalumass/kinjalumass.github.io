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
   UMass has no stable public per-course page (SPIRE needs a login) so
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
    window: 'Aug 2025 to present',
    place: 'Amherst, MA',
    logo: 'img/logos/umass.png',
    notes: [
      'Concentration in field experience, coursework paired with applied placements.',
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
  },
  {
    school: 'Virginia Tech',
    credential: 'B.S. Computer Science',
    detail: 'Minor in Mathematics',
    window: 'Graduated Jun 2022, a year early',
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
  issued?: string;
  /**
   * Basename of the certificate in `public/docs/certificates/`, without the
   * extension. Absent means the document could not be retrieved, see the
   * note beside the Microsoft Learn and IBM entries below.
   */
  slug?: string;
  /** Defaults to pdf */
  ext?: 'pdf' | 'png' | 'jpg';
}

export const CERTIFICATIONS: Certification[] = [
  /* ---- AWS Skill Builder, all completed 13 August 2026 ----
     Every title below is read off the certificate itself. */
  {
    name: 'AWS Artificial Intelligence Practitioner Learning Plan',
    issuer: 'AWS Training & Certification',
    issued: 'Aug 2026',
    slug: 'aws-ai-practitioner-learning-plan',
  },
  {
    name: 'Fundamentals of Machine Learning and Artificial Intelligence',
    issuer: 'AWS Training & Certification',
    issued: 'Aug 2026',
    slug: 'aws-fundamentals-ml-and-ai',
  },
  {
    name: 'Exploring Artificial Intelligence Use Cases and Applications',
    issuer: 'AWS Training & Certification',
    issued: 'Aug 2026',
    slug: 'aws-exploring-ai-use-cases',
  },
  {
    name: 'Responsible Artificial Intelligence Practices',
    issuer: 'AWS Training & Certification',
    issued: 'Aug 2026',
    slug: 'aws-responsible-ai-practices',
  },
  {
    name: 'Developing Machine Learning Solutions',
    issuer: 'AWS Training & Certification',
    issued: 'Aug 2026',
    slug: 'aws-developing-ml-solutions',
  },
  {
    name: 'Developing Generative Artificial Intelligence Solutions',
    issuer: 'AWS Training & Certification',
    issued: 'Aug 2026',
    slug: 'aws-developing-generative-ai-solutions',
  },
  {
    name: 'Optimizing Foundation Models',
    issuer: 'AWS Training & Certification',
    issued: 'Aug 2026',
    slug: 'aws-optimizing-foundation-models',
  },
  {
    name: 'Security, Compliance, and Governance for AI Solutions',
    issuer: 'AWS Training & Certification',
    issued: 'Aug 2026',
    slug: 'aws-security-compliance-governance-ai',
  },
  {
    name: 'Essentials of Prompt Engineering',
    issuer: 'AWS Training & Certification',
    issued: 'Aug 2026',
    slug: 'aws-essentials-of-prompt-engineering',
  },
  {
    name: 'Exam Prep Plan: AWS Certified AI Practitioner (AIF-C01)',
    issuer: 'AWS Training & Certification',
    issued: 'Aug 2026',
    slug: 'aws-exam-prep-ai-practitioner-aif-c01',
  },

  /* ---- UMass, via Skillsoft ---- */
  {
    name: 'Security Awareness for End Users',
    issuer: 'University of Massachusetts',
    issued: 'Jul 2026',
    slug: 'umass-security-awareness-end-users',
    ext: 'png',
  },

  /*
   * ---- No document available ----
   * These were issued through platforms whose accounts have since been
   * deleted by the provider, so the certificates cannot be retrieved. They
   * are listed because they were earned; they simply have nothing to show.
   */
  { name: 'Train and evaluate regression models', issuer: 'Microsoft Learn' },
  { name: 'Fundamental AI Concepts', issuer: 'Microsoft Learn' },
  { name: 'Introduction to natural language processing concepts', issuer: 'Microsoft Learn' },
  { name: 'Explore and analyze data with Python', issuer: 'Microsoft Learn' },
  { name: 'Concepts: IBM Z Xplore', issuer: 'IBM' },
];

/** Full document, for the ones that have one. */
export function certDoc(c: Certification): string | null {
  return c.slug ? `docs/certificates/${c.slug}.${c.ext ?? 'pdf'}` : null;
}

/** Preview image rendered from the first page. */
export function certThumb(c: Certification): string | null {
  return c.slug ? `img/certs/${c.slug}.jpg` : null;
}

/* ===========================================================
   Experience
   =========================================================== */

export interface Role {
  org: string;
  /**
   * The organization's own website. Verified individually — a dead link on a
   * CV is worse than no link. See ORG_SITES below for the notes.
   */
  url?: string;
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
    url: 'https://www.cics.umass.edu',
    title: 'Course Grader: COMPSCI 684, Trustworthy & Responsible AI',
    window: 'Aug 2026 to present',
    place: 'Amherst, MA',
    kind: 'Applied',
    bullets: [
      'Course grader for COMPSCI 684: Trustworthy & Responsible AI, an advanced graduate course on the privacy, security, societal and environmental risks of modern AI systems.',
      'Evaluates coursework on adversarial attacks, AI security and privacy, responsible model development, generative AI risks, and current trustworthy-AI research.',
      'Works with material examining attack vectors, the guarantees and limits of current AI safety methods, and approaches to building more reliable systems.',
    ],
  },
  {
    org: 'Manning College of Information and Computer Sciences, UMass Amherst',
    url: 'https://www.cics.umass.edu',
    title: 'Open-Source Apprentice',
    window: 'Jun 2026 to Aug 2026',
    place: 'Amherst, MA',
    kind: 'Applied',
    bullets: [
      'Selected for the competitive Summer 2026 cohort of the CICS Open-Source Apprenticeship Program, which pairs students with experienced open-source contributors and industry mentors.',
      'Contributed to established open-source projects in a structured, mentor-guided apprenticeship.',
      'Emphasis on source control, contribution workflows, technical communication, and engagement with maintainer communities.',
    ],
  },
  {
    org: 'UMass Amherst Center for Data Science and Artificial Intelligence',
    url: 'https://ds.cs.umass.edu',
    title: 'Data Scientist',
    window: 'May 2026 to Aug 2026',
    place: 'Amherst, MA',
    kind: 'Applied',
    bullets: [
      'Selected for the 2026 Data Science for the Common Good program, training data scientists on real public-interest problems.',
      'Worked with the Boston Cyclists Union on safer, more accessible, and more equitable biking infrastructure.',
      'Contributed analysis across urban mobility, transportation safety, and community advocacy.',
      'Translated complex datasets into insights that support policy conversations and evidence-based decisions.',
    ],
  },
  {
    org: 'Steve Fisher Consulting',
    url: 'https://stevefisherconsulting.com',
    title: 'Technology Consultant',
    window: 'May 2025 to Sep 2025',
    place: 'San Diego, CA',
    kind: 'Industry',
    bullets: [
      'Designed and built technology to modernise document-heavy legal workflows, including a secure litigation-document platform with structured storage, metadata organization, and search.',
      'Implemented role-based access controls, audit logging, and secure document processing to handle sensitive legal information.',
      'Worked directly with the stakeholder to map existing workflows and refine features iteratively through testing and feedback.',
    ],
  },
  {
    org: 'SkyIT Services, a subsidiary of GBCS Group',
    url: 'https://skyit.services',
    title: 'Backend Developer Intern',
    window: 'Feb 2024 to Dec 2024',
    place: 'Remote',
    kind: 'Industry',
    bullets: [
      'Built and supported backend solutions in Python, Django REST Framework, Firebase and JavaScript across multiple software projects.',
      'Translated application requirements into reliable backend functionality, working in a collaborative environment on clean, maintainable, documented code.',
      'Gained production-oriented experience with backend architecture, API-driven development, and database-backed applications, in an environment applying ML and AI to fleet operations.',
    ],
  },
  {
    org: 'Simple Coaching Inc.',
    url: 'https://www.simplecoachinginc.com',
    title: 'Digital Solutions Consultant',
    window: 'Mar 2025 to May 2025',
    place: 'Remote',
    kind: 'Industry',
    bullets: [
      'Designed and built the company website, giving its coaching services, programs and events a more professional and organized presence.',
      'Worked directly with the business owner to improve the customer experience and use technology to support day-to-day operations.',
      'Refined the site and its digital workflows iteratively on stakeholder feedback, combining web development, UX and business problem-solving.',
    ],
  },
  {
    org: 'Franklin County Community Development Corporation',
    url: 'https://www.fccdc.org',
    title: 'Entrepreneurs Accelerator Program Participant',
    window: 'Mar 2026 to May 2026',
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
    url: 'https://mvp.microsoft.com/studentambassadors',
    title: 'Microsoft Learn Student Ambassador',
    window: 'Jan 2024 to Dec 2024',
    place: 'Blacksburg, VA',
    kind: 'Advocacy',
    bullets: [
      'Organized peer workshops and training on Azure cloud, AI fundamentals, and portfolio building, helping dozens of students bridge classroom learning and applied skills.',
      'Created reusable starter projects and hands-on resources so students could keep exploring Microsoft technologies independently.',
      'Built a community of aspiring developers on campus by mentoring peers and amplifying their work.',
    ],
  },
  {
    org: 'Virginia Tech',
    url: 'https://www.vt.edu',
    title: 'Student Leader',
    window: 'Aug 2024 to Dec 2024',
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
    url: 'https://www.codsoft.in',
    title: 'AI Intern',
    window: 'Jan 2024 to Feb 2024',
    place: 'Remote',
    kind: 'Industry',
    bullets: [
      'Explored core AI domains (NLP, computer vision, and neural networks) by building small projects applying algorithms to real use cases.',
      'Moved from theory to practice on each project, strengthening applied implementation skills.',
      'Collaborated in a remote team while documenting progress publicly on GitHub.',
    ],
  },
  {
    org: 'IBM',
    url: 'https://www.ibm.com/z',
    title: 'Z Student Ambassador',
    window: 'Nov 2023 to Jun 2024',
    place: 'Blacksburg, VA',
    kind: 'Advocacy',
    bullets: [
      'Promoted IBM Z mainframe technologies through workshops on security, data pipelines, and batch processing.',
      'Connected mainframe principles to modern AI/ML workflows, showing how legacy systems underpin scalable data handling.',
      'Engaged students, faculty, and IBM professionals to build a knowledge-sharing community.',
    ],
  },
  {
    org: 'Google Developer Student Club, Virginia Tech',
    url: 'https://gdg.community.dev',
    title: 'Team Leader',
    window: 'Oct 2023 to Jun 2024',
    place: 'Blacksburg, VA',
    kind: 'Advocacy',
    bullets: [
      'Directed hackathons, coding bootcamps, and workshops on Google Cloud and APIs for a diverse student body.',
      'Mentored peers through real-world software and machine learning projects.',
      'Built partnerships with faculty and industry professionals to keep programming aligned with real-world needs.',
    ],
  },
  {
    org: 'Virginia Tech',
    url: 'https://www.vt.edu',
    title: 'Peer Mentor',
    window: 'Jul 2023 to Aug 2024',
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
    url: 'https://cyberinitiative-swva.org',
    title: 'Coding & Cryptography Researcher',
    window: 'Oct 2023 to Jan 2024',
    place: 'Blacksburg, VA',
    kind: 'Research',
    bullets: [
      'Developed anomaly-detection algorithms and coded secure data pipelines for handling sensitive information.',
      'Investigated coding theory and cryptographic concepts to design fault-tolerant data encoding approaches.',
      'Collaborated with faculty and peers to publish reports and present findings at academic forums.',
    ],
  },
  {
    org: 'VT Center for the Enhancement of Engineering Diversity',
    url: 'https://eng.vt.edu/ceed.html',
    title: 'Upper Class Leader, Design Challenge Team',
    window: 'Aug 2023 to Oct 2023',
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
    url: 'https://eng.vt.edu/ceed.html',
    title: 'Member',
    window: 'Aug 2022 to Jul 2023',
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
    context: 'UMass Center for Data Science and AI: Data Science for the Common Good',
    window: '2026',
    summary:
      'Data work supporting safer, more accessible, and more equitable biking infrastructure across Boston.',
    bullets: [
      'Analysis across urban mobility and transportation-safety datasets.',
      'Framing findings for community advocacy and stakeholder communication.',
      'Turning complex data into evidence that holds up in policy conversations.',
    ],
    stack: ['Python', 'Geospatial data', 'Statistics', 'Civic tech'],
  },
  {
    index: '03',
    name: 'Anomaly detection & secure pipelines',
    kind: 'Research',
    context: 'Commonwealth Cyber Initiative, Southwest Virginia',
    window: '2023 to 2024',
    summary:
      'Applied research at the seam between cryptography and machine learning, on data that cannot afford to leak.',
    bullets: [
      'Built anomaly-detection algorithms and secure data pipelines for sensitive information.',
      'Designed fault-tolerant encoding approaches drawn from coding theory.',
      'Published reports and presented findings at academic forums.',
    ],
    stack: ['Cryptography', 'Coding theory', 'Anomaly detection', 'Python'],
  },
  {
    index: '04',
    name: 'ML Smart Calendar',
    kind: 'Prototype',
    context: 'VT Center for the Enhancement of Engineering Diversity',
    window: '2023',
    summary:
      'A machine-learning prototype that recommended tasks and schedules to students, covered in the press as an AI productivity tool built by a student, for students.',
    bullets: [
      'Co-led the prototype from concept through working demonstration.',
      'Applied recommendation approaches to the specific shape of student schedules.',
      'Showed how AI could address an everyday productivity problem rather than an abstract one.',
    ],
    stack: ['Machine learning', 'Recommendation', 'Python'],
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
    window: '2026 to present',
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
    window: '2023 to 2024',
    summary:
      'Reusable teaching material built so the workshops would outlive the sessions that introduced them.',
    bullets: [
      'Starter projects and hands-on resources for Azure, AI fundamentals, and portfolio building.',
      'Workshop material on IBM Z security, data pipelines, and batch processing.',
      'Hackathon and bootcamp curricula covering Google Cloud and APIs.',
    ],
    stack: ['Azure', 'Google Cloud', 'IBM Z', 'Curriculum'],
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
  /* The two pitch wins. Every detail here is read off the presentation
     cheque in the photograph, center, amount and date. The CalendAI cheque
     names no competition, so none is claimed. */
  {
    title: 'Karnah: second place, $750',
    issuer: 'UPitch Spring 2026 · UMass Amherst Entrepreneurship Club',
    window: 'Apr 2026',
    note:
      'Second of nineteen student founders, with Rishav Chakravarty. Sponsored by the Berthiaume Center for Entrepreneurship.',
    weight: 'major',
  },
  {
    title: 'CalendAI: $500 award',
    issuer: 'Apex Center for Entrepreneurs · Pamplin College of Business, Virginia Tech',
    window: 'Nov 2024',
    note: 'Awarded to CalendAI, the machine-learning smart calendar built for students.',
    weight: 'major',
  },
  {
    title: 'Trendify AI: Minute Pitch winner, $300',
    issuer: 'Berthiaume Center for Entrepreneurship · Isenberg School of Management, UMass Amherst',
    window: 'Oct 2025',
    note: 'First place in the Minute Pitch competition.',
    weight: 'major',
  },
  {
    title: "Dean's List with Distinction",
    issuer: 'Virginia Tech',
    window: 'Multiple terms',
    note: 'Awarded for academic distinction across qualifying terms at Virginia Tech.',
    weight: 'major',
  },
  {
    title: 'Undergraduate Research Excellence Program',
    issuer: 'Virginia Tech',
    window: 'Member',
    note: 'Member of the program recognizing sustained undergraduate research contribution.',
  },
  {
    title: "Buzz's Bunch Scholarship Award",
    issuer: 'Virginia Tech',
    window: '2024 to 2025',
    note: 'Scholarship award winner for the 2024 to 2025 academic year.',
  },
  {
    title: 'Student Affairs Scholarship',
    issuer: 'Virginia Tech',
    window: '2024',
    note: 'Scholarship winner, 2024.',
  },
  {
    title: 'Virginia Pell Initiative Grant',
    issuer: 'Commonwealth of Virginia',
    window: 'Grant',
    note: 'Grant recipient, supporting undergraduate study in Virginia.',
  },
];

export interface Selection {
  title: string;
  issuer: string;
  window: string;
  note: string;
  /** The program's own page. Each one verified individually. */
  url?: string;
}

export const SELECTIONS: Selection[] = [
  {
    title: 'Open-Source Apprenticeship Program',
    issuer: 'UMass CICS',
    window: 'Summer 2026',
    note: 'Competitive mentor-guided cohort pairing students with experienced open-source contributors.',
    // The OSAP page CICS itself links to from cics.umass.edu/careers/cics-careers-notion
    url: 'https://cicscareers.notion.site/Open-Source-Apprenticeship-Program-OSAP-1e65ada1554b805a86edf5c541a3362b',
  },
  {
    title: 'Data Science for the Common Good',
    issuer: 'UMass Center for Data Science and AI',
    window: '2026',
    note: 'Selected cohort applying data science to public-interest problems.',
    url: 'https://ds.cs.umass.edu/programs/ds4cg',
  },
  {
    title: 'Entrepreneurs Accelerator Program',
    issuer: 'Franklin County CDC',
    window: 'Spring 2026',
    note: 'Selected for the accelerator supporting early-stage ventures.',
    // The accelerator sits inside the FCCDC's UPstart program, not the
    // generic business-development page.
    url: 'https://www.fccdc.org/upstart-program/',
  },
  {
    title: 'Grace Hopper Celebration',
    issuer: 'AnitaB.org',
    window: '2026',
    note: 'Selected to attend the largest gathering of women and non-binary technologists in the world.',
    url: 'https://ghc.anitab.org/',
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
    note: 'Best for anything substantive, roles, research, collaboration.',
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

/* ===========================================================
   Photography for the honors page

   ⚠️  The badge in the second frame reads "VT · Student Affairs"
   and her name; the line beneath it is too soft to read, so the
   specific event is not named here. Add it, and photographer
   credit, if you have them.
   =========================================================== */

export interface HonorPlate {
  src: string;
  alt: string;
  caption: string;
}

export const HONOR_PLATES: HonorPlate[] = [
  {
    src: 'img/honors/scholarship-backdrop.jpg',
    alt: 'Kinjal Pandey at a Virginia Tech scholarship recognition event, photographed against the Inn at Virginia Tech backdrop',
    caption: 'Scholarship recognition, The Inn at Virginia Tech and Skelton Conference Center.',
  },
  {
    src: 'img/honors/scholarship-dinner.jpg',
    alt: 'Kinjal Pandey seated with donors and guests at a Virginia Tech Student Affairs scholarship dinner',
    caption: 'At the donor table. Virginia Tech Student Affairs.',
  },
];
