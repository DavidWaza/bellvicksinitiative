/**
 * Guardian consent for any photo showing a child. In production a photo whose consent is still
 * `pending` is never rendered (see NBlobImage) — it falls back to the neutral placeholder.
 * Stock photos are `not-required`: the stock licence covers them, and they never claim to show
 * a Bellvicks beneficiary.
 */
export type ImageConsent = "granted" | "pending" | "not-required";

export interface PhotoCredit {
  photographer: string;
  /** The photo's page on the stock site. */
  url: string;
  site: "Unsplash";
}

/** A photo "slot": a named place on the site that a real Bellvicks photo will fill. */
export interface ImageSlot {
  /** Public path the real Bellvicks photo will live at, e.g. "/images/home/hero-child.jpg". */
  slot: string;
  /** What is rendered: the real file, a stock stand-in, or undefined (placeholder block). */
  src?: string;
  alt: string;
  consent: ImageConsent;
  source: "bellvicks" | "stock" | "none";
  credit?: PhotoCredit;
}
