<template>
  <main
    class="flex min-h-dvh flex-col items-center justify-center bg-base-50 px-4 py-10 print:bg-base-0 print:py-0"
  >
    <article
      class="flex w-full max-w-md flex-col items-center rounded-[2rem] bg-base-0 px-8 py-10 text-center shadow-soft print:max-w-none print:shadow-none"
    >
      <img src="/brand/logo-160.png" alt="Bellvicks Initiative" width="72" height="72" />
      <p class="mt-3 text-[12px] font-bold tracking-[0.18em] text-coral-700 uppercase">
        Bellvicks Initiative
      </p>
      <h1 class="font-display mt-2 text-4xl font-semibold text-forest-900">{{ code.title }}</h1>
      <p class="mt-3 text-base-600">{{ code.line }}</p>

      <img
        :src="svg"
        :alt="`QR code linking to ${shortUrl}`"
        width="320"
        height="320"
        class="mt-8 aspect-square w-full max-w-80 print:max-w-[9cm]"
      />
      <p class="mt-4 font-bold text-forest-900">{{ shortUrl }}</p>
    </article>

    <!-- Not printed -->
    <div class="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
      <NButton size="lg" @click="print">Print</NButton>
      <a :href="svg" :download="`bellvicks-${name}-qr.svg`" :class="LINK_BUTTON">Download SVG</a>
      <a :href="png" :download="`bellvicks-${name}-qr.png`" :class="LINK_BUTTON">Download PNG</a>
    </div>
    <p class="mt-4 max-w-md text-center text-sm text-base-550 print:hidden">
      This page isn't linked anywhere on the site. The SVG stays sharp at any print size; the PNG is
      2048 × 2048 pixels.
    </p>
  </main>
</template>

<script setup lang="ts">
/**
 * Unlisted, printable QR codes: /qr/storybook, /qr/donate… Not in the nav, footer or sitemap,
 * and noindex. The list is app/shared/qr-codes.json; the images are generated from it by
 * `node scripts/generate-qr.mjs` into public/qr/.
 */
import { buttonVariants } from "~/components/n/button/button-variants";
import QR_CODES from "~/shared/qr-codes.json";

type QrName = keyof typeof QR_CODES;

definePageMeta({
  layout: false,
  validate: (route) => String(route.params.name) in QR_CODES,
});

const name = useRoute().params.name as QrName;
const code = QR_CODES[name];
const shortUrl = code.url.replace(/^https?:\/\/(www\.)?/, "");
const svg = `/qr/${name}.svg`;
const png = `/qr/${name}.png`;
const LINK_BUTTON = buttonVariants({ variant: "ghost", color: "brand", size: "lg" });

useHead({
  title: `${code.title} QR code — Bellvicks Initiative`,
  meta: [{ name: "robots", content: "noindex" }],
});

function print() {
  window.print();
}
</script>
