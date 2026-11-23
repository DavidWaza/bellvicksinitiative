<template>
  <section
    :aria-labelledby="`bs-step-${step}`"
    class="rounded-3xl bg-base-0 p-6 shadow-soft sm:p-8"
  >
    <div class="flex items-center gap-3">
      <span
        aria-hidden="true"
        class="flex size-9 shrink-0 items-center justify-center rounded-full bg-forest-500 font-bold text-base-0"
        >{{ step }}</span
      >
      <h2 :id="`bs-step-${step}`" class="font-display text-2xl font-semibold text-forest-900">
        {{ title }}
      </h2>
    </div>
    <p v-if="hint" class="mt-2 text-sm text-base-550">{{ hint }}</p>
    <div class="mt-6 grid gap-5">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
/** One numbered part of a Back to School form (the paper form's headed sections). */
defineProps<{ step: number; title: string; hint?: string }>();
</script>
