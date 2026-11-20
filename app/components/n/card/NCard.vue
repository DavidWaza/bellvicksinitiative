<template>
  <div
    data-slot="card"
    :class="
      cn(
        'flex flex-col overflow-hidden rounded-2xl border border-base-150/70 bg-base-0 text-base-900 shadow-soft',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
