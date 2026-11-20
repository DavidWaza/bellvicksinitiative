<template>
  <div role="status" class="flex flex-col items-center py-16 text-center">
    <div class="relative">
      <NIconBlob icon="book" tone="coral" class="size-24 motion-safe:animate-pulse" />
      <NDoodleSpark class="absolute -top-4 -right-6 w-10 text-sun-500" />
    </div>
    <h1
      id="step-title"
      tabindex="-1"
      class="font-display mt-8 text-3xl font-semibold text-forest-900 outline-none"
    >
      Writing {{ name.trim() || "your child" }}'s stories…
    </h1>
    <p class="mt-3 max-w-sm text-base-600">
      We're putting {{ name.trim() || "your child" }} at the heart of three brand-new adventures.
      This only takes a moment.
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ name: string }>();
</script>
