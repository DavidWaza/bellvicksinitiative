<template>
  <div data-slot="field" :class="cn('flex flex-col gap-1.5', props.class)">
    <label :for="id" class="text-sm font-bold text-base-900">
      {{ label }}
      <span v-if="optional" class="font-normal text-base-550">(optional)</span>
    </label>
    <slot :id="id" :describedby="describedby" :invalid="Boolean(error)" />
    <p v-if="hint && !error" :id="`${id}-hint`" class="text-sm text-base-550">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" role="alert" class="text-sm font-medium text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

/**
 * Label + control + hint/error wiring. The control comes in through the slot and receives the
 * generated `id`, an `aria-describedby` value and an `invalid` flag. Pair with vee-validate's
 * `defineField` / `errors`.
 */
const props = defineProps<{
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  class?: HTMLAttributes["class"];
}>();

const id = useId();
const describedby = computed(() =>
  props.error ? `${id}-error` : props.hint ? `${id}-hint` : undefined,
);
</script>
