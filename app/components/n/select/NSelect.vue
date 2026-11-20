<template>
  <div data-slot="select" :class="cn('relative', props.class)">
    <select
      v-model="model"
      :aria-invalid="invalid || undefined"
      :class="
        cn(
          'h-12 w-full cursor-pointer appearance-none rounded-xl border bg-base-0 pr-11 pl-4 text-base text-base-900 transition-colors',
          invalid ? 'border-red-600' : 'border-base-500 hover:border-base-600',
        )
      "
      v-bind="$attrs"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <NIcon
      name="caretDown"
      class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-base-550"
    />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

export interface SelectOption {
  value: string;
  label: string;
}

/** A styled native <select>: native keyboard and screen-reader behaviour for free. */
defineOptions({ inheritAttrs: false });
const props = defineProps<{
  options: SelectOption[];
  placeholder?: string;
  invalid?: boolean;
  class?: HTMLAttributes["class"];
}>();
const model = defineModel<string>();
</script>
