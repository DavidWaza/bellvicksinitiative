<template>
  <div>
    <!-- Hero -->
    <NSection
      tone="lavender"
      spacing="none"
      labelledby="page-title"
      class="relative overflow-hidden pt-8 pb-16 md:pt-10 md:pb-24"
    >
      <div
        aria-hidden="true"
        class="absolute top-1/2 right-[-20%] size-[44rem] -translate-y-1/2 bg-sun-100 lg:right-[-6%]"
        :style="maskStyle('blob-3')"
      />
      <NContainer class="relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <NBreadcrumbs :items="[{ label: 'Create your storybook' }]" class="mb-6" />
          <div class="flex items-center gap-3">
            <NEyebrow tone="coral">Create your storybook</NEyebrow>
            <NSticker class="text-base">New ✨</NSticker>
          </div>
          <NHeading id="page-title" as="h1" size="display" class="mt-4 text-forest-900">
            A picture book where <NHeadingHighlight tone="coral">your child</NHeadingHighlight> is
            the hero.
          </NHeading>
          <p class="mt-5 max-w-xl text-lg text-base-600">
            Tell us their name, age and a few favourite things, add a photo, and we'll write three
            brand-new adventures starring them. Pick the ones you love and we'll print them as
            keepsake books.
          </p>
          <div class="mt-8 flex items-center gap-2 min-[360px]:gap-2.5 sm:gap-3">
            <NButton
              :to="ROUTES.storybookCreate"
              color="coral"
              size="lg"
              class="h-12 px-3 text-sm min-[360px]:px-4 min-[360px]:text-[0.9375rem] sm:h-14 sm:px-8 sm:text-lg"
            >
              <NIcon name="book" weight="duotone" /> Start creating
            </NButton>
            <NButton
              to="#how-it-works"
              color="coral"
              variant="ghost"
              size="lg"
              class="h-12 px-3 text-sm min-[360px]:px-4 min-[360px]:text-[0.9375rem] sm:h-14 sm:px-8 sm:text-lg"
              >How it works</NButton
            >
          </div>
        </div>
        <div class="relative mx-auto w-full max-w-md pt-10">
          <NDoodleHeart class="absolute -top-2 right-2 z-30 w-11 text-coral-500" />
          <NCoverStack :covers="SAMPLE_COVERS" eager class="pt-6">
            <p class="font-hand -rotate-2 pl-4 text-3xl text-coral-700">Starring your child!</p>
            <p class="mt-1 pl-4 text-sm text-base-550">Sample covers. Yours stars your child.</p>
          </NCoverStack>
        </div>
      </NContainer>
    </NSection>

    <!-- How it works -->
    <NSection id="how-it-works" tone="cream" labelledby="how-title" class="scroll-mt-20">
      <NContainer>
        <NEyebrow tone="coral">How it works</NEyebrow>
        <NHeading id="how-title" class="mt-4 text-forest-900">Three simple steps</NHeading>
        <ol role="list" class="mt-10 grid gap-6 md:grid-cols-3">
          <li v-for="(s, i) in STEPS" :key="s.title" class="flex">
            <NCard class="w-full gap-4 p-6">
              <div class="flex items-center gap-3">
                <NIconBlob :icon="s.icon" :tone="s.tone" />
                <span class="font-hand text-3xl text-coral-700">Step {{ i + 1 }}</span>
              </div>
              <h3 class="font-display text-xl font-semibold text-forest-900">{{ s.title }}</h3>
              <p class="text-base-550">{{ s.text }}</p>
            </NCard>
          </li>
        </ol>
        <div class="mt-10 flex justify-center">
          <NButton :to="ROUTES.storybookCreate" color="coral" size="lg">
            Create your storybook <NIcon name="arrowRight" />
          </NButton>
        </div>
      </NContainer>
    </NSection>

    <!-- Book drives (the charity side) -->
    <NSection tone="white" labelledby="drives-title">
      <NContainer>
        <NEyebrow tone="coral">Book drives</NEyebrow>
        <NHeading id="drives-title" class="mt-4 text-forest-900"
          >Help a child hold a story of their own</NHeading
        >
        <p class="mt-4 max-w-2xl text-base-550">
          Our book drives put brand-new books into the hands of out-of-school children in Keffi and
          Gwagwalada.
        </p>
        <ul role="list" class="mt-10 grid gap-6 md:grid-cols-2">
          <li v-for="drive in DRIVES" :key="drive.place" class="flex">
            <NuxtLink
              :to="causePath(drive.cause)"
              class="group grid w-full overflow-hidden rounded-3xl bg-base-0 shadow-soft sm:grid-cols-[0.9fr_1fr]"
            >
              <NBlobImage
                :image="drive.image"
                mask="none"
                sizes="xs:92vw sm:92vw md:280px"
                class="aspect-[4/3] sm:aspect-auto sm:h-full"
              />
              <div class="flex flex-col gap-3 p-6">
                <span class="inline-flex items-center gap-1.5 text-sm font-medium text-base-550">
                  <NIcon name="pin" weight="duotone" class="text-coral-600" /> {{ drive.place }}
                </span>
                <h3 class="font-display text-2xl font-semibold text-forest-900">
                  {{ drive.title }}
                </h3>
                <p class="text-base-550">{{ drive.text }}</p>
                <span
                  class="mt-auto inline-flex items-center gap-1.5 font-bold text-coral-700 group-hover:underline"
                >
                  Support this drive <NIcon name="arrowRight" />
                </span>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </NContainer>
    </NSection>
  </div>
</template>

<script setup lang="ts">
import { maskStyle } from "~/components/n/blob-image/mask-paths";
import { photo } from "~/shared/photos";
import { SAMPLE_COVERS } from "~/shared/storybook-samples";
import { causePath, ROUTES, type CauseSlug } from "~/shared/site-routes";
import type { IconName } from "~/utils/icons";
import type { Tone } from "~/utils/tones";

const STEPS: { title: string; text: string; icon: IconName; tone: Tone }[] = [
  {
    title: "Tell us about your child",
    text: "Their name, age and a few favourite things: foods, places, the funny things they do.",
    icon: "message",
    tone: "sky",
  },
  {
    title: "Add a photo and a dedication",
    text: "A smiling photo helps us draw a character that looks just like them. Add a note from you.",
    icon: "camera",
    tone: "sun",
  },
  {
    title: "Pick your favourite stories",
    text: "We write three adventures. Preview each one, pick the books you love and we'll be in touch.",
    icon: "books",
    tone: "coral",
  },
];

const DRIVES: {
  place: string;
  title: string;
  text: string;
  cause: CauseSlug;
  image: ReturnType<typeof photo>;
}[] = [
  {
    place: "Keffi",
    title: "New books for Keffi",
    text: "New books and educational supplies for out-of-school children in Keffi.",
    cause: "keffi-books",
    image: photo("/images/books/keffi.jpg", "childrenWithBooks", "Children reading in Keffi"),
  },
  {
    place: "Gwagwalada",
    title: "New books for Gwagwalada",
    text: "New books and educational supplies for out-of-school children in Gwagwalada.",
    cause: "gwagwalada-books",
    image: photo(
      "/images/books/gwagwalada.jpg",
      "girlReadingToClass",
      "Children reading in Gwagwalada",
    ),
  },
];
</script>
