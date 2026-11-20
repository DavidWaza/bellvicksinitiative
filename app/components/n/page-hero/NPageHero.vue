<template>
  <NSection
    :tone="tone"
    spacing="none"
    :labelledby="titleId"
    :class="cn('relative overflow-hidden pt-8 pb-14 md:pt-10 md:pb-20', props.class)"
  >
    <NDotMap class="absolute -top-10 -right-24 hidden w-[46rem] md:block" />
    <NContainer
      :class="
        cn(
          'relative grid items-center gap-10',
          $slots.media && 'lg:grid-cols-[1.1fr_1fr] lg:gap-14',
        )
      "
    >
      <div>
        <NBreadcrumbs v-if="breadcrumbs?.length" :items="breadcrumbs" class="mb-6" />
        <NEyebrow v-if="eyebrow" :tone="eyebrowTone">{{ eyebrow }}</NEyebrow>
        <NHeading :id="titleId" as="h1" size="display" class="mt-4 text-forest-900">
          <slot />
        </NHeading>
        <p v-if="$slots.lead" class="mt-5 max-w-2xl text-lg text-base-600">
          <slot name="lead" />
        </p>
        <div v-if="$slots.actions" class="mt-8 flex flex-wrap items-center gap-3">
          <slot name="actions" />
        </div>
      </div>
      <div v-if="$slots.media" class="relative mx-auto w-full max-w-xl">
        <slot name="media" />
      </div>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { SectionVariants } from "../section/section-variants";
import type { BreadcrumbItem } from "../breadcrumbs/NBreadcrumbs.vue";

/**
 * The top band of every inner page: breadcrumbs, eyebrow, the page's one h1 (default slot, so
 * NHeadingHighlight works inside it), a lead paragraph, actions and an optional media column.
 */
const props = withDefaults(
  defineProps<{
    eyebrow?: string;
    eyebrowTone?: "accent" | "coral" | "forest";
    tone?: SectionVariants["tone"];
    breadcrumbs?: BreadcrumbItem[];
    class?: HTMLAttributes["class"];
  }>(),
  { eyebrow: undefined, eyebrowTone: "accent", tone: "cream", breadcrumbs: undefined },
);

const titleId = "page-title";
</script>
