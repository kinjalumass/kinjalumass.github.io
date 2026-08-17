/**
 * The three resume PDFs.
 *
 * The files themselves live in `public/resume/`. Drop your own PDF in over a
 * placeholder, keep the filename, and the page picks it up — no code change.
 *
 * To add a fourth track, add an entry here and put the PDF in the same folder.
 */

export interface ResumeDoc {
  /** URL-safe id, also used in the deep link (?v=ai-ml) */
  id: string;
  /** Tab label */
  label: string;
  /** One line describing who this version is aimed at */
  note: string;
  /** Path relative to the site root */
  file: string;
  /** Filename used when the visitor downloads it */
  download: string;
}

export const RESUME_DOCS: ResumeDoc[] = [
  {
    id: 'ai-ml',
    label: 'AI / ML',
    note: 'Research-weighted — publication, applied ML, and privacy work up front.',
    file: 'resume/kinjal-pandey-ai-ml.pdf',
    download: 'Kinjal-Pandey-AI-ML.pdf',
  },
  {
    id: 'software',
    label: 'Software Engineering',
    note: 'Build-weighted — open source, secure pipelines, and shipped prototypes.',
    file: 'resume/kinjal-pandey-software-engineering.pdf',
    download: 'Kinjal-Pandey-Software-Engineering.pdf',
  },
  {
    id: 'data',
    label: 'Data Science / Analytics',
    note: 'Analysis-weighted — civic data work, statistics, and stakeholder reporting.',
    file: 'resume/kinjal-pandey-data-science.pdf',
    download: 'Kinjal-Pandey-Data-Science.pdf',
  },
];
