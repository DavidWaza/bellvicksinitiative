<template>
  <div>
    <NPageHero eyebrow="What we do" :breadcrumbs="[{ label: 'What we do' }]">
      Programmes that make a <NHeadingHighlight>difference</NHeadingHighlight>
      <template #lead>
        Through sustainable development programmes and humanitarian support, we improve the lives of
        disadvantaged children, youth and vulnerable communities, always working with local
        communities and partners.
      </template>
      <template #actions>
        <NButton :to="ROUTES.causes">See our causes <NIcon name="arrowRight" /></NButton>
        <NButton :to="ROUTES.getInvolved" variant="ghost" color="brand">Get involved</NButton>
      </template>
    </NPageHero>

    <NSection tone="white" aria-label="Focus areas">
      <NContainer>
        <ul role="list" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <li v-for="(area, i) in FOCUS_AREA_PAGES" :key="area.slug" v-reveal="i % 3" class="flex">
            <NuxtLink
              :to="focusAreaPath(area.slug)"
              class="group flex w-full flex-col overflow-hidden rounded-3xl border border-base-150/70 bg-base-50 shadow-soft transition duration-300 hover:-translate-y-1"
            >
              <NBlobImage
                :image="area.image"
                mask="none"
                sizes="xs:92vw sm:92vw md:45vw lg:380px"
                class="aspect-[16/10] w-full"
              />
              <div class="flex flex-1 flex-col gap-3 p-6">
                <div class="flex items-center gap-3">
                  <NIconBlob :icon="area.icon" :tone="area.tone" class="size-12" />
                  <h2 class="font-display text-2xl font-semibold text-forest-900">
                    {{ area.title }}
                  </h2>
                </div>
                <p class="text-base-550">{{ area.tagline }}</p>
                <span
                  class="mt-auto inline-flex items-center gap-1.5 pt-2 font-bold text-forest-500 group-hover:underline"
                >
                  Learn more <span class="sr-only">about {{ area.title }}</span>
                  <NIcon
                    name="arrowRight"
                    class="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </NContainer>
    </NSection>

    <NSection tone="mint" labelledby="approach-title">
      <NContainer class="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <NEyebrow>How we work</NEyebrow>
          <NHeading id="approach-title" class="mt-4 text-forest-900">
            Built with communities, <NHeadingHighlight tone="coral">made to last</NHeadingHighlight>
          </NHeading>
        </div>
        <ul role="list" class="grid gap-4 sm:grid-cols-3">
          <li
            v-for="step in APPROACH"
            :key="step.title"
            class="rounded-2xl bg-base-0 p-5 shadow-soft"
          >
            <NIconBlob :icon="step.icon" :tone="step.tone" class="size-12" />
            <h3 class="font-display mt-4 text-lg font-semibold text-forest-900">
              {{ step.title }}
            </h3>
            <p class="mt-1.5 text-sm text-base-550">{{ step.text }}</p>
          </li>
        </ul>
      </NContainer>
    </NSection>

    <NCtaBand eyebrow="Make it happen">
      Help us reach the next child.
      <template #lead
        >Every gift supports education, health and clean water where it's needed most.</template
      >
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
import { focusAreaPath, ROUTES } from "~/shared/site-routes";
import type { IconName } from "~/utils/icons";
import type { Tone } from "~/utils/tones";
import { FOCUS_AREA_PAGES } from "../../domain/programmes-content";

const APPROACH: { title: string; text: string; icon: IconName; tone: Tone }[] = [
  {
    title: "Listen",
    text: "Programmes start with the needs communities tell us about.",
    icon: "message",
    tone: "sky",
  },
  {
    title: "Partner",
    text: "We work with local communities and partners to deliver.",
    icon: "partner",
    tone: "sun",
  },
  {
    title: "Sustain",
    text: "We build resilience and self-reliance, not dependence.",
    icon: "sustainability",
    tone: "coral",
  },
];
</script>
