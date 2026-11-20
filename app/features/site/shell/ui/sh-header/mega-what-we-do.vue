<template>
  <div
    class="grid w-[min(44rem,calc(100vw-4rem))] grid-cols-[1.35fr_1fr] gap-2 rounded-3xl border border-base-150/70 bg-base-0 p-3 shadow-soft"
  >
    <div class="flex flex-col">
      <p class="px-3 pt-2 pb-1 text-[12px] font-bold tracking-[0.18em] text-forest-500 uppercase">
        Our focus areas
      </p>
      <ul>
        <li v-for="area in mainAreas" :key="area.slug">
          <NuxtLink
            :to="area.href"
            class="flex items-center gap-3 rounded-2xl px-3 py-2 transition-colors hover:bg-forest-50"
          >
            <NIconBlob :icon="area.icon" :tone="area.tone" class="size-11" />
            <span class="min-w-0">
              <span class="block font-bold text-base-900">{{ area.label }}</span>
              <span class="block text-sm leading-snug text-base-550">{{ area.blurb }}</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
      <NuxtLink
        v-if="mentorship"
        :to="mentorship.href"
        class="mx-1 mt-1 flex min-h-11 items-center gap-2 rounded-xl border-t border-base-150 px-2 pt-2 text-sm font-bold text-forest-500 hover:underline"
      >
        <NIcon :name="mentorship.icon" weight="duotone" size="1.25rem" />
        {{ mentorship.label }} — {{ mentorship.blurb }}
      </NuxtLink>
    </div>
    <NuxtLink
      :to="FEATURED_NAV_CAUSE.href"
      class="group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-sky-50 p-5"
    >
      <NDoodleDotCluster class="absolute top-4 right-4 w-10 text-sky-500" />
      <NIconBlob icon="water" tone="sky" shape="blob-1" class="mb-auto size-16" />
      <NEyebrow class="mt-6 text-sky-700" tone="forest">{{ FEATURED_NAV_CAUSE.eyebrow }}</NEyebrow>
      <p class="font-display mt-2 text-xl leading-tight font-semibold text-forest-900">
        {{ FEATURED_NAV_CAUSE.title }}
      </p>
      <p class="mt-1 text-sm text-base-550">{{ FEATURED_NAV_CAUSE.blurb }}</p>
      <span class="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-forest-500">
        View causes
        <NIcon name="arrowRight" class="transition-transform group-hover:translate-x-0.5" />
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { FEATURED_NAV_CAUSE, FOCUS_AREAS } from "../../domain/site-nav";

const mainAreas = FOCUS_AREAS.filter((a) => a.slug !== "mentorship");
const mentorship = FOCUS_AREAS.find((a) => a.slug === "mentorship");
</script>
