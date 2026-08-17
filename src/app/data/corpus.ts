/**
 * Grounding corpus for the assistant.
 *
 * Chunks are assembled from the same data that renders the site, so the
 * assistant can never drift from what the pages say — edit `profile.ts`,
 * `developer.ts` or `ventures.ts` and the assistant updates with them.
 *
 * A handful of chunks at the bottom carry facts that live nowhere else
 * (the publication detail, press, availability).
 */
import { INTRO, STACK } from './developer';
import {
  AVAILABILITY,
  CERTIFICATIONS,
  CHANNELS,
  DEGREES,
  HONORS,
  PROJECTS,
  ROLES,
  SELECTIONS,
} from './profile';
import { VENTURES } from './ventures';

export interface Chunk {
  id: string;
  /** Shown as a source chip under the answer */
  title: string;
  /** Extra terms that should pull this chunk in */
  tags: string[];
  text: string;
}

const chunks: Chunk[] = [];

/* --- who she is ----------------------------------------------------------- */

chunks.push({
  id: 'identity',
  title: 'Overview',
  tags: ['who', 'about', 'summary', 'bio', 'introduce', 'kinjal', 'pandey', 'herself'],
  text:
    `Kinjal Pandey is a Master's student in Computer Science at UMass Amherst, concentrating in field experience. ` +
    `She graduated early from Virginia Tech with a B.S. in Computer Science and a minor in Mathematics. ` +
    `${INTRO.headline} ${INTRO.body} ` +
    `She is based in ${AVAILABILITY.location}. Her work spans machine learning, privacy and security, applied data science, and developer advocacy.`,
});

/* --- education ------------------------------------------------------------ */

for (const d of DEGREES) {
  const courses = d.courses
    .map((g) => `${g.label}: ${g.courses.map((c) => `${c.code} ${c.title}`).join(', ')}`)
    .join('. ');
  chunks.push({
    id: `edu-${d.school.toLowerCase().replace(/\W+/g, '-')}`,
    title: `Education — ${d.school}`,
    tags: ['education', 'degree', 'study', 'university', 'college', 'coursework', 'course', 'gpa', 'major', 'minor'],
    text:
      `${d.credential} at ${d.school} (${d.detail}), ${d.window}, ${d.place}. ` +
      `${d.notes.join(' ')} Coursework — ${courses}.`,
  });
}

chunks.push({
  id: 'certifications',
  title: 'Certifications',
  tags: ['certification', 'certificate', 'credential', 'training', 'microsoft learn', 'ibm'],
  text: `Certifications: ${CERTIFICATIONS.map((c) => `${c.name} (${c.issuer})`).join('; ')}.`,
});

/* --- experience ----------------------------------------------------------- */

for (const r of ROLES) {
  chunks.push({
    id: `role-${r.org.toLowerCase().replace(/\W+/g, '-')}-${r.title.toLowerCase().replace(/\W+/g, '-')}`.slice(0, 60),
    title: `${r.title} — ${r.org}`,
    tags: ['experience', 'role', 'job', 'work', 'position', r.kind.toLowerCase()],
    text: `${r.title} at ${r.org}, ${r.window}, ${r.place}. Category: ${r.kind}. ${r.bullets.join(' ')}`,
  });
}

/* --- projects ------------------------------------------------------------- */

for (const p of PROJECTS) {
  chunks.push({
    id: `project-${p.name.toLowerCase().replace(/\W+/g, '-')}`.slice(0, 60),
    title: `Project — ${p.name}`,
    tags: ['project', 'built', 'research', 'portfolio', ...p.stack.map((s) => s.toLowerCase())],
    text: `${p.name} (${p.kind}), ${p.context}, ${p.window}. ${p.summary} ${p.bullets.join(' ')} Technologies: ${p.stack.join(', ')}.`,
  });
}

/* --- honors --------------------------------------------------------------- */

chunks.push({
  id: 'honors',
  title: 'Honors & awards',
  tags: ['honor', 'award', 'scholarship', 'grant', 'dean', 'distinction', 'prize', 'recognition'],
  text: `Honors and awards: ${HONORS.map((h) => `${h.title} (${h.issuer}${h.window && h.window !== '—' ? `, ${h.window}` : ''}) — ${h.note}`).join(' ')}`,
});

chunks.push({
  id: 'selections',
  title: 'Competitive selections',
  tags: ['selected', 'selection', 'cohort', 'program', 'accelerator', 'apprenticeship', 'competitive'],
  text: `Competitive programme selections: ${SELECTIONS.map((s) => `${s.title} (${s.issuer}, ${s.window}) — ${s.note}`).join(' ')}`,
});

/* --- skills --------------------------------------------------------------- */

