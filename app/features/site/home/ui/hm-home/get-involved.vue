<template>
  <NSection
    id="get-involved"
    tone="cream"
    spacing="none"
    labelledby="involved-title"
    class="cv-auto scroll-mt-20 py-10 md:py-16"
  >
    <NContainer>
      <div
        v-reveal
        class="relative isolate overflow-hidden rounded-[2rem] bg-forest-900 text-base-50 md:rounded-[3rem]"
      >
        <!-- Organic wavy layers -->
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
          class="absolute inset-x-0 bottom-0 -z-10 h-24 w-full text-forest-600"
        >
          <path
            fill="currentColor"
            d="M0 70 C150 20 300 110 480 70 S800 20 1000 70 S1150 90 1200 60 V120 H0 Z"
          />
        </svg>
        <!-- Photo bleeding in from the right -->
        <NBlobImage
          :src="image.src"
          :alt="image.alt"
          :consent="image.consent"
          mask="blob-2"
          sizes="1px md:55vw"
          class="absolute -top-8 -right-20 -bottom-8 -z-10 hidden w-[60%] md:block"
        />
        <NDoodleSpark class="absolute top-8 left-[46%] hidden w-12 text-sun-500 lg:block" />

        <div class="relative max-w-xl px-6 py-12 sm:px-10 md:px-14 md:py-16">
          <NEyebrow tone="light">Get involved</NEyebrow>
          <NHeading id="involved-title" size="h2" class="mt-4 text-base-50">
            Be the reason a child
            <NHeadingHighlight tone="light">turns the page.</NHeadingHighlight>
          </NHeading>

          <ul role="list" class="mt-8 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-6">
            <li v-for="option in OPTIONS" :key="option.label">
              <NuxtLink
                :to="option.href"
                class="group flex min-h-11 items-center gap-2.5 font-bold text-base-50"
              >
                <NIcon :name="option.icon" weight="duotone" size="1.6rem" class="text-sun-500" />
                <span
                  class="underline decoration-forest-150 decoration-2 underline-offset-4 group-hover:decoration-sun-500"
                >
                  {{ option.label }}
                </span>
              </NuxtLink>
            </li>
          </ul>

          <div class="mt-8">
            <hm-home-volunteer-sheet>
              <template #trigger>
                <NButton
                  size="lg"
                  class="h-auto min-h-14 max-w-full py-3 text-center whitespace-normal"
                >
                  <NIcon name="heart" weight="fill" /> Join the volunteer network
                </NButton>
              </template>
            </hm-home-volunteer-sheet>
          </div>
        </div>
      </div>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import type { ImageSlot } from "~/shared/image";
import type { IconName } from "~/utils/icons";
import { ROUTES } from "~/shared/site-routes";

defineProps<{ image: ImageSlot }>();

const OPTIONS: { label: string; href: string; icon: IconName }[] = [
  { label: "Volunteer", href: ROUTES.volunteer, icon: "volunteer" },
  { label: "Become a mentor", href: ROUTES.becomeMentor, icon: "mentorship" },
  { label: "Partner with us", href: ROUTES.partner, icon: "partner" },
];
</script>
