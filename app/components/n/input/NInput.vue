<template>
  <input
    v-model="model"
    data-slot="input"
    :aria-invalid="invalid || undefined"
    :class="
      cn(
        'h-12 w-full rounded-xl border bg-base-0 px-4 text-base text-base-900 placeholder:text-base-500 transition-colors',
        invalid ? 'border-red-600' : 'border-base-500 hover:border-base-600',
        props.class,
      )
    "
  />
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{ invalid?: boolean; class?: HTMLAttributes["class"] }>();
const model = defineModel<string>();
</script>
