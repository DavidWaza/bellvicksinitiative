<template>
  <div data-slot="card-body" :class="cn('flex flex-1 flex-col gap-3 p-5', props.class)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
