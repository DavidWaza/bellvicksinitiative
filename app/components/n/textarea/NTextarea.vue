<template>
  <textarea
    v-model="model"
    data-slot="textarea"
    :rows="rows"
    :aria-invalid="invalid || undefined"
    :class="
      cn(
        'w-full rounded-xl border bg-base-0 px-4 py-3 text-base text-base-900 transition-colors placeholder:text-base-500',
        invalid ? 'border-red-600' : 'border-base-500 hover:border-base-600',
        props.class,
      )
    "
  />
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<{ invalid?: boolean; rows?: number; class?: HTMLAttributes["class"] }>(),
  { rows: 5 },
);
const model = defineModel<string>();
</script>
