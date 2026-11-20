/** Real organisation details from the current bellvicksinitiative.org. Single source of truth. */
export const SITE_INFO = {
  name: "Bellvicks Initiative",
  legalName: "Bellvicks Global Aid Initiative",
  abbreviation: "BGAI",
  foundedYear: 2018,
  tagline: "The future we want to see in Africa.",
  address: {
    street: "19 Ali Baba Crescent, Jabi",
    locality: "Abuja",
    country: "Nigeria",
    countryCode: "NG",
  },
  phones: [
    { display: "+234 703 948 9643", href: "tel:+2347039489643" },
    { display: "+234 803 213 6629", href: "tel:+2348032136629" },
  ],
  email: "info@bellvicksinitiative.org",
  // X/Twitter and YouTube have no handles yet. Add them here and their icons appear.
  socials: [
    { id: "facebook", label: "Facebook", href: "https://facebook.com/bellvicksHQ" },
    { id: "instagram", label: "Instagram", href: "https://instagram.com/bellvickshq" },
  ],
} as const;
