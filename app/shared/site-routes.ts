/**
 * Every public path the site links to. Nav, footer, sitemap and prerender rules all read this file,
 * so a link can never point at a route that does not exist. Imported by nuxt.config.ts — keep it
 * free of Nuxt auto-imports.
 */
export const ROUTES = {
  home: "/",
  about: "/about",
  whatWeDo: "/what-we-do",
  education: "/what-we-do/education",
  health: "/what-we-do/health",
  skillDevelopment: "/what-we-do/skill-development",
  sustainability: "/what-we-do/sustainability",
  community: "/what-we-do/community",
  mentorship: "/what-we-do/mentorship",
  causes: "/causes",
  storybook: "/create-your-storybook",
  storybookCreate: "/create-your-storybook/create",
  cart: "/cart",
  checkout: "/checkout",
  checkoutComplete: "/checkout/complete",
  getInvolved: "/get-involved",
  volunteer: "/get-involved/volunteer",
  becomeMentor: "/get-involved/become-a-mentor",
  partner: "/get-involved/partner-with-us",
  backToSchool: "/back-to-school",
  sponsorChild: "/back-to-school/sponsor-a-child",
  applySponsorship: "/back-to-school/apply",
  news: "/news",
  story: "/news/stories",
  contact: "/contact",
  donate: "/donate",
  donateComplete: "/donate/complete",
  shop: "/shop",
  shopBag: "/shop/bag",
  shopGive: "/shop/give-to-a-child",
  shopDonateItem: "/shop/donate-an-item",
  privacy: "/privacy-policy",
  terms: "/terms",
  credits: "/credits",
  /** Unlisted printable QR codes (shared/qr-codes.json). Linked from nowhere on the site. */
  storybookQr: "/qr/storybook",
  donateQr: "/qr/donate",
} as const;

/** Focus-area slugs: /what-we-do/<slug>. The programmes slice owns their content. */
const FOCUS_AREA_SLUGS = [
  "education",
  "health",
  "skill-development",
  "sustainability",
  "community",
  "mentorship",
] as const;
export type FocusAreaSlug = (typeof FOCUS_AREA_SLUGS)[number];

/** Cause slugs: /causes/<slug>. The causes slice owns their content. */
export const CAUSE_SLUGS = [
  "keffi-books",
  "gwagwalada-books",
  "gwagwalada-food",
  "lokoja-water",
] as const;
export type CauseSlug = (typeof CAUSE_SLUGS)[number];

/** The Giving Shop's product pages. Kept in step with features/site/shop/domain/shop-products.ts. */
export const PRODUCT_SLUGS = [
  "give-hope-tshirt",
  "bellvicks-tote",
  "kindness-hoodie",
  "bellvicks-cap",
  "morning-hope-mug",
  "dream-big-notebook",
  "school-starter-set",
  "giving-gift-box",
] as const;
export const productPath = (slug: string) => `${ROUTES.shop}/${slug}`;

export const causePath = (slug: CauseSlug) => `${ROUTES.causes}/${slug}`;
export const focusAreaPath = (slug: FocusAreaSlug) => `${ROUTES.whatWeDo}/${slug}`;

/** Private pages: prerendered, but kept out of the sitemap and search engines. */
export const NOINDEX_PATHS: string[] = [
  ROUTES.cart,
  ROUTES.checkout,
  ROUTES.checkoutComplete,
  ROUTES.donateComplete,
  ROUTES.shopBag,
  ROUTES.storybookQr,
  ROUTES.donateQr,
];

/** Paths prerendered at build time (the sitemap lists them all except NOINDEX_PATHS). */
export const PRERENDER_PATHS: string[] = [
  ...new Set([
    ...Object.values(ROUTES),
    ...FOCUS_AREA_SLUGS.map(focusAreaPath),
    ...CAUSE_SLUGS.map(causePath),
    ...PRODUCT_SLUGS.map(productPath),
  ]),
];
