<template>
  <NSection
    tone="cream"
    spacing="none"
    labelledby="hero-title"
    class="overflow-hidden pt-8 pb-14 md:pt-12 lg:pt-14 lg:pb-20"
  >
    <NContainer class="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
      <!-- Left: structured core -->
      <div>
        <NEyebrow>{{ hero.eyebrow }}</NEyebrow>
        <NHeading id="hero-title" as="h1" size="display" class="mt-5 text-forest-900">
          {{ hero.headlineLead }}
          <NHeadingHighlight tone="accent">{{ hero.highlight }}</NHeadingHighlight
          >{{ hero.headlineTail }}
        </NHeading>
        <p class="mt-6 max-w-xl text-lg text-base-550">{{ hero.supporting }}</p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <NButton :to="ROUTES.donate" size="lg">
            <NIcon name="heart" weight="fill" /> Send Relief
          </NButton>
          <NButton to="#causes" size="lg" variant="ghost" color="brand">
            See our causes
            <NIcon name="play" weight="fill" size="1.5em" class="text-accent-600" />
          </NButton>
        </div>

        <div class="mt-8 flex items-center gap-4">
          <NuxtLink
            to="#get-involved"
            class="inline-flex min-h-11 items-center text-sm font-bold text-forest-500 underline decoration-2 underline-offset-4 hover:decoration-transparent"
          >
            Join our volunteer network
          </NuxtLink>
        </div>
      </div>

      <!-- Right: Africa mask on a dotted world map -->
      <div class="relative mx-auto w-full max-w-[32rem] lg:max-w-none lg:pl-6">
        <NDotMap
          class="absolute top-1/2 left-1/2 w-[135%] max-w-none -translate-x-1/2 -translate-y-1/2"
        />

        <div class="relative mx-auto aspect-[0.956] w-full max-w-[34rem]">
          <NBlobImage
            :src="hero.image.src"
            :alt="hero.image.alt"
            :consent="hero.image.consent"
            mask="africa"
            preload
            sizes="xs:92vw sm:92vw md:45vw lg:544px"
            class="size-full bg-accent-100"
          />

          <!-- Pulsing pin on Abuja (0.361, 0.392 of the continent's bounding box) -->
          <span class="absolute z-10" style="left: 36.1%; top: 39.2%" aria-hidden="true">
            <span class="relative flex size-3.5 -translate-x-1/2 -translate-y-1/2">
              <span
                class="animate-pin-pulse absolute inset-0 rounded-full bg-accent-500 will-change-[transform,opacity]"
              />
              <span class="relative size-3.5 rounded-full bg-accent-500 ring-2 ring-base-0" />
              <span
                class="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-base-0 px-2 py-0.5 text-[11px] leading-4 font-bold text-base-900 shadow-soft"
              >
                Abuja
              </span>
            </span>
          </span>

          <!-- Floating dots (static: an infinite float over the dot map cost ~0.5s of TBT) -->
          <span
            aria-hidden="true"
            class="absolute top-[10%] left-[2%] size-4 rounded-full bg-accent-500"
          />
          <span
            aria-hidden="true"
            class="absolute top-[46%] right-[0%] size-3 rounded-full bg-sky-500"
          />

          <!-- Doodle: spark -->
          <NDoodleSpark class="absolute -top-3 left-[30%] hidden w-12 text-sun-500 md:block" />
        </div>
      </div>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import { ROUTES } from "~/shared/site-routes";
import type { HomeHero } from "../../domain/home-types";

defineProps<{ hero: HomeHero }>();
</script>
