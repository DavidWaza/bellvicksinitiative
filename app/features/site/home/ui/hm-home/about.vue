<template>
  <NSection tone="mint" labelledby="about-title" class="cv-auto overflow-hidden">
    <NContainer class="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
      <!-- Photo cluster: blob + two circles + crown -->
      <div v-reveal class="relative mx-auto aspect-[1.08] w-full max-w-xl">
        <NDotMap class="absolute -bottom-10 -left-12 w-72 text-forest-900 opacity-[0.1]" />

        <NBlobImage
          :src="about.mainImage.src"
          :alt="about.mainImage.alt"
          :consent="about.mainImage.consent"
          mask="blob-2"
          sizes="xs:90vw sm:90vw md:40vw"
          class="absolute top-[4%] left-0 h-[88%] w-[82%]"
        />
        <NDoodleCrown class="absolute top-[-2%] left-[26%] w-16 -rotate-6 text-sun-500" />

        <div class="absolute top-[2%] right-0 size-[30%] rounded-full bg-mint-50 p-1.5 shadow-soft">
          <NBlobImage
            :src="about.smallImages[0].src"
            :alt="about.smallImages[0].alt"
            :consent="about.smallImages[0].consent"
            mask="none"
            sizes="160px"
            class="size-full rounded-full"
          />
        </div>
        <div
          class="absolute right-[4%] bottom-[2%] size-[26%] rounded-full bg-mint-50 p-1.5 shadow-soft"
        >
          <NBlobImage
            :src="about.smallImages[1].src"
            :alt="about.smallImages[1].alt"
            :consent="about.smallImages[1].consent"
            mask="none"
            sizes="140px"
            class="size-full rounded-full"
          />
        </div>
      </div>

      <!-- Copy -->
      <div>
        <NEyebrow v-reveal>About us</NEyebrow>
        <NHeading id="about-title" v-reveal="1" class="mt-4 text-forest-900">
          {{ about.heading }}
          <NHeadingHighlight tone="coral">{{ about.highlight }}</NHeadingHighlight>
        </NHeading>
        <p v-reveal="2" class="mt-5 max-w-xl text-base-600">{{ about.mission }}</p>

        <ul v-reveal="3" role="list" class="mt-6 grid gap-x-6 gap-y-1 sm:grid-cols-2">
          <li
            v-for="item in about.checklist"
            :key="item"
            class="flex min-h-11 items-center gap-3 font-medium text-base-900"
          >
            <NIcon name="check" weight="fill" size="1.5rem" class="shrink-0 text-accent-600" />
            {{ item }}
          </li>
        </ul>

        <div v-reveal="4" class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <NButton :to="ROUTES.about" color="brand"
            >Learn more <span class="sr-only">about Bellvicks</span></NButton
          >
          <NButton :to="ROUTES.story" variant="link" color="brand">
            <NIcon name="play" weight="fill" size="1.6em" class="text-accent-600" />
            Watch our story
          </NButton>
        </div>
      </div>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import { ROUTES } from "~/shared/site-routes";
import type { HomeAbout } from "../../domain/home-types";

defineProps<{ about: HomeAbout }>();
</script>
