<template>
  <NSection tone="cream" labelledby="programmes-title" class="cv-auto">
    <NContainer>
      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <!-- Cell 1: heading block -->
        <div class="flex flex-col justify-center py-4 md:col-span-2 lg:col-span-1 lg:pr-6">
          <NEyebrow v-reveal>What we do</NEyebrow>
          <NHeading id="programmes-title" v-reveal="1" class="mt-4 text-forest-900">
            Programmes that make a
            <NHeadingHighlight tone="accent">difference</NHeadingHighlight>
          </NHeading>
          <p v-reveal="2" class="mt-4 max-w-md text-base-550">
            Five focus areas, shaped with the communities we serve and delivered with local
            partners.
          </p>
          <div v-reveal="3" class="mt-6">
            <NButton :to="ROUTES.whatWeDo" color="brand">
              Explore all <NIcon name="arrowRight" />
            </NButton>
          </div>
        </div>

        <!-- Cells 2–6: BrightPath image cards -->
        <NuxtLink
          v-for="(programme, i) in programmes"
          :key="programme.slug"
          v-reveal="i + 1"
          :to="programme.href"
          class="group relative isolate flex min-h-[13.5rem] overflow-hidden rounded-2xl border border-base-150/70 bg-base-0 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-14px_rgb(29_26_21/0.2)]"
        >
          <NBlobImage
            :src="programme.image.src"
            :alt="programme.image.alt"
            :consent="programme.image.consent"
            mask="blob-4"
            sizes="220px"
            class="absolute inset-y-3 -right-10 z-0 w-[52%] transition-transform duration-500 group-hover:scale-105"
          />
          <div class="relative z-10 flex w-[62%] flex-col gap-3 p-5">
            <NIconBlob
              :icon="programme.icon"
              :tone="programme.tone"
              shape="blob-1"
              class="size-12"
            />
            <h3 class="font-display text-xl font-semibold text-forest-900">
              {{ programme.title }}
            </h3>
            <p class="text-sm text-base-550">{{ programme.line }}</p>
            <span
              class="mt-auto flex size-9 items-center justify-center rounded-full bg-forest-50 text-forest-500 transition-colors group-hover:bg-forest-500 group-hover:text-base-0"
              aria-hidden="true"
            >
              <NIcon name="arrowRight" />
            </span>
          </div>
        </NuxtLink>
      </div>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import { ROUTES } from "~/shared/site-routes";
import type { HomeProgramme } from "../../domain/home-types";

defineProps<{ programmes: HomeProgramme[] }>();
</script>
