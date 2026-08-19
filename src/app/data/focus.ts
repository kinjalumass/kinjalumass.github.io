/**
 * Where the face is in each frame — GENERATED, do not hand-edit.
 *
 * The gallery tiles crop with `object-fit: cover`. Left to itself that crops to
 * the middle of the image, which on a full-length fashion frame is the torso.
 * These values move the crop to the subject’s face instead, as an
 * `object-position` pair.
 *
 * Regenerate after adding photos:
 *     python3 tools/face-focus.py
 *
 * The detector is a Haar cascade, so it is not infallible — a handful of these
 * were corrected by eye where it locked onto another model in a group frame.
 * Those corrections live in `tools/face-focus.py` under OVERRIDE.
 */

export const FOCUS: Record<string, string> = {
  // top level
  'img/model/hero.jpg': '58% 36%',

  // carle
  'img/model/carle/carle-01.jpg': '44% 29%',
  'img/model/carle/carle-02.jpg': '50% 28%',
  'img/model/carle/carle-03.jpg': '64% 70%',
  'img/model/carle/carle-04.jpg': '53% 26%',
  'img/model/carle/carle-05.jpg': '66% 18%',
  'img/model/carle/carle-06.jpg': '60% 18%',
  'img/model/carle/carle-07.jpg': '28% 59%',
  'img/model/carle/carle-08.jpg': '35% 26%',
  'img/model/carle/carle-09.jpg': '74% 57%',
  'img/model/carle/carle-10.jpg': '42% 26%',
  'img/model/carle/carle-11.jpg': '78% 44%',

  // pagoda
  'img/model/pagoda/pagoda-01.jpg': '47% 58%',
  'img/model/pagoda/pagoda-02.jpg': '45% 35%',
  'img/model/pagoda/pagoda-03.jpg': '59% 90%',
  'img/model/pagoda/pagoda-04.jpg': '45% 29%',
  'img/model/pagoda/pagoda-05.jpg': '60% 46%',
  'img/model/pagoda/pagoda-06.jpg': '22% 71%',

  // beauty
  'img/model/beauty/beauty-01.jpg': '66% 32%',
  'img/model/beauty/beauty-02.jpg': '44% 32%',
  'img/model/beauty/beauty-03.jpg': '50% 28%',
  'img/model/beauty/beauty-04.jpg': '62% 26%',
  'img/model/beauty/beauty-05.jpg': '54% 34%',

  // snow
  'img/model/snow/snow-01.jpg': '52% 25%',
  'img/model/snow/snow-02.jpg': '48% 17%',
  'img/model/snow/snow-03.jpg': '50% 28%',
  'img/model/snow/snow-04.jpg': '54% 39%',

  // black-dress
  'img/model/black-dress/black-dress-01.jpg': '43% 19%',
  'img/model/black-dress/black-dress-02.jpg': '61% 35%',
  'img/model/black-dress/black-dress-03.jpg': '44% 19%',

  // cheer
  'img/model/cheer/cheer-01.jpg': '45% 30%',
  'img/model/cheer/cheer-02.jpg': '52% 30%',
  'img/model/cheer/cheer-03.jpg': '50% 28%',
  'img/model/cheer/cheer-04.jpg': '52% 29%',
  'img/model/cheer/cheer-05.jpg': '45% 24%',

  // digitals
  'img/model/digitals/digital-01.jpg': '54% 15%',
  'img/model/digitals/digital-02.jpg': '42% 20%',
  'img/model/digitals/digital-03.jpg': '51% 27%',
  'img/model/digitals/digital-04.jpg': '52% 29%',
  'img/model/digitals/digital-05.jpg': '50% 28%',
  'img/model/digitals/digital-06.jpg': '48% 33%',
};

/** Falls back to a top-weighted crop, which is right for a standing frame. */
export function focusOf(src: string): string {
  return FOCUS[src] ?? '50% 28%';
}