chunks.push({
  id: 'skills',
  title: 'Technical skills',
  tags: ['skill', 'stack', 'technical', 'language', 'tool', 'framework', 'python', 'know', 'proficient', 'technology'],
  text:
    `Top skills are Scikit-Learn, neural networks, and cryptography. Full stack of tools and areas: ${STACK.join(', ')}. ` +
    `She works across machine learning, natural language processing, computer vision, data pipelines and analysis, coding theory, ` +
    `and cloud platforms including Azure, Google Cloud and IBM Z.`,
});

/* --- publication (detail that lives nowhere else) ------------------------- */

chunks.push({
  id: 'publication',
  title: 'Publication — Chain-of-Sanitized-Thoughts',
  tags: ['publication', 'paper', 'research', 'arxiv', 'pii', 'privacy', 'cot', 'chain', 'thought', 'llm', 'reasoning', 'benchmark'],
  text:
    `Publication: "Chain-of-Sanitized-Thoughts: Plugging PII Leakage in CoT of Large Reasoning Models", arXiv:2601.05076, January 2026. ` +
    `Authors: Arghyadeep Das, Sai Sreenivas Chintha, Rishiraj Girmal, Kinjal Pandey, and Sharvi Endait — all at UMass Amherst. It is a five-author paper, not sole-authored. ` +
    `The problem: large reasoning models improve performance and interpretability by generating explicit chain-of-thought, but that transparency leaks personally identifiable information — ` +
    `intermediate reasoning often restates names, demographics and medical details even when the final answer has been scrubbed by guardrails, and longer chain-of-thought increases leakage rather than reducing it. ` +
    `The contribution: PII-CoT-Bench, a supervised dataset with privacy-aware chain-of-thought annotations plus a category-balanced evaluation benchmark covering realistic and adversarial leakage scenarios. ` +
    `The finding is capability-dependent: state-of-the-art models benefit most from prompt-based controls, while weaker models need fine-tuning to meaningfully reduce leakage. ` +
    `Both approaches substantially cut PII exposure with minimal loss of utility, showing private reasoning is achievable without sacrificing performance.`,
});

/* --- ventures ------------------------------------------------------------- */

for (const v of VENTURES) {
  chunks.push({
    id: `venture-${v.id}`,
    title: `Venture — ${v.name}`,
    // `v.id` is plain ASCII, which matters for names like Karnaḥ
    tags: [
      'venture', 'startup', 'kinnovation', 'entrepreneur', 'founder', 'business',
      v.name.toLowerCase(),
      ...v.id.split('-'),
    ],
    text:
      `${v.name} (${v.sector}, stage: ${v.stage}). ${v.tagline}. ${v.lede} ` +
      `Problem — ${v.problem.title}: ${v.problem.lead} ${v.problem.points.join(' ')} ` +
      `Thesis: ${v.thesis} ` +
      `Features: ${v.features.map((f) => `${f.title} — ${f.body}`).join(' ')} ${v.closing}`,
  });
}

chunks.push({
  id: 'kinnovation',
  title: 'Kinnovation — the studio',
  tags: ['kinnovation', 'studio', 'ventures', 'portfolio', 'entrepreneur', 'startups'],
  text:
    `Kinnovation is Kinjal's venture studio. It currently holds six ventures: ` +
    `${VENTURES.map((v) => `${v.name} (${v.tagline})`).join('; ')}. ` +
    `The common thesis is that the information needed to fix most broken systems already exists, scattered and unstructured, inside the people living with them — every venture starts by collecting it. ` +
    `She was also selected for Franklin County CDC's Spring 2026 Entrepreneurs Accelerator Program.`,
});

/* --- modelling ------------------------------------------------------------ */

chunks.push({
  id: 'modelling',
  title: 'Modelling',
  tags: ['model', 'modelling', 'modeling', 'editorial', 'runway', 'campaign', 'fashion', 'shoot', 'digitals'],
  text:
    `Alongside her technical work, Kinjal models — editorial, runway, and commercial. ` +
    `Her work includes a shoot at the Eric Carle Museum where fashion met illustration, which received press coverage. ` +
    `She keeps a portfolio with digitals and shoot galleries on this site under the Model section, and is available for editorial, runway and campaign work.`,
});

/* --- press ---------------------------------------------------------------- */

chunks.push({
  id: 'press',
  title: 'Press & writing',
  tags: ['press', 'article', 'news', 'media', 'coverage', 'featured', 'blog', 'medium', 'writing'],
  text:
    `Press and writing: her machine-learning smart calendar prototype was covered by NRV News as a student-built AI productivity tool. ` +
    `She was also featured in coverage of the Eric Carle Museum event where fashion met illustration. ` +
    `She writes at medium.com/@kinjalpandey18.`,
});

/* --- contact -------------------------------------------------------------- */

