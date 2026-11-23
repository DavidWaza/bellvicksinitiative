<template>
  <fieldset data-slot="choice-group" :class="cn('flex flex-col gap-2', props.class)">
    <legend
      :class="
        hasDescriptions
          ? 'font-display mb-2 text-xl font-semibold text-forest-900'
          : 'mb-1.5 text-sm font-bold text-base-900'
      "
    >
      {{ legend }}
    </legend>

    <!-- Cards: options with a description (and optionally an icon) -->
    <div v-if="hasDescriptions" class="grid gap-3 sm:grid-cols-2">
      <label v-for="option in options" :key="option.value" class="group relative flex">
        <input
          v-model="model"
          type="radio"
          :name="name"
          :value="option.value"
          class="peer sr-only"
        />
        <span
          class="flex w-full cursor-pointer items-start gap-4 rounded-3xl border-2 border-base-150 bg-base-0 p-5 pr-12 sm:flex-col sm:gap-3 sm:pr-5 shadow-soft transition-[border-color,background-color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:border-forest-150 peer-checked:border-forest-500 peer-checked:bg-forest-50 peer-focus-visible:shadow-[0_0_0_2px_var(--base-50),0_0_0_5px_var(--accent-600)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
        >
          <NIconBlob v-if="option.icon" :icon="option.icon" :tone="option.tone" class="size-14" />
          <span class="flex flex-col gap-1">
            <span class="font-display text-lg leading-tight font-semibold text-forest-900">{{
              option.label
            }}</span>
            <span class="text-sm leading-relaxed text-base-550">{{ option.description }}</span>
          </span>
        </span>
        <!-- Selection mark: empty ring, then a filled tick -->
        <span
          aria-hidden="true"
          class="absolute top-4 right-4 flex size-7 items-center justify-center rounded-full border-2 border-base-150 bg-base-0 text-transparent transition-colors peer-checked:border-forest-500 peer-checked:bg-forest-500 peer-checked:text-base-0"
        >
          <NIcon name="check" size="1rem" />
        </span>
      </label>
    </div>

    <!-- Pills -->
    <div v-else class="flex flex-wrap gap-2">
      <label v-for="option in options" :key="option.value" class="relative">
        <input
          v-model="model"
          type="radio"
          :name="name"
          :value="option.value"
          class="peer sr-only"
        />
        <span
          class="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-base-500 bg-base-0 px-4 text-sm font-bold text-base-900 transition-colors peer-checked:border-forest-500 peer-checked:bg-forest-500 peer-checked:text-base-0 peer-focus-visible:shadow-[0_0_0_2px_var(--base-50),0_0_0_5px_var(--accent-600)] hover:border-forest-500"
        >
          <NIcon v-if="option.icon" :name="option.icon" size="1.15rem" />
          {{ option.label }}
        </span>
      </label>
    </div>
    <p v-if="error" role="alert" class="text-sm font-medium text-red-600">{{ error }}</p>
  </fieldset>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { IconName } from "~/utils/icons";
import type { Tone } from "~/utils/tones";

/**
 * Radio buttons in a real fieldset/legend; arrow keys move between options. Pills by default;
 * options with a `description` render as cards (with an icon blob if `icon` is set); a pill shows
 * its `icon` before the label.
 */
const props = defineProps<{
  legend: string;
  name: string;
  options: { value: string; label: string; description?: string; icon?: IconName; tone?: Tone }[];
  error?: string;
  class?: HTMLAttributes["class"];
}>();
const model = defineModel<string>();
const hasDescriptions = computed(() => props.options.some((o) => o.description));
</script>
