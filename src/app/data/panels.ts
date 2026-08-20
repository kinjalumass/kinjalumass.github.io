/**
 * The three faces of the landing page.
 *
 * This is the only file you need to touch to change the copy on the home page.
 * Each panel is fully self-describing — edit freely.
 */
export interface PanelLink {
  label: string;
  href: string;
}

export interface Panel {
  /** URL-safe id, also used for the CSS hook */
  id: string;
  /** Ordinal shown in the corner, e.g. "01" */
  ordinal: string;
  /** Small rotated label on the panel edge */
  eyebrow: string;
  /** Large serif headline */
  title: string;
  /** One line under the headline */
  kicker: string;
  /** Lead paragraph on the section page */
  blurb: string;
  /** Bulleted detail on the section page */
  focus: string[];
  /** Outbound links shown in the opened state */
  links: PanelLink[];
  /** Accent hue as an `r, g, b` triplet so it can be used with alpha */
  accent: string;
  /** Background photograph for the tile, relative to the site root */
  image: string;
}

export const PANELS: Panel[] = [
  {
    id: 'developer',
    ordinal: '01',
    eyebrow: 'Engineering',
    title: 'Developer',
    kicker: "Master's in Computer Science",
    blurb:
      'I build software that has to hold up under real use, not just demos. ' +
      'Currently deep in a CS master’s, splitting time between coursework, research, and shipping things people actually touch.',
    focus: [
      'Master of Science, Computer Science',
      'Full-stack and systems engineering',
      'Applied machine learning',
      'Research and technical writing',
    ],
    links: [
      { label: 'GitHub', href: '#' },
      { label: 'Projects', href: '#' },
    ],
    accent: '124, 255, 178',
    image: 'img/tiles/tile-developer.jpg',
  },
  {
    id: 'entrepreneur',
    ordinal: '02',
    eyebrow: 'Ventures',
    title: 'Entrepreneur',
    kicker: 'Pitching, building, raising',
    blurb:
      'I take ideas from a napkin sketch to a room full of investors. ' +
      'Product thinking, a deck that earns attention, and the discipline to keep iterating after the applause stops.',
    focus: [
      'Startup ideation and validation',
      'Pitch competitions and demo days',
      'Product strategy and go-to-market',
      'Investor decks and storytelling',
    ],
    links: [
      { label: 'Ventures', href: '#' },
      { label: 'LinkedIn', href: '#' },
    ],
    accent: '255, 106, 61',
    image: 'img/tiles/tile-entrepreneur.jpg',
  },
  {
    id: 'model',
    ordinal: '03',
    eyebrow: 'Portfolio',
    title: 'Model',
    kicker: 'Editorial · Runway · Campaign',
    blurb:
      'Work in front of the camera, treated with the same rigour as everything else. ' +
      'Editorial, runway, and commercial, collaborative, direction-friendly, and comfortable on a long shoot day.',
    focus: [
      'Editorial and lookbook shoots',
      'Runway and live presentation',
      'Commercial and campaign work',
      'Digitals and comp card on request',
    ],
    links: [
      { label: 'Instagram', href: '#' },
      { label: 'Book', href: '#' },
    ],
    accent: '138, 138, 142',
    image: 'img/tiles/tile-model.jpg',
  },
];
