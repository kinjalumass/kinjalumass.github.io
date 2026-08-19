/**
 * Pitch photography and competition wins.
 *
 * Every fact below is read directly off the presentation cheques in the
 * photographs — the issuing centre, the amount, the date, and in Trendify's
 * case the competition name. Nothing here is inferred.
 *
 * The CalendAI cheque does not name a competition, only the awarding centre,
 * so this does not claim one.
 */

export interface Plate {
  src: string;
  alt: string;
  caption: string;
}

export interface Award {
  /** Matches Venture.id so a venture page can find its own award */
  ventureId: string;
  venture: string;
  amount: string;
  /** e.g. "Second place" — omitted when the award was outright */
  placing?: string;
  /** Competition name, where the cheque states one */
  competition?: string;
  /** Co-founders credited on the award */
  withWhom?: { name: string; url?: string }[];
  centre: string;
  school: string;
  institution: string;
  /** ISO, for structured data */
  date: string;
  dateLabel: string;
  photo: string;
  alt: string;
}

export const AWARDS: Award[] = [
  {
    ventureId: 'karnah',
    venture: 'Karnah',
    amount: '$750',
    placing: 'Second place',
    competition: 'UPitch Spring 2026',
    centre: 'UMass Amherst Entrepreneurship Club',
    school: 'Sponsored by the Berthiaume Center for Entrepreneurship',
    institution: 'UMass Amherst',
    date: '2026-04-24',
    dateLabel: 'April 2026',
    withWhom: [
      { name: 'Rishav Chakravarty', url: 'https://www.linkedin.com/in/rishav-dsc/' },
    ],
    /**
     * ⚠️  This frame is cropped twice, and both crops matter.
     *
     * Vertically, above the cheque: the full frame shows the FIRST-place
     * $1,000 cheque awarded to Pitchify, a different team. Karnah took second
     * at $750.
     *
     * Horizontally, to the left half: Kinjal is second from left, so a centred
     * crop made another team's founder the subject of her own award card.
     *
     * The crop lives in tools/rebuild-photos.py under CROPPED.
     */
    photo: 'img/pitches/award-karnah-upitch.jpg',
    alt: 'The UPitch Spring 2026 finalists on stage at UMass Amherst, Kinjal Pandey second from left',
  },
  {
    ventureId: 'calendai',
    venture: 'CalendAI',
    amount: '$500',
    withWhom: [
      { name: 'Rishav Chakravarty', url: 'https://www.linkedin.com/in/rishav-dsc/' },
    ],
    centre: 'Apex Center for Entrepreneurs',
    school: 'Pamplin College of Business',
    institution: 'Virginia Tech',
    date: '2024-11-06',
    dateLabel: 'November 2024',
    photo: 'img/pitches/award-calendai-apex.jpg',
    alt: 'Kinjal Pandey holding a $500 presentation cheque awarded to CalendAI by the Apex Center for Entrepreneurs at Virginia Tech',
  },
  {
    ventureId: 'trendify',
    venture: 'Trendify AI',
    amount: '$300',
    withWhom: [
      { name: 'Rishav Chakravarty', url: 'https://www.linkedin.com/in/rishav-dsc/' },
    ],
    competition: 'Minute Pitch',
    centre: 'Berthiaume Center for Entrepreneurship',
    school: 'Isenberg School of Management',
    institution: 'UMass Amherst',
    date: '2025-10-16',
    dateLabel: 'October 2025',
    photo: 'img/pitches/award-trendify-berthiaume.jpg',
    alt: 'A $300 Minute Pitch winner cheque awarded to Trendify AI by the Berthiaume Center for Entrepreneurship at UMass Amherst',
  },
];

/** Looks up the award for a venture page. */
export function awardFor(ventureId: string): Award | undefined {
  return AWARDS.find((a) => a.ventureId === ventureId);
}

/**
 * ⚠️  Add photographer credit where you have it.
 */
/**
 * The one frame that closes the proof section.
 *
 * There are three pitch photographs and three places on this page that want
 * one; the other two open the page and sit beside the thesis. Repeating a
 * picture to fill a strip makes a page look like it has less than it does.
 */
export const PITCH_FRAME: Plate = {
  src: 'img/pitches/pitch-umass-podium.jpg',
  alt: 'Kinjal Pandey speaking from a University of Massachusetts Amherst lectern',
  caption: 'At the lectern, UMass Amherst',
};
