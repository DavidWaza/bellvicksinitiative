<template>
  <NSection tone="cream" labelledby="story-title" class="cv-auto overflow-hidden pt-4 md:pt-8">
    <NContainer class="grid items-center gap-10 lg:grid-cols-[1fr_1fr_0.9fr] lg:gap-12">
      <div v-reveal class="relative mx-auto w-full max-w-[16rem] sm:max-w-sm lg:max-w-none">
        <NBlobImage
          :src="story.image.src"
          :alt="story.image.alt"
          :consent="story.image.consent"
          mask="blob-1"
          sizes="xs:80vw sm:80vw md:30vw"
          class="aspect-[1.1] w-full"
        />
        <NDoodleSpark class="absolute -top-4 right-2 w-12 text-sun-500" />
      </div>

      <div>
        <NEyebrow v-reveal>Featured story</NEyebrow>
        <NHeading id="story-title" v-reveal="1" class="mt-4 text-forest-900">
          {{ story.heading }}
          <NHeadingHighlight tone="accent">{{ story.highlight }}</NHeadingHighlight>
        </NHeading>
        <p v-reveal="2" class="mt-5 text-base-600">
          <NTodo :content="story.intro" label="Story intro" class="w-full">
            {{ story.intro }}
            <template #placeholder
              >A short introduction to a real, consented beneficiary story.</template
            >
          </NTodo>
        </p>
        <div v-reveal="3" class="mt-6">
          <NButton :to="ROUTES.story" variant="link" color="brand">
            Read the story <NIcon name="arrowRight" />
          </NButton>
        </div>
      </div>

      <figure v-reveal="2" class="relative rounded-[2rem] bg-mint-100 p-8 pt-10">
        <span
          aria-hidden="true"
          class="font-display absolute top-3 left-6 text-[6rem] leading-none font-semibold text-forest-500/35 select-none"
        >
          “
        </span>
        <blockquote class="font-hand relative pt-8 text-[1.9rem] leading-tight text-base-900">
          <NTodo :content="story.quote" label="Quote" class="w-full">
            {{ story.quote }}
            <template #placeholder>A quote in the child's own words.</template>
          </NTodo>
        </blockquote>
        <figcaption class="mt-5 text-sm text-base-550">
          —
          <NTodo :content="story.attribution" label="Name, age">
            {{ story.attribution }}
            <template #placeholder>Name, age</template>
          </NTodo>
        </figcaption>
        <NDoodleHeart class="absolute right-6 bottom-5 w-9 text-sun-600" />
      </figure>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import { ROUTES } from "~/shared/site-routes";
import type { HomeStory } from "../../domain/home-types";

defineProps<{ story: HomeStory }>();
</script>
