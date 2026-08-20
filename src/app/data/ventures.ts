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
  /**
   * One illustration per venture, shown exactly once on its page.
   *
   * There is a single source image for each of these, so cropping it into
   * a hero plus two accents put the same picture on screen three times in
   * one viewport. One image used once reads as deliberate; the same image
   * three times reads as padding.
   */
  art: string;
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
     01, MeAsmi
     ========================================================= */
  {
    id: 'measmi',
    index: '01',
    name: 'MeAsmi',
    tagline: 'Match on symptoms, not on labels',
    sector: 'Health · Community',
    stage: 'MVP definition · early validation',
    palette: { a: '56, 189, 248', b: '129, 140, 248', c: '167, 139, 250' },
    art: 'img/ventures/measmi.jpg',
    card: "A private place to find out what actually worked for children whose symptoms look like yours.",
    lede:
      "The best advice in neurodivergent care gets traded between parents in therapy waiting rooms, and then it dies there. One mother tells another what finally got her son sleeping through the night, and that stays in the room. MeAsmi catches it, gives it structure, and makes it searchable by what a child is actually experiencing rather than the label on the file.",
    problem: {
      title: 'A diagnosis tells you very little about what will help',
      lead:
        'Autism, cerebral palsy, ADHD, Down syndrome and intellectual disability overlap heavily in how they present, and response to therapy is intensely individual. Two children with the same words on the same form can need completely opposite things, so starting from the label costs families years.',
      points: [
        'The highest quality information is parent to parent. It is anecdotal, it is specific, and it is trapped in the room where it was spoken.',
        'Families cycle through therapy after therapy with almost nothing to tell them whether this one is likely to fit their child.',
        'The resources that do exist are organized by diagnosis, written in general terms, or published by whoever is selling the service.',
        'Clinics keep structured records, but nothing learns across clinics, and what happens at home between sessions is never captured at all.',
      ],
    },
    thesis:
      'A parent should be able to ask one question. Severe sensory defensiveness, almost no speech, broken sleep: what helped children like mine? Nothing today can answer that.',
    features: [
      {
        title: 'Symptoms and severity, in plain language',
        body: "Record what your child is actually experiencing and how intense it is. No medical training needed. This is what the matching runs on, and the diagnosis is not.",
      },
      {
        title: 'What you tried and what it did',
        body: 'Log every therapy attempted, from ABA and OT to speech, AAC, medication, diet changes, routines and sensory integration, with what improved, what got worse, and what simply stopped moving.',
      },
      {
        title: 'Find children like yours',
        body: 'Search by symptom cluster and severity, narrow by age or region, and see what worked for children who genuinely resemble yours, including ones carrying a different diagnosis.',
      },
      {
        title: 'Or search the other way round',
        body: 'Pick an intervention and see which symptom profiles reported real gains from it, and which ones it tends to do nothing for. Both directions matter.',
      },
      {
        title: 'A care journal you can hand over',
        body: 'Everything tried, in order, with how it went, exportable as a clean summary for the next appointment. It stays yours, and it leaves when you say so.',
      },
    ],
    metrics: [
      { value: 'Symptoms', label: 'What the matching runs on' },
      { value: 'Anonymous', label: 'Identity is never the product' },
      { value: 'Outcomes', label: 'Not popularity' },
    ],
    closing:
      'The waiting room conversation, rebuilt so it reaches every family instead of the four people who happened to be sitting there that afternoon.',
  },

  /* =========================================================
     02, Karnah
     ========================================================= */
  {
    id: 'karnah',
    index: '02',
    name: 'Karnah',
    tagline: 'Verified giving with dignity and traceability',
    sector: 'Civic · Logistics',
    stage: 'Ideation & design',
    palette: { a: '52, 211, 153', b: '45, 212, 191', c: '163, 230, 53' },
    art: 'img/ventures/karnah.jpg',
    card: 'Values the item, sends it to a charity that asked for it, and shows you where it ended up.',
    lede:
      'Karna gave away everything he owned and never asked what he would get back for it. I named this after him because in-kind giving still runs on that instinct and almost none of the infrastructure. Karnah supplies the three things it is missing: a valuation that holds up, a match against what a charity actually requested, and a record of where the item went.',
    problem: {
      title: 'You gave it away and nobody can tell you what happened next',
      lead:
        'Clothes, bedding and furniture get dropped at a center and vanish. The receipt comes back blank or vague, and you never find out whether the item was used, sold, thrown out or shipped somewhere else entirely. The whole chain runs on good intentions and almost no information.',
      points: [
        'Donors put a number on their own goods, which lets fraud through one side and leaves honest people underclaiming on the other.',
        'Shelters receive winter coats in July and extra small sizes for adult men, then burn storage space and volunteer hours dealing with it.',
        'Nothing links the item that left your house to the person who eventually needed it.',
        'You drive it over yourself without knowing whether it will even be accepted, and plenty of people give up halfway through.',
      ],
    },
    thesis:
      'Verified, matched, traceable, compliant, dignified. Five things a donation should be, and the system we have guarantees none of them.',
    features: [
      {
        title: 'Valuation from a photograph',
        body: 'Photograph the item, describe it briefly, and a model trained on condition, brand, retail price and resale data returns a fair market value with an itemized receipt the IRS will accept.',
      },
      {
        title: 'Matched against real need',
        body: 'Charities fill in a short needs survey covering categories, sizes, seasonal demand and who they serve. Donations only get routed to organizations that asked for them.',
      },
      {
        title: 'Proof it landed',
        body: 'Anonymized acknowledgements, short stories or photographs showing where the item went, and a running count of what you have given and how much textile waste that kept out of landfill.',
      },
      {
        title: 'An audit trail that holds',
        body: 'Receipts formatted to IRS guidance including Form 8283. Every donation timestamped, itemized and cross checked, ready for filing season or for an audit three years later.',
      },
      {
        title: 'Logistics that do not fall on you',
        body: 'Pickup and delivery through gig couriers, nonprofit driver programs and eco-logistics partners, because friction is what kills most donations before they ever complete.',
      },
    ],
    steps: [
      { n: '01', title: 'List', body: 'Photograph the item. Condition and fair market value are assessed for you.' },
      { n: '02', title: 'Match', body: 'It is offered only to charities whose stated need it satisfies.' },
      { n: '03', title: 'Collect', body: 'A local partner books the pickup. Nothing gets transported on spec.' },
      { n: '04', title: 'Deliver', body: 'Custody is logged at handover, which is where the current chain goes dark.' },
      { n: '05', title: 'Prove', body: 'An itemized receipt ready for Form 8283, and a record of the impact.' },
    ],
    audiences: [
      {
        who: 'For donors',
        points: [
          'It goes where somebody asked for it',
          'A valuation that survives an audit',
          'You find out what it did',
          'Somebody else handles the driving',
        ],
      },
      {
        who: 'For charities',
        points: [
          'Only what you actually requested',
          'Storage stops filling with the wrong sizes',
          'Needs communicated before the van arrives',
          'Intake you can plan around',
        ],
      },
      {
        who: 'For everyone else',
        points: [
          'Usable goods stay out of landfill',
          'Far less room for inflated deductions',
          'Donations that finish instead of stalling',
          'Trust that builds on itself',
        ],
      },
    ],
    metrics: [
      { value: 'Verified', label: 'Every valuation' },
      { value: 'Matched', label: 'Against a stated need' },
      { value: 'Traceable', label: 'Donor through to outcome' },
    ],
    closing:
      'Receipts that are not blank, warehouses that are not full of things nobody asked for, and giving that feels like it landed somewhere.',
  },

  /* =========================================================
     03, CalendAI
     ========================================================= */
  {
    id: 'calendai',
    index: '03',
    name: 'CalendAI',
    tagline: 'A planning engine disguised as a calendar',
    sector: 'Productivity · AI',
    stage: 'Ideation to architecture',
    palette: { a: '167, 139, 250', b: '129, 140, 248', c: '96, 165, 250' },
    art: 'img/ventures/calendai.jpg',
    card: 'Pulls Canvas and Google Calendar into one plan, then rebuilds it every time the day goes sideways.',
    lede:
      'A calendar remembers things. It does not help you decide. CalendAI works out what to do next, when to do it, and what to give up when three things land on the same hour, then repairs the whole plan the moment a task runs long or a deadline moves.',
    problem: {
      title: 'The real schedule only exists in your head',
      lead:
        'Canvas deadlines sit in one place, Google Calendar in another, club meetings and career fairs nowhere at all, and food, sleep, the gym and calling home are held together by memory. It works until about week seven, and then it does not.',
      points: [
        'Planners assume nothing changes. Office hours move, assignments get rewritten, meetings overrun, and when the plan breaks most people abandon it rather than repair it.',
        'The real cost is deciding. Which assignment first, office hours or the career fair, when to eat, how to climb back after a bad week. That is where the hours actually go.',
        'Almost everyone underestimates how long work takes and no tool learns from it, so the next plan is just as unrealistic and you trust it a little less.',
        'Getting five people in a room is painful. Shared calendars show you the gaps. They never tell you which gap is the good one.',
      ],
    },
    thesis:
      'Time is not simply free or busy. It has quality. A plan should bend instead of shattering, and the system should get sharper every time it watches you finish something.',
    features: [
      {
        title: 'Canvas turns into a calendar',
        body: 'Classes, sections, exams, office hours and deadlines import on their own, and grade weights come with them, so a quiz worth two percent stops outranking a project worth thirty.',
      },
      {
        title: 'Rescheduling from what you finished',
        body: 'Mark something done or half done and everything after it moves. Ran forty minutes over and the evening reshuffles. Finished early and the time goes to whatever was next in line.',
      },
      {
        title: 'Help with the tradeoff',
        body: 'When office hours, a team meeting and a career fair collide, it tells you which one to take and why, weighing grade impact, what the opportunity is worth, and the priorities you set yourself.',
      },
      {
        title: 'Work placed where you are good',
        body: 'It notices that maths goes faster before noon and that an evening gym session improves your sleep, then puts the hard blocks where you actually perform.',
      },
      {
        title: 'Scheduling for a group',
        body: 'Bring in several calendars with everyone consenting, and get real best fit options weighted for travel time, buffers and when people prefer to meet, instead of the first empty box.',
      },
    ],
    steps: [
      { n: '01', title: 'Connect', body: 'Canvas and Google Calendar become one view of the actual week.' },
      { n: '02', title: 'Prioritize', body: 'Tasks ranked by deadline, effort estimate and what they are worth to your grade.' },
      { n: '03', title: 'Block', body: 'Work placed around fixed events, commutes and the hours you need to sleep.' },
      { n: '04', title: 'Repair', body: 'Every completion or overrun re-optimizes whatever is left.' },
      { n: '05', title: 'Learn', body: 'Duration estimates and your best hours sharpen with every cycle.' },
    ],
    metrics: [
      { value: 'It repairs', label: 'Instead of starting over' },
      { value: 'It explains', label: 'Every call it makes' },
      { value: 'Opt in', label: 'Your data trains nothing' },
    ],
    closing:
      'Executive function as a piece of software. Students first, because their weeks are the hardest to hold together, then anyone whose days refuse to sit still.',
  },

  /* =========================================================
     04, NutriNavigator
     ========================================================= */
  {
    id: 'nutri-navigator',
    index: '04',
    name: 'NutriNavigator',
    tagline: 'What to eat, when, and where, right now',
    sector: 'Health · Consumer',
    stage: 'Concept & architecture',
    palette: { a: '251, 146, 60', b: '250, 204, 21', c: '163, 230, 53' },
    art: 'img/ventures/nutri.jpg',
    card: 'Reads your body, your calendar and what is around you, then gives you one thing to eat.',
    lede:
      'Students go through the worst eating of their lives at exactly the point they have the least room to think about it. NutriNavigator takes what your body is doing right now, what your day looks like, and what is within walking distance, and turns all of it into one decision: this, now, from there.',
    problem: {
      title: 'Advice written for a day you do not have',
      lead:
        'Between back to back classes, labs, shifts and study sessions that always run long, people skip meals, eat whatever is fastest, live on coffee, or spend money they do not have on delivery at eleven at night. Not because they do not know better. Because no plan survives the actual day.',
      points: [
        'The gap where eating is even possible is unpredictable and often only a few minutes wide.',
        'Wearables already track stress, fatigue, sleep and glucose, and none of it ever turns into what to have for lunch.',
        'You rarely know what is nearby, how long the line is, or what is genuinely in it.',
        'Nothing connects what you ate at one o clock to why you fell apart at four.',
      ],
    },
    thesis:
      'The right recommendation is not the healthiest thing available. It is the healthiest thing you can reach in the eleven minutes you actually have.',
    features: [
      {
        title: 'It reads your body',
        body: 'Heart rate variability, stress, fatigue markers, sleep quality and quantity, activity, and blood glucose if you wear a CGM. A live picture of what is going on inside rather than a guess from a form you filled in once.',
      },
      {
        title: 'It reads your day',
        body: 'Classes, labs, shifts, study blocks, exams and the walk between them resolve into real windows. Five minutes, ten minutes, an hour. It knows the difference.',
      },
      {
        title: 'It reads the map',
        body: 'Campus and neighbourhood menus, walking times, prices and what is actually in the food, so the answer is somewhere you can genuinely get to and back from.',
      },
      {
        title: 'One answer, not a menu',
        body: 'What to eat, when to leave, and where to get it, weighed against whatever you are optimizing for that day, whether that is staying sharp through an exam, recovering from training, or making the week last.',
      },
      {
        title: 'It learns your physiology',
        body: 'Rate what you ate on focus, mood, energy and how long it held you. Give it a few weeks and it works out that smoothies wake you up more reliably than coffee, and that a heavy breakfast puts you on the floor by eleven.',
      },
    ],
    scenarios: [
      {
        time: '08:40',
        situation: 'Four hours of sleep, stress already elevated, fifteen minutes before a lecture.',
        response:
          'Protein forward, five minutes on foot, chosen to hold your energy flat through a morning your body is not ready for.',
      },
      {
        time: '14:15',
        situation: 'Three hours deep in the library, stress climbing, ten minutes and a walk across campus.',
        response:
          'The smoothie from the café already on your route. No detour, no queue, and no crash at half three.',
      },
      {
        time: '19:30',
        situation: 'Training done, strain high, a seven o clock start tomorrow.',
        response:
          'Something substantial that releases slowly, timed far enough from bed that tomorrow morning survives.',
      },
    ],
    metrics: [
      { value: 'Right now', label: 'Not a plan for the week' },
      { value: 'Three inputs', label: 'Body, calendar, map' },
      { value: 'Yours', label: 'Tuned on how you felt after' },
    ],
    closing:
      'Eating well stops being a plan you fall off in week two, and becomes a decision that gets made correctly three times a day without costing you anything to make.',
  },

  /* =========================================================
     05, Witness
     ========================================================= */
  {
    id: 'witness-platform',
    index: '05',
    name: 'Witness',
    tagline: 'A neutral evidence vault, not a reputational database',
    sector: 'Justice · Privacy',
    stage: 'Concept & legal framing',
    palette: { a: '148, 163, 184', b: '56, 189, 248', c: '167, 139, 250' },
    art: 'img/ventures/witness.jpg',
    card: 'Records what happened, never who, and keeps it sealed until someone with standing asks.',
    lede:
      'Thirty people see it happen. None of them know each other, none of them can be reached afterwards, and within a few hours the details have already blurred. Witness holds what people saw while it is still accurate, and lets the person it happened to find it, with consent required from everyone involved.',
    problem: {
      title: 'The evidence existed and there is no way to get it back',
      lead:
        'Harassment, discrimination, an accident, a threat, a confrontation that turns. People are there, and plenty of them would help. They are simply unreachable. Camera footage is overwritten inside a day or three. What is left is a justice gap built entirely out of things that were seen and never written down.',
      points: [
        'There is no safe way to write down what you saw without immediately becoming publicly involved in it.',
        'Victims know other people watched it happen, and know the account is confirmable, and have no way at all to find them.',
        'Eyewitness accuracy drops off within hours, and the small details that matter legally are the first ones to go.',
        'Fear and embarrassment stop people recording their own account while it is fresh, which is the only window where it is worth much.',
      ],
    },
    thesis:
      'Record the event, never the person. Every hard problem in this space comes from systems that blur those two things together.',
    features: [
      {
        title: 'Logging an event',
        body: 'Timestamp, rough GPS location, what kind of incident it was, a neutral description of what happened, how many people were around, whether there were cameras. Media too, where the law allows it.',
      },
      {
        title: 'Searching by circumstance',
        body: 'A victim or their attorney searches a date, a time, a radius and an incident type. Never a person. The system has no concept of who anyone is.',
      },
      {
        title: 'Consent at the gate',
        body: 'If a log matches, the platform asks the witness. They decide whether to reply, how much to say, whether to stay anonymous, and whether to take part at all. No is a complete answer.',
      },
      {
        title: 'Help shaping the account',
        body: 'Secure chat or a call, tools that turn a recollection into something legally usable, encrypted export for authorised legal use, and payment for the witness time if they want it.',
      },
      {
        title: 'Built inside the legal limits',
        body: 'No names of accused people, no allegations attached to anyone identifiable, no profiles, no ratings, no background checks, and no AI put anywhere near identifying a face.',
      },
    ],
    steps: [
      { n: '01', title: 'Observe', body: 'Somebody sees something they know is wrong.' },
      { n: '02', title: 'Record', body: 'They log the event on their own. What, when, where. Not who.' },
      { n: '03', title: 'Seal', body: 'Nothing is published. No feed, no profile, no exposure of any kind.' },
      { n: '04', title: 'Search', body: 'Someone with standing searches the circumstances of their own incident.' },
      { n: '05', title: 'Consent', body: 'The witness decides. Staying silent remains a real answer.' },
    ],
    metrics: [
      { value: 'Events', label: 'Never people' },
      { value: 'Consent', label: 'At every single step' },
      { value: 'Sealed', label: 'Until somebody asks' },
    ],
    closing:
      'This is not surveillance. It is collective memory, kept carefully, and handed over only when the person holding it decides to.',
  },

  /* =========================================================
     06, Trendify AI
     ========================================================= */
  {
    id: 'trendify',
    index: '06',
    name: 'Trendify AI',
    tagline: 'You already shot it. You just cannot find it.',
    sector: 'Creator tools · AI',
    stage: 'Conceptual architecture',
    palette: { a: '244, 114, 182', b: '251, 146, 60', c: '192, 132, 252' },
    art: 'img/ventures/trendify.jpg',
    card: 'Reads what is trending right now and finds the clip in your camera roll that fits it.',
    lede:
      'Nobody actually has nothing to post. They have eleven thousand photos and no idea which one fits the format that is working this week. Trendify watches the trends, indexes what you already own, and puts the two together.',
    problem: {
      title: 'You are not short of footage',
      lead:
        'People sitting on thousands of photos and videos still open the app and decide they have nothing worth posting. The footage is fine. What is missing is knowing which clip fits the structure that is currently going viral.',
      points: [
        'Trends move fast, and using the audio early is most of the advantage. By the time something is obviously a trend, it is finished.',
        'The real bottleneck is finding the right eight seconds inside a library of forty thousand files.',
        'Trend research is unpaid analytics work done by scrolling. Which audio is climbing, what the view to like ratio looks like, which themes cluster, where the cuts land.',
        'So people film something new instead. The library keeps growing and the account stays quiet.',
      ],
    },
    thesis:
      'Going viral is far more structural than it is aesthetic. Structure is a pattern, patterns can be detected, and most people are already sitting on the raw material.',
    features: [
      {
        title: 'Live trend tracking',
        body: 'Watches audio across TikTok and Reels, measures how fast adoption is climbing, tracks engagement ratios, and identifies the structures underneath. Transformation, POV, montage, storytelling, where the cut lands on the beat.',
      },
      {
        title: 'Indexing what you own',
        body: 'Tags your media by subject, motion, pacing, lighting and scene changes, then cuts it into reusable segments. The gallery becomes searchable by what is in it rather than the date it was taken.',
      },
      {
        title: 'Matching trend to footage',
        body: 'This is the part that matters. Audio structure, pacing requirements and the clip types that keep working, scored against what you actually have. Those gym clips from March fit the transformation audio climbing this week.',
      },
      {
        title: 'One shoot, several posts',
        body: 'The same footage across different trends by changing the audio, the pacing, the structure or how the caption frames it, so a good afternoon of filming keeps paying out.',
      },
      {
        title: 'It suggests, you decide',
        body: 'Nothing posts by itself. Reorder the clips, trim them, swap the audio, filter language, set the tone anywhere from funny to stripped back. Every suggestion is a starting point.',
      },
    ],
    steps: [
      { n: '01', title: 'Index', body: 'Your gallery gets tagged and cut into reusable segments.' },
      { n: '02', title: 'Monitor', body: 'Trend velocity tracked continuously, so dying formats drop out.' },
      { n: '03', title: 'Match', body: 'Formats scored against clips you already own.' },
      { n: '04', title: 'Assemble', body: 'A bundle arrives. Clip order, audio, caption idea, hashtag cluster.' },
      { n: '05', title: 'Learn', body: 'Linked post analytics sharpen what gets suggested next time.' },
    ],
    metrics: [
      { value: 'On device', label: 'Where the processing happens' },
      { value: 'No auto post', label: 'You review everything' },
      { value: 'No pressure', label: 'Zero viral shame metrics' },
    ],
    closing:
      'Keeping up with formats without living inside the app, and without shooting a single new frame.',
  },
];

