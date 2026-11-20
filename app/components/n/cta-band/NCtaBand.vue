<template>
  <NSection
    tone="cream"
    spacing="none"
    :labelledby="headingId"
    :class="cn('py-10 md:py-16', props.class)"
  >
    <NContainer>
      <div
        class="relative isolate overflow-hidden rounded-[2rem] bg-forest-900 text-base-50 md:rounded-[3rem]"
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
          class="absolute inset-x-0 bottom-0 -z-10 h-20 w-full text-forest-600"
        >
          <path
            fill="currentColor"
            d="M0 70 C150 20 300 110 480 70 S800 20 1000 70 S1150 90 1200 60 V120 H0 Z"
          />
        </svg>
        <NDoodleSpark class="absolute top-8 right-10 hidden w-12 text-sun-500 md:block" />
        <div
          class="relative flex flex-col gap-8 px-6 py-12 sm:px-10 md:px-14 md:py-14 lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="max-w-2xl">
            <NEyebrow v-if="eyebrow" tone="light">{{ eyebrow }}</NEyebrow>
            <h2 :id="headingId" class="mt-3 text-[2rem] text-base-50 sm:text-4xl">
              <slot />
            </h2>
            <p v-if="$slots.lead" class="mt-4 text-forest-150"><slot name="lead" /></p>
          </div>
          <div class="flex flex-wrap gap-3">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

/** The closing forest call-to-action band used at the bottom of inner pages. */
const props = defineProps<{ eyebrow?: string; class?: HTMLAttributes["class"] }>();
const headingId = useId();
</script>
