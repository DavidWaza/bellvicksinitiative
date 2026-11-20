<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
</template>

<script setup lang="ts">
import { SITE_INFO } from "~/shared/site-info";
import { REVEAL_HEAD_SCRIPT } from "~/utils/reveal-script";

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl.replace(/\/$/, "");

// Organization / NGO structured data — real address and contacts only. No registration number
// (TODO_CONTENT: CAC number).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["NGO", "Organization"],
  "@id": `${siteUrl}/#organization`,
  name: SITE_INFO.name,
  legalName: SITE_INFO.legalName,
  alternateName: SITE_INFO.abbreviation,
  url: `${siteUrl}/`,
  logo: `${siteUrl}/brand/icon-512.png`,
  foundingDate: String(SITE_INFO.foundedYear),
  slogan: SITE_INFO.tagline,
  email: SITE_INFO.email,
  telephone: SITE_INFO.phones.map((p) => p.href.replace("tel:", "")),
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE_INFO.address.street,
    addressLocality: SITE_INFO.address.locality,
    addressCountry: SITE_INFO.address.countryCode,
  },
  sameAs: SITE_INFO.socials.map((s) => s.href),
};

useHead({
  htmlAttrs: { lang: "en-NG" },
  titleTemplate: (title) => title ?? "Bellvicks Initiative",
  meta: [{ name: "theme-color", content: "#0F3526" }],
  link: [
    { rel: "icon", type: "image/png", sizes: "32x32", href: "/brand/favicon-32.png" },
    { rel: "icon", type: "image/png", sizes: "48x48", href: "/brand/favicon-48.png" },
    { rel: "icon", type: "image/png", sizes: "192x192", href: "/brand/icon-192.png" },
    { rel: "apple-touch-icon", sizes: "180x180", href: "/brand/apple-touch-icon.png" },
    // The display face is above the fold on every page; preload it to avoid a late swap.
    {
      rel: "preload",
      href: "/fonts/fraunces-latin-full.woff2",
      as: "font",
      type: "font/woff2",
      crossorigin: "",
    },
  ],
  script: [
    // Scroll-reveal runs from the head, before first paint and independent of hydration, so
    // content can never be left invisible waiting for a lazily hydrated section.
    { innerHTML: REVEAL_HEAD_SCRIPT, tagPosition: "head" },
    { type: "application/ld+json", innerHTML: JSON.stringify(jsonLd) },
  ],
});
</script>
