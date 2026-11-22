<template>
  <NSection tone="lavender" labelledby="books-title" class="cv-auto overflow-hidden">
    <!-- Sun-yellow blob behind the content -->
    <div
      aria-hidden="true"
      class="absolute top-1/2 right-[-14%] size-[40rem] -translate-y-1/2 bg-sun-100 lg:right-[-4%] lg:size-[46rem]"
      :style="maskStyle('blob-3')"
    />
    <NContainer class="relative grid items-center gap-14 lg:grid-cols-2">
      <div>
        <NEyebrow v-reveal tone="coral">Create your storybook</NEyebrow>
        <NHeading id="books-title" v-reveal="1" class="mt-4 text-forest-900">
          A picture book where
          <NHeadingHighlight tone="coral">your child</NHeadingHighlight>
          is the hero.
        </NHeading>
        <p v-reveal="2" class="mt-5 max-w-lg text-base-600">{{ teaser.copy }}</p>

        <!-- Quick facts -->
        <ul
          v-reveal="3"
          role="list"
          aria-label="About the storybooks"
          class="mt-6 flex flex-wrap gap-2"
        >
          <li
            v-for="band in teaser.ageBands"
            :key="band"
            class="rounded-full border border-lavender-150 bg-base-0 px-4 py-1.5 text-sm font-bold text-lavender-600"
          >
            {{ band }}
          </li>
        </ul>

        <div v-reveal="4" class="mt-8 flex items-center gap-2 min-[360px]:gap-2.5 sm:gap-3">
          <NButton
            :to="ROUTES.storybookCreate"
            color="coral"
            size="lg"
            class="h-12 px-3 text-sm min-[360px]:px-4 min-[360px]:text-[0.9375rem] sm:h-14 sm:px-8 sm:text-lg"
          >
            <NIcon name="book" weight="duotone" /> Start creating
          </NButton>
          <NButton
            :to="ROUTES.storybook"
            color="coral"
            variant="ghost"
            size="lg"
            class="h-12 px-3 text-sm min-[360px]:px-4 min-[360px]:text-[0.9375rem] sm:h-14 sm:px-8 sm:text-lg"
          >
            How it works
          </NButton>
        </div>
      </div>

      <div v-reveal="2" class="relative mx-auto w-full max-w-md pt-10 pb-4">
        <NDoodleHeart class="absolute -top-2 right-2 z-30 w-11 text-coral-500" />
        <NCoverStack :covers="SAMPLE_COVERS" class="pt-6">
          <p class="font-hand -rotate-2 pl-4 text-3xl text-coral-700">Starring your child!</p>
          <p class="mt-1 pl-4 text-sm text-base-550">Sample covers. Yours stars your child.</p>
        </NCoverStack>
      </div>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import { maskStyle } from "~/components/n/blob-image/mask-paths";
import { ROUTES } from "~/shared/site-routes";
import { SAMPLE_COVERS } from "~/shared/storybook-samples";
import type { HomeBooksTeaser } from "../../domain/home-types";

defineProps<{ teaser: HomeBooksTeaser }>();
</script>
