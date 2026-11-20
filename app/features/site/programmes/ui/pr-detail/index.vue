<template>
  <div>
    <NPageHero
      eyebrow="What we do"
      :breadcrumbs="[{ label: 'What we do', to: ROUTES.whatWeDo }, { label: area.title }]"
    >
      <NHeadingHighlight :tone="area.tone === 'coral' ? 'coral' : 'accent'">{{
        area.title
      }}</NHeadingHighlight>
      <template #lead>{{ area.tagline }}</template>
      <template #actions>
        <NButton :to="ROUTES.donate"
          ><NIcon name="heart" weight="fill" /> Support this work</NButton
        >
        <NButton :to="ROUTES.getInvolved" variant="ghost" color="brand">Get involved</NButton>
      </template>
      <template #media>
        <NBlobImage
          :image="area.image"
          mask="blob-2"
          preload
          sizes="xs:92vw sm:92vw md:45vw lg:560px"
          class="aspect-[1.1] w-full"
        />
        <NIconBlob :icon="area.icon" :tone="area.tone" class="absolute -bottom-2 left-2 size-20" />
      </template>
    </NPageHero>

    <NSection tone="white" labelledby="focus-title">
      <NContainer class="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <NEyebrow>Our work</NEyebrow>
          <NHeading id="focus-title" class="mt-4 text-forest-900">What this looks like</NHeading>
          <p class="mt-5 text-lg text-base-600">{{ area.intro }}</p>
        </div>
        <ul role="list" class="grid gap-4">
          <li
            v-for="(item, i) in area.focus"
            :key="item.title"
            v-reveal="i"
            class="flex gap-4 rounded-2xl border border-base-150/70 bg-base-50 p-5"
          >
            <NIcon name="check" weight="fill" size="1.75rem" class="shrink-0 text-accent-600" />
            <div>
              <h3 class="font-display text-xl font-semibold text-forest-900">{{ item.title }}</h3>
              <p class="mt-1 text-base-550">{{ item.text }}</p>
            </div>
          </li>
        </ul>
      </NContainer>
    </NSection>

    <NSection v-if="area.relatedCauses.length" tone="cream" labelledby="related-title">
      <NContainer>
        <NEyebrow>Causes</NEyebrow>
        <NHeading id="related-title" class="mt-4 text-forest-900">Support this work today</NHeading>
        <ul role="list" class="mt-8 grid gap-4 md:grid-cols-2">
          <li v-for="slug in area.relatedCauses" :key="slug">
            <NuxtLink
              :to="causePath(slug)"
              class="group flex items-center justify-between gap-4 rounded-2xl bg-base-0 p-5 shadow-soft"
            >
              <span>
                <span class="flex items-center gap-1.5 text-sm text-base-550">
                  <NIcon name="pin" weight="duotone" class="text-forest-500" />
                  {{ CAUSE_LINK_TITLES[slug].location }}
                </span>
                <span class="font-display mt-1 block text-xl font-semibold text-forest-900">
                  {{ CAUSE_LINK_TITLES[slug].title }}
                </span>
              </span>
              <span
                class="flex size-11 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-500 transition-colors group-hover:bg-forest-500 group-hover:text-base-0"
                aria-hidden="true"
              >
                <NIcon name="arrowRight" />
              </span>
            </NuxtLink>
          </li>
        </ul>
      </NContainer>
    </NSection>

    <NSection tone="cream" spacing="sm" aria-label="Other focus areas">
      <NContainer>
        <h2 class="font-display text-2xl font-semibold text-forest-900">Explore our other work</h2>
        <ul role="list" class="mt-6 flex flex-wrap gap-3">
          <li v-for="other in others" :key="other.slug">
            <NuxtLink
              :to="focusAreaPath(other.slug)"
              class="flex min-h-11 items-center gap-2 rounded-full border border-base-150 bg-base-0 py-1.5 pr-5 pl-1.5 font-bold text-forest-900 hover:border-forest-500"
            >
              <NIconBlob :icon="other.icon" :tone="other.tone" class="size-9" />
              {{ other.title }}
            </NuxtLink>
          </li>
        </ul>
      </NContainer>
    </NSection>

    <NCtaBand :eyebrow="area.title">
      Be part of the change.
      <template #actions>
        <NButton :to="ROUTES.donate" size="lg"
          ><NIcon name="heart" weight="fill" /> Send Relief</NButton
        >
        <NButton :to="ROUTES.volunteer" size="lg" variant="ghost" color="light">Volunteer</NButton>
      </template>
    </NCtaBand>
  </div>
</template>

<script setup lang="ts">
import { causePath, focusAreaPath, ROUTES } from "~/shared/site-routes";
import {
  CAUSE_LINK_TITLES,
  FOCUS_AREA_PAGES,
  type FocusAreaPage,
} from "../../domain/programmes-content";

const props = defineProps<{ area: FocusAreaPage }>();
const others = computed(() => FOCUS_AREA_PAGES.filter((a) => a.slug !== props.area.slug));
</script>
