<template>
  <DialogDescription data-slot="sheet-description" :class="cn('text-base-550', props.class)">
    <slot />
  </DialogDescription>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { DialogDescription } from "reka-ui";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
