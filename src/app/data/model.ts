/**
 * Content for the modeling portfolio at /model.
 *
 * The shoot list below mirrors the folders in the "website portfolio pics"
 * Drive — one shoot per folder, in the order they appear on the page. The
 * image paths follow `img/model/<slug>/<slug>-NN.jpg`, which is exactly what
 * `tools/import-photos.py` writes, so dropping the photos in and running the
 * script is all that is needed to fill the page.
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
  /** All frames. The first four show by default, the rest behind "show all". */
  images: string[];
}

export const IDENTITY = {
  first: 'Kinjal',
  last: 'Pandey',
  based: 'Amherst, MA · New England',
  status: 'Available for editorial, runway, and campaign',
  /**
   * The opening frame. Published on its own path rather than as part of a
   * shoot, so it can change without shifting every index in that shoot, and
   * it is deliberately not repeated in the Beauty set below.
   */
  hero: ['img/model/hero.jpg'],
};

export const STATS: Stat[] = [
  { key: 'Height', value: "5'9\"", unit: '175 cm' },
  { key: 'Bust', value: '36"', unit: '91 cm' },
  { key: 'Waist', value: '26"', unit: '66 cm' },
  { key: 'Hips', value: '37"', unit: '94 cm' },
  { key: 'Dress', value: 'US 2', unit: 'EU 34' },
  { key: 'Shoe', value: 'US 10', unit: 'EU 41' },
  { key: 'Hair', value: 'Brown' },
  { key: 'Eyes', value: 'Brown' },
];

/**
 * Real digitals this time.
 *
 * The earlier set was beauty work standing in — full makeup, styled hair,
 * shallow depth of field — which is the opposite of what an agency asks for.
 * These are the genuine article: plain wall, minimal makeup, plain clothing,
 * and the standard spread of angles rather than six versions of one pose.
 * The beauty frames now have a shoot of their own in the book.
 */
export const DIGITALS: Digital[] = [
  { slug: 'digital-01', label: 'Full length', note: 'Front · hands on hips' },
  { slug: 'digital-02', label: 'Full length', note: 'Angled · arm raised' },
  { slug: 'digital-03', label: 'Waist up', note: 'Front · no makeup' },
  { slug: 'digital-04', label: 'Waist up', note: 'Front · closer' },
  { slug: 'digital-05', label: 'Profile', note: 'Side · 90°' },
  { slug: 'digital-06', label: 'Three-quarter', note: 'Angled · looking away' },
].map((d) => ({ ...d, src: `img/model/${'digitals'}/${d.slug}.jpg` }));

/** Builds the frame paths for one shoot. */
const frames = (slug: string, n: number): string[] =>
  Array.from(
    { length: n },
    (_, i) => `img/model/${slug}/${slug}-${String(i + 1).padStart(2, '0')}.jpg`,
  );

/**
 * Eight shoots, one per Drive folder. "Museum supplemental" is folded into the
 * Eric Carle set because it is the same event.
 *
 * Ordered strongest first — the two location editorials lead, the concept and
 * athletic sets close.
 *
 * Years come from the file timestamps. The Carle, pagoda and studio sets are
 * original camera files, so those dates are the shoot dates. The rest arrived
 * via WhatsApp, which rewrote their timestamps to the day they were forwarded,
 * so those are left blank rather than guessed. Cheer is the clearest example:
 * its files say 2025, but the uniform is Virginia Tech, which she left in 2022.
 */
export const SHOOTS: Shoot[] = [
  {
    index: '01',
    slug: 'carle',
    title: 'Fashion Meets Illustration',
    kind: 'Runway · Editorial',
    place: 'Eric Carle Museum of Picture Book Art',
    year: '2026',
    note:
      'A show staged inside the galleries, the walks lead, then the portraits made in among the frames.',
    accent: '224, 146, 84',
    images: frames('carle', 11),
  },
  {
    index: '02',
    slug: 'pagoda',
    title: 'New England Peace Pagoda',
    kind: 'Editorial · On location',
    place: 'Leverett, MA',
    year: '2026',
    note:
      'White drapery against snow and gilt, shot at the stupa. Several frames are a two-person set, credit your partner here.',
    accent: '96, 168, 156',
    images: frames('pagoda', 6),
  },
  {
    index: '03',
    slug: 'beauty',
    title: 'Beauty',
    kind: 'Beauty · Close-up',
    place: 'Add location',
    year: '',
    note:
      'Full makeup, styled hair, shallow depth of field, the close work, where the face carries the frame on its own. The opening portrait at the top of this page is from the same sitting.',
    accent: '206, 96, 128',
    images: frames('beauty', 5),
  },
  {
    index: '04',
    slug: 'snow',
    title: 'Snow',
    kind: 'Studio · Movement',
    place: 'White cyclorama',
    year: '2026',
    note:
      'High key on white, everything carried by line and motion, including one frame shot from directly overhead.',
    accent: '120, 150, 200',
    images: frames('snow', 4),
  },
  {
    index: '05',
    slug: 'black-dress',
    title: 'Little Black Dress',
    kind: 'Test · Natural light',
    place: 'Add location',
    year: '',
    note:
      'The classic test: one dress, hard sun, a bare wall. Nothing to hide behind and nothing to fix in post.',
    accent: '186, 130, 112',
    images: frames('black-dress', 3),
  },
  {
    index: '06',
    slug: 'cheer',
    title: 'Hokies Cheer',
    kind: 'Athletic · Uniform',
    place: 'Virginia Tech · Blacksburg, VA',
    year: '',
    note:
      'Collegiate cheer in maroon and orange, field, court, and one obligatory frame with the HokieBird. Add the seasons you competed.',
    accent: '206, 112, 76',
    images: frames('cheer', 5),
  },
];

export const BOOKING = {
  line: 'For bookings, digitals, or the full book',
  email: 'kinjalpandey18@gmail.com',
  location: 'Amherst, Massachusetts',
  travel: 'Available to travel · New England & NYC',
  instagram: '#',
};
