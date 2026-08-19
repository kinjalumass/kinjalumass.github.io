/**
 * Knowledge base for the console assistant.
 *
 * No model, no API, no network. Questions are scored against the `keywords`
 * of each entry and the best match above a threshold is returned verbatim,
 * so the assistant can only ever say things that are written here.
 *
 * To teach it something new: add an entry. To change what it says: edit the
 * `answer` lines. Keywords should be lowercase and singular where possible.
 */

export interface Entry {
  id: string;
  /** Terms that pull a question toward this entry */
  keywords: string[];
  /** Shown as a suggested prompt when `suggest` is true */
  question: string;
  suggest?: boolean;
  /** Each string renders as its own paragraph */
  answer: string[];
}

/** Query words that get expanded before scoring. */
export const SYNONYMS: Record<string, string[]> = {
  ml: ['machine', 'learning'],
  ai: ['artificial', 'intelligence'],
  nlp: ['natural', 'language', 'processing'],
  cv: ['computer', 'vision'],
  llm: ['large', 'language', 'model', 'reasoning'],
  cot: ['chain', 'thought', 'reasoning'],
  pii: ['privacy', 'personal', 'data', 'leak'],
  uni: ['university', 'school', 'college'],
  grad: ['graduate', 'masters', 'degree'],
  job: ['work', 'role', 'experience', 'position'],
  jobs: ['work', 'role', 'experience', 'position'],
  hire: ['hiring', 'recruit', 'employ'],
  vt: ['virginia', 'tech'],
  umass: ['massachusetts', 'amherst'],
  gdsc: ['google', 'developer', 'student', 'club'],
  msla: ['microsoft', 'learn', 'ambassador'],
  publication: ['paper', 'research', 'publish'],
  paper: ['publication', 'research', 'publish'],
  bike: ['cycling', 'cyclist', 'boston', 'mobility'],
  oss: ['open', 'source'],
  crypto: ['cryptography', 'security', 'encryption'],
};

