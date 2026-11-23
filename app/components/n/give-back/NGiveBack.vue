<template>
  <!-- Full callout: its own band on the storybook landing page -->
  <div
    v-if="variant === 'banner'"
    data-slot="give-back"
    :class="
      cn(
        'flex flex-col items-start gap-6 rounded-3xl bg-forest-900 p-7 text-base-0 sm:flex-row sm:items-center sm:p-10',
        props.class,
      )
    "
  >
    <NIconBlob icon="student" tone="sun" class="size-20 shrink-0" />
    <div>
      <p class="font-hand text-2xl text-sun-500">Buy a book, send a child to school</p>
      <h2 :id="headingId" class="font-display mt-1 text-2xl font-semibold sm:text-3xl">
        {{ GIVE_BACK_LINE }}
      </h2>
      <p class="mt-3 max-w-2xl text-base-0/85">
        Your child gets a story where they're the hero, and an out-of-school child gets the chance
        to learn. Every order supports Bellvicks Initiative's work to get children into school.
      </p>
    </div>
  </div>

  <!-- Compact: hero, homepage teaser, cart, confirmation. "Your book" + "a child's school place". -->
  <div v-else data-slot="give-back" :class="cn('flex items-center gap-4', props.class)">
    <div aria-hidden="true" class="flex shrink-0 items-center">
      <span
        class="flex size-12 items-center justify-center rounded-full bg-coral-100 text-coral-700 ring-4 ring-base-0"
      >
        <NIcon name="book" weight="duotone" size="1.5rem" />
      </span>
      <span
        class="-ml-3 flex size-12 items-center justify-center rounded-full bg-sun-100 text-forest-900 ring-4 ring-base-0"
      >
        <NIcon name="student" weight="duotone" size="1.5rem" />
      </span>
    </div>
    <div class="min-w-0">
      <p class="font-hand text-2xl leading-none text-coral-700">Buy one, give one</p>
      <p class="mt-1 text-[0.95rem] leading-snug text-base-600">
        Every storybook you buy
        <strong class="font-bold text-forest-900">sponsors another child into school.</strong>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

/**
 * The storybook's charity promise, stated by Bellvicks: each storybook sold sponsors another
 * child into school. One wording, used everywhere the storybook is sold.
 */
const GIVE_BACK_LINE = "Every storybook you buy sponsors another child into school.";

const props = withDefaults(
  defineProps<{
    variant?: "banner" | "inline";
    /** Banner only: id for the heading, so a section can be labelled by it. */
    headingId?: string;
    class?: HTMLAttributes["class"];
  }>(),
  { variant: "inline", headingId: undefined },
);
</script>
