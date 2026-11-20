<template>
  <fieldset data-slot="choice-group" :class="cn('flex flex-col gap-2', props.class)">
    <legend class="mb-1.5 text-sm font-bold text-base-900">{{ legend }}</legend>
    <div class="flex flex-wrap gap-2">
      <label v-for="option in options" :key="option.value" class="relative">
        <input
          v-model="model"
          type="radio"
          :name="name"
          :value="option.value"
          class="peer sr-only"
        />
        <span
          class="flex min-h-11 cursor-pointer items-center rounded-full border border-base-500 bg-base-0 px-4 text-sm font-bold text-base-900 transition-colors peer-checked:border-forest-500 peer-checked:bg-forest-500 peer-checked:text-base-0 peer-focus-visible:shadow-[0_0_0_2px_var(--base-50),0_0_0_5px_var(--accent-600)] hover:border-forest-500"
        >
          {{ option.label }}
        </span>
      </label>
    </div>
    <p v-if="error" role="alert" class="text-sm font-medium text-red-600">{{ error }}</p>
  </fieldset>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

/** Radio buttons styled as pills, in a real fieldset/legend. Arrow keys move between options. */
const props = defineProps<{
  legend: string;
  name: string;
  options: { value: string; label: string }[];
  error?: string;
  class?: HTMLAttributes["class"];
}>();
const model = defineModel<string>();
</script>
