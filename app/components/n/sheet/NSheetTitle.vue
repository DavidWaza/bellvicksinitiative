<template>
  <DialogTitle
    data-slot="sheet-title"
    :class="cn('font-display text-2xl font-semibold text-forest-900', props.class)"
  >
    <slot />
  </DialogTitle>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { DialogTitle } from "reka-ui";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
