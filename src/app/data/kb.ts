/**
 * Canonical knowledge base for the assistant.
 *
 * Source: "Kinjal Pandey, Personal Portfolio Chatbot Knowledge Base,
 * Answering Policy, and Training Guide", version 1.0, 20 August 2026.
 *
 * The rest of `corpus.ts` is assembled from the same data that renders the
 * pages, so it can never contradict the site. This file carries what the
 * pages do not say: the approved biographies, the canonical FAQ wording, the
 * stage each venture is actually at, and the boundaries the assistant has to
 * respect. Where the two disagree, the site data wins on anything the site
 * displays, and this file wins on wording, framing, and what may be claimed.
 *
 * Chunk groups follow the document's own recommended retrieval split.
 */

import type { Chunk } from './corpus.types';

export const KB_CHUNKS: Chunk[] = [
  /* --- identity and biography -------------------------------------------- */
  {
    id: 'kb-identity',
    title: 'Who Kinjal is',
    tags: ['who', 'about', 'bio', 'biography', 'introduction', 'summary', 'kinjal', 'pandey'],
    text:
      'Kinjal Pandey is an MS Computer Science student at UMass Amherst and a Virginia Tech Computer Science graduate with a Mathematics minor. ' +
      'Her work spans artificial intelligence, data science, privacy and security, responsible computing, software development, research, ' +
      'entrepreneurship, and technology community leadership. Outside technology she is also passionate about modeling, and enjoys creative ' +
      'projects, volunteering, dancing, spending time with her cat, and meeting people through technology communities. ' +
      'Expected MS graduation is Spring 2027.',
  },
  {
    id: 'kb-bio-long',
    title: 'Full biography',
    tags: ['bio', 'biography', 'background', 'career', 'story', 'overview', 'long'],
    text:
      'Kinjal Pandey is a computer scientist, researcher, builder, entrepreneur, technology community leader, and model. She is pursuing an ' +
      'M.S. in Computer Science at the University of Massachusetts Amherst after graduating early from Virginia Tech with a B.S. in Computer ' +
      'Science and a minor in Mathematics. Her experience includes serving as a course grader for the graduate-level Trustworthy and ' +
      'Responsible AI course at UMass, contributing to open source through the UMass CICS Open-Source Apprenticeship Program, and working as ' +
      'a data scientist in Data Science for the Common Good on a Boston Cyclists Union project focused on safer, more accessible and more ' +
      'equitable bicycle infrastructure. She has also worked in technology consulting, digital solutions consulting, backend software ' +
      'development, AI, and cryptography research. Before graduate school she was a Google Developer Student Club team leader, a Microsoft ' +
      'Learn Student Ambassador, an IBM Student Ambassador, a peer mentor and a student leader at Virginia Tech. ' +
      'A consistent theme is combining technical problem-solving with practical human needs: improving how people plan, decide, give, move ' +
      'through cities, protect information, or create.',
  },
  {
    id: 'kb-characterization',
    title: 'How to describe her',
    tags: ['describe', 'characterize', 'call her', 'title', 'label', 'personality'],
    text:
      'Supported descriptors: computer scientist, graduate student, AI and machine learning practitioner, researcher, data scientist, ' +
      'software developer, technology consultant, entrepreneur, community and student leader, mentor, model. ' +
      'Her record supports these observations: she repeatedly chooses roles involving leadership, mentorship or community-building; she is ' +
      'comfortable working across technical and non-technical stakeholders; she has experience translating technical ideas for broader ' +
      'audiences; her projects often combine technology with real-world human problems; she maintains both analytical and creative pursuits. ' +
      'Avoid unsupported personality claims such as calling her extroverted, introverted, fearless, a perfectionist or naturally charismatic, ' +
      'and avoid words like genius, prodigy, visionary or icon.',
  },

  /* --- research ------------------------------------------------------------ */
  {
    id: 'kb-research',
    title: 'Research and publication',
    tags: ['research', 'publication', 'paper', 'arxiv', 'pii', 'leakage', 'chain of thought', 'privacy'],
    text:
      'Her research interests are trustworthy AI, privacy, security, and responsible model behavior. Her publication, ' +
      '"Chain-of-Sanitized-Thoughts: Plugging PII Leakage in CoT of Large Reasoning Models", investigates how sensitive personal information ' +
      'can leak through the reasoning traces of large reasoning models, and explores ways to make those systems safer from a privacy ' +
      'perspective. In plain terms: models often produce intermediate reasoning before answering, that reasoning can carry personal ' +
      'information, and the work looks at sanitizing it without degrading the quality of the reasoning itself. ' +
      'Do not claim deployment in production systems, industry adoption, benchmark rankings, or awards for this paper.',
  },

  /* --- ventures: stage guardrails ------------------------------------------ */
  {
    id: 'kb-venture-stages',
    title: 'What stage each venture is at',
    tags: ['venture', 'startup', 'launched', 'stage', 'progress', 'traction', 'users', 'available', 'app'],
    text:
      'All of the ventures are in development. None is a launched commercial product. Karnah is at early ideation and design, with the ' +
      'problem and core modules defined. CalendAI is at ideation to architecture, with the product direction defined. Trendify AI is at ' +
      'conceptual architecture. NutriNavigator is the furthest along, between ideation and early prototyping: sketches, wireframes, paper ' +
      'prototypes, mid-fidelity artifacts, a demo interface, and a survey of more than 70 potential users. ' +
      'That survey figure means 70+ potential users who responded, not 70+ active users or customers. Never describe any venture as ' +
      'launched, revenue-generating, incorporated or funded, and never give user counts, and never name investors or team members.',
  },
  {
    id: 'kb-investors',
    title: 'Investors and cofounders',
    tags: ['investor', 'investment', 'funding', 'raise', 'fundraising', 'cofounder', 'co-founder', 'team'],
    text:
      'Kinjal is open to investor conversations related to the ventures she is developing. She should not be described as actively ' +
      'fundraising, as having raised money, or as having a valuation. She is not currently looking for cofounders. ' +
      'Do not volunteer founder or team structure.',
  },
  {
    id: 'kb-karnah-name',
    title: 'Why Karnah is called that',
    tags: ['karnah', 'karna', 'name', 'mahabharata', 'meaning', 'donation', 'giving', 'charity'],
    text:
      'Karnah is an in-development concept for a verified and intelligent in-kind donation system, using AI-assisted valuation, need-based ' +
      'matching, and traceable workflows to make donations more transparent and useful. The name is inspired by Karna from the Mahabharata, ' +
      'a figure associated with exceptional generosity, and the concept uses that reference to frame giving around dignity, truth and ' +
      'responsibility. It is at early ideation and design.',
  },

  /* --- modeling ------------------------------------------------------------ */
  {
    id: 'kb-modeling',
    title: 'Modeling work',
    tags: ['model', 'modeling', 'fashion', 'shoot', 'creative', 'agency', 'runway', 'editorial'],
    text:
      'Kinjal started modeling while she was a student at Virginia Tech. She was drawn to the creative process and liked having a visual, ' +
      'collaborative form of expression alongside her technical work. She is open to a broad range of modeling opportunities rather than ' +
      'defining herself around one narrow category. Her portfolio includes work connected with the New England Peace Pagoda and the Eric ' +
      'Carle Museum of Picture Book Art, along with a snow shoot, digitals, and further portfolio imagery. ' +
      'There is no public information confirming agency representation, so do not claim or guess at one, and do not name photographers, ' +
      'campaign clients or brands.',
  },

  /* --- personal ------------------------------------------------------------ */
  {
    id: 'kb-personal',
    title: 'Interests outside computer science',
    tags: ['hobbies', 'interests', 'personal', 'fun', 'outside', 'cat', 'dance', 'volunteer', 'vasuki'],
    text:
      'Outside computer science she is passionate about modeling and entrepreneurship, and enjoys dancing, volunteering, spending time with ' +
      'her cat, and meeting people through technology clubs and communities. Her cat is named Vasuki. Volunteering and community work also ' +
      'show up across her mentoring and leadership record.',
  },

  /* --- availability and contact -------------------------------------------- */
  {
    id: 'kb-availability',
    title: 'Availability and how to reach her',
    tags: ['contact', 'email', 'hire', 'available', 'opportunity', 'job', 'role', 'reach', 'linkedin'],
    text:
      'Kinjal is open to relevant technology and AI opportunities anywhere in the United States, especially work that connects technical ' +
      'problem-solving with real-world applications. She is also open to a range of modeling and creative collaborations, and to investor ' +
      'conversations about her ventures. Do not state a single fixed target job title; her direction is not finalized. ' +
      'Contact is by email at kinjalpandey18@gmail.com or on LinkedIn at linkedin.com/in/kinjalpandey. Her site is kinjalpandey.com and she ' +
      'writes at medium.com/@kinjalpandey18.',
  },

  /* --- boundaries ---------------------------------------------------------- */
  {
    id: 'kb-boundaries',
    title: 'What the assistant will not discuss',
    tags: ['private', 'personal', 'address', 'phone', 'age', 'salary', 'visa', 'health', 'relationship'],
    text:
      'This assistant is public-facing and does not disclose or infer private information. That includes home address, personal phone number, ' +
      'immigration or visa status, financial or salary details, medical or mental-health information, relationship or family details, date of ' +
      'birth or precise age, private schedules, private messages, accommodations, and body measurements beyond height where relevant to ' +
      'modeling. If asked, say plainly that it is not something the portfolio covers, and offer what is public instead.',
  },
  {
    id: 'kb-uncertainty',
    title: 'Handling unknowns',
    tags: ['unknown', 'not sure', 'confirm', 'verify', 'guess'],
    text:
      'When something is not documented, say so rather than guessing: "I do not have public information confirming that", or "that detail is ' +
      'not in Kinjal\'s portfolio". Never invent dates, employers, clients, funding, revenue, incorporation status, user counts, investors, ' +
      'cofounders, agencies, photographers, campaign clients, awards, research results, repository metrics, grades, or publications. ' +
      'Never turn an inference into biography: describe what her record shows rather than what it might imply about her personality. ' +
      'Never upgrade a plan into an accomplishment.',
  },
];