export const ENTRIES: Entry[] = [
  {
    id: 'who',
    question: 'Who is Kinjal?',
    suggest: true,
    keywords: ['who', 'about', 'yourself', 'introduce', 'bio', 'summary', 'kinjal', 'pandey'],
    answer: [
      "Kinjal Pandey is a Master's student in Computer Science at UMass Amherst, concentrating in field experience.",
      'She graduated early from Virginia Tech with a B.S. in Computer Science and a minor in Mathematics, where she started building AI-powered tools aimed at productivity and real-world problems.',
      'Her work is deliberately interdisciplinary: technical depth on one side, AI policy, ethics, and social impact on the other. The through-line is building computing systems that are secure, transparent, and socially responsible.',
    ],
  },
  {
    id: 'education',
    question: 'What did she study?',
    suggest: true,
    keywords: [
      'education', 'study', 'studied', 'degree', 'school', 'university', 'college',
      'masters', 'bachelor', 'bs', 'ms', 'major', 'minor', 'math', 'mathematics',
      'graduate', 'academic', 'gpa', 'coursework', 'umass', 'cics', 'concentration',
    ],
    answer: [
      'M.S. in Computer Science at the University of Massachusetts Amherst, started August 2025, with a concentration in field experience.',
      'B.S. in Computer Science with a minor in Mathematics from Virginia Tech, completed June 2022 — she graduated early.',
      'Her coursework spans machine learning, cryptography, and data science, alongside AI policy and ethics.',
    ],
  },
  {
    id: 'virginiatech',
    question: 'What did she do at Virginia Tech?',
    keywords: [
      'virginia', 'tech', 'vt', 'blacksburg', 'undergrad', 'undergraduate',
      'bachelor', 'hokie', 'early',
    ],
    answer: [
      'Virginia Tech is where her B.S. in Computer Science with a Mathematics minor came from, finished June 2022 — early.',
      'While there she led the Google Developer Student Club chapter, served as a Microsoft Learn and IBM Z ambassador, researched cryptography with the Commonwealth Cyber Initiative, and co-led a machine-learning smart calendar prototype.',
      'She also worked as a Student Leader supporting 2,000+ residents and spent over a year as a Peer Mentor, and completed the Undergraduate Career Bridge Experience.',
    ],
  },
  {
    id: 'research',
    question: 'Tell me about her research',
    suggest: true,
    keywords: [
      'research', 'publication', 'paper', 'publish',
      'chain', 'sanitized', 'thought', 'cot', 'pii', 'leak', 'leakage', 'privacy',
      'reasoning', 'llm', 'model', 'sanitize',
    ],
    answer: [
      'Her publication is "Chain-of-Sanitized-Thoughts: Plugging PII Leakage in CoT of Large Reasoning Models."',
      'The problem it addresses: a reasoning model can produce a careful final answer while its chain-of-thought quietly exposes the personal data it reasoned over. The reasoning trace becomes the leak.',
      'The work looks at sanitizing that intermediate reasoning without degrading the reasoning quality itself — privacy and capability at the same time, rather than one traded for the other.',
    ],
  },
  {
    id: 'cryptography',
    question: 'What is her cryptography work?',
    keywords: [
      'cryptography', 'crypto', 'security', 'secure', 'encryption', 'encoding',
      'anomaly', 'detection', 'coding', 'theory', 'commonwealth', 'cyber', 'initiative',
      'cci', 'fault', 'tolerant', 'pipeline',
    ],
    answer: [
      'At the Commonwealth Cyber Initiative in Southwest Virginia she worked as a Coding & Cryptography Researcher from October 2023 to January 2024.',
      'She developed anomaly-detection algorithms and built secure data pipelines for handling sensitive information, and investigated coding theory to design fault-tolerant encoding approaches.',
      'She collaborated with faculty and peers to publish reports and present findings at academic forums.',
    ],
  },
  {
    id: 'current',
    question: 'What is she working on now?',
    suggest: true,
    keywords: [
      'now', 'current', 'currently', 'today', 'present', 'recent', 'latest',
      'working', 'doing', 'busy', 'next', 'summer', '2026',
    ],
    answer: [
      'Two things in parallel. She was selected for the UMass CICS Open-Source Apprenticeship Program, Summer 2026 cohort — a competitive, mentor-guided program pairing students with experienced open-source contributors to work on established projects.',
      "She's also a Data Scientist with the UMass Center for Data Science and Artificial Intelligence, in the 2026 Data Science for the Common Good program, partnered with the Boston Cyclists Union.",
      'That project supports safer and more equitable biking infrastructure in Boston — turning urban mobility and transportation-safety data into insights that hold up in policy conversations.',
    ],
  },
  {
    id: 'boston',
    question: 'What is the Boston Cyclists Union project?',
    keywords: [
      'boston', 'cyclist', 'cycling', 'bike', 'biking', 'mobility', 'transportation',
      'urban', 'civic', 'common', 'good', 'cdsai', 'infrastructure', 'equity', 'equitable',
    ],
    answer: [
      'Through the Data Science for the Common Good program at UMass, she works with the Boston Cyclists Union on safer, more accessible, and more equitable biking infrastructure.',
      'The work is data-driven analysis of urban mobility and transportation safety, framed for community advocacy — translating complex datasets into something stakeholders and policymakers can actually act on.',
      "It's the clearest example of the pattern in her work: technical rigor pointed at a public-interest problem.",
    ],
  },
  {
    id: 'microsoft',
    question: 'What did she do at Microsoft?',
    keywords: ['microsoft', 'azure', 'learn', 'msla'],
    answer: [
      'She was a Microsoft Learn Student Ambassador through 2024, running peer workshops and training on Azure cloud, AI fundamentals, and portfolio building.',
      'She also built reusable starter projects and hands-on resources so students could keep exploring Microsoft technologies after the sessions ended.',
    ],
  },
  {
    id: 'ibm',
    question: 'What did she do at IBM?',
    keywords: ['ibm', 'mainframe', 'zxplore', 'batch'],
    answer: [
      'She was an IBM Z Student Ambassador from late 2023 to mid 2024, designing and delivering workshops on mainframe security, data pipelines, and batch processing.',
      'Her angle was connecting mainframe principles to modern AI/ML workflows — showing how legacy systems underpin scalable data handling.',
    ],
  },
  {
    id: 'google',
    question: 'What did she do at Google?',
    keywords: ['google', 'dsc', 'gdsc', 'club', 'hackathon', 'bootcamp'],
    answer: [
      'She was Team Leader of the Google Developer Student Club at Virginia Tech from late 2023 to mid 2024.',
      'She directed hackathons, coding bootcamps, and workshops on Google Cloud and APIs, mentored peers through real projects, and built faculty and industry partnerships for the club.',
    ],
  },
  {
    id: 'ambassadorships',
    question: 'What are her developer advocacy roles?',
    suggest: true,
    keywords: ['ambassador', 'ambassadorship', 'advocate', 'advocacy', 'community', 'developer relations'],
    answer: [
      'Three at once, roughly 2023 to 2024: Team Leader of the Google Developer Student Club at Virginia Tech, Microsoft Learn Student Ambassador, and IBM Z Student Ambassador.',
      'Ask about any one of them for detail.',
    ],
  },
  {
    id: 'backend',
    question: 'Has she done software engineering work?',
    keywords: [
      'backend', 'software', 'engineer', 'engineering', 'developer', 'django', 'firebase',
      'javascript', 'api', 'skyit', 'consulting', 'fisher', 'intern',
    ],
    answer: [
      'Yes. She was a Backend Developer Intern at SkyIT Services for eleven months in 2024, building backend solutions in Python, Django REST Framework, Firebase and JavaScript.',
      'In 2025 she worked as a Technology Consultant at Steve Fisher Consulting, building a secure litigation-document platform with role-based access control, audit logging, and structured search.',
    ],
  },
  {
    id: 'leadership',
    question: 'What leadership has she done?',
    keywords: [
      'leadership', 'leader', 'lead', 'mentor', 'mentorship', 'peer', 'manage',
      'team', 'resident', 'student', 'crisis', 'title', 'ix', 'community', 'people',
    ],
    answer: [
      'As a Student Leader at Virginia Tech she supported a community of over 2,000 residents with daily focus on about 150, triaging high-tension situations with Title IX and mental-health training.',
      'She launched inclusive programs and workshops that raised participation and reduced conduct escalations in her area, and standardized communications and documentation so handoffs between shifts stopped dropping things.',
      'She also spent over a year as a Peer Mentor for first-year cohorts, building lightweight tracking for mentee goals and streamlining referrals to campus services.',
    ],
  },
  {
    id: 'internship',
    question: 'Has she interned anywhere?',
    keywords: [
      'intern', 'internship', 'interned', 'codsoft', 'industry', 'company',
      'remote', 'virtual',
    ],
    answer: [
      'She was an AI Intern at CodSoft in early 2024, working remotely.',
      'She built small projects across core AI domains — natural language processing, computer vision, and neural networks — applying algorithms to real use cases and documenting the work publicly on GitHub.',
    ],
  },
  {
    id: 'entrepreneurship',
    question: 'What about her startup work?',
    keywords: [
      'startup', 'entrepreneur', 'entrepreneurship', 'accelerator', 'venture',
      'business', 'franklin', 'pitch', 'founder', 'company',
    ],
    answer: [
      'She was selected for Franklin County CDC\'s Spring 2026 Entrepreneurs Accelerator Program, which supports emerging entrepreneurs and early-stage ventures.',
      'Through structured workshops and mentorship she developed and refined startup strategy, strengthening positioning, growth strategy, and execution readiness.',
    ],
  },
  {
    id: 'projects',
    question: 'What has she built?',
    suggest: true,
    keywords: [
      'project', 'built', 'build', 'building', 'made', 'created', 'app', 'tool',
      'calendar', 'productivity', 'smart', 'prototype', 'portfolio', 'code',
    ],
    answer: [
      'The one that got press: a machine-learning smart calendar prototype that recommended tasks and schedules to students, co-led through the VT Center for the Enhancement of Engineering Diversity. It was covered as an AI productivity tool built by a student for students.',
      'At CodSoft she built NLP, computer vision, and neural network projects applying algorithms to real use cases.',
      'At the Commonwealth Cyber Initiative she developed anomaly-detection algorithms and secure data pipelines. She currently contributes to established open-source projects through the UMass CICS apprenticeship.',
    ],
  },
  {
    id: 'skills',
    question: 'What is her technical stack?',
    suggest: true,
    keywords: [
      'skill', 'stack', 'technical', 'language', 'tool', 'framework',
      'python', 'scikit', 'sklearn', 'neural', 'network', 'know', 'proficient',
      'programming', 'library', 'machine', 'learning', 'deep', 'certification',
      'azure', 'cloud', 'pandas', 'regression',
    ],
    answer: [
      'Her top skills are Scikit-Learn, neural networks, and cryptography.',
      'Around that: Python, natural language processing, computer vision, data pipelines and analysis, coding theory, and cloud work across Azure, Google Cloud, and IBM Z.',
      'Certifications include training and evaluating regression models, fundamental AI concepts, introduction to NLP concepts, exploring and analyzing data with Python, and IBM Z Xplore.',
    ],
  },
  {
    id: 'awards',
    question: 'What awards has she won?',
    keywords: [
      'award', 'honor', 'honour', 'scholarship', 'recognition', 'dean', 'list',
      'grant', 'prize', 'won', 'win', 'distinction', 'excellence',
    ],
    answer: [
      "Dean's List with Distinction, and membership in the Undergraduate Research Excellence Program.",
      "She won the Buzz's Bunch Scholarship award for 2024-25, the Student Affairs Scholarship in 2024, and received the Virginia Pell Initiative Grant.",
    ],
  },
  {
    id: 'ethics',
    question: 'What is her stance on AI ethics?',
    keywords: [
      'ethic', 'ethics', 'policy', 'responsible', 'social', 'impact', 'transparent',
      'transparency', 'trust', 'safety', 'governance', 'bias', 'fair', 'philosophy',
      'believe', 'value', 'approach',
    ],
    answer: [
      'Her academic path deliberately blends technical expertise with AI policy, ethics, and social impact rather than treating them as separate tracks.',
      'The commitment she states is building computing systems that are secure, transparent, and socially responsible, grounded in rigorous mathematical foundations and practical data science experience.',
      'Her research is a direct expression of that: the PII-in-chain-of-thought work exists because a system can be correct at the surface and still be leaking underneath.',
    ],
  },
  {
    id: 'why',
    question: 'Why should I hire her?',
    suggest: true,
    keywords: [
      'hire', 'hiring', 'recruit', 'why', 'strength', 'good', 'best', 'stand',
      'unique', 'different', 'value', 'bring', 'candidate', 'fit',
    ],
    answer: [
      'Three things sit together in her record that usually do not. Research depth — a publication on privacy leakage in reasoning models. Applied delivery — production-shaped data science with a real civic partner. And communication — three simultaneous ambassadorships spent teaching other people to build.',
      'She also finishes ahead of schedule: an early Virginia Tech graduation, with a math minor attached.',
      'The consistent thread is systems-level thinking. Mainframe fundamentals connected to modern ML, coding theory connected to secure pipelines, urban data connected to policy. She looks for where the layers meet.',
    ],
  },
  {
    id: 'contact',
    question: 'How do I get in touch?',
    suggest: true,
    keywords: [
      'contact', 'reach', 'email', 'touch', 'connect', 'linkedin', 'github',
      'medium', 'social', 'message', 'talk', 'hello', 'available', 'resume', 'cv',
    ],
    answer: [
      'Email: kinjalpandey18@gmail.com',
      'LinkedIn: linkedin.com/in/kinjalpandey — she also writes at medium.com/@kinjalpandey18.',
      'She is based in Amherst, Massachusetts.',
    ],
  },
  {
    id: 'location',
    question: 'Where is she based?',
    keywords: [
      'where', 'location', 'based', 'live', 'city', 'state', 'amherst', 'massachusetts',
      'boston', 'virginia', 'blacksburg', 'relocate', 'remote',
    ],
    answer: [
      'Amherst, Massachusetts, where she is doing her M.S. at UMass.',
      'Before that she was in Blacksburg, Virginia for her undergraduate degree at Virginia Tech.',
    ],
  },
  {
    id: 'opensource',
    question: 'What open-source work does she do?',
    keywords: [
      'open', 'source', 'oss', 'contribute', 'contribution', 'apprentice',
      'apprenticeship', 'cics', 'github', 'community', 'collaborate',
    ],
    answer: [
      'She was selected for the UMass CICS Open-Source Apprenticeship Program, Summer 2026 cohort — a competitive program connecting students with experienced open-source contributors and industry mentors.',
      'The apprenticeship focuses on contributing to established projects while strengthening software engineering practice: source control, contribution workflows, technical communication, and engagement with maintainer communities.',
    ],
  },
  {
    id: 'teaching',
    question: 'Does she teach or speak?',
    keywords: [
      'teach', 'teaching', 'speak', 'speaker', 'talk', 'workshop', 'present',
      'presentation', 'bootcamp', 'hackathon', 'event', 'train', 'training',
    ],
    answer: [
      'Extensively. Across the Google, Microsoft, and IBM programs she ran hackathons, coding bootcamps, and workshops on Google Cloud and APIs, Azure and AI fundamentals, and IBM Z security and batch processing.',
      'She built reusable starter projects and hands-on resources so the material outlived the sessions, and presented research findings at academic forums.',
    ],
  },
  {
    id: 'writing',
    question: 'Has she been written about?',
    keywords: [
      'press', 'article', 'news', 'media', 'write', 'writing', 'blog', 'medium',
      'featured', 'coverage', 'newslink', 'nrv',
    ],
    answer: [
      'Her AI productivity calendar was covered by NRV News as a student-built tool.',
      'She was also featured in coverage of the Eric Carle Museum, where fashion met illustration — the modeling side of her work.',
      'She writes at medium.com/@kinjalpandey18.',
    ],
  },
];

