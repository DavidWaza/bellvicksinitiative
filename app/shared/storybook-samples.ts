/**
 * Sample storybook covers (AI-generated in Flick, project "Bellvicks Storybook Samples"; masters in
 * brand/storybook/). Illustrative only: invented children, not customers or beneficiaries. Shown on
 * the homepage teaser and the storybook landing, so it lives in shared/ rather than in one slice.
 * `src` is the path without size/extension: <src>-360.webp, <src>-720.webp, <src>-720.jpg.
 */
export interface SampleCover {
  src: string;
  alt: string;
}

export const SAMPLE_COVERS: SampleCover[] = [
  {
    src: "/images/storybook/amara-talking-baobab",
    alt: "Sample cover: Amara and the Talking Baobab, a smiling girl in an Ankara dress beside a friendly baobab tree",
  },
  {
    src: "/images/storybook/tunde-big-market-day",
    alt: "Sample cover: Tunde's Big Market Day, a laughing boy with a basket and a cheeky goat in a busy market",
  },
];
