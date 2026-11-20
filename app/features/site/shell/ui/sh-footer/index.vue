<template>
  <footer id="site-footer" class="relative mt-16 bg-forest-900 text-base-50">
    <!-- Leafy, wavy top edge (BrightPath). Sits above the footer and takes the section colour. -->
    <svg
      viewBox="0 0 1440 72"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      class="absolute inset-x-0 bottom-full h-8 w-full text-forest-900 md:h-[72px]"
    >
      <path
        fill="currentColor"
        d="M0 72 V46 C120 8 240 66 380 40 S620 4 760 38 S1040 70 1180 34 S1360 6 1440 30 V72 Z"
      />
      <path fill="currentColor" d="M96 44 C86 22 96 8 112 2 C122 20 118 36 96 44 Z" />
      <path fill="currentColor" d="M128 42 C130 22 146 12 160 14 C158 30 148 40 128 42 Z" />
      <path fill="currentColor" d="M1290 36 C1284 16 1296 4 1312 0 C1320 18 1314 30 1290 36 Z" />
    </svg>

    <NContainer class="pt-6 pb-10">
      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-12">
        <div>
          <NuxtLink
            :to="ROUTES.home"
            aria-label="Bellvicks Initiative — home"
            class="inline-flex rounded-full"
          >
            <sh-header-logo light />
          </NuxtLink>
          <p class="mt-4 max-w-xs text-forest-150">
            {{ SITE_INFO.legalName }} ({{ SITE_INFO.abbreviation }}) improves the lives of
            disadvantaged children, youth and vulnerable communities. Active since
            {{ SITE_INFO.foundedYear }}.
          </p>
          <ul class="mt-5 flex items-center gap-2" aria-label="Social media">
            <li v-for="social in SITE_INFO.socials" :key="social.id">
              <NLink
                :to="social.href"
                :aria-label="`${SITE_INFO.name} on ${social.label}`"
                class="flex size-11 items-center justify-center rounded-full bg-forest-600 text-base-50 transition-colors hover:bg-accent-500 hover:text-base-950"
              >
                <NIcon :name="social.id" size="1.35rem" />
              </NLink>
            </li>
          </ul>
        </div>

        <nav aria-labelledby="footer-quick">
          <h2 id="footer-quick" :class="HEADING">Quick links</h2>
          <ul class="mt-4 flex flex-col">
            <li v-for="link in FOOTER_QUICK_LINKS" :key="link.href">
              <NuxtLink :to="link.href" :class="LINK">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-focus">
          <h2 id="footer-focus" :class="HEADING">Focus areas</h2>
          <ul class="mt-4 flex flex-col">
            <li v-for="area in FOCUS_AREAS" :key="area.slug">
              <NuxtLink :to="area.href" :class="LINK">{{ area.label }}</NuxtLink>
            </li>
          </ul>
        </nav>

        <div>
          <h2 id="footer-contact" :class="HEADING">Contact</h2>
          <address class="mt-4 flex flex-col text-forest-150 not-italic">
            <span class="flex items-start gap-3 py-1.5">
              <NIcon
                name="pin"
                weight="duotone"
                size="1.35rem"
                class="mt-0.5 shrink-0 text-accent-500"
              />
              {{ SITE_INFO.address.street }}, {{ SITE_INFO.address.locality }},
              {{ SITE_INFO.address.country }}
            </span>
            <NLink
              v-for="phone in SITE_INFO.phones"
              :key="phone.href"
              :to="phone.href"
              class="flex min-h-11 items-center gap-3 hover:text-base-0"
            >
              <NIcon
                name="phone"
                weight="duotone"
                size="1.35rem"
                class="shrink-0 text-accent-500"
              />
              {{ phone.display }}
            </NLink>
            <NLink
              :to="`mailto:${SITE_INFO.email}`"
              class="flex min-h-11 items-center gap-3 break-all hover:text-base-0"
            >
              <NIcon name="mail" weight="duotone" size="1.35rem" class="shrink-0 text-accent-500" />
              {{ SITE_INFO.email }}
            </NLink>
          </address>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col gap-3 border-t border-forest-500 pt-6 text-sm text-forest-150 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© {{ year }} {{ SITE_INFO.legalName }}. All rights reserved.</p>
        <ul class="flex items-center gap-2">
          <li>
            <NuxtLink
              :to="ROUTES.privacy"
              class="inline-flex min-h-11 items-center px-2 hover:text-base-0"
            >
              Privacy Policy
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="ROUTES.terms"
              class="inline-flex min-h-11 items-center px-2 hover:text-base-0"
            >
              Terms
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="ROUTES.credits"
              class="inline-flex min-h-11 items-center px-2 hover:text-base-0"
            >
              Credits
            </NuxtLink>
          </li>
        </ul>
      </div>
    </NContainer>
  </footer>
</template>

<script setup lang="ts">
import { APP_TIME_ZONE } from "~/utils/time-zone";
import { SITE_INFO } from "~/shared/site-info";
import { FOCUS_AREAS, FOOTER_QUICK_LINKS } from "../../domain/site-nav";
import { ROUTES } from "~/shared/site-routes";

const HEADING = "text-[12px] font-bold tracking-[0.18em] text-sun-500 uppercase";
const LINK =
  "flex min-h-11 items-center text-forest-150 transition-colors hover:text-base-0 hover:underline";

// Intl, not Luxon: keeps ~70KB of date library out of the shell bundle for one number.
const year = new Intl.DateTimeFormat("en", { timeZone: APP_TIME_ZONE, year: "numeric" }).format(
  new Date(),
);
</script>