/* ===========================================================
   Retrieval
   =========================================================== */

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'do', 'does', 'did',
  'of', 'in', 'on', 'at', 'to', 'for', 'with', 'and', 'or', 'but', 'she', 'her',
  'his', 'he', 'they', 'it', 'you', 'your', 'me', 'my', 'i', 'we', 'us', 'that',
  'this', 'these', 'those', 'can', 'could', 'would', 'should', 'will', 'about',
  'tell', 'know', 'have', 'has', 'had', 'get', 'got', 'any', 'some', 'more',
  'please', 'kinjal', 'pandey',
]);

function tokenize(input: string): string[] {
  const raw = input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const out: string[] = [];
  for (const word of raw) {
    if (SYNONYMS[word]) out.push(...SYNONYMS[word]);
    if (!STOPWORDS.has(word)) out.push(word);

    // Crude stemming so "interned", "publishing", "awards" reach their roots.
    const stem = word
      .replace(/(ings|ing|ies|ed|es|s)$/, (m) => (word.length - m.length >= 3 ? '' : m))
      .replace(/i$/, 'y');
    if (stem !== word && stem.length >= 3 && !STOPWORDS.has(stem)) out.push(stem);
  }
  return out;
}

export interface Match {
  entry: Entry;
  score: number;
}

/**
 * Scores every entry against the query and returns the best one, or null when
 * nothing clears the confidence floor.
 */
export function retrieve(query: string): Match | null {
  const tokens = tokenize(query);
  if (!tokens.length) return null;

  let best: Match | null = null;

  for (const entry of ENTRIES) {
    let score = 0;
    for (const token of tokens) {
      for (const keyword of entry.keywords) {
        if (keyword === token) score += 3;
        else if (keyword.startsWith(token) && token.length >= 4) score += 2;
        else if (token.startsWith(keyword) && keyword.length >= 4) score += 1;
      }
    }
    // Normalise a little so keyword-heavy entries don't always win.
    const normalised = score / Math.sqrt(entry.keywords.length);
    if (!best || normalised > best.score) best = { entry, score: normalised };
  }

  return best && best.score >= 0.5 ? best : null;
}

export const SUGGESTIONS = ENTRIES.filter((e) => e.suggest);
