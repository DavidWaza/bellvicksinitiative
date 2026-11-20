<template>
  <slot v-if="isReal(content)" />
  <span
    v-else-if="isDev"
    data-slot="todo"
    :class="
      cn(
        'relative inline-flex min-w-16 items-center justify-center rounded-lg border-2 border-dashed border-accent-500 bg-accent-50/60 px-2 py-0.5 text-base-550',
        props.class,
      )
    "
  >
    <slot name="placeholder">—</slot>
    <span
      class="absolute -top-2.5 left-2 max-w-[calc(100%-0.5rem)] truncate rounded bg-accent-500 px-1.5 font-sans text-[10px] leading-4 font-bold tracking-wide whitespace-nowrap text-base-950 uppercase not-italic"
      :title="label ? `Content needed: ${label}` : 'Content needed'"
    >
      content needed<template v-if="label"> · {{ label }}</template>
    </span>
  </span>
  <slot v-else name="fallback" />
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { isReal } from "~/shared/todo-content";

/**
 * The `TODO_CONTENT` convention. Real content renders the default slot. Otherwise: a dashed
 * outline with a "content needed" tag in dev, and the `fallback` slot (default: nothing) in
 * production. Dev/prod is a build-time constant, so SSR and hydration always agree.
 */
const props = defineProps<{
  content: unknown;
  /** Names the missing fact in the dev tag, e.g. "Children reached". */
  label?: string;
  class?: HTMLAttributes["class"];
}>();

const isDev = import.meta.dev;
</script>
