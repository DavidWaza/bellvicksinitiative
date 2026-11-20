/**
 * `useSeoMeta` for a page: title, description, canonical, Open Graph and Twitter card.
 * The OG image defaults to the logo card (/brand/og-image.png); override with NUXT_PUBLIC_OG_IMAGE.
 */
export function usePageSeo(options: { title: string; description: string; path?: string }) {
  const config = useRuntimeConfig();
  const route = useRoute();
  const siteUrl = config.public.siteUrl.replace(/\/$/, "");
  const url = `${siteUrl}${options.path ?? route.path}`;
  const image = config.public.ogImage ? `${siteUrl}${config.public.ogImage}` : undefined;

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogType: "website",
    ogUrl: url,
    ogSiteName: "Bellvicks Initiative",
    ogLocale: "en_NG",
    ogImage: image,
    twitterCard: image ? "summary_large_image" : "summary",
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: image,
  });
  useHead({ link: [{ rel: "canonical", href: url }] });
}
