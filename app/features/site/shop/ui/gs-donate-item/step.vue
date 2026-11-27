<template>
  <h2 :id="id" class="flex items-center gap-3 font-display text-2xl font-semibold text-forest-900">
    <span
      class="grid size-9 shrink-0 place-items-center rounded-full bg-accent-500 font-sans text-base font-bold text-base-950"
      aria-hidden="true"
      >{{ n }}</span
    >
    <span><span class="sr-only">Step {{ n }}: </span>{{ title }}</span>
  </h2>
</template>

<script setup lang="ts">
/** A numbered section heading in the "Donate an item" form. */
defineProps<{ id: string; n: number; title: string }>();
</script>
