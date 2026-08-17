/**
 * Content for the modelling portfolio at /model.
 *
 * ⚠️  MEASUREMENTS ARE PLACEHOLDERS.
 *     The values in STATS below are stand-ins so the layout could be built —
 *     they are NOT Kinjal's real measurements. Replace every one of them
 *     before this page goes anywhere near an agency or a casting director.
 */

export interface Stat {
  key: string;
  value: string;
  unit?: string;
}

export interface Digital {
  slug: string;
  label: string;
  note: string;
  src: string;
}

export interface Shoot {
  index: string;
  slug: string;
  title: string;
  kind: string;
  place: string;
  year: string;
  note: string;
  /** Accent for this shoot, as `r, g, b` */
  accent: string;
  /** All frames. The first 8 show by default, the rest behind "show all". */
  images: string[];
}

export const IDENTITY = {
  first: 'Kinjal',
  last: 'Pandey',
  based: 'Amherst, MA · New England',
  status: 'Available for editorial, runway, and campaign',
  hero: ['img/model/hero-01.jpg', 'img/model/hero-02.jpg'],
};

/** ⚠️ PLACEHOLDER VALUES — replace all of these. */
export const STATS: Stat[] = [
  { key: 'Height', value: "5'7\"", unit: '170 cm' },
  { key: 'Bust', value: '32"', unit: '81 cm' },
  { key: 'Waist', value: '24"', unit: '61 cm' },
  { key: 'Hips', value: '34"', unit: '86 cm' },
  { key: 'Dress', value: 'US 2', unit: 'EU 34' },
  { key: 'Shoe', value: 'US 7', unit: 'EU 38' },
  { key: 'Hair', value: 'Black' },
  { key: 'Eyes', value: 'Brown' },
];

export const DIGITALS: Digital[] = [
  { slug: 'headshot', label: 'Headshot', note: 'No makeup · natural light', src: 'img/model/digital-headshot.jpg' },
  { slug: 'smile', label: 'Smile', note: 'Headshot · natural', src: 'img/model/digital-smile.jpg' },
  { slug: 'front', label: 'Front', note: 'Full length · arms down', src: 'img/model/digital-front.jpg' },
  { slug: 'profile', label: 'Profile', note: 'Side · 90°', src: 'img/model/digital-profile.jpg' },
  { slug: 'three-quarter', label: 'Three-quarter', note: 'Angled · hands visible', src: 'img/model/digital-three-quarter.jpg' },
  { slug: 'back', label: 'Back', note: 'Full length · rear', src: 'img/model/digital-back.jpg' },
];

/** Eight frames per shoot. Add more to any array — the gallery expands. */
const frames = (slug: string, n = 8): string[] =>
  Array.from({ length: n }, (_, i) => `img/model/${slug}-${String(i + 1).padStart(2, '0')}.jpg`);

/**
 * ⚠️ Only the first entry is real (press coverage of the Eric Carle Museum
 *    event). The other five are structural placeholders — replace the titles,
 *    venues, years, and notes with your actual work.
 */
export const SHOOTS: Shoot[] = [
  {
    index: '01',
    slug: 'carle',
    title: 'Fashion Meets Illustration',
    kind: 'Editorial',
    place: 'Eric Carle Museum',
    year: '2026',
    note: 'Garments staged against illustration — where the picture book meets the lookbook.',
    accent: '214, 122, 96',
    images: frames('carle'),
  },
  {
    index: '02',
    slug: 'runway',
    title: 'Runway',
    kind: 'Live presentation',
    place: 'Placeholder — add venue',
    year: '—',
    note: 'Replace with the show, the designer, and the season.',
    accent: '138, 122, 196',
    images: frames('runway'),
  },
  {
    index: '03',
    slug: 'lookbook',
    title: 'Lookbook',
    kind: 'Commercial',
    place: 'Placeholder — add client',
    year: '—',
    note: 'Replace with the brand, the collection, and the crew.',
    accent: '96, 158, 148',
    images: frames('lookbook'),
  },
  {
    index: '04',
    slug: 'studio',
    title: 'Studio',
    kind: 'Portrait',
    place: 'Placeholder — add studio',
    year: '—',
    note: 'Replace with the photographer, the styling, and the intent.',
    accent: '196, 140, 106',
    images: frames('studio'),
  },
  {
    index: '05',
    slug: 'campaign',
    title: 'Campaign',
    kind: 'Advertising',
    place: 'Placeholder — add client',
    year: '—',
    note: 'Replace with the campaign, the agency, and where it ran.',
    accent: '176, 118, 150',
    images: frames('campaign'),
  },
  {
    index: '06',
    slug: 'beauty',
    title: 'Beauty',
    kind: 'Close-up',
    place: 'Placeholder — add team',
    year: '—',
    note: 'Replace with the makeup artist, the story, and the publication.',
    accent: '120, 146, 190',
    images: frames('beauty'),
  },
];

export const BOOKING = {
  line: 'For bookings, digitals, or the full book',
  email: 'kinjalpandey18@gmail.com',
  location: 'Amherst, Massachusetts',
  travel: 'Available to travel · New England & NYC',
  instagram: '#',
};