chunks.push({
  id: 'contact',
  title: 'Contact & availability',
  tags: ['contact', 'email', 'reach', 'hire', 'available', 'linkedin', 'github', 'connect', 'touch', 'resume', 'cv'],
  text:
    `Contact: ${CHANNELS.map((c) => `${c.label} — ${c.value}`).join('; ')}. ` +
    `${AVAILABILITY.status}. Based in ${AVAILABILITY.location}, timezone ${AVAILABILITY.timezone}. ` +
    `Resumes are available on the site in three versions: AI/ML, Software Engineering, and Data Science/Analytics.`,
});

export const CORPUS: Chunk[] = chunks;

/* ===========================================================
   Retrieval — pick the chunks worth sending as context
   =========================================================== */

const STOP = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'do', 'does', 'did', 'of', 'in', 'on',
  'at', 'to', 'for', 'with', 'and', 'or', 'but', 'she', 'her', 'his', 'he', 'they', 'it', 'you',
  'your', 'me', 'my', 'i', 'we', 'us', 'that', 'this', 'these', 'those', 'can', 'could', 'would',
  'should', 'will', 'about', 'tell', 'know', 'have', 'has', 'had', 'get', 'got', 'any', 'some',
  'more', 'please', 'what', 'which', 'how', 'why', 'when', 'where', 'who',
]);

/**
 * Terms a visitor is likely to use that don't literally appear in the profile.
 * Without this, "security" never reaches the cryptography work.
 */
const SYNONYMS: Record<string, string[]> = {
  security: ['secure', 'cryptography', 'privacy', 'encryption', 'defense'],
  secure: ['security', 'cryptography', 'privacy'],
  privacy: ['private', 'pii', 'confidential', 'sanitized', 'security'],
  crypto: ['cryptography', 'encryption', 'cipher'],
  ml: ['machine', 'learning', 'model'],
  ai: ['artificial', 'intelligence', 'machine', 'learning'],
  nlp: ['natural', 'language', 'processing'],
  llm: ['large', 'language', 'reasoning', 'model'],
  cot: ['chain', 'thought', 'reasoning'],
  pii: ['personally', 'identifiable', 'privacy', 'leakage'],
  vision: ['computer', 'image'],
  hire: ['hiring', 'recruit', 'employ', 'available', 'role'],
  job: ['role', 'work', 'experience', 'position'],
  intern: ['internship', 'codsoft', 'industry'],
  paper: ['publication', 'research', 'arxiv', 'chain', 'sanitized'],
  publication: ['paper', 'research', 'arxiv'],
  startup: ['venture', 'kinnovation', 'entrepreneur'],
  venture: ['startup', 'kinnovation'],
  grade: ['gpa', 'academic', 'coursework'],
  course: ['coursework', 'class', 'education'],
  uni: ['university', 'college', 'education'],
  umass: ['massachusetts', 'amherst', 'cics'],
  vt: ['virginia', 'tech', 'blacksburg'],
  photo: ['model', 'modelling', 'shoot', 'editorial'],
  data: ['dataset', 'analysis', 'analytics', 'science'],
};

/** Strips diacritics so "karnah" matches "Karnaḥ". */
function flatten(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function tokens(input: string): string[] {
  const words = flatten(input)
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));

  const out = new Set<string>();
  for (const w of words) {
    out.add(w);
    const stem = w.replace(/(ings|ing|ies|ed|es|s)$/, (m) => (w.length - m.length >= 3 ? '' : m));
    if (stem.length > 2) out.add(stem);
    for (const extra of SYNONYMS[w] ?? []) out.add(extra);
    if (stem !== w) for (const extra of SYNONYMS[stem] ?? []) out.add(extra);
  }
  return [...out];
}

/** Precomputed, diacritic-free haystacks. */
const INDEX = CORPUS.map((chunk) => ({
  chunk,
  title: flatten(chunk.title),
  body: flatten(chunk.text),
  tags: chunk.tags.map(flatten),
}));

/**
 * Scores every chunk against the question and returns the strongest few.
 * Tag and title hits count for more than body hits.
 */
export function selectContext(question: string, k = 6): Chunk[] {
  const q = tokens(question);
  if (!q.length) return CORPUS.slice(0, k);

  const scored = INDEX.map((entry) => {
    let score = 0;
    for (const t of q) {
      if (entry.tags.some((tag) => tag === t)) score += 5;
      else if (entry.tags.some((tag) => tag.includes(t))) score += 3;
      if (entry.title.includes(t)) score += 3;
      const hits = entry.body.split(t).length - 1;
      if (hits) score += Math.min(hits, 4);
    }
    return { chunk: entry.chunk, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  // Always carry the overview so the model has a frame of reference.
  const picked = scored.slice(0, k).map((s) => s.chunk);
  const overview = CORPUS.find((c) => c.id === 'identity')!;
  if (!picked.some((c) => c.id === 'identity')) picked.unshift(overview);

  return picked.slice(0, k);
}