export const STUDIO = {
  name: 'Kinnovation',
  promise: 'Innovation without boundaries',
  headline: 'Six ventures, and one thing I keep running into.',
  lede:
    'I keep finding the same shape. Somebody has to make a decision, they are making it blind, and the information that would make it obvious already exists. It is just scattered across a thousand places that never talk to each other. Every venture here starts by going and collecting it.',
  body: [
    'Healthcare, civic infrastructure, productivity, nutrition, creator tools and access to justice. On paper that reads as unfocused. Look at the problems instead and they are the same problem. A parent choosing a therapy with nothing to go on. A donor holding a blank receipt. A student deciding what matters at eleven at night. Someone who knows thirty people watched what happened to them and cannot reach a single one.',
    'I work research first and product second. Understand the system properly, find the signal nobody is capturing, then build the smallest thing that captures it. Two of these have won money at pitch competitions, which mattered less for the cheque than for what the judges pushed back on.',
  ],
  /**
   * Real photographs rather than venture artwork. The studio page is about
   * her, so it uses the pitch pictures instead of the illustrations that sit
   * on the individual venture pages.
   */
  images: {
    hero: 'img/pitches/pitch-umass-stage.jpg',
    portrait: 'img/pitches/pitch-recognition.jpg',
  },
};

/** The venture after `id`, wrapping around at the end. */
export function nextVenture(id: string): Venture {
  const i = VENTURES.findIndex((v) => v.id === id);
  return VENTURES[(i + 1) % VENTURES.length];
}
