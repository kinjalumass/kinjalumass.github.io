/**
 * The Kinnovation venture portfolio.
 *
 * Content is drawn from Kinjal's startup dossier. Each venture owns a
 * three-stop palette (rgb triplets) that recolours the shared `.ent-*`
 * components on its page, and its own set of imagery.
 */

export interface Feature {
  title: string;
  body: string;
}

export interface Step {
  n: string;
  title: string;
  body: string;
}

export interface Audience {
  who: string;
  points: string[];
}

export interface Scenario {
  time: string;
  situation: string;
  response: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface Venture {
  id: string;
  index: string;
  name: string;
  tagline: string;
  sector: string;
  stage: string;
  /** rgb triplets */
  palette: { a: string; b: string; c: string };
  images: { hero: string; a: string; b: string };
  /** One sentence for the index card */
  card: string;
  /** Hero paragraph */
  lede: string;
  problem: { title: string; lead: string; points: string[] };
  thesis: string;
  features: Feature[];
  steps?: Step[];
  audiences?: Audience[];
  scenarios?: Scenario[];
  metrics: Metric[];
  closing: string;
}

export const VENTURES: Venture[] = [
  /* =========================================================
     01 — MeAsmi
     ========================================================= */
  {
    id: 'measmi',
    index: '01',
    name: 'MeAsmi',
    tagline: 'Match on symptoms, not on labels',
    sector: 'Health · Community',
    stage: 'MVP definition · early validation',
    palette: { a: '2, 132, 199', b: '79, 70, 229', c: '124, 58, 237' },
    images: {
      hero: 'img/ventures/measmi-hero.jpg',
      a: 'img/ventures/measmi-a.jpg',
      b: 'img/ventures/measmi-b.jpg',
    },
    card: 'A privacy-first network that finds what worked for people whose symptoms actually resemble yours.',
    lede:
      'The most valuable knowledge in neurodivergent care is exchanged between parents in therapy centre waiting rooms — and it dies there. MeAsmi captures those outcomes in structure, and makes them searchable by symptom profile rather than diagnosis label.',
    problem: {
      title: 'A diagnosis does not predict what will work',
      lead:
        'Autism, cerebral palsy, ADHD, Down syndrome and intellectual disability share overlapping symptoms, and response to therapy is intensely individual. Two people with identical diagnoses can need entirely different things — so a label is close to useless as a starting point.',
      points: [
        'The best insight is caregiver-to-caregiver, anecdotal but high-signal, and it never leaves the room it was spoken in.',
        'Families spend years cycling through therapies with almost no evidence about fit.',
        'Existing resources are diagnosis-centric, generic, or written by the provider selling the service.',
        'Clinics hold structured data internally, but nothing learns across centres — and day-to-day home outcomes are never captured at all.',
      ],
    },
    thesis:
      'A caregiver should be able to ask: for severe sensory defensiveness, minimal speech and disrupted sleep — what actually helped others? Today nothing can answer that.',
    features: [
      {
        title: 'Symptom and severity profiles',
        body: 'A standardised, plain-language way to record symptoms and how severe they are — no medical training required. This is the matching signal, not the diagnosis.',
      },
      {
        title: 'Outcome logging',
        body: 'Therapies tried — ABA, OT, speech, AAC, medication, diet, routines, sensory integration — with what improved, what worsened, and what plateaued.',
      },
      {
        title: 'Find similar people',
        body: 'Search by symptom cluster and severity, filtered by age band or region, and see what helped people meaningfully similar — even across different diagnoses.',
      },
      {
        title: 'Find effective treatments',
        body: 'Search the other direction: pick an intervention and see which symptom profiles reported real improvement, and where it tends to fall flat.',
      },
      {
        title: 'A care journal that exports',
        body: 'A timeline of what has been tried and how it went, exportable as a structured summary for the next appointment. User-controlled, always.',
      },
    ],
    metrics: [
      { value: 'Symptom', label: 'The unit of matching' },
      { value: 'Anonymous', label: 'Identity is not the product' },
      { value: 'Outcomes', label: 'Not popularity' },
    ],
    closing:
      'The therapy-centre parent network, rebuilt at global scale — structured, privacy-safe, and pointed at the question families are actually asking.',
  },

  /* =========================================================
     02 — Karnaḥ
     ========================================================= */
  {
    id: 'karnah',
    index: '02',
    name: 'Karnaḥ',
    tagline: 'Verified giving with dignity and traceability',
    sector: 'Civic · Logistics',
    stage: 'Ideation & design',
    palette: { a: '5, 150, 105', b: '13, 148, 136', c: '77, 124, 15' },
    images: {
      hero: 'img/ventures/karnah-hero.jpg',
      a: 'img/ventures/karnah-a.jpg',
      b: 'img/ventures/karnah-b.jpg',
    },
    card: 'Values the item, matches it to a charity that asked for it, and proves where it went.',
    lede:
      'Named for Karna of the Mahābhārata — the giver who never refused — Karnaḥ rebuilds in-kind donation around three things it currently lacks: verified valuation, need-based matching, and a traceable path from donor to impact.',
    problem: {
      title: 'Generosity, unverified',
      lead:
        'Clothing, bedding and furniture are dropped at a centre and vanish. Donors get a blank receipt and never learn whether the item was used, sold, discarded, or re-routed. The whole chain runs on good intention and almost no information.',
      points: [
        'Donors self-estimate value, which opens the door to fraud and leaves honest donors underclaiming.',
        'Charities receive winter coats in summer and XS sizes for adult shelters — storage and effort wasted.',
        'Nothing connects the item that left a house to the person who received it.',
        'Donors transport goods themselves with no idea whether they will be accepted; many give up mid-process.',
      ],
    },
    thesis:
      'Every donation should be verified, matched, traceable, compliant, and dignified. Five properties, none of which the current system guarantees.',
    features: [
      {
        title: 'AI valuation from a photo',
        body: 'A model trained on condition, brand, MSRP and resale value estimates fair market value from photos and a description — and generates an itemised, IRS-compliant receipt.',
      },
      {
        title: 'Need-first matching',
        body: 'Charities file lightweight need surveys — categories, sizes, seasonal demand, demographics. Donations are routed only to organisations with actual demand.',
      },
      {
        title: 'Impact feedback loop',
        body: 'Anonymised acknowledgements, stories, or photos showing where an item landed. A dashboard tracks cumulative giving and textile waste diverted.',
      },
      {
        title: 'Audit-ready trail',
        body: 'Receipts formatted for IRS guidelines including Form 8283. Every donation timestamped, labelled, and cross-verified for later filing or audit.',
      },
      {
        title: 'Ethical logistics',
        body: 'Pickup and delivery through gig networks, nonprofit couriers, or eco-logistics partners — removing the friction that kills completion rates.',
      },
    ],
    steps: [
      { n: '01', title: 'List', body: 'Photograph the item. Condition and fair market value are assessed automatically.' },
      { n: '02', title: 'Match', body: 'The item is offered only to charities whose need survey it satisfies.' },
      { n: '03', title: 'Collect', body: 'A local partner schedules pickup. Nothing is transported on spec.' },
      { n: '04', title: 'Deliver', body: 'Custody is recorded at handover, closing the gap between intent and arrival.' },
      { n: '05', title: 'Prove', body: 'An itemised Form 8283-ready receipt and an impact record are issued.' },
    ],
    audiences: [
      {
        who: 'For donors',
        points: [
          'Items go where they were requested',
          'Valuations that survive an audit',
          'Visibility into real impact',
          'No logistics burden',
        ],
      },
      {
        who: 'For charities',
        points: [
          'Receive only what was asked for',
          'Storage waste falls sharply',
          'Needs communicated in advance',
          'Coordinated intake',
        ],
      },
      {
        who: 'For everyone else',
        points: [
          'Less usable goods to landfill',
          'Materially reduced tax fraud',
          'Giving that actually clears',
          'Trust that compounds',
        ],
      },
    ],
    metrics: [
      { value: 'Verified', label: 'Every valuation' },
      { value: 'Matched', label: 'Against stated need' },
      { value: 'Traceable', label: 'Donor to outcome' },
    ],
    closing:
      'A future where tax receipts are not blank, items do not sit unused in warehouses, and giving feels meaningful, trusted, and visible.',
  },

  /* =========================================================
     03 — CalendAI
     ========================================================= */
  {
    id: 'calendai',
    index: '03',
    name: 'CalendAI',
    tagline: 'A planning engine disguised as a calendar',
    sector: 'Productivity · AI',
    stage: 'Ideation to architecture',
    palette: { a: '124, 58, 237', b: '79, 70, 229', c: '37, 99, 235' },
    images: {
      hero: 'img/ventures/calendai-hero.jpg',
      a: 'img/ventures/calendai-a.jpg',
      b: 'img/ventures/calendai-b.jpg',
    },
    card: 'Pulls Canvas and Google Calendar into one schedule, then repairs it every time real life breaks it.',
    lede:
      'A calendar stores events. CalendAI decides what to do next, when to do it, and what to give up when things collide — rebuilding the plan every time a task runs long, a deadline moves, or the day falls apart.',
    problem: {
      title: 'The real schedule only exists in your head',
      lead:
        'Canvas deadlines, Google Calendar events, club meetings, career fairs, food, sleep, the gym, calls home. They live in different places, so the actual plan is held together by memory — and it collapses under load.',
      points: [
        'Planners assume a static world. Office hours shift, assignments change, tasks overrun — and when the schedule breaks, people abandon it rather than repair it.',
        'Decision fatigue is the hidden tax: which assignment matters most, office hours or the career fair, when to eat, how to recover from falling behind.',
        'Almost everyone underestimates how long things take, and no tool learns from it — so plans stay unrealistic and trust erodes.',
        'Finding a time that works for a group is painful; shared calendars show overlaps but never optimise for the best option.',
      ],
    },
    thesis:
      'Time is not simply free or busy — it has quality. Plans should be resilient rather than perfect, and the system should get better as it watches what you actually finish.',
    features: [
      {
        title: 'Canvas becomes a calendar',
        body: 'Classes, sections, exams, office hours and deadlines import automatically — with grade weights, so priority reflects academic impact rather than whichever due date is closest.',
      },
      {
        title: 'Rescheduling from completion',
        body: 'Mark a task done or partly done and everything downstream adjusts. Overran? Blocks shift responsibly. Finished early? The time is reallocated to what matters next.',
      },
      {
        title: 'Tradeoff guidance',
        body: 'When office hours, a meeting and a career fair collide, CalendAI recommends what to attend based on grade impact, opportunity value, and your own stated priorities.',
      },
      {
        title: 'Energy-aware blocks',
        body: 'It learns that maths goes faster in the morning and that evening gym improves your sleep, then places work where you actually perform.',
      },
      {
        title: 'Scheduling for groups',
        body: 'Ingest several calendars with consent and propose genuine best-fit windows — weighing travel time, buffers and preference, not just finding a gap.',
      },
    ],
    steps: [
      { n: '01', title: 'Connect', body: 'Canvas and Google Calendar import into one integrated view of the real week.' },
      { n: '02', title: 'Prioritise', body: 'Tasks are ranked by deadline, workload estimate, and grade weight.' },
      { n: '03', title: 'Block', body: 'Work is placed around fixed events, commutes and sleep windows.' },
      { n: '04', title: 'Repair', body: 'Every completion or overrun triggers a re-optimisation of what remains.' },
      { n: '05', title: 'Learn', body: 'Duration estimates and time-of-day preferences sharpen with each cycle.' },
    ],
    metrics: [
      { value: 'Adaptive', label: 'Repairs, not resets' },
      { value: 'Explainable', label: 'Every recommendation' },
      { value: 'Opt-in', label: 'No training on your data' },
    ],
    closing:
      'An adaptive executive-function layer for students first, and eventually for anyone managing complex, shifting commitments.',
  },

  /* =========================================================
     04 — NutriNavigator
     ========================================================= */
  {
    id: 'nutri-navigator',
    index: '04',
    name: 'NutriNavigator',
    tagline: 'What to eat, when, and where — right now',
    sector: 'Health · Consumer',
    stage: 'Concept & architecture',
    palette: { a: '234, 88, 12', b: '202, 138, 4', c: '101, 163, 13' },
    images: {
      hero: 'img/ventures/nutri-hero.jpg',
      a: 'img/ventures/nutri-a.jpg',
      b: 'img/ventures/nutri-b.jpg',
    },
    card: 'Reads your body, your calendar, and your surroundings, then answers in real time.',
    lede:
      'Students hit the most nutritionally neglected stretch of their lives exactly when they have the least bandwidth to plan. NutriNavigator turns real-time physiology and a chaotic schedule into one decision: eat this, now, from there.',
    problem: {
      title: 'Advice written for a day you do not have',
      lead:
        'Between back-to-back classes, labs, shifts and study sessions, students skip meals, eat whatever is fastest, run on caffeine, or overspend on takeout out of pure exhaustion. Not for lack of knowledge — for lack of a plan that survives contact with the day.',
      points: [
        'Eating windows are unpredictable and often only minutes long.',
        'Nearby options are unknown, and menus are rarely legible in nutritional terms.',
        'Nothing connects what was eaten to how the afternoon actually felt.',
        'Static meal plans assume a schedule and a kitchen that students do not have.',
      ],
    },
    thesis:
      'The right recommendation is not the healthiest one. It is the healthiest one reachable in the eleven minutes you actually have.',
    features: [
      {
        title: 'Reads your body',
        body: 'HRV, stress, fatigue markers, sleep quality and quantity, activity — and glucose if there is a CGM. A moment-by-moment picture of internal state.',
      },
      {
        title: 'Reads your schedule',
        body: 'Classes, labs, work hours, study blocks, exams and commutes resolve into windows of opportunity — five minutes, ten, or an hour.',
      },
      {
        title: 'Reads your surroundings',
        body: 'Map and menu data surface what is nearby, how far it is on foot, what it costs, and what is actually in it.',
      },
      {
        title: 'One answer, not a list',
        body: 'What to eat, when to leave, and where to get it — resolved against your goals, whether that is focus, recovery, budget, or avoiding an allergen.',
      },
      {
        title: 'Learns your physiology',
        body: 'Rate meals on focus, mood, energy and satiety. The model learns that smoothies wake you up more than coffee, and stops recommending the thing that crashes you.',
      },
    ],
    scenarios: [
      {
        time: '08:40',
        situation: 'Poor sleep, elevated stress, fifteen minutes before a lecture.',
        response:
          'A protein-forward breakfast five minutes on foot, chosen to hold energy flat through a morning your body is not ready for.',
      },
      {
        time: '14:15',
        situation: 'Three hours of studying, stress metrics climbing, ten minutes and a walk across campus.',
        response:
          'A smoothie or protein bar from the café directly on the route — no detour, no queue, no crash at 15:30.',
      },
      {
        time: '19:30',
        situation: 'Training done, high strain, an early start tomorrow.',
        response:
          'Something substantial and slow-release, timed far enough from sleep to keep tomorrow morning intact.',
      },
    ],
    metrics: [
      { value: 'Real time', label: 'Not a weekly plan' },
      { value: '3 signals', label: 'Body, calendar, place' },
      { value: 'Personal', label: 'Tuned on your ratings' },
    ],
    closing:
      'Nutrition stops being a plan you fall off, and becomes a decision made correctly several times a day without thinking about it.',
  },

  /* =========================================================
     05 — Witness
     ========================================================= */
  {
    id: 'witness-platform',
    index: '05',
    name: 'Witness',
    tagline: 'A neutral evidence vault, not a reputational database',
    sector: 'Justice · Privacy',
    stage: 'Concept & legal framing',
    palette: { a: '71, 85, 105', b: '2, 132, 199', c: '109, 40, 217' },
    images: {
      hero: 'img/ventures/witness-hero.jpg',
      a: 'img/ventures/witness-a.jpg',
      b: 'img/ventures/witness-b.jpg',
    },
    card: 'Records what happened, never who — and holds it until someone with standing asks.',
    lede:
      'Dozens of people see the incident. None of them know each other, none can be reached later, and within hours the memory has degraded. Witness preserves situational evidence while it is still accurate, and lets victims find it with consent from everyone involved.',
    problem: {
      title: 'The evidence existed and cannot be recovered',
      lead:
        'Harassment, discrimination, accidents, threats, public conflict. Bystanders are present and often willing — but functionally lost. Surveillance is overwritten within 24 to 72 hours. The result is a justice gap made entirely of things that were seen and never recorded.',
      points: [
        'No safe way to record an observation without immediately going on record publicly.',
        'Victims know others saw it and know the truth is confirmable, but have zero mechanism to find them.',
        'Eyewitness accuracy drops sharply within hours, and small legally crucial details go first.',
        'Fear and shame stop victims recording their own account while it is still fresh.',
      ],
    },
    thesis:
      'Record the event, never the person. Every hard problem here comes from systems that conflate the two.',
    features: [
      {
        title: 'Event logging',
        body: 'Timestamp, approximate GPS location, incident type, a neutral factual description, bystander count, whether cameras were present. Optional media where legally allowed.',
      },
      {
        title: 'Search by circumstance',
        body: 'A victim or attorney searches by date, time, radius and incident type. Never by person — the system has no concept of one.',
      },
      {
        title: 'Consent-gated connection',
        body: 'If a log matches, the platform asks the witness. They choose whether to respond, how much to share, whether to stay anonymous, and whether to take part at all.',
      },
      {
        title: 'Structured recollection',
        body: 'Secure chat or call, tools that help shape an account into a legally usable form, encrypted exports for authorised legal contexts, and optional compensation for time.',
      },
      {
        title: 'Built for the legal reality',
        body: 'No names of accused individuals, no allegations attached to identifiable people, no profiles, no ratings, no background checks, no AI identification of anyone in media.',
      },
    ],
    steps: [
      { n: '01', title: 'Observe', body: 'A bystander sees something concerning.' },
      { n: '02', title: 'Record', body: 'They log the event alone — what, when, where. Not who.' },
      { n: '03', title: 'Seal', body: 'Nothing is published. No feed, no profile, no exposure.' },
      { n: '04', title: 'Search', body: 'Someone with standing searches the circumstances of their own incident.' },
      { n: '05', title: 'Consent', body: 'The witness decides. Silence remains a valid answer.' },
    ],
    metrics: [
      { value: 'Events', label: 'Recorded, not people' },
      { value: 'Consent', label: 'Required at every step' },
      { value: 'Sealed', label: 'Until someone asks' },
    ],
    closing:
      'Not surveillance — collective remembrance, structured, secure, and entirely voluntary.',
  },

  /* =========================================================
     06 — Trendify AI
     ========================================================= */
  {
    id: 'trendify',
    index: '06',
    name: 'Trendify AI',
    tagline: 'You already shot it. You just cannot find it.',
    sector: 'Creator tools · AI',
    stage: 'Conceptual architecture',
    palette: { a: '219, 39, 119', b: '234, 88, 12', c: '147, 51, 234' },
    images: {
      hero: 'img/ventures/trendify-hero.jpg',
      a: 'img/ventures/trendify-a.jpg',
      b: 'img/ventures/trendify-b.jpg',
    },
    card: 'Matches live trend data against the footage already sitting in your gallery.',
    lede:
      'Nobody has nothing to post. They have thousands of clips and no idea which one fits the format that is working this week. Trendify reads the trend map, reads your library, and puts the two together.',
    problem: {
      title: 'The problem is alignment, not content',
      lead:
        'People with thousands of photos and videos still believe they have nothing worth posting. The footage is fine. What is missing is the match between what they already own and the structure currently going viral.',
      points: [
        'Trends decay fast — using the audio early is most of the advantage, and by the time you notice it is over.',
        'Finding the right clip in a library of forty thousand files is the actual bottleneck.',
        'Trend research is unpaid data analysis performed by scrolling: tracking rising audio, view-to-like ratios, theme clusters, cut timing.',
        'So creators film something new instead, and the library keeps growing while the feed goes quiet.',
      ],
    },
    thesis:
      'Viral success is far more structural than aesthetic. Structure is a pattern, patterns are detectable, and most people are sitting on the raw material already.',
    features: [
      {
        title: 'Live trend intelligence',
        body: 'Tracks trending audio across platforms and measures adoption velocity, engagement ratios, structural formats — transformation, POV, montage, meme cut timing — and thematic clusters. A continuously updated trend map.',
      },
      {
        title: 'Gallery indexing',
        body: 'Tags your media by subject, motion type, pacing, lighting and scene shifts, then breaks it into reusable clip segments. The library becomes searchable by what is in it.',
      },
      {
        title: 'Trend-to-media matching',
        body: 'The core of it: trending audio structure, pacing requirements and clip types matched against footage you actually have. "These gym clips fit the high-retention transformation audio."',
      },
      {
        title: 'Recombination, not one-shot use',
        body: 'The same footage across several trends by changing audio, pacing, structure or caption framing — so one shoot yields many posts rather than one.',
      },
      {
        title: 'Assistive, never automatic',
        body: 'Nothing posts without review. Reorder clips, trim, swap audio, filter profanity, set tone from humorous to minimalist. Suggestions, not instructions.',
      },
    ],
    steps: [
      { n: '01', title: 'Index', body: 'Your gallery is tagged and segmented into reusable clips.' },
      { n: '02', title: 'Monitor', body: 'Trend velocity is tracked continuously, so dead trends are filtered out.' },
      { n: '03', title: 'Match', body: 'Formats are scored against clips you already own.' },
      { n: '04', title: 'Assemble', body: 'A bundle arrives — clip order, audio, caption concept, hashtag cluster.' },
      { n: '05', title: 'Learn', body: 'Linked post analytics refine what gets suggested next.' },
    ],
    metrics: [
      { value: 'Local mode', label: 'Processing stays on device' },
      { value: 'No auto-post', label: 'Review is mandatory' },
      { value: 'No shaming', label: 'Zero viral-pressure metrics' },
    ],
    closing:
      'Viral-format participation without needing to be chronically online — and without a single new frame of footage.',
  },
];

export const STUDIO = {
  name: 'Kinnovation',
  promise: 'Innovation without boundaries',
  headline: 'Six ventures, one conviction: the hardest problems are the ones worth building for.',
  lede:
    'Kinnovation is a venture studio built on a simple observation — the information needed to fix most broken systems already exists, scattered and unstructured, inside the people living with them. Every venture here starts by collecting it.',
  body: [
    'The portfolio spans healthcare, civic infrastructure, productivity, nutrition, creator tooling, and access to justice. That looks unfocused until you look at the shape of the problems: in each case a decision is being made blind, and the evidence that would make it clear is sitting in a thousand disconnected places.',
    'The work is research first, product second. Understand the system, find the missing signal, then build the smallest thing that captures it.',
  ],
  images: {
    hero: 'img/ventures/studio-hero.jpg',
    portrait: 'img/ventures/studio-portrait.jpg',
    wide: 'img/ventures/studio-wide.jpg',
  },
};

/** The venture after `id`, wrapping around at the end. */
export function nextVenture(id: string): Venture {
  const i = VENTURES.findIndex((v) => v.id === id);
  return VENTURES[(i + 1) % VENTURES.length];
}
